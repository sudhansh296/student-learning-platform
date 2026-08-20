import Link from 'next/link';
import { roadmaps } from '@/data/roadmaps';
import { ArrowRight, Clock, ChevronRight } from 'lucide-react';

export function RoadmapsSection() {
  return (
    <section className="py-12" style={{ background: 'var(--bg-section)', borderBottom: '1px solid var(--line)' }}>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold" style={{ color: 'var(--text)' }}>Learning Roadmaps</h2>
            <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-3)' }}>Step-by-step paths from zero to job-ready developer</p>
          </div>
          <Link href="/roadmaps" className="flex items-center gap-1.5 text-[13px] font-bold hover:underline underline-offset-2" style={{ color: '#2563eb' }}>
            All roadmaps <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roadmaps.map(rm => (
            <Link key={rm.id} href={`/roadmaps/${rm.slug}`}
              className="group flex flex-col p-5 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: rm.color + '18', border: `2px solid ${rm.color}28` }}>
                  {rm.icon}
                </div>
                <div>
                  <h3 className="font-bold text-sm group-hover:text-blue-600 transition-colors" style={{ color: 'var(--text)' }}>
                    {rm.title}
                  </h3>
                  <div className="flex items-center gap-1 mt-0.5 text-[11px]" style={{ color: 'var(--text-3)' }}>
                    <Clock className="w-3 h-3" /> {rm.estimatedTime}
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-1.5 mb-4">
                {rm.steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: s.color }} />
                    <span className="text-[12px]" style={{ color: 'var(--text-2)' }}>{s.phase}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--line)' }}>
                <span className="text-[11px] capitalize" style={{ color: 'var(--text-3)' }}>{rm.difficulty}</span>
                <ChevronRight className="w-4 h-4 group-hover:text-blue-500 transition-colors" style={{ color: 'var(--text-3)' }} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
