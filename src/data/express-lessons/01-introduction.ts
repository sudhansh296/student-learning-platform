import type { ExpressLesson } from '../express-curriculum';

export const expressIntroLesson: ExpressLesson = {
  id: 'express-introduction',
  title: 'Introduction to Express.js',
  slug: 'introduction',
  chapter: 'intro',
  order: 1,
  difficulty: 'beginner',
  readingTime: 10,
  description: 'What Express.js is, why use it, installation, and your first Express server.',
  sections: [
    {
      type: 'text',
      content: 'Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. It simplifies the process of building server-side applications by providing a thin layer of fundamental web application features without obscuring Node.js features.',
    },
    {
      type: 'analogy',
      title: 'Express is like a kitchen toolkit',
      content: 'Node.js gives you the raw ingredients and a stove. Express provides you with knives, pans, and utensils - tools that make cooking easier without changing what you can cook. You still have full control, but common tasks become much simpler.',
    },
    {
      type: 'heading',
      content: 'Why Use Express?',
    },
    {
      type: 'list',
      items: [
        'Simple routing - Define routes with clean, readable syntax',
        'Middleware support - Modular request processing pipeline',
        'Template engine integration - Render dynamic HTML pages',
        'Robust API - Build RESTful APIs quickly',
        'Large ecosystem - Thousands of middleware packages available',
        'Minimal and unopinionated - Choose your own architecture',
      ],
    },
    {
      type: 'heading',
      content: 'Installation',
    },
    {
      type: 'example',
      title: 'Setting up Express',
      content: 'Create a new Node.js project and install Express as a dependency.',
      language: 'bash',
      code: `# Create project directory
mkdir my-express-app
cd my-express-app

# Initialize Node.js project
npm init -y

# Install Express
npm install express`,
    },
    {
      type: 'heading',
      content: 'Your First Express Server',
    },
    {
      type: 'example',
      title: 'Basic Express server',
      content: 'This is the simplest Express server - it listens on port 3000 and responds with "Hello Express!" to all GET requests.',
      language: 'javascript',
      code: `const express = require('express');
const app = express();

app.get('/', function(req, res) {
  res.send('Hello Express!');
});

app.listen(3000, function() {
  console.log('Server running on http://localhost:3000');
});`,
      output: 'Server running on http://localhost:3000',
    },
    {
      type: 'example',
      title: 'Multiple routes',
      content: 'You can define multiple routes for different paths. Each route can return different content.',
      language: 'javascript',
      code: `const express = require('express');
const app = express();

app.get('/', function(req, res) {
  res.send('Home Page');
});

app.get('/about', function(req, res) {
  res.send('About Page');
});

app.get('/api/users', function(req, res) {
  res.json({ users: ['Alice', 'Bob', 'Charlie'] });
});

app.listen(3000);`,
    },
    {
      type: 'tip',
      title: 'Use nodemon for development',
      content: 'Install nodemon as a dev dependency (npm install --save-dev nodemon) and add a script "dev": "nodemon server.js" to your package.json. This automatically restarts your server when you save changes.',
    },
    {
      type: 'heading',
      content: 'Express Application Object',
    },
    {
      type: 'table',
      headers: ['Method', 'Purpose', 'Example'],
      rows: [
        ['app.get()', 'Handle GET requests', 'app.get("/users", handler)'],
        ['app.post()', 'Handle POST requests', 'app.post("/users", handler)'],
        ['app.put()', 'Handle PUT requests', 'app.put("/users/:id", handler)'],
        ['app.delete()', 'Handle DELETE requests', 'app.delete("/users/:id", handler)'],
        ['app.use()', 'Add middleware', 'app.use(express.json())'],
        ['app.listen()', 'Start server', 'app.listen(3000, callback)'],
      ],
    },
    {
      type: 'tryit',
      title: 'Express Server Simulator',
      css: `body{font-family:system-ui,sans-serif;padding:16px;margin:0;background:#f5f5f5;}
.server-box{max-width:700px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1);}
.header{background:#000;color:#fff;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;}
.header h2{margin:0;font-size:18px;font-weight:700;}
.status{display:flex;align-items:center;gap:8px;font-size:13px;}
.dot{width:8px;height:8px;border-radius:50%;background:#4ade80;animation:pulse 2s infinite;}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
.routes{padding:20px;}
.route-item{background:#f8f9fa;border:1px solid #e9ecef;border-radius:8px;padding:12px 16px;margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;}
.route-left{display:flex;align-items:center;gap:12px;}
.method{padding:4px 12px;border-radius:6px;font-size:11px;font-weight:700;color:#fff;background:#000;}
.path{font-family:monospace;font-size:14px;color:#333;}
.test-btn{background:#000;color:#fff;border:none;padding:8px 16px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;}
.test-btn:hover{background:#333;}
.output-box{background:#1a1a1a;color:#4ade80;padding:16px;font-family:monospace;font-size:13px;min-height:80px;border-top:2px solid #000;}
.response-line{margin:4px 0;}
.req-line{color:#60a5fa;}`,
      js: `var routes = [
  { method: 'GET', path: '/', response: 'Home Page' },
  { method: 'GET', path: '/about', response: 'About Page' },
  { method: 'GET', path: '/api/users', response: '{"users":["Alice","Bob","Charlie"]}' },
  { method: 'GET', path: '/contact', response: 'Contact Page' }
];

var logs = [];

function testRoute(idx) {
  var route = routes[idx];
  var timestamp = new Date().toLocaleTimeString();
  logs.unshift({
    req: route.method + ' ' + route.path,
    res: 'HTTP/200 ' + route.response,
    time: timestamp
  });
  if (logs.length > 4) logs.pop();
  renderOutput();
}

function renderOutput() {
  var logHtml = logs.map(function(log) {
    return '<div class="response-line req-line">[' + log.time + '] ' + log.req + '</div>' +
           '<div class="response-line">' + log.res + '</div>';
  }).join('');
  
  document.getElementById('logs').innerHTML = logHtml || '<span style="color:#888">Click any Test button to simulate a request...</span>';
}

function render() {
  var routeHtml = routes.map(function(route, i) {
    return '<div class="route-item">' +
      '<div class="route-left">' +
      '<span class="method">' + route.method + '</span>' +
      '<span class="path">' + route.path + '</span>' +
      '</div>' +
      '<button class="test-btn" data-idx="' + i + '">Test</button>' +
      '</div>';
  }).join('');

  document.getElementById('output').innerHTML =
    '<div class="server-box">' +
    '<div class="header">' +
    '<h2>Express Server</h2>' +
    '<div class="status"><span class="dot"></span>Running on port 3000</div>' +
    '</div>' +
    '<div class="routes">' + routeHtml + '</div>' +
    '<div class="output-box" id="logs"></div>' +
    '</div>';

  document.querySelectorAll('[data-idx]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      testRoute(parseInt(btn.getAttribute('data-idx')));
    });
  });
}

render();
renderOutput();`,
    },
  ],
  exercises: [
    {
      id: 'express-intro-1',
      question: 'What is the purpose of the express() function?',
      type: 'multiple-choice',
      options: [
        'It installs the Express package',
        'It creates an Express application instance',
        'It starts the server',
        'It defines a route',
      ],
      correct: 1,
      explanation: 'The express() function creates a new Express application instance. You typically store it in a variable called "app" and use it to define routes and middleware.',
    },
    {
      id: 'express-intro-2',
      question: 'Which method is used to start the Express server?',
      type: 'multiple-choice',
      options: [
        'app.start()',
        'app.run()',
        'app.listen()',
        'app.serve()',
      ],
      correct: 2,
      explanation: 'app.listen(port, callback) starts the Express server on the specified port. The callback function is optional and runs once the server starts.',
    },
  ],
  quiz: [
    {
      id: 'express-intro-q1',
      question: 'What happens if you define two routes with the same path and method?',
      options: [
        'Express throws an error',
        'Only the first route handler is executed',
        'Both handlers execute in sequence',
        'The second route overrides the first',
      ],
      correct: 1,
      explanation: 'Express executes the first matching route handler. If you define multiple routes with the same path and method, only the first one will handle the request unless you explicitly call next().',
    },
  ],
};
