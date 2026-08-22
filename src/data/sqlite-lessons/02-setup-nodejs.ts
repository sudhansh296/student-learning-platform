import type { SqliteLesson } from '../sqlite-curriculum';

export const lesson02: SqliteLesson = {
  id: 'sqlite-02',
  title: 'SQLite with Node.js',
  slug: '02-setup-nodejs',
  chapter: 'intro',
  order: 2,
  difficulty: 'beginner',
  readingTime: 11,
  description: 'Set up SQLite in a Node.js project with better-sqlite3, understand synchronous APIs, and use in-memory databases for testing.',
  sections: [
    {
      type: 'text',
      content: 'SQLite has two main Node.js libraries: node-sqlite3 (the older async-based library) and better-sqlite3 (the modern synchronous library). This tutorial focuses on better-sqlite3 because its synchronous API is simpler, faster, and avoids the callback/promise complexity that makes async database code difficult to reason about.'
    },
    {
      type: 'heading',
      content: 'better-sqlite3 vs node-sqlite3'
    },
    {
      type: 'table',
      title: 'better-sqlite3 vs node-sqlite3',
      headers: ['Factor', 'better-sqlite3', 'node-sqlite3'],
      rows: [
        ['API style', 'Synchronous (blocking)', 'Asynchronous (callbacks/promises)'],
        ['Speed', 'Faster — no event loop overhead for each query', 'Slower due to async overhead'],
        ['Simplicity', 'Simple: const row = db.prepare(...).get()', 'More verbose: callbacks or async/await'],
        ['Error handling', 'Throw/catch like normal JS', 'Must handle callback errors or promise rejections'],
        ['Transactions', 'Built-in: db.transaction(() => {...})()', 'Manual: begin/commit/rollback calls'],
        ['Maintenance', 'Actively maintained', 'Still maintained but less active'],
        ['Use with', 'Node.js, Electron, server-side JS', 'Node.js, server-side JS']
      ]
    },
    {
      type: 'text',
      content: 'The synchronous approach works well for SQLite specifically because SQLite operations are extremely fast (microseconds for indexed queries). Node.js is single-threaded, but a synchronous SQLite call that completes in 0.1ms blocks the event loop for 0.1ms — which is acceptable for most applications. For very high query volume, use a worker thread.'
    },
    {
      type: 'heading',
      content: 'Installation'
    },
    {
      type: 'text',
      content: 'better-sqlite3 is a native module that includes a prebuilt binary for common platforms. If a prebuilt binary exists for your platform, installation is instant. If not, it compiles from source using node-gyp, which requires Python and a C compiler.'
    },
    {
      type: 'example',
      title: 'Installation and Basic Setup',
      content: 'Installing better-sqlite3 and opening (or creating) a SQLite database file with a basic schema.',
      code: `# Install better-sqlite3
npm install better-sqlite3

# TypeScript types (optional but recommended)
npm install --save-dev @types/better-sqlite3

# ---- src/database.js ----
const Database = require('better-sqlite3');

// Open a database file (creates it if it doesn't exist)
const db = new Database('./myapp.db');

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');

// Enable foreign key enforcement (disabled by default in SQLite)
db.pragma('foreign_keys = ON');

// Create a table if it doesn't exist
db.exec(\`
  CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    email      TEXT NOT NULL UNIQUE,
    name       TEXT NOT NULL,
    plan       TEXT NOT NULL DEFAULT 'free',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
\`);

// Insert a row
const insertUser = db.prepare(\`
  INSERT INTO users (email, name, plan)
  VALUES (@email, @name, @plan)
\`);

const result = insertUser.run({
  email: 'alice@example.com',
  name: 'Alice Chen',
  plan: 'pro'
});

console.log('Inserted with id:', result.lastInsertRowid);

// Query rows
const getUser = db.prepare('SELECT * FROM users WHERE email = ?');
const user = getUser.get('alice@example.com');
console.log(user);
// { id: 1, email: 'alice@example.com', name: 'Alice Chen', plan: 'pro', created_at: '...' }`,
      language: 'javascript'
    },
    {
      type: 'heading',
      content: 'Synchronous API Patterns'
    },
    {
      type: 'text',
      content: 'better-sqlite3 has three core query methods: run (for INSERT/UPDATE/DELETE), get (for SELECT returning one row), and all (for SELECT returning all rows). Prepared statements are objects created once and executed many times — they are more efficient than string queries and prevent SQL injection.'
    },
    {
      type: 'table',
      title: 'better-sqlite3 Query Methods',
      headers: ['Method', 'Use For', 'Returns'],
      rows: [
        ['stmt.run(...args)', 'INSERT, UPDATE, DELETE', '{ changes, lastInsertRowid }'],
        ['stmt.get(...args)', 'SELECT returning one row', 'Single row object or undefined'],
        ['stmt.all(...args)', 'SELECT returning multiple rows', 'Array of row objects'],
        ['stmt.iterate(...args)', 'SELECT large result sets', 'Iterator (lazy, memory efficient)'],
        ['db.exec(sql)', 'Run multiple statements at once', 'void (no result)'],
        ['db.prepare(sql)', 'Create a prepared statement', 'Statement object']
      ]
    },
    {
      type: 'heading',
      content: 'In-Memory Databases'
    },
    {
      type: 'text',
      content: 'You can open SQLite entirely in memory by passing \':memory:\' instead of a file path. An in-memory database is created fresh and exists only while the process runs — when the process exits, all data is gone. This is ideal for testing: each test can create a fresh database in microseconds without cleaning up files.'
    },
    {
      type: 'text',
      content: 'In-memory SQLite is dramatically faster than file-based SQLite because there are no disk I/O operations. For test suites with hundreds of database operations, the speed difference is significant.'
    },
    {
      type: 'example',
      title: 'In-Memory Database for Testing',
      content: 'Creating a fresh in-memory SQLite database for tests, with schema setup, test data insertion, and assertions.',
      code: `const Database = require('better-sqlite3');

// In-memory database — no file created, no cleanup needed
function createTestDb() {
  const db = new Database(':memory:');
  db.pragma('foreign_keys = ON');

  db.exec(\`
    CREATE TABLE users (
      id    INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      name  TEXT NOT NULL,
      plan  TEXT NOT NULL DEFAULT 'free'
    );
    CREATE TABLE orders (
      id      INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      amount  REAL NOT NULL
    );
  \`);

  return db;
}

// Jest test example
describe('User queries', () => {
  let db;

  beforeEach(() => {
    // Fresh database for every test — no interference between tests
    db = createTestDb();
    db.prepare('INSERT INTO users (email, name) VALUES (?, ?)').run(
      'alice@example.com', 'Alice Chen'
    );
  });

  afterEach(() => {
    db.close();
  });

  test('finds user by email', () => {
    const user = db.prepare('SELECT * FROM users WHERE email = ?')
                   .get('alice@example.com');
    expect(user.name).toBe('Alice Chen');
  });

  test('returns undefined for missing user', () => {
    const user = db.prepare('SELECT * FROM users WHERE email = ?')
                   .get('nobody@example.com');
    expect(user).toBeUndefined();
  });
});`,
      language: 'javascript'
    },
    {
      type: 'note',
      title: 'Named Parameters',
      content: 'better-sqlite3 supports both positional (?) and named (@paramName or :paramName) parameters. Named parameters are preferred when a query has many inputs — they are self-documenting and immune to parameter order mistakes. stmt.run({ email: "a@b.com", name: "Alice" }) is clearer than stmt.run("a@b.com", "Alice").'
    },
    {
      type: 'tip',
      title: 'TypeScript with better-sqlite3',
      content: 'With @types/better-sqlite3 installed, you get full type safety. Define interfaces for your row types: interface User { id: number; email: string; name: string } and use db.prepare(...).get() as User for typed results. In Node.js 22+, you can also use the built-in node:sqlite module (experimental).'
    },
    {
      type: 'tryit',
      title: 'Node.js SQLite Query Simulator',
      js: `document.body.innerHTML = '<div><h3>Node.js SQLite Query Simulator</h3><p>Simulate better-sqlite3 queries</p><div class="layout"><div id="btns"></div><div id="right"><code id="code"></code><div id="result"></div></div></div></div>';

// Simulate a better-sqlite3 in-memory database in the browser
const db = {
  users: [
    { id: 1, email: 'alice@example.com', name: 'Alice Chen', plan: 'pro' },
    { id: 2, email: 'bob@example.com', name: 'Bob Smith', plan: 'free' },
    { id: 3, email: 'carol@example.com', name: 'Carol Davis', plan: 'pro' },
  ],
  nextId: 4
};

const queries = {
  'stmt.all()': {
    code: "db.prepare('SELECT * FROM users').all()",
    fn: () => db.users
  },
  'stmt.get() by email': {
    code: "db.prepare('SELECT * FROM users WHERE email = ?').get('alice@example.com')",
    fn: () => db.users.find(u => u.email === 'alice@example.com')
  },
  'stmt.run() INSERT': {
    code: "insertUser.run({ email: 'dave@example.com', name: 'Dave', plan: 'free' })",
    fn: () => {
      if (!db.users.find(u => u.email === 'dave@example.com')) {
        db.users.push({ id: db.nextId++, email: 'dave@example.com', name: 'Dave', plan: 'free' });
      }
      const last = db.users[db.users.length - 1];
      return { changes: 1, lastInsertRowid: last.id };
    }
  },
  'stmt.all() after insert': {
    code: "db.prepare('SELECT * FROM users').all()",
    fn: () => db.users
  },
};

let activeKey = Object.keys(queries)[0];

function renderResult(result) {
  if (result === undefined) return '<span style="color:#718096;font-size:13px">undefined</span>';
  if (Array.isArray(result)) {
    if (!result.length) return '<span style="color:#718096;font-size:13px">[] (empty array)</span>';
    const cols = Object.keys(result[0]);
    const head = cols.map(c => \`<th style="background:#0F3B70;color:white;padding:6px 10px;text-align:left;font-size:11px;font-weight:700">\${c}</th>\`).join('');
    const body = result.map((r, i) =>
      \`<tr style="background:\${i%2===0?'#fff':'#f8fafc'}">\${cols.map(c => \`<td style="padding:6px 10px;font-size:12px;font-family:monospace;border-bottom:1px solid #e2e8f0">\${r[c]}</td>\`).join('')}</tr>\`
    ).join('');
    return \`<table style="border-collapse:collapse;border:1px solid #e2e8f0;border-radius:6px;overflow:hidden"><thead><tr>\${head}</tr></thead><tbody>\${body}</tbody></table>\`;
  }
  return \`<pre style="background:#f0f8ff;padding:10px;border-radius:6px;font-size:12px;color:#0F3B70;margin:0">\${JSON.stringify(result, null, 2)}</pre>\`;
}

function render() {
  document.getElementById('btns').innerHTML = Object.keys(queries).map(k =>
    \`<button onclick="runQ('\${k}')" style="display:block;width:100%;text-align:left;padding:8px 10px;border:none;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;margin-bottom:4px;background:\${k===activeKey?'#0F3B70':'#e2e8f0'};color:\${k===activeKey?'white':'#4a5568'}">\${k}</button>\`
  ).join('');
  const q = queries[activeKey];
  document.getElementById('code').textContent = q.code;
  document.getElementById('result').innerHTML = renderResult(q.fn());
}

window.runQ = function(k) { activeKey = k; render(); };
render();`,
      css: `body { padding: 20px; font-family: system-ui, sans-serif; background: #f7fafc; }
h3 { color: #0F3B70; margin: 0 0 6px 0; font-size: 15px; font-weight: 700; }
p { color: #718096; font-size: 13px; margin: 0 0 14px 0; }
.layout { display: flex; gap: 16px; }
#btns { width: 180px; flex-shrink: 0; }
#right { flex: 1; min-width: 0; }
#code { display: block; font-family: monospace; font-size: 12px; background: #1a2a3a; color: #7ec8e3; padding: 8px 12px; border-radius: 6px; margin-bottom: 12px; white-space: pre-wrap; }
#result { overflow-x: auto; }`
    }
  ],
  exercises: [
    {
      id: 'ex-sqlite-2-1',
      question: 'What is the advantage of better-sqlite3\'s synchronous API over node-sqlite3\'s async API?',
      type: 'multiple-choice',
      options: [
        'Synchronous code always runs faster than async code',
        'Simpler code with no callback/promise complexity, and actually faster due to no async overhead per query',
        'It supports more SQL features',
        'It automatically handles connection pooling'
      ],
      correct: 1,
      explanation: 'better-sqlite3\'s synchronous API is simpler (no callbacks or promise chains) and faster (no per-query async overhead). SQLite queries are so fast (microseconds) that the tiny event loop block is acceptable in most applications.'
    },
    {
      id: 'ex-sqlite-2-2',
      question: 'What does new Database(\':memory:\') create?',
      type: 'multiple-choice',
      options: [
        'A database in the system\'s /tmp directory',
        'An in-memory database that exists only while the process runs and is lost on exit',
        'A database backed up to memory for faster access',
        'A memory-optimized version of a file database'
      ],
      correct: 1,
      explanation: 'Passing \':memory:\' creates a database entirely in RAM. No file is created. The database is completely fresh and empty, making it perfect for test isolation. When the process ends or db.close() is called, all data is gone.'
    },
    {
      id: 'ex-sqlite-2-3',
      question: 'What does db.prepare(sql).get(param) return when no row matches?',
      type: 'multiple-choice',
      options: ['null', 'undefined', 'An empty object {}', 'An error is thrown'],
      correct: 1,
      explanation: 'When no row matches, .get() returns undefined. You should always check: const user = stmt.get(id); if (!user) { ... }. This is consistent with JavaScript\'s undefined-for-missing-values convention.'
    }
  ],
  quiz: [
    {
      id: 'q-sqlite-2-1',
      question: 'Which better-sqlite3 method is used for SELECT queries returning multiple rows?',
      options: ['.run()', '.get()', '.all()', '.exec()'],
      correct: 2,
      explanation: '.all() returns an array of all matching rows. .get() returns only the first matching row (or undefined). .run() is for INSERT/UPDATE/DELETE. .exec() runs raw SQL without returning results.'
    },
    {
      id: 'q-sqlite-2-2',
      question: 'What does stmt.run() return after a successful INSERT?',
      options: [
        'The inserted row as an object',
        '{ changes: number, lastInsertRowid: number }',
        'The number of rows in the table',
        'undefined'
      ],
      correct: 1,
      explanation: 'stmt.run() returns an object with two properties: changes (number of rows affected) and lastInsertRowid (the rowid of the last inserted row, useful for getting the auto-generated ID).'
    },
    {
      id: 'q-sqlite-2-3',
      question: 'Why should you always run PRAGMA foreign_keys = ON at the start of a connection?',
      options: [
        'It is required for SQLite to start correctly',
        'Foreign key enforcement is disabled by default in SQLite; without this, referential integrity is not enforced',
        'It makes queries run faster',
        'It enables JSON support'
      ],
      correct: 1,
      explanation: 'SQLite ships with foreign key enforcement disabled for backwards compatibility. Without PRAGMA foreign_keys = ON, you can insert rows with invalid foreign key values and delete parent rows that have children. Always enable this pragma.'
    }
  ]
};
