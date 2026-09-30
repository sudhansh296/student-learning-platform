/* WebDev Atlas — in-browser Node.js runtime (core modules).
 * Powers the Express / Next.js / multi-file Node playground modes. It is a *teaching simulator*:
 * real behaviour for the language and core modules, a virtual in-memory filesystem, no network sockets. */
(function (G) {
  'use strict';
  var sim = (G.__sim = G.__sim || {});
  sim.outCount = 0;
  var post = function (t, m) { if (t === 'l' || t === 'w') sim.outCount++; if (typeof G.__post === 'function') G.__post(t, m); };
  sim.post = post;

  /* ───────────── EventEmitter ───────────── */
  function ev(t) { return t._ev || (t._ev = {}); }
  function EventEmitter() { ev(this); }
  var EP = EventEmitter.prototype;
  EP.on = EP.addListener = function (n, f) { (ev(this)[n] = ev(this)[n] || []).push(f); return this; };
  EP.prependListener = function (n, f) { (ev(this)[n] = ev(this)[n] || []).unshift(f); return this; };
  EP.once = function (n, f) { var s = this; function w() { s.off(n, w); return f.apply(s, arguments); } w._orig = f; return this.on(n, w); };
  EP.off = EP.removeListener = function (n, f) {
    var l = ev(this)[n]; if (!l) return this;
    for (var i = l.length - 1; i >= 0; i--) if (l[i] === f || l[i]._orig === f) { l.splice(i, 1); break; }
    return this;
  };
  EP.removeAllListeners = function (n) { if (n) delete ev(this)[n]; else this._ev = {}; return this; };
  EP.emit = function (n) {
    var l = ev(this)[n], args = Array.prototype.slice.call(arguments, 1);
    if (!l || !l.length) {
      if (n === 'error') { throw args[0] instanceof Error ? args[0] : new Error('Unhandled error. (' + String(args[0]) + ')'); }
      return false;
    }
    l.slice().forEach(function (f) { f.apply(this, args); }, this);
    return true;
  };
  EP.listenerCount = function (n) { return (ev(this)[n] || []).length; };
  EP.listeners = function (n) { return (ev(this)[n] || []).slice(); };
  EP.eventNames = function () { return Object.keys(ev(this)); };
  EP.setMaxListeners = function () { return this; };
  EP.getMaxListeners = function () { return 10; };
  EventEmitter.EventEmitter = EventEmitter;
  EventEmitter.defaultMaxListeners = 10;
  EventEmitter.once = function (em, name) { return new Promise(function (res, rej) { em.once(name, function () { res(Array.prototype.slice.call(arguments)); }); if (name !== 'error') em.once('error', rej); }); };
  sim.EventEmitter = EventEmitter;

  /* ───────────── Buffer ───────────── */
  function b64(bytes) { var s = ''; for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]); return btoa(s); }
  class Buffer extends Uint8Array {
    static from(v, enc) {
      var bytes;
      if (typeof v === 'string') {
        enc = (enc || 'utf8').toLowerCase();
        if (enc === 'hex') { bytes = new Uint8Array(v.length >> 1); for (var i = 0; i < bytes.length; i++) bytes[i] = parseInt(v.substr(i * 2, 2), 16); }
        else if (enc === 'base64' || enc === 'base64url') { var bin = atob(v.replace(/-/g, '+').replace(/_/g, '/')); bytes = Uint8Array.from(bin, function (c) { return c.charCodeAt(0); }); }
        else if (enc === 'ascii' || enc === 'latin1' || enc === 'binary') bytes = Uint8Array.from(v, function (c) { return c.charCodeAt(0) & 255; });
        else bytes = new TextEncoder().encode(v);
      } else if (v instanceof ArrayBuffer) bytes = new Uint8Array(v);
      else if (v && v.type === 'Buffer' && Array.isArray(v.data)) bytes = Uint8Array.from(v.data);
      else bytes = Uint8Array.from(v || []);
      var b = new Buffer(bytes.length); b.set(bytes); return b;
    }
    static alloc(n, fill) { var b = new Buffer(n); if (fill !== undefined) b.fill(typeof fill === 'string' ? fill.charCodeAt(0) : fill); return b; }
    static allocUnsafe(n) { return new Buffer(n); }
    static isBuffer(b) { return b instanceof Buffer; }
    static byteLength(s, enc) { return typeof s === 'string' ? Buffer.from(s, enc).length : s.length; }
    static concat(list) { var n = 0; list.forEach(function (b) { n += b.length; }); var out = new Buffer(n), o = 0; list.forEach(function (b) { out.set(b, o); o += b.length; }); return out; }
    static compare(a, b) { return a.compare(b); }
    toString(enc, s, e) {
      enc = (enc || 'utf8').toLowerCase();
      var v = (s || e !== undefined) ? this.subarray(s || 0, e === undefined ? this.length : e) : this;
      if (enc === 'hex') { var h = ''; for (var i = 0; i < v.length; i++) h += (v[i] < 16 ? '0' : '') + v[i].toString(16); return h; }
      if (enc === 'base64') return b64(v);
      if (enc === 'base64url') return b64(v).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      if (enc === 'ascii' || enc === 'latin1' || enc === 'binary') { var t = ''; for (var j = 0; j < v.length; j++) t += String.fromCharCode(v[j]); return t; }
      return new TextDecoder().decode(v);
    }
    toJSON() { return { type: 'Buffer', data: Array.prototype.slice.call(this) }; }
    equals(o) { if (this.length !== o.length) return false; for (var i = 0; i < this.length; i++) if (this[i] !== o[i]) return false; return true; }
    compare(o) { var n = Math.min(this.length, o.length); for (var i = 0; i < n; i++) if (this[i] !== o[i]) return this[i] < o[i] ? -1 : 1; return this.length === o.length ? 0 : this.length < o.length ? -1 : 1; }
    write(s, off) { var b = Buffer.from(s); this.set(b.subarray(0, this.length - (off || 0)), off || 0); return b.length; }
    readUInt8(o) { return this[o || 0]; }
    writeUInt8(v, o) { this[o || 0] = v; return (o || 0) + 1; }
    readUInt16BE(o) { o = o || 0; return (this[o] << 8) | this[o + 1]; }
    readUInt32BE(o) { o = o || 0; return ((this[o] << 24) | (this[o + 1] << 16) | (this[o + 2] << 8) | this[o + 3]) >>> 0; }
    writeUInt32BE(v, o) { o = o || 0; this[o] = v >>> 24; this[o + 1] = v >>> 16; this[o + 2] = v >>> 8; this[o + 3] = v; return o + 4; }
    slice(s, e) { return Buffer.from(Uint8Array.prototype.slice.call(this, s, e)); }
  }
  sim.Buffer = Buffer;
  if (!G.Buffer) G.Buffer = Buffer;

  /* ───────────── path (posix) ───────────── */
  function normArr(parts, abs) {
    var out = [];
    parts.forEach(function (p) { if (!p || p === '.') return; if (p === '..') { if (out.length && out[out.length - 1] !== '..') out.pop(); else if (!abs) out.push('..'); } else out.push(p); });
    return out;
  }
  var path = {
    sep: '/', delimiter: ':',
    normalize: function (p) { var abs = p.charAt(0) === '/', trail = /\/$/.test(p); var r = normArr(p.split('/'), abs).join('/'); if (!r && !abs) r = '.'; if (r && trail) r += '/'; return (abs ? '/' : '') + r; },
    join: function () { var a = Array.prototype.filter.call(arguments, Boolean).join('/'); return a ? path.normalize(a) : '.'; },
    resolve: function () {
      var res = '', abs = false;
      for (var i = arguments.length - 1; i >= -1 && !abs; i--) { var p = i >= 0 ? arguments[i] : '/app'; if (!p) continue; res = p + '/' + res; abs = p.charAt(0) === '/'; }
      var r = normArr(res.split('/'), abs).join('/'); return (abs ? '/' : '') + r || '.';
    },
    isAbsolute: function (p) { return p.charAt(0) === '/'; },
    dirname: function (p) { var s = p.replace(/\/+$/, ''); var i = s.lastIndexOf('/'); if (i < 0) return '.'; if (i === 0) return '/'; return s.slice(0, i); },
    basename: function (p, ext) { var b = p.replace(/\/+$/, '').split('/').pop(); if (ext && b.slice(-ext.length) === ext && b !== ext) b = b.slice(0, -ext.length); return b; },
    extname: function (p) { var b = path.basename(p), i = b.lastIndexOf('.'); return i <= 0 ? '' : b.slice(i); },
    relative: function (from, to) {
      var f = path.resolve(from).split('/').filter(Boolean), t = path.resolve(to).split('/').filter(Boolean), i = 0;
      while (i < f.length && i < t.length && f[i] === t[i]) i++;
      return f.slice(i).map(function () { return '..'; }).concat(t.slice(i)).join('/');
    },
    parse: function (p) { var base = path.basename(p), ext = path.extname(p); return { root: p.charAt(0) === '/' ? '/' : '', dir: path.dirname(p) === '.' && p.indexOf('/') < 0 ? '' : path.dirname(p), base: base, ext: ext, name: ext ? base.slice(0, -ext.length) : base }; },
    format: function (o) { var base = o.base || ((o.name || '') + (o.ext || '')); return o.dir ? o.dir + '/' + base : (o.root || '') + base; },
    toNamespacedPath: function (p) { return p; }
  };
  path.posix = path; path.win32 = path;
  sim.path = path;

  /* ───────────── util + Node-style inspect ───────────── */
  var IDENT = /^[A-Za-z_$][\w$]*$/;
  function quote(s) {
    var q = s.indexOf("'") < 0 ? "'" : s.indexOf('"') < 0 ? '"' : s.indexOf('`') < 0 ? '`' : "'";
    return q + s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\t/g, '\\t').replace(q === "'" ? /'/g : q === '"' ? /"/g : /`/g, '\\' + q) + q;
  }
  function ctorName(o) { try { var p = Object.getPrototypeOf(o); if (!p) return null; var c = p.constructor; return c && c.name ? c.name : ''; } catch (e) { return ''; } }
  function fmt(v, depth, seen, max, nested) {
    var t = typeof v;
    if (v === null) return 'null';
    if (v === undefined) return 'undefined';
    if (t === 'string') return nested ? quote(v) : v;
    if (t === 'number') return Object.is(v, -0) ? '-0' : String(v);
    if (t === 'bigint') return v + 'n';
    if (t === 'boolean') return String(v);
    if (t === 'symbol') return v.toString();
    if (t === 'function') {
      var src = Function.prototype.toString.call(v), nm = v.name;
      var base = /^class\b/.test(src) ? '[class ' + (nm || '(anonymous)') + ']' : '[' + (/^async/.test(src) ? 'AsyncFunction' : 'Function') + (nm ? ': ' + nm : ' (anonymous)') + ']';
      var fk = Object.keys(v); if (!fk.length) return base;
      return fmtObj(v, depth, seen, max, base + ' ', fk);
    }
    var custom = v[Symbol.for('nodejs.util.inspect.custom')];
    if (typeof custom === 'function') { var cr = custom.call(v, max - depth, {}); return typeof cr === 'string' ? cr : fmt(cr, depth, seen, max, nested); }
    if (seen.indexOf(v) >= 0) return '[Circular *1]';
    if (v instanceof Error) {
      var st = v.stack && v.stack.indexOf(v.message) >= 0 ? v.stack : (v.name + ': ' + v.message);
      st = String(st).split('\n').filter(function (l) { return !/^\s+at /.test(l) || /<anonymous>|sim-|blob:/.test(l) === false; }).slice(0, 8).join('\n');
      var ek = Object.keys(v).filter(function (k) { return k !== 'stack' && k !== 'message'; });
      if (!ek.length) return nested ? '[' + st.split('\n')[0] + ']' + (st.indexOf('\n') > 0 ? '' : '') : st;
      return fmtObj(v, depth, seen, max, st + ' ', ek);
    }
    if (v instanceof Date) return isNaN(v) ? 'Invalid Date' : v.toISOString();
    if (v instanceof RegExp) return v.toString();
    if (v instanceof Promise) return 'Promise { <pending> }';
    if (v instanceof Buffer) { var hx = []; for (var i = 0; i < Math.min(v.length, 50); i++) hx.push((v[i] < 16 ? '0' : '') + v[i].toString(16)); return '<Buffer' + (hx.length ? ' ' + hx.join(' ') : '') + (v.length > 50 ? ' ... ' + (v.length - 50) + ' more bytes' : '') + '>'; }
    if (depth > max) return Array.isArray(v) ? '[Array]' : '[' + (ctorName(v) || 'Object') + ']';
    seen = seen.concat([v]); curDepth = depth;
    if (Array.isArray(v) || ArrayBuffer.isView(v)) {
      var items = [], n = Math.min(v.length, 100);
      for (var j = 0; j < n; j++) items.push(fmt(v[j], depth + 1, seen, max, true));
      if (v.length > n) items.push('... ' + (v.length - n) + ' more item' + (v.length - n > 1 ? 's' : ''));
      var extra = Array.isArray(v) ? Object.keys(v).filter(function (k) { return !/^\d+$/.test(k); }) : [];
      extra.forEach(function (k) { items.push(k + ': ' + fmt(v[k], depth + 1, seen, max, true)); });
      var pre = Array.isArray(v) ? '' : ctorName(v) + '(' + v.length + ') ';
      return wrap(pre + '[', items, ']', depth, true, v);
    }
    if (v instanceof Map) { var me = []; v.forEach(function (val, k) { me.push(fmt(k, depth + 1, seen, max, true) + ' => ' + fmt(val, depth + 1, seen, max, true)); }); return wrap('Map(' + v.size + ') {', me, '}', depth); }
    if (v instanceof Set) { var se = []; v.forEach(function (val) { se.push(fmt(val, depth + 1, seen, max, true)); }); return wrap('Set(' + v.size + ') {', se, '}', depth); }
    if (v && typeof v.constructor === 'function' && /^(Response|Request|Headers|URL|URLSearchParams)$/.test(v.constructor.name)) {
      if (v instanceof URL) return 'URL ' + fmtObj({ href: v.href, origin: v.origin, protocol: v.protocol, host: v.host, pathname: v.pathname, search: v.search, hash: v.hash }, depth, seen, max, '', null);
      if (v instanceof URLSearchParams) { var us = []; v.forEach(function (val, k) { us.push(fmt(k, 1, seen, max, true) + ' => ' + fmt(val, 1, seen, max, true)); }); return wrap('URLSearchParams {', us, '}', depth); }
    }
    var cn = ctorName(v), prefix = cn === 'Object' ? '' : cn === null ? '[Object: null prototype] ' : cn ? cn + ' ' : '';
    return fmtObj(v, depth, seen, max, prefix, null);
  }
  function fmtObj(o, depth, seen, max, prefix, keys) {
    if (depth > max) return '[Object]';
    seen = seen.concat([o]); curDepth = depth;
    keys = keys || Object.keys(o);
    var parts = keys.map(function (k) {
      var d = Object.getOwnPropertyDescriptor(o, k), val;
      if (d && (d.get || d.set)) val = d.get && d.set ? '[Getter/Setter]' : d.get ? '[Getter]' : '[Setter]';
      else val = fmt(o[k], depth + 1, seen, max, true);
      return (IDENT.test(k) ? k : quote(k)) + ': ' + val;
    });
    Object.getOwnPropertySymbols(o).forEach(function (s) { parts.push('[' + s.toString() + ']: ' + fmt(o[s], depth + 1, seen, max, true)); });
    if (!parts.length) return prefix ? prefix + '{}' : '{}';
    return wrap(prefix + '{', parts, '}', depth);
  }
  var curDepth = 0;
  function group(items, depth, vals) {
    var total = 0, maxLen = 0, n = items.length, sep = 2, i;
    for (i = 0; i < n; i++) { var l = items[i].length; total += l + sep; if (maxLen < l) maxLen = l; }
    var actualMax = maxLen + sep;
    if (actualMax * 3 + depth * 2 < 80 && (total / actualMax > 5 || maxLen <= 6)) {
      var bias = Math.sqrt(actualMax - total / n), biasedMax = Math.max(actualMax - 3 - bias, 1);
      var cols = Math.min(Math.round(Math.sqrt(2.5 * biasedMax * n) / biasedMax), Math.floor((80 - depth * 2) / actualMax), 12, 15);
      if (cols <= 1) return items;
      var tmp = [], maxLine = [];
      for (i = 0; i < cols; i++) { var ll = 0; for (var j = i; j < n; j += cols) if (items[j].length > ll) ll = items[j].length; maxLine.push(ll + sep); }
      var padStart = true;
      if (vals) for (i = 0; i < n; i++) if (typeof vals[i] !== 'number' && typeof vals[i] !== 'bigint') { padStart = false; break; }
      for (i = 0; i < n; i += cols) {
        var max = Math.min(i + cols, n), str = '', k = i;
        for (; k < max - 1; k++) { var cell = items[k] + ', '; str += padStart ? cell.padStart(maxLine[k - i]) : cell.padEnd(maxLine[k - i]); }
        str += padStart ? items[k].padStart(maxLine[k - i] - sep) : items[k];
        tmp.push(str);
      }
      return tmp;
    }
    return items;
  }
  function wrap(open, items, close, depth, isArr, vals) {
    if (!items.length) return open + close;
    var entries = items.length;
    if (isArr && entries > 6) items = group(items, depth, vals);
    if (curDepth - depth < 3 && entries === items.length) {
      var start = items.length + depth * 2 + open.length + 10, total = items.length + start;
      items.forEach(function (s) { total += s.length; });
      if (total <= 80 && !items.some(function (s) { return s.indexOf('\n') >= 0; })) return open + ' ' + items.join(', ') + ' ' + close;
    }
    var ind = new Array(depth + 2).join('  '), ind0 = new Array(depth + 1).join('  ');
    return open + '\n' + items.map(function (s) { return ind + s; }).join(',\n') + '\n' + ind0 + close;
  }
  function inspect(v, o) { o = o || {}; return fmt(v, 0, [], o.depth === null || o.depth === Infinity ? 1e9 : (o.depth === undefined ? 2 : o.depth), true); }
  function format(f) {
    var args = Array.prototype.slice.call(arguments), i = 1;
    if (typeof f === 'string') {
      var out = f.replace(/%[sdifjoOc%]/g, function (m) {
        if (m === '%%') return '%';
        if (i >= args.length) return m;
        var a = args[i++];
        switch (m) {
          case '%s': return typeof a === 'string' ? a : (typeof a === 'object' && a !== null && !(a instanceof Error)) ? inspect(a, { depth: 0 }) : fmt(a, 0, [], 0, false);
          case '%d': return typeof a === 'bigint' ? a + 'n' : String(Number(a));
          case '%i': return String(parseInt(a, 10));
          case '%f': return String(parseFloat(a));
          case '%j': try { return JSON.stringify(a); } catch (e) { return '[Circular]'; }
          case '%c': return '';
          default: return inspect(a);
        }
      });
      return [out].concat(args.slice(i).map(function (a) { return typeof a === 'string' ? a : inspect(a); })).join(' ');
    }
    return args.map(function (a) { return typeof a === 'string' ? a : inspect(a); }).join(' ');
  }
  function isDeep(a, b, strict) {
    if (b && b.$$asym) return b.match(a);
    if (strict ? Object.is(a, b) : (a == b || (a !== a && b !== b))) return true; // eslint-disable-line eqeqeq
    if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) return false;
    if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;
    if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
    if (a instanceof RegExp && b instanceof RegExp) return String(a) === String(b);
    if (a instanceof Map && b instanceof Map) { if (a.size !== b.size) return false; var ok = true; a.forEach(function (v, k) { if (!b.has(k) || !isDeep(v, b.get(k), strict)) ok = false; }); return ok; }
    if (a instanceof Set && b instanceof Set) { if (a.size !== b.size) return false; var ok2 = true; a.forEach(function (v) { if (!b.has(v)) ok2 = false; }); return ok2; }
    var ka = Object.keys(a), kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    return ka.every(function (k) { return Object.prototype.hasOwnProperty.call(b, k) && isDeep(a[k], b[k], strict); });
  }
  sim.inspect = inspect; sim.format = format; sim.isDeep = isDeep;

  var util = {
    inspect: inspect, format: format,
    promisify: function (fn) {
      if (fn[util.promisify.custom]) return fn[util.promisify.custom];
      return function () { var self = this, a = Array.prototype.slice.call(arguments); return new Promise(function (res, rej) { a.push(function (e, v) { e ? rej(e) : res(v); }); fn.apply(self, a); }); };
    },
    callbackify: function (fn) { return function () { var a = Array.prototype.slice.call(arguments), cb = a.pop(); fn.apply(this, a).then(function (v) { cb(null, v); }, function (e) { cb(e); }); }; },
    inherits: function (c, s) { Object.setPrototypeOf(c.prototype, s.prototype); c.super_ = s; },
    isDeepStrictEqual: function (a, b) { return isDeep(a, b, true); },
    deprecate: function (fn) { return fn; },
    types: { isPromise: function (v) { return v instanceof Promise; }, isDate: function (v) { return v instanceof Date; }, isRegExp: function (v) { return v instanceof RegExp; }, isMap: function (v) { return v instanceof Map; }, isSet: function (v) { return v instanceof Set; } },
    isArray: Array.isArray, TextEncoder: G.TextEncoder, TextDecoder: G.TextDecoder,
    styleText: function (_f, t) { return t; }, stripVTControlCharacters: function (s) { return s.replace(/\u001b\[[\d;]*m/g, ''); }
  };
  util.promisify.custom = Symbol.for('nodejs.util.promisify.custom');
  sim.util = util;

  /* ───────────── console (Node-style output) ───────────── */
  (function () {
    var indent = '', counts = {}, timers = {};
    function out(t, s) { post(t, indent ? s.split('\n').map(function (l) { return indent + l; }).join('\n') : s); }
    var c = G.console;
    c.log = c.info = c.debug = function () { out('l', format.apply(null, arguments)); };
    c.warn = function () { out('w', format.apply(null, arguments)); };
    c.error = function () { out('e', format.apply(null, arguments)); };
    c.trace = function () { out('e', 'Trace: ' + format.apply(null, arguments)); };
    c.dir = function (o, opts) { out('l', inspect(o, opts)); };
    c.group = function () { if (arguments.length) c.log.apply(c, arguments); indent += '  '; };
    c.groupEnd = function () { indent = indent.slice(2); };
    c.count = function (l) { l = l || 'default'; counts[l] = (counts[l] || 0) + 1; out('l', l + ': ' + counts[l]); };
    c.countReset = function (l) { counts[l || 'default'] = 0; };
    c.time = function (l) { timers[l || 'default'] = performance.now(); };
    c.timeEnd = c.timeLog = function (l) { l = l || 'default'; if (timers[l] === undefined) return; var d = performance.now() - timers[l]; out('l', l + ': ' + (d < 1000 ? d.toFixed(3) + 'ms' : (d / 1000).toFixed(3) + 's')); };
    c.assert = function (cond) { if (!cond) out('e', 'Assertion failed' + (arguments.length > 1 ? ': ' + format.apply(null, Array.prototype.slice.call(arguments, 1)) : '')); };
    c.table = function (data, cols) {
      if (data === null || typeof data !== 'object') return c.log(data);
      var rows = Array.isArray(data) ? data.map(function (v, i) { return [String(i), v]; }) : Object.keys(data).map(function (k) { return [k, data[k]]; });
      var keys = cols ? cols.slice() : [], hasVal = false;
      rows.forEach(function (r) { if (r[1] && typeof r[1] === 'object') Object.keys(r[1]).forEach(function (k) { if (!cols && keys.indexOf(k) < 0) keys.push(k); }); else hasVal = true; });
      var head = ['(index)'].concat(keys).concat(hasVal ? ['Values'] : []);
      var body = rows.map(function (r) {
        var isO = r[1] && typeof r[1] === 'object';
        return [r[0]].concat(keys.map(function (k) { return isO && k in r[1] ? inspect(r[1][k]) : ''; })).concat(hasVal ? [isO ? '' : inspect(r[1])] : []);
      });
      var w = head.map(function (h, i) { return Math.max(h.length, Math.max.apply(null, body.map(function (r) { return r[i].length; }).concat([0]))) + 2; });
      var pad = function (s, n) { var l = Math.floor((n - s.length) / 2); return ' '.repeat(l) + s + ' '.repeat(n - s.length - l); };
      var line = function (l, m, r) { return l + w.map(function (n) { return '─'.repeat(n); }).join(m) + r; };
      var row = function (cells) { return '│' + cells.map(function (s, i) { return pad(s, w[i]); }).join('│') + '│'; };
      out('l', [line('┌', '┬', '┐'), row(head), line('├', '┼', '┤')].concat(body.map(row)).concat([line('└', '┴', '┘')]).join('\n'));
    };
  })();

  /* ───────────── crypto (sync SHA-1/SHA-256/HMAC + randomness) ───────────── */
  var K256 = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
  function padMsg(bytes) {
    var l = bytes.length, total = ((l + 9 + 63) >> 6) << 6, m = new Uint8Array(total);
    m.set(bytes); m[l] = 0x80;
    var bits = l * 8; m[total - 4] = (bits >>> 24) & 255; m[total - 3] = (bits >>> 16) & 255; m[total - 2] = (bits >>> 8) & 255; m[total - 1] = bits & 255;
    m[total - 5] = Math.floor(l / 0x20000000) & 255;
    return m;
  }
  function sha256(bytes) {
    var m = padMsg(bytes), H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19], w = new Array(64);
    for (var o = 0; o < m.length; o += 64) {
      for (var i = 0; i < 16; i++) w[i] = (m[o + i * 4] << 24) | (m[o + i * 4 + 1] << 16) | (m[o + i * 4 + 2] << 8) | m[o + i * 4 + 3];
      for (i = 16; i < 64; i++) {
        var s0 = ((w[i - 15] >>> 7) | (w[i - 15] << 25)) ^ ((w[i - 15] >>> 18) | (w[i - 15] << 14)) ^ (w[i - 15] >>> 3);
        var s1 = ((w[i - 2] >>> 17) | (w[i - 2] << 15)) ^ ((w[i - 2] >>> 19) | (w[i - 2] << 13)) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }
      var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
      for (i = 0; i < 64; i++) {
        var S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
        var t1 = (h + S1 + ((e & f) ^ (~e & g)) + K256[i] + w[i]) | 0;
        var S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
        var t2 = (S0 + ((a & b) ^ (a & c) ^ (b & c))) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0; H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
    }
    var out = new Uint8Array(32); for (var k = 0; k < 8; k++) { out[k * 4] = H[k] >>> 24; out[k * 4 + 1] = H[k] >>> 16; out[k * 4 + 2] = H[k] >>> 8; out[k * 4 + 3] = H[k]; }
    return out;
  }
  function sha1(bytes) {
    var m = padMsg(bytes), H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0], w = new Array(80);
    for (var o = 0; o < m.length; o += 64) {
      for (var i = 0; i < 16; i++) w[i] = (m[o + i * 4] << 24) | (m[o + i * 4 + 1] << 16) | (m[o + i * 4 + 2] << 8) | m[o + i * 4 + 3];
      for (i = 16; i < 80; i++) { var x = w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16]; w[i] = (x << 1) | (x >>> 31); }
      var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4];
      for (i = 0; i < 80; i++) {
        var f, k;
        if (i < 20) { f = (b & c) | (~b & d); k = 0x5a827999; } else if (i < 40) { f = b ^ c ^ d; k = 0x6ed9eba1; } else if (i < 60) { f = (b & c) | (b & d) | (c & d); k = 0x8f1bbcdc; } else { f = b ^ c ^ d; k = 0xca62c1d6; }
        var t = (((a << 5) | (a >>> 27)) + f + e + k + w[i]) | 0; e = d; d = c; c = (b << 30) | (b >>> 2); b = a; a = t;
      }
      H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0; H[4] = (H[4] + e) | 0;
    }
    var out = new Uint8Array(20); for (var q = 0; q < 5; q++) { out[q * 4] = H[q] >>> 24; out[q * 4 + 1] = H[q] >>> 16; out[q * 4 + 2] = H[q] >>> 8; out[q * 4 + 3] = H[q]; }
    return out;
  }
  function toBytes(d, enc) { return typeof d === 'string' ? Buffer.from(d, enc) : Uint8Array.from(d); }
  function hashFn(alg) { alg = String(alg).toLowerCase().replace('-', ''); if (alg === 'sha256') return { f: sha256, block: 64 }; if (alg === 'sha1') return { f: sha1, block: 64 }; throw new Error('Digest method not supported in the simulator: ' + alg + ' (sha256 and sha1 are available)'); }
  function digestOut(bytes, enc) { var b = Buffer.from(bytes); return enc ? b.toString(enc) : b; }
  function Hash(alg) { this._h = hashFn(alg); this._d = []; }
  Hash.prototype.update = function (d, enc) { this._d.push(toBytes(d, enc)); return this; };
  Hash.prototype.digest = function (enc) { return digestOut(this._h.f(Buffer.concat(this._d)), enc); };
  function Hmac(alg, key) { this._h = hashFn(alg); var k = toBytes(key); if (k.length > this._h.block) k = this._h.f(k); var kb = new Uint8Array(this._h.block); kb.set(k); this._k = kb; this._d = []; }
  Hmac.prototype.update = Hash.prototype.update;
  Hmac.prototype.digest = function (enc) {
    var ip = this._k.map(function (b) { return b ^ 0x36; }), op = this._k.map(function (b) { return b ^ 0x5c; });
    var inner = this._h.f(Buffer.concat([Buffer.from(ip)].concat(this._d)));
    return digestOut(this._h.f(Buffer.concat([Buffer.from(op), Buffer.from(inner)])), enc);
  };
  var crypto = {
    createHash: function (a) { return new Hash(a); },
    createHmac: function (a, k) { return new Hmac(a, k); },
    randomBytes: function (n, cb) { var b = Buffer.alloc(n); G.crypto.getRandomValues(b); if (cb) { setTimeout(function () { cb(null, b); }, 0); return; } return b; },
    randomUUID: function () { return G.crypto.randomUUID(); },
    randomInt: function (a, b) { if (b === undefined) { b = a; a = 0; } return a + Math.floor(Math.random() * (b - a)); },
    getRandomValues: function (a) { return G.crypto.getRandomValues(a); },
    timingSafeEqual: function (a, b) { return Buffer.from(a).equals(Buffer.from(b)); },
    getHashes: function () { return ['sha1', 'sha256']; },
    webcrypto: G.crypto, subtle: G.crypto.subtle
  };
  sim.sha256 = sha256; sim.hmac256 = function (k, d) { return new Hmac('sha256', k).update(d).digest(); };
  sim.crypto = crypto;

  /* ───────────── url / querystring / os ───────────── */
  var querystring = {
    parse: function (s) { var o = {}; new URLSearchParams(s).forEach(function (v, k) { if (k in o) o[k] = [].concat(o[k], v); else o[k] = v; }); return o; },
    stringify: function (o) { var p = new URLSearchParams(); Object.keys(o || {}).forEach(function (k) { [].concat(o[k]).forEach(function (v) { p.append(k, v); }); }); return p.toString(); },
    escape: encodeURIComponent, unescape: decodeURIComponent
  };
  var nodeUrl = {
    URL: G.URL, URLSearchParams: G.URLSearchParams,
    parse: function (s, q) {
      var u = new URL(s, 'http://localhost'), rel = !/^[a-z][a-z0-9+.-]*:/i.test(s);
      return { protocol: rel ? null : u.protocol, host: rel ? null : u.host, hostname: rel ? null : u.hostname, port: rel ? null : u.port || null, pathname: u.pathname, search: u.search || null, query: q ? querystring.parse(u.search.slice(1)) : u.search.slice(1) || null, hash: u.hash || null, href: rel ? s : u.href, path: u.pathname + u.search };
    },
    format: function (u) { return typeof u === 'string' ? u : (u.protocol ? u.protocol + '//' : '') + (u.host || u.hostname || '') + (u.pathname || '') + (u.search || ''); },
    fileURLToPath: function (u) { return String(u).replace(/^file:\/\//, ''); },
    pathToFileURL: function (p) { return new URL('file://' + p); }
  };
  var os = {
    EOL: '\n', platform: function () { return 'linux'; }, type: function () { return 'Linux'; }, arch: function () { return 'x64'; }, release: function () { return '6.1.0-atlas'; },
    hostname: function () { return 'atlas-sandbox'; }, homedir: function () { return '/home/user'; }, tmpdir: function () { return '/tmp'; },
    cpus: function () { return [0, 1, 2, 3].map(function () { return { model: 'Atlas Virtual CPU', speed: 2400, times: { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 } }; }); },
    totalmem: function () { return 8589934592; }, freemem: function () { return 4294967296; }, uptime: function () { return Math.floor(performance.now() / 1000) + 86400; },
    userInfo: function () { return { username: 'user', uid: 1000, gid: 1000, shell: '/bin/bash', homedir: '/home/user' }; },
    networkInterfaces: function () { return {}; }, loadavg: function () { return [0.1, 0.1, 0.1]; }, endianness: function () { return 'LE'; }, availableParallelism: function () { return 4; }
  };

  /* ───────────── process ───────────── */
  var proc = new EventEmitter(), t0 = performance.now();
  function ProcessExit(code) { this.code = code; this.__procExit = true; }
  Object.assign(proc, {
    env: { NODE_ENV: 'development', HOME: '/home/user', PATH: '/usr/bin:/bin', USER: 'user', LANG: 'en_US.UTF-8' },
    argv: ['/usr/local/bin/node', '/app/index.js'], execArgv: [], execPath: '/usr/local/bin/node', title: 'node', platform: 'linux', arch: 'x64', pid: 4242, ppid: 1,
    version: 'v20.17.0', versions: { node: '20.17.0', v8: '11.3.244.8', modules: '115' }, release: { name: 'node', lts: 'Iron' }, exitCode: undefined,
    cwd: function () { return '/app'; }, chdir: function () { },
    uptime: function () { return (performance.now() - t0) / 1000; },
    exit: function (code) { proc.exitCode = code === undefined ? proc.exitCode || 0 : code; post(proc.exitCode ? 'e' : 'l', '[process exited with code ' + proc.exitCode + ']'); throw new ProcessExit(proc.exitCode); },
    hrtime: Object.assign(function (prev) { var n = performance.now(), s = Math.floor(n / 1000), ns = Math.floor((n % 1000) * 1e6); if (prev) { s -= prev[0]; ns -= prev[1]; if (ns < 0) { s--; ns += 1e9; } } return [s, ns]; }, { bigint: function () { return BigInt(Math.floor(performance.now() * 1e6)); } }),
    memoryUsage: Object.assign(function () { var m = (performance.memory && performance.memory.usedJSHeapSize) || 30000000; return { rss: m * 2, heapTotal: m * 1.4, heapUsed: m, external: 1000000, arrayBuffers: 10000 }; }, { rss: function () { return 60000000; } }),
    cpuUsage: function () { return { user: 1000, system: 500 }; },
    nextTick: function (fn) { var a = Array.prototype.slice.call(arguments, 1); Promise.resolve().then(function () { fn.apply(null, a); }); },
    emitWarning: function (w) { post('w', '(node) Warning: ' + (w && w.message ? w.message : w)); },
    kill: function () { }, abort: function () { throw new ProcessExit(134); }, umask: function () { return 18; }, getuid: function () { return 1000; }
  });
  function makeStdout(kind) { var w = new EventEmitter(); w.write = function (s, e, cb) { var str = typeof s === 'string' ? s : Buffer.from(s).toString(); post(kind, str.replace(/\n$/, '')); var f = typeof e === 'function' ? e : cb; if (f) f(); return true; }; w.end = function () { }; w.isTTY = false; w.columns = 80; w.rows = 24; w.fd = kind === 'l' ? 1 : 2; w.on = function () { return w; }; w.once = w.on; w.writable = true; w.cork = w.uncork = function () { }; return w; }
  proc.stdout = makeStdout('l'); proc.stderr = makeStdout('e');
  proc.stdin = new EventEmitter(); proc.stdin.isTTY = false; proc.stdin.setEncoding = proc.stdin.resume = proc.stdin.pause = function () { return proc.stdin; }; proc.stdin.fd = 0;
  G.process = G.process || proc; sim.process = proc; sim.ProcessExit = ProcessExit;
  if (!G.setImmediate) { G.setImmediate = function (f) { return setTimeout.apply(G, [f, 0].concat(Array.prototype.slice.call(arguments, 1))); }; G.clearImmediate = clearTimeout; }
  G.global = G;
  G.addEventListener('unhandledrejection', function (e) {
    if (proc.listenerCount('unhandledRejection')) { e.preventDefault(); proc.emit('unhandledRejection', e.reason, e.promise); return; }
    var r = e.reason; if (r && r.__procExit) { e.preventDefault(); return; }
    e.preventDefault();
    post('e', '[UnhandledPromiseRejection] ' + (r instanceof Error ? (r.stack || r.message).split('\n').slice(0, 3).join('\n') : format(r)));
  });

  /* ───────────── virtual filesystem ───────────── */
  var files = {}, dirs = { '/': 1, '/app': 1, '/tmp': 1, '/home': 1, '/home/user': 1 }, mtimes = {};
  function P(p) { if (p && p.href) p = nodeUrl.fileURLToPath(p.href); return path.resolve(String(p)); }
  function fsErr(code, sys, p) {
    var m = { ENOENT: 'no such file or directory', EEXIST: 'file already exists', ENOTDIR: 'not a directory', EISDIR: 'illegal operation on a directory', ENOTEMPTY: 'directory not empty' };
    var e = new Error(code + ': ' + m[code] + ', ' + sys + " '" + p + "'"); e.code = code; e.errno = { ENOENT: -2, EEXIST: -17, ENOTDIR: -20, EISDIR: -21, ENOTEMPTY: -39 }[code]; e.syscall = sys; e.path = p; return e;
  }
  function encOf(o) { return typeof o === 'string' ? o : o && o.encoding; }
  function toStr(d) { return typeof d === 'string' ? d : d instanceof Uint8Array ? Buffer.from(d).toString() : String(d); }
  function Stats(p, isDir) { this._d = isDir; this.size = isDir ? 4096 : Buffer.byteLength(files[p] || ''); this.mtime = new Date(mtimes[p] || Date.now()); this.mtimeMs = this.mtime.getTime(); this.ctime = this.birthtime = this.atime = this.mtime; this.mode = isDir ? 16877 : 33188; }
  Stats.prototype.isFile = function () { return !this._d; }; Stats.prototype.isDirectory = function () { return this._d; };
  Stats.prototype.isSymbolicLink = function () { return false; };
  var fsSync = {
    existsSync: function (p) { p = P(p); return p in files || p in dirs; },
    readFileSync: function (p, o) { var a = P(p); if (a in dirs) throw fsErr('EISDIR', 'read', a); if (!(a in files)) throw fsErr('ENOENT', 'open', typeof p === 'string' ? p : a); return encOf(o) ? files[a] : Buffer.from(files[a]); },
    writeFileSync: function (p, d, o) { var a = P(p); if (a in dirs) throw fsErr('EISDIR', 'open', a); if (!(path.dirname(a) in dirs)) throw fsErr('ENOENT', 'open', typeof p === 'string' ? p : a); files[a] = (o && o.flag === 'a') ? (files[a] || '') + toStr(d) : toStr(d); mtimes[a] = Date.now(); },
    appendFileSync: function (p, d) { var a = P(p); if (!(path.dirname(a) in dirs)) throw fsErr('ENOENT', 'open', a); files[a] = (files[a] || '') + toStr(d); mtimes[a] = Date.now(); },
    mkdirSync: function (p, o) {
      var a = P(p), rec = o && o.recursive;
      if (a in dirs || a in files) { if (rec && a in dirs) return undefined; throw fsErr('EEXIST', 'mkdir', a); }
      if (!(path.dirname(a) in dirs)) { if (!rec) throw fsErr('ENOENT', 'mkdir', a); fsSync.mkdirSync(path.dirname(a), o); }
      dirs[a] = 1; return rec ? a : undefined;
    },
    readdirSync: function (p, o) {
      var a = P(p); if (a in files) throw fsErr('ENOTDIR', 'scandir', a); if (!(a in dirs)) throw fsErr('ENOENT', 'scandir', typeof p === 'string' ? p : a);
      var pre = a === '/' ? '/' : a + '/', names = {};
      Object.keys(files).concat(Object.keys(dirs)).forEach(function (k) { if (k !== a && k.indexOf(pre) === 0) names[k.slice(pre.length).split('/')[0]] = k; });
      var list = Object.keys(names).sort();
      if (o && o.withFileTypes) return list.map(function (n) { var full = pre + n; return { name: n, isFile: function () { return full in files; }, isDirectory: function () { return full in dirs; } }; });
      return list;
    },
    unlinkSync: function (p) { var a = P(p); if (a in dirs) throw fsErr('EISDIR', 'unlink', a); if (!(a in files)) throw fsErr('ENOENT', 'unlink', typeof p === 'string' ? p : a); delete files[a]; },
    rmSync: function (p, o) {
      var a = P(p); if (!(a in files) && !(a in dirs)) { if (o && o.force) return; throw fsErr('ENOENT', 'rm', a); }
      delete files[a];
      if (a in dirs) { var pre = a + '/'; Object.keys(files).forEach(function (k) { if (k.indexOf(pre) === 0) delete files[k]; }); Object.keys(dirs).forEach(function (k) { if (k === a || k.indexOf(pre) === 0) delete dirs[k]; }); }
    },
    rmdirSync: function (p, o) { var a = P(p); if (!(a in dirs)) throw fsErr('ENOENT', 'rmdir', a); if (fsSync.readdirSync(a).length && !(o && o.recursive)) throw fsErr('ENOTEMPTY', 'rmdir', a); fsSync.rmSync(a, { recursive: true }); },
    statSync: function (p, o) { var a = P(p); if (a in dirs) return new Stats(a, true); if (a in files) return new Stats(a, false); if (o && o.throwIfNoEntry === false) return undefined; throw fsErr('ENOENT', 'stat', typeof p === 'string' ? p : a); },
    renameSync: function (from, to) { var a = P(from), b = P(to); if (!(a in files)) throw fsErr('ENOENT', 'rename', a); files[b] = files[a]; delete files[a]; },
    copyFileSync: function (from, to) { var a = P(from); if (!(a in files)) throw fsErr('ENOENT', 'copyfile', a); files[P(to)] = files[a]; },
    accessSync: function (p) { var a = P(p); if (!(a in files) && !(a in dirs)) throw fsErr('ENOENT', 'access', typeof p === 'string' ? p : a); },
    truncateSync: function (p) { files[P(p)] = ''; }
  };
  fsSync.lstatSync = fsSync.statSync; fsSync.realpathSync = P; fsSync.mkdtempSync = function (pre) { var d = P(pre + Math.random().toString(36).slice(2, 8)); dirs[d] = 1; return d; };
  var fsCb = {}, fsProm = {};
  Object.keys(fsSync).forEach(function (k) {
    if (k === 'existsSync' || k === 'realpathSync' || k === 'mkdtempSync') return;
    var base = k.replace(/Sync$/, '');
    fsCb[base] = function () { var a = Array.prototype.slice.call(arguments), cb = typeof a[a.length - 1] === 'function' ? a.pop() : function () { }; setTimeout(function () { var r; try { r = fsSync[k].apply(null, a); } catch (e) { return cb(e); } cb(null, r); }, 0); };
    fsProm[base] = function () { var a = arguments; return new Promise(function (res, rej) { setTimeout(function () { try { res(fsSync[k].apply(null, a)); } catch (e) { rej(e); } }, 0); }); };
  });
  fsProm.constants = fsCb.constants = fsSync.constants = { F_OK: 0, R_OK: 4, W_OK: 2, X_OK: 1 };
  fsCb.exists = function (p, cb) { setTimeout(function () { cb(fsSync.existsSync(p)); }, 0); };
  var fs = Object.assign({ promises: fsProm }, fsSync, fsCb);
  fs.constants = fsSync.constants;
  fs.watch = fs.watchFile = function () { var w = new EventEmitter(); w.close = function () { }; w.unref = function () { return w; }; return w; };
  fs.unwatchFile = function () { };
  sim.fs = fs; sim.files = files; sim.dirs = dirs;

  /* ───────────── streams ───────────── */
  class Readable extends EventEmitter {
    constructor(o) { super(); o = o || {}; this._q = []; this._ended = false; this._endEmitted = false; this._flowing = null; this._sched = false; this._enc = o.encoding || null; this.readable = true; this.destroyed = false; this.objectMode = !!o.objectMode; if (o.read) this._read = o.read; this._reading = false; }
    _read() { }
    push(c) { if (c === null) { this._ended = true; } else { this._q.push(typeof c === 'string' && !this.objectMode && !this._enc ? Buffer.from(c) : c); this._reading = false; } this._kick(); return true; }
    setEncoding(e) { this._enc = e; return this; }
    on(n, f) { EventEmitter.prototype.on.call(this, n, f); if (n === 'data' && this._flowing !== false) { this._flowing = true; this._kick(); } if (n === 'readable') this._kick(); return this; }
    resume() { this._flowing = true; this._kick(); return this; }
    pause() { this._flowing = false; return this; }
    isPaused() { return this._flowing === false; }
    read() { return this._q.length ? this._q.shift() : null; }
    _kick() { var s = this; if (s._sched) return; s._sched = true; setTimeout(function () { s._sched = false; s._flow(); }, 0); }
    _flow() {
      var self = this;
      while (this._flowing && this._q.length) { var c = this._q.shift(); if (this._enc && c instanceof Uint8Array) c = Buffer.from(c).toString(this._enc); this.emit('data', c); }
      if (this._q.length) return;
      if (this._ended) { if (!this._endEmitted && this._flowing) { this._endEmitted = true; this.readable = false; this.emit('end'); this.emit('close'); } return; }
      if (this._flowing && !this._reading && !this.destroyed) { this._reading = true; try { this._read(64 * 1024); } catch (e) { this.destroy(e); return; } if (this._q.length || this._ended) this._kick(); }
      else if (this._flowing) { setTimeout(function () { if (self._flowing && !self._ended) self._kick(); }, 5); }
    }
    pipe(dest) {
      this.on('data', function (c) { if (dest.write(c) === false && dest.once) { /* backpressure ignored */ } });
      this.on('end', function () { if (dest !== proc.stdout && dest !== proc.stderr && dest.end) dest.end(); });
      dest.emit && dest.emit('pipe', this);
      return dest;
    }
    unpipe() { return this; }
    destroy(err) { if (this.destroyed) return this; this.destroyed = true; var s = this; setTimeout(function () { if (err) s.emit('error', err); s.emit('close'); }, 0); return this; }
    [Symbol.asyncIterator]() {
      var self = this, buf = [], done = false, err = null, wake = null;
      this.on('data', function (c) { buf.push(c); if (wake) { wake(); wake = null; } });
      this.on('end', function () { done = true; if (wake) { wake(); wake = null; } });
      this.on('error', function (e) { err = e; if (wake) { wake(); wake = null; } });
      return { next: function () { return new Promise(function (res, rej) { (function step() { if (err) return rej(err); if (buf.length) return res({ value: buf.shift(), done: false }); if (done) return res({ value: undefined, done: true }); wake = step; })(); }); }, return: function () { self.destroy(); return Promise.resolve({ done: true }); }, [Symbol.asyncIterator]: function () { return this; } };
    }
    static from(it, o) {
      var r = new Readable(Object.assign({ objectMode: typeof it !== 'string' && !(it instanceof Uint8Array) }, o || {}));
      var items = typeof it === 'string' || it instanceof Uint8Array ? [it] : it;
      (async function () { try { for await (var x of items) r.push(x); r.push(null); } catch (e) { r.destroy(e); } })();
      return r;
    }
  }
  class Writable extends EventEmitter {
    constructor(o) { super(); o = o || {}; this._chain = Promise.resolve(); this._ending = false; this.writable = true; this.destroyed = false; this.writableEnded = false; this.writableFinished = false; if (o.write) this._write = o.write; if (o.final) this._final = o.final; this._decodeStrings = o.decodeStrings !== false; this._om = !!o.objectMode; }
    _write(c, e, cb) { cb(); }
    write(c, enc, cb) {
      if (typeof enc === 'function') { cb = enc; enc = 'utf8'; }
      var self = this; if (this._decodeStrings && typeof c === 'string' && !this._om) c = Buffer.from(c, enc);
      this._chain = this._chain.then(function () { return new Promise(function (res) { self._write(c, enc || 'buffer', function (err) { if (err) self.emit('error', err); if (cb) cb(err); res(); }); }); });
      return true;
    }
    end(c, enc, cb) {
      if (typeof c === 'function') { cb = c; c = null; } if (typeof enc === 'function') { cb = enc; }
      if (c !== null && c !== undefined) this.write(c, typeof enc === 'string' ? enc : undefined);
      if (this._ending) return this; this._ending = true; this.writableEnded = true; var self = this;
      this._chain = this._chain.then(function () { return new Promise(function (res) { if (self._final) self._final(function (err) { if (err) self.emit('error', err); res(); }); else res(); }); }).then(function () { self.writableFinished = true; self.emit('finish'); self.emit('close'); if (cb) cb(); });
      return this;
    }
    cork() { } uncork() { } setDefaultEncoding() { return this; }
    destroy(err) { this.destroyed = true; var s = this; setTimeout(function () { if (err) s.emit('error', err); s.emit('close'); }, 0); return this; }
  }
  class Duplex extends Readable {
    constructor(o) { super(o); o = o || {}; this._chain = Promise.resolve(); this._ending = false; this.writable = true; this.writableEnded = false; this.writableFinished = false; if (o.write) this._write = o.write; if (o.final) this._final = o.final; this._decodeStrings = o.decodeStrings !== false; this._om = !!o.objectMode; }
  }
  ['write', 'end', 'cork', 'uncork', 'setDefaultEncoding'].forEach(function (m) { Duplex.prototype[m] = Writable.prototype[m]; });
  Duplex.prototype._write = function (c, e, cb) { cb(); };
  var DuplexBase = Duplex;
  class Transform extends DuplexBase {
    constructor(o) { super(o); o = o || {}; if (o.transform) this._transform = o.transform; if (o.flush) this._flush = o.flush; }
    _transform(c, e, cb) { cb(null, c); }
    _write(c, e, cb) { var self = this; this._transform(c, e, function (err, d) { if (err) return cb(err); if (d !== undefined && d !== null) self.push(d); cb(); }); }
    _final(cb) { var self = this; function done() { self.push(null); cb(); } if (this._flush) this._flush(function (err, d) { if (err) return cb(err); if (d !== undefined && d !== null) self.push(d); done(); }); else done(); }
  }
  class PassThrough extends Transform { }
  function pipeline() {
    var a = Array.prototype.slice.call(arguments), cb = typeof a[a.length - 1] === 'function' ? a.pop() : null;
    if (Array.isArray(a[0])) a = a[0];
    var called = false; function done(e) { if (called) return; called = true; if (cb) cb(e); }
    a.forEach(function (s, i) { s.on('error', done); if (i > 0) a[i - 1].pipe(s); });
    var last = a[a.length - 1]; last.on('finish', function () { done(); }); if (last === proc.stdout) a[a.length - 2].on('end', function () { done(); });
    return last;
  }
  function finished(s, cb) { var done = false; function d(e) { if (!done) { done = true; cb(e); } } s.on('end', function () { d(); }); s.on('finish', function () { d(); }); s.on('error', d); }
  var stream = Object.assign(Readable, { Readable: Readable, Writable: Writable, Duplex: DuplexBase, Transform: Transform, PassThrough: PassThrough, pipeline: pipeline, finished: finished, Stream: Readable });
  stream.promises = { pipeline: function () { var a = Array.prototype.slice.call(arguments); return new Promise(function (res, rej) { a.push(function (e) { e ? rej(e) : res(); }); pipeline.apply(null, a); }); }, finished: function (s) { return new Promise(function (res, rej) { finished(s, function (e) { e ? rej(e) : res(); }); }); } };
  fs.createReadStream = function (p, o) {
    if (typeof o === 'string') o = { encoding: o }; o = o || {};
    var r = new Readable({ encoding: o.encoding }), hwm = o.highWaterMark || 64 * 1024, a = P(p), data;
    setTimeout(function () {
      if (!(a in files)) { r.destroy(fsErr('ENOENT', 'open', typeof p === 'string' ? p : a)); return; }
      data = Buffer.from(files[a]); r.emit('open'); r.emit('ready');
      for (var i = 0; i < data.length; i += hwm) r.push(data.subarray(i, i + hwm));
      r.push(null);
    }, 0);
    r.path = a; return r;
  };
  fs.createWriteStream = function (p, o) {
    var a = P(p), flags = (o && o.flags) || 'w', first = true;
    var w = new Writable({ decodeStrings: false, write: function (c, e, cb) { try { var s = toStr(c); files[a] = (first && flags[0] === 'w' ? '' : files[a] || '') + s; first = false; mtimes[a] = Date.now(); cb(); } catch (err) { cb(err); } } });
    if (!(path.dirname(a) in dirs)) setTimeout(function () { w.emit('error', fsErr('ENOENT', 'open', a)); }, 0);
    else { if (flags[0] === 'w') files[a] = ''; first = false; }
    w.path = a; return w;
  };
  var readline = {
    createInterface: function (o) {
      var rl = new EventEmitter(), input = o && (o.input || o), buf = '', closed = false, lines = [], waiters = [];
      function push(l) { if (waiters.length) waiters.shift()({ value: l, done: false }); else lines.push(l); rl.emit('line', l); }
      function close() { if (closed) return; closed = true; if (buf) { push(buf); buf = ''; } rl.emit('close'); while (waiters.length) waiters.shift()({ value: undefined, done: true }); }
      if (input && input.on && input !== proc.stdin) {
        input.on('data', function (c) { buf += typeof c === 'string' ? c : Buffer.from(c).toString(); var parts = buf.split(/\r?\n/); buf = parts.pop(); parts.forEach(push); });
        input.on('end', close);
      } else setTimeout(function () { /* stdin has no data in the browser */ }, 0);
      rl.question = function (q, cb) { post('l', String(q)); setTimeout(function () { cb(''); }, 0); };
      rl.close = close; rl.setPrompt = function () { }; rl.prompt = function () { }; rl.write = function () { }; rl.pause = rl.resume = function () { return rl; };
      rl[Symbol.asyncIterator] = function () { return { next: function () { return lines.length ? Promise.resolve({ value: lines.shift(), done: false }) : closed ? Promise.resolve({ value: undefined, done: true }) : new Promise(function (r) { waiters.push(r); }); }, return: function () { close(); return Promise.resolve({ done: true }); }, [Symbol.asyncIterator]: function () { return this; } }; };
      return rl;
    }
  };
  readline.promises = { createInterface: function (o) { var rl = readline.createInterface(o); var q = rl.question; rl.question = function (t) { return new Promise(function (r) { q(t, r); }); }; return rl; } };

  /* ───────────── zlib (async only — built on the browser's CompressionStream) ───────────── */
  function zStream(kind, fmt) {
    var chunks = [];
    return new Transform({
      transform: function (c, e, cb) { chunks.push(Buffer.from(c)); cb(); },
      flush: function (cb) {
        var C = kind === 'c' ? G.CompressionStream : G.DecompressionStream;
        if (!C) return cb(new Error('zlib is not supported by this browser'));
        new Response(new Blob([Buffer.concat(chunks)]).stream().pipeThrough(new C(fmt))).arrayBuffer().then(function (ab) { cb(null, Buffer.from(new Uint8Array(ab))); }, function (er) { var ze = new Error('incorrect header check'); ze.code = 'Z_DATA_ERROR'; ze.cause = er; cb(ze); });
      }
    });
  }
  function zAsync(kind, fmt) {
    return function (buf, o, cb) {
      if (typeof o === 'function') cb = o;
      var s = zStream(kind, fmt), out = [];
      s.on('data', function (d) { out.push(Buffer.from(d)); }); s.on('end', function () { cb(null, Buffer.concat(out)); }); s.on('error', function (e) { cb(e); });
      s.write(typeof buf === 'string' ? Buffer.from(buf) : buf); s.end();
    };
  }
  function zSyncErr(name) { return function () { throw new Error('zlib.' + name + '() is synchronous, which browsers can\'t do — use the callback/promise form (zlib.' + name.replace(/Sync$/, '') + ') or streams here, or run it in the real Node.js tab.'); }; }
  var zlib = { createGzip: function () { return zStream('c', 'gzip'); }, createGunzip: function () { return zStream('d', 'gzip'); }, createDeflate: function () { return zStream('c', 'deflate'); }, createInflate: function () { return zStream('d', 'deflate'); }, createDeflateRaw: function () { return zStream('c', 'deflate-raw'); }, createInflateRaw: function () { return zStream('d', 'deflate-raw'); },
    gzip: zAsync('c', 'gzip'), gunzip: zAsync('d', 'gzip'), deflate: zAsync('c', 'deflate'), inflate: zAsync('d', 'deflate'), deflateRaw: zAsync('c', 'deflate-raw'), inflateRaw: zAsync('d', 'deflate-raw'),
    gzipSync: zSyncErr('gzipSync'), gunzipSync: zSyncErr('gunzipSync'), deflateSync: zSyncErr('deflateSync'), inflateSync: zSyncErr('inflateSync'), constants: { Z_BEST_COMPRESSION: 9, Z_BEST_SPEED: 1, Z_DEFAULT_COMPRESSION: -1 } };

  /* ───────────── assert ───────────── */
  class AssertionError extends Error {
    constructor(o) { super(o.message); this.name = 'AssertionError'; this.code = 'ERR_ASSERTION'; this.actual = o.actual; this.expected = o.expected; this.operator = o.operator; this.generatedMessage = !o.userMessage; }
  }
  function fail(msg, a, e, op, def) { if (msg instanceof Error) throw msg; throw new AssertionError({ message: msg || def, actual: a, expected: e, operator: op, userMessage: !!msg }); }
  function assert(v, m) { if (!v) fail(m, v, true, '==', 'The expression evaluated to a falsy value:\n\n  assert(' + inspect(v) + ')\n'); }
  assert.ok = assert;
  assert.fail = function (m) { fail(m, undefined, undefined, 'fail', 'Failed'); };
  assert.equal = function (a, e, m) { if (!(a == e || (a !== a && e !== e))) fail(m, a, e, '==', inspect(a) + ' == ' + inspect(e)); }; // eslint-disable-line eqeqeq
  assert.notEqual = function (a, e, m) { if (a == e) fail(m, a, e, '!=', inspect(a) + ' != ' + inspect(e)); }; // eslint-disable-line eqeqeq
  assert.strictEqual = function (a, e, m) { if (!Object.is(a, e)) fail(m, a, e, 'strictEqual', 'Expected values to be strictly equal:\n\n' + inspect(a) + ' !== ' + inspect(e) + '\n'); };
  assert.notStrictEqual = function (a, e, m) { if (Object.is(a, e)) fail(m, a, e, 'notStrictEqual', 'Expected "actual" to be strictly unequal to: ' + inspect(e)); };
  assert.deepEqual = function (a, e, m) { if (!isDeep(a, e, false)) fail(m, a, e, 'deepEqual', 'Expected values to be loosely deep-equal:\n\n' + inspect(a) + '\n\nshould loosely deep-equal\n\n' + inspect(e)); };
  assert.deepStrictEqual = function (a, e, m) { if (!isDeep(a, e, true)) fail(m, a, e, 'deepStrictEqual', 'Expected values to be strictly deep-equal:\n' + inspect(a) + '\n\nshould equal\n\n' + inspect(e)); };
  assert.notDeepStrictEqual = function (a, e, m) { if (isDeep(a, e, true)) fail(m, a, e, 'notDeepStrictEqual', 'Expected "actual" not to be strictly deep-equal to: ' + inspect(e)); };
  assert.notDeepEqual = function (a, e, m) { if (isDeep(a, e, false)) fail(m, a, e, 'notDeepEqual', 'Expected "actual" not to be loosely deep-equal to: ' + inspect(e)); };
  function matchesErr(err, exp) { if (!exp) return true; if (typeof exp === 'function') return exp.prototype !== undefined && err instanceof exp || (exp.prototype === undefined && exp(err) === true); if (exp instanceof RegExp) return exp.test(String(err && err.message !== undefined ? err : err)); return Object.keys(exp).every(function (k) { return exp[k] instanceof RegExp ? exp[k].test(err[k]) : isDeep(err[k], exp[k], true); }); }
  assert.throws = function (fn, exp, m) { var threw = false, err; try { fn(); } catch (e) { threw = true; err = e; } if (!threw) fail(typeof exp === 'string' ? exp : m, undefined, exp, 'throws', 'Missing expected exception.'); if (typeof exp !== 'string' && !matchesErr(err, exp)) throw err; };
  assert.doesNotThrow = function (fn, m) { try { fn(); } catch (e) { fail(typeof m === 'string' ? m : undefined, e, undefined, 'doesNotThrow', 'Got unwanted exception.\nActual message: "' + (e && e.message) + '"'); } };
  assert.rejects = async function (p, exp, m) { var threw = false, err; try { await (typeof p === 'function' ? p() : p); } catch (e) { threw = true; err = e; } if (!threw) fail(m, undefined, exp, 'rejects', 'Missing expected rejection.'); if (!matchesErr(err, exp)) throw err; };
  assert.doesNotReject = async function (p) { await (typeof p === 'function' ? p() : p); };
  assert.match = function (s, re, m) { if (!re.test(s)) fail(m, s, re, 'match', 'The input did not match the regular expression ' + inspect(re) + '. Input:\n\n' + inspect(s) + '\n'); };
  assert.ifError = function (e) { if (e !== null && e !== undefined) throw e; };
  assert.AssertionError = AssertionError; assert.strict = assert;
  sim.assert = assert; sim.AssertionError = AssertionError;

  /* ───────────── timers ───────────── */
  var timersMod = { setTimeout: G.setTimeout.bind(G), setInterval: G.setInterval.bind(G), setImmediate: G.setImmediate, clearTimeout: G.clearTimeout.bind(G), clearInterval: G.clearInterval.bind(G), clearImmediate: G.clearImmediate };
  var timersProm = {
    setTimeout: function (ms, v) { return new Promise(function (r) { setTimeout(r, ms, v); }); },
    setImmediate: function (v) { return new Promise(function (r) { setTimeout(r, 0, v); }); },
    setInterval: async function* (ms, v) { while (true) { await new Promise(function (r) { setTimeout(r, ms); }); yield v; } },
    scheduler: { wait: function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); } }
  };

  /* ───────────── module system ───────────── */
  var registry = {}, cache = {};
  sim.modules = registry;
  registry.events = EventEmitter; registry.path = path; registry.os = os; registry.util = util; registry.fs = fs; registry['fs/promises'] = fsProm;
  registry.crypto = crypto; registry.url = nodeUrl; registry.querystring = querystring; registry.process = proc; registry.buffer = { Buffer: Buffer }; registry.assert = assert; registry['assert/strict'] = assert;
  registry.stream = stream; registry['stream/promises'] = stream.promises; registry.readline = readline; registry['readline/promises'] = readline.promises; registry.timers = timersMod; registry['timers/promises'] = timersProm;
  registry.string_decoder = { StringDecoder: function (enc) { this.write = function (b) { return Buffer.from(b).toString(enc || 'utf8'); }; this.end = function (b) { return b ? this.write(b) : ''; }; } };
  registry.perf_hooks = { performance: G.performance };
  registry.worker_threads = { isMainThread: true, parentPort: null, workerData: null, threadId: 0 };
  registry.zlib = registry.child_process = registry.cluster = registry.net = registry.dns = registry.tls = registry.vm = registry.v8 = registry.module = null; // unsupported → helpful error below
  var UNSUPPORTED = { child_process: 1, cluster: 1, net: 1, dns: 1, tls: 1, vm: 1, v8: 1, module: 1 };
  Object.keys(UNSUPPORTED).forEach(function (k) { delete registry[k]; });
  registry.zlib = zlib;

  sim.userFiles = files;
  sim.addFiles = function (map) {
    Object.keys(map).forEach(function (p) {
      var full = path.resolve('/app', p), d = path.dirname(full);
      while (d !== '/' && !(d in dirs)) { dirs[d] = 1; d = path.dirname(d); }
      files[full] = map[p];
    });
  };
  function defModule(src, name, o) {
    var s = document.createElement('script');
    sim._defined = null; o = o || {};
    s.text = 'window.__sim._defined=' + (o.async ? 'async ' : '') + 'function(' + (o.main ? 'exports,require,module' : 'exports,require,module,__filename,__dirname') + '){' + src + '\n};\n//# sourceURL=' + name;
    var caught = null; function onErr(ev) { caught = ev.message; }
    G.addEventListener('error', onErr);
    document.head.appendChild(s); s.remove();
    G.removeEventListener('error', onErr);
    var fn = sim._defined; sim._defined = null;
    if (!fn) { var se = new SyntaxError(String(caught || 'Invalid or unexpected token').replace(/^Uncaughts*(SyntaxError:s*)?/, '')); se.__reported = !!caught; throw se; }
    return fn;
  }
  sim.defModule = defModule;
  function notFound(name) {
    var bare = !/^(\.{1,2}\/|\/)/.test(name);
    var hint = bare ? "\n(The browser simulator ships core Node modules and popular Express helpers — databases and native add-ons aren't available.)" : "\n(Tip: add the file to the editor with a `// FILE: name.js` line.)";
    var e = new Error("Cannot find module '" + name + "'\nRequire stack:\n- /app/index.js" + hint); e.code = 'MODULE_NOT_FOUND'; e.requireStack = ['/app/index.js']; return e; }
  function resolveUser(from, spec) {
    var base = path.resolve(path.dirname(from), spec), tries = [base, base + '.js', base + '.json', base + '.cjs', base + '.mjs', base + '/index.js', base + '/index.json'];
    for (var i = 0; i < tries.length; i++) if (tries[i] in sim.userFiles) return tries[i];
    return null;
  }
  function makeRequire(from) {
    function req(spec) {
      var name = String(spec).replace(/^node:/, '');
      if (/^(\.{1,2}\/|\/|\.\.$|\.$)/.test(name)) {
        var full = resolveUser(from, name);
        if (!full) { if (sim.lenient) return sim.stubModule(spec, 'file'); throw notFound(spec); }
        if (cache[full]) return cache[full].exports;
        var mod = { exports: {}, id: full, filename: full, loaded: false }; cache[full] = mod;
        if (/\.json$/.test(full)) { mod.exports = JSON.parse(sim.userFiles[full]); return mod.exports; }
        var fn = defModule(sim.transformSource ? sim.transformSource(sim.userFiles[full], full) : sim.userFiles[full], full);
        try { fn.call(mod.exports, mod.exports, makeRequire(full), mod, full, path.dirname(full)); } catch (e) { delete cache[full]; throw e; }
        mod.loaded = true; return mod.exports;
      }
      if (name in registry) { var m = registry[name]; if (typeof m === 'function' && m.__lazy) { m = registry[name] = m(); } return m; }
      if (name === 'test' || name === 'node:test') return registry.test;
      if (UNSUPPORTED[name]) { var e = new Error("The '" + name + "' module isn't available in the browser simulator. Use the real Node.js language tab to run it."); e.code = 'ERR_NOT_SUPPORTED'; throw e; }
      if (sim.lenient && !/^(fs|path|os|http|https|net|tls|dns|child_process|cluster|worker_threads|vm|v8|inspector|repl|tty|dgram|http2|perf_hooks|async_hooks|module|process|readline)$/.test(name)) return sim.stubModule(spec, 'package');
      throw notFound(spec);
    }
    req.resolve = function (s) { return resolveUser(from, s) || s; };
    req.cache = cache; req.main = { filename: '/app/index.js' };
    return req;
  }
  sim.makeRequire = makeRequire;
  sim.userModuleCache = cache;
  G.require = makeRequire('/app/index.js');
  G.module = { exports: {}, id: '.', filename: '/app/index.js', loaded: false, children: [], paths: [] };
  G.exports = G.module.exports;
  G.__filename = '/app/index.js'; G.__dirname = '/app';
  /* Placeholders: names / modules a lesson snippet uses but never defines (its other files, a database helper, a controller…).
   * They can be called, awaited, chained and used as Express middleware without failing. */
  function makeStub(name, plain) {
    var custom = Symbol.for('nodejs.util.inspect.custom');
    var stub = new Proxy(function () { }, {
      apply: function (t, self, a) {
        if (a.length >= 3 && typeof a[2] === 'function' && a[1] && typeof a[1].send === 'function' && !/controller|handler|route/i.test(name)) return a[2]();
        if (a.length >= 2 && a[1] && typeof a[1].json === 'function' && typeof a[1].send === 'function') { try { return a[1].json({ placeholder: name }); } catch (e) { return undefined; } }
        return makeStub(name + '()');
      },
      construct: function () { return makeStub('new ' + name); },
      get: function (t, p) {
        if (p === 'then' || p === 'catch' || p === 'finally') { if (plain) return undefined; var pr = Promise.resolve(makeStub(name, true)); return pr[p].bind(pr); }
        if (p === custom) return function () { return '[placeholder ' + name + ']'; };
        if (p === Symbol.toPrimitive) return function () { return ''; };
        if (p === Symbol.iterator) return function* () { };
        if (p === 'length') return 0; if (p === 'name') return name; if (p === 'toJSON') return function () { return { placeholder: name }; };
        if (typeof p === 'symbol') return undefined;
        return makeStub(name + '.' + p);
      },
      has: function () { return true; }
    });
    return stub;
  }
  sim.makeStub = makeStub;
  sim.lenient = false;
  var stubbed = {};
  sim.stubModule = function (spec, kind) {
    if (!stubbed[spec]) { stubbed[spec] = makeStub(spec); post('l', 'ℹ️ ' + (kind === 'file' ? '"' + spec + '" is another file that is not part of this snippet' : 'The package "' + spec + '" is not bundled in the browser simulator') + ' — using an empty placeholder so the rest can run.'); }
    return stubbed[spec];
  };
  sim.register = function (name, val) { registry[name] = val; };
  sim.lazy = function (name, fn) { fn.__lazy = true; registry[name] = fn; };
})(window);
