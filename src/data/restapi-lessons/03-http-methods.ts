import type { RestapiLesson } from '../restapi-curriculum';

export const lesson03: RestapiLesson = {
  id: 'restapi-03',
  title: 'HTTP Methods',
  slug: '03-http-methods',
  chapter: 'http',
  order: 3,
  difficulty: 'beginner',
  readingTime: 12,
  description: 'Master GET, POST, PUT, PATCH, and DELETE — the five verbs that define every operation in a REST API.',
  sections: [
    {
      type: 'text',
      content: 'HTTP methods are the verbs of the REST API language. They tell the server what action to perform on a resource. Choosing the right method is not just convention — it determines how browsers cache requests, how proxies handle them, and whether clients can safely retry them.'
    },
    {
      type: 'heading',
      content: 'Safe and Idempotent Methods'
    },
    {
      type: 'text',
      content: 'Two key properties define how methods behave when repeated. A safe method does not modify any server state (read-only). An idempotent method can be called multiple times with the same result — calling DELETE on /users/1 ten times is the same as calling it once.'
    },
    {
      type: 'table',
      title: 'HTTP methods: safe and idempotent properties',
      headers: ['Method', 'Safe', 'Idempotent', 'Has Body', 'Common Use'],
      rows: [
        ['GET', 'Yes', 'Yes', 'No', 'Read resource(s)'],
        ['POST', 'No', 'No', 'Yes', 'Create resource'],
        ['PUT', 'No', 'Yes', 'Yes', 'Replace resource'],
        ['PATCH', 'No', 'No*', 'Yes', 'Partial update'],
        ['DELETE', 'No', 'Yes', 'No', 'Remove resource'],
        ['HEAD', 'Yes', 'Yes', 'No', 'Check resource metadata'],
        ['OPTIONS', 'Yes', 'Yes', 'No', 'Check allowed methods']
      ]
    },
    {
      type: 'heading',
      content: 'GET — Read Data'
    },
    {
      type: 'text',
      content: 'GET is the most common HTTP method. It retrieves a resource or list of resources. GET requests must never change server state, which is why browsers cache them, search engines index them, and users can bookmark them.'
    },
    {
      type: 'example',
      title: 'GET requests — list and single resource',
      content: 'GET requests pass all parameters through the URL — either as path segments for specific resource IDs or as query parameters for filtering and pagination. This example shows both patterns and how to check the response status before processing the data.',
      code: `// GET all users (list)
const res = await fetch('https://api.example.com/users');
const users = await res.json();
// [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]

// GET a single user by ID
const res2 = await fetch('https://api.example.com/users/1');
const user = await res2.json();
// { id: 1, name: 'Alice', email: 'alice@example.com' }

// GET with query parameters (filter + paginate)
const res3 = await fetch('https://api.example.com/users?role=admin&page=1&limit=10');
const filtered = await res3.json();
// { data: [...], total: 3, page: 1 }`,
      language: 'javascript',
      output: `[{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
{ id: 1, name: 'Alice', email: 'alice@example.com' }
{ data: [...], total: 3, page: 1 }`
    },
    {
      type: 'heading',
      content: 'POST — Create a Resource'
    },
    {
      type: 'text',
      content: 'POST sends data to the server to create a new resource. Each POST request creates a new resource, so it is not idempotent — posting the same data twice creates two resources. The server assigns the new resource an ID and typically returns it in the response with status 201 Created.'
    },
    {
      type: 'example',
      title: 'POST — creating a new user',
      content: 'POST requests require the Content-Type: application/json header and a JSON-serialized body. The server creates a new resource, assigns it an ID, and returns the full created object. The 201 status code and Location header in the response tell the client exactly where to find the new resource.',
      code: `const response = await fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-token-here'
  },
  body: JSON.stringify({
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'user'
  })
});

console.log(response.status); // 201
const created = await response.json();
console.log(created);`,
      language: 'javascript',
      output: `201
{ id: 42, name: 'Alice Johnson', email: 'alice@example.com', role: 'user', createdAt: '2026-08-19T14:00:00Z' }`
    },
    {
      type: 'heading',
      content: 'PUT — Replace a Resource'
    },
    {
      type: 'text',
      content: 'PUT replaces an entire resource with the data you send. If you PUT a user object with only the name field, the email and other fields will be removed. PUT is idempotent: putting the same data multiple times always results in the same final state.'
    },
    {
      type: 'heading',
      content: 'PATCH — Partial Update'
    },
    {
      type: 'text',
      content: 'PATCH updates only the fields you specify. Send only the fields you want to change — the rest stay as they are. This is more efficient than PUT for large objects and safer when concurrent updates might occur.'
    },
    {
      type: 'example',
      title: 'PUT vs PATCH — the key difference',
      content: 'This comparison demonstrates why choosing between PUT and PATCH matters. PUT replaces the entire resource so any fields omitted from the body will be lost or reset to null, while PATCH merges your changes with the existing resource, leaving unspecified fields untouched.',
      code: `// Current state: { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' }

// PUT — replaces ENTIRE resource (email and role will be lost!)
await fetch('https://api.example.com/users/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Alice Johnson' })
});
// Result: { id: 1, name: 'Alice Johnson', email: null, role: null }

// PATCH — updates ONLY specified fields (email and role unchanged)
await fetch('https://api.example.com/users/1', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Alice Johnson' })
});
// Result: { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' }`,
      language: 'javascript',
      output: `PUT:   { id: 1, name: 'Alice Johnson', email: null, role: null }
PATCH: { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' }`
    },
    {
      type: 'heading',
      content: 'DELETE — Remove a Resource'
    },
    {
      type: 'example',
      title: 'DELETE — removing a resource',
      content: 'DELETE requests identify the resource to delete via the URL path and typically return 204 No Content on success, which means the operation succeeded but there is nothing to return. Deleting the same resource a second time should return 404 Not Found since the resource no longer exists.',
      code: `const response = await fetch('https://api.example.com/users/42', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer your-token-here'
  }
});

console.log(response.status); // 204

// Attempting to delete again:
const response2 = await fetch('https://api.example.com/users/42', {
  method: 'DELETE',
  headers: { 'Authorization': 'Bearer your-token-here' }
});
console.log(response2.status); // 404 — already deleted`,
      language: 'javascript',
      output: `204
404`
    },
    {
      type: 'heading',
      content: 'HEAD and OPTIONS'
    },
    {
      type: 'text',
      content: 'HEAD returns only the response headers for a URL without the body — useful for checking if a resource exists or checking its size before downloading. OPTIONS returns the HTTP methods that are allowed for a resource — browsers send an OPTIONS preflight request before any cross-origin POST/PUT/DELETE to check CORS permissions.'
    },
    {
      type: 'tryit',
      title: 'HTTP Method Tester',
      js: `var data = {
  GET: {
    color: '#10b981',
    url: 'GET /users  or  GET /users/1',
    body: '(no body)',
    response: '{ "id": 1, "name": "Alice", "email": "alice@example.com" }',
    status: '200 OK',
    desc: 'Retrieves a resource or list. Safe and idempotent. All params go in the URL.'
  },
  POST: {
    color: '#6366f1',
    url: 'POST /users',
    body: '{ "name": "Alice", "email": "alice@example.com" }',
    response: '{ "id": 42, "name": "Alice", "email": "alice@example.com" }',
    status: '201 Created',
    desc: 'Creates a new resource. Not idempotent — sending twice creates two records.'
  },
  PUT: {
    color: '#f59e0b',
    url: 'PUT /users/1',
    body: '{ "name": "Alice Johnson", "email": "alice@example.com", "role": "admin" }',
    response: '{ "id": 1, "name": "Alice Johnson", "email": "alice@example.com", "role": "admin" }',
    status: '200 OK',
    desc: 'Replaces the full resource. Omitted fields are removed or nulled. Idempotent.'
  },
  PATCH: {
    color: '#8b5cf6',
    url: 'PATCH /users/1',
    body: '{ "name": "Alice Johnson" }',
    response: '{ "id": 1, "name": "Alice Johnson", "email": "alice@example.com" }',
    status: '200 OK',
    desc: 'Updates only specified fields. Other fields remain unchanged. More surgical than PUT.'
  },
  DELETE: {
    color: '#ef4444',
    url: 'DELETE /users/1',
    body: '(no body)',
    response: '(no body)',
    status: '204 No Content',
    desc: 'Removes the resource. Returns 204 on success. Idempotent — deleting twice is safe.'
  }
};

var active = null;

function show(method) {
  active = method;
  var d = data[method];
  document.getElementById('panel').innerHTML = [
    '<div class="method-header" style="background:' + d.color + '">',
    '  <span class="method-name">' + method + '</span>',
    '  <span class="status-pill">' + d.status + '</span>',
    '</div>',
    '<div class="panel-body">',
    '  <div class="field"><span class="field-label">URL Pattern</span><code>' + d.url + '</code></div>',
    '  <div class="field"><span class="field-label">Request Body</span><code>' + d.body + '</code></div>',
    '  <div class="field"><span class="field-label">Response</span><code>' + d.response + '</code></div>',
    '  <div class="field"><span class="field-label">Use Case</span><span class="desc">' + d.desc + '</span></div>',
    '</div>'
  ].join('');
  document.querySelectorAll('.method-btn').forEach(function(btn) {
    btn.style.opacity = btn.dataset.method === method ? '1' : '0.5';
    btn.style.transform = btn.dataset.method === method ? 'scale(1.06)' : 'scale(1)';
  });
}

var btns = document.getElementById('buttons');
Object.keys(data).forEach(function(m) {
  var btn = document.createElement('button');
  btn.className = 'method-btn';
  btn.textContent = m;
  btn.dataset.method = m;
  btn.style.background = data[m].color;
  btn.addEventListener('click', function() { show(m); });
  btns.appendChild(btn);
});

show('GET');`,
      css: `body { font-family: system-ui, sans-serif; padding: 16px; background: #f8fafc; }
h3 { color: #1e293b; margin: 0 0 12px 0; font-size: 15px; }
#buttons { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
.method-btn { color: white; border: none; padding: 9px 16px; border-radius: 6px; font-weight: 700; cursor: pointer; font-size: 13px; transition: transform 0.15s, opacity 0.15s; letter-spacing: 0.5px; }
.method-btn:hover { opacity: 1 !important; }
#panel { background: white; border-radius: 10px; border: 1px solid #e2e8f0; overflow: hidden; min-height: 120px; }
.method-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; }
.method-name { color: white; font-size: 18px; font-weight: 800; letter-spacing: 1px; }
.status-pill { background: rgba(255,255,255,0.25); color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; }
.panel-body { padding: 14px 16px; }
.field { margin-bottom: 10px; }
.field-label { display: block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #94a3b8; margin-bottom: 3px; }
code { display: block; background: #f1f5f9; border-radius: 4px; padding: 6px 10px; font-size: 12px; font-family: monospace; color: #334155; }
.desc { font-size: 13px; color: #475569; line-height: 1.5; }`
    }
  ],
  exercises: [
    {
      id: 'ex-03-1',
      question: 'You need to update just the email address of a user without affecting other fields. Which HTTP method should you use?',
      type: 'multiple-choice',
      options: [
        'PUT, because it is the standard update method',
        'POST, because you are sending new data to the server',
        'PATCH, because it updates only the specified fields',
        'GET, because you are requesting a change'
      ],
      correct: 2,
      explanation: 'PATCH is designed for partial updates — it only changes the fields you include in the request body. PUT would replace the entire resource, potentially nulling out fields you did not include. POST creates new resources, and GET only reads data.'
    },
    {
      id: 'ex-03-2',
      question: 'What does "idempotent" mean in the context of HTTP methods?',
      type: 'multiple-choice',
      options: [
        'The request has no body',
        'The same request can be made multiple times with the same result as making it once',
        'The method does not change server state',
        'The response is always cached by the browser'
      ],
      correct: 1,
      explanation: 'An idempotent method produces the same server state regardless of how many times you call it with the same inputs. GET, PUT, and DELETE are idempotent. POST is not — sending the same POST twice typically creates two records.'
    },
    {
      id: 'ex-03-3',
      question: 'A browser is about to send a cross-origin fetch with method POST. What does it send first to check permissions?',
      type: 'multiple-choice',
      options: [
        'A GET request to check the resource exists',
        'A HEAD request to verify the server is reachable',
        'An OPTIONS preflight request to check CORS permissions',
        'A POST request with an empty body'
      ],
      correct: 2,
      explanation: 'For cross-origin requests with methods other than simple GET/POST or with custom headers, browsers first send an OPTIONS preflight request. The server must respond with appropriate CORS headers (Access-Control-Allow-Methods, etc.) before the browser sends the actual request.'
    }
  ],
  quiz: [
    {
      id: 'q-03-1',
      question: 'Which HTTP method is both safe AND idempotent?',
      options: [
        'POST',
        'DELETE',
        'PATCH',
        'GET'
      ],
      correct: 3,
      explanation: 'GET is both safe (it does not modify server state) and idempotent (calling it multiple times returns the same result). DELETE is idempotent but not safe. POST is neither. PATCH is technically neither in the HTTP spec.'
    },
    {
      id: 'q-03-2',
      question: 'What HTTP status code should a successful POST request that creates a new resource return?',
      options: [
        '200 OK',
        '201 Created',
        '204 No Content',
        '202 Accepted'
      ],
      correct: 1,
      explanation: '201 Created is the correct status code when a POST request successfully creates a new resource. It should also include a Location header pointing to the new resource. 200 OK is for successful reads or updates, and 204 No Content is for successful requests that return no body (like DELETE).'
    },
    {
      id: 'q-03-3',
      question: 'What is the main risk of using PUT instead of PATCH to update a user\'s name?',
      options: [
        'PUT is slower than PATCH for large requests',
        'PUT requires a different Content-Type header than PATCH',
        'Fields not included in the PUT body may be deleted or nulled on the server',
        'PUT cannot be used with Bearer token authentication'
      ],
      correct: 2,
      explanation: 'PUT replaces the entire resource. If you send PUT /users/1 with only { "name": "Bob" }, the server is expected to replace the user record with just that name, potentially removing the email, role, and other fields. PATCH safely updates only the specified fields.'
    }
  ]
};
