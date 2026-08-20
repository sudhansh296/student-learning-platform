import type { JSLesson } from '../js-curriculum';

export const jsIntroLesson: JSLesson = {
  id: 'js-intro-full',
  title: 'Introduction to JavaScript',
  slug: 'introduction',
  chapter: 'intro',
  order: 1,
  difficulty: 'beginner',
  readingTime: 8,
  description: 'What JavaScript is, where it runs, the history, and your first interactive program.',
  sections: [
    {
      type: 'text',
      content: 'JavaScript is the programming language of the web. It runs in every browser without any installation. Together with HTML (structure) and CSS (appearance), JavaScript creates the behavior and interactivity of every website you visit.',
    },
    {
      type: 'analogy',
      title: 'The three layers of the web',
      content: 'Think of a website like a human body. HTML is the skeleton — structure and bones. CSS is the skin, hair, and clothing — appearance. JavaScript is the brain and muscles — behavior, logic, and interaction. Without JavaScript, a webpage is just a static document that cannot respond to anything.',
    },
    {
      type: 'heading',
      content: 'What Can JavaScript Do?',
    },
    {
      type: 'list',
      items: [
        'Change any HTML content on the page (text, images, attributes)',
        'Respond to user actions — clicks, key presses, form submissions',
        'Validate forms before sending data to a server',
        'Fetch data from APIs without reloading the page (AJAX/Fetch)',
        'Store data in the browser (localStorage, cookies)',
        'Build entire applications with React, Vue, or Angular',
        'Run on servers with Node.js to build APIs and databases',
        'Build mobile apps with React Native',
        'Build desktop apps with Electron (VS Code is built with it)',
        'Create games that run in the browser',
      ],
    },
    {
      type: 'heading',
      content: 'JavaScript vs Java — They Are NOT the Same',
    },
    {
      type: 'note',
      title: 'Common confusion',
      content: 'JavaScript and Java are completely different languages. JavaScript was created in 1995 by Brendan Eich at Netscape in just 10 days. It was named "JavaScript" as a marketing decision to ride Java\'s popularity at the time. They share nothing in common except the name.',
    },
    {
      type: 'heading',
      content: 'Your First JavaScript Program',
    },
    {
      type: 'example',
      title: 'Three ways to output — console, alert, DOM',
      content: 'JavaScript has several ways to show output. console.log() is the developer tool — it writes to the browser console (F12). alert() shows a popup box. document.getElementById().innerHTML changes what the user actually sees on the page. In real applications, you almost always use the DOM method to update the page.',
      code: `// 1. Console output (developers use this for debugging)
console.log("Hello, World!");
console.log(42);
console.log(true);
console.log([1, 2, 3]);

// 2. Browser popup alert
alert("Hello from JavaScript!");

// 3. Write to the HTML page
document.getElementById("output").innerHTML = "Hello, JavaScript!";

// 4. Write directly to document (mostly for demos)
document.write("Hello!");`,
      language: 'javascript',
    },
    {
      type: 'tryit',
      title: 'Try It: Your First JavaScript',
      html: `<h1 id="title">Hello, HTML!</h1>
<p id="subtitle">Click a button to see JavaScript in action</p>
<div class="buttons">
  <button onclick="changeText()">Change Text</button>
  <button onclick="changeColor()">Change Color</button>
  <button onclick="addParagraph()">Add Paragraph</button>
  <button onclick="showAlert()">Show Alert</button>
</div>
<div id="output"></div>`,
      css: `body{font-family:system-ui,sans-serif;padding:24px;background:#f9fafb;}
#title{font-size:2rem;color:#1e1e1e;transition:color .3s;}
#subtitle{color:#6b7280;margin-bottom:20px;}
.buttons{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px;}
button{padding:9px 18px;background:#2563eb;color:white;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600;}
button:hover{background:#1d4ed8;}
#output p{background:white;border:1px solid #e5e7eb;padding:10px 14px;border-radius:8px;margin:6px 0;color:#374151;font-size:14px;}`,
      js: `const colors = ['#ef4444','#f59e0b','#10b981','#8b5cf6','#2563eb'];
let colorIndex = 0;
let paraCount = 0;

function changeText() {
  const phrases = ['JavaScript is awesome!','DOM manipulation works!','You are learning fast!','Keep coding! 🚀'];
  document.getElementById('title').textContent = phrases[Math.floor(Math.random()*phrases.length)];
}

function changeColor() {
  document.getElementById('title').style.color = colors[colorIndex % colors.length];
  colorIndex++;
}

function addParagraph() {
  paraCount++;
  const p = document.createElement('p');
  p.textContent = '✅ Paragraph ' + paraCount + ' added at ' + new Date().toLocaleTimeString();
  document.getElementById('output').appendChild(p);
}

function showAlert() {
  alert('This is a JavaScript alert!\nYou clicked the button at ' + new Date().toLocaleTimeString());
}`,
      mode: 'full',
    },
    {
      type: 'heading',
      content: 'JavaScript Versions (ECMAScript)',
    },
    {
      type: 'list' as const,
      title: 'JavaScript version history',
      items: [
        'ES1 (1997) — First standardized version',
        'ES3 (1999) — Regular expressions, try/catch',
        'ES5 (2009) — Array methods, JSON, strict mode',
        'ES6/ES2015 — let/const, arrow functions, classes, modules, promises — MAJOR update',
        'ES2016 — Array.includes(), ** exponent operator',
        'ES2017 — async/await, Object.values/entries',
        'ES2018 — Spread/rest, Promise.all, async iteration',
        'ES2019 — Array.flat(), Object.fromEntries',
        'ES2020 — Optional chaining (?.), nullish coalescing (??)',
        'ES2021–2026 — Logical assignment, at(), Object.hasOwn(), and more',
      ],
    },
  ],
  exercises: [
    {
      id: 'jsintro-1',
      question: 'Which method outputs text to the browser developer console?',
      type: 'multiple-choice',
      options: ['document.write()', 'console.log()', 'alert()', 'print()'],
      correct: 1,
      explanation: 'console.log() writes output to the browser\'s developer console (open with F12). It is the primary tool for debugging JavaScript code.',
    },
    {
      id: 'jsintro-2',
      question: 'JavaScript was created in how many days?',
      type: 'multiple-choice',
      options: ['1 day', '10 days', '100 days', '1 year'],
      correct: 1,
      explanation: 'Brendan Eich created JavaScript at Netscape in just 10 days in 1995. Despite its quick creation, it became the most widely used programming language in the world.',
    },
    {
      id: 'jsintro-3',
      question: 'What is the output of: console.log(typeof "hello")',
      type: 'code-output',
      correct: 'string',
      explanation: 'The typeof operator returns a string describing the type. typeof "hello" returns "string". Other types: "number", "boolean", "undefined", "object", "function".',
    },
  ],
  quiz: [
    {
      id: 'qji1',
      question: 'Which HTML element is used to embed JavaScript in a webpage?',
      options: ['<js>', '<javascript>', '<script>', '<code>'],
      correct: 2,
      explanation: 'The <script> tag embeds or links JavaScript. You can write code inside it or use src="" to link an external .js file.',
    },
    {
      id: 'qji2',
      question: 'JavaScript can only run in web browsers. True or False?',
      options: ['True', 'False — it also runs on servers via Node.js', 'True — only modern browsers', 'False — it runs everywhere except browsers'],
      correct: 1,
      explanation: 'JavaScript runs both in browsers (client-side) AND on servers via Node.js (server-side). This is what makes the MERN stack (MongoDB, Express, React, Node.js) possible — one language everywhere.',
    },
  ],
};
