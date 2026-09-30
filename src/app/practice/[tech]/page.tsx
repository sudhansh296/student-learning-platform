import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPracticeTech, combinedQuiz, quizCount } from '@/data/practice-index';
import { Breadcrumb } from '@/components/docs/Breadcrumb';
import { QuizBlock } from '@/components/docs/QuizBlock';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ tech: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tech: slug } = await params;
  const tech = getPracticeTech(slug);
  if (!tech) return { title: 'Not Found' };
  return {
    title: `${tech.name} Practice Quiz`,
    description: `Test your ${tech.name} knowledge with a quick multiple-choice quiz — instant scoring and explanations.`,
  };
}

export default async function PracticeTechPage({ params }: Props) {
  const { tech: slug } = await params;
  const tech = getPracticeTech(slug);
  if (!tech) notFound();

  const total = quizCount(tech);
  if (total === 0) notFound();

  const questions = combinedQuiz(tech, 15);

  return (
    <div className="max-w-screen-md mx-auto px-4 lg:px-6 py-10">
      <Breadcrumb items={[{ label: 'Practice', href: '/practice' }, { label: tech.name }]} />

      <div className="flex items-center gap-3 mb-2 mt-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
          style={{ backgroundColor: tech.bgColor }}
        >
          {tech.logo}
        </div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">{tech.name} Practice Quiz</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        {questions.length} questions, randomly pulled from {total} across every {tech.name} lesson.{' '}
        <Link href={tech.href} className="text-purple-600 dark:text-purple-400 hover:underline">
          Browse the full {tech.name} tutorial →
        </Link>
      </p>

      <QuizBlock questions={questions} title={`${tech.name} Quiz`} />
    </div>
  );
}
