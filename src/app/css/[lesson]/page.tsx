import { notFound } from 'next/navigation';
import { cssChapters } from '@/data/css-curriculum';
import { cssLessons } from '@/data/css-lessons/index';
import { CssLessonClient } from '@/components/css/CssLessonClient';
import type { Metadata } from 'next';

interface Props { params: Promise<{ lesson: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lesson } = await params;
  const l = cssLessons.find(x => x.slug === lesson);
  if (!l) return { title: 'Not Found' };
  return { title: `${l.title} — CSS Tutorial`, description: l.description };
}

export default async function CssLessonPage({ params }: Props) {
  const { lesson } = await params;
  const lessonData = cssLessons.find(x => x.slug === lesson);
  if (!lessonData) notFound();

  const idx  = cssLessons.findIndex(x => x.slug === lesson);
  const prev = idx > 0 ? cssLessons[idx - 1] : null;
  const next = idx < cssLessons.length - 1 ? cssLessons[idx + 1] : null;

  return <CssLessonClient lesson={lessonData} allLessons={cssLessons} chapters={cssChapters} prev={prev} next={next} />;
}
