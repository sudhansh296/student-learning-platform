import Link from 'next/link';
import { ArrowRight, Clock, Play, Code2, Globe } from 'lucide-react';
import { allProjects } from '@/data/projects';

// Get first 6 projects for preview, map to simplified format
const projects = allProjects.slice(0, 6).map(p => ({
  slug: p.slug,
  title: p.title,
  diff: p.difficulty,
  time: p.estimatedTime,
  techs: p.technologies.slice(0, 3),
  desc: p.description,
  accent: p.difficulty === 'beginner' ? '#10B981' : p.difficulty === 'intermediate' ? '#2563eb' : '#F59E0B',
  type: p.type,
  features: p.features.slice(0, 3),
}));

const diffConfig: Record<string, { label: string; bg: string; color: string }> = {
  beginner:     { label: 'Beginner',     bg: '#f0fdf4', color: '#15803d' },
  intermediate: { label: 'Intermediate', bg: '#eff6ff', color: '#1d4ed8' },
  advanced:     { label: 'Advanced',     bg: '#fef3c7', color: '#b45309' },
};

const typeIcon: Record<string, React.ReactNode> = {
  frontend: <Play className="w-3 h-3" />,
  backend:  <Code2 className="w-3 h-3" />,
  fullstack:<Globe className="w-3 h-3" />,
};

export function ProjectsPreview() {
  return (
    <section className="py-16" style={{ background: 'var(--bg)', borderBottom: '1px solid var(--line)' }}>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#2563eb' }}>
              Build Real Projects
            </p>
            <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--text)' }}>
              Learn by building
            </h2>
            <p className="text-[14px] mt-1" style={{ color: 'var(--text-3)' }}>
              Each project runs live in your browser — edit, break, and rebuild it.
            </p>
          </div>
          <Link
            href="/projects"
            className="hidden sm:flex items-center gap-1.5 text-[13px] font-bold px-4 py-2 rounded-lg transition-colors"
            style={{ color: '#2563eb', border: '1px solid #2563eb20', background: '#2563eb08' }}
          >
            View all {allProjects.length} projects <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Grid — 3 cols on large, 2 on medium, 1 on small */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              style={{ background: 'var(--card)', border: '1px solid var(--line)', textDecoration: 'none' }}
            >
              {/* Color top bar */}
              <div className="h-1 w-full shrink-0" style={{ background: p.accent }} />

              {/* Colored header band */}
              <div
                className="px-5 pt-5 pb-4"
                style={{ background: `${p.accent}12` }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-[15px] leading-snug group-hover:underline underline-offset-2"
                    style={{ color: 'var(--text)' }}>
                    {p.title}
                  </h3>
                  <span
                    className="flex items-center gap-1 text-[10px] font-semibold shrink-0 px-2 py-0.5 rounded-full"
                    style={{ background: diffConfig[p.diff].bg, color: diffConfig[p.diff].color }}
                  >
                    {diffConfig[p.diff].label}
                  </span>
                </div>

                {/* Tech badges */}
                <div className="flex gap-1.5 flex-wrap">
                  {p.techs.map(t => (
                    <span
                      key={t}
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md"
                      style={{ background: 'var(--bg-section)', color: 'var(--text-2)', border: '1px solid var(--line)' }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Body */}
              <div className="px-5 py-4 flex-1 flex flex-col">
                <p className="text-[13px] leading-relaxed mb-4 flex-1" style={{ color: 'var(--text-2)' }}>
                  {p.desc}
                </p>

                {/* Feature pills */}
                <div className="flex gap-2 flex-wrap mb-4">
                  {p.features.map(f => (
                    <span
                      key={f}
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1"
                      style={{ background: `${p.accent}15`, color: p.accent, border: `1px solid ${p.accent}30` }}
                    >
                      {f === 'Live preview' && typeIcon[p.type]}
                      {f}
                    </span>
                  ))}
                </div>

                {/* Footer row */}
                <div className="flex items-center justify-between pt-3"
                  style={{ borderTop: '1px solid var(--line)' }}>
                  <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--text-3)' }}>
                    <Clock className="w-3 h-3" />
                    {p.time}
                  </span>
                  <span
                    className="flex items-center gap-1 text-[12px] font-bold transition-colors"
                    style={{ color: p.accent }}
                  >
                    Open Project <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-6 flex justify-center sm:hidden">
          <Link
            href="/projects"
            className="flex items-center gap-1.5 text-[13px] font-bold px-5 py-2.5 rounded-lg"
            style={{ color: '#2563eb', border: '1px solid #2563eb40', background: '#2563eb08' }}
          >
            View all {allProjects.length} projects <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
