import type { NextjsLesson } from '../nextjs-curriculum';

export const nextjsErrorHandlingLesson: NextjsLesson = {
  id: 'nextjs-error-handling',
  title: 'Error Handling in Next.js',
  slug: 'error-handling',
  chapter: 'advanced',
  order: 18,
  difficulty: 'intermediate',
  readingTime: 11,
  description: 'Handle errors gracefully in Next.js App Router using error.tsx, not-found.tsx, global-error.tsx, and boundary patterns.',
  sections: [
    {
      type: 'text',
      content: 'In production, errors are inevitable. A database query might fail, an API might be unreachable, or a user might navigate to a URL that does not exist. Next.js App Router has a built-in file-based error handling system that lets you define what users see in each of these situations - without a single try/catch in your page components.',
    },
    {
      type: 'heading',
      content: 'The Error Boundary Hierarchy',
    },
    {
      type: 'text',
      content: 'Next.js walks up the route segment tree to find the nearest error boundary. You can place error.tsx files at different levels of your app/ directory - each one catches errors from its segment and all child segments below it.',
    },
    {
      type: 'table',
      title: 'Error handling files and what they catch',
      headers: ['File', 'What it catches', 'Reset available', 'Must be Client Component'],
      rows: [
        ['error.tsx', 'Errors in the same route segment and its children', 'Yes - reset() re-renders the segment', 'Yes'],
        ['not-found.tsx', 'Calls to notFound() and unmatched routes', 'No - shows static UI', 'No (can be Server Component)'],
        ['global-error.tsx', 'Errors in the root layout (RootLayout)', 'Yes - reset() reloads the page', 'Yes - must include html and body'],
        ['loading.tsx', 'Not an error handler - wraps in Suspense boundary', 'N/A', 'No'],
      ],
    },
    {
      type: 'heading',
      content: 'error.tsx - Route Segment Error Boundary',
    },
    {
      type: 'text',
      content: 'error.tsx is a React error boundary for its route segment. When an unhandled error is thrown during rendering, data fetching, or a Server Action in that segment, Next.js renders this component instead of the page. The error prop contains the Error object and the reset prop is a function that re-renders the segment - useful for transient errors like a failed network request.',
    },
    {
      type: 'example',
      title: 'error.tsx - basic error boundary with reset',
      content: 'error.tsx must be a Client Component because React error boundaries require class component lifecycle methods which are handled internally by React when the "use client" directive is present. The reset() function asks React to re-render the children of the error boundary without a full page navigation.',
      code: `'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// Place this file at: app/dashboard/error.tsx
// It catches errors from: app/dashboard/page.tsx and all nested routes

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to an external monitoring service
    console.error('Dashboard error:', error.message);
    // Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Something went wrong
      </h2>
      <p className="text-gray-500 mb-6 text-center max-w-md">
        {error.message || 'An unexpected error occurred loading the dashboard.'}
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800"
      >
        Try again
      </button>
    </div>
  );
}`,
      language: 'typescript',
    },
    {
      type: 'note',
      title: 'error.digest',
      content: 'Server Component errors are not forwarded to the client to avoid exposing sensitive implementation details. Instead, Next.js generates a digest hash (error.digest) that is logged server-side and appears in the client error object so you can correlate client reports with server logs.',
    },
    {
      type: 'heading',
      content: 'not-found.tsx - Custom 404 Pages',
    },
    {
      type: 'text',
      content: 'not-found.tsx is rendered when the notFound() function is called or when no route matches a URL. You can place it at the app/ root for a site-wide 404, or inside a specific segment to show a context-aware message (e.g., "This product does not exist" on a product detail page).',
    },
    {
      type: 'example',
      title: 'not-found.tsx - custom 404 page',
      content: 'not-found.tsx is a Server Component by default so it can fetch data if needed. Call notFound() from next/navigation inside any Server Component or Route Handler to trigger it - for example, when a database lookup returns null for a dynamic route parameter.',
      code: `// app/not-found.tsx  (root-level - catches all unmatched URLs)
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center p-8">
      <h1 className="text-8xl font-black text-gray-200 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        Page Not Found
      </h2>
      <p className="text-gray-500 max-w-md mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800"
      >
        Back to Home
      </Link>
    </main>
  );
}

// app/products/[id]/page.tsx - calling notFound() in a Server Component
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/products';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  // If the product does not exist, render not-found.tsx
  if (!product) {
    notFound();
  }

  return <div>{product.name}</div>;
}`,
      language: 'typescript',
    },
    {
      type: 'heading',
      content: 'global-error.tsx - Root Layout Error Boundary',
    },
    {
      type: 'text',
      content: 'global-error.tsx catches errors that occur in the root layout (app/layout.tsx) itself - the container that wraps your entire application. Because it replaces the root layout when it renders, it must include its own html and body tags. It is the last resort error boundary and should be kept simple.',
    },
    {
      type: 'example',
      title: 'global-error.tsx - catches root layout errors',
      content: 'global-error.tsx only activates in production builds because in development the default Next.js error overlay is used instead. Always include the html and body tags since this file completely replaces app/layout.tsx when it renders.',
      code: `'use client';

// app/global-error.tsx
// Catches errors in app/layout.tsx itself
// Only visible in production - dev uses the error overlay

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    // Must include html and body - replaces the root layout
    <html>
      <body>
        <main
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            fontFamily: 'system-ui, sans-serif',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
            A critical error occurred
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            {error.digest ? 'Error ID: ' + error.digest : 'Please try refreshing the page.'}
          </p>
          <button
            onClick={reset}
            style={{
              background: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}`,
      language: 'typescript',
    },
    {
      type: 'heading',
      content: 'notFound() and redirect() in Server Components',
    },
    {
      type: 'example',
      title: 'Using notFound() and redirect() inside data-fetching functions',
      content: 'notFound() and redirect() from next/navigation throw special errors that Next.js intercepts internally - they are not regular JavaScript errors. You do not need a try/catch around them. Call them after determining the appropriate action based on fetched data.',
      code: `// lib/data.ts - server-side data fetching helpers
import { notFound, redirect } from 'next/navigation';

// Throws a Not Found signal if the user is not found
export async function getUserOrNotFound(id: string) {
  const user = await db.users.findById(id);
  if (!user) {
    notFound(); // renders the nearest not-found.tsx
  }
  return user;
}

// Redirects to login if the resource requires authentication
export async function getProtectedResource(id: string, session: Session | null) {
  if (!session) {
    redirect('/login'); // 307 redirect, no return needed
  }
  const resource = await db.resources.findById(id);
  if (!resource) {
    notFound();
  }
  return resource;
}

// app/users/[id]/page.tsx
import { getUserOrNotFound } from '@/lib/data';

export default async function UserPage({ params }: { params: { id: string } }) {
  // If not found, Next.js renders not-found.tsx automatically
  const user = await getUserOrNotFound(params.id);

  return <h1>{user.name}</h1>;
}`,
      language: 'typescript',
    },
    {
      type: 'heading',
      content: 'Logging Errors to External Services',
    },
    {
      type: 'text',
      content: 'In production, console.error() is not enough - errors need to be captured in a monitoring service like Sentry, Datadog, or LogRocket. The useEffect in error.tsx is the right place to call captureException(), and you can use the digest as a correlation ID between client and server.',
    },
    {
      type: 'example',
      title: 'Sentry error capture in error.tsx',
      content: 'Sentry.captureException() sends the full error stack trace to your Sentry project with context about the user, URL, and custom tags. The error.digest correlates this client-side report with the server-side log entry that contains the actual error message.',
      code: `'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Send error to Sentry with the digest as a fingerprint
    Sentry.captureException(error, {
      tags: { digest: error.digest },
    });
  }, [error]);

  return (
    <div>
      <p>Something went wrong. Error ID: {error.digest}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}`,
      language: 'typescript',
    },
    {
      type: 'tip',
      title: 'Test error boundaries in development',
      content: 'Throw a test error inside a Server Component to confirm your error.tsx renders correctly: throw new Error("test error"). Do the same with notFound() to confirm your not-found.tsx appears. In development you also see the Next.js error overlay - this is normal and only appears in dev mode.',
    },
    {
      type: 'tryit',
      title: 'Error Handling Flow Simulator',
      js: `var output = document.getElementById('output');

var triggered = null;

var flows = {
  component: {
    label: 'Component Error',
    boundary: 'error.tsx',
    file: 'app/dashboard/error.tsx',
    color: '#dc2626',
    path: ['RootLayout', 'Layout (Dashboard)', 'error.tsx catches here'],
    msg: 'Unhandled error in a Server Component or Client Component render. Next.js renders the nearest error.tsx and passes the Error object. The reset() function re-renders the segment.',
    userSees: 'Your custom error UI with a "Try again" button',
  },
  notfound: {
    label: 'Not Found (404)',
    boundary: 'not-found.tsx',
    file: 'app/products/not-found.tsx',
    color: '#d97706',
    path: ['RootLayout', 'Layout (Products)', 'not-found.tsx catches here'],
    msg: 'notFound() was called inside a Server Component, or the URL did not match any route. Next.js renders the nearest not-found.tsx.',
    userSees: 'Your custom 404 page',
  },
  global: {
    label: 'Root Layout Error',
    boundary: 'global-error.tsx',
    file: 'app/global-error.tsx',
    color: '#7c3aed',
    path: ['global-error.tsx catches here (replaces RootLayout)'],
    msg: 'An error occurred inside app/layout.tsx itself. Since the root layout is broken, global-error.tsx replaces it entirely - including html and body tags.',
    userSees: 'A minimal fallback page with a reload button',
  },
};

function render() {
  var f = triggered ? flows[triggered] : null;

  var buttonsHtml = Object.keys(flows).map(function(key) {
    var flow = flows[key];
    var active = triggered === key;
    return '<button onclick="trigger(\'' + key + '\')" style="' +
      'background:' + (active ? flow.color : '#f1f5f9') + ';' +
      'color:' + (active ? '#fff' : '#374151') + ';' +
      'border:2px solid ' + (active ? flow.color : '#e2e8f0') + ';' +
      'padding:10px 18px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;' +
      '">' + flow.label + '</button>';
  }).join('');

  var hierarchyHtml = '';
  if (f) {
    f.path.forEach(function(step, i) {
      var isLast = i === f.path.length - 1;
      hierarchyHtml += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">';
      if (i > 0) {
        hierarchyHtml += '<div style="width:2px;height:20px;background:#e2e8f0;margin-left:11px;margin-top:-20px;position:absolute"></div>';
      }
      hierarchyHtml += '<div style="width:24px;height:24px;border-radius:50%;background:' +
        (isLast ? f.color : '#e2e8f0') + ';display:flex;align-items:center;justify-content:center;' +
        'color:' + (isLast ? '#fff' : '#94a3b8') + ';font-size:11px;font-weight:700;flex-shrink:0;">' +
        (i + 1) + '</div>';
      hierarchyHtml += '<span style="font-size:13px;font-weight:' + (isLast ? '700' : '400') + ';' +
        'color:' + (isLast ? f.color : '#374151') + ';">' + step + '</span>';
      hierarchyHtml += '</div>';
    });
  }

  output.innerHTML =
    '<div style="padding:16px;font-family:system-ui,sans-serif;max-width:700px;">' +
    '<h3 style="color:#0f172a;margin:0 0 4px;font-size:16px;">Error Handling Flow Simulator</h3>' +
    '<p style="color:#64748b;font-size:12px;margin:0 0 14px;">Click a button to see which file handles each error type.</p>' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">' + buttonsHtml + '</div>' +
    (f
      ? '<div style="background:#fff;border-radius:12px;padding:16px;border:2px solid ' + f.color + ';">' +
        '<div style="margin-bottom:12px;">' + hierarchyHtml + '</div>' +
        '<div style="background:#f8fafc;border-radius:8px;padding:12px;margin-bottom:10px;">' +
        '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#94a3b8;margin-bottom:4px;">File that handles this</div>' +
        '<code style="color:' + f.color + ';font-size:13px;font-weight:700;">' + f.file + '</code>' +
        '</div>' +
        '<div style="background:#f8fafc;border-radius:8px;padding:12px;margin-bottom:10px;">' +
        '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#94a3b8;margin-bottom:4px;">What happened</div>' +
        '<p style="font-size:13px;color:#374151;margin:0;line-height:1.6;">' + f.msg + '</p>' +
        '</div>' +
        '<div style="background:' + f.color + '11;border-radius:8px;padding:12px;">' +
        '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:' + f.color + ';margin-bottom:4px;">What the user sees</div>' +
        '<p style="font-size:13px;color:#374151;margin:0;font-weight:600;">' + f.userSees + '</p>' +
        '</div>' +
        '</div>'
      : '<div style="background:#f8fafc;border-radius:12px;padding:30px;text-align:center;color:#94a3b8;font-size:14px;">Click a button above to simulate an error scenario.</div>'
    ) +
    '</div>';
}

window.trigger = function(key) {
  triggered = triggered === key ? null : key;
  render();
};

render();`,
      css: '',
    },
  ],
  exercises: [
    {
      id: 'nextjs-error-1',
      question: 'Why must error.tsx be a Client Component?',
      type: 'multiple-choice',
      options: [
        'Because it uses useState to track the error state',
        'Because React error boundaries require client-side lifecycle methods that are handled via the "use client" directive',
        'Because Server Components cannot render error messages',
        'Because error.tsx needs to access the browser DOM directly',
      ],
      correct: 1,
      explanation: 'React error boundaries work through class component lifecycle methods (componentDidCatch, getDerivedStateFromError). The "use client" directive makes Next.js compile the component for the browser where these lifecycle hooks are supported, enabling the error boundary pattern.',
    },
    {
      id: 'nextjs-error-2',
      question: 'You call notFound() inside a Server Component. What must exist for this to work correctly?',
      type: 'multiple-choice',
      options: [
        'A try/catch block around the notFound() call',
        'A not-found.tsx file in the same or ancestor app directory segment',
        'A 404 page configured in next.config.ts',
        'A dynamic route with a catch-all segment',
      ],
      correct: 1,
      explanation: 'notFound() throws a special error that Next.js intercepts and uses to render the nearest not-found.tsx. If no not-found.tsx is found in the segment hierarchy, Next.js uses its default 404 page. You do not need try/catch - notFound() is handled by the framework routing layer.',
    },
    {
      id: 'nextjs-error-3',
      question: 'What is special about global-error.tsx compared to error.tsx?',
      type: 'multiple-choice',
      options: [
        'global-error.tsx has access to more error details than error.tsx',
        'global-error.tsx must include html and body tags because it replaces the root layout entirely',
        'global-error.tsx is triggered by 4xx HTTP errors while error.tsx handles 5xx errors',
        'global-error.tsx runs during server-side rendering only',
      ],
      correct: 1,
      explanation: 'global-error.tsx replaces app/layout.tsx entirely when the root layout throws an error. Since the root layout normally provides the html and body tags, global-error.tsx must include them itself to produce a valid HTML document.',
    },
  ],
  quiz: [
    {
      id: 'nextjs-error-q1',
      question: 'What does the reset() prop in error.tsx do?',
      options: [
        'Navigates the user back to the previous page',
        'Reloads the entire browser window',
        'Re-renders the error boundary segment, potentially resolving transient errors',
        'Clears the browser cache and re-fetches all data',
      ],
      correct: 2,
      explanation: 'reset() asks React to re-render the children of the error boundary segment without a full page navigation. This is useful for transient errors like a failed network request - pressing "Try again" retries the render and if the data loads successfully, the user sees the page normally.',
    },
    {
      id: 'nextjs-error-q2',
      question: 'Where should you place error.tsx to catch errors from a specific route segment and all its children?',
      options: [
        'At the project root alongside package.json',
        'Inside the app/ directory at the same level as the route segment it should protect',
        'Inside the pages/ directory for the matching route',
        'Inside the public/ folder',
      ],
      correct: 1,
      explanation: 'Place error.tsx inside the same folder as the layout.tsx or page.tsx you want to protect. For example, app/dashboard/error.tsx catches errors from app/dashboard/page.tsx and all nested pages under app/dashboard/. The root app/error.tsx catches errors from all routes not caught by a more specific error.tsx.',
    },
    {
      id: 'nextjs-error-q3',
      question: 'In what environment does global-error.tsx visibly activate?',
      options: [
        'Only in development mode',
        'Only in production mode',
        'In both development and production',
        'Only when deployed to Vercel',
      ],
      correct: 1,
      explanation: 'In development, Next.js shows its built-in error overlay when a root layout error occurs. global-error.tsx only renders in production builds. This is important to keep in mind when testing - deploy a preview build to verify your global-error.tsx appears correctly.',
    },
  ],
};
