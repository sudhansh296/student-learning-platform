import type { TsLesson } from '../ts-curriculum';

export const tsBasicTypesLesson: TsLesson = {
  id: 'ts-basic-types',
  title: 'Basic Types',
  slug: 'basic-types',
  chapter: 'types',
  order: 2,
  difficulty: 'beginner',
  readingTime: 10,
  description: 'All primitive TypeScript types — string, number, boolean, null, undefined, any, unknown, never, void, and type inference.',
  sections: [
    {
      type: 'text',
      content: 'TypeScript has all the JavaScript primitive types plus several special types that give you precise control over what values are allowed. Understanding these types is the foundation of everything else in TypeScript.',
    },
    {
      type: 'heading',
      content: 'Primitive Types',
    },
    {
      type: 'example',
      title: 'string, number, boolean — the everyday primitives',
      content: 'These three types cover the vast majority of variables you will annotate. TypeScript can infer them automatically from the initial value, so explicit annotations are often optional — but useful when declaring a variable before assigning it.',
      language: 'typescript',
      code: `// string
let firstName: string = "Alice";
let greeting: string = 'Hello, world';
let template: string = "Name: " + firstName; // no template literals with vars in code strings

// number — all numbers are the same type in TypeScript (int, float, etc.)
let age: number = 25;
let price: number = 9.99;
let hex: number = 0xff;
let binary: number = 0b1010;

// boolean
let isLoggedIn: boolean = true;
let hasPremium: boolean = false;

// Type inference — TypeScript figures it out from the value
let city = "New York";     // inferred as string
let score = 100;           // inferred as number
let active = true;         // inferred as boolean

// Declare without initializing — must annotate
let username: string;
username = "bob123";       // OK
// username = 42;          // Error: Type 'number' is not assignable to type 'string'`,
    },
    {
      type: 'heading',
      content: 'Special Types: any, unknown, never, void',
    },
    {
      type: 'example',
      title: 'The special types and when to use each',
      content: 'TypeScript provides special types for unusual situations. "any" opts out of type checking entirely (avoid it). "unknown" is the safe version of "any" — you must check the type before using the value. "void" marks functions that return nothing. "never" marks code that never reaches the end.',
      language: 'typescript',
      code: `// any — disables type checking (avoid unless migrating JS)
let data: any = "hello";
data = 42;          // OK — any accepts anything
data = { x: 1 };   // OK — no type safety at all

// unknown — safe alternative to any
let input: unknown = getUserInput();
// console.log(input.toUpperCase()); // Error! Must check first
if (typeof input === "string") {
  console.log(input.toUpperCase()); // OK — TypeScript knows its a string here
}

// void — function that returns nothing
function logMessage(msg: string): void {
  console.log(msg);
  // no return statement needed
}

// never — function that never returns (throws or infinite loop)
function throwError(message: string): never {
  throw new Error(message);
}

function getUserInput(): unknown {
  return "hello";
}`,
    },
    {
      type: 'heading',
      content: 'null and undefined',
    },
    {
      type: 'example',
      title: 'Handling null and undefined safely',
      content: 'By default TypeScript separates null and undefined from other types. With strictNullChecks enabled (the default in strict mode), you cannot assign null to a string variable unless you explicitly include null in the type. This prevents the infamous "Cannot read properties of null" runtime error.',
      language: 'typescript',
      code: `// Without strictNullChecks (not recommended):
// let name: string = null; // would be allowed

// With strictNullChecks (default in strict mode):
let name: string = "Alice";
// name = null;  // Error: Type 'null' is not assignable to type 'string'

// To allow null, use a union type:
let nickname: string | null = null;
nickname = "Ally";  // OK
nickname = null;    // OK

// undefined works the same way
let score: number | undefined = undefined;
score = 95;

// Optional chaining handles potential null/undefined safely
const user = { profile: null as { bio: string } | null };
const bio = user.profile?.bio; // "string | undefined" — safe
// const bio2 = user.profile.bio; // Error! profile could be null`,
    },
    {
      type: 'heading',
      content: 'Type Inference',
    },
    {
      type: 'example',
      title: 'Let TypeScript infer types automatically',
      content: 'TypeScript is very good at inferring types from context. You rarely need to annotate everything explicitly. The key rule: annotate function parameters and return types (inference is less reliable there), but let TypeScript infer variable types from their initial values.',
      language: 'typescript',
      code: `// TypeScript infers all of these correctly:
const message = "hello";          // string
const count = 42;                 // number
const items = [1, 2, 3];          // number[]
const pair = ["Alice", 30];       // (string | number)[]

// Infers return type from the function body
function double(n: number) {
  return n * 2;  // TypeScript infers return type: number
}

// Infers from conditional
function getLabel(value: number) {
  if (value > 0) return "positive";  // string
  if (value < 0) return "negative";  // string
  return "zero";                      // string
  // Inferred return type: string
}

// When NOT to rely on inference — annotate explicitly:
// 1. Function parameters (TypeScript cant infer these)
// 2. When declaring before assigning
// 3. When the inferred type is too wide for your needs
let result: string;   // declared before use — needs annotation
result = double(5).toString();`,
    },
    {
      type: 'tryit',
      title: 'Try It: Basic Types in Action',
      css: `body{font-family:system-ui,sans-serif;padding:20px;} .type-demo{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;margin-bottom:10px;} .type-name{font-weight:700;color:#3178c6;font-size:13px;} .type-value{font-size:13px;color:#374151;margin-top:4px;}`,
      js: `// Demonstrating TypeScript type behaviors in JavaScript

function checkType(value) {
  return typeof value;
}

// Primitive types
const examples = [
  { name: 'string', value: "Hello TypeScript" },
  { name: 'number', value: 42 },
  { name: 'boolean', value: true },
  { name: 'null', value: null },
  { name: 'undefined', value: undefined },
];

examples.forEach(ex => {
  console.log(ex.name + ':', JSON.stringify(ex.value), '| typeof:', typeof ex.value);
});

// Type narrowing simulation (what TypeScript does at compile time)
function processValue(val) {
  if (typeof val === 'string') {
    console.log('String result:', val.toUpperCase());
  } else if (typeof val === 'number') {
    console.log('Number result:', val * 2);
  } else if (typeof val === 'boolean') {
    console.log('Boolean result:', !val);
  } else {
    console.log('Unknown type:', val);
  }
}

processValue("typescript");
processValue(21);
processValue(false);

document.getElementById('output').innerHTML = examples.map(ex =>
  '<div class="type-demo"><div class="type-name">' + ex.name + '</div>' +
  '<div class="type-value">Value: ' + JSON.stringify(ex.value) + ' | typeof: ' + typeof ex.value + '</div></div>'
).join('');`,
    },
  ],
  exercises: [
    {
      id: 'ts-types-1',
      question: 'What is the difference between "any" and "unknown" in TypeScript?',
      type: 'multiple-choice',
      options: [
        'They are identical — both disable type checking',
        '"any" disables type checking entirely; "unknown" requires a type check before use',
        '"unknown" is only for undefined values; "any" handles everything else',
        '"any" is for TypeScript 4+; "unknown" is the older version',
      ],
      correct: 1,
      explanation: '"any" completely disables type checking — you can call any method or access any property on it. "unknown" is safer: TypeScript forces you to narrow the type (with typeof, instanceof, etc.) before you can use the value. Prefer unknown over any.',
    },
    {
      id: 'ts-types-2',
      question: 'Which type annotation do you use for a variable that might be a string or null?',
      type: 'multiple-choice',
      options: [
        'string',
        'string?',
        'string | null',
        'nullable<string>',
      ],
      correct: 2,
      explanation: 'In TypeScript, union types use the pipe operator (|). To allow both string and null, write "string | null". This is the standard way to express nullable values in TypeScript.',
    },
  ],
  quiz: [
    {
      id: 'ts-types-q1',
      question: 'When does TypeScript infer the type of a variable automatically?',
      options: [
        'Never — you must always annotate types explicitly',
        'Only for primitive types like string and number',
        'When a variable is initialized with a value at declaration',
        'Only inside function bodies',
      ],
      correct: 2,
      explanation: 'TypeScript infers the type of a variable when it is initialized with a value. For example, "const name = Alice" gives name the type string without any annotation. Inference works for variables, function return types, and many other situations.',
    },
  ],
};
