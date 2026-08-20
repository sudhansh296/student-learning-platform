import type { PostgresqlLesson } from '../postgresql-curriculum';

export const lesson10: PostgresqlLesson = {
  id: 'postgresql-10',
  title: 'PostgreSQL with Node.js',
  slug: '10-nodejs-pg',
  chapter: 'advanced',
  order: 10,
  difficulty: 'intermediate',
  readingTime: 16,
  description: 'Connect Node.js to PostgreSQL using the pg package, write parameterized queries, handle errors, use connection pools, and build a simple CRUD API.',
  sections: [
    {
      type: 'text',
      content: 'The most popular PostgreSQL client for Node.js is the pg package (node-postgres). It is a pure JavaScript library that supports async/await, connection pooling, and parameterized queries out of the box.'
    },
    {
      type: 'heading',
      content: 'Installing the pg Package'
    },
    {
      type: 'example',
      title: 'Setup',
      content: 'Installing pg and setting up the project:',
      code: `# Install node-postgres
npm install pg

# TypeScript types (if using TypeScript)
npm install --save-dev @types/pg

# Project structure
src/
  db/
    pool.js       # connection pool
    queries.js    # SQL query functions
  routes/
    users.js      # Express routes
  index.js        # app entry point`,
      language: 'bash',
      output: 'added 1 package in 1.2s'
    },
    {
      type: 'heading',
      content: 'Pool vs Client'
    },
    {
      type: 'text',
      content: 'The pg package provides two ways to connect: a single Client or a Pool. Use a Pool in production applications.'
    },
    {
      type: 'table',
      title: 'Pool vs Client',
      headers: ['Aspect', 'Pool', 'Client'],
      rows: [
        ['Connections', 'Manages multiple connections', 'Single connection'],
        ['Reuse', 'Reuses idle connections', 'One query at a time'],
        ['Production', 'Recommended', 'Avoid for web apps'],
        ['Use Case', 'Web servers, APIs', 'Migrations, scripts, transactions']
      ]
    },
    {
      type: 'example',
      title: 'Creating a Connection Pool',
      content: 'Set up a shared pool used throughout your application:',
      code: `// db/pool.js
const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.PGHOST     || 'localhost',
  port:     parseInt(process.env.PGPORT || '5432'),
  database: process.env.PGDATABASE || 'myapp',
  user:     process.env.PGUSER     || 'postgres',
  password: process.env.PGPASSWORD,
  max:      20,         // max connections in pool
  idleTimeoutMillis:    30000,
  connectionTimeoutMillis: 2000
});

// Test the connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }
  console.log('Connected to PostgreSQL');
  release();
});

module.exports = pool;`,
      language: 'javascript',
      output: 'Connected to PostgreSQL'
    },
    {
      type: 'heading',
      content: 'Parameterized Queries'
    },
    {
      type: 'text',
      content: 'Always use parameterized queries ($1, $2, ...) instead of string concatenation. This is the primary defence against SQL injection attacks.'
    },
    {
      type: 'example',
      title: 'Safe vs Unsafe Queries',
      content: 'The right and wrong way to include user input in queries:',
      code: `// DANGEROUS -- SQL injection possible
const email = req.body.email; // could be: ' OR 1=1 --
const result = await pool.query(
  "SELECT * FROM users WHERE email = '" + email + "'"
);

// SAFE -- parameterized query
const result = await pool.query(
  'SELECT * FROM users WHERE email = $1',
  [req.body.email]
);

// Multiple parameters
const { name, email, age } = req.body;
const newUser = await pool.query(
  \`INSERT INTO users (name, email, age)
   VALUES ($1, $2, $3)
   RETURNING *\`,
  [name, email, age]
);`,
      language: 'javascript',
      output: '{ rows: [{ id: 1, name: "Alice", email: "alice@example.com" }], rowCount: 1 }'
    },
    {
      type: 'warning',
      title: 'Never Interpolate User Input into SQL',
      content: 'String concatenation with user input is the most common SQL injection vulnerability. Always pass user data as parameters ($1, $2, ...), never as part of the SQL string itself.'
    },
    {
      type: 'heading',
      content: 'Async/Await with pg'
    },
    {
      type: 'example',
      title: 'Full CRUD with async/await',
      content: 'Database query functions using modern async/await:',
      code: `// db/queries.js
const pool = require('./pool');

// READ all users
async function getAllUsers() {
  const { rows } = await pool.query(
    'SELECT id, name, email FROM users ORDER BY id'
  );
  return rows;
}

// READ one user
async function getUserById(id) {
  const { rows } = await pool.query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );
  return rows[0] || null; // return undefined if not found
}

// CREATE
async function createUser(name, email) {
  const { rows } = await pool.query(
    'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
    [name, email]
  );
  return rows[0];
}

// UPDATE
async function updateUser(id, updates) {
  const { rows } = await pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
    [updates.name, updates.email, id]
  );
  return rows[0] || null;
}

// DELETE
async function deleteUser(id) {
  const { rowCount } = await pool.query(
    'DELETE FROM users WHERE id = $1',
    [id]
  );
  return rowCount > 0;
}

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };`,
      language: 'javascript',
      output: '// getAllUsers() => [{id:1, name:"Alice", email:"..."}, ...]'
    },
    {
      type: 'heading',
      content: 'Error Handling'
    },
    {
      type: 'example',
      title: 'Handling PostgreSQL Errors',
      content: 'Properly catching and handling database errors:',
      code: `// PostgreSQL error codes
const PG_UNIQUE_VIOLATION   = '23505';
const PG_FOREIGN_KEY_VIOLATION = '23503';
const PG_NOT_NULL_VIOLATION = '23502';

async function createUser(name, email) {
  try {
    const { rows } = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    return { success: true, user: rows[0] };
  } catch (err) {
    if (err.code === PG_UNIQUE_VIOLATION) {
      return { success: false, error: 'Email already exists' };
    }
    if (err.code === PG_NOT_NULL_VIOLATION) {
      return { success: false, error: 'Missing required field' };
    }
    // Unknown error -- re-throw or log
    console.error('Database error:', err);
    throw err;
  }
}`,
      language: 'javascript',
      output: '{ success: false, error: "Email already exists" }'
    },
    {
      type: 'heading',
      content: 'Transactions in Node.js'
    },
    {
      type: 'example',
      title: 'Transaction with Client from Pool',
      content: 'Using a dedicated client for transactions (never pool.query for transactions):',
      code: `async function transferFunds(fromId, toId, amount) {
  const client = await pool.connect(); // get a dedicated client
  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      'SELECT balance FROM accounts WHERE id = $1 FOR UPDATE',
      [fromId]
    );

    if (rows[0].balance < amount) {
      throw new Error('Insufficient funds');
    }

    await client.query(
      'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
      [amount, fromId]
    );
    await client.query(
      'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
      [amount, toId]
    );

    await client.query('COMMIT');
    return { success: true };
  } catch (err) {
    await client.query('ROLLBACK');
    return { success: false, error: err.message };
  } finally {
    client.release(); // ALWAYS release back to pool
  }
}`,
      language: 'javascript',
      output: '{ success: true }'
    },
    {
      type: 'note',
      title: 'Always Release the Client',
      content: 'When using pool.connect(), always call client.release() in a finally block. If you forget, that connection is permanently removed from the pool and will eventually exhaust all available connections.'
    },
    {
      type: 'heading',
      content: 'Express REST API Example'
    },
    {
      type: 'example',
      title: 'Simple CRUD API Routes',
      content: 'Putting it all together in an Express router:',
      code: `// routes/users.js
const express = require('express');
const router  = express.Router();
const db      = require('../db/queries');

// GET /api/users
router.get('/', async (req, res) => {
  try {
    const users = await db.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/users/:id
router.get('/:id', async (req, res) => {
  const user = await db.getUserById(parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});

// POST /api/users
router.post('/', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'name and email required' });
  }
  const result = await db.createUser(name, email);
  if (!result.success) return res.status(409).json(result);
  res.status(201).json(result.user);
});

// PUT /api/users/:id
router.put('/:id', async (req, res) => {
  const user = await db.updateUser(parseInt(req.params.id), req.body);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});

// DELETE /api/users/:id
router.delete('/:id', async (req, res) => {
  const deleted = await db.deleteUser(parseInt(req.params.id));
  if (!deleted) return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
});

module.exports = router;`,
      language: 'javascript',
      output: '// GET /api/users => [{"id":1,"name":"Alice",...}, ...]'
    },
    {
      type: 'tip',
      title: 'Environment Variables for Secrets',
      content: 'Use a .env file with dotenv for local development, but never commit it. In production, set environment variables through your hosting platform (Heroku, Railway, Render, etc.). The pg package reads PGHOST, PGPORT, PGDATABASE, PGUSER, and PGPASSWORD automatically.'
    },
    {
      type: 'tryit',
      title: 'pg Client Simulator',
      js: `const output = document.getElementById('output');

const mockDB = {
  users: [
    { id: 1, name: 'Alice Smith',  email: 'alice@example.com', created_at: '2024-01-15T10:30:00Z' },
    { id: 2, name: 'Bob Jones',    email: 'bob@example.com',   created_at: '2024-02-20T14:15:00Z' },
    { id: 3, name: 'Carol Wang',   email: 'carol@example.com', created_at: '2024-03-05T09:00:00Z' }
  ],
  nextId: 4
};

let termLines = [];

function addLine(text, type) {
  termLines.unshift({ text, type });
  if (termLines.length > 20) termLines.pop();
}

function fmtResult(rows, rowCount) {
  if (rows.length === 0) return \`-- \${rowCount} row(s) affected --\`;
  const cols = Object.keys(rows[0]);
  const colW = cols.map(c => Math.max(c.length, ...rows.map(r => String(r[c]).length)));
  const header = cols.map((c,i) => c.padEnd(colW[i])).join(' | ');
  const sep    = colW.map(w => '-'.repeat(w)).join('-+-');
  const body   = rows.map(r => cols.map((c,i) => String(r[c]).padEnd(colW[i])).join(' | ')).join('\\n');
  return header + '\\n' + sep + '\\n' + body + \`\\n(\${rows.length} row\${rows.length===1?'':'s'})\`;
}

function execQuery(q) {
  q = q.trim();
  addLine('> ' + q, 'cmd');
  try {
    if (q.match(/^SELECT \\* FROM users$/i)) {
      addLine(fmtResult(mockDB.users, mockDB.users.length), 'result');
    } else if (q.match(/^SELECT \\* FROM users WHERE id = (\\d+)$/i)) {
      const id = parseInt(q.match(/(\\d+)/)[1]);
      const rows = mockDB.users.filter(u => u.id === id);
      addLine(fmtResult(rows, rows.length), rows.length?'result':'warn');
    } else if (q.match(/^INSERT INTO users/i)) {
      const m = q.match(/VALUES \\('([^']+)',\\s*'([^']+)'\\)/i);
      if (!m) { addLine('ERROR: syntax error in VALUES clause', 'error'); return; }
      const [, name, email] = m;
      if (mockDB.users.find(u => u.email === email)) {
        addLine('ERROR: 23505 duplicate key violates unique constraint "users_email_key"', 'error');
        return;
      }
      const u = { id: mockDB.nextId++, name, email, created_at: new Date().toISOString() };
      mockDB.users.push(u);
      addLine('INSERT 0 1', 'success');
      addLine(fmtResult([u], 1), 'result');
    } else if (q.match(/^DELETE FROM users WHERE id = (\\d+)$/i)) {
      const id = parseInt(q.match(/(\\d+)/)[1]);
      const before = mockDB.users.length;
      mockDB.users = mockDB.users.filter(u => u.id !== id);
      const deleted = before - mockDB.users.length;
      addLine(deleted ? \`DELETE \${deleted}\` : 'DELETE 0 (no matching row)', deleted?'success':'warn');
    } else if (q.match(/^SELECT COUNT\\(\\*\\) FROM users$/i)) {
      addLine(fmtResult([{ count: mockDB.users.length }], 1), 'result');
    } else {
      addLine('ERROR: unrecognized query (try: SELECT * FROM users, SELECT * FROM users WHERE id = 1, INSERT INTO users VALUES (\'name\',\'email\'), DELETE FROM users WHERE id = 1, SELECT COUNT(*) FROM users)', 'error');
    }
  } catch(e) {
    addLine('ERROR: ' + e.message, 'error');
  }
}

const hints = [
  "SELECT * FROM users",
  "SELECT * FROM users WHERE id = 1",
  "INSERT INTO users VALUES ('Dave','dave@ex.com')",
  "DELETE FROM users WHERE id = 2",
  "SELECT COUNT(*) FROM users"
];
let hintIdx = 0;

function render() {
  const typeColors = { cmd:'#79c0ff', result:'#e6edf3', success:'#7ee787', warn:'#f0883e', error:'#f85149' };
  let termHtml = termLines.map(l =>
    \`<div style="color:\${typeColors[l.type]||'#e6edf3'};white-space:pre;margin-bottom:2px">\${l.text}</div>\`
  ).join('');

  output.innerHTML = \`
    <div style="padding:16px;font-family:system-ui,sans-serif">
      <h3 style="color:#336791;margin:0 0 4px">pg Query Simulator</h3>
      <p style="color:#64748b;font-size:12px;margin:0 0 12px">Simulated node-postgres terminal</p>
      <div style="background:#0d1117;border-radius:8px;overflow:hidden;margin-bottom:12px">
        <div style="display:flex;align-items:center;gap:6px;padding:8px 12px;background:#161b22;border-bottom:1px solid #30363d">
          <div style="width:10px;height:10px;border-radius:50%;background:#ff5f57"></div>
          <div style="width:10px;height:10px;border-radius:50%;background:#ffbd2e"></div>
          <div style="width:10px;height:10px;border-radius:50%;background:#28c840"></div>
          <span style="color:#8b949e;font-size:11px;margin-left:8px;font-family:monospace">node-postgres simulator</span>
        </div>
        <div id="term-output" style="padding:12px 14px;font-family:monospace;font-size:12px;min-height:120px;max-height:200px;overflow-y:auto">
          \${termHtml || '<div style="color:#484f58">-- Run a query below to see results --</div>'}
        </div>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:10px">
        <input id="query-input" type="text" placeholder="Type a SQL query..." value="\${hints[hintIdx % hints.length]}"
          style="flex:1;padding:8px 12px;border:1px solid #cbd5e1;border-radius:6px;font-family:monospace;font-size:12px"
          onkeydown="if(event.key==='Enter')runQuery()" />
        <button onclick="runQuery()" style="background:#336791;color:white;border:none;padding:8px 14px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600">Run</button>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        \${hints.map((h,i) => \`<button onclick="setHint(\${i})" style="background:#e2e8f0;color:#475569;border:none;padding:4px 10px;border-radius:4px;cursor:pointer;font-size:11px;font-family:monospace">\${h.length > 30 ? h.substring(0,30)+'...' : h}</button>\`).join('')}
      </div>
    </div>
  \`;
}

window.runQuery = function() {
  const input = document.getElementById('query-input');
  if (input && input.value.trim()) { execQuery(input.value); render(); }
};
window.setHint = function(i) {
  hintIdx = i;
  render();
  const input = document.getElementById('query-input');
  if (input) input.value = hints[i];
};

render();`,
      css: ''
    }
  ],
  exercises: [
    {
      id: 'ex-10-1',
      question: 'Why should you use pool.connect() instead of pool.query() for transactions?',
      type: 'multiple-choice',
      options: [
        'pool.query() does not support BEGIN/COMMIT',
        'Transactions require a consistent connection; pool.query() may use different connections for each query, breaking the transaction context',
        'pool.connect() is faster than pool.query()',
        'pool.query() automatically rolls back transactions on error'
      ],
      correct: 1,
      explanation: 'pool.query() acquires a connection, runs the query, and releases it back to the pool. If you run BEGIN with pool.query() and then your UPDATE with a different pool.query() call, the UPDATE may run on a different connection and is not part of the same transaction. Transactions need a single dedicated connection throughout.'
    },
    {
      id: 'ex-10-2',
      question: 'What is the correct way to use a parameter in a pg query?',
      type: 'multiple-choice',
      options: [
        'pool.query(`SELECT * FROM users WHERE id = ${userId}`)',
        'pool.query("SELECT * FROM users WHERE id = ?", [userId])',
        'pool.query("SELECT * FROM users WHERE id = $1", [userId])',
        'pool.query("SELECT * FROM users WHERE id = :id", { id: userId })'
      ],
      correct: 2,
      explanation: 'The pg package uses $1, $2, ... as placeholders (not ? like MySQL or :name like some ORMs). The values array is passed as the second argument. This prevents SQL injection by separating the query structure from the data.'
    },
    {
      id: 'ex-10-3',
      question: 'What must you always do with a client obtained via pool.connect()?',
      type: 'multiple-choice',
      options: [
        'Call client.commit() to save changes',
        'Call client.close() to terminate the connection',
        'Call client.release() in a finally block to return it to the pool',
        'Call client.destroy() to free memory'
      ],
      correct: 2,
      explanation: 'After using a client from pool.connect(), you must call client.release() to return it to the pool. Not releasing a client permanently removes that connection slot from the pool. Using a finally block ensures release() is called even when an error is thrown.'
    }
  ],
  quiz: [
    {
      id: 'q-10-1',
      question: 'What does the pg Pool\'s max option control?',
      options: [
        'The maximum number of queries per second',
        'The maximum number of simultaneous connections to PostgreSQL',
        'The maximum size of query results',
        'The maximum query execution time'
      ],
      correct: 1,
      explanation: 'The max option sets the maximum number of database connections in the pool. When all connections are in use and a new query comes in, it waits until a connection becomes available. The default is 10.'
    },
    {
      id: 'q-10-2',
      question: 'Which PostgreSQL error code indicates a unique constraint violation?',
      options: ['23000', '23505', '42601', '08006'],
      correct: 1,
      explanation: '23505 is the PostgreSQL error code for unique_violation. Common codes to handle: 23503 (foreign_key_violation), 23502 (not_null_violation), 23514 (check_violation). These are in the pg error object as err.code.'
    },
    {
      id: 'q-10-3',
      question: 'What does the RETURNING clause do in an INSERT statement when used with the pg package?',
      options: [
        'It forces pg to use a different connection',
        'It returns the inserted rows in the query result, so you do not need a separate SELECT to get the new ID',
        'It automatically commits the transaction',
        'It returns the query execution time'
      ],
      correct: 1,
      explanation: 'RETURNING makes INSERT (or UPDATE/DELETE) return the affected rows. In pg, this means result.rows contains the inserted data including auto-generated IDs and server defaults. Without RETURNING, result.rows would be empty.'
    }
  ]
};
