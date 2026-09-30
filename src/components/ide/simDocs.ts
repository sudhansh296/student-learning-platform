// Builds the sandboxed iframe documents for the in-browser Express / Next.js simulators.
// The runtime itself lives in /public/sim/*.js (loaded as plain scripts).

import { POSTGRES_STARTER, MONGO_STARTER, GIT_STARTER, REDIS_STARTER, DOCKER_STARTER, YAML_STARTER, JSON_STARTER, HTTP_STARTER } from './simStarters';

export type SimKind = 'express' | 'nextjs' | 'postgres' | 'mongo' | 'git' | 'redis' | 'docker' | 'yaml' | 'json' | 'http';

const SIM_KINDS: readonly SimKind[] = ['express', 'nextjs', 'postgres', 'mongo', 'git', 'redis', 'docker', 'yaml', 'json', 'http'];
export const isSimKind = (id: string): id is SimKind => (SIM_KINDS as readonly string[]).includes(id);

function bridge(runId: number): string {
  return `var __rid=${runId};
function __post(t,m){try{window.parent.postMessage({_wda:1,rid:__rid,t:t,d:m},"*");}catch(e){}}
window.onerror=function(m,s,l,c,err){if(err&&typeof err.digest==="string"&&/^NEXT_/.test(err.digest))return true;window.__lastError=m+(l?" (line "+l+")":"");__post("e","❌ "+m+(l?" (line "+l+")":""));return false;};`;
}

export function needsTailwind(code: string): boolean {
  return /className=["'`{][^"'`]*\b(flex|grid|p-\d|px-\d|py-\d|m-\d|mt-\d|mb-\d|gap-\d|text-(xs|sm|lg|xl|\dxl)|bg-[a-z]+-\d00|rounded(-\w+)?|font-(bold|semibold|medium)|w-\d|h-\d)\b/.test(code);
}

const BASE_SCRIPTS = ['sim-core', 'sim-net', 'sim-boot'];
const KIND_SCRIPTS: Record<SimKind, string[]> = {
  express: ['sim-testing', 'sim-express'],
  nextjs: ['sim-testing', 'sim-next'],
  postgres: ['sim-term', 'sim-pg'],
  mongo: ['sim-term', 'sim-mongo'],
  git: ['sim-term', 'sim-git'],
  redis: ['sim-term', 'sim-redis'],
  docker: ['sim-term', 'sim-yaml', 'sim-redis', 'sim-docker'],
  yaml: ['sim-yaml', 'sim-data'],
  json: ['sim-data'],
  http: ['sim-data'],
};
const BOOT_KIND: Record<SimKind, string> = { express: 'express', nextjs: 'next', postgres: 'postgres', mongo: 'mongo', git: 'git', redis: 'redis', docker: 'docker', yaml: 'yaml', json: 'json', http: 'http' };

/* Database client packages (ioredis, pg, mongoose, better-sqlite3…) load their engines only when the code mentions them. */
function dbScripts(code: string): string[] {
  const uses = (re: RegExp) => re.test(code);
  const list: string[] = [];
  const redis = uses(/['"](ioredis|redis)['"]/);
  const mongo = uses(/['"](mongoose|mongodb)['"]/);
  const pg = uses(/['"](pg|pg-pool)['"]/);
  const sqlite = uses(/['"](better-sqlite3|sqlite3)['"]/);
  if (redis) list.push('sim-term', 'sim-redis');
  if (mongo) list.push(...(redis ? [] : ['sim-term']), 'sim-mongo');
  if (pg) list.push(...(redis || mongo ? [] : ['sim-term']), 'sim-pg');
  if (redis || mongo || pg || sqlite) list.push('sim-db');
  return list;
}

export function buildSimDoc(kind: SimKind, code: string, runId: number, origin: string): string {
  const script = (name: string) => `<script src="${origin}/sim/${name}.js"></script>`;
  const head = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;background:#0d1117}</style>`;
  const isNext = kind === 'nextjs';
  const libs = isNext
    ? `<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
${needsTailwind(code) ? '<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>' : ''}`
    : '';
  const source = JSON.stringify(code).replace(/</g, '\\u003c');
  const scripts = [...BASE_SCRIPTS, ...KIND_SCRIPTS[kind], ...(kind === 'express' ? dbScripts(code) : [])].map(script).join('');
  return `${head}
${libs}
</head><body>
<script>${bridge(runId)}</script>
${scripts}
<script>
try { __sim.boot(${JSON.stringify(BOOT_KIND[kind])}, ${source}); }
catch (e) { console.error(e && e.stack ? e.stack : String(e)); try { __sim.ui.init({ title: 'Simulator' }); __sim.ui.error(String(e && e.stack ? e.stack : e)); } catch (_) { /* ui unavailable */ } }
</script></body></html>`;
}

/* ───────────── starter programs ───────────── */

export const NODE_STARTER = `// Node.js — runs on a real Node.js 20 runtime (server-side)
const path = require('path');
const crypto = require('crypto');
const { EventEmitter } = require('events');

console.log('Node', process.version, 'on', process.platform);
console.log('basename:', path.basename('/var/www/app/index.js'), '| ext:', path.extname('photo.png'));

// Events
class Orders extends EventEmitter {}
const orders = new Orders();
orders.on('created', (id) => console.log('Order created:', id));
orders.emit('created', 101);

// async / await + timers
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log('Working...');
  await sleep(200);
  const hash = crypto.createHash('sha256').update('hello').digest('hex');
  console.log('SHA-256:', hash.slice(0, 16) + '...');

  const users = [{ name: 'Ada', age: 36 }, { name: 'Linus', age: 28 }];
  console.log(users);
  console.table(users);
}

main();
`;

export const EXPRESS_STARTER = `// Express — runs in a browser simulator with a built-in request tester.
// Start the server with app.listen(), then click an endpoint chip and hit Send.
const express = require('express');
const app = express();

app.use(express.json());

// Custom middleware — runs for every request
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

let todos = [
  { id: 1, title: 'Learn Express', done: true },
  { id: 2, title: 'Build an API', done: false },
];

app.get('/', (req, res) => {
  res.send('<h1>Todo API</h1><p>Try <code>GET /todos</code></p>');
});

app.get('/todos', (req, res) => res.json(todos));

app.get('/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === Number(req.params.id));
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  res.json(todo);
});

app.post('/todos', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });
  const todo = { id: todos.length + 1, title, done: false };
  todos.push(todo);
  res.status(201).json(todo);
});

app.delete('/todos/:id', (req, res) => {
  todos = todos.filter((t) => t.id !== Number(req.params.id));
  res.status(204).end();
});

// Error-handling middleware (4 arguments)
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
`;

export const NEXT_STARTER = `// Next.js (App Router) — runs in a browser simulator: live page + API tester.
// Put each file under its own "// FILE: path" line, just like a real project.

// FILE: app/layout.js
import Link from 'next/link';

export const metadata = { title: { default: 'My Next App', template: '%s · My Next App' } };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0 }}>
        <nav style={{ display: 'flex', gap: 16, padding: '12px 20px', background: '#111827' }}>
          <Link href="/" style={{ color: '#fff' }}>Home</Link>
          <Link href="/posts" style={{ color: '#fff' }}>Posts</Link>
          <Link href="/about" style={{ color: '#fff' }}>About</Link>
        </nav>
        <main style={{ padding: 20 }}>{children}</main>
      </body>
    </html>
  );
}

// FILE: app/page.js
'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    fetch('/api/todos').then((r) => r.json()).then(setTodos);
  }, []);

  async function add() {
    if (!title.trim()) return;
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    const todo = await res.json();
    setTodos([...todos, todo]);
    setTitle('');
  }

  return (
    <div>
      <h1>Todos (client component + API route)</h1>
      <ul>{todos.map((t) => <li key={t.id}>{t.title}</li>)}</ul>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New todo" />
      <button onClick={add}>Add</button>
    </div>
  );
}

// FILE: app/api/todos/route.js
import { NextResponse } from 'next/server';

let todos = [{ id: 1, title: 'Learn Next.js' }, { id: 2, title: 'Ship it' }];

export async function GET() {
  return NextResponse.json(todos);
}

export async function POST(request) {
  const { title } = await request.json();
  if (!title) return NextResponse.json({ error: 'title is required' }, { status: 400 });
  const todo = { id: todos.length + 1, title };
  todos.push(todo);
  return NextResponse.json(todo, { status: 201 });
}

// FILE: app/posts/page.js
import Link from 'next/link';

export const metadata = { title: 'Posts' };

// An async server component — fetch runs before render
export default async function Posts() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
  const posts = await res.json();
  return (
    <div>
      <h1>Posts (server component)</h1>
      <ul>
        {posts.map((p) => (
          <li key={p.id}><Link href={'/posts/' + p.id}>{p.title}</Link></li>
        ))}
      </ul>
    </div>
  );
}

// FILE: app/posts/[id]/page.js
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: 'Post ' + id };
}

export default async function Post({ params }) {
  const { id } = await params;
  const res = await fetch('https://jsonplaceholder.typicode.com/posts/' + id);
  if (!res.ok) notFound();
  const post = await res.json();
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  );
}

// FILE: app/about/page.js
export const metadata = { title: 'About' };

export default function About() {
  return <h1>About</h1>;
}
`;

/* ───────────── language registry (picker metadata + starter code) ───────────── */

export const SIM_LANGUAGES: Record<SimKind, { label: string; icon: string; ext: string; starter: string }> = {
  express: { label: 'Node.js / Express', icon: '⬢', ext: 'js', starter: EXPRESS_STARTER },
  nextjs: { label: 'Next.js', icon: '▲', ext: 'js', starter: NEXT_STARTER },
  postgres: { label: 'PostgreSQL', icon: '🛢️', ext: 'sql', starter: POSTGRES_STARTER },
  mongo: { label: 'MongoDB', icon: '🍃', ext: 'js', starter: MONGO_STARTER },
  git: { label: 'Git', icon: '🌿', ext: 'sh', starter: GIT_STARTER },
  redis: { label: 'Redis', icon: '🔴', ext: 'redis', starter: REDIS_STARTER },
  docker: { label: 'Docker', icon: '🐳', ext: 'sh', starter: DOCKER_STARTER },
  yaml: { label: 'YAML', icon: '📄', ext: 'yml', starter: YAML_STARTER },
  json: { label: 'JSON', icon: '🧾', ext: 'json', starter: JSON_STARTER },
  http: { label: 'HTTP', icon: '🌐', ext: 'http', starter: HTTP_STARTER },
};
