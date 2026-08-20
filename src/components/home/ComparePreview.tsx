import Link from 'next/link';
import { ArrowRight, Scale } from 'lucide-react';

const items = [
  { slug: 'react-vs-vue',             a: { name: 'React',      icon: '⚛️' }, b: { name: 'Vue',        icon: '💚' }, tag: 'Frontend' },
  { slug: 'mongodb-vs-postgresql',    a: { name: 'MongoDB',    icon: '🍃' }, b: { name: 'PostgreSQL', icon: '🐘' }, tag: 'Database' },
  { slug: 'javascript-vs-typescript', a: { name: 'JavaScript', icon: '⚡' }, b: { name: 'TypeScript', icon: '🔷' }, tag: 'Language' },
  { slug: 'rest-vs-graphql',          a: { name: 'REST',       icon: '🔗' }, b: { name: 'GraphQL',    icon: '◆'  }, tag: 'API' },
];

export function ComparePreview() {
  return (
    <section className="py-12" style={{ background: 'var(--bg-section)', borderBottom: '1px solid var(--line)' }}>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold" style={{ color: 'var(--text)' }}>Compare Technologies</h2>
            <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-3)' }}>Side-by-side breakdowns to help you choose the right tool</p>
          </div>
          <Link href="/compare" className="flex items-center gap-1.5 text-[13px] font-bold hover:underline underline-offset-2" style={{ color: '#2563eb' }}>
            All comparisons <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map(c => (
            <Link key={c.slug} href={`/compare/${c.slug}`}
              className="group flex flex-col p-5 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Scale className="w-3.5 h-3.5" style={{ color: 'var(--text-3)' }} />
                <span className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: 'var(--text-3)' }}>{c.tag}</span>
              </div>
              <div className="flex items-center gap-2 mb-5">
                <div className="flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl"
                  style={{ background: 'var(--bg-section)', border: '1px solid var(--line)' }}>
                  <span className="text-2xl">{c.a.icon}</span>
                  <span className="text-[11px] font-bold text-center" style={{ color: 'var(--text)' }}>{c.a.name}</span>
                </div>
                <span className="text-[10px] font-extrabold px-2 py-1 rounded-lg"
                  style={{ background: 'var(--bg-section)', color: 'var(--text-3)' }}>VS</span>
                <div className="flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl"
                  style={{ background: 'var(--bg-section)', border: '1px solid var(--line)' }}>
                  <span className="text-2xl">{c.b.icon}</span>
                  <span className="text-[11px] font-bold text-center" style={{ color: 'var(--text)' }}>{c.b.name}</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-[12px] font-bold mt-auto group-hover:gap-3 transition-all"
                style={{ color: '#2563eb' }}>
                Compare now <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
