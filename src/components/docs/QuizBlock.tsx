'use client';

import { useState } from 'react';
import { Check, X, RotateCcw, Trophy } from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export function QuizBlock({ questions, title }: { questions: QuizQuestion[]; title?: string }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [current, setCurrent] = useState(0);

  const score = submitted ? questions.filter(q => answers[q.id] === q.correct).length : 0;
  const pct = submitted ? Math.round((score / questions.length) * 100) : 0;
  const q = questions[current];

  function reset() {
    setAnswers({});
    setSubmitted(false);
    setCurrent(0);
  }

  return (
    <div className="my-8 rounded-xl border border-border overflow-hidden bg-background">
      {/* Header */}
      <div className="px-5 py-3 bg-purple-50 dark:bg-purple-950/40 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎯</span>
          <h3 className="font-bold text-foreground text-sm">{title || 'Knowledge Quiz'}</h3>
          <span className="text-xs text-muted-foreground">{questions.length} questions</span>
        </div>
        {submitted && (
          <button onClick={reset} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <RotateCcw className="w-3.5 h-3.5" /> Retake
          </button>
        )}
      </div>

      {!submitted ? (
        <div className="p-6">
          {/* Progress */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${((current + 1) / questions.length) * 100}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground shrink-0">{current + 1} / {questions.length}</span>
          </div>

          <p className="text-sm font-semibold text-foreground mb-4 leading-snug">{q.question}</p>

          <div className="space-y-2 mb-6">
            {q.options.map((opt, i) => {
              const isSelected = answers[q.id] === i;
              return (
                <button
                  key={i}
                  onClick={() => setAnswers(a => ({ ...a, [q.id]: i }))}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-sm text-left transition-all ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200'
                      : 'border-border hover:border-purple-300 dark:hover:border-purple-700 text-foreground'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${isSelected ? 'border-purple-500 bg-purple-500 text-white' : 'border-muted-foreground/30'}`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          <div className="flex gap-3">
            {current > 0 && (
              <button onClick={() => setCurrent(c => c - 1)}
                className="px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
                ← Back
              </button>
            )}
            {current < questions.length - 1 ? (
              <button
                onClick={() => { if (answers[q.id] !== undefined) setCurrent(c => c + 1); }}
                disabled={answers[q.id] === undefined}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-muted disabled:text-muted-foreground text-white text-sm font-medium rounded-lg transition-colors"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={() => { if (answers[q.id] !== undefined) setSubmitted(true); }}
                disabled={answers[q.id] === undefined}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-muted disabled:text-muted-foreground text-white text-sm font-medium rounded-lg transition-colors"
              >
                Submit Quiz ✓
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="p-6">
          {/* Score */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl font-bold"
              style={{ background: pct >= 80 ? '#dcfce7' : pct >= 50 ? '#fef9c3' : '#fee2e2',
                       color: pct >= 80 ? '#15803d' : pct >= 50 ? '#854d0e' : '#b91c1c' }}>
              {pct}%
            </div>
            <p className="font-bold text-foreground text-lg">{score}/{questions.length} correct</p>
            <p className="text-sm text-muted-foreground mt-1">
              {pct === 100 ? '🎉 Perfect score!' : pct >= 80 ? '🌟 Great job!' : pct >= 60 ? '👍 Good effort!' : '📚 Keep studying!'}
            </p>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {questions.map((q, i) => {
              const userAns = answers[q.id];
              const correct = userAns === q.correct;
              return (
                <div key={q.id} className={`p-4 rounded-lg border ${correct ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'}`}>
                  <div className="flex items-start gap-2 mb-2">
                    {correct ? <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> : <X className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />}
                    <p className="text-sm font-medium text-foreground">{q.question}</p>
                  </div>
                  {!correct && (
                    <p className="text-xs text-red-700 dark:text-red-300 mb-1 ml-6">
                      Your answer: {q.options[userAns!]} • Correct: {q.options[q.correct]}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground ml-6 leading-relaxed">{q.explanation}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
