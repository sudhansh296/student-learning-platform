import { notFound } from 'next/navigation';
import { allSqliteLessons } from '@/data/sqlite-lessons/index';
import SqliteLessonClient from '@/components/sqlite/SqliteLessonClient';
import type { Metadata } from 'next';
import { lessonMetadata, withH1 } from '@/lib/seo';
import { LessonSeoExtras } from '@/components/seo/LessonSeoExtras';

interface Props { params: Promise<{ lesson: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lesson } = await params;
  const l = allSqliteLessons.find(x => x.slug === lesson);
  if (!l) return { title: 'Not Found' };
  return lessonMetadata('sqlite', l);
}

export default async function SqliteLessonPage({ params }: Props) {
  const { lesson } = await params;
  const all = allSqliteLessons;
  const lessonData = all.find(x => x.slug === lesson);
  if (!lessonData) notFound();
  return (
    <>
      <SqliteLessonClient lesson={withH1('sqlite', lessonData)} allLessons={all} />
      <LessonSeoExtras courseId="sqlite" lesson={lessonData} />
    </>
  );
}
