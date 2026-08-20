import type { JSLesson } from '../js-curriculum';

export const jsDomLesson: JSLesson = {
  id: 'js-dom',
  title: 'DOM — Document Object Model',
  slug: 'dom',
  chapter: 'dom',
  order: 11,
  difficulty: 'intermediate',
  readingTime: 14,
  description: 'Select, modify, create, and delete HTML elements using the DOM API. The foundation of all interactive web pages.',
  sections: [
    {
      type: 'text',
      content: "The DOM (Document Object Model) is the browser's representation of your HTML page as a tree of JavaScript objects. Every element, attribute, and text node is an object you can read and manipulate with JavaScript. This is how JavaScript changes what you see on the page.",
    },
    { type: 'heading', content: 'Selecting Elements' },
    {
      type: 'example',
      title: 'querySelector and getElementById',
      content: 'querySelector() is the modern way to select elements — it accepts any CSS selector. querySelectorAll() returns ALL matching elements as a NodeList. getElementById() is the fastest for ID lookups. Scope your queries by searching inside a specific element (card.querySelector("h2")) rather than the whole document when possible.',
      language: 'javascript',
      code: `// querySelector — returns FIRST matching element (like CSS selector)
const heading  = document.querySelector('h1');
const button   = document.querySelector('.btn');
const input    = document.querySelector('#email-input');
const firstLi  = document.querySelector('ul li:first-child');

// querySelectorAll — returns NodeList of ALL matches
const allBtns  = document.querySelectorAll('.btn');
const allItems = document.querySelectorAll('li');

// Convert NodeList to Array for array methods
const btnsArray = Array.from(document.querySelectorAll('.btn'));
btnsArray.forEach(btn => btn.style.background = '#2563eb');

// Older but still useful methods
const byId      = document.getElementById('hero');
const byClass   = document.getElementsByClassName('card');
const byTag     = document.getElementsByTagName('p');

// Search within an element (scope queries)
const card = document.querySelector('.card');
const cardTitle = card.querySelector('h2');  // only inside .card`, output: 'Selects first matching element | Returns NodeList of all matches',
    },
    { type: 'heading', content: 'Modifying Content and Attributes' },
    {
      type: 'example',
      title: 'Change text, HTML, and attributes',
      content: 'textContent safely sets plain text — any HTML tags are displayed as literal text, preventing XSS attacks. Use it for user-provided content. innerHTML parses HTML — only use with trusted content. setAttribute works with any HTML attribute. The dataset property gives clean access to data-* attributes without needing getAttribute.',
      language: 'javascript',
      code: `const el = document.querySelector('#output');

// Change text (SAFE — no HTML parsing)
el.textContent = 'Hello, World!';
el.textContent = '<script>alert("XSS")</script>'; // displays literally, safe!

// Change HTML (use carefully — only with trusted content)
el.innerHTML = '<strong>Bold text</strong> with <em>italic</em>';

// Get/set attributes
const img = document.querySelector('img');
img.getAttribute('src');
img.setAttribute('src', 'new.jpg');
img.setAttribute('alt', 'New photo');
img.removeAttribute('data-loading');

// Direct property access (faster for standard attributes)
img.src = 'photo.jpg';
img.alt = 'A photo';
const link = document.querySelector('a');
link.href = 'https://example.com';

// data-* attributes
const btn = document.querySelector('[data-id]');
btn.dataset.id;            // read data-id
btn.dataset.userId;        // read data-user-id (camelCase)
btn.dataset.action = 'delete'; // set data-action`,
    },
    { type: 'heading', content: 'Modifying Styles and Classes' },
    {
      type: 'example',
      title: 'classList is the professional way',
      content: 'classList methods are the correct way to manage CSS classes. toggle() is especially useful — it adds the class if missing, removes it if present. This is how you implement show/hide toggles, active states, and theme switching. Directly modifying element.className as a string overwrites all classes; classList modifies individual ones.',
      language: 'javascript',
      code: `const el = document.querySelector('.card');

// classList methods — BEST PRACTICE
el.classList.add('active');          // add class
el.classList.remove('hidden');       // remove class
el.classList.toggle('open');         // add if missing, remove if present
el.classList.contains('active');     // true/false check
el.classList.replace('old', 'new');  // replace a class

// Multiple classes at once
el.classList.add('highlight', 'large', 'border-blue');

// Inline styles — use sparingly
el.style.color = '#2563eb';
el.style.fontSize = '24px';
el.style.backgroundColor = '#f0f9ff'; // camelCase!
el.style.cssText = 'color:red; font-size:20px; padding:10px';

// Get computed (final) style
const computed = window.getComputedStyle(el);
console.log(computed.color);
console.log(computed.fontSize);`,
    },
    { type: 'heading', content: 'Creating and Inserting Elements' },
    {
      type: 'example',
      title: 'Building and adding DOM nodes',
      content: 'createElement() creates a new element in memory. Build it up with className, textContent, or innerHTML, then insert it with append(), prepend(), before(), or after(). insertAdjacentHTML() is faster for inserting HTML strings at specific positions relative to an element — use "beforeend" to append inside, "afterend" to insert after.',
      language: 'javascript',
      code: `// Create a new element
const card = document.createElement('div');
card.className = 'card';
card.innerHTML = \`
  <h2>New Card</h2>
  <p>Created with JavaScript</p>
  <button>Click me</button>
\`;

// Insert into the DOM
document.body.appendChild(card);  // add at end of body
document.body.prepend(card);       // add at start

// Modern methods (cleaner)
const list = document.querySelector('ul');
list.append(card);                 // at end
list.prepend(card);                // at start
list.before(card);                 // before the list
list.after(card);                  // after the list

// insertAdjacentHTML — very useful
el.insertAdjacentHTML('beforebegin', '<p>Before element</p>');
el.insertAdjacentHTML('afterbegin',  '<p>First child</p>');
el.insertAdjacentHTML('beforeend',   '<p>Last child</p>');
el.insertAdjacentHTML('afterend',    '<p>After element</p>');

// Remove elements
const toRemove = document.querySelector('.old-item');
toRemove.remove(); // modern, clean

// Clone an element
const clone = card.cloneNode(true); // true = deep clone (with children)`,
    },
    { type: 'heading', content: 'Events' },
    {
      type: 'example',
      title: 'addEventListener — the professional way',
      content: 'addEventListener() attaches event handlers without overwriting others. The event object passed to the callback contains event.target (what was clicked), event.currentTarget (where the listener is attached), and event.type. Always use e.preventDefault() on form submit events to stop the page from reloading.',
      language: 'javascript',
      code: `const btn = document.querySelector('#myBtn');

btn.addEventListener('click', (event) => {
  console.log('Clicked!');
  console.log(event.target);        // element that was clicked
  console.log(event.currentTarget); // element with the listener
  console.log(event.type);          // "click"
});

// Mouse events
el.addEventListener('click',      handleClick);
el.addEventListener('dblclick',   handleDblClick);
el.addEventListener('mouseover',  handleHover);
el.addEventListener('mouseout',   handleLeave);
el.addEventListener('mousemove',  (e) => console.log(e.clientX, e.clientY));

// Keyboard events
document.addEventListener('keydown', (e) => {
  console.log(e.key, e.code, e.ctrlKey, e.shiftKey);
  if (e.key === 'Escape') closeModal();
  if (e.ctrlKey && e.key === 's') saveDocument();
});

// Form events
input.addEventListener('input',  e => console.log(e.target.value));
form.addEventListener('submit', (e) => {
  e.preventDefault(); // prevent page reload
  const data = new FormData(form);
  console.log(data.get('username'));
});

// Remove listener (must use named function)
function handleClick() { console.log('clicked'); }
btn.addEventListener('click', handleClick);
btn.removeEventListener('click', handleClick);

// Once — fires only one time
btn.addEventListener('click', handler, { once: true });`,
    },
    { type: 'heading', content: 'Event Delegation' },
    {
      type: 'example',
      title: 'Handle many elements with one listener',
      content: 'Event delegation uses event bubbling — clicks on a child element bubble up to all ancestors. Instead of adding one listener per list item, add ONE listener to the parent. Use event.target.closest("li") to find the nearest matching ancestor of what was clicked. This also works for dynamically added items since the listener is on the parent, not the individual items.',
      language: 'javascript',
      code: `// SOLUTION: Event delegation — listen on the PARENT
const list = document.querySelector('#item-list');

list.addEventListener('click', (event) => {
  // Find the closest <li> that was clicked
  const item = event.target.closest('li');
  if (!item) return; // clicked on list but not an item

  console.log('Clicked:', item.dataset.id, item.textContent);
  item.classList.toggle('selected');
});

// This works for dynamically added items too!
function addItem(text) {
  const li = document.createElement('li');
  li.dataset.id = Date.now();
  li.textContent = text;
  list.appendChild(li);
  // No need to add a listener — the parent handles it!
}`,
    },
    {
      type: 'tryit',
      title: 'Try It: DOM Manipulation',
      html: `<div id="app">
  <h2>DOM Manipulator</h2>
  <div class="controls">
    <input id="textInput" placeholder="Enter text to add..."/>
    <button onclick="addItem()">Add Item</button>
    <button onclick="toggleDark()" id="darkBtn">Dark Mode</button>
    <button onclick="clearAll()" style="background:#dc2626">Clear All</button>
  </div>
  <ul id="itemList"></ul>
  <div id="stats"></div>
</div>`,
      css: `* { box-sizing: border-box; }
#app { font-family: system-ui, sans-serif; padding: 20px; max-width: 460px; transition: background .3s, color .3s; }
#app.dark { background: #1e1e1e; color: #e5e7eb; }
h2 { margin-bottom: 12px; }
.controls { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
input { flex: 1; padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none; min-width: 120px; }
#app.dark input { background: #2d2d2d; border-color: #444; color: #e5e7eb; }
button { padding: 9px 16px; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; }
#itemList { list-style: none; padding: 0; margin: 0 0 12px; }
#itemList li { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: 8px; margin-bottom: 6px; background: #f9fafb; border: 1px solid #e5e7eb; font-size: 14px; cursor: pointer; transition: all .2s; }
#app.dark #itemList li { background: #2d2d2d; border-color: #444; }
#itemList li.done { text-decoration: line-through; opacity: .6; }
#itemList li .del { background: none; border: none; color: #ef4444; cursor: pointer; padding: 2px 6px; font-size: 16px; border-radius: 4px; }
#stats { font-size: 13px; color: #6b7280; }`,
      js: `let count = 0;

document.addEventListener('keydown', e => {
  if (e.key === 'Enter') addItem();
});

function addItem() {
  const input = document.getElementById('textInput');
  const text = input.value.trim();
  if (!text) return;
  count++;
  const li = document.createElement('li');
  li.dataset.id = count;
  li.innerHTML = \`<span>\${count}. \${text}</span><button class="del" onclick="removeItem(this)">x</button>\`;
  li.querySelector('span').addEventListener('click', () => li.classList.toggle('done'));
  document.getElementById('itemList').appendChild(li);
  input.value = '';
  input.focus();
  updateStats();
}

function removeItem(btn) {
  btn.closest('li').remove();
  updateStats();
}

function clearAll() {
  document.getElementById('itemList').innerHTML = '';
  updateStats();
}

function toggleDark() {
  document.getElementById('app').classList.toggle('dark');
  document.getElementById('darkBtn').textContent =
    document.getElementById('app').classList.contains('dark') ? 'Light Mode' : 'Dark Mode';
}

function updateStats() {
  const items = document.querySelectorAll('#itemList li');
  const done  = document.querySelectorAll('#itemList li.done');
  document.getElementById('stats').textContent =
    items.length ? items.length + ' items, ' + done.length + ' completed' : 'No items';
}`,
      mode: 'full',
    },
  ],
  exercises: [
    {
      id: 'dom-1',
      question: 'Which method selects the FIRST element matching a CSS selector?',
      type: 'multiple-choice',
      options: ['getElementById()', 'querySelectorAll()', 'querySelector()', 'getElement()'],
      correct: 2,
      explanation: 'querySelector(selector) returns the first matching element. querySelectorAll() returns all matches as a NodeList.',
    },
    {
      id: 'dom-2',
      question: 'Why is textContent safer than innerHTML?',
      type: 'multiple-choice',
      options: ['textContent is faster', 'textContent treats content as plain text — no HTML parsing, preventing XSS attacks', 'innerHTML does not work on all browsers', 'They are identical'],
      correct: 1,
      explanation: 'innerHTML parses HTML — user input containing script tags could execute malicious code. textContent treats everything as literal text, so it is safe for user-provided content.',
    },
  ],
  quiz: [
    {
      id: 'qdom1',
      question: 'What is Event Delegation?',
      options: ['Removing event listeners', 'Adding a listener to a PARENT element to handle events from CHILD elements', 'Delaying events', 'Copying events between elements'],
      correct: 1,
      explanation: 'Event delegation uses event bubbling — events bubble up from child to parent. By listening on the parent, you handle clicks on any child (even dynamically added ones) without adding individual listeners to each child.',
    },
    {
      id: 'qdom2',
      question: 'What does event.preventDefault() do?',
      options: ['Stops the event from bubbling', 'Prevents the default browser action (like form submission or link navigation)', 'Removes the event listener', 'Delays the event'],
      correct: 1,
      explanation: "preventDefault() stops the browser's default behavior. On a form submit it stops page reload. On a link click it stops navigation.",
    },
  ],
};
