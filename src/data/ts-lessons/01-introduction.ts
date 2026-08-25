import type { TsLesson } from '../ts-curriculum';

export const tsIntroLesson: TsLesson = {
  id: 'ts-intro',
  title: 'Introduction to TypeScript',
  slug: 'introduction',
  chapter: 'intro',
  order: 1,
  difficulty: 'beginner',
  readingTime: 10,
  description: 'What TypeScript is, why it was created, how it differs from JavaScript, type safety benefits, and how to get started.',
  sections: [
    {
      type: 'text',
      content: 'TypeScript is JavaScript with types. Built by Microsoft, it compiles to plain JavaScript and runs everywhere JS runs - browsers, Node.js, Deno, and any other JS environment. You write TypeScript during development, and the compiler strips all type annotations before shipping.',
    },
    {
      type: 'analogy',
      title: 'A contract before building',
      content: 'TypeScript is like writing a contract before building. JavaScript lets you build first and discover problems in production. TypeScript catches them before the code ever runs. The type system is your safety net - it tells you exactly what a function expects and what it returns, so entire categories of bugs simply cant happen.',
    },
    {
      type: 'heading',
      content: 'Why TypeScript?',
    },
    {
      type: 'list',
      items: [
        'Catches bugs before runtime - type errors are found at compile time, not in production',
        'IDE autocomplete and IntelliSense - your editor knows the shape of every object',
        'Safer refactoring - rename a property and TypeScript shows every place that breaks',
        'Self-documenting code - function signatures describe exactly what they need',
        'Works with any JS library - @types packages add types to thousands of npm packages',
      ],
    },
    {
      type: 'heading',
      content: 'JS vs TS - Side by Side',
    },
    {
      type: 'example',
      title: 'JS vs TS - the same code with and without types',
      content: 'In plain JavaScript, a function that expects a number will silently accept a string, leading to bugs at runtime. TypeScript adds a colon after the parameter name to specify its type - the compiler then prevents you from passing the wrong type before the code runs.',
      language: 'typescript',
      code: `// JavaScript - no type safety
function add(a, b) {
  return a + b;
}
add(5, "3"); // Returns "53" - silent bug!

// TypeScript - type safe
function addTS(a: number, b: number): number {
  return a + b;
}
// addTS(5, "3"); // Error: Argument of type 'string' is not assignable to type 'number'
addTS(5, 3); // 8 - correct

// TypeScript infers types automatically
let message = "Hello"; // TypeScript knows this is string
// message = 42; // Error: Type 'number' is not assignable to type 'string'`,
    },
    {
      type: 'heading',
      content: 'How TypeScript Works',
    },
    {
      type: 'example',
      title: 'TS compiles to plain JavaScript',
      content: 'TypeScript is a development tool - it never runs in the browser. The TypeScript compiler (tsc) strips all type annotations and produces clean JavaScript. You write TypeScript, ship JavaScript.',
      language: 'typescript',
      code: `// TypeScript source (.ts file)
interface User {
  name: string;
  age: number;
}

function greet(user: User): string {
  return "Hello, " + user.name + "!";
}

const alex: User = { name: "Alex", age: 25 };
console.log(greet(alex));

// After tsc compiles it - pure JavaScript (.js file):
// function greet(user) { return "Hello, " + user.name + "!"; }
// const alex = { name: "Alex", age: 25 };
// console.log(greet(alex));`,
    },
    {
      type: 'heading',
      content: 'Type Annotations Syntax',
    },
    {
      type: 'example',
      title: 'How to annotate variables, functions, and objects',
      content: 'Type annotations use a colon followed by the type. They are always optional - TypeScript can infer most types automatically. Add annotations where the type is not obvious or where you want to be explicit about the contract.',
      language: 'typescript',
      code: `// Variable annotations
let name: string = "Alice";
let age: number = 25;
let isActive: boolean = true;

// TypeScript infers these - no annotation needed:
let inferred = "TypeScript knows this is string";
let count = 42; // TypeScript knows this is number

// Function annotations
function multiply(x: number, y: number): number {
  return x * y;
}

// Arrow function
const square = (n: number): number => n * n;

// Object annotation
const user: { name: string; age: number } = {
  name: "Bob",
  age: 30,
};`,
      output: 'Hello, Alex! 8',
    },
    {
      type: 'tryit',
      title: 'Try It: TypeScript Concepts',
      css: `body{font-family:system-ui,sans-serif;padding:20px;} h3{color:#3178c6;margin:0 0 8px;} .card{background:#f0f7ff;border:1px solid #bfdbfe;border-radius:10px;padding:14px;margin-bottom:10px;} p{margin:4px 0;font-size:14px;}`,
      js: `// Demonstrating TypeScript concepts in JavaScript
// (TypeScript adds type annotations on top of this)

// Type checking simulation
function typeSafeAdd(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Both arguments must be numbers');
  }
  return a + b;
}

// This is what TypeScript catches at COMPILE time
// (before the code even runs)
try {
  console.log('add(5, 3) =', typeSafeAdd(5, 3));
  console.log('add(5, "3") =', typeSafeAdd(5, "3"));
} catch(e) {
  console.log('Error caught:', e.message);
}

// Type inference demo
const values = [1, 2, 3, 4, 5];
const doubled = values.map(n => n * 2);
console.log('doubled:', JSON.stringify(doubled));

// Interface-like object
const user = { name: "Alice", age: 25, role: "developer" };
console.log('user:', JSON.stringify(user));

document.getElementById('output').innerHTML = \`
  <div class="card"><h3>TypeScript Advantages</h3>
  <p>✅ Catches type errors before runtime</p>
  <p>✅ Self-documenting code</p>
  <p>✅ Better IDE support</p>
  <p>✅ Safer refactoring</p>
  </div>
\`;`,
    },
  ],
  exercises: [
    {
      id: 'ts-intro-1',
      question: 'What is TypeScript?',
      type: 'multiple-choice',
      options: [
        'A completely separate language that replaces JavaScript',
        'A typed superset of JavaScript that compiles to plain JavaScript',
        'A JavaScript runtime like Node.js',
        'A CSS preprocessor',
      ],
      correct: 1,
      explanation: 'TypeScript is a typed superset of JavaScript. It adds static type annotations on top of JavaScript syntax, and the TypeScript compiler (tsc) strips those annotations to produce plain JavaScript.',
    },
    {
      id: 'ts-intro-2',
      question: 'What does the TypeScript compiler (tsc) produce?',
      type: 'multiple-choice',
      options: [
        'TypeScript files with better types',
        'Binary executable files',
        'Plain JavaScript files',
        'WebAssembly modules',
      ],
      correct: 2,
      explanation: 'The TypeScript compiler (tsc) takes .ts files and outputs plain .js files. All type annotations are stripped - the browser or Node.js only ever sees regular JavaScript.',
    },
  ],
  quiz: [
    {
      id: 'ts-intro-q1',
      question: 'When does TypeScript catch type errors?',
      options: [
        'At runtime in the browser',
        'Only in production deployments',
        'At compile time - before the code runs',
        'Only when you run tests',
      ],
      correct: 2,
      explanation: 'TypeScript catches type errors at compile time - when you run tsc or when your IDE processes the file. This means type bugs are found during development, not in production when real users encounter them.',
    },
  ],
};
