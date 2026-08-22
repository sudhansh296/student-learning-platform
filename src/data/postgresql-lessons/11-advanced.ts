import type { PostgresqlLesson } from '../postgresql-curriculum';

export const lesson11: PostgresqlLesson = {
  id: 'postgresql-11',
  title: 'Advanced PostgreSQL Features',
  slug: '11-advanced',
  chapter: 'advanced',
  order: 11,
  difficulty: 'advanced',
  readingTime: 18,
  description: 'Explore powerful PostgreSQL-specific features: JSON/JSONB storage, array columns, full-text search, views, stored functions, triggers, and row-level security.',
  sections: [
    {
      type: 'text',
      content: 'PostgreSQL goes far beyond standard SQL with powerful built-in features that can replace entire application layers. Understanding these capabilities lets you push logic closer to the data for better performance and consistency.'
    },
    {
      type: 'heading',
      content: 'JSON and JSONB Columns'
    },
    {
      type: 'text',
      content: 'PostgreSQL can store JSON documents in columns. JSONB (binary JSON) is the recommended type -- it is indexed, validated, and supports operators for querying inside the document.'
    },
    {
      type: 'example',
      title: 'JSONB Basics',
      content: 'Storing and querying JSON data:',
      code: `-- Create a table with JSONB
CREATE TABLE products (
  id       SERIAL PRIMARY KEY,
  name     VARCHAR(100),
  metadata JSONB
);

-- Insert with JSONB
INSERT INTO products (name, metadata) VALUES
  ('Laptop', '{"brand":"Dell","ram":16,"tags":["sale","new"]}'),
  ('Phone',  '{"brand":"Apple","storage":256,"color":"black"}');

-- Query: extract a field with ->  (returns JSON) or ->> (returns text)
SELECT name, metadata->>'brand' AS brand FROM products;

-- Query: filter by nested field
SELECT * FROM products WHERE metadata->>'brand' = 'Dell';

-- Query: array contains
SELECT * FROM products WHERE metadata->'tags' ? 'sale';

-- Update a specific JSON key
UPDATE products
SET metadata = metadata || '{"discount":true}'
WHERE id = 1;

-- GIN index for fast JSONB queries
CREATE INDEX idx_products_meta ON products USING GIN(metadata);`,
      language: 'sql',
      output: ' name   | brand \n--------+-------\n Laptop | Dell\n Phone  | Apple\n(2 rows)'
    },
    {
      type: 'table',
      title: 'JSONB Operators',
      headers: ['Operator', 'Description', 'Example'],
      rows: [
        ['->', 'Get JSON field (returns JSON)', 'data->\'name\''],
        ['->>', 'Get JSON field as text', 'data->>\'name\''],
        ['#>', 'Get nested field via path', 'data#>\'{address,city}\''],
        ['?', 'Does key exist?', 'data ? \'email\''],
        ['@>', 'Does left contain right?', 'data @> \'{"active":true}\''],
        ['||', 'Merge two JSON objects', 'data || \'{"new_key":"val"}\''],
        ['- key', 'Delete a key', 'data - \'temp_field\'']
      ]
    },
    {
      type: 'heading',
      content: 'Array Columns'
    },
    {
      type: 'example',
      title: 'PostgreSQL Arrays',
      content: 'Storing multiple values in a single column:',
      code: `-- Array column definition
CREATE TABLE articles (
  id    SERIAL PRIMARY KEY,
  title TEXT,
  tags  TEXT[]
);

-- Insert with arrays
INSERT INTO articles (title, tags) VALUES
  ('PostgreSQL Guide', ARRAY['database','sql','postgresql']),
  ('Node.js Tips',     ARRAY['nodejs','javascript','backend']);

-- Query: array contains a value
SELECT * FROM articles WHERE 'sql' = ANY(tags);

-- Append to array
UPDATE articles SET tags = tags || '{performance}' WHERE id = 1;

-- Array overlap (any element in common)
SELECT * FROM articles WHERE tags && ARRAY['nodejs','react'];

-- Unnest array into rows
SELECT title, UNNEST(tags) AS tag FROM articles;`,
      language: 'sql',
      output: ' title            | tags                          \n------------------+-------------------------------\n PostgreSQL Guide | {database,sql,postgresql}\n(1 row)'
    },
    {
      type: 'heading',
      content: 'Full-Text Search'
    },
    {
      type: 'example',
      title: 'tsvector and tsquery',
      content: 'Building a full-text search system:',
      code: `-- Add a tsvector column for full-text search
ALTER TABLE articles ADD COLUMN search_vector TSVECTOR;

-- Populate the vector (converts text to lexemes)
UPDATE articles
SET search_vector = to_tsvector('english', title || ' ' || COALESCE(body, ''));

-- Create a GIN index for fast text search
CREATE INDEX idx_articles_fts ON articles USING GIN(search_vector);

-- Search using tsquery
SELECT title
FROM articles
WHERE search_vector @@ to_tsquery('english', 'postgresql & database');

-- Highlight matching terms
SELECT title, ts_headline('english', body, to_tsquery('postgresql'))
FROM articles
WHERE search_vector @@ to_tsquery('postgresql');

-- Rank results by relevance
SELECT title, ts_rank(search_vector, query) AS rank
FROM articles, to_tsquery('english', 'database') query
WHERE search_vector @@ query
ORDER BY rank DESC;`,
      language: 'sql',
      output: '     title         \n-------------------\n PostgreSQL Guide\n(1 row)'
    },
    {
      type: 'heading',
      content: 'Views and Materialized Views'
    },
    {
      type: 'example',
      title: 'Creating Views',
      content: 'Views are saved queries that behave like virtual tables:',
      code: `-- Regular view (runs the query each time)
CREATE VIEW active_users AS
SELECT id, name, email, created_at
FROM users
WHERE is_active = true;

-- Query the view like a table
SELECT * FROM active_users WHERE created_at > NOW() - INTERVAL '30 days';

-- Materialized view (pre-computed, faster to read)
CREATE MATERIALIZED VIEW monthly_revenue AS
SELECT
  DATE_TRUNC('month', created_at) AS month,
  SUM(total) AS revenue,
  COUNT(*) AS order_count
FROM orders
WHERE status = 'completed'
GROUP BY 1
ORDER BY 1;

-- Refresh the materialized view (run periodically)
REFRESH MATERIALIZED VIEW monthly_revenue;

-- Refresh without locking reads
REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_revenue;`,
      language: 'sql',
      output: 'CREATE VIEW\nCREATE MATERIALIZED VIEW\nREFRESH MATERIALIZED VIEW'
    },
    {
      type: 'note',
      title: 'Regular vs Materialized Views',
      content: 'Regular views always show fresh data but re-run the query on every access. Materialized views store the results and are much faster to read, but you must REFRESH them to get updated data. Use materialized views for expensive, infrequently-changing aggregations like dashboards.'
    },
    {
      type: 'heading',
      content: 'Stored Functions (PL/pgSQL)'
    },
    {
      type: 'example',
      title: 'Writing PL/pgSQL Functions',
      content: 'Functions that run inside the database:',
      code: `-- Simple function
CREATE OR REPLACE FUNCTION add_tax(price NUMERIC, rate NUMERIC DEFAULT 0.1)
RETURNS NUMERIC AS $$
BEGIN
  RETURN price * (1 + rate);
END;
$$ LANGUAGE plpgsql;

-- Call it
SELECT add_tax(100.00, 0.08); -- returns 108.00

-- More complex: function with logic
CREATE OR REPLACE FUNCTION get_user_stats(user_id_param INTEGER)
RETURNS TABLE(order_count BIGINT, total_spent NUMERIC, last_order TIMESTAMPTZ)
AS $$
BEGIN
  RETURN QUERY
    SELECT
      COUNT(*)::BIGINT,
      SUM(total),
      MAX(created_at)
    FROM orders
    WHERE user_id = user_id_param
      AND status = 'completed';
END;
$$ LANGUAGE plpgsql;

-- Call the table-returning function
SELECT * FROM get_user_stats(1);`,
      language: 'sql',
      output: ' order_count | total_spent |         last_order         \n-------------+-------------+----------------------------\n           5 |      479.95 | 2024-08-15 10:30:00+00'
    },
    {
      type: 'heading',
      content: 'Triggers'
    },
    {
      type: 'example',
      title: 'Auto-updating Timestamps with Triggers',
      content: 'Running code automatically on INSERT or UPDATE:',
      code: `-- Trigger function that updates updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach the trigger to a table
CREATE TRIGGER products_set_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Now any UPDATE on products auto-updates the updated_at column
UPDATE products SET price = 39.99 WHERE id = 1;
-- updated_at is automatically set to NOW()`,
      language: 'sql',
      output: 'CREATE FUNCTION\nCREATE TRIGGER\nUPDATE 1'
    },
    {
      type: 'heading',
      content: 'Row-Level Security (RLS)'
    },
    {
      type: 'example',
      title: 'Multi-Tenant Security with RLS',
      content: 'Restricting which rows each user can see or modify:',
      code: `-- Enable RLS on the table
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policy: users can only see their own documents
CREATE POLICY user_isolation ON documents
  FOR ALL
  USING (user_id = current_setting('app.user_id')::INTEGER);

-- In your app, set the context before queries
SET app.user_id = '42';

-- This query now automatically filters to user 42's documents
SELECT * FROM documents;
-- Equivalent to: SELECT * FROM documents WHERE user_id = 42;

-- Bypass RLS for admin operations (superuser or BYPASSRLS role)
SET ROLE admin_role; -- bypasses RLS
SELECT * FROM documents; -- sees all rows`,
      language: 'sql',
      output: 'ALTER TABLE\nCREATE POLICY\n id | user_id | title            \n----+---------+------------------\n  3 |      42 | My Document\n  7 |      42 | Another Doc'
    },
    {
      type: 'tip',
      title: 'RLS for SaaS Multi-Tenancy',
      content: 'RLS is the recommended pattern for multi-tenant SaaS applications. It enforces data isolation at the database level, making it impossible for application bugs to accidentally expose another tenant\'s data.'
    },
    {
      type: 'heading',
      content: 'COPY for Bulk Import/Export'
    },
    {
      type: 'example',
      title: 'Bulk Data Operations',
      content: 'COPY is the fastest way to load or export large datasets:',
      code: `-- Import from CSV file (server-side)
COPY users (name, email, created_at)
FROM '/path/to/users.csv'
WITH (FORMAT csv, HEADER true);

-- Export to CSV
COPY users TO '/path/to/export.csv'
WITH (FORMAT csv, HEADER true);

-- COPY from stdin (useful in scripts and node-postgres)
COPY users (name, email) FROM STDIN WITH (FORMAT csv);

-- Using pg's COPY stream from Node.js
const { from } = require('pg-copy-streams');
const copyStream = client.query(from('COPY users (name,email) FROM STDIN CSV'));
csvFileStream.pipe(copyStream);`,
      language: 'sql',
      output: 'COPY 50000'
    },
    {
      type: 'tryit',
      title: 'JSONB Explorer',
      js: `const output = document.getElementById('output');

const rows = [
  { id:1, name:'Laptop Pro',    metadata: { brand:'Dell',  ram:16,  tags:['sale','refurb'],      price:899.99, inStock:true  } },
  { id:2, name:'Phone Ultra',   metadata: { brand:'Apple', storage:256, color:'midnight',         price:999.00, inStock:true  } },
  { id:3, name:'Tablet X',      metadata: { brand:'Samsung', ram:8, display:'12inch', discount:true, price:499.00, inStock:false } },
  { id:4, name:'Headphones',    metadata: { brand:'Sony', noise_cancelling:true, tags:['sale'],    price:249.99, inStock:true  } },
  { id:5, name:'Smart Watch',   metadata: { brand:'Apple', health:true, color:'silver',           price:399.00, inStock:true  } },
  { id:6, name:'Mechanical KB', metadata: { brand:'Logitech', switches:'cherry-mx', tags:['new'], price:149.99, inStock:true  } }
];

let filterKey   = '';
let filterValue = '';

function matches(row) {
  if (!filterKey.trim()) return true;
  const val = row.metadata[filterKey.trim()];
  if (val === undefined) return false;
  if (!filterValue.trim()) return true;
  return String(val).toLowerCase().includes(filterValue.trim().toLowerCase());
}

function highlight(text, search) {
  if (!search) return text;
  const safe = search.replace(/[-\\[\\]{}()*+?.,\\\\^$|#\\s]/g, '\\\\$&');
  const re = new RegExp('(' + safe + ')', 'gi');
  return text.replace(re, '<mark style="background:#fde047;border-radius:2px">$1</mark>');
}

function render() {
  const filtered = rows.filter(matches);

  let html = '<div style="padding:16px;font-family:system-ui,sans-serif">';
  html += '<h3 style="color:#336791;margin:0 0 4px">JSONB Column Explorer</h3>';
  html += '<p style="color:#64748b;font-size:12px;margin:0 0 14px">Filter products by metadata key and value</p>';

  // Filter controls
  html += '<div style="display:flex;gap:8px;margin-bottom:14px;align-items:flex-end;flex-wrap:wrap">';
  html += '<div><label style="font-size:11px;font-weight:700;color:#64748b;display:block;margin-bottom:4px">JSON KEY (e.g. brand, tags, ram)</label>';
  html += \`<input id="key-in" type="text" value="\${filterKey}" placeholder="metadata key" onkeyup="updateFilter()" style="padding:7px 10px;border:1px solid #cbd5e1;border-radius:6px;font-size:12px;font-family:monospace;width:160px"></div>\`;
  html += '<div><label style="font-size:11px;font-weight:700;color:#64748b;display:block;margin-bottom:4px">VALUE (optional filter)</label>';
  html += \`<input id="val-in" type="text" value="\${filterValue}" placeholder="value to match" onkeyup="updateFilter()" style="padding:7px 10px;border:1px solid #cbd5e1;border-radius:6px;font-size:12px;font-family:monospace;width:160px"></div>\`;
  html += '<button onclick="clearFilter()" style="background:#e2e8f0;color:#475569;border:none;padding:7px 14px;border-radius:6px;cursor:pointer;font-size:12px">Clear</button>';
  html += '</div>';

  // SQL preview
  let sql = 'SELECT * FROM products';
  if (filterKey.trim()) {
    sql += filterValue.trim()
      ? \` WHERE metadata->>''\${filterKey.trim()}'' ILIKE '%\${filterValue.trim()}%'\`
      : \` WHERE metadata ? '\${filterKey.trim()}'\`;
  }
  html += \`<div style="background:#0d1117;color:#7ee787;font-family:monospace;font-size:11px;padding:8px 12px;border-radius:6px;margin-bottom:14px">\${sql};</div>\`;

  // Results
  html += \`<p style="font-size:11px;color:#64748b;margin:0 0 8px">\${filtered.length} of \${rows.length} rows</p>\`;
  if (filtered.length === 0) {
    html += '<div style="text-align:center;padding:20px;color:#94a3b8;background:#f8fafc;border-radius:8px">No rows match. Try: brand, ram, tags, color, discount, inStock</div>';
  } else {
    html += '<div style="display:grid;gap:10px">';
    filtered.forEach(r => {
      const metaStr = JSON.stringify(r.metadata, null, 2);
      html += '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;display:grid;grid-template-columns:auto 1fr;gap:12px">';
      html += \`<div><div style="font-size:11px;color:#94a3b8;margin-bottom:2px">id: \${r.id}</div><div style="font-weight:700;color:#1e293b;white-space:nowrap">\${r.name}</div></div>\`;
      html += \`<pre style="margin:0;font-size:11px;font-family:monospace;color:#475569;background:#fff;border:1px solid #e2e8f0;border-radius:4px;padding:8px;overflow-x:auto">\${highlight(metaStr, filterValue)}</pre>\`;
      html += '</div>';
    });
    html += '</div>';
  }
  html += '</div>';
  output.innerHTML = html;
}

window.updateFilter = function() {
  filterKey   = document.getElementById('key-in')?.value || '';
  filterValue = document.getElementById('val-in')?.value || '';
  render();
};
window.clearFilter = function() { filterKey=''; filterValue=''; render(); };

render();`,
      css: ''
    }
  ],
  exercises: [
    {
      id: 'ex-11-1',
      question: 'What is the difference between JSON and JSONB column types in PostgreSQL?',
      type: 'multiple-choice',
      options: [
        'JSON supports more data types than JSONB',
        'JSONB stores data in a binary format, enables indexing, and supports query operators; JSON stores raw text',
        'JSON is faster to read; JSONB is faster to write',
        'They are identical -- JSONB is just an alias for JSON'
      ],
      correct: 1,
      explanation: 'JSON stores the exact text of the JSON input (preserving whitespace and key order). JSONB stores a decomposed binary representation that supports GIN indexes and operators like @>, ?, and #>. JSONB is generally preferred because it is much faster to query and supports indexing.'
    },
    {
      id: 'ex-11-2',
      question: 'What does a trigger with BEFORE UPDATE do?',
      type: 'multiple-choice',
      options: [
        'Prevents all UPDATE operations on the table',
        'Runs the trigger function after the update is applied to the table',
        'Runs the trigger function before the update, allowing the function to modify the new row values',
        'Creates a backup of the row before it is updated'
      ],
      correct: 2,
      explanation: 'A BEFORE trigger fires before the actual change is applied. The trigger function receives the NEW row and can modify it (like setting updated_at = NOW()). An AFTER trigger fires after the change, useful for auditing or cascading changes to other tables.'
    },
    {
      id: 'ex-11-3',
      question: 'What is a Materialized View and when should you use it?',
      type: 'multiple-choice',
      options: [
        'A view that automatically refreshes every minute',
        'A stored query result on disk that must be explicitly refreshed, ideal for expensive infrequently-changing aggregations',
        'A view that only shows rows the current user is allowed to see',
        'A temporary view that exists only for the current session'
      ],
      correct: 1,
      explanation: 'A materialized view stores the results of a query on disk. Reads are fast because no computation is needed. The tradeoff is that you must REFRESH it periodically to see updated data. It is ideal for expensive analytics queries like monthly revenue dashboards that do not need to be real-time.'
    }
  ],
  quiz: [
    {
      id: 'q-11-1',
      question: 'Which operator checks if a JSONB object contains a specific key?',
      options: ['@>', '->', '?', '#>'],
      correct: 2,
      explanation: 'The ? operator checks for key existence in a JSONB object or value membership in a JSONB array. For example: metadata ? \'email\' returns true if the key "email" exists in the JSON object.'
    },
    {
      id: 'q-11-2',
      question: 'What does Row-Level Security (RLS) do?',
      options: [
        'Encrypts each row with a separate key',
        'Restricts which rows a database user can read or modify based on policies',
        'Prevents bulk operations like TRUNCATE on tables',
        'Limits the number of rows any single query can return'
      ],
      correct: 1,
      explanation: 'Row-Level Security (RLS) defines policies that filter which rows a given user can access. It is enforced at the database level, making it impossible for application code to accidentally expose rows to the wrong user. It is especially useful for multi-tenant applications.'
    },
    {
      id: 'q-11-3',
      question: 'What is the fastest way to load millions of rows into PostgreSQL?',
      options: [
        'Multiple INSERT statements in a loop',
        'A single large multi-row INSERT',
        'COPY command (bulk load from file or stdin)',
        'Using a prepared statement with repeated executions'
      ],
      correct: 2,
      explanation: 'COPY is significantly faster than INSERT for bulk loads. It bypasses much of the parsing and planning overhead of individual statements. For very large datasets, COPY can be 10-100x faster than equivalent INSERT statements.'
    }
  ]
};
