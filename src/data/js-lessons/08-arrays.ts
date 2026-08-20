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
    { type: 'tryit', title: 'Try It: Array Methods Live',
      html: `<div id="app">
  <h2>Array Methods Explorer</h2>
  <p id="original"></p>
  <div class="btns">
    <button onclick="demo('map')">map() — double</button>
    <button onclick="demo('filter')">filter() — evens only</button>
    <button onclick="demo('reduce')">reduce() — sum</button>
    <button onclick="demo('find')">find() — first>5</button>
    <button onclick="demo('sort')">sort() — ascending</button>
    <button onclick="demo('chain')">chain (filter+map)</button>
  </div>
  <div id="result"></div>
  <h3 style="margin-top:16px">Custom Array Operations</h3>
  <input id="customInput" placeholder="Enter comma-separated numbers: 3,1,4,1,5,9">
  <button onclick="analyzeArray()" style="margin-top:6px">Analyze</button>
  <div id="analysis"></div>
</div>`,
      css: `#app{font-family:system-ui,sans-serif;padding:20px;max-width:520px;}
h2{color:#1e1e1e;margin-bottom:8px;}h3{font-size:14px;color:#374151;}
#original{background:#f1f5f9;padding:10px 14px;border-radius:8px;font-family:monospace;font-size:13px;margin-bottom:12px;}
.btns{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;}
button{padding:7px 14px;background:#2563eb;color:white;border:none;border-radius:7px;cursor:pointer;font-size:13px;font-weight:600;}
button:hover{background:#1d4ed8;}
#result{background:#f0fdf4;border:1px solid #86efac;padding:14px;border-radius:10px;font-family:monospace;font-size:13px;min-height:44px;}
input{width:100%;padding:9px 12px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:14px;outline:none;box-sizing:border-box;}
#analysis{background:#eff6ff;border:1px solid #bfdbfe;padding:14px;border-radius:10px;font-size:13px;margin-top:8px;line-height:1.8;}`,
      js: `const nums = [3,1,7,2,8,4,6,5,9,10];
document.getElementById('original').textContent = 'Original: [' + nums.join(', ') + ']';

const demos = {
  map:    {label:'map() → double',      fn: a => a.map(n=>n*2)},
  filter: {label:'filter() → evens',    fn: a => a.filter(n=>n%2===0)},
  reduce: {label:'reduce() → sum',      fn: a => [a.reduce((s,n)=>s+n,0)]},
  find:   {label:'find() → first > 5',  fn: a => [a.find(n=>n>5)]},
  sort:   {label:'sort() → ascending',  fn: a => [...a].sort((x,y)=>x-y)},
  chain:  {label:'filter evens then ×3',fn: a => a.filter(n=>n%2===0).map(n=>n*3)},
};

function demo(op) {
  const d = demos[op];
  const result = d.fn(nums);
  document.getElementById('result').textContent = d.label + ': [' + result.join(', ') + ']';
}

function analyzeArray() {
  const raw = document.getElementById('customInput').value;
  const arr = raw.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
  if (!arr.length) return;
  const sum   = arr.reduce((a,b)=>a+b,0);
  const avg   = (sum/arr.length).toFixed(2);
  const sorted = [...arr].sort((a,b)=>a-b);
  document.getElementById('analysis').innerHTML = [
    '<b>Array:</b> [' + arr.join(', ') + ']',
    '<b>Length:</b> ' + arr.length,
    '<b>Sum:</b> ' + sum,
    '<b>Average:</b> ' + avg,
    '<b>Min:</b> ' + Math.min(...arr) + ' · <b>Max:</b> ' + Math.max(...arr),
    '<b>Sorted:</b> [' + sorted.join(', ') + ']',
    '<b>Evens:</b> [' + arr.filter(n=>n%2===0).join(', ') + ']',
    '<b>Odds:</b> [' + arr.filter(n=>n%2!==0).join(', ') + ']',
  ].join('<br>');
}`,
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
