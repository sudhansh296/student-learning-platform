import type { JSLesson } from '../js-curriculum';

export const jsLoopsLesson: JSLesson = {
  id: 'js-loops', title: 'Loops', slug: 'loops', chapter: 'basics', order: 7,
  difficulty: 'beginner', readingTime: 12,
  description: 'Repeat code with for, while, do...while, for...of, and for...in loops. Plus break, continue, and loop patterns.',
  sections: [
    { type: 'text', content: 'Loops repeat a block of code multiple times. Instead of writing console.log() 100 times, you write a loop that runs 100 times. Loops are one of the most fundamental concepts in programming.' },
    { type: 'heading', content: 'for Loop' },
    { type: 'example', title: 'Classic for loop - when you know the count', content: 'A for loop repeats code a specific number of times. It has three parts: initialization (let i = 0 - where to start), condition (i < 5 - when to stop), and update (i++ - what to change each time). The variable i is called the "index" or "counter". You can loop forwards, backwards, or by any step size.', language: 'javascript', code: `// for (initialization; condition; update)
for (let i = 0; i < 5; i++) {
  console.log("Count:", i); // 0, 1, 2, 3, 4
}

// Count down
for (let i = 10; i >= 0; i--) {
  console.log(i);
}

// Step by 2
for (let i = 0; i <= 20; i += 2) {
  console.log(i); // 0, 2, 4, 6, ..., 20
}

// Loop through an array with index
const fruits = ["apple", "banana", "cherry", "date"];
for (let i = 0; i < fruits.length; i++) {
  console.log(i + ": " + fruits[i]);
}
// 0: apple, 1: banana, 2: cherry, 3: date`, output: 'Count:0 | Count:1 | Count:2 | Count:3 | Count:4' },
    { type: 'heading', content: 'while Loop' },
    { type: 'example', title: 'while - when you don\'t know how many times', content: 'A while loop keeps running as long as the condition is true. Use it when you do not know in advance how many times you need to loop - like reading user input until they type "quit", retrying a failed network request, or processing items until a queue is empty. Always make sure the condition will eventually become false, otherwise you get an infinite loop that crashes the browser.', language: 'javascript', code: `// Runs while condition is true
let count = 0;
while (count < 5) {
  console.log("Count:", count);
  count++; // IMPORTANT: must eventually make condition false to avoid infinite loop
}

// Real-world: keep trying until success
let attempts = 0;
let success = false;
while (!success && attempts < 3) {
  attempts++;
  console.log("Attempt", attempts);
  // Simulate 50% success chance
  success = Math.random() > 0.5;
}
console.log(success ? "Succeeded!" : "Failed after 3 attempts");

// User input loop (in browsers, use while loops carefully)
let input = "";
// while (input !== "quit") { input = prompt("Command?"); }` },
    { type: 'heading', content: 'for...of - Iterate Over Values' },
    { type: 'example', title: 'for...of - cleanest way to loop arrays', content: 'for...of is the modern way to loop through arrays and any iterable value (strings, Maps, Sets). It gives you the VALUE directly without needing an index. Combined with destructuring, it is extremely clean for looping arrays of objects. This is the loop you will use most often in React and Node.js code.', language: 'javascript', code: `// for...of gives you VALUES directly
const colors = ["red", "green", "blue"];
for (const color of colors) {
  console.log(color); // red, green, blue
}

// Works with strings too
for (const char of "hello") {
  console.log(char); // h, e, l, l, o
}

// With destructuring - very common in React/Node
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];
for (const { id, name } of users) {
  console.log(id, name); // 1 Alice, 2 Bob
}

// With Map
const scores = new Map([["Alice", 95], ["Bob", 87]]);
for (const [name, score] of scores) {
  console.log(name, score);
}

// entries() - get both index and value
for (const [index, color] of colors.entries()) {
  console.log(index, color); // 0 red, 1 green, 2 blue
}`, output: 'red | green | blue' },
    { type: 'heading', content: 'for...in - Iterate Over Object Keys' },
    { type: 'example', title: 'for...in - loop object properties', language: 'javascript',       content: 'for...in iterates over the enumerable property KEYS of an object as strings. It works on arrays too but is not recommended - it also picks up inherited prototype properties and gives string indexes instead of numbers. For arrays always use for...of or forEach. Use for...in only for plain objects.',
      code: `const person = { name: "Alex", age: 25, city: "NYC" };

for (const key in person) {
  console.log(key + ": " + person[key]);
}
// name: Alex
// age: 25
// city: NYC

// Better alternatives for objects:
Object.keys(person).forEach(key => console.log(key, person[key]));
Object.entries(person).forEach(([key, val]) => console.log(key, val));

// NOTE: for...in on arrays works but is not recommended
// Use for...of or forEach for arrays` },
    { type: 'heading', content: 'break and continue' },
    { type: 'example', title: 'Control loop flow with break and continue', content: 'break immediately exits the entire loop - no more iterations. continue skips the rest of the current iteration and jumps to the next one. Use break to stop as soon as you find what you are looking for (more efficient than looping everything). Use continue to skip items that do not meet a condition without nesting more if statements.', language: 'javascript', code: `// break - exit the loop immediately
for (let i = 0; i < 10; i++) {
  if (i === 5) break; // stop when i is 5
  console.log(i); // 0, 1, 2, 3, 4
}

// Real use: find first match
const numbers = [3, 7, 12, 8, 15, 2];
let firstEven;
for (const n of numbers) {
  if (n % 2 === 0) { firstEven = n; break; }
}
console.log("First even:", firstEven); // 12

// continue - skip this iteration, continue loop
for (let i = 0; i < 10; i++) {
  if (i % 2 === 0) continue; // skip even numbers
  console.log(i); // 1, 3, 5, 7, 9
}

// Labeled loops (break outer loop from inside inner loop)
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (i === 1 && j === 1) break outer; // breaks both loops!
    console.log(i, j);
  }
}` },
    { type: 'heading', content: 'Array Methods vs Loops' },
    { type: 'example', title: 'Modern array iteration - prefer these', content: 'Modern JavaScript has powerful array methods that replace most loops. map() transforms every item. filter() keeps only matching items. reduce() combines everything into one value. These methods are preferred over for loops in professional code because they clearly communicate intent - the name of the method tells you exactly what it does. They are also chainable, so you can combine multiple operations in a clean pipeline.', language: 'javascript', code: `const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// forEach - runs code for each element
numbers.forEach(n => console.log(n));

// map - transform each element, returns new array
const doubled = numbers.map(n => n * 2);
// [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// filter - keep elements that pass a test
const evens = numbers.filter(n => n % 2 === 0);
// [2, 4, 6, 8, 10]

// reduce - accumulate to one value
const sum = numbers.reduce((acc, n) => acc + n, 0);
// 55

// find - first element that matches
const firstOver5 = numbers.find(n => n > 5); // 6

// some - true if ANY element matches
const hasEven = numbers.some(n => n % 2 === 0); // true

// every - true if ALL elements match
const allPositive = numbers.every(n => n > 0); // true

// Chaining (very powerful):
const result = numbers
  .filter(n => n % 2 === 0)    // keep evens: [2,4,6,8,10]
  .map(n => n ** 2)             // square them: [4,16,36,64,100]
  .reduce((acc, n) => acc + n, 0); // sum: 220
console.log(result); // 220` },
    { type: 'tryit', title: 'Bubble Sort Visualizer',
      html: `<div id="app">
  <div class="header">
    <h2>Bubble Sort Visualizer</h2>
    <p class="subtitle">Watch loops and comparisons bring sorting to life</p>
  </div>
  <div class="controls">
    <button id="btn-new" onclick="generateArray()">🎲 New Array</button>
    <button id="btn-sort" onclick="startSort()">▶ Start Sort</button>
    <button id="btn-step" onclick="stepSort()">⏭ Step</button>
    <button id="btn-reset" onclick="resetSort()">↺ Reset</button>
  </div>
  <div class="stats">
    <span class="stat">Comparisons: <b id="comparisons">0</b></span>
    <span class="stat">Swaps: <b id="swaps">0</b></span>
    <span class="stat">Pass: <b id="pass">0</b></span>
    <span class="stat" id="status-text">Ready</span>
  </div>
  <div id="bars-container"></div>
  <div class="legend">
    <span class="dot comparing"></span> Comparing
    <span class="dot swapped"></span> Swapped
    <span class="dot sorted"></span> Sorted
    <span class="dot normal"></span> Unsorted
  </div>
  <div id="log"></div>
</div>`,
      css: `*{box-sizing:border-box}
body{font-family:system-ui,sans-serif;padding:16px;background:#f8fafc;margin:0;}
#app{max-width:600px;margin:0 auto;}
.header{text-align:center;margin-bottom:12px;}
h2{color:#1e293b;margin:0 0 4px;font-size:18px;}
.subtitle{color:#64748b;font-size:12px;margin:0;}
.controls{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;justify-content:center;}
button{padding:8px 16px;border:none;border-radius:8px;cursor:pointer;font-weight:700;font-size:13px;transition:all .15s;}
#btn-new{background:#6366f1;color:white;}
#btn-sort{background:#22c55e;color:white;}
#btn-step{background:#f59e0b;color:white;}
#btn-reset{background:#64748b;color:white;}
button:hover{filter:brightness(1.1);transform:translateY(-1px);}
button:disabled{opacity:.4;cursor:not-allowed;transform:none;}
.stats{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:12px;justify-content:center;}
.stat{background:white;border:1px solid #e2e8f0;border-radius:8px;padding:5px 12px;font-size:12px;color:#475569;}
.stat b{color:#1e293b;}
#status-text{background:#eff6ff;border-color:#bfdbfe;color:#1d4ed8;font-weight:600;}
#bars-container{display:flex;align-items:flex-end;gap:3px;height:160px;background:white;border-radius:12px;padding:12px;border:1px solid #e2e8f0;margin-bottom:10px;}
.bar{flex:1;border-radius:4px 4px 0 0;transition:height .2s,background .2s;position:relative;min-width:8px;}
.bar.normal{background:#94a3b8;}
.bar.comparing{background:#6366f1;}
.bar.swapped{background:#f59e0b;}
.bar.sorted{background:#22c55e;}
.bar-label{position:absolute;bottom:-18px;left:50%;transform:translateX(-50%);font-size:9px;color:#64748b;font-weight:600;}
.legend{display:flex;gap:12px;font-size:11px;color:#64748b;margin-bottom:8px;flex-wrap:wrap;justify-content:center;}
.dot{width:10px;height:10px;border-radius:2px;display:inline-block;margin-right:3px;}
.dot.comparing{background:#6366f1;}
.dot.swapped{background:#f59e0b;}
.dot.sorted{background:#22c55e;}
.dot.normal{background:#94a3b8;}
#log{background:#0d1117;color:#7dd3fc;font-family:monospace;font-size:11px;padding:8px 12px;border-radius:8px;max-height:80px;overflow-y:auto;white-space:pre-wrap;}`,
      js: `let arr = [], steps = [], stepIdx = 0, sortedUpto = -1, autoInterval = null, comparisons = 0, swaps = 0, pass = 0;

function generateArray() {
  stopAuto();
  arr = Array.from({length: 16}, () => Math.floor(Math.random() * 90) + 10);
  steps = []; stepIdx = 0; sortedUpto = -1; comparisons = 0; swaps = 0; pass = 0;
  updateStats(); setStatus('Ready - click Start Sort or Step');
  renderBars(arr, -1, -1);
  document.getElementById('log').textContent = '';
}

function buildSteps(a) {
  const s = [], n = a.length;
  const tmp = [...a];
  for (let p = 0; p < n - 1; p++) {
    let swapped = false;
    for (let i = 0; i < n - 1 - p; i++) {
      s.push({type:'compare', i, j:i+1, arr:[...tmp], pass:p+1});
      if (tmp[i] > tmp[i+1]) {
        [tmp[i],tmp[i+1]] = [tmp[i+1],tmp[i]];
        s.push({type:'swap', i, j:i+1, arr:[...tmp], pass:p+1});
        swapped = true;
      }
    }
    s.push({type:'pass_done', sorted: n-1-p, arr:[...tmp], pass:p+1});
    if (!swapped) break;
  }
  s.push({type:'done', arr:[...tmp]});
  return s;
}

function renderBars(a, hi, hj, sortedFrom) {
  const c = document.getElementById('bars-container');
  const max = Math.max(...a);
  c.innerHTML = a.map((v,i) => {
    let cls = 'normal';
    if (sortedFrom !== undefined && i >= sortedFrom) cls = 'sorted';
    if (i === hi) cls = 'comparing';
    if (i === hj) cls = 'swapped';
    const h = Math.max(12, Math.round((v/max)*130));
    return '<div class="bar ' + cls + '" style="height:' + h + 'px"><span class="bar-label">' + v + '</span></div>';
  }).join('');
}

function stepSort() {
  if (!steps.length) { steps = buildSteps([...arr]); stepIdx = 0; }
  if (stepIdx >= steps.length) { setStatus('✅ Sorted!'); return; }
  const s = steps[stepIdx++];
  if (s.type === 'compare') { comparisons++; pass = s.pass; renderBars(s.arr, s.i, s.j, arr.length - s.pass); log('Pass ' + s.pass + ': compare[' + s.i + ']=' + s.arr[s.i] + ' vs [' + s.j + ']=' + s.arr[s.j]); setStatus('Comparing index ' + s.i + ' and ' + s.j); }
  else if (s.type === 'swap') { swaps++; renderBars(s.arr, s.j, s.i, arr.length - s.pass); log('  → Swap! ' + s.arr[s.j] + ' ↔ ' + s.arr[s.i]); setStatus('Swapping!'); }
  else if (s.type === 'pass_done') { sortedUpto = s.sorted; renderBars(s.arr, -1, -1, sortedUpto); log('Pass ' + s.pass + ' done - position ' + sortedUpto + ' sorted'); setStatus('Pass ' + s.pass + ' complete'); }
  else if (s.type === 'done') { renderBars(s.arr, -1, -1, 0); setStatus('✅ Fully sorted!'); stopAuto(); log('=== Sorting complete! ' + comparisons + ' comparisons, ' + swaps + ' swaps ==='); }
  updateStats();
}

function startSort() {
  if (autoInterval) { stopAuto(); return; }
  if (!steps.length) steps = buildSteps([...arr]);
  document.getElementById('btn-sort').textContent = '⏸ Pause';
  autoInterval = setInterval(() => { if (stepIdx >= steps.length) stopAuto(); else stepSort(); }, 120);
}

function stopAuto() { clearInterval(autoInterval); autoInterval = null; document.getElementById('btn-sort').textContent = '▶ Start Sort'; }

function resetSort() {
  stopAuto();
  steps = []; stepIdx = 0; comparisons = 0; swaps = 0; pass = 0; sortedUpto = -1;
  updateStats(); renderBars(arr, -1, -1); setStatus('Reset - ready');
  document.getElementById('log').textContent = '';
}

function updateStats() {
  document.getElementById('comparisons').textContent = comparisons;
  document.getElementById('swaps').textContent = swaps;
  document.getElementById('pass').textContent = pass;
}

function setStatus(msg) { document.getElementById('status-text').textContent = msg; }

function log(msg) {
  const el = document.getElementById('log');
  el.textContent += msg + '\ ';
  el.scrollTop = el.scrollHeight;
}

generateArray();`,
      mode: 'full' },
  ],
  exercises: [
    { id: 'loop-1', question: 'Which loop is best for iterating over array VALUES without needing the index?', type: 'multiple-choice', options: ['for loop', 'while loop', 'for...of loop', 'for...in loop'], correct: 2, explanation: 'for...of gives you the values directly: for (const item of array). It is clean, readable, and works with any iterable. Use for...of when you just need each value. Use for...of with .entries() if you also need the index.' },
    { id: 'loop-2', question: 'What is the output of: for (let i=0; i<5; i++) { if(i===3) break; console.log(i); }', type: 'code-output', correct: '0\n1\n2', explanation: 'The loop starts at 0 and increments. When i reaches 3, break exits the loop immediately. So it logs 0, 1, 2 - never reaching 3, 4.' },
  ],
  quiz: [
    { id: 'ql1', question: 'What does the continue keyword do in a loop?', options: ['Stops the loop', 'Skips the rest of the current iteration and moves to the next', 'Restarts the loop from the beginning', 'Pauses execution'], correct: 1, explanation: 'continue skips the remaining code in the current iteration and jumps to the next iteration. break stops the loop entirely.' },
    { id: 'ql2', question: 'Which is the most modern/recommended way to sum an array of numbers?', options: ['for loop with index', 'while loop', 'reduce()', 'for...in loop'], correct: 2, explanation: 'Array.reduce() is the idiomatic modern way: numbers.reduce((acc, n) => acc + n, 0). It is declarative, works with method chaining, and expresses intent clearly.' },
  ],
};
