import Link from 'next/link';
import type { HubLink } from '@/lib/seo';

/** A titled row of links to guides, cheat sheets and question banks. Server component. */
export function GuideLinks({ title, links, className = '' }: { title: string; links: HubLink[]; className?: string }) {
  if (!links.length) return null;
  return (
    <nav aria-label={title} className={className}>
      <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--text)' }}>{title}</h2>
      <ul className="flex flex-wrap gap-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="inline-block text-[13px] font-medium px-3.5 py-1.5 rounded-full transition-colors hover:border-blue-400" style={{ border: '1px solid var(--line)', background: 'var(--card)', color: 'var(--text)' }}>{l.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
