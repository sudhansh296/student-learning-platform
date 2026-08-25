import type { TsLesson } from '../ts-curriculum';

export const tsObjectsLesson: TsLesson = {
  id: 'ts-objects-interfaces',
  title: 'Objects and Interfaces',
  slug: 'objects-interfaces',
  chapter: 'types',
  order: 4,
  difficulty: 'beginner',
  readingTime: 10,
  description: 'Define the shape of objects with interfaces - optional properties, readonly, index signatures, and extending interfaces.',
  sections: [
    {
      type: 'text',
      content: 'Objects are at the heart of JavaScript, and TypeScript gives you powerful tools to describe their shape. Interfaces let you define exactly what properties an object must have, what types they must be, and whether they are optional or readonly.',
    },
    {
      type: 'heading',
      content: 'Object Type Annotations',
    },
    {
      type: 'example',
      title: 'Describing object shapes inline',
      content: 'The simplest way to annotate an object is with an inline type in curly braces. List each property with its type, separated by semicolons. TypeScript will catch missing properties and wrong types. This works well for simple, one-off objects.',
      language: 'typescript',
      code: `// Inline object type annotation
let user: { name: string; age: number; email: string } = {
  name: "Alice",
  age: 25,
  email: "alice@example.com",
};

// TypeScript checks for missing or extra properties
// let bad: { name: string; age: number } = {
//   name: "Bob",
//   // Error: Property 'age' is missing
// };

// Function with object parameter
function printUser(u: { name: string; age: number }): void {
  console.log(u.name + " is " + u.age + " years old");
}

printUser({ name: "Alice", age: 25 }); // OK
// printUser({ name: "Alice" });        // Error: age is missing`,
    },
    {
      type: 'heading',
      content: 'The interface Keyword',
    },
    {
      type: 'example',
      title: 'Defining reusable object shapes with interface',
      content: 'The interface keyword gives a name to an object shape so you can reuse it everywhere. Interfaces are one of the most important TypeScript features - they document what a function expects, what an API returns, and what shape your data must take throughout the application.',
      language: 'typescript',
      code: `// Define the shape once, use it everywhere
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Use the interface to type a variable
const alice: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  role: "admin",
};

// Use it in function signatures
function createUser(data: User): User {
  return { ...data };
}

function getUserName(user: User): string {
  return user.name;
}

// TypeScript checks all usages against the interface
console.log(getUserName(alice)); // "Alice"

// Arrays of interfaces
const users: User[] = [
  { id: 1, name: "Alice", email: "a@x.com", role: "admin" },
  { id: 2, name: "Bob",   email: "b@x.com", role: "user" },
];`,
    },
    {
      type: 'heading',
      content: 'Optional and Readonly Properties',
    },
    {
      type: 'example',
      title: 'Optional (?), readonly, and their use cases',
      content: 'Add a question mark after a property name to make it optional - TypeScript will accept the object with or without that property, but the type will be "string | undefined" when you access it. The readonly modifier prevents the property from being reassigned after the object is created.',
      language: 'typescript',
      code: `interface Product {
  readonly id: number;       // cannot be changed after creation
  name: string;
  price: number;
  description?: string;      // optional - may or may not be present
  tags?: string[];           // optional array
}

const laptop: Product = {
  id: 1,
  name: "MacBook Pro",
  price: 1999,
  // description and tags are optional - OK to omit
};

const phone: Product = {
  id: 2,
  name: "iPhone",
  price: 999,
  description: "The latest model",
  tags: ["mobile", "apple"],
};

// laptop.id = 99; // Error: Cannot assign to 'id' because it is a read-only property

// Optional properties have type "T | undefined"
// Must handle the undefined case:
if (laptop.description) {
  console.log(laptop.description.toUpperCase()); // Safe
}
// Use optional chaining for concise access:
console.log(laptop.description?.toUpperCase()); // undefined - no error`,
    },
    {
      type: 'heading',
      content: 'Index Signatures',
    },
    {
      type: 'example',
      title: 'Objects with dynamic keys using index signatures',
      content: 'An index signature describes an object with unknown property names but known value types. This is useful for dictionaries, maps, and lookup tables where you dont know the keys ahead of time but you know all values share a type.',
      language: 'typescript',
      code: `// Index signature - any string key, number value
interface ScoreBoard {
  [playerName: string]: number;
}

const scores: ScoreBoard = {};
scores["Alice"] = 95;
scores["Bob"] = 87;
scores["Charlie"] = 92;

console.log(scores["Alice"]); // 95

// Mix known properties with index signature
interface Config {
  timeout: number;         // known property
  debug: boolean;          // known property
  [key: string]: unknown;  // any additional keys
}

const config: Config = {
  timeout: 5000,
  debug: true,
  apiUrl: "https://api.example.com", // extra keys allowed
  retries: 3,
};

// Record<K, V> - cleaner syntax for the same thing
const lookup: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
};`,
    },
    {
      type: 'heading',
      content: 'Extending Interfaces',
    },
    {
      type: 'example',
      title: 'Interface inheritance with extends',
      content: 'Interfaces can extend other interfaces, inheriting all their properties. This lets you build up complex types from smaller, reusable pieces. A type that extends another must include all properties of both the parent and child interface.',
      language: 'typescript',
      code: `interface Animal {
  name: string;
  age: number;
}

interface Pet extends Animal {
  owner: string;
  isVaccinated: boolean;
}

interface ServiceDog extends Pet {
  certificationId: string;
  trainedFor: string;
}

const myDog: ServiceDog = {
  name: "Rex",
  age: 4,
  owner: "Alice",
  isVaccinated: true,
  certificationId: "SD-2024-001",
  trainedFor: "Mobility assistance",
};

// Extending multiple interfaces
interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

interface AuditedUser extends User, Timestamped {
  lastLoginAt: Date;
}

// Interfaces can also be re-opened (declaration merging)
interface User {
  id: number;
  name: string;
}
interface User {
  email: string; // merged into the same User interface
}`,
    },
    {
      type: 'tryit',
      title: 'Try It: Building an Interface-Based System',
      css: `body{font-family:system-ui,sans-serif;padding:20px;} .user-card{background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:14px;margin-bottom:10px;box-shadow:0 1px 4px rgba(0,0,0,.06);} .user-name{font-weight:700;color:#1e40af;font-size:15px;} .user-role{font-size:11px;font-weight:600;padding:2px 8px;border-radius:99px;background:#dbeafe;color:#1d4ed8;display:inline-block;margin:4px 0;} .user-email{font-size:12px;color:#6b7280;}`,
      js: `// Interface-based system in JavaScript
// In TypeScript, these objects would be typed with an interface

// Simulating an interface:
// interface User { id: number; name: string; email: string; role: string; bio?: string; }

const users = [
  { id: 1, name: "Alice Chen",    email: "alice@example.com", role: "admin",     bio: "Lead developer" },
  { id: 2, name: "Bob Martinez",  email: "bob@example.com",   role: "developer", bio: "Frontend specialist" },
  { id: 3, name: "Carol White",   email: "carol@example.com", role: "designer"   }, // bio is optional
];

// Functions typed against the interface shape
function formatUserCard(user) {
  return '<div class="user-card">' +
    '<div class="user-name">' + user.name + '</div>' +
    '<span class="user-role">' + user.role + '</span>' +
    '<div class="user-email">' + user.email + '</div>' +
    (user.bio ? '<div style="font-size:12px;color:#6b7280;margin-top:4px;">' + user.bio + '</div>' : '') +
    '</div>';
}

function filterByRole(users, role) {
  return users.filter(u => u.role === role);
}

// Log to console
users.forEach(u => {
  console.log('User:', u.name, '| Role:', u.role, '| Bio:', u.bio || '(none)');
});

const admins = filterByRole(users, 'admin');
console.log('Admins found:', admins.length);

document.getElementById('output').innerHTML =
  '<h3 style="color:#1e40af;margin:0 0 10px;font-size:14px;">Users (typed with interface)</h3>' +
  users.map(formatUserCard).join('');`,
    },
  ],
  exercises: [
    {
      id: 'ts-obj-1',
      question: 'How do you make a property optional in a TypeScript interface?',
      type: 'multiple-choice',
      options: [
        'Add "optional" keyword before the property name',
        'Use the "?" after the property name',
        'Set the default value to undefined',
        'Wrap the type in Optional<T>',
      ],
      correct: 1,
      explanation: 'Add a "?" after the property name to make it optional: "description?: string". This means the property may or may not be present on the object. Its type becomes "string | undefined".',
    },
    {
      id: 'ts-obj-2',
      question: 'What does "readonly" do when applied to an interface property?',
      type: 'multiple-choice',
      options: [
        'Makes the property invisible outside the file',
        'Prevents the property from being assigned after the object is created',
        'Makes the property required when creating the object',
        'Prevents the property from being read by other functions',
      ],
      correct: 1,
      explanation: '"readonly" prevents the property from being modified after the object is created. You can set it when first constructing the object, but any later assignment will be a TypeScript compile error. Useful for IDs and other immutable data.',
    },
  ],
  quiz: [
    {
      id: 'ts-obj-q1',
      question: 'What is the main benefit of using "interface" over inline object types?',
      options: [
        'Interfaces are faster at runtime than inline types',
        'Interfaces can be reused by name across many functions and variables',
        'Inline object types do not support optional properties',
        'Interfaces are the only way to use readonly properties',
      ],
      correct: 1,
      explanation: 'The main benefit of naming an object type with "interface" is reusability. Instead of repeating "{ name: string; age: number }" everywhere, you define it once as "interface User" and reference it by name. This also makes refactoring much easier.',
    },
  ],
};
