import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Core Languages — WebDev Atlas',
  description: 'Learn HTML, CSS, JavaScript and TypeScript — the foundation of all web development.',
};

const techs = [
  {
    slug: 'html', href: '/html', name: 'HTML', icon: '🌐', color: '#E34F26', bg: '#FFF4F0',
    desc: 'The structure of every web page. Elements, attributes, semantic HTML, forms, tables, and accessibility.',
    topics: 19, level: 'beginner',
  },
  {
    slug: 'css', href: '/css', name: 'CSS', icon: '🎨', color: '#264DE4', bg: '#F0F4FF',
    desc: 'Style the web with colors, fonts, layouts. Flexbox, Grid, animations, and responsive design.',
    topics: 10, level: 'beginner',
  },
  {
    slug: 'javascript', href: '/js', name: 'JavaScript', icon: '⚡', color: '#F7DF1E', bg: '#FFFEF0',
    desc: 'The language of the web. Variables, functions, DOM, async/await, closures, and modern ES6+ features.',
    topics: 30, level: 'beginner',
  },
  {
    slug: 'typescript', href: '/learn/typescript/introduction', name: 'TypeScript', icon: '🔷', color: '#3178C6', bg: '#F0F7FF',
    desc: 'JavaScript with types. Catch bugs early, write cleaner APIs, and scale your codebase confidently.',
    topics: 18, level: 'intermediate',
  },
];

const levelBadge: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
};

const path = [
  { step: '1', label: 'Start with HTML', desc: 'Learn to structure web content', icon: '🌐' },
  { step: '2', label: 'Add CSS', desc: 'Make it look great', icon: '🎨' },
  { step: '3', label: 'JavaScript', desc: 'Make it interactive', icon: '⚡' },
  { step: '4', label: 'TypeScript', desc: 'Scale with confidence', icon: '🔷' },
];

export default function CoreLanguagesPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">💻</span>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Core Languages</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl leading-relaxed">
          The foundation of all web development. Master these four technologies and you can build anything on the web.
        </p>
      </div>

      {/* Learning path */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-foreground mb-5">Recommended learning path</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {path.map((p, i) => (
            <div key={p.step} className="relative flex flex-col items-center text-center p-4 rounded-xl border border-border bg-background">
              {i < path.length - 1 && (
                <div className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 text-muted-foreground text-lg">→</div>
              )}
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold mb-2">{p.step}</div>
              <div className="text-2xl mb-1">{p.icon}</div>
              <p className="text-sm font-semibold text-foreground">{p.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Technologies */}
      <section>
        <h2 className="text-lg font-bold text-foreground mb-5">Core Technologies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {techs.map(tech => (
            <Link
              key={tech.slug}
              href={tech.href}
              className="group flex items-start gap-4 p-5 rounded-xl border border-border bg-background hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md transition-all"
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0" style={{ backgroundColor: tech.bg }}>
                {tech.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-lg">{tech.name}</h3>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${levelBadge[tech.level]}`}>{tech.level}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-2">{tech.desc}</p>
                <p className="text-xs font-medium" style={{ color: tech.color }}>{tech.topics} topics →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
