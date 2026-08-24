'use client';

import { useState } from 'react';
import { Check, X, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';

interface Exercise {
  id: string;
  question: string;
  type: 'multiple-choice' | 'fill-blank' | 'code-output';
  options?: string[];
  correct: string | number;
  explanation: string;
}

export function ExerciseBlock({ exercises }: { exercises: Exercise[] }) {
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  const score = exercises.filter(e => {
    const ans = answers[e.id];
    return ans !== undefined && String(ans) === String(e.correct);
  }).length;

  const allAnswered = exercises.every(e => answers[e.id] !== undefined);

  return (
    <div className="my-8 rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-3 bg-blue-50 dark:bg-blue-950/40 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">✏️</span>
          <h3 className="font-bold text-foreground text-sm">Exercises</h3>
          <span className="text-xs text-muted-foreground">{exercises.length} questions</span>
        </div>
        {allAnswered && (
          <span className={`text-sm font-bold px-3 py-1 rounded-full ${
            score === exercises.length ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
            : score >= exercises.length / 2 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400'
            : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
          }`}>
            {score}/{exercises.length} correct
          </span>
        )}
      </div>

      <div className="divide-y divide-border">
        {exercises.map((ex, idx) => {
          const userAnswer = answers[ex.id];
          const isAnswered = userAnswer !== undefined;
          const isCorrect = isAnswered && String(userAnswer) === String(ex.correct);
          const isRevealed = revealed[ex.id];

          return (
            <div key={ex.id} className="p-5 bg-background">
              <div className="flex items-start gap-3 mb-4">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                  !isAnswered ? 'bg-muted text-muted-foreground'
                  : isCorrect ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                }`}>
                  {!isAnswered ? idx + 1 : isCorrect ? '✓' : '✗'}
                </span>
                <p className="text-sm font-medium text-foreground leading-snug">{ex.question}</p>
              </div>

              {/* Multiple choice */}
              {ex.type === 'multiple-choice' && ex.options && (
                <div className="ml-9 space-y-2">
                  {ex.options.map((opt, i) => {
                    const isSelected = userAnswer === i;
                    const isCorrectOpt = i === ex.correct;
                    let style = 'border-border bg-background text-foreground hover:border-blue-300 dark:hover:border-blue-700';
                    if (isAnswered) {
                      if (isCorrectOpt) style = 'border-green-400 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300';
                      else if (isSelected && !isCorrectOpt) style = 'border-red-400 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300';
                    } else if (isSelected) {
                      style = 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200';
                    }
                    return (
                      <button
                        key={i}
                        disabled={isAnswered}
                        onClick={() => setAnswers(a => ({ ...a, [ex.id]: i }))}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border text-sm text-left transition-all ${style} ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        <span className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-bold">
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                        {isAnswered && isCorrectOpt && <Check className="w-4 h-4 ml-auto text-green-600" />}
                        {isAnswered && isSelected && !isCorrectOpt && <X className="w-4 h-4 ml-auto text-red-600" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Fill in blank */}
              {ex.type === 'fill-blank' && (
                <div className="ml-9 flex gap-2">
                  <input
                    type="text"
                    disabled={isAnswered}
                    placeholder="Type your answer..."
                    className={`flex-1 px-4 py-2 border rounded-lg text-sm font-mono outline-none transition-all ${
                      !isAnswered ? 'border-border bg-background text-foreground focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20'
                      : isCorrect ? 'border-green-400 bg-green-50 dark:bg-green-900/30 text-green-800'
                      : 'border-red-400 bg-red-50 dark:bg-red-900/30 text-red-800'
                    }`}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !isAnswered) {
                        setAnswers(a => ({ ...a, [ex.id]: (e.target as HTMLInputElement).value.trim() }));
                      }
                    }}
                    onChange={e => {
                      if (!isAnswered) setAnswers(a => ({ ...a, [ex.id]: e.target.value.trim() }));
                    }}
                  />
                  {!isAnswered && (
                    <button
                    onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        setAnswers(a => ({ ...a, [ex.id]: input.value.trim() }));
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                    >
                      Check
                    </button>
                  )}
                </div>
              )}

              {/* Code output */}
              {ex.type === 'code-output' && (
                <div className="ml-9 flex gap-2">
                  <input
                    type="text"
                    disabled={isAnswered}
                    placeholder="What is the output?"
                    className={`flex-1 px-4 py-2 border rounded-lg text-sm font-mono outline-none transition-all ${
                      !isAnswered ? 'border-border bg-background text-foreground focus:border-blue-500'
                      : isCorrect ? 'border-green-400 bg-green-50 dark:bg-green-900/30 text-green-800'
                      : 'border-red-400 bg-red-50 dark:bg-red-900/30 text-red-800'
                    }`}
                    onKeyDown={e => {
                      if (e.key === 'Enter') setAnswers(a => ({ ...a, [ex.id]: (e.target as HTMLInputElement).value.trim() }));
                    }}
                  />
                  {!isAnswered && (
                    <button
                      onClick={(e) => {
                        const input = (e.currentTarget.previousSibling as HTMLInputElement);
                        setAnswers(a => ({ ...a, [ex.id]: input.value.trim() }));
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                    >
                      Check
                    </button>
                  )}
                </div>
              )}

              {/* Explanation */}
              {isAnswered && (
                <div className="ml-9 mt-3">
                  {!isCorrect && (
                    <p className="text-xs text-red-600 dark:text-red-400 mb-2">
                      Correct answer: <code className="font-mono bg-red-100 dark:bg-red-900/40 px-1 rounded">{String(ex.correct)}</code>
                    </p>
                  )}
                  <button
                    onClick={() => setShowExplanation(s => ({ ...s, [ex.id]: !s[ex.id] }))}
                    className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    {showExplanation[ex.id] ? 'Hide' : 'Show'} explanation
                    {showExplanation[ex.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                  {showExplanation[ex.id] && (
                    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-100 dark:border-blue-900">
                      <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">{ex.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
