import type { NodejsLesson } from '../nodejs-curriculum';

export const nodejsModulesLesson: NodejsLesson = {
  id: 'nodejs-modules',
  title: 'Modules (CommonJS)',
  slug: 'modules',
  chapter: 'core',
  order: 2,
  difficulty: 'beginner',
  readingTime: 10,
  description: 'CommonJS module system: require(), module.exports, built-in modules, and the module wrapper.',
  sections: [
    {
      type: 'text',
      content: 'Node.js uses the CommonJS module system to organize code into reusable files. Every file in Node.js is its own module with its own scope. You use require() to load modules and module.exports to expose functionality to other files.',
    },
    {
      type: 'analogy',
      title: 'Modules as toolboxes',
      content: 'Think of each Node.js file as a toolbox. A toolbox only exposes the tools you choose to show (module.exports). Other people open your toolbox using require(). What stays inside the box stays private.',
    },
    {
      type: 'heading',
      content: 'Creating and Exporting Modules',
    },
    {
      type: 'example',
      title: 'module.exports - exporting from a file',
      content: 'Use module.exports to define what a file shares with the outside world. Everything else stays private to the file.',
      language: 'javascript',
      code: `// math.js - a reusable module
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

// Private helper - NOT exported
function validate(n) {
  return typeof n === 'number';
}

// Export what others can use
module.exports = {
  add,
  subtract,
  multiply,
};

// OR export a single thing:
// module.exports = add;`,
    },
    {
      type: 'example',
      title: 'require() - importing a module',
      content: 'Use require() with a relative path to load your own modules. For built-in or npm modules, use just the name.',
      language: 'javascript',
      code: `// app.js - using the math module
const math = require('./math');   // ./ = same directory

console.log(math.add(5, 3));      // 8
console.log(math.subtract(10, 4)); // 6
console.log(math.multiply(3, 7)); // 21

// Destructure what you need
const { add, multiply } = require('./math');
console.log(add(2, 2)); // 4

// Load built-in modules (no path needed)
const fs = require('fs');
const path = require('path');
const os = require('os');`,
      output: '8 6 21 4',
    },
    {
      type: 'heading',
      content: 'Built-in Modules',
    },
    {
      type: 'table',
      title: 'Core Node.js Built-in Modules',
      headers: ['Module', 'Purpose', 'Common Use'],
      rows: [
        ['fs', 'File System', 'Read/write files, create directories'],
        ['path', 'File Paths', 'Join paths, get extensions, resolve dirs'],
        ['http', 'HTTP', 'Create web servers, make HTTP requests'],
        ['os', 'Operating System', 'CPU info, memory, hostname, platform'],
        ['events', 'Event Emitter', 'Custom event system, pub/sub'],
        ['stream', 'Streams', 'Process data in chunks, piping'],
        ['crypto', 'Cryptography', 'Hashing, encryption, random bytes'],
        ['url', 'URL Parsing', 'Parse and construct URLs'],
        ['util', 'Utilities', 'promisify, inspect, format strings'],
        ['child_process', 'Sub-processes', 'Run shell commands from Node'],
      ],
    },
    {
      type: 'example',
      title: 'Using built-in modules',
      content: 'Demonstrates the os and path built-in modules, which are available in every Node.js installation without installing anything from npm.',
      language: 'javascript',
      code: `const os = require('os');
const path = require('path');

// os module
console.log('Platform:', os.platform());    // 'linux', 'darwin', 'win32'
console.log('CPUs:', os.cpus().length);     // number of CPU cores
console.log('Free memory (MB):', Math.round(os.freemem() / 1024 / 1024));
console.log('Home dir:', os.homedir());     // '/home/user'
console.log('Hostname:', os.hostname());    // 'my-machine'

// path module
const filePath = '/users/alex/documents/notes.txt';
console.log('Directory:', path.dirname(filePath));  // /users/alex/documents
console.log('Filename:', path.basename(filePath));  // notes.txt
console.log('Extension:', path.extname(filePath));  // .txt

// Join paths safely (handles slashes across OS)
const fullPath = path.join(__dirname, 'data', 'config.json');
console.log('Full path:', fullPath);`,
      output: 'Platform: linux CPUs: 8 Free memory (MB): 4096',
    },
    {
      type: 'note',
      title: 'CommonJS vs ES Modules',
      content: 'Node.js also supports ES Modules (import/export syntax) when using .mjs files or "type": "module" in package.json. CommonJS (require/module.exports) is still the most common pattern for Node.js backend code.',
    },
    {
      type: 'tip',
      title: 'Module caching',
      content: 'Node.js caches modules after the first require(). Calling require("./math") multiple times returns the same cached object - the file is only executed once. This makes repeated imports fast and ensures singleton behavior.',
    },
    {
      type: 'tryit',
      title: 'Module System Explorer',
      css: `body{font-family:system-ui,sans-serif;padding:14px;margin:0;background:#f0fdf4;}
.module-box{background:#1e293b;border-radius:10px;padding:14px;margin-bottom:10px;color:#e2e8f0;}
.module-box h3{margin:0 0 8px;font-size:13px;color:#94a3b8;font-family:monospace;}
.export-item{display:inline-block;background:#166534;color:#bbf7d0;padding:3px 10px;border-radius:4px;font-size:12px;font-family:monospace;margin:3px;}
.result{background:#0f172a;border-radius:8px;padding:10px;font-family:monospace;font-size:13px;color:#4ade80;margin-top:8px;}
.btn{background:#339933;color:#fff;border:none;border-radius:6px;padding:7px 14px;font-size:13px;cursor:pointer;margin:4px;font-weight:600;}
.btn:hover{background:#2d7a2d;}
.tab{background:#1e293b;color:#94a3b8;border:none;border-radius:6px 6px 0 0;padding:6px 14px;font-size:12px;cursor:pointer;}
.tab.active{background:#166534;color:#fff;}`,
      js: `var modules = {
  math: { exports: ['add', 'subtract', 'multiply'], code: 'module.exports = { add, subtract, multiply }' },
  utils: { exports: ['formatDate', 'capitalize', 'slugify'], code: 'module.exports = { formatDate, capitalize, slugify }' },
  config: { exports: ['port', 'dbUrl', 'debug'], code: 'module.exports = { port: 3000, dbUrl: "...", debug: false }' }
};

var activeModule = 'math';

var results = {
  math: ['require("./math").add(5, 3) => 8', 'require("./math").multiply(4, 6) => 24', 'const { subtract } = require("./math") => OK'],
  utils: ['require("./utils").capitalize("hello") => "Hello"', 'require("./utils").slugify("My Post") => "my-post"', 'require("./utils").formatDate(new Date()) => "2024-01-15"'],
  config: ['require("./config").port => 3000', 'require("./config").debug => false', 'require("./config").dbUrl => "mongodb://..."']
};

function render() {
  var m = modules[activeModule];
  var tabs = Object.keys(modules).map(function(key) {
    return '<button class="tab' + (key === activeModule ? ' active' : '') + '" data-mod="' + key + '">./' + key + '.js</button>';
  }).join('');
  var exports = m.exports.map(function(e) { return '<span class="export-item">' + e + '</span>'; }).join('');
  var res = results[activeModule].map(function(r) { return '<div>' + r + '</div>'; }).join('');

  document.getElementById('output').innerHTML =
    '<div style="margin-bottom:10px">' + tabs + '</div>' +
    '<div class="module-box">' +
    '<h3>' + activeModule + '.js -- exports</h3>' +
    exports +
    '<div class="result" style="margin-top:10px;color:#94a3b8;font-size:12px">' + m.code + '</div>' +
    '</div>' +
    '<div class="module-box">' +
    '<h3>Using with require()</h3>' +
    '<div class="result">' + res + '</div>' +
    '</div>' +
    '<div style="margin-top:10px">' +
    '<button class="btn" data-action="require">const m = require("./' + activeModule + '")</button>' +
    '</div>';

  document.querySelectorAll('.tab').forEach(function(tab) {
    tab.addEventListener('click', function() { activeModule = tab.getAttribute('data-mod'); render(); });
  });
  document.querySelectorAll('[data-action]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var box = document.createElement('div');
      box.style.cssText = 'background:#0f172a;border-radius:8px;padding:10px;margin-top:8px;font-family:monospace;font-size:13px;color:#4ade80;';
      box.textContent = 'Module loaded from cache. Exports: ' + modules[activeModule].exports.join(', ');
      btn.parentNode.appendChild(box);
      setTimeout(function() { if (box.parentNode) box.parentNode.removeChild(box); }, 3000);
    });
  });
}

render();`,
    },
  ],
  exercises: [
    {
      id: 'nodejs-modules-1',
      question: 'How do you export a function named "greet" from a Node.js file?',
      type: 'multiple-choice',
      options: [
        'export function greet() {}',
        'module.exports = { greet }',
        'exports default greet',
        'export default greet',
      ],
      correct: 1,
      explanation: 'In CommonJS (the default Node.js module system), you use module.exports to share values. module.exports = { greet } exports the greet function as a named export. The ES Module syntax (export/import) works in Node.js only with .mjs files or "type":"module".',
    },
    {
      id: 'nodejs-modules-2',
      question: 'What does require("fs") do?',
      type: 'multiple-choice',
      options: [
        'Downloads the fs package from npm',
        'Loads the built-in File System module included with Node.js',
        'Creates a new file system instance',
        'Imports fs from the current directory',
      ],
      correct: 1,
      explanation: 'When require() is called without a path (no ./ prefix), Node.js looks for a built-in module first, then node_modules. "fs" is a built-in module included with Node.js - no installation needed.',
    },
  ],
  quiz: [
    {
      id: 'nodejs-modules-q1',
      question: 'If you require() the same module file twice in Node.js, what happens?',
      options: [
        'The file is executed twice, creating two separate module instances',
        'Node.js throws an error about duplicate imports',
        'The file is executed once and the result is cached - both calls get the same object',
        'The second require() returns undefined',
      ],
      correct: 2,
      explanation: 'Node.js caches modules after the first require(). Subsequent require() calls for the same file return the cached exports object without re-executing the file. This is why modules are often used as singletons.',
    },
  ],
};
