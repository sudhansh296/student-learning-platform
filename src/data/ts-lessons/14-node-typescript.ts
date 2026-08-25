import type { TsLesson } from '../ts-curriculum';

export const tsNodeLesson: TsLesson = {
  id: 'ts-node',
  title: 'TypeScript with Node.js',
  slug: 'node-typescript',
  chapter: 'practical',
  order: 14,
  difficulty: 'advanced',
  readingTime: 10,
  description: 'Configure tsconfig.json, use @types/node, type Express routes, type MongoDB documents, and common Node+TS patterns.',
  sections: [
    {
      type: 'text',
      content: 'TypeScript is excellent for Node.js backends. You get typed request and response objects in Express, typed database queries, and compile-time catches for common Node.js bugs like accessing undefined environment variables. Setting it up takes a few minutes and pays dividends immediately.',
    },
    {
      type: 'heading',
      content: 'tsconfig.json for Node.js',
    },
    {
      type: 'example',
      title: 'Essential tsconfig.json options for a Node.js project',
      content: 'tsconfig.json controls how the TypeScript compiler behaves. For Node.js projects, the most important options are "target" (which JS version to output), "module" (module system), "strict" (all strict checks), and "outDir" (where to put compiled files). Start with strict mode always enabled.',
      language: 'typescript',
      code: `// tsconfig.json - recommended for Node.js 20+ projects
{
  "compilerOptions": {
    // Target modern JS - Node 20 supports ES2022
    "target": "ES2022",

    // Use Node.js module resolution
    "module": "commonjs",
    "moduleResolution": "node",

    // Output directory for compiled JS
    "outDir": "./dist",
    "rootDir": "./src",

    // Enable ALL strict type checks (required!)
    "strict": true,

    // Allow importing JSON files
    "resolveJsonModule": true,

    // Support decorators (for NestJS, TypeORM)
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,

    // Source maps for debugging
    "sourceMap": true,

    // Skip type checking on node_modules
    "skipLibCheck": true,

    // Include Node.js types
    "types": ["node"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}`,
    },
    {
      type: 'heading',
      content: 'Typing Express Routes',
    },
    {
      type: 'example',
      title: 'Typed request and response objects in Express',
      content: 'After installing @types/express, Express route handlers get full type information. The Request and Response types accept generics for the body, params, query, and response body. This means TypeScript catches accessing req.body.nonExistentProperty before it runs.',
      language: 'typescript',
      code: `// npm install express
// npm install -D @types/express @types/node

import express, { Request, Response, NextFunction } from "express";

const app = express();
app.use(express.json());

// Type the request body
interface CreateUserBody {
  name: string;
  email: string;
  password: string;
}

// Type the route params
interface UserParams {
  id: string;
}

// Fully typed route handler
app.post(
  "/users",
  async (req: Request<{}, {}, CreateUserBody>, res: Response) => {
    const { name, email, password } = req.body; // TypeScript knows these types
    // TypeScript catches: req.body.username // Error: not in CreateUserBody

    const user = { id: Date.now(), name, email };
    res.status(201).json(user);
  }
);

// Typed URL params
app.get(
  "/users/:id",
  async (req: Request<UserParams>, res: Response) => {
    const userId = req.params.id; // string
    res.json({ id: userId });
  }
);

// Typed error middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ error: err.message });
});

app.listen(3000);`,
    },
    {
      type: 'heading',
      content: 'Typing Environment Variables',
    },
    {
      type: 'example',
      title: 'Type-safe access to process.env',
      content: 'process.env values are all "string | undefined" in TypeScript. Accessing them without checking for undefined is a common source of runtime errors. The standard pattern is to validate all required env vars at startup and cast them to a typed config object - then the rest of your code uses the typed config, never raw process.env.',
      language: 'typescript',
      code: `// env.ts - validate and type environment variables at startup

interface AppConfig {
  port: number;
  dbUrl: string;
  jwtSecret: string;
  nodeEnv: "development" | "production" | "test";
}

function loadConfig(): AppConfig {
  const required = ["DATABASE_URL", "JWT_SECRET"] as const;

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error("Missing required environment variable: " + key);
    }
  }

  return {
    port: parseInt(process.env.PORT ?? "3000", 10),
    dbUrl: process.env.DATABASE_URL!,  // safe - checked above
    jwtSecret: process.env.JWT_SECRET!,
    nodeEnv: (process.env.NODE_ENV ?? "development") as AppConfig["nodeEnv"],
  };
}

// Export typed config - use this everywhere
export const config = loadConfig();

// Usage in other files:
// import { config } from "./env";
// console.log(config.port);    // number - not string | undefined
// console.log(config.dbUrl);   // string - not string | undefined`,
    },
    {
      type: 'example',
      title: 'Typing async functions and Promise return types',
      content: 'In Node.js backends, almost everything is async. TypeScript needs to know what Promises resolve to. Use "async function fn(): Promise<T>" to declare the return type. Use "Promise<void>" for functions that resolve without a value. The "unknown" type is recommended when catching errors since you cannot guarantee what was thrown.',
      language: 'typescript',
      code: `// Typed async function
interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  createdAt: Date;
}

// Return type is Promise<Post>
async function getPostById(id: number): Promise<Post | null> {
  // database query here
  return null;
}

// Return type is Promise<Post[]>
async function getAllPosts(): Promise<Post[]> {
  // TypeScript enforces we return Post[]
  return [];
}

// Promise<void> - no return value
async function sendEmail(to: string, subject: string): Promise<void> {
  console.log("Sending to", to + ":", subject);
  // no return needed
}

// Error handling - catch(err: unknown)
async function safeOperation(): Promise<string> {
  try {
    const result = await getPostById(1);
    return result?.title ?? "Not found";
  } catch (err: unknown) {
    // err is unknown - must check type before using
    if (err instanceof Error) {
      console.error("Error:", err.message);
    }
    throw err;
  }
}`,
    },
    {
      type: 'tryit',
      title: 'Try It: Node.js TypeScript Patterns',
      css: `body{font-family:system-ui,sans-serif;padding:20px;} .route{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:10px;margin-bottom:8px;} .method{display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;margin-right:8px;font-family:monospace;} .get{background:#d1fae5;color:#065f46;} .post{background:#dbeafe;color:#1e40af;} .put{background:#fef3c7;color:#92400e;} .delete{background:#fee2e2;color:#991b1b;} .path{font-family:monospace;font-size:13px;color:#374151;}`,
      js: `// Node.js + TypeScript patterns in JavaScript

// Simulating typed Express route definitions
const routes = [
  { method: 'GET',    path: '/users',      body: null,                    response: 'User[]' },
  { method: 'POST',   path: '/users',      body: '{ name, email, password }', response: 'User' },
  { method: 'GET',    path: '/users/:id',  body: null,                    response: 'User | null' },
  { method: 'PUT',    path: '/users/:id',  body: 'Partial<User>',         response: 'User' },
  { method: 'DELETE', path: '/users/:id',  body: null,                    response: 'void' },
];

// Simulating environment config validation
function loadConfig(env) {
  const required = ['DATABASE_URL', 'JWT_SECRET'];
  const missing = required.filter(k => !env[k]);
  if (missing.length > 0) {
    throw new Error('Missing env vars: ' + missing.join(', '));
  }
  return {
    port: parseInt(env.PORT || '3000', 10),
    dbUrl: env.DATABASE_URL,
    jwtSecret: env.JWT_SECRET,
    nodeEnv: env.NODE_ENV || 'development',
  };
}

// Test config validation
try {
  const config = loadConfig({ DATABASE_URL: 'mongodb://localhost/mydb', JWT_SECRET: 'secret123', PORT: '4000' });
  console.log('Config loaded:', JSON.stringify(config));
} catch(e) {
  console.log('Config error:', e.message);
}

// Test missing vars
try {
  loadConfig({ PORT: '3000' });
} catch(e) {
  console.log('Expected error:', e.message);
}

const methodStyle = { GET: 'get', POST: 'post', PUT: 'put', DELETE: 'delete' };

document.getElementById('output').innerHTML =
  '<p style="font-size:13px;font-weight:700;margin-bottom:8px;color:#1e40af;">Typed Express Routes</p>' +
  routes.map(r =>
    '<div class="route"><span class="method ' + methodStyle[r.method] + '">' + r.method + '</span>' +
    '<span class="path">' + r.path + '</span>' +
    '<span style="float:right;font-size:11px;color:#6b7280;">returns ' + r.response + '</span>' +
    (r.body ? '<div style="font-size:11px;color:#6b7280;margin-top:4px;">body: ' + r.body + '</div>' : '') +
    '</div>'
  ).join('');`,
    },
  ],
  exercises: [
    {
      id: 'ts-node-1',
      question: 'Why should you validate environment variables at startup rather than accessing process.env throughout your code?',
      type: 'multiple-choice',
      options: [
        'process.env is slower to access than a local variable',
        'process.env values are "string | undefined" - validating at startup creates a typed config object that removes undefined from all later accesses',
        'Node.js does not allow accessing process.env more than once',
        'TypeScript cannot read process.env values',
      ],
      correct: 1,
      explanation: 'Every process.env value has type "string | undefined". If you access them directly in your code, you must handle undefined everywhere. By validating required vars at startup and creating a typed config object, the rest of your code works with "string" (not "string | undefined"), eliminating repetitive null checks.',
    },
    {
      id: 'ts-node-2',
      question: 'What is the "strict" option in tsconfig.json?',
      type: 'multiple-choice',
      options: [
        'It prevents the use of "any" type entirely',
        'It enables a collection of stricter type checks including strictNullChecks, noImplicitAny, and others',
        'It makes TypeScript check runtime types in addition to compile-time types',
        'It disables backward compatibility with JavaScript',
      ],
      correct: 1,
      explanation: '"strict": true enables a group of strict type-checking flags including strictNullChecks (no implicit null/undefined), noImplicitAny (no implicit any), strictFunctionTypes, and others. Always use it. Without strict mode, TypeScript is much weaker - many common bugs will not be caught.',
    },
  ],
  quiz: [
    {
      id: 'ts-node-q1',
      question: 'After installing @types/express, how do you type the request body in an Express POST handler?',
      options: [
        'Use "req.body as MyType" - type assertion',
        'Use "req: Request<{}, {}, MyBodyType>" - generic parameter for the body',
        'Declare "const body: MyType = req.body" - local type assertion',
        'TypeScript automatically infers the body type from the route definition',
      ],
      correct: 1,
      explanation: 'Express Request accepts generics: Request<Params, ResBody, ReqBody, Query>. To type the request body, pass your interface as the third generic: Request<{}, {}, CreateUserBody>. This gives TypeScript knowledge of req.body shape without assertions. You can also use a simpler approach: destructure and cast "const body = req.body as CreateUserBody".',
    },
  ],
};
