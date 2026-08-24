import { InterviewQuestion } from '@/lib/interview-types';

export const javascriptInterviewQuestions: InterviewQuestion[] = [
  {
    id: 'js-var-let-const',
    category: 'javascript',
    type: 'theory',
    question: 'What is the difference between var, let, and const?',
    difficulty: 'beginner',
    tags: ['variables', 'scope', 'es6'],
    
    shortAnswer: 'var is function-scoped and hoisted, let and const are block-scoped. const cannot be reassigned, but let can.',
    
    detailedExplanation: 'var declares function-scoped or globally-scoped variables and is hoisted to the top with undefined. let and const (ES6) are block-scoped, meaning they only exist within the nearest { } block. let allows reassignment while const does not (though const objects/arrays can have their properties modified).',
    
    example: {
      code: `// var - function scoped
function testVar() {
  if (true) {
    var x = 10;
  }
  console.log(x); // 10 (accessible outside block)
}

// let - block scoped
function testLet() {
  if (true) {
    let y = 20;
  }
  console.log(y); // Error: y is not defined
}

// const - cannot reassign
const PI = 3.14;
PI = 3.15; // Error

// But objects/arrays can be modified
const user = { name: 'Alex' };
user.name = 'Sam'; // OK
user.age = 25;     // OK`,
      language: 'javascript',
      explanation: 'var leaks outside blocks, let/const respect block scope'
    },
    
    interviewAnswer: 'I prefer using const by default because it prevents accidental reassignment and makes code more predictable. If I need to reassign a variable, I use let. I avoid var because it has function scope which can lead to bugs, especially with hoisting.',
    
    commonMistakes: [
      'Thinking const makes objects immutable (it only prevents reassignment)',
      'Using var in modern code instead of let/const',
      'Not understanding temporal dead zone with let/const'
    ],
    
    realWorldUse: 'In React, we use const for component declarations and most variables. let is used in loops or when values need to change. Modern linters enforce const/let over var.',
    
    followUpQuestions: [
      'What is hoisting?',
      'What is the temporal dead zone?',
      'Can you modify a const object?'
    ],
    
    relatedLessons: [
      { tech: 'javascript', lesson: 'variables', title: 'Variables & Data Types' }
    ]
  },

  {
    id: 'js-closure',
    category: 'javascript',
    type: 'theory',
    question: 'What is a closure and how does it work?',
    difficulty: 'intermediate',
    tags: ['closures', 'functions', 'scope'],
    
    shortAnswer: 'A closure is when a function remembers variables from its outer scope, even after the outer function has finished executing.',
    
    detailedExplanation: 'When a function is created, it forms a closure over its surrounding scope. This means the inner function maintains a reference to variables in the outer function, keeping them alive even after the outer function returns. Closures enable data privacy, factory functions, and maintaining state in callbacks.',
    
    example: {
      code: `function makeCounter() {
  let count = 0; // private variable
  
  return function() {
    count++;
    return count;
  };
}

const counter1 = makeCounter();
const counter2 = makeCounter();

console.log(counter1()); // 1
console.log(counter1()); // 2
console.log(counter2()); // 1 (independent counter)`,
      language: 'javascript',
      explanation: 'Each counter has its own closure over a different count variable'
    },
    
    interviewAnswer: 'A closure happens when an inner function accesses variables from an outer function\'s scope. The inner function "closes over" those variables, keeping them in memory. This is useful for creating private variables and factory functions. For example, I used closures in a React app to create custom hooks that maintain state between renders.',
    
    commonMistakes: [
      'Creating closures in loops without understanding captured variables',
      'Memory leaks from unintended closures holding large objects',
      'Confusing closures with immediately invoked function expressions (IIFE)'
    ],
    
    realWorldUse: 'React hooks like useState use closures to remember state between renders. Event handlers in loops often need closures to capture the correct index. Module patterns use closures for private variables.',
    
    followUpQuestions: [
      'What problems can occur with closures in loops?',
      'How do closures affect memory usage?',
      'Can you give an example of a closure-related bug?'
    ],
    
    relatedLessons: [
      { tech: 'javascript', lesson: 'functions', title: 'Functions' },
      { tech: 'javascript', lesson: 'scope-closures', title: 'Scope & Closures' }
    ]
  },

  {
    id: 'js-event-loop',
    category: 'javascript',
    type: 'output',
    question: 'Explain the JavaScript Event Loop. What will this code output?',
    difficulty: 'advanced',
    tags: ['event-loop', 'async', 'promises'],
    
    shortAnswer: 'The event loop manages asynchronous operations in JavaScript\'s single-threaded environment by handling the call stack, microtask queue (Promises), and macrotask queue (setTimeout).',
    
    detailedExplanation: 'JavaScript is single-threaded but handles async operations through the event loop. Synchronous code executes first on the call stack. When the stack is empty, the event loop checks the microtask queue (Promise callbacks, queueMicrotask) and runs all microtasks. Then it processes one macrotask (setTimeout, setInterval, setImmediate). This repeats continuously.',
    
    example: {
      code: `console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve().then(() => console.log('3'));

console.log('4');

// Output: 1, 4, 3, 2`,
      language: 'javascript',
      explanation: 'Synchronous code runs first (1, 4), then microtasks (3), then macrotasks (2)'
    },
    
    interviewAnswer: 'JavaScript runs on a single thread, so it processes one thing at a time on the call stack. When async operations complete, their callbacks go into queues. The event loop checks the call stack - if it\'s empty, it processes all microtasks first (like Promises), then one macrotask (like setTimeout). This is why Promises always run before setTimeout, even with 0ms delay.',
    
    commonMistakes: [
      'Thinking setTimeout(fn, 0) runs immediately',
      'Not understanding microtasks vs macrotasks',
      'Expecting async operations to run in order without proper handling'
    ],
    
    realWorldUse: 'Understanding the event loop is crucial for debugging timing issues, optimizing performance, and writing correct async code. It explains why UI updates happen when they do, and why long-running code blocks the browser.',
    
    followUpQuestions: [
      'What\'s the difference between microtasks and macrotasks?',
      'What happens if the call stack never empties?',
      'How does async/await fit into the event loop?'
    ],
    
    relatedLessons: [
      { tech: 'javascript', lesson: 'async-await', title: 'Async/Await' },
      { tech: 'javascript', lesson: 'event-loop', title: 'Event Loop' }
    ]
  },

  {
    id: 'js-this-keyword',
    category: 'javascript',
    type: 'theory',
    question: 'How does the "this" keyword work in JavaScript?',
    difficulty: 'intermediate',
    tags: ['this', 'context', 'functions'],
    
    shortAnswer: '"this" refers to the execution context - in objects it points to the object, in functions it depends on how the function is called. Arrow functions inherit "this" from their surrounding scope.',
    
    detailedExplanation: 'The value of "this" depends on how a function is invoked: 1) In a method, "this" is the object before the dot. 2) In a regular function, "this" is undefined (strict mode) or global object. 3) With "new", "this" is the newly created object. 4) With call/apply/bind, "this" is explicitly set. 5) Arrow functions don\'t have their own "this" - they inherit it lexically.',
    
    example: {
      code: `const person = {
  name: 'Alex',
  greet: function() {
    console.log('Hi, ' + this.name);
  },
  greetArrow: () => {
    console.log('Hi, ' + this.name); // 'this' is from outer scope
  }
};

person.greet();      // "Hi, Alex"
person.greetArrow(); // "Hi, undefined"

const greetFunc = person.greet;
greetFunc(); // "Hi, undefined" (lost context)

// Fix with bind
const boundGreet = person.greet.bind(person);
boundGreet(); // "Hi, Alex"`,
      language: 'javascript'
    },
    
    interviewAnswer: '"this" is determined by how a function is called, not where it\'s written. In object methods, "this" refers to the object. Arrow functions don\'t have their own "this" - they use the one from their surrounding scope, which is why they\'re great for callbacks. I often use .bind() or arrow functions in React to ensure event handlers have the correct "this" context.',
    
    commonMistakes: [
      'Losing "this" context when passing methods as callbacks',
      'Using arrow functions as object methods',
      'Not understanding "this" in nested functions'
    ],
    
    realWorldUse: 'In React class components, we bind methods or use arrow functions to maintain "this" context. In event listeners, "this" refers to the element that triggered the event. Understanding "this" is essential for OOP in JavaScript.',
    
    followUpQuestions: [
      'What is the difference between call, apply, and bind?',
      'Why don\'t arrow functions have their own "this"?',
      'What is "this" in a constructor function?'
    ]
  },

  {
    id: 'js-promises',
    category: 'javascript',
    type: 'theory',
    question: 'What are Promises and how do they work?',
    difficulty: 'intermediate',
    tags: ['promises', 'async', 'callbacks'],
    
    shortAnswer: 'A Promise is an object representing the eventual completion or failure of an asynchronous operation. It has three states: pending, fulfilled, or rejected.',
    
    detailedExplanation: 'Promises provide a cleaner way to handle async operations than callbacks. A Promise starts in pending state. When the operation completes, it becomes fulfilled (with a value) or rejected (with a reason). You chain .then() for success and .catch() for errors. Promises can be chained, and async/await is syntactic sugar built on Promises.',
    
    example: {
      code: `// Creating a Promise
const fetchData = new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve({ data: 'User data' });
    } else {
      reject(new Error('Failed to fetch'));
    }
  }, 1000);
});

// Using the Promise
fetchData
  .then(result => {
    console.log(result.data);
    return result.data.toUpperCase();
  })
  .then(upper => console.log(upper))
  .catch(error => console.error(error))
  .finally(() => console.log('Done'));`,
      language: 'javascript'
    },
    
    interviewAnswer: 'Promises solve callback hell by providing a cleaner syntax for async code. Instead of nested callbacks, we chain .then() calls. Each .then() returns a new Promise, allowing us to chain operations. I use Promises when fetching API data - the fetch API returns a Promise. Async/await makes Promises even easier to work with by letting us write async code that looks synchronous.',
    
    commonMistakes: [
      'Forgetting to return a value in .then() to continue the chain',
      'Not handling errors with .catch()',
      'Creating unnecessary Promises (Promise constructor anti-pattern)'
    ],
    
    realWorldUse: 'Fetch API, database queries, file operations, and any async I/O use Promises. Promise.all() lets you run multiple async operations in parallel. Most modern JavaScript libraries return Promises for async operations.',
    
    followUpQuestions: [
      'What is Promise.all() and when would you use it?',
      'How does async/await relate to Promises?',
      'What is Promise chaining?'
    ]
  },

  {
    id: 'js-async-await',
    category: 'javascript',
    type: 'theory',
    question: 'What is async/await and how is it different from Promises?',
    difficulty: 'intermediate',
    tags: ['async', 'await', 'promises'],
    
    shortAnswer: 'Async/await is syntactic sugar over Promises that makes asynchronous code look and behave more like synchronous code. "async" declares an async function, "await" pauses execution until a Promise resolves.',
    
    detailedExplanation: 'An async function always returns a Promise. Inside an async function, you can use "await" before a Promise to pause execution until it resolves. This makes async code easier to read and write compared to .then() chains. Error handling uses try/catch instead of .catch(). Under the hood, async/await is still using Promises.',
    
    example: {
      code: `// With Promises
function getUser() {
  return fetch('/api/user')
    .then(res => res.json())
    .then(data => {
      console.log(data);
      return data;
    })
    .catch(err => console.error(err));
}

// With async/await
async function getUser() {
  try {
    const res = await fetch('/api/user');
    const data = await res.json();
    console.log(data);
    return data;
  } catch (err) {
    console.error(err);
  }
}`,
      language: 'javascript'
    },
    
    interviewAnswer: 'Async/await makes asynchronous code much more readable. Instead of chaining .then() calls, we can write code that looks synchronous. I use it for API calls and database operations. It\'s especially useful when you have multiple sequential async operations - the code looks clean and is easy to understand. Error handling with try/catch is also more intuitive than .catch().',
    
    commonMistakes: [
      'Forgetting to use "await" (Promise doesn\'t resolve)',
      'Not marking the function as "async"',
      'Sequential await when operations could run in parallel',
      'Forgetting try/catch for error handling'
    ],
    
    realWorldUse: 'Modern React apps use async/await for data fetching. Node.js backends use it for database queries and file operations. Any Promise-based API is cleaner with async/await.',
    
    followUpQuestions: [
      'Can you use await outside an async function?',
      'How do you handle multiple async operations in parallel with async/await?',
      'What happens if you don\'t await a Promise?'
    ]
  },

  {
    id: 'js-map-filter-reduce',
    category: 'javascript',
    type: 'coding',
    question: 'Explain map(), filter(), and reduce(). How are they different?',
    difficulty: 'beginner',
    tags: ['arrays', 'methods', 'functional'],
    
    shortAnswer: 'map() transforms each element and returns a new array. filter() selects elements based on a condition. reduce() combines all elements into a single value.',
    
    detailedExplanation: 'These are array methods for functional programming. map() applies a function to each element, returning a new array of the same length. filter() returns a new array with only elements that pass a test. reduce() iterates through the array and accumulates a single result (like a sum, object, or another data structure).',
    
    example: {
      code: `const numbers = [1, 2, 3, 4, 5];

// map - transform each element
const doubled = numbers.map(n => n * 2);
// [2, 4, 6, 8, 10]

// filter - select elements
const evens = numbers.filter(n => n % 2 === 0);
// [2, 4]

// reduce - combine into single value
const sum = numbers.reduce((acc, n) => acc + n, 0);
// 15

// Chaining
const result = numbers
  .filter(n => n > 2)
  .map(n => n * 2)
  .reduce((acc, n) => acc + n, 0);
// 24`,
      language: 'javascript'
    },
    
    interviewAnswer: 'These methods are essential for working with arrays in a functional way. I use map() when I need to transform data - like converting an array of user objects to just their names. filter() is great for filtering lists based on search criteria. reduce() is powerful for calculations like totals, or building objects from arrays. They\'re better than for loops because they\'re declarative and chainable.',
    
    commonMistakes: [
      'Using map() instead of forEach() when you don\'t need the returned array',
      'Forgetting to return a value in map()',
      'Not providing an initial value to reduce()',
      'Mutating the original array instead of returning new values'
    ],
    
    realWorldUse: 'In React, map() renders lists of components. filter() implements search functionality. reduce() calculates totals in shopping carts. These methods avoid mutations and make code more maintainable.',
    
    followUpQuestions: [
      'When would you use forEach() instead of map()?',
      'Can you chain these methods together?',
      'What happens if you don\'t provide an initial value to reduce()?'
    ],
    
    codingChallenge: {
      starterCode: `// Task: Use map, filter, and reduce to:
// 1. Filter numbers greater than 10
// 2. Double each number
// 3. Sum the result

const numbers = [5, 12, 8, 20, 3, 15];

const result = numbers
  // Your code here
  
console.log(result); // Should output 94`,
      solution: `const numbers = [5, 12, 8, 20, 3, 15];

const result = numbers
  .filter(n => n > 10)     // [12, 20, 15]
  .map(n => n * 2)         // [24, 40, 30]
  .reduce((sum, n) => sum + n, 0); // 94

console.log(result); // 94`,
      hints: [
        'Start with filter() to keep only numbers > 10',
        'Use map() to multiply by 2',
        'Use reduce() with initial value 0 to sum'
      ]
    }
  },

  {
    id: 'js-spread-rest',
    category: 'javascript',
    type: 'theory',
    question: 'What is the difference between spread operator (...) and rest parameter?',
    difficulty: 'beginner',
    tags: ['es6', 'spread', 'rest', 'destructuring'],
    
    shortAnswer: 'Spread (...) expands an array/object into individual elements. Rest (...) collects multiple elements into an array. Same syntax, opposite purposes.',
    
    detailedExplanation: 'The spread operator (...) takes an array or object and spreads its elements/properties. It\'s used to copy arrays, combine arrays, pass array elements as arguments, or clone objects. The rest parameter (...) does the opposite - it collects multiple values into an array. It\'s used in function parameters and destructuring.',
    
    example: {
      code: `// SPREAD - expanding
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1,2,3,4,5,6]

const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 }; // {a:1, b:2, c:3}

// REST - collecting
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3, 4); // 10

const [first, second, ...rest] = [1, 2, 3, 4, 5];
// rest = [3, 4, 5]`,
      language: 'javascript'
    },
    
    interviewAnswer: 'I remember it this way: spread expands, rest collects. I use spread to copy arrays without mutating the original, or to pass array elements as separate function arguments. Rest parameters are useful when I don\'t know how many arguments a function will receive - like a sum function that takes any number of inputs.',
    
    commonMistakes: [
      'Shallow copy issue - spread only copies one level deep',
      'Using spread on objects with methods (loses "this" context)',
      'Thinking spread creates a deep clone of nested objects'
    ],
    
    realWorldUse: 'In React, spread is used constantly to clone state without mutation: setState({...state, newProp: value}). Rest parameters are used in utility functions that accept variable arguments.',
    
    followUpQuestions: [
      'Does spread create a deep copy or shallow copy?',
      'Can you use rest parameter anywhere in a function\'s parameters?',
      'What happens if you spread an object with the same keys?'
    ]
  },

  {
    id: 'js-destructuring',
    category: 'javascript',
    type: 'theory',
    question: 'What is destructuring and how does it work?',
    difficulty: 'beginner',
    tags: ['es6', 'destructuring', 'objects', 'arrays'],
    
    shortAnswer: 'Destructuring extracts values from arrays or properties from objects into distinct variables using a concise syntax.',
    
    detailedExplanation: 'Destructuring assignment unpacks values from arrays or properties from objects. For arrays, it uses position: [a, b] = [1, 2]. For objects, it uses property names: {name, age} = person. You can provide default values, rename variables, and use rest operator. It makes code cleaner when working with function parameters and API responses.',
    
    example: {
      code: `// Array destructuring
const [first, second, third] = [1, 2, 3];

const [a, , c] = [1, 2, 3]; // skip middle element

const [x, y, ...rest] = [1, 2, 3, 4, 5];
// rest = [3, 4, 5]

// Object destructuring
const user = { name: 'Alex', age: 25, city: 'NYC' };
const { name, age } = user;

// Rename variable
const { name: userName } = user;

// Default values
const { country = 'USA' } = user;

// Function parameters
function greet({ name, age }) {
  console.log(\`Hi \${name}, you're \${age}\`);
}
greet(user);`,
      language: 'javascript'
    },
    
    interviewAnswer: 'Destructuring makes my code cleaner, especially when working with objects from APIs. Instead of writing user.name and user.age repeatedly, I can destructure: const {name, age} = user. In React, I use it all the time for props: function Component({title, onClose}). It\'s also great for extracting specific array elements or object properties.',
    
    commonMistakes: [
      'Trying to destructure undefined/null (causes error)',
      'Confusion with nested destructuring syntax',
      'Not using default values when properties might be undefined'
    ],
    
    realWorldUse: 'React functional components destructure props. API responses are destructured to extract data. Module imports use destructuring: import { useState, useEffect } from "react".',
    
    followUpQuestions: [
      'How do you destructure nested objects?',
      'Can you destructure function return values?',
      'What happens if you try to destructure a property that doesn\'t exist?'
    ]
  },

  {
    id: 'js-arrow-functions',
    category: 'javascript',
    type: 'theory',
    question: 'What are arrow functions and how do they differ from regular functions?',
    difficulty: 'beginner',
    tags: ['functions', 'es6', 'this'],
    
    shortAnswer: 'Arrow functions (=>) are shorter syntax for functions. Key difference: they don\'t have their own "this" - they inherit it from the surrounding scope.',
    
    detailedExplanation: 'Arrow functions provide concise syntax: x => x * 2 instead of function(x) { return x * 2; }. They have lexical "this" binding - they use "this" from where they\'re defined, not where they\'re called. They don\'t have their own arguments object. They can\'t be used as constructors with "new". Best for callbacks and short functions.',
    
    example: {
      code: `// Regular function
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => a + b;

// Single parameter - no parentheses needed
const double = x => x * 2;

// No parameters - need empty parentheses
const greet = () => console.log('Hi');

// "this" difference
const person = {
  name: 'Alex',
  regularFunc: function() {
    console.log(this.name); // 'Alex'
  },
  arrowFunc: () => {
    console.log(this.name); // undefined (uses outer 'this')
  }
};`,
      language: 'javascript'
    },
    
    interviewAnswer: 'I use arrow functions for most of my code because they\'re concise and avoid "this" binding issues. They\'re perfect for callbacks like array methods or event handlers in React. However, I don\'t use them as object methods because they won\'t have the correct "this" context. Regular functions are still needed for constructors and when you need the arguments object.',
    
    commonMistakes: [
      'Using arrow functions as object methods',
      'Expecting arrow functions to have their own "this"',
      'Forgetting parentheses around multiple parameters',
      'Forgetting to wrap object literals in parentheses: x => ({key: x})'
    ],
    
    realWorldUse: 'React components are often arrow functions. Array methods (map, filter, reduce) use arrow functions for callbacks. Event handlers in modern JavaScript use arrow functions to maintain correct "this" context.',
    
    followUpQuestions: [
      'Can you use arrow functions as constructors?',
      'Why don\'t arrow functions have an arguments object?',
      'When should you NOT use an arrow function?'
    ]
  },

  {
    id: 'js-prototype',
    category: 'javascript',
    type: 'theory',
    question: 'What is prototypal inheritance in JavaScript?',
    difficulty: 'advanced',
    tags: ['prototype', 'inheritance', 'oop'],
    
    shortAnswer: 'Objects in JavaScript inherit properties and methods from their prototype. Every object has a prototype object it inherits from, forming a prototype chain.',
    
    detailedExplanation: 'JavaScript uses prototypal inheritance, not classical inheritance. When you access a property on an object, if it doesn\'t exist, JavaScript looks up the prototype chain. Each object has an internal [[Prototype]] link (accessed via __proto__ or Object.getPrototypeOf()). Functions have a "prototype" property that becomes the [[Prototype]] of objects created with "new". This forms a chain ending at Object.prototype.',
    
    example: {
      code: `// Constructor function
function Person(name) {
  this.name = name;
}

// Adding method to prototype
Person.prototype.greet = function() {
  return \`Hi, I'm \${this.name}\`;
};

const alex = new Person('Alex');
console.log(alex.greet()); // "Hi, I'm Alex"

// alex doesn't have greet() directly
console.log(alex.hasOwnProperty('greet')); // false
console.log(alex.hasOwnProperty('name'));  // true

// Prototype chain lookup
console.log(alex.toString()); // from Object.prototype

// ES6 class syntax (same prototype under the hood)
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return \`\${this.name} makes a sound\`;
  }
}`,
      language: 'javascript'
    },
    
    interviewAnswer: 'JavaScript doesn\'t have traditional classes - it uses prototypes. When I call a method on an object, if the object doesn\'t have it, JavaScript looks at its prototype, then the prototype\'s prototype, until it finds it or reaches null. This is more flexible than class-based inheritance. ES6 classes are just syntactic sugar - they still use prototypes underneath.',
    
    commonMistakes: [
      'Modifying built-in prototypes (Array.prototype, etc.)',
      'Confusing function.prototype with an object\'s [[Prototype]]',
      'Adding properties to prototype that should be on the instance'
    ],
    
    realWorldUse: 'Understanding prototypes helps debug inheritance issues and understand how JavaScript objects work. Modern code uses ES6 classes, but they\'re built on prototypes. Libraries like React use prototype methods internally.',
    
    followUpQuestions: [
      'What is the prototype chain?',
      'What\'s the difference between __proto__ and prototype?',
      'How do ES6 classes relate to prototypes?'
    ]
  },

  {
    id: 'js-hoisting',
    category: 'javascript',
    type: 'output',
    question: 'What is hoisting? What will this code output?',
    difficulty: 'intermediate',
    tags: ['hoisting', 'scope', 'variables'],
    
    shortAnswer: 'Hoisting moves variable and function declarations to the top of their scope during compilation. var is hoisted with undefined, let/const are hoisted but not initialized (temporal dead zone).',
    
    detailedExplanation: 'JavaScript hoists declarations (not initializations) to the top of their scope. var declarations are hoisted and initialized with undefined. Function declarations are fully hoisted (including body). let and const are hoisted but remain uninitialized until the code reaches the declaration (temporal dead zone). Function expressions and arrow functions behave like their variable declaration type.',
    
    example: {
      code: `// What this outputs?
console.log(x); // undefined (var is hoisted)
var x = 5;

console.log(y); // ReferenceError (let is in temporal dead zone)
let y = 10;

// Function hoisting
greet(); // "Hello" - works!
function greet() {
  console.log("Hello");
}

// Function expression - not hoisted
sayHi(); // TypeError: sayHi is not a function
var sayHi = function() {
  console.log("Hi");
};

// The above is interpreted as:
var sayHi;
sayHi(); // undefined is not a function
sayHi = function() { ... };`,
      language: 'javascript'
    },
    
    interviewAnswer: 'Hoisting is why we can call function declarations before they\'re defined. var variables are hoisted but initialized to undefined, which can cause bugs. let and const avoid this with the temporal dead zone - accessing them before declaration is an error. This is one reason to prefer let/const over var.',
    
    commonMistakes: [
      'Expecting var to throw errors like let/const',
      'Thinking initialization is hoisted (only declarations)',
      'Confusing function declarations with function expressions',
      'Not understanding temporal dead zone'
    ],
    
    realWorldUse: 'Understanding hoisting helps debug "undefined is not a function" errors. Modern code with let/const avoids many hoisting issues. Linters warn about using variables before declaration.',
    
    followUpQuestions: [
      'What is the temporal dead zone?',
      'Are function expressions hoisted?',
      'What\'s the difference between var and let hoisting?'
    ]
  },

  {
    id: 'js-shallow-deep-copy',
    category: 'javascript',
    type: 'theory',
    question: 'What is the difference between shallow copy and deep copy?',
    difficulty: 'intermediate',
    tags: ['objects', 'arrays', 'copying'],
    
    shortAnswer: 'Shallow copy copies one level - nested objects are referenced. Deep copy recursively copies everything, creating independent nested objects.',
    
    detailedExplanation: 'Shallow copy creates a new object/array but nested objects are still references to the originals. Methods: Object.assign(), spread operator (...), Array.slice(). Deep copy recursively copies all levels, creating completely independent copies. Methods: JSON.parse(JSON.stringify()) (limited), structuredClone() (modern), or libraries like Lodash _.cloneDeep().',
    
    example: {
      code: `const original = {
  name: 'Alex',
  address: { city: 'NYC' }
};

// Shallow copy - nested objects are references
const shallow1 = { ...original };
const shallow2 = Object.assign({}, original);

shallow1.name = 'Sam';           // OK - different
shallow1.address.city = 'LA';    // Changes original too!

console.log(original.address.city); // 'LA' (shared reference)

// Deep copy methods
const deep1 = JSON.parse(JSON.stringify(original));
const deep2 = structuredClone(original); // Modern

deep1.address.city = 'SF';
console.log(original.address.city); // Still 'NYC'

// JSON method limitations
const obj = {
  date: new Date(),
  func: () => {},
  undef: undefined
};
const copy = JSON.parse(JSON.stringify(obj));
// date becomes string, func and undef are lost`,
      language: 'javascript'
    },
    
    interviewAnswer: 'This is important for state management in React. Shallow copy with spread operator works for simple objects, but if your state has nested objects, you need to copy those too or use deep copy. JSON.parse/stringify is quick but loses functions, dates, and undefined values. structuredClone is better but doesn\'t work in older browsers. In production, I often use Immer or Lodash for safe immutable updates.',
    
    commonMistakes: [
      'Thinking spread operator deep copies',
      'Using JSON.stringify on objects with functions/dates',
      'Not realizing arrays of objects are shallow copied',
      'Mutating nested objects in React state'
    ],
    
    realWorldUse: 'React state updates require creating new objects to trigger re-renders. Redux requires immutability. Form data cloning. Undo/redo functionality needs deep copies.',
    
    followUpQuestions: [
      'Does spread operator create a deep copy?',
      'What are limitations of JSON.parse(JSON.stringify())?',
      'How would you deep copy an object with functions?'
    ]
  },

  {
    id: 'js-===-vs-==',
    category: 'javascript',
    type: 'theory',
    question: 'What is the difference between == and ===?',
    difficulty: 'beginner',
    tags: ['operators', 'equality', 'type-coercion'],
    
    shortAnswer: '=== checks value and type (strict equality). == checks value only, performing type coercion (loose equality).',
    
    detailedExplanation: 'Strict equality (===) returns true only if both value and type match. Loose equality (==) performs type coercion, converting values to the same type before comparing. Type coercion can lead to unexpected results. Always prefer === unless you specifically need type coercion. Same applies to !== vs !=.',
    
    example: {
      code: `// Strict equality (===)
5 === 5        // true
5 === '5'      // false (different types)
0 === false    // false
null === undefined // false

// Loose equality (==) with type coercion
5 == '5'       // true (string '5' converted to number)
0 == false     // true (false converted to 0)
null == undefined // true (special case)
'' == false    // true ('' converted to 0)
'0' == false   // true

// Confusing cases with ==
'  \\n ' == 0   // true (whitespace converted to 0)
[] == false    // true
[] == ![]      // true (wat?)

// Always use ===
if (value === null) { ... }
if (count === 0) { ... }`,
      language: 'javascript'
    },
    
    interviewAnswer: 'I always use === unless I have a specific reason not to. == can cause hard-to-find bugs because of type coercion. For example, "0" == false is true, which is confusing. The only exception is checking for null or undefined together: if (value == null) checks for both, but I prefer explicit checks: if (value === null || value === undefined).',
    
    commonMistakes: [
      'Using == by default instead of ===',
      'Not understanding type coercion rules',
      'Thinking == is "close enough" to ===',
      'Mixing == and === inconsistently'
    ],
    
    realWorldUse: 'All modern code and linters enforce ===. Popular style guides (Airbnb, Standard) require strict equality. TypeScript helps catch many equality issues at compile time.',
    
    followUpQuestions: [
      'When would you use == instead of ===?',
      'What is type coercion?',
      'How do you check if a value is null or undefined?'
    ]
  },

  {
    id: 'js-typeof-instanceof',
    category: 'javascript',
    type: 'theory',
    question: 'What is the difference between typeof and instanceof?',
    difficulty: 'beginner',
    tags: ['typeof', 'instanceof', 'types'],
    
    shortAnswer: 'typeof returns a string indicating primitive type. instanceof checks if an object is an instance of a specific class/constructor.',
    
    detailedExplanation: 'typeof checks primitive types: "string", "number", "boolean", "undefined", "symbol", "bigint", "function", or "object". It has quirks: typeof null is "object" (bug), typeof [] is "object". instanceof checks the prototype chain: obj instanceof Constructor. Use typeof for primitives, instanceof for checking class instances, Array.isArray() for arrays.',
    
    example: {
      code: `// typeof - primitive types
typeof "hello"     // "string"
typeof 42          // "number"
typeof true        // "boolean"
typeof undefined   // "undefined"
typeof Symbol()    // "symbol"
typeof BigInt(9)   // "bigint"

// typeof quirks
typeof null        // "object" (JavaScript bug)
typeof []          // "object"
typeof {}          // "object"
typeof function(){} // "function"

// instanceof - prototype chain
const arr = [1, 2, 3];
arr instanceof Array     // true
arr instanceof Object    // true (Array inherits from Object)

class Person {}
const alex = new Person();
alex instanceof Person   // true
alex instanceof Object   // true

// Better array checking
Array.isArray([])  // true
Array.isArray({})  // false`,
      language: 'javascript'
    },
    
    interviewAnswer: 'I use typeof for primitives - checking if something is a string, number, or undefined. For objects and arrays, typeof isn\'t helpful since it returns "object" for both. I use instanceof to check if an object is an instance of a class, and Array.isArray() specifically for arrays. Be careful: typeof null returns "object" which is a well-known JavaScript quirk.',
    
    commonMistakes: [
      'Using typeof null and expecting "null"',
      'Using typeof to check for arrays',
      'Not knowing Array.isArray() exists',
      'Assuming instanceof works across different window contexts'
    ],
    
    realWorldUse: 'Type checking in utility functions. Form validation. API response validation. TypeScript provides compile-time type checking instead.',
    
    followUpQuestions: [
      'Why does typeof null return "object"?',
      'How do you check if something is an array?',
      'What happens with instanceof across different frames?'
    ]
  },

  {
    id: 'js-nullish-coalescing',
    category: 'javascript',
    type: 'theory',
    question: 'What is the difference between || and ?? (nullish coalescing)?',
    difficulty: 'beginner',
    tags: ['operators', 'es2020', 'null'],
    
    shortAnswer: '|| returns right side for any falsy value (0, "", false, null, undefined). ?? only returns right side for null or undefined.',
    
    detailedExplanation: 'Logical OR (||) returns the right operand if left is falsy (false, 0, "", NaN, null, undefined). Nullish coalescing (??) only returns right operand for null or undefined. This is important when 0 or "" are valid values. Optional chaining (?.) safely accesses nested properties that might be null/undefined.',
    
    example: {
      code: `// Logical OR (||) - falsy values
const count1 = 0 || 10;        // 10 (0 is falsy)
const name1 = "" || "Guest";   // "Guest" ("" is falsy)
const flag1 = false || true;   // true (false is falsy)

// Nullish coalescing (??) - only null/undefined
const count2 = 0 ?? 10;        // 0 (0 is not null/undefined)
const name2 = "" ?? "Guest";   // "" ("" is not null/undefined)
const flag2 = false ?? true;   // false

// Use case: default values
function setPort(port) {
  // Wrong - 0 is a valid port
  return port || 3000;     // Returns 3000 if port is 0
  
  // Right - only null/undefined get default
  return port ?? 3000;     // Returns 0 if port is 0
}

// Optional chaining (?.)
const user = { address: { city: "NYC" } };
user.address?.city           // "NYC"
user.contact?.phone          // undefined (no error)
user.getName?.()             // undefined (safely call if exists)`,
      language: 'javascript'
    },
    
    interviewAnswer: 'Nullish coalescing is essential when 0 or empty string are valid values. If I\'m setting a port number, port || 3000 fails for port 0. Using port ?? 3000 correctly treats 0 as valid. Optional chaining is great for API responses where properties might be missing - no more "Cannot read property of undefined" errors.',
    
    commonMistakes: [
      'Using || when 0 or "" are valid values',
      'Not knowing ?? exists (using || incorrectly)',
      'Chaining too many ?. (makes errors harder to debug)',
      'Not understanding falsy vs nullish'
    ],
    
    realWorldUse: 'Configuration with default values. API responses with optional fields. Form inputs where 0 is valid. React components with optional props.',
    
    followUpQuestions: [
      'What values are falsy in JavaScript?',
      'When should you use ?? instead of ||?',
      'How does optional chaining work?'
    ]
  },

  {
    id: 'js-debounce-throttle',
    category: 'javascript',
    type: 'coding',
    question: 'What is the difference between debounce and throttle?',
    difficulty: 'intermediate',
    tags: ['performance', 'optimization', 'events'],
    
    shortAnswer: 'Debounce delays function execution until after a pause in calls. Throttle limits function execution to once per time interval.',
    
    detailedExplanation: 'Debounce waits for a period of inactivity before executing the function. If called again within the delay, the timer resets. Great for search inputs or resize events. Throttle ensures a function runs at most once per specified time, even if called repeatedly. Great for scroll events or mouse movement. Lodash provides both utilities.',
    
    example: {
      code: `// Debounce - executes after waiting period
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Usage: Search input (wait for user to stop typing)
const searchInput = document.querySelector('#search');
const debouncedSearch = debounce((value) => {
  console.log('Searching for:', value);
  // API call here
}, 300);

searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});

// Throttle - executes at most once per period
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Usage: Scroll event
const throttledScroll = throttle(() => {
  console.log('Scroll position:', window.scrollY);
}, 100);

window.addEventListener('scroll', throttledScroll);`,
      language: 'javascript'
    },
    
    interviewAnswer: 'Debounce is for actions where you want to wait for the user to finish - like search autocomplete. You don\'t want to make an API call on every keystroke. Throttle is for continuous events where you want regular updates but not too frequently - like scroll position or mouse movement tracking. Both improve performance by reducing function calls.',
    
    commonMistakes: [
      'Confusing debounce and throttle',
      'Creating new debounced functions on every render (React)',
      'Not canceling timeouts on unmount',
      'Using throttle when debounce is better (or vice versa)'
    ],
    
    realWorldUse: 'Search autocomplete (debounce), infinite scroll (throttle), window resize handlers (debounce), mousemove tracking (throttle), form autosave (debounce).',
    
    followUpQuestions: [
      'When would you use debounce vs throttle?',
      'How do you implement debounce in React?',
      'What is the difference in behavior?'
    ],
    
    codingChallenge: {
      starterCode: `// Implement a simple debounce function
function debounce(func, delay) {
  // Your code here
}

// Test it
const log = debounce(() => console.log('Called'), 300);
log(); // Should only log once after 300ms
log();
log();`,
      solution: `function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}`,
      hints: [
        'Store timeoutId in closure',
        'Clear previous timeout before setting new one',
        'Use setTimeout to delay execution'
      ]
    }
  },

  {
    id: 'js-generators',
    category: 'javascript',
    type: 'theory',
    question: 'What are generators and iterators in JavaScript?',
    difficulty: 'advanced',
    tags: ['generators', 'iterators', 'es6'],
    shortAnswer: 'Generators are functions that can pause execution and resume later using yield. They return an iterator object. Used for lazy evaluation, infinite sequences, and async control flow.',
    detailedExplanation: 'A generator function uses function* syntax and can yield multiple values. Calling a generator returns an iterator with a next() method. Each next() call resumes execution until the next yield. Generators are lazy â€” values are computed on demand. They enable infinite sequences, custom iterables, and were the foundation for async/await before it was standardized.',
    example: {
      code: `// Basic generator
function* counter() {
  let i = 0;
  while (true) {
    yield i++;  // Pause here, return i
  }
}

const gen = counter();
console.log(gen.next().value); // 0
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2

// Finite generator
function* range(start, end, step = 1) {
  for (let i = start; i < end; i += step) {
    yield i;
  }
}

// Use with for...of
for (const num of range(0, 10, 2)) {
  console.log(num); // 0, 2, 4, 6, 8
}

// Spread generator
const nums = [...range(1, 5)]; // [1, 2, 3, 4]

// Generator for unique IDs
function* idGenerator() {
  let id = 1;
  while (true) {
    yield \`id-\${id++}\`;
  }
}

const nextId = idGenerator();
nextId.next().value; // 'id-1'
nextId.next().value; // 'id-2'`,
      language: 'javascript'
    },
    interviewAnswer: 'Generators let a function produce a sequence of values lazily â€” it pauses at each yield and resumes when next() is called. This is great for infinite sequences (like ID generators) and pagination where you don\'t want to compute everything upfront. async/await is actually syntactic sugar built on generators and Promises. I use generators when building custom iterables or processing large datasets in chunks.',
    commonMistakes: [
      'Calling generator function without saving the iterator',
      'Trying to restart a completed generator',
      'Confusing generator function with regular function',
      'Not understanding that generators are lazy (nothing runs until next())'
    ],
    realWorldUse: 'Infinite sequences, pagination, custom iterables, state machines, cooperative multitasking. Redux-saga uses generators extensively for side effects.',
    followUpQuestions: [
      'What is the difference between yield and return in a generator?',
      'How does async/await relate to generators?',
      'What is an iterator protocol?'
    ]
  },

  {
    id: 'js-weakmap-weakset',
    category: 'javascript',
    type: 'theory',
    question: 'What are WeakMap and WeakSet? When would you use them?',
    difficulty: 'advanced',
    tags: ['WeakMap', 'WeakSet', 'memory', 'garbage-collection'],
    shortAnswer: 'WeakMap/WeakSet hold weak references to objects. If an object has no other references, it can be garbage collected even if it\'s in a WeakMap/WeakSet. Keys must be objects. Not iterable.',
    detailedExplanation: 'Regular Map/Set hold strong references preventing garbage collection. WeakMap keys and WeakSet values must be objects. If the object is garbage collected, its entry is automatically removed. This prevents memory leaks. WeakMap is not iterable (no forEach, no size), because the entries may disappear at any time. Use cases: caching computed properties on objects, tracking DOM node metadata without preventing cleanup.',
    example: {
      code: `// Regular Map - strong reference (potential memory leak)
const cache = new Map();
let obj = { data: 'large data' };
cache.set(obj, 'metadata');
obj = null; // obj NOT garbage collected â€” Map still holds reference!

// WeakMap - weak reference (auto-cleanup)
const weakCache = new WeakMap();
let user = { id: 1, name: 'Alex' };
weakCache.set(user, { lastSeen: Date.now() });
user = null; // user CAN be garbage collected now
// weakCache entry automatically removed when user is GC'd

// Real-world use case: Private data for class instances
const _privateData = new WeakMap();

class Counter {
  constructor() {
    _privateData.set(this, { count: 0 });
  }
  
  increment() {
    const data = _privateData.get(this);
    data.count++;
  }
  
  get value() {
    return _privateData.get(this).count;
  }
}

const c = new Counter();
c.increment();
c.increment();
console.log(c.value); // 2
// When 'c' goes out of scope, _privateData entry is auto-removed

// WeakSet - track object membership without preventing GC
const processedNodes = new WeakSet();

function processNode(node) {
  if (processedNodes.has(node)) return; // Already processed
  processedNodes.add(node);
  // ... process ...
}`,
      language: 'javascript'
    },
    interviewAnswer: 'WeakMap is my go-to for associating metadata with objects without causing memory leaks. If I store DOM node data in a regular Map, the nodes can\'t be garbage collected even after they\'re removed from the page. WeakMap solves this because its entries disappear when the key object is collected. I also use WeakMap for private class data â€” it\'s a clean pattern since the data is automatically cleaned up when the instance is destroyed.',
    commonMistakes: [
      'Trying to iterate a WeakMap (not supported)',
      'Using primitive values as WeakMap keys',
      'Expecting WeakMap to have a .size property',
      'Using when you actually need to iterate the entries'
    ],
    realWorldUse: 'React uses WeakMap internally for storing fiber node data. Caching expensive computations on DOM nodes. Private class fields pattern. Memoization without memory leaks.',
    followUpQuestions: [
      'Why can\'t WeakMap be iterated?',
      'What is the difference between Map and WeakMap?',
      'When would a regular Map cause a memory leak?'
    ]
  },

  {
    id: 'js-proxy-reflect',
    category: 'javascript',
    type: 'theory',
    question: 'What are Proxy and Reflect in JavaScript?',
    difficulty: 'advanced',
    tags: ['proxy', 'reflect', 'meta-programming'],
    shortAnswer: 'Proxy intercepts and customizes fundamental operations on objects (get, set, delete, etc.). Reflect provides methods that correspond to Proxy traps. Used for validation, logging, reactive state, and virtual properties.',
    detailedExplanation: 'Proxy wraps an object and intercepts operations via handler traps. Common traps: get (property access), set (property assignment), has (in operator), deleteProperty, apply (function calls). Reflect provides the default implementations of these traps. Vue 3 and MobX use Proxy for reactivity. Proxy is more powerful than Object.defineProperty (what Vue 2 used) because it can intercept any operation including new properties.',
    example: {
      code: `// Basic Proxy - validation
const validator = {
  set(target, prop, value) {
    if (prop === 'age') {
      if (!Number.isInteger(value) || value < 0 || value > 150) {
        throw new TypeError('Age must be a positive integer <= 150');
      }
    }
    target[prop] = value;
    return true; // Must return true on success
  }
};

const person = new Proxy({}, validator);
person.name = 'Alex';  // OK
person.age = 25;       // OK
person.age = -5;       // TypeError!

// Proxy for logging
function createLoggingProxy(obj) {
  return new Proxy(obj, {
    get(target, prop) {
      console.log(\`Getting \${String(prop)}\`);
      return Reflect.get(target, prop); // Default behavior
    },
    set(target, prop, value) {
      console.log(\`Setting \${String(prop)} = \${value}\`);
      return Reflect.set(target, prop, value);
    }
  });
}

// Proxy for default values
const withDefaults = (target, defaults) => new Proxy(target, {
  get(obj, prop) {
    return prop in obj ? obj[prop] : defaults[prop];
  }
});

const config = withDefaults({}, { theme: 'dark', lang: 'en' });
config.theme;  // 'dark' (from defaults)
config.theme = 'light';
config.theme;  // 'light' (from obj)

// Reflect - use with Proxy for correct behavior
const proxy = new Proxy(obj, {
  get(target, prop, receiver) {
    // receiver ensures correct 'this' binding
    return Reflect.get(target, prop, receiver);
  }
});`,
      language: 'javascript'
    },
    interviewAnswer: 'Proxy is JavaScript\'s meta-programming tool. Vue 3 replaced Object.defineProperty with Proxy for reactivity because Proxy can detect new property additions and array index changes â€” things the old approach missed. I use Proxy for input validation (throw errors on invalid values), creating smart defaults, and building observable objects. Reflect should always be used in Proxy traps to maintain correct default behavior.',
    commonMistakes: [
      'Forgetting to return true in set trap (throws TypeError in strict mode)',
      'Not using Reflect for the default operation in traps',
      'Not understanding that Proxy has performance overhead',
      'Using Proxy when a simple getter/setter would work'
    ],
    realWorldUse: 'Vue 3 reactivity system, MobX, immer.js, validation libraries, mocking in tests. Any framework doing transparent state tracking uses Proxy.',
    followUpQuestions: [
      'How is Proxy different from Object.defineProperty?',
      'What traps does Proxy support?',
      'Why does Vue 3 use Proxy instead of Object.defineProperty?'
    ]
  },

  {
    id: 'js-symbol',
    category: 'javascript',
    type: 'theory',
    question: 'What is Symbol in JavaScript and when would you use it?',
    difficulty: 'intermediate',
    tags: ['symbol', 'unique', 'iteration'],
    shortAnswer: 'Symbol creates unique, immutable primitive values. Each Symbol() call creates a completely unique value. Used as unique object keys, implementing iteration protocols, and avoiding property name collisions.',
    detailedExplanation: 'Symbols are a primitive type whose every instance is unique. Symbol("id") !== Symbol("id"). They can be used as object property keys â€” useful to add properties to objects without risk of collision. Well-known symbols (Symbol.iterator, Symbol.toPrimitive, Symbol.hasInstance) define built-in JavaScript behaviors. Symbol properties are not enumerable in for...in loops and don\'t appear in JSON.stringify.',
    example: {
      code: `// Every Symbol is unique
const id1 = Symbol('id');
const id2 = Symbol('id');
console.log(id1 === id2); // false!
console.log(id1.toString()); // "Symbol(id)"
console.log(id1.description); // "id"

// Symbols as object keys (no collision)
const USER_ID = Symbol('userId');
const user = {
  name: 'Alex',
  [USER_ID]: 12345  // Private-ish property
};

console.log(user.name);      // 'Alex'
console.log(user[USER_ID]);  // 12345
console.log(Object.keys(user)); // ['name'] â€” Symbol not listed!

// Global Symbol registry
const globalId = Symbol.for('app.id'); // Reuse or create
const sameId = Symbol.for('app.id');   // Returns same Symbol
console.log(globalId === sameId); // true

// Well-known Symbols â€” customizing built-in behavior
class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
  
  // Make Range iterable with Symbol.iterator
  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;
    return {
      next() {
        if (current <= end) {
          return { value: current++, done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
}

const range = new Range(1, 5);
console.log([...range]); // [1, 2, 3, 4, 5]
for (const n of range) console.log(n); // 1 2 3 4 5`,
      language: 'javascript'
    },
    interviewAnswer: 'Symbols solve the property collision problem. If I want to add metadata to a third-party object without risking overwriting their properties, a Symbol key is guaranteed unique. The most practical use I encounter is Symbol.iterator â€” implementing it on a class makes it work with for...of loops and spread syntax. Well-known symbols let you hook into JavaScript\'s built-in behaviors.',
    commonMistakes: [
      'Trying to use Symbol with new (not a constructor)',
      'Forgetting Symbol properties are invisible to JSON.stringify',
      'Not using Symbol.for() when you need to share a Symbol across modules',
      'Using Symbol when a regular string key would be clearer'
    ],
    realWorldUse: 'React uses Symbol.for("react.element") to tag React elements. Redux actions use string constants but Symbols would be safer. Iterator protocol uses Symbol.iterator.',
    followUpQuestions: [
      'Are Symbol properties truly private?',
      'What is the difference between Symbol() and Symbol.for()?',
      'What are well-known Symbols?'
    ]
  },

  {
    id: 'js-error-handling-patterns',
    category: 'javascript',
    type: 'theory',
    question: 'What are best practices for error handling in JavaScript?',
    difficulty: 'intermediate',
    tags: ['error-handling', 'try-catch', 'async-errors'],
    shortAnswer: 'Use try/catch for synchronous and async/await code. Create custom Error classes. Never swallow errors silently. Always handle Promise rejections. Use finally for cleanup.',
    detailedExplanation: 'JavaScript errors need handling at every level. Synchronous: try/catch/finally. Async/await: try/catch or .catch(). Unhandled Promise rejections crash Node.js in modern versions. Custom Error classes allow type checking with instanceof. Error boundaries in React. Global handlers (window.onerror, process.on("unhandledRejection")) as last resort. Never catch an error without at minimum logging it.',
    example: {
      code: `// Custom error classes
class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

class ValidationError extends AppError {
  constructor(field, message) {
    super(message, 422, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    this.field = field;
  }
}

// Throwing and catching custom errors
function parseAge(value) {
  const age = parseInt(value);
  if (isNaN(age)) throw new ValidationError('age', 'Age must be a number');
  if (age < 0 || age > 150) throw new ValidationError('age', 'Age out of range');
  return age;
}

try {
  const age = parseAge('abc');
} catch (err) {
  if (err instanceof ValidationError) {
    console.log(\`Field \${err.field}: \${err.message}\`);
  } else {
    throw err; // Re-throw unexpected errors
  }
}

// Async error handling
// Option 1: try/catch
async function fetchUser(id) {
  try {
    const res = await fetch(\`/api/users/\${id}\`);
    if (!res.ok) throw new AppError('User not found', 404, 'NOT_FOUND');
    return await res.json();
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError('Network error', 500, 'NETWORK_ERROR');
  }
}

// Option 2: Result pattern (no exceptions)
async function safeGetUser(id) {
  try {
    const data = await fetchUser(id);
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

const { data, error } = await safeGetUser(123);
if (error) {
  // Handle error
} else {
  // Use data safely
}

// Global handlers
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  process.exit(1);
});

window.onerror = (msg, source, line, col, error) => {
  // Log to monitoring service
  logError({ msg, source, line, col, error });
};`,
      language: 'javascript'
    },
    interviewAnswer: 'Good error handling is about being explicit. I create custom error classes so catch blocks can distinguish error types and handle them appropriately. I never swallow errors with an empty catch block â€” at minimum I log them. For async code, I either use try/catch with async/await or the "Result" pattern (return {data, error}) to avoid try/catch scattering. In production, I send errors to monitoring services like Sentry.',
    commonMistakes: [
      'Empty catch blocks (silently swallowing errors)',
      'Catching errors you can\'t actually handle',
      'Not re-throwing unexpected errors',
      'Forgetting async functions need try/catch or .catch()'
    ],
    realWorldUse: 'Every production application. API error responses, form validation, network failures, third-party API errors. Sentry and DataDog monitor unhandled errors.',
    followUpQuestions: [
      'What happens with unhandled Promise rejections?',
      'What is the difference between Error types?',
      'When should you re-throw an error?'
    ]
  },

  {
    id: 'js-call-apply-bind',
    category: 'javascript',
    type: 'theory',
    question: 'What is the difference between call(), apply(), and bind()?',
    difficulty: 'intermediate',
    tags: ['this', 'functions', 'methods'],
    shortAnswer: 'All three explicitly set "this". call() invokes immediately with args as comma-separated. apply() invokes immediately with args as array. bind() returns a new function with "this" bound â€” does NOT invoke immediately.',
    detailedExplanation: 'call(thisArg, arg1, arg2) invokes the function with this set to thisArg. apply(thisArg, [arg1, arg2]) same but arguments as array â€” useful when args are already in an array. bind(thisArg) returns a new function permanently bound to thisArg but doesn\'t call it â€” useful for creating callbacks with correct context. In modern code, arrow functions and class fields often replace bind().',
    example: {
      code: `const person = {
  name: 'Alex',
  greet(greeting, punctuation) {
    return \`\${greeting}, I'm \${this.name}\${punctuation}\`;
  }
};

const anotherPerson = { name: 'Sam' };

// call - invoke immediately, args comma-separated
person.greet.call(anotherPerson, 'Hello', '!');
// "Hello, I'm Sam!"

// apply - invoke immediately, args as array
person.greet.apply(anotherPerson, ['Hi', '?']);
// "Hi, I'm Sam?"

// bind - returns new function, doesn't invoke
const greetSam = person.greet.bind(anotherPerson);
greetSam('Hey', '.');  // "Hey, I'm Sam."

// bind with preset arguments (partial application)
const greetSamHello = person.greet.bind(anotherPerson, 'Hello');
greetSamHello('!'); // "Hello, I'm Sam!"

// Common use case: event handler context
class Timer {
  constructor() {
    this.seconds = 0;
  }
  
  start() {
    // Without bind, 'this' inside callback is wrong
    setInterval(this.tick.bind(this), 1000);
    // Or use arrow function: setInterval(() => this.tick(), 1000)
  }
  
  tick() {
    this.seconds++;
    console.log(this.seconds);
  }
}

// Practical: apply to spread array as function args
const numbers = [5, 2, 9, 1, 7];
Math.max.apply(null, numbers); // 9
// Modern equivalent: Math.max(...numbers);

// Memory trick:
// call  = comma-separated args
// apply = array args (A for Array)
// bind  = returns Bound function`,
      language: 'javascript'
    },
    interviewAnswer: 'I remember call=comma, apply=array, bind=bound. call() and apply() invoke immediately â€” I use call() most often. apply() is handy when I already have args in an array, though spread syntax has largely replaced it. bind() is what I use when I need to pass a method as a callback but need to preserve its this context â€” like event handlers in class components or setTimeout callbacks.',
    commonMistakes: [
      'Calling bind() and expecting it to invoke (it just returns a function)',
      'Using bind() when an arrow function would be cleaner',
      'Passing wrong type for apply (non-array second argument)',
      'Not understanding that bind creates a NEW function each time'
    ],
    realWorldUse: 'React class component event handlers need .bind(this). Borrowing methods from other objects. Function.prototype.call is used by many utilities to call methods with specific context.',
    followUpQuestions: [
      'Can you bind a function multiple times?',
      'How do arrow functions eliminate the need for bind?',
      'What does call() return?'
    ]
  },

  {
    id: 'js-object-methods',
    category: 'javascript',
    type: 'theory',
    question: 'What are the most important Object static methods in JavaScript?',
    difficulty: 'intermediate',
    tags: ['objects', 'methods', 'es6'],
    shortAnswer: 'Key Object methods: Object.keys() (own enumerable keys), Object.values(), Object.entries(), Object.assign() (shallow copy/merge), Object.freeze() (immutable), Object.create() (prototype chain), Object.fromEntries().',
    detailedExplanation: 'Object static methods are fundamental for working with objects. Object.keys/values/entries return arrays from objects and are the standard way to iterate objects. Object.assign copies properties and is used for merging or shallow cloning. Object.freeze prevents modifications. Object.create creates objects with a specific prototype. Object.fromEntries converts Map or array of pairs to an object.',
    example: {
      code: `const user = { name: 'Alex', age: 25, role: 'admin' };

// Iterate objects
Object.keys(user);    // ['name', 'age', 'role']
Object.values(user);  // ['Alex', 25, 'admin']
Object.entries(user); // [['name','Alex'], ['age',25], ['role','admin']]

// Transform object
const upperCased = Object.fromEntries(
  Object.entries(user).map(([k, v]) => [k, String(v).toUpperCase()])
);
// { name: 'ALEX', age: '25', role: 'ADMIN' }

// Merge objects (shallow)
const defaults = { theme: 'dark', lang: 'en' };
const settings = { theme: 'light' };
const merged = Object.assign({}, defaults, settings);
// { theme: 'light', lang: 'en' }
// Or modern: const merged = { ...defaults, ...settings };

// Shallow clone
const clone = Object.assign({}, user);

// Freeze (immutable)
const config = Object.freeze({ api: 'https://api.com', timeout: 5000 });
config.timeout = 10000; // Silently fails (throws in strict mode)
console.log(config.timeout); // Still 5000

// Object.create â€” set prototype
const animal = { speak() { return \`\${this.name} speaks\`; } };
const dog = Object.create(animal);
dog.name = 'Rex';
dog.speak(); // 'Rex speaks'

// Check own property (not inherited)
user.hasOwnProperty('name'); // true
Object.prototype.hasOwnProperty.call(user, 'toString'); // false

// Property descriptors
Object.defineProperty(user, 'id', {
  value: 123,
  writable: false,
  enumerable: false,  // Won't show in Object.keys
  configurable: false
});`,
      language: 'javascript'
    },
    interviewAnswer: 'I use Object.entries() constantly when I need to transform objects â€” map over entries, filter properties, or convert to a Map. Object.assign() is used for merging configs and shallow clones, though spread syntax is cleaner. Object.freeze() is useful for constants and config objects you don\'t want accidentally modified. Object.fromEntries() combined with entries() creates a clean functional pipeline for object transformation.',
    commonMistakes: [
      'Using Object.keys() on null/undefined (throws)',
      'Thinking Object.freeze() is a deep freeze (it\'s shallow)',
      'Using Object.assign() for deep copy (it\'s shallow)',
      'Forgetting Object.keys() only returns own enumerable properties'
    ],
    realWorldUse: 'Object.entries/fromEntries for data transformation. Object.assign for configuration merging. Object.freeze for constants. Object.create for prototype-based patterns.',
    followUpQuestions: [
      'What is the difference between Object.keys() and for...in?',
      'How do you deep freeze an object?',
      'What does Object.create(null) do?'
    ]
  },
  {
    id: 'js-event-delegation',
    category: 'javascript',
    type: 'theory',
    question: 'What is event delegation and why is it useful?',
    difficulty: 'intermediate',
    tags: ['events', 'dom', 'performance'],
    shortAnswer: 'Event delegation attaches a single event listener to a parent element instead of many listeners on children. It works via event bubbling and is more memory-efficient for dynamic lists.',
    detailedExplanation: 'When an event fires on a child, it bubbles up the DOM tree. By listening on a parent you can handle events from many children — including ones added dynamically — with one handler. This reduces memory usage and avoids the need to re-attach listeners when the DOM changes.',
    example: {
      code: `// Instead of:
items.forEach(item => item.addEventListener('click', handler));

// Use delegation on the parent:
document.getElementById('list').addEventListener('click', (e) => {
  if (e.target.matches('li.item')) {
    console.log('Clicked:', e.target.textContent);
  }
});`,
      language: 'javascript'
    },
    interviewAnswer: 'Mention bubbling, the performance benefit for large/dynamic lists, and use e.target to identify the actual element clicked.',
    commonMistakes: [
      'Forgetting that some events (e.g. focus, blur) do not bubble',
      'Not checking e.target — handling every click on the parent',
    ],
    realWorldUse: 'Virtual lists, dynamically generated table rows, or any list built from server data.',
    followUpQuestions: ['What events do NOT bubble?', 'How does e.stopPropagation() affect delegation?']
  },

  {
    id: 'js-memoization',
    category: 'javascript',
    type: 'theory',
    question: 'What is memoization and how do you implement it in JavaScript?',
    difficulty: 'intermediate',
    tags: ['performance', 'optimization', 'functions'],
    shortAnswer: 'Memoization caches the result of a function call keyed by its arguments. Subsequent calls with the same arguments return the cached result instead of recomputing.',
    detailedExplanation: 'It trades memory for speed. Best suited for pure functions with expensive computation and repeated calls with the same inputs. A simple implementation uses a Map or object as the cache inside a closure.',
    example: {
      code: `function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const fib = memoize(function (n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
});`,
      language: 'javascript'
    },
    interviewAnswer: 'Explain the closure-based cache, when it helps (expensive pure functions), and its tradeoff (memory growth for many unique inputs).',
    commonMistakes: [
      'Using JSON.stringify for cache key — breaks with non-serializable args',
      'Applying to impure functions that produce side effects',
    ],
    realWorldUse: 'Recursive algorithms (Fibonacci, dynamic programming), expensive selector computations in React (useMemo).',
    followUpQuestions: ['How does React useMemo differ from a manual memoize?', 'What happens if the function has side effects?']
  },

  {
    id: 'js-optional-chaining',
    category: 'javascript',
    type: 'theory',
    question: 'What is optional chaining (?.) and nullish coalescing (??), and when do you use each?',
    difficulty: 'beginner',
    tags: ['es2020', 'operators', 'null-safety'],
    shortAnswer: '?. short-circuits to undefined if a property in a chain is null/undefined. ?? returns the right side only when the left is null or undefined (unlike || which also triggers for 0, "", false).',
    detailedExplanation: 'Optional chaining eliminates defensive null checks: user?.address?.city. Nullish coalescing is a safer default provider than || because || triggers on any falsy value, causing bugs when 0 or false are valid values.',
    example: {
      code: `const user = { profile: { age: 0 } };

// Optional chaining
console.log(user?.profile?.city);   // undefined (no error)
console.log(user?.missing?.x);      // undefined

// Nullish coalescing vs OR
console.log(user.profile.age ?? 18); // 0  (0 is a valid value)
console.log(user.profile.age || 18); // 18 (BUG — 0 is falsy)

// Combined
const city = user?.address?.city ?? 'Unknown';`,
      language: 'javascript'
    },
    interviewAnswer: 'Highlight the difference between ?? and || with a 0 or false value example — this is the most common interview trap.',
    commonMistakes: [
      'Using || as a default when 0 or false are valid values',
      'Using ?. on a non-optional function call without the () — obj?.method() vs obj?.method',
    ],
    realWorldUse: 'API responses with deeply nested optional fields, feature flags, optional callbacks.',
    followUpQuestions: ['What does obj?.method?.() do?', 'Can you use ?. on arrays?']
  },

  {
    id: 'js-module-system',
    category: 'javascript',
    type: 'theory',
    question: 'What is the difference between ES Modules (import/export) and CommonJS (require/module.exports)?',
    difficulty: 'intermediate',
    tags: ['modules', 'esm', 'commonjs', 'nodejs'],
    shortAnswer: 'ES Modules are static (imports resolved at parse time, tree-shakeable, asynchronous). CommonJS is dynamic (require() runs at runtime, synchronous, no tree-shaking). ESM is the standard in browsers and modern Node.js.',
    detailedExplanation: 'ESM: static analysis enables tree-shaking, top-level await is supported, live bindings (the exported value is a live reference, not a copy). CJS: dynamic — you can require() inside conditionals. Node.js supports both but they cannot mix without explicit configuration. Bundlers (Webpack, Rollup) prefer ESM.',
    example: {
      code: `// CommonJS
const path = require('path');           // synchronous
module.exports = { greet };             // copy of value

// ES Module
import path from 'path';               // static, hoisted
export { greet };                       // live binding

// Dynamic import (ESM — lazy loading)
const module = await import('./heavy.js');`,
      language: 'javascript'
    },
    interviewAnswer: 'Key distinction: static vs dynamic. Mention tree-shaking and live bindings as the practical differences that matter most.',
    commonMistakes: [
      'Mixing require and import in the same file',
      'Forgetting .mjs extension or "type":"module" in package.json for ESM in Node',
    ],
    realWorldUse: 'Bundler configuration, code splitting, polyfill-free modern builds.',
    followUpQuestions: ['What is top-level await?', 'Why does tree-shaking not work with CommonJS?']
  },

  {
    id: 'js-temporal-dead-zone',
    category: 'javascript',
    type: 'theory',
    question: 'What is the Temporal Dead Zone (TDZ)?',
    difficulty: 'intermediate',
    tags: ['hoisting', 'let', 'const', 'tdz'],
    shortAnswer: 'The TDZ is the period between entering a block scope and the let/const declaration being reached. Accessing the variable in this window throws a ReferenceError, even though the variable is "hoisted" (its binding exists but is uninitialised).',
    detailedExplanation: 'var is hoisted and initialised with undefined. let and const are hoisted but NOT initialised — they sit in the TDZ from the start of the block until their declaration line. This prevents accessing them before they are set, making bugs easier to catch.',
    example: {
      code: `{
  // TDZ for x starts here
  console.log(x); // ❌ ReferenceError: Cannot access 'x' before initialization
  let x = 5;      // TDZ ends here
  console.log(x); // 5
}

// var — no TDZ
console.log(y); // undefined (hoisted + initialised)
var y = 10;`,
      language: 'javascript'
    },
    interviewAnswer: 'Explain that let/const are technically hoisted but not initialised. The TDZ exists precisely to prevent accidental use-before-declare bugs that var allows.',
    commonMistakes: [
      'Saying let/const are "not hoisted" — they are, but uninitialised',
      'Confusing TDZ with scope — the variable IS in scope, just uninitialised',
    ],
    realWorldUse: 'Understanding linting errors, debugging reference errors in transpiled code.',
    followUpQuestions: ['Does typeof trigger a TDZ error?', 'How does TDZ interact with class declarations?']
  },

  {
    id: 'js-structured-clone',
    category: 'javascript',
    type: 'theory',
    question: 'What is structuredClone() and how does it improve on JSON.parse(JSON.stringify())?',
    difficulty: 'intermediate',
    tags: ['cloning', 'deep-copy', 'es2022'],
    shortAnswer: 'structuredClone() performs a deep clone without the limitations of JSON round-tripping. It handles Dates, RegExps, Maps, Sets, ArrayBuffers, circular references, and undefined values — all of which JSON.parse/stringify breaks.',
    detailedExplanation: 'JSON.parse(JSON.stringify(obj)) is the classic deep clone hack but has well-known pitfalls: Date becomes a string, undefined values are dropped, Map/Set become plain objects, and circular references throw. structuredClone() uses the browser\'s structured clone algorithm, which handles all these cases natively.',
    example: {
      code: `// JSON.parse/stringify pitfalls
const original = { date: new Date(), fn: () => {}, set: new Set([1,2]) };
const bad = JSON.parse(JSON.stringify(original));
console.log(bad.date);  // string, not Date
console.log(bad.fn);    // undefined (functions dropped)
console.log(bad.set);   // {} (not a Set)

// structuredClone
const good = structuredClone({ date: new Date(), set: new Set([1,2]) });
console.log(good.date instanceof Date); // true
console.log(good.set instanceof Set);   // true

// Handles circular references
const obj = { a: 1 };
obj.self = obj;
const clone = structuredClone(obj); // works!`,
      language: 'javascript'
    },
    interviewAnswer: 'List the specific types that break with JSON round-tripping and mention that structuredClone is now natively available in all modern browsers and Node 17+.',
    commonMistakes: [
      'Thinking structuredClone handles functions — it throws if the object contains functions',
      'Using JSON clone for objects with Date fields',
    ],
    realWorldUse: 'Cloning Redux state, duplicating complex form objects, Web Worker data transfer.',
    followUpQuestions: ['What does structuredClone do with functions?', 'How does it compare to Lodash cloneDeep?']
  },

  {
    id: 'js-iterator-protocol',
    category: 'javascript',
    type: 'theory',
    question: 'What is the JavaScript iterator protocol and how does for...of work?',
    difficulty: 'advanced',
    tags: ['iterators', 'generators', 'protocol', 'es6'],
    shortAnswer: 'An object is iterable if it has a [Symbol.iterator] method that returns an iterator. An iterator has a next() method returning { value, done }. for...of, spread, destructuring all call this protocol under the hood.',
    detailedExplanation: 'Built-in iterables include Array, String, Map, Set, arguments, and NodeList. You can make any object iterable by implementing [Symbol.iterator]. Generators automatically implement the iterator protocol via their generator function.',
    example: {
      code: `// Custom iterable
const range = {
  from: 1,
  to: 5,
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;
    return {
      next() {
        return current <= last
          ? { value: current++, done: false }
          : { value: undefined, done: true };
      }
    };
  }
};

for (const n of range) console.log(n); // 1 2 3 4 5
console.log([...range]); // [1, 2, 3, 4, 5]`,
      language: 'javascript'
    },
    interviewAnswer: 'Explain Symbol.iterator, the { value, done } contract, and that for...of is syntactic sugar over the protocol. Mention generators as an easy way to implement it.',
    commonMistakes: [
      'Confusing iterable (has [Symbol.iterator]) with iterator (has next())',
      'Forgetting that plain objects are not iterable by default',
    ],
    realWorldUse: 'Custom data structures (linked lists, trees, ranges), lazy sequences, streaming data.',
    followUpQuestions: ['What is a generator and how does it relate to iterators?', 'Can you make an object both iterable and an iterator?']
  },

  {
    id: 'js-web-workers',
    category: 'javascript',
    type: 'theory',
    question: 'What are Web Workers and when would you use one?',
    difficulty: 'advanced',
    tags: ['web-workers', 'concurrency', 'performance', 'browser'],
    shortAnswer: 'Web Workers run JavaScript in a background thread separate from the main thread, preventing UI blocking for CPU-intensive tasks. Communication is via postMessage(). Workers have no access to the DOM.',
    detailedExplanation: 'JavaScript is single-threaded on the main thread. Heavy computations (image processing, large array manipulation, encryption) on the main thread block rendering and user interaction. Web Workers offload this work to a background thread. SharedArrayBuffer + Atomics enable shared memory between workers for advanced coordination.',
    example: {
      code: `// worker.js
self.addEventListener('message', (e) => {
  const result = heavyComputation(e.data);
  self.postMessage(result);
});

// main.js
const worker = new Worker('worker.js');
worker.postMessage(largeDataset);
worker.addEventListener('message', (e) => {
  console.log('Result:', e.data); // non-blocking
});

// Terminate when done
worker.terminate();`,
      language: 'javascript'
    },
    interviewAnswer: 'Lead with "keep the UI thread free". Mention the no-DOM restriction, postMessage for communication, and that data is copied (structured clone) not shared by default.',
    commonMistakes: [
      'Trying to access document or window inside a worker',
      'Not terminating workers when done — they keep running',
      'Using workers for trivial tasks where the postMessage overhead is greater than the work',
    ],
    realWorldUse: 'Image/video processing, crypto hashing, parsing large JSON files, spell-checking.',
    followUpQuestions: ['What is a Service Worker? How is it different from a Web Worker?', 'What is SharedArrayBuffer?']
  },

  {
    id: 'js-tagged-template-literals',
    category: 'javascript',
    type: 'theory',
    question: 'What are tagged template literals and how do they work?',
    difficulty: 'advanced',
    tags: ['template-literals', 'es6', 'strings'],
    shortAnswer: 'A tagged template calls a function with the string parts and interpolated values as separate arguments, allowing custom processing of the template. Libraries like styled-components and gql use this pattern.',
    detailedExplanation: 'The tag function receives (strings, ...values) where strings is an array of the static parts and values are the evaluated expressions. You can sanitize, translate, query-build, or CSS-in-JS with this pattern.',
    example: {
      code: `// Tag function signature
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const val = values[i] !== undefined
      ? \`<mark>\${values[i]}</mark>\`
      : '';
    return result + str + val;
  }, '');
}

const name = 'Alice';
const score = 95;
console.log(highlight\`Hello \${name}, you scored \${score}!\`);
// "Hello <mark>Alice</mark>, you scored <mark>95</mark>!"

// Real-world: SQL safe query builder
const id = 1;
sql\`SELECT * FROM users WHERE id = \${id}\`;
// Parameterizes 'id' instead of string-interpolating (SQL injection prevention)`,
      language: 'javascript'
    },
    interviewAnswer: 'Explain the (strings, ...values) signature and the real-world uses: styled-components, GraphQL gql tag, i18n, SQL parameterization.',
    commonMistakes: [
      'Thinking the tag receives a single string — it receives an array of string parts',
      'Forgetting that strings.length === values.length + 1',
    ],
    realWorldUse: 'styled-components, Apollo gql, i18n translation libraries, safe SQL query builders.',
    followUpQuestions: ['How does styled-components use tagged templates?', 'What is String.raw?']
  },

  {
    id: 'js-microtasks-macrotasks',
    category: 'javascript',
    type: 'theory',
    question: 'What is the difference between microtasks and macrotasks in the JavaScript event loop?',
    difficulty: 'advanced',
    tags: ['event-loop', 'microtasks', 'promises', 'async'],
    shortAnswer: 'Microtasks (Promise callbacks, queueMicrotask, MutationObserver) run after the current task completes but before the next macrotask. Macrotasks (setTimeout, setInterval, I/O) queue at the end. The microtask queue is always fully drained before the next macrotask runs.',
    detailedExplanation: 'Execution order: current synchronous code → drain all microtasks → run one macrotask → drain all microtasks → render → repeat. This means Promise.then handlers always run before setTimeout(fn, 0), even though both are "async".',
    example: {
      code: `console.log('1 - sync');

setTimeout(() => console.log('2 - macrotask'), 0);

Promise.resolve().then(() => console.log('3 - microtask'));

queueMicrotask(() => console.log('4 - microtask'));

console.log('5 - sync');

// Output order:
// 1 - sync
// 5 - sync
// 3 - microtask   ← microtasks drain before macrotask
// 4 - microtask
// 2 - macrotask`,
      language: 'javascript'
    },
    interviewAnswer: 'Draw the queue model: call stack → microtask queue (fully drained) → macrotask queue (one at a time). The classic interview question is predicting the output of mixed Promise/setTimeout code.',
    commonMistakes: [
      'Assuming setTimeout(fn, 0) runs before Promise.then',
      'Thinking microtasks and macrotasks are just "async" — the ordering matters significantly',
    ],
    realWorldUse: 'Understanding async ordering bugs, optimising rendering pipelines, batching DOM updates.',
    followUpQuestions: ['Where does async/await sit in this model?', 'What is queueMicrotask used for?']
  },

  {
    id: 'js-map-set',
    category: 'javascript',
    type: 'theory',
    question: 'What are Map and Set in JavaScript and how do they differ from objects and arrays?',
    difficulty: 'intermediate',
    tags: ['map', 'set', 'data-structures', 'es6'],
    shortAnswer: 'Map is a key-value collection where keys can be any type (not just strings). Set is a collection of unique values. Both are iterable and have better performance for frequent adds/deletes than plain objects/arrays.',
    detailedExplanation: 'Object keys are always converted to strings (or symbols). Map preserves key types — you can use objects, functions, or primitives as keys. Map maintains insertion order. Set automatically removes duplicates. WeakMap/WeakSet hold weak references for garbage-collection-friendly caching. Map has .size, .has(), .get(), .set(), .delete(). Set has .size, .has(), .add(), .delete(). Both are iterable with for...of.',
    example: {
      code: `// Map - any key type
const map = new Map();
const objKey = { id: 1 };
map.set(objKey, 'value');
map.set('string', 42);
map.set(1, 'number key');

map.get(objKey); // 'value'
map.has('string'); // true
map.size; // 3

// Iterate
for (const [key, value] of map) {
  console.log(key, value);
}

// Set - unique values
const set = new Set([1, 2, 2, 3, 3, 3]);
console.log([...set]); // [1, 2, 3]

set.add(4);
set.has(2); // true
set.delete(1);

// Deduplicate array
const unique = [...new Set(array)];

// Set operations
const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);
const union = new Set([...a, ...b]); // {1,2,3,4}
const intersection = new Set([...a].filter(x => b.has(x))); // {2,3}
const difference = new Set([...a].filter(x => !b.has(x))); // {1}

// Map vs Object
// Object: string/symbol keys, no size, no built-in iteration
// Map: any key, .size, iterable, better for frequent changes`,
      language: 'javascript',
    },
    interviewAnswer: 'Map is my go-to when I need non-string keys or need to store metadata on DOM nodes without risk of collisions. Set is perfect for deduplication — [...new Set(array)] is the cleanest way to get unique values. Both have better performance than objects for frequent add/delete operations because they don\'t need to worry about prototype chain lookups.',
    commonMistakes: [
      'Using Object when keys need to be non-strings',
      'Using Array.includes() in a loop instead of Set.has() (O(n) vs O(1))',
      'Not knowing Map preserves insertion order',
    ],
    realWorldUse: 'Deduplication, caching with object keys, frequency counting, graph adjacency lists.',
    followUpQuestions: ['What is the time complexity of Map vs Object lookup?', 'When would you use WeakMap over Map?'],
  },

  {
    id: 'js-currying',
    category: 'javascript',
    type: 'theory',
    question: 'What is currying and partial application in JavaScript?',
    difficulty: 'intermediate',
    tags: ['currying', 'functional-programming', 'closures'],
    shortAnswer: 'Currying transforms a function with multiple arguments into a chain of functions each taking one argument: f(a, b, c) → f(a)(b)(c). Partial application fixes some arguments upfront and returns a function waiting for the rest.',
    detailedExplanation: 'Currying uses closures to remember earlier arguments. It enables function composition and reuse — create specialised functions from general ones. Partial application (bind, or manual) is related but different: it fixes N arguments and returns a function for the remaining ones. Libraries like Lodash/Ramda curry automatically. Useful for creating point-free, composable pipelines.',
    example: {
      code: `// Manual curry
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return function(...more) {
      return curried(...args, ...more);
    };
  };
}

const add = curry((a, b, c) => a + b + c);
add(1)(2)(3); // 6
add(1, 2)(3); // 6
add(1)(2, 3); // 6

// Practical: specialised functions
const multiply = curry((factor, value) => factor * value);
const double = multiply(2);
const triple = multiply(3);

[1, 2, 3].map(double); // [2, 4, 6]
[1, 2, 3].map(triple); // [3, 6, 9]

// Partial application with bind
function greet(greeting, name) {
  return \`\${greeting}, \${name}!\`;
}
const sayHello = greet.bind(null, 'Hello');
sayHello('Alex'); // 'Hello, Alex!'

// Compose functions
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

const process = pipe(
  x => x * 2,
  x => x + 1,
  x => x.toString()
);
process(5); // "11"`,
      language: 'javascript',
    },
    interviewAnswer: 'Currying makes functions more reusable by allowing partial application. I use it when building data transformation pipelines — create a general function, then specialise it with pre-filled arguments. It works naturally with map/filter/reduce. The key insight is that curried functions are created once but called many times with different data.',
    commonMistakes: [
      'Confusing currying (one arg at a time) with partial application (fix N args)',
      'Thinking currying is only useful in functional languages',
    ],
    realWorldUse: 'Event handler factories, validation rule builders, API request builders, Redux middleware.',
    followUpQuestions: ['What is function composition?', 'How does Lodash _.curry work?'],
  },

  {
    id: 'js-private-class-fields',
    category: 'javascript',
    type: 'theory',
    question: 'What are private class fields and methods in JavaScript?',
    difficulty: 'intermediate',
    tags: ['classes', 'private-fields', 'encapsulation', 'es2022'],
    shortAnswer: 'Private fields/methods use # prefix and are truly inaccessible outside the class — unlike the old _ convention which was just a naming agreement. They are enforced at the language level.',
    detailedExplanation: 'ES2022 introduced # syntax for true private fields and methods. They cannot be accessed or modified from outside the class — not even by subclasses. This is different from TypeScript\'s private keyword (which is compile-time only). Private static fields/methods also supported. Accessing a private field on an object that doesn\'t have it throws a TypeError — useful for brand checking.',
    example: {
      code: `class BankAccount {
  #balance = 0;          // private field
  #transactionLog = [];  // private field

  constructor(initialBalance) {
    this.#balance = initialBalance;
  }

  // private method
  #log(type, amount) {
    this.#transactionLog.push({ type, amount, date: new Date() });
  }

  deposit(amount) {
    if (amount <= 0) throw new Error('Invalid amount');
    this.#balance += amount;
    this.#log('deposit', amount);
  }

  withdraw(amount) {
    if (amount > this.#balance) throw new Error('Insufficient funds');
    this.#balance -= amount;
    this.#log('withdrawal', amount);
  }

  get balance() {
    return this.#balance; // public getter
  }
}

const account = new BankAccount(1000);
account.deposit(500);
console.log(account.balance); // 1500
console.log(account.#balance); // SyntaxError! Truly private

// Brand checking — check if object has the private field
class Token {
  #valid = true;
  static isToken(obj) {
    try {
      obj.#valid; // throws if not a Token
      return true;
    } catch {
      return false;
    }
  }
}

// Private static
class Config {
  static #instance = null;
  static getInstance() {
    if (!Config.#instance) Config.#instance = new Config();
    return Config.#instance;
  }
}`,
      language: 'javascript',
    },
    interviewAnswer: 'Private class fields with # give JavaScript real encapsulation. Before this, we used _ convention or WeakMaps for privacy, but both were workarounds. # fields are enforced by the JS engine — no way to access them externally, even with reflection. I use them for internal state like validation logic, caches, or sensitive data that should never be exposed.',
    commonMistakes: [
      'Confusing TypeScript private (compile-time) with JS # private (runtime)',
      'Trying to access private fields in subclasses (not allowed)',
    ],
    realWorldUse: 'Encapsulating internal state, implementing singletons, preventing mutation of critical values.',
    followUpQuestions: ['Can subclasses access parent private fields?', 'How does # privacy differ from TypeScript private?'],
  },

  {
    id: 'js-abort-controller',
    category: 'javascript',
    type: 'theory',
    question: 'What is AbortController and how do you cancel async operations?',
    difficulty: 'intermediate',
    tags: ['AbortController', 'fetch', 'async', 'cancellation'],
    shortAnswer: 'AbortController provides a signal you pass to fetch (or other async APIs) that lets you cancel the operation. Call controller.abort() to cancel. The fetch rejects with an AbortError.',
    detailedExplanation: 'Before AbortController, there was no standard way to cancel a fetch request. The controller creates a signal object — pass it to fetch, event listeners, or any API that accepts it. Calling abort() signals cancellation. fetch() immediately rejects with AbortError. Essential for: cancelling stale search requests as user types, component unmount cleanup, timeout logic, React useEffect cleanup.',
    example: {
      code: `// Basic usage
const controller = new AbortController();
const signal = controller.signal;

fetch('/api/data', { signal })
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => {
    if (err.name === 'AbortError') {
      console.log('Request cancelled');
    } else {
      throw err; // Re-throw unexpected errors
    }
  });

// Cancel after 5 seconds
setTimeout(() => controller.abort(), 5000);

// React: cancel on unmount
function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    async function search() {
      try {
        const res = await fetch(\`/api/search?q=\${query}\`, {
          signal: controller.signal
        });
        const data = await res.json();
        setResults(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      }
    }

    search();
    return () => controller.abort(); // Cancel on unmount or query change
  }, [query]);

  return <ul>{results.map(r => <li key={r.id}>{r.name}</li>)}</ul>;
}

// Timeout with AbortSignal.timeout() (modern)
const res = await fetch('/api/data', {
  signal: AbortSignal.timeout(5000) // Auto-cancels after 5s
});

// AbortSignal.any() — cancel on first trigger
const signal = AbortSignal.any([
  AbortSignal.timeout(5000),
  manualController.signal
]);`,
      language: 'javascript',
    },
    interviewAnswer: 'AbortController solves the "stale request" problem. In a search box, if the user types fast, each keystroke triggers a request — without cancellation, an old slow response could overwrite a newer fast one. I always pass an AbortController signal in React useEffect data fetching and cancel in the cleanup function. AbortSignal.timeout() is the cleanest way to add request timeouts.',
    commonMistakes: [
      'Not checking err.name === "AbortError" before re-throwing',
      'Creating a new controller on every render instead of in useEffect',
    ],
    realWorldUse: 'Search autocomplete, debounced API calls, React useEffect cleanup, request timeouts.',
    followUpQuestions: ['What happens to an in-flight fetch when you call abort()?', 'How does AbortSignal.timeout() work?'],
  },

  {
    id: 'js-design-patterns',
    category: 'javascript',
    type: 'theory',
    question: 'What are common JavaScript design patterns and when do you use them?',
    difficulty: 'advanced',
    tags: ['design-patterns', 'singleton', 'observer', 'factory'],
    shortAnswer: 'Common patterns: Singleton (one instance), Observer/pub-sub (event system), Factory (create objects without new), Module (encapsulate private state), Strategy (swap algorithms), Decorator (add behavior). Each solves a recurring design problem.',
    detailedExplanation: 'Design patterns are proven solutions to common problems. Singleton ensures one instance (config, DB connection). Observer decouples event producers from consumers. Factory creates objects with a consistent interface. Module pattern uses closures for private state. Strategy allows swapping algorithms at runtime. Decorator wraps objects to add behavior. In modern JavaScript, many patterns are built into the language — ES modules replace the Module pattern, classes enable Strategy naturally.',
    example: {
      code: `// Singleton
class DatabaseConnection {
  static #instance = null;
  #connection;

  constructor() {
    if (DatabaseConnection.#instance) return DatabaseConnection.#instance;
    this.#connection = this.#connect();
    DatabaseConnection.#instance = this;
  }

  #connect() { /* establish connection */ }
}

// Observer / EventEmitter
class EventBus {
  #listeners = new Map();

  on(event, callback) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, []);
    this.#listeners.get(event).push(callback);
    return () => this.off(event, callback); // return unsubscribe
  }

  emit(event, data) {
    this.#listeners.get(event)?.forEach(cb => cb(data));
  }

  off(event, callback) {
    const cbs = this.#listeners.get(event) || [];
    this.#listeners.set(event, cbs.filter(cb => cb !== callback));
  }
}

// Factory
function createUser(type, data) {
  const base = { ...data, createdAt: new Date() };
  if (type === 'admin') return { ...base, permissions: ['read', 'write', 'delete'] };
  if (type === 'guest') return { ...base, permissions: ['read'] };
  return { ...base, permissions: ['read', 'write'] };
}

// Strategy — swap validation algorithms
const validators = {
  email: value => /^[^@]+@[^@]+\.[^@]+$/.test(value),
  phone: value => /^\d{10}$/.test(value),
  zip: value => /^\d{5}$/.test(value),
};

function validate(type, value) {
  return validators[type]?.(value) ?? false;
}

// Decorator
function withLogging(fn) {
  return function(...args) {
    console.log(\`Calling \${fn.name} with\`, args);
    const result = fn(...args);
    console.log(\`\${fn.name} returned\`, result);
    return result;
  };
}`,
      language: 'javascript',
    },
    interviewAnswer: 'I reach for Observer when I need to decouple components — like a shopping cart that notifies multiple systems when updated. Singleton for shared resources like a logger or DB connection pool. Factory when I need to create different types of objects with a consistent interface — like a notification system that creates email, SMS, or push notifications. Strategy when business logic varies by condition but the caller shouldn\'t know which path is taken.',
    commonMistakes: [
      'Overusing Singleton (creates hidden global state)',
      'Implementing patterns manually when the language provides them natively',
    ],
    realWorldUse: 'Redux is Observer. React components are Factory. Express middleware is Chain of Responsibility.',
    followUpQuestions: ['What is the difference between Observer and Pub/Sub?', 'What problems does the Singleton pattern cause?'],
  },

  {
    id: 'js-functional-programming',
    category: 'javascript',
    type: 'theory',
    question: 'What is functional programming in JavaScript and what are its core principles?',
    difficulty: 'intermediate',
    tags: ['functional-programming', 'pure-functions', 'immutability', 'composition'],
    shortAnswer: 'Functional programming treats computation as evaluation of pure functions, avoids shared mutable state, and favours function composition. Core ideas: pure functions, immutability, higher-order functions, no side effects.',
    detailedExplanation: 'FP principles: Pure functions always return the same output for same input and have no side effects. Immutability — never modify data, create new values. First-class functions — functions are values, can be passed and returned. Higher-order functions — map, filter, reduce. Function composition — combine small functions into larger ones. Referential transparency — an expression can be replaced by its value. JavaScript supports FP natively with closures, array methods, and spread/destructuring.',
    example: {
      code: `// Pure function — same input always same output, no side effects
const add = (a, b) => a + b; // Pure
let total = 0;
const impureAdd = (a) => { total += a; return total; }; // Impure

// Immutability — never mutate, create new
// ❌ Mutating
function addItemBad(cart, item) {
  cart.push(item); // Mutates!
  return cart;
}
// ✅ Immutable
const addItem = (cart, item) => [...cart, item];
const updateQuantity = (cart, id, qty) =>
  cart.map(item => item.id === id ? { ...item, qty } : item);

// Higher-order functions
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

const processOrders = pipe(
  orders => orders.filter(o => o.status === 'paid'),
  orders => orders.map(o => ({ ...o, total: o.price * o.qty })),
  orders => orders.reduce((sum, o) => sum + o.total, 0)
);

// Avoiding side effects — return values instead of mutating
// ❌ Side effect
function processUser(user) {
  user.name = user.name.toUpperCase(); // Side effect
  sendEmail(user); // Side effect
}
// ✅ Functional
const formatUser = user => ({ ...user, name: user.name.toUpperCase() });
const withEmail = user => { sendEmail(user); return user; };

// Memoization — cache pure function results
const memoize = fn => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};`,
      language: 'javascript',
    },
    interviewAnswer: 'FP makes code more predictable and testable. Pure functions are easy to test — no setup or teardown needed. Immutability eliminates a whole class of bugs from shared mutable state. I use these principles in React — components as pure functions of props, state updates that return new objects. Redux enforces FP: pure reducers, immutable state. Even in non-FP code, favouring immutability and pure functions improves maintainability.',
    commonMistakes: [
      'Thinking FP means no loops (you can use loops in FP, just avoid mutations)',
      'Making everything functional even when OOP is clearer',
    ],
    realWorldUse: 'React (pure components), Redux (reducers), RxJS (observables), data transformation pipelines.',
    followUpQuestions: ['What is referential transparency?', 'What is a monad?'],
  },

  {
    id: 'js-weakref-finalizationregistry',
    category: 'javascript',
    type: 'theory',
    question: 'What are WeakRef and FinalizationRegistry?',
    difficulty: 'advanced',
    tags: ['WeakRef', 'FinalizationRegistry', 'memory', 'es2021'],
    shortAnswer: 'WeakRef holds a weak reference to an object — it can be garbage-collected even while the reference exists. FinalizationRegistry runs a callback when a weakly-referenced object is GC\'d. Both are for advanced memory management.',
    detailedExplanation: 'WeakRef is the individual counterpart to WeakMap — a direct weak reference to an object. Call .deref() to get the object; returns undefined if GC\'d. FinalizationRegistry lets you register cleanup callbacks that fire when objects are collected. These are low-level tools — use only when you genuinely need to track object lifetimes. The GC timing is non-deterministic, so code must handle undefined deref() gracefully.',
    example: {
      code: `// WeakRef — cache that doesn't prevent GC
class Cache {
  #store = new Map();

  set(key, value) {
    this.#store.set(key, new WeakRef(value));
  }

  get(key) {
    const ref = this.#store.get(key);
    if (!ref) return undefined;
    const value = ref.deref(); // undefined if GC'd
    if (!value) {
      this.#store.delete(key); // Clean up dead entry
      return undefined;
    }
    return value;
  }
}

// FinalizationRegistry — cleanup when object is GC'd
const registry = new FinalizationRegistry((key) => {
  console.log(\`Object with key "\${key}" was garbage collected\`);
  // Clean up associated resources
});

let obj = { data: 'important' };
registry.register(obj, 'my-object-key');

obj = null; // obj can now be GC'd
// At some future point: "Object with key 'my-object-key' was garbage collected"

// Practical: file handle cleanup
const fileRegistry = new FinalizationRegistry((handle) => {
  handle.close(); // Close when no more references
});

function openFile(path) {
  const file = new FileHandle(path);
  fileRegistry.register(file, file);
  return file;
}`,
      language: 'javascript',
    },
    interviewAnswer: 'WeakRef solves a specific problem — you want to cache something but not prevent it from being GC\'d if memory is tight. The GC decides when to collect, so deref() might return undefined at any time. FinalizationRegistry handles cleanup for external resources like file handles or native memory. These are advanced tools — WeakMap covers most caching use cases and is simpler.',
    commonMistakes: [
      'Using WeakRef thinking it guarantees GC (it\'s up to the engine)',
      'Relying on FinalizationRegistry for critical cleanup (timing is non-deterministic)',
    ],
    realWorldUse: 'Advanced caching, tracking object lifetimes, bridging to native resources.',
    followUpQuestions: ['When would you use WeakRef instead of WeakMap?', 'Why is FinalizationRegistry timing non-deterministic?'],
  },

  {
    id: 'js-error-types',
    category: 'javascript',
    type: 'theory',
    question: 'What are the built-in Error types in JavaScript and when does each occur?',
    difficulty: 'beginner',
    tags: ['errors', 'exceptions', 'debugging'],
    shortAnswer: 'Built-in types: Error (base), TypeError (wrong type), ReferenceError (undefined variable), SyntaxError (invalid syntax), RangeError (value out of range), URIError, EvalError. Always use instanceof to distinguish and create custom subclasses for domain errors.',
    detailedExplanation: 'Each built-in error type signals a specific problem. TypeError: calling non-function, accessing property of null/undefined. ReferenceError: using undeclared variable. RangeError: array length < 0, too many recursion levels. SyntaxError: JSON.parse invalid string, eval invalid code. URIError: malformed URI. Subclassing Error lets you create domain-specific errors with instanceof checking.',
    example: {
      code: `// Built-in error types
null.property;          // TypeError: Cannot read properties of null
undeclaredVar;          // ReferenceError: undeclaredVar is not defined
JSON.parse('{bad}');    // SyntaxError: Unexpected token
new Array(-1);          // RangeError: Invalid array length
decodeURI('%');         // URIError: URI malformed

// Custom error hierarchy
class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.name = this.constructor.name; // 'AppError'
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    // Capture stack trace (V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(\`\${resource} not found\`, 404, 'NOT_FOUND');
  }
}

class ValidationError extends AppError {
  constructor(field, message) {
    super(message, 422, 'VALIDATION_ERROR');
    this.field = field;
  }
}

// Distinguish errors by type
try {
  const user = await getUser(id);
} catch (err) {
  if (err instanceof NotFoundError) {
    res.status(404).json({ error: err.message });
  } else if (err instanceof ValidationError) {
    res.status(422).json({ field: err.field, error: err.message });
  } else if (err instanceof TypeError) {
    // Programming error — log and rethrow
    logger.error('Unexpected TypeError:', err);
    throw err;
  } else {
    throw err; // Unknown — let global handler catch it
  }
}`,
      language: 'javascript',
    },
    interviewAnswer: 'Knowing error types helps write better catch blocks. I check instanceof to handle errors differently — NotFoundError gets a 404 response, ValidationError gets 422 with field details, unexpected TypeErrors get logged and re-thrown. Custom error classes with isOperational: true distinguish expected errors (user input wrong) from bugs (null dereference). The global error handler shows user-friendly messages for operational errors and generic ones for bugs.',
    commonMistakes: [
      'Catching all errors the same way (losing error type info)',
      'Not setting this.name in custom error constructors',
      'Swallowing errors with empty catch blocks',
    ],
    realWorldUse: 'Express error middleware, React Error Boundaries, CLI tools with clear error messages.',
    followUpQuestions: ['How do you handle async errors that aren\'t caught?', 'What is the difference between operational and programmer errors?'],
  },

  {
    id: 'js-performance-optimization',
    category: 'javascript',
    type: 'theory',
    question: 'What are common JavaScript performance optimizations?',
    difficulty: 'intermediate',
    tags: ['performance', 'optimization', 'profiling'],
    shortAnswer: 'Key optimizations: avoid layout thrashing, use requestAnimationFrame for animations, debounce/throttle events, use DocumentFragment for batch DOM updates, avoid memory leaks, use Web Workers for CPU tasks, profile before optimizing.',
    detailedExplanation: 'Profile first with Chrome DevTools Performance tab. Common issues: layout thrashing (interleaved read/write), forced synchronous layout, large JavaScript bundles, memory leaks from detached DOM nodes or forgotten event listeners. V8 optimizations: consistent object shapes (monomorphic), avoid delete on objects, use typed arrays for numeric data. requestIdleCallback for non-urgent tasks. requestAnimationFrame for visual updates.',
    example: {
      code: `// Layout thrashing — expensive pattern
// ❌ Read-write interleave causes multiple reflows
elements.forEach(el => {
  el.style.width = el.offsetWidth + 10 + 'px'; // read then write
});

// ✅ Batch reads, then writes
const widths = elements.map(el => el.offsetWidth); // all reads
elements.forEach((el, i) => {
  el.style.width = widths[i] + 10 + 'px'; // all writes
});

// requestAnimationFrame for smooth animations
function animate() {
  element.style.transform = \`translateX(\${x++}px)\`;
  if (x < 300) requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// Memory leak from forgotten listener
class Component {
  constructor() {
    this.handler = this.onClick.bind(this);
    document.addEventListener('click', this.handler);
  }
  onClick() { /* ... */ }
  destroy() {
    document.removeEventListener('click', this.handler); // cleanup!
  }
}

// requestIdleCallback for non-urgent work
requestIdleCallback(() => {
  // Analytics, telemetry, prefetching
  sendAnalytics(pendingEvents);
}, { timeout: 2000 }); // fallback after 2s

// Avoid creating objects in hot paths
// ❌ Creates new array every call
function getItems() { return [...this.items]; }

// ✅ Return reference or use generators
function* iterItems() { yield* this.items; }

// Use profiler
console.time('operation');
expensiveOperation();
console.timeEnd('operation');
// Or: performance.mark / measure`,
      language: 'javascript',
    },
    interviewAnswer: 'I always profile before optimizing — the bottleneck is rarely where I think it is. Chrome DevTools shows long tasks on the main thread and memory leaks over time. The most impactful fixes: avoid layout thrashing (batch DOM reads before writes), debounce expensive event handlers, and remove event listeners when components unmount. For CPU-heavy work, Web Workers keep the UI responsive.',
    commonMistakes: [
      'Optimizing without profiling (premature optimization)',
      'Forgetting to clean up event listeners (memory leaks)',
      'Animating layout properties instead of transforms',
    ],
    realWorldUse: 'Any production app that needs 60fps animations, smooth scrolling, or fast search.',
    followUpQuestions: ['What is layout thrashing?', 'How do you profile JavaScript performance in Chrome?'],
  },

  {
    id: 'js-immutability-patterns',
    category: 'javascript',
    type: 'theory',
    question: 'What are immutability patterns in JavaScript and why do they matter?',
    difficulty: 'intermediate',
    tags: ['immutability', 'state-management', 'functional'],
    shortAnswer: 'Immutability means never modifying existing data — always create new values. Enables change detection by reference equality, prevents bugs from shared state, makes state history possible (undo/redo). Use spread, Object.assign, structuredClone, or Immer.',
    detailedExplanation: 'Mutable state is hard to track — you don\'t know who changed what. Immutability makes changes explicit: new object = something changed. React and Redux rely on reference equality (===) for change detection — if you mutate instead of creating new objects, renders don\'t trigger. Immer uses Proxy to let you write mutating-style code that produces immutable results. structuredClone() provides deep cloning natively.',
    example: {
      code: `// ❌ Mutable — React won't re-render
const [user, setUser] = useState({ name: 'Alex', age: 25 });
user.age = 26; // Direct mutation!
setUser(user); // Same reference — React sees no change

// ✅ Immutable — new object triggers re-render
setUser(prev => ({ ...prev, age: 26 }));

// Nested update — must copy all levels
const [config, setConfig] = useState({
  theme: { color: 'blue', size: 'large' },
  language: 'en'
});

// ❌ Only shallow copy — theme still mutated
setConfig(prev => ({ ...prev, theme: { ...prev.theme, color: 'red' } }));
// Wait — that IS correct for one level of nesting

// Deep nesting — use Immer
import produce from 'immer';
const nextState = produce(state, draft => {
  draft.user.address.city = 'NYC'; // Write mutating style
  draft.items.push({ id: 4, name: 'New' });
  delete draft.temporaryData;
}); // Returns new immutable state

// Array immutability
const arr = [1, 2, 3, 4, 5];
const added = [...arr, 6];           // add
const removed = arr.filter(x => x !== 3); // remove
const updated = arr.map(x => x === 2 ? 99 : x); // update

// Object.freeze — shallow freeze
const config = Object.freeze({ host: 'localhost', port: 3000 });
config.port = 5000; // Silently fails (throws in strict mode)
config.nested = {}; // Also fails

// Deep freeze
function deepFreeze(obj) {
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      deepFreeze(obj[key]);
    }
  });
  return Object.freeze(obj);
}`,
      language: 'javascript',
    },
    interviewAnswer: 'Immutability is fundamental to React and Redux. When I spread instead of mutating, React can do a fast reference equality check to decide if a re-render is needed. Immer is my favourite tool for complex state updates — I write mutations naturally and it produces an immutable result. The mental model shift is from "how do I change this?" to "what new value do I want?"',
    commonMistakes: [
      'Mutating state directly in React (breaks change detection)',
      'Thinking spread creates a deep copy (it\'s shallow)',
      'Using Object.freeze and expecting deep immutability',
    ],
    realWorldUse: 'React state updates, Redux reducers, undo/redo systems, time-travel debugging.',
    followUpQuestions: ['How does Immer work under the hood?', 'What is structural sharing in immutable data structures?'],
  },
];
