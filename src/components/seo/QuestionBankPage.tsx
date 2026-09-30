import Link from 'next/link';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { JsonLd, LessonLinks, NoteCallouts, NoteSections, PageHeader, PageShell, Toc, TopNotes, landingJsonLd, noteTocItems } from '@/components/seo/SeoPageParts';
import type { BankItem, Level, QuestionBank } from '@/data/seo/question-types';

const LEVEL_STYLE: Record<Level, { bg: string; color: string; label: string }> = {
  beginner: { bg: '#dcfce7', color: '#166534', label: 'Beginner' },
  intermediate: { bg: '#dbeafe', color: '#1e40af', label: 'Intermediate' },
  advanced: { bg: '#ffedd5', color: '#9a3412', label: 'Advanced' },
};

function LevelBadge({ level }: { level?: Level }) {
  if (!level) return null;
  const s = LEVEL_STYLE[level];
  return <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0" style={{ background: s.bg, color: s.color }}>{s.label}</span>;
}

function InterviewItem({ item, n, tech, codeLang }: { item: BankItem; n: number; tech: string; codeLang: string }) {
  return (
    <details className="rounded-xl group" style={{ border: '1px solid var(--line)', background: 'var(--card)' }}>
      <summary className="cursor-pointer list-none flex items-start gap-3 px-5 py-4">
        <span className="text-[13px] font-bold mt-0.5 shrink-0" style={{ color: '#2563eb' }}>Q{n}.</span>
        <span className="flex-1 font-semibold text-[15px] leading-snug" style={{ color: 'var(--text)' }}>{item.q}</span>
        <LevelBadge level={item.level} />
      </summary>
      <div className="px-5 pb-5 pt-1 pl-14">
        {item.short && <p className="text-[15px] leading-relaxed font-medium" style={{ color: 'var(--text)' }}>{item.short}</p>}
        {item.long && <p className="mt-2 text-[14.5px] leading-relaxed" style={{ color: 'var(--text-2)' }}>{item.long}</p>}
        {item.code && <CodeBlock code={item.code} language={codeLang} tech={tech} />}
        {item.lessons && <LessonLinks keys={item.lessons} title="Read more" />}
      </div>
    </details>
  );
}

function PracticeItem({ item, n, tech, codeLang }: { item: BankItem; n: number; tech: string; codeLang: string }) {
  return (
    <article className="rounded-xl px-5 py-4" style={{ border: '1px solid var(--line)', background: 'var(--card)' }}>
      <div className="flex items-start gap-3">
        <span className="text-[13px] font-bold mt-0.5 shrink-0" style={{ color: '#2563eb' }}>{n}.</span>
        <h3 className="flex-1 font-semibold text-[15px] leading-snug" style={{ color: 'var(--text)' }}>{item.q}</h3>
        <LevelBadge level={item.level} />
      </div>
      <div className="pl-8 mt-3 space-y-2">
        {item.hint && (
          <details>
            <summary className="cursor-pointer text-[13px] font-semibold" style={{ color: '#b45309' }}>Show hint</summary>
            <p className="mt-2 text-[14px] leading-relaxed" style={{ color: 'var(--text-2)' }}>{item.hint}</p>
          </details>
        )}
        <details>
          <summary className="cursor-pointer text-[13px] font-semibold" style={{ color: '#166534' }}>Show solution</summary>
          {item.code && <CodeBlock code={item.code} language={codeLang} tech={tech} />}
          {item.output && (
            <p className="text-[13px] mt-1" style={{ color: 'var(--text-3)' }}>
              Output: <code className="font-mono px-1.5 py-0.5 rounded whitespace-pre-wrap" style={{ background: 'var(--bg-section)', color: 'var(--text)' }}>{item.output}</code>
            </p>
          )}
          {item.short && <p className="mt-2 text-[14px] leading-relaxed" style={{ color: 'var(--text-2)' }}>{item.short}</p>}
        </details>
        {item.lessons && <LessonLinks keys={item.lessons} title="Revise" />}
      </div>
    </article>
  );
}

export function QuestionBankPage({ bank }: { bank: QuestionBank }) {
  const total = bank.groups.reduce((s, g) => s + g.items.length, 0);
  const faq = bank.mode === 'interview'
    ? bank.groups.flatMap((g) => g.items).map((i) => ({ q: i.q, a: [i.short, i.long].filter(Boolean).join(' ') }))
    : undefined;
  const starts = bank.groups.map((_, i) => bank.groups.slice(0, i).reduce((sum, g) => sum + g.items.length, 0));
  return (
    <PageShell>
      <JsonLd data={landingJsonLd({ path: bank.path, headline: bank.h1, description: bank.description, faq })} />
      <PageHeader crumbs={[{ label: 'Home', href: '/' }, { label: bank.mode === 'interview' ? 'Interview' : 'Practice', href: bank.mode === 'interview' ? '/interview' : '/practice' }, { label: bank.badge }]} badge={`${total} ${bank.mode === 'interview' ? 'questions' : 'exercises'}`} h1={bank.h1} intro={bank.intro} />
      <TopNotes notes={bank.notes} />
      <div className="flex gap-12 items-start">
        <Toc items={[...bank.groups.map((g) => ({ id: g.id, title: `${g.title} (${g.items.length})` })), ...noteTocItems(bank.notes), { id: 'tips', title: bank.mode === 'interview' ? 'How to prepare' : 'How to practise' }]} />
        <div className="min-w-0 flex-1 max-w-3xl">
          {bank.groups.map((g, gi) => (
            <section key={g.id} id={g.id} className="scroll-mt-24 mb-12">
              <h2 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--text)' }}>{g.title}</h2>
              {g.intro && <p className="text-[15px] leading-relaxed mb-4" style={{ color: 'var(--text-2)' }}>{g.intro}</p>}
              <div className="space-y-3">
                {g.items.map((item, ii) => (bank.mode === 'interview'
                  ? <InterviewItem key={item.q} item={item} n={starts[gi] + ii + 1} tech={bank.tech} codeLang={bank.codeLang ?? 'javascript'} />
                  : <PracticeItem key={item.q} item={item} n={starts[gi] + ii + 1} tech={bank.tech} codeLang={bank.codeLang ?? 'javascript'} />))}
              </div>
            </section>
          ))}
          <NoteSections notes={bank.notes} />
          <section id="tips" className="scroll-mt-24 mt-14">
            <h2 className="text-2xl font-extrabold mb-4" style={{ color: 'var(--text)' }}>{bank.mode === 'interview' ? 'How to prepare' : 'How to practise'}</h2>
            <ul className="space-y-2.5">
              {bank.tips.map((t) => (
                <li key={t} className="flex gap-2.5 text-[14.5px] leading-relaxed" style={{ color: 'var(--text-2)' }}>
                  <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#2563eb' }} />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>
          <NoteCallouts notes={bank.notes} />
          <nav aria-label="More resources" className="mt-14 pt-8" style={{ borderTop: '1px solid var(--line)' }}>
            <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>Keep going</h2>
            <ul className="flex flex-wrap gap-2">
              {bank.more.map((m) => (
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
