import type { RestapiLesson } from '../restapi-curriculum';

export const lesson04: RestapiLesson = {
  id: 'restapi-04',
  title: 'HTTP Status Codes',
  slug: '04-status-codes',
  chapter: 'http',
  order: 4,
  difficulty: 'beginner',
  readingTime: 11,
  description: 'Learn the meaning of every important HTTP status code category so you can build and debug APIs with confidence.',
  sections: [
    {
      type: 'text',
      content: 'Every HTTP response includes a three-digit status code that tells the client what happened. Status codes are grouped into five categories by their first digit. Learning these categories and the most common codes will make you dramatically faster at debugging API issues.'
    },
    {
      type: 'table',
      title: 'Status code categories at a glance',
      headers: ['Range', 'Category', 'Meaning'],
      rows: [
        ['1xx', 'Informational', 'Request received, processing continues'],
        ['2xx', 'Success', 'Request received, understood, and accepted'],
        ['3xx', 'Redirection', 'Further action needed to complete the request'],
        ['4xx', 'Client Error', 'Request contains bad syntax or cannot be fulfilled'],
        ['5xx', 'Server Error', 'Server failed to fulfill a valid request']
      ]
    },
    {
      type: 'heading',
      content: '2xx Success Codes'
    },
    {
      type: 'example',
      title: 'Express responses with correct 2xx status codes',
      content: 'Each Express route handler demonstrates the correct status code for that type of success response. Using 201 for creation and 204 for deletions makes your API self-documenting — clients know exactly what happened without reading documentation.',
      code: `const express = require('express');
const app = express();
app.use(express.json());

// 200 OK — successful read or update
app.get('/users/:id', (req, res) => {
  const user = { id: req.params.id, name: 'Alice' };
  res.status(200).json(user);
  // or just res.json(user) — 200 is the default
});

// 201 Created — resource successfully created
app.post('/users', (req, res) => {
  const newUser = { id: 42, ...req.body };
  res.status(201).json(newUser);
  // Also set Location header pointing to the new resource
  res.set('Location', '/users/42');
});

// 204 No Content — success but nothing to return
app.delete('/users/:id', (req, res) => {
  // delete from database...
  res.status(204).send();
});

// 202 Accepted — request accepted but processing async
app.post('/reports/generate', (req, res) => {
  // queue the job...
  res.status(202).json({ jobId: 'abc123', status: 'queued' });
});`,
      language: 'javascript',
      output: `GET  /users/1  -> 200 { id: '1', name: 'Alice' }
POST /users    -> 201 { id: 42, name: 'Bob' }
DELETE /users/1-> 204 (no body)
POST /reports  -> 202 { jobId: 'abc123', status: 'queued' }`
    },
    {
      type: 'heading',
      content: '3xx Redirection Codes'
    },
    {
      type: 'text',
      content: '301 Moved Permanently means the resource has a new URL forever — search engines update their indexes and browsers remember the redirect. 302 Found is a temporary redirect — browsers follow it but do not cache it. 304 Not Modified is the response to a conditional GET when the resource has not changed, saving bandwidth.'
    },
    {
      type: 'heading',
      content: '4xx Client Error Codes'
    },
    {
      type: 'text',
      content: '4xx errors mean the client did something wrong — bad data, missing auth, wrong URL, or conflict. These are your responsibility as the API consumer. Read the response body carefully; well-designed APIs include error details there.'
    },
    {
      type: 'example',
      title: 'Consistent error response format',
      content: 'A consistent error response structure lets API consumers handle errors programmatically. Every error response includes a machine-readable error code, a human-readable message, and optional details — this format is used by APIs like Stripe, GitHub, and Twilio.',
      code: `// Express error response helper
function sendError(res, status, code, message, details = null) {
  const body = { error: code, message };
  if (details) body.details = details;
  return res.status(status).json(body);
}

// 400 Bad Request — missing or invalid fields
app.post('/users', (req, res) => {
  if (!req.body.email) {
    return sendError(res, 400, 'VALIDATION_ERROR',
      'email is required',
      [{ field: 'email', issue: 'missing' }]
    );
  }
  // ...
});

// 401 Unauthorized — no credentials provided
app.get('/profile', (req, res) => {
  if (!req.headers.authorization) {
    return sendError(res, 401, 'UNAUTHORIZED',
      'Authentication required. Provide a Bearer token.'
    );
  }
});

// 403 Forbidden — authenticated but not allowed
app.delete('/users/:id', (req, res) => {
  if (req.user.role !== 'admin') {
    return sendError(res, 403, 'FORBIDDEN',
      'Only admins can delete users'
    );
  }
});

// 404 Not Found
app.get('/users/:id', (req, res) => {
  const user = db.findById(req.params.id);
  if (!user) {
    return sendError(res, 404, 'NOT_FOUND',
      'User not found'
    );
  }
  res.json(user);
});`,
      language: 'javascript',
      output: `400: { "error": "VALIDATION_ERROR", "message": "email is required", "details": [...] }
401: { "error": "UNAUTHORIZED", "message": "Authentication required..." }
403: { "error": "FORBIDDEN", "message": "Only admins can delete users" }
404: { "error": "NOT_FOUND", "message": "User not found" }`
    },
    {
      type: 'heading',
      content: '401 vs 403 — The Critical Distinction'
    },
    {
      type: 'text',
      content: '401 Unauthorized means "I do not know who you are — please authenticate." 403 Forbidden means "I know exactly who you are, but you are not allowed to do this." Always use 401 when no credentials were provided or they are invalid, and 403 when the authenticated user simply lacks permission.'
    },
    {
      type: 'heading',
      content: '5xx Server Error Codes'
    },
    {
      type: 'text',
      content: '5xx errors mean the server failed to handle a valid request. 500 Internal Server Error is the catch-all for unexpected failures. 502 Bad Gateway means an upstream service returned an invalid response. 503 Service Unavailable means the server is overloaded or down for maintenance. 504 Gateway Timeout means an upstream service did not respond in time. 429 Too Many Requests (technically 4xx) means the client has exceeded a rate limit.'
    },
    {
      type: 'table',
      title: 'Essential status codes reference',
      headers: ['Code', 'Name', 'When to use'],
      rows: [
        ['200', 'OK', 'Successful GET, PUT, PATCH'],
        ['201', 'Created', 'Successful POST that creates a resource'],
        ['204', 'No Content', 'Successful DELETE or PUT with no body'],
        ['301', 'Moved Permanently', 'URL has permanently changed'],
        ['304', 'Not Modified', 'Resource unchanged since last fetch (caching)'],
        ['400', 'Bad Request', 'Invalid input, missing fields, bad JSON'],
        ['401', 'Unauthorized', 'No credentials or invalid credentials'],
        ['403', 'Forbidden', 'Authenticated but not permitted'],
        ['404', 'Not Found', 'Resource does not exist at this URL'],
        ['409', 'Conflict', 'Resource already exists (e.g., duplicate email)'],
        ['422', 'Unprocessable Entity', 'Validation failed on syntactically valid JSON'],
        ['429', 'Too Many Requests', 'Rate limit exceeded'],
        ['500', 'Internal Server Error', 'Unexpected server crash or bug'],
        ['502', 'Bad Gateway', 'Upstream service returned bad response'],
        ['503', 'Service Unavailable', 'Server temporarily down or overloaded'],
        ['504', 'Gateway Timeout', 'Upstream service timed out']
      ]
    },
    {
      type: 'tryit',
      title: 'Status Code Explorer',
      js: `var codes = [
  { code: 200, name: 'OK', cat: '2xx', color: '#10b981', desc: 'Request succeeded. Used for GET, PUT, PATCH responses.', when: 'Return when a GET, PUT, or PATCH request completes successfully with a response body.' },
  { code: 201, name: 'Created', cat: '2xx', color: '#10b981', desc: 'A new resource was successfully created.', when: 'Return after a POST request successfully creates a new resource. Include a Location header.' },
  { code: 204, name: 'No Content', cat: '2xx', color: '#10b981', desc: 'Success but nothing to return in the body.', when: 'Return after a successful DELETE, or after PUT/PATCH when you choose not to return the updated resource.' },
  { code: 301, name: 'Moved Permanently', cat: '3xx', color: '#3b82f6', desc: 'Resource has permanently moved to a new URL.', when: 'When a resource has permanently moved. Include a Location header with the new URL.' },
  { code: 302, name: 'Found', cat: '3xx', color: '#3b82f6', desc: 'Temporary redirect to another URL.', when: 'Temporary redirect. The client should continue using the original URL for future requests.' },
  { code: 304, name: 'Not Modified', cat: '3xx', color: '#3b82f6', desc: 'Resource has not changed since the last request.', when: 'Response to conditional GET when the ETag or Last-Modified matches. Saves bandwidth.' },
  { code: 400, name: 'Bad Request', cat: '4xx', color: '#f59e0b', desc: 'Invalid request syntax or parameters.', when: 'When the request body is malformed, required fields are missing, or query params are invalid.' },
  { code: 401, name: 'Unauthorized', cat: '4xx', color: '#f59e0b', desc: 'No credentials or invalid credentials provided.', when: 'When the request lacks an Authorization header or the token is invalid/expired.' },
  { code: 403, name: 'Forbidden', cat: '4xx', color: '#f59e0b', desc: 'Authenticated but not allowed to perform this action.', when: 'When a valid, authenticated user lacks permission for the requested resource or action.' },
  { code: 404, name: 'Not Found', cat: '4xx', color: '#f59e0b', desc: 'No resource found at this URL.', when: 'When the requested resource does not exist. Also use for privacy — hide that restricted resources exist.' },
  { code: 409, name: 'Conflict', cat: '4xx', color: '#f59e0b', desc: 'Request conflicts with current state.', when: 'When creating a resource with a duplicate unique field (e.g., email already exists).' },
  { code: 422, name: 'Unprocessable Entity', cat: '4xx', color: '#f59e0b', desc: 'Validation failed on structurally valid data.', when: 'When JSON is valid but field values fail business logic validation (invalid email format, negative price).' },
  { code: 429, name: 'Too Many Requests', cat: '4xx', color: '#f59e0b', desc: 'Rate limit exceeded.', when: 'When the client sends too many requests. Include Retry-After header indicating when to retry.' },
  { code: 500, name: 'Internal Server Error', cat: '5xx', color: '#ef4444', desc: 'Unexpected server-side error.', when: 'When something unexpected crashes your server. Never expose internal details in the response body.' },
  { code: 502, name: 'Bad Gateway', cat: '5xx', color: '#ef4444', desc: 'Upstream service returned an invalid response.', when: 'When a proxy or gateway receives an invalid response from an upstream service.' },
  { code: 503, name: 'Service Unavailable', cat: '5xx', color: '#ef4444', desc: 'Server temporarily unavailable.', when: 'During maintenance windows or when the server is overloaded. Include Retry-After if possible.' },
  { code: 504, name: 'Gateway Timeout', cat: '5xx', color: '#ef4444', desc: 'Upstream service did not respond in time.', when: 'When a reverse proxy times out waiting for an upstream service to respond.' }
];

function render(list) {
  var grid = document.getElementById('grid');
  grid.innerHTML = list.map(function(c) {
    return '<div class="code-card" style="border-top:3px solid ' + c.color + '" data-code="' + c.code + '">' +
      '<div class="code-num" style="color:' + c.color + '">' + c.code + '</div>' +
      '<div class="code-name">' + c.name + '</div>' +
      '<div class="code-cat" style="color:' + c.color + '">' + c.cat + '</div>' +
      '</div>';
  }).join('');
  grid.querySelectorAll('.code-card').forEach(function(card) {
    card.addEventListener('click', function() {
      var code = parseInt(card.dataset.code);
      var item = codes.find(function(c) { return c.code === code; });
      if (!item) return;
      document.getElementById('detail').innerHTML =
        '<div class="detail-header" style="background:' + item.color + '">' +
        '<span class="detail-code">' + item.code + '</span> ' +
        '<span class="detail-name">' + item.name + '</span>' +
        '</div>' +
        '<div class="detail-body">' +
        '<p class="detail-desc">' + item.desc + '</p>' +
        '<div class="detail-when"><strong>When to use:</strong> ' + item.when + '</div>' +
        '</div>';
    });
  });
}

document.getElementById('search').addEventListener('input', function() {
  var q = this.value.toLowerCase();
  var filtered = codes.filter(function(c) {
    return String(c.code).includes(q) || c.name.toLowerCase().includes(q) || c.cat.includes(q);
  });
  render(filtered);
});

render(codes);`,
      css: `body { font-family: system-ui, sans-serif; padding: 16px; background: #f8fafc; }
h3 { color: #1e293b; margin: 0 0 10px 0; font-size: 15px; }
#search { width: 100%; box-sizing: border-box; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; margin-bottom: 12px; }
#grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); gap: 8px; margin-bottom: 14px; }
.code-card { background: white; border-radius: 6px; padding: 10px 8px; text-align: center; cursor: pointer; border: 1px solid #e2e8f0; transition: transform 0.1s, box-shadow 0.1s; }
.code-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
.code-num { font-size: 18px; font-weight: 800; }
.code-name { font-size: 10px; color: #475569; font-weight: 600; margin-top: 2px; }
.code-cat { font-size: 10px; font-weight: 700; margin-top: 1px; }
#detail { background: white; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; min-height: 60px; }
.detail-header { padding: 10px 14px; color: white; display: flex; align-items: center; gap: 10px; }
.detail-code { font-size: 22px; font-weight: 800; }
.detail-name { font-size: 16px; font-weight: 600; }
.detail-body { padding: 12px 14px; }
.detail-desc { margin: 0 0 8px 0; color: #334155; font-size: 13px; }
.detail-when { background: #f1f5f9; border-radius: 6px; padding: 8px 12px; font-size: 12px; color: #475569; line-height: 1.5; }`
    }
  ],
  exercises: [
    {
      id: 'ex-04-1',
      question: 'A user tries to access a resource but forgot to include their token. Which status code should the API return?',
      type: 'multiple-choice',
      options: [
        '403 Forbidden',
        '404 Not Found',
        '401 Unauthorized',
        '400 Bad Request'
      ],
      correct: 2,
      explanation: '401 Unauthorized is correct when authentication credentials are missing or invalid. The server is saying "I do not know who you are — please provide credentials." 403 would be used if the user was authenticated but lacked permission.'
    },
    {
      id: 'ex-04-2',
      question: 'A POST request creates a user but the email already exists in the database. Which status code should the API return?',
      type: 'multiple-choice',
      options: [
        '400 Bad Request',
        '409 Conflict',
        '422 Unprocessable Entity',
        '500 Internal Server Error'
      ],
      correct: 1,
      explanation: '409 Conflict is the correct code when a resource already exists and the request conflicts with the current state. 400 is for malformed requests, 422 is for validation failures on valid-format data, and 500 is for unexpected server errors.'
    },
    {
      id: 'ex-04-3',
      question: 'After successfully deleting a resource, what status code and response body should the API typically return?',
      type: 'multiple-choice',
      options: [
        '200 OK with a confirmation message in the body',
        '201 Created with the deleted resource data',
        '204 No Content with no response body',
        '202 Accepted with a job ID'
      ],
      correct: 2,
      explanation: '204 No Content is the standard response for a successful DELETE. There is nothing meaningful to return — the resource is gone. 200 OK with a body is also acceptable if you want to return the deleted resource for reference, but 204 is the most common convention.'
    }
  ],
  quiz: [
    {
      id: 'q-04-1',
      question: 'What is the difference between 401 and 403?',
      options: [
        '401 means not authenticated; 403 means authenticated but not authorized',
        '401 means resource not found; 403 means server error',
        '401 is for GET requests; 403 is for POST requests',
        '401 and 403 have the same meaning and are interchangeable'
      ],
      correct: 0,
      explanation: '401 means the request has no valid authentication credentials — the server does not know who you are. 403 means the server knows exactly who you are (you are authenticated) but you do not have permission to access this resource.'
    },
    {
      id: 'q-04-2',
      question: 'Which status code indicates a rate limit has been exceeded?',
      options: [
        '503 Service Unavailable',
        '409 Conflict',
        '429 Too Many Requests',
        '400 Bad Request'
      ],
      correct: 2,
      explanation: '429 Too Many Requests is the standard code for rate limiting. Well-designed APIs include a Retry-After header indicating when the client may try again, and X-RateLimit headers showing the current limit and remaining requests.'
    },
    {
      id: 'q-04-3',
      question: 'Your API returns 500 for all errors. Why is this a problem?',
      options: [
        'It is not a problem — 500 is the correct code for all errors',
        'It makes debugging harder because clients cannot tell if the error was their fault or the server\'s',
        '500 is a 5xx code and browsers automatically retry these, which causes duplicate operations',
        '500 responses are always cached by proxies'
      ],
      correct: 1,
      explanation: 'Returning 500 for all errors conflates server bugs with client mistakes. Clients cannot distinguish "I sent bad data" (4xx — fixable by the client) from "the server crashed" (5xx — a server problem). Proper status codes let clients handle errors appropriately and help operators debug issues faster.'
    }
  ]
};
