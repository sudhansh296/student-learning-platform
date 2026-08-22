import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DevOps & Tools — WebDev Atlas',
  description: 'Learn Git, Docker, version control, and developer tooling.',
};

const techs = [
  {
    slug: 'git', href: '/learn/git/01-introduction', name: 'Git', icon: '🌿', color: '#F05032', bg: '#FFF5F0',
    desc: 'Version control every developer needs. Branching, merging, remotes, GitHub workflow, and collaboration.',
    topics: 10, level: 'beginner',
  },
  {
    slug: 'docker', href: '/learn/docker/01-introduction', name: 'Docker', icon: '🐳', color: '#2496ED', bg: '#F0F8FF',
    desc: 'Package and run applications in containers. Images, volumes, networking, Docker Compose, and deployment.',
    topics: 11, level: 'intermediate',
  },
];

const levelBadge: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
};

const concepts = [
  { icon: '📝', title: 'Version Control', desc: 'Track changes to your code' },
  { icon: '🌿', title: 'Branching', desc: 'Work on features in isolation' },
  { icon: '🤝', title: 'Collaboration', desc: 'Work with teams on GitHub' },
  { icon: '📦', title: 'Containers', desc: 'Portable app packaging' },
  { icon: '🔄', title: 'CI/CD', desc: 'Automated build & deploy pipelines' },
  { icon: '🌐', title: 'Networking', desc: 'Container communication' },
  { icon: '💾', title: 'Volumes', desc: 'Persistent container storage' },
  { icon: '🚢', title: 'Deployment', desc: 'Ship apps anywhere' },
];

export default function DevOpsPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">🚀</span>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">DevOps & Tools</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl leading-relaxed">
          Master the tools that professional developers use every day — version control with Git and containerization with Docker.
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
        <h2 className="text-lg font-bold text-foreground mb-5">DevOps Technologies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
