import type { Project } from './types';

const indexHtml = `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DevBlog - Web Development Articles</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <!-- HEADER -->
  <header class="site-header">
    <div class="header-inner">
      <div class="header-left">
        <div class="logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="9" fill="#6366f1"/>
            <path d="M8 11h16M8 16h10M8 21h13" stroke="white" stroke-width="2.2" stroke-linecap="round"/>
          </svg>
          <span class="logo-text">DevBlog</span>
        </div>
      </div>
      <div class="header-center">
        <div class="search-wrap">
          <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" id="searchInput" class="search-input" placeholder="Search articles..." autocomplete="off" />
          <button class="search-clear" id="searchClear" style="display:none;" title="Clear search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="header-right">
        <button class="btn-new-post" id="btnNewPost">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Post
        </button>
        <button class="theme-btn" id="themeToggle" title="Toggle dark mode">
          <svg class="icon-sun" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <svg class="icon-moon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>
      </div>
    </div>
  </header>

  <!-- MAIN APP -->
  <main class="main-content" id="app">

    <!-- ===== LIST VIEW ===== -->
    <div id="listView">

      <!-- Hero Banner -->
      <div class="hero-banner">
        <div class="hero-inner">
          <p class="hero-eyebrow">Web Development</p>
          <h1 class="hero-title">Articles for modern developers</h1>
          <p class="hero-sub">Deep dives into JavaScript, CSS, React, and the tools that power the web.</p>
          <div class="hero-stats" id="heroStats">
            <span class="hero-stat"><strong id="statPostCount">6</strong> articles</span>
            <span class="hero-dot"></span>
            <span class="hero-stat"><strong id="statViewCount">0</strong> total reads</span>
          </div>
        </div>
      </div>

      <!-- Controls: categories + sort -->
      <div class="controls-row">
        <div class="category-tabs" id="categoryTabs">
          <button class="cat-tab active" data-cat="all">All</button>
          <button class="cat-tab" data-cat="JavaScript">JavaScript</button>
          <button class="cat-tab" data-cat="CSS">CSS</button>
          <button class="cat-tab" data-cat="React">React</button>
          <button class="cat-tab" data-cat="Tools">Tools</button>
        </div>
        <div class="controls-right">
          <label class="sort-label" for="sortBy">Sort:</label>
          <select id="sortBy" class="sort-select">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="most-read">Most Read</option>
          </select>
        </div>
      </div>

      <!-- Results count -->
      <div class="results-bar" id="resultsBar" style="display:none;">
        <span id="resultsText"></span>
        <button class="clear-filters-btn" id="clearFiltersBtn">Clear filters</button>
      </div>

      <!-- Post Grid -->
      <div class="post-grid" id="postGrid"></div>

      <!-- Empty State -->
      <div class="empty-state" id="emptyState" style="display:none;">
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
          <circle cx="28" cy="28" r="26" stroke="var(--border)" stroke-width="2"/>
          <path d="M19 28h18M19 21h12M19 35h14" stroke="var(--border)" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
        <p class="empty-title" id="emptyTitle">No articles found</p>
        <p class="empty-sub" id="emptySub">Try a different search or category.</p>
      </div>

    </div><!-- end #listView -->

    <!-- ===== SINGLE POST VIEW ===== -->
    <div id="postView" style="display:none;">
      <div class="post-view-inner">
        <button class="back-btn" id="backBtn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to articles
        </button>
        <div class="post-full" id="postFull"></div>
      </div>
    </div>

    <!-- ===== NEW POST FORM ===== -->
    <div id="newPostView" style="display:none;">
      <div class="form-view-inner">
        <div class="form-header">
          <h2 class="form-title">Write a new article</h2>
          <button class="btn-cancel" id="btnCancelPost">Cancel</button>
        </div>
        <div class="form-card">
          <div class="form-group">
            <label class="form-label" for="newTitle">Title <span class="req">*</span></label>
            <input type="text" id="newTitle" class="form-input" placeholder="e.g. Understanding JavaScript Closures" maxlength="120" autocomplete="off" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="newCategory">Category <span class="req">*</span></label>
              <select id="newCategory" class="form-select">
                <option value="">-- Select --</option>
                <option value="JavaScript">JavaScript</option>
                <option value="CSS">CSS</option>
                <option value="React">React</option>
                <option value="Tools">Tools</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="newAuthor">Author</label>
              <input type="text" id="newAuthor" class="form-input" placeholder="Your name" maxlength="60" autocomplete="off" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" for="newExcerpt">Excerpt <span class="req">*</span></label>
            <textarea id="newExcerpt" class="form-textarea" rows="2" placeholder="A one or two sentence summary of your article..." maxlength="300"></textarea>
          </div>
          <div class="form-group">
            <label class="form-label" for="newContent">Content <span class="req">*</span></label>
            <textarea id="newContent" class="form-textarea content-area" rows="14" placeholder="Write your article here. You can use plain text or basic HTML like &lt;h2&gt;, &lt;p&gt;, &lt;pre&gt;, &lt;code&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;em&gt;..."></textarea>
          </div>
          <div class="form-footer">
            <p class="form-hint">Read time is calculated automatically (words / 200)</p>
            <button class="btn-publish" id="btnPublish">Publish Article</button>
          </div>
        </div>
      </div>
    </div>

  </main>

  <!-- DELETE CONFIRM MODAL -->
  <div class="modal-overlay" id="deleteModal" style="display:none;">
    <div class="modal-box">
      <div class="modal-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14H6L5 6"/>
          <path d="M10 11v6M14 11v6"/>
          <path d="M9 6V4h6v2"/>
        </svg>
      </div>
      <h3 class="modal-title">Delete article?</h3>
      <p class="modal-desc" id="modalDesc">This action cannot be undone.</p>
      <div class="modal-actions">
        <button class="btn-modal-cancel" id="modalCancelBtn">Cancel</button>
        <button class="btn-modal-delete" id="modalDeleteBtn">Delete</button>
      </div>
    </div>
  </div>

  <!-- TOAST NOTIFICATION -->
  <div class="toast" id="toast"></div>

  <script src="script.js"></script>
</body>
</html>`;

const styleCss = `/* =====================================================
   DevBlog - Full Blog Platform Styles
   ===================================================== */

/* ===== CSS VARIABLES ===== */
:root {
  --bg: #f8fafc;
  --surface: #ffffff;
  --surface2: #f1f5f9;
  --border: #e2e8f0;
  --border-soft: #f1f5f9;
  --text: #0f172a;
  --text-muted: #64748b;
  --text-soft: #94a3b8;
  --accent: #6366f1;
  --accent-hover: #4f46e5;
  --accent-light: #eef2ff;
  --danger: #ef4444;
  --danger-light: #fef2f2;
  --success: #10b981;
  --success-light: #ecfdf5;
  --warning: #f59e0b;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow: 0 4px 12px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.04);
  --shadow-lg: 0 10px 40px rgba(0,0,0,0.1);
  --radius: 12px;
  --radius-sm: 7px;
  --radius-lg: 16px;
  --font: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  --transition: 0.18s ease;
  --max-w: 1100px;
}

[data-theme="dark"] {
  --bg: #0f172a;
  --surface: #1e293b;
  --surface2: #293548;
  --border: #334155;
  --border-soft: #1e293b;
  --text: #f1f5f9;
  --text-muted: #94a3b8;
  --text-soft: #475569;
  --accent-light: #1e1b4b;
  --danger-light: #2d1515;
  --success-light: #0d2418;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.3);
  --shadow: 0 4px 12px rgba(0,0,0,0.3);
  --shadow-lg: 0 10px 40px rgba(0,0,0,0.4);
}

/* ===== RESET ===== */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  min-height: 100vh;
  font-size: 15px;
  transition: background var(--transition), color var(--transition);
}
button { font-family: var(--font); cursor: pointer; }
input, select, textarea { font-family: var(--font); }
a { color: var(--accent); text-decoration: none; }

/* ===== SITE HEADER ===== */
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
}
.header-inner {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: 0 20px;
  height: 58px;
  display: flex;
  align-items: center;
  gap: 16px;
}
.header-left { flex-shrink: 0; }
.header-center { flex: 1; max-width: 380px; }
.header-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; margin-left: auto; }

/* Logo */
.logo { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.logo-text {
  font-size: 1.15rem; font-weight: 800; color: var(--text);
  letter-spacing: -0.3px;
}

/* Search */
.search-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.search-icon {
  position: absolute;
  left: 10px;
  color: var(--text-soft);
  pointer-events: none;
}
.search-input {
  width: 100%;
  padding: 7px 32px 7px 34px;
  border: 1.5px solid var(--border);
  border-radius: 99px;
  font-size: 13px;
  background: var(--surface2);
  color: var(--text);
  outline: none;
  transition: all var(--transition);
}
.search-input:focus {
  border-color: var(--accent);
  background: var(--surface);
  box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
}
.search-input::placeholder { color: var(--text-soft); }
.search-clear {
  position: absolute; right: 10px;
  background: none; border: none;
  color: var(--text-soft); padding: 2px;
  display: flex; align-items: center;
  transition: color var(--transition);
}
.search-clear:hover { color: var(--text); }

/* Buttons */
.btn-new-post {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 14px;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 13px; font-weight: 700;
  transition: background var(--transition), transform var(--transition);
  white-space: nowrap;
}
.btn-new-post:hover { background: var(--accent-hover); }
.btn-new-post:active { transform: scale(0.97); }

.theme-btn {
  width: 34px; height: 34px;
  border: 1.5px solid var(--border);
  border-radius: 50%;
  background: var(--surface);
  color: var(--text-muted);
  display: flex; align-items: center; justify-content: center;
  transition: all var(--transition);
}
.theme-btn:hover { background: var(--surface2); color: var(--text); }
[data-theme="light"] .icon-moon { display: none; }
[data-theme="dark"]  .icon-sun  { display: none; }

/* ===== MAIN ===== */
.main-content {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: 0 20px 60px;
}

/* ===== HERO BANNER ===== */
.hero-banner {
  background: linear-gradient(135deg, var(--accent) 0%, #8b5cf6 100%);
  border-radius: var(--radius-lg);
  margin: 24px 0 28px;
  overflow: hidden;
  position: relative;
}
.hero-banner::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
.hero-inner {
  position: relative;
  padding: 36px 40px;
  color: white;
}
.hero-eyebrow {
  font-size: 12px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 1.5px; opacity: 0.85; margin-bottom: 8px;
}
.hero-title {
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 800; letter-spacing: -0.5px;
  line-height: 1.25; margin-bottom: 10px;
}
.hero-sub {
  font-size: 14px; opacity: 0.85; max-width: 480px; line-height: 1.6;
  margin-bottom: 16px;
}
.hero-stats { display: flex; align-items: center; gap: 10px; font-size: 13px; opacity: 0.9; }
.hero-dot {
  width: 3px; height: 3px; border-radius: 50%;
  background: rgba(255,255,255,0.6);
}
.hero-stat strong { font-weight: 800; }

/* ===== CONTROLS ROW ===== */
.controls-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.category-tabs {
  display: flex; gap: 4px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 4px;
}
.cat-tab {
  padding: 5px 14px;
  border: none; border-radius: 5px;
  font-size: 13px; font-weight: 600;
  background: transparent; color: var(--text-muted);
  transition: all var(--transition);
}
.cat-tab:hover:not(.active) { color: var(--text); background: var(--surface2); }
.cat-tab.active {
  background: var(--accent); color: white;
  box-shadow: 0 1px 4px rgba(99,102,241,0.35);
}
.controls-right { display: flex; align-items: center; gap: 8px; }
.sort-label { font-size: 13px; color: var(--text-muted); font-weight: 600; }
.sort-select {
  padding: 6px 10px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 13px;
  background: var(--surface);
  color: var(--text);
  outline: none;
  cursor: pointer;
  transition: border-color var(--transition);
}
.sort-select:focus { border-color: var(--accent); }

/* Results bar */
.results-bar {
  display: flex; align-items: center; gap: 12px;
  font-size: 13px; color: var(--text-muted);
  margin-bottom: 14px;
}
.clear-filters-btn {
  background: none; border: 1px solid var(--border);
  border-radius: 99px; padding: 2px 10px;
  font-size: 12px; font-weight: 600; color: var(--text-muted);
  transition: all var(--transition);
}
.clear-filters-btn:hover { color: var(--accent); border-color: var(--accent); }

/* ===== POST GRID ===== */
.post-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

/* ===== POST CARD ===== */
.post-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition);
  animation: fadeUp 0.28s ease both;
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
}
.post-card:hover {
  box-shadow: var(--shadow);
  transform: translateY(-3px);
  border-color: var(--accent);
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.card-category-bar {
  height: 3px;
  flex-shrink: 0;
}
.card-body { padding: 18px 18px 14px; flex: 1; display: flex; flex-direction: column; }
.card-meta-top {
  display: flex; align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.card-category {
  font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.7px;
  padding: 3px 8px; border-radius: 99px;
}
.card-read-time {
  font-size: 11px; color: var(--text-soft); font-weight: 500;
}
.card-title {
  font-size: 1rem; font-weight: 800;
  color: var(--text); line-height: 1.35;
  margin-bottom: 8px; letter-spacing: -0.2px;
  transition: color var(--transition);
}
.post-card:hover .card-title { color: var(--accent); }
.card-excerpt {
  font-size: 13px; color: var(--text-muted);
  line-height: 1.6; flex: 1; margin-bottom: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-footer {
  display: flex; align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid var(--border-soft);
}
.card-author-wrap { display: flex; align-items: center; gap: 8px; }
.card-avatar {
  width: 26px; height: 26px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 800; color: white;
  flex-shrink: 0;
}
.card-author-info {}
.card-author-name { font-size: 12px; font-weight: 700; color: var(--text); }
.card-date { font-size: 11px; color: var(--text-soft); }
.card-actions {
  display: flex; align-items: center; gap: 6px;
  opacity: 0;
  transition: opacity var(--transition);
}
.post-card:hover .card-actions { opacity: 1; }
.card-views {
  font-size: 11px; color: var(--text-soft);
  display: flex; align-items: center; gap: 3px;
}
.btn-delete-card {
  width: 26px; height: 26px;
  background: none; border: 1px solid transparent;
  border-radius: 5px; color: var(--text-soft);
  display: flex; align-items: center; justify-content: center;
  transition: all var(--transition);
}
.btn-delete-card:hover {
  background: var(--danger-light);
  border-color: #fecaca;
  color: var(--danger);
}

/* Category color palette */
.cat-js   { background: #fef9c3; color: #854d0e; }
.cat-css  { background: #ede9fe; color: #5b21b6; }
.cat-react{ background: #e0f2fe; color: #0369a1; }
.cat-tools{ background: #ecfdf5; color: #065f46; }
.cat-other{ background: #f1f5f9; color: #475569; }
.bar-js    { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
.bar-css   { background: linear-gradient(90deg, #8b5cf6, #a78bfa); }
.bar-react { background: linear-gradient(90deg, #0ea5e9, #38bdf8); }
.bar-tools { background: linear-gradient(90deg, #10b981, #34d399); }
.bar-other { background: linear-gradient(90deg, #94a3b8, #cbd5e1); }
.avatar-js    { background: linear-gradient(135deg, #f59e0b, #ef4444); }
.avatar-css   { background: linear-gradient(135deg, #8b5cf6, #ec4899); }
.avatar-react { background: linear-gradient(135deg, #0ea5e9, #6366f1); }
.avatar-tools { background: linear-gradient(135deg, #10b981, #0ea5e9); }
.avatar-other { background: linear-gradient(135deg, #64748b, #94a3b8); }

/* ===== EMPTY STATE ===== */
.empty-state {
  text-align: center;
  padding: 70px 20px;
  color: var(--text-soft);
}
.empty-title { font-size: 1.1rem; font-weight: 700; margin: 16px 0 6px; color: var(--text-muted); }
.empty-sub { font-size: 13px; }

/* ===== SINGLE POST VIEW ===== */
.post-view-inner {
  max-width: 720px;
  margin: 0 auto;
  padding-top: 28px;
}
.back-btn {
  display: inline-flex; align-items: center; gap: 7px;
  background: none; border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-muted); font-size: 13px; font-weight: 600;
  padding: 7px 14px; margin-bottom: 24px;
  transition: all var(--transition);
}
.back-btn:hover {
  background: var(--surface2);
  color: var(--accent);
  border-color: var(--accent);
}
.post-full {}
.post-full-header { margin-bottom: 28px; }
.post-full-cat { margin-bottom: 12px; }
.post-full-title {
  font-size: clamp(1.5rem, 4vw, 2.1rem);
  font-weight: 900; letter-spacing: -0.5px;
  line-height: 1.2; color: var(--text);
  margin-bottom: 14px;
}
.post-full-byline {
  display: flex; align-items: center; gap: 12px;
  flex-wrap: wrap;
}
.post-full-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 800; color: white; flex-shrink: 0;
}
.post-full-author { font-size: 14px; font-weight: 700; color: var(--text); }
.post-full-date { font-size: 13px; color: var(--text-soft); }
.post-full-sep { color: var(--border); }
.post-full-stats { font-size: 13px; color: var(--text-soft); }
.post-divider {
  height: 1px; background: var(--border);
  margin: 24px 0;
}
.post-full-body {
  font-size: 16px; line-height: 1.8; color: var(--text);
}
.post-full-body h2 {
  font-size: 1.4rem; font-weight: 800;
  color: var(--text); margin: 32px 0 12px;
  letter-spacing: -0.3px;
}
.post-full-body h3 {
  font-size: 1.15rem; font-weight: 700;
  color: var(--text); margin: 24px 0 8px;
}
.post-full-body p { margin-bottom: 16px; }
.post-full-body ul, .post-full-body ol {
  margin: 0 0 16px 20px;
}
.post-full-body li { margin-bottom: 6px; }
.post-full-body strong { font-weight: 700; color: var(--text); }
.post-full-body em { font-style: italic; }
.post-full-body code {
  background: var(--surface2);
  color: #e83e8c;
  font-family: var(--font-mono);
  font-size: 0.87em;
  padding: 1px 5px;
  border-radius: 4px;
  border: 1px solid var(--border);
}
.post-full-body pre {
  background: #1e293b;
  border-radius: var(--radius);
  padding: 18px 20px;
  margin: 20px 0;
  overflow-x: auto;
  border: 1px solid #334155;
}
.post-full-body pre code {
  background: none; border: none;
  color: #e2e8f0; font-size: 14px; padding: 0;
  line-height: 1.65;
}
.post-full-body blockquote {
  border-left: 4px solid var(--accent);
  background: var(--accent-light);
  padding: 14px 18px;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  margin: 20px 0;
  font-style: italic;
  color: var(--text-muted);
}

/* ===== NEW POST FORM ===== */
.form-view-inner {
  max-width: 680px;
  margin: 0 auto;
  padding-top: 28px;
}
.form-header {
  display: flex; align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.form-title { font-size: 1.3rem; font-weight: 800; color: var(--text); }
.btn-cancel {
  background: none; border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-muted); font-size: 13px; font-weight: 600;
  padding: 6px 14px;
  transition: all var(--transition);
}
.btn-cancel:hover { background: var(--surface2); color: var(--text); }
.form-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-sm);
}
.form-group { margin-bottom: 18px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 0; }
.form-row .form-group { margin-bottom: 18px; }
.form-label {
  display: block; font-size: 13px; font-weight: 700;
  color: var(--text); margin-bottom: 6px;
}
.req { color: var(--accent); }
.form-input {
  width: 100%; padding: 9px 12px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 14px; background: var(--surface2);
  color: var(--text); outline: none;
  transition: all var(--transition);
}
.form-input:focus {
  border-color: var(--accent);
  background: var(--surface);
  box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
}
.form-input::placeholder { color: var(--text-soft); }
.form-select {
  width: 100%; padding: 9px 12px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 14px; background: var(--surface2);
  color: var(--text); outline: none; cursor: pointer;
  transition: border-color var(--transition);
}
.form-select:focus { border-color: var(--accent); }
.form-textarea {
  width: 100%; padding: 9px 12px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 14px; background: var(--surface2);
  color: var(--text); outline: none; resize: vertical;
  transition: all var(--transition); line-height: 1.6;
}
.form-textarea:focus {
  border-color: var(--accent);
  background: var(--surface);
  box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
}
.form-textarea::placeholder { color: var(--text-soft); }
.content-area { font-family: var(--font-mono); font-size: 13px; min-height: 240px; }
.form-footer {
  display: flex; align-items: center;
  justify-content: space-between; flex-wrap: wrap; gap: 12px;
  padding-top: 6px;
}
.form-hint { font-size: 12px; color: var(--text-soft); }
.btn-publish {
  padding: 10px 24px;
  background: var(--accent); color: white;
  border: none; border-radius: var(--radius-sm);
  font-size: 14px; font-weight: 800;
  transition: all var(--transition);
}
.btn-publish:hover { background: var(--accent-hover); }
.btn-publish:active { transform: scale(0.97); }
.field-error { border-color: var(--danger) !important; }

/* ===== MODAL ===== */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 500; animation: fadeIn 0.15s ease;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.modal-box {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px 28px 22px;
  max-width: 340px; width: 90%;
  box-shadow: var(--shadow-lg);
  text-align: center;
  animation: scaleIn 0.18s ease;
}
@keyframes scaleIn { from { transform: scale(0.93); } to { transform: scale(1); } }
.modal-icon { margin-bottom: 12px; }
.modal-title { font-size: 1.05rem; font-weight: 800; color: var(--text); margin-bottom: 6px; }
.modal-desc { font-size: 13px; color: var(--text-muted); margin-bottom: 20px; }
.modal-actions { display: flex; gap: 10px; justify-content: center; }
.btn-modal-cancel {
  padding: 9px 22px;
  border: 1.5px solid var(--border); border-radius: var(--radius-sm);
  background: transparent; color: var(--text-muted);
  font-size: 13px; font-weight: 700;
  transition: all var(--transition);
}
.btn-modal-cancel:hover { background: var(--surface2); color: var(--text); }
.btn-modal-delete {
  padding: 9px 22px;
  background: var(--danger); color: white;
  border: none; border-radius: var(--radius-sm);
  font-size: 13px; font-weight: 800;
  transition: background var(--transition);
}
.btn-modal-delete:hover { background: #dc2626; }

/* ===== TOAST ===== */
.toast {
  position: fixed;
  bottom: 24px; left: 50%;
  transform: translateX(-50%) translateY(80px);
  background: #1e293b; color: #f1f5f9;
  padding: 11px 20px;
  border-radius: var(--radius-sm);
  font-size: 13px; font-weight: 600;
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  transition: transform 0.3s ease, opacity 0.3s ease;
  opacity: 0;
  pointer-events: none;
  white-space: nowrap;
}
.toast.show {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 700px) {
  .hero-inner { padding: 24px 20px; }
  .controls-row { flex-direction: column; align-items: flex-start; }
  .category-tabs { width: 100%; overflow-x: auto; }
  .post-grid { grid-template-columns: 1fr; }
  .header-center { display: none; }
  .form-row { grid-template-columns: 1fr; }
  .modal-box { padding: 22px 18px 18px; }
  .main-content { padding: 0 12px 40px; }
}

@media (max-width: 480px) {
  .btn-new-post span { display: none; }
  .hero-title { font-size: 1.25rem; }
  .post-full-title { font-size: 1.4rem; }
}`;

const scriptJs = `// ============================================================
// DevBlog - Full Blog Platform
// Features: post cards, single view, categories, search,
// new post form, delete, dark mode, view counts, sort
// ============================================================

// ============================================================
// DATA - 6 Pre-loaded Blog Posts
// ============================================================
var defaultPosts = [
  {
    id: 1001,
    title: 'Understanding JavaScript Closures',
    category: 'JavaScript',
    author: 'Alex Morgan',
    date: '2024-01-15',
    excerpt: 'Closures are one of the most powerful and often misunderstood features of JavaScript. Master them and you unlock the true potential of the language.',
    content: '<h2>What is a Closure?</h2><p>A closure is a function that "remembers" the variables from the scope in which it was created, even after that scope has finished executing. In other words, a closure gives you access to an outer function\'s scope from an inner function.</p><h2>A Simple Example</h2><pre><code>function makeCounter() {\n  let count = 0;  // this variable is "closed over"\n\n  return function() {\n    count++;\n    return count;\n  };\n}\n\nconst counter = makeCounter();\nconsole.log(counter()); // 1\nconsole.log(counter()); // 2\nconsole.log(counter()); // 3</code></pre><p>Even though <code>makeCounter()</code> has finished running, the inner function still has access to <code>count</code>. That\'s a closure in action.</p><h2>Why Do Closures Matter?</h2><ul><li><strong>Data privacy</strong> - closures can emulate private variables</li><li><strong>Factory functions</strong> - create customized functions</li><li><strong>Event handlers</strong> - maintain state across events</li><li><strong>Module pattern</strong> - the foundation of JavaScript modules</li></ul><h2>Practical Use: Data Privacy</h2><pre><code>function createBankAccount(initialBalance) {\n  let balance = initialBalance; // private variable\n\n  return {\n    deposit(amount) { balance += amount; },\n    withdraw(amount) {\n      if (amount > balance) throw new Error("Insufficient funds");\n      balance -= amount;\n    },\n    getBalance() { return balance; }\n  };\n}\n\nconst account = createBankAccount(100);\naccount.deposit(50);\nconsole.log(account.getBalance()); // 150\nconsole.log(account.balance); // undefined - truly private!</code></pre><h2>The Classic Loop Pitfall</h2><p>Closures in loops can cause surprises:</p><pre><code>// Bug: all buttons log "3"\nfor (var i = 0; i < 3; i++) {\n  btn[i].onclick = function() { console.log(i); };\n}\n\n// Fix 1: use let (block scope)\nfor (let i = 0; i < 3; i++) {\n  btn[i].onclick = function() { console.log(i); };\n}\n\n// Fix 2: use an IIFE\nfor (var i = 0; i < 3; i++) {\n  (function(j) {\n    btn[j].onclick = function() { console.log(j); };\n  })(i);\n}</code></pre><blockquote>Closures are not a pattern you use occasionally - they are baked into the language. Every time you write a callback, an event handler, or a React hook, you are using closures.</blockquote>',
    views: 0,
    createdAt: 1705276800000
  },
  {
    id: 1002,
    title: 'CSS Grid vs Flexbox: When to Use Each',
    category: 'CSS',
    author: 'Sarah Chen',
    date: '2024-01-22',
    excerpt: 'Both CSS Grid and Flexbox are powerful layout tools, but they shine in different scenarios. Here is a practical guide to choosing the right one.',
    content: '<h2>The Key Distinction</h2><p>The fundamental difference is one-dimensional vs two-dimensional layout:</p><ul><li><strong>Flexbox</strong> is designed for one-dimensional layouts - either a row OR a column</li><li><strong>CSS Grid</strong> is designed for two-dimensional layouts - rows AND columns simultaneously</li></ul><h2>When to Use Flexbox</h2><p>Flexbox excels when you need to distribute items along a single axis and let them naturally flow:</p><pre><code>/* Navigation bar - items in a row */\n.navbar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 16px;\n}\n\n/* Center something both ways */\n.hero {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 100vh;\n}\n\n/* Card footer that pushes content apart */\n.card-footer {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}</code></pre><h2>When to Use CSS Grid</h2><p>Grid is the right choice for page-level layout and any time you need control over both dimensions:</p><pre><code>/* Classic Holy Grail layout */\n.page {\n  display: grid;\n  grid-template-areas:\n    "header header"\n    "sidebar main"\n    "footer footer";\n  grid-template-columns: 240px 1fr;\n  grid-template-rows: auto 1fr auto;\n  min-height: 100vh;\n}\n\n/* Responsive card grid - no media queries needed! */\n.card-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));\n  gap: 20px;\n}</code></pre><h2>The Best Practice: Use Both Together</h2><p>Grid for the macro layout, Flexbox for the components inside it:</p><pre><code>/* Grid handles the page structure */\n.app { display: grid; grid-template-rows: 60px 1fr 40px; }\n\n/* Flexbox handles the header internals */\n.header { display: flex; align-items: center; justify-content: space-between; }\n\n/* Grid handles the main content area */\n.main { display: grid; grid-template-columns: 220px 1fr; }\n\n/* Flexbox handles a card\'s internals */\n.card { display: flex; flex-direction: column; }</code></pre><blockquote>Rule of thumb: if you are thinking about the layout from the container\'s perspective and need to control both axes, use Grid. If you are thinking about arranging a row of items, use Flexbox.</blockquote>',
    views: 0,
    createdAt: 1705881600000
  },
  {
    id: 1003,
    title: 'React Hooks Explained: useState and useEffect',
    category: 'React',
    author: 'Marcus Williams',
    date: '2024-02-01',
    excerpt: 'React Hooks changed everything about how we write components. This deep dive covers useState and useEffect with real-world patterns you will use daily.',
    content: '<h2>Why Hooks?</h2><p>Before Hooks (React 16.8), only class components could have state and lifecycle methods. Hooks let function components do everything class components could, with simpler and more reusable code.</p><h2>useState - Managing State</h2><p><code>useState</code> returns a pair: the current state value and a setter function. Every call to the setter triggers a re-render.</p><pre><code>import { useState } from "react";\n\nfunction Counter() {\n  const [count, setCount] = useState(0); // initial value = 0\n\n  return (\n    &lt;div&gt;\n      &lt;p&gt;Count: {count}&lt;/p&gt;\n      &lt;button onClick={() => setCount(count + 1)}&gt;+&lt;/button&gt;\n      &lt;button onClick={() => setCount(c => c - 1)}&gt;-&lt;/button&gt;\n    &lt;/div&gt;\n  );\n}</code></pre><p>Notice the second button uses a <strong>functional update</strong> (<code>c =&gt; c - 1</code>). Always use this pattern when the new state depends on the previous state — it prevents stale closure bugs.</p><h2>useState with Objects</h2><pre><code>const [user, setUser] = useState({ name: "", email: "" });\n\n// WRONG - this replaces the whole object\nsetUser({ name: "Alice" }); // email is now undefined!\n\n// RIGHT - spread to preserve other fields\nsetUser(prev => ({ ...prev, name: "Alice" }));</code></pre><h2>useEffect - Side Effects</h2><p><code>useEffect</code> runs after every render by default. Use the dependency array to control when it runs:</p><pre><code>import { useState, useEffect } from "react";\n\nfunction UserProfile({ userId }) {\n  const [user, setUser] = useState(null);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    // Runs when userId changes\n    setLoading(true);\n    fetch("/api/users/" + userId)\n      .then(r => r.json())\n      .then(data => {\n        setUser(data);\n        setLoading(false);\n      });\n\n    // Cleanup function - runs before next effect or unmount\n    return () => {\n      // Cancel requests, clear timers, etc.\n    };\n  }, [userId]); // dependency array - only re-run when userId changes\n\n  if (loading) return &lt;p&gt;Loading...&lt;/p&gt;;\n  return &lt;h1&gt;{user.name}&lt;/h1&gt;;\n}</code></pre><h2>The Dependency Array Rules</h2><ul><li><code>useEffect(fn)</code> - runs after every render</li><li><code>useEffect(fn, [])</code> - runs once on mount (like componentDidMount)</li><li><code>useEffect(fn, [a, b])</code> - runs when a or b changes</li></ul><blockquote>The most common mistake with useEffect is leaving out dependencies. The ESLint rule eslint-plugin-react-hooks will catch these bugs automatically - always enable it.</blockquote>',
    views: 0,
    createdAt: 1706745600000
  },
  {
    id: 1004,
    title: 'The Power of Array Methods: map, filter, reduce',
    category: 'JavaScript',
    author: 'Alex Morgan',
    date: '2024-02-10',
    excerpt: 'Array methods like map, filter, and reduce are the workhorses of modern JavaScript. Learn to chain them together to write expressive, readable code.',
    content: '<h2>Why Array Methods?</h2><p>Before ES5, manipulating arrays meant for loops with index tracking. Modern array methods are declarative - you describe what you want, not how to get it. This leads to cleaner, more readable code that is easier to test.</p><h2>map - Transform Every Item</h2><p><code>map</code> creates a new array by running a function on each element. The original is never modified.</p><pre><code>const prices = [10, 20, 30, 40];\n\n// Add 10% tax to each price\nconst withTax = prices.map(price => price * 1.1);\n// [11, 22, 33, 44]\n\n// Transform objects\nconst users = [\n  { id: 1, firstName: "Alice", lastName: "Smith" },\n  { id: 2, firstName: "Bob",   lastName: "Jones" }\n];\n\nconst fullNames = users.map(u => ({\n  id: u.id,\n  name: u.firstName + " " + u.lastName\n}));\n// [{ id: 1, name: "Alice Smith" }, ...]</code></pre><h2>filter - Keep Matching Items</h2><p><code>filter</code> returns a new array containing only elements where the callback returns true.</p><pre><code>const products = [\n  { name: "Laptop", price: 999, inStock: true },\n  { name: "Mouse",  price: 29,  inStock: false },\n  { name: "Keyboard", price: 79, inStock: true }\n];\n\n// Available and affordable\nconst affordable = products\n  .filter(p => p.inStock)\n  .filter(p => p.price < 100);\n// [{ name: "Keyboard", price: 79, inStock: true }]</code></pre><h2>reduce - Combine Into a Single Value</h2><p><code>reduce</code> is the most powerful and flexible. It reduces an array to any single value - a number, string, object, or even another array.</p><pre><code>const orders = [\n  { product: "Book",  qty: 2, price: 15 },\n  { product: "Pen",   qty: 10, price: 2 },\n  { product: "Desk",  qty: 1, price: 250 }\n];\n\n// Total revenue\nconst total = orders.reduce((sum, order) => {\n  return sum + (order.qty * order.price);\n}, 0); // 0 is the initial value\n// 300\n\n// Group by first letter\nconst byLetter = ["apple","avocado","banana","blueberry","cherry"]\n  .reduce((acc, fruit) => {\n    const letter = fruit[0];\n    if (!acc[letter]) acc[letter] = [];\n    acc[letter].push(fruit);\n    return acc;\n  }, {});\n// { a: ["apple","avocado"], b: ["banana","blueberry"], c: ["cherry"] }</code></pre><h2>Chaining Methods</h2><pre><code>const report = orders\n  .filter(o => o.qty * o.price > 20)  // only significant orders\n  .map(o => ({ ...o, total: o.qty * o.price }))  // add total field\n  .sort((a, b) => b.total - a.total)  // sort descending\n  .map(o => o.product + ": $" + o.total);  // format as strings\n\nconsole.log(report);\n// ["Desk: $250", "Book: $30"]</code></pre>',
    views: 0,
    createdAt: 1707523200000
  },
  {
    id: 1005,
    title: 'CSS Custom Properties: Variables Done Right',
    category: 'CSS',
    author: 'Sarah Chen',
    date: '2024-02-18',
    excerpt: 'CSS Custom Properties (variables) go far beyond just storing colors. They enable dynamic theming, component APIs, and design systems you never thought possible in plain CSS.',
    content: '<h2>The Basics</h2><p>CSS Custom Properties are set with a double-dash prefix and accessed with <code>var()</code>. Unlike preprocessor variables (Sass/Less), they are live in the browser and can be changed at runtime with JavaScript.</p><pre><code>:root {\n  --color-primary: #6366f1;\n  --color-text: #0f172a;\n  --spacing-base: 8px;\n  --radius: 10px;\n  --font-size-base: 16px;\n}\n\n.button {\n  background: var(--color-primary);\n  border-radius: var(--radius);\n  padding: calc(var(--spacing-base) * 1.5) calc(var(--spacing-base) * 3);\n  font-size: var(--font-size-base);\n}</code></pre><h2>Dark Mode with Custom Properties</h2><p>Swapping an entire theme is as simple as overriding a handful of variables:</p><pre><code>:root {\n  --bg: #f8fafc;\n  --surface: #ffffff;\n  --text: #0f172a;\n  --border: #e2e8f0;\n}\n\n[data-theme="dark"] {\n  --bg: #0f172a;\n  --surface: #1e293b;\n  --text: #f1f5f9;\n  --border: #334155;\n}\n\n/* Every element using these variables updates automatically */\nbody {\n  background: var(--bg);\n  color: var(--text);\n  transition: background 0.2s, color 0.2s;\n}</code></pre><h2>Component APIs with Custom Properties</h2><p>Custom properties let you expose a clean "API" for a component that consumers can override:</p><pre><code>.card {\n  /* Defaults - consumers can override these */\n  --card-bg: var(--surface);\n  --card-radius: 12px;\n  --card-padding: 20px;\n  --card-shadow: 0 2px 8px rgba(0,0,0,0.08);\n\n  background: var(--card-bg);\n  border-radius: var(--card-radius);\n  padding: var(--card-padding);\n  box-shadow: var(--card-shadow);\n}\n\n/* Override for a specific context */\n.sidebar .card {\n  --card-bg: #1e293b;\n  --card-padding: 12px;\n}</code></pre><h2>JavaScript Integration</h2><pre><code>// Read a CSS variable\nconst root = document.documentElement;\nconst primary = getComputedStyle(root)\n  .getPropertyValue("--color-primary").trim();\n\n// Set a CSS variable from JavaScript\nroot.style.setProperty("--color-primary", "#10b981");\n\n// Dynamic theme switcher\nfunction setTheme(theme) {\n  root.setAttribute("data-theme", theme);\n  localStorage.setItem("theme", theme);\n}</code></pre><blockquote>Custom properties cascade and inherit like any other CSS property. You can scope them to a component, override them inside a media query, and even animate them with @property (in supported browsers).</blockquote>',
    views: 0,
    createdAt: 1708214400000
  },
  {
    id: 1006,
    title: 'Git Workflows Every Developer Should Know',
    category: 'Tools',
    author: 'Jordan Lee',
    date: '2024-02-25',
    excerpt: 'Git is more than commit and push. These workflows and commands separate junior developers from seniors. Master branching, rebasing, and the stash.',
    content: '<h2>The Feature Branch Workflow</h2><p>Never commit directly to main. Always work on a branch, keep it focused on one thing, then merge when done.</p><pre><code># Start a new feature\ngit checkout -b feature/user-authentication\n\n# ... make your changes ...\ngit add -p          # stage changes interactively\ngit commit -m "feat: add JWT token validation"\n\n# Keep your branch up to date with main\ngit fetch origin\ngit rebase origin/main\n\n# Push and open a pull request\ngit push -u origin feature/user-authentication</code></pre><h2>The Stash - Your Temporary Shelf</h2><p>Use <code>git stash</code> to save uncommitted work without making a commit:</p><pre><code># You are mid-feature when an urgent bug arrives\ngit stash push -m "WIP: user profile page"\n\n# Fix the bug on another branch\ngit checkout -b fix/login-timeout\n# ... fix and commit ...\ngit checkout feature/user-profile\n\n# Restore your work\ngit stash pop\n\n# List all stashes\ngit stash list</code></pre><h2>Interactive Rebase - Clean History</h2><p>Before merging, clean up your messy commits into a clear story:</p><pre><code># Rewrite the last 4 commits\ngit rebase -i HEAD~4\n\n# In the editor:\n# pick abc1234 feat: add user model\n# squash def5678 WIP: fixing typo\n# squash ghi9012 forgot to add file\n# reword jkl3456 feat: add validation\n\n# Result: two clean, meaningful commits</code></pre><h2>Useful Commands You Should Know</h2><pre><code># See what changed and who changed it\ngit log --oneline --graph --all\ngit blame filename.js\ngit diff main..feature/my-branch\n\n# Undo mistakes safely\ngit revert HEAD          # undo last commit (safe, creates new commit)\ngit reset --soft HEAD~1  # undo last commit, keep changes staged\ngit restore filename.js  # discard changes to a file\n\n# Find when a bug was introduced\ngit bisect start\ngit bisect bad           # current commit is buggy\ngit bisect good v1.0.0   # this tag was fine\n# Git binary-searches through history for you</code></pre><h2>Commit Message Convention</h2><p>Use Conventional Commits for clean, tool-friendly history:</p><pre><code>feat: add dark mode toggle\nfix: prevent duplicate form submissions\ndocs: update API authentication guide\nrefactor: extract validation into separate module\ntest: add unit tests for auth middleware\nchore: upgrade dependencies</code></pre><blockquote>The best commit message answers: "If applied, this commit will..." Use that as a mental template and your git log will tell the story of your project.</blockquote>',
    views: 0,
    createdAt: 1708819200000
  }
];

// ============================================================
// STATE
// ============================================================
var posts = [];
var currentCategory = 'all';
var currentSort = 'newest';
var searchQuery = '';
var pendingDeleteId = null;

// ============================================================
// INIT
// ============================================================
function init() {
  loadTheme();
  loadPosts();
  attachEventListeners();
  showView('list');
  renderList();
}

// ============================================================
// STORAGE
// ============================================================
function loadPosts() {
  var saved = localStorage.getItem('devblog_posts');
  if (saved) {
    posts = JSON.parse(saved);
  } else {
    posts = defaultPosts.map(function(p) { return Object.assign({}, p); });
    savePosts();
  }
}

function savePosts() {
  localStorage.setItem('devblog_posts', JSON.stringify(posts));
}

// ============================================================
// THEME
// ============================================================
function loadTheme() {
  var theme = localStorage.getItem('devblog_theme') || 'light';
  document.documentElement.setAttribute('data-theme', theme);
}

function toggleTheme() {
  var cur = document.documentElement.getAttribute('data-theme');
  var next = cur === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('devblog_theme', next);
}

// ============================================================
// VIEW MANAGEMENT
// ============================================================
function showView(name) {
  var views = ['listView', 'postView', 'newPostView'];
  views.forEach(function(id) {
    document.getElementById(id).style.display = 'none';
  });
  document.getElementById(name + 'View').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
// READ TIME CALCULATION
// ============================================================
function calcReadTime(text) {
  var stripped = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  var words = stripped.split(' ').filter(function(w) { return w.length > 0; }).length;
  var minutes = Math.max(1, Math.round(words / 200));
  return minutes + ' min read';
}

// ============================================================
// CATEGORY HELPERS
// ============================================================
function getCatClass(cat) {
  if (cat === 'JavaScript') return 'cat-js';
  if (cat === 'CSS')        return 'cat-css';
  if (cat === 'React')      return 'cat-react';
  if (cat === 'Tools')      return 'cat-tools';
  return 'cat-other';
}
function getBarClass(cat) {
  if (cat === 'JavaScript') return 'bar-js';
  if (cat === 'CSS')        return 'bar-css';
  if (cat === 'React')      return 'bar-react';
  if (cat === 'Tools')      return 'bar-tools';
  return 'bar-other';
}
function getAvatarClass(cat) {
  if (cat === 'JavaScript') return 'avatar-js';
  if (cat === 'CSS')        return 'avatar-css';
  if (cat === 'React')      return 'avatar-react';
  if (cat === 'Tools')      return 'avatar-tools';
  return 'avatar-other';
}
function getInitials(name) {
  var parts = name.trim().split(' ');
  if (parts.length >= 2) return parts[0][0] + parts[1][0];
  return name[0] || 'A';
}
function formatDate(dateStr) {
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var parts = dateStr.split('-');
  var year = parseInt(parts[0]);
  var month = parseInt(parts[1]) - 1;
  var day = parseInt(parts[2]);
  return months[month] + ' ' + day + ', ' + year;
}

// ============================================================
// FILTERING & SORTING
// ============================================================
function getFilteredPosts() {
  var filtered = posts.slice();

  if (currentCategory !== 'all') {
    filtered = filtered.filter(function(p) { return p.category === currentCategory; });
  }

  if (searchQuery) {
    var q = searchQuery.toLowerCase();
    filtered = filtered.filter(function(p) {
      return p.title.toLowerCase().indexOf(q) !== -1 ||
             p.excerpt.toLowerCase().indexOf(q) !== -1;
    });
  }

  if (currentSort === 'newest') {
    filtered.sort(function(a, b) { return b.createdAt - a.createdAt; });
  } else if (currentSort === 'oldest') {
    filtered.sort(function(a, b) { return a.createdAt - b.createdAt; });
  } else if (currentSort === 'most-read') {
    filtered.sort(function(a, b) { return (b.views || 0) - (a.views || 0); });
  }

  return filtered;
}

// ============================================================
// RENDER LIST VIEW
// ============================================================
function renderList() {
  var filtered = getFilteredPosts();
  var grid = document.getElementById('postGrid');
  var empty = document.getElementById('emptyState');
  var resultsBar = document.getElementById('resultsBar');
  var resultsText = document.getElementById('resultsText');

  // Hero stats
  var totalViews = posts.reduce(function(s, p) { return s + (p.views || 0); }, 0);
  document.getElementById('statPostCount').textContent = posts.length;
  document.getElementById('statViewCount').textContent = totalViews;

  // Results bar
  var isFiltered = currentCategory !== 'all' || searchQuery.length > 0;
  if (isFiltered) {
    resultsBar.style.display = 'flex';
    resultsText.textContent = filtered.length + ' article' + (filtered.length !== 1 ? 's' : '') + ' found';
  } else {
    resultsBar.style.display = 'none';
  }

  if (filtered.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    document.getElementById('emptyTitle').textContent = searchQuery ? 'No results for "' + searchQuery + '"' : 'No articles in this category';
    document.getElementById('emptySub').textContent = 'Try a different search or select another category.';
    return;
  }
  empty.style.display = 'none';

  grid.innerHTML = '';
  filtered.forEach(function(post, index) {
    var card = buildCard(post, index);
    grid.appendChild(card);
  });
}

function buildCard(post, index) {
  var readTime = calcReadTime(post.content);
  var avatarClass = getAvatarClass(post.category);
  var catClass = getCatClass(post.category);
  var barClass = getBarClass(post.category);
  var initials = getInitials(post.author);

  var card = document.createElement('div');
  card.className = 'post-card';
  card.style.animationDelay = (index * 0.04) + 's';
  card.setAttribute('data-id', post.id);

  card.innerHTML =
    '<div class="card-category-bar ' + barClass + '"></div>' +
    '<div class="card-body">' +
      '<div class="card-meta-top">' +
        '<span class="card-category ' + catClass + '">' + post.category + '</span>' +
        '<span class="card-read-time">' + readTime + '</span>' +
      '</div>' +
      '<h2 class="card-title">' + escapeHtml(post.title) + '</h2>' +
      '<p class="card-excerpt">' + escapeHtml(post.excerpt) + '</p>' +
      '<div class="card-footer">' +
        '<div class="card-author-wrap">' +
          '<div class="card-avatar ' + avatarClass + '">' + initials + '</div>' +
          '<div class="card-author-info">' +
            '<div class="card-author-name">' + escapeHtml(post.author) + '</div>' +
            '<div class="card-date">' + formatDate(post.date) + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="card-actions">' +
          '<span class="card-views">' +
            '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>' +
            ' ' + (post.views || 0) +
          '</span>' +
          '<button class="btn-delete-card" data-id="' + post.id + '" title="Delete article" onclick="event.stopPropagation(); requestDelete(' + post.id + ')">' +
            '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</div>';

  // Click card body to open post (not delete btn)
  card.addEventListener('click', function(e) {
    if (e.target.closest('.btn-delete-card')) return;
    openPost(post.id);
  });

  return card;
}

// ============================================================
// OPEN SINGLE POST
// ============================================================
function openPost(id) {
  var post = posts.find(function(p) { return p.id === id; });
  if (!post) return;

  // Increment view count
  post.views = (post.views || 0) + 1;
  savePosts();

  var readTime = calcReadTime(post.content);
  var avatarClass = getAvatarClass(post.category);
  var catClass = getCatClass(post.category);
  var barClass = getBarClass(post.category);
  var initials = getInitials(post.author);

  var container = document.getElementById('postFull');
  container.innerHTML =
    '<div class="post-full-header">' +
      '<div class="post-full-cat">' +
        '<span class="card-category ' + catClass + '">' + post.category + '</span>' +
      '</div>' +
      '<h1 class="post-full-title">' + escapeHtml(post.title) + '</h1>' +
      '<div class="post-full-byline">' +
        '<div class="post-full-avatar ' + avatarClass + '">' + initials + '</div>' +
        '<div>' +
          '<div class="post-full-author">' + escapeHtml(post.author) + '</div>' +
          '<div class="post-full-date">' + formatDate(post.date) + '</div>' +
        '</div>' +
        '<span class="post-full-sep">|</span>' +
        '<span class="post-full-stats">' + readTime + ' &nbsp;&middot;&nbsp; ' + post.views + ' views</span>' +
      '</div>' +
    '</div>' +
    '<div class="post-divider"></div>' +
    '<div class="post-full-body">' + post.content + '</div>';

  showView('post');
  renderList(); // refresh view counts on cards in background
}

// ============================================================
// DELETE POST
// ============================================================
function requestDelete(id) {
  var post = posts.find(function(p) { return p.id === id; });
  if (!post) return;
  pendingDeleteId = id;
  document.getElementById('modalDesc').textContent = '"' + post.title.substring(0, 50) + (post.title.length > 50 ? '...' : '') + '"';
  document.getElementById('deleteModal').style.display = 'flex';
}

function confirmDelete() {
  if (!pendingDeleteId) return;
  posts = posts.filter(function(p) { return p.id !== pendingDeleteId; });
  savePosts();
  pendingDeleteId = null;
  closeModal();
  showView('list');
  renderList();
  showToast('Article deleted.');
}

function closeModal() {
  document.getElementById('deleteModal').style.display = 'none';
  pendingDeleteId = null;
}

// ============================================================
// NEW POST
// ============================================================
function showNewPost() {
  document.getElementById('newTitle').value = '';
  document.getElementById('newCategory').value = '';
  document.getElementById('newAuthor').value = '';
  document.getElementById('newExcerpt').value = '';
  document.getElementById('newContent').value = '';
  clearFieldErrors();
  showView('newPost');
  document.getElementById('newTitle').focus();
}

function clearFieldErrors() {
  ['newTitle','newCategory','newExcerpt','newContent'].forEach(function(id) {
    document.getElementById(id).classList.remove('field-error');
  });
}

function publishPost() {
  clearFieldErrors();
  var title   = document.getElementById('newTitle').value.trim();
  var category= document.getElementById('newCategory').value;
  var author  = document.getElementById('newAuthor').value.trim() || 'Anonymous';
  var excerpt = document.getElementById('newExcerpt').value.trim();
  var content = document.getElementById('newContent').value.trim();

  var valid = true;
  if (!title)    { document.getElementById('newTitle').classList.add('field-error'); valid = false; }
  if (!category) { document.getElementById('newCategory').classList.add('field-error'); valid = false; }
  if (!excerpt)  { document.getElementById('newExcerpt').classList.add('field-error'); valid = false; }
  if (!content)  { document.getElementById('newContent').classList.add('field-error'); valid = false; }
  if (!valid) { showToast('Please fill in all required fields.'); return; }

  // Format content: wrap plain text paragraphs in <p> if no HTML tags found
  var hasHtml = /<[a-z][\s\S]*>/i.test(content);
  var formatted = content;
  if (!hasHtml) {
    formatted = content.split(/\n\n+/).map(function(para) {
      return '<p>' + para.replace(/\n/g, '<br>') + '</p>';
    }).join('\n');
  }

  var today = new Date();
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var dd = String(today.getDate()).padStart(2, '0');
  var dateStr = today.getFullYear() + '-' + mm + '-' + dd;

  var post = {
    id: Date.now(),
    title: title,
    category: category,
    author: author,
    date: dateStr,
    excerpt: excerpt,
    content: formatted,
    views: 0,
    createdAt: Date.now()
  };

  posts.unshift(post);
  savePosts();
  showView('list');
  renderList();
  showToast('Article published!');
}

// ============================================================
// TOAST
// ============================================================
function showToast(message) {
  var toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(function() { toast.classList.remove('show'); }, 2800);
}

// ============================================================
// ESCAPE HTML (for user content rendered as text)
// ============================================================
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ============================================================
// EVENT LISTENERS
// ============================================================
function attachEventListeners() {
  // Logo click -> home
  document.querySelector('.logo').addEventListener('click', function() {
    showView('list');
    renderList();
  });

  // Theme toggle
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);

  // New post button
  document.getElementById('btnNewPost').addEventListener('click', showNewPost);

  // Back button
  document.getElementById('backBtn').addEventListener('click', function() {
    showView('list');
    renderList();
  });

  // Cancel new post
  document.getElementById('btnCancelPost').addEventListener('click', function() {
    showView('list');
    renderList();
  });

  // Publish post
  document.getElementById('btnPublish').addEventListener('click', publishPost);

  // Category tabs
  document.getElementById('categoryTabs').addEventListener('click', function(e) {
    var btn = e.target.closest('.cat-tab');
    if (!btn) return;
    document.querySelectorAll('.cat-tab').forEach(function(t) { t.classList.remove('active'); });
    btn.classList.add('active');
    currentCategory = btn.getAttribute('data-cat');
    renderList();
  });

  // Sort
  document.getElementById('sortBy').addEventListener('change', function() {
    currentSort = this.value;
    renderList();
  });

  // Search input
  document.getElementById('searchInput').addEventListener('input', function() {
    searchQuery = this.value.trim();
    var clearBtn = document.getElementById('searchClear');
    clearBtn.style.display = searchQuery ? 'flex' : 'none';
    renderList();
  });

  // Search clear
  document.getElementById('searchClear').addEventListener('click', function() {
    document.getElementById('searchInput').value = '';
    searchQuery = '';
    this.style.display = 'none';
    renderList();
    document.getElementById('searchInput').focus();
  });

  // Clear filters
  document.getElementById('clearFiltersBtn').addEventListener('click', function() {
    searchQuery = '';
    currentCategory = 'all';
    document.getElementById('searchInput').value = '';
    document.getElementById('searchClear').style.display = 'none';
    document.querySelectorAll('.cat-tab').forEach(function(t) { t.classList.remove('active'); });
    document.querySelector('.cat-tab[data-cat="all"]').classList.add('active');
    renderList();
  });

  // Modal cancel
  document.getElementById('modalCancelBtn').addEventListener('click', closeModal);

  // Modal delete confirm
  document.getElementById('modalDeleteBtn').addEventListener('click', confirmDelete);

  // Close modal on overlay click
  document.getElementById('deleteModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (document.getElementById('deleteModal').style.display !== 'none') closeModal();
      else if (document.getElementById('postView').style.display !== 'none') {
        showView('list'); renderList();
      } else if (document.getElementById('newPostView').style.display !== 'none') {
        showView('list'); renderList();
      }
    }
  });
}

// ============================================================
// START
// ============================================================
init();`;

export const blogPlatformProject: Project = {
  id: 'blog-platform',
  slug: 'blog-platform',
  title: 'Blog Platform',
  difficulty: 'intermediate',
  type: 'frontend',
  estimatedTime: '8-12 hours',
  description: 'Build a real, full-featured blog platform with post cards, single post view, category filters, real-time search, a new post form, delete functionality, dark mode, view counts, and localStorage persistence — all in plain HTML, CSS, and JavaScript.',
  overview: 'This project teaches you how to build a production-quality content platform without a framework. You will architect a multi-view single-page application, manage complex state, render HTML from data, and handle user interactions gracefully. Every technique here — data-driven rendering, view management, search and sort, form validation — transfers directly to React, Vue, and Angular work.',
  objective: 'Build a complete blog platform where users can read articles, filter by category, search in real time, write and publish new posts, and track view counts — all persisted to localStorage.',
  technologies: ['HTML', 'CSS', 'JavaScript'],
  prerequisites: ['Basic HTML', 'CSS Layouts', 'JavaScript DOM', 'localStorage basics'],
  learnings: [
    'Single-page application view management without a router',
    'Data-driven DOM rendering from JavaScript arrays',
    'localStorage for full data persistence',
    'CSS Custom Properties for theming and dark mode',
    'Real-time search and category filtering with array methods',
    'Form validation and user feedback patterns',
    'Read time calculation from word count',
    'View count tracking and sort by popularity',
    'CSS Grid for responsive card layouts',
    'Custom modal dialogs instead of native confirm()',
    'Keyboard accessibility and Escape key handling',
    'HTML sanitization and XSS prevention basics',
  ],
  features: [
    'Home page with responsive post card grid',
    'Click any card to open full article view',
    'Back button to return to post list',
    'Category filter tabs: All, JavaScript, CSS, React, Tools',
    'Real-time search filtering by title and excerpt',
    'Sort by Newest, Oldest, and Most Read',
    'New Post form with title, category, author, excerpt, and content',
    'Auto-format plain text content into HTML paragraphs',
    'Delete post with custom confirmation modal',
    'Dark mode toggle saved to localStorage',
    'View count increments on every post open',
    'Read time calculated from word count (words / 200)',
    '6 pre-loaded real web development articles',
    'Toast notifications for user actions',
    'Keyboard shortcut: Escape to go back',
    'Animated card entrance with staggered delay',
  ],
  fileStructure: 'blog-platform/\n  index.html\n  style.css\n  script.js',
  files: [
    { path: 'blog-platform/index.html', language: 'html', content: indexHtml },
    { path: 'blog-platform/style.css',  language: 'css',  content: styleCss },
    { path: 'blog-platform/script.js',  language: 'javascript', content: scriptJs },
  ],
  lessons: [
    {
      id: 'spa-views',
      title: 'Building a Single-Page App Without a Framework',
      explanation: 'A Single-Page Application (SPA) shows different "views" without loading a new page. Our blog has three views: the list view (post cards), the single post view, and the new post form. The showView() function hides all views and reveals only the requested one. This is the same concept React Router, Vue Router, and Next.js automate for you — at its core it is just show/hide logic. We also scroll to the top on every view change for a natural navigation feel.',
      js: `// Three views are always in the DOM, only one shown at a time
function showView(name) {
  // Hide all views
  ['listView', 'postView', 'newPostView'].forEach(function(id) {
    document.getElementById(id).style.display = 'none';
  });

  // Show the requested view
  document.getElementById(name + 'View').style.display = 'block';

  // Scroll to top like a real page transition
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Usage:
showView('list');    // show the post grid
showView('post');    // show the article reading view
showView('newPost'); // show the write article form

// The HTML structure matches:
// <div id="listView"> ... </div>
// <div id="postView" style="display:none;"> ... </div>
// <div id="newPostView" style="display:none;"> ... </div>`,
    },
    {
      id: 'data-driven-rendering',
      title: 'Data-Driven DOM Rendering',
      explanation: 'renderList() is the heart of the application. It reads from the posts array, applies filters and sort, then builds the entire post grid by creating DOM elements with JavaScript. We never hard-code post HTML in the HTML file — all cards are generated from data. This is exactly how React renders JSX, how Vue templates work, and how Angular renders components. The pattern: data changes -> call render -> rebuild the UI from scratch. The buildCard() function is effectively a component: it takes a post object and returns a DOM element.',
      js: `function renderList() {
  var filtered = getFilteredPosts(); // apply filters + sort
  var grid = document.getElementById('postGrid');

  grid.innerHTML = ''; // clear old cards

  filtered.forEach(function(post, index) {
    var card = buildCard(post, index); // "component" function
    grid.appendChild(card);
  });
}

// buildCard is a "component" — takes data, returns DOM
function buildCard(post, index) {
  var card = document.createElement('div');
  card.className = 'post-card';

  // Stagger animation delay so cards appear one by one
  card.style.animationDelay = (index * 0.04) + 's';

  // Build inner HTML from post data
  card.innerHTML =
    '<h2 class="card-title">' + escapeHtml(post.title) + '</h2>' +
    '<p class="card-excerpt">' + escapeHtml(post.excerpt) + '</p>';

  // Attach click handler to open the post
  card.addEventListener('click', function() {
    openPost(post.id);
  });

  return card;
}

// Key insight: escapeHtml() prevents XSS attacks.
// If a post title contained <script>alert(1)</script>,
// without escaping it would execute. Always escape user data!
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}`,
    },
    {
      id: 'filtering-search',
      title: 'Real-Time Search and Category Filtering',
      explanation: 'getFilteredPosts() derives the visible posts from the full posts array by chaining filter() calls. This is the derived state pattern: you never store a separate "filtered posts" variable, you compute it on demand. Search filtering runs on every keystroke using the input event. Category filtering updates when a tab is clicked. Both just update a state variable and call renderList() — the render function does the rest. This is conceptually identical to how React re-renders when state changes.',
      js: `// State variables
var currentCategory = 'all';
var currentSort = 'newest';
var searchQuery = '';

function getFilteredPosts() {
  var result = posts.slice(); // never mutate the original array

  // 1. Category filter
  if (currentCategory !== 'all') {
    result = result.filter(function(p) {
      return p.category === currentCategory;
    });
  }

  // 2. Search filter (case-insensitive, checks title + excerpt)
  if (searchQuery) {
    var q = searchQuery.toLowerCase();
    result = result.filter(function(p) {
      return p.title.toLowerCase().indexOf(q) !== -1 ||
             p.excerpt.toLowerCase().indexOf(q) !== -1;
    });
  }

  // 3. Sort
  if (currentSort === 'newest') {
    result.sort(function(a, b) { return b.createdAt - a.createdAt; });
  } else if (currentSort === 'most-read') {
    result.sort(function(a, b) { return (b.views || 0) - (a.views || 0); });
  }

  return result;
}

// Real-time search: update state -> re-render
document.getElementById('searchInput').addEventListener('input', function() {
  searchQuery = this.value.trim();
  renderList(); // re-render on every keystroke
});

// Category tab click: update state -> re-render
document.getElementById('categoryTabs').addEventListener('click', function(e) {
  var btn = e.target.closest('.cat-tab');
  if (!btn) return;
  currentCategory = btn.getAttribute('data-cat');
  renderList();
});`,
    },
    {
      id: 'read-time-views',
      title: 'Read Time and View Count',
      explanation: 'Read time is calculated by stripping HTML tags from the content, counting words, and dividing by 200 (the average adult reading speed in words per minute). View counts increment every time a post is opened and are saved to localStorage immediately. The Most Read sort uses these view counts. This makes the sort genuinely dynamic — reading articles changes how they rank. Both features demonstrate a key principle: store raw data (word count, view count) and derive display values (read time string) on the fly.',
      js: `// Read time: strip HTML, count words, divide by 200 wpm
function calcReadTime(content) {
  // Remove HTML tags with a regex, collapse whitespace
  var text = content
    .replace(/<[^>]+>/g, ' ')  // remove all HTML tags
    .replace(/\\s+/g, ' ')       // collapse whitespace
    .trim();

  var wordCount = text.split(' ').filter(function(w) {
    return w.length > 0;
  }).length;

  var minutes = Math.max(1, Math.round(wordCount / 200));
  return minutes + ' min read';
}

// Usage in card rendering:
var readTime = calcReadTime(post.content);
// "5 min read" for a 1000-word article

// View counting: increment on open, save immediately
function openPost(id) {
  var post = posts.find(function(p) { return p.id === id; });
  if (!post) return;

  // Increment and persist right away
  post.views = (post.views || 0) + 1;
  savePosts();

  // ... render the full post view ...
  // The view count will now appear in the rendered header
  // and "Most Read" sort will rank this post higher
}`,
    },
    {
      id: 'form-validation',
      title: 'Form Validation and Publishing',
      explanation: 'The New Post form validates all required fields before publishing. Invalid fields get a red border (field-error class) via CSS. After successful validation, we check if the content looks like plain text and automatically wrap paragraphs in <p> tags, so users can write naturally without knowing HTML. This is called progressive enhancement — raw text still works, but HTML content works too. The post is then prepended to the posts array (newest first) and saved.',
      js: `function publishPost() {
  // Read form values
  var title    = document.getElementById('newTitle').value.trim();
  var category = document.getElementById('newCategory').value;
  var author   = document.getElementById('newAuthor').value.trim() || 'Anonymous';
  var excerpt  = document.getElementById('newExcerpt').value.trim();
  var content  = document.getElementById('newContent').value.trim();

  // Validate required fields
  var valid = true;
  if (!title)    { markError('newTitle');    valid = false; }
  if (!category) { markError('newCategory'); valid = false; }
  if (!excerpt)  { markError('newExcerpt');  valid = false; }
  if (!content)  { markError('newContent');  valid = false; }
  if (!valid) { showToast('Please fill in all required fields.'); return; }

  // Auto-format plain text: wrap double-newline paragraphs in <p>
  var hasHtml = /<[a-z][\\s\\S]*>/i.test(content);
  if (!hasHtml) {
    content = content
      .split(/\\n\\n+/)
      .map(function(para) { return '<p>' + para.replace(/\\n/g, '<br>') + '</p>'; })
      .join('\\n');
  }

  // Build the new post object
  var today = new Date();
  var post = {
    id: Date.now(),
    title: title,
    category: category,
    author: author,
    date: today.toISOString().split('T')[0], // YYYY-MM-DD
    excerpt: excerpt,
    content: content,
    views: 0,
    createdAt: Date.now()
  };

  // Prepend so newest appears first
  posts.unshift(post);
  savePosts();
  showView('list');
  renderList();
  showToast('Article published!');
}`,
    },
    {
      id: 'modal-toast',
      title: 'Custom Modals and Toast Notifications',
      explanation: 'The browser\'s native confirm() dialog is blocked inside sandboxed iframes and looks inconsistent across operating systems. We build a custom modal that matches the app\'s design. The delete modal stores the pending post id in a variable and only acts on it when the user clicks Confirm. Toast notifications use CSS transitions: the .show class moves the toast up from off-screen and fades it in, then a setTimeout removes the class after 2.8 seconds. Both patterns are reusable building blocks you will find in every serious UI codebase.',
      js: `// Custom delete modal - works in iframes, looks on-brand
var pendingDeleteId = null;

function requestDelete(id) {
  var post = posts.find(function(p) { return p.id === id; });
  if (!post) return;
  pendingDeleteId = id; // store which post to delete
  // Update modal description to name the post being deleted
  document.getElementById('modalDesc').textContent =
    '"' + post.title.substring(0, 50) + '"';
  document.getElementById('deleteModal').style.display = 'flex';
}

function confirmDelete() {
  if (!pendingDeleteId) return;
  posts = posts.filter(function(p) { return p.id !== pendingDeleteId; });
  savePosts();
  pendingDeleteId = null;
  closeModal();
  renderList();
  showToast('Article deleted.');
}

// Toast: CSS-driven animation, no JavaScript positioning math
function showToast(message) {
  var toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');   // triggers CSS transition
  setTimeout(function() {
    toast.classList.remove('show'); // fade out after 2.8s
  }, 2800);
}

// CSS that makes the toast work:
// .toast { transform: translateY(80px); opacity: 0; transition: ... }
// .toast.show { transform: translateY(0); opacity: 1; }`,
    },
  ],
  challenges: [
    {
      id: 'c1',
      title: 'Add Pagination',
      difficulty: 'medium',
      description: 'Show only 6 posts per page with Previous and Next buttons at the bottom of the grid. The current page number should reset when the category or search changes.',
      hint: 'Add a currentPage variable (starts at 1) and a POSTS_PER_PAGE constant (6). In getFilteredPosts(), return all posts. In renderList(), slice the result: filtered.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE). Render pagination buttons below the grid. Reset currentPage to 1 whenever filters change.',
      solutionJs: `var POSTS_PER_PAGE = 6;
var currentPage = 1;

function renderList() {
  var all = getFilteredPosts();
  var totalPages = Math.ceil(all.length / POSTS_PER_PAGE);
  var pageItems = all.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  // render pageItems as cards...
  // render pagination below the grid
  renderPagination(currentPage, totalPages);
}`,
    },
    {
      id: 'c2',
      title: 'Add a Markdown-Lite Renderer',
      difficulty: 'medium',
      description: 'Convert basic Markdown syntax in the content textarea to HTML before saving: **bold**, *italic*, # headings, \`code\`, and - list items.',
      hint: 'Write a markdownToHtml(text) function using String.replace() with regex. Process lines: lines starting with # become h2, ## become h3, - become li items (group them). Then handle inline patterns: **text** -> <strong>, *text* -> <em>, `code` -> <code>. Apply this function in publishPost() when no HTML tags are detected.',
      solutionJs: `function markdownToHtml(text) {
  return text
    .replace(/^## (.+)$/gm, '<h3>$1</h3>')
    .replace(/^# (.+)$/gm, '<h2>$1</h2>')
    .replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>')
    .replace(/\\*(.+?)\\*/g, '<em>$1</em>')
    .replace(/\`(.+?)\`/g, '<code>$1</code>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\\/li>)/gs, '<ul>$1</ul>');
}`,
    },
    {
      id: 'c3',
      title: 'Add Reading Progress Bar',
      difficulty: 'easy',
      description: 'Show a thin progress bar at the top of the page that fills as the user scrolls through an article in the single post view.',
      hint: 'Add a fixed div at the top of the page with height 3px and background: var(--accent). In the post view, attach a scroll event listener. Calculate progress as: (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100. Set the div\'s width to that percentage. Remove the listener when going back to the list.',
    },
    {
      id: 'c4',
      title: 'Add Local Bookmarks',
      difficulty: 'medium',
      description: 'Add a bookmark button on each post card and in the single post view. Bookmarked posts should be saveable and filterable by a "Bookmarks" category tab.',
      hint: 'Add a bookmarks Set stored in localStorage (JSON.stringify/parse an array, convert to Set on load). Add a "Bookmarks" button to the category tabs. In getFilteredPosts(), filter by posts where bookmarks.has(post.id). The bookmark toggle button flips the id in the Set and re-renders.',
    },
  ],
  nextProject: 'rest-api',
};
