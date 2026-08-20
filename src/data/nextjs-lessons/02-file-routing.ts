import type { NextjsLesson } from '../nextjs-curriculum';

export const nextjsFileRoutingLesson: NextjsLesson = {
  id: 'nextjs-file-routing',
  title: 'File-Based Routing',
  slug: 'file-routing',
  chapter: 'routing',
  order: 2,
  difficulty: 'beginner',
  readingTime: 10,
  description: 'How Next.js App Router creates routes from the folder structure - page.tsx, layout.tsx, and dynamic routes.',
  sections: [
    {
      type: 'text',
      content: 'Next.js App Router uses the filesystem as your router. Every folder inside the app directory becomes a URL segment. The only special file names are page.tsx (makes a route publicly accessible), layout.tsx (wraps child routes), loading.tsx (suspense loading UI), error.tsx (error boundaries), and not-found.tsx (404 pages).',
    },
    {
      type: 'heading',
      content: 'Basic Pages and Nested Routes',
    },
    {
      type: 'example',
      title: 'Creating pages with folder structure',
      content: 'Each folder in the app directory maps to a URL segment. A page.tsx file inside the folder creates the accessible route. Folders without a page.tsx are not publicly accessible - they can hold layouts or loading states without exposing a URL.',
      language: 'typescript',
      code: `// Folder structure maps to URLs:
// app/page.tsx              -> "/"
// app/about/page.tsx        -> "/about"
// app/contact/page.tsx      -> "/contact"
// app/blog/page.tsx         -> "/blog"
// app/blog/post/page.tsx    -> "/blog/post"

// app/page.tsx
export default function HomePage() {
  return <h1>Home Page</h1>;
}

// app/about/page.tsx
export default function AboutPage() {
  return <h1>About Us</h1>;
}

// app/blog/page.tsx
export default function BlogPage() {
  return <h1>All Blog Posts</h1>;
}`,
    },
    {
      type: 'heading',
      content: 'Dynamic Routes',
    },
    {
      type: 'example',
      title: 'Dynamic [slug] routes - single segment',
      content: 'Wrap a folder name in square brackets to make it dynamic. The dynamic segment value is available in the params prop. This lets one file handle any value at that URL position - like /blog/hello-world or /blog/typescript-tips.',
      language: 'typescript',
      code: `// app/blog/[slug]/page.tsx
// Handles: /blog/hello-world, /blog/any-post-title, etc.

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  // Fetch data using the dynamic segment
  const post = await fetch(\`https://api.example.com/posts/\${slug}\`)
    .then(r => r.json());

  return (
    <article>
      <h1>{post.title}</h1>
      <p>Slug: {slug}</p>
    </article>
  );
}

// app/users/[id]/page.tsx
// Handles: /users/1, /users/42, /users/abc
interface UserProps {
  params: Promise<{ id: string }>;
}

export default async function UserPage({ params }: UserProps) {
  const { id } = await params;
  return <div>User ID: {id}</div>;
}`,
    },
    {
      type: 'example',
      title: 'Catch-all [...slug] routes - multiple segments',
      content: 'Use [...slug] to match any number of URL segments. The params.slug value will be an array of strings. Optional catch-all [[...slug]] also matches the base path when no segments are present.',
      language: 'typescript',
      code: `// app/docs/[...slug]/page.tsx
// Handles: /docs/intro, /docs/api/users, /docs/api/auth/login, etc.

interface Props {
  params: Promise<{ slug: string[] }>;
}

export default async function DocsPage({ params }: Props) {
  const { slug } = await params;
  // slug is an array: ['api', 'users'] for /docs/api/users

  const path = slug.join('/'); // "api/users"

  return (
    <div>
      <h1>Docs: {path}</h1>
      <p>Segments: {slug.length}</p>
      <ul>
        {slug.map((segment, i) => (
          <li key={i}>{segment}</li>
        ))}
      </ul>
    </div>
  );
}

// Optional catch-all: [[...slug]] also matches /docs (no segments)
// app/docs/[[...slug]]/page.tsx
// Handles: /docs, /docs/intro, /docs/api/users`,
    },
    {
      type: 'example',
      title: 'Route Groups - organize without affecting URLs',
      content: 'Wrap a folder name in parentheses to create a route group. Route groups do not appear in the URL. They are used to organize files into logical groups or to apply different layouts to subsets of routes without changing the URL structure.',
      language: 'typescript',
      code: `// Route groups use (folderName) syntax
// The folder name is NOT included in the URL

// app/(marketing)/page.tsx      -> "/"
// app/(marketing)/about/page.tsx -> "/about"
// app/(app)/dashboard/page.tsx   -> "/dashboard"
// app/(app)/settings/page.tsx    -> "/settings"

// Each route group can have its own layout:
// app/(marketing)/layout.tsx  - marketing layout (hero, footer)
// app/(app)/layout.tsx        - app layout (sidebar, navbar)

// Useful for applying auth to a subset of routes:
// app/(authenticated)/dashboard/page.tsx
// app/(authenticated)/profile/page.tsx
// app/(authenticated)/layout.tsx  <- check auth here

// app/(public)/login/page.tsx    <- no auth check needed`,
    },
    {
      type: 'note',
      title: 'page.tsx vs folder',
      content: 'A folder without a page.tsx file is not a public route. It can hold a layout, loading state, or error boundary for its children, but navigating to that URL returns a 404. Only folders with page.tsx create accessible routes.',
    },
    {
      type: 'tryit',
      title: 'File-Based Routing Explorer',
      css: `body{font-family:system-ui,sans-serif;padding:14px;background:#f0f2f5;margin:0;}
.container{max-width:600px;}
h3{margin:0 0 10px;font-size:15px;color:#111;font-weight:700;}
.file-tree{background:#0d1117;color:#e6edf3;border-radius:10px;padding:14px;font-family:monospace;font-size:12px;line-height:2;margin-bottom:12px;}
.folder{color:#79c0ff;cursor:default;}
.file{color:#7ee787;}
.file.highlight{color:#ffa657;background:rgba(255,166,87,0.12);border-radius:4px;padding:0 3px;}
.route-tag{color:#ffa657;font-size:10px;}
.url-bar{background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:9px 14px;font-family:monospace;font-size:13px;margin-bottom:10px;display:flex;align-items:center;gap:8px;}
.url-label{color:#666;font-size:11px;}
.url-val{color:#000;font-weight:bold;}
.btn-row{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:10px;}
.route-btn{background:#000;color:#fff;border:none;border-radius:6px;padding:6px 12px;font-size:11px;cursor:pointer;font-family:monospace;}
.route-btn:hover{background:#2563eb;}
.result{background:#fff;border:2px solid #2563eb;border-radius:8px;padding:12px;font-size:13px;}
.result strong{display:block;color:#2563eb;margin-bottom:4px;font-size:11px;text-transform:uppercase;letter-spacing:1px;}
.result .file-path{font-family:monospace;font-size:13px;color:#000;}
.result .params{font-family:monospace;font-size:12px;color:#666;margin-top:4px;}`,
      js: `var routeMap = {
  '/': { file: 'app/page.tsx', params: null, type: 'Static route' },
  '/about': { file: 'app/about/page.tsx', params: null, type: 'Static route' },
  '/blog': { file: 'app/blog/page.tsx', params: null, type: 'Static route' },
  '/blog/hello-world': { file: 'app/blog/[slug]/page.tsx', params: '{ slug: "hello-world" }', type: 'Dynamic [slug]' },
  '/blog/nextjs-tips': { file: 'app/blog/[slug]/page.tsx', params: '{ slug: "nextjs-tips" }', type: 'Dynamic [slug]' },
  '/docs/api/users': { file: 'app/docs/[...slug]/page.tsx', params: '{ slug: ["api", "users"] }', type: 'Catch-all [...slug]' },
  '/users/42': { file: 'app/users/[id]/page.tsx', params: '{ id: "42" }', type: 'Dynamic [id]' },
  '/nonexistent': { file: '404 - no page.tsx at this path', params: null, type: 'Not found' }
};

function navigate(url) {
  var r = routeMap[url] || routeMap['/nonexistent'];
  document.getElementById('url-val').textContent = url;
  var paramsHtml = r.params ? '<div class="params">params = ' + r.params + '</div>' : '';
  document.getElementById('result-box').innerHTML =
    '<strong>' + r.type + '</strong>' +
    '<div class="file-path">' + r.file + '</div>' +
    paramsHtml;
  console.log('URL:', url, '->', r.file, r.params ? '| params: ' + r.params : '');
}

document.getElementById('output').innerHTML =
  '<div class="container">' +
  '<h3>File-Based Routing Explorer</h3>' +
  '<div class="file-tree">' +
  '<span class="folder">app/</span>\n' +
  '  <span class="file">+-- page.tsx</span>  <span class="route-tag">-&gt; "/"</span>\n' +
  '  <span class="folder">+-- about/</span>\n' +
  '  <span class="file">|   +-- page.tsx</span>  <span class="route-tag">-&gt; "/about"</span>\n' +
  '  <span class="folder">+-- blog/</span>\n' +
  '  <span class="file">|   +-- page.tsx</span>  <span class="route-tag">-&gt; "/blog"</span>\n' +
  '  <span class="folder">|   +-- [slug]/</span>\n' +
  '  <span class="file">|       +-- page.tsx</span>  <span class="route-tag">-&gt; "/blog/*"</span>\n' +
  '  <span class="folder">+-- docs/[...slug]/</span>\n' +
  '  <span class="file">|   +-- page.tsx</span>  <span class="route-tag">-&gt; "/docs/**"</span>\n' +
  '  <span class="folder">+-- users/[id]/</span>\n' +
  '      <span class="file">+-- page.tsx</span>  <span class="route-tag">-&gt; "/users/:id"</span>' +
  '</div>' +
  '<div class="url-bar"><span class="url-label">URL:</span><span class="url-val" id="url-val">/</span></div>' +
  '<div class="btn-row">' +
  '<button class="route-btn" data-route="/">/</button>' +
  '<button class="route-btn" data-route="/about">/about</button>' +
  '<button class="route-btn" data-route="/blog">/blog</button>' +
  '<button class="route-btn" data-route="/blog/hello-world">/blog/hello-world</button>' +
  '<button class="route-btn" data-route="/docs/api/users">/docs/api/users</button>' +
  '<button class="route-btn" data-route="/users/42">/users/42</button>' +
  '<button class="route-btn" data-route="/nonexistent">/nonexistent</button>' +
  '</div>' +
  '<div class="result" id="result-box">Click a URL to see which file handles it</div>' +
  '</div>';

document.querySelectorAll('[data-route]').forEach(function(btn) { btn.addEventListener('click', function() { navigate(btn.getAttribute('data-route')); }); });

navigate('/');`,
    },
  ],
  exercises: [
    {
      id: 'nextjs-routing-1',
      question: 'What file do you create to make a route publicly accessible in the App Router?',
      type: 'multiple-choice',
      options: [
        'index.tsx inside the folder',
        'page.tsx inside the folder',
        'route.tsx inside the folder',
        'default.tsx inside the folder',
      ],
      correct: 1,
      explanation: 'In the App Router, page.tsx is the special file that makes a folder publicly accessible as a URL route. A folder without page.tsx is not a public route - it can hold layouts or other special files but will return 404 for direct navigation.',
    },
    {
      id: 'nextjs-routing-2',
      question: 'How do you create a dynamic route for /products/[id] in the App Router?',
      type: 'multiple-choice',
      options: [
        'Create app/products/:id/page.tsx',
        'Create app/products/{id}/page.tsx',
        'Create app/products/[id]/page.tsx',
        'Define the route in next.config.ts',
      ],
      correct: 2,
      explanation: 'Dynamic route segments use square brackets in the folder name. app/products/[id]/page.tsx creates a dynamic route that matches /products/1, /products/abc, /products/any-value. The value is available via the params prop.',
    },
  ],
  quiz: [
    {
      id: 'nextjs-routing-q1',
      question: 'What does the [...slug] folder name syntax create?',
      options: [
        'A route that only matches exactly one URL segment',
        'A catch-all route that matches any number of URL segments',
        'A route group that doesnt affect the URL structure',
        'An optional route that may or may not exist',
      ],
      correct: 1,
      explanation: 'The [...slug] syntax creates a catch-all route. It matches any number of URL segments and provides them as an array in params.slug. For example, /docs/api/users gives { slug: ["api", "users"] }.',
    },
  ],
};
