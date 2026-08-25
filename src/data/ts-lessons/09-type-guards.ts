import type { TsLesson } from '../ts-curriculum';

export const tsTypeGuardsLesson: TsLesson = {
  id: 'ts-type-guards',
  title: 'Type Guards and Narrowing',
  slug: 'type-guards',
  chapter: 'advanced',
  order: 9,
  difficulty: 'intermediate',
  readingTime: 10,
  description: 'Safely narrow union types using typeof, instanceof, in, and custom type predicates with the is keyword.',
  sections: [
    {
      type: 'text',
      content: 'Type narrowing is how TypeScript figures out the specific type inside a union. When you have "string | number", you cannot call .toUpperCase() directly because it might be a number. TypeScript watches your if-statements and narrows the type automatically - once you check typeof === "string", it knows everything in that block is a string.',
    },
    {
      type: 'heading',
      content: 'typeof Guard',
    },
    {
      type: 'example',
      title: 'Using typeof to narrow primitive types',
      content: 'The typeof operator returns a string describing the type of a value. TypeScript understands typeof checks and narrows the type accordingly inside each branch. This works for: "string", "number", "boolean", "bigint", "symbol", "undefined", and "function".',
      language: 'typescript',
      code: `function formatValue(value: string | number | boolean): string {
  if (typeof value === "string") {
    // TypeScript knows: value is string here
    return value.toUpperCase();
  }
  if (typeof value === "number") {
    // TypeScript knows: value is number here
    return value.toFixed(2);
  }
  // TypeScript knows: value is boolean here (only type left)
  return value ? "Yes" : "No";
}

console.log(formatValue("hello")); // "HELLO"
console.log(formatValue(3.14));    // "3.14"
console.log(formatValue(true));    // "Yes"

// typeof also narrows out null/undefined
function getLength(value: string | null | undefined): number {
  if (typeof value === "string") {
    return value.length; // Safe - definitely a string
  }
  return 0;
}

// Shorthand null checks also narrow:
function process(name: string | null) {
  if (name === null) return;
  // TypeScript knows name is string here
  console.log(name.toUpperCase());
}`,
    },
    {
      type: 'heading',
      content: 'instanceof Guard',
    },
    {
      type: 'example',
      title: 'Narrowing class instances with instanceof',
      content: 'The instanceof operator checks if an object is an instance of a particular class. TypeScript uses this to narrow the type inside the branch. This is especially useful when working with Error subclasses or any class hierarchy.',
      language: 'typescript',
      code: `class Dog {
  name: string;
  constructor(name: string) { this.name = name; }
  bark(): string { return this.name + " says: Woof!"; }
}

class Cat {
  name: string;
  constructor(name: string) { this.name = name; }
  meow(): string { return this.name + " says: Meow!"; }
}

type Pet = Dog | Cat;

function makeSound(pet: Pet): string {
  if (pet instanceof Dog) {
    // TypeScript knows: pet is Dog
    return pet.bark();
  }
  // TypeScript knows: pet is Cat (only other option)
  return pet.meow();
}

// instanceof with Error subclasses - very common pattern
function handleError(err: unknown): string {
  if (err instanceof TypeError) {
    return "Type error: " + err.message;
  }
  if (err instanceof RangeError) {
    return "Range error: " + err.message;
  }
  if (err instanceof Error) {
    return "Error: " + err.message;
  }
  return "Unknown error";
}`,
    },
    {
      type: 'heading',
      content: 'in Operator Guard',
    },
    {
      type: 'example',
      title: 'Checking for property existence with the in operator',
      content: 'The "in" operator checks if a property exists on an object. TypeScript uses it to narrow union types where different types have different properties. This is the most reliable way to distinguish between plain objects in a union when you do not have a discriminant property.',
      language: 'typescript',
      code: `interface Car {
  make: string;
  model: string;
  horsepower: number;
}

interface Bicycle {
  brand: string;
  gears: number;
  isElectric: boolean;
}

type Vehicle = Car | Bicycle;

function describeVehicle(v: Vehicle): string {
  if ("horsepower" in v) {
    // TypeScript knows: v is Car
    return v.make + " " + v.model + " (" + v.horsepower + "hp)";
  }
  // TypeScript knows: v is Bicycle
  return v.brand + " bicycle - " + v.gears + " gears";
}

// "in" is also good for optional properties
interface Admin {
  name: string;
  adminLevel: number;
}

interface RegularUser {
  name: string;
  email: string;
}

function greet(user: Admin | RegularUser): string {
  if ("adminLevel" in user) {
    return "Admin " + user.name + " (level " + user.adminLevel + ")";
  }
  return "User " + user.name + " - " + user.email;
}`,
    },
    {
      type: 'heading',
      content: 'Custom Type Predicates',
    },
    {
      type: 'example',
      title: 'Writing reusable type guards with "is"',
      content: 'A custom type predicate is a function whose return type is "paramName is Type". When this function returns true, TypeScript narrows the type of that parameter to Type in the caller. This lets you extract complex narrowing logic into reusable named functions.',
      language: 'typescript',
      code: `interface Fish {
  swim(): void;
  name: string;
}

interface Bird {
  fly(): void;
  name: string;
}

// Type predicate - "pet is Fish" narrows the caller
function isFish(pet: Fish | Bird): pet is Fish {
  return "swim" in pet;
}

function move(pet: Fish | Bird): void {
  if (isFish(pet)) {
    pet.swim(); // TypeScript knows pet is Fish
  } else {
    pet.fly();  // TypeScript knows pet is Bird
  }
}

// Common pattern: isString, isNumber helpers
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNotNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

// Filter out nulls from an array type-safely
const maybeNames: (string | null)[] = ["Alice", null, "Bob", null, "Carol"];
const names: string[] = maybeNames.filter(isNotNull);
// names is string[], not (string | null)[]`,
    },
    {
      type: 'tryit',
      title: 'Try It: Type Guards in Action',
      css: `body{font-family:system-ui,sans-serif;padding:20px;} .result{padding:8px 12px;border-radius:6px;margin-bottom:8px;font-size:13px;} .string-result{background:#f0fdf4;border-left:3px solid #22c55e;} .number-result{background:#eff6ff;border-left:3px solid #3b82f6;} .bool-result{background:#fefce8;border-left:3px solid #eab308;} .label{font-weight:700;font-size:11px;text-transform:uppercase;margin-bottom:2px;}`,
      js: `// Type guards and narrowing in JavaScript

function formatValue(value) {
  if (typeof value === 'string') {
    return { type: 'string', result: value.toUpperCase() };
  }
  if (typeof value === 'number') {
    return { type: 'number', result: value.toFixed(2) };
  }
  if (typeof value === 'boolean') {
    return { type: 'bool', result: value ? 'Yes' : 'No' };
  }
  return { type: 'unknown', result: String(value) };
}

// Custom type predicate equivalent
function isString(val) { return typeof val === 'string'; }
function isNotNull(val) { return val !== null && val !== undefined; }

const values = ['hello typescript', 3.14159, true, 42, 'world', false];
const results = values.map(v => ({ input: v, ...formatValue(v) }));

results.forEach(r => {
  console.log('Input:', JSON.stringify(r.input), '-> Type:', r.type, '-> Result:', r.result);
});

// Filter nulls with type predicate equivalent
const maybeNames = ['Alice', null, 'Bob', null, 'Carol'];
const names = maybeNames.filter(isNotNull);
console.log('After null filter:', JSON.stringify(names));

const styleMap = { string: 'string-result', number: 'number-result', bool: 'bool-result', unknown: 'string-result' };

document.getElementById('output').innerHTML = results.map(r =>
  '<div class="result ' + (styleMap[r.type] || 'string-result') + '">' +
  '<div class="label">' + r.type + '</div>' +
  JSON.stringify(r.input) + ' → ' + r.result + '</div>'
).join('');`,
    },
  ],
  exercises: [
    {
      id: 'ts-guard-1',
      question: 'What does type narrowing mean in TypeScript?',
      type: 'multiple-choice',
      options: [
        'Making a type more specific based on a condition check',
        'Removing properties from an interface',
        'Converting a type to a smaller number type',
        'Filtering an array to a smaller size',
      ],
      correct: 0,
      explanation: 'Type narrowing means TypeScript makes the type more specific (narrows it) based on a runtime check. If you have "string | number" and check "typeof x === string", TypeScript knows x is a string inside that block and gives you access to string methods.',
    },
    {
      id: 'ts-guard-2',
      question: 'What does a type predicate function "function isString(v: unknown): v is string" do?',
      type: 'multiple-choice',
      options: [
        'It converts v to a string at runtime',
        'It tells TypeScript to narrow the type of v to string when the function returns true',
        'It checks if v is a valid string at compile time only',
        'It throws an error if v is not a string',
      ],
      correct: 1,
      explanation: 'A type predicate with "v is string" tells TypeScript: when this function returns true, narrow the type of v to string in the caller. This lets you extract complex type checking logic into a reusable function while keeping the type narrowing effect.',
    },
  ],
  quiz: [
    {
      id: 'ts-guard-q1',
      question: 'Which type guard is best for distinguishing between two plain object types in a union?',
      options: [
        'typeof - it checks the primitive type',
        'instanceof - it checks class instances',
        'in - it checks if a property exists on the object',
        'as - it asserts the type',
      ],
      correct: 2,
      explanation: 'The "in" operator is best for distinguishing between plain object types in a union. If two types have different properties, "someProperty in obj" lets TypeScript narrow which type you have. "typeof" works for primitives, "instanceof" for class instances, but "in" is the tool for plain object unions.',
    },
  ],
};
