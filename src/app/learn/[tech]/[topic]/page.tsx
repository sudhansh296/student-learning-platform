import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTechnologyBySlug, getTopicBySlug } from '@/data/technologies';
import { Breadcrumb } from '@/components/docs/Breadcrumb';
import { ContentRenderer } from '@/components/docs/ContentRenderer';
import { DocSidebar } from '@/components/docs/DocSidebar';
import { TableOfContents } from '@/components/docs/TableOfContents';
import { Clock, Calendar, ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown } from 'lucide-react';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ tech: string; topic: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tech, topic } = await params;
  const technology = getTechnologyBySlug(tech);
  const topicData = getTopicBySlug(tech, topic);
  if (!technology || !topicData) return { title: 'Not Found' };
  return {
    title: `${topicData.title} — ${technology.name}`,
    description: topicData.description,
  };
}

const difficultyBadge = {
  beginner: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400',
  intermediate: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400',
  advanced: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400',
};

export default async function TopicPage({ params }: Props) {
  const { tech, topic } = await params;
  const technology = getTechnologyBySlug(tech);
  const topicData = getTopicBySlug(tech, topic);

  if (!technology || !topicData) notFound();

  const currentIndex = technology.topics.findIndex(t => t.slug === topic);
  const prevTopic = currentIndex > 0 ? technology.topics[currentIndex - 1] : null;
  const nextTopic = currentIndex < technology.topics.length - 1 ? technology.topics[currentIndex + 1] : null;

  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-6">
      <div className="flex gap-8 py-8">
        {/* Left sidebar */}
        <DocSidebar technology={technology} />

        {/* Main content */}
        <article className="flex-1 min-w-0">
          <Breadcrumb
            items={[
              { label: 'Learn', href: '/learn' },
              { label: technology.name, href: `/learn/${technology.slug}` },
              { label: topicData.title },
            ]}
          />

          {/* Article header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-3 leading-tight">
              {topicData.title}
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">
              {topicData.description}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${difficultyBadge[topicData.difficulty]}`}>
                {topicData.difficulty}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {topicData.readingTime} min read
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                Updated {topicData.lastUpdated}
              </span>
            </div>
          </div>

          {/* Content */}
          <ContentRenderer sections={topicData.content} />

          {/* Tags */}
          {topicData.tags && (
            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex flex-wrap gap-2">
                {topicData.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Feedback */}
          <div className="mt-8 p-5 rounded-xl border border-border bg-muted/30">
            <p className="text-sm font-medium text-foreground mb-3">Was this explanation helpful?</p>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-green-50 dark:hover:bg-green-950/40 hover:border-green-300 dark:hover:border-green-700 text-sm text-muted-foreground hover:text-green-700 dark:hover:text-green-400 transition-all">
                <ThumbsUp className="w-4 h-4" />
                Yes, helpful
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-red-50 dark:hover:bg-red-950/40 hover:border-red-300 dark:hover:border-red-700 text-sm text-muted-foreground hover:text-red-700 dark:hover:text-red-400 transition-all">
                <ThumbsDown className="w-4 h-4" />
                Needs improvement
              </button>
            </div>
          </div>

          {/* Prev/Next navigation */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            {prevTopic ? (
              <Link
                href={`/learn/${technology.slug}/${prevTopic.slug}`}
                className="group flex items-center gap-3 p-4 rounded-xl border border-border hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-sm transition-all bg-background"
              >
                <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-blue-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Previous</p>
                  <p className="text-sm font-medium text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                    {prevTopic.title}
                  </p>
                </div>
              </Link>
            ) : <div />}

            {nextTopic ? (
              <Link
                href={`/learn/${technology.slug}/${nextTopic.slug}`}
                className="group flex items-center justify-end gap-3 p-4 rounded-xl border border-border hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-sm transition-all bg-background text-right"
              >
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Next</p>
                  <p className="text-sm font-medium text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                    {nextTopic.title}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-blue-500 shrink-0" />
              </Link>
            ) : <div />}
          </div>
        </article>

        {/* Table of contents */}
        <div className="hidden xl:block">
          <TableOfContents sections={topicData.content} />
        </div>
      </div>
    </div>
  );
}
