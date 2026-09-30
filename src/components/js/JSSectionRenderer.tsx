'use client';

import type { JSSection } from '@/data/js-curriculum';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { Callout } from '@/components/docs/Callout';
import { AnalogyBox } from '@/components/docs/AnalogyBox';
import { InlinePlayground } from '@/components/docs/InlinePlayground';


export function JSSectionRenderer({ sections }: { sections: JSSection[] }) {
  return (
    <div className="space-y-1 max-w-[72ch]">
      {sections.map((s, i) => {
        switch (s.type) {

          case 'text':
            return (
              <p key={i} className="text-[15px] leading-[1.85] mb-4" style={{ color: 'var(--text-2)' }}>
                {s.content}
              </p>
            );

          case 'heading':
            return (
              <h2 key={i}
                id={(s.content || '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}
                className="text-xl font-extrabold mt-10 mb-4 pb-2 scroll-mt-20"
                style={{ color: 'var(--text)', borderBottom: '2px solid var(--line)' }}>
                {s.content}
              </h2>
            );

          // 'code' type — used by older js-curriculum.ts lessons
          case 'code':
            return (
              <div key={i} className="my-6">
                {/* Explanation label above code */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-5 rounded-full" style={{ background: '#f59e0b' }} />
                  <p className="text-[11px] font-extrabold uppercase tracking-widest" style={{ color: '#b45309' }}>
                    {s.language === 'javascript' ? 'JavaScript' : s.language?.toUpperCase()} Example
                  </p>
                </div>
                {/* Plain-English explanation if content field exists */}
                {s.content && (
                  <p className="text-[14px] leading-relaxed mb-3 pl-3" style={{ color: 'var(--text-2)', borderLeft: '3px solid #fbbf24' }}>
                    {s.content}
                  </p>
                )}
                <CodeBlock code={s.code || ''} language={s.language || 'javascript'} tech="js" showLineNumbers />
              </div>
            );

          // 'example' type — used by new js-lessons/ files
          case 'example':
            return (
              <div key={i} className="my-6">
                {s.title && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-5 rounded-full" style={{ background: '#f59e0b' }} />
                    <p className="text-[11px] font-extrabold uppercase tracking-widest" style={{ color: '#b45309' }}>
                      Example — {s.title}
                    </p>
                  </div>
                )}
                {/* Only show explanation if explicitly provided in content field */}
                {s.content && (
                  <p className="text-[14px] leading-relaxed mb-3 pl-3" style={{ color: 'var(--text-2)', borderLeft: '3px solid #fbbf24' }}>
                    {s.content}
                  </p>
                )}
                <CodeBlock code={s.code || ''} language={s.language || 'javascript'} tech="js" showLineNumbers />
              </div>
            );

          case 'tryit':
            return (
              <div key={i} className="my-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-5 rounded-full" style={{ background: '#22c55e' }} />
                  <p className="text-xs font-extrabold uppercase tracking-widest" style={{ color: '#16a34a' }}>
                    ▶ Try It Yourself{s.title ? ` — ${s.title}` : ''}
                  </p>
                </div>
                {s.content && (
                  <p className="text-[14px] leading-relaxed mb-3" style={{ color: 'var(--text-2)' }}>
                    {s.content}
                  </p>
                )}
                <InlinePlayground
                  html={s.html || ''}
                  css={s.css || ''}
                  js={s.js || ''}
                  mode={s.mode || 'full'}
                  title={s.title}
                  height={420}
                />
              </div>
            );

          case 'tip':
            return <Callout key={i} variant="tip" title={s.title}>{s.content || ''}</Callout>;
          case 'warning':
            return <Callout key={i} variant="warning" title={s.title}>{s.content || ''}</Callout>;
          case 'note':
            return <Callout key={i} variant="info" title={s.title}>{s.content || ''}</Callout>;
          case 'analogy':
            return <AnalogyBox key={i} title={s.title}>{s.content || ''}</AnalogyBox>;

          case 'list':
            return (
              <div key={i} className="my-5">
                {s.title && <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>{s.title}</p>}
                <ul className="space-y-2">
                  {s.items?.map((item, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-[14px] leading-relaxed" style={{ color: 'var(--text-2)' }}>
                      <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#f59e0b' }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
