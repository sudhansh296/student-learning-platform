import type { NextjsLesson } from '../nextjs-curriculum';

export const nextjsIntroLesson: NextjsLesson = {
  id: 'nextjs-intro',
  title: 'Introduction to Next.js',
  slug: 'introduction',
  chapter: 'intro',
  order: 1,
  difficulty: 'beginner',
  readingTime: 10,
  description: 'What Next.js is, why use it over plain React, key features, and project structure.',
  sections: [
    {
      type: 'text',
      content: 'Next.js is the React framework for production. Built by Vercel, it adds server-side rendering, file-based routing, API routes, and performance optimization on top of React. You write React components and Next.js handles everything else — routing, bundling, caching, and deployment.',
    },
    {
      type: 'analogy',
      title: 'Professional kitchen vs ingredients',
      content: 'Plain React is like cooking ingredients — you have everything you need but must assemble the kitchen yourself. Next.js is a fully-equipped professional kitchen — routing, server rendering, image optimization, and deployment are all pre-configured. You just cook.',
    },
    {
      type: 'heading',
      content: 'Why Next.js Over Plain React?',
    },
    {
      type: 'list',
      items: [
        'SSR for SEO — pages rendered on the server are fully indexable by search engines',
        'File-based routing — no react-router needed, folders become URL segments automatically',
        'API routes in the same project — build backend endpoints alongside your frontend',
        'Automatic code splitting — only the JavaScript needed for each page is sent to the browser',
        'Image optimization — next/image converts to WebP, lazy loads, and prevents layout shift',
        'Built-in TypeScript support — zero config TypeScript with strict types out of the box',
        'Server Components — render on the server with zero JavaScript sent to the client',
        'Edge runtime support — run code at CDN edge nodes closest to your users',
      ],
    },
    {
      type: 'heading',
      content: 'Core Features',
    },
    {
      type: 'table',
      headers: ['Feature', 'Description', 'Benefit'],
      rows: [
        ['App Router', 'Folder-based routing in the app directory', 'No router config, intuitive URL structure'],
        ['Server Components', 'React components that render on the server', 'Zero JS bundle, direct data access'],
        ['SSG', 'Static Site Generation at build time', 'Fastest possible page loads from CDN'],
        ['SSR', 'Server-Side Rendering per request', 'Fresh data on every request with good SEO'],
        ['ISR', 'Incremental Static Regeneration', 'Static speed with dynamic data revalidation'],
        ['API Routes', 'Route Handlers in app/api/', 'Full-stack in one project'],
        ['Image Optimization', 'next/image component', 'Auto WebP, responsive sizes, lazy loading'],
        ['Metadata API', 'Export metadata object from pages', 'SEO and social sharing without extra libraries'],
      ],
    },
    {
      type: 'heading',
      content: 'Project Structure',
    },
    {
      type: 'example',
      title: 'Next.js App Router project structure',
      content: 'The App Router uses a special folder convention. Every folder in the app directory becomes a URL segment. Files named page.tsx export a React component that becomes the page content. layout.tsx wraps pages with shared UI. route.ts creates API endpoints.',
      language: 'typescript',
      code: `my-app/
├── app/                    # App Router root
│   ├── layout.tsx          # Root layout (required) — wraps all pages
│   ├── page.tsx            # Homepage "/"
│   ├── globals.css         # Global styles
│   ├── about/
│   │   └── page.tsx        # "/about" route
│   ├── blog/
│   │   ├── page.tsx        # "/blog" route
│   │   └── [slug]/
│   │       └── page.tsx    # "/blog/my-post" dynamic route
│   └── api/
│       └── users/
│           └── route.ts    # "/api/users" API endpoint
├── components/             # Shared React components
├── lib/                    # Utility functions, DB clients
├── public/                 # Static assets (images, fonts)
├── next.config.ts          # Next.js configuration
└── package.json`,
    },
    {
      type: 'heading',
      content: 'Creating a Next.js App',
    },
    {
      type: 'example',
      title: 'Create a new Next.js project',
      content: 'npx create-next-app@latest scaffolds a complete project with TypeScript, Tailwind, ESLint, and the App Router pre-configured. The --yes flag accepts all defaults automatically.',
      language: 'bash',
      code: `# Create a new Next.js app with all defaults
npx create-next-app@latest my-app --yes

# Or with specific options
npx create-next-app@latest my-app \\
  --typescript \\
  --tailwind \\
  --eslint \\
  --app \\
  --src-dir \\
  --import-alias "@/*"

# Navigate into the project
cd my-app

# Start the development server
npm run dev

# The app is now running at http://localhost:3000`,
    },
    {
      type: 'example',
      title: 'Your first Next.js page',
      content: 'The default app/page.tsx is your homepage. Export a default React component and Next.js turns it into the "/" route automatically. Server Components can be async — you can fetch data directly in the component body.',
      language: 'typescript',
      code: `// app/page.tsx — this file IS the "/" route
// Server Component by default — runs on the server

export default function HomePage() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Welcome to Next.js</h1>
      <p>This is a Server Component — no JavaScript sent to the browser.</p>
    </main>
  );
}

// Async server component — fetch data directly
export default async function BlogPage() {
  const posts = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5')
    .then(r => r.json());

  return (
    <main>
      <h1>Blog</h1>
      {posts.map((post: { id: number; title: string }) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
        </article>
      ))}
    </main>
  );
}`,
    },
    {
      type: 'tryit',
      title: 'Simulated Next.js Page',
      css: `body{font-family:system-ui,sans-serif;padding:0;margin:0;background:#f0f2f5;}
.navbar{background:#000;color:#fff;padding:0 20px;height:48px;display:flex;align-items:center;gap:6px;}
.logo{font-weight:900;font-size:15px;margin-right:auto;}
.nav-btn{background:transparent;color:#fff;border:none;padding:6px 12px;border-radius:6px;font-size:13px;cursor:pointer;opacity:0.7;}
.nav-btn:hover,.nav-btn.active{opacity:1;background:rgba(255,255,255,0.15);}
.page{padding:18px;}
.route-bar{background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:8px 14px;font-family:monospace;font-size:12px;color:#555;margin-bottom:12px;display:flex;align-items:center;gap:6px;}
.route-dot{width:8px;height:8px;border-radius:50%;background:#16a34a;}
.hero{background:linear-gradient(135deg,#000 0%,#1e293b 100%);color:#fff;border-radius:12px;padding:24px;margin-bottom:12px;}
.hero h1{margin:0 0 8px;font-size:22px;}
.hero p{margin:0;color:#94a3b8;font-size:13px;}
.badge{display:inline-block;background:rgba(255,255,255,0.15);color:#fff;font-size:10px;padding:3px 8px;border-radius:20px;margin-bottom:10px;border:1px solid rgba(255,255,255,0.2);}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
.card{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:14px;}
.card-icon{font-size:20px;margin-bottom:6px;}
.card h3{margin:0 0 4px;font-size:13px;font-weight:700;}
.card p{margin:0;color:#666;font-size:11px;line-height:1.5;}`,
      js: `var pages = {
  '/': { title: 'Home', hero: 'Welcome to Next.js', desc: 'Server Component at app/page.tsx', file: 'app/page.tsx' },
  '/about': { title: 'About', hero: 'About This App', desc: 'Server Component at app/about/page.tsx', file: 'app/about/page.tsx' },
  '/blog': { title: 'Blog', hero: 'Blog Posts', desc: 'Async server component - fetches data at app/blog/page.tsx', file: 'app/blog/page.tsx' }
};

var currentRoute = '/';

function navigate(route) {
  currentRoute = route;
  var p = pages[route] || pages['/'];
  var navBtns = Object.keys(pages).map(function(r) {
    var active = r === route ? ' active' : '';
    return '<button class="nav-btn' + active + '" data-route="' + r + '">' + pages[r].title + '</button>';
  }).join('');
  document.getElementById('output').innerHTML =
    '<div class="navbar"><span class="logo">Next.js</span>' + navBtns + '</div>' +
    '<div class="page">' +
    '<div class="route-bar"><span class="route-dot"></span><strong>' + route + '</strong><span style="color:#999"> - ' + p.file + '</span></div>' +
    '<div class="hero">' +
    '<span class="badge">Server Component</span>' +
    '<h1>' + p.hero + '</h1>' +
    '<p>' + p.desc + '</p>' +
    '</div>' +
    '<div class="grid">' +
    '<div class="card"><div class="card-icon">JS</div><h3>Zero JS Bundle</h3><p>Server Components send only HTML - no React code reaches the browser</p></div>' +
    '<div class="card"><div class="card-icon">/</div><h3>File Routing</h3><p>Folders in app/ become URL routes - no router config needed</p></div>' +
    '<div class="card"><div class="card-icon">DB</div><h3>Direct Fetch</h3><p>async components can await data right in the component body</p></div>' +
    '</div></div>';
  document.querySelectorAll('.nav-btn').forEach(function(btn) {
    btn.addEventListener('click', function() { navigate(btn.getAttribute('data-route')); });
  });
}

navigate('/');`,
    },
  ],
  exercises: [
    {
      id: 'nextjs-intro-1',
      question: 'What is Next.js?',
      type: 'multiple-choice',
      options: [
        'A replacement for React that uses a different component model',
        'A React framework that adds SSR, routing, API routes, and performance features',
        'A CSS framework for styling React applications',
        'A testing library for React components',
      ],
      correct: 1,
      explanation: 'Next.js is a React framework — it builds on top of React and adds server-side rendering, file-based routing, API routes, image optimization, and many other production features. You still write React components.',
    },
    {
      id: 'nextjs-intro-2',
      question: 'How does file-based routing work in Next.js App Router?',
      type: 'multiple-choice',
      options: [
        'You define routes in a routes.config.ts file',
        'You use the react-router-dom library inside Next.js',
        'Folders in the app directory become URL segments and page.tsx files become routes',
        'Routes are defined as string arrays in next.config.ts',
      ],
      correct: 2,
      explanation: 'In the App Router, the folder structure inside the app directory defines your routes. A folder named "about" creates the "/about" URL. A page.tsx file inside that folder becomes the page component rendered at that route.',
    },
  ],
  quiz: [
    {
      id: 'nextjs-intro-q1',
      question: 'What is the primary SEO benefit of Server-Side Rendering (SSR)?',
      options: [
        'It makes pages load faster on slow connections',
        'Search engine crawlers receive fully rendered HTML, making content indexable',
        'It removes the need for meta tags',
        'It compresses JavaScript bundles automatically',
      ],
      correct: 1,
      explanation: 'With SSR, the server sends fully rendered HTML to the browser. Search engine crawlers can read this HTML directly and index the content. Without SSR, crawlers may see only an empty HTML shell with a JavaScript bundle, making content harder to index.',
    },
  ],
};
