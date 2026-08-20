import { notFound } from 'next/navigation';
import { nodejsLessons } from '@/data/nodejs-lessons/index';
import NodejsLessonClient from '@/components/nodejs/NodejsLessonClient';
import type { Metadata } from 'next';

interface Props { params: Promise<{ lesson: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lesson } = await params;
  const l = nodejsLessons.find(x => x.slug === lesson);
  if (!l) return { title: 'Not Found' };
  return { title: `${l.title} - Node.js Tutorial`, description: l.description };
}

export default async function NodejsLessonPage({ params }: Props) {
  const { lesson } = await params;
  const all = nodejsLessons;
  const lessonData = all.find(x => x.slug === lesson);
  if (!lessonData) notFound();
  return (
    <NodejsLessonClient
      lesson={lessonData}
      allLessons={all}
    />
  );
}
