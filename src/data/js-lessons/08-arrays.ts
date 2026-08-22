import type { JSLesson } from '../js-curriculum';

export const jsArraysLesson: JSLesson = {
  id: 'js-arrays-complete', title: 'Arrays — Complete Guide', slug: 'arrays',
  chapter: 'data', order: 9, difficulty: 'beginner', readingTime: 16,
  description: 'Master JavaScript arrays — creation, all methods, destructuring, spread, sorting, searching, and real-world patterns.',
  sections: [
    { type: 'text', content: 'Arrays are ordered lists of values. In JavaScript, arrays can hold any mix of types — numbers, strings, objects, even other arrays. Arrays are everywhere: lists of users, API responses, React state, database results — mastering array methods is one of the most important skills for a JavaScript developer.' },
    { type: 'heading', content: 'Creating Arrays' },
    { type: 'example', title: 'Ways to create arrays', language: 'javascript',       content: 'JavaScript provides several ways to create arrays. The array literal [] is always preferred. Array.from() converts iterables (strings, Sets, NodeLists) to arrays and can generate ranges. Array.from({length:5},(_,i)=>i+1) creates [1,2,3,4,5]. The .at() method accepts negative indices — .at(-1) gets the last element cleanly.',
      code: `// Array literal — always use this
const fruits   = ["apple", "banana", "cherry"];
const numbers  = [1, 2, 3, 4, 5];
const mixed    = [1, "hello", true, null, { id: 1 }];
const empty    = [];

// Array.from() — create from iterables or generate
const fromStr  = Array.from("hello");         // ["h","e","l","l","o"]
const fromSet  = Array.from(new Set([1,2,2,3])); // [1,2,3]
const range    = Array.from({length:5}, (_,i) => i+1); // [1,2,3,4,5]
const zeros    = Array.from({length:3}, () => 0);      // [0,0,0]

// Array.of()
const nums = Array.of(1, 2, 3); // [1, 2, 3]

// Spread to create copies
const copy = [...fruits]; // new array, not a reference

// Accessing elements
console.log(fruits[0]);                   // "apple"
console.log(fruits[fruits.length - 1]);   // "cherry" (last)
console.log(fruits.at(-1));               // "cherry" (ES2022, cleaner)
console.log(fruits.at(-2));               // "banana"`, output: 'apple | cherry | o | [h,e,l,l,o] | [1,2,3,4,5]' },
    { type: 'heading', content: 'Adding and Removing Elements' },
    { type: 'example', title: 'Mutating array methods', content: 'These methods CHANGE the original array in place. push() adds to the end, pop() removes from the end. unshift() adds to the start, shift() removes from the start. splice() is the most flexible — it can remove, insert, or replace at any position. Important: sort() and reverse() also mutate — use [...array].sort() to avoid changing the original.', language: 'javascript', code: `const arr = [1, 2, 3, 4, 5];

// Add/remove at END
arr.push(6, 7);          // [1,2,3,4,5,6,7] — add to end
const last = arr.pop();  // removes and returns 7 → arr: [1,2,3,4,5,6]

// Add/remove at START
arr.unshift(0);          // [0,1,2,3,4,5,6]
const first = arr.shift(); // removes and returns 0 → arr: [1,2,3,4,5,6]

// splice(start, deleteCount, ...itemsToInsert)
arr.splice(2, 1);        // remove 1 item at index 2 → [1,2,4,5,6]
arr.splice(2, 0, 3);     // insert 3 at index 2 → [1,2,3,4,5,6]
arr.splice(1, 2, 10,20); // replace 2 items starting at 1 → [1,10,20,4,5,6]

// Fill
const filled = new Array(5).fill(0);     // [0,0,0,0,0]
const partial = [1,2,3,4,5].fill(9,1,4); // [1,9,9,9,5]` },
    { type: 'heading', content: 'The Big 5 Array Methods (Used Daily)' },
    { type: 'example', title: 'map, filter, reduce, find, forEach', language: 'javascript',       content: 'These five methods are used in virtually every JavaScript project. map() transforms every element and returns a new array of the same length. filter() returns only elements that pass a test. reduce() accumulates everything into one value. find() returns the first match. forEach() runs code for each element but returns nothing.',
      code: `const users = [
  { id:1, name:"Alice", age:28, active:true,  role:"admin"  },
  { id:2, name:"Bob",   age:22, active:false, role:"user"   },
  { id:3, name:"Carol", age:35, active:true,  role:"editor" },
  { id:4, name:"Dave",  age:19, active:true,  role:"user"   },
];

// MAP — transform every item, returns same-length array
const names  = users.map(u => u.name);                 // ["Alice","Bob","Carol","Dave"]
const badges = users.map(u => ({ ...u, badge: u.role.toUpperCase() }));

// FILTER — keep items that pass the test
const active  = users.filter(u => u.active);            // [Alice, Carol, Dave]
const admins  = users.filter(u => u.role === "admin");  // [Alice]
const adults  = users.filter(u => u.age >= 21);         // [Alice, Carol]

// REDUCE — accumulate to a single value
const totalAge = users.reduce((sum, u) => sum + u.age, 0); // 104
const byRole = users.reduce((acc, u) => {
  (acc[u.role] ??= []).push(u.name);
  return acc;
}, {}); // { admin:["Alice"], user:["Bob","Dave"], editor:["Carol"] }

// FIND — first matching item (or undefined)
const alice = users.find(u => u.name === "Alice");      // { id:1, name:"Alice", ... }
const bob   = users.find(u => u.id === 2);              // { id:2, name:"Bob", ... }

// FOREACH — run code for each (no return value)
users.forEach(u => console.log(u.name));

// Chaining
const activeAdminNames = users
  .filter(u => u.active && u.age > 20)
  .map(u => u.name.toUpperCase());
// ["ALICE", "CAROL"]`, output: 'Names:[Alice,Bob,Carol,Dave] | Active:[Alice,Carol,Dave] | TotalAge:104' },
    { type: 'heading', content: 'Searching and Testing' },
    { type: 'example', title: 'indexOf, includes, findIndex, some, every', content: 'These methods search an array and return information. includes() is the simplest — just true/false. indexOf() gives you the position. findIndex() finds the position of an object based on a condition. some() checks if at least one element passes. every() checks if ALL elements pass.', language: 'javascript', code: `const nums = [10, 20, 30, 40, 50];

// indexOf — returns index of first match, -1 if not found
console.log(nums.indexOf(30));        // 2
console.log(nums.indexOf(99));        // -1

// includes — true/false
console.log(nums.includes(30));       // true
console.log(nums.includes(99));       // false

// findIndex — index of first item that passes test
const users = [{ id:1, name:"Alice" }, { id:2, name:"Bob" }];
const idx = users.findIndex(u => u.id === 2); // 1

// some — true if AT LEAST ONE passes
const hasEven = nums.some(n => n % 2 === 0);     // true
const hasNeg  = nums.some(n => n < 0);            // false

// every — true if ALL pass
const allPos = nums.every(n => n > 0);             // true
const allEven = nums.every(n => n % 2 === 0);     // true` },
    { type: 'heading', content: 'Sorting Arrays' },
    { type: 'example', title: 'Sort strings, numbers, and objects', content: 'sort() without a comparator sorts alphabetically — which gives wrong results for numbers (10 sorts before 2). Always provide a comparator function: (a, b) => a - b for ascending numbers, (a, b) => b - a for descending. To sort objects, compare their properties. sort() mutates the array — use [...arr].sort() or .toSorted() for a copy.', language: 'javascript', code: `// String sort (default — alphabetical)
["banana","apple","cherry"].sort();
// ["apple","banana","cherry"]

// Number sort — MUST provide comparator!
[10,1,5,8,3].sort();          // [1,10,3,5,8] ← WRONG! (lexicographic)
[10,1,5,8,3].sort((a,b) => a-b); // [1,3,5,8,10] ← correct ascending
[10,1,5,8,3].sort((a,b) => b-a); // [10,8,5,3,1] ← descending

// Sort objects by property
const people = [
  { name:"Charlie", age:30 },
  { name:"Alice",   age:25 },
  { name:"Bob",     age:35 },
];
people.sort((a,b) => a.age - b.age);  // by age ascending
people.sort((a,b) => a.name.localeCompare(b.name)); // alphabetically

// Sort WITHOUT mutating original (toSorted is ES2023)
const sorted = [...people].sort((a,b) => a.age - b.age);

// Reverse
[1,2,3,4,5].reverse();          // [5,4,3,2,1] — MUTATES
[1,2,3,4,5].toReversed();       // [5,4,3,2,1] — new array (ES2023)` },
    { type: 'heading', content: 'Array Destructuring and Spread' },
    { type: 'example', title: 'Destructuring, spread, and flat', content: 'Destructuring pulls values out of arrays into named variables — const [first, ...rest] = arr gives you the first element and everything else. The spread operator (...) expands an array into individual elements, useful for copying and merging. flat() flattens nested arrays, and flatMap() does map then flat in one step.', language: 'javascript', code: `// Destructuring
const [a, b, c] = [10, 20, 30];
console.log(a, b, c); // 10 20 30

const [first, , third] = [1, 2, 3]; // skip middle
const [x=0, y=0] = [5];             // default values: x=5, y=0
const [head, ...tail] = [1,2,3,4,5]; // rest: head=1, tail=[2,3,4,5]

// Swap without temp variable!
let m = 1, n = 2;
[m, n] = [n, m];
console.log(m, n); // 2 1

// Spread operator
const arr1 = [1,2,3], arr2 = [4,5,6];
const combined = [...arr1, ...arr2];     // [1,2,3,4,5,6]
const extended = [...arr1, 99, ...arr2]; // [1,2,3,99,4,5,6]

// Spread with function args
const nums = [3,1,4,1,5,9];
console.log(Math.max(...nums)); // 9 (spread as individual args)

// flat and flatMap
const nested = [1, [2, 3], [4, [5, 6]]];
nested.flat();      // [1, 2, 3, 4, [5, 6]] (1 level)
nested.flat(2);     // [1, 2, 3, 4, 5, 6]   (2 levels)
nested.flat(Infinity); // fully flattened

// flatMap — map then flatten 1 level
const sentences = ["Hello World", "Foo Bar"];
sentences.flatMap(s => s.split(" ")); // ["Hello","World","Foo","Bar"]` },
    { type: 'tryit', title: 'Student Grade Book',
      html: `<div id="app">
  <div class="topbar">
    <div>
      <h2>📚 Student Grade Book</h2>
      <p class="sub">map · filter · reduce · sort — all in action</p>
    </div>
    <div class="sort-row">
      Sort: <select id="sortBy" onchange="renderTable()">
        <option value="name">Name</option>
        <option value="avg">Average</option>
        <option value="grade">Grade</option>
      </select>
    </div>
  </div>
  <form id="addForm" onsubmit="addStudent(event)">
    <input id="sName" placeholder="Student name" required>
    <input id="sScores" placeholder="Scores: 85,92,78" required>
    <button type="submit">+ Add</button>
  </form>
  <div id="stats"></div>
  <div id="table-wrap"></div>
</div>`,
      css: `*{box-sizing:border-box}body{font-family:system-ui,sans-serif;padding:16px;background:#f0f4ff;margin:0;}
#app{max-width:620px;margin:0 auto;}
.topbar{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;flex-wrap:wrap;gap:8px;}
h2{margin:0 0 2px;font-size:18px;color:#1e293b;}
.sub{margin:0;font-size:11px;color:#64748b;}
.sort-row{display:flex;align-items:center;gap:6px;font-size:12px;color:#475569;font-weight:600;}
select{padding:5px 8px;border:1px solid #e2e8f0;border-radius:6px;font-size:12px;}
#addForm{display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap;}
input{padding:8px 12px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:13px;flex:1;min-width:120px;outline:none;}
input:focus{border-color:#6366f1;}
#addForm button{padding:8px 16px;background:#6366f1;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:700;white-space:nowrap;}
#stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:12px;}
.stat-card{background:white;border-radius:10px;padding:10px 12px;text-align:center;border:1px solid #e2e8f0;}
.stat-val{font-size:22px;font-weight:800;color:#6366f1;}
.stat-lbl{font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:.05em;}
table{width:100%;border-collapse:collapse;background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.06);}
th{background:#6366f1;color:white;padding:8px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.05em;}
td{padding:9px 12px;font-size:13px;border-bottom:1px solid #f1f5f9;}
tr:last-child td{border-bottom:none;}
tr.top-row td{background:#f0fdf4;}
tr.bot-row td{background:#fff1f2;}
.grade{display:inline-block;padding:2px 8px;border-radius:999px;font-weight:700;font-size:12px;}
.grade-A{background:#dcfce7;color:#15803d;}
.grade-B{background:#dbeafe;color:#1d4ed8;}
.grade-C{background:#fef9c3;color:#a16207;}
.grade-D,.grade-F{background:#fee2e2;color:#b91c1c;}
.del-btn{background:none;border:none;cursor:pointer;color:#cbd5e1;font-size:14px;padding:2px 6px;}
.del-btn:hover{color:#ef4444;}`,
      js: `let students = [
  { id:1, name:'Alice Chen', scores:[92,88,95,90] },
  { id:2, name:'Bob Martinez', scores:[75,68,80,72] },
  { id:3, name:'Carol Jones', scores:[88,91,86,93] },
  { id:4, name:'David Kim', scores:[55,62,58,60] },
  { id:5, name:'Eve Taylor', scores:[98,96,99,97] },
];
let nextId = 6;

function avg(scores) { return scores.reduce((a,b)=>a+b,0)/scores.length; }

function gradeOf(average) {
  if (average >= 90) return 'A';
  if (average >= 80) return 'B';
  if (average >= 70) return 'C';
  if (average >= 60) return 'D';
  return 'F';
}

function addStudent(e) {
  e.preventDefault();
  const name = document.getElementById('sName').value.trim();
  const raw  = document.getElementById('sScores').value;
  const scores = raw.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n) && n >= 0 && n <= 100);
  if (!name || scores.length === 0) return;
  students.push({ id: nextId++, name, scores });
  document.getElementById('sName').value = '';
  document.getElementById('sScores').value = '';
  renderTable();
}

function deleteStudent(id) {
  students = students.filter(s => s.id !== id);
  renderTable();
}

function renderTable() {
  const sortBy = document.getElementById('sortBy').value;
  const withAvg = students.map(s => ({ ...s, avg: avg(s.scores), grade: gradeOf(avg(s.scores)) }));
  const sorted = [...withAvg].sort((a,b) => sortBy==='name' ? a.name.localeCompare(b.name) : sortBy==='avg' ? b.avg - a.avg : a.grade.localeCompare(b.grade));
  const topAvg = Math.max(...withAvg.map(s=>s.avg));
  const botAvg = Math.min(...withAvg.map(s=>s.avg));
  const classAvg = withAvg.reduce((s,x)=>s+x.avg,0)/withAvg.length || 0;
  const passing  = withAvg.filter(s=>s.avg>=60).length;

  document.getElementById('stats').innerHTML = [
    '<div class="stat-card"><div class="stat-val">' + withAvg.length + '</div><div class="stat-lbl">Students</div></div>',
    '<div class="stat-card"><div class="stat-val">' + classAvg.toFixed(1) + '</div><div class="stat-lbl">Class Avg</div></div>',
    '<div class="stat-card"><div class="stat-val">' + passing + '</div><div class="stat-lbl">Passing</div></div>',
    '<div class="stat-card"><div class="stat-val">' + gradeOf(classAvg) + '</div><div class="stat-lbl">Class Grade</div></div>',
  ].join('');

  document.getElementById('table-wrap').innerHTML =
    '<table><thead><tr><th>Name</th><th>Scores</th><th>Average</th><th>Grade</th><th></th></tr></thead><tbody>' +
    sorted.map(s => {
      const isTop = s.avg === topAvg, isBot = s.avg === botAvg && withAvg.length > 1;
      const cls = isTop ? 'top-row' : isBot ? 'bot-row' : '';
      const gradeC = 'grade grade-' + s.grade;
      return '<tr class="' + cls + '"><td>' + s.name + (isTop?' 🌟':isBot?' 📉':'') + '</td>' +
             '<td style="font-family:monospace;font-size:11px">[' + s.scores.join(', ') + ']</td>' +
             '<td><b>' + s.avg.toFixed(1) + '</b></td>' +
             '<td><span class="' + gradeC + '">' + s.grade + '</span></td>' +
             '<td><button class="del-btn" onclick="deleteStudent(' + s.id + ')">✕</button></td></tr>';
    }).join('') + '</tbody></table>';
}

window.addStudent = addStudent;
window.deleteStudent = deleteStudent;
renderTable();`,
      mode: 'full' },
  ],
  exercises: [
    { id: 'arr-1', question: 'Which method transforms every array element and returns a NEW array of the same length?', type: 'multiple-choice', options: ['filter()', 'map()', 'reduce()', 'forEach()'], correct: 1, explanation: 'map() creates a new array by applying a callback to every element. It always returns an array of the same length. forEach() is similar but returns undefined.' },
    { id: 'arr-2', question: 'What is the output of: [1,2,3,4,5].filter(n=>n>3).length', type: 'code-output', correct: '2', explanation: 'filter(n => n > 3) keeps only 4 and 5. The resulting array [4, 5] has length 2.' },
  ],
  quiz: [
    { id: 'qar1', question: 'Which array method would you use to find the total sum of all numbers?', options: ['map()', 'filter()', 'reduce()', 'sum()'], correct: 2, explanation: 'reduce() accumulates values: nums.reduce((acc, n) => acc + n, 0). The 0 is the initial accumulator value. reduce() can compute any single result from an array.' },
    { id: 'qar2', question: 'What does [...arr1, ...arr2] do?', options: ['Nests arr2 inside arr1', 'Creates a new merged array with all elements from both', 'Mutates arr1', 'Nothing — invalid syntax'], correct: 1, explanation: 'The spread operator (...) inside an array literal spreads the elements. [...arr1, ...arr2] creates a new array with all elements of arr1 followed by all elements of arr2.' },
  ],
};
