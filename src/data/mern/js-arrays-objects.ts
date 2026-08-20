import type { MernTopic } from './javascript-topics';

export const jsArrayObjectTopics: MernTopic[] = [
  {
    id: 'js-arrays',
    title: 'Arrays — Complete Guide',
    slug: 'arrays',
    subject: 'javascript',
    difficulty: 'beginner',
    readingTime: 18,
    description: 'Master JavaScript arrays — creation, methods, iteration, destructuring, and the powerful array HOFs used daily in React/Node.',
    prevTopic: 'functions',
    nextTopic: 'objects',
    sections: [
      {
        type: 'intro',
        content: 'Arrays are ordered lists of values. In JavaScript, arrays can hold any mix of types — numbers, strings, objects, even other arrays. Arrays are used everywhere in MERN development: lists of users, posts, products, API responses, React state — all use arrays.'
      },
      {
        type: 'heading', content: 'Creating Arrays'
      },
      {
        type: 'example',
        title: 'Array creation — all the ways',
        code: `// Array literal — ALWAYS use this
const fruits = ["apple", "banana", "cherry"];
const numbers = [1, 2, 3, 4, 5];
const mixed = [1, "hello", true, null, { id: 1 }];
const empty = [];

// new Array() — avoid unless needed
const arr = new Array(3);   // [undefined, undefined, undefined]
const arr2 = new Array(1, 2, 3); // [1, 2, 3]

// Array.from() — convert iterables/array-like objects
const fromStr = Array.from("hello");        // ["h","e","l","l","o"]
const fromSet = Array.from(new Set([1,2,2,3])); // [1,2,3]
const range = Array.from({length: 5}, (_, i) => i + 1); // [1,2,3,4,5]

// Array.of()
const nums = Array.of(1, 2, 3); // [1, 2, 3]

console.log(fruits.length); // 3
console.log(fruits[0]);     // "apple"
console.log(fruits[fruits.length - 1]); // "cherry" (last item)`,
        language: 'javascript'
      },
      {
        type: 'heading', content: 'Adding and Removing Elements'
      },
      {
        type: 'example',
        title: 'push, pop, shift, unshift, splice',
        code: `const arr = [1, 2, 3, 4, 5];

// Add to END
arr.push(6);          // [1,2,3,4,5,6]
arr.push(7, 8);       // [1,2,3,4,5,6,7,8]

// Remove from END — returns removed item
const last = arr.pop(); // last = 8, arr = [1,2,3,4,5,6,7]

// Add to START
arr.unshift(0);       // [0,1,2,3,4,5,6,7]

// Remove from START — returns removed item
const first = arr.shift(); // first = 0, arr = [1,2,3,4,5,6,7]

// splice(startIndex, deleteCount, ...itemsToAdd)
arr.splice(2, 1);          // remove 1 item at index 2: [1,2,4,5,6,7]
arr.splice(2, 0, 3);       // insert 3 at index 2: [1,2,3,4,5,6,7]
arr.splice(1, 2, 10, 20);  // replace 2 items at index 1: [1,10,20,4,5,6,7]

console.log(arr);`,
        language: 'javascript'
      },
      {
        type: 'heading', content: 'The Big 5 Array Methods (Used Daily in MERN)'
      },
      {
        type: 'example',
        title: 'map — transform every item, returns new array',
        code: `const users = [
  { id: 1, name: "Alex", age: 25, active: true },
  { id: 2, name: "Jordan", age: 30, active: false },
  { id: 3, name: "Sam", age: 22, active: true }
];

// map — transform each item, always returns same-length array
const names = users.map(user => user.name);
// ["Alex", "Jordan", "Sam"]

const ages = users.map(user => user.age);
// [25, 30, 22]

const userCards = users.map(user => ({
  ...user,
  displayName: user.name.toUpperCase(),
  ageGroup: user.age < 25 ? "young" : "adult"
}));

// In React, this is how you render lists:
// users.map(user => <UserCard key={user.id} user={user} />)

console.log(names);
console.log(userCards);`,
        language: 'javascript',
        output: '["Alex", "Jordan", "Sam"]'
      },
      {
        type: 'example',
        title: 'filter — keep items that pass a test',
        code: `const products = [
  { id: 1, name: "Laptop", price: 999, inStock: true },
  { id: 2, name: "Phone", price: 699, inStock: false },
  { id: 3, name: "Tablet", price: 499, inStock: true },
  { id: 4, name: "Monitor", price: 399, inStock: true },
  { id: 5, name: "Keyboard", price: 99, inStock: false }
];

// filter — returns NEW array with items where callback returns true
const inStock = products.filter(p => p.inStock);
// [Laptop, Tablet, Monitor]

const affordable = products.filter(p => p.price < 500);
// [Tablet, Monitor, Keyboard]

const inStockAndAffordable = products.filter(p => p.inStock && p.price < 500);
// [Tablet, Monitor]

// Combine filter + map (very common in React!)
const inStockNames = products
  .filter(p => p.inStock)
  .map(p => p.name);
// ["Laptop", "Tablet", "Monitor"]

console.log(inStockNames);`,
        language: 'javascript'
      },
      {
        type: 'example',
        title: 'reduce — accumulate array to single value',
        code: `const numbers = [1, 2, 3, 4, 5];

// reduce(callback, initialValue)
// callback receives (accumulator, currentValue)
const sum = numbers.reduce((acc, num) => acc + num, 0);
// 0 + 1 = 1, 1 + 2 = 3, 3 + 3 = 6, 6 + 4 = 10, 10 + 5 = 15
console.log(sum); // 15

const product = numbers.reduce((acc, num) => acc * num, 1);
console.log(product); // 120

// Real-world: total price of cart
const cart = [
  { name: "Book", price: 15, qty: 2 },
  { name: "Pen", price: 2, qty: 5 },
  { name: "Bag", price: 40, qty: 1 }
];

const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
console.log("Total: $" + total); // Total: $80

// Group by category
const people = [
  { name: "Alex", role: "admin" },
  { name: "Bob", role: "user" },
  { name: "Carol", role: "admin" },
  { name: "Dave", role: "user" }
];

const grouped = people.reduce((acc, person) => {
  const role = person.role;
  if (!acc[role]) acc[role] = [];
  acc[role].push(person.name);
  return acc;
}, {});

console.log(grouped);
// { admin: ["Alex", "Carol"], user: ["Bob", "Dave"] }`,
        language: 'javascript'
      },
      {
        type: 'example',
        title: 'find and findIndex — locate items',
        code: `const users = [
  { id: 1, name: "Alex", email: "alex@example.com" },
  { id: 2, name: "Jordan", email: "jordan@example.com" },
  { id: 3, name: "Sam", email: "sam@example.com" }
];

// find — returns the FIRST matching item (or undefined)
const user = users.find(u => u.id === 2);
console.log(user); // { id: 2, name: "Jordan", ... }

const notFound = users.find(u => u.id === 99);
console.log(notFound); // undefined

// findIndex — returns the INDEX of first match (or -1)
const index = users.findIndex(u => u.name === "Sam");
console.log(index); // 2

// some — true if AT LEAST ONE passes
const hasAdmin = users.some(u => u.name === "Alex");
console.log(hasAdmin); // true

// every — true if ALL pass
const allHaveEmail = users.every(u => u.email);
console.log(allHaveEmail); // true

// includes — simple value check
const nums = [1, 2, 3, 4, 5];
console.log(nums.includes(3)); // true
console.log(nums.includes(9)); // false`,
        language: 'javascript'
      },
      {
        type: 'example',
        title: 'sort and reverse',
        code: `// Sort numbers — requires comparator!
const nums = [10, 1, 5, 8, 3];
nums.sort((a, b) => a - b);   // ascending: [1, 3, 5, 8, 10]
nums.sort((a, b) => b - a);   // descending: [10, 8, 5, 3, 1]

// Sort strings
const fruits = ["banana", "apple", "cherry", "date"];
fruits.sort(); // alphabetical: ["apple", "banana", "cherry", "date"]
fruits.sort((a, b) => b.localeCompare(a)); // reverse alpha

// Sort objects by property
const people = [
  { name: "Charlie", age: 30 },
  { name: "Alice", age: 25 },
  { name: "Bob", age: 35 }
];

people.sort((a, b) => a.age - b.age); // sort by age ascending
people.sort((a, b) => a.name.localeCompare(b.name)); // sort by name

// IMPORTANT: sort mutates the original array!
// To sort without mutating:
const sorted = [...people].sort((a, b) => a.age - b.age);

// reverse
const arr = [1, 2, 3, 4, 5];
arr.reverse(); // [5, 4, 3, 2, 1] — mutates!

// Non-mutating reverse (ES2023)
const reversed = arr.toReversed(); // new array, original unchanged`,
        language: 'javascript'
      },
      {
        type: 'example',
        title: 'Array destructuring and spread',
        code: `// Destructuring — extract values into variables
const [first, second, third] = [10, 20, 30];
console.log(first, second, third); // 10 20 30

// Skip items with commas
const [a, , c] = [1, 2, 3];
console.log(a, c); // 1 3

// Default values
const [x = 0, y = 0, z = 0] = [1, 2];
console.log(x, y, z); // 1 2 0

// Rest in destructuring
const [head, ...tail] = [1, 2, 3, 4, 5];
console.log(head); // 1
console.log(tail); // [2, 3, 4, 5]

// Swap variables without temp variable!
let foo = 1, bar = 2;
[foo, bar] = [bar, foo];
console.log(foo, bar); // 2 1

// Spread to clone arrays
const original = [1, 2, 3];
const copy = [...original]; // new array, not a reference!
const extended = [...original, 4, 5, 6]; // [1,2,3,4,5,6]

// Flatten nested arrays
const nested = [1, [2, 3], [4, [5, 6]]];
console.log(nested.flat());     // [1, 2, 3, 4, [5, 6]] — 1 level
console.log(nested.flat(2));    // [1, 2, 3, 4, 5, 6] — 2 levels
console.log(nested.flat(Infinity)); // fully flattened`,
        language: 'javascript'
      },
      {
        type: 'tryit',
        title: 'Try: Array Methods Live',
        html: '<div id="app">\n  <h2>Array Methods Explorer</h2>\n  <div id="original"></div>\n  <div class="btns">\n    <button onclick="doMap()">map() — Double</button>\n    <button onclick="doFilter()">filter() — Even only</button>\n    <button onclick="doReduce()">reduce() — Sum</button>\n    <button onclick="doFind()">find() — First > 5</button>\n    <button onclick="doSort()">sort() — Ascending</button>\n  </div>\n  <div id="result"></div>\n</div>',
        css: '#app{font-family:sans-serif;padding:20px;max-width:500px;}\n#original{background:#f1f5f9;padding:12px;border-radius:8px;margin-bottom:12px;font-family:monospace;}\n.btns{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px;}\nbutton{padding:7px 14px;background:#2563eb;color:white;border:none;border-radius:6px;cursor:pointer;font-size:13px;}\nbutton:hover{background:#1d4ed8;}\n#result{background:#f0fdf4;border:1px solid #86efac;padding:16px;border-radius:8px;font-family:monospace;min-height:48px;}',
        js: 'const nums = [3, 1, 7, 2, 8, 4, 6, 5, 9, 10];\ndocument.getElementById("original").textContent = "Original: [" + nums.join(", ") + "]";\n\nfunction show(label, result) {\n  document.getElementById("result").innerHTML =\n    "<strong>" + label + ":</strong><br>[" + (Array.isArray(result) ? result.join(", ") : result) + "]";\n}\n\nfunction doMap() { show("map() → double each", nums.map(n => n * 2)); }\nfunction doFilter() { show("filter() → even only", nums.filter(n => n % 2 === 0)); }\nfunction doReduce() { show("reduce() → sum", [nums.reduce((a,b) => a+b, 0)]); }\nfunction doFind() { show("find() → first > 5", [nums.find(n => n > 5)]); }\nfunction doSort() { show("sort() → ascending", [...nums].sort((a,b) => a-b)); }',
        mode: 'full'
      }
    ],
    exercises: [
      {
        id: 'arr-1',
        question: 'Which method transforms every element in an array and returns a new array of the same length?',
        type: 'multiple-choice',
        options: ['filter()', 'map()', 'reduce()', 'forEach()'],
        correct: 1,
        explanation: 'map() creates a new array by applying a callback to every element. It always returns an array of the same length.'
      },
      {
        id: 'arr-2',
        question: 'What is the output of: [1,2,3,4,5].filter(n => n > 3).length',
        type: 'code-output',
        correct: '2',
        explanation: 'filter(n => n > 3) keeps only 4 and 5. The resulting array [4,5] has length 2.'
      },
      {
        id: 'arr-3',
        question: 'Which method would you use to find the total sum of an array of numbers?',
        type: 'multiple-choice',
        options: ['map()', 'filter()', 'reduce()', 'sum()'],
        correct: 2,
        explanation: 'reduce() accumulates values. nums.reduce((acc, n) => acc + n, 0) sums all numbers.'
      }
    ]
  },
  {
    id: 'js-objects',
    title: 'Objects — Complete Guide',
    slug: 'objects',
    subject: 'javascript',
    difficulty: 'beginner',
    readingTime: 16,
    description: 'Master JavaScript objects — creation, access, methods, destructuring, spread, Object methods, and JSON.',
    prevTopic: 'arrays',
    nextTopic: 'dom',
    sections: [
      {
        type: 'intro',
        content: 'Objects are the most important data structure in JavaScript. Everything in JavaScript is either a primitive or an object. Objects store key-value pairs. In MERN, objects are everywhere: MongoDB documents, API request/response bodies, React component props and state — all are objects.'
      },
      {
        type: 'heading', content: 'Creating Objects'
      },
      {
        type: 'example',
        title: 'Object creation — all methods',
        code: `// Object literal — use this always
const user = {
  id: 1,
  name: "Alex",
  email: "alex@example.com",
  age: 25,
  isActive: true,
  address: {               // nested object
    city: "New York",
    country: "USA"
  },
  hobbies: ["coding", "reading"] // array inside object
};

// Access properties
console.log(user.name);             // "Alex" (dot notation)
console.log(user["email"]);         // "alex@example.com" (bracket notation)
console.log(user.address.city);     // "New York" (nested)
console.log(user.hobbies[0]);       // "coding"

// Dynamic property access
const prop = "name";
console.log(user[prop]);            // "Alex"

// Modify properties
user.age = 26;
user.address.city = "San Francisco";

// Add new properties
user.phone = "+1234567890";

// Delete properties
delete user.phone;

// Check if property exists
console.log("name" in user);        // true
console.log("phone" in user);       // false
console.log(user.hasOwnProperty("name")); // true`,
        language: 'javascript'
      },
      {
        type: 'heading', content: 'Object Methods'
      },
      {
        type: 'example',
        title: 'Methods inside objects',
        code: `const person = {
  firstName: "Alex",
  lastName: "Smith",
  age: 25,

  // Method — function inside an object
  getFullName() {
    return \`\${this.firstName} \${this.lastName}\`;
  },

  greet() {
    return \`Hi! I'm \${this.firstName}, \${this.age} years old.\`;
  },

  birthday() {
    this.age++;
    return \`Happy birthday \${this.firstName}! Now \${this.age}.\`;
  }
};

console.log(person.getFullName()); // "Alex Smith"
console.log(person.greet());       // "Hi! I'm Alex, 25 years old."
console.log(person.birthday());    // "Happy birthday Alex! Now 26."
console.log(person.age);           // 26 (mutated)`,
        language: 'javascript'
      },
      {
        type: 'heading', content: 'Object Destructuring'
      },
      {
        type: 'example',
        title: 'Destructuring — extract properties easily',
        code: `const user = {
  id: 1,
  name: "Alex",
  email: "alex@example.com",
  age: 25,
  address: { city: "NYC", country: "USA" }
};

// Basic destructuring
const { name, email, age } = user;
console.log(name, email, age); // "Alex" "alex@example.com" 25

// Rename while destructuring
const { name: userName, email: userEmail } = user;
console.log(userName, userEmail); // "Alex" "alex@example.com"

// Default values
const { name: n, role = "user" } = user;
console.log(n, role); // "Alex" "user" (role from default)

// Nested destructuring
const { address: { city, country } } = user;
console.log(city, country); // "NYC" "USA"

// Rest in destructuring
const { id, name: nm, ...rest } = user;
console.log(id);   // 1
console.log(nm);   // "Alex"
console.log(rest); // { email, age, address }

// In function parameters — very common in React!
function renderUser({ name, email, age = 0 }) {
  return \`\${name} (\${email}) — Age: \${age}\`;
}
console.log(renderUser(user)); // "Alex (alex@example.com) — Age: 25"`,
        language: 'javascript'
      },
      {
        type: 'heading', content: 'Spread Operator and Object.assign'
      },
      {
        type: 'example',
        title: 'Object spread — clone and merge',
        code: `const defaults = { theme: "light", language: "en", notifications: true };
const userPrefs = { theme: "dark", fontSize: 16 };

// Merge objects — later properties override earlier ones
const config = { ...defaults, ...userPrefs };
console.log(config);
// { theme: "dark", language: "en", notifications: true, fontSize: 16 }

// Clone an object (shallow copy)
const original = { name: "Alex", score: 100 };
const copy = { ...original }; // new object!
copy.score = 200;
console.log(original.score); // 100 (original unchanged)

// Add/override properties
const updated = { ...original, score: 150, rank: 1 };

// IMPORTANT: spread is SHALLOW — nested objects are still references!
const user = { name: "Alex", address: { city: "NYC" } };
const clone = { ...user };
clone.address.city = "LA"; // THIS CHANGES THE ORIGINAL TOO!
console.log(user.address.city); // "LA" — shallow copy problem

// Deep clone — use structuredClone() or JSON trick
const deepClone = structuredClone(user); // ES2022 — best way
const deepClone2 = JSON.parse(JSON.stringify(user)); // old way

// Object.assign — same as spread but mutates first arg
const merged = Object.assign({}, defaults, userPrefs);
Object.assign(config, { newProp: "value" }); // add to existing`,
        language: 'javascript'
      },
      {
        type: 'heading', content: 'Object.keys, Object.values, Object.entries'
      },
      {
        type: 'example',
        title: 'Iterating over objects',
        code: `const scores = {
  Alice: 95,
  Bob: 87,
  Charlie: 92,
  Diana: 98
};

// Object.keys() — array of keys
const names = Object.keys(scores);
console.log(names); // ["Alice", "Bob", "Charlie", "Diana"]

// Object.values() — array of values
const points = Object.values(scores);
console.log(points); // [95, 87, 92, 98]
const average = points.reduce((a, b) => a + b) / points.length;
console.log("Average:", average); // 93

// Object.entries() — array of [key, value] pairs
const entries = Object.entries(scores);
entries.forEach(([name, score]) => {
  console.log(\`\${name}: \${score}\`);
});

// Convert object to array, sort, convert back
const sorted = Object.entries(scores)
  .sort(([, a], [, b]) => b - a) // sort by score descending
  .map(([name, score]) => \`\${name}: \${score}\`);
console.log(sorted);
// ["Diana: 98", "Alice: 95", "Charlie: 92", "Bob: 87"]

// Object.fromEntries() — array of entries back to object
const doubled = Object.fromEntries(
  Object.entries(scores).map(([k, v]) => [k, v * 2])
);
console.log(doubled); // { Alice: 190, Bob: 174, ... }`,
        language: 'javascript'
      },
      {
        type: 'example',
        title: 'Shorthand properties and computed keys',
        code: `// Shorthand properties (ES6)
const name = "Alex";
const age = 25;
const city = "NYC";

// Old way
const user1 = { name: name, age: age, city: city };

// Shorthand — when key === variable name
const user2 = { name, age, city }; // same result!

// Computed property names
const prop = "email";
const user3 = {
  name: "Alex",
  [prop]: "alex@example.com",     // key from variable
  [\`user_\${1 + 1}\`]: "value",    // computed expression
};
console.log(user3.email);      // "alex@example.com"
console.log(user3.user_2);     // "value"

// Shorthand methods
const calculator = {
  value: 0,
  add(n) { this.value += n; return this; }, // method chaining!
  subtract(n) { this.value -= n; return this; },
  multiply(n) { this.value *= n; return this; },
  result() { return this.value; }
};

const answer = calculator.add(10).multiply(3).subtract(5).result();
console.log(answer); // 25`,
        language: 'javascript'
      },
      {
        type: 'tryit',
        title: 'Try: Object Explorer',
        html: '<div id="app">\n  <h2>📦 Object Explorer</h2>\n  <div class="grid">\n    <div>\n      <label>Name:</label><input id="name" value="Alex"/>\n      <label>Age:</label><input id="age" type="number" value="25"/>\n      <label>City:</label><input id="city" value="New York"/>\n      <label>Role:</label>\n      <select id="role"><option>user</option><option>admin</option><option>editor</option></select>\n      <button onclick="createObj()">Create Object</button>\n    </div>\n    <div id="output"></div>\n  </div>\n</div>',
        css: '#app{font-family:sans-serif;padding:20px;max-width:600px;}\n.grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;}\nlabel{display:block;font-size:12px;color:#64748b;margin-top:8px;font-weight:600;}\ninput,select{width:100%;padding:7px 10px;border:1px solid #ddd;border-radius:6px;font-size:13px;margin-top:2px;}\nbutton{width:100%;margin-top:12px;padding:9px;background:#2563eb;color:white;border:none;border-radius:6px;cursor:pointer;font-weight:600;}\n#output{background:#0d1117;color:#e6edf3;padding:16px;border-radius:8px;font-family:monospace;font-size:12px;white-space:pre;overflow:auto;}',
        js: 'function createObj() {\n  const user = {\n    name: document.getElementById("name").value,\n    age: parseInt(document.getElementById("age").value),\n    city: document.getElementById("city").value,\n    role: document.getElementById("role").value,\n    createdAt: new Date().toISOString(),\n    isActive: true\n  };\n  \n  // Show the object\n  let out = "// Your Object:\\n";\n  out += JSON.stringify(user, null, 2) + "\\n\\n";\n  \n  // Demonstrate Object methods\n  out += "// Object.keys():\\n" + JSON.stringify(Object.keys(user)) + "\\n\\n";\n  out += "// Object.values():\\n" + JSON.stringify(Object.values(user)) + "\\n\\n";\n  \n  // Spread\n  const updated = { ...user, age: user.age + 1, yearJoined: 2026 };\n  out += "// Spread (age+1, add yearJoined):\\n" + JSON.stringify(updated, null, 2);\n  \n  document.getElementById("output").textContent = out;\n}',
        mode: 'full'
      }
    ],
    exercises: [
      {
        id: 'obj-1',
        question: 'What is the shorthand for: const obj = { name: name, age: age }',
        type: 'multiple-choice',
        options: ['const obj = { name, age }', 'const obj = (name, age)', 'const obj = name:age', 'const { name, age } = obj'],
        correct: 0,
        explanation: 'ES6 shorthand property notation: when the key and variable name are the same, you can write { name, age } instead of { name: name, age: age }.'
      }
    ]
  }
];
