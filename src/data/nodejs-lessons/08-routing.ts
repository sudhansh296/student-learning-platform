import type { NodejsLesson } from '../nodejs-curriculum';

export const nodejsRoutingLesson: NodejsLesson = {
  id: 'nodejs-routing',
  title: 'Express Routing',
  slug: 'routing',
  chapter: 'server',
  order: 8,
  difficulty: 'intermediate',
  readingTime: 11,
  description: 'Route parameters, query strings, Express Router for modular routes, and route organization patterns.',
  sections: [
    {
      type: 'text',
      content: 'Express routing goes beyond simple paths. Route parameters let you capture dynamic values from URLs, query strings provide optional filters, and Express Router helps organize routes into modular files. These patterns are essential for building RESTful APIs.',
    },
    {
      type: 'heading',
      content: 'Route Parameters',
    },
    {
      type: 'example',
      title: 'Dynamic route parameters with :param',
      content: 'Route parameters are named URL segments prefixed with a colon. Express extracts them and makes them available in req.params. Common for REST APIs to identify specific resources.',
      language: 'javascript',
      code: `const express = require('express');
const app = express();

// Route parameter: :id
app.get('/users/:id', function(req, res) {
  const userId = req.params.id;
  res.json({
    message: 'Fetching user',
    userId: userId,
    // Simulate database lookup
    user: { id: userId, name: 'User ' + userId }
  });
});

// Multiple parameters
app.get('/posts/:postId/comments/:commentId', function(req, res) {
  res.json({
    postId: req.params.postId,
    commentId: req.params.commentId
  });
});

// Parameter patterns (optional regex)
app.get('/flight/:from-:to', function(req, res) {
  // Matches: /flight/LAX-JFK
  res.json({
    from: req.params.from,    // "LAX"
    to: req.params.to          // "JFK"
  });
});

// Numeric ID validation
app.get('/products/:id(\\d+)', function(req, res) {
  // Only matches numeric IDs: /products/123
  // Does not match: /products/abc
  res.json({ productId: req.params.id });
});

app.listen(3000);`,
      output: '{ "userId": "42", "user": { "id": "42", "name": "User 42" } }',
    },
    {
      type: 'heading',
      content: 'Query Strings',
    },
    {
      type: 'example',
      title: 'Query parameters with req.query',
      content: 'Query strings are optional parameters after ? in the URL. Express parses them into req.query. Use them for filtering, sorting, pagination - anything optional that modifies the response.',
      language: 'javascript',
      code: `const express = require('express');
const app = express();

// GET /search?q=express&limit=10&sort=recent
app.get('/search', function(req, res) {
  const query = req.query.q;       // "express"
  const limit = req.query.limit || 20;  // 10 (or default 20)
  const sort = req.query.sort || 'relevant'; // "recent"

  res.json({
    query: query,
    limit: parseInt(limit),
    sort: sort,
    results: ['Result 1', 'Result 2', 'Result 3']
  });
});

// Pagination with query params
// GET /api/posts?page=2&pageSize=10
app.get('/api/posts', function(req, res) {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;
  const skip = (page - 1) * pageSize;

  res.json({
    page: page,
    pageSize: pageSize,
    total: 100,
    posts: [/* ... */]
  });
});

// Combine route params and query strings
// GET /users/42/posts?published=true&sort=date
app.get('/users/:id/posts', function(req, res) {
  const userId = req.params.id;
  const published = req.query.published === 'true';
  const sort = req.query.sort || 'date';

  res.json({
    userId: userId,
    filters: { published: published, sort: sort }
  });
});

app.listen(3000);`,
    },
    {
      type: 'heading',
      content: 'Express Router',
    },
    {
      type: 'example',
      title: 'Modular routes with express.Router()',
      content: 'As apps grow, defining all routes in one file becomes messy. Express Router lets you create route handlers in separate files and mount them on the main app. This is the standard pattern for organizing Express apps.',
      language: 'javascript',
      code: `// routes/users.js - user routes module
const express = require('express');
const router = express.Router();

// These routes are relative to where the router is mounted
router.get('/', function(req, res) {
  // Handles: GET /api/users
  res.json([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ]);
});

router.get('/:id', function(req, res) {
  // Handles: GET /api/users/:id
  res.json({ id: req.params.id, name: 'User ' + req.params.id });
});

router.post('/', function(req, res) {
  // Handles: POST /api/users
  res.status(201).json({ created: true, user: req.body });
});

router.delete('/:id', function(req, res) {
  // Handles: DELETE /api/users/:id
  res.status(204).send();
});

module.exports = router;

// ==========================================
// server.js - main app file
const express = require('express');
const app = express();

app.use(express.json());

// Mount the users router at /api/users
const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);

// Mount another router
const postsRouter = require('./routes/posts');
app.use('/api/posts', postsRouter);

app.listen(3000);`,
    },
    {
      type: 'example',
      title: 'Route organization pattern for a real app',
      content: 'Shows the recommended project structure for organizing Express routes into separate files, then mounting them all under a single /api prefix in the main server file.',
      language: 'javascript',
      code: `// Typical project structure:
// server.js          - main app setup
// routes/
//   index.js         - mounts all routers
//   users.js         - user routes
//   posts.js         - post routes
//   auth.js          - authentication routes

// routes/index.js
const express = require('express');
const router = express.Router();

const usersRouter = require('./users');
const postsRouter = require('./posts');
const authRouter = require('./auth');

router.use('/users', usersRouter);
router.use('/posts', postsRouter);
router.use('/auth', authRouter);

module.exports = router;

// server.js
const express = require('express');
const app = express();

app.use(express.json());

// Mount all API routes at /api
const apiRouter = require('./routes');
app.use('/api', apiRouter);

// Now you have:
// POST /api/auth/login
// POST /api/auth/register
// GET  /api/users
// GET  /api/users/:id
// GET  /api/posts
// POST /api/posts

app.listen(3000);`,
    },
    {
      type: 'table',
      title: 'Route concepts comparison',
      headers: ['Concept', 'Syntax', 'Use Case', 'Example'],
      rows: [
        ['Route param', ':id', 'Required resource ID', '/users/:id'],
        ['Query string', '?key=value', 'Optional filters', '/search?q=node'],
        ['Multiple params', ':a/:b', 'Nested resources', '/posts/:id/comments/:cid'],
        ['Router', 'express.Router()', 'Modular routes', 'app.use("/api", router)'],
      ],
    },
    {
      type: 'tip',
      title: 'Route parameter vs query string',
      content: 'Use route parameters (/users/:id) for required values that identify a specific resource. Use query strings (?page=2&sort=name) for optional modifiers like filters, sorting, pagination. If removing it breaks the route, make it a parameter. If it is optional, make it a query param.',
    },
    {
      type: 'tryit',
      title: 'Route Tester',
      css: `body{font-family:system-ui,sans-serif;padding:14px;margin:0;background:#f0f2f5;}
.tester{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:16px;}
.url-bar{display:flex;gap:8px;margin-bottom:14px;}
.url-input{flex:1;border:2px solid #e5e7eb;border-radius:8px;padding:10px 14px;font-size:14px;font-family:monospace;outline:none;}
.url-input:focus{border-color:#339933;}
.btn-go{background:#339933;color:#fff;border:none;border-radius:8px;padding:10px 24px;font-size:14px;font-weight:700;cursor:pointer;}
.btn-go:hover{background:#2d7a2d;}
.result{background:#0f172a;border-radius:8px;padding:14px;margin-top:12px;min-height:80px;font-family:monospace;font-size:13px;}
.result-title{color:#94a3b8;font-size:11px;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;}
.result-data{color:#4ade80;}
.example-btn{background:#f3f4f6;border:1px solid #e5e7eb;border-radius:6px;padding:6px 12px;font-size:12px;cursor:pointer;margin:3px;color:#111;}
.example-btn:hover{background:#e5e7eb;}
.label{font-size:12px;color:#666;margin-bottom:6px;}`,
      js: `var routes = {
  '/users/:id': function(params, query) {
    return { route: '/users/:id', params: params, user: { id: params.id, name: 'User ' + params.id } };
  },
  '/posts/:postId/comments/:commentId': function(params, query) {
    return { route: '/posts/:postId/comments/:commentId', params: params };
  },
  '/search': function(params, query) {
    return { route: '/search', query: query, results: ['Result A', 'Result B', 'Result C'] };
  },
  '/api/posts': function(params, query) {
    return { route: '/api/posts', query: query, page: query.page || '1', pageSize: query.pageSize || '20' };
  }
};

function matchRoute(url) {
  var parts = url.split('?');
  var path = parts[0];
  var queryStr = parts[1] || '';
  var query = {};
  if (queryStr) {
    queryStr.split('&').forEach(function(pair) {
      var kv = pair.split('=');
      query[kv[0]] = kv[1] || '';
    });
  }

  for (var pattern in routes) {
    var regex = pattern.replace(/:[^/]+/g, '([^/]+)');
    var match = path.match(new RegExp('^' + regex + '$'));
    if (match) {
      var paramNames = (pattern.match(/:[^/]+/g) || []).map(function(p) { return p.slice(1); });
      var params = {};
      paramNames.forEach(function(name, i) { params[name] = match[i + 1]; });
      return routes[pattern](params, query);
    }
  }
  return { error: 'Route not found', path: path };
}

function tryUrl(url) {
  var result = matchRoute(url);
  var resultEl = document.getElementById('result-data');
  if (result.error) {
    resultEl.innerHTML = '<span style="color:#f87171">404 Not Found - No route matches: ' + result.path + '</span>';
  } else {
    resultEl.innerHTML = '<span style="color:#4ade80">' + JSON.stringify(result, null, 2) + '</span>';
  }
}

function render() {
  document.getElementById('output').innerHTML =
    '<div class="tester">' +
    '<div class="label">Enter a URL to test route matching:</div>' +
    '<div class="url-bar">' +
    '<input class="url-input" id="url-input" value="/users/42" placeholder="/path?query=string" />' +
    '<button class="btn-go" id="btn-go">Test Route</button>' +
    '</div>' +
    '<div class="label">Or try an example:</div>' +
    '<div style="margin-bottom:10px">' +
    '<button class="example-btn" data-url="/users/123">GET /users/123</button>' +
    '<button class="example-btn" data-url="/posts/10/comments/5">GET /posts/10/comments/5</button>' +
    '<button class="example-btn" data-url="/search?q=express&limit=20">GET /search?q=express&limit=20</button>' +
    '<button class="example-btn" data-url="/api/posts?page=3&pageSize=10">GET /api/posts?page=3&pageSize=10</button>' +
    '<button class="example-btn" data-url="/notfound">GET /notfound</button>' +
    '</div>' +
    '<div class="result">' +
    '<div class="result-title">Response</div>' +
    '<pre class="result-data" id="result-data" style="margin:0;white-space:pre-wrap">Click "Test Route" or an example...</pre>' +
    '</div></div>';

  document.getElementById('btn-go').addEventListener('click', function() {
    var url = document.getElementById('url-input').value;
    tryUrl(url);
  });
  document.querySelectorAll('[data-url]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var url = btn.getAttribute('data-url');
      document.getElementById('url-input').value = url;
      tryUrl(url);
    });
  });
}

render();`,
    },
  ],
  exercises: [
    {
      id: 'nodejs-routing-1',
      question: 'How do you access route parameters in Express?',
      type: 'multiple-choice',
      options: [
        'req.params.paramName',
        'req.query.paramName',
        'req.body.paramName',
        'req.route.paramName',
      ],
      correct: 0,
      explanation: 'Route parameters defined with :paramName are available in req.params. req.query is for query strings (?key=value), and req.body is for POST/PUT request bodies.',
    },
    {
      id: 'nodejs-routing-2',
      question: 'What is the purpose of express.Router()?',
      type: 'multiple-choice',
      options: [
        'To create faster routes than app.get/post',
        'To organize routes into modular files that can be mounted on the main app',
        'To enable route parameters in Express',
        'To automatically validate route parameters',
      ],
      correct: 1,
      explanation: 'express.Router() creates a mini-app with its own routes that can be exported from a separate file and mounted on the main app with app.use(). This is the standard pattern for organizing routes in larger Express applications.',
    },
  ],
  quiz: [
    {
      id: 'nodejs-routing-q1',
      question: 'When should you use route parameters vs query strings?',
      options: [
        'Always use query strings - they are more flexible',
        'Use route params for required resource IDs; use query strings for optional filters',
        'Use route params for everything - query strings are deprecated',
        'They are interchangeable - use whichever you prefer',
      ],
      correct: 1,
      explanation: 'Route parameters (/users/:id) are for required values that identify a specific resource. Query strings (?page=2&sort=name) are for optional modifiers. This convention makes APIs predictable and follows REST principles.',
    },
  ],
};
