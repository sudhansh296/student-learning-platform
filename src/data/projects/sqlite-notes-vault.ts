import type { Project } from './types';

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SQLite Notes Vault</title>
<link rel="stylesheet" href="style.css">
</head>
<body>

<div id="app">

  <header class="topbar">
    <div class="topbar-left">
      <div class="brand-icon">lite</div>
      <span class="brand-name">SQLite Notes Vault</span>
      <span class="brand-sub">notes.db (single file)</span>
    </div>
    <div class="topbar-right">
      <span class="label">foreign_keys:</span>
      <span id="fkStatus" class="fk-status">OFF</span>
    </div>
  </header>

  <div class="layout">

    <aside class="sidebar">
      <div class="group-title">NOTES</div>
      <button class="qb" data-key="listNotes">List notes</button>
      <button class="qb" data-key="createNote">Create note</button>
      <button class="qb" data-key="updateNote">Update note title</button>
      <button class="qb" data-key="deleteNote">Delete note</button>

      <div class="group-title">DYNAMIC TYPING</div>
      <button class="qb" data-key="setPriorityNumber">Set priority (number)</button>
      <button class="qb" data-key="setPriorityText">Set priority (text)</button>

      <div class="group-title">TAGS &amp; FOREIGN KEYS</div>
      <button class="qb" data-key="listTags">List tags</button>
      <button class="qb" data-key="createTag">Create tag</button>
      <button class="qb" data-key="deleteTag">Delete tag</button>
      <button class="qb" data-key="togglePragma">PRAGMA foreign_keys</button>

      <div class="group-title">TRANSACTIONS</div>
      <button class="qb" data-key="batchInsert">Batch insert (transaction)</button>
    </aside>

    <div class="main">

      <div class="query-box">
        <div class="query-label">SQL</div>
        <pre id="sqlText" class="sql-pre"></pre>
        <div id="paramRow" class="param-row"></div>
        <button id="btnRun" class="btn-run">Run</button>
      </div>

      <div class="result-box">
        <div class="result-top">
          <span class="result-label">RESULT</span>
          <span id="timeLabel" class="time-label"></span>
        </div>
        <div id="resultOut" class="result-out">Select an operation and click Run.</div>
      </div>

    </div>

    <aside class="docs">
      <div class="group-title">EXPLANATION</div>
      <div id="docsBox" class="docs-body">Select an operation on the left.</div>
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
.brand-icon{padding:5px 8px;background:linear-gradient(135deg,#0f766e,#14b8a6);border-radius:6px;font-weight:900;font-size:11px;color:#fff;font-family:monospace}
.brand-name{font-weight:800;font-size:14px}
.brand-sub{font-size:10px;color:#484f58;background:#21262d;padding:2px 7px;border-radius:99px;border:1px solid #30363d;font-family:monospace}
.topbar-right{display:flex;align-items:center;gap:8px;font-size:12px}
.label{color:#484f58}
.fk-status{font-family:monospace;font-weight:800;font-size:11px;color:#f85149;background:#3d0c0c;padding:2px 8px;border-radius:4px}
.fk-status.on{color:#3fb950;background:#0d4429}

.layout{display:grid;grid-template-columns:220px 1fr 260px;flex:1;overflow:hidden}

.sidebar{background:#161b22;border-right:1px solid #30363d;overflow-y:auto;padding:8px 0}
.group-title{font-size:10px;font-weight:700;letter-spacing:1.2px;color:#484f58;padding:10px 12px 4px;text-transform:uppercase}
.qb{display:block;width:100%;padding:7px 12px;background:none;border:none;border-left:2px solid transparent;color:#8b949e;text-align:left;font-size:11.5px;font-family:monospace;transition:all .12s}
.qb:hover{background:#21262d;color:#e6edf3}
.qb.active{background:#161b22;border-left-color:#14b8a6;color:#e6edf3}

.main{display:flex;flex-direction:column;overflow:hidden;border-right:1px solid #30363d}

.query-box{padding:14px;border-bottom:1px solid #30363d;flex-shrink:0}
.query-label{font-size:10px;font-weight:700;letter-spacing:1px;color:#484f58;margin-bottom:6px}
.sql-pre{background:#161b22;border:1px solid #30363d;border-radius:6px;padding:12px 14px;font-family:monospace;font-size:12.5px;color:#7ee6d8;white-space:pre-wrap;line-height:1.6;margin-bottom:10px}
.param-row{display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap}
.param-row label{font-size:11px;color:#8b949e;font-family:monospace}
.param-row input{padding:5px 9px;background:#21262d;border:1px solid #30363d;border-radius:4px;color:#e6edf3;font-size:12px;font-family:monospace;outline:none;width:150px}
.param-row input:focus{border-color:#14b8a6}
.btn-run{padding:8px 20px;background:#238636;color:#fff;border:none;border-radius:5px;font-size:13px;font-weight:700;transition:background .15s}
.btn-run:hover{background:#2ea043}

.result-box{flex:1;display:flex;flex-direction:column;padding:14px;overflow:hidden;min-height:0}
.result-top{display:flex;align-items:center;gap:10px;margin-bottom:8px;flex-shrink:0}
.result-label{font-size:10px;font-weight:700;letter-spacing:1px;color:#484f58}
.time-label{font-size:11px;color:#484f58;font-family:monospace}
.result-out{flex:1;overflow:auto;font-size:12px;color:#8b949e}

table.rt{width:100%;border-collapse:collapse;font-family:monospace;font-size:12px}
table.rt th{text-align:left;padding:7px 12px;background:#161b22;color:#14b8a6;border-bottom:1px solid #30363d;position:sticky;top:0}
table.rt td{padding:7px 12px;border-bottom:1px solid #21262d;color:#e6edf3}
table.rt tr:hover td{background:#161b22}
.empty-msg{padding:20px;color:#484f58;text-align:center}
.msg{padding:14px;border-radius:6px;font-family:monospace;font-size:12px}
.msg.ok{background:#0d4429;color:#3fb950}
.msg.err{background:#3d0c0c;color:#f85149}
.type-tag{font-size:10px;color:#484f58;margin-left:6px}

.docs{background:#161b22;overflow-y:auto;padding:8px 0}
.docs-body{padding:4px 14px 14px;font-size:12px;color:#8b949e;line-height:1.7}
.docs-body h4{color:#e6edf3;font-size:12px;font-weight:700;margin:10px 0 4px}
.docs-body p{margin-bottom:6px}
.docs-body code{background:#0d1117;border:1px solid #30363d;border-radius:3px;padding:1px 5px;font-family:monospace;font-size:11px;color:#7ee6d8}

@media(max-width:900px){.layout{grid-template-columns:190px 1fr}.docs{display:none}}`;

const scriptJs = `'use strict';

// ================================================================
// IN-MEMORY "SQLITE" STORE — the whole database is this one object,
// mirroring SQLite's single-file, embedded, serverless nature.
// ================================================================
var seedNotes = [
  { id:1, title:'Buy groceries', body:'Milk, eggs, bread', tag_id:1, priority:2 },
  { id:2, title:'Finish report', body:'Q1 sales summary', tag_id:2, priority:1 },
  { id:3, title:'Call dentist', body:'Reschedule appointment', tag_id:1, priority:3 }
];
var seedTags = [
  { id:1, name:'personal' },
  { id:2, name:'work' }
];

var DB = { notes: [], tags: [], nextNoteId: 4, nextTagId: 3, foreignKeysEnabled: false };

function resetData() {
  DB.notes = seedNotes.map(function(n){ return Object.assign({}, n); });
  DB.tags = seedTags.map(function(t){ return Object.assign({}, t); });
  DB.nextNoteId = 4;
  DB.nextTagId = 3;
  DB.foreignKeysEnabled = false; // PRAGMA foreign_keys is OFF by default in real SQLite too
}
resetData();

// ================================================================
// OPERATIONS
// ================================================================
var OPS = {
  listNotes: {
    sql: 'SELECT id, title, priority FROM notes;',
    params: [],
    run: function() {
      var rows = DB.notes.map(function(n) {
        return { id: n.id, title: n.title, priority: n.priority, priority_type: n.priority === null ? 'null' : typeof n.priority };
      });
      return { ok: true, rows: rows };
    }
  },
  createNote: {
    sql: "INSERT INTO notes (title, body, tag_id)\\nVALUES ('{{title}}', '{{body}}', {{tag_id}});",
    params: [
      { key:'title', label:'title', type:'text', default:'New note' },
      { key:'body', label:'body', type:'text', default:'Note contents' },
      { key:'tag_id', label:'tag id', type:'number', default:1 }
    ],
    run: function(p) {
      var row = { id: DB.nextNoteId++, title: p.title, body: p.body, tag_id: parseInt(p.tag_id, 10), priority: null };
      DB.notes.push(row);
      return { ok: true, rows: [row] };
    }
  },
  updateNote: {
    sql: "UPDATE notes SET title = '{{title}}' WHERE id = {{id}};",
    params: [
      { key:'id', label:'note id', type:'number', default:1 },
      { key:'title', label:'new title', type:'text', default:'Buy groceries (updated)' }
    ],
    run: function(p) {
      var id = parseInt(p.id, 10);
      var note = DB.notes.find(function(n){ return n.id === id; });
      if (!note) return { ok: false, rows: [], text: 'Error: no note with id ' + id };
      note.title = p.title;
      return { ok: true, rows: [Object.assign({}, note)] };
    }
  },
  deleteNote: {
    sql: 'DELETE FROM notes WHERE id = {{id}};',
    params: [{ key:'id', label:'note id', type:'number', default:3 }],
    run: function(p) {
      var id = parseInt(p.id, 10);
      var existed = DB.notes.some(function(n){ return n.id === id; });
      if (!existed) return { ok: false, rows: [], text: 'Error: no note with id ' + id };
      DB.notes = DB.notes.filter(function(n){ return n.id !== id; });
      return { ok: true, rows: [], text: '1 row deleted.' };
    }
  },
  setPriorityNumber: {
    sql: 'UPDATE notes SET priority = {{num}} WHERE id = {{id}};',
    params: [
      { key:'id', label:'note id', type:'number', default:1 },
      { key:'num', label:'priority (number)', type:'number', default:5 }
    ],
    run: function(p) {
      var id = parseInt(p.id, 10);
      var note = DB.notes.find(function(n){ return n.id === id; });
      if (!note) return { ok: false, rows: [], text: 'Error: no note with id ' + id };
      note.priority = parseInt(p.num, 10);
      return { ok: true, rows: [{ id: note.id, priority: note.priority, stored_type: typeof note.priority }] };
    }
  },
  setPriorityText: {
    sql: "UPDATE notes SET priority = '{{text}}' WHERE id = {{id}};",
    params: [
      { key:'id', label:'note id', type:'number', default:1 },
      { key:'text', label:'priority (text)', type:'text', default:'urgent' }
    ],
    run: function(p) {
      var id = parseInt(p.id, 10);
      var note = DB.notes.find(function(n){ return n.id === id; });
      if (!note) return { ok: false, rows: [], text: 'Error: no note with id ' + id };
      note.priority = p.text; // SQLite happily stores text in a column that just held a number
      return { ok: true, rows: [{ id: note.id, priority: note.priority, stored_type: typeof note.priority }] };
    }
  },
  listTags: {
    sql: 'SELECT * FROM tags;',
    params: [],
    run: function() {
      return { ok: true, rows: DB.tags.slice() };
    }
  },
  createTag: {
    sql: "INSERT INTO tags (name) VALUES ('{{name}}');",
    params: [{ key:'name', label:'tag name', type:'text', default:'urgent' }],
    run: function(p) {
      var row = { id: DB.nextTagId++, name: p.name };
      DB.tags.push(row);
      return { ok: true, rows: [row] };
    }
  },
  deleteTag: {
    sql: 'DELETE FROM tags WHERE id = {{id}};',
    params: [{ key:'id', label:'tag id', type:'number', default:1 }],
    run: function(p) {
      var id = parseInt(p.id, 10);
      var tag = DB.tags.find(function(t){ return t.id === id; });
      if (!tag) return { ok: false, rows: [], text: 'Error: no tag with id ' + id };

      var inUse = DB.notes.some(function(n){ return n.tag_id === id; });
      if (inUse && DB.foreignKeysEnabled) {
        return { ok: false, rows: [], text: 'Error: FOREIGN KEY constraint failed\\n(foreign_keys is ON — a note still references tag ' + id + ')' };
      }

      DB.tags = DB.tags.filter(function(t){ return t.id !== id; });
      var note = inUse ? '\\n(foreign_keys is OFF, so notes referencing this tag now silently point to a deleted tag — a real SQLite quirk)' : '';
      return { ok: true, rows: [], text: '1 row deleted.' + note };
    }
  },
  togglePragma: {
    sql: 'PRAGMA foreign_keys = {{value}};',
    params: [{ key:'value', label:'ON or OFF', type:'text', default:'ON' }],
    run: function(p) {
      DB.foreignKeysEnabled = String(p.value).toUpperCase() === 'ON';
      updateFkBadge();
      return { ok: true, rows: [], text: 'foreign_keys is now ' + (DB.foreignKeysEnabled ? 'ON' : 'OFF') + '.\\nTry "Delete tag" on a tag that a note still uses to see the difference.' };
    }
  },
  batchInsert: {
    sql: "BEGIN;\\nINSERT INTO notes (title, body, tag_id) VALUES ('Task A', '...', 2);\\nINSERT INTO notes (title, body, tag_id) VALUES ('Task B', '...', 2);\\nINSERT INTO notes (title, body, tag_id) VALUES ('Task C', '...', 2);\\nCOMMIT;",
    params: [],
    run: function() {
      var titles = ['Task A', 'Task B', 'Task C'];
      var created = titles.map(function(title) {
        var row = { id: DB.nextNoteId++, title: title, body: '...', tag_id: 2, priority: null };
        DB.notes.push(row);
        return row;
      });
      return { ok: true, rows: created, text: null };
    }
  }
};

var DOCS = {
  listNotes: { title:'SELECT (dynamic typing visible)', desc:'Notice the <code>priority_type</code> column in the result — SQLite does not enforce a single type per column the way PostgreSQL does. The same column can hold a number for one row and text for another, with no error.' },
  createNote: { title:'INSERT', desc:'Adds a new row. Because there is no separate database server, this write happens directly against the single in-memory/on-disk file — there is no network round trip involved, ever.' },
  updateNote: { title:'UPDATE ... WHERE', desc:'Modifies the matching row in place. Try an id that does not exist to see the "no note with id" error — a WHERE clause matching nothing is not itself an error in real SQL, but this project reports it clearly for learning purposes.' },
  deleteNote: { title:'DELETE ... WHERE', desc:'Removes the matching row permanently. In a real single-file SQLite database, this change is written straight to the .db file on disk — no separate commit step across a network is needed.' },
  setPriorityNumber: { title:'Dynamic typing: storing a number', desc:'Sets the priority column to a genuine number. Check the <code>stored_type</code> field in the result.' },
  setPriorityText: { title:'Dynamic typing: storing text in the same column', desc:'Sets the very same priority column to a text value instead — no error, no cast required. In PostgreSQL or MySQL this would either fail or force a cast; SQLite’s column types are hints ("type affinity"), not hard constraints.' },
  listTags: { title:'SELECT * FROM tags', desc:'Lists every tag currently in the database.' },
  createTag: { title:'INSERT INTO tags', desc:'Adds a new tag that notes can reference by id.' },
  deleteTag: { title:'DELETE ... (foreign key behavior)', desc:'Try deleting a tag that a note still references (tag id 1 or 2) with foreign_keys OFF (the default) versus ON. OFF lets the delete through, leaving an orphaned reference. ON blocks it with a constraint error — exactly like real SQLite.' },
  togglePragma: { title:'PRAGMA foreign_keys', desc:'A PRAGMA is a SQLite-specific command with no equivalent in the standard SQL. Unlike PostgreSQL and MySQL, SQLite does not enforce foreign keys by default — this has to be turned on per connection, every time, which is one of the most commonly forgotten SQLite setup steps in real projects.' },
  batchInsert: { title:'A transaction (BEGIN ... COMMIT)', desc:'Wrapping several writes in one transaction, instead of letting each insert commit separately, is a real and significant performance technique in SQLite — because each individual commit has to sync to disk, batching many writes into one transaction can be dramatically faster.' }
};

function updateFkBadge() {
  var el = document.getElementById('fkStatus');
  el.textContent = DB.foreignKeysEnabled ? 'ON' : 'OFF';
  el.classList.toggle('on', DB.foreignKeysEnabled);
}

// ================================================================
// STATE / INIT
// ================================================================
var currentKey = 'listNotes';

(function init() {
  document.querySelectorAll('.qb').forEach(function(btn) {
    btn.addEventListener('click', function() { selectOp(this.dataset.key); });
  });
  document.getElementById('btnRun').addEventListener('click', runCurrent);
  updateFkBadge();
  selectOp('listNotes');
}());

function selectOp(key) {
  currentKey = key;
  document.querySelectorAll('.qb').forEach(function(b) {
    b.classList.toggle('active', b.dataset.key === key);
  });
  var op = OPS[key];
  renderParams(op);
  renderSql(op);
  renderDocs(key);
  runCurrent();
}

function renderSql(op) {
  var text = op.sql;
  op.params.forEach(function(p) {
    var val = currentParamValue(p);
    text = text.split('{{' + p.key + '}}').join(String(val));
  });
  document.getElementById('sqlText').textContent = text;
}

function currentParamValue(p) {
  var input = document.getElementById('param-' + p.key);
  return input ? input.value : p.default;
}

function renderParams(op) {
  var row = document.getElementById('paramRow');
  row.innerHTML = '';
  op.params.forEach(function(p) {
    var label = document.createElement('label');
    label.textContent = p.label + ':';
    var input = document.createElement('input');
    input.type = p.type === 'number' ? 'number' : 'text';
    input.id = 'param-' + p.key;
    input.value = p.default;
    input.addEventListener('input', function() { renderSql(op); });
    row.appendChild(label);
    row.appendChild(input);
  });
}

function runCurrent() {
  var op = OPS[currentKey];
  var params = {};
  op.params.forEach(function(p) { params[p.key] = currentParamValue(p); });

  var t0 = Date.now();
  var result = op.run(params);
  var ms = Date.now() - t0;

  document.getElementById('timeLabel').textContent = ms + 'ms';
  renderResult(result);
}

function renderResult(result) {
  var out = document.getElementById('resultOut');
  if (!result.ok) {
    out.innerHTML = '<div class="msg err">' + escapeHtml(result.text || 'Error') + '</div>';
    return;
  }
  if (result.rows && result.rows.length) {
    out.innerHTML = tableHtml(result.rows) + (result.text ? '<div class="msg ok" style="margin-top:10px">' + escapeHtml(result.text) + '</div>' : '');
    return;
  }
  out.innerHTML = '<div class="msg ok">' + escapeHtml(result.text || 'OK') + '</div>';
}

function tableHtml(rows) {
  var cols = Object.keys(rows[0]);
  var html = '<table class="rt"><thead><tr>';
  cols.forEach(function(c) { html += '<th>' + c + '</th>'; });
  html += '</tr></thead><tbody>';
  rows.forEach(function(r) {
    html += '<tr>';
    cols.forEach(function(c) {
      var v = r[c];
      html += '<td>' + (v === null || v === undefined ? '<em>NULL</em>' : escapeHtml(String(v))) + '</td>';
    });
    html += '</tr>';
  });
  html += '</tbody></table>';
  return html;
}

function escapeHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function renderDocs(key) {
  var d = DOCS[key];
  var el = document.getElementById('docsBox');
  if (!d) { el.innerHTML = ''; return; }
  el.innerHTML = '<h4>' + d.title + '</h4><p>' + d.desc + '</p>';
}`;

export const sqliteNotesVaultProject: Project = {
  id: 'sqlite-notes-vault',
  slug: 'sqlite-notes-vault',
  title: 'SQLite Notes Vault',
  difficulty: 'beginner',
  type: 'frontend',
  estimatedTime: '5-8 hours',
  playgroundKey: 'sqlite-notes-vault',
  description: 'Build an interactive notes app that demonstrates what genuinely makes SQLite different — dynamic column typing, opt-in foreign key enforcement via PRAGMA, and batching writes in a transaction — all backed by a single, embedded in-memory store.',
  overview: 'Rather than another generic SQL query browser, this project is built specifically around SQLite\'s real quirks: a column that happily stores a number in one row and text in the next (dynamic typing / type affinity), foreign key constraints that do nothing at all until you explicitly turn them on with PRAGMA foreign_keys = ON, and why batching writes into one transaction matters when every commit has to sync to a single file on disk.',
  objective: 'Build an interactive SQLite-flavored console — CRUD on notes and tags, a live dynamic-typing demonstration, a toggleable PRAGMA foreign_keys setting that genuinely changes delete behavior, and a batched transaction — all backed by correct, stateful logic.',
  technologies: ['HTML', 'CSS', 'JavaScript', 'SQLite'],
  prerequisites: ['JavaScript fundamentals (array methods, objects, typeof)', 'Basic SQL (INSERT, UPDATE, DELETE)', 'DOM manipulation'],
  learnings: [
    'What "dynamic typing" / type affinity actually means in SQLite, seen live by storing a number and then text in the same column',
    'Why SQLite foreign key enforcement is off by default, and exactly what changes when PRAGMA foreign_keys = ON is set',
    'Why batching writes in a single transaction is a real, meaningful performance technique for a file-backed, embedded database',
    'Modeling an embedded, single-file, serverless data store as one plain JavaScript object with no network layer at all',
    'Implementing a toggleable setting (PRAGMA) that changes the actual runtime behavior of other operations',
    'Giving clear, specific error messages that explain why an operation failed, not just that it failed',
  ],
  features: [
    '11 operations across four categories: notes CRUD, dynamic typing, tags & foreign keys, and transactions',
    'A live PRAGMA foreign_keys toggle in the top bar that genuinely changes whether deleting a referenced tag succeeds or fails',
    'A dynamic-typing demo showing the exact same column holding a number, then text, with the stored JavaScript type displayed',
    'Realistic SQLite-specific error messages, including the real "FOREIGN KEY constraint failed" wording',
    'A batched transaction inserting three notes as one atomic operation',
    'Per-operation explanation panel covering the SQLite-specific reasoning',
    'Dark, single-file-database-themed UI consistent with the site\'s other database projects',
  ],
  fileStructure: 'sqlite-notes-vault/ |   index.html |   style.css |   script.js',
  files: [
    { path: 'sqlite-notes-vault/index.html', language: 'html',       content: indexHtml },
    { path: 'sqlite-notes-vault/style.css',  language: 'css',        content: styleCss  },
    { path: 'sqlite-notes-vault/script.js',  language: 'javascript', content: scriptJs  },
  ],
  lessons: [
    {
      id: 'dynamic-typing',
      title: 'Demonstrating Dynamic Typing (Type Affinity)',
      explanation: 'Unlike PostgreSQL, SQLite does not strictly enforce a column\'s declared type — it is closer to a hint. This is easy to demonstrate in JavaScript: nothing stops the same object property from being reassigned a completely different type, which mirrors SQLite\'s real, permissive behavior.',
      js: `var note = { id: 1, title: 'Buy groceries', priority: 2 };
console.log(typeof note.priority); // "number"

// SQLite allows this without any error or cast —
// PostgreSQL would reject it outright for a strictly-typed INTEGER column:
note.priority = 'urgent';
console.log(typeof note.priority); // "string"

// Both are perfectly valid values for the SAME column, in the SAME table.`,
    },
    {
      id: 'opt-in-foreign-keys',
      title: 'Implementing Opt-In Foreign Key Enforcement',
      explanation: 'Real SQLite does not enforce foreign keys unless PRAGMA foreign_keys = ON has been run on that connection. Simulating this means checking a boolean flag before allowing (or blocking) a delete that would orphan a reference — off by default, exactly like the real thing.',
      js: `var DB = { foreignKeysEnabled: false }; // OFF by default, just like real SQLite

function deleteTag(id) {
  var inUse = DB.notes.some(function(n) { return n.tag_id === id; });

  if (inUse && DB.foreignKeysEnabled) {
    // Only blocked when the PRAGMA has been explicitly turned on
    return { ok: false, text: 'FOREIGN KEY constraint failed' };
  }

  // Otherwise the delete succeeds — even if it leaves an orphaned reference
  DB.tags = DB.tags.filter(function(t) { return t.id !== id; });
  return { ok: true };
}

function setPragmaForeignKeys(on) {
  DB.foreignKeysEnabled = on;
}`,
    },
    {
      id: 'transaction-batching',
      title: 'Batching Writes in a Transaction',
      explanation: 'Each individual write in SQLite has to be synced to the single database file on disk. Wrapping several writes in one transaction means that sync happens once for the whole batch instead of once per write — the difference matters a lot once you are inserting hundreds or thousands of rows.',
      js: `// Three separate writes -- three separate disk syncs in real SQLite
function insertThreeSeparately() {
  insertNote('Task A');
  insertNote('Task B');
  insertNote('Task C');
}

// One transaction -- one disk sync for the whole batch
function insertThreeAsTransaction() {
  // BEGIN;
  insertNote('Task A');
  insertNote('Task B');
  insertNote('Task C');
  // COMMIT;
}
// The individual insertNote() calls are identical either way --
// what changes is only when the data is actually flushed to disk.`,
    },
  ],
  challenges: [
    {
      id: 'add-note-count-per-tag',
      title: 'Add a "notes per tag" summary query',
      difficulty: 'easy',
      description: 'Add a new operation, notesPerTag, showing SELECT t.name, COUNT(*) FROM tags t JOIN notes n ON n.tag_id = t.id GROUP BY t.name; — the number of notes using each tag.',
      hint: 'Loop over DB.notes, look up each note\'s tag by tag_id, and build a counts object keyed by tag name, then convert it to an array of { name, count } rows.',
      solutionJs: `notesPerTag: {
  sql: 'SELECT t.name, COUNT(*) AS note_count\\nFROM tags t\\nJOIN notes n ON n.tag_id = t.id\\nGROUP BY t.name;',
  params: [],
  run: function() {
    var counts = {};
    DB.notes.forEach(function(n) {
      var t = DB.tags.find(function(t) { return t.id === n.tag_id; });
      if (!t) return;
      counts[t.name] = (counts[t.name] || 0) + 1;
    });
    var rows = Object.keys(counts).map(function(name) {
      return { name: name, note_count: counts[name] };
    });
    return { ok: true, rows: rows };
  }
}`,
    },
    {
      id: 'add-cascade-delete',
      title: 'Add PRAGMA-aware cascading tag deletion',
      difficulty: 'medium',
      description: 'Add a deleteTagCascade operation that, when foreign_keys is ON, deletes a tag AND every note referencing it in one operation (simulating ON DELETE CASCADE), instead of just blocking the delete.',
      hint: 'When foreignKeysEnabled is true and the tag is in use, remove every note with that tag_id first, then remove the tag itself, and report how many notes were also deleted.',
      solutionJs: `deleteTagCascade: {
  sql: 'DELETE FROM tags WHERE id = {{id}}; -- with ON DELETE CASCADE behavior',
  params: [{ key: 'id', label: 'tag id', type: 'number', default: 1 }],
  run: function(p) {
    var id = parseInt(p.id, 10);
    var tag = DB.tags.find(function(t) { return t.id === id; });
    if (!tag) return { ok: false, rows: [], text: 'Error: no tag with id ' + id };

    var affectedNotes = DB.notes.filter(function(n) { return n.tag_id === id; });
    DB.notes = DB.notes.filter(function(n) { return n.tag_id !== id; });
    DB.tags = DB.tags.filter(function(t) { return t.id !== id; });

    return { ok: true, rows: [], text: 'Deleted tag and ' + affectedNotes.length + ' related note(s).' };
  }
}`,
    },
    {
      id: 'add-vacuum-simulation',
      title: 'Simulate VACUUM and report reclaimed space',
      difficulty: 'hard',
      description: 'Add a vacuum operation that "compacts" the database: track how many notes/tags have been deleted since the last vacuum (a deletedCount you increment on every delete), and have VACUUM report a simulated reclaimed size based on that count, then reset it to 0.',
      hint: 'Add DB.deletedSinceVacuum = 0 to the store, increment it inside deleteNote/deleteTag, and have the vacuum operation compute a fake size (like deletedSinceVacuum * 4KB) before resetting the counter.',
      solutionJs: `// Add to DB: deletedSinceVacuum: 0
// Increment DB.deletedSinceVacuum++ inside deleteNote and deleteTag

vacuum: {
  sql: 'VACUUM;',
  params: [],
  run: function() {
    var reclaimedKb = DB.deletedSinceVacuum * 4; // simulate ~4KB per deleted row
    DB.deletedSinceVacuum = 0;
    return { ok: true, rows: [], text: 'Database vacuumed. Reclaimed approximately ' + reclaimedKb + 'KB.' };
  }
}

// VACUUM rebuilds the database file to reclaim space left behind by
// deleted rows -- in real SQLite this is a real, occasionally necessary
// maintenance operation, since deleted space is not always reused automatically.`,
    },
  ],
};
