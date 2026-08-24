'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Zap, ChevronRight, RotateCcw, CheckCircle2, RefreshCw, XCircle, BookOpen, Trophy, Target } from 'lucide-react';
import { allInterviewQuestions, interviewCategories } from '@/data/interview';
import { InterviewQuestion } from '@/lib/interview-types';

type CardStatus = 'know' | 'revise' | 'skip';

interface SessionCard {
  question: InterviewQuestion;
  status: CardStatus | null;
}

const categoryColors: Record<string, string> = {
  html: '#E34F26', css: '#264DE4', javascript: '#F7DF1E', react: '#61DAFB',
  nodejs: '#339933', backend: '#6366F1', frontend: '#06B6D4', database: '#10B981',
  'rest-api': '#F59E0B', security: '#EF4444', project: '#8B5CF6', coding: '#06B6D4', hr: '#EC4899',
};

const DECK_SIZES = [10, 20, 30, 50];

export default function RapidRevisionPage() {
  const [mode, setMode] = useState<'setup' | 'session' | 'results'>('setup');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [deckSize, setDeckSize] = useState<number>(20);
  const [deck, setDeck] = useState<SessionCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [results, setResults] = useState<{ know: number; revise: number; skip: number }>({ know: 0, revise: 0, skip: 0 });

  const availableCategories = interviewCategories.filter(cat =>
    allInterviewQuestions.some(q => q.category === cat.id)
  );

  const buildDeck = useCallback(() => {
    let pool = [...allInterviewQuestions];
    if (selectedCategories.length > 0) {
      pool = pool.filter(q => selectedCategories.includes(q.category));
    }
    if (selectedDifficulty !== 'all') {
      pool = pool.filter(q => q.difficulty === selectedDifficulty);
    }
    // Shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const selected = pool.slice(0, deckSize);
    return selected.map(q => ({ question: q, status: null }));
  }, [selectedCategories, selectedDifficulty, deckSize]);

  const startSession = () => {
    const newDeck = buildDeck();
    if (newDeck.length === 0) return;
    setDeck(newDeck);
    setCurrentIndex(0);
    setShowAnswer(false);
    setResults({ know: 0, revise: 0, skip: 0 });
    setMode('session');
  };

  const rate = (status: CardStatus) => {
    const updated = [...deck];
    updated[currentIndex] = { ...updated[currentIndex], status };
    setDeck(updated);

    const newResults = { ...results, [status]: results[status] + 1 };
    setResults(newResults);

    if (currentIndex < deck.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      setMode('results');
    }
  };

  const toggleCategory = (catId: string) => {
    setSelectedCategories(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  const currentCard = deck[currentIndex];
  const progress = deck.length > 0 ? ((currentIndex) / deck.length) * 100 : 0;

  if (mode === 'setup') {
    const filteredCount = allInterviewQuestions.filter(q =>
      (selectedCategories.length === 0 || selectedCategories.includes(q.category)) &&
      (selectedDifficulty === 'all' || q.difficulty === selectedDifficulty)
    ).length;

    return (
      <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Link href="/interview" className="inline-flex items-center gap-2 mb-6 text-sm font-medium hover:gap-3 transition-all" style={{ color: 'var(--text-2)' }}>
            <ArrowLeft className="w-4 h-4" />Back to Interview Prep
          </Link>

          {/* Hero */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-xl bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center shrink-0">
              <Zap className="w-7 h-7 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold" style={{ color: 'var(--text)' }}>Rapid Revision</h1>
              <p className="text-sm" style={{ color: 'var(--text-2)' }}>
                Flashcard-style review — rate each question: Know It, Revise Later, or Skip
              </p>
            </div>
          </div>

          {/* How it works */}
          <div className="p-4 rounded-xl mb-8" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
            <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text)' }}>How it works</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: '✅', label: 'Know It', desc: 'Confident — move on', color: 'text-green-600' },
                { icon: '🔄', label: 'Revise Later', desc: 'Shaky — review again', color: 'text-yellow-600' },
                { icon: '❌', label: 'Don\'t Know', desc: 'Study this topic', color: 'text-red-600' },
              ].map(item => (
                <div key={item.label} className="text-center p-3 rounded-lg" style={{ background: 'var(--bg-section)' }}>
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className={`text-xs font-bold ${item.color}`}>{item.label}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Filter by category */}
          <div className="mb-6">
            <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text)' }}>
              Filter by Topic <span className="font-normal text-xs" style={{ color: 'var(--text-3)' }}>(leave empty for all)</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                  style={selectedCategories.includes(cat.id)
                    ? { background: cat.bgColor, color: cat.color, borderColor: cat.color }
                    : { background: 'var(--bg-section)', color: 'var(--text-2)', borderColor: 'var(--line)' }
                  }
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Filter by difficulty */}
          <div className="mb-6">
            <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text)' }}>Difficulty</h3>
            <div className="flex gap-2">
              {['all', 'beginner', 'intermediate', 'advanced'].map(diff => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all"
                  style={selectedDifficulty === diff
                    ? { background: '#4F46E5', color: '#fff' }
                    : { background: 'var(--bg-section)', color: 'var(--text-2)' }
                  }
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Deck size */}
          <div className="mb-8">
            <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text)' }}>Number of cards</h3>
            <div className="flex gap-2">
              {DECK_SIZES.map(size => (
                <button
                  key={size}
                  onClick={() => setDeckSize(size)}
                  className="w-14 h-10 rounded-lg text-sm font-bold transition-all"
                  style={deckSize === size
                    ? { background: '#4F46E5', color: '#fff' }
                    : { background: 'var(--bg-section)', color: 'var(--text-2)' }
                  }
                >
                  {size}
                </button>
              ))}
            </div>
            <p className="text-xs mt-2" style={{ color: 'var(--text-3)' }}>
              {filteredCount} questions match your filters
            </p>
          </div>

          <button
            onClick={startSession}
            disabled={filteredCount === 0}
            className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all disabled:opacity-40"
            style={{ background: '#4F46E5', color: '#fff' }}
          >
            <Zap className="w-5 h-5" />
            Start Revision ({Math.min(deckSize, filteredCount)} cards)
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'session' && currentCard) {
    const cat = interviewCategories.find(c => c.id === currentCard.question.category);

    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
        {/* Progress bar */}
        <div className="h-1.5 w-full" style={{ background: 'var(--line)' }}>
          <div className="h-1.5 bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8 w-full flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setMode('setup')} className="text-sm flex items-center gap-1" style={{ color: 'var(--text-2)' }}>
              <ArrowLeft className="w-4 h-4" /> Exit
            </button>
            <span className="text-sm font-semibold" style={{ color: 'var(--text-2)' }}>
              {currentIndex + 1} / {deck.length}
            </span>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="text-green-600">✅ {results.know}</span>
              <span className="text-yellow-600">🔄 {results.revise}</span>
              <span className="text-red-500">❌ {results.skip}</span>
            </div>
          </div>

          {/* Card */}
          <div className="flex-1 flex flex-col">
            <div className="rounded-2xl p-6 mb-4 flex-1 flex flex-col" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
              {/* Category + Difficulty */}
              <div className="flex items-center gap-2 mb-4">
                {cat && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: cat.bgColor, color: cat.color }}>
                    {cat.icon} {cat.name}
                  </span>
                )}
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  currentCard.question.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                  currentCard.question.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-700' :
                  'bg-orange-100 text-orange-700'}`}>
                  {currentCard.question.difficulty}
                </span>
              </div>

              {/* Question */}
              <h2 className="text-xl font-bold mb-6 leading-snug" style={{ color: 'var(--text)' }}>
                {currentCard.question.question}
              </h2>

              {/* Answer */}
              {showAnswer ? (
                <div className="flex-1 space-y-4 animate-in fade-in duration-300">
                  <div className="p-4 rounded-xl" style={{ background: 'var(--bg-section)' }}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-3)' }}>Short Answer</p>
                    <p className="text-sm leading-relaxed font-medium" style={{ color: 'var(--text)' }}>
                      {currentCard.question.shortAnswer}
                    </p>
                  </div>
                  {currentCard.question.interviewAnswer && (
                    <div className="p-4 rounded-xl" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                      <p className="text-xs font-bold uppercase tracking-wider mb-2 text-green-700">How to say it in an interview</p>
                      <p className="text-sm leading-relaxed text-green-800">
                        {currentCard.question.interviewAnswer}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <p className="text-sm mb-4 text-center" style={{ color: 'var(--text-3)' }}>
                    Think about your answer first, then reveal
                  </p>
                  <button
                    onClick={() => setShowAnswer(true)}
                    className="px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all"
                    style={{ background: '#4F46E5', color: '#fff' }}
                  >
                    Show Answer <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Rating buttons */}
            {showAnswer && (
              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => rate('skip')}
                  className="py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all bg-red-50 text-red-600 hover:bg-red-100 border border-red-200">
                  <XCircle className="w-4 h-4" /> Don't Know
                </button>
                <button onClick={() => rate('revise')}
                  className="py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200">
                  <RefreshCw className="w-4 h-4" /> Revise Later
                </button>
                <button onClick={() => rate('know')}
                  className="py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all bg-green-50 text-green-700 hover:bg-green-100 border border-green-200">
                  <CheckCircle2 className="w-4 h-4" /> Know It!
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'results') {
    const total = deck.length;
    const knowPct = Math.round((results.know / total) * 100);
    const revisePct = Math.round((results.revise / total) * 100);
    const skipPct = Math.round((results.skip / total) * 100);

    const weakTopics = deck
      .filter(c => c.status === 'skip')
      .reduce<Record<string, number>>((acc, c) => {
        const cat = c.question.category;
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {});

    const reviseTopics = deck
      .filter(c => c.status === 'revise')
      .reduce<Record<string, number>>((acc, c) => {
        const cat = c.question.category;
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {});

    const grade = knowPct >= 80 ? { label: 'Excellent! 🎉', color: 'text-green-600' }
      : knowPct >= 60 ? { label: 'Good Progress 👍', color: 'text-blue-600' }
      : knowPct >= 40 ? { label: 'Keep Studying 📚', color: 'text-yellow-600' }
      : { label: 'Needs Work 💪', color: 'text-red-600' };

    return (
      <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
        <div className="max-w-2xl mx-auto px-4 py-12">
          {/* Score header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--text)' }}>Session Complete!</h1>
            <p className={`text-lg font-bold ${grade.color}`}>{grade.label}</p>
          </div>

          {/* Score breakdown */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Know It', count: results.know, pct: knowPct, color: 'bg-green-500', textColor: 'text-green-700', bg: 'bg-green-50', icon: '✅' },
              { label: 'Revise Later', count: results.revise, pct: revisePct, color: 'bg-yellow-400', textColor: 'text-yellow-700', bg: 'bg-yellow-50', icon: '🔄' },
              { label: "Don't Know", count: results.skip, pct: skipPct, color: 'bg-red-400', textColor: 'text-red-700', bg: 'bg-red-50', icon: '❌' },
            ].map(item => (
              <div key={item.label} className={`p-4 rounded-xl text-center ${item.bg}`}>
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className={`text-2xl font-extrabold ${item.textColor}`}>{item.count}</div>
                <div className={`text-xs font-bold ${item.textColor}`}>{item.label}</div>
                <div className={`text-xs ${item.textColor} opacity-70`}>{item.pct}%</div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex h-4 rounded-full overflow-hidden gap-0.5">
              <div className="bg-green-500 transition-all" style={{ width: `${knowPct}%` }} />
              <div className="bg-yellow-400 transition-all" style={{ width: `${revisePct}%` }} />
              <div className="bg-red-400 transition-all" style={{ width: `${skipPct}%` }} />
            </div>
          </div>

          {/* Weak topics */}
          {Object.keys(weakTopics).length > 0 && (
            <div className="p-5 rounded-xl mb-4" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
              <h3 className="font-bold mb-3 text-red-700 flex items-center gap-2">
                <Target className="w-4 h-4" /> Topics to Study
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(weakTopics).sort((a, b) => b[1] - a[1]).map(([cat, count]) => {
                  const catMeta = interviewCategories.find(c => c.id === cat);
                  return (
                    <Link key={cat} href={`/interview/${cat}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-100 text-red-700 hover:bg-red-200 transition-colors">
                      {catMeta?.icon} {catMeta?.name} ({count})
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Revise topics */}
          {Object.keys(reviseTopics).length > 0 && (
            <div className="p-5 rounded-xl mb-8" style={{ background: '#FEFCE8', border: '1px solid #FDE047' }}>
              <h3 className="font-bold mb-3 text-yellow-700 flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Topics to Revise
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(reviseTopics).sort((a, b) => b[1] - a[1]).map(([cat, count]) => {
                  const catMeta = interviewCategories.find(c => c.id === cat);
                  return (
                    <Link key={cat} href={`/interview/${cat}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors">
                      {catMeta?.icon} {catMeta?.name} ({count})
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => { setMode('setup'); }}
              className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
              style={{ background: '#4F46E5', color: '#fff' }}>
              <RotateCcw className="w-4 h-4" /> New Session
            </button>
            <button onClick={() => {
              const reviseDeck = deck.filter(c => c.status !== 'know').map(c => ({ ...c, status: null }));
              if (reviseDeck.length === 0) return;
              for (let i = reviseDeck.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [reviseDeck[i], reviseDeck[j]] = [reviseDeck[j], reviseDeck[i]];
              }
              setDeck(reviseDeck);
              setCurrentIndex(0);
              setShowAnswer(false);
              setResults({ know: 0, revise: 0, skip: 0 });
              setMode('session');
            }}
              className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
              style={{ background: 'var(--bg-section)', color: 'var(--text)' }}>
              <RefreshCw className="w-4 h-4" /> Retry Weak Cards ({results.revise + results.skip})
            </button>
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
