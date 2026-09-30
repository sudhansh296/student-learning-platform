'use client';

import { useState, useCallback } from 'react';
import { Info, AlertTriangle, Lightbulb, Sparkles, Play, RotateCcw, Copy, Check, Maximize2, X } from 'lucide-react';
import { CodeBlock } from '@/components/docs/CodeBlock';

// Shared shape of a lesson "section" across the per-technology curriculum data files.
// Every `@/data/<tech>-curriculum` module's exported `<Tech>Section` type has this
// same field list — this interface exists so one renderer can serve all of them.
export interface TechSection {
  type: 'text' | 'heading' | 'example' | 'tryit' | 'note' | 'warning' | 'tip' | 'analogy' | 'list' | 'table';
  title?: string;
  content?: string;
  code?: string;
  language?: string;
  output?: string;
  items?: string[];
  headers?: string[];
  rows?: string[][];
  js?: string;
  css?: string;
}

export interface TechTheme {
  /** Lesson technology id — decides how examples open in the code editor ("Run in Editor"). */
  tech: string;
  /** Brand accent color, e.g. '#2496ED' for Docker. */
  brandColor: string;
  /** Playground toolbar label, e.g. 'Docker Simulation'. */
  brandLabel: string;
  /** Fallback code-block language when a section doesn't specify one. */
  defaultLanguage: string;
  /** Prepended to "Simulation" / "Live Preview" / "Try It Yourself" labels — Next.js uses '▲ '. */
  labelPrefix?: string;
  /** Catch runtime JS errors in the playground iframe and show them inline — Express opts into this. */
  showRuntimeErrors?: boolean;
  /** Override just the "Try It Yourself" heading's accent color instead of the brand color — Next.js uses green. */
  tryItAccent?: { bar: string; text: string };
  /** Override the Run button's className instead of an inline brandColor background — Next.js uses static Tailwind classes for its black-on-black hover state. */
  runButtonClassName?: string;
  /** Run button label — Next.js appends an arrow: 'Run ▶'. */
  runButtonLabel?: string;
  /** Copy-confirmation checkmark color — defaults to white, some techs tint it. */
  copyCheckColor?: string;
}

function TechPlayground({ js, css, title, theme }: { js: string; css: string; title?: string; theme: TechTheme }) {
  const [code, setCode] = useState(js);
  const [cssCode, setCssCode] = useState(css);
  const [tab, setTab] = useState<'js' | 'css'>('js');
  const hasCssTab = css.trim().length > 0;
  const [fullscreen, setFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  const buildDoc = useCallback((j: string, c: string) => {
    const errorHandling = theme.showRuntimeErrors
      ? `window.onerror=(m,_,ln)=>{document.body.innerHTML+='<p style="color:red;font-size:12px;padding:8px">Error: '+m+'</p>';return false};
try{${j}}catch(e){document.body.innerHTML+='<p style="color:red;font-size:12px;padding:8px">Error: '+e.message+'</p>';}`
      : j;
    return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>*{box-sizing:border-box}body{margin:0;font-family:system-ui,sans-serif;font-size:14px;line-height:1.6}${c}</style>
</head><body><div id="output"></div><script>
${errorHandling}
<\/script></body></html>`;
  }, [theme.showRuntimeErrors]);

  const [srcDoc, setSrcDoc] = useState(() => buildDoc(js, css));

  const run = () => setSrcDoc(buildDoc(code, cssCode));
  const reset = () => { setCode(js); setCssCode(css); setSrcDoc(buildDoc(js, css)); };
  const activeCode = tab === 'css' ? cssCode : code;
  const setActiveCode = tab === 'css' ? setCssCode : setCode;
  const copy = async () => { await navigator.clipboard.writeText(activeCode).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1800); };
  const tabBtn = (t: 'js' | 'css', label: string, color: string) => (
    <button key={t} onClick={() => setTab(t)}
      className={`px-2.5 py-1 text-[10px] font-mono font-semibold uppercase rounded border-b-2 transition-colors ${tab === t ? `${color} bg-[#21262d]` : 'border-transparent text-[#8b949e] hover:text-white'}`}>
      {label}
    </button>
  );

  const prefix = theme.labelPrefix || '';
  const runLabel = theme.runButtonLabel || 'Run';
  const runBtnProps = theme.runButtonClassName
    ? { className: `flex items-center gap-1.5 px-3 py-1 text-white text-[11px] font-semibold rounded ${theme.runButtonClassName}` }
    : { className: 'flex items-center gap-1.5 px-3 py-1 text-white text-[11px] font-semibold rounded', style: { background: theme.brandColor } };

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
            <span className="text-[11px] font-mono font-semibold text-white">{prefix}{theme.brandLabel}</span>
            {title && <span className="ml-2 text-[10px] text-[#7d8590] font-mono hidden sm:inline">{title}</span>}
            {hasCssTab && (
              <div className="flex items-center gap-1 ml-2">
                {tabBtn('js', 'JS', 'text-yellow-400 border-yellow-400')}
                {tabBtn('css', 'CSS', 'text-blue-400 border-blue-400')}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button aria-label="Copy code" onClick={copy} className="px-2 py-1 rounded text-[10px] text-[#8b949e] hover:text-white hover:bg-[#21262d]">
              {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            </button>
            <button aria-label="Reset example" onClick={reset} className="px-2 py-1 rounded text-[10px] text-[#8b949e] hover:text-white hover:bg-[#21262d]"><RotateCcw className="w-3 h-3" /></button>
            <button aria-label="Toggle full screen" onClick={() => setFullscreen(f => !f)} className="px-2 py-1 rounded text-[10px] text-[#8b949e] hover:text-white hover:bg-[#21262d]">
              {fullscreen ? <X className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            </button>
          </div>
        </div>
        <div className={`flex flex-col md:flex-row ${fullscreen ? 'flex-1 min-h-0' : ''}`}>
          <div className="flex flex-col w-full md:w-1/2 border-b md:border-b-0 md:border-r border-[#30363d]" style={{ minHeight: 420 }}>
            <textarea aria-label="Code editor" value={activeCode} onChange={e => setActiveCode(e.target.value)}
              onKeyDown={e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') run(); }}
              className="flex-1 w-full p-4 font-mono text-[13px] leading-relaxed resize-none outline-none bg-[#0d1117] text-[#e6edf3] caret-white"
              spellCheck={false} style={{ tabSize: 2 }} />
          </div>
          <div className="flex flex-col w-full md:w-1/2 bg-white" style={{ minHeight: 420 }}>
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#f0f2f4] border-b border-[#d0d7de]">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">{prefix}Live Preview</span>
              <button onClick={run} {...runBtnProps}>
                <Play className="w-3 h-3" /> {runLabel}
              </button>
            </div>
            {srcDoc
              ? <iframe srcDoc={srcDoc} className="flex-1 border-0 w-full bg-white" sandbox="allow-scripts allow-same-origin" title={`${theme.brandLabel.replace(/ Simulation$/, '')} Preview`} />
              : <div className="flex-1 bg-gray-50 flex items-center justify-center text-xs text-gray-400">Loading preview...</div>
            }
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-1.5 bg-[#161b22] border-t border-[#30363d]">
          <span className="text-[10px] text-[#7d8590] font-mono">Vanilla JS simulation • Ctrl+Enter to run</span>
          <button onClick={run} {...runBtnProps}>
            <Play className="w-3 h-3" /> {runLabel}
          </button>
        </div>
      </div>
    </>
  );
}

/**
 * A brand colour used as small text must stay readable (WCAG AA, 4.5:1). Very light brands (MongoDB green, Docker blue …) are
 * mixed toward the theme's text colour just far enough on the light theme; on the dark theme the same mix gets lighter, which is fine.
 */
function readableBrand(brand: string): string {
  const h = brand.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const rgb = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  if (rgb.some((n) => Number.isNaN(n))) return 'var(--text)';
  const lin = (c: number) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  const lum = (c: number[]) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
  const dark = [30, 30, 30]; // the light theme's --text
  for (const f of [0, 0.25, 0.4, 0.55, 0.7, 0.85]) {
    const mixed = rgb.map((c, i) => c * (1 - f) + dark[i] * f);
    if (1.05 / (lum(mixed) + 0.05) >= 4.5) return f === 0 ? brand : `color-mix(in srgb, ${brand} ${Math.round((1 - f) * 100)}%, var(--text))`;
  }
  return 'var(--text)';
}

export function TechSectionRenderer({ sections, theme }: { sections: TechSection[]; theme: TechTheme }) {
  const tryItBar = theme.tryItAccent?.bar || theme.brandColor;
  const tryItText = theme.tryItAccent?.text || theme.brandColor;
  const prefix = theme.labelPrefix || '';

  return (
    <div className="space-y-1 max-w-[72ch]">
      {sections.map((s, i) => {
        switch (s.type) {
          case 'text': return <p key={i} className="text-[15px] leading-[1.85] mb-4" style={{ color: 'var(--text-2)' }}>{s.content}</p>;
          case 'heading': return <h2 key={i} id={(s.content || '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')} className="text-xl font-extrabold mt-10 mb-4 pb-2 scroll-mt-20" style={{ color: 'var(--text)', borderBottom: `2px solid ${theme.brandColor}` }}>{s.content}</h2>;
          case 'example': return (
            <div key={i} className="my-6">
              {s.title && <div className="flex items-center gap-2 mb-2"><div className="w-1 h-5 rounded-full" style={{ background: theme.brandColor }} /><p className="text-[11px] font-extrabold uppercase tracking-widest" style={{ color: readableBrand(theme.brandColor) }}>Example — {s.title}</p></div>}
              {s.content && <p className="text-[14px] leading-relaxed mb-3 pl-3" style={{ color: 'var(--text-2)', borderLeft: `3px solid ${theme.brandColor}` }}>{s.content}</p>}
              <CodeBlock code={s.code || ''} language={s.language || theme.defaultLanguage} tech={theme.tech} showLineNumbers />
            </div>
          );
          case 'tryit': return (
            <div key={i} className="my-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-5 rounded-full" style={{ background: tryItBar }} />
                <p className="text-xs font-extrabold uppercase tracking-widest" style={{ color: tryItText }}>{prefix}Try It Yourself{s.title ? ` — ${s.title}` : ''}</p>
              </div>
              <TechPlayground js={s.js || ''} css={s.css || ''} title={s.title} theme={theme} />
            </div>
          );
          case 'note': return <div key={i} className="flex gap-3 rounded-xl p-4 my-4" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}><Info className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#1d4ed8' }} /><div>{s.title && <p className="text-sm font-bold mb-1" style={{ color: '#1d4ed8' }}>{s.title}</p>}<p className="text-sm leading-relaxed" style={{ color: '#1e40af' }}>{s.content}</p></div></div>;
          case 'warning': return <div key={i} className="flex gap-3 rounded-xl p-4 my-4" style={{ background: '#fff7ed', border: '1px solid #fed7aa' }}><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#c2410c' }} /><div>{s.title && <p className="text-sm font-bold mb-1" style={{ color: '#c2410c' }}>{s.title}</p>}<p className="text-sm leading-relaxed" style={{ color: '#9a3412' }}>{s.content}</p></div></div>;
          case 'tip': return <div key={i} className="flex gap-3 rounded-xl p-4 my-4" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}><Lightbulb className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#15803d' }} /><div>{s.title && <p className="text-sm font-bold mb-1" style={{ color: '#15803d' }}>{s.title}</p>}<p className="text-sm leading-relaxed" style={{ color: '#166534' }}>{s.content}</p></div></div>;
          case 'analogy': return <div key={i} className="rounded-xl p-4 my-5" style={{ background: '#f5f3ff', border: '1px solid #ddd6fe' }}><div className="flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4" style={{ color: '#7c3aed' }} /><span className="text-xs font-extrabold uppercase tracking-widest" style={{ color: '#7c3aed' }}>{s.title || 'Analogy'}</span></div><p className="text-sm leading-relaxed italic" style={{ color: '#5b21b6' }}>&ldquo;{s.content}&rdquo;</p></div>;
          case 'list': return <div key={i} className="my-5">{s.title && <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>{s.title}</p>}<ul className="space-y-2">{s.items?.map((item, j) => <li key={j} className="flex items-start gap-2.5 text-[14px] leading-relaxed" style={{ color: 'var(--text-2)' }}><span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: theme.brandColor }} /><span>{item}</span></li>)}</ul></div>;
          case 'table': return <div key={i} className="my-5 overflow-x-auto">{s.title && <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>{s.title}</p>}<table className="w-full border-collapse text-sm"><thead><tr style={{ background: 'var(--bg-section)' }}>{s.headers?.map((h, hi) => <th key={hi} className="text-left px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-wider" style={{ border: '1px solid var(--line)', color: 'var(--text)' }}>{h}</th>)}</tr></thead><tbody>{s.rows?.map((row, ri) => <tr key={ri} style={{ background: ri % 2 === 0 ? 'var(--card)' : 'var(--bg-section)' }}>{row.map((cell, ci) => <td key={ci} className="px-4 py-2.5 font-mono text-xs" style={{ border: '1px solid var(--line)', color: 'var(--text-2)' }}>{cell}</td>)}</tr>)}</tbody></table></div>;
          default: return null;
        }
      })}
    </div>
  );
}
