import type { PostgresqlLesson } from '../postgresql-curriculum';

export const lesson04: PostgresqlLesson = {
  id: 'postgresql-04',
  title: 'CRUD Operations',
  slug: '04-crud-basics',
  chapter: 'crud',
  order: 4,
  difficulty: 'beginner',
  readingTime: 15,
  description: 'Master the four fundamental database operations: Create, Read, Update, and Delete using INSERT, SELECT, UPDATE, and DELETE.',
  sections: [
    {
      type: 'text',
      content: 'CRUD stands for Create, Read, Update, and Delete. These four operations form the backbone of every database-driven application. In SQL, they map directly to INSERT, SELECT, UPDATE, and DELETE.'
    },
    {
      type: 'heading',
      content: 'INSERT -- Creating Records'
    },
    {
      type: 'text',
      content: 'INSERT INTO adds new rows to a table. You can insert a single row or multiple rows in one statement.'
    },
    {
      type: 'example',
      title: 'Single Row Insert',
      content: 'Inserting one record into a products table:',
      code: `-- Insert a single row (specify columns explicitly)
INSERT INTO products (name, price, stock, category)
VALUES ('Wireless Mouse', 29.99, 150, 'electronics');

-- Insert with all columns in order (fragile - avoid in production)
INSERT INTO products
VALUES (DEFAULT, 'SKU-001', 'Wireless Mouse', NULL, 29.99, 150, 'electronics', true, NOW(), NOW());`,
      language: 'sql',
      output: 'INSERT 0 1'
    },
    {
      type: 'example',
      title: 'Multiple Row Insert',
      content: 'Inserting several rows in a single statement (much faster than individual inserts):',
      code: `INSERT INTO products (name, price, stock, category)
VALUES
  ('Mechanical Keyboard', 89.99, 75,  'electronics'),
  ('USB-C Hub',           39.99, 200, 'electronics'),
  ('Desk Lamp',           24.99, 120, 'furniture'),
  ('Notebook Pack',        9.99, 500, 'stationery');`,
      language: 'sql',
      output: 'INSERT 0 4'
    },
    {
      type: 'tip',
      title: 'Always Specify Column Names',
      content: 'Always list column names in INSERT statements. If the table schema changes (columns added or reordered), explicit column names keep your queries working correctly.'
    },
    {
      type: 'heading',
      content: 'RETURNING Clause'
    },
    {
      type: 'example',
      title: 'Get Inserted Data Back',
      content: 'RETURNING lets you retrieve the auto-generated ID or other values immediately after inserting:',
      code: `-- Get the generated ID after insert
INSERT INTO users (username, email)
VALUES ('alice', 'alice@example.com')
RETURNING id, created_at;

-- Return all columns
INSERT INTO products (name, price, stock, category)
VALUES ('Gaming Headset', 59.99, 80, 'electronics')
RETURNING *;`,
      language: 'sql',
      output: ' id |          created_at          \n----+------------------------------\n  1 | 2024-08-19 14:30:00.123456+00\n(1 row)'
    },
    {
      type: 'heading',
      content: 'SELECT -- Reading Records'
    },
    {
      type: 'text',
      content: 'SELECT retrieves data from one or more tables. It is the most frequently used SQL command and supports powerful filtering, sorting, and limiting.'
    },
    {
      type: 'example',
      title: 'Basic SELECT Queries',
      content: 'Reading data with different column selections:',
      code: `-- Select all columns
SELECT * FROM products;

-- Select specific columns (preferred in production)
SELECT id, name, price FROM products;

-- Add aliases for readability
SELECT
  id,
  name AS product_name,
  price AS unit_price,
  stock AS units_available
FROM products;`,
      language: 'sql',
      output: ' id |    product_name    | unit_price | units_available \n----+--------------------+------------+-----------------\n  1 | Wireless Mouse     |      29.99 |             150\n  2 | Mechanical Keyboard|      89.99 |              75'
    },
    {
      type: 'heading',
      content: 'WHERE Clause -- Filtering'
    },
    {
      type: 'example',
      title: 'Filtering with WHERE',
      content: 'WHERE narrows results to rows that match a condition:',
      code: `-- Exact match
SELECT * FROM products WHERE category = 'electronics';

-- Comparison operators
SELECT * FROM products WHERE price > 50;
SELECT * FROM products WHERE stock <= 100;

-- Multiple conditions with AND / OR
SELECT * FROM products
WHERE category = 'electronics' AND price < 100;

SELECT * FROM products
WHERE category = 'furniture' OR price < 15;`,
      language: 'sql',
      output: ' id | name               | price | category    \n----+--------------------+-------+-------------\n  1 | Wireless Mouse     | 29.99 | electronics\n  3 | USB-C Hub          | 39.99 | electronics'
    },
    {
      type: 'heading',
      content: 'ORDER BY, LIMIT, and OFFSET'
    },
    {
      type: 'example',
      title: 'Sorting and Pagination',
      content: 'Controlling the order and number of returned rows:',
      code: `-- Sort ascending (default)
SELECT * FROM products ORDER BY price;

-- Sort descending
SELECT * FROM products ORDER BY price DESC;

-- Sort by multiple columns
SELECT * FROM products ORDER BY category ASC, price DESC;

-- Limit to first 5 rows
SELECT * FROM products ORDER BY created_at DESC LIMIT 5;

-- Pagination: page 2 with 10 items per page
SELECT * FROM products
ORDER BY id
LIMIT 10 OFFSET 10;`,
      language: 'sql',
      output: ' id | name                | price | category    \n----+---------------------+-------+-------------\n  2 | Mechanical Keyboard | 89.99 | electronics\n  2 | Gaming Headset      | 59.99 | electronics'
    },
    {
      type: 'note',
      title: 'Always Use ORDER BY with LIMIT',
      content: 'Without ORDER BY, the rows returned by LIMIT/OFFSET are non-deterministic. Always specify an ordering when paginating to get consistent results.'
    },
    {
      type: 'heading',
      content: 'UPDATE -- Modifying Records'
    },
    {
      type: 'example',
      title: 'UPDATE with WHERE',
      content: 'Updating specific rows -- always include a WHERE clause:',
      code: `-- Update a single row by ID
UPDATE products
SET price = 34.99, updated_at = NOW()
WHERE id = 1;

-- Update multiple rows matching a condition
UPDATE products
SET is_active = false
WHERE stock = 0;

-- Update with RETURNING to see what changed
UPDATE products
SET price = price * 0.9
WHERE category = 'electronics'
RETURNING id, name, price;`,
      language: 'sql',
      output: 'UPDATE 1\n\n id | name                | price \n----+---------------------+-------\n  1 | Wireless Mouse      | 26.99\n  2 | Mechanical Keyboard | 80.99\n  3 | USB-C Hub           | 35.99'
    },
    {
      type: 'warning',
      title: 'UPDATE Without WHERE Updates ALL Rows',
      content: 'UPDATE products SET price = 0; will set the price to zero on every single row. Always double-check your WHERE clause before running UPDATE in production.'
    },
    {
      type: 'heading',
      content: 'DELETE -- Removing Records'
    },
    {
      type: 'example',
      title: 'DELETE with WHERE',
      content: 'Removing rows safely:',
      code: `-- Delete a specific row
DELETE FROM products WHERE id = 5;

-- Delete multiple rows
DELETE FROM products WHERE stock = 0 AND is_active = false;

-- Delete with RETURNING to confirm what was removed
DELETE FROM products
WHERE category = 'stationery'
RETURNING *;

-- Delete all rows (keeps table structure)
DELETE FROM products;

-- TRUNCATE is faster for deleting all rows
TRUNCATE TABLE products;`,
      language: 'sql',
      output: 'DELETE 1\n\n id | name          | price | category   \n----+---------------+-------+------------\n  4 | Notebook Pack | 9.99  | stationery'
    },
    {
      type: 'warning',
      title: 'DELETE Without WHERE Removes All Rows',
      content: 'Just like UPDATE, DELETE without a WHERE clause affects every row. Test your WHERE clause with a SELECT first to verify which rows will be affected.'
    },
    {
      type: 'tip',
      title: 'Test Before Delete',
      content: 'Before running DELETE, run the same query as SELECT to preview the rows that will be removed. For example: SELECT * FROM products WHERE stock = 0; before DELETE FROM products WHERE stock = 0;'
    },
    {
      type: 'tryit',
      title: 'Interactive CRUD Simulator',
      js: `const output = document.getElementById('output');

let products = [
  { id: 1, name: 'Wireless Mouse', price: 29.99, stock: 150, category: 'electronics' },
  { id: 2, name: 'Mechanical Keyboard', price: 89.99, stock: 75, category: 'electronics' },
  { id: 3, name: 'Desk Lamp', price: 24.99, stock: 120, category: 'furniture' },
  { id: 4, name: 'USB-C Hub', price: 39.99, stock: 200, category: 'electronics' }
];
let nextId = 5;
let log = [];

function addLog(msg, type) {
  log.unshift({ msg, type, time: new Date().toLocaleTimeString() });
  if (log.length > 6) log.pop();
}

function renderTable() {
  if (products.length === 0) {
    return '<div style="text-align:center;padding:24px;color:#94a3b8;font-style:italic">No products. Use Add to insert rows.</div>';
  }
  let t = '<table style="width:100%;border-collapse:collapse;font-size:12px">';
  t += '<thead><tr style="background:#336791;color:white">';
  ['ID','Name','Price','Stock','Category','Action'].forEach(h => {
    t += \`<th style="padding:8px 10px;text-align:left">\${h}</th>\`;
  });
  t += '</tr></thead><tbody>';
  products.forEach((p, i) => {
    t += \`<tr style="background:\${i%2===0?'#fff':'#f8fafc'};border-bottom:1px solid #e2e8f0">\`;
    t += \`<td style="padding:8px 10px;font-family:monospace">\${p.id}</td>\`;
    t += \`<td style="padding:8px 10px;font-weight:500">\${p.name}</td>\`;
    t += \`<td style="padding:8px 10px;color:#15803d;font-family:monospace">$\${p.price.toFixed(2)}</td>\`;
    t += \`<td style="padding:8px 10px;font-family:monospace">\${p.stock}</td>\`;
    t += \`<td style="padding:8px 10px"><span style="background:#dbeafe;color:#1e40af;padding:2px 7px;border-radius:12px;font-size:11px">\${p.category}</span></td>\`;
    t += \`<td style="padding:8px 10px"><button onclick="deleteRow(\${p.id})" style="background:#fee2e2;color:#dc2626;border:none;padding:3px 10px;border-radius:4px;cursor:pointer;font-size:11px">DELETE</button></td>\`;
    t += '</tr>';
  });
  t += '</tbody></table>';
  return t;
}

function renderLog() {
  if (log.length === 0) return '';
  let h = '<div style="margin-top:14px"><p style="font-size:11px;font-weight:700;color:#64748b;margin:0 0 6px;text-transform:uppercase;letter-spacing:.05em">Query Log</p>';
  log.forEach(l => {
    const colors = { insert: '#dcfce7', update: '#fef9c3', delete: '#fee2e2', select: '#eff6ff' };
    h += \`<div style="background:\${colors[l.type]||'#f1f5f9'};border-radius:4px;padding:6px 10px;margin-bottom:4px;font-family:monospace;font-size:11px;color:#1e293b">\`;
    h += \`<span style="color:#94a3b8;margin-right:8px">\${l.time}</span>\${l.msg}</div>\`;
  });
  return h + '</div>';
}

function render() {
  output.innerHTML = \`
    <div style="padding:16px;font-family:system-ui,sans-serif">
      <h3 style="color:#336791;margin:0 0 12px;font-size:16px">Products Table (\${products.length} rows)</h3>
      <div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap">
        <button onclick="addProduct()" style="background:#336791;color:white;border:none;padding:7px 14px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600">+ INSERT Row</button>
        <button onclick="applyDiscount()" style="background:#0369a1;color:white;border:none;padding:7px 14px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600">UPDATE -10% Electronics</button>
        <button onclick="clearOOS()" style="background:#dc2626;color:white;border:none;padding:7px 14px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600">DELETE Out-of-Stock</button>
        <button onclick="selectElectronics()" style="background:#15803d;color:white;border:none;padding:7px 14px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600">SELECT Electronics</button>
      </div>
      <div id="table-area">\${renderTable()}</div>
      \${renderLog()}
    </div>
  \`;
}

window.addProduct = function() {
  const names = ['Gaming Mouse','Standing Desk','Monitor Stand','Cable Organizer','LED Strip'];
  const cats = ['electronics','furniture','accessories'];
  const p = {
    id: nextId++,
    name: names[Math.floor(Math.random()*names.length)],
    price: parseFloat((Math.random()*80+10).toFixed(2)),
    stock: Math.floor(Math.random()*200),
    category: cats[Math.floor(Math.random()*cats.length)]
  };
  products.push(p);
  addLog(\`INSERT INTO products (name,price,stock,category) VALUES ('\${p.name}',\${p.price},\${p.stock},'\${p.category}') -- id=\${p.id}\`, 'insert');
  render();
};

window.deleteRow = function(id) {
  const p = products.find(x => x.id === id);
  products = products.filter(x => x.id !== id);
  addLog(\`DELETE FROM products WHERE id=\${id} -- removed '\${p?.name}'\`, 'delete');
  render();
};

window.applyDiscount = function() {
  let count = 0;
  products = products.map(p => {
    if (p.category === 'electronics') { count++; return {...p, price: parseFloat((p.price*0.9).toFixed(2))}; }
    return p;
  });
  addLog(\`UPDATE products SET price=price*0.9 WHERE category='electronics' -- \${count} rows\`, 'update');
  render();
};

window.clearOOS = function() {
  const before = products.length;
  products = products.filter(p => p.stock > 0);
  const removed = before - products.length;
  addLog(\`DELETE FROM products WHERE stock=0 -- \${removed} rows removed\`, 'delete');
  render();
};

window.selectElectronics = function() {
  const count = products.filter(p => p.category==='electronics').length;
  addLog(\`SELECT * FROM products WHERE category='electronics' -- \${count} rows returned\`, 'select');
  render();
};

render();`,
      css: ''
    }
  ],
  exercises: [
    {
      id: 'ex-04-1',
      question: 'Which SQL clause is used to filter rows in a SELECT, UPDATE, or DELETE statement?',
      type: 'multiple-choice',
      options: ['FILTER', 'WHERE', 'HAVING', 'LIMIT'],
      correct: 1,
      explanation: 'WHERE is the clause used to filter rows. HAVING filters grouped results, LIMIT restricts the number of returned rows, and FILTER is not standard SQL.'
    },
    {
      id: 'ex-04-2',
      question: 'What does the RETURNING clause do in an INSERT or UPDATE statement?',
      type: 'multiple-choice',
      options: [
        'Rolls back the transaction if something fails',
        'Returns the affected rows data without needing a follow-up SELECT',
        'Returns the number of rows affected',
        'Redirects output to a file'
      ],
      correct: 1,
      explanation: 'RETURNING returns the actual row data (or specific columns) from affected rows immediately after the INSERT/UPDATE/DELETE, eliminating the need for a separate SELECT query to get auto-generated IDs.'
    },
    {
      id: 'ex-04-3',
      question: 'How do you retrieve the 3rd page of results with 10 items per page?',
      type: 'multiple-choice',
      options: [
        'SELECT * FROM products LIMIT 10 PAGE 3;',
        'SELECT * FROM products LIMIT 10 OFFSET 20;',
        'SELECT * FROM products LIMIT 30 OFFSET 10;',
        'SELECT * FROM products LIMIT 20 OFFSET 30;'
      ],
      correct: 1,
      explanation: 'Page 3 with 10 items per page means skipping the first 20 rows (2 pages x 10 items). OFFSET 20 skips 20 rows and LIMIT 10 takes the next 10.'
    }
  ],
  quiz: [
    {
      id: 'q-04-1',
      question: 'What is the difference between DELETE and TRUNCATE?',
      options: [
        'They are identical',
        'DELETE removes specific rows with WHERE; TRUNCATE removes all rows instantly and cannot be rolled back in most cases',
        'TRUNCATE supports WHERE; DELETE does not',
        'DELETE is faster than TRUNCATE'
      ],
      correct: 1,
      explanation: 'DELETE processes rows one-by-one, supports WHERE, and can be rolled back. TRUNCATE removes all rows at once (much faster), but in PostgreSQL it CAN be rolled back if inside a transaction.'
    },
    {
      id: 'q-04-2',
      question: 'You want to update the email of user with id = 42. What is the safest approach?',
      options: [
        'UPDATE users SET email = \'new@email.com\';',
        'UPDATE users SET email = \'new@email.com\' WHERE id = 42;',
        'DELETE FROM users WHERE id = 42; INSERT INTO users(email) VALUES(\'new@email.com\');',
        'INSERT INTO users(id, email) VALUES(42, \'new@email.com\') ON CONFLICT DO UPDATE;'
      ],
      correct: 1,
      explanation: 'Always use a specific WHERE clause when updating. Without WHERE, all rows are updated. Using WHERE id = 42 ensures only that specific row is modified.'
    },
    {
      id: 'q-04-3',
      question: 'What does ORDER BY price DESC LIMIT 5 return?',
      options: [
        'The 5 cheapest products',
        'The 5 most expensive products',
        'The first 5 products sorted alphabetically by name',
        'A random 5 products'
      ],
      correct: 1,
      explanation: 'ORDER BY price DESC sorts from highest to lowest price, and LIMIT 5 takes the first 5 from that sorted list, giving you the 5 most expensive products.'
    }
  ]
};
