import { InterviewQuestion } from '@/lib/interview-types';

export const nodejsInterviewQuestions: InterviewQuestion[] = [
  {
    id: 'nodejs-what-is-nodejs',
    category: 'nodejs',
    type: 'theory',
    question: 'What is Node.js and how does it work?',
    difficulty: 'beginner',
    tags: ['fundamentals', 'runtime', 'v8'],
    
    shortAnswer: 'Node.js is a JavaScript runtime built on Chrome\'s V8 engine that lets you run JavaScript on the server. It uses an event-driven, non-blocking I/O model making it efficient for I/O-heavy applications.',
    
    detailedExplanation: 'Node.js executes JavaScript outside the browser using V8 (Google\'s JavaScript engine). It\'s single-threaded but handles concurrency through non-blocking I/O and the event loop. When an async operation starts (like reading a file), Node continues executing other code instead of waiting. When the operation completes, a callback runs. This makes Node excellent for I/O-bound tasks but not CPU-intensive operations.',
    
    example: {
      code: `// Simple HTTP server
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World');
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});

// Non-blocking I/O example
const fs = require('fs');

// Non-blocking (async)
console.log('Start');
fs.readFile('file.txt', 'utf8', (err, data) => {
  console.log('File contents:', data);
});
console.log('End');
// Output: Start, End, File contents: ...

// Blocking (sync)
console.log('Start');
const data = fs.readFileSync('file.txt', 'utf8');
console.log('File contents:', data);
console.log('End');
// Output: Start, File contents: ..., End`,
      language: 'javascript'
    },
    
    interviewAnswer: 'Node.js brings JavaScript to the server using V8. Unlike traditional servers that create a thread per request, Node is single-threaded and uses non-blocking I/O. When I make a database query, Node doesn\'t wait - it moves to the next task. When the query completes, the callback runs. This makes Node great for APIs, real-time apps, and microservices, but not ideal for CPU-heavy tasks like video encoding.',
    
    commonMistakes: [
      'Using Node for CPU-intensive tasks (blocks the event loop)',
      'Not understanding async vs sync operations',
      'Thinking Node is multi-threaded',
      'Not handling errors in callbacks/promises'
    ],
    
    realWorldUse: 'REST APIs, GraphQL servers, real-time applications (chat, gaming), microservices, build tools (webpack, babel), streaming services. Companies like Netflix, LinkedIn, and Uber use Node.',
    
    followUpQuestions: [
      'What is the event loop?',
      'Why is Node.js single-threaded?',
      'When should you NOT use Node.js?'
    ]
  },

  {
    id: 'nodejs-event-loop',
    category: 'nodejs',
    type: 'theory',
    question: 'How does the Node.js event loop work?',
    difficulty: 'advanced',
    tags: ['event-loop', 'async', 'performance'],
    
    shortAnswer: 'The event loop handles async operations in Node. It has phases: timers, pending callbacks, poll, check, close callbacks. It processes callbacks from different queues in order, allowing Node to be non-blocking despite being single-threaded.',
    
    detailedExplanation: 'The event loop is Node\'s mechanism for handling async operations. It has 6 phases that repeat in order: 1) Timers (setTimeout/setInterval), 2) Pending callbacks (system errors), 3) Idle/prepare (internal), 4) Poll (I/O operations), 5) Check (setImmediate), 6) Close callbacks. Between phases, it processes microtasks (Promises). Understanding this helps write performant code and debug timing issues.',
    
    example: {
      code: `// Event loop demonstration
console.log('1: Script start');

setTimeout(() => console.log('2: setTimeout'), 0);

setImmediate(() => console.log('3: setImmediate'));

Promise.resolve().then(() => console.log('4: Promise'));

process.nextTick(() => console.log('5: nextTick'));

console.log('6: Script end');

// Output order:
// 1: Script start
// 6: Script end
// 5: nextTick (microtask, highest priority)
// 4: Promise (microtask)
// 2: setTimeout (timer phase)
// 3: setImmediate (check phase)

// Why this matters - blocking the event loop
// âŒ Bad - blocks everything
function blockingOperation() {
  const start = Date.now();
  while (Date.now() - start < 5000) {
    // Blocks for 5 seconds
  }
  console.log('Done');
}

// âœ… Good - non-blocking
function nonBlockingOperation() {
  setTimeout(() => {
    console.log('Done');
  }, 5000);
}`,
      language: 'javascript'
    },
    
    interviewAnswer: 'The event loop is how Node handles concurrency. It processes different types of callbacks in phases - timers, I/O operations, setImmediate, etc. Between phases, it handles microtasks like Promises. This is why process.nextTick runs before Promise.then, and why setTimeout(fn, 0) doesn\'t run immediately. Understanding this helps me avoid blocking the loop with CPU-heavy sync operations and debug unexpected execution order.',
    
    commonMistakes: [
      'Blocking the event loop with sync operations',
      'Not understanding callback execution order',
      'Confusing setTimeout and setImmediate timing',
      'Using process.nextTick excessively (starves I/O)'
    ],
    
    realWorldUse: 'Critical for performance in production Node apps. Helps debug timing issues, optimize API response times, and prevent server blocking. Monitoring event loop lag is key production metric.',
    
    followUpQuestions: [
      'What\'s the difference between process.nextTick and setImmediate?',
      'How do you prevent blocking the event loop?',
      'What are microtasks vs macrotasks in Node?'
    ]
  },

  {
    id: 'nodejs-middleware',
    category: 'nodejs',
    type: 'theory',
    question: 'What is middleware in Express and how does it work?',
    difficulty: 'intermediate',
    tags: ['express', 'middleware', 'http'],
    
    shortAnswer: 'Middleware functions have access to request, response, and next() in the request-response cycle. They can modify req/res objects, end the request, or call next() to pass control to the next middleware.',
    
    detailedExplanation: 'Express middleware functions execute in order and have access to (req, res, next). They can log requests, parse bodies, authenticate users, handle errors, or anything else. Calling next() passes control to the next middleware. If next() isn\'t called and response isn\'t sent, the request hangs. Error middleware has 4 parameters (err, req, res, next) and catches errors from previous middleware.',
    
    example: {
      code: `const express = require('express');
const app = express();

// Built-in middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.static('public')); // Serve static files

// Custom middleware - logging
app.use((req, res, next) => {
  console.log(\`\${req.method} \${req.url}\`);
  next(); // Pass to next middleware
});

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ error: 'No token' });
  }
  
  // Verify token...
  req.user = { id: 123, name: 'Alex' };
  next();
};

// Route-specific middleware
app.get('/protected', authenticate, (req, res) => {
  res.json({ message: \`Hello \${req.user.name}\` });
});

// Error handling middleware (4 params)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Middleware execution order matters!
app.use('/api', apiRoutes); // Before error handler
app.use(errorHandler);      // After routes`,
      language: 'javascript'
    },
    
    interviewAnswer: 'Middleware is the backbone of Express apps. Each middleware function can inspect/modify the request, perform actions like authentication or logging, and either end the response or call next() to continue. Order matters - I put body parsers early, authentication before protected routes, and error handlers last. Understanding the middleware chain helps me structure APIs logically and debug request flow.',
    
    commonMistakes: [
      'Forgetting to call next() (request hangs)',
      'Calling next() after sending response',
      'Wrong middleware order (error handler before routes)',
      'Not handling async errors (need error middleware or try/catch)'
    ],
    
    realWorldUse: 'Authentication, request logging, body parsing, CORS, rate limiting, request validation. Every Express app uses middleware. Popular packages: cors, helmet, morgan, compression.',
    
    followUpQuestions: [
      'What happens if you don\'t call next()?',
      'How do you handle async errors in middleware?',
      'What\'s the difference between app.use() and app.get()?'
    ]
  },

  {
    id: 'nodejs-streams',
    category: 'nodejs',
    type: 'theory',
    question: 'What are streams in Node.js and when would you use them?',
    difficulty: 'intermediate',
    tags: ['streams', 'performance', 'buffers'],
    
    shortAnswer: 'Streams process data in chunks instead of loading everything into memory. Four types: Readable, Writable, Duplex, Transform. Great for large files, video streaming, or any data that arrives over time.',
    
    detailedExplanation: 'Streams handle data piece by piece, enabling efficient processing of large datasets without loading everything into memory. Readable streams provide data (file reads, HTTP requests), Writable streams consume data (file writes, HTTP responses), Duplex streams do both (TCP sockets), Transform streams modify data as it passes through (compression, encryption). Streams emit events (data, end, error) and can be piped together.',
    
    example: {
      code: `const fs = require('fs');
const zlib = require('zlib');

// Without streams - loads entire file into memory
const data = fs.readFileSync('large-file.txt');
// Memory problem with large files!

// With streams - processes chunks
const readStream = fs.createReadStream('large-file.txt');

readStream.on('data', (chunk) => {
  console.log('Received chunk:', chunk.length);
});

readStream.on('end', () => {
  console.log('Finished reading');
});

readStream.on('error', (err) => {
  console.error('Error:', err);
});

// Piping streams - powerful composition
const input = fs.createReadStream('input.txt');
const output = fs.createWriteStream('output.txt.gz');
const gzip = zlib.createGzip();

// Read â†’ Compress â†’ Write
input.pipe(gzip).pipe(output);

// HTTP streaming
const http = require('http');

http.createServer((req, res) => {
  // Stream video file instead of loading into memory
  const videoStream = fs.createReadStream('video.mp4');
  videoStream.pipe(res);
}).listen(3000);`,
      language: 'javascript'
    },
    
    interviewAnswer: 'Streams are essential for handling large files or continuous data efficiently. Instead of reading a 1GB file into memory, streams process it in small chunks. This keeps memory usage constant and allows processing to start immediately. I use streams for file uploads, video streaming, log processing, or any time data arrives over time. Piping streams together creates powerful data pipelines.',
    
    commonMistakes: [
      'Not handling stream errors (causes crashes)',
      'Not managing backpressure (memory issues)',
      'Using sync methods when streams are better',
      'Not closing streams properly (memory leaks)'
    ],
    
    realWorldUse: 'File uploads, video/audio streaming, real-time data processing, CSV parsing, log analysis, database backups. Streams are how Node handles large data efficiently.',
    
    followUpQuestions: [
      'What is backpressure in streams?',
      'What\'s the difference between pipe() and pipeline()?',
      'When would you use Transform streams?'
    ]
  },

  {
    id: 'nodejs-cluster-workers',
    category: 'nodejs',
    type: 'theory',
    question: 'How do you scale Node.js applications? What is cluster mode?',
    difficulty: 'advanced',
    tags: ['scaling', 'cluster', 'performance'],
    
    shortAnswer: 'Node is single-threaded, so cluster mode spawns multiple Node processes (workers) to utilize all CPU cores. A master process distributes incoming requests across workers, multiplying throughput.',
    
    detailedExplanation: 'Single Node process can\'t use all CPU cores. Cluster module creates child processes that share the same server port. Master process manages workers and distributes connections. If a worker crashes, master spawns a replacement. This allows horizontal scaling on multi-core machines. Alternative: Worker threads for CPU-intensive tasks without creating full processes.',
    
    example: {
      code: `const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(\`Master \${process.pid} is running\`);
  
  // Fork workers (one per CPU core)
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  // Replace dead workers
  cluster.on('exit', (worker, code, signal) => {
    console.log(\`Worker \${worker.process.pid} died\`);
    cluster.fork();
  });
  
} else {
  // Workers share the TCP connection
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(\`Handled by worker \${process.pid}\`);
  }).listen(8000);
  
  console.log(\`Worker \${process.pid} started\`);
}

// Worker threads for CPU-intensive tasks
const { Worker } = require('worker_threads');

function runHeavyTask(data) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./heavy-task.js', {
      workerData: data
    });
    
    worker.on('message', resolve);
    worker.on('error', reject);
  });
}`,
      language: 'javascript'
    },
    
    interviewAnswer: 'Node is single-threaded, which is fine for I/O but wastes CPU cores. Cluster mode solves this by running multiple Node processes (one per core) that share the same port. The OS kernel handles load balancing. This multiplies throughput for I/O-bound apps. For CPU-intensive tasks within a process, I use worker threads. In production, I typically use PM2 which manages clustering automatically.',
    
    commonMistakes: [
      'Not using clustering in production (wasting CPU cores)',
      'Expecting shared memory between workers (they\'re separate processes)',
      'Using cluster for CPU-intensive tasks (use worker threads)',
      'Not handling worker crashes'
    ],
    
    realWorldUse: 'Production Node apps almost always use clustering. PM2 and Kubernetes make this easy. Critical for utilizing server resources efficiently. Alternatives: horizontal scaling with load balancers, serverless functions.',
    
    followUpQuestions: [
      'What\'s the difference between cluster and worker threads?',
      'How do workers share the same port?',
      'How does PM2 manage clustering?'
    ]
  },

  {
    id: 'nodejs-commonjs-esm',
    category: 'nodejs',
    type: 'theory',
    question: 'What is the difference between CommonJS (require) and ES Modules (import)?',
    difficulty: 'beginner',
    tags: ['modules', 'commonjs', 'esm'],
    shortAnswer: 'CommonJS uses require() and module.exports â€” synchronous, loads at runtime, Node.js default. ES Modules use import/export â€” asynchronous, statically analyzable, standard in browsers and modern Node.',
    detailedExplanation: 'CommonJS was Node.js\'s original module system. require() is synchronous and loads the module file. ES Modules (ESM) are the JavaScript standard, used in browsers and Node.js (with .mjs extension or "type":"module" in package.json). ESM imports are static â€” known at parse time â€” enabling tree shaking. ESM supports top-level await. CommonJS cannot import ESM directly.',
    example: {
      code: `// CommonJS (traditional Node.js)
// Exporting
const PI = 3.14;
function add(a, b) { return a + b; }
module.exports = { PI, add };
// or
module.exports.PI = 3.14;

// Importing
const { PI, add } = require('./math');
const math = require('./math'); // math.PI, math.add

// Dynamic import (at runtime)
if (condition) {
  const utils = require('./utils');
}

// ES Modules (modern standard)
// Exporting
export const PI = 3.14;
export function add(a, b) { return a + b; }
export default class Calculator {}

// Named imports
import { PI, add } from './math.js'; // Extension required in ESM
// Default import
import Calculator from './math.js';
// Both
import Calculator, { PI, add } from './math.js';

// Dynamic import (returns Promise)
const { PI } = await import('./math.js');

// package.json - choose module type
{
  "type": "module"   // .js files treated as ESM
}
// or use .mjs extension for ESM files
// or .cjs extension for CommonJS files

// Cannot mix easily
// In ESM file:
// require('./old-module') // âŒ Error! require is not defined
// Must use: import('./old-module')

// Interop
// CommonJS can import ESM with dynamic import
async function loadModule() {
  const { PI } = await import('./esm-module.mjs');
}`,
      language: 'javascript'
    },
    interviewAnswer: 'CommonJS is what I\'ve always used in Node.js â€” synchronous require() that works great for server-side. ES Modules are the modern standard and what browsers use. I use ES Modules in new projects because they enable tree shaking (dead code elimination in bundlers) and top-level await. The key practical difference: ESM imports are hoisted and analyzed statically, CommonJS is dynamic. Most packages support both now via "exports" field in package.json.',
    commonMistakes: [
      'Mixing require() and import in the same file',
      'Forgetting .js extension in ESM imports',
      'Trying to use require() in ESM context',
      'Not understanding that default export and module.exports behave differently'
    ],
    realWorldUse: 'Modern Node.js backends increasingly use ESM. Frontend bundlers (webpack, Vite) work better with ESM for tree shaking. TypeScript compiles to either format.',
    followUpQuestions: [
      'Can you use top-level await in CommonJS?',
      'What is tree shaking?',
      'What is "type": "module" in package.json?'
    ]
  },

  {
    id: 'nodejs-error-handling',
    category: 'nodejs',
    type: 'theory',
    question: 'How do you handle errors properly in Node.js/Express?',
    difficulty: 'intermediate',
    tags: ['error-handling', 'async', 'express'],
    shortAnswer: 'Use try/catch for async/await, pass errors to next(err) in Express, create a global error handling middleware with 4 parameters. Handle uncaughtException and unhandledRejection for process-level errors.',
    detailedExplanation: 'Node.js error handling has several layers. In async Express routes, wrap code in try/catch and call next(err) to pass to error middleware. Express error middleware has 4 params: (err, req, res, next). Process-level: uncaughtException handles sync errors that bubble up, unhandledRejection handles unhandled Promise rejections. In production, log errors with context and never expose stack traces to clients.',
    example: {
      code: `// 1. Try/catch in async route
app.get('/api/user/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    next(err); // Passes to error middleware
  }
});

// 2. Async wrapper to avoid try/catch on every route
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

app.get('/api/user/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new Error('User not found'); // Auto-passed to next
  res.json(user);
}));

// 3. Custom Error class
class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true; // Known, expected errors
  }
}

// 4. Global error middleware (must have 4 params)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  
  // Log error with context
  console.error({ code, message: err.message, stack: err.stack, url: req.url });
  
  // Don't expose internals on unexpected errors
  const message = err.isOperational ? err.message : 'Something went wrong';
  
  res.status(statusCode).json({ error: { code, message } });
});

// 5. Process-level error handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Log to monitoring service
  process.exit(1); // Restart via PM2
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});`,
      language: 'javascript'
    },
    interviewAnswer: 'Error handling in Express requires wrapping async routes in try/catch and passing errors to next(). I create a custom AppError class distinguishing operational errors (404, validation) from programming bugs. The global error middleware formats errors consistently and never exposes stack traces in production. I also handle process-level errors with uncaughtException to prevent silent crashes.',
    commonMistakes: [
      'Forgetting to call next(err) in catch blocks',
      'Not having a global error handler (errors crash app)',
      'Exposing stack traces in production responses',
      'Not handling async errors in event listeners'
    ],
    realWorldUse: 'Every production Node app needs centralized error handling. PM2 restarts the process on uncaughtException. Sentry catches and reports errors with context.',
    followUpQuestions: [
      'What is the difference between uncaughtException and unhandledRejection?',
      'When should you call process.exit()?',
      'What is operational vs programming errors?'
    ]
  },

  {
    id: 'nodejs-env-variables',
    category: 'nodejs',
    type: 'theory',
    question: 'How do you manage environment variables in Node.js?',
    difficulty: 'beginner',
    tags: ['environment', 'configuration', 'dotenv'],
    shortAnswer: 'Use dotenv package to load .env files. Access via process.env.KEY. Never commit .env to git. Validate required vars on startup. Use different values per environment.',
    detailedExplanation: 'Environment variables are the 12-factor app standard for configuration. They let you run the same code with different configs (dev, staging, production). dotenv loads a .env file into process.env. In production, set variables through your cloud provider (Heroku config vars, AWS Parameter Store, Vercel env settings). Validate all required vars on startup to fail fast if misconfigured.',
    example: {
      code: `// .env file (never commit to git!)
NODE_ENV=development
PORT=3000
DATABASE_URL=mongodb://localhost:27017/myapp
JWT_SECRET=dev-secret-change-in-prod
ALLOWED_ORIGIN=http://localhost:5173

// package.json - load env early
// "scripts": { "start": "node -r dotenv/config server.js" }

// Or in code (must be FIRST LINE)
require('dotenv').config();

// Access vars
const port = process.env.PORT || 3000;
const dbUrl = process.env.DATABASE_URL;
const jwtSecret = process.env.JWT_SECRET;

// Config module (recommended pattern)
// config.js
module.exports = {
  port: parseInt(process.env.PORT) || 3000,
  db: {
    url: process.env.DATABASE_URL,
    options: { useNewUrlParser: true }
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  email: {
    apiKey: process.env.EMAIL_API_KEY,
    from: process.env.EMAIL_FROM
  },
  isProduction: process.env.NODE_ENV === 'production'
};

// Validate required env vars on startup
function validateConfig() {
  const required = [
    'DATABASE_URL',
    'JWT_SECRET'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    process.exit(1); // Don't start if misconfigured
  }
  
  if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET === 'dev-secret') {
    console.error('ERROR: Default JWT secret used in production!');
    process.exit(1);
  }
}

validateConfig();

// Multiple .env files
// .env               - defaults
// .env.local         - local overrides (gitignored)
// .env.development   - dev environment
// .env.production    - production (be careful!)
// .env.test          - test environment`,
      language: 'javascript'
    },
    interviewAnswer: 'I use dotenv for local development and platform-specific settings for production â€” Vercel env variables, AWS Parameter Store, or Kubernetes Secrets. I always validate required environment variables on startup with a clear error message rather than failing silently later. I also provide a .env.example file with all the keys documented so teammates know what to set up.',
    commonMistakes: [
      'Committing .env to git',
      'Using same JWT_SECRET in development and production',
      'Not validating required vars on startup',
      'Hardcoding fallback values for sensitive secrets'
    ],
    realWorldUse: 'Every Node.js application uses environment variables. The 12-factor app methodology requires all config in environment variables. Most deployment platforms have env var management built-in.',
    followUpQuestions: [
      'What is the 12-factor app methodology?',
      'How do you share env variables in a team?',
      'What is the difference between .env and .env.local?'
    ]
  },

  {
    id: 'nodejs-cors-setup',
    category: 'nodejs',
    type: 'theory',
    question: 'How do you set up CORS in a Node.js/Express API?',
    difficulty: 'beginner',
    tags: ['cors', 'express', 'security'],
    shortAnswer: 'Use the cors npm package with allowed origins, methods, and headers. For development allow localhost; in production whitelist specific domains. Set credentials:true only when cookies are needed.',
    detailedExplanation: 'CORS must be configured when your frontend and API are on different origins. The cors middleware adds the necessary headers. For simple configuration, allow all origins in development. In production, explicitly whitelist allowed origins. credentials:true is needed for cookies/auth headers but requires explicit origin (not wildcard). Preflight OPTIONS requests need CORS headers too.',
    example: {
      code: `const cors = require('cors');
const express = require('express');
const app = express();

// Development: Allow all origins
app.use(cors());

// Production: Specific configuration
const corsOptions = {
  origin: function(origin, callback) {
    const allowedOrigins = [
      'https://myapp.com',
      'https://www.myapp.com',
      'https://admin.myapp.com'
    ];
    
    // Allow requests with no origin (mobile apps, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,   // Allow cookies/auth headers
  maxAge: 86400        // Cache preflight for 24 hours
};

app.use(cors(corsOptions));

// Must handle OPTIONS preflight explicitly
app.options('*', cors(corsOptions));

// Or allow different origins per route
app.get('/api/public', cors(), publicHandler);
app.get('/api/private', cors(strictOptions), privateHandler);

// Environment-based config
const corsConfig = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.ALLOWED_ORIGINS?.split(',') || []
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
};

app.use(cors(corsConfig));

// Common CORS error and cause:
// "Access to fetch at 'http://api.com' from origin 'http://frontend.com'
// has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header"
// Fix: Add CORS middleware on the API server`,
      language: 'javascript'
    },
    interviewAnswer: 'CORS is configured on the API server, not the frontend. I use the cors package with explicit allowed origins in production â€” never wildcard in production with credentials. I pass ALLOWED_ORIGINS as an environment variable so it can differ per deployment. The most common mistake is forgetting to handle OPTIONS preflight requests, which causes issues with custom headers or auth.',
    commonMistakes: [
      'Using wildcard origin with credentials:true (browsers reject this)',
      'Not handling OPTIONS preflight requests',
      'Forgetting CORS errors happen in browser only (Postman doesn\'t care)',
      'Not configuring CORS per environment'
    ],
    realWorldUse: 'Every separate frontend/backend deployment needs CORS. React dev server on port 3000 calling Express on port 5000 is a classic case. Vercel deployments calling Railway APIs need CORS.',
    followUpQuestions: [
      'Why does Postman not have CORS issues?',
      'What is a preflight request?',
      'Can you have different CORS rules for different routes?'
    ]
  },

  {
    id: 'nodejs-file-upload',
    category: 'nodejs',
    type: 'theory',
    question: 'How do you handle file uploads in Node.js/Express?',
    difficulty: 'intermediate',
    tags: ['file-upload', 'multer', 'express'],
    shortAnswer: 'Use multer middleware to handle multipart/form-data. Store locally during development, use cloud storage (AWS S3, Cloudinary) in production. Validate file type and size.',
    detailedExplanation: 'HTTP forms with file inputs use multipart/form-data encoding. multer parses this format in Express. For security, always validate file type by MIME type not just extension, limit file sizes, and sanitize filenames. Never serve uploaded files from the same directory as code. In production, upload to cloud storage (S3) and store only the URL in the database.',
    example: {
      code: `const multer = require('multer');
const path = require('path');

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Local folder (dev only)
  },
  filename: (req, file, cb) => {
    // Sanitize filename - don't trust user input!
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

// File filter - validate by MIME type
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);  // Accept
  } else {
    cb(new Error('Only JPEG, PNG, WebP allowed'), false); // Reject
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Max 5 files
  }
});

// Single file upload
app.post('/api/avatar', upload.single('avatar'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const url = \`/uploads/\${req.file.filename}\`;
  res.json({ url, filename: req.file.filename });
});

// Multiple files
app.post('/api/gallery', upload.array('photos', 10), (req, res) => {
  const urls = req.files.map(f => \`/uploads/\${f.filename}\`);
  res.json({ urls });
});

// Production: Upload to AWS S3
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const s3 = new S3Client({ region: 'us-east-1' });

// Memory storage for S3 upload
const memUpload = multer({ storage: multer.memoryStorage() });

app.post('/api/avatar', memUpload.single('avatar'), async (req, res) => {
  const key = \`avatars/\${Date.now()}-\${req.file.originalname}\`;
  
  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: req.file.buffer,
    ContentType: req.file.mimetype
  }));
  
  const url = \`https://\${process.env.S3_BUCKET}.s3.amazonaws.com/\${key}\`;
  
  await User.findByIdAndUpdate(req.user.id, { avatar: url });
  res.json({ url });
});`,
      language: 'javascript'
    },
    interviewAnswer: 'File uploads need careful handling. multer makes parsing multipart forms easy. I always validate MIME type in the fileFilter (not just the extension â€” extensions can be faked), set size limits, and sanitize filenames. In development I store locally; in production I upload directly to S3 and store only the URL in the database. Never store uploaded files in the same directory as application code.',
    commonMistakes: [
      'Trusting file extension instead of MIME type',
      'No file size limits (DoS via large files)',
      'Trusting original filename (path traversal attacks)',
      'Storing files on server disk in production (they\'re lost on redeploy)'
    ],
    realWorldUse: 'Profile picture uploads, document uploads, image galleries. Every app with user-generated content needs file upload handling. Cloudinary is popular for images with automatic optimization.',
    followUpQuestions: [
      'Why should you validate MIME type instead of file extension?',
      'What is a presigned URL for S3?',
      'How do you handle upload progress?'
    ]
  },

  {
    id: 'nodejs-package-json',
    category: 'nodejs',
    type: 'theory',
    question: 'What is package.json? Explain dependencies vs devDependencies.',
    difficulty: 'beginner',
    tags: ['npm', 'package-json', 'dependencies'],
    shortAnswer: 'package.json defines project metadata, scripts, and dependencies. dependencies are needed in production. devDependencies are only needed for development/building (testing, linting, bundling).',
    detailedExplanation: 'package.json is the manifest for a Node.js project. It contains name, version, scripts (run with npm run), dependencies (runtime packages), and devDependencies (build/test packages). npm install installs both in development. npm install --production installs only dependencies. This matters for deployment image size and security (fewer packages = smaller attack surface).',
    example: {
      code: `// package.json
{
  "name": "my-api",
  "version": "1.0.0",
  "description": "REST API with Express",
  "main": "src/server.js",
  "type": "module", // Use ES modules
  
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "build": "tsc",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix"
  },
  
  "dependencies": {
    // Needed to RUN the application in production
    "express": "^4.18.2",
    "mongoose": "^7.6.3",
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.3.1",
    "express-rate-limit": "^7.1.5"
  },
  
  "devDependencies": {
    // Only needed for DEVELOPMENT/BUILD - not in production
    "nodemon": "^3.0.1",       // Auto-restart during dev
    "jest": "^29.7.0",         // Testing framework
    "supertest": "^6.3.3",     // HTTP testing
    "eslint": "^8.53.0",       // Code linting
    "prettier": "^3.0.3",      // Code formatting
    "typescript": "^5.2.2",    // TypeScript compiler
    "@types/express": "^4.17.21" // Type definitions
  },
  
  "engines": {
    "node": ">=18.0.0"
  }
}

// Install production deps only (for deployment)
// npm install --omit=dev
// or
// npm ci --only=production

// Version ranges
// "^4.18.2"  - Compatible changes (4.x.x)
// "~4.18.2"  - Patch changes only (4.18.x)
// "4.18.2"   - Exact version
// "*"        - Any version (dangerous!)
// ">=4.0.0"  - At least 4.0.0

// Lock file (package-lock.json) ensures exact versions
// Always commit package-lock.json!`,
      language: 'json'
    },
    interviewAnswer: 'package.json defines what packages my app needs. The key distinction between dependencies and devDependencies matters for deployment â€” I only install dependencies in production Docker images to keep them small and secure. devDependencies include testing frameworks, linters, TypeScript compiler â€” things only needed during development. I always commit package-lock.json to ensure everyone uses the exact same package versions.',
    commonMistakes: [
      'Putting devDependencies in dependencies (bloats production)',
      'Not committing package-lock.json (inconsistent versions)',
      'Using * as version (breaks on new releases)',
      'Not specifying engines (wrong Node version in deployment)'
    ],
    realWorldUse: 'Every Node.js project has package.json. Docker builds use --omit=dev to skip devDependencies. CI/CD pipelines use npm ci instead of npm install for reproducible installs.',
    followUpQuestions: [
      'What is the difference between npm install and npm ci?',
      'What does package-lock.json do?',
      'What is semantic versioning?'
    ]
  },

  {
    id: 'nodejs-buffers',
    category: 'nodejs',
    type: 'theory',
    question: 'What are Buffers in Node.js?',
    difficulty: 'intermediate',
    tags: ['buffers', 'binary', 'streams'],
    shortAnswer: 'Buffers are fixed-size chunks of binary data in Node.js, used before proper TypedArrays existed. They represent raw memory and are used for file I/O, network data, and binary protocols.',
    detailedExplanation: 'Buffers hold raw binary data outside the V8 heap. They\'re used when dealing with streams, file I/O, network protocols, encryption, and binary data processing. Buffer.from() creates buffers from strings/arrays. Buffer methods convert between encodings (utf8, hex, base64). With TypedArrays, Buffers are now based on Uint8Array. Important for working with binary data, images, and network protocols.',
    example: {
      code: `// Creating buffers
const buf1 = Buffer.alloc(10);          // 10 bytes, filled with 0
const buf2 = Buffer.alloc(10, 1);       // 10 bytes, filled with 1
const buf3 = Buffer.allocUnsafe(10);    // 10 bytes, uninitialized (faster)

// From string
const buf4 = Buffer.from('Hello World', 'utf8');
const buf5 = Buffer.from('SGVsbG8=', 'base64');

// Convert buffer to string
buf4.toString('utf8');     // 'Hello World'
buf4.toString('hex');      // '48656c6c6f20576f726c64'
buf4.toString('base64');   // 'SGVsbG8gV29ybGQ='

// Reading/writing binary data
const buf = Buffer.alloc(8);
buf.writeInt32BE(12345, 0);  // Write 4-byte int at offset 0
buf.writeFloat32BE(3.14, 4); // Write 4-byte float at offset 4

const int = buf.readInt32BE(0);    // 12345
const float = buf.readFloat32BE(4); // 3.14

// Comparing and concatenating
const combined = Buffer.concat([buf4, Buffer.from(' World')]);

// Common use case: file data
const fs = require('fs');
const fileData = fs.readFileSync('image.png'); // Returns Buffer
console.log(fileData instanceof Buffer); // true
console.log(fileData.length); // File size in bytes

// Base64 encoding (common for image uploads)
const imageBase64 = fileData.toString('base64');
// Store as data URL: data:image/png;base64,{imageBase64}

// Buffer in streams (chunks are Buffers)
readStream.on('data', (chunk) => {
  // chunk is a Buffer
  console.log('Received:', chunk.length, 'bytes');
});`,
      language: 'javascript'
    },
    interviewAnswer: 'Buffers come up when working with binary data â€” file uploads, image processing, network protocols, or encryption. They\'re chunks of raw bytes. The most common operations I do are converting to/from base64 (for image data URLs) and converting between string encodings. In streams, the data event chunks are Buffers. Modern Node.js also supports TypedArrays which work similarly.',
    commonMistakes: [
      'Using allocUnsafe without initializing (contains old data)',
      'Not specifying encoding when creating from string',
      'Confusion between Buffer length (bytes) and string length (chars)',
      'Memory leaks from not releasing large Buffers'
    ],
    realWorldUse: 'File I/O, image processing (Sharp library), JWT signing (binary HMAC), TCP/UDP networking, compression, encryption. Any time you need to work with raw bytes.',
    followUpQuestions: [
      'What is the difference between Buffer.alloc and Buffer.allocUnsafe?',
      'How does Buffer relate to TypedArray?',
      'What encoding types does Buffer support?'
    ]
  },

  {
    id: 'nodejs-process-object',
    category: 'nodejs',
    type: 'theory',
    question: 'What is the process object in Node.js?',
    difficulty: 'beginner',
    tags: ['process', 'nodejs', 'environment'],
    shortAnswer: 'process is a global object in Node.js that provides info about and control over the current process. Key properties: process.env, process.argv, process.exit(), process.cwd(), process.on().',
    detailedExplanation: 'The process object is an EventEmitter providing process control. process.env contains environment variables. process.argv is an array of command-line arguments. process.exit(code) terminates the process (0=success, 1=error). process.cwd() returns current directory. process.on() handles process-level events like uncaughtException and SIGTERM. process.stdout/stderr/stdin are streams.',
    example: {
      code: `// Environment variables
const dbUrl = process.env.DATABASE_URL;
const port = parseInt(process.env.PORT) || 3000;
const isDev = process.env.NODE_ENV === 'development';

// Command line args
// Running: node app.js --port 3000 --debug
console.log(process.argv);
// ['node', '/path/to/app.js', '--port', '3000', '--debug']

// Parse args
const args = process.argv.slice(2);
const portIndex = args.indexOf('--port');
const portArg = portIndex > -1 ? parseInt(args[portIndex + 1]) : 3000;

// Working directory
console.log(process.cwd()); // Current directory
console.log(process.chdir('/tmp')); // Change directory

// Process info
console.log(process.pid);      // Process ID
console.log(process.version);  // Node.js version
console.log(process.platform); // 'win32', 'linux', 'darwin'
console.log(process.memoryUsage()); // Memory stats

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM â€” shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Standard streams
process.stdout.write('Hello ');
process.stdout.write('World\n');
process.stderr.write('Error message\n');

// Read from stdin
process.stdin.on('data', (data) => {
  console.log('Received:', data.toString());
});

// Exit with code
process.exit(0); // Success
process.exit(1); // Error`,
      language: 'javascript'
    },
    interviewAnswer: 'process.env is the most used â€” every application reads configuration from environment variables. I also use process.on("SIGTERM") for graceful shutdown in production: when Kubernetes or Docker sends SIGTERM, I close the HTTP server cleanly before exiting instead of dropping active requests. process.exit() is useful in CLI tools but avoid it in server applications unless you\'ve cleaned up first.',
    commonMistakes: [
      'Calling process.exit() without cleanup in servers',
      'Accessing process.env values without defaults',
      'Not converting process.env strings to numbers',
      'Confusing process.cwd() with __dirname'
    ],
    realWorldUse: 'Environment configuration, CLI tools, graceful shutdown, monitoring memory usage, handling OS signals. PM2 and Docker both send SIGTERM for graceful shutdown.',
    followUpQuestions: [
      'What is the difference between process.cwd() and __dirname?',
      'How do you handle uncaught exceptions with process?',
      'What signals can Node.js receive?'
    ]
  },

  {
    id: 'nodejs-child-process',
    category: 'nodejs',
    type: 'theory',
    question: 'What are child processes in Node.js? When would you use them?',
    difficulty: 'advanced',
    tags: ['child-process', 'spawn', 'exec', 'fork'],
    shortAnswer: 'Child processes run external commands or Node.js scripts in separate processes. Four methods: exec (shell command, buffered), spawn (streaming), fork (Node.js script with IPC), execFile (binary directly).',
    detailedExplanation: 'Node\'s single-threaded model blocks on CPU-intensive work. Child processes solve this by offloading work to separate processes. exec() runs a shell command and buffers output. spawn() streams output for large data. fork() spawns a Node.js module and enables inter-process communication (IPC). execFile() runs a binary directly (more secure than exec). Use for: shell commands, CPU-intensive work, running other programs.',
    example: {
      code: `const { exec, spawn, fork } = require('child_process');

// exec - run shell command (buffers output)
exec('ls -la', (error, stdout, stderr) => {
  if (error) {
    console.error('Error:', error.message);
    return;
  }
  console.log(stdout);
});

// exec with promise
const { promisify } = require('util');
const execAsync = promisify(exec);

async function listFiles() {
  const { stdout } = await execAsync('ls -la');
  return stdout;
}

// spawn - streaming output (good for large output)
const ls = spawn('ls', ['-la', '/usr']);

ls.stdout.on('data', (data) => {
  console.log('Output:', data.toString());
});

ls.stderr.on('data', (data) => {
  console.error('Error:', data.toString());
});

ls.on('close', (code) => {
  console.log('Process exited with code:', code);
});

// fork - spawn Node.js module with IPC
// worker.js
process.on('message', (data) => {
  const result = heavyCalculation(data);
  process.send({ result }); // IPC message back to parent
});

// main.js
const worker = fork('./worker.js');

worker.send({ numbers: [1, 2, 3, 4, 5] });

worker.on('message', ({ result }) => {
  console.log('Result from worker:', result);
});

// Real use case: run ffmpeg for video processing
function convertVideo(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', [
      '-i', inputPath,
      '-codec:v', 'libx264',
      outputPath
    ]);
    
    ffmpeg.on('close', (code) => {
      if (code === 0) resolve(outputPath);
      else reject(new Error(\`ffmpeg failed with code \${code}\`));
    });
  });
}`,
      language: 'javascript'
    },
    interviewAnswer: 'Child processes are how Node handles CPU-intensive work or external programs without blocking the event loop. exec() for simple shell commands with small output. spawn() when I need streaming output (like running git commands that return lots of text). fork() when I need to run another Node.js module and communicate with it â€” like offloading image processing or PDF generation to a worker process.',
    commonMistakes: [
      'Using exec() for commands with large output (use spawn instead)',
      'Not handling errors in child process callbacks',
      'Shell injection with unsanitized exec() input',
      'Forgetting to handle close/error events'
    ],
    realWorldUse: 'Video/image processing (ffmpeg), running shell scripts, PDF generation, git operations, CPU-intensive computations, running Python/Ruby scripts from Node.',
    followUpQuestions: [
      'What is the difference between exec and spawn?',
      'How is fork different from spawn?',
      'What is IPC in the context of child processes?'
    ]
  },

  {
    id: 'nodejs-event-emitter',
    category: 'nodejs',
    type: 'theory',
    question: 'What is the EventEmitter class in Node.js?',
    difficulty: 'intermediate',
    tags: ['EventEmitter', 'events', 'pub-sub'],
    shortAnswer: 'EventEmitter is a core Node.js class for implementing pub/sub pattern. Objects emit named events; listeners subscribe with on(). Most Node.js core objects (HTTP server, streams, fs) extend EventEmitter.',
    detailedExplanation: 'Node.js is built on events. EventEmitter provides emit(event, ...args) to fire events and on(event, listener) to subscribe. once() subscribes for one invocation. removeListener() unsubscribes. Many core Node objects extend EventEmitter: http.Server emits "request", streams emit "data"/"end"/"error", process emits "exit"/"uncaughtException". Custom classes can extend EventEmitter for decoupled event-driven architecture.',
    example: {
      code: `const EventEmitter = require('events');

// Creating a custom EventEmitter
class OrderService extends EventEmitter {
  async createOrder(orderData) {
    const order = await saveOrderToDb(orderData);
    
    // Emit event â€” other services listen without being coupled
    this.emit('order:created', order);
    this.emit('order:payment:required', { orderId: order.id, amount: order.total });
    
    return order;
  }
  
  async cancelOrder(orderId) {
    const order = await cancelOrderInDb(orderId);
    this.emit('order:cancelled', { orderId, reason: 'User cancelled' });
    return order;
  }
}

const orderService = new OrderService();

// Email service listens to order events
orderService.on('order:created', async (order) => {
  await sendEmail({
    to: order.userEmail,
    subject: 'Order Confirmation',
    template: 'order-created',
    data: order
  });
});

// Inventory service listens
orderService.on('order:created', async (order) => {
  await decrementInventory(order.items);
});

// Analytics listens
orderService.on('order:created', (order) => {
  analytics.track('order_created', { value: order.total });
});

// Once listener
orderService.once('order:created', (order) => {
  console.log('First order ever:', order.id);
});

// Error handling â€” ALWAYS listen for 'error' on EventEmitters!
orderService.on('error', (err) => {
  console.error('OrderService error:', err);
});

// Core Node.js EventEmitter examples
const http = require('http');
const server = http.createServer();

server.on('request', (req, res) => {
  res.end('Hello!');
});

server.on('listening', () => {
  console.log('Server started');
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(3000);`,
      language: 'javascript'
    },
    interviewAnswer: 'EventEmitter is Node\'s backbone for decoupled architecture. When an order is created, I emit an event and let email, inventory, and analytics services react independently â€” no service needs to know about the others. This is the pub/sub pattern. The key rule: always add an error listener to any EventEmitter. If an "error" event is emitted without a listener, Node crashes.',
    commonMistakes: [
      'Not listening for "error" events (Node throws unhandled error)',
      'Memory leaks from not removing listeners',
      'Emitting events before listeners are registered',
      'Maximum listeners warning (default 10 â€” use setMaxListeners)'
    ],
    realWorldUse: 'Event-driven architecture, WebSocket servers, build tools, test frameworks (Mocha, Jest), stream processing. Express uses EventEmitter internally.',
    followUpQuestions: [
      'What happens if you emit an "error" event with no listener?',
      'How do you prevent memory leaks with EventEmitter?',
      'What is the difference between on() and once()?'
    ]
  },
  {
    id: 'nodejs-memory-leak',
    category: 'nodejs',
    type: 'theory',
    question: 'How do you identify and fix a memory leak in a Node.js application?',
    difficulty: 'advanced',
    tags: ['nodejs', 'memory', 'debugging', 'performance'],
    shortAnswer: 'Use --inspect flag + Chrome DevTools heap snapshots to identify objects accumulating. Common causes: event listeners not removed, closures holding references, global caches without eviction, circular references.',
    detailedExplanation: 'Steps: (1) observe heap growth with process.memoryUsage(); (2) take heap snapshots before/after with Chrome DevTools; (3) diff snapshots to find retaining objects; (4) fix: remove event listeners on cleanup, use WeakMap for caches, implement eviction in in-memory stores.',
    example: {
      code: `// Common leak: event listener accumulation
class Service extends EventEmitter {
  start() {
    process.on('exit', this.cleanup); // ❌ adds a listener every call
  }
  // Fix:
  start() {
    process.once('exit', this.cleanup.bind(this)); // fires once
  }
}

// Detect with process.memoryUsage()
setInterval(() => {
  const { heapUsed } = process.memoryUsage();
  console.log('Heap:', Math.round(heapUsed / 1024 / 1024), 'MB');
}, 5000);

// Node.js --inspect flag for Chrome DevTools
// node --inspect app.js
// Open chrome://inspect → Memory tab → Take Heap Snapshot`,
      language: 'javascript'
    },
    interviewAnswer: 'Walk through the diagnosis process: observe, snapshot, diff, fix. Cite the three most common causes.',
    commonMistakes: ['Adding process.on() listeners in a hot path without removeListener', 'Using a plain object as a cache without a max-size eviction policy'],
    realWorldUse: 'Long-running API servers, WebSocket services, background workers.',
    followUpQuestions: ['What is a WeakMap and how does it help prevent leaks?', 'What is clinic.js?']
  },

  {
    id: 'nodejs-worker-threads',
    category: 'nodejs',
    type: 'theory',
    question: 'What are Worker Threads in Node.js and how do they differ from the cluster module?',
    difficulty: 'advanced',
    tags: ['nodejs', 'worker-threads', 'concurrency', 'cluster'],
    shortAnswer: 'Worker Threads run JavaScript in parallel threads within the same process, sharing memory via SharedArrayBuffer. Cluster forks full OS processes (copies of the entire app) to handle multiple requests. Workers are for CPU-bound tasks; cluster is for scaling HTTP throughput.',
    detailedExplanation: 'Node.js main thread is single-threaded. Worker Threads (worker_threads module) create real OS threads that can run JS in parallel — ideal for CPU-intensive work (encryption, image processing) that would block the event loop. Cluster creates child processes with separate event loops, memory, and V8 instances — each can handle its own HTTP requests, scaling across CPU cores.',
    example: {
      code: `// worker_threads — CPU-bound task
const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename);
  worker.on('message', result => console.log('Hash:', result));
  worker.postMessage({ data: 'compute-heavy-string' });
} else {
  parentPort.on('message', ({ data }) => {
    const hash = expensiveHash(data); // runs in separate thread
    parentPort.postMessage(hash);
  });
}

// Cluster — scale HTTP server across CPU cores
const cluster = require('cluster');
const os = require('os');

if (cluster.isPrimary) {
  os.cpus().forEach(() => cluster.fork()); // one worker per core
} else {
  require('./server'); // each worker runs the full server
}`,
      language: 'javascript'
    },
    interviewAnswer: 'Key distinction: same process/shared memory (worker_threads) vs separate processes/no shared memory (cluster). Workers for CPU tasks, cluster for throughput.',
    commonMistakes: ['Using cluster for CPU-bound work — it duplicates memory, not improves parallelism for one request', 'Sharing mutable state between worker threads without synchronisation'],
    realWorldUse: 'Worker threads: PDF generation, video transcoding, ML inference. Cluster: production HTTP API servers.',
    followUpQuestions: ['What is SharedArrayBuffer and Atomics?', 'How does PM2 use cluster under the hood?']
  },

  {
    id: 'nodejs-libuv',
    category: 'nodejs',
    type: 'theory',
    question: 'What is libuv and what role does it play in Node.js?',
    difficulty: 'advanced',
    tags: ['nodejs', 'libuv', 'event-loop', 'internals'],
    shortAnswer: 'libuv is the C library that powers Node.js\'s event loop, async I/O, and the thread pool. When Node.js calls fs.readFile or a DNS lookup, libuv handles the OS-level async operation and posts a callback to the event loop when done.',
    detailedExplanation: 'The Node.js event loop runs on a single thread but delegates I/O, DNS, crypto, and file operations to libuv\'s thread pool (default 4 threads, configurable with UV_THREADPOOL_SIZE). Network I/O uses OS-level async primitives (epoll/kqueue/IOCP) — no thread pool needed. This is why Node.js can handle thousands of concurrent connections on a single thread.',
    example: {
      code: `// libuv thread pool in action
const crypto = require('crypto');

// These run on libuv's thread pool (blocking I/O offloaded)
crypto.pbkdf2('password', 'salt', 100000, 64, 'sha512', (err, key) => {
  console.log('hash done');
});

// Increase thread pool for more concurrent crypto/fs operations
// UV_THREADPOOL_SIZE=8 node app.js

// Network I/O does NOT use thread pool — uses OS epoll
// So thousands of HTTP connections = no thread pool pressure
const http = require('http');
http.get('http://example.com', res => { /* handled by epoll */ });`,
      language: 'javascript'
    },
    interviewAnswer: 'Explain the thread pool (for file/crypto/DNS) vs OS async primitives (for network) split. UV_THREADPOOL_SIZE is an important tuning lever for crypto-heavy apps.',
    commonMistakes: ['Thinking all I/O uses the thread pool — network I/O does not', 'Not knowing the default thread pool size is 4'],
    realWorldUse: 'Tuning Node.js for high-concurrency crypto (password hashing), understanding why heavy fs.readFile loops can bottleneck.',
    followUpQuestions: ['What are the phases of the Node.js event loop?', 'What is UV_THREADPOOL_SIZE?']
  },

  {
    id: 'nodejs-streams-pipe',
    category: 'nodejs',
    type: 'theory',
    question: 'How does stream piping work in Node.js and what is backpressure?',
    difficulty: 'advanced',
    tags: ['nodejs', 'streams', 'backpressure', 'performance'],
    shortAnswer: 'pipe() connects a readable stream to a writable stream and automatically handles backpressure — pausing the readable when the writable\'s buffer is full, preventing out-of-memory crashes when processing large files.',
    detailedExplanation: 'Without backpressure, a fast readable (network download) could overwhelm a slow writable (disk write), buffering the entire file in memory. pipe() calls readable.pause() when writable.write() returns false, and resumes on the "drain" event. The pipeline() utility handles error propagation across multiple streams automatically.',
    example: {
      code: `const { pipeline } = require('stream/promises');
const fs = require('fs');
const zlib = require('zlib');

// Process a 10GB file without loading it into memory
async function compressFile(input, output) {
  await pipeline(
    fs.createReadStream(input),          // readable
    zlib.createGzip(),                   // transform
    fs.createWriteStream(output)         // writable
  );
  console.log('Done — backpressure handled automatically');
}

// Manual backpressure (without pipe)
readable.on('data', chunk => {
  const ok = writable.write(chunk);
  if (!ok) {
    readable.pause();                    // slow down!
    writable.once('drain', () => readable.resume());
  }
});`,
      language: 'javascript'
    },
    interviewAnswer: 'Explain the readable-pause/writable-drain mechanism. pipeline() vs pipe() distinction: pipeline handles errors across the chain and cleans up.',
    commonMistakes: ['Using pipe() in production — it doesn\'t handle errors; use pipeline()', 'Collecting stream data into a full buffer (defeating the purpose)'],
    realWorldUse: 'File uploads, video streaming, CSV/log processing, HTTP response streaming.',
    followUpQuestions: ['What is the difference between pipe() and pipeline()?', 'What are Transform streams?']
  },

  {
    id: 'nodejs-http2',
    category: 'nodejs',
    type: 'theory',
    question: 'What advantages does HTTP/2 offer over HTTP/1.1 and how do you enable it in Node.js?',
    difficulty: 'intermediate',
    tags: ['nodejs', 'http2', 'performance', 'networking'],
    shortAnswer: 'HTTP/2 adds: multiplexing (multiple requests over one TCP connection), header compression (HPACK), server push, and binary framing. This eliminates HTTP/1.1 head-of-line blocking and the need for domain sharding.',
    detailedExplanation: 'HTTP/1.1 allows only one request per connection at a time (or pipelining, which is fragile). HTTP/2 multiplexes streams over a single connection — many requests/responses interleaved. Header compression reduces overhead significantly for API-heavy apps. Node.js has a built-in http2 module; in production, TLS is required.',
    example: {
      code: `const http2 = require('http2');
const fs = require('fs');

const server = http2.createSecureServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
});

server.on('stream', (stream, headers) => {
  const path = headers[':path'];
  stream.respond({ ':status': 200, 'content-type': 'text/html' });
  stream.end('<h1>HTTP/2 response</h1>');
});

server.listen(8443);

// Server push — proactively send CSS before browser requests it
server.on('stream', (stream, headers) => {
  if (headers[':path'] === '/') {
    stream.pushStream({ ':path': '/style.css' }, (err, push) => {
      push.respond({ ':status': 200 });
      push.end(fs.readFileSync('style.css'));
    });
  }
});`,
      language: 'javascript'
    },
    interviewAnswer: 'Lead with multiplexing solving head-of-line blocking. Mention that in practice, most Node.js apps get HTTP/2 through a reverse proxy (Nginx, Caddy) rather than directly.',
    commonMistakes: ['Thinking HTTP/2 requires rewriting application code — it\'s transparent to most apps', 'Not knowing HTTP/2 requires TLS in practice'],
    realWorldUse: 'High-performance APIs, SPAs with many small asset requests, gRPC (uses HTTP/2 under the hood).',
    followUpQuestions: ['What is HTTP/3 and how does it differ?', 'What is gRPC and how does it use HTTP/2?']
  },

  {
    id: 'nodejs-rate-limiting',
    category: 'nodejs',
    type: 'theory',
    question: 'How do you implement rate limiting in a Node.js/Express API?',
    difficulty: 'intermediate',
    tags: ['nodejs', 'express', 'rate-limiting', 'security'],
    shortAnswer: 'Use express-rate-limit for basic per-IP limiting. For distributed systems use Redis with a sliding window algorithm (rate-limiter-flexible). Always apply rate limiting per user/IP, per endpoint, and return 429 with Retry-After header.',
    detailedExplanation: 'Rate limiting protects against DDoS, brute-force, and API abuse. Strategies: fixed window (simple but allows burst at window edge), sliding window (more accurate), token bucket (allows controlled bursts). In multi-server environments, in-memory stores per process don\'t work — use Redis.',
    example: {
      code: `const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('ioredis');

// Basic in-memory (single server only)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // max 100 requests per window
  standardHeaders: true,     // Return RateLimit-* headers
  legacyHeaders: false,
  message: { error: 'Too many requests' },
});

// Redis-backed (works across multiple servers)
const distributedLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  store: new RedisStore({ sendCommand: (...args) => redis.call(...args) }),
});

// Apply per-route or globally
app.use('/api/', limiter);
app.use('/api/auth/login', strictLimiter); // stricter on auth`,
      language: 'javascript'
    },
    interviewAnswer: 'Mention the in-memory vs Redis distinction for distributed systems. Bring up the 429 status code and Retry-After header as best practice.',
    commonMistakes: ['Using in-memory rate limiting behind a load balancer — each server has its own counter', 'Not differentiating between global rate limits and per-endpoint limits (auth needs stricter limits)'],
    realWorldUse: 'Login/signup endpoints, API keys, any public-facing API.',
    followUpQuestions: ['What is the difference between rate limiting and throttling?', 'How do you handle legitimate users who hit rate limits?']
  },

  {
    id: 'nodejs-graceful-shutdown',
    category: 'nodejs',
    type: 'theory',
    question: 'How do you implement graceful shutdown in a Node.js HTTP server?',
    difficulty: 'intermediate',
    tags: ['nodejs', 'production', 'shutdown', 'reliability'],
    shortAnswer: 'Listen for SIGTERM/SIGINT, stop accepting new connections, wait for in-flight requests to complete (with a timeout), close database connections, then exit. This prevents request drops during Kubernetes pod restarts or deployments.',
    detailedExplanation: 'When a process receives SIGTERM (from Kubernetes, Docker, or kill), abruptly exiting drops any in-progress HTTP requests. Graceful shutdown: (1) stop accepting new connections (server.close()), (2) let active requests finish, (3) close DB/Redis connections, (4) exit. A deadline timeout (e.g. 30s) forces exit if something is stuck.',
    example: {
      code: `const server = app.listen(3000);

function shutdown() {
  console.log('Received shutdown signal');

  // 1. Stop accepting new connections
  server.close(async () => {
    // 2. In-flight requests have finished — clean up
    console.log('All requests completed');
    await db.disconnect();
    await redis.quit();
    process.exit(0);
  });

  // 3. Force exit if shutdown takes too long
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30_000);
}

process.on('SIGTERM', shutdown); // Docker/Kubernetes stop
process.on('SIGINT', shutdown);  // Ctrl+C

// Kubernetes needs terminationGracePeriodSeconds matching the timeout`,
      language: 'javascript'
    },
    interviewAnswer: 'Walk through the four steps. Mention Kubernetes SIGTERM flow and the timeout as a safety net.',
    commonMistakes: ['Calling process.exit(0) immediately on SIGTERM — drops in-flight requests', 'Not closing DB connections — causes connection pool leaks on restart'],
    realWorldUse: 'Any Node.js service deployed in Kubernetes, Docker Swarm, or behind a load balancer.',
    followUpQuestions: ['What is the difference between SIGTERM and SIGKILL?', 'How does Kubernetes handle rolling deployments with Node.js?']
  },

  {
    id: 'nodejs-prisma-orm',
    category: 'nodejs',
    type: 'theory',
    question: 'What is the N+1 query problem and how do you solve it in Node.js/Express APIs?',
    difficulty: 'intermediate',
    tags: ['nodejs', 'database', 'orm', 'performance', 'n+1'],
    shortAnswer: 'The N+1 problem: fetching 1 list of items then running N queries to fetch related data for each item. Solution: use JOINs (SQL), eager loading (Prisma include / Sequelize include), or DataLoader for GraphQL batching.',
    detailedExplanation: 'N+1 is the most common ORM performance trap. You fetch 100 users, then for each user call the DB to get their profile — 101 queries instead of 1. ORMs like Prisma solve it with include (which generates a JOIN or batch query). DataLoader batches and caches DB calls within a single request.',
    example: {
      code: `// ❌ N+1 problem
const users = await User.findAll(); // 1 query
for (const user of users) {
  user.posts = await Post.findAll({ where: { userId: user.id } }); // N queries
}

// ✅ Prisma eager loading (1 query with JOIN)
const users = await prisma.user.findMany({
  include: { posts: true } // single query with LEFT JOIN
});

// ✅ Raw SQL with JOIN
const users = await db.query(\`
  SELECT u.*, p.title
  FROM users u
  LEFT JOIN posts p ON p.user_id = u.id
\`);

// ✅ DataLoader for GraphQL (batches N calls into 1)
const userLoader = new DataLoader(async (userIds) => {
  const users = await User.findAll({ where: { id: userIds } });
  return userIds.map(id => users.find(u => u.id === id));
});`,
      language: 'javascript'
    },
    interviewAnswer: 'Quantify: "100 users = 101 queries". Then show the include fix. For GraphQL specifically, mention DataLoader.',
    commonMistakes: ['Over-fetching with include on every query even when the relation is not needed', 'Not identifying N+1 without query logging enabled'],
    realWorldUse: 'REST APIs returning nested resources, GraphQL resolvers, any ORM-based data layer.',
    followUpQuestions: ['How do you enable query logging in Prisma?', 'What is DataLoader and how does it work?']
  },

  {
    id: 'nodejs-jwt-refresh',
    category: 'nodejs',
    type: 'theory',
    question: 'How do you implement JWT refresh token rotation in a Node.js API?',
    difficulty: 'intermediate',
    tags: ['nodejs', 'jwt', 'auth', 'security', 'refresh-tokens'],
    shortAnswer: 'Issue a short-lived access token (15min) and a long-lived refresh token (7 days) stored in an httpOnly cookie. On access token expiry, exchange the refresh token for a new pair. On use, invalidate the old refresh token (rotation) to detect token theft.',
    detailedExplanation: 'Short access tokens limit damage if stolen. Refresh tokens are stored in httpOnly cookies (not localStorage) to prevent XSS theft. Rotation: each refresh issues a new refresh token and invalidates the old one. If the old token is presented again, it was stolen — invalidate all refresh tokens for that user.',
    example: {
      code: `// Issue tokens on login
function issueTokens(userId) {
  const accessToken = jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
}

// Refresh endpoint with rotation
app.post('/auth/refresh', async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ error: 'No refresh token' });

  // Check token is in valid set (Redis/DB)
  const isValid = await tokenStore.exists(token);
  if (!isValid) {
    // Reuse detected — possible theft — invalidate all for user
    await tokenStore.invalidateAll(userId);
    return res.status(401).json({ error: 'Token reuse detected' });
  }

  const { userId } = jwt.verify(token, REFRESH_SECRET);
  await tokenStore.delete(token); // invalidate old token

  const { accessToken, refreshToken: newRefresh } = issueTokens(userId);
  await tokenStore.save(newRefresh);

  res.cookie('refreshToken', newRefresh, { httpOnly: true, secure: true });
  res.json({ accessToken });
});`,
      language: 'javascript'
    },
    interviewAnswer: 'Walk through the three security properties: short-lived access tokens, httpOnly cookie for refresh, and rotation detecting theft.',
    commonMistakes: ['Storing refresh tokens in localStorage (XSS vulnerable)', 'Not implementing rotation — a stolen refresh token can be used indefinitely', 'Not invalidating all tokens when reuse is detected'],
    realWorldUse: 'Any authenticated Node.js API: SPA + API, mobile app backends.',
    followUpQuestions: ['What is the difference between access and refresh tokens?', 'Why is httpOnly cookie safer than localStorage for tokens?']
  },

  {
    id: 'nodejs-testing-jest',
    category: 'nodejs',
    type: 'theory',
    question: 'How do you test a Node.js/Express API with Jest and Supertest?',
    difficulty: 'intermediate',
    tags: ['testing', 'jest', 'supertest', 'api-testing'],
    shortAnswer: 'Supertest makes HTTP requests against your Express app without starting a real server. Jest runs tests and provides mocking. Test each route: correct status codes, response shape, and error cases. Mock external services like databases.',
    detailedExplanation: 'Integration testing an Express API: export the app without calling listen(), use supertest to make requests, assert on status and body. Mock database calls with jest.mock() or an in-memory database. Unit test business logic separately from routes. Use beforeEach/afterEach for setup/teardown. jest --coverage shows untested code paths.',
    example: {
      code: `// app.ts — export app without listen()
import express from 'express';
const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);
export default app; // Don't call app.listen here

// server.ts — entry point that calls listen
import app from './app';
app.listen(3000);

// __tests__/users.test.ts
import request from 'supertest';
import app from '../app';
import { prisma } from '../lib/prisma';

// Mock database
jest.mock('../lib/prisma', () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('GET /api/users', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns list of users', async () => {
    const users = [{ id: '1', name: 'Alex', email: 'alex@test.com' }];
    mockPrisma.user.findMany.mockResolvedValue(users);

    const res = await request(app)
      .get('/api/users')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: users });
    expect(mockPrisma.user.findMany).toHaveBeenCalledTimes(1);
  });

  it('returns 401 without auth token', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(401);
    expect(res.body.error).toBeDefined();
  });
});

describe('POST /api/users', () => {
  it('creates user with valid data', async () => {
    const newUser = { id: '2', name: 'Sam', email: 'sam@test.com' };
    mockPrisma.user.create.mockResolvedValue(newUser);

    const res = await request(app)
      .post('/api/users')
      .set('Authorization', 'Bearer valid-token')
      .send({ name: 'Sam', email: 'sam@test.com' });

    expect(res.status).toBe(201);
    expect(res.body.data.email).toBe('sam@test.com');
  });

  it('returns 422 with invalid email', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', 'Bearer valid-token')
      .send({ name: 'Sam', email: 'not-an-email' });

    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});`,
      language: 'typescript',
    },
    interviewAnswer: 'The key pattern is exporting the app without calling listen — Supertest handles the connection. I mock the database layer so tests are fast and don\'t need a real DB. I write tests for happy path, validation errors, auth errors, and not-found cases. For important business logic I write unit tests separate from the HTTP layer. Coverage reports show me what\'s untested.',
    commonMistakes: [
      'Calling app.listen() in the app file (breaks Supertest)',
      'Not clearing mocks between tests (test pollution)',
      'Only testing the happy path',
    ],
    realWorldUse: 'Every production Node.js API should have integration tests. CI/CD pipelines run them on every PR.',
    followUpQuestions: ['What is the difference between unit and integration tests?', 'How do you test authenticated routes?'],
  },

  {
    id: 'nodejs-logging-monitoring',
    category: 'nodejs',
    type: 'theory',
    question: 'How do you implement structured logging and monitoring in a Node.js application?',
    difficulty: 'intermediate',
    tags: ['logging', 'monitoring', 'winston', 'observability'],
    shortAnswer: 'Use structured JSON logging (Winston, Pino) instead of console.log. Add request ID, correlation ID, user context. Send logs to centralised service (CloudWatch, Datadog, Loki). Monitor: error rate, response time, CPU/memory, DB query time.',
    detailedExplanation: 'Structured logging outputs JSON so log aggregation services can index and query fields. Every log should have: timestamp, level, message, requestId (for tracing), service name, environment. Pino is fastest (low overhead). Winston is most flexible. Correlation IDs trace a request across microservices. Health metrics: request rate, error rate, p50/p95/p99 latency. Node.js metrics: event loop lag, heap used, active handles.',
    example: {
      code: `// logger.ts — Pino structured logger
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development'
    ? { target: 'pino-pretty' }  // Human-readable in dev
    : undefined,                  // JSON in production
  base: {
    service: 'user-api',
    env: process.env.NODE_ENV,
  },
  redact: ['req.headers.authorization', 'body.password'], // Hide secrets
});

// Request logging middleware
import { randomUUID } from 'crypto';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const requestId = randomUUID();
  req.requestId = requestId;

  const childLogger = logger.child({ requestId, method: req.method, url: req.url });
  req.log = childLogger;

  const start = Date.now();

  res.on('finish', () => {
    childLogger.info({
      status: res.statusCode,
      duration: Date.now() - start,
      contentLength: res.get('Content-Length'),
    }, 'request completed');
  });

  next();
}

// Usage in routes
app.get('/api/users/:id', async (req, res) => {
  req.log.info({ userId: req.params.id }, 'fetching user');

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      req.log.warn({ userId: req.params.id }, 'user not found');
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(user);
  } catch (err) {
    req.log.error({ err, userId: req.params.id }, 'failed to fetch user');
    res.status(500).json({ error: 'Internal error' });
  }
});

// Log output (JSON in production):
// {"level":"info","time":1234567890,"service":"user-api","requestId":"abc-123",
//  "userId":"456","msg":"fetching user"}
// {"level":"info","time":1234567891,"service":"user-api","requestId":"abc-123",
//  "status":200,"duration":45,"msg":"request completed"}

// Health metrics endpoint
app.get('/metrics', async (req, res) => {
  const used = process.memoryUsage();
  res.json({
    uptime: process.uptime(),
    memory: {
      heapUsed: Math.round(used.heapUsed / 1024 / 1024) + ' MB',
      heapTotal: Math.round(used.heapTotal / 1024 / 1024) + ' MB',
    },
    eventLoopLag: await measureEventLoopLag(),
  });
});`,
      language: 'typescript',
    },
    interviewAnswer: 'Structured logging is essential for debugging production issues. console.log is useless in aggregated log systems — JSON lets you filter by requestId, user, or error type. I use Pino for its low overhead and attach a requestId to every log line so I can trace all logs for a single request. The redact option automatically strips sensitive fields like passwords and tokens. In production, I send logs to Datadog or CloudWatch and set up alerts on error rate spikes.',
    commonMistakes: [
      'Using console.log in production (unstructured, hard to query)',
      'Logging sensitive data like passwords or tokens',
      'Not correlating logs with a requestId',
    ],
    realWorldUse: 'Every production service. Datadog, Grafana, CloudWatch, Loki all consume structured JSON logs.',
    followUpQuestions: ['What is the difference between Pino and Winston?', 'How do you implement distributed tracing?'],
  },

  {
    id: 'nodejs-pm2-deployment',
    category: 'nodejs',
    type: 'theory',
    question: 'What is PM2 and how do you use it for production Node.js deployment?',
    difficulty: 'intermediate',
    tags: ['pm2', 'deployment', 'process-management', 'production'],
    shortAnswer: 'PM2 is a production process manager for Node.js. It keeps apps alive after crashes, enables cluster mode for multi-core utilisation, provides log management, zero-downtime reloads, and startup scripts.',
    detailedExplanation: 'PM2 wraps Node.js processes with: automatic restart on crash, cluster mode (one process per CPU core without code changes), graceful reload for zero downtime deployments, log aggregation, memory threshold restart, startup scripts for server reboots, and a monitoring dashboard. The ecosystem.config.js file defines deployment configuration. In containers (Docker/Kubernetes), PM2 is less necessary — the orchestrator handles restarts.',
    example: {
      code: `// ecosystem.config.js — PM2 configuration
module.exports = {
  apps: [
    {
      name: 'api',
      script: 'dist/server.js',
      instances: 'max',      // One per CPU core
      exec_mode: 'cluster',  // Enable cluster mode
      
      // Environment variables per environment
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8080,
      },
      
      // Auto-restart settings
      max_memory_restart: '500M',  // Restart if over 500MB
      min_uptime: '10s',           // Mark as crashed if exits in < 10s
      max_restarts: 10,            // Max crash restarts
      
      // Logs
      out_file: 'logs/out.log',
      error_file: 'logs/error.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      
      // Graceful shutdown
      kill_timeout: 5000,    // Wait 5s for graceful shutdown
      wait_ready: true,      // Wait for process.send('ready')
    },
  ],
};

// server.ts — signal ready to PM2
const server = app.listen(PORT, () => {
  logger.info(\`Server running on port \${PORT}\`);
  if (process.send) process.send('ready'); // Tell PM2 we're ready
});

// Graceful shutdown
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

async function gracefulShutdown() {
  server.close(async () => {
    await prisma.$disconnect();
    await redis.quit();
    process.exit(0);
  });
}

// PM2 CLI commands
// pm2 start ecosystem.config.js --env production
// pm2 reload api --update-env   // Zero-downtime reload
// pm2 status                    // Process list
// pm2 logs api                  // Stream logs
// pm2 monit                     // Real-time dashboard
// pm2 save                      // Save process list
// pm2 startup                   // Generate startup script`,
      language: 'javascript',
    },
    interviewAnswer: 'PM2 is what keeps Node.js services running in production on a bare VM or VPS. Cluster mode is the key feature — it uses all CPU cores with zero code changes. For zero-downtime deployments I use pm2 reload which sends SIGTERM to workers one at a time, waiting for each to drain connections before starting a new one. In Docker/Kubernetes I don\'t use PM2 — the container orchestrator handles restarts and scaling.',
    commonMistakes: [
      'Using PM2 inside Docker (let the orchestrator manage processes)',
      'Not setting up graceful shutdown (drops in-flight requests on restart)',
      'Not using pm2 save + pm2 startup (processes don\'t survive server reboot)',
    ],
    realWorldUse: 'VPS deployments, bare metal servers, traditional hosting environments.',
    followUpQuestions: ['What is zero-downtime deployment?', 'How does PM2 differ from Docker?'],
  },

  {
    id: 'nodejs-typescript',
    category: 'nodejs',
    type: 'theory',
    question: 'How do you set up and use TypeScript in a Node.js project?',
    difficulty: 'intermediate',
    tags: ['typescript', 'nodejs', 'tsconfig', 'build'],
    shortAnswer: 'Install typescript and @types/node, configure tsconfig.json (target, module, outDir, strict), compile with tsc or use ts-node for development. Use tsx or ts-node for fast dev server. Production: compile to JS, run compiled output.',
    detailedExplanation: 'TypeScript in Node.js: tsconfig.json configures compiler options — module: "CommonJS" or "ESNext", target ES version, strict mode, path aliases. Development: ts-node or tsx for running .ts directly without compilation step. Production: compile to dist/ and run compiled JS. Type definitions: @types/node, @types/express etc. Decorators for metadata (Nest.js). Path aliases with tsconfig-paths.',
    example: {
      code: `// package.json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.0.0",
    "@types/express": "^4.17.21",
    "tsx": "^4.7.0"
  }
}

// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "lib": ["ES2022"],
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "declaration": true,        // Generate .d.ts files
    "sourceMap": true,          // For debugging

    // Path aliases
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}

// Typed Express example
import express, { Request, Response, NextFunction } from 'express';

interface CreateUserBody {
  name: string;
  email: string;
}

// Extend Request type for custom properties
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: string };
      requestId?: string;
    }
  }
}

const router = express.Router();

router.post(
  '/users',
  async (req: Request<{}, {}, CreateUserBody>, res: Response) => {
    const { name, email } = req.body; // Typed!
    const user = await createUser({ name, email });
    res.status(201).json(user);
  }
);

// Environment variables with type safety
interface EnvConfig {
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  NODE_ENV: 'development' | 'production' | 'test';
}

function loadConfig(): EnvConfig {
  const required = ['DATABASE_URL', 'JWT_SECRET'] as const;
  for (const key of required) {
    if (!process.env[key]) throw new Error(\`Missing env: \${key}\`);
  }
  return {
    PORT: parseInt(process.env.PORT ?? '3000'),
    DATABASE_URL: process.env.DATABASE_URL!,
    JWT_SECRET: process.env.JWT_SECRET!,
    NODE_ENV: (process.env.NODE_ENV as EnvConfig['NODE_ENV']) ?? 'development',
  };
}

export const config = loadConfig();`,
      language: 'typescript',
    },
    interviewAnswer: 'TypeScript in Node.js dramatically reduces runtime errors. Strict mode catches nullability issues early. Typed request/response objects in Express routes prevent accessing wrong properties. I use tsx for development (no compilation step) and compile to JS for production. Extending the Express Request interface with declaration merging is the clean way to add custom properties like req.user from auth middleware.',
    commonMistakes: [
      'Disabling strict mode to silence errors',
      'Using any everywhere',
      'Not setting esModuleInterop: true (breaks default imports)',
    ],
    realWorldUse: 'All modern Node.js projects. NestJS is entirely TypeScript. Prisma generates TypeScript types from your schema.',
    followUpQuestions: ['What is the difference between tsc --noEmit and a build?', 'How do you debug TypeScript in Node.js?'],
  },

  {
    id: 'nodejs-request-validation',
    category: 'nodejs',
    type: 'theory',
    question: 'What is the best way to validate request data in a Node.js/Express API?',
    difficulty: 'intermediate',
    tags: ['validation', 'zod', 'express-validator', 'middleware'],
    shortAnswer: 'Use a schema validation library (Zod, Joi, Yup) to define the shape of valid data. Validate in middleware before the route handler runs. Return 422 with field-level errors on failure. Never trust req.body without validation.',
    detailedExplanation: 'Zod is the modern choice — TypeScript-first, infers types from schema, composable. Validation middleware catches bad requests before business logic runs. Schema validation covers: type coercion (string to number), min/max length, format (email, UUID), required fields, custom validators. The error response should include which field failed and why for good developer experience.',
    example: {
      code: `import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

// Define schemas
const CreateUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  age: z.number().int().min(18).max(120).optional(),
  role: z.enum(['user', 'admin']).default('user'),
});

const UpdateUserSchema = CreateUserSchema.partial(); // All fields optional

// Infer TypeScript types from schema
type CreateUserInput = z.infer<typeof CreateUserSchema>;
// { name: string; email: string; age?: number; role: 'user' | 'admin' }

// Validation middleware factory
function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message,
        code: issue.code,
      }));

      return res.status(422).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Request validation failed',
          details: errors,
        },
      });
    }

    req.body = result.data; // Replace with parsed/coerced data
    next();
  };
}

// Usage
router.post('/users', validate(CreateUserSchema), async (req: Request, res: Response) => {
  const { name, email, role } = req.body as CreateUserInput;
  const user = await createUser({ name, email, role });
  res.status(201).json(user);
});

// Validate query params too
const ListUsersSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  role: z.enum(['user', 'admin']).optional(),
});

function validateQuery(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({ error: result.error.format() });
    }
    req.query = result.data;
    next();
  };
}`,
      language: 'typescript',
    },
    interviewAnswer: 'Zod is my first choice for validation in TypeScript projects because it infers the TypeScript type from the schema — one source of truth. The middleware pattern keeps routes clean — all validation happens before the handler runs. safeParse returns a result object instead of throwing, making error formatting easier. I validate body, query params, and path params separately. Coerce is useful for query params which come in as strings.',
    commonMistakes: [
      'Not validating query params (they\'re always strings)',
      'Throwing validation errors instead of returning proper error responses',
      'Not including which field failed in the error response',
    ],
    realWorldUse: 'Every Express API endpoint that accepts input. Zod is also used with tRPC, Next.js API routes, and Fastify.',
    followUpQuestions: ['How does Zod compare to Joi?', 'How do you validate path parameters?'],
  },

  {
    id: 'nodejs-docker',
    category: 'nodejs',
    type: 'theory',
    question: 'How do you containerise a Node.js application with Docker?',
    difficulty: 'intermediate',
    tags: ['docker', 'containerization', 'deployment', 'devops'],
    shortAnswer: 'Use a multi-stage Dockerfile: builder stage (install all deps, compile TS) and production stage (copy compiled output, install only production deps). Use .dockerignore to exclude node_modules. Run as non-root user.',
    detailedExplanation: 'Multi-stage builds reduce image size — the final image only contains compiled JS and production dependencies, not devDependencies or TypeScript compiler. Best practices: use specific Node version tags (not latest), copy package.json before source code (layer caching), run as non-root user (security), health check, set NODE_ENV=production. docker-compose for local development with linked services.',
    example: {
      code: `# Dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files first (layer cache — only reinstall when deps change)
COPY package*.json ./
RUN npm ci --include=dev

# Copy source and compile
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /app

# Security: run as non-root
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Copy only production deps
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled output from builder
COPY --from=builder /app/dist ./dist

# Set ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Environment
ENV NODE_ENV=production
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD node -e "require('http').get('http://localhost:3000/health', r => process.exit(r.statusCode === 200 ? 0 : 1))"

CMD ["node", "dist/server.js"]

# .dockerignore
# node_modules
# dist
# .env
# .env.*
# *.log
# .git

# docker-compose.yml — local development
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/myapp
      - REDIS_URL=redis://redis:6379
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    volumes:
      - ./src:/app/src  # Hot reload in dev

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: myapp
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine`,
      language: 'dockerfile',
    },
    interviewAnswer: 'Multi-stage builds are the most important Docker best practice for Node.js. The builder stage has TypeScript and devDependencies, but the production image only has compiled JS and production deps — this typically cuts image size by 60-70%. I always run as non-root for security, and include a health check so orchestrators know when the container is ready. The .dockerignore file is critical — accidentally copying node_modules into the image causes all sorts of issues.',
    commonMistakes: [
      'Not using multi-stage builds (huge images with devDependencies)',
      'Forgetting .dockerignore (slow builds, oversized images)',
      'Running as root in production',
      'Using COPY . . before installing dependencies (breaks layer cache)',
    ],
    realWorldUse: 'Every modern Node.js deployment. Kubernetes, AWS ECS, Google Cloud Run all use Docker images.',
    followUpQuestions: ['What is the difference between CMD and ENTRYPOINT?', 'How do you manage secrets in Docker containers?'],
  },

  {
    id: 'nodejs-prisma-orm',
    category: 'nodejs',
    type: 'theory',
    question: 'What is Prisma ORM and how does it compare to raw SQL and other ORMs?',
    difficulty: 'intermediate',
    tags: ['prisma', 'orm', 'database', 'typescript'],
    shortAnswer: 'Prisma is a TypeScript-first ORM with a schema-first approach, auto-generated types, migration system, and query builder. Safer than raw SQL (type-checked queries), better DX than Sequelize/TypeORM (auto-generated types from schema).',
    detailedExplanation: 'Prisma workflow: define schema.prisma → run prisma migrate dev → get type-safe client. The client is auto-generated from your schema — no manual type definitions. Prisma Studio is a visual database browser. Prisma supports PostgreSQL, MySQL, SQLite, MongoDB, CockroachDB. For complex queries use prisma.$queryRaw. Drawbacks: less flexible than raw SQL for complex aggregations, slower start-up than Drizzle, migrations can be limiting for some workflows.',
    example: {
      code: `// schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
}

// Generated client usage (fully typed!)
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Create with relation
const user = await prisma.user.create({
  data: {
    email: 'alex@example.com',
    name: 'Alex',
    posts: {
      create: { title: 'First post', content: 'Hello world' }
    }
  },
  include: { posts: true }
});

// Find with filters
const publishedPosts = await prisma.post.findMany({
  where: {
    published: true,
    author: { email: { contains: '@example.com' } }
  },
  orderBy: { createdAt: 'desc' },
  take: 10,
  skip: 20, // Pagination
  select: {  // Only fetch needed fields
    id: true,
    title: true,
    author: { select: { name: true } }
  }
});

// Update
await prisma.user.update({
  where: { id: userId },
  data: { name: 'Alex Smith' }
});

// Transaction
await prisma.$transaction([
  prisma.user.update({ where: { id: fromId }, data: { credits: { decrement: 100 } } }),
  prisma.user.update({ where: { id: toId }, data: { credits: { increment: 100 } } }),
]);

// Raw SQL for complex queries
const result = await prisma.$queryRaw\`
  SELECT u.name, COUNT(p.id) as post_count
  FROM "User" u
  LEFT JOIN "Post" p ON p."authorId" = u.id
  GROUP BY u.id, u.name
  HAVING COUNT(p.id) > 5
\`;`,
      language: 'typescript',
    },
    interviewAnswer: 'Prisma\'s auto-generated types are the killer feature. When I add a field to the schema, TypeScript immediately shows me every place that might need updating. The migration system is clean and has a good history tracking. Compared to TypeORM, Prisma is more opinionated but has better TypeScript support. For very complex queries I drop to $queryRaw — Prisma and raw SQL work well together.',
    commonMistakes: [
      'N+1 queries from missing include/select (use Prisma logging to catch these)',
      'Not running prisma generate after schema changes',
      'Using prisma.$queryRaw without tagged template literals (SQL injection risk)',
    ],
    realWorldUse: 'Most new TypeScript/Node.js projects. Pairs perfectly with Next.js. Vercel recommends Prisma for serverless.',
    followUpQuestions: ['How does Prisma handle database migrations?', 'What is the difference between include and select?'],
  },

  {
    id: 'nodejs-streams-advanced',
    category: 'nodejs',
    type: 'coding',
    question: 'How do you process a large CSV file in Node.js without running out of memory?',
    difficulty: 'advanced',
    tags: ['streams', 'csv', 'transform', 'large-files'],
    shortAnswer: 'Use streams instead of reading the entire file into memory. Pipe: fs.createReadStream → csv-parse Transform → your processing Transform → output. Each chunk is processed and GC\'d, keeping memory constant regardless of file size.',
    detailedExplanation: 'Reading a 1GB CSV with fs.readFile loads 1GB into memory. Streams process one chunk at a time — memory stays ~constant. The pipeline: ReadStream reads chunks, csv-parse parses CSV rows, your transform processes each row, WriteStream or HTTP response writes output. Use stream/promises pipeline() for error handling. Implement backpressure via the return value of push().',
    example: {
      code: `import { createReadStream, createWriteStream } from 'fs';
import { Transform } from 'stream';
import { pipeline } from 'stream/promises';
import { parse } from 'csv-parse';
import { stringify } from 'csv-stringify';

// Process a large CSV: read → parse → transform → write
async function processLargeCSV(inputPath: string, outputPath: string) {
  let processedRows = 0;

  const parser = parse({
    columns: true,       // Use first row as headers
    skip_empty_lines: true,
    trim: true,
  });

  // Custom transform stream
  const transformer = new Transform({
    objectMode: true,
    transform(row: Record<string, string>, encoding, callback) {
      try {
        // Transform each row
        const transformed = {
          ...row,
          email: row.email.toLowerCase(),
          salary: parseFloat(row.salary) * 1.1, // 10% raise
          processedAt: new Date().toISOString(),
        };

        processedRows++;
        if (processedRows % 10000 === 0) {
          console.log(\`Processed \${processedRows} rows...\`);
        }

        this.push(transformed);
        callback();
      } catch (err) {
        callback(err as Error);
      }
    }
  });

  const stringifier = stringify({ header: true });

  // pipeline handles errors and cleanup automatically
  await pipeline(
    createReadStream(inputPath),
    parser,
    transformer,
    stringifier,
    createWriteStream(outputPath)
  );

  console.log(\`Done! Processed \${processedRows} rows\`);
}

// Stream to HTTP response (no temp file needed)
app.get('/export', async (req, res) => {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=export.csv');

  const queryStream = prisma.user.findMany({ cursor: ... }).then(/* cursor pagination */);

  await pipeline(
    createDBStream(prisma),   // Custom readable from DB
    new CSVTransform(),        // Transform to CSV
    res                        // Pipe directly to HTTP response
  );
});`,
      language: 'typescript',
    },
    interviewAnswer: 'Streams are the answer to large file processing. The memory footprint is determined by the high-water mark (default 16KB chunks), not the file size. I always use pipeline() from stream/promises instead of pipe() — it correctly propagates errors and handles cleanup. For CSV specifically, csv-parse handles edge cases like quoted fields with commas. The key mental model: think of it as an assembly line where each station processes one item at a time.',
    commonMistakes: [
      'Using pipe() instead of pipeline() (errors don\'t propagate)',
      'Buffering entire CSV in memory before processing',
      'Not handling the error event on each stream',
    ],
    realWorldUse: 'Data imports, ETL pipelines, report exports, log processing, image transcoding.',
    followUpQuestions: ['What is backpressure and how do you handle it?', 'What is objectMode in streams?'],
    codingChallenge: {
      starterCode: `// Process a CSV file and output rows where age > 30
import { createReadStream } from 'fs';
import { pipeline } from 'stream/promises';

async function filterCSV(input: string, output: string) {
  // Your code here
}`,
      solution: `import { createReadStream, createWriteStream } from 'fs';
import { Transform } from 'stream';
import { pipeline } from 'stream/promises';
import { parse } from 'csv-parse';
import { stringify } from 'csv-stringify';

async function filterCSV(input: string, output: string) {
  await pipeline(
    createReadStream(input),
    parse({ columns: true }),
    new Transform({
      objectMode: true,
      transform(row, enc, cb) {
        if (parseInt(row.age) > 30) this.push(row);
        cb();
      }
    }),
    stringify({ header: true }),
    createWriteStream(output)
  );
}`,
      hints: [
        'Use parse({ columns: true }) to get objects',
        'Transform stream with objectMode: true for row-by-row processing',
        'Use pipeline() for proper error propagation',
      ],
    },
  },

  {
    id: 'nodejs-security-best-practices',
    category: 'nodejs',
    type: 'theory',
    question: 'What are the most important security best practices for a Node.js API?',
    difficulty: 'intermediate',
    tags: ['security', 'helmet', 'rate-limiting', 'best-practices'],
    shortAnswer: 'Key practices: helmet for HTTP security headers, rate limiting (express-rate-limit), input validation (Zod), parameterised queries (no SQL injection), httpOnly cookies for tokens, HTTPS only, sanitise error responses, keep dependencies updated.',
    detailedExplanation: 'Security in layers (defence in depth): Transport (HTTPS, HSTS), Input (validation, sanitisation), Authentication (JWT/sessions, MFA), Authorisation (RBAC, row-level), Output (no stack traces, proper error codes), Dependencies (audit, update), Monitoring (log suspicious activity). The OWASP Node.js cheat sheet is the authoritative reference.',
    example: {
      code: `import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp'; // HTTP parameter pollution

const app = express();

// 1. Security headers (XSS, clickjacking, MIME sniffing, etc.)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
    },
  },
}));

// 2. Rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10, // Stricter for auth endpoints
  skipSuccessfulRequests: true,
});

app.use(globalLimiter);
app.post('/api/auth/login', authLimiter, loginHandler);

// 3. Body parsing with size limits
app.use(express.json({ limit: '10kb' })); // Prevent large payload attacks

// 4. Sanitise MongoDB queries (NoSQL injection)
app.use(mongoSanitize()); // Strips $ and . from req.body

// 5. HTTP parameter pollution prevention
app.use(hpp());

// 6. Never expose internal errors
app.use((err: Error, req, res, next) => {
  const requestId = req.requestId;
  logger.error({ err, requestId }, 'Unhandled error');

  if (process.env.NODE_ENV === 'production') {
    // Don't leak stack traces or internal details
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: 'Something went wrong', requestId }
    });
  } else {
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: err.message, stack: err.stack }
    });
  }
});

// 7. Prevent timing attacks on token comparison
import { timingSafeEqual } from 'crypto';

function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}`,
      language: 'typescript',
    },
    interviewAnswer: 'Security is layered. helmet is the first middleware I add — one line protects against a dozen attack vectors. Rate limiting on auth endpoints prevents brute force. I never return stack traces in production — they leak implementation details. Input validation at the route level prevents injection attacks. I run npm audit weekly and use Dependabot for automatic dependency security PRs.',
    commonMistakes: [
      'Returning stack traces in production (information disclosure)',
      'No rate limiting on auth endpoints (brute force)',
      'Missing body size limits (DoS via large payloads)',
      'Trusting user input without validation',
    ],
    realWorldUse: 'Every production API. OWASP Top 10 maps to these mitigations.',
    followUpQuestions: ['What is OWASP Top 10?', 'How do you prevent NoSQL injection?'],
  },

  {
    id: 'nodejs-graphql',
    category: 'nodejs',
    type: 'theory',
    question: 'How do you build a GraphQL API in Node.js and when should you choose it over REST?',
    difficulty: 'intermediate',
    tags: ['graphql', 'apollo', 'schema', 'resolvers'],
    shortAnswer: 'GraphQL uses a single endpoint, a typed schema, and resolvers. Clients request exactly the data they need. Use GraphQL when: multiple clients need different data shapes, you have complex nested relationships, or you want a self-documenting API.',
    detailedExplanation: 'GraphQL stack for Node.js: schema (SDL), resolvers (functions that return data), server (Apollo Server, Yoga, Mercurius). Schema defines types and operations (Query, Mutation, Subscription). Resolvers map to schema fields. DataLoader solves the N+1 problem. Authentication via context. Persisted queries for performance. Disadvantages: complex caching, overkill for simple CRUD, learning curve.',
    example: {
      code: `import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import DataLoader from 'dataloader';

// Schema Definition Language
const typeDefs = \`
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
    postCount: Int!
  }

  type Post {
    id: ID!
    title: String!
    content: String
    published: Boolean!
    author: User!
  }

  type Query {
    users(limit: Int = 10, offset: Int = 0): [User!]!
    user(id: ID!): User
    post(id: ID!): Post
  }

  type Mutation {
    createPost(title: String!, content: String): Post!
    publishPost(id: ID!): Post!
  }
\`;

// Resolvers
const resolvers = {
  Query: {
    users: async (_, { limit, offset }, ctx) => {
      return prisma.user.findMany({ take: limit, skip: offset });
    },
    user: async (_, { id }) => prisma.user.findUnique({ where: { id } }),
  },

  Mutation: {
    createPost: async (_, args, ctx) => {
      if (!ctx.user) throw new GraphQLError('Unauthorized', {
        extensions: { code: 'UNAUTHORIZED' }
      });
      return prisma.post.create({
        data: { ...args, authorId: ctx.user.id }
      });
    },
  },

  User: {
    // DataLoader prevents N+1 — batches post queries
    posts: (user, _, ctx) => ctx.loaders.postsByUserId.load(user.id),
    postCount: async (user) => prisma.post.count({ where: { authorId: user.id } }),
  },

  Post: {
    author: (post, _, ctx) => ctx.loaders.userById.load(post.authorId),
  },
};

// Context with DataLoaders
interface Context {
  user: User | null;
  loaders: {
    userById: DataLoader<string, User>;
    postsByUserId: DataLoader<string, Post[]>;
  };
}

const server = new ApolloServer<Context>({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  context: async ({ req }) => ({
    user: await getUserFromToken(req.headers.authorization),
    loaders: {
      userById: new DataLoader(ids =>
        prisma.user.findMany({ where: { id: { in: ids as string[] } } })
          .then(users => ids.map(id => users.find(u => u.id === id) ?? null))
      ),
      postsByUserId: new DataLoader(userIds =>
        prisma.post.findMany({ where: { authorId: { in: userIds as string[] } } })
          .then(posts => userIds.map(id => posts.filter(p => p.authorId === id)))
      ),
    },
  }),
});`,
      language: 'typescript',
    },
    interviewAnswer: 'GraphQL shines when you have multiple clients (web, mobile, third-party) that need different data shapes. Instead of maintaining v1/v2 APIs or having over/under-fetching, clients ask for exactly what they need. DataLoader is essential — without it, resolvers cause N+1 queries. I choose REST for simple CRUD APIs and GraphQL when the data graph is complex with many relationships.',
    commonMistakes: [
      'Not using DataLoader (N+1 queries kill performance)',
      'Exposing too much in the schema (security)',
      'Using GraphQL for a simple CRUD API (REST is simpler)',
    ],
    realWorldUse: 'GitHub, Shopify, Twitter (partially) use GraphQL. Next.js apps often use GraphQL with Apollo Client.',
    followUpQuestions: ['How does DataLoader solve the N+1 problem?', 'What is the difference between Query and Mutation?'],
  },
];
