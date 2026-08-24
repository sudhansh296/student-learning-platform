import { InterviewQuestion } from '@/lib/interview-types';

export const restapiInterviewQuestions: InterviewQuestion[] = [
  {
    id: 'rest-what-is-rest',
    category: 'rest-api',
    type: 'theory',
    question: 'What is REST and what are its core constraints?',
    difficulty: 'beginner',
    tags: ['rest', 'architecture', 'http'],
    shortAnswer: 'REST (Representational State Transfer) is an architectural style for designing web APIs. Its six constraints are: client-server, stateless, cacheable, uniform interface, layered system, and code on demand (optional).',
    detailedExplanation: 'REST defines how web services should communicate. Stateless means each request contains all information needed; server stores no session state. Uniform interface standardizes how resources are identified (URLs), manipulated (HTTP methods), and described (representations like JSON). Client-server separates UI from data storage. Cacheable responses improve performance. Layered system allows intermediaries like load balancers.',
    example: {
      code: `// RESTful API example
// Resource-based URLs (nouns, not verbs)

// âœ… RESTful
GET    /api/users          // List all users
GET    /api/users/123      // Get user 123
POST   /api/users          // Create new user
PUT    /api/users/123      // Replace user 123
PATCH  /api/users/123      // Update user 123
DELETE /api/users/123      // Delete user 123

// âŒ Not RESTful (using verbs)
GET  /api/getUsers
POST /api/createUser
GET  /api/deleteUser/123

// Stateless - every request is self-contained
GET /api/orders
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
// Server doesn't need to remember previous requests`,
      language: 'http'
    },
    interviewAnswer: 'REST is an architectural style, not a protocol. The key principle I follow is statelessness - each API call contains everything needed to process it, no server-side sessions. I design resource-based URLs using nouns and let HTTP methods (GET, POST, PUT, DELETE) define the action. This makes APIs predictable and easy to use.',
    commonMistakes: [
      'Using verbs in URLs (/getUser instead of GET /user)',
      'Storing session state on the server (breaks statelessness)',
      'Using GET for operations that change data',
      'Ignoring HTTP status codes'
    ],
    realWorldUse: 'GitHub API, Twitter API, Stripe API, and most modern web services use REST. It\'s the standard for web APIs because it leverages HTTP infrastructure (caching, load balancing, CDNs).',
    followUpQuestions: [
      'What makes an API truly RESTful?',
      'What is the difference between REST and SOAP?',
      'What is HATEOAS?'
    ]
  },

  {
    id: 'rest-http-methods',
    category: 'rest-api',
    type: 'theory',
    question: 'What are the HTTP methods and when should you use each?',
    difficulty: 'beginner',
    tags: ['http-methods', 'crud', 'idempotent'],
    shortAnswer: 'GET (read), POST (create), PUT (replace), PATCH (partial update), DELETE (remove). GET/PUT/DELETE/HEAD are idempotent - calling them multiple times has same effect as calling once.',
    detailedExplanation: 'GET retrieves resources, is safe (no side effects) and idempotent. POST creates new resources, not idempotent (calling twice creates two resources). PUT replaces entire resource, idempotent. PATCH updates specific fields, not necessarily idempotent. DELETE removes resource, idempotent (deleting already-deleted resource still results in it being gone). HEAD is like GET but returns only headers. OPTIONS describes allowed methods.',
    example: {
      code: `// GET - Read (safe, idempotent)
GET /api/users/123
Response: { id: 123, name: "Alex", email: "alex@example.com" }

// POST - Create (not idempotent)
POST /api/users
Body: { name: "Sam", email: "sam@example.com" }
Response 201: { id: 124, name: "Sam", ... }

// PUT - Replace entire resource (idempotent)
PUT /api/users/123
Body: { name: "Alex Smith", email: "alex@example.com", age: 25 }
// Must send ALL fields

// PATCH - Partial update
PATCH /api/users/123
Body: { name: "Alex Smith" }
// Only update what's sent

// DELETE - Remove (idempotent)
DELETE /api/users/123
Response: 204 No Content

// Idempotency example
DELETE /api/users/123  // First call: 204 deleted
DELETE /api/users/123  // Second call: 404 not found
// Result is same: user 123 doesn't exist`,
      language: 'http'
    },
    interviewAnswer: 'I choose HTTP methods based on what the operation does. GET for fetching data, POST for creating resources, PUT when replacing entire resource, PATCH for partial updates. Idempotency matters for reliability - if a DELETE request times out and I retry, it\'s safe because the end state is the same. POST is not idempotent - retrying accidentally creates duplicates, which is why I use idempotency keys for payments.',
    commonMistakes: [
      'Using GET for operations with side effects',
      'Using POST for everything',
      'Not understanding idempotency differences between PUT and PATCH',
      'Confusing 200 OK with 201 Created for POST'
    ],
    realWorldUse: 'Every REST API uses these. Browsers send GET/POST from forms. AJAX calls use all methods. API clients like Postman test with all methods.',
    followUpQuestions: [
      'What is idempotency?',
      'When would you use PATCH vs PUT?',
      'Can GET have a request body?'
    ]
  },

  {
    id: 'rest-status-codes',
    category: 'rest-api',
    type: 'theory',
    question: 'What are HTTP status codes? Name the most important ones.',
    difficulty: 'beginner',
    tags: ['status-codes', 'http', 'errors'],
    shortAnswer: '2xx (success), 3xx (redirect), 4xx (client error), 5xx (server error). Key codes: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 422 Unprocessable, 429 Too Many Requests, 500 Internal Server Error.',
    detailedExplanation: 'Status codes tell clients what happened. 200 OK is general success. 201 Created for successful POST (resource created). 204 No Content for successful DELETE. 301/302 for redirects. 400 Bad Request when client sends malformed data. 401 means not authenticated (need to log in). 403 means authenticated but not authorized (no permission). 404 resource not found. 422 validation failed. 429 rate limit exceeded. 500 server crashed. 503 service unavailable.',
    example: {
      code: `// Express.js examples
app.get('/users/:id', (req, res) => {
  const user = findUser(req.params.id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.status(200).json(user); // or just res.json(user)
});

app.post('/users', (req, res) => {
  if (!req.body.email) {
    return res.status(400).json({ error: 'Email required' });
  }
  
  const user = createUser(req.body);
  res.status(201).json(user); // 201 = Created
});

app.delete('/users/:id', (req, res) => {
  deleteUser(req.params.id);
  res.status(204).send(); // 204 = No Content
});

// Authentication vs Authorization
// 401 Unauthorized - not logged in
if (!req.headers.authorization) {
  return res.status(401).json({ error: 'Please log in' });
}

// 403 Forbidden - logged in but no permission
if (req.user.role !== 'admin') {
  return res.status(403).json({ error: 'Admins only' });
}

// 429 Too Many Requests
if (requestCount > limit) {
  return res.status(429).json({ 
    error: 'Rate limit exceeded',
    retryAfter: 60 
  });
}`,
      language: 'javascript'
    },
    interviewAnswer: 'Correct status codes make APIs self-documenting. I return 201 when creating resources, 204 for deletes (no body needed), 400 when the client sent wrong data, 401 when they\'re not logged in, 403 when they don\'t have permission. I distinguish 401 vs 403 because they require different client actions - one requires login, one requires different permissions.',
    commonMistakes: [
      'Returning 200 for errors (JSON body has "error" but status is 200)',
      'Confusing 401 and 403',
      'Using 500 for client errors',
      'Not using 201 for successful creation'
    ],
    realWorldUse: 'Every API client (browsers, mobile apps, other services) checks status codes to determine what to do. Frontend apps show different UI based on 401 (redirect to login) vs 403 (show "unauthorized" message).',
    followUpQuestions: [
      'What is the difference between 401 and 403?',
      'When should you use 422 vs 400?',
      'What does 304 Not Modified mean?'
    ]
  },

  {
    id: 'rest-cors',
    category: 'rest-api',
    type: 'theory',
    question: 'What is CORS and how does it work?',
    difficulty: 'intermediate',
    tags: ['cors', 'security', 'browser'],
    shortAnswer: 'CORS (Cross-Origin Resource Sharing) is a browser security mechanism that restricts web pages from making requests to a different domain. Servers must explicitly allow cross-origin requests with CORS headers.',
    detailedExplanation: 'Browsers enforce the Same-Origin Policy - JavaScript can only make requests to the same origin (protocol + domain + port). CORS allows servers to relax this restriction. For simple requests, browser adds Origin header. For "preflighted" requests (non-GET/POST or custom headers), browser first sends OPTIONS request to check permissions. Server responds with Access-Control-Allow-Origin and other CORS headers.',
    example: {
      code: `// Express CORS setup
const cors = require('cors');

// Allow all origins (development only)
app.use(cors());

// Specific origins (production)
app.use(cors({
  origin: ['https://myapp.com', 'https://admin.myapp.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow cookies
  maxAge: 86400      // Cache preflight for 24h
}));

// Manual CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://myapp.com');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).send();
  }
  
  next();
});

// Error that CORS causes
// Frontend (http://localhost:3000) calling API (http://localhost:5000)
// Browser console: "Access to fetch at 'http://localhost:5000/api' 
// from origin 'http://localhost:3000' has been blocked by CORS policy"`,
      language: 'javascript'
    },
    interviewAnswer: 'CORS is a browser security feature that prevents malicious sites from making requests to my API using a user\'s credentials. My Express API needs to explicitly allow specific origins. In development I allow all origins, but in production I whitelist specific domains. The tricky part is credentials - if my frontend sends cookies or auth headers, I need credentials: true and can\'t use wildcard origin.',
    commonMistakes: [
      'Using wildcard origin with credentials: true (not allowed)',
      'Forgetting to handle OPTIONS preflight requests',
      'Thinking CORS is server security (it\'s browser security)',
      'Not realizing CORS doesn\'t apply to server-to-server requests'
    ],
    realWorldUse: 'Every API consumed by a browser frontend needs CORS configuration. Separate frontend/backend deployments always need CORS. Mobile apps don\'t have CORS restrictions. Postman doesn\'t enforce CORS.',
    followUpQuestions: [
      'Does CORS protect the server?',
      'What is a preflight request?',
      'Can you bypass CORS?'
    ]
  },

  {
    id: 'rest-jwt',
    category: 'rest-api',
    type: 'theory',
    question: 'What is JWT authentication and how does it work?',
    difficulty: 'intermediate',
    tags: ['jwt', 'authentication', 'security'],
    shortAnswer: 'JWT (JSON Web Token) is a token containing encoded user data, signed with a secret. Server creates it on login; client sends it with each request. Server verifies signature without database lookup.',
    detailedExplanation: 'JWT has three base64-encoded parts: Header (algorithm), Payload (claims like userId, role, expiry), Signature (HMAC of header+payload using secret). Server signs token on login and returns it. Client stores it (localStorage or httpOnly cookie) and sends in Authorization header. Server verifies signature on each request - no session database needed. Tokens can\'t be forged without the secret.',
    example: {
      code: `// Login - create JWT
const jwt = require('jsonwebtoken');

app.post('/api/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  
  if (!user || !await bcrypt.compare(req.body.password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = jwt.sign(
    { userId: user._id, role: user.role },  // Payload
    process.env.JWT_SECRET,                  // Secret
    { expiresIn: '7d' }                      // Expiry
  );
  
  res.json({ token });
});

// Middleware - verify JWT
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role, iat, exp }
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Protected route
app.get('/api/profile', authenticate, (req, res) => {
  res.json({ userId: req.user.userId });
});

// JWT structure
// eyJhbGciOiJIUzI1NiJ9        <- Header (base64)
// .eyJ1c2VySWQiOiIxMjMifQ    <- Payload (base64)
// .SflKxwRJSMeKKF2QT4fwpMeJ  <- Signature`,
      language: 'javascript'
    },
    interviewAnswer: 'JWT allows stateless authentication. After login, I sign a token with the user\'s ID and role. The client sends it with every request in the Authorization header. I verify the signature on my server - no database lookup needed for auth. This scales well because any server instance can verify the token. I store sensitive tokens in httpOnly cookies to prevent XSS, and set short expiry with refresh tokens for security.',
    commonMistakes: [
      'Storing JWT in localStorage (vulnerable to XSS)',
      'Not setting expiry (tokens last forever)',
      'Putting sensitive data in payload (it\'s only base64, not encrypted)',
      'Not handling token expiry on client side'
    ],
    realWorldUse: 'Most modern APIs use JWT. Mobile apps, SPAs, and microservices use JWT for stateless auth. Refresh token patterns handle long-lived sessions securely.',
    followUpQuestions: [
      'What is the difference between authentication and authorization?',
      'Is JWT payload encrypted?',
      'How do you handle JWT token refresh?'
    ]
  },

  {
    id: 'rest-versioning',
    category: 'rest-api',
    type: 'theory',
    question: 'What are REST API versioning strategies?',
    difficulty: 'intermediate',
    tags: ['versioning', 'api-design', 'best-practices'],
    shortAnswer: 'Three main strategies: URL path (/api/v1/users), query parameter (?version=1), and custom HTTP header (API-Version: 1). URL versioning is most common and visible.',
    detailedExplanation: 'API versioning allows evolving APIs without breaking existing clients. URL path versioning (/v1/, /v2/) is most visible and easy to test. Query param versioning is flexible but pollutes URLs. Header versioning is cleaner but harder to test in browsers. Semantic versioning helps communicate breaking changes. Some teams use header versioning in enterprise and URL versioning for public APIs.',
    example: {
      code: `// URL Path Versioning (most common)
GET /api/v1/users
GET /api/v2/users  // New version with different response shape

// Express route structure
app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);

const v1Router = express.Router();
v1Router.get('/users', v1UserController.getAll);

const v2Router = express.Router();
v2Router.get('/users', v2UserController.getAll);

// Query Parameter Versioning
GET /api/users?version=1
GET /api/users?version=2

// Header Versioning
GET /api/users
Accept-Version: 1.0

// or
GET /api/users
API-Version: 2024-01-01

// Express header versioning
app.get('/api/users', (req, res) => {
  const version = req.header('API-Version') || '1';
  
  if (version === '2') {
    return res.json(getUsersV2());
  }
  return res.json(getUsersV1());
});

// Version in Accept header (GitHub style)
Accept: application/vnd.github.v3+json`,
      language: 'javascript'
    },
    interviewAnswer: 'I use URL versioning because it\'s the most explicit - developers can see the version in browser, bookmark URLs, and test easily with Postman. I maintain old versions with bug fixes only, and deprecate them with a sunset date in the response headers. Breaking changes (removing fields, changing types) require a new version; additive changes (new fields) don\'t.',
    commonMistakes: [
      'Breaking old API versions without deprecation period',
      'Not communicating deprecations to clients',
      'Versioning too frequently (create API churn)',
      'Not treating breaking vs non-breaking changes differently'
    ],
    realWorldUse: 'GitHub, Stripe, Twilio all use URL versioning. REST API versioning is critical for long-lived public APIs. Internal APIs sometimes skip versioning with consumer-driven contracts instead.',
    followUpQuestions: [
      'When should you create a new API version?',
      'What is a "breaking change" in APIs?',
      'How do you deprecate an API version?'
    ]
  },

  {
    id: 'rest-idempotency',
    category: 'rest-api',
    type: 'theory',
    question: 'What is idempotency and why does it matter?',
    difficulty: 'intermediate',
    tags: ['idempotency', 'http-methods', 'reliability'],
    shortAnswer: 'An idempotent operation produces the same result no matter how many times it\'s performed. GET, PUT, DELETE, HEAD are idempotent. POST is not. Critical for handling network failures and retries safely.',
    detailedExplanation: 'Idempotency means multiple identical requests have same effect as a single request. Critical for retry logic - if a DELETE request times out, retrying is safe. POST is not idempotent - retrying a payment creates duplicate charges. To make POST idempotent, use idempotency keys (unique ID per request). Server detects duplicate key and returns the same response instead of processing again.',
    example: {
      code: `// Idempotent methods
GET /api/users/123    // Always returns same user
GET /api/users/123    // Same result
GET /api/users/123    // Same result - safe to retry

DELETE /api/users/123  // First: deletes user, returns 204
DELETE /api/users/123  // Second: user already gone, returns 404
// End result is same: user doesn't exist

PUT /api/users/123 { name: "Alex" }  // Sets name to Alex
PUT /api/users/123 { name: "Alex" }  // Sets name to Alex again
// Same end state

// POST is NOT idempotent
POST /api/orders { item: "laptop" }  // Creates order #1
POST /api/orders { item: "laptop" }  // Creates order #2! Different result

// Making POST idempotent with idempotency key
app.post('/api/payments', async (req, res) => {
  const idempotencyKey = req.header('Idempotency-Key');
  
  if (idempotencyKey) {
    // Check if we've seen this key before
    const existing = await cache.get(idempotencyKey);
    if (existing) {
      return res.status(200).json(existing); // Return cached response
    }
  }
  
  const payment = await processPayment(req.body);
  
  if (idempotencyKey) {
    await cache.set(idempotencyKey, payment, 24 * 60 * 60); // Cache 24h
  }
  
  res.status(201).json(payment);
});

// Client sends idempotency key
fetch('/api/payments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Idempotency-Key': 'order-' + crypto.randomUUID()
  },
  body: JSON.stringify({ amount: 100 })
});`,
      language: 'javascript'
    },
    interviewAnswer: 'Idempotency is crucial for reliable systems. Network timeouts mean we don\'t know if the request succeeded, so we retry. Safe to retry GET and DELETE - same end result. POST for payments is dangerous to retry blindly - could charge twice. Stripe uses idempotency keys: I send a unique key with each payment request, and if I retry, Stripe returns the original response instead of charging again.',
    commonMistakes: [
      'Retrying POST requests without idempotency keys',
      'Thinking DELETE must always return 200 (404 on retry is fine)',
      'Not implementing idempotency for payment endpoints',
      'Confusing idempotency with safety (GET is safe and idempotent, DELETE is only idempotent)'
    ],
    realWorldUse: 'Payment systems (Stripe, PayPal), email APIs, any operation users can\'t undo. Mobile apps with unreliable connections need idempotency to handle reconnects safely.',
    followUpQuestions: [
      'Is DELETE idempotent if it returns 404 on second call?',
      'What is the difference between idempotent and safe?',
      'How do you implement idempotency on the server?'
    ]
  },

  {
    id: 'rest-pagination',
    category: 'rest-api',
    type: 'theory',
    question: 'How do you implement pagination in REST APIs?',
    difficulty: 'intermediate',
    tags: ['pagination', 'performance', 'api-design'],
    shortAnswer: 'Two main strategies: offset pagination (?page=2&limit=20) and cursor-based pagination (?cursor=abc123&limit=20). Cursor pagination is better for large or real-time datasets.',
    detailedExplanation: 'Offset pagination uses skip/limit - easy to implement but slow on large datasets (database scans all skipped rows). Also inconsistent when data changes (items added/removed while paginating). Cursor pagination uses an opaque pointer to the last seen item - faster and consistent. Best for infinite scroll, social feeds. Always return pagination metadata (total, hasNext, nextCursor).',
    example: {
      code: `// Offset Pagination
// GET /api/posts?page=2&limit=10

app.get('/api/posts', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const [posts, total] = await Promise.all([
    Post.find().skip(skip).limit(limit),
    Post.countDocuments()
  ]);
  
  res.json({
    data: posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    }
  });
});

// Cursor Pagination (better for large data)
// GET /api/posts?cursor=507f1f77bcf86cd799439011&limit=10

app.get('/api/posts', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const cursor = req.query.cursor;
  
  const query = cursor 
    ? { _id: { $gt: cursor } }
    : {};
  
  const posts = await Post.find(query).limit(limit + 1);
  
  const hasNext = posts.length > limit;
  const data = hasNext ? posts.slice(0, limit) : posts;
  const nextCursor = hasNext ? data[data.length - 1]._id : null;
  
  res.json({
    data,
    pagination: {
      hasNext,
      nextCursor
    }
  });
});

// Client using cursor pagination
async function loadMore(cursor) {
  const url = cursor
    ? \`/api/posts?cursor=\${cursor}&limit=10\`
    : '/api/posts?limit=10';
    
  const response = await fetch(url);
  const { data, pagination } = await response.json();
  
  displayPosts(data);
  
  if (pagination.hasNext) {
    loadMoreButton.dataset.cursor = pagination.nextCursor;
  }
}`,
      language: 'javascript'
    },
    interviewAnswer: 'I choose pagination strategy based on the use case. Offset pagination for admin tables where users jump to specific pages. Cursor pagination for infinite scroll feeds because it\'s consistent even when data changes - no duplicate or missing items. I always include pagination metadata so clients know if there\'s more data and how to fetch it.',
    commonMistakes: [
      'Using offset pagination for large or frequently updated datasets',
      'Not returning pagination metadata',
      'Using incrementing IDs as cursors (security issue)',
      'Not handling edge cases (empty page, last page)'
    ],
    realWorldUse: 'Twitter/Instagram use cursor pagination for feeds. Admin dashboards use offset pagination for tables. GitHub API uses both depending on the endpoint.',
    followUpQuestions: [
      'Why is cursor pagination better for social feeds?',
      'What are the downsides of offset pagination?',
      'How do you implement backwards pagination with cursors?'
    ]
  },

  {
    id: 'rest-rate-limiting',
    category: 'rest-api',
    type: 'theory',
    question: 'What is rate limiting and how do you implement it?',
    difficulty: 'intermediate',
    tags: ['rate-limiting', 'security', 'performance'],
    shortAnswer: 'Rate limiting restricts how many requests a client can make in a time window. Protects against DoS attacks and abuse. Returns 429 Too Many Requests when exceeded.',
    detailedExplanation: 'Rate limiting protects APIs from abuse, DoS attacks, and excessive costs. Common strategies: fixed window (100 req/hour), sliding window (more accurate), token bucket (allows bursts). Implemented using Redis counters or in-memory stores. Return rate limit info in headers (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset). Different limits for different endpoints and user tiers.',
    example: {
      code: `// express-rate-limit package
const rateLimit = require('express-rate-limit');

// Global rate limit
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                   // 100 requests per window
  message: {
    error: 'Too many requests',
    retryAfter: '15 minutes'
  },
  headers: true,  // Adds X-RateLimit-* headers
  standardHeaders: true,
  legacyHeaders: false
});

app.use(globalLimiter);

// Stricter limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,                    // 10 login attempts
  skipSuccessfulRequests: true
});

app.post('/api/login', authLimiter, loginHandler);

// Different limits per user tier
function createLimiter(free, premium) {
  return (req, res, next) => {
    const limit = req.user?.isPremium ? premium : free;
    rateLimit({ max: limit, windowMs: 60000 })(req, res, next);
  };
}

app.get('/api/data', authenticate, createLimiter(10, 100), getDataHandler);

// Response headers set automatically
// X-RateLimit-Limit: 100
// X-RateLimit-Remaining: 87
// X-RateLimit-Reset: 1640995200

// When exceeded
// HTTP 429 Too Many Requests
// Retry-After: 900`,
      language: 'javascript'
    },
    interviewAnswer: 'Rate limiting is essential for any public API. I use express-rate-limit with Redis in production for distributed systems - in-memory limiters don\'t work across multiple servers. I apply different limits based on endpoint sensitivity: strict limits on auth endpoints to prevent brute force, looser limits on read endpoints. I always include X-RateLimit headers so clients can implement backoff logic.',
    commonMistakes: [
      'Using in-memory store across multiple server instances',
      'Same rate limit for all endpoints',
      'Not returning Retry-After header',
      'Blocking legitimate users with too-strict limits'
    ],
    realWorldUse: 'Every public API needs rate limiting. GitHub allows 5000 requests/hour for authenticated, 60 for unauthenticated. Stripe has per-endpoint limits. Many APIs offer higher limits for paid tiers.',
    followUpQuestions: [
      'How do you rate limit across multiple server instances?',
      'What is the token bucket algorithm?',
      'How do you handle rate limiting for bulk operations?'
    ]
  },

  {
    id: 'rest-auth-vs-authz',
    category: 'rest-api',
    type: 'theory',
    question: 'What is the difference between authentication and authorization?',
    difficulty: 'beginner',
    tags: ['authentication', 'authorization', 'security'],
    shortAnswer: 'Authentication verifies WHO you are (login). Authorization determines WHAT you can do (permissions). Authentication comes first. Return 401 for unauthenticated, 403 for unauthorized.',
    detailedExplanation: 'Authentication answers "Are you who you say you are?" - verified via passwords, tokens, biometrics. Authorization answers "Are you allowed to do this?" - checked via roles, permissions, policies. In REST APIs: authentication via JWT/session, authorization via role-based (RBAC) or attribute-based (ABAC) access control. Always authenticate before authorizing.',
    example: {
      code: `// Authentication - verifying identity
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    // Not authenticated - 401
    return res.status(401).json({ error: 'Login required' });
  }
  
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Authorization - checking permissions
function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      // Authenticated but not authorized - 403
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

// Usage
app.get('/api/users', authenticate, authorize('admin'), getAllUsers);
app.get('/api/profile', authenticate, getProfile);

// Role-based access control (RBAC)
const ROLES = {
  USER: ['read:own_profile', 'update:own_profile'],
  ADMIN: ['read:all_profiles', 'update:all_profiles', 'delete:users'],
  MODERATOR: ['read:all_profiles', 'delete:posts']
};

function hasPermission(role, permission) {
  return ROLES[role]?.includes(permission);
}

app.delete('/api/users/:id', authenticate, (req, res, next) => {
  if (!hasPermission(req.user.role, 'delete:users')) {
    return res.status(403).json({ error: 'Cannot delete users' });
  }
  next();
}, deleteUser);`,
      language: 'javascript'
    },
    interviewAnswer: 'Authentication and authorization are different security layers. Authentication confirms identity - "you are Alex." Authorization confirms permission - "Alex can read posts but not delete users." I handle authentication in a middleware that runs first on all protected routes. Authorization is either a second middleware or inline logic checking the user\'s role or permissions from the JWT payload.',
    commonMistakes: [
      'Confusing 401 (not authenticated) with 403 (not authorized)',
      'Doing authorization without authentication',
      'Storing sensitive permissions in JWT (can be stolen)',
      'Not checking authorization on every request (just on login)'
    ],
    realWorldUse: 'Every application with multiple user types needs both. E-commerce: authentication to see orders, authorization to manage products (admin only). SaaS: authentication to access app, authorization to see only your organization\'s data.',
    followUpQuestions: [
      'What is role-based access control (RBAC)?',
      'How do you implement row-level authorization?',
      'What is OAuth and where does it fit?'
    ]
  },

  {
    id: 'rest-caching',
    category: 'rest-api',
    type: 'theory',
    question: 'How does API caching work? What are ETags and Cache-Control headers?',
    difficulty: 'intermediate',
    tags: ['caching', 'performance', 'headers'],
    shortAnswer: 'Cache-Control headers tell clients/CDNs how long to cache responses. ETags are version identifiers - clients send them back, server returns 304 Not Modified if unchanged. Reduces bandwidth and latency.',
    detailedExplanation: 'HTTP caching reduces server load and improves performance. Cache-Control directives: max-age (seconds to cache), no-cache (must revalidate), no-store (never cache), private (client only), public (CDN allowed). ETags are hash of response content. Client sends If-None-Match header with ETag; server returns 304 if content unchanged. Last-Modified/If-Modified-Since works similarly with dates.',
    example: {
      code: `// Setting cache headers in Express
app.get('/api/products', (req, res) => {
  const products = getProducts();
  
  // Cache for 1 hour, CDNs can cache
  res.set('Cache-Control', 'public, max-age=3600');
  
  res.json(products);
});

// ETag implementation
app.get('/api/users/:id', (req, res) => {
  const user = getUser(req.params.id);
  const etag = crypto
    .createHash('md5')
    .update(JSON.stringify(user))
    .digest('hex');
  
  // Check if client has current version
  if (req.header('If-None-Match') === etag) {
    return res.status(304).send(); // Not Modified - no body
  }
  
  res.set('ETag', etag);
  res.set('Cache-Control', 'private, max-age=0');
  res.json(user);
});

// Last-Modified
app.get('/api/articles/:id', (req, res) => {
  const article = getArticle(req.params.id);
  const lastModified = article.updatedAt.toUTCString();
  
  if (req.header('If-Modified-Since') === lastModified) {
    return res.status(304).send();
  }
  
  res.set('Last-Modified', lastModified);
  res.json(article);
});

// Different caching strategies
// Static assets - cache forever with versioned URLs
app.get('/api/config', (req, res) => {
  res.set('Cache-Control', 'public, max-age=86400'); // 24h
  res.json(config);
});

// User-specific data - never cache on CDN
app.get('/api/cart', authenticate, (req, res) => {
  res.set('Cache-Control', 'private, no-cache');
  res.json(getUserCart(req.user.id));
});`,
      language: 'javascript'
    },
    interviewAnswer: 'API caching significantly reduces server load. For public, rarely-changing data like product catalogs, I set Cache-Control: public, max-age=3600 so CDNs cache it. For user-specific data, Cache-Control: private. ETags let clients check if data changed without downloading the full response - the server returns 304 Not Modified, saving bandwidth. I avoid caching anything that changes frequently or is user-specific.',
    commonMistakes: [
      'Caching private/user-specific data publicly',
      'Setting very long cache times without a way to invalidate',
      'Not caching public, stable resources',
      'Confusing browser cache with server-side cache (Redis)'
    ],
    realWorldUse: 'CDNs like CloudFront and Cloudflare use Cache-Control headers. REST frameworks support ETag middleware. Caching public API responses can reduce database load by 90%.',
    followUpQuestions: [
      'What is the difference between ETags and Last-Modified?',
      'How do you invalidate a cached response?',
      'What is a CDN and how does it use cache headers?'
    ]
  },

  {
    id: 'rest-graphql-vs-rest',
    category: 'rest-api',
    type: 'theory',
    question: 'What is the difference between REST and GraphQL? When would you use each?',
    difficulty: 'intermediate',
    tags: ['graphql', 'rest', 'api-design'],
    shortAnswer: 'REST uses fixed endpoints returning fixed data shapes. GraphQL uses a single endpoint where clients specify exactly what data they need. GraphQL solves over-fetching and under-fetching.',
    detailedExplanation: 'REST has multiple endpoints, each returning a fixed structure. Over-fetching happens when the endpoint returns more data than needed. Under-fetching means needing multiple requests to get all required data. GraphQL uses a type system and query language - clients request exactly the fields they need in one query. Better for complex data relationships and multiple clients with different needs.',
    example: {
      code: `// REST - Multiple requests, fixed shape
GET /api/users/1
// Returns all user fields even if you only need name

GET /api/users/1/posts
// Separate request for posts

GET /api/users/1/posts/5/comments
// Another separate request

// Over-fetching: getting entire user object for just the name
// Under-fetching: need 3 requests to get user + posts + comments

// GraphQL - One request, exactly what you need
POST /graphql
{
  user(id: "1") {
    name          # Only fields I need
    posts {
      title
      comments {
        text
        author { name }
      }
    }
  }
}
// Returns EXACTLY this structure in one request

// GraphQL Mutations (like POST/PUT/DELETE)
mutation {
  createPost(title: "Hello", content: "World") {
    id
    title
    createdAt
  }
}

// When to use REST:
// - Simple CRUD operations
// - Public APIs with stable requirements
// - File uploads
// - When HTTP caching is important

// When to use GraphQL:
// - Complex data relationships
// - Multiple client types (web/mobile) need different data shapes
// - Rapid iteration on frontend without backend changes
// - You need to combine data from multiple sources`,
      language: 'graphql'
    },
    interviewAnswer: 'I choose based on the use case. For simple CRUD APIs and public APIs, REST is simpler and better supported by HTTP infrastructure like caching and CDNs. For complex apps where mobile needs different data than web, or where many related resources are needed together, GraphQL eliminates the over/under-fetching problem. GraphQL has a steeper learning curve and caching is more complex, but flexibility is worth it for data-heavy applications.',
    commonMistakes: [
      'Using GraphQL for everything (REST is simpler for simple use cases)',
      'Thinking GraphQL replaces REST entirely',
      'Not handling N+1 query problem in GraphQL resolvers',
      'Over-complicating REST to be "like GraphQL"'
    ],
    realWorldUse: 'Facebook invented GraphQL for their complex social graph. GitHub, Shopify, and Twitter offer GraphQL APIs. Many companies use REST for public APIs and GraphQL internally.',
    followUpQuestions: [
      'What is the N+1 problem in GraphQL?',
      'Can you use REST and GraphQL together?',
      'What is a GraphQL schema?'
    ]
  },

  {
    id: 'rest-error-handling',
    category: 'rest-api',
    type: 'theory',
    question: 'What are REST API error handling best practices?',
    difficulty: 'intermediate',
    tags: ['error-handling', 'best-practices', 'api-design'],
    shortAnswer: 'Use correct HTTP status codes, return consistent JSON error objects with error code, message, and details. Never expose stack traces to clients. Log errors server-side.',
    detailedExplanation: 'Good error responses help clients handle errors properly. Include: correct status code, machine-readable error code (for i18n/handling), human-readable message, field-level validation errors for 422, request ID for tracing. Never expose internal errors, stack traces, or database details. Log all errors server-side with context for debugging.',
    example: {
      code: `// Consistent error response shape
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      { "field": "email", "message": "Invalid email format" },
      { "field": "age", "message": "Must be 18 or older" }
    ],
    "requestId": "req_abc123" // For support tracing
  }
}

// Express global error handler
app.use((err, req, res, next) => {
  const requestId = req.id; // from express-request-id
  
  // Log full error for debugging
  console.error({ requestId, error: err.stack, url: req.url });
  
  // Operational errors (expected)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        requestId
      }
    });
  }
  
  // Unexpected errors (never expose internals)
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      requestId
    }
  });
});

// Custom error class
class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
  }
}

// Throwing meaningful errors
app.get('/api/users/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }
    
    res.json(user);
  } catch (err) {
    next(err); // Pass to error handler
  }
});

// Validation errors (422)
app.post('/api/users', async (req, res, next) => {
  const errors = validateUser(req.body);
  
  if (errors.length) {
    return res.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errors
      }
    });
  }
});`,
      language: 'javascript'
    },
    interviewAnswer: 'Consistent error handling is critical for API consumers. I create a custom error class distinguishing operational errors (user errors I expect, like 404) from programming errors (bugs). The global error handler formats them consistently. I never expose stack traces or database errors to clients - those stay in logs. Field-level validation errors help frontend forms show specific messages.',
    commonMistakes: [
      'Returning stack traces to clients (security risk)',
      'Inconsistent error shapes (different routes return different formats)',
      'Not logging errors server-side',
      'Using 500 for user errors like validation failures'
    ],
    realWorldUse: 'Stripe and GitHub have excellent error handling with consistent shapes and machine-readable codes. Good error responses drastically reduce integration support tickets.',
    followUpQuestions: [
      'How do you handle async errors in Express?',
      'What is the difference between operational and programming errors?',
      'How do you return field-level validation errors?'
    ]
  },

  {
    id: 'rest-hateoas',
    category: 'rest-api',
    type: 'theory',
    question: 'What is HATEOAS?',
    difficulty: 'advanced',
    tags: ['hateoas', 'rest', 'hypermedia'],
    shortAnswer: 'HATEOAS (Hypermedia as the Engine of Application State) means API responses include links to related actions and resources. Clients discover what actions are available from the response itself, without prior knowledge.',
    detailedExplanation: 'HATEOAS is a constraint of REST where responses contain hyperlinks to related resources and actions. Clients don\'t need hardcoded URL patterns - they follow links from responses. Like browsing the web: you start at a homepage and discover content through links. Responses include a _links or links property with rel (relationship), href (URL), and method. Most "REST" APIs don\'t implement HATEOAS - this is sometimes called "REST level 3".',
    example: {
      code: `// Without HATEOAS (most common)
GET /api/orders/123
{
  "id": 123,
  "status": "pending",
  "total": 99.99
}
// Client must know: how to cancel, pay, or update this order?

// With HATEOAS
GET /api/orders/123
{
  "id": 123,
  "status": "pending",
  "total": 99.99,
  "_links": {
    "self": { "href": "/api/orders/123", "method": "GET" },
    "cancel": { "href": "/api/orders/123/cancel", "method": "POST" },
    "pay": { "href": "/api/payments", "method": "POST" },
    "items": { "href": "/api/orders/123/items", "method": "GET" }
  }
}

// After payment:
GET /api/orders/123
{
  "id": 123,
  "status": "paid",
  "_links": {
    "self": { "href": "/api/orders/123", "method": "GET" },
    "track": { "href": "/api/orders/123/tracking", "method": "GET" }
    // "cancel" and "pay" links removed - actions no longer available
  }
}

// HAL (Hypertext Application Language) format
{
  "_embedded": {
    "orders": [
      {
        "id": 1,
        "_links": {
          "self": { "href": "/api/orders/1" }
        }
      }
    ]
  },
  "_links": {
    "self": { "href": "/api/orders?page=1" },
    "next": { "href": "/api/orders?page=2" }
  }
}`,
      language: 'json'
    },
    interviewAnswer: 'HATEOAS makes APIs truly self-documenting and evolvable. When the server includes links to available actions, clients don\'t need to know URL patterns in advance. The server can change URLs without breaking clients, and clients can dynamically discover what\'s possible. In practice, most REST APIs are "REST Level 2" - they use proper HTTP verbs and status codes but skip HATEOAS. It adds complexity that\'s often not worth it unless building long-lived public APIs.',
    commonMistakes: [
      'Thinking HATEOAS is required for REST (it\'s optional)',
      'Hardcoding URLs in clients when using HATEOAS',
      'Not including links for all available actions',
      'Not removing links when actions become unavailable'
    ],
    realWorldUse: 'PayPal\'s v2 API implements HATEOAS. GitHub API includes links in responses. Most internal/simple APIs skip HATEOAS. The Richardson Maturity Model describes REST levels: Level 0 (HTTP tunnel), Level 1 (Resources), Level 2 (HTTP verbs), Level 3 (HATEOAS).',
    followUpQuestions: [
      'What are the Richardson Maturity Model levels?',
      'How does HATEOAS make APIs evolvable?',
      'Is HATEOAS practical for most APIs?'
    ]
  },

  {
    id: 'rest-put-vs-patch',
    category: 'rest-api',
    type: 'theory',
    question: 'What is the difference between PUT and PATCH?',
    difficulty: 'beginner',
    tags: ['http-methods', 'put', 'patch'],
    shortAnswer: 'PUT replaces the entire resource with the request body. PATCH applies partial updates - only the fields in the body are changed. PUT requires sending all fields; PATCH only requires changed fields.',
    detailedExplanation: 'PUT is idempotent and replaces the complete resource. If you omit a field, it\'s removed. PATCH updates only the specified fields. PATCH is not necessarily idempotent (a PATCH incrementing a counter is not idempotent). Use PUT when replacing the whole resource, PATCH for partial updates. In practice, many APIs use PUT for both since most clients send only changed fields (partial PUT).',
    example: {
      code: `// Resource: User { id, name, email, age, bio }

// PUT - Replace entire resource
// Must include ALL fields or they get removed/nulled
PUT /api/users/123
Body: {
  "name": "Alex Smith",
  "email": "alex@example.com",
  "age": 26,
  "bio": "Developer"
}

// If you only send name with PUT:
PUT /api/users/123
Body: { "name": "Alex Smith" }
// Result: { id: 123, name: "Alex Smith", email: null, age: null, bio: null }
// email and age were removed!

// PATCH - Partial update
PATCH /api/users/123
Body: { "name": "Alex Smith" }
// Result: { id: 123, name: "Alex Smith", email: "alex@example.com", age: 25, bio: "Dev" }
// Only name changed, everything else preserved

// Express implementation
app.put('/api/users/:id', async (req, res) => {
  // Replace entire document
  const user = await User.findByIdAndReplace(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(user);
});

app.patch('/api/users/:id', async (req, res) => {
  // Update only provided fields
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },  // Only update provided fields
    { new: true }
  );
  res.json(user);
});`,
      language: 'javascript'
    },
    interviewAnswer: 'PUT replaces everything, PATCH updates only what you send. I use PATCH for most update operations because it\'s safer - forgot to include a field? With PATCH, it\'s unchanged. With PUT, it gets wiped. PUT is useful for specific scenarios like replacing configuration files entirely. In real APIs, PATCH is the more common choice for partial updates, and many APIs allow partial PUT even though that\'s not strictly correct.',
    commonMistakes: [
      'Using PUT without sending all fields (accidentally deletes data)',
      'Thinking PATCH is always idempotent (depends on implementation)',
      'Using POST for updates',
      'Not validating PATCH requests (partially invalid update)'
    ],
    realWorldUse: 'Updating user profiles, order statuses, settings. Most CRUD apps use PATCH for updates since full replacements are rare. Stripe uses POST for updates (not RESTful but pragmatic).',
    followUpQuestions: [
      'Is PATCH idempotent?',
      'What happens if a PUT request is missing required fields?',
      'Can PATCH be used to remove a field?'
    ]
  },
  {
    id: 'rest-api-documentation',
    category: 'rest-api',
    type: 'theory',
    question: 'How do you document a REST API? What is OpenAPI/Swagger?',
    difficulty: 'intermediate',
    tags: ['api-documentation', 'swagger', 'openapi'],
    shortAnswer: 'OpenAPI (formerly Swagger) is the standard for documenting REST APIs. It uses YAML/JSON to describe endpoints, request/response schemas, authentication, and examples. Tools auto-generate interactive docs from the spec.',
    detailedExplanation: 'Good API documentation is a product feature. OpenAPI 3.0 defines a standard specification format. swagger-jsdoc generates OpenAPI spec from JSDoc comments in code. swagger-ui-express serves interactive documentation UI. Postman collections serve as executable documentation. Alternatives: Redoc for read-only docs, Stoplight for design-first approach. Well-documented APIs dramatically reduce integration time and support tickets.',
    example: {
      language: 'javascript',
      code: `// swagger-jsdoc + swagger-ui-express in Express

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'A sample REST API',
    },
    servers: [{ url: 'https://api.myapp.com' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js'],  // Files with JSDoc comments
};

const spec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));

// In route file - JSDoc comment generates OpenAPI spec
/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: string }
 *                 name: { type: string }
 *                 email: { type: string }
 *             example:
 *               id: "123"
 *               name: "Alex"
 *               email: "alex@example.com"
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */
app.get('/api/users/:id', authenticate, getUser);

// Result: Interactive Swagger UI at /api-docs
// Users can try the API directly in the browser`
    },
    interviewAnswer: 'Good documentation is what makes an API usable. I use swagger-jsdoc to generate OpenAPI specs from comments in my route files â€” the docs stay close to the code and stay updated. The interactive Swagger UI lets developers try the API without writing any code. I also provide a Postman collection for developers who prefer that workflow. The spec also enables code generation for client SDKs.',
    commonMistakes: [
      'Outdated documentation that doesn\'t match actual API behavior',
      'No examples in the documentation',
      'Missing error response documentation',
      'No authentication examples'
    ],
    realWorldUse: 'Stripe, Twilio, GitHub all have excellent OpenAPI documentation. Enterprise APIs require OpenAPI spec for compliance. API-first development starts with the OpenAPI spec before writing code.',
    followUpQuestions: [
      'What is the difference between Swagger 2.0 and OpenAPI 3.0?',
      'What is API-first development?',
      'How do you version API documentation?'
    ]
  },
  {
    id: 'rest-webhooks',
    category: 'rest-api',
    type: 'theory',
    question: 'What are webhooks and how do they differ from REST API polling?',
    difficulty: 'intermediate',
    tags: ['webhooks', 'events', 'integration'],
    shortAnswer: 'Webhooks are HTTP callbacks â€” when an event happens, the server sends an HTTP POST to your URL. Opposite of polling (you ask the server repeatedly). More efficient for real-time updates from external services.',
    detailedExplanation: 'Polling: client asks server "did something happen?" every N seconds â€” wastes resources if events are infrequent. Webhooks: server pushes a POST to your registered URL when an event occurs. You register a callback URL with the service (Stripe, GitHub, etc.), they call it when relevant events happen. Must verify webhook signatures to ensure authenticity. Must respond with 2xx quickly (process asynchronously). Must handle duplicate events (idempotency).',
    example: {
      language: 'javascript',
      code: `// Stripe webhook example
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

app.post('/webhooks/stripe', 
  express.raw({ type: 'application/json' }), // Need raw body for verification
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    
    let event;
    try {
      // Verify webhook signature (prevents spoofing)
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      return res.status(400).send(\`Webhook Error: \${err.message}\`);
    }
    
    // Respond IMMEDIATELY - process async
    res.json({ received: true });
    
    // Process event asynchronously
    switch (event.type) {
      case 'payment_intent.succeeded':
        const payment = event.data.object;
        await activateSubscription(payment.metadata.userId);
        break;
        
      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        await deactivateAccount(subscription.metadata.userId);
        break;
    }
  }
);

// GitHub webhook for CI/CD
app.post('/webhooks/github', async (req, res) => {
  const sig = req.headers['x-hub-signature-256'];
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  
  // Verify signature
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(req.body));
  const expected = \`sha256=\${hmac.digest('hex')}\`;
  
  if (sig !== expected) return res.status(401).send('Unauthorized');
  
  res.sendStatus(200); // Respond immediately
  
  const { event } = req.headers['x-github-event'];
  if (event === 'push' && req.body.ref === 'refs/heads/main') {
    await triggerDeployment(); // Deploy on main push
  }
});

// Handling duplicate events (idempotency)
app.post('/webhooks/payment', async (req, res) => {
  const eventId = req.headers['x-event-id'];
  
  // Check if already processed
  const existing = await WebhookEvent.findOne({ eventId });
  if (existing) {
    return res.json({ status: 'already_processed' });
  }
  
  await WebhookEvent.create({ eventId, processedAt: new Date() });
  // ... process event
  res.json({ received: true });
});`
    },
    interviewAnswer: 'Webhooks flip the communication model from pull to push. Instead of my server asking Stripe every 30 seconds "did a payment succeed?", Stripe tells me instantly. The critical things: always verify the webhook signature to prevent spoofing, respond with 200 immediately and process async (Stripe retries if you don\'t respond within 30 seconds), and handle duplicate events since webhooks may be delivered more than once.',
    commonMistakes: [
      'Not verifying webhook signatures (security vulnerability)',
      'Doing heavy processing before responding (webhook times out)',
      'Not handling duplicate event delivery',
      'Using webhook data for security decisions without verification'
    ],
    realWorldUse: 'Stripe payment events, GitHub CI/CD triggers, Slack slash commands, Shopify order notifications, SendGrid email events. Any time you need real-time notification from a third-party service.',
    followUpQuestions: [
      'How do you test webhooks locally?',
      'What is the difference between webhooks and polling?',
      'How do you handle webhook delivery failures?'
    ]
  },
  {
    id: 'rest-content-negotiation',
    category: 'rest-api',
    type: 'theory',
    question: 'What is content negotiation in REST APIs?',
    difficulty: 'intermediate',
    tags: ['rest-api', 'http', 'headers', 'content-type'],
    shortAnswer: 'Content negotiation lets clients and servers agree on the format. The client sends Accept (desired response format) and Content-Type (request body format). The server responds with Content-Type matching what it sent.',
    detailedExplanation: 'Clients declare what they can receive (Accept: application/json, text/xml) and the server picks the best match. If none match, the server returns 406 Not Acceptable. Content-Type declares what the client sent in the request body. This enables one API to serve JSON, XML, and MessagePack without separate endpoints.',
    example: {
      code: `// Client request with content negotiation
GET /api/users/1
Accept: application/json, text/xml;q=0.8

// Server response
Content-Type: application/json
{ "id": 1, "name": "Alice" }

// If server cannot produce the requested format
HTTP/1.1 406 Not Acceptable

// POST with body format declaration
POST /api/users
Content-Type: application/json
Accept: application/json
{ "name": "Bob" }`,
      language: 'http'
    },
    interviewAnswer: 'Distinguish Accept (what client wants back) from Content-Type (what client is sending). The 406 status code is the key failure response.',
    commonMistakes: ['Confusing Accept and Content-Type', 'Returning 400 instead of 406 for unsupported Accept type'],
    realWorldUse: 'APIs that need to support both JSON and XML clients, file upload APIs.',
    followUpQuestions: ['What is the q parameter in Accept headers?', 'What is multipart/form-data used for?']
  },

  {
    id: 'rest-long-polling-sse',
    category: 'rest-api',
    type: 'theory',
    question: 'What are the differences between WebSockets, Server-Sent Events (SSE), and long polling?',
    difficulty: 'intermediate',
    tags: ['rest-api', 'websockets', 'sse', 'real-time'],
    shortAnswer: 'Long polling: client re-requests when response received. SSE: server streams one-way events over HTTP (EventSource API). WebSockets: full-duplex binary TCP connection. SSE is simplest for server-to-client streaming; WebSockets for bidirectional real-time.',
    detailedExplanation: 'Long polling simulates push by keeping the connection open until an event, then responding and repeating. SSE uses a persistent HTTP response with text/event-stream — great for notifications/feeds, works through HTTP/2 multiplexing, and has automatic reconnection. WebSockets upgrade HTTP to a TCP tunnel — lowest latency for games, chat, collaborative editing.',
    example: {
      code: `// SSE — Server side (Express)
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');

  const send = (data) => res.write(\`data: \${JSON.stringify(data)}\n\n\`);

  const interval = setInterval(() => send({ time: Date.now() }), 1000);
  req.on('close', () => clearInterval(interval));
});

// SSE — Client side
const es = new EventSource('/events');
es.onmessage = (e) => console.log(JSON.parse(e.data));

// WebSocket — bidirectional
const ws = new WebSocket('wss://api.example.com/ws');
ws.onmessage = (e) => console.log(e.data);
ws.send(JSON.stringify({ type: 'ping' }));`,
      language: 'javascript'
    },
    interviewAnswer: 'Recommend SSE for server-push (notifications, live feeds) and WebSockets for bidirectional (chat, games). Mention SSE has native reconnection and works over HTTP.',
    commonMistakes: ['Using WebSockets for notification feeds — SSE is simpler and enough', 'Not handling reconnection for WebSockets (SSE handles it natively)'],
    realWorldUse: 'SSE: live dashboards, notifications, stock tickers. WebSockets: chat, multiplayer games, collaborative editors.',
    followUpQuestions: ['How do SSE and WebSockets differ in proxy/firewall support?', 'What is socket.io and why does it exist?']
  },

  {
    id: 'rest-openapi',
    category: 'rest-api',
    type: 'theory',
    question: 'What is OpenAPI (Swagger) and why is API documentation important?',
    difficulty: 'beginner',
    tags: ['rest-api', 'openapi', 'documentation', 'swagger'],
    shortAnswer: 'OpenAPI is a machine-readable specification (YAML/JSON) describing your REST API endpoints, parameters, request/response schemas, and authentication. Tools generate interactive docs (Swagger UI), client SDKs, and server validation from it automatically.',
    detailedExplanation: 'OpenAPI 3.x is the standard. swagger-jsdoc generates the spec from JSDoc annotations in your Express code. swagger-ui-express serves the interactive UI. Contract-first vs code-first: contract-first writes the spec before implementation; code-first generates from existing code. Both are valid; contract-first encourages API design before implementation.',
    example: {
      code: `// Express with swagger-jsdoc
/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: User object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Not found
 */
app.get('/api/users/:id', getUserById);`,
      language: 'javascript'
    },
    interviewAnswer: 'Mention the tooling benefits: auto-generated docs, client SDK generation, mock servers, and contract testing.',
    commonMistakes: ['Writing documentation separately from code — it goes stale', 'Not versioning the OpenAPI spec alongside the code'],
    realWorldUse: 'Any public or internal API consumed by multiple teams, SDK generation for mobile clients.',
    followUpQuestions: ['What is the difference between OpenAPI 2.0 and 3.0?', 'How do you validate requests against an OpenAPI spec?']
  },

  {
    id: 'rest-hypermedia',
    category: 'rest-api',
    type: 'theory',
    question: 'What is REST maturity model (Richardson Maturity Model) and what is Level 3 (HATEOAS)?',
    difficulty: 'intermediate',
    tags: ['rest-api', 'hateoas', 'maturity', 'hypermedia'],
    shortAnswer: 'The Richardson Maturity Model has 4 levels: L0 (HTTP as tunnel), L1 (resources), L2 (HTTP verbs + status codes), L3 (HATEOAS — responses include links to possible next actions). Most real-world APIs are L2. L3 enables client discovery without hardcoded URLs.',
    detailedExplanation: 'HATEOAS (Hypermedia As The Engine Of Application State) means the API response includes links to related actions. A bank account response includes links to deposit, withdraw, or view statements — the client doesn\'t need to know these URLs in advance. This makes APIs self-documenting and decouples client from URL structure, but adds response payload size.',
    example: {
      code: `// L2 API response (typical)
GET /orders/123
{
  "id": 123,
  "status": "pending",
  "total": 49.99
}

// L3 HATEOAS response
GET /orders/123
{
  "id": 123,
  "status": "pending",
  "total": 49.99,
  "_links": {
    "self":   { "href": "/orders/123" },
    "cancel": { "href": "/orders/123/cancel", "method": "DELETE" },
    "pay":    { "href": "/orders/123/payment", "method": "POST" }
  }
}
// Client follows links — doesn't hardcode /orders/123/cancel`,
      language: 'json'
    },
    interviewAnswer: 'Most interviews just want you to name the 4 levels and explain HATEOAS with an example. In practice, note that most APIs stop at L2.',
    commonMistakes: ['Thinking HATEOAS is required for REST — it\'s optional and rarely implemented fully', 'Confusing HATEOAS with API documentation'],
    realWorldUse: 'Payment APIs, e-commerce order workflows, HAL+JSON and JSON:API specifications.',
    followUpQuestions: ['What is HAL (Hypertext Application Language)?', 'Why do most teams stop at RMM Level 2?']
  },

  {
    id: 'rest-bulk-operations',
    category: 'rest-api',
    type: 'theory',
    question: 'How do you design bulk create/update/delete operations in a REST API?',
    difficulty: 'intermediate',
    tags: ['rest-api', 'bulk', 'design', 'performance'],
    shortAnswer: 'Use a dedicated /batch endpoint or accept arrays in the request body. Return 207 Multi-Status with per-item results. Never use DELETE with a body — use POST /resources/bulk-delete with an array of IDs instead.',
    detailedExplanation: 'REST doesn\'t natively support batch, so conventions vary. Common approaches: (1) accept arrays in POST /resources body, (2) POST /resources/batch with an operations array, (3) POST /resources/bulk-delete for deletion. The HTTP 207 Multi-Status response lets you report partial success — some items succeeded, some failed — with individual status codes.',
    example: {
      code: `// Bulk create — POST with array
POST /api/users
[
  { "name": "Alice", "email": "alice@example.com" },
  { "name": "Bob",   "email": "invalid-email" }
]

// 207 Multi-Status response — partial success
HTTP/1.1 207 Multi-Status
[
  { "status": 201, "data": { "id": 1, "name": "Alice" } },
  { "status": 422, "error": "Invalid email format", "input": { "name": "Bob" } }
]

// Bulk delete — POST (not DELETE with body)
POST /api/users/bulk-delete
{ "ids": [1, 2, 3] }

// Alternative: PATCH for partial updates (JSON Patch RFC 6902)
PATCH /api/orders
[
  { "op": "replace", "path": "/1/status", "value": "shipped" },
  { "op": "replace", "path": "/2/status", "value": "cancelled" }
]`,
      language: 'http'
    },
    interviewAnswer: 'Lead with 207 Multi-Status for partial success. Explain why DELETE with body is unreliable (some proxies strip it).',
    commonMistakes: ['Returning 200 for bulk operations where some items failed', 'Using DELETE with a request body (unreliable across proxies)'],
    realWorldUse: 'Bulk email imports, batch order processing, admin operations on large datasets.',
    followUpQuestions: ['What is JSON Patch (RFC 6902)?', 'How does GraphQL handle batch operations differently?']
  },

  {
    id: 'rest-timeout-retry',
    category: 'rest-api',
    type: 'theory',
    question: 'How should clients handle API timeouts and retries safely?',
    difficulty: 'intermediate',
    tags: ['rest-api', 'resilience', 'timeout', 'retry', 'idempotency'],
    shortAnswer: 'Implement exponential backoff with jitter. Only retry idempotent operations (GET, PUT, DELETE) or requests that failed before reaching the server (network error). Never automatically retry non-idempotent POST requests — you may create duplicates.',
    detailedExplanation: 'A timeout means you don\'t know if the request reached the server. Retrying a POST order creation may charge a customer twice. Idempotency keys solve this: include a unique UUID in the request (Idempotency-Key header), and the server returns the same result if the key is seen again. Exponential backoff prevents thundering herd when a server is overloaded.',
    example: {
      code: `// Exponential backoff with jitter
async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(5000), ...options });
      if (res.ok) return res;
      if (res.status < 500) throw new Error('Client error — no retry');
    } catch (err) {
      if (attempt === maxRetries) throw err;
      // Exponential backoff + random jitter
      const delay = Math.min(1000 * 2 ** attempt + Math.random() * 1000, 30000);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

// Idempotency key for safe POST retry
const idempotencyKey = crypto.randomUUID();
fetch('/api/payments', {
  method: 'POST',
  headers: { 'Idempotency-Key': idempotencyKey },
  body: JSON.stringify({ amount: 50 })
});
// If retried with same key, server returns original response — no double charge`,
      language: 'javascript'
    },
    interviewAnswer: 'The critical point: only auto-retry idempotent operations. For non-idempotent POST, use idempotency keys. Exponential backoff prevents overloading a struggling server.',
    commonMistakes: ['Retrying POST requests without idempotency keys', 'Not adding jitter — all retrying clients back off to the same moment (thundering herd)'],
    realWorldUse: 'Payment processing, order creation, any mutation that must not be duplicated.',
    followUpQuestions: ['What is the circuit breaker pattern?', 'How does Stripe implement idempotency keys?']
  },

  {
    id: 'rest-filtering-sorting',
    category: 'rest-api',
    type: 'theory',
    question: 'What are the conventions for filtering, sorting, and field selection in REST APIs?',
    difficulty: 'beginner',
    tags: ['rest-api', 'query-params', 'filtering', 'sorting'],
    shortAnswer: 'Filtering: query params (?status=active&role=admin). Sorting: ?sort=name&order=asc or ?sort=-name (minus = desc). Pagination: ?page=2&limit=20 or cursor-based ?after=cursor. Field selection: ?fields=id,name,email.',
    detailedExplanation: 'These conventions aren\'t standardised (unlike GraphQL\'s selection set), but widely adopted patterns exist. Field selection (sparse fieldsets) reduces payload size significantly for mobile. Compound sorts: ?sort=status,-createdAt (sort by status asc, then createdAt desc). Cursor-based pagination is more reliable than offset for frequently changing datasets.',
    example: {
      code: `// Filtering
GET /api/products?category=electronics&inStock=true&minPrice=100&maxPrice=500

// Sorting (minus prefix = descending)
GET /api/products?sort=-createdAt,name

// Field selection (sparse fieldsets)
GET /api/users?fields=id,email,name

// Offset pagination
GET /api/products?page=3&limit=20

// Cursor pagination (better for feeds)
GET /api/posts?after=eyJpZCI6MTAwfQ==&limit=20
// Response includes nextCursor for the next page
{
  "data": [...],
  "pagination": { "nextCursor": "eyJpZCI6MTIwfQ==" }
}`,
      language: 'http'
    },
    interviewAnswer: 'Describe the conventions and explain when to use cursor vs offset pagination — cursor is better for live feeds where rows are inserted.',
    commonMistakes: ['Using POST for filtering to hide params in body — breaks cacheability and bookmarkability', 'Returning all fields by default for large objects — impacts mobile performance'],
    realWorldUse: 'Product catalogs, user lists, any paginated resource API.',
    followUpQuestions: ['Why is cursor pagination better for real-time feeds?', 'What is the Link header for pagination (RFC 5988)?']
  },

  {
    id: 'rest-api-key-vs-jwt',
    category: 'rest-api',
    type: 'theory',
    question: 'When should you use API keys vs JWT tokens for authentication?',
    difficulty: 'intermediate',
    tags: ['rest-api', 'auth', 'api-keys', 'jwt', 'security'],
    shortAnswer: 'API keys: for server-to-server (M2M) communication, long-lived, no user context. JWTs: for user-authenticated requests, short-lived, carry user claims. Use API keys for developer/third-party integrations; use JWTs for user sessions.',
    detailedExplanation: 'API keys are opaque strings. The server must look them up in a database to validate and find the associated application. JWTs are self-contained — the server can verify and decode claims without a DB lookup. JWTs expire; API keys are typically long-lived with manual rotation. API keys suit CI pipelines, webhooks, and partner integrations. JWTs suit interactive user sessions.',
    example: {
      code: `// API key — server-to-server
GET /api/v1/metrics
Authorization: Bearer sk_live_abc123xyz

// Server validates:
const apiKey = await db.apiKeys.findOne({ key: hashedKey });
if (!apiKey) return res.status(401).end();

// JWT — user session
GET /api/v1/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Server validates without DB lookup:
const { userId, role } = jwt.verify(token, JWT_SECRET);
// Claims are in the token itself

// Best practice: scope API keys
// sk_read_xyz — read-only key
// sk_write_xyz — write access
// sk_admin_xyz — admin access`,
      language: 'javascript'
    },
    interviewAnswer: 'Two axes: M2M vs user sessions, and long-lived vs short-lived. Then connect to the DB-lookup (API key) vs stateless (JWT) validation difference.',
    commonMistakes: ['Storing unhashed API keys in the database — hash them like passwords', 'Using JWTs for M2M without expiry controls — prefer API keys with scopes'],
    realWorldUse: 'Stripe/Twilio use API keys for integrations. Auth0/Cognito use JWTs for user sessions. Most APIs need both.',
    followUpQuestions: ['How do you rotate API keys safely without downtime?', 'What is OAuth 2.0 client credentials flow?']
  },

  {
    id: 'rest-versioning-strategies',
    category: 'rest-api',
    type: 'theory',
    question: 'What are the main REST API versioning strategies and what are the tradeoffs of each?',
    difficulty: 'intermediate',
    tags: ['rest-api', 'versioning', 'design', 'breaking-changes'],
    shortAnswer: 'Three main strategies: URL versioning (/v1/users — most common, easy to test), header versioning (API-Version: 2024-01-01), and content-type versioning (Accept: application/vnd.myapp.v2+json). URL versioning is the most visible and cacheable; header versioning is cleaner but harder to test in a browser.',
    detailedExplanation: 'URL versioning is used by Stripe, Twilio, GitHub. It\'s visible in every request, easy to route, and works naturally with URL-based caching. Header versioning (Stripe also does date-based) is less visible but keeps URLs clean. Avoid requiring versioning for non-breaking changes; define what "breaking" means (removing fields, changing types, removing endpoints).',
    example: {
      code: `// URL versioning (most common)
/api/v1/users
/api/v2/users  // breaking change — different response shape

// Header versioning
GET /api/users
API-Version: 2024-06-01
// or
Accept: application/vnd.myapi.v2+json

// Stripe-style date versioning
GET /v1/charges
Stripe-Version: 2023-10-16

// Express routing by version
const v1 = express.Router();
const v2 = express.Router();
app.use('/api/v1', v1);
app.use('/api/v2', v2);

// Non-breaking changes never need a version bump:
// Adding new optional fields ✅
// Adding new endpoints ✅
// Deprecating (not removing) a field ✅`,
      language: 'javascript'
    },
    interviewAnswer: 'Recommend URL versioning for public APIs for its testability and explicitness. State what constitutes a breaking change vs a non-breaking change.',
    commonMistakes: ['Versioning for every small change — only breaking changes need new versions', 'Not providing a deprecation window before removing old versions'],
    realWorldUse: 'Any public or partner-facing API. GitHub, Stripe, Twilio all use URL versioning.',
    followUpQuestions: ['How long should you support deprecated API versions?', 'What is API deprecation and how do you communicate it?']
  },

  {
    id: 'rest-circuit-breaker',
    category: 'rest-api',
    type: 'theory',
    question: 'What is the Circuit Breaker pattern and how does it improve API resilience?',
    difficulty: 'advanced',
    tags: ['circuit-breaker', 'resilience', 'microservices', 'patterns'],
    shortAnswer: 'Circuit Breaker prevents cascading failures by stopping calls to a failing service after a threshold. Three states: Closed (normal), Open (failing — reject immediately), Half-Open (test recovery). Protects the caller from waiting for timeouts.',
    detailedExplanation: 'In microservices, one slow or failing service can cascade — all callers pile up waiting for responses, exhausting thread pools/connection pools across the system. Circuit Breaker monitors failure rate. After N failures, it "opens" — subsequent calls fail fast without hitting the broken service. After a timeout, it tries one request (half-open). If it succeeds, it closes. Opossum is a popular Node.js implementation.',
    example: {
      code: `import CircuitBreaker from 'opossum';

// Wrap the potentially failing function
async function callPaymentService(data: PaymentData) {
  const response = await fetch('http://payment-service/charge', {
    method: 'POST',
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(3000),
  });
  if (!response.ok) throw new Error(\`Payment failed: \${response.status}\`);
  return response.json();
}

// Circuit breaker configuration
const breaker = new CircuitBreaker(callPaymentService, {
  timeout: 3000,           // Call fails after 3s
  errorThresholdPercentage: 50, // Open after 50% failure rate
  resetTimeout: 30000,     // Try again after 30s (half-open)
  volumeThreshold: 10,     // Min 10 requests before evaluating
});

// Fallback when circuit is open
breaker.fallback((data) => ({
  status: 'queued',
  message: 'Payment service temporarily unavailable. Your payment is queued.',
}));

// Events for monitoring
breaker.on('open', () => logger.warn('Payment circuit opened'));
breaker.on('halfOpen', () => logger.info('Payment circuit half-open — testing'));
breaker.on('close', () => logger.info('Payment circuit closed — service recovered'));
breaker.on('fallback', (result) => logger.warn({ result }, 'Circuit fallback triggered'));

// Use in route handler
app.post('/api/orders', async (req, res) => {
  try {
    const payment = await breaker.fire(req.body.payment);
    res.status(201).json({ order: createdOrder, payment });
  } catch (err) {
    // Circuit open or fallback returned
    res.status(503).json({ error: 'Service temporarily unavailable' });
  }
});

// States diagram:
// Closed → [failure threshold crossed] → Open
// Open → [reset timeout] → Half-Open
// Half-Open → [success] → Closed
// Half-Open → [failure] → Open`,
      language: 'typescript',
    },
    interviewAnswer: 'Circuit Breaker is essential when your service depends on external APIs. Without it, a slow payment service makes all order endpoints slow — every caller waits for the timeout. With Circuit Breaker, after enough failures the circuit opens and calls fail immediately with a fallback response. This keeps your service responsive and gives the failing service time to recover. I always pair it with a meaningful fallback — queue the request for retry, show cached data, or return a degraded response.',
    commonMistakes: [
      'No fallback — circuit open means complete failure',
      'Setting thresholds too low (transient errors open the circuit)',
      'Not monitoring circuit state changes',
    ],
    realWorldUse: 'Payment integrations, third-party APIs, microservice calls. Netflix Hystrix popularised the pattern. Opossum for Node.js.',
    followUpQuestions: ['What is the difference between Circuit Breaker and Retry?', 'What is bulkhead pattern?'],
  },

  {
    id: 'rest-api-testing-tools',
    category: 'rest-api',
    type: 'theory',
    question: 'What tools do you use for API testing and documentation?',
    difficulty: 'beginner',
    tags: ['api-testing', 'postman', 'swagger', 'insomnia'],
    shortAnswer: 'Postman/Insomnia for manual and automated API testing. Swagger UI (OpenAPI) for interactive docs. Bruno for git-friendly collections. Hoppscotch as open-source alternative. k6/Artillery for load testing.',
    detailedExplanation: 'API testing categories: manual exploration (Postman, Insomnia, Hoppscotch), automated test suites (Postman Collections, Newman, REST-assured), contract testing (Pact), load testing (k6, Artillery, Apache JMeter), documentation (Swagger UI, Redoc, Stoplight). API mocking: Mockoon, Prism, json-server for frontend development before backend is ready.',
    example: {
      code: `// Postman collection runner with Newman (CLI)
// newman run collection.json -e production.env.json

// k6 load test
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },   // Ramp up to 20 users
    { duration: '1m', target: 20 },    // Stay at 20 users
    { duration: '30s', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% under 500ms
    http_req_failed: ['rate<0.01'],    // Error rate < 1%
  },
};

export default function () {
  const res = http.post(
    'https://api.example.com/auth/login',
    JSON.stringify({ email: 'test@example.com', password: 'password' }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  check(res, {
    'status is 200': (r) => r.status === 200,
    'has token': (r) => JSON.parse(r.body).token !== undefined,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });

  sleep(1); // Think time between requests
}

// API mocking with json-server (for frontend dev)
// db.json
{
  "users": [
    { "id": 1, "name": "Alex", "email": "alex@example.com" }
  ],
  "posts": [
    { "id": 1, "title": "Hello", "userId": 1 }
  ]
}
// npx json-server db.json --port 3001
// GET /users, POST /users, GET /users/1, etc. — all work automatically

// Prism — mock server from OpenAPI spec
// npx @stoplight/prism-cli mock openapi.yaml
// Returns example responses from your spec

// Contract testing with Pact (consumer-driven)
// Frontend defines what it expects from the API
// Backend verifies it meets those expectations`,
      language: 'javascript',
    },
    interviewAnswer: 'My workflow: Postman for exploring and manual testing during development, Swagger UI for team collaboration and self-documentation, k6 for load testing before launching new endpoints. I commit Postman collections to the repo so the whole team uses the same requests. For frontend developers, I set up a json-server mock so they can work independently before the real API is ready.',
    commonMistakes: [
      'Only doing manual testing (no automated regression)',
      'Not load testing before production launch',
      'Sharing Postman collections with hardcoded production credentials',
    ],
    realWorldUse: 'Every API project. Postman is industry standard. k6 for CI/CD performance gates.',
    followUpQuestions: ['What is contract testing?', 'How do you add API tests to a CI/CD pipeline?'],
  },

  {
    id: 'rest-api-monitoring',
    category: 'rest-api',
    type: 'theory',
    question: 'How do you monitor a REST API in production?',
    difficulty: 'intermediate',
    tags: ['monitoring', 'observability', 'metrics', 'alerting'],
    shortAnswer: 'Monitor the three pillars: Metrics (request rate, error rate, latency p50/p95/p99), Logs (structured JSON with correlation IDs), Traces (distributed request tracing). Alert on error rate >1%, p99 latency >1s, uptime <99.9%.',
    detailedExplanation: 'Observability has three pillars. Metrics: RED method (Rate, Errors, Duration) — count requests, count errors, measure latency percentiles. Logs: structured JSON with requestId, correlated across services. Traces: distributed tracing shows the path of a request through microservices. Tools: Prometheus + Grafana (open source), Datadog, New Relic (commercial), CloudWatch (AWS). Alerting: PagerDuty, Opsgenie, Slack.',
    example: {
      code: `// Prometheus metrics with prom-client
import { Registry, Counter, Histogram, Gauge } from 'prom-client';

const register = new Registry();

// Request counter
const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

// Request duration histogram (for p50/p95/p99)
const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
});

// Active connections gauge
const activeConnections = new Gauge({
  name: 'http_active_connections',
  help: 'Number of active HTTP connections',
  registers: [register],
});

// Middleware to record metrics
app.use((req, res, next) => {
  const start = Date.now();
  activeConnections.inc();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route?.path ?? req.path; // Normalised route

    httpRequestsTotal.labels(req.method, route, String(res.statusCode)).inc();
    httpRequestDuration.labels(req.method, route, String(res.statusCode)).observe(duration);
    activeConnections.dec();
  });

  next();
});

// Expose metrics endpoint (scraped by Prometheus)
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.send(await register.metrics());
});

// Health check with dependency status
app.get('/health', async (req, res) => {
  const checks = await Promise.allSettled([
    prisma.$queryRaw\`SELECT 1\`,
    redis.ping(),
  ]);

  const [db, cache] = checks;
  const healthy = checks.every(c => c.status === 'fulfilled');

  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'healthy' : 'degraded',
    version: process.env.APP_VERSION,
    uptime: process.uptime(),
    dependencies: {
      database: db.status === 'fulfilled' ? 'up' : 'down',
      cache: cache.status === 'fulfilled' ? 'up' : 'down',
    },
  });
});

// Alert thresholds (in Grafana/Datadog):
// - Error rate > 1% for 5 minutes → Page on-call
// - p99 latency > 2s for 5 minutes → Alert team
// - Health check fails → Immediate page`,
      language: 'typescript',
    },
    interviewAnswer: 'Production monitoring is about knowing before users complain. I instrument every service with the RED metrics — request Rate, Error rate, Duration. Prometheus + Grafana is my open-source stack, Datadog for managed. The health check endpoint is critical for load balancers and Kubernetes readiness probes. I set alerts on error rate and p99 latency — not p50 because that hides the worst 1% of user experience.',
    commonMistakes: [
      'Monitoring only the average latency (hides tail latency)',
      'No alerting — you find out from users',
      'Health check that only returns 200 without checking dependencies',
    ],
    realWorldUse: 'Every production service. Kubernetes uses health checks for pod management. SRE teams maintain SLOs based on these metrics.',
    followUpQuestions: ['What is an SLO and SLA?', 'What is distributed tracing?'],
  },

  {
    id: 'rest-microservices-patterns',
    category: 'rest-api',
    type: 'theory',
    question: 'What API patterns are used in microservices architectures?',
    difficulty: 'advanced',
    tags: ['microservices', 'api-gateway', 'bff', 'service-mesh'],
    shortAnswer: 'Key patterns: API Gateway (single entry point, auth/routing), BFF (Backend for Frontend — tailored per client), Service Mesh (inter-service communication, Istio/Linkerd), Event-Driven (async via message queues), Saga (distributed transactions).',
    detailedExplanation: 'API Gateway centralises cross-cutting concerns (auth, rate limiting, routing). BFF creates specialised APIs per client type (mobile vs web need different data shapes). Service Mesh handles service-to-service communication concerns (retries, circuit breaking, mTLS) as infrastructure — no code changes needed. Event-driven decouples services via async messaging. Saga coordinates multi-step distributed transactions.',
    example: {
      code: `// API Gateway pattern (Kong/Express Gateway/custom)
// Single entry point — routes to backend services

// BFF (Backend for Frontend) pattern
// Mobile needs compressed data, fewer fields
app.get('/mobile/dashboard', authenticate, async (req, res) => {
  // Aggregate multiple service calls into mobile-optimized response
  const [user, summary, notifications] = await Promise.all([
    userService.getProfile(req.userId),
    orderService.getSummary(req.userId, { compact: true }),
    notificationService.getUnreadCount(req.userId),
  ]);

  // Return only what mobile app needs
  res.json({
    name: user.name,
    avatar: user.avatarUrl,
    orderCount: summary.count,
    totalSpent: summary.total,
    unreadNotifications: notifications.count,
  });
});

// Web BFF — more detailed
app.get('/web/dashboard', authenticate, async (req, res) => {
  const [user, recentOrders, analytics, recommendations] = await Promise.all([
    userService.getFullProfile(req.userId),
    orderService.getRecent(req.userId, { limit: 5 }),
    analyticsService.getUserStats(req.userId),
    recommendationService.get(req.userId),
  ]);
  res.json({ user, recentOrders, analytics, recommendations });
});

// Saga pattern — distributed transaction via events
// Order creation across multiple services
class OrderSaga {
  async execute(orderData: OrderData) {
    const steps = [
      { execute: () => inventoryService.reserve(orderData.items),
        compensate: () => inventoryService.release(orderData.items) },
      { execute: () => paymentService.charge(orderData.payment),
        compensate: () => paymentService.refund(orderData.payment) },
      { execute: () => shippingService.schedule(orderData.address),
        compensate: () => shippingService.cancel() },
    ];

    const completed: number[] = [];
    for (const [i, step] of steps.entries()) {
      try {
        await step.execute();
        completed.push(i);
      } catch (err) {
        // Rollback completed steps in reverse
        for (const j of completed.reverse()) {
          await steps[j].compensate();
        }
        throw new Error(\`Saga failed at step \${i}: \${err.message}\`);
      }
    }
  }
}`,
      language: 'typescript',
    },
    interviewAnswer: 'In microservices, API Gateway is almost always the starting point — one URL for all clients, centralised auth. BFF is the next step when mobile and web need significantly different data. The Saga pattern solves the distributed transaction problem — when an order requires inventory reservation, payment, and shipping across three services, each step has a compensating action if a later step fails. This replaces the ACID transaction you\'d have in a monolith.',
    commonMistakes: [
      'Making the API Gateway too fat — it should route, not do business logic',
      'Skipping BFF and trying to satisfy all clients with one API',
      'Not implementing compensating transactions in Saga (partial success)',
    ],
    realWorldUse: 'Netflix, Amazon, Uber all use these patterns at scale.',
    followUpQuestions: ['What is the difference between Choreography and Orchestration in Saga?', 'What is a Service Mesh?'],
  },

  {
    id: 'rest-graphql-rest-comparison',
    category: 'rest-api',
    type: 'theory',
    question: 'When should you choose GraphQL over REST, and what are the tradeoffs?',
    difficulty: 'intermediate',
    tags: ['graphql', 'rest', 'comparison', 'api-design'],
    shortAnswer: 'Choose GraphQL when: multiple clients need different data shapes, you have complex relationships, or you want a self-documenting schema. Choose REST when: simple CRUD, HTTP caching is important, public API, or team is unfamiliar with GraphQL.',
    detailedExplanation: 'GraphQL advantages: single request for complex nested data, no over-fetching (request only needed fields), strongly typed schema serves as documentation, introspection enables tooling. REST advantages: simpler mental model, excellent HTTP caching, standard HTTP status codes, easier to understand for external consumers, no N+1 complexity. Consider tRPC for internal TypeScript APIs — type-safe RPC without schema overhead.',
    example: {
      code: `// REST approach — multiple requests or over-fetching
// Request 1: GET /users/1
// { id: 1, name: "Alex", email: "...", createdAt: "...", ...20 other fields }

// Request 2: GET /users/1/orders  
// [{ id: 1, total: 99, items: [...], ...15 fields }, ...]

// Request 3: GET /products/5 (for each order item)
// Total: 1 + 1 + N product requests = N+2 requests

// GraphQL — one request, exactly what's needed
query {
  user(id: "1") {
    name                    # Just the name
    orders(limit: 5) {
      total
      status
      items {
        product {
          name
          price
        }
        quantity
      }
    }
  }
}

// tRPC — for TypeScript full-stack (no schema, auto-typed)
// server
const appRouter = router({
  getUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return prisma.user.findUnique({ where: { id: input.id } });
    }),
  createUser: protectedProcedure
    .input(z.object({ name: z.string(), email: z.string().email() }))
    .mutation(async ({ input, ctx }) => {
      return prisma.user.create({ data: input });
    }),
});

// client — fully type-safe, no code generation needed
const user = await trpc.getUser.query({ id: '1' }); // inferred types!

// Decision matrix:
// Public API → REST (familiar, good tooling for consumers)
// Mobile app → GraphQL (different data needs per screen)
// Internal TypeScript → tRPC (simplest, fully type-safe)
// Simple CRUD → REST
// Complex graph data → GraphQL`,
      language: 'graphql',
    },
    interviewAnswer: 'I choose REST for public APIs — developers everywhere know it, HTTP caching works well, Swagger documents it clearly. GraphQL when I have multiple clients that need significantly different data shapes, or complex nested data that requires many REST requests. For TypeScript internal APIs, tRPC is often the best choice — no schema overhead, automatic type safety between client and server. The worst outcome is GraphQL for a simple CRUD app where REST would be simpler.',
    commonMistakes: [
      'Using GraphQL everywhere, even for simple CRUD',
      'Ignoring N+1 problem in GraphQL resolvers (need DataLoader)',
      'Thinking REST and GraphQL are mutually exclusive',
    ],
    realWorldUse: 'GitHub offers both REST and GraphQL APIs. Shopify uses GraphQL heavily. Internal TypeScript monorepos increasingly use tRPC.',
    followUpQuestions: ['What is tRPC?', 'How does GraphQL handle authentication?'],
  },

  {
    id: 'rest-api-mocking',
    category: 'rest-api',
    type: 'theory',
    question: 'What is API mocking and how does Mock Service Worker (MSW) work?',
    difficulty: 'intermediate',
    tags: ['mocking', 'msw', 'testing', 'development'],
    shortAnswer: 'API mocking intercepts network requests and returns predefined responses. MSW uses a Service Worker to intercept requests at the network level — works in both browser and Node.js. Enables frontend development before backend is ready and reliable API tests.',
    detailedExplanation: 'MSW (Mock Service Worker) intercepts fetch/XMLHttpRequest at the network level via a service worker in browsers, or via node-fetch interceptor in Node. Unlike axios-mock-adapter or jest.mock(), MSW doesn\'t require changing your application code — it truly intercepts at the network level. Handlers define which requests to intercept and what to return. Same handlers work in development and tests.',
    example: {
      code: `// mocks/handlers.ts
import { http, HttpResponse, delay } from 'msw';

export const handlers = [
  // GET handler
  http.get('/api/users', async ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') ?? '1';

    await delay(100); // Simulate network latency

    return HttpResponse.json({
      data: [
        { id: '1', name: 'Alex', email: 'alex@example.com' },
        { id: '2', name: 'Sam', email: 'sam@example.com' },
      ],
      pagination: { page: parseInt(page), total: 2 },
    });
  }),

  // POST handler
  http.post('/api/users', async ({ request }) => {
    const body = await request.json();

    if (!body.email?.includes('@')) {
      return HttpResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid email' } },
        { status: 422 }
      );
    }

    return HttpResponse.json(
      { id: '3', ...body, createdAt: new Date().toISOString() },
      { status: 201 }
    );
  }),

  // Error scenario
  http.delete('/api/users/:id', ({ params }) => {
    if (params.id === 'protected') {
      return HttpResponse.json({ error: 'Cannot delete protected user' }, { status: 403 });
    }
    return new HttpResponse(null, { status: 204 });
  }),
];

// mocks/browser.ts — browser setup
import { setupWorker } from 'msw/browser';
export const worker = setupWorker(...handlers);

// mocks/node.ts — Node.js/test setup  
import { setupServer } from 'msw/node';
export const server = setupServer(...handlers);

// src/main.tsx — start in development
if (process.env.NODE_ENV === 'development') {
  const { worker } = await import('./mocks/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
}

// Jest setup — tests use the same handlers
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Override handlers per test
it('handles server error', async () => {
  server.use(
    http.get('/api/users', () => HttpResponse.json({ error: 'Server Error' }, { status: 500 }))
  );
  // Test component handles error state
});`,
      language: 'typescript',
    },
    interviewAnswer: 'MSW is a game-changer for testing and frontend development. The key advantage over jest.mock() is that it intercepts at the network level — your application code doesn\'t change at all. The same handlers work in the browser during development and in Jest tests, so you\'re testing realistic request/response flows. I use it so the frontend team can work independently from the backend team during parallel development.',
    commonMistakes: [
      'Mocking at the axios/fetch level instead of network level',
      'Not resetting handlers between tests (test pollution)',
      'Mocking away all network calls — some integration paths should test real responses',
    ],
    realWorldUse: 'Component testing in React Testing Library, Storybook stories, frontend development in parallel with backend.',
    followUpQuestions: ['How does MSW differ from axios-mock-adapter?', 'What is the difference between setupWorker and setupServer?'],
  },

  {
    id: 'rest-api-security-checklist',
    category: 'rest-api',
    type: 'theory',
    question: 'What is the REST API security checklist every developer should know?',
    difficulty: 'intermediate',
    tags: ['security', 'api-design', 'best-practices', 'owasp'],
    shortAnswer: 'Key checks: HTTPS only, JWT in httpOnly cookie, rate limiting per endpoint, input validation, no sensitive data in URLs, proper CORS, return minimal data, no stack traces in errors, audit dependency vulnerabilities.',
    detailedExplanation: 'OWASP API Security Top 10: Broken Object Level Authorisation (BOLA/IDOR), Broken Auth, Broken Object Property Level Auth (mass assignment), Unrestricted Resource Consumption, Broken Function Level Auth, Unrestricted Access to Sensitive Business Flows, Server Side Request Forgery, Security Misconfiguration, Improper Inventory Management, Unsafe Consumption of APIs.',
    example: {
      code: `// Security checklist implementation

// 1. BOLA/IDOR — always check ownership
// ❌ Anyone can view any user's orders
app.get('/api/orders/:id', authenticate, async (req, res) => {
  const order = await Order.findById(req.params.id);
  res.json(order);
});

// ✅ Check ownership
app.get('/api/orders/:id', authenticate, async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    userId: req.user.id, // Must belong to this user
  });
  if (!order) return res.status(404).json({ error: 'Not found' });
  res.json(order);
});

// 2. Mass assignment — don't spread req.body directly
// ❌ User can set themselves as admin
app.patch('/api/users/:id', authenticate, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, req.body); // Dangerous!
});

// ✅ Whitelist allowed fields
app.patch('/api/users/:id', authenticate, async (req, res) => {
  const { name, email, bio } = req.body; // Only allow these fields
  await User.findByIdAndUpdate(req.params.id, { name, email, bio });
});

// 3. Sensitive data in URLs — never put tokens in URLs
// ❌ Token in URL (appears in logs, browser history, referer header)
// GET /api/users?token=abc123
// GET /api/reset-password/eyJhbGciOiJIUzI1NiJ9...

// ✅ Token in Authorization header or body
app.post('/api/reset-password', async (req, res) => {
  const { token, newPassword } = req.body; // Token in body
});

// 4. Return minimal data — don't expose internal fields
// ❌ Returns passwordHash, internalNotes, etc.
app.get('/api/users/:id', async (req, res) => {
  res.json(await User.findById(req.params.id));
});

// ✅ Select only public fields
app.get('/api/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select('name email avatar bio');
  res.json(user);
});

// 5. Function level authorisation — not just object level
app.delete('/api/users/:id', authenticate, authorize('admin'), deleteUser);
app.get('/api/admin/metrics', authenticate, authorize('admin'), getMetrics);`,
      language: 'typescript',
    },
    interviewAnswer: 'BOLA (Broken Object Level Authorisation) is the #1 API vulnerability — it\'s so easy to miss. Always query with both the ID and the current user\'s ID. Mass assignment is also common — never spread req.body directly into a database update. I use a whitelist of allowed fields. For any sensitive operation I check both authentication (who are you?) and authorisation (are you allowed?).',
    commonMistakes: [
      'BOLA — querying only by ID without checking ownership',
      'Mass assignment — trusting all fields from req.body',
      'Exposing internal database fields in responses',
    ],
    realWorldUse: 'Every API. OWASP API Security Top 10 is the definitive reference.',
    followUpQuestions: ['What is BOLA/IDOR?', 'What is the difference between function-level and object-level authorisation?'],
  },

  {
    id: 'rest-api-versioning-deprecation',
    category: 'rest-api',
    type: 'theory',
    question: 'How do you deprecate an old API version and communicate the change to consumers?',
    difficulty: 'intermediate',
    tags: ['versioning', 'deprecation', 'api-lifecycle', 'communication'],
    shortAnswer: 'Add Deprecation and Sunset HTTP headers to deprecated endpoints. Communicate via email/changelog with specific sunset date. Provide migration guide. Maintain at least 6 months between deprecation announcement and shutdown.',
    detailedExplanation: 'API deprecation process: announce deprecation with a specific sunset date, add standard HTTP headers (Deprecation, Sunset, Link to docs), log which clients still call deprecated endpoints, send reminder emails as sunset date approaches, keep old version in maintenance mode (security fixes only), shut down on sunset date. RFC 8594 defines the Sunset header standard.',
    example: {
      code: `// Deprecation middleware
import { addMonths } from 'date-fns';

function deprecate(sunsetDate: Date, migrationUrl: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    // RFC 8594 Sunset header
    res.set('Sunset', sunsetDate.toUTCString());
    // RFC 8594 Deprecation header
    res.set('Deprecation', new Date().toUTCString());
    // Link to migration guide
    res.set('Link', \`<\${migrationUrl}>; rel="successor-version"\`);

    // Log which consumers still use deprecated API
    logger.warn({
      deprecatedEndpoint: req.path,
      consumer: req.headers['x-client-id'] ?? req.headers['user-agent'],
      sunsetDate: sunsetDate.toISOString(),
    }, 'Deprecated API called');

    next();
  };
}

// Apply to v1 routes
const sunset = new Date('2025-06-01');
const migrationUrl = 'https://docs.api.example.com/migration/v1-to-v2';

app.use('/api/v1', deprecate(sunset, migrationUrl), v1Router);

// Example deprecation response headers:
// Deprecation: Wed, 01 Jan 2025 00:00:00 GMT
// Sunset: Sun, 01 Jun 2025 00:00:00 GMT
// Link: <https://docs.api.example.com/migration>; rel="successor-version"

// Track which clients still use v1
const deprecatedCallsByClient = new Counter({
  name: 'api_deprecated_calls_total',
  help: 'Calls to deprecated API endpoints',
  labelNames: ['endpoint', 'client_id'],
});

// Migration guide in response body for critical deprecations
app.get('/api/v1/users', deprecate(sunset, migrationUrl), (req, res) => {
  const data = await getUsersV1();
  res.json({
    data,
    _deprecationWarning: {
      message: 'This endpoint is deprecated and will be removed on 2025-06-01',
      migrationGuide: migrationUrl,
      v2Endpoint: 'GET /api/v2/users',
    },
  });
});`,
      language: 'typescript',
    },
    interviewAnswer: 'Good API deprecation respects your consumers\' release cycles. I set the Sunset header from day one of the deprecation announcement so any tooling that reads it can alert developers. The minimum window I use is 6 months. I log every deprecated API call with the client identifier so I can proactively reach out to teams that haven\'t migrated. Never shut down an API without warning — I\'ve seen it break integrations that took weeks to fix.',
    commonMistakes: [
      'Deprecating with no notice period',
      'Not tracking which clients still use old versions',
      'No migration guide — just "use v2 instead"',
    ],
    realWorldUse: 'Any public or partner-facing API. Stripe keeps API versions for years. GitHub gives 12+ months notice.',
    followUpQuestions: ['What is the Sunset HTTP header?', 'How do you handle emergency breaking changes?'],
  },

  {
    id: 'rest-api-design-patterns',
    category: 'rest-api',
    type: 'theory',
    question: 'What are common REST API response design patterns for collections and nested resources?',
    difficulty: 'intermediate',
    tags: ['api-design', 'response-format', 'json:api', 'envelope'],
    shortAnswer: 'Common patterns: envelope (wrap data in {data: [], meta: {}}), JSON:API spec, sparse fieldsets (?fields=id,name), compound documents (include related resources), and consistent error format across all endpoints.',
    detailedExplanation: 'API response consistency is critical for client integration. Envelope pattern wraps responses in a consistent structure. JSON:API is a full specification for API responses with relationships, pagination, and error format. Sparse fieldsets reduce payload size. Compound documents include related resources to avoid N+1 on the client. Always include pagination metadata for collections. Standardise dates as ISO 8601.',
    example: {
      code: `// Envelope pattern — consistent response structure
interface ApiResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
  links?: {
    self?: string;
    next?: string;
    prev?: string;
    first?: string;
    last?: string;
  };
}

interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
    requestId?: string;
  };
}

// Helper to build consistent responses
function successResponse<T>(data: T, meta?: object): ApiResponse<T> {
  return { data, ...(meta && { meta }) };
}

function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  baseUrl: string
): ApiResponse<T[]> {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    meta: { total, page, limit, totalPages },
    links: {
      self: \`\${baseUrl}?page=\${page}&limit=\${limit}\`,
      first: \`\${baseUrl}?page=1&limit=\${limit}\`,
      last: \`\${baseUrl}?page=\${totalPages}&limit=\${limit}\`,
      ...(page > 1 && { prev: \`\${baseUrl}?page=\${page - 1}&limit=\${limit}\` }),
      ...(page < totalPages && { next: \`\${baseUrl}?page=\${page + 1}&limit=\${limit}\` }),
    },
  };
}

// Usage
app.get('/api/users', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count(),
  ]);

  res.json(paginatedResponse(users, total, page, limit, '/api/users'));
});

// Sparse fieldsets
// GET /api/users?fields=id,name,email
app.get('/api/users/:id', async (req, res) => {
  const fields = (req.query.fields as string)?.split(',');
  const select = fields
    ? Object.fromEntries(fields.map(f => [f, true]))
    : undefined;

  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    select,
  });

  res.json(successResponse(user));
});`,
      language: 'typescript',
    },
    interviewAnswer: 'Consistency is what makes an API a pleasure to use. I always wrap collections in an envelope with pagination metadata — never return a bare array, it prevents adding metadata later. The links object implements HATEOAS-lite, showing clients how to navigate pages. Sparse fieldsets are worth implementing for mobile clients that need to minimise payload size. I standardise on ISO 8601 for all dates and camelCase for all field names.',
    commonMistakes: [
      'Returning bare arrays (can\'t add metadata later without breaking changes)',
      'Inconsistent date formats across endpoints',
      'Different pagination patterns per endpoint',
    ],
    realWorldUse: 'GitHub, Stripe, Shopify all have consistent envelope patterns. JSON:API spec is used by many enterprise APIs.',
    followUpQuestions: ['What is JSON:API?', 'What is the problem with returning bare arrays from collection endpoints?'],
  },

  {
    id: 'rest-async-api',
    category: 'rest-api',
    type: 'theory',
    question: 'How do you design a REST API for long-running asynchronous operations?',
    difficulty: 'advanced',
    tags: ['async', 'long-running', 'polling', 'webhooks', 'job-queue'],
    shortAnswer: 'Pattern: POST creates job and returns 202 Accepted with a job ID. GET /jobs/:id polls for status. When done, return result URL or send webhook. Avoids HTTP timeouts for operations taking > 30 seconds.',
    detailedExplanation: 'Long operations (video transcoding, PDF generation, ML inference) can\'t complete within a single HTTP request timeout. The async pattern: accept the request, create a job, return 202 Accepted with job ID and polling URL. Client polls for status (or use webhooks for push). Location header points to the resource when complete. This is the standard approach for operations taking more than a few seconds.',
    example: {
      code: `// Async job pattern
interface Job {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress?: number;
  result?: unknown;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

// POST — accept work, return 202 immediately
app.post('/api/reports/generate', authenticate, async (req, res) => {
  const jobId = randomUUID();

  // Store job in Redis with initial state
  await redis.setex(\`job:\${jobId}\`, 3600, JSON.stringify({
    id: jobId,
    status: 'queued',
    createdAt: new Date().toISOString(),
    params: req.body,
  }));

  // Add to job queue (BullMQ, etc.)
  await reportQueue.add('generate', { jobId, userId: req.user.id, ...req.body });

  // Return 202 Accepted with polling URL
  res.status(202)
    .set('Location', \`/api/jobs/\${jobId}\`)
    .json({
      jobId,
      status: 'queued',
      pollUrl: \`/api/jobs/\${jobId}\`,
      estimatedDuration: '30-60 seconds',
    });
});

// GET — poll for status
app.get('/api/jobs/:jobId', authenticate, async (req, res) => {
  const jobData = await redis.get(\`job:\${req.params.jobId}\`);

  if (!jobData) {
    return res.status(404).json({ error: 'Job not found' });
  }

  const job: Job = JSON.parse(jobData);

  if (job.status === 'completed') {
    // Redirect to result or return inline
    return res.status(303) // See Other
      .set('Location', \`/api/reports/\${job.resultId}\`)
      .json({
        status: 'completed',
        resultUrl: \`/api/reports/\${job.resultId}\`,
        completedAt: job.completedAt,
      });
  }

  // Still processing — include Retry-After hint
  res.set('Retry-After', '5') // Poll again in 5 seconds
    .json({
      status: job.status,
      progress: job.progress,
      createdAt: job.createdAt,
    });
});

// Worker updates job status
const worker = new Worker('reports', async (bullJob) => {
  const { jobId } = bullJob.data;

  await updateJobStatus(jobId, { status: 'processing', progress: 0 });

  const result = await generateReport(bullJob.data, async (progress) => {
    await updateJobStatus(jobId, { progress }); // Update progress
    await bullJob.updateProgress(progress);
  });

  await updateJobStatus(jobId, {
    status: 'completed',
    resultId: result.id,
    completedAt: new Date().toISOString(),
  });
});`,
      language: 'typescript',
    },
    interviewAnswer: '202 Accepted is the correct status for "I\'ve accepted your request but haven\'t processed it yet." The polling endpoint returns Retry-After to help clients know how often to poll. For real-time status, WebSocket or SSE is better than polling. For fire-and-forget operations, webhooks notify the client when done without them needing to poll. I use this pattern for anything that takes more than 5 seconds — PDF generation, exports, bulk operations.',
    commonMistakes: [
      'Using synchronous HTTP for operations that take minutes',
      'No progress updates — client doesn\'t know if it\'s stuck',
      'Not setting job TTL (Redis fills up)',
    ],
    realWorldUse: 'Video processing (YouTube), ML inference (OpenAI), bulk data exports, report generation.',
    followUpQuestions: ['What is the difference between polling and webhooks for async APIs?', 'How do you handle job timeouts?'],
  },
];
