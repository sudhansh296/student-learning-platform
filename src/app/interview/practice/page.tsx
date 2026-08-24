'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, Code2, Lightbulb, AlertTriangle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { allInterviewQuestions, interviewCategories } from '@/data/interview';
import { CodeBlock } from '@/components/docs/CodeBlock';

const difficultyBadge = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  advanced: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
};

function QuestionCard({ question }: { question: typeof allInterviewQuestions[0] }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
      {/* Question Header */}
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`text-[10px] font-bold px-3 py-1 rounded-full capitalize ${difficultyBadge[question.difficulty]}`}>
            {question.difficulty}
          </span>
          <span className="text-[10px] font-medium px-3 py-1 rounded-full capitalize" style={{ background: 'var(--bg-section)', color: 'var(--text-2)' }}>
            {question.category}
          </span>
          <span className="text-[10px] font-medium px-3 py-1 rounded-full capitalize" style={{ background: 'var(--bg-section)', color: 'var(--text-3)' }}>
            {question.type}
          </span>
        </div>
        
        <h3 className="text-lg font-bold mb-4 leading-snug" style={{ color: 'var(--text)' }}>
          {question.question}
        </h3>

        {!revealed && (
          <div className="space-y-2">
            <p className="text-sm mb-4" style={{ color: 'var(--text-2)' }}>
              💭 Think about this question before revealing the answer. How would you explain this in an interview?
            </p>
            <button
              onClick={() => setRevealed(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              Reveal Answer
            </button>
          </div>
        )}
      </div>

      {/* Answer Sections */}
      {revealed && (
        <div className="px-6 pb-6 space-y-6" style={{ borderTop: '1px solid var(--line)', paddingTop: '1.5rem' }}>
          {/* Short Answer */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: 'var(--text-3)' }}>
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Short Answer
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
              {question.shortAnswer}
            </p>
          </div>

          {/* Detailed Explanation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-3)' }}>
              Detailed Explanation
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
              {question.detailedExplanation}
            </p>
          </div>

          {/* Code Example */}
          {question.example && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: 'var(--text-3)' }}>
                <Code2 className="w-4 h-4" />
                Example
              </h4>
              <CodeBlock code={question.example.code} language={question.example.language} />
              {question.example.explanation && (
                <p className="text-xs mt-2" style={{ color: 'var(--text-3)' }}>
                  💡 {question.example.explanation}
                </p>
              )}
            </div>
          )}

          {/* Interview Answer */}
          {question.interviewAnswer && (
            <div className="p-4 rounded-lg" style={{ background: 'var(--bg-section)' }}>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: 'var(--text-3)' }}>
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                How to Answer in an Interview
              </h4>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
                {question.interviewAnswer}
              </p>
            </div>
          )}

          {/* Common Mistakes */}
          {question.commonMistakes && question.commonMistakes.length > 0 && (
            <div className="p-4 rounded-lg" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-4 h-4" />
                Common Mistakes
              </h4>
              <ul className="space-y-1.5">
                {question.commonMistakes.map((mistake, idx) => (
                  <li key={idx} className="text-sm text-red-700 flex items-start gap-2">
                    <span className="shrink-0 mt-0.5">❌</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Real World Use */}
          {question.realWorldUse && (
            <div className="p-4 rounded-lg" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-2 text-green-700">
                Real-World Application
              </h4>
              <p className="text-sm text-green-700 leading-relaxed">
                {question.realWorldUse}
              </p>
            </div>
          )}

          {/* Follow-up Questions */}
          {question.followUpQuestions && question.followUpQuestions.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-3)' }}>
                Follow-up Questions
              </h4>
              <div className="space-y-2">
                {question.followUpQuestions.map((followUp, idx) => (
                  <div key={idx} className="p-3 rounded-lg" style={{ background: 'var(--bg-section)' }}>
                    <p className="text-sm" style={{ color: 'var(--text-2)' }}>
                      💬 {followUp}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PracticePage() {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = allInterviewQuestions.filter(q => {
    if (categoryFilter !== 'all' && q.category !== categoryFilter) return false;
    if (difficultyFilter !== 'all' && q.difficulty !== difficultyFilter) return false;
    if (typeFilter !== 'all' && q.type !== typeFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-12">
        {/* Back Link */}
        <Link
          href="/interview"
          className="inline-flex items-center gap-2 mb-6 text-sm font-medium hover:gap-3 transition-all"
          style={{ color: 'var(--text-2)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Interview Prep
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-extrabold mb-3" style={{ color: 'var(--text)' }}>
            Practice Questions
          </h1>
          <p className="text-base" style={{ color: 'var(--text-2)' }}>
            Practice with real interview questions. Think first, then reveal the answer.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Category Filter */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-3)' }}>
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  categoryFilter === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'hover:bg-opacity-80'
                }`}
                style={categoryFilter !== 'all' ? { background: 'var(--bg-section)', color: 'var(--text-2)' } : {}}
              >
                All
              </button>
              {interviewCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    categoryFilter === cat.id
                      ? 'ring-2 ring-offset-2'
                      : 'hover:bg-opacity-80'
                  }`}
                  style={
                    categoryFilter === cat.id
                      ? { background: cat.bgColor, color: cat.color }
                      : { background: 'var(--bg-section)', color: 'var(--text-2)' }
                  }
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty & Type Filters */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-3)' }}>
                Difficulty
              </label>
              <div className="flex flex-wrap gap-2">
                {['all', 'beginner', 'intermediate', 'advanced'].map(diff => (
                  <button
                    key={diff}
                    onClick={() => setDifficultyFilter(diff)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                      difficultyFilter === diff
                        ? 'bg-indigo-600 text-white'
                        : ''
                    }`}
                    style={difficultyFilter !== diff ? { background: 'var(--bg-section)', color: 'var(--text-2)' } : {}}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-3)' }}>
                Type
              </label>
              <div className="flex flex-wrap gap-2">
                {['all', 'theory', 'output', 'coding', 'scenario'].map(type => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                      typeFilter === type
                        ? 'bg-indigo-600 text-white'
                        : ''
                    }`}
                    style={typeFilter !== type ? { background: 'var(--bg-section)', color: 'var(--text-2)' } : {}}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm font-semibold" style={{ color: 'var(--text-2)' }}>
            Showing {filtered.length} question{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {filtered.map(question => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text-2)' }}>
              No questions found
            </p>
            <p className="text-sm" style={{ color: 'var(--text-3)' }}>
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
