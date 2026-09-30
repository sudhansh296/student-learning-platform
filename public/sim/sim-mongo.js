/* WebDev Atlas — MongoDB shell (mongosh) simulator. In-memory document database with the query language, update
 * operators, aggregation pipeline, indexes (unique + explain) and mongosh-style output. Requires sim-term.js. */
(function (G) {
  'use strict';
  var sim = G.__sim;
  var INSPECT = Symbol.for('nodejs.util.inspect.custom');

  /* ───────────── BSON-ish types ───────────── */
  var counter = Math.floor(Math.random() * 0xffffff), procRand = Array.from({ length: 10 }, function () { return Math.floor(Math.random() * 16).toString(16); }).join('');
  function newHex() { var t = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0'); counter = (counter + 1) & 0xffffff; return t + procRand + counter.toString(16).padStart(6, '0'); }
  function ObjectId(h) {
    if (!(this instanceof ObjectId)) return new ObjectId(h);
    if (h instanceof ObjectId) h = h.hex; this.hex = h === undefined || h === null ? newHex() : String(h).toLowerCase();
    // Lessons use placeholders like ObjectId("user_id_here") — derive a stable 24-hex id instead of throwing.
    if (!/^[0-9a-f]{24}$/.test(this.hex)) this.hex = sim.crypto ? sim.crypto.createHash('sha1').update(this.hex).digest('hex').slice(0, 24) : newHex();
  }
  ObjectId.prototype.toString = ObjectId.prototype.toHexString = function () { return this.hex; };
  ObjectId.prototype.valueOf = function () { return this.hex; };
  ObjectId.prototype.toJSON = function () { return { $oid: this.hex }; };
  ObjectId.prototype.equals = function (o) { return !!o && String(o.hex || o) === this.hex; };
  ObjectId.prototype.getTimestamp = function () { return new Date(parseInt(this.hex.slice(0, 8), 16) * 1000); };
  ObjectId.prototype[INSPECT] = function () { return "ObjectId('" + this.hex + "')"; };
  ObjectId.isValid = function (s) { return /^[0-9a-fA-F]{24}$/.test(String(s)); };
  function MDate(d) { this.d = d; }
  MDate.prototype[INSPECT] = function () { return "ISODate('" + this.d.toISOString() + "')"; };
  function ISODate(s) { var d = s === undefined ? new Date() : new Date(s); if (isNaN(d)) throw new Error('Invalid Date: ' + s); return d; }
  function NumberInt(n) { return parseInt(n, 10); } function NumberLong(n) { return Number(n); } function NumberDecimal(n) { return Number(n); }
  function UUID(s) { return s || (G.crypto && G.crypto.randomUUID ? G.crypto.randomUUID() : '00000000-0000-4000-8000-000000000000'); }
  function isObj(v) { return v !== null && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date) && !(v instanceof RegExp) && !(v instanceof ObjectId); }
  function clone(v) { if (v instanceof ObjectId) return new ObjectId(v.hex); if (v instanceof Date) return new Date(v.getTime()); if (v instanceof RegExp) return v; if (Array.isArray(v)) return v.map(clone); if (isObj(v)) { var o = {}; Object.keys(v).forEach(function (k) { o[k] = clone(v[k]); }); return o; } return v; }
  function show(v) { if (v instanceof Date) return new MDate(v); if (Array.isArray(v)) return v.map(show); if (isObj(v)) { var o = {}; Object.keys(v).forEach(function (k) { o[k] = show(v[k]); }); return o; } return v; }
  function MongoError(msg, code, name) { var e = new Error(msg); e.name = name || 'MongoServerError'; e.code = code; return e; }

  /* ───────────── comparison / paths ───────────── */
  function rank(v) { if (v === undefined) return 0; if (v === null) return 1; if (typeof v === 'number') return 2; if (typeof v === 'string') return 3; if (Array.isArray(v)) return 5; if (v instanceof ObjectId) return 7; if (typeof v === 'boolean') return 8; if (v instanceof Date) return 9; if (v instanceof RegExp) return 11; return 4; }
  function cmp(a, b) {
    var ra = rank(a), rb = rank(b); if (ra !== rb) return ra < rb ? -1 : 1;
    if (ra <= 1) return 0; if (ra === 2 || ra === 3) return a < b ? -1 : a > b ? 1 : 0; if (ra === 7) return a.hex < b.hex ? -1 : a.hex > b.hex ? 1 : 0; if (ra === 8) return a === b ? 0 : a ? 1 : -1; if (ra === 9) return a - b < 0 ? -1 : a - b > 0 ? 1 : 0;
    if (ra === 5) { for (var i = 0; i < Math.min(a.length, b.length); i++) { var c = cmp(a[i], b[i]); if (c) return c; } return a.length - b.length < 0 ? -1 : a.length > b.length ? 1 : 0; }
    if (ra === 4) { var ka = Object.keys(a), kb = Object.keys(b); for (var j = 0; j < Math.min(ka.length, kb.length); j++) { if (ka[j] !== kb[j]) return ka[j] < kb[j] ? -1 : 1; var c2 = cmp(a[ka[j]], b[kb[j]]); if (c2) return c2; } return ka.length - kb.length < 0 ? -1 : ka.length > kb.length ? 1 : 0; }
    return 0;
  }
  function eq(a, b) { return cmp(a, b) === 0 && rank(a) === rank(b); }
  function getVals(doc, path) { // resolves dotted path, fanning out over arrays; returns array of values (and marks whether path existed)
    var segs = path.split('.'), cur = [doc], found = true;
    segs.forEach(function (s) {
      var next = []; found = false;
      cur.forEach(function (c) {
        if (c === null || c === undefined) return;
        if (Array.isArray(c)) { if (/^\d+$/.test(s) && +s < c.length) { next.push(c[+s]); found = true; } else c.forEach(function (el) { if (isObj(el) && s in el) { next.push(el[s]); found = true; } }); }
        else if (isObj(c) && s in c) { next.push(c[s]); found = true; }
      });
      cur = next;
    });
    return { vals: cur, found: found && cur.length > 0 };
  }
  function getPath(doc, path) { var r = getVals(doc, path); return r.vals.length ? r.vals[0] : undefined; }
  function setPath(doc, path, val) { var segs = path.split('.'), cur = doc; for (var i = 0; i < segs.length - 1; i++) { var s = segs[i]; if (Array.isArray(cur) && /^\d+$/.test(s)) { cur = cur[+s]; continue; } if (cur[s] === undefined || cur[s] === null || typeof cur[s] !== 'object') cur[s] = /^\d+$/.test(segs[i + 1]) ? [] : {}; cur = cur[s]; } var last = segs[segs.length - 1]; if (Array.isArray(cur) && /^\d+$/.test(last)) cur[+last] = val; else cur[last] = val; }
  function unsetPath(doc, path) { var segs = path.split('.'), cur = doc; for (var i = 0; i < segs.length - 1; i++) { cur = cur && cur[segs[i]]; if (cur === undefined || cur === null) return; } if (Array.isArray(cur)) cur[+segs[segs.length - 1]] = null; else delete cur[segs[segs.length - 1]]; }

  /* ───────────── query matching ───────────── */
  function typeName(v) { if (v === null) return 'null'; if (Array.isArray(v)) return 'array'; if (typeof v === 'number') return Number.isInteger(v) ? 'int' : 'double'; if (typeof v === 'string') return 'string'; if (typeof v === 'boolean') return 'bool'; if (v instanceof Date) return 'date'; if (v instanceof ObjectId) return 'objectId'; if (v instanceof RegExp) return 'regex'; return 'object'; }
  function sameClass(a, b) { var ra = rank(a), rb = rank(b); return ra === rb; }
  function opTest(op, val, arg, fieldVals) {
    // val: a single candidate value (element or whole field)
    switch (op) {
      case '$eq': return eq(val, arg) || (arg instanceof RegExp && typeof val === 'string' && arg.test(val));
      case '$ne': return !eq(val, arg);
      case '$gt': return sameClass(val, arg) && cmp(val, arg) > 0; case '$gte': return sameClass(val, arg) && cmp(val, arg) >= 0;
      case '$lt': return sameClass(val, arg) && cmp(val, arg) < 0; case '$lte': return sameClass(val, arg) && cmp(val, arg) <= 0;
      case '$in': return arg.some(function (a) { return a instanceof RegExp ? typeof val === 'string' && a.test(val) : eq(val, a); });
      case '$nin': return !arg.some(function (a) { return eq(val, a); });
      case '$regex': var re = arg instanceof RegExp ? arg : new RegExp(arg, fieldVals && fieldVals.$options || ''); return typeof val === 'string' && re.test(val);
      case '$mod': return typeof val === 'number' && val % arg[0] === arg[1];
      case '$type': return [].concat(arg).some(function (t) { var tn = typeName(val); return tn === t || (t === 'number' && (tn === 'int' || tn === 'double')) || (t === 2 && tn === 'string') || (t === 16 && tn === 'int') || (t === 1 && tn === 'double'); });
      default: return false;
    }
  }
  function matchField(doc, path, cond) {
    var r = getVals(doc, path), vals = r.vals;
    if (isObj(cond) && Object.keys(cond).length && Object.keys(cond).every(function (k) { return k[0] === '$'; })) {
      return Object.keys(cond).every(function (op) {
        var arg = cond[op];
        if (op === '$options') return true;
        if (op === '$exists') return (r.found ? true : false) === !!arg;
        if (op === '$not') return !matchField(doc, path, arg instanceof RegExp ? { $regex: arg } : arg);
        if (op === '$size') return vals.some(function (v) { return Array.isArray(v) && v.length === arg; });
        if (op === '$all') return vals.some(function (v) { var arr = Array.isArray(v) ? v : [v]; return arg.every(function (a) { return arr.some(function (x) { return eq(x, a); }); }); });
        if (op === '$elemMatch') return vals.some(function (v) { return Array.isArray(v) && v.some(function (el) { return isObj(el) && Object.keys(arg).every(function (k) { return k[0] === '$' ? true : true; }) && (Object.keys(arg).some(function (k) { return k[0] === '$'; }) ? matchField({ v: el }, 'v', arg) : match(el, arg)) || (!isObj(el) && matchField({ v: el }, 'v', arg)); }); });
        if (op === '$ne' || op === '$nin') { if (!r.found) return true; return vals.every(function (v) { return Array.isArray(v) ? v.every(function (el) { return opTest(op, el, arg); }) && opTest(op, v, arg) : opTest(op, v, arg); }); }
        if (!r.found) return op === '$eq' && arg === null ? true : false;
        return vals.some(function (v) { if (Array.isArray(v)) return opTest(op, v, arg, cond) || v.some(function (el) { return opTest(op, el, arg, cond); }); return opTest(op, v, arg, cond); });
      });
    }
    if (cond instanceof RegExp) return vals.some(function (v) { return typeof v === 'string' ? cond.test(v) : Array.isArray(v) && v.some(function (el) { return typeof el === 'string' && cond.test(el); }); });
    if (!r.found) return cond === null;
    return vals.some(function (v) { return eq(v, cond) || (Array.isArray(v) && v.some(function (el) { return eq(el, cond); })); });
  }
  function match(doc, q) {
    if (!q) return true;
    return Object.keys(q).every(function (k) {
      var c = q[k];
      if (k === '$and') return c.every(function (s) { return match(doc, s); });
      if (k === '$or') return c.some(function (s) { return match(doc, s); });
      if (k === '$nor') return !c.some(function (s) { return match(doc, s); });
      if (k === '$expr') return !!evalExpr(c, doc);
      if (k === '$text') { var terms = String(c.$search).toLowerCase().split(/\s+/).filter(Boolean); var txt = JSON.stringify(doc, function (kk, vv) { return typeof vv === 'string' ? vv : vv instanceof Object || Array.isArray(vv) ? vv : undefined; }).toLowerCase(); return terms.some(function (t) { return txt.indexOf(t) >= 0; }); }
      if (k === '$where') return false;
      return matchField(doc, k, c);
    });
  }

  /* ───────────── aggregation expressions ───────────── */
  function evalExpr(e, doc) {
    if (typeof e === 'string') { if (e[0] === '$' && e[1] === '$') { if (e === '$$ROOT' || e === '$$CURRENT') return doc; var pv = doc && doc.__vars && doc.__vars[e.slice(2).split('.')[0]]; return pv === undefined ? undefined : e.indexOf('.') > 0 ? getPath(pv, e.slice(2).split('.').slice(1).join('.')) : pv; } if (e[0] === '$') return getPath(doc, e.slice(1)); return e; }
    if (Array.isArray(e)) return e.map(function (x) { return evalExpr(x, doc); });
    if (e instanceof Date || e instanceof ObjectId || e instanceof RegExp || !isObj(e)) return e;
    var keys = Object.keys(e); if (!keys.length) return {};
    if (keys.length === 1 && keys[0][0] === '$') {
      var op = keys[0], a = e[op], ev = function (x) { return evalExpr(x, doc); }, args = Array.isArray(a) ? a.map(ev) : [ev(a)];
      var num = function (x) { return x === null || x === undefined ? null : Number(x); };
      switch (op) {
        case '$literal': return a;
        case '$meta': return 1.5;
        case '$add': return args.reduce(function (s, x) { return x instanceof Date ? new Date(s + x.getTime()) : s + x; }, 0);
        case '$subtract': return args[0] instanceof Date && args[1] instanceof Date ? args[0] - args[1] : args[0] instanceof Date ? new Date(args[0].getTime() - args[1]) : num(args[0]) - num(args[1]);
        case '$multiply': return args.reduce(function (s, x) { return s * x; }, 1); case '$divide': return num(args[0]) / num(args[1]); case '$mod': return num(args[0]) % num(args[1]);
        case '$abs': return Math.abs(args[0]); case '$ceil': return Math.ceil(args[0]); case '$floor': return Math.floor(args[0]); case '$sqrt': return Math.sqrt(args[0]); case '$pow': return Math.pow(args[0], args[1]); case '$exp': return Math.exp(args[0]); case '$ln': return Math.log(args[0]);
        case '$round': var pl = args[1] || 0, f = Math.pow(10, pl); return Math.round(args[0] * f) / f; case '$trunc': return Math.trunc(args[0]);
        case '$concat': return args.some(function (x) { return x === null || x === undefined; }) ? null : args.join(''); case '$toUpper': return String(args[0] === null ? '' : args[0]).toUpperCase(); case '$toLower': return String(args[0] === null ? '' : args[0]).toLowerCase();
        case '$substr': case '$substrCP': case '$substrBytes': return String(args[0]).substr(args[1], args[2]); case '$strLenCP': case '$strLenBytes': return String(args[0]).length; case '$split': return String(args[0]).split(args[1]); case '$trim': return String(args[0].input === undefined ? args[0] : args[0].input).trim();
        case '$ifNull': return args[0] === null || args[0] === undefined ? args[1] : args[0];
        case '$cond': if (Array.isArray(a)) return ev(a[0]) ? ev(a[1]) : ev(a[2]); return ev(a['if']) ? ev(a.then) : ev(a['else']);
        case '$switch': for (var i = 0; i < a.branches.length; i++) if (ev(a.branches[i]['case'])) return ev(a.branches[i].then); return a['default'] !== undefined ? ev(a['default']) : null;
        case '$eq': return eq(args[0], args[1]); case '$ne': return !eq(args[0], args[1]); case '$gt': return cmp(args[0], args[1]) > 0; case '$gte': return cmp(args[0], args[1]) >= 0; case '$lt': return cmp(args[0], args[1]) < 0; case '$lte': return cmp(args[0], args[1]) <= 0; case '$cmp': return cmp(args[0], args[1]);
        case '$and': return args.every(Boolean); case '$or': return args.some(Boolean); case '$not': return !args[0];
        case '$size': return Array.isArray(args[0]) ? args[0].length : null; case '$isArray': return Array.isArray(args[0]); case '$arrayElemAt': return args[0] && (args[1] < 0 ? args[0][args[0].length + args[1]] : args[0][args[1]]);
        case '$first': return Array.isArray(args[0]) ? args[0][0] : args[0]; case '$last': return Array.isArray(args[0]) ? args[0][args[0].length - 1] : args[0];
        case '$in': return Array.isArray(args[1]) && args[1].some(function (x) { return eq(x, args[0]); }); case '$concatArrays': return [].concat.apply([], args); case '$reverseArray': return args[0].slice().reverse(); case '$slice': return args.length === 2 ? (args[1] < 0 ? args[0].slice(args[1]) : args[0].slice(0, args[1])) : args[0].slice(args[1], args[1] + args[2]);
        case '$sum': var arr = Array.isArray(a) ? args : Array.isArray(args[0]) ? args[0] : args; return arr.reduce(function (s, x) { return s + (typeof x === 'number' ? x : 0); }, 0);
        case '$avg': var av = (Array.isArray(a) ? args : Array.isArray(args[0]) ? args[0] : args).filter(function (x) { return typeof x === 'number'; }); return av.length ? av.reduce(function (s, x) { return s + x; }, 0) / av.length : null;
        case '$max': var mv = (Array.isArray(a) ? args : Array.isArray(args[0]) ? args[0] : args); return mv.reduce(function (m, x) { return m === undefined || cmp(x, m) > 0 ? x : m; }, undefined); case '$min': var nv = (Array.isArray(a) ? args : Array.isArray(args[0]) ? args[0] : args); return nv.reduce(function (m, x) { return m === undefined || cmp(x, m) < 0 ? x : m; }, undefined);
        case '$map': var mvars = a['as'] || 'this'; return (ev(a.input) || []).map(function (it) { var d2 = Object.assign({}, doc, { __vars: Object.assign({}, doc.__vars, (function () { var o = {}; o[mvars] = it; return o; })()) }); return evalExpr(a['in'], d2); });
        case '$filter': var fvars = a['as'] || 'this'; return (ev(a.input) || []).filter(function (it) { var d2 = Object.assign({}, doc, { __vars: Object.assign({}, doc.__vars, (function () { var o = {}; o[fvars] = it; return o; })()) }); return evalExpr(a.cond, d2); });
        case '$mergeObjects': return Object.assign.apply(null, [{}].concat(args)); case '$type': return typeName(args[0]); case '$toString': return args[0] === null ? null : String(args[0]); case '$toInt': case '$toLong': return parseInt(args[0], 10); case '$toDouble': case '$toDecimal': return Number(args[0]); case '$toObjectId': return new ObjectId(args[0]); case '$toBool': return !!args[0]; case '$toDate': return new Date(args[0]);
        case '$year': return args[0].getUTCFullYear(); case '$month': return args[0].getUTCMonth() + 1; case '$dayOfMonth': return args[0].getUTCDate(); case '$hour': return args[0].getUTCHours(); case '$minute': return args[0].getUTCMinutes(); case '$second': return args[0].getUTCSeconds(); case '$dayOfWeek': return args[0].getUTCDay() + 1; case '$dayOfYear': return Math.floor((args[0] - Date.UTC(args[0].getUTCFullYear(), 0, 0)) / 864e5);
        case '$dateToString': var dt = ev(a.date), fm = a.format || '%Y-%m-%dT%H:%M:%S.%LZ', p2 = function (n, w) { return String(n).padStart(w || 2, '0'); }; return fm.replace(/%Y/g, dt.getUTCFullYear()).replace(/%m/g, p2(dt.getUTCMonth() + 1)).replace(/%d/g, p2(dt.getUTCDate())).replace(/%H/g, p2(dt.getUTCHours())).replace(/%M/g, p2(dt.getUTCMinutes())).replace(/%S/g, p2(dt.getUTCSeconds())).replace(/%L/g, p2(dt.getUTCMilliseconds(), 3));
        case '$objectToArray': return Object.keys(args[0]).map(function (k) { return { k: k, v: args[0][k] }; });
        default: throw MongoError('Unrecognized expression \'' + op + '\'', 168);
      }
    }
    var o = {}; keys.forEach(function (k) { o[k] = evalExpr(e[k], doc); }); return o;
  }

  /* ───────────── update operators ───────────── */
  function applyPos(doc, path, fn, ctx) {
    var segs = path.split('.'), idx = segs.findIndex(function (s) { return s === '$' || s === '$[]' || /^\$\[\w+\]$/.test(s); });
    if (idx < 0) { fn(doc, path); return; }
    var before = segs.slice(0, idx).join('.'), after = segs.slice(idx + 1).join('.'), arr = before ? getPath(doc, before) : doc, s = segs[idx];
    if (!Array.isArray(arr)) throw MongoError("The path '" + before + "' must exist in the document in order to apply array updates.", 2);
    arr.forEach(function (el, i) {
      var ok = true;
      if (s === '$') ok = ctx && ctx.matchedIndex === i; else if (s !== '$[]') { var id = s.slice(2, -1), filt = (ctx.arrayFilters || []).filter(function (f) { return Object.keys(f).some(function (k) { return k === id || k.indexOf(id + '.') === 0; }); }); ok = filt.every(function (f) { var w = {}; Object.keys(f).forEach(function (k) { w[k === id ? 'v' : 'v.' + k.slice(id.length + 1)] = f[k]; }); return match({ v: el }, w); }); }
      if (!ok) return;
      if (after) fn(el, after); else fn(arr, String(i));
    });
  }
  function matchedIndex(doc, filter) { var idx = -1; Object.keys(filter || {}).forEach(function (k) { if (k[0] === '$' || idx >= 0) return; var r = getVals(doc, k); r.vals.forEach(function (v) { if (Array.isArray(v) && idx < 0) { var i = v.findIndex(function (el) { return matchField({ v: el }, 'v', filter[k]) || (isObj(filter[k]) && false); }); if (i >= 0) idx = i; } }); }); return idx; }
  function applyUpdate(doc, upd, ctx) {
    ctx = ctx || {}; var keys = Object.keys(upd);
    if (!keys.length || keys.every(function (k) { return k[0] !== '$'; })) { var id = doc._id; Object.keys(doc).forEach(function (k) { delete doc[k]; }); Object.assign(doc, clone(upd)); if (id !== undefined && doc._id === undefined) doc = Object.assign(doc, { _id: id }); if (id !== undefined) { var reord = { _id: id }; Object.keys(doc).forEach(function (k) { if (k !== '_id') reord[k] = doc[k]; }); Object.keys(doc).forEach(function (k) { delete doc[k]; }); Object.assign(doc, reord); } return; }
    keys.forEach(function (op) {
      var spec = upd[op];
      Object.keys(spec).forEach(function (path) {
        var v = spec[path], mi = { matchedIndex: ctx.matchedIndex, arrayFilters: ctx.arrayFilters };
        applyPos(doc, path, function (target, p) {
          var cur = getPath(target, p);
          switch (op) {
            case '$set': setPath(target, p, clone(v)); break;
            case '$setOnInsert': if (ctx.inserting) setPath(target, p, clone(v)); break;
            case '$unset': unsetPath(target, p); break;
            case '$inc': if (cur !== undefined && typeof cur !== 'number') throw MongoError("Cannot apply $inc to a value of non-numeric type. {_id: " + fmtId(target._id) + "} has the field '" + p + "' of non-numeric type " + typeName(cur), 14); setPath(target, p, (cur || 0) + v); break;
            case '$mul': setPath(target, p, (cur || 0) * v); break;
            case '$min': if (cur === undefined || cmp(v, cur) < 0) setPath(target, p, clone(v)); break; case '$max': if (cur === undefined || cmp(v, cur) > 0) setPath(target, p, clone(v)); break;
            case '$rename': var val = getPath(target, p); if (val !== undefined) { unsetPath(target, p); setPath(target, v, val); } break;
            case '$currentDate': setPath(target, p, new Date()); break;
            case '$push': { if (cur === undefined) { cur = []; setPath(target, p, cur); } if (!Array.isArray(cur)) throw MongoError("The field '" + p + "' must be an array but is of type " + typeName(cur) + ' in document {_id: ' + fmtId(target._id) + '}', 2); var items = isObj(v) && v.$each ? v.$each : [v]; if (isObj(v) && v.$position !== undefined) cur.splice.apply(cur, [v.$position, 0].concat(clone(items))); else items.forEach(function (x) { cur.push(clone(x)); }); if (isObj(v) && v.$sort !== undefined) cur.sort(function (a, b) { return typeof v.$sort === 'number' ? v.$sort * cmp(a, b) : sortCmp(a, b, v.$sort); }); if (isObj(v) && v.$slice !== undefined) { var sl = v.$slice; var kept = sl < 0 ? cur.slice(sl) : cur.slice(0, sl); cur.length = 0; kept.forEach(function (x) { cur.push(x); }); } break; }
            case '$addToSet': { if (cur === undefined) { cur = []; setPath(target, p, cur); } var its = isObj(v) && v.$each ? v.$each : [v]; its.forEach(function (x) { if (!cur.some(function (y) { return eq(y, x); })) cur.push(clone(x)); }); break; }
            case '$pull': if (Array.isArray(cur)) { var keep = cur.filter(function (el) { return isObj(v) && !Object.keys(v).some(function (k) { return k[0] === '$'; }) ? !match(el, v) : isObj(v) ? !matchField({ v: el }, 'v', v) : !eq(el, v); }); cur.length = 0; keep.forEach(function (x) { cur.push(x); }); } break;
            case '$pullAll': if (Array.isArray(cur)) { var k2 = cur.filter(function (el) { return !v.some(function (x) { return eq(el, x); }); }); cur.length = 0; k2.forEach(function (x) { cur.push(x); }); } break;
            case '$pop': if (Array.isArray(cur)) { if (v === -1) cur.shift(); else cur.pop(); } break;
            default: throw MongoError('Unknown modifier: ' + op + '. Expected a valid update modifier or pipeline-style update specified as an array', 9);
          }
        }, mi);
      });
    });
  }
  function fmtId(id) { return id instanceof ObjectId ? "ObjectId('" + id.hex + "')" : JSON.stringify(id); }
  function sortCmp(a, b, spec) { var ks = Object.keys(spec); for (var i = 0; i < ks.length; i++) { var c = cmp(getPath(a, ks[i]), getPath(b, ks[i])); if (c) return c * (spec[ks[i]] < 0 ? -1 : 1); } return 0; }
  function project(doc, spec) {
    if (!spec || !Object.keys(spec).length) return doc; var keys = Object.keys(spec), incl = keys.filter(function (k) { return k !== '_id' && spec[k] !== 0 && spec[k] !== false; }), out;
    if (incl.length) { out = {}; if (spec._id !== 0 && spec._id !== false && doc._id !== undefined) out._id = doc._id; incl.forEach(function (k) { if (isObj(spec[k]) && spec[k].$slice !== undefined) { var arr = getPath(doc, k); if (Array.isArray(arr)) setPath(out, k, [].concat(spec[k].$slice)[0] < 0 ? arr.slice([].concat(spec[k].$slice)[0]) : arr.slice(0, [].concat(spec[k].$slice)[0])); } else if (spec[k] === 1 || spec[k] === true) { var v = getPath(doc, k); if (v !== undefined) setPath(out, k, clone(v)); } else { setPath(out, k, evalExpr(spec[k], doc)); } }); return out; }
    out = clone(doc); keys.forEach(function (k) { if (spec[k] === 0 || spec[k] === false) unsetPath(out, k); }); return out;
  }

  /* ───────────── aggregation pipeline ───────────── */
  function accumulate(spec, docs) {
    var op = Object.keys(spec)[0], arg = spec[op], vals = function () { return docs.map(function (d) { return evalExpr(arg, d); }); };
    switch (op) {
      case '$sum': return vals().reduce(function (s, x) { return s + (typeof x === 'number' ? x : 0); }, 0); case '$count': return docs.length;
      case '$avg': var v = vals().filter(function (x) { return typeof x === 'number'; }); return v.length ? v.reduce(function (s, x) { return s + x; }, 0) / v.length : null;
      case '$min': return vals().filter(function (x) { return x !== null && x !== undefined; }).reduce(function (m, x) { return m === undefined || cmp(x, m) < 0 ? x : m; }, undefined) || null; case '$max': var mx = vals().filter(function (x) { return x !== null && x !== undefined; }).reduce(function (m, x) { return m === undefined || cmp(x, m) > 0 ? x : m; }, undefined); return mx === undefined ? null : mx;
      case '$push': return vals().map(clone); case '$addToSet': var out = []; vals().forEach(function (x) { if (!out.some(function (y) { return eq(x, y); })) out.push(clone(x)); }); return out;
      case '$first': return docs.length ? evalExpr(arg, docs[0]) : null; case '$last': return docs.length ? evalExpr(arg, docs[docs.length - 1]) : null;
      case '$stdDevPop': case '$stdDevSamp': var xs = vals().filter(function (x) { return typeof x === 'number'; }), mean = xs.reduce(function (s, x) { return s + x; }, 0) / xs.length, ss = xs.reduce(function (s, x) { return s + (x - mean) * (x - mean); }, 0); return Math.sqrt(ss / (op === '$stdDevPop' ? xs.length : xs.length - 1));
      default: throw MongoError('Unknown group operator \'' + op + '\'', 15952);
    }
  }
  function runPipeline(docs, stages, ctx) {
    var cur = docs.map(clone);
    stages.forEach(function (st) {
      var op = Object.keys(st)[0], a = st[op];
      switch (op) {
        case '$match': cur = cur.filter(function (d) { return match(d, a); }); break;
        case '$sort': cur = cur.slice().sort(function (x, y) { return sortCmp(x, y, a); }); break;
        case '$limit': cur = cur.slice(0, a); break; case '$skip': cur = cur.slice(a); break;
        case '$project': cur = cur.map(function (d) { return project(d, a); }); break;
        case '$addFields': case '$set': cur = cur.map(function (d) { var o = clone(d); Object.keys(a).forEach(function (k) { setPath(o, k, evalExpr(a[k], d)); }); return o; }); break;
        case '$unset': cur = cur.map(function (d) { var o = clone(d); [].concat(a).forEach(function (k) { unsetPath(o, k); }); return o; }); break;
        case '$count': cur = [(function () { var o = {}; o[a] = cur.length; return o; })()]; break;
        case '$group': {
          var groups = [], index = {}; cur.forEach(function (d) { var id = evalExpr(a._id, d), key = JSON.stringify(id, function (k, v) { return v instanceof ObjectId ? 'oid:' + v.hex : v; }); if (!(key in index)) { index[key] = { id: id, docs: [] }; groups.push(index[key]); } index[key].docs.push(d); });
          cur = groups.map(function (g) { var o = { _id: g.id }; Object.keys(a).forEach(function (k) { if (k !== '_id') o[k] = accumulate(a[k], g.docs); }); return o; }); break;
        }
        case '$unwind': { var path = (typeof a === 'string' ? a : a.path).slice(1), keepEmpty = isObj(a) && a.preserveNullAndEmptyArrays, idxName = isObj(a) && a.includeArrayIndex, out2 = []; cur.forEach(function (d) { var arr = getPath(d, path); if (Array.isArray(arr) && arr.length) arr.forEach(function (el, i) { var o = clone(d); setPath(o, path, clone(el)); if (idxName) o[idxName] = i; out2.push(o); }); else if (keepEmpty) { var o2 = clone(d); if (Array.isArray(arr)) unsetPath(o2, path); out2.push(o2); } else if (arr !== undefined && arr !== null && !Array.isArray(arr)) out2.push(clone(d)); }); cur = out2; break; }
        case '$lookup': { var foreign = ctx.collectionDocs(a.from); cur = cur.map(function (d) { var o = clone(d), lv = getPath(d, a.localField); o[a['as']] = foreign.filter(function (f) { var fv = getPath(f, a.foreignField); return Array.isArray(lv) ? lv.some(function (x) { return eq(x, fv); }) : Array.isArray(fv) ? fv.some(function (x) { return eq(x, lv); }) : eq(lv, fv); }).map(clone); return o; }); break; }
        case '$sortByCount': { var cnt = {}, order = []; cur.forEach(function (d) { var v = evalExpr(a, d), k = JSON.stringify(v); if (!(k in cnt)) { cnt[k] = { _id: v, count: 0 }; order.push(cnt[k]); } cnt[k].count++; }); cur = order.sort(function (x, y) { return y.count - x.count; }); break; }
        case '$replaceRoot': case '$replaceWith': cur = cur.map(function (d) { return evalExpr(op === '$replaceRoot' ? a.newRoot : a, d); }); break;
        case '$sample': cur = cur.slice().sort(function () { return Math.random() - 0.5; }).slice(0, a.size); break;
        case '$facet': { var base = cur, res = {}; Object.keys(a).forEach(function (k) { res[k] = runPipeline(base, a[k], ctx); }); cur = [res]; break; }
        case '$bucket': { var bnds = a.boundaries, o3 = bnds.slice(0, -1).map(function (b, i) { return { _id: b, docs: [], hi: bnds[i + 1] }; }), other = { _id: a['default'], docs: [] }; cur.forEach(function (d) { var v = evalExpr(a.groupBy, d), b = o3.filter(function (x) { return cmp(v, x._id) >= 0 && cmp(v, x.hi) < 0; })[0]; (b || other).docs.push(d); }); var outB = o3.concat(a['default'] !== undefined ? [other] : []).filter(function (b) { return b.docs.length; }); cur = outB.map(function (b) { var o = { _id: b._id }; var outSpec = a.output || { count: { $sum: 1 } }; Object.keys(outSpec).forEach(function (k) { o[k] = accumulate(outSpec[k], b.docs); }); return o; }); break; }
        case '$indexStats': cur = (ctx.indexes ? ctx.indexes() : []).map(function (ix) { return { name: ix.name, key: ix.key, host: 'atlas-sandbox:27017', accesses: { ops: 0, since: new Date() }, spec: Object.assign({ v: 2 }, { key: ix.key, name: ix.name }) }; }); break;
        case '$collStats': cur = [{ ns: ctx.ns || '', count: cur.length, storageStats: { size: JSON.stringify(cur).length, count: cur.length } }]; break;
        case '$out': ctx.writeCollection(a, cur); break;
        case '$merge': ctx.writeCollection(typeof a === 'string' ? a : a.into, cur); break;
        default: throw MongoError('Unrecognized pipeline stage name: \'' + op + '\'', 40324);
      }
    });
    return cur;
  }

  /* ───────────── database ───────────── */
  function Server() { this.dbs = {}; }
  Server.prototype.db = function (name) { return this.dbs[name] || (this.dbs[name] = { name: name, cols: {} }); };
  function Cursor(col, filter, projection, opts) { this._col = col; this._filter = filter || {}; this._proj = projection; this._sort = null; this._limit = 0; this._skip = 0; this._pos = 0; this._docs = null; this._hint = null; this._opts = opts || {}; }
  Cursor.prototype._run = function () {
    if (this._docs) return this._docs; var docs = this._col.docs.filter(function (d) { return match(d, this._filter); }, this);
    if (this._sort) docs = docs.slice().sort(function (a, b) { return sortCmp(a, b, this._sort); }.bind(this)); if (this._skip) docs = docs.slice(this._skip); if (this._limit) docs = docs.slice(0, this._limit);
    this._docs = docs.map(function (d) { return project(d, this._proj); }, this); return this._docs;
  };
  ['sort', 'limit', 'skip', 'hint', 'maxTimeMS', 'collation', 'batchSize', 'comment', 'allowDiskUse', 'readPref', 'noCursorTimeout', 'tailable'].forEach(function (m) { Cursor.prototype[m] = function (v) { if (m === 'sort') this._sort = v; else if (m === 'limit') this._limit = v; else if (m === 'skip') this._skip = v; else if (m === 'hint') this._hint = v; return this; }; });
  Cursor.prototype.project = function (p) { this._proj = p; return this; };
  Cursor.prototype.toArray = function () { return this._run().slice(); };
  Cursor.prototype.forEach = function (f) { this._run().forEach(function (d, i) { f(d, i); }); };
  Cursor.prototype.map = function (f) { var out = new Cursor(this._col); out._docs = this._run().map(f); return out; };
  Cursor.prototype.count = function () { var s = this._skip, l = this._limit; this._skip = 0; this._limit = 0; this._docs = null; var n = this._run().length; this._skip = s; this._limit = l; this._docs = null; return n; };
  Cursor.prototype.itcount = function () { return this._run().length; }; Cursor.prototype.size = Cursor.prototype.count;
  Cursor.prototype.hasNext = function () { return this._pos < this._run().length; }; Cursor.prototype.next = function () { if (!this.hasNext()) throw MongoError('Cursor is exhausted', 0, 'Error'); return this._run()[this._pos++]; };
  Cursor.prototype.pretty = function () { return this; }; Cursor.prototype.close = function () { };
  Cursor.prototype[Symbol.iterator] = function () { var i = 0, docs = this._run(); return { next: function () { return i < docs.length ? { value: docs[i++], done: false } : { value: undefined, done: true }; } }; };
  Cursor.prototype.explain = function (verbosity) {
    var col = this._col, filter = this._filter, keysF = Object.keys(filter).filter(function (k) { return k[0] !== '$'; }), idx = null, self = this;
    col.indexes.forEach(function (ix) { var first = Object.keys(ix.key)[0]; if (!idx && (keysF.indexOf(first) >= 0 || (self._sort && Object.keys(self._sort)[0] === first && !keysF.length))) idx = ix; });
    if (!idx && filter._id !== undefined) idx = col.indexes[0]; if (this._hint) { var hn = typeof this._hint === 'string' ? this._hint : Object.keys(this._hint).map(function (k) { return k + '_' + this._hint[k]; }, this).join('_'); idx = col.indexes.filter(function (ix) { return ix.name === hn; })[0] || idx; }
    var matched = col.docs.filter(function (d) { return match(d, filter); }), n = this._limit ? Math.min(matched.length, this._limit) : matched.length, examined = idx ? matched.length : col.docs.length;
    var parsed = filter, plan = idx ? { stage: this._sort && !keysF.length ? 'FETCH' : 'FETCH', inputStage: { stage: 'IXSCAN', keyPattern: idx.key, indexName: idx.name, isMultiKey: false, multiKeyPaths: {}, isUnique: !!idx.unique, isSparse: false, isPartial: false, indexVersion: 2, direction: 'forward', indexBounds: (function () { var b = {}; Object.keys(idx.key).forEach(function (k) { b[k] = ['[MinKey, MaxKey]']; }); return b; })() } } : { stage: 'COLLSCAN', filter: filter, direction: 'forward' };
    if (this._sort && !idx) plan = { stage: 'SORT', sortPattern: this._sort, memLimit: 104857600, type: 'simple', inputStage: plan };
    if (this._limit) plan = { stage: 'LIMIT', limitAmount: this._limit, inputStage: plan };
    var out = { explainVersion: '1', queryPlanner: { namespace: col.ns, parsedQuery: parsed, indexFilterSet: false, queryHash: 'A1B2C3D4', planCacheKey: 'E5F6A7B8', maxIndexedOrSolutionsReached: false, maxIndexedAndSolutionsReached: false, maxScansToExplodeReached: false, winningPlan: plan, rejectedPlans: [] }, command: { find: col.name, filter: filter, '$db': col.dbName }, serverInfo: { host: 'atlas-sandbox', port: 27017, version: '7.0.5' }, serverParameters: { internalQueryFacetBufferSizeBytes: 104857600 }, ok: 1 };
    if (verbosity === 'executionStats' || verbosity === 'allPlansExecution') { out.executionStats = { executionSuccess: true, nReturned: n, executionTimeMillis: idx ? 0 : 1, totalKeysExamined: idx ? examined : 0, totalDocsExamined: examined, executionStages: Object.assign({}, plan, { nReturned: n, executionTimeMillisEstimate: 0, works: examined + 1, advanced: n, needTime: examined - n, needYield: 0, saveState: 0, restoreState: 0, isEOF: 1 }) }; }
    return out;
  };

  function Collection(db, name) { this.db = db; this.name = name; this.dbName = db.name; this.ns = db.name + '.' + name; this.docs = []; this.indexes = [{ v: 2, key: { _id: 1 }, name: '_id_' }]; }
  function ensureCol(server, dbName, colName) { var db = server.db(dbName); return db.cols[colName] || (db.cols[colName] = new Collection(db, colName)); }
  function idxName(key) { return Object.keys(key).map(function (k) { return k + '_' + key[k]; }).join('_'); }
  function keyOf(doc, ix) { return Object.keys(ix.key).map(function (k) { return getPath(doc, k); }); }
  function checkUnique(col, doc, selfDoc) {
    col.indexes.forEach(function (ix) {
      if (!ix.unique && ix.name !== '_id_') return; var mine = keyOf(doc, ix);
      if (ix.sparse && mine.every(function (v) { return v === undefined; })) return;
      if (col.docs.some(function (d) { if (d === selfDoc) return false; var k = keyOf(d, ix); return k.every(function (v, i) { return eq(v === undefined ? null : v, mine[i] === undefined ? null : mine[i]); }); })) {
        var keyObj = {}; Object.keys(ix.key).forEach(function (k, i) { keyObj[k] = mine[i] === undefined ? null : mine[i]; });
        var e = MongoError('E11000 duplicate key error collection: ' + col.ns + ' index: ' + ix.name + ' dup key: ' + sim.inspect(show(keyObj)), 11000); e.keyPattern = ix.key; e.keyValue = keyObj; throw e;
      }
    });
  }
  function docOrder(doc) { if (doc._id === undefined) { var o = { _id: new ObjectId() }; Object.keys(doc).forEach(function (k) { o[k] = doc[k]; }); return o; } return doc; }
  function needObjOrThrow(d, what) { if (!isObj(d)) throw MongoError('document to insert must be an object', 0, 'MongoInvalidArgumentError'); void what; }
  function collectionApi(server, col) {
    var C = {
      insertOne: function (d) { needObjOrThrow(d); var doc = docOrder(clone(d)); checkUnique(col, doc, null); col.docs.push(doc); return { acknowledged: true, insertedId: doc._id }; },
      insertMany: function (arr) { if (!Array.isArray(arr)) throw MongoError('docs parameter must be an array of documents', 0, 'MongoInvalidArgumentError'); var ids = {}; arr.forEach(function (d, i) { var doc = docOrder(clone(d)); try { checkUnique(col, doc, null); } catch (e) { if (i > 0) e.message += ' (' + i + ' document' + (i > 1 ? 's' : '') + ' inserted before this error)'; throw e; } col.docs.push(doc); ids[i] = doc._id; }); return { acknowledged: true, insertedIds: ids }; },
      find: function (q, p) { return new Cursor(col, q, p); },
      findOne: function (q, p) { var d = col.docs.filter(function (x) { return match(x, q); })[0]; return d ? project(d, p) : null; },
      countDocuments: function (q) { return col.docs.filter(function (d) { return match(d, q || {}); }).length; }, estimatedDocumentCount: function () { return col.docs.length; },
      count: function (q) { return C.countDocuments(q); },
      distinct: function (f, q) { var out = []; col.docs.filter(function (d) { return match(d, q || {}); }).forEach(function (d) { getVals(d, f).vals.forEach(function (v) { (Array.isArray(v) ? v : [v]).forEach(function (x) { if (!out.some(function (y) { return eq(x, y); })) out.push(x); }); }); }); return out.sort(cmp); },
      updateOne: function (q, u, o) { return doUpdate(q, u, o, false); }, updateMany: function (q, u, o) { return doUpdate(q, u, o, true); },
      replaceOne: function (q, r, o) { return doUpdate(q, r, o, false); },
      deleteOne: function (q) { var i = col.docs.findIndex(function (d) { return match(d, q); }); if (i >= 0) col.docs.splice(i, 1); return { acknowledged: true, deletedCount: i >= 0 ? 1 : 0 }; },
      deleteMany: function (q) { var before = col.docs.length; col.docs = col.docs.filter(function (d) { return !match(d, q || {}); }); return { acknowledged: true, deletedCount: before - col.docs.length }; },
      findOneAndUpdate: function (q, u, o) { o = o || {}; var d = col.docs.filter(function (x) { return match(x, q); })[0]; if (!d) { if (o.upsert) { var r = doUpdate(q, u, o, false); return o.returnDocument === 'after' || o.returnNewDocument ? col.docs.filter(function (x) { return eq(x._id, r.upsertedId); })[0] : null; } return null; } var before = clone(d); doUpdate({ _id: d._id }, u, o, false); return o.returnDocument === 'after' || o.returnNewDocument ? project(col.docs.filter(function (x) { return eq(x._id, d._id); })[0], o.projection) : project(before, o.projection); },
      findOneAndDelete: function (q) { var i = col.docs.findIndex(function (d) { return match(d, q); }); if (i < 0) return null; return col.docs.splice(i, 1)[0]; },
      findOneAndReplace: function (q, r, o) { return C.findOneAndUpdate(q, r, o); },
      aggregate: function (pipeline) { var out = runPipeline(col.docs, pipeline, { ns: col.ns, indexes: function () { return col.indexes; }, collectionDocs: function (n) { return ensureCol(server, col.dbName, n).docs; }, writeCollection: function (n, docs) { var t = ensureCol(server, col.dbName, n); t.docs = docs.map(clone); } }); var c = new Cursor(col); c._docs = out; return c; },
      createIndex: function (keys, o) { o = o || {}; if (typeof keys === 'string') { var kk = {}; kk[keys] = 1; keys = kk; } var name = o.name || idxName(keys); var ex = col.indexes.filter(function (i) { return i.name === name; })[0]; if (ex) return name; if (o.unique) { var probe = { key: keys, unique: true, name: name, sparse: !!o.sparse }; var seen = []; col.docs.forEach(function (d) { var k = keyOf(d, probe); if (seen.some(function (s) { return s.every(function (v, i) { return eq(v === undefined ? null : v, k[i] === undefined ? null : k[i]); }); })) throw MongoError('Index build failed: E11000 duplicate key error collection: ' + col.ns + ' index: ' + name + ' dup key: { ' + Object.keys(keys)[0] + ': ' + sim.inspect(getPath(d, Object.keys(keys)[0])) + ' }', 11000); seen.push(k); }); } var ix = { v: 2, key: keys, name: name }; if (o.unique) ix.unique = true; if (o.sparse) ix.sparse = true; if (o.expireAfterSeconds !== undefined) ix.expireAfterSeconds = o.expireAfterSeconds; if (o.partialFilterExpression) ix.partialFilterExpression = o.partialFilterExpression; if (Object.keys(keys).some(function (k) { return keys[k] === 'text'; })) { ix.weights = {}; Object.keys(keys).forEach(function (k) { if (keys[k] === 'text') ix.weights[k] = 1; }); ix.default_language = 'english'; ix.language_override = 'language'; ix.textIndexVersion = 3; ix.key = { _fts: 'text', _ftsx: 1 }; } col.indexes.push(ix); return name; },
      createIndexes: function (list) { return list.map(function (l) { return C.createIndex(l.key, l); }); },
      getIndexes: function () { return col.indexes.map(clone); }, getIndexKeys: function () { return col.indexes.map(function (i) { return i.key; }); },
      dropIndex: function (n) { var name = typeof n === 'string' ? n : idxName(n), i = col.indexes.findIndex(function (x) { return x.name === name; }); if (i < 0) throw MongoError('index not found with name [' + name + ']', 27, 'MongoServerError'); if (name === '_id_') throw MongoError('cannot drop _id index', 72); var was = col.indexes.length; col.indexes.splice(i, 1); return { nIndexesWas: was, ok: 1 }; },
      hideIndex: function (n) { var ix = col.indexes.filter(function (i) { return i.name === n || idxName(i.key) === n; })[0]; if (!ix) throw new MongoError('index not found with name [' + n + ']'); ix.hidden = true; return { hidden_old: false, hidden_new: true, ok: 1 }; },
      unhideIndex: function (n) { var ix = col.indexes.filter(function (i) { return i.name === n || idxName(i.key) === n; })[0]; if (!ix) throw new MongoError('index not found with name [' + n + ']'); ix.hidden = false; return { hidden_old: true, hidden_new: false, ok: 1 }; },
      reIndex: function () { return { nIndexesWas: col.indexes.length, nIndexes: col.indexes.length, indexes: col.indexes.map(clone), ok: 1 }; },
      dropIndexes: function () { var was = col.indexes.length; col.indexes = col.indexes.slice(0, 1); return { nIndexesWas: was, msg: 'non-_id indexes dropped for collection', ok: 1 }; },
      drop: function () { delete col.db.cols[col.name]; return true; },
      renameCollection: function (n) { delete col.db.cols[col.name]; col.name = n; col.ns = col.db.name + '.' + n; col.db.cols[n] = col; return { ok: 1 }; },
      stats: function () { var size = JSON.stringify(col.docs).length; return { ns: col.ns, size: size, count: col.docs.length, avgObjSize: col.docs.length ? Math.round(size / col.docs.length) : 0, storageSize: 4096 * Math.max(1, Math.ceil(size / 4096)), freeStorageSize: 0, capped: false, nindexes: col.indexes.length, indexBuilds: [], totalIndexSize: 4096 * col.indexes.length, totalSize: 4096 * (col.indexes.length + 1), indexSizes: col.indexes.reduce(function (o, i) { o[i.name] = 4096; return o; }, {}), scaleFactor: 1, ok: 1 }; },
      bulkWrite: function (ops) { var r = { acknowledged: true, insertedCount: 0, matchedCount: 0, modifiedCount: 0, deletedCount: 0, upsertedCount: 0, upsertedIds: {}, insertedIds: {} }; ops.forEach(function (op, i) { var k = Object.keys(op)[0], a = op[k]; if (k === 'insertOne') { var x = C.insertOne(a.document); r.insertedCount++; r.insertedIds[i] = x.insertedId; } else if (k === 'updateOne' || k === 'updateMany') { var u = doUpdate(a.filter, a.update, a, k === 'updateMany'); r.matchedCount += u.matchedCount; r.modifiedCount += u.modifiedCount; } else if (k === 'deleteOne' || k === 'deleteMany') { r.deletedCount += C[k](a.filter).deletedCount; } else if (k === 'replaceOne') { var u2 = doUpdate(a.filter, a.replacement, a, false); r.matchedCount += u2.matchedCount; r.modifiedCount += u2.modifiedCount; } }); return r; },
      getName: function () { return col.name; }, getFullName: function () { return col.ns; }, isCapped: function () { return false; }, totalSize: function () { return 4096 * (col.indexes.length + 1); }, dataSize: function () { return JSON.stringify(col.docs).length; }, validate: function () { return { ns: col.ns, nrecords: col.docs.length, valid: true, ok: 1 }; }
    };
    function doUpdate(q, u, o, many) {
      o = o || {}; var isPipeline = Array.isArray(u), targets = col.docs.filter(function (d) { return match(d, q); }); if (!many) targets = targets.slice(0, 1);
      var modified = 0, upsertedId = null;
      if (!targets.length && o.upsert) {
        var base = {}; Object.keys(q || {}).forEach(function (k) { if (k[0] !== '$' && !(isObj(q[k]) && Object.keys(q[k]).some(function (x) { return x[0] === '$'; }))) setPath(base, k, clone(q[k])); });
        var doc = clone(base); if (isPipeline) doc = runPipeline([doc], u, {})[0]; else applyUpdate(doc, u, { inserting: true, arrayFilters: o.arrayFilters }); doc = docOrder(doc); checkUnique(col, doc, null); col.docs.push(doc); upsertedId = doc._id;
        return { acknowledged: true, insertedId: upsertedId, matchedCount: 0, modifiedCount: 0, upsertedCount: 1 };
      }
      targets.forEach(function (d) {
        var before = JSON.stringify(show(d)), work = clone(d);
        if (isPipeline) { var r = runPipeline([work], u, {})[0]; Object.keys(work).forEach(function (k) { delete work[k]; }); Object.assign(work, r); } else applyUpdate(work, u, { matchedIndex: matchedIndex(d, q), arrayFilters: o.arrayFilters });
        if (!isPipeline && Object.keys(u).some(function (k) { return k[0] !== '$'; }) && Object.keys(u).some(function (k) { return k[0] === '$'; })) throw MongoError('Update document requires atomic operators', 9);
        if (work._id !== undefined && d._id !== undefined && !eq(work._id, d._id)) throw MongoError("After applying the update, the (immutable) field '_id' was found to have been altered to _id: " + fmtId(work._id), 66);
        checkUnique(col, work, d);
        if (JSON.stringify(show(work)) !== before) { modified++; Object.keys(d).forEach(function (k) { delete d[k]; }); Object.assign(d, work); }
      });
      return { acknowledged: true, insertedId: null, matchedCount: targets.length, modifiedCount: modified, upsertedCount: 0 };
    }
    C.save = function (d) { return d._id !== undefined && col.docs.some(function (x) { return eq(x._id, d._id); }) ? C.replaceOne({ _id: d._id }, d) : C.insertOne(d); };
    C.insert = function (d) { return Array.isArray(d) ? C.insertMany(d) : C.insertOne(d); };
    C.update = C.updateOne; C.remove = C.deleteMany;
    return C;
  }

  /* ───────────── samples for fragments that assume collections exist ───────────── */
  function d(s) { return new Date(s); }
  var SAMPLES = {
    users: function () { return [
      { name: 'Alice Johnson', email: 'alice@example.com', age: 30, city: 'New York', hobbies: ['reading', 'hiking'], address: { city: 'New York', zip: '10001' }, active: true, createdAt: d('2024-01-15T10:00:00Z') },
      { name: 'Bob Smith', email: 'bob@example.com', age: 25, city: 'London', hobbies: ['gaming', 'cooking'], address: { city: 'London', zip: 'E1 6AN' }, active: true, createdAt: d('2024-02-20T12:30:00Z') },
      { name: 'Carol White', email: 'carol@example.com', age: 35, city: 'Paris', hobbies: ['painting'], address: { city: 'Paris', zip: '75001' }, active: false, createdAt: d('2023-11-05T08:15:00Z') },
      { name: 'Dave Brown', email: 'dave@example.com', age: 28, city: 'New York', hobbies: ['cycling', 'reading'], address: { city: 'New York', zip: '10002' }, active: true, createdAt: d('2024-03-01T09:00:00Z') },
      { name: 'Eve Davis', email: 'eve@example.com', age: 41, city: 'Berlin', hobbies: ['chess', 'hiking'], address: { city: 'Berlin', zip: '10115' }, active: true, createdAt: d('2023-09-12T14:45:00Z') },
      { name: 'Frank Miller', email: 'frank@example.com', age: 22, city: 'London', hobbies: ['gaming'], address: { city: 'London', zip: 'SW1A 1AA' }, active: false, createdAt: d('2024-04-10T16:20:00Z') } ]; },
    products: function () { return [
      { name: 'Laptop', price: 999.99, category: 'Electronics', stock: 15, tags: ['computer', 'work'], rating: 4.5 }, { name: 'Mouse', price: 19.99, category: 'Electronics', stock: 120, tags: ['computer', 'accessory'], rating: 4.2 },
      { name: 'Desk', price: 249.5, category: 'Furniture', stock: 8, tags: ['office', 'work'], rating: 4.7 }, { name: 'Chair', price: 129, category: 'Furniture', stock: 20, tags: ['office'], rating: 4.1 },
      { name: 'Notebook', price: 3.49, category: 'Stationery', stock: 500, tags: ['paper'], rating: 3.9 }, { name: 'Monitor', price: 189.9, category: 'Electronics', stock: 30, tags: ['computer', 'display'], rating: 4.6 } ]; },
    orders: function (s) { var u = s.db('test').cols.users; var ids = u ? u.docs.map(function (x) { return x._id; }) : [new ObjectId(), new ObjectId()]; return [
      { userId: ids[0], items: [{ product: 'Laptop', qty: 1, price: 999.99 }, { product: 'Mouse', qty: 2, price: 19.99 }], total: 1039.97, status: 'shipped', createdAt: d('2024-05-01T10:00:00Z') },
      { userId: ids[1] || ids[0], items: [{ product: 'Desk', qty: 1, price: 249.5 }], total: 249.5, status: 'pending', createdAt: d('2024-05-03T11:30:00Z') },
      { userId: ids[2] || ids[0], items: [{ product: 'Chair', qty: 2, price: 129 }], total: 258, status: 'delivered', createdAt: d('2024-04-20T09:15:00Z') },
      { userId: ids[0], items: [{ product: 'Notebook', qty: 10, price: 3.49 }], total: 34.9, status: 'delivered', createdAt: d('2024-04-02T15:00:00Z') } ]; },
    articles: function () { return [
      { title: 'Intro to MongoDB', body: 'MongoDB is a document database that stores JSON-like documents.', author: 'Alice', tags: ['mongodb', 'database'], views: 1200, published: true, comments: [{ user: 'Bob', text: 'Great intro!' }, { user: 'Eve', text: 'Very helpful' }] },
      { title: 'Indexes explained', body: 'Indexes speed up queries by avoiding full collection scans.', author: 'Bob', tags: ['mongodb', 'performance'], views: 850, published: true, comments: [] },
      { title: 'Draft article', body: 'Work in progress', author: 'Alice', tags: ['draft'], views: 5, published: false, comments: [] } ]; },
    sales: function () { return [
      { item: 'abc', price: 10, quantity: 2, date: d('2024-03-01T08:00:00Z'), region: 'east' }, { item: 'jkl', price: 20, quantity: 1, date: d('2024-03-01T09:00:00Z'), region: 'west' },
      { item: 'xyz', price: 5, quantity: 10, date: d('2024-03-15T09:00:00Z'), region: 'east' }, { item: 'abc', price: 10, quantity: 5, date: d('2024-04-04T11:21:39Z'), region: 'north' }, { item: 'xyz', price: 5, quantity: 5, date: d('2024-04-04T21:23:13Z'), region: 'west' } ]; },
    posts: function () { return [
      { title: 'Hello World', content: 'My first post', likes: 12, tags: ['intro'], authorId: 1 }, { title: 'Learning MongoDB', content: 'Documents are fun', likes: 30, tags: ['mongodb', 'learning'], authorId: 2 }, { title: 'Aggregation tips', content: 'Use $group wisely', likes: 18, tags: ['mongodb'], authorId: 1 } ]; }
  };

  sim.mongo = { Server: Server, ensureCol: ensureCol, collectionApi: collectionApi, ObjectId: ObjectId, ISODate: ISODate, clone: clone, match: match, isObj: isObj, eq: eq, samples: function () { return SAMPLES; }, MongoError: MongoError, Cursor: Cursor };

  /* ───────────── shell ───────────── */
  sim.engines.mongo = function () {
    var server = new Server(), shell = new sim.Shell({ cwd: '/app' }), st = { db: 'test', pending: '', lastCursor: null, out: null, vars: {} };
    function curDb() { return server.db(st.db); }
    function snapshot() { var s = {}; Object.keys(server.dbs).forEach(function (dn) { s[dn] = {}; var db = server.dbs[dn]; Object.keys(db.cols).forEach(function (cn) { s[dn][cn] = { docs: db.cols[cn].docs.map(clone), indexes: db.cols[cn].indexes.map(clone) }; }); }); return s; }
    function restore(s) { Object.keys(server.dbs).forEach(function (dn) { var db = server.dbs[dn]; Object.keys(db.cols).forEach(function (cn) { if (!s[dn] || !s[dn][cn]) delete db.cols[cn]; else { db.cols[cn].docs = s[dn][cn].docs.map(clone); db.cols[cn].indexes = s[dn][cn].indexes.map(clone); } }); }); }
    function makeSession() {
      var snap = null, active = false, sess = {
        startTransaction: function () { if (active) throw MongoError('Transaction already in progress on this session.', 256); snap = snapshot(); active = true; },
        commitTransaction: function () { if (!active) throw MongoError('Cannot call commitTransaction without a transaction in progress.', 251); active = false; snap = null; },
        abortTransaction: function () { if (!active) throw MongoError('Cannot call abortTransaction without a transaction in progress.', 251); restore(snap); active = false; snap = null; },
        withTransaction: function (fn) { sess.startTransaction(); try { var r = fn(sess); sess.commitTransaction(); return r; } catch (e) { if (active) sess.abortTransaction(); throw e; } },
        endSession: function () { if (active) sess.abortTransaction(); }, getDatabase: function (n) { return dbProxy(n); }, hasEnded: function () { return false; }, inTransaction: function () { return active; }, id: { id: UUID() }
      };
      return sess;
    }
    function dbProxy(name) {
      var db = server.db(name), cache = {};
      var methods = {
        getName: function () { return name; }, getCollectionNames: function () { return Object.keys(db.cols).sort(); }, getCollectionInfos: function () { return Object.keys(db.cols).map(function (n) { return { name: n, type: 'collection', options: {}, info: { readOnly: false }, idIndex: { v: 2, key: { _id: 1 }, name: '_id_' } }; }); },
        getCollection: function (n) { return collFor(n); }, createCollection: function (n) { ensureCol(server, name, n); return { ok: 1 }; }, dropDatabase: function () { delete server.dbs[name]; return { ok: 1, dropped: name }; },
        stats: function () { var n = Object.keys(db.cols).length; return { db: name, collections: n, views: 0, objects: Object.keys(db.cols).reduce(function (s, k) { return s + db.cols[k].docs.length; }, 0), avgObjSize: 96, dataSize: 4096, storageSize: 4096 * n, indexes: n, indexSize: 4096 * n, totalSize: 8192 * n, ok: 1 }; },
        runCommand: function (c) { if (c.ping) return { ok: 1 }; if (c.hello || c.isMaster) return { ismaster: true, maxBsonObjectSize: 16777216, ok: 1 }; if (c.buildInfo || c.buildinfo) return { version: '7.0.5', ok: 1 }; return { ok: 1 }; }, adminCommand: function (c) { return methods.runCommand(c); },
        version: function () { return '7.0.5'; }, hostInfo: function () { return { system: { hostname: 'atlas-sandbox' }, ok: 1 }; }, getSiblingDB: function (n) { return dbProxy(n); }, getMongo: function () { return { toString: function () { return 'mongodb://127.0.0.1:27017'; }, startSession: makeSession, getDB: function (n) { return dbProxy(n); } }; }, startSession: function () { return makeSession(); },
        setProfilingLevel: function (l) { return { was: 0, slowms: 100, sampleRate: 1, ok: 1 }; }, getProfilingStatus: function () { return { was: 0, slowms: 100 }; }, serverStatus: function () { return { host: 'atlas-sandbox', version: '7.0.5', process: 'mongod', uptime: Math.floor(performance.now() / 1000), connections: { current: 1, available: 999 }, ok: 1 }; }, currentOp: function () { return { inprog: [], ok: 1 }; }
      };
      function collFor(n) { if (!cache[n]) cache[n] = collectionApi(server, ensureCol(server, name, n)); return cache[n]; }
      return new Proxy(methods, { get: function (t, p) { if (typeof p === 'symbol') { return p === INSPECT ? function () { return name; } : undefined; } if (p in t) return t[p]; if (p === 'toString') return function () { return name; }; if (p === 'then') return undefined; if (p === 'system') return new Proxy({}, { get: function (_t, q) { return collFor('system.' + String(q)); } }); return collFor(p); } });
    }
    function expose() {
      G.db = dbProxy(st.db); G.ObjectId = ObjectId; G.ISODate = ISODate; G.NumberInt = NumberInt; G.NumberLong = NumberLong; G.NumberDecimal = NumberDecimal; G.UUID = UUID; G.Decimal128 = NumberDecimal; G.Long = NumberLong; G.Int32 = NumberInt; G.MinKey = null; G.MaxKey = null;
      G.print = function () { st.out.push({ t: 'out', s: sim.format.apply(null, Array.prototype.slice.call(arguments).map(function (a) { return typeof a === 'string' ? a : sim.inspect(show(a)); })) + '\n' }); };
      G.printjson = function (o) { st.out.push({ t: 'out', s: JSON.stringify(o, null, 2) + '\n' }); }; G.sleep = function () { }; G.load = function () { }; G.quit = G.exit = function () { throw Object.assign(new Error('exit'), { __exit: true }); };
      G.rs = { status: function () { return { ok: 0, errmsg: 'not running with --replSet' }; } };
    }
    function prompt() { return (st.pending ? '... ' : st.db + '> '); }
    function fmtResult(v) {
      if (v === undefined) return '';
      if (v instanceof Cursor) { var docs = v._run(); if (!docs.length) return ''; st.lastCursor = { docs: docs, pos: 20 }; var shown = docs.slice(0, 20); return sim.inspect(show(shown), { depth: 20 }) + (docs.length > 20 ? '\nType "it" for more' : ''); }
      if (typeof v === 'string') return "'" + v.replace(/'/g, "\\'") + "'";
      return sim.inspect(show(v), { depth: 20 });
    }
    function balanced(s) { var d = 0, q = null, esc = false, lc = false, bc = false; for (var i = 0; i < s.length; i++) { var c = s[i], n = s[i + 1]; if (lc) { if (c === '\n') lc = false; continue; } if (bc) { if (c === '*' && n === '/') { bc = false; i++; } continue; } if (q) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === q) q = null; continue; } if (c === '/' && n === '/') { lc = true; continue; } if (c === '/' && n === '*') { bc = true; i++; continue; } if (c === '"' || c === "'" || c === '`') { q = c; continue; } if (c === '(' || c === '[' || c === '{') d++; else if (c === ')' || c === ']' || c === '}') d--; } return d <= 0 && !q && !bc; }
    function stripComment(s) { return s.replace(/^\s*\/\/.*$/gm, '').replace(/\s+\/\/[^'"\n]*$/gm, ''); }
    // Lesson snippets use names they never define (userId, order, page…) — give them a sensible sample value.
    function placeholder(name) {
      if (/id$/i.test(name)) return new ObjectId();
      if (/^(page|pagesize|limit|skip|size|n|count|offset|qty|quantity)$/i.test(name)) return 20;
      if (/^(email|name|username|title|status|category|token|key|value)$/i.test(name)) return 'sample';
      return new Proxy({ _id: new ObjectId(), name: 'sample', email: 'sample@example.com', price: 10, total: 10, quantity: 1, amount: 100, postIds: [], items: [], tags: [] }, { get: function (t, p) { return typeof p === 'symbol' || p in t ? t[p] : /s$/.test(p) ? [] : /id$/i.test(p) ? new ObjectId() : 1; } });
    }
    function runStatement(code, tries) {
      var out = st.out, trimmed = stripComment(code).replace(/\bawait\s+/g, '').trim(); if (!trimmed) return;
      var m;
      if (st.script) {
        trimmed = trimmed.replace(/\{\s*\.\.\.\s*\}/g, '{}').replace(/\[\s*\.\.\.\s*\]/g, '[]').replace(/(['"])\.\.\.\1/g, '"sample"');
        if (/^(npm|npx|yarn|pnpm|brew|sudo|apt|apt-get|systemctl|net)\s/.test(trimmed)) return;
        if ((m = trimmed.match(/^mongosh\b(.*)$/))) { var ev = m[1].match(/--eval\s+(["'])([\s\S]*)\1\s*$/); if (ev) trimmed = ev[2].trim(); else { out.push({ t: 'out', s: 'Connected to mongodb://localhost:27017 (simulated)\n' }); return; } }
        if (/^\{[\s\S]*\}$/.test(trimmed) && !/[(]/.test(trimmed.replace(/(['"])(?:\\.|(?!\1)[^\\])*\1/g, '""').replace(/\b(ObjectId|ISODate|NumberInt|NumberLong|Date)\([^)]*\)/g, '""'))) return; // a document shown for illustration
      }
      if ((m = trimmed.match(/^use\s+(\S+)$/))) { st.db = m[1].replace(/^["']|["']$/g, ''); server.db(st.db); G.db = dbProxy(st.db); out.push({ t: 'out', s: 'switched to db ' + st.db + '\n' }); return; }
      if ((m = trimmed.match(/^show\s+(dbs|databases|collections|tables|users|roles|profile)$/i))) {
        var what = m[1].toLowerCase();
        if (what === 'dbs' || what === 'databases') { var names = ['admin', 'config', 'local'].concat(Object.keys(server.dbs).filter(function (n) { return ['admin', 'config', 'local'].indexOf(n) < 0 && Object.keys(server.dbs[n].cols).length; })), sizes = { admin: '40.00 KiB', config: '108.00 KiB', local: '72.00 KiB' }; var w = Math.max.apply(null, names.map(function (n) { return n.length; })); names.forEach(function (n) { out.push({ t: 'out', s: n.padEnd(w + 2) + (sizes[n] || (Math.max(8, Object.keys(server.dbs[n].cols).length * 8)).toFixed(2) + ' KiB') + '\n' }); }); return; }
        if (what === 'collections' || what === 'tables') { Object.keys(curDb().cols).sort().forEach(function (n) { out.push({ t: 'out', s: n + '\n' }); }); return; }
        return;
      }
      if (/^it$/.test(trimmed)) { var lc = st.lastCursor; if (!lc || lc.pos >= lc.docs.length) { out.push({ t: 'out', s: 'no cursor\n' }); return; } var next = lc.docs.slice(lc.pos, lc.pos + 20); lc.pos += 20; out.push({ t: 'out', s: sim.inspect(show(next), { depth: 20 }) + (lc.pos < lc.docs.length ? '\nType "it" for more' : '') + '\n' }); return; }
      if (/^(help|\.help)$/.test(trimmed)) { out.push({ t: 'out', s: '  Shell Help (simulator):\n    use <db>          set current database\n    show dbs          list databases\n    show collections  list collections in the current database\n    db.<coll>.find(), insertOne(), updateOne(), deleteOne(), aggregate(), createIndex() ...\n    it                show more results\n' }); return; }
      if (/^(exit|quit)(\(\))?$/.test(trimmed)) throw Object.assign(new Error('exit'), { __exit: true });
      var isExpr = false; try { new Function('return (' + trimmed.replace(/;\s*$/, '') + '\n)'); isExpr = true; } catch (e) { isExpr = false; }
      var val;
      try {
        if (isExpr) val = (0, eval)('(' + trimmed.replace(/;\s*$/, '') + '\n)');
        else val = (0, eval)(trimmed.replace(/^\s*(const|let)\s+/, 'var '));
      } catch (e) { var rm = st.script && e && e.name === 'ReferenceError' && (tries || 0) < 8 && /^(\w+) is not defined/.exec(e.message); if (rm) { G[rm[1]] = placeholder(rm[1]); return runStatement(code, (tries || 0) + 1); } var nm = e && e.name ? e.name : 'Error', msg = e && e.message ? e.message : String(e); if (/^Mongo/.test(nm) || e.code) out.push({ t: 'err', s: nm + ': ' + msg + '\n' }); else out.push({ t: 'err', s: nm + ': ' + msg + '\n' }); return; }
      if (isExpr || (val !== undefined && !/^\s*(var|let|const|function|class)\b/.test(trimmed))) { var txt = fmtResult(val); if (txt) out.push({ t: 'out', s: txt + '\n' }); }
    }
    function splitStatements(script) {
      var lines = script.split(/\r?\n/), out = [], buf = '';
      lines.forEach(function (ln, li) {
        if (!buf && !ln.trim()) return; if (!buf && /^\s*\/\//.test(ln)) { out.push({ comment: ln.trim() }); return; }
        buf += (buf ? '\n' : '') + ln;
        var nextLn = ''; for (var lj = li + 1; lj < lines.length; lj++) { if (lines[lj].trim() && !/^\s*\/\//.test(lines[lj])) { nextLn = lines[lj]; break; } }
        if (balanced(buf) && !/^\s*\.[A-Za-z_]/.test(nextLn) && !/[.,+\-*/&|?:=(\[{]\s*$/.test(stripComment(buf).trim().replace(/;$/, '')) ) out.push({ line: buf.trim(), display: buf.split('\n').map(function (l, i) { return (i ? '... ' : '') + l; }).join('\n') }), buf = '';
      });
      if (buf.trim()) out.push({ line: buf.trim(), display: buf }); return out;
    }
    async function exec(line) {
      st.out = []; expose(); var text = (st.pending ? st.pending + '\n' : '') + line;
      if (!balanced(text) || /[.,+\-*/&|?:=]\s*$/.test(text.trim()) && !/^(use|show)\s/.test(text.trim())) { st.pending = text; return { chunks: [], code: 0 }; }
      st.pending = ''; try { runStatement(text); } catch (e) { if (e && e.__exit) throw e; st.out.push({ t: 'err', s: String(e && e.message || e) + '\n' }); }
      return { chunks: st.out, code: 0 };
    }
    return {
      title: 'MongoDB Shell', sub: 'mongosh · in-memory documents · MongoDB 7 syntax', shell: shell,
      banner: 'Connected to a simulated MongoDB 7.0 (mongosh) — documents live in memory for this run.\nTry: db.users.insertOne({ name: "Ada" }) · db.users.find() · use shop · show collections · it',
      prompt: prompt, exec: exec, placeholder: 'db.users.find({ age: { $gt: 25 } })',
      scriptMode: function (on) { st.script = !!on; },
      parseScript: function (script) { return splitStatements(script); },
      prepare: async function (script) {
        expose(); var seeded = [], seededDocs = {}, body = stripComment(script), used = {}; body.replace(/\bdb\.([A-Za-z_]\w*)\./g, function (m, n) { if (!/^(getName|getCollection|getCollectionNames|createCollection|dropDatabase|stats|runCommand|version|setProfilingLevel|serverStatus|system|adminCommand|getSiblingDB|getMongo|hostInfo|currentOp|getProfilingStatus)$/.test(n)) used[n] = 1; return m; });
        var inserted = {}; body.replace(/\bdb\.([A-Za-z_]\w*)\.(insertOne|insertMany|insert|save|bulkWrite)\(/g, function (m, n) { inserted[n] = 1; return m; }); body.replace(/\bdb\.(?:createCollection)\(\s*['"](\w+)['"]/g, function (m, n) { inserted[n] = 1; return m; });
        var useDb = null; body.replace(/^\s*use\s+(\S+)/m, function (m, n) { useDb = n; return m; });
        var target = useDb || st.db; if (useDb) { st.db = 'test'; }
        // documents shown under a "// Users collection" comment are stored, so the queries after them have data to work on
        var curCol = null;
        splitStatements(script).forEach(function (it) {
          if (it.comment) { var cm = it.comment.match(/(\w+)\s+collection\b/i); if (cm) { curCol = cm[1].toLowerCase(); if (!/s$/.test(curCol)) curCol += 's'; } return; }
          var t = stripComment(it.line).trim().replace(/\{\s*\.\.\.\s*\}/g, '{}').replace(/\[\s*\.\.\.\s*\]/g, '[]');
          if (curCol && /^\{[\s\S]*\}$/.test(t) && !/[)]\s*\./.test(t)) { try { var dd = (0, eval)('(' + t + ')'); if (dd && typeof dd === 'object') { collectionApi(server, ensureCol(server, useDb || 'test', curCol)).insertOne(dd); inserted[curCol] = 1; seededDocs[curCol] = 1; } } catch (e) { /* not a plain document */ } }
        });
        var order = ['users', 'products', 'orders', 'articles', 'sales', 'posts'];
        if (used.orders) used.users = 1;
        order.forEach(function (n) { if (used[n] && !inserted[n] && SAMPLES[n]) { var col = ensureCol(server, 'test', n), api = collectionApi(server, col); api.insertMany(SAMPLES[n](server)); seeded.push(n); } });
        if (useDb && seeded.length) { var moved = server.db('test'); var dest = server.db(useDb); seeded.forEach(function (n) { dest.cols[n] = moved.cols[n]; dest.cols[n].db = dest; dest.cols[n].dbName = useDb; dest.cols[n].ns = useDb + '.' + n; delete moved.cols[n]; }); }
        // indexes the script drops / hides by name must exist first
        body.replace(/\bdb\.(\w+)\.(?:dropIndex|hideIndex|unhideIndex)\(\s*['"](\w+)['"]\s*\)/g, function (m, col, name) { var c2 = collectionApi(server, ensureCol(server, useDb || 'test', col)); var field = name.replace(/_-?1$/, ''); try { var spec = {}; spec[field] = 1; c2.createIndex(spec, { name: name }); } catch (e) { /* already there */ } return m; });
        void target; G.db = dbProxy(st.db);
        return seeded.length ? 'ℹ️ Sample collections created for you: ' + seeded.join(', ') + ' (insert your own documents to use your own data).' : null;
      },
      state: st, server: server
    };
  };
})(window);
