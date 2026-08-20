import type { JSLesson } from '../js-curriculum';

export const jsClassesLesson: JSLesson = {
  id:'js-classes',title:'Classes & OOP',slug:'classes',
  chapter:'advanced',order:14,difficulty:'intermediate',readingTime:14,
  description:'Master ES6 classes — constructor, methods, inheritance, static, private fields, and the prototype chain.',
  sections:[
    {type:'text',content:'Classes in JavaScript (introduced in ES6) are syntactic sugar over prototypes. They provide a clean, readable way to create objects with shared behavior. If you are coming from another language like Java or Python, JavaScript classes will feel familiar.'},
    {type:'heading',content:'Basic Class Syntax'},
    {type:'example',title:'Creating and using a class',content:'A class is a blueprint for creating objects. The constructor() runs automatically when you use new ClassName(). Instance methods are functions that belong to every object created from the class. The get keyword creates a computed property — it looks like a property but runs a function. Static methods belong to the class itself, not to instances — useful for factory functions and utility methods.',language:'javascript',code:`class Person {
  // Constructor — runs when you create a new instance
  constructor(name, age) {
    this.name = name;  // instance property
    this.age  = age;
  }

  // Instance methods
  greet() {
    return \`Hi! I'm \${this.name}, \${this.age} years old.\`;
  }

  birthday() {
    this.age++;
    return \`Happy birthday \${this.name}! Now \${this.age}.\`;
  }

  // Getter — access like a property but computed
  get info() {
    return \`\${this.name} (\${this.age})\`;
  }

  // Setter
  set fullName(value) {
    const parts = value.split(" ");
    this.name = parts[0];
    this._lastName = parts[1];
  }

  // Static method — belongs to class, not instance
  static create(name, age) {
    return new Person(name, age);
  }

  // toString — called automatically when object used as string
  toString() {
    return \`Person { name: "\${this.name}", age: \${this.age} }\`;
  }
}

// Create instances with 'new'
const alice = new Person("Alice", 28);
const bob   = Person.create("Bob", 32); // using static method

console.log(alice.greet());    // "Hi! I'm Alice, 28 years old."
console.log(alice.info);       // "Alice (28)" — getter
console.log(alice.birthday()); // "Happy birthday Alice! Now 29."
console.log(alice + "");       // "Person { name: "Alice", age: 29 }"
console.log(typeof Person);    // "function" — classes ARE functions!`},
    {type:'heading',content:'Inheritance with extends'},
    {type:'example',title:'Extending classes',content:'Inheritance lets one class reuse everything from another. The extends keyword creates a subclass. super() calls the parent constructor — you MUST call it before using this in a subclass. super.method() calls the parent version of a method, so you can extend its behavior without rewriting it. instanceof checks the entire inheritance chain.',language:'javascript',code:`class Animal {
  constructor(name, sound) {
    this.name  = name;
    this.sound = sound;
  }

  speak() {
    return \`\${this.name} says \${this.sound}!\`;
  }

  toString() {
    return this.name;
  }
}

// extends creates a subclass
class Dog extends Animal {
  constructor(name, breed) {
    super(name, "Woof"); // call parent constructor FIRST
    this.breed = breed;
  }

  // Override parent method
  speak() {
    return \`\${super.speak()} (tail wagging)\`; // call parent method
  }

  fetch() {
    return \`\${this.name} fetches the ball!\`;
  }
}

class Cat extends Animal {
  constructor(name) {
    super(name, "Meow");
    this.lives = 9;
  }

  speak() {
    return \`\${super.speak()} (ignores you)\`;
  }
}

const dog = new Dog("Rex", "German Shepherd");
const cat = new Cat("Whiskers");

console.log(dog.speak()); // "Rex says Woof! (tail wagging)"
console.log(cat.speak()); // "Whiskers says Meow! (ignores you)"
console.log(dog.fetch()); // "Rex fetches the ball!"
console.log(dog instanceof Dog);    // true
console.log(dog instanceof Animal); // true (inherits!)`},
    {type:'heading',content:'Private Fields and Methods (ES2022)'},
    {type:'example',title:'Truly private data with # prefix',content:'The # prefix creates fields that are TRULY private — the JavaScript engine enforces this at the syntax level. Accessing #balance from outside the class throws a SyntaxError, not just a convention violation. This is different from the old _ prefix which was just a naming convention anyone could ignore. Use private fields to protect sensitive data like account balances, passwords, or internal state.',language:'javascript',code:`class BankAccount {
  // Private fields — CANNOT be accessed outside the class
  #balance;
  #transactionHistory = [];

  constructor(owner, initialBalance) {
    this.owner    = owner;  // public
    this.#balance = initialBalance; // private
  }

  // Private method
  #recordTransaction(type, amount) {
    this.#transactionHistory.push({
      type, amount,
      timestamp: new Date().toISOString(),
    });
  }

  deposit(amount) {
    if (amount <= 0) throw new Error("Amount must be positive");
    this.#balance += amount;
    this.#recordTransaction("deposit", amount);
    return \`Deposited $\${amount}. Balance: $\${this.#balance}\`;
  }

  withdraw(amount) {
    if (amount > this.#balance) throw new Error("Insufficient funds");
    this.#balance -= amount;
    this.#recordTransaction("withdrawal", amount);
    return \`Withdrew $\${amount}. Balance: $\${this.#balance}\`;
  }

  get balance() { return this.#balance; }           // read-only public getter
  get history()  { return [...this.#transactionHistory]; } // copy, not reference

  toString() { return \`Account(\${this.owner}): $\${this.#balance}\`; }
}

const account = new BankAccount("Alex", 1000);
console.log(account.deposit(500));   // "Deposited $500. Balance: $1500"
console.log(account.withdraw(200));  // "Withdrew $200. Balance: $1300"
console.log(account.balance);        // 1300 (getter)
// account.#balance;                 // ❌ SyntaxError — truly private!`},
    {type:'heading',content:'Static Fields and Methods'},
    {type:'example',title:'Class-level properties',content:'Static fields and methods belong to the CLASS itself, not to any instance. You call them as MathUtils.square(5), not new MathUtils().square(5). Static fields are shared across all instances — great for counters, caches, and configuration. A private static field (static #count) combined with a static getter gives you a read-only class-level counter.',language:'javascript',code:`class MathUtils {
  // Static fields — shared across all instances, belong to class
  static PI = 3.14159265358979;
  static E  = 2.71828182845905;

  // Static methods — called on class, not instance
  static square(n) { return n * n; }
  static cube(n)   { return n * n * n; }
  static clamp(value, min, max) { return Math.min(Math.max(value, min), max); }

  static randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

console.log(MathUtils.PI);             // 3.14159...
console.log(MathUtils.square(5));      // 25
console.log(MathUtils.clamp(150, 0, 100)); // 100

// Counter pattern with static field
class Counter {
  static #count = 0;  // private static

  constructor() {
    Counter.#count++;
    this.id = Counter.#count;
  }

  static getCount() { return Counter.#count; }
  static reset()    { Counter.#count = 0; }
}

const a = new Counter(); // id: 1
const b = new Counter(); // id: 2
const c = new Counter(); // id: 3
console.log(Counter.getCount()); // 3`},
    {type:'tryit',title:'Try It: Classes',
     html:`<div id="app">
  <h2>Class: Task Manager</h2>
  <div class="form">
    <input id="taskInput" placeholder="Task description..." />
    <select id="priority">
      <option value="high">High Priority</option>
      <option value="medium" selected>Medium</option>
      <option value="low">Low Priority</option>
    </select>
    <button onclick="addTask()">Add Task</button>
  </div>
  <div id="taskList"></div>
  <div id="stats"></div>
</div>`,
     css:`#app{font-family:system-ui,sans-serif;padding:20px;max-width:500px;}
h2{color:#1e1e1e;margin-bottom:12px;}
.form{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px;}
input{flex:1;padding:9px 12px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:14px;outline:none;min-width:120px;}
select{padding:9px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:13px;background:white;outline:none;}
button{padding:9px 16px;background:#2563eb;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:14px;}
.task{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;margin-bottom:7px;border:1px solid #e5e7eb;background:white;}
.task.done .title{text-decoration:line-through;opacity:.5;}
.badge{font-size:10px;font-weight:700;padding:3px 8px;border-radius:999px;}
.high{background:#fef2f2;color:#dc2626;border:1px solid #fca5a5;}
.medium{background:#fffbeb;color:#d97706;border:1px solid #fcd34d;}
.low{background:#f0fdf4;color:#15803d;border:1px solid #86efac;}
.title{flex:1;font-size:14px;color:#374151;}
.del{background:none;border:none;color:#ef4444;cursor:pointer;font-size:16px;padding:0 4px;}
#stats{font-size:13px;color:#6b7280;margin-top:4px;}`,
     js:`class Task {
  #id;
  constructor(title, priority = 'medium') {
    this.#id = Date.now();
    this.title = title;
    this.priority = priority;
    this.done = false;
    this.createdAt = new Date();
  }
  toggle() { this.done = !this.done; }
  get id() { return this.#id; }
  toString() { return \`[\${this.priority.toUpperCase()}] \${this.title} (\${this.done?'done':'pending'})\`; }
}

class TaskManager {
  #tasks = [];
  add(title, priority) { const t = new Task(title, priority); this.#tasks.push(t); return t; }
  remove(id) { this.#tasks = this.#tasks.filter(t => t.id !== id); }
  toggle(id) { this.#tasks.find(t => t.id === id)?.toggle(); }
  get all()    { return [...this.#tasks]; }
  get pending(){ return this.#tasks.filter(t => !t.done); }
  get done()   { return this.#tasks.filter(t => t.done); }
}

const mgr = new TaskManager();

function addTask() {
  const title = document.getElementById('taskInput').value.trim();
  const priority = document.getElementById('priority').value;
  if (!title) return;
  mgr.add(title, priority);
  document.getElementById('taskInput').value = '';
  render();
}

function render() {
  const list = document.getElementById('taskList');
  list.innerHTML = '';
  mgr.all.forEach(task => {
    const div = document.createElement('div');
    div.className = 'task' + (task.done ? ' done' : '');
    div.innerHTML = \`<span class="badge \${task.priority}">\${task.priority}</span><span class="title">\${task.title}</span><button class="del" onclick="mgr.toggle(\${task.id});render()">✓</button><button class="del" onclick="mgr.remove(\${task.id});render()">✕</button>\`;
    list.appendChild(div);
  });
  document.getElementById('stats').textContent = \`\${mgr.all.length} tasks · \${mgr.done.length} completed · \${mgr.pending.length} pending\`;
}`,mode:'full'},
  ],
  exercises:[{id:'cls-1',question:'What does the super() call do in a subclass constructor?',type:'multiple-choice',options:['Creates a new instance','Calls the parent class constructor — required before using this in subclass','Deletes the parent class','Overrides all parent methods'],correct:1,explanation:'super() calls the parent class constructor. In a subclass constructor, you MUST call super() before accessing this. If you forget, you get a ReferenceError: Must call super constructor in derived class before accessing this.'}],
  quiz:[{id:'qcl1',question:'What makes a field truly private in modern JavaScript classes?',options:['Using _ prefix (convention only)','Using # prefix (enforced by the language)','Declaring inside constructor only','Using the private keyword'],correct:1,explanation:'The # prefix (introduced in ES2022) creates truly private fields. Unlike _ prefix (just a convention), # fields throw a SyntaxError if accessed outside the class. They are part of the class syntax, not just naming.'}],
};
