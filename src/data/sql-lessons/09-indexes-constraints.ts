import type { SqlLesson } from '../sql-curriculum';

export const lesson09: SqlLesson = {
  id: 'sql-09',
  title: 'Indexes and Constraints',
  slug: '09-indexes-constraints',
  chapter: 'advanced',
  order: 9,
  difficulty: 'intermediate',
  readingTime: 11,
  description: 'Understand how indexes speed up queries using B-trees, create indexes strategically, and enforce data integrity with foreign key constraints.',
  sections: [
    {
      type: 'text',
      content: 'Indexes and constraints are the tools that make databases both fast and trustworthy. Without indexes, every query scans the entire table. Without constraints, bad data can corrupt your database silently. Understanding both is essential for building production-quality applications.'
    },
    {
      type: 'heading',
      content: 'What Is an Index?'
    },
    {
      type: 'text',
      content: 'An index is a separate data structure that the database maintains to speed up data retrieval. Without an index, finding a row requires scanning every row in the table (a full table scan). With an index, the database can jump directly to the matching rows.'
    },
    {
      type: 'analogy',
      title: 'The Book Index Analogy',
      content: 'A database index works exactly like the index at the back of a textbook. Without it, finding "primary key" means reading every page. With it, you look up "primary key" in the index, find "pages 42, 87, 203", and jump directly there. The database B-tree index does the same: it lists values in sorted order with pointers to the actual rows.'
    },
    {
      type: 'heading',
      content: 'How B-Tree Indexes Work'
    },
    {
      type: 'text',
      content: 'Most database indexes use a B-tree (Balanced tree) structure. Values are sorted and organized into a tree where each node contains keys and pointers. Searching a B-tree is O(log n) - finding one row among 1 million rows requires at most 20 comparisons rather than scanning all 1 million rows.'
    },
    {
      type: 'text',
      content: 'B-tree indexes support equality lookups (= operator), range lookups (<, >, BETWEEN), and prefix string searches (LIKE \'prefix%\'). They do not help with leading wildcard searches (LIKE \'%suffix\'), full-text search, or very-low-cardinality columns (like boolean flags with only two values).'
    },
    {
      type: 'heading',
      content: 'When to Create an Index'
    },
    {
      type: 'list',
      title: 'Index these columns:',
      items: [
        'Foreign key columns - used in JOIN conditions; without an index, JOINs scan the entire joined table',
        'Columns frequently used in WHERE clauses with high cardinality (many distinct values)',
        'Columns used in ORDER BY when you also need fast retrieval with LIMIT',
        'Columns frequently used together in queries - consider a composite index',
        'Unique fields like email or username that need both uniqueness and fast lookup'
      ]
    },
    {
      type: 'list',
      title: 'Do NOT index these:',
      items: [
        'Low-cardinality columns like boolean flags (active/inactive) - the index is useless if half the table matches',
        'Columns rarely used in WHERE, JOIN, or ORDER BY',
        'Small tables (< 1000 rows) - a full scan is fast enough and indexes add overhead',
        'Columns that are frequently updated - indexes must be maintained on every write'
      ]
    },
    {
      type: 'heading',
      content: 'Composite Indexes'
    },
    {
      type: 'text',
      content: 'A composite index covers multiple columns. The order of columns matters: a composite index on (user_id, created_at) can be used for queries filtering by user_id alone, or filtering by user_id AND created_at, but NOT for queries filtering only by created_at.'
    },
    {
      type: 'text',
      content: 'A covering index is a composite index that includes all columns needed by a query. When the database can satisfy a query entirely from the index without touching the main table, this is called an "index-only scan" - the fastest possible query plan.'
    },
    {
      type: 'example',
      title: 'CREATE INDEX Examples',
      content: 'Creating standard, unique, and composite indexes, and using EXPLAIN to check how the database uses them.',
      code: `-- Basic index on a foreign key column
CREATE INDEX idx_orders_user_id ON orders (user_id);

-- Unique index: enforces uniqueness AND speeds up lookups
CREATE UNIQUE INDEX idx_users_email ON users (email);

-- Composite index: for queries that filter by both user_id and created_at
CREATE INDEX idx_orders_user_date ON orders (user_id, created_at DESC);

-- Partial index: only index active users (much smaller index)
CREATE INDEX idx_users_active_email ON users (email)
WHERE is_active = true;

-- Drop an index
DROP INDEX idx_orders_user_id;

-- Check if an index is being used (PostgreSQL EXPLAIN ANALYZE)
EXPLAIN ANALYZE
SELECT * FROM orders WHERE user_id = 42 ORDER BY created_at DESC;`,
      language: 'sql',
      output: `Index Scan using idx_orders_user_date on orders
  Index Cond: (user_id = 42)
Planning Time: 0.5 ms
Execution Time: 0.2 ms  (vs 45ms without index)`
    },
    {
      type: 'heading',
      content: 'Foreign Key Constraints'
    },
    {
      type: 'text',
      content: 'A foreign key constraint ensures referential integrity - every value in a foreign key column must match an existing value in the referenced table\'s primary key. This prevents orphaned records: you cannot have an order referencing a user_id that does not exist.'
    },
    {
      type: 'text',
      content: 'What happens when you delete the referenced row depends on the ON DELETE action. The most important options are CASCADE (automatically delete related rows), RESTRICT/NO ACTION (reject the delete if related rows exist), and SET NULL (set the foreign key to NULL when the referenced row is deleted).'
    },
    {
      type: 'example',
      title: 'Foreign Key Constraints',
      content: 'Defining foreign key constraints with different ON DELETE behaviors to enforce data integrity.',
      code: `-- orders.user_id must reference an existing users.id
-- ON DELETE CASCADE: deleting a user deletes all their orders
CREATE TABLE orders (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  amount     DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Equivalent verbose syntax with named constraint
CREATE TABLE orders (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL,
  amount     DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_orders_user
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- Add a foreign key to an existing table
ALTER TABLE orders
  ADD CONSTRAINT fk_orders_user
  FOREIGN KEY (user_id) REFERENCES users(id)
  ON DELETE RESTRICT;`,
      language: 'sql'
    },
    {
      type: 'note',
      title: 'Indexes Are Not Free',
      content: 'Every index you create must be maintained on every INSERT, UPDATE, and DELETE. Tables with many indexes are slower to write to. Only create indexes that will be used by real queries. Use EXPLAIN ANALYZE in PostgreSQL to verify your indexes are actually being used.'
    },
    {
      type: 'tip',
      title: 'EXPLAIN Is Your Best Friend',
      content: 'EXPLAIN (or EXPLAIN ANALYZE for actual execution stats) shows the query plan the database chose. Look for "Seq Scan" (full table scan - might need an index) vs "Index Scan" (using an index - good). EXPLAIN ANALYZE runs the query and shows actual execution time alongside estimates.'
    },
    {
      type: 'tryit',
      title: 'Index Performance Comparison',
      js: `document.body.innerHTML = \`
<style>
body { padding: 20px; font-family: system-ui, sans-serif; background: #f7fafc; margin: 0; }
h3 { color: #336791; margin: 0 0 6px 0; font-size: 15px; font-weight: 700; }
p { color: #718096; font-size: 13px; margin: 0 0 16px 0; }
.metric { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
.metric-val { font-weight: 700; font-family: monospace; color: #1a202c; }
.bar-wrap { margin: 16px 0 8px 0; background: #e2e8f0; border-radius: 4px; height: 20px; overflow: hidden; }
#bar { height: 20px; border-radius: 4px; transition: width .4s, background .3s; min-width: 4px; }
#bar-label { font-size: 11px; color: #718096; }
#toggle { padding: 9px 18px; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 700; font-size: 13px; margin: 12px 0 16px; }
#plan { font-family: monospace; font-size: 11px; background: #1a3347; color: #90cdf4; padding: 8px 12px; border-radius: 6px; display: block; }
#status { font-size: 14px; margin-bottom: 14px; display: block; }
</style>
<div>
  <h3>⚡ Index Performance Comparison</h3>
  <p>Simulating query performance on a table with 100,000 rows</p>
  <span id="status"></span>
  <div class="metric">
    <span>Rows Scanned</span>
    <span class="metric-val" id="rows-scanned"></span>
  </div>
  <div class="metric">
    <span>Rows Found</span>
    <span class="metric-val" id="rows-found"></span>
  </div>
  <div class="metric">
    <span>Execution Time</span>
    <span class="metric-val" id="exec-time"></span>
  </div>
  <div class="bar-wrap">
    <div id="bar"></div>
  </div>
  <div id="bar-label"></div>
  <button id="toggle"></button>
  <h3 style="margin-top:20px">Query Plan</h3>
  <code id="plan"></code>
</div>
\`;

const TABLE_SIZE = 100000;

function simulateQuery(useIndex, filterType) {
  const start = performance.now();
  let scanned = 0;
  let found = 0;

  if (useIndex) {
    // B-tree: O(log n) to find position, then sequential read
    scanned = Math.ceil(Math.log2(TABLE_SIZE)) + Math.floor(TABLE_SIZE * 0.01);
    found = Math.floor(TABLE_SIZE * 0.01);
  } else {
    // Full scan: read every row
    scanned = TABLE_SIZE;
    found = Math.floor(TABLE_SIZE * 0.01);
  }

  // Simulate time (proportional to rows scanned)
  const delay = useIndex ? 0.2 + Math.random() * 0.3 : 45 + Math.random() * 10;
  return { scanned, found, ms: delay.toFixed(1) };
}

let showIndex = true;

function render() {
  const result = simulateQuery(showIndex);
  const maxBar = TABLE_SIZE;
  const barW = Math.round((result.scanned / maxBar) * 300);
  const color = showIndex ? '#10b981' : '#ef4444';

  document.getElementById('status').innerHTML =
    \`<span style="font-weight:700;color:\${color}">\${showIndex ? 'WITH INDEX (B-tree)' : 'WITHOUT INDEX (Full Scan)'}</span>\`;
  document.getElementById('rows-scanned').textContent = result.scanned.toLocaleString() + ' rows scanned';
  document.getElementById('rows-found').textContent = result.found.toLocaleString() + ' rows found';
  document.getElementById('exec-time').textContent = result.ms + ' ms';
  document.getElementById('bar').style.width = Math.max(4, barW) + 'px';
  document.getElementById('bar').style.background = color;
  document.getElementById('bar-label').textContent = result.scanned.toLocaleString() + ' rows';
  document.getElementById('toggle').textContent = showIndex ? 'Switch to: No Index (Full Scan)' : 'Switch to: With Index';
  document.getElementById('toggle').style.background = showIndex ? '#ef4444' : '#10b981';

  document.getElementById('plan').textContent = showIndex
    ? 'Index Scan using idx_orders_user_id  (cost=0.42..8.45 rows=1000)'
    : 'Seq Scan on orders  (cost=0.00..2456.00 rows=100000)';
}

document.getElementById('toggle').addEventListener('click', () => { showIndex = !showIndex; render(); });
render();`,
      css: ``
    }
  ],
  exercises: [
    {
      id: 'ex-sql-9-1',
      question: 'Which type of column benefits MOST from an index?',
      type: 'multiple-choice',
      options: [
        'A boolean column with only true/false values',
        'A high-cardinality column like user_id or email that is frequently used in WHERE or JOIN',
        'A column that is rarely referenced in queries',
        'A column that is updated very frequently'
      ],
      correct: 1,
      explanation: 'Indexes are most valuable on high-cardinality columns (many distinct values) that are frequently searched. Low-cardinality columns (like boolean flags) offer little benefit because half the table matches anyway. Rarely-queried or frequently-updated columns impose write overhead without helping reads.'
    },
    {
      id: 'ex-sql-9-2',
      question: 'What does ON DELETE CASCADE do on a foreign key?',
      type: 'multiple-choice',
      options: [
        'Prevents deletion of the referenced row if child rows exist',
        'Automatically deletes all related child rows when the parent row is deleted',
        'Sets the foreign key column to NULL when the referenced row is deleted',
        'Creates a backup of the deleted row'
      ],
      correct: 1,
      explanation: 'ON DELETE CASCADE automatically deletes all rows in the child table that reference the deleted parent row. If you delete a user, all their orders are also deleted. ON DELETE RESTRICT prevents the deletion if child rows exist.'
    },
    {
      id: 'ex-sql-9-3',
      question: 'For a composite index on (user_id, created_at), which query can use this index?',
      type: 'multiple-choice',
      options: [
        'Only WHERE created_at > \'2024-01-01\'',
        'WHERE user_id = 5 (and optionally also filtering on created_at)',
        'ORDER BY created_at DESC only',
        'Only queries that filter on BOTH user_id AND created_at'
      ],
      correct: 1,
      explanation: 'A composite index can be used when the query filters on the leftmost column(s). An index on (user_id, created_at) helps queries filtering on user_id alone, or user_id + created_at. It does NOT help queries filtering only on created_at (the non-leftmost column).'
    }
  ],
  quiz: [
    {
      id: 'q-sql-9-1',
      question: 'What is the time complexity of a B-tree index lookup?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correct: 1,
      explanation: 'B-tree indexes provide O(log n) lookup time. Finding one row in 1 million rows requires roughly log2(1,000,000) = ~20 comparisons, versus scanning all 1 million rows without an index. This is why indexes are critical for large tables.'
    },
    {
      id: 'q-sql-9-2',
      question: 'What does EXPLAIN ANALYZE do?',
      options: [
        'Creates an optimized version of the query',
        'Runs the query and shows the actual query plan with execution times',
        'Adds an index automatically based on the query',
        'Checks query syntax without executing it'
      ],
      correct: 1,
      explanation: 'EXPLAIN ANALYZE actually executes the query and returns the query execution plan alongside real execution statistics (actual rows, actual time). EXPLAIN alone shows the estimated plan without running the query. EXPLAIN ANALYZE is invaluable for performance debugging.'
    },
    {
      id: 'q-sql-9-3',
      question: 'What is a covering index?',
      options: [
        'An index that covers all tables in the database',
        'An index that includes all columns needed by a query, allowing an index-only scan without touching the main table',
        'An index with a WHERE condition (partial index)',
        'An index created automatically by the database'
      ],
      correct: 1,
      explanation: 'A covering index contains all columns that a specific query needs. The database can answer the query entirely from the index without reading the main table rows - called an index-only scan. This is extremely fast and is an advanced optimization technique.'
    }
  ]
};
