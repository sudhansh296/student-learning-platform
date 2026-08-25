import type { SqliteLesson } from '../sqlite-curriculum';

export const lesson03: SqliteLesson = {
  id: 'sqlite-03',
  title: 'CRUD Operations in SQLite',
  slug: '03-crud',
  chapter: 'usage',
  order: 3,
  difficulty: 'beginner',
  readingTime: 11,
  description: 'Implement Create, Read, Update, and Delete operations using better-sqlite3, with prepared statements and transactions.',
  sections: [
    {
      type: 'text',
      content: 'CRUD - Create, Read, Update, Delete - are the four fundamental database operations. Every application that stores data performs these operations. In better-sqlite3, CRUD maps directly to SQL statements: CREATE TABLE + INSERT for create, SELECT for read, UPDATE for update, and DELETE for delete.'
    },
    {
      type: 'heading',
      content: 'Why Prepared Statements?'
    },
    {
      type: 'text',
      content: 'A prepared statement is a pre-compiled SQL query that you execute with different parameters. There are two major reasons to always use prepared statements instead of string concatenation.'
    },
    {
      type: 'list',
      title: 'Prepared statement benefits:',
      items: [
        'Security: parameters are never interpolated into the SQL string - SQL injection is impossible',
        'Performance: the query is parsed and compiled once, then executed many times without re-parsing',
        'Convenience: named parameters (@email, @name) make code readable and eliminate parameter order bugs'
      ]
    },
    {
      type: 'warning',
      title: 'Never Concatenate User Input into SQL',
      content: 'Building queries with string interpolation like `SELECT * FROM users WHERE email = \'${userInput}\'` is a SQL injection vulnerability. If userInput is \' OR 1=1 --, the query returns all users. Always use prepared statements with parameters.'
    },
    {
      type: 'heading',
      content: 'CREATE and READ'
    },
    {
      type: 'text',
      content: 'Creating a table in SQLite uses the same CREATE TABLE syntax as standard SQL, with a few SQLite-specific notes. INTEGER PRIMARY KEY is SQLite\'s way of creating an auto-incrementing primary key using the built-in rowid. The AUTOINCREMENT keyword is optional and prevents rowid reuse, but adds overhead - omit it unless you specifically need that guarantee.'
    },
    {
      type: 'example',
      title: 'Full CRUD with better-sqlite3',
      content: 'A complete CRUD module for a users table using better-sqlite3, with CREATE, READ, UPDATE, and DELETE operations.',
      code: `const Database = require('better-sqlite3');

const db = new Database(':memory:');
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

// CREATE TABLE
db.exec(\`
  CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    email      TEXT NOT NULL UNIQUE,
    name       TEXT NOT NULL,
    plan       TEXT NOT NULL DEFAULT 'free',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
\`);

// Prepare statements once, reuse many times
const stmts = {
  insert: db.prepare(
    'INSERT INTO users (email, name, plan) VALUES (@email, @name, @plan)'
  ),
  findById: db.prepare('SELECT * FROM users WHERE id = ?'),
  findByEmail: db.prepare('SELECT * FROM users WHERE email = ?'),
  findAll: db.prepare('SELECT * FROM users ORDER BY created_at DESC'),
  update: db.prepare(
    'UPDATE users SET name = @name, plan = @plan WHERE id = @id'
  ),
  delete: db.prepare('DELETE FROM users WHERE id = ?'),
};

// CREATE
function createUser(email, name, plan = 'free') {
  const result = stmts.insert.run({ email, name, plan });
  return stmts.findById.get(result.lastInsertRowid);
}

// READ
function getUserById(id) { return stmts.findById.get(id); }
function getAllUsers()    { return stmts.findAll.all(); }

// UPDATE
function updateUser(id, name, plan) {
  stmts.update.run({ id, name, plan });
  return stmts.findById.get(id);
}

// DELETE
function deleteUser(id) {
  const result = stmts.delete.run(id);
  return result.changes > 0;
}

// Usage
const alice = createUser('alice@example.com', 'Alice Chen', 'pro');
console.log(alice); // { id: 1, email: '...', name: 'Alice Chen', plan: 'pro', ... }

const updated = updateUser(1, 'Alice Smith', 'enterprise');
console.log(updated.name); // 'Alice Smith'

console.log(deleteUser(1)); // true
console.log(getAllUsers()); // []`,
      language: 'javascript'
    },
    {
      type: 'heading',
      content: 'Transactions'
    },
    {
      type: 'text',
      content: 'A transaction groups multiple operations into one atomic unit. Either all operations succeed (commit), or none are applied (rollback). Without transactions, if your application crashes halfway through a multi-step update, your database is left in an inconsistent state.'
    },
    {
      type: 'text',
      content: 'better-sqlite3 makes transactions elegant: db.transaction() takes a function, wraps it in BEGIN...COMMIT, and automatically rolls back if an exception is thrown. The returned value is a new function you call to execute the transaction.'
    },
    {
      type: 'example',
      title: 'Transactions with better-sqlite3',
      content: 'Using db.transaction() for atomic multi-step operations - transferring subscription plan while recording the change in an audit log.',
      code: `const Database = require('better-sqlite3');
const db = new Database(':memory:');
db.pragma('foreign_keys = ON');

db.exec(\`
  CREATE TABLE accounts (id INTEGER PRIMARY KEY, email TEXT, credits INTEGER);
  CREATE TABLE transactions (
    id INTEGER PRIMARY KEY,
    from_id INTEGER,
    to_id INTEGER,
    amount INTEGER,
    created_at TEXT DEFAULT (datetime('now'))
  );
\`);

db.prepare('INSERT INTO accounts VALUES (1, \'alice@ex.com\', 100)').run();
db.prepare('INSERT INTO accounts VALUES (2, \'bob@ex.com\', 50)').run();

// Prepare the individual statements
const debit  = db.prepare('UPDATE accounts SET credits = credits - ? WHERE id = ?');
const credit = db.prepare('UPDATE accounts SET credits = credits + ? WHERE id = ?');
const logTx  = db.prepare('INSERT INTO transactions (from_id, to_id, amount) VALUES (?,?,?)');

// Wrap in a transaction - atomic, auto-rollback on error
const transfer = db.transaction((fromId, toId, amount) => {
  debit.run(amount, fromId);
  credit.run(amount, toId);
  logTx.run(fromId, toId, amount);
});

// Run the transaction
transfer(1, 2, 30);

console.log(db.prepare('SELECT * FROM accounts').all());
// alice: 70, bob: 80

// Bulk insert is much faster inside a transaction
const insertMany = db.transaction((users) => {
  const stmt = db.prepare('INSERT INTO accounts (email, credits) VALUES (@email, @credits)');
  for (const user of users) stmt.run(user);
});

insertMany([
  { email: 'c@ex.com', credits: 10 },
  { email: 'd@ex.com', credits: 20 },
  { email: 'e@ex.com', credits: 30 },
]);`,
      language: 'javascript'
    },
    {
      type: 'tip',
      title: 'Bulk Inserts in a Transaction',
      content: 'Inserting 1000 rows one-by-one (auto-committed) is slow because each insert flushes to disk. Wrapping 1000 inserts in a single transaction is 50-100x faster because the disk flush only happens once on commit. Always use transactions for bulk operations.'
    },
    {
      type: 'note',
      title: 'SQLite AUTOINCREMENT vs INTEGER PRIMARY KEY',
      content: 'INTEGER PRIMARY KEY without AUTOINCREMENT reuses deleted rowids. INTEGER PRIMARY KEY AUTOINCREMENT never reuses rowids but is slightly slower. In practice, omit AUTOINCREMENT unless you need the guarantee that IDs are never reused (rare).'
    },
    {
      type: 'tryit',
      title: 'In-Browser CRUD Demo',
      js: `document.body.innerHTML = \`
  <div>
    <h3>CRUD Demo: Users Table</h3>
    <p>Simulate INSERT, UPDATE, and DELETE operations on an in-memory table</p>
    <div class="btns">
      <button id="insert-btn">INSERT</button>
      <button id="update-btn">UPDATE</button>
      <button id="delete-btn">DELETE</button>
    </div>
    <span id="count"></span>
    <div id="table"></div>
    <div id="log"></div>
  </div>
\`;

let users = [
  { id: 1, email: 'alice@example.com', name: 'Alice Chen', plan: 'pro' },
  { id: 2, email: 'bob@example.com', name: 'Bob Smith', plan: 'free' },
];
let nextId = 3;
let log = ['Database initialized with 2 rows'];

function addLog(msg) { log.unshift(msg); if (log.length > 6) log.pop(); }

function renderTable() {
  if (!users.length) return '<p style="font-size:13px;color:#718096;padding:8px 0">No rows in table</p>';
  const head = ['id','email','name','plan'].map(c =>
    \`<th style="background:#0F3B70;color:white;padding:6px 10px;text-align:left;font-size:11px;font-weight:700">\${c}</th>\`
  ).join('');
  const body = users.map((u, i) =>
    \`<tr style="background:\${i%2===0?'#fff':'#f8fafc'}">
      <td style="padding:6px 10px;font-family:monospace;font-size:12px;border-bottom:1px solid #e2e8f0">\${u.id}</td>
      <td style="padding:6px 10px;font-family:monospace;font-size:12px;border-bottom:1px solid #e2e8f0">\${u.email}</td>
      <td style="padding:6px 10px;font-family:monospace;font-size:12px;border-bottom:1px solid #e2e8f0">\${u.name}</td>
      <td style="padding:6px 10px;font-family:monospace;font-size:12px;border-bottom:1px solid #e2e8f0">\${u.plan}</td>
    </tr>\`
  ).join('');
  return \`<table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:6px;overflow:hidden"><thead><tr>\${head}</tr></thead><tbody>\${body}</tbody></table>\`;
}

function renderLog() {
  document.getElementById('log').innerHTML = log.map(l =>
    \`<div style="font-family:monospace;font-size:11px;color:#4a5568;padding:2px 0;border-bottom:1px solid #e2e8f0">> \${l}</div>\`
  ).join('');
}

function render() {
  document.getElementById('table').innerHTML = renderTable();
  document.getElementById('count').textContent = users.length + ' rows';
  renderLog();
}

document.getElementById('insert-btn').addEventListener('click', () => {
  const names = ['Carol Davis','Dan Lee','Eve Wilson','Frank Brown'];
  const plans = ['free','pro','enterprise'];
  const n = names[nextId % names.length];
  const e = n.split(' ')[0].toLowerCase() + nextId + '@ex.com';
  const p = plans[nextId % plans.length];
  users.push({ id: nextId++, email: e, name: n, plan: p });
  addLog(\`INSERT: \${e} (\${p})\`);
  render();
});

document.getElementById('update-btn').addEventListener('click', () => {
  if (!users.length) return;
  const u = users[0];
  const old = u.plan;
  u.plan = u.plan === 'free' ? 'pro' : u.plan === 'pro' ? 'enterprise' : 'free';
  addLog(\`UPDATE id=\${u.id}: plan \${old} -> \${u.plan}\`);
  render();
});

document.getElementById('delete-btn').addEventListener('click', () => {
  if (!users.length) return;
  const u = users.pop();
  addLog(\`DELETE id=\${u.id}: \${u.email}\`);
  render();
});

render();`,
      css: `body { padding: 20px; font-family: system-ui, sans-serif; background: #f7fafc; }
h3 { color: #0F3B70; margin: 0 0 6px 0; font-size: 15px; font-weight: 700; }
p { color: #718096; font-size: 13px; margin: 0 0 12px 0; }
.btns { display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
button { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: 700; font-size: 12px; color: white; }
#insert-btn { background: #10b981; }
#update-btn { background: #0F3B70; }
#delete-btn { background: #ef4444; }
#count { font-size: 12px; color: #718096; margin: 8px 0; display: block; }
#log { background: #f0f8ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 10px; margin-top: 12px; min-height: 60px; }`
    }
  ],
  exercises: [
    {
      id: 'ex-sqlite-3-1',
      question: 'Why should you use prepared statements instead of string concatenation in SQL queries?',
      type: 'multiple-choice',
      options: [
        'Prepared statements are required by the SQLite standard',
        'They prevent SQL injection and are faster because the query is compiled once',
        'They automatically handle transactions',
        'They return results faster than inline queries'
      ],
      correct: 1,
      explanation: 'Prepared statements keep SQL and data separate, preventing SQL injection. They also allow the database to compile the query once and execute it many times with different parameters, which is faster than parsing the SQL on every execution.'
    },
    {
      id: 'ex-sqlite-3-2',
      question: 'What happens if an error is thrown inside a db.transaction() function?',
      type: 'multiple-choice',
      options: [
        'The transaction is committed up to the error point',
        'The transaction is automatically rolled back and no changes are applied',
        'The database file is corrupted',
        'SQLite silently ignores the error'
      ],
      correct: 1,
      explanation: 'better-sqlite3\'s transaction() wrapper automatically rolls back the entire transaction if an exception is thrown inside the function. This ensures atomicity - either all operations succeed or none are applied.'
    },
    {
      id: 'ex-sqlite-3-3',
      question: 'Why is wrapping 1000 INSERT statements in a single transaction much faster?',
      type: 'multiple-choice',
      options: [
        'SQLite batches the SQL parsing for all inserts',
        'Without a transaction each insert auto-commits, flushing to disk every time; one transaction flushes to disk only once on commit',
        'Transactions enable parallel execution of inserts',
        'SQLite skips constraint checking inside transactions'
      ],
      correct: 1,
      explanation: 'By default, SQLite auto-commits each statement, which requires a disk sync on each insert. With a single transaction, data is written to disk only once on COMMIT. This makes bulk inserts 50-100x faster by dramatically reducing disk I/O.'
    }
  ],
  quiz: [
    {
      id: 'q-sqlite-3-1',
      question: 'What does INTEGER PRIMARY KEY do in SQLite (without AUTOINCREMENT)?',
      options: [
        'Creates a UUID primary key',
        'Creates an auto-incrementing integer using the rowid alias, reusing deleted values',
        'Creates a composite primary key with row numbers',
        'Requires you to manually provide the ID on every INSERT'
      ],
      correct: 1,
      explanation: 'In SQLite, INTEGER PRIMARY KEY creates an alias for the built-in rowid. SQLite automatically assigns the next available integer. Without AUTOINCREMENT, it may reuse IDs of deleted rows. With AUTOINCREMENT, IDs always strictly increase.'
    },
    {
      id: 'q-sqlite-3-2',
      question: 'What does stmt.run() return?',
      options: [
        'The affected rows as an array',
        '{ changes: number, lastInsertRowid: number }',
        'null on success, Error on failure',
        'A promise that resolves to the row count'
      ],
      correct: 1,
      explanation: 'stmt.run() returns an info object with: changes (number of rows affected) and lastInsertRowid (the rowid of the last inserted row). For UPDATE/DELETE, lastInsertRowid is the last INSERT rowid from this connection, not the modified row.'
    },
    {
      id: 'q-sqlite-3-3',
      question: 'How do you use named parameters in better-sqlite3?',
      options: [
        'Use ${paramName} syntax in the query',
        'Use @paramName in the query and pass an object with matching keys to .run()',
        'Use :paramName in the query and pass values in an array',
        'Named parameters are not supported'
      ],
      correct: 1,
      explanation: 'better-sqlite3 supports @paramName syntax: db.prepare("INSERT INTO t (col) VALUES (@col)").run({ col: "value" }). You can also use ? (positional) or :paramName. Named params are recommended for clarity with multiple parameters.'
    }
  ]
};
