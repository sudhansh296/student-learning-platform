'use client';
import Link from 'next/link';
import { Terminal, Play, Download, MonitorPlay } from 'lucide-react';

export function PlaygroundBanner() {
  return (
    <section className="max-w-screen-xl mx-auto px-4 lg:px-6 py-10">
      <div className="relative overflow-hidden rounded-2xl" style={{ background: '#0d1117', border: '1px solid #30363d' }}>
        {/* glow */}
        <div className="absolute top-0 left-0 w-80 h-44 rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse,rgba(34,197,94,.08),transparent)', filter: 'blur(40px)' }} />
        <div className="absolute bottom-0 right-0 w-80 h-44 rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse,rgba(59,130,246,.08),transparent)', filter: 'blur(40px)' }} />

        <div className="relative flex flex-col lg:flex-row items-center gap-8 p-8 md:p-10">
          {/* left */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background:'rgba(34,197,94,.12)', border:'1px solid rgba(34,197,94,.2)' }}>
                <Terminal className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-green-400">Live Code Editor</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3 leading-tight">
              Write Code. <span className="text-green-400">See Results.</span><br className="hidden md:block" />
              Instantly in Your Browser.
            </h2>
            <p className="text-[14px] leading-relaxed mb-6 max-w-md" style={{ color:'#8b949e' }}>
              Built-in editor with HTML, CSS, and JavaScript tabs — live preview side-by-side.
              No installation. No account. Just open and code.
            </p>
            <div className="grid grid-cols-2 gap-2.5 mb-6">
              {[[<Play key="p" className="w-3.5 h-3.5"/>,'Live preview'],[<Terminal key="t" className="w-3.5 h-3.5"/>,'Console output'],
                [<MonitorPlay key="m" className="w-3.5 h-3.5"/>,'Fullscreen mode'],[<Download key="d" className="w-3.5 h-3.5"/>,'Export to HTML']].map(([ic,lb],i) => (
                <div key={i} className="flex items-center gap-2 text-[12px]" style={{ color:'#8b949e' }}>
                  <span className="text-green-400">{ic as React.ReactNode}</span>{lb as string}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/playground" className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-opacity" style={{ background:'#22c55e' }}>
                <Terminal className="w-4 h-4" /> Open Code Editor
              </Link>
              <Link href="/js/introduction" className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white hover:bg-white/10 transition-colors" style={{ border:'1px solid #30363d', background:'rgba(255,255,255,.04)' }}>
                ⚡ JavaScript Tutorial
              </Link>
            </div>
          </div>

          {/* right: code window */}
          <div className="w-full lg:w-[360px] shrink-0 rounded-xl overflow-hidden shadow-xl" style={{ border:'1px solid #30363d' }}>
            <div className="flex items-center gap-1.5 px-4 py-2.5" style={{ background:'#161b22', borderBottom:'1px solid #30363d' }}>
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]"/><div className="w-3 h-3 rounded-full bg-[#ffbd2e]"/><div className="w-3 h-3 rounded-full bg-[#28c840]"/>
              <div className="flex ml-3">
                {[['HTML','#484f58'],['CSS','#484f58'],['JS','#f7df1e']].map(([t,c],i)=>(
                  <span key={t} className={`px-2.5 py-0.5 text-[11px] font-mono ${i===2?'font-bold':''}`} style={{ color:c, background:i===2?'#0d1117':'transparent' }}>{t}</span>
                ))}
              </div>
              <span className="ml-auto text-[10px] font-mono" style={{ color:'#484f58' }}>Ctrl+Enter = Run</span>
            </div>
            <div className="p-4 font-mono text-[12px] leading-[1.75]" style={{ background:'#0d1117' }}>
              <div className="flex gap-4">
                <div className="select-none text-right leading-[1.75] text-[11px]" style={{ color:'#484f58' }}>
                  {[1,2,3,4,5,6,7].map(n=><div key={n}>{n}</div>)}
                </div>
                <div>
                  <div><span style={{color:'#ff7b72'}}>const</span> <span style={{color:'#79c0ff'}}>greet</span> <span style={{color:'#e6edf3'}}> = (</span><span style={{color:'#ffa657'}}>name</span><span style={{color:'#e6edf3'}}>) =&gt; {'{'}</span></div>
                  <div className="pl-4"><span style={{color:'#ff7b72'}}>return</span> <span style={{color:'#a5d6ff'}}>{"`Hello, ${name}! 👋`"}</span><span style={{color:'#e6edf3'}}>;</span></div>
                  <div><span style={{color:'#e6edf3'}}>{'};'}</span></div>
                  <div>&nbsp;</div>
                  <div><span style={{color:'#8b949e'}}>// Edit and press Run ▶</span></div>
                  <div><span style={{color:'#79c0ff'}}>console</span><span style={{color:'#e6edf3'}}>.</span><span style={{color:'#d2a8ff'}}>log</span><span style={{color:'#e6edf3'}}>(greet(</span><span style={{color:'#a5d6ff'}}>&ldquo;Developer&rdquo;</span><span style={{color:'#e6edf3'}}>));</span></div>
                  <div style={{color:'#3fb950'}} className="mt-1">▶ Hello, Developer! 👋</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-2" style={{ background:'#161b22', borderTop:'1px solid #30363d' }}>
              <span className="text-[10px] font-mono" style={{ color:'#484f58' }}>5 starter templates</span>
              <Link href="/playground" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white hover:opacity-90 transition-opacity" style={{ background:'#22c55e' }}>
                <Play className="w-3 h-3"/> Run ▶
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
