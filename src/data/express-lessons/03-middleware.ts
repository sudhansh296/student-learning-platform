import type { ExpressLesson } from '../express-curriculum';

export const expressMiddlewareLesson: ExpressLesson = {
  id: 'express-middleware',
  title: 'Middleware',
  slug: 'middleware',
  chapter: 'middleware',
  order: 3,
  difficulty: 'intermediate',
  readingTime: 14,
  description: 'Understanding middleware, app.use(), middleware chain, next() function, and creating custom middleware.',
  sections: [
    {
      type: 'text',
      content: 'Middleware functions are functions that have access to the request object (req), response object (res), and the next middleware function in the application request-response cycle. Middleware can execute code, modify req and res objects, end the request-response cycle, or call the next middleware.',
    },
    {
      type: 'analogy',
      title: 'Middleware is like airport security',
      content: 'When you travel, you go through multiple checkpoints: check-in, security screening, passport control, and boarding. Each checkpoint (middleware) can inspect you, add information to your boarding pass, stop you if something is wrong, or pass you to the next checkpoint. Express middleware works the same way with HTTP requests.',
    },
    {
      type: 'heading',
      content: 'How Middleware Works',
    },
    {
      type: 'list',
      items: [
        'Middleware functions execute in order they are defined',
        'Each middleware receives req, res, and next parameters',
        'Middleware can modify req and res objects',
        'Must call next() to pass control to next middleware',
        'If next() is not called, request hangs',
        'Can end request-response cycle with res.send(), res.json(), etc.',
      ],
    },
    {
      type: 'example',
      title: 'Basic middleware',
      content: 'A simple middleware that logs every request. It uses next() to pass control to the next middleware.',
      language: 'javascript',
      code: `const express = require('express');
const app = express();

// Middleware function
function logger(req, res, next) {
  console.log(req.method + ' ' + req.url);
  next(); // Pass control to next middleware
}

// Register middleware with app.use()
app.use(logger);

app.get('/', function(req, res) {
  res.send('Home Page');
});

app.get('/about', function(req, res) {
  res.send('About Page');
});

app.listen(3000);`,
      output: 'GET /\\nGET /about',
    },
    {
      type: 'heading',
      content: 'Types of Middleware',
    },
    {
      type: 'table',
      headers: ['Type', 'Description', 'Example'],
      rows: [
        ['Application-level', 'Bound to app instance', 'app.use(middleware)'],
        ['Router-level', 'Bound to express.Router()', 'router.use(middleware)'],
        ['Error-handling', '4 parameters (err, req, res, next)', 'app.use(errorHandler)'],
        ['Built-in', 'Provided by Express', 'express.json()'],
        ['Third-party', 'npm packages', 'morgan, cors, helmet'],
      ],
    },
    {
      type: 'example',
      title: 'Multiple middleware',
      content: 'You can chain multiple middleware functions. They execute in order.',
      language: 'javascript',
      code: `const express = require('express');
const app = express();

// First middleware - logging
app.use(function(req, res, next) {
  console.log('Time:', Date.now());
  next();
});

// Second middleware - authentication check
app.use(function(req, res, next) {
  req.isAuthenticated = true; // Simplified example
  next();
});

// Third middleware - JSON parsing
app.use(express.json());

// Route handler
app.get('/users', function(req, res) {
  if (!req.isAuthenticated) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json({ users: ['Alice', 'Bob'] });
});

app.listen(3000);`,
    },
    {
      type: 'heading',
      content: 'Path-Specific Middleware',
    },
    {
      type: 'example',
      title: 'Middleware for specific routes',
      content: 'You can apply middleware only to specific paths or routes.',
      language: 'javascript',
      code: `// Middleware only for /api routes
app.use('/api', function(req, res, next) {
  console.log('API request:', req.url);
  next();
});

// Middleware as route parameter
function requireAuth(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'No token' });
  }
  next();
}

// Apply to specific route
app.get('/admin', requireAuth, function(req, res) {
  res.send('Admin Page');
});

// Apply multiple middleware to one route
app.post('/users',
  requireAuth,
  validateUser,
  function(req, res) {
    res.json({ message: 'User created' });
  }
);`,
    },
    {
      type: 'heading',
      content: 'Common Built-in Middleware',
    },
    {
      type: 'example',
      title: 'Built-in middleware',
      content: 'Express includes several useful middleware functions.',
      language: 'javascript',
      code: `const express = require('express');
const app = express();

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies (form data)
app.use(express.urlencoded({ extended: true }));

// Serve static files from "public" directory
app.use(express.static('public'));

// Now you can access req.body in routes
app.post('/users', function(req, res) {
  console.log(req.body); // { name: "Alice", email: "alice@example.com" }
  res.json({ received: req.body });
});

app.listen(3000);`,
    },
    {
      type: 'warning',
      title: 'Always call next() or end the response',
      content: 'If your middleware does not send a response, you MUST call next(). Otherwise, the request will hang and the client will wait indefinitely until timeout.',
    },
    {
      type: 'tip',
      title: 'Error handling in middleware',
      content: 'Pass errors to error-handling middleware by calling next(err). Error-handling middleware has 4 parameters: (err, req, res, next).',
    },
    {
      type: 'tryit',
      title: 'Middleware Pipeline Visualizer',
      css: `body{font-family:system-ui,sans-serif;padding:20px;margin:0;background:#f0f0f0;}
.pipeline{max-width:800px;margin:0 auto;}
.header{background:#000;color:#fff;padding:14px 20px;border-radius:10px 10px 0 0;font-size:16px;font-weight:700;}
.flow{background:#fff;border:1px solid #ddd;border-top:none;padding:20px;}
.middleware-item{background:#f8f8f8;border:2px solid #000;border-radius:8px;padding:14px 18px;margin-bottom:12px;position:relative;}
.middleware-item.active{background:#000;color:#fff;border-color:#000;}
.middleware-item.done{background:#e8f5e9;border-color:#4caf50;}
.mw-title{font-weight:700;font-size:14px;margin-bottom:4px;}
.mw-desc{font-size:12px;opacity:0.8;}
.arrow{text-align:center;font-size:20px;color:#000;margin:8px 0;}
.route-handler{background:#fff3cd;border:2px solid #ffc107;border-radius:8px;padding:14px 18px;font-weight:700;font-size:14px;}
.controls{background:#fff;border:1px solid #ddd;border-top:none;border-radius:0 0 10px 10px;padding:16px;display:flex;gap:10px;justify-content:center;}
.btn{padding:10px 24px;border:none;border-radius:6px;font-weight:700;cursor:pointer;font-size:14px;}
.btn-run{background:#000;color:#fff;}
.btn-run:hover{background:#333;}
.btn-reset{background:#ddd;color:#333;}
.btn-reset:hover{background:#ccc;}
.log-box{background:#1a1a1a;color:#4ade80;padding:12px;border-radius:6px;margin-top:12px;font-family:monospace;font-size:12px;min-height:60px;}`,
      js: `var middlewares = [
  { name: 'Logger', desc: 'Logs request method and URL', done: false },
  { name: 'CORS', desc: 'Sets CORS headers', done: false },
  { name: 'JSON Parser', desc: 'Parses JSON body', done: false },
  { name: 'Auth Check', desc: 'Validates authentication', done: false }
];

var currentStep = -1;
var logs = [];
var running = false;

function runPipeline() {
  if (running) return;
  running = true;
  logs = [];
  currentStep = -1;
  
  var interval = setInterval(function() {
    currentStep++;
    
    if (currentStep < middlewares.length) {
      middlewares[currentStep].done = true;
      logs.push('[Middleware ' + (currentStep + 1) + '] ' + middlewares[currentStep].name + ' executed');
      logs.push('  -> Calling next()');
      render();
    } else if (currentStep === middlewares.length) {
      logs.push('[Route Handler] Processing request');
      logs.push('  -> Sending response');
      render();
    } else {
      clearInterval(interval);
      logs.push('[Complete] Response sent to client');
      running = false;
      render();
    }
  }, 800);
}

function reset() {
  middlewares.forEach(function(mw) { mw.done = false; });
  currentStep = -1;
  logs = [];
  running = false;
  render();
}

function render() {
  var mwHtml = middlewares.map(function(mw, i) {
    var cls = 'middleware-item';
    if (i === currentStep) cls += ' active';
    else if (mw.done) cls += ' done';
    
    return '<div class="' + cls + '">' +
      '<div class="mw-title">' + (i + 1) + '. ' + mw.name + '</div>' +
      '<div class="mw-desc">' + mw.desc + '</div>' +
      '</div>' +
      (i < middlewares.length - 1 ? '<div class="arrow">↓</div>' : '');
  }).join('');
  
  var logHtml = logs.map(function(log) {
    return '<div>' + log + '</div>';
  }).join('') || 'Click Run to start the middleware pipeline...';
  
  document.getElementById('output').innerHTML =
    '<div class="pipeline">' +
    '<div class="header">Express Middleware Pipeline</div>' +
    '<div class="flow">' +
    mwHtml +
    '<div class="arrow">↓</div>' +
    '<div class="route-handler">Route Handler: GET /users</div>' +
    '<div class="log-box">' + logHtml + '</div>' +
    '</div>' +
    '<div class="controls">' +
    '<button class="btn btn-run" onclick="runPipeline()" ' + (running ? 'disabled' : '') + '>Run Pipeline</button>' +
    '<button class="btn btn-reset" onclick="reset()">Reset</button>' +
    '</div>' +
    '</div>';
}

render();`,
    },
  ],
  exercises: [
    {
      id: 'express-middleware-1',
      question: 'What happens if you forget to call next() in middleware?',
      type: 'multiple-choice',
      options: [
        'Express automatically calls the next middleware',
        'The request hangs and times out',
        'Express throws an error',
        'The route handler executes anyway',
      ],
      correct: 1,
      explanation: 'If you do not call next() and do not send a response, the request will hang because Express is waiting for you to either pass control to the next middleware or send a response.',
    },
    {
      id: 'express-middleware-2',
      question: 'What is the purpose of express.json() middleware?',
      type: 'multiple-choice',
      options: [
        'It sends JSON responses',
        'It parses incoming JSON request bodies',
        'It validates JSON syntax',
        'It compresses JSON data',
      ],
      correct: 1,
      explanation: 'express.json() is a built-in middleware that parses incoming requests with JSON payloads and makes the data available in req.body.',
    },
  ],
  quiz: [
    {
      id: 'express-middleware-q1',
      question: 'In what order do middleware functions execute?',
      options: [
        'Randomly',
        'In the order they are defined with app.use()',
        'Alphabetically by function name',
        'Most specific routes first',
      ],
      correct: 1,
      explanation: 'Middleware functions execute in the exact order they are registered with app.use(). This is why the order of middleware matters - for example, you need to parse the body before validating it.',
    },
  ],
};
