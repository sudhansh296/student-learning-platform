import Link from 'next/link';
import { BookOpen, Terminal } from 'lucide-react';

const cols = [
  { title: 'Core',       links: [{ l: 'HTML', h: '/html' }, { l: 'CSS', h: '/css' }, { l: 'JavaScript', h: '/js' }, { l: 'TypeScript', h: '/learn/typescript' }] },
  { title: 'Frameworks', links: [{ l: 'React', h: '/learn/react' }, { l: 'Next.js', h: '/learn/nextjs' }, { l: 'Node.js', h: '/learn/nodejs' }, { l: 'Express.js', h: '/learn/express' }] },
  { title: 'Databases',  links: [{ l: 'MongoDB', h: '/learn/mongodb' }, { l: 'PostgreSQL', h: '/learn/postgresql' }, { l: 'Databases Guide', h: '/databases' }] },
  { title: 'Resources',  links: [{ l: 'Roadmaps', h: '/roadmaps' }, { l: 'Interview Prep', h: '/interview' }, { l: 'Projects', h: '/projects' }, { l: 'Compare Tech', h: '/compare' }, { l: 'Dev Tools', h: '/tools' }] },
];

export function Footer() {
  return (
    <footer style={{ background: 'var(--bg-section)', borderTop: '1px solid var(--line)' }}>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-10">

          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-[15px]" style={{ color: 'var(--text)' }}>
                WebDev<span style={{ color: '#2563eb' }}>Atlas</span>
              </span>
            </Link>
            <p className="text-[13px] leading-relaxed mb-4 max-w-[200px]" style={{ color: 'var(--text-2)' }}>
              Learn the Web. Understand the Stack. Build Anything.
            </p>
            <Link href="/playground"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-white hover:opacity-80 transition-opacity"
              style={{ background: '#1a1a1a' }}>
              <Terminal className="w-3.5 h-3.5 text-green-400" /> Code Editor
            </Link>
          </div>

          {cols.map(col => (
            <div key={col.title}>
              <h3 className="text-[11px] font-extrabold uppercase tracking-widest mb-3" style={{ color: 'var(--text-3)' }}>
                {col.title}
              </h3>
              <ul className="space-y-2">
                {col.links.map(l => (
                  <li key={l.l}>
                    <Link href={l.h}
                      className="text-[13px] hover:text-blue-600 transition-colors"
                      style={{ color: 'var(--text-2)' }}>
                      {l.l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6"
          style={{ borderTop: '1px solid var(--line)' }}>
          <p className="text-[12px]" style={{ color: 'var(--text-3)' }}>
            © 2026 WebDev Atlas — Built for developers. Free forever.
          </p>
          <span className="text-[11px]" style={{ color: 'var(--text-3)' }}>MIT License · Open Source</span>
        </div>
      </div>
    </footer>
  );
}
