import type { NodejsLesson } from '../nodejs-curriculum';

export const nodejsMiddlewareLesson: NodejsLesson = {
  id: 'nodejs-middleware',
  title: 'Middleware',
  slug: 'middleware',
  chapter: 'server',
  order: 9,
  difficulty: 'intermediate',
  readingTime: 13,
  description: 'Express middleware: app.use, custom middleware, error handlers, request logging, authentication, and the middleware chain.',
  sections: [
    {
      type: 'text',
      content: 'Middleware functions are the core of Express. They sit between the incoming request and your route handler, processing, modifying, or validating data. Middleware can parse JSON, log requests, check authentication, handle errors, and more. Understanding middleware is key to mastering Express.',
    },
    {
      type: 'analogy',
      title: 'Middleware as airport security checkpoints',
      content: 'Imagine a request traveling through an airport (your Express app). Middleware are the security checkpoints, passport control, and customs it passes through. Each checkpoint inspects, validates, or modifies the traveler (request). If everything is OK, the traveler moves to the next checkpoint. If not, they are stopped (error response) before reaching the final destination (route handler).',
    },
    {
      type: 'heading',
      content: 'How Middleware Works',
    },
    {
      type: 'example',
      title: 'The middleware signature and next()',
      content: 'Middleware is a function with (req, res, next). It can modify req or res, then must call next() to pass control to the next middleware. If next() is not called, the request hangs.',
      language: 'javascript',
      code: `const express = require('express');
const app = express();

// Custom middleware function
function logger(req, res, next) {
  console.log(req.method, req.url, '- at', new Date().toISOString());
  next(); // MUST call next() to continue to the next middleware or route
}

// Register middleware with app.use
app.use(logger);

// Middleware that adds data to req
app.use(function(req, res, next) {
  req.requestTime = Date.now();
  next();
});

// Now all routes have access to req.requestTime
app.get('/', function(req, res) {
  res.json({
    message: 'Hello',
    requestTime: req.requestTime
  });
});

app.listen(3000);`,
      output: 'GET / - at 2024-01-15T10:30:00.000Z',
    },
    {
      type: 'heading',
      content: 'Common Built-in Middleware',
    },
    {
      type: 'example',
      title: 'express.json and express.static',
      content: 'Shows the built-in Express middleware for parsing JSON request bodies, parsing URL-encoded form data, and serving static files from a directory.',
      language: 'javascript',
      code: `const express = require('express');
const app = express();

// Parse JSON bodies (for POST/PUT requests)
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Serve static files from "public" directory
// Files in /public/css/style.css accessible at /css/style.css
app.use(express.static('public'));

// Serve static files with a path prefix
app.use('/assets', express.static('public'));
// Now /public/logo.png is available at /assets/logo.png

app.post('/api/data', function(req, res) {
  // req.body is available thanks to express.json()
  console.log('Received:', req.body);
  res.json({ received: req.body });
});

app.listen(3000);`,
    },
    {
      type: 'heading',
      content: 'Custom Middleware',
    },
    {
      type: 'example',
      title: 'Authentication middleware',
      content: 'Middleware can check conditions and stop the request by sending a response instead of calling next(). This is how authentication and authorization work.',
      language: 'javascript',
      code: `const express = require('express');
const app = express();

// Authentication middleware
function requireAuth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    // Stop here - do NOT call next()
    return res.status(401).json({ error: 'No token provided' });
  }

  if (token !== 'Bearer secret-token') {
    return res.status(403).json({ error: 'Invalid token' });
  }

  // Authentication passed - add user info to req
  req.user = { id: 123, name: 'Alice' };
  next(); // Continue to the route handler
}

// Public route - no auth needed
app.get('/public', function(req, res) {
  res.json({ message: 'This is public' });
});

// Protected route - auth required
app.get('/protected', requireAuth, function(req, res) {
  res.json({
    message: 'This is protected',
    user: req.user
  });
});

// Apply auth to all routes under /api
app.use('/api', requireAuth);

app.get('/api/profile', function(req, res) {
  res.json({ profile: req.user });
});

app.listen(3000);`,
    },
    {
      type: 'heading',
      content: 'Error Handling Middleware',
    },
    {
      type: 'example',
      title: 'Error middleware with 4 parameters',
      content: 'Error middleware has 4 parameters: (err, req, res, next). It must come AFTER all routes. Express automatically calls error middleware when next(error) is called or when a route throws an error.',
      language: 'javascript',
      code: `const express = require('express');
const app = express();

app.use(express.json());

// Regular routes
app.get('/error', function(req, res, next) {
  // Trigger error handling
  const err = new Error('Something went wrong!');
  err.status = 500;
  next(err); // Pass error to error handler
});

app.get('/user/:id', function(req, res, next) {
  const id = req.params.id;
  if (id === '0') {
    const err = new Error('Invalid user ID');
    err.status = 400;
    return next(err);
  }
  res.json({ id: id, name: 'User ' + id });
});

// 404 handler (must come before error handler)
app.use(function(req, res) {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler (4 parameters - must be last)
app.use(function(err, req, res, next) {
  console.error('Error:', err.message);
  
  const status = err.status || 500;
  res.status(status).json({
    error: err.message,
    status: status
  });
});

app.listen(3000);`,
    },
    {
      type: 'table',
      title: 'Middleware execution order',
      headers: ['Order', 'Middleware Type', 'Example'],
      rows: [
        ['1', 'Built-in (parsing)', 'express.json()'],
        ['2', 'Custom (logging, auth)', 'logger, requireAuth'],
        ['3', 'Route handlers', 'app.get("/", handler)'],
        ['4', '404 handler', 'app.use((req, res) => 404)'],
        ['5', 'Error handler (4 params)', 'app.use((err, req, res, next))'],
      ],
    },
    {
      type: 'note',
      title: 'Middleware order matters',
      content: 'Middleware is executed in the order it is defined. express.json() must come before routes that use req.body. Authentication middleware must come before protected routes. Error handlers must come last.',
    },
    {
      type: 'tip',
      title: 'Use next() correctly',
      content: 'If your middleware sends a response (res.send, res.json), do NOT call next(). If your middleware does NOT send a response, you MUST call next() or the request will hang. Use "return res.json(...)" to make sure you do not accidentally call next() after responding.',
    },
    {
      type: 'tryit',
      title: 'Middleware Chain Visualizer',
      css: `body{font-family:system-ui,sans-serif;padding:14px;margin:0;background:#f0f2f5;}
.pipeline{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:16px;}
.middleware{background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:10px 12px;margin-bottom:8px;display:flex;align-items:center;gap:10px;font-size:13px;transition:all 0.3s;}
.middleware.active{background:#dcfce7;border-color:#16a34a;box-shadow:0 0 0 2px rgba(22, 163, 74, 0.1);}
.middleware.passed{background:#f3f4f6;border-color:#d1d5db;}
.mw-num{background:#6b7280;color:#fff;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;}
.middleware.active .mw-num{background:#16a34a;}
.mw-name{flex:1;font-weight:600;color:#111;}
.mw-status{font-size:11px;color:#666;font-family:monospace;}
.btn-run{background:#339933;color:#fff;border:none;border-radius:8px;padding:10px 24px;font-size:14px;font-weight:700;cursor:pointer;margin-bottom:12px;}
.btn-run:hover{background:#2d7a2d;}
.output{background:#0f172a;border-radius:8px;padding:12px;margin-top:12px;min-height:60px;font-family:monospace;font-size:12px;color:#4ade80;}`,
      js: `var middlewares = [
  { name: 'express.json()', desc: 'Parse JSON body' },
  { name: 'logger', desc: 'Log request method and URL' },
  { name: 'requireAuth', desc: 'Check authentication token' },
  { name: 'Route handler', desc: 'GET /api/profile' },
  { name: 'Send response', desc: 'res.json({ user })' }
];

var current = -1;
var log = [];

function runPipeline() {
  current = -1;
  log = [];
  nextStep();
}

function nextStep() {
  if (current >= 0) {
    document.querySelector('[data-idx="' + current + '"]').classList.add('passed');
    document.querySelector('[data-idx="' + current + '"]').classList.remove('active');
  }
  current++;
  if (current < middlewares.length) {
    var mw = middlewares[current];
    log.push(current + 1 + '. ' + mw.name + ' - ' + mw.desc);
    document.querySelector('[data-idx="' + current + '"]').classList.add('active');
    document.getElementById('log-output').innerHTML = log.map(function(l, i) {
      return '<div style="color:' + (i === log.length - 1 ? '#4ade80' : '#94a3b8') + '">' + l + '</div>';
    }).join('');
    if (current < middlewares.length - 1) {
      setTimeout(nextStep, 800);
    } else {
      log.push('Response sent - pipeline complete');
      setTimeout(function() {
        document.getElementById('log-output').innerHTML = log.map(function(l) {
          return '<div style="color:#4ade80">' + l + '</div>';
        }).join('');
      }, 500);
    }
  }
}

function render() {
  var mwHtml = middlewares.map(function(mw, i) {
    return '<div class="middleware" data-idx="' + i + '">' +
      '<span class="mw-num">' + (i + 1) + '</span>' +
      '<span class="mw-name">' + mw.name + '</span>' +
      '<span class="mw-status">' + mw.desc + '</span>' +
      '</div>';
  }).join('');

  document.getElementById('output').innerHTML =
    '<div class="pipeline">' +
    '<button class="btn-run" id="btn-run">Run Request Through Pipeline</button>' +
    mwHtml +
    '<div class="output" id="log-output">Click the button to see middleware execute in order...</div>' +
    '</div>';

  document.getElementById('btn-run').addEventListener('click', function() {
    document.querySelectorAll('.middleware').forEach(function(el) {
      el.classList.remove('active', 'passed');
    });
    runPipeline();
  });
}

render();`,
    },
  ],
  exercises: [
    {
      id: 'nodejs-middleware-1',
      question: 'What happens if you forget to call next() in middleware that does not send a response?',
      type: 'multiple-choice',
      options: [
        'Express automatically calls next() for you',
        'The request hangs and eventually times out',
        'Express throws an error',
        'The route handler is skipped and a 404 is returned',
      ],
      correct: 1,
      explanation: 'If middleware does not send a response (res.send, res.json) and does not call next(), the request hangs indefinitely. The client waits until timeout. Always call next() if your middleware does not end the response.',
    },
    {
      id: 'nodejs-middleware-2',
      question: 'How many parameters does error handling middleware have in Express?',
      type: 'multiple-choice',
      options: [
        '2 parameters: (err, res)',
        '3 parameters: (req, res, next)',
        '4 parameters: (err, req, res, next)',
        '1 parameter: (err)',
      ],
      correct: 2,
      explanation: 'Error middleware has 4 parameters: (err, req, res, next). This signature is how Express identifies it as error middleware. It must come after all routes and is called when next(error) is invoked or an error is thrown.',
    },
  ],
  quiz: [
    {
      id: 'nodejs-middleware-q1',
      question: 'What is the correct order for middleware in an Express app?',
      options: [
        'Error handler -> Routes -> express.json() -> Custom middleware',
        'express.json() -> Custom middleware -> Routes -> Error handler',
        'Routes -> express.json() -> Custom middleware -> Error handler',
        'Custom middleware -> Error handler -> express.json() -> Routes',
      ],
      correct: 1,
      explanation: 'Middleware order: 1) Built-in parsing (express.json), 2) Custom middleware (logging, auth), 3) Route handlers, 4) Error handler (must be last). Middleware executes in the order it is defined with app.use().',
    },
  ],
};
