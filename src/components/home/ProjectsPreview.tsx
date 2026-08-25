'use client';
import Link from 'next/link';
import { ArrowRight, Clock, Zap, Star } from 'lucide-react';
import { allProjects } from '@/data/projects';

const FEATURED = allProjects.slice(0, 6).map(p => ({
  slug: p.slug,
  title: p.title,
  diff: p.difficulty,
  time: p.estimatedTime,
  techs: p.technologies.slice(0, 3),
  desc: p.description,
  features: p.features.slice(0, 3),
}));

const DIFF: Record<string, { label: string; color: string; dot: string }> = {
  beginner:     { label: 'Beginner',     color: '#10b981', dot: '#10b981' },
  intermediate: { label: 'Intermediate', color: '#3b82f6', dot: '#3b82f6' },
  advanced:     { label: 'Advanced',     color: '#f59e0b', dot: '#f59e0b' },
};

const GRADIENTS = [
  'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
  'linear-gradient(135deg,#f093fb 0%,#f5576c 100%)',
  'linear-gradient(135deg,#4facfe 0%,#00f2fe 100%)',
  'linear-gradient(135deg,#43e97b 0%,#38f9d7 100%)',
  'linear-gradient(135deg,#fa709a 0%,#fee140 100%)',
  'linear-gradient(135deg,#a18cd1 0%,#fbc2eb 100%)',
];

export function ProjectsPreview() {
  return (
    <section className="py-20 relative overflow-hidden" style={{ background: 'var(--bg)' }}>

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle,#6366f1,transparent)', transform: 'translate(-50%,-50%)' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle,#8b5cf6,transparent)', transform: 'translate(50%,50%)' }} />
      </div>

      <div className="max-w-screen-xl mx-auto px-4 lg:px-6 relative">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3"
              style={{ background: 'linear-gradient(135deg,#6366f115,#8b5cf615)', border: '1px solid #6366f130', color: '#6366f1' }}>
              <Zap className="w-3 h-3" />
              BUILD REAL PROJECTS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2" style={{ color: 'var(--text)' }}>
              Learn by{' '}
              <span style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                building
              </span>
            </h2>
            <p className="text-[15px]" style={{ color: 'var(--text-3)' }}>
              Each project runs live in your browser — edit, break, and rebuild it.
            </p>
          </div>
          <Link
            href="/projects"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all hover:gap-3"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', boxShadow: '0 4px 15px #6366f140' }}
          >
            View all {allProjects.length} projects <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURED.map((p, idx) => {
            const d = DIFF[p.diff];
            const grad = GRADIENTS[idx % GRADIENTS.length];
            return (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                style={{ background: 'var(--card)', border: '1px solid var(--line)', textDecoration: 'none' }}
              >
                {/* Gradient header */}
                <div className="relative h-28 flex items-end p-4 overflow-hidden" style={{ background: grad }}>
                  {/* Decorative circles */}
                  <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-20"
                    style={{ background: 'white', transform: 'translate(30%,-30%)' }} />
                  <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full opacity-10"
                    style={{ background: 'white', transform: 'translate(-30%,30%)' }} />

                  {/* Title on gradient */}
                  <div className="relative z-10 flex items-end justify-between w-full gap-2">
                    <h3 className="font-extrabold text-[16px] leading-tight text-white drop-shadow">
                      {p.title}
                    </h3>
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0"
                      style={{ background: 'rgba(255,255,255,0.25)', color: 'white', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.3)' }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: d.dot }} />
                      {d.label}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col flex-1">

                  {/* Tech badges */}
                  <div className="flex gap-1.5 flex-wrap mb-3">
                    {p.techs.map(t => (
                      <span key={t}
                        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md"
                        style={{ background: 'var(--bg-section)', color: 'var(--text-2)', border: '1px solid var(--line)' }}>
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Description */}
                  <p className="text-[13px] leading-relaxed mb-4 flex-1 line-clamp-3" style={{ color: 'var(--text-2)' }}>
                    {p.desc}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 mt-auto"
                    style={{ borderTop: '1px solid var(--line)' }}>
                    <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--text-3)' }}>
                      <Clock className="w-3 h-3" />
                      {p.time}
                    </span>
                    <span className="flex items-center gap-1.5 text-[12px] font-bold transition-all group-hover:gap-2.5"
                      style={{ color: d.color }}>
                      Open Project <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-bold transition-all hover:gap-3 sm:hidden"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', boxShadow: '0 4px 15px #6366f140' }}
          >
            View all {allProjects.length} projects <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="flex items-center gap-2 text-[13px]" style={{ color: 'var(--text-3)' }}>
            <Star className="w-4 h-4" style={{ color: '#f59e0b' }} />
            All projects include live preview, source code, step-by-step guide and coding challenges
          </p>
        </div>

      </div>
    </section>
  );
}
