/* WebDev Atlas — Next.js (App Router) simulator.
 * Runs route handlers, pages, layouts, async server components, middleware, next/link, next/navigation,
 * next/image, server actions — all in the browser. Needs React 18 UMD + Babel standalone + sim-core/net. */
(function (G) {
  'use strict';
  var sim = G.__sim, post = sim.post, path = sim.path, ui = sim.ui, h = ui.h;
  var N = (sim.next = { files: {}, table: null, version: 0, dataVersion: 0, loadingEl: null });
  var ORIGIN = 'http://localhost:3000';
  var VERBS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

  // React re-throws errors that an error boundary already handled; hide Next's control-flow signals and dev-only noise.
  G.addEventListener('error', function (e) {
    var er = e.error; if (er && typeof er.digest === 'string' && /^NEXT_(NOT_FOUND|REDIRECT)/.test(er.digest)) { e.preventDefault(); e.stopImmediatePropagation(); }
  }, true);
  // React reports one render error several times (dev retry + boundary); collapse identical messages.
  var rawPost = G.__post, lastKey = '', lastAt = 0;
  G.__post = function (t, m) {
    var key = String(m).replace(/^(❌ )?(Uncaught )?(Error: )?/, '').replace(/^Unhandled Runtime Error: /, '').replace(/ \(line \d+\)$/, '').split('\n')[0];
    var now = Date.now(); if (t === 'e' && key === lastKey && now - lastAt < 600) return; lastKey = key; lastAt = now;
    return rawPost.call(this, t, m);
  };
  var origConsoleError = G.console.error, origConsoleLog = G.console.log;
  G.console.error = function () {
    var m = String(arguments[0]);
    if (/The above error occurred in|NEXT_NOT_FOUND|NEXT_REDIRECT|Warning: (validateDOMNesting|Each child in a list)/.test(m) && /The above error|NEXT_/.test(m)) return;
    return origConsoleError.apply(this, arguments);
  };
  G.console.info = G.console.log = function () { if (/Download the React DevTools/.test(String(arguments[0]))) return; return origConsoleLog.apply(this, arguments); };
  function hybrid(o) { var p = Promise.resolve(o); Object.keys(o || {}).forEach(function (k) { if (k !== 'then' && k !== 'catch' && k !== 'finally') p[k] = o[k]; }); return p; }
  function normName(p) { return String(p).trim().replace(/^\.?\//, '').replace(/^src\//, ''); }
  function err(m) { post('e', m); }

  /* ───────────── file tree → route table ───────────── */
  function buildTable(files) {
    var t = { pages: [], apis: [], pagesApi: [], layouts: {}, loading: {}, notFound: {}, error: {}, mw: null };
    Object.keys(files).forEach(function (f) {
      var m = f.match(/^app\/(?:(.*)\/)?(page|route|layout|loading|not-found|error)\.(?:jsx?|tsx?|mjs)$/);
      if (m) {
        var dir = m[1] || '', kind = m[2], raw = dir.split('/').filter(Boolean);
        if (raw.some(function (s) { return s.charAt(0) === '_' || s.charAt(0) === '@'; })) return;
        var segs = raw.filter(function (s) { return !/^\(.*\)$/.test(s); });
        var score = segs.reduce(function (a, s) { return a + (/^\[\[?\.\.\./.test(s) ? 1 : /^\[/.test(s) ? 2 : 3); }, 0);
        var entry = { file: f, dir: dir, segs: segs, score: score, pattern: '/' + segs.join('/') };
        if (kind === 'page') t.pages.push(entry); else if (kind === 'route') t.apis.push(entry);
        else if (kind === 'layout') t.layouts[dir] = f; else if (kind === 'loading') t.loading[dir] = f; else if (kind === 'not-found') t.notFound[dir] = f; else t.error[dir] = f;
        return;
      }
      var pa = f.match(/^pages\/api\/(.+)\.(?:jsx?|tsx?)$/);
      if (pa) { var ps = pa[1].split('/').filter(function (s) { return s !== 'index'; }); t.pagesApi.push({ file: f, segs: ['api'].concat(ps), score: 9, pattern: '/api/' + ps.join('/') }); return; }
      if (/^middleware\.(?:jsx?|tsx?|mjs)$/.test(f)) t.mw = f;
    });
    return t;
  }
  function matchSegs(pat, segs) {
    var params = {}, i = 0, j, p, m;
    for (j = 0; j < pat.length; j++) {
      p = pat[j];
      if ((m = p.match(/^\[\[\.\.\.(\w+)\]\]$/))) { params[m[1]] = segs.slice(i); return params; }
      if ((m = p.match(/^\[\.\.\.(\w+)\]$/))) { if (i >= segs.length) return null; params[m[1]] = segs.slice(i); return params; }
      if ((m = p.match(/^\[(\w+)\]$/))) { if (i >= segs.length) return null; params[m[1]] = segs[i++]; continue; }
      if (segs[i] !== p) return null; i++;
    }
    return i === segs.length ? params : null;
  }
  function segsOf(p) { return p.split('/').filter(Boolean).map(function (s) { try { return decodeURIComponent(s); } catch (e) { return s; } }); }
  function matchRoute(list, pathname) {
    var segs = segsOf(pathname), best = null;
    list.forEach(function (r) { var p = matchSegs(r.segs, segs); if (p && (!best || r.score > best.route.score)) best = { route: r, params: p }; });
    return best;
  }

  /* ───────────── module loader (Babel → CommonJS) ───────────── */
  var compiled = {}, modCache = {};
  function transform(src, name) {
    if (compiled[name] && compiled[name].src === src) return compiled[name].code;
    if (!G.Babel) throw new Error('Babel failed to load (are you offline?). The Next.js simulator needs it to compile JSX/TypeScript.');
    var code;
    try {
      code = G.Babel.transform(src, { filename: name, sourceType: 'module', presets: [['env', { modules: 'commonjs', targets: { chrome: '100' } }], 'react', ['typescript', { allExtensions: true, isTSX: true }]] }).code;
    } catch (e) { var er = new Error('Compile error in ' + name + ': ' + String(e.message).replace(/^.*?:\s*/, '')); er.__compile = true; throw er; }
    compiled[name] = { src: src, code: code }; return code;
  }
  function missing(spec, from) { var e = new Error("Module not found: Can't resolve '" + spec + "' in '" + from + "'\n(The simulator supports react, next/*, and files you add with // FILE: lines.)"); e.code = 'MODULE_NOT_FOUND'; return e; }
  function resolveLocal(from, spec) {
    var base = /^@\//.test(spec) ? normName(spec.slice(2)) : normName(path.join(path.dirname(from), spec)), F = N.files;
    var tries = [base, base + '.js', base + '.jsx', base + '.ts', base + '.tsx', base + '.mjs', base + '.json', base + '/index.js', base + '/index.jsx', base + '/index.ts', base + '/index.tsx'];
    for (var i = 0; i < tries.length; i++) if (F[tries[i]] !== undefined) return tries[i];
    return null;
  }
  function cssModule(css, file) {
    var map = {}, tag = '_' + Math.abs(file.split('').reduce(function (a, c) { return (a * 31 + c.charCodeAt(0)) | 0; }, 7)).toString(36).slice(0, 5);
    var out = css.replace(/([^{}]+)\{/g, function (m, sel) { return sel.replace(/\.([A-Za-z_][\w-]*)/g, function (mm, n) { map[n] = n + tag; return '.' + n + tag; }) + '{'; });
    return { css: out, map: map };
  }
  function makeReq(from) {
    return function (spec) {
      var ext = externals(spec); if (ext) return ext;
      if (/^(\.{1,2}\/|@\/)/.test(spec)) {
        var f = resolveLocal(from, spec); if (!f) return sim.stubModule(spec, 'file');
        if (/\.module\.css$/.test(f)) { var cm = cssModule(N.files[f], f); inject(cm.css, f); return cm.map; }
        if (/\.css$/.test(f)) { inject(N.files[f], f); return {}; }
        if (/\.json$/.test(f)) return JSON.parse(N.files[f]);
        return load(f);
      }
      if (/\.css$/.test(spec)) return {};
      return sim.stubModule(spec, 'package');
    };
  }
  var injected = {};
  function inject(css, id) { if (injected[id]) return; injected[id] = 1; var s = document.createElement('style'); s.setAttribute('data-file', id); s.textContent = css; document.head.appendChild(s); }
  function load(file) {
    if (modCache[file]) return modCache[file].exports;
    var src = N.files[file]; if (src === undefined) throw missing(file, '/');
    var code = transform(src, file), mod = { exports: {} }; modCache[file] = mod;
    var fn = sim.defModule(code, 'next:' + file);
    if (!fn) { delete modCache[file]; throw new Error('Could not run ' + file); }
    try { fn.call(mod.exports, mod.exports, makeReq(file), mod, file, path.dirname(file)); } catch (e) { delete modCache[file]; throw e; }
    return mod.exports;
  }
  N.load = load;

  /* ───────────── React patching (async components, <html>/<body>, form actions) ───────────── */
  function patchReact() {
    var R = G.React; if (!R || R.__simPatched) return; R.__simPatched = true;
    var ce = R.createElement;
    function AsyncBoundary(props) {
      var st = R.useState({ v: null, done: false, e: null }), s = st[0], set = st[1], dv = N.dataVersion;
      R.useEffect(function () {
        var alive = true;
        Promise.resolve().then(function () { return props.__fn(props.__props); }).then(function (v) { if (alive) set({ v: v, done: true, e: null }); }, function (e) { if (alive) set({ v: null, done: true, e: e }); });
        return function () { alive = false; };
      }, [dv]); // eslint-disable-line
      if (s.e) throw s.e;
      if (!s.done) return N.loadingEl || null;
      return s.v === undefined ? null : s.v;
    }
    R.createElement = function (type, props) {
      var kids = Array.prototype.slice.call(arguments, 2);
      if (typeof type === 'function' && type.constructor && type.constructor.name === 'AsyncFunction') {
        var p = Object.assign({}, props); if (kids.length) p.children = kids.length === 1 ? kids[0] : kids;
        return ce(AsyncBoundary, { __fn: type, __props: p, key: props && props.key !== undefined ? props.key : undefined });
      }
      if (type === 'html' || type === 'body') { var q = Object.assign({}, props); q['data-next-' + type] = ''; if (type === 'body') q.style = Object.assign({ minHeight: '100%' }, q.style); delete q.lang; return ce.apply(R, ['div', q].concat(kids)); }
      if (type === 'head') return null;
      if (type === 'form' && props && typeof props.action === 'function') {
        var action = props.action, q2 = Object.assign({}, props), userSubmit = props.onSubmit; delete q2.action;
        q2.onSubmit = function (e) { e.preventDefault(); if (userSubmit) userSubmit(e); var fd = new FormData(e.currentTarget); Promise.resolve(action(fd)).then(function () { N.refresh(); }, function (er) { err('Server action failed: ' + (er && er.message)); }); };
        return ce.apply(R, ['form', q2].concat(kids));
      }
      return ce.apply(R, [type, props].concat(kids));
    };
    R.use = function (x) { if (x && typeof x.then === 'function') { if (x.__st === 'ok') return x.__v; if (x.__st === 'err') throw x.__e; if (!x.__st) { x.__st = 'pending'; x.then(function (v) { x.__st = 'ok'; x.__v = v; }, function (e) { x.__st = 'err'; x.__e = e; }); } throw x; } return R.useContext(x); };
    R.useActionState = function (action, initial) {
      var s = R.useState(initial), pend = R.useState(false);
      return [s[0], function (fd) { pend[1](true); return Promise.resolve(action(s[0], fd)).then(function (v) { s[1](v); pend[1](false); }, function (e) { pend[1](false); err(String(e && e.message)); }); }, pend[0]];
    };
    if (!R.cache) R.cache = function (fn) { return fn; };
    R.useOptimistic = function (v, reducer) { var s = R.useState(v); return [s[0], function (a) { s[1](reducer ? reducer(s[0], a) : a); }]; };
  }

  /* ───────────── navigation state ───────────── */
  var st = { path: '/', search: '' }, listeners = [], stack = [], idx = -1, navToken = 0;
  function subscribe(f) { listeners.push(f); return function () { listeners = listeners.filter(function (x) { return x !== f; }); }; }
  function notify() { N.version++; listeners.slice().forEach(function (f) { f(); }); if (N.onNav) N.onNav(st); }
  N.state = st;
  N.refresh = function () { N.dataVersion++; notify(); };
  N.navigate = function (href, o) {
    o = o || {}; var u;
    try { u = new URL(typeof href === 'object' ? (href.pathname || '') + (href.query ? '?' + new URLSearchParams(href.query) : '') : String(href), ORIGIN + st.path + (st.search || '')); } catch (e) { return Promise.resolve(); }
    if (u.origin !== ORIGIN) { try { G.open(u.href, '_blank'); } catch (e2) { /* popup blocked */ } return Promise.resolve(); }
    return go(u.pathname, u.search, !!o.replace, 0);
  };
  function go(p, search, replace, depth) {
    var token = ++navToken;
    return resolveNav(p, search).then(function (r) {
      if (token !== navToken) return;
      if (r.redirect && depth < 8) { var ru = new URL(r.redirect, ORIGIN); return go(ru.pathname, ru.search, true, depth + 1); }
      st.path = r.path; st.search = r.search; st.shown = { path: p, search: search };
      var entry = { path: p, search: search };
      if (replace && idx >= 0) stack[idx] = entry; else { stack = stack.slice(0, idx + 1); stack.push(entry); idx = stack.length - 1; }
      N.mwResponse = r.response || null; N.mwHeaders = r.headers || null; N.dataVersion++; notify();
    });
  }
  N.back = function () { if (idx > 0) { idx--; var e = stack[idx]; go2(e); } };
  N.forward = function () { if (idx < stack.length - 1) { idx++; go2(stack[idx]); } };
  function go2(e) { var token = ++navToken; resolveNav(e.path, e.search).then(function (r) { if (token !== navToken) return; st.path = r.path; st.search = r.search; N.mwResponse = r.response || null; N.dataVersion++; notify(); }); }
  N.canBack = function () { return idx > 0; }; N.canForward = function () { return idx < stack.length - 1; };

  /* ───────────── Request / Response classes ───────────── */
  function serializeCookie(name, val, o) {
    o = o || {}; var s = name + '=' + encodeURIComponent(val);
    if (o.maxAge != null) s += '; Max-Age=' + Math.floor(o.maxAge); s += '; Path=' + (o.path || '/'); if (o.expires) s += '; Expires=' + new Date(o.expires).toUTCString();
    if (o.httpOnly) s += '; HttpOnly'; if (o.secure) s += '; Secure'; if (o.sameSite) s += '; SameSite=' + o.sameSite; return s;
  }
  function cookieStore(read, write) {
    return {
      get: function (n) { var v = read()[n]; return v === undefined ? undefined : { name: n, value: v }; },
      getAll: function () { var c = read(); return Object.keys(c).map(function (k) { return { name: k, value: c[k] }; }); },
      has: function (n) { return read()[n] !== undefined; },
      set: function (n, v, o) { if (typeof n === 'object') { o = n; v = n.value; n = n.name; } write(n, String(v), o || {}); return this; },
      delete: function (n) { write(n, '', { expires: 0, maxAge: 0 }); return this; },
      toString: function () { var c = read(); return Object.keys(c).map(function (k) { return k + '=' + c[k]; }).join('; '); }
    };
  }
  function parseCookie(str) { var o = {}; String(str || '').split(/;\s*/).forEach(function (p) { var i = p.indexOf('='); if (i > 0) { try { o[p.slice(0, i)] = decodeURIComponent(p.slice(i + 1)); } catch (e) { o[p.slice(0, i)] = p.slice(i + 1); } } }); return o; }
  class NextURL extends URL { clone() { return new NextURL(this.href); } get basePath() { return ''; } get locale() { return ''; } }
  class NextRequest extends Request {
    constructor(input, init) {
      super(input, init && Object.assign({}, init, { headers: undefined }));
      var hs = new Headers(); var src = (init && init.headers) || {}; Object.keys(src).forEach(function (k) { try { hs.set(k, src[k]); } catch (e) { /* invalid */ } });
      Object.defineProperty(this, 'headers', { value: hs });
      var u = new NextURL(typeof input === 'string' ? input : input.url); Object.defineProperty(this, 'nextUrl', { value: u });
      var jar = parseCookie(hs.get('cookie')); Object.defineProperty(this, 'cookies', { value: cookieStore(function () { return jar; }, function (n, v) { jar[n] = v; }) });
      Object.defineProperty(this, 'ip', { value: '127.0.0.1' }); Object.defineProperty(this, 'geo', { value: {} });
    }
  }
  class NextResponse extends Response {
    constructor(body, init) {
      super(body, init); var self = this; this._cookies = [];
      Object.defineProperty(this, 'cookies', { value: cookieStore(function () { var o = {}; self._cookies.forEach(function (c) { var p = c.split(';')[0].split('='); o[p[0]] = decodeURIComponent(p.slice(1).join('=')); }); return o; }, function (n, v, o) { self._cookies.push(serializeCookie(n, v, o)); }) });
    }
    static json(data, init) { init = init || {}; var hs = new Headers(init.headers); if (!hs.has('content-type')) hs.set('content-type', 'application/json'); var st2 = init.status; var r = new NextResponse(st2 === 204 || st2 === 304 ? null : JSON.stringify(data), Object.assign({}, init, { headers: hs })); return r; }
    static redirect(url, init) { var status = typeof init === 'number' ? init : (init && init.status) || 307; var hs = new Headers(init && init.headers); hs.set('location', String(url)); return new NextResponse(null, { status: status, headers: hs }); }
    static rewrite(url, init) { var hs = new Headers(init && init.headers); hs.set('x-middleware-rewrite', String(url)); return new NextResponse(null, { headers: hs }); }
    static next(init) { var hs = new Headers(init && init.headers); hs.set('x-middleware-next', '1'); return new NextResponse(null, { headers: hs }); }
  }
  function makeRequest(method, url, headers, body) {
    var init = { method: method, headers: headers }; if (body && !/^(GET|HEAD)$/.test(method)) init.body = body;
    return new NextRequest(url.href, init);
  }
  async function toResult(res, extra, t0) {
    var headers = {}; res.headers.forEach(function (v, k) { if (k.indexOf('x-middleware-') !== 0) headers[k] = v; });
    if (extra) Object.keys(extra).forEach(function (k) { if (!(k in headers)) headers[k] = extra[k]; });
    var text = ''; try { text = await res.text(); } catch (e) { /* no body */ }
    return { status: res.status, statusText: res.statusText || sim.STATUS[res.status] || '', headers: headers, setCookie: res._cookies || [], body: text, bytes: new TextEncoder().encode(text).length, ms: performance.now() - t0 };
  }

  /* ───────────── middleware ───────────── */
  function matcherRe(p) {
    if (typeof p === 'object' && p) p = p.source;
    var s = String(p).replace(/[.+^${}|[\]\\]/g, function (c) { return c === '(' || c === ')' ? c : '\\' + c; }).replace(/\/:(\w+)\*/g, '(?:/.*)?').replace(/\/:(\w+)\+/g, '(?:/.+)').replace(/\/:(\w+)\?/g, '(?:/[^/]+)?').replace(/:(\w+)/g, '[^/]+');
    try { return new RegExp('^' + s + '$'); } catch (e) { return /.*/; }
  }
  async function runMiddleware(method, url, headers) {
    if (!N.table.mw) return null;
    var mod = load(N.table.mw), fn = mod.middleware || mod.default; if (typeof fn !== 'function') return null;
    var mt = mod.config && mod.config.matcher;
    if (mt) { var list = [].concat(mt); if (!list.some(function (m) { return matcherRe(m).test(url.pathname); })) return null; }
    var res = await fn(makeRequest(method, url, headers, ''), { waitUntil: function () { } });
    if (!res) return null;
    return res;
  }
  async function resolveNav(p, search) {
    var url = new URL(p + (search || ''), ORIGIN), headers = {}, jar = sim.jar || {}, jc = Object.keys(jar).map(function (k) { return k + '=' + jar[k]; }).join('; '); if (jc) headers.cookie = jc;
    var res; try { res = await runMiddleware('GET', url, headers); } catch (e) { err('middleware error: ' + e.message); return { path: p, search: search }; }
    if (!res) return { path: p, search: search };
    var loc = res.headers.get('location');
    if (res.status >= 300 && res.status < 400 && loc) return { redirect: loc, path: p, search: search };
    var rw = res.headers.get('x-middleware-rewrite');
    if (rw) { var ru = new URL(rw, ORIGIN); return { path: ru.pathname, search: ru.search, headers: {} }; }
    if (res.headers.get('x-middleware-next')) return { path: p, search: search, headers: {} };
    return { path: p, search: search, response: await toResult(res, null, performance.now()) };
  }

  /* ───────────── API dispatcher (fetch + tester) ───────────── */
  sim.dispatcher = async function (method, url, headers, body) {
    var t0 = performance.now(), pathname = url.pathname, extra = {}, res = null;
    try {
      var mw = await runMiddleware(method, url, headers);
      if (mw) {
        var loc = mw.headers.get('location'), rw = mw.headers.get('x-middleware-rewrite');
        if (rw) pathname = new URL(rw, ORIGIN).pathname;
        else if (mw.headers.get('x-middleware-next')) mw.headers.forEach(function (v, k) { if (k.indexOf('x-middleware-') !== 0) extra[k] = v; });
        else return toResult(mw, null, t0);
        if (loc) return toResult(mw, null, t0);
      }
      var m = matchRoute(N.table.apis, pathname);
      if (m) {
        var mod = load(m.route.file), fn = mod[method] || (method === 'HEAD' && mod.GET) || null;
        if (!fn) {
          var allowed = VERBS.filter(function (v) { return typeof mod[v] === 'function'; }); if (mod.GET && allowed.indexOf('HEAD') < 0) allowed.push('HEAD');
          if (method === 'OPTIONS') return toResult(new NextResponse(null, { status: 204, headers: { allow: allowed.concat('OPTIONS').join(', ') } }), extra, t0);
          return toResult(new NextResponse(null, { status: 405, headers: { allow: allowed.join(', ') } }), extra, t0);
        }
        var request = makeRequest(method, new URL(pathname + url.search, ORIGIN), headers, body);
        var out = await fn(request, { params: hybrid(m.params) });
        if (!(out instanceof Response)) { throw new Error('No response is returned from route handler \'' + m.route.file + '\'. Ensure you return a `Response` or a `NextResponse` in all branches of your handler.'); }
        return toResult(out, extra, t0);
      }
      var pa = matchRoute(N.table.pagesApi, pathname);
      if (pa) {
        var pm = load(pa.route.file), handler = pm.default; if (typeof handler !== 'function') throw new Error(pa.route.file + ' has no default export handler');
        var q = {}; new URL(pathname + url.search, ORIGIN).searchParams.forEach(function (v, k) { q[k] = k in q ? [].concat(q[k], v) : v; });
        return sim.handle(function (rq, rs) {
          rq.query = Object.assign(q, pa.params); rq.cookies = parseCookie(rq.headers.cookie);
          if (rq._body) { try { rq.body = /json/.test(rq.headers['content-type'] || '') ? JSON.parse(rq._body) : rq._body; } catch (e) { rq.body = rq._body; } }
          rs.status = function (c) { rs.statusCode = c; return rs; };
          rs.json = function (o) { rs.setHeader('content-type', 'application/json; charset=utf-8'); rs.end(JSON.stringify(o)); return rs; };
          rs.send = function (b) { if (typeof b === 'object' && b !== null) return rs.json(b); if (!rs.getHeader('content-type')) rs.setHeader('content-type', 'text/plain; charset=utf-8'); rs.end(String(b === undefined ? '' : b)); return rs; };
          rs.redirect = function (a, b2) { rs.statusCode = b2 ? a : 307; rs.setHeader('location', b2 || a); rs.end(); return rs; };
          return handler(rq, rs);
        }, method, pathname + url.search, headers, body, 3000);
      }
      var pg = matchRoute(N.table.pages, pathname);
      if (pg) return { status: 200, statusText: 'OK', headers: { 'content-type': 'text/html; charset=utf-8', 'x-simulator-note': 'page route' }, setCookie: [], body: '<!-- ' + pg.route.file + ' is a page. Open the "Page" tab to see it rendered. -->', bytes: 0, ms: performance.now() - t0 };
      return { status: 404, statusText: 'Not Found', headers: { 'content-type': 'text/html; charset=utf-8' }, setCookie: [], body: '<h1>404</h1><p>This page could not be found.</p>', bytes: 0, ms: performance.now() - t0 };
    } catch (e) {
      if (e && e.__procExit) throw e;
      err((e && e.stack ? String(e.stack).split('\n').slice(0, 4).join('\n') : String(e)));
      return { status: 500, statusText: 'Internal Server Error', headers: { 'content-type': 'text/plain; charset=utf-8' }, setCookie: [], body: 'Internal Server Error\n\n' + (e && e.message ? e.message : e), bytes: 0, ms: performance.now() - t0 };
    }
  };

  /* ───────────── next/* modules ───────────── */
  var EXT = null;
  function esm(o) { Object.defineProperty(o, '__esModule', { value: true }); return o; }
  function externals(spec) {
    if (!EXT) EXT = buildExternals();
    return EXT[spec] || null;
  }
  function redirectErr(url, type) { var e = new Error('NEXT_REDIRECT'); e.digest = 'NEXT_REDIRECT;' + (type || 'replace') + ';' + url; e.__url = url; return e; }
  function buildExternals() {
    var R = G.React, D = G.ReactDOM, E = {};
    function Link(p) {
      var href = p.href; if (href && typeof href === 'object') href = (href.pathname || '') + (href.query ? '?' + new URLSearchParams(href.query) : '');
      var rest = Object.assign({}, p); ['href', 'prefetch', 'replace', 'scroll', 'shallow', 'passHref', 'legacyBehavior', 'locale', 'as'].forEach(function (k) { delete rest[k]; });
      rest.href = href;
      var oc = p.onClick;
      rest.onClick = function (e) {
        if (oc) oc(e); if (e.defaultPrevented) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || (e.button && e.button !== 0) || p.target === '_blank' || /^(https?:)?\/\/|^(mailto|tel):/.test(href)) return;
        e.preventDefault(); N.navigate(href, { replace: p.replace });
      };
      if (p.legacyBehavior) return R.cloneElement(R.Children.only(p.children), { href: href, onClick: rest.onClick });
      return R.createElement('a', rest, p.children);
    }
    function Image(p) {
      var src = p.src && typeof p.src === 'object' ? p.src.src : p.src, style = Object.assign({}, p.style);
      if (p.fill) Object.assign(style, { position: 'absolute', inset: 0, width: '100%', height: '100%' });
      return R.createElement('img', { src: src, alt: p.alt || '', width: p.fill ? undefined : p.width, height: p.fill ? undefined : p.height, className: p.className, style: style, loading: p.priority ? 'eager' : 'lazy', id: p.id, onClick: p.onClick });
    }
    E['next/link'] = esm({ default: Link }); E['next/image'] = esm({ default: Image });
    E['next/script'] = esm({ default: function () { return null; } });
    E['next/head'] = esm({ default: function (p) { var kids = R.Children.toArray(p.children); kids.forEach(function (k) { if (k && k.type === 'title') document.title = [].concat(k.props.children).join(''); }); return null; } });
    E['next/dynamic'] = esm({ default: function (loader, o) {
      var Lazy = R.lazy(function () { return Promise.resolve(loader()).then(function (m) { return { default: (m && m.default) || m }; }); });
      return function (p) { return R.createElement(R.Suspense, { fallback: o && o.loading ? R.createElement(o.loading) : null }, R.createElement(Lazy, p)); };
    } });
    function useLoc(cb) { return R.useSyncExternalStore(subscribe, function () { return N.version; }) && cb(); }
    var nav = {
      useRouter: function () { return R.useMemo(function () { return { push: function (h2, o) { return N.navigate(h2, o); }, replace: function (h2, o) { return N.navigate(h2, Object.assign({}, o, { replace: true })); }, back: N.back, forward: N.forward, refresh: N.refresh, prefetch: function () { return Promise.resolve(); } }; }, []); },
      usePathname: function () { return useLoc(function () { return st.shown ? st.shown.path : st.path; }); },
      useSearchParams: function () { var s = useLoc(function () { return st.shown ? st.shown.search : st.search; }); return R.useMemo(function () { return new URLSearchParams(s); }, [s]); },
      useParams: function () { useLoc(function () { return 0; }); var m = matchRoute(N.table.pages, st.path); return (m && m.params) || {}; },
      useSelectedLayoutSegment: function () { return segsOf(st.path)[0] || null; }, useSelectedLayoutSegments: function () { return segsOf(st.path); },
      redirect: function (url, type) { throw redirectErr(url, type); }, permanentRedirect: function (url) { throw redirectErr(url, 'replace'); },
      notFound: function () { var e = new Error('NEXT_NOT_FOUND'); e.digest = 'NEXT_NOT_FOUND'; throw e; }
    };
    E['next/navigation'] = esm(nav);
    E['next/router'] = esm({ useRouter: function () { var p = nav.usePathname(), s = nav.useSearchParams(), q = {}; s.forEach(function (v, k) { q[k] = v; }); var m = matchRoute(N.table.pages, p); return Object.assign({ pathname: m ? m.route.pattern.replace(/\/\[(\w+)\]/g, '/[$1]') : p, asPath: p + (s.toString() ? '?' + s : ''), query: Object.assign({}, m && m.params, q), route: p, isReady: true, push: N.navigate, replace: function (h2) { return N.navigate(h2, { replace: true }); }, back: N.back, reload: N.refresh, prefetch: function () { return Promise.resolve(); }, events: { on: function () { }, off: function () { } } }); } });
    E['next/server'] = esm({ NextResponse: NextResponse, NextRequest: NextRequest, userAgent: function (r) { return { ua: r.headers.get('user-agent') || '', isBot: false, browser: {}, device: {}, os: {} }; }, after: function (f) { Promise.resolve().then(f); } });
    E['next/headers'] = esm({
      cookies: function () { var c = cookieStore(function () { return sim.jar || {}; }, function (n, v, o) { if (!sim.jar) sim.jar = {}; if (o && (o.maxAge === 0 || o.expires === 0)) delete sim.jar[n]; else sim.jar[n] = v; }); return hybrid(c); },
      headers: function () { return hybrid(new Headers({ host: 'localhost:3000', 'user-agent': navigator.userAgent, accept: '*/*' })); },
      draftMode: function () { return hybrid({ isEnabled: false, enable: function () { }, disable: function () { } }); }
    });
    E['next/cache'] = esm({ revalidatePath: function () { setTimeout(N.refresh, 0); }, revalidateTag: function () { setTimeout(N.refresh, 0); }, unstable_cache: function (fn) { return fn; }, unstable_noStore: function () { }, noStore: function () { } });
    var fontFn = function (k) { return function () { return { className: 'font-' + String(k).toLowerCase(), variable: '--font-' + String(k).toLowerCase(), style: { fontFamily: String(k).replace(/_/g, ' ') + ', system-ui, sans-serif' } }; }; };
    E['next/font/google'] = new Proxy({}, { get: function (_t, k) { return k === '__esModule' ? true : fontFn(k); } });
    E['next/font/local'] = esm({ default: fontFn('local') });
    E.next = esm({}); E['server-only'] = {}; E['client-only'] = {};
    E.react = R; E['react/jsx-runtime'] = { jsx: function (t, p) { var c = p && p.children; var q = Object.assign({}, p); delete q.children; return c === undefined ? R.createElement(t, q) : R.createElement.apply(R, [t, q].concat(c)); }, jsxs: function (t, p) { var q = Object.assign({}, p), c = q.children; delete q.children; return R.createElement.apply(R, [t, q].concat(c)); }, Fragment: R.Fragment };
    E['react-dom'] = Object.assign({}, D, { useFormStatus: function () { return { pending: false, data: null, method: null, action: null }; }, useFormState: R.useActionState });
    E['react-dom/client'] = D;
    return E;
  }

  /* ───────────── page rendering ───────────── */
  function notFoundEl() {
    var dirs = ['']; var f = N.table.notFound[''];
    if (f) { try { var C = load(f).default; if (C) return G.React.createElement(C); } catch (e) { err(e.message); } }
    return G.React.createElement('div', { style: { minHeight: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui', color: '#111', gap: 16, padding: 24 } }, G.React.createElement('h1', { style: { fontSize: 24, margin: 0, borderRight: '1px solid #ccc', paddingRight: 16 } }, '404'), G.React.createElement('span', { style: { fontSize: 14 } }, 'This page could not be found.'));
    void dirs;
  }
  function ancestors(dir) { var parts = dir.split('/').filter(Boolean), out = ['']; parts.forEach(function (_p, i) { out.push(parts.slice(0, i + 1).join('/')); }); return out; }
  function resolveTitle(mods, params, sp) {
    var template = null, title = null;
    return mods.reduce(function (p, mod) {
      return p.then(function () { return typeof mod.generateMetadata === 'function' ? mod.generateMetadata({ params: hybrid(params), searchParams: hybrid(sp) }, Promise.resolve({})) : mod.metadata; }).then(function (md) {
        if (!md || md.title === undefined) return; var t = md.title;
        if (typeof t === 'string') { title = template ? template.replace('%s', t) : t; }
        else if (t && typeof t === 'object') { if (t.template) template = t.template; if (t.absolute) title = t.absolute; else if (t.default) title = t.default; }
      });
    }, Promise.resolve()).then(function () { return title; });
  }
  function buildView() {
    var R = G.React, p = st.path, search = st.search, sp = {};
    new URLSearchParams(search).forEach(function (v, k) { sp[k] = k in sp ? [].concat(sp[k], v) : v; });
    if (N.mwResponse) {
      var r = N.mwResponse;
      return R.createElement('pre', { style: { margin: 0, padding: 16, fontFamily: 'ui-monospace,monospace', fontSize: 13, whiteSpace: 'pre-wrap', color: '#111' } }, 'Middleware responded with ' + r.status + ' ' + r.statusText + '\n\n' + r.body);
    }
    var m = matchRoute(N.table.pages, p);
    if (!m) {
      N.pending = null; var nf = notFoundEl(), rootLayout = N.table.layouts[''];
      if (rootLayout) { try { nf = R.createElement(load(rootLayout).default, { params: hybrid({}), key: 'layout:' + rootLayout }, nf); } catch (e) { err(e.message); } }
      return nf;
    }
    var mods = [], dirs = ancestors(m.route.dir), Page;
    var pm = load(m.route.file); Page = pm.default;
    if (typeof Page !== 'function') throw new Error(m.route.file + ' must export a default React component.');
    var loadingFile = null; dirs.forEach(function (d) { if (N.table.loading[d]) loadingFile = N.table.loading[d]; });
    N.loadingEl = null; if (loadingFile) { try { var LC = load(loadingFile).default; if (LC) N.loadingEl = R.createElement(LC); } catch (e) { err(e.message); } }
    var el = R.createElement(Boundary, { key: p + search }, R.createElement(R.Suspense, { fallback: N.loadingEl }, R.createElement(Page, Object.assign({}, N.sample[m.route.file] || {}, { params: hybrid(m.params), searchParams: hybrid(sp), key: p + search }))));
    for (var i = dirs.length - 1; i >= 0; i--) {
      var lf = N.table.layouts[dirs[i]]; if (!lf) continue;
      var lm = load(lf); mods.unshift(lm);
      if (typeof lm.default !== 'function') throw new Error(lf + ' must export a default layout component.');
      el = R.createElement(lm.default, { params: hybrid(m.params), key: 'layout:' + lf }, el);
    }
    mods.push(pm); N.pending = { mods: mods, params: m.params, sp: sp };
    return R.createElement(Boundary, { key: 'outer:' + p + search }, el);
  }
  var Boundary = null;
  function makeBoundary() {
    var R = G.React;
    Boundary = class extends R.Component {
      constructor(p) { super(p); this.state = { e: null }; }
      static getDerivedStateFromError(e) { return { e: e }; }
      componentDidCatch(e) {
        if (e && /^NEXT_REDIRECT/.test(e.digest || '')) { setTimeout(function () { N.navigate(e.__url, { replace: true }); }, 0); return; }
        if (e && e.digest === 'NEXT_NOT_FOUND') return;
        err('Unhandled Runtime Error: ' + (e && e.message ? e.message : e));
      }
      render() {
        var e = this.state.e, self = this; if (!e) return this.props.children;
        if (e.digest === 'NEXT_NOT_FOUND') return notFoundEl();
        if (/^NEXT_REDIRECT/.test(e.digest || '')) return null;
        var ef = null; ancestors(matchRoute(N.table.pages, st.path) ? matchRoute(N.table.pages, st.path).route.dir : '').forEach(function (d) { if (N.table.error[d]) ef = N.table.error[d]; });
        if (ef) { try { var EC = load(ef).default; return R.createElement(EC, { error: e, reset: function () { self.setState({ e: null }); N.refresh(); } }); } catch (x) { err(x.message); } }
        return R.createElement('div', { style: { margin: 16, padding: 16, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#991b1b', fontFamily: 'ui-monospace,Menlo,monospace', fontSize: 13, whiteSpace: 'pre-wrap' } }, R.createElement('strong', null, 'Unhandled Runtime Error'), '\n\n' + (e && e.message ? e.message : String(e)));
      }
    };
  }
  function App() {
    var R = G.React; R.useSyncExternalStore(subscribe, function () { return N.version; });
    var view; try { view = buildView(); } catch (e) { post('e', '❌ ' + e.message); view = R.createElement('div', { style: { margin: 16, padding: 16, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#991b1b', fontFamily: 'ui-monospace,Menlo,monospace', fontSize: 13, whiteSpace: 'pre-wrap' } }, R.createElement('strong', null, e.__compile ? 'Compile error' : 'Error'), '\n\n' + e.message); }
    R.useEffect(function () {
      var pend = N.pending; N.pending = null; if (!pend) { document.title = 'Next.js App'; if (N.onTitle) N.onTitle('404: This page could not be found.'); return; }
      resolveTitle(pend.mods, pend.params, pend.sp).then(function (t) { document.title = t || 'Next.js App'; if (N.onTitle) N.onTitle(document.title); }, function () { });
    }, [st.path, st.search, N.dataVersion]);
    return view;
  }

  /* ───────────── request-body sample for tester chips ───────────── */
  function sampleFromSource(src) {
    var keys = [], m, re = /(?:const|let|var)\s*\{([^}]+)\}\s*=\s*(?:await\s+)?(?:request|req)\.json\(\)/g;
    while ((m = re.exec(src))) m[1].split(',').forEach(function (k) { k = k.split(':')[0].split('=')[0].trim(); if (k && k.indexOf('...') < 0 && keys.indexOf(k) < 0) keys.push(k); });
    var vm = src.match(/(?:const|let|var)\s+(\w+)\s*=\s*(?:await\s+)?(?:request|req)\.json\(\)/);
    if (vm) { var re2 = new RegExp('\\b' + vm[1] + '\\.(\\w+)', 'g'); while ((m = re2.exec(src))) if (keys.indexOf(m[1]) < 0) keys.push(m[1]); }
    if (!keys.length) return undefined;
    var g = { name: 'Alice', email: 'alice@example.com', password: 'secret123', title: 'Hello World', content: 'Some content', text: 'Buy milk', completed: false, price: 19.99, age: 25, id: 1, username: 'alice', message: 'Hi there' }, o = {};
    keys.forEach(function (k) { o[k] = k in g ? g[k] : 'value'; }); return JSON.stringify(o, null, 2);
  }

  /* ───────────── boot ───────────── */
  /* ───────────── lenient preparation of lesson fragments ───────────── */
  N.sample = {};
  var SAMPLE_PROPS = [
    [/^(items|list|users|products|todos|posts|messages|orders|comments|tasks|data|results|options|rows|entries|notifications|articles|projects)$/i, function () { return [{ id: 1, name: 'Apple', title: 'First', text: 'Hello', done: false, price: 3 }, { id: 2, name: 'Banana', title: 'Second', text: 'Hi', done: true, price: 5 }]; }],
    [/^(user|person|item|product|post|todo|order|profile|account|comment|task|student|article|project|session)$/i, function () { return { id: 1, name: 'Alice', email: 'alice@example.com', title: 'Sample', price: 9.99, image: '', user: { name: 'Alice', email: 'alice@example.com' } }; }],
    [/^(error)$/i, function () { var e = new Error('Something went wrong'); e.digest = 'abc123'; return e; }],
    [/^(count|total|index|id|age|price|amount|quantity|size|value|number|step|max|min|initial|initialCount|width|height|delay|likes|page)$/i, function () { return 3; }],
    [/^(on[A-Z]\w*|handle\w+|set[A-Z]\w*|callback|fn|reset|action)$/, function () { return function () { }; }],
    [/^(is\w+|has\w+|show\w+|disabled|active|loading|visible|open|checked|selected|done|completed)$/, function () { return true; }],
    [/^(title|name|label|text|message|description|href|src|alt|slug|email|url)$/i, function () { return 'Sample'; }]
  ];
  function propsFor(src, comp) {
    var m = src.match(new RegExp('function\\s+' + comp + '\\s*\\(\\s*\\{([^}]*)\\}')) || src.match(new RegExp('const\\s+' + comp + '\\s*=\\s*(?:async\\s*)?\\(\\s*\\{([^}]*)\\}')) || src.match(new RegExp('function\\s+' + comp + '\\s*\\(\\s*\\{([^}]*)\\}'));
    var out = {}; if (!m) return out;
    m[1].split(',').forEach(function (p) {
      var nm = p.split('=')[0].split(':')[0].replace(/^\.\.\./, '').trim(); if (!nm || /^(params|searchParams|children)$/.test(nm)) return;
      for (var i = 0; i < SAMPLE_PROPS.length; i++) if (SAMPLE_PROPS[i][0].test(nm)) { out[nm] = SAMPLE_PROPS[i][1](); return; }
      out[nm] = 'Sample ' + nm;
    });
    return out;
  }
  function babelOk(t, name) { try { G.Babel.transform(t, { filename: name, sourceType: 'module', presets: [['env', { modules: 'commonjs', targets: { chrome: '100' } }], 'react', ['typescript', { allExtensions: true, isTSX: true }]] }); return true; } catch (e) { return false; } }
  // the same const / function / export written twice (alternative versions) -> keep them all runnable
  function dedupeModule(src) {
    var seen = {}, dups = 0;
    var out = src.replace(/^(export\s+(?:default\s+)?)?(const|let|var|async\s+function|function|class)(\s+)(\w+)/gm, function (all, exp, kw, sp, name) {
      if (!seen[name]) { seen[name] = 1; return all; }
      dups++; var kw2 = /^(const|let)$/.test(kw) ? 'var' : kw; return kw2 + sp + name;
    });
    return { code: out, dups: dups };
  }
  N.prepare = function (files) {
    var out = {}, notes = [];
    Object.keys(files).forEach(function (k) {
      var name = normName(k), src = files[k];
      if (!/\.(js|jsx|ts|tsx|mjs)$/.test(name) || !G.Babel) { out[name] = src; return; }
      var d = dedupeModule(src); if (d.dups && !babelOk(src, name)) { src = d.code; notes.push('Alternative versions of the same name in ' + name + ' were kept apart.'); }
      if (!babelOk(src, name)) { var r = sim.skipBroken(src, function (t) { return babelOk(t, name); }); if (r.code !== src) { src = r.code; if (r.skipped) notes.push('Skipped ' + r.skipped + ' part' + (r.skipped > 1 ? 's' : '') + ' of ' + name + ' that ' + (r.skipped > 1 ? 'are' : 'is') + ' not JavaScript/TypeScript (a config file, shell line or illustration).'); } }
      // a page file without a default export (a client component, a hook…): render the first component it defines
      if (/(^|\/)page\.(js|jsx|ts|tsx)$/.test(name) && !/export\s+default\b/.test(src) && babelOk(src, name)) {
        var cm = src.match(/export\s+(?:async\s+)?function\s+([A-Z]\w*)/) || src.match(/export\s+const\s+([A-Z]\w*)\s*=/) || src.match(/(?:^|\n)\s*(?:async\s+)?function\s+([A-Z]\w*)/) || src.match(/(?:^|\n)\s*const\s+([A-Z]\w*)\s*=\s*(?:\(|async|[a-z])/);
        if (cm) { N.sample[name] = propsFor(src, cm[1]); src += '\nexport default ' + cm[1] + ';\n'; notes.push('Rendering the ' + cm[1] + ' component this snippet defines.'); }
        else { src += "\nexport default function __Info() { return React.createElement('div', { style: { padding: 16, fontFamily: 'system-ui', color: '#111' } }, React.createElement('h3', { style: { margin: '0 0 8px' } }, '\\u2713 Compiled successfully'), React.createElement('p', { style: { margin: 0, color: '#444' } }, 'This snippet defines types, configuration or helper code \\u2014 it has nothing to render on its own.')); }\n"; notes.push('No page component in this snippet.'); }
      } else if (/(^|\/)page\.(js|jsx|ts|tsx)$/.test(name)) {
        var dm = src.match(/export\s+default\s+(?:async\s+)?function\s+([A-Z]\w*)/) || src.match(/export\s+default\s+([A-Z]\w*)\s*;?/);
        if (dm) N.sample[name] = propsFor(src, dm[1]);
      }
      if (/(^|\/)layout\.(js|jsx|ts|tsx)$/.test(name) && !/export\s+default\b/.test(src) && babelOk(src, name)) {
        src += "\nexport default function __Layout(props) { return React.createElement('html', null, React.createElement('body', null, props.children)); }\n";
        notes.push('This layout snippet had no default component \u2014 added a plain <html><body>{children}</body></html> layout.');
      }
      if (G.Babel && sim.stubUndefined) { try { sim.stubUndefined(src); } catch (e) { /* best effort */ } }
      out[name] = src;
    });
    notes.forEach(function (n) { post('l', '\u2139\ufe0f ' + n); });
    return out;
  };

  N.run = function (files) {
    var R = G.React, D = G.ReactDOM;
    sim.lenient = true; N.sample = {};
    var prepared = N.prepare(files);
    N.files = {}; Object.keys(prepared).forEach(function (k) { N.files[normName(k)] = prepared[k]; });
    if (!R || !D) { sim.ui.init({ title: 'Next.js Simulator' }); ui.error('React failed to load from the CDN (are you offline?). The Next.js simulator needs React to render pages.'); return; }
    N.table = buildTable(N.files);
    patchReact(); makeBoundary();
    var t = N.table, hasPages = t.pages.length > 0, hasApis = t.apis.length + t.pagesApi.length > 0;
    var shell = ui.init({ title: 'Next.js Simulator', sub: 'App Router · runs entirely in your browser' });
    if (!hasPages && !hasApis) {
      var el0 = h('div', {}); el0.appendChild(ui.note('<b>No routes found.</b> Add files with a <code>// FILE: app/page.js</code> or <code>// FILE: app/api/hello/route.js</code> line.<br><br>Pages: <code>app/page.js</code>, <code>app/about/page.js</code>, <code>app/blog/[slug]/page.js</code><br>API: <code>app/api/users/route.js</code> exporting <code>GET</code>, <code>POST</code>…'));
      shell.addTab('help', 'Help', el0); return;
    }
    shell.live(true);
    if (hasPages) {
      var pane = h('div', {}), back = h('button', { class: 'sm-mini', text: '←', title: 'Back', onclick: N.back }), fwd = h('button', { class: 'sm-mini', text: '→', title: 'Forward', onclick: N.forward }), rel = h('button', { class: 'sm-mini', text: '↻', title: 'Refresh', onclick: N.refresh });
      var addr = h('input', { class: 'sm-in', spellcheck: 'false', value: '/', 'aria-label': 'Address' }), title = h('span', { class: 'sm-sub', text: '' });
      var sel = h('select', { class: 'sm-sel', title: 'Jump to a page', style: 'max-width:150px' }, h('option', { text: 'Pages ▾', value: '' }));
      t.pages.slice().sort(function (a, b) { return a.pattern.length - b.pattern.length; }).forEach(function (pg) { sel.appendChild(h('option', { text: pg.pattern, value: pg.pattern.replace(/\[\[?\.\.\.(\w+)\]\]?/g, 'a/b').replace(/\[(\w+)\]/g, '1') })); });
      sel.addEventListener('change', function () { if (sel.value) N.navigate(sel.value); sel.value = ''; });
      addr.addEventListener('keydown', function (e) { if (e.key === 'Enter') N.navigate(addr.value.trim() || '/'); });
      var bar = h('div', { class: 'sm-row', style: 'align-items:center' }, back, fwd, rel, h('span', { class: 'sm-sub', text: 'localhost:3000' }), addr, sel);
      var view = h('div', { class: 'sm-view', id: 'next-view' });
      pane.appendChild(bar); pane.appendChild(h('div', { style: 'margin:0 0 6px' }, title)); pane.appendChild(view);
      shell.addTab('page', 'Page', pane);
      if (!document.getElementById('sim-next-css')) document.head.appendChild(h('style', { id: 'sim-next-css', text: '.sm-view{background:#fff;color:#111;border:1px solid #30363d;border-radius:8px;min-height:220px;overflow:auto;font:15px/1.5 system-ui,sans-serif}.sm-view a{color:#2563eb}.sm-view *{box-sizing:border-box}[data-next-html],[data-next-body]{display:block}' }));
      N.onNav = function (s) { addr.value = (s.shown ? s.shown.path + s.shown.search : s.path + s.search); back.disabled = !N.canBack(); fwd.disabled = !N.canForward(); back.style.opacity = N.canBack() ? 1 : .4; fwd.style.opacity = N.canForward() ? 1 : .4; };
      N.onTitle = function (tt) { title.textContent = '🗂 tab title: ' + tt; };
      D.createRoot(view).render(G.React.createElement(App));
      var start = matchRoute(t.pages, '/') ? '/' : (t.pages.filter(function (p2) { return !/\[/.test(p2.pattern); })[0] || t.pages[0]).pattern.replace(/\[\[?\.\.\.(\w+)\]\]?/g, 'a').replace(/\[(\w+)\]/g, '1');
      N.navigate(start);
    }
    if (hasApis) {
      var routes = [];
      t.apis.forEach(function (r) {
        var mod; try { mod = load(r.file); } catch (e) { err('❌ ' + e.message); return; }
        var pat = r.pattern.replace(/\[\[?\.\.\.(\w+)\]\]?/g, ':$1*').replace(/\[(\w+)\]/g, ':$1');
        VERBS.forEach(function (v) { if (typeof mod[v] === 'function') routes.push({ method: v, label: v, path: pat, sample: /^(POST|PUT|PATCH)$/.test(v) ? sampleFromSource(String(mod[v])) : undefined }); });
      });
      t.pagesApi.forEach(function (r) { routes.push({ method: 'GET', label: 'ANY', path: r.pattern.replace(/\[(\w+)\]/g, ':$1') }); });
      var tester = ui.tester({ routes: routes, defaultPath: (routes.filter(function (r) { return r.method === 'GET' && !/:/.test(r.path); })[0] || { path: '/api' }).path, send: function (m, p2, hd, body) { return sim.dispatch(m, /^https?:\/\//i.test(p2) ? p2 : ORIGIN + p2, hd, body); } });
      var pane2 = h('div', {}); pane2.appendChild(tester.el); shell.addTab('api', 'API tester', pane2);
      var firstGet = routes.filter(function (r) { return r.method === 'GET' && !/:/.test(r.path); })[0];
      if (firstGet) tester.setPath('GET', firstGet.path);
      if (!hasPages && firstGet) tester.send();
    }
    if (hasPages) shell.show('page'); else shell.show('api');
  };
})(window);
