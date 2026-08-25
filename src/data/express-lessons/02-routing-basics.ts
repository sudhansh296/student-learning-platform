import type { ExpressLesson } from '../express-curriculum';

export const expressRoutingLesson: ExpressLesson = {
  id: 'express-routing-basics',
  title: 'Routing Basics',
  slug: 'routing-basics',
  chapter: 'routing',
  order: 2,
  difficulty: 'beginner',
  readingTime: 12,
  description: 'HTTP methods (GET, POST, PUT, DELETE), route parameters, query strings, and route patterns.',
  sections: [
    {
      type: 'text',
      content: 'Routing refers to determining how an application responds to a client request to a particular endpoint (a URI/path and a specific HTTP request method). Express provides methods for each HTTP verb that make routing intuitive and flexible.',
    },
    {
      type: 'heading',
      content: 'HTTP Methods',
    },
    {
      type: 'table',
      headers: ['Method', 'Purpose', 'Example Use Case'],
      rows: [
        ['GET', 'Retrieve data', 'Get list of users, view a page'],
        ['POST', 'Create new resource', 'Submit a form, create user'],
        ['PUT', 'Update entire resource', 'Replace user data'],
        ['PATCH', 'Partial update', 'Update user email only'],
        ['DELETE', 'Remove resource', 'Delete a user or post'],
      ],
    },
    {
      type: 'example',
      title: 'Basic routing with different HTTP methods',
      content: 'Each HTTP method has a corresponding Express method. The route handler receives request and response objects.',
      language: 'javascript',
      code: `const express = require('express');
const app = express();

// GET - retrieve data
app.get('/users', function(req, res) {
  res.json({ users: ['Alice', 'Bob', 'Charlie'] });
});

// POST - create new data
app.post('/users', function(req, res) {
  res.status(201).json({ message: 'User created' });
});

// PUT - update data
app.put('/users/1', function(req, res) {
  res.json({ message: 'User 1 updated' });
});

// DELETE - remove data
app.delete('/users/1', function(req, res) {
  res.status(204).send();
});

app.listen(3000);`,
    },
    {
      type: 'heading',
      content: 'Route Parameters',
    },
    {
      type: 'text',
      content: 'Route parameters are named URL segments used to capture values at specific positions in the URL. They are accessible via req.params object.',
    },
    {
      type: 'example',
      title: 'Using route parameters',
      content: 'Route parameters are defined with a colon followed by the parameter name. They capture dynamic values from the URL.',
      language: 'javascript',
      code: `app.get('/users/:id', function(req, res) {
  const userId = req.params.id;
  res.json({ 
    message: 'Getting user',
    id: userId
  });
});

// Multiple parameters
app.get('/posts/:postId/comments/:commentId', function(req, res) {
  res.json({
    postId: req.params.postId,
    commentId: req.params.commentId
  });
});

// Optional parameters with ?
app.get('/users/:id/:action?', function(req, res) {
  const action = req.params.action || 'view';
  res.json({
    userId: req.params.id,
    action: action
  });
});`,
    },
    {
      type: 'heading',
      content: 'Query Strings',
    },
    {
      type: 'text',
      content: 'Query strings are key-value pairs in the URL after the ? symbol. Express automatically parses them into the req.query object.',
    },
    {
      type: 'example',
      title: 'Working with query strings',
      content: 'Query parameters are perfect for filtering, pagination, sorting, and optional parameters.',
      language: 'javascript',
      code: `// URL: /search?q=express&limit=10
app.get('/search', function(req, res) {
  const query = req.query.q;
  const limit = req.query.limit || 20;
  
  res.json({
    query: query,
    limit: limit,
    results: []
  });
});

// URL: /products?category=electronics&minPrice=100&maxPrice=500
app.get('/products', function(req, res) {
  const filters = {
    category: req.query.category,
    minPrice: req.query.minPrice,
    maxPrice: req.query.maxPrice
  };
  
  res.json({ filters: filters });
});`,
    },
    {
      type: 'heading',
      content: 'Route Patterns',
    },
    {
      type: 'example',
      title: 'Advanced route patterns',
      content: 'Express supports pattern matching in routes using regular expressions and wildcards.',
      language: 'javascript',
      code: `// Match /users and /user
app.get('/users?', function(req, res) {
  res.send('Matches /users and /user');
});

// Match /ab, /aab, /aaab, etc.
app.get('/a+b', function(req, res) {
  res.send('Pattern: a+b');
});

// Match anything with "fly" in it
app.get(/.*fly$/, function(req, res) {
  res.send('Matches butterfly, dragonfly, etc.');
});

// Wildcard - catch all
app.get('*', function(req, res) {
  res.status(404).send('Page not found');
});`,
    },
    {
      type: 'note',
      title: 'Order matters',
      content: 'Express matches routes in the order they are defined. More specific routes should come before general ones. The wildcard route (*) should always be last.',
    },
    {
      type: 'tryit',
      title: 'Route Testing Simulator',
      css: `body{font-family:system-ui,sans-serif;padding:18px;margin:0;background:#e8e8e8;}
.container{max-width:800px;margin:0 auto;}
.panel{background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);margin-bottom:16px;}
.panel-header{background:#000;color:#fff;padding:12px 18px;font-size:14px;font-weight:700;}
.panel-body{padding:18px;}
.form-row{display:grid;grid-template-columns:100px 1fr auto;gap:10px;margin-bottom:12px;align-items:center;}
.method-btn{padding:8px 16px;border:2px solid #000;background:#fff;color:#000;border-radius:6px;font-weight:700;font-size:13px;cursor:pointer;}
.method-btn.active{background:#000;color:#fff;}
.url-input{padding:10px 14px;border:2px solid #ddd;border-radius:6px;font-family:monospace;font-size:13px;width:100%;}
.send-btn{padding:10px 24px;background:#000;color:#fff;border:none;border-radius:6px;font-weight:700;cursor:pointer;font-size:14px;}
.send-btn:hover{background:#333;}
.routes-list{margin-top:14px;}
.route-badge{display:inline-block;background:#f0f0f0;border:1px solid #ddd;border-radius:6px;padding:6px 12px;margin:4px;font-size:12px;font-family:monospace;color:#333;}
.response{background:#1a1a1a;color:#4ade80;padding:16px;font-family:monospace;font-size:13px;border-radius:8px;min-height:100px;white-space:pre-wrap;}
.req-info{color:#60a5fa;margin-bottom:8px;}
.res-info{color:#fbbf24;margin-bottom:8px;}
.res-body{color:#4ade80;}`,
      js: `var routes = [
  { method: 'GET', path: '/users', params: {}, query: {} },
  { method: 'GET', path: '/users/:id', params: { id: '123' }, query: {} },
  { method: 'GET', path: '/search', params: {}, query: { q: 'express', limit: '10' } },
  { method: 'POST', path: '/users', params: {}, query: {} },
  { method: 'DELETE', path: '/users/:id', params: { id: '123' }, query: {} }
];

var currentMethod = 'GET';
var currentPath = '/users';

function setMethod(method) {
  currentMethod = method;
  render();
}

function sendRequest() {
  var path = document.getElementById('urlInput').value;
  var matched = null;
  
  for (var i = 0; i < routes.length; i++) {
    var route = routes[i];
    if (route.method === currentMethod) {
      var pathPattern = route.path.replace(/:\w+/g, '[^/]+');
      var regex = new RegExp('^' + pathPattern + '$');
      if (regex.test(path.split('?')[0])) {
        matched = route;
        break;
      }
    }
  }
  
  var output = '';
  if (matched) {
    output += '> Request: ' + currentMethod + ' ' + path + '\ ';
    output += '> Matched Route: ' + matched.path + '\\n\ ';
    
    if (Object.keys(matched.params).length > 0) {
      output += 'req.params: ' + JSON.stringify(matched.params, null, 2) + '\\n\ ';
    }
    
    if (Object.keys(matched.query).length > 0) {
      output += 'req.query: ' + JSON.stringify(matched.query, null, 2) + '\\n\ ';
    }
    
    output += 'HTTP/200 OK\ ';
    output += '{ "message": "Route matched successfully" }';
  } else {
    output += '> Request: ' + currentMethod + ' ' + path + '\ ';
    output += '> No matching route\\n\ ';
    output += 'HTTP/404 Not Found\ ';
    output += '{ "error": "Route not found" }';
  }
  
  document.getElementById('responseBox').textContent = output;
}

function render() {
  var methods = ['GET', 'POST', 'PUT', 'DELETE'];
  var methodButtons = methods.map(function(m) {
    var cls = m === currentMethod ? 'method-btn active' : 'method-btn';
    return '<button class="' + cls + '" data-method="' + m + '">' + m + '</button>';
  }).join(' ');
  
  var routeBadges = routes.map(function(r) {
    return '<span class="route-badge">' + r.method + ' ' + r.path + '</span>';
  }).join('');
  
  document.getElementById('output').innerHTML =
    '<div class="container">' +
    '<div class="panel">' +
    '<div class="panel-header">Route Tester</div>' +
    '<div class="panel-body">' +
    '<div style="margin-bottom:12px">' + methodButtons + '</div>' +
    '<div class="form-row">' +
    '<span style="font-weight:600;font-size:13px">URL:</span>' +
    '<input id="urlInput" class="url-input" value="' + currentPath + '" placeholder="/users">' +
    '<button class="send-btn" onclick="sendRequest()">Send</button>' +
    '</div>' +
    '<div class="routes-list">' +
    '<div style="font-size:11px;font-weight:700;color:#666;margin-bottom:6px">AVAILABLE ROUTES:</div>' +
    routeBadges +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div class="panel">' +
    '<div class="panel-header">Response</div>' +
    '<div class="panel-body">' +
    '<div class="response" id="responseBox">Click Send to test a route...</div>' +
    '</div>' +
    '</div>' +
    '</div>';
  
  document.querySelectorAll('[data-method]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      setMethod(btn.getAttribute('data-method'));
    });
  });
}

render();`,
    },
  ],
  exercises: [
    {
      id: 'express-routing-1',
      question: 'How do you access the value of a route parameter named "id"?',
      type: 'multiple-choice',
      options: [
        'req.id',
        'req.params.id',
        'req.query.id',
        'req.body.id',
      ],
      correct: 1,
      explanation: 'Route parameters are accessed via req.params. For a route like "/users/:id", you would use req.params.id to get the value.',
    },
    {
      id: 'express-routing-2',
      question: 'What is the difference between req.params and req.query?',
      type: 'multiple-choice',
      options: [
        'There is no difference',
        'req.params captures URL segments, req.query captures query strings',
        'req.params is for GET, req.query is for POST',
        'req.query is deprecated',
      ],
      correct: 1,
      explanation: 'req.params contains route parameters from the URL path (/users/:id), while req.query contains query string parameters (/users?sort=name).',
    },
  ],
  quiz: [
    {
      id: 'express-routing-q1',
      question: 'Given the URL "/products/123?sort=price&order=asc", which is correct?',
      options: [
        'req.params.id = 123, req.query.sort = "price"',
        'req.query.id = 123, req.params.sort = "price"',
        'Both values are in req.params',
        'Both values are in req.query',
      ],
      correct: 0,
      explanation: 'The route parameter "123" would be in req.params (if the route is defined as "/products/:id"), and the query string parameters "sort" and "order" would be in req.query.',
    },
  ],
};
