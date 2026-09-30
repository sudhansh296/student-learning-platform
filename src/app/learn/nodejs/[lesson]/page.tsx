import { notFound } from 'next/navigation';
import { nodejsLessons } from '@/data/nodejs-lessons/index';
import NodejsLessonClient from '@/components/nodejs/NodejsLessonClient';
import type { Metadata } from 'next';
import { lessonMetadata, withH1 } from '@/lib/seo';
import { LessonSeoExtras } from '@/components/seo/LessonSeoExtras';

interface Props { params: Promise<{ lesson: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lesson } = await params;
  const l = nodejsLessons.find(x => x.slug === lesson);
  if (!l) return { title: 'Not Found' };
  return lessonMetadata('nodejs', l);
}

export default async function NodejsLessonPage({ params }: Props) {
  const { lesson } = await params;
  const all = nodejsLessons;
  const lessonData = all.find(x => x.slug === lesson);
  if (!lessonData) notFound();
  return (
    <>
      <NodejsLessonClient
        lesson={withH1('nodejs', lessonData)}
        allLessons={all}
      />
      <LessonSeoExtras courseId="nodejs" lesson={lessonData} />
    </>
  );
}
