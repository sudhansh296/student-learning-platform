import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Code2, Briefcase, Users, Zap, Target, Rocket } from 'lucide-react';
import { interviewCategories, getQuestionCounts } from '@/data/interview';

export const metadata: Metadata = {
  title: 'Interview Preparation | WebDevAtlas',
  description: 'Prepare for web development interviews with comprehensive questions, coding challenges, mock interviews, and project explanations.',
};

export default function InterviewDashboard() {
  const questionCounts = getQuestionCounts();

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="relative max-w-screen-xl mx-auto px-4 lg:px-6 py-16 lg:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6">
              <Target className="w-4 h-4 text-white" />
              <span className="text-sm font-bold text-white">Career Preparation</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
              Interview Preparation
            </h1>
            <p className="text-lg text-white/90 mb-8 leading-relaxed">
              Prepare smarter. Practice better. Become interview ready.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="#categories"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl"
              >
                <BookOpen className="w-4 h-4" />
                Start Preparing
              </Link>
              <Link
                href="/interview/mock"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-sm hover:bg-white/20 transition-all border-2 border-white/30"
              >
                <Rocket className="w-4 h-4" />
                Mock Interview
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="max-w-screen-xl mx-auto px-4 lg:px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          <Link
            href="/interview/practice"
            className="group p-6 rounded-xl transition-all hover:shadow-xl"
            style={{ background: 'var(--card)', border: '1px solid var(--line)' }}
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>
              Practice Questions
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-2)' }}>
              Browse and practice technical interview questions
            </p>
          </Link>

          <Link
            href="/interview/coding"
            className="group p-6 rounded-xl transition-all hover:shadow-xl"
            style={{ background: 'var(--card)', border: '1px solid var(--line)' }}
          >
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Code2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>
              Coding Interview
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-2)' }}>
              Solve coding challenges in the browser
            </p>
          </Link>

          <Link
            href="/interview/projects"
            className="group p-6 rounded-xl transition-all hover:shadow-xl"
            style={{ background: 'var(--card)', border: '1px solid var(--line)' }}
          >
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Briefcase className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>
              Project Interview
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-2)' }}>
              Learn to explain your projects effectively
            </p>
          </Link>

          <Link
            href="/interview/mock"
            className="group p-6 rounded-xl transition-all hover:shadow-xl"
            style={{ background: 'var(--card)', border: '1px solid var(--line)' }}
          >
            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>
              Mock Interview
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-2)' }}>
              Simulate real interview scenarios
            </p>
          </Link>
        </div>

        {/* Interview Categories */}
        <div id="categories" className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold mb-3" style={{ color: 'var(--text)' }}>
              Technical Interview Topics
            </h2>
            <p className="text-base" style={{ color: 'var(--text-2)' }}>
              Master each technology with curated interview questions and practical examples
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {interviewCategories.map((category) => (
              <Link
                key={category.id}
                href={`/interview/${category.id}`}
                className="group p-6 rounded-xl transition-all hover:shadow-lg"
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--line)',
                }}
              >
                <div className="flex items-start gap-4 mb-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform"
                    style={{ background: category.bgColor }}
                  >
                    {category.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" style={{ color: 'var(--text)' }}>
                      {category.name}
                    </h3>
                    {questionCounts[category.id] > 0 && (
                      <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ background: category.bgColor, color: category.color }}>
                        {questionCounts[category.id]} questions
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-2)' }}>
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Additional Features */}
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/interview/rapid-revision"
            className="p-6 rounded-xl transition-all hover:shadow-lg"
            style={{ background: 'var(--card)', border: '1px solid var(--line)' }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>
                  Rapid Revision
                </h3>
                <p className="text-sm mb-3" style={{ color: 'var(--text-2)' }}>
                  Quick review of top interview questions for last-minute preparation
                </p>
                <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-400">
                  Perfect for interview day →
                </span>
              </div>
            </div>
          </Link>

          <Link
            href="/interview/hr"
            className="p-6 rounded-xl transition-all hover:shadow-lg"
            style={{ background: 'var(--card)', border: '1px solid var(--line)' }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>
                  HR Interview
                </h3>
                <p className="text-sm mb-3" style={{ color: 'var(--text-2)' }}>
                  Prepare for behavioral questions and communication skills
                </p>
                <span className="text-xs font-semibold text-pink-700 dark:text-pink-400">
                  Build confidence →
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
