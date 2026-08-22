import type { RestapiLesson } from '../restapi-curriculum';

export const lesson06: RestapiLesson = {
  id: 'restapi-06',
  title: 'Requests, Responses, and JSON',
  slug: '06-request-response',
  chapter: 'building',
  order: 6,
  difficulty: 'intermediate',
  readingTime: 13,
  description: 'Structure API requests and responses correctly using JSON, handle content types, and design consistent response formats.',
  sections: [
    {
      type: 'text',
      content: 'The shape of your request and response bodies is part of your API contract. Inconsistent response formats — sometimes wrapping data in an object, sometimes returning raw arrays, sometimes including metadata and sometimes not — force every API consumer to write special-case code. This lesson covers the conventions that make an API predictable and pleasant to use.'
    },
    {
      type: 'heading',
      content: 'JSON as the Standard'
    },
    {
      type: 'text',
      content: 'JSON (JavaScript Object Notation) is the universal language of REST APIs. Every modern HTTP client can produce and consume it, and it maps directly to native data structures in virtually every programming language. To tell the server you are sending JSON and to tell the client to expect JSON, you use the Content-Type and Accept headers.'
    },
    {
      type: 'note',
      title: 'Required headers for JSON',
      content: 'Always send Content-Type: application/json when your request has a body. Always send Accept: application/json to tell the server what format you expect back. Many servers default to JSON anyway, but being explicit prevents surprises.'
    },
    {
      type: 'heading',
      content: 'Consistent Response Structure'
    },
    {
      type: 'text',
      content: 'A response envelope wraps your data in a predictable outer object. Instead of returning a raw user or a raw array, you always return an object with a data key. This gives you room to add metadata, pagination info, and warnings without breaking existing clients.'
    },
    {
      type: 'example',
      title: 'Well-structured successful API response',
      content: 'This response envelope pattern uses a top-level data key for the actual resource and a meta key for request context. Every successful response from this API follows the same shape, so client code can always access response.data regardless of the resource type.',
      code: `// Single resource response
{
  "data": {
    "id": 42,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "role": "admin",
    "createdAt": "2026-01-15T09:30:00Z",
    "updatedAt": "2026-08-19T14:22:00Z"
  },
  "meta": {
    "requestId": "req_8x7y2z",
    "timestamp": "2026-08-19T14:22:31Z"
  }
}`,
      language: 'json',
      output: 'Response always has a "data" key — client code accesses response.data consistently'
    },
    {
      type: 'heading',
      content: 'Paginated List Responses'
    },
    {
      type: 'text',
      content: 'List endpoints should always include pagination metadata. Returning a raw array forces clients to guess whether the list is complete or truncated. A paginated envelope includes the total item count, current page, and navigation links so clients can build proper UIs and know when they have loaded everything.'
    },
    {
      type: 'example',
      title: 'Paginated list response with meta',
      content: 'The pagination object inside meta gives clients everything they need to build page controls and navigate through large datasets. The links object provides pre-built URLs for the previous and next pages, following the JSON:API and GitHub API conventions.',
      code: `// GET /users?page=2&limit=3
{
  "data": [
    { "id": 4, "name": "Diana Prince", "email": "diana@example.com" },
    { "id": 5, "name": "Edward Nygma", "email": "edward@example.com" },
    { "id": 6, "name": "Felicity Smoak", "email": "felicity@example.com" }
  ],
  "meta": {
    "pagination": {
      "total": 47,
      "page": 2,
      "limit": 3,
      "totalPages": 16,
      "hasNextPage": true,
      "hasPrevPage": true
    }
  },
  "links": {
    "self":  "/users?page=2&limit=3",
    "prev":  "/users?page=1&limit=3",
    "next":  "/users?page=3&limit=3",
    "first": "/users?page=1&limit=3",
    "last":  "/users?page=16&limit=3"
  }
}`,
      language: 'json',
      output: 'Clients get total count, navigation links, and page position in one response'
    },
    {
      type: 'heading',
      content: 'Consistent Error Response Format'
    },
    {
      type: 'text',
      content: 'Errors need the same consistency as successes. An error envelope with a fixed shape lets clients write one generic error handler instead of guessing what the error response looks like. Include a machine-readable code (for programmatic handling), a human-readable message (for display or logging), and optional details for validation errors.'
    },
    {
      type: 'example',
      title: 'Consistent error response format',
      content: 'The error object uses a code field with a screaming-snake-case string that client code can switch on programmatically, plus a message field suitable for logging. The details array allows field-level validation errors to be reported all at once rather than one at a time.',
      code: `// 400 Bad Request — validation failure
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request body failed validation",
    "details": [
      { "field": "email", "issue": "must be a valid email address" },
      { "field": "age",   "issue": "must be a positive integer" }
    ]
  },
  "meta": {
    "requestId": "req_9a3b1c",
    "timestamp": "2026-08-19T14:25:00Z"
  }
}

// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "User with id 99 does not exist"
  },
  "meta": {
    "requestId": "req_2x8p4q",
    "timestamp": "2026-08-19T14:26:00Z"
  }
}`,
      language: 'json',
      output: 'Errors always have error.code and error.message — one error handler covers all cases'
    },
    {
      type: 'heading',
      content: 'Where to Put Data: Query Params vs Path Params vs Body'
    },
    {
      type: 'table',
      title: 'When to use each parameter location',
      headers: ['Location', 'Best for', 'Example', 'Notes'],
      rows: [
        ['Path param', 'Resource identity', '/users/42', 'Required, part of the resource address'],
        ['Query param', 'Filtering, sorting, pagination', '/users?role=admin&sort=name', 'Optional, does not change the resource'],
        ['Request body', 'Creating or updating resource data', 'POST body: { name, email }', 'JSON, never used in GET requests'],
        ['Header', 'Auth, content negotiation, request metadata', 'Authorization: Bearer token', 'Not visible in URLs, not cached']
      ]
    },
    {
      type: 'example',
      title: 'fetch with proper headers set',
      content: 'This fetch helper sets all required headers correctly and handles the JSON serialization of the request body. It also reads the Content-Type of the response before deciding whether to parse it as JSON, which prevents errors when the server returns an empty 204 body.',
      code: `// Reusable fetch helper with correct headers
async function apiRequest(method, path, body = null) {
  const options = {
    method,
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + getToken()
    }
  };

  if (body !== null) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  const response = await fetch('https://api.example.com' + path, options);

  // 204 No Content — no body to parse
  if (response.status === 204) return null;

  const data = await response.json();

  if (!response.ok) {
    // Always has error.code and error.message
    throw new Error(data.error.message);
  }

  return data; // { data: {...}, meta: {...} }
}

// Usage examples
const result = await apiRequest('GET', '/users/42');
const user = result.data;

const created = await apiRequest('POST', '/users', {
  name: 'Bob',
  email: 'bob@example.com'
});`,
      language: 'javascript',
      output: `GET  /users/42 -> { data: { id: 42, name: 'Alice' }, meta: {...} }
POST /users    -> { data: { id: 43, name: 'Bob', email: 'bob@example.com' }, meta: {...} }`
    },
    {
      type: 'heading',
      content: 'Date Formatting: Always Use ISO 8601'
    },
    {
      type: 'text',
      content: 'Dates in API responses must be formatted as ISO 8601 strings: "2026-08-19T14:30:00Z". Never use Unix timestamps as plain integers (ambiguous: seconds or milliseconds?), locale-specific strings ("Aug 19, 2026"), or custom formats. ISO 8601 is timezone-aware, sortable as a string, and parseable natively in every language.'
    },
    {
      type: 'heading',
      content: 'null vs Omitting a Field'
    },
    {
      type: 'text',
      content: 'There is a meaningful difference between null (the field exists but has no value) and omitting the field entirely (the field does not apply). Be consistent: if a field is always part of the schema, include it as null rather than omitting it. Omitting fields makes client code more complex because it must handle both missing and null.'
    },
    {
      type: 'tryit',
      title: 'JSON Response Formatter and Validator',
      js: `document.body.innerHTML = '<div><h3>JSON Response Validator</h3><div class=\\"toolbar\\"><button id=\\"format-btn\\">Format + Validate</button><span id=\\"validation-status\\" class=\\"status-badge\\"></span></div><div id=\\"samples\\"></div><div class=\\"panels\\"><div class=\\"panel\\"><div class=\\"panel-label\\">Input JSON</div><textarea id=\\"json-input\\" placeholder=\\"Paste JSON here...\\"></textarea></div><div class=\\"panel\\"><div class=\\"panel-label\\">Formatted Output</div><div id=\\"json-output\\"><span style=\\"color:#94a3b8\\">Enter JSON and click Format + Validate</span></div></div></div><div class=\\"hint\\">Hint: Press Ctrl+Enter in the input to validate</div></div>';

function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\\"/g, '&quot;');
}

function syntaxHighlight(json) {
  var escaped = escHtml(json);
  return escaped.replace(
    /(\\\"(\\\\\\\\u[a-zA-Z0-9]{4}|\\\\\\\\[^u]|[^\\\\\\\\\\\"])*\\\"(\\s*:)?|\\b(true|false|null)\\b|-?\\d+(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)/g,
    function(match) {
      var cls = 'num';
      if (/^\\"/.test(match)) {
        cls = /:$/.test(match) ? 'key' : 'str';
      } else if (/true|false/.test(match)) {
        cls = 'bool';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class=\\"' + cls + '\\">' + match + '</span>';
    }
  );
}

function findLineOfError(text, pos) {
  var lines = text.substring(0, pos).split('\\\\n');
  return lines.length;
}

function validate() {
  var input = document.getElementById('json-input').value.trim();
  var output = document.getElementById('json-output');
  var status = document.getElementById('validation-status');

  if (!input) {
    output.innerHTML = '<span style=\\"color:#94a3b8\\">Enter JSON on the left and click Format + Validate</span>';
    status.textContent = '';
    status.className = 'status-badge';
    return;
  }

  try {
    var parsed = JSON.parse(input);
    var pretty = JSON.stringify(parsed, null, 2);
    output.innerHTML = syntaxHighlight(pretty);
    status.textContent = 'Valid JSON';
    status.className = 'status-badge valid';
  } catch (e) {
    output.innerHTML = '<span style=\\"color:#ef4444\\">' + escHtml(e.message) + '</span>';
    var match = e.message.match(/position (\\d+)/);
    if (match) {
      var lineNum = findLineOfError(input, parseInt(match[1]));
      status.textContent = 'Invalid JSON - error near line ' + lineNum;
    } else {
      status.textContent = 'Invalid JSON - ' + e.message;
    }
    status.className = 'status-badge invalid';
  }
}

document.getElementById('format-btn').addEventListener('click', validate);
document.getElementById('json-input').addEventListener('keydown', function(e) {
  if (e.ctrlKey && e.key === 'Enter') validate();
});

var samples = [
  {
    label: 'Success',
    json: '{\\"data\\":{\\"id\\":42,\\"name\\":\\"Alice Johnson\\",\\"email\\":\\"alice@example.com\\",\\"createdAt\\":\\"2026-08-19T14:00:00Z\\"},\\"meta\\":{\\"requestId\\":\\"req_abc123\\",\\"timestamp\\":\\"2026-08-19T14:22:31Z\\"}}'
  },
  {
    label: 'Error',
    json: '{\\"error\\":{\\"code\\":\\"VALIDATION_ERROR\\",\\"message\\":\\"Validation failed\\",\\"details\\":[{\\"field\\":\\"email\\",\\"issue\\":\\"invalid format\\"}]}}'
  },
  {
    label: 'List',
    json: '{\\"data\\":[{\\"id\\":1,\\"name\\":\\"Alice\\"},{\\"id\\":2,\\"name\\":\\"Bob\\"}],\\"meta\\":{\\"pagination\\":{\\"total\\":2,\\"page\\":1,\\"limit\\":10}}}'
  },
  {
    label: 'Bad JSON',
    json: '{\\"name\\": \\"Alice\\", \\"email\\": \\"alice@example.com\\" \\"role\\": \\"admin\\"}'
  }
];

var samplesDiv = document.getElementById('samples');
samples.forEach(function(s) {
  var btn = document.createElement('button');
  btn.className = 'sample-btn';
  btn.textContent = s.label;
  btn.addEventListener('click', function() {
    document.getElementById('json-input').value = s.json;
    validate();
  });
  samplesDiv.appendChild(btn);
});`,
      css: `body { font-family: system-ui, sans-serif; padding: 14px; background: #f8fafc; }
h3 { color: #1e293b; margin: 0 0 10px 0; font-size: 15px; }
.toolbar { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; flex-wrap: wrap; }
#format-btn { background: #6366f1; color: white; border: none; padding: 7px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 13px; }
#format-btn:hover { background: #4f46e5; }
.status-badge { font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 12px; }
.status-badge.valid { background: #dcfce7; color: #166534; }
.status-badge.invalid { background: #fee2e2; color: #991b1b; }
#samples { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px; }
.sample-btn { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 4px; padding: 4px 10px; font-size: 11px; cursor: pointer; color: #334155; }
.sample-btn:hover { background: #e2e8f0; }
.panels { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.panel { background: white; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; }
.panel-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748b; background: #f8fafc; padding: 6px 12px; border-bottom: 1px solid #e2e8f0; }
#json-input { width: 100%; box-sizing: border-box; height: 240px; padding: 10px 12px; border: none; resize: vertical; font-family: monospace; font-size: 12px; color: #334155; outline: none; }
#json-output { padding: 10px 12px; font-family: monospace; font-size: 12px; line-height: 1.6; white-space: pre-wrap; min-height: 240px; color: #334155; overflow: auto; }
.key { color: #6366f1; font-weight: 600; }
.str { color: #10b981; }
.num { color: #f59e0b; }
.bool { color: #3b82f6; }
.null { color: #94a3b8; font-style: italic; }
.hint { font-size: 11px; color: #94a3b8; margin-top: 6px; }`
    }
  ],
  exercises: [
    {
      id: 'ex-06-1',
      question: 'Which header must you include when sending a JSON body in a POST request?',
      type: 'multiple-choice',
      options: [
        'Accept: application/json',
        'Content-Type: application/json',
        'Authorization: Bearer token',
        'X-Requested-With: XMLHttpRequest'
      ],
      correct: 1,
      explanation: 'Content-Type: application/json tells the server what format the request body is in. Accept: application/json tells the server what format you want the response in — both are useful, but Content-Type is required when sending a JSON body. Without it, many servers will not parse the body.'
    },
    {
      id: 'ex-06-2',
      question: 'You are designing a list endpoint that returns users. Your client needs to know the total count and how many pages exist. Where should this information live in the response?',
      type: 'multiple-choice',
      options: [
        'In a custom HTTP response header like X-Total-Count',
        'Inside a meta.pagination object in the JSON response body',
        'As a separate endpoint: GET /users/count',
        'In the URL path: /users/page/2/of/16'
      ],
      correct: 1,
      explanation: 'Including pagination metadata inside a meta object in the response body is the most common and client-friendly pattern. It keeps all the information in one response, avoids extra requests, and makes the data easily accessible for building pagination UIs. Custom headers are harder to access and not consistently supported by all clients.'
    },
    {
      id: 'ex-06-3',
      question: 'What is the correct format for a date/time value in a REST API response?',
      type: 'multiple-choice',
      options: [
        '1724077200 (Unix timestamp in seconds)',
        'August 19, 2026 2:00 PM',
        '"2026-08-19T14:00:00Z" (ISO 8601)',
        '"19/08/2026 14:00"'
      ],
      correct: 2,
      explanation: 'ISO 8601 format ("2026-08-19T14:00:00Z") is the standard for API dates. It is timezone-aware (the Z means UTC), sortable as a string, unambiguous across locales, and parseable natively as new Date("2026-08-19T14:00:00Z") in JavaScript and equivalent in other languages.'
    }
  ],
  quiz: [
    {
      id: 'q-06-1',
      question: 'A REST API returns a raw JSON array for GET /users. What problem does this create compared to a response envelope?',
      options: [
        'Arrays are not valid JSON',
        'There is no way to add pagination metadata, request IDs, or warnings later without breaking existing clients',
        'Browsers cannot parse JSON arrays, only objects',
        'Arrays are slower to serialize than objects'
      ],
      correct: 1,
      explanation: 'A raw array cannot be extended without a breaking change. If you later need to add total count, pagination links, or a warnings field, you have no place to put them. A response envelope like { "data": [...], "meta": {} } gives you that extension point from day one.'
    },
    {
      id: 'q-06-2',
      question: 'In a consistent error response format, what is the purpose of an error "code" field like "VALIDATION_ERROR"?',
      options: [
        'It duplicates the HTTP status code as a string for redundancy',
        'It provides a machine-readable identifier that client code can switch on to handle different error types programmatically',
        'It is required by the HTTP specification',
        'It replaces the need for an error message'
      ],
      correct: 1,
      explanation: 'The error code is a stable, machine-readable string that client code can use in switch statements or if/else chains to handle different error types differently — for example, showing a different UI for VALIDATION_ERROR vs NOT_FOUND vs UNAUTHORIZED. Human-readable messages change with translations and wording updates; codes should never change.'
    },
    {
      id: 'q-06-3',
      question: 'When should you omit a field from a JSON response rather than setting it to null?',
      options: [
        'Always omit optional fields to reduce response size',
        'Never — always include all fields, null if they have no value',
        'Only when the field is an array',
        'When the field is truly irrelevant to the resource type (not just empty), such as a "companyName" field on a personal user account type'
      ],
      correct: 3,
      explanation: 'The distinction matters: null means the field exists in the schema but currently has no value. Omitting the field means it does not apply to this resource at all. Consistent presence of all schema fields (even as null) makes client code simpler because it never has to check for key existence. Reserve field omission for fields that genuinely do not belong to the resource type.'
    }
  ]
};
