import type { NodejsLesson } from '../nodejs-curriculum';

export const nodejsRestApiLesson: NodejsLesson = {
  id: 'nodejs-rest-api',
  title: 'Building REST APIs',
  slug: 'rest-api',
  chapter: 'server',
  order: 10,
  difficulty: 'intermediate',
  readingTime: 15,
  description: 'REST principles, CRUD operations, HTTP methods, status codes, and building production-ready APIs.',
  sections: [
    {
      type: 'text',
      content: 'REST (Representational State Transfer) is an architectural style for building web APIs. RESTful APIs use HTTP methods (GET, POST, PUT, DELETE) to perform CRUD operations on resources identified by URLs. A well-designed REST API is predictable, uses proper status codes, and returns JSON responses.',
    },
    {
      type: 'analogy',
      title: 'REST is like a menu at a restaurant',
      content: 'A menu lists resources (dishes) you can request. You use verbs (order, modify, cancel) to interact with them. GET is "show me the menu", POST is "place an order", PUT is "change my order", DELETE is "cancel my order". The kitchen (server) processes requests and sends back responses with status codes (ready, preparing, out of stock).',
    },
    {
      type: 'heading',
      content: 'REST Principles',
    },
    {
      type: 'list',
      items: [
        'Resources are nouns - /users, /products, /posts (not /getUser or /deleteProduct)',
        'HTTP methods are verbs - GET retrieves, POST creates, PUT updates, DELETE removes',
        'Stateless - each request contains all information needed, no session state on server',
        'Use proper status codes - 200 OK, 201 Created, 400 Bad Request, 404 Not Found, 500 Server Error',
        'JSON responses - consistent data format with error messages',
        'Nested resources - /users/123/posts for related data',
      ],
    },
    {
      type: 'heading',
      content: 'HTTP Methods and CRUD',
    },
    {
      type: 'table',
      headers: ['Method', 'CRUD', 'Example', 'Success Code'],
      rows: [
        ['GET', 'Read', 'GET /users - fetch all users', '200 OK'],
        ['GET', 'Read', 'GET /users/123 - fetch one user', '200 OK'],
        ['POST', 'Create', 'POST /users - create new user', '201 Created'],
        ['PUT', 'Update', 'PUT /users/123 - replace user', '200 OK'],
        ['PATCH', 'Update', 'PATCH /users/123 - partial update', '200 OK'],
        ['DELETE', 'Delete', 'DELETE /users/123 - remove user', '204 No Content'],
      ],
    },
    {
      type: 'example',
      title: 'Complete REST API with Express',
      content: 'This API handles users with all CRUD operations, proper status codes, and error handling.',
      language: 'javascript',
      code: `const express = require('express');
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// In-memory database (in production, use a real database)
let users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
];
let nextId = 3;

// GET /users - List all users
app.get('/users', (req, res) => {
  res.json({ success: true, data: users });
});

// GET /users/:id - Get single user
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }
  res.json({ success: true, data: user });
});

// POST /users - Create new user
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, error: 'Name and email required' });
  }
  const newUser = { id: nextId++, name, email };
  users.push(newUser);
  res.status(201).json({ success: true, data: newUser });
});

// PUT /users/:id - Update entire user
app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, error: 'Name and email required' });
  }
  users[index] = { id, name, email };
  res.json({ success: true, data: users[index] });
});

// DELETE /users/:id - Remove user
app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }
  users.splice(index, 1);
  res.status(204).send(); // 204 No Content - successful deletion
});

app.listen(3000, () => console.log('API running on http://localhost:3000'));`,
    },
    {
      type: 'heading',
      content: 'HTTP Status Codes',
    },
    {
      type: 'table',
      headers: ['Code', 'Meaning', 'When to Use'],
      rows: [
        ['200', 'OK', 'Successful GET, PUT, PATCH'],
        ['201', 'Created', 'Successful POST - resource created'],
        ['204', 'No Content', 'Successful DELETE - no body returned'],
        ['400', 'Bad Request', 'Invalid input, validation errors'],
        ['401', 'Unauthorized', 'Authentication required'],
        ['403', 'Forbidden', 'Authenticated but not allowed'],
        ['404', 'Not Found', 'Resource does not exist'],
        ['500', 'Internal Server Error', 'Server-side error'],
      ],
    },
    {
      type: 'example',
      title: 'Nested resources and filtering',
      content: 'Access related resources through nested URLs and support query parameters for filtering.',
      language: 'javascript',
      code: `// GET /users/123/posts - get all posts by user 123
app.get('/users/:userId/posts', (req, res) => {
  const userId = parseInt(req.params.userId);
  const userPosts = posts.filter(p => p.userId === userId);
  res.json({ success: true, data: userPosts });
});

// GET /posts?published=true&limit=10 - filter and paginate
app.get('/posts', (req, res) => {
  let result = posts;
  
  // Filter by published status
  if (req.query.published) {
    const isPublished = req.query.published === 'true';
    result = result.filter(p => p.published === isPublished);
  }
  
  // Pagination
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  result = result.slice(offset, offset + limit);
  
  res.json({
    success: true,
    data: result,
    pagination: { limit, offset, total: posts.length }
  });
});`,
    },
    {
      type: 'example',
      title: 'Error handling and validation',
      content: 'Centralized error handling and input validation for robust APIs.',
      language: 'javascript',
      code: `// Validation middleware
function validateUser(req, res, next) {
  const { name, email } = req.body;
  const errors = [];
  
  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  if (!email || !email.includes('@')) {
    errors.push('Valid email required');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }
  next();
}

// Use validation middleware
app.post('/users', validateUser, (req, res) => {
  const newUser = { id: nextId++, ...req.body };
  users.push(newUser);
  res.status(201).json({ success: true, data: newUser });
});

// Global error handler (place at the end)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});`,
    },
    {
      type: 'tryit',
      title: 'REST API Simulator',
      css: `body{font-family:system-ui,sans-serif;padding:16px;margin:0;background:#f8fafc;}
.container{max-width:900px;margin:0 auto;}
.header{background:linear-gradient(135deg,#339933 0%,#2d7a2d 100%);color:#fff;border-radius:10px 10px 0 0;padding:16px 20px;}
.header h2{margin:0 0 4px;font-size:18px;}
.header p{margin:0;opacity:0.9;font-size:13px;}
.controls{background:#fff;border:1px solid #e2e8f0;border-top:none;padding:16px;display:grid;grid-template-columns:100px 1fr auto;gap:10px;align-items:end;}
.method-select{padding:8px 12px;border:2px solid #339933;border-radius:6px;font-size:14px;font-weight:700;background:#fff;color:#339933;cursor:pointer;}
.endpoint-input{padding:8px 12px;border:2px solid #e2e8f0;border-radius:6px;font-size:13px;font-family:monospace;}
.send-btn{padding:8px 24px;background:#339933;color:#fff;border:none;border-radius:6px;font-weight:600;cursor:pointer;font-size:14px;}
.send-btn:hover{background:#2d7a2d;}
.body-section{background:#fff;border:1px solid #e2e8f0;border-top:none;padding:16px;}
.label{font-size:12px;font-weight:600;color:#64748b;margin-bottom:6px;}
.json-input{width:100%;padding:10px;border:2px solid #e2e8f0;border-radius:6px;font-family:monospace;font-size:12px;resize:vertical;min-height:60px;}
.response{background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 10px 10px;padding:16px;}
.status{display:inline-block;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;margin-bottom:10px;}
.status.success{background:#d1fae5;color:#065f46;}
.status.error{background:#fee2e2;color:#991b1b;}
.response-body{background:#1e293b;color:#e2e8f0;padding:14px;border-radius:6px;font-family:monospace;font-size:12px;white-space:pre-wrap;max-height:300px;overflow:auto;}
.resources{background:#fff;border:1px solid #e2e8f0;padding:12px;margin-top:16px;border-radius:8px;}
.resource-title{font-size:13px;font-weight:700;color:#334155;margin-bottom:8px;}
.resource-item{background:#f8fafc;padding:8px 12px;margin:4px 0;border-radius:4px;font-size:12px;font-family:monospace;color:#475569;}`,
      js: `var users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' }
];
var nextId = 3;

function apiCall() {
  var method = document.getElementById('method').value;
  var endpoint = document.getElementById('endpoint').value;
  var bodyText = document.getElementById('requestBody').value.trim();
  var body = null;
  
  if (bodyText) {
    try {
      body = JSON.parse(bodyText);
    } catch (e) {
      showResponse(400, { success: false, error: 'Invalid JSON in request body' });
      return;
    }
  }
  
  var match = endpoint.match(/^\\/users\\/(\\d+)$/);
  var userId = match ? parseInt(match[1]) : null;
  
  if (method === 'GET' && endpoint === '/users') {
    showResponse(200, { success: true, data: users });
  } else if (method === 'GET' && userId) {
    var user = users.find(function(u) { return u.id === userId; });
    if (user) {
      showResponse(200, { success: true, data: user });
    } else {
      showResponse(404, { success: false, error: 'User not found' });
    }
  } else if (method === 'POST' && endpoint === '/users') {
    if (!body || !body.name || !body.email) {
      showResponse(400, { success: false, error: 'Name and email required' });
    } else {
      var newUser = { id: nextId++, name: body.name, email: body.email };
      users.push(newUser);
      showResponse(201, { success: true, data: newUser });
    }
  } else if (method === 'PUT' && userId) {
    var index = users.findIndex(function(u) { return u.id === userId; });
    if (index === -1) {
      showResponse(404, { success: false, error: 'User not found' });
    } else if (!body || !body.name || !body.email) {
      showResponse(400, { success: false, error: 'Name and email required' });
    } else {
      users[index] = { id: userId, name: body.name, email: body.email };
      showResponse(200, { success: true, data: users[index] });
    }
  } else if (method === 'DELETE' && userId) {
    var index = users.findIndex(function(u) { return u.id === userId; });
    if (index === -1) {
      showResponse(404, { success: false, error: 'User not found' });
    } else {
      users.splice(index, 1);
      showResponse(204, { success: true, message: 'User deleted' });
    }
  } else {
    showResponse(404, { success: false, error: 'Endpoint not found' });
  }
  renderResources();
}

function showResponse(status, data) {
  var statusClass = status < 300 ? 'success' : 'error';
  var statusText = status + ' ' + (status === 200 ? 'OK' : status === 201 ? 'Created' : status === 204 ? 'No Content' : status === 400 ? 'Bad Request' : status === 404 ? 'Not Found' : 'Error');
  document.getElementById('response').innerHTML =
    '<div class=\\"status ' + statusClass + '\\">' + statusText + '</div>' +
    '<div class=\\"response-body\\">' + JSON.stringify(data, null, 2) + '</div>';
}

function renderResources() {
  var list = users.map(function(u) {
    return '<div class=\\"resource-item\\">{ id: ' + u.id + ', name: \\"' + u.name + '\\", email: \\"' + u.email + '\\" }</div>';
  }).join('');
  document.getElementById('resources').innerHTML =
    '<div class=\\"resource-title\\">Current Resources (' + users.length + ' users)</div>' + list;
}

document.getElementById('output').innerHTML =
  '<div class=\\"container\\">' +
  '<div class=\\"header\\"><h2>REST API Simulator</h2><p>Test CRUD operations with proper HTTP methods</p></div>' +
  '<div class=\\"controls\\">' +
  '<select id=\\"method\\" class=\\"method-select\\"><option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option></select>' +
  '<input id=\\"endpoint\\" class=\\"endpoint-input\\" placeholder=\\"/users\\" value=\\"/users\\">' +
  '<button class=\\"send-btn\\" onclick=\\"apiCall()\\">Send</button>' +
  '</div>' +
  '<div class=\\"body-section\\">' +
  '<div class=\\"label\\">Request Body (JSON for POST/PUT)</div>' +
  '<textarea id=\\"requestBody\\" class=\\"json-input\\" placeholder=\\\'{\\"name\\":\\"Charlie\\",\\"email\\":\\"charlie@example.com\\"}\\\'></textarea>' +
  '</div>' +
  '<div class=\\"response\\" id=\\"response\\"><div style=\\"color:#94a3b8;font-size:13px\\">Click Send to make a request...</div></div>' +
  '<div class=\\"resources\\" id=\\"resources\\"></div>' +
  '</div>';

renderResources();`,
    },
  ],
  exercises: [
    {
      id: 'nodejs-rest-1',
      question: 'Which HTTP method should be used to create a new resource?',
      type: 'multiple-choice',
      options: [
        'GET',
        'POST',
        'PUT',
        'DELETE',
      ],
      correct: 1,
      explanation: 'POST is used to create new resources. The server assigns an ID and returns 201 Created. PUT is for updating existing resources with a known ID.',
    },
    {
      id: 'nodejs-rest-2',
      question: 'What status code should a successful DELETE request return?',
      type: 'multiple-choice',
      options: [
        '200 OK with the deleted resource',
        '201 Created',
        '204 No Content',
        '404 Not Found',
      ],
      correct: 2,
      explanation: '204 No Content indicates successful deletion with no response body. Some APIs use 200 OK and return the deleted resource, but 204 is more RESTful.',
    },
  ],
  quiz: [
    {
      id: 'nodejs-rest-q1',
      question: 'What is the correct REST URL pattern for getting posts by a specific user?',
      options: [
        '/getPosts?userId=123',
        '/users/123/posts',
        '/posts/user/123',
        '/users?id=123&posts=true',
      ],
      correct: 1,
      explanation: 'RESTful URLs use nested resources: /users/123/posts clearly shows the relationship. Avoid verbs in URLs (getPosts) and prefer nested paths over complex query parameters.',
    },
  ],
};
