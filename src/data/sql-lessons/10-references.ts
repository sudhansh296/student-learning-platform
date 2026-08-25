import type { SqlLesson } from '../sql-curriculum';

export const lesson10: SqlLesson = {
  id: 'sql-10',
  title: 'SQL Quick Reference',
  slug: '10-references',
  chapter: 'advanced',
  order: 10,
  difficulty: 'beginner',
  readingTime: 8,
  description: 'A comprehensive SQL cheat sheet organized by category, common mistakes, style guide, and naming conventions.',
  sections: [
    {
      type: 'text',
      content: 'This reference consolidates the essential SQL syntax and patterns from all previous lessons. Use it as a quick lookup when writing queries or designing schemas.'
    },
    {
      type: 'heading',
      content: 'DDL: Data Definition Language'
    },
    {
      type: 'table',
      title: 'DDL Commands',
      headers: ['Command', 'Purpose', 'Example'],
      rows: [
        ['CREATE TABLE', 'Define a new table', 'CREATE TABLE users (id SERIAL PRIMARY KEY, email VARCHAR(255) NOT NULL UNIQUE)'],
        ['ALTER TABLE ... ADD COLUMN', 'Add a column', 'ALTER TABLE users ADD COLUMN bio TEXT'],
        ['ALTER TABLE ... DROP COLUMN', 'Remove a column', 'ALTER TABLE users DROP COLUMN bio'],
        ['ALTER TABLE ... RENAME COLUMN', 'Rename a column', 'ALTER TABLE users RENAME COLUMN fname TO first_name'],
        ['DROP TABLE', 'Delete table and data', 'DROP TABLE IF EXISTS temp_data'],
        ['TRUNCATE TABLE', 'Delete all rows, keep structure', 'TRUNCATE TABLE sessions'],
        ['CREATE INDEX', 'Create an index', 'CREATE INDEX idx_users_email ON users (email)'],
        ['CREATE VIEW', 'Save a SELECT as a view', 'CREATE VIEW active_users AS SELECT * FROM users WHERE is_active = true']
      ]
    },
    {
      type: 'heading',
      content: 'DML: Data Manipulation Language'
    },
    {
      type: 'table',
      title: 'DML Commands',
      headers: ['Command', 'Purpose', 'Example'],
      rows: [
        ['INSERT INTO ... VALUES', 'Add rows', 'INSERT INTO users (email, name) VALUES (\'a@b.com\', &apos;Alice&apos;)'],
        ['INSERT ... RETURNING', 'Insert and return values', 'INSERT INTO users (email) VALUES (\'a@b.com\') RETURNING id'],
        ['SELECT ... FROM', 'Read rows', 'SELECT id, email FROM users WHERE is_active = true'],
        ['UPDATE ... SET', 'Modify rows', 'UPDATE users SET plan = \'pro\' WHERE id = 1'],
        ['DELETE FROM', 'Remove rows', 'DELETE FROM sessions WHERE expires_at < NOW()'],
        ['UPSERT (ON CONFLICT)', 'Insert or update', 'INSERT INTO ... ON CONFLICT (email) DO UPDATE SET ...']
      ]
    },
    {
      type: 'heading',
      content: 'Query Clauses in Execution Order'
    },
    {
      type: 'table',
      title: 'SELECT Clause Reference',
      headers: ['Clause', 'Purpose', 'Example'],
      rows: [
        ['FROM', 'Source table', 'FROM users u'],
        ['JOIN', 'Combine tables', 'LEFT JOIN orders o ON o.user_id = u.id'],
        ['WHERE', 'Filter rows', 'WHERE u.is_active = true'],
        ['GROUP BY', 'Group for aggregation', 'GROUP BY u.plan'],
        ['HAVING', 'Filter groups', 'HAVING COUNT(*) > 10'],
        ['SELECT', 'Choose columns', 'SELECT u.plan, COUNT(*) AS total'],
        ['DISTINCT', 'Remove duplicates', 'SELECT DISTINCT plan FROM users'],
        ['ORDER BY', 'Sort results', 'ORDER BY total DESC'],
        ['LIMIT / OFFSET', 'Paginate', 'LIMIT 20 OFFSET 40']
      ]
    },
    {
      type: 'heading',
      content: 'Common Mistakes'
    },
    {
      type: 'list',
      title: 'Mistakes every SQL developer makes at least once:',
      items: [
        'WHERE phone = NULL instead of WHERE phone IS NULL (NULL comparisons always return NULL)',
        'Using NOT IN when the subquery might return NULL values (use NOT EXISTS instead)',
        'Forgetting WHERE in UPDATE or DELETE - running UPDATE users SET plan = \'pro\' updates EVERY user',
        'SELECT * in production code - always name columns explicitly',
        'Putting aggregate conditions in WHERE instead of HAVING',
        'Not indexing foreign key columns - causes slow JOIN performance on large tables',
        'Using FLOAT for money - always use DECIMAL(10,2) for exact arithmetic',
        'Forgetting that GROUP BY requires all non-aggregated SELECT columns',
        'LIMIT without ORDER BY - returns unpredictable row subsets',
        'Assuming JOINs preserve order - always add ORDER BY when order matters'
      ]
    },
    {
      type: 'heading',
      content: 'SQL Style Guide'
    },
    {
      type: 'list',
      title: 'Readable SQL conventions:',
      items: [
        'Write SQL keywords in UPPERCASE (SELECT, FROM, WHERE) and identifiers in lowercase (users, email)',
        'Put each major clause on its own line (FROM, WHERE, GROUP BY, ORDER BY)',
        'Align column lists vertically for INSERT and SELECT with many columns',
        'Always alias table names in multi-table queries (FROM users u, JOIN orders o)',
        'Name indexes descriptively: idx_tablename_columnname (idx_orders_user_id)',
        'Name constraints explicitly: fk_orders_users, uq_users_email, ck_users_age'
      ]
    },
    {
      type: 'heading',
      content: 'Naming Conventions'
    },
    {
      type: 'table',
      title: 'Database Naming Conventions',
      headers: ['Object', 'Convention', 'Example'],
      rows: [
        ['Table', 'Plural snake_case', 'users, orders, product_categories'],
        ['Column', 'Singular snake_case', 'first_name, created_at, user_id'],
        ['Primary key', 'id (always)', 'id SERIAL PRIMARY KEY'],
        ['Foreign key', 'referenced_table_singular + _id', 'user_id, product_id, category_id'],
        ['Index', 'idx_table_column(s)', 'idx_orders_user_id, idx_users_email'],
        ['Unique constraint', 'uq_table_column', 'uq_users_email'],
        ['Foreign key constraint', 'fk_child_parent', 'fk_orders_users'],
        ['Check constraint', 'ck_table_column', 'ck_users_age'],
        ['View', 'Descriptive noun phrase', 'active_users, monthly_revenue']
      ]
    },
    {
      type: 'example',
      title: 'SQL Cheat Sheet',
      content: 'A comprehensive one-page reference of the most important SQL patterns.',
      code: `-- ===== CREATE TABLE =====
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  email      VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  plan       VARCHAR(20)  NOT NULL DEFAULT 'free',
  is_active  BOOLEAN      NOT NULL DEFAULT true,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ===== INSERT =====
INSERT INTO users (email, first_name, plan)
VALUES ('alice@example.com', 'Alice', 'pro')
RETURNING id;

-- ===== SELECT =====
SELECT id, first_name, plan
FROM users
WHERE plan = 'pro' AND is_active = true
ORDER BY first_name ASC
LIMIT 20 OFFSET 0;

-- ===== UPDATE (always use WHERE!) =====
UPDATE users
SET plan = 'enterprise', updated_at = CURRENT_TIMESTAMP
WHERE id = 42;

-- ===== DELETE (always use WHERE!) =====
DELETE FROM users WHERE id = 42;

-- ===== JOIN =====
SELECT u.first_name, u.email, o.amount
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.is_active = true;

-- ===== GROUP BY =====
SELECT plan, COUNT(*) AS users, SUM(revenue) AS total
FROM user_stats
GROUP BY plan
HAVING COUNT(*) > 5
ORDER BY total DESC;

-- ===== INDEX =====
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_orders_user_id ON orders (user_id);`,
      language: 'sql'
    },
    {
      type: 'tryit',
      title: 'SQL Command Reference Search',
      js: `// Initialize HTML structure
document.body.innerHTML = \`
  <div style="padding:20px;font-family:system-ui,sans-serif;background:#f7fafc">
    <h3 style="color:#336791;margin:0 0 8px 0;font-size:15px;font-weight:700">SQL Command Reference</h3>
    <input type="text" id="search" placeholder="Search commands..." style="width:100%;padding:9px 14px;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;background:white;outline:none;margin-bottom:10px;box-sizing:border-box" />
    <div id="count" style="font-size:12px;color:#718096;margin-bottom:12px;display:block"></div>
    <div id="results" style="display:grid;gap:8px"></div>
  </div>
\`;

const commands = [
  { cmd: 'SELECT', cat: 'DML', desc: 'Retrieve rows from a table', syntax: 'SELECT col1, col2 FROM table WHERE condition' },
  { cmd: 'INSERT', cat: 'DML', desc: 'Add new rows to a table', syntax: 'INSERT INTO table (col1, col2) VALUES (val1, val2)' },
  { cmd: 'UPDATE', cat: 'DML', desc: 'Modify existing rows', syntax: 'UPDATE table SET col = val WHERE condition' },
  { cmd: 'DELETE', cat: 'DML', desc: 'Remove rows from a table', syntax: 'DELETE FROM table WHERE condition' },
  { cmd: 'CREATE TABLE', cat: 'DDL', desc: 'Define a new table', syntax: 'CREATE TABLE name (col type constraints, ...)' },
  { cmd: 'ALTER TABLE', cat: 'DDL', desc: 'Modify table structure', syntax: 'ALTER TABLE name ADD COLUMN col type' },
  { cmd: 'DROP TABLE', cat: 'DDL', desc: 'Delete a table permanently', syntax: 'DROP TABLE IF EXISTS name' },
  { cmd: 'CREATE INDEX', cat: 'DDL', desc: 'Create an index for fast lookup', syntax: 'CREATE INDEX idx_name ON table (column)' },
  { cmd: 'CREATE VIEW', cat: 'DDL', desc: 'Save a query as a named view', syntax: 'CREATE VIEW name AS SELECT ...' },
  { cmd: 'WHERE', cat: 'Clause', desc: 'Filter rows by condition', syntax: 'WHERE col = val AND col2 > val2' },
  { cmd: 'JOIN', cat: 'Clause', desc: 'Combine rows from multiple tables', syntax: 'INNER JOIN table2 ON t1.id = t2.fk_id' },
  { cmd: 'GROUP BY', cat: 'Clause', desc: 'Group rows for aggregation', syntax: 'GROUP BY col1, col2' },
  { cmd: 'HAVING', cat: 'Clause', desc: 'Filter groups after aggregation', syntax: 'HAVING COUNT(*) > 10' },
  { cmd: 'ORDER BY', cat: 'Clause', desc: 'Sort result set', syntax: 'ORDER BY col ASC, col2 DESC' },
  { cmd: 'LIMIT', cat: 'Clause', desc: 'Restrict number of rows returned', syntax: 'LIMIT 20 OFFSET 40' },
  { cmd: 'COUNT', cat: 'Aggregate', desc: 'Count rows or non-null values', syntax: 'COUNT(*) or COUNT(column)' },
  { cmd: 'SUM', cat: 'Aggregate', desc: 'Sum numeric values', syntax: 'SUM(amount)' },
  { cmd: 'AVG', cat: 'Aggregate', desc: 'Average of numeric values', syntax: 'AVG(price)' },
  { cmd: 'MIN / MAX', cat: 'Aggregate', desc: 'Minimum or maximum value', syntax: 'MIN(price), MAX(created_at)' },
  { cmd: 'LIKE', cat: 'Operator', desc: 'Pattern match strings', syntax: 'WHERE email LIKE %@gmail.com' },
  { cmd: 'IN', cat: 'Operator', desc: 'Match any value in a list', syntax: 'WHERE plan IN (pro, enterprise)' },
  { cmd: 'BETWEEN', cat: 'Operator', desc: 'Inclusive range check', syntax: 'WHERE age BETWEEN 18 AND 65' },
  { cmd: 'IS NULL', cat: 'Operator', desc: 'Check for NULL value', syntax: 'WHERE phone IS NULL' },
  { cmd: 'EXISTS', cat: 'Operator', desc: 'Test if subquery returns any rows', syntax: 'WHERE EXISTS (SELECT 1 FROM orders WHERE ...)' },
];

const catColors = { DML:'#3b82f6', DDL:'#8b5cf6', Clause:'#10b981', Aggregate:'#f59e0b', Operator:'#ef4444' };
let search = '';

function render() {
  const filtered = commands.filter(c =>
    c.cmd.toLowerCase().includes(search.toLowerCase()) ||
    c.desc.toLowerCase().includes(search.toLowerCase()) ||
    c.cat.toLowerCase().includes(search.toLowerCase())
  );
  document.getElementById('results').innerHTML = filtered.map(c =>
    \`<div style="background:white;border:1px solid #e2e8f0;border-radius:8px;padding:12px;border-left:4px solid \${catColors[c.cat]||'#ccc'}">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
        <span style="font-family:monospace;font-weight:700;font-size:14px;color:#1a202c">\${c.cmd}</span>
        <span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;background:\${catColors[c.cat]}22;color:\${catColors[c.cat]}">\${c.cat}</span>
      </div>
      <div style="font-size:12px;color:#4a5568;margin-bottom:6px">\${c.desc}</div>
      <code style="font-size:11px;color:#336791;background:#f0f8ff;padding:3px 8px;border-radius:4px;display:block">\${c.syntax}</code>
    </div>\`
  ).join('');
  document.getElementById('count').textContent = filtered.length + ' of ' + commands.length + ' commands';
}

document.getElementById('search').addEventListener('input', e => { search = e.target.value; render(); });
render();`,
      css: ``
    }
  ],
  exercises: [
    {
      id: 'ex-sql-10-1',
      question: 'You want to delete a user but not their orders. Which ON DELETE action should the orders foreign key use?',
      type: 'multiple-choice',
      options: ['ON DELETE CASCADE', 'ON DELETE RESTRICT', 'ON DELETE SET NULL', 'ON DELETE SET DEFAULT'],
      correct: 1,
      explanation: 'ON DELETE RESTRICT prevents deletion of the user if they have related orders. This forces you to handle the orders first (delete them, reassign them, or archive them) before deleting the user.'
    },
    {
      id: 'ex-sql-10-2',
      question: 'Which statement correctly names a foreign key constraint by convention?',
      type: 'multiple-choice',
      options: ['CONSTRAINT orders_fk', 'CONSTRAINT fk_orders_users', 'CONSTRAINT foreign_key_1', 'CONSTRAINT orders_user_id_foreign'],
      correct: 1,
      explanation: 'The convention fk_child_parent (fk_orders_users) clearly shows which tables are involved and that it is a foreign key. This naming makes it easy to understand the constraint without looking at the definition.'
    }
  ],
  quiz: [
    {
      id: 'q-sql-10-1',
      question: 'What is the correct SQL style for keywords?',
      options: [
        'Lowercase keywords, uppercase identifiers',
        'Uppercase keywords, lowercase identifiers (select, from, where)',
        'Uppercase keywords (SELECT, FROM, WHERE), lowercase identifiers (users, email)',
        'Any consistent style is fine - there is no convention'
      ],
      correct: 2,
      explanation: 'The widely adopted convention is UPPERCASE for SQL keywords (SELECT, FROM, WHERE, JOIN, etc.) and lowercase for identifiers (table names, column names). This makes queries easy to scan visually - you can immediately see the structure.'
    },
    {
      id: 'q-sql-10-2',
      question: 'What is the danger of running UPDATE users SET plan = \'pro\' without a WHERE clause?',
      options: [
        'The query will fail with a syntax error',
        'It will update every single row in the users table',
        'It will only update the first row',
        'It will create a new column called plan'
      ],
      correct: 1,
      explanation: 'Without WHERE, UPDATE and DELETE operate on every row in the table. UPDATE users SET plan = \'pro\' sets every user to pro plan. Always double-check your WHERE clause before running UPDATE or DELETE in production.'
    }
  ]
};
