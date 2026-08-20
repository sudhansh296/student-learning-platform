import type { MernTopic } from './javascript-topics';

export const jsAsyncTopics: MernTopic[] = [
  {
    id: 'js-promises-deep',
    title: 'Promises — Complete Guide',
    slug: 'promises',
    subject: 'javascript',
    difficulty: 'intermediate',
    readingTime: 14,
    description: 'Master JavaScript Promises — creation, chaining, error handling, Promise.all, Promise.race, and real-world patterns.',
    prevTopic: 'closures',
    nextTopic: 'async-await',
    sections: [
      {
        type: 'intro',
        content: 'A Promise represents the eventual result of an asynchronous operation. Instead of callbacks nested inside callbacks (callback hell), Promises give you a clean way to handle async operations that will complete later — like API calls, file reads, database queries.'
      },
      {
        type: 'analogy',
        title: 'The Restaurant Order Analogy',
        content: 'When you order food at a restaurant, the waiter gives you a receipt (the Promise). You don\'t have the food yet, but you WILL. The Promise can be: Pending (waiting), Fulfilled (food arrived — resolved), or Rejected (kitchen is out — rejected). While waiting, you can do other things — JavaScript doesn\'t freeze.'
      },
      {
        type: 'heading', content: 'Creating a Promise'
      },
      {
        type: 'example',
        title: 'Promise anatomy',
        code: `// new Promise(executor)
// executor receives resolve() and reject() functions
const myPromise = new Promise((resolve, reject) => {
  // Async operation (simulated with setTimeout)
  setTimeout(() => {
    const success = true;

    if (success) {
      resolve({ id: 1, name: "Alex" }); // fulfilled!
    } else {
      reject(new Error("Something went wrong")); // rejected!
    }
  }, 1000);
});

// 3 states of a Promise:
// 1. Pending  — initial state, neither fulfilled nor rejected
// 2. Fulfilled — resolve() was called
// 3. Rejected  — reject() was called

console.log(myPromise); // Promise { <pending> }

// Consuming the promise with .then() and .catch()
myPromise
  .then(data => {
    console.log("Success:", data); // { id: 1, name: "Alex" }
    return data.name.toUpperCase(); // return value for next .then()
  })
  .then(name => {
    console.log("Name:", name);    // "ALEX"
  })
  .catch(error => {
    console.error("Error:", error.message);
  })
  .finally(() => {
    console.log("Always runs — for cleanup");
  });`,
        language: 'javascript'
      },
      {
        type: 'heading', content: 'Promise Chaining'
      },
      {
        type: 'example',
        title: 'Chaining multiple async operations',
        code: `// Simulating API calls
function fetchUser(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id, name: "Alex", postIds: [1, 2, 3] }), 500);
  });
}

function fetchPosts(postIds) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(postIds.map(id => ({ id, title: \`Post \${id}\` }))), 500);
  });
}

function fetchComments(postId) {
  return new Promise((resolve) => {
    setTimeout(() => resolve([{ id: 1, text: "Great post!" }]), 300);
  });
}

// Chain: get user → get their posts → get comments on first post
fetchUser(1)
  .then(user => {
    console.log("User:", user.name);
    return fetchPosts(user.postIds); // return the NEXT promise
  })
  .then(posts => {
    console.log("Posts:", posts.length);
    return fetchComments(posts[0].id); // return the NEXT promise
  })
  .then(comments => {
    console.log("Comments:", comments);
  })
  .catch(err => {
    // Catches ANY error in the entire chain
    console.error("Error in chain:", err.message);
  });`,
        language: 'javascript'
      },
      {
        type: 'heading', content: 'Promise.all, Promise.allSettled, Promise.race'
      },
      {
        type: 'example',
        title: 'Running multiple promises in parallel',
        code: `const p1 = fetch("https://jsonplaceholder.typicode.com/users/1").then(r => r.json());
const p2 = fetch("https://jsonplaceholder.typicode.com/posts/1").then(r => r.json());
const p3 = fetch("https://jsonplaceholder.typicode.com/todos/1").then(r => r.json());

// Promise.all — wait for ALL to complete
// If ANY rejects, the whole thing rejects
Promise.all([p1, p2, p3])
  .then(([user, post, todo]) => {
    console.log(user.name, post.title, todo.title);
  })
  .catch(err => console.error("One failed:", err));

// Promise.allSettled — wait for ALL, don't fail if some reject
Promise.allSettled([p1, p2, Promise.reject("error!")])
  .then(results => {
    results.forEach((result, i) => {
      if (result.status === "fulfilled") {
        console.log(\`Promise \${i} succeeded:\`, result.value);
      } else {
        console.log(\`Promise \${i} failed:\`, result.reason);
      }
    });
  });

// Promise.race — resolves/rejects with FIRST settled promise
Promise.race([p1, p2, p3])
  .then(first => console.log("First to complete:", first))
  .catch(err => console.log("First to fail:", err));

// Promise.any — resolves with FIRST fulfilled (ignores rejections)
Promise.any([
  Promise.reject("fail 1"),
  Promise.resolve("success!"),
  Promise.resolve("also success")
]).then(first => console.log("First fulfilled:", first)); // "success!"`,
        language: 'javascript'
      }
    ],
    exercises: [
      {
        id: 'promise-1',
        question: 'What are the three states of a JavaScript Promise?',
        type: 'multiple-choice',
        options: [
          'running, stopped, done',
          'pending, fulfilled, rejected',
          'loading, success, error',
          'waiting, resolved, failed'
        ],
        correct: 1,
        explanation: 'A Promise is always in one of three states: pending (initial), fulfilled (resolved successfully), or rejected (failed).'
      }
    ]
  },
  {
    id: 'js-async-await',
    title: 'Async/Await — Complete Guide',
    slug: 'async-await',
    subject: 'javascript',
    difficulty: 'intermediate',
    readingTime: 12,
    description: 'Write asynchronous code that looks synchronous. Master async/await, error handling, parallel execution, and real API patterns.',
    prevTopic: 'promises',
    nextTopic: 'fetch-api',
    sections: [
      {
        type: 'intro',
        content: 'async/await is syntactic sugar on top of Promises. It lets you write asynchronous code that reads like synchronous code — no .then() chains, no callback nesting. async/await is how modern JavaScript developers write all async code in React, Node.js, and Express.'
      },
      {
        type: 'example',
        title: 'async/await vs Promise .then()',
        code: `// Same operation — 3 different ways

// 1. Callbacks (old, messy — "callback hell")
getUserById(1, function(user) {
  getPostsByUser(user.id, function(posts) {
    getCommentsByPost(posts[0].id, function(comments) {
      console.log(comments); // deeply nested!
    });
  });
});

// 2. Promises with .then() (better)
getUserById(1)
  .then(user => getPostsByUser(user.id))
  .then(posts => getCommentsByPost(posts[0].id))
  .then(comments => console.log(comments))
  .catch(err => console.error(err));

// 3. async/await (BEST — reads like sync code)
async function loadData() {
  try {
    const user = await getUserById(1);
    const posts = await getPostsByUser(user.id);
    const comments = await getCommentsByPost(posts[0].id);
    console.log(comments);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

loadData();`,
        language: 'javascript'
      },
      {
        type: 'heading', content: 'The async and await Keywords'
      },
      {
        type: 'example',
        title: 'Rules of async/await',
        code: `// RULE 1: await can only be used inside an async function
async function fetchData() {
  const result = await somePromise; // OK
  return result;
}

// RULE 2: An async function ALWAYS returns a Promise
async function getValue() {
  return 42; // automatically wrapped in Promise.resolve(42)
}

getValue().then(v => console.log(v)); // 42

// RULE 3: await "pauses" the function (not the whole program)
async function demo() {
  console.log("1 - before await");
  const result = await new Promise(resolve => setTimeout(() => resolve("done"), 1000));
  console.log("2 - after await:", result);
  console.log("3 - continues...");
}

demo();
console.log("4 - this runs IMMEDIATELY, not blocked");

// Output order:
// 1 - before await
// 4 - this runs IMMEDIATELY   ← JS continues to next line
// 2 - after await: done       ← 1 second later
// 3 - continues...`,
        language: 'javascript'
      },
      {
        type: 'heading', content: 'Error Handling with try/catch'
      },
      {
        type: 'example',
        title: 'Proper error handling patterns',
        code: `// Basic try/catch
async function fetchUser(id) {
  try {
    const res = await fetch(\`/api/users/\${id}\`);

    if (!res.ok) {
      throw new Error(\`HTTP error! status: \${res.status}\`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch user:", error.message);
    throw error; // re-throw so caller can handle
  }
}

// Multiple operations with granular error handling
async function processOrder(orderId) {
  let order, user, payment;

  try {
    order = await getOrder(orderId);
  } catch (err) {
    console.error("Could not load order:", err.message);
    return null;
  }

  try {
    user = await getUser(order.userId);
  } catch (err) {
    console.error("Could not load user:", err.message);
    // Can still continue with just the order
  }

  try {
    payment = await processPayment(order.total);
  } catch (err) {
    console.error("Payment failed:", err.message);
    await cancelOrder(orderId); // cleanup
    throw new Error("Payment processing failed");
  }

  return { order, user, payment };
}`,
        language: 'javascript'
      },
      {
        type: 'heading', content: 'Parallel Execution with await'
      },
      {
        type: 'example',
        title: 'Sequential vs parallel — performance matters',
        code: `// ❌ SEQUENTIAL — each waits for previous (3 seconds total)
async function loadSequential() {
  console.time("sequential");
  const user = await fetchUser(1);    // wait 1s
  const posts = await fetchPosts(1);  // wait 1s
  const todos = await fetchTodos(1);  // wait 1s
  console.timeEnd("sequential");      // ~3000ms
  return { user, posts, todos };
}

// ✅ PARALLEL — all start at same time (1 second total!)
async function loadParallel() {
  console.time("parallel");
  const [user, posts, todos] = await Promise.all([
    fetchUser(1),    // start all 3
    fetchPosts(1),   // at the same time
    fetchTodos(1)    // simultaneously!
  ]);
  console.timeEnd("parallel");  // ~1000ms (3x faster!)
  return { user, posts, todos };
}

// Real-world: loading dashboard data in React
async function loadDashboard(userId) {
  try {
    const [profile, notifications, recentActivity] = await Promise.all([
      fetchUserProfile(userId),
      fetchNotifications(userId),
      fetchRecentActivity(userId)
    ]);

    return { profile, notifications, recentActivity };
  } catch (error) {
    console.error("Dashboard load failed:", error);
    throw error;
  }
}`,
        language: 'javascript'
      },
      {
        type: 'heading', content: 'Real-World: Fetch API with async/await'
      },
      {
        type: 'example',
        title: 'Complete fetch pattern used in every MERN app',
        code: `// Reusable API function
async function apiRequest(url, options = {}) {
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      // Add auth token if exists
      ...(localStorage.getItem("token") && {
        "Authorization": \`Bearer \${localStorage.getItem("token")}\`
      })
    }
  };

  const res = await fetch(url, { ...defaultOptions, ...options });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || \`HTTP \${res.status}\`);
  }

  return res.json();
}

// GET request
async function getUsers() {
  const users = await apiRequest("/api/users");
  return users;
}

// POST request
async function createUser(userData) {
  const user = await apiRequest("/api/users", {
    method: "POST",
    body: JSON.stringify(userData)
  });
  return user;
}

// PUT request
async function updateUser(id, updates) {
  const user = await apiRequest(\`/api/users/\${id}\`, {
    method: "PUT",
    body: JSON.stringify(updates)
  });
  return user;
}

// DELETE request
async function deleteUser(id) {
  await apiRequest(\`/api/users/\${id}\`, { method: "DELETE" });
}

// Usage in a component
async function loadAndDisplay() {
  try {
    const users = await getUsers();
    console.log("Loaded users:", users.length);
  } catch (error) {
    console.error("Failed:", error.message);
  }
}`,
        language: 'javascript'
      },
      {
        type: 'tryit',
        title: 'Try: Async/Await with Real API',
        html: '<div id="app">\n  <h2>🌐 Async/Await Live Demo</h2>\n  <div class="controls">\n    <button id="loadUser">Load Random User</button>\n    <button id="loadPosts">Load Posts</button>\n    <button id="loadBoth">Load Both (Parallel)</button>\n  </div>\n  <div id="status"></div>\n  <div id="result"></div>\n  <div id="timing"></div>\n</div>',
        css: '#app{font-family:sans-serif;padding:20px;max-width:500px;}\n.controls{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;}\nbutton{padding:8px 14px;background:#2563eb;color:white;border:none;border-radius:6px;cursor:pointer;font-size:13px;}\nbutton:disabled{background:#94a3b8;cursor:not-allowed;}\n#status{font-size:13px;color:#64748b;margin:8px 0;height:18px;}\n#result{background:#f8fafc;border:1px solid #e2e8f0;padding:12px;border-radius:8px;font-size:13px;min-height:60px;font-family:monospace;white-space:pre-wrap;}\n#timing{font-size:12px;color:#059669;margin-top:8px;font-weight:600;}',
        js: 'function setStatus(msg) { document.getElementById("status").textContent = msg; }\nfunction setResult(data) { document.getElementById("result").textContent = typeof data === "object" ? JSON.stringify(data, null, 2) : data; }\nfunction setTiming(ms) { document.getElementById("timing").textContent = ms ? `⏱ Completed in ${ms}ms` : ""; }\nfunction disableAll(v) { document.querySelectorAll("button").forEach(b => b.disabled = v); }\n\ndocument.getElementById("loadUser").onclick = async function() {\n  disableAll(true); setStatus("Loading user..."); setTiming();\n  const t = Date.now();\n  try {\n    const res = await fetch("https://randomuser.me/api/");\n    const data = await res.json();\n    const u = data.results[0];\n    setResult({ name: u.name.first + " " + u.name.last, email: u.email, country: u.location.country });\n    setTiming(Date.now() - t);\n    setStatus("✅ User loaded!");\n  } catch(e) { setStatus("❌ " + e.message); } finally { disableAll(false); }\n};\n\ndocument.getElementById("loadPosts").onclick = async function() {\n  disableAll(true); setStatus("Loading posts..."); setTiming();\n  const t = Date.now();\n  try {\n    const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=3");\n    const posts = await res.json();\n    setResult(posts.map(p => p.title).join("\\n"));\n    setTiming(Date.now() - t);\n    setStatus("✅ Posts loaded!");\n  } catch(e) { setStatus("❌ " + e.message); } finally { disableAll(false); }\n};\n\ndocument.getElementById("loadBoth").onclick = async function() {\n  disableAll(true); setStatus("Loading both in parallel..."); setTiming();\n  const t = Date.now();\n  try {\n    const [userData, postsData] = await Promise.all([\n      fetch("https://randomuser.me/api/").then(r => r.json()),\n      fetch("https://jsonplaceholder.typicode.com/posts/1").then(r => r.json())\n    ]);\n    const u = userData.results[0];\n    setResult({ user: u.name.first + " " + u.name.last, post: postsData.title });\n    setTiming(Date.now() - t);\n    setStatus("✅ Both loaded in parallel!");\n  } catch(e) { setStatus("❌ " + e.message); } finally { disableAll(false); }\n};',
        mode: 'full'
      }
    ],
    exercises: [
      {
        id: 'async-1',
        question: 'What does an async function always return?',
        type: 'multiple-choice',
        options: ['A regular value', 'A Promise', 'undefined', 'A callback'],
        correct: 1,
        explanation: 'Any async function always returns a Promise, even if you return a plain value. The value gets wrapped in Promise.resolve().'
      },
      {
        id: 'async-2',
        question: 'How do you run 3 API calls simultaneously instead of one after another?',
        type: 'multiple-choice',
        options: [
          'Use three separate await calls',
          'Use Promise.all([call1, call2, call3])',
          'Use setTimeout',
          'You cannot run them simultaneously'
        ],
        correct: 1,
        explanation: 'Promise.all() starts all promises at once and waits for all to complete. This can be 2-3x faster than sequential await calls.'
      }
    ]
  }
];
