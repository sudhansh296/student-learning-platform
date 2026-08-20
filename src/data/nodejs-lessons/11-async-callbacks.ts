import type { NodejsLesson } from '../nodejs-curriculum';

export const nodejsAsyncCallbacksLesson: NodejsLesson = {
  id: 'nodejs-async-callbacks',
  title: 'Callbacks & Async Patterns',
  slug: 'async-callbacks',
  chapter: 'async',
  order: 11,
  difficulty: 'beginner',
  readingTime: 12,
  description: 'The callback pattern, error-first callbacks, callback hell, and why Node.js is asynchronous.',
  sections: [
    {
      type: 'text',
      content: 'Node.js is built on asynchronous I/O. Instead of waiting for operations to complete (blocking), Node.js uses callbacks - functions that run when an operation finishes. This pattern lets Node.js handle thousands of concurrent operations on a single thread.',
    },
    {
      type: 'analogy',
      title: 'Callbacks are like restaurant buzzers',
      content: 'When you order food, the restaurant gives you a buzzer and you go sit down (non-blocking). When your order is ready, the buzzer goes off (callback fires). You do not stand at the counter waiting (blocking). The restaurant can serve many customers at once because no one is blocking the counter.',
    },
    {
      type: 'heading',
      content: 'The Callback Pattern',
    },
    {
      type: 'text',
      content: 'A callback is a function passed to another function. The receiving function calls it when work completes. Node.js uses the "error-first callback" convention: the first parameter is always an error object (or null if no error), and subsequent parameters are results.',
    },
    {
      type: 'example',
      title: 'Error-first callbacks',
      content: 'The Node.js callback convention always puts errors first. Check for errors before accessing results.',
      language: 'javascript',
      code: `const fs = require('fs');

// Error-first callback pattern
fs.readFile('data.txt', 'utf8', function(err, data) {
  if (err) {
    console.error('Error reading file:', err.message);
    return; // always return early on error
  }
  console.log('File contents:', data);
});

// Multiple async operations in sequence
fs.readFile('users.json', 'utf8', function(err, data) {
  if (err) return console.error('Read error:', err);
  
  const users = JSON.parse(data);
  console.log('Loaded', users.length, 'users');
  
  // Write transformed data
  fs.writeFile('output.json', JSON.stringify(users, null, 2), function(err) {
    if (err) return console.error('Write error:', err);
    console.log('Users saved to output.json');
  });
});`,
    },
    {
      type: 'heading',
      content: 'Callback Hell',
    },
    {
      type: 'text',
      content: 'When you need multiple async operations in sequence, callbacks nest inside callbacks. This creates deeply indented code known as "callback hell" or "pyramid of doom". It is hard to read, hard to debug, and hard to handle errors consistently.',
    },
    {
      type: 'example',
      title: 'Callback hell example',
      content: 'Nested callbacks create deep indentation and duplicated error handling.',
      language: 'javascript',
      code: `// CALLBACK HELL - hard to read and maintain
fs.readFile('config.json', 'utf8', function(err, configData) {
  if (err) return console.error(err);
  
  const config = JSON.parse(configData);
  
  fs.readFile(config.userFile, 'utf8', function(err, userData) {
    if (err) return console.error(err);
    
    const users = JSON.parse(userData);
    
    processUsers(users, function(err, processed) {
      if (err) return console.error(err);
      
      fs.writeFile('output.json', JSON.stringify(processed), function(err) {
        if (err) return console.error(err);
        
        console.log('Done!');
        // 5 levels deep!
      });
    });
  });
});

// Solution: use Promises or async/await (next lessons)`,
    },
    {
      type: 'example',
      title: 'Creating your own async functions with callbacks',
      content: 'When writing async functions, follow the error-first callback convention.',
      language: 'javascript',
      code: `// Async function that takes a callback
function fetchUser(userId, callback) {
  // Simulate network delay
  setTimeout(function() {
    if (userId < 1) {
      // Error case - pass error as first argument
      return callback(new Error('Invalid user ID'));
    }
    // Success case - pass null for error, data as second argument
    callback(null, { id: userId, name: 'User ' + userId });
  }, 1000);
}

// Using the async function
fetchUser(5, function(err, user) {
  if (err) {
    console.error('Error:', err.message);
    return;
  }
  console.log('Fetched user:', user);
});

// Parallel async operations with a counter
let completed = 0;
const results = [];

[1, 2, 3].forEach(function(id) {
  fetchUser(id, function(err, user) {
    if (err) return console.error(err);
    results.push(user);
    completed++;
    if (completed === 3) {
      console.log('All users fetched:', results);
    }
  });
});`,
    },
    {
      type: 'heading',
      content: 'Handling Multiple Callbacks',
    },
    {
      type: 'example',
      title: 'Parallel vs sequential callbacks',
      content: 'Run operations in parallel when they do not depend on each other, or sequentially when each depends on the previous result.',
      language: 'javascript',
      code: `// SEQUENTIAL - each operation waits for the previous
function sequential(callback) {
  step1(function(err, result1) {
    if (err) return callback(err);
    step2(result1, function(err, result2) {
      if (err) return callback(err);
      step3(result2, function(err, result3) {
        if (err) return callback(err);
        callback(null, result3);
      });
    });
  });
}

// PARALLEL - all start at once, wait for all to finish
function parallel(callback) {
  let completed = 0;
  let hasError = false;
  const results = [];
  
  function checkDone() {
    if (++completed === 3 && !hasError) {
      callback(null, results);
    }
  }
  
  asyncOp1(function(err, result) {
    if (err) { hasError = true; return callback(err); }
    results[0] = result;
    checkDone();
  });
  
  asyncOp2(function(err, result) {
    if (err) { hasError = true; return callback(err); }
    results[1] = result;
    checkDone();
  });
  
  asyncOp3(function(err, result) {
    if (err) { hasError = true; return callback(err); }
    results[2] = result;
    checkDone();
  });
}`,
    },
    {
      type: 'note',
      title: 'Why callbacks?',
      content: 'Callbacks were the original async pattern in JavaScript and Node.js. Modern code uses Promises and async/await, which are syntactic improvements built on top of callbacks. Understanding callbacks helps you work with older code and understand how async JavaScript works under the hood.',
    },
    {
      type: 'tryit',
      title: 'Async Callback Visualizer',
      css: `body{font-family:system-ui,sans-serif;padding:16px;margin:0;background:#f0fdf4;}
.container{max-width:700px;margin:0 auto;}
.header{background:linear-gradient(135deg,#339933 0%,#2d7a2d 100%);color:#fff;padding:16px 20px;border-radius:10px;margin-bottom:16px;}
.header h2{margin:0 0 4px;font-size:18px;}
.header p{margin:0;opacity:0.9;font-size:13px;}
.controls{display:flex;gap:10px;margin-bottom:16px;}
.btn{padding:10px 20px;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;background:#339933;color:#fff;}
.btn:hover{background:#2d7a2d;}
.btn.secondary{background:#64748b;}
.btn.secondary:hover{background:#475569;}
.timeline{background:#fff;border:2px solid #e2e8f0;border-radius:10px;padding:16px;min-height:300px;}
.event{display:flex;align-items:start;gap:12px;margin-bottom:12px;padding:10px;background:#f8fafc;border-radius:6px;border-left:4px solid #339933;animation:slideIn 0.3s ease-out;}
@keyframes slideIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
.event-icon{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}
.event-icon.start{background:#dbeafe;color:#1e40af;}
.event-icon.callback{background:#d1fae5;color:#065f46;}
.event-icon.error{background:#fee2e2;color:#991b1b;}
.event-content{flex:1;}
.event-title{font-weight:700;font-size:13px;color:#334155;margin-bottom:2px;}
.event-desc{font-size:12px;color:#64748b;}
.event-time{font-size:11px;color:#94a3b8;font-family:monospace;}`,
      js: `var events = [];
var eventId = 0;

function addEvent(type, title, desc) {
  var icon = type === 'start' ? '>' : type === 'callback' ? '✓' : '✗';
  var iconClass = type;
  var time = new Date().toLocaleTimeString();
  events.push({
    id: eventId++,
    icon: icon,
    iconClass: iconClass,
    title: title,
    desc: desc,
    time: time
  });
  render();
}

function simulateAsync() {
  events = [];
  eventId = 0;
  addEvent('start', 'fs.readFile() called', 'Reading users.json from disk');
  
  setTimeout(function() {
    addEvent('callback', 'File read complete', 'Callback invoked with data');
    
    setTimeout(function() {
      addEvent('start', 'processUsers() called', 'Transforming user data');
      
      setTimeout(function() {
        addEvent('callback', 'Processing complete', 'Callback invoked with results');
        
        setTimeout(function() {
          addEvent('start', 'fs.writeFile() called', 'Writing output.json to disk');
          
          setTimeout(function() {
            addEvent('callback', 'File write complete', 'All operations finished');
          }, 600);
        }, 400);
      }, 600);
    }, 400);
  }, 800);
}

function simulateError() {
  events = [];
  eventId = 0;
  addEvent('start', 'fs.readFile() called', 'Reading missing.json from disk');
  
  setTimeout(function() {
    addEvent('error', 'Error in callback', 'ENOENT: file not found');
    addEvent('callback', 'Error handled', 'Returned early, no further operations');
  }, 800);
}

function simulateParallel() {
  events = [];
  eventId = 0;
  addEvent('start', 'fetchUser(1) called', 'All three requests start simultaneously');
  addEvent('start', 'fetchUser(2) called', 'Running in parallel');
  addEvent('start', 'fetchUser(3) called', 'No waiting for previous calls');
  
  setTimeout(function() { addEvent('callback', 'User 2 fetched', 'Second request finishes first'); }, 500);
  setTimeout(function() { addEvent('callback', 'User 1 fetched', 'First request finishes second'); }, 700);
  setTimeout(function() { addEvent('callback', 'User 3 fetched', 'All complete - results combined'); }, 900);
}

function render() {
  var timeline = events.map(function(e) {
    return '<div class="event">' +
      '<div class="event-icon ' + e.iconClass + '">' + e.icon + '</div>' +
      '<div class="event-content">' +
      '<div class="event-title">' + e.title + '</div>' +
      '<div class="event-desc">' + e.desc + '</div>' +
      '<div class="event-time">' + e.time + '</div>' +
      '</div></div>';
  }).join('');
  
  document.getElementById('timeline').innerHTML = timeline || '<div style="color:#94a3b8;text-align:center;padding:40px">Click a button to see async callbacks in action</div>';
}

document.getElementById('output').innerHTML =
  '<div class="container">' +
  '<div class="header"><h2>Async Callback Timeline</h2><p>Watch how callbacks execute over time</p></div>' +
  '<div class="controls">' +
  '<button class="btn" onclick="simulateAsync()">Sequential Callbacks</button>' +
  '<button class="btn secondary" onclick="simulateError()">Error Handling</button>' +
  '<button class="btn secondary" onclick="simulateParallel()">Parallel Callbacks</button>' +
  '</div>' +
  '<div class="timeline" id="timeline"></div>' +
  '</div>';

render();`,
    },
  ],
  exercises: [
    {
      id: 'nodejs-callbacks-1',
      question: 'In Node.js error-first callbacks, what is the first parameter?',
      type: 'multiple-choice',
      options: [
        'The result data',
        'The error object (or null if no error)',
        'The callback function itself',
        'A success boolean',
      ],
      correct: 1,
      explanation: 'Error-first callbacks always pass the error as the first parameter. It is null or undefined if no error occurred. This convention lets you check for errors before accessing result data.',
    },
    {
      id: 'nodejs-callbacks-2',
      question: 'What is "callback hell"?',
      type: 'multiple-choice',
      options: [
        'When callbacks run too slowly',
        'Deeply nested callbacks that are hard to read and maintain',
        'When a callback throws an error',
        'Callbacks that run in the wrong order',
      ],
      correct: 1,
      explanation: 'Callback hell refers to deeply nested callback functions, creating a "pyramid of doom" indentation. It makes code hard to read, debug, and maintain. Promises and async/await solve this problem.',
    },
  ],
  quiz: [
    {
      id: 'nodejs-callbacks-q1',
      question: 'Why does Node.js use callbacks instead of blocking operations?',
      options: [
        'Callbacks are faster to execute than synchronous code',
        'Callbacks let Node.js handle many operations concurrently on a single thread',
        'Callbacks use less memory than other patterns',
        'Callbacks are required by the JavaScript language',
      ],
      correct: 1,
      explanation: 'Node.js is single-threaded but uses non-blocking I/O with callbacks. When an async operation starts, Node registers the callback and continues executing other code. The callback runs when the operation completes. This lets one thread handle thousands of concurrent operations.',
    },
  ],
};
