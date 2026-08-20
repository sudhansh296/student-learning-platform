import Link from 'next/link';
import { roadmaps } from '@/data/roadmaps';
import { Clock, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Developer Roadmaps',
  description: 'Structured learning paths from beginner to job-ready developer.'
};

export default function RoadmapsPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-3">Learning Roadmaps</h1>
        <p className="text-muted-foreground max-w-xl leading-relaxed">
          Step-by-step paths to go from beginner to professional. Each roadmap shows exactly what to learn and in what order.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roadmaps.map((roadmap) => (
          <Link
            key={roadmap.id}
            href={`/roadmaps/${roadmap.slug}`}
            className="group p-6 rounded-xl border border-border bg-background hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start gap-4 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{ background: `${roadmap.color}20` }}
              >
                {roadmap.icon}
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {roadmap.title}
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">{roadmap.description}</p>
              </div>
            </div>

            {/* Phase steps */}
            <div className="flex items-center gap-0 mb-4 overflow-hidden">
              {roadmap.steps.map((step, i) => (
                <div key={i} className="flex items-center gap-0 min-w-0">
                  <div className="flex flex-col items-center min-w-0">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: step.color }}
                    />
                    <span className="text-[9px] text-muted-foreground mt-1 whitespace-nowrap">{step.phase}</span>
                  </div>
                  {i < roadmap.steps.length - 1 && (
                    <div className="h-0.5 flex-1 mx-1 bg-border min-w-[12px]" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {roadmap.estimatedTime}
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
