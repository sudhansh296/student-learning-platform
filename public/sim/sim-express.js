/* WebDev Atlas — Express 5 simulator + popular middleware mocks. Requires sim-core / sim-net / sim-testing. */
(function (G) {
  'use strict';
  var sim = G.__sim, EventEmitter = sim.EventEmitter, Buffer = sim.Buffer, path = sim.path, post = sim.post, STATUS = sim.STATUS;
  var VERBS = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'];

  /* ───────────── helpers ───────────── */
  function flatten(a, out) { out = out || []; for (var i = 0; i < a.length; i++) { if (Array.isArray(a[i])) flatten(a[i], out); else out.push(a[i]); } return out; }
  function escHtml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
  function setImm(f) { var a = Array.prototype.slice.call(arguments, 1); setTimeout(function () { f.apply(null, a); }, 0); }
  function parseQs(str) {
    var out = {}; if (!str) return out;
    String(str).replace(/^\?/, '').split('&').forEach(function (pair) {
      if (!pair) return; var i = pair.indexOf('='), k, v;
      try { k = decodeURIComponent((i < 0 ? pair : pair.slice(0, i)).replace(/\+/g, ' ')); v = i < 0 ? '' : decodeURIComponent(pair.slice(i + 1).replace(/\+/g, ' ')); } catch (e) { k = pair; v = ''; }
      var m = k.match(/^([^[\]]+)((?:\[[^\]]*\])*)$/);
      if (!m || !m[2]) { assign(out, k, v); return; }
      var keys = [m[1]].concat((m[2].match(/\[([^\]]*)\]/g) || []).map(function (s) { return s.slice(1, -1); })), cur = out;
      for (var j = 0; j < keys.length; j++) {
        var key = keys[j], last = j === keys.length - 1, next = keys[j + 1];
        if (key === '') { if (Array.isArray(cur)) { cur.push(v); } break; }
        if (last) { assign(cur, key, v); break; }
        if (cur[key] === undefined || typeof cur[key] !== 'object') cur[key] = next === '' ? [] : {};
        cur = cur[key];
      }
    });
    return out;
  }
  function assign(o, k, v) { if (k in o) o[k] = [].concat(o[k], v); else o[k] = v; }
  function getPathname(url) { var q = url.indexOf('?'); return q < 0 ? url : url.slice(0, q); }
  function callHandler(fn, req, res, next) {
    if (fn.length > 3) return next();
    try { var r = fn(req, res, next); if (r && typeof r.then === 'function') r.then(undefined, function (e) { next(e || new Error('Promise rejected')); }); } catch (e) { next(e); }
  }
  function callError(fn, err, req, res, next) {
    if (fn.length !== 4) return next(err);
    try { var r = fn(err, req, res, next); if (r && typeof r.then === 'function') r.then(undefined, function (e) { next(e); }); } catch (e) { next(e); }
  }

  /* ───────────── path matching (path-to-regexp flavour) ───────────── */
  function compile(pattern, end) {
    if (pattern instanceof RegExp) return { re: pattern, keys: [] };
    var keys = [], idx = 0;
    var src = String(pattern).replace(/(\/)?:(\w+)(\([^)]+\))?([?*+])?|\*(\w*)|([.+^${}|[\]\\])/g, function (m, slash, name, custom, mod, star, special) {
      if (name) {
        var cap = custom ? custom.slice(1, -1) : '[^/]+?', optional = mod === '?' || mod === '*';
        keys.push({ name: name, optional: optional });
        if (mod === '*' || mod === '+') return (slash ? '(?:/' : '(?:') + '(' + cap.replace('[^/]+?', '[^/]+?(?:/[^/]+?)*') + '))' + (mod === '*' ? '?' : '');
        return optional ? (slash ? '(?:/(' + cap + '))?' : '(?:(' + cap + '))?') : (slash ? '/' : '') + '(' + cap + ')';
      }
      if (m.charAt(0) === '*') { keys.push({ name: star || String(idx++), optional: false }); return '(.*)'; }
      return '\\' + special;
    });
    var re = end ? new RegExp('^' + src + '\\/?$', 'i') : new RegExp('^' + (src === '\\/' || src === '/' ? '' : src.replace(/\/$/, '')) + '(?=\\/|$)', 'i');
    return { re: re, keys: keys };
  }
  function Layer(pattern, end, fn) {
    this.rawPath = typeof pattern === 'string' ? pattern : ''; this.fn = fn; this.route = null; this.end = end;
    this.alts = (Array.isArray(pattern) ? pattern : [pattern]).map(function (p) { return { c: compile(p, end), all: !end && (p === '/' || p === undefined) }; });
  }
  Layer.prototype.match = function (pathname) {
    for (var i = 0; i < this.alts.length; i++) {
      var a = this.alts[i];
      if (a.all) return { params: {}, matched: '' };
      var m = a.c.re.exec(pathname); if (!m) continue;
      var params = {};
      a.c.keys.forEach(function (k, j) { var v = m[j + 1]; if (v !== undefined) { try { v = decodeURIComponent(v); } catch (e) { /* keep raw */ } params[k.name] = v; } });
      return { params: params, matched: this.end ? pathname : m[0], keys: a.c.keys };
    }
    return null;
  };

  /* ───────────── Route & Router ───────────── */
  function Route(p) { this.path = p; this.stack = []; this.methods = {}; }
  Route.prototype.handles = function (m) { if (this.methods._all) return true; m = m.toLowerCase(); if (m === 'head' && !this.methods.head) m = 'get'; return !!this.methods[m]; };
  Route.prototype.dispatch = function (req, res, done) {
    var idx = 0, stack = this.stack, method = req.method.toLowerCase(); if (method === 'head' && !this.methods.head) method = 'get';
    req.route = this; next();
    function next(err) {
      if (err === 'route') return done(); if (err === 'router') return done(err);
      var l = stack[idx++]; if (!l) return done(err);
      if (l.method && l.method !== method) return next(err);
      if (err) callError(l.fn, err, req, res, next); else callHandler(l.fn, req, res, next);
    }
  };
  function addRouteHandlers(route, method, args) {
    flatten(args).forEach(function (fn) {
      if (typeof fn !== 'function') throw new TypeError('Route.' + (method || 'all') + '() requires a callback function but got a ' + Object.prototype.toString.call(fn).slice(8, -1).toLowerCase());
      route.stack.push({ method: method, fn: fn });
    });
    if (method) route.methods[method] = true; else route.methods._all = true;
  }

  var routerMethods = {
    route: function (p) { var route = new Route(p), layer = new Layer(p, true, function (req, res, next) { route.dispatch(req, res, next); }); layer.route = route; this.stack.push(layer); return route; },
    use: function () {
      var args = flatten(Array.prototype.slice.call(arguments)), p = '/';
      if (typeof args[0] !== 'function' && args.length) p = args.shift();
      if (!args.length) throw new TypeError('Router.use() requires a middleware function');
      var self = this;
      args.forEach(function (fn) {
        if (typeof fn !== 'function') throw new TypeError('Router.use() requires a middleware function but got a ' + Object.prototype.toString.call(fn).slice(8, -1).toLowerCase());
        var l = new Layer(p, false, fn); l.route = null; self.stack.push(l);
        if (fn.__isApp) { fn.mountpath = p; fn.parent = self.__app; if (fn.emit) fn.emit('mount', self.__app); }
      });
      return this;
    },
    param: function (name, fn) { (this.params[name] = this.params[name] || []).push(fn); return this; },
    all: function (p) { addRouteHandlers(this.route(p), null, Array.prototype.slice.call(arguments, 1)); return this; },
    handle: function (req, res, out) {
      var self = this, idx = 0, stack = this.stack, parentUrl = req.baseUrl || '', parentParams = req.params, removed = '', slashAdded = false, called = {};
      req.next = next;
      function done(err) { req.params = parentParams; req.baseUrl = parentUrl; out(err); }
      next();
      function next(err) {
        var layerError = err === 'route' ? null : err;
        if (slashAdded) { req.url = req.url.slice(1); slashAdded = false; }
        if (removed.length) { req.baseUrl = parentUrl; req.url = removed + req.url; removed = ''; }
        if (layerError === 'router') return setImm(done, null);
        var pathname = getPathname(req.url), layer = null, m = null;
        while (idx < stack.length) {
          layer = stack[idx++]; m = layer.match(pathname); if (!m) continue;
          if (layer.route && !layer.route.handles(req.method)) { m = null; continue; }
          break;
        }
        if (!m) return setImm(done, layerError);
        if (layer.route && layerError) return next(layerError);
        req.params = self.mergeParams ? Object.assign({}, parentParams, m.params) : m.params;
        runParams(layer, m, function (perr) {
          if (perr) return next(perr);
          if (layer.route) { req.route = layer.route; return layer.fn(req, res, next); }
          var matched = m.matched;
          if (matched.length) {
            removed = matched; req.url = req.url.slice(matched.length);
            if (req.url.charAt(0) !== '/') { req.url = '/' + req.url; slashAdded = true; }
            req.baseUrl = parentUrl + (matched.charAt(matched.length - 1) === '/' ? matched.slice(0, -1) : matched);
          }
          if (layerError) callError(layer.fn, layerError, req, res, next); else callHandler(layer.fn, req, res, next);
        });
        function runParams(l, mm, cb) {
          var keys = (mm.keys || []).filter(function (k) { return self.params[k.name] && mm.params[k.name] !== undefined; }), i = 0;
          (function step(e) {
            if (e || i >= keys.length) return cb(e);
            var k = keys[i++], val = mm.params[k.name], fns = self.params[k.name].slice(), j = 0, ck = k.name + ':' + val;
            if (called[ck]) return step();
            called[ck] = true;
            (function pn(err2) { if (err2) return step(err2); var f = fns[j++]; if (!f) return step(); try { f(req, res, pn, val, k.name); } catch (ex) { step(ex); } })();
          })();
        }
      }
    }
  };
  VERBS.forEach(function (v) { routerMethods[v] = function (p) { var route = this.route(p); addRouteHandlers(route, v, Array.prototype.slice.call(arguments, 1)); return this; }; });
  routerMethods.del = routerMethods.delete;

  function Router(opts) {
    function router(req, res, next) { router.handle(req, res, next); }
    Object.assign(router, routerMethods); router.stack = []; router.params = {}; router.mergeParams = !!(opts && opts.mergeParams); router.__isRouter = true; router.__app = null;
    return router;
  }

  /* ───────────── request / response prototypes ───────────── */
  var reqProto = Object.create(sim.IncomingMessage.prototype);
  Object.assign(reqProto, {
    get: function (n) { n = String(n).toLowerCase(); if (n === 'referer' || n === 'referrer') return this.headers.referer || this.headers.referrer; return this.headers[n]; },
    accepts: function () { var acc = String(this.headers.accept || '*/*'), t = flatten(arguments); if (!t.length) return acc.split(',')[0].split(';')[0].trim(); for (var i = 0; i < t.length; i++) { var x = String(t[i]), mime = x.indexOf('/') >= 0 ? x : ({ json: 'application/json', html: 'text/html', text: 'text/plain', xml: 'application/xml' })[x] || x; if (acc.indexOf('*/*') >= 0 || acc.indexOf(mime) >= 0 || acc.indexOf(mime.split('/')[0] + '/*') >= 0) return t[i]; } return false; },
    is: function (type) { var ct = String(this.headers['content-type'] || '').split(';')[0].trim().toLowerCase(); if (!ct) return null; var t = flatten(arguments); for (var i = 0; i < t.length; i++) { var x = String(t[i]).toLowerCase(), mime = x.indexOf('/') >= 0 ? x : ({ json: 'application/json', html: 'text/html', urlencoded: 'application/x-www-form-urlencoded', text: 'text/plain' })[x] || x; if (ct === mime || (mime.slice(-2) === '/*' && ct.indexOf(mime.slice(0, -1)) === 0) || (x === 'json' && /\+json$/.test(ct))) return t[i]; } return false; }
  });
  reqProto.header = reqProto.get; reqProto.acceptsLanguages = function () { return 'en'; }; reqProto.acceptsCharsets = function () { return 'utf-8'; }; reqProto.acceptsEncodings = function () { return 'identity'; };
  Object.defineProperties(reqProto, {
    protocol: { get: function () { return 'http'; } }, secure: { get: function () { return false; } }, ip: { get: function () { return '127.0.0.1'; } }, ips: { get: function () { return []; } },
    host: { get: function () { return this.headers.host; } }, hostname: { get: function () { return String(this.headers.host || 'localhost').replace(/:\d+$/, ''); } },
    path: { get: function () { return getPathname(this.url); } }, xhr: { get: function () { return String(this.headers['x-requested-with'] || '').toLowerCase() === 'xmlhttprequest'; } },
    subdomains: { get: function () { return []; } }, fresh: { get: function () { return false; } }, stale: { get: function () { return true; } }
  });

  var MIME = { html: 'text/html', htm: 'text/html', json: 'application/json', txt: 'text/plain', text: 'text/plain', css: 'text/css', js: 'text/javascript', mjs: 'text/javascript', xml: 'application/xml', csv: 'text/csv', md: 'text/markdown', svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp', ico: 'image/x-icon', pdf: 'application/pdf', bin: 'application/octet-stream', form: 'application/x-www-form-urlencoded', urlencoded: 'application/x-www-form-urlencoded' };
  function mimeFor(t) { t = String(t); if (t.indexOf('/') >= 0) return t; return MIME[t.replace(/^\./, '').toLowerCase()] || 'application/octet-stream'; }
  function withCharset(ct) { return /charset=/i.test(ct) || !/^(text\/|application\/(json|javascript)|.*\+(json|xml))/i.test(ct) ? ct : ct + '; charset=utf-8'; }
  function makeEtag(body) { var h = sim.crypto.createHash('sha1').update(body).digest('base64').slice(0, 27); return 'W/"' + Buffer.byteLength(body).toString(16) + '-' + h + '"'; }
  function serializeCookie(name, val, o) {
    o = o || {}; var s = name + '=' + encodeURIComponent(val);
    if (o.maxAge != null) { s += '; Max-Age=' + Math.floor(o.maxAge / 1000); if (!o.expires) s += '; Expires=' + new Date(Date.now() + o.maxAge).toUTCString(); }
    s += '; Path=' + (o.path || '/'); if (o.domain) s += '; Domain=' + o.domain; if (o.expires) s += '; Expires=' + o.expires.toUTCString();
    if (o.httpOnly) s += '; HttpOnly'; if (o.secure) s += '; Secure'; if (o.sameSite) s += '; SameSite=' + (o.sameSite === true ? 'Strict' : String(o.sameSite).replace(/^./, function (c) { return c.toUpperCase(); }));
    return s;
  }

  var resProto = Object.create(sim.ServerResponse.prototype);
  Object.assign(resProto, {
    status: function (c) { c = Number(c); if (!(c >= 100 && c <= 999) || c % 1) throw new RangeError('Invalid status code: ' + c + '. Status code must be an integer.'); this.statusCode = c; return this; },
    sendStatus: function (c) { var t = STATUS[c] || String(c); this.statusCode = c; this.type('txt'); return this.send(t); },
    links: function (l) { var s = Object.keys(l).map(function (r) { return '<' + l[r] + '>; rel="' + r + '"'; }).join(', '); return this.set('Link', s); },
    send: function (body) {
      var chunk = body, req = this.req, ct;
      if (chunk === undefined) chunk = '';
      switch (typeof chunk) {
        case 'string': if (!this.get('Content-Type')) this.type('html'); break;
        case 'boolean': case 'number': case 'object':
          if (chunk === null) chunk = '';
          else if (Buffer.isBuffer(chunk)) { if (!this.get('Content-Type')) this.type('bin'); }
          else return this.json(chunk);
          break;
      }
      if (typeof chunk === 'string') { ct = this.get('Content-Type'); if (ct) this.set('Content-Type', withCharset(String(ct))); }
      var len = Buffer.isBuffer(chunk) ? chunk.length : Buffer.byteLength(chunk);
      this.set('Content-Length', String(len));
      if (this.app && this.app.get('etag') && len && !this.get('ETag') && this.statusCode >= 200 && this.statusCode < 300 && req && /^(GET|HEAD)$/.test(req.method)) this.set('ETag', makeEtag(chunk));
      var inm = req && req.headers['if-none-match'], et = this.get('ETag');
      if (inm && et && (inm === et || inm.split(/\s*,\s*/).indexOf(et) >= 0) && this.statusCode >= 200 && this.statusCode < 300 && /^(GET|HEAD)$/.test(req.method)) this.statusCode = 304;
      if (this.statusCode === 204 || this.statusCode === 304) { this.removeHeader('Content-Type'); this.removeHeader('Content-Length'); this.removeHeader('Transfer-Encoding'); chunk = ''; }
      if (req && req.method === 'HEAD') this.end(); else this.end(chunk);
      return this;
    },
    json: function (obj) {
      var app = this.app, spaces = app && app.get('json spaces'), rep = app && app.get('json replacer');
      var body = JSON.stringify(obj, rep, spaces);
      if (!this.get('Content-Type')) this.set('Content-Type', 'application/json');
      return this.send(body === undefined ? '' : body);
    },
    jsonp: function (obj) { return this.json(obj); },
    type: function (t) { return this.set('Content-Type', mimeFor(t)); },
    format: function (obj) {
      var keys = Object.keys(obj).filter(function (k) { return k !== 'default'; }), k = this.req.accepts(keys);
      if (k && obj[k]) { this.type(k); return obj[k](); } if (obj.default) return obj.default();
      var err = new Error('Not Acceptable'); err.status = err.statusCode = 406; return this.req.next(err);
    },
    attachment: function (fn) { if (fn) this.type(path.extname(fn)); return this.set('Content-Disposition', 'attachment' + (fn ? '; filename="' + path.basename(fn) + '"' : '')); },
    set: function (f, v) {
      if (typeof f === 'object') { for (var k in f) this.set(k, f[k]); return this; }
      var val = Array.isArray(v) ? v.map(String) : String(v);
      if (String(f).toLowerCase() === 'content-type' && !Array.isArray(val)) val = withCharset(val);
      this.setHeader(f, val); return this;
    },
    append: function (f, v) { var prev = this.get(f); return this.set(f, prev ? [].concat(prev, v) : v); },
    get: function (f) { return this.getHeader(f); },
    vary: function (f) { return this.append('Vary', f); },
    cookie: function (name, val, o) { var v = typeof val === 'object' ? 'j:' + JSON.stringify(val) : String(val); this.appendHeader('Set-Cookie', serializeCookie(name, v, o)); return this; },
    clearCookie: function (name, o) { return this.cookie(name, '', Object.assign({}, o, { expires: new Date(1), path: (o && o.path) || '/' })); },
    location: function (u) { return this.set('Location', u === 'back' ? this.req.get('Referrer') || '/' : encodeURI(decodeURI(u))); },
    redirect: function (a, b) {
      var status = 302, address = a; if (b !== undefined) { status = a; address = b; }
      this.location(address); this.statusCode = status; var addr = this.get('Location');
      this.set('Content-Type', 'text/plain'); return this.send(STATUS[status] + '. Redirecting to ' + addr);
    },
    sendFile: function (p, opts, cb) {
      if (typeof opts === 'function') { cb = opts; opts = {}; } opts = opts || {};
      var self = this;
      if (!p) throw new TypeError('path argument is required to res.sendFile');
      if (typeof p !== 'string') throw new TypeError('path must be a string to res.sendFile');
      if (!opts.root && !path.isAbsolute(p)) throw new TypeError('path must be absolute or specify root to res.sendFile');
      var full = path.resolve(opts.root || '/', p);
      if (!(full in sim.files)) { var e = new Error("ENOENT: no such file or directory, stat '" + full + "'"); e.code = 'ENOENT'; e.status = e.statusCode = 404; if (cb) return cb(e); return this.req.next(e); }
      if (!this.get('Content-Type')) this.type(path.extname(full) || 'bin');
      this.send(sim.files[full]); if (cb) setImm(cb); return self;
    },
    download: function (p, name, opts, cb) { if (typeof name === 'function') { cb = name; name = null; } this.attachment(name || path.basename(p)); return this.sendFile(p, typeof opts === 'object' ? opts : {}, cb || (typeof opts === 'function' ? opts : undefined)); },
    render: function (view, opts, cb) {
      var self = this, app = this.app, req = this.req; if (typeof opts === 'function') { cb = opts; opts = {}; }
      var data = Object.assign({}, app.locals, this.locals, opts || {});
      app.render(view, data, function (err, html) { if (err) return cb ? cb(err) : req.next(err); if (cb) return cb(null, html); self.send(html); });
    }
  });
  resProto.header = resProto.set; resProto.contentType = resProto.type;

  /* ───────────── tiny EJS engine ───────────── */
  function ejsRender(tpl, data, opts) {
    var js = 'var __o="";with(__d){', last = 0, re = /<%([=\-_#]?)([\s\S]*?)-?%>/g, m;
    function txt(s) { if (s) js += '__o+=' + JSON.stringify(s) + ';'; }
    while ((m = re.exec(tpl))) {
      txt(tpl.slice(last, m.index)); last = re.lastIndex;
      if (m[1] === '=') js += '__o+=__e(' + m[2] + ');'; else if (m[1] === '-') js += '__o+=(' + m[2] + ');'; else if (m[1] === '#') { /* comment */ } else js += m[2] + '\n';
    }
    txt(tpl.slice(last)); js += '}return __o;';
    var f; try { f = new Function('__d', '__e', 'include', js); } catch (e) { throw new SyntaxError('EJS: ' + e.message); }
    var inc = function (p, d) { var full = path.resolve('/app/views', p.replace(/(\.ejs)?$/, '.ejs')); if (!(full in sim.files)) throw new Error('Could not find the include file "' + p + '"'); return ejsRender(sim.files[full], Object.assign({}, data, d)); };
    return f(Object.assign({}, data), function (v) { return v === null || v === undefined ? '' : escHtml(v); }, inc);
  }
  sim.register('ejs', { render: function (t, d) { return ejsRender(t, d); }, renderFile: function (f, d, o, cb) { if (typeof o === 'function') cb = o; try { var full = path.resolve(f); if (!(full in sim.files)) throw new Error("ENOENT: no such file or directory, open '" + full + "'"); var r = ejsRender(sim.files[full], d); if (cb) return cb(null, r); return Promise.resolve(r); } catch (e) { if (cb) return cb(e); return Promise.reject(e); } }, compile: function (t) { return function (d) { return ejsRender(t, d); }; } });

  /* ───────────── application ───────────── */
  sim.apps = [];
  var appMethods = {
    set: function (k, v) { this.settings[k] = v; return this; },
    get: function (p) {
      if (arguments.length === 1 && typeof p === 'string' && !/^[/*]/.test(p) && (p in this.settings || /\s/.test(p) || /^(x-powered-by|etag|env|views|view engine|json spaces|json replacer|trust proxy|case sensitive routing|strict routing|query parser|subdomain offset|view cache|jsonp callback name)$/.test(p))) return this.settings[p];
      var route = this.route(p); addRouteHandlers(route, 'get', Array.prototype.slice.call(arguments, 1)); return this;
    },
    enable: function (k) { return this.set(k, true); }, disable: function (k) { return this.set(k, false); }, enabled: function (k) { return !!this.settings[k]; }, disabled: function (k) { return !this.settings[k]; },
    engine: function (ext, fn) { this.engines['.' + String(ext).replace(/^\./, '')] = fn; return this; },
    render: function (view, opts, cb) {
      var app = this, ext = path.extname(view), engineName = app.get('view engine');
      if (!ext) { if (!engineName && sim.lenient) engineName = 'ejs'; if (!engineName) return cb(new Error('No default engine was specified and no extension was provided.')); ext = '.' + String(engineName).replace(/^\./, ''); view = view + ext; }
      var root = path.resolve(app.get('views') || '/app/views'), full = path.resolve(root, view);
      if (!(full in sim.files)) {
        if (sim.lenient) { var vn = view.replace(ext, ''); sim.post('l', '\u2139\ufe0f The view "' + vn + '" is not part of this snippet \u2014 showing a stand-in page for it.'); var esc = function (t) { return String(t).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }; var shown = {}; Object.keys(opts || {}).forEach(function (k) { if (!/^(settings|_locals|cache)$/.test(k)) shown[k] = opts[k]; }); return cb(null, '<!DOCTYPE html><html><body style="font-family:system-ui;margin:24px"><h1>' + esc(vn) + '</h1><pre>' + esc(JSON.stringify(shown, null, 2)) + '</pre></body></html>'); }
        return cb(new Error('Failed to lookup view "' + view.replace(ext, '') + '" in views directory "' + root + '"'));
      }
      var eng = app.engines[ext] || (ext === '.ejs' ? function (p, o, done) { try { done(null, ejsRender(sim.files[p], o)); } catch (e) { done(e); } } : null);
      if (!eng) return cb(new Error('Cannot find module \'' + ext.slice(1) + '\' — this view engine isn\'t available in the simulator (use "ejs" or register one with app.engine).'));
      eng(full, opts, cb);
    },
    listen: function () { var srv = sim.registry_http().createServer(this); return srv.listen.apply(srv, arguments.length ? arguments : [3000]); },
    handle: function (req, res, cb) {
      var app = this;
      if (!req.__expressInit) {
        req.__expressInit = true; var raw = req.url;
        Object.setPrototypeOf(req, reqProto); Object.setPrototypeOf(res, resProto);
        req.app = res.app = app; req.res = res; res.req = req; req.originalUrl = raw; req.baseUrl = ''; req.params = {}; res.locals = res.locals || {};
        var qi = raw.indexOf('?'); req.query = app.get('query parser') === 'simple' ? Object.assign({}, qs2(raw.slice(qi + 1))) : (qi < 0 ? {} : parseQs(raw.slice(qi + 1)));
        if (app.get('x-powered-by') !== false) res.setHeader('X-Powered-By', 'Express');
      }
      var done = cb || function (err) { finalHandler(err, req, res, app); };
      this._router.handle(req, res, done);
    }
  };
  function qs2(s) { var o = {}; new URLSearchParams(s).forEach(function (v, k) { o[k] = v; }); return o; }
  function finalHandler(err, req, res, app) {
    if (res.headersSent) return res.end();
    var status, body;
    if (err) {
      status = err.status || err.statusCode; if (!(status >= 400 && status < 600)) status = 500;
      if (app.get('env') !== 'test') post('e', String(err && err.stack ? err.stack.split('\n').slice(0, 5).join('\n') : err));
      var msg = app.get('env') === 'production' ? STATUS[status] || 'Error' : (err && err.stack) || String(err);
      body = escHtml(msg).replace(/\n/g, '<br>').replace(/ {2}/g, ' &nbsp;');
    } else { status = 404; body = 'Cannot ' + escHtml(req.method) + ' ' + escHtml(getPathname(req.originalUrl || req.url)); }
    res.statusCode = status;
    res.setHeader('Content-Security-Policy', "default-src 'none'"); res.setHeader('X-Content-Type-Options', 'nosniff'); res.setHeader('Content-Type', 'text/html; charset=utf-8');
    var html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>Error</title>\n</head>\n<body>\n<pre>' + body + '</pre>\n</body>\n</html>\n';
    res.setHeader('Content-Length', String(Buffer.byteLength(html))); res.end(req.method === 'HEAD' ? undefined : html);
  }

  function createApplication() {
    var app = function (req, res, next) { app.handle(req, res, next); };
    Object.assign(app, EventEmitter.prototype, appMethods);
    app._ev = {}; app.__isApp = true; app.settings = { 'x-powered-by': true, etag: 'weak', env: 'development', 'query parser': 'extended', 'subdomain offset': 2, 'trust proxy': false, views: '/app/views', 'jsonp callback name': 'callback' };
    app.locals = { settings: app.settings }; app.engines = {}; app.mountpath = '/'; app.parent = null;
    var router = Router(); router.__app = app; app._router = router;
    ['use', 'route', 'param', 'all'].concat(VERBS, ['del']).forEach(function (m) {
      if (m === 'get') return;
      app[m] = function () { var r = router[m].apply(router, arguments); return r === router ? app : r; };
    });
    var settingGet = appMethods.get;
    app.get = function (p) {
      if (arguments.length === 1 && typeof p === 'string' && !/^[/*]/.test(p)) return settingGet.call(app, p);
      var route = router.route(p); addRouteHandlers(route, 'get', Array.prototype.slice.call(arguments, 1)); return app;
    };
    app.path = function () { return app.parent ? app.parent.path() + app.mountpath : ''; };
    sim.apps.push(app); return app;
  }

  /* ───────────── body parsers, static ───────────── */
  function bodyParser(kind, opts) {
    opts = opts || {};
    return function (req, res, next) {
      if (req.body !== undefined && req.__bodyDone) return next();
      var raw = req._body || '', ct = String(req.headers['content-type'] || '').toLowerCase();
      if (!raw) return next();
      var match = typeof opts.type === 'string' && opts.type.indexOf('*') < 0 ? ct.indexOf(opts.type) >= 0 : kind === 'json' ? /json/.test(ct) : kind === 'urlencoded' ? /x-www-form-urlencoded/.test(ct) : kind === 'text' ? /^text\//.test(ct) : kind === 'raw' ? /octet-stream/.test(ct) : false;
      if (typeof opts.type === 'function') match = opts.type(req);
      if (!match) return next();
      var lim = opts.limit; if (lim) { var n = typeof lim === 'number' ? lim : parseFloat(lim) * ({ kb: 1024, mb: 1048576 }[String(lim).toLowerCase().replace(/[\d.\s]/g, '')] || 1); if (Buffer.byteLength(raw) > n) { var le = new Error('request entity too large'); le.status = le.statusCode = 413; le.type = 'entity.too.large'; return next(le); } }
      try {
        if (kind === 'json') { var v = JSON.parse(raw); if (opts.strict !== false && (v === null || typeof v !== 'object')) throw new SyntaxError('Unexpected token ' + raw.charAt(0) + ' in JSON at position 0'); req.body = v; }
        else if (kind === 'urlencoded') req.body = opts.extended === false ? qs2(raw) : parseQs(raw);
        else if (kind === 'text') req.body = raw; else req.body = Buffer.from(raw);
        req.__bodyDone = true;
      } catch (e) { var pe = new SyntaxError(e.message); pe.status = pe.statusCode = 400; pe.type = 'entity.parse.failed'; pe.expose = true; pe.body = raw; return next(pe); }
      next();
    };
  }
  function serveStatic(root, opts) {
    opts = opts || {};
    return function (req, res, next) {
      if (req.method !== 'GET' && req.method !== 'HEAD') return next();
      var p; try { p = decodeURIComponent(getPathname(req.url)); } catch (e) { return next(); }
      var full = path.join(path.resolve(root), p);
      if (!(full in sim.files) && (full.replace(/\/$/, '') + '/index.html') in sim.files) full = full.replace(/\/$/, '') + '/index.html';
      if (!(full in sim.files)) { if (opts.extensions) { for (var i = 0; i < opts.extensions.length; i++) if ((full + '.' + opts.extensions[i]) in sim.files) { full += '.' + opts.extensions[i]; break; } } if (!(full in sim.files)) return next(); }
      res.type(path.extname(full) || 'bin'); res.setHeader('Accept-Ranges', 'bytes'); res.setHeader('Cache-Control', 'public, max-age=' + Math.floor((opts.maxAge || 0) / 1000));
      res.send(sim.files[full]);
    };
  }
  sim.registry_http = function () { return sim.modules.http; };

  var express = function () { return createApplication(); };
  express.json = function (o) { return bodyParser('json', o); }; express.urlencoded = function (o) { return bodyParser('urlencoded', o); };
  express.text = function (o) { return bodyParser('text', o); }; express.raw = function (o) { return bodyParser('raw', o); };
  express.static = serveStatic; express.Router = Router; express.Route = Route; express.request = reqProto; express.response = resProto; express.application = appMethods;
  express.default = express;
  sim.register('express', express);
  sim.register('body-parser', { json: express.json, urlencoded: express.urlencoded, text: express.text, raw: express.raw });

  /* ───────────── middleware & package mocks ───────────── */
  function opt(o, k, d) { return o && k in o ? o[k] : d; }
  function passthrough() { return function (req, res, next) { next(); }; }

  sim.register('cors', function cors(o) {
    o = o || {};
    return function (req, res, next) {
      var origin = req.headers.origin, allow = '*', originOpt = opt(o, 'origin', '*');
      if (originOpt === false) return next();
      if (originOpt === true) allow = origin || '*';
      else if (typeof originOpt === 'string') allow = originOpt;
      else if (Array.isArray(originOpt)) allow = origin && originOpt.some(function (x) { return x instanceof RegExp ? x.test(origin) : x === origin; }) ? origin : false;
      else if (originOpt instanceof RegExp) allow = origin && originOpt.test(origin) ? origin : false;
      else if (typeof originOpt === 'function') { var r; originOpt(origin, function (e, v) { r = v; }); allow = r === true ? origin : r || false; }
      if (allow) res.setHeader('Access-Control-Allow-Origin', allow); if (allow && allow !== '*') res.append('Vary', 'Origin');
      if (o.credentials) res.setHeader('Access-Control-Allow-Credentials', 'true');
      if (o.exposedHeaders) res.setHeader('Access-Control-Expose-Headers', [].concat(o.exposedHeaders).join(','));
      if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', [].concat(o.methods || 'GET,HEAD,PUT,PATCH,POST,DELETE').join(','));
        var ah = o.allowedHeaders ? [].concat(o.allowedHeaders).join(',') : req.headers['access-control-request-headers']; if (ah) res.setHeader('Access-Control-Allow-Headers', ah);
        if (o.maxAge) res.setHeader('Access-Control-Max-Age', String(o.maxAge));
        if (o.preflightContinue) return next();
        res.statusCode = o.optionsSuccessStatus || 204; res.setHeader('Content-Length', '0'); return res.end();
      }
      next();
    };
  });

  sim.register('helmet', function helmet(o) {
    o = o || {};
    var H = [['contentSecurityPolicy', 'Content-Security-Policy', "default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests"], ['crossOriginOpenerPolicy', 'Cross-Origin-Opener-Policy', 'same-origin'], ['crossOriginResourcePolicy', 'Cross-Origin-Resource-Policy', 'same-origin'], ['originAgentCluster', 'Origin-Agent-Cluster', '?1'], ['referrerPolicy', 'Referrer-Policy', 'no-referrer'], ['hsts', 'Strict-Transport-Security', 'max-age=31536000; includeSubDomains'], ['noSniff', 'X-Content-Type-Options', 'nosniff'], ['dnsPrefetchControl', 'X-DNS-Prefetch-Control', 'off'], ['ieNoOpen', 'X-Download-Options', 'noopen'], ['frameguard', 'X-Frame-Options', 'SAMEORIGIN'], ['permittedCrossDomainPolicies', 'X-Permitted-Cross-Domain-Policies', 'none'], ['xssFilter', 'X-XSS-Protection', '0']];
    return function (req, res, next) { H.forEach(function (h) { if (o[h[0]] !== false) res.setHeader(h[1], h[2]); }); if (o.hidePoweredBy !== false) res.removeHeader('X-Powered-By'); next(); };
  });

  sim.register('morgan', function morgan(fmt, o) {
    fmt = fmt || 'combined';
    var tokens = {
      method: function (q) { return q.method; }, url: function (q) { return q.originalUrl || q.url; }, status: function (q, r) { return r.statusCode; }, 'response-time': function (q, r) { return ((r._t1 - q._t0) || 0).toFixed(3); },
      res: function (q, r, a) { return r.getHeader(a) === undefined ? '-' : r.getHeader(a); }, req: function (q, r, a) { return q.headers[String(a).toLowerCase()] || '-'; }, date: function () { return new Date().toUTCString(); },
      'remote-addr': function () { return '::1'; }, 'http-version': function () { return '1.1'; }, 'user-agent': function (q) { return q.headers['user-agent'] || '-'; }, referrer: function (q) { return q.headers.referer || '-'; }
    };
    var presets = { dev: ':method :url :status :response-time ms - :res[content-length]', tiny: ':method :url :status :res[content-length] - :response-time ms', short: ':remote-addr :method :url HTTP/:http-version :status :res[content-length] - :response-time ms', common: ':remote-addr - - [:date] ":method :url HTTP/:http-version" :status :res[content-length]', combined: ':remote-addr - - [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"' };
    var template = typeof fmt === 'function' ? null : presets[fmt] || fmt;
    return function (req, res, next) {
      req._t0 = performance.now();
      res.on('finish', function () {
        res._t1 = performance.now();
        var line = template === null ? fmt({ method: function (q) { return q.method; }, url: function (q) { return q.originalUrl; }, status: function (q, r) { return r.statusCode; }, 'response-time': function (q, r) { return ((r._t1 - q._t0)).toFixed(3); } }, req, res) : template.replace(/:([\w-]+)(?:\[([^\]]+)\])?/g, function (m, n, a) { return tokens[n] ? String(tokens[n](req, res, a)) : m; });
        if (line !== null && line !== undefined && !(o && o.skip && o.skip(req, res))) { if (o && o.stream && o.stream.write) o.stream.write(line + '\n'); else post('l', line); }
      });
      next();
    };
  });

  var rateLimit = function (o) {
    o = o || {}; var win = o.windowMs || 15 * 60 * 1000, max = o.limit !== undefined ? o.limit : o.max !== undefined ? o.max : 5, hits = {};
    return function (req, res, next) {
      if (o.skip && o.skip(req, res)) return next();
      var key = o.keyGenerator ? o.keyGenerator(req, res) : req.ip, now = Date.now(), h = hits[key];
      if (!h || h.reset <= now) h = hits[key] = { count: 0, reset: now + win };
      h.count++;
      var remaining = Math.max(0, (typeof max === 'function' ? max(req, res) : max) - h.count), lim = typeof max === 'function' ? max(req, res) : max, secs = Math.ceil((h.reset - now) / 1000);
      if (o.legacyHeaders !== false) { res.setHeader('X-RateLimit-Limit', String(lim)); res.setHeader('X-RateLimit-Remaining', String(remaining)); res.setHeader('X-RateLimit-Reset', String(Math.ceil(h.reset / 1000))); }
      if (o.standardHeaders) { res.setHeader('RateLimit-Limit', String(lim)); res.setHeader('RateLimit-Remaining', String(remaining)); res.setHeader('RateLimit-Reset', String(secs)); }
      if (h.count > lim) {
        res.setHeader('Retry-After', String(secs));
        if (o.handler) return o.handler(req, res, next, o);
        res.status(o.statusCode || 429); var msg = o.message !== undefined ? o.message : 'Too many requests, please try again later.';
        return typeof msg === 'object' ? res.json(msg) : res.send(msg);
      }
      next();
    };
  };
  rateLimit.rateLimit = rateLimit; rateLimit.default = rateLimit; sim.register('express-rate-limit', rateLimit);

  sim.register('cookie-parser', function cookieParser() {
    return function (req, res, next) {
      if (req.cookies) return next(); req.cookies = {}; req.signedCookies = {};
      String(req.headers.cookie || '').split(/;\s*/).forEach(function (p) { if (!p) return; var i = p.indexOf('='); if (i < 0) return; var k = p.slice(0, i).trim(), v = p.slice(i + 1).trim(); try { v = decodeURIComponent(v); } catch (e) { /* raw */ } if (v.indexOf('j:') === 0) { try { v = JSON.parse(v.slice(2)); } catch (e) { /* raw */ } } if (!(k in req.cookies)) req.cookies[k] = v; });
      next();
    };
  });
  sim.register('compression', passthrough); sim.register('serve-favicon', passthrough); sim.register('method-override', passthrough); sim.register('express-async-errors', {});
  sim.register('dotenv', { config: function () { return { parsed: {} }; }, parse: function (s) { var o = {}; String(s).split(/\r?\n/).forEach(function (l) { var m = l.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/); if (m) o[m[1]] = (m[2] || '').replace(/^(['"])(.*)\1$/, '$2'); }); return o; } });
  sim.register('dotenv/config', {});

  sim.register('express-session', function session(o) {
    o = o || {}; var store = {}, name = o.name || 'connect.sid';
    return function (req, res, next) {
      var cookies = {}; String(req.headers.cookie || '').split(/;\s*/).forEach(function (p) { var i = p.indexOf('='); if (i > 0) cookies[p.slice(0, i)] = p.slice(i + 1); });
      var raw = cookies[name], sid = raw ? decodeURIComponent(raw).replace(/^s:/, '').split('.')[0] : null;
      if (!sid || !store[sid]) {
        sid = sim.crypto.randomUUID().replace(/-/g, '').slice(0, 24); store[sid] = { cookie: { maxAge: null, httpOnly: true, path: '/' } };
        if (o.saveUninitialized !== false) res.cookie(name, 's:' + sid + '.' + sim.crypto.createHmac('sha256', String(o.secret || 'secret')).update(sid).digest('base64').replace(/=+$/, ''), Object.assign({ httpOnly: true }, o.cookie));
      }
      var sess = store[sid]; Object.defineProperty(sess, 'id', { value: sid, enumerable: false, configurable: true });
      Object.defineProperty(sess, 'destroy', { value: function (cb) { delete store[sid]; delete req.session; if (cb) cb(); }, enumerable: false, configurable: true });
      Object.defineProperty(sess, 'save', { value: function (cb) { if (cb) cb(); }, enumerable: false, configurable: true });
      Object.defineProperty(sess, 'regenerate', { value: function (cb) { delete store[sid]; if (cb) cb(); }, enumerable: false, configurable: true });
      req.session = sess; req.sessionID = sid; next();
    };
  });
  sim.register('multer', (function () {
    var warned = false; function mw(kind) { return function () { return function (req, res, next) { if (!warned) { warned = true; post('w', 'multer: multipart file uploads can\'t be simulated in the browser — req.file / req.files will be undefined.'); } next(); }; }; }
    var m = function () { return { single: mw(), array: mw(), fields: mw(), none: mw(), any: mw() }; };
    m.memoryStorage = function () { return {}; }; m.diskStorage = function (o) { return o || {}; }; return m;
  })());

  var createError = function (status, msg, props) {
    if (typeof status !== 'number') { msg = status instanceof Error ? status.message : status; status = 500; }
    var e = new Error(msg || STATUS[status] || 'Error'); e.status = e.statusCode = status; e.expose = status < 500; if (props) Object.assign(e, props); return e;
  };
  [400, 401, 403, 404, 405, 409, 410, 422, 429, 500, 501, 502, 503].forEach(function (c) { createError[c] = function (m) { return createError(c, m); }; createError[String(STATUS[c]).replace(/[^A-Za-z]/g, '') ] = createError[c]; });
  createError.isHttpError = function (e) { return e instanceof Error && !!e.status; };
  sim.register('http-errors', createError);
  sim.register('uuid', { v4: function () { return sim.crypto.randomUUID(); }, v1: function () { return sim.crypto.randomUUID(); }, validate: function (s) { return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s); }, NIL: '00000000-0000-0000-0000-000000000000' });
  sim.register('nanoid', { nanoid: function (n) { var a = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict', o = ''; for (var i = 0; i < (n || 21); i++) o += a[Math.floor(Math.random() * 64)]; return o; } });

  /* jsonwebtoken (HS256, real HMAC signatures) */
  (function () {
    function b64u(o) { return Buffer.from(typeof o === 'string' ? o : JSON.stringify(o)).toString('base64url'); }
    function dur(v) { if (typeof v === 'number') return v; var m = String(v).match(/^(\d+(?:\.\d+)?)\s*(ms|s|m|h|d|w|y)?/i); if (!m) throw new Error('"expiresIn" should be a number of seconds or string representing a timespan'); var n = parseFloat(m[1]); return n * ({ ms: 0.001, s: 1, m: 60, h: 3600, d: 86400, w: 604800, y: 31536000 }[(m[2] || 's').toLowerCase()]); }
    function JsonWebTokenError(m) { var e = new Error(m); e.name = 'JsonWebTokenError'; Object.setPrototypeOf(e, JsonWebTokenError.prototype); return e; } JsonWebTokenError.prototype = Object.create(Error.prototype); JsonWebTokenError.prototype.constructor = JsonWebTokenError;
    function TokenExpiredError(m, at) { var e = new Error(m); e.name = 'TokenExpiredError'; e.expiredAt = at; Object.setPrototypeOf(e, TokenExpiredError.prototype); return e; } TokenExpiredError.prototype = Object.create(JsonWebTokenError.prototype); TokenExpiredError.prototype.constructor = TokenExpiredError;
    function sync(o, cb) { if (typeof cb === 'function') { setTimeout(function () { try { cb(null, o()); } catch (e) { cb(e); } }, 0); return undefined; } return o(); }
    var jwt = {
      sign: function (payload, secret, opts, cb) {
        if (typeof opts === 'function') { cb = opts; opts = {}; } opts = opts || {};
        return sync(function () {
          if (!secret) throw new Error('secretOrPrivateKey must have a value');
          var now = Math.floor(Date.now() / 1000), body = typeof payload === 'string' ? payload : Object.assign({}, payload);
          if (typeof body === 'object') { if (!opts.noTimestamp && body.iat === undefined) body.iat = now; if (opts.expiresIn !== undefined) body.exp = (body.iat || now) + dur(opts.expiresIn); if (opts.notBefore !== undefined) body.nbf = now + dur(opts.notBefore); ['issuer:iss', 'audience:aud', 'subject:sub', 'jwtid:jti'].forEach(function (p) { var a = p.split(':'); if (opts[a[0]] !== undefined) body[a[1]] = opts[a[0]]; }); }
          var head = b64u({ alg: opts.algorithm || 'HS256', typ: 'JWT' }), data = head + '.' + b64u(body);
          return data + '.' + sim.hmac256(String(secret), data).toString('base64url');
        }, cb);
      },
      verify: function (token, secret, opts, cb) {
        if (typeof opts === 'function') { cb = opts; opts = {}; } opts = opts || {};
        return sync(function () {
          if (typeof token !== 'string' || !token) throw JsonWebTokenError('jwt must be provided');
          var p = token.split('.'); if (p.length !== 3) throw JsonWebTokenError('jwt malformed');
          var payload; try { payload = JSON.parse(Buffer.from(p[1], 'base64url').toString()); JSON.parse(Buffer.from(p[0], 'base64url').toString()); } catch (e) { throw JsonWebTokenError('invalid token'); }
          if (sim.hmac256(String(secret), p[0] + '.' + p[1]).toString('base64url') !== p[2]) throw JsonWebTokenError('invalid signature');
          var now = Math.floor(Date.now() / 1000); if (typeof payload === 'object' && payload) { if (payload.exp !== undefined && !opts.ignoreExpiration && now >= payload.exp) throw TokenExpiredError('jwt expired', new Date(payload.exp * 1000)); if (payload.nbf !== undefined && now < payload.nbf) throw JsonWebTokenError('jwt not active'); if (opts.issuer && payload.iss !== opts.issuer) throw JsonWebTokenError('jwt issuer invalid. expected: ' + opts.issuer); }
          return opts.complete ? { header: JSON.parse(Buffer.from(p[0], 'base64url').toString()), payload: payload, signature: p[2] } : payload;
        }, cb);
      },
      decode: function (token, o) { try { var p = String(token).split('.'), pl = JSON.parse(Buffer.from(p[1], 'base64url').toString()); return o && o.complete ? { header: JSON.parse(Buffer.from(p[0], 'base64url').toString()), payload: pl, signature: p[2] } : pl; } catch (e) { return null; } },
      JsonWebTokenError: JsonWebTokenError, TokenExpiredError: TokenExpiredError, NotBeforeError: JsonWebTokenError
    };
    sim.register('jsonwebtoken', jwt);
  })();

  /* bcrypt / bcryptjs — format-compatible simulation (SHA-256 based, NOT real bcrypt) */
  (function () {
    var ALPHA = './ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    function salt(rounds) { var s = ''; for (var i = 0; i < 22; i++) s += ALPHA[Math.floor(Math.random() * 64)]; return '$2b$' + (rounds < 10 ? '0' : '') + (rounds || 10) + '$' + s; }
    function hash(pw, s) { var head = s.slice(0, 29), d = sim.sha256(Buffer.from(head + '|' + pw)), h = ''; for (var i = 0; i < 31; i++) h += ALPHA[d[i % 32] % 64]; return head + h; }
    function saltOf(x) { return typeof x === 'number' || x === undefined ? salt(x) : String(x); }
    function later(fn, cb) { if (typeof cb === 'function') { setTimeout(function () { try { cb(null, fn()); } catch (e) { cb(e); } }, 0); return undefined; } return new Promise(function (res, rej) { setTimeout(function () { try { res(fn()); } catch (e) { rej(e); } }, 5); }); }
    var b = {
      genSaltSync: function (r) { return salt(r); }, genSalt: function (r, cb) { if (typeof r === 'function') { cb = r; r = 10; } return later(function () { return salt(r); }, cb); },
      hashSync: function (pw, s) { if (pw === undefined || pw === null || pw === '') throw new Error('data and salt arguments required'); return hash(String(pw), saltOf(s)); },
      hash: function (pw, s, cb) { return later(function () { if (pw === undefined || pw === null || pw === '') throw new Error('data and salt arguments required'); return hash(String(pw), saltOf(s)); }, cb); },
      compareSync: function (pw, h) { return typeof h === 'string' && h.length === 60 && hash(String(pw), h.slice(0, 29)) === h; },
      compare: function (pw, h, cb) { return later(function () { return b.compareSync(pw, h); }, cb); },
      getRounds: function (h) { return parseInt(String(h).slice(4, 6), 10); }
    };
    sim.register('bcrypt', b); sim.register('bcryptjs', b);
  })();

  /* express-validator */
  (function () {
    function getPath(o, p) { return String(p).split('.').reduce(function (a, k) { return a === undefined || a === null ? undefined : a[k]; }, o); }
    function setPath(o, p, v) { var ks = String(p).split('.'), c = o; ks.forEach(function (k, i) { if (i === ks.length - 1) c[k] = v; else c = c[k] = c[k] || {}; }); }
    var V = {
      exists: function (v) { return v !== undefined; }, notEmpty: function (v) { return v !== undefined && v !== null && String(v).trim() !== ''; }, isEmpty: function (v) { return v === undefined || v === null || String(v) === ''; },
      isEmail: function (v) { return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); },
      isLength: function (v, o) { var l = v === undefined || v === null ? 0 : String(v).length; o = o || {}; return l >= (o.min || 0) && (o.max === undefined || l <= o.max); },
      isInt: function (v, o) { if (!/^[+-]?\d+$/.test(String(v))) return false; var n = parseInt(v, 10); o = o || {}; return (o.min === undefined || n >= o.min) && (o.max === undefined || n <= o.max) && (o.gt === undefined || n > o.gt) && (o.lt === undefined || n < o.lt); },
      isFloat: function (v, o) { if (!/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(String(v))) return false; var n = parseFloat(v); o = o || {}; return (o.min === undefined || n >= o.min) && (o.max === undefined || n <= o.max); },
      isNumeric: function (v) { return /^[+-]?\d*\.?\d+$/.test(String(v)); }, isString: function (v) { return typeof v === 'string'; }, isBoolean: function (v) { return typeof v === 'boolean' || /^(true|false|0|1)$/.test(String(v)); },
      isArray: function (v, o) { return Array.isArray(v) && (!o || ((o.min === undefined || v.length >= o.min) && (o.max === undefined || v.length <= o.max))); }, isObject: function (v) { return v !== null && typeof v === 'object' && !Array.isArray(v); },
      isAlpha: function (v) { return /^[A-Za-z]+$/.test(String(v)); }, isAlphanumeric: function (v) { return /^[A-Za-z0-9]+$/.test(String(v)); },
      isURL: function (v) { try { var u = new URL(String(v)); return /^https?:$/.test(u.protocol); } catch (e) { return false; } }, isUUID: function (v) { return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(v)); },
      isIn: function (v, l) { return l.map(String).indexOf(String(v)) >= 0; }, matches: function (v, re, fl) { return (re instanceof RegExp ? re : new RegExp(re, fl)).test(String(v)); }, equals: function (v, c) { return String(v) === String(c); }, contains: function (v, s) { return String(v).indexOf(s) >= 0; },
      isJSON: function (v) { try { JSON.parse(v); return true; } catch (e) { return false; } }, isISO8601: function (v) { return !isNaN(Date.parse(v)) && /^\d{4}-\d{2}-\d{2}/.test(String(v)); }, isDate: function (v) { return !isNaN(Date.parse(v)); },
      isLowercase: function (v) { return String(v) === String(v).toLowerCase(); }, isUppercase: function (v) { return String(v) === String(v).toUpperCase(); }, isMobilePhone: function (v) { return /^\+?[\d\s-]{7,15}$/.test(String(v)); },
      isStrongPassword: function (v, o) { o = Object.assign({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }, o); var s = String(v); return s.length >= o.minLength && (s.match(/[a-z]/g) || []).length >= o.minLowercase && (s.match(/[A-Z]/g) || []).length >= o.minUppercase && (s.match(/\d/g) || []).length >= o.minNumbers && (s.match(/[^A-Za-z0-9]/g) || []).length >= o.minSymbols; }
    };
    var S = { trim: function (v) { return typeof v === 'string' ? v.trim() : v; }, escape: function (v) { return typeof v === 'string' ? escHtml(v) : v; }, unescape: function (v) { return v; }, toInt: function (v) { return parseInt(v, 10); }, toFloat: function (v) { return parseFloat(v); }, toLowerCase: function (v) { return typeof v === 'string' ? v.toLowerCase() : v; }, toUpperCase: function (v) { return typeof v === 'string' ? v.toUpperCase() : v; }, toBoolean: function (v) { return !/^(false|0|)$/i.test(String(v)); }, toDate: function (v) { var d = new Date(v); return isNaN(d) ? null : d; }, normalizeEmail: function (v) { return typeof v === 'string' ? v.trim().toLowerCase() : v; }, stripLow: function (v) { return v; }, blacklist: function (v, c) { return String(v).replace(new RegExp('[' + c + ']', 'g'), ''); }, ltrim: function (v) { return String(v).replace(/^\s+/, ''); }, rtrim: function (v) { return String(v).replace(/\s+$/, ''); } };
    function makeChain(loc, fields, defMsg) {
      fields = [].concat(fields === undefined ? [] : fields);
      var steps = [], optional = null, negateNext = false, chain = function (req, res, next) {
        var errs = req._vErrors = req._vErrors || [], data = req._vData = req._vData || {}, src = loc.length === 1 ? req[loc[0]] : req;
        var targets = fields.length ? fields : [''];
        Promise.all(targets.map(function (f) {
          var value = f === '' ? src : getPath(loc.length === 1 ? (src || {}) : {}, f), stop = false, chainP = Promise.resolve();
          if (loc.length > 1) { for (var li = 0; li < loc.length && value === undefined; li++) value = getPath(req[loc[li]] || {}, f); }
          if (optional && (value === undefined || (optional.falsy && !value) || (optional.nullable && value === null))) return;
          steps.forEach(function (st) {
            chainP = chainP.then(function () {
              if (stop) return;
              if (st.t === 's') { value = st.fn(value); return; }
              if (st.t === 'bail') { if (errs.some(function (e) { return e.path === f && e.__c === chain; })) stop = true; return; }
              if (st.t === 'if') { return Promise.resolve(typeof st.fn === 'function' ? st.fn(value, { req: req, path: f }) : true).then(function (r) { if (!r) stop = true; }); }
              return Promise.resolve().then(function () { return st.fn(value, { req: req, location: loc[0], path: f }); }).then(function (r) { if (st.custom && r === false) return false; return r === undefined && st.custom ? true : r; }, function (e) { st.err = e; return false; }).then(function (ok) {
                var pass = st.neg ? !ok : !!ok;
                if (!pass) { var m = st.msg !== undefined ? st.msg : (st.err && st.err.message) || defMsg || 'Invalid value'; errs.push({ type: 'field', value: value, msg: m, path: f, location: loc[0], __c: chain }); }
                st.err = null;
              });
            });
          });
          return chainP.then(function () { if (f) setPath(data, f, value); if (loc.length === 1 && f && src && typeof src === 'object') { try { setPath(src, f, value); } catch (e) { /* frozen */ } } });
        })).then(function () { next(); }, next);
      };
      function add(name, fn, t, custom) { return function () { var a = Array.prototype.slice.call(arguments); var st = { t: t || 'v', fn: function (v, meta) { return fn.apply(null, [v].concat(a).concat(t ? [meta] : [])); }, neg: negateNext, custom: custom }; if (custom) st.fn = function (v, meta) { return a[0](v, meta); }; negateNext = false; steps.push(st); return chain; }; }
      Object.keys(V).forEach(function (k) { chain[k] = add(k, V[k]); });
      Object.keys(S).forEach(function (k) { chain[k] = add(k, S[k], 's'); });
      chain.custom = add('custom', null, 'v', true); chain.customSanitizer = function (fn) { steps.push({ t: 's', fn: fn }); return chain; };
      chain.withMessage = function (m) { if (steps.length) steps[steps.length - 1].msg = m; return chain; };
      chain.not = function () { negateNext = true; return chain; }; chain.bail = function () { steps.push({ t: 'bail' }); return chain; }; chain.if = function (c) { steps.push({ t: 'if', fn: c }); return chain; };
      chain.optional = function (o) { optional = Object.assign({}, o, { falsy: o && (o.checkFalsy || o.values === 'falsy') }); if (o && o.nullable) optional.nullable = true; return chain; };
      chain.isArray = add('isArray', V.isArray); chain.exists = add('exists', V.exists);
      chain.run = function (req) { return new Promise(function (res, rej) { chain(req, {}, function (e) { e ? rej(e) : res(); }); }); };
      return chain;
    }
    function factory(loc) { return function (f, m) { return makeChain(loc, f, m); }; }
    var ev = { body: factory(['body']), param: factory(['params']), query: factory(['query']), cookie: factory(['cookies']), header: factory(['headers']), headers: factory(['headers']), check: factory(['body', 'params', 'query', 'cookies', 'headers']),
      validationResult: function (req) {
        var raw = (req._vErrors || []).map(function (e) { var o = Object.assign({}, e); delete o.__c; return o; });
        var r = { isEmpty: function () { return !raw.length; }, array: function (o) { if (o && o.onlyFirstError) { var seen = {}; return raw.filter(function (e) { if (seen[e.path]) return false; seen[e.path] = 1; return true; }); } return raw.slice(); }, mapped: function () { var m = {}; raw.forEach(function (e) { if (!(e.path in m)) m[e.path] = e; }); return m; }, formatWith: function (f) { raw = raw.map(f); return r; }, throw: function () { if (raw.length) { var e = new Error('Validation failed'); e.errors = raw; throw e; } } };
        return r;
      },
      matchedData: function (req) { return Object.assign({}, req._vData || {}); },
      oneOf: function (chains) { return function (req, res, next) { var before = (req._vErrors || []).length; var i = 0; (function step() { var c = chains[i++]; if (!c) { (req._vErrors = req._vErrors || []).push({ type: 'alternative', msg: 'Invalid value(s)', nestedErrors: [] }); return next(); } var tmp = { body: req.body, params: req.params, query: req.query, cookies: req.cookies, headers: req.headers, _vErrors: [] }; [].concat(c).reduce(function (p, ch) { return p.then(function () { return new Promise(function (r2) { ch(tmp, {}, r2); }); }); }, Promise.resolve()).then(function () { if (!tmp._vErrors.length) next(); else step(); }); })(); void before; }; }
    };
    ev.checkSchema = function (schema) { return Object.keys(schema).map(function (f) { var c = makeChain(['body'], f); var d = schema[f]; if (d.in) c = makeChain([{ body: 'body', params: 'params', query: 'query', cookies: 'cookies', headers: 'headers' }[d.in] || d.in], f); Object.keys(d).forEach(function (k) { if (k === 'in' || k === 'errorMessage') return; var o = d[k]; if (k === 'optional') { c.optional(o === true ? undefined : o); return; } if (typeof c[k] === 'function') { c[k](o && o.options); if (o && o.errorMessage) c.withMessage(o.errorMessage); } }); if (d.errorMessage) { /* default message */ } return c; }); };
    sim.register('express-validator', ev);
  })();

  /* supertest */
  sim.register('supertest', function supertest(target) {
    var handler = typeof target === 'function' ? target : (target && target._handler) || null;
    function Test(method, url) {
      var self = this; this.m = method; this.u = url; this.h = {}; this.b = ''; this.expects = [];
      this.then = function (res, rej) { return self._run().then(res, rej); }; this.catch = function (rej) { return self._run().then(undefined, rej); };
      this.end = function (cb) { self._run().then(function (r) { cb(null, r); }, cb); return self; };
    }
    Test.prototype.set = function (k, v) { if (typeof k === 'object') Object.assign(this.h, k); else this.h[k] = v; return this; };
    Test.prototype.send = function (b) { if (typeof b === 'object' && b !== null) { this.b = JSON.stringify(b); if (!this.h['Content-Type'] && !this.h['content-type']) this.h['Content-Type'] = 'application/json'; } else this.b = String(b === undefined ? '' : b); return this; };
    Test.prototype.type = function (t) { this.h['Content-Type'] = ({ json: 'application/json', form: 'application/x-www-form-urlencoded' })[t] || t; return this; };
    Test.prototype.query = function (q) { this.u += (this.u.indexOf('?') < 0 ? '?' : '&') + (typeof q === 'string' ? q : new URLSearchParams(q).toString()); return this; };
    Test.prototype.auth = function (u, p) { this.h.Authorization = p === undefined ? 'Bearer ' + u : 'Basic ' + btoa(u + ':' + p); return this; };
    Test.prototype.accept = function (t) { this.h.Accept = t; return this; }; Test.prototype.set.bind(Test.prototype);
    Test.prototype.expect = function (a, b) { this.expects.push([a, b]); return this; };
    Test.prototype._run = function () {
      var self = this; if (this._p) return this._p;
      this._p = sim.handle(handler, this.m, this.u, this.h, this.b, 3000).then(function (r) {
        var body = r.body, ct = r.headers['content-type'] || '', parsed = {};
        if (/json/.test(ct)) { try { parsed = JSON.parse(body); } catch (e) { parsed = {}; } }
        var res = { status: r.status, statusCode: r.status, headers: r.headers, header: r.headers, text: body, body: parsed, type: ct.split(';')[0], ok: r.status < 400, get: function (n) { return r.headers[String(n).toLowerCase()]; } };
        self.expects.forEach(function (e) {
          var a = e[0], b = e[1];
          if (typeof a === 'number') { if (res.status !== a) throw new Error('expected ' + a + ' "' + (STATUS[a] || '') + '", got ' + res.status + ' "' + (STATUS[res.status] || '') + '"'); }
          else if (typeof a === 'function') { var er = a(res); if (er instanceof Error) throw er; }
          else if (typeof a === 'string' && /^content-type$/i.test(a) === false && b !== undefined) { var hv = res.headers[a.toLowerCase()]; if (b instanceof RegExp ? !b.test(hv || '') : String(hv) !== String(b)) throw new Error('expected "' + a + '" header to match ' + b + ', got "' + hv + '"'); }
          else if (typeof a === 'string' && /^content-type$/i.test(a)) { var cv = res.headers['content-type'] || ''; if (b instanceof RegExp ? !b.test(cv) : cv.split(';')[0] !== String(b)) throw new Error('expected "Content-Type" of "' + b + '", got "' + cv + '"'); }
          else if (a instanceof RegExp) { if (!a.test(body)) throw new Error('expected body to match ' + a); }
          else if (typeof a === 'object' && a !== null) { if (!sim.isDeep(res.body, a, false)) throw new Error('expected ' + sim.inspect(a) + ' response body, got ' + sim.inspect(res.body)); }
          else if (typeof a === 'string') { if (body !== a) throw new Error('expected ' + JSON.stringify(a) + ' response body, got ' + JSON.stringify(body)); }
        });
        return res;
      });
      return this._p;
    };
    var api = {}; ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'].forEach(function (m) { api[m] = function (u) { return new Test(m.toUpperCase(), u); }; }); api.del = api.delete;
    return api;
  });

  /* axios (via the patched fetch) & node-fetch */
  (function () {
    function make(defaults) {
      function request(cfg) {
        cfg = Object.assign({}, defaults, cfg); var url = (cfg.baseURL && !/^https?:/.test(cfg.url) ? cfg.baseURL.replace(/\/$/, '') + '/' + String(cfg.url).replace(/^\//, '') : cfg.url);
        if (cfg.params) url += (url.indexOf('?') < 0 ? '?' : '&') + new URLSearchParams(cfg.params).toString();
        var headers = Object.assign({}, cfg.headers), body = cfg.data;
        if (body !== undefined && typeof body === 'object' && !(body instanceof URLSearchParams)) { body = JSON.stringify(body); if (!headers['Content-Type']) headers['Content-Type'] = 'application/json'; }
        return fetch(url, { method: (cfg.method || 'get').toUpperCase(), headers: headers, body: /^(get|head)$/i.test(cfg.method || 'get') ? undefined : body }).then(function (r) {
          return r.text().then(function (t) {
            var data = t; try { data = JSON.parse(t); } catch (e) { /* text */ }
            var hs = {}; r.headers.forEach(function (v, k) { hs[k] = v; });
            var out = { data: data, status: r.status, statusText: r.statusText, headers: hs, config: cfg, request: {} };
            if (r.status >= 200 && r.status < 300 || cfg.validateStatus && cfg.validateStatus(r.status)) return out;
            var e = new Error('Request failed with status code ' + r.status); e.name = 'AxiosError'; e.code = r.status >= 500 ? 'ERR_BAD_RESPONSE' : 'ERR_BAD_REQUEST'; e.response = out; e.config = cfg; e.isAxiosError = true; throw e;
          });
        }, function (e) { var ae = new Error(e && e.cause && e.cause.code === 'ECONNREFUSED' ? 'connect ECONNREFUSED 127.0.0.1' : 'Network Error'); ae.name = 'AxiosError'; ae.code = 'ERR_NETWORK'; ae.isAxiosError = true; ae.cause = e; throw ae; });
      }
      var ax = function (c) { return request(typeof c === 'string' ? { url: c } : c); };
      ['get', 'delete', 'head', 'options'].forEach(function (m) { ax[m] = function (u, c) { return request(Object.assign({}, c, { url: u, method: m })); }; });
      ['post', 'put', 'patch'].forEach(function (m) { ax[m] = function (u, d, c) { return request(Object.assign({}, c, { url: u, method: m, data: d })); }; });
      ax.request = request; ax.create = function (d) { return make(Object.assign({}, defaults, d)); }; ax.defaults = defaults; ax.isAxiosError = function (e) { return !!(e && e.isAxiosError); }; ax.default = ax;
      ax.interceptors = { request: { use: function () { } }, response: { use: function () { } } };
      return ax;
    }
    sim.register('axios', make({}));
    var nf = function (u, o) { return fetch(u, o); }; nf.default = nf; sim.register('node-fetch', nf); sim.register('undici', { fetch: nf });
  })();

  /* chalk — chainable no-color stub so logging helpers still work */
  (function () {
    var handler = { get: function (t, k) { return typeof k === 'symbol' || k === '__lazy' || k === 'then' || k === '__esModule' ? undefined : chalk; }, apply: function (t, _s, a) { return a.join(' '); } };
    var chalk = new Proxy(function () { }, handler); sim.register('chalk', chalk); sim.register('picocolors', chalk); sim.register('colors', chalk);
  })();

  /* ───────────── run finalisation: routes + tester UI ───────────── */
  function collectRoutes(router, prefix, out, depth) {
    if (depth > 8) return;
    router.stack.forEach(function (l) {
      if (l.route) {
        var p = prefix + (typeof l.route.path === 'string' ? (l.route.path === '/' && prefix ? '' : l.route.path) : String(l.route.path));
        var meths = Object.keys(l.route.methods).filter(function (m) { return m !== '_all'; }); if (l.route.methods._all) meths.unshift('ALL');
        meths.forEach(function (m) { out.push({ method: m === 'ALL' ? 'GET' : m.toUpperCase(), label: m.toUpperCase(), path: p || '/', sample: /^(post|put|patch)$/i.test(m) ? sampleBody(l.route.stack) : undefined }); });
      } else if (l.fn) {
        var sub = l.fn.__isApp ? l.fn._router : l.fn.__isRouter ? l.fn : null;
        if (sub) collectRoutes(sub, prefix + (l.rawPath && l.rawPath !== '/' ? l.rawPath : ''), out, depth + 1);
      }
    });
  }
  function sampleBody(stack) {
    var src = stack.map(function (s) { return String(s.fn); }).join('\n'), keys = [], m;
    var re1 = /req\.body\.(\w+)/g; while ((m = re1.exec(src))) if (keys.indexOf(m[1]) < 0) keys.push(m[1]);
    var re2 = /(?:const|let|var)\s*\{([^}]+)\}\s*=\s*req\.body/g; while ((m = re2.exec(src))) m[1].split(',').forEach(function (k) { k = k.split(':')[0].split('=')[0].trim(); if (k && k.indexOf('...') < 0 && keys.indexOf(k) < 0) keys.push(k); });
    if (!keys.length) return undefined;
    var guess = { name: 'Alice', username: 'alice', email: 'alice@example.com', password: 'secret123', title: 'Hello World', text: 'Buy milk', content: 'Some content', description: 'A description', body: 'Post body', age: 25, price: 19.99, quantity: 2, id: 1, completed: false, done: false, role: 'user', task: 'Learn Express', author: 'Alice', message: 'Hi there' };
    var o = {}; keys.forEach(function (k) { o[k] = k in guess ? guess[k] : 'value'; }); return JSON.stringify(o, null, 2);
  }

  sim.finishExpress = function (opts) {
    opts = opts || {};
    return new Promise(function (resolveDone) {
      setTimeout(function () {
        var ports = Object.keys(sim.servers), apps = sim.apps, hasServer = ports.length > 0, target = null;
        if (!hasServer && apps.length) { sim.defaultHandler = apps[apps.length - 1]; target = sim.defaultHandler; }
        var routes = [];
        if (hasServer) { ports.forEach(function (p) { var h = sim.servers[p].handler; var owner = apps.filter(function (a) { return sim.servers[p].server && sim.servers[p].server.listeners('request').indexOf(a) >= 0; })[0]; if (owner) collectRoutes(owner._router, '', routes, 0); }); }
        if (!routes.length && apps.length) collectRoutes(apps[apps.length - 1]._router, '', routes, 0);
        var ui = sim.ui.init({ title: 'Express Simulator', sub: '' });
        (sim.bootErrors || []).forEach(function (m) { sim.ui.error(m); });
        var uerr = sim.userError ? String(sim.userError.stack || sim.userError) : (G.__lastError || '');
        if (uerr) sim.ui.error(uerr);
        var hasWork = hasServer || apps.length;
        if (hasWork) {
          var tester = sim.ui.tester({
            routes: routes, defaultPath: (routes.filter(function (r) { return r.method === 'GET' && !/[:*]/.test(r.path); })[0] || { path: '/' }).path,
            send: function (m, p, hd, body) { return sim.dispatch(m, /^https?:\/\//i.test(p) ? p : 'http://localhost:' + (ports[0] || 3000) + p, hd, body); }
          });
          var el = document.createElement('div'); el.appendChild(tester.el); ui.addTab('tester', 'API tester', el);
          ui.live(hasServer);
          ui.setTitle(hasServer ? 'Express server running' : 'Express app (no app.listen — requests run in memory)', hasServer ? ports.map(function (p) { return 'http://localhost:' + p; }).join('  ·  ') : 'add app.listen(3000) to start it');
          tester.setRoutes(routes);
          var first = routes.filter(function (r) { return r.method === 'GET' && !/[:*]/.test(r.path); })[0];
          if (first) { tester.setPath('GET', first.path); tester.send(); }
        } else {
          var note = document.createElement('div');
          var silent = sim.outCount === 0 && !(sim.bootErrors || []).length && !(sim.hasTests && sim.hasTests());
          if (silent) { var hint = 'Ran without errors, but nothing was printed — this snippet only defines things (functions, classes, modules). Call them and log the result, e.g. console.log(myFunction(2, 3)).'; sim.post('l', 'ℹ️ ' + hint); note.appendChild(sim.ui.note('<b>✓ Ran without errors — no output.</b><br>' + hint)); }
          else note.appendChild(sim.ui.note('<b>Script finished.</b> Output is in the <b>Console</b> panel below.<br><br>Tip: create a server with <code>const app = express(); app.get(...); app.listen(3000)</code> and this panel becomes an interactive request tester.'));
          ui.addTab('out', 'Output', note); ui.setTitle('Node.js script', 'runs in the browser simulator');
        }
        Promise.resolve(sim.runTests ? sim.runTests() : false).then(function (ran) {
          if (ran) { var t = ui.pane('tester') || ui.pane('out'); if (t) { var st = sim.testStats; t.insertBefore(sim.ui.note('<b>' + (st.fail ? '❌ ' + st.fail + ' test(s) failed' : '✅ All ' + st.pass + ' tests passed') + '</b> — details are in the Console panel.'), t.firstChild); } }
          resolveDone();
        });
      }, 30);
    });
  };
})(window);
