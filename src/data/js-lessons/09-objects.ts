import type { JSLesson } from '../js-curriculum';

export const jsObjectsLesson: JSLesson = {
  id: 'js-objects-complete',
  title: 'Objects - Complete Guide',
  slug: 'objects',
  chapter: 'data',
  order: 10,
  difficulty: 'beginner',
  readingTime: 16,
  description: 'Master JavaScript objects - creation, access, methods, destructuring, spread, Object methods, and JSON.',
  sections: [
    {
      type: 'text',
      content: 'Objects are the most important data structure in JavaScript. Everything is either a primitive or an object. Objects store key-value pairs called properties. In modern JavaScript - React props, API responses, MongoDB documents, Express requests - everything is an object.',
    },
    { type: 'heading', content: 'Creating and Accessing Objects' },
    {
      type: 'example',
      title: 'Object basics',
      content: 'Objects store related data together as key-value pairs. Access properties with dot notation (user.name) for known keys, or bracket notation (user["name"]) when the key is a variable. You can add, modify, and delete properties at any time.',
      language: 'javascript',
      code: `// Object literal
const user = {
  id: 1,
  name: "Alex",
  email: "alex@example.com",
  age: 25,
  address: { city: "New York", country: "USA" },
  hobbies: ["coding", "reading"]
};

// Dot notation
console.log(user.name);         // "Alex"
console.log(user.address.city); // "New York"

// Bracket notation - for dynamic keys
const key = "name";
console.log(user[key]);         // "Alex"

// Modify, add, delete
user.age = 26;
user.phone = "+1234567890";
delete user.phone;

// Check existence
console.log("name" in user);              // true
console.log(user.hasOwnProperty("email")); // true`,
    },
    { type: 'heading', content: 'Object Methods' },
    {
      type: 'example',
      title: 'Functions inside objects',
      content: 'Methods are functions stored as object properties. Inside a method, "this" refers to the object the method is called on. Returning "this" enables method chaining - calling multiple methods in a single expression.',
      language: 'javascript',
      code: `const calculator = {
  value: 0,
  add(n)      { this.value += n; return this; },
  subtract(n) { this.value -= n; return this; },
  multiply(n) { this.value *= n; return this; },
  reset()     { this.value = 0;  return this; },
  result()    { return this.value; }
};

// Method chaining
const answer = calculator.add(10).multiply(3).subtract(5).result();
console.log(answer); // 25

const person = {
  firstName: "Alex",
  lastName: "Smith",
  age: 25,
  getFullName() { return \`\${this.firstName} \${this.lastName}\`; },
  greet()       { return \`Hi! I'm \${this.firstName}, \${this.age} years old.\`; },
  birthday()    { this.age++; return \`Happy birthday! Now \${this.age}.\`; }
};

console.log(person.getFullName()); // "Alex Smith"
console.log(person.greet());
console.log(person.birthday());`,
    },
    { type: 'heading', content: 'Object Destructuring' },
    {
      type: 'example',
      title: 'Extract properties cleanly',
      content: 'Destructuring pulls properties into variables in one line. Rename with (name: userName), set defaults with (role = "user"), and destructure nested objects inline. Used everywhere in React - props are always destructured.',
      language: 'javascript',
      code: `const user = { id:1, name:"Alex", email:"alex@example.com", age:25, address:{ city:"NYC" } };

// Basic
const { name, email, age } = user;

// Rename
const { name: userName } = user;

// Default values
const { role = "user", score = 0 } = user;

// Nested
const { address: { city } } = user;

// Rest
const { id, name: nm, ...rest } = user;
console.log(rest); // { email, age, address }

// Function params - common in React
function renderUser({ name, email, role = "user" }) {
  return \`\${name} (\${email}) - \${role}\`;
}
console.log(renderUser(user));`,
    },
    { type: 'heading', content: 'Spread, Clone, and Merge' },
    {
      type: 'example',
      title: 'Object spread and assignment',
      content: 'Spread (...) creates a shallow copy or merges objects. In React you use it constantly to update state immutably. Warning: spread is shallow - nested objects are still shared references. Use structuredClone() for a deep copy.',
      language: 'javascript',
      code: `const defaults = { theme:"light", lang:"en", notifications:true };
const userPrefs = { theme:"dark", fontSize:16 };

// Merge - later properties win
const config = { ...defaults, ...userPrefs };
// { theme:"dark", lang:"en", notifications:true, fontSize:16 }

// Shallow clone
const original = { name:"Alex", score:100 };
const clone = { ...original };
clone.score = 200;
console.log(original.score); // 100 (unchanged)

// SHALLOW WARNING - nested objects are still shared
const user = { name:"Alex", address:{ city:"NYC" } };
const copy = { ...user };
copy.address.city = "LA";
console.log(user.address.city); // "LA" -- shared reference!

// Deep clone (ES2022)
const deepClone = structuredClone(user);
deepClone.address.city = "Paris";
console.log(user.address.city); // "LA" (unchanged)`,
    },
    { type: 'heading', content: 'Object Methods - keys, values, entries' },
    {
      type: 'example',
      title: 'Iterate and transform objects',
      content: 'Object.keys(), Object.values(), and Object.entries() convert an object into arrays you can loop and transform. Object.fromEntries() reverses the process. Together these four methods let you apply any array method to an object.',
      language: 'javascript',
      code: `const scores = { Alice:95, Bob:87, Carol:92, Dave:78, Eve:98 };

Object.keys(scores);    // ["Alice","Bob","Carol","Dave","Eve"]
Object.values(scores);  // [95, 87, 92, 78, 98]

const avg = Object.values(scores).reduce((a,b)=>a+b) / Object.keys(scores).length;
console.log("Average:", avg); // 90

// entries() for loops
Object.entries(scores).forEach(([name, score]) => {
  console.log(\`\${name}: \${score}\`);
});

// Sort by score descending
const sorted = Object.entries(scores)
  .sort(([,a],[,b]) => b-a)
  .map(([name,score]) => \`\${name}: \${score}\`);

// Transform values with fromEntries
const doubled = Object.fromEntries(
  Object.entries(scores).map(([k,v]) => [k, v*2])
);

// Object.assign - merge into target (mutates!)
const target = { a:1, b:2 };
Object.assign(target, { b:3, c:4 }); // { a:1, b:3, c:4 }

// Object.freeze - make immutable
const cfg = Object.freeze({ apiKey:"secret" });
cfg.apiKey = "hacked"; // silently ignored
console.log(cfg.apiKey); // "secret"`,
    },
    { type: 'heading', content: 'JSON' },
    {
      type: 'example',
      title: 'JSON.stringify and JSON.parse',
      content: 'JSON is the universal format for sending data between browser and server. JSON.stringify() converts an object to a string. JSON.parse() converts it back. Functions, undefined, and Symbols are dropped during stringify.',
      language: 'javascript',
      code: `const user = { id:1, name:"Alex", age:25, active:true, tags:["dev","student"] };

// Object to JSON string
const json = JSON.stringify(user);

// Pretty print
const pretty = JSON.stringify(user, null, 2);

// JSON string back to object
const parsed = JSON.parse(json);
console.log(parsed.name); // "Alex"

// Functions are dropped
const obj = { name:"Alex", greet: () => "hi" };
JSON.stringify(obj); // '{"name":"Alex"}' - greet removed

// Real-world: fetch
const response = await fetch("https://api.example.com/users");
const users = await response.json(); // JSON.parse automatically

// localStorage
localStorage.setItem("user", JSON.stringify(user));
const stored = JSON.parse(localStorage.getItem("user"));`,
    },
    {
      type: 'tryit',
      title: 'Contact Book',
      html: `<div id="app">
  <div class="topbar">
    <h2>📇 Contact Book</h2>
    <input id="search" placeholder="🔍 Search contacts..." oninput="render()">
  </div>
  <form id="form" onsubmit="saveContact(event)">
    <div class="form-grid">
      <input id="fName" placeholder="Full Name *" required>
      <input id="fPhone" placeholder="Phone" type="tel">
      <input id="fEmail" placeholder="Email" type="email">
      <select id="fTag">
        <option value="Work">💼 Work</option>
        <option value="Personal">👤 Personal</option>
        <option value="Family">🏠 Family</option>
        <option value="Other">📌 Other</option>
      </select>
    </div>
    <div class="form-actions">
      <button type="submit" id="saveBtn">+ Add Contact</button>
      <button type="button" id="cancelBtn" onclick="cancelEdit()" style="display:none">Cancel</button>
    </div>
  </form>
  <div id="tag-filters"></div>
  <div id="contacts-grid"></div>
</div>`,
      css: `*{box-sizing:border-box}body{font-family:system-ui,sans-serif;padding:16px;background:#f8fafc;margin:0;}
#app{max-width:640px;margin:0 auto;}
.topbar{display:flex;align-items:center;gap:12px;margin-bottom:12px;flex-wrap:wrap;}
h2{margin:0;font-size:18px;color:#1e293b;flex-shrink:0;}
#search{flex:1;min-width:180px;padding:8px 12px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:13px;outline:none;}
#search:focus{border-color:#6366f1;}
#form{background:white;border-radius:12px;padding:14px;margin-bottom:12px;border:1px solid #e2e8f0;}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;}
input,select{padding:8px 10px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:13px;outline:none;width:100%;}
input:focus,select:focus{border-color:#6366f1;}
.form-actions{display:flex;gap:8px;}
#saveBtn{padding:8px 18px;background:#6366f1;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:700;font-size:13px;}
#cancelBtn{padding:8px 14px;background:#f1f5f9;color:#475569;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:13px;}
#tag-filters{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;}
.tag-btn{padding:4px 12px;border-radius:999px;border:1.5px solid transparent;font-size:12px;font-weight:600;cursor:pointer;transition:all .1s;}
.tag-btn.active{border-color:currentColor;}
#contacts-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px;}
.card{background:white;border-radius:12px;padding:14px;border:1px solid #e2e8f0;position:relative;}
.card-avatar{width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:18px;margin-bottom:8px;color:white;}
.card-name{font-weight:700;font-size:14px;color:#1e293b;margin-bottom:2px;}
.card-phone{font-size:12px;color:#475569;margin-bottom:1px;}
.card-email{font-size:11px;color:#94a3b8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.card-tag{display:inline-block;margin-top:6px;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700;}
.card-actions{position:absolute;top:8px;right:8px;display:flex;gap:4px;opacity:0;transition:opacity .15s;}
.card:hover .card-actions{opacity:1;}
.icon-btn{background:none;border:none;cursor:pointer;font-size:14px;padding:3px 5px;border-radius:4px;}
.icon-btn:hover{background:#f1f5f9;}
.empty{text-align:center;color:#94a3b8;font-size:13px;padding:30px;grid-column:1/-1;}
.tag-Work{background:#dbeafe;color:#1d4ed8;}
.tag-Personal{background:#f0fdf4;color:#15803d;}
.tag-Family{background:#fef3c7;color:#a16207;}
.tag-Other{background:#f5f3ff;color:#6d28d9;}
.avatar-Work{background:#2563eb;}
.avatar-Personal{background:#16a34a;}
.avatar-Family{background:#d97706;}
.avatar-Other{background:#7c3aed;}`,
      js: `let contacts = [
  {id:1,name:'Alice Chen',phone:'+1 555-0101',email:'alice@company.com',tag:'Work'},
  {id:2,name:'Bob Martinez',phone:'+1 555-0202',email:'bob@gmail.com',tag:'Personal'},
  {id:3,name:'Carol Jones',phone:'+1 555-0303',email:'carol@family.net',tag:'Family'},
  {id:4,name:'Dave Kim',phone:'+1 555-0404',email:'dave@company.com',tag:'Work'},
  {id:5,name:'Eve Taylor',phone:'',email:'eve@gmail.com',tag:'Personal'},
];
let nextId=6, editId=null, activeTag='All';

const TAGS=['All','Work','Personal','Family','Other'];
const tagColors={'All':'#6366f1','Work':'#2563eb','Personal':'#16a34a','Family':'#d97706','Other':'#7c3aed'};

function initials(name){ return name.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase(); }

function saveContact(e) {
  e.preventDefault();
  const name=document.getElementById('fName').value.trim();
  const phone=document.getElementById('fPhone').value.trim();
  const email=document.getElementById('fEmail').value.trim();
  const tag=document.getElementById('fTag').value;
  if (!name) return;
  if (editId) {
    const i = contacts.findIndex(c=>c.id===editId);
    contacts[i] = {...contacts[i], name, phone, email, tag};
    editId=null;
  } else {
    contacts.push({id:nextId++,name,phone,email,tag});
  }
  document.getElementById('form').reset();
  document.getElementById('saveBtn').textContent='+ Add Contact';
  document.getElementById('cancelBtn').style.display='none';
  render();
}

function editContact(id) {
  const c=contacts.find(x=>x.id===id);
  document.getElementById('fName').value=c.name;
  document.getElementById('fPhone').value=c.phone;
  document.getElementById('fEmail').value=c.email;
  document.getElementById('fTag').value=c.tag;
  editId=id;
  document.getElementById('saveBtn').textContent='💾 Save';
  document.getElementById('cancelBtn').style.display='';
  document.getElementById('fName').focus();
}

function cancelEdit() {
  editId=null;
  document.getElementById('form').reset();
  document.getElementById('saveBtn').textContent='+ Add Contact';
  document.getElementById('cancelBtn').style.display='none';
}

function deleteContact(id) { contacts=contacts.filter(c=>c.id!==id); render(); }

function render() {
  const q=document.getElementById('search').value.toLowerCase();
  let list=contacts.filter(c=>{
    const matchTag=activeTag==='All'||c.tag===activeTag;
    const matchQ=!q||c.name.toLowerCase().includes(q)||c.email.toLowerCase().includes(q)||c.phone.includes(q);
    return matchTag&&matchQ;
  });
  list.sort((a,b)=>a.name.localeCompare(b.name));

  document.getElementById('tag-filters').innerHTML=TAGS.map(t=>{
    const count=t==='All'?contacts.length:contacts.filter(c=>c.tag===t).length;
    const active=t===activeTag?' active':'';
    return '<button class="tag-btn'+active+'" style="color:'+tagColors[t]+';background:'+(t===activeTag?tagColors[t]+'22':'white')+';border-color:'+(t===activeTag?tagColors[t]:'#e2e8f0')+'" onclick="setTag(&apos;'+t+'&apos;)">'+t+' ('+count+')</button>';
  }).join('');

  document.getElementById('contacts-grid').innerHTML = list.length ? list.map(c=>
    '<div class="card">' +
    '<div class="card-actions"><button class="icon-btn" onclick="editContact('+c.id+')">✏️</button><button class="icon-btn" onclick="deleteContact('+c.id+')">🗑️</button></div>' +
    '<div class="card-avatar avatar-'+c.tag+'">'+initials(c.name)+'</div>' +
    '<div class="card-name">'+c.name+'</div>' +
    (c.phone?'<div class="card-phone">'+c.phone+'</div>':'') +
    (c.email?'<div class="card-email">'+c.email+'</div>':'') +
    '<span class="card-tag tag-'+c.tag+'">'+c.tag+'</span>' +
    '</div>'
  ).join('') : '<div class="empty">No contacts found</div>';
}

function setTag(t){activeTag=t;render();}
window.saveContact=saveContact; window.editContact=editContact; window.cancelEdit=cancelEdit; window.deleteContact=deleteContact; window.setTag=setTag;
render();`,
      mode: 'full',
    },
  ],
  exercises: [
    {
      id: 'obj-1',
      question: 'What is shorthand property syntax in ES6?',
      type: 'multiple-choice',
      options: ['const obj = { name: name }', 'const obj = { name }', 'const obj = name:value', 'const { name } = obj'],
      correct: 1,
      explanation: 'When the property name and variable name match, use shorthand: { name } instead of { name: name }.',
    },
    {
      id: 'obj-2',
      question: 'What does structuredClone(obj) do?',
      type: 'multiple-choice',
      options: ['Shallow copies obj', 'Creates a deep clone - nested objects are fully independent', 'Freezes the object', 'Converts to JSON'],
      correct: 1,
      explanation: 'structuredClone() creates a deep clone. Changes to the clone do not affect the original, even for nested objects.',
    },
  ],
  quiz: [
    {
      id: 'qobj1',
      question: "Which method converts an object's entries back into an object?",
      options: ['Object.create()', 'Object.fromEntries()', 'Object.keys()', 'JSON.parse()'],
      correct: 1,
      explanation: 'Object.fromEntries() converts [key, value] pairs back into an object. It is the inverse of Object.entries().',
    },
    {
      id: 'qobj2',
      question: 'What is the difference between Object.freeze() and const?',
      options: ['No difference', 'const prevents variable reassignment; freeze() prevents property mutation', 'freeze() only works on arrays', 'const is stricter'],
      correct: 1,
      explanation: 'const prevents reassigning the variable. Object.freeze() prevents modifying properties on the object itself.',
    },
  ],
};
