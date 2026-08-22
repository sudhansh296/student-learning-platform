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
  <div class="app">

    <!-- Top Bar -->
    <header class="topbar">
      <div class="topbar-left">
        <div class="brand">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect width="22" height="22" rx="5" fill="#00d4aa"/>
            <path d="M5 11h12M11 5v12" stroke="#0d1117" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
          <span class="brand-name">REST API Explorer</span>
        </div>
        <span class="brand-sub">Blog API Simulator</span>
      </div>
      <div class="topbar-right">
        <div class="token-display" id="tokenDisplay">
          <span class="token-label">Token:</span>
          <span class="token-val" id="tokenVal">not logged in</span>
          <button class="clear-token-btn" id="clearTokenBtn" title="Clear token">x</button>
        </div>
      </div>
    </header>

    <div class="main-layout">

      <!-- Sidebar: Endpoint List -->
      <aside class="sidebar">
        <div class="sidebar-title">ENDPOINTS</div>

        <div class="endpoint-group">
          <div class="group-label">Auth</div>
          <button class="endpoint-btn" data-endpoint="register">
            <span class="method-badge post">POST</span>
            <span class="ep-path">/api/auth/register</span>
          </button>
          <button class="endpoint-btn" data-endpoint="login">
            <span class="method-badge post">POST</span>
            <span class="ep-path">/api/auth/login</span>
          </button>
        </div>

        <div class="endpoint-group">
          <div class="group-label">Users</div>
          <button class="endpoint-btn" data-endpoint="getMe">
            <span class="method-badge get">GET</span>
            <span class="ep-path">/api/users/me</span>
          </button>
        </div>

        <div class="endpoint-group">
          <div class="group-label">Posts</div>
          <button class="endpoint-btn" data-endpoint="listPosts">
            <span class="method-badge get">GET</span>
            <span class="ep-path">/api/posts</span>
          </button>
          <button class="endpoint-btn" data-endpoint="getPost">
            <span class="method-badge get">GET</span>
            <span class="ep-path">/api/posts/:id</span>
          </button>
          <button class="endpoint-btn" data-endpoint="createPost">
            <span class="method-badge post">POST</span>
            <span class="ep-path">/api/posts</span>
          </button>
          <button class="endpoint-btn" data-endpoint="updatePost">
            <span class="method-badge put">PUT</span>
            <span class="ep-path">/api/posts/:id</span>
          </button>
          <button class="endpoint-btn" data-endpoint="deletePost">
            <span class="method-badge delete">DELETE</span>
            <span class="ep-path">/api/posts/:id</span>
          </button>
        </div>

        <div class="sidebar-divider"></div>

        <div class="sidebar-title" style="margin-top:0">HISTORY</div>
        <div class="history-list" id="historyList">
          <div class="history-empty">No requests yet</div>
        </div>
      </aside>

      <!-- Main Panel -->
      <div class="panel">

        <!-- Request Builder -->
        <div class="request-section">
          <div class="section-header">
            <span class="section-title">Request</span>
            <div class="request-line" id="requestLine">
              <span class="rl-method" id="rlMethod">GET</span>
              <span class="rl-url" id="rlUrl">http://localhost:3001/api/posts</span>
            </div>
          </div>

          <!-- URL Params (path params like :id) -->
          <div class="param-row" id="paramRow" style="display:none">
            <label class="param-label">Path Param</label>
            <div class="param-inputs" id="paramInputs"></div>
          </div>

          <!-- Query Params -->
          <div class="param-row" id="queryRow" style="display:none">
            <label class="param-label">Query Params</label>
            <div class="param-inputs" id="queryInputs"></div>
          </div>

          <!-- Auth Header -->
          <div class="param-row" id="authRow">
            <label class="param-label">Authorization</label>
            <div class="auth-field">
              <span class="auth-prefix">Bearer</span>
              <input type="text" class="auth-input" id="authInput" placeholder="paste token here, or use login first" spellcheck="false" />
            </div>
          </div>

          <!-- Request Body -->
          <div class="body-section" id="bodySection" style="display:none">
            <div class="body-header">
              <span class="param-label">Body (JSON)</span>
              <button class="btn-sm" id="prettyBtn">Prettify</button>
            </div>
            <textarea class="body-editor" id="bodyEditor" rows="8" spellcheck="false" placeholder="{}"></textarea>
            <div class="body-error" id="bodyError"></div>
          </div>

          <div class="request-actions">
            <button class="btn-send" id="sendBtn">Send Request</button>
            <div class="sending-indicator" id="sendingIndicator">
              <span class="dot-anim"></span> Sending...
            </div>
          </div>
        </div>

        <!-- Response Panel -->
        <div class="response-section" id="responseSection">
          <div class="section-header">
            <span class="section-title">Response</span>
            <div class="response-meta" id="responseMeta" style="display:none">
              <span class="status-badge" id="statusBadge">200</span>
              <span class="resp-time" id="respTime">0ms</span>
            </div>
          </div>
          <div class="resp-headers-block" id="respHeadersBlock" style="display:none">
            <div class="resp-headers-title">Headers</div>
            <pre class="resp-headers-pre" id="respHeaders"></pre>
          </div>
          <div class="resp-body-block">
            <div class="resp-empty" id="respEmpty">Send a request to see the response</div>
            <pre class="resp-body" id="respBody" style="display:none"></pre>
          </div>
        </div>

      </div><!-- end .panel -->
    </div><!-- end .main-layout -->
  </div><!-- end .app -->

  <!-- Endpoint Description Tooltip -->
  <div class="ep-info" id="epInfo" style="display:none">
    <div class="ep-info-title" id="epInfoTitle"></div>
    <div class="ep-info-desc" id="epInfoDesc"></div>
  </div>

  <script src="script.js"></script>
</body>
</html>`;

const styleCss = `/* ===== RESET & BASE ===== */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 14px; }
body {
  font-family: 'Segoe UI', system-ui, sans-serif;
  background: #0d1117;
  color: #c9d1d9;
  min-height: 100vh;
  overflow-x: hidden;
}

/* ===== APP ===== */
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* ===== TOPBAR ===== */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #161b22;
  border-bottom: 1px solid #30363d;
  padding: 0 16px;
  height: 48px;
  flex-shrink: 0;
}
.topbar-left { display: flex; align-items: center; gap: 14px; }
.brand { display: flex; align-items: center; gap: 8px; }
.brand-name { font-weight: 700; font-size: 15px; color: #e6edf3; letter-spacing: -0.3px; }
.brand-sub { font-size: 11px; color: #6e7681; border-left: 1px solid #30363d; padding-left: 14px; }
.topbar-right { display: flex; align-items: center; gap: 10px; }
.token-display {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #1c2128;
  border: 1px solid #30363d;
  border-radius: 6px;
  padding: 4px 10px;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 11px;
}
.token-label { color: #6e7681; }
.token-val { color: #00d4aa; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.clear-token-btn {
  background: none;
  border: none;
  color: #6e7681;
  cursor: pointer;
  font-size: 12px;
  line-height: 1;
  padding: 0 2px;
}
.clear-token-btn:hover { color: #f85149; }

/* ===== MAIN LAYOUT ===== */
.main-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* ===== SIDEBAR ===== */
.sidebar {
  width: 240px;
  flex-shrink: 0;
  background: #161b22;
  border-right: 1px solid #30363d;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 12px 0;
}
.sidebar-title {
  font-size: 10px;
  font-weight: 700;
  color: #6e7681;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  padding: 0 12px 8px;
  margin-top: 4px;
}
.sidebar-divider { height: 1px; background: #30363d; margin: 10px 0; }
.endpoint-group { margin-bottom: 6px; }
.group-label {
  font-size: 10px;
  font-weight: 600;
  color: #6e7681;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  padding: 4px 12px;
}
.endpoint-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 7px 12px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.12s;
}
.endpoint-btn:hover { background: #1c2128; }
.endpoint-btn.active { background: #1c2128; border-right: 2px solid #00d4aa; }
.ep-path { font-family: 'Consolas', 'Courier New', monospace; font-size: 12px; color: #c9d1d9; }

/* ===== METHOD BADGES ===== */
.method-badge {
  font-size: 9px;
  font-weight: 800;
  padding: 2px 5px;
  border-radius: 3px;
  font-family: 'Consolas', 'Courier New', monospace;
  flex-shrink: 0;
  min-width: 44px;
  text-align: center;
  letter-spacing: 0.4px;
}
.method-badge.get    { background: #0d2c1a; color: #3fb950; border: 1px solid #1e4a2e; }
.method-badge.post   { background: #1a2a0d; color: #7ee787; border: 1px solid #2e4a1e; }
.method-badge.put    { background: #2a1a0d; color: #e3b341; border: 1px solid #4a3a1e; }
.method-badge.delete { background: #2a0d0d; color: #f85149; border: 1px solid #4a1e1e; }

/* ===== HISTORY LIST ===== */
.history-list { flex: 1; overflow-y: auto; }
.history-empty { font-size: 11px; color: #6e7681; padding: 8px 12px; font-style: italic; }
.history-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  cursor: pointer;
  border-bottom: 1px solid #21262d;
  transition: background 0.12s;
}
.history-item:hover { background: #1c2128; }
.history-item .method-badge { font-size: 8px; padding: 1px 4px; min-width: 36px; }
.history-path { font-family: 'Consolas', 'Courier New', monospace; font-size: 10px; color: #8b949e; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
.history-status { font-size: 10px; font-weight: 700; min-width: 28px; text-align: right; }
.history-status.ok  { color: #3fb950; }
.history-status.err { color: #f85149; }

/* ===== PANEL ===== */
.panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ===== SECTION HEADER ===== */
.section-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  background: #161b22;
  border-bottom: 1px solid #30363d;
  flex-shrink: 0;
}
.section-title {
  font-size: 11px;
  font-weight: 700;
  color: #6e7681;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}
.request-line {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 12px;
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 5px;
  padding: 4px 10px;
  flex: 1;
}
.rl-method { color: #e3b341; font-weight: 700; }
.rl-url { color: #79c0ff; }

/* ===== REQUEST SECTION ===== */
.request-section {
  flex: 0 0 auto;
  overflow-y: auto;
  max-height: 55%;
  border-bottom: 1px solid #30363d;
}
.param-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 16px;
  border-bottom: 1px solid #21262d;
}
.param-label { font-size: 11px; font-weight: 600; color: #6e7681; min-width: 110px; padding-top: 7px; text-transform: uppercase; letter-spacing: 0.5px; }
.param-inputs { display: flex; flex-direction: column; gap: 6px; flex: 1; }
.param-group { display: flex; align-items: center; gap: 8px; }
.param-key {
  width: 120px;
  padding: 6px 8px;
  background: #1c2128;
  border: 1px solid #30363d;
  border-radius: 5px;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 12px;
  color: #e3b341;
  outline: none;
}
.param-value {
  flex: 1;
  padding: 6px 8px;
  background: #1c2128;
  border: 1px solid #30363d;
  border-radius: 5px;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 12px;
  color: #c9d1d9;
  outline: none;
  transition: border-color 0.15s;
}
.param-value:focus { border-color: #00d4aa; }
.auth-field { display: flex; align-items: center; gap: 8px; flex: 1; }
.auth-prefix { font-size: 11px; color: #6e7681; font-family: 'Consolas', 'Courier New', monospace; }
.auth-input {
  flex: 1;
  padding: 6px 8px;
  background: #1c2128;
  border: 1px solid #30363d;
  border-radius: 5px;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 12px;
  color: #00d4aa;
  outline: none;
  transition: border-color 0.15s;
}
.auth-input:focus { border-color: #00d4aa; }
.body-section { padding: 10px 16px 0; }
.body-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.body-editor {
  width: 100%;
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 6px;
  color: #c9d1d9;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.6;
  padding: 10px 12px;
  resize: vertical;
  outline: none;
  transition: border-color 0.15s;
}
.body-editor:focus { border-color: #00d4aa; }
.body-error { font-size: 11px; color: #f85149; min-height: 18px; padding: 4px 0; }
.btn-sm {
  padding: 3px 10px;
  background: #1c2128;
  border: 1px solid #30363d;
  border-radius: 4px;
  color: #8b949e;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.12s;
}
.btn-sm:hover { background: #30363d; color: #c9d1d9; }
.request-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
}
.btn-send {
  padding: 8px 24px;
  background: #00d4aa;
  border: none;
  border-radius: 6px;
  color: #0d1117;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
}
.btn-send:hover { background: #00b894; }
.btn-send:active { transform: scale(0.97); }
.btn-send:disabled { background: #1c4a3e; color: #00d4aa66; cursor: not-allowed; transform: none; }
.sending-indicator {
  display: none;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6e7681;
}
.sending-indicator.visible { display: flex; }
@keyframes dotPulse {
  0%,100% { opacity: 1; }
  50% { opacity: 0.2; }
}
.dot-anim {
  width: 8px; height: 8px;
  background: #00d4aa;
  border-radius: 50%;
  display: inline-block;
  animation: dotPulse 0.9s infinite;
}

/* ===== RESPONSE SECTION ===== */
.response-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.response-meta { display: flex; align-items: center; gap: 10px; }
.status-badge {
  font-size: 12px;
  font-weight: 800;
  padding: 2px 9px;
  border-radius: 4px;
  font-family: 'Consolas', 'Courier New', monospace;
}
.status-badge.s2xx { background: #0d2c1a; color: #3fb950; border: 1px solid #1e4a2e; }
.status-badge.s4xx { background: #2a0d0d; color: #f85149; border: 1px solid #4a1e1e; }
.status-badge.s5xx { background: #2a1a0d; color: #e3b341; border: 1px solid #4a3a1e; }
.resp-time { font-size: 11px; color: #6e7681; font-family: 'Consolas', 'Courier New', monospace; }
.resp-headers-block { padding: 8px 16px; border-bottom: 1px solid #21262d; }
.resp-headers-title { font-size: 10px; font-weight: 700; color: #6e7681; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px; }
.resp-headers-pre {
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 11px;
  color: #8b949e;
  line-height: 1.6;
  background: #161b22;
  border-radius: 5px;
  padding: 8px 10px;
}
.resp-body-block { flex: 1; overflow: auto; padding: 12px 16px; }
.resp-empty { color: #6e7681; font-size: 13px; padding: 30px 0; text-align: center; font-style: italic; }
.resp-body {
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-all;
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 6px;
  padding: 12px 14px;
  color: #c9d1d9;
}
/* JSON syntax highlighting */
.resp-body .json-key    { color: #79c0ff; }
.resp-body .json-str    { color: #a5d6ff; }
.resp-body .json-num    { color: #79c0ff; }
.resp-body .json-bool   { color: #56d364; }
.resp-body .json-null   { color: #6e7681; }

/* ===== EP INFO ===== */
.ep-info {
  position: fixed;
  top: 56px;
  right: 12px;
  background: #1c2128;
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 10px 14px;
  max-width: 280px;
  z-index: 100;
  box-shadow: 0 4px 16px rgba(0,0,0,0.4);
}
.ep-info-title { font-size: 12px; font-weight: 700; color: #e6edf3; margin-bottom: 5px; }
.ep-info-desc { font-size: 11px; color: #8b949e; line-height: 1.5; }

/* ===== SCROLLBAR ===== */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #30363d; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #484f58; }

/* ===== RESPONSIVE ===== */
@media (max-width: 700px) {
  .sidebar { width: 180px; }
  .ep-path { font-size: 10px; }
  .brand-sub { display: none; }
}
@media (max-width: 500px) {
  .sidebar { display: none; }
  .panel { flex: 1; }
}`;

const scriptJs = `// =======================================================
// REST API Explorer - in-browser blog API simulator
// Simulates: auth, posts CRUD, JWT tokens, HTTP codes
// =======================================================

// -------------------------------------------------------
// IN-MEMORY DATABASE
// -------------------------------------------------------
var db = {
  users: [
    { id: 'u1', name: 'Alice Smith', email: 'alice@example.com', password: 'pass123', createdAt: '2024-01-10T09:00:00Z' },
    { id: 'u2', name: 'Bob Jones',  email: 'bob@example.com',   password: 'pass456', createdAt: '2024-01-11T10:00:00Z' }
  ],
  posts: [
    { id: 'p1', title: 'Getting Started with REST APIs', body: 'REST stands for Representational State Transfer. It is an architectural style for building web services that communicate over HTTP.', tags: ['api', 'beginner'], authorId: 'u1', createdAt: '2024-01-12T08:00:00Z', updatedAt: '2024-01-12T08:00:00Z' },
    { id: 'p2', title: 'JWT Authentication Explained',   body: 'JSON Web Tokens are a compact way to transmit information between parties as a JSON object. They consist of three parts: header, payload, and signature.', tags: ['auth', 'jwt'],    authorId: 'u1', createdAt: '2024-01-13T09:00:00Z', updatedAt: '2024-01-13T09:00:00Z' },
    { id: 'p3', title: 'MongoDB vs PostgreSQL',          body: 'Choosing between MongoDB and PostgreSQL depends on your data shape. MongoDB is flexible with documents, PostgreSQL excels at relational data with complex queries.', tags: ['database'],    authorId: 'u2', createdAt: '2024-01-14T10:00:00Z', updatedAt: '2024-01-14T10:00:00Z' },
    { id: 'p4', title: 'Express.js Middleware Deep Dive', body: 'Middleware in Express is a function that has access to the request and response objects. It can execute code, modify req/res, end the cycle, or call next().', tags: ['express', 'nodejs'], authorId: 'u2', createdAt: '2024-01-15T11:00:00Z', updatedAt: '2024-01-15T11:00:00Z' }
  ],
  tokens: {}  // token string -> userId
};

var idCounter = 100;
function genId(prefix) { return prefix + (++idCounter); }
function fakeToken(userId) {
  var token = 'eyJ.fake.' + btoa(userId + ':' + Date.now()).replace(/=/g, '').slice(0, 24);
  db.tokens[token] = userId;
  return token;
}
function getUserFromToken(token) {
  if (!token) return null;
  var userId = db.tokens[token];
  if (!userId) return null;
  return db.users.find(function(u) { return u.id === userId; }) || null;
}
function findUserByEmail(email) { return db.users.find(function(u) { return u.email === email; }) || null; }
function findPost(id) { return db.posts.find(function(p) { return p.id === id; }) || null; }
function populateAuthor(post) {
  var author = db.users.find(function(u) { return u.id === post.authorId; });
  var out = Object.assign({}, post);
  delete out.authorId;
  out.author = author ? { id: author.id, name: author.name, email: author.email } : null;
  return out;
}

// -------------------------------------------------------
// SIMULATED API HANDLER
// -------------------------------------------------------
function simulateRequest(method, path, headers, body) {
  var authHeader = headers['Authorization'] || '';
  var token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

  // POST /api/auth/register
  if (method === 'POST' && path === '/api/auth/register') {
    var name = body && body.name ? body.name.trim() : '';
    var email = body && body.email ? body.email.trim().toLowerCase() : '';
    var password = body && body.password ? body.password : '';
    if (!name || !email || !password) {
      return { status: 400, body: { error: 'All fields are required', fields: ['name', 'email', 'password'] } };
    }
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      return { status: 400, body: { error: 'Invalid email address' } };
    }
    if (password.length < 6) {
      return { status: 400, body: { error: 'Password must be at least 6 characters' } };
    }
    if (findUserByEmail(email)) {
      return { status: 409, body: { error: 'Email is already registered' } };
    }
    var newUser = { id: genId('u'), name: name, email: email, password: password, createdAt: new Date().toISOString() };
    db.users.push(newUser);
    var tok = fakeToken(newUser.id);
    return { status: 201, body: { token: tok, user: { id: newUser.id, name: newUser.name, email: newUser.email } } };
  }

  // POST /api/auth/login
  if (method === 'POST' && path === '/api/auth/login') {
    var loginEmail = body && body.email ? body.email.trim().toLowerCase() : '';
    var loginPass  = body && body.password ? body.password : '';
    if (!loginEmail || !loginPass) {
      return { status: 400, body: { error: 'Email and password are required' } };
    }
    var loginUser = findUserByEmail(loginEmail);
    if (!loginUser || loginUser.password !== loginPass) {
      return { status: 401, body: { error: 'Invalid email or password' } };
    }
    var loginTok = fakeToken(loginUser.id);
    return { status: 200, body: { token: loginTok, user: { id: loginUser.id, name: loginUser.name, email: loginUser.email } } };
  }

  // GET /api/users/me
  if (method === 'GET' && path === '/api/users/me') {
    var meUser = getUserFromToken(token);
    if (!meUser) return { status: 401, body: { error: 'No valid token provided' } };
    return { status: 200, body: { id: meUser.id, name: meUser.name, email: meUser.email, createdAt: meUser.createdAt } };
  }

  // GET /api/posts
  if (method === 'GET' && path === '/api/posts') {
    var page  = (headers['_page']  && parseInt(headers['_page'],  10)) || 1;
    var limit = (headers['_limit'] && parseInt(headers['_limit'], 10)) || 10;
    var tag   = headers['_tag'] || '';
    var filtered = db.posts.slice();
    if (tag) { filtered = filtered.filter(function(p) { return p.tags.indexOf(tag) !== -1; }); }
    var total = filtered.length;
    var pages = Math.ceil(total / limit);
    var start = (page - 1) * limit;
    var slice = filtered.slice(start, start + limit).map(populateAuthor);
    return { status: 200, body: { posts: slice, total: total, page: page, pages: pages } };
  }

  // GET /api/posts/:id
  var getPostMatch = path.match(/^\/api\/posts\/([^/]+)$/);
  if (method === 'GET' && getPostMatch) {
    var gpPost = findPost(getPostMatch[1]);
    if (!gpPost) return { status: 404, body: { error: 'Post not found' } };
    return { status: 200, body: populateAuthor(gpPost) };
  }

  // POST /api/posts
  if (method === 'POST' && path === '/api/posts') {
    var cpUser = getUserFromToken(token);
    if (!cpUser) return { status: 401, body: { error: 'Authentication required. Include a Bearer token.' } };
    var cpTitle = body && body.title ? body.title.trim() : '';
    var cpBody  = body && body.body  ? body.body.trim()  : '';
    if (!cpTitle || !cpBody) return { status: 400, body: { error: 'title and body are required' } };
    var cpTags = (body && Array.isArray(body.tags)) ? body.tags : [];
    var newPost = { id: genId('p'), title: cpTitle, body: cpBody, tags: cpTags, authorId: cpUser.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    db.posts.unshift(newPost);
    return { status: 201, body: populateAuthor(newPost) };
  }

  // PUT /api/posts/:id
  var putMatch = path.match(/^\/api\/posts\/([^/]+)$/);
  if (method === 'PUT' && putMatch) {
    var upUser = getUserFromToken(token);
    if (!upUser) return { status: 401, body: { error: 'Authentication required. Include a Bearer token.' } };
    var upPost = findPost(putMatch[1]);
    if (!upPost) return { status: 404, body: { error: 'Post not found' } };
    if (upPost.authorId !== upUser.id) return { status: 403, body: { error: 'Forbidden: you are not the author of this post' } };
    if (body && body.title) upPost.title = body.title.trim();
    if (body && body.body)  upPost.body  = body.body.trim();
    if (body && Array.isArray(body.tags)) upPost.tags = body.tags;
    upPost.updatedAt = new Date().toISOString();
    return { status: 200, body: populateAuthor(upPost) };
  }

  // DELETE /api/posts/:id
  var delMatch = path.match(/^\/api\/posts\/([^/]+)$/);
  if (method === 'DELETE' && delMatch) {
    var delUser = getUserFromToken(token);
    if (!delUser) return { status: 401, body: { error: 'Authentication required. Include a Bearer token.' } };
    var delPost = findPost(delMatch[1]);
    if (!delPost) return { status: 404, body: { error: 'Post not found' } };
    if (delPost.authorId !== delUser.id) return { status: 403, body: { error: 'Forbidden: you are not the author of this post' } };
    db.posts = db.posts.filter(function(p) { return p.id !== delPost.id; });
    return { status: 200, body: { message: 'Post deleted successfully', id: delPost.id } };
  }

  return { status: 404, body: { error: 'Endpoint not found' } };
}

// -------------------------------------------------------
// ENDPOINT DEFINITIONS
// -------------------------------------------------------
var ENDPOINTS = {
  register: {
    method: 'POST', path: '/api/auth/register',
    title: 'Register a new user',
    desc: 'Creates a new account. Returns a JWT token. Requires name, email, and password.',
    auth: false, hasBody: true, pathParams: [], queryParams: [],
    defaultBody: { name: 'Jane Dev', email: 'jane@example.com', password: 'secret123' }
  },
  login: {
    method: 'POST', path: '/api/auth/login',
    title: 'Login',
    desc: 'Authenticates a user and returns a JWT token. Try: alice@example.com / pass123',
    auth: false, hasBody: true, pathParams: [], queryParams: [],
    defaultBody: { email: 'alice@example.com', password: 'pass123' }
  },
  getMe: {
    method: 'GET', path: '/api/users/me',
    title: 'Get current user',
    desc: 'Returns the authenticated user profile. Requires a valid Bearer token.',
    auth: true, hasBody: false, pathParams: [], queryParams: []
  },
  listPosts: {
    method: 'GET', path: '/api/posts',
    title: 'List all posts',
    desc: 'Returns a paginated list of posts. Optional query params: page, limit, tag.',
    auth: false, hasBody: false, pathParams: [],
    queryParams: [
      { key: 'page',  placeholder: '1' },
      { key: 'limit', placeholder: '10' },
      { key: 'tag',   placeholder: 'api' }
    ]
  },
  getPost: {
    method: 'GET', path: '/api/posts/:id',
    title: 'Get a single post',
    desc: 'Returns a single post by its ID. Try: p1, p2, p3, or p4.',
    auth: false, hasBody: false,
    pathParams: [{ key: 'id', placeholder: 'p1' }], queryParams: []
  },
  createPost: {
    method: 'POST', path: '/api/posts',
    title: 'Create a post',
    desc: 'Creates a new post. Requires a valid Bearer token (login first).',
    auth: true, hasBody: true, pathParams: [], queryParams: [],
    defaultBody: { title: 'My New Post', body: 'This is the content of my new post.', tags: ['tutorial'] }
  },
  updatePost: {
    method: 'PUT', path: '/api/posts/:id',
    title: 'Update a post',
    desc: 'Updates a post. You must be the author. Login as alice@example.com to edit p1 or p2.',
    auth: true, hasBody: true,
    pathParams: [{ key: 'id', placeholder: 'p1' }], queryParams: [],
    defaultBody: { title: 'Updated Title', body: 'Updated content here.', tags: ['updated'] }
  },
  deletePost: {
    method: 'DELETE', path: '/api/posts/:id',
    title: 'Delete a post',
    desc: 'Deletes a post. You must be the author. Login as alice@example.com to delete p1 or p2.',
    auth: true, hasBody: false,
    pathParams: [{ key: 'id', placeholder: 'p1' }], queryParams: []
  }
};

// -------------------------------------------------------
// STATE
// -------------------------------------------------------
var currentEndpoint = 'listPosts';
var currentToken = '';
var history = [];

// -------------------------------------------------------
// DOM HELPERS
// -------------------------------------------------------
function $(id) { return document.getElementById(id); }

function jsonHighlight(json) {
  var str = typeof json === 'string' ? json : JSON.stringify(json, null, 2);
  return str
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, function(match) {
      var cls = 'json-num';
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? 'json-key' : 'json-str';
      } else if (/true|false/.test(match)) {
        cls = 'json-bool';
      } else if (/null/.test(match)) {
        cls = 'json-null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
}

function updateTokenDisplay() {
  var val = $('tokenVal');
  var clearBtn = $('clearTokenBtn');
  if (currentToken) {
    val.textContent = currentToken.slice(0, 32) + (currentToken.length > 32 ? '...' : '');
    clearBtn.style.display = 'inline';
  } else {
    val.textContent = 'not logged in';
    clearBtn.style.display = 'none';
  }
  $('authInput').value = currentToken;
}

function buildResolvedPath(ep) {
  var path = ep.path;
  ep.pathParams.forEach(function(param) {
    var input = document.querySelector('.param-value[data-param="' + param.key + '"]');
    var val = input ? input.value.trim() : param.placeholder;
    path = path.replace(':' + param.key, val || param.placeholder);
  });
  return path;
}

function buildQueryString(ep) {
  var parts = [];
  ep.queryParams.forEach(function(param) {
    var input = document.querySelector('.query-value[data-query="' + param.key + '"]');
    var val = input ? input.value.trim() : '';
    if (val) parts.push(param.key + '=' + encodeURIComponent(val));
  });
  return parts.length ? '?' + parts.join('&') : '';
}

function updateRequestLine() {
  var ep = ENDPOINTS[currentEndpoint];
  var path = buildResolvedPath(ep);
  var qs   = buildQueryString(ep);
  $('rlMethod').textContent = ep.method;
  $('rlMethod').className = 'rl-method method-' + ep.method.toLowerCase();
  $('rlUrl').textContent = 'http://localhost:3001' + path + qs;
}

// -------------------------------------------------------
// LOAD ENDPOINT INTO BUILDER
// -------------------------------------------------------
function loadEndpoint(key) {
  currentEndpoint = key;
  var ep = ENDPOINTS[key];

  // Highlight active sidebar button
  document.querySelectorAll('.endpoint-btn').forEach(function(btn) {
    btn.classList.toggle('active', btn.getAttribute('data-endpoint') === key);
  });

  // Show ep info
  $('epInfoTitle').textContent = ep.method + ' ' + ep.path;
  $('epInfoDesc').textContent = ep.desc;
  $('epInfo').style.display = 'block';
  setTimeout(function() { $('epInfo').style.display = 'none'; }, 4000);

  // Path params
  var paramRow = $('paramRow');
  var paramInputs = $('paramInputs');
  if (ep.pathParams && ep.pathParams.length > 0) {
    paramInputs.innerHTML = '';
    ep.pathParams.forEach(function(param) {
      var g = document.createElement('div');
      g.className = 'param-group';
      var k = document.createElement('input');
      k.className = 'param-key';
      k.value = ':' + param.key;
      k.readOnly = true;
      var v = document.createElement('input');
      v.className = 'param-value';
      v.setAttribute('data-param', param.key);
      v.placeholder = param.placeholder || '';
      v.value = param.placeholder || '';
      v.addEventListener('input', updateRequestLine);
      g.appendChild(k);
      g.appendChild(v);
      paramInputs.appendChild(g);
    });
    paramRow.style.display = 'flex';
  } else {
    paramRow.style.display = 'none';
  }

  // Query params
  var queryRow = $('queryRow');
  var queryInputs = $('queryInputs');
  if (ep.queryParams && ep.queryParams.length > 0) {
    queryInputs.innerHTML = '';
    ep.queryParams.forEach(function(param) {
      var g = document.createElement('div');
      g.className = 'param-group';
      var k = document.createElement('input');
      k.className = 'param-key';
      k.value = param.key;
      k.readOnly = true;
      var v = document.createElement('input');
      v.className = 'param-value query-value';
      v.setAttribute('data-query', param.key);
      v.placeholder = param.placeholder || '';
      v.addEventListener('input', updateRequestLine);
      g.appendChild(k);
      g.appendChild(v);
      queryInputs.appendChild(g);
    });
    queryRow.style.display = 'flex';
  } else {
    queryRow.style.display = 'none';
  }

  // Body
  var bodySection = $('bodySection');
  if (ep.hasBody) {
    var defaultBody = ep.defaultBody || {};
    $('bodyEditor').value = JSON.stringify(defaultBody, null, 2);
    $('bodyError').textContent = '';
    bodySection.style.display = 'block';
  } else {
    bodySection.style.display = 'none';
  }

  // Auth row - show current token
  $('authInput').value = currentToken;

  // Reset response
  $('respEmpty').style.display = 'block';
  $('respBody').style.display = 'none';
  $('respHeadersBlock').style.display = 'none';
  $('responseMeta').style.display = 'none';

  updateRequestLine();
}

// -------------------------------------------------------
// SEND REQUEST
// -------------------------------------------------------
function sendRequest() {
  var ep = ENDPOINTS[currentEndpoint];
  var sendBtn = $('sendBtn');
  var indicator = $('sendingIndicator');

  // Parse body
  var bodyObj = null;
  if (ep.hasBody) {
    var rawBody = $('bodyEditor').value.trim();
    try {
      bodyObj = rawBody ? JSON.parse(rawBody) : {};
      $('bodyError').textContent = '';
    } catch (e) {
      $('bodyError').textContent = 'Invalid JSON: ' + e.message;
      return;
    }
  }

  // Build token from input (user may have typed manually)
  var inputToken = $('authInput').value.trim();
  if (inputToken) currentToken = inputToken;

  // Build headers object
  var resolvedPath = buildResolvedPath(ep);
  var qs = buildQueryString(ep);
  var headers = {};
  if (currentToken) headers['Authorization'] = 'Bearer ' + currentToken;

  // Pass query params as special headers for routing convenience
  if (ep.queryParams) {
    ep.queryParams.forEach(function(param) {
      var input = document.querySelector('.query-value[data-query="' + param.key + '"]');
      if (input && input.value.trim()) {
        headers['_' + param.key] = input.value.trim();
      }
    });
  }

  // Disable button, show indicator
  sendBtn.disabled = true;
  indicator.classList.add('visible');

  var startTime = Date.now();

  setTimeout(function() {
    var result = simulateRequest(ep.method, resolvedPath, headers, bodyObj);
    var elapsed = Date.now() - startTime;

    // Auto-capture token from login/register
    if (result.status === 200 || result.status === 201) {
      if (result.body && result.body.token) {
        currentToken = result.body.token;
        updateTokenDisplay();
      }
    }

    // Show response
    showResponse(result.status, elapsed, result.body, resolvedPath + qs);

    // Add to history
    addHistory(ep.method, resolvedPath + qs, result.status);

    sendBtn.disabled = false;
    indicator.classList.remove('visible');
  }, 180 + Math.random() * 120);
}

// -------------------------------------------------------
// DISPLAY RESPONSE
// -------------------------------------------------------
function showResponse(status, elapsed, body, path) {
  // Status badge
  var badge = $('statusBadge');
  var statusText = getStatusText(status);
  badge.textContent = status + ' ' + statusText;
  badge.className = 'status-badge';
  if (status >= 200 && status < 300) badge.classList.add('s2xx');
  else if (status >= 400 && status < 500) badge.classList.add('s4xx');
  else badge.classList.add('s5xx');

  $('respTime').textContent = elapsed + 'ms';
  $('responseMeta').style.display = 'flex';

  // Response headers
  var hdrs = [
    'Content-Type: application/json',
    'X-Powered-By: Express',
    'X-Request-Id: ' + Math.random().toString(36).slice(2, 10),
    'Cache-Control: no-cache',
    'Date: ' + new Date().toUTCString()
  ];
  $('respHeaders').textContent = hdrs.join('\n');
  $('respHeadersBlock').style.display = 'block';

  // Body
  $('respEmpty').style.display = 'none';
  var pre = $('respBody');
  pre.innerHTML = jsonHighlight(body);
  pre.style.display = 'block';
}

function getStatusText(code) {
  var map = { 200: 'OK', 201: 'Created', 204: 'No Content', 400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden', 404: 'Not Found', 409: 'Conflict', 500: 'Internal Server Error' };
  return map[code] || '';
}

// -------------------------------------------------------
// HISTORY
// -------------------------------------------------------
function addHistory(method, path, status) {
  history.unshift({ method: method, path: path, status: status });
  if (history.length > 10) history.pop();
  renderHistory();
}

function renderHistory() {
  var list = $('historyList');
  if (!history.length) {
    list.innerHTML = '<div class="history-empty">No requests yet</div>';
    return;
  }
  list.innerHTML = history.map(function(item, idx) {
    var isOk = item.status >= 200 && item.status < 300;
    var methodClass = item.method.toLowerCase();
    return '<div class="history-item" onclick="replayHistory(' + idx + ')">' +
      '<span class="method-badge ' + methodClass + '">' + item.method + '</span>' +
      '<span class="history-path">' + item.path + '</span>' +
      '<span class="history-status ' + (isOk ? 'ok' : 'err') + '">' + item.status + '</span>' +
    '</div>';
  }).join('');
}

function replayHistory(idx) {
  var item = history[idx];
  // find matching endpoint
  var foundKey = null;
  Object.keys(ENDPOINTS).forEach(function(key) {
    var ep = ENDPOINTS[key];
    if (ep.method === item.method) {
      var epPathBase = ep.path.split('/').slice(0, -1).join('/') || ep.path;
      var itemPathBase = item.path.split('/').slice(0, -1).join('/') || item.path;
      if (ep.path === item.path.split('?')[0] || epPathBase === itemPathBase) {
        foundKey = key;
      }
    }
  });
  if (foundKey) loadEndpoint(foundKey);
}

// -------------------------------------------------------
// EVENT LISTENERS
// -------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
  // Sidebar endpoint buttons
  document.querySelectorAll('.endpoint-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      loadEndpoint(btn.getAttribute('data-endpoint'));
    });
  });

  // Send button
  $('sendBtn').addEventListener('click', sendRequest);

  // Enter in body editor
  $('bodyEditor').addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'Enter') sendRequest();
  });

  // Prettify
  $('prettyBtn').addEventListener('click', function() {
    try {
      var parsed = JSON.parse($('bodyEditor').value);
      $('bodyEditor').value = JSON.stringify(parsed, null, 2);
      $('bodyError').textContent = '';
    } catch (e) {
      $('bodyError').textContent = 'Cannot prettify: ' + e.message;
    }
  });

  // Auth input changes
  $('authInput').addEventListener('input', function() {
    currentToken = $('authInput').value.trim();
    updateTokenDisplay();
  });

  // Clear token
  $('clearTokenBtn').addEventListener('click', function() {
    currentToken = '';
    updateTokenDisplay();
  });

  // Load default endpoint
  loadEndpoint('listPosts');
  renderHistory();
});`;

export const restApiProject: Project = {
  id: 'rest-api',
  slug: 'rest-api',
  title: 'REST API with Node.js',
  difficulty: 'intermediate',
  type: 'frontend',
  estimatedTime: '8-12 hours',
  description: 'Build an interactive REST API Explorer that simulates a real blog API in the browser. Learn how HTTP methods, status codes, JWT authentication, and CRUD operations work together by making live requests against an in-memory database.',
  overview: 'REST APIs power every modern web and mobile application. Understanding how they work is essential for full-stack development. This project gives you a hands-on sandbox to experiment with authentication, CRUD operations, error handling, and HTTP status codes without needing a real server. The in-browser simulator mirrors exactly how a production Express + MongoDB API behaves, so everything you learn here transfers directly to building real APIs.',
  objective: 'Understand REST API conventions by interacting with a simulated blog API that handles user registration, JWT auth, and full post management with realistic HTTP responses.',
  technologies: ['Node.js', 'Express.js', 'MongoDB', 'JWT'],
  prerequisites: ['JavaScript fundamentals', 'Basic understanding of HTTP', 'JSON data format'],
  learnings: [
    'HTTP methods: GET, POST, PUT, DELETE',
    'HTTP status codes and when to use them',
    'JWT token authentication flow',
    'RESTful URL conventions',
    'Request headers and JSON body format',
    'Auth middleware pattern',
    'Pagination with page and limit params',
    'Owner-only resource protection',
  ],
  features: [
    'Interactive endpoint explorer with sidebar navigation',
    'Simulated in-memory database with sample users and posts',
    'User registration and login with fake JWT tokens',
    'POST, GET, PUT, DELETE for blog posts',
    'Auth token auto-captured from login and stored',
    'Realistic HTTP status codes (200, 201, 401, 403, 404, 409)',
    'Response headers panel',
    'JSON syntax highlighting',
    'Request history (last 10 requests)',
    'Query param builder (page, limit, tag filter)',
    'Path param inputs (:id)',
    'Prettify JSON body button',
    'Dark terminal theme inspired by Postman/Insomnia',
  ],
  fileStructure: 'rest-api-explorer/\n  index.html\n  style.css\n  script.js',
  files: [
    { path: 'rest-api-explorer/index.html', language: 'html',       content: indexHtml },
    { path: 'rest-api-explorer/style.css',  language: 'css',        content: styleCss  },
    { path: 'rest-api-explorer/script.js',  language: 'javascript', content: scriptJs  },
  ],
  lessons: [
    {
      id: 'lesson-1',
      title: 'What is a REST API?',
      explanation: 'REST (Representational State Transfer) is a set of conventions for building web APIs over HTTP. Every REST API works the same way: the client sends an HTTP request with a method (GET, POST, PUT, DELETE), a URL that identifies a resource (/api/posts/p1), optional headers (like Authorization), and an optional body (JSON data). The server responds with a status code (200 OK, 404 Not Found, etc.) and usually a JSON body. The key rule is that resources are nouns in the URL and the HTTP method describes the action.',
      js: `// REST is just HTTP with conventions
// URL = resource identifier
// Method = action

GET    /api/posts        -> list all posts
GET    /api/posts/p1     -> get post with id "p1"
POST   /api/posts        -> create a new post
PUT    /api/posts/p1     -> update post "p1"
DELETE /api/posts/p1     -> delete post "p1"

// Every request gets a status code back:
200 OK          - success, returning data
201 Created     - success, new resource created
400 Bad Request - the client sent bad data
401 Unauthorized- no valid token
403 Forbidden   - token valid, but no permission
404 Not Found   - resource doesn't exist
409 Conflict    - e.g. email already registered`,
    },
    {
      id: 'lesson-2',
      title: 'User Registration and Login',
      explanation: 'Authentication in REST APIs uses tokens. The registration flow is: client POSTs credentials, server validates them, creates the user (hashing the password with bcrypt), then returns a JWT token. The login flow is the same but finds the existing user and compares the password hash. The client stores the token and includes it in future requests via the Authorization header.',
      js: `// POST /api/auth/register
// Request body:
{
  "name": "Jane Dev",
  "email": "jane@example.com",
  "password": "secret123"
}

// 201 Created response:
{
  "token": "eyJ.fake.abc123",
  "user": {
    "id": "u101",
    "name": "Jane Dev",
    "email": "jane@example.com"
  }
}

// POST /api/auth/login
// Request body:
{
  "email": "jane@example.com",
  "password": "secret123"
}
// Same response shape: { token, user }

// On the server (Express + bcrypt + jwt):
app.post('/api/auth/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user._id, name: user.name } });
});`,
    },
    {
      id: 'lesson-3',
      title: 'JWT Tokens and the Auth Header',
      explanation: 'A JWT (JSON Web Token) is a compact, URL-safe string with three base64-encoded parts separated by dots: header (algorithm), payload (data like userId), and signature (proves the token was not tampered with). Once the client has a token from login, it includes it in every protected request as an Authorization header. The server\'s auth middleware verifies the token\'s signature before allowing access to the route.',
      js: `// What a JWT looks like:
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InUxIiwiaWF0IjoxNzAwMDAwMDAwfQ.SIGNATURE
// [  header (base64)  ].[   payload (base64)   ].[  signature  ]

// Decoded payload:
{ "id": "u1", "iat": 1700000000 }

// Client sends it in the Authorization header:
Authorization: Bearer eyJhbGciOiJIUzI1NiJ...

// Server auth middleware in Express:
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id: "u1" }
    next();             // proceed to route handler
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Apply to a route:
app.post('/api/posts', auth, createPostHandler);`,
    },
    {
      id: 'lesson-4',
      title: 'CRUD for Posts',
      explanation: 'CRUD stands for Create, Read, Update, Delete - the four fundamental operations on any resource. In REST: POST creates, GET reads, PUT updates, DELETE removes. The POST and PUT endpoints for posts require a Bearer token. PUT and DELETE also check that the authenticated user is the author of the post - if not, they return 403 Forbidden. This "owner-only" pattern is essential for data security.',
      js: `// CREATE - requires auth
// POST /api/posts
// Authorization: Bearer eyJ.fake.abc123
// Body:
{ "title": "My Post", "body": "Content here.", "tags": ["tutorial"] }
// 201 Created -> returns the new post object

// READ ALL - public
// GET /api/posts?page=1&limit=10&tag=api
// 200 OK -> { posts: [...], total: 4, page: 1, pages: 1 }

// READ ONE - public
// GET /api/posts/p1
// 200 OK -> single post object with author populated
// 404 if id not found

// UPDATE - auth + must be author
// PUT /api/posts/p1
// Authorization: Bearer eyJ.fake.abc123
// Body: { "title": "Updated Title" }
// 200 OK -> updated post
// 403 Forbidden if not the author

// DELETE - auth + must be author
// DELETE /api/posts/p1
// Authorization: Bearer eyJ.fake.abc123
// 200 OK -> { message: "Post deleted successfully", id: "p1" }
// 403 Forbidden if not the author`,
    },
    {
      id: 'lesson-5',
      title: 'Status Codes and Error Handling',
      explanation: 'HTTP status codes communicate the result of every API request. Using the right code is part of a well-designed API. A good rule of thumb: 2xx means success, 4xx means the client did something wrong (fix the request), 5xx means the server failed (not the client\'s fault). Always return errors as JSON with a descriptive message so the client knows what to fix.',
      js: `// The most important status codes for REST APIs:

200 OK           // GET, PUT, DELETE succeeded
201 Created      // POST succeeded and created a resource
204 No Content   // success but nothing to return (rare in JSON APIs)

400 Bad Request  // missing fields, wrong types, validation failed
401 Unauthorized // no token, or token invalid/expired
403 Forbidden    // token is valid but user lacks permission
404 Not Found    // the resource (post/user) does not exist
409 Conflict     // resource already exists (e.g., email taken)

500 Internal Server Error // uncaught server-side exception

// Always return errors as JSON:
res.status(404).json({ error: 'Post not found' });
res.status(400).json({ error: 'All fields are required', fields: ['name', 'email'] });

// Wrap every route handler in try/catch:
app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});`,
    },
    {
      id: 'lesson-6',
      title: 'Pagination and Query Params',
      explanation: 'When a collection has many items, returning all of them at once wastes bandwidth and is slow. Pagination lets the client request a specific "page" of results. The standard pattern is to accept page and limit as query params, then use skip() and limit() in the database query. The response includes the total count and total number of pages so the client can build pagination controls. Optional filtering (like ?tag=api) is also done via query params.',
      js: `// Request:
// GET /api/posts?page=2&limit=5&tag=tutorial

// Express route handler:
app.get('/api/posts', async (req, res) => {
  const { page = 1, limit = 10, tag } = req.query;
  const pageNum  = Math.max(1, parseInt(page,  10));
  const limitNum = Math.min(50, parseInt(limit, 10)); // cap at 50

  const filter = tag ? { tags: tag } : {};

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)   // skip previous pages
      .limit(limitNum),                  // take only this page
    Post.countDocuments(filter)
  ]);

  res.json({
    posts,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum)
  });
});

// Client gets:
{
  "posts": [...],  // array of post objects
  "total": 42,     // total items matching filter
  "page": 2,       // current page
  "pages": 9       // total pages
}`,
    },
  ],
  challenges: [
    {
      id: 'c1',
      title: 'Add Comment Endpoints',
      difficulty: 'medium',
      description: 'Extend the simulator to support comments on posts. Add GET /api/posts/:id/comments (public, returns all comments for a post) and POST /api/posts/:id/comments (auth required, adds a comment). Store comments in db.comments array. Each comment should have an id, body, authorId, postId, and createdAt.',
      hint: 'Add a db.comments array with a few sample comments. Handle the routes in simulateRequest() by matching the path with a regex like /^\\/api\\/posts\\/([^/]+)\\/comments$/. For GET return comments filtered by postId. For POST check auth and push a new comment object.',
    },
    {
      id: 'c2',
      title: 'Add a Like Count',
      difficulty: 'easy',
      description: 'Add a POST /api/posts/:id/like endpoint that increments a like counter on the post. Each user can only like a post once - track this in a likes array on the post or a separate db.likes set. Return 409 Conflict if the user already liked the post.',
      hint: 'Add a likes array (of userIds) to each post in the sample data. In the handler, check if req.user.id is already in post.likes. If yes, return 409. Otherwise push the userId and return the updated like count.',
    },
    {
      id: 'c3',
      title: 'Add Field Validation with Feedback',
      description: 'Improve the register and create-post endpoints to return detailed field-level validation errors. Instead of a single error string, return an errors array where each item has a field name and message. Update the UI to display these validation errors inline next to the relevant fields in the request builder.',
      difficulty: 'medium',
      hint: 'Change the register handler to collect all validation failures into an array: [{ field: "email", message: "Invalid format" }]. Return { errors: [...] } instead of { error: "..." }. In the UI, after receiving a 400 response, parse the errors array and render them below the body editor.',
    },
    {
      id: 'c4',
      title: 'Add a cURL Preview',
      description: 'Add a "cURL" button next to the Send button that generates the equivalent curl command for the current request configuration. This helps students understand how the same API calls would be made from a terminal or script.',
      difficulty: 'hard',
      hint: 'Read the current endpoint config, path params, query params, auth token, and body. Build a string like: curl -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d \'{"email":"...","password":"..."}\'. Display it in a modal or expandable section below the request builder with a copy-to-clipboard button.',
    },
  ],
  nextProject: 'blog-platform',
};
