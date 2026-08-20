'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, Terminal, Zap, BookOpen } from 'lucide-react';
import { searchTechnologies } from '@/data/technologies';
import Link from 'next/link';

const quick = [
  { l: 'JS Promises',  h: '/js/async-await' },
  { l: 'CSS Flexbox',  h: '/css/flexbox' },
  { l: 'React Hooks',  h: '/learn/react/useeffect' },
  { l: 'REST APIs',    h: '/learn/rest-api/01-introduction' },
  { l: 'Node.js',      h: '/learn/nodejs/introduction' },
  { l: 'MongoDB',      h: '/learn/mongodb/introduction' },
];

export function Hero() {
  const [q, setQ]   = useState('');
  const [r, setR]   = useState<ReturnType<typeof searchTechnologies>>([]);
  const router      = useRouter();

  const search = (v: string) => { setQ(v); setR(v.length > 1 ? searchTechnologies(v) : []); };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!r.length) return;
    const x = r[0];
    router.push(x.type === 'topic' && x.technologySlug
      ? `/learn/${x.technologySlug}/${x.slug}` : `/learn/${x.slug}`);
  };

  return (
    <section className="relative overflow-hidden" style={{ background: 'var(--bg)', borderBottom: '1px solid var(--line)' }}>
      {/* dot grid */}
      <div className="absolute inset-0 pointer-events-none opacity-40"
        style={{ backgroundImage: 'radial-gradient(circle, var(--line) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      <div className="relative max-w-screen-xl mx-auto px-4 lg:px-6 pt-16 pb-14">
        <div className="max-w-2xl">

          {/* badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 pulse" />
            Free developer education — no account needed
          </div>

          {/* headline */}
          <h1 className="font-extrabold tracking-tight leading-[1.1] mb-4"
            style={{ fontSize: 'clamp(2rem,5vw,3.2rem)', color: 'var(--text)' }}>
            Learn the Web.<br />
            <span className="grad">Understand the Stack.</span><br />
            Build Anything.
          </h1>

          <p className="text-[16px] leading-[1.75] mb-7 max-w-xl" style={{ color: 'var(--text-2)' }}>
            HTML, CSS, JavaScript, React, Node.js, MongoDB — every topic explained in simple English
            with <strong style={{ color: 'var(--text)' }}>live code examples</strong> you can edit and run instantly.
          </p>

          {/* search */}
          <div className="relative max-w-lg mb-5">
            <form onSubmit={submit}>
              <div className="flex items-center gap-3 px-4 py-3 rounded-full transition-all"
                style={{ background: 'var(--bg)', border: '1.5px solid var(--line)' }}>
                <Search className="w-4 h-4 shrink-0" style={{ color: 'var(--text-3)' }} />
                <input type="text" placeholder='Search: "promises", "flexbox", "MongoDB"...'
                  className="flex-1 bg-transparent outline-none text-[14px]"
                  style={{ color: 'var(--text)' }}
                  value={q} onChange={e => search(e.target.value)} />
                {q && (
                  <button type="submit" className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white"
                    style={{ background: '#2563eb' }}>
                    Go <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </form>

            {r.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 z-20 rounded-2xl overflow-hidden shadow-xl"
                style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
                {r.slice(0, 6).map((x, i) => (
                  <Link key={i}
                    href={x.type === 'topic' && x.technologySlug
                      ? `/learn/${x.technologySlug}/${x.slug}` : `/learn/${x.slug}`}
                    onClick={() => { setQ(''); setR([]); }}
                    className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-[var(--bg-section)]"
                    style={{ borderBottom: '1px solid var(--line)' }}>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded mt-0.5 uppercase tracking-wider shrink-0"
                      style={{ background: '#eff6ff', color: '#1d4ed8' }}>{x.category}</span>
                    <div>
                      <p className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>{x.title}</p>
                      <p className="text-[11px] mt-0.5 line-clamp-1" style={{ color: 'var(--text-3)' }}>{x.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* chips */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-xs font-semibold" style={{ color: 'var(--text-3)' }}>Popular:</span>
            {quick.map(x => (
              <Link key={x.h} href={x.h}
                className="text-[12px] px-3 py-1.5 rounded-full transition-all hover:border-blue-400 hover:text-blue-600"
                style={{ background: 'var(--bg)', border: '1px solid var(--line)', color: 'var(--text-2)' }}>
                {x.l}
              </Link>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/js/introduction"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-[13px] text-white transition-all hover:opacity-90"
              style={{ background: '#2563eb' }}>
              <Zap className="w-3.5 h-3.5" /> Start JavaScript
            </Link>
            <Link href="/playground"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-[13px] text-white transition-all hover:opacity-90"
              style={{ background: '#1a1a1a' }}>
              <Terminal className="w-3.5 h-3.5 text-green-400" /> Code Editor
            </Link>
            <Link href="/learn"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-[13px] transition-all hover:border-gray-400"
              style={{ background: 'var(--bg)', border: '1.5px solid var(--line)', color: 'var(--text)' }}>
              <BookOpen className="w-3.5 h-3.5" /> Browse Topics
            </Link>
          </div>

          {/* stats */}
          <div className="flex items-center gap-8 mt-10 pt-8" style={{ borderTop: '1px solid var(--line)' }}>
            {[['225+', 'Lessons'], ['16', 'Technologies'], ['100%', 'Free']].map(([v, l]) => (
              <div key={l}>
                <p className="text-[22px] font-extrabold" style={{ color: 'var(--text)' }}>{v}</p>
                <p className="text-[12px]" style={{ color: 'var(--text-3)' }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
