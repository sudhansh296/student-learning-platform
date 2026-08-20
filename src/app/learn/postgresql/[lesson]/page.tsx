import { notFound } from 'next/navigation';
import { allPostgresqlLessons } from '@/data/postgresql-lessons/index';
import { PostgresqlChapters } from '@/data/postgresql-curriculum';
import PostgresqlLessonClient from '@/components/postgresql/PostgresqlLessonClient';
import type { Metadata } from 'next';

interface Props { params: Promise<{ lesson: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lesson } = await params;
  const l = allPostgresqlLessons.find(x => x.slug === lesson);
  if (!l) return { title: 'Not Found' };
  return { title: `${l.title} - PostgreSQL Tutorial`, description: l.description };
}

export default async function PostgresqlLessonPage({ params }: Props) {
  const { lesson } = await params;
  const all = allPostgresqlLessons;
  const lessonData = all.find(x => x.slug === lesson);
  if (!lessonData) notFound();
  return (
    <PostgresqlLessonClient
      lesson={lessonData}
      allLessons={all}
    />
  );
}
