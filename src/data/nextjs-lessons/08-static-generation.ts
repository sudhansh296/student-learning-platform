import type { NextjsLesson } from '../nextjs-curriculum';

export const nextjsStaticGenLesson: NextjsLesson = {
  id: 'nextjs-static-gen',
  title: 'Static Generation (SSG)',
  slug: 'static-generation',
  chapter: 'data',
  order: 8,
  difficulty: 'intermediate',
  readingTime: 10,
  description: 'Pre-render pages at build time for maximum performance - generateStaticParams, static export, and when to use static vs dynamic.',
  sections: [
    {
      type: 'text',
      content: 'Static Generation (SSG) pre-renders pages at build time. The resulting HTML is stored and served directly from a CDN on every request - no server computation needed. This gives the absolute fastest page loads. Next.js uses SSG by default for any page that does not use dynamic features.',
    },
    {
      type: 'analogy',
      title: 'Printed book vs printed-on-demand',
      content: 'Static Generation is like printing a book before the store opens - every copy is ready to hand out instantly. Dynamic rendering is like printing each book when someone orders it - fresher but slower. SSG is perfect when the content doesnt change between user visits.',
    },
    {
      type: 'heading',
      content: 'Static Pages by Default',
    },
    {
      type: 'example',
      title: 'Static page - default behavior with cached fetch',
      content: 'Any page that uses cached fetch or no dynamic features is automatically statically generated at build time. The page component runs once during the build and the resulting HTML is stored. All visitors get the same pre-built HTML.',
      language: 'typescript',
      code: `// app/about/page.tsx
// This page has no dynamic data - it is fully static

export default function AboutPage() {
  return (
    <main>
      <h1>About Us</h1>
      <p>We build great web applications with Next.js.</p>
    </main>
  );
}

// app/blog/page.tsx
// Fetch with caching - also becomes static
export default async function BlogPage() {
  const posts = await fetch('https://api.example.com/posts', {
    // Default: force-cache - static at build time
  }).then(r => r.json());

  return (
    <div>
      {posts.map((post: { id: number; title: string }) => (
        <article key={post.id}><h2>{post.title}</h2></article>
      ))}
    </div>
  );
}

// To verify static generation, run: npm run build
// Next.js will show "○" (static) next to these routes`,
    },
    {
      type: 'heading',
      content: 'generateStaticParams',
    },
    {
      type: 'example',
      title: 'generateStaticParams - pre-render dynamic routes',
      content: 'Dynamic routes like [slug] are not pre-rendered by default because Next.js does not know which slugs exist. Export generateStaticParams to tell Next.js which values to pre-render at build time. This turns dynamic routes into static pages.',
      language: 'typescript',
      code: `// app/blog/[slug]/page.tsx

interface Post {
  id: number;
  slug: string;
  title: string;
  content: string;
}

// Tell Next.js which slugs to pre-render at build time
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts')
    .then(r => r.json());

  // Return an array of param objects
  return posts.map((post: Post) => ({
    slug: post.slug,
  }));
  // Returns: [{ slug: 'hello-world' }, { slug: 'nextjs-tips' }, ...]
  // Next.js will build a static HTML file for each slug
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post: Post = await fetch('https://api.example.com/posts/' + slug)
    .then(r => r.json());

  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  );
}`,
    },
    {
      type: 'example',
      title: 'force-static - opt an entire route into static',
      content: 'Export the dynamic constant as "force-static" to force a route to be statically rendered even if it uses features that would normally make it dynamic. Dynamic values like cookies and headers will return empty values.',
      language: 'typescript',
      code: `// app/changelog/page.tsx

// Force this entire route to be statically generated
export const dynamic = 'force-static';

// Also useful: revalidate at the route segment level
export const revalidate = 86400; // Revalidate once per day

export default async function ChangelogPage() {
  const changelog = await fetch('https://api.example.com/changelog')
    .then(r => r.json());

  return (
    <div>
      <h1>Changelog</h1>
      {changelog.map((entry: { version: string; notes: string }) => (
        <section key={entry.version}>
          <h2>v{entry.version}</h2>
          <p>{entry.notes}</p>
        </section>
      ))}
    </div>
  );
}

// The 'dynamic' option values:
// 'auto'          - Next.js decides (default)
// 'force-dynamic' - always SSR, never cache
// 'force-static'  - always SSG, even with dynamic features
// 'error'         - throw error if dynamic features are used`,
    },
    {
      type: 'example',
      title: 'Static export - deploy anywhere',
      content: 'Configure output: "export" in next.config.ts to generate a fully static site with no Node.js server required. This is perfect for hosting on GitHub Pages, S3, or any static file host. Note: API routes, ISR, and some image optimization features are not available in static export.',
      language: 'typescript',
      code: `// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',          // Generate static HTML/CSS/JS files
  trailingSlash: true,       // /about/ instead of /about
  images: {
    unoptimized: true,       // Required for static export
  },
};

export default nextConfig;

// After running 'npm run build':
// The 'out/' folder contains all static files
// Deploy by uploading 'out/' to any static host

// What static export CANNOT do:
// [X] API routes (Route Handlers)
// [X] ISR (revalidate at runtime)
// [X] Server Actions
// [X] Middleware (limited support)
// [X] next/image optimization (use unoptimized: true)

// What static export CAN do:
// [OK] generateStaticParams for all dynamic routes
// [OK] Client Components with full interactivity
// [OK] All static pages and layouts`,
    },
    {
      type: 'tryit',
      title: 'Static vs Dynamic Rendering',
      css: `body{font-family:system-ui,sans-serif;padding:14px;margin:0;background:#f5f5f5;}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;}
.panel{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:14px;}
.panel-title{font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;}
.static-title{color:#16a34a;} .dynamic-title{color:#dc2626;}
.item{font-size:12px;padding:4px 0;border-bottom:1px solid #f3f4f6;display:flex;align-items:center;gap:6px;}
.icon-g{color:#16a34a;} .icon-r{color:#dc2626;}
.sim-area{background:#0d1117;color:#e6edf3;border-radius:10px;padding:14px;font-family:monospace;font-size:12px;line-height:1.8;}
.btn-row{display:flex;gap:8px;margin-bottom:10px;}
.btn{border:none;border-radius:6px;padding:7px 14px;font-size:12px;cursor:pointer;font-weight:bold;}
.btn-s{background:#16a34a;color:#fff;} .btn-d{background:#dc2626;color:#fff;}`,
      js: `document.getElementById('output').innerHTML =
  '<div class="grid">' +
  '<div class="panel">' +
  '<div class="panel-title static-title">Static Generation (SSG)</div>' +
  '<div class="item"><span class="icon-g">[OK]</span> Built once at deploy time</div>' +
  '<div class="item"><span class="icon-g">[OK]</span> Served from CDN edge</div>' +
  '<div class="item"><span class="icon-g">[OK]</span> Fastest TTFB possible</div>' +
  '<div class="item"><span class="icon-g">[OK]</span> No server cost per request</div>' +
  '<div class="item"><span class="icon-r">[X]</span> Stale until next build/revalidate</div>' +
  '<div class="item"><span class="icon-r">[X]</span> No per-user personalization</div>' +
  '</div>' +
  '<div class="panel">' +
  '<div class="panel-title dynamic-title">Dynamic Rendering (SSR)</div>' +
  '<div class="item"><span class="icon-g">[OK]</span> Always fresh data</div>' +
  '<div class="item"><span class="icon-g">[OK]</span> Per-user personalization</div>' +
  '<div class="item"><span class="icon-g">[OK]</span> Access cookies and headers</div>' +
  '<div class="item"><span class="icon-r">[X]</span> Server runs on every request</div>' +
  '<div class="item"><span class="icon-r">[X]</span> Higher latency than CDN</div>' +
  '<div class="item"><span class="icon-r">[X]</span> Higher server costs</div>' +
  '</div></div>' +
  '<div class="btn-row">' +
  '<button class="btn btn-s" id="btn-static">Simulate Static Load</button>' +
  '<button class="btn btn-d" id="btn-dynamic">Simulate Dynamic Load</button>' +
  '</div>' +
  '<div class="sim-area" id="sim-output">Click a button to simulate page rendering...</div>';

document.getElementById('btn-static').addEventListener('click', function() {
  var out = document.getElementById('sim-output');
  out.textContent = '> Static page request... > CDN: Cache HIT - serving pre-built HTML > Time to first byte: ~5ms > No server computation required > HTML delivered from edge node nearest to user';
  console.log('Static: served from CDN, ~5ms TTFB');
});

document.getElementById('btn-dynamic').addEventListener('click', function() {
  var out = document.getElementById('sim-output');
  out.textContent = '> Dynamic page request... > CDN: Cache MISS - forwarding to origin server > Server: running async component... > Server: fetching fresh data from database... > Server: rendering React tree to HTML... > Response sent: ~150ms TTFB > Data is always fresh and personalized';
  console.log('Dynamic: server rendered, ~150ms TTFB');
});`,
    },
  ],
  exercises: [
    {
      id: 'nextjs-ssg-1',
      question: 'What is the purpose of the generateStaticParams function?',
      type: 'multiple-choice',
      options: [
        'To generate TypeScript types for route parameters',
        'To validate params before the page renders',
        'To tell Next.js which dynamic route values to pre-render as static pages at build time',
        'To generate URL parameters for navigation links',
      ],
      correct: 2,
      explanation: 'generateStaticParams tells Next.js which parameter values exist for a dynamic route. For [slug], it returns an array like [{ slug: "post-1" }, { slug: "post-2" }]. Next.js pre-renders a static HTML file for each entry during the build.',
    },
    {
      id: 'nextjs-ssg-2',
      question: 'Which next.config.ts option enables fully static export (no Node.js server needed)?',
      type: 'multiple-choice',
      options: [
        'export: true',
        'mode: "static"',
        'output: "export"',
        'static: "full"',
      ],
      correct: 2,
      explanation: 'Setting output: "export" in next.config.ts tells Next.js to generate a static HTML/CSS/JS output in the "out" folder. This can be deployed to any static file host without a Node.js server.',
    },
  ],
  quiz: [
    {
      id: 'nextjs-ssg-q1',
      question: 'When is the best time to use Static Generation over Server-Side Rendering?',
      options: [
        'When content changes every few minutes',
        'When pages need user authentication to display personalized data',
        'When content is the same for all users and doesnt change between builds',
        'When the page uses browser APIs',
      ],
      correct: 2,
      explanation: 'Static Generation is ideal when the content is the same for all users and does not need to change in real-time - blog posts, documentation, marketing pages, product listings. These pages benefit from CDN delivery and need no per-request server computation.',
    },
  ],
};
