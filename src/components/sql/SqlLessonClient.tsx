'use client';

import { useState } from 'react';
import type { SqlLesson } from '@/data/sql-curriculum';
import { SqlChapters } from '@/data/sql-curriculum';
import { SqlSectionRenderer } from './SqlSectionRenderer';
import { ExerciseBlock } from '@/components/docs/ExerciseBlock';
import { QuizBlock } from '@/components/docs/QuizBlock';
import { Breadcrumb } from '@/components/docs/Breadcrumb';
import { ChevronLeft, ChevronRight, Clock, BookOpen, Menu, X } from 'lucide-react';
import Link from 'next/link';

interface Props {
  lesson: SqlLesson;
  allLessons: SqlLesson[];
}

export default function SqlLessonClient({ lesson, allLessons }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const BRAND = '#F29111';
  const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const sidebar = (
    <aside className={`w-64 shrink-0 ${sidebarOpen ? 'fixed inset-y-0 left-0 z-50 overflow-y-auto pt-4 shadow-xl' : 'hidden lg:block'}`}
      style={{ background: 'var(--bg)', borderRight: '1px solid var(--line)' }}>
      {sidebarOpen && (
        <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-lg" style={{ color: 'var(--text-2)' }}>
          <X className="w-4 h-4" />
        </button>
      )}
      <div className="sticky top-20 overflow-y-auto max-h-[calc(100vh-5rem)] pb-10 px-3">
        <Link href="/learn/sql/01-introduction" className="flex items-center gap-2 px-2 mb-5">
          <span className="text-xl">🗄️</span>
          <span className="font-extrabold text-sm" style={{ color: 'var(--text)' }}>SQL Tutorial</span>
        </Link>
        {SqlChapters.map(ch => {
          const chLessons = allLessons.filter(l => l.chapter === ch.id);
          if (!chLessons.length) return null;
          return (
            <div key={ch.id} className="mb-4">
              <p className="text-[10px] font-extrabold uppercase tracking-widest px-2 mb-1.5" style={{ color: 'var(--text-3)' }}>
                {ch.icon} {ch.title}
              </p>
              <ul className="space-y-0.5">
                {chLessons.map(l => {
                  const isActive = l.slug === lesson.slug;
                  return (
                    <li key={l.id}>
                      <Link href={`/learn/sql/${l.slug}`} onClick={() => setSidebarOpen(false)}
                        className="block px-3 py-2 rounded-lg text-[13px] transition-all"
                        style={{ background: isActive ? '#fff8f0' : 'transparent', color: isActive ? BRAND : 'var(--text-2)', fontWeight: isActive ? '700' : '500', borderLeft: isActive ? `3px solid ${BRAND}` : '3px solid transparent' }}>
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
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden flex items-center gap-2 mb-5 px-3 py-2 rounded-lg text-sm"
            style={{ border: '1px solid var(--line)', color: 'var(--text-2)', background: 'var(--bg)' }}>
            <Menu className="w-4 h-4" /> All SQL Topics
          </button>
          <Breadcrumb items={[{ label: 'Learn', href: '/learn' }, { label: 'SQL', href: '/learn/sql/01-introduction' }, { label: lesson.title }]} />
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: '#fff8f0', color: BRAND, border: `1px solid ${BRAND}` }}>
                {SqlChapters.find(c => c.id === lesson.chapter)?.title}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full capitalize" style={{ background: 'var(--bg-section)', color: 'var(--text-2)', border: '1px solid var(--line)' }}>
                {lesson.difficulty}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-3 leading-tight" style={{ color: 'var(--text)' }}>{lesson.title}</h1>
            <p className="text-[15px] leading-relaxed mb-4 max-w-2xl" style={{ color: 'var(--text-2)' }}>{lesson.description}</p>
            <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-3)' }}>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {lesson.readingTime} min read</span>
              <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> Lesson {lesson.order}</span>
            </div>
          </div>
          <SqlSectionRenderer sections={lesson.sections} />
          {lesson.exercises?.length > 0 && <ExerciseBlock exercises={lesson.exercises} />}
          {lesson.quiz?.length > 0 && <QuizBlock questions={lesson.quiz} title={`${lesson.title} - Quiz`} />}
          <div className="mt-8 grid grid-cols-2 gap-4">
            {prevLesson ? (
              <Link href={`/learn/sql/${prevLesson.slug}`} className="group flex items-center gap-3 p-4 rounded-2xl transition-all hover:-translate-y-0.5" style={{ border: '1px solid var(--line)', background: 'var(--card)' }}>
                <ChevronLeft className="w-5 h-5 shrink-0" style={{ color: 'var(--text-3)' }} />
                <div className="min-w-0"><p className="text-xs" style={{ color: 'var(--text-3)' }}>Previous</p><p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{prevLesson.title}</p></div>
              </Link>
            ) : <div />}
            {nextLesson ? (
              <Link href={`/learn/sql/${nextLesson.slug}`} className="group flex items-center justify-end gap-3 p-4 rounded-2xl transition-all hover:-translate-y-0.5 text-right" style={{ border: `1px solid ${BRAND}`, background: '#fff8f0' }}>
                <div className="min-w-0"><p className="text-xs" style={{ color: 'var(--text-3)' }}>Next</p><p className="text-sm font-semibold truncate" style={{ color: BRAND }}>{nextLesson.title}</p></div>
                <ChevronRight className="w-5 h-5 shrink-0" style={{ color: BRAND }} />
              </Link>
            ) : <div />}
          </div>
        </main>
      </div>
    </div>
  );
}
