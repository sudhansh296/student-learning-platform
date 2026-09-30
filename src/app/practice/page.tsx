import Link from 'next/link';
import { GuideLinks } from '@/components/seo/GuideLinks';
import { HUB } from '@/lib/seo';
import { PRACTICE_TECHS, quizCount } from '@/data/practice-index';
import { Target, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Practice Quizzes',
  description: 'Test yourself with quick multiple-choice quizzes for HTML, CSS, JavaScript, and every other technology on WebDevAtlas — instant scoring and explanations.',
};

export default function PracticePage() {
  const techs = PRACTICE_TECHS.map(tech => ({ tech, count: quizCount(tech) })).filter(x => x.count > 0);

  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-12">
      <div className="mb-10 flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800">
          <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-2">Practice Quizzes</h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            Pick a technology and take a quick multiple-choice quiz pulled from across every lesson —
            instant scoring, explanations for every answer.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {techs.map(({ tech, count }) => (
          <Link
            key={tech.id}
            href={`/practice/${tech.slug}`}
            className="group flex flex-col p-5 rounded-xl border border-border bg-background hover:border-purple-200 dark:hover:border-purple-800 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
                style={{ backgroundColor: tech.bgColor }}
              >
                {tech.logo}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {tech.name}
                </h3>
                <p className="text-xs text-muted-foreground">{count} quiz questions</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-auto pt-2">
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">Attempt Now</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-purple-500 transition-colors" />
            </div>
          </Link>
        ))}
      </div>
      <section className="mt-12">
        <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
          <GuideLinks title="More ways to practise" links={[HUB.jsPractice, HUB.jsInterview, HUB.jsCheat, HUB.hooksCheat]} />
        </div>
      </section>
    </div>
  );
}
