import type { SqliteLesson } from '../sqlite-curriculum';

export const lesson04: SqliteLesson = {
  id: 'sqlite-04',
  title: 'Relationships and Foreign Keys',
  slug: '04-relationships',
  chapter: 'usage',
  order: 4,
  difficulty: 'intermediate',
  readingTime: 10,
  description: 'Model one-to-many and many-to-many relationships in SQLite, enable foreign key constraints, and use JOINs to query related data.',
  sections: [
    {
      type: 'text',
      content: 'Real-world data has relationships. A user has many orders. An order has many products. A product belongs to many categories. SQLite supports all standard relationship patterns through foreign keys and JOIN queries — with one critical difference from PostgreSQL: foreign key enforcement is disabled by default and must be explicitly enabled.'
    },
    {
      type: 'heading',
      content: 'Enabling Foreign Keys'
    },
    {
      type: 'text',
      content: 'In SQLite, foreign key constraints exist in the schema definition but are not enforced unless you run PRAGMA foreign_keys = ON. This pragma must be set on every database connection — it is not persisted in the database file. If you omit it, you can insert rows with invalid foreign key values and delete parent rows while child rows still reference them.'
    },
    {
      type: 'warning',
      title: 'Foreign Keys OFF by Default',
      content: 'This is a common SQLite gotcha. You can define REFERENCES in your CREATE TABLE but the constraint does nothing unless PRAGMA foreign_keys = ON is set on each connection. Always set this pragma as the first thing after opening a connection.'
    },
    {
      type: 'heading',
      content: 'One-to-Many Relationships'
    },
    {
      type: 'text',
      content: 'A one-to-many relationship means one row in table A can relate to many rows in table B, but each row in B relates to exactly one row in A. Examples: one user has many orders, one blog post has many comments, one category has many products. You model this by adding a foreign key column to the "many" side table.'
    },
    {
      type: 'heading',
      content: 'Many-to-Many Relationships'
    },
    {
      type: 'text',
      content: 'A many-to-many relationship means one row in A can relate to many rows in B AND one row in B can relate to many rows in A. Examples: articles have many tags, tags apply to many articles. SQL has no direct syntax for many-to-many — you model it with a junction table (also called a pivot or linking table) that has foreign keys to both sides.'
    },
    {
      type: 'example',
      title: 'Relationships in SQLite',
      content: 'Setting up one-to-many (users to orders) and many-to-many (articles to tags) relationships with foreign keys and junction table.',
      code: `const Database = require('better-sqlite3');
const db = new Database(':memory:');

// CRITICAL: enable foreign key enforcement every connection
db.pragma('foreign_keys = ON');

db.exec(\`
  -- One-to-many: one user -> many orders
  CREATE TABLE users (
    id    INTEGER PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name  TEXT NOT NULL
  );

  CREATE TABLE orders (
    id         INTEGER PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product    TEXT NOT NULL,
    amount     REAL NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- Many-to-many: articles <-> tags via junction table
  CREATE TABLE articles (
    id    INTEGER PRIMARY KEY,
    title TEXT NOT NULL
  );

  CREATE TABLE tags (
    id   INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE article_tags (
    article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    tag_id     INTEGER NOT NULL REFERENCES tags(id)    ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)  -- composite PK prevents duplicates
  );
\`);

// Seed data
db.prepare("INSERT INTO users VALUES (1, 'alice@ex.com', 'Alice')").run();
db.prepare("INSERT INTO orders VALUES (null, 1, 'Pro Plan', 29.99, null)").run();
db.prepare("INSERT INTO orders VALUES (null, 1, 'Storage', 9.99, null)").run();

// This would fail because user_id 999 doesn't exist:
// db.prepare("INSERT INTO orders VALUES (null, 999, 'X', 1, null)").run();`,
      language: 'javascript'
    },
    {
      type: 'example',
      title: 'JOIN Queries in SQLite',
      content: 'Querying related data with INNER JOIN and LEFT JOIN, and a many-to-many query through the junction table.',
      code: `// INNER JOIN: orders with user details
const ordersWithUsers = db.prepare(\`
  SELECT
    o.id         AS order_id,
    u.name       AS customer,
    u.email,
    o.product,
    o.amount
  FROM orders o
  INNER JOIN users u ON o.user_id = u.id
  ORDER BY o.amount DESC
\`).all();

console.log(ordersWithUsers);
// [
//   { order_id: 1, customer: 'Alice', email: '...', product: 'Pro Plan', amount: 29.99 },
//   { order_id: 2, customer: 'Alice', email: '...', product: 'Storage', amount: 9.99 }
// ]

// LEFT JOIN: all users and their order count (including users with 0 orders)
const userStats = db.prepare(\`
  SELECT
    u.id,
    u.name,
    COUNT(o.id)       AS order_count,
    COALESCE(SUM(o.amount), 0) AS total_spent
  FROM users u
  LEFT JOIN orders o ON o.user_id = u.id
  GROUP BY u.id, u.name
\`).all();

// Many-to-many: find all tags for a given article
const tagsForArticle = db.prepare(\`
  SELECT t.name
  FROM tags t
  INNER JOIN article_tags at ON at.tag_id = t.id
  WHERE at.article_id = ?
\`).all(articleId);`,
      language: 'javascript'
    },
    {
      type: 'heading',
      content: 'Common Relationship Patterns'
    },
    {
      type: 'table',
      title: 'Relationship Patterns in SQLite',
      headers: ['Pattern', 'Implementation', 'Example'],
      rows: [
        ['One-to-many', 'Foreign key on the "many" table', 'orders.user_id REFERENCES users(id)'],
        ['Many-to-many', 'Junction table with two foreign keys', 'article_tags(article_id, tag_id)'],
        ['One-to-one', 'Foreign key with UNIQUE constraint', 'profiles.user_id REFERENCES users(id) UNIQUE'],
        ['Self-referential', 'Foreign key to same table', 'employees.manager_id REFERENCES employees(id)'],
        ['Polymorphic', 'entity_type + entity_id columns (app-level)', 'comments(entity_type, entity_id)']
      ]
    },
    {
      type: 'tip',
      title: 'ON DELETE CASCADE vs RESTRICT',
      content: 'ON DELETE CASCADE automatically removes child rows when the parent is deleted. ON DELETE RESTRICT prevents deleting a parent if children exist. CASCADE is convenient but dangerous if misused. RESTRICT is safer — it forces you to handle child rows explicitly. Choose based on your data model requirements.'
    },
    {
      type: 'tryit',
      title: 'Relationship Visualizer',
      js: `const users = [
  { id: 1, name: 'Alice Chen', email: 'alice@example.com' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
  { id: 3, name: 'Carol Davis', email: 'carol@example.com' },
];
const orders = [
  { id: 101, user_id: 1, product: 'Pro Plan', amount: 29.99 },
  { id: 102, user_id: 1, product: 'Storage', amount: 9.99 },
  { id: 103, user_id: 2, product: 'Pro Plan', amount: 29.99 },
];

let activeUserId = null;

function renderUsers() {
  return users.map(u => {
    const uOrders = orders.filter(o => o.user_id === u.id);
    const isActive = activeUserId === u.id;
    return \`<div onclick="selectUser(\${u.id})" style="cursor:pointer;background:\${isActive?'#e0e8f5':'white'};border:2px solid \${isActive?'#0F3B70':'#e2e8f0'};border-radius:8px;padding:12px;margin-bottom:8px;transition:.15s">
      <div style="font-weight:700;font-size:13px;color:#1a202c">\${u.name}</div>
      <div style="font-size:11px;color:#718096">\${u.email}</div>
      <div style="font-size:11px;color:#0F3B70;margin-top:4px;font-weight:600">\${uOrders.length} order\${uOrders.length!==1?'s':''}</div>
    </div>\`;
  }).join('');
}

function renderOrders() {
  if (!activeUserId) return '<p style="font-size:12px;color:#718096">Click a user to see their orders</p>';
  const uOrders = orders.filter(o => o.user_id === activeUserId);
  if (!uOrders.length) return '<p style="font-size:12px;color:#718096">No orders for this user</p>';
  return uOrders.map(o =>
    \`<div style="background:white;border:1px solid #e2e8f0;border-radius:6px;padding:10px;margin-bottom:6px">
      <div style="display:flex;justify-content:space-between">
        <span style="font-weight:600;font-size:13px">\${o.product}</span>
        <span style="font-weight:700;color:#0F3B70;font-family:monospace">$\${o.amount}</span>
      </div>
      <div style="font-size:11px;color:#718096">order_id: \${o.id} | user_id: \${o.user_id}</div>
    </div>\`
  ).join('');
}

function render() {
  document.getElementById('users').innerHTML = renderUsers();
  document.getElementById('orders').innerHTML = renderOrders();
  const u = users.find(u => u.id === activeUserId);
  document.getElementById('join-title').textContent = u ? \`Orders for \${u.name}\` : 'Orders (click user)';
}

window.selectUser = function(id) { activeUserId = activeUserId === id ? null : id; render(); };
render();`,
      css: `body { padding: 20px; font-family: system-ui, sans-serif; background: #f7fafc; }
h3 { color: #0F3B70; margin: 0 0 6px 0; font-size: 15px; font-weight: 700; }
p { color: #718096; font-size: 13px; margin: 0 0 14px 0; }
.layout { display: flex; gap: 16px; }
.col { flex: 1; }
.col-title { font-size: 11px; font-weight: 700; color: #0F3B70; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 8px; }
#join-title { font-size: 11px; font-weight: 700; color: #0F3B70; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 8px; }`
    }
  ],
  exercises: [
    {
      id: 'ex-sqlite-4-1',
      question: 'What must you run at the start of every SQLite connection to enforce foreign key constraints?',
      type: 'multiple-choice',
      options: [
        'SET FOREIGN_KEYS = ON',
        'PRAGMA foreign_keys = ON',
        'ENABLE FOREIGN KEYS',
        'ALTER DATABASE SET FOREIGN_KEYS TRUE'
      ],
      correct: 1,
      explanation: 'SQLite requires PRAGMA foreign_keys = ON on each connection. This must be set after opening the connection. In better-sqlite3: db.pragma(\'foreign_keys = ON\'). Without this, foreign key constraints are defined but not enforced.'
    },
    {
      id: 'ex-sqlite-4-2',
      question: 'How do you model a many-to-many relationship in SQL?',
      type: 'multiple-choice',
      options: [
        'With a MANY TO MANY column type',
        'By storing a comma-separated list in one column',
        'With a junction (linking) table that has foreign keys to both related tables',
        'Many-to-many is not possible in SQL'
      ],
      correct: 2,
      explanation: 'SQL models many-to-many relationships through a junction table (also called a pivot or bridge table). This table has at minimum two foreign key columns, one pointing to each related table. The combination of both foreign keys is often the primary key.'
    },
    {
      id: 'ex-sqlite-4-3',
      question: 'What does ON DELETE CASCADE do on a foreign key in SQLite?',
      type: 'multiple-choice',
      options: [
        'Prevents deletion of the parent row if child rows exist',
        'Automatically deletes all child rows when the parent row is deleted',
        'Sets the foreign key column to NULL when the parent is deleted',
        'Creates a backup before deletion'
      ],
      correct: 1,
      explanation: 'ON DELETE CASCADE means: when a parent row is deleted, automatically delete all child rows that reference it. For example, deleting a user with ON DELETE CASCADE on orders will also delete all that user\'s orders.'
    }
  ],
  quiz: [
    {
      id: 'q-sqlite-4-1',
      question: 'Why is a composite PRIMARY KEY (article_id, tag_id) useful in a junction table?',
      options: [
        'It makes queries faster',
        'It prevents the same article-tag pair from being inserted more than once',
        'It is required for junction tables',
        'It automatically creates indexes on both columns'
      ],
      correct: 1,
      explanation: 'A composite primary key on (article_id, tag_id) ensures uniqueness for the combination — you cannot tag an article with the same tag twice. It also creates an implicit index on the leftmost column (article_id), speeding up article-to-tags lookups.'
    },
    {
      id: 'q-sqlite-4-2',
      question: 'A user has many orders. Which table should have the foreign key?',
      options: [
        'The users table (user.order_id)',
        'The orders table (orders.user_id)',
        'Both tables should have foreign keys to each other',
        'A junction table is needed'
      ],
      correct: 1,
      explanation: 'In a one-to-many relationship, the foreign key goes on the "many" side. Each order belongs to one user, so orders.user_id references users.id. If it were on the users table, a user could only reference one order.'
    },
    {
      id: 'q-sqlite-4-3',
      question: 'What does COALESCE(SUM(o.amount), 0) do in a LEFT JOIN aggregate query?',
      options: [
        'Converts NULL amounts to zero',
        'Returns 0 for users with no orders (where SUM returns NULL due to no rows to sum)',
        'Rounds the sum to zero decimal places',
        'Returns the first non-null value from the orders table'
      ],
      correct: 1,
      explanation: 'When a user has no orders (from a LEFT JOIN), SUM(o.amount) returns NULL because there are no rows to sum. COALESCE(SUM(o.amount), 0) returns 0 in that case instead of NULL, giving you a clean "0" for users with no spending.'
    }
  ]
};
