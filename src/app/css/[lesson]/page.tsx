import { notFound } from 'next/navigation';
import { cssChapters } from '@/data/css-curriculum';
import { cssLessons } from '@/data/css-lessons/index';
import { CssLessonClient } from '@/components/css/CssLessonClient';
import type { Metadata } from 'next';
import { lessonMetadata, withH1 } from '@/lib/seo';
import { LessonSeoExtras } from '@/components/seo/LessonSeoExtras';

interface Props { params: Promise<{ lesson: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lesson } = await params;
  const l = cssLessons.find(x => x.slug === lesson);
  if (!l) return { title: 'Not Found' };
  return lessonMetadata('css', l);
}

export default async function CssLessonPage({ params }: Props) {
  const { lesson } = await params;
  const lessonData = cssLessons.find(x => x.slug === lesson);
  if (!lessonData) notFound();

  const idx  = cssLessons.findIndex(x => x.slug === lesson);
  const prev = idx > 0 ? cssLessons[idx - 1] : null;
  const next = idx < cssLessons.length - 1 ? cssLessons[idx + 1] : null;

  return (
    <>
      <CssLessonClient lesson={withH1('css', lessonData)} allLessons={cssLessons} chapters={cssChapters} prev={prev} next={next} />
      <LessonSeoExtras courseId="css" lesson={lessonData} />
    </>
  );
}
