import type { NextjsLesson } from '../nextjs-curriculum';

export const nextjsServerComponentsLesson: NextjsLesson = {
  id: 'nextjs-server-components',
  title: 'Server Components',
  slug: 'server-components',
  chapter: 'data',
  order: 5,
  difficulty: 'intermediate',
  readingTime: 11,
  description: 'React Server Components render on the server - they can fetch data directly, have no JavaScript bundle, and improve performance.',
  sections: [
    {
      type: 'text',
      content: 'React Server Components (RSC) are the default in Next.js App Router. They render on the server and send only HTML to the browser - no React component JavaScript is included in the client bundle. This means faster page loads, better SEO, and the ability to access server-only resources like databases and file systems directly.',
    },
    {
      type: 'analogy',
      title: 'Restaurant kitchen vs tableside cooking',
      content: 'Server Components are like food prepared in the kitchen - all the work happens out of sight, and you just get the finished result on your plate. Client Components are like tableside cooking - the process happens right in front of you and you can interact with it. Most cooking should happen in the kitchen for efficiency.',
    },
    {
      type: 'heading',
      content: 'Basic Server Component',
    },
    {
      type: 'example',
      title: 'Default server component - no special syntax needed',
      content: 'All components in the App Router are Server Components by default. No special directive is needed. Server Components can NOT use useState, useEffect, event handlers, or browser APIs. They run on the server every time the route is requested.',
      language: 'typescript',
      code: `// app/products/page.tsx
// This is a Server Component by default - no "use client" needed

// You can import server-only modules here
import { db } from '@/lib/database'; // Direct DB access - works!
import { readFile } from 'fs/promises'; // Node.js built-ins - works!

export default async function ProductsPage() {
  // Direct database query - no fetch needed, no API route needed
  const products = await db.query('SELECT * FROM products LIMIT 10');

  // Read from filesystem directly
  const config = await readFile('./config.json', 'utf-8');

  return (
    <main>
      <h1>Products ({products.length})</h1>
      <ul>
        {products.map(product => (
          <li key={product.id}>{product.name} - \${product.price}</li>
        ))}
      </ul>
    </main>
  );
}`,
    },
    {
      type: 'heading',
      content: 'Async Server Components',
    },
    {
      type: 'example',
      title: 'Async server component with fetch',
      content: 'Server Components can be async - you can await data fetching directly in the component body. Next.js extends the native fetch API with automatic deduplication (the same fetch URL called multiple times returns one request) and built-in caching.',
      language: 'typescript',
      code: `// app/blog/page.tsx
// Async Server Component - fetch runs on the server

interface Post {
  id: number;
  title: string;
  body: string;
}

export default async function BlogPage() {
  // Fetch runs on the SERVER - not in the browser
  // The browser never sees this fetch call
  const posts: Post[] = await fetch(
    'https://jsonplaceholder.typicode.com/posts?_limit=5',
    { next: { revalidate: 3600 } } // Cache for 1 hour
  ).then(r => r.json());

  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map(post => (
        <article key={post.id} style={{ marginBottom: '1rem' }}>
          <h2>{post.title}</h2>
          <p>{post.body.substring(0, 100)}...</p>
        </article>
      ))}
    </div>
  );
}`,
    },
    {
      type: 'heading',
      content: 'Server Component Benefits',
    },
    {
      type: 'example',
      title: 'Zero JavaScript sent to client - comparing approaches',
      content: 'The biggest benefit of Server Components is that their code never reaches the browser. Libraries imported in Server Components are not included in the JavaScript bundle sent to users. This can dramatically reduce bundle sizes.',
      language: 'typescript',
      code: `// app/report/page.tsx - Server Component
// These heavy imports NEVER go to the browser bundle:
import { marked } from 'marked';        // 50KB markdown parser
import { highlight } from 'highlight.js'; // 100KB syntax highlighter
import { format } from 'date-fns';       // 30KB date library

export default async function ReportPage() {
  const markdown = await fetch('/api/report').then(r => r.text());

  // All processing happens on the server
  const html = marked(markdown);    // parsed on server
  const date = format(new Date(), 'MMMM do, yyyy'); // formatted on server

  // Only HTML string reaches the browser - no JS libraries
  return (
    <article>
      <p>Generated: {date}</p>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}

// If this were a Client Component ("use client"):
// - marked (50KB) would be in the browser bundle
// - highlight.js (100KB) would be in the browser bundle
// - date-fns (30KB) would be in the browser bundle
// Total extra: 180KB of JavaScript the user must download`,
    },
    {
      type: 'heading',
      content: 'When NOT to Use Server Components',
    },
    {
      type: 'example',
      title: 'Limitations - what Server Components cannot do',
      content: 'Server Components cannot use React hooks, event listeners, browser APIs, or anything that requires interactivity. These capabilities require Client Components. The rule of thumb: if it needs to happen in the browser, it needs "use client".',
      language: 'typescript',
      code: `// These will FAIL in a Server Component:

// [X] Cannot use useState
const [count, setCount] = useState(0); // Error!

// [X] Cannot use useEffect
useEffect(() => { ... }, []); // Error!

// [X] Cannot use event handlers
<button onClick={() => alert('hi')}>Click</button> // Error!

// [X] Cannot use browser APIs
const width = window.innerWidth; // Error!
localStorage.setItem('key', 'value'); // Error!

// [X] Cannot use Context (as a provider)
// You CAN consume context that was provided by a Client Component parent

// [OK] These WORK in Server Components:
const data = await fetch('...');  // async/await
const file = await readFile('...'); // file system
const result = await db.query('...'); // database
const env = process.env.SECRET_KEY; // environment variables`,
    },
    {
      type: 'example',
      title: 'Composing Server and Client Components',
      content: 'The recommended pattern is to keep as much as possible in Server Components and push interactivity to leaf Client Components. Pass server-fetched data as props to Client Components. Never import a Client Component from a Server Component that wraps it - instead pass Client Components as children props.',
      language: 'typescript',
      code: `// app/dashboard/page.tsx - Server Component
// Fetches data on server, passes to client components

import { LikeButton } from '@/components/LikeButton'; // Client Component

export default async function DashboardPage() {
  // Data fetched on server
  const stats = await fetch('/api/stats').then(r => r.json());

  return (
    <div>
      {/* Static content - rendered on server */}
      <h1>Dashboard</h1>
      <p>Total users: {stats.users}</p>

      {/* Interactive client component receives server data as props */}
      <LikeButton initialCount={stats.likes} postId="dashboard" />
    </div>
  );
}

// components/LikeButton.tsx - Client Component
'use client';
import { useState } from 'react';

export function LikeButton({ initialCount, postId }: { initialCount: number; postId: string }) {
  const [count, setCount] = useState(initialCount);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Likes: {count}
    </button>
  );
}`,
    },
    {
      type: 'tryit',
      title: 'Server vs Client Components',
      css: `body{font-family:system-ui,sans-serif;padding:14px;background:#f0f2f5;margin:0;}
.split{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.panel{border-radius:10px;padding:14px;border:2px solid transparent;}
.server-panel{background:#0d1117;color:#e6edf3;border-color:#21262d;}
.client-panel{background:#fffbeb;color:#333;border-color:#fde68a;}
.panel-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.1);}
.server-panel .panel-label{color:#3fb950;border-color:#21262d;}
.client-panel .panel-label{color:#d97706;border-color:#fde68a;}
.cap-row{font-size:12px;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.05);display:flex;align-items:center;gap:6px;}
.client-panel .cap-row{border-color:rgba(0,0,0,0.07);}
.ok{color:#3fb950;font-size:14px;} .no{color:#f85149;font-size:14px;}
.counter-box{background:#fff;border:1px solid #fcd34d;border-radius:8px;padding:10px;margin-top:10px;text-align:center;}
.count-num{font-size:28px;font-weight:900;color:#000;}
.count-btn{margin-top:6px;background:#000;color:#fff;border:none;border-radius:6px;padding:7px 16px;font-size:13px;cursor:pointer;width:100%;}
.count-btn:hover{background:#333;}
.note{margin-top:8px;font-size:10px;color:#666;line-height:1.5;}`,
      js: `var counter = 0;

function increment() {
  counter++;
  document.getElementById('count-display').textContent = counter;
  console.log('Client Component state update - count:', counter);
}

document.getElementById('output').innerHTML =
  '<div class="split">' +

  '<div class="panel server-panel">' +
  '<div class="panel-label">Server Component (default)</div>' +
  '<div class="cap-row"><span class="ok">[OK]</span> async/await data fetching</div>' +
  '<div class="cap-row"><span class="ok">[OK]</span> Direct database access</div>' +
  '<div class="cap-row"><span class="ok">[OK]</span> File system (fs module)</div>' +
  '<div class="cap-row"><span class="ok">[OK]</span> Secret env variables</div>' +
  '<div class="cap-row"><span class="ok">[OK]</span> Zero JS in bundle</div>' +
  '<div class="cap-row"><span class="no">[X]</span> No useState / useEffect</div>' +
  '<div class="cap-row"><span class="no">[X]</span> No event handlers</div>' +
  '<div class="cap-row"><span class="no">[X]</span> No window / localStorage</div>' +
  '<div class="note">Runs on the SERVER - only HTML is sent to the browser</div>' +
  '</div>' +

  '<div class="panel client-panel">' +
  '<div class="panel-label">"use client" Component</div>' +
  '<div class="cap-row"><span class="ok">[OK]</span> useState / useReducer</div>' +
  '<div class="cap-row"><span class="ok">[OK]</span> Event handlers (onClick)</div>' +
  '<div class="cap-row"><span class="ok">[OK]</span> window / localStorage</div>' +
  '<div class="cap-row"><span class="ok">[OK]</span> Third-party UI libraries</div>' +
  '<div class="cap-row"><span class="no">[X]</span> No direct DB access</div>' +
  '<div class="cap-row"><span class="no">[X]</span> No secret env variables</div>' +
  '<div class="counter-box">' +
  '<div style="font-size:11px;color:#666;margin-bottom:4px;">Interactive counter (useState simulation)</div>' +
  '<div class="count-num" id="count-display">0</div>' +
  '<button class="count-btn" id="increment-btn">+ Click me!</button>' +
  '</div>' +
  '<div class="note">Runs in the BROWSER - JS is bundled and sent to the client</div>' +
  '</div>' +

  '</div>';

document.getElementById('increment-btn').addEventListener('click', increment);`,
    },
  ],
  exercises: [
    {
      id: 'nextjs-sc-1',
      question: 'What is the default component type in Next.js App Router?',
      type: 'multiple-choice',
      options: [
        'Client Component - you must opt in to Server Components',
        'Server Component - you must add "use client" for client-side features',
        'Both are equal - Next.js decides based on the code inside',
        'Hybrid Component that works in both environments',
      ],
      correct: 1,
      explanation: 'All components in the App Router are Server Components by default. To use useState, useEffect, event handlers, or browser APIs, you must add "use client" at the top of the file to opt into being a Client Component.',
    },
    {
      id: 'nextjs-sc-2',
      question: 'Which of these can a Server Component do that a Client Component cannot?',
      type: 'multiple-choice',
      options: [
        'Render JSX and return HTML',
        'Use onClick event handlers',
        'Access databases and file systems directly without an API',
        'Use useState to track user interactions',
      ],
      correct: 2,
      explanation: 'Server Components run on the server so they can directly access databases, file systems, and environment secrets without going through an API route. Client Components run in the browser and cannot access these server-only resources.',
    },
  ],
  quiz: [
    {
      id: 'nextjs-sc-q1',
      question: 'Why do Server Components reduce JavaScript bundle sizes?',
      options: [
        'They automatically minify and compress JavaScript',
        'Their code and imported libraries never get sent to the browser',
        'They use WebAssembly instead of JavaScript',
        'They share code between pages automatically',
      ],
      correct: 1,
      explanation: 'Server Components render on the server and only send HTML to the browser. Any libraries imported in a Server Component (like a markdown parser or date formatter) are never included in the client JavaScript bundle. This can dramatically reduce the amount of JavaScript users have to download.',
    },
  ],
};
