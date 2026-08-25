import type { JSLesson } from '../js-curriculum';
export const jsEventLoopLesson: JSLesson = {
  id:'js-event-loop',title:'Event Loop - How JS Really Works',slug:'event-loop',chapter:'async',order:28,difficulty:'advanced',readingTime:12,
  description:'Understand the JavaScript runtime - call stack, event loop, task queue, microtask queue - and why output order sometimes surprises you.',
  sections:[
    {type:'text',content:'JavaScript is single-threaded - it can only do one thing at a time. Yet it handles async operations without freezing. Understanding the event loop explains exactly HOW this works, and why certain code runs in unexpected orders.'},
    {type:'analogy',title:'A chef in a restaurant',content:'JavaScript is like a chef (single-threaded) with one pair of hands. The chef handles requests one at a time. When they start a slow task (like waiting for an oven), instead of standing there frozen, they hand it to a timer assistant (Web API). When the timer is done, the assistant places a ticket on the queue. The chef finishes their current task, checks the queue, and handles the next ticket.'},
    {type:'heading',content:'The Components'},
    {type:'example',title:'Call stack, Web APIs, queues',content:'The JavaScript runtime has four key parts: the call stack runs synchronous code one frame at a time. Web APIs (setTimeout, fetch, DOM events) are handled by the browser outside the stack. When ready, their callbacks go into the callback queue (macrotasks). Promise callbacks go into the microtask queue. The event loop checks: is the stack empty? If yes - drain all microtasks, then take ONE macrotask. Repeat.',language:'javascript',code:`// THE COMPONENTS:
// 1. CALL STACK - currently executing functions (LIFO)
// 2. WEB APIs - browser handles these (setTimeout, fetch, DOM events)
// 3. CALLBACK QUEUE (macro tasks) - setTimeout, setInterval, I/O callbacks
// 4. MICROTASK QUEUE - Promise.then, queueMicrotask, MutationObserver
// 5. EVENT LOOP - checks if stack is empty, processes queues

// Order: Call Stack → Microtask Queue → Callback Queue

console.log("1: Start");                          // sync - stack

setTimeout(() => console.log("4: Timeout"), 0);  // callback queue

Promise.resolve().then(() => console.log("3: Promise")); // microtask queue

console.log("2: End");                            // sync - stack

// Output order:
// 1: Start
// 2: End
// 3: Promise  ← microtasks run BEFORE macro tasks
// 4: Timeout  ← macro tasks run after all microtasks`},
    {type:'heading',content:'Microtasks vs Macrotasks'},
    {type:'example',title:'Priority order explained',content:'Microtasks (Promises, queueMicrotask) have higher priority than macrotasks (setTimeout, setInterval). After each task completes, JavaScript drains the ENTIRE microtask queue before picking the next macrotask. This means if you keep creating microtasks inside microtasks, setTimeout callbacks are blocked forever - called "microtask starvation". In practice: Promise.then always runs before setTimeout even with 0ms delay.',language:'javascript',code:`// MICROTASKS - run immediately after current stack, before next macro task
// Sources: Promise.then, Promise.catch, async/await, queueMicrotask
Promise.resolve().then(() => console.log("Microtask 1"));
Promise.resolve().then(() => console.log("Microtask 2"));

// MACROTASKS - run one at a time after microtask queue is empty
// Sources: setTimeout, setInterval, setImmediate, I/O, UI events
setTimeout(() => console.log("Macro 1"), 0);
setTimeout(() => console.log("Macro 2"), 0);

console.log("Sync");

// Output:
// Sync        (call stack)
// Microtask 1 (microtask queue - all cleared before any macro)
// Microtask 2
// Macro 1     (macro task queue - one per loop iteration)
// Macro 2

// Microtasks can BLOCK macrotasks!
async function floodMicrotasks() {
  while (true) {
    await Promise.resolve(); // keeps creating microtasks
    // This will starve setTimeout callbacks!
  }
}
// Never do this - use setTimeout/0 to yield to macrotask queue

// Correct pattern for deferring work
queueMicrotask(() => {
  // Runs before any setTimeout, after current task
  console.log("Queued microtask");
});`},
    {type:'heading',content:'async/await Under the Hood'},
    {type:'example',title:'What async/await actually does',content:'Every await creates a checkpoint. Code BEFORE await runs synchronously as part of the current task. Code AFTER await is scheduled as a microtask to run after the current stack clears. This is why code that appears after an async function call runs before the continuation inside the async function - the continuation is queued as a microtask, not executed immediately.',language:'javascript',code:`// async/await is syntactic sugar over Promises + generators
// Each "await" pauses the function and schedules the continuation as a microtask

async function example() {
  console.log("1 - before await");
  const result = await somePromise();
  console.log("3 - after await"); // scheduled as microtask!
}

example();
console.log("2 - synchronous code after calling example()");

// Output:
// 1 - before await
// 2 - synchronous code  ← runs BEFORE the continuation
// 3 - after await       ← microtask runs after current stack clears

// Multiple awaits
async function multiStep() {
  console.log("A");
  await step1(); // pause, schedule B as microtask
  console.log("B");
  await step2(); // pause, schedule C as microtask
  console.log("C");
}

// Understanding this explains why:
// - You can't mix await and synchronous code expecting sequential execution
// - setTimeout(fn, 0) runs after Promise microtasks
// - Event handlers run as new macro tasks`},
    {type:'tryit',title:'Try It: Event Loop Order',
     html:`<div id="app">
  <h2>Event Loop Order Demo</h2>
  <button onclick="runDemo()">Run Demo</button>
  <p style="font-size:13px;color:#6b7280">Watch the order in which items appear</p>
  <div id="output"></div>
</div>`,
     css:`#app{font-family:system-ui,sans-serif;padding:20px;max-width:460px;}
h2{color:#1e1e1e;}
button{padding:9px 18px;background:#2563eb;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;margin-bottom:8px;}
.entry{padding:8px 12px;border-radius:8px;margin:4px 0;font-size:13px;font-family:monospace;animation:slideIn .2s ease;}
.sync{background:#eff6ff;border-left:4px solid #2563eb;}
.micro{background:#f0fdf4;border-left:4px solid #22c55e;}
.macro{background:#fff7ed;border-left:4px solid #f59e0b;}
@keyframes slideIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:none}}`,
     js:`function runDemo() {
  const out = document.getElementById('output');
  out.innerHTML = '';
  const add = (text, type) => {
    const d = document.createElement('div');
    d.className = 'entry ' + type;
    d.textContent = text;
    out.appendChild(d);
  };

  // Clear after short delay so we see previous run clear
  setTimeout(() => {
    add('① Sync: Start', 'sync');

    setTimeout(() => add('⑤ Macro: setTimeout(0) - 1st', 'macro'), 0);
    setTimeout(() => add('⑥ Macro: setTimeout(0) - 2nd', 'macro'), 0);

    Promise.resolve().then(() => add('③ Micro: Promise.then - 1st', 'micro'));
    Promise.resolve().then(() => add('④ Micro: Promise.then - 2nd', 'micro'));

    queueMicrotask(() => add('🔵 Micro: queueMicrotask', 'micro'));

    add('② Sync: End', 'sync');
  }, 100);
}`,mode:'full'},
  ],
  exercises:[{id:'el1',question:'Why do Promise callbacks run before setTimeout callbacks (even with 0ms delay)?',type:'multiple-choice',options:['Promises are faster','Promises go into the microtask queue which is processed before the macrotask queue','setTimeout is broken','JavaScript prioritizes Promises'],correct:1,explanation:'Promises use the MICROTASK queue. setTimeout uses the MACROTASK queue. The event loop always processes ALL pending microtasks before picking up the next macro task. So even setTimeout(fn, 0) runs after all pending Promise callbacks.'}],
  quiz:[{id:'eq1',question:'What is the event loop?',options:['A type of JavaScript loop','The mechanism that checks if the call stack is empty and processes queued callbacks','A method on Array','A way to handle errors'],correct:1,explanation:'The event loop continuously checks: "Is the call stack empty?" If yes, it first processes all microtasks, then picks one macro task from the callback queue and pushes it onto the call stack. This single mechanism enables all of JavaScript\'s asynchronous behavior.'}],
};
