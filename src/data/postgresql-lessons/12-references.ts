import type { PostgresqlLesson } from '../postgresql-curriculum';

export const lesson12: PostgresqlLesson = {
  id: 'postgresql-12',
  title: 'Quick Reference and Best Practices',
  slug: '12-references',
  chapter: 'advanced',
  order: 12,
  difficulty: 'beginner',
  readingTime: 10,
  description: 'A comprehensive cheat sheet of PostgreSQL commands, naming conventions, security checklist, common pitfalls, and useful extensions.',
  sections: [
    {
      type: 'text',
      content: 'This reference lesson consolidates everything you have learned into quick-access summaries, best practices, and common pitfalls to avoid as you build production applications with PostgreSQL.'
    },
    {
      type: 'heading',
      content: 'Core SQL Cheat Sheet'
    },
    {
      type: 'table',
      title: 'Data Definition Language (DDL)',
      headers: ['Command', 'Syntax', 'Description'],
      rows: [
        ['CREATE TABLE', 'CREATE TABLE name (col type constraint)', 'Create a new table'],
        ['ALTER TABLE', 'ALTER TABLE name ADD/DROP/RENAME', 'Modify existing table'],
        ['DROP TABLE', 'DROP TABLE IF EXISTS name', 'Remove a table'],
        ['CREATE INDEX', 'CREATE INDEX ON table(col)', 'Create an index'],
        ['CREATE VIEW', 'CREATE VIEW name AS SELECT ...', 'Create a virtual table'],
        ['TRUNCATE', 'TRUNCATE TABLE name', 'Remove all rows quickly']
      ]
    },
    {
      type: 'table',
      title: 'Data Manipulation Language (DML)',
      headers: ['Command', 'Syntax', 'Description'],
      rows: [
        ['INSERT', 'INSERT INTO t (cols) VALUES (...)', 'Add new rows'],
        ['SELECT', 'SELECT cols FROM t WHERE cond ORDER BY col LIMIT n', 'Read rows'],
        ['UPDATE', 'UPDATE t SET col=val WHERE cond', 'Modify existing rows'],
        ['DELETE', 'DELETE FROM t WHERE cond', 'Remove rows'],
        ['UPSERT', 'INSERT ... ON CONFLICT (col) DO UPDATE SET ...', 'Insert or update']
      ]
    },
    {
      type: 'table',
      title: 'Transactions and Control',
      headers: ['Command', 'Description'],
      rows: [
        ['BEGIN', 'Start a transaction'],
        ['COMMIT', 'Save all changes in the transaction'],
        ['ROLLBACK', 'Undo all changes since BEGIN'],
        ['SAVEPOINT name', 'Create a partial rollback point'],
        ['ROLLBACK TO name', 'Roll back to a savepoint'],
        ['SET LOCAL setting = val', 'Set a configuration parameter for this transaction']
      ]
    },
    {
      type: 'heading',
      content: 'psql Quick Reference'
    },
    {
      type: 'table',
      title: 'Essential psql Meta-Commands',
      headers: ['Command', 'Description'],
      rows: [
        ['\\l', 'List all databases'],
        ['\\c dbname', 'Connect to a database'],
        ['\\dt', 'List tables in current schema'],
        ['\\d tablename', 'Describe table structure'],
        ['\\di', 'List indexes'],
        ['\\dv', 'List views'],
        ['\\df', 'List functions'],
        ['\\du', 'List users/roles'],
        ['\\e', 'Open last query in external editor'],
        ['\\i file.sql', 'Run SQL from a file'],
        ['\\timing', 'Toggle query execution timing'],
        ['\\q', 'Quit psql']
      ]
    },
    {
      type: 'heading',
      content: 'Naming Conventions'
    },
    {
      type: 'list',
      title: 'PostgreSQL naming best practices:',
      items: [
        'Use lowercase_with_underscores for all identifiers (tables, columns, indexes)',
        'Table names: plural nouns (users, products, order_items) OR singular consistently',
        'Primary key: id (BIGSERIAL in new projects) or table_id (e.g., user_id when used as FK)',
        'Foreign keys: reference the target table name -- user_id, product_id, order_id',
        'Timestamps: created_at, updated_at, deleted_at (all TIMESTAMPTZ)',
        'Boolean columns: prefix with is_ or has_ -- is_active, has_verified_email',
        'Index names: idx_tablename_column(s) -- idx_users_email, idx_orders_user_status',
        'Constraint names: chk_ for CHECK, fk_ for FOREIGN KEY, uq_ for UNIQUE'
      ]
    },
    {
      type: 'heading',
      content: 'Connection Pooling Best Practices'
    },
    {
      type: 'list',
      title: 'Configure your connection pool correctly:',
      items: [
        'Set pool max to (CPU cores * 2) + number of disk spindles -- typically 10-20 for most apps',
        'Set idleTimeoutMillis to 30000 (30 seconds) to reclaim idle connections',
        'Set connectionTimeoutMillis to 2000 (2 seconds) to fail fast on pool exhaustion',
        'Use a single pool instance shared across your entire application (module singleton)',
        'For serverless/edge functions, use a pooler like PgBouncer or Supabase Pooler',
        'Monitor pool usage -- if queries are waiting frequently, increase max or optimize slow queries'
      ]
    },
    {
      type: 'heading',
      content: 'Security Checklist'
    },
    {
      type: 'list',
      title: 'Essential security practices:',
      items: [
        'Always use parameterized queries -- never string-concatenate user input into SQL',
        'Use a dedicated application database user with minimum required privileges (not postgres)',
        'Never expose the postgres superuser to your application',
        'Store credentials in environment variables, never in source code',
        'Enable SSL/TLS for all database connections (ssl: true in pg Pool config)',
        'Use Row-Level Security (RLS) for multi-tenant data isolation',
        'Regularly rotate database passwords',
        'Use pg_audit extension to log all data access for compliance'
      ]
    },
    {
      type: 'heading',
      content: 'Common Pitfalls'
    },
    {
      type: 'list',
      title: 'Mistakes to avoid:',
      items: [
        'N+1 Problem: running one query in a loop instead of one JOIN query -- kills performance',
        'Missing indexes on foreign key columns and frequently-filtered columns',
        'Using SELECT * in production -- always specify the columns you actually need',
        'Long-running transactions -- keep them as short as possible to avoid lock contention',
        'Not using EXPLAIN ANALYZE before deploying slow queries',
        'Storing money as FLOAT -- always use NUMERIC(10,2) for exact decimal precision',
        'Timezone mistakes -- always use TIMESTAMPTZ, not TIMESTAMP, in production',
        'Forgetting WHERE in UPDATE or DELETE -- always preview with SELECT first'
      ]
    },
    {
      type: 'heading',
      content: 'Database Migrations'
    },
    {
      type: 'example',
      title: 'Using node-pg-migrate',
      content: 'Managing schema changes safely with migrations:',
      code: `# Install node-pg-migrate
npm install node-pg-migrate

# Create a migration file
npx node-pg-migrate create add-users-table

# Migration file (migrations/1234567890_add-users-table.js):
exports.up = (pgm) => {
  pgm.createTable('users', {
    id:         { type: 'serial', primaryKey: true },
    email:      { type: 'varchar(255)', notNull: true, unique: true },
    name:       { type: 'varchar(100)', notNull: true },
    created_at: { type: 'timestamptz', default: pgm.func('NOW()') }
  });
  pgm.createIndex('users', 'email');
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};

# Run migrations
DATABASE_URL=postgres://user:pass@localhost/mydb npx node-pg-migrate up

# Roll back one migration
DATABASE_URL=postgres://user:pass@localhost/mydb npx node-pg-migrate down`,
      language: 'bash',
      output: 'Creating migration file: 1234567890_add-users-table.js\n> Migrating file: 1234567890_add-users-table.js\n> Done'
    },
    {
      type: 'heading',
      content: 'Useful Extensions'
    },
    {
      type: 'table',
      title: 'Popular PostgreSQL Extensions',
      headers: ['Extension', 'Install', 'What it Does'],
      rows: [
        ['uuid-ossp', 'CREATE EXTENSION "uuid-ossp"', 'uuid_generate_v4() for UUID primary keys'],
        ['pgcrypto', 'CREATE EXTENSION pgcrypto', 'Password hashing with crypt(), gen_random_uuid()'],
        ['pg_trgm', 'CREATE EXTENSION pg_trgm', 'Trigram similarity for fuzzy text search (ILIKE with index)'],
        ['pg_stat_statements', 'In postgresql.conf + CREATE EXTENSION', 'Track which queries consume the most time'],
        ['postgis', 'CREATE EXTENSION postgis', 'Geographic data types and spatial queries'],
        ['tablefunc', 'CREATE EXTENSION tablefunc', 'CROSSTAB() for pivot tables']
      ]
    },
    {
      type: 'tip',
      title: 'pg_stat_statements is Essential',
      content: 'Enable pg_stat_statements on any production database. It tracks execution count and total/min/max/mean time for every query. SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10; shows your slowest queries instantly.'
    },
    {
      type: 'heading',
      content: 'The N+1 Problem'
    },
    {
      type: 'example',
      title: 'N+1 vs JOIN Solution',
      content: 'The most common performance anti-pattern and how to fix it:',
      code: `-- N+1 PROBLEM (do NOT do this in application code):
-- Query 1: get all orders
const orders = await pool.query('SELECT * FROM orders');
// Query 2..N+1: for each order, get the user separately
for (const order of orders.rows) {
  const user = await pool.query('SELECT * FROM users WHERE id = $1', [order.user_id]);
  order.user = user.rows[0];
}
-- 100 orders = 101 queries!

-- SOLUTION: one JOIN query
SELECT
  o.id,
  o.total,
  o.status,
  u.name,
  u.email
FROM orders o
JOIN users u ON o.user_id = u.id;
-- 100 orders = 1 query`,
      language: 'sql',
      output: '-- N+1: 101 round trips to database\n-- JOIN: 1 round trip -- 100x faster'
    },
    {
      type: 'tryit',
      title: 'Interactive SQL Cheat Sheet',
      js: `const output = document.getElementById('output');

const commands = [
  { cmd:'SELECT', syntax:'SELECT col1, col2 FROM table WHERE cond ORDER BY col LIMIT n', desc:'Read rows from a table', category:'DML' },
  { cmd:'INSERT', syntax:'INSERT INTO table (col1, col2) VALUES (val1, val2) RETURNING *', desc:'Add new rows to a table', category:'DML' },
  { cmd:'UPDATE', syntax:'UPDATE table SET col = val WHERE cond RETURNING *', desc:'Modify existing rows', category:'DML' },
  { cmd:'DELETE', syntax:'DELETE FROM table WHERE cond', desc:'Remove rows from a table', category:'DML' },
  { cmd:'CREATE TABLE', syntax:'CREATE TABLE name (id SERIAL PRIMARY KEY, col TYPE constraint)', desc:'Create a new table', category:'DDL' },
  { cmd:'ALTER TABLE', syntax:'ALTER TABLE name ADD/DROP/RENAME COLUMN col TYPE', desc:'Modify table structure', category:'DDL' },
  { cmd:'DROP TABLE', syntax:'DROP TABLE IF EXISTS name CASCADE', desc:'Remove a table and its data', category:'DDL' },
  { cmd:'CREATE INDEX', syntax:'CREATE INDEX idx_name ON table(col)', desc:'Create an index for faster queries', category:'DDL' },
  { cmd:'JOIN', syntax:'FROM t1 JOIN t2 ON t1.id = t2.t1_id', desc:'Combine rows from two tables', category:'Query' },
  { cmd:'LEFT JOIN', syntax:'FROM t1 LEFT JOIN t2 ON t1.id = t2.t1_id', desc:'All rows from left, matching from right', category:'Query' },
  { cmd:'GROUP BY', syntax:'SELECT col, COUNT(*) FROM t GROUP BY col HAVING COUNT(*) > n', desc:'Group rows and apply aggregates', category:'Query' },
  { cmd:'WITH (CTE)', syntax:'WITH name AS (SELECT ...) SELECT * FROM name', desc:'Named temporary result set', category:'Query' },
  { cmd:'WINDOW', syntax:'ROW_NUMBER() OVER (PARTITION BY col ORDER BY col)', desc:'Compute values over a window of rows', category:'Query' },
  { cmd:'BEGIN', syntax:'BEGIN; ..queries..; COMMIT; / ROLLBACK;', desc:'Start a transaction block', category:'Transaction' },
  { cmd:'SAVEPOINT', syntax:'SAVEPOINT name; ... ROLLBACK TO name;', desc:'Create a partial rollback point', category:'Transaction' },
  { cmd:'EXPLAIN', syntax:'EXPLAIN ANALYZE SELECT ...', desc:'Show query execution plan and timing', category:'Performance' },
  { cmd:'CREATE INDEX (partial)', syntax:'CREATE INDEX ON t(col) WHERE cond', desc:'Index only rows matching a condition', category:'Performance' },
  { cmd:'VACUUM', syntax:'VACUUM ANALYZE table', desc:'Reclaim dead row space and update stats', category:'Performance' },
  { cmd:'JSONB operator', syntax:'metadata->>key or metadata @> {k:v}', desc:'Query inside JSONB columns', category:'Advanced' },
  { cmd:'FULL TEXT', syntax:"to_tsvector('english', text) @@ to_tsquery('word')", desc:'Full-text search on text columns', category:'Advanced' },
  { cmd:'ON CONFLICT', syntax:'INSERT ... ON CONFLICT (col) DO UPDATE SET col = EXCLUDED.col', desc:'Upsert: insert or update on conflict', category:'DML' }
];

const cats = ['All', ...new Set(commands.map(c => c.category))];
let search = '';
let category = 'All';

function filter() {
  return commands.filter(c => {
    const matchCat  = category === 'All' || c.category === category;
    const matchText = !search || [c.cmd, c.syntax, c.desc].some(f => f.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchText;
  });
}

function hl(text, q) {
  if (!q) return text;
  const safe = q.replace(/[-\\[\\]{}()*+?.,\\\\^$|#\\s]/g, '\\\\$&');
  const re = new RegExp('(' + safe + ')', 'gi');
  return text.replace(re, '<mark style="background:#fde047;border-radius:2px">$1</mark>');
}

const catColors = { DML:'#336791', DDL:'#7c3aed', Query:'#0369a1', Transaction:'#dc2626', Performance:'#15803d', Advanced:'#c2410c' };

function render() {
  const filtered = filter();
  let html = '<div style="padding:16px;font-family:system-ui,sans-serif">';
  html += '<h3 style="color:#336791;margin:0 0 4px">PostgreSQL Command Reference</h3>';
  html += '<p style="color:#64748b;font-size:12px;margin:0 0 12px">Search for any command, syntax, or description</p>';

  // Search
  html += '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">';
  html += \`<input id="search-in" type="text" value="\${search}" placeholder="Search commands..." onkeyup="updateSearch()"
    style="flex:1;min-width:180px;padding:8px 12px;border:1px solid #cbd5e1;border-radius:6px;font-size:12px">\`;
  html += '</div>';

  // Category buttons
  html += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px">';
  cats.forEach(c => {
    const active = c === category;
    const bg = active ? (catColors[c] || '#336791') : '#e2e8f0';
    const col = active ? 'white' : '#475569';
    html += \`<button onclick="setCat('\${c}')" style="background:\${bg};color:\${col};border:none;padding:5px 12px;border-radius:16px;cursor:pointer;font-size:11px;font-weight:600">\${c}</button>\`;
  });
  html += '</div>';

  html += \`<p style="font-size:11px;color:#94a3b8;margin:0 0 10px">\${filtered.length} commands</p>\`;

  if (filtered.length === 0) {
    html += '<div style="text-align:center;padding:20px;color:#94a3b8;background:#f8fafc;border-radius:8px">No matching commands found.</div>';
  } else {
    html += '<div style="display:grid;gap:8px">';
    filtered.forEach(c => {
      const col = catColors[c.category] || '#336791';
      html += \`<div style="background:#fff;border:1px solid #e2e8f0;border-left:3px solid \${col};border-radius:6px;padding:10px 14px">\`;
      html += \`<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">\`;
      html += \`<span style="background:\${col};color:white;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;font-family:monospace">\${hl(c.cmd, search)}</span>\`;
      html += \`<span style="background:\${col}11;color:\${col};padding:2px 7px;border-radius:10px;font-size:10px;font-weight:600">\${c.category}</span>\`;
      html += '</div>';
      html += \`<div style="font-family:monospace;font-size:11px;color:#475569;background:#f8fafc;padding:4px 8px;border-radius:4px;margin-bottom:4px;overflow-x:auto">\${hl(c.syntax, search)}</div>\`;
      html += \`<div style="font-size:12px;color:#64748b">\${hl(c.desc, search)}</div>\`;
      html += '</div>';
    });
    html += '</div>';
  }
  html += '</div>';
  output.innerHTML = html;
}

window.updateSearch = function() {
  search = document.getElementById('search-in')?.value || '';
  render();
};
window.setCat = function(c) { category = c; render(); };

render();`,
      css: ''
    }
  ],
  exercises: [
    {
      id: 'ex-12-1',
      question: 'What is the N+1 query problem?',
      type: 'multiple-choice',
      options: [
        'A bug that causes queries to run N+1 times due to infinite recursion',
        'Running one query to get a list, then N separate queries to get related data for each item, instead of one JOIN',
        'Having more than N+1 indexes on a table',
        'A transaction that requires N+1 savepoints'
      ],
      correct: 1,
      explanation: 'The N+1 problem occurs when you fetch a list of N items with one query, then execute a separate query for each item to get related data. The solution is to use a JOIN to get all needed data in one query, reducing database round trips from N+1 to 1.'
    },
    {
      id: 'ex-12-2',
      question: 'Which data type should you use for monetary values in PostgreSQL?',
      type: 'multiple-choice',
      options: ['FLOAT', 'DOUBLE PRECISION', 'NUMERIC(10,2)', 'MONEY'],
      correct: 2,
      explanation: 'NUMERIC(10,2) stores exact decimal values. FLOAT and DOUBLE PRECISION are floating-point types that can produce rounding errors (e.g., 0.1 + 0.2 = 0.30000000000000004). The MONEY type has locale-dependent formatting issues. Always use NUMERIC for financial data.'
    }
  ],
  quiz: [
    {
      id: 'q-12-1',
      question: 'Which extension tracks how long each type of query takes in PostgreSQL?',
      options: ['pg_trgm', 'uuid-ossp', 'pg_stat_statements', 'postgis'],
      correct: 2,
      explanation: 'pg_stat_statements records cumulative statistics about all SQL statements executed on the server. It tracks calls, total time, min/max/mean time, and rows for every unique query, making it essential for identifying slow queries in production.'
    },
    {
      id: 'q-12-2',
      question: 'What is the recommended way to handle schema changes in a production application?',
      options: [
        'Run ALTER TABLE directly on the production database during maintenance windows',
        'Drop and recreate the database on each deployment',
        'Use a migration tool like node-pg-migrate to version-control incremental schema changes',
        'Schema should never change after the initial deployment'
      ],
      correct: 2,
      explanation: 'Migration tools version-control schema changes as sequential files. Each migration is applied once and tracked in a migrations table. This allows schema changes to be reviewed, tested, and safely applied to multiple environments (dev, staging, production) in a controlled, repeatable way.'
    }
  ]
};
