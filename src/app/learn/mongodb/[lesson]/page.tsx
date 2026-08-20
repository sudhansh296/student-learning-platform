import { notFound } from 'next/navigation';
import { allMongodbLessons } from '@/data/mongodb-lessons/index';
import { mongodbChapters } from '@/data/mongodb-curriculum';
import MongodbLessonClient from '@/components/mongodb/MongodbLessonClient';
import type { Metadata } from 'next';

interface Props { params: Promise<{ lesson: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lesson } = await params;
  const l = allMongodbLessons.find(x => x.slug === lesson);
  if (!l) return { title: 'Not Found' };
  return { title: `${l.title} - MongoDB Tutorial`, description: l.description };
}

export default async function MongodbLessonPage({ params }: Props) {
  const { lesson } = await params;
  const all = allMongodbLessons;
  const lessonData = all.find(x => x.slug === lesson);
  if (!lessonData) notFound();
  return (
    <MongodbLessonClient
      lesson={lessonData}
      allLessons={all}
    />
  );
}
