import type { PostgresqlLesson } from '../postgresql-curriculum';

export const lesson06: PostgresqlLesson = {
  id: 'postgresql-06',
  title: 'Joins and Relationships',
  slug: '06-joins',
  chapter: 'queries',
  order: 6,
  difficulty: 'intermediate',
  readingTime: 16,
  description: 'Learn how to combine data from multiple tables using different types of JOINs, foreign keys, and referential integrity constraints.',
  sections: [
    {
      type: 'text',
      content: 'One of the most powerful features of relational databases is the ability to link tables together. Joins let you combine rows from two or more tables based on a related column, enabling you to query data spread across normalized tables as if it were one.'
    },
    {
      type: 'heading',
      content: 'Foreign Keys and Relationships'
    },
    {
      type: 'text',
      content: 'A foreign key is a column (or set of columns) that refers to the primary key of another table. It enforces referential integrity, ensuring that related data is always consistent.'
    },
    {
      type: 'example',
      title: 'Defining Foreign Keys',
      content: 'Creating a one-to-many relationship between users and orders:',
      code: `-- Parent table
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) NOT NULL UNIQUE
);

-- Child table with foreign key
CREATE TABLE orders (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id),
  total      NUMERIC(10,2) NOT NULL DEFAULT 0,
  status     VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);`,
      language: 'sql',
      output: 'CREATE TABLE\nCREATE TABLE'
    },
    {
      type: 'heading',
      content: 'ON DELETE Actions'
    },
    {
      type: 'table',
      title: 'Foreign Key ON DELETE Options',
      headers: ['Action', 'Behavior', 'Use Case'],
      rows: [
        ['RESTRICT', 'Prevents deleting parent if children exist (default)', 'Most situations -- safe'],
        ['CASCADE', 'Deletes child rows when parent is deleted', 'Orders/order-items, profile/settings'],
        ['SET NULL', 'Sets foreign key column to NULL on parent delete', 'Optional relationships'],
        ['SET DEFAULT', 'Sets foreign key to its default value', 'Fallback category, default owner'],
        ['NO ACTION', 'Same as RESTRICT but checked at end of transaction', 'Deferred constraint checking']
      ]
    },
    {
      type: 'example',
      title: 'ON DELETE CASCADE Example',
      content: 'Automatically delete order_items when an order is deleted:',
      code: `CREATE TABLE order_items (
  id         SERIAL PRIMARY KEY,
  order_id   INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity   INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL
);`,
      language: 'sql',
      output: 'CREATE TABLE'
    },
    {
      type: 'heading',
      content: 'INNER JOIN'
    },
    {
      type: 'text',
      content: 'INNER JOIN returns only the rows where the join condition is true in BOTH tables. Rows without a match in either table are excluded.'
    },
    {
      type: 'analogy',
      title: 'Set Intersection',
      content: 'INNER JOIN is like the intersection of two circles in a Venn diagram. Only records that exist in both circles (both tables) appear in the results.'
    },
    {
      type: 'example',
      title: 'INNER JOIN',
      content: 'Get orders with their customer names:',
      code: `-- Basic INNER JOIN
SELECT
  orders.id AS order_id,
  users.name AS customer,
  orders.total,
  orders.status
FROM orders
INNER JOIN users ON orders.user_id = users.id;

-- Shorter with table aliases
SELECT
  o.id,
  u.name,
  o.total,
  o.status
FROM orders o
JOIN users u ON o.user_id = u.id
ORDER BY o.id;`,
      language: 'sql',
      output: ' order_id | customer    | total  | status  \n----------+-------------+--------+---------\n        1 | Alice Smith | 149.97 | shipped\n        2 | Bob Jones   |  89.99 | pending\n        3 | Alice Smith |  29.99 | delivered'
    },
    {
      type: 'heading',
      content: 'LEFT JOIN (LEFT OUTER JOIN)'
    },
    {
      type: 'text',
      content: 'LEFT JOIN returns ALL rows from the left table plus matching rows from the right table. When there is no match in the right table, the right-side columns are NULL.'
    },
    {
      type: 'example',
      title: 'LEFT JOIN',
      content: 'Get all users, including those with no orders:',
      code: `-- All users, with their order count (0 if no orders)
SELECT
  u.name,
  u.email,
  COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name, u.email
ORDER BY order_count DESC;

-- Find users who have NEVER placed an order
SELECT u.name, u.email
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.id IS NULL;`,
      language: 'sql',
      output: '   name     |         email          | order_count \n------------+------------------------+-------------\n Alice Smith | alice@example.com      |           2\n Bob Jones   | bob@example.com        |           1\n Carol Wang  | carol@example.com      |           0'
    },
    {
      type: 'heading',
      content: 'RIGHT JOIN and FULL OUTER JOIN'
    },
    {
      type: 'example',
      title: 'RIGHT JOIN and FULL OUTER JOIN',
      content: 'Less common but useful join types:',
      code: `-- RIGHT JOIN: all rows from right table, matching from left
SELECT u.name, o.id AS order_id, o.total
FROM users u
RIGHT JOIN orders o ON u.id = o.user_id;
-- (all orders, even if user was deleted -- rare use case)

-- FULL OUTER JOIN: all rows from both tables
SELECT u.name, o.id AS order_id, o.total
FROM users u
FULL OUTER JOIN orders o ON u.id = o.user_id;
-- (users with no orders + orders with no user)`,
      language: 'sql',
      output: '   name     | order_id | total  \n------------+----------+--------\n Alice Smith |        1 | 149.97\n Bob Jones   |        2 |  89.99\n Alice Smith |        3 |  29.99\n NULL        |        4 |  59.99'
    },
    {
      type: 'note',
      title: 'Prefer LEFT JOIN Over RIGHT JOIN',
      content: 'RIGHT JOIN can always be rewritten as a LEFT JOIN by swapping the table order. Most developers stick to LEFT JOIN for consistency and readability.'
    },
    {
      type: 'heading',
      content: 'Joining Multiple Tables'
    },
    {
      type: 'example',
      title: 'Three-Table JOIN',
      content: 'Joining users, orders, and products together:',
      code: `-- Full order details: customer + order + product info
SELECT
  u.name       AS customer,
  o.id         AS order_id,
  p.name       AS product,
  oi.quantity,
  oi.unit_price,
  (oi.quantity * oi.unit_price) AS line_total
FROM orders o
JOIN users u       ON o.user_id    = u.id
JOIN order_items oi ON oi.order_id = o.id
JOIN products p    ON oi.product_id = p.id
ORDER BY o.id, p.name;`,
      language: 'sql',
      output: ' customer    | order_id | product         | quantity | unit_price | line_total \n-------------+----------+-----------------+----------+------------+------------\n Alice Smith |        1 | Wireless Mouse  |        2 |      29.99 |      59.98\n Alice Smith |        1 | USB-C Hub       |        3 |      39.99 |     119.97'
    },
    {
      type: 'heading',
      content: 'Self Joins'
    },
    {
      type: 'example',
      title: 'Self Join -- Employee Hierarchy',
      content: 'Joining a table to itself to query hierarchical data:',
      code: `-- employees table with manager_id referencing employees.id
CREATE TABLE employees (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  manager_id INTEGER REFERENCES employees(id)
);

-- Self join: get each employee with their manager's name
SELECT
  e.name AS employee,
  m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id
ORDER BY m.name NULLS LAST, e.name;`,
      language: 'sql',
      output: '    employee    |   manager    \n----------------+--------------\n Alice (CEO)    | NULL\n Bob            | Alice (CEO)\n Carol          | Alice (CEO)\n Dave           | Bob'
    },
    {
      type: 'tip',
      title: 'Join Performance',
      content: 'Join columns should be indexed. PostgreSQL automatically creates an index on PRIMARY KEY columns. For foreign key columns (like user_id, order_id), add explicit indexes: CREATE INDEX ON orders(user_id); This dramatically speeds up joins on large tables.'
    },
    {
      type: 'tryit',
      title: 'Visual JOIN Diagram',
      js: `const output = document.getElementById('output');

const users = [
  { id: 1, name: 'Alice Smith',  email: 'alice@ex.com' },
  { id: 2, name: 'Bob Jones',    email: 'bob@ex.com'   },
  { id: 3, name: 'Carol Wang',   email: 'carol@ex.com' },
  { id: 4, name: 'Dave Park',    email: 'dave@ex.com'  }
];

const orders = [
  { id: 101, user_id: 1, total: 149.97, status: 'shipped'   },
  { id: 102, user_id: 2, total:  89.99, status: 'pending'   },
  { id: 103, user_id: 1, total:  29.99, status: 'delivered' },
  { id: 104, user_id: 5, total:  59.99, status: 'pending'   }
];

let joinType = 'inner';

function getResults() {
  if (joinType === 'inner') {
    return users.flatMap(u => orders.filter(o => o.user_id === u.id).map(o => ({ ...u, ...o, uName: u.name })));
  } else if (joinType === 'left') {
    return users.map(u => {
      const ords = orders.filter(o => o.user_id === u.id);
      if (ords.length === 0) return [{ ...u, id: u.id, order_id: null, total: null, status: null, uName: u.name }];
      return ords.map(o => ({ ...u, order_id: o.id, total: o.total, status: o.status, uName: u.name }));
    }).flat();
  } else {
    const leftRows = users.map(u => {
      const ords = orders.filter(o => o.user_id === u.id);
      if (ords.length === 0) return [{ uName: u.name, uEmail: u.email, order_id: null, total: null, status: null }];
      return ords.map(o => ({ uName: u.name, uEmail: u.email, order_id: o.id, total: o.total, status: o.status }));
    }).flat();
    const unmatchedOrders = orders.filter(o => !users.find(u => u.id === o.user_id))
      .map(o => ({ uName: null, uEmail: null, order_id: o.id, total: o.total, status: o.status }));
    return [...leftRows, ...unmatchedOrders];
  }
}

function statusBadge(s) {
  if (!s) return '<span style="color:#94a3b8">NULL</span>';
  const colors = { shipped:'#15803d', pending:'#a16207', delivered:'#1e40af' };
  return \`<span style="background:\${colors[s]||'#64748b'}22;color:\${colors[s]||'#64748b'};padding:2px 7px;border-radius:10px;font-size:10px;font-weight:600">\${s}</span>\`;
}

function render() {
  const results = getResults();
  const btnStyle = (t) => joinType===t
    ? 'background:#336791;color:white;border:none;padding:7px 14px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600'
    : 'background:#e2e8f0;color:#475569;border:none;padding:7px 14px;border-radius:6px;cursor:pointer;font-size:12px';

  let html = '<div style="padding:16px;font-family:system-ui,sans-serif">';
  html += '<h3 style="color:#336791;margin:0 0 12px">JOIN Visualizer</h3>';
  html += '<div style="display:flex;gap:8px;margin-bottom:16px">';
  ['inner','left','full'].forEach(t => {
    const labels = { inner:'INNER JOIN', left:'LEFT JOIN', full:'FULL OUTER JOIN' };
    html += \`<button onclick="setJoin('\${t}')" style="\${btnStyle(t)}">\${labels[t]}</button>\`;
  });
  html += '</div>';

  // Two source tables side by side
  html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">';

  // Users table
  html += '<div><p style="font-size:11px;font-weight:700;color:#7c3aed;margin:0 0 6px;text-transform:uppercase">users</p>';
  html += '<table style="width:100%;border-collapse:collapse;font-size:12px">';
  html += '<thead><tr style="background:#7c3aed;color:white"><th style="padding:6px 8px;text-align:left">id</th><th style="padding:6px 8px;text-align:left">name</th></tr></thead><tbody>';
  users.forEach((u,i) => {
    const matched = joinType==='inner' ? orders.some(o=>o.user_id===u.id) : true;
    const bg = matched ? (i%2===0?'#f5f3ff':'#ede9fe') : '#f1f5f9';
    html += \`<tr style="background:\${bg}"><td style="padding:6px 8px;font-family:monospace">\${u.id}</td><td style="padding:6px 8px">\${u.name}</td></tr>\`;
  });
  html += '</tbody></table></div>';

  // Orders table
  html += '<div><p style="font-size:11px;font-weight:700;color:#0369a1;margin:0 0 6px;text-transform:uppercase">orders</p>';
  html += '<table style="width:100%;border-collapse:collapse;font-size:12px">';
  html += '<thead><tr style="background:#0369a1;color:white"><th style="padding:6px 8px;text-align:left">id</th><th style="padding:6px 8px;text-align:left">user_id</th><th style="padding:6px 8px;text-align:left">total</th></tr></thead><tbody>';
  orders.forEach((o,i) => {
    const matched = users.some(u=>u.id===o.user_id);
    const bg = matched ? (i%2===0?'#eff6ff':'#dbeafe') : (joinType==='full'?'#fff7ed':'#f1f5f9');
    html += \`<tr style="background:\${bg}"><td style="padding:6px 8px;font-family:monospace">\${o.id}</td><td style="padding:6px 8px;font-family:monospace;\${!matched?'color:#ef4444':'color:#0369a1;font-weight:600'}">\${o.user_id}</td><td style="padding:6px 8px;font-family:monospace">$\${o.total}</td></tr>\`;
  });
  html += '</tbody></table></div></div>';

  // Result table
  html += \`<p style="font-size:11px;font-weight:700;color:#336791;margin:0 0 6px;text-transform:uppercase">Result (\${results.length} rows)</p>\`;
  html += '<table style="width:100%;border-collapse:collapse;font-size:12px">';
  html += '<thead><tr style="background:#336791;color:white">';
  ['user.name','order_id','total','status'].forEach(h => {
    html += \`<th style="padding:8px 10px;text-align:left">\${h}</th>\`;
  });
  html += '</tr></thead><tbody>';
  results.forEach((r,i) => {
    html += \`<tr style="background:\${i%2===0?'#fff':'#f8fafc'};border-bottom:1px solid #e2e8f0">\`;
    html += \`<td style="padding:7px 10px">\${r.uName || '<span style="color:#94a3b8">NULL</span>'}</td>\`;
    html += \`<td style="padding:7px 10px;font-family:monospace">\${r.order_id || '<span style="color:#94a3b8">NULL</span>'}</td>\`;
    html += \`<td style="padding:7px 10px;font-family:monospace">\${r.total ? '$'+r.total : '<span style="color:#94a3b8">NULL</span>'}</td>\`;
    html += \`<td style="padding:7px 10px">\${statusBadge(r.status)}</td>\`;
    html += '</tr>';
  });
  html += '</tbody></table></div>';
  output.innerHTML = html;
}

window.setJoin = function(t) { joinType = t; render(); };
render();`,
      css: ''
    }
  ],
  exercises: [
    {
      id: 'ex-06-1',
      question: 'What does a LEFT JOIN return that an INNER JOIN does not?',
      type: 'multiple-choice',
      options: [
        'All rows from the right table including non-matching rows',
        'All rows from the left table, with NULLs for right-side columns when no match exists',
        'Only rows where both tables have matching values',
        'Duplicate rows from both tables'
      ],
      correct: 1,
      explanation: 'LEFT JOIN returns all rows from the left table. When a row in the left table has no matching row in the right table, the right-side columns are filled with NULL. INNER JOIN would exclude that row entirely.'
    },
    {
      id: 'ex-06-2',
      question: 'You need to find all customers who have NEVER placed an order. Which query achieves this?',
      type: 'multiple-choice',
      options: [
        'SELECT * FROM users INNER JOIN orders ON users.id = orders.user_id WHERE orders.id IS NULL;',
        'SELECT * FROM users LEFT JOIN orders ON users.id = orders.user_id WHERE orders.id IS NULL;',
        'SELECT * FROM users WHERE user_id NOT IN orders;',
        'SELECT * FROM users OUTER JOIN orders ON users.id = orders.user_id;'
      ],
      correct: 1,
      explanation: 'A LEFT JOIN keeps all users. Filtering WHERE orders.id IS NULL keeps only users where no matching order was found. This "LEFT JOIN + IS NULL" pattern is the standard way to find rows with no related records.'
    },
    {
      id: 'ex-06-3',
      question: 'What does ON DELETE CASCADE mean on a foreign key?',
      type: 'multiple-choice',
      options: [
        'The child row must be deleted before the parent can be deleted',
        'When the parent row is deleted, all related child rows are automatically deleted',
        'Deletion is cascaded to the parent when a child is deleted',
        'NULL is inserted into the foreign key column when the parent is deleted'
      ],
      correct: 1,
      explanation: 'ON DELETE CASCADE means that when a parent row is deleted, all child rows referencing that parent are automatically deleted as well. For example, deleting an order automatically deletes all its order_items.'
    }
  ],
  quiz: [
    {
      id: 'q-06-1',
      question: 'What type of JOIN returns all rows from both tables, filling in NULL where there is no match?',
      options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'],
      correct: 3,
      explanation: 'FULL OUTER JOIN returns all rows from both tables. When a row in one table has no match in the other, the missing side is filled with NULL.'
    },
    {
      id: 'q-06-2',
      question: 'In a self join, what is joining the table to itself used for?',
      options: [
        'Duplicating all rows in a table',
        'Querying hierarchical or recursive data within the same table, such as employee-manager relationships',
        'Comparing two different databases',
        'Making a backup copy of the table'
      ],
      correct: 1,
      explanation: 'A self join joins a table to itself using aliases. It is used for hierarchical data where rows in the same table reference other rows, such as employees having a manager_id that references another employee\'s id.'
    },
    {
      id: 'q-06-3',
      question: 'Which foreign key action prevents deleting a parent row if child rows exist?',
      options: ['ON DELETE CASCADE', 'ON DELETE SET NULL', 'ON DELETE RESTRICT', 'ON DELETE NO ACTION'],
      correct: 2,
      explanation: 'ON DELETE RESTRICT prevents deleting the parent row if any child rows reference it. It is the safest option and the default behavior when no ON DELETE action is specified.'
    }
  ]
};
