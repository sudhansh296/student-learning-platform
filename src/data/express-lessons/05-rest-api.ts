import type { ExpressLesson } from '../express-curriculum';

export const expressRestApiLesson: ExpressLesson = {
  id: 'express-rest-api',
  title: 'Building REST APIs',
  slug: 'rest-api',
  chapter: 'routing',
  order: 5,
  difficulty: 'intermediate',
  readingTime: 16,
  description: 'REST principles, CRUD operations, HTTP methods, status codes, and building production-ready APIs with Express.',
  sections: [
    {
      type: 'text',
      content: 'REST (Representational State Transfer) is an architectural style for designing networked applications. A RESTful API uses HTTP methods to perform CRUD operations on resources. Express makes it easy to build RESTful APIs with its routing system and middleware.',
    },
    {
      type: 'analogy',
      title: 'REST API is like a library system',
      content: 'Think of a REST API like a library. Books are resources with unique IDs. You can GET a book (read), POST a new book (add to collection), PUT to replace a book (update entire record), or DELETE to remove a book. The librarian (API) handles your requests using standard procedures (HTTP methods) and gives you standard responses (status codes).',
    },
    {
      type: 'heading',
      content: 'REST Principles',
    },
    {
      type: 'list',
      items: [
        'Resources are nouns (users, products, posts) not verbs (getUser, deletePost)',
        'Use HTTP methods for actions: GET (read), POST (create), PUT (update), DELETE (remove)',
        'URLs identify resources: /users/123 not /getUser?id=123',
        'Stateless - each request is independent',
        'Use proper HTTP status codes',
        'Return consistent JSON format',
      ],
    },
    {
      type: 'heading',
      content: 'CRUD Operations',
    },
    {
      type: 'table',
      headers: ['Operation', 'HTTP Method', 'URL Pattern', 'Status Code'],
      rows: [
        ['Read all', 'GET', '/users', '200 OK'],
        ['Read one', 'GET', '/users/:id', '200 OK'],
        ['Create', 'POST', '/users', '201 Created'],
        ['Update', 'PUT', '/users/:id', '200 OK'],
        ['Partial update', 'PATCH', '/users/:id', '200 OK'],
        ['Delete', 'DELETE', '/users/:id', '204 No Content'],
      ],
    },
    {
      type: 'example',
      title: 'Complete REST API',
      content: 'A full CRUD API for managing users with proper status codes and error handling.',
      language: 'javascript',
      code: `const express = require('express');
const app = express();

app.use(express.json());

let users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' }
];
let nextId = 3;

// GET /users - Get all users
app.get('/users', function(req, res) {
  res.json({ success: true, data: users });
});

// GET /users/:id - Get one user
app.get('/users/:id', function(req, res) {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  res.json({ success: true, data: user });
});

// POST /users - Create user
app.post('/users', function(req, res) {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: 'Name and email are required'
    });
  }
  
  const newUser = { id: nextId++, name, email };
  users.push(newUser);
  
  res.status(201).json({
    success: true,
    data: newUser
  });
});

// PUT /users/:id - Update user
app.put('/users/:id', function(req, res) {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: 'Name and email are required'
    });
  }
  
  users[index] = { id, name, email };
  res.json({ success: true, data: users[index] });
});

// DELETE /users/:id - Delete user
app.delete('/users/:id', function(req, res) {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  users.splice(index, 1);
  res.status(204).send();
});

app.listen(3000);`,
    },
    {
      type: 'heading',
      content: 'Filtering and Pagination',
    },
    {
      type: 'example',
      title: 'Query parameters for filtering',
      content: 'Use query strings to filter, sort, and paginate results.',
      language: 'javascript',
      code: `// GET /products?category=electronics&minPrice=100&maxPrice=500
app.get('/products', function(req, res) {
  let results = products;
  
  // Filter by category
  if (req.query.category) {
    results = results.filter(p => p.category === req.query.category);
  }
  
  // Filter by price range
  if (req.query.minPrice) {
    results = results.filter(p => p.price >= parseFloat(req.query.minPrice));
  }
  if (req.query.maxPrice) {
    results = results.filter(p => p.price <= parseFloat(req.query.maxPrice));
  }
  
  // Pagination
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;
  
  const paginatedResults = results.slice(offset, offset + limit);
  
  res.json({
    success: true,
    data: paginatedResults,
    pagination: {
      page: page,
      limit: limit,
      total: results.length
    }
  });
});`,
    },
    {
      type: 'tip',
      title: 'Consistent response format',
      content: 'Use a consistent JSON structure for all responses: { success: boolean, data: any, error?: string }. This makes it easier for clients to handle responses.',
    },
    {
      type: 'tryit',
      title: 'REST API Testing Console',
      css: `body{font-family:system-ui,sans-serif;padding:20px;margin:0;background:#e8e8e8;}
.console{max-width:900px;margin:0 auto;}
.header{background:#000;color:#fff;padding:16px 20px;border-radius:10px 10px 0 0;display:flex;align-items:center;justify-content:space-between;}
.header h2{margin:0;font-size:18px;font-weight:700;}
.badge{background:#4ade80;color:#000;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:700;}
.controls{background:#fff;border:1px solid #ddd;border-top:none;padding:16px;display:grid;grid-template-columns:110px 1fr auto;gap:10px;align-items:end;}
.method-sel{padding:10px;border:2px solid #000;border-radius:6px;font-weight:700;font-size:14px;background:#fff;}
.url-inp{padding:10px 14px;border:2px solid #ddd;border-radius:6px;font-family:monospace;font-size:13px;width:100%;}
.send-btn{padding:10px 24px;background:#000;color:#fff;border:none;border-radius:6px;font-weight:700;font-size:14px;cursor:pointer;}
.send-btn:hover{background:#333;}
.body-section{background:#fff;border:1px solid #ddd;border-top:none;padding:16px;}
.label{font-size:11px;font-weight:700;color:#666;margin-bottom:8px;text-transform:uppercase;}
.json-area{width:100%;padding:12px;border:2px solid #ddd;border-radius:6px;font-family:monospace;font-size:12px;resize:vertical;min-height:70px;}
.response{background:#1a1a1a;color:#4ade80;padding:16px;border:1px solid #ddd;border-top:none;border-radius:0 0 10px 10px;font-family:monospace;font-size:12px;white-space:pre-wrap;min-height:100px;}
.status{color:#fbbf24;margin-bottom:10px;}
.resources{background:#fff;border:1px solid #ddd;padding:14px;margin-top:16px;border-radius:8px;}
.res-title{font-size:12px;font-weight:700;margin-bottom:10px;color:#333;}
.res-item{background:#f5f5f5;padding:8px 12px;margin:6px 0;border-radius:6px;font-size:12px;font-family:monospace;}`,
      js: `var users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' }
];
var nextId = 3;

function handleRequest() {
  var method = document.getElementById('method').value;
  var url = document.getElementById('url').value;
  var bodyText = document.getElementById('bodyInput').value.trim();
  var body = null;
  
  if (bodyText) {
    try {
      body = JSON.parse(bodyText);
    } catch (e) {
      showResponse(400, { success: false, error: 'Invalid JSON' });
      return;
    }
  }
  
  // Parse URL
  var match;
  
  if (method === 'GET' && url === '/users') {
    showResponse(200, { success: true, data: users });
  } else if (method === 'GET' && (match = url.match(/^\\/users\\/(\\d+)$/))) {
    var id = parseInt(match[1]);
    var user = users.find(function(u) { return u.id === id; });
    if (user) {
      showResponse(200, { success: true, data: user });
    } else {
      showResponse(404, { success: false, error: 'User not found' });
    }
  } else if (method === 'POST' && url === '/users') {
    if (!body || !body.name || !body.email) {
      showResponse(400, { success: false, error: 'Name and email required' });
    } else {
      var newUser = { id: nextId++, name: body.name, email: body.email };
      users.push(newUser);
      showResponse(201, { success: true, data: newUser });
    }
  } else if (method === 'PUT' && (match = url.match(/^\\/users\\/(\\d+)$/))) {
    var id = parseInt(match[1]);
    var idx = users.findIndex(function(u) { return u.id === id; });
    if (idx === -1) {
      showResponse(404, { success: false, error: 'User not found' });
    } else if (!body || !body.name || !body.email) {
      showResponse(400, { success: false, error: 'Name and email required' });
    } else {
      users[idx] = { id: id, name: body.name, email: body.email };
      showResponse(200, { success: true, data: users[idx] });
    }
  } else if (method === 'DELETE' && (match = url.match(/^\\/users\\/(\\d+)$/))) {
    var id = parseInt(match[1]);
    var idx = users.findIndex(function(u) { return u.id === id; });
    if (idx === -1) {
      showResponse(404, { success: false, error: 'User not found' });
    } else {
      users.splice(idx, 1);
      showResponse(204, { success: true, message: 'Deleted' });
    }
  } else {
    showResponse(404, { success: false, error: 'Route not found' });
  }
  
  renderResources();
}

function showResponse(status, data) {
  var statusText = status + ' ' + 
    (status === 200 ? 'OK' : status === 201 ? 'Created' : 
     status === 204 ? 'No Content' : status === 400 ? 'Bad Request' : 
     status === 404 ? 'Not Found' : 'Error');
  
  var output = '<div class="status">HTTP/' + statusText + '</div>';
  output += JSON.stringify(data, null, 2);
  
  document.getElementById('response').innerHTML = output;
}

function renderResources() {
  var list = users.map(function(u) {
    return '<div class="res-item">{ id: ' + u.id + ', name: "' + u.name + '", email: "' + u.email + '" }</div>';
  }).join('');
  
  document.getElementById('resources').innerHTML =
    '<div class="res-title">Current Users (' + users.length + ')</div>' + list;
}

document.getElementById('output').innerHTML =
  '<div class="console">' +
  '<div class="header"><h2>REST API Console</h2><div class="badge">Express</div></div>' +
  '<div class="controls">' +
  '<select id="method" class="method-sel"><option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option></select>' +
  '<input id="url" class="url-inp" value="/users" placeholder="/users">' +
  '<button class="send-btn" onclick="handleRequest()">Send</button>' +
  '</div>' +
  '<div class="body-section">' +
  '<div class="label">Request Body (JSON for POST/PUT)</div>' +
  '<textarea id="bodyInput" class="json-area" placeholder=\'{"name":"Charlie","email":"charlie@example.com"}\'></textarea>' +
  '</div>' +
  '<div class="response" id="response">Click Send to make a request...</div>' +
  '<div class="resources" id="resources"></div>' +
  '</div>';

renderResources();`,
    },
  ],
  exercises: [
    {
      id: 'express-rest-1',
      question: 'What HTTP status code should be returned when successfully creating a resource?',
      type: 'multiple-choice',
      options: [
        '200 OK',
        '201 Created',
        '204 No Content',
        '202 Accepted',
      ],
      correct: 1,
      explanation: '201 Created indicates that a new resource was successfully created. It is the correct status code for successful POST requests that create resources.',
    },
    {
      id: 'express-rest-2',
      question: 'What is the RESTful way to get a specific user with ID 5?',
      type: 'multiple-choice',
      options: [
        'GET /getUser?id=5',
        'GET /users/5',
        'POST /users with {id: 5}',
        'GET /user?id=5',
      ],
      correct: 1,
      explanation: 'RESTful APIs use GET with the resource ID in the URL path: GET /users/5. Avoid verbs in URLs (getUser) and prefer path parameters over query strings for resource IDs.',
    },
  ],
  quiz: [
    {
      id: 'express-rest-q1',
      question: 'What is the difference between PUT and PATCH?',
      options: [
        'No difference, they are the same',
        'PUT replaces the entire resource, PATCH updates specific fields',
        'PUT is for creating, PATCH is for updating',
        'PATCH is deprecated',
      ],
      correct: 1,
      explanation: 'PUT replaces the entire resource (you must send all fields), while PATCH updates only the fields you specify. For example, PATCH can update just the email field while PUT would require sending name and email.',
    },
  ],
};
