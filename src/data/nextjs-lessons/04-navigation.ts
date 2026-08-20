import type { NextjsLesson } from '../nextjs-curriculum';

export const nextjsNavigationLesson: NextjsLesson = {
  id: 'nextjs-navigation',
  title: 'Navigation',
  slug: 'navigation',
  chapter: 'routing',
  order: 4,
  difficulty: 'beginner',
  readingTime: 9,
  description: 'Navigate between pages with the Link component, useRouter hook, usePathname, and programmatic navigation.',
  sections: [
    {
      type: 'text',
      content: 'Next.js provides several ways to navigate between routes. The Link component handles declarative navigation in JSX. The useRouter hook enables programmatic navigation from event handlers. The usePathname hook gives you the current URL for highlighting active links. All client-side navigation happens without a full page reload.',
    },
    {
      type: 'heading',
      content: 'The Link Component',
    },
    {
      type: 'example',
      title: 'Link component - declarative navigation',
      content: 'The Link component from next/link replaces the standard HTML anchor tag. It prefetches the destination page in the background when the link enters the viewport, making navigation feel instant. Use it for any navigation inside your Next.js app.',
      language: 'typescript',
      code: `// Import from 'next/link'
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav>
      {/* Basic link */}
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/blog">Blog</Link>

      {/* Dynamic route */}
      <Link href="/blog/my-post">My Post</Link>

      {/* With query params */}
      <Link href="/search?q=nextjs">Search Next.js</Link>

      {/* Object form - more explicit */}
      <Link href={{ pathname: '/blog', query: { tag: 'react' } }}>
        React Posts
      </Link>

      {/* Open in new tab */}
      <Link href="https://nextjs.org" target="_blank" rel="noopener">
        Next.js Docs
      </Link>

      {/* Replace history instead of push */}
      <Link href="/login" replace>
        Login (replaces current history entry)
      </Link>
    </nav>
  );
}`,
    },
    {
      type: 'heading',
      content: 'useRouter - Programmatic Navigation',
    },
    {
      type: 'example',
      title: 'useRouter hook for navigating in event handlers',
      content: 'useRouter is used when you need to navigate based on logic - after a form submission, after authentication, or in response to any event. It must be used in a Client Component (add "use client" at the top of the file).',
      language: 'typescript',
      code: `'use client'; // Required - useRouter is a client hook

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Simulate authentication
    const success = await login();

    if (success) {
      // Navigate after successful login
      router.push('/dashboard');

      // Other navigation methods:
      // router.replace('/dashboard') // no back button history
      // router.back()                // go back one page
      // router.forward()             // go forward one page
      // router.refresh()             // re-fetch server data
      // router.prefetch('/dashboard') // manually prefetch
    } else {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Log In'}
      </button>
    </form>
  );
}`,
    },
    {
      type: 'example',
      title: 'usePathname - detecting active routes',
      content: 'usePathname returns the current URL pathname. Use it to highlight the active navigation item in your sidebar or navbar. It updates automatically when the route changes and is available only in Client Components.',
      language: 'typescript',
      code: `'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export function Sidebar() {
  const pathname = usePathname();
  // pathname is '/blog' when on the blog page
  // pathname is '/blog/my-post' on a post page

  return (
    <nav>
      {navItems.map(item => {
        // Check if this link is active
        const isActive = pathname === item.href ||
          (item.href !== '/' && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              fontWeight: isActive ? 'bold' : 'normal',
              color: isActive ? '#000' : '#666',
              display: 'block',
              padding: '8px 12px',
            }}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}`,
    },
    {
      type: 'example',
      title: 'Prefetching and performance',
      content: 'Next.js prefetches linked pages automatically. When a Link enters the viewport, Next.js fetches the destination page in the background. By the time the user clicks, the page is already loaded. You can control this behavior with the prefetch prop.',
      language: 'typescript',
      code: `import Link from 'next/link';

// Default: prefetches when link enters viewport (in production)
<Link href="/heavy-page">Heavy Page</Link>

// Disable prefetching (saves bandwidth for rarely clicked links)
<Link href="/heavy-page" prefetch={false}>
  Rarely Visited Page
</Link>

// Force prefetching even for dynamic routes
<Link href="/blog/recent" prefetch={true}>
  Recent Post
</Link>

// Manual prefetch with useRouter
import { useRouter } from 'next/navigation';

function PrefetchOnHover() {
  const router = useRouter();
  return (
    <button
      onMouseEnter={() => router.prefetch('/dashboard')}
      onClick={() => router.push('/dashboard')}>
      Go to Dashboard
    </button>
  );
}`,
    },
    {
      type: 'tryit',
      title: 'Navigation Simulation',
      css: `body{font-family:system-ui,sans-serif;margin:0;padding:0;background:#f0f2f5;}
.app{max-width:600px;}
.navbar{background:#000;padding:0 16px;height:48px;display:flex;align-items:center;gap:6px;}
.brand{color:#fff;font-weight:900;font-size:15px;margin-right:auto;}
.nav-link{color:#fff;opacity:0.65;font-size:13px;cursor:pointer;padding:5px 10px;border-radius:5px;border:none;background:transparent;}
.nav-link:hover,.nav-link.active{opacity:1;background:rgba(255,255,255,0.15);}
.history-strip{background:#f8fafc;border-bottom:1px solid #e5e7eb;padding:6px 16px;font-size:11px;color:#666;display:flex;align-items:center;gap:4px;flex-wrap:wrap;}
.hist-entry{padding:2px 6px;border-radius:4px;}
.hist-entry.current-entry{background:#000;color:#fff;border-radius:4px;}
.page{padding:16px;}
.breadcrumb{font-family:monospace;font-size:11px;color:#999;margin-bottom:10px;}
.page-card{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:16px;}
.page-card h2{margin:0 0 6px;font-size:17px;}
.page-card p{margin:0;color:#666;font-size:13px;line-height:1.5;}
.btn-row{display:flex;gap:8px;margin-top:12px;}
.nav-action-btn{background:#000;color:#fff;border:none;padding:7px 14px;border-radius:6px;font-size:12px;cursor:pointer;}
.nav-action-btn:hover{background:#333;}
.nav-action-btn:disabled{background:#ccc;cursor:default;}`,
      js: `var pageData = {
  '/': { title: 'Home', desc: 'The homepage. usePathname() returns "/" - the Home nav link gets the active style.' },
  '/about': { title: 'About', desc: 'About page. Notice the navbar highlight updates - usePathname() detects the current route.' },
  '/blog': { title: 'Blog', desc: 'Blog listing. The Link component prefetched this page when you hovered the nav link.' },
  '/dashboard': { title: 'Dashboard', desc: 'Protected route. Middleware would redirect unauthenticated users before this renders.' }
};
var hist = ['/'];
var histIdx = 0;
var current = '/';

function navigate(route, push) {
  current = route;
  if (push !== false) {
    hist = hist.slice(0, histIdx + 1);
    hist.push(route);
    histIdx = hist.length - 1;
  }
  render();
  console.log('navigate("' + route + '") | history:', hist.join(' -> '));
}

function goBack() {
  if (histIdx > 0) { histIdx--; navigate(hist[histIdx], false); }
}

function goForward() {
  if (histIdx < hist.length - 1) { histIdx++; navigate(hist[histIdx], false); }
}

function render() {
  var p = pageData[current] || pageData['/'];
  var navLinks = Object.keys(pageData).map(function(r) {
    return '<button class="nav-link' + (r === current ? ' active' : '') + '" data-route="' + r + '">' + pageData[r].title + '</button>';
  }).join('');

  var histHtml = hist.map(function(r, i) {
    return '<span class="hist-entry' + (i === histIdx ? ' current-entry' : '') + '">' + r + '</span>';
  }).join('<span>&rsaquo;</span>');

  document.getElementById('output').innerHTML =
    '<div class="app">' +
    '<div class="navbar"><span class="brand">MyApp</span>' + navLinks + '</div>' +
    '<div class="history-strip"><strong>History:</strong> ' + histHtml + '</div>' +
    '<div class="page">' +
    '<div class="breadcrumb">usePathname() = "' + current + '"</div>' +
    '<div class="page-card">' +
    '<h2>' + p.title + '</h2>' +
    '<p>' + p.desc + '</p>' +
    '<div class="btn-row">' +
    '<button class="nav-action-btn" id="back-btn"' + (histIdx === 0 ? ' disabled' : '') + '>&lt;- Back</button>' +
    '<button class="nav-action-btn" id="fwd-btn"' + (histIdx === hist.length - 1 ? ' disabled' : '') + '>Forward -&gt;</button>' +
    '</div></div></div></div>';

  document.querySelectorAll('[data-route]').forEach(function(btn) { btn.addEventListener('click', function() { navigate(btn.getAttribute('data-route')); }); });
  var backBtn = document.getElementById('back-btn');
  var fwdBtn = document.getElementById('fwd-btn');
  if (backBtn) backBtn.addEventListener('click', goBack);
  if (fwdBtn) fwdBtn.addEventListener('click', goForward);
}

render();`,
    },
  ],
  exercises: [
    {
      id: 'nextjs-nav-1',
      question: 'Which Next.js import should you use for client-side navigation links?',
      type: 'multiple-choice',
      options: [
        'import { a } from "react"',
        'import Link from "next/link"',
        'import { NavLink } from "next/navigation"',
        'import { Router } from "next/router"',
      ],
      correct: 1,
      explanation: 'The Link component from "next/link" is the correct way to create navigation links in Next.js. It extends the HTML anchor tag with prefetching, client-side navigation, and accessibility features.',
    },
    {
      id: 'nextjs-nav-2',
      question: 'In which type of component can you use useRouter and usePathname hooks?',
      type: 'multiple-choice',
      options: [
        'Only in Server Components',
        'Only in Client Components (files with "use client" directive)',
        'In any component, client or server',
        'Only in layout.tsx files',
      ],
      correct: 1,
      explanation: 'useRouter and usePathname are client-side hooks - they require browser APIs and React state. They can only be used in Client Components, which are files that start with the "use client" directive.',
    },
  ],
  quiz: [
    {
      id: 'nextjs-nav-q1',
      question: 'What does the Next.js Link component do automatically when a link enters the viewport?',
      options: [
        'It logs a page view to analytics',
        'It prefetches the destination page in the background',
        'It validates the route exists',
        'It preloads all images on the destination page',
      ],
      correct: 1,
      explanation: 'In production, the Link component automatically prefetches the destination page when the link enters the viewport. This means the page data is already downloaded by the time the user clicks, making navigation feel instant.',
    },
  ],
};
