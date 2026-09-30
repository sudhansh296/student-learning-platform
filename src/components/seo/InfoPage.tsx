import { JsonLd, PageHeader, PageShell, Toc } from '@/components/seo/SeoPageParts';
import { RichText } from '@/components/seo/RichText';
import { SITE_NAME, SITE_URL } from '@/lib/seo';
import type { InfoBlock, InfoPageData } from '@/data/seo/info-types';

function Block({ block }: { block: InfoBlock }) {
  if ('h3' in block) return <h3 className="text-[16px] font-bold mt-5 mb-1.5" style={{ color: 'var(--text)' }}>{block.h3}</h3>;
  if ('ul' in block) {
    return (
      <ul className="my-3 space-y-2">
        {block.ul.map((t) => (
          <li key={t} className="flex gap-2.5 text-[15px] leading-relaxed" style={{ color: 'var(--text-2)' }}>
            <span className="mt-2.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#2563eb' }} />
            <span><RichText text={t} /></span>
          </li>
        ))}
      </ul>
    );
  }
  return <p className="text-[15px] leading-relaxed mb-3" style={{ color: 'var(--text-2)' }}><RichText text={block.p} /></p>;
}

/** Shared layout for the About / Contact / Privacy / Terms / Disclaimer pages. Server component. */
export function InfoPage({ page, lead }: { page: InfoPageData; lead?: React.ReactNode }) {
  const url = `${SITE_URL}${page.path}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': page.schemaType, name: page.h1, description: page.description, url, inLanguage: 'en', isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL } },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }, { '@type': 'ListItem', position: 2, name: page.h1, item: url }] },
    ],
  };
  return (
    <PageShell>
      <JsonLd data={jsonLd} />
      <PageHeader crumbs={[{ label: 'Home', href: '/' }, { label: page.badge }]} badge={page.badge} h1={page.h1} intro={page.intro} />
      {page.updated && <p className="-mt-6 mb-8 text-[13px]" style={{ color: 'var(--text-3)' }}>Last updated: {page.updated}</p>}
      <div className="flex gap-12 items-start">
        <Toc items={page.sections.map((s) => ({ id: s.id, title: s.title }))} />
        <div className="min-w-0 flex-1 max-w-3xl">
          {lead}
          {page.sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24 mb-10">
              <h2 className="text-2xl font-extrabold mb-3" style={{ color: 'var(--text)' }}>{s.title}</h2>
              {s.blocks.map((b, i) => <Block key={i} block={b} />)}
            </section>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
