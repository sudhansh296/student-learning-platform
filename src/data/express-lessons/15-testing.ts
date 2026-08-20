import type { ExpressLesson } from '../express-curriculum';

export const expressTestingLesson: ExpressLesson = {
  id: 'express-testing',
  slug: 'testing',
  chapter: 'advanced',
  order: 15,
  difficulty: 'intermediate',
  readingTime: 13,
  title: 'Testing Express APIs',
  description: 'Write unit and integration tests for your Express API using Jest and Supertest — from simple route tests to authenticated endpoints.',
  sections: [
    {
      type: 'text',
      content: 'Testing Express APIs serves two purposes: it catches regressions when you refactor code, and it documents the expected behavior of every endpoint. A test that exercises POST /users and asserts a 201 response is also a living specification of what that route is supposed to do — more reliable than any README.',
    },
    {
      type: 'heading',
      content: 'Jest Setup',
    },
    {
      type: 'example',
      title: 'Install Jest and Supertest',
      content: 'Jest is the test runner and assertion library. Supertest wraps your Express app and lets you make HTTP requests to it in tests without starting a real server or binding to a port.',
      language: 'bash',
      code: `npm install --save-dev jest supertest`,
    },
    {
      type: 'example',
      title: 'package.json test script and jest.config.js',
      content: 'Adding a test script to package.json lets you run the full suite with npm test. The jest.config.js file controls the test environment — use node for API tests since no browser DOM is involved.',
      language: 'javascript',
      code: `// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}

// jest.config.js
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js', '**/*.test.js'],
  clearMocks: true,
  collectCoverageFrom: ['src/**/*.js', '!src/server.js'],
};`,
    },
    {
      type: 'heading',
      content: 'Supertest',
    },
    {
      type: 'text',
      content: 'Supertest wraps your Express app and exposes a request() function. You call request(app).get("/path") and chain .expect() calls to assert the status code, headers, and body. The app never binds to a real port so tests run in parallel without conflicts.',
    },
    {
      type: 'heading',
      content: 'Test Structure',
    },
    {
      type: 'text',
      content: 'describe() groups related tests under a label, it() (or test()) defines a single test case, and expect() makes assertions. beforeAll() runs setup once before all tests in a describe block — useful for seeding a test database. afterAll() runs cleanup such as closing a database connection.',
    },
    {
      type: 'heading',
      content: 'Testing GET Routes',
    },
    {
      type: 'text',
      content: 'A GET test asserts the status code is 200 and that the response body matches the expected shape. Use .expect(200) for the status and .expect("Content-Type", /json/) for the content type. For the body, use the object returned by the request and call Jest matchers like expect(res.body).toHaveProperty("data").',
    },
    {
      type: 'heading',
      content: 'Testing POST Routes',
    },
    {
      type: 'text',
      content: 'POST tests send a body with .send() and assert the created resource is returned with a 201 status. Also test the failure path — send a request with missing required fields and assert a 400 response with an error message.',
    },
    {
      type: 'heading',
      content: 'Testing Error Cases',
    },
    {
      type: 'text',
      content: 'Error cases are as important as the happy path. Test that an unknown ID returns 404, that missing required fields return 400, and that unauthorized requests to protected routes return 401. These tests document your error contract.',
    },
    {
      type: 'heading',
      content: 'Mocking the Database',
    },
    {
      type: 'text',
      content: 'Unit tests should not hit a real database. Use jest.mock() to replace the database module with a fake, jest.fn() to create a mock function, and jest.spyOn() to intercept a specific method on an existing module. Mock functions let you control return values and assert they were called with expected arguments.',
    },
    {
      type: 'heading',
      content: 'Testing Authenticated Routes',
    },
    {
      type: 'text',
      content: 'Pass an Authorization header in your Supertest request with .set("Authorization", "Bearer <token>"). For tests, you can either generate a real JWT with a test secret or mock the auth middleware entirely with jest.mock() so the middleware always calls next().',
    },
    {
      type: 'heading',
      content: 'Test Coverage',
    },
    {
      type: 'text',
      content: 'Run jest --coverage to see which lines, branches, and functions are exercised by your tests. Aim for at least 80% coverage on route handlers and service functions. Coverage reports highlight untested error branches that are most likely to hide bugs.',
    },
    {
      type: 'example',
      title: 'Jest and Supertest setup with first GET test',
      content: 'Importing the Express app without calling app.listen() lets Supertest manage the server lifecycle internally. Each test call creates a temporary server, makes the request, and tears it down, so no ports are occupied between tests.',
      language: 'javascript',
      code: `// app.js — export the app without calling listen
const express = require('express');
const app = express();
app.use(express.json());

app.get('/health', function (req, res) {
  res.json({ status: 'ok' });
});

module.exports = app;

// server.js — only call listen here
const app = require('./app');
app.listen(3000, () => console.log('Server running on 3000'));

// __tests__/health.test.js
const request = require('supertest');
const app = require('../app');

describe('GET /health', function () {
  it('returns 200 with status ok', async function () {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});`,
    },
    {
      type: 'example',
      title: 'Full test suite for CRUD endpoints',
      content: 'A complete CRUD suite covers each HTTP method, validates both successful responses and error responses, and uses beforeAll/afterAll hooks to set up and tear down any shared state like a test database connection.',
      language: 'javascript',
      code: `const request = require('supertest');
const app = require('../app');
const db = require('../db');

describe('Users API', function () {
  beforeAll(async function () {
    await db.connect();
    await db.query('DELETE FROM users');
  });

  afterAll(async function () {
    await db.disconnect();
  });

  describe('GET /users', function () {
    it('returns an empty array when no users exist', async function () {
      const res = await request(app).get('/users');
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });
  });

  describe('POST /users', function () {
    it('creates a user and returns 201', async function () {
      const res = await request(app)
        .post('/users')
        .send({ name: 'Alice', email: 'alice@test.com' });
      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.name).toBe('Alice');
    });

    it('returns 400 when name is missing', async function () {
      const res = await request(app)
        .post('/users')
        .send({ email: 'noname@test.com' });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /users/:id', function () {
    it('returns 404 for unknown id', async function () {
      const res = await request(app).get('/users/99999');
      expect(res.status).toBe(404);
    });
  });
});`,
    },
    {
      type: 'example',
      title: 'Mocking a database module with jest.mock()',
      content: 'jest.mock() replaces the real module with a version where every exported function is a jest.fn() stub. Calling mockResolvedValue() sets the value the stub returns when awaited, so the test controls exactly what data the route handler receives without any real database.',
      language: 'javascript',
      code: `const request = require('supertest');
const app = require('../app');
const UserModel = require('../models/User');

// Replace the entire User model with Jest mocks
jest.mock('../models/User');

describe('GET /users (mocked db)', function () {
  it('returns users from the database', async function () {
    const fakeUsers = [
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' },
    ];

    // Tell the mock what to return when findAll is called
    UserModel.findAll.mockResolvedValue(fakeUsers);

    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(UserModel.findAll).toHaveBeenCalledTimes(1);
  });

  it('returns 500 when database throws', async function () {
    UserModel.findAll.mockRejectedValue(new Error('DB connection lost'));

    const res = await request(app).get('/users');
    expect(res.status).toBe(500);
  });
});`,
    },
    {
      type: 'example',
      title: 'Testing an authenticated endpoint',
      content: 'Supertest\'s .set() method adds headers to the request. Setting the Authorization header with a signed JWT lets you test protected routes end-to-end. Use a fixed test secret in your Jest environment so tokens generated in tests are valid for the duration of the test run.',
      language: 'javascript',
      code: `const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');

const TEST_SECRET = 'test-secret-key';

// Helper to generate a test token
function makeToken(payload) {
  return jwt.sign(payload, TEST_SECRET, { expiresIn: '1h' });
}

describe('GET /profile (authenticated)', function () {
  it('returns profile when valid token is provided', async function () {
    const token = makeToken({ userId: 42, role: 'user' });

    const res = await request(app)
      .get('/profile')
      .set('Authorization', 'Bearer ' + token);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('userId', 42);
  });

  it('returns 401 when no token is provided', async function () {
    const res = await request(app).get('/profile');
    expect(res.status).toBe(401);
  });

  it('returns 401 when token is expired', async function () {
    const expiredToken = jwt.sign(
      { userId: 1 },
      TEST_SECRET,
      { expiresIn: '-1s' } // already expired
    );

    const res = await request(app)
      .get('/profile')
      .set('Authorization', 'Bearer ' + expiredToken);

    expect(res.status).toBe(401);
  });
});`,
    },
    {
      type: 'tip',
      title: 'Keep app.js and server.js separate',
      content: 'Separate the Express app definition (app.js) from the server startup (server.js) that calls app.listen(). Supertest imports app.js directly without binding to a port, which means tests run without needing an available network port.',
    },
    {
      type: 'warning',
      title: 'Never use the production database in tests',
      content: 'Tests that create, update, or delete data must run against an isolated test database. Set NODE_ENV=test in your Jest environment and configure your database module to use a separate test database connection string when that environment variable is set.',
    },
    {
      type: 'tryit',
      title: 'Test Runner Simulator',
      css: `body{font-family:system-ui,sans-serif;padding:20px;margin:0;background:#f0f0f0;}
.test-demo{max-width:720px;margin:0 auto;}
.panel{background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);margin-bottom:16px;}
.panel-header{background:#000;color:#fff;padding:14px 20px;font-size:15px;font-weight:700;}
.panel-body{padding:20px;}
.btn{padding:10px 24px;background:#000;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;margin-bottom:20px;}
.btn:hover{background:#333;}
.btn:disabled{background:#888;cursor:not-allowed;}
.test-card{border:1px solid #e0e0e0;border-radius:8px;padding:14px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;background:#fafafa;}
.test-info{flex:1;}
.test-name{font-weight:700;font-size:13px;color:#333;margin-bottom:4px;}
.test-meta{font-size:11px;color:#888;font-family:monospace;}
.test-status{font-size:18px;width:28px;text-align:center;flex-shrink:0;}
.spinner{display:inline-block;width:18px;height:18px;border:2px solid #ccc;border-top-color:#000;border-radius:50%;animation:spin .6s linear infinite;}
@keyframes spin{to{transform:rotate(360deg)}}
.summary{background:#f8f8f8;border:1px solid #e0e0e0;border-radius:8px;padding:16px;font-size:14px;display:none;}
.summary.visible{display:block;}
.sum-pass{color:#16a34a;font-weight:700;}
.sum-fail{color:#dc2626;font-weight:700;}`,
      js: `var tests = [
  { name:'GET /health returns 200',           method:'GET',    path:'/health',      expected:200, pass:true  },
  { name:'GET /users returns array',           method:'GET',    path:'/users',       expected:200, pass:true  },
  { name:'POST /users creates resource',       method:'POST',   path:'/users',       expected:201, pass:true  },
  { name:'POST /users missing name => 400',    method:'POST',   path:'/users',       expected:400, pass:true  },
  { name:'GET /users/:id unknown id => 404',   method:'GET',    path:'/users/99999', expected:404, pass:true  },
  { name:'GET /profile no token => 401',       method:'GET',    path:'/profile',     expected:401, pass:true  },
  { name:'GET /profile expired token => 401',  method:'GET',    path:'/profile',     expected:401, pass:false },
  { name:'DELETE /users/:id invalid id => 400',method:'DELETE', path:'/users/abc',   expected:400, pass:false },
];

var running = false;
var startTime;

function renderCards(states) {
  var html = '';
  tests.forEach(function(t, i) {
    var state = states[i] || 'idle';
    var icon = '';
    if (state === 'idle')    icon = '<span class="test-status" style="color:#ccc">--</span>';
    if (state === 'running') icon = '<span class="test-status"><span class="spinner"></span></span>';
    if (state === 'pass')    icon = '<span class="test-status" style="color:#16a34a">&#10003;</span>';
    if (state === 'fail')    icon = '<span class="test-status" style="color:#dc2626">&#10007;</span>';
    html += '<div class="test-card">' +
      '<div class="test-info">' +
        '<div class="test-name">' + t.name + '</div>' +
        '<div class="test-meta">' + t.method + ' ' + t.path + ' &rarr; expected ' + t.expected + '</div>' +
      '</div>' + icon + '</div>';
  });
  document.getElementById('cardList').innerHTML = html;
}

function runTests() {
  if (running) return;
  running = true;
  startTime = Date.now();
  document.getElementById('runBtn').disabled = true;
  document.getElementById('summary').className = 'summary';

  var states = tests.map(function(){ return 'idle'; });
  renderCards(states);

  function runNext(i) {
    if (i >= tests.length) {
      var elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
      var passed = tests.filter(function(t){ return t.pass; }).length;
      var failed = tests.length - passed;
      var sumEl = document.getElementById('summary');
      sumEl.innerHTML =
        '<span class="sum-pass">' + passed + ' passed</span>, ' +
        '<span class="sum-fail">' + failed + ' failed</span> &nbsp;|&nbsp; ' +
        tests.length + ' total &nbsp;|&nbsp; ' + elapsed + 's';
      sumEl.className = 'summary visible';
      document.getElementById('runBtn').disabled = false;
      running = false;
      return;
    }
    states[i] = 'running';
    renderCards(states);
    setTimeout(function() {
      states[i] = tests[i].pass ? 'pass' : 'fail';
      renderCards(states);
      runNext(i + 1);
    }, 320);
  }

  runNext(0);
}

document.getElementById('output').innerHTML =
  '<div class="test-demo">' +
  '<div class="panel">' +
  '<div class="panel-header">Express API Test Suite (Jest + Supertest)</div>' +
  '<div class="panel-body">' +
  '<button class="btn" id="runBtn" onclick="runTests()">Run All Tests</button>' +
  '<div id="cardList"></div>' +
  '<div class="summary" id="summary"></div>' +
  '</div>' +
  '</div>' +
  '</div>';

var initStates = tests.map(function(){ return 'idle'; });
renderCards(initStates);`,
    },
  ],
  exercises: [
    {
      id: 'express-testing-1',
      question: 'Why does Supertest not require a running server on a real port?',
      type: 'multiple-choice',
      options: [
        'It uses a mock HTTP layer that bypasses networking entirely',
        'It binds to a random available port automatically for each test',
        'It wraps the Express app and manages the server lifecycle internally per request',
        'It converts HTTP requests to function calls',
      ],
      correct: 2,
      explanation: 'Supertest calls app.listen() internally when you pass the Express app to request(). It picks an available ephemeral port, makes the request, and then closes the server. This means tests never conflict with each other or with a running development server.',
    },
    {
      id: 'express-testing-2',
      question: 'What does jest.mock("../models/User") do?',
      type: 'multiple-choice',
      options: [
        'Creates a copy of the User model in a temp directory',
        'Replaces the User module with an auto-mocked version where every function is a jest.fn()',
        'Records all calls to User model methods for later inspection',
        'Validates the User model schema against test fixtures',
      ],
      correct: 1,
      explanation: 'jest.mock() hoists to the top of the file and replaces the specified module with an auto-mocked version. Every exported function becomes a jest.fn() stub that you can configure with .mockResolvedValue() or .mockRejectedValue().',
    },
    {
      id: 'express-testing-3',
      question: 'How do you send a JSON body with Supertest when testing a POST endpoint?',
      type: 'multiple-choice',
      options: [
        '.body({ name: "Alice" })',
        '.json({ name: "Alice" })',
        '.send({ name: "Alice" })',
        '.data({ name: "Alice" })',
      ],
      correct: 2,
      explanation: 'Chain .send({ name: "Alice" }) after the HTTP method call. Supertest automatically sets Content-Type: application/json when you pass an object to .send(), so the Express json() middleware parses it correctly.',
    },
  ],
  quiz: [
    {
      id: 'express-testing-q1',
      question: 'Why should you export your Express app separately from the server.js file that calls app.listen()?',
      options: [
        'To reduce the app bundle size in production',
        'So that test files can import the app without starting a real HTTP server',
        'Because Next.js requires a separate entry point for API routes',
        'To allow hot module replacement during development',
      ],
      correct: 1,
      explanation: 'When test files import app.js, Supertest can spin up a temporary server internally without binding to a fixed port. If the app imported from server.js called app.listen() at module load time, every test file would try to start a server on the same port and most would fail with EADDRINUSE.',
    },
    {
      id: 'express-testing-q2',
      question: 'What Jest hook runs setup code once before all tests in a describe block?',
      options: ['beforeEach()', 'beforeAll()', 'setupOnce()', 'describe.setup()'],
      correct: 1,
      explanation: 'beforeAll() runs the provided async function once before all tests in its enclosing describe block. Use it for expensive setup like creating a database connection. beforeEach() runs before every individual test.',
    },
    {
      id: 'express-testing-q3',
      question: 'What does the jest --coverage flag produce?',
      options: [
        'A list of all passing tests with execution time',
        'A report showing which lines, branches, and functions were exercised by the test suite',
        'A diff of code changes since the last test run',
        'A summary of which npm packages are used in tests',
      ],
      correct: 1,
      explanation: 'jest --coverage generates a coverage report showing statement, branch, function, and line coverage percentages. It identifies untested code paths, particularly untested error branches and edge cases that are most likely to contain bugs.',
    },
  ],
};
