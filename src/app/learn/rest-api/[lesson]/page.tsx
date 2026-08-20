import { notFound } from 'next/navigation';
import { allRestapiLessons } from '@/data/restapi-lessons/index';
import RestapiLessonClient from '@/components/restapi/RestapiLessonClient';
import type { Metadata } from 'next';

interface Props { params: Promise<{ lesson: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lesson } = await params;
  const l = allRestapiLessons.find(x => x.slug === lesson);
  if (!l) return { title: 'Not Found' };
  return { title: `${l.title} - REST APIs Tutorial`, description: l.description };
}

export default async function RestapiLessonPage({ params }: Props) {
  const { lesson } = await params;
  const all = allRestapiLessons;
  const lessonData = all.find(x => x.slug === lesson);
  if (!lessonData) notFound();
  return (
    <RestapiLessonClient
      lesson={lessonData}
      allLessons={all}
    />
  );
}
