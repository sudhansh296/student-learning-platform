import type { HtmlLesson } from '../html-curriculum';
export const htmlJavascriptLesson: HtmlLesson = {
  id: 'html-javascript', title: 'HTML & JavaScript', slug: 'javascript-in-html', chapter: 'advanced', order: 18,
  difficulty: 'beginner', readingTime: 10, description: 'Add JavaScript to HTML pages - inline, internal, external scripts, defer vs async, and DOM manipulation basics.',
  sections: [
    { type: 'text', content: 'JavaScript makes HTML pages interactive. Without JavaScript, HTML is just a static document - no animations, no dynamic content, no responses to clicks. JavaScript runs in the browser, reads and modifies the HTML structure (DOM), and responds to user events.' },
    { type: 'heading', content: 'Three Ways to Add JavaScript' },
    { type: 'code', language: 'html',       content: 'The script element embeds JavaScript. Inline event handlers like onclick run code when events happen. This mixes HTML and behavior - fine for quick demos. In production, keep JavaScript in separate .js files for clean separation of concerns.',
      code: `<!-- 1. INLINE: directly on element - avoid in production -->
<button onclick="alert('Hello!')">Click Me</button>
<p onmouseover="this.style.color='red'">Hover me</p>

<!-- 2. INTERNAL: <script> tag in the HTML file -->
<script>
  function greet() {
    document.getElementById('msg').textContent = 'Hello, World!';
  }
</script>

<!-- 3. EXTERNAL: separate .js file - BEST PRACTICE -->
<script src="app.js" defer></script>
<!-- defer: loads in parallel, executes after HTML parsed -->` },
    { type: 'heading', content: 'Where to Put the <script> Tag' },
    { type: 'code', language: 'html',       content: 'Placing script before closing body ensures HTML is parsed before the script runs. The modern way is script in head with defer - it loads in parallel and executes after parsing finishes, giving the same result with better performance.',
      code: `<!-- OPTION 1: Just before </body> - OLD way but works -->
<body>
  <h1>My Page</h1>
  <p id="output"></p>

  <script>
    document.getElementById('output').textContent = 'Loaded!';
  </script>
</body>

<!-- OPTION 2: In <head> with defer - MODERN BEST PRACTICE -->
<head>
  <script src="app.js" defer></script>
</head>
<body>
  <p id="output"></p>
</body>

<!-- defer = download while HTML parses, execute after HTML is ready -->
<!-- async = download while HTML parses, execute as soon as downloaded -->
<!-- No attribute = blocks HTML parsing (bad) -->` },
    { type: 'heading', content: 'Selecting and Modifying HTML Elements' },
    { type: 'code', language: 'html',       content: 'JavaScript changes pages by manipulating the DOM. getElementById finds one element by id. querySelector uses any CSS selector. innerHTML sets HTML content. textContent sets plain text safely. classList.add/remove/toggle manages CSS classes dynamically.',
      code: `<h1 id="title">Original Title</h1>
<p class="intro">Original text</p>
<button id="changeBtn">Change Content</button>

<script>
  // Get elements
  const title  = document.getElementById('title');
  const intro  = document.querySelector('.intro');   // first .intro
  const btn    = document.getElementById('changeBtn');

  // Modify content
  btn.addEventListener('click', () => {
    title.textContent = 'Title Changed by JavaScript!';
    title.style.color = '#2563eb';

    intro.innerHTML = 'This text was <strong>changed</strong> by JavaScript!';
    intro.style.fontSize = '18px';

    btn.textContent = 'Changed! Click Again';
    btn.style.background = '#059669';
  });
</script>` },
    { type: 'heading', content: 'Event Handling' },
    { type: 'code', language: 'html',       content: 'addEventListener attaches event handlers without overwriting existing ones. The event object provides target and type. Use e.preventDefault() on form submit to stop page reload. Remove listeners with removeEventListener when no longer needed to prevent memory leaks.',
      code: `<button id="btn">Click Me</button>
<input id="inp" type="text" placeholder="Type here...">
<p id="output"></p>

<script>
  // Click event
  document.getElementById('btn').addEventListener('click', function() {
    document.getElementById('output').textContent = 'Button was clicked!';
  });

  // Input event - fires on every keystroke
  document.getElementById('inp').addEventListener('input', function(e) {
    document.getElementById('output').textContent = 'You typed: ' + e.target.value;
  });

  // Common events:
  // 'click'       - mouse click
  // 'dblclick'    - double click
  // 'mouseover'   - hover start
  // 'mouseout'    - hover end
  // 'keydown'     - key pressed
  // 'keyup'       - key released
  // 'input'       - input value changed
  // 'change'      - select/checkbox changed
  // 'submit'      - form submitted
  // 'load'        - page fully loaded
  // 'DOMContentLoaded' - HTML parsed (before images)
</script>` },
    { type: 'tryit', title: 'Try It: JavaScript + HTML',
      html: `<div id="app">
  <h1 id="title">Hello, HTML!</h1>
  <p id="subtitle">JavaScript can change anything on this page.</p>

  <div class="controls">
    <button onclick="changeTitle()">Change Title</button>
    <button onclick="changeColor()">Random Color</button>
    <button onclick="addItem()">Add List Item</button>
    <button onclick="toggleVisibility()">Show/Hide</button>
  </div>

  <input type="text" id="nameInput" placeholder="Type your name...">
  <p id="greeting"></p>

  <ul id="dynamicList">
    <li>Item 1 (built-in)</li>
  </ul>
</div>`,
      css: `#app { font-family: system-ui, sans-serif; padding: 24px; max-width: 500px; }
#title { color: #1e1e1e; transition: color .3s; }
#subtitle { color: #6b7280; margin-bottom: 20px; }
.controls { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
button { padding: 8px 14px; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; }
button:hover { background: #1d4ed8; }
input { padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 14px; width: 220px; margin-right: 8px; outline: none; }
input:focus { border-color: #2563eb; }
#greeting { color: #059669; font-weight: 700; min-height: 24px; margin: 8px 0 16px; }
#dynamicList { color: #374151; }`,
      js: `const colors = ['#ef4444','#f59e0b','#10b981','#2563eb','#7c3aed','#ec4899'];
let colorIndex = 0;
let itemCount = 2;

function changeTitle() {
  const titles = ['Hello, JavaScript!','DOM Manipulation!','Interactive HTML!','You Rock! 🎉'];
  const el = document.getElementById('title');
  el.textContent = titles[Math.floor(Math.random() * titles.length)];
}

function changeColor() {
  document.getElementById('title').style.color = colors[colorIndex % colors.length];
  colorIndex++;
}

function addItem() {
  const li = document.createElement('li');
  li.textContent = 'Item ' + itemCount + ' (added by JS)';
  document.getElementById('dynamicList').appendChild(li);
  itemCount++;
}

let visible = true;
function toggleVisibility() {
  const list = document.getElementById('dynamicList');
  visible = !visible;
  list.style.display = visible ? 'block' : 'none';
}

// Live greeting as you type
document.getElementById('nameInput').addEventListener('input', function() {
  const name = this.value.trim();
  document.getElementById('greeting').textContent = name ? 'Hello, ' + name + '! 👋' : '';
});`,
      mode: 'full' },
  ],
  exercises: [
    { id: 'jshtml1', question: 'What does the defer attribute on a <script> tag do?', type: 'multiple-choice', options: ['Runs the script immediately', 'Downloads the script while HTML parses, runs AFTER HTML is fully parsed', 'Delays the script by 1 second', 'Makes the script run only on click'], correct: 1, explanation: 'defer makes the browser download the JS file in parallel (while HTML parses), then execute it after the HTML is fully parsed. This is the recommended approach for most scripts.' },
  ],
  quiz: [{ id: 'jq1', question: 'Which method gets an HTML element by its id attribute?', options: ['document.getElement()', 'document.getElementById()', 'document.findById()', 'document.querySelector.id()'], correct: 1, explanation: 'document.getElementById("myId") returns the element with that specific id. It\'s faster than querySelector for id lookups.' }],
};
