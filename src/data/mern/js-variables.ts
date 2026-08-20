import type { MernTopic } from './javascript-topics';

export const jsVariableTopics: MernTopic[] = [
  {
    id: 'js-variables',
    title: 'JavaScript Variables',
    slug: 'variables',
    subject: 'javascript',
    difficulty: 'beginner',
    readingTime: 10,
    description: 'Master let, const, and var. Understand when to use each, naming rules, and best practices.',
    prevTopic: 'output',
    nextTopic: 'data-types',
    sections: [
      {
        type: 'intro',
        content: 'Variables are containers that store data values. In JavaScript, you declare variables using three keywords: var (old, avoid), let (modern, can change), and const (modern, cannot be reassigned). Understanding the difference between these is one of the first critical skills.'
      },
      {
        type: 'heading',
        content: 'The Three Ways to Declare Variables'
      },
      {
        type: 'example',
        title: 'var, let, const — side by side',
        code: `// const — value cannot be reassigned (USE THIS BY DEFAULT)
const name = "Alex";
const age = 25;
const PI = 3.14159;

// let — value can change (use when you need to reassign)
let score = 0;
score = score + 10;  // OK: reassigning let
let isLoggedIn = false;
isLoggedIn = true;   // OK

// var — OLD, function-scoped (AVOID in modern code)
var oldWay = "avoid this";

console.log(name);      // "Alex"
console.log(score);     // 10
console.log(isLoggedIn); // true`,
        language: 'javascript',
        output: 'Alex\n10\ntrue'
      },
      {
        type: 'warning',
        title: 'Why avoid var?',
        content: 'var has "function scope" and is hoisted to the top of its function. This causes confusing bugs like variables being accessible before they\'re declared. Always use const by default, let when you need to change the value.'
      },
      {
        type: 'example',
        title: 'Why var causes bugs',
        code: `// var hoisting bug
console.log(x); // undefined (no error! — var is hoisted)
var x = 5;
console.log(x); // 5

// let does NOT have this problem
console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 5;

// var leaks out of blocks
if (true) {
  var leaked = "I escape the block";
  let blocked = "I stay in block";
}
console.log(leaked);  // "I escape the block" — BAD
console.log(blocked); // ReferenceError — GOOD, expected behavior`,
        language: 'javascript'
      },
      {
        type: 'heading',
        content: 'const Does NOT Mean Immutable'
      },
      {
        type: 'example',
        title: 'const with objects and arrays',
        code: `// const prevents REASSIGNMENT, not MUTATION
const user = { name: "Alex", age: 25 };
user.age = 26;        // OK — mutating the object
user.city = "NYC";    // OK — adding a property
// user = {};         // ERROR — cannot reassign const

const colors = ["red", "green", "blue"];
colors.push("yellow"); // OK — mutating the array
colors[0] = "purple";  // OK — modifying element
// colors = [];        // ERROR — cannot reassign const

console.log(user);
console.log(colors);`,
        language: 'javascript',
        output: '{ name: "Alex", age: 26, city: "NYC" }\n["purple", "green", "blue", "yellow"]'
      },
      {
        type: 'heading',
        content: 'Variable Naming Rules'
      },
      {
        type: 'example',
        title: 'Valid and invalid variable names',
        code: `// ✅ Valid names
let name = "Alex";
let _private = "internal";
let $price = 9.99;
let firstName = "Jordan";    // camelCase — JavaScript convention
let MAX_SIZE = 100;          // SCREAMING_SNAKE_CASE — for constants
let user1 = "first user";

// ❌ Invalid names
// let 1name = "bad";       // Cannot start with number
// let my-name = "bad";     // Hyphens not allowed
// let let = "bad";         // Reserved keyword
// let class = "bad";       // Reserved keyword

// ⚠️ Case sensitive!
let score = 10;
let Score = 20;   // Different variable from score!
let SCORE = 30;   // Also different!
console.log(score, Score, SCORE); // 10 20 30`,
        language: 'javascript'
      },
      {
        type: 'heading',
        content: 'Declaring Multiple Variables'
      },
      {
        type: 'example',
        title: 'Multiple declarations',
        code: `// One at a time (most readable)
const firstName = "Alex";
const lastName = "Smith";
const age = 25;

// Multiple on one line (less readable, avoid)
let x = 1, y = 2, z = 3;

// Destructuring (modern, very common in React/MERN)
const { name, email } = { name: "Alex", email: "alex@example.com" };
const [first, second] = ["apple", "banana", "cherry"];

console.log(name);   // "Alex"
console.log(first);  // "apple"`,
        language: 'javascript'
      },
      {
        type: 'heading',
        content: 'Scope: Where Variables Live'
      },
      {
        type: 'example',
        title: 'Block scope vs function scope',
        code: `// Global scope — accessible everywhere
const globalVar = "I am global";

function myFunction() {
  // Function scope — only inside this function
  const funcVar = "I am in a function";

  if (true) {
    // Block scope — only inside this { }
    const blockVar = "I am in a block";
    let alsoBlock = "also block scoped";
    console.log(globalVar);   // ✅ accessible
    console.log(funcVar);     // ✅ accessible
    console.log(blockVar);    // ✅ accessible
  }

  console.log(globalVar);     // ✅
  console.log(funcVar);       // ✅
  // console.log(blockVar);   // ❌ ReferenceError
}

myFunction();
console.log(globalVar);       // ✅
// console.log(funcVar);      // ❌ ReferenceError`,
        language: 'javascript'
      },
      {
        type: 'tryit',
        title: 'Try: Variables in Action',
        html: '<div id="app">\n  <h2>Variable Explorer</h2>\n  <input id="inp" type="text" placeholder="Enter your name"/>\n  <button id="greet">Greet Me</button>\n  <button id="count">Count Clicks</button>\n  <p id="output"></p>\n  <p id="counter">Clicks: 0</p>\n</div>',
        css: '#app{font-family:sans-serif;padding:20px;max-width:400px;}\ninput{padding:8px 12px;border:1px solid #e2e8f0;border-radius:6px;font-size:14px;margin-right:8px;}\nbutton{padding:8px 16px;background:#2563eb;color:white;border:none;border-radius:6px;cursor:pointer;margin:4px;}\n#output{font-size:20px;font-weight:bold;color:#2563eb;margin-top:12px;}\n#counter{color:#64748b;}',
        js: '// const — won\'t change\nconst greeting = "Hello";\n\n// let — will change\nlet clickCount = 0;\n\ndocument.getElementById("greet").onclick = function() {\n  const name = document.getElementById("inp").value || "Stranger";\n  document.getElementById("output").textContent = greeting + ", " + name + "! 👋";\n};\n\ndocument.getElementById("count").onclick = function() {\n  clickCount++; // let variable changes\n  document.getElementById("counter").textContent = "Clicks: " + clickCount;\n};',
        mode: 'full'
      }
    ],
    exercises: [
      {
        id: 'var-1',
        question: 'Which keyword should you use by default when declaring variables in modern JavaScript?',
        type: 'multiple-choice',
        options: ['var', 'let', 'const', 'def'],
        correct: 2,
        explanation: 'Use const by default. Only use let when you need to reassign the variable. Avoid var.'
      },
      {
        id: 'var-2',
        question: 'What is the output of: const arr = [1,2,3]; arr.push(4); console.log(arr.length);',
        type: 'code-output',
        correct: '4',
        explanation: 'const prevents reassignment of arr itself, but you can still mutate the array. push() adds an element, making length 4.'
      },
      {
        id: 'var-3',
        question: 'A variable declared with const ___',
        type: 'multiple-choice',
        options: [
          'Cannot be changed at all',
          'Cannot be reassigned but its object/array contents can change',
          'Is the same as let',
          'Is only accessible in functions'
        ],
        correct: 1,
        explanation: 'const prevents reassignment (you cannot do arr = []), but you can still push, pop, or modify properties of the object/array it references.'
      }
    ],
    quiz: [
      { id: 'vq1', question: 'What does "hoisting" mean in JavaScript?', options: ['Moving code to a server', 'Variable declarations being moved to top of scope', 'Increasing variable value', 'None of these'], correct: 1, explanation: 'Hoisting means variable and function declarations are moved to the top of their scope during compilation.' },
      { id: 'vq2', question: 'Which is valid JavaScript variable name?', options: ['1name', 'my-var', '$userName', 'class'], correct: 2, explanation: '$userName is valid. Variable names can start with $, _, or a letter. They cannot start with numbers or contain hyphens.' }
    ]
  },
  {
    id: 'js-data-types',
    title: 'JavaScript Data Types',
    slug: 'data-types',
    subject: 'javascript',
    difficulty: 'beginner',
    readingTime: 12,
    description: 'Master all 8 JavaScript data types — strings, numbers, booleans, null, undefined, symbol, bigint, and objects.',
    prevTopic: 'variables',
    nextTopic: 'operators',
    sections: [
      {
        type: 'intro',
        content: 'JavaScript has 8 data types. The first 7 are called "primitive" types — they hold a single value. The 8th is "object" — it holds collections of values. Understanding types is essential because JavaScript is dynamically typed: variables can hold any type and can change type at runtime.'
      },
      {
        type: 'example',
        title: 'All 8 JavaScript Data Types',
        code: `// 1. String — text, always in quotes
const name = "Alex";
const greeting = 'Hello World';
const template = \`My name is \${name}\`;  // template literal

// 2. Number — integers AND decimals (one type!)
const age = 25;
const price = 9.99;
const negative = -100;
const infinity = Infinity;
const notANumber = NaN;

// 3. Boolean — true or false only
const isLoggedIn = true;
const hasPermission = false;

// 4. Undefined — variable declared but no value assigned
let x;
console.log(x); // undefined

// 5. Null — intentional absence of value
const selectedUser = null;

// 6. Symbol — unique identifier (advanced)
const id = Symbol("id");

// 7. BigInt — very large integers
const bigNumber = 9007199254740991n;

// 8. Object — collection of key-value pairs
const user = {
  name: "Alex",
  age: 25,
  isActive: true
};

// typeof operator — check any value's type
console.log(typeof name);        // "string"
console.log(typeof age);         // "number"
console.log(typeof isLoggedIn);  // "boolean"
console.log(typeof x);           // "undefined"
console.log(typeof null);        // "object" ← famous JS quirk!
console.log(typeof user);        // "object"
console.log(typeof id);          // "symbol"`,
        language: 'javascript'
      },
      {
        type: 'warning',
        title: 'typeof null === "object" is a JavaScript bug',
        content: 'typeof null returns "object" which is wrong. This is a decades-old bug in JavaScript that cannot be fixed without breaking millions of websites. To check for null specifically, use: if (value === null).'
      },
      {
        type: 'heading',
        content: 'Strings in Depth'
      },
      {
        type: 'example',
        title: 'String methods every developer must know',
        code: `const str = "Hello, World!";

// Length
console.log(str.length);          // 13

// Access characters
console.log(str[0]);               // "H"
console.log(str.charAt(7));        // "W"

// Case
console.log(str.toUpperCase());    // "HELLO, WORLD!"
console.log(str.toLowerCase());    // "hello, world!"

// Search
console.log(str.includes("World")); // true
console.log(str.indexOf("o"));      // 4 (first occurrence)
console.log(str.startsWith("Hello")); // true
console.log(str.endsWith("!"));       // true

// Extract
console.log(str.slice(7, 12));     // "World"
console.log(str.slice(-6));        // "orld!"  (negative = from end)

// Replace
console.log(str.replace("World", "JavaScript")); // "Hello, JavaScript!"

// Split
console.log("a,b,c".split(","));   // ["a", "b", "c"]
console.log("hello".split(""));    // ["h","e","l","l","o"]

// Trim whitespace
console.log("  hello  ".trim());   // "hello"

// Repeat
console.log("ha".repeat(3));       // "hahaha"

// Template Literals — the modern way
const name = "Alex";
const age = 25;
const msg = \`My name is \${name} and I am \${age} years old.\`;
const math = \`2 + 2 = \${2 + 2}\`;
console.log(msg);   // "My name is Alex and I am 25 years old."
console.log(math);  // "2 + 2 = 4"`,
        language: 'javascript'
      },
      {
        type: 'heading',
        content: 'Numbers in Depth'
      },
      {
        type: 'example',
        title: 'Number methods and Math object',
        code: `const num = 3.14159;

// toFixed — limit decimal places (returns string!)
console.log(num.toFixed(2));        // "3.14"
console.log(num.toFixed(0));        // "3"

// toString — convert to string
console.log((255).toString(16));    // "ff" (hexadecimal)
console.log((255).toString(2));     // "11111111" (binary)

// Number() — convert string to number
console.log(Number("42"));          // 42
console.log(Number("3.14"));        // 3.14
console.log(Number(""));            // 0
console.log(Number("hello"));       // NaN

// parseInt and parseFloat
console.log(parseInt("42px"));      // 42 (stops at non-numeric)
console.log(parseFloat("3.14em"));  // 3.14

// Check for NaN
console.log(isNaN("hello"));        // true
console.log(Number.isNaN(NaN));     // true (stricter version)

// Math object
console.log(Math.round(4.6));       // 5
console.log(Math.floor(4.9));       // 4
console.log(Math.ceil(4.1));        // 5
console.log(Math.max(1, 5, 3, 9)); // 9
console.log(Math.min(1, 5, 3, 9)); // 1
console.log(Math.abs(-42));         // 42
console.log(Math.sqrt(16));         // 4
console.log(Math.pow(2, 10));       // 1024
console.log(Math.random());         // 0 to 1 (exclusive)

// Random integer between min and max
const min = 1, max = 100;
const random = Math.floor(Math.random() * (max - min + 1)) + min;
console.log(random);  // e.g. 47`,
        language: 'javascript'
      },
      {
        type: 'heading',
        content: 'Type Conversion and Coercion'
      },
      {
        type: 'example',
        title: 'Explicit vs implicit type conversion',
        code: `// EXPLICIT conversion (you control it)
console.log(String(42));         // "42"
console.log(String(true));       // "true"
console.log(String(null));       // "null"
console.log(Number("42"));       // 42
console.log(Number(true));       // 1
console.log(Number(false));      // 0
console.log(Boolean(1));         // true
console.log(Boolean(0));         // false
console.log(Boolean(""));        // false
console.log(Boolean("hello"));   // true
console.log(Boolean(null));      // false
console.log(Boolean(undefined)); // false

// IMPLICIT coercion (JavaScript does it automatically — be careful!)
console.log("5" + 3);    // "53"  — number becomes string (+ concatenates)
console.log("5" - 3);    // 2     — string becomes number (- forces numeric)
console.log("5" * "2");  // 10    — both become numbers
console.log(true + 1);   // 2     — true becomes 1
console.log(false + 1);  // 1     — false becomes 0
console.log("" + 0);     // "0"   — number becomes string
console.log(null + 1);   // 1     — null becomes 0

// The loose equality trap
console.log(0 == false);   // true  ← coercion
console.log("" == false);  // true  ← coercion
console.log(null == undefined); // true ← coercion
console.log(0 === false);  // false ← strict, no coercion (USE THIS)`,
        language: 'javascript'
      },
      {
        type: 'tryit',
        title: 'Try: Type Explorer',
        html: '<div id="app">\n  <h2>JavaScript Type Explorer</h2>\n  <input id="inp" placeholder="Enter any value" />\n  <button id="check">Check Type</button>\n  <div id="result"></div>\n</div>',
        css: '#app{font-family:sans-serif;padding:20px;max-width:500px;}\ninput{padding:8px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;margin-right:8px;width:200px;}\nbutton{padding:8px 16px;background:#2563eb;color:white;border:none;border-radius:6px;cursor:pointer;}\n#result{margin-top:16px;padding:16px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;font-family:monospace;}',
        js: 'document.getElementById("check").onclick = function() {\n  let val = document.getElementById("inp").value;\n  let result = [];\n  \n  // Try to parse as number\n  const asNum = Number(val);\n  const asJSON = (() => { try { return JSON.parse(val); } catch { return "cannot parse"; }})();\n  \n  result.push("Input: \\"" + val + "\\"");\n  result.push("typeof (string): " + typeof val);\n  result.push("As Number: " + asNum + " (isNaN: " + isNaN(asNum) + ")");\n  result.push("As Boolean: " + Boolean(val));\n  result.push("Length: " + val.length);\n  result.push("Trimmed: \\"" + val.trim() + "\\"");\n  result.push("UpperCase: " + val.toUpperCase());\n  \n  document.getElementById("result").innerHTML = result.join("<br>");\n};',
        mode: 'full'
      }
    ],
    exercises: [
      {
        id: 'dt-1',
        question: 'What does typeof null return?',
        type: 'multiple-choice',
        options: ['"null"', '"undefined"', '"object"', '"boolean"'],
        correct: 2,
        explanation: 'typeof null returns "object" — this is a famous JavaScript bug from 1995 that cannot be fixed without breaking existing code.'
      },
      {
        id: 'dt-2',
        question: 'What is the output of: console.log("5" + 3)?',
        type: 'code-output',
        correct: '53',
        explanation: 'When using + with a string, JavaScript concatenates instead of adding. "5" + 3 becomes "53" (string).'
      },
      {
        id: 'dt-3',
        question: 'Which values are falsy in JavaScript?',
        type: 'multiple-choice',
        options: [
          'Only false',
          '0, "", null, undefined, NaN, false',
          '0, false, null',
          'null and undefined only'
        ],
        correct: 1,
        explanation: 'The 6 falsy values in JavaScript are: 0, "" (empty string), null, undefined, NaN, and false. Everything else is truthy.'
      }
    ]
  }
];
