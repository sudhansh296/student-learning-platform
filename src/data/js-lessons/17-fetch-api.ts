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
    {type:'tryit',title:'GitHub User Explorer',
     html:`<div id="app">
  <div class="header">
    <h2>🐙 GitHub User Explorer</h2>
    <p class="sub">Fetch API · loading/error states · real data</p>
  </div>
  <form id="searchForm" onsubmit="searchUser(event)">
    <div class="search-row">
      <input id="username" placeholder="Enter GitHub username..." value="torvalds">
      <button type="submit" id="searchBtn">Search</button>
    </div>
  </form>
  <div class="quick-btns">
    <span style="font-size:11px;color:#94a3b8">Try: </span>
    <button class="q-btn" onclick="quickSearch('gaearon')">gaearon</button>
    <button class="q-btn" onclick="quickSearch('sindresorhus')">sindresorhus</button>
    <button class="q-btn" onclick="quickSearch('torvalds')">torvalds</button>
    <button class="q-btn" onclick="quickSearch('notarealuser999xyz')">404 test</button>
  </div>
  <div id="result"></div>
</div>`,
     css:`*{box-sizing:border-box}body{font-family:system-ui,sans-serif;padding:16px;background:#0d1117;color:white;margin:0;}
#app{max-width:500px;margin:0 auto;}
.header{text-align:center;margin-bottom:14px;}
h2{margin:0 0 4px;font-size:20px;color:#e6edf3;}
.sub{margin:0;font-size:11px;color:#8b949e;}
.search-row{display:flex;gap:8px;margin-bottom:8px;}
input{flex:1;padding:10px 14px;background:#161b22;border:1px solid #30363d;border-radius:8px;color:#e6edf3;font-size:14px;outline:none;}
input:focus{border-color:#58a6ff;}
button[type=submit]{padding:10px 18px;background:#238636;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:700;font-size:14px;}
button[type=submit]:disabled{background:#2ea043;opacity:.6;cursor:not-allowed;}
.quick-btns{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:14px;}
.q-btn{padding:4px 10px;background:#21262d;color:#8b949e;border:1px solid #30363d;border-radius:6px;cursor:pointer;font-size:12px;}
.q-btn:hover{color:#58a6ff;border-color:#58a6ff;}
.profile{background:#161b22;border:1px solid #30363d;border-radius:14px;padding:18px;}
.profile-top{display:flex;gap:14px;align-items:flex-start;margin-bottom:14px;}
.avatar{width:64px;height:64px;border-radius:50%;border:2px solid #30363d;flex-shrink:0;}
.profile-info h3{margin:0 0 2px;font-size:17px;color:#e6edf3;}
.login{color:#8b949e;font-size:13px;margin:0 0 4px;}
.bio{color:#8b949e;font-size:12px;margin:0;line-height:1.5;}
.stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px;}
.stat-box{background:#21262d;border-radius:8px;padding:10px;text-align:center;border:1px solid #30363d;}
.stat-n{font-size:20px;font-weight:700;color:#e6edf3;}
.stat-l{font-size:10px;color:#8b949e;text-transform:uppercase;letter-spacing:.05em;}
.repos-title{font-size:12px;color:#8b949e;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px;}
.repo{background:#21262d;border:1px solid #30363d;border-radius:8px;padding:10px 12px;margin-bottom:6px;}
.repo-name{color:#58a6ff;font-size:13px;font-weight:600;margin-bottom:2px;}
.repo-desc{color:#8b949e;font-size:11px;line-height:1.4;}
.repo-meta{display:flex;gap:10px;margin-top:5px;font-size:11px;color:#8b949e;}
.loading{text-align:center;padding:40px;color:#8b949e;}
.loader{font-size:28px;display:inline-block;animation:spin 1s linear infinite;}
@keyframes spin{to{transform:rotate(360deg)}}
.error{background:#161b22;border:1px solid #f85149;border-radius:12px;padding:20px;text-align:center;color:#f85149;}`,
     js:`let loading = false;

async function searchUser(e) {
  if (e) e.preventDefault();
  if (loading) return;
  const username = document.getElementById('username').value.trim();
  if (!username) return;
  loading = true;
  const btn = document.getElementById('searchBtn');
  btn.disabled = true; btn.textContent = '⏳';
  document.getElementById('result').innerHTML =
    '<div class="loading"><div class="loader">⏳</div><br>Fetching user data...</div>';
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch('https://api.github.com/users/' + username),
      fetch('https://api.github.com/users/' + username + '/repos?sort=stars&per_page=4')
    ]);
    if (userRes.status === 404) throw new Error('User "' + username + '" not found');
    if (!userRes.ok) throw new Error('GitHub API error: ' + userRes.status);
    const user = await userRes.json();
    const repos = await reposRes.json();
    renderProfile(user, Array.isArray(repos) ? repos : []);
  } catch(e) {
    document.getElementById('result').innerHTML =
      '<div class="error"><b>❌ ' + e.message + '</b><br><small style="color:#8b949e;font-size:12px">Try a real GitHub username</small></div>';
  } finally {
    loading = false; btn.disabled = false; btn.textContent = 'Search';
  }
}

function renderProfile(user, repos) {
  const reposHtml = repos.slice(0,4).map(r =>
    '<div class="repo"><div class="repo-name">📦 ' + r.name + '</div>' +
    (r.description ? '<div class="repo-desc">' + r.description.slice(0,80) + '</div>' : '') +
    '<div class="repo-meta"><span>⭐ ' + r.stargazers_count + '</span>' +
    (r.language ? '<span>· ' + r.language + '</span>' : '') + '</div></div>'
  ).join('');

  document.getElementById('result').innerHTML =
    '<div class="profile">' +
      '<div class="profile-top">' +
        '<img class="avatar" src="' + user.avatar_url + '" alt="avatar">' +
        '<div class="profile-info">' +
          '<h3>' + (user.name || user.login) + '</h3>' +
          '<p class="login">@' + user.login + '</p>' +
          (user.bio ? '<p class="bio">' + user.bio + '</p>' : '') +
        '</div>' +
      '</div>' +
      '<div class="stats-grid">' +
        '<div class="stat-box"><div class="stat-n">' + user.public_repos + '</div><div class="stat-l">Repos</div></div>' +
        '<div class="stat-box"><div class="stat-n">' + user.followers + '</div><div class="stat-l">Followers</div></div>' +
        '<div class="stat-box"><div class="stat-n">' + user.following + '</div><div class="stat-l">Following</div></div>' +
      '</div>' +
      (repos.length ? '<div class="repos-title">Top Repositories</div>' + reposHtml : '') +
    '</div>';
}

function quickSearch(u) {
  document.getElementById('username').value = u;
  searchUser(null);
}

window.searchUser = searchUser;
window.quickSearch = quickSearch;
searchUser(null);`,mode:'full'},
  ],
  exercises:[{id:'fetch-1',question:'Why do you need to check response.ok after a fetch() call?',type:'multiple-choice',options:['You don\'t — fetch throws on any non-200 response','fetch() only rejects on network errors (no connection). A 404 or 500 still resolves — you must check response.ok','response.ok is deprecated','You should use response.status instead'],correct:1,explanation:'fetch() only throws (rejects) on network failures — no internet, CORS error, etc. A 404 Not Found or 500 Server Error are still "successful" HTTP responses from fetch\'s perspective. Always check response.ok or response.status to detect API errors.'}],
  quiz:[{id:'qfetch1',question:'What does AbortController allow you to do?',options:['Speed up requests','Cancel an in-progress fetch request','Add authentication','Retry failed requests'],correct:1,explanation:'AbortController lets you cancel pending fetch requests. Pass its signal to fetch\'s options: fetch(url, {signal: controller.signal}). Call controller.abort() to cancel. Useful for timeouts and when the user navigates away before a request completes.'}],
};
