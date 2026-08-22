import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frontend Development — WebDev Atlas',
  description: 'Learn frontend development with HTML, CSS, JavaScript, React, and Next.js.',
};

const techs = [
  {
    slug: 'html', href: '/html', name: 'HTML', icon: '🌐', color: '#E34F26', bg: '#FFF4F0',
    desc: 'The foundation of every web page. Learn structure, semantic elements, forms, and accessibility.',
    topics: 19, level: 'beginner',
  },
  {
    slug: 'css', href: '/css', name: 'CSS', icon: '🎨', color: '#264DE4', bg: '#F0F4FF',
    desc: 'Style and layout — Flexbox, Grid, animations, responsive design, and modern CSS features.',
    topics: 10, level: 'beginner',
  },
  {
    slug: 'javascript', href: '/js', name: 'JavaScript', icon: '⚡', color: '#F7DF1E', bg: '#FFFEF0',
    desc: 'The language of the web. DOM, async/await, closures, modules, and ES6+ features.',
    topics: 30, level: 'beginner',
  },
  {
    slug: 'typescript', href: '/learn/typescript/introduction', name: 'TypeScript', icon: '🔷', color: '#3178C6', bg: '#F0F7FF',
    desc: 'Add static types to JavaScript. Catch errors early and write safer, cleaner code.',
    topics: 18, level: 'intermediate',
  },
  {
    slug: 'react', href: '/learn/react/introduction', name: 'React', icon: '⚛️', color: '#61DAFB', bg: '#F0FEFF',
    desc: 'Build fast, component-based UIs. Hooks, state management, routing, and best practices.',
    topics: 20, level: 'intermediate',
  },
  {
    slug: 'nextjs', href: '/learn/nextjs/introduction', name: 'Next.js', icon: '▲', color: '#000000', bg: '#F5F5F5',
    desc: 'The React framework for production. SSR, SSG, App Router, API routes, and deployment.',
    topics: 18, level: 'intermediate',
  },
];

const levelBadge: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
};

const skills = [
  { icon: '🏗️', title: 'HTML Structure', desc: 'Semantic markup & accessibility' },
  { icon: '💅', title: 'CSS Layouts', desc: 'Flexbox, Grid & responsive design' },
  { icon: '⚡', title: 'JavaScript', desc: 'Interactivity & DOM manipulation' },
  { icon: '🔷', title: 'TypeScript', desc: 'Type-safe JavaScript development' },
  { icon: '⚛️', title: 'React', desc: 'Component-based UI development' },
  { icon: '▲', title: 'Next.js', desc: 'Full-stack React applications' },
  { icon: '📱', title: 'Responsive Design', desc: 'Mobile-first development' },
  { icon: '♿', title: 'Accessibility', desc: 'Build for everyone' },
];

export default function FrontendPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">🎨</span>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Frontend Development</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl leading-relaxed">
          Everything you need to build beautiful, fast, and accessible web interfaces — from HTML basics to production React apps.
        </p>
      </div>

      {/* Skills overview */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-foreground mb-5">What you will learn</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {skills.map(s => (
            <div key={s.title} className="p-4 rounded-xl border border-border bg-background hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-sm transition-all">
              <div className="text-2xl mb-2">{s.icon}</div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{s.title}</h3>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Technologies */}
      <section>
        <h2 className="text-lg font-bold text-foreground mb-5">Frontend Technologies</h2>
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
