import type { Project } from './types';

const indexHtml = `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ExpenseFlow</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="app">

    <!-- Header -->
    <header class="app-header">
      <div class="header-inner">
        <span class="brand">ExpenseFlow</span>
        <div class="header-right">
          <span class="savings-label">Savings Rate: <strong id="savingsRate">0%</strong></span>
          <button class="theme-btn" id="themeBtn" title="Toggle dark mode">
            <svg class="sun-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            </svg>
            <svg class="moon-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Summary Cards -->
    <div class="cards-row">
      <div class="summary-card balance-card">
        <p class="card-label">Balance</p>
        <p class="card-val" id="balance">$0.00</p>
      </div>
      <div class="summary-card income-card">
        <p class="card-label">Income</p>
        <p class="card-val income-col" id="totalIncome">+$0.00</p>
      </div>
      <div class="summary-card expense-card">
        <p class="card-label">Expenses</p>
        <p class="card-val expense-col" id="totalExpenses">-$0.00</p>
      </div>
      <div class="summary-card count-card">
        <p class="card-label">Transactions</p>
        <p class="card-val purple-col" id="txCount">0</p>
      </div>
    </div>

    <!-- Add / Edit Form -->
    <div class="form-card">
      <h2 class="form-title" id="formTitle">Add Transaction</h2>
      <div class="form-row">
        <input type="text" id="txText" class="input-field" placeholder="Description" maxlength="80" autocomplete="off" required />
        <input type="number" id="txAmount" class="input-field amount-input" placeholder="Amount" min="0.01" step="0.01" required />
      </div>
      <div class="form-row">
        <select id="txType" class="select-field">
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <select id="txCategory" class="select-field">
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Housing">Housing</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Health">Health</option>
          <option value="Education">Education</option>
          <option value="Shopping">Shopping</option>
          <option value="Other">Other</option>
        </select>
        <input type="date" id="txDate" class="input-field date-input" />
        <input type="text" id="txNote" class="input-field note-input" placeholder="Note (optional)" maxlength="60" autocomplete="off" />
      </div>
      <div class="form-actions">
        <button class="btn-primary" id="submitBtn">Add Transaction</button>
        <button class="btn-ghost" id="cancelBtn" style="display:none;">Cancel</button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs-row">
      <button class="tab-btn active" data-tab="transactions">Transactions</button>
      <button class="tab-btn" data-tab="charts">Spending Chart</button>
    </div>

    <!-- TRANSACTIONS TAB -->
    <div id="tab-transactions" class="tab-content active">
      <!-- Filters -->
      <div class="filters-row">
        <div class="filter-pills" id="filterPills">
          <button class="pill active" data-filter="all">All</button>
          <button class="pill" data-filter="income">Income</button>
          <button class="pill" data-filter="expense">Expense</button>
        </div>
        <select id="catFilter" class="select-sm">
          <option value="">All Categories</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Housing">Housing</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Health">Health</option>
          <option value="Education">Education</option>
          <option value="Shopping">Shopping</option>
          <option value="Other">Other</option>
        </select>
        <input type="text" id="searchInput" class="search-input" placeholder="Search..." autocomplete="off" />
        <select id="sortBy" class="select-sm">
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="highest">Highest Amount</option>
          <option value="lowest">Lowest Amount</option>
        </select>
      </div>
      <!-- List -->
      <div id="txList" class="tx-list"></div>
      <div id="emptyState" class="empty-state" style="display:none;">No transactions match your filters.</div>
    </div>

    <!-- CHARTS TAB -->
    <div id="tab-charts" class="tab-content">
      <h3 class="chart-title">Spending by Category</h3>
      <div id="chartBars" class="chart-bars"></div>
      <div id="chartEmpty" class="empty-state" style="display:none;">No expense data yet.</div>
    </div>

  </div>
  <script src="script.js"></script>
</body>
</html>`;

const styleCss = `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#f5f3ff;--surface:#fff;--surface2:#f8f7ff;--border:#e4e1f5;
  --text:#1e1b4b;--muted:#6b7280;--soft:#9ca3af;
  --accent:#7c3aed;--accent2:#6d28d9;--accent-light:#ede9fe;
  --income:#16a34a;--income-bg:#f0fdf4;--income-border:#bbf7d0;
  --expense:#dc2626;--expense-bg:#fef2f2;--expense-border:#fecaca;
  --shadow:0 1px 3px rgba(0,0,0,0.07);--shadow-md:0 4px 16px rgba(0,0,0,0.10);
  --radius:12px;--radius-sm:7px;--tr:0.17s ease;
}
[data-theme="dark"]{
  --bg:#13111e;--surface:#1e1b2e;--surface2:#261f3a;--border:#312a52;
  --text:#f1f0ff;--muted:#a09db8;--soft:#6b6882;--accent-light:#2e1f5e;
  --income-bg:#052e16;--income-border:#166534;
  --expense-bg:#450a0a;--expense-border:#991b1b;
  --shadow:0 1px 3px rgba(0,0,0,.3);--shadow-md:0 4px 16px rgba(0,0,0,.4);
}
body{font-family:system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;transition:background var(--tr),color var(--tr);}
.app{max-width:860px;margin:0 auto;padding:0 0 40px;}
.app-header{background:linear-gradient(135deg,var(--accent),#2563eb);padding:13px 20px;margin-bottom:20px;}
.header-inner{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;}
.brand{font-size:1.25rem;font-weight:900;color:#fff;letter-spacing:-.5px;}
.header-right{display:flex;align-items:center;gap:12px;}
.savings-label{font-size:13px;color:rgba(255,255,255,.85);}
.savings-label strong{color:#fff;}
.theme-btn{width:32px;height:32px;border:1px solid rgba(255,255,255,.4);border-radius:50%;background:transparent;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all var(--tr);}
.theme-btn:hover{background:rgba(255,255,255,.15);}
[data-theme="light"] .moon-icon{display:none;}[data-theme="dark"] .sun-icon{display:none;}
.cards-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;padding:0 16px 16px;}
.summary-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:14px 16px;box-shadow:var(--shadow);}
.balance-card{border-top:3px solid var(--accent);}
.income-card{border-top:3px solid var(--income);}
.expense-card{border-top:3px solid var(--expense);}
.count-card{border-top:3px solid #7c3aed;}
.card-label{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px;}
.card-val{font-size:1.5rem;font-weight:900;line-height:1;}
.income-col{color:var(--income);}.expense-col{color:var(--expense);}.purple-col{color:#7c3aed;}
#balance.positive{color:var(--income);}#balance.negative{color:var(--expense);}
.form-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px 16px;margin:0 16px 16px;box-shadow:var(--shadow);}
.form-title{font-size:.8rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px;}
.form-row{display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap;}
.form-actions{display:flex;gap:8px;}
.input-field{flex:1;min-width:0;padding:8px 12px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:14px;font-family:inherit;background:var(--surface2);color:var(--text);outline:none;transition:border-color var(--tr);}
.input-field:focus{border-color:var(--accent);}
.input-field::placeholder{color:var(--soft);}
.amount-input{max-width:140px;}.date-input{max-width:155px;color-scheme:light dark;}
.note-input{flex:2;}
.select-field{padding:8px 10px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:13px;font-family:inherit;background:var(--surface2);color:var(--text);cursor:pointer;outline:none;transition:border-color var(--tr);}
.select-field:focus{border-color:var(--accent);}
.btn-primary{padding:9px 20px;background:var(--accent);color:#fff;border:none;border-radius:var(--radius-sm);font-weight:700;font-size:14px;cursor:pointer;transition:background var(--tr),transform var(--tr);}
.btn-primary:hover{background:var(--accent2);}.btn-primary:active{transform:scale(.97);}
.btn-ghost{padding:9px 14px;background:transparent;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:13px;color:var(--muted);cursor:pointer;transition:all var(--tr);}
.btn-ghost:hover{border-color:var(--expense);color:var(--expense);}
.tabs-row{display:flex;border-bottom:1px solid var(--border);padding:0 16px;margin-bottom:14px;}
.tab-btn{padding:9px 18px;border:none;background:transparent;font-size:13px;font-weight:600;color:var(--muted);cursor:pointer;border-bottom:2px solid transparent;transition:all var(--tr);}
.tab-btn.active{border-bottom-color:var(--accent);color:var(--accent);}
.tab-content{display:none;padding:0 16px;}
.tab-content.active{display:block;}
.filters-row{display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;align-items:center;}
.filter-pills{display:flex;gap:2px;background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:3px;}
.pill{padding:5px 13px;border:none;border-radius:5px;font-size:12px;font-weight:600;background:transparent;color:var(--muted);cursor:pointer;transition:all var(--tr);}
.pill.active{background:var(--surface);color:var(--accent);box-shadow:var(--shadow);}
.select-sm{padding:6px 8px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px;font-family:inherit;background:var(--surface);color:var(--text);cursor:pointer;outline:none;}
.search-input{flex:1;min-width:120px;padding:6px 10px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:13px;font-family:inherit;background:var(--surface);color:var(--text);outline:none;transition:border-color var(--tr);}
.search-input:focus{border-color:var(--accent);}
.search-input::placeholder{color:var(--soft);}
.tx-list{display:flex;flex-direction:column;gap:6px;}
.tx-row{display:flex;align-items:center;gap:10px;padding:11px 14px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);transition:all var(--tr);}
.tx-row:hover{box-shadow:var(--shadow-md);}
.tx-row.income-row{border-left:3px solid var(--income);}
.tx-row.expense-row{border-left:3px solid var(--expense);}
.cat-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0;}
.tx-body{flex:1;min-width:0;}
.tx-text{font-size:14px;font-weight:600;color:var(--text);margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.tx-meta{font-size:11px;color:var(--soft);}
.tx-amount{font-weight:800;font-size:15px;white-space:nowrap;}
.tx-actions{display:flex;gap:4px;opacity:0;transition:opacity var(--tr);}
.tx-row:hover .tx-actions{opacity:1;}
.btn-edit{padding:3px 9px;font-size:11px;background:var(--accent-light);color:var(--accent);border:1px solid var(--border);border-radius:5px;cursor:pointer;font-family:inherit;}
.btn-del{padding:3px 9px;font-size:11px;background:var(--expense-bg);color:var(--expense);border:1px solid var(--expense-border);border-radius:5px;cursor:pointer;font-family:inherit;}
.empty-state{padding:36px;text-align:center;color:var(--soft);font-size:14px;}
.chart-title{font-size:.8rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:16px;}
.chart-bars{display:flex;flex-direction:column;gap:14px;}
.bar-row{}
.bar-header{display:flex;justify-content:space-between;margin-bottom:5px;font-size:13px;}
.bar-cat{font-weight:700;}.bar-amt{color:var(--muted);}
.bar-track{height:10px;background:var(--surface2);border:1px solid var(--border);border-radius:5px;overflow:hidden;}
.bar-fill{height:100%;border-radius:5px;transition:width .5s ease;}
@media(max-width:580px){.form-row{flex-direction:column;}.amount-input,.date-input{max-width:100%;}.cards-row{grid-template-columns:1fr 1fr;}.filters-row{flex-direction:column;align-items:stretch;}}`;

const scriptJs = `// =====================================================
// ExpenseFlow - Full Expense Tracker
// Plain HTML/CSS/JS — no framework needed
// =====================================================

// -- DATA MODEL ----------------------------------------
var transactions = [];
var editId = null;
var filterStatus = 'all';
var filterCategory = '';
var searchQuery = '';
var sortMode = 'newest';
var activeTab = 'transactions';

var CAT_COLORS = {
  Food: '#f97316', Transport: '#3b82f6', Housing: '#8b5cf6',
  Entertainment: '#ec4899', Health: '#10b981', Education: '#0ea5e9',
  Shopping: '#f59e0b', Other: '#64748b'
};

var INITIAL = [
  { id:1,  text:'Monthly Salary',    amount:4500, type:'income',  category:'Other',         date:'2024-01-01', note:'Main job' },
  { id:2,  text:'Apartment Rent',    amount:1200, type:'expense', category:'Housing',       date:'2024-01-02', note:'Monthly rent' },
  { id:3,  text:'Grocery Shopping',  amount:180,  type:'expense', category:'Food',          date:'2024-01-05', note:'Weekly groceries' },
  { id:4,  text:'Freelance Project', amount:800,  type:'income',  category:'Other',         date:'2024-01-08', note:'React dashboard' },
  { id:5,  text:'Bus Monthly Pass',  amount:60,   type:'expense', category:'Transport',     date:'2024-01-10', note:'' },
  { id:6,  text:'Online Course',     amount:49,   type:'expense', category:'Education',     date:'2024-01-12', note:'Next.js course' },
  { id:7,  text:'Restaurant Dinner', amount:75,   type:'expense', category:'Food',          date:'2024-01-15', note:'Birthday' },
  { id:8,  text:'Netflix + Spotify', amount:28,   type:'expense', category:'Entertainment', date:'2024-01-18', note:'' },
  { id:9,  text:'Gym Membership',    amount:40,   type:'expense', category:'Health',        date:'2024-01-20', note:'' },
  { id:10, text:'Amazon Shopping',   amount:95,   type:'expense', category:'Shopping',      date:'2024-01-22', note:'Books' },
];

// -- INIT -----------------------------------------------
function init() {
  var saved = localStorage.getItem('ef_transactions');
  transactions = saved ? JSON.parse(saved) : INITIAL.slice();
  if (!saved) save();

  var savedTheme = localStorage.getItem('ef_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Set today as default date
  document.getElementById('txDate').value = new Date().toISOString().split('T')[0];

  attachListeners();
  renderAll();
}

// -- SAVE -----------------------------------------------
function save() {
  localStorage.setItem('ef_transactions', JSON.stringify(transactions));
}

// -- ADD / EDIT -----------------------------------------
function handleSubmit() {
  var text = document.getElementById('txText').value.trim();
  var amount = parseFloat(document.getElementById('txAmount').value);
  var type = document.getElementById('txType').value;
  var category = document.getElementById('txCategory').value;
  var date = document.getElementById('txDate').value;
  var note = document.getElementById('txNote').value.trim();

  if (!text || isNaN(amount) || amount <= 0) {
    document.getElementById('txText').style.borderColor = '#dc2626';
    setTimeout(function(){ document.getElementById('txText').style.borderColor = ''; }, 1200);
    return;
  }

  var tx = { id: editId || Date.now(), text: text, amount: amount, type: type, category: category, date: date, note: note };

  if (editId) {
    transactions = transactions.map(function(t){ return t.id === editId ? tx : t; });
  } else {
    transactions.unshift(tx);
  }

  save();
  resetForm();
  renderAll();
}

function startEdit(id) {
  var tx = transactions.find(function(t){ return t.id === id; });
  if (!tx) return;
  editId = id;
  document.getElementById('txText').value = tx.text;
  document.getElementById('txAmount').value = tx.amount;
  document.getElementById('txType').value = tx.type;
  document.getElementById('txCategory').value = tx.category;
  document.getElementById('txDate').value = tx.date;
  document.getElementById('txNote').value = tx.note;
  document.getElementById('formTitle').textContent = 'Edit Transaction';
  document.getElementById('submitBtn').textContent = 'Update';
  document.getElementById('cancelBtn').style.display = 'inline-flex';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteTransaction(id) {
  transactions = transactions.filter(function(t){ return t.id !== id; });
  save();
  renderAll();
}

function resetForm() {
  editId = null;
  document.getElementById('txText').value = '';
  document.getElementById('txAmount').value = '';
  document.getElementById('txType').value = 'expense';
  document.getElementById('txCategory').value = 'Food';
  document.getElementById('txDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('txNote').value = '';
  document.getElementById('formTitle').textContent = 'Add Transaction';
  document.getElementById('submitBtn').textContent = 'Add Transaction';
  document.getElementById('cancelBtn').style.display = 'none';
}

// -- FILTER & SORT --------------------------------------
function getFiltered() {
  var list = transactions.slice();

  if (filterStatus === 'income')  list = list.filter(function(t){ return t.type === 'income'; });
  if (filterStatus === 'expense') list = list.filter(function(t){ return t.type === 'expense'; });
  if (filterCategory) list = list.filter(function(t){ return t.category === filterCategory; });
  if (searchQuery) {
    var q = searchQuery.toLowerCase();
    list = list.filter(function(t){ return t.text.toLowerCase().indexOf(q) !== -1; });
  }

  if (sortMode === 'oldest')  list.sort(function(a,b){ return a.id - b.id; });
  if (sortMode === 'highest') list.sort(function(a,b){ return b.amount - a.amount; });
  if (sortMode === 'lowest')  list.sort(function(a,b){ return a.amount - b.amount; });

  return list;
}

// -- HELPERS --------------------------------------------
function fmt(n) { return '$' + n.toLocaleString('en-US', { minimumFractionDigits:2, maximumFractionDigits:2 }); }

// -- RENDER ---------------------------------------------
function renderAll() {
  renderSummary();
  renderList();
  renderChart();
}

function renderSummary() {
  var income   = transactions.filter(function(t){ return t.type === 'income'; }).reduce(function(s,t){ return s+t.amount; }, 0);
  var expenses = transactions.filter(function(t){ return t.type === 'expense'; }).reduce(function(s,t){ return s+t.amount; }, 0);
  var balance  = income - expenses;
  var rate     = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;

  var balEl = document.getElementById('balance');
  balEl.textContent = fmt(balance);
  balEl.className = 'card-val ' + (balance >= 0 ? 'positive' : 'negative');

  document.getElementById('totalIncome').textContent = '+' + fmt(income);
  document.getElementById('totalExpenses').textContent = '-' + fmt(expenses);
  document.getElementById('txCount').textContent = transactions.length;

  var rateEl = document.getElementById('savingsRate');
  rateEl.textContent = rate + '%';
  rateEl.style.color = rate >= 20 ? '#4ade80' : rate >= 0 ? '#fbbf24' : '#f87171';
}

function renderList() {
  var list = getFiltered();
  var container = document.getElementById('txList');
  var empty = document.getElementById('emptyState');

  if (list.length === 0) {
    container.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  container.innerHTML = '';

  list.forEach(function(tx) {
    var row = document.createElement('div');
    row.className = 'tx-row ' + (tx.type === 'income' ? 'income-row' : 'expense-row');

    var dot = document.createElement('span');
    dot.className = 'cat-dot';
    dot.style.background = CAT_COLORS[tx.category] || '#64748b';

    var body = document.createElement('div');
    body.className = 'tx-body';

    var textEl = document.createElement('p');
    textEl.className = 'tx-text';
    textEl.textContent = tx.text;

    var meta = document.createElement('p');
    meta.className = 'tx-meta';
    meta.textContent = tx.category + ' \u2022 ' + tx.date + (tx.note ? ' \u2014 ' + tx.note : '');

    body.appendChild(textEl);
    body.appendChild(meta);

    var amtEl = document.createElement('span');
    amtEl.className = 'tx-amount';
    amtEl.style.color = tx.type === 'income' ? 'var(--income)' : 'var(--expense)';
    amtEl.textContent = (tx.type === 'income' ? '+' : '-') + fmt(tx.amount);

    var actions = document.createElement('div');
    actions.className = 'tx-actions';

    var editBtn = document.createElement('button');
    editBtn.className = 'btn-edit';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', function(){ startEdit(tx.id); });

    var delBtn = document.createElement('button');
    delBtn.className = 'btn-del';
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', function(){ deleteTransaction(tx.id); });

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    row.appendChild(dot);
    row.appendChild(body);
    row.appendChild(amtEl);
    row.appendChild(actions);
    container.appendChild(row);
  });
}

function renderChart() {
  var expenses = transactions.filter(function(t){ return t.type === 'expense'; });
  var totalExp = expenses.reduce(function(s,t){ return s+t.amount; }, 0);
  var container = document.getElementById('chartBars');
  var empty = document.getElementById('chartEmpty');

  // Group by category
  var byCategory = {};
  expenses.forEach(function(t) {
    byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
  });

  var entries = Object.entries(byCategory).sort(function(a,b){ return b[1] - a[1]; });

  if (entries.length === 0) {
    container.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  container.innerHTML = '';

  entries.forEach(function(entry) {
    var cat = entry[0];
    var total = entry[1];
    var pct = totalExp > 0 ? Math.round((total / totalExp) * 100) : 0;

    var row = document.createElement('div');
    row.className = 'bar-row';

    var header = document.createElement('div');
    header.className = 'bar-header';
    header.innerHTML = '<span class="bar-cat">' + cat + '</span><span class="bar-amt">' + fmt(total) + ' (' + pct + '%)</span>';

    var track = document.createElement('div');
    track.className = 'bar-track';

    var fill = document.createElement('div');
    fill.className = 'bar-fill';
    fill.style.width = '0%';
    fill.style.background = CAT_COLORS[cat] || '#64748b';

    track.appendChild(fill);
    row.appendChild(header);
    row.appendChild(track);
    container.appendChild(row);

    // Animate bar width
    setTimeout(function(){ fill.style.width = pct + '%'; }, 50);
  });
}

// -- EVENT LISTENERS ------------------------------------
function attachListeners() {
  document.getElementById('submitBtn').addEventListener('click', handleSubmit);
  document.getElementById('txText').addEventListener('keydown', function(e){ if (e.key === 'Enter') handleSubmit(); });
  document.getElementById('cancelBtn').addEventListener('click', resetForm);

  // Tabs
  document.querySelectorAll('.tab-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.tab-btn').forEach(function(b){ b.classList.remove('active'); });
      document.querySelectorAll('.tab-content').forEach(function(c){ c.classList.remove('active'); });
      btn.classList.add('active');
      activeTab = btn.getAttribute('data-tab');
      document.getElementById('tab-' + activeTab).classList.add('active');
    });
  });

  // Filter pills
  document.getElementById('filterPills').addEventListener('click', function(e) {
    var pill = e.target.closest('.pill');
    if (!pill) return;
    document.querySelectorAll('.pill').forEach(function(p){ p.classList.remove('active'); });
    pill.classList.add('active');
    filterStatus = pill.getAttribute('data-filter');
    renderList();
  });

  document.getElementById('catFilter').addEventListener('change', function(){ filterCategory = this.value; renderList(); });
  document.getElementById('searchInput').addEventListener('input', function(){ searchQuery = this.value.trim(); renderList(); });
  document.getElementById('sortBy').addEventListener('change', function(){ sortMode = this.value; renderList(); });

  // Theme toggle
  document.getElementById('themeBtn').addEventListener('click', function() {
    var cur = document.documentElement.getAttribute('data-theme');
    var next = cur === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('ef_theme', next);
  });
}

init();`;

export const expenseTrackerProject: Project = {
  id: 'expense-tracker',
  slug: 'expense-tracker',
  title: 'Expense Tracker',
  difficulty: 'intermediate',
  type: 'frontend',
  estimatedTime: '6-8 hours',
  description: 'Build a full expense tracker with income/expense transactions, category breakdown bar charts, filters, search, sort, inline editing, dark mode, and localStorage persistence — all in plain HTML/CSS/JS.',
  technologies: ['HTML', 'CSS', 'JavaScript'],
  prerequisites: ['Basic HTML/CSS', 'DOM manipulation', 'localStorage basics', 'Array methods'],
  learnings: [
    'CRUD operations (Add, Edit, Delete)',
    'Derived state — computing totals from a data array',
    'Array filter, sort, reduce chaining',
    'localStorage persistence',
    'Dynamic DOM rendering from data',
    'CSS variables and dark mode',
    'Tab switching without a router',
    'Inline editing pattern',
    'Category grouping with reduce',
    'Animated CSS bar charts',
  ],
  features: [
    'Add income and expense transactions with category, date, and note',
    'Edit any transaction inline',
    'Delete transactions',
    'Filter by type (All/Income/Expense), category, search text',
    'Sort by newest, oldest, highest, lowest',
    'Live balance, income, expense totals, savings rate',
    'Category spending breakdown with animated bar chart',
    'Dark mode toggle saved to localStorage',
    'Full localStorage persistence',
    '10 pre-loaded demo transactions',
  ],
  fileStructure: 'expense-tracker/\n  index.html\n  style.css\n  script.js',
  overview: 'An expense tracker is the perfect intermediate project because it forces you to think about data architecture. You cannot store totals separately from transactions — they must be computed every time from the source array. This is the core rule of data management used in every financial app, React app, and database. Every technique here — filter chains, reduce for grouping, derived state, localStorage sync — is used daily in professional development.',
  objective: 'Build a complete expense tracker with CRUD, filters, category chart, dark mode, and localStorage using plain JavaScript.',
  nextProject: 'rest-api',
  files: [
    { path: 'expense-tracker/index.html', language: 'html',       content: indexHtml },
    { path: 'expense-tracker/style.css',  language: 'css',        content: styleCss  },
    { path: 'expense-tracker/script.js',  language: 'javascript', content: scriptJs  },
  ],
  lessons: [
    {
      id: 'data-model',
      title: 'The Data Model — One Source of Truth',
      explanation: 'The entire app is driven by a single transactions array. Each transaction has an id, text, amount, type (income/expense), category, date, and note. Balance, income total, expense total, savings rate, and category breakdown are ALL computed from this array — never stored separately. This is the most important principle in data management: if a value can be calculated from existing data, calculate it instead of storing it. Storing derived values creates sync bugs.',
      js: `// A transaction object — the single source of truth
var transaction = {
  id: Date.now(),        // unique identifier (timestamp)
  text: 'Grocery run',   // description
  amount: 85,            // always positive — type determines sign
  type: 'expense',       // 'income' | 'expense'
  category: 'Food',
  date: '2024-01-15',
  note: 'Weekly groceries'
};

// ALL totals are COMPUTED — never stored
var income   = transactions.filter(t => t.type === 'income')
                            .reduce((sum, t) => sum + t.amount, 0);
var expenses = transactions.filter(t => t.type === 'expense')
                            .reduce((sum, t) => sum + t.amount, 0);
var balance  = income - expenses;  // never store this separately!
var rate     = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;`,
    },
    {
      id: 'filter-sort',
      title: 'Filter, Search, and Sort',
      explanation: 'getFiltered() chains multiple .filter() calls on the transactions array. Each filter is independent — status filter, category filter, and search text filter all run in sequence, narrowing the list. Sorting uses Array.sort() with a comparator function. The key insight: we never modify the original array. We call .slice() to copy it first, then filter and sort the copy. This ensures the source data is never corrupted by display logic.',
      js: `function getFiltered() {
  var list = transactions.slice(); // COPY — never mutate original

  // 1. Filter by type
  if (filterStatus === 'income')  list = list.filter(t => t.type === 'income');
  if (filterStatus === 'expense') list = list.filter(t => t.type === 'expense');

  // 2. Filter by category
  if (filterCategory) list = list.filter(t => t.category === filterCategory);

  // 3. Search by text (case-insensitive)
  if (searchQuery) {
    var q = searchQuery.toLowerCase();
    list = list.filter(t => t.text.toLowerCase().includes(q));
  }

  // 4. Sort (newest = default, no sort needed since unshift adds to front)
  if (sortMode === 'highest') list.sort((a, b) => b.amount - a.amount);
  if (sortMode === 'lowest')  list.sort((a, b) => a.amount - b.amount);
  if (sortMode === 'oldest')  list.sort((a, b) => a.id - b.id);

  return list;
}`,
    },
    {
      id: 'category-chart',
      title: 'Category Breakdown Chart',
      explanation: 'The spending chart groups expense transactions by category using Array.reduce(). The accumulator is an object where each key is a category name and each value is the running total. Then we sort entries by total (descending) and render a bar for each. The bar width is calculated as (categoryTotal / grandTotal * 100)%. We set width to 0 first, then use setTimeout to trigger the CSS transition — this creates the animated fill-in effect on render.',
      js: `function renderChart() {
  var expenses = transactions.filter(t => t.type === 'expense');
  var totalExp = expenses.reduce((s, t) => s + t.amount, 0);

  // Group expenses by category using reduce
  var byCategory = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  // Sort by amount descending
  Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, total]) => {
      var pct = totalExp > 0 ? Math.round((total / totalExp) * 100) : 0;

      // Create bar element
      var fill = document.createElement('div');
      fill.style.width = '0%';  // start at 0 for animation
      fill.style.background = CAT_COLORS[cat];

      // CSS transition animates width from 0% to pct%
      setTimeout(() => { fill.style.width = pct + '%'; }, 50);
    });
}`,
    },
    {
      id: 'inline-edit',
      title: 'Inline Edit Pattern',
      explanation: 'Editing reuses the same Add form. startEdit() takes a transaction id, finds it in the array, and populates all form fields with its current values. It also updates the form title, button text, and reveals the Cancel button. On submit, if editId is set, we use Array.map() to replace the matching transaction instead of unshifting a new one. resetForm() clears editId and restores the form to add mode.',
      js: `var editId = null; // null = add mode, number = edit mode

function startEdit(id) {
  var tx = transactions.find(t => t.id === id);
  if (!tx) return;

  editId = id;  // switch to edit mode
  // Populate form fields with current values
  document.getElementById('txText').value = tx.text;
  document.getElementById('txAmount').value = tx.amount;
  document.getElementById('txType').value = tx.type;
  document.getElementById('txCategory').value = tx.category;
  document.getElementById('txDate').value = tx.date;
  document.getElementById('txNote').value = tx.note;

  // Update UI to show edit mode
  document.getElementById('formTitle').textContent = 'Edit Transaction';
  document.getElementById('submitBtn').textContent = 'Update';
  document.getElementById('cancelBtn').style.display = 'inline-flex';
}

function handleSubmit() {
  var tx = { id: editId || Date.now(), /* ...form values */ };

  if (editId) {
    // Replace the edited transaction using map
    transactions = transactions.map(t => t.id === editId ? tx : t);
  } else {
    // Prepend new transaction
    transactions.unshift(tx);
  }
  save(); resetForm(); renderAll();
}`,
    },
    {
      id: 'localstorage',
      title: 'localStorage Persistence',
      explanation: 'On first load, we check localStorage for saved transactions. If nothing is saved, we use the 10 demo transactions and immediately save them. After every change (add, edit, delete), we call save() which serializes the array to a JSON string. On reload, JSON.parse() converts the string back to an array. Dark mode preference is also saved separately with a simple string value.',
      js: `// Load on startup
function init() {
  var saved = localStorage.getItem('ef_transactions');
  if (saved) {
    transactions = JSON.parse(saved);  // restore saved data
  } else {
    transactions = INITIAL.slice();    // first visit: use demo data
    save();                            // immediately persist demo data
  }
  var theme = localStorage.getItem('ef_theme') || 'light';
  document.documentElement.setAttribute('data-theme', theme);
}

// Save after every data change
function save() {
  localStorage.setItem('ef_transactions', JSON.stringify(transactions));
}

// Theme toggle
document.getElementById('themeBtn').addEventListener('click', function() {
  var cur = document.documentElement.getAttribute('data-theme');
  var next = cur === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('ef_theme', next);
});`,
    },
    {
      id: 'complete',
      title: 'The Complete Expense Tracker',
      explanation: 'The full app runs entirely in the browser with no server or build step. All data lives in the transactions array. renderAll() recomputes and redraws everything from scratch on every change. Filters narrow the list before rendering. The chart groups by category using reduce. Dark mode flips CSS variables. localStorage persists everything across page reloads. This is the same data-flow architecture used in React, Vue, and every modern frontend framework.',
      js: scriptJs,
    },
  ],
  challenges: [
    {
      id: 'c1',
      title: 'Add Monthly Budget Limits',
      difficulty: 'medium',
      description: 'Let users set a monthly budget per category. Show a warning bar that turns red when spending exceeds 80% of the budget.',
      hint: 'Store budgets in localStorage as an object. In renderChart(), compare the category total to the budget. Add a budget-exceeded class when total/budget > 0.8 to change the bar color to red.',
    },
    {
      id: 'c2',
      title: 'Add Date Range Filter',
      difficulty: 'medium',
      description: 'Add start and end date pickers that filter the transaction list to only show transactions within the selected range.',
      hint: 'Add startDate and endDate variables. In getFiltered(), add .filter(t => t.date >= startDate && t.date <= endDate). Since dates are YYYY-MM-DD strings, string comparison works correctly.',
    },
    {
      id: 'c3',
      title: 'Export to CSV',
      difficulty: 'medium',
      description: 'Add an Export button that downloads all transactions as a .csv file that opens in Excel or Google Sheets.',
      hint: 'Build a CSV string: header + one row per transaction with values joined by commas. Wrap text values in quotes. Create a Blob({ type: "text/csv" }), URL.createObjectURL(), and an anchor with download="transactions.csv".',
    },
    {
      id: 'c4',
      title: 'Add a Monthly View',
      difficulty: 'hard',
      description: 'Group transactions by month and show a monthly summary — income, expenses, and balance for each month separately.',
      hint: 'Group transactions by transaction.date.substring(0, 7) to get YYYY-MM. Use reduce to build an object with month keys. Sort the months descending. Render one section per month with its own totals.',
    },
  ],
};
