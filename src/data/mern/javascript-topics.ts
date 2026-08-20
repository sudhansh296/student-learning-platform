export interface MernTopic {
  id: string;
  title: string;
  slug: string;
  subject: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readingTime: number;
  description: string;
  sections: MernSection[];
  exercises?: Exercise[];
  quiz?: QuizQuestion[];
  nextTopic?: string;
  prevTopic?: string;
}

export interface MernSection {
  type: 'intro' | 'concept' | 'syntax' | 'example' | 'tryit' | 'note' | 'warning' | 'tip' | 'analogy' | 'comparison' | 'output' | 'list' | 'heading';
  title?: string;
  content?: string;
  code?: string;
  language?: string;
  output?: string;
  items?: string[];
  html?: string;
  css?: string;
  js?: string;
  mode?: 'html' | 'css' | 'js' | 'full';
}

export interface Exercise {
  id: string;
  question: string;
  type: 'multiple-choice' | 'fill-blank' | 'code-output';
  options?: string[];
  correct: string | number;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const jsTopics: MernTopic[] = [
  {
    id: 'js-introduction',
    title: 'Introduction to JavaScript',
    slug: 'introduction',
    subject: 'javascript',
    difficulty: 'beginner',
    readingTime: 6,
    description: 'What JavaScript is, where it runs, and why every web developer must learn it.',
    nextTopic: 'where-to',
    sections: [
      {
        type: 'intro',
        content: 'JavaScript is the programming language of the web. It runs in every browser — Chrome, Firefox, Safari, Edge — without any installation. Along with HTML and CSS, it is one of the three core technologies that every web page is built on.'
      },
      {
        type: 'analogy',
        title: 'HTML, CSS, JavaScript — The Three Layers',
        content: 'Think of a website like a person: HTML is the skeleton (structure), CSS is the skin and clothes (appearance), and JavaScript is the brain and muscles (behavior and interaction). Without JavaScript, a website is just a static document.'
      },
      {
        type: 'heading',
        content: 'What Can JavaScript Do?'
      },
      {
        type: 'list',
        items: [
          'Change HTML content dynamically (update text, images, attributes)',
          'React to user events (clicks, key presses, form submissions)',
          'Validate forms before sending data to a server',
          'Fetch data from APIs without refreshing the page (AJAX/Fetch)',
          'Store data locally in the browser (localStorage, sessionStorage)',
          'Build entire frontend applications (React, Vue, Angular)',
          'Run on the server with Node.js to build APIs and backends',
          'Build mobile apps with React Native',
          'Build desktop apps with Electron'
        ]
      },
      {
        type: 'heading',
        content: 'Your First JavaScript Program'
      },
      {
        type: 'example',
        title: 'Hello World — 3 Ways',
        code: `// 1. Output to console (most common for debugging)
console.log("Hello, World!");

// 2. Show a popup alert
alert("Hello, World!");

// 3. Write to HTML page
document.getElementById("demo").innerHTML = "Hello, World!";`,
        language: 'javascript'
      },
      {
        type: 'tryit',
        title: 'Try: Your First JavaScript',
        html: '<h2 id="demo">Click the button below</h2>\n<button onclick="sayHello()">Say Hello!</button>\n<button onclick="changeColor()">Change Color</button>\n<button onclick="showDate()">Show Date</button>',
        css: 'body { font-family: sans-serif; padding: 30px; text-align: center; }\nbutton { margin: 8px; padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 15px; }\nbutton:hover { background: #1d4ed8; }\n#demo { color: #1e293b; font-size: 28px; margin-bottom: 20px; }',
        js: 'function sayHello() {\n  document.getElementById("demo").innerHTML = "Hello, JavaScript! 🎉";\n}\n\nfunction changeColor() {\n  const colors = ["#ef4444","#f59e0b","#10b981","#3b82f6","#8b5cf6"];\n  const color = colors[Math.floor(Math.random() * colors.length)];\n  document.getElementById("demo").style.color = color;\n  document.getElementById("demo").innerHTML = "Color changed! 🎨";\n}\n\nfunction showDate() {\n  const now = new Date();\n  document.getElementById("demo").innerHTML = now.toLocaleString();\n}',
        mode: 'full'
      },
      {
        type: 'note',
        title: 'JavaScript vs Java',
        content: 'Despite the similar name, JavaScript and Java are completely different languages. JavaScript was named after Java for marketing reasons in 1995. They have different syntax, different use cases, and nothing in common except the name.'
      },
      {
        type: 'heading',
        content: 'JavaScript Versions (ECMAScript)'
      },
      {
        type: 'list',
        items: [
          'ES5 (2009) — the version that made JS reliable across browsers',
          'ES6 / ES2015 — massive update: let/const, arrow functions, classes, promises, modules',
          'ES2016–ES2020 — async/await, optional chaining, nullish coalescing, etc.',
          'ES2021–ES2026 — continuing improvements to the language',
          'All modern browsers support ES2020+ natively'
        ]
      }
    ],
    exercises: [
      {
        id: 'js-intro-1',
        question: 'Which method outputs text to the browser console?',
        type: 'multiple-choice',
        options: ['document.write()', 'console.log()', 'alert()', 'print()'],
        correct: 1,
        explanation: 'console.log() writes to the browser console, visible in DevTools. It is the most common debugging method.'
      },
      {
        id: 'js-intro-2',
        question: 'JavaScript can run on the server side using ___.',
        type: 'fill-blank',
        correct: 'Node.js',
        explanation: 'Node.js is a runtime environment that allows JavaScript to run outside the browser, on a server.'
      }
    ],
    quiz: [
      { id: 'q1', question: 'What does JavaScript primarily add to web pages?', options: ['Structure', 'Styling', 'Behavior/Interactivity', 'Server logic'], correct: 2, explanation: 'JavaScript adds behavior and interactivity — responding to user events, changing content, fetching data.' },
      { id: 'q2', question: 'Which company created JavaScript?', options: ['Microsoft', 'Google', 'Netscape', 'Mozilla'], correct: 2, explanation: 'Brendan Eich created JavaScript at Netscape in 1995 in just 10 days.' },
      { id: 'q3', question: 'What is the latest major version standard for JavaScript?', options: ['ES4', 'ES5', 'ES6/ES2015+', 'ES2000'], correct: 2, explanation: 'ES6 (2015) was a landmark update. Newer versions (ES2016-ES2026) continue to add features.' }
    ]
  },
  {
    id: 'js-where-to',
    title: 'JavaScript Where To',
    slug: 'where-to',
    subject: 'javascript',
    difficulty: 'beginner',
    readingTime: 5,
    description: 'Learn where to place JavaScript in an HTML document — inline, internal, and external.',
    prevTopic: 'introduction',
    nextTopic: 'output',
    sections: [
      {
        type: 'intro',
        content: 'JavaScript can be added to an HTML page in three ways: directly inside an HTML element (inline), inside a <script> tag in the HTML file (internal), or in a separate .js file (external). Understanding the difference is important for writing organized, maintainable code.'
      },
      {
        type: 'heading',
        content: '1. Inline JavaScript'
      },
      {
        type: 'example',
        title: 'Inline JavaScript (inside HTML element)',
        code: `<!-- Inline JavaScript — directly on an element -->
<button onclick="alert('You clicked me!')">Click Me</button>

<p onmouseover="this.style.color='red'"
   onmouseout="this.style.color='black'">
  Hover over me
</p>`,
        language: 'html',
        output: 'Not recommended for production. Hard to maintain.'
      },
      {
        type: 'warning',
        title: 'Avoid Inline JavaScript',
        content: 'Inline JavaScript mixes HTML and code together. This is hard to read, hard to test, and impossible to reuse. Use it only for quick demos, not real projects.'
      },
      {
        type: 'heading',
        content: '2. Internal JavaScript (<script> tag)'
      },
      {
        type: 'example',
        title: 'Internal JavaScript',
        code: `<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body>
  <h1 id="title">Original Title</h1>
  <button onclick="changeTitle()">Change Title</button>

  <!-- JavaScript at the bottom of body — BEST PRACTICE -->
  <script>
    function changeTitle() {
      document.getElementById("title").textContent = "Title Changed!";
    }
  </script>
</body>
</html>`,
        language: 'html'
      },
      {
        type: 'tip',
        title: 'Why put <script> at the bottom?',
        content: 'Placing your <script> tag just before </body> ensures the HTML elements exist before JavaScript tries to access them. If you put it in <head>, the elements haven\'t loaded yet and document.getElementById() will return null.'
      },
      {
        type: 'heading',
        content: '3. External JavaScript (Recommended)'
      },
      {
        type: 'example',
        title: 'External JavaScript file — the professional way',
        code: `<!-- In your HTML file -->
<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body>
  <h1 id="title">Hello</h1>
  <button id="btn">Click Me</button>

  <!-- Link to external .js file — at bottom of body -->
  <script src="script.js"></script>
</body>
</html>`,
        language: 'html'
      },
      {
        type: 'example',
        title: 'script.js — the external file',
        code: `// script.js
document.getElementById("btn").addEventListener("click", function() {
  document.getElementById("title").textContent = "Button was clicked!";
});`,
        language: 'javascript'
      },
      {
        type: 'list',
        title: 'Benefits of External JS files:',
        items: [
          'Separation of concerns — HTML stays clean, logic stays in .js',
          'Reusable — one file can be linked from many HTML pages',
          'Cached by browser — loads faster on repeat visits',
          'Easier to maintain and debug',
          'Works with version control (Git) cleanly'
        ]
      },
      {
        type: 'heading',
        content: 'The defer and async Attributes'
      },
      {
        type: 'example',
        title: 'defer vs async',
        code: `<!-- Normal: blocks HTML parsing while loading -->
<script src="script.js"></script>

<!-- defer: loads in parallel, runs AFTER HTML is parsed -->
<!-- RECOMMENDED for most scripts -->
<script src="script.js" defer></script>

<!-- async: loads and runs as soon as ready, order not guaranteed -->
<!-- Best for independent scripts like analytics -->
<script src="analytics.js" async></script>`,
        language: 'html'
      },
      {
        type: 'tryit',
        title: 'Try: Internal vs External Style',
        html: '<h2 id="msg">This text will change</h2>\n<button id="btn1">Change Text</button>\n<button id="btn2">Change Style</button>\n<button id="btn3">Add Element</button>',
        css: 'body{font-family:sans-serif;padding:20px;}\nbutton{margin:5px;padding:8px 16px;background:#2563eb;color:white;border:none;border-radius:6px;cursor:pointer;}\nbutton:hover{background:#1d4ed8;}',
        js: 'document.getElementById("btn1").onclick = function() {\n  document.getElementById("msg").textContent = "Text changed by JavaScript!";\n};\n\ndocument.getElementById("btn2").onclick = function() {\n  const el = document.getElementById("msg");\n  el.style.color = "#ef4444";\n  el.style.fontSize = "32px";\n  el.style.fontWeight = "bold";\n};\n\ndocument.getElementById("btn3").onclick = function() {\n  const p = document.createElement("p");\n  p.textContent = "New paragraph added dynamically! 🎉";\n  p.style.background = "#dcfce7";\n  p.style.padding = "10px";\n  p.style.borderRadius = "6px";\n  document.body.appendChild(p);\n};',
        mode: 'full'
      }
    ],
    exercises: [
      {
        id: 'whereto-1',
        question: 'Where is the BEST place to put a <script> tag in HTML?',
        type: 'multiple-choice',
        options: ['Inside <head>', 'At the top of <body>', 'Just before </body>', 'After </html>'],
        correct: 2,
        explanation: 'Placing <script> just before </body> ensures all HTML elements are loaded before JavaScript runs.'
      },
      {
        id: 'whereto-2',
        question: 'Which attribute makes a script load in parallel but execute AFTER HTML parsing?',
        type: 'multiple-choice',
        options: ['async', 'defer', 'delay', 'lazy'],
        correct: 1,
        explanation: 'The defer attribute tells the browser to download the script while parsing HTML, but execute it after parsing is complete.'
      }
    ]
  }
];
