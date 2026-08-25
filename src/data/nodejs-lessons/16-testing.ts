import type { NodejsLesson } from '../nodejs-curriculum';

export const nodejsTestingLesson: NodejsLesson = {
  id: 'nodejs-testing',
  title: 'Testing Node.js Applications',
  slug: 'testing',
  chapter: 'advanced',
  order: 16,
  difficulty: 'intermediate',
  readingTime: 14,
  description: 'Write unit and integration tests for your Node.js apps using Jest -- the most popular testing framework in the Node.js ecosystem.',
  sections: [
    {
      type: 'text',
      content: 'Testing is one of the most important skills a developer can have. It catches bugs before they reach production, documents how code is supposed to behave, and gives you the confidence to refactor without breaking things. This lesson covers the full testing toolkit for Node.js using Jest.',
    },
    {
      type: 'heading',
      content: 'Why Testing Matters',
    },
    {
      type: 'list',
      items: [
        'Catch bugs early -- finding a bug during development is far cheaper than in production',
        'Document behavior -- tests show exactly what a function should do with given inputs',
        'Enable safe refactoring -- a test suite tells you immediately if a change breaks something',
        'Faster onboarding -- new team members read tests to understand how code works',
        'Prevent regressions -- once a bug is fixed, a test ensures it never comes back',
      ],
    },
    {
      type: 'heading',
      content: 'Types of Tests',
    },
    {
      type: 'table',
      headers: ['Type', 'Scope', 'Speed', 'Example'],
      rows: [
        ['Unit', 'Single function or class', 'Very fast (milliseconds)', 'Test that formatPrice(9.9) returns "$9.90"'],
        ['Integration', 'Multiple modules working together', 'Moderate (seconds)', 'Test that POST /users creates a user in DB'],
        ['End-to-End (E2E)', 'Full application from UI to DB', 'Slow (minutes)', 'Test that a user can sign up and log in'],
      ],
    },
    {
      type: 'text',
      content: 'Most projects focus on unit and integration tests. Unit tests are fast and give precise feedback. Integration tests catch problems that only appear when pieces connect. E2E tests are powerful but slow and brittle -- use them sparingly for critical user flows.',
    },
    {
      type: 'heading',
      content: 'Setting Up Jest',
    },
    {
      type: 'example',
      title: 'Installing Jest and configuring package.json',
      language: 'bash',
      content: 'This shows the full Jest setup: installing it as a dev dependency, adding the test script to package.json, and creating an optional jest.config.js. The --coverage flag enables code coverage reports.',
      code: `# Install Jest as a dev dependency
npm install --save-dev jest

# For ES modules or TypeScript projects
npm install --save-dev jest @types/jest

# package.json - add test script
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}

# Optional jest.config.js
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js', '**/*.test.js'],
  collectCoverageFrom: ['src/**/*.js', '!src/**/*.test.js'],
};`,
    },
    {
      type: 'heading',
      content: 'Writing Unit Tests',
    },
    {
      type: 'text',
      content: 'Jest tests are organized with describe blocks (test suites) and it or test blocks (individual tests). The expect function combined with matchers like toBe and toEqual lets you assert on values. A single test file can contain many describe blocks, and each describe block can contain many tests.',
    },
    {
      type: 'example',
      title: 'Basic Jest unit tests for a utility function',
      language: 'javascript',
      content: 'This example shows a complete unit test file for a math utility module. It demonstrates the describe/it/expect pattern, several common matchers (toBe, toBeGreaterThan, toThrow), and how to group related tests together in named blocks.',
      code: `// src/utils/math.js
function add(a, b) { return a + b; }
function divide(a, b) {
  if (b === 0) throw new Error('Cannot divide by zero');
  return a / b;
}
module.exports = { add, divide };

// src/utils/math.test.js
const { add, divide } = require('./math');

describe('add()', () => {
  it('adds two positive numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('adds negative numbers', () => {
    expect(add(-1, -2)).toBe(-3);
  });

  it('returns a number', () => {
    expect(typeof add(1, 2)).toBe('number');
  });
});

describe('divide()', () => {
  it('divides two numbers', () => {
    expect(divide(10, 2)).toBe(5);
  });

  it('throws when dividing by zero', () => {
    expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
  });

  it('returns a value greater than 0 for positive inputs', () => {
    expect(divide(10, 3)).toBeGreaterThan(0);
  });
});`,
    },
    {
      type: 'table',
      headers: ['Matcher', 'Use Case', 'Example'],
      rows: [
        ['toBe(val)', 'Strict equality (===)', 'expect(1 + 1).toBe(2)'],
        ['toEqual(val)', 'Deep equality for objects/arrays', 'expect(obj).toEqual({ a: 1 })'],
        ['toBeNull()', 'Check for null', 'expect(result).toBeNull()'],
        ['toBeUndefined()', 'Check for undefined', 'expect(x).toBeUndefined()'],
        ['toBeTruthy()', 'Check for truthy value', 'expect(arr.length).toBeTruthy()'],
        ['toContain(item)', 'Array/string includes item', 'expect(arr).toContain(3)'],
        ['toThrow(msg)', 'Function throws an error', 'expect(() => fn()).toThrow()'],
        ['toHaveBeenCalledWith()', 'Mock was called with args', 'expect(mock).toHaveBeenCalledWith(42)'],
      ],
    },
    {
      type: 'heading',
      content: 'Testing Async Code',
    },
    {
      type: 'example',
      title: 'Async test for a function that returns a promise',
      language: 'javascript',
      content: 'This example shows three ways to test async code in Jest: using async/await directly in the test, and using the resolves and rejects matchers which unwrap a promise before asserting. All three styles are valid -- async/await is the most readable for complex scenarios.',
      code: `// src/services/userService.js
async function fetchUser(id) {
  if (!id) throw new Error('ID is required');
  // Simulate async DB call
  return { id, name: 'Alice', email: 'alice@example.com' };
}
module.exports = { fetchUser };

// src/services/userService.test.js
const { fetchUser } = require('./userService');

// Style 1: async/await in test
it('fetches a user by id', async () => {
  const user = await fetchUser(1);
  expect(user).toEqual({ id: 1, name: 'Alice', email: 'alice@example.com' });
});

// Style 2: resolves matcher
it('resolves with a user object', () => {
  return expect(fetchUser(1)).resolves.toHaveProperty('name', 'Alice');
});

// Style 3: rejects matcher
it('rejects when id is missing', () => {
  return expect(fetchUser(null)).rejects.toThrow('ID is required');
});

// Style 4: async/await with try/catch
it('throws an error for missing id', async () => {
  await expect(fetchUser(undefined)).rejects.toThrow('ID is required');
});`,
    },
    {
      type: 'heading',
      content: 'Mocking',
    },
    {
      type: 'text',
      content: 'Mocking replaces real implementations with controlled fakes during tests. This lets you test code in isolation -- your unit test for a service function should not actually hit a database or make HTTP requests. Jest provides jest.fn() for mock functions and jest.mock() to replace entire modules.',
    },
    {
      type: 'example',
      title: 'Mocking a database module with jest.mock()',
      language: 'javascript',
      content: 'This example demonstrates how jest.mock() replaces the entire db module with a fake, and mockResolvedValue sets the return value for async mocks. After each test, mockClear resets call counts so tests do not interfere with each other.',
      code: `// src/db.js  (the real module we want to mock)
async function findUser(id) { /* real DB query */ }
module.exports = { findUser };

// src/services/userService.js
const db = require('../db');
async function getUser(id) {
  const user = await db.findUser(id);
  if (!user) throw new Error('User not found');
  return user;
}
module.exports = { getUser };

// src/services/userService.test.js
const db = require('../db');
const { getUser } = require('./userService');

// Replace the entire db module with a mock
jest.mock('../db');

describe('getUser()', () => {
  afterEach(() => {
    db.findUser.mockClear(); // reset call counts between tests
  });

  it('returns the user when found', async () => {
    db.findUser.mockResolvedValue({ id: 1, name: 'Alice' });

    const user = await getUser(1);

    expect(db.findUser).toHaveBeenCalledWith(1);
    expect(user).toEqual({ id: 1, name: 'Alice' });
  });

  it('throws when user is not found', async () => {
    db.findUser.mockResolvedValue(null);

    await expect(getUser(99)).rejects.toThrow('User not found');
  });

  it('uses jest.fn() for a standalone mock function', () => {
    const callback = jest.fn();
    callback('hello');
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('hello');
  });
});`,
    },
    {
      type: 'heading',
      content: 'Testing Express Routes with Supertest',
    },
    {
      type: 'text',
      content: 'Supertest lets you send HTTP requests to an Express app in tests without actually starting a server on a port. You import your app and pass it to supertest, then chain methods like .get(), .post(), .send(), and .expect() to make assertions on the HTTP response.',
    },
    {
      type: 'example',
      title: 'Integration test of an Express route using supertest',
      language: 'javascript',
      content: 'This example shows a full integration test for a REST API route. Supertest sends real HTTP requests to the Express app in memory, and you can assert on the status code, response headers, and the JSON body -- all without a running server or a real database when the DB is mocked.',
      code: `# Install supertest
npm install --save-dev supertest

// src/app.js  (export app without calling listen)
const express = require('express');
const app = express();
app.use(express.json());

const users = [{ id: 1, name: 'Alice' }];

app.get('/api/users', (req, res) => {
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const user = { id: users.length + 1, name };
  users.push(user);
  res.status(201).json(user);
});

module.exports = app;

// src/app.test.js
const request = require('supertest');
const app = require('./app');

describe('GET /api/users', () => {
  it('returns a list of users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body[0]).toHaveProperty('name');
  });
});

describe('POST /api/users', () => {
  it('creates a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Bob' })
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Bob');
    expect(res.body.id).toBeDefined();
  });

  it('returns 400 when name is missing', async () => {
    const res = await request(app).post('/api/users').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Name is required');
  });
});`,
    },
    {
      type: 'heading',
      content: 'Test Coverage',
    },
    {
      type: 'example',
      title: 'Jest coverage report output',
      language: 'bash',
      content: 'This shows the coverage table Jest prints after running with the --coverage flag. Each column tells you what percentage of statements, branches (if/else paths), functions, and lines are exercised by your tests -- low branch coverage often means untested error paths.',
      code: `# Run tests with coverage
npm test -- --coverage

# Output:
----------------------|---------|----------|---------|---------|
File                  | % Stmts | % Branch | % Funcs | % Lines |
----------------------|---------|----------|---------|---------|
All files             |   87.50 |    75.00 |   85.71 |   87.50 |
 src/utils/math.js    |   100.0 |   100.0  |   100.0 |   100.0 |
 src/services/user.js |    75.0 |    50.00 |    75.0 |    75.0 |
----------------------|---------|----------|---------|---------|

# What each column means:
# % Stmts  - percentage of statements executed
# % Branch - percentage of if/else branches taken
# % Funcs  - percentage of functions called
# % Lines  - percentage of lines executed

# Coverage thresholds in jest.config.js:
module.exports = {
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};`,
    },
    {
      type: 'heading',
      content: 'Test-Driven Development (TDD)',
    },
    {
      type: 'list',
      items: [
        'Red: Write a failing test that describes the behavior you want',
        'Green: Write the minimum code needed to make the test pass',
        'Refactor: Clean up the code while keeping all tests green',
        'Repeat: Move to the next small unit of behavior',
        'Benefits: Forces you to think about the interface before the implementation, and keeps code focused',
      ],
    },
    {
      type: 'heading',
      content: 'Best Practices',
    },
    {
      type: 'list',
      items: [
        'Use the Arrange-Act-Assert (AAA) pattern: set up data, call the function, check the result',
        'One assertion per test when possible -- makes failures immediately clear',
        'Write descriptive test names: "returns 400 when email is missing" not "test1"',
        'Keep tests independent -- no test should depend on another test running first',
        'Mock external dependencies (databases, APIs, filesystem) in unit tests',
        'Use integration tests to verify the real connections work end-to-end',
        'Run tests in CI/CD on every commit to catch regressions early',
        'Aim for 80%+ coverage but do not chase 100% -- focus on critical paths',
        'Use beforeEach/afterEach to set up and tear down test state',
        'Avoid testing implementation details -- test observable behavior instead',
      ],
    },
    {
      type: 'tryit',
      title: 'Test Result Simulator',
      css: `*{box-sizing:border-box;}
body{font-family:system-ui,sans-serif;margin:0;padding:16px;background:#0f172a;color:#e2e8f0;}
.layout{display:grid;grid-template-columns:1fr 1fr;gap:16px;max-width:960px;margin:0 auto;}
.panel{background:#1e293b;border-radius:10px;overflow:hidden;}
.panel-header{background:#334155;padding:10px 16px;font-size:13px;font-weight:700;color:#94a3b8;letter-spacing:0.05em;display:flex;justify-content:space-between;align-items:center;}
.editor{width:100%;height:320px;background:#0f172a;color:#e2e8f0;border:none;padding:14px;font-family:monospace;font-size:12px;resize:none;outline:none;line-height:1.6;}
.results{padding:12px;height:320px;overflow-y:auto;}
.test-item{display:flex;align-items:flex-start;gap:10px;padding:9px 12px;margin-bottom:6px;border-radius:7px;font-size:12px;line-height:1.5;}
.test-item.pass{background:#052e16;border-left:3px solid #22c55e;}
.test-item.fail{background:#2d0a0a;border-left:3px solid #ef4444;}
.test-item.pending{background:#1e293b;border-left:3px solid #64748b;}
.badge{font-size:10px;font-weight:700;padding:2px 7px;border-radius:10px;white-space:nowrap;margin-top:1px;}
.badge.pass{background:#166534;color:#4ade80;}
.badge.fail{background:#7f1d1d;color:#fca5a5;}
.badge.pending{background:#334155;color:#94a3b8;}
.test-name{font-weight:600;color:#e2e8f0;}
.test-detail{font-size:11px;color:#94a3b8;margin-top:3px;}
.test-detail.error{color:#f87171;}
.run-btn{background:#3b82f6;color:#fff;border:none;padding:8px 18px;border-radius:6px;font-size:13px;font-weight:700;cursor:pointer;transition:background 0.15s;}
.run-btn:hover{background:#2563eb;}
.run-btn:active{background:#1d4ed8;}
.summary{padding:10px 16px;background:#0f172a;border-top:1px solid #334155;font-size:12px;display:flex;gap:16px;}
.summary span{font-weight:700;}
.pass-count{color:#4ade80;}
.fail-count{color:#f87171;}
.total-count{color:#94a3b8;}
.title-bar{font-size:11px;color:#64748b;}`,
      js: `var defaultCode = [
  "// Test Suite: Math Utilities",
  "// Format: describe('suite', [",
  "//   test('name', expected, actual)",
  "// ])",
  "",
  "describe('add function', [",
  "  test('adds 2 + 3', 5, 2 + 3),",
  "  test('adds negative numbers', -5, -2 + -3),",
  "  test('adds zero', 7, 7 + 0),",
  "])",
  "",
  "describe('string operations', [",
  "  test('uppercase', 'HELLO', 'hello'.toUpperCase()),",
  "  test('length of empty string', 0, ''.length),",
  "  test('trim whitespace', 'hello', '  hello  '.trim()),",
  "])",
  "",
  "describe('array checks', [",
  "  test('array length', 3, [1, 2, 3].length),",
  "  test('includes value', true, [1, 2, 3].includes(2)),",
  "  test('first element', 10, [10, 20, 30][0]),",
  "])",
  "",
  "describe('intentional failures', [",
  "  test('wrong expected value', 10, 2 + 3),",
  "  test('type mismatch', '5', 2 + 3),",
  "])"
].join("\\n");

document.getElementById("output").innerHTML =
  '<div class="layout">' +
  '<div class="panel">' +
  '<div class="panel-header"><span>TEST CODE</span><span class="title-bar">edit and run</span></div>' +
  '<textarea class="editor" id="codeEditor"></textarea>' +
  '</div>' +
  '<div class="panel">' +
  '<div class="panel-header"><span>RESULTS</span><button class="run-btn" onclick="runTests()">Run Tests</button></div>' +
  '<div class="results" id="results"><div style="color:#64748b;font-size:13px;padding:20px;">Click Run Tests to execute.</div></div>' +
  '<div class="summary" id="summary" style="display:none">' +
  '<span class="pass-count" id="passCount"></span>' +
  '<span class="fail-count" id="failCount"></span>' +
  '<span class="total-count" id="totalCount"></span>' +
  '</div>' +
  '</div>' +
  '</div>';

document.getElementById("codeEditor").value = defaultCode;

function runTests() {
  var code = document.getElementById("codeEditor").value;
  var results = [];
  var currentSuite = "";

  var suiteMatches = code.match(/describe\\(['"](.*?)['"],\\s*\\[([\\s\\S]*?)\\]\\)/g) || [];

  suiteMatches.forEach(function(block) {
    var suiteMatch = block.match(/describe\\(['"](.*?)['"]/);
    currentSuite = suiteMatch ? suiteMatch[1] : "Tests";

    var testMatches = block.match(/test\\(['"](.*?)['"],[^,]*,(.*?)\\)/g) || [];
    testMatches.forEach(function(t) {
      var parts = t.match(/test\\(['"](.*?)['"],\\s*(.*?),\\s*(.*?)\\)$/);
      if (!parts) return;
      var name = parts[1];
      var expected = parts[2].trim();
      var actual = parts[3].trim();

      var expectedVal, actualVal, pass;
      try {
        expectedVal = eval(expected);
        actualVal = eval(actual);
        pass = JSON.stringify(expectedVal) === JSON.stringify(actualVal);
      } catch(e) {
        pass = false;
        actualVal = "Error: " + e.message;
        expectedVal = expected;
      }

      results.push({
        suite: currentSuite,
        name: name,
        pass: pass,
        expected: JSON.stringify(expectedVal),
        actual: JSON.stringify(actualVal),
      });
    });
  });

  if (results.length === 0) {
    document.getElementById("results").innerHTML =
      '<div style="color:#f87171;font-size:13px;padding:20px;">No tests found. Use the describe/test format shown.</div>';
    document.getElementById("summary").style.display = "none";
    return;
  }

  var passCount = results.filter(function(r) { return r.pass; }).length;
  var failCount = results.length - passCount;
  var html = "";
  var lastSuite = "";

  results.forEach(function(r) {
    if (r.suite !== lastSuite) {
      html += '<div style="font-size:11px;font-weight:700;color:#94a3b8;margin:10px 0 4px;padding-left:4px;">' + r.suite + '</div>';
      lastSuite = r.suite;
    }
    var status = r.pass ? "pass" : "fail";
    var detail = r.pass
      ? '<div class="test-detail">Expected and received: ' + r.expected + '</div>'
      : '<div class="test-detail error">Expected: ' + r.expected + ' | Received: ' + r.actual + '</div>';
    html += '<div class="test-item ' + status + '">' +
      '<span class="badge ' + status + '">' + (r.pass ? "PASS" : "FAIL") + '</span>' +
      '<div><div class="test-name">' + r.name + '</div>' + detail + '</div>' +
      '</div>';
  });

  document.getElementById("results").innerHTML = html;
  document.getElementById("passCount").textContent = passCount + " passed";
  document.getElementById("failCount").textContent = failCount + " failed";
  document.getElementById("totalCount").textContent = results.length + " total";
  document.getElementById("summary").style.display = "flex";
}`,
    },
  ],
  exercises: [
    {
      id: 'nodejs-testing-1',
      question: 'Which Jest matcher should you use to check deep equality of two objects?',
      type: 'multiple-choice',
      options: [
        'toBe()',
        'toEqual()',
        'toMatch()',
        'toStrictEqual()',
      ],
      correct: 1,
      explanation: 'toEqual() performs deep equality checks, recursively comparing all object properties. toBe() uses strict reference equality (===) and would fail for two separate objects with the same contents.',
    },
    {
      id: 'nodejs-testing-2',
      question: 'What is the correct way to test that an async function throws an error in Jest?',
      type: 'multiple-choice',
      options: [
        'expect(asyncFn()).toThrow()',
        'await expect(asyncFn()).rejects.toThrow()',
        'expect(await asyncFn()).toThrow()',
        'asyncFn().catch(err => expect(err).toBeDefined())',
      ],
      correct: 1,
      explanation: 'You must await the expect() when using the rejects matcher: await expect(asyncFn()).rejects.toThrow(). Forgetting the await causes the test to pass even when the function does not throw.',
    },
    {
      id: 'nodejs-testing-3',
      question: 'What does jest.mock(&apos;../db&apos;) do at the top of a test file?',
      type: 'multiple-choice',
      options: [
        'Imports the real db module for testing',
        'Replaces the db module with an auto-mocked version for all tests in that file',
        'Creates a copy of the db module in a temp folder',
        'Runs all db functions silently without side effects',
      ],
      correct: 1,
      explanation: 'jest.mock() intercepts the module require/import and replaces all exported functions with jest.fn() mock functions. This lets you control return values with mockReturnValue and mockResolvedValue without touching the real database.',
    },
  ],
  quiz: [
    {
      id: 'nodejs-testing-q1',
      question: 'What is the Arrange-Act-Assert (AAA) pattern in testing?',
      options: [
        'A method for sorting test files alphabetically',
        'A pattern for structuring tests: set up data, call the code, check the result',
        'A way to run tests in three parallel threads',
        'A coverage measurement strategy',
      ],
      correct: 1,
      explanation: 'AAA structures each test in three clear phases: Arrange (set up the inputs and test data), Act (call the function or trigger the behavior), and Assert (check that the result is what you expected). It makes tests easy to read and debug.',
    },
    {
      id: 'nodejs-testing-q2',
      question: 'Which package do you use to test Express routes without starting a real server?',
      options: [
        'axios',
        'node-fetch',
        'supertest',
        'http-mock',
      ],
      correct: 2,
      explanation: 'supertest wraps your Express app and lets you send HTTP requests in tests without binding to a port. You pass your express app directly to request(app) and chain .get(), .post(), .send(), and .expect() calls.',
    },
    {
      id: 'nodejs-testing-q3',
      question: 'What does the --coverage flag do when running Jest?',
      options: [
        'Runs only the tests that cover recently changed files',
        'Generates a report showing what percentage of your code is exercised by tests',
        'Increases the timeout for slow tests',
        'Automatically fixes failing tests',
      ],
      correct: 1,
      explanation: 'The --coverage flag instruments your code and collects data on which statements, branches, functions, and lines are executed during the test run. It then prints a summary table and generates an HTML report in the coverage/ folder.',
    },
  ],
};
