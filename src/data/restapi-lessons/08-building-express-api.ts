import type { RestapiLesson } from '../restapi-curriculum';

export const lesson08: RestapiLesson = {
  id: 'restapi-08',
  title: 'Building a REST API with Express',
  slug: '08-building-express-api',
  chapter: 'building',
  order: 8,
  difficulty: 'intermediate',
  readingTime: 15,
  description: 'Build a complete CRUD REST API from scratch using Node.js and Express — from setup to all 5 routes with proper error handling.',
  sections: [
    {
      type: 'text',
      content: 'Express is the most widely used Node.js framework for building REST APIs. It adds routing, middleware, and request/response helpers on top of Node\'s built-in HTTP module with minimal overhead. This lesson walks through building a complete, production-ready CRUD API for a users resource from scratch.'
    },
    {
      type: 'heading',
      content: 'Project Setup'
    },
    {
      type: 'text',
      content: 'Start with npm init and install Express. You only need one dependency for the basic API. The --save-exact flag pins the exact version so the project is reproducible across machines.'
    },
    {
      type: 'example',
      title: 'Complete Express server setup with all CRUD routes',
      content: 'This is a complete, runnable Express API for a users resource. It uses an in-memory array as the data store (replace with a database in production). Every REST convention is followed: plural resource name, correct HTTP methods, proper status codes, and JSON responses throughout.',
      code: `// server.js — complete users CRUD API
const express = require('express');
const app = express();

// Parse incoming JSON request bodies
app.use(express.json());

// In-memory store (replace with a database in production)
let users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
  { id: 2, name: 'Bob Smith',     email: 'bob@example.com',   role: 'user' },
  { id: 3, name: 'Carol White',   email: 'carol@example.com', role: 'user' }
];
let nextId = 4;

// GET /users — list all users
app.get('/users', (req, res) => {
  res.json({ data: users, meta: { total: users.length } });
});

// GET /users/:id — get one user
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'NOT_FOUND', message: 'User not found' });
  res.json({ data: user });
});

// POST /users — create a user
app.post('/users', (req, res) => {
  const { name, email, role = 'user' } = req.body;
  if (!name || !email) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'name and email are required'
    });
  }
  const user = { id: nextId++, name, email, role };
  users.push(user);
  res.status(201).json({ data: user });
});

// PUT /users/:id — replace a user
app.put('/users/:id', (req, res) => {
  const idx = users.findIndex(u => u.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'NOT_FOUND', message: 'User not found' });
  const { name, email, role = 'user' } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'name and email are required' });
  }
  users[idx] = { id: users[idx].id, name, email, role };
  res.json({ data: users[idx] });
});

// DELETE /users/:id — remove a user
app.delete('/users/:id', (req, res) => {
  const idx = users.findIndex(u => u.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'NOT_FOUND', message: 'User not found' });
  users.splice(idx, 1);
  res.status(204).send();
});

app.listen(3000, () => console.log('API running on http://localhost:3000'));`,
      language: 'javascript',
      output: `API running on http://localhost:3000
GET  /users    -> 200 { data: [...], meta: { total: 3 } }
GET  /users/1  -> 200 { data: { id: 1, name: 'Alice Johnson', ... } }
GET  /users/99 -> 404 { error: 'NOT_FOUND', message: 'User not found' }
POST /users    -> 201 { data: { id: 4, name: '...', ... } }
DELETE /users/1-> 204 (no body)`
    },
    {
      type: 'heading',
      content: 'express.json() Middleware'
    },
    {
      type: 'text',
      content: 'app.use(express.json()) is a critical line. Without it, req.body is undefined when a client sends a JSON body. This built-in middleware reads the request body stream, parses it as JSON, and attaches it to req.body. It only parses requests with Content-Type: application/json.'
    },
    {
      type: 'heading',
      content: 'Request Validation Pattern'
    },
    {
      type: 'example',
      title: 'Request validation pattern',
      content: 'Validating required fields before processing prevents corrupt data from entering your system. This reusable middleware pattern extracts validation into a standalone function that can be applied to any route, keeping route handlers clean and focused on business logic.',
      code: `// Reusable validation middleware factory
function requireFields(...fields) {
  return (req, res, next) => {
    const missing = fields.filter(f => !req.body[f]);
    if (missing.length > 0) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Missing required fields',
        details: missing.map(f => ({ field: f, issue: 'required' }))
      });
    }
    next();
  };
}

// Apply validation middleware to routes
app.post('/users',
  requireFields('name', 'email'),  // runs first
  (req, res) => {                  // only runs if validation passed
    const user = { id: nextId++, ...req.body };
    users.push(user);
    res.status(201).json({ data: user });
  }
);

// Email format validation
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

app.post('/users', requireFields('name', 'email'), (req, res) => {
  if (!isValidEmail(req.body.email)) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'Invalid email format'
    });
  }
  // proceed with creation...
});`,
      language: 'javascript',
      output: `POST /users {}           -> 400 { error: 'VALIDATION_ERROR', details: [{ field: 'name', issue: 'required' }, ...] }
POST /users { name, email } -> 201 { data: { id: 4, ... } }`
    },
    {
      type: 'heading',
      content: 'Error Handling Middleware'
    },
    {
      type: 'text',
      content: 'Express recognizes error-handling middleware by its 4 parameters: (err, req, res, next). When you pass an error to next(err), Express skips all regular middleware and routes and goes straight to this handler. Register it last, after all routes, so it catches errors from anywhere in the app.'
    },
    {
      type: 'example',
      title: 'Error handling middleware',
      content: 'The error handler must have exactly four parameters — err, req, res, next — for Express to recognize it as an error handler rather than a regular route. It is registered after all routes so it catches errors thrown or passed via next(err) from any route handler.',
      code: `// Must have exactly 4 parameters — this is how Express identifies error middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // log for debugging, do not send to client

  // Operational errors we threw intentionally
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: err.code || 'ERROR',
      message: err.message
    });
  }

  // JSON parse errors (invalid request body)
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'INVALID_JSON',
      message: 'Request body is not valid JSON'
    });
  }

  // Unexpected errors — do not leak internal details
  res.status(500).json({
    error: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred'
  });
});

// Example: throwing an operational error from a route
app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await db.findById(req.params.id);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      err.code = 'NOT_FOUND';
      return next(err); // passes to error handler
    }
    res.json({ data: user });
  } catch (dbError) {
    next(dbError); // unexpected error — 500
  }
});`,
      language: 'javascript',
      output: `Operational error  -> 404 { error: 'NOT_FOUND', message: 'User not found' }
Invalid JSON body  -> 400 { error: 'INVALID_JSON', message: 'Request body is not valid JSON' }
Database crash     -> 500 { error: 'INTERNAL_ERROR', message: 'An unexpected error occurred' }`
    },
    {
      type: 'heading',
      content: 'Testing with curl'
    },
    {
      type: 'example',
      title: 'curl test commands for each endpoint',
      content: 'These curl commands test every CRUD endpoint and can be run directly in a terminal while your server is running. The -s flag silences progress output, -X sets the method, -H sets headers, and -d provides the request body.',
      code: `# GET all users
curl -s http://localhost:3000/users | python -m json.tool

# GET single user
curl -s http://localhost:3000/users/1

# GET non-existent user (expect 404)
curl -s -w "\\nHTTP Status: %{http_code}\\n" http://localhost:3000/users/999

# POST create a user
curl -s -X POST http://localhost:3000/users \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Dave Green", "email": "dave@example.com", "role": "user"}'

# POST with missing fields (expect 400)
curl -s -X POST http://localhost:3000/users \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Dave"}'

# PUT replace a user
curl -s -X PUT http://localhost:3000/users/1 \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Alice Williams", "email": "alice.w@example.com", "role": "admin"}'

# DELETE a user (expect 204 No Content)
curl -s -X DELETE http://localhost:3000/users/3 \\
  -w "\\nHTTP Status: %{http_code}\\n"`,
      language: 'bash',
      output: `GET /users      -> 200 { data: [...], meta: { total: 3 } }
GET /users/1    -> 200 { data: { id: 1, name: 'Alice Johnson', ... } }
GET /users/999  -> 404 HTTP Status: 404
POST /users     -> 201 { data: { id: 4, ... } }
DELETE /users/3 -> HTTP Status: 204`
    },
    {
      type: 'heading',
      content: 'Project Structure'
    },
    {
      type: 'list',
      title: 'Recommended Express project layout:',
      items: [
        'server.js — entry point, starts the HTTP server',
        'app.js — creates and configures the Express app (exported for testing)',
        'routes/users.js — user-specific route handlers',
        'routes/index.js — mounts all routers onto the app',
        'middleware/auth.js — authentication middleware',
        'middleware/validate.js — request validation helpers',
        'models/user.js — data access layer (database queries)'
      ]
    },
    {
      type: 'tryit',
      title: 'In-Browser REST API Simulator',
      js: `var users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
  { id: 2, name: 'Bob Smith',     email: 'bob@example.com',   role: 'user' },
  { id: 3, name: 'Carol White',   email: 'carol@example.com', role: 'user' }
];
var nextId = 4;

function escHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function respond(status, body) {
  var statusColors = { 200: '#10b981', 201: '#6366f1', 204: '#3b82f6', 400: '#f59e0b', 404: '#ef4444' };
  var color = statusColors[status] || '#94a3b8';
  var statusNames = { 200: 'OK', 201: 'Created', 204: 'No Content', 400: 'Bad Request', 404: 'Not Found' };
  var name = statusNames[status] || '';
  var bodyHtml = body ? '<pre class="res-body">' + escHtml(JSON.stringify(body, null, 2)) + '</pre>' : '<span class="no-body">No response body</span>';
  document.getElementById('response-panel').innerHTML =
    '<div class="status-row"><span class="status-badge" style="background:' + color + '">' + status + ' ' + name + '</span></div>' + bodyHtml;
}

function handleRequest() {
  var method = document.getElementById('method-select').value;
  var url = document.getElementById('url-input').value.trim();
  var bodyText = document.getElementById('body-input').value.trim();

  var idMatch = url.match(/^\/users\/(\d+)$/);
  var isCollection = url === '/users' || url === '/users/';

  if (isCollection && method === 'GET') {
    respond(200, { data: users.slice(), meta: { total: users.length } });
    renderCollection();
    return;
  }

  if (isCollection && method === 'POST') {
    var body = null;
    try { body = JSON.parse(bodyText); } catch(e) { respond(400, { error: 'INVALID_JSON', message: 'Request body is not valid JSON' }); return; }
    if (!body.name || !body.email) { respond(400, { error: 'VALIDATION_ERROR', message: 'name and email are required' }); return; }
    var user = { id: nextId++, name: body.name, email: body.email, role: body.role || 'user' };
    users.push(user);
    respond(201, { data: user });
    renderCollection();
    return;
  }

  if (idMatch) {
    var id = parseInt(idMatch[1]);
    var idx = users.findIndex(function(u) { return u.id === id; });
    if (method === 'GET') {
      if (idx === -1) { respond(404, { error: 'NOT_FOUND', message: 'User ' + id + ' not found' }); return; }
      respond(200, { data: users[idx] });
      return;
    }
    if (method === 'PUT') {
      var body2 = null;
      try { body2 = JSON.parse(bodyText); } catch(e) { respond(400, { error: 'INVALID_JSON', message: 'Invalid JSON' }); return; }
      if (idx === -1) { respond(404, { error: 'NOT_FOUND', message: 'User ' + id + ' not found' }); return; }
      if (!body2.name || !body2.email) { respond(400, { error: 'VALIDATION_ERROR', message: 'name and email are required' }); return; }
      users[idx] = { id: id, name: body2.name, email: body2.email, role: body2.role || 'user' };
      respond(200, { data: users[idx] });
      renderCollection();
      return;
    }
    if (method === 'DELETE') {
      if (idx === -1) { respond(404, { error: 'NOT_FOUND', message: 'User ' + id + ' not found' }); return; }
      users.splice(idx, 1);
      respond(204, null);
      renderCollection();
      return;
    }
  }

  respond(404, { error: 'NOT_FOUND', message: 'No route matches ' + method + ' ' + url });
}

function renderCollection() {
  var el = document.getElementById('collection-state');
  el.innerHTML = users.map(function(u) {
    return '<div class="user-row"><span class="user-id">#' + u.id + '</span><span class="user-name">' + escHtml(u.name) + '</span><span class="user-email">' + escHtml(u.email) + '</span><span class="user-role ' + u.role + '">' + u.role + '</span></div>';
  }).join('') || '<span style="color:#94a3b8;font-size:12px">Collection is empty</span>';
}

document.getElementById('send-btn').addEventListener('click', handleRequest);
renderCollection();`,
      css: `body { font-family: system-ui, sans-serif; padding: 14px; background: #f8fafc; }
h3 { color: #1e293b; margin: 0 0 10px 0; font-size: 15px; }
.sim-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.panel { background: white; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; }
.panel-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748b; background: #f8fafc; padding: 6px 12px; border-bottom: 1px solid #e2e8f0; }
.request-form { padding: 12px; }
.url-row { display: flex; gap: 6px; margin-bottom: 8px; }
#method-select { background: #6366f1; color: white; border: none; padding: 7px 10px; border-radius: 6px; font-weight: 700; font-size: 12px; cursor: pointer; }
#url-input { flex: 1; padding: 7px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-family: monospace; font-size: 12px; }
.body-label { font-size: 11px; font-weight: 600; color: #64748b; margin-bottom: 4px; display: block; }
#body-input { width: 100%; box-sizing: border-box; height: 80px; padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px; font-family: monospace; font-size: 11px; resize: vertical; }
#send-btn { margin-top: 8px; background: #10b981; color: white; border: none; padding: 8px 18px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 13px; width: 100%; }
#send-btn:hover { background: #059669; }
#response-panel { padding: 12px; min-height: 100px; }
.status-row { margin-bottom: 8px; }
.status-badge { color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 700; }
.res-body { margin: 0; font-size: 11px; font-family: monospace; color: #334155; white-space: pre-wrap; }
.no-body { color: #94a3b8; font-size: 12px; font-style: italic; }
.collection-section { margin-top: 12px; }
.collection-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748b; margin-bottom: 6px; }
#collection-state { background: white; border-radius: 8px; border: 1px solid #e2e8f0; padding: 8px 12px; }
.user-row { display: flex; align-items: center; gap: 10px; padding: 5px 0; border-bottom: 1px solid #f1f5f9; font-size: 12px; }
.user-row:last-child { border-bottom: none; }
.user-id { color: #94a3b8; font-family: monospace; width: 28px; flex-shrink: 0; }
.user-name { font-weight: 600; color: #1e293b; flex: 1; }
.user-email { color: #64748b; flex: 1; }
.user-role { padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
.user-role.admin { background: #fef3c7; color: #92400e; }
.user-role.user { background: #dbeafe; color: #1e40af; }
.hint { font-size: 11px; color: #94a3b8; margin-top: 6px; }`
    }
  ],
  exercises: [
    {
      id: 'ex-08-1',
      question: 'Why must error-handling middleware in Express have exactly 4 parameters (err, req, res, next)?',
      type: 'multiple-choice',
      options: [
        'It is a Node.js requirement for asynchronous callbacks',
        'Express identifies error handlers by the 4-parameter signature — without the err first parameter it is treated as a regular middleware',
        '4 parameters ensure the middleware runs synchronously',
        'The extra parameter allows the middleware to access the route definition'
      ],
      correct: 1,
      explanation: 'Express uses the function\'s parameter count (its arity) to differentiate error-handling middleware from regular middleware. If you write (req, res, next) it is regular middleware. If you write (err, req, res, next) it becomes an error handler. This is a core Express convention — if you write it with 3 params and put it at the end, Express will never call it for errors.'
    },
    {
      id: 'ex-08-2',
      question: 'You add a POST /users route but req.body is always undefined. What is the most likely cause?',
      type: 'multiple-choice',
      options: [
        'The route uses the wrong HTTP method',
        'express.json() middleware was not added with app.use(express.json())',
        'POST requests do not support request bodies',
        'The Content-Type header in the request must be set to text/plain'
      ],
      correct: 1,
      explanation: 'Without app.use(express.json()), Express does not parse the request body at all, so req.body is undefined. You must add this middleware before your routes. It reads the raw body stream, parses the JSON, and attaches the result to req.body — but only for requests with Content-Type: application/json.'
    },
    {
      id: 'ex-08-3',
      question: 'What is the correct HTTP status code and response body for a successful DELETE /users/5 request?',
      type: 'multiple-choice',
      options: [
        '200 OK with the deleted user object in the body',
        '201 Created with the new resource location',
        '204 No Content with no response body',
        '202 Accepted indicating the deletion is queued'
      ],
      correct: 2,
      explanation: '204 No Content is the standard for successful DELETE responses. The resource has been removed — there is nothing meaningful to return. The 204 status confirms success. Some APIs return 200 with the deleted resource for convenience, but 204 is the more widely used convention.'
    }
  ],
  quiz: [
    {
      id: 'q-08-1',
      question: 'In an Express route, you call next(err) where err is an Error object. What happens next?',
      options: [
        'Express sends a default 500 response immediately',
        'Express skips remaining regular middleware and routes and passes control to the next error-handling middleware (4-parameter function)',
        'The error is silently swallowed and the route continues',
        'Express logs the error and terminates the Node process'
      ],
      correct: 1,
      explanation: 'Calling next(err) with any truthy value signals Express that an error occurred. Express then skips all remaining regular route handlers and middleware and jumps to the next function registered with a 4-parameter signature (err, req, res, next). This is the standard error propagation pattern in Express.'
    },
    {
      id: 'q-08-2',
      question: 'Your GET /users/:id route should return 404 when the user does not exist. What is the simplest Express way to do this?',
      options: [
        'Throw a JavaScript Error and let it crash',
        'Return early with res.status(404).json({ error: \'NOT_FOUND\', message: \'User not found\' })',
        'Call res.redirect(\'/users\')',
        'Use res.sendStatus(404) without a body'
      ],
      correct: 1,
      explanation: 'res.status(404).json({...}) sets the HTTP status code to 404 and sends a JSON body in one chain. The return before it ensures the route handler stops executing after sending the response, preventing "headers already sent" errors. This is the standard Express pattern for error responses in route handlers.'
    },
    {
      id: 'q-08-3',
      question: 'Why is app.js typically separated from server.js in a well-structured Express project?',
      options: [
        'Node.js requires the entry point to be named server.js',
        'Separating app configuration from server startup allows the app to be imported in tests without starting an HTTP server',
        'express.json() can only be used in app.js',
        'Routes cannot be defined in the same file as app.listen()'
      ],
      correct: 1,
      explanation: 'Separating the app configuration (routes, middleware, export) in app.js from the server startup (app.listen) in server.js means your test suite can import app.js directly without binding to a port. Testing frameworks like supertest can call your routes in-process without starting a real server, making tests faster and avoiding port conflicts.'
    }
  ]
};
