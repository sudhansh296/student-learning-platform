import type { TsLesson } from '../ts-curriculum';

export const tsTypeAliasesLesson: TsLesson = {
  id: 'ts-type-aliases',
  title: 'Type Aliases and Union Types',
  slug: 'type-aliases',
  chapter: 'types',
  order: 6,
  difficulty: 'intermediate',
  readingTime: 10,
  description: 'The type keyword, union types (A | B), intersection types (A & B), literal types, and discriminated unions.',
  sections: [
    {
      type: 'text',
      content: 'Type aliases and union types are among the most powerful features in TypeScript. A type alias gives any type a name. Union types let a value be one of several types. Together they let you model real-world data that can take multiple forms — like an API response that might be a success or an error.',
    },
    {
      type: 'heading',
      content: 'Type Aliases',
    },
    {
      type: 'example',
      title: 'The type keyword — naming any type',
      content: 'The "type" keyword creates an alias for any type — primitives, objects, functions, unions, or combinations. Unlike interfaces, type aliases can describe any type, not just objects. Use "type" when you need to name a union, intersection, primitive, or function type.',
      language: 'typescript',
      code: `// Type aliases for primitives
type UserId = number;
type Username = string;

let id: UserId = 42;
let name: Username = "alice";

// Type alias for an object shape (like interface)
type Point = {
  x: number;
  y: number;
};

const origin: Point = { x: 0, y: 0 };
const p: Point = { x: 3, y: 4 };

// Type alias for a function signature
type Comparator<T> = (a: T, b: T) => number;

const sortAsc: Comparator<number> = (a, b) => a - b;
[3, 1, 4, 1, 5].sort(sortAsc); // [1, 1, 3, 4, 5]

// Type vs interface — when to use which:
// Use interface for object shapes that may be extended
// Use type for unions, intersections, primitives, function types`,
    },
    {
      type: 'heading',
      content: 'Union Types',
    },
    {
      type: 'example',
      title: 'A | B — a value that can be one of several types',
      content: 'A union type uses the pipe operator (|) to say a value can be any one of the listed types. This is the TypeScript way to say "this could be a string OR a number". When working with a union, TypeScript requires you to handle each case — a feature called narrowing.',
      language: 'typescript',
      code: `// Basic union type
type StringOrNumber = string | number;

let value: StringOrNumber = "hello";
value = 42;       // also OK
// value = true;  // Error: not in the union

// Narrowing — handle each case
function processInput(input: string | number): string {
  if (typeof input === "string") {
    return input.toUpperCase();  // TypeScript knows: string
  }
  return input.toFixed(2);       // TypeScript knows: number
}

// Union with null — common pattern
type MaybeString = string | null;
function findUser(id: number): string | null {
  if (id === 1) return "Alice";
  return null;
}

const result = findUser(1);
// result.toUpperCase(); // Error! Could be null
if (result !== null) {
  console.log(result.toUpperCase()); // Safe
}

// Multi-type union
type ID = string | number | null;`,
    },
    {
      type: 'heading',
      content: 'Intersection Types',
    },
    {
      type: 'example',
      title: 'A & B — combining multiple types into one',
      content: 'An intersection type uses the ampersand (&) to combine multiple types. The result must satisfy ALL the combined types. This is useful for mixins, composing object types, and adding properties to existing types.',
      language: 'typescript',
      code: `type Named = { name: string };
type Aged = { age: number };

// Intersection — must have BOTH name and age
type Person = Named & Aged;

const alice: Person = {
  name: "Alice",  // from Named
  age: 25,        // from Aged
  // must have both
};

// Practical: adding timestamps to any type
type Timestamps = {
  createdAt: Date;
  updatedAt: Date;
};

type User = {
  id: number;
  name: string;
  email: string;
};

type UserRecord = User & Timestamps;

// Functions can use intersection types
function save<T>(data: T & Timestamps): void {
  console.log("Saved at", data.updatedAt.toISOString());
}`,
    },
    {
      type: 'heading',
      content: 'Literal Types',
    },
    {
      type: 'example',
      title: 'Exact values as types — literal types',
      content: 'A literal type is a type that is a specific value, not just a category. Instead of "string", you can say the type is exactly "north" or "south". Literal types are most powerful in unions — they create an exact set of allowed values, like an enum but lighter.',
      language: 'typescript',
      code: `// String literal type — only these exact strings are valid
type Direction = "north" | "south" | "east" | "west";

function move(dir: Direction): void {
  console.log("Moving", dir);
}
move("north");   // OK
// move("up");   // Error: Argument of type '"up"' is not assignable to type 'Direction'

// Number literal types
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
function rollDice(): DiceRoll {
  return (Math.floor(Math.random() * 6) + 1) as DiceRoll;
}

// Boolean literal (rarely needed but valid)
type AlwaysTrue = true;

// Literal types in function signatures
function setAlignment(align: "left" | "center" | "right"): void {
  document.body.style.textAlign = align;
}

// "as const" makes all values literal types
const config = {
  host: "localhost",
  port: 3000,
} as const;
// config.host is type "localhost", not string`,
    },
    {
      type: 'heading',
      content: 'Discriminated Unions',
    },
    {
      type: 'example',
      title: 'Tagged unions — model state machines safely',
      content: 'A discriminated union is a union of object types where each has a common property (the "discriminant") with a unique literal type value. TypeScript uses this tag to narrow the type automatically in a switch or if statement. This pattern is excellent for modeling state machines, API responses, and events.',
      language: 'typescript',
      code: `// Each shape has a "kind" discriminant property
type Circle = { kind: "circle"; radius: number };
type Rectangle = { kind: "rectangle"; width: number; height: number };
type Triangle = { kind: "triangle"; base: number; height: number };

type Shape = Circle | Rectangle | Triangle;

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      // TypeScript knows shape is Circle here
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      // TypeScript knows shape is Rectangle here
      return shape.width * shape.height;
    case "triangle":
      // TypeScript knows shape is Triangle here
      return 0.5 * shape.base * shape.height;
  }
}

// API response pattern
type ApiSuccess<T> = { status: "success"; data: T };
type ApiError = { status: "error"; message: string; code: number };
type ApiResponse<T> = ApiSuccess<T> | ApiError;

function handleResponse(res: ApiResponse<string[]>) {
  if (res.status === "success") {
    console.log(res.data.length, "items"); // data is string[]
  } else {
    console.error("Error " + res.code + ": " + res.message);
  }
}`,
    },
    {
      type: 'tryit',
      title: 'Try It: Union Types and Discriminated Unions',
      css: `body{font-family:system-ui,sans-serif;padding:20px;} .shape{background:#f0f7ff;border:1px solid #bfdbfe;border-radius:8px;padding:10px;margin-bottom:8px;} .shape-name{font-weight:700;color:#1d4ed8;font-size:13px;} .shape-area{font-size:13px;color:#374151;}`,
      js: `// Union types and discriminated unions in JavaScript

// Simulating union type: string | number
function processInput(input) {
  if (typeof input === 'string') {
    return 'String: ' + input.toUpperCase();
  }
  return 'Number: ' + input.toFixed(2);
}

console.log(processInput('hello'));
console.log(processInput(3.14159));

// Discriminated union — shapes
function getArea(shape) {
  switch (shape.kind) {
    case 'circle':    return Math.PI * shape.radius ** 2;
    case 'rectangle': return shape.width * shape.height;
    case 'triangle':  return 0.5 * shape.base * shape.height;
    default: return 0;
  }
}

const shapes = [
  { kind: 'circle', radius: 5 },
  { kind: 'rectangle', width: 4, height: 6 },
  { kind: 'triangle', base: 3, height: 8 },
];

shapes.forEach(s => {
  const area = getArea(s);
  console.log(s.kind + ' area:', area.toFixed(2));
});

document.getElementById('output').innerHTML =
  '<h3 style="color:#1d4ed8;margin:0 0 10px;font-size:14px;">Shape Areas (discriminated union)</h3>' +
  shapes.map(s =>
    '<div class="shape"><div class="shape-name">' + s.kind.charAt(0).toUpperCase() + s.kind.slice(1) + '</div>' +
    '<div class="shape-area">Area: ' + getArea(s).toFixed(2) + '</div></div>'
  ).join('');`,
    },
  ],
  exercises: [
    {
      id: 'ts-union-1',
      question: 'What is the difference between a union type (A | B) and an intersection type (A & B)?',
      type: 'multiple-choice',
      options: [
        'Union means the value has ALL properties of A and B; intersection means it has ONE of them',
        'Union means the value can be A OR B; intersection means it must satisfy BOTH A AND B',
        'They are the same thing with different syntax',
        'Union is for objects only; intersection is for primitives only',
      ],
      correct: 1,
      explanation: 'A union type (A | B) means the value can be EITHER type A OR type B. An intersection type (A & B) means the value must satisfy BOTH types simultaneously — it needs all properties of A and all properties of B.',
    },
    {
      id: 'ts-union-2',
      question: 'What is the "discriminant" in a discriminated union?',
      type: 'multiple-choice',
      options: [
        'The largest type in the union',
        'A shared property with a unique literal type value that identifies which variant you have',
        'The return type of a switch statement',
        'The first property listed in each type',
      ],
      correct: 1,
      explanation: 'The discriminant is a shared property across all types in the union, where each type has a unique literal value for that property. For example, a "kind" property might be "circle", "rectangle", or "triangle". TypeScript uses this to narrow the type in switch/if statements.',
    },
  ],
  quiz: [
    {
      id: 'ts-union-q1',
      question: 'What does the "as const" assertion do to an object literal?',
      options: [
        'Makes the object immutable at runtime',
        'Makes all property types their exact literal values instead of widened primitives',
        'Converts the object to a constant in the JavaScript output',
        'Prevents the object from being passed to functions',
      ],
      correct: 1,
      explanation: '"as const" tells TypeScript to infer the most specific (narrowest) types for an object or array literal. Instead of inferring "string" for a string value, it infers the exact literal type like "localhost". This is useful for creating typed constants and lookup tables.',
    },
  ],
};
