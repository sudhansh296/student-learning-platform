import type { NextjsLesson } from '../nextjs-curriculum';

export const nextjsLayoutsLesson: NextjsLesson = {
  id: 'nextjs-layouts',
  title: 'Layouts and Templates',
  slug: 'layouts',
  chapter: 'routing',
  order: 3,
  difficulty: 'beginner',
  readingTime: 9,
  description: 'Share UI across pages with layouts - root layout (required), nested layouts, and layout conventions.',
  sections: [
    {
      type: 'text',
      content: 'Layouts are UI that is shared across multiple pages. In the App Router, a layout.tsx file wraps all page.tsx files in the same folder and any subfolders. Layouts preserve state across navigations - when you navigate between pages that share a layout, the layout does not re-render.',
    },
    {
      type: 'heading',
      content: 'Root Layout',
    },
    {
      type: 'example',
      title: 'Root layout - required for every Next.js app',
      content: 'The root layout at app/layout.tsx is required and wraps every page in the application. It must include the html and body tags. This is where you add global fonts, metadata, navigation, and providers that wrap the entire app.',
      language: 'typescript',
      code: `// app/layout.tsx - required, wraps every page
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'My App', template: '%s | My App' },
  description: 'My Next.js application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}`,
    },
    {
      type: 'heading',
      content: 'Nested Layouts',
    },
    {
      type: 'example',
      title: 'Nested layout for a section of the app',
      content: 'You can add a layout.tsx inside any subfolder to wrap just that section of the app. Nested layouts compose automatically - the inner layout is rendered inside the outer layout. This lets you have different sidebars, headers, or navigation for different sections.',
      language: 'typescript',
      code: `// app/dashboard/layout.tsx
// Only wraps pages inside the /dashboard route segment
// Rendered INSIDE the root layout

import { DashboardSidebar } from '@/components/DashboardSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <DashboardSidebar />
      <section style={{ flex: 1 }}>
        {children}
      </section>
    </div>
  );
}

// Layout nesting for /dashboard/settings:
// RootLayout > DashboardLayout > SettingsPage

// app/dashboard/page.tsx       - uses DashboardLayout
// app/dashboard/settings/page.tsx - also uses DashboardLayout
// app/about/page.tsx           - only uses RootLayout`,
    },
    {
      type: 'example',
      title: 'Metadata export in layouts',
      content: 'Layouts can export a metadata object to set default metadata for all pages in that segment. Page-level metadata overrides layout metadata. The title template in the root layout is applied to all page titles automatically.',
      language: 'typescript',
      code: `// app/blog/layout.tsx
// Sets default metadata for all /blog/* pages

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Blog',
    template: '%s | Blog',
    // /blog         -> "Blog | My App"
    // /blog/my-post -> "My Post | Blog"
  },
  openGraph: {
    type: 'website',
    siteName: 'My Blog',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="blog-container">
      <aside>Blog Sidebar</aside>
      <main>{children}</main>
    </div>
  );
}`,
    },
    {
      type: 'example',
      title: 'Template vs Layout - key difference',
      content: 'Templates are similar to layouts but they create a new instance on every navigation. Layouts preserve state (a form you are filling out will survive navigation). Templates reset state. Use template.tsx when you need fresh state or effects to re-run on every page visit.',
      language: 'typescript',
      code: `// layout.tsx - shared instance, state is preserved
// Navigating between /dashboard and /dashboard/settings
// does NOT re-render the layout - state survives

export default function Layout({ children }: { children: React.ReactNode }) {
  // This component does NOT remount on navigation
  return <div>{children}</div>;
}

// template.tsx - new instance per navigation
// Each navigation creates a fresh component instance
// Good for: analytics page views, enter/exit animations

export default function Template({ children }: { children: React.ReactNode }) {
  // This component DOES remount on every navigation
  // Good for page transition animations
  return (
    <div className="page-wrapper animate-fadeIn">
      {children}
    </div>
  );
}`,
    },
    {
      type: 'tryit',
      title: 'Layouts Stay Mounted',
      css: `body{font-family:system-ui,sans-serif;margin:0;padding:0;background:#f0f2f5;}
.wrapper{padding:12px;}
.nav-btns{display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;}
.page-btn{background:#f3f4f6;border:1px solid #e5e7eb;border-radius:6px;padding:6px 14px;font-size:12px;cursor:pointer;font-family:monospace;}
.page-btn.active{background:#000;color:#fff;border-color:#000;}
.root-box{border:2px dashed #94a3b8;border-radius:10px;padding:10px;background:#fff;}
.root-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;margin-bottom:8px;}
.root-navbar{background:#000;color:#fff;padding:8px 14px;border-radius:6px;font-size:13px;font-weight:700;margin-bottom:8px;}
.dash-box{border:2px dashed #3b82f6;border-radius:8px;padding:10px;margin-bottom:8px;}
.dash-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#3b82f6;margin-bottom:6px;}
.dash-inner{display:flex;gap:8px;}
.sidebar{background:#eff6ff;border-radius:6px;padding:10px;min-width:120px;}
.sidebar a{display:block;padding:4px 6px;font-size:12px;color:#2563eb;cursor:pointer;border-radius:4px;text-decoration:none;margin-bottom:2px;}
.sidebar a:hover{background:#dbeafe;}
.sidebar a.active{background:#2563eb;color:#fff;}
.dash-content{flex:1;}
.page-card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:12px;font-size:13px;}
.page-title{font-weight:700;font-size:15px;margin-bottom:4px;}
.page-subtitle{color:#64748b;font-size:12px;}
.root-footer{background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:7px 12px;font-size:11px;color:#666;text-align:center;margin-top:8px;}
.mount-counter{font-size:11px;color:#16a34a;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:4px;padding:3px 8px;display:inline-block;margin-top:4px;}`,
      js: `var pages = {
  '/': { title: 'Home', layout: 'root', desc: 'Only Root Layout wraps this page' },
  '/about': { title: 'About', layout: 'root', desc: 'Only Root Layout wraps this page' },
  '/dashboard': { title: 'Dashboard', layout: 'dashboard', desc: 'Root Layout + Dashboard Layout both wrap this page' },
  '/dashboard/settings': { title: 'Settings', layout: 'dashboard', desc: 'Root Layout + Dashboard Layout - layout stays mounted!' },
  '/dashboard/analytics': { title: 'Analytics', layout: 'dashboard', desc: 'Root Layout + Dashboard Layout - layout stays mounted!' }
};

var rootMounts = 0;
var dashMounts = 0;
var current = '/';

function navigate(route) {
  var prev = current;
  current = route;
  var prevLayout = pages[prev].layout;
  var nextLayout = pages[route].layout;
  if (prevLayout !== nextLayout) {
    dashMounts++;
  }
  render();
}

function render() {
  var p = pages[current];
  var isDash = p.layout === 'dashboard';

  var pageBtns = Object.keys(pages).map(function(r) {
    return '<button class="page-btn' + (r === current ? ' active' : '') + '" data-route="' + r + '">' + r + '</button>';
  }).join('');

  var dashLinks = ['/dashboard','/dashboard/settings','/dashboard/analytics'].map(function(r) {
    return '<a class="' + (r === current ? 'active' : '') + '" data-route="' + r + '">' + pages[r].title + '</a>';
  }).join('');

  var pageCard = '<div class="page-card"><div class="page-title">' + p.title + '</div><div class="page-subtitle">' + p.desc + '</div></div>';

  var inner;
  if (isDash) {
    inner = '<div class="dash-box">' +
      '<div class="dash-label">Dashboard Layout (app/dashboard/layout.tsx) <span class="mount-counter">mounts: ' + dashMounts + '</span></div>' +
      '<div class="dash-inner">' +
      '<div class="sidebar"><strong style="font-size:11px;display:block;margin-bottom:6px;">Sidebar</strong>' + dashLinks + '</div>' +
      '<div class="dash-content">' + pageCard + '</div></div></div>';
  } else {
    inner = pageCard;
  }

  document.getElementById('output').innerHTML =
    '<div class="wrapper">' +
    '<div class="nav-btns">' + pageBtns + '</div>' +
    '<div class="root-box">' +
    '<div class="root-label">Root Layout (app/layout.tsx) <span class="mount-counter">mounts: 1</span></div>' +
    '<div class="root-navbar">MyApp Navbar</div>' +
    inner +
    '<div class="root-footer">Footer - shared across all pages</div>' +
    '</div></div>';

  document.querySelectorAll('[data-route]').forEach(function(btn) { btn.addEventListener('click', function() { navigate(btn.getAttribute('data-route')); }); });
}

render();`,
    },
  ],
  exercises: [
    {
      id: 'nextjs-layouts-1',
      question: 'Which file is required in every Next.js App Router project?',
      type: 'multiple-choice',
      options: [
        'app/page.tsx',
        'app/layout.tsx',
        'app/root.tsx',
        'app/template.tsx',
      ],
      correct: 1,
      explanation: 'app/layout.tsx is the required root layout. It must include the html and body tags and wraps every page in the application. Without it, Next.js throws an error.',
    },
    {
      id: 'nextjs-layouts-2',
      question: 'What is the key difference between layout.tsx and template.tsx?',
      type: 'multiple-choice',
      options: [
        'Layouts support metadata export but templates do not',
        'Layouts preserve state across navigations, templates create a new instance each time',
        'Templates are faster because they dont use React state',
        'Layouts only work with the Pages Router',
      ],
      correct: 1,
      explanation: 'Layouts are shared across navigations - they do not remount, so state is preserved. Templates create a new component instance on every navigation, resetting all state and re-running all effects. Use templates when you need fresh state per page visit.',
    },
  ],
  quiz: [
    {
      id: 'nextjs-layouts-q1',
      question: 'If you navigate from /dashboard to /dashboard/settings and both use app/dashboard/layout.tsx, what happens to the layout component?',
      options: [
        'The layout fully unmounts and remounts',
        'The layout does not remount - it persists and only the inner content changes',
        'The layout re-renders but preserves no state',
        'Both layouts are rendered simultaneously',
      ],
      correct: 1,
      explanation: 'Layouts persist across navigations within the same layout segment. When you navigate from /dashboard to /dashboard/settings, the DashboardLayout stays mounted - only the page.tsx content changes. This preserves any layout state like scroll position or open menus.',
    },
  ],
};
