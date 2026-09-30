import { notFound } from 'next/navigation';
import { allSqlLessons } from '@/data/sql-lessons/index';
import SqlLessonClient from '@/components/sql/SqlLessonClient';
import type { Metadata } from 'next';
import { lessonMetadata, withH1 } from '@/lib/seo';
import { LessonSeoExtras } from '@/components/seo/LessonSeoExtras';

interface Props { params: Promise<{ lesson: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lesson } = await params;
  const l = allSqlLessons.find(x => x.slug === lesson);
  if (!l) return { title: 'Not Found' };
  return lessonMetadata('sql', l);
}

export default async function SqlLessonPage({ params }: Props) {
  const { lesson } = await params;
  const all = allSqlLessons;
  const lessonData = all.find(x => x.slug === lesson);
  if (!lessonData) notFound();
  return (
    <>
      <SqlLessonClient lesson={withH1('sql', lessonData)} allLessons={all} />
      <LessonSeoExtras courseId="sql" lesson={lessonData} />
    </>
  );
}
