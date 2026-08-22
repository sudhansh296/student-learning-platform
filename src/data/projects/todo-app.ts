import type { Project } from './types';

const indexHtml = `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TaskFlow - Task Manager</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="app">

    <!-- Header -->
    <header class="app-header">
      <div class="header-left">
        <div class="logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="#2563eb"/>
            <path d="M8 14l4 4 8-8" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="logo-text">TaskFlow</span>
        </div>
      </div>
      <div class="header-right">
        <button class="theme-btn" id="themeToggle" title="Toggle dark mode">
          <svg class="icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <svg class="icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>
      </div>
    </header>

    <!-- Stats Bar -->
    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-num" id="statTotal">0</span>
        <span class="stat-label">Total</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-num active-color" id="statActive">0</span>
        <span class="stat-label">Active</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-num done-color" id="statDone">0</span>
        <span class="stat-label">Done</span>
      </div>
      <div class="progress-wrap">
        <div class="progress-track">
          <div class="progress-fill" id="progressFill"></div>
        </div>
        <span class="progress-pct" id="progressPct">0%</span>
      </div>
    </div>

    <!-- Add Task Form -->
    <div class="add-card">
      <h2 class="add-title">Add New Task</h2>
      <div class="add-row">
        <input type="text" id="taskTitle" class="input-field" placeholder="What needs to be done?" maxlength="120" autocomplete="off" />
        <button class="btn-primary" id="addBtn">Add Task</button>
      </div>
      <div class="add-meta-row">
        <select id="taskPriority" class="select-field">
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
          <option value="low">Low Priority</option>
        </select>
        <select id="taskCategory" class="select-field">
          <option value="general">General</option>
          <option value="work">Work</option>
          <option value="study">Study</option>
          <option value="personal">Personal</option>
          <option value="health">Health</option>
        </select>
        <input type="date" id="taskDueDate" class="input-field date-field" title="Due date (optional)" />
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="controls-bar">
      <div class="filter-tabs" id="filterTabs">
        <button class="tab active" data-filter="all">All</button>
        <button class="tab" data-filter="active">Active</button>
        <button class="tab" data-filter="completed">Completed</button>
      </div>
      <div class="controls-right">
        <input type="text" id="searchInput" class="search-input" placeholder="Search tasks..." autocomplete="off" />
        <select id="filterCategory" class="select-sm">
          <option value="">All Categories</option>
          <option value="general">General</option>
          <option value="work">Work</option>
          <option value="study">Study</option>
          <option value="personal">Personal</option>
          <option value="health">Health</option>
        </select>
        <select id="filterPriority" class="select-sm">
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select id="sortBy" class="select-sm">
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="duedate">Due Date</option>
          <option value="priority">Priority</option>
          <option value="name">Name</option>
        </select>
      </div>
    </div>

    <!-- Task List -->
    <div class="task-list" id="taskList"></div>

    <!-- Empty State -->
    <div class="empty-state" id="emptyState" style="display:none;">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="30" stroke="#e2e8f0" stroke-width="2"/>
        <path d="M20 32l8 8 16-16" stroke="#e2e8f0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p class="empty-title" id="emptyTitle">No tasks yet</p>
      <p class="empty-sub" id="emptySub">Add your first task above to get started.</p>
    </div>

    <!-- Footer Actions -->
    <div class="footer-bar" id="footerBar" style="display:none;">
      <span class="footer-info" id="footerInfo"></span>
      <button class="btn-ghost" id="clearCompletedBtn">Clear Completed</button>
    </div>

  </div>
  <script src="script.js"></script>
</body>
</html>`;

const styleCss = `/* ===== CSS VARIABLES ===== */
:root {
  --bg: #f1f5f9;
  --surface: #ffffff;
  --surface2: #f8fafc;
  --border: #e2e8f0;
  --text: #0f172a;
  --text-muted: #64748b;
  --text-soft: #94a3b8;
  --accent: #2563eb;
  --accent-hover: #1d4ed8;
  --accent-light: #eff6ff;
  --success: #16a34a;
  --danger: #dc2626;
  --danger-light: #fef2f2;
  --warning: #d97706;
  --shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.08);
  --radius: 10px;
  --radius-sm: 6px;
  --transition: 0.18s ease;
}

[data-theme="dark"] {
  --bg: #0f172a;
  --surface: #1e293b;
  --surface2: #293548;
  --border: #334155;
  --text: #f1f5f9;
  --text-muted: #94a3b8;
  --text-soft: #64748b;
  --accent-light: #1e3a5f;
  --shadow: 0 1px 3px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.3);
}

/* ===== RESET ===== */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 15px; }
body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  min-height: 100vh;
  transition: background var(--transition), color var(--transition);
}

/* ===== APP CONTAINER ===== */
.app {
  max-width: 780px;
  margin: 0 auto;
  padding: 16px;
}

/* ===== HEADER ===== */
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}
.logo { display: flex; align-items: center; gap: 10px; }
.logo-text { font-size: 1.25rem; font-weight: 800; color: var(--text); letter-spacing: -0.5px; }
.theme-btn {
  width: 36px; height: 36px;
  border: 1px solid var(--border);
  border-radius: 50%;
  background: var(--surface);
  color: var(--text-muted);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all var(--transition);
}
.theme-btn:hover { background: var(--surface2); color: var(--text); }
[data-theme="light"] .icon-moon { display: none; }
[data-theme="dark"] .icon-sun { display: none; }

/* ===== STATS BAR ===== */
.stats-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px 18px;
  margin-bottom: 16px;
  box-shadow: var(--shadow);
}
.stat-item { display: flex; flex-direction: column; align-items: center; gap: 2px; min-width: 44px; }
.stat-num { font-size: 1.4rem; font-weight: 800; line-height: 1; }
.stat-label { font-size: 11px; color: var(--text-muted); font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
.stat-divider { width: 1px; height: 32px; background: var(--border); }
.active-color { color: var(--accent); }
.done-color { color: var(--success); }
.progress-wrap { display: flex; align-items: center; gap: 10px; flex: 1; margin-left: 8px; }
.progress-track { flex: 1; height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, var(--accent), #7c3aed); border-radius: 4px; transition: width 0.4s ease; }
.progress-pct { font-size: 12px; font-weight: 700; color: var(--text-muted); min-width: 36px; text-align: right; }

/* ===== ADD CARD ===== */
.add-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 18px;
  margin-bottom: 16px;
  box-shadow: var(--shadow);
}
.add-title { font-size: 0.85rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
.add-row { display: flex; gap: 8px; margin-bottom: 10px; }
.add-meta-row { display: flex; gap: 8px; flex-wrap: wrap; }

/* ===== INPUTS ===== */
.input-field {
  flex: 1;
  padding: 9px 12px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-family: inherit;
  background: var(--surface2);
  color: var(--text);
  outline: none;
  transition: border-color var(--transition), background var(--transition);
}
.input-field:focus { border-color: var(--accent); background: var(--surface); }
.input-field::placeholder { color: var(--text-soft); }
.date-field { flex: none; width: 160px; color-scheme: light dark; }
.select-field {
  padding: 9px 10px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-family: inherit;
  background: var(--surface2);
  color: var(--text);
  cursor: pointer;
  outline: none;
  transition: border-color var(--transition);
}
.select-field:focus { border-color: var(--accent); }

/* ===== BUTTONS ===== */
.btn-primary {
  padding: 9px 20px;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  transition: background var(--transition), transform var(--transition);
}
.btn-primary:hover { background: var(--accent-hover); }
.btn-primary:active { transform: scale(0.97); }
.btn-ghost {
  padding: 7px 14px;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  transition: all var(--transition);
}
.btn-ghost:hover { background: var(--danger-light); color: var(--danger); border-color: #fecaca; }
.btn-icon {
  width: 28px; height: 28px;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-soft);
  transition: all var(--transition);
  flex-shrink: 0;
}
.btn-icon:hover { background: var(--surface2); color: var(--text); }
.btn-icon.delete:hover { background: var(--danger-light); color: var(--danger); }

/* ===== CONTROLS BAR ===== */
.controls-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}
.filter-tabs { display: flex; gap: 2px; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 3px; }
.tab {
  padding: 5px 14px;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  background: transparent;
  color: var(--text-muted);
  transition: all var(--transition);
}
.tab.active { background: var(--surface); color: var(--accent); box-shadow: var(--shadow); }
.tab:not(.active):hover { color: var(--text); }
.controls-right { display: flex; gap: 8px; flex-wrap: wrap; flex: 1; }
.search-input {
  flex: 1;
  min-width: 140px;
  padding: 6px 10px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-family: inherit;
  background: var(--surface);
  color: var(--text);
  outline: none;
  transition: border-color var(--transition);
}
.search-input:focus { border-color: var(--accent); }
.search-input::placeholder { color: var(--text-soft); }
.select-sm {
  padding: 6px 8px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-family: inherit;
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
  outline: none;
}
.select-sm:focus { border-color: var(--accent); }

/* ===== TASK LIST ===== */
.task-list { display: flex; flex-direction: column; gap: 8px; }

/* ===== TASK CARD ===== */
.task-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px 14px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  box-shadow: var(--shadow);
  transition: all var(--transition);
  animation: slideIn 0.2s ease;
  position: relative;
}
.task-card:hover { box-shadow: var(--shadow-md); transform: translateY(-1px); }
.task-card.completed { opacity: 0.65; }
.task-card.completed .task-title { text-decoration: line-through; color: var(--text-muted); }

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Priority left border */
.task-card[data-priority="high"]   { border-left: 3px solid #ef4444; }
.task-card[data-priority="medium"] { border-left: 3px solid #f59e0b; }
.task-card[data-priority="low"]    { border-left: 3px solid #22c55e; }

/* ===== CHECKBOX ===== */
.task-check {
  width: 19px; height: 19px;
  border: 2px solid var(--border);
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 2px;
  cursor: pointer;
  appearance: none;
  background: var(--surface);
  position: relative;
  transition: all var(--transition);
}
.task-check:checked {
  background: var(--success);
  border-color: var(--success);
}
.task-check:checked::after {
  content: '';
  position: absolute;
  left: 4px; top: 1px;
  width: 6px; height: 10px;
  border: 2px solid white;
  border-top: none; border-left: none;
  transform: rotate(45deg);
}
.task-check:hover:not(:checked) { border-color: var(--accent); }

/* ===== TASK BODY ===== */
.task-body { flex: 1; min-width: 0; }
.task-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 5px;
  word-break: break-word;
  cursor: pointer;
  transition: color var(--transition);
}
.task-title:hover { color: var(--accent); }
.task-title[contenteditable="true"] {
  outline: 2px solid var(--accent);
  border-radius: 4px;
  padding: 2px 6px;
  background: var(--accent-light);
}
.task-meta { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }

/* ===== BADGES ===== */
.badge {
  display: inline-flex; align-items: center;
  font-size: 10px; font-weight: 700;
  padding: 2px 7px;
  border-radius: 99px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  border: 1px solid transparent;
}
.badge-high    { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
.badge-medium  { background: #fffbeb; color: #d97706; border-color: #fde68a; }
.badge-low     { background: #f0fdf4; color: #16a34a; border-color: #bbf7d0; }
.badge-general { background: #f1f5f9; color: #64748b; border-color: #e2e8f0; }
.badge-work    { background: #eff6ff; color: #2563eb; border-color: #bfdbfe; }
.badge-study   { background: #faf5ff; color: #7c3aed; border-color: #e9d5ff; }
.badge-personal{ background: #fff0f9; color: #be185d; border-color: #fbcfe8; }
.badge-health  { background: #ecfdf5; color: #059669; border-color: #a7f3d0; }
.badge-overdue { background: #fef2f2; color: #dc2626; border-color: #fecaca; font-size: 10px; }
.badge-duedate { background: #f8fafc; color: var(--text-muted); border-color: var(--border); }

/* ===== TASK ACTIONS ===== */
.task-actions {
  display: flex;
  gap: 2px;
  opacity: 0;
  transition: opacity var(--transition);
}
.task-card:hover .task-actions { opacity: 1; }

/* ===== EMPTY STATE ===== */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-soft);
}
.empty-title { font-size: 1.1rem; font-weight: 700; margin: 16px 0 6px; color: var(--text-muted); }
.empty-sub { font-size: 13px; }

/* ===== FOOTER BAR ===== */
.footer-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  margin-top: 6px;
  border-top: 1px solid var(--border);
  font-size: 12px;
  color: var(--text-muted);
}
.footer-info { color: var(--text-muted); }

/* ===== RESPONSIVE ===== */
@media (max-width: 600px) {
  .add-row { flex-wrap: wrap; }
  .add-meta-row { flex-direction: column; }
  .controls-bar { flex-direction: column; align-items: stretch; }
  .controls-right { flex-direction: column; }
  .date-field { width: 100%; }
  .stats-bar { flex-wrap: wrap; gap: 10px; }
  .progress-wrap { width: 100%; }
}`;

const scriptJs = `// ===================================================
// TaskFlow - Full Task Manager
// Features: CRUD, categories, priorities, due dates,
// filters, search, sort, dark mode, localStorage
// ===================================================

// -- DATA ----------------------------------------------
let tasks = [];
let currentFilter = 'all';
let currentCategory = '';
let currentPriority = '';
let currentSort = 'newest';
let searchQuery = '';

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

// -- SAMPLE DATA ---------------------------------------
const sampleTasks = [
  {
    id: 1,
    title: 'Complete JavaScript assignment',
    priority: 'high',
    category: 'study',
    dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], // yesterday (overdue)
    completed: false,
    createdAt: Date.now() - 3 * 86400000
  },
  {
    id: 2,
    title: 'Submit internship application to Google',
    priority: 'high',
    category: 'work',
    dueDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    completed: false,
    createdAt: Date.now() - 2 * 86400000
  },
  {
    id: 3,
    title: 'Read chapter 5 of Data Structures textbook',
    priority: 'medium',
    category: 'study',
    dueDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
    completed: false,
    createdAt: Date.now() - 86400000
  },
  {
    id: 4,
    title: 'Morning run - 5km',
    priority: 'low',
    category: 'health',
    dueDate: '',
    completed: true,
    createdAt: Date.now() - 86400000
  },
  {
    id: 5,
    title: 'Buy groceries for the week',
    priority: 'medium',
    category: 'personal',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    completed: false,
    createdAt: Date.now() - 3600000
  },
  {
    id: 6,
    title: 'Review pull requests on GitHub',
    priority: 'medium',
    category: 'work',
    dueDate: '',
    completed: true,
    createdAt: Date.now() - 7200000
  }
];

// -- INIT ----------------------------------------------
function init() {
  loadTheme();
  loadTasks();
  attachEventListeners();
  renderAll();
}

// -- STORAGE -------------------------------------------
function loadTasks() {
  var saved = localStorage.getItem('taskflow_tasks');
  if (saved) {
    tasks = JSON.parse(saved);
  } else {
    tasks = sampleTasks;
    saveTasks();
  }
}

function saveTasks() {
  localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
}

// -- THEME ---------------------------------------------
function loadTheme() {
  var theme = localStorage.getItem('taskflow_theme') || 'light';
  document.documentElement.setAttribute('data-theme', theme);
}

function toggleTheme() {
  var current = document.documentElement.getAttribute('data-theme');
  var next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('taskflow_theme', next);
}

// -- ADD TASK ------------------------------------------
function addTask() {
  var titleEl = document.getElementById('taskTitle');
  var title = titleEl.value.trim();
  if (!title) {
    titleEl.style.borderColor = '#ef4444';
    setTimeout(function() { titleEl.style.borderColor = ''; }, 1200);
    titleEl.focus();
    return;
  }

  var task = {
    id: Date.now(),
    title: title,
    priority: document.getElementById('taskPriority').value,
    category: document.getElementById('taskCategory').value,
    dueDate: document.getElementById('taskDueDate').value,
    completed: false,
    createdAt: Date.now()
  };

  tasks.unshift(task);
  saveTasks();

  // Reset form
  titleEl.value = '';
  document.getElementById('taskDueDate').value = '';
  document.getElementById('taskPriority').value = 'medium';
  document.getElementById('taskCategory').value = 'general';

  renderAll();
  titleEl.focus();
}

// -- TOGGLE COMPLETE -----------------------------------
function toggleTask(id) {
  var task = tasks.find(function(t) { return t.id === id; });
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderAll();
  }
}

// -- DELETE TASK ---------------------------------------
function deleteTask(id) {
  tasks = tasks.filter(function(t) { return t.id !== id; });
  saveTasks();
  renderAll();
}

// -- EDIT TASK TITLE -----------------------------------
function startEdit(id, el) {
  el.setAttribute('contenteditable', 'true');
  el.focus();
  // Move cursor to end
  var range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  var sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);

  function finish() {
    el.removeAttribute('contenteditable');
    var newText = el.textContent.trim();
    if (newText) {
      var task = tasks.find(function(t) { return t.id === id; });
      if (task) { task.title = newText; saveTasks(); }
    }
    renderAll();
  }

  el.addEventListener('blur', finish, { once: true });
  el.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); el.blur(); }
    if (e.key === 'Escape') { el.textContent = tasks.find(function(t){ return t.id === id; }).title; el.blur(); }
  }, { once: true });
}

// -- CLEAR COMPLETED -----------------------------------
function clearCompleted() {
  var count = tasks.filter(function(t) { return t.completed; }).length;
  if (!count) return;
  // Use custom confirm UI instead of native confirm() which is blocked in iframes
  showConfirm(
    'Remove ' + count + ' completed task' + (count > 1 ? 's' : '') + '?',
    function() {
      tasks = tasks.filter(function(t) { return !t.completed; });
      saveTasks();
      renderAll();
    }
  );
}

// -- CUSTOM CONFIRM (works in sandboxed iframe) --------
function showConfirm(message, onConfirm) {
  var existing = document.getElementById('tf-confirm');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.id = 'tf-confirm';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;z-index:9999;';

  var box = document.createElement('div');
  box.style.cssText = 'background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:24px;max-width:320px;width:90%;box-shadow:0 8px 32px rgba(0,0,0,0.2);text-align:center;';

  var msg = document.createElement('p');
  msg.style.cssText = 'font-size:14px;font-weight:600;color:var(--text);margin-bottom:18px;';
  msg.textContent = message;

  var btns = document.createElement('div');
  btns.style.cssText = 'display:flex;gap:10px;justify-content:center;';

  var cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.style.cssText = 'padding:8px 20px;border:1px solid var(--border);border-radius:6px;background:transparent;color:var(--text-muted);cursor:pointer;font-size:13px;font-weight:600;';
  cancelBtn.addEventListener('click', function() { overlay.remove(); });

  var confirmBtn = document.createElement('button');
  confirmBtn.textContent = 'Remove';
  confirmBtn.style.cssText = 'padding:8px 20px;border:none;border-radius:6px;background:#dc2626;color:white;cursor:pointer;font-size:13px;font-weight:700;';
  confirmBtn.addEventListener('click', function() { overlay.remove(); onConfirm(); });

  btns.appendChild(cancelBtn);
  btns.appendChild(confirmBtn);
  box.appendChild(msg);
  box.appendChild(btns);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
}

// -- FILTER / SORT / SEARCH ----------------------------
function getFilteredTasks() {
  var filtered = tasks.slice();

  // Filter by status
  if (currentFilter === 'active') {
    filtered = filtered.filter(function(t) { return !t.completed; });
  } else if (currentFilter === 'completed') {
    filtered = filtered.filter(function(t) { return t.completed; });
  }

  // Filter by category
  if (currentCategory) {
    filtered = filtered.filter(function(t) { return t.category === currentCategory; });
  }

  // Filter by priority
  if (currentPriority) {
    filtered = filtered.filter(function(t) { return t.priority === currentPriority; });
  }

  // Search
  if (searchQuery) {
    var q = searchQuery.toLowerCase();
    filtered = filtered.filter(function(t) { return t.title.toLowerCase().indexOf(q) !== -1; });
  }

  // Sort
  if (currentSort === 'newest') {
    filtered.sort(function(a, b) { return b.createdAt - a.createdAt; });
  } else if (currentSort === 'oldest') {
    filtered.sort(function(a, b) { return a.createdAt - b.createdAt; });
  } else if (currentSort === 'priority') {
    filtered.sort(function(a, b) { return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]; });
  } else if (currentSort === 'name') {
    filtered.sort(function(a, b) { return a.title.localeCompare(b.title); });
  } else if (currentSort === 'duedate') {
    filtered.sort(function(a, b) {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    });
  }

  return filtered;
}

// -- HELPERS -------------------------------------------
function formatDate(dateStr) {
  if (!dateStr) return '';
  var d = new Date(dateStr + 'T00:00:00');
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return months[d.getMonth()] + ' ' + d.getDate();
}

function isOverdue(task) {
  if (!task.dueDate || task.completed) return false;
  var today = new Date().toISOString().split('T')[0];
  return task.dueDate < today;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// -- RENDER --------------------------------------------
function renderAll() {
  renderStats();
  renderTasks();
}

function renderStats() {
  var total = tasks.length;
  var done = tasks.filter(function(t) { return t.completed; }).length;
  var active = total - done;
  var pct = total > 0 ? Math.round((done / total) * 100) : 0;

  document.getElementById('statTotal').textContent = total;
  document.getElementById('statActive').textContent = active;
  document.getElementById('statDone').textContent = done;
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressPct').textContent = pct + '%';
}

function renderTasks() {
  var list = document.getElementById('taskList');
  var empty = document.getElementById('emptyState');
  var footer = document.getElementById('footerBar');
  var footerInfo = document.getElementById('footerInfo');

  var filtered = getFilteredTasks();

  // Footer
  var completedCount = tasks.filter(function(t) { return t.completed; }).length;
  var activeCount = tasks.filter(function(t) { return !t.completed; }).length;
  if (tasks.length > 0) {
    footer.style.display = 'flex';
    footerInfo.textContent = activeCount + ' task' + (activeCount !== 1 ? 's' : '') + ' remaining';
  } else {
    footer.style.display = 'none';
  }

  // Empty state
  if (filtered.length === 0) {
    list.innerHTML = '';
    empty.style.display = 'block';
    if (tasks.length === 0) {
      document.getElementById('emptyTitle').textContent = 'No tasks yet';
      document.getElementById('emptySub').textContent = 'Add your first task above to get started.';
    } else {
      document.getElementById('emptyTitle').textContent = 'No matching tasks';
      document.getElementById('emptySub').textContent = 'Try adjusting your filters or search query.';
    }
    return;
  }
  empty.style.display = 'none';

  // Build task cards
  list.innerHTML = '';
  filtered.forEach(function(task) {
    var card = document.createElement('div');
    card.className = 'task-card' + (task.completed ? ' completed' : '');
    card.setAttribute('data-priority', task.priority);
    card.setAttribute('data-id', task.id);

    // Checkbox
    var cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.className = 'task-check';
    cb.checked = task.completed;
    cb.addEventListener('change', function() { toggleTask(task.id); });

    // Body
    var body = document.createElement('div');
    body.className = 'task-body';

    // Title
    var titleEl = document.createElement('div');
    titleEl.className = 'task-title';
    titleEl.textContent = task.title;
    titleEl.title = 'Double-click to edit';
    titleEl.addEventListener('dblclick', function() { startEdit(task.id, titleEl); });

    // Meta badges
    var meta = document.createElement('div');
    meta.className = 'task-meta';

    // Priority badge
    var pb = document.createElement('span');
    pb.className = 'badge badge-' + task.priority;
    pb.textContent = capitalize(task.priority);
    meta.appendChild(pb);

    // Category badge
    var cb2 = document.createElement('span');
    cb2.className = 'badge badge-' + task.category;
    cb2.textContent = capitalize(task.category);
    meta.appendChild(cb2);

    // Due date
    if (task.dueDate) {
      if (isOverdue(task)) {
        var ov = document.createElement('span');
        ov.className = 'badge badge-overdue';
        ov.textContent = 'OVERDUE - ' + formatDate(task.dueDate);
        meta.appendChild(ov);
      } else {
        var dd = document.createElement('span');
        dd.className = 'badge badge-duedate';
        dd.textContent = 'Due ' + formatDate(task.dueDate);
        meta.appendChild(dd);
      }
    }

    body.appendChild(titleEl);
    body.appendChild(meta);

    // Actions
    var actions = document.createElement('div');
    actions.className = 'task-actions';

    // Edit button
    var editBtn = document.createElement('button');
    editBtn.className = 'btn-icon';
    editBtn.title = 'Edit (or double-click title)';
    editBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';
    editBtn.addEventListener('click', function() { startEdit(task.id, titleEl); });

    // Delete button
    var delBtn = document.createElement('button');
    delBtn.className = 'btn-icon delete';
    delBtn.title = 'Delete task';
    delBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>';
    delBtn.addEventListener('click', function() { deleteTask(task.id); });

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    card.appendChild(cb);
    card.appendChild(body);
    card.appendChild(actions);
    list.appendChild(card);
  });
}

// -- EVENT LISTENERS -----------------------------------
function attachEventListeners() {
  // Add task
  document.getElementById('addBtn').addEventListener('click', addTask);
  document.getElementById('taskTitle').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') addTask();
  });

  // Theme toggle
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);

  // Filter tabs
  document.getElementById('filterTabs').addEventListener('click', function(e) {
    var btn = e.target.closest('.tab');
    if (!btn) return;
    document.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('active'); });
    btn.classList.add('active');
    currentFilter = btn.getAttribute('data-filter');
    renderTasks();
  });

  // Category filter
  document.getElementById('filterCategory').addEventListener('change', function() {
    currentCategory = this.value;
    renderTasks();
  });

  // Priority filter
  document.getElementById('filterPriority').addEventListener('change', function() {
    currentPriority = this.value;
    renderTasks();
  });

  // Sort
  document.getElementById('sortBy').addEventListener('change', function() {
    currentSort = this.value;
    renderTasks();
  });

  // Search
  document.getElementById('searchInput').addEventListener('input', function() {
    searchQuery = this.value.trim();
    renderTasks();
  });

  // Clear completed
  document.getElementById('clearCompletedBtn').addEventListener('click', clearCompleted);
}

// -- START ---------------------------------------------
init();`;

export const todoApp: Project = {
  id: 'todo-app',
  slug: 'todo-app',
  title: 'Task Manager App',
  difficulty: 'beginner',
  type: 'frontend',
  estimatedTime: '4-6 hours',
  description: 'Build a full-featured Task Manager with priorities, categories, due dates, filters, search, sort, dark mode, and localStorage persistence — a real project for your portfolio.',
  technologies: ['HTML', 'CSS', 'JavaScript'],
  prerequisites: ['Basic HTML', 'Basic CSS', 'Basic JavaScript'],
  learnings: [
    'DOM manipulation and dynamic rendering',
    'localStorage API for data persistence',
    'CSS variables and dark mode',
    'Array methods: filter, sort, find, map',
    'Event delegation and listeners',
    'CRUD operations in JavaScript',
    'Inline editing with contenteditable',
    'CSS animations and transitions',
  ],
  features: [
    'Add tasks with title, priority, category, and due date',
    'Mark complete with animated circular checkbox',
    'Double-click any task to edit inline',
    'Filter by status: All / Active / Completed',
    'Filter by category and priority',
    'Search tasks in real time',
    'Sort by newest, oldest, due date, priority, name',
    'Progress bar showing completion percentage',
    'Overdue badge for past-due tasks',
    'Dark mode toggle saved to localStorage',
    'Full persistence — tasks survive page refresh',
    'Sample tasks pre-loaded so it looks great immediately',
  ],
  fileStructure: 'task-manager/\n  index.html\n  style.css\n  script.js',
  overview: 'This Task Manager is a real-world project that goes far beyond a basic to-do list. It teaches you how professional JavaScript applications are structured: data management with localStorage, dynamic DOM rendering, CSS custom properties for theming, array methods for filtering and sorting, and event-driven architecture. Every technique you learn here is used in React, Vue, and Angular applications.',
  objective: 'Build a complete task manager with categories, priorities, due dates, filters, search, dark mode, and full localStorage persistence.',
  nextProject: 'quiz-app',
  files: [
    { path: 'task-manager/index.html', language: 'html', content: indexHtml },
    { path: 'task-manager/style.css', language: 'css', content: styleCss },
    { path: 'task-manager/script.js', language: 'javascript', content: scriptJs },
  ],
  lessons: [
    {
      id: 'data-model',
      title: 'Designing the Data Model',
      explanation: 'Every app starts with a data model. Before writing a single line of DOM code, we define what a task looks like as a JavaScript object. Each task has an id (unique timestamp), title (the text), priority (high/medium/low), category (work/study/personal/health), dueDate (ISO date string or empty), completed (boolean), and createdAt (timestamp for sorting). We also define state variables — currentFilter, currentSort, searchQuery — that track what the user has selected. This separation of data from UI is the foundation of every modern framework.',
      js: `// A task object — this is your data schema
var task = {
  id: Date.now(),          // unique number (e.g. 1704067200000)
  title: 'Submit assignment',
  priority: 'high',        // 'high' | 'medium' | 'low'
  category: 'study',       // 'work' | 'study' | 'personal' | 'health' | 'general'
  dueDate: '2024-02-15',   // YYYY-MM-DD string, or '' if none
  completed: false,
  createdAt: Date.now()    // for sorting by newest/oldest
};

// App state — what the user currently has selected
var currentFilter = 'all';     // 'all' | 'active' | 'completed'
var currentCategory = '';       // empty = show all categories
var currentPriority = '';       // empty = show all priorities
var currentSort = 'newest';
var searchQuery = '';`,
    },
    {
      id: 'localStorage',
      title: 'Persisting Data with localStorage',
      explanation: 'localStorage is a browser API that stores key-value pairs as strings. It persists even after the tab closes or the user refreshes. We use JSON.stringify() to convert our tasks array into a string before saving, and JSON.parse() to convert it back into an array when loading. If no saved data exists (first visit), we load sample tasks so the app looks populated. saveTasks() is called after every data change — add, toggle, delete, edit.',
      js: `function loadTasks() {
  var saved = localStorage.getItem('taskflow_tasks');
  if (saved) {
    tasks = JSON.parse(saved); // convert JSON string back to array
  } else {
    tasks = sampleTasks; // first visit — load demo data
    saveTasks();
  }
}

function saveTasks() {
  // Convert array to JSON string and persist to browser storage
  localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
}

// Theme persistence works the same way
function loadTheme() {
  var theme = localStorage.getItem('taskflow_theme') || 'light';
  document.documentElement.setAttribute('data-theme', theme);
}

function toggleTheme() {
  var current = document.documentElement.getAttribute('data-theme');
  var next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('taskflow_theme', next);
}`,
    },
    {
      id: 'css-variables',
      title: 'CSS Variables and Dark Mode',
      explanation: 'CSS custom properties (variables) are the secret to effortless dark mode. We define all colors as variables inside :root (the light theme). The dark theme overrides those same variables inside [data-theme="dark"]. When JavaScript toggles the data-theme attribute on the html element, every element that uses a CSS variable automatically switches to the dark values — no JavaScript color changes needed. We also use transition on body so the switch animates smoothly.',
      css: `:root {
  --bg: #f1f5f9;
  --surface: #ffffff;
  --border: #e2e8f0;
  --text: #0f172a;
  --text-muted: #64748b;
  --accent: #2563eb;
}

[data-theme="dark"] {
  --bg: #0f172a;
  --surface: #1e293b;
  --border: #334155;
  --text: #f1f5f9;
  --text-muted: #94a3b8;
  --accent: #2563eb; /* accent stays the same */
}

body {
  background: var(--bg);       /* switches automatically */
  color: var(--text);           /* switches automatically */
  transition: background 0.18s ease, color 0.18s ease;
}

/* Hide/show sun and moon icons based on theme */
[data-theme="light"] .icon-moon { display: none; }
[data-theme="dark"]  .icon-sun  { display: none; }`,
    },
    {
      id: 'filtering-sorting',
      title: 'Filtering, Searching, and Sorting',
      explanation: 'getFilteredTasks() is the core function that computes what to display. It chains multiple .filter() calls — one for status (active/completed/all), one for category, one for priority, and one for search text. Sorting uses Array.sort() with a comparison function. For priority sorting, we use a lookup object PRIORITY_ORDER that maps priority strings to numbers (high=0, medium=1, low=2) so we can compare them numerically. This pattern of deriving the visible list from raw data is exactly how React state and derived data works.',
      js: `var PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

function getFilteredTasks() {
  var filtered = tasks.slice(); // copy — never mutate original

  // 1. Status filter
  if (currentFilter === 'active')    filtered = filtered.filter(function(t) { return !t.completed; });
  if (currentFilter === 'completed') filtered = filtered.filter(function(t) { return t.completed; });

  // 2. Category filter
  if (currentCategory) filtered = filtered.filter(function(t) { return t.category === currentCategory; });

  // 3. Priority filter
  if (currentPriority) filtered = filtered.filter(function(t) { return t.priority === currentPriority; });

  // 4. Search (case-insensitive substring match)
  if (searchQuery) {
    var q = searchQuery.toLowerCase();
    filtered = filtered.filter(function(t) { return t.title.toLowerCase().indexOf(q) !== -1; });
  }

  // 5. Sort
  if (currentSort === 'priority') {
    filtered.sort(function(a, b) { return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]; });
  } else if (currentSort === 'duedate') {
    filtered.sort(function(a, b) {
      if (!a.dueDate) return 1;  // tasks without due date go to bottom
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    });
  } else if (currentSort === 'name') {
    filtered.sort(function(a, b) { return a.title.localeCompare(b.title); });
  }

  return filtered;
}`,
    },
    {
      id: 'dom-rendering',
      title: 'Dynamic DOM Rendering',
      explanation: 'renderTasks() rebuilds the entire task list from scratch every time data changes. This is the same pattern React uses — derive the UI from state. For each task, we create DOM elements with createElement(), set their properties, attach event listeners directly to each button, and append them to the list. The task card gets a data-priority attribute which CSS uses to show the colored left border. The task-actions div is hidden with opacity:0 and revealed on hover via CSS, keeping JavaScript clean of any hover logic.',
      js: `function renderTasks() {
  var list = document.getElementById('taskList');
  var filtered = getFilteredTasks();

  list.innerHTML = ''; // clear current list

  filtered.forEach(function(task) {
    // Create the card container
    var card = document.createElement('div');
    card.className = 'task-card' + (task.completed ? ' completed' : '');
    card.setAttribute('data-priority', task.priority); // CSS uses this for colored border

    // Checkbox
    var cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.className = 'task-check';
    cb.checked = task.completed;
    cb.addEventListener('change', function() { toggleTask(task.id); });

    // Title (double-click to edit inline)
    var titleEl = document.createElement('div');
    titleEl.className = 'task-title';
    titleEl.textContent = task.title;
    titleEl.addEventListener('dblclick', function() { startEdit(task.id, titleEl); });

    // Delete button
    var delBtn = document.createElement('button');
    delBtn.className = 'btn-icon delete';
    delBtn.addEventListener('click', function() { deleteTask(task.id); });

    card.appendChild(cb);
    card.appendChild(titleEl);
    card.appendChild(delBtn);
    list.appendChild(card);
  });
}`,
    },
    {
      id: 'inline-editing',
      title: 'Inline Editing with contenteditable',
      explanation: 'The contenteditable attribute turns any HTML element into an editable text field — no extra input element needed. When the user double-clicks a task title, we set contenteditable="true", focus it, and move the cursor to the end. When they press Enter or click elsewhere (blur event), we read the new text, update the task object, and save. If they press Escape, we restore the original text. The { once: true } option automatically removes the event listener after it fires once, preventing memory leaks.',
      js: `function startEdit(id, el) {
  el.setAttribute('contenteditable', 'true'); // make it editable
  el.focus();

  // Move cursor to end of text
  var range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);

  function finish() {
    el.removeAttribute('contenteditable'); // back to read-only
    var newText = el.textContent.trim();
    if (newText) {
      var task = tasks.find(function(t) { return t.id === id; });
      if (task) { task.title = newText; saveTasks(); }
    }
    renderAll(); // re-render to reflect change
  }

  // { once: true } = listener removes itself after firing
  el.addEventListener('blur', finish, { once: true });
  el.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); el.blur(); }
    if (e.key === 'Escape') {
      // Restore original text on Escape
      el.textContent = tasks.find(function(t){ return t.id === id; }).title;
      el.blur();
    }
  }, { once: true });
}`,
    },
    {
      id: 'complete-project',
      title: 'The Complete Task Manager',
      explanation: 'Here is the full script.js. The app follows a clear architecture: data lives in the tasks array and state variables. saveTasks/loadTasks handle persistence. getFilteredTasks() computes the visible list. renderAll() updates both the stats bar and task list. Event listeners delegate all user actions. The init() function boots everything up by loading data, attaching listeners, and rendering. This is the same Model-View pattern you will find in React, Vue, and Angular — just without a framework.',
      js: scriptJs,
    },
  ],
  challenges: [
    {
      id: 'c1',
      title: 'Add Drag-and-Drop Reordering',
      difficulty: 'medium',
      description: 'Allow users to drag task cards to reorder them. The new order should persist in localStorage.',
      hint: 'Add draggable="true" to each card. Use dragstart, dragover, and drop events. Track the dragged task id. On drop, splice the tasks array to move the dragged task to the new position, then save and re-render.',
    },
    {
      id: 'c2',
      title: 'Add Subtasks',
      difficulty: 'medium',
      description: 'Allow each task to have a list of subtasks. Show a mini progress bar on each card showing how many subtasks are done.',
      hint: 'Add a subtasks array to the task object. Add a collapse/expand button on each card. The subtask mini-progress is subtasks.filter(s => s.done).length / subtasks.length * 100.',
    },
    {
      id: 'c3',
      title: 'Add Recurring Tasks',
      difficulty: 'hard',
      description: 'Allow tasks to repeat daily, weekly, or monthly. When a recurring task is completed, automatically create the next occurrence.',
      hint: 'Add a recurrence field to the task object. In toggleTask(), if task.completed is true and task.recurrence is set, create a new task with the same fields but with the dueDate advanced by the recurrence interval.',
    },
    {
      id: 'c4',
      title: 'Export and Import Tasks',
      difficulty: 'medium',
      description: 'Add Export as JSON and Import from JSON buttons so users can back up and restore their tasks.',
      hint: 'Export: JSON.stringify the tasks array, create a Blob, trigger a download. Import: use a file input element, FileReader API to read the JSON file, JSON.parse the result, merge or replace the current tasks array.',
    },
    {
      id: 'c5',
      title: 'Add Desktop Notifications',
      difficulty: 'hard',
      description: 'Show a browser notification when a task is due today. Ask for notification permission when the user first opens the app.',
      hint: 'Use Notification.requestPermission(). On init, check tasks where dueDate equals today and completed is false. For each, call new Notification("Task due today", { body: task.title }). Use setTimeout to remind at the start of each day.',
    },
  ],
};
