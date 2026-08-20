// Full JavaScript curriculum data — topics with exercises, quizzes, and live IDE examples

export interface JSLesson {
  id: string;
  title: string;
  slug: string;
  chapter: string;
  order: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readingTime: number;
  description: string;
  sections: JSSection[];
  exercises: JSExercise[];
  quiz: JSQuiz[];
}

export interface JSSection {
  type: 'text' | 'heading' | 'code' | 'example' | 'tryit' | 'tip' | 'warning' | 'note' | 'analogy' | 'list';
  title?: string;
  content?: string;
  code?: string;
  language?: string;
  output?: string;
  items?: string[];
  // For tryit sections:
  html?: string;
  css?: string;
  js?: string;
  mode?: 'html' | 'css' | 'js' | 'full';
}

export interface JSExercise {
  id: string;
  question: string;
  type: 'multiple-choice' | 'fill-blank' | 'code-output';
  options?: string[];
  correct: string | number;
  explanation: string;
}

export interface JSQuiz {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const jsChapters = [
  { id: 'intro',    title: 'Introduction',      icon: '🚀' },
  { id: 'basics',   title: 'Basics',            icon: '📝' },
  { id: 'functions',title: 'Functions',         icon: '⚙️' },
  { id: 'data',     title: 'Data Structures',   icon: '📦' },
  { id: 'dom',      title: 'DOM & Browser',     icon: '🌐' },
  { id: 'async',    title: 'Async JavaScript',  icon: '⚡' },
  { id: 'advanced', title: 'Advanced JS',       icon: '🔬' },
  { id: 'es6',      title: 'Modern ES6+',       icon: '✨' },
];

export const jsLessons: JSLesson[] = [
  // ─────────────────────────────────────────────────────────────
  // CHAPTER: INTRODUCTION
  // ─────────────────────────────────────────────────────────────
  {
    id: 'intro-1',
    title: 'Introduction to JavaScript',
    slug: 'introduction',
    chapter: 'intro',
    order: 1,
    difficulty: 'beginner',
    readingTime: 6,
    description: 'What JavaScript is, where it runs, what you can build with it, and your first program.',
    sections: [
      {
        type: 'text',
        content: 'JavaScript is the only programming language that runs natively in every web browser. It brings websites to life — handling user interactions, fetching data, updating the page, and running logic. With Node.js it also powers backend servers, APIs, and command-line tools.'
      },
      {
        type: 'analogy',
        title: 'The three layers of the web',
        content: 'Think of a website like a person: HTML is the skeleton (structure and content), CSS is the appearance (style), and JavaScript is the brain and muscles (logic and behavior). Remove JavaScript and the page just sits there — no interactions, no dynamic content.'
      },
      { type: 'heading', content: 'What Can You Build?' },
      {
        type: 'list',
        items: [
          'Interactive websites — dropdown menus, modals, sliders, tabs',
          'Single Page Applications (SPAs) — React, Vue, Angular apps',
          'REST APIs and backend servers with Node.js + Express',
          'Real-time apps (chat, live notifications) with WebSockets',
          'Mobile apps with React Native',
          'Desktop apps with Electron (VS Code is built with it!)',
          'Browser extensions for Chrome and Firefox',
          'Databases queries via MongoDB/mongoose in Node.js'
        ]
      },
      { type: 'heading', content: 'Your First JavaScript Program' },
      {
        type: 'example',
        title: 'Hello World — three ways',
        code: `// 1. Log to the browser console (developer tool)
console.log("Hello, World!");

// 2. Show a browser popup
alert("Hello, World!");

// 3. Write into the HTML page
document.getElementById("demo").innerHTML = "Hello, World!";

// 4. Log different data types
console.log(42);
console.log(true);
console.log([1, 2, 3]);
console.log({ name: "Alex" });`,
        language: 'javascript',
        output: 'Hello, World!\n42\ntrue\n[1, 2, 3]\n{ name: "Alex" }'
      },
      {
        type: 'tryit',
        title: 'Try It — Your First JavaScript',
        html: `<h1 id="title">JavaScript is awesome!</h1>
<p id="subtitle">Click a button below to interact with this page</p>
<div class="buttons">
  <button onclick="changeText()">Change Text</button>
  <button onclick="changeColor()">Change Color</button>
  <button onclick="addElement()">Add Element</button>
  <button onclick="showDate()">Show Date & Time</button>
</div>
<div id="output"></div>`,
        css: `body { font-family: system-ui, sans-serif; padding: 24px; max-width: 500px; }
h1 { color: #2563eb; font-size: 22px; }
p { color: #64748b; font-size: 14px; }
.buttons { display: flex; flex-wrap: wrap; gap: 8px; margin: 16px 0; }
button { padding: 9px 16px; background: #2563eb; color: white; border: none;
  border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; }
button:hover { background: #1d4ed8; }
#output { margin-top: 12px; }`,
        js: `const colors = ['#ef4444','#f59e0b','#10b981','#8b5cf6','#ec4899'];
let colorIndex = 0;

function changeText() {
  const messages = [
    'You clicked the button! 🎉',
    'JavaScript is responding! ⚡',
    'DOM manipulation works! 🌐',
    'Try all the buttons! 🚀'
  ];
  document.getElementById('title').textContent =
    messages[Math.floor(Math.random() * messages.length)];
}

function changeColor() {
  document.getElementById('title').style.color = colors[colorIndex % colors.length];
  colorIndex++;
}

function addElement() {
  const p = document.createElement('p');
  p.textContent = '✅ New element added at ' + new Date().toLocaleTimeString();
  p.style.cssText = 'background:#dcfce7;padding:8px 12px;border-radius:6px;font-size:13px;margin:4px 0;';
  document.getElementById('output').appendChild(p);
}

function showDate() {
  document.getElementById('title').textContent =
    '🕐 ' + new Date().toLocaleString();
}`,
        mode: 'full'
      },
      {
        type: 'note',
        title: 'JavaScript ≠ Java',
        content: 'Despite the name, JavaScript and Java are completely different languages. JavaScript was named after Java for marketing reasons in 1995. They share no syntax, runtime, or use case.'
      }
    ],
    exercises: [
      {
        id: 'intro-ex-1',
        question: 'Which method outputs text to the browser developer console?',
        type: 'multiple-choice',
        options: ['document.write()', 'console.log()', 'window.print()', 'alert()'],
        correct: 1,
        explanation: 'console.log() writes to the browser\'s developer console. Open DevTools with F12 to see it. It\'s the primary tool for debugging JavaScript.'
      },
      {
        id: 'intro-ex-2',
        question: 'JavaScript can only run in web browsers. True or False?',
        type: 'multiple-choice',
        options: ['True', 'False — it also runs on servers via Node.js', 'True — but only Chrome', 'False — it only runs on servers'],
        correct: 1,
        explanation: 'JavaScript runs in browsers (client-side) AND on servers via Node.js (server-side). This is what makes the MERN stack possible.'
      },
      {
        id: 'intro-ex-3',
        question: 'What is the output of: console.log(typeof "hello")',
        type: 'code-output',
        correct: 'string',
        explanation: 'The typeof operator returns the type of a value as a string. typeof "hello" returns "string".'
      }
    ],
    quiz: [
      {
        id: 'intro-q1',
        question: 'Which of the following is NOT something JavaScript can do?',
        options: [
          'Change HTML content dynamically',
          'Fetch data from an API',
          'Compile to machine code directly',
          'Handle user click events'
        ],
        correct: 2,
        explanation: 'JavaScript is interpreted (or JIT-compiled internally), not compiled to machine code by the developer. The others are all core JavaScript capabilities.'
      },
      {
        id: 'intro-q2',
        question: 'What does the acronym MERN stand for?',
        options: [
          'Machine, Engine, Runtime, Node',
          'MongoDB, Express, React, Node.js',
          'MySQL, Express, React, Nginx',
          'MongoDB, Electron, Redux, Node'
        ],
        correct: 1,
        explanation: 'MERN = MongoDB (database) + Express.js (backend framework) + React (frontend) + Node.js (runtime). All JavaScript!'
      }
    ]
  },
  // ─────────────────────────────────────────────────────────────
  // CHAPTER: BASICS — Output
  // ─────────────────────────────────────────────────────────────
  {
    id: 'basics-output',
    title: 'JavaScript Output',
    slug: 'output',
    chapter: 'basics',
    order: 2,
    difficulty: 'beginner',
    readingTime: 5,
    description: 'All the ways to output data in JavaScript — console, alert, DOM, and document.write.',
    sections: [
      {
        type: 'text',
        content: 'JavaScript has several ways to display output. Each is used in different situations. As a developer, console.log() will be your best friend — you\'ll use it hundreds of times every day to debug your code.'
      },
      { type: 'heading', content: 'console.log() — The Developer\'s Tool' },
      {
        type: 'example',
        title: 'console methods',
        code: `// console.log — most common, for any value
console.log("Hello World");
console.log(42, true, [1,2,3]);
console.log("Name:", "Alex", "Age:", 25);

// console.error — shows in red, for errors
console.error("Something went wrong!");

// console.warn — shows in yellow, for warnings
console.warn("This is deprecated");

// console.table — displays arrays/objects as a table (great!)
console.table([
  { name: "Alice", score: 95 },
  { name: "Bob",   score: 87 },
  { name: "Carol", score: 92 }
]);

// console.group — group related logs
console.group("User Info");
console.log("Name: Alex");
console.log("Role: Admin");
console.groupEnd();

// console.time — measure performance
console.time("loop");
for (let i = 0; i < 1000000; i++) {}
console.timeEnd("loop"); // "loop: 2.3ms"`,
        language: 'javascript'
      },
      { type: 'heading', content: 'Writing to the HTML Page' },
      {
        type: 'example',
        title: 'innerHTML, textContent, innerText',
        code: `// innerHTML — sets/gets HTML content (parses HTML tags)
document.getElementById("box").innerHTML = "<strong>Bold text</strong>";

// textContent — sets/gets plain text (ignores HTML, safer)
document.getElementById("box").textContent = "Plain text only";

// innerText — like textContent but aware of CSS visibility
document.getElementById("box").innerText = "Visible text";

// Difference: innerHTML vs textContent
const el = document.getElementById("box");
el.innerHTML = "<script>alert('XSS!')</script>"; // ⚠ DANGEROUS with user input
el.textContent = "<script>alert('Safe')</script>"; // ✅ displays as literal text`,
        language: 'javascript'
      },
      {
        type: 'warning',
        title: 'Never use innerHTML with user-provided data',
        content: 'innerHTML parses HTML tags, which means user input like <script>alert("hacked")</script> could execute. Always use textContent for displaying user data. This is called Cross-Site Scripting (XSS) prevention.'
      },
      {
        type: 'tryit',
        title: 'Try: JavaScript Output Methods',
        html: `<h2>Output Demo</h2>
<div id="box" style="padding:12px;background:#f0f9ff;border-radius:8px;margin:10px 0;min-height:40px;border:1px solid #bae6fd;">
  Output appears here
</div>
<div class="btns">
  <button onclick="doLog()">console.log</button>
  <button onclick="doInner()">innerHTML</button>
  <button onclick="doText()">textContent</button>
  <button onclick="doAlert()">alert()</button>
</div>
<p style="font-size:12px;color:#94a3b8;margin-top:8px;">Open DevTools (F12) to see console output</p>`,
        css: `body{font-family:sans-serif;padding:20px;}
.btns{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;}
button{padding:8px 14px;background:#0ea5e9;color:white;border:none;border-radius:6px;cursor:pointer;font-size:13px;}
button:hover{background:#0284c7;}`,
        js: `function doLog() {
  console.log("Logged at:", new Date().toLocaleTimeString());
  console.log({ name: "Alex", role: "developer" });
  document.getElementById("box").textContent = "Check the console! (F12)";
}
function doInner() {
  document.getElementById("box").innerHTML =
    "<strong style='color:#2563eb'>Bold</strong> text with <em>italic</em> and " +
    "<span style='color:#ef4444'>color</span>!";
}
function doText() {
  document.getElementById("box").textContent =
    "Plain text — <b>tags are shown literally</b>";
}
function doAlert() {
  alert("This is an alert box!\nLine 2 of the alert.");
  document.getElementById("box").textContent = "Alert was shown!";
}`,
        mode: 'full'
      }
    ],
    exercises: [
      {
        id: 'output-ex-1',
        question: 'Which is safer for displaying user-provided text in the DOM?',
        type: 'multiple-choice',
        options: ['innerHTML', 'textContent', 'document.write()', 'outerHTML'],
        correct: 1,
        explanation: 'textContent treats the value as plain text and never parses HTML. innerHTML parses HTML which can execute malicious scripts (XSS attack).'
      },
      {
        id: 'output-ex-2',
        question: 'What does console.table() display?',
        type: 'multiple-choice',
        options: [
          'An HTML table in the page',
          'An array or object formatted as a table in DevTools',
          'A popup table dialog',
          'The page source code'
        ],
        correct: 1,
        explanation: 'console.table() renders arrays and objects as a formatted table in the browser\'s DevTools console — very useful for visualizing structured data.'
      }
    ],
    quiz: [
      {
        id: 'output-q1',
        question: 'What is the output of: console.log(typeof 42)?',
        options: ['"integer"', '"number"', '"numeric"', '"int"'],
        correct: 1,
        explanation: 'JavaScript has one numeric type called "number" which covers both integers and decimals. typeof 42 returns "number".'
      }
    ]
  },
  // ─────────────────────────────────────────────────────────────
  // CHAPTER: BASICS — Variables
  // ─────────────────────────────────────────────────────────────
  {
    id: 'basics-variables',
    title: 'Variables — let, const, var',
    slug: 'variables',
    chapter: 'basics',
    order: 3,
    difficulty: 'beginner',
    readingTime: 10,
    description: 'Declare and use variables with let, const, and var. Understand scope, hoisting, and best practices.',
    sections: [
      {
        type: 'text',
        content: 'Variables are named containers that store data. In modern JavaScript, you declare variables with const (value won\'t be reassigned) or let (value may change). Avoid var — it has confusing behavior that causes subtle bugs.'
      },
      { type: 'heading', content: 'const vs let vs var' },
      {
        type: 'example',
        title: 'When to use each keyword',
        code: `// ✅ const — default choice, cannot be reassigned
const name = "Alex";
const API_URL = "https://api.example.com";
const user = { id: 1, name: "Alex" };  // object is fine with const

// ✅ let — use when the value needs to change
let score = 0;
score += 10;       // OK

let isLoggedIn = false;
isLoggedIn = true; // OK

// ❌ var — old, avoid it
var legacyVar = "has confusing scoping rules";

// const does NOT mean the object/array is frozen
const arr = [1, 2, 3];
arr.push(4);        // ✅ OK — mutating the array
// arr = [5, 6];    // ❌ Error — reassigning the variable

const obj = { x: 1 };
obj.x = 99;         // ✅ OK — mutating the property
// obj = { y: 2 };  // ❌ Error — reassigning the variable`,
        language: 'javascript'
      },
      { type: 'heading', content: 'Block Scope' },
      {
        type: 'example',
        title: 'How scope works with let and const',
        code: `// let and const are BLOCK scoped — live only inside { }
{
  let blockLet = "inside block";
  const blockConst = "also inside";
  console.log(blockLet);   // ✅ "inside block"
}
// console.log(blockLet);  // ❌ ReferenceError

// var is FUNCTION scoped — escapes blocks!
{
  var escaped = "I escape blocks!";
}
console.log(escaped); // ✅ "I escape blocks!" ← bug-prone

// Real-world scope example
function processUsers(users) {
  for (let i = 0; i < users.length; i++) {
    const user = users[i];      // new const each iteration — good
    console.log(user.name);
  }
  // i and user don't exist here
}

// The var-in-loop classic bug
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("var:", i), 100); // prints 3, 3, 3 ← BUG
}
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log("let:", j), 100); // prints 0, 1, 2 ✅
}`,
        language: 'javascript'
      },
      { type: 'heading', content: 'Hoisting' },
      {
        type: 'example',
        title: 'How var hoisting creates bugs',
        code: `// var declarations are hoisted (moved to top of function)
console.log(x); // undefined — no error! var is hoisted
var x = 5;
console.log(x); // 5

// Equivalent to what the engine sees:
var x;           // declaration hoisted
console.log(x);  // undefined
x = 5;           // assignment stays here

// let/const are in "temporal dead zone" — NOT accessible before declaration
console.log(y);  // ❌ ReferenceError: Cannot access 'y' before initialization
let y = 5;

// Function declarations are fully hoisted (usable before definition)
console.log(add(3, 4)); // ✅ 7 — works!
function add(a, b) { return a + b; }

// Function expressions are NOT hoisted
console.log(multiply(3, 4)); // ❌ ReferenceError
const multiply = (a, b) => a * b;`,
        language: 'javascript'
      },
      {
        type: 'tryit',
        title: 'Try: Variable Scope Explorer',
        html: `<h2>🔍 Scope Explorer</h2>
<div class="grid">
  <div>
    <h3>Global Scope</h3>
    <div class="scope-box global">
      <p>const globalName = "Alex"</p>
      <p>let globalScore = 0</p>
      <div class="scope-box function">
        <p>function myFunc() {</p>
        <p>&nbsp;&nbsp;const funcVar = "inside"</p>
        <div class="scope-box block">
          <p>&nbsp;&nbsp;if (true) {</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;let blockVar = "block"</p>
          <p>&nbsp;&nbsp;}</p>
        </div>
        <p>}</p>
      </div>
    </div>
  </div>
  <div>
    <h3>Console Output</h3>
    <div id="output"></div>
    <button onclick="runDemo()">Run Scope Demo</button>
  </div>
</div>`,
        css: `body{font-family:monospace;font-size:13px;padding:16px;}
h2{font-family:sans-serif;font-size:16px;font-weight:700;margin-bottom:12px;}
h3{font-family:sans-serif;font-size:13px;font-weight:700;margin:0 0 8px;}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.scope-box{padding:10px;border-radius:6px;margin:4px 0;}
.global{background:#eff6ff;border:2px solid #bfdbfe;}
.function{background:#f0fdf4;border:2px solid #bbf7d0;margin-top:4px;}
.block{background:#fdf4ff;border:2px solid #e9d5ff;margin-top:4px;}
#output{background:#1e293b;color:#94d4a4;padding:12px;border-radius:8px;min-height:120px;margin-bottom:10px;white-space:pre;font-size:12px;}
button{padding:8px 16px;background:#2563eb;color:#fff;border:none;border-radius:6px;cursor:pointer;font-family:sans-serif;}`,
        js: `const globalName = "Alex";    // global
let globalScore = 0;          // global

function myFunc() {
  const funcVar = "I'm in myFunc";  // function scope
  if (true) {
    let blockVar = "I'm in an if block";  // block scope
    globalScore += 10;   // can access + modify global
    return { funcVar, blockVar, globalName, globalScore };
  }
}

function runDemo() {
  let out = "";
  const result = myFunc();
  out += "From inside the function:\n";
  out += "  globalName: " + result.globalName + "\n";
  out += "  globalScore: " + result.globalScore + "\n";
  out += "  funcVar: " + result.funcVar + "\n";
  out += "  blockVar: " + result.blockVar + "\n\n";
  out += "From global scope:\n";
  out += "  globalName: " + globalName + "\n";
  out += "  globalScore: " + globalScore + "\n";
  out += "  funcVar: (ReferenceError — not accessible)\n";
  out += "  blockVar: (ReferenceError — not accessible)";
  document.getElementById("output").textContent = out;
}`,
        mode: 'full'
      }
    ],
    exercises: [
      {
        id: 'var-ex-1',
        question: 'Which keyword should you use by default in modern JavaScript?',
        type: 'multiple-choice',
        options: ['var', 'let', 'const', 'def'],
        correct: 2,
        explanation: 'Use const by default for everything. Switch to let only when you need to reassign the variable. Never use var in modern code.'
      },
      {
        id: 'var-ex-2',
        question: 'What is the output of: const arr = [1,2,3]; arr.push(4); console.log(arr.length)',
        type: 'code-output',
        correct: '4',
        explanation: 'const prevents reassignment, not mutation. arr.push(4) mutates the existing array, making its length 4. This is valid with const.'
      },
      {
        id: 'var-ex-3',
        question: 'What is "hoisting" in JavaScript?',
        type: 'multiple-choice',
        options: [
          'Moving code to a cloud server',
          'Variable and function declarations being moved to the top of their scope at compile time',
          'A way to increase a variable\'s value',
          'Importing modules at the top of a file'
        ],
        correct: 1,
        explanation: 'Hoisting is when the JavaScript engine moves variable and function declarations to the top of their scope before execution. var declarations are hoisted (but not initialized), function declarations are fully hoisted.'
      }
    ],
    quiz: [
      {
        id: 'var-q1',
        question: 'What error does this code throw: console.log(x); let x = 5;',
        options: [
          'No error — prints undefined',
          'ReferenceError: Cannot access x before initialization',
          'SyntaxError: let not defined',
          'TypeError: x is not a function'
        ],
        correct: 1,
        explanation: 'let and const are in the "temporal dead zone" before their declaration line. Accessing them throws a ReferenceError, unlike var which would return undefined.'
      },
      {
        id: 'var-q2',
        question: 'Which of these is valid when using const?',
        options: [
          'const x = 5; x = 10;',
          'const arr = []; arr.push(1);',
          'const obj = {}; obj = { a: 1 };',
          'None of the above'
        ],
        correct: 1,
        explanation: 'const prevents reassignment of the variable itself, but allows mutation of the array/object it points to. arr.push(1) is valid — you\'re not reassigning arr.'
      }
    ]
  }
];
