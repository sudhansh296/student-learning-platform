'use client';

import { useEffect, useState } from 'react';
import { ContentSection } from '@/lib/types';

interface TableOfContentsProps {
  sections: ContentSection[];
}

export function TableOfContents({ sections }: TableOfContentsProps) {
  const [active, setActive] = useState('');

  const headings = sections
    .filter(s => s.type === 'heading' && s.content)
    .map(s => ({
      id: (s.content || '').toLowerCase().replace(/\s+/g, '-'),
      title: s.content || ''
    }));

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-80px 0px -60% 0px' }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside className="w-52 shrink-0">
      <div className="sticky top-20">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          On this page
        </p>
        <nav>
          <ul className="space-y-1">
            {headings.map(({ id, title }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`block text-xs py-1 px-2 rounded transition-colors leading-snug ${
                    active === id
                      ? 'text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-950/60'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
