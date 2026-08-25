import type { ExpressLesson } from '../express-curriculum';

export const expressErrorHandlingLesson: ExpressLesson = {
  id: 'express-error-handling',
  title: 'Error Handling',
  slug: 'error-handling',
  chapter: 'middleware',
  order: 6,
  difficulty: 'intermediate',
  readingTime: 12,
  description: 'Error handling middleware, try/catch blocks, async error handling, custom error classes, and proper status codes.',
  sections: [
    {
      type: 'text',
      content: 'Proper error handling is crucial for building robust APIs. Express provides a built-in error handling mechanism using middleware with four parameters. Error handling middleware should always be defined last, after all other app.use() and route calls.',
    },
    {
      type: 'heading',
      content: 'Error Handling Middleware',
    },
    {
      type: 'text',
      content: 'Error handling middleware has 4 parameters: (err, req, res, next). Express recognizes it as error handling middleware because of the 4 parameters. It must be defined after all other middleware and routes.',
    },
    {
      type: 'example',
      title: 'Basic error handler',
      content: 'A simple error handling middleware that catches all errors.',
      language: 'javascript',
      code: `const express = require('express');
const app = express();

app.use(express.json());

// Regular routes
app.get('/users/:id', function(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    const error = new Error('Invalid ID');
    error.status = 400;
    throw error;
  }
  res.json({ id: id, name: 'User ' + id });
});

// Error handling middleware (must be last)
app.use(function(err, req, res, next) {
  console.error(err.stack);
  
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(status).json({
    success: false,
    error: message
  });
});

app.listen(3000);`,
    },
    {
      type: 'heading',
      content: 'Try/Catch in Routes',
    },
    {
      type: 'example',
      title: 'Catching errors in synchronous code',
      content: 'Use try/catch blocks to handle errors and pass them to error handling middleware.',
      language: 'javascript',
      code: `app.post('/users', function(req, res, next) {
  try {
    const { name, email } = req.body;
    
    // Validation
    if (!name || !email) {
      const error = new Error('Name and email are required');
      error.status = 400;
      throw error;
    }
    
    // Simulate processing
    const user = { id: Date.now(), name, email };
    res.status(201).json({ success: true, data: user });
    
  } catch (err) {
    next(err); // Pass error to error handler
  }
});`,
    },
    {
      type: 'heading',
      content: 'Async Error Handling',
    },
    {
      type: 'example',
      title: 'Handling async errors',
      content: 'For async functions, you must catch errors and pass them to next().',
      language: 'javascript',
      code: `// Without async wrapper - manual error handling
app.get('/users/:id', async function(req, res, next) {
  try {
    const user = await db.findUser(req.params.id);
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

// With async wrapper - cleaner
function asyncHandler(fn) {
  return function(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

app.get('/posts/:id', asyncHandler(async function(req, res) {
  const post = await db.findPost(req.params.id);
  if (!post) {
    const error = new Error('Post not found');
    error.status = 404;
    throw error;
  }
  res.json({ success: true, data: post });
}));`,
    },
    {
      type: 'heading',
      content: 'Custom Error Classes',
    },
    {
      type: 'example',
      title: 'Creating custom error types',
      content: 'Custom error classes make error handling more organized and maintainable.',
      language: 'javascript',
      code: `class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.isOperational = true;
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(resource + ' not found', 404);
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

// Usage in routes
app.get('/users/:id', async function(req, res, next) {
  try {
    const user = await db.findUser(req.params.id);
    if (!user) {
      throw new NotFoundError('User');
    }
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

app.post('/users', function(req, res, next) {
  try {
    if (!req.body.email) {
      throw new ValidationError('Email is required');
    }
    // Create user...
  } catch (err) {
    next(err);
  }
});`,
    },
    {
      type: 'heading',
      content: 'Production Error Handler',
    },
    {
      type: 'example',
      title: 'Environment-aware error handler',
      content: 'Show detailed errors in development, hide details in production.',
      language: 'javascript',
      code: `app.use(function(err, req, res, next) {
  console.error(err.stack);
  
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  const response = {
    success: false,
    error: message
  };
  
  // Include stack trace only in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }
  
  res.status(status).json(response);
});`,
    },
    {
      type: 'warning',
      title: 'Always define error handler last',
      content: 'Error handling middleware must be defined after all other middleware and routes. If you define it before your routes, it will not catch errors from those routes.',
    },
    {
      type: 'tryit',
      title: 'Error Handling Simulator',
      css: `body{font-family:system-ui,sans-serif;padding:20px;margin:0;background:#f5f5f5;}
.simulator{max-width:800px;margin:0 auto;}
.panel{background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);margin-bottom:16px;}
.panel-header{background:#000;color:#fff;padding:14px 20px;font-size:15px;font-weight:700;}
.panel-body{padding:20px;}
.test-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:16px;}
.test-btn{padding:14px;background:#f8f8f8;border:2px solid #ddd;border-radius:8px;text-align:left;cursor:pointer;transition:all 0.2s;}
.test-btn:hover{background:#000;color:#fff;border-color:#000;}
.test-btn-title{font-weight:700;font-size:13px;margin-bottom:4px;}
.test-btn-desc{font-size:11px;opacity:0.7;}
.test-btn:hover .test-btn-desc{opacity:0.9;}
.output{background:#1a1a1a;color:#4ade80;padding:16px;border-radius:8px;font-family:monospace;font-size:12px;white-space:pre-wrap;min-height:100px;}
.error-line{color:#ef4444;}
.success-line{color:#4ade80;}
.info-line{color:#60a5fa;}
.warn-line{color:#fbbf24;}`,
      js: `var tests = [
  { 
    title: 'Valid Request',
    desc: 'Successful user creation',
    type: 'success',
    output: 'POST /users\ HTTP/200 OK\ {\   "success": true,\   "data": { "id": 1, "name": "Alice" }\ }'
  },
  {
    title: 'Validation Error',
    desc: 'Missing required fields',
    type: 'error',
    output: 'POST /users\ HTTP/400 Bad Request\ {\   "success": false,\   "error": "Name and email are required"\ }'
  },
  {
    title: 'Not Found',
    desc: 'Resource does not exist',
    type: 'error',
    output: 'GET /users/999\ HTTP/404 Not Found\ {\   "success": false,\   "error": "User not found"\ }'
  },
  {
    title: 'Server Error',
    desc: 'Database connection failed',
    type: 'error',
    output: 'GET /users\ HTTP/500 Internal Server Error\ {\   "success": false,\   "error": "Database connection failed"\ }\ \ Stack trace (dev only):\   at db.connect (/app/db.js:45:10)\   at getUsersHandler (/app/routes.js:12:5)'
  },
  {
    title: 'Invalid ID',
    desc: 'Bad parameter format',
    type: 'error',
    output: 'GET /users/abc\ HTTP/400 Bad Request\ {\   "success": false,\   "error": "Invalid ID format"\ }'
  },
  {
    title: 'Unauthorized',
    desc: 'Missing auth token',
    type: 'error',
    output: 'GET /admin\ HTTP/401 Unauthorized\ {\   "success": false,\   "error": "Authentication required"\ }'
  }
];

function runTest(idx) {
  var test = tests[idx];
  var lines = test.output.split('\ ');
  var output = '';
  
  lines.forEach(function(line) {
    var cls = 'info-line';
    if (line.includes('200 OK')) cls = 'success-line';
    else if (line.match(/4\\d\\d|5\\d\\d/)) cls = 'error-line';
    else if (line.includes('Stack trace')) cls = 'warn-line';
    
    output += '<div class="' + cls + '">' + line + '</div>';
  });
  
  document.getElementById('output').innerHTML = output;
}

function render() {
  var buttonsHtml = tests.map(function(test, i) {
    return '<div class="test-btn" data-idx="' + i + '">' +
      '<div class="test-btn-title">' + test.title + '</div>' +
      '<div class="test-btn-desc">' + test.desc + '</div>' +
      '</div>';
  }).join('');
  
  document.getElementById('output').innerHTML =
    '<div class="simulator">' +
    '<div class="panel">' +
    '<div class="panel-header">Error Handling Test Cases</div>' +
    '<div class="panel-body">' +
    '<div class="test-grid">' + buttonsHtml + '</div>' +
    '</div>' +
    '</div>' +
    '<div class="panel">' +
    '<div class="panel-header">Response Output</div>' +
    '<div class="panel-body">' +
    '<div class="output" id="output">Click any test case to see the error handling response...</div>' +
    '</div>' +
    '</div>' +
    '</div>';
  
  document.querySelectorAll('[data-idx]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      runTest(parseInt(btn.getAttribute('data-idx')));
    });
  });
}

render();`,
    },
  ],
  exercises: [
    {
      id: 'express-error-1',
      question: 'How many parameters does error handling middleware have?',
      type: 'multiple-choice',
      options: [
        '2 (err, res)',
        '3 (req, res, next)',
        '4 (err, req, res, next)',
        '1 (err)',
      ],
      correct: 2,
      explanation: 'Error handling middleware must have exactly 4 parameters: (err, req, res, next). Express identifies error handling middleware by the number of parameters.',
    },
    {
      id: 'express-error-2',
      question: 'Where should error handling middleware be defined?',
      type: 'multiple-choice',
      options: [
        'At the very beginning, before all routes',
        'Anywhere in the middleware chain',
        'After all routes and other middleware',
        'It does not matter',
      ],
      correct: 2,
      explanation: 'Error handling middleware must be defined last, after all other app.use() and route definitions. If defined before routes, it will not catch errors from those routes.',
    },
  ],
  quiz: [
    {
      id: 'express-error-q1',
      question: 'How do you pass an error to error handling middleware?',
      options: [
        'throw new Error()',
        'res.error(err)',
        'next(err)',
        'app.error(err)',
      ],
      correct: 2,
      explanation: 'Call next(err) to pass errors to error handling middleware. If you call next() with an argument, Express skips all remaining non-error middleware and goes directly to error handling middleware.',
    },
  ],
};
