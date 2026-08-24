import Link from 'next/link';
import { allInterviewQuestions, interviewCategories, getQuestionCounts } from '@/data/interview';
import { ArrowRight, Target, Code2, Users, Zap, BookOpen, Shield } from 'lucide-react';

// Pick a diverse set of 6 featured questions across different categories
const FEATURED_IDS = [
  'js-closure',
  'react-useeffect',
  'rest-what-is-rest',
  'db-indexes',
  'sec-xss',
  'nodejs-event-loop',
];

const diffStyle: Record<string, { bg: string; color: string; dot: string }> = {
  beginner:     { bg: '#f0fdf4', color: '#16a34a', dot: '#22c55e' },
  intermediate: { bg: '#eff6ff', color: '#2563eb', dot: '#3b82f6' },
  advanced:     { bg: '#fff7ed', color: '#ea580c', dot: '#f97316' },
};

const categoryStyle: Record<string, { bg: string; color: string; icon: string }> = {
  javascript:  { bg: '#FFFEF0', color: '#ca8a04', icon: '⚡' },
  react:       { bg: '#F0FCFF', color: '#0891b2', icon: '⚛️' },
  nodejs:      { bg: '#F0FFF0', color: '#16a34a', icon: '💚' },
  css:         { bg: '#F0F4FF', color: '#4f46e5', icon: '🎨' },
  html:        { bg: '#FFF4F0', color: '#ea580c', icon: '🌐' },
  database:    { bg: '#ECFDF5', color: '#059669', icon: '🗄️' },
  'rest-api':  { bg: '#FEF3C7', color: '#d97706', icon: '🌐' },
  security:    { bg: '#FEE2E2', color: '#dc2626', icon: '🔒' },
  frontend:    { bg: '#CFFAFE', color: '#0e7490', icon: '🎭' },
  backend:     { bg: '#EEF2FF', color: '#4338ca', icon: '⚙️' },
  project:     { bg: '#F3E8FF', color: '#7c3aed', icon: '🚀' },
  coding:      { bg: '#CFFAFE', color: '#0e7490', icon: '💻' },
  hr:          { bg: '#FCE7F3', color: '#be185d', icon: '👥' },
};

const quickLinks = [
  { icon: Code2, label: 'Coding Challenges', href: '/interview/coding', color: '#16a34a', bg: '#f0fdf4', desc: `100+ problems` },
  { icon: Users, label: 'Mock Interview', href: '/interview/mock', color: '#d97706', bg: '#fef3c7', desc: 'Timed session' },
  { icon: Zap, label: 'Rapid Revision', href: '/interview/rapid-revision', color: '#7c3aed', bg: '#f3e8ff', desc: 'Flashcards' },
  { icon: Target, label: 'Practice All', href: '/interview/practice', color: '#2563eb', bg: '#eff6ff', desc: '170 questions' },
];

export function InterviewSection() {
  const counts = getQuestionCounts();
  const totalQuestions = allInterviewQuestions.length;

  const featured = FEATURED_IDS
    .map(id => allInterviewQuestions.find(q => q.id === id))
    .filter(Boolean) as typeof allInterviewQuestions;

  // Fallback if any ID not found
  const displayQuestions = featured.length >= 4 ? featured : allInterviewQuestions.slice(0, 6);

  return (
    <section className="py-16" style={{ background: 'var(--bg)', borderBottom: '1px solid var(--line)' }}>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3"
              style={{ background: '#eff6ff', color: '#2563eb' }}>
              <Target className="w-3.5 h-3.5" />
              Career Preparation
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold mb-2" style={{ color: 'var(--text)' }}>
              Interview Preparation
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-2)' }}>
              {totalQuestions}+ questions across 13 topics — with short answers, code examples, and ideal interview answers
            </p>
          </div>
          <Link href="/interview"
            className="inline-flex items-center gap-1.5 text-sm font-bold shrink-0 hover:gap-2.5 transition-all"
            style={{ color: '#2563eb' }}>
            All questions <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { label: 'Total Questions', value: totalQuestions + '+', color: '#2563eb' },
            { label: 'Topics Covered', value: '13', color: '#16a34a' },
            { label: 'Coding Challenges', value: '100+', color: '#d97706' },
            { label: 'HR + Behavioral', value: '50+', color: '#be185d' },
          ].map(stat => (
            <div key={stat.label}
              className="p-4 rounded-xl text-center"
              style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
              <div className="text-2xl font-extrabold mb-0.5" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-xs font-medium" style={{ color: 'var(--text-2)' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main content: questions + quick links */}
        <div className="grid lg:grid-cols-3 gap-6 mb-10">

          {/* Featured questions — takes 2/3 width */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <BookOpen className="w-4 h-4" style={{ color: '#2563eb' }} />
              Featured Questions
            </h3>
            <div className="space-y-3">
              {displayQuestions.map((q, i) => {
                const catStyle = categoryStyle[q.category] ?? { bg: '#f3f4f6', color: '#6b7280', icon: '📋' };
                const diff = diffStyle[q.difficulty];
                return (
                  <Link key={q.id} href={`/interview/${q.category}`}
                    className="group flex items-start gap-4 p-4 rounded-xl transition-all hover:shadow-md"
                    style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
                    {/* Category icon */}
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0 mt-0.5"
                      style={{ background: catStyle.bg }}>
                      {catStyle.icon}
                    </div>

                    {/* Question content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold mb-1 leading-snug group-hover:text-blue-600 transition-colors"
                        style={{ color: 'var(--text)' }}>
                        {q.question}
                      </p>
                      <p className="text-xs leading-relaxed mb-2 line-clamp-2" style={{ color: 'var(--text-2)' }}>
                        {q.shortAnswer}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
                          style={{ background: diff.bg, color: diff.color }}>
                          {q.difficulty}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize"
                          style={{ background: catStyle.bg, color: catStyle.color }}>
                          {catStyle.icon} {q.category}
                        </span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <ArrowRight className="w-4 h-4 shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: '#2563eb' }} />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right column: quick links + topic grid */}
          <div className="flex flex-col gap-6">
            {/* Quick action links */}
            <div>
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                <Zap className="w-4 h-4 text-yellow-500" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {quickLinks.map(item => (
                  <Link key={item.href} href={item.href}
                    className="group flex flex-col items-center gap-2 p-4 rounded-xl text-center transition-all hover:shadow-md hover:-translate-y-0.5"
                    style={{ background: item.bg, border: `1px solid ${item.color}20` }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: `${item.color}20` }}>
                      <item.icon className="w-4 h-4" style={{ color: item.color }} />
                    </div>
                    <div>
                      <div className="text-xs font-bold" style={{ color: item.color }}>{item.label}</div>
                      <div className="text-[10px]" style={{ color: item.color + '99' }}>{item.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Topic coverage */}
            <div>
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                <Shield className="w-4 h-4" style={{ color: '#7c3aed' }} />
                Topics Covered
              </h3>
              <div className="space-y-2">
                {interviewCategories.slice(0, 8).map(cat => {
                  const count = counts[cat.id] ?? 0;
                  const maxCount = 25;
                  const pct = Math.min((count / maxCount) * 100, 100);
                  return (
                    <Link key={cat.id} href={`/interview/${cat.id}`}
                      className="flex items-center gap-3 group cursor-pointer">
                      <span className="text-sm w-4 shrink-0">{cat.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs font-semibold truncate group-hover:text-blue-600 transition-colors"
                            style={{ color: 'var(--text-2)' }}>
                            {cat.name}
                          </span>
                          <span className="text-[10px] font-bold ml-2 shrink-0"
                            style={{ color: cat.color }}>
                            {count}
                          </span>
                        </div>
                        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--line)' }}>
                          <div className="h-1 rounded-full transition-all"
                            style={{ width: `${pct}%`, background: cat.color }} />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              <Link href="/interview"
                className="block text-center mt-4 text-xs font-semibold hover:underline"
                style={{ color: '#2563eb' }}>
                See all 13 topics →
              </Link>
            </div>
          </div>
        </div>

        {/* CTA bar */}
        <div className="flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff' }}>
          <div className="flex-1 text-center sm:text-left">
            <p className="font-extrabold text-base mb-0.5">Ready to ace your interview?</p>
            <p className="text-sm text-white/80">Practice with 170+ questions, take a mock interview, or do a rapid revision before your interview day.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/interview/mock"
              className="px-4 py-2 rounded-xl font-bold text-sm bg-white/20 hover:bg-white/30 transition-colors">
              Mock Interview
            </Link>
            <Link href="/interview"
              className="px-4 py-2 rounded-xl font-bold text-sm bg-white text-indigo-600 hover:bg-white/90 transition-colors flex items-center gap-1.5">
              Start Preparing <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
