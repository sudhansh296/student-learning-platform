import { notFound } from 'next/navigation';
import { allSqliteLessons } from '@/data/sqlite-lessons/index';
import SqliteLessonClient from '@/components/sqlite/SqliteLessonClient';
import type { Metadata } from 'next';

interface Props { params: Promise<{ lesson: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lesson } = await params;
  const l = allSqliteLessons.find(x => x.slug === lesson);
  if (!l) return { title: 'Not Found' };
  return { title: `${l.title} - SQLite Tutorial`, description: l.description };
}

export default async function SqliteLessonPage({ params }: Props) {
  const { lesson } = await params;
  const all = allSqliteLessons;
  const lessonData = all.find(x => x.slug === lesson);
  if (!lessonData) notFound();
  return <SqliteLessonClient lesson={lessonData} allLessons={all} />;
}
