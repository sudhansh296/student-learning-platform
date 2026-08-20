import type { JSLesson } from '../js-curriculum';

export const jsAsyncLesson: JSLesson = {
  id:'js-async-await',title:'Async/Await & Promises',slug:'async-await',
  chapter:'async',order:13,difficulty:'intermediate',readingTime:15,
  description:'Master asynchronous JavaScript — callbacks, Promises, async/await, error handling, and parallel execution.',
  sections:[
    {type:'text',content:'JavaScript runs one thing at a time (single-threaded). But many operations take time — fetching data, reading files, waiting for timers. Asynchronous JavaScript lets you start these operations and continue doing other things while waiting, instead of freezing the entire program.'},
    {type:'analogy',title:'Ordering food at a restaurant',content:'When you order food, you get a receipt (a Promise). You don\'t just stand frozen at the counter waiting — you go sit down (continue doing other things). When the food is ready, you are notified (Promise resolved). If the kitchen runs out of ingredients, you are told the bad news (Promise rejected). async/await is like a waiter who handles all this automatically so you don\'t have to manage receipts yourself.'},
    {type:'heading',content:'The Problem — Callback Hell'},
    {type:'example',title:'Why we need better async patterns',content:'Before Promises existed, the only way to do async work was callbacks — functions passed as arguments that get called when the operation finishes. The problem: when you need multiple async operations in sequence, each callback nests inside the previous one. This creates "callback hell" — deeply indented, hard-to-read code where error handling must be repeated at every level.',language:'javascript',code:`// CALLBACKS — old way — "callback hell"
getUser(1, function(user) {
  getPosts(user.id, function(posts) {
    getComments(posts[0].id, function(comments) {
      getLikes(comments[0].id, function(likes) {
        // Deeply nested — hard to read, hard to handle errors
        console.log(likes);
      }, errorHandler);
    }, errorHandler);
  }, errorHandler);
}, errorHandler);

// Each async operation requires a callback
// Error handling is repeated at every level
// Extremely hard to maintain and debug`},
    {type:'heading',content:'Promises — Better Async'},
    {type:'example',title:'Creating and consuming Promises',content:'A Promise is an object that represents a future value. It starts as "pending", then either "fulfills" with a value or "rejects" with an error. You chain .then() to handle success and .catch() to handle errors. The key advantage over callbacks: errors automatically bubble up the chain — you only need one .catch() at the end instead of error handling at every step.',language:'javascript',code:`// A Promise represents a future value — pending, fulfilled, or rejected
const promise = new Promise((resolve, reject) => {
  const success = Math.random() > 0.5;
  setTimeout(() => {
    if (success) {
      resolve({ id: 1, name: "Alex" }); // success
    } else {
      reject(new Error("User not found")); // failure
    }
  }, 1000);
});

// Consume with .then() and .catch()
promise
  .then(user => {
    console.log("Got user:", user.name);
    return user.name.toUpperCase(); // return value passes to next .then()
  })
  .then(upper => console.log("Uppercase:", upper))
  .catch(error => console.error("Error:", error.message))
  .finally(() => console.log("Always runs — for cleanup"));

// Promise shortcuts
Promise.resolve("immediate value").then(v => console.log(v));
Promise.reject(new Error("instant fail")).catch(e => console.log(e.message));`},
    {type:'heading',content:'async/await — Clearest Way to Write Async Code'},
    {type:'example',title:'async/await syntax',content:'async/await makes asynchronous code look and read like synchronous code. The async keyword marks a function as asynchronous. The await keyword pauses execution inside that function until the Promise resolves — but does NOT block the rest of the program. Wrap await calls in try/catch for error handling, just like synchronous code.',language:'javascript',code:`// async function always returns a Promise
// await pauses execution until the Promise resolves

async function fetchUser(id) {
  // await can only be used inside async functions
  const response = await fetch(\`https://jsonplaceholder.typicode.com/users/\${id}\`);

  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }

  const user = await response.json(); // parse JSON
  return user;
}

// Usage — call async function, get Promise back
async function displayUser() {
  try {
    const user = await fetchUser(1);
    console.log("Name:", user.name);
    console.log("Email:", user.email);
  } catch (error) {
    console.error("Failed:", error.message);
  }
}

displayUser();

// Top-level await (in ES modules)
// const user = await fetchUser(1);`},
    {type:'heading',content:'Error Handling'},
    {type:'example',title:'Proper error handling patterns',content:'In async functions, use try/catch exactly like you would with synchronous code. Check response.ok after every fetch call — a 404 or 500 response does NOT automatically throw an error, you must check manually. The finally block always runs — use it to hide loading spinners or close connections. Re-throw unexpected errors so they don\'t silently disappear.',language:'javascript',code:`// try/catch/finally
async function loadData(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(\`HTTP \${res.status}: \${res.statusText}\`);
    const data = await res.json();
    return data;
  } catch (error) {
    if (error.name === "TypeError") {
      console.error("Network error — are you offline?");
    } else {
      console.error("API error:", error.message);
    }
    throw error; // re-throw so caller knows it failed
  } finally {
    console.log("Request complete (success or failure)");
  }
}

// Handling errors at the call site
async function main() {
  try {
    const users = await loadData("/api/users");
    const posts = await loadData("/api/posts");
    return { users, posts };
  } catch (error) {
    return { error: error.message };
  }
}`},
    {type:'heading',content:'Running Multiple Promises — Parallel vs Sequential'},
    {type:'example',title:'Promise.all and parallel execution',content:'Sequential awaits run one after another — each waits for the previous to finish. If each call takes 1 second, three calls take 3 seconds total. Promise.all() starts ALL promises simultaneously and waits for all to finish — three 1-second calls complete in 1 second total. Use Promise.allSettled() when you want all results even if some fail.',language:'javascript',code:`// SEQUENTIAL — each waits for the previous (slow!)
async function sequential() {
  console.time("sequential");
  const user  = await fetch("/api/user").then(r => r.json());    // wait 1s
  const posts = await fetch("/api/posts").then(r => r.json());   // wait 1s
  const todos = await fetch("/api/todos").then(r => r.json());   // wait 1s
  console.timeEnd("sequential"); // ~3000ms
}

// PARALLEL with Promise.all — all start simultaneously (fast!)
async function parallel() {
  console.time("parallel");
  const [user, posts, todos] = await Promise.all([
    fetch("/api/user").then(r => r.json()),
    fetch("/api/posts").then(r => r.json()),
    fetch("/api/todos").then(r => r.json()),
  ]);
  console.timeEnd("parallel"); // ~1000ms (3x faster!)
}

// Promise.allSettled — wait for all, don't fail if some reject
const results = await Promise.allSettled([
  fetch("/api/user").then(r => r.json()),
  fetch("/api/broken"),                    // this might fail
  fetch("/api/todos").then(r => r.json()),
]);
results.forEach(result => {
  if (result.status === "fulfilled") console.log("Success:", result.value);
  else console.log("Failed:", result.reason);
});

// Promise.race — resolve/reject with FIRST settled
const first = await Promise.race([
  fetch("/api/fast-server").then(r => r.json()),
  fetch("/api/slow-server").then(r => r.json()),
  new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 5000))
]);`},
    {type:'heading',content:'Real-World: Complete Fetch Pattern'},
    {type:'example',title:'Production-quality API utility',content:'Real apps use a shared api() helper so every request automatically includes the auth token and handles errors consistently. This avoids repeating the same headers and error checks in every component. The helper returns parsed JSON directly, so callers just await api("/url") and get the data — no boilerplate. Notice how the CRUD functions (getUser, createUser) are just one line each once the helper exists.',language:'javascript',code:`// Reusable API function used in every real project
async function api(url, options = {}) {
  const token = localStorage.getItem("authToken");
  const defaults = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": \`Bearer \${token}\` }),
    },
  };

  const response = await fetch(url, { ...defaults, ...options });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || \`HTTP \${response.status}\`);
  }

  // Handle empty responses (204 No Content)
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

// CRUD operations
const getUser    = (id) => api(\`/api/users/\${id}\`);
const getUsers   = ()   => api("/api/users");
const createUser = (data) => api("/api/users", { method:"POST", body:JSON.stringify(data) });
const updateUser = (id, data) => api(\`/api/users/\${id}\`, { method:"PUT", body:JSON.stringify(data) });
const deleteUser = (id) => api(\`/api/users/\${id}\`, { method:"DELETE" });

// Usage in a React component
async function loadDashboard(userId) {
  const [user, posts, stats] = await Promise.all([
    getUser(userId),
    api(\`/api/users/\${userId}/posts\`),
    api(\`/api/users/\${userId}/stats\`),
  ]);
  return { user, posts, stats };
}`},
    {type:'tryit',title:'Try It: Async/Await with Real API',
     html:`<div id="app">
  <h2>🌐 Live API Demo (async/await)</h2>
  <div class="btns">
    <button id="btn1" onclick="loadUser()">Load Random User</button>
    <button id="btn2" onclick="loadPost()">Load Random Post</button>
    <button id="btn3" onclick="loadBoth()">Load Both (Parallel)</button>
  </div>
  <div id="status"></div>
  <div id="result"></div>
  <div id="time"></div>
</div>`,
     css:`#app{font-family:system-ui,sans-serif;padding:20px;max-width:520px;}
h2{color:#1e1e1e;margin-bottom:12px;}
.btns{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;}
button{padding:9px 16px;background:#2563eb;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:13px;}
button:disabled{background:#94a3b8;cursor:not-allowed;}
#status{font-size:13px;color:#6b7280;height:18px;margin-bottom:6px;}
#result{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px;font-size:13px;min-height:60px;font-family:monospace;white-space:pre-wrap;word-break:break-word;}
#time{font-size:12px;color:#22c55e;font-weight:700;margin-top:6px;}`,
     js:`const setStatus = msg => document.getElementById('status').textContent = msg;
const setResult = obj => document.getElementById('result').textContent = JSON.stringify(obj, null, 2);
const setTime   = ms  => document.getElementById('time').textContent = ms ? \`⏱ Completed in \${ms}ms\` : '';
const setAll    = (s,r) => { setStatus(s); if(r) setResult(r); };
const disable   = v  => document.querySelectorAll('button').forEach(b => b.disabled = v);

async function loadUser() {
  disable(true); setStatus('Fetching user...'); setTime(0);
  const t = Date.now();
  try {
    const res  = await fetch('https://randomuser.me/api/');
    const data = await res.json();
    const u    = data.results[0];
    setAll('✅ User loaded!', { name: u.name.first + ' ' + u.name.last, email: u.email, country: u.location.country });
    setTime(Date.now() - t);
  } catch(e) { setAll('❌ ' + e.message); }
  finally { disable(false); }
}

async function loadPost() {
  disable(true); setStatus('Fetching post...'); setTime(0);
  const t = Date.now();
  try {
    const id  = Math.ceil(Math.random() * 100);
    const res = await fetch(\`https://jsonplaceholder.typicode.com/posts/\${id}\`);
    const post = await res.json();
    setAll('✅ Post loaded!', { id: post.id, title: post.title, body: post.body.slice(0,80)+'...' });
    setTime(Date.now() - t);
  } catch(e) { setAll('❌ ' + e.message); }
  finally { disable(false); }
}

async function loadBoth() {
  disable(true); setStatus('Loading both in parallel...'); setTime(0);
  const t = Date.now();
  try {
    const [userData, postData] = await Promise.all([
      fetch('https://randomuser.me/api/').then(r => r.json()),
      fetch('https://jsonplaceholder.typicode.com/posts/1').then(r => r.json()),
    ]);
    const u = userData.results[0];
    setAll('✅ Both loaded in parallel!', { user: u.name.first + ' ' + u.name.last, postTitle: postData.title });
    setTime(Date.now() - t);
  } catch(e) { setAll('❌ ' + e.message); }
  finally { disable(false); }
}`,mode:'full'},
  ],
  exercises:[
    {id:'as-1',question:'What does an async function always return?',type:'multiple-choice',options:['A regular value','A Promise','undefined','A callback'],correct:1,explanation:'Every async function automatically wraps its return value in a Promise. Even if you return a plain number, the caller receives Promise.resolve(42). This allows using .then() or await on any async function call.'},
    {id:'as-2',question:'How do you run 3 API calls simultaneously instead of one after another?',type:'multiple-choice',options:['Use three sequential awaits','Promise.all([call1, call2, call3])','Use setTimeout','You cannot — JS is single-threaded'],correct:1,explanation:'Promise.all() starts all promises simultaneously and waits for all to complete. This can be 2-3x faster than sequential awaits. The results are returned as an array in the same order.'},
  ],
  quiz:[
    {id:'qas1',question:'What is the difference between Promise.all() and Promise.allSettled()?',options:['No difference','Promise.all() fails fast if any promise rejects; allSettled waits for all and reports each result','allSettled is faster','Promise.all only works with 3 promises'],correct:1,explanation:'Promise.all() rejects immediately if any promise rejects (fail-fast). Promise.allSettled() waits for all promises regardless, reporting {status:"fulfilled",value} or {status:"rejected",reason} for each.'},
    {id:'qas2',question:'Where can you use the await keyword?',options:['Anywhere in JavaScript','Only inside async functions or at the top level of ES modules','Only in try/catch blocks','Only for fetch()'],correct:1,explanation:'await can only be used inside async functions. The exception is top-level await in ES modules (supported in modern browsers and Node.js 14.8+). Using await outside async throws a SyntaxError.'},
  ],
};
