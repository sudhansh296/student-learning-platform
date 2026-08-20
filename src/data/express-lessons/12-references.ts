import type { ExpressLesson } from '../express-curriculum';

export const expressReferencesLesson: ExpressLesson = {
  id: 'express-references',
  title: 'Express Reference Guide',
  slug: 'references',
  chapter: 'advanced',
  order: 12,
  difficulty: 'beginner',
  readingTime: 8,
  description: 'Quick reference guide, cheat sheet, best practices, and additional resources for Express.js.',
  sections: [
    {
      type: 'text',
      content: 'This reference guide provides a quick overview of common Express patterns, best practices, and useful resources for continued learning.',
    },
    {
      type: 'heading',
      content: 'Express Cheat Sheet',
    },
    {
      type: 'table',
      headers: ['Category', 'Code', 'Description'],
      rows: [
        ['Setup', 'const app = express()', 'Create Express app'],
        ['Setup', 'app.listen(3000)', 'Start server on port 3000'],
        ['Middleware', 'app.use(middleware)', 'Add application middleware'],
        ['Middleware', 'app.use(express.json())', 'Parse JSON bodies'],
        ['Middleware', 'app.use(express.static("public"))', 'Serve static files'],
        ['Routing', 'app.get("/path", handler)', 'Handle GET requests'],
        ['Routing', 'app.post("/path", handler)', 'Handle POST requests'],
        ['Routing', 'app.put("/path", handler)', 'Handle PUT requests'],
        ['Routing', 'app.delete("/path", handler)', 'Handle DELETE requests'],
        ['Request', 'req.params', 'URL route parameters'],
        ['Request', 'req.query', 'URL query strings'],
        ['Request', 'req.body', 'Request body data'],
        ['Request', 'req.headers', 'Request headers'],
        ['Response', 'res.send(data)', 'Send response'],
        ['Response', 'res.json(obj)', 'Send JSON response'],
        ['Response', 'res.status(code)', 'Set status code'],
        ['Response', 'res.redirect(url)', 'Redirect to URL'],
        ['Response', 'res.render(view, data)', 'Render template'],
      ],
    },
    {
      type: 'heading',
      content: 'Common Status Codes',
    },
    {
      type: 'table',
      headers: ['Code', 'Name', 'Use Case'],
      rows: [
        ['200', 'OK', 'Successful GET, PUT, PATCH'],
        ['201', 'Created', 'Successful POST'],
        ['204', 'No Content', 'Successful DELETE'],
        ['400', 'Bad Request', 'Invalid input'],
        ['401', 'Unauthorized', 'Authentication required'],
        ['403', 'Forbidden', 'Not allowed'],
        ['404', 'Not Found', 'Resource not found'],
        ['500', 'Internal Server Error', 'Server error'],
      ],
    },
    {
      type: 'heading',
      content: 'Best Practices',
    },
    {
      type: 'list',
      items: [
        'Use environment variables for configuration (dotenv)',
        'Implement proper error handling with error middleware',
        'Validate all user input on the server',
        'Use helmet for security headers',
        'Enable CORS only for trusted origins',
        'Use compression middleware for better performance',
        'Log requests with morgan or similar',
        'Use async/await with try/catch for async operations',
        'Structure your app with routers for organization',
        'Use parameterized queries to prevent SQL injection',
        'Hash passwords with bcrypt',
        'Rate limit API endpoints to prevent abuse',
        'Use HTTPS in production',
      ],
    },
    {
      type: 'heading',
      content: 'Essential Middleware',
    },
    {
      type: 'example',
      title: 'Production-ready Express app setup',
      content: 'This shows a production-grade server setup that layers helmet for HTTP security headers, CORS for cross-origin control, morgan for request logging, compression for gzip responses, and rate limiting to block abusive clients — all applied before any route handlers run.',
      language: 'javascript',
      code: `const express = require('express');
const helmet = require('helmet'); // Security headers
const cors = require('cors'); // Cross-origin requests
const morgan = require('morgan'); // Logging
const compression = require('compression'); // Gzip compression
const rateLimit = require('express-rate-limit'); // Rate limiting

const app = express();

// Security
app.use(helmet());

// CORS
app.use(cors({
  origin: 'https://yourdomain.com'
}));

// Logging
app.use(morgan('combined'));

// Compression
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Your routes here
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// Error handler (must be last)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,
    },
    {
      type: 'heading',
      content: 'Project Structure',
    },
    {
      type: 'example',
      title: 'Recommended folder structure',
      content: 'A well-organized folder structure separates concerns so each file has one responsibility: routes define URL patterns, controllers contain business logic, models define data schemas, and middleware handles cross-cutting concerns like auth and validation.',
      language: 'text',
      code: `my-express-app/
├── src/
│   ├── routes/
│   │   ├── users.js
│   │   ├── posts.js
│   │   └── index.js
│   ├── controllers/
│   │   ├── userController.js
│   │   └── postController.js
│   ├── models/
│   │   ├── User.js
│   │   └── Post.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validate.js
│   ├── config/
│   │   └── database.js
│   └── app.js
├── public/
│   ├── css/
│   ├── js/
│   └── images/
├── views/
│   └── index.ejs
├── .env
├── .gitignore
├── package.json
└── server.js`,
    },
    {
      type: 'heading',
      content: 'Learning Resources',
    },
    {
      type: 'list',
      items: [
        'Official Express documentation: expressjs.com',
        'Express GitHub repository: github.com/expressjs/express',
        'MDN Web Docs: developer.mozilla.org',
        'Node.js documentation: nodejs.org/docs',
        'Express middleware list: expressjs.com/en/resources/middleware.html',
      ],
    },
    {
      type: 'tip',
      title: 'Keep learning',
      content: 'The best way to learn Express is to build projects. Start with simple APIs and gradually add features like authentication, database integration, and real-time functionality with Socket.io.',
    },
    {
      type: 'tryit',
      title: 'Quick Reference Search',
      css: `body{font-family:system-ui,sans-serif;padding:20px;margin:0;background:#f0f0f0;}
.ref{max-width:800px;margin:0 auto;}
.panel{background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);}
.panel-header{background:#000;color:#fff;padding:14px 20px;font-size:16px;font-weight:700;}
.panel-body{padding:20px;}
.search-box{width:100%;padding:12px 16px;border:2px solid #ddd;border-radius:8px;font-size:14px;margin-bottom:16px;}
.search-box:focus{outline:none;border-color:#000;}
.ref-item{background:#f8f8f8;border:1px solid #e0e0e0;border-radius:8px;padding:14px;margin-bottom:10px;}
.ref-item.hidden{display:none;}
.ref-title{font-weight:700;font-size:14px;color:#000;margin-bottom:6px;}
.ref-code{background:#1a1a1a;color:#4ade80;padding:8px 12px;border-radius:6px;font-family:monospace;font-size:12px;margin:6px 0;}
.ref-desc{font-size:12px;color:#555;margin-top:6px;}
.no-results{text-align:center;color:#888;padding:20px;font-size:14px;}`,
      js: `var references = [
  { title: 'Create Express App', code: 'const app = express()', desc: 'Initialize Express application' },
  { title: 'Start Server', code: 'app.listen(3000)', desc: 'Start listening on port 3000' },
  { title: 'GET Route', code: 'app.get("/path", (req, res) => {})', desc: 'Handle GET requests' },
  { title: 'POST Route', code: 'app.post("/path", (req, res) => {})', desc: 'Handle POST requests' },
  { title: 'JSON Parsing', code: 'app.use(express.json())', desc: 'Parse JSON request bodies' },
  { title: 'Static Files', code: 'app.use(express.static("public"))', desc: 'Serve static files' },
  { title: 'Route Parameters', code: 'req.params.id', desc: 'Access URL parameters' },
  { title: 'Query Strings', code: 'req.query.search', desc: 'Access query parameters' },
  { title: 'Request Body', code: 'req.body', desc: 'Access POST/PUT body data' },
  { title: 'Send JSON', code: 'res.json({ data })', desc: 'Send JSON response' },
  { title: 'Set Status', code: 'res.status(404)', desc: 'Set HTTP status code' },
  { title: 'Redirect', code: 'res.redirect("/path")', desc: 'Redirect to another URL' },
  { title: 'Middleware', code: 'app.use(middleware)', desc: 'Add application middleware' },
  { title: 'Error Handler', code: 'app.use((err, req, res, next) => {})', desc: '4-param error middleware' }
];

function search() {
  var query = document.getElementById('search').value.toLowerCase();
  var items = document.querySelectorAll('.ref-item');
  var visible = 0;
  
  items.forEach(function(item, i) {
    var text = references[i].title.toLowerCase() + ' ' + 
               references[i].code.toLowerCase() + ' ' + 
               references[i].desc.toLowerCase();
    
    if (text.includes(query)) {
      item.classList.remove('hidden');
      visible++;
    } else {
      item.classList.add('hidden');
    }
  });
  
  var noResults = document.getElementById('noResults');
  if (visible === 0 && query) {
    noResults.style.display = 'block';
  } else {
    noResults.style.display = 'none';
  }
}

var html = '<div class="ref"><div class="panel">' +
  '<div class="panel-header">Express Quick Reference</div>' +
  '<div class="panel-body">' +
  '<input id="search" class="search-box" placeholder="Search references... (e.g., json, route, middleware)" oninput="search()">';

references.forEach(function(ref) {
  html += '<div class="ref-item">' +
    '<div class="ref-title">' + ref.title + '</div>' +
    '<div class="ref-code">' + ref.code + '</div>' +
    '<div class="ref-desc">' + ref.desc + '</div>' +
    '</div>';
});

html += '<div id="noResults" class="no-results" style="display:none">No results found</div>';
html += '</div></div></div>';

document.getElementById('output').innerHTML = html;`,
    },
  ],
  exercises: [
    {
      id: 'express-ref-1',
      question: 'What is the purpose of helmet middleware?',
      type: 'multiple-choice',
      options: [
        'To parse JSON',
        'To add security headers to responses',
        'To handle errors',
        'To compress responses',
      ],
      correct: 1,
      explanation: 'Helmet helps secure Express apps by setting various HTTP security headers like X-Frame-Options, X-XSS-Protection, and Content-Security-Policy.',
    },
    {
      id: 'express-ref-2',
      question: 'What does morgan middleware do?',
      type: 'multiple-choice',
      options: [
        'Validates input',
        'Logs HTTP requests',
        'Handles errors',
        'Parses JSON',
      ],
      correct: 1,
      explanation: 'Morgan is a logging middleware that logs HTTP requests to the console or a file, useful for debugging and monitoring.',
    },
  ],
  quiz: [
    {
      id: 'express-ref-q1',
      question: 'What is the recommended way to handle sensitive configuration in Express apps?',
      options: [
        'Hardcode values in the source code',
        'Use environment variables',
        'Store in a public JSON file',
        'Pass as command-line arguments',
      ],
      correct: 1,
      explanation: 'Use environment variables (with dotenv for development) to store sensitive configuration like API keys, database URLs, and secrets. Never commit these to version control.',
    },
  ],
};
