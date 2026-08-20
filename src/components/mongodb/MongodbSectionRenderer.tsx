'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Info, AlertTriangle, Lightbulb, Sparkles, Play, RotateCcw, Copy, Check, Maximize2, X } from 'lucide-react';
import type { MongodbSection } from '@/data/mongodb-curriculum';
import { CodeBlock } from '@/components/docs/CodeBlock';

function CopyCodeBtn({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={async () => { await navigator.clipboard.writeText(code).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
      className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full font-bold text-white text-xs hover:opacity-80 transition-opacity"
      style={{ background: '#00ED64' }}>
      {copied ? <><Check className="w-3 h-3 text-white" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy Code</>}
    </button>
  );
}

function MongodbPlayground({ js, css, title }: { js: string; css: string; title?: string }) {
  const [code, setCode] = useState(js);
  const [blobUrl, setBlobUrl] = useState('');
  const [fullscreen, setFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const prevUrl = useRef('');

  const makeUrl = useCallback((j: string, c: string) => {
    if (prevUrl.current) URL.revokeObjectURL(prevUrl.current);
    const html = '<!DOCTYPE html><html><head><meta charset="UTF-8">' +
      '<style>*{box-sizing:border-box}body{margin:0;font-family:system-ui,sans-serif;font-size:14px;line-height:1.6}' + c + '</style>' +
      '</head><body><div id="output"></div><script>' + j + '<\/script></body></html>';
    const bytes = new TextEncoder().encode(html);
    const blob = new Blob([bytes], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    prevUrl.current = url;
    return url;
  }, []);

  useEffect(() => {
    setBlobUrl(makeUrl(js, css));
    return () => { if (prevUrl.current) URL.revokeObjectURL(prevUrl.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const run = () => setBlobUrl(makeUrl(code, css));
  const reset = () => { setCode(js); setBlobUrl(makeUrl(js, css)); };
  const copy = async () => { await navigator.clipboard.writeText(code).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1800); };

  return (
    <>
      {fullscreen && <div className="fixed inset-0 z-[199] bg-black/60 backdrop-blur-sm" onClick={() => setFullscreen(false)} />}
      <div className={`my-5 rounded-xl overflow-hidden border border-[#30363d] bg-[#0d1117] ${fullscreen ? 'fixed inset-4 z-[200] flex flex-col' : ''}`}>
        <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5 mr-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <span className="text-[11px] font-mono font-semibold text-white">Mongodb Simulation</span>
            {title && <span className="ml-2 text-[10px] text-[#484f58] font-mono">{title}</span>}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={copy} className="px-2 py-1 rounded text-[10px] text-[#8b949e] hover:text-white hover:bg-[#21262d]">
              {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            </button>
            <button onClick={reset} className="px-2 py-1 rounded text-[10px] text-[#8b949e] hover:text-white hover:bg-[#21262d]"><RotateCcw className="w-3 h-3" /></button>
            <button onClick={() => setFullscreen(f => !f)} className="px-2 py-1 rounded text-[10px] text-[#8b949e] hover:text-white hover:bg-[#21262d]">
              {fullscreen ? <X className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            </button>
          </div>
        </div>
        <div className={`flex ${fullscreen ? 'flex-1 min-h-0' : ''}`} style={fullscreen ? {} : { height: 420 }}>
          <div className="flex flex-col w-1/2 border-r border-[#30363d]">
            <textarea value={code} onChange={e => setCode(e.target.value)}
              onKeyDown={e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') run(); }}
              className="flex-1 w-full p-4 font-mono text-[13px] leading-relaxed resize-none outline-none bg-[#0d1117] text-[#e6edf3] caret-white"
              spellCheck={false} style={{ tabSize: 2 }} />
          </div>
          <div className="flex flex-col w-1/2 bg-white">
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#f0f2f4] border-b border-[#d0d7de]">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Live Preview</span>
              <button onClick={run} className="flex items-center gap-1.5 px-3 py-1 text-white text-[11px] font-semibold rounded" style={{ background: '#00ED64' }}>
                <Play className="w-3 h-3" /> Run
              </button>
            </div>
            {blobUrl
              ? <iframe src={blobUrl} className="flex-1 border-0 w-full bg-white" sandbox="allow-scripts allow-same-origin" title="Mongodb Preview" />
              : <div className="flex-1 bg-gray-50 flex items-center justify-center text-xs text-gray-400">Loading preview...</div>
            }
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-1.5 bg-[#161b22] border-t border-[#30363d]">
          <span className="text-[10px] text-[#484f58] font-mono">Vanilla JS simulation - Ctrl+Enter to run</span>
          <button onClick={run} className="flex items-center gap-1.5 px-3 py-1 text-white text-[11px] font-semibold rounded" style={{ background: '#00ED64' }}>
            <Play className="w-3 h-3" /> Run
          </button>
        </div>
      </div>
    </>
  );
}

export function MongodbSectionRenderer({ sections }: { sections: MongodbSection[] }) {
  return (
    <div className="space-y-1 max-w-[72ch]">
      {sections.map((s, i) => {
        switch (s.type) {
          case 'text': return <p key={i} className="text-[15px] leading-[1.85] mb-4" style={{ color: 'var(--text-2)' }}>{s.content}</p>;
          case 'heading': return <h2 key={i} id={(s.content||'').toLowerCase().replace(/\s+/g,'-').replace(/[^\w-]/g,'')} className="text-xl font-extrabold mt-10 mb-4 pb-2 scroll-mt-20" style={{ color: 'var(--text)', borderBottom: '2px solid #00ED64' }}>{s.content}</h2>;
          case 'example': return (
            <div key={i} className="my-6">
              {s.title && <div className="flex items-center gap-2 mb-2"><div className="w-1 h-5 rounded-full" style={{ background: '#00ED64' }} /><p className="text-[11px] font-extrabold uppercase tracking-widest" style={{ color: '#00ED64' }}>Example -- {s.title}</p></div>}
              {s.content && <p className="text-[14px] leading-relaxed mb-3 pl-3" style={{ color: 'var(--text-2)', borderLeft: '3px solid #00ED64' }}>{s.content}</p>}
              <CodeBlock code={s.code || ''} language={s.language || 'javascript'} output={s.output} showLineNumbers />
              <CopyCodeBtn code={s.code || ''} />
            </div>
          );
          case 'tryit': return (
            <div key={i} className="my-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-5 rounded-full" style={{ background: '#00ED64' }} />
                <p className="text-xs font-extrabold uppercase tracking-widest" style={{ color: '#00ED64' }}>Try It Yourself{s.title ? ` -- ${s.title}` : ''}</p>
              </div>
              <MongodbPlayground js={s.js || ''} css={s.css || ''} title={s.title} />
            </div>
          );
          case 'note': return <div key={i} className="flex gap-3 rounded-xl p-4 my-4" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}><Info className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#1d4ed8' }} /><div>{s.title && <p className="text-sm font-bold mb-1" style={{ color: '#1d4ed8' }}>{s.title}</p>}<p className="text-sm leading-relaxed" style={{ color: '#1e40af' }}>{s.content}</p></div></div>;
          case 'warning': return <div key={i} className="flex gap-3 rounded-xl p-4 my-4" style={{ background: '#fff7ed', border: '1px solid #fed7aa' }}><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#c2410c' }} /><div>{s.title && <p className="text-sm font-bold mb-1" style={{ color: '#c2410c' }}>{s.title}</p>}<p className="text-sm leading-relaxed" style={{ color: '#9a3412' }}>{s.content}</p></div></div>;
          case 'tip': return <div key={i} className="flex gap-3 rounded-xl p-4 my-4" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}><Lightbulb className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#15803d' }} /><div>{s.title && <p className="text-sm font-bold mb-1" style={{ color: '#15803d' }}>{s.title}</p>}<p className="text-sm leading-relaxed" style={{ color: '#166534' }}>{s.content}</p></div></div>;
          case 'analogy': return <div key={i} className="rounded-xl p-4 my-5" style={{ background: '#f5f3ff', border: '1px solid #ddd6fe' }}><div className="flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4" style={{ color: '#7c3aed' }} /><span className="text-xs font-extrabold uppercase tracking-widest" style={{ color: '#7c3aed' }}>{s.title || 'Analogy'}</span></div><p className="text-sm leading-relaxed italic" style={{ color: '#5b21b6' }}>&ldquo;{s.content}&rdquo;</p></div>;
          case 'list': return <div key={i} className="my-5">{s.title && <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>{s.title}</p>}<ul className="space-y-2">{s.items?.map((item, j) => <li key={j} className="flex items-start gap-2.5 text-[14px] leading-relaxed" style={{ color: 'var(--text-2)' }}><span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#00ED64' }} /><span>{item}</span></li>)}</ul></div>;
          case 'table': return <div key={i} className="my-5 overflow-x-auto">{s.title && <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>{s.title}</p>}<table className="w-full border-collapse text-sm"><thead><tr style={{ background: 'var(--bg-section)' }}>{s.headers?.map((h, hi) => <th key={hi} className="text-left px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-wider" style={{ border: '1px solid var(--line)', color: 'var(--text)' }}>{h}</th>)}</tr></thead><tbody>{s.rows?.map((row, ri) => <tr key={ri} style={{ background: ri%2===0?'var(--card)':'var(--bg-section)' }}>{row.map((cell, ci) => <td key={ci} className="px-4 py-2.5 font-mono text-xs" style={{ border: '1px solid var(--line)', color: 'var(--text-2)' }}>{cell}</td>)}</tr>)}</tbody></table></div>;
          default: return null;
        }
      })}
    </div>
  );
}
