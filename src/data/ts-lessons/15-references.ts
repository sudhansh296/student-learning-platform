import type { TsLesson } from '../ts-curriculum';

export const tsReferencesLesson: TsLesson = {
  id: 'ts-references',
  title: 'TypeScript Quick Reference',
  slug: 'references',
  chapter: 'practical',
  order: 15,
  difficulty: 'beginner',
  readingTime: 10,
  description: 'Complete TypeScript cheat sheet — all types, common patterns, tsconfig options, and utility types at a glance.',
  sections: [
    {
      type: 'text',
      content: 'This reference covers all the TypeScript syntax and patterns from the tutorial in one place. Bookmark it for quick lookups while building real projects.',
    },
    {
      type: 'heading',
      content: 'Type Annotations Reference',
    },
    {
      type: 'table',
      title: 'Primitive and Special Types',
      headers: ['Type', 'Example', 'Notes'],
      rows: [
        ['string', 'let name: string = "Alice"', 'Text values'],
        ['number', 'let age: number = 25', 'All numbers — int, float, etc.'],
        ['boolean', 'let on: boolean = true', 'true or false'],
        ['null', 'let x: null = null', 'Explicit null'],
        ['undefined', 'let y: undefined', 'Unassigned value'],
        ['any', 'let z: any = anything', 'Opt out of type checking — avoid'],
        ['unknown', 'let u: unknown = input', 'Safe version of any — must narrow'],
        ['never', 'function err(): never { throw }', 'Function that never returns'],
        ['void', 'function log(): void {}', 'No return value'],
        ['object', 'let o: object = {}', 'Any non-primitive'],
        ['symbol', 'let s: symbol = Symbol()', 'Unique symbols'],
        ['bigint', 'let b: bigint = 9007199254740993n', 'Large integers'],
      ],
    },
    {
      type: 'table',
      title: 'Array and Object Types',
      headers: ['Syntax', 'Meaning'],
      rows: [
        ['string[]', 'Array of strings'],
        ['Array<number>', 'Array of numbers (same as number[])'],
        ['readonly string[]', 'Immutable array'],
        ['[string, number]', 'Tuple: exactly string then number'],
        ['{ name: string; age: number }', 'Inline object type'],
        ['interface User { ... }', 'Named object type (reusable)'],
        ['type Point = { x: number; y: number }', 'Type alias for object'],
        ['Record<string, number>', 'Object with string keys and number values'],
      ],
    },
    {
      type: 'heading',
      content: 'Common Patterns',
    },
    {
      type: 'example',
      title: 'The most common TypeScript patterns in one place',
      content: 'These patterns appear in virtually every TypeScript project. Learn them well and most TypeScript code will feel natural.',
      language: 'typescript',
      code: `// 1. Optional and default parameters
function greet(name: string, title?: string, greeting: string = "Hello"): string {
  return greeting + ", " + (title ? title + " " : "") + name;
}

// 2. Union types
type Status = "active" | "inactive" | "pending";
type IdOrName = number | string;

// 3. Nullable pattern
type Maybe<T> = T | null | undefined;
function findUser(id: number): Maybe<string> {
  return id === 1 ? "Alice" : null;
}

// 4. Narrowing with typeof
function process(val: string | number) {
  if (typeof val === "string") return val.toUpperCase();
  return val * 2;
}

// 5. Type assertion (use sparingly)
const input = document.getElementById("search") as HTMLInputElement;

// 6. Non-null assertion (use sparingly)
const el = document.getElementById("app")!; // you guarantee it exists

// 7. Generic function
function first<T>(arr: T[]): T | undefined { return arr[0]; }

// 8. Async with typed return
async function fetchData<T>(url: string): Promise<T> {
  const res = await fetch(url);
  return res.json() as Promise<T>;
}`,
    },
    {
      type: 'heading',
      content: 'Utility Types Reference',
    },
    {
      type: 'table',
      title: 'Built-in Utility Types',
      headers: ['Utility Type', 'What it Does', 'Example'],
      rows: [
        ['Partial<T>', 'All properties optional', 'Partial<User> — all fields optional'],
        ['Required<T>', 'All properties required', 'Required<Config> — no optional fields'],
        ['Readonly<T>', 'All properties readonly', 'Readonly<Config> — no mutation'],
        ['Pick<T, K>', 'Include only listed properties', 'Pick<User, "id" | "name">'],
        ['Omit<T, K>', 'Exclude listed properties', 'Omit<User, "password">'],
        ['Record<K, V>', 'Object with keys K and values V', 'Record<string, number>'],
        ['Exclude<T, U>', 'Remove U from union T', 'Exclude<string | number, string>'],
        ['Extract<T, U>', 'Keep only types in both T and U', 'Extract<string | null, string>'],
        ['NonNullable<T>', 'Remove null and undefined', 'NonNullable<string | null>'],
        ['ReturnType<T>', 'Return type of function T', 'ReturnType<typeof getUser>'],
        ['Parameters<T>', 'Parameter types of function T', 'Parameters<typeof createUser>'],
        ['Awaited<T>', 'Unwrap Promise type', 'Awaited<Promise<string>>'],
      ],
    },
    {
      type: 'heading',
      content: 'tsconfig.json Quick Reference',
    },
    {
      type: 'table',
      title: 'Key tsconfig Options',
      headers: ['Option', 'Recommended', 'What it Does'],
      rows: [
        ['"strict": true', 'Always on', 'Enables all strict type checks'],
        ['"target": "ES2022"', 'For Node 18+', 'Output JavaScript version'],
        ['"module": "commonjs"', 'For Node.js', 'Module system for output'],
        ['"outDir": "./dist"', 'Required', 'Where compiled JS goes'],
        ['"rootDir": "./src"', 'Recommended', 'Where TypeScript source is'],
        ['"sourceMap": true', 'Recommended', 'Enable debugging source maps'],
        ['"resolveJsonModule": true', 'Useful', 'Allow importing .json files'],
        ['"skipLibCheck": true', 'Yes', 'Skip type checking node_modules'],
        ['"noUnusedLocals": true', 'Recommended', 'Error on unused variables'],
        ['"noUnusedParameters": true', 'Recommended', 'Error on unused parameters'],
      ],
    },
    {
      type: 'heading',
      content: 'Interface vs Type Alias',
    },
    {
      type: 'example',
      title: 'When to use interface vs type',
      content: 'Both interface and type can describe object shapes. The key differences: interfaces can be extended with extends and can be re-opened (declaration merging). Type aliases can describe unions, intersections, primitives, and tuples — not just objects. A practical rule: use interface for objects that might be extended; use type for unions and non-object types.',
      language: 'typescript',
      code: `// Use interface for extensible object shapes
interface Animal {
  name: string;
}
interface Dog extends Animal {
  breed: string;
}

// Interfaces support declaration merging
interface Window {
  myCustomProp: string; // added to the global Window type
}

// Use type for unions, intersections, and non-objects
type StringOrNumber = string | number;
type Nullable<T> = T | null;
type Callback = () => void;

// Both work for simple object shapes — pick a style and be consistent
interface UserInterface { id: number; name: string; }
type UserType = { id: number; name: string; };`,
    },
    {
      type: 'tryit',
      title: 'Try It: TypeScript Type Explorer',
      css: `body{font-family:system-ui,sans-serif;padding:20px;} .type-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;} .type-card{background:#f0f7ff;border:1px solid #bfdbfe;border-radius:8px;padding:10px;} .type-name{font-weight:700;color:#1d4ed8;font-size:12px;font-family:monospace;} .type-desc{font-size:11px;color:#6b7280;margin-top:3px;} .result-section{margin-top:14px;} h3{color:#1e40af;font-size:13px;margin:0 0 8px;}`,
      js: `// TypeScript reference — interactive type explorer

// Demonstrating key TypeScript concepts
const typeSystem = {
  primitives: ['string', 'number', 'boolean', 'null', 'undefined', 'bigint', 'symbol'],
  special: ['any', 'unknown', 'never', 'void'],
  collections: ['T[]', 'Array<T>', 'readonly T[]', '[T1, T2]', 'Record<K,V>'],
  utilities: ['Partial<T>', 'Required<T>', 'Readonly<T>', 'Pick<T,K>', 'Omit<T,K>'],
};

// Demonstrate utility type transformations
const user = { id: 1, name: 'Alice', email: 'alice@example.com', password: 'hash123' };

// Pick simulation
function pick(obj, keys) {
  return keys.reduce((acc, k) => { acc[k] = obj[k]; return acc; }, {});
}

// Omit simulation
function omit(obj, keys) {
  return Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)));
}

// Partial simulation
function makePartial(obj) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v ?? undefined]));
}

const publicUser = pick(user, ['id', 'name', 'email']);
const safeUser = omit(user, ['password']);

console.log('Original:', JSON.stringify(user));
console.log('Pick(id,name,email):', JSON.stringify(publicUser));
console.log('Omit(password):', JSON.stringify(safeUser));

Object.entries(typeSystem).forEach(([category, types]) => {
  console.log(category + ':', types.join(', '));
});

document.getElementById('output').innerHTML =
  '<h3>TypeScript Type System</h3>' +
  '<div class="type-grid">' +
  Object.entries(typeSystem).map(([cat, types]) =>
    '<div class="type-card"><div class="type-name">' + cat + '</div>' +
    types.map(t => '<div class="type-desc">' + t + '</div>').join('') +
    '</div>'
  ).join('') +
  '</div>' +
  '<div class="result-section"><h3>Utility Types in Action</h3>' +
  '<div class="type-card"><div class="type-name">Pick&lt;User, "id"|"name"|"email"&gt;</div>' +
  '<div class="type-desc">' + JSON.stringify(publicUser) + '</div></div>' +
  '<div class="type-card" style="margin-top:8px"><div class="type-name">Omit&lt;User, "password"&gt;</div>' +
  '<div class="type-desc">' + JSON.stringify(safeUser) + '</div></div></div>';`,
    },
  ],
  exercises: [
    {
      id: 'ts-ref-1',
      question: 'Which TypeScript utility type would you use to create an update endpoint payload where all fields are optional?',
      type: 'multiple-choice',
      options: ['Required<T>', 'Partial<T>', 'Readonly<T>', 'Omit<T, K>'],
      correct: 1,
      explanation: 'Partial<T> makes all properties of T optional. This is the standard pattern for update/PATCH endpoints where callers only provide the fields they want to change. Combined with Omit, you can also exclude server-managed fields like "id": Partial<Omit<User, "id">>.',
    },
    {
      id: 'ts-ref-2',
      question: 'What is the main practical difference between "interface" and "type" in TypeScript?',
      type: 'multiple-choice',
      options: [
        'interface is faster at runtime; type is slower',
        'interface can only describe objects; type can describe unions, intersections, primitives, and more',
        'type supports extends but interface does not',
        'interface is deprecated in TypeScript 5',
      ],
      correct: 1,
      explanation: 'Both interface and type can describe object shapes. The key difference: type can describe anything — unions (A | B), intersections (A & B), primitives, function types, and more. Interfaces are specifically for object shapes and support declaration merging and class implementation via "implements".',
    },
  ],
  quiz: [
    {
      id: 'ts-ref-q1',
      question: 'What does "strict": true in tsconfig.json enable?',
      options: [
        'Only strictNullChecks',
        'A collection of strict checks including strictNullChecks, noImplicitAny, strictFunctionTypes, and more',
        'It prevents all use of JavaScript files in the project',
        'It enables type checking at runtime',
      ],
      correct: 1,
      explanation: '"strict": true enables a suite of stricter type checking flags in one go: strictNullChecks, noImplicitAny, strictFunctionTypes, strictBindCallApply, strictPropertyInitialization, and others. Always enable it. Without it, TypeScript is much more permissive and catches far fewer bugs.',
    },
  ],
};
