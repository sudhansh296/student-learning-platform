import { notFound } from 'next/navigation';
import { allSqlLessons } from '@/data/sql-lessons/index';
import SqlLessonClient from '@/components/sql/SqlLessonClient';
import type { Metadata } from 'next';

interface Props { params: Promise<{ lesson: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lesson } = await params;
  const l = allSqlLessons.find(x => x.slug === lesson);
  if (!l) return { title: 'Not Found' };
  return { title: `${l.title} - SQL Tutorial`, description: l.description };
}

export default async function SqlLessonPage({ params }: Props) {
  const { lesson } = await params;
  const all = allSqlLessons;
  const lessonData = all.find(x => x.slug === lesson);
  if (!lessonData) notFound();
  return <SqlLessonClient lesson={lessonData} allLessons={all} />;
}
