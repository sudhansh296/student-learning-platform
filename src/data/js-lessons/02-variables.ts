import type { JSLesson } from '../js-curriculum';

export const jsVariablesLesson: JSLesson = {
  id: 'js-variables-full',
  title: 'Variables - let, const, var',
  slug: 'variables',
  chapter: 'basics',
  order: 3,
  difficulty: 'beginner',
  readingTime: 12,
  description: 'Declare variables with let, const, and var. Understand scope, hoisting, naming rules, and modern best practices.',
  sections: [
    {
      type: 'text',
      content: 'Variables are named containers that store data values. In JavaScript you can declare variables using three keywords: var (old, avoid), let (modern, reassignable), and const (modern, cannot be reassigned). Understanding when to use each is one of the first critical skills.',
    },
    {
      type: 'heading',
      content: 'var, let, const - Side by Side',
    },
    {
      type: 'example',
      title: 'All three declaration keywords',
      content: 'JavaScript has three ways to declare a variable. Use const when the value will not change (most of the time). Use let when the value needs to change later (like a counter or score). Never use var in modern code - it has confusing scoping behavior that causes bugs.',
      code: `// const - value CANNOT be reassigned (use by default)
const name = "Alex";
const age = 25;
const PI = 3.14159;
const user = { id: 1, name: "Alex" };  // object is fine
const colors = ["red", "green", "blue"]; // array is fine

// let - value CAN be reassigned (use when value changes)
let score = 0;
score = score + 10;   // OK
let isLoggedIn = false;
isLoggedIn = true;    // OK

// var - OLD, avoid in modern code (has confusing behavior)
var legacyCode = "please avoid";

// Try to reassign const:
// name = "Jordan"; // ❌ TypeError: Assignment to constant variable

console.log(name);       // "Alex"
console.log(score);      // 10
console.log(isLoggedIn); // true`, output: 'Alex | 10 | true',
      language: 'javascript',
    },
    {
      type: 'heading',
      content: 'const Does NOT Mean Immutable',
    },
    {
      type: 'example',
      title: 'const with objects and arrays',
      content: 'This is a common confusion point: const does NOT make an object or array frozen. It only prevents you from pointing the variable at a completely different value. You can still add, change, or remove properties inside the object - const just means "this variable will always point to THIS object."',
      code: `// const prevents REASSIGNMENT, not MUTATION
const user = { name: "Alex", age: 25 };

// Mutating properties - ALLOWED
user.age = 26;         // ✅ OK
user.city = "NYC";     // ✅ OK - add new property

// Reassigning the variable - NOT ALLOWED
// user = {};          // ❌ TypeError

const fruits = ["apple", "banana"];
fruits.push("cherry"); // ✅ OK - mutating the array
fruits[0] = "mango";   // ✅ OK - modifying element
// fruits = [];         // ❌ TypeError - cannot reassign

console.log(user);   // { name: "Alex", age: 26, city: "NYC" }
console.log(fruits); // ["mango", "banana", "cherry"]`,
      language: 'javascript',
    },
    {
      type: 'note',
      title: 'Rule: Use const by default, let when you need to change',
      content: 'Start with const for everything. Only change to let if you realize the value needs to be reassigned. This makes code easier to read - seeing const tells you "this value never changes."',
    },
    {
      type: 'heading',
      content: 'Variable Naming Rules',
    },
    {
      type: 'example',
      title: 'Valid and invalid variable names',
      content: 'JavaScript variable names can contain letters, digits, underscore _, and dollar sign $. They cannot start with a digit. They cannot be reserved keywords (let, const, function, class, etc.). JavaScript is case-sensitive - score, Score, and SCORE are three completely different variables. Follow camelCase for variables and functions, SCREAMING_SNAKE_CASE for true constants.',
      code: `// ✅ VALID names
let name = "Alex";
let firstName = "Jordan";     // camelCase - JavaScript convention
let _privateVar = "internal";  // underscore prefix
let $price = 9.99;             // dollar sign (used by jQuery)
let user1 = "first user";
let MAX_RETRY_COUNT = 3;       // SCREAMING_SNAKE_CASE for constants

// ❌ INVALID names (cause SyntaxError)
// let 1name = "bad";          // Cannot start with number
// let my-name = "bad";        // Hyphens not allowed
// let let = "bad";            // Reserved keyword
// let class = "bad";          // Reserved keyword
// let return = "bad";         // Reserved keyword

// ⚠️ Case sensitive - these are THREE different variables
let score = 10;
let Score = 20;
let SCORE = 30;
console.log(score, Score, SCORE); // 10 20 30

// Best practice: camelCase for variables and functions
// PascalCase for classes and components (React)
// SCREAMING_SNAKE_CASE for true constants`,
      language: 'javascript',
    },
    {
      type: 'heading',
      content: 'Scope - Where Variables Live',
    },
    {
      type: 'example',
      title: 'Block scope vs function scope vs global scope',
      content: 'Scope defines where a variable can be accessed. Think of scope like a building with rooms. A variable declared in a room (block) can only be used in that room. But a variable declared in the building lobby (global) can be used anywhere. The key rule: let and const are block-scoped (stay inside {}). var is function-scoped (leaks out of if/for blocks - this is why it causes bugs).',
      code: `// 1. Global scope - accessible everywhere
const globalName = "I am global";

function myFunction() {
  // 2. Function scope - only inside this function
  const funcOnly = "I am function-scoped";

  if (true) {
    // 3. Block scope - only inside this { }
    const blockOnly = "I am block-scoped";
    let alsoBlock = "me too";
    var notBlock = "var escapes blocks!"; // ⚠️ var is function-scoped

    console.log(globalName);  // ✅ "I am global"
    console.log(funcOnly);    // ✅ "I am function-scoped"
    console.log(blockOnly);   // ✅ "I am block-scoped"
  }

  console.log(notBlock);  // ✅ "var escapes blocks!" - var leaks out!
  // console.log(blockOnly); // ❌ ReferenceError - const is block-scoped
}

myFunction();
console.log(globalName); // ✅
// console.log(funcOnly); // ❌ ReferenceError`,
      language: 'javascript',
    },
    {
      type: 'heading',
      content: 'Hoisting - How JavaScript Reads Your Code',
    },
    {
      type: 'example',
      title: 'var hoisting vs let/const temporal dead zone',
      content: 'JavaScript reads your entire file before running it. During this read, it "hoists" (moves up) var declarations to the top. This means you can use a var variable before the line where you wrote it - but its value is undefined. This is confusing and is one reason we avoid var. let and const do NOT hoist - if you try to use them before their declaration line, you get a clear error.',
      code: `// var declarations are HOISTED (moved to top) - but not initialized
console.log(x); // undefined - no error! var is hoisted
var x = 5;
console.log(x); // 5

// This is what the JavaScript engine actually sees:
var x;           // declaration hoisted to top
console.log(x);  // undefined (declared but not assigned yet)
x = 5;           // assignment stays here

// let and const have "Temporal Dead Zone" - cannot be used before declaration
// console.log(y); // ❌ ReferenceError: Cannot access 'y' before initialization
let y = 5;        // declaration here - now y exists

// Function declarations ARE fully hoisted
greet("Alice"); // ✅ works! function declarations are hoisted
function greet(name) {
  console.log("Hello,", name);
}

// Function expressions are NOT hoisted
// sayBye("Bob"); // ❌ ReferenceError
const sayBye = (name) => console.log("Goodbye,", name);`,
      language: 'javascript',
    },
    {
      type: 'heading',
      content: 'The var Problem - Why We Avoid It',
    },
    {
      type: 'example',
      title: 'Classic var bug in loops',
            content: 'This is the most famous JavaScript bug. When you use var in a for loop, there is only ONE shared i variable for all iterations. By the time the setTimeout callbacks run, the loop has finished and i equals 3. Replacing var with let gives each iteration its own private i - the correct output is 0, 1, 2.',
      code: `// var in a loop - the famous bug
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("var:", i), 100);
}
// Output: var: 3, var: 3, var: 3  ← ALL print 3 (bug!)
// Reason: var is function-scoped, so there is ONE shared i
// By the time callbacks run, the loop has finished and i=3

// let in a loop - fixed
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log("let:", j), 100);
}
// Output: let: 0, let: 1, let: 2  ← correct!
// Reason: let is block-scoped, so each iteration has its OWN j`, output: 'var:3, var:3, var:3 | let:0, let:1, let:2',
      language: 'javascript',
    },
    {
      type: 'tryit',
      title: 'Try It: Variables in Action',
      html: `<div id="app">
  <h2>Variable Explorer</h2>
  <div class="row">
    <input id="nameInput" type="text" placeholder="Enter your name" />
    <input id="ageInput" type="number" placeholder="Age" min="1" max="120" />
    <button onclick="createProfile()">Create Profile</button>
  </div>
  <div id="profile"></div>
  <hr style="margin:20px 0; border-color:#e5e7eb;">
  <h3>Counter (let example)</h3>
  <div class="counter-row">
    <button onclick="decrement()">−</button>
    <span id="counter">0</span>
    <button onclick="increment()">+</button>
  </div>
  <p id="counter-msg"></p>
</div>`,
      css: `#app{font-family:system-ui,sans-serif;padding:20px;max-width:500px;}
h2{color:#1e1e1e;margin-bottom:12px;}
h3{color:#374151;font-size:15px;margin:0 0 10px;}
.row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;}
input{padding:9px 12px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:14px;outline:none;flex:1;min-width:120px;}
input:focus{border-color:#2563eb;}
button{padding:9px 18px;background:#2563eb;color:white;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600;}
button:hover{background:#1d4ed8;}
#profile{background:white;border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin-bottom:12px;min-height:44px;}
.counter-row{display:flex;align-items:center;gap:16px;}
.counter-row button{width:40px;height:40px;padding:0;font-size:20px;display:flex;align-items:center;justify-content:center;}
#counter{font-size:36px;font-weight:800;min-width:60px;text-align:center;color:#2563eb;}
#counter-msg{color:#6b7280;font-size:13px;margin-top:6px;}`,
      js: `// const - won't change
const MIN_AGE = 0;
const MAX_AGE = 120;

// let - will change as user interacts
let clickCount = 0;

function createProfile() {
  const name = document.getElementById('nameInput').value.trim();
  const age = parseInt(document.getElementById('ageInput').value);

  if (!name) return alert('Please enter a name');
  if (!age || age < MIN_AGE || age > MAX_AGE) return alert('Please enter a valid age');

  // Object using shorthand properties
  const profile = { name, age, createdAt: new Date().toLocaleTimeString() };

  document.getElementById('profile').innerHTML = \`
    <strong>Name:</strong> \${profile.name}<br>
    <strong>Age:</strong> \${profile.age} years<br>
    <strong>Born approx:</strong> \${2026 - profile.age}<br>
    <strong>Created:</strong> \${profile.createdAt}
  \`;
}

let count = 0;  // let - changes on click

function increment() {
  count++;
  updateCounter();
}

function decrement() {
  count--;
  updateCounter();
}

function updateCounter() {
  document.getElementById('counter').textContent = count;
  document.getElementById('counter').style.color = count > 0 ? '#22c55e' : count < 0 ? '#ef4444' : '#2563eb';
  document.getElementById('counter-msg').textContent =
    count === 0 ? 'Counter is at zero' :
    count > 0  ? \`\${count} above zero\` :
                 \`\${Math.abs(count)} below zero\`;
}`,
      mode: 'full',
    },
  ],
  exercises: [
    {
      id: 'jv-1',
      question: 'Which keyword should you use by default when declaring a variable in modern JavaScript?',
      type: 'multiple-choice',
      options: ['var', 'let', 'const', 'define'],
      correct: 2,
      explanation: 'Use const by default. Only use let when the value needs to be reassigned later. Never use var in modern JavaScript - it has confusing scoping behavior.',
    },
    {
      id: 'jv-2',
      question: 'What is the output of: const arr = [1,2,3]; arr.push(4); console.log(arr.length)',
      type: 'code-output',
      correct: '4',
      explanation: 'const prevents reassignment (arr = something_else), but you CAN mutate the array with push(). After push(4), the array is [1,2,3,4] with length 4.',
    },
    {
      id: 'jv-3',
      question: 'What is "hoisting" in JavaScript?',
      type: 'multiple-choice',
      options: [
        'Moving code to a server',
        'var declarations being moved to the top of their scope before execution',
        'A way to increase a variable\'s value',
        'Importing modules at the top of a file',
      ],
      correct: 1,
      explanation: 'Hoisting is JavaScript\'s behavior of moving variable and function declarations to the top of their scope during the compilation phase. var declarations are hoisted (but not initialized). let and const are in the "temporal dead zone" until their declaration line.',
    },
  ],
  quiz: [
    {
      id: 'qv1',
      question: 'What error does: console.log(x); let x = 5; throw?',
      options: ['No error - prints undefined', 'ReferenceError: Cannot access x before initialization', 'SyntaxError', 'TypeError'],
      correct: 1,
      explanation: 'let and const are in the Temporal Dead Zone (TDZ) between the start of their block and their declaration. Accessing them before the declaration throws a ReferenceError. This is different from var which returns undefined when accessed before assignment.',
    },
    {
      id: 'qv2',
      question: 'Which of these is a valid variable name in JavaScript?',
      options: ['1username', 'user-name', 'user_name', 'class'],
      correct: 2,
      explanation: 'user_name is valid - underscores are allowed anywhere. 1username starts with a digit (invalid). user-name uses a hyphen (invalid). class is a reserved keyword (invalid).',
    },
  ],
};
