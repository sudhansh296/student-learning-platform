import { notFound } from 'next/navigation';
import Link from 'next/link';
import { roadmaps } from '@/data/roadmaps';
import { Breadcrumb } from '@/components/docs/Breadcrumb';
import { Clock, CheckCircle2, Circle } from 'lucide-react';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const roadmap = roadmaps.find(r => r.slug === slug);
  if (!roadmap) return { title: 'Not Found' };
  return {
    title: `${roadmap.title} Roadmap`,
    description: roadmap.description
  };
}

export default async function RoadmapDetailPage({ params }: Props) {
  const { slug } = await params;
  const roadmap = roadmaps.find(r => r.slug === slug);
  if (!roadmap) notFound();

  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-10">
      <Breadcrumb items={[{ label: 'Roadmaps', href: '/roadmaps' }, { label: roadmap.title }]} />

      <div className="max-w-3xl">
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
            style={{ background: `${roadmap.color}20` }}
          >
            {roadmap.icon}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{roadmap.title} Roadmap</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {roadmap.estimatedTime}
              </span>
              <span className="text-xs text-muted-foreground capitalize">• {roadmap.difficulty}</span>
            </div>
          </div>
        </div>

        <p className="text-base text-muted-foreground leading-relaxed mb-10">{roadmap.description}</p>

        {/* Roadmap steps */}
        <div className="space-y-6">
          {roadmap.steps.map((step, phaseIndex) => (
            <div key={phaseIndex} className="relative">
              {/* Phase header */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold text-white shrink-0"
                  style={{ backgroundColor: step.color }}
                >
                  {phaseIndex + 1}
                </div>
                <h3 className="font-bold text-foreground">{step.phase}</h3>
              </div>

              {/* Phase items */}
              <div className="ml-11 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {step.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-center gap-2.5 p-3 rounded-lg border border-border bg-background hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
                  >
                    <Circle className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                    <span className="text-sm text-foreground/90">{item}</span>
                  </div>
                ))}
              </div>

              {/* Connector */}
              {phaseIndex < roadmap.steps.length - 1 && (
                <div className="ml-4 mt-3 mb-0 w-0.5 h-4 bg-border" />
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 p-6 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30">
          <h3 className="font-bold text-foreground mb-2">Ready to start?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Begin your {roadmap.title} journey with the foundational topics.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link
              href="/html"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
            >
              Start with HTML
            </Link>
            <Link
              href="/js"
              className="px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted/60 text-sm font-medium text-foreground transition-colors"
            >
              Jump to JavaScript
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
