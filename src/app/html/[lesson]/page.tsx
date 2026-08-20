import { notFound } from 'next/navigation';
import { htmlChapters } from '@/data/html-curriculum';
import { htmlLessons } from '@/data/html-lessons/index';
import { HtmlLessonClient } from '@/components/html/HtmlLessonClient';
import type { Metadata } from 'next';

interface Props { params: Promise<{ lesson: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lesson } = await params;
  const l = htmlLessons.find(x => x.slug === lesson);
  if (!l) return { title: 'Not Found' };
  return { title: `${l.title} — HTML Tutorial`, description: l.description };
}

export default async function HtmlLessonPage({ params }: Props) {
  const { lesson } = await params;
  const lessonData = htmlLessons.find(x => x.slug === lesson);
  if (!lessonData) notFound();

  const idx  = htmlLessons.findIndex(x => x.slug === lesson);
  const prev = idx > 0 ? htmlLessons[idx - 1] : null;
  const next = idx < htmlLessons.length - 1 ? htmlLessons[idx + 1] : null;

  return (
    <HtmlLessonClient
      lesson={lessonData}
      allLessons={htmlLessons}
      chapters={htmlChapters}
      prev={prev}
      next={next}
    />
  );
}
