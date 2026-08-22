import type { TsLesson } from '../ts-curriculum';

export const tsDeclarationFilesLesson: TsLesson = {
  id: 'ts-declaration-files',
  title: 'Declaration Files (.d.ts)',
  slug: 'declaration-files',
  chapter: 'advanced',
  order: 17,
  difficulty: 'advanced',
  readingTime: 13,
  description: 'Understand TypeScript declaration files — how they provide type information for JavaScript libraries and how to write your own.',
  sections: [
    {
      type: 'text',
      content: 'Declaration files (.d.ts) are TypeScript\'s way of describing the types of existing JavaScript code. They contain no runtime code — only type signatures. When the TypeScript compiler encounters a JavaScript module, it looks for a matching .d.ts file to understand what the module exports and how its API is shaped.',
    },
    {
      type: 'heading',
      content: 'What Declaration Files Are',
    },
    {
      type: 'text',
      content: 'A .d.ts file is a pure type description — it tells the TypeScript compiler what types exist without producing any JavaScript output. Think of it as the table of contents for a JavaScript library: it says "this module exports a function called greet that takes a string and returns a string," but the actual implementation lives in the .js file. This separation is what lets TypeScript work with JavaScript code that was never written in TypeScript.',
    },
    {
      type: 'note',
      content: 'Declaration files are stripped from compiled output. They exist only at development time to give the type checker information it cannot infer from plain JavaScript.',
    },
    {
      type: 'heading',
      content: 'Where Declaration Files Come From',
    },
    {
      type: 'list',
      title: 'Three sources of declaration files',
      items: [
        'Bundled in the library itself: Modern libraries ship their own .d.ts files, usually pointing to them via the "types" field in package.json. When you install the package, types come with it.',
        '@types/* packages on npm (DefinitelyTyped): For older JavaScript libraries that do not bundle types, the community maintains type definitions at https://github.com/DefinitelyTyped/DefinitelyTyped. You install them with npm install --save-dev @types/lodash.',
        'Hand-written by you: If a package has no community types, or if you need to describe your own JavaScript files, you write the .d.ts yourself.',
      ],
    },
    {
      type: 'example',
      title: 'Checking whether a package has types',
      content: 'Before installing @types/* packages, you can check npm to see whether types already exist for a package. The output tells you the version of the type definitions and their download count, which is a reliable signal that they are actively maintained.',
      language: 'bash',
      code: `# Check if @types package exists for a library
npm info @types/lodash

# Output shows version, description, and maintainers:
# @types/lodash@4.17.7
# TypeScript definitions for lodash
# dist-tags: latest: 4.17.7

# If the package already bundles types, npm info shows a "types" field:
npm info zod | grep types
# "types": "./index.d.ts"

# Install community types for packages that don't bundle them
npm install --save-dev @types/express
npm install --save-dev @types/node`,
    },
    {
      type: 'heading',
      content: 'The Triple-Slash Reference Directive',
    },
    {
      type: 'text',
      content: 'Before ES module imports existed, TypeScript used triple-slash directives at the top of .d.ts files to reference other declaration files. You will still see them in older codebases and in some generated files. The most common forms are /// <reference types="..." /> to pull in a @types package and /// <reference path="..." /> to include a specific .d.ts file.',
    },
    {
      type: 'example',
      title: 'Triple-slash reference directives in .d.ts files',
      content: 'Triple-slash directives must appear at the very top of the file, before any other statements. The types form tells the compiler to include the named @types package; the path form is a relative path to another declaration file. In modern codebases with proper tsconfig setup you rarely need these, but they are common in older libraries.',
      language: 'typescript',
      code: `/// <reference types="node" />
/// <reference path="./globals.d.ts" />

// After the directives, normal declarations follow:
declare module 'my-library' {
  export function greet(name: string): string;
}

// The "types" directive is equivalent to adding the package
// to the "types" array in tsconfig.json:
// {
//   "compilerOptions": {
//     "types": ["node"]
//   }
// }`,
    },
    {
      type: 'heading',
      content: 'Anatomy of a .d.ts File',
    },
    {
      type: 'text',
      content: 'Declaration files use a set of declare keywords to describe JavaScript constructs without implementing them. Every top-level item that should be visible to the compiler must be declared. The keyword declare signals that the actual implementation will exist at runtime — the TypeScript compiler trusts you that it does.',
    },
    {
      type: 'example',
      title: 'Complete hand-written .d.ts for a fictional JS library',
      content: 'This example shows all the major declare forms in one real-world-style file. The declare module wrapper marks this as an ambient module declaration, meaning it describes what the module exports when imported. Each declaration keyword (function, class, const, namespace) mirrors what the corresponding JavaScript file actually exports.',
      language: 'typescript',
      code: `// types/string-utils.d.ts
// Hand-written declaration file for a fictional npm package "string-utils"

declare module 'string-utils' {

  // Declare individual exported functions
  export declare function capitalize(str: string): string;
  export declare function truncate(str: string, maxLength: number, suffix?: string): string;
  export declare function slugify(str: string): string;
  export declare function countWords(str: string): number;

  // Declare an exported class
  export declare class StringBuilder {
    constructor(initial?: string);
    append(str: string): this;           // fluent/chainable API
    prepend(str: string): this;
    replace(search: string | RegExp, replacement: string): this;
    toString(): string;
    readonly length: number;
  }

  // Declare exported constants
  export declare const VERSION: string;
  export declare const DEFAULT_TRUNCATE_SUFFIX: string;

  // Declare an exported type alias
  export declare type CaseStyle = 'camel' | 'snake' | 'kebab' | 'pascal';

  // Declare a namespace for grouped utilities
  export declare namespace formatters {
    function toCurrency(amount: number, currency?: string): string;
    function toPercent(value: number, decimalPlaces?: number): string;
    function toOrdinal(n: number): string;
  }

  // Declare the default export
  const stringUtils: {
    capitalize: typeof capitalize;
    truncate: typeof truncate;
    slugify: typeof slugify;
    StringBuilder: typeof StringBuilder;
  };
  export default stringUtils;
}`,
    },
    {
      type: 'heading',
      content: 'Module Augmentation',
    },
    {
      type: 'text',
      content: 'Module augmentation lets you add types to an existing module declaration without modifying its source. The classic use case is extending the Express Request interface to include properties added by middleware — such as a user object added by authentication middleware.',
    },
    {
      type: 'example',
      title: 'Adding a user property to Express Request via module augmentation',
      content: 'Module augmentation uses a declare module block that re-opens the existing module declaration. The augmented types merge with the original, so Express keeps all its existing types while gaining your new properties. This file typically lives at src/types/express.d.ts and just needs to be included in your tsconfig compilation.',
      language: 'typescript',
      code: `// src/types/express.d.ts
import 'express';

// Augment the Express namespace to add custom properties to Request
declare module 'express-serve-static-core' {
  interface Request {
    // Added by your JWT authentication middleware
    user?: {
      id: string;
      email: string;
      roles: string[];
    };
    // Added by your request-id middleware
    requestId?: string;
    // Added by your rate-limit middleware
    rateLimit?: {
      remaining: number;
      resetTime: Date;
    };
  }
}

// Now in your route handlers, req.user is fully typed:
// app.get('/profile', authMiddleware, (req: Request, res: Response) => {
//   const userId = req.user?.id;  // string | undefined
//   res.json({ userId });
// });`,
    },
    {
      type: 'heading',
      content: 'Global Augmentation',
    },
    {
      type: 'text',
      content: 'Global augmentation extends built-in TypeScript globals like Window, globalThis, or NodeJS.ProcessEnv. This is how you teach TypeScript about properties set at runtime by your application — for example, analytics trackers injected by a script tag, or custom environment variables accessed via process.env.',
    },
    {
      type: 'example',
      title: 'Extending Window and process.env with custom properties',
      content: 'The declare global block re-opens global scope from within a module file. Extending Window covers properties on the browser window object, while NodeJS.ProcessEnv augmentation adds type safety to process.env environment variables. Both patterns prevent the "Property does not exist" errors you would otherwise get when accessing these runtime-injected values.',
      language: 'typescript',
      code: `// src/types/globals.d.ts

declare global {
  // Extend the browser Window object
  interface Window {
    // Analytics tracker injected by a <script> tag
    gtag?: (command: string, ...args: unknown[]) => void;
    // Feature flags set by your backend on the HTML page
    __FEATURE_FLAGS__?: Record<string, boolean>;
    // App version injected at build time
    __APP_VERSION__?: string;
  }

  // Extend globalThis (works in both browser and Node.js)
  var __DEV__: boolean;
}

// Extend process.env in Node.js (requires @types/node)
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    DATABASE_URL: string;
    JWT_SECRET: string;
    PORT?: string;
    // Anything not declared here is still accessible as string | undefined
  }
}

// Without this export, the file is a script (not a module) and
// the declare global block is unnecessary — but it is good practice.
export {};`,
    },
    {
      type: 'heading',
      content: 'The Built-in Declaration Files',
    },
    {
      type: 'text',
      content: 'TypeScript ships with a large set of built-in declaration files under the lib directory of the TypeScript package. lib.d.ts covers core JavaScript types like Array, Promise, and Map. lib.dom.d.ts covers all browser APIs — document, fetch, HTMLElement, and thousands more. The lib option in tsconfig.json controls which of these bundles are included. If you are writing Node.js code without a browser, you should exclude "dom" to avoid accidentally using browser-only globals.',
    },
    {
      type: 'heading',
      content: 'tsconfig: typeRoots and types Options',
    },
    {
      type: 'text',
      content: 'By default TypeScript automatically includes every package found in node_modules/@types/. The typeRoots option overrides the search locations, and the types option whitelists exactly which @types packages to include. Using types is a best practice for large projects — it prevents @types packages from leaking globals they should not be adding to your build.',
    },
    {
      type: 'example',
      title: 'Controlling type discovery with typeRoots and types in tsconfig',
      content: 'The typeRoots option tells the compiler where to look for ambient type packages. The types array (when present) acts as an allowlist — only the named packages are included, even if others are installed. This is particularly important for avoiding conflicts between @types/node and browser type globals in a full-stack monorepo.',
      language: 'json',
      code: `{
  "compilerOptions": {
    // Look for types in node_modules/@types AND our local types folder
    "typeRoots": [
      "./node_modules/@types",
      "./src/types"
    ],

    // Only include these @types packages (acts as an allowlist)
    // Without this, ALL installed @types packages are included automatically
    "types": ["node", "jest"],

    // For a browser-only app:
    // "types": []  — no @types packages; rely only on lib settings
    // "lib": ["ES2022", "DOM", "DOM.Iterable"]
  }
}`,
    },
    {
      type: 'tryit',
      title: 'Try It: Declaration File Explorer',
      css: `*{box-sizing:border-box;margin:0;padding:0;}body{font-family:system-ui,sans-serif;background:#0f172a;color:#e2e8f0;min-height:100vh;padding:16px;}h2{font-size:15px;font-weight:700;color:#f1f5f9;margin-bottom:12px;}pre{background:#1e293b;border:1px solid#334155;border-radius:8px;padding:14px;font-family:monospace;font-size:12px;line-height:1.7;white-space:pre;overflow-x:auto;}`,
      js: `// Declaration Files (.d.ts) - console demo

console.log('=== What .d.ts Files Are ===');
console.log('Declaration files contain ONLY type information -- no runtime code');
console.log('They tell TypeScript the shape of existing JavaScript libraries');
console.log('TypeScript uses them for autocomplete and compile-time type checking');

console.log('\\n=== Example: @types/express declares ===');
var expressDecls = [
  'declare function express(): Express',
  'interface Express { get(path: string, handler: RequestHandler): this }',
  'interface Request { body: any; params: Record<string, string>; query: any }',
  'interface Response { json(body: any): this; status(code: number): this }',
];
expressDecls.forEach(function(d) { console.log('  ' + d); });

console.log('\\n=== Writing Your Own .d.ts ===');
var ownDecls = [
  '// my-utils.d.ts',
  'export declare function formatDate(date: Date, locale?: string): string;',
  'export declare function slugify(text: string): string;',
  'export declare const VERSION: string;',
  'export declare interface Config { apiUrl: string; timeout: number; }',
];
ownDecls.forEach(function(line) { console.log('  ' + line); });

console.log('\\n=== Module Augmentation ===');
var augmentation = [
  '// Extend Express Request with custom user property',
  'declare module "express-serve-static-core" {',
  '  interface Request {',
  '    user?: { id: string; email: string; role: string };',
  '  }',
  '}',
  '// Now req.user is typed in ALL route handlers',
];
augmentation.forEach(function(line) { console.log('  ' + line); });

console.log('\\n=== @types/* Packages ===');
var packages = ['node', 'react', 'express', 'jest', 'lodash'];
packages.forEach(function(pkg) {
  console.log('  npm i -D @types/' + pkg + '  ->  adds types for ' + pkg);
});

console.log('\\n=== typeRoots & types in tsconfig ===');
console.log('  "typeRoots": ["./node_modules/@types", "./src/types"]');
console.log('  "types": ["node", "jest"]  // allowlist -- only these @types included');
`,
    },
  ],
  exercises: [
    {
      id: 'ts-dts-ex1',
      question: 'You install a JavaScript library from npm that has no @types package available. TypeScript shows errors on every import from this library. What is the quickest way to make TypeScript accept the imports without full type safety?',
      type: 'multiple-choice',
      options: [
        'Create a minimal .d.ts file: declare module "library-name";',
        'Add "noImplicitAny": false to tsconfig.json',
        'Import it using require() instead of import',
        'Add the library to the "exclude" array in tsconfig.json',
      ],
      correct: 0,
      explanation: 'Creating a minimal ambient module declaration with "declare module" tells TypeScript that the module exists and exports an implicit any. This lets you import it without errors while you either write full type definitions later or continue using it untyped. Setting noImplicitAny to false would weaken type checking project-wide, not just for this library. Excluding the library would prevent TypeScript from compiling files that import it.',
    },
    {
      id: 'ts-dts-ex2',
      question: 'You are publishing a TypeScript library to npm and want consumers to get full type information. Which tsconfig option must be enabled?',
      type: 'multiple-choice',
      options: [
        '"sourceMap": true',
        '"declaration": true',
        '"composite": true',
        '"esModuleInterop": true',
      ],
      correct: 1,
      explanation: '"declaration": true makes the TypeScript compiler emit .d.ts type declaration files alongside the compiled .js output. These .d.ts files contain the type signatures for all exported functions, classes, and interfaces. When other developers install your package, TypeScript reads these declaration files to provide IntelliSense and type checking. Without declaration files, consumers of your library lose all type information and see everything as "any".',
    },
    {
      id: 'ts-dts-ex3',
      question: 'What does the "typeRoots" compiler option in tsconfig.json control?',
      type: 'multiple-choice',
      options: [
        'The directories where ambient .d.ts files will be written when compiled',
        'The directories TypeScript searches for @types/* packages and ambient type declarations',
        'The root directory of your TypeScript source files',
        'The directory where type errors are logged during compilation',
      ],
      correct: 1,
      explanation: '"typeRoots" is an array of directories where TypeScript looks for ambient type declarations, typically ["./node_modules/@types"] by default. When you install @types/node or @types/react, they go into node_modules/@types/. You can add custom directories to typeRoots if you store your own ambient .d.ts files outside node_modules, such as "./src/types". If typeRoots is not set, TypeScript automatically includes all @types/* packages.',
    },
  ],
  quiz: [
    {
      id: 'ts-dts-q1',
      question: 'What does a .d.ts file contain?',
      options: [
        'Compiled JavaScript code and type metadata',
        'Only type declarations — no runtime code or JavaScript output',
        'Source maps that link JavaScript to TypeScript',
        'A list of npm packages required by a TypeScript project',
      ],
      correct: 1,
      explanation: 'A .d.ts file contains only type information — declare statements, interface definitions, type aliases, and module declarations. It produces no JavaScript output when compiled. Its sole purpose is to give the TypeScript compiler type information about JavaScript code that exists elsewhere, whether in node_modules, a CDN script, or a legacy codebase.',
    },
    {
      id: 'ts-dts-q2',
      question: 'Where does TypeScript look for type definitions when you install a package that does not bundle its own types?',
      options: [
        'It automatically generates types by analyzing the JavaScript source',
        'It looks in node_modules/@types for a matching package installed separately',
        'It reads the JSDoc comments in the JavaScript files',
        'It prompts you to write types before allowing the import',
      ],
      correct: 1,
      explanation: 'TypeScript automatically searches node_modules/@types/ for a package with the matching name. If you have @types/lodash installed, importing lodash will get full type support. If neither the package nor an @types entry exists, TypeScript treats the import as "any" (or raises an error with noImplicitAny). You can also suppress this with declare module in a local .d.ts file.',
    },
    {
      id: 'ts-dts-q3',
      question: 'What is the purpose of the declare global block in a TypeScript module file?',
      options: [
        'To declare variables that are shared across all files in the project without importing',
        'To augment the global scope — adding or extending globally available types like Window or NodeJS.ProcessEnv',
        'To mark a variable as available before the file is loaded by the browser',
        'To prevent TypeScript from type-checking code inside the block',
      ],
      correct: 1,
      explanation: 'declare global lets you extend global types from within a module file (a file that has at least one import or export statement). Without it, extending interface Window inside a module would be scoped to that module. With declare global, the augmentation applies project-wide. Common uses: adding custom properties to Window, extending process.env types, and augmenting globalThis.',
    },
  ],
};
