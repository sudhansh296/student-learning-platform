import type { RestapiLesson } from '../restapi-curriculum';

export const lesson01: RestapiLesson = {
  id: 'restapi-01',
  title: 'Introduction to REST APIs',
  slug: '01-introduction',
  chapter: 'basics',
  order: 1,
  difficulty: 'beginner',
  readingTime: 10,
  description: 'Learn what REST APIs are, why they power the modern web, and how clients and servers communicate over HTTP.',
  sections: [
    {
      type: 'text',
      content: 'A REST API is a contract between two pieces of software. One side makes requests (the client), the other side handles them and returns data (the server). Every time your app loads a social media feed, processes a payment, or checks the weather, it is calling a REST API behind the scenes.'
    },
    {
      type: 'heading',
      content: 'What is an API?'
    },
    {
      type: 'text',
      content: 'API stands for Application Programming Interface. It is a defined way for programs to talk to each other. Just as a power socket gives you a standard interface to plug in any device, an API gives you a standard interface to connect to a service without knowing how it works internally.'
    },
    {
      type: 'analogy',
      title: 'The waiter analogy',
      content: 'Think of a restaurant. You (the client) sit at the table with a menu. The waiter (the API) takes your order to the kitchen (the server/database). The kitchen prepares the food and the waiter brings it back to you. You never walk into the kitchen yourself. The waiter is the defined interface between you and the kitchen.'
    },
    {
      type: 'heading',
      content: 'What Does REST Mean?'
    },
    {
      type: 'text',
      content: 'REST stands for Representational State Transfer. It was defined by Roy Fielding in his 2000 doctoral dissertation as a set of architectural constraints for building scalable web services. A service that follows these constraints is called RESTful.'
    },
    {
      type: 'list',
      title: 'The six REST constraints:',
      items: [
        'Client-Server: the UI and data storage are separated, each can evolve independently',
        'Stateless: each request contains all the information needed to process it; the server stores no session',
        'Cacheable: responses must declare whether they can be cached, improving performance',
        'Uniform Interface: consistent URLs, methods, and formats across the entire API',
        'Layered System: the client does not know if it is talking to the real server or a proxy/load balancer',
        'Code on Demand (optional): servers may send executable code to clients (e.g., JavaScript)'
      ]
    },
    {
      type: 'heading',
      content: 'Why REST is the Dominant API Style'
    },
    {
      type: 'text',
      content: 'REST uses the same HTTP protocol that powers the web, which means every browser, mobile app, and server already knows how to speak it. It requires no special client libraries, works over any network, and maps naturally to CRUD operations on data.'
    },
    {
      type: 'table',
      title: 'Real-world REST API examples',
      headers: ['Company', 'API', 'What it does'],
      rows: [
        ['GitHub', 'api.github.com', 'Manage repos, issues, pull requests, users'],
        ['Stripe', 'api.stripe.com', 'Process payments, manage subscriptions'],
        ['Twitter/X', 'api.twitter.com', 'Post tweets, read timelines, search content'],
        ['OpenWeatherMap', 'api.openweathermap.org', 'Get weather data for any location'],
        ['The Movie DB', 'api.themoviedb.org', 'Fetch movie and TV show data']
      ]
    },
    {
      type: 'heading',
      content: 'JSON: The Standard Data Format'
    },
    {
      type: 'text',
      content: 'Almost every REST API today exchanges data in JSON (JavaScript Object Notation). JSON is human-readable, language-agnostic, and maps directly to objects in JavaScript, Python, Ruby, and most other languages. It has replaced XML as the dominant format for web APIs.'
    },
    {
      type: 'example',
      title: 'A basic fetch call to a REST API',
      content: 'This example uses the browser\'s built-in fetch() function to send a GET request to a public API and parse the JSON response. The await keyword pauses execution until the network response arrives, and response.json() parses the response body into a JavaScript object.',
      code: `// GET request to fetch a list of users
const response = await fetch('https://jsonplaceholder.typicode.com/users');

// Parse the response body as JSON
const users = await response.json();

console.log(users[0]);
// { id: 1, name: 'Leanne Graham', email: 'Sincere@april.biz', ... }

console.log('Status:', response.status); // 200
console.log('Content-Type:', response.headers.get('Content-Type'));
// application/json; charset=utf-8`,
      language: 'javascript',
      output: `{ id: 1, name: 'Leanne Graham', email: 'Sincere@april.biz', username: 'Bret' }
Status: 200
Content-Type: application/json; charset=utf-8`
    },
    {
      type: 'example',
      title: 'A typical JSON response object',
      content: 'REST APIs return structured JSON objects where each key represents a field of the resource. Nested objects and arrays are common - here a user resource contains a nested address object and a company object, showing how JSON can represent complex real-world data hierarchies.',
      code: `// Example JSON response from GET /users/1
{
  "id": 1,
  "name": "Leanne Graham",
  "username": "Bret",
  "email": "Sincere@april.biz",
  "address": {
    "street": "Kulas Light",
    "city": "Gwenborough",
    "zipcode": "92998-3874"
  },
  "phone": "1-770-736-0988 x56442",
  "website": "hildegard.org",
  "company": {
    "name": "Romaguera-Crona",
    "catchPhrase": "Multi-layered client-server neural-net"
  }
}`,
      language: 'json',
      output: 'Parsed as a JavaScript object with nested properties'
    },
    {
      type: 'heading',
      content: 'The Request-Response Cycle'
    },
    {
      type: 'text',
      content: 'Every REST API interaction follows the same pattern: the client sends an HTTP request with a method, URL, optional headers, and optional body. The server processes it and returns an HTTP response with a status code, headers, and optional body. This cycle is synchronous - the client waits for the response.'
    },
    {
      type: 'list',
      title: 'The five HTTP methods used in REST:',
      items: [
        'GET  - Read a resource or list of resources',
        'POST - Create a new resource',
        'PUT  - Replace a resource entirely',
        'PATCH - Update specific fields of a resource',
        'DELETE - Remove a resource'
      ]
    },
    {
      type: 'tryit',
      title: 'REST API Request-Response Visualizer',
      js: `document.body.innerHTML = '<div>' +
  '<h3>REST API Request-Response Cycle</h3>' +
  '<button id=\\"req-btn\\">Send Request</button>' +
  '<div class=\\"boxes\\">' +
  '<div class=\\"box client\\"><div class=\\"box-icon\\">💻</div><div class=\\"box-label\\">CLIENT</div></div>' +
  '<div class=\\"arrows\\">' +
  '<div class=\\"arrow-row\\"><div class=\\"arrow-track\\"><div class=\\"arrow-fill req-fill\\" id=\\"req-arrow\\"></div></div><span class=\\"arrow-label\\">→ REQUEST</span></div>' +
  '<div class=\\"arrow-row\\"><div class=\\"arrow-track\\"><div class=\\"arrow-fill res-fill\\" id=\\"res-arrow\\"></div></div><span class=\\"arrow-label\\">← RESPONSE</span></div>' +
  '</div>' +
  '<div class=\\"box api\\"><div class=\\"box-icon\\">🔌</div><div class=\\"box-label\\">API</div></div>' +
  '<div class=\\"arrows\\">' +
  '<div class=\\"arrow-row\\"><div class=\\"arrow-track\\"><div class=\\"arrow-fill req-fill\\"></div></div></div>' +
  '<div class=\\"arrow-row\\"><div class=\\"arrow-track\\"><div class=\\"arrow-fill res-fill\\"></div></div></div>' +
  '</div>' +
  '<div class=\\"box server\\"><div class=\\"box-icon\\">🖥️</div><div class=\\"box-label\\">SERVER</div></div>' +
  '</div>' +
  '<div class=\\"data-panel\\" id=\\"req-data\\"><strong>Request Data</strong><pre>GET /api/users HTTP/1.1\\\\nHost: api.example.com\\\\nAuthorization: Bearer token123</pre></div>' +
  '<div class=\\"data-panel\\" id=\\"res-data\\"><strong>Response Data</strong><pre>HTTP/1.1 200 OK\\\\nContent-Type: application/json\\\\n\\\\n{ \\"users\\": [...] }</pre></div>' +
  '<div id=\\"status-msg\\" style=\\"color:#64748b;\\">Ready to send request</div>' +
  '</div>';

var state = 'idle';

function setStatus(msg, color) {
  var el = document.getElementById('status-msg');
  el.textContent = msg;
  el.style.color = color;
}

function animate() {
  if (state === 'running') return;
  state = 'running';

  var req = document.getElementById('req-arrow');
  var res = document.getElementById('res-arrow');
  var reqData = document.getElementById('req-data');
  var resData = document.getElementById('res-data');

  req.style.width = '0%';
  res.style.width = '0%';
  reqData.style.opacity = '0';
  resData.style.opacity = '0';
  setStatus('Sending request...', '#f59e0b');

  var start = null;
  function step(ts) {
    if (!start) start = ts;
    var p = Math.min((ts - start) / 600, 1);
    req.style.width = (p * 100) + '%';
    if (p < 1) {
      requestAnimationFrame(step);
    } else {
      reqData.style.opacity = '1';
      setStatus('Server processing...', '#6366f1');
      setTimeout(function() {
        var start2 = null;
        function step2(ts2) {
          if (!start2) start2 = ts2;
          var p2 = Math.min((ts2 - start2) / 600, 1);
          res.style.width = (p2 * 100) + '%';
          if (p2 < 1) {
            requestAnimationFrame(step2);
          } else {
            resData.style.opacity = '1';
            setStatus('Response received!', '#10b981');
            state = 'idle';
          }
        }
        requestAnimationFrame(step2);
      }, 400);
    }
  }
  requestAnimationFrame(step);
}

document.getElementById('req-btn').addEventListener('click', animate);`,
      css: `body { font-family: system-ui, sans-serif; padding: 16px; background: #f8fafc; }
h3 { margin: 0 0 16px 0; color: #1e293b; font-size: 15px; }
.boxes { display: flex; align-items: center; gap: 0; margin-bottom: 20px; }
.box { background: white; border-radius: 10px; padding: 14px 18px; text-align: center; border: 2px solid; min-width: 90px; }
.box.client { border-color: #6366f1; }
.box.api { border-color: #f59e0b; }
.box.server { border-color: #10b981; }
.box-icon { font-size: 22px; }
.box-label { font-size: 11px; font-weight: 700; margin-top: 4px; }
.box.client .box-label { color: #6366f1; }
.box.api .box-label { color: #f59e0b; }
.box.server .box-label { color: #10b981; }
.arrows { flex: 1; padding: 0 8px; }
.arrow-row { display: flex; align-items: center; margin-bottom: 6px; position: relative; height: 22px; }
.arrow-track { width: 100%; height: 4px; background: #e2e8f0; border-radius: 2px; position: relative; overflow: hidden; }
.arrow-fill { height: 100%; border-radius: 2px; width: 0%; transition: none; }
.arrow-fill.req-fill { background: #6366f1; }
.arrow-fill.res-fill { background: #10b981; }
.arrow-label { font-size: 10px; font-weight: 600; margin-left: 8px; white-space: nowrap; }
.data-panel { background: white; border-radius: 8px; padding: 10px 14px; border: 1px solid #e2e8f0; margin-bottom: 8px; opacity: 0; transition: opacity 0.3s; font-size: 12px; }
.data-panel strong { display: block; margin-bottom: 4px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; }
.data-panel pre { margin: 0; color: #334155; font-family: monospace; }
#req-btn { background: #6366f1; color: white; border: none; padding: 10px 22px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 13px; margin-bottom: 12px; }
#req-btn:hover { background: #4f46e5; }
#status-msg { font-size: 12px; font-weight: 600; margin-top: 8px; }`
    }
  ],
  exercises: [
    {
      id: 'ex-01-1',
      question: 'What does REST stand for?',
      type: 'multiple-choice',
      options: [
        'Remote Execution and State Transfer',
        'Representational State Transfer',
        'Request/Response Standard Template',
        'Resourceful Endpoint Service Toolkit'
      ],
      correct: 1,
      explanation: 'REST stands for Representational State Transfer, a term coined by Roy Fielding in his 2000 dissertation describing an architectural style for distributed hypermedia systems.'
    },
    {
      id: 'ex-01-2',
      question: 'Which REST constraint means that every request must contain all the information needed to process it, and the server stores no session data between requests?',
      type: 'multiple-choice',
      options: [
        'Cacheable',
        'Uniform Interface',
        'Stateless',
        'Layered System'
      ],
      correct: 2,
      explanation: 'The stateless constraint requires that each request from client to server must contain all of the information necessary to understand the request. The server cannot use any stored context on the server. Session state is kept entirely on the client.'
    },
    {
      id: 'ex-01-3',
      question: 'Which data format do virtually all modern REST APIs use to exchange data?',
      type: 'multiple-choice',
      options: [
        'XML (eXtensible Markup Language)',
        'CSV (Comma Separated Values)',
        'YAML (YAML Ain\'t Markup Language)',
        'JSON (JavaScript Object Notation)'
      ],
      correct: 3,
      explanation: 'JSON has become the standard data format for REST APIs because it is human-readable, easy to parse in any programming language, and maps directly to native data structures like objects and arrays.'
    }
  ],
  quiz: [
    {
      id: 'q-01-1',
      question: 'In the waiter analogy for REST APIs, what does the "kitchen" represent?',
      options: [
        'The client application making requests',
        'The API endpoint URL',
        'The server or database processing data',
        'The HTTP method being used'
      ],
      correct: 2,
      explanation: 'The kitchen represents the server or database. You (the client) never go to the kitchen directly - the waiter (the API) acts as the intermediary, carrying your request to the kitchen and bringing the result back.'
    },
    {
      id: 'q-01-2',
      question: 'Which of the following is NOT a standard HTTP method used in REST APIs?',
      options: [
        'GET',
        'POST',
        'SEND',
        'DELETE'
      ],
      correct: 2,
      explanation: 'SEND is not an HTTP method. The standard HTTP methods used in REST APIs are GET, POST, PUT, PATCH, and DELETE. SEND does not exist in the HTTP specification.'
    },
    {
      id: 'q-01-3',
      question: 'What is the correct method to parse a JSON response body when using the fetch() API in JavaScript?',
      options: [
        'JSON.parse(response)',
        'response.text()',
        'response.json()',
        'response.body()'
      ],
      correct: 2,
      explanation: 'response.json() is the built-in method on the fetch Response object that reads the response body and parses it as JSON. It returns a Promise that resolves to the parsed JavaScript object.'
    }
  ]
};
