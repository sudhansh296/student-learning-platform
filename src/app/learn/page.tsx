import Link from 'next/link';
import { technologies } from '@/data/technologies';

export const metadata = {
  title: 'Learn Web Development',
  description: 'Browse all web development topics and technologies.'
};

const categoryGroups = [
  { label: 'Core Languages', filter: (t: typeof technologies[0]) => ['html', 'css', 'javascript', 'typescript'].includes(t.id) },
  { label: 'Frontend Frameworks', filter: (t: typeof technologies[0]) => ['react', 'nextjs'].includes(t.id) },
  { label: 'Backend', filter: (t: typeof technologies[0]) => ['nodejs', 'express'].includes(t.id) },
  { label: 'Databases', filter: (t: typeof technologies[0]) => ['mongodb', 'postgresql'].includes(t.id) },
  { label: 'APIs & Protocols', filter: (t: typeof technologies[0]) => ['restapi'].includes(t.id) },
  { label: 'DevOps & Tools', filter: (t: typeof technologies[0]) => ['git', 'docker'].includes(t.id) },
];

export default function LearnPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-12">
      <div className="max-w-2xl mb-10">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-3">Learn Web Development</h1>
        <p className="text-muted-foreground leading-relaxed">
          Everything you need to go from beginner to professional — organized by technology and topic.
        </p>
      </div>

      <div className="space-y-10">
        {categoryGroups.map(({ label, filter }) => {
          const techs = technologies.filter(filter);
          if (techs.length === 0) return null;
          return (
            <div key={label}>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">{label}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {techs.map(tech => (
                  <Link
                    key={tech.id}
                    href={
                      tech.id === 'html' ? '/html' :
                      tech.id === 'css' ? '/css' :
                      tech.id === 'javascript' ? '/js' :
                      `/learn/${tech.slug}`
                    }
                    className="group flex items-center gap-3 p-4 rounded-xl border border-border bg-background hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-sm transition-all"
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xl shrink-0" style={{ backgroundColor: tech.bgColor }}>
                      {tech.logo}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {tech.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{tech.topics.length} topics</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
