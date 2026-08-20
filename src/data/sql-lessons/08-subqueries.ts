import type { SqlLesson } from '../sql-curriculum';

export const lesson08: SqlLesson = {
  id: 'sql-08',
  title: 'Subqueries and Views',
  slug: '08-subqueries',
  chapter: 'advanced',
  order: 8,
  difficulty: 'intermediate',
  readingTime: 11,
  description: 'Use subqueries in SELECT, FROM, and WHERE clauses, apply EXISTS, and create views to simplify complex queries.',
  sections: [
    {
      type: 'text',
      content: 'A subquery is a query nested inside another query. Subqueries let you use the results of one query as input to another, enabling multi-step logic within a single SQL statement. They are one of the most powerful — and sometimes most misused — features of SQL.'
    },
    {
      type: 'heading',
      content: 'Types of Subqueries'
    },
    {
      type: 'text',
      content: 'Subqueries can appear in three positions in a SQL statement, and each position has different characteristics and use cases.'
    },
    {
      type: 'list',
      title: 'Subquery positions and uses:',
      items: [
        'In WHERE: the subquery returns values used for filtering (scalar value or list)',
        'In FROM: the subquery acts as a temporary table (also called a derived table)',
        'In SELECT: the subquery returns a single value computed per row (scalar subquery)'
      ]
    },
    {
      type: 'heading',
      content: 'Scalar Subquery'
    },
    {
      type: 'text',
      content: 'A scalar subquery returns exactly one row and one column. It can be used anywhere a single value is expected — in SELECT, WHERE, or HAVING. If it returns more than one row, the database throws an error. They are often used to include a computed value from another table alongside each row.'
    },
    {
      type: 'heading',
      content: 'Correlated Subquery'
    },
    {
      type: 'text',
      content: 'A correlated subquery references columns from the outer query. Unlike a simple subquery (which runs once), a correlated subquery runs once for every row in the outer query. This makes them intuitive but potentially slow on large tables — they are O(n) in query execution.'
    },
    {
      type: 'warning',
      title: 'Correlated Subquery Performance',
      content: 'A correlated subquery runs once per row in the outer query. On a table with 100,000 rows, the subquery executes 100,000 times. This is often much slower than an equivalent JOIN. Use JOINs or CTEs when performance matters.'
    },
    {
      type: 'heading',
      content: 'EXISTS and NOT EXISTS'
    },
    {
      type: 'text',
      content: 'EXISTS tests whether a subquery returns any rows at all — it does not care about the values, just whether any rows exist. NOT EXISTS is the inverse. EXISTS is often the most efficient way to check for related records because the database can stop as soon as it finds the first match.'
    },
    {
      type: 'text',
      content: 'EXISTS is generally preferred over IN for subqueries that return many rows, and is safer than NOT IN because it handles NULLs correctly — NOT IN with NULLs in the subquery returns no rows, which is almost always a bug.'
    },
    {
      type: 'example',
      title: 'Subqueries in WHERE and FROM',
      content: 'Using a subquery to filter by aggregate value, and a derived table (subquery in FROM) to pre-aggregate data before the outer query.',
      code: `-- Subquery in WHERE: find users who have spent more than the average order
SELECT u.first_name, u.email
FROM users u
WHERE u.id IN (
  SELECT user_id
  FROM orders
  GROUP BY user_id
  HAVING SUM(amount) > (SELECT AVG(total) FROM order_summaries)
);

-- Subquery in FROM (derived table): pre-aggregate then join
SELECT u.first_name, u.email, stats.total_spent, stats.order_count
FROM users u
INNER JOIN (
  SELECT user_id, SUM(amount) AS total_spent, COUNT(*) AS order_count
  FROM orders
  GROUP BY user_id
) AS stats ON stats.user_id = u.id
ORDER BY stats.total_spent DESC;

-- EXISTS: find users who have at least one order
SELECT u.first_name, u.email
FROM users u
WHERE EXISTS (
  SELECT 1
  FROM orders o
  WHERE o.user_id = u.id
);

-- NOT EXISTS: find users who have never ordered
SELECT u.first_name, u.email
FROM users u
WHERE NOT EXISTS (
  SELECT 1
  FROM orders o
  WHERE o.user_id = u.id
);`,
      language: 'sql'
    },
    {
      type: 'heading',
      content: 'CREATE VIEW'
    },
    {
      type: 'text',
      content: 'A view is a named, saved SELECT query stored in the database. Querying a view executes the underlying SELECT and returns results as if it were a table. Views simplify complex queries, provide a stable interface to underlying tables, and can be used for access control (exposing only certain columns to certain users).'
    },
    {
      type: 'text',
      content: 'Views do not store data — they are just saved query definitions. Every time you query a view, the underlying query runs. This means views reflect the current state of the data, but also that complex views do not have the performance benefit of caching.'
    },
    {
      type: 'heading',
      content: 'Updatable Views and Materialized Views'
    },
    {
      type: 'text',
      content: 'A simple view over a single table without aggregation is usually updatable — you can run INSERT, UPDATE, and DELETE on it and the changes propagate to the underlying table. Complex views with JOINs, aggregation, or DISTINCT are typically read-only.'
    },
    {
      type: 'text',
      content: 'A materialized view stores the result of the query physically on disk. Querying it is like querying a table — very fast. But the data is only as fresh as the last refresh (REFRESH MATERIALIZED VIEW). Materialized views are ideal for expensive aggregation or JOIN queries that are queried frequently but do not need real-time data.'
    },
    {
      type: 'example',
      title: 'Creating and Using Views',
      content: 'Creating a reusable view for user order statistics, then querying it like a table.',
      code: `-- Create a view for user order statistics
CREATE VIEW user_order_stats AS
SELECT
  u.id,
  u.first_name,
  u.last_name,
  u.email,
  u.plan,
  COUNT(o.id)           AS order_count,
  COALESCE(SUM(o.amount), 0)  AS total_spent,
  MAX(o.created_at)     AS last_order_date
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.first_name, u.last_name, u.email, u.plan;

-- Query the view just like a table
SELECT first_name, email, total_spent, order_count
FROM user_order_stats
WHERE plan = 'pro'
ORDER BY total_spent DESC;

-- Create a materialized view (PostgreSQL)
CREATE MATERIALIZED VIEW monthly_revenue AS
SELECT
  DATE_TRUNC('month', created_at) AS month,
  SUM(amount) AS revenue
FROM orders
GROUP BY 1
ORDER BY 1;

-- Refresh when data changes
REFRESH MATERIALIZED VIEW monthly_revenue;

-- Drop a view
DROP VIEW user_order_stats;`,
      language: 'sql'
    },
    {
      type: 'tip',
      title: 'Use CTEs for Readable Subqueries',
      content: 'Common Table Expressions (WITH clause) make complex subqueries much more readable. WITH order_stats AS (SELECT user_id, SUM(amount) AS total FROM orders GROUP BY user_id) SELECT u.name, s.total FROM users u JOIN order_stats s ON s.user_id = u.id -- CTEs run once and can be referenced multiple times.'
    },
    {
      type: 'tryit',
      title: 'Subquery Concept Demo',
      js: `const users = [
  { id:1, name:'Alice Chen', email:'alice@example.com', plan:'pro' },
  { id:2, name:'Bob Smith', email:'bob@example.com', plan:'free' },
  { id:3, name:'Carol Davis', email:'carol@example.com', plan:'pro' },
  { id:4, name:'Dan Lee', email:'dan@example.com', plan:'free' },
];
const orders = [
  { id:101, user_id:1, amount:299 },
  { id:102, user_id:1, amount:49 },
  { id:103, user_id:3, amount:199 },
  { id:104, user_id:3, amount:99 },
  { id:105, user_id:3, amount:149 },
];

const queries = {
  'Users with orders (EXISTS)': () =>
    users.filter(u => orders.some(o => o.user_id === u.id))
      .map(u => ({ id:u.id, name:u.name, email:u.email })),
  'Users without orders (NOT EXISTS)': () =>
    users.filter(u => !orders.some(o => o.user_id === u.id))
      .map(u => ({ id:u.id, name:u.name, note:'No orders' })),
  'Derived table (order stats)': () =>
    users.map(u => {
      const uOrders = orders.filter(o => o.user_id === u.id);
      return {
        name: u.name,
        order_count: uOrders.length,
        total_spent: '$' + uOrders.reduce((s,o) => s+o.amount, 0)
      };
    }).filter(r => parseInt(r.total_spent.slice(1)) > 0),
};

let active = 'Users with orders (EXISTS)';

function renderTable(rows) {
  if (!rows.length) return '<p style="color:#718096;font-size:13px">No rows returned</p>';
  const cols = Object.keys(rows[0]);
  const head = cols.map(c => \`<th style="background:#336791;color:white;padding:7px 12px;text-align:left;font-size:11px;font-weight:700">\${c}</th>\`).join('');
  const body = rows.map((r, i) =>
    \`<tr style="background:\${i%2===0?'#fff':'#f8fafc'}">\${cols.map(c => \`<td style="padding:7px 12px;font-size:12px;font-family:monospace;border-bottom:1px solid #e2e8f0">\${r[c]}</td>\`).join('')}</tr>\`
  ).join('');
  return \`<table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:6px;overflow:hidden"><thead><tr>\${head}</tr></thead><tbody>\${body}</tbody></table>\`;
}

function render() {
  document.getElementById('btns').innerHTML = Object.keys(queries).map(k =>
    \`<button onclick="setQ('\${k.replace(/'/g,"\\\\'")}'); " style="display:block;width:100%;text-align:left;padding:8px 12px;border:none;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;margin-bottom:4px;background:\${k===active?'#336791':'#e2e8f0'};color:\${k===active?'white':'#4a5568'}">\${k}</button>\`
  ).join('');
  document.getElementById('result').innerHTML = renderTable(queries[active]());
}

window.setQ = function(k) { active = k; render(); };
render();`,
      css: `body { padding: 20px; font-family: system-ui, sans-serif; background: #f7fafc; }
h3 { color: #336791; margin: 0 0 6px 0; font-size: 15px; font-weight: 700; }
p { color: #718096; font-size: 13px; margin: 0 0 14px 0; }
.layout { display: flex; gap: 16px; }
#btns { width: 200px; flex-shrink: 0; }
#result { flex: 1; min-width: 0; }`
    }
  ],
  exercises: [
    {
      id: 'ex-sql-8-1',
      question: 'What makes a subquery "correlated"?',
      type: 'multiple-choice',
      options: [
        'It returns more than one column',
        'It references a column from the outer query and re-executes for each outer row',
        'It uses the EXISTS keyword',
        'It appears in the FROM clause'
      ],
      correct: 1,
      explanation: 'A correlated subquery references a column from the outer query (e.g., WHERE o.user_id = u.id where u comes from the outer query). This means it cannot be evaluated independently — it runs once for each row produced by the outer query.'
    },
    {
      id: 'ex-sql-8-2',
      question: 'What does a materialized view do differently from a regular view?',
      type: 'multiple-choice',
      options: [
        'A materialized view runs the query faster because it has no JOINs',
        'A materialized view stores query results physically on disk and must be refreshed to reflect new data',
        'A materialized view automatically updates when the source tables change',
        'A materialized view is a view that can be updated (INSERT/UPDATE/DELETE)'
      ],
      correct: 1,
      explanation: 'A materialized view stores the query result as actual data on disk. This makes reads very fast, but the data is only as current as the last REFRESH MATERIALIZED VIEW. A regular view always runs the underlying query on access.'
    },
    {
      id: 'ex-sql-8-3',
      question: 'Why is NOT EXISTS safer than NOT IN when the subquery might return NULLs?',
      type: 'multiple-choice',
      options: [
        'NOT EXISTS is faster than NOT IN',
        'NOT IN returns no rows when the subquery contains any NULL values; NOT EXISTS handles NULLs correctly',
        'NOT IN cannot be used with subqueries',
        'NOT EXISTS uses less memory'
      ],
      correct: 1,
      explanation: 'If a subquery in NOT IN returns any NULL value, the entire NOT IN condition evaluates to NULL (unknown) for every row, effectively excluding all rows from the result. NOT EXISTS does not have this problem — it only checks whether any rows exist, not their values.'
    }
  ],
  quiz: [
    {
      id: 'q-sql-8-1',
      question: 'What is a scalar subquery?',
      options: [
        'A subquery that uses scalar arithmetic functions',
        'A subquery that returns exactly one row and one column',
        'A subquery in the FROM clause',
        'A subquery that runs in parallel'
      ],
      correct: 1,
      explanation: 'A scalar subquery returns a single value (one row, one column). It can be used anywhere a single value is expected. If it returns more than one row, the database throws an error at runtime.'
    },
    {
      id: 'q-sql-8-2',
      question: 'What is the key benefit of EXISTS over IN for subqueries?',
      options: [
        'EXISTS returns the matching rows; IN only returns a count',
        'EXISTS stops searching as soon as the first match is found; IN must collect all values first',
        'EXISTS works with JOINs; IN does not',
        'There is no meaningful difference'
      ],
      correct: 1,
      explanation: 'EXISTS returns true as soon as any matching row is found and stops looking. This short-circuit behavior makes EXISTS efficient even when the subquery could return millions of rows. IN must collect all values from the subquery before it can test membership.'
    },
    {
      id: 'q-sql-8-3',
      question: 'A view stores which of the following?',
      options: [
        'A snapshot of data at view creation time',
        'The query definition — data is retrieved fresh on each access',
        'An encrypted copy of the underlying table',
        'An index on the underlying table columns'
      ],
      correct: 1,
      explanation: 'A regular view stores only the query definition (the SELECT statement). Each time you query the view, the database executes that query against the current data. No data is stored in the view itself — unlike a materialized view.'
    }
  ]
};
