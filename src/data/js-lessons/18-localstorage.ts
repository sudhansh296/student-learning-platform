import type { JSLesson } from '../js-curriculum';
export const jsLocalStorageLesson: JSLesson = {
  id:'js-localstorage',title:'localStorage & sessionStorage',slug:'localstorage',
  chapter:'dom',order:19,difficulty:'beginner',readingTime:8,
  description:'Store data in the browser with localStorage and sessionStorage — save settings, auth tokens, and user preferences.',
  sections:[
    {type:'text',content:'Browsers provide two storage mechanisms — localStorage (persists until cleared) and sessionStorage (cleared when tab closes). They store key-value pairs as strings. Perfect for themes, tokens, preferences, and form drafts.'},
    {type:'heading',content:'localStorage — Persistent Storage'},
    {type:'example',title:'localStorage basics',content:'localStorage stores key-value pairs in the browser permanently — they survive page refreshes, tab closes, and browser restarts. The catch: it only stores strings. To save objects or arrays, use JSON.stringify() when writing and JSON.parse() when reading. Wrap these in helper functions (lsGet/lsSet) to handle JSON errors gracefully and provide default values when a key is missing.',language:'javascript',code:`// localStorage survives page refresh, tab close, browser restart

// Store items — values MUST be strings
localStorage.setItem("theme", "dark");
localStorage.setItem("username", "Alex");
localStorage.setItem("lang", "en");

// Read items
const theme = localStorage.getItem("theme"); // "dark"
const missing = localStorage.getItem("nonexistent"); // null

// Remove items
localStorage.removeItem("lang");

// Clear everything
// localStorage.clear(); // use carefully!

// Store objects — must stringify/parse
const user = { id:1, name:"Alex", role:"admin" };
localStorage.setItem("user", JSON.stringify(user));
const stored = JSON.parse(localStorage.getItem("user") || "null");

// Helper functions for safety
function lsGet(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch { return defaultValue; }
}

function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch { return false; } // storage full
}

// Usage
lsSet("preferences", { theme:"dark", fontSize:16, notifications:true });
const prefs = lsGet("preferences", { theme:"light" });
console.log(prefs.theme); // "dark"`},
    {type:'heading',content:'sessionStorage — Tab-Only Storage'},
    {type:'example',title:'sessionStorage — cleared when tab closes',content:'sessionStorage has the exact same API as localStorage but a much shorter lifetime — it only exists while the browser tab is open. Close the tab and it is gone. Use sessionStorage for data that should NOT persist between visits: an unsaved form draft, a one-time welcome message, or a shopping cart for a guest user. The storage event fires when another tab changes localStorage — useful for syncing logout across tabs.',language:'javascript',code:`// Same API as localStorage — different lifetime
sessionStorage.setItem("formDraft", JSON.stringify({ title:"", body:"" }));
sessionStorage.getItem("formDraft");
sessionStorage.removeItem("formDraft");
sessionStorage.clear();

// Use cases:
// localStorage: auth tokens, theme, language, remember me
// sessionStorage: shopping cart (guest), form progress, one-time messages

// Listen for storage changes in OTHER tabs
window.addEventListener("storage", (event) => {
  console.log("Key changed:", event.key);
  console.log("Old value:", event.oldValue);
  console.log("New value:", event.newValue);
  // Useful for multi-tab sync (e.g., logout in all tabs)
  if (event.key === "authToken" && !event.newValue) {
    // User logged out in another tab — redirect to login
    window.location.href = "/login";
  }
});`},
    {type:'tryit',title:'Try It: localStorage',
     html:`<div id="app">
  <h2>localStorage Demo</h2>
  <div class="section">
    <h3>Theme Preference</h3>
    <button onclick="setTheme('light')">☀️ Light</button>
    <button onclick="setTheme('dark')">🌙 Dark</button>
    <p id="theme-status"></p>
  </div>
  <div class="section">
    <h3>Store Key-Value</h3>
    <div class="row">
      <input id="keyInput" placeholder="Key" value="myName"/>
      <input id="valInput" placeholder="Value" value="Alex"/>
      <button onclick="saveItem()">Save</button>
      <button onclick="readItem()">Read</button>
    </div>
    <p id="storage-result"></p>
  </div>
  <div class="section">
    <h3>All Stored Items</h3>
    <button onclick="showAll()">Show All</button>
    <button onclick="clearAll()" style="background:#dc2626">Clear All</button>
    <div id="all-items"></div>
  </div>
</div>`,
     css:`#app{font-family:system-ui,sans-serif;padding:20px;max-width:460px;}
h2{color:#1e1e1e;}h3{font-size:14px;font-weight:700;color:#374151;margin:0 0 8px;}
.section{background:white;border:1px solid #e5e7eb;border-radius:12px;padding:14px;margin-bottom:12px;}
.row{display:flex;gap:6px;flex-wrap:wrap;}
input{flex:1;padding:8px 10px;border:1.5px solid #e5e7eb;border-radius:7px;font-size:13px;outline:none;min-width:80px;}
button{padding:8px 14px;background:#2563eb;color:white;border:none;border-radius:7px;cursor:pointer;font-size:13px;font-weight:600;}
p{margin:8px 0 0;font-size:13px;color:#374151;font-family:monospace;}
.item{padding:6px 10px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;margin:4px 0;font-size:12px;font-family:monospace;display:flex;justify-content:space-between;}
.del{background:none;border:none;color:#ef4444;cursor:pointer;font-size:13px;padding:0;}`,
     js:`// Restore theme on load
const saved = localStorage.getItem('theme') || 'light';
document.getElementById('app').setAttribute('data-theme', saved);
document.getElementById('theme-status').textContent = 'Current theme: ' + saved + ' (saved in localStorage)';

function setTheme(t) {
  localStorage.setItem('theme', t);
  document.getElementById('app').setAttribute('data-theme', t);
  document.body.style.background = t === 'dark' ? '#1e1e1e' : '';
  document.body.style.color = t === 'dark' ? '#e5e7eb' : '';
  document.getElementById('theme-status').textContent = 'Theme set to: ' + t + ' ✅';
}

function saveItem() {
  const key = document.getElementById('keyInput').value.trim();
  const val = document.getElementById('valInput').value.trim();
  if (!key) return;
  localStorage.setItem(key, val);
  document.getElementById('storage-result').textContent = 'Saved: ' + key + ' = ' + val;
}

function readItem() {
  const key = document.getElementById('keyInput').value.trim();
  const val = localStorage.getItem(key);
  document.getElementById('storage-result').textContent =
    val !== null ? 'Found: ' + key + ' = ' + val : 'Not found: "' + key + '"';
}

function showAll() {
  const container = document.getElementById('all-items');
  container.innerHTML = '';
  if (!localStorage.length) { container.innerHTML = '<p>Storage is empty</p>'; return; }
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    const v = localStorage.getItem(k);
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = '<span><b>' + k + '</b>: ' + v.slice(0,40) + '</span><button class="del" onclick="removeItem('' + k + '')">✕</button>';
    container.appendChild(div);
  }
}

function removeItem(key) { localStorage.removeItem(key); showAll(); }
function clearAll() { localStorage.clear(); showAll(); document.getElementById('storage-result').textContent = 'Storage cleared'; }`,mode:'full'},
  ],
  exercises:[{id:'ls-1',question:'What is the difference between localStorage and sessionStorage?',type:'multiple-choice',options:['No difference','localStorage persists until manually cleared; sessionStorage is cleared when the browser tab is closed','sessionStorage is faster','localStorage only works with strings'],correct:1,explanation:'localStorage data persists across page refreshes, tab closes, and browser restarts. sessionStorage data is only available for the duration of the tab session — it is cleared when the tab is closed.'}],
  quiz:[{id:'qlk1',question:'Why must you use JSON.stringify/JSON.parse with localStorage?',options:['It is optional','localStorage only stores strings — stringify converts objects to strings, parse converts them back','JSON is faster','localStorage rejects non-JSON data'],correct:1,explanation:'localStorage can only store string values. To save objects or arrays, use JSON.stringify() to convert them to strings when saving, and JSON.parse() to convert them back to objects when reading.'}],
};
