import type { TsLesson } from '../ts-curriculum';

export const tsArraysTuplesLesson: TsLesson = {
  id: 'ts-arrays-tuples',
  title: 'Arrays and Tuples',
  slug: 'arrays-tuples',
  chapter: 'types',
  order: 3,
  difficulty: 'beginner',
  readingTime: 10,
  description: 'Typed arrays, readonly arrays, tuples with fixed-length typed sequences, and array destructuring with types.',
  sections: [
    {
      type: 'text',
      content: 'Arrays and tuples are the fundamental collection types in TypeScript. Typed arrays prevent you from mixing incompatible values, while tuples let you define exactly how many items an array contains and what type each position must hold.',
    },
    {
      type: 'heading',
      content: 'Typed Arrays',
    },
    {
      type: 'example',
      title: 'Annotating arrays with element types',
      content: 'TypeScript arrays are annotated by adding [] after the element type. A number[] can only contain numbers - trying to push a string will be a compile error. TypeScript also infers array types from their initial values, so you rarely need to annotate simple arrays explicitly.',
      language: 'typescript',
      code: `// Array annotations - two equivalent syntaxes
let numbers: number[] = [1, 2, 3, 4, 5];
let names: string[] = ["Alice", "Bob", "Charlie"];
let flags: boolean[] = [true, false, true];

// TypeScript infers these automatically:
const scores = [95, 87, 92, 78]; // inferred as number[]
const tags = ["js", "ts", "react"]; // inferred as string[]

// Array methods are fully typed
numbers.push(6);         // OK
// numbers.push("hello"); // Error: Argument of type 'string' is not assignable to type 'number'

// Map, filter, reduce - TypeScript knows the types
const doubled = numbers.map(n => n * 2);  // number[]
const long = names.filter(s => s.length > 3); // string[]

// Mixed types - union array
const mixed: (string | number)[] = [1, "two", 3, "four"];`,
    },
    {
      type: 'heading',
      content: 'Generic Array Syntax',
    },
    {
      type: 'example',
      title: 'Array<T> - the generic form of array types',
      content: 'TypeScript offers two syntaxes for array types: T[] and Array<T>. Both are identical. Array<T> reads as "an array of T". This syntax becomes useful when the element type itself is complex, like an array of objects or an array of functions.',
      language: 'typescript',
      code: `// T[] and Array<T> are exactly the same
let nums1: number[] = [1, 2, 3];
let nums2: Array<number> = [1, 2, 3]; // identical

// Array of objects - both syntaxes work
interface User {
  id: number;
  name: string;
}
let users1: User[] = [];
let users2: Array<User> = [];

// Array of functions
let callbacks: Array<() => void> = [];
callbacks.push(() => console.log("clicked"));

// Nested arrays (2D array)
let matrix: number[][] = [[1, 2], [3, 4], [5, 6]];
let grid: Array<Array<string>> = [["a", "b"], ["c", "d"]];

// Empty array - TypeScript needs help here
let items: string[] = []; // Annotate when starting empty
items.push("first");`,
    },
    {
      type: 'heading',
      content: 'Readonly Arrays',
    },
    {
      type: 'example',
      title: 'Preventing array mutation with readonly',
      content: 'A readonly array cannot be modified after creation - no push, pop, or splice. This is useful for constants, configuration data, and when you want to guarantee that a function doesnt mutate an array it receives. Use ReadonlyArray<T> or readonly T[] syntax.',
      language: 'typescript',
      code: `// readonly arrays cannot be mutated
const COLORS: readonly string[] = ["red", "green", "blue"];
// COLORS.push("yellow"); // Error: Property 'push' does not exist on type 'readonly string[]'
// COLORS[0] = "purple";  // Error: Cannot assign to '0' because it is a read-only property

// ReadonlyArray<T> is equivalent
const SIZES: ReadonlyArray<number> = [8, 10, 12, 14, 16];

// Useful for function parameters - promise you wont mutate it
function sum(nums: readonly number[]): number {
  return nums.reduce((acc, n) => acc + n, 0);
}

// const assertions also produce readonly arrays
const DIRECTIONS = ["north", "south", "east", "west"] as const;
// DIRECTIONS is now readonly ["north", "south", "east", "west"]
// Each element is also a literal type, not just string

type Direction = typeof DIRECTIONS[number]; // "north" | "south" | "east" | "west"`,
    },
    {
      type: 'heading',
      content: 'Tuples',
    },
    {
      type: 'example',
      title: 'Tuples - fixed-length arrays with typed positions',
      content: 'A tuple is an array with a fixed number of elements where each position has a specific type. Unlike a regular array where all elements share the same type, each tuple position can have a different type. Tuples are perfect for representing pairs, triples, or any structured list where position matters.',
      language: 'typescript',
      code: `// Basic tuple - [string, number]
let person: [string, number] = ["Alice", 25];
// person = [25, "Alice"]; // Error: wrong order!
// person = ["Alice", 25, true]; // Error: too many elements

// Access by index - TypeScript knows each position's type
const name: string = person[0]; // TypeScript knows index 0 is string
const age: number = person[1];  // TypeScript knows index 1 is number

// Destructuring tuples
const [username, userAge] = person;
// username is string, userAge is number

// Named tuple elements (TypeScript 4.0+)
type RGB = [red: number, green: number, blue: number];
const blue: RGB = [0, 0, 255];

// Optional tuple elements
type OptionalPair = [string, number?];
const a: OptionalPair = ["hello"];      // OK
const b: OptionalPair = ["hello", 42];  // OK

// useState returns a tuple-like structure
function useState<T>(initial: T): [T, (val: T) => void] {
  let value = initial;
  const setter = (val: T) => { value = val; };
  return [value, setter];
}`,
    },
    {
      type: 'tryit',
      title: 'Try It: Arrays and Tuples',
      css: `body{font-family:system-ui,sans-serif;padding:20px;} .box{background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:12px;margin-bottom:10px;} h3{color:#0369a1;margin:0 0 8px;font-size:14px;} p{margin:3px 0;font-size:13px;color:#374151;}`,
      js: `// Arrays and tuples demonstrated in JavaScript

// Typed array simulation
const numbers = [1, 2, 3, 4, 5];
const names = ["Alice", "Bob", "Charlie"];

console.log('numbers:', JSON.stringify(numbers));
console.log('doubled:', JSON.stringify(numbers.map(n => n * 2)));
console.log('filtered (>2):', JSON.stringify(numbers.filter(n => n > 2)));

// Readonly simulation
const COLORS = Object.freeze(["red", "green", "blue"]);
try {
  COLORS.push("yellow");
} catch(e) {
  console.log('Readonly error:', e.message);
}

// Tuple-like usage
const userTuple = ["Alice", 25, "developer"];
const [userName, userAge, userRole] = userTuple;
console.log('Tuple destructured:', userName, userAge, userRole);

// RGB tuple
const blue = [0, 0, 255];
const [r, g, b] = blue;
console.log('RGB:', 'r=' + r, 'g=' + g, 'b=' + b);

document.getElementById('output').innerHTML =
  '<div class="box"><h3>Array Operations</h3>' +
  '<p>Original: [' + numbers + ']</p>' +
  '<p>Doubled: [' + numbers.map(n => n * 2) + ']</p>' +
  '<p>Sum: ' + numbers.reduce((a, b) => a + b, 0) + '</p></div>' +
  '<div class="box"><h3>Tuple</h3>' +
  '<p>["' + userName + '", ' + userAge + ', "' + userRole + '"]</p>' +
  '<p>Position 0 is always the name, position 1 the age</p></div>';`,
    },
  ],
  exercises: [
    {
      id: 'ts-arrays-1',
      question: 'What does "number[]" mean in TypeScript?',
      type: 'multiple-choice',
      options: [
        'A single number value',
        'An array that can contain numbers and other types',
        'An array where every element must be a number',
        'A fixed-size array of exactly one number',
      ],
      correct: 2,
      explanation: 'number[] means an array where every element must be a number. Trying to push a string or boolean into a number[] will be a TypeScript compile error. It is equivalent to Array<number>.',
    },
    {
      id: 'ts-arrays-2',
      question: 'What is a tuple in TypeScript?',
      type: 'multiple-choice',
      options: [
        'An array with elements of the same type',
        'A fixed-length array where each position has a specific type',
        'A readonly array that cannot be modified',
        'An array with optional elements only',
      ],
      correct: 1,
      explanation: 'A tuple is a fixed-length array where each position has a specific, potentially different type. For example, [string, number] is a tuple where position 0 must be a string and position 1 must be a number.',
    },
  ],
  quiz: [
    {
      id: 'ts-arrays-q1',
      question: 'What does "readonly string[]" prevent?',
      options: [
        'Reading elements from the array',
        'Creating the array with initial values',
        'Mutating the array (push, pop, splice, assignment)',
        'Passing the array to functions',
      ],
      correct: 2,
      explanation: 'A readonly array prevents mutation - you cannot call push, pop, splice, or assign to indices. You can still read elements and pass it to functions. This is useful for constants and for expressing that a function promises not to modify an array it receives.',
    },
  ],
};
