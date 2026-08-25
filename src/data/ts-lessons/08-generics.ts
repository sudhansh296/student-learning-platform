import type { TsLesson } from '../ts-curriculum';

export const tsGenericsLesson: TsLesson = {
  id: 'ts-generics',
  title: 'Generics',
  slug: 'generics',
  chapter: 'advanced',
  order: 8,
  difficulty: 'intermediate',
  readingTime: 10,
  description: 'Write reusable, type-safe functions and interfaces with type parameters - generic functions, interfaces, generic classes, constraints, and defaults.',
  sections: [
    {
      type: 'text',
      content: 'Generics let you write code that works with any type while still being fully type-safe. Instead of using "any" (which loses all type information), a generic uses a placeholder like "T" that TypeScript fills in based on how you call the function or use the type.',
    },
    {
      type: 'analogy',
      title: 'Generics are like blank labels on a box',
      content: 'Imagine a box with a blank label. When you put apples in it, the label reads "apple box". When you put books in it, it reads "book box". Generics work the same way - you write the function once with a placeholder type T, and TypeScript fills in the actual type when you use it. The box (function) is the same; the label (type) adapts to what you put inside.',
    },
    {
      type: 'heading',
      content: 'Generic Functions',
    },
    {
      type: 'example',
      title: 'Writing a function that works with any type',
      content: 'A generic function uses angle brackets to declare a type parameter before the parentheses. When you call the function, TypeScript infers the type from the argument. You can also pass the type explicitly with angle brackets if inference does not work.',
      language: 'typescript',
      code: `// Without generics - loses type information
function firstAny(arr: any[]): any {
  return arr[0]; // returns any - not useful
}

// With generics - preserves the type
function first<T>(arr: T[]): T {
  return arr[0];
}

// TypeScript infers T from the argument:
const num = first([1, 2, 3]);       // T is number, returns number
const str = first(["a", "b", "c"]); // T is string, returns string
const user = first([{ name: "Alice" }]); // T is { name: string }

// Explicitly passing the type parameter:
const n = first<number>([1, 2, 3]);

// More useful generic utilities
function identity<T>(value: T): T {
  return value;
}

function pair<A, B>(first: A, second: B): [A, B] {
  return [first, second];
}

const p = pair("hello", 42); // [string, number]

function wrap<T>(value: T): { value: T } {
  return { value };
}

const wrapped = wrap(42); // { value: number }`,
    },
    {
      type: 'heading',
      content: 'Generic Interfaces',
    },
    {
      type: 'example',
      title: 'Interfaces that work with any type using type parameters',
      content: 'Interfaces can have type parameters too. This lets you define the shape of a data structure once and use it with any type. Common examples are response wrappers, containers, and pagination types that work with any data type.',
      language: 'typescript',
      code: `// Generic API response wrapper
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  timestamp: Date;
}

// Use it with different data types
type UserResponse = ApiResponse<{ id: number; name: string }>;
type ListResponse = ApiResponse<string[]>;

// Paginated result - generic over the item type
interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Generic key-value container
interface KeyValue<K extends string, V> {
  key: K;
  value: V;
}

// Generic pair for any two types
interface Pair<First, Second> {
  first: First;
  second: Second;
}

const coord: Pair<number, number> = { first: 3, second: 4 };
const entry: KeyValue<string, number> = { key: "score", value: 95 };`,
    },
    {
      type: 'heading',
      content: 'Generic Classes',
    },
    {
      type: 'example',
      title: 'A generic Stack data structure',
      content: 'Classes can use type parameters just like functions and interfaces. A classic example is a Stack - a last-in-first-out collection. With generics, one Stack implementation works for numbers, strings, or any other type, while still being fully type-safe.',
      language: 'typescript',
      code: `class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  get size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

// TypeScript infers T from the first push
const numStack = new Stack<number>();
numStack.push(1);
numStack.push(2);
numStack.push(3);
console.log(numStack.pop()); // 3

const strStack = new Stack<string>();
strStack.push("a");
strStack.push("b");
console.log(strStack.peek()); // "b"`,
    },
    {
      type: 'heading',
      content: 'Generic Constraints',
    },
    {
      type: 'example',
      title: 'Constraining type parameters with extends',
      content: 'Sometimes a generic needs to be more than just "any type" - it needs to have certain properties. The "extends" keyword constrains the type parameter. "T extends { length: number }" means T can be any type that has a length property, like string, array, or anything else with a length.',
      language: 'typescript',
      code: `// Constrain T to types that have a .length property
function logLength<T extends { length: number }>(item: T): T {
  console.log("Length:", item.length);
  return item;
}

logLength("hello");        // 5 - string has length
logLength([1, 2, 3]);     // 3 - array has length
// logLength(42);          // Error: number doesnt have length

// Constrain to object types with a specific property
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "Alice", age: 25, email: "a@b.com" };
const name = getProperty(user, "name");   // string
const age = getProperty(user, "age");     // number
// getProperty(user, "phone");             // Error: not a key of user

// Multiple constraints
interface Serializable { serialize(): string }
interface Printable { print(): void }

function process<T extends Serializable & Printable>(item: T): string {
  item.print();
  return item.serialize();
}`,
    },
    {
      type: 'tryit',
      title: 'Try It: Generic Stack Data Structure',
      css: `body{font-family:system-ui,sans-serif;padding:20px;} .stack-viz{background:#f0f9ff;border:1px solid #bae6fd;border-radius:10px;padding:14px;margin-bottom:10px;} h3{color:#0369a1;margin:0 0 8px;font-size:14px;} .item{background:#0369a1;color:white;padding:6px 12px;border-radius:6px;font-size:13px;margin:3px 0;font-family:monospace;} .empty{color:#9ca3af;font-size:13px;font-style:italic;}`,
      js: `// Generic Stack implementation in JavaScript
// In TypeScript: class Stack<T> { push(item: T): void; pop(): T | undefined; }

class Stack {
  constructor() {
    this.items = [];
  }
  push(item) { this.items.push(item); }
  pop() { return this.items.pop(); }
  peek() { return this.items[this.items.length - 1]; }
  get size() { return this.items.length; }
  isEmpty() { return this.items.length === 0; }
  toArray() { return [...this.items]; }
}

// Number stack
const numStack = new Stack();
[10, 20, 30, 40, 50].forEach(n => numStack.push(n));
console.log('Number stack size:', numStack.size);
console.log('Peek:', numStack.peek());
console.log('Pop:', numStack.pop());
console.log('After pop size:', numStack.size);

// String stack
const strStack = new Stack();
['first', 'second', 'third'].forEach(s => strStack.push(s));
console.log('String stack peek:', strStack.peek());

document.getElementById('output').innerHTML =
  '<div class="stack-viz"><h3>Number Stack (top = last)</h3>' +
  numStack.toArray().reverse().map(n =>
    '<div class="item">' + n + '</div>'
  ).join('') + '</div>' +
  '<div class="stack-viz"><h3>String Stack</h3>' +
  strStack.toArray().reverse().map(s =>
    '<div class="item">' + s + '</div>'
  ).join('') + '</div>';`,
    },
  ],
  exercises: [
    {
      id: 'ts-gen-1',
      question: 'What does the "T" in a generic function like function identity<T>(v: T): T mean?',
      type: 'multiple-choice',
      options: [
        'T is a shortcut for "type any"',
        'T is a type parameter - a placeholder that TypeScript fills with the actual type when the function is called',
        'T must always be a TypeScript built-in type',
        'T stands for "Template" and is only for string operations',
      ],
      correct: 1,
      explanation: 'T is a type parameter - a placeholder declared between angle brackets. When you call the function, TypeScript infers (or you specify) what T is based on the argument. The letter T is a convention; you could use any name like Item, Value, or DataType.',
    },
    {
      id: 'ts-gen-2',
      question: 'What does "T extends { length: number }" mean in a generic constraint?',
      type: 'multiple-choice',
      options: [
        'T must be the number type',
        'T must extend the Number class',
        'T can be any type that has a "length" property of type number',
        'T is limited to arrays only',
      ],
      correct: 2,
      explanation: '"T extends { length: number }" constrains T to be any type that has a length property (of type number). Strings, arrays, and any object with a length property satisfy this constraint. Numbers do not, so you could not accidentally pass a plain number.',
    },
  ],
  quiz: [
    {
      id: 'ts-gen-q1',
      question: 'Why are generics preferred over "any" for writing reusable functions?',
      options: [
        'Generics are faster at runtime than using any',
        'Generics preserve type information - the return type relates to the input type',
        'any is deprecated and will be removed from TypeScript',
        'Generics automatically validate data at runtime',
      ],
      correct: 1,
      explanation: 'With "any", TypeScript loses all type information - if a function returns "any", callers get no type safety. With generics, the relationship between input and output types is preserved. If you pass a number[], the function knows it returns number (not any), keeping full type safety at all call sites.',
    },
  ],
};
