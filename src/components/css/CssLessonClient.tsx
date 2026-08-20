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
  beginner:     { bg:'#f0fdf4', color:'#15803d', border:'#bbf7d0' },
  intermediate: { bg:'#eff6ff', color:'#1d4ed8', border:'#bfdbfe' },
  advanced:     { bg:'#fff7ed', color:'#c2410c', border:'#fed7aa' },
};

export function CssLessonClient({ lesson, allLessons, chapters, prev, next }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dc = diffColor[lesson.difficulty];

  const sidebar = (
    <aside className={`w-64 shrink-0 ${sidebarOpen ? 'fixed inset-y-0 left-0 z-50 overflow-y-auto pt-4 shadow-xl' : 'hidden lg:block'}`}
      style={{ background:'var(--bg)', borderRight:'1px solid var(--line)' }}>
      {sidebarOpen && (
        <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-lg" style={{ color:'var(--text-2)' }}>
          <X className="w-4 h-4"/>
        </button>
      )}
      <div className="sticky top-20 overflow-y-auto max-h-[calc(100vh-5rem)] pb-10 px-3">
        <Link href="/css" className="flex items-center gap-2 px-2 mb-5">
          <span className="text-xl">🎨</span>
          <span className="font-extrabold text-sm" style={{ color:'var(--text)' }}>CSS Tutorial</span>
        </Link>
        {chapters.map(ch => {
          const chLessons = allLessons.filter(l => l.chapter === ch.id);
          if (!chLessons.length) return null;
          return (
            <div key={ch.id} className="mb-4">
              <p className="text-[10px] font-extrabold uppercase tracking-widest px-2 mb-1.5" style={{ color:'var(--text-3)' }}>
                {ch.icon} {ch.title}
              </p>
              <ul className="space-y-0.5">
                {chLessons.map(l => {
                  const isActive = l.slug === lesson.slug;
                  return (
                    <li key={l.id}>
                      <Link href={`/css/${l.slug}`} onClick={() => setSidebarOpen(false)}
                        className="block px-3 py-2 rounded-lg text-[13px] transition-all"
                        style={{ background:isActive?'#eff6ff':'transparent', color:isActive?'#1d4ed8':'var(--text-2)', fontWeight:isActive?'700':'500', borderLeft:isActive?'3px solid #2563eb':'3px solid transparent' }}>
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
        {sidebarOpen && <div className="fixed inset-0 z-40" style={{ background:'rgba(0,0,0,0.4)' }} onClick={() => setSidebarOpen(false)}/>}
        <main className="flex-1 min-w-0 py-8 lg:pl-10">
          <button onClick={() => setSidebarOpen(true)}
            className="lg:hidden flex items-center gap-2 mb-5 px-3 py-2 rounded-lg text-sm"
            style={{ border:'1px solid var(--line)', color:'var(--text-2)', background:'var(--bg)' }}>
            <Menu className="w-4 h-4"/> All CSS Topics
          </button>

          <Breadcrumb items={[{ label:'Learn', href:'/learn' }, { label:'CSS', href:'/css' }, { label:lesson.title }]} />

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight mb-3 leading-tight" style={{ color:'var(--text)' }}>{lesson.title}</h1>
            <p className="text-[15px] leading-relaxed mb-4 max-w-2xl" style={{ color:'var(--text-2)' }}>{lesson.description}</p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full capitalize"
                style={{ background:dc.bg, color:dc.color, border:`1px solid ${dc.border}` }}>{lesson.difficulty}</span>
              <span className="flex items-center gap-1.5 text-xs" style={{ color:'var(--text-3)' }}>
                <Clock className="w-3.5 h-3.5"/> {lesson.readingTime} min read
              </span>
              <span className="flex items-center gap-1.5 text-xs" style={{ color:'var(--text-3)' }}>
                <BookOpen className="w-3.5 h-3.5"/> {chapters.find(c => c.id===lesson.chapter)?.title}
              </span>
            </div>
          </div>

          <CssSectionRenderer sections={lesson.sections}/>

          {lesson.exercises && lesson.exercises.length > 0 && <ExerciseBlock exercises={lesson.exercises}/>}
          {lesson.quiz && lesson.quiz.length > 0 && <QuizBlock questions={lesson.quiz} title={`${lesson.title} Quiz`}/>}

          <div className="mt-8 grid grid-cols-2 gap-4">
            {prev ? (
              <Link href={`/css/${prev.slug}`}
                className="group flex items-center gap-3 p-4 rounded-2xl transition-all hover:-translate-y-0.5"
                style={{ border:'1px solid var(--line)', background:'var(--card)' }}>
                <ChevronLeft className="w-5 h-5 shrink-0" style={{ color:'var(--text-3)' }}/>
                <div className="min-w-0">
                  <p className="text-xs" style={{ color:'var(--text-3)' }}>Previous</p>
                  <p className="text-sm font-semibold truncate group-hover:text-blue-600 transition-colors" style={{ color:'var(--text)' }}>{prev.title}</p>
                </div>
              </Link>
            ) : <div/>}
            {next ? (
              <Link href={`/css/${next.slug}`}
                className="group flex items-center justify-end gap-3 p-4 rounded-2xl transition-all hover:-translate-y-0.5 text-right"
                style={{ border:'1px solid var(--line)', background:'var(--card)' }}>
                <div className="min-w-0">
                  <p className="text-xs" style={{ color:'var(--text-3)' }}>Next</p>
                  <p className="text-sm font-semibold truncate group-hover:text-blue-600 transition-colors" style={{ color:'var(--text)' }}>{next.title}</p>
                </div>
                <ChevronRight className="w-5 h-5 shrink-0" style={{ color:'var(--text-3)' }}/>
              </Link>
            ) : <div/>}
          </div>
        </main>
      </div>
    </div>
  );
}
