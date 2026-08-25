import type { TsLesson } from '../ts-curriculum';

export const tsEnumsLesson: TsLesson = {
  id: 'ts-enums',
  title: 'Enums',
  slug: 'enums',
  chapter: 'types',
  order: 7,
  difficulty: 'intermediate',
  readingTime: 10,
  description: 'Numeric and string enums, const enums for performance, using enums in switch statements, and when to prefer union types.',
  sections: [
    {
      type: 'text',
      content: 'Enums let you define a set of named constants. Instead of using magic strings like "ACTIVE" or magic numbers like 0, 1, 2 throughout your code, you can use descriptive names that are both readable and type-safe. TypeScript has both numeric and string enums.',
    },
    {
      type: 'heading',
      content: 'Numeric Enums',
    },
    {
      type: 'example',
      title: 'Numeric enums - auto-incremented integer values',
      content: 'A numeric enum assigns integer values starting from 0 by default. The first member is 0, the second is 1, and so on. You can override the starting value or any individual value - the rest continue incrementing from there. Numeric enums compile to an object in JavaScript.',
      language: 'typescript',
      code: `// Basic numeric enum - auto-increments from 0
enum Direction {
  North,  // 0
  South,  // 1
  East,   // 2
  West,   // 3
}

// Use the enum
function move(dir: Direction): void {
  console.log("Moving in direction:", dir);
}
move(Direction.North); // OK - passes 0
// move(0);           // Also works but less readable

// Custom starting value
enum HttpStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  ServerError = 500,
}

function handleStatus(status: HttpStatus): string {
  if (status === HttpStatus.OK) return "Success";
  if (status === HttpStatus.NotFound) return "Not found";
  return "Other";
}

// Numeric enums have reverse mappings
console.log(Direction[0]);  // "North" - reverse lookup
console.log(Direction.North); // 0`,
    },
    {
      type: 'heading',
      content: 'String Enums',
    },
    {
      type: 'example',
      title: 'String enums - human-readable values',
      content: 'String enums give each member a string value. Unlike numeric enums, there is no auto-increment - you must specify every value explicitly. The big advantage: string enum values are readable in logs, network requests, and databases. They do NOT have reverse mappings.',
      language: 'typescript',
      code: `// String enum - every value must be set explicitly
enum Color {
  Red = "RED",
  Green = "GREEN",
  Blue = "BLUE",
}

enum UserRole {
  Admin = "admin",
  Editor = "editor",
  Viewer = "viewer",
}

// Much more readable in JSON/logs than numbers
interface User {
  name: string;
  role: UserRole;
}

const alice: User = { name: "Alice", role: UserRole.Admin };
console.log(JSON.stringify(alice)); // {"name":"Alice","role":"admin"}

// String enums in function parameters
function checkPermission(role: UserRole, action: string): boolean {
  if (role === UserRole.Admin) return true;
  if (role === UserRole.Editor && action === "edit") return true;
  return false;
}

checkPermission(UserRole.Editor, "edit");  // true
checkPermission(UserRole.Viewer, "edit");  // false`,
    },
    {
      type: 'heading',
      content: 'Const Enums',
    },
    {
      type: 'example',
      title: 'const enum - inlined at compile time for performance',
      content: 'A const enum is erased entirely during compilation. Each use of the enum member is replaced with its literal value inline. This produces smaller, faster JavaScript with no enum object at runtime. The trade-off: you lose the runtime reverse lookup and cannot iterate over const enums.',
      language: 'typescript',
      code: `// Regular enum - compiles to a JS object
enum RegularDir {
  Up = "UP",
  Down = "DOWN",
}
// Compiled JS includes: { Up: "UP", Down: "DOWN", ... }

// const enum - fully erased, values inlined
const enum Keys {
  Enter = 13,
  Escape = 27,
  Space = 32,
}

// TypeScript compiles this:
// if (event.keyCode === Keys.Enter) { ... }
// Into this (inlined value, no object lookup):
// if (event.keyCode === 13) { ... }

function handleKey(code: number): string {
  if (code === Keys.Enter)  return "Enter pressed";
  if (code === Keys.Escape) return "Escape pressed";
  if (code === Keys.Space)  return "Space pressed";
  return "Unknown key";
}

// const enum can only be used in TypeScript files
// (not in declaration files or separate modules without isolatedModules)`,
    },
    {
      type: 'heading',
      content: 'Enums in Switch Statements',
    },
    {
      type: 'example',
      title: 'Using enums with exhaustive switch statements',
      content: 'Enums pair perfectly with switch statements. TypeScript can check that you handled every case - a pattern called exhaustive checking. Use a "never" variable in the default case to get a compile error if you add a new enum value and forget to handle it.',
      language: 'typescript',
      code: `enum Status {
  Pending = "pending",
  Active = "active",
  Suspended = "suspended",
  Deleted = "deleted",
}

// Exhaustive switch - TypeScript warns if you miss a case
function getStatusLabel(status: Status): string {
  switch (status) {
    case Status.Pending:   return "Awaiting approval";
    case Status.Active:    return "Active user";
    case Status.Suspended: return "Account suspended";
    case Status.Deleted:   return "Account deleted";
    default:
      // If you add a new Status value, this line causes a compile error
      const _exhaustive: never = status;
      return _exhaustive;
  }
}

// When to prefer union types over enums:
// type Status = "pending" | "active" | "suspended" | "deleted";
// - Simpler, no runtime JS object
// - Works in JSON naturally
// - Cannot be iterated (sometimes a con)
// Use enums when you need reverse mapping or iteration

console.log(getStatusLabel(Status.Active)); // "Active user"`,
    },
    {
      type: 'tryit',
      title: 'Try It: Enums in Action',
      css: `body{font-family:system-ui,sans-serif;padding:20px;} .status-badge{display:inline-block;padding:3px 10px;border-radius:99px;font-size:12px;font-weight:700;margin:3px;} .pending{background:#fef3c7;color:#92400e;} .active{background:#d1fae5;color:#065f46;} .suspended{background:#fee2e2;color:#991b1b;} .deleted{background:#f3f4f6;color:#6b7280;}`,
      js: `// Simulating TypeScript enums in JavaScript

// String enum equivalent
const UserRole = Object.freeze({
  Admin: 'admin',
  Editor: 'editor',
  Viewer: 'viewer',
});

const Status = Object.freeze({
  Pending: 'pending',
  Active: 'active',
  Suspended: 'suspended',
  Deleted: 'deleted',
});

function getStatusLabel(status) {
  switch (status) {
    case Status.Pending:   return 'Awaiting approval';
    case Status.Active:    return 'Active user';
    case Status.Suspended: return 'Account suspended';
    case Status.Deleted:   return 'Account deleted';
    default:               return 'Unknown status';
  }
}

function checkPermission(role, action) {
  if (role === UserRole.Admin) return true;
  if (role === UserRole.Editor && action === 'edit') return true;
  return false;
}

// Test all status values
Object.values(Status).forEach(s => {
  console.log(s + ':', getStatusLabel(s));
});

// Test permissions
console.log('Admin can delete:', checkPermission(UserRole.Admin, 'delete'));
console.log('Editor can edit:', checkPermission(UserRole.Editor, 'edit'));
console.log('Viewer can edit:', checkPermission(UserRole.Viewer, 'edit'));

document.getElementById('output').innerHTML =
  '<p style="font-size:13px;font-weight:700;margin-bottom:8px;">Status Badges</p>' +
  Object.values(Status).map(s =>
    '<span class="status-badge ' + s + '">' + getStatusLabel(s) + '</span>'
  ).join('');`,
    },
  ],
  exercises: [
    {
      id: 'ts-enum-1',
      question: 'What is the default starting value for numeric enum members?',
      type: 'multiple-choice',
      options: ['1', '0', '-1', 'undefined'],
      correct: 1,
      explanation: 'Numeric enum members start at 0 by default. The first member is 0, the second is 1, and so on. You can override this by assigning a custom value to the first member or any member, and the rest will continue incrementing from the overridden value.',
    },
    {
      id: 'ts-enum-2',
      question: 'What is the main advantage of "const enum" over a regular enum?',
      type: 'multiple-choice',
      options: [
        'const enum members can be changed at runtime',
        'const enum values are inlined at compile time, producing smaller JavaScript with no runtime object',
        'const enum supports string values; regular enum does not',
        'const enum automatically generates reverse mappings',
      ],
      correct: 1,
      explanation: 'A const enum is completely erased during compilation. Each use of a const enum member is replaced with its literal value inline in the JavaScript output. This means no enum object is created at runtime, resulting in smaller and faster JavaScript.',
    },
  ],
  quiz: [
    {
      id: 'ts-enum-q1',
      question: 'When should you prefer a union type over an enum?',
      options: [
        'Always - enums are deprecated in modern TypeScript',
        'When you need to iterate over all possible values at runtime',
        'When you want simpler syntax, no runtime object, and natural JSON serialization',
        'When you need numeric values',
      ],
      correct: 2,
      explanation: 'Union types like "pending" | "active" | "suspended" are often preferred over enums because they produce no runtime JavaScript object, serialize naturally to JSON without extra mapping, and are simpler to declare. Use enums when you specifically need runtime iteration or reverse mapping.',
    },
  ],
};
