import { notFound } from 'next/navigation';
import { allDockerLessons } from '@/data/docker-lessons/index';
import DockerLessonClient from '@/components/docker/DockerLessonClient';
import type { Metadata } from 'next';

interface Props { params: Promise<{ lesson: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lesson } = await params;
  const l = allDockerLessons.find(x => x.slug === lesson);
  if (!l) return { title: 'Not Found' };
  return { title: `${l.title} - Docker Tutorial`, description: l.description };
}

export default async function DockerLessonPage({ params }: Props) {
  const { lesson } = await params;
  const all = allDockerLessons;
  const lessonData = all.find(x => x.slug === lesson);
  if (!lessonData) notFound();
  return (
    <DockerLessonClient
      lesson={lessonData}
      allLessons={all}
    />
  );
}
