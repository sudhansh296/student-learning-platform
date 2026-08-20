import Link from 'next/link';
import { interviewQuestions } from '@/data/interview-questions';
import { ArrowRight, MessageSquare } from 'lucide-react';

const diffS: Record<string, { bg: string; color: string }> = {
  beginner:     { bg: '#f0fdf4', color: '#15803d' },
  intermediate: { bg: '#eff6ff', color: '#1d4ed8' },
  advanced:     { bg: '#fff7ed', color: '#c2410c' },
};

export function InterviewSection() {
  return (
    <section className="py-12" style={{ background: 'var(--bg-section)', borderBottom: '1px solid var(--line)' }}>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold" style={{ color: 'var(--text)' }}>Interview Preparation</h2>
            <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-3)' }}>
              Common questions with clear answers and real code examples
            </p>
          </div>
          <Link href="/interview"
            className="flex items-center gap-1.5 text-[13px] font-bold hover:underline underline-offset-2"
            style={{ color: '#2563eb' }}>
            All questions <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {interviewQuestions.slice(0, 4).map(q => (
            <div key={q.id}
              className="flex flex-col p-5 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                  <MessageSquare className="w-3.5 h-3.5" style={{ color: '#1d4ed8' }} />
                </div>
                <p className="text-[13px] font-bold leading-snug" style={{ color: 'var(--text)' }}>
                  {q.question}
                </p>
              </div>
              <p className="text-[12px] leading-relaxed ml-10 mb-3 flex-1" style={{ color: 'var(--text-2)' }}>
                {q.shortAnswer}
              </p>
              <div className="flex items-center gap-2 ml-10">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
                  style={{ background: diffS[q.difficulty].bg, color: diffS[q.difficulty].color }}>
                  {q.difficulty}
                </span>
                <span className="text-[10px] font-semibold capitalize" style={{ color: 'var(--text-3)' }}>
                  {q.technologyId}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/interview"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white hover:opacity-90 transition-opacity"
            style={{ background: '#2563eb' }}>
            Practice All Interview Questions <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
