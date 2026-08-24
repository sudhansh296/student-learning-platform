'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Code2, ChevronDown, ChevronUp, Play, CheckCircle2, Clock, AlertTriangle, Lightbulb } from 'lucide-react';
import { codingProblems, type CodingProblem } from '@/data/interview/coding-problems';

const difficultyColor: Record<string, string> = {
  Easy: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
  Hard: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
};

function ProblemCard({ problem }: { problem: CodingProblem }) {
  const [expanded, setExpanded] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-5 flex items-center justify-between hover:opacity-90 transition-opacity"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-sm font-bold shrink-0" style={{ color: 'var(--text-3)' }}>#{problem.id}</span>
          <h3 className="font-bold truncate" style={{ color: 'var(--text)' }}>{problem.title}</h3>
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0 ${difficultyColor[problem.difficulty]}`}>
            {problem.difficulty}
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full shrink-0 hidden sm:inline-flex" style={{ background: 'var(--bg-section)', color: 'var(--text-3)' }}>
            {problem.topic}
          </span>
        </div>
        <div className="flex items-center gap-2 ml-3">
          <span className="text-xs flex items-center gap-1 shrink-0" style={{ color: 'var(--text-3)' }}>
            <Clock className="w-3 h-3" />{problem.timeLimit}
          </span>
          {expanded ? <ChevronUp className="w-4 h-4 shrink-0" style={{ color: 'var(--text-3)' }} /> : <ChevronDown className="w-4 h-4 shrink-0" style={{ color: 'var(--text-3)' }} />}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-6 space-y-5" style={{ borderTop: '1px solid var(--line)', paddingTop: '1.25rem' }}>
          {/* Description */}
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>{problem.description}</p>

          {/* Examples */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-3)' }}>Examples</h4>
            <div className="space-y-2">
              {problem.examples.map((ex, i) => (
                <div key={i} className="p-3 rounded-lg font-mono text-xs" style={{ background: 'var(--bg-section)' }}>
                  <span style={{ color: 'var(--text-3)' }}>Input: </span>
                  <span style={{ color: 'var(--text)' }}>{ex.input}</span>
                  <span className="mx-2" style={{ color: 'var(--text-3)' }}>→</span>
                  <span style={{ color: 'var(--text-3)' }}>Output: </span>
                  <span className="text-green-600 dark:text-green-400">{ex.output}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {problem.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--bg-section)', color: 'var(--text-3)' }}>
                #{tag}
              </span>
            ))}
          </div>

          {/* Hints */}
          <div>
            <button
              onClick={() => setShowHints(!showHints)}
              className="flex items-center gap-2 text-sm font-semibold text-yellow-600 dark:text-yellow-400 hover:opacity-80 transition-opacity"
            >
              <Lightbulb className="w-4 h-4" />
              {showHints ? 'Hide Hints' : 'Show Hints'}
            </button>
            {showHints && (
              <ul className="mt-3 space-y-2">
                {problem.hints.map((hint, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-2)' }}>
                    <span className="shrink-0 text-yellow-500 font-bold">{i + 1}.</span>
                    {hint}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Try in Editor */}
          <Link
            href="/playground"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors"
          >
            <Play className="w-4 h-4" />
            Try in Code Editor
          </Link>

          {/* Solution */}
          <div>
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="flex items-center gap-2 text-sm font-semibold hover:opacity-80 transition-opacity"
              style={{ color: 'var(--text-2)' }}
            >
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              {showSolution ? 'Hide Solution' : 'View Solution & Explanation'}
            </button>
            {showSolution && (
              <div className="mt-4 space-y-4">
                <pre className="p-4 rounded-lg text-xs overflow-x-auto" style={{ background: '#1e1e2e', color: '#cdd6f4', fontFamily: 'monospace' }}>
                  <code>{problem.solution}</code>
                </pre>
                <div className="p-3 rounded-lg" style={{ background: 'var(--bg-section)' }}>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
                    💡 {problem.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CodingInterviewPage() {
  const [diffFilter, setDiffFilter] = useState('All');
  const [topicFilter, setTopicFilter] = useState('All');

  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  const topics = ['All', ...Array.from(new Set(codingProblems.map(p => p.topic))).sort()];

  const filtered = codingProblems.filter(p => {
    const matchDiff = diffFilter === 'All' || p.difficulty === diffFilter;
    const matchTopic = topicFilter === 'All' || p.topic === topicFilter;
    return matchDiff && matchTopic;
  });

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-12">
        <Link href="/interview" className="inline-flex items-center gap-2 mb-6 text-sm font-medium hover:gap-3 transition-all" style={{ color: 'var(--text-2)' }}>
          <ArrowLeft className="w-4 h-4" />Back to Interview Prep
        </Link>

        {/* Hero */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
              <Code2 className="w-7 h-7 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold" style={{ color: 'var(--text)' }}>Coding Interview Practice</h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>
                {codingProblems.length} real interview problems — solve, get hints, then check the solution
              </p>
            </div>
          </div>

          {/* Tips Banner */}
          <div className="p-4 rounded-xl mt-6 grid sm:grid-cols-3 gap-4" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
            <div className="flex items-start gap-3">
              <span className="text-xl shrink-0">🧠</span>
              <div>
                <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Think aloud</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-2)' }}>Interviewers care about your problem-solving process, not just the answer.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl shrink-0">⚡</span>
              <div>
                <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Clarify first</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-2)' }}>Ask about edge cases before coding — empty array, null input, duplicates?</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl shrink-0">🔄</span>
              <div>
                <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Brute force first</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-2)' }}>Start with a working solution, then optimize. A slow answer beats no answer.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Approach Guide */}
        <div className="mb-8 p-5 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
          <h2 className="font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            How to Approach Any Coding Problem
          </h2>
          <ol className="space-y-3">
            {[
              { step: '1. Understand', desc: 'Read carefully. Restate the problem in your own words. Ask clarifying questions about constraints and edge cases.' },
              { step: '2. Examples', desc: 'Walk through the provided examples. Create your own edge case (empty input, single element, negatives).' },
              { step: '3. Brute Force', desc: 'Think aloud: "My first approach would be..." even if it\'s O(n²). Explain why you might optimize it.' },
              { step: '4. Optimize', desc: 'Discuss time/space complexity. Ask yourself: can I use a hash map? Can I sort? Can I use two pointers?' },
              { step: '5. Code', desc: 'Write clean, readable code. Use meaningful variable names. Comment complex logic.' },
              { step: '6. Test', desc: 'Trace through your code with the examples. Test edge cases. Fix bugs out loud, don\'t panic.' },
            ].map(({ step, desc }) => (
              <li key={step} className="flex items-start gap-3">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 shrink-0 mt-0.5">{step}</span>
                <p className="text-sm" style={{ color: 'var(--text-2)' }}>{desc}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Difficulty Filters */}
        <div className="flex flex-wrap gap-2 mb-3">
          {difficulties.map(d => (
            <button
              key={d}
              onClick={() => setDiffFilter(d)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${diffFilter === d ? 'bg-indigo-600 text-white' : ''}`}
              style={diffFilter !== d ? { background: 'var(--card)', border: '1px solid var(--line)', color: 'var(--text-2)' } : {}}
            >
              {d} {d === 'All'
                ? `(${codingProblems.length})`
                : `(${codingProblems.filter(p => p.difficulty === d).length})`}
            </button>
          ))}
          <Link
            href="/playground"
            className="ml-auto px-4 py-2 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Play className="w-4 h-4" />Open Code Editor
          </Link>
        </div>

        {/* Topic Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {topics.map(t => (
            <button
              key={t}
              onClick={() => setTopicFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${topicFilter === t ? 'bg-purple-600 text-white' : ''}`}
              style={topicFilter !== t ? { background: 'var(--card)', border: '1px solid var(--line)', color: 'var(--text-3)' } : {}}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm mb-4" style={{ color: 'var(--text-3)' }}>
          Showing {filtered.length} of {codingProblems.length} problems
          {diffFilter !== 'All' && ` · ${diffFilter}`}
          {topicFilter !== 'All' && ` · ${topicFilter}`}
        </p>

        {/* Problems */}
        <div className="space-y-3">
          {filtered.map(problem => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16" style={{ color: 'var(--text-3)' }}>
              No problems match the selected filters.
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="mt-10 p-6 rounded-xl text-center" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
          <h3 className="font-bold mb-2" style={{ color: 'var(--text)' }}>Want more problems?</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-2)' }}>
            Practice on LeetCode, HackerRank, or CodeWars. For web dev specific challenges, check out GreatFrontEnd.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {['LeetCode', 'HackerRank', 'CodeWars', 'GreatFrontEnd'].map(site => (
              <span key={site} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: 'var(--bg-section)', color: 'var(--text-2)' }}>
                {site}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
