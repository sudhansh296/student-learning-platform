import type { TsLesson } from '../ts-curriculum';

export const tsTsconfigLesson: TsLesson = {
  id: 'ts-tsconfig',
  title: 'TypeScript Configuration (tsconfig.json)',
  slug: 'tsconfig',
  chapter: 'practical',
  order: 18,
  difficulty: 'intermediate',
  readingTime: 12,
  description: 'Master tsconfig.json to control how TypeScript compiles your code - from strict mode to path aliases to project references.',
  sections: [
    {
      type: 'text',
      content: 'tsconfig.json is the configuration file that tells the TypeScript compiler how to transform your source files. It lives at the root of your project and controls which files are compiled, which JavaScript version is targeted, how modules are resolved, and how strictly the type checker enforces rules. Without it, the compiler falls back to defaults that are often too permissive for production code.',
    },
    {
      type: 'note',
      content: 'Run "tsc --init" in your project root to generate a tsconfig.json with all options commented out. The TypeScript compiler searches for tsconfig.json by walking up the directory tree from the file being compiled, so placing it at the project root makes it apply to the whole project.',
    },
    {
      type: 'heading',
      content: 'Core Compiler Options',
    },
    {
      type: 'table',
      title: 'Most Important compilerOptions',
      headers: ['Option', 'Values', 'What It Does'],
      rows: [
        ['target', 'ES5, ES2015, ES2020, ESNext', 'The JavaScript version emitted by the compiler. Use ES2020+ for Node.js 14+ or modern browsers.'],
        ['module', 'commonjs, ESNext, NodeNext', 'The module system for the emitted code. Use commonjs for Node.js, ESNext for bundlers like Vite or webpack.'],
        ['lib', '["ES2022", "DOM", "DOM.Iterable"]', 'Built-in type declarations to include. Controls which globals like Promise, fetch, and document are available.'],
        ['strict', 'true / false', 'Enables all strict type-checking flags at once. Always true for new projects.'],
        ['outDir', '"./dist"', 'Directory where compiled .js files are written. Mirrors the source directory structure.'],
        ['rootDir', '"./src"', 'Root of the source files. TypeScript uses this to preserve directory structure in outDir.'],
        ['baseUrl', '"."', 'Base for non-relative module resolution. Required when using paths aliases.'],
        ['declaration', 'true / false', 'Emit .d.ts files alongside .js output. Required when publishing a library.'],
        ['sourceMap', 'true / false', 'Emit .js.map files so debuggers and error trackers show original TypeScript line numbers.'],
        ['esModuleInterop', 'true / false', 'Enables default imports from CommonJS modules. Required for "import React from react".'],
        ['skipLibCheck', 'true / false', 'Skip type checking of .d.ts files in node_modules. Speeds up compilation significantly.'],
        ['resolveJsonModule', 'true / false', 'Allows importing .json files with full type inference.'],
      ],
    },
    {
      type: 'heading',
      content: 'Strict Mode Flags',
    },
    {
      type: 'text',
      content: 'Enabling "strict": true is a shorthand that turns on all strict mode flags simultaneously. Each flag catches a specific class of error. Understanding them individually helps when you need to migrate an existing codebase gradually - you can enable them one at a time rather than all at once.',
    },
    {
      type: 'table',
      title: 'Individual Strict Mode Flags',
      headers: ['Flag', 'What It Catches', 'Example Error'],
      rows: [
        ['strictNullChecks', 'Treating null/undefined as other types', 'const len = user.name.length - error if name could be null'],
        ['noImplicitAny', 'Parameters or variables inferred as any', 'function greet(name) {} - error because name is implicitly any'],
        ['strictFunctionTypes', 'Unsafe function parameter type assignments', 'Assigning (x: Dog) => void where (x: Animal) => void is expected'],
        ['strictPropertyInitialization', 'Class properties not set in constructor', 'class User { name: string } - error if name not initialized'],
        ['strictBindCallApply', 'Wrong arguments to bind, call, apply', 'fn.call(null, 1, "wrong") - error if "wrong" does not match param type'],
        ['noImplicitThis', 'Using this in a context where its type is any', 'function getX() { return this.x } - error without a typed this param'],
        ['alwaysStrict', 'Missing "use strict" pragma', 'Adds "use strict" to every emitted file automatically'],
      ],
    },
    {
      type: 'heading',
      content: 'A Complete tsconfig.json for Node.js',
    },
    {
      type: 'example',
      title: 'tsconfig.json for a Node.js project',
      content: 'This configuration targets modern Node.js (18+) by emitting ES2022 JavaScript with CommonJS modules. The rootDir/outDir pair keeps compiled output separate from source files, and declaration: true means this project can be published as a library with type support.',
      language: 'json',
      code: `{
  "compilerOptions": {
    // --- Output ---
    "target": "ES2022",          // Node 18+ supports all ES2022 features natively
    "module": "commonjs",        // Node.js uses require() by default
    "outDir": "./dist",          // Compiled JS goes here
    "rootDir": "./src",          // All source TypeScript lives here

    // --- Type Safety ---
    "strict": true,              // Enable all strict checks
    "noUncheckedIndexedAccess": true, // arr[0] is T | undefined, not just T
    "noImplicitOverride": true,  // Must use 'override' keyword in subclasses

    // --- Module Resolution ---
    "moduleResolution": "node",  // Standard Node.js algorithm
    "esModuleInterop": true,     // Enable default imports from CommonJS
    "resolveJsonModule": true,   // Allow import data from './data.json'

    // --- Developer Experience ---
    "sourceMap": true,           // Map compiled lines back to TypeScript
    "declaration": true,         // Emit .d.ts for library consumers
    "declarationMap": true,      // Map .d.ts back to source .ts

    // --- Performance ---
    "skipLibCheck": true,        // Skip type-checking node_modules .d.ts files
    "incremental": true          // Cache build info for faster subsequent builds
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}`,
    },
    {
      type: 'heading',
      content: 'A Complete tsconfig.json for React / Next.js',
    },
    {
      type: 'example',
      title: 'tsconfig.json for a React or Next.js project',
      content: 'React and Next.js projects need JSX transformation support and DOM types. The "jsx" option controls how JSX syntax is compiled: "react-jsx" (used since React 17) emits imports from the react/jsx-runtime package automatically, so you no longer need to import React in every component file.',
      language: 'json',
      code: `{
  "compilerOptions": {
    // --- Output ---
    "target": "ES2017",          // Broad browser compatibility
    "module": "ESNext",          // Let the bundler (Vite/webpack) handle modules
    "lib": ["ES2017", "DOM", "DOM.Iterable"],

    // --- JSX ---
    "jsx": "react-jsx",          // React 17+ transform - no import React needed
    // "jsx": "preserve"        // Use this for Next.js (Next handles JSX itself)

    // --- Module Resolution ---
    "moduleResolution": "bundler", // Vite/webpack aware resolution
    "baseUrl": ".",              // Enable path aliases below
    "paths": {
      "@/*": ["./src/*"],        // @/components/Button -> src/components/Button
      "@components/*": ["./src/components/*"],
      "@lib/*": ["./src/lib/*"]
    },

    // --- Type Safety ---
    "strict": true,
    "noUnusedLocals": true,      // Error on unused imports and variables
    "noUnusedParameters": true,  // Error on unused function parameters
    "exactOptionalPropertyTypes": true,

    // --- Interop ---
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true,     // Required for Babel/SWC transpilation

    // --- Performance ---
    "skipLibCheck": true
  },
  "include": ["src", "next-env.d.ts"],
  "exclude": ["node_modules"]
}`,
    },
    {
      type: 'heading',
      content: 'Path Aliases with the paths Option',
    },
    {
      type: 'text',
      content: 'Path aliases let you replace long relative import paths with short, absolute-looking ones. They are configured via the paths option in compilerOptions and require baseUrl to be set. The TypeScript compiler uses them for type checking only - your bundler (Vite, webpack, Next.js) also needs to know about them to resolve modules at runtime.',
    },
    {
      type: 'example',
      title: 'Before and after: path aliases in action',
      content: 'Path aliases transform messy relative imports into clean, intention-revealing paths. The @/ prefix is a convention (not required) that signals an absolute import from the project root. When a colleague reads "@/components/Button" they immediately understand where it lives without tracing through ../../../ chains.',
      language: 'typescript',
      code: `// ----- BEFORE: relative imports (fragile, hard to read) -----

// Deep in src/features/user/profile/settings/AccountSettings.tsx:
import { Button }      from '../../../../components/ui/Button';
import { useAuth }     from '../../../../hooks/useAuth';
import { formatDate }  from '../../../../utils/date';
import { API_URL }     from '../../../../config/constants';
import type { User }   from '../../../../types/User';

// Moving this file one level up breaks every single import.


// ----- AFTER: path aliases (clean, stable) -----

// tsconfig.json:
// "baseUrl": ".",
// "paths": {
//   "@/*":            ["./src/*"],
//   "@components/*":  ["./src/components/*"],
//   "@hooks/*":       ["./src/hooks/*"],
//   "@utils/*":       ["./src/utils/*"],
//   "@types/*":       ["./src/types/*"]
// }

// Same file with aliases:
import { Button }      from '@components/ui/Button';
import { useAuth }     from '@hooks/useAuth';
import { formatDate }  from '@utils/date';
import { API_URL }     from '@/config/constants';
import type { User }   from '@types/User';

// Moving the file now breaks nothing.


// ----- Next.js -----
// Next.js reads paths from tsconfig.json automatically.
// No extra bundler config needed.

// ----- Vite -----
// Add to vite.config.ts:
// import { resolve } from 'path';
// export default defineConfig({
//   resolve: {
//     alias: { '@': resolve(__dirname, 'src') }
//   }
// });`,
    },
    {
      type: 'heading',
      content: 'include, exclude, and files',
    },
    {
      type: 'text',
      content: 'TypeScript determines which source files to compile based on three mutually supporting arrays: include lists glob patterns to include, exclude lists patterns to exclude from the include results, and files is an explicit allowlist of individual files. If none of these are specified, TypeScript compiles every .ts file it can find from the tsconfig.json directory downward (excluding node_modules by default).',
    },
    {
      type: 'example',
      title: 'Controlling which files TypeScript compiles',
      content: 'The exclude option does not prevent a file from being compiled if another included file imports it - it only removes the file from the initial scan. If you want to truly exclude a file from type-checking, use @ts-ignore inside the file or filter it with separate tsconfig extends chains.',
      language: 'json',
      code: `{
  "compilerOptions": { "strict": true },

  // Include: glob patterns relative to tsconfig.json location
  // ** means any directory depth, * means any file name
  "include": [
    "src/**/*.ts",       // All TypeScript source files
    "src/**/*.tsx",      // React component files
    "tests/**/*.ts"      // Test files
  ],

  // Exclude: removes matches from the include results
  // node_modules is always excluded automatically even without listing it
  "exclude": [
    "node_modules",      // Always exclude (TypeScript does this by default)
    "dist",              // Build output
    "**/*.spec.ts",      // Exclude test files from production build
    "**/*.test.ts",
    "src/generated/**"   // Skip auto-generated code
  ],

  // files: explicit file list (rarely used - prefer include)
  // Useful for a tiny project or to force-include a specific ambient file
  "files": [
    "src/global.d.ts",
    "src/env.d.ts"
  ]
}`,
    },
    {
      type: 'heading',
      content: 'Project References for Monorepos',
    },
    {
      type: 'text',
      content: 'Project references let you split a large codebase into independently compilable pieces that TypeScript understands as a dependency graph. Each sub-project has its own tsconfig.json and sets "composite": true. A root tsconfig.json lists all the projects in its references array. This enables incremental builds - TypeScript only recompiles the projects that changed - and enforces clean dependency boundaries between packages.',
    },
    {
      type: 'example',
      title: 'Project references setup for a monorepo',
      content: 'A project reference build is triggered with "tsc --build" (or "tsc -b") rather than plain "tsc". TypeScript reads the references array, determines the correct build order based on dependencies, and only recompiles packages whose inputs have changed since the last build.',
      language: 'json',
      code: `// Root tsconfig.json (orchestrates the build)
{
  "files": [],          // Root does not compile anything itself
  "references": [
    { "path": "./packages/shared" },   // Build shared first
    { "path": "./packages/server" },   // Then server (depends on shared)
    { "path": "./packages/client" }    // Then client (depends on shared)
  ]
}

// packages/shared/tsconfig.json
{
  "compilerOptions": {
    "composite": true,        // REQUIRED for project references
    "declaration": true,      // REQUIRED - consumers need the .d.ts files
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}

// packages/server/tsconfig.json
{
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"],
  "references": [
    { "path": "../shared" }   // Declare dependency on shared package
  ]
}

// Build commands:
// tsc --build              - build all changed projects
// tsc --build --clean      - delete all build outputs
// tsc --build --watch      - watch mode for all projects`,
    },
    {
      type: 'heading',
      content: 'Common tsconfig Presets',
    },
    {
      type: 'table',
      title: 'tsconfig Base Packages from @tsconfig',
      headers: ['Package', 'Install', 'Best For'],
      rows: [
        ['@tsconfig/node18', 'npm i -D @tsconfig/node18', 'Node.js 18 projects - sets target, module, and lib correctly'],
        ['@tsconfig/node20', 'npm i -D @tsconfig/node20', 'Node.js 20 projects with NodeNext module resolution'],
        ['@tsconfig/strictest', 'npm i -D @tsconfig/strictest', 'All strict checks enabled including newer noUncheckedIndexedAccess'],
        ['@tsconfig/create-react-app', 'npm i -D @tsconfig/create-react-app', 'Create React App compatible settings'],
        ['next (built-in)', 'built into Next.js', 'Next.js ships its own tsconfig base at next/tsconfig.json'],
      ],
    },
    {
      type: 'example',
      title: 'Extending a shared tsconfig base',
      content: 'The extends field lets your tsconfig.json inherit all settings from a base configuration and override only what differs. This is how teams share a common strict baseline across multiple packages in a monorepo while each package customizes its own outDir, rootDir, or target as needed.',
      language: 'json',
      code: `// Extend an installed preset (npm install --save-dev @tsconfig/node20)
{
  "extends": "@tsconfig/node20/tsconfig.json",
  "compilerOptions": {
    // Override only what is specific to this project:
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}

// Extend Next.js built-in tsconfig:
{
  "extends": "next/tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}`,
    },
    {
      type: 'heading',
      content: 'Strict Mode: Errors and Fixes',
    },
    {
      type: 'example',
      title: 'Common strict mode errors and how to fix them',
      content: 'Enabling strict mode for the first time on an existing project typically surfaces three classes of errors: implicit any on function parameters, null/undefined not handled, and class properties without initializers. Each error has a clear fix pattern - the compiler messages tell you exactly what is wrong and where.',
      language: 'typescript',
      code: `// ---- noImplicitAny ----

// ERROR: Parameter 'user' implicitly has an 'any' type
function greet(user) {
  return 'Hello, ' + user.name;
}

// FIXED: add explicit types
function greet(user: { name: string }): string {
  return 'Hello, ' + user.name;
}


// ---- strictNullChecks ----

// ERROR: Object is possibly 'null'
const input = document.getElementById('email');
console.log(input.value);  // input could be null

// FIXED: narrow the type before use
const input = document.getElementById('email');
if (input instanceof HTMLInputElement) {
  console.log(input.value);  // TypeScript knows it's an HTMLInputElement here
}

// Or use optional chaining + nullish coalescing:
const value = (document.getElementById('email') as HTMLInputElement)?.value ?? '';


// ---- strictPropertyInitialization ----

// ERROR: Property 'name' has no initializer and is not definitely
// assigned in the constructor.
class UserService {
  private db: Database;   // Error: not initialized
}

// FIXED option 1: initialize in constructor
class UserService {
  private db: Database;
  constructor(db: Database) {
    this.db = db;
  }
}

// FIXED option 2: definite assignment assertion (use sparingly)
class UserService {
  private db!: Database;  // '!' tells TS: trust me, it will be set
}


// ---- noImplicitOverride ----

// ERROR: This member must have an 'override' modifier because
// it overrides a member in the base class 'Animal'.
class Dog extends Animal {
  speak() { return 'Woof'; }  // Error without 'override'
}

// FIXED:
class Dog extends Animal {
  override speak() { return 'Woof'; }
}`,
    },
    {
      type: 'tryit',
      title: 'Try It: tsconfig Option Explorer',
      css: `
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, sans-serif; background: #0f172a; color: #e2e8f0; padding: 16px; min-height: 100vh; }
        h2 { font-size: 15px; font-weight: 700; color: #7dd3fc; margin-bottom: 12px; }
        .subtitle { font-size: 12px; color: #64748b; margin-bottom: 14px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px; margin-bottom: 14px; }
        .card { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 10px 12px; cursor: pointer; transition: border-color 0.15s, background 0.15s; }
        .card:hover { border-color: #3178C6; background: #1e3a5f; }
        .card.active { border-color: #3178C6; background: #1e3a5f; }
        .card-name { font-size: 13px; font-weight: 700; color: #f1f5f9; font-family: monospace; }
        .card-tag { font-size: 10px; color: #64748b; margin-top: 3px; text-transform: uppercase; letter-spacing: 0.04em; }
        .detail { background: #1e293b; border: 1px solid #3178C6; border-radius: 10px; padding: 16px; display: none; }
        .detail.visible { display: block; }
        .detail-name { font-size: 16px; font-weight: 700; color: #7dd3fc; font-family: monospace; margin-bottom: 8px; }
        .detail-desc { font-size: 13px; color: #cbd5e1; line-height: 1.6; margin-bottom: 12px; }
        .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
        .meta-box { background: #0f172a; border: 1px solid #334155; border-radius: 6px; padding: 10px; }
        .meta-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 4px; }
        .meta-value { font-size: 12px; font-family: monospace; color: #f1f5f9; }
        .impact { font-size: 11px; padding: 2px 8px; border-radius: 4px; display: inline-block; font-weight: 700; }
        .impact-high { background: #3f1717; color: #fca5a5; }
        .impact-medium { background: #322a0a; color: #fcd34d; }
        .impact-low { background: #0a2f1f; color: #6ee7b7; }
        pre { background: #0f172a; border: 1px solid #334155; border-radius: 6px; padding: 10px; font-size: 11px; font-family: monospace; color: #e2e8f0; overflow-x: auto; white-space: pre; line-height: 1.6; }
        .kw { color: #c084fc; } .str { color: #86efac; } .cm { color: #64748b; } .bool { color: #60a5fa; }
        .section-label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; margin-bottom: 6px; }
      `,
      js: `
// Create the HTML structure
document.body.innerHTML = '<h2>tsconfig.json Option Explorer</h2><div class="subtitle">Click any option to see details</div><div class="grid" id="grid"></div><div class="detail" id="detail"></div>';

const options = [
  {
    name: 'target',
    category: 'Output',
    description: 'Sets the JavaScript language version for the emitted output. TypeScript downcompiles syntax features to the target - for example, optional chaining (?.) becomes a nested if/null check when targeting ES5. Choosing a modern target produces cleaner, smaller output.',
    default: 'ES3',
    recommended: 'ES2020 or ESNext',
    impact: 'medium',
    example: '// tsconfig.json\ {\   "compilerOptions": {\     "target": "ES2020"  // emits arrow functions, async/await, etc.\   }\ }'
  },
  {
    name: 'module',
    category: 'Output',
    description: 'Controls the module system used in emitted JavaScript. "commonjs" emits require() calls for Node.js. "ESNext" emits import/export for bundlers like Vite or webpack. "NodeNext" is the modern Node.js setting that handles both .cjs and .mjs files.',
    default: 'CommonJS (when target is ES5/ES3)',
    recommended: '"commonjs" for Node.js, "ESNext" for bundlers',
    impact: 'high',
    example: '// For Node.js:\ {\   "compilerOptions": {\     "module": "commonjs"\   }\ }\ \ // For Vite/webpack:\ {\   "compilerOptions": {\     "module": "ESNext"\   }\ }'
  },
  {
    name: 'strict',
    category: 'Type Safety',
    description: 'Enables all strict type-checking options with a single flag: strictNullChecks, noImplicitAny, strictFunctionTypes, strictPropertyInitialization, strictBindCallApply, noImplicitThis, and alwaysStrict. The single most impactful option for code safety.',
    default: 'false',
    recommended: 'true - always enable for new projects',
    impact: 'high',
    example: '{\   "compilerOptions": {\     "strict": true\     // Equivalent to setting all strict flags individually:\     // "strictNullChecks": true,\     // "noImplicitAny": true,\     // "strictFunctionTypes": true,\     // "strictPropertyInitialization": true\   }\ }'
  },
  {
    name: 'strictNullChecks',
    category: 'Type Safety',
    description: 'Makes null and undefined their own distinct types. Without it, null and undefined are assignable to every type, which hides the most common source of runtime errors. With it, you must explicitly handle the null/undefined case before using a value.',
    default: 'false (true when strict is true)',
    recommended: 'true',
    impact: 'high',
    example: '// With strictNullChecks: true\ const el = document.getElementById("btn");\ el.click();  // ERROR: el is HTMLElement | null\ \ // Fix with narrowing:\ if (el) { el.click(); }\ // Or non-null assertion (use carefully):\ el!.click();'
  },
  {
    name: 'noImplicitAny',
    category: 'Type Safety',
    description: 'Raises an error on expressions and declarations that have an implied "any" type. This forces you to annotate function parameters and variables that TypeScript cannot infer, making code self-documenting and preventing whole categories of type-related bugs.',
    default: 'false (true when strict is true)',
    recommended: 'true',
    impact: 'high',
    example: '// ERROR with noImplicitAny: true\ function processData(data) {  // data is implicitly any\   return data.value;\ }\ \ // FIXED:\ function processData(data: { value: string }): string {\   return data.value;\ }'
  },
  {
    name: 'outDir',
    category: 'Output',
    description: 'Specifies the directory where all compiled JavaScript files are written. TypeScript mirrors the source directory structure under outDir. Setting this keeps compiled output separate from source files so you can safely gitignore the entire dist folder.',
    default: 'Same directory as source files',
    recommended: '"./dist" or "./build"',
    impact: 'low',
    example: '{\   "compilerOptions": {\     "rootDir": "./src",\     "outDir": "./dist"\   }\ }\ // src/index.ts   -> dist/index.js\ // src/utils/fn.ts -> dist/utils/fn.js'
  },
  {
    name: 'paths',
    category: 'Module Resolution',
    description: 'Defines path aliases that TypeScript uses during type checking. A path alias maps a short prefix to one or more real filesystem paths. Must be used with baseUrl. The runtime bundler (Vite, webpack, Next.js) also needs corresponding alias configuration.',
    default: 'No aliases (all imports must be relative)',
    recommended: 'Configure @/* -> ./src/* for large projects',
    impact: 'medium',
    example: '{\   "compilerOptions": {\     "baseUrl": ".",\     "paths": {\       "@/*": ["./src/*"],\       "@components/*": ["./src/components/*"],\       "@utils/*": ["./src/utils/*"]\     }\   }\ }\ // import { Button } from "@components/Button";'
  },
  {
    name: 'sourceMap',
    category: 'Developer Experience',
    description: 'Emits .js.map files that map compiled JavaScript lines back to original TypeScript lines. Debuggers, browser DevTools, and error monitoring tools (Sentry, Datadog) use these maps to show you the TypeScript line where an error occurred instead of the compiled JavaScript.',
    default: 'false',
    recommended: 'true in development and production',
    impact: 'low',
    example: '{\   "compilerOptions": {\     "sourceMap": true\   }\ }\ // Produces:\ // dist/index.js\ // dist/index.js.map  <- links back to src/index.ts'
  },
  {
    name: 'declaration',
    category: 'Output',
    description: 'Emits .d.ts type declaration files alongside the compiled .js output. Required when publishing a package to npm so that TypeScript consumers of your package get full type information. Declaration files contain only type signatures - no runtime code.',
    default: 'false',
    recommended: 'true when publishing a library',
    impact: 'low',
    example: '{\   "compilerOptions": {\     "declaration": true,\     "declarationMap": true  // also emit .d.ts.map files\   }\ }\ // Produces:\ // dist/index.js\ // dist/index.d.ts  <- type definitions for consumers'
  },
  {
    name: 'esModuleInterop',
    category: 'Module Resolution',
    description: 'Enables compatibility helpers so you can use default imports from CommonJS modules. Without it, importing a CommonJS module like "import express from \\'express\\'" causes an error because express does not have a true default export. Most tsconfig presets enable this by default.',
    default: 'false',
    recommended: 'true',
    impact: 'medium',
    example: '// Without esModuleInterop:\ import * as express from "express";  // required\ \ // With esModuleInterop: true:\ import express from "express";  // works\ import React from "react";      // works'
  },
  {
    name: 'skipLibCheck',
    category: 'Performance',
    description: 'Skips type checking of all .d.ts files in node_modules. This significantly speeds up compilation in large projects because it avoids re-checking the types of every dependency on every build. The trade-off is that incompatible type definitions in dependencies will not be caught.',
    default: 'false',
    recommended: 'true for application code',
    impact: 'low',
    example: '{\   "compilerOptions": {\     "skipLibCheck": true\     // Dramatically reduces compile time in monorepos\     // and projects with many @types/* dependencies\   }\ }'
  },
  {
    name: 'composite',
    category: 'Project References',
    description: 'Enables project references. When true, TypeScript stores build information in a .tsbuildinfo file so that "tsc --build" only recompiles what has changed. Required for every sub-project in a project references setup. Also forces declaration: true.',
    default: 'false',
    recommended: 'true for monorepo packages',
    impact: 'medium',
    example: '// packages/shared/tsconfig.json\ {\   "compilerOptions": {\     "composite": true,   // required for references\     "declaration": true, // required when composite is true\     "outDir": "./dist",\     "rootDir": "./src"\   }\ }'
  }
];

function impactClass(impact) {
  if (impact === 'high') return 'impact-high';
  if (impact === 'medium') return 'impact-medium';
  return 'impact-low';
}

function highlight(code) {
  return code
    .replace(/(\\/\\/[^\ ]*)/g, '<span class="cm">$1</span>')
    .replace(/"(target|module|strict|outDir|rootDir|paths|baseUrl|declaration|sourceMap|esModuleInterop|skipLibCheck|composite|compilerOptions|strictNullChecks|noImplicitAny|declarationMap)"/g, '<span class="kw">"$1"</span>')
    .replace(/: (true|false)/g, ': <span class="bool">$1</span>')
    .replace(/("(?!compilerOptions|target|module|strict|outDir|rootDir|paths|baseUrl|declaration|sourceMap|esModuleInterop|skipLibCheck|composite|strictNullChecks|noImplicitAny|declarationMap)[^"]*")/g, '<span class="str">$1</span>');
}

let activeCard = null;

function showDetail(opt) {
  const detail = document.getElementById('detail');
  detail.className = 'detail visible';
  detail.innerHTML =
    '<div class="detail-name">' + opt.name + '</div>' +
    '<div class="detail-desc">' + opt.description + '</div>' +
    '<div class="meta-grid">' +
      '<div class="meta-box">' +
        '<div class="meta-label">Default</div>' +
        '<div class="meta-value">' + opt.default + '</div>' +
      '</div>' +
      '<div class="meta-box">' +
        '<div class="meta-label">Recommended</div>' +
        '<div class="meta-value">' + opt.recommended + '</div>' +
      '</div>' +
    '</div>' +
    '<div style="margin-bottom:8px"><span class="impact ' + impactClass(opt.impact) + '">' + opt.impact.toUpperCase() + ' IMPACT</span></div>' +
    '<div class="section-label">Example</div>' +
    '<pre>' + highlight(opt.example) + '</pre>';
}

const grid = document.getElementById('grid');
options.forEach(opt => {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML =
    '<div class="card-name">' + opt.name + '</div>' +
    '<div class="card-tag">' + opt.category + '</div>';
  card.addEventListener('click', () => {
    if (activeCard) activeCard.classList.remove('active');
    card.classList.add('active');
    activeCard = card;
    showDetail(opt);
  });
  grid.appendChild(card);
});

// Show first option by default
grid.firstChild.click();
      `,
    },
  ],
  exercises: [
    {
      id: 'ts-tsconfig-ex1',
      question: 'You are setting up a Node.js project and want TypeScript to emit CommonJS modules compatible with require(). Which combination of compilerOptions is correct?',
      type: 'multiple-choice',
      options: [
        '"module": "ESNext" and "target": "ES2020"',
        '"module": "commonjs" and "target": "ES2022"',
        '"module": "AMD" and "target": "ES5"',
        '"module": "system" and "target": "ES2015"',
      ],
      correct: 1,
      explanation: '"module": "commonjs" makes TypeScript emit require() and module.exports, which is what Node.js expects by default. "target": "ES2022" tells TypeScript to emit modern JavaScript that Node.js 18+ natively understands - no need to downcompile async/await, optional chaining, or nullish coalescing. Using ESNext module with Node.js requires additional configuration (.mjs extensions or "type": "module" in package.json).',
    },
    {
      id: 'ts-tsconfig-ex2',
      question: 'You add path aliases to tsconfig.json ("@/*": ["./src/*"]) and the TypeScript compiler is happy, but the built application crashes at runtime with "Cannot find module @/utils/date". What is missing?',
      type: 'multiple-choice',
      options: [
        'You need to add "allowSyntheticDefaultImports": true to tsconfig.json',
        'Path aliases must start with ~/ not @/',
        'The bundler (Vite, webpack, etc.) also needs its own alias configuration to resolve paths at build time',
        'You must run "tsc --resolveAlias" after adding paths',
      ],
      correct: 2,
      explanation: 'tsconfig.json paths are used by the TypeScript compiler for type checking only - they do not affect the runtime module resolution. Your bundler (Vite, webpack, Next.js) has its own module resolver and needs to know about the alias separately. In Vite you configure resolve.alias in vite.config.ts; in webpack you use resolve.alias in webpack.config.js. Next.js is the exception - it reads paths from tsconfig.json automatically.',
    },
    {
      id: 'ts-tsconfig-ex3',
      question: 'What must be set to true in every sub-project tsconfig.json in a project references setup before "tsc --build" will work?',
      type: 'multiple-choice',
      options: [
        '"incremental": true',
        '"composite": true',
        '"declaration": true',
        '"isolatedModules": true',
      ],
      correct: 1,
      explanation: '"composite": true is required on every sub-project that is referenced by another. It tells TypeScript to store build metadata in a .tsbuildinfo file so that "tsc --build" knows whether a project needs to be recompiled. As a side effect, composite also forces "declaration": true so that consuming projects can see the compiled types. Setting only "declaration": true is not sufficient - TypeScript will reject the reference without composite.',
    },
  ],
  quiz: [
    {
      id: 'ts-tsconfig-q1',
      question: 'What does setting "strict": true in tsconfig.json actually do?',
      options: [
        'It makes all function parameters required and disallows optional parameters',
        'It enables a group of individual strict type-checking flags all at once, including strictNullChecks and noImplicitAny',
        'It sets the compiler to refuse any code that uses JavaScript syntax instead of TypeScript syntax',
        'It enables linting rules in addition to type checking',
      ],
      correct: 1,
      explanation: '"strict": true is a shorthand that enables all strict-mode flags simultaneously: strictNullChecks, noImplicitAny, strictFunctionTypes, strictPropertyInitialization, strictBindCallApply, noImplicitThis, and alwaysStrict. You can still override any individual flag after setting strict - for example "strict": true, "strictPropertyInitialization": false lets you disable just one flag while keeping the rest active.',
    },
    {
      id: 'ts-tsconfig-q2',
      question: 'What is the difference between the "lib" option and the "types" option in tsconfig.json?',
      options: [
        'They are aliases for the same option and can be used interchangeably',
        '"lib" controls built-in TypeScript type bundles like DOM and ES2022, while "types" controls which installed @types/* packages are included',
        '"lib" lists your own local type files, while "types" lists npm packages with types',
        '"lib" is used in production builds and "types" is used in development builds',
      ],
      correct: 1,
      explanation: '"lib" selects which of TypeScript\'s bundled type declaration files are active - for example ["ES2022", "DOM"] includes all standard ES2022 globals plus browser APIs. "types" is an allowlist that controls which packages from node_modules/@types/ are automatically included - when set, only the named packages contribute ambient globals. Without "types", all installed @types/* packages are included automatically.',
    },
    {
      id: 'ts-tsconfig-q3',
      question: 'You have a TypeScript library you want to publish to npm. Which two compiler options must you enable so consumers of your package get full type support?',
      options: [
        '"sourceMap": true and "resolveJsonModule": true',
        '"declaration": true and "composite": true',
        '"declaration": true and "declarationMap": true',
        '"esModuleInterop": true and "allowSyntheticDefaultImports": true',
      ],
      correct: 2,
      explanation: '"declaration": true makes the compiler emit .d.ts type definition files alongside the .js output - these are what TypeScript reads when consumers import your package. "declarationMap": true emits .d.ts.map files that map type declarations back to the original .ts source, enabling "Go to Definition" in editors to jump to your actual source code rather than the generated .d.ts file. Together they give consumers the best possible type-checking and editor experience.',
    },
  ],
};
