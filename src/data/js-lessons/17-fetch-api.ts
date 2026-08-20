import type { JSLesson } from '../js-curriculum';

export const jsFetchLesson: JSLesson = {
  id:'js-fetch',title:'Fetch API & HTTP',slug:'fetch-api',
  chapter:'async',order:18,difficulty:'intermediate',readingTime:13,
  description:'Make HTTP requests with the Fetch API — GET, POST, PUT, DELETE, headers, auth tokens, and error handling.',
  sections:[
    {type:'text',content:'The Fetch API is how JavaScript communicates with servers and external APIs. Every modern web app — loading user data, submitting forms, getting weather, posting tweets — uses Fetch. It is built into all modern browsers and returns Promises.'},
    {type:'heading',content:'Basic GET Request'},
    {type:'example',title:'Fetching data from an API',content:'fetch() takes a URL and returns a Promise that resolves to a Response object. The response is NOT your data yet — it is the raw HTTP response. You call response.json() to parse the body as JSON, response.text() for plain text, or response.blob() for binary data like images. Always check response.ok first — a 404 or 500 does NOT automatically throw an error.',language:'javascript',code:`// Basic fetch — always returns a Promise
const response = await fetch("https://jsonplaceholder.typicode.com/users/1");

// response.ok = true if status 200-299
if (!response.ok) {
  throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
}

// Parse the response body
const user = await response.json();       // parse JSON
const text = await response.text();       // parse as plain text
const blob = await response.blob();       // parse as binary (files, images)
const formData = await response.formData(); // parse as form data

// Useful response properties
console.log(response.status);      // 200
console.log(response.statusText);  // "OK"
console.log(response.headers.get("Content-Type")); // "application/json"
console.log(response.url);         // the actual URL (after redirects)

console.log(user.name);    // "Leanne Graham"
console.log(user.email);   // "Sincere@april.biz"`},
    {type:'heading',content:'POST, PUT, DELETE Requests'},
    {type:'example',title:'Sending data to a server',content:'To send data, pass a second argument to fetch() with method, headers, and body. The body must be a string — use JSON.stringify() to convert your object. Always set the Content-Type header to "application/json" so the server knows how to parse it. POST creates new data, PUT replaces it entirely, PATCH updates specific fields, and DELETE removes it.',language:'javascript',code:`const BASE_URL = "https://jsonplaceholder.typicode.com";

// POST — create new resource
async function createPost(title, body, userId) {
  const response = await fetch(\`\${BASE_URL}/posts\`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, body, userId }),
  });
  if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
  return response.json(); // returns created post with id
}

// PUT — replace existing resource
async function updatePost(id, data) {
  const response = await fetch(\`\${BASE_URL}/posts/\${id}\`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

// PATCH — partial update
async function patchPost(id, fields) {
  const response = await fetch(\`\${BASE_URL}/posts/\${id}\`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fields),
  });
  return response.json();
}

// DELETE — remove resource
async function deletePost(id) {
  const response = await fetch(\`\${BASE_URL}/posts/\${id}\`, {
    method: "DELETE",
  });
  return response.ok; // true if successfully deleted
}

// Usage
const newPost = await createPost("Hello", "Content here", 1);
console.log("Created:", newPost.id); // returns new id`},
    {type:'heading',content:'Authentication — Bearer Tokens'},
    {type:'example',title:'Sending auth headers',content:'Most APIs require authentication. The standard way is a Bearer token sent in the Authorization header. Build a reusable apiRequest() helper that automatically attaches the token from localStorage to every request. This helper also handles 401 (expired session) by redirecting to login, and converts empty 204 responses to null. With this pattern, all your CRUD functions become single-line calls.',language:'javascript',code:`// Most APIs require authentication
async function apiRequest(url, options = {}) {
  const token = localStorage.getItem("authToken"); // get saved token

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": \`Bearer \${token}\` }),
      ...options.headers, // allow overriding headers
    },
  });

  // Handle authentication errors
  if (response.status === 401) {
    localStorage.removeItem("authToken"); // clear invalid token
    window.location.href = "/login";      // redirect to login
    throw new Error("Session expired");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || \`HTTP \${response.status}\`);
  }

  // Handle empty responses (204 No Content)
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

// Clean API functions using the helper
const api = {
  get:    (url)         => apiRequest(url),
  post:   (url, data)   => apiRequest(url, {method:"POST",  body:JSON.stringify(data)}),
  put:    (url, data)   => apiRequest(url, {method:"PUT",   body:JSON.stringify(data)}),
  patch:  (url, data)   => apiRequest(url, {method:"PATCH", body:JSON.stringify(data)}),
  delete: (url)         => apiRequest(url, {method:"DELETE"}),
};

// Usage
const users  = await api.get("/api/users");
const user   = await api.post("/api/users", { name:"Alex", email:"alex@example.com" });
const updated = await api.patch(\`/api/users/\${user.id}\`, { name:"Alexander" });
await api.delete(\`/api/users/\${user.id}\`);`},
    {type:'heading',content:'Query Parameters and URL Building'},
    {type:'example',title:'Building URLs with parameters',content:'URLSearchParams is the clean, safe way to build query strings. It automatically handles encoding special characters — spaces become %20, & signs are escaped, etc. Create it with an object of key-value pairs and it generates the full ?key=value&key2=value2 string. You can also add, modify, and delete params dynamically, and read params from the current page URL.',language:'javascript',code:`// URLSearchParams — clean way to build query strings
const params = new URLSearchParams({
  page:     1,
  limit:    10,
  search:   "javascript",
  category: "frontend",
});

// Generates: ?page=1&limit=10&search=javascript&category=frontend
const url = \`https://api.example.com/posts?\${params}\`;
const posts = await fetch(url).then(r => r.json());

// Add/modify params dynamically
params.append("tag", "react");
params.set("page", 2);
params.delete("category");

// Read params from current URL
const currentParams = new URLSearchParams(window.location.search);
const search = currentParams.get("search") || "";
const page   = parseInt(currentParams.get("page")) || 1;`},
    {type:'heading',content:'AbortController — Cancel Requests'},
    {type:'example',title:'Timeout and cancellation',content:'AbortController lets you cancel a fetch request that is still in progress. Pass controller.signal to fetch, then call controller.abort() to cancel it. Use this for timeouts — if a request takes longer than 5 seconds, abort it and show an error. In React, cancel the previous search request when the user types a new character so stale results do not overwrite fresh ones.',language:'javascript',code:`// AbortController — cancel fetch requests
async function fetchWithTimeout(url, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(\`Request timed out after \${timeoutMs}ms\`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId); // clear timer if request completed
  }
}

// Cancel when user navigates away (React pattern)
function SearchComponent() {
  let controller;

  async function search(query) {
    // Cancel previous request if still pending
    controller?.abort();
    controller = new AbortController();

    try {
      const results = await fetch(\`/api/search?q=\${query}\`, {
        signal: controller.signal
      }).then(r => r.json());
      displayResults(results);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Search failed:", error);
      }
    }
  }
}`},
    {type:'tryit',title:'Try It: Fetch API',
     html:`<div id="app">
  <h2>🌐 Fetch API Live Demo</h2>
  <div class="btns">
    <button id="b1" onclick="fetchUser()">GET User</button>
    <button id="b2" onclick="fetchPosts()">GET Posts</button>
    <button id="b3" onclick="createPost()">POST New Post</button>
    <button id="b4" onclick="fetchWithError()">Test Error</button>
  </div>
  <div id="status"></div>
  <div id="result"></div>
  <div id="timing"></div>
</div>`,
     css:`#app{font-family:system-ui,sans-serif;padding:20px;max-width:540px;}
h2{color:#1e1e1e;margin-bottom:12px;}
.btns{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;}
button{padding:9px 16px;background:#2563eb;color:white;border:none;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;}
button:disabled{background:#94a3b8;cursor:not-allowed;}
#status{font-size:13px;color:#6b7280;height:18px;margin-bottom:6px;}
#result{background:#0d1117;color:#e6edf3;padding:14px;border-radius:10px;font-family:monospace;font-size:12px;white-space:pre-wrap;min-height:80px;max-height:260px;overflow-y:auto;}
#timing{font-size:11px;color:#22c55e;font-weight:700;margin-top:4px;}`,
     js:`const setStatus = s => document.getElementById('status').textContent = s;
const setResult = v => document.getElementById('result').textContent = typeof v==='object'?JSON.stringify(v,null,2):v;
const setTime = ms => document.getElementById('timing').textContent = ms ? '⏱ ' + ms + 'ms' : '';
const disable = v => document.querySelectorAll('button').forEach(b => b.disabled = v);

async function run(label, fn) {
  disable(true); setStatus('⏳ ' + label + '...'); setTime(0);
  const t = Date.now();
  try { const r = await fn(); setResult(r); setStatus('✅ Success!'); }
  catch(e) { setResult('❌ Error: ' + e.message); setStatus('❌ Failed'); }
  finally { setTime(Date.now()-t); disable(false); }
}

function fetchUser() {
  run('GET /users/1', async () => {
    const r = await fetch('https://jsonplaceholder.typicode.com/users/1');
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  });
}

function fetchPosts() {
  run('GET /posts?_limit=3', async () => {
    const r = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=3');
    const posts = await r.json();
    return posts.map(p => ({ id:p.id, title:p.title.slice(0,40)+'...' }));
  });
}

function createPost() {
  run('POST /posts', async () => {
    const r = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title:'My New Post', body:'Content here', userId:1 }),
    });
    return r.json();
  });
}

function fetchWithError() {
  run('GET non-existent endpoint', async () => {
    const r = await fetch('https://jsonplaceholder.typicode.com/nonexistent/999');
    if (!r.ok) throw new Error(\`HTTP \${r.status}: \${r.statusText}\`);
    return r.json();
  });
}`,mode:'full'},
  ],
  exercises:[{id:'fetch-1',question:'Why do you need to check response.ok after a fetch() call?',type:'multiple-choice',options:['You don\'t — fetch throws on any non-200 response','fetch() only rejects on network errors (no connection). A 404 or 500 still resolves — you must check response.ok','response.ok is deprecated','You should use response.status instead'],correct:1,explanation:'fetch() only throws (rejects) on network failures — no internet, CORS error, etc. A 404 Not Found or 500 Server Error are still "successful" HTTP responses from fetch\'s perspective. Always check response.ok or response.status to detect API errors.'}],
  quiz:[{id:'qfetch1',question:'What does AbortController allow you to do?',options:['Speed up requests','Cancel an in-progress fetch request','Add authentication','Retry failed requests'],correct:1,explanation:'AbortController lets you cancel pending fetch requests. Pass its signal to fetch\'s options: fetch(url, {signal: controller.signal}). Call controller.abort() to cancel. Useful for timeouts and when the user navigates away before a request completes.'}],
};
