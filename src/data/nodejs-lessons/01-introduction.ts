import type { NodejsLesson } from '../nodejs-curriculum';

export const nodejsIntroLesson: NodejsLesson = {
  id: 'nodejs-intro',
  title: 'Introduction to Node.js',
  slug: 'introduction',
  chapter: 'intro',
  order: 1,
  difficulty: 'beginner',
  readingTime: 10,
  description: 'What Node.js is, how it works, the event loop concept, and why it changed backend development.',
  sections: [
    {
      type: 'text',
      content: 'Node.js is a JavaScript runtime built on Chrome\'s V8 engine. It lets you run JavaScript outside the browser - on a server, your local machine, or anywhere else. Before Node.js, JavaScript was browser-only. Node.js changed everything by bringing JavaScript to the server side.',
    },
    {
      type: 'analogy',
      title: 'JavaScript escaping the browser',
      content: 'Imagine JavaScript was always locked inside a browser cage. Node.js is the key that opened the cage door - now JavaScript can run anywhere: servers, command line tools, desktop apps, IoT devices. One language to rule them all.',
    },
    {
      type: 'heading',
      content: 'Why Node.js?',
    },
    {
      type: 'list',
      items: [
        'JavaScript everywhere - same language on frontend and backend reduces context switching',
        'Non-blocking I/O - handles thousands of concurrent connections without threads',
        'Massive ecosystem - npm has over 2 million packages solving almost every problem',
        'Fast startup - V8 JIT compilation makes Node.js extremely performant',
        'Perfect for APIs - lightweight, fast, great for REST and GraphQL APIs',
        'Active community - millions of developers, extensive documentation, constant improvements',
      ],
    },
    {
      type: 'heading',
      content: 'The Event Loop',
    },
    {
      type: 'text',
      content: 'Node.js is single-threaded but handles concurrent operations through the event loop. Instead of creating a new thread for each connection (like Apache), Node.js uses asynchronous I/O. When a file read or network request starts, Node.js registers a callback and moves on to other work. When the operation completes, the callback is added to the event queue and executed.',
    },
    {
      type: 'example',
      title: 'Synchronous vs Asynchronous',
      content: 'This shows the key difference between blocking and non-blocking code in Node.js.',
      language: 'javascript',
      code: `// BLOCKING (synchronous) - waits before moving on
const fs = require('fs');
const data = fs.readFileSync('file.txt', 'utf8'); // blocks here
console.log(data); // only runs after file is read
console.log('Done'); // runs after

// NON-BLOCKING (asynchronous) - continues immediately
fs.readFile('file.txt', 'utf8', function(err, data) {
  if (err) throw err;
  console.log(data); // runs when file is ready
});
console.log('Done'); // runs immediately, before file is read

// Output order with async:
// "Done"
// (file contents)`,
      output: 'Done\n(file contents printed after)',
    },
    {
      type: 'example',
      title: 'Your first Node.js script',
      content: 'Every Node.js project starts with a simple script. Save this as app.js and run it with "node app.js".',
      language: 'javascript',
      code: `// app.js - your first Node.js script
console.log('Hello from Node.js!');
console.log('Node version:', process.version);
console.log('Platform:', process.platform);
console.log('Current directory:', process.cwd());

// Built-in global objects (no import needed)
console.log('__dirname:', __dirname);   // directory of this file
console.log('__filename:', __filename); // full path of this file

// process.argv - command line arguments
// node app.js hello world
console.log('Arguments:', process.argv.slice(2));`,
      output: 'Hello from Node.js!\nNode version: v20.x.x\nPlatform: linux',
    },
    {
      type: 'note',
      title: 'Node.js vs Browser JavaScript',
      content: 'Node.js has no window, document, or DOM. Instead it has process, require(), __dirname, __filename, and access to the file system and network. The JavaScript language itself (variables, functions, classes) is the same.',
    },
    {
      type: 'example',
      title: 'Installing Node.js and running scripts',
      content: 'Shows how to verify your Node.js installation and run scripts from the command line. The REPL lets you run JavaScript interactively without creating a file.',
      language: 'bash',
      code: `# Download from nodejs.org or use a version manager
# Check installed version
node --version
npm --version

# Run a JavaScript file
node app.js

# Run with arguments
node app.js arg1 arg2

# Start an interactive REPL (Read-Eval-Print Loop)
node

# Inside REPL:
> 2 + 2
4
> console.log('hello')
hello
> .exit`,
    },
    {
      type: 'tryit',
      title: 'Node.js Environment Explorer',
      css: `body{font-family:system-ui,sans-serif;padding:14px;margin:0;background:#f0fdf4;}
.terminal{background:#1a1a1a;border-radius:10px;overflow:hidden;}
.term-header{background:#2d2d2d;padding:8px 14px;display:flex;align-items:center;gap:8px;}
.dot{width:12px;height:12px;border-radius:50%;}
.term-title{color:#ccc;font-size:12px;margin-left:4px;font-family:monospace;}
.term-body{padding:14px;font-family:monospace;font-size:13px;color:#d4d4d4;min-height:180px;}
.prompt{color:#339933;margin-right:6px;}
.output{color:#d4d4d4;margin:2px 0 8px 0;}
.btn-row{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;}
.btn{background:#339933;color:#fff;border:none;border-radius:6px;padding:7px 16px;font-size:13px;cursor:pointer;font-weight:600;}
.btn:hover{background:#2d7a2d;}
.btn.secondary{background:#1e293b;}
.btn.secondary:hover{background:#334155;}`,
      js: `var lines = [];

function addLine(cmd, output) {
  lines.push({ cmd: cmd, out: output });
  if (lines.length > 8) lines.shift();
  render();
}

function runCmd(cmd) {
  var outputs = {
    'node --version': 'v20.11.0',
    'npm --version': '10.2.4',
    'node -e \\"console.log(process.platform)\\"': 'linux',
    'node -e \\"console.log(2 + 2)\\"': '4',
    'node -e \\"console.log(typeof require)\\"': 'function',
    'node -e \\"console.log(process.memoryUsage().heapUsed)\\"': '4823040'
  };
  addLine(cmd, outputs[cmd] || 'command executed');
}

function render() {
  var termLines = lines.map(function(l) {
    return '<div><span class=\\"prompt\\">$</span>' + l.cmd + '</div>' +
      '<div class=\\"output\\">' + l.out + '</div>';
  }).join('');
  document.getElementById('output').innerHTML =
    '<div class=\\"btn-row\\">' +
    '<button class=\\"btn\\" data-cmd=\\"node --version\\">node --version</button>' +
    '<button class=\\"btn\\" data-cmd=\\"npm --version\\">npm --version</button>' +
    '<button class=\\"btn secondary\\" data-cmd=\\"node -e &quot;console.log(process.platform)&quot;\\">process.platform</button>' +
    '<button class=\\"btn secondary\\" data-cmd=\\"node -e &quot;console.log(2 + 2)&quot;\\">node -e \\"2+2\\"</button>' +
    '<button class=\\"btn secondary\\" data-cmd=\\"node -e &quot;console.log(typeof require)&quot;\\">typeof require</button>' +
    '<button class=\\"btn secondary\\" data-cmd=\\"node -e &quot;console.log(process.memoryUsage().heapUsed)&quot;\\">heapUsed</button>' +
    '</div>' +
    '<div class=\\"terminal\\">' +
    '<div class=\\"term-header\\"><div class=\\"dot\\" style=\\"background:#ff5f57\\"></div><div class=\\"dot\\" style=\\"background:#ffbd2e\\"></div><div class=\\"dot\\" style=\\"background:#28c840\\"></div><span class=\\"term-title\\">node terminal</span></div>' +
    '<div class=\\"term-body\\">' + (termLines || '<span style=\\"color:#666\\">Click a command to run it...</span>') + '</div>' +
    '</div>';
  document.querySelectorAll('.btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      runCmd(btn.getAttribute('data-cmd'));
    });
  });
}

render();`,
    },
  ],
  exercises: [
    {
      id: 'nodejs-intro-1',
      question: 'What is Node.js?',
      type: 'multiple-choice',
      options: [
        'A browser extension for running server code',
        'A JavaScript runtime that runs JS outside the browser, built on V8',
        'A database system for JavaScript applications',
        'A frontend framework like React or Vue',
      ],
      correct: 1,
      explanation: 'Node.js is a JavaScript runtime environment built on Chrome\'s V8 engine. It allows JavaScript to run outside the browser - on servers, local machines, and other environments.',
    },
    {
      id: 'nodejs-intro-2',
      question: 'How does Node.js handle many concurrent connections without multiple threads?',
      type: 'multiple-choice',
      options: [
        'It creates a new thread for each request automatically',
        'It uses the event loop and non-blocking I/O to handle operations asynchronously',
        'It queues all requests and processes them one at a time, very quickly',
        'It uses WebWorkers for each connection',
      ],
      correct: 1,
      explanation: 'Node.js uses a single-threaded event loop combined with non-blocking I/O. When an I/O operation (file read, network request) starts, Node registers a callback and continues processing other events. The callback runs when the I/O completes.',
    },
  ],
  quiz: [
    {
      id: 'nodejs-intro-q1',
      question: 'Which of the following is NOT available in Node.js (but is in the browser)?',
      options: [
        'setTimeout and setInterval',
        'console.log',
        'document.getElementById',
        'JSON.parse',
      ],
      correct: 2,
      explanation: 'document.getElementById is a browser DOM API. Node.js has no DOM or window object. However, setTimeout, console.log, and JSON.parse are all available in Node.js.',
    },
  ],
};
