import { notFound } from 'next/navigation';
import { allExpressLessons } from '@/data/express-lessons/index';
import ExpressLessonClient from '@/components/express/ExpressLessonClient';
import type { Metadata } from 'next';

interface Props { params: Promise<{ lesson: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lesson } = await params;
  const l = allExpressLessons.find(x => x.slug === lesson);
  if (!l) return { title: 'Not Found' };
  return { title: `${l.title} - Express.js Tutorial`, description: l.description };
}

export default async function ExpressLessonPage({ params }: Props) {
  const { lesson } = await params;
  const all = allExpressLessons;
  const lessonData = all.find(x => x.slug === lesson);
  if (!lessonData) notFound();
  return (
    <ExpressLessonClient
      lesson={lessonData}
      allLessons={all}
    />
  );
}
