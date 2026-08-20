import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTechnologyBySlug } from '@/data/technologies';
import { Breadcrumb } from '@/components/docs/Breadcrumb';
import { Clock, ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ tech: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tech } = await params;
  const technology = getTechnologyBySlug(tech);
  if (!technology) return { title: 'Not Found' };
  return {
    title: `${technology.name} Tutorial & Documentation`,
    description: technology.longDescription || technology.description,
  };
}

const difficultyInfo = {
  beginner: { label: 'Beginner Friendly', color: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' },
  intermediate: { label: 'Intermediate', color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
  advanced: { label: 'Advanced', color: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800' },
};

export default async function TechOverviewPage({ params }: Props) {
  const { tech } = await params;
  const technology = getTechnologyBySlug(tech);

  if (!technology) notFound();

  const d = difficultyInfo[technology.difficulty];

  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-10">
      <Breadcrumb
        items={[
          { label: 'Learn', href: '/learn' },
          { label: technology.name },
        ]}
      />

      {/* Hero */}
      <div className="flex items-start gap-5 mb-10">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0 border border-border"
          style={{ backgroundColor: technology.bgColor }}
        >
          {technology.logo}
        </div>
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{technology.name}</h1>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${d.color}`}>
              {d.label}
            </span>
            {technology.isPopular && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                Popular
              </span>
            )}
          </div>
          <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
            {technology.longDescription || technology.description}
          </p>
        </div>
      </div>

      {/* Stats row */}
      {technology.yearCreated && (
        <div className="flex flex-wrap gap-6 mb-10 pb-10 border-b border-border">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Created</p>
            <p className="text-sm font-semibold text-foreground">{technology.yearCreated}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Topics</p>
            <p className="text-sm font-semibold text-foreground">{technology.topics.length} available</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Category</p>
            <p className="text-sm font-semibold text-foreground capitalize">{technology.subcategory || technology.category}</p>
          </div>
          {technology.prerequisites && technology.prerequisites.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Prerequisites</p>
              <div className="flex gap-1.5 mt-0.5">
                {technology.prerequisites.map(p => (
                  <Link
                    key={p}
                    href={`/learn/${p}`}
                    className="text-xs font-medium px-2 py-0.5 rounded bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors capitalize"
                  >
                    {p}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Topics list */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            All Topics
          </h2>
          <div className="space-y-2">
            {technology.topics.map((topic, index) => (
              <Link
                key={topic.id}
                href={
                  technology.id === 'javascript'
                    ? `/js/${topic.slug}`
                    : technology.id === 'html'
                    ? `/html/${topic.slug}`
                    : technology.id === 'css'
                    ? `/css/${topic.slug}`
                    : `/learn/${technology.slug}/${topic.slug}`
                }
                className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-background hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-sm transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-mono text-muted-foreground shrink-0">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{topic.description}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {topic.readingTime}m
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                </div>
              </Link>
            ))}
          </div>

          {/* Start learning CTA */}
          {technology.topics.length > 0 && (
            <Link
              href={
                technology.id === 'javascript'
                  ? `/js/${technology.topics[0].slug}`
                  : technology.id === 'html'
                  ? `/html/${technology.topics[0].slug}`
                  : technology.id === 'css'
                  ? `/css/${technology.topics[0].slug}`
                  : `/learn/${technology.slug}/${technology.topics[0].slug}`
              }
              className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors"
            >
              Start Learning {technology.name}
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* What you'll learn */}
          <div className="p-5 rounded-xl border border-border bg-background">
            <h3 className="font-semibold text-foreground mb-3 text-sm">What you&apos;ll learn</h3>
            <ul className="space-y-2">
              {technology.topics.slice(0, 6).map(t => (
                <li key={t.id} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-xs text-muted-foreground">{t.title}</span>
                </li>
              ))}
              {technology.topics.length > 6 && (
                <li className="text-xs text-muted-foreground pl-5">
                  ...and {technology.topics.length - 6} more topics
                </li>
              )}
            </ul>
          </div>

          {/* Related technologies */}
          {technology.relatedTechnologies && (
            <div className="p-5 rounded-xl border border-border bg-background">
              <h3 className="font-semibold text-foreground mb-3 text-sm">Related Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {technology.relatedTechnologies.map(slug => (
                  <Link
                    key={slug}
                    href={`/learn/${slug}`}
                    className="text-xs px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground border border-border transition-colors capitalize"
                  >
                    {slug}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
