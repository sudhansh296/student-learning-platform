import type { NodejsLesson } from '../nodejs-curriculum';

export const nodejsReferencesLesson: NodejsLesson = {
  id: 'nodejs-references',
  title: 'Node.js Reference & Ecosystem',
  slug: 'references',
  chapter: 'advanced',
  order: 15,
  difficulty: 'beginner',
  readingTime: 10,
  description: 'Quick reference for Node.js APIs, npm ecosystem, best practices, and resources for continued learning.',
  sections: [
    {
      type: 'text',
      content: 'Node.js has a rich ecosystem of built-in modules, npm packages, frameworks, and tools. This reference covers essential APIs, popular packages, best practices, and resources to deepen your Node.js knowledge.',
    },
    {
      type: 'heading',
      content: 'Essential Built-in Modules',
    },
    {
      type: 'table',
      headers: ['Module', 'Purpose', 'Key Methods'],
      rows: [
        ['fs', 'File system operations', 'readFile, writeFile, readdir, unlink'],
        ['path', 'File path utilities', 'join, resolve, basename, dirname'],
        ['http/https', 'HTTP server and client', 'createServer, request, get'],
        ['os', 'Operating system info', 'platform, cpus, hostname, uptime'],
        ['events', 'Event emitter pattern', 'EventEmitter, on, emit'],
        ['stream', 'Stream processing', 'Readable, Writable, Transform, pipe'],
        ['util', 'Utility functions', 'promisify, format, inspect'],
        ['crypto', 'Encryption and hashing', 'createHash, randomBytes, createCipher'],
        ['buffer', 'Binary data handling', 'Buffer.from, toString, concat'],
        ['child_process', 'Spawn external processes', 'spawn, exec, fork'],
      ],
    },
    {
      type: 'heading',
      content: 'Popular npm Packages',
    },
    {
      type: 'table',
      headers: ['Package', 'Category', 'Use Case'],
      rows: [
        ['express', 'Web Framework', 'Building REST APIs and web servers'],
        ['fastify', 'Web Framework', 'High-performance alternative to Express'],
        ['axios', 'HTTP Client', 'Making HTTP requests with promises'],
        ['dotenv', 'Config', 'Load environment variables from .env files'],
        ['joi', 'Validation', 'Schema validation for request data'],
        ['mongoose', 'Database', 'MongoDB ODM with schemas and queries'],
        ['pg', 'Database', 'PostgreSQL client'],
        ['jsonwebtoken', 'Auth', 'Create and verify JWT tokens'],
        ['bcrypt', 'Security', 'Hash and compare passwords securely'],
        ['nodemon', 'Dev Tools', 'Auto-restart server on file changes'],
        ['jest', 'Testing', 'JavaScript testing framework'],
        ['winston', 'Logging', 'Flexible logging library'],
      ],
    },
    {
      type: 'heading',
      content: 'Quick Reference: Common Patterns',
    },
    {
      type: 'example',
      title: 'File operations cheat sheet',
      content: 'A quick-reference summary of the most common fs.promises operations for reading, writing, appending, checking existence, listing directories, deleting, copying, and creating folders.',
      language: 'javascript',
      code: `const fs = require('fs').promises;

// Read file
const data = await fs.readFile('file.txt', 'utf8');

// Write file
await fs.writeFile('file.txt', 'content');

// Append to file
await fs.appendFile('log.txt', 'new line\ ');

// Check if file exists
try {
  await fs.access('file.txt');
  console.log('File exists');
} catch {
  console.log('File does not exist');
}

// List directory
const files = await fs.readdir('./folder');

// Delete file
await fs.unlink('file.txt');

// Copy file
await fs.copyFile('src.txt', 'dest.txt');

// Create directory
await fs.mkdir('newfolder', { recursive: true });`,
    },
    {
      type: 'example',
      title: 'HTTP server patterns',
      content: 'A reference for the three most common raw http module patterns: a basic response server, reading a streamed POST body, and handling routes by checking req.url and req.method.',
      language: 'javascript',
      code: `const http = require('http');

// Basic server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Hello' }));
});

// Parse request body
const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    const data = JSON.parse(body);
    res.end(JSON.stringify({ received: data }));
  });
});

// Route handling
const server = http.createServer((req, res) => {
  if (req.url === '/api/users' && req.method === 'GET') {
    res.end(JSON.stringify({ users: [] }));
  } else if (req.url === '/api/users' && req.method === 'POST') {
    // Handle POST
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});`,
    },
    {
      type: 'example',
      title: 'Environment variables',
      content: 'Shows how to use the dotenv package to load a .env file into process.env, then access values like PORT, DATABASE_URL, and NODE_ENV throughout your application.',
      language: 'javascript',
      code: `// Using dotenv package
require('dotenv').config();

// Access environment variables
const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DATABASE_URL;
const NODE_ENV = process.env.NODE_ENV || 'development';

// .env file (never commit to git!)
// PORT=3000
// DATABASE_URL=mongodb://localhost/mydb
// JWT_SECRET=your-secret-key
// NODE_ENV=production

// Check environment
if (process.env.NODE_ENV === 'production') {
  // production config
} else {
  // development config
}`,
    },
    {
      type: 'heading',
      content: 'Best Practices',
    },
    {
      type: 'list',
      items: [
        'Use async/await over callbacks for cleaner async code',
        'Handle errors properly - use try/catch with async/await',
        'Use environment variables for configuration (dotenv package)',
        'Never commit .env files or secrets to version control',
        'Use nodemon or similar tools for development auto-restart',
        'Implement proper logging with winston or similar',
        'Use process managers like PM2 for production deployments',
        'Validate input data with joi or similar validation libraries',
        'Use helmet middleware for security headers in Express',
        'Implement rate limiting to prevent abuse',
        'Use streams for large files to avoid memory issues',
        'Keep dependencies updated with npm audit and npm update',
      ],
    },
    {
      type: 'heading',
      content: 'Debugging and Profiling',
    },
    {
      type: 'example',
      title: 'Debugging techniques',
      content: 'Covers Node.js debugging options including the --inspect flag for Chrome DevTools, console helpers like console.table and console.time, and the debug package for conditional logging.',
      language: 'bash',
      code: `# Debug mode with --inspect
node --inspect app.js

# Debug with breakpoint at start
node --inspect-brk app.js

# Use Chrome DevTools
# Open chrome://inspect in Chrome
# Click "inspect" next to your Node process

# Console debugging
console.log('Simple debug');
console.dir(obj, { depth: null }); // full object
console.table(arrayOfObjects);     // table format
console.time('operation');
// ... code ...
console.timeEnd('operation');      // timing

# Environment-based debugging
const debug = require('debug')('app:server');
debug('Server starting...');

# Run with DEBUG env var
DEBUG=app:* node app.js`,
    },
    {
      type: 'heading',
      content: 'Performance Tips',
    },
    {
      type: 'list',
      items: [
        'Use clustering to utilize all CPU cores (cluster module)',
        'Implement caching with Redis or memory cache',
        'Use compression middleware for HTTP responses (gzip)',
        'Optimize database queries with indexes and proper schemas',
        'Use connection pooling for databases',
        'Implement pagination for large datasets',
        'Use streams for large file operations',
        'Avoid blocking the event loop with CPU-intensive tasks',
        'Use worker threads for heavy computation',
        'Profile with node --prof and node --inspect for bottlenecks',
      ],
    },
    {
      type: 'heading',
      content: 'Security Checklist',
    },
    {
      type: 'list',
      items: [
        'Validate and sanitize all user input',
        'Use parameterized queries to prevent SQL injection',
        'Hash passwords with bcrypt (never store plain text)',
        'Use HTTPS in production',
        'Implement rate limiting to prevent DDoS',
        'Use helmet middleware for security headers',
        'Keep dependencies updated (npm audit)',
        'Use environment variables for secrets',
        'Implement proper authentication (JWT, sessions)',
        'Use CORS properly to restrict origins',
        'Disable unnecessary features and endpoints',
        'Log security events for monitoring',
      ],
    },
    {
      type: 'heading',
      content: 'Learning Resources',
    },
    {
      type: 'table',
      headers: ['Resource', 'Type', 'Focus'],
      rows: [
        ['nodejs.org/docs', 'Official Docs', 'API reference and guides'],
        ['npmjs.com', 'Package Registry', 'Find and explore npm packages'],
        ['Node.js Design Patterns', 'Book', 'Advanced patterns and architecture'],
        ['Node.js Best Practices', 'GitHub Repo', 'Community best practices'],
        ['Express.js Guide', 'Documentation', 'Web framework patterns'],
        ['nodeschool.io', 'Interactive', 'Hands-on workshops'],
        ['nodejs.dev', 'Learning Site', 'Beginner to advanced tutorials'],
      ],
    },
    {
      type: 'heading',
      content: 'Common CLI Commands',
    },
    {
      type: 'example',
      title: 'npm and Node.js commands',
      content: 'A complete reference for frequently used node and npm CLI commands, covering running scripts, managing dependencies, auditing security, and using npx to run packages without installing them.',
      language: 'bash',
      code: `# Node.js commands
node app.js                 # Run script
node -v                     # Node version
node -e "console.log(2+2)"  # Execute code string
node                        # Start REPL

# npm commands
npm init                    # Create package.json
npm init -y                 # Create with defaults
npm install express         # Install package
npm install --save-dev jest # Install dev dependency
npm install                 # Install all dependencies
npm update                  # Update packages
npm outdated                # Check for updates
npm audit                   # Security audit
npm audit fix               # Fix vulnerabilities
npm run dev                 # Run script from package.json
npm test                    # Run tests
npm list                    # List installed packages
npm uninstall express       # Remove package

# npx - run packages without installing
npx create-react-app myapp
npx nodemon app.js`,
    },
    {
      type: 'tryit',
      title: 'Node.js API Quick Reference',
      css: `body{font-family:system-ui,sans-serif;padding:16px;margin:0;background:#f0f9ff;}
.container{max-width:900px;margin:0 auto;}
.header{background:linear-gradient(135deg,#339933 0%,#2d7a2d 100%);color:#fff;padding:16px 20px;border-radius:10px;margin-bottom:16px;}
.header h2{margin:0 0 4px;font-size:18px;}
.header p{margin:0;opacity:0.95;font-size:13px;}
.tabs{display:flex;gap:6px;margin-bottom:16px;overflow-x:auto;}
.tab{padding:10px 18px;border:none;border-radius:8px 8px 0 0;font-size:13px;font-weight:600;cursor:pointer;background:#e0f2fe;color:#0c4a6e;}
.tab.active{background:#339933;color:#fff;}
.content{background:#fff;border:2px solid #bae6fd;border-radius:10px;padding:16px;min-height:300px;}
.api-section{margin-bottom:16px;}
.api-title{font-size:14px;font-weight:700;color:#0c4a6e;margin-bottom:8px;display:flex;align-items:center;gap:8px;}
.api-badge{background:#dbeafe;color:#1e40af;padding:2px 8px;border-radius:12px;font-size:10px;}
.api-item{background:#f0f9ff;border-left:3px solid #339933;padding:10px;margin:6px 0;border-radius:4px;}
.api-name{font-family:monospace;font-size:12px;font-weight:700;color:#334155;margin-bottom:4px;}
.api-desc{font-size:11px;color:#64748b;line-height:1.5;}
.code-snippet{background:#1e293b;color:#e2e8f0;padding:10px;border-radius:6px;font-family:monospace;font-size:11px;margin-top:6px;white-space:pre;overflow-x:auto;}`,
      js: `var tabs = {
  fs: {
    title: 'File System (fs)',
    items: [
      { name: 'fs.readFile(path, encoding, callback)', desc: 'Read entire file into memory', code: 'fs.readFile(\\"file.txt\\", \\"utf8\\", (err, data) => {})' },
      { name: 'fs.writeFile(path, data, callback)', desc: 'Write data to file (overwrites)', code: 'fs.writeFile(\\"file.txt\\", \\"content\\", (err) => {})' },
      { name: 'fs.appendFile(path, data, callback)', desc: 'Append data to file', code: 'fs.appendFile(\\"log.txt\\", \\"line\\\\n\\", (err) => {})' },
      { name: 'fs.unlink(path, callback)', desc: 'Delete a file', code: 'fs.unlink(\\"file.txt\\", (err) => {})' },
      { name: 'fs.readdir(path, callback)', desc: 'List directory contents', code: 'fs.readdir(\\"./folder\\", (err, files) => {})' }
    ]
  },
  http: {
    title: 'HTTP Module',
    items: [
      { name: 'http.createServer(callback)', desc: 'Create HTTP server', code: 'const server = http.createServer((req, res) => {\\\\n  res.end(\\"Hello\\");\\\\n});' },
      { name: 'server.listen(port)', desc: 'Start listening on port', code: 'server.listen(3000, () => console.log(\\"Running\\"));' },
      { name: 'res.writeHead(status, headers)', desc: 'Write response headers', code: 'res.writeHead(200, { \\"Content-Type\\": \\"application/json\\" });' },
      { name: 'res.end(data)', desc: 'Send response and close connection', code: 'res.end(JSON.stringify({ message: \\"OK\\" }));' }
    ]
  },
  path: {
    title: 'Path Module',
    items: [
      { name: 'path.join(...paths)', desc: 'Join path segments with platform separator', code: 'path.join(__dirname, \\"files\\", \\"data.txt\\")' },
      { name: 'path.resolve(...paths)', desc: 'Resolve to absolute path', code: 'path.resolve(\\"folder\\", \\"file.txt\\")' },
      { name: 'path.basename(path)', desc: 'Get filename from path', code: 'path.basename(\\"/user/local/file.txt\\") // \\"file.txt\\"' },
      { name: 'path.dirname(path)', desc: 'Get directory from path', code: 'path.dirname(\\"/user/local/file.txt\\") // \\"/user/local\\"' },
      { name: 'path.extname(path)', desc: 'Get file extension', code: 'path.extname(\\"file.txt\\") // \\".txt\\"' }
    ]
  },
  events: {
    title: 'Events Module',
    items: [
      { name: 'new EventEmitter()', desc: 'Create event emitter instance', code: 'const emitter = new EventEmitter();' },
      { name: 'emitter.on(event, listener)', desc: 'Register event listener', code: 'emitter.on(\\"data\\", (data) => console.log(data));' },
      { name: 'emitter.emit(event, ...args)', desc: 'Trigger event with arguments', code: 'emitter.emit(\\"data\\", { value: 42 });' },
      { name: 'emitter.once(event, listener)', desc: 'Listen once then remove', code: 'emitter.once(\\"ready\\", () => console.log(\\"Ready\\"));' },
      { name: 'emitter.removeListener(event, listener)', desc: 'Remove specific listener', code: 'emitter.removeListener(\\"data\\", handler);' }
    ]
  }
};

var currentTab = 'fs';

function showTab(tab) {
  currentTab = tab;
  render();
}

function render() {
  var tabButtons = Object.keys(tabs).map(function(key) {
    var active = key === currentTab ? ' active' : '';
    return '<button class=\\"tab' + active + '\\" onclick=\\"showTab(\\'' + key + '\\');\\">' + tabs[key].title + '</button>';
  }).join('');
  
  var items = tabs[currentTab].items.map(function(item) {
    return '<div class=\\"api-item\\">' +
      '<div class=\\"api-name\\">' + item.name + '</div>' +
      '<div class=\\"api-desc\\">' + item.desc + '</div>' +
      '<div class=\\"code-snippet\\">' + item.code + '</div>' +
      '</div>';
  }).join('');
  
  document.getElementById('output').innerHTML =
    '<div class=\\"container\\">' +
    '<div class=\\"header\\"><h2>Node.js API Reference</h2><p>Quick lookup for common Node.js built-in modules</p></div>' +
    '<div class=\\"tabs\\">' + tabButtons + '</div>' +
    '<div class=\\"content\\">' +
    '<div class=\\"api-section\\">' +
    '<div class=\\"api-title\\">' + tabs[currentTab].title + '<span class=\\"api-badge\\">Built-in Module</span></div>' +
    items +
    '</div>' +
    '</div>' +
    '</div>';
}

render();`,
    },
  ],
  exercises: [
    {
      id: 'nodejs-ref-1',
      question: 'Which npm command checks for security vulnerabilities in your dependencies?',
      type: 'multiple-choice',
      options: [
        'npm check',
        'npm audit',
        'npm security',
        'npm scan',
      ],
      correct: 1,
      explanation: 'npm audit scans your dependencies for known security vulnerabilities and suggests fixes. Use npm audit fix to automatically update packages with vulnerabilities.',
    },
    {
      id: 'nodejs-ref-2',
      question: 'What is the purpose of the dotenv package?',
      type: 'multiple-choice',
      options: [
        'To create environment folders',
        'To load environment variables from a .env file',
        'To validate environment settings',
        'To deploy to different environments',
      ],
      correct: 1,
      explanation: 'dotenv loads environment variables from a .env file into process.env. This keeps secrets and config out of your code. Never commit .env files to version control.',
    },
  ],
  quiz: [
    {
      id: 'nodejs-ref-q1',
      question: 'Which tool should you use to run a Node.js app in production with auto-restart on crashes?',
      options: [
        'nodemon',
        'node app.js',
        'PM2 or similar process manager',
        'npm start',
      ],
      correct: 2,
      explanation: 'PM2 is a production process manager that keeps your app running, restarts on crashes, handles logging, and manages multiple processes. nodemon is for development only.',
    },
  ],
};
