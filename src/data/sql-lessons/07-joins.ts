import type { SqlLesson } from '../sql-curriculum';

export const lesson07: SqlLesson = {
  id: 'sql-07',
  title: 'JOINs',
  slug: '07-joins',
  chapter: 'querying',
  order: 7,
  difficulty: 'intermediate',
  readingTime: 13,
  description: 'Learn how to combine data from multiple tables using INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN, and SELF JOIN.',
  sections: [
    {
      type: 'text',
      content: 'Relational databases split data across multiple tables to avoid duplication — this is called normalization. A users table stores user information; an orders table stores order information. But often you need data from both at once: "show me all orders with the customer name." JOINs are how you combine data from multiple tables in a single query.'
    },
    {
      type: 'heading',
      content: 'Why JOINs Exist'
    },
    {
      type: 'text',
      content: 'Consider storing the customer name on every order row. If a customer updates their name, you would need to update every order row — missing even one creates inconsistency. Instead, orders store a user_id foreign key. To get the name, you JOIN the orders table to the users table on the shared key. This way names are stored once and stay consistent everywhere.'
    },
    {
      type: 'analogy',
      title: 'JOINs as a Lookup',
      content: 'Think of a JOIN like a VLOOKUP in Excel. Your orders sheet has a customer_id column. You look that ID up in your customers sheet to get the customer name. SQL JOIN does this for entire datasets simultaneously, matching every row where the condition is true.'
    },
    {
      type: 'heading',
      content: 'INNER JOIN'
    },
    {
      type: 'text',
      content: 'INNER JOIN returns only rows where there is a matching row in both tables. If an order has a user_id that does not exist in the users table, that order is excluded from the result. If a user has no orders, they are also excluded. INNER JOIN is the most common type — it returns the intersection of both tables based on the join condition.'
    },
    {
      type: 'heading',
      content: 'LEFT JOIN (LEFT OUTER JOIN)'
    },
    {
      type: 'text',
      content: 'LEFT JOIN returns all rows from the left (first) table plus matching rows from the right table. If there is no match in the right table, the right table columns contain NULL. Use LEFT JOIN when you want to keep all records from the main table regardless of whether they have related records in the joined table.'
    },
    {
      type: 'text',
      content: 'A common LEFT JOIN use case: find all users even those with no orders. With INNER JOIN, users with no orders disappear. With LEFT JOIN, they stay in the result and their order columns show NULL — you can then use WHERE order_id IS NULL to find users with no orders at all.'
    },
    {
      type: 'heading',
      content: 'RIGHT JOIN and FULL OUTER JOIN'
    },
    {
      type: 'text',
      content: 'RIGHT JOIN is the mirror of LEFT JOIN — it keeps all rows from the right table and NULLs for unmatched left rows. In practice, most developers rewrite RIGHT JOINs as LEFT JOINs by swapping table order — this makes queries easier to read left-to-right.'
    },
    {
      type: 'text',
      content: 'FULL OUTER JOIN returns all rows from both tables. Rows that match appear combined; rows from either table with no match appear with NULLs for the other table\'s columns. FULL OUTER JOIN is used for finding all discrepancies between two datasets.'
    },
    {
      type: 'heading',
      content: 'CROSS JOIN and SELF JOIN'
    },
    {
      type: 'text',
      content: 'CROSS JOIN returns the Cartesian product — every possible combination of rows from both tables. If table A has 100 rows and table B has 50 rows, CROSS JOIN produces 5,000 rows. It is rarely used intentionally but easy to create accidentally by forgetting the ON clause in older-style JOIN syntax.'
    },
    {
      type: 'text',
      content: 'SELF JOIN joins a table to itself. This is useful for hierarchical data where rows reference other rows in the same table — like an employees table where each employee has a manager_id pointing to another row in the same table.'
    },
    {
      type: 'table',
      title: 'JOIN Types Summarized',
      headers: ['JOIN Type', 'Returns', 'Common Use Case'],
      rows: [
        ['INNER JOIN', 'Only rows with matches in both tables', 'Get orders with customer details (both must exist)'],
        ['LEFT JOIN', 'All left rows + matching right rows (NULLs for no match)', 'Get all users, including those with no orders'],
        ['RIGHT JOIN', 'All right rows + matching left rows (NULLs for no match)', 'Rarely used — rewrite as LEFT JOIN'],
        ['FULL OUTER JOIN', 'All rows from both tables, NULLs for non-matches', 'Find mismatches between two datasets'],
        ['CROSS JOIN', 'Every combination (Cartesian product)', 'Generate combinations (e.g., all size/color pairs)'],
        ['SELF JOIN', 'Table joined to itself', 'Hierarchical data like org charts, employee-manager']
      ]
    },
    {
      type: 'example',
      title: 'INNER JOIN and LEFT JOIN',
      content: 'Combining users and orders with INNER JOIN (only matched rows), then LEFT JOIN to include users with no orders.',
      code: `-- INNER JOIN: orders with customer names (both sides must match)
SELECT
  o.id          AS order_id,
  u.first_name  || ' ' || u.last_name AS customer_name,
  u.email,
  o.amount,
  o.created_at
FROM orders o
INNER JOIN users u ON o.user_id = u.id
ORDER BY o.created_at DESC;

-- LEFT JOIN: ALL users, even those with no orders
-- Users with no orders have NULL for order columns
SELECT
  u.id,
  u.first_name,
  u.email,
  COUNT(o.id) AS order_count,
  COALESCE(SUM(o.amount), 0) AS total_spent
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.first_name, u.email
ORDER BY total_spent DESC;

-- LEFT JOIN with IS NULL: find users who have NEVER ordered
SELECT u.id, u.email
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE o.id IS NULL;`,
      language: 'sql'
    },
    {
      type: 'example',
      title: 'Multiple JOINs and SELF JOIN',
      content: 'Chaining multiple JOINs to combine three tables, and a SELF JOIN on the employees table to show each employee with their manager name.',
      code: `-- Multiple JOINs: orders with customer name and product name
SELECT
  o.id                AS order_id,
  u.first_name        AS customer,
  p.name              AS product,
  p.category,
  o.quantity,
  o.quantity * p.price AS line_total
FROM orders o
INNER JOIN users    u ON o.user_id    = u.id
INNER JOIN products p ON o.product_id = p.id
ORDER BY o.created_at DESC;

-- SELF JOIN: employees with their manager name
SELECT
  e.name         AS employee,
  e.title,
  m.name         AS manager_name
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id
ORDER BY e.name;`,
      language: 'sql'
    },
    {
      type: 'tip',
      title: 'Always Alias Table Names',
      content: 'When JOINing multiple tables, always give each table a short alias (FROM orders o, FROM users u). This makes column references unambiguous (o.id vs u.id) and queries much shorter and more readable.'
    },
    {
      type: 'note',
      title: 'JOIN Performance',
      content: 'JOINs perform well when the join columns are indexed. Without an index on the foreign key column, the database must scan the entire joined table for every row in the left table. Always index foreign key columns.'
    },
    {
      type: 'tryit',
      title: 'JOIN Visualizer',
      js: `const users = [
  { id: 1, name: 'Alice Chen', plan: 'pro' },
  { id: 2, name: 'Bob Smith', plan: 'free' },
  { id: 3, name: 'Carol Davis', plan: 'pro' },
  { id: 4, name: 'Dan Lee', plan: 'free' },
];
const orders = [
  { id: 101, user_id: 1, product: 'Pro Plan', amount: 29 },
  { id: 102, user_id: 1, product: 'Extra Storage', amount: 10 },
  { id: 103, user_id: 3, product: 'Pro Plan', amount: 29 },
  { id: 104, user_id: 5, product: 'Unknown User', amount: 50 }, // orphan
];

const joins = {
  'INNER JOIN': () => orders
    .map(o => ({ ...o, user: users.find(u => u.id === o.user_id) }))
    .filter(o => o.user)
    .map(o => ({ order_id: o.id, customer: o.user.name, product: o.product, amount: '$' + o.amount })),
  'LEFT JOIN (users)': () => users.map(u => {
    const userOrders = orders.filter(o => o.user_id === u.id);
    if (!userOrders.length) return [{ user_id: u.id, name: u.name, order_id: 'NULL', product: 'NULL', amount: 'NULL' }];
    return userOrders.map(o => ({ user_id: u.id, name: u.name, order_id: o.id, product: o.product, amount: '$'+o.amount }));
  }).flat(),
  'Find users with no orders': () => users
    .filter(u => !orders.some(o => o.user_id === u.id))
    .map(u => ({ user_id: u.id, name: u.name, note: 'No orders (LEFT JOIN + IS NULL)' })),
};

let active = 'INNER JOIN';

function renderTable(rows) {
  if (!rows.length) return '<p style="font-size:13px;color:#718096">No rows</p>';
  const cols = Object.keys(rows[0]);
  const head = cols.map(c => \`<th style="background:#336791;color:white;padding:6px 10px;text-align:left;font-size:11px;font-weight:700">\${c}</th>\`).join('');
  const body = rows.map((r, i) =>
    \`<tr style="background:\${i%2===0?'#fff':'#f8fafc'}">\${cols.map(c => \`<td style="padding:6px 10px;font-size:12px;font-family:monospace;border-bottom:1px solid #e2e8f0;color:\${r[c]==='NULL'?'#a0aec0':'inherit'}">\${r[c]}</td>\`).join('')}</tr>\`
  ).join('');
  return \`<table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:6px;overflow:hidden"><thead><tr>\${head}</tr></thead><tbody>\${body}</tbody></table>\`;
}

function render() {
  document.getElementById('btns').innerHTML = Object.keys(joins).map(k =>
    \`<button onclick="setJoin('\${k}')" style="padding:7px 14px;border:none;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;margin-right:6px;margin-bottom:6px;background:\${k===active?'#336791':'#e2e8f0'};color:\${k===active?'white':'#4a5568'}">\${k}</button>\`
  ).join('');
  const rows = joins[active]();
  document.getElementById('result').innerHTML = renderTable(rows);
  document.getElementById('count').textContent = rows.length + ' rows returned';
}

window.setJoin = function(k) { active = k; render(); };
render();`,
      css: `body { padding: 20px; font-family: system-ui, sans-serif; background: #f7fafc; }
h3 { color: #336791; margin: 0 0 6px 0; font-size: 15px; font-weight: 700; }
p { color: #718096; font-size: 13px; margin: 0 0 14px 0; }
#btns { margin-bottom: 12px; }
#count { font-size: 12px; color: #718096; margin-top: 8px; }`
    }
  ],
  exercises: [
    {
      id: 'ex-sql-7-1',
      question: 'You want all users from the users table, including those with no orders. Which JOIN type should you use?',
      type: 'multiple-choice',
      options: ['INNER JOIN', 'LEFT JOIN with users as the left table', 'RIGHT JOIN with orders as the right table', 'CROSS JOIN'],
      correct: 1,
      explanation: 'LEFT JOIN with users as the left table returns all users. For users with no orders, the order columns will be NULL. INNER JOIN would exclude users with no orders.'
    },
    {
      id: 'ex-sql-7-2',
      question: 'How do you find all users who have never placed an order?',
      type: 'multiple-choice',
      options: [
        'INNER JOIN orders WHERE orders.id = 0',
        'LEFT JOIN orders ON orders.user_id = users.id WHERE orders.id IS NULL',
        'NOT JOIN orders ON orders.user_id = users.id',
        'INNER JOIN orders WHERE orders.user_id NOT IN (SELECT id FROM users)'
      ],
      correct: 1,
      explanation: 'LEFT JOIN returns all users, with NULL for order columns when no matching order exists. Adding WHERE orders.id IS NULL then filters to only the users without orders — the "anti-join" pattern.'
    },
    {
      id: 'ex-sql-7-3',
      question: 'What does INNER JOIN return when no rows match the ON condition?',
      type: 'multiple-choice',
      options: [
        'Both tables fully (like FULL OUTER JOIN)',
        'An empty result set with no rows',
        'NULL values for all columns',
        'An error'
      ],
      correct: 1,
      explanation: 'INNER JOIN returns only rows where the ON condition matches in both tables. If no rows match, the result is an empty result set with zero rows — not an error, just no data.'
    }
  ],
  quiz: [
    {
      id: 'q-sql-7-1',
      question: 'What is the difference between INNER JOIN and LEFT JOIN?',
      options: [
        'INNER JOIN is faster; LEFT JOIN is slower',
        'INNER JOIN returns only matched rows; LEFT JOIN returns all left rows plus matched right rows (NULLs for no match)',
        'LEFT JOIN only works with two tables; INNER JOIN works with any number',
        'They return identical results when all rows have matches'
      ],
      correct: 1,
      explanation: 'INNER JOIN discards rows from either table that have no match. LEFT JOIN keeps all rows from the left table, filling right-side columns with NULL when there is no match. They produce the same result only when every left row has at least one match on the right.'
    },
    {
      id: 'q-sql-7-2',
      question: 'Why should you always index foreign key columns?',
      options: [
        'Foreign keys require an index to be created',
        'Without an index, the database must scan the entire joined table for each row on the other side',
        'Indexes make foreign key constraints enforced faster',
        'Indexes prevent NULL values in foreign key columns'
      ],
      correct: 1,
      explanation: 'When you JOIN on a foreign key, the database needs to look up matching rows in the joined table. Without an index, it scans every row (O(n) per lookup). With a B-tree index, it jumps directly to matches (O(log n)). On large tables this is the difference between milliseconds and minutes.'
    },
    {
      id: 'q-sql-7-3',
      question: 'What is a SELF JOIN used for?',
      options: [
        'Joining a table to a backup copy of itself',
        'Joining a table to itself to represent hierarchical relationships within the same table',
        'Duplicating all rows in a table',
        'SELF JOIN is not valid SQL'
      ],
      correct: 1,
      explanation: 'A SELF JOIN joins a table to itself using table aliases. It is used for hierarchical data where rows reference other rows in the same table — like employees with manager_id pointing to another employee, or categories with parent_id.'
    }
  ]
};
