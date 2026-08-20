import type { NodejsLesson } from '../nodejs-curriculum';

export const nodejsHttpServerLesson: NodejsLesson = {
  id: 'nodejs-http',
  title: 'HTTP Server',
  slug: 'http-server',
  chapter: 'server',
  order: 6,
  difficulty: 'intermediate',
  readingTime: 12,
  description: 'Create HTTP servers with Node.js built-in http module, handle requests and responses, status codes.',
  sections: [
    {
      type: 'text',
      content: 'Node.js has a built-in http module that lets you create web servers without any external dependencies. While frameworks like Express build on top of it, understanding the raw http module helps you understand what those frameworks do under the hood.',
    },
    {
      type: 'heading',
      content: 'Creating a Basic Server',
    },
    {
      type: 'example',
      title: 'Your first HTTP server',
      content: 'Creates a minimal HTTP server using Node.js\'s built-in http module. Shows how to handle every request with a callback that receives req and res objects.',
      language: 'javascript',
      code: `const http = require('http');

// createServer takes a callback called for every request
const server = http.createServer(function(req, res) {
  // req = incoming request (IncomingMessage)
  // res = outgoing response (ServerResponse)

  console.log(req.method, req.url);  // GET /

  // Set response headers
  res.setHeader('Content-Type', 'text/plain');
  res.statusCode = 200;

  // Send the response body and end
  res.end('Hello, World!');
});

// Start listening on port 3000
server.listen(3000, function() {
  console.log('Server running at http://localhost:3000');
});`,
      output: 'Server running at http://localhost:3000',
    },
    {
      type: 'heading',
      content: 'Routing and Responses',
    },
    {
      type: 'example',
      title: 'Routing requests by URL and method',
      content: 'Shows how to manually implement routing in the raw http module by branching on req.method and req.url. Also demonstrates reading a streamed POST body.',
      language: 'javascript',
      code: `const http = require('http');

const server = http.createServer(function(req, res) {
  const { method, url } = req;

  // JSON response helper
  function sendJson(statusCode, data) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = statusCode;
    res.end(JSON.stringify(data));
  }

  // Route: GET /
  if (method === 'GET' && url === '/') {
    sendJson(200, { message: 'Welcome to the API', version: '1.0' });
    return;
  }

  // Route: GET /users
  if (method === 'GET' && url === '/users') {
    const users = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];
    sendJson(200, users);
    return;
  }

  // Route: POST /users (read body)
  if (method === 'POST' && url === '/users') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const user = JSON.parse(body);
        sendJson(201, { created: true, user });
      } catch {
        sendJson(400, { error: 'Invalid JSON' });
      }
    });
    return;
  }

  // 404 for everything else
  sendJson(404, { error: 'Not found', path: url });
});

server.listen(3000);`,
    },
    {
      type: 'table',
      title: 'Common HTTP Status Codes',
      headers: ['Code', 'Name', 'When to use'],
      rows: [
        ['200', 'OK', 'Successful GET, PUT, PATCH'],
        ['201', 'Created', 'Successful POST that created a resource'],
        ['204', 'No Content', 'Successful DELETE (no body to return)'],
        ['400', 'Bad Request', 'Invalid input from client'],
        ['401', 'Unauthorized', 'Not logged in'],
        ['403', 'Forbidden', 'Logged in but no permission'],
        ['404', 'Not Found', 'Resource does not exist'],
        ['500', 'Internal Server Error', 'Something crashed on the server'],
      ],
    },
    {
      type: 'note',
      title: 'Why use Express instead of raw http?',
      content: 'The raw http module works but requires manual routing, body parsing, header management, and error handling. Express adds a clean abstraction layer for all of this. For any real app, use Express or another framework. The raw http module is useful for understanding fundamentals.',
    },
    {
      type: 'tryit',
      title: 'HTTP Server Simulator',
      css: `body{font-family:system-ui,sans-serif;padding:14px;margin:0;background:#f0f2f5;}
.server{background:#1e293b;color:#e2e8f0;border-radius:10px;padding:16px;margin-bottom:12px;}
.server h3{margin:0 0 8px;font-size:14px;color:#94a3b8;}
.request{background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:10px;margin-bottom:8px;font-size:13px;}
.method{display:inline-block;background:#3b82f6;color:#fff;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:bold;margin-right:8px;}
.method.post{background:#16a34a;}
.method.delete{background:#dc2626;}
.status{float:right;font-size:12px;color:#666;}
.status.ok{color:#16a34a;}
.status.err{color:#dc2626;}
.btn{background:#1e293b;color:#fff;border:none;border-radius:6px;padding:7px 16px;font-size:13px;cursor:pointer;margin:4px;}
.btn:hover{background:#334155;}`,
      js: `var requests = [];
var reqCount = 0;

function makeRequest(method, path) {
  reqCount++;
  var status = '200 OK';
  var response = '';
  if (path === '/') { response = '{"message":"Welcome to the API","version":"1.0"}'; }
  else if (path === '/users' && method === 'GET') { response = '[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}]'; }
  else if (path === '/users' && method === 'POST') { status = '201 Created'; response = '{"created":true,"user":{"id":3,"name":"Charlie"}}'; }
  else if (path === '/users/1' && method === 'DELETE') { status = '204 No Content'; response = '(no body)'; }
  else if (path === '/health') { response = '{"status":"ok","uptime":' + reqCount * 2 + '}'; }
  else { status = '404 Not Found'; response = '{"error":"Not found","path":"' + path + '"}'; }

  requests.unshift({ method: method, path: path, status: status, response: response });
  if (requests.length > 5) requests.pop();
  render();
}

function render() {
  var rows = requests.map(function(r) {
    var isOk = r.status.startsWith('2');
    var cls = r.method === 'GET' ? 'method' : r.method === 'DELETE' ? 'method delete' : 'method post';
    var statusCls = 'status ' + (isOk ? 'ok' : 'err');
    return '<div class="request">' +
      '<span class="' + cls + '">' + r.method + '</span>' +
      r.path +
      '<span class="' + statusCls + '">' + r.status + '</span>' +
      '<br><small style="color:#666;font-family:monospace">' + r.response + '</small>' +
      '</div>';
  }).join('');

  document.getElementById('output').innerHTML =
    '<div class="server">' +
    '<h3>Node.js HTTP Server - port 3000</h3>' +
    '<div style="display:flex;flex-wrap:wrap;margin-bottom:10px">' +
    '<button class="btn" data-method="GET" data-path="/">GET /</button>' +
    '<button class="btn" data-method="GET" data-path="/users">GET /users</button>' +
    '<button class="btn" data-method="POST" data-path="/users">POST /users</button>' +
    '<button class="btn" data-method="DELETE" data-path="/users/1">DELETE /users/1</button>' +
    '<button class="btn" data-method="GET" data-path="/health">GET /health</button>' +
    '<button class="btn" data-method="GET" data-path="/missing">GET /missing</button>' +
    '</div>' +
    (rows || '<div style="color:#64748b;font-size:13px">Click a button to send a request...</div>') +
    '</div>';

  document.querySelectorAll('.btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      makeRequest(btn.getAttribute('data-method'), btn.getAttribute('data-path'));
    });
  });
}

render();`,
    },
  ],
  exercises: [
    {
      id: 'nodejs-http-1',
      question: 'What does res.end() do in an HTTP server?',
      type: 'multiple-choice',
      options: [
        'Closes the server permanently',
        'Sends the response body and signals the response is complete',
        'Ends the current Node.js process',
        'Removes the request from the queue',
      ],
      correct: 1,
      explanation: 'res.end() sends the optional response body and signals to Node.js that the response is complete. Without calling res.end() (or res.send() in Express), the client will hang waiting for the response to finish.',
    },
    {
      id: 'nodejs-http-2',
      question: 'What status code should a POST request return when it successfully creates a resource?',
      type: 'multiple-choice',
      options: ['200 OK', '201 Created', '204 No Content', '202 Accepted'],
      correct: 1,
      explanation: '201 Created is the correct status code for a successful POST that results in the creation of a new resource. 200 OK is for successful GET/PUT/PATCH requests. 204 No Content is for DELETE when there is nothing to return.',
    },
  ],
  quiz: [
    {
      id: 'nodejs-http-q1',
      question: 'How do you read the body of a POST request in Node.js raw http module?',
      options: [
        'const body = req.body - it is available directly',
        'Listen for "data" events on req to accumulate chunks, then process in the "end" event',
        'Use req.read() to get the body synchronously',
        'Call await req.json() to parse the body',
      ],
      correct: 1,
      explanation: 'In raw Node.js http, the request body arrives as a stream. You must listen for "data" events to collect chunks, then process the complete body in the "end" event. Express\'s express.json() middleware does this automatically for you.',
    },
  ],
};
