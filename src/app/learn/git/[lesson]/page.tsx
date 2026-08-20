import { notFound } from 'next/navigation';
import { allGitLessons } from '@/data/git-lessons/index';
import GitLessonClient from '@/components/git/GitLessonClient';
import type { Metadata } from 'next';

interface Props { params: Promise<{ lesson: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lesson } = await params;
  const l = allGitLessons.find(x => x.slug === lesson);
  if (!l) return { title: 'Not Found' };
  return { title: `${l.title} - Git Tutorial`, description: l.description };
}

export default async function GitLessonPage({ params }: Props) {
  const { lesson } = await params;
  const all = allGitLessons;
  const lessonData = all.find(x => x.slug === lesson);
  if (!lessonData) notFound();
  return (
    <GitLessonClient
      lesson={lessonData}
      allLessons={all}
    />
  );
}
