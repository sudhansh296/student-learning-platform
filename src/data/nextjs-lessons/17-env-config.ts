import type { NextjsLesson } from '../nextjs-curriculum';

export const nextjsEnvConfigLesson: NextjsLesson = {
  id: 'nextjs-env-config',
  title: 'Environment Variables and Configuration',
  slug: 'env-config',
  chapter: 'advanced',
  order: 17,
  difficulty: 'beginner',
  readingTime: 10,
  description: 'Manage environment variables in Next.js - from local development secrets to production configuration - and understand public vs private variable exposure.',
  sections: [
    {
      type: 'text',
      content: 'Environment variables solve a fundamental problem: your code needs secrets (API keys, database passwords, third-party tokens) that must never be committed to version control. By storing these values outside the codebase, you keep the same code deployable to development, staging, and production while swapping out only the configuration.',
    },
    {
      type: 'heading',
      content: 'Why Environment Variables Matter',
    },
    {
      type: 'text',
      content: 'Hard-coding a database URL or API key directly in source code means anyone with read access to the repository has your credentials. Environment variables decouple secrets from code - the code references a name like process.env.DATABASE_URL, and the actual value is provided by the host environment or a local .env file that is never committed.',
    },
    {
      type: 'list',
      title: 'Common environment variable use cases',
      items: [
        'Database connection strings (DATABASE_URL) - contain hostname, username, and password',
        'Third-party API keys (STRIPE_SECRET_KEY, SENDGRID_API_KEY) - billable credentials',
        'Feature flags (NEXT_PUBLIC_ENABLE_BETA) - toggle features without redeploying',
        'App URLs (NEXTAUTH_URL, NEXT_PUBLIC_APP_URL) - differ between local and production',
        'Service endpoints (REDIS_URL, ELASTICSEARCH_URL) - infrastructure addresses',
      ],
    },
    {
      type: 'heading',
      content: '.env Files and Priority Order',
    },
    {
      type: 'text',
      content: 'Next.js automatically loads variables from several .env files, each serving a different purpose. When multiple files define the same variable, a strict priority order determines which value wins - files later in the list override earlier ones.',
    },
    {
      type: 'list',
      title: '.env file types and their purposes',
      items: [
        '.env - baseline defaults committed to the repository; safe only for non-secret defaults',
        '.env.local - machine-specific secrets; NEVER committed to version control (add to .gitignore)',
        '.env.development - values loaded only when NODE_ENV=development (npm run dev)',
        '.env.production - values loaded only when NODE_ENV=production (npm run build + start)',
        '.env.test - values loaded during test runs (NODE_ENV=test)',
        'Priority order (highest to lowest): .env.local > .env.development/.env.production > .env',
        '.env.local is NOT loaded during tests to ensure consistent test environments',
      ],
    },
    {
      type: 'heading',
      content: 'NEXT_PUBLIC_ Prefix: Browser vs Server',
    },
    {
      type: 'text',
      content: 'By default, all environment variables are only available in the Node.js server runtime. Adding the NEXT_PUBLIC_ prefix inlines the variable value into the JavaScript bundle at build time, making it accessible in both Server and Client Components. Any variable without this prefix is undefined in the browser - a critical security boundary that prevents accidental exposure of secrets.',
    },
    {
      type: 'note',
      content: 'NEXT_PUBLIC_ variables are embedded at build time, not runtime. If you change NEXT_PUBLIC_API_URL after building, you must rebuild for the new value to take effect. Server-only variables (without NEXT_PUBLIC_) are read at runtime, so they can be changed without rebuilding.',
    },
    {
      type: 'table',
      title: 'Variable visibility by context',
      headers: ['Variable type', 'Server Components', 'Client Components', 'API Routes', 'Middleware'],
      rows: [
        ['DATABASE_URL (no prefix)', 'Available', 'undefined', 'Available', 'Available (Edge)'],
        ['NEXT_PUBLIC_APP_URL', 'Available', 'Available', 'Available', 'Available'],
        ['SECRET_KEY (no prefix)', 'Available', 'undefined', 'Available', 'Available (Edge)'],
      ],
    },
    {
      type: 'heading',
      content: 'Accessing Variables in Different Contexts',
    },
    {
      type: 'example',
      title: 'Accessing env vars in Server Component vs Client Component',
      content: 'Server Components can access any environment variable through process.env, including secrets that should never reach the browser. Client Components can only access variables prefixed with NEXT_PUBLIC_, which Next.js inlines into the client bundle at build time - attempting to read a non-prefixed variable in a Client Component returns undefined.',
      language: 'typescript',
      code: `// app/dashboard/page.tsx - Server Component (default, no 'use client')
// Can access ALL environment variables including secrets
export default async function DashboardPage() {
  // Safe - this runs only on the server, never sent to the browser
  const dbUrl = process.env.DATABASE_URL;
  const apiKey = process.env.STRIPE_SECRET_KEY;
  const publicUrl = process.env.NEXT_PUBLIC_APP_URL;

  // Fetch data using secret key - key is never exposed to client
  const data = await fetch('https://api.example.com/data', {
    headers: { Authorization: \`Bearer \${apiKey}\` },
  }).then(r => r.json());

  return <div>Data loaded from {publicUrl}</div>;
}

// components/AnalyticsBanner.tsx - Client Component
'use client';

export function AnalyticsBanner() {
  // SAFE: NEXT_PUBLIC_ variables are inlined into the bundle at build time
  const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID;

  // WRONG: This will be 'undefined' in the browser - secrets are server-only
  // const secretKey = process.env.STRIPE_SECRET_KEY; // undefined!

  return (
    <div>
      <p>Tracking ID: {analyticsId}</p>
    </div>
  );
}`,
    },
    {
      type: 'heading',
      content: 'Typical .env.local Setup',
    },
    {
      type: 'example',
      title: '.env.local file with typical variables',
      content: 'This example shows a realistic .env.local file for a Next.js application using a database, an external API, authentication, and a public feature flag. The naming convention makes it immediately clear which variables are safe to expose to the browser (NEXT_PUBLIC_) and which must stay server-side only.',
      language: 'bash',
      code: `# .env.local - local development secrets, never committed to git
# Add ".env.local" to your .gitignore file

# --- Database ---
DATABASE_URL="postgresql://postgres:password@localhost:5432/myapp_dev"

# --- Authentication (NextAuth.js) ---
NEXTAUTH_SECRET="your-long-random-secret-here-generate-with-openssl"
NEXTAUTH_URL="http://localhost:3000"
GITHUB_ID="your-github-oauth-app-client-id"
GITHUB_SECRET="your-github-oauth-app-client-secret"

# --- External APIs (server-side only - no NEXT_PUBLIC_ prefix) ---
STRIPE_SECRET_KEY="sk_test_..."
SENDGRID_API_KEY="SG...."

# --- Public variables (safe to expose to the browser) ---
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_ANALYTICS_ID="UA-XXXXXXXXX"

# --- Feature flags ---
NEXT_PUBLIC_ENABLE_BETA_FEATURES="true"

# .env.local.example (committed to git - shows required vars without values)
# DATABASE_URL=
# NEXTAUTH_SECRET=
# GITHUB_ID=
# GITHUB_SECRET=`,
    },
    {
      type: 'heading',
      content: 'TypeScript Type Safety for process.env',
    },
    {
      type: 'example',
      title: 'TypeScript augmentation for process.env',
      content: 'By default, TypeScript types all process.env values as string | undefined, which means you must add null checks everywhere. Augmenting the NodeJS.ProcessEnv interface in a type declaration file adds autocomplete for your specific variables and makes the types reflect whether each variable is guaranteed to exist.',
      language: 'typescript',
      code: `// src/types/env.d.ts - TypeScript declaration file, no imports needed
declare namespace NodeJS {
  interface ProcessEnv {
    // Server-side secrets
    readonly DATABASE_URL: string;
    readonly NEXTAUTH_SECRET: string;
    readonly NEXTAUTH_URL: string;
    readonly GITHUB_ID: string;
    readonly GITHUB_SECRET: string;
    readonly STRIPE_SECRET_KEY: string;

    // Public variables (available on client and server)
    readonly NEXT_PUBLIC_APP_URL: string;
    readonly NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
    readonly NEXT_PUBLIC_ANALYTICS_ID?: string; // optional

    // Built-in Next.js variables
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly VERCEL_ENV?: 'production' | 'preview' | 'development';
  }
}

// Now TypeScript knows about your variables:
// process.env.DATABASE_URL   - string (no undefined check needed)
// process.env.NODE_ENV       - 'development' | 'production' | 'test'
// process.env.MISSING_VAR    - TypeScript error: property does not exist`,
    },
    {
      type: 'heading',
      content: 'Runtime Validation with Zod',
    },
    {
      type: 'text',
      content: 'TypeScript types for process.env are only checked at compile time - they cannot guarantee a variable actually has a value at runtime. A Zod schema validates environment variables when your application starts, throwing a descriptive error immediately if something is missing or malformed rather than failing silently in production.',
    },
    {
      type: 'example',
      title: 'Zod schema validation for environment variables',
      content: 'This pattern creates a validated env object that your application imports instead of using process.env directly. Zod checks every required variable at startup and throws a clear error listing exactly which variables are missing, saving significant debugging time compared to cryptic runtime failures deep inside application code.',
      language: 'typescript',
      code: `// src/lib/env.ts - validated environment module
import { z } from 'zod';

const envSchema = z.object({
  // Server-side - required strings
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
  NEXTAUTH_URL: z.string().url(),
  GITHUB_ID: z.string().min(1),
  GITHUB_SECRET: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),

  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Optional with defaults
  PORT: z.coerce.number().default(3000),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

// Throws a ZodError at startup if any variable is missing or invalid
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables - see errors above');
}

export const env = parsed.data;

// Usage: import { env } from '@/lib/env';
// env.DATABASE_URL - typed as string, guaranteed to exist`,
    },
    {
      type: 'heading',
      content: 'next.config.ts env Option',
    },
    {
      type: 'text',
      content: 'The next.config.ts env option lets you hardcode configuration values or expose server-side environment variables to the browser without the NEXT_PUBLIC_ prefix. However, NEXT_PUBLIC_ variables are the preferred approach for public values - the env option in next.config.ts is mainly useful for computed values or when you need to transform a variable before exposing it.',
    },
    {
      type: 'example',
      title: 'next.config.ts env and runtime config',
      content: 'The env field in next.config.ts inlines values at build time, similar to NEXT_PUBLIC_ but controlled from the config file. This is useful for computed values like combining a base URL with a version number, or for legacy code that cannot use the NEXT_PUBLIC_ naming convention.',
      language: 'typescript',
      code: `// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Inlined at build time - accessible in both server and client code
  env: {
    APP_VERSION: process.env.npm_package_version ?? '0.0.0',
    BUILD_TIME: new Date().toISOString(),
    // Expose a server variable to the client (use NEXT_PUBLIC_ prefix instead for clarity)
    API_BASE_URL: process.env.API_BASE_URL ?? 'https://api.example.com',
  },
};

export default nextConfig;

// Access anywhere in your app:
// process.env.APP_VERSION   - e.g. "1.2.3"
// process.env.BUILD_TIME    - ISO timestamp from build
// process.env.API_BASE_URL  - from server env or default`,
    },
    {
      type: 'heading',
      content: '.gitignore: Never Commit Secrets',
    },
    {
      type: 'note',
      content: 'Always add .env.local to .gitignore. The create-next-app template does this automatically. Also add .env.development.local, .env.production.local, and .env.test.local. A safe pattern is to commit a .env.local.example file with all variable names but empty values as documentation for new developers joining the project.',
    },
    {
      type: 'tryit',
      title: 'Environment Variable Simulator',
      css: `body{font-family:system-ui,sans-serif;padding:16px;margin:0;background:#f8fafc;}
.title{font-size:15px;font-weight:700;margin:0 0 4px;}
.subtitle{font-size:12px;color:#64748b;margin:0 0 14px;}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.panel{background:#fff;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;}
.panel-header{background:#f1f5f9;padding:10px 14px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#475569;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;gap:6px;}
.panel-body{padding:14px;}
textarea{width:100%;box-sizing:border-box;font-family:monospace;font-size:12px;border:1px solid #e2e8f0;border-radius:6px;padding:10px;resize:vertical;min-height:180px;background:#f8fafc;color:#1e293b;line-height:1.6;}
textarea:focus{outline:none;border-color:#6366f1;background:#fff;}
.tabs{display:flex;gap:4px;margin-bottom:12px;}
.tab{padding:6px 12px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid #e2e8f0;background:#fff;color:#64748b;transition:all .15s;}
.tab.active{background:#6366f1;color:#fff;border-color:#6366f1;}
.var-list{min-height:160px;}
.var-row{display:flex;align-items:center;justify-content:space-between;padding:7px 10px;border-radius:6px;margin-bottom:5px;font-size:12px;gap:8px;}
.var-row.visible{background:#f0fdf4;border:1px solid #bbf7d0;}
.var-row.hidden{background:#fef2f2;border:1px solid #fecaca;}
.var-name{font-family:monospace;font-weight:600;color:#1e293b;flex:1;word-break:break-all;}
.var-value{font-family:monospace;color:#64748b;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.badge{font-size:10px;font-weight:700;padding:2px 7px;border-radius:12px;flex-shrink:0;}
.badge-public{background:#dcfce7;color:#166534;}
.badge-server{background:#fef9c3;color:#854d0e;}
.badge-hidden{background:#fee2e2;color:#991b1b;}
.empty-state{color:#94a3b8;font-size:12px;text-align:center;padding:20px 0;}
.hint{font-size:11px;color:#94a3b8;margin-top:8px;}`,
      js: `let activeTab = 'server';

function parseEnv(text) {
  const vars = [];
  text.split('\ ').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx < 1) return;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (key) vars.push({ key, val });
  });
  return vars;
}

function isVisible(key, context) {
  if (context === 'server') return true;
  return key.startsWith('NEXT_PUBLIC_');
}

function renderVarList(vars, context) {
  if (!vars.length) {
    return '<div class="empty-state">No variables defined yet.<br>Add KEY=VALUE pairs in the editor.</div>';
  }
  return vars.map(({ key, val }) => {
    const visible = isVisible(key, context);
    const isPublic = key.startsWith('NEXT_PUBLIC_');
    const badge = isPublic
      ? '<span class="badge badge-public">NEXT_PUBLIC</span>'
      : visible
        ? '<span class="badge badge-server">Server Only</span>'
        : '<span class="badge badge-hidden">Hidden</span>';
    const displayVal = visible ? val : 'undefined';
    return '<div class="var-row ' + (visible ? 'visible' : 'hidden') + '">' +
      '<span class="var-name">' + key + '</span>' +
      '<span class="var-value">' + displayVal + '</span>' +
      badge +
      '</div>';
  }).join('');
}

function update() {
  const text = document.getElementById('env-textarea').value;
  const vars = parseEnv(text);
  document.getElementById('var-list').innerHTML = renderVarList(vars, activeTab);
}

function setTab(tab) {
  activeTab = tab;
  document.getElementById('tab-server').className = 'tab' + (tab === 'server' ? ' active' : '');
  document.getElementById('tab-client').className = 'tab' + (tab === 'client' ? ' active' : '');
  update();
}

const defaultEnv =
  '# Server-side secrets (not visible to browser)\ ' +
  'DATABASE_URL=postgresql://localhost:5432/myapp\ ' +
  'NEXTAUTH_SECRET=super-secret-key-32-chars-long\ ' +
  'STRIPE_SECRET_KEY=sk_test_abc123\ ' +
  '\ ' +
  '# Public variables (visible everywhere)\ ' +
  'NEXT_PUBLIC_APP_URL=http://localhost:3000\ ' +
  'NEXT_PUBLIC_STRIPE_KEY=pk_test_xyz789\ ' +
  'NEXT_PUBLIC_ENABLE_BETA=true';

document.getElementById('output').innerHTML =
  '<div class="title">Environment Variable Simulator</div>' +
  '<div class="subtitle">Write KEY=VALUE pairs and see what each context can access</div>' +
  '<div class="grid">' +
  '<div class="panel">' +
  '<div class="panel-header">.env.local</div>' +
  '<div class="panel-body">' +
  '<textarea id="env-textarea" oninput="update()" placeholder="KEY=VALUE">' + defaultEnv + '</textarea>' +
  '<div class="hint">Lines starting with # are comments. NEXT_PUBLIC_ variables are visible to the browser.</div>' +
  '</div>' +
  '</div>' +
  '<div class="panel">' +
  '<div class="panel-header">Variable Visibility</div>' +
  '<div class="panel-body">' +
  '<div class="tabs">' +
  '<button id="tab-server" class="tab active" onclick="setTab(&apos;server&apos;)">Server Component</button>' +
  '<button id="tab-client" class="tab" onclick="setTab(&apos;client&apos;)">Client Component</button>' +
  '</div>' +
  '<div id="var-list"></div>' +
  '</div>' +
  '</div>' +
  '</div>';

update();`,
    },
  ],
  exercises: [
    {
      id: 'nextjs-env-ex-1',
      question: 'Which .env file takes highest priority and should contain local development secrets that are never committed to git?',
      type: 'multiple-choice',
      options: [
        '.env',
        '.env.development',
        '.env.local',
        '.env.production',
      ],
      correct: 2,
      explanation: '.env.local has the highest priority among .env files (except test environments) and is the correct place for local secrets like database passwords and API keys. It must be added to .gitignore so it is never committed. The .env file is committed to version control, so it should only contain safe, non-sensitive defaults.',
    },
    {
      id: 'nextjs-env-ex-2',
      question: 'You have an API key called STRIPE_SECRET_KEY. A Client Component tries to read process.env.STRIPE_SECRET_KEY. What happens?',
      type: 'multiple-choice',
      options: [
        'The value is available - Next.js exposes all variables to the client',
        'A build error is thrown because secrets cannot be accessed in Client Components',
        'The value is undefined - variables without NEXT_PUBLIC_ are server-only',
        'The value is available but encrypted for security',
      ],
      correct: 2,
      explanation: 'Environment variables without the NEXT_PUBLIC_ prefix are only available in the Node.js server runtime. When a Client Component (or any browser-side code) accesses process.env.STRIPE_SECRET_KEY, it receives undefined - Next.js intentionally strips non-prefixed variables from the client bundle to prevent accidental secret exposure.',
    },
    {
      id: 'nextjs-env-ex-3',
      question: 'Why is runtime validation with Zod preferable to TypeScript type declarations for environment variables?',
      type: 'multiple-choice',
      options: [
        'Zod generates .env.local files automatically from the schema',
        'TypeScript types are erased at runtime, so a missing variable is only caught when the code that uses it runs; Zod validates all variables at startup and fails immediately with a clear error',
        'TypeScript cannot type process.env at all',
        'Zod works in Client Components while TypeScript types do not',
      ],
      correct: 1,
      explanation: 'TypeScript declaration merging for ProcessEnv only provides autocomplete and compile-time hints - the types are erased when the code runs. If DATABASE_URL is missing, you only discover the error when a database query fails deep in application logic. Zod validates all variables the moment the app starts, throwing a descriptive error that lists every missing or malformed variable before any request is served.',
    },
  ],
  quiz: [
    {
      id: 'nextjs-env-q1',
      question: 'What is the NEXT_PUBLIC_ prefix for?',
      options: [
        'It marks a variable as required - Next.js throws an error if it is missing',
        'It inlines the variable value into the client JavaScript bundle at build time, making it accessible in both server and browser contexts',
        'It marks the variable as read-only and prevents it from being overridden',
        'It tells Next.js to validate the variable against a public schema',
      ],
      correct: 1,
      explanation: 'NEXT_PUBLIC_ signals to Next.js that a variable should be inlined into the browser bundle at build time. Without this prefix, environment variables exist only in the Node.js server process and return undefined in any client-side code. The prefix is essentially a safety gate: you must explicitly opt in to exposing a variable to the browser.',
    },
    {
      id: 'nextjs-env-q2',
      question: 'You change NEXT_PUBLIC_API_URL in your .env.local and restart the dev server. The new value does not appear in your Client Component. What is the most likely reason?',
      options: [
        'Client Components cannot read NEXT_PUBLIC_ variables',
        'You need to also update next.config.ts for the change to take effect',
        'NEXT_PUBLIC_ variables are inlined at build time - you need to restart the dev server (or rebuild) for the new value to be picked up',
        'The variable name has a typo in the .env.local file',
      ],
      correct: 2,
      explanation: 'NEXT_PUBLIC_ variables are embedded into the JavaScript bundle during the compilation/build phase, not resolved at runtime. In development, the dev server (next dev) needs to restart after changes to .env.local for new NEXT_PUBLIC_ values to be picked up because it triggers a re-compilation. In production, a full rebuild is required.',
    },
    {
      id: 'nextjs-env-q3',
      question: 'Which file should you commit to version control to document required environment variables for other developers?',
      options: [
        '.env.local - so every developer has the same values',
        '.env.local.example - with variable names but empty values, serving as documentation',
        '.env.production - so the CI/CD pipeline can use it',
        'next.config.ts - with the variables hardcoded',
      ],
      correct: 1,
      explanation: 'A .env.local.example (or .env.example) file lists all required variable names with empty values or placeholder descriptions. It is safe to commit because it contains no actual secrets, and it serves as living documentation so new developers know exactly which variables to configure locally. The actual .env.local with real values stays in .gitignore.',
    },
  ],
};
