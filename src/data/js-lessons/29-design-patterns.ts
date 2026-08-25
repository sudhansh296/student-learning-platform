import type { JSLesson } from '../js-curriculum';
export const jsDesignPatternsLesson: JSLesson = {
  id:'js-patterns',title:'Design Patterns in JavaScript',slug:'design-patterns',chapter:'advanced',order:30,difficulty:'advanced',readingTime:14,
  description:'Essential JavaScript design patterns - Singleton, Observer, Factory, Module, Strategy, and how they appear in real codebases.',
  sections:[
    {type:'text',content:'Design patterns are proven, reusable solutions to common problems in software design. They are not specific algorithms but rather templates for how to structure your code. Recognizing these patterns will help you read any professional JavaScript codebase.'},
    {type:'heading',content:'Singleton Pattern'},
    {type:'example',title:'Ensure only one instance exists',content:'The Singleton pattern guarantees that a class has only one instance. Every call to getInstance() returns the same object. This is useful for resources that must be shared and consistent across the entire app - app configuration, a logger, a WebSocket connection, or an event bus. The private static #instance field holds the single instance once created.',language:'javascript',code:`// Singleton - only one instance ever created
class Config {
  static #instance = null;
  #settings = {};

  constructor() {
    if (Config.#instance) return Config.#instance;
    this.#settings = { theme: "light", lang: "en", debug: false };
    Config.#instance = this;
  }

  get(key) { return this.#settings[key]; }
  set(key, value) { this.#settings[key] = value; }

  static getInstance() {
    if (!Config.#instance) new Config();
    return Config.#instance;
  }
}

const config1 = Config.getInstance();
const config2 = Config.getInstance();
console.log(config1 === config2); // true - same instance!

config1.set("theme", "dark");
console.log(config2.get("theme")); // "dark" - same object

// Real-world: database connections, app config, loggers`},
    {type:'heading',content:'Observer / Pub-Sub Pattern'},
    {type:'example',title:'Decouple producers from consumers',content:'The Observer (pub/sub) pattern lets components communicate without knowing about each other. Publishers fire events with data. Subscribers listen for specific events and react. Neither side imports or depends on the other - they only share the event bus. This is the same pattern used by DOM events, Node.js EventEmitter, and React state management libraries like Redux.',language:'javascript',code:`// Observer - objects subscribe to events and get notified
class EventBus {
  #subscribers = new Map();

  subscribe(event, callback) {
    if (!this.#subscribers.has(event)) {
      this.#subscribers.set(event, new Set());
    }
    this.#subscribers.get(event).add(callback);

    // Return unsubscribe function
    return () => this.#subscribers.get(event)?.delete(callback);
  }

  publish(event, data) {
    this.#subscribers.get(event)?.forEach(cb => {
      try { cb(data); } catch(e) { console.error("Subscriber error:", e); }
    });
  }

  once(event, callback) {
    const unsub = this.subscribe(event, (data) => {
      callback(data);
      unsub();
    });
    return unsub;
  }
}

// Usage
const bus = new EventBus();

const unsub = bus.subscribe("user:login", ({ name }) => {
  console.log("Welcome,", name);
  updateNavbar(name);
});

bus.subscribe("user:login", ({ name }) => {
  analytics.track("login", { user: name });
});

// Trigger event from anywhere
bus.publish("user:login", { name: "Alice", role: "admin" });
// Both subscribers notified independently!

// Cleanup
unsub(); // unsubscribe first handler
`},
    {type:'heading',content:'Factory Pattern'},
    {type:'example',title:'Create objects without specifying exact class',content:'The Factory pattern centralizes object creation logic. Instead of calling new UserAdmin() or new UserEditor() directly throughout your code, you call createUser("admin", data) and the factory decides what to build. This makes it easy to add new types later - just add a case to the factory. It also hides complexity and keeps creation logic in one place.',language:'javascript',code:`// Factory - delegate object creation to a function/method
function createUser(type, data) {
  const base = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    ...data,
  };

  switch (type) {
    case "admin":
      return { ...base, role: "admin", permissions: ["read","write","delete","manage"] };
    case "editor":
      return { ...base, role: "editor", permissions: ["read","write"] };
    case "viewer":
      return { ...base, role: "viewer", permissions: ["read"] };
    default:
      throw new Error(\`Unknown user type: \${type}\`);
  }
}

const admin  = createUser("admin",  { name: "Alice", email: "alice@example.com" });
const editor = createUser("editor", { name: "Bob",   email: "bob@example.com" });

// Abstract factory - create families of related objects
class UIFactory {
  static create(platform) {
    const factories = { web: WebUIFactory, mobile: MobileUIFactory };
    const Factory = factories[platform];
    if (!Factory) throw new Error(\`Unknown platform: \${platform}\`);
    return new Factory();
  }
}

class WebUIFactory {
  createButton(label) { return \`<button class="web-btn">\${label}</button>\`; }
  createInput(type) { return \`<input type="\${type}" class="web-input">\`; }
}

const factory = UIFactory.create("web");
factory.createButton("Submit"); // <button class="web-btn">Submit</button>`},
    {type:'heading',content:'Strategy Pattern'},
    {type:'example',title:'Swap algorithms at runtime',content:'The Strategy pattern lets you swap the algorithm (behaviour) inside a class without changing the class itself. The Sorter class does not care HOW the data gets sorted - it just calls this.strategy.sort(). You can swap strategies at runtime by setting sorter.strategy = differentAlgorithm. Real-world uses: different payment methods, multiple auth strategies (OAuth vs JWT), or compression algorithms.',language:'javascript',code:`// Strategy - encapsulate interchangeable algorithms
class Sorter {
  constructor(strategy) {
    this.strategy = strategy;
  }

  sort(data) {
    return this.strategy.sort([...data]);
  }
}

const bubbleSort = {
  sort(arr) {
    for (let i = 0; i < arr.length; i++)
      for (let j = 0; j < arr.length - i - 1; j++)
        if (arr[j] > arr[j+1]) [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
    return arr;
  }
};

const quickSort = {
  sort(arr) {
    if (arr.length <= 1) return arr;
    const pivot = arr[Math.floor(arr.length/2)];
    const left  = arr.filter(x => x < pivot);
    const mid   = arr.filter(x => x === pivot);
    const right = arr.filter(x => x > pivot);
    return [...this.sort(left), ...mid, ...this.sort(right)];
  }
};

const sorter = new Sorter(quickSort);
console.log(sorter.sort([5,3,8,1,9,2])); // sorted

sorter.strategy = bubbleSort; // swap algorithm at runtime!
console.log(sorter.sort([5,3,8,1,9,2])); // same result, different algorithm

// Real-world: payment methods, auth strategies, compression algorithms
class PaymentProcessor {
  #strategy;

  setStrategy(strategy) { this.#strategy = strategy; }

  process(amount) {
    if (!this.#strategy) throw new Error("No payment strategy set");
    return this.#strategy.process(amount);
  }
}

const processor = new PaymentProcessor();
processor.setStrategy({ process: (amt) => \`Charged \${amt} via Stripe\` });
processor.process(99.99); // "Charged 99.99 via Stripe"`},
    {type:'heading',content:'Module Pattern'},
    {type:'example',title:'Private state with public API',content:'The Module pattern uses an immediately-invoked function expression (IIFE) to create a private scope, then returns only the functions you want to make public. Variables inside the IIFE like items and discount are completely inaccessible from outside - true privacy without classes. This was the standard way to write modules before ES6 import/export, and you will still see it in older codebases.',language:'javascript',code:`// Module pattern - IIFE with public API (pre-ES6 modules)
const CartModule = (() => {
  // Private
  let items = [];
  let discount = 0;

  function calculateTotal() {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    return subtotal * (1 - discount);
  }

  // Public API
  return {
    addItem(name, price, qty = 1) {
      const existing = items.find(i => i.name === name);
      if (existing) existing.qty += qty;
      else items.push({ name, price, qty });
    },
    removeItem(name) {
      items = items.filter(i => i.name !== name);
    },
    setDiscount(pct) { discount = pct / 100; },
    getTotal() { return calculateTotal(); },
    getItems() { return [...items]; }, // copy, not reference
    clear() { items = []; discount = 0; },
  };
})();

CartModule.addItem("Laptop", 999, 1);
CartModule.addItem("Mouse", 29, 2);
CartModule.setDiscount(10); // 10% off
console.log(CartModule.getTotal()); // 964.8
// CartModule.items - undefined (private!)`},
    {type:'tryit',title:'Try It: Design Patterns',
     html:`<div id="app">
  <h2>Observer Pattern Demo</h2>
  <div class="controls">
    <input id="msgInput" placeholder="Type a message..."/>
    <select id="channel">
      <option value="general">general</option>
      <option value="alerts">alerts</option>
      <option value="updates">updates</option>
    </select>
    <button onclick="publish()">Publish Event</button>
  </div>
  <div class="subscribers">
    <div class="sub" id="sub1"><h4>📧 Email Logger (subscribed to: general, alerts)</h4><div id="sub1-log"></div></div>
    <div class="sub" id="sub2"><h4>📱 Push Notifications (subscribed to: alerts)</h4><div id="sub2-log"></div></div>
    <div class="sub" id="sub3"><h4>📊 Analytics (subscribed to: all)</h4><div id="sub3-log"></div></div>
  </div>
</div>`,
     css:`#app{font-family:system-ui,sans-serif;padding:20px;max-width:520px;}
h2{color:#1e1e1e;margin-bottom:12px;}
.controls{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:14px;}
input{flex:1;padding:8px 10px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:13px;outline:none;min-width:120px;}
select{padding:8px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:13px;background:white;outline:none;}
button{padding:8px 14px;background:#2563eb;color:white;border:none;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;}
.subscribers{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.sub{background:white;border:1px solid #e5e7eb;border-radius:10px;padding:12px;}
.sub h4{font-size:12px;color:#374151;margin:0 0 8px;line-height:1.4;}
.entry{font-size:11px;padding:4px 6px;border-radius:5px;margin:2px 0;background:#f8fafc;color:#374151;border-left:3px solid #2563eb;}`,
     js:`class EventBus {
  #subs = new Map();
  subscribe(e, cb) {
    if (!this.#subs.has(e)) this.#subs.set(e, new Set());
    this.#subs.get(e).add(cb);
  }
  publish(e, data) { this.#subs.get(e)?.forEach(cb => cb(data)); }
}

const bus = new EventBus();

function addLog(elId, msg) {
  const d = document.createElement('div');
  d.className = 'entry';
  d.textContent = new Date().toLocaleTimeString() + ': ' + msg;
  document.getElementById(elId).prepend(d);
}

// Subscribers
bus.subscribe('general', d => addLog('sub1-log', d.msg));
bus.subscribe('alerts',  d => addLog('sub1-log', '🚨 ALERT: ' + d.msg));
bus.subscribe('alerts',  d => addLog('sub2-log', d.msg));
['general','alerts','updates'].forEach(ch =>
  bus.subscribe(ch, d => addLog('sub3-log', '[' + ch + '] ' + d.msg))
);

function publish() {
  const msg = document.getElementById('msgInput').value.trim();
  const channel = document.getElementById('channel').value;
  if (!msg) return;
  bus.publish(channel, { msg, channel, timestamp: Date.now() });
  document.getElementById('msgInput').value = '';
}`,mode:'full'},
  ],
  exercises:[{id:'dp1',question:'What problem does the Observer pattern solve?',type:'multiple-choice',options:['Slow algorithms','Tight coupling between components - publishers and subscribers do not know about each other',  'Memory leaks','Too many classes'],correct:1,explanation:'The Observer pattern (pub/sub) decouples components. A publisher fires events without knowing who is listening. Subscribers respond to events without knowing who fired them. This makes components independent and easy to add/remove.'}],
  quiz:[{id:'dq1',question:'When would you use the Singleton pattern?',options:['Every class should be a Singleton','When you need exactly one shared instance (config, logger, DB connection, event bus)','When performance is critical','For all utility functions'],correct:1,explanation:'Use Singleton for resources that should be shared and have exactly one instance: app configuration, logging service, database connection pool, event bus. Avoid overusing it - it can make testing harder since you cannot easily swap the instance.'}],
};
