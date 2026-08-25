import type { NextjsLesson } from '../nextjs-curriculum';

export const nextjsApiRoutesLesson: NextjsLesson = {
  id: 'nextjs-api-routes',
  title: 'Route Handlers (API Routes)',
  slug: 'api-routes',
  chapter: 'data',
  order: 9,
  difficulty: 'intermediate',
  readingTime: 11,
  description: 'Build API endpoints with Route Handlers - GET, POST, PUT, DELETE, reading request body, dynamic routes, and CORS.',
  sections: [
    {
      type: 'text',
      content: 'Route Handlers are the App Router equivalent of API Routes. Create a route.ts file inside the app directory to define a backend endpoint. Export async functions named GET, POST, PUT, PATCH, DELETE, HEAD, or OPTIONS. These run on the server and are never exposed to the client bundle.',
    },
    {
      type: 'heading',
      content: 'Basic GET Handler',
    },
    {
      type: 'example',
      title: 'GET route handler - return JSON data',
      content: 'Create app/api/users/route.ts and export a GET function. The function receives a Request object and must return a Response. Use Response.json() to return JSON data with the correct Content-Type header automatically.',
      language: 'typescript',
      code: `// app/api/users/route.ts
// Creates the endpoint: GET /api/users

import { NextResponse } from 'next/server';

// Mock data - replace with real database queries
const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
];

export async function GET(request: Request) {
  // Read URL search params
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get('limit')) || 10;

  const data = users.slice(0, limit);

  // Return JSON response
  return Response.json(data);

  // Alternative with NextResponse for more control:
  return NextResponse.json(data, { status: 200 });
}

// Usage: fetch('/api/users')
// Usage: fetch('/api/users?limit=1')`,
    },
    {
      type: 'heading',
      content: 'POST Handler',
    },
    {
      type: 'example',
      title: 'POST handler with request body',
      content: 'Read the request body with request.json() for JSON payloads. Always validate the incoming data before processing. Return appropriate HTTP status codes - 201 for created, 400 for bad request, 500 for server errors.',
      language: 'typescript',
      code: `// app/api/users/route.ts

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email) {
      return Response.json(
        { error: 'name and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return Response.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Save to database (example)
    const newUser = await db.users.create({
      data: { name: body.name, email: body.email },
    });

    return Response.json(newUser, { status: 201 });

  } catch (error) {
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Usage:
// fetch('/api/users', {
//   method: 'POST',
//   body: JSON.stringify({ name: 'Alice', email: 'alice@ex.com' }),
//   headers: { 'Content-Type': 'application/json' }
// })`,
    },
    {
      type: 'heading',
      content: 'Dynamic Route Handlers',
    },
    {
      type: 'example',
      title: 'Dynamic route handler with params',
      content: 'Create dynamic API routes the same way as page routes - using folder brackets. The route.ts in a [id] folder handles requests to /api/users/123. The params object provides the dynamic segment values.',
      language: 'typescript',
      code: `// app/api/users/[id]/route.ts
// Handles: GET /api/users/1, DELETE /api/users/42, etc.

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;

  const user = await db.users.findUnique({
    where: { id: Number(id) },
  });

  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 });
  }

  return Response.json(user);
}

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = await request.json();

  const updated = await db.users.update({
    where: { id: Number(id) },
    data: body,
  });

  return Response.json(updated);
}

export async function DELETE(request: Request, context: RouteContext) {
  const { id } = await context.params;

  await db.users.delete({ where: { id: Number(id) } });

  return new Response(null, { status: 204 }); // 204 No Content
}`,
    },
    {
      type: 'example',
      title: 'NextRequest and NextResponse - extended APIs',
      content: 'NextRequest extends the standard Request with Next.js-specific features like cookies and geo data. NextResponse extends Response with set-cookie helpers and redirect utilities.',
      language: 'typescript',
      code: `// app/api/auth/session/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // NextRequest extras:
  const token = request.cookies.get('auth-token')?.value;
  const geo = request.geo; // { city, country, region }
  const ip = request.ip;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  const user = await verifyToken(token);
  return NextResponse.json({ user });
}

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  const user = await authenticate(email, password);

  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // NextResponse extras: set cookies
  const response = NextResponse.json({ success: true });
  response.cookies.set('auth-token', user.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  return response;
}`,
    },
    {
      type: 'example',
      title: 'CORS headers for public APIs',
      content: 'If your API needs to accept requests from different origins (like a separate frontend app), you must add CORS headers. Handle the preflight OPTIONS request and add Access-Control headers to your responses.',
      language: 'typescript',
      code: `// app/api/public/route.ts
// A public API that accepts cross-origin requests

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Or specify: 'https://myapp.com'
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET() {
  const data = { message: 'Public API', timestamp: Date.now() };

  return Response.json(data, {
    headers: corsHeaders,
  });
}

// Reusable helper:
function corsResponse(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: corsHeaders,
  });
}`,
    },
    {
      type: 'tryit',
      title: 'API Route Simulator',
      css: `body{font-family:system-ui,sans-serif;padding:14px;margin:0;background:#f5f5f5;}
.url-bar{display:flex;gap:8px;margin-bottom:10px;align-items:center;}
.method-select{background:#000;color:#fff;border:none;border-radius:6px;padding:7px 10px;font-size:13px;font-weight:bold;cursor:pointer;}
.url-input{flex:1;border:1px solid #e5e7eb;border-radius:6px;padding:7px 12px;font-family:monospace;font-size:13px;}
.send-btn{background:#16a34a;color:#fff;border:none;border-radius:6px;padding:7px 16px;font-size:13px;font-weight:bold;cursor:pointer;}
.response-area{background:#0d1117;color:#e6edf3;border-radius:10px;padding:14px;font-family:monospace;font-size:12px;line-height:1.7;min-height:120px;}
.status-bar{display:flex;gap:8px;align-items:center;margin-bottom:8px;}
.status-ok{background:#16a34a;color:#fff;font-size:11px;font-weight:bold;padding:2px 8px;border-radius:4px;}
.status-err{background:#dc2626;color:#fff;font-size:11px;font-weight:bold;padding:2px 8px;border-radius:4px;}`,
      js: `const mockDb = {
  users: [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Carol', email: 'carol@example.com' }
  ]
};

function handleRequest(method, url) {
  const parts = url.replace('/api/', '').split('/');
  const resource = parts[0];
  const id = parts[1] ? parseInt(parts[1]) : null;

  if (resource === 'users') {
    if (method === 'GET' && !id) {
      return { status: 200, data: mockDb.users };
    }
    if (method === 'GET' && id) {
      const user = mockDb.users.find(u => u.id === id);
      if (!user) return { status: 404, data: { error: 'User not found' } };
      return { status: 200, data: user };
    }
    if (method === 'DELETE' && id) {
      const idx = mockDb.users.findIndex(u => u.id === id);
      if (idx === -1) return { status: 404, data: { error: 'User not found' } };
      const deleted = mockDb.users.splice(idx, 1)[0];
      return { status: 200, data: { deleted: true, user: deleted } };
    }
    if (method === 'POST') {
      const newUser = { id: mockDb.users.length + 1, name: 'New User', email: 'new@example.com' };
      mockDb.users.push(newUser);
      return { status: 201, data: newUser };
    }
  }
  return { status: 404, data: { error: 'Route not found' } };
}

function sendRequest() {
  const method = document.getElementById('method-sel').value;
  const url = document.getElementById('url-inp').value;
  const result = handleRequest(method, url);
  const isOk = result.status < 400;
  document.getElementById('resp-status').className = isOk ? 'status-ok' : 'status-err';
  document.getElementById('resp-status').textContent = result.status + ' ' + (isOk ? 'OK' : 'Error');
  document.getElementById('resp-body').textContent = JSON.stringify(result.data, null, 2);
  console.log(method, url, '->', result.status, JSON.stringify(result.data));
}

document.getElementById('output').innerHTML =
  '<div class="url-bar">' +
  '<select class="method-select" id="method-sel"><option>GET</option><option>POST</option><option>DELETE</option></select>' +
  '<input class="url-input" id="url-inp" value="/api/users" />' +
  '<button class="send-btn" id="send-btn">Send</button>' +
  '</div>' +
  '<div class="response-area">' +
  '<div class="status-bar"><span id="resp-status" class="status-ok">200 OK</span><span style="font-size:11px;color:#484f58">Route Handler Response</span></div>' +
  '<pre id="resp-body">Click Send to make a request</pre>' +
  '</div>' +
  '<div style="margin-top:8px;font-size:11px;color:#666">Try: /api/users | /api/users/1 | /api/users/99 (404)</div>';

document.getElementById('send-btn').addEventListener('click', sendRequest);`,
    },
  ],
  exercises: [
    {
      id: 'nextjs-api-1',
      question: 'What is the correct filename for creating a Route Handler at /api/users?',
      type: 'multiple-choice',
      options: [
        'app/api/users/handler.ts',
        'app/api/users/index.ts',
        'app/api/users/route.ts',
        'pages/api/users.ts',
      ],
      correct: 2,
      explanation: 'Route Handlers use the special filename route.ts (or route.js). Creating app/api/users/route.ts creates a route handler at the /api/users endpoint. The file exports named functions for each HTTP method (GET, POST, etc.).',
    },
    {
      id: 'nextjs-api-2',
      question: 'How do you read the request body in a POST Route Handler?',
      type: 'multiple-choice',
      options: [
        'const body = request.body',
        'const body = await request.json()',
        'const body = JSON.parse(request)',
        'const body = request.data',
      ],
      correct: 1,
      explanation: 'The request body must be read asynchronously with await request.json() for JSON payloads. The request.body is a ReadableStream, not plain text - request.json() reads and parses it for you.',
    },
  ],
  quiz: [
    {
      id: 'nextjs-api-q1',
      question: 'How do you export multiple HTTP method handlers from a single route.ts file?',
      options: [
        'Export a single default function that takes the method as a parameter',
        'Create separate route files for each method',
        'Export named async functions with names matching the HTTP methods (GET, POST, PUT, etc.)',
        'Use a switch statement inside one exported handler function',
      ],
      correct: 2,
      explanation: 'A route.ts file can export multiple named async functions, one for each HTTP method: export async function GET() {...}, export async function POST() {...}, etc. Next.js automatically routes each HTTP method to the matching export.',
    },
  ],
};
