import type { ExpressLesson } from '../express-curriculum';

export const expressDatabaseLesson: ExpressLesson = {
  id: 'express-database',
  title: 'Database Integration',
  slug: 'database',
  chapter: 'advanced',
  order: 11,
  difficulty: 'advanced',
  readingTime: 14,
  description: 'Connecting Express to databases: MongoDB with Mongoose, PostgreSQL with pg, MySQL, and best practices.',
  sections: [
    {
      type: 'text',
      content: 'Most Express apps need a database to persist data. Popular choices include MongoDB (NoSQL document database) for flexible schemas, PostgreSQL (SQL) for relational data, and MySQL. Express works with any database through appropriate npm packages.',
    },
    {
      type: 'heading',
      content: 'MongoDB with Mongoose',
    },
    {
      type: 'example',
      title: 'Installing Mongoose',
      content: 'Mongoose adds schemas, validation, and a fluent query API on top of the native MongoDB driver. Install it to get structured data modeling in your Express app.',
      language: 'bash',
      code: `npm install mongoose`,
    },
    {
      type: 'example',
      title: 'Connecting to MongoDB',
      content: 'mongoose.connect() opens a persistent connection to MongoDB. You then define a Schema to enforce field types and constraints, and create a Model to run CRUD operations against the collection.',
      language: 'javascript',
      code: `const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myapp')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define a schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, min: 18 },
  createdAt: { type: Date, default: Date.now }
});

// Create a model
const User = mongoose.model('User', userSchema);

// CRUD operations
app.get('/users', async function(req, res) {
  try {
    const users = await User.find();
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/users', async function(req, res) {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(3000);`,
    },
    {
      type: 'heading',
      content: 'PostgreSQL with pg',
    },
    {
      type: 'example',
      title: 'Installing pg',
      content: 'pg is the standard PostgreSQL client for Node.js. Install it to connect to a Postgres database and run parameterized SQL queries with connection pooling support.',
      language: 'bash',
      code: `npm install pg`,
    },
    {
      type: 'example',
      title: 'Connecting to PostgreSQL',
      content: 'Pool manages multiple database connections for you so requests do not queue up. Parameterized queries like $1 and $2 prevent SQL injection by separating data from SQL syntax.',
      language: 'javascript',
      code: `const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

// Create connection pool
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'myapp',
  user: 'postgres',
  password: 'password'
});

// Test connection
pool.query('SELECT NOW()', function(err, res) {
  if (err) {
    console.error('PostgreSQL connection error:', err);
  } else {
    console.log('PostgreSQL connected');
  }
});

// Query with parameters (prevents SQL injection)
app.get('/users/:id', async function(req, res) {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/users', async function(req, res) {
  try {
    const { name, email, age } = req.body;
    const result = await pool.query(
      'INSERT INTO users (name, email, age) VALUES ($1, $2, $3) RETURNING *',
      [name, email, age]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(3000);`,
    },
    {
      type: 'heading',
      content: 'Database Best Practices',
    },
    {
      type: 'list',
      items: [
        'Use connection pooling for better performance',
        'Always use parameterized queries to prevent SQL injection',
        'Handle database errors gracefully',
        'Use environment variables for connection strings',
        'Close connections properly on app shutdown',
        'Use transactions for operations that modify multiple records',
        'Index frequently queried fields',
        'Validate data before saving to database',
      ],
    },
    {
      type: 'example',
      title: 'Environment variables for database config',
      content: 'Hardcoding connection strings exposes credentials in version control. Store them in a .env file and load with dotenv so secrets stay out of your codebase entirely.',
      language: 'javascript',
      code: `// Install dotenv
// npm install dotenv

require('dotenv').config();

// MongoDB
mongoose.connect(process.env.MONGODB_URI);

// PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// .env file:
// MONGODB_URI=mongodb://localhost:27017/myapp
// DATABASE_URL=postgresql://user:password@localhost:5432/myapp`,
    },
    {
      type: 'warning',
      title: 'SQL injection',
      content: 'Always use parameterized queries. NEVER build SQL queries with string concatenation using user input. This prevents SQL injection attacks.',
    },
    {
      type: 'tryit',
      title: 'Database Operations Simulator',
      css: `body{font-family:system-ui,sans-serif;padding:20px;margin:0;background:#f0f0f0;}
.db-demo{max-width:900px;margin:0 auto;}
.panel{background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);margin-bottom:16px;}
.panel-header{background:#000;color:#fff;padding:14px 20px;font-size:15px;font-weight:700;display:flex;align-items:center;justify-content:space-between;}
.db-badge{background:#4ade80;color:#000;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:700;}
.panel-body{padding:20px;}
.ops{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-bottom:16px;}
.op-btn{padding:12px;background:#f8f8f8;border:2px solid #ddd;border-radius:8px;text-align:center;cursor:pointer;font-weight:700;font-size:13px;}
.op-btn:hover{background:#000;color:#fff;border-color:#000;}
.query{background:#fff3cd;border:1px solid #ffc107;padding:12px;border-radius:6px;font-family:monospace;font-size:11px;margin-bottom:12px;}
.records{background:#f8f8f8;border:1px solid #ddd;padding:14px;border-radius:6px;margin-top:12px;}
.record{background:#fff;border:1px solid #ddd;padding:10px;margin:6px 0;border-radius:6px;font-size:12px;font-family:monospace;}
.result{background:#1a1a1a;color:#4ade80;padding:14px;border-radius:6px;font-family:monospace;font-size:12px;white-space:pre-wrap;min-height:80px;}`,
      js: `var users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' }
];
var nextId = 3;

function runOp(op) {
  var query = '';
  var result = '';
  
  if (op === 'findAll') {
    query = 'db.users.find()';
    result = 'Found ' + users.length + ' users\\n';
    result += JSON.stringify(users, null, 2);
  } else if (op === 'findOne') {
    query = 'db.users.findOne({ id: 1 })';
    result = 'Found user:\\n';
    result += JSON.stringify(users[0], null, 2);
  } else if (op === 'insert') {
    query = 'db.users.insert({ name: "Charlie", email: "charlie@example.com" })';
    var newUser = { id: nextId++, name: 'Charlie', email: 'charlie@example.com' };
    users.push(newUser);
    result = 'Inserted new user:\\n';
    result += JSON.stringify(newUser, null, 2);
  } else if (op === 'update') {
    query = 'db.users.update({ id: 1 }, { $set: { name: "Alice Updated" } })';
    users[0].name = 'Alice Updated';
    result = 'Updated user:\\n';
    result += JSON.stringify(users[0], null, 2);
  } else if (op === 'delete') {
    query = 'db.users.delete({ id: 2 })';
    users = users.filter(function(u) { return u.id !== 2; });
    result = 'Deleted user with id: 2\\n';
    result += 'Remaining users: ' + users.length;
  }
  
  document.getElementById('query').textContent = 'Query: ' + query;
  document.getElementById('result').textContent = result;
  renderRecords();
}

function renderRecords() {
  var html = '<strong>Current Database State:</strong><br><br>';
  users.forEach(function(user) {
    html += '<div class="record">{ id: ' + user.id + ', name: "' + user.name + '", email: "' + user.email + '" }</div>';
  });
  document.getElementById('records').innerHTML = html;
}

document.getElementById('output').innerHTML =
  '<div class="db-demo">' +
  '<div class="panel">' +
  '<div class="panel-header"><span>Database Operations</span><div class="db-badge">MongoDB</div></div>' +
  '<div class="panel-body">' +
  '<div class="ops">' +
  '<div class="op-btn" onclick="runOp(\\'findAll\\')">Find All</div>' +
  '<div class="op-btn" onclick="runOp(\\'findOne\\')">Find One</div>' +
  '<div class="op-btn" onclick="runOp(\\'insert\\')">Insert</div>' +
  '<div class="op-btn" onclick="runOp(\\'update\\')">Update</div>' +
  '<div class="op-btn" onclick="runOp(\\'delete\\')">Delete</div>' +
  '</div>' +
  '<div class="query" id="query">Click an operation to see the query...</div>' +
  '<div class="result" id="result">Results will appear here...</div>' +
  '<div class="records" id="records"></div>' +
  '</div>' +
  '</div>' +
  '</div>';

renderRecords();`,
    },
  ],
  exercises: [
    {
      id: 'express-db-1',
      question: 'What is Mongoose?',
      type: 'multiple-choice',
      options: [
        'A SQL database',
        'An ODM (Object Document Mapper) for MongoDB',
        'A web framework',
        'A templating engine',
      ],
      correct: 1,
      explanation: 'Mongoose is an ODM (Object Document Mapper) for MongoDB. It provides a schema-based solution to model application data and includes built-in validation, query building, and business logic hooks.',
    },
    {
      id: 'express-db-2',
      question: 'Why should you use parameterized queries?',
      type: 'multiple-choice',
      options: [
        'To make queries faster',
        'To prevent SQL injection attacks',
        'To make code shorter',
        'To enable caching',
      ],
      correct: 1,
      explanation: 'Parameterized queries (using placeholders like $1, $2) prevent SQL injection attacks by separating SQL code from data. Never build queries with string concatenation of user input.',
    },
  ],
  quiz: [
    {
      id: 'express-db-q1',
      question: 'Where should database credentials be stored?',
      options: [
        'Hardcoded in the source code',
        'In environment variables or secure config',
        'In a public file',
        'In the database itself',
      ],
      correct: 1,
      explanation: 'Database credentials should be stored in environment variables or secure configuration systems, never hardcoded in source code. Use libraries like dotenv for local development and proper secrets management in production.',
    },
  ],
};
