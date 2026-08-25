import type { JSLesson } from '../js-curriculum';
export const jsPrototypesLesson: JSLesson = {
  id:'js-prototypes',title:'Prototypes & this Keyword',slug:'prototypes',chapter:'advanced',order:26,difficulty:'advanced',readingTime:14,
  description:'Understand the prototype chain, constructor functions, Object.create, how this works, and the difference between call/apply/bind.',
  sections:[
    {type:'text',content:'JavaScript is a prototype-based language. Every object has a hidden link to a "prototype" object. When you access a property, JavaScript first checks the object itself, then its prototype, then the prototype\'s prototype - this is the prototype chain. Classes are built on top of this system.'},
    {type:'heading',content:'The Prototype Chain'},
    {type:'example',title:'How prototype lookup works',content:'Every JavaScript object has a hidden internal link to another object called its prototype. When you access a property that does not exist on the object, JavaScript automatically looks up the chain - checking the prototype, then the prototype\'s prototype, until it reaches null. This is how arrays get push() and map() without having them defined on each array instance - they live on Array.prototype.',language:'javascript',code:`// Every object has __proto__ (or use Object.getPrototypeOf())
const obj = { name: "Alex" };
console.log(Object.getPrototypeOf(obj) === Object.prototype); // true

// Property lookup chain:
// 1. Check obj itself → found name
// 2. Not found? Check obj.__proto__ (Object.prototype)
// 3. Not found? Check Object.prototype.__proto__ (null) → undefined

// Array inherits from Array.prototype
const arr = [1, 2, 3];
console.log(arr.hasOwnProperty('length')); // true - own property
console.log(arr.hasOwnProperty('push'));   // false - inherited!
console.log(Array.prototype.hasOwnProperty('push')); // true

// All objects ultimately inherit from Object.prototype
// toString, hasOwnProperty, valueOf - all from Object.prototype

// Check prototype chain
function Animal(name) { this.name = name; }
Animal.prototype.speak = function() { return this.name + " speaks"; };

const dog = new Animal("Rex");
console.log(dog.hasOwnProperty('name'));   // true - own property
console.log(dog.hasOwnProperty('speak'));  // false - inherited from Animal.prototype
console.log(dog.speak());                  // "Rex speaks" - found in prototype`},
    {type:'heading',content:'The this Keyword'},
    {type:'example',title:'How this is determined',content:'this is determined by HOW a function is called, not where it is defined. As a method (obj.greet()), this is the object before the dot. As a constructor (new Person()), this is the new instance. In a plain function call, this is undefined in strict mode or the global window. Arrow functions are the exception - they never have their own this, they always use the this from where they were defined.',language:'javascript',code:`// this = the object that called the function

// 1. Regular function - this = caller or undefined (strict mode) or window
function showThis() {
  console.log(this); // window in browser, undefined in strict mode
}

// 2. Method - this = the object before the dot
const user = {
  name: "Alex",
  greet() { return "Hello, I am " + this.name; },
};
console.log(user.greet()); // "Hello, I am Alex"

// 3. Constructor - this = new object being created
function Person(name) {
  this.name = name; // this = new Person instance
  this.greet = function() { return "Hi, I'm " + this.name; };
}
const alice = new Person("Alice");
console.log(alice.greet()); // "Hi, I'm Alice"

// 4. Arrow functions - this = LEXICAL (from surrounding scope, does NOT change)
const obj = {
  name: "Alex",
  // Arrow function: this is the object where the arrow was DEFINED
  greetArrow: () => console.log(this), // this = window (NOT obj!)
  greetMethod() {
    // Regular method: this = obj (called as obj.greetMethod())
    const inner = () => console.log(this.name); // arrow inherits this from greetMethod
    inner(); // "Alex" - arrow closes over greetMethod's this
  }
};

// 5. Explicit binding - call, apply, bind
function introduce(greeting, punctuation) {
  return greeting + ", I'm " + this.name + punctuation;
}

const person = { name: "Bob" };
introduce.call(person, "Hello", "!");   // "Hello, I'm Bob!" - call with args list
introduce.apply(person, ["Hi", "?"]);   // "Hi, I'm Bob?" - apply with args array
const boundFn = introduce.bind(person); // returns new function with fixed this
boundFn("Hey", ".");                    // "Hey, I'm Bob."`},
    {type:'heading',content:'Object.create - Direct Prototype Setting'},
    {type:'example',title:'Creating objects with specific prototypes',content:'Object.create(proto) creates a new empty object with proto as its prototype - the most direct way to set up prototype inheritance without classes. This is exactly what class extends compiles down to under the hood. Understanding Object.create shows you the real mechanism behind JavaScript inheritance, and is useful when you need to set up prototype chains without using the class syntax.',language:'javascript',code:`// Object.create(proto) - create object with proto as its prototype
const animal = {
  speak() { return this.name + " says " + this.sound; },
  toString() { return \`[\${this.name}]\`; },
};

const dog = Object.create(animal);
dog.name = "Rex";
dog.sound = "Woof";
console.log(dog.speak()); // "Rex says Woof" - inherited from animal

// Prototype chain: dog → animal → Object.prototype → null
console.log(Object.getPrototypeOf(dog) === animal); // true

// class syntax compiles to this:
class Shape {
  constructor(color) { this.color = color; }
  draw() { return \`Drawing a \${this.color} shape\`; }
}

class Circle extends Shape {
  constructor(color, radius) {
    super(color);
    this.radius = radius;
  }
  area() { return Math.PI * this.radius ** 2; }
}

// Is equivalent to:
function ShapeFn(color) { this.color = color; }
ShapeFn.prototype.draw = function() { return \`Drawing \${this.color}\`; };

function CircleFn(color, radius) {
  ShapeFn.call(this, color); // call parent constructor
  this.radius = radius;
}
CircleFn.prototype = Object.create(ShapeFn.prototype);
CircleFn.prototype.constructor = CircleFn;
CircleFn.prototype.area = function() { return Math.PI * this.radius ** 2; };`},
    {type:'tryit',title:'Try It: Prototypes & this',
     html:`<div id="app">
  <h2>Prototype Demo</h2>
  <button onclick="runDemo()">Run Prototype Demo</button>
  <pre id="output"></pre>
</div>`,
     css:`#app{font-family:system-ui,sans-serif;padding:20px;max-width:500px;}
h2{color:#1e1e1e;}button{padding:9px 18px;background:#2563eb;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;margin-bottom:12px;}
pre{background:#0d1117;color:#e6edf3;padding:16px;border-radius:10px;font-size:12px;white-space:pre-wrap;line-height:1.7;}`,
     js:`function runDemo() {
  const lines = [];
  const log = (...args) => lines.push(args.map(a => typeof a==='object'?JSON.stringify(a):String(a)).join(' '));

  // Prototype chain
  const animal = { speak() { return this.name + ' says ' + this.sound; } };
  const dog = Object.create(animal);
  dog.name = 'Rex'; dog.sound = 'Woof';

  log('=== Prototype Chain ===');
  log('dog.speak():', dog.speak());
  log('dog.hasOwnProperty("name"):', dog.hasOwnProperty('name'));
  log('dog.hasOwnProperty("speak"):', dog.hasOwnProperty('speak'));
  log('Prototype of dog === animal:', Object.getPrototypeOf(dog) === animal);

  // this keyword
  log('\ === this Keyword ===');
  const user = {
    name: 'Alice',
    greet() { return 'Hi, I am ' + this.name; },
    greetArrow: function() {
      const inner = () => 'Arrow this.name = ' + this.name;
      return inner();
    }
  };
  log('user.greet():', user.greet());
  log('user.greetArrow():', user.greetArrow());

  // call / apply / bind
  log('\ === call / apply / bind ===');
  function intro(greeting) { return greeting + ', I am ' + this.name; }
  const bob = { name: 'Bob' };
  log('call:', intro.call(bob, 'Hello'));
  log('apply:', intro.apply(bob, ['Hi']));
  const bound = intro.bind(bob);
  log('bind:', bound('Hey'));

  document.getElementById('output').textContent = lines.join('\ ');
}`,mode:'full'},
  ],
  exercises:[{id:'pt1',question:'What is the prototype chain?',type:'multiple-choice',options:['A list of classes','The sequence of objects JavaScript searches when looking up a property - from the object itself up through its prototypes to null','A way to import modules','An array of methods'],correct:1,explanation:'When you access obj.property, JavaScript first checks obj. Not found? Check obj.__proto__ (Object.getPrototypeOf(obj)). Still not found? Check that object\'s prototype. This continues until null is reached. This chain enables inheritance.'}],
  quiz:[{id:'ptq1',question:'When does arrow function\'s "this" point to the enclosing scope\'s "this"?',options:['Never','Always - arrow functions never have their own this','Only in strict mode','Only in classes'],correct:1,explanation:'Arrow functions NEVER have their own this. They inherit this from their lexical scope - the code where they were defined. This makes them perfect for callbacks inside class methods where you want this to stay as the class instance.'}],
};
