import type { Project } from './types';

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SQL Fundamentals Explorer</title>
<link rel="stylesheet" href="style.css">
</head>
<body>

<div id="app">

  <header class="topbar">
    <div class="topbar-left">
      <div class="brand-icon">SQL</div>
      <span class="brand-name">SQL Fundamentals Explorer</span>
      <span class="brand-sub">library_db</span>
    </div>
    <div class="topbar-right">
      <span id="rowsAffected" class="rows-badge"></span>
    </div>
  </header>

  <div class="layout">

    <aside class="sidebar">
      <div class="group-title">BASICS</div>
      <button class="qb" data-key="selectWhere">SELECT ... WHERE</button>
      <button class="qb" data-key="distinctGenres">SELECT DISTINCT</button>
      <button class="qb" data-key="likeSearch">LIKE pattern match</button>

      <div class="group-title">JOINS</div>
      <button class="qb" data-key="authorBooks">Two-table JOIN</button>
      <button class="qb" data-key="threeWayJoin">Three-table JOIN</button>

      <div class="group-title">SUBQUERIES</div>
      <button class="qb" data-key="neverBorrowed">NOT IN subquery</button>
      <button class="qb" data-key="existsSubquery">EXISTS subquery</button>

      <div class="group-title">SET OPERATIONS</div>
      <button class="qb" data-key="unionQuery">UNION</button>

      <div class="group-title">AGGREGATION</div>
      <button class="qb" data-key="mostBorrowed">GROUP BY ... ORDER BY</button>
      <button class="qb" data-key="notReturned">IS NULL</button>
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
.brand-icon{width:34px;height:30px;background:linear-gradient(135deg,#d97706,#f59e0b);border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:11px;color:#fff;font-family:monospace}
.brand-name{font-weight:800;font-size:14px}
.brand-sub{font-size:10px;color:#484f58;background:#21262d;padding:2px 7px;border-radius:99px;border:1px solid #30363d;font-family:monospace}
.topbar-right{display:flex;align-items:center;gap:10px;font-size:12px}
.rows-badge{color:#3fb950;font-family:monospace;font-size:11px}

.layout{display:grid;grid-template-columns:210px 1fr 260px;flex:1;overflow:hidden}

.sidebar{background:#161b22;border-right:1px solid #30363d;overflow-y:auto;padding:8px 0}
.group-title{font-size:10px;font-weight:700;letter-spacing:1.2px;color:#484f58;padding:10px 12px 4px;text-transform:uppercase}
.qb{display:block;width:100%;padding:7px 12px;background:none;border:none;border-left:2px solid transparent;color:#8b949e;text-align:left;font-size:11.5px;font-family:monospace;transition:all .12s}
.qb:hover{background:#21262d;color:#e6edf3}
.qb.active{background:#161b22;border-left-color:#f59e0b;color:#e6edf3}

.main{display:flex;flex-direction:column;overflow:hidden;border-right:1px solid #30363d}

.query-box{padding:14px;border-bottom:1px solid #30363d;flex-shrink:0}
.query-label{font-size:10px;font-weight:700;letter-spacing:1px;color:#484f58;margin-bottom:6px}
.sql-pre{background:#161b22;border:1px solid #30363d;border-radius:6px;padding:12px 14px;font-family:monospace;font-size:12.5px;color:#ffd699;white-space:pre-wrap;line-height:1.6;margin-bottom:10px}
.param-row{display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap}
.param-row label{font-size:11px;color:#8b949e;font-family:monospace}
.param-row input{padding:5px 9px;background:#21262d;border:1px solid #30363d;border-radius:4px;color:#e6edf3;font-size:12px;font-family:monospace;outline:none;width:140px}
.param-row input:focus{border-color:#f59e0b}
.btn-run{padding:8px 20px;background:#238636;color:#fff;border:none;border-radius:5px;font-size:13px;font-weight:700;transition:background .15s}
.btn-run:hover{background:#2ea043}

.result-box{flex:1;display:flex;flex-direction:column;padding:14px;overflow:hidden;min-height:0}
.result-top{display:flex;align-items:center;gap:10px;margin-bottom:8px;flex-shrink:0}
.result-label{font-size:10px;font-weight:700;letter-spacing:1px;color:#484f58}
.time-label{font-size:11px;color:#484f58;font-family:monospace}
.result-out{flex:1;overflow:auto;font-size:12px;color:#8b949e}

table.rt{width:100%;border-collapse:collapse;font-family:monospace;font-size:12px}
table.rt th{text-align:left;padding:7px 12px;background:#161b22;color:#f59e0b;border-bottom:1px solid #30363d;position:sticky;top:0}
table.rt td{padding:7px 12px;border-bottom:1px solid #21262d;color:#e6edf3}
table.rt tr:hover td{background:#161b22}
.empty-msg{padding:20px;color:#484f58;text-align:center}

.docs{background:#161b22;overflow-y:auto;padding:8px 0}
.docs-body{padding:4px 14px 14px;font-size:12px;color:#8b949e;line-height:1.7}
.docs-body h4{color:#e6edf3;font-size:12px;font-weight:700;margin:10px 0 4px}
.docs-body p{margin-bottom:6px}
.docs-body code{background:#0d1117;border:1px solid #30363d;border-radius:3px;padding:1px 5px;font-family:monospace;font-size:11px;color:#ffd699}

@media(max-width:900px){.layout{grid-template-columns:180px 1fr}.docs{display:none}}`;

const scriptJs = `'use strict';

// ================================================================
// IN-MEMORY DATABASE (read-only demo data — a small library system)
// ================================================================
var DB = {
  authors: [
    {id:1, name:'George Orwell'},
    {id:2, name:'Jane Austen'},
    {id:3, name:'Agatha Christie'}
  ],
  books: [
    {id:1, title:'1984', author_id:1, genre:'Fiction', available:true},
    {id:2, title:'Animal Farm', author_id:1, genre:'Fiction', available:true},
    {id:3, title:'Pride and Prejudice', author_id:2, genre:'Romance', available:true},
    {id:4, title:'Murder on the Orient Express', author_id:3, genre:'Mystery', available:false},
    {id:5, title:'And Then There Were None', author_id:3, genre:'Mystery', available:true}
  ],
  borrowers: [
    {id:1, name:'Ravi Kumar'},
    {id:2, name:'Meera Nair'},
    {id:3, name:'Chidi Okeke'},
    {id:4, name:'Aisha Bello'}
  ],
  loans: [
    {id:1, book_id:1, borrower_id:1, loan_date:'2026-01-05', return_date:'2026-01-20'},
    {id:2, book_id:1, borrower_id:2, loan_date:'2026-02-01', return_date:null},
    {id:3, book_id:4, borrower_id:1, loan_date:'2026-01-10', return_date:null},
    {id:4, book_id:2, borrower_id:3, loan_date:'2026-02-10', return_date:'2026-02-20'}
    // Aisha Bello (borrower 4) has never taken out a loan — good for the EXISTS example.
    // Pride and Prejudice (book 3) has never been borrowed — good for the NOT IN example.
  ]
};

// ================================================================
// QUERY DEFINITIONS
// ================================================================
var QUERIES = {
  selectWhere: {
    sql: 'SELECT title, genre\\nFROM books\\nWHERE available = true;',
    params: [],
    run: function() {
      return { rows: DB.books.filter(function(b){ return b.available; }).map(function(b){ return { title: b.title, genre: b.genre }; }) };
    }
  },
  distinctGenres: {
    sql: 'SELECT DISTINCT genre FROM books;',
    params: [],
    run: function() {
      var seen = {}, rows = [];
      DB.books.forEach(function(b) {
        if (!seen[b.genre]) { seen[b.genre] = true; rows.push({ genre: b.genre }); }
      });
      return { rows: rows };
    }
  },
  likeSearch: {
    sql: "SELECT title FROM books WHERE title LIKE '%{{term}}%';",
    params: [{ key:'term', label:'search term', type:'text', default:'an' }],
    run: function(p) {
      var term = (p.term || '').toLowerCase();
      var rows = DB.books.filter(function(b){ return b.title.toLowerCase().indexOf(term) !== -1; })
        .map(function(b){ return { title: b.title }; });
      return { rows: rows };
    }
  },
  authorBooks: {
    sql: 'SELECT a.name AS author, b.title\\nFROM authors a\\nJOIN books b ON b.author_id = a.id\\nORDER BY a.name;',
    params: [],
    run: function() {
      var rows = [];
      DB.books.forEach(function(b) {
        var a = DB.authors.find(function(a){ return a.id === b.author_id; });
        if (a) rows.push({ author: a.name, title: b.title });
      });
      rows.sort(function(x,y){ return x.author.localeCompare(y.author); });
      return { rows: rows };
    }
  },
  threeWayJoin: {
    sql: 'SELECT b.title, br.name AS borrower, l.loan_date\\nFROM loans l\\nJOIN books b ON b.id = l.book_id\\nJOIN borrowers br ON br.id = l.borrower_id;',
    params: [],
    run: function() {
      var rows = [];
      DB.loans.forEach(function(l) {
        var b = DB.books.find(function(b){ return b.id === l.book_id; });
        var br = DB.borrowers.find(function(br){ return br.id === l.borrower_id; });
        if (b && br) rows.push({ title: b.title, borrower: br.name, loan_date: l.loan_date });
      });
      return { rows: rows };
    }
  },
  neverBorrowed: {
    sql: 'SELECT title FROM books\\nWHERE id NOT IN (SELECT book_id FROM loans);',
    params: [],
    run: function() {
      var borrowedIds = {};
      DB.loans.forEach(function(l){ borrowedIds[l.book_id] = true; });
      var rows = DB.books.filter(function(b){ return !borrowedIds[b.id]; }).map(function(b){ return { title: b.title }; });
      return { rows: rows };
    }
  },
  existsSubquery: {
    sql: 'SELECT name FROM borrowers br\\nWHERE EXISTS (\\n  SELECT 1 FROM loans l WHERE l.borrower_id = br.id\\n);',
    params: [],
    run: function() {
      var rows = DB.borrowers.filter(function(br) {
        return DB.loans.some(function(l){ return l.borrower_id === br.id; });
      }).map(function(br){ return { name: br.name }; });
      return { rows: rows };
    }
  },
  unionQuery: {
    sql: "SELECT name, 'author' AS role FROM authors\\nUNION\\nSELECT name, 'borrower' AS role FROM borrowers;",
    params: [],
    run: function() {
      var rows = DB.authors.map(function(a){ return { name: a.name, role: 'author' }; })
        .concat(DB.borrowers.map(function(br){ return { name: br.name, role: 'borrower' }; }));
      return { rows: rows };
    }
  },
  mostBorrowed: {
    sql: 'SELECT b.title, COUNT(*) AS times_borrowed\\nFROM loans l\\nJOIN books b ON b.id = l.book_id\\nGROUP BY b.title\\nORDER BY times_borrowed DESC;',
    params: [],
    run: function() {
      var counts = {};
      DB.loans.forEach(function(l) {
        var b = DB.books.find(function(b){ return b.id === l.book_id; });
        if (!b) return;
        counts[b.title] = (counts[b.title] || 0) + 1;
      });
      var rows = Object.keys(counts).map(function(title){ return { title: title, times_borrowed: counts[title] }; })
        .sort(function(a,b){ return b.times_borrowed - a.times_borrowed; });
      return { rows: rows };
    }
  },
  notReturned: {
    sql: 'SELECT b.title, br.name AS borrower\\nFROM loans l\\nJOIN books b ON b.id = l.book_id\\nJOIN borrowers br ON br.id = l.borrower_id\\nWHERE l.return_date IS NULL;',
    params: [],
    run: function() {
      var rows = [];
      DB.loans.filter(function(l){ return l.return_date === null; }).forEach(function(l) {
        var b = DB.books.find(function(b){ return b.id === l.book_id; });
        var br = DB.borrowers.find(function(br){ return br.id === l.borrower_id; });
        if (b && br) rows.push({ title: b.title, borrower: br.name });
      });
      return { rows: rows };
    }
  }
};

var DOCS = {
  selectWhere: { title:'SELECT ... WHERE', desc:'Returns only the columns listed, from only the rows that satisfy the condition. This is the single most common SQL statement shape, and works identically across every relational database.' },
  distinctGenres: { title:'SELECT DISTINCT', desc:'Removes duplicate rows from the result. Here it collapses five books down to the three unique genres among them — useful for building a list of filter options from real data.' },
  likeSearch: { title:'LIKE pattern matching', desc:'<code>%</code> matches any sequence of characters, so <code>%term%</code> finds the term anywhere in the value. Standard SQL LIKE is case-sensitive in some databases (PostgreSQL) and case-insensitive in others (MySQL’s default collation, SQLite) — always check your specific database’s behavior.' },
  authorBooks: { title:'Two-table JOIN', desc:'Combines authors with their books by matching book.author_id to author.id — the standard pattern for a one-to-many relationship (one author, many books).' },
  threeWayJoin: { title:'Three-table JOIN', desc:'Joining three tables just means joining twice: loans to books, and loans to borrowers, using the same query. This is exactly how a many-to-many relationship (borrowers and books, connected through loans) is queried in practice.' },
  neverBorrowed: { title:'NOT IN subquery', desc:'The inner query first collects every book_id that has ever appeared in loans. The outer query then keeps only books whose id is not in that list — a common pattern for "find things with no related records."' },
  existsSubquery: { title:'EXISTS subquery', desc:'EXISTS checks whether the inner query returns at least one row, without caring what the row actually contains — often faster than an equivalent IN subquery on a large table, since the database can stop as soon as it finds one match.' },
  unionQuery: { title:'UNION', desc:'Combines the results of two separate SELECT statements into one result set, removing exact duplicate rows (UNION ALL keeps duplicates instead). Both queries must return the same number of columns with compatible types.' },
  mostBorrowed: { title:'GROUP BY ... ORDER BY', desc:'Groups loans by book title and counts how many loans each group has, then sorts the groups by that count — the standard "most popular X" query pattern.' },
  notReturned: { title:'IS NULL', desc:'return_date is NULL for a loan that has not been returned yet. Note the syntax: <code>IS NULL</code>, never <code>= NULL</code> — NULL is not a value, so ordinary equality comparison never matches it, even against another NULL.' }
};

// ================================================================
// STATE / INIT
// ================================================================
var currentKey = 'selectWhere';

(function init() {
  document.querySelectorAll('.qb').forEach(function(btn) {
    btn.addEventListener('click', function() { selectQuery(this.dataset.key); });
  });
  document.getElementById('btnRun').addEventListener('click', runCurrent);
  selectQuery('selectWhere');
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

export const sqlFundamentalsExplorerProject: Project = {
  id: 'sql-fundamentals-explorer',
  slug: 'sql-fundamentals-explorer',
  title: 'SQL Fundamentals Explorer',
  difficulty: 'beginner',
  type: 'frontend',
  estimatedTime: '5-8 hours',
  playgroundKey: 'sql-fundamentals-explorer',
  description: 'Build an interactive SQL console covering portable, standard SQL — multi-table joins, subqueries with NOT IN and EXISTS, UNION, DISTINCT and LIKE — over a small library database of books, authors, borrowers and loans.',
  overview: 'This project focuses on standard SQL that works the same way across PostgreSQL, MySQL and SQLite, using a realistic library-system dataset with a genuine many-to-many relationship (borrowers and books, connected through loans). Each query shows its real SQL text and runs correct, live logic — including a three-table join, two different subquery styles, and a UNION combining two different tables.',
  objective: 'Build an interactive SQL learning console covering fundamental, portable SQL concepts — SELECT/WHERE/DISTINCT/LIKE, multi-table joins, NOT IN and EXISTS subqueries, UNION, and GROUP BY — each backed by correct logic over a shared library dataset.',
  technologies: ['HTML', 'CSS', 'JavaScript', 'SQL'],
  prerequisites: ['JavaScript fundamentals (array methods: filter, map, find, some)', 'Basic SQL (SELECT, WHERE)', 'DOM manipulation'],
  learnings: [
    'Querying a many-to-many relationship through a join (link) table',
    'The difference between a NOT IN subquery and an EXISTS subquery, and how to implement each in JavaScript',
    'How UNION combines results from two different SELECT statements, even from different tables',
    'Why IS NULL is required instead of = NULL, and what that looks like in real filtering logic',
    'How LIKE pattern matching works, and why case-sensitivity varies between real databases',
    'Structuring a three-way join by chaining two lookups through a connecting table',
    'Building a reusable "query as data" console architecture shared across different SQL projects',
  ],
  features: [
    '10 real, portable SQL queries across five categories: basics, joins, subqueries, set operations, and aggregation',
    'A realistic library dataset with a genuine many-to-many relationship (loans connecting books and borrowers)',
    'Live-editable LIKE search term that actually re-filters results',
    'A working NOT IN subquery finding books that have never been borrowed',
    'A working EXISTS subquery finding borrowers who have borrowed at least once',
    'A real UNION combining author names and borrower names from two different tables into one result',
    'A three-table JOIN chaining loans, books and borrowers together',
    'Per-query explanation panel describing what the SQL does and why',
    'Dark database-console UI consistent with the site\'s other database projects',
  ],
  fileStructure: 'sql-fundamentals-explorer/ |   index.html |   style.css |   script.js',
  files: [
    { path: 'sql-fundamentals-explorer/index.html', language: 'html',       content: indexHtml },
    { path: 'sql-fundamentals-explorer/style.css',  language: 'css',        content: styleCss  },
    { path: 'sql-fundamentals-explorer/script.js',  language: 'javascript', content: scriptJs  },
  ],
  lessons: [
    {
      id: 'many-to-many',
      title: 'Modeling a Many-to-Many Relationship',
      explanation: 'A book can be borrowed by many borrowers over time, and a borrower can borrow many books — a many-to-many relationship, which SQL models with a connecting (link) table. Here, loans connects books and borrowers, with a foreign key to each.',
      js: `// Each loan links exactly one book to exactly one borrower:
var loans = [
  { id: 1, book_id: 1, borrower_id: 1, loan_date: '2026-01-05', return_date: '2026-01-20' },
  { id: 2, book_id: 1, borrower_id: 2, loan_date: '2026-02-01', return_date: null }
];

// To find everything a borrower has read, join through loans:
function booksReadBy(borrowerId) {
  return loans
    .filter(function(l) { return l.borrower_id === borrowerId; })
    .map(function(l) { return books.find(function(b) { return b.id === l.book_id; }); });
}`,
    },
    {
      id: 'not-in-vs-exists',
      title: 'NOT IN vs EXISTS Subqueries',
      explanation: 'Both answer "find rows with no related record," but they work differently. NOT IN collects a list of all related ids first, then excludes anything in that list. EXISTS checks each row individually for at least one match, without building a full list first.',
      js: `// NOT IN: build the full set of borrowed book ids first
function neverBorrowedBooks() {
  var borrowedIds = {};
  loans.forEach(function(l) { borrowedIds[l.book_id] = true; });
  return books.filter(function(b) { return !borrowedIds[b.id]; });
}

// EXISTS: check each borrower individually for at least one loan
function borrowersWhoHaveBorrowed() {
  return borrowers.filter(function(br) {
    return loans.some(function(l) { return l.borrower_id === br.id; });
  });
}
// .some() short-circuits on the first match, mirroring EXISTS's
// "stop as soon as one row is found" behavior.`,
    },
    {
      id: 'union-two-tables',
      title: 'Combining Two Tables with UNION',
      explanation: 'UNION stacks the results of two separate queries into one result set. In JavaScript, this is just concatenating two mapped arrays — as long as both "queries" produce objects with the same shape (the same keys), matching SQL\'s rule that both sides of a UNION must have the same number of columns.',
      js: `function allPeople() {
  var authorRows = authors.map(function(a) {
    return { name: a.name, role: 'author' };
  });
  var borrowerRows = borrowers.map(function(br) {
    return { name: br.name, role: 'borrower' };
  });
  return authorRows.concat(borrowerRows);
}
// Real SQL UNION also removes exact duplicate rows;
// UNION ALL keeps every row, duplicates included.`,
    },
    {
      id: 'null-handling',
      title: 'Why IS NULL, Not = NULL',
      explanation: 'NULL represents "unknown" or "missing," not a value that can be compared with =. A loan with no return_date yet is still being borrowed — filtering it correctly means explicitly checking for null, not equality.',
      js: `// WRONG: this never matches anything, even other NULLs
// loans.filter(function(l) { return l.return_date == null_value_that_doesnt_exist; })

// CORRECT: explicit null check
function currentlyBorrowed() {
  return loans.filter(function(l) { return l.return_date === null; });
}

// The real SQL equivalent:
// SELECT * FROM loans WHERE return_date IS NULL;
// (WHERE return_date = NULL would incorrectly match nothing at all)`,
    },
  ],
  challenges: [
    {
      id: 'add-genre-filter',
      title: 'Add a genre filter query',
      difficulty: 'easy',
      description: 'Add a new query, booksByGenre, with a live-editable genre parameter, showing SELECT title FROM books WHERE genre = ?; for the chosen genre.',
      hint: 'Follow the whereFilter pattern from the PostgreSQL Query Lab project: add a params entry for genre, and filter DB.books by exact (or case-insensitive) genre match in run().',
      solutionJs: `booksByGenre: {
  sql: "SELECT title FROM books WHERE genre = '{{genre}}';",
  params: [{ key: 'genre', label: 'genre', type: 'text', default: 'Mystery' }],
  run: function(p) {
    var rows = DB.books
      .filter(function(b) { return b.genre.toLowerCase() === p.genre.toLowerCase(); })
      .map(function(b) { return { title: b.title }; });
    return { rows: rows };
  }
}

// Also add DOCS.booksByGenre and a sidebar button.`,
    },
    {
      id: 'add-having',
      title: 'Add a HAVING clause to the most-borrowed query',
      difficulty: 'medium',
      description: 'Extend mostBorrowed so it only shows books borrowed more than once — equivalent to adding HAVING COUNT(*) > 1 to the real SQL query.',
      hint: 'After building the counts object and converting it to an array of rows, add a .filter() step before the .sort() that keeps only rows where times_borrowed > 1.',
      solutionJs: `mostBorrowed: {
  sql: 'SELECT b.title, COUNT(*) AS times_borrowed\\nFROM loans l\\nJOIN books b ON b.id = l.book_id\\nGROUP BY b.title\\nHAVING COUNT(*) > 1\\nORDER BY times_borrowed DESC;',
  params: [],
  run: function() {
    var counts = {};
    DB.loans.forEach(function(l) {
      var b = DB.books.find(function(b) { return b.id === l.book_id; });
      if (!b) return;
      counts[b.title] = (counts[b.title] || 0) + 1;
    });
    var rows = Object.keys(counts)
      .map(function(title) { return { title: title, times_borrowed: counts[title] }; })
      .filter(function(r) { return r.times_borrowed > 1; })   // HAVING
      .sort(function(a, b) { return b.times_borrowed - a.times_borrowed; });
    return { rows: rows };
  }
}`,
    },
    {
      id: 'add-self-join',
      title: 'Add a self-join: books by the same author as a given book',
      difficulty: 'hard',
      description: 'Add a query, sameAuthor, that takes a book title as a parameter and returns every other book by that same author — a self-join pattern (joining the books table to itself through a shared author_id).',
      hint: 'First find the given book to get its author_id, then filter DB.books for every book with that same author_id, excluding the original book itself by id.',
      solutionJs: `sameAuthor: {
  sql: "SELECT b2.title\\nFROM books b1\\nJOIN books b2 ON b2.author_id = b1.author_id AND b2.id <> b1.id\\nWHERE b1.title = '{{title}}';",
  params: [{ key: 'title', label: 'book title', type: 'text', default: '1984' }],
  run: function(p) {
    var b1 = DB.books.find(function(b) { return b.title === p.title; });
    if (!b1) return { rows: [] };
    var rows = DB.books
      .filter(function(b2) { return b2.author_id === b1.author_id && b2.id !== b1.id; })
      .map(function(b2) { return { title: b2.title }; });
    return { rows: rows };
  }
}`,
    },
  ],
};
