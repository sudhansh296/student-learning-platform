import { notFound } from 'next/navigation';
import { allRestapiLessons } from '@/data/restapi-lessons/index';
import RestapiLessonClient from '@/components/restapi/RestapiLessonClient';
import type { Metadata } from 'next';
import { lessonMetadata, withH1 } from '@/lib/seo';
import { LessonSeoExtras } from '@/components/seo/LessonSeoExtras';

interface Props { params: Promise<{ lesson: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lesson } = await params;
  const l = allRestapiLessons.find(x => x.slug === lesson);
  if (!l) return { title: 'Not Found' };
  return lessonMetadata('restapi', l);
}

export default async function RestapiLessonPage({ params }: Props) {
  const { lesson } = await params;
  const all = allRestapiLessons;
  const lessonData = all.find(x => x.slug === lesson);
  if (!lessonData) notFound();
  return (
    <>
      <RestapiLessonClient
        lesson={withH1('restapi', lessonData)}
        allLessons={all}
      />
      <LessonSeoExtras courseId="restapi" lesson={lessonData} />
    </>
  );
}
