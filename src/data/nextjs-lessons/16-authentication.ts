import type { NextjsLesson } from '../nextjs-curriculum';

export const nextjsAuthenticationLesson: NextjsLesson = {
  id: 'nextjs-authentication',
  title: 'Authentication in Next.js',
  slug: 'authentication',
  chapter: 'advanced',
  order: 16,
  difficulty: 'intermediate',
  readingTime: 15,
  description: 'Add authentication to your Next.js app using NextAuth.js (Auth.js) — the standard solution for Next.js auth with OAuth, credentials, and session management.',
  sections: [
    {
      type: 'text',
      content: 'Authentication in web apps requires managing sessions, tokens, cookies, and third-party OAuth providers — a notoriously complex problem. NextAuth.js (now called Auth.js) is the de facto standard library for Next.js authentication, handling all of this complexity with a simple configuration API.',
    },
    {
      type: 'heading',
      content: 'Why Authentication is Hard',
    },
    {
      type: 'text',
      content: 'A complete auth system must handle secure password hashing, session tokens, cookie management, CSRF protection, OAuth handshakes with providers like Google and GitHub, and token rotation. Building this from scratch is error-prone and time-consuming, which is exactly why NextAuth.js exists.',
    },
    {
      type: 'list',
      title: 'Key authentication concepts',
      items: [
        'Sessions: Server-side storage of user login state, identified by a session ID in a cookie',
        'JWT (JSON Web Tokens): Self-contained tokens with encoded user data, verified with a secret key',
        'OAuth: A protocol that lets users log in with a third-party account (Google, GitHub) without sharing their password with your app',
        'Cookies: Small browser-stored values — the standard way to persist sessions across HTTP requests',
        'NEXTAUTH_SECRET: A random string used to sign/encrypt JWTs and session cookies — critical for security',
      ],
    },
    {
      type: 'heading',
      content: 'NextAuth.js v5 (Auth.js) Overview',
    },
    {
      type: 'text',
      content: 'NextAuth.js v5 (also branded as Auth.js) is a major rewrite designed for the Next.js App Router. It introduces a unified auth() function that works in Server Components, Route Handlers, and middleware, replacing the older getServerSession() pattern.',
    },
    {
      type: 'note',
      content: 'Install with: npm install next-auth@beta. The v5 API used here requires the beta release. Older v4 tutorials use getServerSession() and a different file structure.',
    },
    {
      type: 'heading',
      content: 'Installation and Setup',
    },
    {
      type: 'example',
      title: 'auth.ts configuration with GitHub provider',
      content: 'This file is the central configuration for NextAuth.js, defining which providers are enabled and how sessions are handled. The NEXTAUTH_SECRET environment variable is critical — it signs the session cookies, and if it is missing or weak, your sessions can be forged by attackers.',
      language: 'typescript',
      code: `// src/auth.ts (at project root or src/)
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  // 'jwt' stores session in a signed cookie (stateless, no DB needed)
  // 'database' stores session in your database (supports session revocation)
  session: { strategy: 'jwt' },
  callbacks: {
    // Called when a JWT is created or updated
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // Called whenever a session is checked — shape returned to useSession/auth()
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  // Custom sign-in page (optional — NextAuth provides a default)
  pages: {
    signIn: '/login',
  },
});

// Also create: app/api/auth/[...nextauth]/route.ts
// export { handlers as GET, handlers as POST } from '@/auth';`,
    },
    {
      type: 'heading',
      content: 'Protecting Pages with Server Components',
    },
    {
      type: 'example',
      title: 'Protecting a page with auth() in a Server Component',
      content: 'The auth() function imported from your auth.ts reads the session from the incoming request cookie on the server, with zero client round-trips. Calling redirect() from next/navigation inside a Server Component immediately sends a 302 response before any HTML is rendered, so unauthenticated users never see the protected page content.',
      language: 'typescript',
      code: `// app/dashboard/page.tsx
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  // auth() reads the session from the request cookie — server-side only
  const session = await auth();

  // If no session exists, redirect immediately before rendering any content
  if (!session) {
    redirect('/login');
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Welcome, {session.user?.name}!</p>
      <p>Email: {session.user?.email}</p>
      <img src={session.user?.image ?? ''} alt="Avatar" width={48} height={48} />
    </main>
  );
}`,
    },
    {
      type: 'heading',
      content: 'Middleware Route Protection',
    },
    {
      type: 'example',
      title: 'middleware.ts for route protection',
      content: 'Middleware runs at the Edge before a request reaches your page, making it ideal for bulk route protection. By exporting the auth function from NextAuth as the middleware, every request matching the config.matcher pattern is automatically checked for a valid session, eliminating the need to add auth checks to every individual page.',
      language: 'typescript',
      code: `// middleware.ts (lives at project root or src/, NOT inside app/)
export { auth as middleware } from '@/auth';

export const config = {
  // Protect all routes under /dashboard and /settings
  // The negative lookahead excludes static files and API routes
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
    '/profile/:path*',
  ],
};

// For more control, export a custom middleware function:
// import { auth } from '@/auth';
// import { NextResponse } from 'next/server';
//
// export default auth((req) => {
//   if (!req.auth && req.nextUrl.pathname !== '/login') {
//     const loginUrl = new URL('/login', req.url);
//     loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
//     return NextResponse.redirect(loginUrl);
//   }
// });`,
    },
    {
      type: 'heading',
      content: 'Client Components and Sessions',
    },
    {
      type: 'example',
      title: 'Client component using useSession',
      content: 'The useSession hook provides reactive session state in Client Components and has three possible statuses: "loading" while the initial session fetch is in progress, "authenticated" when the user is signed in, and "unauthenticated" when there is no active session. Always handle the loading state to prevent layout flashes between the unauthenticated and authenticated UI.',
      language: 'typescript',
      code: `// components/UserMenu.tsx
'use client';
import { useSession } from 'next-auth/react';

export function UserMenu() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    // Avoid showing a flash of "signed out" UI while the session loads
    return <div className="skeleton-avatar" />;
  }

  if (status === 'unauthenticated') {
    return (
      <a href="/api/auth/signin" className="btn-signin">
        Sign In
      </a>
    );
  }

  // status === 'authenticated'
  return (
    <div className="user-menu">
      <img
        src={session.user?.image ?? '/default-avatar.png'}
        alt={session.user?.name ?? 'User'}
        width={32}
        height={32}
      />
      <span>{session.user?.name}</span>
    </div>
  );
}

// Wrap your app (or layout) with SessionProvider:
// import { SessionProvider } from 'next-auth/react';
// <SessionProvider>{children}</SessionProvider>`,
    },
    {
      type: 'example',
      title: 'Sign in and sign out buttons',
      content: 'The signIn() function from next-auth/react redirects the user to the OAuth provider (or your custom login page), while signOut() destroys the session cookie and redirects. Both accept a callbackUrl option to control where the user ends up after the action completes — critical for a smooth user experience.',
      language: 'typescript',
      code: `'use client';
import { signIn, signOut } from 'next-auth/react';

// Sign in with a specific provider and return to the current page
export function SignInButton() {
  return (
    <button onClick={() => signIn('github', { callbackUrl: '/dashboard' })}>
      Sign in with GitHub
    </button>
  );
}

// Sign out and redirect to the home page
export function SignOutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: '/' })}>
      Sign Out
    </button>
  );
}

// For Server Actions (Next.js App Router), import from the auth module:
// import { signIn, signOut } from '@/auth';
//
// export async function handleSignIn() {
//   'use server';
//   await signIn('github', { redirectTo: '/dashboard' });
// }`,
    },
    {
      type: 'heading',
      content: 'Environment Variables',
    },
    {
      type: 'note',
      content: 'Required environment variables: NEXTAUTH_SECRET (a long random string — generate with: openssl rand -base64 32), NEXTAUTH_URL (your app URL, e.g. http://localhost:3000 in development), GITHUB_ID and GITHUB_SECRET (from your GitHub OAuth App settings at github.com/settings/developers). Never commit these to version control.',
    },
    {
      type: 'heading',
      content: 'JWT vs Database Sessions',
    },
    {
      type: 'table',
      title: 'Comparing session storage strategies',
      headers: ['Strategy', 'How it works', 'Pros', 'Cons'],
      rows: [
        ['JWT (default)', 'Session data encoded in a signed cookie', 'No database required, works on Edge', 'Cannot revoke individual sessions without a blocklist'],
        ['Database', 'Session stored in DB, cookie holds only the session ID', 'Revoke sessions instantly, store more data', 'Requires a database adapter, extra query per request'],
      ],
    },
    {
      type: 'tryit',
      title: 'Auth Flow Simulator',
      css: `body{font-family:system-ui,sans-serif;padding:16px;margin:0;background:#f5f5f5;}
h2{font-size:16px;font-weight:700;margin:0 0 12px;}
.container{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.panel{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:16px;}
.panel-title{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;margin-bottom:12px;}
.session-state{font-size:13px;font-weight:600;padding:8px 12px;border-radius:6px;margin-bottom:12px;display:flex;align-items:center;gap:8px;}
.state-loading{background:#fef9c3;color:#854d0e;}
.state-auth{background:#dcfce7;color:#166534;}
.state-unauth{background:#fee2e2;color:#991b1b;}
.dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.dot-loading{background:#eab308;animation:pulse 1s infinite;}
.dot-auth{background:#22c55e;}
.dot-unauth{background:#ef4444;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.3;}}
.user-card{display:flex;align-items:center;gap:10px;background:#f9fafb;border-radius:8px;padding:10px;margin-bottom:12px;}
.avatar{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:16px;flex-shrink:0;}
.user-info{font-size:12px;}
.user-name{font-weight:600;font-size:13px;}
.user-email{color:#6b7280;margin-top:2px;}
.btn{border:none;border-radius:8px;padding:9px 16px;font-size:13px;font-weight:600;cursor:pointer;width:100%;margin-bottom:8px;transition:opacity .15s;}
.btn-github{background:#24292f;color:#fff;}
.btn-github:hover{opacity:.85;}
.btn-signout{background:#fee2e2;color:#991b1b;}
.btn-signout:hover{background:#fecaca;}
.protected-panel{margin-top:0;}
.route-row{display:flex;align-items:center;justify-content:space-between;padding:8px 12px;border-radius:6px;font-size:12px;margin-bottom:6px;}
.route-granted{background:#dcfce7;color:#166534;}
.route-denied{background:#fee2e2;color:#991b1b;}
.route-name{font-family:monospace;font-weight:600;}
.route-status{font-size:11px;}
.hidden{display:none;}`,
      js: `let authState = 'unauthenticated'; // 'loading' | 'unauthenticated' | 'authenticated'
const mockUser = { name: 'Alex Johnson', email: 'alex@example.com', initial: 'A' };
const protectedRoutes = ['/dashboard', '/settings', '/profile/edit'];

function render() {
  const stateEl = document.getElementById('session-state');
  const userCardEl = document.getElementById('user-card');
  const signinBtnEl = document.getElementById('btn-signin');
  const signoutBtnEl = document.getElementById('btn-signout');
  const routeListEl = document.getElementById('route-list');

  if (authState === 'loading') {
    stateEl.className = 'session-state state-loading';
    stateEl.innerHTML = '<div class="dot dot-loading"></div> Loading session...';
    userCardEl.classList.add('hidden');
    signinBtnEl.classList.add('hidden');
    signoutBtnEl.classList.add('hidden');
  } else if (authState === 'authenticated') {
    stateEl.className = 'session-state state-auth';
    stateEl.innerHTML = '<div class="dot dot-auth"></div> Authenticated';
    userCardEl.classList.remove('hidden');
    userCardEl.innerHTML =
      '<div class="avatar">' + mockUser.initial + '</div>' +
      '<div class="user-info"><div class="user-name">' + mockUser.name + '</div>' +
      '<div class="user-email">' + mockUser.email + '</div></div>';
    signinBtnEl.classList.add('hidden');
    signoutBtnEl.classList.remove('hidden');
  } else {
    stateEl.className = 'session-state state-unauth';
    stateEl.innerHTML = '<div class="dot dot-unauth"></div> Unauthenticated';
    userCardEl.classList.add('hidden');
    signinBtnEl.classList.remove('hidden');
    signoutBtnEl.classList.add('hidden');
  }

  routeListEl.innerHTML = protectedRoutes.map(r =>
    '<div class="route-row ' + (authState === 'authenticated' ? 'route-granted' : 'route-denied') + '">' +
    '<span class="route-name">' + r + '</span>' +
    '<span class="route-status">' +
    (authState === 'authenticated' ? 'Access Granted' : 'Redirecting to /login...') +
    '</span></div>'
  ).join('');
}

function doSignIn() {
  authState = 'loading';
  render();
  setTimeout(() => {
    authState = 'authenticated';
    render();
    console.log('Session created:', JSON.stringify({ user: mockUser, expires: '2025-12-31' }));
  }, 1200);
}

function doSignOut() {
  authState = 'loading';
  render();
  setTimeout(() => {
    authState = 'unauthenticated';
    render();
    console.log('Session destroyed — user signed out');
  }, 800);
}

document.getElementById('output').innerHTML =
  '<h2>Auth Flow Simulator</h2>' +
  '<div class="container">' +
  '<div class="panel">' +
  '<div class="panel-title">Session State</div>' +
  '<div id="session-state" class="session-state state-unauth"><div class="dot dot-unauth"></div> Unauthenticated</div>' +
  '<div id="user-card" class="user-card hidden"></div>' +
  '<button id="btn-signin" class="btn btn-github" onclick="doSignIn()">Sign In with GitHub</button>' +
  '<button id="btn-signout" class="btn btn-signout hidden" onclick="doSignOut()">Sign Out</button>' +
  '</div>' +
  '<div class="panel protected-panel">' +
  '<div class="panel-title">Protected Routes</div>' +
  '<div id="route-list"></div>' +
  '</div>' +
  '</div>';

render();`,
    },
  ],
  exercises: [
    {
      id: 'nextjs-auth-ex-1',
      question: 'Which function from NextAuth.js v5 should you use to get the current session inside a Server Component?',
      type: 'multiple-choice',
      options: [
        'useSession()',
        'getServerSideProps()',
        'auth()',
        'getServerSession()',
      ],
      correct: 2,
      explanation: 'In NextAuth.js v5 (Auth.js), the auth() function is the unified way to read sessions in Server Components, Route Handlers, and middleware. useSession() is for Client Components only. getServerSession() is the older v4 API.',
    },
    {
      id: 'nextjs-auth-ex-2',
      question: 'What is the purpose of NEXTAUTH_SECRET?',
      type: 'multiple-choice',
      options: [
        'It is the password for your OAuth application on GitHub',
        'It signs and encrypts session cookies and JWTs so they cannot be tampered with',
        'It is the API key for sending confirmation emails',
        'It is the database password used by NextAuth to store sessions',
      ],
      correct: 1,
      explanation: 'NEXTAUTH_SECRET is a random secret string used to sign and encrypt all session tokens and JWTs. Without it (or with a weak value), an attacker could forge session cookies and impersonate any user. Generate it with: openssl rand -base64 32.',
    },
    {
      id: 'nextjs-auth-ex-3',
      question: 'Why must you handle the "loading" status from useSession()?',
      type: 'multiple-choice',
      options: [
        'Because it throws an error if not handled',
        'To prevent a flash of unauthenticated UI before the session is confirmed',
        'Because useSession() is asynchronous and must be awaited',
        'To avoid hydration mismatches between server and client',
      ],
      correct: 1,
      explanation: 'When a Client Component first mounts, useSession() fetches the session asynchronously, briefly entering the "loading" state. If you immediately render unauthenticated UI (like a sign-in button) during this window, users will see a brief flash before the authenticated UI appears. Rendering a skeleton or null during loading prevents this jarring flicker.',
    },
  ],
  quiz: [
    {
      id: 'nextjs-auth-q1',
      question: 'Which file location is correct for NextAuth.js v5 Route Handlers that handle /api/auth/* requests?',
      options: [
        'src/pages/api/auth/[...nextauth].ts',
        'src/app/api/auth/[...nextauth]/route.ts',
        'src/middleware/auth.ts',
        'src/app/auth/callback/route.ts',
      ],
      correct: 1,
      explanation: 'NextAuth.js v5 uses the App Router convention. You create app/api/auth/[...nextauth]/route.ts and export the handlers: export { handlers as GET, handlers as POST } from "@/auth". This catch-all route handles all NextAuth callbacks like sign-in, sign-out, and OAuth redirects.',
    },
    {
      id: 'nextjs-auth-q2',
      question: 'What is the main advantage of using middleware.ts for route protection instead of adding auth() checks to every page?',
      options: [
        'Middleware runs faster because it uses Edge Runtime',
        'It centralizes protection logic so you cannot accidentally forget to protect a new route',
        'Middleware has access to more session data than Server Components',
        'It is the only approach that works with OAuth providers',
      ],
      correct: 1,
      explanation: 'Adding auth checks to individual pages is error-prone — a developer can easily add a new protected page and forget the check. Middleware with a matcher pattern enforces protection at the routing layer for all matching paths, making it impossible to accidentally create an unprotected route within the protected area.',
    },
    {
      id: 'nextjs-auth-q3',
      question: 'What is the key difference between JWT sessions and database sessions in NextAuth.js?',
      options: [
        'JWT sessions are more secure than database sessions',
        'Database sessions support OAuth providers while JWT sessions do not',
        'JWT sessions are stateless and stored in a cookie; database sessions store only a session ID in the cookie and the data in a database',
        'JWT sessions require a database adapter to function',
      ],
      correct: 2,
      explanation: 'With JWT strategy, the entire session payload is encoded and signed into a cookie — no database query needed on each request. With database strategy, a session record is stored in your database and only the session ID is in the cookie, requiring a database lookup per request. Database sessions allow instant revocation but add a query overhead.',
    },
  ],
};
