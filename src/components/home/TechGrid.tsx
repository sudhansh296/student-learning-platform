import Link from 'next/link';
import { technologies } from '@/data/technologies';
import { ArrowRight, BookOpen, Sparkles, TrendingUp } from 'lucide-react';

const diffStyle: Record<string, { gradient: string; label: string }> = {
  beginner:     { gradient: 'from-green-500 to-emerald-600', label: 'Beginner' },
  intermediate: { gradient: 'from-blue-500 to-indigo-600', label: 'Intermediate' },
  advanced:     { gradient: 'from-orange-500 to-red-600', label: 'Advanced' },
};

export function TechGrid() {
  return (
    <section className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--bg) 0%, var(--bg-section) 100%)' }}>
      {/* Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-purple-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative max-w-screen-xl mx-auto px-4 lg:px-6">
        {/* Header with gradient badge */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <TrendingUp className="w-4 h-4" />
            Most In-Demand Skills
          </div>
          <h2 className="text-3xl lg:text-5xl font-black mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Popular Technologies
          </h2>
          <p className="text-base max-w-2xl mx-auto" style={{ color: 'var(--text-2)' }}>
            Master the tools that power modern web development — from frontend frameworks to backend systems
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {technologies.map((t) => {
            const href = t.id === 'html' ? '/html' : t.id === 'css' ? '/css' : t.id === 'javascript' ? '/js' : t.id === 'typescript' ? '/learn/typescript' : t.id === 'react' ? '/learn/react' : t.id === 'nextjs' ? '/learn/nextjs' : t.id === 'nodejs' ? '/learn/nodejs' : `/learn/${t.slug}`;
            const diffGradient = diffStyle[t.difficulty].gradient;
            
            return (
            <Link key={t.id} href={href}
              className="group relative flex flex-col p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden"
              style={{ 
                background: 'var(--card)', 
                border: '2px solid var(--line)',
              }}>

              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Logo and title */}
              <div className="relative z-10 flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300"
                  style={{ background: t.bgColor }}>
                  {t.logo}
                </div>
                <div>
                  <h3 className="font-black text-base group-hover:text-blue-600 transition-colors duration-200"
                    style={{ color: 'var(--text)' }}>
                    {t.name}
                  </h3>
                  <p className="text-xs capitalize font-semibold" style={{ color: 'var(--text-3)' }}>
                    {t.subcategory || t.category}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="relative z-10 text-sm leading-relaxed mb-4 flex-1 line-clamp-2" style={{ color: 'var(--text-2)' }}>
                {t.description}
              </p>

              {/* Footer with gradient badge */}
              <div className="relative z-10 flex items-center justify-between pt-4 pr-10" style={{ borderTop: '2px solid var(--line)' }}>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-lg shadow-md bg-gradient-to-r ${diffGradient} text-white`}>
                  {diffStyle[t.difficulty].label}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--text-3)' }}>
                  <BookOpen className="w-3.5 h-3.5" /> 
                  {t.topics.length}
                </span>
              </div>

              {/* Hover arrow indicator */}
              <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 z-20">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </Link>
            );
          })}
        </div>

        {/* CTA button */}
        <div className="text-center mt-12">
          <Link href="/technologies"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base shadow-2xl transition-all hover:scale-105 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            Explore All Technologies
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
