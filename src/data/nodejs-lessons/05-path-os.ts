import type { NodejsLesson } from '../nodejs-curriculum';

export const nodejsPathOsLesson: NodejsLesson = {
  id: 'nodejs-path-os',
  title: 'Path & OS Module',
  slug: 'path-os',
  chapter: 'core',
  order: 5,
  difficulty: 'beginner',
  readingTime: 8,
  description: 'The path module for cross-platform file paths, os module for system info, __dirname and __filename.',
  sections: [
    {
      type: 'text',
      content: 'The path module helps you work with file and directory paths in a cross-platform way. The os module gives you information about the operating system. Together they help write Node.js code that works reliably on Windows, macOS, and Linux.',
    },
    {
      type: 'heading',
      content: 'The path Module',
    },
    {
      type: 'example',
      title: 'path module essentials',
      content: 'Demonstrates the most commonly used path methods: join, dirname, basename, extname, resolve, and parse, along with example inputs and outputs for each.',
      language: 'javascript',
      code: `const path = require('path');

// Join path segments (handles slashes for any OS)
path.join('/users', 'alex', 'documents', 'file.txt');
// -> /users/alex/documents/file.txt  (Unix)
// -> \\\\users\\\\alex\documents\file.txt  (Windows)

// Get directory name from a path
path.dirname('/users/alex/documents/file.txt');
// -> /users/alex/documents

// Get the filename
path.basename('/users/alex/documents/file.txt');
// -> file.txt

// Get just the extension
path.extname('photo.jpg');
// -> .jpg

path.extname('index.html');
// -> .html

// Get filename without extension
path.basename('photo.jpg', '.jpg');
// -> photo

// Resolve an absolute path
path.resolve('data', 'config.json');
// -> /current/working/directory/data/config.json

// Parse a path into its parts
path.parse('/users/alex/file.txt');
// -> { root: '/', dir: '/users/alex', base: 'file.txt', ext: '.txt', name: 'file' }`,
    },
    {
      type: 'heading',
      content: '__dirname and __filename',
    },
    {
      type: 'text',
      content: '__dirname is the directory of the current module file. __filename is the full path of the current module file. These are injected by Node.js into every CommonJS module. Always use path.join(__dirname, ...) for paths relative to your script.',
    },
    {
      type: 'example',
      title: 'Using __dirname for reliable paths',
      content: 'Explains why __dirname is preferable to relative path strings. __dirname always points to the script\'s own directory, while relative paths depend on which directory you run node from.',
      language: 'javascript',
      code: `// file: /home/alex/myapp/server/routes.js
console.log(__dirname);  // /home/alex/myapp/server
console.log(__filename); // /home/alex/myapp/server/routes.js

// WRONG - breaks if you run from a different directory
const config = require('./config.json');           // may fail
const dataPath = './data/users.json';              // relative to cwd, not script

// CORRECT - always works regardless of where you run node from
const config = require(path.join(__dirname, 'config.json'));
const dataPath = path.join(__dirname, '..', 'data', 'users.json');
// -> /home/alex/myapp/data/users.json  (goes up one level with '..')

// Load templates relative to current file
const templateDir = path.join(__dirname, '..', 'views');
const templatePath = path.join(templateDir, 'index.html');`,
    },
    {
      type: 'heading',
      content: 'The os Module',
    },
    {
      type: 'example',
      title: 'os module - system information',
      content: 'Shows how to query platform, CPU count, memory usage, home directory, hostname, and uptime using the built-in os module. Useful for logging and diagnostics.',
      language: 'javascript',
      code: `const os = require('os');

// Platform information
console.log(os.platform());   // 'linux', 'darwin', 'win32'
console.log(os.type());       // 'Linux', 'Darwin', 'Windows_NT'
console.log(os.arch());       // 'x64', 'arm64'
console.log(os.release());    // OS version string

// CPU information
console.log(os.cpus().length);   // number of logical cores
console.log(os.cpus()[0].model); // 'Intel(R) Core(TM) i7-...'

// Memory (in bytes)
const totalMB = Math.round(os.totalmem() / 1024 / 1024);
const freeMB = Math.round(os.freemem() / 1024 / 1024);
console.log('Total RAM:', totalMB, 'MB');
console.log('Free RAM:', freeMB, 'MB');
console.log('Used:', totalMB - freeMB, 'MB');

// User information
console.log(os.homedir());    // '/home/alex' or 'C:\Users\alex'
console.log(os.hostname());   // 'alexs-macbook'
console.log(os.tmpdir());     // '/tmp' or 'C:\Users\alex\AppData\Local\Temp'

// Network interfaces
const nets = os.networkInterfaces();
console.log('Networks:', Object.keys(nets));

// OS uptime
console.log('Uptime:', Math.round(os.uptime() / 3600), 'hours');`,
      output: 'linux\n8 CPUs\nTotal RAM: 16384 MB\nFree RAM: 8192 MB',
    },
    {
      type: 'table',
      title: 'path module methods at a glance',
      headers: ['Method', 'Input', 'Output'],
      rows: [
        ['path.join(...parts)', 'join("/foo", "bar", "baz")', '/foo/bar/baz'],
        ['path.dirname(p)', 'dirname("/foo/bar/baz.txt")', '/foo/bar'],
        ['path.basename(p)', 'basename("/foo/bar/baz.txt")', 'baz.txt'],
        ['path.extname(p)', 'extname("/foo/bar/baz.txt")', '.txt'],
        ['path.resolve(...)', 'resolve("data", "file.txt")', '/cwd/data/file.txt'],
        ['path.parse(p)', 'parse("/foo/bar.txt")', '{ dir, base, ext, name }'],
        ['path.isAbsolute(p)', 'isAbsolute("/foo")', 'true'],
      ],
    },
    {
      type: 'tip',
      title: 'Cross-platform path separator',
      content: 'path.sep gives you the OS path separator ("/" on Unix, "\\" on Windows). path.join handles this automatically, but knowing path.sep is useful when splitting or building paths manually.',
    },
    {
      type: 'tryit',
      title: 'Path Module Playground',
      css: `body{font-family:system-ui,sans-serif;padding:14px;margin:0;background:#f0fdf4;}
.card{background:#fff;border-radius:10px;border:1px solid #d1fae5;padding:12px;margin-bottom:10px;}
.card h3{margin:0 0 8px;font-size:13px;color:#166534;font-weight:700;}
.input-row{display:flex;gap:8px;margin-bottom:8px;align-items:center;}
.input-row input{border:1px solid #d1fae5;border-radius:6px;padding:6px 10px;font-family:monospace;font-size:13px;flex:1;outline:none;}
.input-row input:focus{border-color:#339933;}
.btn{background:#339933;color:#fff;border:none;border-radius:6px;padding:7px 14px;font-size:13px;cursor:pointer;font-weight:600;}
.btn:hover{background:#2d7a2d;}
.result{background:#0f172a;border-radius:8px;padding:10px;font-family:monospace;font-size:12px;color:#4ade80;min-height:30px;}
.method-badge{display:inline-block;background:#dcfce7;color:#166534;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;margin-right:6px;}`,
      js: `function pathJoin(parts) {
  return parts.filter(Boolean).join('/').replace(/\/+/g, '/');
}
function pathDirname(p) {
  var idx = p.lastIndexOf('/');
  return idx < 0 ? '.' : idx === 0 ? '/' : p.slice(0, idx);
}
function pathBasename(p) {
  var parts = p.split('/');
  return parts[parts.length - 1] || '';
}
function pathExtname(p) {
  var base = pathBasename(p);
  var idx = base.lastIndexOf('.');
  return idx < 1 ? '' : base.slice(idx);
}

function runDemo(type) {
  var inputEl = document.getElementById('path-input');
  var p = inputEl ? inputEl.value : '/users/alex/documents/notes.txt';
  var results = {
    dirname: 'path.dirname("' + p + '") => ' + pathDirname(p),
    basename: 'path.basename("' + p + '") => ' + pathBasename(p),
    extname: 'path.extname("' + p + '") => ' + pathExtname(p),
    join: 'path.join(__dirname, "data", "file.json") => /app/data/file.json',
    parse: 'path.parse("' + p + '") => { dir: "' + pathDirname(p) + '", base: "' + pathBasename(p) + '", ext: "' + pathExtname(p) + '", name: "' + pathBasename(p).replace(pathExtname(p), '') + '" }'
  };
  var box = document.getElementById('result-box');
  if (box) box.textContent = results[type] || '';
}

function render() {
  document.getElementById('output').innerHTML =
    '<div class="card">' +
    '<h3>Try path methods on a file path</h3>' +
    '<div class="input-row"><input id="path-input" value="/users/alex/documents/notes.txt" />' +
    '</div>' +
    '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px">' +
    '<button class="btn" data-type="dirname">dirname</button>' +
    '<button class="btn" data-type="basename">basename</button>' +
    '<button class="btn" data-type="extname">extname</button>' +
    '<button class="btn" data-type="join">join example</button>' +
    '<button class="btn" data-type="parse">parse</button>' +
    '</div>' +
    '<div class="result" id="result-box">Click a method to see its output...</div>' +
    '</div>';

  document.querySelectorAll('[data-type]').forEach(function(btn) {
    btn.addEventListener('click', function() { runDemo(btn.getAttribute('data-type')); });
  });
}

render();`,
    },
  ],
  exercises: [
    {
      id: 'nodejs-pathos-1',
      question: 'What is the correct way to build a path to a file in the same directory as your script?',
      type: 'multiple-choice',
      options: [
        '"./config.json"',
        'path.join(process.cwd(), "config.json")',
        'path.join(__dirname, "config.json")',
        'path.resolve("config.json")',
      ],
      correct: 2,
      explanation: 'path.join(__dirname, "config.json") is the most reliable method. __dirname is always the directory of the current file, regardless of where you run node from. process.cwd() changes depending on your shell\'s current directory.',
    },
    {
      id: 'nodejs-pathos-2',
      question: 'What does path.extname("photo.jpg") return?',
      type: 'multiple-choice',
      options: [
        '"jpg"',
        '".jpg"',
        '"photo"',
        '"photo.jpg"',
      ],
      correct: 1,
      explanation: 'path.extname includes the dot: ".jpg". This matches what you need when comparing extensions: path.extname(file) === ".jpg".',
    },
  ],
  quiz: [
    {
      id: 'nodejs-pathos-q1',
      question: 'Why should you use path.join() instead of string concatenation for file paths?',
      options: [
        'path.join is faster than string concatenation',
        'path.join handles different OS path separators (/ vs \\) and normalizes slashes',
        'String concatenation does not work for file paths',
        'path.join automatically checks if the path exists',
      ],
      correct: 1,
      explanation: 'Windows uses backslash (\\) while Unix uses forward slash (/). path.join uses the correct separator for the current OS and also normalizes double slashes. This makes your code work cross-platform without manual string manipulation.',
    },
  ],
};
