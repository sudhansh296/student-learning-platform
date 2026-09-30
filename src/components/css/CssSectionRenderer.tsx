'use client';
import { Info, AlertTriangle, Lightbulb, Sparkles } from 'lucide-react';
import type { CssSection } from '@/data/css-curriculum';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { InlinePlayground } from '@/components/docs/InlinePlayground';

function getSectionId(content: string | undefined) {
  return (content || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function CssSectionRenderer({ sections }: { sections: CssSection[] }) {
  return (
    <div className="max-w-[72ch]">
      {sections.map((s, i) => {
        switch (s.type) {
          case 'text':
            return (
              <p key={i} className="mb-4 text-[15px] leading-[1.85] text-muted-foreground">
                {s.content}
              </p>
            );

          case 'heading':
            return (
              <h2
                key={i}
                id={getSectionId(s.content)}
                className="mt-10 mb-4 pb-2 text-xl font-extrabold text-foreground"
                style={{ borderBottom: '2px solid var(--line)', scrollMarginTop: '5rem' }}
              >
                {s.content}
              </h2>
            );

          case 'code':
            return (
              <div key={i} className="my-5">
                {s.title && (
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    Example — {s.title}
                  </p>
                )}
                {s.content && (
                  <p className="mb-3 border-l-4 border-blue-500 pl-3 text-[14px] leading-relaxed text-muted-foreground">
                    {s.content}
                  </p>
                )}
                <CodeBlock code={s.code || ''} language={s.language || 'css'} tech="css" showLineNumbers />
              </div>
            );

          case 'tryit':
            return (
              <div key={i} className="my-6">
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-5 w-1 rounded-full bg-green-500" />
                  <p className="text-xs font-extrabold uppercase tracking-widest text-green-600 dark:text-green-400">
                    Try It Yourself{s.title ? ` — ${s.title}` : ''}
                  </p>
                </div>
                {s.content && <p className="mb-3 text-[14px] leading-relaxed text-muted-foreground">{s.content}</p>}
                <InlinePlayground html={s.html || ''} css={s.css || ''} js={s.js || ''} mode={s.mode || 'html'} title={s.title} height={420} />
              </div>
            );

          case 'note':
            return (
              <div key={i} className="my-4 flex gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-700 dark:text-blue-400" />
                <div>
                  {s.title && <p className="mb-1 text-sm font-bold text-blue-700 dark:text-blue-300">{s.title}</p>}
                  <p className="text-sm leading-relaxed text-blue-800 dark:text-blue-200">{s.content}</p>
                </div>
              </div>
            );

          case 'warning':
            return (
              <div key={i} className="my-4 flex gap-3 rounded-xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-950/20">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-700 dark:text-orange-400" />
                <div>
                  {s.title && <p className="mb-1 text-sm font-bold text-orange-700 dark:text-orange-300">{s.title}</p>}
                  <p className="text-sm leading-relaxed text-orange-800 dark:text-orange-200">{s.content}</p>
                </div>
              </div>
            );

          case 'tip':
            return (
              <div key={i} className="my-4 flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/20">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-400" />
                <div>
                  {s.title && <p className="mb-1 text-sm font-bold text-emerald-700 dark:text-emerald-300">{s.title}</p>}
                  <p className="text-sm leading-relaxed text-emerald-800 dark:text-emerald-200">{s.content}</p>
                </div>
              </div>
            );

          case 'analogy':
            return (
              <div key={i} className="my-5 rounded-xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-800 dark:bg-violet-950/20">
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-violet-700 dark:text-violet-300" />
                  <span className="text-xs font-extrabold uppercase tracking-widest text-violet-700 dark:text-violet-300">
                    {s.title || 'Analogy'}
                  </span>
                </div>
                <p className="text-sm leading-relaxed italic text-violet-800 dark:text-violet-200">“{s.content}”</p>
              </div>
            );

          case 'list':
            return (
              <div key={i} className="my-5">
                {s.title && <p className="mb-3 text-sm font-bold text-foreground">{s.title}</p>}
                <ul className="space-y-2">
                  {s.items?.map((item, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-muted-foreground">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );

          case 'table':
            return (
              <div key={i} className="my-5 overflow-x-auto">
                {s.title && <p className="mb-2 text-sm font-bold text-foreground">{s.title}</p>}
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted/40">
                      {s.headers?.map((h, hi) => (
                        <th
                          key={hi}
                          className="border border-border px-4 py-2.5 text-left text-[11px] font-extrabold uppercase tracking-wider text-foreground"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {s.rows?.map((row, ri) => (
                      <tr key={ri} className={ri % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                        {row.map((cell, ci) => (
                          <td key={ci} className="border border-border px-4 py-2.5 font-mono text-xs text-muted-foreground">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
