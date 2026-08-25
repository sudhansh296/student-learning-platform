import type { Project } from './types';

const indexHtml = `<div id="app">

  <header class="site-header">
    <div class="header-inner">
      <div class="logo" onclick="showView('list'); renderList();">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="#6366f1"/>
          <path d="M8 11h16M8 16h10M8 21h13" stroke="white" stroke-width="2.2" stroke-linecap="round"/>
        </svg>
        <span class="logo-text">DevBlog</span>
      </div>
      <div class="header-center">
        <input type="text" id="searchInput" class="search-input" placeholder="Search articles..." autocomplete="off" oninput="onSearch(this.value)" />
      </div>
      <div class="header-right">
        <button class="btn-new" onclick="showNewPost()">+ New Post</button>
        <button class="btn-theme" onclick="toggleTheme()" id="themeBtn">Dark</button>
      </div>
    </div>
  </header>

  <main class="main">

    <div id="listView">
      <div class="hero">
        <p class="hero-label">Web Development</p>
        <h1 class="hero-title">Articles for modern developers</h1>
        <p class="hero-sub">Deep dives into JavaScript, CSS, React, and the tools that power the web.</p>
        <div class="hero-stats">
          <span><strong id="statCount">6</strong> articles</span>
          <span class="dot"></span>
          <span><strong id="statViews">0</strong> total reads</span>
        </div>
      </div>

      <div class="controls">
        <div class="cat-tabs" id="catTabs">
          <button class="cat-btn active" data-cat="all" onclick="setCategory('all')">All</button>
          <button class="cat-btn" data-cat="JavaScript" onclick="setCategory('JavaScript')">JavaScript</button>
          <button class="cat-btn" data-cat="CSS" onclick="setCategory('CSS')">CSS</button>
          <button class="cat-btn" data-cat="React" onclick="setCategory('React')">React</button>
          <button class="cat-btn" data-cat="Tools" onclick="setCategory('Tools')">Tools</button>
        </div>
        <div class="sort-wrap">
          <label>Sort:</label>
          <select id="sortBy" onchange="setSort(this.value)">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="popular">Most Read</option>
          </select>
        </div>
      </div>

      <div id="postGrid" class="grid"></div>
      <div id="emptyState" class="empty" style="display:none">No articles found.</div>
    </div>

    <div id="postView" style="display:none">
      <button class="back-btn" onclick="showView('list'); renderList();">← Back to articles</button>
      <div id="postContent"></div>
    </div>

    <div id="newPostView" style="display:none">
      <div class="form-wrap">
        <div class="form-header">
          <h2>Write a new article</h2>
          <button class="btn-cancel" onclick="showView('list'); renderList();">Cancel</button>
        </div>
        <div class="form-body">
          <div class="field">
            <label>Title *</label>
            <input type="text" id="newTitle" class="input" placeholder="Article title" maxlength="120" />
          </div>
          <div class="field-row">
            <div class="field">
              <label>Category *</label>
              <select id="newCat" class="input">
                <option value="">Select...</option>
                <option value="JavaScript">JavaScript</option>
                <option value="CSS">CSS</option>
                <option value="React">React</option>
                <option value="Tools">Tools</option>
              </select>
            </div>
            <div class="field">
              <label>Author</label>
              <input type="text" id="newAuthor" class="input" placeholder="Your name" />
            </div>
          </div>
          <div class="field">
            <label>Excerpt *</label>
            <textarea id="newExcerpt" class="input" rows="2" placeholder="Short summary..."></textarea>
          </div>
          <div class="field">
            <label>Content *</label>
            <textarea id="newContent" class="input content-area" rows="12" placeholder="Write your article here..."></textarea>
          </div>
          <div class="form-footer">
            <span class="hint">Read time is auto-calculated</span>
            <button class="btn-publish" onclick="publishPost()">Publish</button>
          </div>
        </div>
      </div>
    </div>

  </main>

  <div id="deleteModal" class="modal-overlay" style="display:none" onclick="if(event.target===this)closeModal()">
    <div class="modal-box">
      <h3>Delete article?</h3>
      <p id="modalDesc">This cannot be undone.</p>
      <div class="modal-btns">
        <button onclick="closeModal()">Cancel</button>
        <button class="btn-danger" onclick="confirmDelete()">Delete</button>
      </div>
    </div>
  </div>

  <div id="toast" class="toast"></div>

</div>`;

const styleCss = `* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: var(--bg, #f8fafc);
  color: var(--text, #0f172a);
  font-size: 15px;
  line-height: 1.6;
  transition: background 0.2s, color 0.2s;
}

[data-theme="dark"] {
  --bg: #0f172a;
  --surface: #1e293b;
  --border: #334155;
  --text: #f1f5f9;
  --muted: #94a3b8;
  --accent: #818cf8;
  --accent-bg: #1e1b4b;
}

:root {
  --bg: #f8fafc;
  --surface: #ffffff;
  --border: #e2e8f0;
  --text: #0f172a;
  --muted: #64748b;
  --accent: #6366f1;
  --accent-bg: #eef2ff;
  --radius: 12px;
  --shadow: 0 2px 8px rgba(0,0,0,0.07);
}

button { cursor: pointer; font-family: inherit; }
input, select, textarea { font-family: inherit; }

.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}

.header-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  flex-shrink: 0;
}

.logo-text {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text);
}

.header-center { flex: 1; max-width: 360px; }

.search-input {
  width: 100%;
  padding: 7px 14px;
  border: 1.5px solid var(--border);
  border-radius: 99px;
  font-size: 13px;
  background: var(--bg);
  color: var(--text);
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus { border-color: var(--accent); }

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.btn-new {
  padding: 7px 14px;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
}

.btn-new:hover { opacity: 0.9; }

.btn-theme {
  padding: 6px 12px;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--muted);
  font-size: 12px;
  font-weight: 600;
}

.main {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px 60px;
}

.hero {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 16px;
  padding: 36px 40px;
  color: white;
  margin: 24px 0 28px;
}

.hero-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  opacity: 0.8;
  margin-bottom: 8px;
}

.hero-title {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 8px;
}

.hero-sub {
  font-size: 14px;
  opacity: 0.85;
  margin-bottom: 14px;
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  opacity: 0.9;
}

.dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(255,255,255,0.6);
}

.controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.cat-tabs {
  display: flex;
  gap: 4px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 4px;
}

.cat-btn {
  padding: 5px 14px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  background: transparent;
  color: var(--muted);
  transition: all 0.15s;
}

.cat-btn:hover { color: var(--text); background: var(--bg); }

.cat-btn.active {
  background: var(--accent);
  color: white;
}

.sort-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--muted);
}

.sort-wrap select {
  padding: 6px 10px;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  font-size: 13px;
  background: var(--surface);
  color: var(--text);
  outline: none;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
  display: flex;
  flex-direction: column;
  animation: fadeUp 0.25s ease both;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  border-color: var(--accent);
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.card-bar { height: 3px; }
.bar-js    { background: linear-gradient(90deg,#f59e0b,#fbbf24); }
.bar-css   { background: linear-gradient(90deg,#8b5cf6,#a78bfa); }
.bar-react { background: linear-gradient(90deg,#0ea5e9,#38bdf8); }
.bar-tools { background: linear-gradient(90deg,#10b981,#34d399); }
.bar-other { background: linear-gradient(90deg,#94a3b8,#cbd5e1); }

.card-body { padding: 16px 16px 14px; flex: 1; display: flex; flex-direction: column; }

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.badge {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 3px 8px;
  border-radius: 99px;
}

.badge-js    { background: #fef9c3; color: #854d0e; }
.badge-css   { background: #ede9fe; color: #5b21b6; }
.badge-react { background: #e0f2fe; color: #0369a1; }
.badge-tools { background: #ecfdf5; color: #065f46; }
.badge-other { background: #f1f5f9; color: #475569; }

.read-time { font-size: 11px; color: var(--muted); }

.card-title {
  font-size: 1rem;
  font-weight: 800;
  color: var(--text);
  line-height: 1.35;
  margin-bottom: 8px;
  transition: color 0.15s;
}

.card:hover .card-title { color: var(--accent); }

.card-excerpt {
  font-size: 13px;
  color: var(--muted);
  flex: 1;
  margin-bottom: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.card-author { display: flex; align-items: center; gap: 8px; }

.avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  color: white;
  font-size: 10px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-js    { background: linear-gradient(135deg,#f59e0b,#ef4444); }
.avatar-css   { background: linear-gradient(135deg,#8b5cf6,#ec4899); }
.avatar-react { background: linear-gradient(135deg,#0ea5e9,#6366f1); }
.avatar-tools { background: linear-gradient(135deg,#10b981,#0ea5e9); }
.avatar-other { background: linear-gradient(135deg,#64748b,#94a3b8); }

.author-name { font-size: 12px; font-weight: 700; color: var(--text); }
.author-date { font-size: 11px; color: var(--muted); }

.card-actions { display: flex; align-items: center; gap: 6px; }

.views { font-size: 11px; color: var(--muted); }

.btn-del {
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--muted);
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.btn-del:hover { background: #fef2f2; color: #ef4444; }

.empty {
  text-align: center;
  padding: 60px 20px;
  color: var(--muted);
  font-size: 15px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 24px 0;
  padding: 8px 16px;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--muted);
  font-size: 13px;
  font-weight: 600;
  transition: all 0.15s;
}

.back-btn:hover { color: var(--accent); border-color: var(--accent); }

.post-article { max-width: 720px; }

.post-cat { margin-bottom: 12px; }

.post-title {
  font-size: 2rem;
  font-weight: 900;
  line-height: 1.2;
  color: var(--text);
  margin-bottom: 14px;
  letter-spacing: -0.5px;
}

.post-byline {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  font-size: 13px;
  color: var(--muted);
}

.post-divider { height: 1px; background: var(--border); margin: 20px 0; }

.post-body { font-size: 16px; line-height: 1.8; color: var(--text); }
.post-body h2 { font-size: 1.4rem; font-weight: 800; margin: 32px 0 12px; }
.post-body h3 { font-size: 1.15rem; font-weight: 700; margin: 24px 0 8px; }
.post-body p  { margin-bottom: 16px; }
.post-body ul, .post-body ol { margin: 0 0 16px 24px; }
.post-body li { margin-bottom: 6px; }
.post-body strong { font-weight: 700; }
.post-body code {
  background: var(--bg);
  color: #e83e8c;
  font-family: monospace;
  font-size: 0.87em;
  padding: 1px 5px;
  border-radius: 4px;
  border: 1px solid var(--border);
}
.post-body pre {
  background: #1e293b;
  color: #e2e8f0;
  border-radius: 10px;
  padding: 18px 20px;
  margin: 20px 0;
  overflow-x: auto;
}
.post-body pre code { background: none; border: none; color: inherit; font-size: 14px; padding: 0; }
.post-body blockquote {
  border-left: 4px solid var(--accent);
  background: var(--accent-bg);
  padding: 14px 18px;
  border-radius: 0 8px 8px 0;
  margin: 20px 0;
  color: var(--muted);
  font-style: italic;
}

.form-wrap { max-width: 680px; padding-top: 24px; }

.form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.form-header h2 { font-size: 1.3rem; font-weight: 800; }

.btn-cancel {
  padding: 7px 14px;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  background: transparent;
  color: var(--muted);
  font-size: 13px;
  font-weight: 600;
}

.form-body {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 24px;
}

.field { margin-bottom: 18px; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.field label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 6px;
}

.input {
  width: 100%;
  padding: 9px 12px;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  font-size: 14px;
  background: var(--bg);
  color: var(--text);
  outline: none;
  transition: border-color 0.2s;
  resize: vertical;
}

.input:focus { border-color: var(--accent); }
.input.error { border-color: #ef4444; }
.content-area { min-height: 220px; font-family: monospace; font-size: 13px; }

.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
}

.hint { font-size: 12px; color: var(--muted); }

.btn-publish {
  padding: 10px 24px;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 800;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 500;
}

.modal-box {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 28px;
  max-width: 320px;
  width: 90%;
  text-align: center;
}

.modal-box h3 { font-size: 1.1rem; font-weight: 800; margin-bottom: 8px; }
.modal-box p  { font-size: 13px; color: var(--muted); margin-bottom: 20px; }

.modal-btns { display: flex; gap: 10px; justify-content: center; }

.modal-btns button {
  padding: 9px 22px;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  background: transparent;
  color: var(--muted);
  font-size: 13px;
  font-weight: 700;
}

.btn-danger { background: #ef4444 !important; color: white !important; border-color: #ef4444 !important; }

.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(80px);
  background: #1e293b;
  color: #f1f5f9;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  opacity: 0;
  transition: transform 0.3s, opacity 0.3s;
  pointer-events: none;
  z-index: 1000;
}

.toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }

@media (max-width: 640px) {
  .hero { padding: 24px 20px; }
  .hero-title { font-size: 1.3rem; }
  .controls { flex-direction: column; align-items: flex-start; }
  .grid { grid-template-columns: 1fr; }
  .header-center { display: none; }
  .field-row { grid-template-columns: 1fr; }
  .post-title { font-size: 1.5rem; }
}`;

const scriptJs = `// ---- DATA ----
var POSTS = [
  {
    id: 1001,
    title: "Understanding JavaScript Closures",
    category: "JavaScript",
    author: "Alex Morgan",
    date: "2024-01-15",
    excerpt: "Closures are one of the most powerful features of JavaScript. Master them and you unlock the true potential of the language.",
    content: "<h2>What is a Closure?</h2><p>A closure is a function that remembers the variables from the scope in which it was created, even after that scope has finished executing. A closure gives you access to an outer function scope from an inner function.</p><h2>A Simple Example</h2><pre><code>function makeCounter() {\\n  let count = 0;\\n\\n  return function() {\\n    count++;\\n    return count;\\n  };\\n}\\n\\nconst counter = makeCounter();\\nconsole.log(counter()); // 1\\nconsole.log(counter()); // 2\\nconsole.log(counter()); // 3</code></pre><p>Even though makeCounter() has finished running, the inner function still has access to count. That is a closure in action.</p><h2>Why Closures Matter</h2><ul><li><strong>Data privacy</strong> - emulate private variables</li><li><strong>Factory functions</strong> - create customized functions</li><li><strong>Event handlers</strong> - maintain state across events</li></ul><blockquote>Every time you write a callback or event handler, you are using closures.</blockquote>",
    views: 0,
    ts: 1705276800000
  },
  {
    id: 1002,
    title: "CSS Grid vs Flexbox: When to Use Each",
    category: "CSS",
    author: "Sarah Chen",
    date: "2024-01-22",
    excerpt: "Both CSS Grid and Flexbox are powerful layout tools, but they shine in different scenarios. Here is a practical guide.",
    content: "<h2>The Key Difference</h2><p>Flexbox is for one-dimensional layouts - either a row or a column. CSS Grid is for two-dimensional layouts - rows and columns at the same time.</p><h2>When to Use Flexbox</h2><pre><code>/* Navigation bar */\\n.navbar {\\n  display: flex;\\n  align-items: center;\\n  justify-content: space-between;\\n}\\n\\n/* Center an element */\\n.hero {\\n  display: flex;\\n  align-items: center;\\n  justify-content: center;\\n  min-height: 100vh;\\n}</code></pre><h2>When to Use Grid</h2><pre><code>/* Page layout */\\n.page {\\n  display: grid;\\n  grid-template-columns: 240px 1fr;\\n  grid-template-rows: 60px 1fr 40px;\\n  min-height: 100vh;\\n}\\n\\n/* Responsive cards */\\n.cards {\\n  display: grid;\\n  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));\\n  gap: 20px;\\n}</code></pre><blockquote>Use Grid for page structure and two-dimensional layouts. Use Flexbox for components and one-dimensional alignment.</blockquote>",
    views: 0,
    ts: 1705881600000
  },
  {
    id: 1003,
    title: "React Hooks: useState and useEffect",
    category: "React",
    author: "Marcus Williams",
    date: "2024-02-01",
    excerpt: "React Hooks changed how we write components. This guide covers useState and useEffect with real-world patterns you will use every day.",
    content: "<h2>Why Hooks?</h2><p>Before Hooks, only class components could have state and lifecycle methods. Hooks let function components do everything class components could, with simpler and more reusable code.</p><h2>useState</h2><pre><code>import { useState } from 'react';\\n\\nfunction Counter() {\\n  const [count, setCount] = useState(0);\\n\\n  return (\\n    &lt;div&gt;\\n      &lt;p&gt;Count: {count}&lt;/p&gt;\\n      &lt;button onClick={() =&gt; setCount(count + 1)}&gt;+&lt;/button&gt;\\n    &lt;/div&gt;\\n  );\\n}</code></pre><h2>useEffect</h2><pre><code>useEffect(() =&gt; {\\n  fetch('/api/users/' + userId)\\n    .then(r =&gt; r.json())\\n    .then(data =&gt; setUser(data));\\n}, [userId]); // re-runs when userId changes</code></pre><h2>Dependency Array Rules</h2><ul><li>No array - runs after every render</li><li>Empty array - runs once on mount</li><li>[a, b] - runs when a or b changes</li></ul><blockquote>Always include all variables used inside useEffect in the dependency array.</blockquote>",
    views: 0,
    ts: 1706745600000
  },
  {
    id: 1004,
    title: "Array Methods: map, filter, reduce",
    category: "JavaScript",
    author: "Alex Morgan",
    date: "2024-02-10",
    excerpt: "Array methods are the workhorses of modern JavaScript. Learn to chain them together to write expressive, readable code.",
    content: "<h2>map - Transform Every Item</h2><pre><code>const prices = [10, 20, 30];\\nconst withTax = prices.map(p =&gt; p * 1.1);\\n// [11, 22, 33]</code></pre><h2>filter - Keep Matching Items</h2><pre><code>const products = [\\n  { name: 'Laptop', price: 999, inStock: true },\\n  { name: 'Mouse',  price: 29,  inStock: false }\\n];\\n\\nconst available = products.filter(p =&gt; p.inStock);\\n// [{ name: 'Laptop', ... }]</code></pre><h2>reduce - Combine Into One Value</h2><pre><code>const orders = [\\n  { qty: 2, price: 15 },\\n  { qty: 1, price: 250 }\\n];\\n\\nconst total = orders.reduce((sum, o) =&gt; {\\n  return sum + (o.qty * o.price);\\n}, 0);\\n// 280</code></pre><h2>Chaining</h2><pre><code>const report = orders\\n  .filter(o =&gt; o.qty * o.price &gt; 20)\\n  .map(o =&gt; ({ ...o, total: o.qty * o.price }))\\n  .sort((a, b) =&gt; b.total - a.total);\\n\\nconsole.log(report);</code></pre>",
    views: 0,
    ts: 1707523200000
  },
  {
    id: 1005,
    title: "CSS Custom Properties: Variables Done Right",
    category: "CSS",
    author: "Sarah Chen",
    date: "2024-02-18",
    excerpt: "CSS Custom Properties enable dynamic theming, component APIs, and design systems you never thought possible in plain CSS.",
    content: "<h2>The Basics</h2><pre><code>:root {\\n  --color-primary: #6366f1;\\n  --spacing: 8px;\\n  --radius: 10px;\\n}\\n\\n.button {\\n  background: var(--color-primary);\\n  border-radius: var(--radius);\\n  padding: calc(var(--spacing) * 1.5) calc(var(--spacing) * 3);\\n}</code></pre><h2>Dark Mode</h2><pre><code>:root {\\n  --bg: #f8fafc;\\n  --text: #0f172a;\\n}\\n\\n[data-theme=dark] {\\n  --bg: #0f172a;\\n  --text: #f1f5f9;\\n}\\n\\nbody {\\n  background: var(--bg);\\n  color: var(--text);\\n  transition: background 0.2s;\\n}</code></pre><h2>JavaScript Integration</h2><pre><code>const root = document.documentElement;\\n\\n// Read a variable\\nconst primary = getComputedStyle(root)\\n  .getPropertyValue('--color-primary');\\n\\n// Update a variable\\nroot.style.setProperty('--color-primary', '#10b981');\\n\\n// Theme toggle\\nfunction setTheme(theme) {\\n  root.setAttribute('data-theme', theme);\\n  localStorage.setItem('theme', theme);\\n}</code></pre><blockquote>Custom properties cascade and inherit like any CSS property. You can scope them to a component and override inside media queries.</blockquote>",
    views: 0,
    ts: 1708214400000
  },
  {
    id: 1006,
    title: "Git Workflows Every Developer Should Know",
    category: "Tools",
    author: "Jordan Lee",
    date: "2024-02-25",
    excerpt: "Git is more than commit and push. These workflows separate junior from senior developers. Master branching, rebasing, and the stash.",
    content: "<h2>Feature Branch Workflow</h2><pre><code># Start a feature\\ngit checkout -b feature/login\\n\\n# Commit your work\\ngit add -p\\ngit commit -m 'feat: add login form'\\n\\n# Stay in sync with main\\ngit fetch origin\\ngit rebase origin/main\\n\\n# Push and open PR\\ngit push -u origin feature/login</code></pre><h2>The Stash</h2><pre><code># Save work in progress\\ngit stash push -m 'WIP: login page'\\n\\n# ... fix urgent bug ...\\n\\n# Restore your work\\ngit stash pop</code></pre><h2>Clean Up Commits</h2><pre><code># Rewrite last 3 commits interactively\\ngit rebase -i HEAD~3\\n\\n# Options:\\n# pick   - keep commit\\n# squash - merge into previous\\n# reword - edit message</code></pre><h2>Conventional Commits</h2><pre><code>feat: add dark mode toggle\\nfix: prevent duplicate submissions\\ndocs: update README\\nrefactor: extract auth middleware\\nchore: upgrade dependencies</code></pre><blockquote>Good commit messages answer: if applied, this commit will... Use that as your template.</blockquote>",
    views: 0,
    ts: 1708819200000
  }
];

// ---- STATE ----
var posts = [];
var currentCat = "all";
var currentSort = "newest";
var searchQuery = "";
var pendingDeleteId = null;

// ---- INIT ----
function init() {
  loadTheme();
  var saved = localStorage.getItem("devblog");
  posts = saved ? JSON.parse(saved) : POSTS.map(function(p) { return Object.assign({}, p); });
  save();
  attachListeners();
  showView("list");
  renderList();
}

function save() {
  localStorage.setItem("devblog", JSON.stringify(posts));
}

// ---- THEME ----
function loadTheme() {
  var t = localStorage.getItem("devblog_theme") || "light";
  document.body.setAttribute("data-theme", t);
  var btn = document.getElementById("themeBtn");
  if (btn) btn.textContent = t === "dark" ? "Light" : "Dark";
}

function toggleTheme() {
  var cur = document.body.getAttribute("data-theme") || "light";
  var next = cur === "dark" ? "light" : "dark";
  document.body.setAttribute("data-theme", next);
  localStorage.setItem("devblog_theme", next);
  var btn = document.getElementById("themeBtn");
  if (btn) btn.textContent = next === "dark" ? "Light" : "Dark";
}

// ---- VIEWS ----
function showView(name) {
  ["listView", "postView", "newPostView"].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
  var target = document.getElementById(name + "View");
  if (target) target.style.display = "block";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---- SEARCH / FILTER ----
function onSearch(val) {
  searchQuery = val.trim();
  renderList();
}

function setCategory(cat) {
  currentCat = cat;
  document.querySelectorAll(".cat-btn").forEach(function(b) {
    b.classList.toggle("active", b.getAttribute("data-cat") === cat);
  });
  renderList();
}

function setSort(val) {
  currentSort = val;
  renderList();
}

// ---- FILTERING ----
function getFiltered() {
  var result = posts.slice();
  if (currentCat !== "all") {
    result = result.filter(function(p) { return p.category === currentCat; });
  }
  if (searchQuery) {
    var q = searchQuery.toLowerCase();
    result = result.filter(function(p) {
      return p.title.toLowerCase().indexOf(q) !== -1 ||
             p.excerpt.toLowerCase().indexOf(q) !== -1;
    });
  }
  if (currentSort === "newest")  result.sort(function(a,b){ return b.ts - a.ts; });
  if (currentSort === "oldest")  result.sort(function(a,b){ return a.ts - b.ts; });
  if (currentSort === "popular") result.sort(function(a,b){ return (b.views||0) - (a.views||0); });
  return result;
}

// ---- RENDER LIST ----
function renderList() {
  var filtered = getFiltered();
  var grid = document.getElementById("postGrid");
  var empty = document.getElementById("emptyState");
  if (!grid) return;

  var totalViews = posts.reduce(function(s,p){ return s + (p.views||0); }, 0);
  var sc = document.getElementById("statCount");
  var sv = document.getElementById("statViews");
  if (sc) sc.textContent = posts.length;
  if (sv) sv.textContent = totalViews;

  if (filtered.length === 0) {
    grid.innerHTML = "";
    if (empty) empty.style.display = "block";
    return;
  }
  if (empty) empty.style.display = "none";

  grid.innerHTML = "";
  filtered.forEach(function(post, idx) {
    var card = buildCard(post, idx);
    grid.appendChild(card);
  });
}

function catKey(cat) {
  if (cat === "JavaScript") return "js";
  if (cat === "CSS")        return "css";
  if (cat === "React")      return "react";
  if (cat === "Tools")      return "tools";
  return "other";
}

function initials(name) {
  var p = name.trim().split(" ");
  return p.length >= 2 ? p[0][0] + p[1][0] : (name[0] || "A");
}

function readTime(content) {
  var words = content.replace(/<[^>]+>/g, " ").trim().split(/\\s+/).length;
  return Math.max(1, Math.round(words / 200)) + " min read";
}

function fmtDate(d) {
  var ms = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  var p = d.split("-");
  return ms[parseInt(p[1])-1] + " " + parseInt(p[2]) + ", " + p[0];
}

function esc(s) {
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function buildCard(post, idx) {
  var k = catKey(post.category);
  var card = document.createElement("div");
  card.className = "card";
  card.style.animationDelay = (idx * 0.04) + "s";
  card.innerHTML =
    "<div class='card-bar bar-" + k + "'></div>" +
    "<div class='card-body'>" +
      "<div class='card-top'>" +
        "<span class='badge badge-" + k + "'>" + esc(post.category) + "</span>" +
        "<span class='read-time'>" + readTime(post.content) + "</span>" +
      "</div>" +
      "<h2 class='card-title'>" + esc(post.title) + "</h2>" +
      "<p class='card-excerpt'>" + esc(post.excerpt) + "</p>" +
      "<div class='card-footer'>" +
        "<div class='card-author'>" +
          "<div class='avatar avatar-" + k + "'>" + initials(post.author) + "</div>" +
          "<div><div class='author-name'>" + esc(post.author) + "</div><div class='author-date'>" + fmtDate(post.date) + "</div></div>" +
        "</div>" +
        "<div class='card-actions'>" +
          "<span class='views'>" + (post.views||0) + " views</span>" +
          "<button class='btn-del' title='Delete' onclick='event.stopPropagation();reqDelete(" + post.id + ")'>&#128465;</button>" +
        "</div>" +
      "</div>" +
    "</div>";
  card.addEventListener("click", function(e) {
    if (e.target.closest(".btn-del")) return;
    openPost(post.id);
  });
  return card;
}

// ---- OPEN POST ----
function openPost(id) {
  var post = posts.find(function(p){ return p.id === id; });
  if (!post) return;
  post.views = (post.views||0) + 1;
  save();
  var k = catKey(post.category);
  var container = document.getElementById("postContent");
  container.innerHTML =
    "<div class='post-article'>" +
      "<div class='post-cat'><span class='badge badge-" + k + "'>" + esc(post.category) + "</span></div>" +
      "<h1 class='post-title'>" + esc(post.title) + "</h1>" +
      "<div class='post-byline'>" +
        "<div class='avatar avatar-" + k + "'>" + initials(post.author) + "</div>" +
        "<strong>" + esc(post.author) + "</strong>" +
        "<span>" + fmtDate(post.date) + "</span>" +
        "<span>|</span>" +
        "<span>" + readTime(post.content) + " &middot; " + post.views + " views</span>" +
      "</div>" +
      "<div class='post-divider'></div>" +
      "<div class='post-body'>" + post.content + "</div>" +
    "</div>";
  showView("post");
}

// ---- DELETE ----
function reqDelete(id) {
  var post = posts.find(function(p){ return p.id === id; });
  if (!post) return;
  pendingDeleteId = id;
  var desc = document.getElementById("modalDesc");
  if (desc) desc.textContent = post.title.substring(0, 60);
  var modal = document.getElementById("deleteModal");
  if (modal) modal.style.display = "flex";
}

function confirmDelete() {
  if (!pendingDeleteId) return;
  posts = posts.filter(function(p){ return p.id !== pendingDeleteId; });
  save();
  pendingDeleteId = null;
  closeModal();
  showView("list");
  renderList();
  toast("Article deleted.");
}

function closeModal() {
  var modal = document.getElementById("deleteModal");
  if (modal) modal.style.display = "none";
  pendingDeleteId = null;
}

// ---- NEW POST ----
function showNewPost() {
  ["newTitle","newAuthor","newExcerpt","newContent"].forEach(function(id){
    var el = document.getElementById(id);
    if (el) { el.value = ""; el.classList.remove("error"); }
  });
  var cat = document.getElementById("newCat");
  if (cat) { cat.value = ""; cat.classList.remove("error"); }
  showView("newPost");
}

function publishPost() {
  var title   = (document.getElementById("newTitle").value || "").trim();
  var cat     = document.getElementById("newCat").value;
  var author  = (document.getElementById("newAuthor").value || "").trim() || "Anonymous";
  var excerpt = (document.getElementById("newExcerpt").value || "").trim();
  var content = (document.getElementById("newContent").value || "").trim();

  var ok = true;
  if (!title)   { document.getElementById("newTitle").classList.add("error");   ok = false; }
  if (!cat)     { document.getElementById("newCat").classList.add("error");     ok = false; }
  if (!excerpt) { document.getElementById("newExcerpt").classList.add("error"); ok = false; }
  if (!content) { document.getElementById("newContent").classList.add("error"); ok = false; }
  if (!ok) { toast("Please fill in all required fields."); return; }

  var hasHtml = /<[a-z][\s\S]*>/i.test(content);
  if (!hasHtml) {
    content = content.split(/\\n\\n+/).map(function(p){
      return "<p>" + p.replace(/\\n/g,"<br>") + "</p>";
    }).join("");
  }

  var now = new Date();
  var mm = String(now.getMonth()+1).padStart(2,"0");
  var dd = String(now.getDate()).padStart(2,"0");
  var post = {
    id: Date.now(),
    title: title,
    category: cat,
    author: author,
    date: now.getFullYear() + "-" + mm + "-" + dd,
    excerpt: excerpt,
    content: content,
    views: 0,
    ts: Date.now()
  };
  posts.unshift(post);
  save();
  showView("list");
  renderList();
  toast("Article published!");
}

// ---- TOAST ----
function toast(msg) {
  var el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(function(){ el.classList.remove("show"); }, 2800);
}

// ---- KEYBOARD ----
document.addEventListener("keydown", function(e) {
  if (e.key !== "Escape") return;
  var modal = document.getElementById("deleteModal");
  if (modal && modal.style.display !== "none") { closeModal(); return; }
  var post = document.getElementById("postView");
  if (post && post.style.display !== "none") { showView("list"); renderList(); return; }
  var npost = document.getElementById("newPostView");
  if (npost && npost.style.display !== "none") { showView("list"); renderList(); }
});

// ---- ATTACH LISTENERS ----
function attachListeners() {
  // nothing extra needed - using onclick attributes
}

init();`;

export const blogPlatformProject: Project = {
  id: 'blog-platform',
  slug: 'blog-platform',
  title: 'Blog Platform',
  difficulty: 'intermediate',
  type: 'frontend',
  estimatedTime: '8-12 hours',
  playgroundKey: 'blog-platform',
  description: 'Build a full-featured blog platform with post cards, single post view, category filters, real-time search, new post form, delete functionality, dark mode, and localStorage persistence.',
  overview: 'This project teaches you how to build a production-quality content platform without a framework. You will architect a multi-view single-page application, manage complex state, render HTML from data, and handle user interactions gracefully.',
  objective: 'Build a complete blog where users can read articles, filter by category, search in real time, write and publish new posts, and track view counts - all persisted to localStorage.',
  technologies: ['HTML', 'CSS', 'JavaScript'],
  prerequisites: ['Basic HTML', 'CSS Layouts', 'JavaScript DOM', 'localStorage basics'],
  learnings: [
    'Single-page application view management',
    'Data-driven DOM rendering from JavaScript arrays',
    'localStorage for full data persistence',
    'CSS Custom Properties for theming and dark mode',
    'Real-time search and category filtering',
    'Form validation and user feedback patterns',
    'Read time calculation from word count',
    'View count tracking and sort by popularity',
  ],
  features: [
    'Responsive post card grid',
    'Click any card to read the full article',
    'Category filter tabs: All, JavaScript, CSS, React, Tools',
    'Real-time search by title and excerpt',
    'Sort by Newest, Oldest, and Most Read',
    'Write and publish new posts with validation',
    'Delete post with confirmation modal',
    'Dark mode toggle saved to localStorage',
    'View count increments on every article open',
    'Read time calculated automatically',
    '6 pre-loaded web development articles',
    'Toast notifications for user actions',
    'Escape key to go back',
  ],
  fileStructure: 'blog-platform/\n  index.html\n  style.css\n  script.js',
  files: [
    { path: 'blog-platform/index.html', language: 'html',       content: indexHtml },
    { path: 'blog-platform/style.css',  language: 'css',        content: styleCss  },
    { path: 'blog-platform/script.js',  language: 'javascript', content: scriptJs  },
  ],
  lessons: [
    {
      id: 'spa-views',
      title: 'Single-Page App View Management',
      explanation: 'A SPA shows different views without reloading the page. We have three views: list, post, and new post form. showView() hides all divs and shows the requested one. This is the same concept React Router automates - at its core it is just show and hide logic.',
      js: 'function showView(name) {\n  ["listView","postView","newPostView"].forEach(function(id) {\n    var el = document.getElementById(id);\n    if (el) el.style.display = "none";\n  });\n  var target = document.getElementById(name + "View");\n  if (target) target.style.display = "block";\n  window.scrollTo({ top: 0, behavior: "smooth" });\n}\n\n// Usage:\nshowView("list");    // show the post grid\nshowView("post");    // show the article view\nshowView("newPost"); // show the write form',
    },
    {
      id: 'data-render',
      title: 'Data-Driven DOM Rendering',
      explanation: 'renderList() reads the posts array, applies filters and sort, then builds the entire grid by creating DOM elements. We never hard-code post HTML - all cards are generated from data. This is exactly how React, Vue and Angular work under the hood.',
      js: 'function renderList() {\n  var filtered = getFiltered();\n  var grid = document.getElementById("postGrid");\n  grid.innerHTML = ""; // clear old cards\n\n  filtered.forEach(function(post, idx) {\n    var card = buildCard(post, idx); // like a component\n    grid.appendChild(card);\n  });\n}\n\n// buildCard is a "component" - takes data, returns DOM element\nfunction buildCard(post, idx) {\n  var card = document.createElement("div");\n  card.className = "card";\n  card.style.animationDelay = (idx * 0.04) + "s";\n  card.innerHTML = "<h2>" + esc(post.title) + "</h2>";\n  card.addEventListener("click", function() { openPost(post.id); });\n  return card;\n}',
    },
    {
      id: 'filtering',
      title: 'Real-Time Search and Filtering',
      explanation: 'getFiltered() derives the visible posts from the full array by chaining filter() calls. This is the derived state pattern - you never store a separate filtered array, you compute it on demand. Both search and category filter update a state variable then call renderList().',
      js: 'var currentCat = "all";\nvar searchQuery = "";\n\nfunction getFiltered() {\n  var result = posts.slice(); // never mutate the original\n\n  if (currentCat !== "all") {\n    result = result.filter(function(p) {\n      return p.category === currentCat;\n    });\n  }\n\n  if (searchQuery) {\n    var q = searchQuery.toLowerCase();\n    result = result.filter(function(p) {\n      return p.title.toLowerCase().indexOf(q) !== -1 ||\n             p.excerpt.toLowerCase().indexOf(q) !== -1;\n    });\n  }\n\n  return result;\n}\n\n// On every keystroke - update state, re-render\nfunction onSearch(val) {\n  searchQuery = val.trim();\n  renderList();\n}',
    },
    {
      id: 'localstorage',
      title: 'localStorage Persistence',
      explanation: 'All posts are saved to localStorage as JSON. On load, we read from localStorage or fall back to the default posts. Every mutation (publish, delete, view increment) calls save() immediately. This makes the app work offline and survive page refreshes.',
      js: 'function init() {\n  var saved = localStorage.getItem("devblog");\n  posts = saved\n    ? JSON.parse(saved)\n    : DEFAULT_POSTS.map(function(p) { return Object.assign({}, p); });\n  save();\n  renderList();\n}\n\nfunction save() {\n  localStorage.setItem("devblog", JSON.stringify(posts));\n}\n\n// Every change calls save() right away\nfunction openPost(id) {\n  var post = posts.find(function(p) { return p.id === id; });\n  post.views = (post.views || 0) + 1;\n  save(); // persist the view count immediately\n}',
    },
    {
      id: 'dark-mode',
      title: 'Dark Mode with CSS Custom Properties',
      explanation: 'Dark mode works by toggling a data-theme attribute on the body element. CSS Custom Properties defined under [data-theme="dark"] override the default light values. Every element using var(--bg) or var(--text) updates automatically with zero JavaScript.',
      js: 'function toggleTheme() {\n  var cur = document.body.getAttribute("data-theme") || "light";\n  var next = cur === "dark" ? "light" : "dark";\n  document.body.setAttribute("data-theme", next);\n  localStorage.setItem("devblog_theme", next);\n}\n\n// CSS does all the heavy lifting:\n// :root          { --bg: #f8fafc; --text: #0f172a; }\n// [data-theme=dark] { --bg: #0f172a; --text: #f1f5f9; }\n// body { background: var(--bg); color: var(--text); transition: background 0.2s; }',
    },
  ],
  challenges: [
    {
      id: 'c1',
      title: 'Add Pagination',
      difficulty: 'medium',
      description: 'Show only 6 posts per page with Previous and Next buttons. Reset to page 1 when the category or search changes.',
      hint: 'Add a currentPage variable. In renderList(), slice the filtered array: filtered.slice((currentPage-1)*6, currentPage*6). Render page buttons below the grid. Reset currentPage to 1 whenever filters change.',
      solutionJs: 'var currentPage = 1;\nvar PER_PAGE = 6;\n\nfunction renderList() {\n  var all = getFiltered();\n  var totalPages = Math.ceil(all.length / PER_PAGE);\n  var page = all.slice((currentPage-1)*PER_PAGE, currentPage*PER_PAGE);\n  // render page items...\n  renderPagination(currentPage, totalPages);\n}',
    },
    {
      id: 'c2',
      title: 'Add Bookmarks',
      difficulty: 'medium',
      description: 'Add a bookmark button on each card. Bookmarked posts should be filterable via a Bookmarks tab.',
      hint: 'Store bookmarked IDs in localStorage as a JSON array. Add a Bookmarks tab that filters posts where bookmarks.includes(post.id). Toggle by adding/removing from the array.',
      solutionJs: 'var bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");\n\nfunction toggleBookmark(id) {\n  var idx = bookmarks.indexOf(id);\n  if (idx === -1) bookmarks.push(id);\n  else bookmarks.splice(idx, 1);\n  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));\n  renderList();\n}',
    },
    {
      id: 'c3',
      title: 'Reading Progress Bar',
      difficulty: 'easy',
      description: 'Show a thin bar at the top of the article view that fills as you scroll down through the post.',
      hint: 'Add a fixed div (height 3px, background var(--accent)) at top. On scroll: progress = (scrollY / (body.scrollHeight - innerHeight)) * 100. Set div width to progress + "%". Remove the listener when going back.',
      solutionJs: 'function addProgressBar() {\n  var bar = document.createElement("div");\n  bar.id = "progress-bar";\n  bar.style.cssText = "position:fixed;top:0;left:0;height:3px;background:var(--accent);z-index:999;transition:width 0.1s;";\n  document.body.appendChild(bar);\n\n  function update() {\n    var pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;\n    bar.style.width = pct + "%";\n  }\n  window.addEventListener("scroll", update);\n}',
    },
  ],
};
