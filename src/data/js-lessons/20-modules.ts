import type { JSLesson } from '../js-curriculum';
export const jsModulesLesson: JSLesson = {
  id:'js-modules',title:'Modules — import & export',slug:'modules',
  chapter:'es6',order:21,difficulty:'intermediate',readingTime:10,
  description:'Organize JavaScript with ES6 modules — named exports, default exports, re-exports, dynamic imports, and module patterns.',
  sections:[
    {type:'text',content:'Modules let you split your code across multiple files and import/export functionality between them. Every modern JavaScript application — React, Node.js, Vue — uses modules. Before modules, all JavaScript code shared one global scope, causing naming conflicts.'},
    {type:'heading',content:'Named Exports and Imports'},
    {type:'example',title:'math.js — exporting multiple items',content:'Named exports let you export multiple values from one file. Put the export keyword in front of any declaration, or export them all together at the bottom using export { name1, name2 }. You can also rename an export at the point of export with export { square as sq } — this is what the consumer will use as the import name.',language:'javascript',code:`// math.js — named exports
export const PI = 3.14159265358979;

export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }
export function multiply(a, b) { return a * b; }
export function divide(a, b) {
  if (b === 0) throw new Error("Division by zero");
  return a / b;
}

// Export after declaration
const GOLDEN_RATIO = 1.61803398875;
function square(n) { return n * n; }
export { GOLDEN_RATIO, square };

// Rename on export
export { square as sq };`},
    {type:'example',title:'app.js — importing named exports',content:'Import only the specific functions you need using { braces } — this is called a named import. You can rename any import with "as" to avoid naming conflicts: import { add as mathAdd }. Import everything with * as Namespace to access all exports under one object — useful when a module has many exports you need.',language:'javascript',code:`// Import specific named exports
import { add, multiply, PI } from "./math.js";
console.log(add(5, 3));       // 8
console.log(PI);              // 3.14159...

// Rename on import (avoid conflicts)
import { add as mathAdd } from "./math.js";

// Import everything as a namespace
import * as Math from "./math.js";
console.log(Math.add(5, 3));
console.log(Math.PI);`},
    {type:'heading',content:'Default Export — One Main Export'},
    {type:'example',title:'Default export — common in React components',content:'A default export is the "main thing" a module provides — each file can have only one. React components are always default exports. When importing a default export, you choose any name you want — no curly braces needed. You can mix a default and named exports in the same file, and import both in one line.',language:'javascript',code:`// userService.js — default export
export default class UserService {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.users = new Map();
  }

  async getUser(id) {
    const user = await fetch(\`\${this.apiUrl}/users/\${id}\`).then(r=>r.json());
    this.users.set(id, user);
    return user;
  }

  async createUser(data) {
    return fetch(\`\${this.apiUrl}/users\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(r => r.json());
  }
}

// Import default — any name you want
import UserService from "./userService.js";
import Service from "./userService.js"; // same thing, different name
const service = new UserService("https://api.example.com");

// Mix default + named imports
import UserService, { UserError, validateUser } from "./userService.js";`},
    {type:'heading',content:'Re-exports and Barrel Files'},
    {type:'example',title:'Index files for clean imports',content:'A barrel file (usually index.js) re-exports everything from multiple files in a folder. This gives consumers a single import path: import { capitalize, unique } from "./utils" instead of separate imports from separate files. This also makes refactoring easier — if you rename or move a file, you only update the barrel, not every file that imports from it.',language:'javascript',code:`// utils/string.js
export function capitalize(str) { return str[0].toUpperCase() + str.slice(1); }
export function truncate(str, n) { return str.length > n ? str.slice(0,n)+"..." : str; }

// utils/array.js
export function unique(arr) { return [...new Set(arr)]; }
export function chunk(arr, size) {
  return Array.from({length: Math.ceil(arr.length/size)}, (_,i) => arr.slice(i*size, i*size+size));
}

// utils/index.js — barrel file (re-exports everything)
export { capitalize, truncate } from "./string.js";
export { unique, chunk }        from "./array.js";
export { default as UserService } from "./userService.js"; // re-export default as named

// Now in your app:
import { capitalize, unique, UserService } from "./utils/index.js";
// Much cleaner than:
// import { capitalize } from "./utils/string.js"
// import { unique } from "./utils/array.js"`},
    {type:'heading',content:'Dynamic Imports — Load on Demand'},
    {type:'example',title:'Lazy loading modules',content:'Dynamic import() loads a module only when you actually need it, not at startup. This is called "code splitting" and makes your app load faster — heavy chart libraries, PDF exporters, or admin panels are only downloaded when the user navigates to that feature. import() returns a Promise so you use await with it. React.lazy() uses this pattern internally.',language:'javascript',code:`// Dynamic import() — returns a Promise
// Useful for code splitting and lazy loading

// Load module only when needed
button.addEventListener("click", async () => {
  const { renderChart } = await import("./chart.js");
  renderChart(data); // only loads chart.js when button is clicked
});

// Conditional loading
async function loadModule(condition) {
  const module = await import(condition ? "./moduleA.js" : "./moduleB.js");
  return module.default;
}

// Dynamic module name
async function loadPlugin(name) {
  const plugin = await import(\`./plugins/\${name}.js\`);
  return plugin.default;
}

// In React — React.lazy uses this under the hood
const HeavyComponent = React.lazy(() => import("./HeavyComponent"));`},
    {type:'tryit',title:'Try It: Module Pattern (simulated)',
     html:`<div id="app">
  <h2>Module Pattern Demo</h2>
  <p>Simulating modules with the revealing module pattern (browser compatible):</p>
  <div class="controls">
    <button onclick="cartModule.add('Laptop', 999)">Add Laptop $999</button>
    <button onclick="cartModule.add('Mouse', 29)">Add Mouse $29</button>
    <button onclick="cartModule.add('Keyboard', 79)">Add Keyboard $79</button>
    <button onclick="cartModule.clear()" style="background:#dc2626">Clear Cart</button>
  </div>
  <div id="cart-display"></div>
</div>`,
     css:`#app{font-family:system-ui,sans-serif;padding:20px;max-width:460px;}
h2{color:#1e1e1e;}p{color:#6b7280;font-size:13px;margin:0 0 12px;}
.controls{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:14px;}
button{padding:8px 14px;background:#2563eb;color:white;border:none;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;}
.item{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:6px;background:white;}
.item-name{font-size:14px;color:#1e1e1e;font-weight:600;}
.item-price{color:#059669;font-size:14px;font-weight:700;}
.del{background:none;border:none;color:#ef4444;cursor:pointer;font-size:16px;}
.total{background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:12px 14px;font-weight:700;color:#1d4ed8;text-align:right;}`,
     js:`// Module pattern — simulates ES6 module with private state
const cartModule = (() => {
  // Private state — cannot be accessed outside
  const _items = [];

  // Private helper
  function _render() {
    const container = document.getElementById('cart-display');
    if (!_items.length) { container.innerHTML = '<p style="color:#9ca3af;text-align:center;padding:20px">Cart is empty</p>'; return; }
    container.innerHTML = _items.map((item,i) =>
      '<div class="item"><span class="item-name">'+item.name+'</span>' +
      '<div style="display:flex;align-items:center;gap:12px">' +
      '<span class="item-price">$'+item.price+'</span>' +
      '<button class="del" onclick="cartModule.remove('+i+')">✕</button></div></div>'
    ).join('') +
    '<div class="total">Total: $' + _items.reduce((s,i) => s+i.price, 0) + ' (' + _items.length + ' items)</div>';
  }

  // Public API
  return {
    add(name, price) { _items.push({name, price}); _render(); },
    remove(index) { _items.splice(index,1); _render(); },
    clear() { _items.length = 0; _render(); },
    getTotal() { return _items.reduce((s,i)=>s+i.price,0); },
    getCount() { return _items.length; },
    // _items is private — cartModule._items is undefined!
  };
})();`,mode:'full'},
  ],
  exercises:[{id:'mod-1',question:'What is a "barrel file" in JavaScript modules?',type:'multiple-choice',options:['A file that is very large','An index.js that re-exports from multiple files for cleaner imports','A file with no exports','A minified module'],correct:1,explanation:'A barrel file (usually index.js) re-exports items from multiple modules. Instead of importing from specific paths, you import everything from the barrel. This makes refactoring easier and keeps import statements clean.'}],
  quiz:[{id:'qmod1',question:'What does a dynamic import() return?',options:['The module directly','A Promise that resolves to the module','undefined until loaded','A callback'],correct:1,explanation:'import() is a function that returns a Promise. When the module finishes loading, the Promise resolves with the module exports. This enables code splitting — only loading modules when they are actually needed.'}],
};
