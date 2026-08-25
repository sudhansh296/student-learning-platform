import type { TsLesson } from '../ts-curriculum';

export const tsFunctionsLesson: TsLesson = {
  id: 'ts-functions',
  title: 'Functions',
  slug: 'functions',
  chapter: 'types',
  order: 5,
  difficulty: 'beginner',
  readingTime: 10,
  description: 'Typing function parameters, return values, optional/default params, rest params, and function type signatures.',
  sections: [
    {
      type: 'text',
      content: 'Functions are where TypeScript provides the most value. By annotating parameters and return types, you create clear contracts between different parts of your code. TypeScript will verify every call site matches the contract - no more wrong argument order or missing required parameters.',
    },
    {
      type: 'heading',
      content: 'Parameter and Return Types',
    },
    {
      type: 'example',
      title: 'Annotating function inputs and outputs',
      content: 'Add a colon and type after each parameter to annotate it. Add a colon and type after the closing parenthesis to annotate the return type. TypeScript infers the return type from the function body, so the return annotation is optional - but recommended for documentation and to catch accidental mismatches.',
      language: 'typescript',
      code: `// Basic typed function
function add(a: number, b: number): number {
  return a + b;
}

// Arrow function
const multiply = (x: number, y: number): number => x * y;

// Return type annotation is optional - TypeScript infers it
function greet(name: string) {
  return "Hello, " + name; // TypeScript infers: string
}

// void - function that returns nothing
function logValue(val: unknown): void {
  console.log(val);
  // no return - or "return;" with no value
}

// Multiple parameter types
function formatDate(date: Date, locale: string, includeTime: boolean): string {
  return date.toLocaleDateString(locale);
}

// TypeScript catches wrong calls:
add(1, 2);           // OK - returns 3
// add(1, "2");      // Error: Argument of type 'string' is not assignable to parameter of type 'number'
// add(1);           // Error: Expected 2 arguments, but got 1`,
    },
    {
      type: 'heading',
      content: 'Optional and Default Parameters',
    },
    {
      type: 'example',
      title: 'Optional (?) and default parameter values',
      content: 'Add a "?" after the parameter name to make it optional - callers can omit it and the value inside the function will be undefined. Use "= value" to give a parameter a default. Default parameters are automatically optional from the callers perspective.',
      language: 'typescript',
      code: `// Optional parameter - must be handled carefully inside the function
function greetUser(name: string, title?: string): string {
  if (title) {
    return "Hello, " + title + " " + name;
  }
  return "Hello, " + name;
}
greetUser("Alice");          // "Hello, Alice"
greetUser("Smith", "Dr.");   // "Hello, Dr. Smith"

// Default parameter - caller can omit it
function createSlug(text: string, separator: string = "-"): string {
  return text.toLowerCase().replace(/\s+/g, separator);
}
createSlug("Hello World");       // "hello-world"
createSlug("Hello World", "_");  // "hello_world"

// Required params must come before optional ones
function buildUrl(
  host: string,           // required
  path: string,           // required
  port: number = 443,     // optional with default
  protocol?: string       // optional - undefined if omitted
): string {
  const p = protocol || "https";
  return p + "://" + host + ":" + port + path;
}`,
    },
    {
      type: 'heading',
      content: 'Rest Parameters',
    },
    {
      type: 'example',
      title: 'Collecting variable argument lists with rest params',
      content: 'Rest parameters (...args) collect any number of arguments into a typed array. They must always be the last parameter. The type annotation goes on the array - rest: number[] means zero or more number arguments.',
      language: 'typescript',
      code: `// Rest params collect extra args into a typed array
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}
sum(1, 2, 3);       // 6
sum(10, 20, 30, 40); // 100

// Rest after required params
function log(level: string, ...messages: string[]): void {
  console.log("[" + level + "]", messages.join(" "));
}
log("INFO", "Server started", "on port 3000");
log("ERROR", "Something", "went", "wrong");

// Spread args into a rest-param function
const nums = [1, 2, 3, 4, 5];
console.log(sum(...nums)); // 15

// Combined with regular params
function tag(template: string, ...values: (string | number)[]): string {
  return values.reduce<string>(
    (result, val, i) => result + val + template[i + 1],
    template[0]
  );
}`,
    },
    {
      type: 'heading',
      content: 'Function Types as Variables',
    },
    {
      type: 'example',
      title: 'Describing function signatures as types',
      content: 'In TypeScript you can describe the type of a function itself - its parameter types and return type. This is essential when passing functions as arguments (callbacks), storing them in variables, or defining interface methods.',
      language: 'typescript',
      code: `// Function type annotation on a variable
let calculate: (a: number, b: number) => number;
calculate = (x, y) => x + y;    // OK
calculate = (x, y) => x * y;    // OK - same signature
// calculate = (x) => x;        // Error: missing second parameter

// Function type in an interface
interface Button {
  label: string;
  onClick: () => void;
  onHover?: (event: MouseEvent) => void;
}

// Callback parameter type
function applyToAll(items: number[], fn: (n: number) => number): number[] {
  return items.map(fn);
}
applyToAll([1, 2, 3], n => n * 2);    // [2, 4, 6]
applyToAll([1, 2, 3], n => n + 10);   // [11, 12, 13]

// Type alias for a function signature
type Predicate<T> = (item: T) => boolean;
const isEven: Predicate<number> = n => n % 2 === 0;
const isLong: Predicate<string> = s => s.length > 5;

console.log([1,2,3,4,5].filter(isEven)); // [2, 4]`,
    },
    {
      type: 'example',
      title: 'Function overloads for multiple call signatures',
      content: 'Function overloads let you define multiple type signatures for the same function. TypeScript picks the right one based on the argument types at each call site. The implementation signature (the last one with the actual body) must be compatible with all overload signatures.',
      language: 'typescript',
      code: `// Overload signatures - TypeScript uses these for type checking
function format(value: string): string;
function format(value: number): string;
function format(value: Date): string;

// Implementation - must be a superset of all overloads
function format(value: string | number | Date): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return value.toFixed(2);
  return value.toISOString().split("T")[0];
}

format("  hello  ");  // "hello" - string overload
format(3.14159);      // "3.14" - number overload
format(new Date());   // "2024-01-15" - Date overload`,
    },
    {
      type: 'tryit',
      title: 'Try It: Typed Functions',
      css: `body{font-family:system-ui,sans-serif;padding:20px;} .result{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:10px;margin-bottom:8px;} .label{font-size:11px;font-weight:700;color:#15803d;text-transform:uppercase;margin-bottom:4px;} .value{font-size:14px;color:#374151;}`,
      js: `// TypeScript function patterns in JavaScript

// Optional and default params
function greetUser(name, title) {
  if (title) return 'Hello, ' + title + ' ' + name;
  return 'Hello, ' + name;
}

// Rest params
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

// Function as a value (callback)
function applyToAll(items, fn) {
  return items.map(fn);
}

// Results
const greet1 = greetUser('Alice');
const greet2 = greetUser('Smith', 'Dr.');
const total = sum(10, 20, 30, 40, 50);
const doubled = applyToAll([1, 2, 3, 4, 5], n => n * 2);
const squared = applyToAll([1, 2, 3, 4, 5], n => n * n);

console.log('greet (no title):', greet1);
console.log('greet (with title):', greet2);
console.log('sum(10,20,30,40,50):', total);
console.log('doubled:', JSON.stringify(doubled));
console.log('squared:', JSON.stringify(squared));

document.getElementById('output').innerHTML =
  '<div class="result"><div class="label">Optional param</div><div class="value">' + greet1 + '</div></div>' +
  '<div class="result"><div class="label">Default param</div><div class="value">' + greet2 + '</div></div>' +
  '<div class="result"><div class="label">Rest params sum</div><div class="value">' + total + '</div></div>' +
  '<div class="result"><div class="label">Callback (doubled)</div><div class="value">' + JSON.stringify(doubled) + '</div></div>';`,
    },
  ],
  exercises: [
    {
      id: 'ts-fn-1',
      question: 'What does "void" mean as a function return type?',
      type: 'multiple-choice',
      options: [
        'The function can return any value',
        'The function returns null',
        'The function does not return a meaningful value',
        'The function returns undefined only',
      ],
      correct: 2,
      explanation: '"void" means the function does not return a meaningful value. It is used for functions that perform actions (like logging or updating the DOM) without producing a result. The function may technically return "undefined" but callers should not rely on any return value.',
    },
    {
      id: 'ts-fn-2',
      question: 'What is wrong with this function signature: function greet(title?: string, name: string): string',
      type: 'multiple-choice',
      options: [
        'Nothing - it is valid TypeScript',
        'Optional parameters cannot be used in functions',
        'Optional parameters must come after required parameters',
        'The return type should be void, not string',
      ],
      correct: 2,
      explanation: 'Optional parameters must come after required parameters. Having "title?" before the required "name" is not allowed because callers would have no way to omit "title" while providing "name". The correct order is: required params first, then optional ones.',
    },
  ],
  quiz: [
    {
      id: 'ts-fn-q1',
      question: 'How do you type a function that accepts any number of string arguments?',
      options: [
        'function log(args: string): void',
        'function log(args: string[]): void',
        'function log(...args: string[]): void',
        'function log(args: ...string): void',
      ],
      correct: 2,
      explanation: 'Rest parameters use "...paramName: type[]" syntax. "function log(...args: string[]): void" means the function accepts zero or more string arguments collected into an array called args. The "..." must come before the parameter name.',
    },
  ],
};
