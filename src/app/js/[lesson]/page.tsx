import { notFound } from 'next/navigation';
import { jsChapters } from '@/data/js-curriculum';
import { jsLessonsNew } from '@/data/js-lessons/index';
import { jsLessons as oldLessons } from '@/data/js-curriculum';
import { JSLessonClient } from '@/components/js/JSLessonClient';
import type { Metadata } from 'next';

interface Props { params: Promise<{ lesson: string }> }

function getAllLessons() {
  const newSlugs = new Set(jsLessonsNew.map(l => l.slug));
  const oldOnly = oldLessons.filter(l => !newSlugs.has(l.slug));
  return [...jsLessonsNew, ...oldOnly];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lesson } = await params;
  const l = getAllLessons().find(x => x.slug === lesson);
  if (!l) return { title: 'Not Found' };
  return { title: `${l.title} — JavaScript Tutorial`, description: l.description };
}

export default async function JSLessonPage({ params }: Props) {
  const { lesson } = await params;
  const all = getAllLessons();
  const lessonData = all.find(x => x.slug === lesson);
  if (!lessonData) notFound();

  const idx  = all.findIndex(x => x.slug === lesson);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx < all.length - 1 ? all[idx + 1] : null;

  return (
    <JSLessonClient
      lesson={lessonData}
      allLessons={all}
      chapters={jsChapters}
      prev={prev}
      next={next}
    />
  );
}
