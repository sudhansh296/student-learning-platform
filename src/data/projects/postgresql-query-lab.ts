import type { Project } from './types';

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PostgreSQL Query Lab</title>
<link rel="stylesheet" href="style.css">
</head>
<body>

<div id="app">

  <header class="topbar">
    <div class="topbar-left">
      <div class="brand-icon">DB</div>
      <span class="brand-name">PostgreSQL Query Lab</span>
      <span class="brand-sub">shop_db</span>
    </div>
    <div class="topbar-right">
      <span id="rowsAffected" class="rows-badge"></span>
      <button id="btnReset" class="btn-sm">Reset data</button>
    </div>
  </header>

  <div class="layout">

    <aside class="sidebar">
      <div class="group-title">BASICS</div>
      <button class="qb" data-key="selectAll">SELECT * FROM customers</button>
      <button class="qb" data-key="whereFilter">WHERE city = ...</button>
      <button class="qb" data-key="orderLimit">ORDER BY ... LIMIT</button>

      <div class="group-title">WRITING DATA</div>
      <button class="qb" data-key="insertReturning">INSERT ... RETURNING</button>
      <button class="qb" data-key="updateSet">UPDATE ... SET</button>
      <button class="qb" data-key="deleteWhere">DELETE ... WHERE</button>

      <div class="group-title">JOINS</div>
      <button class="qb" data-key="innerJoin">INNER JOIN</button>
      <button class="qb" data-key="leftJoin">LEFT JOIN</button>

      <div class="group-title">AGGREGATION</div>
      <button class="qb" data-key="groupHaving">GROUP BY ... HAVING</button>

      <div class="group-title">POSTGRESQL-SPECIFIC</div>
      <button class="qb" data-key="windowRank">Window function: RANK()</button>
      <button class="qb" data-key="ilikeSearch">ILIKE (case-insensitive)</button>
    </aside>

    <div class="main">

      <div class="query-box">
        <div class="query-label">QUERY</div>
        <pre id="sqlText" class="sql-pre"></pre>
        <div id="paramRow" class="param-row"></div>
        <button id="btnRun" class="btn-run">Run Query</button>
      </div>

      <div class="result-box">
        <div class="result-top">
          <span class="result-label">RESULT</span>
          <span id="timeLabel" class="time-label"></span>
        </div>
        <div id="resultOut" class="result-out">Select a query and click Run.</div>
      </div>

    </div>

    <aside class="docs">
      <div class="group-title">EXPLANATION</div>
      <div id="docsBox" class="docs-body">Select a query on the left.</div>
    </aside>

  </div>
</div>

<script src="script.js"></script>
</body>
</html>`;

const styleCss = `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%}
body{font-family:'Segoe UI',system-ui,sans-serif;background:#0d1117;color:#e6edf3;font-size:13px;line-height:1.5;overflow:hidden}
button{cursor:pointer;font-family:inherit}
input{font-family:inherit}

#app{display:flex;flex-direction:column;height:100vh}

.topbar{display:flex;align-items:center;justify-content:space-between;padding:0 16px;height:48px;background:#161b22;border-bottom:1px solid #30363d;flex-shrink:0}
.topbar-left{display:flex;align-items:center;gap:10px}
.brand-icon{width:30px;height:30px;background:linear-gradient(135deg,#336791,#4d8fc4);border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:12px;color:#fff;font-family:monospace}
.brand-name{font-weight:800;font-size:14px}
.brand-sub{font-size:10px;color:#484f58;background:#21262d;padding:2px 7px;border-radius:99px;border:1px solid #30363d;font-family:monospace}
.topbar-right{display:flex;align-items:center;gap:10px;font-size:12px}
.rows-badge{color:#3fb950;font-family:monospace;font-size:11px}
.btn-sm{padding:4px 12px;background:none;border:1px solid #30363d;border-radius:4px;color:#8b949e;font-size:11px;transition:all .12s}
.btn-sm:hover{color:#e6edf3;border-color:#8b949e}

.layout{display:grid;grid-template-columns:210px 1fr 260px;flex:1;overflow:hidden}

.sidebar{background:#161b22;border-right:1px solid #30363d;overflow-y:auto;padding:8px 0}
.group-title{font-size:10px;font-weight:700;letter-spacing:1.2px;color:#484f58;padding:10px 12px 4px;text-transform:uppercase}
.qb{display:block;width:100%;padding:7px 12px;background:none;border:none;border-left:2px solid transparent;color:#8b949e;text-align:left;font-size:11.5px;font-family:monospace;transition:all .12s}
.qb:hover{background:#21262d;color:#e6edf3}
.qb.active{background:#161b22;border-left-color:#4d8fc4;color:#e6edf3}

.main{display:flex;flex-direction:column;overflow:hidden;border-right:1px solid #30363d}

.query-box{padding:14px;border-bottom:1px solid #30363d;flex-shrink:0}
.query-label{font-size:10px;font-weight:700;letter-spacing:1px;color:#484f58;margin-bottom:6px}
.sql-pre{background:#161b22;border:1px solid #30363d;border-radius:6px;padding:12px 14px;font-family:monospace;font-size:12.5px;color:#a5d6ff;white-space:pre-wrap;line-height:1.6;margin-bottom:10px}
.param-row{display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap}
.param-row label{font-size:11px;color:#8b949e;font-family:monospace}
.param-row input{padding:5px 9px;background:#21262d;border:1px solid #30363d;border-radius:4px;color:#e6edf3;font-size:12px;font-family:monospace;outline:none;width:140px}
.param-row input:focus{border-color:#4d8fc4}
.btn-run{padding:8px 20px;background:#238636;color:#fff;border:none;border-radius:5px;font-size:13px;font-weight:700;transition:background .15s}
.btn-run:hover{background:#2ea043}

.result-box{flex:1;display:flex;flex-direction:column;padding:14px;overflow:hidden;min-height:0}
.result-top{display:flex;align-items:center;gap:10px;margin-bottom:8px;flex-shrink:0}
.result-label{font-size:10px;font-weight:700;letter-spacing:1px;color:#484f58}
.time-label{font-size:11px;color:#484f58;font-family:monospace}
.result-out{flex:1;overflow:auto;font-size:12px;color:#8b949e}

table.rt{width:100%;border-collapse:collapse;font-family:monospace;font-size:12px}
table.rt th{text-align:left;padding:7px 12px;background:#161b22;color:#4d8fc4;border-bottom:1px solid #30363d;position:sticky;top:0}
table.rt td{padding:7px 12px;border-bottom:1px solid #21262d;color:#e6edf3}
table.rt tr:hover td{background:#161b22}
.empty-msg{padding:20px;color:#484f58;text-align:center}

.docs{background:#161b22;overflow-y:auto;padding:8px 0}
.docs-body{padding:4px 14px 14px;font-size:12px;color:#8b949e;line-height:1.7}
.docs-body h4{color:#e6edf3;font-size:12px;font-weight:700;margin:10px 0 4px}
.docs-body p{margin-bottom:6px}
.docs-body code{background:#0d1117;border:1px solid #30363d;border-radius:3px;padding:1px 5px;font-family:monospace;font-size:11px;color:#a5d6ff}

@media(max-width:900px){.layout{grid-template-columns:180px 1fr}.docs{display:none}}`;

const scriptJs = `'use strict';

// ================================================================
// IN-MEMORY DATABASE (mutable for this session)
// ================================================================
var seedCustomers = [
  {id:1, name:'Ada Lovelace',    email:'ada@example.com',    city:'Pune'},
  {id:2, name:'Sam Okafor',      email:'sam@example.com',    city:'Lagos'},
  {id:3, name:'Priya Sharma',    email:'priya@example.com',  city:'Pune'},
  {id:4, name:'Marcus Chen',     email:'marcus@example.com', city:'Singapore'},
  {id:5, name:'Elena Petrova',   email:'elena@example.com',  city:'Berlin'}
];

var seedOrders = [
  {id:101, customer_id:1, total:49.99,  status:'shipped',   created_at:'2026-01-05'},
  {id:102, customer_id:1, total:120.00, status:'shipped',   created_at:'2026-02-14'},
  {id:103, customer_id:2, total:15.50,  status:'pending',   created_at:'2026-02-20'},
  {id:104, customer_id:3, total:89.00,  status:'shipped',   created_at:'2026-03-01'},
  {id:105, customer_id:3, total:32.25,  status:'cancelled', created_at:'2026-03-10'},
  {id:106, customer_id:4, total:210.00, status:'shipped',   created_at:'2026-03-15'}
  // customer 5 (Elena) has no orders on purpose -> good for LEFT JOIN
];

var DB = { customers: [], orders: [], nextCustomerId: 6 };

function resetData() {
  DB.customers = seedCustomers.map(function(c){ return Object.assign({}, c); });
  DB.orders = seedOrders.map(function(o){ return Object.assign({}, o); });
  DB.nextCustomerId = 6;
}
resetData();

// ================================================================
// QUERY DEFINITIONS
// ================================================================
var QUERIES = {
  selectAll: {
    sql: 'SELECT * FROM customers;',
    params: [],
    run: function() {
      return { rows: DB.customers.slice() };
    }
  },
  whereFilter: {
    sql: "SELECT * FROM customers WHERE city = '{{city}}';",
    params: [{ key:'city', label:'city', type:'text', default:'Pune' }],
    run: function(p) {
      var city = p.city || '';
      var rows = DB.customers.filter(function(c){ return c.city.toLowerCase() === city.toLowerCase(); });
      return { rows: rows };
    }
  },
  orderLimit: {
    sql: 'SELECT * FROM orders ORDER BY total DESC LIMIT {{limit}};',
    params: [{ key:'limit', label:'limit', type:'number', default:3 }],
    run: function(p) {
      var n = Math.max(1, parseInt(p.limit, 10) || 3);
      var rows = DB.orders.slice().sort(function(a,b){ return b.total - a.total; }).slice(0, n);
      return { rows: rows };
    }
  },
  insertReturning: {
    sql: "INSERT INTO customers (name, email, city)\\nVALUES ('{{name}}', '{{email}}', '{{city}}')\\nRETURNING id, name;",
    params: [
      { key:'name', label:'name', type:'text', default:'New Customer' },
      { key:'email', label:'email', type:'text', default:'new@example.com' },
      { key:'city', label:'city', type:'text', default:'Mumbai' }
    ],
    run: function(p) {
      var row = { id: DB.nextCustomerId++, name: p.name, email: p.email, city: p.city };
      DB.customers.push(row);
      return { rows: [{ id: row.id, name: row.name }], affected: 1 };
    }
  },
  updateSet: {
    sql: "UPDATE customers SET city = '{{city}}'\\nWHERE id = {{id}}\\nRETURNING *;",
    params: [
      { key:'id', label:'id', type:'number', default:2 },
      { key:'city', label:'new city', type:'text', default:'Mumbai' }
    ],
    run: function(p) {
      var id = parseInt(p.id, 10);
      var row = DB.customers.find(function(c){ return c.id === id; });
      if (!row) return { rows: [], affected: 0 };
      row.city = p.city;
      return { rows: [Object.assign({}, row)], affected: 1 };
    }
  },
  deleteWhere: {
    sql: "DELETE FROM orders WHERE status = 'cancelled'\\nRETURNING id;",
    params: [],
    run: function() {
      var removed = DB.orders.filter(function(o){ return o.status === 'cancelled'; });
      DB.orders = DB.orders.filter(function(o){ return o.status !== 'cancelled'; });
      return { rows: removed.map(function(o){ return { id: o.id }; }), affected: removed.length };
    }
  },
  innerJoin: {
    sql: 'SELECT c.name, o.id AS order_id, o.total\\nFROM customers c\\nINNER JOIN orders o ON o.customer_id = c.id;',
    params: [],
    run: function() {
      var rows = [];
      DB.orders.forEach(function(o) {
        var c = DB.customers.find(function(c){ return c.id === o.customer_id; });
        if (c) rows.push({ name: c.name, order_id: o.id, total: o.total });
      });
      return { rows: rows };
    }
  },
  leftJoin: {
    sql: 'SELECT c.name, o.total\\nFROM customers c\\nLEFT JOIN orders o ON o.customer_id = c.id;',
    params: [],
    run: function() {
      var rows = [];
      DB.customers.forEach(function(c) {
        var matches = DB.orders.filter(function(o){ return o.customer_id === c.id; });
        if (matches.length === 0) {
          rows.push({ name: c.name, total: null });
        } else {
          matches.forEach(function(o){ rows.push({ name: c.name, total: o.total }); });
        }
      });
      return { rows: rows };
    }
  },
  groupHaving: {
    sql: 'SELECT c.name, COUNT(*) AS order_count, SUM(o.total) AS spent\\nFROM customers c\\nJOIN orders o ON o.customer_id = c.id\\nGROUP BY c.name\\nHAVING SUM(o.total) > 50\\nORDER BY spent DESC;',
    params: [],
    run: function() {
      var totals = {};
      DB.orders.forEach(function(o) {
        var c = DB.customers.find(function(c){ return c.id === o.customer_id; });
        if (!c) return;
        if (!totals[c.name]) totals[c.name] = { name: c.name, order_count: 0, spent: 0 };
        totals[c.name].order_count++;
        totals[c.name].spent += o.total;
      });
      var rows = Object.keys(totals).map(function(k){ return totals[k]; })
        .filter(function(r){ return r.spent > 50; })
        .sort(function(a,b){ return b.spent - a.spent; })
        .map(function(r){ return { name:r.name, order_count:r.order_count, spent: Math.round(r.spent*100)/100 }; });
      return { rows: rows };
    }
  },
  windowRank: {
    sql: 'SELECT name, spent,\\n  RANK() OVER (ORDER BY spent DESC) AS rank\\nFROM (\\n  SELECT c.name, SUM(o.total) AS spent\\n  FROM customers c JOIN orders o ON o.customer_id = c.id\\n  GROUP BY c.name\\n) totals;',
    params: [],
    run: function() {
      var totals = {};
      DB.orders.forEach(function(o) {
        var c = DB.customers.find(function(c){ return c.id === o.customer_id; });
        if (!c) return;
        totals[c.name] = (totals[c.name] || 0) + o.total;
      });
      var list = Object.keys(totals).map(function(k){ return { name:k, spent: Math.round(totals[k]*100)/100 }; })
        .sort(function(a,b){ return b.spent - a.spent; });
      var rank = 0, lastSpent = null, rows = [];
      list.forEach(function(row, i) {
        if (row.spent !== lastSpent) { rank = i + 1; lastSpent = row.spent; }
        rows.push({ name: row.name, spent: row.spent, rank: rank });
      });
      return { rows: rows };
    }
  },
  ilikeSearch: {
    sql: "SELECT * FROM customers WHERE name ILIKE '%{{term}}%';",
    params: [{ key:'term', label:'search term', type:'text', default:'ar' }],
    run: function(p) {
      var term = (p.term || '').toLowerCase();
      var rows = DB.customers.filter(function(c){ return c.name.toLowerCase().indexOf(term) !== -1; });
      return { rows: rows };
    }
  }
};

var DOCS = {
  selectAll: { title:'SELECT *', desc:'Returns every column for every row in the <code>customers</code> table. <code>*</code> means "all columns" — fine for exploring, but in real application code it is better to name the columns you actually need.' },
  whereFilter: { title:'WHERE clause', desc:'Filters rows before they are returned. Only rows where <code>city</code> exactly matches the value survive. Try changing the city field and running again — including a city with no matching customers, to see an empty result.' },
  orderLimit: { title:'ORDER BY ... LIMIT', desc:'<code>ORDER BY total DESC</code> sorts the largest orders first. <code>LIMIT</code> caps how many rows come back — a very common pattern for "top N" results like a leaderboard or a most-recent-items list.' },
  insertReturning: { title:'INSERT ... RETURNING', desc:'Creates a new row. <code>RETURNING</code> is a PostgreSQL feature that hands back the columns you ask for from the row that was just inserted, in the same round trip — no separate SELECT needed to get the generated id.' },
  updateSet: { title:'UPDATE ... SET ... RETURNING', desc:'Modifies existing rows matching the WHERE clause. <code>RETURNING *</code> returns every column of the updated row, so the caller can see exactly what the row looks like now.' },
  deleteWhere: { title:'DELETE ... RETURNING', desc:'Removes rows matching the condition. RETURNING here shows which rows were actually deleted — useful for confirming exactly what a DELETE affected, especially in application code.' },
  innerJoin: { title:'INNER JOIN', desc:'Combines rows from two tables where the join condition matches. A customer with no orders will not appear at all — INNER JOIN only returns rows that have a match on both sides.' },
  leftJoin: { title:'LEFT JOIN', desc:'Keeps every row from the left table (customers), even when there is no matching order — Elena Petrova appears with <code>total: null</code> since she has no orders. Compare this to INNER JOIN, which would drop her entirely.' },
  groupHaving: { title:'GROUP BY ... HAVING', desc:'Groups orders by customer and computes a SUM per group. HAVING then filters those groups — note this happens after grouping, unlike WHERE which filters rows before grouping and cannot reference SUM() directly.' },
  windowRank: { title:'Window function: RANK()', desc:'Unlike GROUP BY, a window function keeps every row while still computing an aggregate-like value across a set of rows. <code>RANK() OVER (ORDER BY spent DESC)</code> ranks each customer by total spend without collapsing the result into one row per group.' },
  ilikeSearch: { title:'ILIKE (case-insensitive)', desc:'PostgreSQL-specific: like <code>LIKE</code>, but case-insensitive. <code>%</code> matches any sequence of characters, so this finds any name containing the search term anywhere, regardless of capitalization.' }
};

// ================================================================
// STATE / INIT
// ================================================================
var currentKey = 'selectAll';

(function init() {
  document.querySelectorAll('.qb').forEach(function(btn) {
    btn.addEventListener('click', function() { selectQuery(this.dataset.key); });
  });
  document.getElementById('btnRun').addEventListener('click', runCurrent);
  document.getElementById('btnReset').addEventListener('click', function() {
    resetData();
    document.getElementById('rowsAffected').textContent = 'data reset';
    setTimeout(function(){ document.getElementById('rowsAffected').textContent = ''; }, 1500);
    runCurrent();
  });
  selectQuery('selectAll');
}());

function selectQuery(key) {
  currentKey = key;
  document.querySelectorAll('.qb').forEach(function(b) {
    b.classList.toggle('active', b.dataset.key === key);
  });

  var q = QUERIES[key];
  renderParams(q);
  renderSql(q);
  renderDocs(key);
  runCurrent();
}

function renderSql(q) {
  var text = q.sql;
  q.params.forEach(function(p) {
    var val = currentParamValue(p);
    text = text.split('{{' + p.key + '}}').join(String(val));
  });
  document.getElementById('sqlText').textContent = text;
}

function currentParamValue(p) {
  var input = document.getElementById('param-' + p.key);
  return input ? input.value : p.default;
}

function renderParams(q) {
  var row = document.getElementById('paramRow');
  row.innerHTML = '';
  q.params.forEach(function(p) {
    var label = document.createElement('label');
    label.textContent = p.label + ':';
    var input = document.createElement('input');
    input.type = p.type === 'number' ? 'number' : 'text';
    input.id = 'param-' + p.key;
    input.value = p.default;
    input.addEventListener('input', function() { renderSql(q); });
    row.appendChild(label);
    row.appendChild(input);
  });
}

function runCurrent() {
  var q = QUERIES[currentKey];
  var params = {};
  q.params.forEach(function(p) { params[p.key] = currentParamValue(p); });

  var t0 = Date.now();
  var result = q.run(params);
  var ms = Date.now() - t0;

  document.getElementById('timeLabel').textContent = ms + 'ms · ' + result.rows.length + ' row' + (result.rows.length === 1 ? '' : 's');
  if (typeof result.affected === 'number') {
    document.getElementById('rowsAffected').textContent = result.affected + ' row' + (result.affected === 1 ? '' : 's') + ' affected';
  } else {
    document.getElementById('rowsAffected').textContent = '';
  }

  renderTable(result.rows);
}

function renderTable(rows) {
  var out = document.getElementById('resultOut');
  if (!rows.length) {
    out.innerHTML = '<div class="empty-msg">Query returned 0 rows.</div>';
    return;
  }
  var cols = Object.keys(rows[0]);
  var html = '<table class="rt"><thead><tr>';
  cols.forEach(function(c) { html += '<th>' + c + '</th>'; });
  html += '</tr></thead><tbody>';
  rows.forEach(function(r) {
    html += '<tr>';
    cols.forEach(function(c) {
      var v = r[c];
      html += '<td>' + (v === null || v === undefined ? '<em>NULL</em>' : String(v)) + '</td>';
    });
    html += '</tr>';
  });
  html += '</tbody></table>';
  out.innerHTML = html;
}

function renderDocs(key) {
  var d = DOCS[key];
  var el = document.getElementById('docsBox');
  if (!d) { el.innerHTML = ''; return; }
  el.innerHTML = '<h4>' + d.title + '</h4><p>' + d.desc + '</p>';
}`;

export const postgresqlQueryLabProject: Project = {
  id: 'postgresql-query-lab',
  slug: 'postgresql-query-lab',
  title: 'PostgreSQL Query Lab',
  difficulty: 'intermediate',
  type: 'frontend',
  estimatedTime: '6-9 hours',
  playgroundKey: 'postgresql-query-lab',
  description: 'Build an interactive SQL query console that simulates a real PostgreSQL database in the browser — filtering, joins, aggregation, RETURNING, window functions and ILIKE, all backed by genuine query logic over an in-memory dataset.',
  overview: 'This project gives you a hands-on sandbox for practicing real SQL and PostgreSQL-specific syntax without installing a database. Each query in the sidebar shows its real SQL text and runs genuine logic (filtering, joining, grouping, ranking) against a small, realistic customers-and-orders dataset — including live-editable parameters, so changing a filter value actually changes the result, the same way it would against a real database.',
  objective: 'Build an interactive query console with a curated set of real SQL queries — from basic SELECT and WHERE through JOINs, GROUP BY/HAVING, and PostgreSQL-specific features like RETURNING, window functions and ILIKE — each backed by correct, live logic over a shared in-memory dataset.',
  technologies: ['HTML', 'CSS', 'JavaScript', 'PostgreSQL', 'SQL'],
  prerequisites: ['JavaScript fundamentals (array methods: filter, map, sort, reduce)', 'Basic SQL (SELECT, WHERE, JOIN)', 'DOM manipulation'],
  learnings: [
    'Translating SQL query semantics into real JavaScript logic',
    'The difference between INNER JOIN and LEFT JOIN, demonstrated with a customer that has no orders',
    'How GROUP BY and HAVING interact, and why HAVING can filter on an aggregate when WHERE cannot',
    'What RETURNING does on INSERT/UPDATE/DELETE, and why it saves a round trip',
    'How a window function like RANK() differs from GROUP BY — every row stays, instead of collapsing into groups',
    'Building a small, stateful in-memory "database" that persists changes across queries within a session',
    'Rendering tabular data dynamically from an array of objects with unknown column sets',
  ],
  features: [
    '11 real SQL queries across five categories: basics, writing data, joins, aggregation, and PostgreSQL-specific features',
    'Live-editable query parameters (city, search term, limit, id) that actually change the result when changed',
    'INSERT, UPDATE and DELETE genuinely mutate the in-memory dataset for the rest of the session',
    'A Reset data button to restore the original seed dataset at any time',
    'Real LEFT JOIN behavior showing a customer with no orders as NULL',
    'A RANK() window function example ranking customers by total spend',
    'Per-query explanation panel describing what the SQL actually does and why',
    'Dark, database-console-inspired UI with a results table and row-affected/timing feedback',
  ],
  fileStructure: 'postgresql-query-lab/ |   index.html |   style.css |   script.js',
  files: [
    { path: 'postgresql-query-lab/index.html', language: 'html',       content: indexHtml },
    { path: 'postgresql-query-lab/style.css',  language: 'css',        content: styleCss  },
    { path: 'postgresql-query-lab/script.js',  language: 'javascript', content: scriptJs  },
  ],
  lessons: [
    {
      id: 'query-as-data',
      title: 'Modeling a SQL Query as Data',
      explanation: 'Each query in this project is an object with its SQL text, its parameters, and a run() function that computes the real result. This "query as data" approach — rather than one giant if/else chain — is what makes it easy to add new queries without touching the rendering code at all.',
      js: `var QUERIES = {
  selectAll: {
    sql: 'SELECT * FROM customers;',
    params: [],
    run: function() {
      return { rows: DB.customers.slice() };
    }
  },
  whereFilter: {
    sql: "SELECT * FROM customers WHERE city = '{{city}}';",
    params: [{ key: 'city', label: 'city', type: 'text', default: 'Pune' }],
    run: function(p) {
      return {
        rows: DB.customers.filter(function(c) {
          return c.city.toLowerCase() === p.city.toLowerCase();
        })
      };
    }
  }
};`,
    },
    {
      id: 'join-logic',
      title: 'Implementing INNER JOIN vs LEFT JOIN in Plain JavaScript',
      explanation: 'An INNER JOIN only keeps rows that have a match on both sides — so it loops over the "many" side (orders) and looks up each one\'s customer. A LEFT JOIN loops over the "one" side (customers) instead, and includes a row even when there is no matching order, with null in place of the missing data.',
      js: `// INNER JOIN: loop over orders, look up each customer
function innerJoin() {
  var rows = [];
  DB.orders.forEach(function(o) {
    var c = DB.customers.find(function(c) { return c.id === o.customer_id; });
    if (c) rows.push({ name: c.name, total: o.total });
  });
  return rows;
}

// LEFT JOIN: loop over customers, keep them even with 0 matches
function leftJoin() {
  var rows = [];
  DB.customers.forEach(function(c) {
    var matches = DB.orders.filter(function(o) { return o.customer_id === c.id; });
    if (matches.length === 0) {
      rows.push({ name: c.name, total: null }); // no orders -> NULL
    } else {
      matches.forEach(function(o) { rows.push({ name: c.name, total: o.total }); });
    }
  });
  return rows;
}`,
    },
    {
      id: 'group-by-having',
      title: 'Implementing GROUP BY with an Aggregate and HAVING',
      explanation: 'GROUP BY collapses many rows into one row per unique key, while accumulating a running total. HAVING then filters those already-grouped rows — which is why HAVING can check a SUM() and WHERE cannot: WHERE runs before grouping even happens.',
      js: `function groupByCustomerHaving(minSpent) {
  var totals = {};
  DB.orders.forEach(function(o) {
    var c = DB.customers.find(function(c) { return c.id === o.customer_id; });
    if (!c) return;
    if (!totals[c.name]) totals[c.name] = { name: c.name, spent: 0 };
    totals[c.name].spent += o.total;
  });

  // HAVING: filter the GROUPED rows, after aggregation
  return Object.values(totals).filter(function(row) {
    return row.spent > minSpent;
  });
}`,
    },
    {
      id: 'returning-clause',
      title: 'Simulating RETURNING on INSERT/UPDATE/DELETE',
      explanation: 'RETURNING is a real PostgreSQL feature: it hands back specific columns from the row(s) a write statement just touched, in the same round trip. Simulating it just means returning the affected row (or the fields the query asked for) from the same function that performed the write.',
      js: `function insertCustomer(name, email, city) {
  var row = { id: DB.nextCustomerId++, name: name, email: email, city: city };
  DB.customers.push(row); // the actual write

  // RETURNING id, name -- hand back just those two fields
  return { id: row.id, name: row.name };
}

function deleteCancelledOrders() {
  var removed = DB.orders.filter(function(o) { return o.status === 'cancelled'; });
  DB.orders = DB.orders.filter(function(o) { return o.status !== 'cancelled'; });

  // RETURNING id -- hand back the ids that were actually deleted
  return removed.map(function(o) { return { id: o.id }; });
}`,
    },
    {
      id: 'window-function',
      title: 'Implementing a Simple RANK() Window Function',
      explanation: 'Unlike GROUP BY, a window function does not collapse rows — every customer stays in the result, each with a computed rank. Implementing RANK() means sorting by the value first, then walking through in order and only incrementing the rank when the value actually changes (so ties share the same rank).',
      js: `function rankBySpend(totals) {
  // totals: [{ name, spent }, ...] already sorted descending by spent
  var rank = 0, lastSpent = null, rows = [];

  totals.forEach(function(row, i) {
    if (row.spent !== lastSpent) {
      rank = i + 1;      // only advance the rank when the value changes
      lastSpent = row.spent;
    }
    rows.push({ name: row.name, spent: row.spent, rank: rank });
  });

  return rows;
}`,
    },
  ],
  challenges: [
    {
      id: 'add-count-query',
      title: 'Add a "count orders by status" query',
      difficulty: 'easy',
      description: 'Add a new query, groupByStatus, showing SELECT status, COUNT(*) FROM orders GROUP BY status; — group the orders array by their status field and count how many fall into each group.',
      hint: 'Loop over DB.orders, build an object keyed by status incrementing a counter, then convert that object into an array of { status, count } rows with Object.keys() or Object.values().',
      solutionJs: `groupByStatus: {
  sql: 'SELECT status, COUNT(*) AS count\\nFROM orders\\nGROUP BY status;',
  params: [],
  run: function() {
    var counts = {};
    DB.orders.forEach(function(o) {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    var rows = Object.keys(counts).map(function(status) {
      return { status: status, count: counts[status] };
    });
    return { rows: rows };
  }
}

// Also add a matching entry to DOCS.groupByStatus, and a
// <button class="qb" data-key="groupByStatus">...</button> in the sidebar.`,
    },
    {
      id: 'add-min-total-filter',
      title: 'Add a live minimum-total filter to orderLimit',
      difficulty: 'medium',
      description: 'Extend the "ORDER BY ... LIMIT" query with a second, live-editable parameter: a minimum total. Only orders with total >= that value should be included before sorting and limiting.',
      hint: 'Add a second entry to orderLimit.params (key: "minTotal", type: "number", default: 0), then filter DB.orders by total >= minTotal before sorting in run().',
      solutionJs: `orderLimit: {
  sql: 'SELECT * FROM orders\\nWHERE total >= {{minTotal}}\\nORDER BY total DESC\\nLIMIT {{limit}};',
  params: [
    { key: 'minTotal', label: 'min total', type: 'number', default: 0 },
    { key: 'limit', label: 'limit', type: 'number', default: 3 }
  ],
  run: function(p) {
    var min = parseFloat(p.minTotal) || 0;
    var n = Math.max(1, parseInt(p.limit, 10) || 3);
    var rows = DB.orders
      .filter(function(o) { return o.total >= min; })
      .sort(function(a, b) { return b.total - a.total; })
      .slice(0, n);
    return { rows: rows };
  }
}`,
    },
    {
      id: 'add-transaction-simulation',
      title: 'Simulate a two-step transaction with rollback on failure',
      difficulty: 'hard',
      description: 'Add a "transfer" query that moves a customer\'s most recent order to a different customer (updating its customer_id), but only if the target customer actually exists — otherwise nothing should change at all, simulating a transaction that rolls back on failure.',
      hint: 'Before mutating anything, validate that the target customer id exists in DB.customers. Only mutate DB.orders after that check passes — this "check first, then commit" pattern is exactly what BEGIN/COMMIT/ROLLBACK guarantees for real, concurrent transactions.',
      solutionJs: `transferOrder: {
  sql: 'BEGIN;\\nUPDATE orders SET customer_id = {{toId}}\\nWHERE id = {{orderId}};\\nCOMMIT;',
  params: [
    { key: 'orderId', label: 'order id', type: 'number', default: 101 },
    { key: 'toId', label: 'to customer id', type: 'number', default: 2 }
  ],
  run: function(p) {
    var orderId = parseInt(p.orderId, 10);
    var toId = parseInt(p.toId, 10);

    // Validate BEFORE mutating anything -- this is the "transaction" guarantee
    var targetExists = DB.customers.some(function(c) { return c.id === toId; });
    var order = DB.orders.find(function(o) { return o.id === orderId; });

    if (!targetExists || !order) {
      // Nothing was changed -- equivalent to a ROLLBACK
      return { rows: [], affected: 0 };
    }

    order.customer_id = toId; // the only mutation, and only after validation passed
    return { rows: [Object.assign({}, order)], affected: 1 };
  }
}`,
    },
  ],
};
