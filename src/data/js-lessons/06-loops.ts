import type { JSLesson } from '../js-curriculum';

export const jsLoopsLesson: JSLesson = {
  id: 'js-loops', title: 'Loops', slug: 'loops', chapter: 'basics', order: 7,
  difficulty: 'beginner', readingTime: 12,
  description: 'Repeat code with for, while, do...while, for...of, and for...in loops. Plus break, continue, and loop patterns.',
  sections: [
    { type: 'text', content: 'Loops repeat a block of code multiple times. Instead of writing console.log() 100 times, you write a loop that runs 100 times. Loops are one of the most fundamental concepts in programming.' },
    { type: 'heading', content: 'for Loop' },
    { type: 'example', title: 'Classic for loop — when you know the count', content: 'A for loop repeats code a specific number of times. It has three parts: initialization (let i = 0 — where to start), condition (i < 5 — when to stop), and update (i++ — what to change each time). The variable i is called the "index" or "counter". You can loop forwards, backwards, or by any step size.', language: 'javascript', code: `// for (initialization; condition; update)
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
    { type: 'example', title: 'while — when you don\'t know how many times', content: 'A while loop keeps running as long as the condition is true. Use it when you do not know in advance how many times you need to loop — like reading user input until they type "quit", retrying a failed network request, or processing items until a queue is empty. Always make sure the condition will eventually become false, otherwise you get an infinite loop that crashes the browser.', language: 'javascript', code: `// Runs while condition is true
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
    { type: 'heading', content: 'for...of — Iterate Over Values' },
    { type: 'example', title: 'for...of — cleanest way to loop arrays', content: 'for...of is the modern way to loop through arrays and any iterable value (strings, Maps, Sets). It gives you the VALUE directly without needing an index. Combined with destructuring, it is extremely clean for looping arrays of objects. This is the loop you will use most often in React and Node.js code.', language: 'javascript', code: `// for...of gives you VALUES directly
const colors = ["red", "green", "blue"];
for (const color of colors) {
  console.log(color); // red, green, blue
}

// Works with strings too
for (const char of "hello") {
  console.log(char); // h, e, l, l, o
}

// With destructuring — very common in React/Node
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

// entries() — get both index and value
for (const [index, color] of colors.entries()) {
  console.log(index, color); // 0 red, 1 green, 2 blue
}`, output: 'red | green | blue' },
    { type: 'heading', content: 'for...in — Iterate Over Object Keys' },
    { type: 'example', title: 'for...in — loop object properties', language: 'javascript',       content: 'for...in iterates over the enumerable property KEYS of an object as strings. It works on arrays too but is not recommended — it also picks up inherited prototype properties and gives string indexes instead of numbers. For arrays always use for...of or forEach. Use for...in only for plain objects.',
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
    { type: 'example', title: 'Control loop flow with break and continue', content: 'break immediately exits the entire loop — no more iterations. continue skips the rest of the current iteration and jumps to the next one. Use break to stop as soon as you find what you are looking for (more efficient than looping everything). Use continue to skip items that do not meet a condition without nesting more if statements.', language: 'javascript', code: `// break — exit the loop immediately
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

// continue — skip this iteration, continue loop
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
    { type: 'example', title: 'Modern array iteration — prefer these', content: 'Modern JavaScript has powerful array methods that replace most loops. map() transforms every item. filter() keeps only matching items. reduce() combines everything into one value. These methods are preferred over for loops in professional code because they clearly communicate intent — the name of the method tells you exactly what it does. They are also chainable, so you can combine multiple operations in a clean pipeline.', language: 'javascript', code: `const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// forEach — runs code for each element
numbers.forEach(n => console.log(n));

// map — transform each element, returns new array
const doubled = numbers.map(n => n * 2);
// [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// filter — keep elements that pass a test
const evens = numbers.filter(n => n % 2 === 0);
// [2, 4, 6, 8, 10]

// reduce — accumulate to one value
const sum = numbers.reduce((acc, n) => acc + n, 0);
// 55

// find — first element that matches
const firstOver5 = numbers.find(n => n > 5); // 6

// some — true if ANY element matches
const hasEven = numbers.some(n => n % 2 === 0); // true

// every — true if ALL elements match
const allPositive = numbers.every(n => n > 0); // true

// Chaining (very powerful):
const result = numbers
  .filter(n => n % 2 === 0)    // keep evens: [2,4,6,8,10]
  .map(n => n ** 2)             // square them: [4,16,36,64,100]
  .reduce((acc, n) => acc + n, 0); // sum: 220
console.log(result); // 220` },
    { type: 'tryit', title: 'Try It: Loops in Action',
      html: `<div id="app">
  <h2>Loop Visualizer</h2>
  <div class="controls">
    <label>Start: <input id="start" type="number" value="1" style="width:60px"></label>
    <label>End: <input id="end" type="number" value="10" style="width:60px"></label>
    <label>Step: <input id="step" type="number" value="1" style="width:60px"></label>
    <button onclick="runLoop()">Run Loop</button>
  </div>
  <div id="output"></div>
  <hr style="margin:16px 0;border-color:#e5e7eb">
  <h3>FizzBuzz (classic programming challenge)</h3>
  <button onclick="fizzBuzz()">Run FizzBuzz 1-30</button>
  <div id="fizz-output" class="fizz-grid"></div>
</div>`,
      css: `#app{font-family:system-ui,sans-serif;padding:20px;max-width:540px;}
h2{color:#1e1e1e;margin-bottom:12px;}h3{font-size:14px;color:#374151;margin:0 0 10px;}
.controls{display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin-bottom:12px;}
label{font-size:13px;color:#374151;}
input[type=number]{padding:6px 8px;border:1.5px solid #e5e7eb;border-radius:6px;font-size:14px;outline:none;margin-left:4px;}
button{padding:9px 18px;background:#2563eb;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:14px;}
#output{background:#0d1117;color:#3fb950;padding:14px;border-radius:10px;font-family:monospace;font-size:13px;white-space:pre-wrap;min-height:50px;max-height:180px;overflow-y:auto;}
.fizz-grid{display:flex;flex-wrap:wrap;gap:4px;margin-top:8px;}
.fizz-item{padding:4px 8px;border-radius:6px;font-size:12px;font-weight:600;}
.fizz-fizz{background:#eff6ff;color:#1d4ed8;}
.fizz-buzz{background:#fef3c7;color:#d97706;}
.fizz-fizzbuzz{background:#fef2f2;color:#dc2626;}
.fizz-num{background:#f3f4f6;color:#374151;}`,
      js: `function runLoop() {
  const start = parseInt(document.getElementById('start').value);
  const end   = parseInt(document.getElementById('end').value);
  const step  = parseInt(document.getElementById('step').value) || 1;
  const lines = [];
  let count = 0;
  for (let i = start; i <= end; i += step) {
    lines.push('i = ' + i);
    count++;
    if (count > 100) { lines.push('... (limited to 100 iterations)'); break; }
  }
  lines.push('\\nTotal iterations: ' + count);
  document.getElementById('output').textContent = lines.join('\\n');
}

function fizzBuzz() {
  const container = document.getElementById('fizz-output');
  container.innerHTML = '';
  for (let i = 1; i <= 30; i++) {
    const div = document.createElement('div');
    div.className = 'fizz-item';
    if (i % 15 === 0) {
      div.textContent = 'FizzBuzz';
      div.classList.add('fizz-fizzbuzz');
    } else if (i % 3 === 0) {
      div.textContent = 'Fizz';
      div.classList.add('fizz-fizz');
    } else if (i % 5 === 0) {
      div.textContent = 'Buzz';
      div.classList.add('fizz-buzz');
    } else {
      div.textContent = i;
      div.classList.add('fizz-num');
    }
    container.appendChild(div);
  }
}`,
      mode: 'full' },
  ],
  exercises: [
    { id: 'loop-1', question: 'Which loop is best for iterating over array VALUES without needing the index?', type: 'multiple-choice', options: ['for loop', 'while loop', 'for...of loop', 'for...in loop'], correct: 2, explanation: 'for...of gives you the values directly: for (const item of array). It is clean, readable, and works with any iterable. Use for...of when you just need each value. Use for...of with .entries() if you also need the index.' },
    { id: 'loop-2', question: 'What is the output of: for (let i=0; i<5; i++) { if(i===3) break; console.log(i); }', type: 'code-output', correct: '0\n1\n2', explanation: 'The loop starts at 0 and increments. When i reaches 3, break exits the loop immediately. So it logs 0, 1, 2 — never reaching 3, 4.' },
  ],
  quiz: [
    { id: 'ql1', question: 'What does the continue keyword do in a loop?', options: ['Stops the loop', 'Skips the rest of the current iteration and moves to the next', 'Restarts the loop from the beginning', 'Pauses execution'], correct: 1, explanation: 'continue skips the remaining code in the current iteration and jumps to the next iteration. break stops the loop entirely.' },
    { id: 'ql2', question: 'Which is the most modern/recommended way to sum an array of numbers?', options: ['for loop with index', 'while loop', 'reduce()', 'for...in loop'], correct: 2, explanation: 'Array.reduce() is the idiomatic modern way: numbers.reduce((acc, n) => acc + n, 0). It is declarative, works with method chaining, and expresses intent clearly.' },
  ],
};
