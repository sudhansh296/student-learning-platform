import type { NextjsLesson } from '../nextjs-curriculum';

export const nextjsDataFetchingLesson: NextjsLesson = {
  id: 'nextjs-data-fetching',
  title: 'Data Fetching',
  slug: 'data-fetching',
  chapter: 'data',
  order: 7,
  difficulty: 'intermediate',
  readingTime: 12,
  description: 'Fetch data in server components, understand caching, revalidation strategies, and the fetch() API extensions.',
  sections: [
    {
      type: 'text',
      content: 'Next.js extends the native fetch() API with caching and revalidation options. Data fetching in Server Components runs on the server, supports async/await directly, and the results can be cached and revalidated on a schedule. Understanding the fetch options is key to controlling whether a page is static, dynamic, or incrementally regenerated.',
    },
    {
      type: 'heading',
      content: 'Basic Fetch in Server Components',
    },
    {
      type: 'example',
      title: 'Async server component with fetch',
      content: 'In a Server Component you can await fetch() directly in the component body. Next.js automatically deduplicates fetch requests - if the same URL is fetched multiple times during one render, only one network request is made.',
      language: 'typescript',
      code: `// app/users/page.tsx - Server Component
interface User {
  id: number;
  name: string;
  email: string;
}

export default async function UsersPage() {
  // This fetch runs on the server
  // Result is cached by default (force-cache)
  const users: User[] = await fetch(
    'https://jsonplaceholder.typicode.com/users'
  ).then(res => res.json());

  return (
    <div>
      <h1>Users ({users.length})</h1>
      {users.map(user => (
        <div key={user.id}>
          <strong>{user.name}</strong>
          <span> - {user.email}</span>
        </div>
      ))}
    </div>
  );
}`,
    },
    {
      type: 'heading',
      content: 'Cache Control',
    },
    {
      type: 'example',
      title: 'cache: no-store - always dynamic, never cached',
      content: 'Setting cache to "no-store" makes the fetch always skip the cache and fetch fresh data on every request. Use this for data that changes frequently and must always be current - like user notifications, live prices, or real-time feeds.',
      language: 'typescript',
      code: `// Dynamic data - never cache, always fetch fresh

export default async function LivePricePage() {
  const data = await fetch('https://api.example.com/prices', {
    cache: 'no-store', // Never cache - always fresh
  }).then(res => res.json());

  // This page is always dynamically rendered (SSR)
  return (
    <div>
      <h1>Live Prices</h1>
      <p>Last updated: {new Date().toISOString()}</p>
      {data.prices.map((item: { symbol: string; price: number }) => (
        <div key={item.symbol}>
          {item.symbol}: \${item.price}
        </div>
      ))}
    </div>
  );
}

// Alternatively, opt the whole route into dynamic rendering:
export const dynamic = 'force-dynamic';`,
    },
    {
      type: 'example',
      title: 'next.revalidate - Incremental Static Regeneration (ISR)',
      content: 'The revalidate option in the next object sets how many seconds the cached response should be used before refetching. This is Incremental Static Regeneration - the page is served statically but automatically refreshed in the background.',
      language: 'typescript',
      code: `// ISR - revalidate data every 60 seconds

export default async function BlogPage() {
  const posts = await fetch('https://api.example.com/posts', {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  }).then(res => res.json());

  // Page is statically generated AND auto-refreshed
  return (
    <div>
      {posts.map((post: { id: number; title: string }) => (
        <article key={post.id}><h2>{post.title}</h2></article>
      ))}
    </div>
  );
}

// Or set revalidate at the route segment level:
export const revalidate = 3600; // Revalidate whole route every hour

// On-demand revalidation (revalidate when data changes):
// Call this from a webhook or API route:
import { revalidatePath, revalidateTag } from 'next/cache';

// In an API route handler:
export async function POST(request: Request) {
  revalidatePath('/blog'); // Revalidate the /blog page
  revalidateTag('posts');  // Revalidate all fetches tagged 'posts'
  return Response.json({ revalidated: true });
}`,
    },
    {
      type: 'example',
      title: 'Parallel data fetching with Promise.all',
      content: 'When you need data from multiple sources, fetch them in parallel using Promise.all. Sequential awaits create a waterfall - each request waits for the previous one. Parallel fetching completes in the time of the slowest single request.',
      language: 'typescript',
      code: `// BAD - sequential fetching (waterfall)
export default async function BadPage() {
  const user = await fetch('/api/user').then(r => r.json()); // Wait...
  const posts = await fetch('/api/posts').then(r => r.json()); // Then wait...
  const comments = await fetch('/api/comments').then(r => r.json()); // Then wait...
  // Total time = 3x the average request time
}

// GOOD - parallel fetching
export default async function GoodPage() {
  const [user, posts, comments] = await Promise.all([
    fetch('/api/user').then(r => r.json()),
    fetch('/api/posts').then(r => r.json()),
    fetch('/api/comments').then(r => r.json()),
  ]);
  // Total time = slowest single request

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>{posts.length} posts, {comments.length} comments</p>
    </div>
  );
}`,
    },
    {
      type: 'example',
      title: 'Error handling in data fetching',
      content: 'Always handle fetch errors in production. Create an error.tsx file in the route segment for a UI error boundary, or handle errors inline with try/catch. The notFound() function from next/navigation renders the not-found.tsx page.',
      language: 'typescript',
      code: `import { notFound } from 'next/navigation';

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let post;
  try {
    const res = await fetch('https://api.example.com/posts/' + id);

    // Handle not found
    if (res.status === 404) {
      notFound(); // Renders not-found.tsx
    }

    // Handle other errors
    if (!res.ok) {
      throw new Error('Failed to fetch post: ' + res.status);
    }

    post = await res.json();
  } catch (error) {
    // error.tsx in the same folder will catch this
    throw error;
  }

  return <article><h1>{post.title}</h1></article>;
}

// app/blog/[id]/error.tsx - handles errors in this route
'use client'; // Error boundaries must be Client Components
export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>Something went wrong: {error.message}</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}`,
    },
    {
      type: 'tryit',
      title: 'Data Fetching Strategies',
      css: `body{font-family:system-ui,sans-serif;padding:14px;margin:0;background:#f0f2f5;}
.strategy-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px;}
.scard{background:#fff;border:2px solid #e5e7eb;border-radius:8px;padding:12px;cursor:pointer;transition:border-color 0.15s,box-shadow 0.15s;}
.scard:hover{border-color:#94a3b8;}
.scard.active{border-color:#000;box-shadow:0 2px 8px rgba(0,0,0,0.12);}
.slabel{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#666;margin-bottom:3px;}
.stitle{font-size:13px;font-weight:700;margin-bottom:3px;}
.sdesc{font-size:11px;color:#666;}
.code-box{background:#0d1117;color:#e6edf3;border-radius:8px;padding:12px;font-family:monospace;font-size:12px;line-height:1.8;margin-bottom:10px;white-space:pre;}
.result-box{background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:12px;font-size:13px;display:flex;align-items:flex-start;gap:10px;}
.badge{font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;color:#fff;flex-shrink:0;margin-top:1px;}
.sim-btn{margin-top:10px;background:#000;color:#fff;border:none;border-radius:6px;padding:8px 16px;font-size:12px;cursor:pointer;width:100%;}
.sim-result{margin-top:8px;font-size:12px;color:#666;min-height:20px;font-family:monospace;}`,
      js: `var strategies = [
  {
    label: 'Static (default)',
    title: 'force-cache',
    desc: 'Built once, served from CDN',
    badge: 'SSG',
    badgeColor: '#16a34a',
    code: 'const data = await fetch(url);\n// equivalent to:\nconst data = await fetch(url, {\n  cache: "force-cache"\n});',
    result: 'Cached at build time. Every visitor gets the same pre-built page served from CDN. Fastest possible load.',
    simSteps: ['Request hits CDN...', 'Cache HIT - pre-built page found!', 'Served in ~5ms. No server needed.']
  },
  {
    label: 'ISR',
    title: 'next.revalidate',
    desc: 'Static + background refresh',
    badge: 'ISR',
    badgeColor: '#2563eb',
    code: 'const data = await fetch(url, {\n  next: { revalidate: 60 }\n});\n\n// Also at route segment level:\nexport const revalidate = 60;',
    result: 'Served statically, refreshed every 60s in background. Best of both - CDN speed with fresh data.',
    simSteps: ['Request hits CDN...', 'Cache HIT - serving cached page', 'Background: checking if 60s elapsed...', 'Revalidating... new data fetched!', 'Next request serves fresh page.']
  },
  {
    label: 'Dynamic',
    title: 'no-store',
    desc: 'Fresh on every request',
    badge: 'SSR',
    badgeColor: '#dc2626',
    code: 'const data = await fetch(url, {\n  cache: "no-store"\n});\n\n// Or force the whole route:\nexport const dynamic = "force-dynamic";',
    result: 'Fetches fresh data on EVERY request. Always up to date - no caching. Slower than static.',
    simSteps: ['Request arrives at origin server...', 'No cache - fetching fresh data...', 'Data fetched, rendering page...', 'Response sent in ~150ms.']
  }
];

var active = 0;
var simInterval = null;

function select(i) {
  active = i;
  document.querySelectorAll('.scard').forEach(function(c, idx) {
    c.className = 'scard' + (idx === i ? ' active' : '');
  });
  var s = strategies[i];
  document.getElementById('code-display').textContent = s.code;
  document.getElementById('result-display').innerHTML =
    '<span class="badge" style="background:' + s.badgeColor + '">' + s.badge + '</span>' +
    '<span>' + s.result + '</span>';
  document.getElementById('sim-result').textContent = '';
  console.log('Strategy:', s.title, '|', s.badge);
}

function simulate() {
  var s = strategies[active];
  var step = 0;
  document.getElementById('sim-result').textContent = s.simSteps[0];
  if (simInterval) clearInterval(simInterval);
  simInterval = setInterval(function() {
    step++;
    if (step < s.simSteps.length) {
      document.getElementById('sim-result').textContent = s.simSteps[step];
    } else {
      clearInterval(simInterval);
    }
  }, 600);
}

document.getElementById('output').innerHTML =
  '<div class="strategy-grid">' +
  strategies.map(function(s, i) {
    return '<div class="scard' + (i === 0 ? ' active' : '') + '" data-idx="' + i + '">' +
      '<div class="slabel">' + s.label + '</div>' +
      '<div class="stitle">' + s.title + '</div>' +
      '<div class="sdesc">' + s.desc + '</div></div>';
  }).join('') +
  '</div>' +
  '<div class="code-box" id="code-display"></div>' +
  '<div class="result-box" id="result-display"></div>' +
  '<button class="sim-btn" id="sim-btn">Run Simulate Request</button>' +
  '<div class="sim-result" id="sim-result"></div>';

document.querySelectorAll('[data-idx]').forEach(function(card) {
  card.addEventListener('click', function() { select(parseInt(card.getAttribute('data-idx'))); });
});
document.getElementById('sim-btn').addEventListener('click', simulate);

select(0);`,
    },
  ],
  exercises: [
    {
      id: 'nextjs-df-1',
      question: 'What fetch option makes a page always fetch fresh data on every request?',
      type: 'multiple-choice',
      options: [
        '{ cache: "force-cache" }',
        '{ cache: "no-store" }',
        '{ next: { revalidate: 0 } }',
        '{ dynamic: true }',
      ],
      correct: 1,
      explanation: '{ cache: "no-store" } tells Next.js to never cache the fetch response. Every request to the page will trigger a new fetch to the API. This makes the page dynamically server-rendered on every request.',
    },
    {
      id: 'nextjs-df-2',
      question: 'What is the performance benefit of using Promise.all for multiple fetches?',
      type: 'multiple-choice',
      options: [
        'It reduces the size of each response',
        'All fetches run in parallel so total time equals the slowest single fetch',
        'It automatically retries failed requests',
        'It caches all responses for longer',
      ],
      correct: 1,
      explanation: 'Promise.all runs all fetches simultaneously in parallel. Without it, each await creates a waterfall where each fetch must complete before the next starts. With Promise.all, all fetches start at the same time and you wait for all of them - total time equals only the slowest single fetch.',
    },
  ],
  quiz: [
    {
      id: 'nextjs-df-q1',
      question: 'What is Incremental Static Regeneration (ISR)?',
      options: [
        'Generating only part of a static page at build time',
        'Serving static pages that automatically refresh their data in the background after a set interval',
        'Incrementally loading page content as the user scrolls',
        'Pre-rendering routes one at a time to avoid memory issues',
      ],
      correct: 1,
      explanation: 'ISR (Incremental Static Regeneration) combines static generation with automatic background revalidation. Pages are pre-rendered as static HTML for fast delivery, but after the revalidate interval expires, the next request triggers a background refetch. The stale version is served while the new version is being generated.',
    },
  ],
};
