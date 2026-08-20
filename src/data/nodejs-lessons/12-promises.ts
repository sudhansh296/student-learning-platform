import type { NodejsLesson } from '../nodejs-curriculum';

export const nodejsPromisesLesson: NodejsLesson = {
  id: 'nodejs-promises',
  title: 'Promises',
  slug: 'promises',
  chapter: 'async',
  order: 12,
  difficulty: 'intermediate',
  readingTime: 14,
  description: 'Promise fundamentals, .then/.catch/.finally, chaining, Promise.all, Promise.race, and error handling.',
  sections: [
    {
      type: 'text',
      content: 'A Promise is an object representing a value that will be available in the future. Promises solve callback hell by letting you chain async operations with .then() instead of nesting callbacks. A Promise can be pending, fulfilled (resolved with a value), or rejected (failed with an error).',
    },
    {
      type: 'analogy',
      title: 'Promise as a restaurant receipt',
      content: 'When you order food, you get a receipt (Promise). The receipt is not the food itself - it is a promise that food will arrive. Eventually the receipt resolves (food arrives) or is rejected (kitchen is closed). You can attach actions to the receipt: .then(eatFood) or .catch(orderFromElsewhere).',
    },
    {
      type: 'heading',
      content: 'Creating and Using Promises',
    },
    {
      type: 'example',
      title: 'Promise basics',
      content: 'Create a Promise with the Promise constructor. It receives a function with resolve and reject parameters.',
      language: 'javascript',
      code: `// Creating a Promise
const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = Math.random() > 0.5;
    if (success) {
      resolve('Operation succeeded!'); // fulfills the promise
    } else {
      reject(new Error('Operation failed')); // rejects the promise
    }
  }, 1000);
});

// Using the Promise
myPromise
  .then(result => {
    console.log('Success:', result);
  })
  .catch(error => {
    console.error('Error:', error.message);
  })
  .finally(() => {
    console.log('Promise settled (either resolved or rejected)');
  });

// A Promise that always resolves
const immediatePromise = Promise.resolve(42);
immediatePromise.then(value => console.log(value)); // 42

// A Promise that always rejects
const rejectedPromise = Promise.reject(new Error('Failed'));
rejectedPromise.catch(err => console.error(err.message)); // "Failed"`,
    },
    {
      type: 'heading',
      content: 'Promise Chaining',
    },
    {
      type: 'text',
      content: 'Each .then() returns a new Promise, so you can chain multiple async operations. The return value of one .then() becomes the input to the next. This eliminates callback hell and creates a clear sequence of operations.',
    },
    {
      type: 'example',
      title: 'Chaining async operations',
      content: 'Return values flow through the chain. Each .then() receives the previous result.',
      language: 'javascript',
      code: `// Chaining Promises - flat, readable code
fetch('https://api.example.com/user/123')
  .then(response => response.json())       // parse JSON
  .then(user => {
    console.log('User:', user.name);
    return fetch(\`https://api.example.com/user/\${user.id}/posts\`);
  })
  .then(response => response.json())       // parse posts JSON
  .then(posts => {
    console.log('User has', posts.length, 'posts');
    return posts[0];                        // pass first post to next then
  })
  .then(firstPost => {
    console.log('Latest post:', firstPost.title);
  })
  .catch(error => {
    console.error('Error anywhere in the chain:', error);
  });

// Compare to callback hell:
// fetchUser(123, function(err, user) {
//   if (err) return console.error(err);
//   fetchPosts(user.id, function(err, posts) {
//     if (err) return console.error(err);
//     console.log(posts[0]);
//   });
// });`,
    },
    {
      type: 'heading',
      content: 'Promise Combinators',
    },
    {
      type: 'table',
      headers: ['Method', 'Behavior', 'Use Case'],
      rows: [
        ['Promise.all()', 'Waits for all to resolve, rejects if any reject', 'Fetch multiple resources in parallel'],
        ['Promise.race()', 'Resolves/rejects with the first to settle', 'Timeout pattern, fastest source wins'],
        ['Promise.allSettled()', 'Waits for all to settle (resolve or reject)', 'Run all, handle errors individually'],
        ['Promise.any()', 'Resolves with first to resolve, rejects if all reject', 'First successful response wins'],
      ],
    },
    {
      type: 'example',
      title: 'Promise.all - parallel operations',
      content: 'Run multiple Promises in parallel and wait for all to complete.',
      language: 'javascript',
      code: `const promise1 = fetch('/api/users');
const promise2 = fetch('/api/posts');
const promise3 = fetch('/api/comments');

// Wait for all three to complete
Promise.all([promise1, promise2, promise3])
  .then(([usersRes, postsRes, commentsRes]) => {
    // All three responses available here
    return Promise.all([
      usersRes.json(),
      postsRes.json(),
      commentsRes.json()
    ]);
  })
  .then(([users, posts, comments]) => {
    console.log('Loaded:', users.length, 'users');
    console.log('Loaded:', posts.length, 'posts');
    console.log('Loaded:', comments.length, 'comments');
  })
  .catch(error => {
    // If ANY promise rejects, this catch runs
    console.error('One of the requests failed:', error);
  });

// Shorter version
Promise.all([
  fetch('/api/users').then(r => r.json()),
  fetch('/api/posts').then(r => r.json()),
  fetch('/api/comments').then(r => r.json())
])
  .then(([users, posts, comments]) => {
    console.log(users, posts, comments);
  })
  .catch(error => console.error(error));`,
    },
    {
      type: 'example',
      title: 'Promise.race - timeout pattern',
      content: 'Use Promise.race to implement timeouts or take the fastest result.',
      language: 'javascript',
      code: `// Create a timeout Promise
function timeout(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('Timeout')), ms);
  });
}

// Race between fetch and timeout
Promise.race([
  fetch('https://slow-api.example.com/data'),
  timeout(5000) // 5 second timeout
])
  .then(response => response.json())
  .then(data => console.log('Got data:', data))
  .catch(error => {
    if (error.message === 'Timeout') {
      console.error('Request took too long');
    } else {
      console.error('Request failed:', error);
    }
  });

// Fastest mirror wins
const mirrors = [
  fetch('https://mirror1.example.com/file.zip'),
  fetch('https://mirror2.example.com/file.zip'),
  fetch('https://mirror3.example.com/file.zip')
];

Promise.race(mirrors)
  .then(response => {
    console.log('Fastest mirror responded');
    return response.blob();
  })
  .then(blob => console.log('Downloaded', blob.size, 'bytes'));`,
    },
    {
      type: 'example',
      title: 'Promise.allSettled - handle all results',
      content: 'Get results from all Promises regardless of success or failure.',
      language: 'javascript',
      code: `const promises = [
  fetch('/api/users').then(r => r.json()),
  fetch('/api/invalid-endpoint').then(r => r.json()), // will fail
  fetch('/api/posts').then(r => r.json())
];

Promise.allSettled(promises)
  .then(results => {
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(\`Promise \${index} succeeded:\`, result.value);
      } else {
        console.error(\`Promise \${index} failed:\`, result.reason);
      }
    });
  });

// Output:
// Promise 0 succeeded: [users array]
// Promise 1 failed: Error: 404 Not Found
// Promise 2 succeeded: [posts array]`,
    },
    {
      type: 'heading',
      content: 'Converting Callbacks to Promises',
    },
    {
      type: 'example',
      title: 'Promisify callback-based functions',
      content: 'Wrap callback functions in Promises for cleaner code.',
      language: 'javascript',
      code: `const fs = require('fs');
const util = require('util');

// Manual promisification
function readFilePromise(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

// Use it with .then
readFilePromise('data.txt')
  .then(data => console.log(data))
  .catch(err => console.error(err));

// Or use Node's built-in util.promisify
const readFileAsync = util.promisify(fs.readFile);

readFileAsync('data.txt', 'utf8')
  .then(data => console.log(data))
  .catch(err => console.error(err));

// Modern Node.js has fs.promises built-in
const fsPromises = require('fs').promises;

fsPromises.readFile('data.txt', 'utf8')
  .then(data => console.log(data))
  .catch(err => console.error(err));`,
    },
    {
      type: 'tryit',
      title: 'Promise Playground',
      css: `body{font-family:system-ui,sans-serif;padding:16px;margin:0;background:#fef3c7;}
.container{max-width:750px;margin:0 auto;}
.header{background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);color:#fff;padding:16px 20px;border-radius:10px;margin-bottom:16px;}
.header h2{margin:0 0 4px;font-size:18px;}
.header p{margin:0;opacity:0.95;font-size:13px;}
.section{background:#fff;border:2px solid #fbbf24;border-radius:10px;padding:16px;margin-bottom:16px;}
.section-title{font-size:14px;font-weight:700;color:#92400e;margin-bottom:12px;}
.btn-group{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:12px;}
.btn{padding:9px 18px;border:none;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;background:#f59e0b;color:#fff;}
.btn:hover{background:#d97706;}
.btn.secondary{background:#64748b;}
.btn.secondary:hover{background:#475569;}
.output{background:#1e293b;color:#e2e8f0;padding:14px;border-radius:8px;font-family:monospace;font-size:12px;white-space:pre-wrap;min-height:80px;max-height:250px;overflow:auto;}
.promise-box{display:inline-block;padding:8px 14px;margin:4px;border-radius:6px;font-size:12px;font-weight:600;}
.pending{background:#fef3c7;color:#92400e;border:2px solid #fbbf24;}
.fulfilled{background:#d1fae5;color:#065f46;border:2px solid #10b981;}
.rejected{background:#fee2e2;color:#991b1b;border:2px solid #ef4444;}`,
      js: `var log = [];

function addLog(msg) {
  log.push(msg);
  if (log.length > 20) log.shift();
  document.getElementById('output').textContent = log.join('\\n');
}

function clearLog() {
  log = [];
  document.getElementById('output').textContent = 'Console cleared';
}

function simplePromise() {
  addLog('[Created] New Promise');
  var p = new Promise(function(resolve) {
    setTimeout(function() {
      resolve('Promise resolved!');
      addLog('[Resolved] Promise fulfilled with value');
    }, 1200);
  });
  p.then(function(val) {
    addLog('[.then()] Received: ' + val);
  });
  addLog('[Status] Promise is pending...');
}

function chainedPromise() {
  addLog('[Chain Start] Step 1');
  Promise.resolve(10)
    .then(function(val) {
      addLog('[Step 1] Received ' + val + ', returning ' + (val * 2));
      return val * 2;
    })
    .then(function(val) {
      addLog('[Step 2] Received ' + val + ', returning ' + (val + 5));
      return val + 5;
    })
    .then(function(val) {
      addLog('[Step 3] Final value: ' + val);
    });
}

function promiseAll() {
  addLog('[Promise.all] Starting 3 promises...');
  var p1 = new Promise(function(resolve) { setTimeout(function() { resolve('P1 done'); }, 500); });
  var p2 = new Promise(function(resolve) { setTimeout(function() { resolve('P2 done'); }, 800); });
  var p3 = new Promise(function(resolve) { setTimeout(function() { resolve('P3 done'); }, 300); });
  
  Promise.all([p1, p2, p3]).then(function(results) {
    addLog('[All Complete] ' + results.join(', '));
  });
}

function promiseRace() {
  addLog('[Promise.race] Racing 3 promises...');
  var p1 = new Promise(function(resolve) { setTimeout(function() { resolve('P1 wins!'); }, 700); });
  var p2 = new Promise(function(resolve) { setTimeout(function() { resolve('P2 wins!'); }, 400); });
  var p3 = new Promise(function(resolve) { setTimeout(function() { resolve('P3 wins!'); }, 900); });
  
  Promise.race([p1, p2, p3]).then(function(winner) {
    addLog('[Winner] ' + winner);
  });
}

function errorHandling() {
  addLog('[Error Test] Creating promise that rejects');
  Promise.reject(new Error('Something went wrong'))
    .catch(function(err) {
      addLog('[.catch()] Caught error: ' + err.message);
    })
    .finally(function() {
      addLog('[.finally()] Cleanup always runs');
    });
}

document.getElementById('output').innerHTML =
  '<div class="container">' +
  '<div class="header"><h2>Promise Playground</h2><p>Explore Promise patterns interactively</p></div>' +
  '<div class="section">' +
  '<div class="section-title">Promise Operations</div>' +
  '<div class="btn-group">' +
  '<button class="btn" onclick="simplePromise()">Simple Promise</button>' +
  '<button class="btn" onclick="chainedPromise()">Chained .then()</button>' +
  '<button class="btn" onclick="promiseAll()">Promise.all</button>' +
  '<button class="btn" onclick="promiseRace()">Promise.race</button>' +
  '<button class="btn secondary" onclick="errorHandling()">Error Handling</button>' +
  '<button class="btn secondary" onclick="clearLog()">Clear</button>' +
  '</div>' +
  '<div class="output" id="output">Click buttons to see Promises in action...</div>' +
  '</div>' +
  '<div class="section">' +
  '<div class="section-title">Promise States</div>' +
  '<div><span class="promise-box pending">Pending</span> Waiting for result</div>' +
  '<div><span class="promise-box fulfilled">Fulfilled</span> Resolved successfully</div>' +
  '<div><span class="promise-box rejected">Rejected</span> Failed with error</div>' +
  '</div>' +
  '</div>';`,
    },
  ],
  exercises: [
    {
      id: 'nodejs-promises-1',
      question: 'What are the three states of a Promise?',
      type: 'multiple-choice',
      options: [
        'open, closed, error',
        'pending, fulfilled, rejected',
        'waiting, complete, failed',
        'new, resolved, cancelled',
      ],
      correct: 1,
      explanation: 'A Promise starts in the pending state. It transitions to fulfilled (resolved with a value) or rejected (failed with an error). Once settled (fulfilled or rejected), it never changes state.',
    },
    {
      id: 'nodejs-promises-2',
      question: 'What does Promise.all() do if one promise rejects?',
      type: 'multiple-choice',
      options: [
        'It waits for all promises to finish, then returns results',
        'It immediately rejects with that error, ignoring other promises',
        'It replaces the rejected promise with null',
        'It retries the failed promise automatically',
      ],
      correct: 1,
      explanation: 'Promise.all() short-circuits on the first rejection. As soon as any promise rejects, the entire Promise.all() rejects with that error. Use Promise.allSettled() if you want to wait for all promises regardless of success or failure.',
    },
  ],
  quiz: [
    {
      id: 'nodejs-promises-q1',
      question: 'What does .then() return?',
      options: [
        'The original Promise',
        'The resolved value',
        'A new Promise',
        'undefined',
      ],
      correct: 2,
      explanation: '.then() always returns a new Promise. This allows chaining. If you return a value from .then(), it wraps that value in a resolved Promise. If you return a Promise, it returns that Promise directly.',
    },
  ],
};
