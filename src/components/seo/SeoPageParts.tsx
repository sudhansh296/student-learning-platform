import Link from 'next/link';
import { Breadcrumb } from '@/components/docs/Breadcrumb';
import { SITE_NAME, SITE_URL, lessonLink } from '@/lib/seo';
import { RichText } from '@/components/seo/RichText';
import type { PageNote } from '@/data/seo/page-notes';

/** Shared building blocks for the SEO landing pages (cheat sheets, roadmaps, question banks). */

export interface Faq { q: string; a: string }

export function PageShell({ children }: { children: React.ReactNode }) {
  return <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-10">{children}</div>;
}

export function PageHeader({ crumbs, badge, h1, intro }: { crumbs: { label: string; href?: string }[]; badge: string; h1: string; intro: string }) {
  return (
    <header className="mb-10 max-w-3xl">
      <Breadcrumb items={crumbs} />
      <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3" style={{ background: '#eff6ff', color: '#1d4ed8' }}>{badge}</span>
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-4" style={{ color: 'var(--text)' }}>{h1}</h1>
      <p className="text-[16px] leading-relaxed" style={{ color: 'var(--text-2)' }}>{intro}</p>
    </header>
  );
}

/** "On this page" list; sticky next to the content on large screens. */
export function Toc({ items }: { items: { id: string; title: string }[] }) {
  return (
    <aside className="hidden lg:block w-60 shrink-0" data-search-skip>
      <nav aria-label="On this page" className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
        <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-3)' }}>On this page</p>
        <ul className="space-y-1.5 border-l pl-4" style={{ borderColor: 'var(--line)' }}>
          {items.map((it) => (
            <li key={it.id}>
              <a href={`#${it.id}`} className="text-[13px] leading-snug block py-0.5 hover:text-blue-600" style={{ color: 'var(--text-2)' }}>{it.title}</a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export function DataTable({ headers, rows, codeCols = [] }: { headers: string[]; rows: string[][]; codeCols?: number[] }) {
  return (
    <div className="overflow-x-auto rounded-xl my-4" style={{ border: '1px solid var(--line)' }}>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr style={{ background: 'var(--bg-section)' }}>
            {headers.map((h) => <th key={h} className="text-left px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-wider whitespace-nowrap" style={{ color: 'var(--text)', borderBottom: '1px solid var(--line)' }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ background: i % 2 ? 'var(--bg-section)' : 'var(--card)' }}>
              {r.map((c, j) => (
                <td key={j} className={`px-4 py-2.5 align-top ${codeCols.includes(j) ? 'font-mono text-[12.5px] whitespace-pre-wrap' : 'text-[13.5px] leading-relaxed'}`} style={{ color: codeCols.includes(j) ? 'var(--text)' : 'var(--text-2)', borderBottom: i < rows.length - 1 ? '1px solid var(--line)' : 'none' }}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** "Learn more" links to lessons ("course/slug" keys); keys that do not exist are skipped. */
export function LessonLinks({ keys, title = 'Learn more' }: { keys: string[]; title?: string }) {
  const links = keys.map(lessonLink).filter((x): x is NonNullable<ReturnType<typeof lessonLink>> => !!x);
  if (!links.length) return null;
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className="text-[12px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>{title}:</span>
      {links.map((l) => (
        <Link key={l.href} href={l.href} className="text-[13px] font-medium px-3 py-1 rounded-full transition-colors hover:border-blue-400" style={{ border: '1px solid var(--line)', background: 'var(--card)', color: 'var(--text)' }}>{l.title}</Link>
      ))}
    </div>
  );
}

export function FaqSection({ faq }: { faq: Faq[] }) {
  if (!faq.length) return null;
  return (
    <section id="faq" className="scroll-mt-24 mt-14">
      <h2 className="text-2xl font-extrabold mb-5" style={{ color: 'var(--text)' }}>Frequently asked questions</h2>
      <div className="space-y-3">
        {faq.map((f) => (
          <details key={f.q} className="rounded-xl px-5 py-4 group" style={{ border: '1px solid var(--line)', background: 'var(--card)' }}>
            <summary className="cursor-pointer font-semibold text-[15px]" style={{ color: 'var(--text)' }}>{f.q}</summary>
            <p className="mt-3 text-[14.5px] leading-relaxed" style={{ color: 'var(--text-2)' }}>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}

/** Article + breadcrumb (+ FAQ when there is one) structured data for a landing page. */
export function landingJsonLd(o: { path: string; headline: string; description: string; faq?: Faq[] }) {
  const url = `${SITE_URL}${o.path}`;
  const graph: object[] = [
    { '@type': 'Article', headline: o.headline, description: o.description, url, mainEntityOfPage: url, inLanguage: 'en', author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL }, publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL } },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }, { '@type': 'ListItem', position: 2, name: o.headline, item: url }] },
  ];
  if (o.faq?.length) graph.push({ '@type': 'FAQPage', mainEntity: o.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
  return { '@context': 'https://schema.org', '@graph': graph };
}

/* ───────────── human-written notes (see data/seo/page-notes.ts) ───────────── */

const isTop = (n: PageNote) => n.placement === 'top';
const isCallout = (n: PageNote) => !isTop(n) && n.style === 'callout';
const isSection = (n: PageNote) => !isTop(n) && !isCallout(n);

/** Table-of-contents entries for the section-style notes. */
export function noteTocItems(notes?: PageNote[]): { id: string; title: string }[] {
  return (notes ?? []).filter(isSection).map((n) => ({ id: n.id, title: n.title }));
}

/** "How to use this page": a compact box under the page header. */
export function TopNotes({ notes }: { notes?: PageNote[] }) {
  const top = (notes ?? []).filter(isTop);
  if (!top.length) return null;
  return (
    <div className="-mt-4 mb-10 max-w-3xl space-y-3">
      {top.map((n) => (
        <aside key={n.id} id={n.id} className="rounded-xl px-5 py-4" style={{ background: 'var(--bg-section)', border: '1px solid var(--line)' }}>
          <h2 className="text-[13px] font-extrabold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text)' }}>{n.title}</h2>
          {n.text && <p className="text-[14.5px] leading-relaxed" style={{ color: 'var(--text-2)' }}><RichText text={n.text} /></p>}
          {n.items && (
            <ul className="mt-2 space-y-1.5">
              {n.items.map((t) => <li key={t} className="text-[14px] leading-relaxed" style={{ color: 'var(--text-2)' }}><RichText text={t} /></li>)}
            </ul>
          )}
        </aside>
      ))}
    </div>
  );
}

/** Common mistakes, real-project use and study tips as normal page sections. */
export function NoteSections({ notes }: { notes?: PageNote[] }) {
  const list = (notes ?? []).filter(isSection);
  if (!list.length) return null;
  return (
    <>
      {list.map((n) => (
        <section key={n.id} id={n.id} className="scroll-mt-24 mt-14">
          <h2 className="text-2xl font-extrabold mb-4" style={{ color: 'var(--text)' }}>{n.title}</h2>
          {n.text && <p className="text-[15px] leading-relaxed mb-3" style={{ color: 'var(--text-2)' }}><RichText text={n.text} /></p>}
          {n.items && (
            <ul className="space-y-2.5">
              {n.items.map((t) => (
                <li key={t} className="flex gap-2.5 text-[14.5px] leading-relaxed" style={{ color: 'var(--text-2)' }}>
                  <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#2563eb' }} />
                  <span><RichText text={t} /></span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </>
  );
}

/** The reviewed note: a small closing box. */
export function NoteCallouts({ notes }: { notes?: PageNote[] }) {
  const list = (notes ?? []).filter(isCallout);
  if (!list.length) return null;
  return (
    <div className="mt-14 space-y-3">
      {list.map((n) => (
        <aside key={n.id} id={n.id} className="rounded-xl px-5 py-4" style={{ background: 'var(--bg-section)', border: '1px solid var(--line)' }}>
          <h2 className="text-[13px] font-extrabold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text)' }}>{n.title}</h2>
          {n.text && <p className="text-[14px] leading-relaxed" style={{ color: 'var(--text-2)' }}><RichText text={n.text} /></p>}
        </aside>
      ))}
    </div>
  );
}
