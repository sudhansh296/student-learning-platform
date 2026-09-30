'use client';

import { useEffect, useState } from 'react';

export interface LessonHit {
  type: 'lesson' | 'technology';
  course: string;
  courseLabel: string;
  lesson: string;
  lessonTitle: string;
  section: string;
  kind: string;
  href: string;
  hl: string;
  snippet: string;
}

interface Response { results?: LessonHit[]; corrected?: string | null; marks?: string[] }

/** Link to a hit: the lesson page plus the text to scroll to and highlight (see SearchHighlight). */
export function hitHref(r: LessonHit, marks: string[]): string {
  if (!r.hl) return r.href;
  return `${r.href}?hl=${encodeURIComponent(r.hl)}&q=${encodeURIComponent(marks.join(' '))}`;
}

/** Debounced full-text lesson search (/api/search). `corrected` is set when a spelling mistake was fixed. */
export function useLessonSearch(query: string): { hits: LessonHit[]; loading: boolean; corrected: string | null; marks: string[] } {
  const [state, setState] = useState<{ q: string; data: Response }>({ q: '', data: {} });
  const trimmed = query.trim();
  useEffect(() => {
    if (trimmed.length < 2) return;
    const ctl = new AbortController();
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, { signal: ctl.signal })
        .then((r) => r.json())
        .then((d: Response) => setState({ q: trimmed, data: d }))
        .catch(() => { /* aborted or offline */ });
    }, 140);
    return () => { clearTimeout(timer); ctl.abort(); };
  }, [trimmed]);
  const active = trimmed.length >= 2;
  const ready = active && state.q === trimmed;
  return {
    hits: active ? state.data.results || [] : [],
    loading: active && !ready,
    corrected: active ? state.data.corrected || null : null,
    marks: active ? state.data.marks || trimmed.toLowerCase().split(/\s+/) : [],
  };
}
