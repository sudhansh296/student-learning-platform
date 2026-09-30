import Link from 'next/link';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { DataTable, FaqSection, JsonLd, LessonLinks, NoteCallouts, NoteSections, PageHeader, PageShell, Toc, TopNotes, landingJsonLd, noteTocItems } from '@/components/seo/SeoPageParts';
import type { Cheatsheet } from '@/data/seo/cheatsheet-types';

export function CheatsheetPage({ sheet }: { sheet: Cheatsheet }) {
  const tocItems = [...sheet.sections.map((s) => ({ id: s.id, title: s.title })), ...noteTocItems(sheet.notes), ...(sheet.faq.length ? [{ id: 'faq', title: 'FAQ' }] : [])];
  return (
    <PageShell>
      <JsonLd data={landingJsonLd({ path: sheet.path, headline: sheet.h1, description: sheet.description, faq: sheet.faq })} />
      <PageHeader crumbs={[{ label: 'Home', href: '/' }, { label: 'Cheat sheets' }, { label: sheet.badge }]} badge={sheet.badge} h1={sheet.h1} intro={sheet.intro} />
      <TopNotes notes={sheet.notes} />
      <div className="flex gap-12 items-start">
        <Toc items={tocItems} />
        <div className="min-w-0 flex-1 max-w-3xl">
          {sheet.sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24 mb-14">
              <h2 className="text-2xl font-extrabold mb-3" style={{ color: 'var(--text)' }}>{s.title}</h2>
              {s.intro && <p className="text-[15px] leading-relaxed mb-3" style={{ color: 'var(--text-2)' }}>{s.intro}</p>}
              {s.table && <DataTable headers={s.table.headers} rows={s.table.rows} codeCols={s.table.codeCols} />}
              {s.examples?.map((e) => (
                <div key={e.title} className="mt-5">
                  <h3 className="text-[15px] font-bold mb-1" style={{ color: 'var(--text)' }}>{e.title}</h3>
                  <CodeBlock code={e.code} language={e.language} tech={sheet.tech} />
                </div>
              ))}
              {s.tips && (
                <ul className="mt-4 space-y-2">
                  {s.tips.map((t) => (
                    <li key={t} className="flex gap-2.5 text-[14px] leading-relaxed" style={{ color: 'var(--text-2)' }}>
                      <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#2563eb' }} />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              )}
              {s.lessons && <LessonLinks keys={s.lessons} />}
            </section>
          ))}
          <NoteSections notes={sheet.notes} />
          <FaqSection faq={sheet.faq} />
          <NoteCallouts notes={sheet.notes} />
          {sheet.more.length > 0 && (
            <nav aria-label="More resources" className="mt-14 pt-8" style={{ borderTop: '1px solid var(--line)' }}>
              <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>Keep going</h2>
              <ul className="flex flex-wrap gap-2">
                {sheet.more.map((m) => (
                  <li key={m.href}>
                    <Link href={m.href} className="inline-block text-[13.5px] font-medium px-4 py-2 rounded-full transition-colors hover:border-blue-400" style={{ border: '1px solid var(--line)', background: 'var(--card)', color: 'var(--text)' }}>{m.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </PageShell>
  );
}
