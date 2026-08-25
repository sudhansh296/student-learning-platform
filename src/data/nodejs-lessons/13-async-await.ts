import type { NodejsLesson } from '../nodejs-curriculum';

export const nodejsAsyncAwaitLesson: NodejsLesson = {
  id: 'nodejs-async-await',
  title: 'Async/Await',
  slug: 'async-await',
  chapter: 'async',
  order: 13,
  difficulty: 'intermediate',
  readingTime: 13,
  description: 'Modern async JavaScript with async/await syntax, error handling with try/catch, and parallel patterns.',
  sections: [
    {
      type: 'text',
      content: 'Async/await is syntactic sugar over Promises. It lets you write asynchronous code that looks synchronous. An async function always returns a Promise. Inside an async function, you can await other Promises - execution pauses until the Promise resolves, then continues with the resolved value.',
    },
    {
      type: 'analogy',
      title: 'Async/await is like a personal assistant',
      content: 'You tell your assistant "await the package delivery" and they wait at the door while you continue working. When the package arrives, they bring it to you and you resume. You do not have to check the door every few minutes (callbacks) or chain together complicated instructions (promise chains) - the assistant handles the waiting.',
    },
    {
      type: 'heading',
      content: 'Basic Async/Await',
    },
    {
      type: 'example',
      title: 'Converting Promises to async/await',
      content: 'Compare Promise chains to async/await. Both do the same thing, but async/await is cleaner.',
      language: 'javascript',
      code: `// With Promises (chain style)
function getUserPostsPromise(userId) {
  return fetch(\`/api/users/\${userId}\`)
    .then(response => response.json())
    .then(user => {
      console.log('User:', user.name);
      return fetch(\`/api/users/\${user.id}/posts\`);
    })
    .then(response => response.json())
    .then(posts => {
      console.log('Posts:', posts.length);
      return posts;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}

// With async/await (cleaner!)
async function getUserPostsAsync(userId) {
  try {
    const userResponse = await fetch(\`/api/users/\${userId}\`);
    const user = await userResponse.json();
    console.log('User:', user.name);
    
    const postsResponse = await fetch(\`/api/users/\${user.id}/posts\`);
    const posts = await postsResponse.json();
    console.log('Posts:', posts.length);
    
    return posts;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Calling an async function
getUserPostsAsync(123)
  .then(posts => console.log('Got posts:', posts))
  .catch(err => console.error(err));

// Or await it in another async function
async function main() {
  const posts = await getUserPostsAsync(123);
  console.log(posts);
}`,
    },
    {
      type: 'heading',
      content: 'Error Handling with Try/Catch',
    },
    {
      type: 'example',
      title: 'Try/catch for async errors',
      content: 'Use try/catch blocks to handle rejected Promises in async functions.',
      language: 'javascript',
      code: `async function fetchData(url) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch failed:', error.message);
    
    // Re-throw if you want calling code to handle it
    throw error;
    
    // Or return a default value
    // return { error: true, message: error.message };
  }
}

// Multiple try/catch blocks for granular error handling
async function complexOperation() {
  let user;
  try {
    user = await fetchUser();
  } catch (error) {
    console.error('User fetch failed, using guest');
    user = { id: 0, name: 'Guest' };
  }
  
  let posts;
  try {
    posts = await fetchPosts(user.id);
  } catch (error) {
    console.error('Posts fetch failed, using empty array');
    posts = [];
  }
  
  return { user, posts };
}`,
    },
    {
      type: 'heading',
      content: 'Parallel Execution',
    },
    {
      type: 'text',
      content: 'Await pauses execution, so multiple awaits run sequentially. To run operations in parallel, start them all (without await), then await the results. Or use Promise.all() with await.',
    },
    {
      type: 'example',
      title: 'Sequential vs parallel async operations',
      content: 'Sequential awaits wait for each to finish. Parallel operations start simultaneously.',
      language: 'javascript',
      code: `// SEQUENTIAL - waits for each before starting the next (SLOW)
async function sequential() {
  const user = await fetchUser();      // 500ms
  const posts = await fetchPosts();    // 500ms  
  const comments = await fetchComments(); // 500ms
  // Total: 1500ms
  return { user, posts, comments };
}

// PARALLEL - all start at once (FAST)
async function parallel() {
  // Start all fetches immediately (do not await yet)
  const userPromise = fetchUser();
  const postsPromise = fetchPosts();
  const commentsPromise = fetchComments();
  
  // Now await all results
  const user = await userPromise;        // 500ms
  const posts = await postsPromise;      // (already running)
  const comments = await commentsPromise; // (already running)
  // Total: 500ms (all run simultaneously)
  return { user, posts, comments };
}

// PARALLEL with Promise.all - cleaner
async function parallelWithAll() {
  const [user, posts, comments] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchComments()
  ]);
  // Total: 500ms
  return { user, posts, comments };
}

// When to use sequential vs parallel:
// - Sequential: later operations depend on earlier results
// - Parallel: operations are independent`,
    },
    {
      type: 'example',
      title: 'Real-world example: fetch and process data',
      content: 'Complete example with error handling and parallel operations.',
      language: 'javascript',
      code: `const fsPromises = require('fs').promises;

async function processUsers() {
  try {
    // Read file
    console.log('Reading users.json...');
    const data = await fsPromises.readFile('users.json', 'utf8');
    const users = JSON.parse(data);
    
    // Process each user (parallel)
    console.log(\`Processing \${users.length} users...\`);
    const enrichedUsers = await Promise.all(
      users.map(async (user) => {
        // Fetch additional data for each user in parallel
        const posts = await fetchUserPosts(user.id);
        return {
          ...user,
          postCount: posts.length,
          lastPost: posts[0] || null
        };
      })
    );
    
    // Write results
    console.log('Writing results...');
    await fsPromises.writeFile(
      'enriched-users.json',
      JSON.stringify(enrichedUsers, null, 2)
    );
    
    console.log('Done!');
    return enrichedUsers;
  } catch (error) {
    console.error('Processing failed:', error.message);
    throw error;
  }
}

// Async IIFE (Immediately Invoked Function Expression)
(async () => {
  try {
    const result = await processUsers();
    console.log('Success:', result.length, 'users processed');
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
})();`,
    },
    {
      type: 'heading',
      content: 'Common Patterns',
    },
    {
      type: 'example',
      title: 'Timeout and retry patterns',
      content: 'Implement timeout and retry logic with async/await.',
      language: 'javascript',
      code: `// Timeout pattern
async function fetchWithTimeout(url, timeoutMs = 5000) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), timeoutMs);
  });
  
  const fetchPromise = fetch(url).then(r => r.json());
  
  return Promise.race([fetchPromise, timeoutPromise]);
}

// Usage
try {
  const data = await fetchWithTimeout('/api/slow-endpoint', 3000);
  console.log(data);
} catch (error) {
  if (error.message === 'Timeout') {
    console.error('Request timed out after 3 seconds');
  }
}

// Retry pattern
async function fetchWithRetry(url, maxRetries = 3) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(\`Attempt \${i + 1} of \${maxRetries}\`);
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      lastError = error;
      console.error(\`Attempt \${i + 1} failed:, error.message\`);
      
      // Wait before retrying (exponential backoff)
      if (i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}`,
    },
    {
      type: 'note',
      title: 'Top-level await',
      content: 'In modern Node.js (v14.8+) with ES modules, you can use await at the top level of a module without wrapping in an async function. In CommonJS, you still need an async function wrapper or IIFE.',
    },
    {
      type: 'tryit',
      title: 'Async/Await Visualizer',
      css: `body{font-family:system-ui,sans-serif;padding:16px;margin:0;background:#eff6ff;}
.container{max-width:800px;margin:0 auto;}
.header{background:linear-gradient(135deg,#3b82f6 0%,#1d4ed8 100%);color:#fff;padding:16px 20px;border-radius:10px;margin-bottom:16px;}
.header h2{margin:0 0 4px;font-size:18px;}
.header p{margin:0;opacity:0.95;font-size:13px;}
.controls{display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;}
.btn{padding:10px 20px;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;background:#3b82f6;color:#fff;}
.btn:hover{background:#2563eb;}
.btn.secondary{background:#64748b;}
.btn.secondary:hover{background:#475569;}
.side-by-side{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;}
.code-panel{background:#fff;border:2px solid #93c5fd;border-radius:10px;padding:14px;}
.panel-title{font-size:13px;font-weight:700;color:#1e40af;margin-bottom:8px;display:flex;align-items:center;gap:6px;}
.badge{display:inline-block;background:#dbeafe;color:#1e40af;padding:2px 8px;border-radius:12px;font-size:10px;}
.code{background:#1e293b;color:#e2e8f0;padding:12px;border-radius:6px;font-family:monospace;font-size:11px;white-space:pre;overflow-x:auto;line-height:1.6;}
.timeline{background:#fff;border:2px solid #93c5fd;border-radius:10px;padding:14px;min-height:200px;}
.event{padding:8px 12px;margin:4px 0;border-radius:6px;font-size:12px;display:flex;align-items:center;gap:8px;}
.event.await{background:#fef3c7;border-left:4px solid #f59e0b;}
.event.done{background:#d1fae5;border-left:4px solid #10b981;}
.event.error{background:#fee2e2;border-left:4px solid #ef4444;}
.event-time{color:#64748b;font-family:monospace;font-size:10px;min-width:50px;}`,
      js: `var events = [];

function addEvent(type, msg, time) {
  events.push({ type: type, msg: msg, time: time });
  renderTimeline();
}

function clearEvents() {
  events = [];
  renderTimeline();
}

function renderTimeline() {
  var html = events.map(function(e) {
    return '<div class="event ' + e.type + '"><span class="event-time">' + e.time + 'ms</span>' + e.msg + '</div>';
  }).join('');
  document.getElementById('timeline').innerHTML = html || '<div style="color:#94a3b8;padding:20px;text-align:center">Click a button to see async/await in action</div>';
}

function demoSequential() {
  clearEvents();
  addEvent('await', 'await fetchUser() - waiting...', 0);
  setTimeout(function() {
    addEvent('done', 'fetchUser() resolved - user received', 500);
    addEvent('await', 'await fetchPosts() - waiting...', 500);
    setTimeout(function() {
      addEvent('done', 'fetchPosts() resolved - posts received', 1000);
      addEvent('await', 'await fetchComments() - waiting...', 1000);
      setTimeout(function() {
        addEvent('done', 'fetchComments() resolved - all done!', 1500);
      }, 500);
    }, 500);
  }, 500);
}

function demoParallel() {
  clearEvents();
  addEvent('await', 'Starting fetchUser(), fetchPosts(), fetchComments()...', 0);
  addEvent('await', 'All three requests running in parallel', 0);
  setTimeout(function() {
    addEvent('done', 'fetchComments() resolved (fastest)', 300);
  }, 300);
  setTimeout(function() {
    addEvent('done', 'fetchUser() resolved', 500);
  }, 500);
  setTimeout(function() {
    addEvent('done', 'fetchPosts() resolved - all done!', 700);
  }, 700);
}

function demoError() {
  clearEvents();
  addEvent('await', 'try { await fetchData() }', 0);
  setTimeout(function() {
    addEvent('error', 'Promise rejected - jumping to catch block', 800);
    addEvent('done', 'catch (error) { console.error(error) }', 800);
  }, 800);
}

document.getElementById('output').innerHTML =
  '<div class="container">' +
  '<div class="header"><h2>Async/Await Visualizer</h2><p>See how async/await executes over time</p></div>' +
  '<div class="controls">' +
  '<button class="btn" onclick="demoSequential()">Sequential Awaits</button>' +
  '<button class="btn" onclick="demoParallel()">Parallel Execution</button>' +
  '<button class="btn secondary" onclick="demoError()">Error Handling</button>' +
  '<button class="btn secondary" onclick="clearEvents()">Clear</button>' +
  '</div>' +
  '<div class="side-by-side">' +
  '<div class="code-panel">' +
  '<div class="panel-title">Sequential<span class="badge">SLOW</span></div>' +
  '<div class="code">async function sequential() {\   const user = await fetch();\   const posts = await fetch();\   const comments = await fetch();\   // Total: 1500ms\ }</div>' +
  '</div>' +
  '<div class="code-panel">' +
  '<div class="panel-title">Parallel<span class="badge">FAST</span></div>' +
  '<div class="code">async function parallel() {\   const [user, posts, comments] =\     await Promise.all([\       fetch(), fetch(), fetch()\     ]);\   // Total: 500ms\ }</div>' +
  '</div>' +
  '</div>' +
  '<div class="timeline" id="timeline"></div>' +
  '</div>';

renderTimeline();`,
    },
  ],
  exercises: [
    {
      id: 'nodejs-async-1',
      question: 'What does an async function always return?',
      type: 'multiple-choice',
      options: [
        'The value you return from the function',
        'A Promise',
        'undefined if you do not return anything',
        'The result of the last await',
      ],
      correct: 1,
      explanation: 'Async functions always return a Promise. If you return a value, it is wrapped in a resolved Promise. If you throw an error, it becomes a rejected Promise. This is why you can .then() and .catch() an async function call.',
    },
    {
      id: 'nodejs-async-2',
      question: 'How do you run multiple async operations in parallel with async/await?',
      type: 'multiple-choice',
      options: [
        'Use multiple await statements one after another',
        'Start all operations, then await Promise.all()',
        'Use a for loop with await inside',
        'Call await twice on the same Promise',
      ],
      correct: 1,
      explanation: 'To run operations in parallel, start them all without awaiting (storing the Promises), then await Promise.all([...]) to wait for all to complete. Sequential awaits run one after another, not in parallel.',
    },
  ],
  quiz: [
    {
      id: 'nodejs-async-q1',
      question: 'What happens if you await a rejected Promise without try/catch?',
      options: [
        'The program crashes immediately',
        'The error is silently ignored',
        'The error propagates as a rejected Promise from the async function',
        'It returns undefined',
      ],
      correct: 2,
      explanation: 'If you do not catch a rejected Promise in an async function, the async function itself returns a rejected Promise. The calling code can catch it with .catch() or another try/catch block. Uncaught rejections at the top level will crash Node.js.',
    },
  ],
};
