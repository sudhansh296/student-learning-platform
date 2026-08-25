import type { RestapiLesson } from '../restapi-curriculum';

export const lesson02: RestapiLesson = {
  id: 'restapi-02',
  title: 'HTTP Fundamentals',
  slug: '02-http-basics',
  chapter: 'basics',
  order: 2,
  difficulty: 'beginner',
  readingTime: 12,
  description: 'Understand the HTTP protocol - the foundation of REST APIs - including requests, responses, headers, and the request-response cycle.',
  sections: [
    {
      type: 'text',
      content: 'HTTP (HyperText Transfer Protocol) is the protocol that defines how messages are formatted and transmitted across the web. Every REST API interaction is an HTTP conversation - a client sends an HTTP request and the server sends an HTTP response. Understanding HTTP deeply means you can debug any API issue with confidence.'
    },
    {
      type: 'heading',
      content: 'Anatomy of a URL'
    },
    {
      type: 'text',
      content: 'A URL (Uniform Resource Locator) is how you identify the resource you want to interact with. Every part of a URL carries specific meaning that affects how the request is handled.'
    },
    {
      type: 'example',
      title: 'URL anatomy breakdown',
      content: 'This breakdown shows every component of a complete URL as used in a REST API request. Understanding each part helps you construct correct API calls and interpret URLs you encounter in documentation.',
      code: `https://api.example.com:443/v1/users?role=admin&page=2#section

Protocol:  https://
Host:      api.example.com
Port:      :443  (default for HTTPS, often omitted)
Path:      /v1/users
Query:     ?role=admin&page=2
Fragment:  #section  (not sent to server, browser-only)

// In JavaScript, URL can be parsed:
const url = new URL('https://api.example.com/v1/users?role=admin&page=2');
console.log(url.hostname);   // api.example.com
console.log(url.pathname);   // /v1/users
console.log(url.searchParams.get('role'));  // admin
console.log(url.searchParams.get('page'));  // 2`,
      language: 'javascript',
      output: `api.example.com
/v1/users
admin
2`
    },
    {
      type: 'heading',
      content: 'HTTP Request Structure'
    },
    {
      type: 'text',
      content: 'An HTTP request has three parts: the request line (method + path + HTTP version), headers (key-value metadata), and optionally a body containing data. Only POST, PUT, and PATCH requests typically have a body.'
    },
    {
      type: 'example',
      title: 'Full HTTP request text',
      content: 'This shows the raw text of an HTTP POST request as it travels over the network. The first line is the request line, followed by headers (one per line), a blank line, and then the request body. REST clients like curl and fetch build this structure for you automatically.',
      code: `POST /v1/users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
Accept: application/json
Content-Length: 52

{
  "name": "Alice Johnson",
  "email": "alice@example.com"
}`,
      language: 'http',
      output: 'Raw HTTP request transmitted to the server'
    },
    {
      type: 'heading',
      content: 'HTTP Response Structure'
    },
    {
      type: 'text',
      content: 'An HTTP response mirrors the request structure: a status line (version + status code + reason phrase), headers, and an optional body. The status code tells you immediately whether the request succeeded or failed.'
    },
    {
      type: 'example',
      title: 'Full HTTP response text',
      content: 'This shows the raw text of an HTTP 201 Created response. The status line indicates success, the Location header tells the client where the new resource lives, and the JSON body returns the full created resource including its server-assigned id.',
      code: `HTTP/1.1 201 Created
Content-Type: application/json
Location: /v1/users/42
X-Request-Id: a1b2c3d4
Date: Tue, 19 Aug 2026 14:30:00 GMT

{
  "id": 42,
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "createdAt": "2026-08-19T14:30:00Z"
}`,
      language: 'http',
      output: 'Raw HTTP response received from the server'
    },
    {
      type: 'heading',
      content: 'Important HTTP Headers'
    },
    {
      type: 'table',
      title: 'Common request and response headers',
      headers: ['Header', 'Direction', 'Purpose', 'Example value'],
      rows: [
        ['Content-Type', 'Both', 'Format of the body', 'application/json'],
        ['Accept', 'Request', 'Format the client wants back', 'application/json'],
        ['Authorization', 'Request', 'Credentials for the request', 'Bearer <token>'],
        ['Cache-Control', 'Both', 'Caching directives', 'no-cache, max-age=3600'],
        ['X-Request-Id', 'Both', 'Unique ID for tracing', 'a1b2c3d4'],
        ['Location', 'Response', 'URL of newly created resource', '/v1/users/42'],
        ['ETag', 'Response', 'Version identifier for caching', '"33a64df5"'],
        ['Retry-After', 'Response', 'When to retry after rate limit', '60']
      ]
    },
    {
      type: 'heading',
      content: 'HTTP vs HTTPS'
    },
    {
      type: 'text',
      content: 'HTTPS is HTTP with TLS (Transport Layer Security) encryption. All data transmitted - including headers, tokens, and request bodies - is encrypted so it cannot be read by intermediaries. Every production REST API must use HTTPS. Never send API keys or tokens over plain HTTP.'
    },
    {
      type: 'heading',
      content: 'Cookies vs Tokens'
    },
    {
      type: 'text',
      content: 'Traditional web apps use cookies (automatically sent by browsers with every request to the same domain). REST APIs typically prefer tokens - either API keys or JWTs sent in the Authorization header. Tokens work across domains, in mobile apps, and in server-to-server communication where cookies do not apply.'
    },
    {
      type: 'tryit',
      title: 'HTTP Request and Response Builder',
      js: `document.body.innerHTML = '<div><h3>HTTP Request Builder</h3><div id=\\"form-area\\"></div><div id=\\"output\\"></div></div>';

var methods = ['GET','POST','PUT','PATCH','DELETE'];
var methodColors = { GET:'#10b981', POST:'#6366f1', PUT:'#f59e0b', PATCH:'#8b5cf6', DELETE:'#ef4444' };

function buildUI() {
  var form = document.getElementById('form-area');
  form.innerHTML = [
    '<div class=\\"row\\">',
    '  <label>Method:</label>',
    '  <select id=\\"method-sel\\">' + methods.map(function(m) { return '<option>' + m + '</option>'; }).join('') + '</select>',
    '</div>',
    '<div class=\\"row\\">',
    '  <label>URL:</label>',
    '  <input id=\\"url-inp\\" type=\\"text\\" value=\\"https://api.example.com/users\\" />',
    '</div>',
    '<div class=\\"row\\">',
    '  <label>Header:</label>',
    '  <input id=\\"hdr-inp\\" type=\\"text\\" placeholder=\\"Authorization: Bearer token123\\" value=\\"Authorization: Bearer mytoken123\\" />',
    '</div>',
    '<div class=\\"row\\" id=\\"body-row\\">',
    '  <label>Body:</label>',
    '  <textarea id=\\"body-inp\\" rows=\\"3\\">{ \\"name\\": \\"Alice\\", \\"email\\": \\"alice@example.com\\" }</textarea>',
    '</div>',
    '<button id=\\"send-btn\\">Send Request</button>'
  ].join('');

  document.getElementById('method-sel').addEventListener('change', toggleBody);
  document.getElementById('send-btn').addEventListener('click', showResult);
  toggleBody();
}

function toggleBody() {
  var m = document.getElementById('method-sel').value;
  document.getElementById('body-row').style.display = (m === 'GET' || m === 'DELETE') ? 'none' : 'flex';
}

function showResult() {
  var method = document.getElementById('method-sel').value;
  var url = document.getElementById('url-inp').value || 'https://api.example.com/users';
  var hdr = document.getElementById('hdr-inp').value;
  var body = document.getElementById('body-inp') ? document.getElementById('body-inp').value : '';
  var color = methodColors[method];

  var statusMap = { GET:'200 OK', POST:'201 Created', PUT:'200 OK', PATCH:'200 OK', DELETE:'204 No Content' };
  var status = statusMap[method];
  var statusColor = (method === 'DELETE') ? '#6c757d' : '#10b981';

  var reqHtml = '<div class=\\"panel\\"><div class=\\"panel-title\\" style=\\"background:' + color + '\\">REQUEST</div>';
  reqHtml += '<div class=\\"code-line\\"><span class=\\"method-badge\\" style=\\"background:' + color + '\\">' + method + '</span> ' + escHtml(url) + ' HTTP/1.1</div>';
  if (hdr) reqHtml += '<div class=\\"code-line\\">' + escHtml(hdr) + '</div>';
  reqHtml += '<div class=\\"code-line\\">Content-Type: application/json</div>';
  reqHtml += '<div class=\\"code-line\\">Accept: application/json</div>';
  if (body && method !== 'GET' && method !== 'DELETE') {
    reqHtml += '<div class=\\"code-sep\\"></div><div class=\\"code-line\\">' + escHtml(body) + '</div>';
  }
  reqHtml += '</div>';

  var resBody = method === 'GET'
    ? '[\\\   { \\"id\\": 1, \\"name\\": \\"Alice\\" },\\\   { \\"id\\": 2, \\"name\\": \\"Bob\\" }\\\ ]'
    : method === 'POST'
    ? '{\\\   \\"id\\": 42,\\\   \\"name\\": \\"Alice\\",\\\   \\"email\\": \\"alice@example.com\\"\\\ }'
    : method === 'DELETE'
    ? '(no body)'
    : '{\\\   \\"id\\": 1,\\\   \\"updated\\": true\\\ }';

  var resHtml = '<div class=\\"panel\\"><div class=\\"panel-title\\" style=\\"background:#334155\\">RESPONSE</div>';
  resHtml += '<div class=\\"code-line\\">HTTP/1.1 <span class=\\"status-badge\\" style=\\"background:' + statusColor + '\\">' + status + '</span></div>';
  resHtml += '<div class=\\"code-line\\">Content-Type: application/json</div>';
  resHtml += '<div class=\\"code-line\\">X-Request-Id: a1b2c3d4</div>';
  resHtml += '<div class=\\"code-sep\\"></div><div class=\\"code-line\\">' + resBody + '</div>';
  resHtml += '</div>';

  document.getElementById('output').innerHTML = '<div class=\\"panels-row\\">' + reqHtml + resHtml + '</div>';
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

buildUI();`,
      css: `body { font-family: system-ui, sans-serif; padding: 16px; background: #f8fafc; }
h3 { color: #1e293b; margin: 0 0 14px 0; font-size: 15px; }
.row { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 10px; }
label { font-size: 12px; font-weight: 600; color: #475569; min-width: 60px; padding-top: 4px; }
select, input, textarea { flex: 1; border: 1px solid #cbd5e1; border-radius: 5px; padding: 6px 10px; font-size: 12px; font-family: monospace; background: white; }
textarea { resize: vertical; }
#send-btn { background: #6366f1; color: white; border: none; padding: 10px 22px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 13px; margin-top: 4px; }
#send-btn:hover { background: #4f46e5; }
.panels-row { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 16px; }
.panel { flex: 1; min-width: 200px; background: white; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; }
.panel-title { color: white; padding: 6px 12px; font-size: 11px; font-weight: 700; letter-spacing: 1px; }
.code-line { padding: 4px 12px; font-size: 11px; font-family: monospace; color: #334155; white-space: pre; }
.code-sep { height: 1px; background: #e2e8f0; margin: 4px 0; }
.method-badge { color: white; padding: 1px 6px; border-radius: 3px; font-size: 11px; font-weight: 700; }
.status-badge { color: white; padding: 1px 8px; border-radius: 3px; font-size: 11px; font-weight: 700; }`
    }
  ],
  exercises: [
    {
      id: 'ex-02-1',
      question: 'Which part of a URL is NOT sent to the server?',
      type: 'multiple-choice',
      options: [
        'The path (/v1/users)',
        'The query string (?page=2)',
        'The fragment (#section)',
        'The host (api.example.com)'
      ],
      correct: 2,
      explanation: 'The fragment (#section) is processed only by the browser for in-page navigation. It is never included in the HTTP request sent to the server. All other URL parts - protocol, host, path, and query string - are used to construct the request.'
    },
    {
      id: 'ex-02-2',
      question: 'Which HTTP header tells the server what format the request body is in?',
      type: 'multiple-choice',
      options: [
        'Accept',
        'Authorization',
        'Content-Type',
        'X-Request-Id'
      ],
      correct: 2,
      explanation: 'Content-Type declares the media type of the request body, for example application/json. The Accept header tells the server what format the client wants in the response - the reverse direction.'
    },
    {
      id: 'ex-02-3',
      question: 'Why must production REST APIs use HTTPS instead of HTTP?',
      type: 'multiple-choice',
      options: [
        'HTTPS is faster because it compresses data automatically',
        'HTTPS encrypts all data in transit so tokens and credentials cannot be intercepted',
        'HTTPS prevents SQL injection attacks on the database',
        'HTTPS is required for APIs to support the POST method'
      ],
      correct: 1,
      explanation: 'HTTPS uses TLS encryption to protect all data in transit - including headers, authorization tokens, and request bodies. Without HTTPS, any network intermediary could read or modify API credentials and responses.'
    }
  ],
  quiz: [
    {
      id: 'q-02-1',
      question: 'What does a blank line between headers and body in an HTTP message signify?',
      options: [
        'The end of the entire HTTP message',
        'A formatting error in the request',
        'The separator between headers and the message body',
        'The start of metadata about the body'
      ],
      correct: 2,
      explanation: 'In the HTTP specification, a blank line (CRLF CRLF) is the required separator between the headers section and the message body. This allows parsers to know where headers end and where the body begins.'
    },
    {
      id: 'q-02-2',
      question: 'Which HTTP methods typically do NOT have a request body?',
      options: [
        'POST and PUT',
        'PUT and PATCH',
        'GET and DELETE',
        'PATCH and POST'
      ],
      correct: 2,
      explanation: 'GET and DELETE requests typically do not have a body. GET requests send all parameters in the URL query string, and DELETE requests identify the resource to delete via the URL path. POST, PUT, and PATCH send data in the request body.'
    },
    {
      id: 'q-02-3',
      question: 'What is the difference between the Authorization header and a cookie for API authentication?',
      options: [
        'The Authorization header is only used for basic auth; cookies support all auth types',
        'Cookies are more secure than the Authorization header',
        'The Authorization header must be set manually (good for cross-domain API calls); cookies are sent automatically by browsers',
        'There is no practical difference between them'
      ],
      correct: 2,
      explanation: 'The Authorization header must be explicitly included in each request, which works well for cross-domain API calls, mobile apps, and server-to-server communication. Cookies are automatically sent by browsers only to the same domain that set them, making them less suitable for REST APIs consumed across multiple clients.'
    }
  ]
};
