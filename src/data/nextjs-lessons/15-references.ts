import type { NextjsLesson } from '../nextjs-curriculum';

export const nextjsReferencesLesson: NextjsLesson = {
  id: 'nextjs-references',
  title: 'Next.js Quick Reference',
  slug: 'references',
  chapter: 'advanced',
  order: 15,
  difficulty: 'beginner',
  readingTime: 12,
  description: 'Complete Next.js cheat sheet - file conventions, config options, built-in components, and hooks reference.',
  sections: [
    {
      type: 'text',
      content: 'This reference covers the most important Next.js concepts in one place. Use it as a quick lookup when building your Next.js applications. All sections are organized by category for fast scanning.',
    },
    {
      type: 'heading',
      content: 'File Conventions',
    },
    {
      type: 'table',
      title: 'Special files in the app directory',
      headers: ['File', 'Purpose', 'Notes'],
      rows: [
        ['page.tsx', 'Creates a publicly accessible route', 'Required to make a folder a route'],
        ['layout.tsx', 'Shared UI that wraps children', 'Persists across navigations'],
        ['template.tsx', 'Like layout but remounts each nav', 'Use for animations, page views'],
        ['loading.tsx', 'Loading UI shown via Suspense', 'Instant loading states'],
        ['error.tsx', 'Error boundary for the segment', 'Must be a Client Component'],
        ['not-found.tsx', 'Renders when notFound() is called', 'Custom 404 pages'],
        ['route.ts', 'API endpoint (Route Handler)', 'Export GET, POST, PUT, DELETE, etc.'],
        ['middleware.ts', 'Runs before requests complete', 'Lives at root / src/, not in app/'],
        ['robots.ts', 'Generates /robots.txt', 'Return MetadataRoute.Robots object'],
        ['sitemap.ts', 'Generates /sitemap.xml', 'Return MetadataRoute.Sitemap array'],
        ['opengraph-image.tsx', 'Dynamic OG image generation', 'Uses ImageResponse from next/og'],
      ],
    },
    {
      type: 'heading',
      content: 'Routing Conventions',
    },
    {
      type: 'table',
      title: 'Folder naming patterns',
      headers: ['Folder Pattern', 'URL Match', 'Example'],
      rows: [
        ['app/blog/page.tsx', '/blog', 'Static route'],
        ['app/blog/[slug]/page.tsx', '/blog/any-value', 'Dynamic route'],
        ['app/blog/[...slug]/page.tsx', '/blog/a/b/c (1+ segments)', 'Catch-all route'],
        ['app/blog/[[...slug]]/page.tsx', '/blog, /blog/a/b (0+ segments)', 'Optional catch-all'],
        ['app/(group)/page.tsx', '/ (group not in URL)', 'Route group'],
        ['app/_components/Button.tsx', 'Not a route', 'Private folder (prefixed _)'],
        ['app/@modal/page.tsx', 'Parallel route slot', 'Parallel routes'],
      ],
    },
    {
      type: 'heading',
      content: 'Metadata Fields',
    },
    {
      type: 'table',
      title: 'Common metadata object fields',
      headers: ['Field', 'Type', 'Description'],
      rows: [
        ['title', 'string | { default; template }', 'Page title - template uses %s placeholder'],
        ['description', 'string', 'Page meta description (shown in search results)'],
        ['keywords', 'string[]', 'SEO keywords array'],
        ['metadataBase', 'URL', 'Base URL for resolving relative OG image URLs'],
        ['openGraph.title', 'string', 'Title shown in social shares'],
        ['openGraph.description', 'string', 'Description shown in social shares'],
        ['openGraph.images', 'object[]', 'OG images - recommended 1200x630px'],
        ['twitter.card', 'string', '"summary_large_image" | "summary"'],
        ['twitter.creator', 'string', 'Twitter handle like "@username"'],
        ['robots.index', 'boolean', 'Whether search engines should index the page'],
        ['canonical', 'string', 'The canonical URL for this page'],
      ],
    },
    {
      type: 'heading',
      content: 'Fetch Options',
    },
    {
      type: 'table',
      title: 'Next.js extended fetch() options',
      headers: ['Option', 'Behavior', 'Use Case'],
      rows: [
        ['{ cache: "force-cache" }', 'Static - cached at build time (default)', 'Blog posts, docs, marketing pages'],
        ['{ cache: "no-store" }', 'Dynamic - never cached, always fresh', 'User data, live prices, real-time feeds'],
        ['{ next: { revalidate: 60 } }', 'ISR - cached, refreshed every N seconds', 'Product listings, news feeds'],
        ['{ next: { tags: ["posts"] } }', 'Tag-based - revalidate by tag', 'CMS content with webhooks'],
      ],
    },
    {
      type: 'heading',
      content: 'Built-in Components',
    },
    {
      type: 'example',
      title: 'next/link - navigation with prefetching',
      content: 'The Link component handles client-side navigation and automatically prefetches linked pages when they enter the viewport.',
      language: 'typescript',
      code: `import Link from 'next/link';

// Basic usage
<Link href="/about">About</Link>

// Dynamic route
<Link href={"/blog/" + slug}>Post</Link>

// With query params
<Link href={{ pathname: '/search', query: { q: 'nextjs' } }}>Search</Link>

// Options
<Link href="/terms" prefetch={false}>Terms</Link>  // Disable prefetch
<Link href="/login" replace>Login</Link>            // Replace history
<Link href="https://nextjs.org" target="_blank" rel="noopener">Docs</Link>`,
    },
    {
      type: 'example',
      title: 'next/image - optimized images',
      content: 'The Image component optimizes images automatically - WebP conversion, lazy loading, responsive sizing, and layout shift prevention.',
      language: 'typescript',
      code: `import Image from 'next/image';

// Fixed size (width + height required)
<Image src="/photo.jpg" alt="Photo" width={800} height={600} />

// Fill container (parent must have position: relative)
<div style={{ position: 'relative', height: '400px' }}>
  <Image src="/banner.jpg" alt="Banner" fill style={{ objectFit: 'cover' }} />
</div>

// Priority (preload above-the-fold images)
<Image src="/hero.jpg" alt="Hero" width={1200} height={600} priority />

// Responsive sizes hint
<Image
  src="/photo.jpg" alt="Photo" width={800} height={600}
  sizes="(max-width: 768px) 100vw, 50vw"
/>`,
    },
    {
      type: 'heading',
      content: 'Client-Side Hooks',
    },
    {
      type: 'table',
      title: 'next/navigation hooks (Client Components only)',
      headers: ['Hook', 'Returns', 'Use Case'],
      rows: [
        ['useRouter()', 'router object', 'Programmatic navigation (push, replace, back, refresh)'],
        ['usePathname()', 'string', 'Current URL pathname - active link highlighting'],
        ['useSearchParams()', 'URLSearchParams', 'Read query string values like ?q=search'],
        ['useParams()', 'object', 'Read dynamic route params in Client Components'],
      ],
    },
    {
      type: 'heading',
      content: 'next.config.ts Options',
    },
    {
      type: 'table',
      title: 'Commonly used next.config.ts options',
      headers: ['Option', 'Default', 'Description'],
      rows: [
        ['output', 'undefined', '"standalone" for Docker, "export" for static HTML'],
        ['images.remotePatterns', '[]', 'Allowed remote image domains for next/image'],
        ['redirects()', '[]', 'Permanent (301) or temporary (302) URL redirects'],
        ['rewrites()', '[]', 'Proxy requests internally without changing URL'],
        ['headers()', '[]', 'Add HTTP headers to responses'],
        ['env', '{}', 'Expose server env vars to the app (compile time)'],
        ['compress', 'true', 'Enable gzip compression for responses'],
        ['reactStrictMode', 'true', 'Enable React Strict Mode'],
        ['experimental.serverActions', 'true', 'Server Actions (enabled by default in v14+)'],
      ],
    },
    {
      type: 'heading',
      content: 'Route Segment Config',
    },
    {
      type: 'example',
      title: 'Route segment config exports',
      content: 'Export constants from any page.tsx, layout.tsx, or route.ts to control how Next.js renders and caches that segment.',
      language: 'typescript',
      code: `// Any page.tsx, layout.tsx, or route.ts

// Rendering behavior
export const dynamic = 'auto';         // Next.js decides
export const dynamic = 'force-dynamic'; // Always SSR
export const dynamic = 'force-static';  // Always SSG
export const dynamic = 'error';         // Error if dynamic needed

// Caching revalidation interval (seconds)
export const revalidate = 60;    // ISR - revalidate every 60s
export const revalidate = 0;     // Always dynamic
export const revalidate = false; // Cache forever (default static)

// Runtime (where this segment executes)
export const runtime = 'nodejs'; // Default
export const runtime = 'edge';   // Edge runtime (faster, limited APIs)

// Prefetching behavior
export const fetchCache = 'auto';
export const fetchCache = 'force-cache';
export const fetchCache = 'force-no-store';

// Custom headers for the whole segment
export const preferredRegion = 'auto';
export const preferredRegion = ['iad1', 'sfo1']; // Vercel regions`,
    },
    {
      type: 'tryit',
      title: 'Next.js Pattern Lookup',
      css: `body{font-family:system-ui,sans-serif;padding:14px;margin:0;background:#f5f5f5;}
.search-row{display:flex;gap:8px;margin-bottom:12px;}
input{flex:1;border:1px solid #e5e7eb;border-radius:8px;padding:9px 14px;font-size:14px;}
.results{display:grid;gap:8px;}
.result{background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:12px;}
.result-title{font-size:13px;font-weight:bold;margin-bottom:4px;}
.result-code{background:#0d1117;color:#e6edf3;border-radius:6px;padding:8px;font-family:monospace;font-size:11px;line-height:1.7;margin-top:6px;white-space:pre;}
.tag{display:inline-block;font-size:10px;background:#f3f4f6;border-radius:4px;padding:2px 6px;margin-right:4px;color:#555;}
.no-result{color:#666;font-size:13px;padding:10px;}`,
      js: `const patterns = [
  { title: 'Dynamic page route', tags: ['routing','dynamic'], code: '// app/blog/[slug]/page.tsx export default async function Page({ params }) {   const { slug } = await params;   return <h1>{slug}</h1>; }' },
  { title: 'Fetch with revalidation (ISR)', tags: ['data','cache','isr'], code: "const data = await fetch(url, {   next: { revalidate: 60 } });" },
  { title: 'Static metadata export', tags: ['seo','metadata'], code: "export const metadata = {   title: 'Page Title',   description: 'Page description' };" },
  { title: 'API Route Handler', tags: ['api','route'], code: "// app/api/users/route.ts export async function GET() {   return Response.json({ users: [] }); } export async function POST(req) {   const body = await req.json();   return Response.json(body, { status: 201 }); }" },
  { title: 'Client Component with state', tags: ['client','interactive','state'], code: "'use client'; import { useState } from 'react'; export function Counter() {   const [n, setN] = useState(0);   return <button onClick={() => setN(n+1)}>{n}</button>; }" },
  { title: 'Dynamic generateMetadata', tags: ['seo','metadata','dynamic'], code: "export async function generateMetadata({ params }) {   const post = await getPost(params.slug);   return { title: post.title, description: post.excerpt }; }" },
  { title: 'Auth redirect in middleware', tags: ['middleware','auth'], code: "// middleware.ts export function middleware(req) {   const token = req.cookies.get('token');   if (!token) return NextResponse.redirect(new URL('/login', req.url));   return NextResponse.next(); }" },
  { title: 'Image with fill', tags: ['image','layout'], code: "<div style={{ position: 'relative', height: '400px' }}>   <Image src='/photo.jpg' alt='' fill     style={{ objectFit: 'cover' }} /> </div>" },
  { title: 'generateStaticParams', tags: ['ssg','static','routing'], code: "export async function generateStaticParams() {   const posts = await getPosts();   return posts.map(p => ({ slug: p.slug })); }" },
  { title: 'Parallel fetch with Promise.all', tags: ['data','performance'], code: "const [user, posts] = await Promise.all([   fetch('/api/user').then(r => r.json()),   fetch('/api/posts').then(r => r.json()), ]);" },
];

function search(query) {
  const q = query.toLowerCase();
  const filtered = q
    ? patterns.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q))
      )
    : patterns;

  const container = document.getElementById('results');
  if (!filtered.length) {
    container.innerHTML = '<div class="no-result">No patterns found for "' + query + '"</div>';
    return;
  }
  container.innerHTML = filtered.map(p =>
    '<div class="result">' +
    '<div class="result-title">' + p.title + '</div>' +
    '<div>' + p.tags.map(t => '<span class="tag">' + t + '</span>').join('') + '</div>' +
    '<div class="result-code">' + p.code.replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</div>' +
    '</div>'
  ).join('');
  console.log('Found', filtered.length, 'patterns for query:', query || '(all)');
}

document.getElementById('output').innerHTML =
  '<div class="search-row"><input id="search-input" placeholder="Search patterns (e.g. routing, auth, fetch, image...)" oninput="search(this.value)" /></div>' +
  '<div class="results" id="results"></div>';

search('');`,
    },
  ],
  exercises: [
    {
      id: 'nextjs-ref-1',
      question: 'Which file in the app directory creates a custom 404 page in Next.js?',
      type: 'multiple-choice',
      options: [
        '404.tsx',
        'not-found.tsx',
        'error.tsx',
        'missing.tsx',
      ],
      correct: 1,
      explanation: 'The not-found.tsx file in the app directory (or any subfolder) creates a custom not-found page. It is rendered when you call the notFound() function from next/navigation in a server component, or when no matching route is found.',
    },
    {
      id: 'nextjs-ref-2',
      question: 'What does export const revalidate = 3600 do in a page.tsx file?',
      type: 'multiple-choice',
      options: [
        'Sets the page session timeout to 3600 seconds',
        'Makes the page reload in the browser every hour',
        'Sets the ISR revalidation interval - the page is refreshed every 3600 seconds in the background',
        'Caches API responses for 3600 milliseconds',
      ],
      correct: 2,
      explanation: 'Exporting revalidate from a page, layout, or route segment sets the ISR (Incremental Static Regeneration) interval in seconds. The page is statically generated and then automatically re-generated in the background every 3600 seconds (1 hour) when a request comes in.',
    },
  ],
  quiz: [
    {
      id: 'nextjs-ref-q1',
      question: 'What is the purpose of the Route Group pattern (using parentheses around folder names)?',
      options: [
        'It marks routes as private so they require authentication',
        'It creates optional route segments that may or may not match',
        'It organizes routes into groups without affecting the URL structure',
        'It creates nested layouts that override the root layout',
      ],
      correct: 2,
      explanation: 'Route groups use parentheses like (marketing) or (app) to organize routes logically without including the folder name in the URL. This lets you apply different layouts to subsets of routes, or just organize your file structure, without changing the actual URLs users see.',
    },
  ],
};
