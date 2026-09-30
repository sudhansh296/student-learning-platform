import { notFound } from 'next/navigation';
import { allDockerLessons } from '@/data/docker-lessons/index';
import DockerLessonClient from '@/components/docker/DockerLessonClient';
import type { Metadata } from 'next';
import { lessonMetadata, withH1 } from '@/lib/seo';
import { LessonSeoExtras } from '@/components/seo/LessonSeoExtras';

interface Props { params: Promise<{ lesson: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lesson } = await params;
  const l = allDockerLessons.find(x => x.slug === lesson);
  if (!l) return { title: 'Not Found' };
  return lessonMetadata('docker', l);
}

export default async function DockerLessonPage({ params }: Props) {
  const { lesson } = await params;
  const all = allDockerLessons;
  const lessonData = all.find(x => x.slug === lesson);
  if (!lessonData) notFound();
  return (
    <>
      <DockerLessonClient
        lesson={withH1('docker', lessonData)}
        allLessons={all}
      />
      <LessonSeoExtras courseId="docker" lesson={lessonData} />
    </>
  );
}
