import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Backend Development — WebDev Atlas',
  description: 'Learn backend development with Node.js, Express, REST APIs and more.',
};

const techs = [
  {
    slug: 'nodejs', href: '/learn/nodejs/introduction', name: 'Node.js', icon: '🟢', color: '#339933', bg: '#F0FFF0',
    desc: 'Run JavaScript on the server. File system, HTTP, streams, and the Node.js ecosystem.',
    topics: 17, level: 'intermediate',
  },
  {
    slug: 'express', href: '/learn/express/introduction', name: 'Express.js', icon: '🚂', color: '#000000', bg: '#F8F8F8',
    desc: 'Fast, minimalist web framework for Node.js. Routing, middleware, authentication, and APIs.',
    topics: 15, level: 'intermediate',
  },
  {
    slug: 'restapi', href: '/learn/rest-api/01-introduction', name: 'REST APIs', icon: '🔌', color: '#FF6B35', bg: '#FFF8F5',
    desc: 'Design and build RESTful APIs. HTTP methods, status codes, authentication, and best practices.',
    topics: 10, level: 'beginner',
  },
];

const levelBadge: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
};

const concepts = [
  { icon: '🖥️', title: 'Server-side JS', desc: 'Node.js runtime & event loop' },
  { icon: '🛣️', title: 'Routing', desc: 'Handle URL paths and methods' },
  { icon: '🔗', title: 'Middleware', desc: 'Request/response pipeline' },
  { icon: '🔐', title: 'Authentication', desc: 'JWT, sessions, OAuth' },
  { icon: '📦', title: 'npm & Packages', desc: 'Node.js ecosystem' },
  { icon: '🔌', title: 'REST APIs', desc: 'Build HTTP APIs' },
  { icon: '⚠️', title: 'Error Handling', desc: 'Robust error management' },
  { icon: '🚀', title: 'Deployment', desc: 'Deploy to production' },
];

export default function BackendPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">⚙️</span>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Backend Development</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl leading-relaxed">
          Build powerful server-side applications and APIs with Node.js and Express — the most popular backend stack for JavaScript developers.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-lg font-bold text-foreground mb-5">What you will learn</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {concepts.map(s => (
            <div key={s.title} className="p-4 rounded-xl border border-border bg-background hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-sm transition-all">
              <div className="text-2xl mb-2">{s.icon}</div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{s.title}</h3>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-5">Backend Technologies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {techs.map(tech => (
            <Link
              key={tech.slug}
              href={tech.href}
              className="group flex items-start gap-4 p-5 rounded-xl border border-border bg-background hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: tech.bg }}>
                {tech.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{tech.name}</h3>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${levelBadge[tech.level]}`}>{tech.level}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">{tech.desc}</p>
                <p className="text-xs font-medium" style={{ color: tech.color }}>{tech.topics} topics</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
