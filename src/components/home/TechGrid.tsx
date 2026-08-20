import Link from 'next/link';
import { technologies } from '@/data/technologies';
import { ArrowRight, BookOpen } from 'lucide-react';

const diffStyle: Record<string, { bg: string; color: string; label: string }> = {
  beginner:     { bg: '#f0fdf4', color: '#15803d', label: 'Beginner' },
  intermediate: { bg: '#eff6ff', color: '#1d4ed8', label: 'Intermediate' },
  advanced:     { bg: '#fff7ed', color: '#c2410c', label: 'Advanced' },
};

export function TechGrid() {
  return (
    <section className="py-12" style={{ background: 'var(--bg)', borderBottom: '1px solid var(--line)' }}>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold" style={{ color: 'var(--text)' }}>Popular Technologies</h2>
            <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-3)' }}>The most in-demand skills for web developers</p>
          </div>
          <Link href="/technologies" className="flex items-center gap-1.5 text-[13px] font-bold hover:underline underline-offset-2" style={{ color: '#2563eb' }}>
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {technologies.map((t) => {
            // HTML has its own dedicated tutorial at /html
            const href = t.id === 'html' ? '/html' : t.id === 'css' ? '/css' : t.id === 'javascript' ? '/js' : t.id === 'typescript' ? '/learn/typescript' : t.id === 'react' ? '/learn/react' : t.id === 'nextjs' ? '/learn/nextjs' : t.id === 'nodejs' ? '/learn/nodejs' : `/learn/${t.slug}`;
            return (
            <Link key={t.id} href={href}
              className="group relative flex flex-col p-5 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>

              {t.isPopular && (
                <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
                  Popular
                </span>
              )}

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: t.bgColor }}>
                  {t.logo}
                </div>
                <div>
                  <h3 className="font-bold text-[13px] group-hover:text-blue-600 transition-colors"
                    style={{ color: 'var(--text)' }}>{t.name}</h3>
                  <p className="text-[11px] capitalize" style={{ color: 'var(--text-3)' }}>
                    {t.subcategory || t.category}
                  </p>
                </div>
              </div>

              <p className="text-[12px] leading-relaxed mb-4 flex-1 line-clamp-2" style={{ color: 'var(--text-2)' }}>
                {t.description}
              </p>

              <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--line)' }}>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: diffStyle[t.difficulty].bg, color: diffStyle[t.difficulty].color }}>
                  {diffStyle[t.difficulty].label}
                </span>
                <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--text-3)' }}>
                  <BookOpen className="w-3 h-3" /> {t.topics.length} topics
                </span>
              </div>
            </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
