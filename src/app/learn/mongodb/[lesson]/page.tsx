import { notFound } from 'next/navigation';
import { allMongodbLessons } from '@/data/mongodb-lessons/index';
import MongodbLessonClient from '@/components/mongodb/MongodbLessonClient';
import type { Metadata } from 'next';
import { lessonMetadata, withH1 } from '@/lib/seo';
import { LessonSeoExtras } from '@/components/seo/LessonSeoExtras';

interface Props { params: Promise<{ lesson: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lesson } = await params;
  const l = allMongodbLessons.find(x => x.slug === lesson);
  if (!l) return { title: 'Not Found' };
  return lessonMetadata('mongodb', l);
}

export default async function MongodbLessonPage({ params }: Props) {
  const { lesson } = await params;
  const all = allMongodbLessons;
  const lessonData = all.find(x => x.slug === lesson);
  if (!lessonData) notFound();
  return (
    <>
      <MongodbLessonClient
        lesson={withH1('mongodb', lessonData)}
        allLessons={all}
      />
      <LessonSeoExtras courseId="mongodb" lesson={lessonData} />
    </>
  );
}
