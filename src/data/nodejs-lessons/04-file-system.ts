import type { NodejsLesson } from '../nodejs-curriculum';

export const nodejsFileSystemLesson: NodejsLesson = {
  id: 'nodejs-fs',
  title: 'File System',
  slug: 'file-system',
  chapter: 'core',
  order: 4,
  difficulty: 'beginner',
  readingTime: 12,
  description: 'The fs module: reading and writing files, working with directories, and fs.promises.',
  sections: [
    {
      type: 'text',
      content: 'The fs (File System) module is one of the most used built-in Node.js modules. It lets you read files, write files, create and delete directories, check file stats, and more. It offers both synchronous and asynchronous versions of every operation.',
    },
    {
      type: 'heading',
      content: 'Reading Files',
    },
    {
      type: 'example',
      title: 'Reading files - three ways',
      content: 'Compares the three styles for reading files in Node.js: synchronous blocking, callback-based async, and the modern promise-based API using async/await.',
      language: 'javascript',
      code: `const fs = require('fs');
const { promises: fsp } = require('fs');

// 1. Synchronous (blocks execution - ok for startup scripts)
try {
  const data = fs.readFileSync('config.json', 'utf8');
  const config = JSON.parse(data);
  console.log(config);
} catch (err) {
  console.error('File not found:', err.message);
}

// 2. Callback-based (classic async)
fs.readFile('data.txt', 'utf8', function(err, data) {
  if (err) {
    console.error('Error:', err.message);
    return;
  }
  console.log('File content:', data);
});

// 3. Promise-based (modern - recommended)
async function readConfig() {
  try {
    const data = await fsp.readFile('config.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Could not read config:', err.message);
    return {};
  }
}`,
    },
    {
      type: 'heading',
      content: 'Writing Files',
    },
    {
      type: 'example',
      title: 'Writing files and directories',
      content: 'Shows the fs.promises API for writing, appending, and deleting files, creating directories, and checking whether a path exists using try/catch with fs.access.',
      language: 'javascript',
      code: `const { promises: fsp } = require('fs');

async function writeExamples() {
  // Write a file (creates or overwrites)
  await fsp.writeFile('output.txt', 'Hello, Node.js!', 'utf8');

  // Append to a file (creates if not exists)
  await fsp.appendFile('log.txt', new Date().toISOString() + ' - App started\n');

  // Write JSON
  const data = { users: ['Alice', 'Bob'], count: 2 };
  await fsp.writeFile('data.json', JSON.stringify(data, null, 2), 'utf8');

  // Create a directory
  await fsp.mkdir('uploads', { recursive: true }); // recursive: ok if exists

  // Read all files in a directory
  const files = await fsp.readdir('./');
  console.log('Files:', files);

  // Check if file exists
  try {
    await fsp.access('config.json');
    console.log('config.json exists');
  } catch {
    console.log('config.json does not exist');
  }

  // Delete a file
  await fsp.unlink('temp.txt');

  // Get file info
  const stats = await fsp.stat('output.txt');
  console.log('Size:', stats.size, 'bytes');
  console.log('Modified:', stats.mtime);
}

writeExamples().catch(console.error);`,
    },
    {
      type: 'warning',
      title: 'Avoid readFileSync in servers',
      content: 'Never use fs.readFileSync inside request handlers of an HTTP server. It blocks the entire Node.js event loop while the file loads, meaning no other requests can be served. Use fs.promises or the callback API instead.',
    },
    {
      type: 'example',
      title: 'Practical example - reading a JSON config file',
      content: 'Shows a real-world pattern for loading a JSON config file on startup. It handles the case where the file is missing by falling back to defaults and checking err.code.',
      language: 'javascript',
      code: `// config.json
// { "port": 3000, "db": "mongodb://localhost/mydb", "debug": true }

const { promises: fsp } = require('fs');
const path = require('path');

async function loadConfig() {
  const configPath = path.join(__dirname, 'config.json');
  
  try {
    const raw = await fsp.readFile(configPath, 'utf8');
    const config = JSON.parse(raw);
    console.log('Config loaded:', config);
    return config;
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('No config.json found, using defaults');
      return { port: 3000, debug: false };
    }
    throw err;
  }
}

// Write application logs
async function log(message) {
  const timestamp = new Date().toISOString();
  const entry = timestamp + ' ' + message + '\n';
  const logPath = path.join(__dirname, 'app.log');
  await fsp.appendFile(logPath, entry, 'utf8');
}

loadConfig().then(config => {
  log('App started on port ' + config.port);
});`,
      output: 'Config loaded: { port: 3000, db: "...", debug: true }',
    },
    {
      type: 'tip',
      title: 'Use path.join for cross-platform paths',
      content: 'Always use path.join(__dirname, "subdir", "file.txt") instead of string concatenation. path.join handles different slash styles on Windows vs macOS/Linux automatically.',
    },
    {
      type: 'tryit',
      title: 'File System Simulator',
      css: `body{font-family:system-ui,sans-serif;padding:14px;margin:0;background:#f0fdf4;}
.fs-panel{display:flex;gap:12px;}
.sidebar{width:180px;background:#1e293b;border-radius:10px;padding:10px;flex-shrink:0;}
.sidebar h3{color:#94a3b8;font-size:11px;margin:0 0 8px;font-family:monospace;text-transform:uppercase;}
.file-item{display:flex;align-items:center;gap:6px;padding:5px 6px;border-radius:5px;cursor:pointer;font-size:12px;color:#e2e8f0;font-family:monospace;}
.file-item:hover{background:#334155;}
.file-item.active{background:#166534;color:#bbf7d0;}
.file-icon{color:#60a5fa;font-size:14px;}
.main-area{flex:1;}
.editor{background:#0d1117;border-radius:10px;padding:12px;font-family:monospace;font-size:13px;color:#e6edf3;min-height:120px;}
.btn{border:none;border-radius:6px;padding:6px 12px;font-size:12px;cursor:pointer;margin:4px;font-weight:600;color:#fff;}
.btn-read{background:#1d4ed8;}
.btn-write{background:#339933;}
.btn-delete{background:#dc2626;}
.output-box{background:#0f172a;border-radius:8px;padding:10px;margin-top:8px;font-family:monospace;font-size:12px;color:#4ade80;min-height:50px;}`,
      js: `var fs = {
  'config.json': '{\\n  \\"port\\": 3000,\\n  \\"debug\\": true,\\n  \\"db\\": \\"mongodb://localhost/mydb\\"\\n}',
  'README.md': '# My Node.js App\\n\\nA simple server application.\\n\\n## Usage\\n\\nnpm start',
  'app.log': '2024-01-15T10:00:00Z - App started\\n2024-01-15T10:01:00Z - Request GET /'
};

var activeFile = 'config.json';
var outputLog = [];

function addLog(msg, color) {
  outputLog.unshift({ msg: msg, color: color || '#4ade80' });
  if (outputLog.length > 5) outputLog.pop();
}

function readFile(name) {
  if (fs[name] !== undefined) {
    addLog('readFile(\\"' + name + '\\") => ' + fs[name].split('\\n').length + ' lines', '#4ade80');
  } else {
    addLog('Error: ENOENT: no such file \\"' + name + '\\"', '#f87171');
  }
  render();
}

function writeFile(name, content) {
  var existed = fs[name] !== undefined;
  fs[name] = content;
  addLog((existed ? 'writeFile' : 'created') + ' \\"' + name + '\\" (' + content.length + ' bytes)', '#4ade80');
  render();
}

function deleteFile(name) {
  if (fs[name] !== undefined) {
    delete fs[name];
    if (activeFile === name) activeFile = Object.keys(fs)[0] || '';
    addLog('unlink(\\"' + name + '\\") => deleted', '#fbbf24');
  } else {
    addLog('Error: ENOENT: cannot unlink \\"' + name + '\\"', '#f87171');
  }
  render();
}

function render() {
  var fileList = Object.keys(fs).map(function(name) {
    return '<div class=\\"file-item' + (name === activeFile ? ' active' : '') + '\\" data-file=\\"' + name + '\\">' +
      '<span class=\\"file-icon\\">' + (name.endsWith('.json') ? '{}' : name.endsWith('.log') ? '>>' : '#') + '</span>' +
      name + '</div>';
  }).join('');

  var editor = fs[activeFile] || '';
  var logHtml = outputLog.map(function(l) {
    return '<div style=\\"color:' + l.color + ';margin-bottom:4px\\">' + l.msg + '</div>';
  }).join('') || '<span style=\\"color:#666\\">Operations will appear here...</span>';

  document.getElementById('output').innerHTML =
    '<div class=\\"fs-panel\\">' +
    '<div class=\\"sidebar\\"><h3>Files</h3>' + fileList + '</div>' +
    '<div class=\\"main-area\\">' +
    '<div style=\\"margin-bottom:8px\\">' +
    '<button class=\\"btn btn-read\\" data-action=\\"read\\">readFile()</button>' +
    '<button class=\\"btn btn-write\\" data-action=\\"write\\">writeFile()</button>' +
    '<button class=\\"btn btn-delete\\" data-action=\\"delete\\">unlink()</button>' +
    '</div>' +
    '<div class=\\"editor\\">' + editor.replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</div>' +
    '<div class=\\"output-box\\">' + logHtml + '</div>' +
    '</div></div>';

  document.querySelectorAll('[data-file]').forEach(function(el) {
    el.addEventListener('click', function() { activeFile = el.getAttribute('data-file'); render(); });
  });
  document.querySelectorAll('[data-action]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var action = btn.getAttribute('data-action');
      if (action === 'read') readFile(activeFile);
      else if (action === 'write') {
        var ts = new Date().toISOString();
        var newContent = activeFile.endsWith('.log')
          ? (fs[activeFile] || '') + ts + ' - Updated\\n'
          : (fs[activeFile] || '') + '\\n// updated at ' + ts;
        writeFile(activeFile, newContent);
      } else if (action === 'delete') deleteFile(activeFile);
    });
  });
}

render();`,
    },
  ],
  exercises: [
    {
      id: 'nodejs-fs-1',
      question: 'Which method should you use to read a file inside an HTTP request handler?',
      type: 'multiple-choice',
      options: [
        'fs.readFileSync - it is simpler',
        'fs.readFile with a callback or fs.promises.readFile',
        'Either works the same in a server context',
        'You cannot read files inside request handlers',
      ],
      correct: 1,
      explanation: 'Inside HTTP request handlers, always use async methods (fs.readFile with callback or fs.promises.readFile with async/await). fs.readFileSync blocks the event loop, preventing Node.js from handling any other requests while the file loads.',
    },
    {
      id: 'nodejs-fs-2',
      question: 'What does the "recursive: true" option do in fs.promises.mkdir()?',
      type: 'multiple-choice',
      options: [
        'Creates the directory and all its subdirectories at once',
        'Deletes the directory recursively if it exists',
        'Makes it OK if the directory already exists, and creates parent dirs if needed',
        'Lists all files recursively inside the directory',
      ],
      correct: 2,
      explanation: 'mkdir with recursive: true does two things: it does not throw an error if the directory already exists, and it creates any missing parent directories. Without it, mkdir throws EEXIST if the dir exists and ENOENT if a parent dir is missing.',
    },
  ],
  quiz: [
    {
      id: 'nodejs-fs-q1',
      question: 'What error code does fs throw when you try to read a file that does not exist?',
      options: [
        'EPERM - operation not permitted',
        'ENOENT - no such file or directory',
        'ENOTFOUND - file not found',
        'EACCES - permission denied',
      ],
      correct: 1,
      explanation: 'ENOENT (Error NO ENTry) is the standard POSIX error code for "no such file or directory". You can check err.code === "ENOENT" to handle the case where a file does not exist without crashing.',
    },
  ],
};
