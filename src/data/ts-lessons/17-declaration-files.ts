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
      title: 'Try It: Declaration File Visualizer',
      css: `*{box-sizing:border-box;margin:0;padding:0;}body{font-family:system-ui,sans-serif;background:#0f172a;color:#e2e8f0;min-height:100vh;padding:16px;}h2{font-size:15px;font-weight:700;color:#f1f5f9;margin-bottom:12px;}.controls{display:flex;align-items:center;gap:12px;margin-bottom:14px;flex-wrap:wrap;}.controls label{font-size:12px;color:#94a3b8;font-weight:600;}.controls select{background:#1e293b;color:#f1f5f9;border:1px solid #334155;border-radius:6px;padding:6px 10px;font-size:13px;cursor:pointer;}.panes{display:grid;grid-template-columns:1fr 1fr;gap:12px;}.pane{background:#1e293b;border:1px solid #334155;border-radius:8px;overflow:hidden;}.pane-header{background:#0f172a;padding:8px 14px;font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;border-bottom:1px solid #334155;}.js-header{color:#f59e0b;}.dts-header{color:#60a5fa;}.code-block{padding:14px;font-family:monospace;font-size:12px;line-height:1.7;white-space:pre;overflow-x:auto;}.kw{color:#c084fc;}.fn{color:#34d399;}.type{color:#60a5fa;}.str{color:#fbbf24;}.comment{color:#64748b;font-style:italic;}.param{color:#f97316;}.badge{display:inline-block;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700;margin-left:6px;vertical-align:middle;}.badge-js{background:#78350f;color:#fcd34d;}.badge-dts{background:#1e3a5f;color:#93c5fd;}@media(max-width:600px){.panes{grid-template-columns:1fr;}}`,
      js: `const examples = {
  function: {
    label: 'Function Library',
    js: [
      {t:'comment',v:'// math-utils.js (plain JavaScript, no types)'},
      {t:'nl'},
      {t:'kw',v:'function '},{t:'fn',v:'add'},{t:'plain',v:'(a, b) {'},
      {t:'nl'},{t:'plain',v:'  '},{t:'kw',v:'return '},{t:'plain',v:'a + b;'},
      {t:'nl'},{t:'plain',v:'}'},
      {t:'nl'},
      {t:'kw',v:'function '},{t:'fn',v:'multiply'},{t:'plain',v:'(a, b) {'},
      {t:'nl'},{t:'plain',v:'  '},{t:'kw',v:'return '},{t:'plain',v:'a * b;'},
      {t:'nl'},{t:'plain',v:'}'},
      {t:'nl'},
      {t:'kw',v:'function '},{t:'fn',v:'clamp'},{t:'plain',v:'(val, min, max) {'},
      {t:'nl'},{t:'plain',v:'  '},{t:'kw',v:'return '},{t:'plain',v:'Math.min(Math.max(val, min), max);'},
      {t:'nl'},{t:'plain',v:'}'},
      {t:'nl'},
      {t:'plain',v:'module.exports = { '},{t:'fn',v:'add'},{t:'plain',v:', '},{t:'fn',v:'multiply'},{t:'plain',v:', '},{t:'fn',v:'clamp'},{t:'plain',v:' };'},
    ],
    dts: [
      {t:'comment',v:'// math-utils.d.ts (hand-written declaration file)'},
      {t:'nl'},
      {t:'kw',v:'declare module '},{t:'str',v:"'math-utils'"},{t:'plain',v:' {'},
      {t:'nl'},
      {t:'plain',v:'  '},{t:'kw',v:'export declare function '},{t:'fn',v:'add'},
      {t:'plain',v:'('},{t:'param',v:'a'},{t:'plain',v:': '},{t:'type',v:'number'},{t:'plain',v:', '},{t:'param',v:'b'},{t:'plain',v:': '},{t:'type',v:'number'},{t:'plain',v:'): '},{t:'type',v:'number'},{t:'plain',v:';'},
      {t:'nl'},
      {t:'plain',v:'  '},{t:'kw',v:'export declare function '},{t:'fn',v:'multiply'},
      {t:'plain',v:'('},{t:'param',v:'a'},{t:'plain',v:': '},{t:'type',v:'number'},{t:'plain',v:', '},{t:'param',v:'b'},{t:'plain',v:': '},{t:'type',v:'number'},{t:'plain',v:'): '},{t:'type',v:'number'},{t:'plain',v:';'},
      {t:'nl'},
      {t:'plain',v:'  '},{t:'kw',v:'export declare function '},{t:'fn',v:'clamp'},
      {t:'plain',v:'('},{t:'param',v:'val'},{t:'plain',v:': '},{t:'type',v:'number'},{t:'plain',v:', '},{t:'param',v:'min'},{t:'plain',v:': '},{t:'type',v:'number'},{t:'plain',v:', '},{t:'param',v:'max'},{t:'plain',v:': '},{t:'type',v:'number'},{t:'plain',v:'): '},{t:'type',v:'number'},{t:'plain',v:';'},
      {t:'nl'},{t:'plain',v:'}'},
    ]
  },
  class: {
    label: 'Class Library',
    js: [
      {t:'comment',v:'// event-bus.js (plain JavaScript class)'},
      {t:'nl'},
      {t:'kw',v:'class '},{t:'type',v:'EventBus'},{t:'plain',v:' {'},
      {t:'nl'},{t:'plain',v:'  constructor() {'},
      {t:'nl'},{t:'plain',v:'    this._handlers = {};'},
      {t:'nl'},{t:'plain',v:'  }'},
      {t:'nl'},
      {t:'plain',v:'  '},{t:'fn',v:'on'},{t:'plain',v:'(event, handler) {'},
      {t:'nl'},{t:'plain',v:'    (this._handlers[event] ??= []).push(handler);'},
      {t:'nl'},{t:'plain',v:'    '},{t:'kw',v:'return this'},{t:'plain',v:';'},
      {t:'nl'},{t:'plain',v:'  }'},
      {t:'nl'},
      {t:'plain',v:'  '},{t:'fn',v:'emit'},{t:'plain',v:'(event, data) {'},
      {t:'nl'},{t:'plain',v:'    (this._handlers[event] ?? []).forEach(h => h(data));'},
      {t:'nl'},{t:'plain',v:'  }'},
      {t:'nl'},
      {t:'plain',v:'  '},{t:'fn',v:'off'},{t:'plain',v:'(event, handler) {'},
      {t:'nl'},{t:'plain',v:'    this._handlers[event] = (this._handlers[event] ?? [])'},
      {t:'nl'},{t:'plain',v:'      .filter(h => h !== handler);'},
      {t:'nl'},{t:'plain',v:'  }'},
      {t:'nl'},{t:'plain',v:'}'},
      {t:'nl'},
      {t:'plain',v:'module.exports = { '},{t:'type',v:'EventBus'},{t:'plain',v:' };'},
    ],
    dts: [
      {t:'comment',v:'// event-bus.d.ts'},
      {t:'nl'},
      {t:'kw',v:'declare module '},{t:'str',v:"'event-bus'"},{t:'plain',v:' {'},
      {t:'nl'},
      {t:'plain',v:'  '},{t:'kw',v:'export declare class '},{t:'type',v:'EventBus'},
      {t:'plain',v:'<'},{t:'type',v:'Events'},{t:'plain',v:' extends '},{t:'type',v:'Record'},
      {t:'plain',v:'<'},{t:'type',v:'string'},{t:'plain',v:', '},{t:'type',v:'unknown'},
      {t:'plain',v:'> = '},{t:'type',v:'Record'},{t:'plain',v:'<'},{t:'type',v:'string'},{t:'plain',v:', '},{t:'type',v:'unknown'},{t:'plain',v:'>> {'},
      {t:'nl'},{t:'plain',v:'    constructor();'},
      {t:'nl'},
      {t:'plain',v:'    '},{t:'fn',v:'on'},
      {t:'plain',v:'<'},{t:'type',v:'K'},{t:'plain',v:' extends keyof '},{t:'type',v:'Events'},
      {t:'plain',v:'>('},{t:'param',v:'event'},{t:'plain',v:': '},{t:'type',v:'K'},
      {t:'plain',v:', '},{t:'param',v:'handler'},{t:'plain',v:': (data: Events[K]) => '},{t:'type',v:'void'},
      {t:'plain',v:'): '},{t:'kw',v:'this'},{t:'plain',v:';'},
      {t:'nl'},
      {t:'plain',v:'    '},{t:'fn',v:'emit'},
      {t:'plain',v:'<'},{t:'type',v:'K'},{t:'plain',v:' extends keyof '},{t:'type',v:'Events'},
      {t:'plain',v:'>('},{t:'param',v:'event'},{t:'plain',v:': '},{t:'type',v:'K'},
      {t:'plain',v:', '},{t:'param',v:'data'},{t:'plain',v:': Events[K]): '},{t:'type',v:'void'},{t:'plain',v:';'},
      {t:'nl'},
      {t:'plain',v:'    '},{t:'fn',v:'off'},
      {t:'plain',v:'<'},{t:'type',v:'K'},{t:'plain',v:' extends keyof '},{t:'type',v:'Events'},
      {t:'plain',v:'>('},{t:'param',v:'event'},{t:'plain',v:': '},{t:'type',v:'K'},
      {t:'plain',v:', '},{t:'param',v:'handler'},{t:'plain',v:': (data: Events[K]) => '},{t:'type',v:'void'},
      {t:'plain',v:'): '},{t:'type',v:'void'},{t:'plain',v:';'},
      {t:'nl'},{t:'plain',v:'  }'},
      {t:'nl'},{t:'plain',v:'}'},
    ]
  },
  namespace: {
    label: 'Namespace Library',
    js: [
      {t:'comment',v:'// validator.js (namespace-style UMD library)'},
      {t:'nl'},
      {t:'kw',v:'var '},{t:'type',v:'Validator'},{t:'plain',v:' = {};'},
      {t:'nl'},
      {t:'type',v:'Validator'},{t:'plain',v:'.'},{t:'fn',v:'isEmail'},{t:'plain',v:' = function(str) {'},
      {t:'nl'},{t:'plain',v:'  '},{t:'kw',v:'return '},{t:'plain',v:'/^[^@]+@[^@]+\\.[^@]+$/.test(str);'},
      {t:'nl'},{t:'plain',v:'};'},
      {t:'nl'},
      {t:'type',v:'Validator'},{t:'plain',v:'.'},{t:'fn',v:'isUrl'},{t:'plain',v:' = function(str) {'},
      {t:'nl'},{t:'plain',v:'  try { new URL(str); '},{t:'kw',v:'return true'},{t:'plain',v:'; }'},
      {t:'nl'},{t:'plain',v:'  catch { '},{t:'kw',v:'return false'},{t:'plain',v:'; }'},
      {t:'nl'},{t:'plain',v:'};'},
      {t:'nl'},
      {t:'type',v:'Validator'},{t:'plain',v:'.string = {};'},
      {t:'nl'},
      {t:'type',v:'Validator'},{t:'plain',v:'.string.'},{t:'fn',v:'minLength'},{t:'plain',v:' = function(str, min) {'},
      {t:'nl'},{t:'plain',v:'  '},{t:'kw',v:'return '},{t:'plain',v:'str.length >= min;'},
      {t:'nl'},{t:'plain',v:'};'},
    ],
    dts: [
      {t:'comment',v:'// validator.d.ts (ambient namespace declaration)'},
      {t:'nl'},
      {t:'kw',v:'declare namespace '},{t:'type',v:'Validator'},{t:'plain',v:' {'},
      {t:'nl'},
      {t:'plain',v:'  '},{t:'kw',v:'function '},{t:'fn',v:'isEmail'},{t:'plain',v:'('},
      {t:'param',v:'str'},{t:'plain',v:': '},{t:'type',v:'string'},{t:'plain',v:'): '},{t:'type',v:'boolean'},{t:'plain',v:';'},
      {t:'nl'},
      {t:'plain',v:'  '},{t:'kw',v:'function '},{t:'fn',v:'isUrl'},{t:'plain',v:'('},
      {t:'param',v:'str'},{t:'plain',v:': '},{t:'type',v:'string'},{t:'plain',v:'): '},{t:'type',v:'boolean'},{t:'plain',v:';'},
      {t:'nl'},
      {t:'nl'},
      {t:'plain',v:'  '},{t:'kw',v:'namespace '},{t:'fn',v:'string'},{t:'plain',v:' {'},
      {t:'nl'},
      {t:'plain',v:'    '},{t:'kw',v:'function '},{t:'fn',v:'minLength'},{t:'plain',v:'('},
      {t:'param',v:'str'},{t:'plain',v:': '},{t:'type',v:'string'},{t:'plain',v:', '},
      {t:'param',v:'min'},{t:'plain',v:': '},{t:'type',v:'number'},{t:'plain',v:'): '},{t:'type',v:'boolean'},{t:'plain',v:';'},
      {t:'nl'},{t:'plain',v:'  }'},
      {t:'nl'},{t:'plain',v:'}'},
    ]
  }
};

function renderTokens(tokens) {
  return tokens.map(tok => {
    if (tok.t === 'nl') return '\n';
    const cls = tok.t === 'plain' ? '' : ' class="' + tok.t + '"';
    return '<span' + cls + '>' + tok.v.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</span>';
  }).join('');
}

function render(key) {
  const ex = examples[key];
  document.getElementById('js-code').innerHTML = renderTokens(ex.js);
  document.getElementById('dts-code').innerHTML = renderTokens(ex.dts);
}

const sel = document.createElement('select');
Object.entries(examples).forEach(([k, v]) => {
  const opt = document.createElement('option');
  opt.value = k; opt.textContent = v.label;
  sel.appendChild(opt);
});
sel.addEventListener('change', () => render(sel.value));

const controls = document.createElement('div');
controls.className = 'controls';
const lbl = document.createElement('label');
lbl.textContent = 'Example:';
controls.appendChild(lbl);
controls.appendChild(sel);

const panes = document.createElement('div');
panes.className = 'panes';
panes.innerHTML =
  '<div class="pane"><div class="pane-header js-header">JavaScript <span class="badge badge-js">.js</span></div><pre class="code-block" id="js-code"></pre></div>' +
  '<div class="pane"><div class="pane-header dts-header">Declaration File <span class="badge badge-dts">.d.ts</span></div><pre class="code-block" id="dts-code"></pre></div>';

const h = document.createElement('h2');
h.textContent = 'Declaration File Visualizer';

document.getElementById('output').appendChild(h);
document.getElementById('output').appendChild(controls);
document.getElementById('output').appendChild(panes);

render('function');`,
    },
  ],
  exercises: [
    {
      id: 'ts-dts-ex1',
      question: 'You want to add type information for a plain JavaScript npm package that has no bundled types and no @types/* package on npm. What is the correct approach?',
      type: 'multiple-choice',
      options: [
        'Rename the package\'s .js files to .ts files and add type annotations',
        'Write a .d.ts file for the package and reference it via typeRoots or a path mapping in tsconfig',
        'Add // @ts-ignore comments wherever you import the package',
        'Downgrade to TypeScript 3.x which does not require types for all modules',
      ],
      correct: 1,
      explanation: 'When a package ships no types and has no @types/* package, you write a .d.ts file yourself. Place it in a local types directory (e.g. src/types/module-name.d.ts or a vendor-types/ folder) and configure typeRoots in tsconfig to include that directory. This gives the compiler full type information without modifying the package.',
    },
    {
      id: 'ts-dts-ex2',
      question: 'What is module augmentation used for in TypeScript?',
      type: 'multiple-choice',
      options: [
        'Splitting a large module into multiple files',
        'Adding new types or properties to an existing module declaration without modifying the original .d.ts file',
        'Converting a CommonJS module to ES module syntax',
        'Removing incorrect types from a third-party @types package',
      ],
      correct: 1,
      explanation: 'Module augmentation lets you extend an existing declaration without touching its source. The most common use case is extending Express Request to include properties added by middleware (like req.user from auth middleware). You create a .d.ts file that imports the module and uses declare module to re-open and extend its interfaces.',
    },
    {
      id: 'ts-dts-ex3',
      question: 'Which tsconfig.json option acts as an allowlist to control exactly which @types packages the compiler includes?',
      type: 'multiple-choice',
      options: [
        '"typeRoots"',
        '"include"',
        '"types"',
        '"lib"',
      ],
      correct: 2,
      explanation: '"types" in compilerOptions is the allowlist. When you set "types": ["node", "jest"], only those two @types packages are included — all others installed in node_modules/@types are ignored. This prevents unexpected globals from leaking into your project. "typeRoots" controls where TypeScript looks for @types directories, while "lib" controls built-in type bundles (DOM, ES2022, etc.).',
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
