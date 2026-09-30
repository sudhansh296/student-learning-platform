import { notFound } from 'next/navigation';
import { allPostgresqlLessons } from '@/data/postgresql-lessons/index';
import PostgresqlLessonClient from '@/components/postgresql/PostgresqlLessonClient';
import type { Metadata } from 'next';
import { lessonMetadata, withH1 } from '@/lib/seo';
import { LessonSeoExtras } from '@/components/seo/LessonSeoExtras';

interface Props { params: Promise<{ lesson: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lesson } = await params;
  const l = allPostgresqlLessons.find(x => x.slug === lesson);
  if (!l) return { title: 'Not Found' };
  return lessonMetadata('postgresql', l);
}

export default async function PostgresqlLessonPage({ params }: Props) {
  const { lesson } = await params;
  const all = allPostgresqlLessons;
  const lessonData = all.find(x => x.slug === lesson);
  if (!lessonData) notFound();
  return (
    <>
      <PostgresqlLessonClient
        lesson={withH1('postgresql', lessonData)}
        allLessons={all}
      />
      <LessonSeoExtras courseId="postgresql" lesson={lessonData} />
    </>
  );
}
