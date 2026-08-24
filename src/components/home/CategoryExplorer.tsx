import Link from 'next/link';

const cats = [
  { icon: '🌐', label: 'HTML',        href: '/html',              color: '#E34F26' },
  { icon: '🎨', label: 'CSS',         href: '/css',               color: '#264DE4' },
  { icon: '⚡', label: 'JavaScript',  href: '/js',                color: '#F7DF1E' },
  { icon: '🔷', label: 'TypeScript',  href: '/learn/typescript',  color: '#3178C6' },
  { icon: '⚛️', label: 'React',       href: '/learn/react',       color: '#61DAFB' },
  { icon: '▲',  label: 'Next.js',     href: '/learn/nextjs',      color: '#000000' },
  { icon: '🟢', label: 'Node.js',     href: '/learn/nodejs',      color: '#339933' },
  { icon: '🚂', label: 'Express',     href: '/learn/express',     color: '#333333' },
  { icon: '🍃', label: 'MongoDB',     href: '/learn/mongodb',     color: '#47A248' },
  { icon: '🐘', label: 'PostgreSQL',  href: '/learn/postgresql',  color: '#336791' },
  { icon: '🔗', label: 'REST APIs',   href: '/learn/rest-api',    color: '#FF6B35' },
  { icon: '🌿', label: 'Git',         href: '/learn/git',         color: '#F05032' },
  { icon: '🐳', label: 'Docker',      href: '/learn/docker',      color: '#2496ED' },
];

export function CategoryExplorer() {
  return (
    <section style={{ background: 'var(--c-bg2)', borderBottom: '1px solid var(--c-border)', padding: '40px 0' }}>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6">
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: 'var(--c-text)', margin: '0 0 4px' }}>Browse by Technology</h2>
          <p style={{ fontSize: 12, color: 'var(--c-text3)', margin: 0 }}>Click any technology to start learning</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {cats.map(c => (
            <Link key={c.label} href={c.href} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 9999,
              background: 'var(--c-card)', border: '1px solid var(--c-border)',
              textDecoration: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: c.color+'15', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 14 }}>{c.icon}</div>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-text2)' }}>{c.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
