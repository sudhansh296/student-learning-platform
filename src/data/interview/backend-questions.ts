import { InterviewQuestion } from '@/lib/interview-types';

export const backendInterviewQuestions: InterviewQuestion[] = [
  {
    id: 'be-microservices-monolith',
    category: 'backend',
    type: 'theory',
    question: 'What is the difference between monolithic and microservices architecture?',
    difficulty: 'intermediate',
    tags: ['microservices', 'monolith', 'architecture'],
    shortAnswer: 'Monolith: one deployable unit with all functionality. Microservices: independent services each doing one thing, communicating via APIs. Monolith is simpler to start; microservices scale specific parts independently.',
    detailedExplanation: 'A monolith has all features in one codebase — easy to develop initially, one deployment, shared database. Becomes hard to scale and change as it grows. Microservices splits features into separate services (user service, order service, payment service) each with its own database and deployment. Each service can scale independently, use different tech stacks, and be deployed separately. Trade-off: operational complexity vs scalability and team autonomy.',
    example: {
      code: `// MONOLITH - everything in one app
// app/
//   routes/users.js
//   routes/orders.js
//   routes/payments.js
//   models/User.js
//   models/Order.js
//   services/EmailService.js
// One process, one database, one deployment

// Simple Express monolith
const express = require('express');
const app = express();

// All routes in one process
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

app.listen(3000); // Deploy once

// MICROSERVICES - separate services
// user-service/   → localhost:3001  (own database)
// order-service/  → localhost:3002  (own database)
// payment-service → localhost:3003  (own database)
// email-service/  → localhost:3004

// API Gateway - single entry point
const { createProxyMiddleware } = require('http-proxy-middleware');

const gateway = express();
gateway.use('/api/users', createProxyMiddleware({ target: 'http://user-service:3001' }));
gateway.use('/api/orders', createProxyMiddleware({ target: 'http://order-service:3002' }));
gateway.use('/api/payments', createProxyMiddleware({ target: 'http://payment-service:3003' }));

gateway.listen(80);

// Microservices communication
// Synchronous: REST/GraphQL calls between services
// Async: Message queue (RabbitMQ, Kafka) for events

// Order service publishes event
const amqp = require('amqplib');
const channel = await (await amqp.connect('amqp://localhost')).createChannel();

// When order is created, publish event
async function createOrder(orderData) {
  const order = await Order.create(orderData);
  
  // Publish event - other services subscribe
  channel.publish('orders', 'order.created', 
    Buffer.from(JSON.stringify({ orderId: order.id, userId: order.userId }))
  );
  
  return order;
}

// Email service subscribes to order events
channel.consume('email-queue', async (msg) => {
  const { orderId, userId } = JSON.parse(msg.content.toString());
  await sendOrderConfirmationEmail(userId, orderId);
  channel.ack(msg);
});`,
      language: 'javascript'
    },
    interviewAnswer: 'I recommend starting with a monolith and extracting services when pain points emerge — premature microservices add complexity without benefits. Monoliths are simpler: one deploy, shared data, no network calls between services. Switch to microservices when the monolith is too large for one team, when different parts need to scale differently (payment service needs more resources than user service), or when teams need independent deployment cycles.',
    commonMistakes: [
      'Starting with microservices for a new project (over-engineering)',
      'Not understanding network failure complexity in microservices',
      'Shared database across microservices (defeats the purpose)',
      'Missing service discovery and API gateway'
    ],
    realWorldUse: 'Netflix, Amazon, Uber all use microservices after starting as monoliths. Most startups should stay monolith until they have the scale and team size to justify microservices.',
    followUpQuestions: [
      'What is an API Gateway?',
      'How do microservices communicate?',
      'What is eventual consistency?'
    ]
  },

  {
    id: 'be-caching',
    category: 'backend',
    type: 'theory',
    question: 'What is server-side caching and how do you implement it with Redis?',
    difficulty: 'intermediate',
    tags: ['caching', 'redis', 'performance'],
    shortAnswer: 'Caching stores expensive computation results for fast retrieval. Redis is an in-memory store used for API response caching, session storage, rate limiting, and pub/sub. Cache-aside pattern: check cache first, fall back to DB, update cache.',
    detailedExplanation: 'Caching reduces database load and latency. Cache-aside (lazy loading): check Redis first; if miss, fetch from DB and store in Redis. Write-through: update cache and DB on every write. Write-behind: update cache immediately, DB asynchronously. TTL (time-to-live) auto-expires stale data. Cache invalidation is hard — always consider when cached data becomes stale. Redis supports strings, hashes, sets, sorted sets, and pub/sub.',
    example: {
      code: `const redis = require('ioredis');
const client = new redis(process.env.REDIS_URL);

// Cache-aside pattern
async function getUser(userId) {
  const cacheKey = \`user:\${userId}\`;
  
  // 1. Check cache first
  const cached = await client.get(cacheKey);
  if (cached) {
    return JSON.parse(cached); // Cache HIT
  }
  
  // 2. Cache MISS - fetch from database
  const user = await User.findById(userId);
  
  if (user) {
    // 3. Store in cache with TTL (1 hour)
    await client.setex(cacheKey, 3600, JSON.stringify(user));
  }
  
  return user;
}

// Cache invalidation - delete when updated
async function updateUser(userId, data) {
  const user = await User.findByIdAndUpdate(userId, data, { new: true });
  
  // Invalidate cache so next read gets fresh data
  await client.del(\`user:\${userId}\`);
  
  return user;
}

// API response caching middleware
function cacheMiddleware(ttl = 300) { // 5 minutes default
  return async (req, res, next) => {
    const key = \`cache:\${req.originalUrl}\`;
    
    const cached = await client.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    // Intercept res.json to cache response
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      client.setex(key, ttl, JSON.stringify(data));
      return originalJson(data);
    };
    
    next();
  };
}

app.get('/api/products', cacheMiddleware(600), getProducts);

// Redis for session storage
const session = require('express-session');
const RedisStore = require('connect-redis').default;

app.use(session({
  store: new RedisStore({ client }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true, maxAge: 24 * 60 * 60 * 1000 }
}));

// Redis for rate limiting (distributed)
async function rateLimiter(key, limit, windowSeconds) {
  const current = await client.incr(key);
  if (current === 1) {
    await client.expire(key, windowSeconds);
  }
  return current <= limit;
}

// Pub/Sub for real-time features
const publisher = new redis();
const subscriber = new redis();

// Publisher (when order created)
await publisher.publish('orders', JSON.stringify({ type: 'ORDER_CREATED', orderId: '123' }));

// Subscriber (notification service)
subscriber.subscribe('orders');
subscriber.on('message', (channel, message) => {
  const event = JSON.parse(message);
  if (event.type === 'ORDER_CREATED') sendNotification(event.orderId);
});`,
      language: 'javascript'
    },
    interviewAnswer: 'Redis is my go-to for backend caching. The cache-aside pattern is most common — check Redis before hitting the database, store results with a TTL. Cache invalidation is the hardest part: I either delete the cache key on update, or set a short TTL and accept brief staleness. Redis also handles sessions (replaces server memory), rate limiting across multiple servers, and pub/sub for real-time events.',
    commonMistakes: [
      'Caching mutable data without invalidation strategy',
      'TTL too long (stale data) or too short (no benefit)',
      'Cache stampede (many requests hit DB simultaneously on cache miss)',
      'Not considering cache memory limits'
    ],
    realWorldUse: 'Twitter uses Redis for timeline caching. Most high-traffic APIs cache database queries. Session stores, leaderboards, real-time counters all use Redis.',
    followUpQuestions: [
      'What is the difference between cache-aside and write-through?',
      'What is a cache stampede and how do you prevent it?',
      'What Redis data structures would you use for a leaderboard?'
    ]
  },

  {
    id: 'be-message-queue',
    category: 'backend',
    type: 'theory',
    question: 'What are message queues and when would you use them?',
    difficulty: 'advanced',
    tags: ['message-queue', 'async', 'rabbitmq', 'kafka'],
    shortAnswer: 'Message queues decouple services by allowing async communication. Producer sends messages; consumer processes them independently. Use for background jobs, event-driven architectures, traffic spikes, and reliable delivery.',
    detailedExplanation: 'Message queues (RabbitMQ, BullMQ, Kafka) solve several problems: decoupling (services don\'t need to know about each other), buffering traffic spikes (queue absorbs bursts), reliability (messages persist if consumer is down), async processing (email sending, image processing). Queue vs streaming: queues deliver each message once; Kafka streams allow multiple consumers to replay the same stream.',
    example: {
      code: `// BullMQ - Redis-based job queue (Node.js)
const { Queue, Worker } = require('bullmq');
const connection = { host: 'localhost', port: 6379 };

// PRODUCER - add jobs to queue
const emailQueue = new Queue('emails', { connection });
const imageQueue = new Queue('images', { connection });

// In your route handler - fast response, async processing
app.post('/api/register', async (req, res) => {
  const user = await User.create(req.body);
  
  // Don't wait for email - add to queue
  await emailQueue.add('welcome-email', {
    userId: user._id,
    email: user.email,
    name: user.name
  });
  
  res.status(201).json(user); // Respond immediately
});

app.post('/api/upload', upload.single('photo'), async (req, res) => {
  const fileId = req.file.filename;
  
  // Queue image processing (resize, compress, generate thumbnails)
  await imageQueue.add('process-image', {
    fileId,
    operations: ['resize', 'compress', 'thumbnail']
  }, {
    attempts: 3,           // Retry 3 times on failure
    backoff: { type: 'exponential', delay: 2000 }
  });
  
  res.json({ fileId, status: 'processing' });
});

// CONSUMER (Worker process - can scale independently)
const emailWorker = new Worker('emails', async (job) => {
  const { userId, email, name } = job.data;
  
  await sendEmail({
    to: email,
    subject: 'Welcome!',
    template: 'welcome',
    data: { name }
  });
  
  console.log(\`Email sent to \${email}\`);
}, { connection });

emailWorker.on('failed', (job, err) => {
  console.error(\`Email job failed for \${job.data.email}:\`, err.message);
  // Alert monitoring, send to dead letter queue
});

// Scaling: run multiple workers on different servers
// Worker 1: processes email jobs
// Worker 2: processes email jobs  
// Worker 3: processes image jobs
// All reading from same Redis queue

// When to use message queues:
// 1. Tasks that take too long for HTTP response (video transcoding)
// 2. Tasks that can fail and need retry (email, SMS)
// 3. Traffic spikes (queue absorbs 10k req/sec, worker processes steadily)
// 4. Fan-out (one event triggers multiple services)
// 5. Decoupling services (order service doesn't know about email service)`,
      language: 'javascript'
    },
    interviewAnswer: 'Message queues solve the problem of needing to do work that takes too long for a synchronous HTTP response. Sending emails, processing images, generating PDFs — these are all async jobs. I use BullMQ with Redis for Node.js: the API adds jobs quickly and responds to the user immediately; separate worker processes handle the actual work and can be scaled independently. Jobs also retry on failure, which is critical for reliability.',
    commonMistakes: [
      'Doing async work synchronously in the request handler (slow API)',
      'Not handling job failures and retries',
      'Not monitoring queue depth (jobs piling up)',
      'Using queues when direct API calls would be simpler'
    ],
    realWorldUse: 'Email systems, image processing, payment processing, report generation, data imports/exports. Every at-scale backend uses queues. AWS SQS, Google Pub/Sub are managed queue services.',
    followUpQuestions: [
      'What is the difference between a message queue and Kafka?',
      'What is a dead letter queue?',
      'How do you handle duplicate message processing?'
    ]
  },

  {
    id: 'be-authentication-strategies',
    category: 'backend',
    type: 'theory',
    question: 'What are different authentication strategies? Session vs JWT?',
    difficulty: 'intermediate',
    tags: ['authentication', 'session', 'jwt', 'oauth'],
    shortAnswer: 'Session-based: server stores session in DB/Redis, client stores session ID in cookie. JWT: stateless — all user data in signed token, no server storage. Sessions are easier to revoke; JWT is stateless and scales better.',
    detailedExplanation: 'Session authentication: server creates session, stores in database/Redis, returns session ID in cookie. Every request looks up session in store — stateful, easy to revoke (delete from store), but requires server-side storage. JWT: server signs token with secret, client stores it. Token contains user data. Every request verifies signature — stateless, no database lookup, but harder to revoke before expiry (need blacklist or short expiry + refresh tokens).',
    example: {
      code: `// APPROACH 1: Session-based authentication
const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(session({
  secret: process.env.SESSION_SECRET,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}));

app.post('/login', async (req, res) => {
  const user = await authenticate(req.body.email, req.body.password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  
  req.session.userId = user._id; // Stored in MongoDB
  res.json({ message: 'Logged in' });
});

app.get('/profile', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not logged in' });
  // Look up user from session
});

app.post('/logout', (req, res) => {
  req.session.destroy(); // Delete from MongoDB - immediately revoked!
  res.clearCookie('sessionId');
  res.json({ message: 'Logged out' });
});

// APPROACH 2: JWT
app.post('/login', async (req, res) => {
  const user = await authenticate(req.body.email, req.body.password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } // Short expiry!
  );
  
  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  
  // Refresh token in httpOnly cookie (can't be stolen by JS)
  res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
  res.json({ token }); // Access token in response body
});

// Refresh token endpoint
app.post('/refresh', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: 'No refresh token' });
  
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    res.json({ token: newToken });
  } catch {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// Session vs JWT comparison
// Session: Stateful, easy revoke, needs Redis/DB
// JWT: Stateless, hard revoke, scales without storage
// Hybrid: httpOnly cookie with JWT = best of both worlds`,
      language: 'javascript'
    },
    interviewAnswer: 'I use a hybrid approach: JWT as an access token (short 15-min expiry) stored in memory or a cookie, plus a refresh token in an httpOnly cookie (7-day expiry). The short access token expiry limits damage if stolen. The refresh token in an httpOnly cookie prevents XSS theft. JWT scales without shared session storage — any server can verify the token. For instant revocation (logout, ban user), I maintain a token blacklist in Redis.',
    commonMistakes: [
      'Long JWT expiry without refresh tokens (can\'t revoke)',
      'Storing JWT in localStorage (XSS vulnerable)',
      'Not using HTTPS for session cookies',
      'Not expiring sessions on logout'
    ],
    realWorldUse: 'Traditional web apps use sessions. SPAs and mobile apps commonly use JWT. OAuth (GitHub/Google login) uses access tokens + refresh tokens. Auth0 and Firebase Abstract authentication.',
    followUpQuestions: [
      'How do you revoke a JWT before it expires?',
      'What is OAuth 2.0?',
      'What is the difference between authentication and authorization?'
    ]
  },

  {
    id: 'be-api-design',
    category: 'backend',
    type: 'theory',
    question: 'What are REST API best practices for production applications?',
    difficulty: 'intermediate',
    tags: ['api-design', 'rest', 'best-practices'],
    shortAnswer: 'Use nouns for URLs, correct HTTP methods, proper status codes, pagination, versioning, consistent error format, input validation, authentication, rate limiting, and comprehensive documentation.',
    detailedExplanation: 'Production APIs need more than just working endpoints. Resource naming with nouns (/users not /getUsers). Consistent error response shape with machine-readable codes. Filtering, sorting, pagination for collections. API versioning (/v1/) for evolution without breaking clients. Request validation (reject bad input early). Rate limiting (protect from abuse). OpenAPI/Swagger documentation. Health check endpoint for monitoring.',
    example: {
      code: `// API Design Best Practices

// 1. Resource-based URLs (nouns not verbs)
GET    /api/v1/users         // List users
GET    /api/v1/users/:id     // Get user
POST   /api/v1/users         // Create user
PATCH  /api/v1/users/:id     // Update user
DELETE /api/v1/users/:id     // Delete user
GET    /api/v1/users/:id/orders // Nested resource

// 2. Filtering, sorting, pagination
GET /api/v1/users?role=admin&active=true&sort=createdAt:desc&page=2&limit=20

app.get('/api/v1/users', async (req, res) => {
  const { role, active, sort = 'createdAt', order = 'desc', page = 1, limit = 20 } = req.query;
  
  const filter = {};
  if (role) filter.role = role;
  if (active !== undefined) filter.active = active === 'true';
  
  const users = await User.find(filter)
    .sort({ [sort]: order === 'desc' ? -1 : 1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  
  const total = await User.countDocuments(filter);
  
  res.json({
    data: users,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    }
  });
});

// 3. Consistent error format
const sendError = (res, status, code, message, details = null) => {
  res.status(status).json({
    error: { code, message, ...(details && { details }) }
  });
};

// Usage
sendError(res, 404, 'USER_NOT_FOUND', 'User not found');
sendError(res, 422, 'VALIDATION_ERROR', 'Validation failed', errors);

// 4. Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    const redisOk = await redisClient.ping();
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: { database: 'ok', redis: redisOk === 'PONG' ? 'ok' : 'error' }
    });
  } catch (err) {
    res.status(503).json({ status: 'error', message: err.message });
  }
});

// 5. API versioning
const v1Router = express.Router();
const v2Router = express.Router();

v1Router.use('/users', v1UserRoutes);
v2Router.use('/users', v2UserRoutes); // Different response shape

app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);`,
      language: 'javascript'
    },
    interviewAnswer: 'Good API design is about predictability and usability. Resource-based URLs with proper HTTP verbs, consistent error shapes with machine-readable codes, pagination metadata so clients know what\'s available. I always add versioning from day one — it\'s cheap upfront and saves pain later. Health check endpoints let load balancers and monitoring know the service is healthy.',
    commonMistakes: [
      'Verb-based URLs (/getUser instead of GET /user)',
      'No versioning (can\'t evolve API)',
      'Inconsistent error responses (different shapes per route)',
      'No pagination on collection endpoints'
    ],
    realWorldUse: 'Stripe, GitHub, and Twilio are examples of excellent API design. Their developer experience is a product feature. Swagger/OpenAPI documentation generated from code is standard.',
    followUpQuestions: [
      'How do you document a REST API?',
      'What is OpenAPI/Swagger?',
      'How do you handle backward compatibility?'
    ]
  },

  {
    id: 'be-sql-queries',
    category: 'backend',
    type: 'theory',
    question: 'Write a SQL query to find the top 3 products by sales in each category',
    difficulty: 'advanced',
    tags: ['sql', 'window-functions', 'analytics'],
    shortAnswer: 'Use window functions: ROW_NUMBER() or RANK() with PARTITION BY category. Window functions compute values across rows related to the current row without collapsing them like GROUP BY.',
    detailedExplanation: 'Window functions operate on a set of rows (window) related to the current row. PARTITION BY divides rows into groups (like GROUP BY but without collapsing rows). ROW_NUMBER() assigns unique rank. RANK() allows ties with gaps. DENSE_RANK() allows ties without gaps. Common in analytics queries for top-N per group problems.',
    example: {
      code: `-- Sample tables
-- products: id, name, category_id
-- orders: id, product_id, quantity, price

-- Find top 3 products by revenue in each category
WITH product_revenue AS (
  SELECT 
    p.id,
    p.name,
    p.category_id,
    SUM(o.quantity * o.price) AS total_revenue
  FROM products p
  JOIN orders o ON p.id = o.product_id
  GROUP BY p.id, p.name, p.category_id
),
ranked_products AS (
  SELECT 
    *,
    ROW_NUMBER() OVER (
      PARTITION BY category_id    -- Rank within each category
      ORDER BY total_revenue DESC -- Top by revenue
    ) AS rank
  FROM product_revenue
)
SELECT 
  category_id,
  name,
  total_revenue,
  rank
FROM ranked_products
WHERE rank <= 3;

-- Other window function examples:

-- Running total
SELECT 
  date,
  amount,
  SUM(amount) OVER (
    ORDER BY date
    ROWS UNBOUNDED PRECEDING
  ) AS running_total
FROM transactions;

-- Compare to previous row
SELECT 
  month,
  revenue,
  LAG(revenue, 1) OVER (ORDER BY month) AS prev_month,
  revenue - LAG(revenue, 1) OVER (ORDER BY month) AS change
FROM monthly_revenue;

-- Percentile ranking
SELECT 
  name,
  score,
  PERCENT_RANK() OVER (ORDER BY score) AS percentile
FROM test_results;

-- Moving average (7-day)
SELECT 
  date,
  sales,
  AVG(sales) OVER (
    ORDER BY date
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS seven_day_avg
FROM daily_sales;`,
      language: 'sql'
    },
    interviewAnswer: 'Top-N per group is a classic SQL interview problem. Without window functions, it requires a self-join or subquery that\'s harder to read. I use ROW_NUMBER() with PARTITION BY to rank products within each category, then filter where rank <= 3. Window functions like LAG/LEAD for comparing to previous rows, running totals with SUM OVER, and percentile rankings come up frequently in analytics and reporting.',
    commonMistakes: [
      'Using ROW_NUMBER when RANK would correctly handle ties',
      'Forgetting to include GROUP BY columns in SELECT',
      'Not using CTE (WITH clause) for readability',
      'Using subqueries when window functions are cleaner'
    ],
    realWorldUse: 'Analytics dashboards, sales reports, leaderboards, time-series analysis. Every data-heavy application needs window functions for complex reporting queries.',
    followUpQuestions: [
      'What is the difference between ROW_NUMBER, RANK, and DENSE_RANK?',
      'What is a CTE (Common Table Expression)?',
      'When would you use window functions over GROUP BY?'
    ]
  },

  {
    id: 'be-load-balancing',
    category: 'backend',
    type: 'theory',
    question: 'What is load balancing and what are the different strategies?',
    difficulty: 'intermediate',
    tags: ['load-balancing', 'scalability', 'infrastructure'],
    shortAnswer: 'Load balancers distribute traffic across multiple servers. Strategies: Round Robin (sequential), Least Connections (to least busy), IP Hash (same client → same server), Weighted (by server capacity).',
    detailedExplanation: 'Load balancers sit in front of server pools, distributing incoming requests. Layer 4 (transport) balancers route by IP/port — fast but no content inspection. Layer 7 (application) balancers route by URL/headers/content — enables content-based routing. Health checks remove failed servers automatically. Sticky sessions (session affinity) route same user to same server — useful but limits failover flexibility.',
    example: {
      code: `// NGINX load balancer config
// nginx.conf

upstream backend {
  # Round Robin (default) - sequential rotation
  server backend1.example.com;
  server backend2.example.com;
  server backend3.example.com;
}

upstream backend_weighted {
  # Weighted - distribute unequally by server capacity
  server backend1.example.com weight=3;  # Gets 3x traffic
  server backend2.example.com weight=1;  # Gets 1x traffic
}

upstream backend_least_conn {
  # Least Connections - send to least busy server
  least_conn;
  server backend1.example.com;
  server backend2.example.com;
}

upstream backend_ip_hash {
  # IP Hash - same client always goes to same server (session affinity)
  ip_hash;
  server backend1.example.com;
  server backend2.example.com;
}

server {
  listen 80;
  
  # Health check
  upstream backend {
    server backend1.example.com max_fails=3 fail_timeout=30s;
    server backend2.example.com max_fails=3 fail_timeout=30s;
    server backup_server.example.com backup; # Only used if others fail
  }
  
  location /api/ {
    proxy_pass http://backend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    
    # Health check
    proxy_connect_timeout 5s;
    proxy_read_timeout 60s;
  }
  
  # Route different paths to different services
  location /api/users/ {
    proxy_pass http://user-service;
  }
  
  location /api/orders/ {
    proxy_pass http://order-service;
  }
  
  location /static/ {
    root /var/www/html;  # Serve static files directly
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}

// Node.js cluster as simple load balancer
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork(); // OS-level round-robin load balancing
  }
} else {
  require('./app'); // Each worker is a Node.js server
}`,
      language: 'javascript'
    },
    interviewAnswer: 'Load balancers are how you scale beyond a single server. NGINX is my go-to for both load balancing and reverse proxying. Round-robin is simple and works well when servers are identical. Least-connections is better for varying request times. IP hash provides session affinity without centralized session storage, useful for WebSocket connections. Health checks automatically remove failed servers from the pool.',
    commonMistakes: [
      'Using session affinity without understanding failover implications',
      'Not configuring health checks (traffic sent to dead servers)',
      'Layer 4 vs Layer 7 distinction not considered',
      'Not testing behavior when one server fails'
    ],
    realWorldUse: 'AWS ALB (Application Load Balancer), NGINX, HAProxy, Cloudflare all provide load balancing. Every production system with more than one server needs a load balancer.',
    followUpQuestions: [
      'What is the difference between Layer 4 and Layer 7 load balancing?',
      'What is session affinity and when is it a problem?',
      'How does load balancing relate to horizontal scaling?'
    ]
  },

  {
    id: 'be-websockets',
    category: 'backend',
    type: 'theory',
    question: 'What are WebSockets and when should you use them vs HTTP?',
    difficulty: 'intermediate',
    tags: ['websockets', 'real-time', 'socket-io'],
    shortAnswer: 'WebSockets provide full-duplex, persistent connections between client and server. Use for real-time features: chat, live notifications, collaborative editing, live scores. HTTP polling is inefficient for these.',
    detailedExplanation: 'HTTP is request-response — client always initiates. Polling simulates real-time by repeatedly asking the server. Long-polling holds connection until data available. WebSockets upgrade the HTTP connection to persistent bidirectional — server can push data at any time, no polling overhead. Socket.IO adds rooms, namespaces, auto-reconnect, and fallback to polling for compatibility.',
    example: {
      code: `// Server-side with Socket.IO
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:3000' }
});

// Connection handler
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Join room (e.g., chat room)
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-joined', { userId: socket.id });
  });
  
  // Handle chat message
  socket.on('send-message', ({ roomId, message, userId }) => {
    // Broadcast to everyone in room except sender
    socket.to(roomId).emit('new-message', {
      userId,
      message,
      timestamp: new Date()
    });
    
    // Or to everyone including sender:
    // io.to(roomId).emit('new-message', ...);
  });
  
  // Real-time notifications
  socket.on('authenticate', (token) => {
    const userId = verifyToken(token);
    socket.join(\`user:\${userId}\`); // Personal room
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Send notification from anywhere in app
function notifyUser(userId, notification) {
  io.to(\`user:\${userId}\`).emit('notification', notification);
}

// Client-side
const socket = io('http://localhost:3001');

socket.on('connect', () => {
  socket.emit('authenticate', localStorage.getItem('token'));
  socket.emit('join-room', 'general');
});

socket.on('new-message', ({ userId, message, timestamp }) => {
  displayMessage({ userId, message, timestamp });
});

socket.on('notification', (notification) => {
  showNotification(notification);
});

// Send message
document.getElementById('send-btn').onclick = () => {
  socket.emit('send-message', {
    roomId: 'general',
    message: messageInput.value,
    userId: currentUser.id
  });
};

// HTTP vs WebSocket
// HTTP polling:  Client asks every 1s - 1440 requests/user/day
// WebSocket:     Server pushes only when there's data - near instant, less load`,
      language: 'javascript'
    },
    interviewAnswer: 'WebSockets solve the "push" problem. HTTP requires the client to ask — inefficient for real-time data. WebSockets keep a persistent connection so the server pushes updates instantly. I use Socket.IO which handles reconnection, rooms, and fallback to long-polling for old browsers. Real-time features: chat, notifications, live dashboards, collaborative editing, multiplayer games.',
    commonMistakes: [
      'Using WebSockets when HTTP polling would suffice (low-frequency updates)',
      'Not handling reconnection logic',
      'Not authenticating WebSocket connections',
      'Scaling WebSockets without sticky sessions or Redis adapter'
    ],
    realWorldUse: 'Slack, Discord, Google Docs, multiplayer games all use WebSockets. Real-time dashboards. Online collaboration tools. Stock tickers and live sports scores.',
    followUpQuestions: [
      'How do you scale WebSocket servers to multiple instances?',
      'What is Server-Sent Events (SSE) and how is it different from WebSockets?',
      'How do you authenticate WebSocket connections?'
    ]
  },
  {
    id: 'be-microservices-communication',
    category: 'backend',
    type: 'theory',
    question: 'How do microservices communicate with each other?',
    difficulty: 'advanced',
    tags: ['microservices', 'messaging', 'rest', 'grpc'],
    shortAnswer: 'Two patterns: synchronous (REST/gRPC — direct call, wait for response) and asynchronous (message queues like RabbitMQ/Kafka — fire and forget, decoupled). Choose based on whether the caller needs an immediate response.',
    detailedExplanation: 'Synchronous communication: Service A calls Service B and waits. Simple to understand, but creates temporal coupling — if B is down, A fails. REST (HTTP/JSON) is universal but verbose. gRPC (Protocol Buffers) is faster and has strict contracts. Asynchronous communication: Service A publishes an event to a queue; Service B processes it when ready. Decoupled, resilient, but harder to trace and debug. Use async for: email sending, notifications, long processing, fan-out events.',
    example: {
      language: 'javascript',
      code: `// SYNCHRONOUS: REST call between services
// Order service calling Inventory service

// Using axios
async function checkInventory(productId, quantity) {
  try {
    const response = await axios.get(
      \`http://inventory-service/api/products/\${productId}/stock\`,
      {
        timeout: 5000,  // Don't wait forever
        headers: { 'X-Service': 'order-service' }
      }
    );
    return response.data.available >= quantity;
  } catch (err) {
    // Circuit breaker pattern
    if (err.response?.status === 503) {
      // Inventory service is down — use fallback
      return true; // Optimistic: allow order, reconcile later
    }
    throw err;
  }
}

// ASYNCHRONOUS: Message queue (RabbitMQ/BullMQ)
// Order service publishes event
async function createOrder(orderData) {
  const order = await Order.create(orderData);
  
  // Publish — don't wait for consumers
  await messageQueue.publish('orders', 'order.created', {
    orderId: order.id,
    items: order.items,
    userId: order.userId,
    total: order.total
  });
  
  return order; // Return immediately
}

// Email service subscribes — processes independently
messageQueue.subscribe('orders', 'order.created', async (event) => {
  await sendOrderConfirmationEmail(event.userId, event.orderId);
});

// Inventory service subscribes
messageQueue.subscribe('orders', 'order.created', async (event) => {
  await decrementStock(event.items);
});

// Service mesh for service discovery
// Instead of hardcoding URLs, use service names
// Kubernetes: http://inventory-service (DNS resolves to pod)
// Consul: discovers services dynamically`
    },
    interviewAnswer: 'I choose synchronous communication when the result is needed immediately — like checking if a product is in stock before confirming an order. I use async messaging when I need to notify multiple services or when the work can happen later — like sending a confirmation email after an order. Async decouples services: the email service being down doesn\'t prevent orders from being placed.',
    commonMistakes: [
      'Using synchronous calls for long-running operations',
      'No timeout on synchronous HTTP calls',
      'Missing error handling when a service is unavailable',
      'Not implementing circuit breakers for cascading failures'
    ],
    realWorldUse: 'Netflix, Uber, Amazon all use mixed communication. Service meshes (Istio, Linkerd) handle service discovery, load balancing, and circuit breaking automatically.',
    followUpQuestions: [
      'What is a circuit breaker pattern?',
      'What is the difference between RabbitMQ and Kafka?',
      'What is service discovery?'
    ]
  },
  {
    id: 'be-connection-pooling',
    category: 'backend',
    type: 'theory',
    question: 'What is database connection pooling and why is it important?',
    difficulty: 'intermediate',
    tags: ['connection-pooling', 'performance', 'database'],
    shortAnswer: 'Connection pooling maintains a pool of reusable database connections instead of creating a new connection per request. Creating a DB connection takes 50-300ms — pooling eliminates this overhead.',
    detailedExplanation: 'Database connections are expensive to create: TCP connection, authentication, negotiation all take time. Each PostgreSQL connection uses ~5-10MB RAM. A high-traffic server creating a connection per request would overwhelm the database. Connection pooling creates a fixed pool of connections on startup, checks them out for each request, and returns them when done. pg library uses pool size of 10 by default. PgBouncer is a dedicated connection pooler for PostgreSQL.',
    example: {
      language: 'javascript',
      code: `const { Pool } = require('pg');

// Configure connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: 5432,
  
  // Pool configuration
  max: 20,              // Max connections in pool
  min: 5,               // Keep at least 5 connections alive
  idleTimeoutMillis: 30000,  // Remove idle connections after 30s
  connectionTimeoutMillis: 2000,  // Fail fast if can't connect in 2s
  
  // SSL for production
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false
});

// Pool handles connection management automatically
async function getUser(id) {
  // pool.query checks out a connection, runs query, returns it
  const { rows } = await pool.query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );
  return rows[0];
}

// Manual checkout (for transactions)
async function transferFunds(fromId, toId, amount) {
  const client = await pool.connect(); // Check out connection
  
  try {
    await client.query('BEGIN');
    await client.query(
      'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
      [amount, fromId]
    );
    await client.query(
      'UPDATE accounts SET balance = balance + $1 WHERE id = $2', 
      [amount, toId]
    );
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release(); // ALWAYS release back to pool
  }
}

// Monitor pool health
pool.on('connect', () => console.log('New DB connection created'));
pool.on('acquire', () => console.log('Connection acquired'));
pool.on('remove', () => console.log('Connection removed'));

// Pool stats
console.log({
  total: pool.totalCount,
  idle: pool.idleCount,
  waiting: pool.waitingCount
});`
    },
    interviewAnswer: 'Connection pooling is essential for any production database application. Without it, each API request creates a new DB connection (50-300ms overhead), and the database quickly runs out of connection slots. I configure pool size based on the database\'s max_connections setting and the number of application instances. Critically: always release connections back to the pool, especially in error paths — a leaked connection starves the pool.',
    commonMistakes: [
      'Not releasing connections in error cases',
      'Pool too large (overwhelms database)',
      'Pool too small (requests wait in queue)',
      'Not configuring connection timeouts'
    ],
    realWorldUse: 'Every production PostgreSQL application. Mongoose uses connection pooling for MongoDB automatically. PgBouncer is a dedicated connection pooler many teams run between app and database.',
    followUpQuestions: [
      'What happens if the pool is exhausted?',
      'What is PgBouncer?',
      'How do you size your connection pool?'
    ]
  },
  {
    id: 'be-api-gateway',
    category: 'backend',
    type: 'theory',
    question: 'What is an API Gateway and what does it do?',
    difficulty: 'intermediate',
    tags: ['api-gateway', 'microservices', 'architecture'],
    shortAnswer: 'An API Gateway is a single entry point for all client requests. It handles routing, authentication, rate limiting, load balancing, request/response transformation, and aggregation before forwarding to backend services.',
    detailedExplanation: 'Without a gateway, clients call multiple services directly, each needing its own auth, CORS, and SSL. The API Gateway pattern centralizes cross-cutting concerns. It can aggregate multiple service calls into one response (backend for frontend pattern), transform request/response formats, handle SSL termination, implement rate limiting, and provide a single URL for clients. Popular options: AWS API Gateway, Kong, Nginx, Express Gateway.',
    example: {
      language: 'javascript',
      code: `const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');

const app = express();

// 1. Authentication at gateway (all services get pre-authenticated request)
app.use(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const user = await verifyJWT(token);
    req.headers['x-user-id'] = user.id;
    req.headers['x-user-role'] = user.role;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// 2. Rate limiting at gateway level
app.use(rateLimit({ windowMs: 60000, max: 100 }));

// 3. Route to appropriate microservice
app.use('/api/users', createProxyMiddleware({
  target: 'http://user-service:3001',
  changeOrigin: true,
  pathRewrite: { '^/api/users': '' }
}));

app.use('/api/orders', createProxyMiddleware({
  target: 'http://order-service:3002',
  changeOrigin: true
}));

app.use('/api/products', createProxyMiddleware({
  target: 'http://product-service:3003',
  changeOrigin: true
}));

// 4. Request aggregation (Backend for Frontend pattern)
app.get('/api/dashboard', async (req, res) => {
  // Client makes one request, gateway makes 3 parallel calls
  const [user, orders, notifications] = await Promise.all([
    fetch(\`http://user-service/\${req.headers['x-user-id']}\`).then(r => r.json()),
    fetch(\`http://order-service/recent?userId=\${req.headers['x-user-id']}\`).then(r => r.json()),
    fetch(\`http://notification-service/unread?userId=\${req.headers['x-user-id']}\`).then(r => r.json())
  ]);
  
  res.json({ user, orders, notifications });
});

app.listen(80);`
    },
    interviewAnswer: 'The API Gateway is the front door for your microservices. It centralizes concerns that would otherwise need to be implemented in every service: authentication, rate limiting, logging, CORS. The client only knows one URL. The BFF (Backend for Frontend) pattern extends this — the gateway aggregates multiple service calls into the exact shape the UI needs, reducing API round trips.',
    commonMistakes: [
      'Making the gateway too fat (too much business logic)',
      'Single gateway as a bottleneck without horizontal scaling',
      'Not handling gateway failures gracefully',
      'Duplicating authentication in both gateway and services'
    ],
    realWorldUse: 'AWS API Gateway, Kong, Nginx reverse proxy. Netflix Zuul. Every microservices deployment uses a gateway. Kubernetes ingress controllers act as HTTP gateways.',
    followUpQuestions: [
      'What is the Backend for Frontend (BFF) pattern?',
      'How does an API Gateway differ from a load balancer?',
      'What is service mesh vs API gateway?'
    ]
  },

  {
    id: 'be-cicd-pipeline',
    category: 'backend',
    type: 'theory',
    question: 'What is a CI/CD pipeline and how do you set one up for a Node.js application?',
    difficulty: 'intermediate',
    tags: ['ci-cd', 'github-actions', 'deployment', 'automation'],
    shortAnswer: 'CI/CD automates building, testing, and deploying code. CI (Continuous Integration) runs tests on every push. CD (Continuous Delivery/Deployment) automatically deploys passing builds. GitHub Actions is the most common tool for Node.js projects.',
    detailedExplanation: 'CI prevents broken code from reaching main branch by running tests automatically. CD eliminates manual deployment steps. A typical pipeline: trigger on push/PR → install deps → lint → run tests → build → deploy to staging → run E2E tests → deploy to production. Key practices: fail fast (lint before tests), parallel jobs for speed, environment-specific secrets, deployment approvals for production.',
    example: {
      code: `# .github/workflows/ci-cd.yml

name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'

jobs:
  # Job 1: Lint and Type Check (fast feedback)
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci                    # Use lockfile exactly
      - run: npm run lint
      - run: npm run typecheck         # tsc --noEmit

  # Job 2: Unit + Integration Tests
  test:
    runs-on: ubuntu-latest
    needs: quality                     # Only run if quality passes

    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379

    env:
      DATABASE_URL: postgresql://postgres:test@localhost:5432/testdb
      REDIS_URL: redis://localhost:6379
      JWT_SECRET: test-secret-for-ci

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run db:migrate         # Run migrations against test DB
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v3 # Upload coverage report

  # Job 3: Build Docker image
  build:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'
    outputs:
      image-tag: \${{ steps.meta.outputs.tags }}

    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ghcr.io/\${{ github.repository }}:\${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # Job 4: Deploy to production
  deploy:
    runs-on: ubuntu-latest
    needs: build
    environment: production            # Requires manual approval
    steps:
      - name: Deploy to Railway/Render/Fly.io
        run: |
          curl -X POST \${{ secrets.DEPLOY_WEBHOOK_URL }} \\
            -H "Authorization: Bearer \${{ secrets.DEPLOY_TOKEN }}" \\
            -d '{"image": "ghcr.io/\${{ github.repository }}:\${{ github.sha }}"}'`,
      language: 'yaml',
    },
    interviewAnswer: 'CI/CD is what separates professional from amateur deployments. My pipeline runs in order: lint → test → build → deploy. I run tests against real services (PostgreSQL, Redis) using GitHub Actions services so tests are realistic. The build job only runs on main branch pushes. Production deployment requires manual approval in GitHub Environments — important for regulated industries. The whole pipeline runs in about 3-4 minutes.',
    commonMistakes: [
      'Not caching node_modules (slow builds)',
      'Using npm install instead of npm ci in CI',
      'Running all jobs sequentially instead of in parallel where possible',
    ],
    realWorldUse: 'Every professional Node.js project. GitHub Actions, GitLab CI, CircleCI, Jenkins are the main tools.',
    followUpQuestions: ['What is the difference between Continuous Delivery and Continuous Deployment?', 'How do you handle database migrations in CI/CD?'],
  },

  {
    id: 'be-horizontal-vertical-scaling',
    category: 'backend',
    type: 'theory',
    question: 'What is the difference between horizontal and vertical scaling? When do you use each?',
    difficulty: 'intermediate',
    tags: ['scaling', 'horizontal', 'vertical', 'architecture'],
    shortAnswer: 'Vertical scaling: add more CPU/RAM to existing server (scale up). Horizontal scaling: add more servers behind a load balancer (scale out). Vertical has a ceiling and single point of failure. Horizontal is theoretically unlimited but requires stateless design.',
    detailedExplanation: 'Vertical scaling is simple — upgrade the server. But it has limits: the biggest server available, and if it goes down, everything goes down. Horizontal scaling distributes load across many servers — resilient, theoretically unlimited, but requires stateless applications (no in-memory sessions), shared database, distributed caching. Most production systems start vertical, go horizontal when needed. Cloud auto-scaling (AWS Auto Scaling, Kubernetes HPA) handles horizontal scaling automatically.',
    example: {
      code: `// Stateless design enables horizontal scaling

// ❌ Stateful — can't scale horizontally
// Sessions stored in server memory
app.use(session({
  store: new MemoryStore(), // Memory = single server only
  secret: 'secret',
}));

// ✅ Stateless — scale to N servers
// Sessions in Redis (shared across all servers)
app.use(session({
  store: new RedisStore({ client: redis }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// ❌ In-memory cache — each server has different cache
const cache = new Map(); // Local to this server

// ✅ Shared Redis cache — all servers share same cache
const cached = await redis.get(key);

// ❌ File uploads to local disk
app.post('/upload', upload.single('file'), (req, res) => {
  // File saved to /tmp/uploads — only accessible on this server!
});

// ✅ Uploads to shared storage (S3)
app.post('/upload', upload.memoryStorage(), async (req, res) => {
  await s3.putObject({ Bucket: 'uploads', Key: filename, Body: req.file.buffer });
});

// Kubernetes Horizontal Pod Autoscaler
# deployment.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  minReplicas: 2
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: AverageValue
          averageValue: 400Mi

// Vertical vs Horizontal decision:
// Database: usually vertical (horizontal requires sharding — complex)
// API servers: horizontal (stateless, easy to scale)
// Cache (Redis): vertical or cluster mode
// Message queue workers: horizontal (process more jobs in parallel)`,
      language: 'javascript',
    },
    interviewAnswer: 'Most apps start vertical — just upgrade the server. It\'s simple and cheap at low scale. Horizontal scaling is required when you need more than one server can provide, or when you need high availability (no single point of failure). The key requirement for horizontal scaling: statelessness. Sessions in Redis, files in S3, caches in Redis — anything that would differ between servers must be in shared infrastructure.',
    commonMistakes: [
      'Storing session state in memory (breaks horizontal scaling)',
      'Scaling databases horizontally too early (sharding is complex)',
      'Not designing for statelessness from the start',
    ],
    realWorldUse: 'AWS Auto Scaling, Kubernetes HPA, Cloudflare Workers. Every high-traffic service uses horizontal scaling.',
    followUpQuestions: ['What is auto-scaling?', 'What is a stateless application?'],
  },

  {
    id: 'be-event-sourcing',
    category: 'backend',
    type: 'theory',
    question: 'What is event sourcing and when should you use it?',
    difficulty: 'advanced',
    tags: ['event-sourcing', 'architecture', 'cqrs', 'audit-trail'],
    shortAnswer: 'Event sourcing stores state as a sequence of immutable events rather than the current state. Current state is derived by replaying events. Benefits: complete audit trail, time travel debugging, event replay for new projections. Complexity cost is high — use selectively.',
    detailedExplanation: 'Traditional DB: store current state, overwrite on update. Event sourcing: store every change as an event (UserCreated, NameChanged, OrderPlaced). Replay events to get current state. Benefits: free audit log, replay events to build new read models, easy debugging (reproduce state at any point). Drawbacks: complexity, eventual consistency, event schema evolution. Often paired with CQRS. Use for: financial ledgers, audit-critical domains, complex domain logic.',
    example: {
      code: `// Event sourcing pattern

// Events — immutable facts, past tense
interface DomainEvent {
  id: string;
  aggregateId: string;
  aggregateType: string;
  eventType: string;
  payload: unknown;
  timestamp: Date;
  version: number;
}

// Event store — append-only
class EventStore {
  async append(events: DomainEvent[]): Promise<void> {
    // Optimistic concurrency: ensure no events added since we last read
    await prisma.$transaction(async (tx) => {
      for (const event of events) {
        await tx.event.create({ data: event });
      }
    });
  }

  async getEvents(aggregateId: string, fromVersion = 0): Promise<DomainEvent[]> {
    return prisma.event.findMany({
      where: { aggregateId, version: { gte: fromVersion } },
      orderBy: { version: 'asc' },
    });
  }
}

// Order aggregate — state is derived from events
class Order {
  id: string = '';
  status: string = 'draft';
  items: OrderItem[] = [];
  total: number = 0;
  private _version: number = 0;
  private _uncommittedEvents: DomainEvent[] = [];

  // Reconstitute from event history
  static fromEvents(events: DomainEvent[]): Order {
    const order = new Order();
    events.forEach(event => order.apply(event));
    return order;
  }

  // Apply event to mutate state
  private apply(event: DomainEvent): void {
    this._version = event.version;
    switch (event.eventType) {
      case 'OrderCreated':
        this.id = event.aggregateId;
        this.status = 'pending';
        break;
      case 'ItemAdded':
        const { item } = event.payload as { item: OrderItem };
        this.items.push(item);
        this.total += item.price * item.quantity;
        break;
      case 'OrderConfirmed':
        this.status = 'confirmed';
        break;
      case 'OrderCancelled':
        this.status = 'cancelled';
        break;
    }
  }

  // Business command — creates event
  addItem(item: OrderItem): void {
    if (this.status !== 'pending') throw new Error('Order not pending');
    this._uncommittedEvents.push({
      id: randomUUID(),
      aggregateId: this.id,
      aggregateType: 'Order',
      eventType: 'ItemAdded',
      payload: { item },
      timestamp: new Date(),
      version: this._version + 1,
    });
    this.apply(this._uncommittedEvents.at(-1)!);
  }

  getUncommittedEvents(): DomainEvent[] { return this._uncommittedEvents; }
}

// Usage
const store = new EventStore();
const events = await store.getEvents(orderId);
const order = Order.fromEvents(events);
order.addItem({ productId: 'p1', quantity: 2, price: 50 });
await store.append(order.getUncommittedEvents());

// Time travel — what did the order look like yesterday?
const historicalEvents = events.filter(e => e.timestamp < yesterday);
const historicalOrder = Order.fromEvents(historicalEvents);`,
      language: 'typescript',
    },
    interviewAnswer: 'Event sourcing is powerful but expensive. I reach for it when the domain genuinely benefits — financial systems where you need a complete audit trail, or when business rules are complex enough that you need to replay events to build new read models. For most CRUD applications, a traditional database with an audit_log table gives 80% of the benefit with 10% of the complexity. The hardest part is event schema evolution — you can never delete an event type because you need to replay history.',
    commonMistakes: [
      'Using event sourcing everywhere (overkill for simple CRUD)',
      'Mutating events (they must be immutable)',
      'No snapshotting for aggregates with thousands of events (slow replay)',
    ],
    realWorldUse: 'Banking (every transaction is an event), e-commerce order management, accounting systems.',
    followUpQuestions: ['What is CQRS and how does it relate to event sourcing?', 'What is a snapshot in event sourcing?'],
  },

  {
    id: 'be-cqrs',
    category: 'backend',
    type: 'theory',
    question: 'What is CQRS (Command Query Responsibility Segregation)?',
    difficulty: 'advanced',
    tags: ['cqrs', 'architecture', 'read-models', 'scalability'],
    shortAnswer: 'CQRS separates read (Query) and write (Command) operations into different models, databases, and services. Commands change state; queries return data. Enables independent scaling, optimised read models, and eventual consistency between read and write sides.',
    detailedExplanation: 'In CRUD, the same model handles reads and writes. CQRS splits them: Command side handles write operations (create/update/delete) with full domain logic, often a normalised database. Query side serves read operations with denormalised, read-optimised views, often a separate database or materialized view. After a command executes, an event updates the read model asynchronously. Trade-off: eventual consistency (read model may lag).',
    example: {
      code: `// CQRS pattern

// COMMANDS — change state
interface CreateOrderCommand {
  userId: string;
  items: Array<{ productId: string; quantity: number }>;
}

interface ConfirmOrderCommand {
  orderId: string;
  userId: string;
}

// Command Handler — validates and executes
class OrderCommandHandler {
  async handle(command: CreateOrderCommand) {
    // Business validation
    const user = await this.userRepo.findById(command.userId);
    if (!user.isActive) throw new Error('User account inactive');

    const products = await this.productRepo.findMany(command.items.map(i => i.productId));
    for (const item of command.items) {
      const product = products.find(p => p.id === item.productId);
      if (!product || product.stock < item.quantity) throw new Error('Insufficient stock');
    }

    // Create order in write database (normalised)
    const order = await this.orderRepo.create({
      userId: command.userId,
      items: command.items,
      status: 'pending',
      total: this.calculateTotal(command.items, products),
    });

    // Publish event to update read models
    await this.eventBus.publish('OrderCreated', { orderId: order.id, ...command });

    return order.id;
  }
}

// QUERIES — read state (separate from write side)
interface GetUserOrdersQuery {
  userId: string;
  status?: string;
  page: number;
}

// Query Handler — reads from denormalised read model
class OrderQueryHandler {
  async handle(query: GetUserOrdersQuery) {
    // Read from denormalised view (MongoDB, Elasticsearch, etc.)
    // Optimised for reading — pre-joined, pre-computed totals
    return this.readDb.orders.find({
      userId: query.userId,
      ...(query.status && { status: query.status }),
    }, {
      skip: (query.page - 1) * 20,
      limit: 20,
    });
  }
}

// Event Handler — keeps read model in sync
class OrderReadModelUpdater {
  async onOrderCreated(event: OrderCreatedEvent) {
    // Denormalise into read model
    await this.readDb.orders.insertOne({
      id: event.orderId,
      userId: event.userId,
      // Pre-join user name so queries don't need joins
      userName: (await this.userRepo.findById(event.userId)).name,
      // Pre-compute display values
      itemCount: event.items.length,
      formattedTotal: formatCurrency(event.total),
      status: 'pending',
      createdAt: new Date(),
    });
  }
}

// API layer — route to correct handler
app.post('/api/orders', authenticate, async (req, res) => {
  const orderId = await orderCommandHandler.handle({
    userId: req.user.id,
    items: req.body.items,
  });
  res.status(202).json({ orderId }); // Accepted — async processing
});

app.get('/api/orders', authenticate, async (req, res) => {
  const orders = await orderQueryHandler.handle({
    userId: req.user.id,
    status: req.query.status as string,
    page: parseInt(req.query.page as string) || 1,
  });
  res.json(orders);
});`,
      language: 'typescript',
    },
    interviewAnswer: 'CQRS makes sense when read and write loads are very different — like a social feed where millions read but few write. The read model is pre-computed and denormalised so queries are fast. The write side uses normalised data with full domain validation. The downside is eventual consistency — after you place an order, the read model might show it as pending for a few hundred milliseconds. For most apps, this is acceptable. I don\'t use CQRS everywhere — simple CRUD doesn\'t need it.',
    commonMistakes: [
      'Using CQRS for simple CRUD (massive over-engineering)',
      'Not communicating eventual consistency to the frontend',
      'Synchronous event handling (defeats the purpose — use async)',
    ],
    realWorldUse: 'E-commerce platforms, social media, financial systems. Often paired with Event Sourcing.',
    followUpQuestions: ['What is eventual consistency?', 'When would you NOT use CQRS?'],
  },

  {
    id: 'be-health-checks',
    category: 'backend',
    type: 'theory',
    question: 'What are health check endpoints and how do you implement liveness vs readiness probes?',
    difficulty: 'intermediate',
    tags: ['health-checks', 'kubernetes', 'liveness', 'readiness', 'production'],
    shortAnswer: 'Liveness probe: "Is the process alive?" — if fails, Kubernetes restarts the container. Readiness probe: "Is the service ready to receive traffic?" — if fails, removes from load balancer. Startup probe: "Has the app finished starting?" — prevents restarts during slow startup.',
    detailedExplanation: 'Kubernetes uses probes to manage container lifecycle. Liveness: checks if the app is alive — dead lock, infinite loop, crash. If failed, restarts the pod. Simple check, return 200 if process is running. Readiness: checks if ready to serve traffic — DB connection alive, cache connected, warm-up complete. If failed, removes from service endpoints. Both should be fast (< 1s). Startup probe allows slow-starting apps extra time before liveness kicks in.',
    example: {
      code: `// Express health check endpoints
import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';

const prisma = new PrismaClient();
const redis = createClient({ url: process.env.REDIS_URL });

// Liveness — is the process running?
// Simple, fast — just check the process is alive
app.get('/health/live', (req, res) => {
  res.status(200).json({
    status: 'alive',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Readiness — is the service ready to handle traffic?
// Checks dependencies — DB, Redis, external services
app.get('/health/ready', async (req, res) => {
  const checks: Record<string, { status: string; responseTime?: number }> = {};
  let allHealthy = true;

  // Check database
  try {
    const start = Date.now();
    await prisma.$queryRaw\`SELECT 1\`;
    checks.database = { status: 'up', responseTime: Date.now() - start };
  } catch (err) {
    checks.database = { status: 'down' };
    allHealthy = false;
  }

  // Check Redis
  try {
    const start = Date.now();
    await redis.ping();
    checks.redis = { status: 'up', responseTime: Date.now() - start };
  } catch (err) {
    checks.redis = { status: 'down' };
    allHealthy = false;
  }

  // Check external API (optional — might be degraded not down)
  try {
    const start = Date.now();
    await fetch('https://api.stripe.com/v1/balance', {
      headers: { Authorization: \`Bearer \${process.env.STRIPE_KEY}\` },
      signal: AbortSignal.timeout(2000),
    });
    checks.payments = { status: 'up', responseTime: Date.now() - start };
  } catch {
    checks.payments = { status: 'degraded' }; // Not critical
    // Don't set allHealthy = false for non-critical services
  }

  const statusCode = allHealthy ? 200 : 503;
  res.status(statusCode).json({
    status: allHealthy ? 'ready' : 'not_ready',
    version: process.env.APP_VERSION ?? 'unknown',
    checks,
  });
});

# Kubernetes deployment with probes
apiVersion: apps/v1
kind: Deployment
spec:
  template:
    spec:
      containers:
        - name: api
          image: my-api:latest
          ports:
            - containerPort: 3000

          # Startup: give app 60s to start before liveness kicks in
          startupProbe:
            httpGet:
              path: /health/live
              port: 3000
            failureThreshold: 30    # 30 * 2s = 60s max startup
            periodSeconds: 2

          # Liveness: restart if dead
          livenessProbe:
            httpGet:
              path: /health/live
              port: 3000
            initialDelaySeconds: 0
            periodSeconds: 10
            failureThreshold: 3

          # Readiness: remove from LB if not ready
          readinessProbe:
            httpGet:
              path: /health/ready
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 15
            failureThreshold: 2`,
      language: 'typescript',
    },
    interviewAnswer: 'The liveness vs readiness distinction is critical in Kubernetes. Liveness failing restarts the pod — only use it for truly unrecoverable states. Readiness failing removes the pod from the load balancer — use for any state where you shouldn\'t receive traffic (DB down, warming up cache). I keep liveness very simple (just return 200) and make readiness check real dependencies. If readiness checks are too strict, you get pods constantly cycling in and out of service.',
    commonMistakes: [
      'Liveness probe checking external dependencies (causes restart cascades)',
      'Readiness probe that\'s too slow (timeouts count as failures)',
      'No health endpoints at all in production',
    ],
    realWorldUse: 'Every Kubernetes deployment. Docker Compose also supports health checks. Load balancers use health endpoints to route traffic.',
    followUpQuestions: ['What happens when a liveness probe fails in Kubernetes?', 'What is a startup probe?'],
  },

  {
    id: 'be-observability',
    category: 'backend',
    type: 'theory',
    question: 'What is observability and what are the three pillars (metrics, logs, traces)?',
    difficulty: 'intermediate',
    tags: ['observability', 'monitoring', 'distributed-tracing', 'opentelemetry'],
    shortAnswer: 'Observability is the ability to understand system state from its outputs. Three pillars: Metrics (numerical measurements over time), Logs (timestamped records of events), Traces (path of a request through distributed services). Together they enable debugging production issues without SSH access.',
    detailedExplanation: 'Metrics answer "what is happening?" — request rate, error rate, latency, CPU. Logs answer "what happened?" — structured events with context. Traces answer "where is it slow?" — timing of each step in a distributed request. OpenTelemetry is the open standard for all three. Tools: Prometheus/Grafana (metrics), ELK/Datadog (logs), Jaeger/Zipkin/Datadog APM (traces).',
    example: {
      code: `// OpenTelemetry — standard instrumentation for all 3 pillars
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

// initialise BEFORE importing app code
const sdk = new NodeSDK({
  serviceName: 'order-api',
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_ENDPOINT, // Jaeger/Datadog/Honeycomb
  }),
  metricReader: new PrometheusExporter({ port: 9464 }),
  instrumentations: [
    getNodeAutoInstrumentations(), // Auto-instruments HTTP, Express, DB, Redis
  ],
});
await sdk.start();

// Auto-instrumentation creates spans for:
// - Every HTTP request (incoming and outgoing)
// - Every database query (prisma, pg, mongoose)
// - Redis commands
// - gRPC calls

// Manual spans for business logic
import { trace, SpanStatusCode } from '@opentelemetry/api';
const tracer = trace.getTracer('order-service');

async function processOrder(orderId: string) {
  return tracer.startActiveSpan('processOrder', async (span) => {
    span.setAttribute('order.id', orderId);
    span.setAttribute('service.version', process.env.APP_VERSION);

    try {
      const order = await getOrder(orderId);
      span.setAttribute('order.total', order.total);
      span.setAttribute('order.item_count', order.items.length);

      await chargePayment(order); // Creates child span automatically
      await sendConfirmation(order);

      span.setStatus({ code: SpanStatusCode.OK });
      return order;
    } catch (err) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
      span.recordException(err);
      throw err;
    } finally {
      span.end();
    }
  });
}

// Distributed trace: one requestId connects spans across services
// user-api → order-api → payment-api → email-api
// All linked by traceId — see the full path in one view

// Metrics (Prometheus format)
// http_requests_total{method="POST",route="/orders",status="201"} 1234
// http_request_duration_seconds{p50=0.05, p95=0.2, p99=0.8}
// order_processing_duration_seconds{status="success"}

// Example Grafana alert:
// Alert: p99 latency > 500ms for 5 minutes → page on-call`,
      language: 'typescript',
    },
    interviewAnswer: 'Observability is about being able to answer any question about your system without deploying new code. Metrics tell you something is wrong (p99 latency spiked), logs tell you what happened (payment service timeout), and traces tell you exactly where time was spent (DB query took 2s). OpenTelemetry lets me instrument once and send to any backend — switch from Jaeger to Datadog without changing application code.',
    commonMistakes: [
      'Having metrics but no traces — can\'t find where time is spent',
      'Not correlating logs with trace IDs',
      'Instrumenting after a production incident instead of proactively',
    ],
    realWorldUse: 'Every microservices deployment. Datadog, Honeycomb, Grafana Cloud are popular backends. Mandatory for SRE practices.',
    followUpQuestions: ['What is OpenTelemetry?', 'What is distributed tracing?'],
  },

  {
    id: 'be-graceful-degradation',
    category: 'backend',
    type: 'theory',
    question: 'What is graceful degradation and how do you implement it in a backend service?',
    difficulty: 'intermediate',
    tags: ['graceful-degradation', 'resilience', 'fallbacks', 'circuit-breaker'],
    shortAnswer: 'Graceful degradation means the system keeps working at reduced functionality when dependencies fail. Instead of total failure when the recommendation service is down, show popular items. Implement with Circuit Breakers, fallbacks, timeouts, and retry logic.',
    detailedExplanation: 'Graceful degradation is a resilience pattern: plan for every dependency failing. If the email service is down, queue the email and try later — don\'t fail the order. If the recommendation engine is slow, return cached or popular items — don\'t block the page. Timeout all external calls. Use Circuit Breaker to fail fast when a service is consistently failing. Shedding load gracefully under extreme pressure (return 503 vs crashing).',
    example: {
      code: `// Graceful degradation patterns

// 1. Timeout every external call
async function getRecommendations(userId: string) {
  try {
    const response = await fetch(\`http://recommendation-service/users/\${userId}\`, {
      signal: AbortSignal.timeout(500), // 500ms max — fail fast
    });
    return await response.json();
  } catch (err) {
    // Degraded: return cached popular items instead of nothing
    const cached = await redis.get('popular_items');
    if (cached) return JSON.parse(cached);
    return DEFAULT_RECOMMENDATIONS; // Hardcoded fallback
  }
}

// 2. Retry with exponential backoff for transient failures
async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries) throw err;
      if (err.name === 'AbortError') throw err; // Don't retry timeouts
      const delay = Math.min(100 * Math.pow(2, attempt), 2000); // Exp backoff
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error('Unreachable');
}

// 3. Queue non-critical operations instead of failing
async function createOrder(orderData: OrderData) {
  const order = await prisma.order.create({ data: orderData });

  // Non-critical: queue email, don't fail order if email service is down
  await emailQueue.add('order-confirmation', {
    orderId: order.id,
    userId: order.userId,
  }, {
    attempts: 5,
    backoff: { type: 'exponential', delay: 2000 },
  });

  // Analytics is fire-and-forget — never fail the user request for it
  analyticsQueue.add('order-placed', { orderId: order.id }).catch(err => {
    logger.warn({ err }, 'Analytics queue failed — non-critical');
  });

  return order; // Return immediately even if side effects failed
}

// 4. Shed load under extreme pressure (load shedding)
app.use(async (req, res, next) => {
  const metrics = await getSystemMetrics();

  if (metrics.cpuUsage > 90 || metrics.activeConnections > 1000) {
    // Prioritise critical endpoints over nice-to-have ones
    const isCritical = ['/health', '/api/orders', '/api/auth'].some(
      path => req.path.startsWith(path)
    );

    if (!isCritical) {
      return res.status(503).json({
        error: 'Service temporarily busy. Please retry.',
        retryAfter: 5,
      });
    }
  }
  next();
});`,
      language: 'typescript',
    },
    interviewAnswer: 'Graceful degradation is the difference between "checkout is down" and "recommendations aren\'t personalised right now." I map every external dependency and ask: what happens to the user if this fails? For critical paths (payment, order creation) I retry with exponential backoff. For non-critical paths (recommendations, analytics) I either use a fallback or fire-and-forget. Timeouts on everything — a slow dependency is worse than a fast failure.',
    commonMistakes: [
      'No timeouts on external calls (one slow service hangs all requests)',
      'Failing critical operations when non-critical side effects fail',
      'No fallback content (empty state instead of cached/popular items)',
    ],
    realWorldUse: 'Netflix famously uses graceful degradation — if recommendations fail, the home page still works. Essential for any microservices architecture.',
    followUpQuestions: ['What is the Circuit Breaker pattern?', 'What is bulkhead pattern?'],
  },

  {
    id: 'be-service-discovery',
    category: 'backend',
    type: 'theory',
    question: 'What is service discovery and how does it work in microservices?',
    difficulty: 'advanced',
    tags: ['service-discovery', 'microservices', 'kubernetes', 'consul'],
    shortAnswer: 'Service discovery lets services find each other dynamically without hardcoded URLs. Client-side: service asks registry for address. Server-side: load balancer handles routing. Kubernetes DNS provides built-in service discovery. Consul and Eureka are dedicated service registries.',
    detailedExplanation: 'In microservices, services scale up/down and IP addresses change dynamically. Hardcoding IPs doesn\'t work. Two patterns: Client-side discovery (service queries a registry like Consul, gets list of instances, load-balances itself) and Server-side discovery (service calls a stable load balancer address, which looks up registry internally). Kubernetes provides built-in DNS-based service discovery — each Service gets a DNS name that resolves to healthy pods.',
    example: {
      code: `// Kubernetes service discovery (most common for Node.js)

// In Kubernetes, every Service gets a DNS name
// Format: <service-name>.<namespace>.svc.cluster.local

// deployment.yaml — deploy payment service
apiVersion: apps/v1
kind: Deployment
metadata:
  name: payment-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: payment-service
  template:
    spec:
      containers:
        - name: payment
          image: my-payment-service:latest
          ports:
            - containerPort: 3001

---
# service.yaml — create stable DNS name
apiVersion: v1
kind: Service
metadata:
  name: payment-service  # This becomes the DNS name
spec:
  selector:
    app: payment-service  # Routes to matching pods
  ports:
    - port: 80
      targetPort: 3001

// Node.js order service — use DNS name, not IP
// Kubernetes DNS resolves payment-service → one of the 3 pod IPs
async function chargeCustomer(paymentData) {
  const response = await fetch('http://payment-service/charge', { // DNS-based
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentData),
    signal: AbortSignal.timeout(5000),
  });
  return response.json();
}

// Consul service discovery (client-side pattern)
import Consul from 'consul';
const consul = new Consul({ host: 'consul', port: 8500 });

// Register on startup
await consul.agent.service.register({
  name: 'order-api',
  id: \`order-api-\${process.env.HOSTNAME}\`,
  port: 3000,
  check: {
    http: 'http://localhost:3000/health/ready',
    interval: '10s',
    deregisterCriticalServiceAfter: '30s',
  },
});

// Discover another service
async function getPaymentServiceAddress() {
  const services = await consul.health.service({
    service: 'payment-api',
    passing: true, // Only healthy instances
  });

  if (!services.length) throw new Error('No healthy payment-api instances');

  // Client-side load balancing (round-robin)
  const service = services[Math.floor(Math.random() * services.length)];
  return \`http://\${service.Service.Address}:\${service.Service.Port}\`;
}`,
      language: 'yaml',
    },
    interviewAnswer: 'In Kubernetes, service discovery is automatic — just use the Service name as the hostname. Kubernetes DNS resolves it to a healthy pod IP, and kube-proxy handles load balancing. Outside Kubernetes, Consul or Eureka provide the same capability. The key benefit: when you scale from 3 to 10 instances, all callers automatically discover the new instances without any configuration changes.',
    commonMistakes: [
      'Hardcoding service URLs or IPs (breaks on scaling/restart)',
      'Not registering health checks (unhealthy instances receive traffic)',
      'Not implementing service discovery at all in microservices',
    ],
    realWorldUse: 'Every Kubernetes deployment uses built-in service discovery. Netflix Eureka, Consul, and Istio service mesh all provide service discovery.',
    followUpQuestions: ['What is a service mesh?', 'How does Kubernetes DNS work?'],
  },

  {
    id: 'be-saga-pattern',
    category: 'backend',
    type: 'theory',
    question: 'What is the Saga pattern for distributed transactions?',
    difficulty: 'advanced',
    tags: ['saga', 'distributed-transactions', 'microservices', 'choreography'],
    shortAnswer: 'Saga manages long-running distributed transactions as a sequence of local transactions. Each step has a compensating transaction for rollback. Two flavours: Choreography (services emit events, react to others) and Orchestration (central coordinator directs steps).',
    detailedExplanation: 'Microservices can\'t share a database transaction across service boundaries. Saga replaces ACID with a sequence of local transactions linked by events. If step 3 fails, compensating transactions undo steps 1 and 2. Choreography: each service publishes events and listens to others — decoupled but hard to visualise. Orchestration: a Saga orchestrator calls each service and handles failure/compensation — clearer flow, more coupling.',
    example: {
      code: `// Order Saga — Orchestration pattern

class OrderSagaOrchestrator {
  async execute(orderId: string, orderData: OrderData): Promise<void> {
    const saga = await this.sagaRepo.create({
      orderId,
      status: 'started',
      steps: [],
    });

    try {
      // Step 1: Reserve inventory
      await this.step(saga, 'RESERVE_INVENTORY', async () => {
        await inventoryService.reserve(orderData.items);
        return { type: 'RELEASE_INVENTORY', data: orderData.items }; // Compensation
      });

      // Step 2: Charge payment
      await this.step(saga, 'CHARGE_PAYMENT', async () => {
        const chargeId = await paymentService.charge(orderData.payment);
        return { type: 'REFUND_PAYMENT', data: { chargeId } }; // Compensation
      });

      // Step 3: Schedule shipping
      await this.step(saga, 'SCHEDULE_SHIPPING', async () => {
        const shipmentId = await shippingService.schedule(orderData.address);
        return { type: 'CANCEL_SHIPMENT', data: { shipmentId } }; // Compensation
      });

      // Step 4: Confirm order
      await orderService.confirm(orderId);
      await this.sagaRepo.complete(saga.id);

    } catch (err) {
      // Rollback: execute compensations in reverse
      await this.compensate(saga);
      await this.sagaRepo.fail(saga.id, err.message);
      throw err;
    }
  }

  private async step(saga: Saga, name: string, fn: () => Promise<Compensation>) {
    const compensation = await fn();
    await this.sagaRepo.recordStep(saga.id, { name, compensation, status: 'completed' });
  }

  private async compensate(saga: Saga): Promise<void> {
    const completedSteps = saga.steps.filter(s => s.status === 'completed').reverse();

    for (const step of completedSteps) {
      try {
        await this.executeCompensation(step.compensation);
        await this.sagaRepo.markCompensated(saga.id, step.name);
      } catch (compensationError) {
        // Compensation failed — manual intervention needed
        logger.error({ compensationError, step }, 'Compensation failed!');
        await this.notifyOncallTeam(saga.id, step);
      }
    }
  }
}

// Choreography pattern — event-driven (alternative)
// Order service
orderService.on('OrderCreated', async (event) => {
  await eventBus.publish('InventoryReservationRequested', event.orderData);
});

// Inventory service
eventBus.on('InventoryReservationRequested', async (event) => {
  const success = await reserveItems(event.items);
  if (success) {
    await eventBus.publish('InventoryReserved', event);
  } else {
    await eventBus.publish('InventoryReservationFailed', { orderId: event.orderId });
  }
});

// Order service reacts to failure
eventBus.on('InventoryReservationFailed', async (event) => {
  await orderService.cancel(event.orderId, 'Inventory unavailable');
});`,
      language: 'typescript',
    },
    interviewAnswer: 'Saga is how you do distributed transactions without two-phase commit. The key insight: instead of one atomic transaction, you have a series of steps where each step can be undone. The hardest part is writing compensating transactions that actually work — if "charge payment" succeeds but "reserve inventory" fails, the refund must actually process. I prefer orchestration for visibility — you can see the state of a saga in one place, rather than trying to reconstruct it from events across multiple services.',
    commonMistakes: [
      'No compensation transactions (can\'t undo partial completion)',
      'Compensation that can also fail without a plan (manual intervention needed)',
      'Treating saga as a replacement for ACID (it\'s eventual consistency, not atomic)',
    ],
    realWorldUse: 'E-commerce checkout (inventory + payment + shipping), travel booking, financial transfers across systems.',
    followUpQuestions: ['What is the difference between Choreography and Orchestration in Saga?', 'How does Saga handle idempotency?'],
  },

  {
    id: 'be-docker-kubernetes',
    category: 'backend',
    type: 'theory',
    question: 'What is the difference between Docker and Kubernetes? When do you need each?',
    difficulty: 'intermediate',
    tags: ['docker', 'kubernetes', 'containers', 'orchestration'],
    shortAnswer: 'Docker packages applications into containers (portable, isolated). Kubernetes orchestrates many containers across many servers — handles scheduling, scaling, self-healing, service discovery, rolling updates. Docker is for building and running; Kubernetes is for managing at scale.',
    detailedExplanation: 'Docker solves "works on my machine" — packages app with all dependencies into an image. Run the image anywhere. Good for development and single-server production. Kubernetes (K8s) solves managing many containers across many servers — it schedules containers on nodes, restarts failed pods, scales horizontally, routes traffic, manages secrets, and rolls out updates without downtime. For small teams/apps, managed services (Railway, Render, Fly.io) abstract Kubernetes complexity.',
    example: {
      code: `# Docker — package and run a container

# Dockerfile (already covered in nodejs-docker question)
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
USER nodejs
EXPOSE 3000
CMD ["node", "dist/server.js"]

# Build and run
docker build -t my-api:latest .
docker run -p 3000:3000 --env-file .env my-api:latest

# Docker Compose — local multi-container development
version: '3.8'
services:
  api:
    build: .
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: postgresql://postgres:password@db:5432/myapp
    depends_on:
      db:
        condition: service_healthy
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: password
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]

# Kubernetes — orchestrate containers at scale

# deployment.yaml — describe desired state
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3                    # Keep 3 instances running
  strategy:
    type: RollingUpdate          # Zero-downtime updates
    rollingUpdate:
      maxUnavailable: 0
      maxSurge: 1
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: my-api:v1.2.3   # Specific version, not latest
          ports:
            - containerPort: 3000
          resources:
            requests:             # Guaranteed resources
              memory: "128Mi"
              cpu: "100m"
            limits:               # Maximum resources
              memory: "512Mi"
              cpu: "500m"
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:     # From Kubernetes Secret
                  name: app-secrets
                  key: database-url
          livenessProbe:
            httpGet:
              path: /health/live
              port: 3000
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /health/ready
              port: 3000
            periodSeconds: 15

# When to use what:
# Local dev → Docker Compose
# Single server small app → Docker + docker-compose or simple PaaS
# Production multi-server → Kubernetes (or managed: EKS, GKE, AKS)
# Teams without DevOps → Railway, Render, Fly.io (abstracts K8s)`,
      language: 'dockerfile',
    },
    interviewAnswer: 'Docker and Kubernetes are at different levels of abstraction. Docker is about packaging — I use it for every project to ensure consistent environments. Docker Compose handles local multi-service development. Kubernetes is about running many containers reliably at scale — it handles restarts, scaling, and updates. For most small teams I recommend managed platforms (Railway, Render) that handle the Kubernetes complexity. The jump to self-managed Kubernetes is significant.',
    commonMistakes: [
      'Using latest Docker tag in production (unpredictable updates)',
      'No resource limits (one pod can starve others)',
      'Not setting up readiness probes (traffic to starting pods)',
    ],
    realWorldUse: 'Docker is used in virtually all production deployments. Kubernetes runs ~70% of containerised workloads. AWS EKS, Google GKE, Azure AKS are managed Kubernetes.',
    followUpQuestions: ['What is a Kubernetes Pod vs Deployment?', 'What is a Kubernetes Service vs Ingress?'],
  },
];
