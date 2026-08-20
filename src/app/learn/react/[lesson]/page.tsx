import { notFound } from 'next/navigation';
import { reactLessons } from '@/data/react-lessons/index';
import { reactChapters } from '@/data/react-curriculum';
import { ReactLessonClient } from '@/components/react/ReactLessonClient';
import type { Metadata } from 'next';

interface Props { params: Promise<{ lesson: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lesson } = await params;
  const l = reactLessons.find(x => x.slug === lesson);
  if (!l) return { title: 'Not Found' };
  return { title: `${l.title} — React Tutorial`, description: l.description };
}

export default async function ReactLessonPage({ params }: Props) {
  const { lesson } = await params;
  const all = reactLessons;
  const lessonData = all.find(x => x.slug === lesson);
  if (!lessonData) notFound();

  const idx  = all.findIndex(x => x.slug === lesson);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx < all.length - 1 ? all[idx + 1] : null;

  return (
    <ReactLessonClient
      lesson={lessonData}
      allLessons={all}
      chapters={reactChapters}
      prev={prev}
      next={next}
    />
  );
}
