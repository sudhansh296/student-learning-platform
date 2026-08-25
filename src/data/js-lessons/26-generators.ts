import type { JSLesson } from '../js-curriculum';
export const jsGeneratorsLesson: JSLesson = {
  id:'js-generators',title:'Generators & Iterators',slug:'generators',chapter:'advanced',order:27,difficulty:'advanced',readingTime:12,
  description:'Master iterators and generator functions - lazy sequences, infinite generators, async generators, and Symbol.iterator.',
  sections:[
    {type:'text',content:'Generators are functions that can pause and resume. They produce values one at a time using yield, enabling lazy evaluation of potentially infinite sequences. They are also the foundation of async/await under the hood.'},
    {type:'heading',content:'The Iterator Protocol'},
    {type:'example',title:'What makes something iterable',content:'An iterator is any object with a next() method that returns {value, done}. An iterable is any object with a [Symbol.iterator]() method that returns an iterator. Arrays, strings, Maps, and Sets are all iterables built into JavaScript. You can make your own class iterable by implementing [Symbol.iterator]() - then it works in for...of, spread [...obj], and destructuring.',language:'javascript',code:`// An iterator is an object with a next() method
// next() returns { value, done }

// Manual iterator
function range(start, end) {
  let current = start;
  return {
    next() {
      if (current <= end) {
        return { value: current++, done: false };
      }
      return { value: undefined, done: true };
    }
  };
}

const it = range(1, 5);
console.log(it.next()); // { value: 1, done: false }
console.log(it.next()); // { value: 2, done: false }
// ... etc

// Making an object iterable (for...of compatible)
class Range {
  constructor(start, end) { this.start = start; this.end = end; }

  // Symbol.iterator - the magic property that makes for...of work
  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;
    return {
      next() {
        return current <= end
          ? { value: current++, done: false }
          : { value: undefined, done: true };
      }
    };
  }
}

const r = new Range(1, 5);
for (const n of r) console.log(n);    // 1 2 3 4 5
console.log([...r]);                   // [1, 2, 3, 4, 5]
const [a, b, ...rest] = r;            // destructuring works!`},
    {type:'heading',content:'Generator Functions'},
    {type:'example',title:'function* and yield',content:'Generator functions use function* syntax and contain yield statements. Calling a generator function does NOT run the code - it returns a generator object. Each call to .next() runs the code until the next yield, pauses, and returns the yielded value. Generators enable lazy sequences - they compute values on demand rather than all at once, making infinite sequences possible without running out of memory.',language:'javascript',code:`// Generator function - uses function* and yield
function* counter(start = 0) {
  let n = start;
  while (true) {
    yield n++; // pauses here and returns value
    // execution resumes here on next .next() call
  }
}

const gen = counter(1);
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
console.log(gen.next().value); // 3

// Finite generator
function* range(start, end, step = 1) {
  for (let i = start; i <= end; i += step) {
    yield i;
  }
}

// Use in for...of
for (const n of range(0, 10, 2)) {
  console.log(n); // 0, 2, 4, 6, 8, 10
}

// Spread
console.log([...range(1, 5)]); // [1, 2, 3, 4, 5]

// yield* - delegate to another generator
function* concat(...iterables) {
  for (const it of iterables) {
    yield* it; // yield all values from it
  }
}

console.log([...concat([1,2], [3,4], [5,6])]); // [1,2,3,4,5,6]

// Two-way communication with generators
function* calculator() {
  let result = 0;
  while (true) {
    const input = yield result; // send value IN with next(value)
    result += input;
  }
}

const calc = calculator();
calc.next();       // start generator (gets first yield)
calc.next(5);      // send 5 in → result = 5
calc.next(10);     // send 10 in → result = 15
console.log(calc.next(3).value); // send 3 → result = 18`},
    {type:'heading',content:'Async Generators'},
    {type:'example',title:'Async iteration',content:'An async generator combines async/await with generators - you can yield Promises and await inside the function body. Use them with for await...of to process streams of data page by page, chunk by chunk. This is the proper way to paginate API results, process large files line by line, or handle any data that arrives in batches over time.',language:'javascript',code:`// Async generator - yield Promises
async function* fetchPages(baseUrl) {
  let page = 1;
  while (true) {
    const response = await fetch(\`\${baseUrl}?page=\${page}\`);
    if (!response.ok) break;
    const data = await response.json();
    if (!data.length) break;
    yield data; // yield the page of results
    page++;
  }
}

// Use with for await...of
async function loadAllUsers() {
  const allUsers = [];
  for await (const page of fetchPages('/api/users')) {
    allUsers.push(...page);
    console.log(\`Loaded \${allUsers.length} users\`);
  }
  return allUsers;
}

// Useful patterns
// Infinite ID generator
function* idGenerator(prefix = 'id') {
  let n = 1;
  while (true) yield \`\${prefix}-\${n++}\`;
}

const nextId = idGenerator('user');
console.log(nextId.next().value); // "user-1"
console.log(nextId.next().value); // "user-2"

// Fibonacci sequence
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

const fib = fibonacci();
const first10 = Array.from({length:10}, () => fib.next().value);
console.log(first10); // [0,1,1,2,3,5,8,13,21,34]`},
    {type:'tryit',title:'Try It: Generators',
     html:`<div id="app"><h2>Generator Demos</h2>
  <button onclick="demoRange()">Range Generator</button>
  <button onclick="demoFib()">Fibonacci Generator</button>
  <button onclick="demoId()">ID Generator</button>
  <pre id="out"></pre></div>`,
     css:`#app{font-family:system-ui,sans-serif;padding:20px;max-width:460px;}h2{color:#1e1e1e;}
button{padding:8px 14px;background:#2563eb;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;margin:4px;}
pre{background:#0d1117;color:#3fb950;padding:14px;border-radius:10px;font-size:12px;white-space:pre-wrap;margin-top:12px;}`,
     js:`const out = document.getElementById('out');
function log(lines) { out.textContent = lines.join('\ '); }

function* rangeGen(start, end, step=1) {
  for (let i=start; i<=end; i+=step) yield i;
}
function* fibGen() {
  let [a,b]=[0,1]; while(true){ yield a; [a,b]=[b,a+b]; }
}
function* idGen(prefix='id') { let n=1; while(true) yield prefix+'-'+n++; }

function demoRange() {
  const lines = ['=== Range(1,20,2) ===', [...rangeGen(1,20,2)].join(', ')];
  lines.push('\ === Range(0,1,0.1) ===');
  lines.push([...rangeGen(0,10,1)].map(n=>n/10).join(', '));
  log(lines);
}
function demoFib() {
  const gen = fibGen();
  const first15 = Array.from({length:15},()=>gen.next().value);
  log(['=== First 15 Fibonacci numbers ===', first15.join(', ')]);
}
function demoId() {
  const userId = idGen('user');
  const postId = idGen('post');
  const lines = ['=== Independent ID Generators ==='];
  for(let i=0;i<5;i++) lines.push('userId: '+userId.next().value+', postId: '+postId.next().value);
  log(lines);
}`,mode:'full'},
  ],
  exercises:[{id:'gn1',question:'What does yield do in a generator function?',type:'multiple-choice',options:['Returns from the function permanently','Pauses execution and sends a value out, resuming on next .next() call','Throws an error','Skips to the next iteration'],correct:1,explanation:'yield pauses the generator function and sends the yielded value to the caller. The next call to .next() resumes execution from where it left off. This pause-and-resume behavior is what makes generators unique.'}],
  quiz:[{id:'gq1',question:'What makes an object iterable (usable in for...of)?',options:['Having a length property','Implementing [Symbol.iterator]() that returns an object with next()','Being an Array','Having a forEach method'],correct:1,explanation:'An object is iterable if it has a [Symbol.iterator]() method that returns an iterator (an object with a next() method). Arrays, Strings, Maps, and Sets are all iterable because they implement this protocol.'}],
};
