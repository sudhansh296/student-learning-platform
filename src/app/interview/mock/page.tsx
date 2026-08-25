'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Users, Clock, Target, Play, ChevronRight,
  CheckCircle2, XCircle, BarChart2, RotateCcw, Eye, AlertTriangle
} from 'lucide-react';
import { allInterviewQuestions, interviewCategories } from '@/data/interview';
import { InterviewQuestion } from '@/lib/interview-types';

// ─── Types ────────────────────────────────────────────────────────────────────
type Role = 'frontend' | 'backend' | 'fullstack' | 'javascript';
type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'mixed';
type SessionMode = 'setup' | 'session' | 'results';
type AnswerResult = 'confident' | 'partial' | 'missed';

interface SessionQuestion {
  question: InterviewQuestion;
  timeSpent: number;      // seconds
  result: AnswerResult | null;
  revealed: boolean;
}

// ─── Role definitions (what categories each role focuses on) ─────────────────
const ROLES: Record<Role, { label: string; icon: string; description: string; categories: string[]; color: string }> = {
  frontend: {
    label: 'Frontend Developer',
    icon: '🎨',
    description: 'HTML, CSS, JavaScript, React, Performance',
    categories: ['html', 'css', 'javascript', 'react', 'frontend'],
    color: '#61DAFB',
  },
  backend: {
    label: 'Backend Developer',
    icon: '⚙️',
    description: 'Node.js, REST API, Databases, Security',
    categories: ['nodejs', 'backend', 'rest-api', 'database', 'security'],
    color: '#339933',
  },
  fullstack: {
    label: 'Full-Stack Developer',
    icon: '🚀',
    description: 'All frontend + backend topics',
    categories: ['html', 'css', 'javascript', 'react', 'nodejs', 'backend', 'rest-api', 'database', 'security'],
    color: '#6366F1',
  },
  javascript: {
    label: 'JavaScript Developer',
    icon: '⚡',
    description: 'Core JS, ES6+, Async, Algorithms',
    categories: ['javascript', 'coding'],
    color: '#F7DF1E',
  },
};

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string; desc: string }[] = [
  { value: 'beginner', label: 'Beginner', desc: 'Fresher / first job' },
  { value: 'intermediate', label: 'Intermediate', desc: '1–3 years experience' },
  { value: 'advanced', label: 'Advanced', desc: '3+ years experience' },
  { value: 'mixed', label: 'Mixed', desc: 'Realistic interview mix' },
];

const SESSION_LENGTHS = [5, 8, 10, 15];

// ─── Timer hook ───────────────────────────────────────────────────────────────
function useTimer(running: boolean) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const reset = useCallback(() => setSeconds(0), []);
  return { seconds, reset };
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ─── Build question pool for a session ───────────────────────────────────────
function buildSession(role: Role, difficulty: Difficulty, count: number): SessionQuestion[] {
  const roleCats = ROLES[role].categories;
  let pool = allInterviewQuestions.filter(q => roleCats.includes(q.category));

  if (difficulty !== 'mixed') {
    pool = pool.filter(q => q.difficulty === difficulty);
  }

  // Shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, count).map(q => ({
    question: q,
    timeSpent: 0,
    result: null,
    revealed: false,
  }));
}

// ─── Score helpers ────────────────────────────────────────────────────────────
function getGrade(pct: number) {
  if (pct >= 85) return { label: 'Outstanding! 🏆', color: '#10B981', bg: '#ECFDF5' };
  if (pct >= 70) return { label: 'Great Job! 🎉', color: '#6366F1', bg: '#EEF2FF' };
  if (pct >= 55) return { label: 'Good Effort 👍', color: '#F59E0B', bg: '#FEF3C7' };
  if (pct >= 40) return { label: 'Keep Practicing 📚', color: '#F97316', bg: '#FFF7ED' };
  return { label: 'Needs More Study 💪', color: '#EF4444', bg: '#FEF2F2' };
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MockInterviewPage() {
  const [mode, setMode] = useState<SessionMode>('setup');
  const [role, setRole] = useState<Role>('frontend');
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');
  const [sessionLength, setSessionLength] = useState(8);
  const [session, setSession] = useState<SessionQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const { seconds, reset: resetTimer } = useTimer(timerRunning);

  const current = session[currentIdx];

  // ─── Start session ──────────────────────────────────────────────────────────
  const startSession = () => {
    const questions = buildSession(role, difficulty, sessionLength);
    if (questions.length === 0) return;
    setSession(questions);
    setCurrentIdx(0);
    setTimerRunning(true);
    resetTimer();
    setMode('session');
  };

  // ─── Reveal answer ──────────────────────────────────────────────────────────
  const revealAnswer = () => {
    setTimerRunning(false);
    setSession(prev => {
      const updated = [...prev];
      updated[currentIdx] = { ...updated[currentIdx], revealed: true, timeSpent: seconds };
      return updated;
    });
  };

  // ─── Rate answer ───────────────────────────────────────────────────────────
  const rateAnswer = (result: AnswerResult) => {
    const updated = [...session];
    updated[currentIdx] = { ...updated[currentIdx], result };
    setSession(updated);

    if (currentIdx < session.length - 1) {
      setCurrentIdx(currentIdx + 1);
      resetTimer();
      setTimerRunning(true);
    } else {
      setTimerRunning(false);
      setMode('results');
    }
  };

  // ─── SETUP screen ──────────────────────────────────────────────────────────
  if (mode === 'setup') {
    const poolSize = allInterviewQuestions.filter(q => {
      const inRole = ROLES[role].categories.includes(q.category);
      const inDiff = difficulty === 'mixed' ? true : q.difficulty === difficulty;
      return inRole && inDiff;
    }).length;

    return (
      <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Link href="/interview" className="inline-flex items-center gap-2 mb-6 text-sm font-medium hover:gap-3 transition-all" style={{ color: 'var(--text-2)' }}>
            <ArrowLeft className="w-4 h-4" />Back to Interview Prep
          </Link>

          {/* Header */}
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-xl bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center shrink-0">
              <Users className="w-7 h-7 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold" style={{ color: 'var(--text)' }}>Mock Interview Simulator</h1>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-2)' }}>
                Simulate a real interview — answer each question aloud, then rate yourself
              </p>
            </div>
          </div>

          {/* How it works */}
          <div className="p-4 rounded-xl mt-6 mb-8" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
            <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text)' }}>How it works</h3>
            <div className="grid grid-cols-4 gap-3 text-center">
              {[
                { icon: '🎯', step: '1', label: 'Pick role & difficulty' },
                { icon: '🗣️', step: '2', label: 'Answer out loud' },
                { icon: '👁️', step: '3', label: 'Reveal & compare' },
                { icon: '📊', step: '4', label: 'Get score report' },
              ].map(item => (
                <div key={item.step} className="p-3 rounded-lg" style={{ background: 'var(--bg-section)' }}>
                  <div className="text-xl mb-1">{item.icon}</div>
                  <div className="text-xs font-bold mb-1" style={{ color: 'var(--text)' }}>Step {item.step}</div>
                  <div className="text-xs" style={{ color: 'var(--text-3)' }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Role selection */}
          <div className="mb-6">
            <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text)' }}>Select your target role</h3>
            <div className="grid grid-cols-2 gap-3">
              {(Object.entries(ROLES) as [Role, typeof ROLES[Role]][]).map(([key, r]) => (
                <button
                  key={key}
                  onClick={() => setRole(key)}
                  className="p-4 rounded-xl text-left border-2 transition-all"
                  style={role === key
                    ? { background: `${r.color}15`, borderColor: r.color }
                    : { background: 'var(--card)', borderColor: 'var(--line)' }
                  }
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{r.icon}</span>
                    <span className="font-bold text-sm" style={{ color: 'var(--text)' }}>{r.label}</span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-3)' }}>{r.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="mb-6">
            <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text)' }}>Experience level</h3>
            <div className="grid grid-cols-4 gap-2">
              {DIFFICULTY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setDifficulty(opt.value)}
                  className="p-3 rounded-xl border-2 text-center transition-all"
                  style={difficulty === opt.value
                    ? { background: '#4F46E515', borderColor: '#4F46E5' }
                    : { background: 'var(--card)', borderColor: 'var(--line)' }
                  }
                >
                  <div className="text-xs font-bold mb-0.5" style={{ color: difficulty === opt.value ? '#4F46E5' : 'var(--text)' }}>
                    {opt.label}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-3)' }}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Session length */}
          <div className="mb-8">
            <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text)' }}>Number of questions</h3>
            <div className="flex gap-2">
              {SESSION_LENGTHS.map(n => (
                <button
                  key={n}
                  onClick={() => setSessionLength(n)}
                  className="w-16 h-10 rounded-xl font-bold text-sm border-2 transition-all"
                  style={sessionLength === n
                    ? { background: '#4F46E5', color: '#fff', borderColor: '#4F46E5' }
                    : { background: 'var(--card)', color: 'var(--text-2)', borderColor: 'var(--line)' }
                  }
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="text-xs mt-2" style={{ color: 'var(--text-3)' }}>
              {poolSize} questions available for this selection
            </p>
          </div>

          <button
            onClick={startSession}
            disabled={poolSize === 0}
            className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all disabled:opacity-40"
            style={{ background: '#4F46E5', color: '#fff' }}
          >
            <Play className="w-5 h-5" />
            Start Mock Interview ({Math.min(sessionLength, poolSize)} questions)
          </button>
        </div>
      </div>
    );
  }

  // ─── SESSION screen ─────────────────────────────────────────────────────────
  if (mode === 'session' && current) {
    const cat = interviewCategories.find(c => c.id === current.question.category);
    const progress = ((currentIdx + 1) / session.length) * 100;

    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
        {/* Progress bar */}
        <div className="h-1.5" style={{ background: 'var(--line)' }}>
          <div className="h-1.5 bg-orange-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 w-full flex flex-col flex-1">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => { setTimerRunning(false); setMode('setup'); }}
              className="text-sm flex items-center gap-1"
              style={{ color: 'var(--text-2)' }}
            >
              <ArrowLeft className="w-4 h-4" /> Exit
            </button>

            <div className="flex items-center gap-3">
              {/* Timer */}
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono font-bold text-sm"
                style={{
                  background: seconds > 90 ? '#FEF2F2' : 'var(--bg-section)',
                  color: seconds > 90 ? '#EF4444' : 'var(--text-2)'
                }}
              >
                <Clock className="w-3.5 h-3.5" />
                {formatTime(seconds)}
              </div>
              <span className="text-sm font-semibold" style={{ color: 'var(--text-2)' }}>
                {currentIdx + 1} / {session.length}
              </span>
            </div>
          </div>

          {/* Question card */}
          <div className="rounded-2xl flex-1 flex flex-col" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
            <div className="p-6 flex-1 flex flex-col">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {cat && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: cat.bgColor, color: cat.color }}>
                    {cat.icon} {cat.name}
                  </span>
                )}
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  current.question.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                  current.question.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {current.question.difficulty}
                </span>
              </div>

              {/* Question */}
              <h2 className="text-xl font-bold mb-6 leading-snug" style={{ color: 'var(--text)' }}>
                {current.question.question}
              </h2>

              {/* Pre-reveal: prompt to answer out loud */}
              {!current.revealed && (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="text-center mb-6">
                    <div className="text-5xl mb-4">🗣️</div>
                    <p className="text-base font-semibold mb-1" style={{ color: 'var(--text)' }}>
                      Answer this question out loud
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-3)' }}>
                      Explain it as if you&apos;re in a real interview. Take your time.
                    </p>
                  </div>
                  <button
                    onClick={revealAnswer}
                    className="px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all"
                    style={{ background: '#4F46E5', color: '#fff' }}
                  >
                    <Eye className="w-4 h-4" />
                    Reveal Answer
                  </button>
                </div>
              )}

              {/* Post-reveal: show answer + rate */}
              {current.revealed && (
                <div className="flex-1 space-y-4">
                  {/* Short answer */}
                  <div className="p-4 rounded-xl" style={{ background: 'var(--bg-section)' }}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-3)' }}>Short Answer</p>
                    <p className="text-sm leading-relaxed font-medium" style={{ color: 'var(--text)' }}>
                      {current.question.shortAnswer}
                    </p>
                  </div>

                  {/* Interview answer */}
                  {current.question.interviewAnswer && (
                    <div className="p-4 rounded-xl" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                      <p className="text-xs font-bold uppercase tracking-wider mb-2 text-green-700">Ideal Interview Answer</p>
                      <p className="text-sm leading-relaxed text-green-800">
                        {current.question.interviewAnswer}
                      </p>
                    </div>
                  )}

                  {/* Common mistakes */}
                  {current.question.commonMistakes && current.question.commonMistakes.length > 0 && (
                    <div className="p-4 rounded-xl" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                      <p className="text-xs font-bold uppercase tracking-wider mb-2 text-red-700 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Common Mistakes
                      </p>
                      <ul className="space-y-1">
                        {(current.question.commonMistakes ?? []).slice(0, 2).map((m, i) => (
                          <li key={i} className="text-xs text-red-700">❌ {m}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Self-rating */}
                  <div className="pt-2">
                    <p className="text-xs font-bold uppercase tracking-wider mb-3 text-center" style={{ color: 'var(--text-3)' }}>
                      How well did you answer?
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      <button onClick={() => rateAnswer('missed')}
                        className="py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-all">
                        <XCircle className="w-4 h-4" /> Missed It
                      </button>
                      <button onClick={() => rateAnswer('partial')}
                        className="py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200 transition-all">
                        ⚡ Partially
                      </button>
                      <button onClick={() => rateAnswer('confident')}
                        className="py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 transition-all">
                        <CheckCircle2 className="w-4 h-4" /> Nailed It!
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Question dots */}
          <div className="flex justify-center gap-1.5 mt-4">
            {session.map((q, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full transition-all"
                style={{
                  background: i === currentIdx ? '#4F46E5'
                    : q.result === 'confident' ? '#10B981'
                    : q.result === 'partial' ? '#F59E0B'
                    : q.result === 'missed' ? '#EF4444'
                    : 'var(--line)'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── RESULTS screen ─────────────────────────────────────────────────────────
  if (mode === 'results') {
    const confident = session.filter(q => q.result === 'confident').length;
    const partial = session.filter(q => q.result === 'partial').length;
    const missed = session.filter(q => q.result === 'missed').length;
    const score = Math.round(((confident + partial * 0.5) / session.length) * 100);
    const grade = getGrade(score);
    const avgTime = Math.round(session.reduce((sum, q) => sum + q.timeSpent, 0) / session.length);

    // Weak categories
    const weakCats = session
      .filter(q => q.result === 'missed')
      .reduce<Record<string, number>>((acc, q) => {
        acc[q.question.category] = (acc[q.question.category] || 0) + 1;
        return acc;
      }, {});

    // Strong categories
    const strongCats = session
      .filter(q => q.result === 'confident')
      .reduce<Record<string, number>>((acc, q) => {
        acc[q.question.category] = (acc[q.question.category] || 0) + 1;
        return acc;
      }, {});

    return (
      <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Score */}
          <div className="text-center mb-8">
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-4 border-4"
              style={{ background: grade.bg, borderColor: grade.color }}
            >
              <span className="text-4xl font-extrabold" style={{ color: grade.color }}>{score}%</span>
            </div>
            <h1 className="text-2xl font-extrabold mb-1" style={{ color: 'var(--text)' }}>Interview Complete!</h1>
            <p className="font-bold text-lg" style={{ color: grade.color }}>{grade.label}</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-3)' }}>
              {ROLES[role].icon} {ROLES[role].label} · {difficulty === 'mixed' ? 'Mixed' : difficulty} · Avg {formatTime(avgTime)}/question
            </p>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Nailed It', count: confident, pct: Math.round((confident / session.length) * 100), color: '#10B981', bg: '#ECFDF5', icon: '✅' },
              { label: 'Partially', count: partial, pct: Math.round((partial / session.length) * 100), color: '#F59E0B', bg: '#FEF3C7', icon: '⚡' },
              { label: 'Missed', count: missed, pct: Math.round((missed / session.length) * 100), color: '#EF4444', bg: '#FEF2F2', icon: '❌' },
            ].map(item => (
              <div key={item.label} className="p-4 rounded-xl text-center" style={{ background: item.bg }}>
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="text-2xl font-extrabold" style={{ color: item.color }}>{item.count}</div>
                <div className="text-xs font-bold" style={{ color: item.color }}>{item.label}</div>
                <div className="text-xs opacity-70" style={{ color: item.color }}>{item.pct}%</div>
              </div>
            ))}
          </div>

          {/* Score bar */}
          <div className="flex h-3 rounded-full overflow-hidden gap-0.5 mb-8">
            <div className="bg-green-500" style={{ width: `${Math.round((confident / session.length) * 100)}%` }} />
            <div className="bg-yellow-400" style={{ width: `${Math.round((partial / session.length) * 100)}%` }} />
            <div className="bg-red-400" style={{ width: `${Math.round((missed / session.length) * 100)}%` }} />
          </div>

          {/* Weak topics */}
          {Object.keys(weakCats).length > 0 && (
            <div className="p-5 rounded-xl mb-4" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
              <h3 className="font-bold text-red-700 flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4" /> Topics to Study More
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(weakCats).sort((a, b) => b[1] - a[1]).map(([catId, count]) => {
                  const cat = interviewCategories.find(c => c.id === catId);
                  return (
                    <Link key={catId} href={`/interview/${catId}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-100 text-red-700 hover:bg-red-200 transition-colors">
                      {cat?.icon} {cat?.name} ({count} missed)
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Strong topics */}
          {Object.keys(strongCats).length > 0 && (
            <div className="p-5 rounded-xl mb-8" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
              <h3 className="font-bold text-green-700 flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4" /> You&apos;re Strong At
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(strongCats).sort((a, b) => b[1] - a[1]).map(([catId, count]) => {
                  const cat = interviewCategories.find(c => c.id === catId);
                  return (
                    <span key={catId} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-green-100 text-green-700">
                      {cat?.icon} {cat?.name} ({count} nailed)
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Question review */}
          <div className="mb-8">
            <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <BarChart2 className="w-4 h-4" /> Question Review
            </h3>
            <div className="space-y-2">
              {session.map((q, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
                  <span className="shrink-0 mt-0.5 text-base">
                    {q.result === 'confident' ? '✅' : q.result === 'partial' ? '⚡' : '❌'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug" style={{ color: 'var(--text)' }}>
                      {q.question.question}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
                      {formatTime(q.timeSpent)} · {q.question.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => { setMode('setup'); }}
              className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
              style={{ background: '#4F46E5', color: '#fff' }}
            >
              <RotateCcw className="w-4 h-4" /> New Interview
            </button>
            <Link href="/interview/rapid-revision"
              className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
              style={{ background: 'var(--bg-section)', color: 'var(--text)' }}>
              ⚡ Quick Revision
            </Link>
          </div>

          <Link href="/interview" className="block text-center mt-4 text-sm" style={{ color: 'var(--text-2)' }}>
            ← Back to Interview Prep
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
