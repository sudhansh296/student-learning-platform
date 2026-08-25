import Link from 'next/link';
import { Clock, ArrowRight, Terminal } from 'lucide-react';
import type { Metadata } from 'next';
import { allProjects } from '@/data/projects';

export const metadata: Metadata = {
  title: 'Projects — Build Real Apps',
  description: 'Project ideas for beginner, intermediate, and advanced developers. Learn by building.',
};

// Map projects to the simplified format needed for the page
const projects = allProjects.map(p => ({
  id: p.id,
  title: p.title,
  slug: p.slug,
  difficulty: p.difficulty,
  estimatedTime: p.estimatedTime,
  technologies: p.technologies,
  description: p.description,
  learnings: p.learnings,
  playgroundKey: p.playgroundKey,
}));

const difficultyConfig = {
  beginner: { label: 'Beginner', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border-green-200 dark:border-green-800' },
  intermediate: { label: 'Intermediate', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
  advanced: { label: 'Advanced', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400 border-orange-200 dark:border-orange-800' },
};

type Project = typeof projects[0] & { playgroundKey?: string };

export default function ProjectsPage() {
  const grouped = {
    beginner: projects.filter(p => p.difficulty === 'beginner') as Project[],
    intermediate: projects.filter(p => p.difficulty === 'intermediate') as Project[],
    advanced: projects.filter(p => p.difficulty === 'advanced') as Project[],
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-3">Project Ideas</h1>
        <p className="text-muted-foreground max-w-xl leading-relaxed">
          The fastest way to learn is by building. Each project teaches real skills used in professional development.
        </p>
      </div>

      {(Object.entries(grouped) as [keyof typeof grouped, Project[]][]).map(([level, items]) => (
        <section key={level} className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${difficultyConfig[level].color}`}>
              {difficultyConfig[level].label}
            </span>
            <span className="text-xs text-muted-foreground">{items.length} projects</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(project => (
              <div
                key={project.id}
                className="group flex flex-col p-5 rounded-xl border border-border bg-background hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-foreground text-base leading-snug">{project.title}</h3>
                    {project.playgroundKey && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border border-green-200 dark:border-green-800 whitespace-nowrap">
                        Live
                      </span>
                    )}
                  </div>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap shrink-0">
                    <Clock className="w-3 h-3" />
                    {project.estimatedTime}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                  {project.description}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.technologies.map(tech => (
                    <span
                      key={tech}
                      className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Learnings */}
                <div className="mb-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    You will learn
                  </p>
                  <ul className="space-y-1">
                    {project.learnings.slice(0, 3).map(l => (
                      <li key={l} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="w-1 h-1 rounded-full bg-blue-400 shrink-0" />
                        {l}
                      </li>
                    ))}
                    {project.learnings.length > 3 && (
                      <li className="text-xs text-muted-foreground pl-3">
                        +{project.learnings.length - 3} more
                      </li>
                    )}
                  </ul>
                </div>

                {/* Button — All projects go to detail page first */}
                <Link
                  href={'/projects/' + project.slug}
                  className="mt-auto flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
                >
                  Open Project
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
