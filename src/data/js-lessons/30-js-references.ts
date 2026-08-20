import type { JSLesson } from '../js-curriculum';
export const jsReferencesLesson: JSLesson = {
  id:'js-references',title:'JavaScript Quick Reference',slug:'js-references',chapter:'reference',order:31,difficulty:'beginner',readingTime:10,
  description:'Complete JavaScript quick reference — all built-in methods, operators, keywords, and common patterns in one place.',
  sections:[
    {type:'heading',content:'Array Methods Reference'},
    {type:'example',title:'Complete array methods',content:'This is your go-to cheat sheet for every array method. Mutating methods change the original array — push, pop, splice, sort, reverse. Non-mutating methods return a new array or value — map, filter, reduce, slice, find. As a rule: prefer non-mutating methods in React and functional code. Use the ES2023 toSorted(), toReversed(), and toSpliced() for guaranteed immutability.',language:'javascript',code:`// MUTATING (change original array)
arr.push(...items)          // add to end, returns new length
arr.pop()                   // remove from end, returns removed item
arr.unshift(...items)       // add to start, returns new length
arr.shift()                 // remove from start, returns removed item
arr.splice(start, del, ...add) // remove/insert at index
arr.sort((a,b) => a-b)      // sort in place (provide comparator!)
arr.reverse()               // reverse in place
arr.fill(value, start, end) // fill with value
arr.copyWithin(target, start)// copy part of array to itself

// NON-MUTATING (return new array / value)
arr.map(fn)                 // transform every element
arr.filter(fn)              // keep elements where fn returns true
arr.reduce(fn, init)        // accumulate to single value
arr.reduceRight(fn, init)   // reduce from right
arr.find(fn)                // first element where fn is true
arr.findIndex(fn)           // index of first match
arr.findLast(fn)            // last element where fn is true (ES2023)
arr.some(fn)                // true if ANY match
arr.every(fn)               // true if ALL match
arr.includes(value)         // true/false
arr.indexOf(value)          // first index or -1
arr.lastIndexOf(value)      // last index or -1
arr.flat(depth)             // flatten nested arrays
arr.flatMap(fn)             // map then flat(1)
arr.slice(start, end)       // extract portion
arr.concat(...arrs)         // merge arrays
arr.join(separator)         // to string
arr.forEach(fn)             // iterate (returns undefined)
arr.keys()                  // iterator of indices
arr.values()                // iterator of values
arr.entries()               // iterator of [index, value] pairs
arr.at(index)               // get element (supports negative)
arr.toSorted(fn)            // sorted copy (ES2023)
arr.toReversed()            // reversed copy (ES2023)
arr.toSpliced(start,del,...add) // spliced copy (ES2023)
arr.with(index, value)      // copy with one element replaced (ES2023)

// STATIC METHODS
Array.isArray(value)        // true/false
Array.from(iterable, mapFn) // create from iterable
Array.of(...values)         // create from values`},
    {type:'heading',content:'String Methods Reference'},
    {type:'example',title:'Complete string methods',content:'Strings in JavaScript are immutable — every method returns a NEW string, the original is never changed. The most-used methods are includes(), slice(), split(), replace()/replaceAll(), trim(), and padStart(). For searching and extracting with patterns, use match() and matchAll() with a regex. Remember: startsWith and endsWith accept a position argument for checking from a specific index.',language:'javascript',code:`str.length                  // character count
str[i] / str.at(i)         // access character (at supports negative)
str.charAt(i)              // character at index
str.charCodeAt(i)          // UTF-16 code at index
str.codePointAt(i)         // Unicode code point

// SEARCH
str.includes(search, pos)   // true/false
str.startsWith(str, pos)    // true/false
str.endsWith(str, len)      // true/false
str.indexOf(str, pos)       // first index or -1
str.lastIndexOf(str, pos)   // last index or -1
str.search(regex)           // index of first regex match or -1
str.match(regex)            // match array
str.matchAll(regex)         // iterator of all matches (g flag required)

// EXTRACT
str.slice(start, end)       // extract (negative ok)
str.substring(start, end)   // extract (no negative)
str.split(separator, limit) // string to array

// MODIFY (returns new string — strings are immutable)
str.replace(search, replacement)   // replace first
str.replaceAll(search, replacement) // replace all (ES2021)
str.toUpperCase()           // ALL CAPS
str.toLowerCase()           // all lower
str.trim()                  // remove whitespace from both ends
str.trimStart()             // remove from start
str.trimEnd()               // remove from end
str.padStart(len, fill)     // pad start to length
str.padEnd(len, fill)       // pad end to length
str.repeat(count)           // repeat string
str.normalize(form)         // Unicode normalization

// STATIC
String.fromCharCode(...codes)     // from UTF-16 codes
String.fromCodePoint(...points)   // from Unicode code points`},
    {type:'heading',content:'Object Methods Reference'},
    {type:'example',title:'Object static methods',content:'Object static methods are called on Object itself, not on instances. Object.keys/values/entries are the three you will use daily for looping objects. Object.assign() does a shallow copy — great for merging configs. Object.freeze() creates immutable objects. Object.create() is the low-level way to set up prototype chains manually. Object.defineProperty() gives you full control over property behavior.',language:'javascript',code:`// CREATION
Object.create(proto, descriptors)   // create with specific prototype
Object.assign(target, ...sources)   // copy properties (shallow)
Object.fromEntries(entries)         // from [key,value] pairs

// INSPECTION  
Object.keys(obj)                    // array of own enumerable keys
Object.values(obj)                  // array of own enumerable values
Object.entries(obj)                 // array of [key, value] pairs
Object.getOwnPropertyNames(obj)     // all own properties (including non-enumerable)
Object.getPrototypeOf(obj)          // prototype of obj
Object.is(a, b)                     // strict equality (handles NaN, -0)

// CONTROL
Object.freeze(obj)                  // prevent all changes
Object.seal(obj)                    // prevent add/delete (allow value changes)
Object.isFrozen(obj)                // true if frozen
Object.isSealed(obj)                // true if sealed
Object.preventExtensions(obj)       // prevent adding new properties

// PROPERTY DESCRIPTORS
Object.defineProperty(obj, key, descriptor)     // define with descriptor
Object.defineProperties(obj, descriptors)       // define multiple
Object.getOwnPropertyDescriptor(obj, key)       // get descriptor`},
    {type:'heading',content:'Promise Methods Reference'},
    {type:'example',title:'Promise static methods',content:'Promise.all() is for when ALL must succeed — fails immediately if any one fails. Promise.allSettled() is for when you want ALL results regardless of failure — returns an array with status for each. Promise.race() gives you the first one to finish (resolved or rejected). Promise.any() gives you the first one to succeed (ignores rejections until all fail). The timeout and retry patterns shown are used in every real application.',language:'javascript',code:`Promise.resolve(value)      // create resolved Promise
Promise.reject(reason)      // create rejected Promise

// Wait for ALL — rejects if any rejects
Promise.all([p1, p2, p3])   // → [v1, v2, v3] or first rejection

// Wait for ALL — never rejects, reports each status
Promise.allSettled([p1, p2]) // → [{status, value/reason}, ...]

// First settled wins (resolve or reject)
Promise.race([p1, p2])       // → first settled value/error

// First FULFILLED wins (ignores rejections)
Promise.any([p1, p2])        // → first fulfilled, or AggregateError

// Instance methods
promise.then(onFulfill, onReject)  // handle success and/or error
promise.catch(onReject)            // handle error
promise.finally(onFinally)         // runs always (cleanup)

// Common patterns
// Timeout
const timeout = (ms) => new Promise((_, reject) =>
  setTimeout(() => reject(new Error("Timeout")), ms));

const withTimeout = (promise, ms) =>
  Promise.race([promise, timeout(ms)]);

// Retry
async function retry(fn, times = 3) {
  for (let i = 0; i < times; i++) {
    try { return await fn(); }
    catch(e) { if (i === times-1) throw e; }
  }
}`},
    {type:'heading',content:'JavaScript Operators Quick Reference'},
    {type:'example',title:'All operators at a glance',content:'Always use === and !== (strict equality) over == and != — loose equality has unintuitive type coercion. The ?? operator only falls back for null/undefined, while || falls back for any falsy value including 0 and "". Optional chaining ?. prevents crashes from null/undefined property access. The logical assignment operators (&&=, ||=, ??=) are shorthand for conditional assignment.',language:'javascript',code:`// ARITHMETIC
+ - * / % **          // add, sub, mul, div, modulo, power
++ --                  // increment, decrement (prefix/postfix)

// ASSIGNMENT
= += -= *= /= %= **=   // assign, assign+operate
&&= ||= ??=             // logical assignment (ES2021)

// COMPARISON
=== !==                // strict equality (always use these)
== !=                  // loose equality (avoid)
< <= > >=              // less/greater than
in                     // "key" in obj → true/false
instanceof             // obj instanceof Class → true/false

// LOGICAL
&& ||  !              // AND, OR, NOT
??                     // nullish coalescing (null/undefined only)

// BITWISE
& | ^ ~ << >> >>>      // AND, OR, XOR, NOT, left shift, right shift

// OTHER
? :                    // ternary: condition ? true : false
?.                     // optional chaining: obj?.prop?.method()
...                    // spread (expand) / rest (collect)
typeof                 // returns type as string
void                   // evaluates expression, returns undefined
delete                 // remove property from object
new                    // create instance of class/function
,                      // comma operator (evaluate both, return last)

// DESTRUCTURING
const {a, b} = obj     // object destructuring
const [x, y] = arr     // array destructuring`},
    {type:'tryit',title:'Try It: Quick Reference Lookup',
     html:`<div id="app">
  <h2>JS Method Lookup</h2>
  <input id="search" placeholder="Search: map, filter, includes, keys, then..."/>
  <div id="results"></div>
</div>`,
     css:`#app{font-family:system-ui,sans-serif;padding:20px;max-width:500px;}
h2{color:#1e1e1e;margin-bottom:12px;}
input{width:100%;padding:10px 14px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:14px;outline:none;box-sizing:border-box;margin-bottom:12px;}
input:focus{border-color:#2563eb;}
.item{padding:10px 14px;background:white;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:6px;}
.item h4{font-size:13px;font-weight:700;color:#1e1e1e;margin:0 0 4px;}
.item code{font-size:12px;color:#2563eb;font-family:monospace;}
.item p{font-size:12px;color:#6b7280;margin:4px 0 0;}
.tag{font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;background:#eff6ff;color:#1d4ed8;}`,
     js:`const methods = [
  {name:'map',sig:'arr.map(fn)',desc:'Transform every element, returns new array',type:'Array'},
  {name:'filter',sig:'arr.filter(fn)',desc:'Keep elements where fn returns true',type:'Array'},
  {name:'reduce',sig:'arr.reduce(fn, init)',desc:'Accumulate to single value',type:'Array'},
  {name:'find',sig:'arr.find(fn)',desc:'First element matching condition',type:'Array'},
  {name:'forEach',sig:'arr.forEach(fn)',desc:'Iterate without return value',type:'Array'},
  {name:'includes',sig:'arr.includes(val)',desc:'Check if value exists — true/false',type:'Array'},
  {name:'flat',sig:'arr.flat(depth)',desc:'Flatten nested arrays',type:'Array'},
  {name:'slice',sig:'arr.slice(start, end)',desc:'Extract portion without mutating',type:'Array'},
  {name:'splice',sig:'arr.splice(start, del, ...add)',desc:'Remove/insert at position (mutates)',type:'Array'},
  {name:'sort',sig:'arr.sort((a,b) => a-b)',desc:'Sort in place — always provide comparator for numbers',type:'Array'},
  {name:'indexOf',sig:'str.indexOf(search)',desc:'First occurrence index or -1',type:'String'},
  {name:'slice',sig:'str.slice(start, end)',desc:'Extract substring',type:'String'},
  {name:'replace',sig:'str.replace(search, replacement)',desc:'Replace first occurrence',type:'String'},
  {name:'replaceAll',sig:'str.replaceAll(search, replacement)',desc:'Replace all occurrences',type:'String'},
  {name:'split',sig:'str.split(separator)',desc:'String to array',type:'String'},
  {name:'trim',sig:'str.trim()',desc:'Remove whitespace from both ends',type:'String'},
  {name:'padStart',sig:'str.padStart(len, fill)',desc:'Pad start to target length',type:'String'},
  {name:'includes',sig:'str.includes(search)',desc:'Check if substring exists',type:'String'},
  {name:'keys',sig:'Object.keys(obj)',desc:'Array of own enumerable property names',type:'Object'},
  {name:'values',sig:'Object.values(obj)',desc:'Array of own enumerable values',type:'Object'},
  {name:'entries',sig:'Object.entries(obj)',desc:'Array of [key, value] pairs',type:'Object'},
  {name:'assign',sig:'Object.assign(target, ...src)',desc:'Copy properties from sources to target',type:'Object'},
  {name:'freeze',sig:'Object.freeze(obj)',desc:'Make object immutable',type:'Object'},
  {name:'all',sig:'Promise.all([p1,p2])',desc:'Wait for all — fails fast if any rejects',type:'Promise'},
  {name:'allSettled',sig:'Promise.allSettled([p1,p2])',desc:'Wait for all — never rejects',type:'Promise'},
  {name:'race',sig:'Promise.race([p1,p2])',desc:'Resolve with first settled',type:'Promise'},
];

const input = document.getElementById('search');
const results = document.getElementById('results');

input.addEventListener('input', () => {
  const q = input.value.toLowerCase().trim();
  if (!q) { results.innerHTML = ''; return; }
  const matches = methods.filter(m =>
    m.name.includes(q) || m.sig.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q)
  );
  results.innerHTML = matches.slice(0,8).map(m => \`
    <div class="item">
      <h4>\${m.name} <span class="tag">\${m.type}</span></h4>
      <code>\${m.sig}</code>
      <p>\${m.desc}</p>
    </div>\`).join('') || '<p style="color:#9ca3af;font-size:13px">No results</p>';
});`,mode:'full'},
  ],
  exercises:[{id:'ref1',question:'Which array method transforms every element and returns a new array of the same length?',type:'multiple-choice',options:['forEach','filter','map','reduce'],correct:2,explanation:'map() applies a function to every element and returns a new array. forEach() does the same but returns undefined. filter() returns a subset. reduce() returns a single accumulated value.'}],
  quiz:[{id:'rq1',question:'What is the difference between Object.freeze() and const?',options:['They are identical','const prevents variable reassignment; Object.freeze() prevents property mutations on the object','Object.freeze() is faster','const freezes objects automatically'],correct:1,explanation:'const prevents you from reassigning the variable to a different object. Object.freeze() prevents changing any property on the object itself. For full immutability, use both: const obj = Object.freeze({...}).'}],
};
