import type { JSLesson } from '../js-curriculum';

export const jsFunctionsLesson: JSLesson = {
  id: 'js-functions-complete', title: 'Functions - Complete Guide', slug: 'functions',
  chapter: 'functions', order: 8, difficulty: 'beginner', readingTime: 19,
  description: 'Master every type of JavaScript function - declarations, expressions, arrow functions, parameters, default values, rest/spread, higher-order functions, and closures.',
  sections: [
    { type: 'text', content: 'A function is a reusable block of code that performs a specific task. You define it once and call it whenever needed. Functions are the most important concept in JavaScript - everything in modern JS (React components, event handlers, async operations) is built with functions.' },
    { type: 'heading', content: '1. Function Declaration' },
    { type: 'example', title: 'Function declarations are hoisted', content: 'A function declaration defines a reusable, named function. You can call it BEFORE the line where you wrote it because JavaScript moves ("hoists") function declarations to the top. Every function can accept inputs (parameters) and send back a result (return). If you do not write return, the function automatically returns undefined.', language: 'javascript', code: `// Function declarations can be called BEFORE they are defined (hoisted)
sayHello("Alice"); // Works! Function declarations are fully hoisted

function sayHello(name) {
  console.log("Hello, " + name + "!");
}

// With multiple parameters and a return value
function add(a, b) {
  return a + b;
}
console.log(add(5, 3)); // 8

// Without a return - implicitly returns undefined
function greetUser(name) {
  console.log("Welcome, " + name);
  // returns undefined
}
const result = greetUser("Bob"); // logs "Welcome, Bob"
console.log(result); // undefined` },
    { type: 'heading', content: '2. Function Expression' },
    { type: 'example', title: 'Function stored in a variable', content: 'A function expression stores a function inside a variable. Unlike declarations, they are NOT hoisted - you must define them before calling them. Named function expressions are useful for recursion and better error messages.', language: 'javascript', code: `// Function expressions are NOT hoisted - must be defined before use
// sayBye("Alice"); // ❌ ReferenceError

const sayBye = function(name) {
  console.log("Goodbye, " + name);
};
sayBye("Alice"); // Works after declaration

// Named function expression (useful for recursion and debugging)
const factorial = function fact(n) {
  if (n <= 1) return 1;
  return n * fact(n - 1); // uses the name 'fact' for recursion
};
console.log(factorial(5)); // 120` },
    { type: 'heading', content: '3. Arrow Functions - Modern Syntax' },
    { type: 'example', title: 'Arrow functions - from verbose to concise', content: 'Arrow functions (=>) are the modern, shorter way to write functions. They are especially popular in React. When an arrow function has only one expression, you can skip the curly braces and the return keyword - the result is returned automatically. One important difference: arrow functions do NOT have their own "this", they inherit it from where they were defined.', language: 'javascript', code: `// Regular function:
function double(x) { return x * 2; }

// Arrow function equivalents (all do the same):
const double = (x) => { return x * 2; };
const double = x => { return x * 2; };    // no parens for single param
const double = x => x * 2;                 // implicit return (one expression)

// Multiple parameters - parens required
const add = (a, b) => a + b;
console.log(add(3, 4)); // 7

// No parameters - empty parens required
const greet = () => "Hello!";
console.log(greet()); // "Hello!"

// Returning an object - wrap in parentheses!
const makeUser = (name, age) => ({ name, age }); // ({ }) not { }
console.log(makeUser("Alex", 25)); // { name: "Alex", age: 25 }

// Arrow functions are perfect for callbacks
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2); // [2,4,6,8,10]
const evens   = numbers.filter(n => n % 2 === 0); // [2,4]
const sum     = numbers.reduce((acc, n) => acc + n, 0); // 15` },
    { type: 'note', title: 'Arrow functions do NOT have their own "this"', content: 'Arrow functions inherit "this" from their surrounding context. This makes them perfect for callbacks in class methods and React components. Regular functions create their own "this" - which causes bugs in class methods.' },
    { type: 'heading', content: '4. Parameters - Default, Rest, Destructuring' },
    { type: 'example', title: 'Advanced parameter patterns', content: 'Default parameters let you specify what value to use if an argument is not provided. Rest parameters (...args) collect any number of extra arguments into an array - perfect for functions like sum() that should accept any count of numbers. Destructuring in parameters lets you pull out just the properties you need from an object argument.', language: 'javascript', code: `// Default parameters
function greet(name = "Guest", emoji = "👋") {
  return \`Hello, \${name}! \${emoji}\`;
}
console.log(greet());            // "Hello, Guest! 👋"
console.log(greet("Alex"));     // "Hello, Alex! 👋"
console.log(greet("Mia", "🎉")); // "Hello, Mia! 🎉"

// Rest parameters - collect remaining args into array
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
console.log(sum(1, 2, 3));        // 6
console.log(sum(1, 2, 3, 4, 5)); // 15

// Mix of named + rest
function logMessage(level, ...messages) {
  console.log(\`[\${level.toUpperCase()}]\`, messages.join(" "));
}
logMessage("info", "Server", "started", "on port 3000");
// [INFO] Server started on port 3000

// Destructuring in parameters
function renderUser({ name, email, role = "user" }) {
  return \`\${name} (\${email}) - \${role}\`;
}
renderUser({ name: "Alex", email: "alex@example.com" });
// "Alex (alex@example.com) - user"

// Array destructuring in params
function first([a, b, ...rest]) {
  return { first: a, second: b, remaining: rest };
}
first([10, 20, 30, 40]); // { first: 10, second: 20, remaining: [30,40] }` },
    { type: 'heading', content: '5. Higher-Order Functions' },
    { type: 'example', title: 'Functions that accept or return functions', content: 'Higher-order functions either accept another function as an argument (callback) or return a function. This is how .map(), .filter(), .forEach() work - you pass them a function that they call for each item. Returning a function creates a "factory" that generates customized functions with preset values.', language: 'javascript', code: `// Passing a function as an argument (callback)
function doOperation(a, b, operation) {
  return operation(a, b);
}
console.log(doOperation(10, 5, (a, b) => a + b)); // 15
console.log(doOperation(10, 5, (a, b) => a * b)); // 50
console.log(doOperation(10, 5, Math.max));          // 10

// Returning a function (function factory)
function multiplier(factor) {
  return (number) => number * factor; // returns a function!
}
const double  = multiplier(2);
const triple  = multiplier(3);
const times10 = multiplier(10);
console.log(double(5));   // 10
console.log(triple(4));   // 12
console.log(times10(7));  // 70

// Real-world: configurable greeting
function makeGreeter(greeting) {
  return (name) => \`\${greeting}, \${name}!\`;
}
const sayHello = makeGreeter("Hello");
const sayHi    = makeGreeter("Hi");
console.log(sayHello("Alice")); // "Hello, Alice!"
console.log(sayHi("Bob"));      // "Hi, Bob!"` },
    { type: 'heading', content: '6. Closures - Functions Remember Their Environment' },
    { type: 'example', title: 'Closures - one of JavaScript\'s most powerful features', content: 'A closure happens when an inner function keeps access to variables from its outer function even after the outer function has finished running. Those variables are "trapped" inside the inner function. This is how you create private data in JavaScript - the count variable below cannot be accessed from outside, only through the returned methods.', language: 'javascript', code: `// A closure is when an inner function remembers variables from
// its outer function even after the outer function has returned

function makeCounter() {
  let count = 0; // this variable is "enclosed" in the inner function

  return {
    increment() { count++; return count; },
    decrement() { count--; return count; },
    reset()     { count = 0; return count; },
    getCount()  { return count; }
  };
}

const counter = makeCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1
console.log(counter.reset());     // 0

// count is private - cannot be accessed directly!
// console.log(counter.count); // undefined

// Practical closure: make a bank account
function createAccount(initialBalance) {
  let balance = initialBalance; // private!

  return {
    deposit(amount) {
      balance += amount;
      return \`Deposited $\${amount}. Balance: $\${balance}\`;
    },
    withdraw(amount) {
      if (amount > balance) return "Insufficient funds";
      balance -= amount;
      return \`Withdrew $\${amount}. Balance: $\${balance}\`;
    },
    getBalance() { return \`Balance: $\${balance}\`; }
  };
}

const account = createAccount(100);
console.log(account.deposit(50));   // "Deposited $50. Balance: $150"
console.log(account.withdraw(200)); // "Insufficient funds"
console.log(account.withdraw(30));  // "Withdrew $30. Balance: $120"` },
    { type: 'heading', content: '7. IIFE - Immediately Invoked Function Expression' },
    { type: 'example', title: 'Functions that run immediately', content: 'An IIFE (Immediately Invoked Function Expression) is a function that runs as soon as it is defined. You wrap it in parentheses and immediately call it with (). The main use case is creating a private scope - all variables inside the IIFE are invisible to the outside world, preventing name collisions in global scope.', language: 'javascript', code: `// IIFE: defined and called at the same time
(function() {
  const secret = "I am private";
  console.log("IIFE ran:", secret);
})(); // ← the () at the end calls it immediately

// Arrow IIFE
(() => {
  console.log("Arrow IIFE");
})();

// IIFE with parameters
((name) => {
  console.log(\`Hello from IIFE, \${name}!\`);
})("Alex");

// Use case: avoid polluting global scope
(function() {
  const config = { theme: "dark", lang: "en" };
  // All code here is isolated - config is private
  document.documentElement.dataset.theme = config.theme;
})();

// console.log(config); // ❌ ReferenceError - it's private` },
    { type: 'tryit', title: 'Try It: Functions Workshop',
      html: `<div id="app">
  <h2>Function Workshop</h2>
  <div class="section">
    <h3>1. Calculator (higher-order functions)</h3>
    <div class="row">
      <input id="n1" type="number" value="10" style="width:70px">
      <select id="calcOp">
        <option value="+">Add +</option><option value="-">Subtract −</option>
        <option value="*">Multiply ×</option><option value="/">Divide ÷</option>
        <option value="**">Power **</option>
      </select>
      <input id="n2" type="number" value="5" style="width:70px">
      <button onclick="calculate()">Calculate</button>
    </div>
    <p id="calcResult"></p>
  </div>
  <div class="section">
    <h3>2. Counter (closure)</h3>
    <div class="row">
      <button onclick="dec()">−1</button>
      <span id="countDisplay" style="font-size:28px;font-weight:800;min-width:50px;text-align:center;color:#2563eb">0</span>
      <button onclick="inc()">+1</button>
      <button onclick="rst()" style="background:#6b7280">Reset</button>
    </div>
  </div>
  <div class="section">
    <h3>3. Function Factory</h3>
    <input id="greeting" placeholder="Enter greeting..." value="Hello">
    <input id="fname" placeholder="Name" value="World">
    <button onclick="createGreet()">Create Greeting</button>
    <p id="greetResult"></p>
  </div>
</div>`,
      css: `#app{font-family:system-ui,sans-serif;padding:20px;max-width:500px;}
h2{color:#1e1e1e;margin-bottom:16px;}
h3{font-size:14px;font-weight:700;color:#374151;margin:0 0 10px;}
.section{margin-bottom:20px;padding:16px;background:white;border:1px solid #e5e7eb;border-radius:12px;}
.row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
input{padding:8px 10px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:14px;outline:none;flex:1;min-width:80px;}
select{padding:8px 10px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:14px;background:white;outline:none;}
button{padding:9px 16px;background:#2563eb;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:14px;}
p{margin:8px 0 0;color:#374151;font-size:14px;min-height:20px;font-weight:600;}`,
      js: `// Higher-order function
const ops = {
  '+': (a,b) => a+b, '-': (a,b) => a-b,
  '*': (a,b) => a*b, '/': (a,b) => b!==0?a/b:'Cannot divide by zero',
  '**': (a,b) => Math.pow(a,b)
};
function calculate() {
  const a = parseFloat(document.getElementById('n1').value);
  const b = parseFloat(document.getElementById('n2').value);
  const op = document.getElementById('calcOp').value;
  const result = ops[op](a, b);
  document.getElementById('calcResult').textContent = \`\${a} \${op} \${b} = \${typeof result === 'number' ? parseFloat(result.toFixed(4)) : result}\`;
}

// Closure counter
const counter = (() => {
  let n = 0;
  return { inc:()=>++n, dec:()=>--n, get:()=>n, reset:()=>{n=0;return n;} };
})();

function update() {
  const el = document.getElementById('countDisplay');
  el.textContent = counter.get();
  el.style.color = counter.get() > 0 ? '#16a34a' : counter.get() < 0 ? '#dc2626' : '#2563eb';
}
function inc(){counter.inc();update();}
function dec(){counter.dec();update();}
function rst(){counter.reset();update();}

// Function factory
function makeGreeter(g) { return n => \`\${g}, \${n}!\`; }
function createGreet() {
  const g = document.getElementById('greeting').value || 'Hello';
  const n = document.getElementById('fname').value || 'World';
  const greeter = makeGreeter(g);
  document.getElementById('greetResult').textContent = greeter(n);
}`,
      mode: 'full' },
    {
      type: 'heading',
      content: 'Common mistakes beginners make',
    },
    {
      type: 'list',
      items: [
        'Forgetting return. Fix: a function without return gives back undefined, so return the value you want the caller to receive.',
        'Calling a function without parentheses and expecting a result, for example greet instead of greet(). Fix: greet is the function itself, greet() runs it.',
        'Using an arrow function as an object method and expecting this to be the object. Fix: arrow functions do not have their own this; use a regular method for that case.',
        'Passing the result instead of the function to a callback, such as button.addEventListener("click", save()). Fix: pass save (no parentheses) so the browser calls it later.',
        'Changing an object or array that was passed in. Fix: arguments that are objects are shared with the caller, so copy them (spread) if you need to change them.',
        'Writing very long functions that do many jobs. Fix: split them into small functions with one clear job and a descriptive name.',
      ],
    },
    {
      type: 'heading',
      content: 'Where you use this in real projects',
    },
    {
      type: 'list',
      items: [
        'Event handlers: every click, input and submit in a web page runs a function.',
        'Helper functions such as formatPrice or isValidEmail that are reused across a project.',
        'Array methods (map, filter, reduce) take a function that describes what to do with each item.',
        'API helper functions that wrap fetch so headers and error handling live in one place.',
        'React components are functions that return the user interface.',
        'Closures create private state, for example a counter or a rate limiter.',
      ],
    },
    {
      type: 'heading',
      content: 'Practice task: Three small helper functions',
    },
    {
      type: 'text',
      content: 'Write add(a, b), greet(name) with the default value "friend", and applyDiscount(price, percent) where percent defaults to 10. Then call them as shown in the console lines and compare your output with the expected result.',
    },
    {
      type: 'tryit',
      title: 'Three small helper functions',
      content: 'Edit the starter code, press Run and compare the console output with the expected output below.',
      js: `function add(a, b) {
  // TODO: return the sum
}

function greet(name) {
  // TODO: give name a default of 'friend' and return 'Hello, ' + name + '!'
}

function applyDiscount(price, percent) {
  // TODO: default percent to 10 and return the discounted price
}

console.log(add(2, 3));
console.log(greet());
console.log(greet('Ada'));
console.log(applyDiscount(100));
console.log(applyDiscount(100, 25));`,
      mode: 'js',
    },
    {
      type: 'example',
      title: 'Expected output',
      content: 'Your console output should look exactly like this.',
      code: `5
Hello, friend!
Hello, Ada!
90
75`,
      language: 'text',
    },
    {
      type: 'tip',
      title: 'Hint',
      content: 'Default parameters are written in the parameter list: function greet(name = "friend"). A discount of p percent is price - (price * p) / 100.',
    },
    {
      type: 'example',
      title: 'Solution (try it yourself first)',
      content: 'One possible solution. Yours may look different and still be correct.',
      code: `function add(a, b) {
  return a + b;
}

function greet(name = 'friend') {
  return 'Hello, ' + name + '!';
}

function applyDiscount(price, percent = 10) {
  return price - (price * percent) / 100;
}

console.log(add(2, 3));
console.log(greet());
console.log(greet('Ada'));
console.log(applyDiscount(100));
console.log(applyDiscount(100, 25));`,
      language: 'javascript',
    },
    {
      type: 'heading',
      content: 'Frequently asked questions',
    },
    {
      type: 'note',
      title: 'What is the difference between a function declaration and an arrow function?',
      content: 'A declaration is hoisted, so you can call it before it appears in the file, and it has its own this. An arrow function is shorter, is not hoisted like a declaration, and uses the this of the surrounding code.',
    },
    {
      type: 'note',
      title: 'Do parameters and arguments mean the same thing?',
      content: 'Parameters are the names in the function definition. Arguments are the actual values you pass when you call it.',
    },
    {
      type: 'note',
      title: 'Why does my function return undefined?',
      content: 'Either there is no return statement, or return is followed by a line break so it returns nothing. Put the value on the same line as return.',
    },
    {
      type: 'note',
      title: 'When should I use a callback?',
      content: 'Use one when you want to hand a piece of behaviour to another function, such as what to do for each item or after a timer ends.',
    },
  ],
  exercises: [
    { id: 'fn-1', question: 'What is the concise arrow function for: function double(x) { return x * 2; }', type: 'multiple-choice', options: ['const double = x => x * 2;', 'const double = (x) { x * 2 }', 'arrow double(x) => x*2', 'const double = => x * 2'], correct: 0, explanation: 'const double = x => x * 2; - with a single parameter and a single-expression body, you can omit the parentheses around the parameter and the curly braces/return keyword.' },
    { id: 'fn-2', question: 'What is a closure?', type: 'multiple-choice', options: ['A function that calls itself', 'A function that remembers variables from its outer scope even after the outer function returns', 'A function with no parameters', 'A function that cannot be called'], correct: 1, explanation: 'A closure is formed when a function retains access to variables from its enclosing scope after the outer function has returned. This enables private data, function factories, and state management.' },
  ],
  quiz: [
    { id: 'qfn1', question: 'Which type of function can be called before its declaration?', options: ['Arrow functions', 'Function expressions', 'Function declarations', 'IIFE'], correct: 2, explanation: 'Function declarations are fully hoisted - the browser moves them to the top of their scope before execution. Arrow functions and function expressions stored in variables are NOT hoisted.' },
    { id: 'qfn2', question: 'What does the rest parameter (...args) do?', options: ['Spreads an array into arguments', 'Collects remaining function arguments into an array', 'Creates a copy of a function', 'Stops execution'], correct: 1, explanation: 'Rest parameters (...args) collect any number of remaining arguments into a single array. function sum(...nums) allows calling sum(1,2,3,4) where nums becomes [1,2,3,4].' },
  ],
};
