import type { NodejsLesson } from '../nodejs-curriculum';

export const nodejsExpressBasicsLesson: NodejsLesson = {
  id: 'nodejs-express-basics',
  title: 'Express Basics',
  slug: 'express-basics',
  chapter: 'server',
  order: 7,
  difficulty: 'intermediate',
  readingTime: 12,
  description: 'Express.js framework essentials: app.get, app.post, app.listen, sending responses, and basic routing.',
  sections: [
    {
      type: 'text',
      content: 'Express is the most popular Node.js web framework. It simplifies the raw http module by providing clean APIs for routing, middleware, request parsing, and response handling. Express is minimal and unopinionated - you build your app structure your way.',
    },
    {
      type: 'analogy',
      title: 'Express as a restaurant manager',
      content: 'The raw http module is like running a restaurant kitchen yourself - you handle every detail manually. Express is like hiring a manager who handles routing customers to tables, taking orders, coordinating with the kitchen, and serving dishes. You still cook the food (your business logic), but everything else is streamlined.',
    },
    {
      type: 'heading',
      content: 'Installing and Setting Up Express',
    },
    {
      type: 'example',
      title: 'Setting up your first Express app',
      content: 'Shows the initial setup steps: creating a project with npm init, installing Express, and creating the main server file.',
      language: 'bash',
      code: `# Create a new project
npm init -y

# Install Express
npm install express

# Create your server file
# server.js`,
    },
    {
      type: 'example',
      title: 'Minimal Express server',
      content: 'Express has a simple API: create an app with express(), define routes with app.get/post/etc, and start listening with app.listen(). Every route handler receives req and res objects.',
      language: 'javascript',
      code: `const express = require('express');
const app = express();

// Define a route: method + path + handler
app.get('/', function(req, res) {
  res.send('Hello from Express!');
});

app.get('/about', function(req, res) {
  res.send('<h1>About Page</h1><p>Express makes Node.js web development easy.</p>');
});

// Start the server
app.listen(3000, function() {
  console.log('Express server running on http://localhost:3000');
});`,
      output: 'Express server running on http://localhost:3000',
    },
    {
      type: 'heading',
      content: 'Response Methods',
    },
    {
      type: 'example',
      title: 'res methods - sending different types of responses',
      content: 'Express provides convenient methods on res to send various response types. res.send() auto-detects content type, res.json() always sends JSON, res.status() sets status code.',
      language: 'javascript',
      code: `const express = require('express');
const app = express();

// Send plain text or HTML
app.get('/text', function(req, res) {
  res.send('Plain text response');
});

app.get('/html', function(req, res) {
  res.send('<h1>HTML response</h1>');
});

// Send JSON (most common for APIs)
app.get('/api/user', function(req, res) {
  res.json({ id: 1, name: 'Alice', email: 'alice@example.com' });
});

// Set status code
app.get('/created', function(req, res) {
  res.status(201).json({ message: 'Resource created' });
});

app.get('/error', function(req, res) {
  res.status(404).json({ error: 'Not found' });
});

// Chaining is common
app.post('/api/posts', function(req, res) {
  res.status(201).json({ id: 123, title: 'New Post', created: true });
});

// Redirect to another URL
app.get('/old-page', function(req, res) {
  res.redirect('/new-page');
});

// Send a file
app.get('/download', function(req, res) {
  res.sendFile(__dirname + '/files/document.pdf');
});

app.listen(3000);`,
    },
    {
      type: 'heading',
      content: 'Handling POST Requests',
    },
    {
      type: 'example',
      title: 'POST routes with body parsing',
      content: 'To read JSON bodies in POST/PUT requests, you need express.json() middleware. This parses incoming JSON and makes it available in req.body.',
      language: 'javascript',
      code: `const express = require('express');
const app = express();

// REQUIRED: Parse JSON bodies
app.use(express.json());

// POST route - create a user
app.post('/api/users', function(req, res) {
  // req.body contains the parsed JSON
  const { name, email } = req.body;

  // Validate
  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required' });
  }

  // Simulate saving to database
  const newUser = {
    id: Date.now(),
    name: name,
    email: email,
    createdAt: new Date().toISOString()
  };

  res.status(201).json(newUser);
});

// PUT route - update a user
app.put('/api/users/:id', function(req, res) {
  const userId = req.params.id;
  const updates = req.body;

  res.json({
    message: 'User updated',
    id: userId,
    updates: updates
  });
});

// DELETE route
app.delete('/api/users/:id', function(req, res) {
  const userId = req.params.id;
  res.status(204).send(); // 204 = no content
});

app.listen(3000);`,
    },
    {
      type: 'table',
      title: 'Express response methods',
      headers: ['Method', 'Purpose', 'Example'],
      rows: [
        ['res.send()', 'Send text/HTML/buffer', 'res.send("Hello")'],
        ['res.json()', 'Send JSON', 'res.json({ ok: true })'],
        ['res.status()', 'Set status code', 'res.status(404)'],
        ['res.sendFile()', 'Send a file', 'res.sendFile(path)'],
        ['res.redirect()', 'Redirect to URL', 'res.redirect("/login")'],
        ['res.render()', 'Render template', 'res.render("index", data)'],
        ['res.set()', 'Set header', 'res.set("X-Token", "abc")'],
      ],
    },
    {
      type: 'note',
      title: 'Always call a response method',
      content: 'Every route handler must call a response method (res.send, res.json, res.redirect, etc.) or the client will hang waiting for a response. If you forget to respond, the request will timeout.',
    },
    {
      type: 'tip',
      title: 'Use nodemon for development',
      content: 'Install nodemon (npm install --save-dev nodemon) and use it to auto-restart your server when files change: "dev": "nodemon server.js". This saves you from manually stopping and restarting every time you edit code.',
    },
    {
      type: 'tryit',
      title: 'Express Server Simulator',
      css: `body{font-family:system-ui,sans-serif;padding:14px;margin:0;background:#f0f2f5;}
.server-header{background:#000;color:#fff;border-radius:10px 10px 0 0;padding:12px 16px;font-size:14px;font-weight:700;display:flex;align-items:center;gap:8px;}
.server-status{width:8px;height:8px;border-radius:50%;background:#4ade80;animation:pulse 2s infinite;}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
.server-body{background:#fff;border:1px solid #e5e7eb;border-radius:0 0 10px 10px;padding:14px;}
.route-list{margin-bottom:12px;}
.route{background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:8px 12px;margin-bottom:6px;display:flex;align-items:center;gap:10px;font-size:13px;}
.method{padding:3px 10px;border-radius:4px;font-size:11px;font-weight:700;color:#fff;min-width:50px;text-align:center;}
.method.get{background:#3b82f6;}
.method.post{background:#16a34a;}
.method.delete{background:#dc2626;}
.route-path{font-family:monospace;color:#111;flex:1;}
.btn-try{background:#111;color:#fff;border:none;border-radius:5px;padding:5px 12px;font-size:12px;cursor:pointer;font-weight:600;}
.btn-try:hover{background:#333;}
.response-box{background:#0f172a;border-radius:8px;padding:12px;margin-top:10px;min-height:60px;font-family:monospace;font-size:12px;color:#4ade80;}
.req-sent{color:#60a5fa;margin-bottom:6px;}
.res-line{color:#4ade80;}`,
      js: `var routes = [
  { method: 'GET', path: '/', response: '{"message":"Hello from Express!"}', status: 200 },
  { method: 'GET', path: '/api/users', response: '[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}]', status: 200 },
  { method: 'POST', path: '/api/users', response: '{"id":3,"name":"Charlie","created":true}', status: 201 },
  { method: 'GET', path: '/about', response: '<h1>About Page</h1>', status: 200 },
  { method: 'DELETE', path: '/api/users/1', response: '(no content)', status: 204 },
  { method: 'GET', path: '/not-found', response: '{"error":"Route not found"}', status: 404 }
];

var log = [];

function sendRequest(idx) {
  var route = routes[idx];
  var timestamp = new Date().toLocaleTimeString();
  log.unshift({
    req: route.method + ' ' + route.path,
    status: route.status,
    body: route.response,
    time: timestamp
  });
  if (log.length > 3) log.pop();
  render();
}

function render() {
  var routeRows = routes.map(function(r, i) {
    var cls = r.method === 'GET' ? 'method get' : r.method === 'POST' ? 'method post' : 'method delete';
    return '<div class="route">' +
      '<span class="' + cls + '">' + r.method + '</span>' +
      '<span class="route-path">' + r.path + '</span>' +
      '<button class="btn-try" data-idx="' + i + '">Try</button>' +
      '</div>';
  }).join('');

  var logHtml = log.map(function(l) {
    var statusColor = l.status < 300 ? '#4ade80' : '#f87171';
    return '<div class="req-sent">' + l.time + ' - ' + l.req + '</div>' +
      '<div class="res-line" style="color:' + statusColor + '">HTTP/' + l.status + ' ' + l.body + '</div>' +
      '<div style="height:8px"></div>';
  }).join('') || '<span style="color:#64748b">Click "Try" on any route to see the response...</span>';

  document.getElementById('output').innerHTML =
    '<div>' +
    '<div class="server-header"><span class="server-status"></span>Express Server - localhost:3000</div>' +
    '<div class="server-body">' +
    '<div class="route-list">' + routeRows + '</div>' +
    '<div class="response-box">' + logHtml + '</div>' +
    '</div></div>';

  document.querySelectorAll('[data-idx]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      sendRequest(parseInt(btn.getAttribute('data-idx')));
    });
  });
}

render();`,
    },
  ],
  exercises: [
    {
      id: 'nodejs-express-1',
      question: 'What middleware is required to parse JSON request bodies in Express?',
      type: 'multiple-choice',
      options: [
        'body-parser (must install separately)',
        'express.json() - built into Express',
        'JSON parsing happens automatically, no middleware needed',
        'express.bodyParser()',
      ],
      correct: 1,
      explanation: 'express.json() is built into Express 4.16+ and must be added with app.use(express.json()) before any routes that need to read req.body. Older versions required the separate body-parser package.',
    },
    {
      id: 'nodejs-express-2',
      question: 'What is the difference between res.send() and res.json() in Express?',
      type: 'multiple-choice',
      options: [
        'There is no difference - they are aliases',
        'res.send() can send various types; res.json() always sends JSON with correct Content-Type',
        'res.json() is faster than res.send()',
        'res.send() only works for strings, res.json() only for objects',
      ],
      correct: 1,
      explanation: 'res.json() always sets Content-Type: application/json and calls JSON.stringify() on the data. res.send() auto-detects the type (string, object, buffer) and sets headers accordingly. For APIs, use res.json() to be explicit.',
    },
  ],
  quiz: [
    {
      id: 'nodejs-express-q1',
      question: 'What happens if you forget to call res.send() or res.json() in an Express route handler?',
      options: [
        'Express throws an error immediately',
        'The client request hangs and eventually times out',
        'Express automatically sends an empty 200 response',
        'The route is skipped and the next route is tried',
      ],
      correct: 1,
      explanation: 'If you do not call a response method like res.send(), res.json(), or res.redirect(), the response never completes. The client waits indefinitely until the request times out. Always ensure every route handler sends a response.',
    },
  ],
};
