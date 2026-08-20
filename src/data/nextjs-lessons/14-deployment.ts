import type { NextjsLesson } from '../nextjs-curriculum';

export const nextjsDeploymentLesson: NextjsLesson = {
  id: 'nextjs-deployment',
  title: 'Deployment',
  slug: 'deployment',
  chapter: 'advanced',
  order: 14,
  difficulty: 'intermediate',
  readingTime: 10,
  description: 'Deploy Next.js apps to Vercel or anywhere - build output types, environment variables, and next.config.js optimization.',
  sections: [
    {
      type: 'text',
      content: 'Next.js can deploy to Vercel (zero-config, made by the same team), self-hosted on Node.js servers, as a Docker container, or as a static export. Understanding your deployment target affects which features you can use. Vercel enables all features including Edge Functions and ISR with no configuration.',
    },
    {
      type: 'heading',
      content: 'next.config.ts',
    },
    {
      type: 'example',
      title: 'next.config.ts - configuration reference',
      content: 'next.config.ts is the main configuration file for your Next.js application. It controls build output, allowed image sources, redirects, rewrites, headers, and many other aspects of how Next.js builds and serves your app.',
      language: 'typescript',
      code: `// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Build output mode
  // 'standalone' - for Docker/self-hosted (minimal output with dependencies)
  // 'export'     - for static hosting (no Node.js server needed)
  output: 'standalone',

  // Allowed remote image domains for next/image
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },

  // Permanent redirects (301)
  async redirects() {
    return [
      { source: '/old-blog/:slug', destination: '/blog/:slug', permanent: true },
    ];
  },

  // URL rewrites (internal - URL stays the same)
  async rewrites() {
    return [
      { source: '/api/v1/:path*', destination: '/api/:path*' },
    ];
  },

  // Custom response headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ];
  },
};

export default nextConfig;`,
    },
    {
      type: 'heading',
      content: 'Environment Variables',
    },
    {
      type: 'example',
      title: 'Environment variables - server vs public',
      content: 'Environment variables prefixed with NEXT_PUBLIC_ are included in the client bundle - never put secrets there. Variables without the prefix are server-only. Use .env.local for local development secrets and set them in your deployment provider for production.',
      language: 'typescript',
      code: `// .env.local - local development (gitignore this file!)
DATABASE_URL=postgresql://localhost:5432/myapp
JWT_SECRET=your-super-secret-key-never-expose-this
STRIPE_SECRET_KEY=sk_test_abc123

# NEXT_PUBLIC_ prefix - safe for client bundle
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_STRIPE_KEY=pk_test_abc123
NEXT_PUBLIC_ANALYTICS_ID=UA-123456

// Using in server code (page, API route, middleware):
const db = new Client({ connectionString: process.env.DATABASE_URL });
const secret = process.env.JWT_SECRET;

// Using in client components:
// NEXT_PUBLIC_ vars are inlined at build time
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Type-safe env with zod validation (recommended):
// lib/env.ts
import { z } from 'zod';

const serverSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

export const env = serverSchema.parse(process.env);`,
    },
    {
      type: 'example',
      title: 'Deploying to Vercel',
      content: 'Vercel deployment is the easiest path for Next.js. Connect your GitHub repository and Vercel handles everything - build, deploy, preview deployments, custom domains, SSL, and global CDN distribution. Every push to a branch creates a preview URL.',
      language: 'bash',
      code: `# Option 1: Deploy via Vercel CLI (fastest)
npm install -g vercel
vercel login
vercel         # deploys to preview
vercel --prod  # deploys to production

# Option 2: GitHub integration (recommended for teams)
# 1. Go to vercel.com and sign up
# 2. Import your GitHub repository
# 3. Vercel auto-detects Next.js - no config needed
# 4. Every git push deploys automatically:
#    - main branch -> production.vercel.app
#    - feature branches -> pr-123.vercel.app (preview)

# Set environment variables in Vercel dashboard:
# Project -> Settings -> Environment Variables
# Or via CLI:
vercel env add DATABASE_URL production
vercel env add JWT_SECRET production

# Build commands (Vercel auto-detects these):
# Build: npm run build (or next build)
# Output: .next directory
# Install: npm install`,
    },
    {
      type: 'example',
      title: 'Standalone output for Docker/self-hosted',
      content: 'Use output: "standalone" to create a minimal self-contained build that includes only the necessary Node.js dependencies. This is ideal for Docker containers. The output includes a standalone server.js file that starts the app.',
      language: 'typescript',
      code: `// next.config.ts - enable standalone output
const nextConfig: NextConfig = {
  output: 'standalone',
};

// Dockerfile for Next.js standalone
FROM node:20-alpine AS base

# Build stage
FROM base AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage - only copy standalone output
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy only what the standalone server needs
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

# Build and run:
# docker build -t my-nextjs-app .
# docker run -p 3000:3000 my-nextjs-app`,
    },
    {
      type: 'tryit',
      title: 'Deployment Checklist',
      css: `body{font-family:system-ui,sans-serif;padding:14px;margin:0;background:#f5f5f5;}
.checklist{max-width:520px;}
h3{margin:0 0 12px;font-size:15px;}
.section{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:14px;margin-bottom:10px;}
.section-title{font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;color:#666;margin-bottom:8px;}
.item{display:flex;align-items:flex-start;gap:8px;padding:5px 0;cursor:pointer;}
.item input[type=checkbox]{accent-color:#000;width:14px;height:14px;margin-top:2px;flex-shrink:0;}
.item-text{font-size:13px;}
.item-text.done{text-decoration:line-through;color:#999;}
.score-bar{background:#f3f4f6;border-radius:6px;height:10px;overflow:hidden;margin-top:10px;}
.score-fill{background:#16a34a;height:100%;border-radius:6px;transition:width 0.3s;}
.score-text{font-size:12px;color:#666;margin-top:4px;}`,
      js: `const checks = [
  { section: 'Before Deploy', items: ['Run npm run build locally - check for errors', 'Test all pages and API routes', 'Review environment variables are set in production', 'Make sure .env.local is in .gitignore'] },
  { section: 'Performance', items: ['Use next/image for all images', 'Add priority to above-the-fold images', 'Static generate pages where possible (no cache: "no-store")', 'Run Lighthouse audit and fix issues'] },
  { section: 'SEO', items: ['Add metadata to all pages', 'Set metadataBase in root layout', 'Generate sitemap.ts', 'Create robots.ts'] },
  { section: 'Security', items: ['No secrets in NEXT_PUBLIC_ vars', 'Validate all API route inputs', 'Add security headers in middleware or next.config.ts', 'Enable HTTPS (automatic on Vercel)'] }
];

let checked = {};

function render() {
  const total = checks.reduce(function(a, s) { return a + s.items.length; }, 0);
  const done = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((done / total) * 100);
  const rows = checks.map(function(s) {
    return '<div class="section">' +
      '<div class="section-title">' + s.section + '</div>' +
      s.items.map(function(item, j) {
        const id = s.section.replace(/ /g,'_') + '_' + j;
        const isDone = checked[id];
        return '<div class="item" onclick="toggle(\'' + id + '\')">' +
          '<input type="checkbox"' + (isDone ? ' checked' : '') + ' onclick="event.stopPropagation();toggle(\'' + id + '\')">' +
          '<span class="item-text' + (isDone ? ' done' : '') + '">' + item + '</span></div>';
      }).join('') +
      '</div>';
  }).join('');
  document.getElementById('output').innerHTML =
    '<div class="checklist">' +
    '<h3>Pre-Deployment Checklist</h3>' +
    rows +
    '<div class="score-bar"><div class="score-fill" id="score-fill" style="width:' + pct + '%"></div></div>' +
    '<div class="score-text">' + done + '/' + total + ' complete (' + pct + '%)</div>' +
    '</div>';
}

window.toggle = function(id) {
  checked[id] = !checked[id];
  render();
};

render();
console.log('Complete all items before deploying to production');`,
    },
  ],
  exercises: [
    {
      id: 'nextjs-deploy-1',
      question: 'What is the difference between NEXT_PUBLIC_ and regular environment variables?',
      type: 'multiple-choice',
      options: [
        'NEXT_PUBLIC_ variables are only available during build time',
        'NEXT_PUBLIC_ variables are bundled into client JavaScript (visible to browsers), regular vars are server-only',
        'NEXT_PUBLIC_ variables must be set in Vercel dashboard, regular vars in .env.local',
        'Regular variables require the NEXT_ prefix to be recognized by Next.js',
      ],
      correct: 1,
      explanation: 'NEXT_PUBLIC_ variables are inlined into the client JavaScript bundle at build time - anyone who downloads your app can see them. Never put API keys, database passwords, or any secrets in NEXT_PUBLIC_ variables. Server-side variables (without the prefix) are only accessible in server code and are never sent to the browser.',
    },
    {
      id: 'nextjs-deploy-2',
      question: 'What does output: "standalone" in next.config.ts do?',
      type: 'multiple-choice',
      options: [
        'Deploys the app to a standalone server automatically',
        'Creates a static HTML export in the out/ directory',
        'Creates a minimal self-contained build ideal for Docker with only required dependencies',
        'Enables standalone mode that removes the need for Node.js',
      ],
      correct: 2,
      explanation: 'output: "standalone" creates a .next/standalone folder with a minimal server.js and only the node_modules needed to run the app. This dramatically reduces Docker image sizes compared to copying the full node_modules directory.',
    },
  ],
  quiz: [
    {
      id: 'nextjs-deploy-q1',
      question: 'What happens when you connect a GitHub repo to Vercel?',
      options: [
        'You must manually trigger deployments from the Vercel dashboard',
        'Every push to main and every pull request branch is automatically built and deployed',
        'Only the main branch is deployed, branches require manual deploys',
        'Vercel builds the app but you must configure a domain separately',
      ],
      correct: 1,
      explanation: 'When connected to GitHub, Vercel automatically builds and deploys every push. Pushes to main deploy to production. Pushes to any other branch create preview deployments with unique URLs - perfect for reviewing PRs before merging.',
    },
  ],
};
