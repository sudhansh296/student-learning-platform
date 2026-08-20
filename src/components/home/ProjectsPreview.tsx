import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';

const projects = [
  { title: 'To-Do List App',        diff: 'beginner',     time: '2–4 hrs',  techs: ['HTML', 'CSS', 'JS'],              desc: 'Task manager with add, complete, delete. Persist with localStorage.', accent: '#10B981' },
  { title: 'REST API with Node.js', diff: 'intermediate', time: '8–12 hrs', techs: ['Node.js', 'Express', 'MongoDB'],  desc: 'Full CRUD API with JWT auth, middleware, error handling.',             accent: '#3B82F6' },
  { title: 'Real-time Chat App',    diff: 'advanced',     time: '20–30 hrs',techs: ['React', 'Socket.io', 'Node.js'],  desc: 'Live group chat with rooms, typing indicators, message history.',      accent: '#8B5CF6' },
];

const diffS: Record<string, { bg: string; color: string }> = {
  beginner:     { bg: '#f0fdf4', color: '#15803d' },
  intermediate: { bg: '#eff6ff', color: '#1d4ed8' },
  advanced:     { bg: '#f5f3ff', color: '#6d28d9' },
};

export function ProjectsPreview() {
  return (
    <section className="py-12" style={{ background: 'var(--bg)', borderBottom: '1px solid var(--line)' }}>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold" style={{ color: 'var(--text)' }}>Build Real Projects</h2>
            <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-3)' }}>The fastest way to learn is by building something real</p>
          </div>
          <Link href="/projects" className="flex items-center gap-1.5 text-[13px] font-bold hover:underline underline-offset-2" style={{ color: '#2563eb' }}>
            All projects <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map(p => (
            <div key={p.title}
              className="relative flex flex-col p-5 rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
              <div className="absolute top-0 inset-x-0 h-0.5 rounded-t-2xl" style={{ background: p.accent }} />
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>{p.title}</h3>
                <span className="flex items-center gap-1 text-[11px] shrink-0" style={{ color: 'var(--text-3)' }}>
                  <Clock className="w-3 h-3" />{p.time}
                </span>
              </div>
              <p className="text-[13px] leading-relaxed mb-4 flex-1" style={{ color: 'var(--text-2)' }}>{p.desc}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5 flex-wrap">
                  {p.techs.map(t => (
                    <span key={t} className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md"
                      style={{ background: 'var(--bg-section)', color: 'var(--text-2)', border: '1px solid var(--line)' }}>
                      {t}
                    </span>
                  ))}
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
                  style={{ background: diffS[p.diff].bg, color: diffS[p.diff].color }}>
                  {p.diff}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
