import { NextResponse } from 'next/server';

const HEADERS = {
  'Cache-Control': 'no-store',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// ─── Supported server-side languages (run via Wandbox — free, no API key) ──
export const LANGUAGES: Record<string, { label: string; icon: string; compiler: string; ext: string }> = {
  node:   { label: 'Node.js', icon: '🟢', compiler: 'nodejs-20.17.0',   ext: 'js'  },
  python: { label: 'Python',  icon: '🐍', compiler: 'cpython-3.13.8',   ext: 'py'  },
  java:   { label: 'Java',    icon: '☕', compiler: 'openjdk-jdk-21+35', ext: 'java' },
  c:      { label: 'C',       icon: '🔵', compiler: 'gcc-13.2.0-c',     ext: 'c'   },
  cpp:    { label: 'C++',     icon: '➕', compiler: 'gcc-13.2.0',       ext: 'cpp' },
  csharp: { label: 'C#',      icon: '🎯', compiler: 'mono-6.12.0.199',  ext: 'cs'  },
  go:     { label: 'Go',      icon: '🐹', compiler: 'go-1.23.2',        ext: 'go'  },
  rust:   { label: 'Rust',    icon: '🦀', compiler: 'rust-1.82.0',      ext: 'rs'  },
  php:    { label: 'PHP',     icon: '🐘', compiler: 'php-8.3.12',       ext: 'php' },
  ruby:   { label: 'Ruby',    icon: '💎', compiler: 'ruby-3.4.9',       ext: 'rb'  },
  bash:   { label: 'Bash',    icon: '💻', compiler: 'bash',             ext: 'sh'  },
  sql:    { label: 'SQL',     icon: '🗄️', compiler: 'sqlite-3.46.1',    ext: 'sql' },
};

const MAX_CODE_LENGTH = 20_000;
const MAX_STDIN_LENGTH = 5_000;
const EXEC_TIMEOUT_MS = 25_000;

// ─── In-memory rate limiter (15 executions / 60s per IP — compute is expensive) ──
const rateLimitMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 15;
const RATE_WINDOW_MS = 60_000;
const MAX_ENTRIES = 10_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();

  if (rateLimitMap.size > MAX_ENTRIES) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (now > val.reset) rateLimitMap.delete(key);
      if (rateLimitMap.size <= MAX_ENTRIES / 2) break;
    }
  }

  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

async function runOnWandbox(compiler: string, code: string, stdin: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), EXEC_TIMEOUT_MS);
  try {
    const res = await fetch('https://wandbox.org/api/compile.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ compiler, code, stdin }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Wandbox responded with ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: HEADERS });
}

export async function GET() {
  // Lets the client list what's runnable without hardcoding it twice
  return NextResponse.json(
    Object.entries(LANGUAGES).map(([id, l]) => ({ id, label: l.label, icon: l.icon, ext: l.ext })),
    { headers: HEADERS }
  );
}

export async function POST(request: Request) {
  const rawForwarded = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '';
  const rawRealIp = request.headers.get('x-real-ip') ?? '';
  const ipCandidate = rawForwarded || rawRealIp;
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$|^[a-fA-F0-9:]{2,39}$/;
  const ip = ipRegex.test(ipCandidate) ? ipCandidate : '127.0.0.1';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many runs. Please wait a moment and try again.' },
      { status: 429, headers: { ...HEADERS, 'Retry-After': '60' } }
    );
  }

  let body: { language?: string; code?: string; stdin?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400, headers: HEADERS });
  }

  const { language, code, stdin } = body;

  if (!language || typeof language !== 'string' || !(language in LANGUAGES)) {
    return NextResponse.json({ error: 'Unsupported language.' }, { status: 400, headers: HEADERS });
  }
  if (!code || typeof code !== 'string' || code.length === 0) {
    return NextResponse.json({ error: 'No code to run.' }, { status: 400, headers: HEADERS });
  }
  if (code.length > MAX_CODE_LENGTH) {
    return NextResponse.json({ error: `Code is too long (max ${MAX_CODE_LENGTH} characters).` }, { status: 400, headers: HEADERS });
  }
  if (stdin && (typeof stdin !== 'string' || stdin.length > MAX_STDIN_LENGTH)) {
    return NextResponse.json({ error: 'Input is too long.' }, { status: 400, headers: HEADERS });
  }

  const lang = LANGUAGES[language];
  // Java requires the class in the file to match the filename — the sandboxed
  // runner always writes to a fixed filename, so a top-level `public class`
  // fails to compile. Dropping the `public` modifier keeps behavior identical
  // for single-file programs while letting it compile under any filename.
  const source = language === 'java' ? code.replace(/\bpublic\s+class\b/g, 'class') : code;

  const started = Date.now();
  try {
    let result = await runOnWandbox(lang.compiler, source, stdin || '');
    // Wandbox is a free community service — retry once on empty/malformed response
    if (!result || typeof result.status === 'undefined') {
      result = await runOnWandbox(lang.compiler, source, stdin || '');
    }

    return NextResponse.json(
      {
        ok: result.status === '0' || result.status === 0,
        stdout: result.program_output || '',
        stderr: result.program_error || '',
        compileError: result.compiler_error || '',
        durationMs: Date.now() - started,
      },
      { headers: HEADERS }
    );
  } catch (err) {
    const timedOut = err instanceof Error && err.name === 'AbortError';
    return NextResponse.json(
      {
        ok: false,
        stdout: '',
        stderr: '',
        compileError: '',
        error: timedOut
          ? 'Execution timed out. The free runner can be slow under load — please try again.'
          : 'Could not reach the code runner. Please try again in a moment.',
      },
      { status: 502, headers: HEADERS }
    );
  }
}
