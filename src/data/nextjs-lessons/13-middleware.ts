import type { NextjsLesson } from '../nextjs-curriculum';

export const nextjsMiddlewareLesson: NextjsLesson = {
  id: 'nextjs-middleware',
  title: 'Middleware',
  slug: 'middleware',
  chapter: 'advanced',
  order: 13,
  difficulty: 'advanced',
  readingTime: 10,
  description: 'Run code before requests complete - auth redirects, A/B testing, geolocation, and custom headers with middleware.ts.',
  sections: [
    {
      type: 'text',
      content: 'Middleware runs before a request is completed. It intercepts every request that matches its configuration and can redirect, rewrite URLs, add headers, or modify cookies before the page or API route runs. Middleware runs at the Edge - close to the user, making it extremely fast for tasks like authentication checks.',
    },
    {
      type: 'heading',
      content: 'Basic Middleware',
    },
    {
      type: 'example',
      title: 'Creating middleware.ts at the project root',
      content: 'Create a middleware.ts file at the root of your project (next to package.json or inside src/). Export a default middleware function. It receives a NextRequest and must return a NextResponse. Without a return, the request continues normally.',
      language: 'typescript',
      code: `// middleware.ts (at project root or src/)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // request.url - the full URL of the request
  // request.nextUrl - parsed URL object
  // request.cookies - request cookies
  // request.headers - request headers
  // request.geo - { city, country, region, latitude, longitude }

  const url = request.nextUrl.clone();
  console.log('Middleware running for:', request.nextUrl.pathname);

  // Continue to the requested route
  return NextResponse.next();
}

// Optional: specify which paths this middleware runs on
export const config = {
  matcher: [
    // Match all routes except _next/static, _next/image, favicon.ico
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};`,
    },
    {
      type: 'heading',
      content: 'Matcher Configuration',
    },
    {
      type: 'example',
      title: 'matcher config - control which routes run middleware',
      content: 'The matcher config limits which routes trigger middleware. Without it, middleware runs on every request including static files and API routes. Use matchers to improve performance by only running middleware where needed.',
      language: 'typescript',
      code: `// middleware.ts

export function middleware(request: NextRequest) {
  // Your middleware logic
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Only protected routes
    '/dashboard/:path*',    // /dashboard and all sub-paths
    '/admin/:path*',        // /admin and all sub-paths
    '/api/protected/:path*', // Protected API routes

    // Exclude specific paths from middleware
    // Using negative lookahead:
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',

    // Multiple matchers:
    // '/dashboard',
    // '/profile',
    // '/settings',
  ],

  // Alternatively, match based on headers:
  // matcher: [{
  //   source: '/(.*)',
  //   has: [{ type: 'header', key: 'x-custom-header' }],
  // }]
};`,
    },
    {
      type: 'example',
      title: 'Auth redirect pattern - protecting routes',
      content: 'The most common middleware use case is redirecting unauthenticated users. Check for a session cookie and redirect to the login page if missing. This runs at the Edge before the page even loads - much faster than checking inside the page component.',
      language: 'typescript',
      code: `// middleware.ts - authentication guard
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/dashboard', '/settings', '/profile'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this route needs protection
  const isProtected = protectedPaths.some(path =>
    pathname.startsWith(path)
  );

  if (!isProtected) {
    return NextResponse.next(); // Allow public routes
  }

  // Check for auth token in cookies
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    // Redirect to login, preserving the original destination
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname); // /login?from=/dashboard
    return NextResponse.redirect(loginUrl);
  }

  // Token exists - allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*', '/profile/:path*'],
};`,
    },
    {
      type: 'example',
      title: 'Adding custom response headers',
      content: 'Middleware can modify request and response headers. Adding security headers like Content-Security-Policy and X-Frame-Options in middleware applies them to every route without modifying each page individually.',
      language: 'typescript',
      code: `// middleware.ts - add security and custom headers
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

  // Add custom header to track requests through middleware
  response.headers.set('X-Middleware-Timestamp', Date.now().toString());

  // Read geolocation (on Vercel Edge Network)
  const country = request.geo?.country || 'US';
  response.headers.set('X-User-Country', country);

  // URL rewriting (change URL internally, user sees original URL)
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/old-path')) {
    const newUrl = new URL(pathname.replace('/old-path', '/new-path'), request.url);
    return NextResponse.rewrite(newUrl);
  }

  return response;
}`,
    },
    {
      type: 'tryit',
      title: 'Middleware Auth Flow Demo',
      css: `body{font-family:system-ui,sans-serif;padding:14px;margin:0;background:#f5f5f5;}
.flow{max-width:560px;}
h3{margin:0 0 12px;font-size:15px;}
.step{background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:12px;margin-bottom:8px;display:flex;align-items:flex-start;gap:10px;}
.step-num{background:#000;color:#fff;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:bold;flex-shrink:0;margin-top:1px;}
.step-content{flex:1;}
.step-title{font-size:13px;font-weight:bold;margin-bottom:3px;}
.step-desc{font-size:12px;color:#666;}
.step.allow{border-color:#16a34a;background:#f0fdf4;}
.step.deny{border-color:#dc2626;background:#fef2f2;}
.step.allow .step-num{background:#16a34a;}
.step.deny .step-num{background:#dc2626;}
.btn-row{display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;}
.btn{border:none;border-radius:6px;padding:7px 14px;font-size:12px;cursor:pointer;font-weight:bold;}
.btn-auth{background:#16a34a;color:#fff;} .btn-noauth{background:#dc2626;color:#fff;}
.result-badge{display:inline-block;font-size:12px;font-weight:bold;padding:4px 12px;border-radius:20px;margin-top:8px;}`,
      js: `let isLoggedIn = false;

function simulate(route) {
  const needsAuth = ['/dashboard', '/settings', '/profile'].some(p => route.startsWith(p));
  let steps = [
    { num: 1, title: 'Request received', desc: 'User navigates to ' + route, type: '' }
  ];

  if (needsAuth) {
    steps.push({ num: 2, title: 'Middleware runs', desc: 'Route matches protected paths matcher config', type: '' });
    if (isLoggedIn) {
      steps.push(
        { num: 3, title: 'Auth token found', desc: 'Cookie "auth-token" exists and is valid', type: 'allow' },
        { num: 4, title: 'Request allowed', desc: 'NextResponse.next() - page renders normally', type: 'allow' }
      );
    } else {
      steps.push(
        { num: 3, title: 'No auth token', desc: 'Cookie "auth-token" is missing', type: 'deny' },
        { num: 4, title: 'Redirected to /login', desc: 'NextResponse.redirect("/login?from=' + route + '")', type: 'deny' }
      );
    }
  } else {
    steps.push(
      { num: 2, title: 'Middleware skips', desc: 'Route does not match protected matcher', type: '' },
      { num: 3, title: 'Request allowed', desc: 'Public route - NextResponse.next()', type: 'allow' }
    );
  }

  document.getElementById('steps').innerHTML = steps.map(s =>
    '<div class="step ' + s.type + '"><div class="step-num">' + s.num + '</div>' +
    '<div class="step-content"><div class="step-title">' + s.title + '</div>' +
    '<div class="step-desc">' + s.desc + '</div></div></div>'
  ).join('');

  const allowed = !needsAuth || isLoggedIn;
  document.getElementById('result').innerHTML =
    '<span class="result-badge" style="background:' + (allowed ? '#16a34a' : '#dc2626') + ';color:#fff">' +
    (allowed ? '[OK] Page rendered: ' + route : '-> Redirected to /login') + '</span>';

  console.log(route, '|', isLoggedIn ? 'logged in' : 'not logged in', '|', allowed ? 'allowed' : 'redirected');
}

function toggleAuth() {
  isLoggedIn = !isLoggedIn;
  document.getElementById('auth-toggle').textContent = isLoggedIn ? ' Logged In - Click to logout' : ' Not Logged In - Click to login';
  document.getElementById('auth-toggle').className = 'btn ' + (isLoggedIn ? 'btn-auth' : 'btn-noauth');
  simulate('/dashboard');
}

document.getElementById('output').innerHTML =
  '<div class="flow">' +
  '<h3>Middleware Auth Flow Simulator</h3>' +
  '<div class="btn-row">' +
  '<button class="btn btn-noauth" id="auth-toggle" onclick="toggleAuth()"> Not Logged In - Click to login</button>' +
  '</div>' +
  '<div class="btn-row" style="font-size:11px;color:#666;margin-bottom:8px;gap:4px;flex-direction:column;display:block">Try routes: ' +
  '<button class="btn" style="background:#000;color:#fff;margin:2px;" onclick="simulate(\'/dashboard\')">/dashboard</button>' +
  '<button class="btn" style="background:#000;color:#fff;margin:2px;" onclick="simulate(\'/about\')">/about (public)</button>' +
  '<button class="btn" style="background:#000;color:#fff;margin:2px;" onclick="simulate(\'/settings\')">/settings</button>' +
  '</div>' +
  '<div id="steps"></div>' +
  '<div id="result"></div>' +
  '</div>';

simulate('/dashboard');`,
    },
  ],
  exercises: [
    {
      id: 'nextjs-mw-1',
      question: 'Where does middleware.ts need to be placed in a Next.js project?',
      type: 'multiple-choice',
      options: [
        'Inside app/middleware.ts',
        'Inside the pages/ directory',
        'At the project root level or inside src/ next to the app directory',
        'Inside app/api/middleware.ts',
      ],
      correct: 2,
      explanation: 'middleware.ts must be at the root of your project (same level as package.json and next.config.ts) or inside the src/ folder if you use the src directory structure. It cannot be inside the app/ directory.',
    },
    {
      id: 'nextjs-mw-2',
      question: 'What runtime does Next.js middleware run in?',
      type: 'multiple-choice',
      options: [
        'The same Node.js runtime as the rest of the app',
        'The browser JavaScript runtime',
        'The Edge runtime - a lightweight V8 environment close to users',
        'A WebAssembly runtime',
      ],
      correct: 2,
      explanation: 'Middleware runs in the Edge runtime - a lightweight V8-based environment that runs at CDN edge nodes globally, close to users. This makes middleware extremely fast for tasks like auth redirects. However, the Edge runtime has limitations - no Node.js built-ins like fs or crypto.',
    },
  ],
  quiz: [
    {
      id: 'nextjs-mw-q1',
      question: 'What is the difference between NextResponse.redirect() and NextResponse.rewrite() in middleware?',
      options: [
        'They are identical - both redirect the user to a new URL',
        'redirect() changes the URL the user sees, rewrite() serves different content while keeping the original URL',
        'rewrite() changes the URL the user sees, redirect() keeps the original URL',
        'redirect() only works for API routes, rewrite() only works for pages',
      ],
      correct: 1,
      explanation: 'NextResponse.redirect() sends a 302/307 response that changes the URL in the browser - the user sees the new URL. NextResponse.rewrite() serves content from a different URL while keeping the original URL in the browser bar - the user never sees the internal URL.',
    },
  ],
};
