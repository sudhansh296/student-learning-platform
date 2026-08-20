'use client';
import { Info, AlertTriangle, Lightbulb, Sparkles } from 'lucide-react';
import type { CssSection } from '@/data/css-curriculum';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { InlinePlayground } from '@/components/docs/InlinePlayground';

function OpenInEditorButton({ code, language }: { code: string; language: string }) {
  const handleClick = () => {
    const encoded = btoa(unescape(encodeURIComponent(code)));
    const param = language === 'css' ? 'css' : language === 'javascript' || language === 'js' ? 'js' : 'html';
    window.open(`/playground?${param}=${encodeURIComponent(encoded)}`, '_blank');
  };
  return (
    <button onClick={handleClick}
      className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full font-bold text-white text-xs hover:opacity-85 transition-opacity"
      style={{ background:'#1a1a1a' }}>
      <span style={{ color:'#22c55e', fontFamily:'monospace', fontSize:'13px' }}>&gt;_</span>
      Code Editor
    </button>
  );
}

export function CssSectionRenderer({ sections }: { sections: CssSection[] }) {
  return (
    <div className="max-w-[72ch]">
      {sections.map((s, i) => {
        switch (s.type) {
          case 'text':
            return <p key={i} className="text-[15px] leading-[1.85] mb-4" style={{ color:'var(--text-2)' }}>{s.content}</p>;

          case 'heading':
            return (
              <h2 key={i}
                id={(s.content||'').toLowerCase().replace(/\s+/g,'-').replace(/[^\w-]/g,'')}
                className="text-xl font-extrabold mt-10 mb-4 pb-2"
                style={{ color:'var(--text)', borderBottom:'2px solid var(--line)', scrollMarginTop:'5rem' }}>
                {s.content}
              </h2>
            );

          case 'code':
            return (
              <div key={i} className="my-5">
                {s.title && <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color:'var(--text-3)' }}>Example — {s.title}</p>}
                {s.content && (
                  <p className="text-[14px] leading-relaxed mb-3 pl-3" style={{ color:'var(--text-2)', borderLeft:'3px solid #264DE4' }}>
                    {s.content}
                  </p>
                )}
                <CodeBlock code={s.code||''} language={s.language||'css'} showLineNumbers/>
                <OpenInEditorButton code={s.code||''} language={s.language||'css'}/>
              </div>
            );

          case 'tryit':
            return (
              <div key={i} className="my-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-5 rounded-full" style={{ background:'#22c55e' }}/>
                  <p className="text-xs font-extrabold uppercase tracking-widest" style={{ color:'#16a34a' }}>
                    ▶ Try It Yourself{s.title ? ` — ${s.title}` : ''}
                  </p>
                </div>
                {s.content && (
                  <p className="text-[14px] leading-relaxed mb-3" style={{ color:'var(--text-2)' }}>{s.content}</p>
                )}
                <InlinePlayground html={s.html||''} css={s.css||''} js={s.js||''} mode={s.mode||'html'} title={s.title} height={420}/>
              </div>
            );

          case 'note':
            return (
              <div key={i} className="flex gap-3 rounded-xl p-4 my-4" style={{ background:'#eff6ff', border:'1px solid #bfdbfe' }}>
                <Info className="w-4 h-4 shrink-0 mt-0.5" style={{ color:'#1d4ed8' }}/>
                <div>
                  {s.title && <p className="text-sm font-bold mb-1" style={{ color:'#1d4ed8' }}>{s.title}</p>}
                  <p className="text-sm leading-relaxed" style={{ color:'#1e40af' }}>{s.content}</p>
                </div>
              </div>
            );

          case 'warning':
            return (
              <div key={i} className="flex gap-3 rounded-xl p-4 my-4" style={{ background:'#fff7ed', border:'1px solid #fed7aa' }}>
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color:'#c2410c' }}/>
                <div>
                  {s.title && <p className="text-sm font-bold mb-1" style={{ color:'#c2410c' }}>{s.title}</p>}
                  <p className="text-sm leading-relaxed" style={{ color:'#9a3412' }}>{s.content}</p>
                </div>
              </div>
            );

          case 'tip':
            return (
              <div key={i} className="flex gap-3 rounded-xl p-4 my-4" style={{ background:'#f0fdf4', border:'1px solid #bbf7d0' }}>
                <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" style={{ color:'#15803d' }}/>
                <div>
                  {s.title && <p className="text-sm font-bold mb-1" style={{ color:'#15803d' }}>{s.title}</p>}
                  <p className="text-sm leading-relaxed" style={{ color:'#166534' }}>{s.content}</p>
                </div>
              </div>
            );

          case 'analogy':
            return (
              <div key={i} className="rounded-xl p-4 my-5" style={{ background:'#f5f3ff', border:'1px solid #ddd6fe' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4" style={{ color:'#7c3aed' }}/>
                  <span className="text-xs font-extrabold uppercase tracking-widest" style={{ color:'#7c3aed' }}>{s.title||'Analogy'}</span>
                </div>
                <p className="text-sm leading-relaxed italic" style={{ color:'#5b21b6' }}>&ldquo;{s.content}&rdquo;</p>
              </div>
            );

          case 'list':
            return (
              <div key={i} className="my-5">
                {s.title && <p className="text-sm font-bold mb-3" style={{ color:'var(--text)' }}>{s.title}</p>}
                <ul className="space-y-2">
                  {s.items?.map((item, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-[14px] leading-relaxed" style={{ color:'var(--text-2)' }}>
                      <span className="w-1.5 h-1.5 rounded-full mt-2.5 shrink-0" style={{ background:'#264DE4' }}/>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );

          case 'table':
            return (
              <div key={i} className="my-5 overflow-x-auto">
                {s.title && <p className="text-sm font-bold mb-2" style={{ color:'var(--text)' }}>{s.title}</p>}
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr style={{ background:'var(--bg-section)' }}>
                      {s.headers?.map((h, hi) => (
                        <th key={hi} className="text-left px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-wider"
                          style={{ border:'1px solid var(--line)', color:'var(--text)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {s.rows?.map((row, ri) => (
                      <tr key={ri} style={{ background: ri%2===0 ? 'var(--card)' : 'var(--bg-section)' }}>
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-4 py-2.5 font-mono text-xs"
                            style={{ border:'1px solid var(--line)', color:'var(--text-2)' }}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          default: return null;
        }
      })}
    </div>
  );
}
