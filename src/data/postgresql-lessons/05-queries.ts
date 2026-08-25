import type { PostgresqlLesson } from '../postgresql-curriculum';

export const lesson05: PostgresqlLesson = {
  id: 'postgresql-05',
  title: 'Advanced Queries',
  slug: '05-queries',
  chapter: 'queries',
  order: 5,
  difficulty: 'intermediate',
  readingTime: 16,
  description: 'Master advanced SQL querying techniques including pattern matching, subqueries, aggregates, and grouping to extract meaningful insights from your data.',
  sections: [
    {
      type: 'text',
      content: 'Basic SELECT and WHERE get you started, but real-world applications require pattern matching, range filters, subqueries, and aggregation. These techniques let you ask complex questions of your data.'
    },
    {
      type: 'heading',
      content: 'WHERE with AND, OR, and NOT'
    },
    {
      type: 'example',
      title: 'Compound Conditions',
      content: 'Combining multiple conditions with logical operators:',
      code: `-- AND: both conditions must be true
SELECT * FROM products
WHERE category = 'electronics' AND price < 50;

-- OR: at least one condition must be true
SELECT * FROM products
WHERE category = 'furniture' OR price < 15;

-- NOT: exclude rows matching the condition
SELECT * FROM products
WHERE NOT category = 'stationery';

-- Combining AND, OR, and NOT with parentheses
SELECT * FROM products
WHERE (category = 'electronics' OR category = 'furniture')
  AND price > 20
  AND NOT is_active = false;`,
      language: 'sql',
      output: ' id | name               | price | category     ----+--------------------+-------+-------------   1 | Wireless Mouse     | 29.99 | electronics   3 | USB-C Hub          | 39.99 | electronics'
    },
    {
      type: 'heading',
      content: 'LIKE and ILIKE -- Pattern Matching'
    },
    {
      type: 'text',
      content: 'LIKE matches text patterns using wildcards. ILIKE is the case-insensitive version, which is more useful for user-facing search.'
    },
    {
      type: 'table',
      title: 'Wildcard Characters',
      headers: ['Character', 'Meaning', 'Example'],
      rows: [
        ['%', 'Matches any sequence of zero or more characters', 'LIKE \'%mouse%\' matches "wireless mouse"'],
        ['_', 'Matches exactly one character', 'LIKE \'a_c\' matches "abc", "axc"']
      ]
    },
    {
      type: 'example',
      title: 'LIKE and ILIKE Queries',
      content: 'Pattern matching on text columns:',
      code: `-- Names containing 'mouse' (case-sensitive)
SELECT * FROM products WHERE name LIKE '%Mouse%';

-- Names containing 'mouse' (case-insensitive, preferred)
SELECT * FROM products WHERE name ILIKE '%mouse%';

-- Names starting with 'Mec'
SELECT * FROM products WHERE name ILIKE 'mec%';

-- Names ending with 'Hub'
SELECT * FROM products WHERE name ILIKE '%hub';

-- Names with exactly 3-char prefix 'USB'
SELECT * FROM products WHERE sku LIKE 'USB-___';

-- NOT LIKE to exclude patterns
SELECT * FROM products WHERE name NOT ILIKE '%cable%';`,
      language: 'sql',
      output: ' id | name           | price  ----+----------------+-------   1 | Wireless Mouse | 29.99 (1 row)'
    },
    {
      type: 'heading',
      content: 'IN, NOT IN, BETWEEN, and IS NULL'
    },
    {
      type: 'example',
      title: 'Range and Set Filters',
      content: 'Concise ways to filter against sets or ranges:',
      code: `-- IN: match any value in a list
SELECT * FROM products
WHERE category IN ('electronics', 'furniture');

-- NOT IN: exclude values in a list
SELECT * FROM products
WHERE category NOT IN ('stationery', 'accessories');

-- BETWEEN: inclusive range
SELECT * FROM products
WHERE price BETWEEN 20 AND 60;

-- BETWEEN with dates
SELECT * FROM orders
WHERE created_at BETWEEN '2024-01-01' AND '2024-12-31';

-- IS NULL: rows where value is missing
SELECT * FROM products WHERE description IS NULL;

-- IS NOT NULL: rows where value is present
SELECT * FROM products WHERE description IS NOT NULL;`,
      language: 'sql',
      output: ' id | name                | price | category     ----+---------------------+-------+-------------   1 | Wireless Mouse      | 29.99 | electronics   3 | Desk Lamp           | 24.99 | furniture   4 | USB-C Hub           | 39.99 | electronics'
    },
    {
      type: 'warning',
      title: 'NULL Comparisons',
      content: 'Never use = NULL or != NULL. NULL is not a value, it is the absence of one. Use IS NULL and IS NOT NULL instead. The expression NULL = NULL evaluates to NULL, not true.'
    },
    {
      type: 'heading',
      content: 'DISTINCT -- Removing Duplicates'
    },
    {
      type: 'example',
      title: 'SELECT DISTINCT',
      content: 'Getting unique values from a column:',
      code: `-- Get unique category names
SELECT DISTINCT category FROM products;

-- Unique combinations of category and is_active
SELECT DISTINCT category, is_active FROM products
ORDER BY category;

-- Count of unique categories
SELECT COUNT(DISTINCT category) AS unique_categories
FROM products;`,
      language: 'sql',
      output: '  category    -------------  accessories  electronics  furniture  stationery (4 rows)'
    },
    {
      type: 'heading',
      content: 'Aggregate Functions'
    },
    {
      type: 'text',
      content: 'Aggregate functions compute a single result from a set of rows. They are the building blocks of analytics queries.'
    },
    {
      type: 'table',
      title: 'Common Aggregate Functions',
      headers: ['Function', 'Description', 'NULL Handling'],
      rows: [
        ['COUNT(*)', 'Count of all rows', 'Includes NULLs'],
        ['COUNT(col)', 'Count of non-NULL values', 'Ignores NULLs'],
        ['SUM(col)', 'Total sum of values', 'Ignores NULLs'],
        ['AVG(col)', 'Arithmetic mean', 'Ignores NULLs'],
        ['MIN(col)', 'Smallest value', 'Ignores NULLs'],
        ['MAX(col)', 'Largest value', 'Ignores NULLs']
      ]
    },
    {
      type: 'example',
      title: 'Aggregate Queries',
      content: 'Computing summary statistics across rows:',
      code: `-- Total number of products
SELECT COUNT(*) AS total_products FROM products;

-- Total inventory value
SELECT SUM(price * stock) AS inventory_value FROM products;

-- Average price per category
SELECT category, AVG(price) AS avg_price
FROM products
GROUP BY category;

-- Most and least expensive products
SELECT MIN(price) AS cheapest, MAX(price) AS most_expensive
FROM products;`,
      language: 'sql',
      output: ' category    | avg_price  -------------+-----------  electronics | 57.49       furniture   | 24.99       stationery  | 9.99       (3 rows)'
    },
    {
      type: 'heading',
      content: 'GROUP BY and HAVING'
    },
    {
      type: 'text',
      content: 'GROUP BY groups rows that share the same values in one or more columns, allowing aggregates to be computed per group. HAVING filters the grouped results (like WHERE but for groups).'
    },
    {
      type: 'example',
      title: 'GROUP BY with HAVING',
      content: 'Grouping and filtering groups:',
      code: `-- Count products per category
SELECT category, COUNT(*) AS product_count
FROM products
GROUP BY category
ORDER BY product_count DESC;

-- Average price per category, only where avg > 20
SELECT category, ROUND(AVG(price), 2) AS avg_price
FROM products
GROUP BY category
HAVING AVG(price) > 20
ORDER BY avg_price DESC;

-- Total stock value where category has more than 2 products
SELECT category, SUM(stock * price) AS total_value
FROM products
GROUP BY category
HAVING COUNT(*) > 2;`,
      language: 'sql',
      output: ' category    | product_count  -------------+---------------  electronics |             4   furniture   |             2   stationery  |             1  (3 rows)'
    },
    {
      type: 'note',
      title: 'WHERE vs HAVING',
      content: 'WHERE filters individual rows BEFORE grouping. HAVING filters groups AFTER grouping. You can use both in the same query: WHERE filters the input rows, GROUP BY groups them, and HAVING filters the resulting groups.'
    },
    {
      type: 'heading',
      content: 'Subqueries'
    },
    {
      type: 'example',
      title: 'Scalar and IN Subqueries',
      content: 'Using a query as the input to another query:',
      code: `-- Scalar subquery: products priced above average
SELECT name, price
FROM products
WHERE price > (SELECT AVG(price) FROM products);

-- IN subquery: orders from active users
SELECT * FROM orders
WHERE user_id IN (
  SELECT id FROM users WHERE is_active = true
);

-- Correlated subquery: for each product, show how it compares to its category average
SELECT name, price, category,
  (SELECT ROUND(AVG(p2.price),2)
   FROM products p2
   WHERE p2.category = p1.category) AS category_avg
FROM products p1
ORDER BY category, price;`,
      language: 'sql',
      output: ' name                | price | category    | category_avg  ---------------------+-------+-------------+--------------  Wireless Mouse      | 29.99 | electronics | 57.49  USB-C Hub           | 39.99 | electronics | 57.49  Gaming Headset      | 59.99 | electronics | 57.49'
    },
    {
      type: 'tip',
      title: 'Subqueries vs JOINs',
      content: 'Subqueries are often more readable, but JOINs are typically faster for large datasets because the query planner can optimize them better. As a rule of thumb, use JOINs when performance matters and subqueries when clarity matters.'
    },
    {
      type: 'tryit',
      title: 'Query Builder Simulator',
      js: `const output = document.getElementById('output');

const sales = [
  { id:1,  product:'Wireless Mouse',     category:'electronics', price:29.99, qty:5  },
  { id:2,  product:'Mechanical Keyboard',category:'electronics', price:89.99, qty:2  },
  { id:3,  product:'Desk Lamp',          category:'furniture',   price:24.99, qty:8  },
  { id:4,  product:'USB-C Hub',          category:'electronics', price:39.99, qty:6  },
  { id:5,  product:'Gaming Headset',     category:'electronics', price:59.99, qty:3  },
  { id:6,  product:'Notebook Pack',      category:'stationery',  price:9.99,  qty:20 },
  { id:7,  product:'Monitor Stand',      category:'furniture',   price:49.99, qty:4  },
  { id:8,  product:'Cable Organizer',    category:'accessories', price:14.99, qty:15 },
  { id:9,  product:'LED Strip',          category:'accessories', price:19.99, qty:10 },
  { id:10, product:'Standing Desk',      category:'furniture',   price:299.99,qty:1  }
];

let filterCat = 'all';
let minPrice = 0;
let maxPrice = 500;

function applyFilters() {
  return sales.filter(s =>
    (filterCat === 'all' || s.category === filterCat) &&
    s.price >= minPrice &&
    s.price <= maxPrice
  );
}

function render() {
  const filtered = applyFilters();
  const total = filtered.reduce((acc,s) => acc + s.price*s.qty, 0);
  const cats = [...new Set(sales.map(s=>s.category))].sort();

  let html = '<div style="padding:16px;font-family:system-ui,sans-serif">';
  html += '<h3 style="color:#336791;margin:0 0 12px">Sales Query Builder</h3>';

  // Controls
  html += '<div style="display:flex;gap:12px;margin-bottom:14px;flex-wrap:wrap;align-items:flex-end">';

  html += '<div><label style="font-size:11px;font-weight:700;color:#64748b;display:block;margin-bottom:4px">CATEGORY</label>';
  html += '<select id="cat-sel" onchange="updateCat(this.value)" style="padding:6px 10px;border:1px solid #cbd5e1;border-radius:6px;font-size:12px">';
  html += '<option value="all"' + (filterCat==='all'?' selected':'') + '>All Categories</option>';
  cats.forEach(c => { html += \`<option value="\${c}"\${filterCat===c?' selected':''}>\${c}</option>\`; });
  html += '</select></div>';

  html += '<div><label style="font-size:11px;font-weight:700;color:#64748b;display:block;margin-bottom:4px">MIN PRICE ($)</label>';
  html += \`<input id="min-p" type="number" value="\${minPrice}" min="0" step="5" onchange="updateMin(this.value)" style="width:90px;padding:6px 10px;border:1px solid #cbd5e1;border-radius:6px;font-size:12px"></div>\`;

  html += '<div><label style="font-size:11px;font-weight:700;color:#64748b;display:block;margin-bottom:4px">MAX PRICE ($)</label>';
  html += \`<input id="max-p" type="number" value="\${maxPrice}" min="0" step="5" onchange="updateMax(this.value)" style="width:90px;padding:6px 10px;border:1px solid #cbd5e1;border-radius:6px;font-size:12px"></div>\`;
  html += '</div>';

  // Query preview
  let q = 'SELECT * FROM sales';
  let conds = [];
  if (filterCat !== 'all') conds.push(\`category = '\${filterCat}'\`);
  if (minPrice > 0) conds.push(\`price >= \${minPrice}\`);
  if (maxPrice < 500) conds.push(\`price <= \${maxPrice}\`);
  if (conds.length) q += ' WHERE ' + conds.join(' AND ');
  html += \`<div style="background:#0d1117;color:#7ee787;font-family:monospace;font-size:11px;padding:10px 14px;border-radius:6px;margin-bottom:14px">\${q};</div>\`;

  // Results
  if (filtered.length === 0) {
    html += '<div style="text-align:center;padding:20px;color:#94a3b8;background:#f8fafc;border-radius:8px">No rows match the current filters.</div>';
  } else {
    html += '<table style="width:100%;border-collapse:collapse;font-size:12px">';
    html += '<thead><tr style="background:#336791;color:white">';
    ['#','Product','Category','Price','Qty','Revenue'].forEach(h => {
      html += \`<th style="padding:8px 10px;text-align:left">\${h}</th>\`;
    });
    html += '</tr></thead><tbody>';
    filtered.forEach((s,i) => {
      html += \`<tr style="background:\${i%2===0?'#fff':'#f8fafc'};border-bottom:1px solid #e2e8f0">\`;
      html += \`<td style="padding:7px 10px;font-family:monospace;color:#64748b">\${s.id}</td>\`;
      html += \`<td style="padding:7px 10px;font-weight:500">\${s.product}</td>\`;
      html += \`<td style="padding:7px 10px"><span style="background:#dbeafe;color:#1e40af;padding:2px 6px;border-radius:10px;font-size:10px">\${s.category}</span></td>\`;
      html += \`<td style="padding:7px 10px;font-family:monospace;color:#15803d">$\${s.price.toFixed(2)}</td>\`;
      html += \`<td style="padding:7px 10px;font-family:monospace">\${s.qty}</td>\`;
      html += \`<td style="padding:7px 10px;font-family:monospace;font-weight:600;color:#7c3aed">$\${(s.price*s.qty).toFixed(2)}</td>\`;
      html += '</tr>';
    });
    html += '</tbody></table>';
    html += \`<div style="margin-top:10px;text-align:right;font-size:12px;color:#475569">\${filtered.length} rows | Total Revenue: <strong style="color:#336791">$\${total.toFixed(2)}</strong></div>\`;
  }
  html += '</div>';
  output.innerHTML = html;
}

window.updateCat = function(v) { filterCat = v; render(); };
window.updateMin = function(v) { minPrice = parseFloat(v)||0; render(); };
window.updateMax = function(v) { maxPrice = parseFloat(v)||500; render(); };

render();`,
      css: ''
    }
  ],
  exercises: [
    {
      id: 'ex-05-1',
      question: 'What is the difference between WHERE and HAVING?',
      type: 'multiple-choice',
      options: [
        'WHERE works with JOINs; HAVING works with subqueries',
        'WHERE filters rows before grouping; HAVING filters groups after GROUP BY',
        'They are identical and interchangeable',
        'WHERE only works with numbers; HAVING works with any type'
      ],
      correct: 1,
      explanation: 'WHERE filters individual rows before any grouping occurs. HAVING filters the resulting groups after GROUP BY has been applied. You cannot use aggregate functions in WHERE, but you can in HAVING.'
    },
    {
      id: 'ex-05-2',
      question: 'Which query finds all users whose email contains "gmail"?',
      type: 'multiple-choice',
      options: [
        'SELECT * FROM users WHERE email = \'%gmail%\';',
        'SELECT * FROM users WHERE email ILIKE \'%gmail%\';',
        'SELECT * FROM users WHERE email CONTAINS \'gmail\';',
        'SELECT * FROM users WHERE email SEARCH \'gmail\';'
      ],
      correct: 1,
      explanation: 'ILIKE with % wildcards is the correct pattern for case-insensitive substring matching. Using = would require an exact match, and CONTAINS / SEARCH are not standard PostgreSQL operators.'
    },
    {
      id: 'ex-05-3',
      question: 'What does COUNT(*) return when used on a table with some NULL values in a column?',
      type: 'multiple-choice',
      options: [
        'It returns NULL',
        'It counts only non-NULL rows',
        'It counts all rows including those with NULL values',
        'It throws an error'
      ],
      correct: 2,
      explanation: 'COUNT(*) counts every row regardless of NULL values in any column. COUNT(column_name) counts only rows where that specific column is NOT NULL.'
    }
  ],
  quiz: [
    {
      id: 'q-05-1',
      question: 'Which operator checks if a value falls within a range, inclusive of both ends?',
      options: ['IN', 'BETWEEN', 'LIKE', 'EXISTS'],
      correct: 1,
      explanation: 'BETWEEN x AND y is inclusive on both ends, equivalent to >= x AND <= y. It works for numbers, dates, and strings.'
    },
    {
      id: 'q-05-2',
      question: 'How do you check for the absence of a value in PostgreSQL?',
      options: ['= NULL', '== NULL', 'IS NULL', 'NOT VALUE'],
      correct: 2,
      explanation: 'IS NULL is the correct way to test for a missing value. Comparisons with = NULL always return NULL (not true or false) because NULL represents an unknown value.'
    },
    {
      id: 'q-05-3',
      question: 'A subquery returns the average salary. Which outer query uses it correctly?',
      options: [
        'SELECT * FROM employees WHERE salary = AVG(salary);',
        'SELECT * FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);',
        'SELECT * FROM employees WHERE salary > AVG FROM employees;',
        'SELECT * FROM employees HAVING salary > AVG(salary);'
      ],
      correct: 1,
      explanation: 'A scalar subquery in parentheses inside WHERE is the correct pattern. You cannot use aggregate functions directly in a WHERE clause -- they must be wrapped in a subquery or used in HAVING after GROUP BY.'
    }
  ]
};
