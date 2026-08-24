import { InterviewQuestion } from '@/lib/interview-types';

export const codingInterviewQuestions: InterviewQuestion[] = [
  {
    id: 'code-reverse-string',
    category: 'coding',
    type: 'coding',
    question: 'Reverse a string without using the built-in reverse() method.',
    difficulty: 'beginner',
    tags: ['strings', 'algorithms', 'beginner'],
    shortAnswer: 'Iterate from end to start and build a new string, or split into array, reverse, join. Multiple approaches: two-pointer, recursive, reduce, spread operator.',
    detailedExplanation: 'String reversal is a classic warm-up problem testing knowledge of string iteration and array methods. The key insight: strings are immutable in JavaScript, so you build a new string. Multiple valid approaches exist, each with different tradeoffs in readability vs performance.',
    example: {
      code: `// Approach 1: Built-in methods (simplest)
const reverse1 = (str) => str.split('').reverse().join('');
// split('')  → ['h','e','l','l','o']
// reverse()  → ['o','l','l','e','h']
// join('')   → 'olleh'

// Approach 2: For loop (no built-ins)
function reverse2(str) {
  let reversed = '';
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}

// Approach 3: Reduce
const reverse3 = (str) =>
  str.split('').reduce((acc, char) => char + acc, '');

// Approach 4: Spread + reverse (ES6)
const reverse4 = (str) => [...str].reverse().join('');

// Approach 5: Two-pointer on array
function reverse5(str) {
  const arr = str.split('');
  let left = 0, right = arr.length - 1;
  
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]]; // Swap
    left++;
    right--;
  }
  
  return arr.join('');
}

// Test all
console.log(reverse1('hello'));  // 'olleh'
console.log(reverse2('world'));  // 'dlrow'
console.log(reverse3('abc'));    // 'cba'

// Bonus: Reverse words in a sentence
const reverseWords = (str) =>
  str.split(' ').reverse().join(' ');

reverseWords('Hello World'); // 'World Hello'

// Bonus: Check if palindrome
const isPalindrome = (str) => {
  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean === clean.split('').reverse().join('');
};

isPalindrome('racecar'); // true
isPalindrome('A man a plan a canal Panama'); // true`,
      language: 'javascript'
    },
    interviewAnswer: 'I\'d use split/reverse/join in production code for readability. If asked to avoid built-ins, the for loop iterating backward is clear. For a coding interview where they want to see my thinking, I\'d show the two-pointer approach — it demonstrates understanding of in-place algorithms.',
    commonMistakes: [
      'Trying to reverse a string in-place (strings are immutable in JS)',
      'Off-by-one errors in loop bounds',
      'Forgetting that split("") and [...str] handle Unicode differently'
    ],
    realWorldUse: 'Foundation for palindrome checks, string parsing. Tests basic string/array manipulation comfort.',
    followUpQuestions: [
      'How would you reverse words in a sentence?',
      'How do you check if a string is a palindrome?',
      'What is the time complexity of each approach?'
    ],
    codingChallenge: {
      starterCode: `function reverseString(str) {
  // Write your solution here
}

console.log(reverseString('hello'));  // 'olleh'
console.log(reverseString('world'));  // 'dlrow'
console.log(reverseString(''));       // ''`,
      solution: `function reverseString(str) {
  return str.split('').reverse().join('');
}`,
      hints: [
        'Split the string into an array of characters',
        'Use the array reverse() method',
        'Join back to a string'
      ]
    }
  },

  {
    id: 'code-flatten-array',
    category: 'coding',
    type: 'coding',
    question: 'Flatten a nested array to a single level array.',
    difficulty: 'beginner',
    tags: ['arrays', 'recursion', 'algorithms'],
    shortAnswer: 'Use Array.flat(Infinity) for built-in, or recursion with concat/spread for manual implementation. The recursive approach checks if each element is an array and flattens it.',
    detailedExplanation: 'Flattening tests understanding of recursion and array manipulation. The built-in flat() with Infinity depth is simplest. Manual implementation uses reduce+concat recursively or a stack. This also tests if candidates know modern JavaScript APIs vs reinventing them.',
    example: {
      code: `const nested = [1, [2, 3], [4, [5, [6]]]];

// Approach 1: Built-in flat() - ES2019
const flat1 = nested.flat(Infinity); // [1, 2, 3, 4, 5, 6]
nested.flat(1); // [1, 2, 3, 4, [5, [6]]] - only 1 level

// Approach 2: Recursive with reduce
function flatten(arr) {
  return arr.reduce((flat, item) => {
    return Array.isArray(item)
      ? flat.concat(flatten(item)) // Recurse if array
      : flat.concat(item);          // Add if not array
  }, []);
}

// Approach 3: Recursive with spread
function flatten2(arr) {
  return arr.reduce((acc, item) =>
    Array.isArray(item) ? [...acc, ...flatten2(item)] : [...acc, item]
  , []);
}

// Approach 4: Stack-based (iterative - no recursion)
function flatten3(arr) {
  const stack = [...arr];
  const result = [];
  
  while (stack.length) {
    const item = stack.pop();
    if (Array.isArray(item)) {
      stack.push(...item); // Push all elements back
    } else {
      result.unshift(item); // Add to front (preserve order)
    }
  }
  
  return result;
}

// Approach 5: toString hack (only works for numbers)
[1, [2, [3]]].toString().split(',').map(Number);
// [1, 2, 3] - works but hacky, loses non-numeric data

// Test
const test = [1, [2, 3], [4, [5, [6]]]];
console.log(flatten(test));  // [1, 2, 3, 4, 5, 6]
console.log(flatten3(test)); // [1, 2, 3, 4, 5, 6]`,
      language: 'javascript'
    },
    interviewAnswer: 'In a real codebase, I\'d use flat(Infinity) — it\'s readable and built-in. For the interview, I\'d show the recursive reduce approach to demonstrate I understand recursion and array manipulation. I\'d also mention the stack approach for large inputs to avoid call stack overflow with deeply nested arrays.',
    commonMistakes: [
      'Mutating the original array',
      'Not handling mixed arrays with non-array elements',
      'Stack overflow with deeply nested arrays (recursive approach)'
    ],
    realWorldUse: 'Data normalization, processing API responses with nested structures, building tree/menu structures.',
    followUpQuestions: [
      'What happens with very deeply nested arrays and recursion?',
      'How would you preserve the nesting depth but count items?',
      'What is the time and space complexity?'
    ],
    codingChallenge: {
      starterCode: `function flatten(arr) {
  // Write your solution here
}

console.log(flatten([1, [2, 3], [4, [5, [6]]]]));
// Expected: [1, 2, 3, 4, 5, 6]`,
      solution: `function flatten(arr) {
  return arr.reduce((flat, item) =>
    Array.isArray(item) ? flat.concat(flatten(item)) : flat.concat(item)
  , []);
}`,
      hints: [
        'Use reduce to build the result array',
        'Check if each item is an Array with Array.isArray()',
        'Recursively flatten nested arrays'
      ]
    }
  },

  {
    id: 'code-fibonacci',
    category: 'coding',
    type: 'coding',
    question: 'Implement Fibonacci sequence. Optimize for performance.',
    difficulty: 'beginner',
    tags: ['algorithms', 'recursion', 'dynamic-programming'],
    shortAnswer: 'Naive recursion is O(2^n). Memoization makes it O(n) time. Iterative is O(n) time O(1) space. Memoization/iterative are correct answers for performance.',
    detailedExplanation: 'Fibonacci tests recursion understanding, time complexity analysis, and optimization. The naive recursive solution is exponential because it recalculates subproblems. Memoization stores results. Iterative avoids the call stack entirely. This shows whether candidates can identify and solve performance problems.',
    example: {
      code: `// Approach 1: Naive recursion - O(2^n) - Too slow!
function fibSlow(n) {
  if (n <= 1) return n;
  return fibSlow(n - 1) + fibSlow(n - 2);
}
// fib(50) would take minutes - recalculates fib(2) 2^48 times!

// Approach 2: Memoization - O(n) time, O(n) space
function fibMemo(n, memo = {}) {
  if (n in memo) return memo[n]; // Cache hit
  if (n <= 1) return n;
  
  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}

// Approach 3: Iterative - O(n) time, O(1) space (best!)
function fib(n) {
  if (n <= 1) return n;
  
  let prev = 0, curr = 1;
  
  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  
  return curr;
}

// Approach 4: Generator (infinite sequence)
function* fibonacci() {
  let [prev, curr] = [0, 1];
  while (true) {
    yield curr;
    [prev, curr] = [curr, prev + curr];
  }
}

const gen = fibonacci();
const first10 = Array.from({ length: 10 }, () => gen.next().value);
// [1, 1, 2, 3, 5, 8, 13, 21, 34, 55]

// Testing
console.log(fib(0));  // 0
console.log(fib(1));  // 1
console.log(fib(10)); // 55
console.log(fib(50)); // 12586269025 (fast!)

// Performance comparison
console.time('slow');
fibSlow(35); // ~100ms
console.timeEnd('slow');

console.time('fast');
fib(35);     // < 1ms
console.timeEnd('fast');`,
      language: 'javascript'
    },
    interviewAnswer: 'I\'d start with the recursive version to show I understand the problem, then explain why it\'s O(2^n) and optimize with memoization, then show the iterative solution which is O(n) time and O(1) space — the best possible. The iterative approach only needs to remember the last two numbers at any time.',
    commonMistakes: [
      'Stopping at naive recursion without optimization',
      'Not explaining why the naive version is slow',
      'Memoization but not realizing iterative has better space complexity'
    ],
    realWorldUse: 'Tests recursive thinking and optimization. Pattern applicable to any problem with overlapping subproblems (dynamic programming).',
    followUpQuestions: [
      'What is the time complexity of each approach?',
      'How would you generate the first N Fibonacci numbers?',
      'What is dynamic programming?'
    ],
    codingChallenge: {
      starterCode: `function fibonacci(n) {
  // Implement efficiently
}

console.log(fibonacci(10)); // 55
console.log(fibonacci(50)); // 12586269025`,
      solution: `function fibonacci(n) {
  if (n <= 1) return n;
  let prev = 0, curr = 1;
  for (let i = 2; i <= n; i++) {
    [prev, curr] = [curr, prev + curr];
  }
  return curr;
}`,
      hints: [
        'Start with the base cases (n=0, n=1)',
        'You only need to remember the last two numbers',
        'Loop from 2 to n, updating prev and curr each time'
      ]
    }
  },

  {
    id: 'code-deep-clone',
    category: 'coding',
    type: 'coding',
    question: 'Implement a deep clone function for JavaScript objects.',
    difficulty: 'intermediate',
    tags: ['objects', 'recursion', 'deep-copy'],
    shortAnswer: 'Recursively copy all properties. Handle arrays, primitives, null, and objects separately. JSON.parse/stringify is a shortcut but loses functions, dates, undefined, and circular references.',
    detailedExplanation: 'Deep cloning tests understanding of JavaScript types, recursion, and edge cases. Simple approaches (JSON parse/stringify) have limitations. Full implementations handle: null, primitives, Date, Array, plain objects, and optionally: Map, Set, Functions, circular references. Modern browsers have structuredClone() which handles most cases.',
    example: {
      code: `// Approach 1: JSON trick (limited)
const clone1 = (obj) => JSON.parse(JSON.stringify(obj));
// ❌ Loses: functions, Date (becomes string), undefined, circular refs

// Approach 2: structuredClone (modern browsers/Node 17+)
const clone2 = (obj) => structuredClone(obj);
// ✅ Handles dates, arrays, maps, sets, circular refs
// ❌ Doesn't handle functions

// Approach 3: Recursive implementation
function deepClone(value) {
  // Primitives and null - return as-is
  if (value === null || typeof value !== 'object') {
    return value;
  }
  
  // Date
  if (value instanceof Date) {
    return new Date(value.getTime());
  }
  
  // Array
  if (Array.isArray(value)) {
    return value.map(item => deepClone(item));
  }
  
  // Plain object
  const cloned = {};
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      cloned[key] = deepClone(value[key]);
    }
  }
  return cloned;
}

// Approach 4: With circular reference handling
function deepCloneCircular(obj, seen = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  
  // Check if we've seen this object (circular ref)
  if (seen.has(obj)) return seen.get(obj);
  
  const clone = Array.isArray(obj) ? [] : {};
  seen.set(obj, clone); // Record before recursing
  
  for (const key of Object.keys(obj)) {
    clone[key] = deepCloneCircular(obj[key], seen);
  }
  
  return clone;
}

// Testing
const original = {
  name: 'Alex',
  address: { city: 'NYC', zip: '10001' },
  hobbies: ['coding', 'reading'],
  born: new Date('1995-01-15')
};

const cloned = deepClone(original);

cloned.address.city = 'LA';
cloned.hobbies.push('hiking');

console.log(original.address.city); // 'NYC' - not affected
console.log(original.hobbies);      // ['coding', 'reading'] - not affected`,
      language: 'javascript'
    },
    interviewAnswer: 'I\'d use structuredClone() in modern environments — it\'s built-in, handles dates, maps, sets, and circular references. For the interview, I\'d implement recursive deep clone to demonstrate the concept: handle primitives as base case, recurse into objects and arrays, special-case Date objects.',
    commonMistakes: [
      'Using JSON.stringify without knowing its limitations',
      'Forgetting to handle arrays separately from objects',
      'Not handling null (typeof null === "object")',
      'No circular reference protection (infinite loop)'
    ],
    realWorldUse: 'State management in Redux/React, undo/redo systems, snapshot testing. Understanding deep vs shallow copy prevents many subtle bugs.',
    followUpQuestions: [
      'What does JSON.stringify/parse fail on?',
      'How does WeakMap help with circular references?',
      'When is a shallow copy sufficient?'
    ],
    codingChallenge: {
      starterCode: `function deepClone(obj) {
  // Your implementation here
}

const original = { a: 1, b: { c: 2 }, d: [3, 4] };
const clone = deepClone(original);
clone.b.c = 99;
console.log(original.b.c); // Should still be 2`,
      solution: `function deepClone(value) {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(deepClone);
  const clone = {};
  for (const key of Object.keys(value)) {
    clone[key] = deepClone(value[key]);
  }
  return clone;
}`,
      hints: [
        'Handle primitives and null as the base case',
        'Handle arrays separately with map()',
        'For objects, iterate over keys and recursively clone each value'
      ]
    }
  },

  {
    id: 'code-debounce-impl',
    category: 'coding',
    type: 'coding',
    question: 'Implement a debounce function from scratch.',
    difficulty: 'intermediate',
    tags: ['closures', 'timing', 'implementation'],
    shortAnswer: 'Return a function that clears a pending timeout and sets a new one with the delay each time it\'s called. The actual function only runs after the delay has passed without another call.',
    detailedExplanation: 'Debounce implementation tests closures and timing concepts. The returned function wraps the original function, using a closure to hold the timeoutId. Each call clears the previous timeout and sets a new one. Only when the delay expires without a new call does the original function execute.',
    example: {
      code: `// Basic implementation
function debounce(func, delay) {
  let timeoutId;
  
  return function(...args) {
    // Clear previous timer
    clearTimeout(timeoutId);
    
    // Set new timer
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// With leading option (fires immediately, then debounces)
function debounceAdvanced(func, delay, options = {}) {
  let timeoutId;
  let lastResult;
  const { leading = false, trailing = true } = options;
  
  return function(...args) {
    const shouldFireLeading = leading && !timeoutId;
    
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (trailing) {
        lastResult = func.apply(this, args);
      }
    }, delay);
    
    if (shouldFireLeading) {
      lastResult = func.apply(this, args);
    }
    
    return lastResult;
  };
}

// Cancel method
function debounceWithCancel(func, delay) {
  let timeoutId;
  
  const debounced = function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
  
  debounced.cancel = () => {
    clearTimeout(timeoutId);
    timeoutId = null;
  };
  
  return debounced;
}

// Usage examples
const searchInput = document.querySelector('#search');
const debouncedSearch = debounce(async (query) => {
  const results = await fetch(\`/api/search?q=\${query}\`);
  displayResults(await results.json());
}, 300);

searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});

// React usage
function SearchBox() {
  const debouncedSearch = useCallback(
    debounce((query) => { /* API call */ }, 300),
    []
  );
  
  return <input onChange={e => debouncedSearch(e.target.value)} />;
}`,
      language: 'javascript'
    },
    interviewAnswer: 'The key insight is closures — the timeoutId is captured in the outer function\'s scope. Each call to the returned function clears the previous timeout and starts a new one. The actual work only happens when the delay expires. I\'d explain this step by step, then extend with leading option to show deeper understanding.',
    commonMistakes: [
      'Not preserving "this" context (use apply or arrow function)',
      'Not passing arguments to the inner function',
      'Not clearing the timeout on subsequent calls'
    ],
    realWorldUse: 'Search inputs, window resize handlers, form autosave, scroll events. Lodash provides debounce but implementing from scratch shows understanding.',
    followUpQuestions: [
      'What is the difference between debounce and throttle?',
      'How do you preserve "this" context?',
      'How would you add a cancel method?'
    ],
    codingChallenge: {
      starterCode: `function debounce(func, delay) {
  // Your implementation
}

const log = debounce((msg) => console.log(msg), 300);

log('a'); log('b'); log('c');
// After 300ms, only 'c' should be logged`,
      solution: `function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}`,
      hints: [
        'Use a closure to hold the timeoutId between calls',
        'clearTimeout() the previous timer on each call',
        'Set a new setTimeout with the delay each time'
      ]
    }
  },

  {
    id: 'code-promise-all',
    category: 'coding',
    type: 'coding',
    question: 'Implement Promise.all() from scratch.',
    difficulty: 'intermediate',
    tags: ['promises', 'async', 'implementation'],
    shortAnswer: 'Returns a Promise that resolves with an array of all results when ALL promises resolve, or rejects immediately when ANY promise rejects. Track resolved count, resolve when count equals length.',
    detailedExplanation: 'Implementing Promise.all tests deep understanding of the Promise API. The key behaviors: waits for all to resolve, maintains order of results (not order of completion), rejects immediately on first rejection, handles non-Promise values too.',
    example: {
      code: `function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    // Handle empty array
    if (promises.length === 0) {
      resolve([]);
      return;
    }
    
    const results = new Array(promises.length);
    let resolvedCount = 0;
    
    promises.forEach((promise, index) => {
      // Wrap non-Promises with Promise.resolve
      Promise.resolve(promise).then(value => {
        results[index] = value; // Maintain order!
        resolvedCount++;
        
        if (resolvedCount === promises.length) {
          resolve(results); // All resolved
        }
      }).catch(reject); // Any rejection rejects all
    });
  });
}

// Testing
const p1 = Promise.resolve(1);
const p2 = new Promise(res => setTimeout(() => res(2), 100));
const p3 = Promise.resolve(3);

promiseAll([p1, p2, p3]).then(results => {
  console.log(results); // [1, 2, 3] - in order, not completion order
});

// With rejection
const failing = Promise.reject(new Error('Failed'));
promiseAll([p1, failing, p3]).catch(err => {
  console.log(err.message); // 'Failed'
});

// Comparison with actual Promise.all
console.log(Promise.all === promiseAll); // false, but same behavior

// Bonus: promiseAllSettled (waits for all, doesn't reject)
function promiseAllSettled(promises) {
  return promiseAll(promises.map(p =>
    Promise.resolve(p)
      .then(value => ({ status: 'fulfilled', value }))
      .catch(reason => ({ status: 'rejected', reason }))
  ));
}

// Bonus: promiseRace (resolves/rejects with first to settle)
function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach(promise => {
      Promise.resolve(promise).then(resolve).catch(reject);
    });
  });
}`,
      language: 'javascript'
    },
    interviewAnswer: 'The key insight is maintaining an index-ordered results array, not a push-order array. I create a results array pre-filled, track resolved count, and only resolve the outer Promise when all have resolved. Any rejection immediately rejects the outer Promise. This tests understanding of Promise internals, closures, and async coordination.',
    commonMistakes: [
      'Using push() instead of index assignment (wrong order)',
      'Not handling non-Promise values',
      'Not handling empty array',
      'Not short-circuiting on first rejection'
    ],
    realWorldUse: 'Fetching multiple API endpoints in parallel, waiting for multiple database operations. Shows deep Promise understanding.',
    followUpQuestions: [
      'What is the difference between Promise.all and Promise.allSettled?',
      'What is Promise.race?',
      'How would you implement Promise.any?'
    ],
    codingChallenge: {
      starterCode: `function promiseAll(promises) {
  // Your implementation
}

promiseAll([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
]).then(console.log); // [1, 2, 3]`,
      solution: `function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!promises.length) return resolve([]);
    const results = [];
    let count = 0;
    promises.forEach((p, i) => {
      Promise.resolve(p).then(val => {
        results[i] = val;
        if (++count === promises.length) resolve(results);
      }).catch(reject);
    });
  });
}`,
      hints: [
        'Create a results array indexed by position',
        'Track how many have resolved with a counter',
        'Resolve when counter equals promises.length'
      ]
    }
  },

  {
    id: 'code-group-by',
    category: 'coding',
    type: 'coding',
    question: 'Group an array of objects by a given key.',
    difficulty: 'beginner',
    tags: ['arrays', 'objects', 'functional'],
    shortAnswer: 'Use reduce to build an object where each key is the grouping value, and each value is an array of items with that value. Also available as Object.groupBy in modern environments.',
    detailedExplanation: 'Grouping is a very common real-world operation. Tests reduce and object building. The reduce pattern accumulates objects grouped by key value. This comes up in data processing, report generation, and any time you need to organize flat arrays into categories.',
    example: {
      code: `// Manual implementation
function groupBy(arr, key) {
  return arr.reduce((groups, item) => {
    const groupKey = typeof key === 'function' ? key(item) : item[key];
    
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    
    return groups;
  }, {});
}

// Concise version
const groupBy2 = (arr, key) =>
  arr.reduce((groups, item) => ({
    ...groups,
    [item[key]]: [...(groups[item[key]] || []), item]
  }), {});

// Modern: Object.groupBy (ES2024)
const modern = Object.groupBy(products, item => item.category);

// Examples
const products = [
  { id: 1, name: 'Laptop', category: 'Electronics', price: 999 },
  { id: 2, name: 'Phone', category: 'Electronics', price: 699 },
  { id: 3, name: 'Shirt', category: 'Clothing', price: 29 },
  { id: 4, name: 'Jeans', category: 'Clothing', price: 59 },
  { id: 5, name: 'Book', category: 'Education', price: 19 }
];

const byCategory = groupBy(products, 'category');
console.log(byCategory);
// {
//   Electronics: [ {Laptop}, {Phone} ],
//   Clothing: [ {Shirt}, {Jeans} ],
//   Education: [ {Book} ]
// }

// With function key
const byPriceRange = groupBy(products, item =>
  item.price < 50 ? 'budget' : item.price < 200 ? 'mid' : 'premium'
);
// { budget: [{Book},{Shirt}], mid: [{Jeans}], premium: [{Laptop},{Phone}] }

// Count per group
const countByCategory = Object.fromEntries(
  Object.entries(byCategory).map(([key, items]) => [key, items.length])
);
// { Electronics: 2, Clothing: 2, Education: 1 }`,
      language: 'javascript'
    },
    interviewAnswer: 'I\'d mention Object.groupBy first (ES2024) since it\'s now a standard. For the implementation, reduce is the natural fit: start with empty object, for each item find its group key, create array if key doesn\'t exist yet, push item in.',
    commonMistakes: [
      'Not initializing the group array if key doesn\'t exist',
      'Mutating items in the process',
      'Not handling function as key parameter'
    ],
    realWorldUse: 'Everywhere in data processing: grouping orders by status, products by category, users by role, transactions by date.',
    followUpQuestions: [
      'How would you group and then count per group?',
      'How would you group by multiple keys?',
      'What is Object.groupBy?'
    ],
    codingChallenge: {
      starterCode: `function groupBy(arr, key) {
  // Your implementation
}

const people = [
  { name: 'Alice', dept: 'Engineering' },
  { name: 'Bob', dept: 'Design' },
  { name: 'Carol', dept: 'Engineering' }
];

console.log(groupBy(people, 'dept'));
// { Engineering: [{Alice}, {Carol}], Design: [{Bob}] }`,
      solution: `function groupBy(arr, key) {
  return arr.reduce((groups, item) => {
    const groupKey = item[key];
    groups[groupKey] = groups[groupKey] || [];
    groups[groupKey].push(item);
    return groups;
  }, {});
}`,
      hints: [
        'Use reduce with an empty object as initial value',
        'The group key is item[key]',
        'Initialize the array if it doesn\'t exist yet'
      ]
    }
  }
];
