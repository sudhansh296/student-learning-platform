import type { Project } from './types';

const dataTs = `export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  likes: number;
}

// In a real app this would be a database query (Prisma, Drizzle, a fetch to
// a CMS) — a plain array keeps this example self-contained and runnable.
const posts: Post[] = [
  {
    slug: 'hello-nextjs',
    title: 'Hello, Next.js',
    excerpt: 'Getting started with the App Router.',
    body: 'This is my first post using the App Router. Every folder under app/ becomes a route automatically.',
    likes: 4,
  },
  {
    slug: 'server-components',
    title: 'Understanding Server Components',
    excerpt: 'What runs on the server, and what runs in the browser.',
    body: 'Server Components render on the server and send finished HTML to the browser — no client-side JavaScript is shipped for them at all, unless a child is explicitly a Client Component.',
    likes: 11,
  },
];

export function getAllPosts(): Post[] {
  return posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
`;

const actionsTs = `'use server';

// A Server Action: a function that runs only on the server, callable
// directly from a Client Component as if it were a normal async function —
// no separate API route or manual fetch() needed.

interface LikeResult {
  success: boolean;
  totalLikes: number;
}

// A real app would update a database row here. An in-memory Map keeps
// this example self-contained, while still demonstrating the real shape
// of a Server Action: an async function marked 'use server'.
const likeCounts = new Map<string, number>();

export async function likePost(slug: string): Promise<LikeResult> {
  const current = likeCounts.get(slug) ?? 0;
  const next = current + 1;
  likeCounts.set(slug, next);
  return { success: true, totalLikes: next };
}
`;

const likeButtonTsx = `'use client';

// A Client Component: needs 'use client' because it uses state and an
// event handler, neither of which a Server Component is allowed to do.
// Everything else in this project stays a Server Component by default.

import { useState, useTransition } from 'react';
import { likePost } from '../../actions';

interface LikeButtonProps {
  slug: string;
  initialLikes: number;
}

export function LikeButton({ slug, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    // Calling a Server Action from the client looks like calling
    // any other async function — Next.js handles the network round trip.
    startTransition(async () => {
      const result = await likePost(slug);
      setLikes(result.totalLikes);
    });
  }

  return (
    <button onClick={handleClick} disabled={isPending}>
      {isPending ? 'Liking...' : \`\\u2665 \${likes}\`}
    </button>
  );
}
`;

const blogIndexPageTsx = `// app/blog/page.tsx  ->  the route GET /blog
// No 'use client' here, so this is a Server Component by default:
// it can read data directly, with no loading spinner or client-side fetch.

import Link from 'next/link';
import { getAllPosts } from './data';

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div>
      <h1>Blog</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={\`/blog/\${post.slug}\`}>{post.title}</Link>
            <p>{post.excerpt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
`;

const blogSlugPageTsx = `// app/blog/[slug]/page.tsx  ->  the route GET /blog/:slug
// The folder name [slug] makes this a dynamic route; Next.js hands the
// matched segment to the page as a route parameter.

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostBySlug } from '../data';
import { LikeButton } from './LikeButton';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// generateMetadata runs on the server before the page renders, and lets
// each post set its own <title> and description for real SEO, per URL.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Post not found' };

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  // notFound() renders the nearest not-found.tsx (or Next's default 404)
  // and stops rendering the rest of this component.
  if (!post) notFound();

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      <LikeButton slug={post.slug} initialLikes={post.likes} />
    </article>
  );
}
`;

const apiRouteTs = `// app/api/posts/route.ts  ->  the route GET /api/posts
// A named export matching an HTTP method (GET, POST, ...) is all a route
// handler needs — no router setup, no separate framework required.

import { NextResponse } from 'next/server';
import { getAllPosts } from '../../blog/data';

export async function GET() {
  const posts = getAllPosts();
  return NextResponse.json({ posts });
}
`;

export const nextjsBlogServerActionsProject: Project = {
  id: 'nextjs-blog-server-actions',
  slug: 'nextjs-blog-server-actions',
  title: 'Next.js Blog with Server Actions',
  difficulty: 'advanced',
  type: 'fullstack',
  estimatedTime: '8-12 hours',
  playgroundKey: 'nextjs-blog-server-actions',
  description: 'Build a small blog with the Next.js App Router — file-based routing, a Server Component reading data directly with no client-side fetch, a Client Component with a Server Action for likes, per-post generateMetadata, and a JSON API route.',
  overview: 'This project is built entirely around App Router conventions rather than a client-side app that happens to be written in Next.js: folders under app/ define routes automatically, components are Server Components by default (and opt into being Client Components explicitly with \'use client\'), a Server Action lets a button call server-side logic with no hand-written API call, and generateMetadata gives every blog post its own real, per-URL SEO title and description.',
  objective: 'Build a blog with the App Router covering file-based routing (a list page and a dynamic [slug] page), the Server/Client Component split, a Server Action wired to an interactive like button, generateMetadata for per-post SEO, and a JSON API route.',
  technologies: ['TypeScript', 'JavaScript', 'Next.js'],
  prerequisites: ['React fundamentals (components, props, useState)', 'Basic TypeScript (interfaces, async/await)', 'Some familiarity with Next.js is helpful but not required'],
  learnings: [
    'How folders under app/ become routes automatically, including a dynamic [slug] segment',
    'Why a component is a Server Component by default, and exactly when \'use client\' is actually required (state, event handlers, browser-only APIs)',
    'Writing and calling a Server Action — a server-only async function a Client Component can call directly, no separate API route needed',
    'Using generateMetadata to give each dynamic page its own real, per-URL <title> and description for SEO',
    'The difference between rendering not-found content with notFound() and a plain conditional return',
    'Writing a route handler (app/api/.../route.ts) as a small, self-contained alternative to a page, for JSON responses',
    'Why this specific project cannot run in a plain HTML/CSS/JS live preview — it genuinely needs the Next.js server runtime, file-based routing and React Server Components, none of which a static browser preview can provide',
  ],
  features: [
    'A blog index page (app/blog/page.tsx) listing every post as a Server Component with no client-side data fetching',
    'A dynamic post page (app/blog/[slug]/page.tsx) reading the route parameter and rendering full post content',
    'Real generateMetadata per post, so each blog post gets its own accurate <title> and description',
    'notFound() handling for a slug that does not match any post',
    'A Client Component (LikeButton) using useState and useTransition for a responsive, pending-aware like button',
    'A Server Action (likePost) called directly from the Client Component, with no manually written fetch/API call',
    'A JSON API route (app/api/posts/route.ts) exposing the same data for external consumers',
    'A single shared data module (app/blog/data.ts) used by the list page, the detail page, and the API route alike',
  ],
  fileStructure: 'app/\n  blog/\n    data.ts\n    page.tsx\n    [slug]/\n      page.tsx\n      LikeButton.tsx\n  actions.ts\n  api/\n    posts/\n      route.ts',
  files: [
    { path: 'app/blog/data.ts', language: 'typescript', content: dataTs },
    { path: 'app/actions.ts', language: 'typescript', content: actionsTs },
    { path: 'app/blog/[slug]/LikeButton.tsx', language: 'typescript', content: likeButtonTsx },
    { path: 'app/blog/page.tsx', language: 'typescript', content: blogIndexPageTsx },
    { path: 'app/blog/[slug]/page.tsx', language: 'typescript', content: blogSlugPageTsx },
    { path: 'app/api/posts/route.ts', language: 'typescript', content: apiRouteTs },
  ],
  lessons: [
    {
      id: 'file-based-routing',
      title: 'File-Based Routing with the App Router',
      explanation: 'Every folder under app/ that contains a page.tsx becomes a route at that folder\'s path — app/blog/page.tsx is /blog. A folder name in square brackets, like [slug], becomes a dynamic segment, matching any value at that position in the URL.',
      js: `// app/blog/page.tsx              ->  GET /blog
// app/blog/[slug]/page.tsx        ->  GET /blog/:slug  (any value)
// app/api/posts/route.ts          ->  GET /api/posts

// No router configuration file anywhere -- the folder structure IS the routing table.`,
    },
    {
      id: 'server-vs-client',
      title: 'Server Components by Default, Client Components by Choice',
      explanation: 'A component with no \'use client\' directive runs only on the server: it can read data directly, and it ships zero JavaScript to the browser for its own logic. \'use client\' is needed specifically when a component uses state, effects, event handlers, or browser-only APIs.',
      js: `// Server Component (the default) -- no 'use client', reads data directly:
export default function BlogIndexPage() {
  const posts = getAllPosts(); // just a function call, no fetch(), no loading state
  return <ul>{posts.map((p) => <li key={p.slug}>{p.title}</li>)}</ul>;
}

// Client Component -- needs 'use client' because of useState and onClick:
'use client';
export function LikeButton({ slug }: { slug: string }) {
  const [likes, setLikes] = useState(0);
  return <button onClick={() => setLikes(likes + 1)}>{likes}</button>;
}`,
    },
    {
      id: 'server-actions',
      title: 'Calling Server-Only Logic with a Server Action',
      explanation: "A function marked 'use server' can be imported into a Client Component and called directly, like any other async function — Next.js handles serializing the call to the server and back. No API route, no manual fetch(), no separate endpoint to keep in sync with the client code that calls it.",
      js: `// app/actions.ts
'use server';

export async function likePost(slug: string) {
  // runs ONLY on the server -- this code never ships to the browser
  const next = incrementLikeCountInDatabase(slug);
  return { success: true, totalLikes: next };
}

// In a Client Component:
'use client';
import { likePost } from '../../actions';

function handleClick() {
  startTransition(async () => {
    const result = await likePost(slug); // looks like a normal function call
    setLikes(result.totalLikes);
  });
}`,
    },
    {
      id: 'generate-metadata',
      title: 'Per-Page SEO with generateMetadata',
      explanation: 'generateMetadata runs on the server, receives the same route params as the page itself, and can look up real data (like a specific blog post) before deciding what title and description that exact URL should have — genuinely dynamic, per-page SEO instead of one static title for the whole site.',
      js: `export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return { title: 'Post not found' };

  return {
    title: post.title,           // becomes <title>...</title>
    description: post.excerpt,   // becomes <meta name="description" ...>
  };
}`,
    },
  ],
  challenges: [
    {
      id: 'add-comments-count',
      title: 'Add a comment count to each post',
      difficulty: 'easy',
      description: 'Add a commentCount field to the Post interface and seed data, and display it on both the blog index page and the individual post page.',
      hint: 'Add commentCount: number to the Post interface in data.ts, give each seeded post a value, then render it in both page.tsx files the same way title and excerpt are already rendered.',
      solutionJs: `// app/blog/data.ts
export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  likes: number;
  commentCount: number; // new field
}

const posts: Post[] = [
  { slug: 'hello-nextjs', title: 'Hello, Next.js', excerpt: '...', body: '...', likes: 4, commentCount: 2 },
  { slug: 'server-components', title: 'Understanding Server Components', excerpt: '...', body: '...', likes: 11, commentCount: 7 },
];

// app/blog/page.tsx, inside the .map():
<li key={post.slug}>
  <Link href={\`/blog/\${post.slug}\`}>{post.title}</Link>
  <p>{post.excerpt} · {post.commentCount} comments</p>
</li>`,
    },
    {
      id: 'add-post-route-handler',
      title: 'Add a dynamic API route for a single post',
      difficulty: 'medium',
      description: 'Add app/api/posts/[slug]/route.ts with a GET handler that returns a single post as JSON, or a 404 JSON response if the slug does not match any post.',
      hint: 'A route handler in a [slug] folder receives the same kind of params object as a page does. Use getPostBySlug(slug) and return NextResponse.json(post, { status: 404 }) when it is undefined.',
      solutionJs: `// app/api/posts/[slug]/route.ts
import { NextResponse } from 'next/server';
import { getPostBySlug } from '../../../blog/data';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json(post);
}`,
    },
    {
      id: 'add-optimistic-like',
      title: 'Make the like button optimistic',
      difficulty: 'hard',
      description: 'Update LikeButton so the displayed like count increases immediately when clicked, before the Server Action has actually resolved, using React\'s useOptimistic hook — and rolls back cleanly if the action fails.',
      hint: 'useOptimistic(likes, (current, _) => current + 1) gives you an optimistic value to render immediately inside startTransition, while the real Server Action call happens in the background; the base state updates for real once the action resolves.',
      solutionJs: `'use client';

import { useState, useOptimistic, useTransition } from 'react';
import { likePost } from '../../actions';

export function LikeButton({ slug, initialLikes }: { slug: string; initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes);
  const [optimisticLikes, addOptimisticLike] = useOptimistic(likes, (current) => current + 1);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      addOptimisticLike(undefined); // show the increment immediately
      const result = await likePost(slug);
      setLikes(result.totalLikes); // reconcile with the real server value
    });
  }

  return (
    <button onClick={handleClick} disabled={isPending}>
      {'\\u2665'} {optimisticLikes}
    </button>
  );
}`,
    },
  ],
};
