import { notFound } from 'next/navigation';
import { nextjsLessons } from '@/data/nextjs-lessons/index';
import { nextjsChapters } from '@/data/nextjs-curriculum';
import { NextjsLessonClient } from '@/components/nextjs/NextjsLessonClient';
import type { Metadata } from 'next';
import { lessonMetadata, withH1 } from '@/lib/seo';
import { LessonSeoExtras } from '@/components/seo/LessonSeoExtras';

interface Props { params: Promise<{ lesson: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lesson } = await params;
  const l = nextjsLessons.find(x => x.slug === lesson);
  if (!l) return { title: 'Not Found' };
  return lessonMetadata('nextjs', l);
}

export default async function NextjsLessonPage({ params }: Props) {
  const { lesson } = await params;
  const all = nextjsLessons;
  const lessonData = all.find(x => x.slug === lesson);
  if (!lessonData) notFound();
  const idx = all.findIndex(x => x.slug === lesson);
  return (
    <>
      <NextjsLessonClient
        lesson={withH1('nextjs', lessonData)}
        allLessons={all}
        chapters={nextjsChapters}
        prev={idx > 0 ? all[idx - 1] : null}
        next={idx < all.length - 1 ? all[idx + 1] : null}
      />
      <LessonSeoExtras courseId="nextjs" lesson={lessonData} />
    </>
  );
}
