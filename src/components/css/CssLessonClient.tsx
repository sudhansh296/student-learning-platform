'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Clock, BookOpen, Menu, X } from 'lucide-react';
import type { CssLesson } from '@/data/css-curriculum';
import { CssSectionRenderer } from './CssSectionRenderer';
import { ExerciseBlock } from '@/components/docs/ExerciseBlock';
import { QuizBlock } from '@/components/docs/QuizBlock';
import { Breadcrumb } from '@/components/docs/Breadcrumb';

interface Props {
  lesson: CssLesson;
  allLessons: CssLesson[];
  chapters: { id: string; title: string; icon: string }[];
  prev: CssLesson | null;
  next: CssLesson | null;
}

const diffColor = {
  beginner:     { bg:'bg-emerald-100 dark:bg-emerald-900/40', color:'text-emerald-700 dark:text-emerald-400', border:'border-emerald-200 dark:border-emerald-800' },
  intermediate: { bg:'bg-blue-100 dark:bg-blue-900/40', color:'text-blue-700 dark:text-blue-400', border:'border-blue-200 dark:border-blue-800' },
  advanced:     { bg:'bg-orange-100 dark:bg-orange-900/40', color:'text-orange-700 dark:text-orange-400', border:'border-orange-200 dark:border-orange-800' },
};

export function CssLessonClient({ lesson, allLessons, chapters, prev, next }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dc = diffColor[lesson.difficulty];
  const activeChapter = chapters.find((chapter) => chapter.id === lesson.chapter);
  const lessonIndex = allLessons.findIndex((item) => item.slug === lesson.slug);
  const lessonProgress = Math.round(((lessonIndex + 1) / allLessons.length) * 100);

  const sidebar = (
    <aside
      className={`shrink-0 ${
        sidebarOpen
          ? 'fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto border-r border-border bg-background/95 shadow-2xl backdrop-blur-sm pt-4'
          : 'hidden lg:flex lg:w-72 lg:flex-col lg:border-r lg:border-border lg:bg-background'
      }`}
    >
      {sidebarOpen && (
        <button
          aria-label="Close CSS topic sidebar"
          onClick={() => setSidebarOpen(false)}
          className="absolute right-4 top-4 rounded-lg border border-border bg-background p-1.5 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <div className="sticky top-0 overflow-y-auto px-3 pb-10 pt-2">
        <Link href="/css" className="mb-5 flex items-center gap-2 rounded-xl px-2 py-2 transition-colors hover:bg-muted/60">
          <span className="text-xl">🎨</span>
          <span className="text-sm font-extrabold text-foreground">CSS Tutorial</span>
        </Link>

        <div className="mb-4 rounded-xl border border-border bg-muted/30 p-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Progress</p>
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Lesson {lessonIndex + 1}</span>
            <span>{lessonProgress}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: `${lessonProgress}%` }} />
          </div>
        </div>

        {chapters.map((ch) => {
          const chLessons = allLessons.filter((l) => l.chapter === ch.id);
          if (!chLessons.length) return null;
          return (
            <div key={ch.id} className="mb-4">
              <p className="mb-1.5 px-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground">
                {ch.icon} {ch.title}
              </p>
              <ul className="space-y-0.5">
                {chLessons.map((l) => {
                  const isActive = l.slug === lesson.slug;
                  return (
                    <li key={l.id}>
                      <Link
                        href={`/css/${l.slug}`}
                        onClick={() => setSidebarOpen(false)}
                        className={`block rounded-lg border px-3 py-2 text-[13px] transition-all ${
                          isActive
                            ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-400'
                            : 'border-transparent text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground'
                        }`}
                      >
                        {l.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </aside>
  );

  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-6">
      <div className="flex gap-0 py-0">
        {sidebar}
        {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setSidebarOpen(false)} />}

        <main className="flex-1 min-w-0 py-8 lg:pl-10">
          <button
            aria-label="Open CSS topic sidebar"
            onClick={() => setSidebarOpen(true)}
            className="mb-5 flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground lg:hidden"
          >
            <Menu className="h-4 w-4" /> All CSS Topics
          </button>

          <Breadcrumb items={[{ label: 'Learn', href: '/learn' }, { label: 'CSS', href: '/css' }, { label: lesson.title }]} />

          <div className="mb-8">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold capitalize ${dc.bg} ${dc.color} ${dc.border}`}>
                {lesson.difficulty}
              </span>
              <span className="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                {activeChapter?.title}
              </span>
            </div>

            <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-foreground leading-tight">{lesson.title}</h1>
            <p className="mb-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">{lesson.description}</p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> {lesson.readingTime} min read
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5" /> {activeChapter?.title}
              </span>
            </div>
          </div>

          <CssSectionRenderer sections={lesson.sections} />

          {lesson.exercises && lesson.exercises.length > 0 && <ExerciseBlock exercises={lesson.exercises} />}
          {lesson.quiz && lesson.quiz.length > 0 && <QuizBlock questions={lesson.quiz} title={`${lesson.title} Quiz`} />}

          <div className="mt-8 flex flex-wrap items-stretch justify-between gap-3">
            {prev ? (
              <Link
                href={`/css/${prev.slug}`}
                aria-label={`Previous lesson: ${prev.title}`}
                className="group max-w-full sm:max-w-[48%] flex items-center gap-3 rounded-xl border border-border bg-background px-3.5 py-2.5 transition-all hover:-translate-y-0.5 hover:border-blue-300 dark:hover:border-blue-700"
              >
                <ChevronLeft className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-blue-500" />
                <div className="min-w-0">
                  <p className="text-[11px] text-muted-foreground">Previous</p>
                  <p className="truncate text-[13px] font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400">{prev.title}</p>
                </div>
              </Link>
            ) : <div />}

            {next ? (
              <Link
                href={`/css/${next.slug}`}
                aria-label={`Next lesson: ${next.title}`}
                className="group max-w-full sm:max-w-[48%] flex items-center justify-end gap-3 rounded-xl border border-border bg-background px-3.5 py-2.5 text-right transition-all hover:-translate-y-0.5 hover:border-blue-300 dark:hover:border-blue-700"
              >
                <div className="min-w-0">
                  <p className="text-[11px] text-muted-foreground">Next</p>
                  <p className="truncate text-[13px] font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400">{next.title}</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-blue-500" />
              </Link>
            ) : <div />}
          </div>
        </main>
      </div>
    </div>
  );
}
