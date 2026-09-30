/* WebDev Atlas — Redis simulator (redis-cli style). In-memory data types, expiry, transactions, pub/sub. */
(function (G) {
  'use strict';
  var sim = G.__sim;

  function RedisError(m) { this.message = m; }
  var WRONGTYPE = 'WRONGTYPE Operation against a key holding the wrong kind of value';
  function ok() { return { s: 'OK' }; } function int(n) { return n; } function nil() { return null; } function arr(a) { return a; }
  function pat2re(p) { return new RegExp('^' + String(p).replace(/[.+^${}()|\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.').replace(/\[\^/g, '[^') + '$'); }
  function num(v, what) { var n = Number(v); if (v === '' || v === null || isNaN(n)) throw new RedisError(what === 'float' ? 'ERR value is not a valid float' : 'ERR value is not an integer or out of range'); return n; }
  function intg(v) { var n = num(v); if (n % 1 !== 0) throw new RedisError('ERR value is not an integer or out of range'); return n; }
  function fnum(n) { return String(Number.isInteger(n) ? n : parseFloat(n.toPrecision(17))); }

  function createServer() {
    var dbs = [{}], cur = 0, subs = { chan: {}, pat: {} }, tx = null;
    function db() { return dbs[cur] || (dbs[cur] = {}); }
    function live(k) { var e = db()[k]; if (e && e.exp !== null && e.exp <= Date.now()) { delete db()[k]; return undefined; } return e; }
    function get(k, type) { var e = live(k); if (!e) return undefined; if (type && e.type !== type) throw new RedisError(WRONGTYPE); return e; }
    function put(k, type, val, keepTtl) { var old = live(k); db()[k] = { type: type, val: val, exp: keepTtl && old ? old.exp : null }; return db()[k]; }
    function del(k) { if (live(k)) { delete db()[k]; return 1; } return 0; }
    function ensure(k, type, init) { var e = get(k, type); if (!e) e = put(k, type, init()); return e; }
    function cleanup(k) { var e = db()[k]; if (e && ((e.type === 'list' && !e.val.length) || (e.type === 'set' && !e.val.length) || (e.type === 'hash' && !Object.keys(e.val).length) || (e.type === 'zset' && !e.val.length))) delete db()[k]; }
    function setHas(e, m) { return e.val.indexOf(m) >= 0; }
    function zsort(z) { z.sort(function (a, b) { return a.s - b.s || (a.m < b.m ? -1 : a.m > b.m ? 1 : 0); }); }
    function zrange(e, start, stop, rev, withScores) {
      var z = e ? e.val.slice() : []; if (rev) z.reverse(); var n = z.length; start = +start; stop = +stop;
      if (start < 0) start = Math.max(0, n + start); if (stop < 0) stop = n + stop; stop = Math.min(stop, n - 1);
      var out = []; for (var i = start; i <= stop; i++) { out.push(z[i].m); if (withScores) out.push(fnum(z[i].s)); } return out;
    }
    function bound(v) { var ex = false; v = String(v); if (v[0] === '(') { ex = true; v = v.slice(1); } var n = v === '-inf' ? -Infinity : v === '+inf' || v === 'inf' ? Infinity : Number(v); return { n: n, ex: ex }; }
    function byScore(e, min, max, rev, opts) {
      var lo = bound(min), hi = bound(max); if (rev) { var t = lo; lo = bound(max); hi = bound(min); }
      var z = (e ? e.val : []).filter(function (x) { return (lo.ex ? x.s > lo.n : x.s >= lo.n) && (hi.ex ? x.s < hi.n : x.s <= hi.n); }); if (rev) z = z.slice().reverse();
      if (opts.limit) z = z.slice(opts.limit[0], opts.limit[0] + opts.limit[1]); return z;
    }
    function expire(k, ms, mode) { var e = live(k); if (!e) return 0; var at = Date.now() + ms; if (mode === 'NX' && e.exp !== null) return 0; if (mode === 'XX' && e.exp === null) return 0; if (mode === 'GT' && (e.exp === null || at <= e.exp)) return 0; if (mode === 'LT' && e.exp !== null && at >= e.exp) return 0; e.exp = at; if (ms <= 0) delete db()[k]; return 1; }
    function publish(ch, msg, out) {
      var n = 0;
      if (subs.chan[ch]) { n++; out.push(arr(['message', ch, msg])); }
      Object.keys(subs.pat).forEach(function (p) { if (pat2re(p).test(ch)) { n++; out.push(arr(['pmessage', p, ch, msg])); } });
      return n;
    }

    var C = {}; // name -> { min, max, fn }
    function def(names, min, max, fn) { [].concat(names).forEach(function (n) { C[n] = { min: min, max: max, fn: fn }; }); }

    /* ── connection / server ── */
    def('ping', 0, 1, function (a) { return a.length ? a[0] : { s: 'PONG' }; });
    def('echo', 1, 1, function (a) { return a[0]; });
    def('select', 1, 1, function (a) { var n = intg(a[0]); if (n < 0 || n > 15) throw new RedisError('ERR DB index is out of range'); cur = n; return ok(); });
    def('dbsize', 0, 0, function () { return Object.keys(db()).filter(function (k) { return live(k); }).length; });
    def(['flushall', 'flushdb'], 0, 1, function (a, name) { if (name === 'flushall') dbs = [{}]; else dbs[cur] = {}; return ok(); });
    def('time', 0, 0, function () { var n = Date.now(); return arr([String(Math.floor(n / 1000)), String((n % 1000) * 1000)]); });
    def('info', 0, 1, function () { return { raw: '# Server\nredis_version:7.2.4\nredis_mode:standalone\nos:Linux x86_64\ntcp_port:6379\nuptime_in_seconds:' + Math.floor(performance.now() / 1000) + '\n\n# Clients\nconnected_clients:1\n\n# Memory\nused_memory_human:1.02M\n\n# Keyspace\n' + (Object.keys(db()).length ? 'db' + cur + ':keys=' + Object.keys(db()).length + ',expires=' + Object.keys(db()).filter(function (k) { return db()[k].exp !== null; }).length + ',avg_ttl=0' : '') }; });
    def('command', 0, 9, function () { return arr([]); });
    def('quit', 0, 0, function () { return ok(); });

    /* ── keys ── */
    def('exists', 1, 99, function (a) { return a.filter(function (k) { return !!live(k); }).length; });
    def(['del', 'unlink'], 1, 99, function (a) { return a.reduce(function (n, k) { return n + del(k); }, 0); });
    def('type', 1, 1, function (a) { var e = live(a[0]); return { s: e ? e.type : 'none' }; });
    def('keys', 1, 1, function (a) { var re = pat2re(a[0]); return arr(Object.keys(db()).filter(function (k) { return live(k) && re.test(k); })); });
    def('scan', 1, 6, function (a) { var re = null, cnt = 10; for (var i = 1; i < a.length; i += 2) { if (/^match$/i.test(a[i])) re = pat2re(a[i + 1]); if (/^count$/i.test(a[i])) cnt = +a[i + 1]; } var ks = Object.keys(db()).filter(function (k) { return live(k) && (!re || re.test(k)); }); void cnt; return arr(['0', arr(ks)]); });
    def('rename', 2, 2, function (a) { var e = live(a[0]); if (!e) throw new RedisError('ERR no such key'); delete db()[a[0]]; db()[a[1]] = e; return ok(); });
    def('renamenx', 2, 2, function (a) { var e = live(a[0]); if (!e) throw new RedisError('ERR no such key'); if (live(a[1])) return 0; delete db()[a[0]]; db()[a[1]] = e; return 1; });
    def('randomkey', 0, 0, function () { var ks = Object.keys(db()).filter(live); return ks.length ? ks[Math.floor(Math.random() * ks.length)] : null; });
    def('expire', 2, 3, function (a) { return expire(a[0], intg(a[1]) * 1000, a[2] && a[2].toUpperCase()); });
    def('pexpire', 2, 3, function (a) { return expire(a[0], intg(a[1]), a[2] && a[2].toUpperCase()); });
    def('expireat', 2, 3, function (a) { return expire(a[0], intg(a[1]) * 1000 - Date.now(), a[2] && a[2].toUpperCase()); });
    def('pexpireat', 2, 3, function (a) { return expire(a[0], intg(a[1]) - Date.now(), a[2] && a[2].toUpperCase()); });
    def('ttl', 1, 1, function (a) { var e = live(a[0]); return !e ? -2 : e.exp === null ? -1 : Math.max(0, Math.round((e.exp - Date.now()) / 1000)); });
    def('pttl', 1, 1, function (a) { var e = live(a[0]); return !e ? -2 : e.exp === null ? -1 : Math.max(0, e.exp - Date.now()); });
    def('persist', 1, 1, function (a) { var e = live(a[0]); if (!e || e.exp === null) return 0; e.exp = null; return 1; });

    /* ── strings ── */
    def('set', 2, 8, function (a) {
      var k = a[0], v = a[1], ex = null, nx = false, xx = false, keep = false, getOld = false;
      for (var i = 2; i < a.length; i++) { var o = a[i].toUpperCase(); if (o === 'EX') ex = intg(a[++i]) * 1000; else if (o === 'PX') ex = intg(a[++i]); else if (o === 'EXAT') ex = intg(a[++i]) * 1000 - Date.now(); else if (o === 'PXAT') ex = intg(a[++i]) - Date.now(); else if (o === 'NX') nx = true; else if (o === 'XX') xx = true; else if (o === 'KEEPTTL') keep = true; else if (o === 'GET') getOld = true; else throw new RedisError('ERR syntax error'); }
      var old = getOld ? (get(k, 'string') || {}).val : undefined; if (getOld && !old && live(k)) get(k, 'string');
      if ((nx && live(k)) || (xx && !live(k))) return getOld ? (old === undefined ? null : old) : null;
      var e = put(k, 'string', String(v), keep); if (ex !== null) e.exp = Date.now() + ex; return getOld ? (old === undefined ? null : old) : ok();
    });
    def('setnx', 2, 2, function (a) { if (live(a[0])) return 0; put(a[0], 'string', a[1]); return 1; });
    def('setex', 3, 3, function (a) { var e = put(a[0], 'string', a[2]); e.exp = Date.now() + intg(a[1]) * 1000; return ok(); });
    def('psetex', 3, 3, function (a) { var e = put(a[0], 'string', a[2]); e.exp = Date.now() + intg(a[1]); return ok(); });
    def('get', 1, 1, function (a) { var e = get(a[0], 'string'); return e ? e.val : null; });
    def('getset', 2, 2, function (a) { var e = get(a[0], 'string'), old = e ? e.val : null; put(a[0], 'string', a[1]); return old; });
    def('getdel', 1, 1, function (a) { var e = get(a[0], 'string'); if (!e) return null; del(a[0]); return e.val; });
    def('mset', 2, 99, function (a) { if (a.length % 2) throw new RedisError("ERR wrong number of arguments for 'mset' command"); for (var i = 0; i < a.length; i += 2) put(a[i], 'string', a[i + 1]); return ok(); });
    def('msetnx', 2, 99, function (a) { for (var i = 0; i < a.length; i += 2) if (live(a[i])) return 0; for (var j = 0; j < a.length; j += 2) put(a[j], 'string', a[j + 1]); return 1; });
    def('mget', 1, 99, function (a) { return arr(a.map(function (k) { var e = live(k); return e && e.type === 'string' ? e.val : null; })); });
    def('append', 2, 2, function (a) { var e = get(a[0], 'string') || put(a[0], 'string', ''); e.val += a[1]; return e.val.length; });
    def('strlen', 1, 1, function (a) { var e = get(a[0], 'string'); return e ? e.val.length : 0; });
    def(['getrange', 'substr'], 3, 3, function (a) { var e = get(a[0], 'string'); if (!e) return ''; var s = e.val, n = s.length, st = intg(a[1]), en = intg(a[2]); if (st < 0) st = Math.max(0, n + st); if (en < 0) en = n + en; return s.slice(st, en + 1); });
    def('setrange', 3, 3, function (a) { var e = get(a[0], 'string') || put(a[0], 'string', ''), off = intg(a[1]); e.val = e.val.padEnd(off, '\u0000').slice(0, off) + a[2] + e.val.slice(off + a[2].length); return e.val.length; });
    function incr(k, by) { var e = get(k, 'string'); if (e && !/^-?\d+$/.test(e.val)) throw new RedisError('ERR value is not an integer or out of range'); var n = (e ? parseInt(e.val, 10) : 0) + by; if (!e) e = put(k, 'string', ''); e.val = String(n); return n; }
    def('incr', 1, 1, function (a) { return incr(a[0], 1); }); def('decr', 1, 1, function (a) { return incr(a[0], -1); });
    def('incrby', 2, 2, function (a) { return incr(a[0], intg(a[1])); }); def('decrby', 2, 2, function (a) { return incr(a[0], -intg(a[1])); });
    def('incrbyfloat', 2, 2, function (a) { var e = get(a[0], 'string'), n = (e ? num(e.val, 'float') : 0) + num(a[1], 'float'); if (!e) e = put(a[0], 'string', ''); e.val = fnum(n); return e.val; });

    /* ── lists ── */
    function push(a, left, xOnly) { var e = get(a[0], 'list'); if (!e) { if (xOnly) return 0; e = put(a[0], 'list', []); } a.slice(1).forEach(function (v) { if (left) e.val.unshift(v); else e.val.push(v); }); return e.val.length; }
    def('lpush', 2, 99, function (a) { return push(a, true); }); def('rpush', 2, 99, function (a) { return push(a, false); });
    def('lpushx', 2, 99, function (a) { return push(a, true, true); }); def('rpushx', 2, 99, function (a) { return push(a, false, true); });
    function pop(a, left) { var e = get(a[0], 'list'); if (a.length > 1) { if (!e) return null; var n = intg(a[1]), out = []; while (n-- > 0 && e.val.length) out.push(left ? e.val.shift() : e.val.pop()); cleanup(a[0]); return arr(out); } if (!e || !e.val.length) return null; var v = left ? e.val.shift() : e.val.pop(); cleanup(a[0]); return v; }
    def('lpop', 1, 2, function (a) { return pop(a, true); }); def('rpop', 1, 2, function (a) { return pop(a, false); });
    def('llen', 1, 1, function (a) { var e = get(a[0], 'list'); return e ? e.val.length : 0; });
    def('lrange', 3, 3, function (a) { var e = get(a[0], 'list'); if (!e) return arr([]); var n = e.val.length, s = intg(a[1]), t = intg(a[2]); if (s < 0) s = Math.max(0, n + s); if (t < 0) t = n + t; return arr(e.val.slice(s, t + 1)); });
    def('lindex', 2, 2, function (a) { var e = get(a[0], 'list'); if (!e) return null; var i = intg(a[1]); if (i < 0) i += e.val.length; return i >= 0 && i < e.val.length ? e.val[i] : null; });
    def('lset', 3, 3, function (a) { var e = get(a[0], 'list'); if (!e) throw new RedisError('ERR no such key'); var i = intg(a[1]); if (i < 0) i += e.val.length; if (i < 0 || i >= e.val.length) throw new RedisError('ERR index out of range'); e.val[i] = a[2]; return ok(); });
    def('linsert', 4, 4, function (a) { var e = get(a[0], 'list'); if (!e) return 0; var i = e.val.indexOf(a[2]); if (i < 0) return -1; e.val.splice(/^before$/i.test(a[1]) ? i : i + 1, 0, a[3]); return e.val.length; });
    def('lrem', 3, 3, function (a) { var e = get(a[0], 'list'); if (!e) return 0; var c = intg(a[1]), removed = 0, v = a[2], src = c < 0 ? e.val.slice().reverse() : e.val.slice(), out = []; src.forEach(function (x) { if (x === v && (c === 0 || removed < Math.abs(c))) removed++; else out.push(x); }); e.val = c < 0 ? out.reverse() : out; cleanup(a[0]); return removed; });
    def('ltrim', 3, 3, function (a) { var e = get(a[0], 'list'); if (!e) return ok(); var n = e.val.length, s = intg(a[1]), t = intg(a[2]); if (s < 0) s = Math.max(0, n + s); if (t < 0) t = n + t; e.val = e.val.slice(s, t + 1); cleanup(a[0]); return ok(); });
    function bpop(a, left) { var keys = a.slice(0, -1); for (var i = 0; i < keys.length; i++) { var e = get(keys[i], 'list'); if (e && e.val.length) { var v = left ? e.val.shift() : e.val.pop(); cleanup(keys[i]); return arr([keys[i], v]); } } return { nilTimeout: a[a.length - 1] }; }
    def('blpop', 2, 99, function (a) { return bpop(a, true); }); def('brpop', 2, 99, function (a) { return bpop(a, false); });
    def(['rpoplpush', 'lmove'], 2, 4, function (a, name) { var src = a[0], dst = a[1], from = 'RIGHT', to = 'LEFT'; if (name === 'lmove') { from = a[2].toUpperCase(); to = a[3].toUpperCase(); } var e = get(src, 'list'); if (!e || !e.val.length) return null; var v = from === 'LEFT' ? e.val.shift() : e.val.pop(); cleanup(src); var d = get(dst, 'list') || put(dst, 'list', []); if (to === 'LEFT') d.val.unshift(v); else d.val.push(v); return v; });

    /* ── hashes ── */
    def(['hset', 'hmset'], 3, 99, function (a, name) { if ((a.length - 1) % 2) throw new RedisError("ERR wrong number of arguments for '" + name + "' command"); var e = ensure(a[0], 'hash', function () { return {}; }), n = 0; for (var i = 1; i < a.length; i += 2) { if (!(a[i] in e.val)) n++; e.val[a[i]] = a[i + 1]; } return name === 'hmset' ? ok() : n; });
    def('hsetnx', 3, 3, function (a) { var e = ensure(a[0], 'hash', function () { return {}; }); if (a[1] in e.val) return 0; e.val[a[1]] = a[2]; return 1; });
    def('hget', 2, 2, function (a) { var e = get(a[0], 'hash'); return e && a[1] in e.val ? e.val[a[1]] : null; });
    def('hmget', 2, 99, function (a) { var e = get(a[0], 'hash'); return arr(a.slice(1).map(function (f) { return e && f in e.val ? e.val[f] : null; })); });
    def('hgetall', 1, 1, function (a) { var e = get(a[0], 'hash'), out = []; if (e) Object.keys(e.val).forEach(function (f) { out.push(f, e.val[f]); }); return arr(out); });
    def('hdel', 2, 99, function (a) { var e = get(a[0], 'hash'), n = 0; if (!e) return 0; a.slice(1).forEach(function (f) { if (f in e.val) { delete e.val[f]; n++; } }); cleanup(a[0]); return n; });
    def('hexists', 2, 2, function (a) { var e = get(a[0], 'hash'); return e && a[1] in e.val ? 1 : 0; });
    def('hlen', 1, 1, function (a) { var e = get(a[0], 'hash'); return e ? Object.keys(e.val).length : 0; });
    def('hkeys', 1, 1, function (a) { var e = get(a[0], 'hash'); return arr(e ? Object.keys(e.val) : []); });
    def('hvals', 1, 1, function (a) { var e = get(a[0], 'hash'); return arr(e ? Object.keys(e.val).map(function (f) { return e.val[f]; }) : []); });
    def('hstrlen', 2, 2, function (a) { var e = get(a[0], 'hash'); return e && a[1] in e.val ? e.val[a[1]].length : 0; });
    def('hincrby', 3, 3, function (a) { var e = ensure(a[0], 'hash', function () { return {}; }), cur2 = a[1] in e.val ? e.val[a[1]] : '0'; if (!/^-?\d+$/.test(cur2)) throw new RedisError('ERR hash value is not an integer'); e.val[a[1]] = String(parseInt(cur2, 10) + intg(a[2])); return parseInt(e.val[a[1]], 10); });
    def('hincrbyfloat', 3, 3, function (a) { var e = ensure(a[0], 'hash', function () { return {}; }), n = (a[1] in e.val ? num(e.val[a[1]], 'float') : 0) + num(a[2], 'float'); e.val[a[1]] = fnum(n); return e.val[a[1]]; });

    /* ── sets ── */
    def('sadd', 2, 99, function (a) { var e = ensure(a[0], 'set', function () { return []; }), n = 0; a.slice(1).forEach(function (m) { if (!setHas(e, m)) { e.val.push(m); n++; } }); return n; });
    def('srem', 2, 99, function (a) { var e = get(a[0], 'set'), n = 0; if (!e) return 0; a.slice(1).forEach(function (m) { var i = e.val.indexOf(m); if (i >= 0) { e.val.splice(i, 1); n++; } }); cleanup(a[0]); return n; });
    def('smembers', 1, 1, function (a) { var e = get(a[0], 'set'); return arr(e ? e.val.slice() : []); });
    def('sismember', 2, 2, function (a) { var e = get(a[0], 'set'); return e && setHas(e, a[1]) ? 1 : 0; });
    def('smismember', 2, 99, function (a) { var e = get(a[0], 'set'); return arr(a.slice(1).map(function (m) { return e && setHas(e, m) ? 1 : 0; })); });
    def('scard', 1, 1, function (a) { var e = get(a[0], 'set'); return e ? e.val.length : 0; });
    function sets(a) { return a.map(function (k) { var e = get(k, 'set'); return e ? e.val : []; }); }
    def('sunion', 1, 99, function (a) { var out = []; sets(a).forEach(function (s) { s.forEach(function (m) { if (out.indexOf(m) < 0) out.push(m); }); }); return arr(out); });
    def('sinter', 1, 99, function (a) { var l = sets(a); return arr(l[0].filter(function (m) { return l.every(function (s) { return s.indexOf(m) >= 0; }); })); });
    def('sdiff', 1, 99, function (a) { var l = sets(a); return arr(l[0].filter(function (m) { return l.slice(1).every(function (s) { return s.indexOf(m) < 0; }); })); });
    ['sunion', 'sinter', 'sdiff'].forEach(function (op) { def(op + 'store', 2, 99, function (a) { var r = C[op].fn(a.slice(1)); del(a[0]); if (r.length) put(a[0], 'set', r.slice()); return r.length; }); });
    def('spop', 1, 2, function (a) { var e = get(a[0], 'set'); if (!e || !e.val.length) return a.length > 1 ? arr([]) : null; if (a.length > 1) { var out = []; for (var n = intg(a[1]); n > 0 && e.val.length; n--) out.push(e.val.splice(Math.floor(Math.random() * e.val.length), 1)[0]); cleanup(a[0]); return arr(out); } var v = e.val.splice(Math.floor(Math.random() * e.val.length), 1)[0]; cleanup(a[0]); return v; });
    def('srandmember', 1, 2, function (a) { var e = get(a[0], 'set'); if (!e || !e.val.length) return a.length > 1 ? arr([]) : null; if (a.length > 1) return arr(e.val.slice(0, Math.abs(intg(a[1])))); return e.val[Math.floor(Math.random() * e.val.length)]; });
    def('smove', 3, 3, function (a) { var s = get(a[0], 'set'); if (!s) return 0; var i = s.val.indexOf(a[2]); if (i < 0) return 0; s.val.splice(i, 1); cleanup(a[0]); var d = ensure(a[1], 'set', function () { return []; }); if (!setHas(d, a[2])) d.val.push(a[2]); return 1; });

    /* ── sorted sets ── */
    def('zadd', 3, 99, function (a) {
      var i = 1, nx = false, xx = false, gt = false, lt = false, ch = false, incrF = false;
      for (; i < a.length; i++) { var o = a[i].toUpperCase(); if (o === 'NX') nx = true; else if (o === 'XX') xx = true; else if (o === 'GT') gt = true; else if (o === 'LT') lt = true; else if (o === 'CH') ch = true; else if (o === 'INCR') incrF = true; else break; }
      var rest = a.slice(i); if (!rest.length || rest.length % 2) throw new RedisError('ERR syntax error');
      var e = get(a[0], 'zset'), added = 0, changed = 0, last = null;
      for (var j = 0; j < rest.length; j += 2) {
        var sc = num(rest[j], 'float'), m = rest[j + 1]; if (!e) e = put(a[0], 'zset', []);
        var ex = e.val.filter(function (x) { return x.m === m; })[0];
        if (ex) { if (nx) continue; var ns = incrF ? ex.s + sc : sc; if ((gt && ns <= ex.s) || (lt && ns >= ex.s)) continue; if (ns !== ex.s) { ex.s = ns; changed++; } last = ns; }
        else { if (xx) continue; e.val.push({ m: m, s: sc }); added++; last = sc; }
      }
      if (e) { zsort(e.val); cleanup(a[0]); } if (incrF) return last === null ? null : fnum(last); return ch ? added + changed : added;
    });
    def('zincrby', 3, 3, function (a) { var e = ensure(a[0], 'zset', function () { return []; }), by = num(a[1], 'float'), ex = e.val.filter(function (x) { return x.m === a[2]; })[0]; if (ex) ex.s += by; else e.val.push({ m: a[2], s: by }); zsort(e.val); return fnum(ex ? ex.s : by); });
    def('zrange', 3, 8, function (a) { var e = get(a[0], 'zset'), up = a.map(function (x) { return String(x).toUpperCase(); }), rev = up.indexOf('REV') >= 0, ws = up.indexOf('WITHSCORES') >= 0; if (up.indexOf('BYSCORE') >= 0) { var z = byScore(e, a[1], a[2], rev, {}), out = []; z.forEach(function (x) { out.push(x.m); if (ws) out.push(fnum(x.s)); }); return arr(out); } return arr(zrange(e, a[1], a[2], rev, ws)); });
    def('zrevrange', 3, 4, function (a) { return arr(zrange(get(a[0], 'zset'), a[1], a[2], true, a[3] && /withscores/i.test(a[3]))); });
    function zbs(rev) { return function (a) { var e = get(a[0], 'zset'), ws = false, limit = null; for (var i = 3; i < a.length; i++) { if (/^withscores$/i.test(a[i])) ws = true; if (/^limit$/i.test(a[i])) { limit = [+a[i + 1], +a[i + 2]]; i += 2; } } var out = []; byScore(e, a[1], a[2], rev, { limit: limit }).forEach(function (x) { out.push(x.m); if (ws) out.push(fnum(x.s)); }); return arr(out); }; }
    def('zrangebyscore', 3, 8, zbs(false)); def('zrevrangebyscore', 3, 8, zbs(true));
    def('zcount', 3, 3, function (a) { return byScore(get(a[0], 'zset'), a[1], a[2], false, {}).length; });
    def('zscore', 2, 2, function (a) { var e = get(a[0], 'zset'), x = e && e.val.filter(function (y) { return y.m === a[1]; })[0]; return x ? fnum(x.s) : null; });
    def('zrank', 2, 2, function (a) { var e = get(a[0], 'zset'); if (!e) return null; var i = e.val.map(function (y) { return y.m; }).indexOf(a[1]); return i < 0 ? null : i; });
    def('zrevrank', 2, 2, function (a) { var e = get(a[0], 'zset'); if (!e) return null; var i = e.val.map(function (y) { return y.m; }).reverse().indexOf(a[1]); return i < 0 ? null : i; });
    def('zrem', 2, 99, function (a) { var e = get(a[0], 'zset'), n = 0; if (!e) return 0; a.slice(1).forEach(function (m) { var i = e.val.map(function (y) { return y.m; }).indexOf(m); if (i >= 0) { e.val.splice(i, 1); n++; } }); cleanup(a[0]); return n; });
    def('zcard', 1, 1, function (a) { var e = get(a[0], 'zset'); return e ? e.val.length : 0; });
    function zpop(max) { return function (a) { var e = get(a[0], 'zset'); if (!e) return arr([]); var n = a[1] ? intg(a[1]) : 1, out = []; while (n-- > 0 && e.val.length) { var x = max ? e.val.pop() : e.val.shift(); out.push(x.m, fnum(x.s)); } cleanup(a[0]); return arr(out); }; }
    def('zpopmin', 1, 2, zpop(false)); def('zpopmax', 1, 2, zpop(true));
    def('zremrangebyscore', 3, 3, function (a) { var e = get(a[0], 'zset'); if (!e) return 0; var rm = byScore(e, a[1], a[2], false, {}); e.val = e.val.filter(function (x) { return rm.indexOf(x) < 0; }); cleanup(a[0]); return rm.length; });
    def('zremrangebyrank', 3, 3, function (a) { var e = get(a[0], 'zset'); if (!e) return 0; var n = e.val.length, s = intg(a[1]), t = intg(a[2]); if (s < 0) s = Math.max(0, n + s); if (t < 0) t = n + t; var rm = e.val.slice(s, t + 1); e.val = e.val.filter(function (x) { return rm.indexOf(x) < 0; }); cleanup(a[0]); return rm.length; });

    /* ── pub/sub & transactions are handled in exec ── */
    var TX_FREE = { multi: 1, exec: 1, discard: 1, watch: 1, unwatch: 1 };

    function run(argv) {
      var name = argv[0].toLowerCase(), args = argv.slice(1), out = [];
      if (name === 'multi') { if (tx) throw new RedisError('ERR MULTI calls can not be nested'); tx = []; return ok(); }
      if (name === 'discard') { if (!tx) throw new RedisError('ERR DISCARD without MULTI'); tx = null; return ok(); }
      if (name === 'watch' || name === 'unwatch') return ok();
      if (name === 'exec') { if (!tx) throw new RedisError('ERR EXEC without MULTI'); var q = tx; tx = null; return arr(q.map(function (c) { try { return run1(c); } catch (e) { if (e instanceof RedisError) return { err: e.message }; throw e; } })); }
      if (tx && !TX_FREE[name]) { if (!C[name]) { tx = null; throw new RedisError("ERR unknown command '" + argv[0] + "', with args beginning with: " + args.map(function (x) { return "'" + x + "'"; }).join(' ')); } check(name, args); tx.push(argv); return { s: 'QUEUED' }; }
      return run1(argv, out);
    }
    function check(name, args) { var c = C[name]; if (args.length < c.min || args.length > c.max) throw new RedisError("ERR wrong number of arguments for '" + name + "' command"); }
    function run1(argv) {
      var name = argv[0].toLowerCase(), args = argv.slice(1), extra = [];
      if (name === 'subscribe' || name === 'psubscribe') { var res = args.map(function (ch, i) { (name === 'subscribe' ? subs.chan : subs.pat)[ch] = 1; return arr([name, ch, i + 1]); }); return { multi: res, note: 'Reading messages... (press Ctrl-C to quit or any other command to abort)' }; }
      if (name === 'unsubscribe' || name === 'punsubscribe') { var list = args.length ? args : Object.keys(name === 'unsubscribe' ? subs.chan : subs.pat); return { multi: list.map(function (ch) { delete (name === 'unsubscribe' ? subs.chan : subs.pat)[ch]; return arr([name, ch, Object.keys(subs.chan).length + Object.keys(subs.pat).length]); }) }; }
      if (name === 'publish') { if (args.length !== 2) throw new RedisError("ERR wrong number of arguments for 'publish' command"); var n = publish(args[0], args[1], extra); return { value: n, extra: extra }; }
      var c = C[name]; if (!c) throw new RedisError("ERR unknown command '" + argv[0] + "', with args beginning with: " + args.map(function (x) { return "'" + x + "'"; }).join(' '));
      check(name, args); return c.fn(args, name);
    }

    /* ── redis-cli formatting ── */
    function quote(s) { return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t').replace(/[\u0000-\u001f]/g, function (ch) { return '\\x' + ('0' + ch.charCodeAt(0).toString(16)).slice(-2); }) + '"'; }
    function fmt(r, pad) {
      pad = pad || '';
      if (r === null || r === undefined) return '(nil)';
      if (typeof r === 'number') return '(integer) ' + r;
      if (typeof r === 'string') return quote(r);
      if (r.s !== undefined) return r.s;
      if (r.err !== undefined) return '(error) ' + r.err;
      if (Array.isArray(r)) {
        if (!r.length) return '(empty array)';
        var w = String(r.length).length;
        return r.map(function (x, i) { var p = String(i + 1).padStart(w) + ') ', inner = fmt(x, pad + ' '.repeat(p.length)); return (i ? pad : '') + p + inner; }).join('\n');
      }
      return String(r);
    }
    function splitArgs(line) {
      var out = [], i = 0, n = line.length;
      while (i < n) {
        while (i < n && /\s/.test(line[i])) i++; if (i >= n) break;
        var q = line[i], tok = '';
        if (q === '"') { i++; while (i < n && line[i] !== '"') { if (line[i] === '\\' && i + 1 < n) { var nx = line[++i]; tok += nx === 'n' ? '\n' : nx === 't' ? '\t' : nx === 'r' ? '\r' : nx; } else tok += line[i]; i++; } if (i >= n) return null; i++; }
        else if (q === "'") { i++; while (i < n && line[i] !== "'") { if (line[i] === '\\' && line[i + 1] === "'") { tok += "'"; i += 2; continue; } tok += line[i++]; } if (i >= n) return null; i++; }
        else { while (i < n && !/\s/.test(line[i])) tok += line[i++]; }
        out.push(tok);
      }
      return out;
    }

    return {
      exec: function (line) {
        var l = line.trim().replace(/^redis-cli\s*/i, '').replace(/^\d[\d.]*:\d+(\[\d+\])?>\s*/, '');
        if (!l) return { chunks: [], code: 0 };
        if (/^clear$/i.test(l)) return { chunks: [], code: 0, clear: true };
        var argv = splitArgs(l); if (argv === null) return { chunks: [{ t: 'err', s: 'Invalid argument(s)\n' }], code: 1 };
        if (!argv.length) return { chunks: [], code: 0 };
        if (/^help$/i.test(argv[0])) return { chunks: [{ t: 'out', s: 'redis-cli (simulator)\nTry: SET name Ada · GET name · INCR counter · LPUSH list a b · HSET user:1 name Ada · SADD tags a b · ZADD board 10 alice · EXPIRE name 30 · TTL name · KEYS *\n' }], code: 0 };
        var text = '', code = 0;
        try {
          var r = run(argv);
          if (r && r.raw !== undefined) text = r.raw;
          else if (r && r.multi) text = r.multi.map(function (x) { return fmt(x); }).join('\n') + (r.note ? '\n' + r.note : '');
          else if (r && r.nilTimeout !== undefined) text = '(nil)\n(' + Number(r.nilTimeout) + 's)';
          else if (r && r.value !== undefined && r.extra) { text = fmt(r.value); r.extra.forEach(function (m) { text += '\n' + fmt(m); }); }
          else text = fmt(r);
          if (r && r.err !== undefined) code = 1;
        } catch (e) { if (e instanceof RedisError) { text = '(error) ' + e.message; code = 1; } else throw e; }
        return { chunks: [{ t: code ? 'err' : 'out', s: text + '\n' }], code: code };
      },
      db: function () { return cur; }, tx: function () { return !!tx; }, subscribed: function () { return Object.keys(subs.chan).length + Object.keys(subs.pat).length > 0; },
      command: function (argv) { return run(argv); }, format: fmt, names: function () { return Object.keys(C); }
    };
  }
  sim.createRedis = createServer;

  sim.engines.redis = function () {
    var server = createServer(), shell = new sim.Shell({ cwd: '/app', commands: {} });
    return {
      title: 'Redis Simulator', sub: 'redis-cli · in-memory · Redis 7 commands', shell: shell, server: server,
      banner: 'Connected to a simulated Redis 7.2 server on 127.0.0.1:6379 — data lives in memory for this run.\nTry HELP, or type commands below (SET, GET, LPUSH, HSET, SADD, ZADD, EXPIRE, TTL, KEYS *).',
      prompt: function () { return '127.0.0.1:6379' + (server.db() ? '[' + server.db() + ']' : '') + (server.tx() ? '(TX)' : '') + '> '; },
      placeholder: 'SET greeting "hello"  ·  GET greeting  ·  KEYS *',
      exec: function (line) { var r = server.exec(line); if (r.clear && shell.onClear) shell.onClear(); return Promise.resolve(r); }
    };
  };
})(window);
