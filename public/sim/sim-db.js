/* WebDev Atlas — database client packages for the Node / Express simulator, backed by the real engines:
 * ioredis + redis (Redis engine), better-sqlite3 + sqlite3 (sql.js), pg (PGlite Postgres), mongodb + mongoose (Mongo engine).
 * Requires sim-core.js + sim-express.js; the engines (sim-redis / sim-mongo / sim-pg) are loaded alongside. */
(function (G) {
  'use strict';
  var sim = G.__sim, EventEmitter = sim.EventEmitter, Buffer = sim.Buffer;

  /* ───────────── async preloading (engines that need WASM before synchronous user code runs) ───────────── */
  sim.preloaders = sim.preloaders || [];
  sim.preload = function (code) {
    var jobs = sim.preloaders.filter(function (p) { return p.test.test(code); }).map(function (p) { return Promise.resolve().then(function () { return p.load(code); }); });
    return Promise.all(jobs).then(function () { }, function (e) { sim.post('e', '❌ ' + (e && e.message ? e.message : e)); });
  };
  function later(fn) { return new Promise(function (res, rej) { setTimeout(function () { try { res(fn()); } catch (e) { rej(e); } }, 0); }); }

  /* ═════════════════════════ Redis: ioredis + node-redis ═════════════════════════ */
  function rsrv() { return sim.sharedRedis || (sim.sharedRedis = sim.createRedis()); }
  function plain(r) {
    if (r === null || r === undefined) return null;
    if (Array.isArray(r)) return r.map(plain);
    if (typeof r === 'object') { if (r.s !== undefined) return r.s; if (r.err !== undefined) return new Error(r.err); if (r.nilTimeout !== undefined) return null; if (r.multi) return r.multi.map(plain); if (r.value !== undefined) return r.value; }
    return r;
  }
  function strArg(a) { if (a === undefined || a === null) return ''; if (a instanceof Buffer) return a.toString(); if (typeof a === 'object') return JSON.stringify(a); return String(a); }
  function pairsToObject(arr) { var o = {}; if (Array.isArray(arr)) for (var i = 0; i < arr.length; i += 2) o[arr[i]] = arr[i + 1]; return o; }
  function flatten(name, args) {
    var out = [];
    args.forEach(function (a) { if (Array.isArray(a)) a.forEach(function (x) { out.push(x); }); else if (a && typeof a === 'object' && !(a instanceof Buffer) && /^(hset|hmset|mset|msetnx)$/.test(name)) Object.keys(a).forEach(function (k) { out.push(k, a[k]); }); else out.push(a); });
    return out;
  }
  var psubs = { chan: {}, pat: {} };
  function globRe(p) { return new RegExp('^' + String(p).replace(/[.+^${}()|\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$'); }
  function publish(ch, msg) {
    var n = 0;
    (psubs.chan[ch] || []).forEach(function (c) { n++; setTimeout(function () { c.emit('message', ch, msg); if (c._cb) c._cb(msg, ch); }, 0); });
    Object.keys(psubs.pat).forEach(function (p) { if (globRe(p).test(ch)) psubs.pat[p].forEach(function (c) { n++; setTimeout(function () { c.emit('pmessage', p, ch, msg); }, 0); }); });
    return n;
  }
  function rexec(name, args) {
    if (name === 'publish') return publish(String(args[0]), strArg(args[1]));
    try { return plain(rsrv().command([name.toUpperCase()].concat(flatten(name, args).map(strArg)))); }
    catch (e) { var er = new Error(e && e.message ? e.message : String(e)); er.name = 'ReplyError'; throw er; }
  }
  function blocking(name, args) {
    var timeout = Number(args[args.length - 1]) || 0, keys = args.slice(0, -1), t0 = Date.now();
    return new Promise(function (res, rej) {
      (function tick() {
        try { var r = rsrv().command([name.toUpperCase()].concat(keys.map(strArg), ['0'])); if (!(r && r.nilTimeout !== undefined)) return res(plain(r)); } catch (e) { return rej(new Error(e.message)); }
        if (timeout > 0 && Date.now() - t0 >= timeout * 1000) return res(null);
        setTimeout(tick, 40);
      })();
    });
  }
  function rcall(client, name, args) {
    if (name === 'blpop' || name === 'brpop') return blocking(name, args);
    if (name === 'subscribe' || name === 'psubscribe') {
      var list = flatten(name, args).filter(function (x) { return typeof x !== 'function'; }).map(String), cb = args.filter(function (x) { return typeof x === 'function'; })[0];
      list.forEach(function (ch) { var reg = name === 'subscribe' ? psubs.chan : psubs.pat; (reg[ch] = reg[ch] || []).push(client); client._cb = cb || client._cb; });
      return later(function () { return list.length; });
    }
    if (name === 'unsubscribe' || name === 'punsubscribe') { [psubs.chan, psubs.pat].forEach(function (reg) { Object.keys(reg).forEach(function (k) { reg[k] = reg[k].filter(function (c) { return c !== client; }); }); }); return later(function () { return 'OK'; }); }
    return later(function () { var v = rexec(name, args); if (name === 'hgetall') v = pairsToObject(v); if (v instanceof Error) throw v; return v; });
  }
  function redisNames() { var n = rsrv().names(); return n.concat(['publish', 'subscribe', 'psubscribe', 'unsubscribe', 'punsubscribe', 'blpop', 'brpop']).filter(function (x, i, a) { return a.indexOf(x) === i; }); }

  function Redis() {
    if (!(this instanceof Redis)) return new Redis();
    EventEmitter.call(this); var self = this; this.status = 'connecting'; this.options = {};
    setTimeout(function () { self.status = 'ready'; self.emit('connect'); self.emit('ready'); }, 0);
  }
  Redis.prototype = Object.create(EventEmitter.prototype); Redis.prototype.constructor = Redis;
  function initRedisProto() {
    redisNames().forEach(function (n) {
      Redis.prototype[n] = function () {
        var args = Array.prototype.slice.call(arguments), cb = typeof args[args.length - 1] === 'function' && n !== 'subscribe' && n !== 'psubscribe' ? args.pop() : null, p = rcall(this, n, args);
        if (cb) p.then(function (v) { cb(null, v); }, function (e) { cb(e); });
        return p;
      };
    });
    function Pipeline(client, multi) {
      var q = [], self = this; this._multi = multi;
      redisNames().forEach(function (n) { self[n] = function () { q.push([n, Array.prototype.slice.call(arguments)]); return self; }; });
      this.exec = function (cb) {
        var p = later(function () { return q.map(function (it) { try { var v = rexec(it[0], it[1]); if (it[0] === 'hgetall') v = pairsToObject(v); return [null, v]; } catch (e) { return [e, null]; } }); });
        if (cb) p.then(function (r) { cb(null, r); }); return p;
      };
    }
    Redis.prototype.pipeline = function () { return new Pipeline(this, false); };
    Redis.prototype.multi = function () { return new Pipeline(this, true); };
    Redis.prototype.quit = Redis.prototype.disconnect = function () { this.status = 'end'; return later(function () { return 'OK'; }); };
    Redis.prototype.duplicate = function () { return new Redis(); };
    Redis.prototype.defineCommand = function () { };
    Redis.prototype.connect = function () { return later(function () { }); };
    Redis.Redis = Redis; Redis.default = Redis;
  }
  sim.lazy('ioredis', function () { initRedisProto(); return Redis; });

  function nodeRedisArgs(name, a) {
    var args = a.slice();
    if (name === 'set' && args[2] && typeof args[2] === 'object') { var o = args.pop(), ex = []; ['EX', 'PX', 'EXAT', 'PXAT'].forEach(function (k) { if (o[k] !== undefined) ex.push(k, o[k]); }); if (o.NX) ex.push('NX'); if (o.XX) ex.push('XX'); if (o.GET) ex.push('GET'); if (o.KEEPTTL) ex.push('KEEPTTL'); args = args.concat(ex); }
    if (name === 'zadd') { var key = args.shift(), members = [].concat(args[0] && typeof args[0] === 'object' && !Array.isArray(args[0]) ? [args[0]] : args[0] || []), fl = []; members.forEach(function (m) { fl.push(m.score, m.value); }); args = [key].concat(fl); }
    return args;
  }
  function makeNodeRedisClient() {
    var c = new EventEmitter(); c.isOpen = false; c.isReady = false;
    c.connect = function () { return later(function () { c.isOpen = c.isReady = true; c.emit('connect'); c.emit('ready'); return c; }); };
    c.disconnect = c.quit = c.close = function () { c.isOpen = false; return later(function () { return 'OK'; }); };
    c.duplicate = function () { return makeNodeRedisClient(); };
    c.multi = function () { var q = [], m = new Proxy({}, { get: function (t, p) { if (p === 'exec' || p === 'execAsPipeline') return function () { return later(function () { return q.map(function (it) { return nodeCall(it[0], it[1]); }); }); }; return function () { q.push([String(p), Array.prototype.slice.call(arguments)]); return m; }; } }); return m; };
    c.sendCommand = function (argv) { return later(function () { return plain(rsrv().command(argv.map(strArg))); }); };
    function nodeCall(rawName, a) {
      var name = rawName.toLowerCase(), res;
      if (name === 'zrangewithscores' || name === 'zrevrangewithscores') { var r = rexec(name === 'zrangewithscores' ? 'zrange' : 'zrevrange', a.concat(['WITHSCORES'])), out = []; for (var i = 0; i < r.length; i += 2) out.push({ value: r[i], score: Number(r[i + 1]) }); return out; }
      if (name === 'zrange' && a[3] && a[3].REV) return rexec('zrevrange', a.slice(0, 3));
      if (name === 'blpop' || name === 'brpop') return null;
      res = rexec(name, nodeRedisArgs(name, a));
      if (name === 'hgetall') return pairsToObject(res);
      if (name === 'zscore' && res !== null) return Number(res);
      return res;
    }
    return new Proxy(c, { get: function (t, p) {
      if (p in t) return t[p]; if (typeof p !== 'string') return undefined; if (p === 'then') return undefined;
      var lower = p.toLowerCase();
      if (lower === 'subscribe' || lower === 'psubscribe') return function (ch, listener) { var chans = [].concat(ch); return later(function () { chans.forEach(function (x) { var fake = new EventEmitter(); fake._cb = listener; var reg = lower === 'subscribe' ? psubs.chan : psubs.pat; (reg[x] = reg[x] || []).push(fake); }); }); };
      if (lower === 'unsubscribe' || lower === 'punsubscribe') return function () { return later(function () { }); };
      if (lower === 'blpop' || lower === 'brpop') return function () { return blocking(lower, Array.prototype.slice.call(arguments).reduce(function (acc, x) { return acc.concat(Array.isArray(x) ? x : [x]); }, [])).then(function (r) { return r ? { key: r[0], element: r[1] } : null; }); };
      return function () { var args = Array.prototype.slice.call(arguments); return later(function () { var v = nodeCall(p, args); if (v instanceof Error) throw v; return v; }); };
    } });
  }
  sim.register('redis', { createClient: function () { return makeNodeRedisClient(); }, createCluster: function () { return makeNodeRedisClient(); } });

  /* ═════════════════════════ SQLite: better-sqlite3 + sqlite3 (sql.js) ═════════════════════════ */
  var SQLP = null;
  function loadSqlJs() {
    if (sim._SQL) return Promise.resolve(sim._SQL);
    if (sim.loadSqlJs) return sim.loadSqlJs().then(function (SQL) { sim._SQL = SQL; return SQL; });
    var BASE_SQL = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/';
    if (!SQLP) SQLP = fetch(BASE_SQL + 'sql-wasm.js').then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); }).then(function (src) {
      // The simulator defines a CommonJS `module`, so run the UMD bundle with a private one and take its export.
      var mod = { exports: {} }; new Function('module', 'exports', src)(mod, mod.exports);
      var init = typeof mod.exports === 'function' ? mod.exports : mod.exports && mod.exports.default;
      return init({ locateFile: function (f) { return BASE_SQL + f; } });
    }).then(function (SQL) { sim._SQL = SQL; return SQL; }, function (e) { throw new Error('Could not load the SQLite engine (sql.js) from the CDN — ' + (e && e.message ? e.message : e)); });
    return SQLP;
  }
  sim.preloaders.push({ test: /better-sqlite3|['"]sqlite3['"]|sql\.js/, load: loadSqlJs });

  function SqliteError(msg, code) { var e = new Error(msg); e.name = 'SqliteError'; e.code = code; return e; }
  function mapSqliteErr(e) {
    var m = String(e && e.message ? e.message : e).replace(/^Error:\s*/, ''), code = /UNIQUE constraint/.test(m) ? 'SQLITE_CONSTRAINT_UNIQUE' : /NOT NULL constraint/.test(m) ? 'SQLITE_CONSTRAINT_NOTNULL' : /FOREIGN KEY constraint/.test(m) ? 'SQLITE_CONSTRAINT_FOREIGNKEY' : /CHECK constraint/.test(m) ? 'SQLITE_CONSTRAINT_CHECK' : /PRIMARY KEY/.test(m) ? 'SQLITE_CONSTRAINT_PRIMARYKEY' : 'SQLITE_ERROR';
    return SqliteError(m, code);
  }
  function bindParams(sql, args) {
    var params = args.reduce(function (acc, a) { return acc.concat(Array.isArray(a) ? a : [a]); }, []);
    var last = args[args.length - 1];
    if (last && typeof last === 'object' && !Array.isArray(last) && !(last instanceof Uint8Array) && !(last instanceof Date)) {
      var named = {}; Object.keys(last).forEach(function (k) { var m = sql.match(new RegExp('([@:$])' + k + '\\b')); named[(m ? m[1] : ':') + k] = last[k]; });
      return named;
    }
    return params.map(function (v) { return v === undefined ? null : typeof v === 'boolean' ? (v ? 1 : 0) : v instanceof Date ? v.toISOString() : v; });
  }
  function BSDatabase(file) {
    if (!(this instanceof BSDatabase)) return new BSDatabase(file);
    if (!sim._SQL) throw new Error('SQLite engine is still loading — try again (or check your connection).');
    this.name = file || ''; this.memory = !file || file === ':memory:'; this.open = true; this.readonly = false; this.inTransaction = false; this._db = new sim._SQL.Database();
  }
  BSDatabase.prototype.prepare = function (sql) { return new BSStatement(this, sql); };
  BSDatabase.prototype.exec = function (sql) { try { this._db.run(sql); } catch (e) { throw mapSqliteErr(e); } return this; };
  BSDatabase.prototype.pragma = function (p, opts) {
    var res; try { res = this._db.exec('PRAGMA ' + p); } catch (e) { throw mapSqliteErr(e); }
    var rows = res.length ? res[0].values.map(function (v) { var o = {}; res[0].columns.forEach(function (c, i) { o[c] = v[i]; }); return o; }) : [];
    return opts && opts.simple ? (rows[0] ? rows[0][Object.keys(rows[0])[0]] : undefined) : rows;
  };
  BSDatabase.prototype.transaction = function (fn) {
    var db = this;
    function make(mode) { var wrapper = function () { var args = arguments; db.exec('BEGIN ' + mode); db.inTransaction = true; try { var r = fn.apply(this, args); db.exec('COMMIT'); db.inTransaction = false; return r; } catch (e) { try { db.exec('ROLLBACK'); } catch (x) { /* already rolled back */ } db.inTransaction = false; throw e; } }; return wrapper; }
    var w = make('DEFERRED'); w.deferred = make('DEFERRED'); w.immediate = make('IMMEDIATE'); w.exclusive = make('EXCLUSIVE'); return w;
  };
  BSDatabase.prototype.close = function () { this.open = false; try { this._db.close(); } catch (e) { /* ignore */ } return this; };
  BSDatabase.prototype.function = function (name, opts, fn) { if (typeof opts === 'function') fn = opts; this._db.create_function(name, fn); return this; };
  BSDatabase.prototype.backup = function () { return Promise.resolve({ totalPages: 1, remainingPages: 0 }); };
  BSDatabase.prototype.defaultSafeIntegers = BSDatabase.prototype.unsafeMode = function () { return this; };
  function BSStatement(db, sql) {
    this.database = db; this.source = sql; this._pluck = false; this._raw = false; this.reader = /^\s*(select|pragma|with|explain|values)/i.test(sql);
    try { var st = db._db.prepare(sql); this._cols = st.getColumnNames(); st.free(); } catch (e) { throw mapSqliteErr(e); }
  }
  BSStatement.prototype._run = function (args, collect) {
    var db = this.database._db, st = db.prepare(this.source), rows = [];
    try { st.bind(bindParams(this.source, args)); while (st.step()) { rows.push(this._raw ? st.get() : this._pluck ? st.get()[0] : st.getAsObject()); if (!collect) break; } } catch (e) { st.free(); throw mapSqliteErr(e); }
    st.free(); return rows;
  };
  BSStatement.prototype.run = function () {
    var db = this.database._db, st = db.prepare(this.source);
    try { st.run(bindParams(this.source, Array.prototype.slice.call(arguments))); } catch (e) { st.free(); throw mapSqliteErr(e); }
    st.free(); var id = db.exec('select last_insert_rowid()')[0].values[0][0]; return { changes: db.getRowsModified(), lastInsertRowid: id };
  };
  BSStatement.prototype.get = function () { return this._run(Array.prototype.slice.call(arguments), false)[0]; };
  BSStatement.prototype.all = function () { return this._run(Array.prototype.slice.call(arguments), true); };
  BSStatement.prototype.iterate = function () { var rows = this._run(Array.prototype.slice.call(arguments), true), i = 0; return { next: function () { return i < rows.length ? { value: rows[i++], done: false } : { value: undefined, done: true }; }, [Symbol.iterator]: function () { return this; } }; };
  BSStatement.prototype.pluck = function (on) { this._pluck = on !== false; return this; };
  BSStatement.prototype.raw = function (on) { this._raw = on !== false; return this; };
  BSStatement.prototype.expand = BSStatement.prototype.safeIntegers = function () { return this; };
  BSStatement.prototype.columns = function () { return this._cols.map(function (n) { return { name: n, column: n, table: null, database: 'main', type: null }; }); };
  BSStatement.prototype.bind = function () { return this; };
  BSDatabase.SqliteError = SqliteError; BSDatabase.default = BSDatabase;
  sim.register('better-sqlite3', BSDatabase);

  /* node-sqlite3 (callback API) */
  function S3Database(file, mode, cb) {
    if (typeof mode === 'function') { cb = mode; } var self = this; this.filename = file;
    try { this._b = new BSDatabase(file); } catch (e) { this._err = e; }
    setTimeout(function () { if (cb) cb(self._err || null); }, 0);
    this._q = Promise.resolve();
  }
  S3Database.prototype = Object.create(EventEmitter.prototype);
  function s3args(args) { var a = Array.prototype.slice.call(args), cb = typeof a[a.length - 1] === 'function' ? a.pop() : null; return { sql: a[0], params: a.slice(1), cb: cb }; }
  S3Database.prototype._do = function (fn, cb, ctxFn) {
    var self = this; setTimeout(function () { var out, err = null; try { out = fn(self._b); } catch (e) { err = e; } if (cb) cb.call(ctxFn ? ctxFn(out) : {}, err, out); else if (err) self.emit('error', err); }, 0);
    return this;
  };
  S3Database.prototype.run = function () { var a = s3args(arguments); return this._do(function (b) { return b.prepare(a.sql).run.apply(b.prepare(a.sql), a.params); }, a.cb && function (err) { var ctx = this; a.cb.call(ctx, err); }, function (o) { return o ? { lastID: o.lastInsertRowid, changes: o.changes } : {}; }); };
  S3Database.prototype.get = function () { var a = s3args(arguments); return this._do(function (b) { var st = b.prepare(a.sql); return st.get.apply(st, a.params); }, a.cb); };
  S3Database.prototype.all = function () { var a = s3args(arguments); return this._do(function (b) { var st = b.prepare(a.sql); return st.all.apply(st, a.params); }, a.cb); };
  S3Database.prototype.each = function () { var a = Array.prototype.slice.call(arguments), done = typeof a[a.length - 1] === 'function' && typeof a[a.length - 2] === 'function' ? a.pop() : null, rowCb = a.pop(), sql = a[0], params = a.slice(1), self = this; setTimeout(function () { try { var st = self._b.prepare(sql), rows = st.all.apply(st, params); rows.forEach(function (r) { rowCb(null, r); }); if (done) done(null, rows.length); } catch (e) { rowCb(e); } }, 0); return this; };
  S3Database.prototype.exec = function (sql, cb) { return this._do(function (b) { b.exec(sql); }, cb); };
  S3Database.prototype.serialize = function (fn) { if (fn) fn(); return this; }; S3Database.prototype.parallelize = S3Database.prototype.serialize;
  S3Database.prototype.close = function (cb) { var self = this; setTimeout(function () { if (self._b) self._b.close(); if (cb) cb(null); }, 0); };
  S3Database.prototype.prepare = function (sql, cb) { var self = this, stmt = { run: function () { var a = s3args(arguments); a.sql = sql; self._do(function (b) { var st = b.prepare(sql); return st.run.apply(st, a.params); }, a.cb, function (o) { return o ? { lastID: o.lastInsertRowid, changes: o.changes } : {}; }); return stmt; }, get: function () { var a = s3args(arguments); self._do(function (b) { var st = b.prepare(sql); return st.get.apply(st, a.params); }, a.cb); return stmt; }, all: function () { var a = s3args(arguments); self._do(function (b) { var st = b.prepare(sql); return st.all.apply(st, a.params); }, a.cb); return stmt; }, finalize: function (cb2) { if (cb2) setTimeout(function () { cb2(null); }, 0); } }; if (cb) setTimeout(function () { cb(null); }, 0); return stmt; };
  var sqlite3Mod = { Database: S3Database, verbose: function () { return sqlite3Mod; }, OPEN_READONLY: 1, OPEN_READWRITE: 2, OPEN_CREATE: 4 };
  sim.register('sqlite3', sqlite3Mod);

  /* ═════════════════════════ PostgreSQL: pg (PGlite) ═════════════════════════ */
  sim.preloaders.push({
    test: /require\(\s*['"]pg['"]|from\s+['"]pg['"]|['"]pg-pool['"]/,
    load: function (code) {
      if (sim._pgdb) return sim._pgdb;
      return sim.pgCreate({ parsers: { 20: function (x) { return x; }, 1700: function (x) { return x; } } }).then(function (db) {
        sim._pgdb = db;
        var created = {}; String(code).replace(/create\s+(?:temp(?:orary)?\s+)?table\s+(?:if\s+not\s+exists\s+)?(?:public\.)?"?(\w+)"?/gi, function (m, t) { created[t.toLowerCase()] = 1; return m; });
        var need = {}; String(code).replace(/\b(?:from|join|into|update|table)\s+(?:only\s+)?(?:public\.)?"?(users|products|orders|order_items|employees|accounts|articles)"?/gi, function (m, t) { need[t.toLowerCase()] = 1; return m; });
        if (need.orders) need.users = 1; if (need.order_items) { need.orders = need.products = need.users = 1; }
        var samples = sim.pgSamples || {}, chain = Promise.resolve();
        ['users', 'products', 'orders', 'order_items', 'employees', 'accounts', 'articles'].forEach(function (t) { if (need[t] && !created[t] && samples[t]) chain = chain.then(function () { return db.exec(samples[t]); }).then(function () { sim.post('l', 'ℹ️ Sample table "' + t + '" created for this example.'); }, function () { }); });
        return chain.then(function () { return db; });
      });
    }
  });
  function pgRun(text, values) {
    var db = sim._pgdb; if (!db) return Promise.reject(new Error('PostgreSQL engine is not ready.'));
    var sql = typeof text === 'object' ? text.text : text, vals = typeof text === 'object' ? text.values : values, first = String(sql).trim().split(/\s+/)[0].toUpperCase();
    if ((!vals || !vals.length) && /;\s*\S/.test(String(sql).replace(/'[^']*'/g, ''))) return db.exec(sql).then(function (rs) { return rs.map(function (r) { return { command: first, rowCount: r.affectedRows !== undefined && r.affectedRows !== null ? r.affectedRows : r.rows.length, rows: r.rows, fields: (r.fields || []).map(function (f) { return { name: f.name, dataTypeID: f.dataTypeID }; }) }; }); });
    return db.query(sql, vals || []).then(function (r) { return { command: first, rowCount: /^(INSERT|UPDATE|DELETE)$/.test(first) && r.affectedRows !== undefined ? r.affectedRows : r.rows.length, oid: null, rows: r.rows, fields: (r.fields || []).map(function (f) { return { name: f.name, dataTypeID: f.dataTypeID }; }) }; });
  }
  function PgClient() { EventEmitter.call(this); this.connected = false; }
  PgClient.prototype = Object.create(EventEmitter.prototype);
  PgClient.prototype.connect = function (cb) { var self = this, p = later(function () { self.connected = true; return self; }); if (cb) p.then(function () { cb(null); }, cb); return p; };
  PgClient.prototype.query = function (text, values, cb) { if (typeof values === 'function') { cb = values; values = undefined; } var p = pgRun(text, values); if (cb) p.then(function (r) { cb(null, r); }, function (e) { cb(e); }); return p; };
  PgClient.prototype.end = function (cb) { var p = later(function () { }); if (cb) p.then(function () { cb(); }); return p; };
  PgClient.prototype.release = function () { };
  function PgPool() { PgClient.call(this); this.totalCount = 1; this.idleCount = 1; this.waitingCount = 0; }
  PgPool.prototype = Object.create(PgClient.prototype);
  PgPool.prototype.connect = function (cb) { var c = new PgClient(); c.connected = true; var p = later(function () { return c; }); if (cb) p.then(function () { cb(null, c, function () { }); }, cb); return p; };
  sim.register('pg', { Client: PgClient, Pool: PgPool, types: { setTypeParser: function () { }, builtins: {} }, defaults: {}, native: null });
  sim.register('pg-pool', PgPool);

  /* ═════════════════════════ MongoDB: mongodb driver + mongoose (Mongo engine) ═════════════════════════ */
  function mserver() { return sim.sharedMongo || (sim.sharedMongo = new sim.mongo.Server()); }
  function dbFromUri(u) { var m = String(u || '').match(/^mongodb(?:\+srv)?:\/\/[^/]*\/([^?]+)/); return m ? m[1] : 'test'; }
  function AsyncCursor(cur) {
    var c = this; this._c = cur;
    ['sort', 'limit', 'skip', 'project', 'hint', 'batchSize', 'maxTimeMS', 'collation'].forEach(function (m) { c[m] = function (v) { cur[m](v); return c; }; });
    this.toArray = function () { return later(function () { return cur.toArray(); }); };
    this.forEach = function (f) { return later(function () { cur.forEach(f); }); };
    this.next = function () { return later(function () { return cur.hasNext() ? cur.next() : null; }); };
    this.hasNext = function () { return later(function () { return cur.hasNext(); }); };
    this.count = this.countDocuments = function () { return later(function () { return cur.count(); }); };
    this.map = function (f) { return new AsyncCursor(cur.map(f)); };
    this.explain = function (v) { return later(function () { return cur.explain(v); }); };
    this.close = function () { return Promise.resolve(); };
    this[Symbol.asyncIterator] = function () { var docs = cur.toArray(), i = 0; return { next: function () { return Promise.resolve(i < docs.length ? { value: docs[i++], done: false } : { value: undefined, done: true }); } }; };
  }
  function AsyncCollection(dbName, name) {
    var api = sim.mongo.collectionApi(mserver(), sim.mongo.ensureCol(mserver(), dbName, name)), self = this;
    this.collectionName = name; this.dbName = dbName; this.namespace = dbName + '.' + name;
    Object.keys(api).forEach(function (m) {
      self[m] = function () { var args = arguments; if (m === 'find' || m === 'aggregate') return new AsyncCursor(api[m].apply(api, args)); return later(function () { var r = api[m].apply(api, args); return r === undefined ? null : r; }); };
    });
    this.watch = function () { return new EventEmitter(); };
  }
  function MongoDb(name) { this.databaseName = name; }
  MongoDb.prototype.collection = function (n) { return new AsyncCollection(this.databaseName, n); };
  MongoDb.prototype.listCollections = function () { var db = mserver().db(this.databaseName); return { toArray: function () { return later(function () { return Object.keys(db.cols).map(function (n) { return { name: n, type: 'collection' }; }); }); } }; };
  MongoDb.prototype.createCollection = function (n) { sim.mongo.ensureCol(mserver(), this.databaseName, n); return later(function () { return new AsyncCollection(this.databaseName, n); }.bind(this)); };
  MongoDb.prototype.dropDatabase = function () { delete mserver().dbs[this.databaseName]; return later(function () { return true; }); };
  MongoDb.prototype.command = function () { return later(function () { return { ok: 1 }; }); };
  MongoDb.prototype.admin = function () { return { ping: function () { return later(function () { return { ok: 1 }; }); }, listDatabases: function () { return later(function () { return { databases: Object.keys(mserver().dbs).map(function (n) { return { name: n, sizeOnDisk: 8192, empty: false }; }), ok: 1 }; }); } }; };
  function MongoClient(uri) { if (!(this instanceof MongoClient)) return new MongoClient(uri); this.uri = uri; this.defaultDb = dbFromUri(uri); }
  MongoClient.prototype = Object.create(EventEmitter.prototype);
  MongoClient.prototype.connect = function () { var self = this; return later(function () { return self; }); };
  MongoClient.prototype.db = function (n) { return new MongoDb(n || this.defaultDb); };
  MongoClient.prototype.close = function () { return later(function () { }); };
  MongoClient.prototype.startSession = function () { var s = { startTransaction: function () { }, commitTransaction: function () { return later(function () { }); }, abortTransaction: function () { return later(function () { }); }, endSession: function () { return later(function () { }); }, withTransaction: function (f) { return Promise.resolve(f(s)); } }; return s; };
  MongoClient.connect = function (uri) { return new MongoClient(uri).connect(); };
  sim.lazy('mongodb', function () { return { MongoClient: MongoClient, ObjectId: sim.mongo.ObjectId, ObjectID: sim.mongo.ObjectId, ServerApiVersion: { v1: '1' }, Db: MongoDb }; });

  /* ---- mongoose ---- */
  sim.lazy('mongoose', function () { return buildMongoose(); });
  function buildMongoose() {
    var M = sim.mongo, ObjectId = M.ObjectId, dbName = 'test', conn = new EventEmitter(), models = {};
    conn.readyState = 0; conn.name = 'test'; conn.close = function () { conn.readyState = 0; return later(function () { }); };
    var Types = { ObjectId: ObjectId, Mixed: { __mixed: true }, Decimal128: Number };
    function ValidationError(model, errors) { var e = new Error(model + ' validation failed: ' + Object.keys(errors).map(function (k) { return k + ': ' + errors[k].message; }).join(', ')); e.name = 'ValidationError'; e.errors = errors; return e; }
    function ValidatorError(path, kind, message, value) { var e = new Error(message); e.name = 'ValidatorError'; e.path = path; e.kind = kind; e.value = value; e.properties = { message: message, type: kind, path: path, value: value }; return e; }
    function CastError(type, value, path) { var e = new Error('Cast to ' + type + ' failed for value "' + (typeof value === 'object' ? JSON.stringify(value) : value) + '" (type ' + typeof value + ') at path "' + path + '"'); e.name = 'CastError'; e.kind = type; e.path = path; e.value = value; return e; }
    function typeName(t) { return t === String ? 'String' : t === Number ? 'Number' : t === Boolean ? 'Boolean' : t === Date ? 'Date' : t === ObjectId ? 'ObjectId' : t === Buffer ? 'Buffer' : t && t.__mixed ? 'Mixed' : 'Mixed'; }
    function cast(v, t, path) {
      if (v === undefined || v === null) return v;
      if (Array.isArray(t)) return [].concat(v).map(function (x) { return cast(x, t[0] && t[0].type ? t[0].type : t[0], path); });
      if (t === String) return typeof v === 'string' ? v : String(v);
      if (t === Number) { var n = Number(v); if (isNaN(n) || v === '') throw CastError('Number', v, path); return n; }
      if (t === Boolean) { if (typeof v === 'boolean') return v; if (/^(true|1|yes)$/i.test(String(v))) return true; if (/^(false|0|no)$/i.test(String(v))) return false; throw CastError('Boolean', v, path); }
      if (t === Date) { var d = v instanceof Date ? v : new Date(v); if (isNaN(d)) throw CastError('date', v, path); return d; }
      if (t === ObjectId) { if (v instanceof ObjectId) return v; if (v && v._id instanceof ObjectId) return v._id; try { return new ObjectId(v); } catch (e) { throw CastError('ObjectId', v, path); } }
      return v;
    }
    function normDef(d) {
      if (typeof d === 'function' || (d && d.__mixed)) return { type: d };
      if (Array.isArray(d)) { var el = d[0]; return { type: [isDefObj(el) && el.type ? el : el], isArray: true, ref: isDefObj(el) && el.ref ? el.ref : undefined, elDef: el }; }
      return d;
    }
    function isDefObj(x) { return x && typeof x === 'object' && !Array.isArray(x); }
    function Schema(def, opts) {
      if (!(this instanceof Schema)) return new Schema(def, opts);
      this.paths = {}; this.methods = {}; this.statics = {}; this.virtuals = {}; this.hooks = { pre: {}, post: {} }; this.opts = opts || {}; this.indexes = []; this.query = {};
      this.add(def || {});
      if (this.opts.timestamps) { this.paths.createdAt = { type: Date }; this.paths.updatedAt = { type: Date }; }
    }
    Schema.Types = Types;
    Schema.prototype.add = function (def, prefix) {
      var self = this; prefix = prefix || '';
      Object.keys(def).forEach(function (k) {
        var d = def[k], path = prefix + k;
        if (isDefObj(d) && !('type' in d) && !d.__mixed && !(d instanceof Schema)) { self.add(d, path + '.'); return; }
        if (d instanceof Schema) { self.paths[path] = { type: [d], sub: d }; return; }
        var nd = normDef(d); if (isDefObj(nd) && nd.type && isDefObj(nd.type) && !nd.type.__mixed && !(nd.type instanceof Schema)) { self.add(nd.type, path + '.'); return; }
        self.paths[path] = nd; if (nd.unique) self.indexes.push([(function () { var o = {}; o[path] = 1; return o; })(), { unique: true }]);
      });
      return this;
    };
    Schema.prototype.virtual = function (name) { var v = this.virtuals[name] = { getters: [], setters: [] }; return { get: function (f) { v.getters.push(f); return this; }, set: function (f) { v.setters.push(f); return this; } }; };
    Schema.prototype.pre = function (evt, fn) { (this.hooks.pre[evt] = this.hooks.pre[evt] || []).push(fn); return this; };
    Schema.prototype.post = function (evt, fn) { (this.hooks.post[evt] = this.hooks.post[evt] || []).push(fn); return this; };
    Schema.prototype.index = function (spec, o) { this.indexes.push([spec, o || {}]); return this; };
    Schema.prototype.plugin = function (fn, o) { fn(this, o); return this; };
    Schema.prototype.path = function (p) { return this.paths[p]; };
    function applyDefaults(schema, doc) {
      Object.keys(schema.paths).forEach(function (p) {
        var def = schema.paths[p], cur = getP(doc, p);
        if (cur === undefined && def.default !== undefined) setP(doc, p, typeof def.default === 'function' ? def.default() : M.clone(def.default));
        else if (cur === undefined && def.isArray) setP(doc, p, []);
      });
      return doc;
    }
    function getP(o, p) { return p.split('.').reduce(function (a, k) { return a === undefined || a === null ? undefined : a[k]; }, o); }
    function setP(o, p, v) { var s = p.split('.'), c = o; for (var i = 0; i < s.length - 1; i++) { if (typeof c[s[i]] !== 'object' || c[s[i]] === null) c[s[i]] = {}; c = c[s[i]]; } c[s[s.length - 1]] = v; }
    function castDoc(schema, data) {
      var out = {};
      Object.keys(data || {}).forEach(function (k) {
        var def = schema.paths[k]; var v = data[k];
        if (def) { var t = def.type; if (def.sub) { v = [].concat(v).map(function (x) { return castDoc(def.sub, x); }); } else { try { v = cast(v, t, k); } catch (e) { if (e.name === 'CastError') { out.__castErr = out.__castErr || {}; out.__castErr[k] = e; return; } throw e; } } if (def.trim && typeof v === 'string') v = v.trim(); if (def.lowercase && typeof v === 'string') v = v.toLowerCase(); if (def.uppercase && typeof v === 'string') v = v.toUpperCase(); }
        else if (v && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date) && !(v instanceof ObjectId)) { var nested = {}; Object.keys(v).forEach(function (kk) { var d2 = schema.paths[k + '.' + kk]; try { nested[kk] = d2 ? cast(v[kk], d2.type, k + '.' + kk) : v[kk]; } catch (e) { nested[kk] = v[kk]; } }); v = nested; }
        if (!def && schema.opts.strict !== false && !/^(_id|__v|createdAt|updatedAt)$/.test(k) && !Object.keys(schema.paths).some(function (p) { return p.indexOf(k + '.') === 0; })) return;
        out[k] = v;
      });
      return out;
    }
    function validate(schema, doc, modelName) {
      var errors = {}, cast_ = doc.__castErr; if (cast_) Object.keys(cast_).forEach(function (k) { errors[k] = cast_[k]; delete doc.__castErr; });
      Object.keys(schema.paths).forEach(function (p) {
        if (errors[p]) return; var def = schema.paths[p], v = getP(doc, p), req = typeof def.required === 'function' ? def.required.call(doc) : def.required;
        var reqMsg = Array.isArray(req) ? req[1] : (isDefObj(req) ? req.message : null), isReq = Array.isArray(req) ? req[0] : (isDefObj(req) ? req.value !== false : !!req);
        if (isReq && (v === undefined || v === null || v === '' || (Array.isArray(v) && def.isArray && false))) { errors[p] = ValidatorError(p, 'required', reqMsg || 'Path `' + p + '` is required.', v); return; }
        if (v === undefined || v === null) return;
        var pv = function (x) { return Array.isArray(x) ? x[0] : x; }, pm = function (x, d) { return Array.isArray(x) && x[1] ? x[1] : d; };
        if (def.minlength !== undefined && String(v).length < pv(def.minlength)) errors[p] = ValidatorError(p, 'minlength', pm(def.minlength, 'Path `' + p + '` (`' + v + '`) is shorter than the minimum allowed length (' + pv(def.minlength) + ').'), v);
        else if (def.maxlength !== undefined && String(v).length > pv(def.maxlength)) errors[p] = ValidatorError(p, 'maxlength', pm(def.maxlength, 'Path `' + p + '` (`' + v + '`) is longer than the maximum allowed length (' + pv(def.maxlength) + ').'), v);
        else if (def.min !== undefined && v < (v instanceof Date ? new Date(pv(def.min)) : pv(def.min))) errors[p] = ValidatorError(p, 'min', pm(def.min, 'Path `' + p + '` (' + v + ') is less than minimum allowed value (' + pv(def.min) + ').'), v);
        else if (def.max !== undefined && v > (v instanceof Date ? new Date(pv(def.max)) : pv(def.max))) errors[p] = ValidatorError(p, 'max', pm(def.max, 'Path `' + p + '` (' + v + ') is more than maximum allowed value (' + pv(def.max) + ').'), v);
        else if (def.enum && !(Array.isArray(def.enum) ? def.enum : def.enum.values || []).some(function (x) { return x === v; })) errors[p] = ValidatorError(p, 'enum', (def.enum.message || '`' + v + '` is not a valid enum value for path `' + p + '`.'), v);
        else if (def.match && !pv(def.match).test(String(v))) errors[p] = ValidatorError(p, 'regexp', pm(def.match, 'Path `' + p + '` is invalid (' + v + ').'), v);
        else if (def.validate) { var vs = [].concat(def.validate); vs.forEach(function (vd) { if (errors[p]) return; var fn = typeof vd === 'function' ? vd : vd.validator, msg = vd.message || 'Validator failed for path `' + p + '` with value `' + v + '`'; if (typeof msg === 'function') msg = msg({ value: v, path: p }); if (fn && !fn.call(doc, v)) errors[p] = ValidatorError(p, 'user defined', String(msg).replace(/\{VALUE\}/g, v).replace(/\{PATH\}/g, p), v); }); }
      });
      if (Object.keys(errors).length) throw ValidationError(modelName, errors);
    }
    function runHooks(list, ctx, args) {
      var chain = Promise.resolve();
      (list || []).forEach(function (fn) { chain = chain.then(function () { return new Promise(function (res, rej) { var done = false; function next(err) { if (done) return; done = true; err ? rej(err) : res(); } try { var r = fn.length > 0 && fn.length <= (args ? args.length + 1 : 1) && !/^async/.test(String(fn)) ? fn.call(ctx, next) : fn.call(ctx, next); if (r && typeof r.then === 'function') r.then(function () { next(); }, next); else if (fn.length === 0) next(); } catch (e) { next(e); } }); }); });
      return chain;
    }
    function toIdCast(filter, schema) {
      var out = {}; Object.keys(filter || {}).forEach(function (k) {
        var v = filter[k]; if (k[0] === '$') { out[k] = Array.isArray(v) ? v.map(function (x) { return toIdCast(x, schema); }) : v; return; }
        var def = k === '_id' ? { type: ObjectId } : schema.paths[k];
        if (def && (def.type === ObjectId || (Array.isArray(def.type) && def.type[0] === ObjectId))) { var cv = function (x) { try { return typeof x === 'string' ? new ObjectId(x) : x; } catch (e) { return x; } }; v = M.isObj(v) && !(v instanceof ObjectId) ? (function () { var o = {}; Object.keys(v).forEach(function (op) { o[op] = Array.isArray(v[op]) ? v[op].map(cv) : cv(v[op]); }); return o; })() : cv(v); }
        else if (def && def.type === Number && typeof v === 'string' && !isNaN(v)) v = Number(v);
        out[k] = v;
      }); return out;
    }
    function model(name, schema) {
      if (models[name] && !schema) return models[name];
      if (!(schema instanceof Schema)) schema = new Schema(schema || {});
      var coll = schema.opts.collection || name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase() + (/s$/.test(name) ? '' : 's');
      function api() { return M.collectionApi(mserver(), M.ensureCol(mserver(), dbName, coll)); }
      function Model(data) {
        if (!(this instanceof Model)) return new Model(data);
        var d = castDoc(schema, data || {}); applyDefaults(schema, d); if (d._id === undefined) d._id = new ObjectId();
        Object.defineProperty(this, '_doc', { value: d, enumerable: false, writable: true }); Object.defineProperty(this, '$isNew', { value: true, writable: true, enumerable: false }); Object.defineProperty(this, '$modified', { value: {}, writable: true, enumerable: false });
      }
      Model.modelName = name; Model.schema = schema; Model.collection = { name: coll, collectionName: coll };
      var top = {}; Object.keys(schema.paths).forEach(function (p) { top[p.split('.')[0]] = 1; }); top._id = 1; top.__v = 1;
      Object.keys(top).forEach(function (k) { Object.defineProperty(Model.prototype, k, { enumerable: true, configurable: true, get: function () { return this._doc[k]; }, set: function (v) { var def = schema.paths[k]; try { this._doc[k] = def ? cast(v, def.type, k) : v; } catch (e) { this._doc.__castErr = this._doc.__castErr || {}; this._doc.__castErr[k] = e; } this.$modified[k] = 1; } }); });
      Object.defineProperty(Model.prototype, 'id', { get: function () { return this._doc._id ? this._doc._id.toString() : undefined; } });
      Object.keys(schema.virtuals).forEach(function (v) { Object.defineProperty(Model.prototype, v, { enumerable: false, get: function () { return schema.virtuals[v].getters.reduce(function (acc, g) { return g.call(this, acc); }.bind(this), undefined); }, set: function (val) { schema.virtuals[v].setters.forEach(function (s) { s.call(this, val); }.bind(this)); } }); });
      Object.keys(schema.methods).forEach(function (m) { Model.prototype[m] = schema.methods[m]; });
      Model.prototype.toObject = function (o) { var out = M.clone(this._doc); delete out.__castErr; if (o && o.virtuals) Object.keys(schema.virtuals).forEach(function (v) { out[v] = this[v]; }.bind(this)); if (o && o.versionKey === false) delete out.__v; return out; };
      Model.prototype.toJSON = function (o) { var opts = o || schema.opts.toJSON || {}; var out = this.toObject(opts); return out; };
      Model.prototype[Symbol.for('nodejs.util.inspect.custom')] = function () { return sim.inspect(M.clone(this._doc), { depth: 4 }); };
      Model.prototype.get = function (p) { return getP(this._doc, p); }; Model.prototype.set = function (p, v) { setP(this._doc, p, schema.paths[p] ? cast(v, schema.paths[p].type, p) : v); this.$modified[p.split('.')[0]] = 1; return this; };
      Model.prototype.isModified = function (p) { return p ? !!this.$modified[p] : Object.keys(this.$modified).length > 0; }; Model.prototype.isNew = undefined;
      Model.prototype.validate = function () { var self = this; return later(function () { validate(schema, self._doc, name); }); };
      Model.prototype.validateSync = function () { try { validate(schema, this._doc, name); return undefined; } catch (e) { return e; } };
      Model.prototype.save = function () {
        var self = this;
        return runHooks(schema.hooks.pre.validate, self).then(function () { return runHooks(schema.hooks.pre.save, self); }).then(function () {
          validate(schema, self._doc, name); var now = new Date();
          if (schema.opts.timestamps) { if (self.$isNew && !self._doc.createdAt) self._doc.createdAt = now; self._doc.updatedAt = now; }
          if (self.$isNew) { self._doc.__v = 0; ensureIdx(); api().insertOne(self._doc); self.$isNew = false; }
          else { var set = M.clone(self._doc); delete set._id; api().updateOne({ _id: self._doc._id }, { $set: set }); }
          self.$modified = {}; return runHooks(schema.hooks.post.save, self).then(function () { return self; });
        });
      };
      Model.prototype.deleteOne = Model.prototype.remove = function () { var self = this; return later(function () { api().deleteOne({ _id: self._doc._id }); return self; }); };
      Model.prototype.populate = function (path) { var self = this; return new Query(Model, 'populateDoc', {}, {}).populate(path)._populateDoc(self); };
      function ensureIdx() { schema.indexes.forEach(function (ix) { try { api().createIndex(ix[0], ix[1]); } catch (e) { /* exists */ } }); }
      function hydrate(raw) { var doc = new Model(); doc._doc = raw; doc.$isNew = false; doc.$modified = {}; return doc; }
      Model.hydrate = hydrate;
      function Query(M2, op, filter, opts) { this.model = M2; this.op = op; this.filter = filter || {}; this.opts = opts || {}; this._sort = null; this._limit = 0; this._skip = 0; this._select = null; this._lean = false; this._populate = []; this._where = null; }
      ['sort', 'limit', 'skip', 'lean', 'select', 'populate'].forEach(function (m) {
        Query.prototype[m] = function (v, v2) {
          if (m === 'sort') { this._sort = typeof v === 'string' ? v.split(/\s+/).filter(Boolean).reduce(function (o, k) { o[k.replace(/^[-+]/, '')] = k[0] === '-' ? -1 : 1; return o; }, {}) : v; }
          else if (m === 'select') { this._select = typeof v === 'string' ? v.split(/\s+/).filter(Boolean).reduce(function (o, k) { o[k.replace(/^[-+]/, '')] = k[0] === '-' ? 0 : 1; return o; }, {}) : v; }
          else if (m === 'lean') this._lean = v !== false; else if (m === 'populate') this._populate.push(typeof v === 'string' ? { path: v, select: v2 } : v); else if (m === 'limit') this._limit = v; else this._skip = v;
          return this;
        };
      });
      Query.prototype.where = function (f) { this._where = f; return this; };
      ['gt', 'gte', 'lt', 'lte', 'ne', 'in', 'nin'].forEach(function (o) { Query.prototype[o] = function (v) { var c = this.filter[this._where] = this.filter[this._where] || {}; c['$' + o] = v; return this; }; });
      Query.prototype.equals = function (v) { this.filter[this._where] = v; return this; };
      Query.prototype._populateDoc = function (doc) {
        var self = this; return later(function () { self._populateOne([doc]); return doc; });
      };
      Query.prototype._populateOne = function (docs) {
        var pops = this._populate;
        pops.forEach(function (p) {
          var path = p.path, def = schema.paths[path]; if (!def) return;
          var refName = def.ref || (def.elDef && def.elDef.ref) || (Array.isArray(def.type) && def.type[0] && def.type[0].ref), target = models[typeof refName === 'string' ? refName : refName && refName.modelName];
          if (!target) return; var tapi = M.collectionApi(mserver(), M.ensureCol(mserver(), dbName, target.Model_coll));
          docs.forEach(function (d) { var raw = d._doc || d, v = raw[path]; if (v === undefined || v === null) return; var fetch = function (id) { var hit = tapi.findOne({ _id: id }); return hit ? (p.select ? projectSel(hit, p.select) : hit) : null; }; raw[path] = Array.isArray(v) ? v.map(fetch) : fetch(v); });
        });
      };
      function projectSel(doc, sel) { var s = typeof sel === 'string' ? sel.split(/\s+/).filter(Boolean).reduce(function (o, k) { o[k.replace(/^[-+]/, '')] = k[0] === '-' ? 0 : 1; return o; }, {}) : sel; var keys = Object.keys(s), inc = keys.filter(function (k) { return s[k] && k !== '_id'; }); var out = {}; if (inc.length) { out._id = doc._id; inc.forEach(function (k) { if (doc[k] !== undefined) out[k] = doc[k]; }); } else { out = M.clone(doc); keys.forEach(function (k) { if (!s[k]) delete out[k]; }); } return out; }
      Query.prototype.exec = function () {
        var q = this, f = toIdCast(q.filter, schema);
        return later(function () {
          var a = api(), res;
          switch (q.op) {
            case 'find': { var c = a.find(f, q._select || undefined); if (q._sort) c.sort(q._sort); if (q._skip) c.skip(q._skip); if (q._limit) c.limit(q._limit); var raw = c.toArray(); q._populateOne(raw.map(function (r) { return { _doc: r }; })); return q._lean ? raw : raw.map(hydrate); }
            case 'findOne': { var one = a.findOne(f, q._select || undefined); if (!one) return null; q._populateOne([{ _doc: one }]); return q._lean ? one : hydrate(one); }
            case 'countDocuments': return a.countDocuments(f);
            case 'exists': { var e2 = a.findOne(f, { _id: 1 }); return e2 ? { _id: e2._id } : null; }
            case 'distinct': return a.distinct(q.opts.field, f);
            case 'updateOne': case 'updateMany': { var upd = q.opts.update; if (schema.opts.timestamps) { upd = M.clone(upd); upd.$set = Object.assign({ updatedAt: new Date() }, upd.$set || {}); } if (!/^\$/.test(Object.keys(upd)[0] || '$')) upd = { $set: upd }; var r = a[q.op](f, upd, { upsert: q.opts.upsert }); return { acknowledged: true, matchedCount: r.matchedCount, modifiedCount: r.modifiedCount, upsertedCount: r.upsertedCount, upsertedId: r.insertedId || null }; }
            case 'findOneAndUpdate': { var u2 = q.opts.update; if (!/^\$/.test(Object.keys(u2)[0] || '$')) u2 = { $set: u2 }; if (schema.opts.timestamps) { u2 = M.clone(u2); u2.$set = Object.assign({ updatedAt: new Date() }, u2.$set || {}); } if (q.opts.runValidators && u2.$set) { var tmp = castDoc(schema, u2.$set); validate({ paths: schema.paths, opts: schema.opts, virtuals: {} }, Object.assign({}, tmp), name); } var out = a.findOneAndUpdate(f, u2, { upsert: q.opts.upsert, returnDocument: q.opts.new || q.opts.returnDocument === 'after' ? 'after' : 'before' }); return out ? (q._lean ? out : hydrate(out)) : null; }
            case 'deleteOne': return a.deleteOne(f); case 'deleteMany': return a.deleteMany(f);
            case 'findOneAndDelete': { var d3 = a.findOneAndDelete(f); return d3 ? (q._lean ? d3 : hydrate(d3)) : null; }
            case 'aggregate': return a.aggregate(q.opts.pipeline).toArray();
            default: return null;
          }
        });
      };
      Query.prototype.then = function (a, b) { return this.exec().then(a, b); }; Query.prototype.catch = function (b) { return this.exec().catch(b); };
      Query.prototype.countDocuments = function () { this.op = 'countDocuments'; return this; };
      function q(op, filter, opts) { return new Query(Model, op, filter, opts); }
      Model.Model_coll = coll;
      Model.find = function (f, proj) { var x = q('find', f); if (proj) x._select = typeof proj === 'string' ? proj.split(/\s+/).filter(Boolean).reduce(function (o, k) { o[k.replace(/^[-+]/, '')] = k[0] === '-' ? 0 : 1; return o; }, {}) : proj; return x; };
      Model.findOne = function (f, proj) { var x = q('findOne', f); if (proj) x._select = typeof proj === 'string' ? proj.split(/\s+/).filter(Boolean).reduce(function (o, k) { o[k.replace(/^[-+]/, '')] = k[0] === '-' ? 0 : 1; return o; }, {}) : proj; return x; };
      Model.findById = function (id) { return q('findOne', { _id: id }); };
      Model.countDocuments = function (f) { return q('countDocuments', f); }; Model.estimatedDocumentCount = function () { return q('countDocuments', {}); };
      Model.exists = function (f) { return q('exists', f); }; Model.distinct = function (field, f) { return q('distinct', f, { field: field }); };
      Model.updateOne = function (f, u, o) { return q('updateOne', f, Object.assign({ update: u }, o)); }; Model.updateMany = function (f, u, o) { return q('updateMany', f, Object.assign({ update: u }, o)); };
      Model.findOneAndUpdate = function (f, u, o) { return q('findOneAndUpdate', f, Object.assign({ update: u }, o)); }; Model.findByIdAndUpdate = function (id, u, o) { return q('findOneAndUpdate', { _id: id }, Object.assign({ update: u }, o)); };
      Model.deleteOne = function (f) { return q('deleteOne', f); }; Model.deleteMany = function (f) { return q('deleteMany', f); };
      Model.findOneAndDelete = function (f) { return q('findOneAndDelete', f); }; Model.findByIdAndDelete = Model.findByIdAndRemove = function (id) { return q('findOneAndDelete', { _id: id }); };
      Model.aggregate = function (p) { return q('aggregate', {}, { pipeline: p }); };
      Model.create = function (docs) { var list = Array.isArray(docs) ? docs : Array.prototype.slice.call(arguments).filter(function (x) { return x && typeof x === 'object' && !(typeof x === 'function'); }), single = !Array.isArray(docs); var chain = Promise.resolve([]); list.forEach(function (d) { chain = chain.then(function (acc) { return new Model(d).save().then(function (s) { acc.push(s); return acc; }); }); }); return chain.then(function (r) { return single && r.length === 1 ? r[0] : r; }); };
      Model.insertMany = function (arr) { return Promise.all(arr.map(function (d) { return new Model(d).save(); })); };
      Model.createIndexes = Model.ensureIndexes = Model.syncIndexes = function () { return later(function () { ensureIdx(); }); };
      Model.init = function () { return later(function () { ensureIdx(); return Model; }); };
      Model.populate = function (docs, o) { var qq = q('find', {}); qq._populate = [].concat(typeof o === 'string' ? { path: o } : o); return later(function () { qq._populateOne([].concat(docs)); return docs; }); };
      Object.keys(schema.statics).forEach(function (s) { Model[s] = schema.statics[s]; });
      models[name] = Model; return Model;
    }
    var mongoose = {
      Schema: Schema, model: model, models: models, Types: Types, connection: conn, ObjectId: ObjectId, version: '8.4.0',
      connect: function (uri) { dbName = dbFromUri(uri); conn.name = dbName; return later(function () { conn.readyState = 1; setTimeout(function () { conn.emit('connected'); conn.emit('open'); }, 0); return mongoose; }); },
      disconnect: function () { conn.readyState = 0; return later(function () { }); }, set: function () { return mongoose; }, plugin: function () { return mongoose; },
      isValidObjectId: function (s) { return ObjectId.isValid(s); }, startSession: function () { return later(function () { return M.__sessionFactory ? M.__sessionFactory() : { startTransaction: function () { }, commitTransaction: function () { return later(function () { }); }, abortTransaction: function () { return later(function () { }); }, endSession: function () { return later(function () { }); }, withTransaction: function (f) { return Promise.resolve(f()); } }; }); },
      Error: { ValidationError: Error, CastError: Error }
    };
    Schema.Types.ObjectId = ObjectId;
    conn.on = conn.on.bind(conn); conn.once = conn.once.bind(conn);
    mongoose.default = mongoose; mongoose.mongo = { ObjectId: ObjectId };
    return mongoose;
  }
  sim.preloaders.push({ test: /mongoose|mongodb/, load: function () { /* engines are synchronous — nothing to preload */ } });
})(window);
