import type { Project } from './types';

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>REST API Explorer</title>
<link rel="stylesheet" href="style.css">
</head>
<body>

<div id="app">

  <header class="topbar">
    <div class="topbar-left">
      <div class="brand-icon">{}</div>
      <span class="brand-name">REST API Explorer</span>
      <span class="brand-sub">Simulated Blog API</span>
    </div>
    <div class="topbar-right">
      <span class="label">Token:</span>
      <span id="tokenVal" class="token-val">not logged in</span>
      <button id="btnClearToken" class="btn-sm">clear</button>
    </div>
  </header>

  <div class="layout">

    <aside class="sidebar">
      <div class="group-title">AUTH</div>
      <button class="ep" data-key="register"><span class="m post">POST</span>/auth/register</button>
      <button class="ep" data-key="login"><span class="m post">POST</span>/auth/login</button>
      <button class="ep" data-key="me"><span class="m get">GET</span>/users/me</button>

      <div class="group-title">POSTS</div>
      <button class="ep" data-key="listPosts"><span class="m get">GET</span>/posts</button>
      <button class="ep" data-key="getPost"><span class="m get">GET</span>/posts/:id</button>
      <button class="ep" data-key="createPost"><span class="m post">POST</span>/posts</button>
      <button class="ep" data-key="updatePost"><span class="m put">PUT</span>/posts/:id</button>
      <button class="ep" data-key="deletePost"><span class="m del">DELETE</span>/posts/:id</button>

      <div class="group-title">HISTORY</div>
      <div id="histList"></div>
    </aside>

    <div class="main">

      <div class="req-box">
        <div class="url-bar">
          <span id="mLabel" class="mlabel">GET</span>
          <input id="urlInput" class="url-in" type="text" value="/api/posts" />
          <button id="btnSend" class="btn-send">Send</button>
        </div>
        <div class="tabs">
          <button class="tab active" data-t="params">Params</button>
          <button class="tab" data-t="headers">Headers</button>
          <button class="tab" data-t="body">Body</button>
        </div>
        <div id="pane-params" class="pane">
          <div class="pane-hint">Query params for GET /api/posts</div>
          <div class="prow"><label>page</label><input class="pin" id="qPage" placeholder="1"/></div>
          <div class="prow"><label>limit</label><input class="pin" id="qLimit" placeholder="10"/></div>
          <div class="prow"><label>tag</label><input class="pin" id="qTag" placeholder="javascript"/></div>
        </div>
        <div id="pane-headers" class="pane" style="display:none">
          <div class="pane-hint">Authorization (auto-filled after login)</div>
          <div class="prow"><label>Authorization</label><input class="pin wide" id="authIn" placeholder="Bearer ..."/></div>
        </div>
        <div id="pane-body" class="pane" style="display:none">
          <div class="prow-top">
            <span class="pane-hint">Request body (JSON)</span>
            <button id="btnPretty" class="btn-sm">Prettify</button>
          </div>
          <textarea id="bodyIn" class="body-ed" rows="6"></textarea>
        </div>
      </div>

      <div class="resp-box">
        <div class="resp-top">
          <span class="resp-label">RESPONSE</span>
          <span id="statusBadge" class="status-badge"></span>
          <span id="timeLabel" class="time-label"></span>
          <button id="btnCopy" class="btn-sm" style="margin-left:auto">Copy</button>
        </div>
        <pre id="respOut" class="resp-pre">// Select an endpoint and click Send</pre>
      </div>

    </div>

    <aside class="docs">
      <div class="group-title">DOCS</div>
      <div id="docsBox" class="docs-body">Select an endpoint.</div>
    </aside>

  </div>
</div>

<script src="script.js"></script>
</body>
</html>`;

const styleCss = `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%}
body{font-family:'Segoe UI',system-ui,sans-serif;background:#0d1117;color:#e6edf3;font-size:13px;line-height:1.5;overflow:hidden}
button{cursor:pointer;font-family:inherit}
input,textarea{font-family:inherit}

#app{display:flex;flex-direction:column;height:100vh}

/* TOP BAR */
.topbar{display:flex;align-items:center;justify-content:space-between;padding:0 16px;height:48px;background:#161b22;border-bottom:1px solid #30363d;flex-shrink:0}
.topbar-left{display:flex;align-items:center;gap:10px}
.brand-icon{width:30px;height:30px;background:linear-gradient(135deg,#238636,#2ea043);border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:14px;color:#fff;font-family:monospace}
.brand-name{font-weight:800;font-size:14px}
.brand-sub{font-size:10px;color:#484f58;background:#21262d;padding:2px 7px;border-radius:99px;border:1px solid #30363d}
.topbar-right{display:flex;align-items:center;gap:8px;font-size:12px}
.label{color:#484f58}
.token-val{color:#3fb950;font-family:monospace;font-size:11px;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.btn-sm{padding:3px 10px;background:none;border:1px solid #30363d;border-radius:4px;color:#8b949e;font-size:11px;transition:all .12s}
.btn-sm:hover{color:#e6edf3;border-color:#8b949e}

/* LAYOUT */
.layout{display:grid;grid-template-columns:200px 1fr 240px;flex:1;overflow:hidden}

/* SIDEBAR */
.sidebar{background:#161b22;border-right:1px solid #30363d;overflow-y:auto;padding:8px 0}
.group-title{font-size:10px;font-weight:700;letter-spacing:1.2px;color:#484f58;padding:10px 12px 4px;text-transform:uppercase}
.ep{display:flex;align-items:center;gap:7px;width:100%;padding:6px 12px;background:none;border:none;border-left:2px solid transparent;color:#8b949e;text-align:left;font-size:11px;font-family:monospace;transition:all .12s}
.ep:hover{background:#21262d;color:#e6edf3}
.ep.active{background:#161b22;border-left-color:#58a6ff;color:#e6edf3}
.m{font-size:9px;font-weight:800;padding:2px 4px;border-radius:3px;min-width:42px;text-align:center;flex-shrink:0}
.get{background:#0d4429;color:#3fb950}
.post{background:#0c2d6b;color:#58a6ff}
.put{background:#3b2300;color:#d29922}
.del{background:#3d0c0c;color:#f85149}

/* HISTORY */
#histList{padding:0 4px}
.hist{display:flex;align-items:center;gap:6px;padding:4px 8px;cursor:pointer;font-family:monospace;font-size:11px;color:#484f58;transition:background .1s}
.hist:hover{background:#21262d;color:#8b949e}
.hist-s{font-weight:800;min-width:26px}
.hist-p{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1}

/* MAIN */
.main{display:flex;flex-direction:column;overflow:hidden;border-right:1px solid #30363d}

/* REQUEST */
.req-box{padding:12px 14px;border-bottom:1px solid #30363d;flex-shrink:0}
.url-bar{display:flex;gap:8px;margin-bottom:10px}
.mlabel{padding:6px 10px;background:#21262d;border-radius:5px;font-size:11px;font-weight:800;font-family:monospace;min-width:58px;text-align:center;color:#3fb950}
.url-in{flex:1;padding:6px 10px;background:#21262d;border:1px solid #30363d;border-radius:5px;color:#e6edf3;font-size:13px;font-family:monospace;outline:none;transition:border-color .15s}
.url-in:focus{border-color:#58a6ff}
.btn-send{padding:6px 16px;background:#238636;color:#fff;border:none;border-radius:5px;font-size:13px;font-weight:700;transition:background .15s}
.btn-send:hover{background:#2ea043}

.tabs{display:flex;gap:2px;border-bottom:1px solid #21262d;margin-bottom:8px}
.tab{padding:5px 12px;background:none;border:none;border-bottom:2px solid transparent;color:#8b949e;font-size:12px;font-weight:600;margin-bottom:-1px;transition:color .12s}
.tab:hover{color:#e6edf3}
.tab.active{color:#58a6ff;border-bottom-color:#58a6ff}

.pane{display:block}
.pane-hint{font-size:11px;color:#484f58;margin-bottom:6px}
.prow{display:flex;align-items:center;gap:8px;margin-bottom:5px}
.prow label{font-size:11px;color:#8b949e;font-family:monospace;min-width:90px;text-align:right}
.pin{flex:1;padding:4px 8px;background:#21262d;border:1px solid #30363d;border-radius:4px;color:#e6edf3;font-size:12px;font-family:monospace;outline:none}
.pin:focus{border-color:#58a6ff}
.pin::placeholder{color:#30363d}
.pin.wide{min-width:0}
.prow-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}
.body-ed{width:100%;padding:8px 10px;background:#21262d;border:1px solid #30363d;border-radius:5px;color:#e6edf3;font-size:12px;font-family:monospace;resize:vertical;outline:none;line-height:1.6}
.body-ed:focus{border-color:#58a6ff}

/* RESPONSE */
.resp-box{flex:1;display:flex;flex-direction:column;padding:12px 14px;overflow:hidden;min-height:0}
.resp-top{display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-shrink:0}
.resp-label{font-size:10px;font-weight:700;letter-spacing:1px;color:#484f58}
.status-badge{font-size:11px;font-weight:800;padding:2px 7px;border-radius:4px;font-family:monospace}
.s2{background:#0d4429;color:#3fb950}
.s4{background:#3d0c0c;color:#f85149}
.s5{background:#3b2300;color:#d29922}
.time-label{font-size:11px;color:#484f58;font-family:monospace}
.resp-pre{flex:1;background:#161b22;border:1px solid #30363d;border-radius:5px;padding:10px 12px;overflow:auto;font-family:monospace;font-size:12px;line-height:1.7;color:#8b949e;white-space:pre;min-height:0}
.jk{color:#79c0ff}.js{color:#a5d6ff}.jn{color:#f2cc60}.jb{color:#ff7b72}.jl{color:#8b949e}

/* DOCS */
.docs{background:#161b22;overflow-y:auto;padding:8px 0}
.docs-body{padding:4px 12px 12px;font-size:12px;color:#8b949e;line-height:1.7}
.docs-body h4{color:#e6edf3;font-size:12px;font-weight:700;margin:10px 0 4px}
.docs-body p{margin-bottom:6px}
.docs-body pre{background:#0d1117;border:1px solid #30363d;border-radius:5px;padding:8px 10px;margin:5px 0;font-family:monospace;font-size:11px;color:#e6edf3;white-space:pre-wrap;line-height:1.5}
.docs-body .note{background:#1c2128;border-left:3px solid #58a6ff;padding:6px 10px;border-radius:0 4px 4px 0;margin:6px 0;font-size:11px}
.docs-body .warn{border-left-color:#d29922}

@media(max-width:800px){.layout{grid-template-columns:180px 1fr}.docs{display:none}}`;

const scriptJs = `'use strict';

// ================================================================
// DATABASE
// ================================================================
var DB = {
  users: [
    {id:'u1', name:'Alex Morgan',  email:'alex@demo.com',   password:'pass123', createdAt:'2024-01-01'},
    {id:'u2', name:'Sarah Chen',   email:'sarah@demo.com',  password:'pass123', createdAt:'2024-01-02'},
    {id:'u3', name:'Marcus Lee',   email:'marcus@demo.com', password:'pass123', createdAt:'2024-01-03'}
  ],
  posts: [
    {id:'p1', title:'Getting Started with REST APIs',  body:'REST APIs use HTTP methods for CRUD operations. The four main methods are GET, POST, PUT, and DELETE.',           authorId:'u1', tags:['api','beginner'],       createdAt:'2024-01-10', updatedAt:'2024-01-10'},
    {id:'p2', title:'JavaScript Closures Deep Dive',   body:'A closure is a function that retains access to variables from its outer scope even after the outer function returns.', authorId:'u2', tags:['javascript','advanced'], createdAt:'2024-01-11', updatedAt:'2024-01-11'},
    {id:'p3', title:'CSS Grid Layout Guide',           body:'CSS Grid is a two-dimensional layout system. Use grid-template-columns and grid-template-rows to define structure.', authorId:'u1', tags:['css','layout'],          createdAt:'2024-01-12', updatedAt:'2024-01-12'},
    {id:'p4', title:'Node.js Async/Await Patterns',   body:'Async/await is syntactic sugar over Promises. Use try/catch for error handling and Promise.all for parallel ops.',   authorId:'u3', tags:['nodejs','async'],        createdAt:'2024-01-13', updatedAt:'2024-01-13'},
    {id:'p5', title:'SQL vs NoSQL: When to Use Each', body:'Relational databases use structured tables. NoSQL databases like MongoDB use flexible documents.',                     authorId:'u2', tags:['database','sql'],        createdAt:'2024-01-14', updatedAt:'2024-01-14'}
  ],
  tokens: {}
};

// ================================================================
// ENDPOINT DEFAULT BODIES  (no embedded newlines or quotes)
// ================================================================
var BODIES = {
  register:   '{ "name": "John Doe", "email": "john@example.com", "password": "secret123" }',
  login:      '{ "email": "alex@demo.com", "password": "pass123" }',
  me:         '',
  listPosts:  '',
  getPost:    '',
  createPost: '{ "title": "My Article", "body": "Content goes here.", "tags": ["javascript"] }',
  updatePost: '{ "title": "Updated Title", "body": "Updated content." }',
  deletePost: ''
};

var METHODS = {
  register:'POST', login:'POST', me:'GET',
  listPosts:'GET', getPost:'GET', createPost:'POST',
  updatePost:'PUT', deletePost:'DELETE'
};

var URLS = {
  register:'/api/auth/register', login:'/api/auth/login', me:'/api/users/me',
  listPosts:'/api/posts', getPost:'/api/posts/p1', createPost:'/api/posts',
  updatePost:'/api/posts/p1', deletePost:'/api/posts/p1'
};

var DEFAULT_TAB = {
  register:'body', login:'body', me:'headers',
  listPosts:'params', getPost:'params', createPost:'body',
  updatePost:'body', deletePost:'headers'
};

// ================================================================
// DOCS (plain text only - no quotes, no special chars)
// ================================================================
var DOCS = {
  register: {
    title: 'POST /api/auth/register',
    desc: 'Create a new user account. Returns the user object (password excluded).',
    auth: false,
    body: 'name     - string, required | email    - string, required | password - string, min 6 chars',
    resp: '201 Created      user object | 400 Bad Request  missing fields or short password | 409 Conflict     email already registered'
  },
  login: {
    title: 'POST /api/auth/login',
    desc: 'Login and receive a JWT token. The token is auto-saved for protected endpoints.',
    auth: false,
    body: 'email    - string, required | password - string, required',
    resp: '200 OK           { token, user } | 401 Unauthorized  wrong password | 404 Not Found    user not found'
  },
  me: {
    title: 'GET /api/users/me',
    desc: 'Get the authenticated user profile. Requires a valid Bearer token.',
    auth: true,
    body: 'No body needed.',
    resp: '200 OK           user profile | 401 Unauthorized  no or invalid token'
  },
  listPosts: {
    title: 'GET /api/posts',
    desc: 'List all posts with pagination. Public endpoint, no auth needed.',
    auth: false,
    body: 'Query params (all optional): | page  - page number, default 1 | limit - per page, default 10, max 50 | tag   - filter by tag name',
    resp: '200 OK  { posts[], total, page, totalPages }'
  },
  getPost: {
    title: 'GET /api/posts/:id',
    desc: 'Get a single post by ID including author details. Public endpoint.',
    auth: false,
    body: 'No body. Replace :id in URL. | Example: /api/posts/p1',
    resp: '200 OK       post with author | 404 Not Found  post not found'
  },
  createPost: {
    title: 'POST /api/posts',
    desc: 'Create a new post. Authentication required.',
    auth: true,
    body: 'title - string, required | body  - string, required | tags  - array of strings, optional',
    resp: '201 Created     new post object | 400 Bad Request  missing title or body | 401 Unauthorized  not logged in'
  },
  updatePost: {
    title: 'PUT /api/posts/:id',
    desc: 'Update a post. Only the original author can update their own posts.',
    auth: true,
    body: 'title - string, optional | body  - string, optional | tags  - array, optional',
    resp: '200 OK           updated post | 401 Unauthorized  no token | 403 Forbidden    not the author | 404 Not Found    post not found'
  },
  deletePost: {
    title: 'DELETE /api/posts/:id',
    desc: 'Delete a post. Only the original author can delete their own posts.',
    auth: true,
    body: 'No body. Replace :id in URL. | Example: /api/posts/p1',
    resp: '200 OK           { message, id } | 401 Unauthorized  no token | 403 Forbidden    not the author | 404 Not Found    post not found'
  }
};

// ================================================================
// STATE
// ================================================================
var currentToken = localStorage.getItem('rest_token') || '';
var reqHistory = [];

// ================================================================
// INIT
// ================================================================
(function init() {
  // Sidebar clicks
  document.querySelectorAll('.ep').forEach(function(btn) {
    btn.addEventListener('click', function() {
      selectEndpoint(this.dataset.key);
    });
  });

  // Tab clicks
  document.querySelectorAll('.tab').forEach(function(t) {
    t.addEventListener('click', function() { switchTab(this.dataset.t); });
  });

  document.getElementById('btnSend').addEventListener('click', sendRequest);
  document.getElementById('btnPretty').addEventListener('click', prettify);
  document.getElementById('btnCopy').addEventListener('click', copyResp);
  document.getElementById('btnClearToken').addEventListener('click', clearToken);

  if (currentToken) {
    document.getElementById('authIn').value = 'Bearer ' + currentToken;
    setTokenDisplay(currentToken);
  }

  selectEndpoint('listPosts');
}());

// ================================================================
// SELECT ENDPOINT
// ================================================================
function selectEndpoint(key) {
  document.querySelectorAll('.ep').forEach(function(b) {
    b.classList.toggle('active', b.dataset.key === key);
  });

  var method = METHODS[key];
  var url    = URLS[key];
  var body   = BODIES[key];
  var tab    = DEFAULT_TAB[key];

  var ml = document.getElementById('mLabel');
  ml.textContent = method;
  var colors = {GET:'#3fb950', POST:'#58a6ff', PUT:'#d29922', DELETE:'#f85149'};
  ml.style.color = colors[method] || '#e6edf3';

  document.getElementById('urlInput').value = url;
  document.getElementById('bodyIn').value   = body || '';

  switchTab(tab);
  renderDocs(key);
}

// ================================================================
// TABS
// ================================================================
function switchTab(name) {
  document.querySelectorAll('.tab').forEach(function(t) {
    t.classList.toggle('active', t.dataset.t === name);
  });
  ['params','headers','body'].forEach(function(t) {
    var el = document.getElementById('pane-' + t);
    if (el) el.style.display = t === name ? 'block' : 'none';
  });
}

// ================================================================
// SEND REQUEST
// ================================================================
function sendRequest() {
  var method = document.getElementById('mLabel').textContent.trim();
  var url    = document.getElementById('urlInput').value.trim();
  var auth   = document.getElementById('authIn').value.trim();
  var body   = document.getElementById('bodyIn').value.trim();

  if (method === 'GET' && url === '/api/posts') {
    var page  = document.getElementById('qPage').value.trim();
    var limit = document.getElementById('qLimit').value.trim();
    var tag   = document.getElementById('qTag').value.trim();
    var qs = [];
    if (page)  qs.push('page='  + encodeURIComponent(page));
    if (limit) qs.push('limit=' + encodeURIComponent(limit));
    if (tag)   qs.push('tag='   + encodeURIComponent(tag));
    if (qs.length) url += '?' + qs.join('&');
  }

  var t0  = Date.now();
  var res = router(method, url, auth, body);
  var ms  = Date.now() - t0;

  if (res.status === 200 && res.data && res.data.token) {
    currentToken = res.data.token;
    localStorage.setItem('rest_token', currentToken);
    document.getElementById('authIn').value = 'Bearer ' + currentToken;
    setTokenDisplay(currentToken);
  }

  renderResponse(res.status, res.data, ms);
  addHistory(method, url, res.status);
}

// ================================================================
// ROUTER
// ================================================================
function router(method, rawUrl, authHeader, rawBody) {
  var parts  = rawUrl.split('?');
  var path   = parts[0];
  var query  = parseQS(parts[1] || '');
  var body   = {};

  if (rawBody && rawBody.trim()) {
    try { body = JSON.parse(rawBody); }
    catch(e) { return resp(400, {error: 'Invalid JSON body: ' + e.message}); }
  }

  var userId = null;
  if (authHeader && authHeader.indexOf('Bearer ') === 0) {
    var tok = authHeader.slice(7).trim();
    userId  = DB.tokens[tok] || null;
  }

  // POST /api/auth/register
  if (method === 'POST' && path === '/api/auth/register') {
    if (!body.name || !body.email || !body.password)
      return resp(400, {error: 'name, email and password are required'});
    if (body.password.length < 6)
      return resp(400, {error: 'password must be at least 6 characters'});
    if (DB.users.find(function(u){return u.email===body.email;}))
      return resp(409, {error: 'Email already registered'});
    var nu = {id:'u'+Date.now(), name:body.name, email:body.email, password:body.password, createdAt:today()};
    DB.users.push(nu);
    return resp(201, {id:nu.id, name:nu.name, email:nu.email, createdAt:nu.createdAt});
  }

  // POST /api/auth/login
  if (method === 'POST' && path === '/api/auth/login') {
    if (!body.email || !body.password)
      return resp(400, {error: 'email and password are required'});
    var u = DB.users.find(function(u){return u.email===body.email;});
    if (!u)               return resp(404, {error: 'User not found'});
    if (u.password !== body.password) return resp(401, {error: 'Invalid password'});
    var token = 'eyJ.' + btoa(u.id+':'+Date.now()).replace(/=/g,'') + '.sig';
    DB.tokens[token] = u.id;
    return resp(200, {token:token, user:{id:u.id, name:u.name, email:u.email}});
  }

  // GET /api/users/me
  if (method === 'GET' && path === '/api/users/me') {
    if (!userId) return resp(401, {error: 'Authorization required'});
    var me = DB.users.find(function(u){return u.id===userId;});
    if (!me) return resp(404, {error: 'User not found'});
    return resp(200, {id:me.id, name:me.name, email:me.email, createdAt:me.createdAt});
  }

  // GET /api/posts
  if (method === 'GET' && path === '/api/posts') {
    var page  = Math.max(1, parseInt(query.page  || '1')  || 1);
    var lim   = Math.min(50, Math.max(1, parseInt(query.limit || '10') || 10));
    var tag   = (query.tag || '').toLowerCase();
    var list  = DB.posts.slice();
    if (tag) list = list.filter(function(p){return p.tags.indexOf(tag) !== -1;});
    var total  = list.length;
    var paged  = list.slice((page-1)*lim, page*lim).map(function(p) {
      var au = DB.users.find(function(u){return u.id===p.authorId;});
      return {id:p.id, title:p.title, excerpt:p.body.slice(0,80)+'...', tags:p.tags,
              author: au ? {id:au.id,name:au.name} : null, createdAt:p.createdAt};
    });
    return resp(200, {posts:paged, total:total, page:page, totalPages:Math.ceil(total/lim)});
  }

  // GET /api/posts/:id
  var gpId = getId(path, '/api/posts/');
  if (method === 'GET' && gpId) {
    var post = DB.posts.find(function(p){return p.id===gpId;});
    if (!post) return resp(404, {error: 'Post not found: ' + gpId});
    var au   = DB.users.find(function(u){return u.id===post.authorId;});
    return resp(200, {id:post.id, title:post.title, body:post.body, tags:post.tags,
                      author: au ? {id:au.id,name:au.name} : null,
                      createdAt:post.createdAt, updatedAt:post.updatedAt});
  }

  // POST /api/posts
  if (method === 'POST' && path === '/api/posts') {
    if (!userId) return resp(401, {error: 'Authorization required'});
    if (!body.title) return resp(400, {error: 'title is required'});
    if (!body.body)  return resp(400, {error: 'body is required'});
    var np = {id:'p'+Date.now(), title:body.title, body:body.body, authorId:userId,
              tags: Array.isArray(body.tags) ? body.tags : [],
              createdAt:today(), updatedAt:today()};
    DB.posts.unshift(np);
    return resp(201, np);
  }

  // PUT /api/posts/:id
  var putId = getId(path, '/api/posts/');
  if (method === 'PUT' && putId) {
    if (!userId) return resp(401, {error: 'Authorization required'});
    var i = DB.posts.findIndex(function(p){return p.id===putId;});
    if (i === -1) return resp(404, {error: 'Post not found: ' + putId});
    if (DB.posts[i].authorId !== userId) return resp(403, {error: 'Forbidden - not the author'});
    if (body.title) DB.posts[i].title = body.title;
    if (body.body)  DB.posts[i].body  = body.body;
    if (Array.isArray(body.tags)) DB.posts[i].tags = body.tags;
    DB.posts[i].updatedAt = today();
    return resp(200, DB.posts[i]);
  }

  // DELETE /api/posts/:id
  var delId = getId(path, '/api/posts/');
  if (method === 'DELETE' && delId) {
    if (!userId) return resp(401, {error: 'Authorization required'});
    var di = DB.posts.findIndex(function(p){return p.id===delId;});
    if (di === -1) return resp(404, {error: 'Post not found: ' + delId});
    if (DB.posts[di].authorId !== userId) return resp(403, {error: 'Forbidden - not the author'});
    DB.posts.splice(di, 1);
    return resp(200, {message:'Post deleted', id:delId});
  }

  return resp(404, {error: 'Not found: ' + method + ' ' + path});
}

// ================================================================
// HELPERS
// ================================================================
function getId(path, prefix) {
  if (path.indexOf(prefix) !== 0) return null;
  var rest = path.slice(prefix.length);
  return (rest && rest.indexOf('/') === -1) ? rest : null;
}

function parseQS(qs) {
  var out = {};
  if (!qs) return out;
  qs.split('&').forEach(function(p) {
    var kv = p.split('=');
    if (kv[0]) out[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || '');
  });
  return out;
}

function today() {
  return new Date().toISOString().slice(0,10);
}

function resp(status, data) {
  return {status:status, data:data};
}

// ================================================================
// RENDER RESPONSE
// ================================================================
var STATUS_TEXT = {200:'OK',201:'Created',204:'No Content',400:'Bad Request',
                  401:'Unauthorized',403:'Forbidden',404:'Not Found',
                  409:'Conflict',429:'Too Many Requests',500:'Server Error'};

function renderResponse(status, data, ms) {
  var badge = document.getElementById('statusBadge');
  var time  = document.getElementById('timeLabel');
  var out   = document.getElementById('respOut');

  badge.textContent = status + ' ' + (STATUS_TEXT[status] || '');
  badge.className   = 'status-badge ' + (status < 300 ? 's2' : status < 500 ? 's4' : 's5');
  time.textContent  = ms + 'ms';
  out.innerHTML     = highlight(JSON.stringify(data, null, 2));
  out.style.color   = '#e6edf3';
}

function highlight(json) {
  var s = json.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  return s.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(m) {
    var c = 'jn';
    if (m.charAt(0)==='"') c = m.slice(-1)===':' ? 'jk' : 'js';
    else if (m==='true'||m==='false') c='jb';
    else if (m==='null') c='jl';
    return '<span class="' + c + '">' + m + '</span>';
  });
}

// ================================================================
// HISTORY
// ================================================================
function addHistory(method, url, status) {
  reqHistory.unshift({method:method, url:url, status:status});
  if (reqHistory.length > 8) reqHistory.pop();
  var list = document.getElementById('histList');
  list.innerHTML = '';
  reqHistory.forEach(function(item) {
    var d  = document.createElement('div');
    d.className = 'hist';
    var sc = item.status < 300 ? '#3fb950' : '#f85149';
    var ss = document.createElement('span');
    ss.className = 'hist-s';
    ss.style.color = sc;
    ss.textContent = item.status;
    var sm = document.createElement('span');
    sm.style.color = '#484f58';
    sm.textContent = item.method.slice(0,3);
    var sp = document.createElement('span');
    sp.className = 'hist-p';
    sp.textContent = item.url.replace('/api','').split('?')[0];
    d.appendChild(ss); d.appendChild(sm); d.appendChild(sp);
    d.addEventListener('click', function() {
      document.getElementById('urlInput').value = item.url;
      var ml = document.getElementById('mLabel');
      ml.textContent = item.method;
      var colors = {GET:'#3fb950', POST:'#58a6ff', PUT:'#d29922', DELETE:'#f85149'};
      ml.style.color = colors[item.method] || '#e6edf3';
    });
    list.appendChild(d);
  });
}

// ================================================================
// DOCS
// ================================================================
function renderDocs(key) {
  var d  = DOCS[key];
  if (!d) return;
  var el = document.getElementById('docsBox');
  var authNote = d.auth
    ? '<div class="note warn">Requires Authorization: Bearer TOKEN</div>'
    : '<div class="note">Public - no auth needed</div>';
  el.innerHTML =
    '<h4>' + d.title + '</h4>' +
    '<p>' + d.desc + '</p>' +
    authNote +
    '<h4>Request</h4><pre>' + d.body + '</pre>' +
    '<h4>Responses</h4><pre>' + d.resp + '</pre>';
}

// ================================================================
// TOKEN / PRETTIFY / COPY
// ================================================================
function setTokenDisplay(t) {
  var el = document.getElementById('tokenVal');
  if (el) {
    el.textContent = t ? t.slice(0,22)+'...' : 'not logged in';
    el.style.color = t ? '#3fb950' : '#484f58';
  }
}

function clearToken() {
  currentToken = '';
  localStorage.removeItem('rest_token');
  document.getElementById('authIn').value = '';
  setTokenDisplay('');
}

function prettify() {
  var ta = document.getElementById('bodyIn');
  if (!ta.value.trim()) return;
  try { ta.value = JSON.stringify(JSON.parse(ta.value), null, 2); }
  catch(e) { renderResponse(400, {error: 'Invalid JSON: ' + e.message}, 0); }
}

function copyResp() {
  var text = document.getElementById('respOut').textContent;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(function() {
      var b = document.getElementById('btnCopy');
      b.textContent = 'Copied!';
      setTimeout(function(){b.textContent='Copy';}, 1500);
    });
  }
}`;

export const restApiProject: Project = {
  id: 'rest-api',
  slug: 'rest-api',
  title: 'REST API with Node.js',
  difficulty: 'intermediate',
  type: 'frontend',
  estimatedTime: '8-12 hours',
  playgroundKey: 'rest-api',
  description: 'Build an interactive REST API Explorer that simulates a full blog API in the browser. Learn HTTP methods, status codes, JWT authentication, and CRUD operations hands-on.',
  overview: 'REST APIs power every modern web and mobile application. This project gives you a hands-on sandbox to experiment with authentication, CRUD operations, error handling, and HTTP status codes — no real server needed. The in-browser simulator mirrors exactly how a production Express + MongoDB API behaves.',
  objective: 'Build and interact with a simulated REST API that handles user authentication with JWT tokens and full CRUD operations on blog posts.',
  technologies: ['Node.js', 'Express.js', 'MongoDB', 'JWT'],
  prerequisites: ['JavaScript fundamentals', 'Basic HTTP knowledge', 'JSON format'],
  learnings: [
    'HTTP methods: GET, POST, PUT, DELETE',
    'HTTP status codes: 200, 201, 400, 401, 403, 404, 409',
    'JWT authentication flow: login to get token, use token in headers',
    'RESTful URL naming conventions',
    'Request body, headers, and query parameters',
    'Auth middleware pattern',
    'Pagination with page and limit params',
    'Owner-only protection: 401 vs 403',
  ],
  features: [
    '8 real API endpoints with full CRUD',
    'In-memory database with 3 users and 5 posts',
    'User registration and login with simulated JWT',
    'Auth token auto-saved from login and reused',
    'Query param builder (page, limit, tag)',
    'JSON body editor with Prettify button',
    'JSON syntax highlighting in response',
    'HTTP status badge with color coding',
    'Request history with click to replay',
    'Per-endpoint documentation panel',
    'Dark terminal theme',
  ],
  fileStructure: 'rest-api-explorer/ |   index.html |   style.css |   script.js',
  files: [
    { path: 'rest-api-explorer/index.html', language: 'html',       content: indexHtml },
    { path: 'rest-api-explorer/style.css',  language: 'css',        content: styleCss  },
    { path: 'rest-api-explorer/script.js',  language: 'javascript', content: scriptJs  },
  ],
  lessons: [
    {
      id: 'http-methods',
      title: 'HTTP Methods: The Verbs of REST',
      explanation: 'REST APIs use HTTP methods to express intent. The same URL behaves differently based on the method — GET reads, POST creates, PUT updates, DELETE removes. This predictable pattern makes REST APIs easy to learn and use across any language.',
      js: `// Same URL, four different operations:
GET    /api/posts      // list all posts
POST   /api/posts      // create a new post
GET    /api/posts/p1   // get one post
PUT    /api/posts/p1   // update post p1
DELETE /api/posts/p1   // delete post p1

// In Express.js:
app.get('/api/posts',        listPosts);
app.post('/api/posts',       createPost);
app.put('/api/posts/:id',    updatePost);
app.delete('/api/posts/:id', deletePost);`,
    },
    {
      id: 'status-codes',
      title: 'HTTP Status Codes',
      explanation: '2xx means success, 4xx means the client made an error, 5xx means the server failed. The key distinction: 401 means not authenticated (no valid token), 403 means authenticated but not allowed (wrong user). Getting these right makes your API self-documenting.',
      js: `// Common codes you will use every day:
200 OK           // request succeeded
201 Created      // new resource was created (use after POST)
400 Bad Request  // client sent missing or invalid data
401 Unauthorized // not logged in, or invalid token
403 Forbidden    // logged in, but not allowed to do this
404 Not Found    // resource does not exist
409 Conflict     // duplicate (e.g. email already taken)

// Example:
app.post('/api/posts', (req, res) => {
  if (!req.body.title)
    return res.status(400).json({ error: 'title required' });
  const post = db.create(req.body);
  res.status(201).json(post); // 201 not 200 for creation
});`,
    },
    {
      id: 'jwt',
      title: 'JWT Authentication Flow',
      explanation: 'JWT (JSON Web Token) authentication is stateless. The server issues a signed token at login. The client sends it in the Authorization header for every protected request. The server verifies the signature without a database lookup — fast and scalable.',
      js: `// Step 1: Login to get a token
POST /api/auth/login
Body: { email: "alex@demo.com", password: "pass123" }
Response: { token: "eyJ.abc.sig", user: {...} }

// Step 2: Use token for protected routes
GET /api/users/me
Headers: Authorization: Bearer eyJ.abc.sig

// Step 3: Server verifies the token (Express middleware):
function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  const token = auth.replace('Bearer ', '');
  const userId = jwt.verify(token, process.env.JWT_SECRET);
  req.userId = userId; // attach to request
  next();
}`,
    },
    {
      id: 'rest-urls',
      title: 'RESTful URL Design',
      explanation: 'REST URLs are nouns (resources), not verbs (actions). The HTTP method is the verb. Collections are plural, items include their ID. This convention makes your API instantly familiar to any developer.',
      js: `// GOOD - nouns as resources:
GET    /api/posts          // collection
POST   /api/posts          // create in collection
GET    /api/posts/p1       // single item
PUT    /api/posts/p1       // update item
DELETE /api/posts/p1       // delete item

// Nested resources:
GET  /api/posts/p1/comments  // comments on a post
POST /api/posts/p1/comments  // add a comment

// Query params for search/filter:
GET /api/posts?page=2&limit=5&tag=javascript

// BAD - never use verbs in URLs:
GET  /api/getPost/p1   // wrong
POST /api/deletePost   // wrong`,
    },
    {
      id: 'ownership',
      title: 'Authentication vs Authorization',
      explanation: 'Authentication asks "who are you?" — a valid token answers this. Authorization asks "are you allowed?" — owning the resource answers this. These are two separate checks. Return 401 if unauthenticated, 403 if authenticated but not the owner.',
      js: `async function updatePost(req, res) {
  // Check 1: authenticated?
  if (!req.userId)
    return res.status(401).json({ error: 'Login required' });
  // 401 = who are you?

  // Check 2: resource exists?
  const post = await Post.findById(req.params.id);
  if (!post)
    return res.status(404).json({ error: 'Not found' });

  // Check 3: user owns it?
  if (post.authorId !== req.userId)
    return res.status(403).json({ error: 'Forbidden' });
  // 403 = I know you, but NO
  // Never return 401 here — that would be wrong

  // All checks passed — do the update
  Object.assign(post, req.body, { updatedAt: new Date() });
  await post.save();
  res.json(post);
}`,
    },
  ],
  challenges: [
    {
      id: 'comments',
      title: 'Add Comments to Posts',
      difficulty: 'medium',
      description: 'Implement GET /api/posts/:id/comments (public) and POST /api/posts/:id/comments (auth required). Each comment needs id, postId, authorId, body, and createdAt.',
      hint: 'Add DB.comments = []. Detect the route by checking path.endsWith("/comments"). Extract postId with path.split("/")[3]. For POST, validate auth and body.body exists.',
      solutionJs: `// Add to DB: DB.comments = [];

// In router(), before the 404 fallback:
if (path.endsWith('/comments')) {
  var postId = path.split('/')[3];
  var post = DB.posts.find(function(p){return p.id===postId;});
  if (!post) return resp(404, {error: 'Post not found'});

  if (method === 'GET') {
    var comments = DB.comments.filter(function(c){return c.postId===postId;});
    return resp(200, {comments:comments, total:comments.length});
  }

  if (method === 'POST') {
    if (!userId) return resp(401, {error: 'Auth required'});
    if (!body.body) return resp(400, {error: 'body is required'});
    var comment = {id:'c'+Date.now(), postId:postId,
                   authorId:userId, body:body.body, createdAt:today()};
    DB.comments.push(comment);
    return resp(201, comment);
  }
}`,
    },
    {
      id: 'search',
      title: 'Full-Text Search',
      difficulty: 'easy',
      description: 'Add ?search=term to GET /api/posts so it filters posts where the title or body contains the search term (case-insensitive).',
      hint: 'In the GET /api/posts handler, read query.search. Use toLowerCase() and indexOf() to filter after the tag filter.',
      solutionJs: `// In the GET /api/posts handler, after the tag filter:
var search = (query.search || '').toLowerCase().trim();
if (search) {
  list = list.filter(function(p) {
    return p.title.toLowerCase().indexOf(search) !== -1 ||
           p.body.toLowerCase().indexOf(search) !== -1;
  });
}
// Then continue with pagination`,
    },
    {
      id: 'rate-limit',
      title: 'Rate Limiting',
      difficulty: 'hard',
      description: 'Allow max 10 requests per minute per user. Return 429 Too Many Requests when exceeded.',
      hint: 'Keep a rateLimits object keyed by userId or "anon". Store timestamps array. On each request, remove entries older than 60s, then check if count >= 10.',
      solutionJs: `// Add at top of router():
var RATE = RATE || {};
var rk   = userId || 'anon';
var now  = Date.now();
if (!RATE[rk]) RATE[rk] = [];
RATE[rk] = RATE[rk].filter(function(t){return now-t < 60000;});
if (RATE[rk].length >= 10) {
  var wait = Math.ceil((60000-(now-RATE[rk][0]))/1000);
  return resp(429, {error:'Too Many Requests', retryAfter: wait+'s'});
}
RATE[rk].push(now);`,
    },
  ],
};
