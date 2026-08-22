import type { RestapiLesson } from '../restapi-curriculum';

export const lesson10: RestapiLesson = {
  id: 'restapi-10',
  title: 'REST API Quick Reference and Cheat Sheet',
  slug: '10-references',
  chapter: 'advanced',
  order: 10,
  difficulty: 'beginner',
  readingTime: 8,
  description: 'A searchable reference of HTTP methods, status codes, headers, and REST best practices for daily development use.',
  sections: [
    {
      type: 'text',
      content: 'This lesson is a reference you come back to, not one you read once. Use the searchable cheat sheet below to quickly look up status codes, headers, curl syntax, and REST naming conventions during development.'
    },
    {
      type: 'heading',
      content: 'HTTP Methods Cheat Sheet'
    },
    {
      type: 'table',
      title: 'HTTP methods quick reference',
      headers: ['Method', 'Purpose', 'Request Body', 'Success Code', 'Idempotent', 'Safe'],
      rows: [
        ['GET',    'Read resource(s)',    'No',  '200 OK',         'Yes', 'Yes'],
        ['POST',   'Create resource',     'Yes', '201 Created',    'No',  'No'],
        ['PUT',    'Replace resource',    'Yes', '200 OK',         'Yes', 'No'],
        ['PATCH',  'Partial update',      'Yes', '200 OK',         'No',  'No'],
        ['DELETE', 'Remove resource',     'No',  '204 No Content', 'Yes', 'No']
      ]
    },
    {
      type: 'heading',
      content: 'Status Codes Grouped Reference'
    },
    {
      type: 'table',
      title: '2xx Success',
      headers: ['Code', 'Name', 'When to use'],
      rows: [
        ['200', 'OK',         'Successful GET, PUT, PATCH'],
        ['201', 'Created',    'Successful POST — resource created'],
        ['202', 'Accepted',   'Request accepted, processing async'],
        ['204', 'No Content', 'Success with no response body (DELETE)'],
        ['206', 'Partial Content', 'Range requests (file downloads)']
      ]
    },
    {
      type: 'table',
      title: '4xx Client Errors',
      headers: ['Code', 'Name', 'When to use'],
      rows: [
        ['400', 'Bad Request',            'Malformed JSON, missing required fields'],
        ['401', 'Unauthorized',           'No credentials or invalid token'],
        ['403', 'Forbidden',              'Authenticated but lacks permission'],
        ['404', 'Not Found',              'Resource does not exist'],
        ['405', 'Method Not Allowed',     'HTTP method not supported for this URL'],
        ['409', 'Conflict',               'Duplicate resource (email already exists)'],
        ['410', 'Gone',                   'Resource existed but was permanently deleted'],
        ['422', 'Unprocessable Entity',   'Validation failed on valid-format data'],
        ['429', 'Too Many Requests',      'Rate limit exceeded']
      ]
    },
    {
      type: 'table',
      title: '5xx Server Errors',
      headers: ['Code', 'Name', 'When to use'],
      rows: [
        ['500', 'Internal Server Error', 'Unexpected server crash or bug'],
        ['502', 'Bad Gateway',           'Upstream service returned invalid response'],
        ['503', 'Service Unavailable',   'Server down or overloaded'],
        ['504', 'Gateway Timeout',       'Upstream service timed out']
      ]
    },
    {
      type: 'heading',
      content: 'Common Headers Reference'
    },
    {
      type: 'table',
      title: 'Request headers',
      headers: ['Header', 'Value', 'Purpose'],
      rows: [
        ['Content-Type',  'application/json',        'Format of the request body'],
        ['Accept',        'application/json',        'Expected format of the response'],
        ['Authorization', 'Bearer <token>',          'JWT or OAuth token'],
        ['X-API-Key',     '<key>',                   'API key authentication'],
        ['If-None-Match', '"<etag>"',                'Conditional GET — skip if unchanged'],
        ['If-Modified-Since', 'HTTP-date',           'Conditional GET by date']
      ]
    },
    {
      type: 'table',
      title: 'Response headers',
      headers: ['Header', 'Example value', 'Purpose'],
      rows: [
        ['Content-Type',           'application/json; charset=utf-8', 'Format of the response body'],
        ['Location',               '/users/42',                       'URL of newly created resource'],
        ['ETag',                   '"2026-08-19T14:00:00Z"',          'Resource version for caching'],
        ['Cache-Control',          'private, max-age=300',            'Caching instructions'],
        ['X-RateLimit-Limit',      '100',                             'Max requests per window'],
        ['X-RateLimit-Remaining',  '73',                              'Remaining requests this window'],
        ['X-RateLimit-Reset',      '1724080800',                      'When the window resets (Unix ts)'],
        ['Access-Control-Allow-Origin', 'https://app.example.com',   'CORS allowed origin']
      ]
    },
    {
      type: 'heading',
      content: 'REST Naming Conventions Checklist'
    },
    {
      type: 'list',
      title: 'REST URL design rules:',
      items: [
        'Use plural nouns: /users not /user',
        'Use lowercase: /product-categories not /productCategories',
        'No verbs in URLs: /users not /getUsers or /createUser',
        'Use HTTP methods as verbs: GET /users not /users/list',
        'Nest related resources: /users/1/orders not /userOrders?userId=1',
        'Limit nesting to 2-3 levels deep',
        'Always version your API: /api/v1/users',
        'Use query params for filtering, sorting, pagination',
        'Use path params for resource identity: /users/:id',
        'Use kebab-case for multi-word path segments: /product-categories'
      ]
    },
    {
      type: 'heading',
      content: 'curl Commands Reference'
    },
    {
      type: 'example',
      title: 'curl commands for GET, POST, PUT, PATCH, DELETE',
      content: 'These curl commands cover every common REST API operation. The -s flag silences the progress bar, -X sets the method, -H adds a header, -d provides the body, and -w appends a custom format string (useful for printing the HTTP status code).',
      code: `# GET — read resource(s)
curl -s https://api.example.com/users
curl -s https://api.example.com/users/1
curl -s "https://api.example.com/users?role=admin&page=1&limit=10"

# POST — create a resource
curl -s -X POST https://api.example.com/users \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <token>" \\
  -d '{"name": "Alice", "email": "alice@example.com"}'

# PUT — replace a resource
curl -s -X PUT https://api.example.com/users/1 \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <token>" \\
  -d '{"name": "Alice Johnson", "email": "alice@example.com", "role": "admin"}'

# PATCH — partial update
curl -s -X PATCH https://api.example.com/users/1 \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <token>" \\
  -d '{"role": "user"}'

# DELETE — remove a resource
curl -s -X DELETE https://api.example.com/users/1 \\
  -H "Authorization: Bearer <token>" \\
  -w "\\nHTTP Status: %{http_code}\\n"

# Show response headers with body
curl -s -i https://api.example.com/users/1

# Show only response headers
curl -s -I https://api.example.com/users/1`,
      language: 'bash',
      output: `GET  /users     -> 200 [array of users]
POST /users     -> 201 { id: 4, name: 'Alice', ... }
PUT  /users/1   -> 200 { id: 1, name: 'Alice Johnson', ... }
PATCH /users/1  -> 200 { id: 1, ..., role: 'user' }
DELETE /users/1 -> HTTP Status: 204`
    },
    {
      type: 'heading',
      content: 'fetch Patterns for All Methods'
    },
    {
      type: 'example',
      title: 'fetch patterns for all HTTP methods',
      content: 'This complete fetch reference covers every HTTP method with correct headers, body handling, and response parsing. Each function follows the same pattern: build options, fetch, check for errors, parse the JSON response body where applicable.',
      code: `const BASE = 'https://api.example.com';
const token = () => localStorage.getItem('token');

// GET — no body, no Content-Type needed
const getUser = async (id) => {
  const res = await fetch(BASE + '/users/' + id, {
    headers: { 'Authorization': 'Bearer ' + token() }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json(); // -> { data: { id, name, ... } }
};

// POST — JSON body + Content-Type
const createUser = async (data) => {
  const res = await fetch(BASE + '/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token()
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json(); // -> { data: { id: 5, ... } }
};

// PUT — same as POST but targets an existing resource
const replaceUser = async (id, data) => {
  const res = await fetch(BASE + '/users/' + id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token()
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

// PATCH — send only the fields to change
const updateUser = async (id, changes) => {
  const res = await fetch(BASE + '/users/' + id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token()
    },
    body: JSON.stringify(changes)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

// DELETE — no body, check for 204 before parsing
const deleteUser = async (id) => {
  const res = await fetch(BASE + '/users/' + id, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + token() }
  });
  if (!res.ok) throw new Error(await res.text());
  // 204 has no body — do not call res.json()
  return res.status === 204 ? null : res.json();
};`,
      language: 'javascript',
      output: `getUser(1)              -> { data: { id: 1, name: 'Alice', ... } }
createUser({name,...})  -> { data: { id: 5, name: '...', ... } }
replaceUser(1, {...})   -> { data: { id: 1, ... } }
updateUser(1, {role:x}) -> { data: { id: 1, role: 'x', ... } }
deleteUser(1)           -> null (204 No Content)`
    },
    {
      type: 'heading',
      content: 'Tools Reference'
    },
    {
      type: 'table',
      title: 'REST API development tools',
      headers: ['Tool', 'Type', 'Best for'],
      rows: [
        ['Postman',   'GUI client',     'Testing, documenting, and sharing API collections'],
        ['Insomnia',  'GUI client',     'Lightweight alternative to Postman with a cleaner UI'],
        ['HTTPie',    'CLI client',     'Readable command-line HTTP requests (simpler than curl)'],
        ['curl',      'CLI client',     'Universal — available everywhere, scriptable in bash'],
        ['Swagger UI', 'Documentation', 'Interactive API docs from an OpenAPI spec'],
        ['Bruno',     'GUI client',     'Offline-first, git-friendly API client, stores collections as files']
      ]
    },
    {
      type: 'tryit',
      title: 'Searchable REST Cheat Sheet',
      js: `document.body.innerHTML = '<div><h3>Searchable REST Cheat Sheet</h3><div class=\\"search-row\\"><input id=\\"search-input\\" placeholder=\\"Search methods, status codes, headers...\\" /><span id=\\"count-label\\"></span></div><div id=\\"cards-grid\\"></div></div>';

var cards = [
  { cat: 'Methods', name: 'GET', desc: 'Read a resource. Safe and idempotent. No request body. Returns 200.' },
  { cat: 'Methods', name: 'POST', desc: 'Create a resource. Sends JSON body. Returns 201 Created. Not idempotent.' },
  { cat: 'Methods', name: 'PUT', desc: 'Replace an entire resource. Sends full JSON body. Returns 200. Idempotent.' },
  { cat: 'Methods', name: 'PATCH', desc: 'Partial update. Send only changed fields. Returns 200. More efficient than PUT.' },
  { cat: 'Methods', name: 'DELETE', desc: 'Remove a resource. No body. Returns 204 No Content. Idempotent.' },
  { cat: 'Status Codes', name: '200 OK', desc: 'Successful GET, PUT, or PATCH. Response body contains the resource.' },
  { cat: 'Status Codes', name: '201 Created', desc: 'Successful POST. Include Location header pointing to the new resource.' },
  { cat: 'Status Codes', name: '204 No Content', desc: 'Success with no response body. Standard for successful DELETE.' },
  { cat: 'Status Codes', name: '304 Not Modified', desc: 'Client cache is still valid. Return with no body to save bandwidth.' },
  { cat: 'Status Codes', name: '400 Bad Request', desc: 'Client sent malformed JSON or missing required fields.' },
  { cat: 'Status Codes', name: '401 Unauthorized', desc: 'No credentials or invalid token. Prompt the user to authenticate.' },
  { cat: 'Status Codes', name: '403 Forbidden', desc: 'Authenticated but lacks permission. Do not return 401 or 404.' },
  { cat: 'Status Codes', name: '404 Not Found', desc: 'Resource does not exist at this URL.' },
  { cat: 'Status Codes', name: '409 Conflict', desc: 'Resource conflict — e.g. duplicate email on signup.' },
  { cat: 'Status Codes', name: '429 Too Many Requests', desc: 'Rate limit exceeded. Include Retry-After header.' },
  { cat: 'Status Codes', name: '500 Internal Server Error', desc: 'Unexpected server crash. Never expose stack traces to clients.' },
  { cat: 'Headers', name: 'Content-Type', desc: 'application/json — tells the server the format of your request body.' },
  { cat: 'Headers', name: 'Accept', desc: 'application/json — tells the server what format you want in response.' },
  { cat: 'Headers', name: 'Authorization', desc: 'Bearer <token> — sends JWT or OAuth token with every request.' },
  { cat: 'Headers', name: 'X-API-Key', desc: 'Custom header for API key authentication — keep it out of the URL.' },
  { cat: 'Headers', name: 'Cache-Control', desc: 'no-store, private, or public max-age — controls caching behavior.' },
  { cat: 'Headers', name: 'ETag', desc: 'Resource version tag used with If-None-Match for conditional requests.' },
  { cat: 'Headers', name: 'X-RateLimit-Remaining', desc: 'How many requests remain in the current rate limit window.' },
  { cat: 'Patterns', name: 'Response Envelope', desc: '{ data: {...}, meta: {...} } — wrap all responses for extensibility.' },
  { cat: 'Patterns', name: 'Error Format', desc: '{ error: { code, message, details } } — consistent across all endpoints.' },
  { cat: 'Patterns', name: 'Pagination', desc: '?page=2&limit=20 — always paginate lists; include total and totalPages.' },
  { cat: 'Patterns', name: 'ISO 8601 Dates', desc: '\\"2026-08-19T14:00:00Z\\" — always use ISO format for all date fields.' },
  { cat: 'Patterns', name: 'Versioning', desc: '/api/v1/users — prefix all routes with a version number.' },
  { cat: 'Patterns', name: 'Plural Nouns', desc: '/users not /user — always use plural nouns for collection endpoints.' },
  { cat: 'Tools', name: 'Postman', desc: 'GUI tool for building, testing, and sharing REST API request collections.' },
  { cat: 'Tools', name: 'Insomnia', desc: 'Lightweight GUI REST client with a clean interface and plugin support.' },
  { cat: 'Tools', name: 'curl', desc: 'Command-line tool available on every system. Essential for scripting and CI.' },
  { cat: 'Tools', name: 'HTTPie', desc: 'User-friendly command-line HTTP client with color output and JSON highlighting.' },
  { cat: 'Tools', name: 'Swagger UI', desc: 'Auto-generated interactive API documentation from an OpenAPI spec file.' }
];

var catColors = {
  'Methods':      '#f97316',
  'Status Codes': '#10b981',
  'Headers':      '#3b82f6',
  'Patterns':     '#8b5cf6',
  'Tools':        '#64748b'
};

function escHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function render(list) {
  var grid = document.getElementById('cards-grid');
  grid.innerHTML = list.map(function(c) {
    var col = catColors[c.cat] || '#94a3b8';
    return '<div class=\\"ref-card\\" style=\\"border-top:3px solid ' + col + '\\">' +
      '<span class=\\"ref-cat\\" style=\\"background:' + col + '\\">' + c.cat + '</span>' +
      '<div class=\\"ref-name\\">' + escHtml(c.name) + '</div>' +
      '<div class=\\"ref-desc\\">' + escHtml(c.desc) + '</div>' +
      '</div>';
  }).join('');
  document.getElementById('count-label').textContent = list.length + ' items';
}

document.getElementById('search-input').addEventListener('input', function() {
  var q = this.value.toLowerCase();
  var filtered = q
    ? cards.filter(function(c) { return c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || c.cat.toLowerCase().includes(q); })
    : cards;
  render(filtered);
});

render(cards);`,
      css: `body { font-family: system-ui, sans-serif; padding: 14px; background: #f8fafc; }
h3 { color: #1e293b; margin: 0 0 10px 0; font-size: 15px; }
.search-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
#search-input { flex: 1; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; }
#count-label { font-size: 11px; color: #94a3b8; white-space: nowrap; }
.legend { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
.leg-item { display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; }
.leg-dot { width: 10px; height: 10px; border-radius: 50%; }
#cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; }
.ref-card { background: white; border-radius: 8px; border: 1px solid #e2e8f0; padding: 10px 12px; }
.ref-cat { display: inline-block; color: white; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; padding: 2px 7px; border-radius: 10px; margin-bottom: 6px; }
.ref-name { font-size: 13px; font-weight: 700; color: #1e293b; margin-bottom: 4px; font-family: monospace; }
.ref-desc { font-size: 11px; color: #64748b; line-height: 1.5; }`
    }
  ],
  exercises: [
    {
      id: 'ex-10-1',
      question: 'You want to update only the "status" field of an order without changing other fields. Which HTTP method and why?',
      type: 'multiple-choice',
      options: [
        'POST /orders — because you are sending data to the server',
        'PUT /orders/:id — because PUT is the standard update method',
        'PATCH /orders/:id — because PATCH updates only the fields you specify, leaving the rest unchanged',
        'GET /orders/:id?status=shipped — because the status change is a filter'
      ],
      correct: 2,
      explanation: 'PATCH is designed for partial updates. You send only { "status": "shipped" } and the server merges it with the existing order. PUT would require sending the complete order object — omitting any field would null it out. GET is read-only. PATCH is the correct, precise tool for this operation.'
    },
    {
      id: 'ex-10-2',
      question: 'A fetch() call succeeds (no network error) but the server returns 403. How do you detect this error?',
      type: 'multiple-choice',
      options: [
        'fetch() throws an exception for any non-200 status',
        'Check response.ok — it is false for 4xx and 5xx responses; then read the status code from response.status',
        'The response body will be null for error responses',
        '403 causes a CORS error that fetch() catches automatically'
      ],
      correct: 1,
      explanation: 'fetch() only rejects (throws) for network failures, not for HTTP error status codes. A 403 response resolves normally. You must check response.ok (which is true only for 200-299) or check response.status directly. A common pattern is: if (!response.ok) { throw new Error("HTTP " + response.status); }'
    }
  ],
  quiz: [
    {
      id: 'q-10-1',
      question: 'Which combination of HTTP method and status code is correct for creating a new resource?',
      options: [
        'GET + 200',
        'POST + 201',
        'PUT + 204',
        'PATCH + 200'
      ],
      correct: 1,
      explanation: 'POST is the correct method for creating a new resource, and 201 Created is the correct status code indicating that a new resource was successfully created. The response should include the created resource in the body and optionally a Location header pointing to its URL.'
    },
    {
      id: 'q-10-2',
      question: 'You are building a public API and want to let any website call it from JavaScript in the browser. Which CORS header value should you use?',
      options: [
        'Access-Control-Allow-Origin: null',
        'Access-Control-Allow-Origin: * (wildcard)',
        'Access-Control-Allow-Origin: (omit the header)',
        'Access-Control-Allow-Credentials: true'
      ],
      correct: 1,
      explanation: 'Access-Control-Allow-Origin: * allows any origin to call your API from the browser. This is appropriate for truly public APIs. Note that the wildcard is incompatible with Access-Control-Allow-Credentials: true — if you need to send cookies or auth headers, you must specify exact origins.'
    }
  ]
};
