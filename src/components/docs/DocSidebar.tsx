'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { Technology } from '@/lib/types';

interface DocSidebarProps {
  technology: Technology;
}

const difficultyColor = {
  beginner: 'text-green-600 dark:text-green-400',
  intermediate: 'text-blue-600 dark:text-blue-400',
  advanced: 'text-orange-600 dark:text-orange-400',
};

export function DocSidebar({ technology }: DocSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0">
      <div className="sticky top-20 overflow-y-auto max-h-[calc(100vh-5rem)]">
        {/* Tech header */}
        <div className="mb-4 pb-4 border-b border-border">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{technology.logo}</span>
            <div>
              <h2 className="font-bold text-foreground text-sm">{technology.name}</h2>
              <span className={`text-xs font-medium capitalize ${difficultyColor[technology.difficulty]}`}>
                {technology.difficulty}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            {technology.description}
          </p>
        </div>

        {/* Topics list */}
        <nav>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2 px-2">
            Topics
          </p>
          <ul className="space-y-0.5">
            {technology.topics.map((topic) => {
              const href = `/learn/${technology.slug}/${topic.slug}`;
              const isActive = pathname === href;

              return (
                <li key={topic.id}>
                  <Link
                    href={href}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors group ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    }`}
                  >
                    <span className="truncate">{topic.title}</span>
                    {isActive && <ChevronRight className="w-3 h-3 shrink-0" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Related technologies */}
        {technology.relatedTechnologies && technology.relatedTechnologies.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2 px-2">
              Related
            </p>
            <div className="flex flex-wrap gap-1.5 px-2">
              {technology.relatedTechnologies.map(slug => (
                <Link
                  key={slug}
                  href={`/learn/${slug}`}
                  className="text-xs px-2 py-1 rounded-md bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors capitalize"
                >
                  {slug}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
