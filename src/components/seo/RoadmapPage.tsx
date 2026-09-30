import Link from 'next/link';
import { FaqSection, JsonLd, LessonLinks, NoteCallouts, NoteSections, PageHeader, PageShell, Toc, TopNotes, landingJsonLd, noteTocItems } from '@/components/seo/SeoPageParts';
import type { Roadmap } from '@/data/seo/roadmap-types';

export function RoadmapPage({ roadmap }: { roadmap: Roadmap }) {
  const tocItems = [...roadmap.steps.map((s, i) => ({ id: s.id, title: `${i + 1}. ${s.title}` })), ...noteTocItems(roadmap.notes), { id: 'tips', title: 'Tips for learning faster' }, ...(roadmap.faq.length ? [{ id: 'faq', title: 'FAQ' }] : [])];
  return (
    <PageShell>
      <JsonLd data={landingJsonLd({ path: roadmap.path, headline: roadmap.h1, description: roadmap.description, faq: roadmap.faq })} />
      <PageHeader crumbs={[{ label: 'Home', href: '/' }, { label: 'Roadmaps', href: '/roadmaps' }, { label: roadmap.badge }]} badge={roadmap.badge} h1={roadmap.h1} intro={roadmap.intro} />
      <TopNotes notes={roadmap.notes} />
      <ul className="flex flex-wrap gap-3 mb-10 -mt-4">
        {roadmap.facts.map((f) => (
          <li key={f.label} className="rounded-xl px-4 py-2.5" style={{ border: '1px solid var(--line)', background: 'var(--card)' }}>
            <span className="block text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-3)' }}>{f.label}</span>
            <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{f.value}</span>
          </li>
        ))}
      </ul>
      <div className="flex gap-12 items-start">
        <Toc items={tocItems} />
        <div className="min-w-0 flex-1 max-w-3xl">
          <ol className="relative border-l-2 ml-3 space-y-10" style={{ borderColor: 'var(--line)' }}>
            {roadmap.steps.map((s, i) => (
              <li key={s.id} id={s.id} className="scroll-mt-24 pl-8 relative">
                <span className="absolute -left-[17px] top-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: '#2563eb' }}>{i + 1}</span>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
                  <h2 className="text-xl font-extrabold" style={{ color: 'var(--text)' }}>{s.title}</h2>
                  <span className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full" style={{ background: '#eff6ff', color: '#1d4ed8' }}>{s.duration}</span>
                </div>
                <p className="text-[15px] leading-relaxed mb-3" style={{ color: 'var(--text-2)' }}>{s.summary}</p>
                <ul className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2 mb-2">
                  {s.topics.map((t) => (
                    <li key={t} className="flex gap-2 text-[14px]" style={{ color: 'var(--text-2)' }}>
                      <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#2563eb' }} />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
                {s.lessons && <LessonLinks keys={s.lessons} title="Lessons" />}
                {s.practice && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-[12px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>Practice:</span>
                    {s.practice.map((p) => (
                      <Link key={p.href} href={p.href} className="text-[13px] font-medium px-3 py-1 rounded-full transition-colors hover:border-green-500" style={{ border: '1px solid #bbf7d0', background: '#f0fdf4', color: '#166534' }}>{p.label}</Link>
                    ))}
                  </div>
                )}
                {s.milestone && (
                  <p className="mt-3 text-[13.5px] rounded-lg px-4 py-2.5" style={{ background: 'var(--bg-section)', color: 'var(--text-2)' }}>
                    <strong style={{ color: 'var(--text)' }}>You are ready to move on when: </strong>{s.milestone}
                  </p>
                )}
              </li>
            ))}
          </ol>

          <NoteSections notes={roadmap.notes} />

          <section id="tips" className="scroll-mt-24 mt-14">
            <h2 className="text-2xl font-extrabold mb-4" style={{ color: 'var(--text)' }}>Tips for learning faster</h2>
            <ul className="space-y-2.5">
              {roadmap.tips.map((t) => (
                <li key={t} className="flex gap-2.5 text-[14.5px] leading-relaxed" style={{ color: 'var(--text-2)' }}>
                  <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#2563eb' }} />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          <FaqSection faq={roadmap.faq} />

          <NoteCallouts notes={roadmap.notes} />

          <nav aria-label="More resources" className="mt-14 pt-8" style={{ borderTop: '1px solid var(--line)' }}>
            <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>Keep going</h2>
            <ul className="flex flex-wrap gap-2">
              {roadmap.more.map((m) => (
                <li key={m.href}>
                  <Link href={m.href} className="inline-block text-[13.5px] font-medium px-4 py-2 rounded-full transition-colors hover:border-blue-400" style={{ border: '1px solid var(--line)', background: 'var(--card)', color: 'var(--text)' }}>{m.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </PageShell>
  );
}
