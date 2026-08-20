import type { MernTopic } from './javascript-topics';

export const jsFunctionTopics: MernTopic[] = [
  {
    id: 'js-functions-deep',
    title: 'Functions — Complete Guide',
    slug: 'functions',
    subject: 'javascript',
    difficulty: 'beginner',
    readingTime: 15,
    description: 'Master every type of JavaScript function — declarations, expressions, arrow functions, default params, rest/spread, and more.',
    prevTopic: 'operators',
    nextTopic: 'arrays',
    sections: [
      {
        type: 'intro',
        content: 'Functions are the building blocks of JavaScript. A function is a reusable block of code that performs a specific task. You define it once and call it as many times as you need. In JavaScript, functions are "first-class citizens" — they can be stored in variables, passed as arguments, and returned from other functions.'
      },
      {
        type: 'heading',
        content: '1. Function Declaration'
      },
      {
        type: 'example',
        title: 'Function Declaration — the classic way',
        code: `// Declaration — can be called BEFORE it's defined (hoisted)
console.log(add(3, 4)); // 7 — works even before the function definition!

function add(a, b) {
  return a + b;
}

function greet(name) {
  return "Hello, " + name + "!";
}

function isEven(num) {
  return num % 2 === 0; // returns true or false
}

console.log(add(10, 5));      // 15
console.log(greet("Alex"));   // "Hello, Alex!"
console.log(isEven(4));       // true
console.log(isEven(7));       // false`,
        language: 'javascript'
      },
      {
        type: 'heading',
        content: '2. Function Expression'
      },
      {
        type: 'example',
        title: 'Function Expression — stored in a variable',
        code: `// Expression — cannot be called before it's defined (not hoisted)
const multiply = function(a, b) {
  return a * b;
};

// Named function expression (useful for debugging)
const factorial = function fact(n) {
  if (n <= 1) return 1;
  return n * fact(n - 1); // can call itself by name
};

console.log(multiply(4, 5)); // 20
console.log(factorial(5));   // 120 (5 * 4 * 3 * 2 * 1)`,
        language: 'javascript'
      },
      {
        type: 'heading',
        content: '3. Arrow Functions (ES6) — The Modern Way'
      },
      {
        type: 'example',
        title: 'Arrow function syntax — from verbose to concise',
        code: `// Standard function
function square(x) {
  return x * x;
}

// Arrow function — same thing, shorter syntax
const square = (x) => {
  return x * x;
};

// Shorter — single param, parentheses optional
const square = x => {
  return x * x;
};

// Shortest — single expression, implicit return
const square = x => x * x;

// With multiple parameters
const add = (a, b) => a + b;

// No parameters — empty parens required
const greet = () => "Hello!";

// Returning an object — wrap in parentheses!
const makeUser = (name, age) => ({ name, age });

console.log(square(5));           // 25
console.log(add(3, 4));          // 7
console.log(greet());            // "Hello!"
console.log(makeUser("Alex", 25)); // { name: "Alex", age: 25 }`,
        language: 'javascript'
      },
      {
        type: 'tip',
        title: 'Arrow functions and this',
        content: 'Arrow functions do not have their own "this". They inherit "this" from the surrounding code. This makes them perfect for callbacks inside class methods and React components. Regular functions create their own "this", which can cause bugs.'
      },
      {
        type: 'heading',
        content: '4. Default Parameters'
      },
      {
        type: 'example',
        title: 'Default parameter values',
        code: `// Without default params — old way
function greet(name) {
  name = name || "Guest"; // if name is falsy, use "Guest"
  return "Hello, " + name;
}

// With default params — ES6 way (better!)
function greet(name = "Guest") {
  return \`Hello, \${name}!\`;
}

function createUser(name, role = "viewer", active = true) {
  return { name, role, active };
}

console.log(greet());              // "Hello, Guest!"
console.log(greet("Alex"));       // "Hello, Alex!"
console.log(createUser("Bob"));   // { name: "Bob", role: "viewer", active: true }
console.log(createUser("Admin", "admin")); // { name: "Admin", role: "admin", active: true }

// Default can be an expression
function getTimestamp(time = Date.now()) {
  return time;
}`,
        language: 'javascript'
      },
      {
        type: 'heading',
        content: '5. Rest Parameters and Spread Operator'
      },
      {
        type: 'example',
        title: 'Rest parameters — collect remaining args',
        code: `// Rest parameter — collects ALL remaining arguments into an array
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3));        // 6
console.log(sum(1, 2, 3, 4, 5)); // 15
console.log(sum(10));              // 10

// Mix of named params and rest
function logMessage(level, ...messages) {
  console.log(\`[\${level.toUpperCase()}]\`, ...messages);
}

logMessage("info", "Server started", "on port 3000");
// [INFO] Server started on port 3000

// Spread operator — expands an array/object
const nums = [1, 2, 3];
console.log(Math.max(...nums));   // 3 (spread array as arguments)

const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

const user = { name: "Alex", age: 25 };
const updated = { ...user, age: 26, city: "NYC" }; // spread then override
console.log(updated); // { name: "Alex", age: 26, city: "NYC" }`,
        language: 'javascript'
      },
      {
        type: 'heading',
        content: '6. Higher-Order Functions'
      },
      {
        type: 'example',
        title: 'Functions as arguments and return values',
        code: `// Passing a function as argument (callback)
function applyOperation(a, b, operation) {
  return operation(a, b);
}

const result1 = applyOperation(10, 5, (a, b) => a + b);  // 15
const result2 = applyOperation(10, 5, (a, b) => a * b);  // 50
const result3 = applyOperation(10, 5, Math.max);          // 10

// Returning a function (function factory)
function multiplier(factor) {
  return (number) => number * factor;  // returns a function!
}

const double = multiplier(2);
const triple = multiplier(3);
const times10 = multiplier(10);

console.log(double(5));   // 10
console.log(triple(4));   // 12
console.log(times10(7));  // 70

// Real-world: making a greeting factory
function makeGreeter(greeting) {
  return (name) => \`\${greeting}, \${name}!\`;
}

const sayHello = makeGreeter("Hello");
const sayHi = makeGreeter("Hi");
const sayHey = makeGreeter("Hey");

console.log(sayHello("Alex"));  // "Hello, Alex!"
console.log(sayHi("Jordan"));   // "Hi, Jordan!"`,
        language: 'javascript'
      },
      {
        type: 'heading',
        content: '7. Immediately Invoked Function Expression (IIFE)'
      },
      {
        type: 'example',
        title: 'IIFE — runs immediately when defined',
        code: `// IIFE — wrap in () and immediately call ()
(function() {
  const secret = "I am private";
  console.log("IIFE ran:", secret);
})();

// Arrow IIFE
(() => {
  console.log("Arrow IIFE ran");
})();

// IIFE with params
((name) => {
  console.log(\`Hello from IIFE, \${name}!\`);
})("Alex");

// Use case: avoid polluting global scope
(function() {
  var localVar = "only exists here";
  // All code here is isolated
})();

// console.log(localVar); // ReferenceError — it's gone!`,
        language: 'javascript'
      },
      {
        type: 'tryit',
        title: 'Try: Function Workshop',
        html: '<div id="app">\n  <h2>🔧 Function Workshop</h2>\n  <div class="row"><label>Number 1:</label><input id="n1" type="number" value="10"/></div>\n  <div class="row"><label>Number 2:</label><input id="n2" type="number" value="5"/></div>\n  <div class="btns">\n    <button onclick="calc(\'+\')">Add</button>\n    <button onclick="calc(\'-\')">Subtract</button>\n    <button onclick="calc(\'*\')">Multiply</button>\n    <button onclick="calc(\'/\')">Divide</button>\n    <button onclick="calcPow()">Power</button>\n  </div>\n  <p id="result">Result: —</p>\n  <hr/>\n  <h3>Arrow Function Demo</h3>\n  <input id="name" placeholder="Enter name"/>\n  <select id="greeting">\n    <option>Hello</option><option>Hi</option><option>Hey</option><option>Greetings</option>\n  </select>\n  <button onclick="makeGreet()">Greet</button>\n  <p id="greet-result"></p>\n</div>',
        css: '#app{font-family:sans-serif;padding:20px;max-width:450px;}\n.row{display:flex;align-items:center;gap:10px;margin:6px 0;}\nlabel{width:80px;font-size:13px;color:#64748b;}\ninput{padding:7px 10px;border:1px solid #ddd;border-radius:6px;font-size:14px;width:100px;}\nselect{padding:7px;border:1px solid #ddd;border-radius:6px;font-size:14px;}\n.btns{display:flex;flex-wrap:wrap;gap:6px;margin:12px 0;}\nbutton{padding:7px 14px;background:#2563eb;color:white;border:none;border-radius:6px;cursor:pointer;font-size:13px;}\nbutton:hover{background:#1d4ed8;}\n#result,#greet-result{font-size:18px;font-weight:bold;color:#059669;margin-top:8px;}',
        js: '// Higher-order function\nfunction applyOp(a, b, op) {\n  return op(a, b);\n}\n\nconst ops = {\n  "+": (a, b) => a + b,\n  "-": (a, b) => a - b,\n  "*": (a, b) => a * b,\n  "/": (a, b) => b !== 0 ? (a / b).toFixed(2) : "Cannot divide by zero"\n};\n\nfunction calc(op) {\n  const a = parseFloat(document.getElementById("n1").value);\n  const b = parseFloat(document.getElementById("n2").value);\n  const result = applyOp(a, b, ops[op]);\n  document.getElementById("result").textContent = \`Result: \${a} \${op} \${b} = \${result}\`;\n}\n\nfunction calcPow() {\n  const a = parseFloat(document.getElementById("n1").value);\n  const b = parseFloat(document.getElementById("n2").value);\n  document.getElementById("result").textContent = \`Result: \${a}^\${b} = \${Math.pow(a,b)}\`;\n}\n\n// Function factory\nfunction makeGreeter(g) {\n  return (name) => \`\${g}, \${name}! 👋\`;\n}\n\nfunction makeGreet() {\n  const name = document.getElementById("name").value || "friend";\n  const g = document.getElementById("greeting").value;\n  const greeter = makeGreeter(g);\n  document.getElementById("greet-result").textContent = greeter(name);\n}',
        mode: 'full'
      }
    ],
    exercises: [
      {
        id: 'fn-1',
        question: 'What is the concise arrow function equivalent of: function double(x) { return x * 2; }',
        type: 'multiple-choice',
        options: ['const double = x => x * 2;', 'const double = (x) { x * 2 }', 'arrow double(x) => x*2', 'const double = => x * 2'],
        correct: 0,
        explanation: 'const double = x => x * 2; is the correct concise arrow function. Single param, single expression = no braces or return needed.'
      },
      {
        id: 'fn-2',
        question: 'What does the rest parameter (...args) do?',
        type: 'multiple-choice',
        options: [
          'Spreads an array into arguments',
          'Collects all remaining function arguments into an array',
          'Creates a copy of a function',
          'Declares an infinite loop'
        ],
        correct: 1,
        explanation: 'Rest parameters collect any number of remaining arguments into an array. function sum(...nums) allows calling sum(1,2,3,4) where nums becomes [1,2,3,4].'
      }
    ]
  }
];
