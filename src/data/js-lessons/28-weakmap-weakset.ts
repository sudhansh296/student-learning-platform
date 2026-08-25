import type { JSLesson } from '../js-curriculum';
export const jsWeakLesson: JSLesson = {
  id:'js-weakmap',title:'WeakMap, WeakSet & Memory',slug:'weakmap-weakset',chapter:'advanced',order:29,difficulty:'advanced',readingTime:8,
  description:'Understand WeakMap, WeakSet, garbage collection, and when to use weak references for memory-efficient code.',
  sections:[
    {type:'text',content:'WeakMap and WeakSet are memory-friendly versions of Map and Set. Their keys must be objects, and they hold "weak" references - meaning they don\'t prevent the garbage collector from cleaning up objects when no other reference exists. This is critical for avoiding memory leaks in long-running applications.'},
    {type:'heading',content:'WeakMap - Object-Keyed Private Data'},
    {type:'example',title:'WeakMap basics and use cases',content:'WeakMap is like Map but with two key differences: keys must be objects, and it holds "weak" references. Weak means: if the only thing keeping an object alive is being a WeakMap key, the garbage collector can clean it up and the entry disappears automatically. This prevents memory leaks. WeakMap is not enumerable - you cannot loop its entries - which is intentional.',language:'javascript',code:`// WeakMap - keys MUST be objects, values can be anything
// Weak reference: key being garbage collected removes the entry

const wm = new WeakMap();
let obj = { id: 1 };

wm.set(obj, { secret: "private data" });
console.log(wm.has(obj));        // true
console.log(wm.get(obj).secret); // "private data"
wm.delete(obj);

// WeakMap is NOT enumerable - no keys(), values(), forEach(), size
// This is intentional for security and GC

// USE CASE 1: Private class data (before # fields)
const _private = new WeakMap();

class User {
  constructor(name, password) {
    this.name = name;
    _private.set(this, { password, loginAttempts: 0 });
  }

  login(password) {
    const priv = _private.get(this);
    if (password !== priv.password) {
      priv.loginAttempts++;
      if (priv.loginAttempts >= 3) throw new Error("Account locked");
      return false;
    }
    priv.loginAttempts = 0;
    return true;
  }

  get attempts() { return _private.get(this).loginAttempts; }
}

const user = new User("Alice", "secret123");
user.login("wrong"); user.login("wrong");
console.log(user.attempts); // 2
// user._private is undefined - truly private!

// USE CASE 2: Cache associated with objects (auto-cleans when object is GC'd)
const cache = new WeakMap();

function processExpensively(obj) {
  if (cache.has(obj)) return cache.get(obj); // cache hit
  const result = { processed: true, data: obj.data };
  cache.set(obj, result); // cache for future calls
  return result;
}

// When obj is GC'd, the cache entry disappears automatically!`},
    {type:'heading',content:'WeakSet - Track Objects Without Preventing GC'},
    {type:'example',title:'WeakSet use cases',content:'WeakSet stores a set of objects with weak references - when the object is garbage collected, it is automatically removed from the set. The most useful application is tracking which objects have already been processed without preventing them from being cleaned up when no longer needed. It is also used to detect circular references in recursive algorithms like deep cloning.',language:'javascript',code:`// WeakSet - set of objects with weak references
const ws = new WeakSet();
let elem = document.createElement('div');
ws.add(elem);
console.log(ws.has(elem));  // true
ws.delete(elem);

// WeakSet is also NOT enumerable

// USE CASE: Track which objects have been processed
const processed = new WeakSet();

function processOnce(obj) {
  if (processed.has(obj)) {
    console.log("Already processed");
    return;
  }
  // ... do the work
  processed.add(obj);
  console.log("Processed:", obj.id);
}

// USE CASE: Circular reference detection
function deepClone(obj, seen = new WeakSet()) {
  if (typeof obj !== 'object' || obj === null) return obj;
  if (seen.has(obj)) throw new Error("Circular reference detected");

  seen.add(obj);
  const clone = Array.isArray(obj) ? [] : {};
  for (const key of Object.keys(obj)) {
    clone[key] = deepClone(obj[key], seen);
  }
  return clone;
}`},
    {type:'heading',content:'Memory Management and Garbage Collection'},
    {type:'example',title:'Understanding memory leaks',content:'A memory leak happens when your code holds a reference to an object that is no longer needed, preventing the garbage collector from freeing it. The classic example: storing DOM elements in a regular Map - even after the element is removed from the page, the Map keeps it alive. Switching to WeakMap fixes this because the reference is weak and does not count for GC purposes.',language:'javascript',code:`// MEMORY LEAK - strong references prevent GC
const handlers = new Map(); // Map holds strong references

function addHandler(element, handler) {
  handlers.set(element, handler);       // element kept alive by Map!
  element.addEventListener('click', handler);
}

function removeElement(element) {
  element.remove();                      // removed from DOM
  // But Map still holds reference - MEMORY LEAK!
  // handlers.delete(element); // must manually clean up
}

// SOLUTION - use WeakMap (auto-cleans when element is GC'd)
const handlers2 = new WeakMap();

function addHandler2(element, handler) {
  handlers2.set(element, handler);
  element.addEventListener('click', handler);
  // When element is removed and no other references exist,
  // WeakMap entry is automatically cleaned up - no memory leak!
}

// Common memory leak patterns to avoid:
// 1. Event listeners not removed when element is destroyed
// 2. Timers/intervals not cleared
// 3. Closures holding references to DOM nodes that were removed
// 4. Global variables accumulating data

// Best practices:
// - Use WeakMap/WeakSet for object metadata and caches
// - Always clear timeouts and intervals: clearTimeout(id)
// - Remove event listeners: removeEventListener
// - Set large object references to null when done: bigData = null`},
    {type:'tryit',title:'Try It: WeakMap Demo',
     html:`<div id="app">
  <h2>WeakMap - Private Data Pattern</h2>
  <button onclick="runDemo()">Run Demo</button>
  <pre id="out"></pre>
</div>`,
     css:`#app{font-family:system-ui,sans-serif;padding:20px;max-width:460px;}h2{color:#1e1e1e;}
button{padding:9px 18px;background:#2563eb;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;margin-bottom:10px;}
pre{background:#0d1117;color:#e6edf3;padding:14px;border-radius:10px;font-size:12px;line-height:1.7;white-space:pre-wrap;}`,
     js:`const _priv = new WeakMap();
class SecureAccount {
  constructor(owner, balance) {
    _priv.set(this, { balance, transactions: [] });
    this.owner = owner;
  }
  deposit(n) {
    const p = _priv.get(this);
    p.balance += n;
    p.transactions.push('+$' + n);
  }
  withdraw(n) {
    const p = _priv.get(this);
    if (n > p.balance) throw new Error('Insufficient funds');
    p.balance -= n;
    p.transactions.push('-$' + n);
  }
  get balance() { return _priv.get(this).balance; }
  get history() { return _priv.get(this).transactions.join(', '); }
}

function runDemo() {
  const lines = [];
  const log = s => lines.push(s);
  try {
    const acc = new SecureAccount('Alice', 1000);
    log('Created account for ' + acc.owner + ' with $1000');
    acc.deposit(500);
    log('Deposited $500');
    acc.withdraw(200);
    log('Withdrew $200');
    log('Balance: $' + acc.balance);
    log('History: ' + acc.history);
    log('');
    log('Trying to access private data:');
    log('acc._priv: ' + acc._priv + ' (undefined - truly private!)');
    log('acc.balance: ' + acc.balance + ' (only via getter)');
    log('');
    try { acc.withdraw(2000); } catch(e) { log('Error: ' + e.message); }
  } catch(e) { log('Error: ' + e.message); }
  document.getElementById('out').textContent = lines.join('\ ');
}`,mode:'full'},
  ],
  exercises:[{id:'wm1',question:'Why can WeakMap keys only be objects?',type:'multiple-choice',options:['Performance reasons','Only objects can be garbage collected - weak references only make sense for GC-able values','It is an arbitrary restriction','Security reasons'],correct:1,explanation:'WeakMap holds "weak" references that allow garbage collection. Primitives (strings, numbers) are not garbage collected the same way objects are. Since the whole point of WeakMap is to not prevent GC, only object keys make sense.'}],
  quiz:[{id:'wq1',question:'When would you use WeakMap over Map?',options:['When you need to iterate over entries','When you want metadata/caches attached to objects that should auto-clean when the object is GC\'d','When performance is important','When keys are strings'],correct:1,explanation:'Use WeakMap when you want to associate data with objects without preventing their garbage collection. Classic uses: private class data, DOM element metadata, and object caches that should clean themselves up automatically.'}],
};
