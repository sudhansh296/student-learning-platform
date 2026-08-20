import type { JSLesson } from '../js-curriculum';

export const jsScopeClosuresLesson: JSLesson = {
  id:'js-scope',title:'Scope, Hoisting & Closures',slug:'scope-closures',
  chapter:'advanced',order:17,difficulty:'advanced',readingTime:14,
  description:'Deep dive into JavaScript scope, the execution context, hoisting, temporal dead zone, and closures — the concepts behind how JS really works.',
  sections:[
    {type:'text',content:'Understanding scope and closures separates developers who write JavaScript from those who truly understand it. These concepts explain WHY JavaScript behaves the way it does and enable powerful patterns like module patterns, memoization, and private data.'},
    {type:'heading',content:'Scope — Where Variables Exist'},
    {type:'example',title:'Three types of scope',content:'Scope controls where a variable can be accessed. Global scope means accessible everywhere. Function scope means only inside that function. Block scope (let and const) means only inside the { } where it was declared. The scope chain is what lets inner functions read outer variables — JavaScript looks outward through each scope layer until it finds the variable or reaches the global scope.',language:'javascript',code:`// 1. GLOBAL SCOPE — accessible everywhere
const global = "I am global";
window.globalVar = "also global"; // in browsers, window IS global

// 2. FUNCTION SCOPE — only inside the function
function example() {
  var functionScoped = "only inside function";
  const alsoFunction = "also function scope";
  console.log(global);         // ✅ can access global
  console.log(functionScoped); // ✅ within scope
}
// console.log(functionScoped); // ❌ ReferenceError

// 3. BLOCK SCOPE — inside { } (let and const only!)
{
  let blockVar   = "only in this block";
  const blockConst = "also block scoped";
  var escaped    = "var ESCAPES blocks!"; // ⚠️ var is function scoped
}
// console.log(blockVar);  // ❌ ReferenceError
console.log(escaped);       // ✅ var leaks out of blocks!

// Scope chain — inner functions can access outer variables
function outer() {
  const outerVar = "outer";
  function inner() {
    const innerVar = "inner";
    console.log(outerVar); // ✅ inner can access outer
    console.log(innerVar); // ✅
  }
  inner();
  // console.log(innerVar); // ❌
}`},
    {type:'heading',content:'Execution Context and Call Stack'},
    {type:'example',title:'How JS executes code',content:'Every time JavaScript calls a function, it creates an "execution context" and pushes it onto the call stack. When the function returns, its context is popped off. The call stack is why error stack traces show a list of function names — it is the literal history of which functions called which. JavaScript is single-threaded, meaning only one execution context is active at any moment.',language:'javascript',code:`// JavaScript creates an Execution Context for every function call
// Each context has: variable environment + outer scope reference

// When JS starts: Global Execution Context is created
// When function is called: New Execution Context pushed to Call Stack
// When function returns: Context popped from Call Stack

function first() {
  console.log("first: start");
  second();    // pushes second's context to stack
  console.log("first: end");  // executes after second returns
}

function second() {
  console.log("second: start");
  third();     // pushes third's context to stack
  console.log("second: end");
}

function third() {
  console.log("third");
}

first();
// Call stack: [global] → [global, first] → [global, first, second]
// → [global, first, second, third] → [global, first, second]
// → [global, first] → [global]
// Output:
// first: start
// second: start
// third
// second: end
// first: end`},
    {type:'heading',content:'Closures — Functions Remember Their Scope'},
    {type:'example',title:'Closures in depth',content:'A closure is formed when a function retains access to its outer scope even after the outer function has finished executing. When makeMultiplier(2) returns, the factor variable should be gone — but the returned function still has access to it. This is a closure. Each call to makeMultiplier() creates a completely separate closure with its own private copy of factor. Closures are how you create private state in JavaScript.',language:'javascript',code:`// A closure: function + its lexical scope (environment at creation)
function makeMultiplier(factor) {
  // factor is "enclosed" in the returned function
  return function(number) {
    return number * factor; // still has access to factor!
  };
}

const double = makeMultiplier(2);
const triple = makeMultiplier(3);
// makeMultiplier has returned, but factor is preserved!
console.log(double(5));  // 10 — factor=2 preserved
console.log(triple(4));  // 12 — factor=3 preserved

// Each call creates a new closure with its OWN scope
const counter1 = (() => {
  let count = 0; // private variable!
  return {
    increment: () => ++count,
    decrement: () => --count,
    value: () => count,
  };
})();

const counter2 = (() => {
  let count = 0;
  return { increment: () => ++count, value: () => count };
})();

counter1.increment(); counter1.increment();
counter2.increment();
console.log(counter1.value()); // 2 — independent from counter2
console.log(counter2.value()); // 1

// Closure in loops — the classic problem and solution
// PROBLEM:
const funcs = [];
for (var i = 0; i < 3; i++) {
  funcs.push(() => console.log(i)); // captures SAME i (var)
}
funcs.forEach(f => f()); // 3, 3, 3 ← bug!

// SOLUTION 1: use let (block-scoped)
const funcs2 = [];
for (let j = 0; j < 3; j++) {
  funcs2.push(() => console.log(j)); // captures its OWN j
}
funcs2.forEach(f => f()); // 0, 1, 2 ✅

// SOLUTION 2: IIFE to capture value
const funcs3 = [];
for (var k = 0; k < 3; k++) {
  funcs3.push(((n) => () => console.log(n))(k)); // capture k by value
}
funcs3.forEach(f => f()); // 0, 1, 2 ✅`},
    {type:'heading',content:'Practical Closure Patterns'},
    {type:'example',title:'Real-world closure applications',content:'Closures power some of the most important patterns in JavaScript. Memoization uses a closure to cache results — the cache Map lives inside the closure and persists between calls. Partial application uses a closure to "remember" preset arguments. The once() pattern uses a closed-over called flag to make a function run only one time. These are the patterns you will see in libraries like React hooks and Lodash.',language:'javascript',code:`// 1. MEMOIZATION — cache expensive results
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log("Cache hit!");
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const expensiveCalc = memoize((n) => {
  // Simulate expensive operation
  let sum = 0;
  for (let i = 0; i < n; i++) sum += i;
  return sum;
});

expensiveCalc(1000000); // computes
expensiveCalc(1000000); // "Cache hit!" — instant!

// 2. PARTIAL APPLICATION — preset some arguments
function partial(fn, ...presetArgs) {
  return function(...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
}

const add = (a, b) => a + b;
const add5 = partial(add, 5);
add5(3); // 8
add5(10); // 15

// 3. ONCE — function that runs only once
function once(fn) {
  let called = false, result;
  return function(...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}

const initDB = once(() => {
  console.log("DB initialized");
  return { connected: true };
});

initDB(); // "DB initialized" — runs
initDB(); // silent — won't run again
initDB(); // silent`},
    {type:'tryit',title:'Try It: Closures in Practice',
     html:`<div id="app">
  <h2>Closure Demos</h2>
  <h3>1. Counter with private state</h3>
  <div class="row">
    <button onclick="c1.decrement()">−</button>
    <span id="c1val">0</span>
    <button onclick="c1.increment()">+</button>
  </div>
  <p id="c1info"></p>
  <h3>2. Memoized Fibonacci</h3>
  <div class="row">
    <input id="fibInput" type="number" value="10" min="0" max="40"/>
    <button onclick="calcFib()">Calculate fib(n)</button>
  </div>
  <p id="fibResult"></p>
  <h3>3. Function Factory</h3>
  <button onclick="demoFactory()">Run greeting factory</button>
  <pre id="factoryResult"></pre>
</div>`,
     css:`#app{font-family:system-ui,sans-serif;padding:20px;max-width:460px;}
h2{color:#1e1e1e;}h3{font-size:14px;font-weight:700;color:#374151;margin:16px 0 8px;}
.row{display:flex;align-items:center;gap:10px;}
button{padding:8px 16px;background:#2563eb;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;}
input[type=number]{padding:9px;border:1.5px solid #e5e7eb;border-radius:8px;width:80px;font-size:14px;outline:none;}
#c1val{font-size:28px;font-weight:800;min-width:50px;text-align:center;color:#2563eb;}
p,pre{margin:6px 0;font-size:13px;color:#374151;}
pre{background:#f8fafc;border:1px solid #e2e8f0;padding:10px;border-radius:8px;white-space:pre-wrap;}`,
     js:`// 1. Counter closure
const c1 = (() => {
  let n = 0;
  function update() {
    document.getElementById('c1val').textContent = n;
    document.getElementById('c1val').style.color = n>0?'#16a34a':n<0?'#dc2626':'#2563eb';
    document.getElementById('c1info').textContent = 'Private count: ' + n + ' (cannot be accessed directly!)';
  }
  return {
    increment() { n++; update(); },
    decrement() { n--; update(); },
  };
})();

// 2. Memoized Fibonacci
function memoize(fn) {
  const cache = {};
  return function(n) {
    if (n in cache) return cache[n];
    cache[n] = fn(n);
    return cache[n];
  };
}

const fib = memoize(function(n) {
  if (n <= 1) return n;
  return fib(n-1) + fib(n-2); // recursive — cache makes this fast
});

function calcFib() {
  const n = parseInt(document.getElementById('fibInput').value);
  const t = performance.now();
  const result = fib(n);
  const ms = (performance.now()-t).toFixed(3);
  document.getElementById('fibResult').textContent = \`fib(\${n}) = \${result} (computed in \${ms}ms)\`;
}

// 3. Function factory
function makeGreeter(greeting) {
  return (name) => \`\${greeting}, \${name}! 👋\`;
}

function demoFactory() {
  const hello  = makeGreeter("Hello");
  const hi     = makeGreeter("Hi");
  const bonjour = makeGreeter("Bonjour");
  const lines = [
    'const hello   = makeGreeter("Hello");',
    'const hi      = makeGreeter("Hi");',
    'const bonjour = makeGreeter("Bonjour");',
    '',
    'hello("Alice")   → ' + hello("Alice"),
    'hi("Bob")        → ' + hi("Bob"),
    'bonjour("Marie") → ' + bonjour("Marie"),
  ];
  document.getElementById('factoryResult').textContent = lines.join('\\n');
}`,mode:'full'},
  ],
  exercises:[{id:'sc-1',question:'What is a closure?',type:'multiple-choice',options:['A function with no return value','A function that has access to variables from its outer scope even after the outer function has returned','A self-invoking function','A function that calls itself'],correct:1,explanation:'A closure is formed when a function retains access to its lexical scope (outer variables) after the outer function has returned. The inner function "closes over" the outer variables, keeping them alive.'}],
  quiz:[{id:'qsc1',question:'Why does this print 3,3,3: for(var i=0;i<3;i++){setTimeout(()=>console.log(i),0)}?',options:['setTimeout is broken','var is function-scoped — there is only ONE i, and by the time callbacks run, i=3','setTimeout delays by 3 seconds','console.log is asynchronous'],correct:1,explanation:'var is function-scoped (not block-scoped), so all three closures share the SAME i variable. By the time the setTimeout callbacks run (even with 0ms), the loop has finished and i=3. Fix: use let (creates a new i per iteration).'}],
};
