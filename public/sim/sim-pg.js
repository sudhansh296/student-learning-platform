/* WebDev Atlas — PostgreSQL in the browser. Real Postgres 16 compiled to WebAssembly (PGlite) with psql-style output:
 * aligned tables, \dt \d \l \du \x \timing, multi-line statements, error context. Requires sim-term.js. */
(function (G) {
  'use strict';
  var sim = G.__sim;
  var PGLITE_VERSION = '0.2.17', BASE = 'https://cdn.jsdelivr.net/npm/@electric-sql/pglite@' + PGLITE_VERSION + '/dist/';
  var NUMERIC = { 20: 1, 21: 1, 23: 1, 26: 1, 700: 1, 701: 1, 790: 1, 1700: 1, 24: 1, 28: 1, 29: 1 };
  var CONTRIB = { pg_trgm: 'pg_trgm', 'uuid-ossp': 'uuid_ossp', hstore: 'hstore', citext: 'citext', fuzzystrmatch: 'fuzzystrmatch', btree_gin: 'btree_gin', btree_gist: 'btree_gist', tablefunc: 'tablefunc', cube: 'cube', earthdistance: 'earthdistance', ltree: 'ltree', isn: 'isn', seg: 'seg', intarray: 'intarray', unaccent: 'unaccent', pgcrypto: 'pgcrypto', vector: 'vector' };

  /* ───────────── SQL splitting ───────────── */
  function splitScript(text) {
    var items = [], i = 0, n = text.length, cur = '', curStart = 0;
    function flush(kind) { var s = cur.trim(); if (s) items.push({ kind: kind || 'sql', text: s }); cur = ''; }
    function onlyBlank() { return !cur.replace(/--[^\n]*|\/\*[\s\S]*?\*\//g, '').trim(); }
    while (i < n) {
      var c = text[i], two = text.substr(i, 2);
      if (c === '\\' && onlyBlank()) { var e = text.indexOf('\n', i); if (e < 0) e = n; var line = text.slice(i, e).trim(); if (cur.trim()) { items.push({ kind: 'comment', text: cur.trim() }); cur = ''; } items.push({ kind: 'meta', text: line }); i = e + 1; continue; }
      if (two === '--') { var e2 = text.indexOf('\n', i); if (e2 < 0) e2 = n; if (onlyBlank()) { items.push({ kind: 'comment', text: text.slice(i, e2).trim() }); cur = ''; } else cur += text.slice(i, e2); i = e2; continue; }
      if (two === '/*') { var e3 = text.indexOf('*/', i + 2); if (e3 < 0) e3 = n - 2; cur += text.slice(i, e3 + 2); i = e3 + 2; continue; }
      if (c === "'") { var j = i + 1; while (j < n) { if (text[j] === "'" && text[j + 1] === "'") j += 2; else if (text[j] === "'") break; else if (text[j] === '\\' && /[eE]/.test(text[i - 1] || '')) j += 2; else j++; } cur += text.slice(i, j + 1); i = j + 1; continue; }
      if (c === '"') { var k = text.indexOf('"', i + 1); if (k < 0) k = n - 1; cur += text.slice(i, k + 1); i = k + 1; continue; }
      if (c === '$') { var m = text.slice(i).match(/^\$([A-Za-z_]\w*)?\$/); if (m) { var tag = m[0], ce = text.indexOf(tag, i + tag.length); if (ce < 0) ce = n - tag.length; cur += text.slice(i, ce + tag.length); i = ce + tag.length; continue; } }
      if (c === ';') { cur += ';'; flush('sql'); i++; continue; }
      cur += c; i++;
    }
    var tail = cur.trim(); if (tail) items.push({ kind: /^(--|\/\*)/.test(tail) && !tail.replace(/--[^\n]*|\/\*[\s\S]*?\*\//g, '').trim() ? 'comment' : 'sql', text: tail, open: true });
    void curStart; return items;
  }

  /* ───────────── psql formatting ───────────── */
  function fmtTable(fields, rows, expanded, noFooter) {
    var names = fields.map(function (f) { return f.name; }), cells = rows.map(function (r) { return r.map(function (v) { return v === null || v === undefined ? '' : String(v); }); });
    if (!fields.length) return '';
    if (expanded) {
      var nw = Math.max.apply(null, names.map(function (x) { return x.length; })), out = '';
      if (!rows.length) return '(0 rows)\n';
      cells.forEach(function (r, ri) {
        var vw = Math.max.apply(null, r.map(function (v) { return Math.max.apply(null, v.split('\n').map(function (l) { return l.length; })); }).concat([0]));
        var head = '-[ RECORD ' + (ri + 1) + ' ]'; out += head + '-'.repeat(Math.max(1, nw + vw + 3 - head.length)) + '\n';
        names.forEach(function (nm, i) { var lines = r[i].split('\n'); lines.forEach(function (l, li) { out += (li === 0 ? nm.padEnd(nw) : ' '.repeat(nw)) + ' ' + (li === 0 ? '|' : '|') + (l ? ' ' + l : '') + (li < lines.length - 1 ? '+' : '') + '\n'; }); out = out.replace(/ +\n/g, '\n'); });
      }); return out;
    }
    var widths = names.map(function (nm, i) { return Math.max(nm.length, Math.max.apply(null, cells.map(function (r) { return Math.max.apply(null, r[i].split('\n').map(function (l) { return l.length; })); }).concat([0]))); });
    var num = fields.map(function (f) { return !!NUMERIC[f.dataTypeID]; });
    var head = names.map(function (nm, i) { var pad = widths[i] - nm.length, l = Math.floor(pad / 2); return ' ' + ' '.repeat(l) + nm + ' '.repeat(pad - l) + ' '; }).join('|').replace(/\s+$/, '');
    var sep = widths.map(function (w) { return '-'.repeat(w + 2); }).join('+');
    var out2 = head + '\n' + sep + '\n';
    cells.forEach(function (r) {
      var parts = r.map(function (v) { return v.split('\n'); }), h = Math.max.apply(null, parts.map(function (p) { return p.length; }));
      for (var li = 0; li < h; li++) {
        out2 += r.map(function (_v, i) { var l = parts[i][li] === undefined ? '' : parts[i][li], cont = li < parts[i].length - 1 && parts[i].length > 1; var cell = num[i] ? l.padStart(widths[i]) : l.padEnd(widths[i]); return ' ' + cell + (cont ? '+' : ' '); }).join('|').replace(/\s+$/, '') + '\n';
      }
    });
    return noFooter ? out2 : out2 + '(' + rows.length + ' row' + (rows.length === 1 ? '' : 's') + ')\n\n';
  }
  function fmtList(title, headers, rows, noFooter) { var f = headers.map(function (h) { return { name: h, dataTypeID: 25 }; }); return (title ? center(title, tableWidth(headers, rows)) + '\n' : '') + fmtTable(f, rows, false, noFooter); }
  function tableWidth(headers, rows) { var w = headers.map(function (h, i) { return Math.max(h.length, Math.max.apply(null, rows.map(function (r) { return String(r[i] === null ? '' : r[i]).length; }).concat([0]))); }); return w.reduce(function (a, b) { return a + b + 3; }, -1); }
  function center(s, w) { var pad = Math.max(0, w - s.length), l = Math.floor(pad / 2); return ' '.repeat(l) + s; }

  function tagFor(sqlText, res) {
    var s = sqlText.replace(/^(\s|--[^\n]*\n|\/\*[\s\S]*?\*\/)+/, ''), w = s.match(/^\w+/); w = w ? w[0].toUpperCase() : '';
    var n = res && res.affectedRows !== undefined ? res.affectedRows : 0;
    if (w === 'INSERT') return 'INSERT 0 ' + n; if (w === 'UPDATE' || w === 'DELETE' || w === 'MERGE' || w === 'COPY') return w + ' ' + n;
    if (w === 'CREATE' || w === 'DROP' || w === 'ALTER') {
      var rest = s.replace(/^\w+\s+/, ''), obj = rest.replace(/^(OR\s+REPLACE\s+|UNIQUE\s+|TEMP(ORARY)?\s+|UNLOGGED\s+|MATERIALIZED\s+|RECURSIVE\s+|CONSTRAINT\s+)+/i, '').match(/^(\w+(\s+\w+)?)/i), o = obj ? obj[1].toUpperCase() : '';
      var first = o.split(/\s+/)[0];
      if (/^TABLE\s+AS/i.test(o)) return 'SELECT ' + n;
      if (/^(TABLE|INDEX|VIEW|SEQUENCE|SCHEMA|FUNCTION|PROCEDURE|TRIGGER|TYPE|EXTENSION|DATABASE|ROLE|USER|DOMAIN|POLICY|RULE|AGGREGATE|COLLATION|OPERATOR)/.test(first)) { if (/MATERIALIZED/i.test(s.slice(0, 40)) && first === 'VIEW') return w + ' MATERIALIZED VIEW'; return w + ' ' + first; }
      return w + ' ' + first;
    }
    if (/^(BEGIN|START)$/.test(w)) return 'BEGIN'; if (w === 'COMMIT' || w === 'END') return 'COMMIT'; if (w === 'ROLLBACK') return 'ROLLBACK'; if (w === 'SET') return 'SET'; if (w === 'GRANT') return 'GRANT'; if (w === 'REVOKE') return 'REVOKE'; if (w === 'TRUNCATE') return 'TRUNCATE TABLE'; if (w === 'VACUUM') return 'VACUUM'; if (w === 'ANALYZE') return 'ANALYZE'; if (w === 'COMMENT') return 'COMMENT'; if (w === 'DO') return 'DO'; if (w === 'SAVEPOINT') return 'SAVEPOINT'; if (w === 'RELEASE') return 'RELEASE'; if (w === 'REFRESH') return 'REFRESH MATERIALIZED VIEW'; if (w === 'LOCK') return 'LOCK TABLE'; if (w === 'PREPARE') return 'PREPARE'; if (w === 'DEALLOCATE') return 'DEALLOCATE'; if (w === 'DISCARD') return 'DISCARD ALL'; if (w === 'REINDEX') return 'REINDEX'; if (w === 'CLUSTER') return 'CLUSTER'; if (w === 'LISTEN') return 'LISTEN'; if (w === 'NOTIFY') return 'NOTIFY'; if (w === 'RESET') return 'RESET'; if (w === 'EXECUTE') return 'EXECUTE';
    return w || 'OK';
  }
  function errText(e, sqlText) {
    var msg = String(e && e.message ? e.message : e).replace(/^(error|ERROR):?\s*/, ''), out = 'ERROR:  ' + msg + '\n', pos = e && (e.position || (e.data && e.data.position));
    if (pos && sqlText) { var p = parseInt(pos, 10), before = sqlText.slice(0, p - 1), ln = before.split('\n').length, lines = sqlText.split('\n'), col = before.length - before.lastIndexOf('\n') - 1, prefix = 'LINE ' + ln + ': '; if (lines[ln - 1] !== undefined) out += prefix + lines[ln - 1] + '\n' + ' '.repeat(prefix.length + col) + '^\n'; }
    if (e && e.detail) out += 'DETAIL:  ' + e.detail + '\n'; if (e && e.hint) out += 'HINT:  ' + e.hint + '\n'; return out;
  }

  /* ───────────── samples for fragments that assume tables exist ───────────── */
  var SAMPLES = {
    users: "CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, age INT, city TEXT, active BOOLEAN DEFAULT true, created_at TIMESTAMP DEFAULT now()); INSERT INTO users (name, email, age, city) VALUES ('Alice Johnson','alice@example.com',30,'New York'),('Bob Smith','bob@example.com',25,'London'),('Carol White','carol@example.com',35,'Paris'),('Dave Brown','dave@example.com',28,'New York'),('Eve Davis','eve@example.com',41,'Berlin'),('Frank Miller','frank@example.com',22,'London'),('Grace Lee','grace@example.com',33,'Tokyo'),('Heidi Klum','heidi@example.com',29,'Berlin');",
    products: "CREATE TABLE products (id SERIAL PRIMARY KEY, name TEXT NOT NULL, price NUMERIC(10,2) NOT NULL, category TEXT, stock INT DEFAULT 0); INSERT INTO products (name, price, category, stock) VALUES ('Laptop',999.99,'Electronics',15),('Mouse',19.99,'Electronics',120),('Desk',249.50,'Furniture',8),('Chair',129.00,'Furniture',20),('Notebook',3.49,'Stationery',500),('Pen',1.29,'Stationery',900),('Monitor',189.90,'Electronics',30);",
    orders: "CREATE TABLE orders (id SERIAL PRIMARY KEY, user_id INT REFERENCES users(id), total NUMERIC(10,2), status TEXT DEFAULT 'pending', created_at TIMESTAMP DEFAULT now()); INSERT INTO orders (user_id, total, status) VALUES (1,1019.98,'shipped'),(1,3.49,'delivered'),(2,249.50,'pending'),(3,129.00,'shipped'),(4,189.90,'delivered'),(5,21.28,'cancelled'),(3,999.99,'pending');",
    order_items: "CREATE TABLE order_items (id SERIAL PRIMARY KEY, order_id INT REFERENCES orders(id), product_id INT REFERENCES products(id), quantity INT NOT NULL, price NUMERIC(10,2)); INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (1,1,1,999.99),(1,2,1,19.99),(2,5,1,3.49),(3,3,1,249.50),(4,4,1,129.00),(5,7,1,189.90);",
    employees: "CREATE TABLE employees (id SERIAL PRIMARY KEY, name TEXT NOT NULL, department TEXT, salary NUMERIC(10,2), manager_id INT, hire_date DATE); INSERT INTO employees (name, department, salary, manager_id, hire_date) VALUES ('Ada Lovelace','Engineering',120000,NULL,'2019-03-01'),('Linus Torvalds','Engineering',110000,1,'2020-06-15'),('Grace Hopper','Engineering',115000,1,'2021-01-10'),('Sam Sales','Sales',70000,NULL,'2018-09-01'),('Nina Numbers','Finance',85000,4,'2022-02-20'),('Hank HR','HR',65000,NULL,'2017-11-05');",
    accounts: "CREATE TABLE accounts (id SERIAL PRIMARY KEY, owner TEXT NOT NULL, balance NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (balance >= 0)); INSERT INTO accounts (owner, balance) VALUES ('Alice',1000),('Bob',500),('Carol',250);",
    articles: "CREATE TABLE articles (id SERIAL PRIMARY KEY, title TEXT NOT NULL, body TEXT, author_id INT, tags TEXT[], published BOOLEAN DEFAULT false, created_at TIMESTAMP DEFAULT now()); INSERT INTO articles (title, body, author_id, tags, published) VALUES ('Intro to PostgreSQL','Postgres is a powerful open source database.',1,ARRAY['db','postgres'],true),('Indexes explained','B-tree, GIN, GiST and friends.',2,ARRAY['db','performance'],true),('Draft post','Work in progress',1,ARRAY['draft'],false);"
  };

  /* Shared with the Node "pg" client mock (sim-db.js). */
  sim.pgSamples = SAMPLES;
  var pgAssets = null;
  sim.pgCreate = async function (extra) {
    if (!pgAssets) pgAssets = Promise.all([import('https://cdn.jsdelivr.net/npm/@electric-sql/pglite@' + PGLITE_VERSION + '/+esm'), WebAssembly.compileStreaming(fetch(BASE + 'postgres.wasm')), fetch(BASE + 'postgres.data').then(function (r) { if (!r.ok) throw new Error('postgres.data HTTP ' + r.status); return r.blob(); })]).then(function (a) { return { mod: a[0], wasmModule: a[1], fsBundle: a[2] }; });
    var a = await pgAssets, db = new a.mod.PGlite(Object.assign({ wasmModule: a.wasmModule, fsBundle: a.fsBundle }, extra || {})); await db.waitReady; return db;
  };

  sim.engines.postgres = function () {
    var shell = new sim.Shell({ cwd: '/app' }), st = { db: null, dbs: {}, cur: 'postgres', extra: {}, pending: '', expanded: false, timing: false, names: ['postgres'], loading: null, exts: [] };
    function idParsers() { var p = {}; for (var o = 1; o < 5200; o++) p[o] = function (x) { return x; }; return p; }
    var assets = null;
    async function loadAssets() {
      if (assets) return assets;
      // The +esm bundle is the browser build (raw dist/ chunks import Node built-ins); the WASM binary and file-system bundle are passed in explicitly.
      assets = Promise.all([import('https://cdn.jsdelivr.net/npm/@electric-sql/pglite@' + PGLITE_VERSION + '/+esm'), WebAssembly.compileStreaming(fetch(BASE + 'postgres.wasm')), fetch(BASE + 'postgres.data').then(function (r) { if (!r.ok) throw new Error('postgres.data HTTP ' + r.status); return r.blob(); })]).then(function (a) { return { mod: a[0], wasmModule: a[1], fsBundle: a[2] }; });
      return assets;
    }
    async function open(name, exts) {
      var a = await loadAssets(), extObjs = {};
      for (var i = 0; i < (exts || []).length; i++) { var key = CONTRIB[exts[i]]; if (!key || key === 'vector') continue; try { var cm = await import(BASE + 'contrib/' + key + '.js'); extObjs[key] = cm[key] || cm.default; } catch (e) { /* extension bundle unavailable */ } }
      var db = new a.mod.PGlite({ wasmModule: a.wasmModule, fsBundle: a.fsBundle, parsers: idParsers(), extensions: extObjs }); await db.waitReady; st.dbs[name] = db; return db;
    }
    async function ensureDb(script) { if (st.db) return st.db; if (!st.loading) { var exts = []; String(script || '').replace(/create\s+extension\s+(?:if\s+not\s+exists\s+)?"?([\w-]+)"?/gi, function (m, e) { if (exts.indexOf(e) < 0) exts.push(e); return m; }); st.loading = open('postgres', exts).then(function (d) { st.db = d; return d; }); } return st.loading; }
    function cur() { return st.dbs[st.cur]; }
    function prompt() { return st.cur + (st.pending ? '-# ' : '=# '); }
    async function query(sqlText) { return cur().query(sqlText, [], { rowMode: 'array' }); }
    async function catalogRows(sql) { var r = await query(sql); return r.rows; }

    async function metaCommand(line, out) {
      var parts = line.slice(1).trim().split(/\s+/), cmd = parts[0], arg = parts[1];
      var w = function (s) { out.push({ t: 'out', s: s }); }, er = function (s) { out.push({ t: 'err', s: s }); };
      if (cmd === 'q') return 'quit';
      if (cmd === 'timing') { st.timing = !st.timing; w('Timing is ' + (st.timing ? 'on' : 'off') + '.\n'); return; }
      if (cmd === 'x') { st.expanded = !st.expanded; w('Expanded display is ' + (st.expanded ? 'on' : 'off') + '.\n'); return; }
      if (cmd === 'conninfo') { w('You are connected to database "' + st.cur + '" as user "postgres" via socket in "/tmp" at port "5432".\n'); return; }
      if (cmd === 'c' || cmd === 'connect') { var target = arg; if (!target) { w('You are now connected to database "' + st.cur + '" as user "postgres".\n'); return; } if (st.names.indexOf(target) < 0) { er('connection to server on socket "/tmp/.s.PGSQL.5432" failed: FATAL:  database "' + target + '" does not exist\nPrevious connection kept\n'); return; } if (!st.dbs[target]) { w('(starting a fresh in-memory database "' + target + '"…)\n'); await open(target); } st.cur = target; w('You are now connected to database "' + target + '" as user "postgres".\n'); return; }
      if (cmd === 'l' || cmd === 'l+') { var rows = st.names.concat(['template0', 'template1']).sort().map(function (n) { return [n, 'postgres', 'UTF8', 'libc', 'en_US.UTF-8', 'en_US.UTF-8', n.indexOf('template') === 0 ? '=c/postgres          +\npostgres=CTc/postgres' : '']; }); w(fmtList('List of databases', ['Name', 'Owner', 'Encoding', 'Locale Provider', 'Collate', 'Ctype', 'Access privileges'], rows)); return; }
      if (cmd === 'dt' || cmd === 'dt+' || cmd === 'dv' || cmd === 'di' || cmd === 'ds' || cmd === 'd' && !arg) {
        var kinds = { dt: "('r','p')", 'dt+': "('r','p')", dv: "('v','m')", di: "('i')", ds: "('S')", d: "('r','p','v','m','S','f')" }, typeName = { r: 'table', p: 'partitioned table', v: 'view', m: 'materialized view', i: 'index', S: 'sequence', f: 'foreign table' };
        var rs = await catalogRows("SELECT n.nspname, c.relname, c.relkind, pg_get_userbyid(c.relowner) FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relkind IN " + kinds[cmd] + " AND n.nspname NOT IN ('pg_catalog','information_schema') AND n.nspname !~ '^pg_toast' ORDER BY 1,2");
        if (!rs.length) { w('Did not find any relations.\n'); return; }
        w(fmtList('List of relations', ['Schema', 'Name', 'Type', 'Owner'], rs.map(function (r) { return [r[0], r[1], typeName[r[2]] || r[2], r[3]]; }))); return;
      }
      if (cmd === 'du' || cmd === 'dg') { var us = await catalogRows("SELECT rolname, rolsuper, rolcreaterole, rolcreatedb, rolcanlogin FROM pg_roles WHERE rolname !~ '^pg_' ORDER BY 1"); w(fmtList('List of roles', ['Role name', 'Attributes'], us.map(function (r) { var a = []; if (r[1] === 't') a.push('Superuser'); if (r[2] === 't') a.push('Create role'); if (r[3] === 't') a.push('Create DB'); if (r[4] !== 't') a.push('Cannot login'); return [r[0], a.join(', ')]; }))); return; }
      if (cmd === 'dn') { var ns = await catalogRows("SELECT nspname, pg_get_userbyid(nspowner) FROM pg_namespace WHERE nspname !~ '^pg_' AND nspname <> 'information_schema' ORDER BY 1"); w(fmtList('List of schemas', ['Name', 'Owner'], ns)); return; }
      if (cmd === 'df') { var fs_ = await catalogRows("SELECT n.nspname, p.proname, pg_get_function_result(p.oid), pg_get_function_arguments(p.oid) FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname NOT IN ('pg_catalog','information_schema') ORDER BY 1,2"); w(fs_.length ? fmtList('List of functions', ['Schema', 'Name', 'Result data type', 'Argument data types'], fs_) : 'List of functions\n Schema | Name | Result data type | Argument data types | Type\n--------+------+------------------+---------------------+------\n(0 rows)\n'); return; }
      if ((cmd === 'd' || cmd === 'd+') && arg) {
        var rel = arg.replace(/^public\./, ''), reg = '\'public."' + rel + '"\'::regclass';
        try {
          var cols = await catalogRows("SELECT a.attname, format_type(a.atttypid, a.atttypmod), (SELECT c.collname FROM pg_collation c, pg_type t WHERE c.oid = a.attcollation AND t.oid = a.atttypid AND a.attcollation <> t.typcollation), a.attnotnull, pg_get_expr(d.adbin, d.adrelid) FROM pg_attribute a LEFT JOIN pg_attrdef d ON a.attrelid = d.adrelid AND a.attnum = d.adnum WHERE a.attrelid = " + reg + " AND a.attnum > 0 AND NOT a.attisdropped ORDER BY a.attnum");
          var kind = (await catalogRows('SELECT relkind FROM pg_class WHERE oid = ' + reg))[0][0], title = (kind === 'i' ? 'Index' : kind === 'v' ? 'View' : kind === 'S' ? 'Sequence' : 'Table') + ' "public.' + rel + '"';
          w(fmtList(title, ['Column', 'Type', 'Collation', 'Nullable', 'Default'], cols.map(function (r) { return [r[0], r[1], r[2] || '', r[3] === 't' ? 'not null' : '', r[4] || '']; }), true));
          var idx = await catalogRows('SELECT c2.relname, i.indisprimary, i.indisunique, pg_get_indexdef(i.indexrelid) FROM pg_index i JOIN pg_class c2 ON c2.oid = i.indexrelid WHERE i.indrelid = ' + reg + ' ORDER BY i.indisprimary DESC, c2.relname');
          if (idx.length) { w('Indexes:\n'); idx.forEach(function (r) { var m = r[3].match(/USING (\w+) \((.*)\)(.*)$/); w('    "' + r[0] + '" ' + (r[1] === 't' ? 'PRIMARY KEY, ' : r[2] === 't' ? 'UNIQUE CONSTRAINT, ' : '') + (m ? m[1] + ' (' + m[2] + ')' + (m[3] ? m[3] : '') : r[3]) + '\n'); }); }
          var cons = await catalogRows("SELECT conname, contype, pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid = " + reg + " AND contype IN ('c','f') ORDER BY contype DESC, conname");
          var chk = cons.filter(function (r) { return r[1] === 'c'; }), fk = cons.filter(function (r) { return r[1] === 'f'; });
          if (chk.length) { w('Check constraints:\n'); chk.forEach(function (r) { w('    "' + r[0] + '" ' + r[2] + '\n'); }); }
          if (fk.length) { w('Foreign-key constraints:\n'); fk.forEach(function (r) { w('    "' + r[0] + '" ' + r[2] + '\n'); }); }
          var refs = await catalogRows("SELECT conrelid::regclass, conname, pg_get_constraintdef(oid) FROM pg_constraint WHERE confrelid = " + reg + " AND contype = 'f' ORDER BY 1");
          if (refs.length) { w('Referenced by:\n'); refs.forEach(function (r) { w('    TABLE "' + r[0] + '" CONSTRAINT "' + r[1] + '" ' + r[2] + '\n'); }); }
        } catch (e) { er('Did not find any relation named "' + arg + '".\n'); }
        return;
      }
      if (cmd === '?' || cmd === 'h') { w('psql meta-commands (simulator): \\dt \\d <table> \\dn \\du \\df \\dv \\di \\l \\c <db> \\x \\timing \\conninfo \\echo <text> \\q\nSQL statements end with a semicolon and can span several lines.\n'); return; }
      if (cmd === 'echo') { w(parts.slice(1).join(' ') + '\n'); return; }
      if (cmd === 'i' || cmd === 'e' || cmd === 's' || cmd === 'u' || cmd === 'set' || cmd === 'pset' || cmd === 'o') { er('(simulator) \\' + cmd + ' isn\'t available here.\n'); return; }
      er('invalid command \\' + cmd + '\nTry \\? for help.\n');
    }

    async function runSql(sqlText) {
      var out = [], t0 = performance.now(), body = sqlText.replace(/;\s*$/, '');
      var m = body.match(/^\s*create\s+database\s+"?(\w+)"?/i); if (m) { if (st.names.indexOf(m[1]) >= 0) out.push({ t: 'err', s: 'ERROR:  database "' + m[1] + '" already exists\n' }); else { st.names.push(m[1]); out.push({ t: 'out', s: 'CREATE DATABASE\n' }); } return out; }
      m = body.match(/^\s*drop\s+database\s+(?:if\s+exists\s+)?"?(\w+)"?/i); if (m) { var i = st.names.indexOf(m[1]); if (i < 0) out.push({ t: 'err', s: 'ERROR:  database "' + m[1] + '" does not exist\n' }); else if (m[1] === st.cur) out.push({ t: 'err', s: 'ERROR:  cannot drop the currently open database\n' }); else { st.names.splice(i, 1); delete st.dbs[m[1]]; out.push({ t: 'out', s: 'DROP DATABASE\n' }); } return out; }
      try {
        var res = await query(sqlText);
        if (res.fields && res.fields.length) { out.push({ t: 'out', s: fmtTable(res.fields, res.rows, st.expanded) }); if (/^\s*(insert|update|delete)/i.test(body)) out.push({ t: 'out', s: tagFor(sqlText, res) + '\n' }); }
        else out.push({ t: 'out', s: tagFor(sqlText, res) + '\n' });
      } catch (e) { out.push({ t: 'err', s: errText(e, sqlText) }); }
      if (st.timing) out.push({ t: 'out', s: 'Time: ' + (performance.now() - t0).toFixed(3) + ' ms\n' });
      return out;
    }
    async function exec(line) {
      var raw = String(line);
      if (!st.db && !st.loading) await ensureDb('');
      await ensureDb(''); var out = [];
      if (!st.pending && /^\s*\\/.test(raw)) { var r = await metaCommand(raw.trim(), out); if (r === 'quit') throw Object.assign(new Error('exit'), { __exit: true }); return { chunks: out, code: 0 }; }
      var text = (st.pending ? st.pending + '\n' : '') + raw;
      var items = splitScript(text), last = items[items.length - 1];
      if (last && last.open && last.kind === 'sql') { st.pending = last.text; items = items.slice(0, -1); } else st.pending = '';
      for (var i = 0; i < items.length; i++) { var it = items[i]; if (it.kind === 'meta') { var r2 = await metaCommand(it.text, out); if (r2 === 'quit') throw Object.assign(new Error('exit'), { __exit: true }); } else if (it.kind === 'sql') out = out.concat(await runSql(it.text)); }
      return { chunks: out, code: 0 };
    }
    return {
      title: 'PostgreSQL 16', sub: 'real Postgres in WebAssembly (PGlite) · psql-style output', shell: shell,
      banner: 'psql (16.4 — PGlite in your browser)\nType SQL ending with ";" — or \\dt, \\d table, \\l, \\x, \\timing.  Everything runs in memory for this run.',
      placeholder: 'SELECT version();   ·   \\dt   ·   CREATE TABLE ...',
      prompt: prompt, exec: exec,
      parseScript: function (script) {
        return splitScript(script).map(function (it) { if (it.kind === 'comment') return { comment: it.text }; if (it.kind === 'meta') return { line: it.text, display: it.text }; var ls = it.text.split('\n'); return { line: it.text, display: ls.map(function (l, i) { return (i ? st.cur + '-# ' : '') + l; }).join('\n'), sql: true }; });
      },
      prepare: async function (script) {
        var note = '', db;
        try { db = await ensureDb(script); } catch (e) { return '❌ Could not start PostgreSQL (WebAssembly) — ' + (e && e.message ? e.message : e) + '. The database engine is downloaded from a CDN on first use; check your connection and press Run again.'; }
        var created = {}; script.replace(/create\s+(?:temp(?:orary)?\s+|unlogged\s+)?table\s+(?:if\s+not\s+exists\s+)?(?:public\.)?"?(\w+)"?/gi, function (m, t) { created[t.toLowerCase()] = 1; return m; });
        var seeded = [], needs = {}; script.replace(/\b(?:from|join|into|update|table|truncate)\s+(?:only\s+)?(?:public\.)?"?(users|products|orders|order_items|employees|accounts|articles)"?/gi, function (m, t) { needs[t.toLowerCase()] = 1; return m; });
        var order = ['users', 'products', 'orders', 'order_items', 'employees', 'accounts', 'articles'];
        if (needs.orders && !created.users) needs.users = 1; if (needs.order_items) { needs.orders = 1; needs.products = 1; needs.users = 1; }
        for (var i = 0; i < order.length; i++) { var t = order[i]; if (needs[t] && !created[t]) { try { await db.exec(SAMPLES[t]); seeded.push(t); } catch (e) { /* skip */ } } }
        if (seeded.length) note = 'ℹ️ Sample tables created for you: ' + seeded.join(', ') + ' (add your own CREATE TABLE to use your own).';
        return note || null;
      },
      state: st
    };
  };
})(window);
