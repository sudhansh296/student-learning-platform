import type { SqliteLesson } from '../sqlite-curriculum';

export const lesson06: SqliteLesson = {
  id: 'sqlite-06',
  title: 'SQLite Quick Reference',
  slug: '06-references',
  chapter: 'advanced',
  order: 6,
  difficulty: 'beginner',
  readingTime: 7,
  description: 'SQLite cheat sheet, CLI dot commands, PRAGMA reference, better-sqlite3 API summary, and common patterns.',
  sections: [
    {
      type: 'text',
      content: 'This reference covers the essential SQLite-specific syntax, pragmas, and better-sqlite3 API patterns. Use it alongside the SQL Quick Reference from the SQL course for complete coverage.'
    },
    {
      type: 'heading',
      content: 'SQLite CLI Dot Commands'
    },
    {
      type: 'table',
      title: 'sqlite3 Shell Commands',
      headers: ['Command', 'Description'],
      rows: [
        ['.help', 'Show all available dot commands'],
        ['.tables', 'List all tables in the database'],
        ['.schema [table]', 'Show CREATE TABLE statement for a table (or all tables)'],
        ['.mode column', 'Display results in aligned columns'],
        ['.headers on', 'Show column names in query output'],
        ['.open filename', 'Open a different database file'],
        ['.read file.sql', 'Execute SQL from a file'],
        ['.output file.sql', 'Redirect query output to a file'],
        ['.dump', 'Export entire database as SQL'],
        ['.import file.csv table', 'Import CSV data into a table'],
        ['.quit', 'Exit the sqlite3 shell']
      ]
    },
    {
      type: 'heading',
      content: 'Important PRAGMA Settings'
    },
    {
      type: 'table',
      title: 'SQLite PRAGMA Reference',
      headers: ['PRAGMA', 'Default', 'Recommended', 'Purpose'],
      rows: [
        ['foreign_keys', 'OFF', 'ON', 'Enforce foreign key constraints'],
        ['journal_mode', 'DELETE', 'WAL', 'Better concurrent read performance'],
        ['synchronous', 'FULL', 'NORMAL (with WAL)', 'Trade-off between safety and speed'],
        ['cache_size', '-2000', '-64000', 'Page cache size in KB (negative = KB, positive = pages)'],
        ['temp_store', 'DEFAULT', 'MEMORY', 'Store temp tables in RAM'],
        ['mmap_size', '0', '268435456', 'Memory-mapped I/O in bytes (256MB)'],
        ['busy_timeout', '0', '5000', 'Wait ms before returning SQLITE_BUSY error'],
        ['strict', 'OFF (per table)', 'ON (per table)', 'Enable strict type checking (SQLite 3.37+)']
      ]
    },
    {
      type: 'heading',
      content: 'better-sqlite3 API Reference'
    },
    {
      type: 'table',
      title: 'better-sqlite3 Core API',
      headers: ['Method', 'Returns', 'Use For'],
      rows: [
        ['new Database(path, opts?)', 'Database', 'Open or create a database file'],
        ['new Database(\':memory\')', 'Database', 'Open an in-memory database'],
        ['db.pragma(statement)', 'any', 'Run a PRAGMA command'],
        ['db.exec(sql)', 'void', 'Run multiple SQL statements at once'],
        ['db.prepare(sql)', 'Statement', 'Create a prepared statement'],
        ['stmt.run(...args)', '{ changes, lastInsertRowid }', 'INSERT, UPDATE, DELETE'],
        ['stmt.get(...args)', 'row | undefined', 'SELECT returning one row'],
        ['stmt.all(...args)', 'row[]', 'SELECT returning all rows'],
        ['stmt.iterate(...args)', 'Iterator', 'SELECT with lazy iteration (large results)'],
        ['db.transaction(fn)', 'Function', 'Create an atomic transaction wrapper'],
        ['db.close()', 'void', 'Close the database connection'],
        ['db.backup(dest)', 'Promise', 'Online backup to another file']
      ]
    },
    {
      type: 'heading',
      content: 'Common Patterns'
    },
    {
      type: 'list',
      title: 'Production SQLite patterns:',
      items: [
        'Enable WAL + foreign_keys in a single setup function called after every connection open',
        'Prepare all statements once at module initialization, not inside request handlers',
        'Use :memory: databases in tests with beforeEach to get a fresh isolated DB every test',
        'Wrap bulk inserts in a single transaction — 100x faster than auto-commit inserts',
        'Use db.backup() for online backups without closing the database',
        'Index foreign key columns and frequently filtered columns for JOIN performance'
      ]
    },
    {
      type: 'example',
      title: 'SQLite Cheat Sheet',
      content: 'Essential SQLite syntax, pragmas, and better-sqlite3 patterns in one reference block.',
      code: `// ===== SETUP =====
const Database = require('better-sqlite3');
const db = new Database('./app.db'); // or ':memory:' for tests

// Recommended pragmas (set on every connection)
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.pragma('synchronous = NORMAL');

// ===== SCHEMA =====
db.exec(\`
  CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    email      TEXT NOT NULL UNIQUE,
    name       TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
\`);

// ===== CRUD =====
// Create
const insert = db.prepare(
  'INSERT INTO users (email, name) VALUES (@email, @name)'
);
const { lastInsertRowid } = insert.run({ email: 'a@b.com', name: 'Alice' });

// Read
const getById    = db.prepare('SELECT * FROM users WHERE id = ?');
const getByEmail = db.prepare('SELECT * FROM users WHERE email = ?');
const getAll     = db.prepare('SELECT * FROM users ORDER BY name');

const user = getById.get(lastInsertRowid);  // single row or undefined
const all  = getAll.all();                  // array of rows

// Update
db.prepare('UPDATE users SET name = ? WHERE id = ?').run('Alice Chen', 1);

// Delete
db.prepare('DELETE FROM users WHERE id = ?').run(1);

// ===== TRANSACTION =====
const bulkInsert = db.transaction((users) => {
  const stmt = db.prepare('INSERT INTO users (email, name) VALUES (@email, @name)');
  for (const u of users) stmt.run(u);
});
bulkInsert([
  { email: 'b@ex.com', name: 'Bob' },
  { email: 'c@ex.com', name: 'Carol' },
]);

// ===== SQLITE-SPECIFIC SQL =====
-- Enable foreign keys (per connection, not stored in file)
PRAGMA foreign_keys = ON;

-- Enable WAL mode (stored in file, persists across connections)
PRAGMA journal_mode = WAL;

-- SQLite date/time functions
SELECT datetime('now');                 -- UTC timestamp
SELECT datetime('now', 'localtime');    -- Local time
SELECT datetime('now', '+7 days');      -- 7 days from now
SELECT strftime('%Y-%m', created_at)    -- Format date

-- UPSERT (INSERT OR REPLACE)
INSERT OR REPLACE INTO users (id, email, name) VALUES (1, 'new@ex.com', 'New Name');

-- UPSERT (ON CONFLICT DO UPDATE) -- SQLite 3.24+
INSERT INTO users (email, name) VALUES ('a@ex.com', 'Alice')
ON CONFLICT(email) DO UPDATE SET name = excluded.name;

// ===== CLOSE =====
db.close();`,
      language: 'javascript'
    },
    {
      type: 'tryit',
      title: 'Searchable SQLite Reference',
      js: `document.body.innerHTML = \`
  <div>
    <h3>SQLite Quick Reference</h3>
    <input type="text" id="search" placeholder="Search commands, pragmas, SQL..." />
    <span id="count"></span>
    <div id="results"></div>
  </div>
\`;

const entries = [
  { item: 'new Database(path)', cat: 'API', desc: 'Open/create a database file' },
  { item: 'new Database(\\':memory\\')', cat: 'API', desc: 'Create an in-memory database (for tests)' },
  { item: 'db.pragma(\\'foreign_keys = ON\\')', cat: 'PRAGMA', desc: 'Enable foreign key enforcement (do this every connection)' },
  { item: 'db.pragma(\\'journal_mode = WAL\\')', cat: 'PRAGMA', desc: 'Enable WAL mode for better concurrency' },
  { item: 'db.pragma(\\'synchronous = NORMAL\\')', cat: 'PRAGMA', desc: 'Faster writes, still crash-safe with WAL' },
  { item: 'db.exec(sql)', cat: 'API', desc: 'Execute multiple SQL statements at once, no result returned' },
  { item: 'db.prepare(sql)', cat: 'API', desc: 'Create a reusable prepared statement' },
  { item: 'stmt.run(params)', cat: 'API', desc: 'Execute INSERT/UPDATE/DELETE, returns { changes, lastInsertRowid }' },
  { item: 'stmt.get(params)', cat: 'API', desc: 'Execute SELECT, returns first row or undefined' },
  { item: 'stmt.all(params)', cat: 'API', desc: 'Execute SELECT, returns array of all rows' },
  { item: 'stmt.iterate(params)', cat: 'API', desc: 'Execute SELECT, returns lazy iterator for large results' },
  { item: 'db.transaction(fn)', cat: 'API', desc: 'Wrap a function in an atomic transaction, auto-rollback on error' },
  { item: 'db.close()', cat: 'API', desc: 'Close the database connection' },
  { item: '.tables', cat: 'CLI', desc: 'List all tables in the current database' },
  { item: '.schema [table]', cat: 'CLI', desc: 'Show CREATE TABLE statement' },
  { item: '.mode column', cat: 'CLI', desc: 'Format output as aligned columns' },
  { item: '.headers on', cat: 'CLI', desc: 'Show column names in output' },
  { item: '.dump', cat: 'CLI', desc: 'Export entire database as SQL statements' },
  { item: 'INTEGER PRIMARY KEY', cat: 'SQL', desc: 'Auto-incrementing integer ID (rowid alias)' },
  { item: 'datetime(\\'now\\')', cat: 'SQL', desc: 'Current UTC timestamp as text' },
  { item: 'ON CONFLICT DO UPDATE', cat: 'SQL', desc: 'UPSERT — insert or update on conflict (3.24+)' },
  { item: 'STRICT tables', cat: 'SQL', desc: 'Enable strict type checking per table (3.37+)' },
];

const catColors = { API: '#0F3B70', PRAGMA: '#8b5cf6', CLI: '#10b981', SQL: '#f59e0b' };
let search = '';

function render() {
  const filtered = entries.filter(e =>
    e.item.toLowerCase().includes(search.toLowerCase()) ||
    e.desc.toLowerCase().includes(search.toLowerCase()) ||
    e.cat.toLowerCase().includes(search.toLowerCase())
  );
  document.getElementById('results').innerHTML = filtered.map(e =>
    \`<div style="background:white;border:1px solid #e2e8f0;border-radius:8px;padding:11px;border-left:4px solid \${catColors[e.cat]||'#ccc'}">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
        <code style="font-family:monospace;font-size:12px;font-weight:700;color:#1a202c">\${e.item}</code>
        <span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;background:\${catColors[e.cat]}22;color:\${catColors[e.cat]};flex-shrink:0">\${e.cat}</span>
      </div>
      <div style="font-size:12px;color:#4a5568">\${e.desc}</div>
    </div>\`
  ).join('');
  document.getElementById('count').textContent = filtered.length + ' of ' + entries.length + ' items';
}

document.getElementById('search').addEventListener('input', e => { search = e.target.value; render(); });
render();`,
      css: `body { padding: 20px; font-family: system-ui, sans-serif; background: #f7fafc; }
h3 { color: #0F3B70; margin: 0 0 8px 0; font-size: 15px; font-weight: 700; }
#search { width: 100%; padding: 9px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; background: white; outline: none; margin-bottom: 8px; box-sizing: border-box; }
#search:focus { border-color: #0F3B70; }
#count { font-size: 12px; color: #718096; margin-bottom: 12px; display: block; }
#results { display: grid; gap: 8px; }`
    }
  ],
  exercises: [
    {
      id: 'ex-sqlite-6-1',
      question: 'Which CLI command shows the CREATE TABLE statement for a table?',
      type: 'multiple-choice',
      options: ['.describe users', '.schema users', '.structure users', 'SHOW CREATE TABLE users'],
      correct: 1,
      explanation: '.schema users shows the CREATE TABLE statement that was used to create the users table. SHOW CREATE TABLE is MySQL syntax and does not work in SQLite\'s CLI.'
    },
    {
      id: 'ex-sqlite-6-2',
      question: 'What does db.pragma(\'busy_timeout = 5000\') do?',
      type: 'multiple-choice',
      options: [
        'Sets the maximum query execution time to 5 seconds',
        'Makes SQLite wait up to 5000ms when the database is locked before returning a SQLITE_BUSY error',
        'Allocates 5000 bytes of memory for the database',
        'Runs VACUUM after 5000 operations'
      ],
      correct: 1,
      explanation: 'busy_timeout tells SQLite how long to retry when it encounters a locked database (SQLITE_BUSY). Without it (default 0), SQLite immediately returns an error. With a 5000ms timeout, it retries for up to 5 seconds, which handles brief write contention gracefully.'
    }
  ],
  quiz: [
    {
      id: 'q-sqlite-6-1',
      question: 'What is the SQLite equivalent of PostgreSQL\'s SERIAL PRIMARY KEY?',
      options: [
        'AUTO_INCREMENT PRIMARY KEY',
        'INTEGER PRIMARY KEY (with or without AUTOINCREMENT)',
        'SEQUENCE PRIMARY KEY',
        'ROWID PRIMARY KEY'
      ],
      correct: 1,
      explanation: 'INTEGER PRIMARY KEY in SQLite creates an alias for the built-in rowid, which is automatically assigned. It is equivalent to SERIAL/AUTO_INCREMENT in other databases. AUTOINCREMENT adds the guarantee that IDs never decrease, but is optional.'
    },
    {
      id: 'q-sqlite-6-2',
      question: 'Which SQLite date function returns the current UTC timestamp as a text string?',
      options: ['NOW()', 'CURRENT_TIMESTAMP', 'datetime(\'now\')', 'GETDATE()'],
      correct: 2,
      explanation: 'datetime(\'now\') returns the current UTC time as a text string in ISO 8601 format (YYYY-MM-DD HH:MM:SS). CURRENT_TIMESTAMP is also valid SQL in SQLite. NOW() is MySQL/PostgreSQL syntax and does not work in SQLite.'
    }
  ]
};
