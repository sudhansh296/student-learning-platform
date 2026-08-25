import Link from 'next/link';
import { allInterviewQuestions, interviewCategories, getQuestionCounts } from '@/data/interview';
import { ArrowRight, Target, Code2, Users, Zap, BookOpen, Shield, Sparkles, TrendingUp } from 'lucide-react';

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
  { icon: Code2, label: 'Coding Challenges', href: '/interview/coding', gradient: 'from-emerald-500 to-teal-600', desc: `100+ problems` },
  { icon: Users, label: 'Mock Interview', href: '/interview/mock', gradient: 'from-amber-500 to-orange-600', desc: 'Timed session' },
  { icon: Zap, label: 'Rapid Revision', href: '/interview/rapid-revision', gradient: 'from-purple-500 to-pink-600', desc: 'Flashcards' },
  { icon: Target, label: 'Practice All', href: '/interview/practice', gradient: 'from-blue-500 to-indigo-600', desc: '170 questions' },
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
    <section className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(to bottom, var(--bg), var(--bg-section))' }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-screen-xl mx-auto px-4 lg:px-6">

        {/* Header with gradient badge */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}>
            <Sparkles className="w-4 h-4" />
            Ace Your Next Interview
          </div>
          <h2 className="text-3xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Interview Preparation Hub
          </h2>
          <p className="text-base max-w-2xl mx-auto" style={{ color: 'var(--text-2)' }}>
            {totalQuestions}+ expert-curated questions · 13 technical topics · Code examples · Real interview answers
          </p>
        </div>

        {/* Animated stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Questions', value: totalQuestions + '+', gradient: 'from-blue-500 to-cyan-500', icon: BookOpen },
            { label: 'Topics', value: '13', gradient: 'from-green-500 to-emerald-500', icon: Shield },
            { label: 'Coding', value: '100+', gradient: 'from-orange-500 to-red-500', icon: Code2 },
            { label: 'HR Prep', value: '50+', gradient: 'from-pink-500 to-rose-500', icon: Users },
          ].map(stat => (
            <div key={stat.label}
              className="group relative p-6 rounded-2xl text-center transition-all hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden"
              style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <stat.icon className={`w-8 h-8 mx-auto mb-3 opacity-50 group-hover:opacity-100 transition-opacity`} 
                style={{ color: 'var(--text)' }} />
              <div className={`text-3xl font-black mb-1 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
              <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-2)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Quick action cards with gradients */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {quickLinks.map(item => (
            <Link key={item.href} href={item.href}
              className={`group relative flex flex-col items-center gap-3 p-6 rounded-2xl text-center transition-all hover:scale-105 hover:shadow-2xl overflow-hidden bg-gradient-to-br ${item.gradient}`}>
              {/* Glass effect overlay */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
              <div className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center bg-white/20 group-hover:rotate-12 transition-transform">
                <item.icon className="w-7 h-7 text-white" />
              </div>
              <div className="relative z-10">
                <div className="text-sm font-bold text-white mb-1">{item.label}</div>
                <div className="text-xs text-white/80">{item.desc}</div>
              </div>
              <ArrowRight className="relative z-10 w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>

        {/* Featured questions with modern cards */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-black" style={{ color: 'var(--text)' }}>
              Most Asked Questions
            </h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayQuestions.map((q, i) => {
              const catStyle = categoryStyle[q.category] ?? { bg: '#f3f4f6', color: '#6b7280', icon: '📋' };
              const diff = diffStyle[q.difficulty];
              return (
                <Link key={q.id} href={`/interview/${q.category}`}
                  className="group relative p-5 rounded-2xl transition-all hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
                  style={{ background: 'var(--card)', border: '2px solid var(--line)' }}>
                  {/* Gradient accent on hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform"
                      style={{ background: catStyle.bg }}>
                      {catStyle.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold leading-snug mb-2 group-hover:text-blue-600 transition-colors"
                        style={{ color: 'var(--text)' }}>
                        {q.question}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: 'var(--text-2)' }}>
                    {q.shortAnswer}
                  </p>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full capitalize"
                      style={{ background: diff.bg, color: diff.color }}>
                      {q.difficulty}
                    </span>
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: catStyle.bg, color: catStyle.color }}>
                      {q.category}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Topics coverage with progress bars */}
        <div className="mb-12">
          <h3 className="text-xl font-black mb-6 flex items-center gap-3" style={{ color: 'var(--text)' }}>
            <Shield className="w-6 h-6 text-purple-600" />
            All Topics Covered
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {interviewCategories.map(cat => {
              const count = counts[cat.id] ?? 0;
              return (
                <Link key={cat.id} href={`/interview/${cat.id}`}
                  className="group relative p-4 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5"
                  style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{cat.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate group-hover:text-blue-600 transition-colors"
                        style={{ color: 'var(--text)' }}>
                        {cat.name}
                      </div>
                      <div className="text-xs font-bold" style={{ color: cat.color }}>
                        {count} questions
                      </div>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--line)' }}>
                    <div className="h-1.5 rounded-full transition-all group-hover:w-full"
                      style={{ width: `${Math.min((count / 25) * 100, 100)}%`, background: cat.color }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* CTA section with dual-tone gradient */}
        <div className="relative p-8 lg:p-12 rounded-3xl overflow-hidden shadow-2xl"
          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }}>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6">
            <div className="flex-1 text-center lg:text-left text-white">
              <h3 className="text-2xl lg:text-3xl font-black mb-3 flex items-center justify-center lg:justify-start gap-3">
                <Sparkles className="w-8 h-8" />
                Ready to Crack Your Interview?
              </h3>
              <p className="text-base lg:text-lg text-white/90 max-w-2xl">
                Join thousands of developers who prepared with our curated questions. Practice with mock interviews, rapid revision, and 170+ real interview questions.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <Link href="/interview/mock"
                className="px-6 py-3 rounded-xl font-bold text-sm bg-white/20 hover:bg-white/30 text-white transition-all hover:scale-105 shadow-lg backdrop-blur-sm">
                🎯 Mock Interview
              </Link>
              <Link href="/interview"
                className="px-6 py-3 rounded-xl font-bold text-sm bg-white text-purple-600 hover:bg-white/90 transition-all hover:scale-105 shadow-lg flex items-center gap-2">
                Start Preparing <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
