import type { RedisLesson } from '../redis-curriculum';

export const lesson04: RedisLesson = {
  id: 'redis-04',
  slug: '04-nodejs-redis',
  chapter: 'advanced',
  order: 4,
  difficulty: 'intermediate',
  readingTime: 12,
  title: 'Redis with Node.js',
  description: 'Connect Node.js to Redis using ioredis, implement the cache-aside pattern, and handle connections properly in production.',
  sections: [
    {
      type: 'text',
      content: 'Node.js and Redis are a natural pair. Both are fast, both use non-blocking I/O, and the single-threaded models complement each other well. The two most popular Node.js Redis clients are ioredis and node-redis. Both are mature and production-ready, but they have different APIs and feature sets. Understanding the differences helps you choose the right one for your project.',
    },
    {
      type: 'heading',
      content: 'ioredis vs node-redis',
    },
    {
      type: 'table',
      headers: ['Feature', 'ioredis', 'node-redis (redis@4+)'],
      rows: [
        ['Maintained by', 'Community (Luin Li, contributors)', 'Redis Ltd (official)'],
        ['TypeScript support', 'Built-in type definitions', 'Built-in type definitions'],
        ['Cluster support', 'Yes, built-in', 'Yes, built-in'],
        ['Sentinel support', 'Yes, built-in', 'Yes, built-in'],
        ['Auto-reconnect', 'Yes, configurable', 'Yes, configurable'],
        ['Pipeline API', 'Yes', 'Yes'],
        ['Popularity (npm)', 'Very high, long track record', 'Higher (official, actively maintained)'],
        ['API style', 'Promise-based, callback optional', 'Promise-based (v4+)'],
      ],
    },
    {
      type: 'heading',
      content: 'Installation and Connection',
    },
    {
      type: 'example',
      title: 'Installing ioredis and creating a connection',
      content: 'Install ioredis, create a client, handle connection events, and verify the connection with PING.',
      language: 'javascript',
      code: `// Install
// npm install ioredis

import Redis from 'ioredis';

// Basic connection (defaults to localhost:6379)
const redis = new Redis();

// Connection with options
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: 0,                          // database number (0-15)
  maxRetriesPerRequest: 3,
  connectTimeout: 10000,          // 10 seconds
  lazyConnect: true,              // don't connect until first command
});

// Handle connection events
redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err) => console.error('Redis error:', err));
redis.on('close', () => console.log('Redis connection closed'));

// Verify connection
async function checkConnection() {
  const pong = await redis.ping();
  console.log(pong); // => PONG
}

checkConnection();`,
      output: 'PONG',
    },
    {
      type: 'heading',
      content: 'Connection Options',
    },
    {
      type: 'table',
      headers: ['Option', 'Default', 'Purpose'],
      rows: [
        ['host', '127.0.0.1', 'Redis server hostname or IP address'],
        ['port', '6379', 'Redis server port number'],
        ['password', 'undefined', 'AUTH password (required if Redis has a password)'],
        ['db', '0', 'Redis database index (0-15). Different databases are completely isolated.'],
        ['maxRetriesPerRequest', '20', 'Retry count before giving up on a command. Set to null for infinite.'],
        ['connectTimeout', '10000', 'Milliseconds to wait for initial connection before giving up'],
        ['enableReadyCheck', 'true', 'Wait for Redis to finish loading before sending commands'],
        ['keyPrefix', 'undefined', 'Automatically prepend this prefix to all keys (e.g., "myapp:")'],
        ['tls', 'undefined', 'TLS options object for secure connections (required for Redis Cloud)'],
      ],
    },
    {
      type: 'heading',
      content: 'Basic Operations with async/await',
    },
    {
      type: 'example',
      title: 'CRUD operations in Node.js',
      content: 'The ioredis API mirrors Redis commands directly. Every command is a promise-returning async method.',
      language: 'javascript',
      code: `async function examples() {
  // SET with TTL
  await redis.set('user:42:name', 'Alice');
  await redis.set('session:xyz', 'data', 'EX', 1800); // expire in 30 min

  // GET
  const name = await redis.get('user:42:name');
  console.log(name); // => 'Alice'

  // Check if key exists (returns 1 or 0)
  const exists = await redis.exists('user:42:name');
  console.log(exists); // => 1

  // Set TTL on existing key
  await redis.expire('user:42:name', 3600);

  // Check TTL
  const ttl = await redis.ttl('user:42:name');
  console.log(ttl); // => ~3600

  // Delete a key
  const deleted = await redis.del('user:42:name');
  console.log(deleted); // => 1 (number of keys deleted)

  // Atomic increment
  await redis.set('counter', '0');
  const val = await redis.incr('counter');
  console.log(val); // => 1

  // Hash operations
  await redis.hset('user:42', 'name', 'Alice', 'email', 'alice@example.com');
  const profile = await redis.hgetall('user:42');
  console.log(profile); // => { name: 'Alice', email: 'alice@example.com' }
}`,
      output: 'Alice',
    },
    {
      type: 'heading',
      content: 'The Cache-Aside Pattern',
    },
    {
      type: 'text',
      content: 'Cache-aside (also called lazy loading) is the most common caching pattern. The application manages the cache explicitly: it checks the cache first, and only queries the database on a cache miss. The flow has four steps. First, check Redis for the requested data. Second, if found (cache hit), return it immediately without touching the database. Third, if not found (cache miss), query the database. Fourth, store the result in Redis with a TTL and return it to the caller. The next request will find the data in Redis.',
    },
    {
      type: 'list',
      items: [
        'Step 1 -- Check cache: await redis.get("user:42")',
        'Step 2 -- Cache hit: parse and return the cached JSON immediately',
        'Step 3 -- Cache miss: query your database (PostgreSQL, MongoDB, etc.)',
        'Step 4 -- Populate cache: await redis.set("user:42", JSON.stringify(user), "EX", 300)',
        'Step 5 -- Return result to the caller',
      ],
    },
    {
      type: 'example',
      title: 'Cache-aside pattern implementation',
      content: 'A reusable getUser function that checks Redis before querying the database.',
      language: 'javascript',
      code: `import Redis from 'ioredis';
import { db } from './database'; // your database client

const redis = new Redis();
const CACHE_TTL = 300; // 5 minutes

async function getUser(userId: number) {
  const cacheKey = \`user:\${userId}\`;

  // Step 1: Check cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log('Cache HIT for', cacheKey);
    return JSON.parse(cached);
  }

  // Step 2: Cache miss -- fetch from database
  console.log('Cache MISS for', cacheKey);
  const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);

  if (!user) return null;

  // Step 3: Populate cache
  await redis.set(cacheKey, JSON.stringify(user), 'EX', CACHE_TTL);

  return user;
}

// Cache invalidation -- call when user is updated
async function updateUser(userId: number, data: object) {
  await db.query('UPDATE users SET ... WHERE id = $1', [userId]);
  // Delete cache so next read fetches fresh data
  await redis.del(\`user:\${userId}\`);
}`,
      output: 'Cache MISS for user:42',
    },
    {
      type: 'heading',
      content: 'Express Caching Middleware',
    },
    {
      type: 'example',
      title: 'Redis-backed cache middleware for Express',
      content: 'A middleware that wraps any Express route with Redis caching. The cache key is the request URL.',
      language: 'javascript',
      code: `import express from 'express';
import Redis from 'ioredis';

const app = express();
const redis = new Redis();

// Middleware factory -- pass TTL in seconds
function cacheMiddleware(ttl: number) {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const key = \`route:\${req.originalUrl}\`;

    const cached = await redis.get(key);
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(JSON.parse(cached));
    }

    // Override res.json to intercept the response
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      redis.set(key, JSON.stringify(body), 'EX', ttl);
      res.setHeader('X-Cache', 'MISS');
      return originalJson(body);
    };

    next();
  };
}

// Use the middleware on specific routes
app.get('/api/products', cacheMiddleware(300), async (req, res) => {
  const products = await db.query('SELECT * FROM products');
  res.json(products);
});`,
      output: 'X-Cache: HIT',
    },
    {
      type: 'heading',
      content: 'Graceful Shutdown',
    },
    {
      type: 'example',
      title: 'Closing the Redis connection on process exit',
      content: 'Always close the Redis connection when your process exits to avoid connection leaks.',
      language: 'javascript',
      code: `const redis = new Redis();

// Close connection gracefully on SIGTERM (container shutdown)
process.on('SIGTERM', async () => {
  console.log('Closing Redis connection...');
  await redis.quit();  // send QUIT command, waits for reply
  process.exit(0);
});

// Handle SIGINT (Ctrl+C in development)
process.on('SIGINT', async () => {
  await redis.disconnect(); // force disconnect without QUIT
  process.exit(0);
});`,
      output: 'Closing Redis connection...',
    },
    {
      type: 'heading',
      content: 'Production Best Practices',
    },
    {
      type: 'list',
      items: [
        'Use environment variables for host, port, and password -- never hardcode credentials in source code.',
        'Set maxRetriesPerRequest to a low number (3-5) in production so a Redis outage fails fast instead of blocking request threads indefinitely.',
        'Use a key prefix (keyPrefix: "myapp:") to namespace keys when multiple apps share one Redis instance.',
        'Enable TLS when connecting to a remote Redis instance (Redis Cloud, ElastiCache) -- data in transit is sensitive.',
        'Never store passwords, credit card numbers, or other secrets in Redis without encryption -- Redis data is not encrypted at rest by default.',
        'Use SCAN instead of KEYS in production. KEYS blocks the single-threaded Redis server for the full duration of a scan on large keyspaces.',
        'Monitor memory usage with INFO memory. Set maxmemory and a sensible eviction policy.',
        'Test reconnection behavior. Kill the Redis container in staging and verify your application recovers gracefully.',
      ],
    },
    {
      type: 'tryit',
      title: 'Cache-Aside Visualizer',
      css: `.cav{font-family:system-ui,sans-serif;max-width:700px;margin:0 auto;padding:16px;}
.cav h2{font-size:18px;font-weight:700;margin:0 0 14px;color:#111;}
.cav-panels{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;}
.cav-panel{border:2px solid #e5e5e5;border-radius:10px;padding:14px;background:#fff;}
.cav-panel h3{font-size:14px;font-weight:700;margin:0 0 10px;}
.cav-panel.db h3{color:#4f46e5;}
.cav-panel.cache h3{color:#DC382D;}
.cav-row{font-size:12px;padding:6px 8px;border-radius:6px;margin-bottom:4px;font-family:monospace;}
.cav-row.highlight{background:#fef9c3;font-weight:600;}
.cav-row.stored{background:#f0fdf4;color:#166534;}
.cav-log{background:#1a1a1a;border-radius:8px;padding:12px;min-height:80px;margin-bottom:12px;}
.cav-log p{font-family:monospace;font-size:12px;margin:2px 0;color:#9ca3af;}
.cav-log p.hit{color:#4ade80;}
.cav-log p.miss{color:#f87171;}
.cav-log p.store{color:#60a5fa;}
.cav-btns{display:flex;gap:8px;}
.cav-btn{padding:8px 18px;border:none;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;}
.cav-btn.fetch{background:#DC382D;color:#fff;}
.cav-btn.fetch:hover{background:#b82e22;}
.cav-btn.reset{background:#e5e5e5;color:#333;}
.cav-btn.reset:hover{background:#d1d1d1;}
.cav-timing{font-size:12px;color:#888;margin-top:8px;}`,
      js: `var db = {
  'user:1': { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' }
};
var cache = {};
var logs = [];
var fetchCount = 0;

function log(msg, cls) {
  var now = new Date().toLocaleTimeString();
  logs.push({ msg: '[' + now + '] ' + msg, cls: cls || '' });
  if (logs.length > 8) logs.shift();
}

function fetchUser() {
  fetchCount++;
  var key = 'user:1';
  var start = Date.now();

  if (cache[key]) {
    var elapsed = 1 + Math.floor(Math.random() * 2);
    log('CACHE HIT -- returned user:1 in ' + elapsed + 'ms', 'hit');
    render(key, true, elapsed);
  } else {
    var elapsed = 120 + Math.floor(Math.random() * 60);
    log('CACHE MISS -- querying database...', 'miss');
    setTimeout(function() {
      cache[key] = db[key];
      log('Stored user:1 in Redis (TTL 300s)', 'store');
      log('Returned user:1 from DB in ' + elapsed + 'ms', 'miss');
      render(key, false, elapsed);
    }, 400);
    return;
  }
}

function resetCache() {
  cache = {};
  logs = [];
  fetchCount = 0;
  log('Cache cleared -- next fetch will be a MISS', '');
  render(null, null, null);
}

function render(lastKey, wasHit, elapsed) {
  var dbHtml = '<div class="cav-row' + (lastKey && !wasHit ? ' highlight' : '') + '">user:1 -- Alice Johnson (admin)</div>';

  var cacheHtml = cache['user:1']
    ? '<div class="cav-row stored">user:1 -- Alice Johnson (TTL 300s)</div>'
    : '<div class="cav-row" style="color:#bbb">-- empty --</div>';

  var logsHtml = logs.length
    ? logs.map(function(l) { return '<p class="' + l.cls + '">' + l.msg + '</p>'; }).join('')
    : '<p>Click "Fetch User #1" to start</p>';

  var statusLine = elapsed !== null
    ? '<div class="cav-timing">' +
      (wasHit ? 'CACHE HIT' : 'CACHE MISS') +
      ' -- responded in ' + elapsed + 'ms' +
      (wasHit ? '' : ' (DB query + cache write)') + '</div>'
    : '';

  document.getElementById('output').innerHTML =
    '<div class="cav">' +
    '<h2>Cache-Aside Visualizer</h2>' +
    '<div class="cav-panels">' +
    '<div class="cav-panel db"><h3>Database (PostgreSQL)</h3>' + dbHtml + '</div>' +
    '<div class="cav-panel cache"><h3>Redis Cache</h3>' + cacheHtml + '</div>' +
    '</div>' +
    '<div class="cav-log">' + logsHtml + '</div>' +
    statusLine +
    '<div class="cav-btns">' +
    '<button class="cav-btn fetch" id="fetchBtn">Fetch User #1</button>' +
    '<button class="cav-btn reset" id="resetBtn">Clear Cache</button>' +
    '</div>' +
    '</div>';

  document.getElementById('fetchBtn').addEventListener('click', fetchUser);
  document.getElementById('resetBtn').addEventListener('click', resetCache);
}

render(null, null, null);`,
    },
  ],
  exercises: [
    {
      id: 'redis-04-ex1',
      question: 'In the cache-aside pattern, what happens on a cache miss?',
      type: 'multiple-choice',
      options: [
        'An error is returned to the caller',
        'The application queries the database, stores the result in Redis, and returns it',
        'Redis automatically fetches data from the database',
        'The request is queued until the cache is warmed up',
      ],
      correct: 1,
      explanation: 'On a cache miss the application falls back to the database, stores the retrieved data in Redis with a TTL (to populate the cache for future requests), and returns the result to the caller. Redis does not automatically fetch from any data source -- the application controls the cache population.',
    },
    {
      id: 'redis-04-ex2',
      question: 'Why is it better to use SET key value EX 300 instead of SET key value followed by EXPIRE key 300?',
      type: 'multiple-choice',
      options: [
        'The combined command is faster',
        'EXPIRE does not work in Node.js',
        'The combined command is atomic -- there is no window where the key exists without TTL',
        'SET with EX uses less memory',
      ],
      correct: 2,
      explanation: 'Two separate commands create a small window between SET and EXPIRE where another process could read a key that was supposed to have a TTL. If the process crashes after SET but before EXPIRE, the key lives forever. The combined SET ... EX is atomic -- the TTL is applied at the same time as the value.',
    },
    {
      id: 'redis-04-ex3',
      question: 'You are building a production Express API. When should you use KEYS to find all cached entries matching a pattern?',
      type: 'multiple-choice',
      options: [
        'When you need to invalidate multiple cache entries at once',
        'KEYS is fast and safe to use in production at any time',
        'Never in production -- KEYS blocks Redis for the full scan duration. Use SCAN instead.',
        'Only when the Redis instance has fewer than 1,000 keys',
      ],
      correct: 2,
      explanation: 'KEYS is O(N) and blocks the single-threaded Redis server while it scans all keys. On a large dataset this can cause significant latency for all other clients. SCAN iterates in small increments and is safe to use in production.',
    },
  ],
  quiz: [
    {
      id: 'redis-04-q1',
      question: 'Which ioredis connection option automatically prepends a prefix to every key?',
      options: ['namespace', 'keyPrefix', 'db', 'prefix'],
      correct: 1,
      explanation: 'The keyPrefix option in ioredis prepends the string to every key your client uses. Useful for namespacing when multiple applications share one Redis instance. For example, keyPrefix: "myapp:" turns GET user:42 into GET myapp:user:42.',
    },
    {
      id: 'redis-04-q2',
      question: 'What does redis.quit() do compared to redis.disconnect()?',
      options: [
        'They are identical',
        'quit() sends the QUIT command and waits for acknowledgment; disconnect() closes the socket immediately',
        'disconnect() is the async version of quit()',
        'quit() only works in cluster mode',
      ],
      correct: 1,
      explanation: 'quit() sends the Redis QUIT command, which causes Redis to close the connection cleanly after acknowledging. disconnect() closes the underlying TCP socket immediately without sending any Redis command. Use quit() for graceful shutdown, disconnect() for forced termination.',
    },
    {
      id: 'redis-04-q3',
      question: 'In Express caching middleware, how do you intercept res.json() to cache the response before it is sent?',
      options: [
        'You cannot intercept res.json()',
        'Use a response transformer middleware',
        'Override res.json with your own function that caches and then calls the original',
        'Hook into the Express response lifecycle with res.on("finish")',
      ],
      correct: 2,
      explanation: 'You can save a reference to the original res.json, replace it with your own function that stores the body in Redis and calls the original. This pattern lets you cache the response transparently without changing the route handler.',
    },
  ],
};
