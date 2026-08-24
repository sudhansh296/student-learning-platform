'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Clock, BookOpen, Menu, X } from 'lucide-react';
import type { JSLesson } from '@/data/js-curriculum';
import { JSSectionRenderer } from './JSSectionRenderer';
import { ExerciseBlock } from '@/components/docs/ExerciseBlock';
import { QuizBlock } from '@/components/docs/QuizBlock';
import { Breadcrumb } from '@/components/docs/Breadcrumb';

interface Props {
  lesson: JSLesson;
  allLessons: JSLesson[];
  chapters: { id: string; title: string; icon: string }[];
  prev: JSLesson | null;
  next: JSLesson | null;
}

const diffColor = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  advanced: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
};

export function JSLessonClient({ lesson, allLessons, chapters, prev, next }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebar = (
    <aside className={`w-64 shrink-0 ${sidebarOpen ? 'fixed inset-y-0 left-0 z-50 bg-background border-r border-border shadow-xl overflow-y-auto pt-4' : 'hidden lg:block'}`}>
      {sidebarOpen && (
        <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-1.5 rounded hover:bg-muted/60">
          <X className="w-4 h-4" />
        </button>
      )}
      <div className="sticky top-20 overflow-y-auto max-h-[calc(100vh-5rem)] pb-10 px-3">
        <div className="mb-4 px-2">
          <Link href="/js" className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <span className="font-bold text-sm text-foreground">JavaScript Tutorial</span>
          </Link>
        </div>

        {chapters.map(ch => {
          const chLessons = allLessons.filter(l => l.chapter === ch.id);
          if (!chLessons.length) return null;
          return (
            <div key={ch.id} className="mb-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 mb-1.5">
                {ch.icon} {ch.title}
              </p>
              <ul className="space-y-0.5">
                {chLessons.map(l => {
                  const isActive = l.slug === lesson.slug;
                  return (
                    <li key={l.id}>
                      <Link
                        href={`/js/${l.slug}`}
                        onClick={() => setSidebarOpen(false)}
                        className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                          isActive
                            ? 'bg-yellow-50 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400 font-semibold border border-yellow-200 dark:border-yellow-800'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
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
      <div className="flex gap-8 py-8">
        {sidebar}
        {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setSidebarOpen(false)} />}

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Mobile sidebar toggle */}
          <button
            className="lg:hidden flex items-center gap-2 mb-4 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-4 h-4" />
            All Topics
          </button>

          <Breadcrumb items={[
            { label: 'Learn', href: '/learn' },
            { label: 'JavaScript', href: '/js' },
            { label: lesson.title }
          ]} />

          {/* Lesson header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-3 leading-tight">
              {lesson.title}
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed mb-4 max-w-2xl">
              {lesson.description}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${diffColor[lesson.difficulty]}`}>
                {lesson.difficulty}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {lesson.readingTime} min read
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <BookOpen className="w-3.5 h-3.5" />
                Chapter: {chapters.find(c => c.id === lesson.chapter)?.title}
              </span>
            </div>
          </div>

          {/* Content sections */}
          <JSSectionRenderer sections={lesson.sections} />

          {/* Exercises */}
          {lesson.exercises.length > 0 && (
            <ExerciseBlock exercises={lesson.exercises} />
          )}

          {/* Quiz */}
          {lesson.quiz.length > 0 && (
            <QuizBlock questions={lesson.quiz} title={`${lesson.title} — Quiz`} />
          )}

          {/* Prev / Next */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            {prev ? (
              <Link href={`/js/${prev.slug}`}
                className="group flex items-center gap-3 p-4 rounded-xl border border-border bg-background hover:border-yellow-300 dark:hover:border-yellow-700 hover:shadow-sm transition-all">
                <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-yellow-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Previous</p>
                  <p className="text-sm font-semibold text-foreground group-hover:text-yellow-600 dark:group-hover:text-yellow-400 truncate">{prev.title}</p>
                </div>
              </Link>
            ) : <div />}
            {next ? (
              <Link href={`/js/${next.slug}`}
                className="group flex items-center justify-end gap-3 p-4 rounded-xl border border-border bg-background hover:border-yellow-300 dark:hover:border-yellow-700 hover:shadow-sm transition-all text-right">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Next</p>
                  <p className="text-sm font-semibold text-foreground group-hover:text-yellow-600 dark:group-hover:text-yellow-400 truncate">{next.title}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-yellow-500 shrink-0" />
              </Link>
            ) : <div />}
          </div>
        </main>
      </div>
    </div>
  );
}
