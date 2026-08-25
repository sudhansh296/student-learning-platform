import type { PostgresqlLesson } from '../postgresql-curriculum';

export const lesson08: PostgresqlLesson = {
  id: 'postgresql-08',
  title: 'Indexes and Performance',
  slug: '08-indexes',
  chapter: 'advanced',
  order: 8,
  difficulty: 'intermediate',
  readingTime: 13,
  description: 'Learn how indexes work, when to use them, how to analyze query performance with EXPLAIN, and how to keep your database healthy.',
  sections: [
    {
      type: 'text',
      content: 'As tables grow to millions of rows, unindexed queries become painfully slow. Indexes are lookup structures that let PostgreSQL find rows in microseconds instead of scanning every row in the table.'
    },
    {
      type: 'heading',
      content: 'What is an Index?'
    },
    {
      type: 'analogy',
      title: 'Book Index Analogy',
      content: 'A database index is like the index at the back of a textbook. Without it, you would have to read every page to find "PostgreSQL". With it, you jump directly to the right pages. The cost is a little extra space and time to update the index when data changes.'
    },
    {
      type: 'text',
      content: 'PostgreSQL automatically creates an index on PRIMARY KEY and UNIQUE columns. For all other columns used in WHERE, JOIN, or ORDER BY clauses on large tables, you create indexes manually.'
    },
    {
      type: 'heading',
      content: 'B-Tree Index (Default)'
    },
    {
      type: 'text',
      content: 'The default index type is B-tree (Balanced tree). It supports equality checks (=), range queries (<, >, BETWEEN), and sorting. It works for most use cases.'
    },
    {
      type: 'example',
      title: 'CREATE INDEX',
      content: 'Creating indexes on columns used in queries:',
      code: `-- Basic index (B-tree by default)
CREATE INDEX ON users(email);

-- Named index (easier to drop later)
CREATE INDEX idx_users_email ON users(email);

-- Unique index (also enforces uniqueness)
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- Composite index (for queries filtering by both columns)
CREATE INDEX idx_orders_user_status ON orders(user_id, status);

-- Index on a frequently sorted column
CREATE INDEX idx_products_price ON products(price DESC);`,
      language: 'sql',
      output: 'CREATE INDEX'
    },
    {
      type: 'heading',
      content: 'Partial Indexes'
    },
    {
      type: 'example',
      title: 'Index Only Relevant Rows',
      content: 'Partial indexes index only rows that match a condition, making them smaller and faster:',
      code: `-- Only index active users (most queries only look at active users)
CREATE INDEX idx_users_email_active
  ON users(email)
  WHERE is_active = true;

-- Only index unpaid invoices (paid ones are rarely queried)
CREATE INDEX idx_invoices_due_date_unpaid
  ON invoices(due_date)
  WHERE status != 'paid';

-- Only index recent orders (older ones are rarely queried)
CREATE INDEX idx_recent_orders
  ON orders(created_at)
  WHERE created_at > '2024-01-01';`,
      language: 'sql',
      output: 'CREATE INDEX'
    },
    {
      type: 'tip',
      title: 'Partial Indexes Save Space',
      content: 'If only 10% of your rows are "active", a partial index on active rows is 10x smaller than a full index. Smaller means faster to load into memory and faster to search.'
    },
    {
      type: 'heading',
      content: 'EXPLAIN and EXPLAIN ANALYZE'
    },
    {
      type: 'text',
      content: 'EXPLAIN shows the query execution plan -- how PostgreSQL intends to execute a query. EXPLAIN ANALYZE actually runs the query and shows real timing data.'
    },
    {
      type: 'example',
      title: 'Reading EXPLAIN Output',
      content: 'Understanding query plans:',
      code: `-- Show the plan without running
EXPLAIN SELECT * FROM users WHERE email = 'alice@example.com';

-- Show the plan AND run it (shows real timing)
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'alice@example.com';

-- Sample output WITHOUT index:
-- Seq Scan on users  (cost=0.00..245.00 rows=1 width=120)
--   Filter: ((email)::text = 'alice@example.com')
-- Planning Time: 0.4 ms
-- Execution Time: 28.3 ms

-- Sample output WITH index:
-- Index Scan using idx_users_email on users (cost=0.42..8.44 rows=1 width=120)
--   Index Cond: ((email)::text = 'alice@example.com')
-- Planning Time: 0.3 ms
-- Execution Time: 0.1 ms`,
      language: 'sql',
      output: 'Index Scan using idx_users_email on users (cost=0.42..8.44 rows=1 width=120)'
    },
    {
      type: 'table',
      title: 'Common EXPLAIN Node Types',
      headers: ['Node Type', 'Meaning', 'When It Appears'],
      rows: [
        ['Seq Scan', 'Full table scan (reads every row)', 'No suitable index, or small table'],
        ['Index Scan', 'Follows index then fetches rows', 'Index exists on WHERE/JOIN column'],
        ['Index Only Scan', 'Reads from index without fetching rows', 'All needed columns are in the index'],
        ['Bitmap Heap Scan', 'Combines multiple index results', 'Complex conditions or multiple indexes'],
        ['Hash Join', 'Builds a hash table from smaller input', 'Joining two large result sets'],
        ['Nested Loop', 'Loops through one table per row of another', 'One small and one large table']
      ]
    },
    {
      type: 'heading',
      content: 'When NOT to Index'
    },
    {
      type: 'list',
      title: 'Avoid adding indexes when:',
      items: [
        'The table has fewer than ~10,000 rows (sequential scan is faster for small tables)',
        'The column has very low cardinality (e.g., a boolean column -- only 2 distinct values)',
        'The column is rarely used in WHERE, JOIN, or ORDER BY clauses',
        'The table receives heavy writes and indexes slow down INSERT/UPDATE/DELETE',
        'You already have a composite index that covers the query (a leading prefix is reusable)'
      ]
    },
    {
      type: 'warning',
      title: 'Too Many Indexes Hurt Write Performance',
      content: 'Every index must be updated on every INSERT, UPDATE, and DELETE. Tables with many indexes can be significantly slower to write to. Monitor unused indexes and drop them.'
    },
    {
      type: 'heading',
      content: 'VACUUM and ANALYZE'
    },
    {
      type: 'example',
      title: 'Table Maintenance',
      content: 'Keeping tables and indexes in optimal condition:',
      code: `-- VACUUM: reclaim space from dead rows (created by UPDATE/DELETE)
VACUUM users;

-- VACUUM FULL: aggressive compaction (locks table -- use with care)
VACUUM FULL users;

-- ANALYZE: update statistics so query planner makes good decisions
ANALYZE users;

-- VACUUM ANALYZE: both in one step (most common maintenance)
VACUUM ANALYZE users;

-- View table bloat and dead tuple count
SELECT
  relname,
  n_live_tup,
  n_dead_tup,
  ROUND(n_dead_tup::numeric / NULLIF(n_live_tup + n_dead_tup, 0) * 100, 1) AS dead_pct
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC;`,
      language: 'sql',
      output: ' relname | n_live_tup | n_dead_tup | dead_pct  ---------+------------+------------+----------  orders  |     125000 |       8200 |      6.2  users   |      45000 |        350 |      0.8'
    },
    {
      type: 'note',
      title: 'Autovacuum',
      content: 'PostgreSQL runs autovacuum in the background to handle routine VACUUM and ANALYZE automatically. Manual maintenance is only needed for very active tables or after large bulk operations.'
    },
    {
      type: 'tryit',
      title: 'Index Performance Comparison',
      js: `const output = document.getElementById('output');

function simulateScan(rows, indexed, label) {
  const msSeq = Math.round(rows / 1000 * 0.4 + Math.random() * 2);
  const msIdx = Math.round(Math.log10(rows) * 0.3 + Math.random() * 0.2 * 10) / 10;
  return indexed ? msIdx : msSeq;
}

const scenarios = [
  { label:'10K rows',    rows:10000 },
  { label:'100K rows',   rows:100000 },
  { label:'1M rows',     rows:1000000 },
  { label:'10M rows',    rows:10000000 }
];

let html = '<div style="padding:16px;font-family:system-ui,sans-serif">';
html += '<h3 style="color:#336791;margin:0 0 4px">Index Performance Simulator</h3>';
html += '<p style="color:#64748b;font-size:12px;margin:0 0 16px">Estimated query time: SELECT * FROM users WHERE email = ?</p>';

html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">';

// Without index panel
html += '<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:14px">';
html += '<p style="font-weight:700;color:#dc2626;margin:0 0 12px;font-size:13px">Sequential Scan (No Index)</p>';
scenarios.forEach(s => {
  const ms = simulateScan(s.rows, false);
  const pct = Math.min(100, Math.round(ms / 40 * 100));
  html += \`<div style="margin-bottom:10px">\`;
  html += \`<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px"><span>\${s.label}</span><strong style="color:#dc2626">\${ms} ms</strong></div>\`;
  html += \`<div style="background:#fee2e2;border-radius:4px;height:10px"><div style="background:#ef4444;width:\${pct}%;height:100%;border-radius:4px"></div></div>\`;
  html += '</div>';
});
html += '</div>';

// With index panel
html += '<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px">';
html += '<p style="font-weight:700;color:#15803d;margin:0 0 12px;font-size:13px">Index Scan (B-tree Index)</p>';
scenarios.forEach(s => {
  const ms = simulateScan(s.rows, true);
  const pct = Math.min(100, Math.round(ms / 1 * 100));
  html += \`<div style="margin-bottom:10px">\`;
  html += \`<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px"><span>\${s.label}</span><strong style="color:#15803d">\${ms} ms</strong></div>\`;
  html += \`<div style="background:#dcfce7;border-radius:4px;height:10px"><div style="background:#22c55e;width:\${pct}%;height:100%;border-radius:4px"></div></div>\`;
  html += '</div>';
});
html += '</div></div>';

// Summary table
html += '<table style="width:100%;border-collapse:collapse;font-size:12px">';
html += '<thead><tr style="background:#336791;color:white">';
['Table Size','Without Index','With Index','Speedup'].forEach(h => {
  html += \`<th style="padding:8px 12px;text-align:left">\${h}</th>\`;
});
html += '</tr></thead><tbody>';
const speedups = ['~20x', '~200x', '~2000x', '~20000x'];
scenarios.forEach((s,i) => {
  const msSeq = simulateScan(s.rows, false);
  const msIdx = simulateScan(s.rows, true);
  html += \`<tr style="background:\${i%2===0?'#fff':'#f8fafc'};border-bottom:1px solid #e2e8f0">\`;
  html += \`<td style="padding:8px 12px;font-weight:600">\${s.label}</td>\`;
  html += \`<td style="padding:8px 12px;font-family:monospace;color:#dc2626">\${msSeq} ms</td>\`;
  html += \`<td style="padding:8px 12px;font-family:monospace;color:#15803d">\${msIdx} ms</td>\`;
  html += \`<td style="padding:8px 12px;font-weight:700;color:#336791">\${speedups[i]}</td>\`;
  html += '</tr>';
});
html += '</tbody></table>';

html += '<div style="margin-top:14px;padding:10px 14px;background:#eff6ff;border-left:4px solid #336791;border-radius:0 6px 6px 0;font-size:12px;color:#1e40af">';
html += '<strong>Key insight:</strong> Index performance barely changes with table size (logarithmic). Sequential scan gets linearly slower as the table grows.';
html += '</div></div>';

output.innerHTML = html;`,
      css: ''
    }
  ],
  exercises: [
    {
      id: 'ex-08-1',
      question: 'When does PostgreSQL automatically create an index?',
      type: 'multiple-choice',
      options: [
        'On every column in a new table',
        'On columns used in WHERE clauses',
        'On PRIMARY KEY and UNIQUE constraint columns',
        'On the first column of every table'
      ],
      correct: 2,
      explanation: 'PostgreSQL automatically creates a B-tree index when you define a PRIMARY KEY or a UNIQUE constraint. All other columns require you to create indexes manually with CREATE INDEX.'
    },
    {
      id: 'ex-08-2',
      question: 'What does EXPLAIN ANALYZE do differently from EXPLAIN?',
      type: 'multiple-choice',
      options: [
        'EXPLAIN ANALYZE shows more detailed plan nodes',
        'EXPLAIN ANALYZE actually executes the query and shows real timing data',
        'EXPLAIN ANALYZE only works on SELECT statements',
        'EXPLAIN ANALYZE creates an index automatically'
      ],
      correct: 1,
      explanation: 'EXPLAIN shows the estimated plan without executing the query. EXPLAIN ANALYZE actually runs the query and returns both the estimated plan and real execution times, which helps identify performance bottlenecks.'
    },
    {
      id: 'ex-08-3',
      question: 'Which type of index is best for a query like WHERE status = \'active\' on a table where only 5% of rows are active?',
      type: 'multiple-choice',
      options: [
        'Full B-tree index on the status column',
        'Partial index with WHERE status = \'active\'',
        'Hash index on status',
        'No index -- status has too few distinct values'
      ],
      correct: 1,
      explanation: 'A partial index with WHERE status = \'active\' only indexes the 5% of rows that are active, making it much smaller and faster. A full index on status would have poor selectivity (only 2 values), but a partial index targeting only active rows performs excellently.'
    }
  ],
  quiz: [
    {
      id: 'q-08-1',
      question: 'What is a "Seq Scan" in an EXPLAIN output?',
      options: [
        'A scan using a sequence object',
        'A full table scan that reads every row from disk',
        'A scan using a secondary index',
        'A secure scan with encryption'
      ],
      correct: 1,
      explanation: 'Seq Scan (sequential scan) means PostgreSQL is reading every row in the table from disk in order, without using any index. This is expected for small tables or when no suitable index exists.'
    },
    {
      id: 'q-08-2',
      question: 'Why might too many indexes hurt database performance?',
      options: [
        'Indexes increase the time to read data',
        'PostgreSQL has a limit of 8 indexes per table',
        'Every index must be updated on INSERT, UPDATE, and DELETE operations, slowing writes',
        'Indexes prevent autovacuum from running'
      ],
      correct: 2,
      explanation: 'Every index is a secondary data structure that must be kept in sync with the table data. Each INSERT, UPDATE, or DELETE must also update all relevant indexes, which increases write overhead. Tables with many indexes can be significantly slower for write-heavy workloads.'
    },
    {
      id: 'q-08-3',
      question: 'What does VACUUM do in PostgreSQL?',
      options: [
        'Compresses tables to reduce disk usage permanently',
        'Reclaims disk space occupied by dead row versions left by UPDATE and DELETE operations',
        'Rebuilds all indexes on a table',
        'Removes all data from a table'
      ],
      correct: 1,
      explanation: 'When rows are updated or deleted, PostgreSQL keeps the old row versions for MVCC (multi-version concurrency). VACUUM marks this dead space as reusable. VACUUM FULL physically rewrites the table and reclaims disk space, but it requires an exclusive lock.'
    }
  ]
};
