import type { ExpressLesson } from '../express-curriculum';

export const expressStaticFilesLesson: ExpressLesson = {
  id: 'express-static-files',
  title: 'Serving Static Files',
  slug: 'static-files',
  chapter: 'middleware',
  order: 7,
  difficulty: 'beginner',
  readingTime: 10,
  description: 'Using express.static() to serve HTML, CSS, JavaScript, images, and other static assets.',
  sections: [
    {
      type: 'text',
      content: 'Express provides a built-in middleware function, express.static(), to serve static files such as HTML, CSS, JavaScript, images, and other assets. This is essential for serving the frontend of your application.',
    },
    {
      type: 'heading',
      content: 'Basic Static File Serving',
    },
    {
      type: 'example',
      title: 'Serving files from a directory',
      content: 'Use express.static() to serve all files in a directory.',
      language: 'javascript',
      code: `const express = require('express');
const app = express();

// Serve static files from "public" directory
app.use(express.static('public'));

// Now files in public/ are accessible:
// public/index.html -> http://localhost:3000/index.html
// public/css/style.css -> http://localhost:3000/css/style.css
// public/js/app.js -> http://localhost:3000/js/app.js
// public/images/logo.png -> http://localhost:3000/images/logo.png

app.listen(3000);`,
    },
    {
      type: 'heading',
      content: 'Virtual Path Prefix',
    },
    {
      type: 'example',
      title: 'Adding a URL prefix',
      content: 'You can mount the static directory at a specific URL path.',
      language: 'javascript',
      code: `// Serve files at /static path
app.use('/static', express.static('public'));

// Now files are accessed with /static prefix:
// public/index.html -> http://localhost:3000/static/index.html
// public/css/style.css -> http://localhost:3000/static/css/style.css

// Multiple static directories
app.use('/assets', express.static('public'));
app.use('/files', express.static('uploads'));`,
    },
    {
      type: 'heading',
      content: 'Absolute Paths',
    },
    {
      type: 'example',
      title: 'Using absolute paths',
      content: 'For more reliability, use absolute paths with path.join().',
      language: 'javascript',
      code: `const express = require('express');
const path = require('path');
const app = express();

// Use absolute path
app.use(express.static(path.join(__dirname, 'public')));

// Serve multiple directories
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));

app.listen(3000);`,
    },
    {
      type: 'heading',
      content: 'Serving index.html',
    },
    {
      type: 'example',
      title: 'Default index file',
      content: 'Express automatically serves index.html when you access a directory.',
      language: 'javascript',
      code: `app.use(express.static('public'));

// Accessing http://localhost:3000/ will serve public/index.html
// Accessing http://localhost:3000/about will serve public/about/index.html

// You can also explicitly define a catch-all route
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});`,
    },
    {
      type: 'tip',
      title: 'Cache control',
      content: 'Use the maxAge option to set cache headers: app.use(express.static("public", { maxAge: "1d" })). This improves performance by allowing browsers to cache static files.',
    },
    {
      type: 'note',
      title: 'Security note',
      content: 'Only serve files from designated public directories. Never use express.static() on your entire project or sensitive directories like node_modules.',
    },
    {
      type: 'tryit',
      title: 'Static File Server Simulator',
      css: `body{font-family:system-ui,sans-serif;padding:20px;margin:0;background:#f0f0f0;}
.server{max-width:800px;margin:0 auto;}
.header{background:#000;color:#fff;padding:14px 20px;border-radius:10px 10px 0 0;display:flex;align-items:center;justify-content:space-between;}
.header h2{margin:0;font-size:16px;font-weight:700;}
.status-dot{width:8px;height:8px;border-radius:50%;background:#4ade80;}
.structure{background:#fff;border:1px solid #ddd;border-top:none;padding:20px;}
.folder{margin:8px 0;}
.folder-name{font-weight:700;color:#666;font-size:13px;margin-bottom:6px;}
.file{background:#f8f8f8;border:1px solid #e0e0e0;border-radius:6px;padding:10px 14px;margin:4px 0;display:flex;align-items:center;justify-content:space-between;font-size:13px;}
.file-icon{color:#888;margin-right:8px;}
.file-name{font-family:monospace;color:#333;}
.file-btn{padding:6px 14px;background:#000;color:#fff;border:none;border-radius:5px;font-size:11px;font-weight:700;cursor:pointer;}
.file-btn:hover{background:#333;}
.output{background:#1a1a1a;color:#4ade80;padding:16px;border:1px solid #ddd;border-top:none;border-radius:0 0 10px 10px;font-family:monospace;font-size:12px;min-height:100px;}
.req{color:#60a5fa;}
.res-ok{color:#4ade80;}
.res-err{color:#ef4444;}`,
      js: `var files = [
  { path: '/index.html', type: 'html', exists: true },
  { path: '/about.html', type: 'html', exists: true },
  { path: '/css/style.css', type: 'css', exists: true },
  { path: '/js/app.js', type: 'js', exists: true },
  { path: '/images/logo.png', type: 'image', exists: true },
  { path: '/images/banner.jpg', type: 'image', exists: true },
  { path: '/notfound.html', type: 'html', exists: false }
];

var log = [];

function requestFile(path, exists) {
  var timestamp = new Date().toLocaleTimeString();
  
  if (exists) {
    log.unshift({
      req: 'GET ' + path,
      res: 'HTTP/200 OK - Served file',
      time: timestamp,
      success: true
    });
  } else {
    log.unshift({
      req: 'GET ' + path,
      res: 'HTTP/404 Not Found - File does not exist',
      time: timestamp,
      success: false
    });
  }
  
  if (log.length > 5) log.pop();
  renderLog();
}

function renderLog() {
  var logHtml = log.map(function(entry) {
    var resClass = entry.success ? 'res-ok' : 'res-err';
    return '<div class="req">[' + entry.time + '] ' + entry.req + '</div>' +
           '<div class="' + resClass + '">' + entry.res + '</div><br>';
  }).join('');
  
  document.getElementById('log').innerHTML = logHtml || 'Click any file to simulate a request...';
}

function render() {
  var fileHtml = files.map(function(file) {
    var icon = file.type === 'html' ? 'HTML' : 
               file.type === 'css' ? 'CSS' : 
               file.type === 'js' ? 'JS' : 'IMG';
    
    return '<div class="file">' +
      '<div><span class="file-icon">[' + icon + ']</span>' +
      '<span class="file-name">' + file.path + '</span></div>' +
      '<button class="file-btn" data-path="' + file.path + '" data-exists="' + file.exists + '">Request</button>' +
      '</div>';
  }).join('');
  
  document.getElementById('output').innerHTML =
    '<div class="server">' +
    '<div class="header">' +
    '<h2>Static File Server - express.static("public")</h2>' +
    '<div class="status-dot"></div>' +
    '</div>' +
    '<div class="structure">' +
    '<div class="folder-name">public/</div>' +
    fileHtml +
    '</div>' +
    '<div class="output" id="log"></div>' +
    '</div>';
  
  document.querySelectorAll('[data-path]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      requestFile(btn.getAttribute('data-path'), btn.getAttribute('data-exists') === 'true');
    });
  });
}

render();
renderLog();`,
    },
  ],
  exercises: [
    {
      id: 'express-static-1',
      question: 'What does express.static("public") do?',
      type: 'multiple-choice',
      options: [
        'Creates a new directory called public',
        'Serves files from the public directory',
        'Compiles static assets',
        'Minifies CSS and JavaScript',
      ],
      correct: 1,
      explanation: 'express.static("public") serves all files in the public directory. Files are accessible via their path relative to the public directory.',
    },
    {
      id: 'express-static-2',
      question: 'How do you serve files with a URL prefix "/assets"?',
      type: 'multiple-choice',
      options: [
        'app.use(express.static("public/assets"))',
        'app.use("/assets", express.static("public"))',
        'app.static("/assets", "public")',
        'app.prefix("/assets").static("public")',
      ],
      correct: 1,
      explanation: 'app.use("/assets", express.static("public")) mounts the static middleware at /assets, so files in public/ are accessible via /assets/filename.',
    },
  ],
  quiz: [
    {
      id: 'express-static-q1',
      question: 'Given app.use(express.static("public")), how do you access public/css/style.css?',
      options: [
        'http://localhost:3000/public/css/style.css',
        'http://localhost:3000/css/style.css',
        'http://localhost:3000/static/css/style.css',
        'http://localhost:3000/files/css/style.css',
      ],
      correct: 1,
      explanation: 'Files in the static directory are served relative to that directory, not including the directory name in the URL. So public/css/style.css is accessed via /css/style.css.',
    },
  ],
};
