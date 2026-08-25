import type { JSLesson } from '../js-curriculum';
export const jsEventsLesson: JSLesson = {
  id:'js-events',title:'Events - Deep Dive',slug:'events',chapter:'dom',order:24,difficulty:'intermediate',readingTime:12,
  description:'Master browser events - propagation, delegation, custom events, keyboard/mouse/form/touch events, and debouncing.',
  sections:[
    {type:'text',content:'Events are the heartbeat of interactive web applications. Every click, keypress, scroll, resize, and network response triggers an event. JavaScript listens to these events and responds. Deep knowledge of the event system separates good developers from great ones.'},
    {type:'heading',content:'Event Propagation - Bubbling and Capturing'},
    {type:'example',title:'How events travel through the DOM',content:'When you click an element, the event does not just fire on that element. It travels through the DOM in three phases: capture (top to bottom), target (the clicked element), then bubble (bottom to top). By default, addEventListener uses the bubble phase. Passing true as the third argument switches to capture. stopPropagation() stops the event from continuing its journey up or down the tree.',language:'javascript',code:`// Events flow in 3 phases:
// 1. CAPTURE - from document down to target
// 2. TARGET - the element that was clicked
// 3. BUBBLE - from target back up to document

// By default, listeners use BUBBLE phase
document.querySelector('#outer').addEventListener('click', () => {
  console.log('outer - bubble'); // fires 2nd
});
document.querySelector('#inner').addEventListener('click', () => {
  console.log('inner - bubble'); // fires 1st (target)
});

// Capture phase - fires first (before bubble)
document.querySelector('#outer').addEventListener('click', () => {
  console.log('outer - capture'); // fires 0th (before anything)
}, true); // true = capture phase

// Clicking #inner → output order:
// "outer - capture" (capture phase)
// "inner - bubble" (target phase)
// "outer - bubble" (bubble phase)

// stopPropagation - stop the event from bubbling
document.querySelector('#inner').addEventListener('click', (e) => {
  e.stopPropagation(); // event stops here, won't reach #outer
});

// stopImmediatePropagation - stops ALL listeners on this element too
el.addEventListener('click', (e) => {
  e.stopImmediatePropagation();
});`},
    {type:'heading',content:'Event Delegation - One Listener for Many Elements'},
    {type:'example',title:'Handle dynamic lists efficiently',content:'Instead of adding a click listener to every list item (expensive and breaks for dynamically added items), add ONE listener to the parent container. When anything inside is clicked, the event bubbles up to the parent. Use event.target.closest("li") to find which item was clicked - closest() walks up the DOM tree until it finds a matching element. Check data attributes like dataset.action to know what action to take.',language:'javascript',code:`// INSTEAD of adding a listener to every <li>:
// document.querySelectorAll('li').forEach(li => li.addEventListener('click', handler));
// (breaks for dynamically added elements!)

// USE event delegation on parent:
const list = document.querySelector('#list');

list.addEventListener('click', (event) => {
  // event.target = what was actually clicked (could be button inside li)
  // event.currentTarget = the list (where listener is attached)

  const item = event.target.closest('li'); // walk up to nearest li
  if (!item) return; // clicked on list itself, not an item

  const action = event.target.dataset.action; // data attribute

  if (action === 'delete') {
    item.remove();
    console.log('Deleted:', item.dataset.id);
  } else if (action === 'edit') {
    item.contentEditable = 'true';
    item.focus();
  } else {
    // Clicked the item itself
    item.classList.toggle('selected');
  }
});

// Now this works for dynamically added items too!
function addItem(text, id) {
  const li = document.createElement('li');
  li.dataset.id = id;
  li.innerHTML = \`\${text} <button data-action="delete">✕</button>\`;
  list.appendChild(li);
}`},
    {type:'heading',content:'Custom Events'},
    {type:'example',title:'Create and dispatch your own events',content:'CustomEvent lets you create your own named events and dispatch them on any DOM element. Pass data in the detail property. Any code that listens for that event name will receive it. The EventEmitter class shown here is a pure JavaScript implementation of the same pattern - used for communication between non-DOM components without any framework.',language:'javascript',code:`// Create custom event
const event = new CustomEvent('userLoggedIn', {
  detail: { userId: 1, name: 'Alex', role: 'admin' },
  bubbles: true,    // bubbles up the DOM
  cancelable: true, // can be prevented
});

// Listen for custom event
document.addEventListener('userLoggedIn', (e) => {
  console.log('User logged in:', e.detail.name);
  updateNav(e.detail);
});

// Dispatch the event
document.querySelector('#loginBtn').addEventListener('click', () => {
  document.dispatchEvent(event);
});

// EventEmitter pattern for non-DOM communication
class EventEmitter {
  #events = new Map();

  on(event, listener) {
    if (!this.#events.has(event)) this.#events.set(event, []);
    this.#events.get(event).push(listener);
    return this;
  }

  off(event, listener) {
    const listeners = this.#events.get(event) || [];
    this.#events.set(event, listeners.filter(l => l !== listener));
    return this;
  }

  emit(event, ...args) {
    (this.#events.get(event) || []).forEach(l => l(...args));
    return this;
  }

  once(event, listener) {
    const wrapper = (...args) => { listener(...args); this.off(event, wrapper); };
    return this.on(event, wrapper);
  }
}

const emitter = new EventEmitter();
emitter.on('data', data => console.log('Received:', data));
emitter.emit('data', { id: 1 }); // "Received: { id: 1 }"`},
    {type:'heading',content:'Debounce and Throttle'},
    {type:'example',title:'Control event frequency',content:'Some events fire dozens of times per second - scroll, resize, and input can overwhelm your app if you react to every single one. Debounce delays execution until the user stops - perfect for search inputs where you only want to fire the API call after they stop typing. Throttle caps execution to once per time window - perfect for scroll handlers where you want updates but not too frequently.',language:'javascript',code:`// DEBOUNCE - wait N ms after last call before executing
// Use for: search input, window resize, save drafts
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

const searchInput = document.querySelector('#search');
const debouncedSearch = debounce((query) => {
  fetch(\`/api/search?q=\${query}\`).then(r => r.json()).then(displayResults);
}, 300); // waits 300ms after user stops typing

searchInput.addEventListener('input', e => debouncedSearch(e.target.value));

// THROTTLE - execute at most once per N ms
// Use for: scroll events, mouse move, game loops
function throttle(fn, limit) {
  let inThrottle = false;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

const throttledScroll = throttle(() => {
  console.log('Scroll position:', window.scrollY);
}, 100); // at most once per 100ms

window.addEventListener('scroll', throttledScroll);`},
    {type:'tryit',title:'Try It: Event System',
     html:`<div id="app">
  <h2>Events Demo</h2>
  <h3>Event Delegation (click any item)</h3>
  <ul id="delegation-list">
    <li data-id="1">Item 1 <button data-action="delete">✕</button></li>
    <li data-id="2">Item 2 <button data-action="delete">✕</button></li>
    <li data-id="3">Item 3 <button data-action="delete">✕</button></li>
  </ul>
  <button onclick="addListItem()">Add Item</button>
  <h3 style="margin-top:16px">Debounced Search</h3>
  <input id="searchBox" placeholder="Type to search (debounced 400ms)"/>
  <p id="search-status">Type something...</p>
  <p id="search-count" style="font-size:12px;color:#6b7280"></p>
  <h3 style="margin-top:16px">Custom Events</h3>
  <button onclick="fireCustomEvent()">Fire Custom Event</button>
  <p id="event-log"></p>
</div>`,
     css:`#app{font-family:system-ui,sans-serif;padding:20px;max-width:460px;}
h2{color:#1e1e1e;}h3{font-size:14px;font-weight:700;color:#374151;margin:12px 0 8px;}
ul{list-style:none;padding:0;margin:0 0 10px;}
li{display:flex;justify-content:space-between;align-items:center;padding:9px 14px;background:white;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:5px;font-size:14px;cursor:pointer;}
li.selected{background:#eff6ff;border-color:#bfdbfe;}
button.del-btn{background:none;border:none;color:#ef4444;cursor:pointer;font-size:15px;padding:0 4px;}
button{padding:8px 16px;background:#2563eb;color:white;border:none;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;}
input{width:100%;padding:9px 12px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:14px;outline:none;box-sizing:border-box;}
input:focus{border-color:#2563eb;}
p{margin:8px 0 0;font-size:13px;color:#374151;}`,
     js:`// Event delegation
let itemCount = 4;
document.getElementById('delegation-list').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (btn && btn.dataset.action === 'delete') {
    btn.closest('li').remove();
    return;
  }
  const li = e.target.closest('li');
  if (li) li.classList.toggle('selected');
});

function addListItem() {
  const li = document.createElement('li');
  li.dataset.id = itemCount;
  li.innerHTML = 'Item ' + itemCount + ' (dynamic) <button data-action="delete" class="del-btn">✕</button>';
  document.getElementById('delegation-list').appendChild(li);
  itemCount++;
}

// Debounce
function debounce(fn, ms) {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

let callCount = 0, debounceCount = 0;
const statusEl = document.getElementById('search-status');
const countEl  = document.getElementById('search-count');

const debouncedSearch = debounce((val) => {
  debounceCount++;
  statusEl.textContent = 'Searching for: "' + val + '"';
  countEl.textContent = 'Keystrokes: ' + callCount + ' | Actual searches: ' + debounceCount;
}, 400);

document.getElementById('searchBox').addEventListener('input', (e) => {
  callCount++;
  statusEl.textContent = 'Waiting... (debouncing)';
  debouncedSearch(e.target.value);
});

// Custom events
const log = document.getElementById('event-log');
document.addEventListener('app:notification', (e) => {
  log.textContent = 'Custom event received! Type: ' + e.detail.type + ', Message: ' + e.detail.message;
});

function fireCustomEvent() {
  document.dispatchEvent(new CustomEvent('app:notification', {
    detail: { type: 'success', message: 'Hello from a custom event!' },
    bubbles: true,
  }));
}`,mode:'full'},
  ],
  exercises:[{id:'ev1',question:'What is event bubbling?',type:'multiple-choice',options:['Events only fire on the element clicked','Events travel UP from target element to document after firing','Events are delayed','Events fire multiple times'],correct:1,explanation:'After an event fires on the target element, it bubbles up through all ancestor elements (parent, grandparent, etc.) to the document. This is why event delegation works - you catch events from children on the parent.'}],
  quiz:[{id:'eq1',question:'When should you use debounce vs throttle?',options:['They are the same thing','Debounce: wait for user to STOP (search input); Throttle: limit rate of execution (scroll, resize)','Throttle for search, debounce for scroll','Use only debounce'],correct:1,explanation:'Debounce waits for activity to STOP - perfect for search (run query after user stops typing). Throttle limits how often a function runs regardless - perfect for scroll/resize where you want updates but not too many.'}],
};
