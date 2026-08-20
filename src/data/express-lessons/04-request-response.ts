import type { ExpressLesson } from '../express-curriculum';

export const expressRequestResponseLesson: ExpressLesson = {
  id: 'express-request-response',
  title: 'Request and Response Objects',
  slug: 'request-response',
  chapter: 'routing',
  order: 4,
  difficulty: 'beginner',
  readingTime: 13,
  description: 'Working with req.params, req.query, req.body, req.headers, res.json(), res.status(), and other request/response methods.',
  sections: [
    {
      type: 'text',
      content: 'The request (req) and response (res) objects are the core of Express. The req object represents the HTTP request and has properties for query strings, parameters, body, headers, and more. The res object represents the HTTP response that Express sends back to the client.',
    },
    {
      type: 'heading',
      content: 'Request Object Properties',
    },
    {
      type: 'table',
      headers: ['Property', 'Description', 'Example'],
      rows: [
        ['req.params', 'URL route parameters', 'req.params.id'],
        ['req.query', 'URL query string', 'req.query.search'],
        ['req.body', 'Request body data', 'req.body.name'],
        ['req.headers', 'HTTP headers', 'req.headers.authorization'],
        ['req.method', 'HTTP method', 'GET, POST, PUT, DELETE'],
        ['req.url', 'Request URL', '/users?sort=name'],
        ['req.ip', 'Client IP address', '192.168.1.1'],
      ],
    },
    {
      type: 'example',
      title: 'Accessing request data',
      content: 'Different ways to extract data from incoming requests.',
      language: 'javascript',
      code: `const express = require('express');
const app = express();

app.use(express.json()); // Required for req.body

// Route parameters
app.get('/users/:id', function(req, res) {
  const userId = req.params.id;
  res.json({ userId: userId });
});

// Query strings
app.get('/search', function(req, res) {
  const query = req.query.q;
  const page = req.query.page || 1;
  res.json({ query: query, page: page });
});

// Request body
app.post('/users', function(req, res) {
  const name = req.body.name;
  const email = req.body.email;
  res.json({ name: name, email: email });
});

// Headers
app.get('/protected', function(req, res) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'No token' });
  }
  res.json({ token: token });
});

app.listen(3000);`,
    },
    {
      type: 'heading',
      content: 'Response Object Methods',
    },
    {
      type: 'table',
      headers: ['Method', 'Description', 'Example'],
      rows: [
        ['res.send()', 'Send response (any type)', 'res.send("Hello")'],
        ['res.json()', 'Send JSON response', 'res.json({ ok: true })'],
        ['res.status()', 'Set HTTP status code', 'res.status(404)'],
        ['res.sendFile()', 'Send a file', 'res.sendFile(path)'],
        ['res.redirect()', 'Redirect to URL', 'res.redirect("/login")'],
        ['res.set()', 'Set response header', 'res.set("X-Token", "abc")'],
        ['res.cookie()', 'Set cookie', 'res.cookie("user", "alice")'],
      ],
    },
    {
      type: 'example',
      title: 'Sending different types of responses',
      content: 'Express provides methods for sending various response types.',
      language: 'javascript',
      code: `// Send JSON (most common for APIs)
app.get('/api/users', function(req, res) {
  res.json({
    users: [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ]
  });
});

// Send with status code
app.post('/api/users', function(req, res) {
  res.status(201).json({
    message: 'User created',
    id: 123
  });
});

// Send error
app.get('/api/users/:id', function(req, res) {
  const user = null; // Not found
  if (!user) {
    return res.status(404).json({
      error: 'User not found'
    });
  }
  res.json(user);
});

// Send plain text
app.get('/health', function(req, res) {
  res.send('OK');
});

// Redirect
app.get('/old-page', function(req, res) {
  res.redirect('/new-page');
});`,
    },
    {
      type: 'heading',
      content: 'Status Codes',
    },
    {
      type: 'list',
      items: [
        '200 OK - Request succeeded (GET, PUT, PATCH)',
        '201 Created - Resource created successfully (POST)',
        '204 No Content - Success with no response body (DELETE)',
        '400 Bad Request - Invalid request data',
        '401 Unauthorized - Authentication required',
        '403 Forbidden - Authenticated but not allowed',
        '404 Not Found - Resource does not exist',
        '500 Internal Server Error - Server error',
      ],
    },
    {
      type: 'example',
      title: 'Setting headers',
      content: 'You can set custom headers using res.set() or res.header().',
      language: 'javascript',
      code: `app.get('/api/data', function(req, res) {
  // Set custom header
  res.set('X-API-Version', '1.0');
  
  // Set multiple headers
  res.set({
    'Content-Type': 'application/json',
    'X-Powered-By': 'Express'
  });
  
  res.json({ data: 'Hello' });
});

// Set cookie
app.get('/login', function(req, res) {
  res.cookie('session', 'abc123', {
    maxAge: 900000,
    httpOnly: true
  });
  res.send('Logged in');
});`,
    },
    {
      type: 'note',
      title: 'Method chaining',
      content: 'Most res methods return the res object, allowing you to chain them: res.status(201).json({ message: "Created" })',
    },
    {
      type: 'tryit',
      title: 'Request/Response Inspector',
      css: `body{font-family:system-ui,sans-serif;padding:18px;margin:0;background:#f5f5f5;}
.inspector{max-width:900px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.panel{background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.08);}
.panel-header{background:#000;color:#fff;padding:12px 16px;font-size:14px;font-weight:700;}
.panel-body{padding:16px;}
.input-group{margin-bottom:14px;}
.label{font-size:11px;font-weight:700;color:#666;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px;}
.input{width:100%;padding:10px;border:2px solid #ddd;border-radius:6px;font-size:13px;font-family:monospace;}
.textarea{width:100%;padding:10px;border:2px solid #ddd;border-radius:6px;font-size:12px;font-family:monospace;resize:vertical;min-height:80px;}
.btn{width:100%;padding:12px;background:#000;color:#fff;border:none;border-radius:6px;font-weight:700;font-size:14px;cursor:pointer;margin-top:10px;}
.btn:hover{background:#333;}
.code-block{background:#1a1a1a;color:#4ade80;padding:14px;border-radius:6px;font-family:monospace;font-size:12px;white-space:pre-wrap;min-height:100px;}
.property{color:#60a5fa;margin:4px 0;}
.value{color:#fbbf24;}
@media(max-width:768px){.inspector{grid-template-columns:1fr;}}`,
      js: `function sendRequest() {
  var method = document.getElementById('method').value;
  var url = document.getElementById('url').value;
  var body = document.getElementById('body').value;
  var headers = document.getElementById('headers').value;
  
  var reqObj = {
    method: method,
    url: url,
    params: {},
    query: {},
    body: null,
    headers: {}
  };
  
  // Parse URL
  var parts = url.split('?');
  var path = parts[0];
  
  // Extract params (simple pattern)
  var paramMatch = path.match(/\\/(\\d+)/);
  if (paramMatch) {
    reqObj.params.id = paramMatch[1];
  }
  
  // Extract query
  if (parts[1]) {
    parts[1].split('&').forEach(function(pair) {
      var kv = pair.split('=');
      reqObj.query[kv[0]] = kv[1];
    });
  }
  
  // Parse body
  if (body.trim()) {
    try {
      reqObj.body = JSON.parse(body);
    } catch (e) {
      reqObj.body = body;
    }
  }
  
  // Parse headers
  if (headers.trim()) {
    headers.split('\\n').forEach(function(line) {
      var parts = line.split(':');
      if (parts.length === 2) {
        reqObj.headers[parts[0].trim()] = parts[1].trim();
      }
    });
  }
  
  var reqOutput = '';
  reqOutput += 'req.method: ' + reqObj.method + '\\n';
  reqOutput += 'req.url: ' + reqObj.url + '\\n\\n';
  
  if (Object.keys(reqObj.params).length > 0) {
    reqOutput += 'req.params: ' + JSON.stringify(reqObj.params, null, 2) + '\\n\\n';
  }
  
  if (Object.keys(reqObj.query).length > 0) {
    reqOutput += 'req.query: ' + JSON.stringify(reqObj.query, null, 2) + '\\n\\n';
  }
  
  if (reqObj.body) {
    reqOutput += 'req.body: ' + JSON.stringify(reqObj.body, null, 2) + '\\n\\n';
  }
  
  if (Object.keys(reqObj.headers).length > 0) {
    reqOutput += 'req.headers: ' + JSON.stringify(reqObj.headers, null, 2);
  }
  
  document.getElementById('reqOutput').textContent = reqOutput;
  
  var resOutput = 'HTTP/200 OK\\n';
  resOutput += 'Content-Type: application/json\\n\\n';
  resOutput += JSON.stringify({
    message: 'Request processed',
    received: reqObj
  }, null, 2);
  
  document.getElementById('resOutput').textContent = resOutput;
}

document.getElementById('output').innerHTML =
  '<div class="inspector">' +
  '<div class="panel">' +
  '<div class="panel-header">Request (req)</div>' +
  '<div class="panel-body">' +
  '<div class="input-group">' +
  '<div class="label">Method</div>' +
  '<select id="method" class="input"><option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option></select>' +
  '</div>' +
  '<div class="input-group">' +
  '<div class="label">URL</div>' +
  '<input id="url" class="input" value="/users/123?sort=name" placeholder="/users/123?sort=name">' +
  '</div>' +
  '<div class="input-group">' +
  '<div class="label">Headers (key: value, one per line)</div>' +
  '<textarea id="headers" class="textarea" placeholder="Authorization: Bearer token123">Authorization: Bearer abc123</textarea>' +
  '</div>' +
  '<div class="input-group">' +
  '<div class="label">Body (JSON)</div>' +
  '<textarea id="body" class="textarea" placeholder=\'{"name":"Alice"}\'></textarea>' +
  '</div>' +
  '<button class="btn" onclick="sendRequest()">Send Request</button>' +
  '<div style="margin-top:16px">' +
  '<div class="label">Request Object</div>' +
  '<div class="code-block" id="reqOutput">Click Send Request to see req object...</div>' +
  '</div>' +
  '</div>' +
  '</div>' +
  '<div class="panel">' +
  '<div class="panel-header">Response (res)</div>' +
  '<div class="panel-body">' +
  '<div class="label">Response</div>' +
  '<div class="code-block" id="resOutput">Waiting for request...</div>' +
  '</div>' +
  '</div>' +
  '</div>';`,
    },
  ],
  exercises: [
    {
      id: 'express-req-res-1',
      question: 'Where would you find the value "123" from the URL "/users/123"?',
      type: 'multiple-choice',
      options: [
        'req.query',
        'req.body',
        'req.params',
        'req.url',
      ],
      correct: 2,
      explanation: 'Route parameters (like :id in the route definition) are accessed via req.params. For this URL with route "/users/:id", you would use req.params.id.',
    },
    {
      id: 'express-req-res-2',
      question: 'What middleware is required to access req.body in Express?',
      type: 'multiple-choice',
      options: [
        'No middleware needed',
        'express.json() or express.urlencoded()',
        'express.body()',
        'body-parser is required',
      ],
      correct: 1,
      explanation: 'You need to use express.json() middleware (for JSON bodies) or express.urlencoded() (for form data) to parse the request body and make it available in req.body.',
    },
  ],
  quiz: [
    {
      id: 'express-req-res-q1',
      question: 'What is the difference between res.send() and res.json()?',
      options: [
        'No difference, they are the same',
        'res.json() always sets Content-Type to application/json and stringifies objects',
        'res.send() is faster',
        'res.json() only works with objects',
      ],
      correct: 1,
      explanation: 'res.json() explicitly sets Content-Type to application/json and calls JSON.stringify() on the data. res.send() auto-detects the content type based on what you pass to it.',
    },
  ],
};
