'use client';

import { useState } from 'react';
import { interviewQuestions } from '@/data/interview-questions';
import { ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { CodeBlock } from '@/components/docs/CodeBlock';

const techFilters = [
  { id: 'all', label: 'All' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'react', label: 'React' },
  { id: 'css', label: 'CSS' },
  { id: 'nodejs', label: 'Node.js' },
];

const difficultyFilters = [
  { id: 'all', label: 'All' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
];

const difficultyBadge = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  advanced: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
};

function QuestionCard({ q }: { q: typeof interviewQuestions[0] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl bg-background overflow-hidden">
      <button
        className="w-full flex items-start gap-3 p-5 text-left hover:bg-muted/30 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <MessageCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-snug">{q.question}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${difficultyBadge[q.difficulty]}`}>
              {q.difficulty}
            </span>
            <span className="text-[10px] text-muted-foreground capitalize">{q.technologyId}</span>
          </div>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
        )}
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-border pt-4 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Short Answer</p>
            <p className="text-sm text-foreground leading-relaxed">{q.shortAnswer}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Detailed Explanation</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{q.detailedAnswer}</p>
          </div>
          {q.example && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Code Example</p>
              <CodeBlock code={q.example} language="javascript" />
            </div>
          )}
          {q.followUp && (
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
              <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                💬 Follow-up question: {q.followUp}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function InterviewPage() {
  const [techFilter, setTechFilter] = useState('all');
  const [diffFilter, setDiffFilter] = useState('all');

  const filtered = interviewQuestions.filter(q => {
    if (techFilter !== 'all' && q.technologyId !== techFilter) return false;
    if (diffFilter !== 'all' && q.difficulty !== diffFilter) return false;
    return true;
  });

  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-12">
      <div className="max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-3">Interview Preparation</h1>
          <p className="text-muted-foreground leading-relaxed">
            Common web development interview questions with simple answers, detailed explanations, and code examples.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Technology</p>
            <div className="flex flex-wrap gap-1.5">
              {techFilters.map(f => (
                <button
                  key={f.id}
                  onClick={() => setTechFilter(f.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                    techFilter === f.id
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Difficulty</p>
            <div className="flex flex-wrap gap-1.5">
              {difficultyFilters.map(f => (
                <button
                  key={f.id}
                  onClick={() => setDiffFilter(f.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                    diffFilter === f.id
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-4">{filtered.length} questions</p>

        {/* Questions */}
        <div className="space-y-3">
          {filtered.map(q => (
            <QuestionCard key={q.id} q={q} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No questions found for the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
