'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Search, Menu, X, ChevronDown, Terminal, BookOpen } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { searchTechnologies } from '@/data/technologies';

// grouped learn menu — renders as a wide multi-column dropdown
const learnGroups = [
  {
    heading: 'Core Languages',
    items: [
      { label:'HTML',       href:'/html',                        desc:'Structure & semantics' },
      { label:'CSS',        href:'/css',                         desc:'Styling & layouts' },
      { label:'JavaScript', href:'/js',                          desc:'Complete JS tutorial' },
      { label:'TypeScript', href:'/learn/typescript/introduction',desc:'Typed JavaScript' },
    ],
  },
  {
    heading: 'Frontend',
    items: [
      { label:'React',   href:'/learn/react/introduction',   desc:'UI library by Meta' },
      { label:'Next.js', href:'/learn/nextjs/introduction',  desc:'Full-stack React framework' },
    ],
  },
  {
    heading: 'Backend',
    items: [
      { label:'Node.js',    href:'/learn/nodejs/introduction',    desc:'Server-side JavaScript' },
      { label:'Express.js', href:'/learn/express/introduction',   desc:'Fast Node.js framework' },
      { label:'REST APIs',  href:'/learn/rest-api/01-introduction',desc:'API design & HTTP' },
    ],
  },
  {
    heading: 'Databases',
    items: [
      { label:'MongoDB',    href:'/learn/mongodb/introduction',       desc:'Document NoSQL database' },
      { label:'PostgreSQL', href:'/learn/postgresql/01-introduction', desc:'Powerful SQL database' },
      { label:'SQLite',     href:'/learn/sqlite/01-introduction',     desc:'Embedded lightweight database' },
      { label:'Redis',      href:'/learn/redis/01-introduction',      desc:'In-memory cache and pub/sub' },
      { label:'All databases', href:'/databases',                     desc:'SQL vs NoSQL guide' },
    ],
  },
  {
    heading: 'DevOps & Tools',
    items: [
      { label:'Git',    href:'/learn/git/01-introduction',    desc:'Version control' },
      { label:'Docker', href:'/learn/docker/01-introduction', desc:'Containers & deployment' },
    ],
  },
];

const navItems = [
  { label:'Learn',        href:'/learn',       isLearn: true },
  { label:'Technologies', href:'/technologies' },
  { label:'Databases',    href:'/databases' },
  { label:'Roadmaps',     href:'/roadmaps' },
  { label:'Practice', href:'/projects', children:[
    { label:'Projects',       href:'/projects',  desc:'Build real applications' },
    { label:'Interview Prep', href:'/interview', desc:'Q&A with detailed answers' },
    { label:'Compare Tech',   href:'/compare',   desc:'Side-by-side analysis' },
    { label:'Dev Tools',      href:'/tools',     desc:'12 browser-based tools' },
  ]},
];

export function Navbar() {
  const [mob, setMob]     = useState(false);
  const [drop, setDrop]   = useState<string|null>(null);
  const [sOpen, setSOpen] = useState(false);
  const [q, setQ]         = useState('');
  const [res, setRes]     = useState<ReturnType<typeof searchTechnologies>>([]);
  const [sc, setSc]       = useState(false);
  const sRef = useRef<HTMLDivElement>(null);
  const nRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setSc(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive:true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setRes(q.length > 1 ? searchTechnologies(q) : []); }, [q]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (sRef.current && !sRef.current.contains(e.target as Node)) { setSOpen(false); setQ(''); }
      if (nRef.current && !nRef.current.contains(e.target as Node)) setDrop(null);
    };
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey||e.ctrlKey) && e.key==='k') { e.preventDefault(); setSOpen(true); }
      if (e.key==='Escape') { setSOpen(false); setQ(''); setDrop(null); }
    };
    document.addEventListener('mousedown', h);
    document.addEventListener('keydown', k);
    return () => { document.removeEventListener('mousedown', h); document.removeEventListener('keydown', k); };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full"
      style={{ background:'var(--bg)', borderBottom:'1px solid var(--line)', boxShadow: sc ? '0 1px 8px rgba(0,0,0,.06)' : 'none', backdropFilter:'blur(12px)' }}>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6">
        <div className="flex items-center h-14 gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white"/>
            </div>
            <span className="font-extrabold text-[15px] tracking-tight" style={{ color:'var(--text)' }}>
              WebDev<span style={{ color:'#2563eb' }}>Atlas</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center" ref={nRef}>
            {navItems.map(item => (
              <div key={item.label} className="relative">
                {item.isLearn ? (
                  <>
                    <button onClick={() => setDrop(drop === 'Learn' ? null : 'Learn')}
                      className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-colors"
                      style={{ color: drop==='Learn' ? '#2563eb' : 'var(--text-2)', background: drop==='Learn' ? '#eff6ff' : 'transparent' }}
                      onMouseEnter={e => { if (drop !== 'Learn') (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-section)'; }}
                      onMouseLeave={e => { if (drop !== 'Learn') (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
                      Learn
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${drop === 'Learn' ? 'rotate-180' : ''}`} />
                    </button>

                    {drop === 'Learn' && (
                      <div className="absolute top-full left-0 mt-1.5 z-50 rounded-2xl py-4 px-2"
                        style={{ background: 'var(--card)', border: '1px solid var(--line)', boxShadow: '0 8px 32px rgba(0,0,0,.14)', width: 580 }}>
                        <div className="grid grid-cols-3 gap-x-2 gap-y-1">
                          {learnGroups.map(group => (
                            <div key={group.heading} className="px-2">
                              <p className="text-[10px] font-extrabold uppercase tracking-widest mb-2 px-2"
                                style={{ color: 'var(--text-3)' }}>{group.heading}</p>
                              {group.items.map(c => (
                                <Link key={c.href} href={c.href} onClick={() => setDrop(null)}
                                  className="block px-2 py-2 rounded-lg transition-colors mb-0.5"
                                  style={{ color: 'var(--text)' }}
                                  onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.background = 'var(--bg-section)')}
                                  onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.background = '')}>
                                  <p className="text-[13px] font-semibold leading-tight">{c.label}</p>
                                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-3)' }}>{c.desc}</p>
                                </Link>
                              ))}
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 mx-2 pt-3" style={{ borderTop: '1px solid var(--line)' }}>
                          <Link href="/learn" onClick={() => setDrop(null)}
                            className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-[12px] font-semibold transition-colors"
                            style={{ background: '#eff6ff', color: '#2563eb' }}
                            onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.background = '#dbeafe')}
                            onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.background = '#eff6ff')}>
                            Browse all topics <ChevronDown className="w-3 h-3 -rotate-90" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </>
                ) : item.children ? (
                  <>
                    <button onClick={() => setDrop(drop===item.label ? null : item.label)}
                      className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-colors"
                      style={{ color: drop===item.label ? '#2563eb' : 'var(--text-2)', background: drop===item.label ? '#eff6ff' : 'transparent' }}
                      onMouseEnter={e=>{if(drop!==item.label)(e.currentTarget as HTMLButtonElement).style.background='var(--bg-section)';}}
                      onMouseLeave={e=>{if(drop!==item.label)(e.currentTarget as HTMLButtonElement).style.background='transparent';}}>
                      {item.label}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${drop===item.label?'rotate-180':''}`}/>
                    </button>

                    {drop===item.label && (
                      <div className="absolute top-full left-0 mt-1.5 w-52 rounded-xl py-1.5 z-50"
                        style={{ background:'var(--card)', border:'1px solid var(--line)', boxShadow:'0 8px 24px rgba(0,0,0,.12)' }}>
                        {item.children.map(c => (
                          <Link key={c.href} href={c.href} onClick={() => setDrop(null)}
                            className="block px-4 py-2.5 transition-colors"
                            style={{ color:'var(--text)' }}
                            onMouseEnter={e=>((e.currentTarget as HTMLAnchorElement).style.background='var(--bg-section)')}
                            onMouseLeave={e=>((e.currentTarget as HTMLAnchorElement).style.background='')}>
                            <p className="text-[13px] font-semibold">{c.label}</p>
                            <p className="text-[11px] mt-0.5" style={{ color:'var(--text-3)' }}>{c.desc}</p>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link href={item.href}
                    className="px-3.5 py-2 text-[13px] font-medium rounded-lg transition-colors block"
                    style={{ color:'var(--text-2)' }}
                    onMouseEnter={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.color='var(--text)';el.style.background='var(--bg-section)';}}
                    onMouseLeave={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.color='var(--text-2)';el.style.background='';}}>
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2 ml-auto">

            {/* Search */}
            <div className="relative" ref={sRef}>
              <button onClick={() => setSOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all w-44"
                style={{ border:'1px solid var(--line)', background:'var(--bg-section)', color:'var(--text-3)' }}>
                <Search className="w-3.5 h-3.5 shrink-0"/>
                <span>Search topics...</span>
                <kbd className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ border:'1px solid var(--line)', background:'var(--bg)', color:'var(--text-3)' }}>⌘K</kbd>
              </button>

              {sOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-xl z-50 overflow-hidden"
                  style={{ background:'var(--card)', border:'1px solid var(--line)', boxShadow:'0 16px 48px rgba(0,0,0,.15)' }}>
                  <div className="flex items-center gap-2.5 px-4 py-3" style={{ borderBottom:'1px solid var(--line)' }}>
                    <Search className="w-4 h-4 shrink-0" style={{ color:'var(--text-3)' }}/>
                    <input autoFocus type="text" placeholder="Search JavaScript, React, CSS..."
                      className="flex-1 text-sm outline-none bg-transparent"
                      style={{ color:'var(--text)' }}
                      value={q} onChange={e => setQ(e.target.value)}/>
                    {q && <button onClick={() => setQ('')}><X className="w-4 h-4" style={{ color:'var(--text-3)' }}/></button>}
                  </div>
                  {res.length > 0 ? (
                    <ul className="max-h-72 overflow-y-auto py-1">
                      {res.map((r,i) => (
                        <li key={i}>
                          <Link href={r.type==='topic'&&r.technologySlug ? `/learn/${r.technologySlug}/${r.slug}` : `/learn/${r.slug}`}
                            onClick={() => { setSOpen(false); setQ(''); }}
                            className="flex items-start gap-3 px-4 py-2.5 transition-colors"
                            style={{ borderBottom:'1px solid var(--line)' }}
                            onMouseEnter={e=>((e.currentTarget as HTMLAnchorElement).style.background='var(--bg-section)')}
                            onMouseLeave={e=>((e.currentTarget as HTMLAnchorElement).style.background='')}>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded mt-0.5 uppercase tracking-wider shrink-0"
                              style={{ background:'#eff6ff', color:'#1d4ed8' }}>{r.category}</span>
                            <div>
                              <p className="text-[13px] font-semibold" style={{ color:'var(--text)' }}>{r.title}</p>
                              <p className="text-[11px] mt-0.5 line-clamp-1" style={{ color:'var(--text-3)' }}>{r.description}</p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : q.length > 1 ? (
                    <p className="px-4 py-8 text-center text-sm" style={{ color:'var(--text-3)' }}>No results for &ldquo;{q}&rdquo;</p>
                  ) : (
                    <div className="px-4 py-3">
                      <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color:'var(--text-3)' }}>Quick access</p>
                      <div className="flex flex-wrap gap-1.5">
                        {['JavaScript','React','CSS Grid','Node.js','MongoDB'].map(t => (
                          <button key={t} onClick={() => setQ(t)}
                            className="text-xs px-2.5 py-1 rounded-lg transition-colors"
                            style={{ border:'1px solid var(--line)', background:'var(--bg-section)', color:'var(--text-2)' }}
                            onMouseEnter={e=>{const el=e.currentTarget as HTMLButtonElement;el.style.borderColor='var(--line-2)';el.style.color='var(--text)';}}
                            onMouseLeave={e=>{const el=e.currentTarget as HTMLButtonElement;el.style.borderColor='var(--line)';el.style.color='var(--text-2)';}}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Code Editor */}
            <Link href="/playground"
              className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white transition-all"
              style={{ background:'#1a1a1a' }}
              onMouseEnter={e=>((e.currentTarget as HTMLAnchorElement).style.background='#333')}
              onMouseLeave={e=>((e.currentTarget as HTMLAnchorElement).style.background='#1a1a1a')}>
              <Terminal className="w-3.5 h-3.5 text-green-400"/> Code Editor
            </Link>

            <ThemeToggle/>

            <button onClick={() => setMob(!mob)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg transition-colors"
              style={{ border:'1px solid var(--line)' }}
              onMouseEnter={e=>((e.currentTarget as HTMLButtonElement).style.background='var(--bg-section)')}
              onMouseLeave={e=>((e.currentTarget as HTMLButtonElement).style.background='')}>
              {mob ? <X className="w-4 h-4" style={{ color:'var(--text)' }}/> : <Menu className="w-4 h-4" style={{ color:'var(--text)' }}/>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mob && (
        <div style={{ background:'var(--bg)', borderTop:'1px solid var(--line)' }}>
          <div className="max-w-screen-xl mx-auto px-4 py-4 space-y-0.5">
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-3" style={{ background:'var(--bg-section)' }}>
              <Search className="w-4 h-4" style={{ color:'var(--text-3)' }}/>
              <input type="text" placeholder="Search topics..." className="flex-1 text-sm bg-transparent outline-none"
                style={{ color:'var(--text)' }} value={q} onChange={e => setQ(e.target.value)}/>
            </div>
            <Link href="/playground" onClick={() => setMob(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm text-white mb-2"
              style={{ background:'#1a1a1a' }}>
              <Terminal className="w-4 h-4 text-green-400"/> Code Editor
            </Link>
            {navItems.map(item => (
              <Link key={item.label} href={item.href} onClick={() => setMob(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                style={{ color:'var(--text)' }}
                onMouseEnter={e=>((e.currentTarget as HTMLAnchorElement).style.background='var(--bg-section)')}
                onMouseLeave={e=>((e.currentTarget as HTMLAnchorElement).style.background='')}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
