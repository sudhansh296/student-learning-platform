import { notFound } from 'next/navigation';
import { tsLessons } from '@/data/ts-lessons/index';
import { tsChapters } from '@/data/ts-curriculum';
import { TsLessonClient } from '@/components/ts/TsLessonClient';
import type { Metadata } from 'next';

interface Props { params: Promise<{ lesson: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lesson } = await params;
  const l = tsLessons.find(x => x.slug === lesson);
  if (!l) return { title: 'Not Found' };
  return { title: `${l.title} — TypeScript Tutorial`, description: l.description };
}

export default async function TsLessonPage({ params }: Props) {
  const { lesson } = await params;
  const all = tsLessons;
  const lessonData = all.find(x => x.slug === lesson);
  if (!lessonData) notFound();
  const idx = all.findIndex(x => x.slug === lesson);
  return (
    <TsLessonClient
      lesson={lessonData}
      allLessons={all}
      chapters={tsChapters}
      prev={idx > 0 ? all[idx - 1] : null}
      next={idx < all.length - 1 ? all[idx + 1] : null}
    />
  );
}
