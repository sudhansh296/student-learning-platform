import type { JSLesson } from '../js-curriculum';

export const jsEs6Lesson: JSLesson = {
  id:'js-es6',title:'ES6+ Modern Features',slug:'es6-features',
  chapter:'es6',order:16,difficulty:'intermediate',readingTime:14,
  description:'Master essential ES6+ features - destructuring, spread/rest, optional chaining, nullish coalescing, Map, Set, Symbol, WeakMap, and more.',
  sections:[
    {type:'text',content:'ES6 (2015) was the biggest upgrade to JavaScript ever. Every year since, new features have been added. This lesson covers the modern features used daily in professional JavaScript, React, and Node.js development.'},
    {type:'heading',content:'Destructuring - Arrays and Objects'},
    {type:'example',title:'Extract values cleanly',content:'Destructuring is one of the most-used ES6 features. Instead of writing const name = user.name; const age = user.age; on separate lines, you write const { name, age } = user; in one. You can rename variables, provide defaults, and even destructure nested objects. Function parameter destructuring is used constantly in React - component props are always destructured.',language:'javascript',code:`// Array destructuring
const [a, b, c] = [1, 2, 3];
const [x, , z] = [10, 20, 30];  // skip middle
const [first, ...rest] = [1,2,3,4,5]; // rest: [2,3,4,5]
const [p=0, q=0] = [5]; // p=5, q=0 (default)

// Swap without temp variable
let m=1, n=2;
[m, n] = [n, m]; // m=2, n=1

// Object destructuring
const user = { id:1, name:"Alex", email:"alex@example.com", age:25 };
const { name, email } = user;
const { name: userName, age: userAge } = user;  // rename
const { id, name:nm, ...rest } = user;           // rest spread
const { missing = "default" } = user;            // default value

// Nested destructuring
const { address: { city } } = { address: { city:"NYC" } };

// Function param destructuring (extremely common in React)
function renderCard({ title, author, date = "Unknown" }) {
  return \`\${title} by \${author} (\${date})\`;
}

// Array of objects
const users = [{ name:"Alice", score:95 }, { name:"Bob", score:87 }];
const [[first2]] = users; // doesn't work - just showing that it's possible
for (const { name, score } of users) {
  console.log(\`\${name}: \${score}\`);
}`},
    {type:'heading',content:'Spread and Rest Operators'},
    {type:'example',title:'... does two things depending on context',content:'The three dots (...) do two opposite things based on where you use them. As SPREAD (in arrays, objects, function calls) it expands - it unpacks an array or object into individual elements. As REST (in function parameters, destructuring) it collects - it gathers remaining items into an array. Spread is how you clone and merge objects in React state updates without mutating the original.',language:'javascript',code:`// SPREAD - expands arrays/objects
// In array literals
const arr1 = [1,2,3], arr2 = [4,5,6];
const merged = [...arr1, ...arr2];         // [1,2,3,4,5,6]
const copy   = [...arr1];                  // shallow copy

// In function calls
Math.max(...[1,5,3,9]);                    // 9
console.log(...["a","b","c"]);             // a b c

// In object literals
const defaults = { theme:"light", lang:"en" };
const prefs    = { theme:"dark" };
const config   = { ...defaults, ...prefs }; // { theme:"dark", lang:"en" }

// REST - collects remaining values into array
function sum(...nums) {
  return nums.reduce((a,b) => a+b, 0);
}
sum(1,2,3,4,5); // 15

function first(a, b, ...rest) {
  console.log(a, b, rest);
}
first(1,2,3,4,5); // 1 2 [3,4,5]`},
    {type:'heading',content:'Map and Set'},
    {type:'example',title:'Map - better than objects for key-value pairs',content:'A Map is like an object, but with superpowers: any value can be a key (including objects and functions), it remembers insertion order, and it has a .size property. Map is better than a plain object when keys are dynamic, not known in advance, or when you need to count things. Iterating a Map with for...of gives you [key, value] pairs directly.',language:'javascript',code:`// Map - key-value pairs where keys can be ANY type
const map = new Map();
map.set("name", "Alex");
map.set(1, "one");
map.set(true, "boolean key");
map.set({id:1}, "object key"); // objects as keys!

map.get("name");    // "Alex"
map.has("name");    // true
map.size;           // 4
map.delete("name"); // removes
map.clear();        // removes all

// Iterate Map
const scores = new Map([["Alice",95],["Bob",87],["Carol",92]]);
for (const [name, score] of scores) {
  console.log(name, score);
}
scores.forEach((score, name) => console.log(name, score));

// Convert to/from array
Array.from(scores.keys());          // ["Alice","Bob","Carol"]
Array.from(scores.values());        // [95, 87, 92]
Array.from(scores.entries());       // [["Alice",95],["Bob",87],...]

// Map vs Object:
// Map: any key type, ordered, has size, no prototype issues
// Object: string/symbol keys only, slightly faster for reads`},
    {type:'example',title:'Set - unique values only',content:'A Set stores unique values - duplicates are automatically ignored when you add them. The most common use is removing duplicates from an array: [...new Set(arr)] gives you a new array with all duplicates removed. Sets also support set math operations like union, intersection, and difference, which you can build using spread and filter.',language:'javascript',code:`// Set - stores unique values (no duplicates)
const set = new Set([1, 2, 2, 3, 3, 3, 4]);
console.log(set); // Set {1, 2, 3, 4}
set.size;         // 4

set.add(5);
set.has(3);       // true
set.delete(3);
set.clear();

// Most common use: REMOVE DUPLICATES from array
const nums = [1,2,2,3,3,4,1,5];
const unique = [...new Set(nums)]; // [1,2,3,4,5]

// Remove duplicate strings
const tags = ["js","css","js","html","css"];
const uniqueTags = [...new Set(tags)]; // ["js","css","html"]

// Set iteration
const fruits = new Set(["apple","banana","cherry"]);
for (const fruit of fruits) console.log(fruit);
fruits.forEach(fruit => console.log(fruit));

// Convert to/from array
Array.from(fruits); // ["apple","banana","cherry"]

// Set operations (union, intersection, difference)
const a = new Set([1,2,3,4]);
const b = new Set([3,4,5,6]);
const union        = new Set([...a,...b]);    // {1,2,3,4,5,6}
const intersection = new Set([...a].filter(x=>b.has(x))); // {3,4}
const difference   = new Set([...a].filter(x=>!b.has(x)));// {1,2}`},
    {type:'heading',content:'Optional Chaining and Nullish Coalescing'},
    {type:'example',title:'Safe navigation and default values',content:'Optional chaining (?.) lets you safely access deeply nested properties without crashing. Instead of checking if user && user.profile && user.profile.address before reading city, you just write user?.profile?.address?.city - if anything in the chain is null or undefined, it returns undefined instead of throwing. The nullish coalescing operator (??) provides a default value only for null/undefined - unlike ||, it does NOT treat 0 or empty string as "missing".',language:'javascript',code:`// Optional chaining (?.) - safe property access
const user = { profile: { name:"Alex", address: null } };

// Without optional chaining - crashes if null
// const city = user.profile.address.city; // TypeError!

// With optional chaining - returns undefined
const city    = user?.profile?.address?.city;   // undefined
const missing = user?.settings?.theme;          // undefined

// Works with methods
const result = arr?.find(x => x.id === 1);     // undefined if arr is null
const length = str?.trim().length;              // undefined if str is null

// Works with brackets (computed properties)
const first = users?.[0]?.name;

// Combine with nullish coalescing
const theme = user?.settings?.theme ?? "light";

// Nullish coalescing (??) - ONLY falls back for null/undefined
const score = 0;
score || 100;   // 100 - 0 is falsy (WRONG!)
score ?? 100;   // 0   - 0 is NOT null/undefined (CORRECT)

const name = "";
name || "Guest"; // "Guest" - "" is falsy
name ?? "Guest"; // ""      - "" is NOT null/undefined

// Logical assignment (ES2021)
let a = null;
a ??= "default"; // assign if null/undefined → "default"

let b = 0;
b ||= 100;       // assign if falsy → 100

let c = 5;
c &&= c * 2;     // assign if truthy → 10`},
    {type:'heading',content:'Symbols'},
    {type:'example',title:'Unique identifiers with Symbol',content:'Symbol() always creates a completely unique value - even two Symbols with the same description are not equal. This makes them perfect as unique object keys that will never accidentally conflict with other code. Well-known Symbols like Symbol.iterator let you make your own objects work with for...of loops and the spread operator - JavaScript uses these internally.',language:'javascript',code:`// Symbol - always unique, even with same description
const id1 = Symbol("id");
const id2 = Symbol("id");
id1 === id2; // false - always unique!

// Use as unique object keys (never accidentally overwritten)
const USER_ID = Symbol("userId");
const user = {
  name: "Alex",
  [USER_ID]: 42, // symbol key
};
user[USER_ID]; // 42
// Symbol keys don't appear in for...in, Object.keys(), JSON.stringify()

// Well-known symbols (used by JS internally)
class MyArray {
  [Symbol.iterator]() {
    let i = 0;
    const data = [1,2,3];
    return { next: () => i < data.length ? {value:data[i++],done:false} : {done:true} };
  }
}
for (const val of new MyArray()) console.log(val); // 1 2 3

// Symbol.toPrimitive - control type conversion
class Money {
  constructor(amount, currency) { this.amount=amount; this.currency=currency; }
  [Symbol.toPrimitive](hint) {
    if (hint === "number") return this.amount;
    if (hint === "string") return \`\${this.amount} \${this.currency}\`;
    return this.amount;
  }
}
const price = new Money(29.99, "USD");
console.log(\`Price: \${price}\`);  // "Price: 29.99 USD"
console.log(price + 10);          // 39.99`},
    {type:'tryit',title:'Try It: ES6+ Features',
     html:`<div id="app">
  <h2>ES6+ Features Demo</h2>
  <h3>Remove Duplicates (Set)</h3>
  <input id="dupeInput" value="1,2,2,3,3,4,1,5,js,css,js,html"/>
  <button onclick="removeDupes()">Remove Duplicates</button>
  <p id="dupeResult"></p>
  <h3>Object Destructuring</h3>
  <button onclick="demoDestruct()">Demo Destructuring</button>
  <pre id="destructResult"></pre>
  <h3>Optional Chaining</h3>
  <button onclick="demoChaining()">Demo Safe Access</button>
  <pre id="chainResult"></pre>
</div>`,
     css:`#app{font-family:system-ui,sans-serif;padding:20px;max-width:480px;}
h2{color:#1e1e1e;margin-bottom:16px;}h3{font-size:14px;font-weight:700;color:#374151;margin:16px 0 8px;}
input{width:100%;padding:9px 12px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:14px;outline:none;margin-bottom:8px;box-sizing:border-box;}
button{padding:8px 16px;background:#2563eb;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:13px;}
p,pre{margin:8px 0;font-size:13px;background:#f8fafc;border:1px solid #e2e8f0;padding:10px;border-radius:8px;font-family:monospace;white-space:pre-wrap;}`,
     js:`function removeDupes() {
  const input = document.getElementById('dupeInput').value;
  const items = input.split(',').map(s=>s.trim()).filter(Boolean);
  const unique = [...new Set(items)];
  document.getElementById('dupeResult').textContent =
    'Original (' + items.length + '): [' + items.join(', ') + ']\ ' +
    'Unique   (' + unique.length + '): [' + unique.join(', ') + ']';
}

function demoDestruct() {
  const config = { db: { host:'localhost', port:5432 }, app: { name:'Atlas', version:'2.0', port:3000 } };
  const { db: {host, port: dbPort}, app: {name, port: appPort, version='1.0'} } = config;
  const lines = [
    'const { db:{host,port:dbPort}, app:{name,port:appPort,version} } = config;',
    '',
    'host:    ' + host,
    'dbPort:  ' + dbPort,
    'name:    ' + name,
    'appPort: ' + appPort,
    'version: ' + version,
  ];
  document.getElementById('destructResult').textContent = lines.join('\ ');
}

function demoChaining() {
  const users = [
    { id:1, name:'Alice', profile:{ city:'NYC', scores:[95,87,92] } },
    { id:2, name:'Bob',   profile:null },
    null,
  ];
  const lines = users.map((u,i) => {
    const city  = u?.profile?.city ?? 'Unknown';
    const first = u?.profile?.scores?.[0] ?? 'N/A';
    const count = u?.profile?.scores?.length ?? 0;
    return \`users[\${i}]: name=\${u?.name??'null'}, city=\${city}, firstScore=\${first}, count=\${count}\`;
  });
  document.getElementById('chainResult').textContent = lines.join('\ ');
}`,mode:'full'},
  ],
  exercises:[{id:'es6-1',question:'What does [...new Set([1,2,2,3,3])] produce?',type:'code-output',correct:'[1,2,3]',explanation:'new Set([1,2,2,3,3]) creates a Set with unique values {1,2,3}. The spread [...] converts it back to an array [1,2,3]. This is the cleanest way to remove duplicates from an array.'}],
  quiz:[{id:'qes1',question:'What is the difference between ?? and || operators?',options:['They are identical','?? only falls back for null/undefined; || falls back for any falsy value (including 0 and "")','|| is newer than ??','?? is slower'],correct:1,explanation: '?? (nullish coalescing) only triggers the fallback for null or undefined. || triggers for ANY falsy value: 0, "", false, null, undefined, NaN. Use ?? when 0 or empty string are valid values.'}],
};
