/* WebDev Atlas — simulator networking: http module, request dispatcher, fetch() interception,
 * a tiny JSONPlaceholder mock, and the shared request-tester UI. Requires sim-core.js. */
(function (G) {
  'use strict';
  var sim = G.__sim, EventEmitter = sim.EventEmitter, Buffer = sim.Buffer, post = sim.post;

  var STATUS = { 100: 'Continue', 101: 'Switching Protocols', 200: 'OK', 201: 'Created', 202: 'Accepted', 204: 'No Content', 206: 'Partial Content', 301: 'Moved Permanently', 302: 'Found', 303: 'See Other', 304: 'Not Modified', 307: 'Temporary Redirect', 308: 'Permanent Redirect', 400: 'Bad Request', 401: 'Unauthorized', 402: 'Payment Required', 403: 'Forbidden', 404: 'Not Found', 405: 'Method Not Allowed', 406: 'Not Acceptable', 408: 'Request Timeout', 409: 'Conflict', 410: 'Gone', 413: 'Payload Too Large', 415: 'Unsupported Media Type', 418: "I'm a Teapot", 422: 'Unprocessable Entity', 429: 'Too Many Requests', 500: 'Internal Server Error', 501: 'Not Implemented', 502: 'Bad Gateway', 503: 'Service Unavailable', 504: 'Gateway Timeout' };
  sim.STATUS = STATUS;
  var METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

  /* ───────────── IncomingMessage / ServerResponse ───────────── */
  class IncomingMessage extends EventEmitter {
    constructor(o) {
      super(); o = o || {};
      this.method = o.method || 'GET'; this.url = o.url || '/'; this.headers = o.headers || {}; this.httpVersion = '1.1'; this.httpVersionMajor = 1; this.httpVersionMinor = 1;
      this.statusCode = o.statusCode; this.statusMessage = o.statusMessage; this.complete = false; this.readable = true;
      this.socket = this.connection = { remoteAddress: '127.0.0.1', remotePort: 54321, encrypted: false, destroy: function () { } };
      this.rawHeaders = []; var self = this; Object.keys(this.headers).forEach(function (k) { self.rawHeaders.push(k, self.headers[k]); });
      this._body = o.body || ''; this._enc = null;
    }
    setEncoding(e) { this._enc = e; return this; }
    _feed() {
      var self = this;
      setTimeout(function () {
        if (self._body) self.emit('data', self._enc ? String(self._body) : Buffer.from(self._body));
        self.complete = true; self.readable = false; self.emit('end'); self.emit('close');
      }, 0);
    }
    on(n, f) { EventEmitter.prototype.on.call(this, n, f); return this; }
    resume() { return this; } pause() { return this; }
    destroy() { return this; }
    [Symbol.asyncIterator]() { var d = false, b = this._body; return { next: function () { if (d || !b) { d = true; return Promise.resolve({ done: true }); } d = true; return Promise.resolve({ value: Buffer.from(b), done: false }); }, [Symbol.asyncIterator]: function () { return this; } }; }
  }
  class ServerResponse extends EventEmitter {
    constructor(req) {
      super(); this.req = req; this.statusCode = 200; this.statusMessage = undefined; this._h = {}; this._names = {}; this._chunks = []; this.headersSent = false; this.finished = false; this.writableEnded = false; this.writableFinished = false; this.writable = true;
      this.socket = req && req.socket; this.sendDate = true;
    }
    setHeader(n, v) { var k = String(n).toLowerCase(); this._h[k] = v; this._names[k] = n; return this; }
    appendHeader(n, v) { var k = String(n).toLowerCase(); this._h[k] = k in this._h ? [].concat(this._h[k], v) : v; this._names[k] = n; return this; }
    getHeader(n) { return this._h[String(n).toLowerCase()]; }
    getHeaders() { return Object.assign({}, this._h); }
    getHeaderNames() { return Object.keys(this._h); }
    hasHeader(n) { return String(n).toLowerCase() in this._h; }
    removeHeader(n) { delete this._h[String(n).toLowerCase()]; }
    writeHead(code, msg, hdrs) {
      if (this.headersSent) throw new Error('ERR_HTTP_HEADERS_SENT: Cannot write headers after they are sent to the client');
      this.statusCode = code; if (typeof msg === 'string') this.statusMessage = msg; else hdrs = msg;
      if (hdrs) { var self = this; if (Array.isArray(hdrs)) { for (var i = 0; i < hdrs.length; i += 2) self.setHeader(hdrs[i], hdrs[i + 1]); } else Object.keys(hdrs).forEach(function (k) { self.setHeader(k, hdrs[k]); }); }
      return this;
    }
    flushHeaders() { this.headersSent = true; }
    write(c, enc, cb) { if (this.writableEnded) { var e = new Error('write after end'); e.code = 'ERR_STREAM_WRITE_AFTER_END'; throw e; } this.headersSent = true; if (c !== undefined && c !== null) this._chunks.push(typeof c === 'string' ? Buffer.from(c, typeof enc === 'string' ? enc : 'utf8') : Buffer.from(c)); var f = typeof enc === 'function' ? enc : cb; if (f) f(); return true; }
    end(c, enc, cb) {
      if (typeof c === 'function') { cb = c; c = null; } if (typeof enc === 'function') { cb = enc; }
      if (this.writableEnded) return this;
      if (c !== undefined && c !== null) this.write(c, enc);
      this.headersSent = true; this.finished = this.writableEnded = true;
      var self = this; setTimeout(function () { self.writableFinished = true; self.emit('finish'); self.emit('close'); if (cb) cb(); }, 0);
      if (this._done) this._done(this);
      return this;
    }
    setTimeout() { return this; } cork() { } uncork() { } addTrailers() { } destroy() { return this; }
    get bodyBuffer() { return Buffer.concat(this._chunks); }
  }
  sim.IncomingMessage = IncomingMessage; sim.ServerResponse = ServerResponse;

  function normHeaders(h) { var o = {}; Object.keys(h || {}).forEach(function (k) { o[k.toLowerCase()] = h[k]; }); return o; }
  function ctypeIsText(t) { return !t || /text|json|xml|javascript|html|urlencoded|svg/i.test(t); }

  /* Runs a Node-style (req,res) handler against a synthetic request and resolves with a plain result object. */
  sim.handle = function (handler, method, urlPath, headers, body, port) {
    return new Promise(function (resolve) {
      var t0 = performance.now(), settled = false;
      var hs = normHeaders(headers);
      if (!hs.host) hs.host = 'localhost:' + (port || 3000);
      if (!hs['user-agent']) hs['user-agent'] = 'WebDevAtlas-Playground/1.0';
      if (!hs.accept) hs.accept = '*/*';
      if (body && !hs['content-length']) hs['content-length'] = String(Buffer.byteLength(body));
      var req = new IncomingMessage({ method: method, url: urlPath, headers: hs, body: body || '' });
      var res = new ServerResponse(req);
      function finish(r) {
        if (settled) return; settled = true; clearTimeout(timer);
        var out = {}; Object.keys(r._h).forEach(function (k) { if (k === 'set-cookie') return; out[k] = Array.isArray(r._h[k]) ? r._h[k].join(', ') : String(r._h[k]); });
        var buf = r.bodyBuffer, ct = out['content-type'] || '';
        resolve({ status: r.statusCode, statusText: r.statusMessage || STATUS[r.statusCode] || '', headers: out, setCookie: [].concat(r._h['set-cookie'] || []), body: ctypeIsText(ct) ? buf.toString() : '[' + buf.length + ' bytes of binary data]', bytes: buf.length, ms: performance.now() - t0 });
      }
      res._done = finish;
      var timer = setTimeout(function () {
        if (settled) return; settled = true;
        resolve({ status: 504, statusText: 'Gateway Timeout', headers: { 'content-type': 'text/plain' }, setCookie: [], body: 'The handler never ended the response (res.end / res.send / res.json was not called within 8 s).', bytes: 0, ms: performance.now() - t0, hung: true });
      }, 8000);
      try {
        var r = handler(req, res);
        if (r && typeof r.catch === 'function') r.catch(function (e) { fail(e); });
      } catch (e) { fail(e); }
      req._feed();
      function fail(e) {
        if (e && e.__procExit) return;
        post('e', (e && e.stack ? String(e.stack).split('\n').slice(0, 4).join('\n') : String(e)));
        if (!res.headersSent) { res.statusCode = 500; res.setHeader('content-type', 'text/plain; charset=utf-8'); res.end('Internal Server Error\n\n' + (e && e.message ? e.message : e)); } else res.end();
      }
    });
  };

  /* ───────────── servers & dispatch ───────────── */
  sim.servers = {};
  sim.defaultHandler = null;
  var LOCAL = /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\]|::1)$/i;
  function parseTarget(u) {
    var base = 'http://localhost:' + (Object.keys(sim.servers)[0] || 3000);
    var url; try { url = new URL(u, base); } catch (e) { return null; }
    return url;
  }
  function isLocal(u) { if (typeof u === 'string' && /^(\/(?!\/)|\.\/|\?|#|[^:/]*$)/.test(u)) return true; var url = parseTarget(u); return !!url && LOCAL.test(url.hostname); }
  sim.isLocal = isLocal;

  sim.jar = {};
  function jarHeader() { return Object.keys(sim.jar).map(function (k) { return k + '=' + sim.jar[k]; }).join('; '); }
  function jarUpdate(list) {
    (list || []).forEach(function (c) {
      var parts = String(c).split(';'), nv = parts[0], i = nv.indexOf('='); if (i < 0) return;
      var name = nv.slice(0, i).trim(), val = nv.slice(i + 1), expired = false;
      parts.slice(1).forEach(function (a) { var kv = a.trim().split('='), k = kv[0].toLowerCase(); if (k === 'max-age' && parseInt(kv[1], 10) <= 0) expired = true; if (k === 'expires' && Date.parse(kv.slice(1).join('=')) < Date.now()) expired = true; });
      if (expired) delete sim.jar[name]; else sim.jar[name] = val;
    });
  }
  sim.dispatch = function (method, u, headers, body) {
    headers = normHeaders(headers);
    if (!headers.cookie) { var jh = jarHeader(); if (jh) headers.cookie = jh; }
    return dispatchRaw(method, u, headers, body).then(function (r) { jarUpdate(r.setCookie); return r; });
  };
  function dispatchRaw(method, u, headers, body) {
    var url = parseTarget(u);
    if (!url) return Promise.reject(new TypeError('Invalid URL: ' + u));
    if (sim.dispatcher) return sim.dispatcher(method, url, headers || {}, body || '');
    var port = url.port || (Object.keys(sim.servers)[0]) || 80, srv = sim.servers[port];
    if (url.port === '' && url.protocol === 'http:' && !sim.servers[80]) srv = sim.servers[Object.keys(sim.servers)[0]];
    var handler = srv ? srv.handler : (Object.keys(sim.servers).length === 0 ? sim.defaultHandler : null);
    if (!handler) {
      var e = new Error('connect ECONNREFUSED 127.0.0.1:' + (url.port || 80) + ' — no server is listening there. Did you call app.listen(' + (url.port || 3000) + ')?');
      e.code = 'ECONNREFUSED'; return Promise.reject(e);
    }
    return sim.handle(handler, method, url.pathname + url.search, headers, body, port);
  }

  /* ───────────── http module ───────────── */
  function Server(handler) {
    EventEmitter.call(this); var self = this; this.listening = false; this._port = null; this.timeout = 0; this.keepAliveTimeout = 5000;
    if (handler) this.on('request', handler);
    this._handler = function (req, res) { if (!self.emit('request', req, res)) { res.statusCode = 404; res.end(); } };
  }
  Server.prototype = Object.create(EventEmitter.prototype); Server.prototype.constructor = Server;
  Server.prototype.listen = function () {
    var a = Array.prototype.slice.call(arguments), cb = typeof a[a.length - 1] === 'function' ? a.pop() : null, self = this;
    var port = typeof a[0] === 'object' && a[0] ? a[0].port : a[0]; port = Number(port);
    if (!port && port !== 0) port = 3000;
    if (port === 0) port = 3000 + Object.keys(sim.servers).length;
    if (sim.servers[port]) {
      var e = new Error('listen EADDRINUSE: address already in use :::' + port); e.code = 'EADDRINUSE'; e.errno = -98; e.syscall = 'listen'; e.port = port;
      setTimeout(function () { if (self.listenerCount('error')) self.emit('error', e); else post('e', 'Error: ' + e.message + '\n    (another server in this run already uses port ' + port + ')'); }, 0);
      return this;
    }
    this._port = port; this.listening = true; sim.servers[port] = { handler: this._handler, server: this };
    setTimeout(function () { self.emit('listening'); if (cb) cb(); if (sim.onListen) sim.onListen(port, self); }, 0);
    return this;
  };
  Server.prototype.close = function (cb) { if (this._port !== null) { delete sim.servers[this._port]; } this.listening = false; var self = this; setTimeout(function () { self.emit('close'); if (cb) cb(); if (sim.onClose) sim.onClose(self._port); }, 0); return this; };
  Server.prototype.address = function () { return this._port === null ? null : { address: '::', family: 'IPv6', port: this._port }; };
  Server.prototype.setTimeout = function () { return this; };
  Server.prototype.closeAllConnections = Server.prototype.unref = Server.prototype.ref = function () { return this; };
  sim.Server = Server;

  function ClientRequest(o, cb) {
    EventEmitter.call(this); var self = this; this._chunks = []; this._o = o; this.method = o.method; this.path = o.path; this._headers = normHeaders(o.headers); if (cb) this.once('response', cb);
    this.destroyed = false; this.aborted = false; this._ended = false;
  }
  ClientRequest.prototype = Object.create(EventEmitter.prototype);
  ClientRequest.prototype.setHeader = function (n, v) { this._headers[String(n).toLowerCase()] = v; return this; };
  ClientRequest.prototype.getHeader = function (n) { return this._headers[String(n).toLowerCase()]; };
  ClientRequest.prototype.removeHeader = function (n) { delete this._headers[String(n).toLowerCase()]; };
  ClientRequest.prototype.write = function (c) { this._chunks.push(String(c)); return true; };
  ClientRequest.prototype.setTimeout = function () { return this; };
  ClientRequest.prototype.abort = ClientRequest.prototype.destroy = function () { this.destroyed = true; this.aborted = true; return this; };
  ClientRequest.prototype.end = function (c) {
    if (this._ended) return this; this._ended = true; var self = this;
    if (c && typeof c !== 'function') this.write(c);
    var o = this._o, body = this._chunks.join('');
    var url = (o.protocol || 'http:') + '//' + (o.hostname || 'localhost') + (o.port ? ':' + o.port : '') + (o.path || '/');
    Promise.resolve(sim.isLocal(url) ? sim.dispatch(o.method || 'GET', url, this._headers, body) : G.fetch(url, { method: o.method, headers: this._headers, body: body || undefined }).then(function (r) { return r.text().then(function (t) { var h = {}; r.headers.forEach(function (v, k) { h[k] = v; }); return { status: r.status, statusText: r.statusText, headers: h, body: t }; }); }))
      .then(function (r) {
        if (self.destroyed) return;
        var res = new IncomingMessage({ statusCode: r.status, statusMessage: r.statusText, headers: r.headers, body: r.body });
        self.emit('response', res); res._feed();
      })
      .catch(function (e) { self.emit('error', e); });
    return this;
  };
  function reqOpts(a, b) {
    var o;
    if (typeof a === 'string' || a instanceof URL) { var u = new URL(String(a), 'http://localhost'); o = { protocol: u.protocol, hostname: u.hostname, port: u.port, path: u.pathname + u.search }; if (b && typeof b === 'object') Object.assign(o, b); }
    else o = Object.assign({}, a); if (o.host && !o.hostname) o.hostname = o.host;
    o.method = (o.method || 'GET').toUpperCase(); return o;
  }
  function makeHttp() {
    var mod = {
      createServer: function (o, h) { return new Server(typeof o === 'function' ? o : h); },
      request: function (a, b, c) { var cb = typeof b === 'function' ? b : c; return new ClientRequest(reqOpts(a, typeof b === 'object' ? b : undefined), cb); },
      get: function () { var r = mod.request.apply(null, arguments); r.end(); return r; },
      STATUS_CODES: STATUS, METHODS: METHODS, Server: Server, IncomingMessage: IncomingMessage, ServerResponse: ServerResponse, ClientRequest: ClientRequest,
      Agent: function () { }, globalAgent: {}, maxHeaderSize: 16384
    };
    return mod;
  }
  var http = makeHttp();
  sim.register('http', http); sim.register('https', http); sim.register('http2', http);

  /* ───────────── JSONPlaceholder mock ───────────── */
  var NAMES = ['Leanne Graham', 'Ervin Howell', 'Clementine Bauch', 'Patricia Lebsack', 'Chelsey Dietrich', 'Mrs. Dennis Schulist', 'Kurtis Weissnat', 'Nicholas Runolfsdottir V', 'Glenna Reichert', 'Clementina DuBuque'];
  var UNAMES = ['Bret', 'Antonette', 'Samantha', 'Karianne', 'Kamren', 'Leopoldo_Corkery', 'Elwyn.Skiles', 'Maxime_Nienow', 'Delphine', 'Moriah.Stanton'];
  var WORDS = ['sunt aut facere repellat', 'qui est esse', 'ea molestias quasi exercitationem', 'eum et est occaecati', 'nesciunt quas odio', 'dolorem eum magni eos', 'magnam facilis autem', 'dolorem dolore est ipsam', 'nesciunt iure omnis dolorem', 'optio molestias id quia'];
  var BODY = 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto';
  var DB = {
    users: Array.from({ length: 10 }, function (_, i) { return { id: i + 1, name: NAMES[i], username: UNAMES[i], email: UNAMES[i].replace(/[^a-z]/gi, '') + '@example.com', address: { street: 'Kulas Light', suite: 'Apt. ' + (i + 556), city: 'Gwenborough', zipcode: '9299' + i + '-3874', geo: { lat: '-37.3159', lng: '81.1496' } }, phone: '1-770-736-' + (8031 + i), website: UNAMES[i].toLowerCase() + '.org', company: { name: 'Romaguera-Crona', catchPhrase: 'Multi-layered client-server neural-net', bs: 'harness real-time e-markets' } }; }),
    posts: Array.from({ length: 100 }, function (_, i) { return { userId: Math.floor(i / 10) + 1, id: i + 1, title: WORDS[i % 10] + (i >= 10 ? ' ' + (i + 1) : ''), body: BODY }; }),
    comments: Array.from({ length: 500 }, function (_, i) { return { postId: Math.floor(i / 5) + 1, id: i + 1, name: 'id labore ex et quam laborum', email: 'Eliseo@gardner.biz', body: 'laudantium enim quasi est quidem magnam voluptate ipsam eos' }; }),
    todos: Array.from({ length: 200 }, function (_, i) { return { userId: Math.floor(i / 20) + 1, id: i + 1, title: i % 2 ? 'quis ut nam facilis et officia qui' : 'delectus aut autem', completed: i % 3 === 0 }; }),
    albums: Array.from({ length: 100 }, function (_, i) { return { userId: Math.floor(i / 10) + 1, id: i + 1, title: 'quidem molestiae enim ' + (i + 1) }; })
  };
  function mockApi(method, url, body) {
    var parts = url.pathname.split('/').filter(Boolean), col = parts[0], data = DB[col];
    var json = function (v, status) { return { status: status || 200, statusText: STATUS[status || 200], headers: { 'content-type': 'application/json; charset=utf-8' }, body: JSON.stringify(v, null, 2) }; };
    if (!data) return json({}, 404);
    var parsed = {}; try { parsed = body ? JSON.parse(body) : {}; } catch (e) { /* form body */ }
    if (parts.length === 1) {
      if (method === 'POST') return json(Object.assign({}, parsed, { id: data.length + 1 }), 201);
      var q = url.searchParams, out = data.filter(function (r) { var ok = true; q.forEach(function (v, k) { if (k[0] !== '_' && String(r[k]) !== v) ok = false; }); return ok; });
      if (q.get('_limit')) out = out.slice(Number(q.get('_start') || 0), Number(q.get('_start') || 0) + Number(q.get('_limit')));
      return json(out);
    }
    var id = Number(parts[1]), item = data.filter(function (r) { return r.id === id; })[0];
    if (parts[2] && DB[parts[2]]) { var fk = col.replace(/s$/, '') + 'Id'; return json(DB[parts[2]].filter(function (r) { return r[fk] === id; })); }
    if (!item) return json({}, 404);
    if (method === 'DELETE') return json({});
    if (method === 'PUT' || method === 'PATCH') return json(Object.assign({}, method === 'PUT' ? {} : item, parsed, { id: id }));
    return json(item);
  }
  sim.mockApi = mockApi;

  /* A generic REST API for the fictional hosts used all over the lessons (api.example.com, myapp.com …). */
  var GEN_HOST = /^(?:[\w-]+\.)*(?:example\.(?:com|org|net)|myapp\.com|yourapp\.com|mysite\.com|yoursite\.com|yourdomain\.com|webdevatlas\.dev|acme\.com)$/i;
  var GEN_SEED = {
    users: function (i) { return { id: i, name: NAMES[(i - 1) % NAMES.length], email: UNAMES[(i - 1) % UNAMES.length].toLowerCase().replace(/[^a-z]/g, '') + '@example.com', role: i === 1 ? 'admin' : 'user', active: i % 4 !== 0 }; },
    products: function (i) { return { id: i, name: ['Laptop', 'Mouse', 'Keyboard', 'Monitor', 'Headphones', 'Webcam'][(i - 1) % 6], price: [999.99, 19.99, 49.5, 189.9, 79, 59.99][(i - 1) % 6], category: i % 2 ? 'electronics' : 'accessories', in_stock: i % 3 !== 0 }; },
    posts: function (i) { return { id: i, title: 'Post number ' + i, body: 'Lorem ipsum dolor sit amet.', userId: (i % 3) + 1, published: i % 2 === 1 }; },
    comments: function (i) { return { id: i, postId: ((i - 1) % 3) + 1, author: NAMES[i % NAMES.length], text: 'Comment ' + i }; },
    orders: function (i) { return { id: i, userId: ((i - 1) % 3) + 1, total: 20 * i + 0.99, status: ['pending', 'shipped', 'delivered'][(i - 1) % 3] }; },
    todos: function (i) { return { id: i, title: 'Todo ' + i, completed: i % 2 === 0 }; },
    articles: function (i) { return { id: i, title: 'Article ' + i, author: NAMES[i % NAMES.length], views: i * 100 }; },
    books: function (i) { return { id: i, title: 'Book ' + i, author: NAMES[i % NAMES.length], year: 2000 + i }; },
    tasks: function (i) { return { id: i, title: 'Task ' + i, done: i % 2 === 0, priority: ['low', 'medium', 'high'][(i - 1) % 3] }; }
  };
  var genStore = {};
  function genCollection(name) {
    if (!genStore[name]) { var mk = GEN_SEED[name] || function (i) { return { id: i, name: 'Item ' + i }; }; genStore[name] = { next: 6, rows: [1, 2, 3, 4, 5].map(mk) }; }
    return genStore[name];
  }
  function mockGeneric(method, url, body, headers) {
    var hs = normHeaders(headers), J = { 'content-type': 'application/json; charset=utf-8', 'x-request-id': Math.random().toString(16).slice(2, 10) };
    var res = function (status, data, extra) { return { status: status, statusText: STATUS[status] || '', headers: Object.assign({}, J, extra || {}), body: data === undefined ? '' : JSON.stringify(data, null, 2) }; };
    var segs = url.pathname.split('/').filter(Boolean).filter(function (s) { return !/^(v\d+|api)$/i.test(s); });
    if (!segs.length) return res(200, { name: 'Example API', version: '1.0.0', status: 'ok' });
    var first = segs[0].toLowerCase();
    if (first === 'health' || first === 'status' || first === 'ping') return res(200, { status: 'ok', uptime: 12345 });
    if (first === 'login' || first === 'auth' || first === 'token') return res(200, { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIn0.sig', expires_in: 3600 });
    if ((first === 'me' || first === 'admin' || first === 'account' || first === 'profile') && !hs.authorization) return res(401, { error: 'Unauthorized', message: 'Missing Authorization header' }, { 'www-authenticate': 'Bearer' });
    if (first === 'me' || first === 'profile') return res(200, GEN_SEED.users(1));
    var col = genCollection(first), id = segs[1], parsed = null;
    if (body && /^(POST|PUT|PATCH)$/.test(method)) { try { parsed = JSON.parse(body); } catch (e) { return res(400, { error: 'Bad Request', message: 'Invalid JSON body' }); } }
    if (segs.length === 1) {
      if (method === 'GET' || method === 'HEAD') {
        var rows = col.rows.slice(), q = url.searchParams;
        q.forEach(function (v, k) { if (/^(page|limit|per_page|sort|order|q|_limit|_page|fields|offset)$/.test(k)) return; rows = rows.filter(function (r) { return String(r[k]) === v; }); });
        if (q.get('q')) rows = rows.filter(function (r) { return JSON.stringify(r).toLowerCase().indexOf(q.get('q').toLowerCase()) >= 0; });
        if (q.get('sort')) { var sk = q.get('sort'), desc = sk[0] === '-', f = sk.replace(/^[-+]/, ''); rows.sort(function (a, b) { return (a[f] > b[f] ? 1 : a[f] < b[f] ? -1 : 0) * (desc ? -1 : 1); }); }
        var lim = +(q.get('limit') || q.get('per_page') || q.get('_limit') || 0), pg = +(q.get('page') || q.get('_page') || 1), total = rows.length; if (lim) rows = rows.slice((pg - 1) * lim, pg * lim);
        return res(200, rows, { 'x-total-count': String(total) });
      }
      if (method === 'POST') { if (!parsed || !Object.keys(parsed).length) return res(422, { error: 'Unprocessable Entity', message: 'Request body is required' }); var row = Object.assign({ id: col.next++ }, parsed); col.rows.push(row); return res(201, row, { location: '/' + first + '/' + row.id }); }
      if (method === 'OPTIONS') return res(204, undefined, { allow: 'GET, POST, OPTIONS' });
      return res(405, { error: 'Method Not Allowed' }, { allow: 'GET, POST' });
    }
    var item = col.rows.filter(function (r) { return String(r.id) === String(id); })[0];
    if (!item) return res(404, { error: 'Not Found', message: first + '/' + id + ' does not exist' });
    if (segs.length > 2) { var sub = genCollection(segs[2].toLowerCase()); return res(200, sub.rows.slice(0, 3)); }
    if (method === 'GET' || method === 'HEAD') return res(200, item);
    if (method === 'PUT') { var np = Object.assign({ id: item.id }, parsed || {}); col.rows[col.rows.indexOf(item)] = np; return res(200, np); }
    if (method === 'PATCH') { Object.assign(item, parsed || {}); return res(200, item); }
    if (method === 'DELETE') { col.rows.splice(col.rows.indexOf(item), 1); return { status: 204, statusText: 'No Content', headers: { 'x-request-id': J['x-request-id'] }, body: '' }; }
    return res(405, { error: 'Method Not Allowed' }, { allow: 'GET, PUT, PATCH, DELETE' });
  }
  sim.mockGeneric = mockGeneric; sim.GEN_HOST = GEN_HOST;

  /* ───────────── fetch() interception ───────────── */
  var realFetch = G.fetch ? G.fetch.bind(G) : null;
  function toResponse(r, url) {
    var noBody = r.status === 204 || r.status === 205 || r.status === 304 || r.status < 200;
    var h = new Headers(); Object.keys(r.headers || {}).forEach(function (k) { try { h.append(k, r.headers[k]); } catch (e) { /* forbidden name */ } });
    var resp = new Response(noBody || r.method === 'HEAD' ? null : r.body, { status: r.status, statusText: r.statusText, headers: h });
    try { Object.defineProperty(resp, 'url', { value: url }); } catch (e) { /* readonly */ }
    return resp;
  }
  G.fetch = function (input, init) {
    init = init || {};
    var isReq = typeof Request !== 'undefined' && input instanceof Request;
    var u = isReq ? input.url : (input && input.href) || String(input);
    var method = String(init.method || (isReq ? input.method : 'GET')).toUpperCase();
    var headers = {}; new Headers(init.headers || (isReq ? input.headers : undefined)).forEach(function (v, k) { headers[k] = v; });
    var bodyP = init.body !== undefined ? Promise.resolve(init.body) : (isReq && !/^(GET|HEAD)$/.test(method) ? input.text() : Promise.resolve(undefined));
    return bodyP.then(function (b) {
      var body = b;
      if (b instanceof URLSearchParams) { body = b.toString(); if (!headers['content-type']) headers['content-type'] = 'application/x-www-form-urlencoded;charset=UTF-8'; }
      else if (b instanceof Uint8Array) body = Buffer.from(b).toString();
      else if (b !== undefined && b !== null && typeof b !== 'string') { if (typeof FormData !== 'undefined' && b instanceof FormData) { var o = {}; b.forEach(function (v, k) { o[k] = typeof v === 'string' ? v : '[file]'; }); body = JSON.stringify(o); } else body = String(b); }
      if (typeof body === 'string' && typeof init.body === 'string' && !headers['content-type']) headers['content-type'] = 'text/plain;charset=UTF-8';
      var abs = u;
      try {
        var pu = parseTarget(u);
        if (pu && /^https?:\/\/jsonplaceholder\.typicode\.com$/i.test(pu.origin)) { var r0 = mockApi(method, pu, body); r0.method = method; return new Promise(function (res) { setTimeout(function () { res(toResponse(r0, pu.href)); }, 60); }); }
        if (pu && !LOCAL.test(pu.hostname) && (GEN_HOST.test(pu.hostname) || !/(^|\.)(jsdelivr\.net|unpkg\.com|cloudflare\.com|localhost)$/i.test(pu.hostname))) { var r1 = mockGeneric(method, pu, body, headers); r1.method = method; return new Promise(function (res) { setTimeout(function () { res(toResponse(r1, pu.href)); }, 40); }); }
        if (pu) abs = pu.href;
      } catch (e) { /* fall through */ }
      // A browser-style relative fetch('/api/users') in a snippet that never starts a server: answer it from the sample REST API.
      if (typeof u === 'string' && /^\/(?!\/)/.test(u) && !(sim.apps && sim.apps.length) && !Object.keys(sim.servers || {}).length) {
        var pu2 = parseTarget('https://api.example.com' + u);
        if (pu2) { var r2 = mockGeneric(method, pu2, body, headers); r2.method = method; return new Promise(function (res) { setTimeout(function () { res(toResponse(r2, pu2.href)); }, 40); }); }
      }
      if (isLocal(u)) {
        return sim.dispatch(method, u, headers, body).then(function (r) { r.method = method; return toResponse(r, abs); }, function (e) { var te = new TypeError('fetch failed'); te.cause = e; post('e', 'TypeError: fetch failed\n    [cause]: ' + e.message); throw te; });
      }
      if (!realFetch) throw new TypeError('fetch is not available');
      return realFetch(input, init).catch(function (e) {
        var te = new TypeError('fetch failed'); te.cause = e;
        post('e', 'TypeError: fetch failed — the playground sandbox only reaches its own local server and jsonplaceholder.typicode.com (' + u + ' is blocked).');
        throw te;
      });
    });
  };

  /* ───────────── UI: shared request tester ───────────── */
  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') el.className = attrs[k]; else if (k === 'text') el.textContent = attrs[k]; else if (k === 'html') el.innerHTML = attrs[k];
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), attrs[k]); else if (attrs[k] !== undefined && attrs[k] !== null) el.setAttribute(k, attrs[k]);
    });
    for (var i = 2; i < arguments.length; i++) { var c = arguments[i]; if (c === null || c === undefined || c === false) continue; el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); }
    return el;
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function colorJson(s) {
    return esc(s).replace(/("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false)\b|\bnull\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g, function (m, str, colon, bool, num) {
      if (str) return colon ? '<span class="sm-k">' + str + '</span>' + colon : '<span class="sm-s">' + str + '</span>';
      if (bool) return '<span class="sm-b">' + m + '</span>'; if (num !== undefined) return '<span class="sm-n">' + m + '</span>'; return '<span class="sm-b">' + m + '</span>';
    });
  }
  var CSS = 'html,body{margin:0;padding:0;background:#0d1117;color:#e6edf3;font:13px/1.5 system-ui,-apple-system,Segoe UI,sans-serif}*{box-sizing:border-box}' +
    '#sim-root{min-height:100vh;display:flex;flex-direction:column}.sm-bar{display:flex;align-items:center;gap:8px;padding:8px 12px;background:#161b22;border-bottom:1px solid #30363d;flex-wrap:wrap}' +
    '.sm-dot{width:9px;height:9px;border-radius:50%;background:#3fb950;box-shadow:0 0 6px #3fb950}.sm-dot.off{background:#8b949e;box-shadow:none}.sm-title{font-weight:600;font-size:12px}.sm-sub{color:#8b949e;font-size:11px}' +
    '.sm-tabs{display:flex;gap:2px;margin-left:auto}.sm-tab{background:none;border:0;border-bottom:2px solid transparent;color:#8b949e;font:600 11px system-ui;padding:5px 10px;cursor:pointer;border-radius:4px 4px 0 0}.sm-tab.on{color:#fff;border-color:#58a6ff;background:#21262d}' +
    '.sm-pane{padding:12px;flex:1;min-height:0;overflow:auto}.sm-hide{display:none!important}' +
    '.sm-row{display:flex;gap:6px;align-items:stretch;margin-bottom:8px}.sm-in,.sm-ta,.sm-sel{background:#0d1117;border:1px solid #30363d;color:#e6edf3;border-radius:6px;font:12px ui-monospace,Menlo,Consolas,monospace;padding:7px 9px;outline:none}.sm-in:focus,.sm-ta:focus,.sm-sel:focus{border-color:#58a6ff}' +
    '.sm-in{flex:1;min-width:0}.sm-ta{width:100%;resize:vertical;min-height:54px;display:block}.sm-sel{font-weight:700}.sm-btn{background:#238636;border:0;color:#fff;font:700 12px system-ui;padding:7px 16px;border-radius:6px;cursor:pointer}.sm-btn:hover{background:#2ea043}.sm-btn:disabled{opacity:.6;cursor:wait}' +
    '.sm-chips{display:flex;flex-wrap:wrap;gap:5px;margin:0 0 10px}.sm-chip{display:inline-flex;gap:6px;align-items:center;background:#21262d;border:1px solid #30363d;border-radius:14px;padding:2px 9px 2px 3px;font:11px ui-monospace,Consolas,monospace;color:#c9d1d9;cursor:pointer}.sm-chip:hover{border-color:#58a6ff}.sm-chip b{border-radius:10px;padding:1px 7px;font-size:10px;color:#0d1117}' +
    '.m-GET{background:#3fb950}.m-POST{background:#d29922}.m-PUT{background:#58a6ff}.m-PATCH{background:#a371f7}.m-DELETE{background:#f85149}.m-ALL,.m-USE,.m-HEAD,.m-OPTIONS{background:#8b949e}' +
    '.sm-lbl{color:#8b949e;font:600 10px system-ui;text-transform:uppercase;letter-spacing:.06em;margin:10px 0 4px}.sm-stat{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:8px 0}.sm-pill{border-radius:12px;padding:2px 10px;font:700 12px ui-monospace,Consolas,monospace;color:#0d1117}' +
    '.s2{background:#3fb950}.s3{background:#58a6ff}.s4{background:#d29922}.s5{background:#f85149}.s0{background:#8b949e}.sm-pre{margin:0;background:#010409;border:1px solid #30363d;border-radius:6px;padding:10px;overflow:auto;max-height:340px;font:12px/1.55 ui-monospace,Menlo,Consolas,monospace;white-space:pre-wrap;word-break:break-word}' +
    '.sm-k{color:#79c0ff}.sm-s{color:#a5d6ff}.sm-n{color:#ffa657}.sm-b{color:#ff7b72}.sm-sm{display:flex;gap:4px;margin-bottom:6px}.sm-mini{background:none;border:1px solid #30363d;color:#8b949e;font:600 10px system-ui;padding:2px 8px;border-radius:10px;cursor:pointer}.sm-mini.on{color:#fff;border-color:#58a6ff}' +
    '.sm-hist{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}.sm-hist span{font:10px ui-monospace,Consolas,monospace;background:#161b22;border:1px solid #30363d;border-radius:4px;padding:1px 6px;color:#8b949e;cursor:pointer}' +
    '.sm-note{background:#161b22;border:1px solid #30363d;border-radius:8px;padding:14px;color:#8b949e;font-size:12px}.sm-note b{color:#e6edf3}.sm-note code{background:#21262d;padding:1px 5px;border-radius:4px;color:#e6edf3;font-size:11px}.sm-err{background:#2d1216;border:1px solid #6e2b31;color:#ffa198;border-radius:8px;padding:12px;font:12px ui-monospace,Consolas,monospace;white-space:pre-wrap;margin:12px}' +
    '.sm-frame{width:100%;height:260px;border:1px solid #30363d;border-radius:6px;background:#fff}.sm-hdrs{display:grid;grid-template-columns:auto 1fr;gap:2px 12px;font:11px ui-monospace,Consolas,monospace}.sm-hdrs span:nth-child(odd){color:#79c0ff}.sm-hdrs span:nth-child(even){color:#c9d1d9;word-break:break-all}';
  var ui = sim.ui = { h: h, esc: esc, colorJson: colorJson };
  ui.init = function (opts) {
    opts = opts || {};
    if (!document.getElementById('sim-css')) { var st = h('style', { id: 'sim-css', text: CSS }); document.head.appendChild(st); }
    var root = document.getElementById('sim-root');
    if (!root) { root = h('div', { id: 'sim-root' }); document.body.appendChild(root); }
    root.innerHTML = '';
    var dot = h('span', { class: 'sm-dot off' }), title = h('span', { class: 'sm-title', text: opts.title || 'Simulator' }), sub = h('span', { class: 'sm-sub', text: opts.sub || '' });
    var tabs = h('div', { class: 'sm-tabs' }), bar = h('div', { class: 'sm-bar' }, dot, title, sub, tabs);
    root.appendChild(bar);
    var panes = {}, btns = {};
    var api = {
      root: root, dot: dot, setTitle: function (t, s) { title.textContent = t; if (s !== undefined) sub.textContent = s; }, live: function (on) { dot.className = 'sm-dot' + (on ? '' : ' off'); },
      addTab: function (id, label, el) { var b = h('button', { class: 'sm-tab', text: label, onclick: function () { api.show(id); } }); tabs.appendChild(b); btns[id] = b; el.className += ' sm-pane sm-hide'; panes[id] = el; root.appendChild(el); if (Object.keys(panes).length === 1) api.show(id); return el; },
      show: function (id) { Object.keys(panes).forEach(function (k) { panes[k].classList.toggle('sm-hide', k !== id); btns[k].classList.toggle('on', k === id); }); },
      pane: function (id) { return panes[id]; }
    };
    return api;
  };

  ui.tester = function (o) {
    var method = h('select', { class: 'sm-sel' }); METHODS.forEach(function (m) { method.appendChild(h('option', { text: m })); });
    var pathIn = h('input', { class: 'sm-in', value: o.defaultPath || '/', spellcheck: 'false', 'aria-label': 'Request path' });
    var send = h('button', { class: 'sm-btn', text: 'Send' });
    var hdrIn = h('input', { class: 'sm-in', placeholder: 'Headers (JSON) e.g. {"Authorization":"Bearer <token>"}', spellcheck: 'false', style: 'width:100%;margin-bottom:6px' });
    var bodyIn = h('textarea', { class: 'sm-ta', placeholder: 'Request body (JSON or text) — used for POST / PUT / PATCH', spellcheck: 'false' });
    var chips = h('div', { class: 'sm-chips' }), hist = h('div', { class: 'sm-hist' }), out = h('div', {});
    var root = h('div', {}, h('div', { class: 'sm-lbl', text: 'Endpoints — click one to fill the request' }), chips, h('div', { class: 'sm-row' }, method, pathIn, send), hdrIn, bodyIn, hist, out);
    var history = [];
    function pretty(body, ct) { if (/json/i.test(ct) || /^\s*[[{]/.test(body)) { try { return { html: colorJson(JSON.stringify(JSON.parse(body), null, 2)), json: true }; } catch (e) { /* not json */ } } return { html: esc(body), json: false }; }
    function show(r, req) {
      out.innerHTML = '';
      var cls = 's' + (String(r.status)[0] || '0'), ct = (r.headers && r.headers['content-type']) || '';
      var stat = h('div', { class: 'sm-stat' }, h('span', { class: 'sm-pill ' + cls, text: r.status + ' ' + (r.statusText || '') }), h('span', { class: 'sm-sub', text: req.method + ' ' + req.path + ' · ' + Math.max(1, Math.round(r.ms || 0)) + ' ms · ' + (r.bytes !== undefined ? r.bytes : (r.body || '').length) + ' B' + (ct ? ' · ' + ct.split(';')[0] : '') }));
      var bodyView = h('pre', { class: 'sm-pre', html: pretty(r.body || '', ct).html || '<span style="color:#8b949e">(empty body)</span>' });
      var keys = Object.keys(r.headers || {}), hv = h('div', { class: 'sm-hdrs sm-hide' });
      keys.forEach(function (k) { hv.appendChild(h('span', { text: k })); hv.appendChild(h('span', { text: r.headers[k] })); });
      (r.setCookie || []).forEach(function (c) { hv.appendChild(h('span', { text: 'set-cookie' })); hv.appendChild(h('span', { text: String(c) })); });
      if (!keys.length && !(r.setCookie || []).length) hv.appendChild(h('span', { text: '(no headers)' }));
      var isHtml = /html/i.test(ct), frame = isHtml ? h('iframe', { class: 'sm-frame sm-hide', sandbox: 'allow-scripts', srcdoc: r.body }) : null;
      var views = [['Body', bodyView], ['Headers (' + (keys.length + (r.setCookie || []).length) + ')', hv]]; if (frame) views.push(['Preview', frame]);
      var sw = h('div', { class: 'sm-sm' }), mins = [];
      views.forEach(function (v, i) { var b = h('button', { class: 'sm-mini' + (i === 0 ? ' on' : ''), text: v[0], onclick: function () { views.forEach(function (w, j) { w[1].classList.toggle('sm-hide', j !== i); mins[j].classList.toggle('on', j === i); }); } }); mins.push(b); sw.appendChild(b); });
      out.appendChild(stat); out.appendChild(sw); views.forEach(function (v) { out.appendChild(v[1]); });
    }
    function doSend() {
      var m = method.value, p = pathIn.value.trim() || '/'; if (!/^https?:\/\//i.test(p) && p[0] !== '/') p = '/' + p;
      var hd = {}; if (hdrIn.value.trim()) { try { hd = JSON.parse(hdrIn.value); } catch (e) { out.innerHTML = ''; out.appendChild(h('div', { class: 'sm-err', text: 'Headers must be valid JSON, e.g. {"Authorization":"Bearer abc"}' })); return Promise.resolve(); } }
      var body = /^(POST|PUT|PATCH|DELETE)$/.test(m) ? bodyIn.value : '';
      if (body && !Object.keys(hd).some(function (k) { return k.toLowerCase() === 'content-type'; })) hd['Content-Type'] = /^\s*[[{]/.test(body) ? 'application/json' : 'text/plain';
      send.disabled = true; send.textContent = 'Sending…';
      return Promise.resolve(o.send(m, p, hd, body)).then(function (r) {
        show(r, { method: m, path: p });
        history.unshift({ m: m, p: p, s: r.status, b: bodyIn.value, h: hdrIn.value }); history = history.slice(0, 10); renderHist();
      }, function (e) { out.innerHTML = ''; out.appendChild(h('div', { class: 'sm-err', text: String(e && e.message ? e.message : e) })); })
        .then(function () { send.disabled = false; send.textContent = 'Send'; });
    }
    function renderHist() { hist.innerHTML = ''; var jn = Object.keys(sim.jar); if (jn.length) hist.appendChild(h('span', { text: '🍪 ' + jn.join(', ') + ' — click to clear', onclick: function () { sim.jar = {}; renderHist(); } })); history.forEach(function (x) { hist.appendChild(h('span', { text: x.m + ' ' + x.p + ' → ' + x.s, title: 'Click to re-fill', onclick: function () { method.value = x.m; pathIn.value = x.p; bodyIn.value = x.b; hdrIn.value = x.h; } })); }); }
    send.addEventListener('click', doSend);
    pathIn.addEventListener('keydown', function (e) { if (e.key === 'Enter') doSend(); });
    var seen = {};
    function setRoutes(list) {
      chips.innerHTML = ''; seen = {};
      (list || []).forEach(function (r) {
        var key = r.method + ' ' + r.path; if (seen[key]) return; seen[key] = 1;
        chips.appendChild(h('span', { class: 'sm-chip', title: r.note || '', onclick: function () { method.value = METHODS.indexOf(r.method) >= 0 ? r.method : 'GET'; pathIn.value = r.path.replace(/:(\w+)\??/g, function (_m, n) { return /id$/i.test(n) ? '1' : n === 'slug' ? 'hello-world' : '1'; }).replace(/\*.*$/, 'x').replace(/\/\/+/g, '/') || '/'; if (r.sample && !bodyIn.value) bodyIn.value = r.sample; } }, h('b', { class: 'm-' + r.method, text: r.method }), r.path));
      });
      if (!chips.childNodes.length) chips.appendChild(h('span', { class: 'sm-sub', text: 'No routes registered yet.' }));
    }
    setRoutes(o.routes || []);
    return { el: root, setRoutes: setRoutes, send: doSend, setPath: function (m, p) { method.value = m; pathIn.value = p; } };
  };

  ui.note = function (html) { return h('div', { class: 'sm-note', html: html }); };
  ui.error = function (msg) { var d = h('div', { class: 'sm-err', text: msg }), r = document.getElementById('sim-root') || document.body; r.insertBefore(d, r.children[1] || null); return d; };
})(window);
