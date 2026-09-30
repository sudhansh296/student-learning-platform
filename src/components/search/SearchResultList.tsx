'use client';

import Link from 'next/link';
import { hitHref, type LessonHit } from '@/lib/searchClient';

function Marked({ text, marks }: { text: string; marks: string[] }) {
  const terms = marks.filter((t) => t.length > 1).sort((a, b) => b.length - a.length).map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (!terms.length) return <>{text}</>;
  const parts = text.split(new RegExp(`(${terms.join('|')})`, 'ig'));
  return (
    <>
      {parts.map((p, i) => (i % 2 === 1
        ? <mark key={i} className="rounded px-0.5" style={{ background: '#fde68a', color: '#78350f' }}>{p}</mark>
        : <span key={i}>{p}</span>))}
    </>
  );
}

interface Props {
  hits: LessonHit[];
  marks: string[];
  corrected?: string | null;
  active: number;
  onHover: (i: number) => void;
  onPick: () => void;
  className?: string;
}

export function SearchResultList({ hits, marks, corrected, active, onHover, onPick, className = '' }: Props) {
  return (
    <div>
    {corrected && <p className="px-4 pt-2.5 pb-1 text-[11px]" style={{ color: 'var(--text-3)' }}>Showing results for <strong style={{ color: 'var(--text)' }}>{corrected}</strong></p>}
    <ul className={`overflow-y-auto py-1 ${className}`} role="listbox">
      {hits.map((r, i) => (
        <li key={`${r.href}-${r.section}-${i}`} role="option" aria-selected={i === active}>
          <Link
            href={hitHref(r, marks)}
            onClick={onPick}
            onMouseEnter={() => onHover(i)}
            className="flex items-start gap-3 px-4 py-2.5 transition-colors"
            style={{ borderBottom: '1px solid var(--line)', background: i === active ? 'var(--bg-section)' : 'transparent' }}
          >
            <span className="text-[10px] font-bold px-2 py-0.5 rounded mt-0.5 uppercase tracking-wider shrink-0 whitespace-nowrap"
              style={{ background: '#eff6ff', color: '#1d4ed8' }}>{r.courseLabel}</span>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold leading-snug" style={{ color: 'var(--text)' }}>
                <Marked text={r.lessonTitle} marks={marks} />
                {r.section && <span className="font-normal" style={{ color: 'var(--text-3)' }}> › <Marked text={r.section} marks={marks} /></span>}
              </p>
              {r.snippet && (
                <p className="text-[11.5px] mt-0.5 line-clamp-2" style={{ color: 'var(--text-3)' }}>
                  <Marked text={r.snippet} marks={marks} />
                </p>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
    </div>
  );
}
