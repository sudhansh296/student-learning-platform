import type { RestapiLesson } from '../restapi-curriculum';

export const lesson09: RestapiLesson = {
  id: 'restapi-09',
  title: 'REST API Best Practices',
  slug: '09-best-practices',
  chapter: 'advanced',
  order: 9,
  difficulty: 'intermediate',
  readingTime: 12,
  description: 'Make your API developer-friendly and production-ready with versioning, pagination, rate limiting, caching, CORS, and documentation.',
  sections: [
    {
      type: 'text',
      content: 'A technically correct API and a production-ready API are not the same thing. Production APIs need versioning so existing clients do not break when you make changes, pagination so large datasets do not crash servers, rate limiting so one client cannot consume all capacity, caching to reduce load and latency, and proper CORS headers so browser clients can actually call them.'
    },
    {
      type: 'heading',
      content: 'API Versioning'
    },
    {
      type: 'text',
      content: 'When you need to make a breaking change — removing a field, changing a URL structure, altering response format — versioning lets old clients continue using v1 while new clients use v2. Without versioning, any breaking change instantly breaks all existing integrations.'
    },
    {
      type: 'table',
      title: 'API versioning strategies compared',
      headers: ['Strategy', 'Example', 'Pros', 'Cons'],
      rows: [
        ['URL path', '/api/v1/users', 'Visible, cacheable, easy to test in browser', 'Version "pollutes" the URL'],
        ['Query param', '/users?version=2', 'Easy to add without URL changes', 'Less visible, can be omitted accidentally'],
        ['Accept header', 'Accept: application/vnd.api+json;version=2', 'Architecturally clean', 'Not testable in browser, harder to cache'],
        ['Custom header', 'X-API-Version: 2', 'Clean URLs', 'Not standard, ignored by CDNs']
      ]
    },
    {
      type: 'note',
      title: 'Recommendation',
      content: 'Use URL path versioning (/api/v1/) for public APIs. It is explicit, cacheable, and trivially testable. The "URL pollution" objection is a minor aesthetic concern compared to the operational benefits.'
    },
    {
      type: 'heading',
      content: 'Pagination'
    },
    {
      type: 'text',
      content: 'Never return unbounded collections. A GET /users that returns all 500,000 users will crash your server and the client. Always paginate list endpoints. Two main approaches exist: page-based pagination (simple, works for most cases) and cursor-based pagination (better for real-time data and large datasets).'
    },
    {
      type: 'table',
      title: 'Page-based vs cursor-based pagination',
      headers: ['', 'Page-based (?page=2&limit=20)', 'Cursor-based (?after=user_xyz&limit=20)'],
      rows: [
        ['Pros', 'Simple, easy to build UI controls', 'No duplicate/skipped items if data changes'],
        ['Cons', 'Items can shift if data is inserted/deleted', 'No random access, harder to build page buttons'],
        ['Best for', 'Admin tables, reports, stable data', 'Feeds, timelines, frequently changing data'],
        ['Total count', 'Easy to include', 'Expensive — often omitted']
      ]
    },
    {
      type: 'example',
      title: 'Paginated response with Link header and meta',
      content: 'The Link header follows the RFC 5988 standard used by GitHub\'s API and provides machine-readable navigation URLs. The meta.pagination object provides the same information in JSON for clients that prefer to read it from the response body.',
      code: `// Express route with pagination
app.get('/users', (req, res) => {
  const page  = Math.max(1, parseInt(req.query.page)  || 1);
  const limit = Math.min(100, parseInt(req.query.limit) || 20);
  const offset = (page - 1) * limit;

  // Simulate database query
  const total = 47;
  const items = users.slice(offset, offset + limit);
  const totalPages = Math.ceil(total / limit);
  const base = '/users?limit=' + limit;

  // RFC 5988 Link header — used by GitHub API
  const links = [];
  if (page > 1)          links.push('<' + base + '&page=' + (page - 1) + '>; rel="prev"');
  if (page < totalPages) links.push('<' + base + '&page=' + (page + 1) + '>; rel="next"');
  links.push('<' + base + '&page=1>; rel="first"');
  links.push('<' + base + '&page=' + totalPages + '>; rel="last"');

  if (links.length) res.set('Link', links.join(', '));

  res.json({
    data: items,
    meta: {
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }
  });
});`,
      language: 'javascript',
      output: `GET /users?page=2&limit=3
Link: </users?limit=3&page=1>; rel="prev", </users?limit=3&page=3>; rel="next", ...
{ data: [...], meta: { pagination: { total: 47, page: 2, limit: 3, totalPages: 16 } } }`
    },
    {
      type: 'heading',
      content: 'Filtering and Sorting'
    },
    {
      type: 'text',
      content: 'Let clients request only the data they need. Filtering reduces payload size and server load. Sorting gives clients control over presentation order without fetching all data and sorting client-side. Use query parameters for both: they are optional, do not change the resource address, and can be freely combined.'
    },
    {
      type: 'heading',
      content: 'Rate Limiting'
    },
    {
      type: 'text',
      content: 'Rate limiting protects your API from abuse, whether intentional (DDoS) or accidental (a bug causing infinite retry loops). When a client exceeds the limit, return 429 Too Many Requests. Include standard headers so well-behaved clients know when to retry.'
    },
    {
      type: 'example',
      title: 'Rate limit response headers',
      content: 'These three headers are the industry standard for communicating rate limit status. The Retry-After header tells clients exactly when they can try again, enabling polite backoff behavior instead of flooding your server with repeated 429 requests.',
      code: `// Express rate limiting middleware (using express-rate-limit package)
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // 100 requests per window per IP
  standardHeaders: true,     // adds X-RateLimit-* headers
  legacyHeaders: false,

  handler: (req, res) => {
    res.status(429).json({
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please slow down.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

app.use('/api/', limiter);

// Headers the client receives on every response:
// X-RateLimit-Limit: 100        (max requests per window)
// X-RateLimit-Remaining: 73     (requests left in this window)
// X-RateLimit-Reset: 1724080800 (window resets at this Unix timestamp)
// Retry-After: 840              (seconds until the window resets, only on 429)`,
      language: 'javascript',
      output: `Normal request:
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 73
  X-RateLimit-Reset: 1724080800

After limit exceeded:
  HTTP 429 Too Many Requests
  Retry-After: 840
  { error: 'RATE_LIMIT_EXCEEDED', ... }`
    },
    {
      type: 'heading',
      content: 'HTTP Caching'
    },
    {
      type: 'text',
      content: 'HTTP caching lets clients and intermediaries (CDNs, proxies) store responses and reuse them without hitting your server. Two mechanisms work together: Cache-Control (tells clients how long to cache) and ETags (let clients check if the content changed before downloading it again).'
    },
    {
      type: 'example',
      title: 'Cache-Control header usage',
      content: 'The Cache-Control header instructs every party in the request chain — browser, CDN, proxy — how to handle caching. The ETag header enables conditional requests: the client sends the previous ETag back as If-None-Match and the server returns 304 Not Modified if nothing changed, saving bandwidth.',
      code: `// Static public data — cache aggressively (1 hour)
app.get('/countries', (req, res) => {
  res.set('Cache-Control', 'public, max-age=3600');
  res.json({ data: countries });
});

// User-specific data — cache in browser only (5 minutes)
app.get('/profile', authenticate, (req, res) => {
  res.set('Cache-Control', 'private, max-age=300');
  res.json({ data: req.user });
});

// Never cache — real-time data or sensitive endpoints
app.get('/payments', authenticate, (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ data: getPayments(req.user.id) });
});

// ETag — client sends it back, server returns 304 if unchanged
app.get('/users/:id', (req, res) => {
  const user = db.find(req.params.id);
  const etag = '"' + user.updatedAt + '"';

  if (req.headers['if-none-match'] === etag) {
    return res.status(304).send(); // not modified — no body needed
  }

  res.set('ETag', etag);
  res.set('Cache-Control', 'private, max-age=60');
  res.json({ data: user });
});`,
      language: 'javascript',
      output: `First request:  200, ETag: "2026-08-19T14:00:00Z", full body
Second request (same ETag): 304 Not Modified, no body — saves bandwidth`
    },
    {
      type: 'heading',
      content: 'CORS'
    },
    {
      type: 'text',
      content: 'CORS (Cross-Origin Resource Sharing) is a browser security feature. Browsers block JavaScript from making requests to a different domain than the one serving the page — unless the target server explicitly allows it via CORS headers. This only affects browser clients; curl and server-side code are not affected.'
    },
    {
      type: 'example',
      title: 'CORS middleware in Express',
      content: 'The cors package handles all CORS header logic including preflight OPTIONS requests. The origin option controls which domains are allowed to call your API from a browser. In production, always specify exact origins rather than using the wildcard asterisk, which disables credentials.',
      code: `const cors = require('cors');

// Development — allow all origins
app.use(cors());

// Production — allow specific origins only
app.use(cors({
  origin: ['https://app.example.com', 'https://admin.example.com'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,       // allow cookies/auth headers
  maxAge: 86400            // cache preflight result for 24 hours
}));

// Headers Express/cors adds to responses:
// Access-Control-Allow-Origin: https://app.example.com
// Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE
// Access-Control-Allow-Headers: Content-Type, Authorization
// Access-Control-Allow-Credentials: true

// Manual CORS (no package) — for understanding:
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://app.example.com');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).send();
  }
  next();
});`,
      language: 'javascript',
      output: `Browser fetch from app.example.com to api.example.com:
  Preflight OPTIONS -> 204 (CORS allowed)
  Actual request    -> 200 (with CORS headers, browser allows it)

Browser fetch from evil.example.com:
  Preflight OPTIONS -> blocked by CORS policy`
    },
    {
      type: 'heading',
      content: 'API Documentation: OpenAPI and Swagger'
    },
    {
      type: 'text',
      content: 'OpenAPI (formerly Swagger) is the industry standard for documenting REST APIs. An OpenAPI spec is a JSON or YAML file that describes every endpoint, parameter, request body, and response in a machine-readable format. Tools can then generate interactive documentation (Swagger UI), client SDKs, and mock servers from that single spec file.'
    },
    {
      type: 'tryit',
      title: 'Pagination Calculator',
      js: `function calculate() {
  var total  = Math.max(0, parseInt(document.getElementById('total-input').value) || 0);
  var page   = Math.max(1, parseInt(document.getElementById('page-input').value) || 1);
  var limit  = Math.max(1, parseInt(document.getElementById('limit-input').value) || 10);

  var totalPages = Math.ceil(total / limit) || 1;
  page = Math.min(page, totalPages);

  var firstItem = total === 0 ? 0 : (page - 1) * limit + 1;
  var lastItem  = Math.min(page * limit, total);
  var hasNext   = page < totalPages;
  var hasPrev   = page > 1;

  var base = '/users?limit=' + limit;
  var currentUrl = base + '&page=' + page;
  var nextUrl = hasNext ? base + '&page=' + (page + 1) : null;
  var prevUrl = hasPrev ? base + '&page=' + (page - 1) : null;

  var html = '<div class="calc-result">';
  html += '<div class="result-row"><span class="result-label">Total pages</span><span class="result-val">' + totalPages + '</span></div>';
  html += '<div class="result-row"><span class="result-label">Items on page ' + page + '</span><span class="result-val">' + (total === 0 ? 0 : (lastItem - firstItem + 1)) + ' (items ' + firstItem + ' to ' + lastItem + ')</span></div>';
  html += '<div class="result-row"><span class="result-label">Current URL</span><code>' + currentUrl + '</code></div>';
  if (prevUrl) html += '<div class="result-row"><span class="result-label">Prev page URL</span><code>' + prevUrl + '</code></div>';
  if (nextUrl) html += '<div class="result-row"><span class="result-label">Next page URL</span><code>' + nextUrl + '</code></div>';
  html += '</div>';

  var maxButtons = Math.min(totalPages, 10);
  var startPage = Math.max(1, page - 4);
  var endPage = Math.min(totalPages, startPage + maxButtons - 1);
  if (endPage - startPage < maxButtons - 1) startPage = Math.max(1, endPage - maxButtons + 1);

  html += '<div class="page-bar">';
  if (hasPrev) html += '<button class="page-btn nav-btn" onclick="jumpTo(' + (page-1) + ')">prev</button>';
  if (startPage > 1) html += '<span class="ellipsis">...</span>';
  for (var p = startPage; p <= endPage; p++) {
    html += '<button class="page-btn' + (p === page ? ' current' : '') + '" onclick="jumpTo(' + p + ')">' + p + '</button>';
  }
  if (endPage < totalPages) html += '<span class="ellipsis">...</span>';
  if (hasNext) html += '<button class="page-btn nav-btn" onclick="jumpTo(' + (page+1) + ')">next</button>';
  html += '</div>';

  document.getElementById('calc-output').innerHTML = html;
}

window.jumpTo = function(p) {
  document.getElementById('page-input').value = p;
  calculate();
};

document.getElementById('calc-btn').addEventListener('click', calculate);
['total-input','page-input','limit-input'].forEach(function(id) {
  document.getElementById(id).addEventListener('keydown', function(e) { if (e.key === 'Enter') calculate(); });
});`,
      css: `body { font-family: system-ui, sans-serif; padding: 14px; background: #f8fafc; }
h3 { color: #1e293b; margin: 0 0 10px 0; font-size: 15px; }
.inputs-row { display: flex; gap: 10px; margin-bottom: 10px; flex-wrap: wrap; align-items: flex-end; }
.input-group { display: flex; flex-direction: column; gap: 4px; }
.input-group label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; }
.input-group input { width: 100px; padding: 7px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; }
#calc-btn { background: #f97316; color: white; border: none; padding: 8px 18px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 13px; }
#calc-btn:hover { background: #ea580c; }
.calc-result { background: white; border-radius: 8px; border: 1px solid #e2e8f0; padding: 12px; margin-bottom: 10px; }
.result-row { display: flex; align-items: baseline; gap: 10px; padding: 5px 0; border-bottom: 1px solid #f1f5f9; font-size: 12px; }
.result-row:last-child { border-bottom: none; }
.result-label { color: #64748b; font-weight: 600; min-width: 140px; flex-shrink: 0; }
.result-val { color: #1e293b; font-weight: 700; }
code { background: #1e293b; color: #7dd3fc; padding: 2px 8px; border-radius: 4px; font-family: monospace; font-size: 11px; }
.page-bar { display: flex; gap: 4px; flex-wrap: wrap; align-items: center; }
.page-btn { min-width: 32px; height: 32px; border: 1px solid #e2e8f0; background: white; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; color: #334155; transition: all 0.1s; }
.page-btn:hover { background: #f1f5f9; }
.page-btn.current { background: #f97316; color: white; border-color: #f97316; }
.page-btn.nav-btn { background: #f1f5f9; color: #475569; }
.ellipsis { color: #94a3b8; font-size: 12px; padding: 0 4px; }`
    }
  ],
  exercises: [
    {
      id: 'ex-09-1',
      question: 'You ship /api/users and later need to change the response format in a breaking way. What is the best approach?',
      type: 'multiple-choice',
      options: [
        'Modify /api/users directly — clients should update their code',
        'Create /api/v2/users and keep /api/v1/users (or /api/users) working for existing clients',
        'Add a query param ?legacy=true to the existing endpoint',
        'Deprecate the endpoint and require all clients to re-register'
      ],
      correct: 1,
      explanation: 'API versioning allows you to make breaking changes without breaking existing clients. Keep the old version running until all clients have migrated, then deprecate it with advance notice. Creating /api/v2/users while maintaining /api/v1/users (which could be the unversioned original) is the standard approach.'
    },
    {
      id: 'ex-09-2',
      question: 'A client sends GET /users with the ETag from the previous response as an If-None-Match header. The data has not changed. What should the server return?',
      type: 'multiple-choice',
      options: [
        '200 OK with the full response body again',
        '204 No Content with no body',
        '304 Not Modified with no body',
        '400 Bad Request — ETags are only for POST requests'
      ],
      correct: 2,
      explanation: '304 Not Modified tells the client their cached version is still current. No body is sent, saving bandwidth. The client uses its cached copy. This is the whole point of ETags — avoid re-sending data the client already has.'
    },
    {
      id: 'ex-09-3',
      question: 'Why does the CORS header Access-Control-Allow-Origin: * (wildcard) prevent cookies from being sent with requests?',
      type: 'multiple-choice',
      options: [
        'Wildcard origins are only supported in HTTP/1.1, not HTTP/2',
        'The browser security model does not allow credentials (cookies, auth headers) to be sent to wildcard origins to prevent credential leakage to any random origin',
        'Wildcard origins disable all caching including cookies',
        'Cookies are blocked at the DNS level when wildcard CORS is used'
      ],
      correct: 1,
      explanation: 'Allowing credentials with a wildcard origin would be a security hole — it would allow any website to make authenticated requests to your API using the user\'s cookies. The browser prohibits Access-Control-Allow-Credentials: true combined with Access-Control-Allow-Origin: *. For credentialed requests, you must specify exact allowed origins.'
    }
  ],
  quiz: [
    {
      id: 'q-09-1',
      question: 'Cursor-based pagination is preferred over page-based pagination for which type of data?',
      options: [
        'Static reference data like country lists',
        'Real-time feeds and frequently changing collections where items can be inserted or deleted between pages',
        'Small collections under 100 items',
        'Collections sorted alphabetically'
      ],
      correct: 1,
      explanation: 'Cursor-based pagination uses a stable position marker (the ID or timestamp of the last seen item) rather than a page number. If items are inserted or deleted between requests, page numbers shift and you get duplicate or skipped items. A cursor always points to the same position in the data regardless of insertions or deletions.'
    },
    {
      id: 'q-09-2',
      question: 'Which Cache-Control directive should you use for data that contains sensitive user-specific information?',
      options: [
        'public, max-age=3600',
        'no-store',
        'private, max-age=300',
        'immutable, max-age=86400'
      ],
      correct: 2,
      explanation: '"private" means only the end user\'s browser may cache the response — CDNs and shared proxies must not store it. Combined with a short max-age, this allows browser-side caching (good for performance) while preventing shared caches from serving one user\'s data to another.'
    },
    {
      id: 'q-09-3',
      question: 'What is the primary purpose of the X-RateLimit-Reset header in a 429 response?',
      options: [
        'It resets the rate limit immediately when included',
        'It tells the client the Unix timestamp (or seconds) when their rate limit window resets so they know when to retry',
        'It contains the new API key to use after the old one is rate-limited',
        'It is an internal server header not intended for clients'
      ],
      correct: 1,
      explanation: 'X-RateLimit-Reset provides the time when the current rate limit window expires and the counter resets to zero. Combined with Retry-After (which may give the same value as seconds to wait), it enables clients to implement intelligent backoff — waiting exactly as long as needed rather than polling repeatedly.'
    }
  ]
};
