import Link from 'next/link';
import { technologies } from '@/data/technologies';
import { BookOpen, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reference',
  description: 'Quick-lookup reference for HTML, CSS, JavaScript, TypeScript, and every other technology on WebDevAtlas — tags, properties, syntax, and cheat sheets in one place.',
};

function referenceTopicFor(tech: (typeof technologies)[number]) {
  return tech.topics.find(
    t => t.title.toLowerCase().includes('reference') || t.slug.toLowerCase().includes('reference')
  );
}

function referenceHref(tech: (typeof technologies)[number], topicSlug: string) {
  if (tech.id === 'javascript') return `/js/${topicSlug}`;
  if (tech.id === 'html') return `/html/${topicSlug}`;
  if (tech.id === 'css') return `/css/${topicSlug}`;
  return `/learn/${tech.slug}/${topicSlug}`;
}

export default function ReferencePage() {
  const withRef = technologies
    .map(tech => ({ tech, topic: referenceTopicFor(tech) }))
    .filter((x): x is { tech: (typeof technologies)[number]; topic: NonNullable<ReturnType<typeof referenceTopicFor>> } => !!x.topic);
  const withoutRef = technologies.filter(tech => !referenceTopicFor(tech));

  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-12">
      <div className="mb-10 flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
          <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-2">Reference</h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            Skip the tutorial — jump straight to tags, properties, syntax tables, and cheat sheets for every
            technology on WebDevAtlas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {withRef.map(({ tech, topic }) => (
          <Link
            key={tech.id}
            href={referenceHref(tech, topic.slug)}
            className="group flex flex-col p-5 rounded-xl border border-border bg-background hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
                style={{ backgroundColor: tech.bgColor }}
              >
                {tech.logo}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {tech.name}
                </h3>
                <p className="text-xs text-muted-foreground truncate">{topic.title}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-auto pt-2">
              <span className="text-xs text-muted-foreground">Quick lookup</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
            </div>
          </Link>
        ))}
      </div>

      {withoutRef.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Coming soon</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {withoutRef.map(tech => (
              <div
                key={tech.id}
                className="flex items-center gap-3 p-5 rounded-xl border border-dashed border-border opacity-60"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
                  style={{ backgroundColor: tech.bgColor }}
                >
                  {tech.logo}
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground">{tech.name}</h3>
                  <p className="text-xs text-muted-foreground">Reference page not published yet</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
