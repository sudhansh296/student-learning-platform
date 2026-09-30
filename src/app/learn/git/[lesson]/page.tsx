import { notFound } from 'next/navigation';
import { allGitLessons } from '@/data/git-lessons/index';
import GitLessonClient from '@/components/git/GitLessonClient';
import type { Metadata } from 'next';
import { lessonMetadata, withH1 } from '@/lib/seo';
import { LessonSeoExtras } from '@/components/seo/LessonSeoExtras';

interface Props { params: Promise<{ lesson: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lesson } = await params;
  const l = allGitLessons.find(x => x.slug === lesson);
  if (!l) return { title: 'Not Found' };
  return lessonMetadata('git', l);
}

export default async function GitLessonPage({ params }: Props) {
  const { lesson } = await params;
  const all = allGitLessons;
  const lessonData = all.find(x => x.slug === lesson);
  if (!lessonData) notFound();
  return (
    <>
      <GitLessonClient
        lesson={withH1('git', lessonData)}
        allLessons={all}
      />
      <LessonSeoExtras courseId="git" lesson={lessonData} />
    </>
  );
}
