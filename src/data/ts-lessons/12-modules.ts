import type { TsLesson } from '../ts-curriculum';

export const tsModulesLesson: TsLesson = {
  id: 'ts-modules',
  title: 'Modules and Declaration Files',
  slug: 'modules',
  chapter: 'practical',
  order: 12,
  difficulty: 'intermediate',
  readingTime: 10,
  description: 'ES modules in TypeScript, type-only imports, declaration files (.d.ts), @types packages, and module resolution.',
  sections: [
    {
      type: 'text',
      content: 'TypeScript uses the same ES module syntax as modern JavaScript (import/export), with additions for type-only imports and exports. Understanding modules is essential for real projects - it is how you split code across files while keeping type safety across all of them.',
    },
    {
      type: 'heading',
      content: 'Named Exports and Imports',
    },
    {
      type: 'example',
      title: 'Exporting and importing types alongside values',
      content: 'TypeScript modules work just like ES modules. You export types, interfaces, classes, and functions from one file and import them in another. TypeScript resolves the types automatically - if a file exports an interface, every file that imports from it gets full type safety.',
      language: 'typescript',
      code: `// --- user.ts ---
export interface User {
  id: number;
  name: string;
  email: string;
}

export type UserId = number;

export function createUser(name: string, email: string): User {
  return { id: Date.now(), name, email };
}

export const DEFAULT_ROLE = "viewer" as const;

// --- auth.ts ---
import { User, UserId, createUser } from "./user";
import { DEFAULT_ROLE } from "./user";

function getUserById(id: UserId): User | null {
  // TypeScript knows User shape from the imported interface
  return null;
}

// Re-export
export { User, createUser } from "./user";

// Default export
export default function authenticate(user: User): boolean {
  return user.email.includes("@");
}`,
    },
    {
      type: 'heading',
      content: 'Type-Only Imports',
    },
    {
      type: 'example',
      title: 'import type - import that is erased at runtime',
      content: 'The "import type" syntax imports types that exist only at compile time. TypeScript erases them from the JavaScript output entirely. This is important for avoiding circular dependencies and for bundlers that need to know which imports are type-only. Use it whenever you are importing something used only as a type annotation.',
      language: 'typescript',
      code: `// Regular import - may include runtime code
import { User, createUser } from "./user";

// Type-only import - ALWAYS erased from JavaScript output
import type { User as UserType } from "./user";
import type { Product } from "./product";

// "import type" cannot be used as a value
// const u: UserType = createUser("Alice", "a@b.com"); // Error if createUser not also imported

// Use "import type" when importing only for type annotations
function processUser(user: UserType): string {
  return user.name;
}

// Mixed import - explicit about which are type-only
import { createUser as createUserFn, type User as U } from "./user";

// In tsconfig.json with "verbatimModuleSyntax": true,
// TypeScript requires you to use "import type" for type-only imports
// This makes the intent explicit and avoids accidental runtime imports`,
    },
    {
      type: 'heading',
      content: 'Declaration Files',
    },
    {
      type: 'example',
      title: '.d.ts files - type definitions without implementation',
      content: 'A declaration file (.d.ts) describes the types of a JavaScript library without any implementation. When you npm install a library that was not written in TypeScript, you need declaration files to get type safety. TypeScript reads .d.ts files to know what types a library exports.',
      language: 'typescript',
      code: `// --- math-utils.d.ts --- (declaration file for a JS library)
// No implementation - just type signatures

declare function add(a: number, b: number): number;
declare function multiply(a: number, b: number): number;

declare interface Vector2D {
  x: number;
  y: number;
}

declare function distance(a: Vector2D, b: Vector2D): number;

// Module declaration - typing an entire npm package
declare module "color-parser" {
  interface RGB {
    r: number;
    g: number;
    b: number;
  }

  function parse(color: string): RGB;
  function format(rgb: RGB): string;

  export { RGB, parse, format };
}

// After this declaration, you can use it with types:
import { parse } from "color-parser";
const color = parse("#3b82f6"); // RGB type`,
    },
    {
      type: 'heading',
      content: '@types Packages',
    },
    {
      type: 'example',
      title: 'Installing community type definitions with @types',
      content: 'The DefinitelyTyped repository provides community-maintained type definitions for thousands of JavaScript libraries. Install them with "npm install -D @types/package-name". TypeScript automatically finds and uses them. Many modern packages ship their own types built in - check if "@types" is needed.',
      language: 'typescript',
      code: `// Terminal:
// npm install -D @types/node     (Node.js built-in types)
// npm install -D @types/lodash   (Lodash types)
// npm install -D @types/express  (Express.js types)

// After installing @types/node, you get full types for Node builtins:
import * as fs from "fs";
import * as path from "path";
import * as http from "http";

// fs.readFileSync has full type signature
const content: Buffer = fs.readFileSync("./data.json");
const text: string = fs.readFileSync("./data.json", "utf-8");

// path functions are typed
const dir: string = path.dirname("/usr/local/bin/node");
const ext: string = path.extname("document.pdf"); // ".pdf"

// Check if @types is needed:
// 1. Import the package normally
// 2. If TypeScript complains "could not find module",
//    try npm install -D @types/package-name
// 3. If @types package doesnt exist, write your own .d.ts file`,
    },
    {
      type: 'tryit',
      title: 'Try It: Module Patterns',
      css: `body{font-family:system-ui,sans-serif;padding:20px;} .module{background:#f0f7ff;border:1px solid #bfdbfe;border-radius:8px;padding:12px;margin-bottom:10px;} .module-name{font-weight:700;color:#1d4ed8;font-size:13px;margin-bottom:6px;font-family:monospace;} .export-item{font-size:12px;color:#374151;padding:2px 4px;background:#dbeafe;border-radius:4px;display:inline-block;margin:2px;}`,
      js: `// Module patterns demonstrated in JavaScript
// TypeScript adds type safety on top of all of this

// Simulating named exports from a "user.js" module
const userModule = (() => {
  // "private" - not exported
  let nextId = 1;

  // "exported" items
  function createUser(name, email) {
    return { id: nextId++, name, email, role: 'viewer' };
  }

  function isValidEmail(email) {
    return email.includes('@') && email.includes('.');
  }

  const DEFAULT_ROLE = 'viewer';

  return { createUser, isValidEmail, DEFAULT_ROLE };
})();

// Using the "module"
const users = [
  userModule.createUser('Alice', 'alice@example.com'),
  userModule.createUser('Bob', 'bob@example.com'),
  userModule.createUser('Carol', 'carol@example.com'),
];

users.forEach(u => console.log('User:', u.name, '| ID:', u.id, '| Valid email:', userModule.isValidEmail(u.email)));

const moduleExports = ['createUser (function)', 'isValidEmail (function)', 'DEFAULT_ROLE (const)'];
const typeExports = ['User (interface)', 'UserId (type)', 'UserRole (type)'];

document.getElementById('output').innerHTML =
  '<div class="module"><div class="module-name">user.ts - value exports</div>' +
  moduleExports.map(e => '<span class="export-item">' + e + '</span>').join(' ') +
  '</div><div class="module"><div class="module-name">user.ts - type-only exports (erased in JS)</div>' +
  typeExports.map(e => '<span class="export-item">' + e + '</span>').join(' ') +
  '</div>';`,
    },
  ],
  exercises: [
    {
      id: 'ts-mod-1',
      question: 'What is the difference between "import { User }" and "import type { User }" in TypeScript?',
      type: 'multiple-choice',
      options: [
        'They are identical - TypeScript treats them the same',
        '"import type" is only for classes; regular import is for interfaces',
        '"import type" is erased entirely from the JavaScript output; regular import may include runtime code',
        '"import type" imports more properties than a regular import',
      ],
      correct: 2,
      explanation: '"import type" is a TypeScript-only syntax that guarantees the import is completely erased from the JavaScript output. Regular imports may remain in the output if the module has side effects or runtime values. Use "import type" when you only need a type for annotations, not runtime functionality.',
    },
    {
      id: 'ts-mod-2',
      question: 'What is a .d.ts file used for?',
      type: 'multiple-choice',
      options: [
        'It is a compiled TypeScript output file',
        'It provides type definitions for JavaScript libraries without any implementation',
        'It is a TypeScript configuration file',
        'It defines deleted or deprecated types',
      ],
      correct: 1,
      explanation: 'A .d.ts (declaration) file contains only type information with no implementation. It tells TypeScript the types of a JavaScript library so you get autocomplete and type checking when using it. The DefinitelyTyped project maintains .d.ts files for thousands of packages.',
    },
  ],
  quiz: [
    {
      id: 'ts-mod-q1',
      question: 'How do you add type definitions for a JavaScript library like lodash?',
      options: [
        'TypeScript automatically generates types for any npm package',
        'You must rewrite the entire library in TypeScript',
        'Install @types/lodash with npm install -D @types/lodash',
        'Add the library to tsconfig.json types array',
      ],
      correct: 2,
      explanation: 'Many JavaScript libraries do not ship TypeScript types. For these, the community maintains type definitions in the DefinitelyTyped repository, published as @types/package-name. Install with "npm install -D @types/lodash" and TypeScript will automatically find and use the types.',
    },
  ],
};
