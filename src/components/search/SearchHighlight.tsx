'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();
const SKIP = 'header, nav, footer, aside, [data-search-skip]';
const CANDIDATES = 'h1, h2, h3, h4, h5, p, li, td, th, summary, blockquote, pre, figcaption, label, dt, dd';

/** The element (deepest one) whose text contains `needle`; headings win over body text. */
function findTarget(needles: string[]): HTMLElement | null {
  const nodes = Array.from(document.querySelectorAll<HTMLElement>(CANDIDATES)).filter((el) => !el.closest(SKIP));
  for (const needle of needles) {
    if (needle.length < 2) continue;
    const hits = nodes.filter((el) => norm(el.textContent || '').includes(needle));
    if (!hits.length) continue;
    const heading = hits.find((el) => /^H[1-5]$/.test(el.tagName));
    if (heading) return heading;
    return hits.sort((a, b) => (a.textContent || '').length - (b.textContent || '').length)[0];
  }
  return null;
}

/**
 * Lesson pages opened from the search box carry ?hl=<text>: scroll to where that text is on the page and
 * flash it, like the "find in page" of a docs site.
 */
export function SearchHighlight() {
  const pathname = usePathname();
  const params = useSearchParams();
  const hl = params.get('hl') || '';
  const q = params.get('q') || '';

  useEffect(() => {
    if (!hl) return;
    const needles = [norm(hl), norm(hl).slice(0, 24), ...norm(q).split(' ')].filter((n, i, a) => n && a.indexOf(n) === i);
    let tries = 0;
    let cleanup: (() => void) | undefined;
    const attempt = () => {
      const el = findTarget(needles);
      if (!el) { if (++tries < 25) timer = window.setTimeout(attempt, 160); return; }
      if (!document.getElementById('search-hit-style')) {
        const st = document.createElement('style');
        st.id = 'search-hit-style';
        st.textContent = '.search-hit{outline:2px solid #f59e0b;outline-offset:4px;border-radius:6px;background:rgba(253,230,138,.55)!important;transition:background 1.2s,outline-color 1.2s}.search-hit.fade{background:transparent!important;outline-color:transparent}';
        document.head.appendChild(st);
      }
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      el.classList.add('search-hit');
      const t1 = window.setTimeout(() => el.classList.add('fade'), 2200);
      const t2 = window.setTimeout(() => el.classList.remove('search-hit', 'fade'), 3600);
      cleanup = () => { clearTimeout(t1); clearTimeout(t2); el.classList.remove('search-hit', 'fade'); };
    };
    let timer = window.setTimeout(attempt, 250);
    return () => { clearTimeout(timer); cleanup?.(); };
  }, [pathname, hl, q]);

  return null;
}
