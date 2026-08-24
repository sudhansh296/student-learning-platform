import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const stack = [
  { n: '01', label: 'HTML',           icon: '🌐', desc: 'Structure',       color: '#E34F26', href: '/html',             hi: false },
  { n: '02', label: 'CSS',            icon: '🎨', desc: 'Styling',         color: '#264DE4', href: '/css',              hi: false },
  { n: '03', label: 'JavaScript',     icon: '⚡', desc: 'Core language',   color: '#F7DF1E', href: '/js',               hi: true  },
  { n: '04', label: 'TypeScript',     icon: '🔷', desc: 'Type safety',     color: '#3178C6', href: '/learn/typescript', hi: false },
  { n: '05', label: 'React',          icon: '⚛️', desc: 'UI library',      color: '#61DAFB', href: '/learn/react',      hi: false },
  { n: '06', label: 'Next.js',        icon: '▲',  desc: 'React framework', color: '#000',    href: '/learn/nextjs',     hi: false },
  { n: '07', label: 'Node.js',        icon: '🟢', desc: 'Server runtime',  color: '#339933', href: '/learn/nodejs',     hi: false },
  { n: '08', label: 'Express.js',     icon: '🚂', desc: 'API framework',   color: '#444',    href: '/learn/express',    hi: false },
  { n: '09', label: 'REST/GraphQL',   icon: '🔗', desc: 'API design',      color: '#FF6B35', href: '/learn/rest-api',   hi: false },
  { n: '10', label: 'MongoDB',        icon: '🍃', desc: 'NoSQL DB',        color: '#47A248', href: '/learn/mongodb',    hi: false },
  { n: '11', label: 'PostgreSQL',     icon: '🐘', desc: 'SQL DB',          color: '#336791', href: '/learn/postgresql', hi: false },
  { n: '12', label: 'Docker/CI-CD',   icon: '🐳', desc: 'DevOps',          color: '#2496ED', href: '/learn/docker',     hi: false },
  { n: '13', label: 'Production',     icon: '🚀', desc: 'Deploy & scale',  color: '#059669', href: '/roadmaps',         hi: false },
];

export function JSEcosystem() {
  return (
    <section className="py-12" style={{ background: 'var(--bg)', borderBottom: '1px solid var(--line)' }}>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6">

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-extrabold" style={{ color: 'var(--text)' }}>The JavaScript Ecosystem</h2>
            <p className="text-[13px] mt-1 max-w-lg" style={{ color: 'var(--text-2)' }}>
              Every technology in the modern web stack — from HTML to production. Click any to start learning.
            </p>
          </div>
          <Link href="/roadmaps/fullstack"
            className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-sm text-white transition-all hover:opacity-90"
            style={{ background: '#2563eb' }}>
            Full Roadmap <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 13 boxes */}
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(105px, 1fr))' }}>
          {stack.map(item => (
            <Link key={item.n} href={item.href}
              className="group relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all duration-200 hover:-translate-y-1"
              style={{
                background: item.hi ? '#fefce8' : 'var(--card)',
                border: item.hi ? '2px solid #fbbf24' : '1px solid var(--line)',
              }}>

              {/* number */}
              <span className="absolute top-2 right-2 text-[9px] font-bold font-mono" style={{ color: 'var(--text-3)' }}>
                {item.n}
              </span>

              {/* icon */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                style={{ background: item.color + '18', border: `1.5px solid ${item.color}30` }}>
                {item.icon}
              </div>

              {/* label */}
              <div className="text-center">
                <p className="text-[11px] font-bold leading-tight transition-colors group-hover:text-blue-600"
                  style={{ color: item.hi ? '#92400e' : 'var(--text)' }}>
                  {item.label}
                </p>
                <p className="text-[10px] mt-0.5 leading-tight" style={{ color: 'var(--text-3)' }}>{item.desc}</p>
              </div>

              {/* bottom accent */}
              <div className="absolute bottom-0 inset-x-0 h-0.5 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: item.color }} />
            </Link>
          ))}
        </div>

        {/* legend */}
        <div className="flex items-center gap-5 mt-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded border-2" style={{ borderColor: '#fbbf24', background: '#fefce8' }} />
            <span className="text-[11px]" style={{ color: 'var(--text-3)' }}>Start here</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ border: '1px solid var(--line)', background: 'var(--card)' }} />
            <span className="text-[11px]" style={{ color: 'var(--text-3)' }}>Click any to learn</span>
          </div>
        </div>
      </div>
    </section>
  );
}
