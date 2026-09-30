import Link from 'next/link';

/** Turns [text](url) into links: internal paths use next/link, mailto: and https: links open normally. */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
        if (!m) return part;
        const [, label, href] = m;
        const cls = 'font-semibold underline underline-offset-2 hover:text-blue-600';
        const style = { color: 'var(--text)' };
        return href.startsWith('/')
          ? <Link key={i} href={href} className={cls} style={style}>{label}</Link>
          : <a key={i} href={href} className={cls} style={style} {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{label}</a>;
      })}
    </>
  );
}
