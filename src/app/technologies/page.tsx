import Link from 'next/link';
import { technologies } from '@/data/technologies';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Technology Directory',
  description: 'Browse every web technology — frameworks, libraries, databases, and tools.'
};

const categoryConfig = [
  { id: 'language', label: 'Languages', icon: '📝', filter: (t: typeof technologies[0]) => t.category === 'language' },
  { id: 'framework', label: 'Frameworks', icon: '🏗️', filter: (t: typeof technologies[0]) => t.category === 'framework' },
  { id: 'backend', label: 'Backend', icon: '⚙️', filter: (t: typeof technologies[0]) => t.category === 'backend' },
  { id: 'database', label: 'Databases', icon: '🗄️', filter: (t: typeof technologies[0]) => t.category === 'database' },
  { id: 'api', label: 'APIs', icon: '🔗', filter: (t: typeof technologies[0]) => t.category === 'api' },
  { id: 'devops', label: 'DevOps', icon: '🚀', filter: (t: typeof technologies[0]) => t.category === 'devops' },
  { id: 'tools', label: 'Tools', icon: '🛠️', filter: (t: typeof technologies[0]) => t.category === 'tools' },
];

const difficultyBadge = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  advanced: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
};

export default function TechnologiesPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-3">Technology Directory</h1>
        <p className="text-muted-foreground max-w-xl leading-relaxed">
          Every major web technology — organized by category, with clear descriptions and learning paths.
        </p>
      </div>

      <div className="space-y-12">
        {categoryConfig.map(({ id, label, icon, filter }) => {
          const techs = technologies.filter(filter);
          if (techs.length === 0) return null;

          return (
            <section key={id}>
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xl">{icon}</span>
                <h2 className="text-lg font-bold text-foreground">{label}</h2>
                <span className="text-xs text-muted-foreground ml-1">{techs.length} technologies</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {techs.map(tech => (
                  <Link
                    key={tech.id}
                    href={tech.id === 'html' ? '/html' : `/learn/${tech.slug}`}
                    className="group flex flex-col p-5 rounded-xl border border-border bg-background hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
                        style={{ backgroundColor: tech.bgColor }}
                      >
                        {tech.logo}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {tech.name}
                        </h3>
                        {tech.yearCreated && (
                          <p className="text-xs text-muted-foreground">Since {tech.yearCreated}</p>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3 flex-1">
                      {tech.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${difficultyBadge[tech.difficulty]}`}>
                        {tech.difficulty}
                      </span>
                      <span className="text-xs text-muted-foreground">{tech.topics.length} topics</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
