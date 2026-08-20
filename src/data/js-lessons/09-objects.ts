import type { JSLesson } from '../js-curriculum';

export const jsObjectsLesson: JSLesson = {
  id: 'js-objects-complete',
  title: 'Objects — Complete Guide',
  slug: 'objects',
  chapter: 'data',
  order: 10,
  difficulty: 'beginner',
  readingTime: 16,
  description: 'Master JavaScript objects — creation, access, methods, destructuring, spread, Object methods, and JSON.',
  sections: [
    { type: 'text', content: 'Objects are the most important data structure in JavaScript. Every API response, React prop, MongoDB document, and Express request body is an object. Objects store key-value pairs called properties.' },
    { type: 'heading', content: 'Creating and Accessing Objects' },
    {
      type: 'example', title: 'Object basics',
      content: 'Objects store related data as key-value pairs. Use dot notation (user.name) for known keys, bracket notation (user["name"]) for dynamic keys stored in variables. Properties can be added, modified, or deleted at any time.',
      language: 'javascript',
      code: `// Object literal
const user = {
  id: 1, name: "Alex", email: "alex@example.com", age: 25,
  address: { city: "New York" },
  hobbies: ["coding", "reading"]
};
console.log(user.name);          // "Alex"
console.log(user.address.city);  // "New York"
const key = "name";
console.log(user[key]);          // "Alex" — dynamic key
user.age = 26;                   // modify
user.phone = "+1234567890";      // add
delete user.phone;               // delete
console.log("name" in user);     // true
console.log(user.hasOwnProperty("email")); // true`, output: 'Alex | New York | coding | true | false | true',
    },
    { type: 'heading', content: 'Object Methods' },
    {
      type: 'example', title: 'Functions inside objects',
      content: 'Methods are functions stored as object properties. Inside a method, "this" refers to the calling object. Returning "this" from each method enables chaining — multiple methods called in sequence on one line.',
      language: 'javascript',
      code: `const calc = {
  value: 0,
  add(n)      { this.value += n; return this; },
  subtract(n) { this.value -= n; return this; },
  multiply(n) { this.value *= n; return this; },
  result()    { return this.value; }
};
console.log(calc.add(10).multiply(3).subtract(5).result()); // 25`,
    },
    { type: 'heading', content: 'Object Destructuring' },
    {
      type: 'example', title: 'Extract properties cleanly',
      content: 'Destructuring extracts multiple properties into variables in one line. Rename with (name: userName), set defaults with (role = "user"), and destructure nested objects inline. Used constantly in React — all component props are destructured.',
      language: 'javascript',
      code: `const user = { id:1, name:"Alex", email:"alex@example.com", age:25, address:{ city:"NYC" } };
const { name, email, age } = user;
const { name: userName } = user;         // rename
const { role = "user", score = 0 } = user; // defaults
const { address: { city } } = user;      // nested
const { id, name: nm, ...rest } = user;  // rest
function renderUser({ name, email, role = "user" }) {
  return \`\${name} (\${email}) — \${role}\`;
}`,
    },
    { type: 'heading', content: 'Spread, Clone, Merge' },
    {
      type: 'example', title: 'Object spread and assignment',
      content: 'Spread (...) merges objects or creates shallow copies. In React you use it to update state immutably. Spread is SHALLOW — nested objects are still shared references. Use structuredClone() for a true deep copy.',
      language: 'javascript',
      code: `const defaults = { theme:"light", lang:"en" };
const prefs    = { theme:"dark", fontSize:16 };
const config   = { ...defaults, ...prefs }; // merge, later wins

// Shallow clone
const clone = { ...defaults };

// SHALLOW WARNING
const user = { name:"Alex", address:{ city:"NYC" } };
const copy = { ...user };
copy.address.city = "LA";
console.log(user.address.city); // "LA" -- shared!

// Deep clone
const deep = structuredClone(user);
deep.address.city = "Paris";
console.log(user.address.city); // "LA" (unchanged)`,
    },
    { type: 'heading', content: 'Object.keys, values, entries' },
    {
      type: 'example', title: 'Iterate and transform objects',
      content: 'Object.keys/values/entries convert objects into arrays for looping. Object.fromEntries() reverses it. Together they let you apply map, filter, sort — any array method — to an object.',
      language: 'javascript',
      code: `const scores = { Alice:95, Bob:87, Carol:92 };
Object.keys(scores);    // ["Alice","Bob","Carol"]
Object.values(scores);  // [95, 87, 92]
const avg = Object.values(scores).reduce((a,b)=>a+b) / Object.keys(scores).length;
Object.entries(scores).forEach(([name, score]) => console.log(name, score));
const doubled = Object.fromEntries(
  Object.entries(scores).map(([k,v]) => [k, v*2])
);
const cfg = Object.freeze({ apiKey:"secret" });
cfg.apiKey = "x"; // ignored
console.log(cfg.apiKey); // "secret"`,
    },
    { type: 'heading', content: 'JSON' },
    {
      type: 'example', title: 'JSON.stringify and JSON.parse',
      content: 'JSON is the universal format for data exchange between browser and server. stringify() converts an object to a string, parse() converts it back. Functions and undefined values are silently dropped during stringify.',
      language: 'javascript',
      code: `const user = { id:1, name:"Alex", age:25, tags:["dev"] };
const json   = JSON.stringify(user);
const pretty = JSON.stringify(user, null, 2);
const parsed = JSON.parse(json);
console.log(parsed.name); // "Alex"
// Functions dropped:
JSON.stringify({ fn: () => {} }); // '{}'
// fetch pattern:
const res   = await fetch("/api/users");
const users = await res.json(); // auto-parses
// localStorage:
localStorage.setItem("user", JSON.stringify(user));
const stored = JSON.parse(localStorage.getItem("user"));`,
    },
    {
      type: 'tryit', title: 'Try It: Objects Explorer',
      html: `<div id="app">
  <h2>Object Builder</h2>
  <div class="form">
    <div class="field"><label>Name</label><input id="fname" value="Alex"/></div>
    <div class="field"><label>Age</label><input id="fage" type="number" value="25"/></div>
    <div class="field"><label>City</label><input id="fcity" value="New York"/></div>
    <div class="field"><label>Role</label>
      <select id="frole"><option>developer</option><option>designer</option><option>admin</option></select>
    </div>
    <button onclick="buildObj()">Build Object</button>
  </div>
  <div id="output"></div>
</div>`,
      css: `#app{font-family:system-ui,sans-serif;padding:20px;max-width:500px;}
h2{color:#1e1e1e;margin-bottom:16px;}
.form{background:white;border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin-bottom:12px;}
.field{display:flex;align-items:center;gap:10px;margin-bottom:10px;}
label{width:50px;font-size:13px;font-weight:600;color:#374151;}
input,select{flex:1;padding:8px 12px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:14px;outline:none;}
button{width:100%;padding:10px;background:#2563eb;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:700;font-size:14px;margin-top:4px;}
#output{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px;}
.card h4{font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#64748b;margin:0 0 8px;}
.card pre{font-size:11px;font-family:monospace;color:#334155;margin:0;white-space:pre-wrap;word-break:break-all;}`,
      js: `function buildObj() {
  const obj = {
    name: document.getElementById('fname').value,
    age: parseInt(document.getElementById('fage').value),
    city: document.getElementById('fcity').value,
    role: document.getElementById('frole').value,
    createdAt: new Date().toISOString(),
  };
  const { name, age, ...rest } = obj;
  document.getElementById('output').innerHTML =
    '<div class="card"><h4>JSON.stringify</h4><pre>' + JSON.stringify(obj,null,2) + '</pre></div>' +
    '<div class="card"><h4>Object.keys</h4><pre>' + JSON.stringify(Object.keys(obj),null,2) + '</pre></div>' +
    '<div class="card"><h4>Object.values</h4><pre>' + JSON.stringify(Object.values(obj),null,2) + '</pre></div>' +
    '<div class="card"><h4>Destructured</h4><pre>name: ' + name + ', age: ' + age + '</pre></div>';
}`,
      mode: 'full',
    },
  ],
  exercises: [
    { id:'obj-1', question:'What is shorthand property syntax?', type:'multiple-choice',
      options:['{ name: name }','{ name }','name:value','const { name } = obj'], correct:1,
      explanation:'When property name and variable name match, use shorthand { name } instead of { name: name }.' },
    { id:'obj-2', question:'What does structuredClone(obj) do?', type:'multiple-choice',
      options:['Shallow copy','Deep clone — nested objects are independent','Freeze','Convert to JSON'], correct:1,
      explanation:'structuredClone() creates a deep clone. Changes to the clone do not affect the original.' },
  ],
  quiz: [
    { id:'qobj1', question:"Which converts entries back to an object?",
      options:['Object.create()','Object.fromEntries()','Object.keys()','JSON.parse()'], correct:1,
      explanation:'Object.fromEntries() is the inverse of Object.entries().' },
    { id:'qobj2', question:'Difference between freeze() and const?',
      options:['Same','const prevents reassignment; freeze() prevents property mutation','freeze only for arrays','const is stricter'], correct:1,
      explanation:'const prevents reassigning the variable. freeze() prevents modifying object properties.' },
  ],
};