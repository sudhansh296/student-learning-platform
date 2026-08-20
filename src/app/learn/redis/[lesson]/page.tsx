import { notFound } from 'next/navigation';
import { allRedisLessons } from '@/data/redis-lessons/index';
import RedisLessonClient from '@/components/redis/RedisLessonClient';
import type { Metadata } from 'next';

interface Props { params: Promise<{ lesson: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lesson } = await params;
  const l = allRedisLessons.find(x => x.slug === lesson);
  if (!l) return { title: 'Not Found' };
  return { title: `${l.title} - Redis Tutorial`, description: l.description };
}

export default async function RedisLessonPage({ params }: Props) {
  const { lesson } = await params;
  const all = allRedisLessons;
  const lessonData = all.find(x => x.slug === lesson);
  if (!lessonData) notFound();
  return <RedisLessonClient lesson={lessonData} allLessons={all} />;
}
