'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const topics = [
  { name: 'HTML', href: '/html', icon: '📝' },
  { name: 'CSS', href: '/css', icon: '🎨' },
  { name: 'JavaScript', href: '/js', icon: '⚡' },
  { name: 'TypeScript', href: '/learn/typescript', icon: '📘' },
  { name: 'React', href: '/learn/react', icon: '⚛️' },
  { name: 'Next.js', href: '/learn/nextjs', icon: '▲' },
  { name: 'Node.js', href: '/learn/nodejs', icon: '🟢' },
  { name: 'Express', href: '/learn/express', icon: '🚂' },
  { name: 'MongoDB', href: '/learn/mongodb', icon: '🍃' },
  { name: 'PostgreSQL', href: '/learn/postgresql', icon: '🐘' },
  { name: 'SQL', href: '/learn/sql', icon: '💾' },
  { name: 'SQLite', href: '/learn/sqlite', icon: '🗄️' },
  { name: 'Redis', href: '/learn/redis', icon: '🔴' },
  { name: 'REST API', href: '/learn/rest-api', icon: '🔌' },
  { name: 'Git', href: '/learn/git', icon: '📦' },
  { name: 'Docker', href: '/learn/docker', icon: '🐳' },
];

export function ScrollingTicker() {
  const pathname = usePathname();

  // Hide on playground/editor page - it's a full-screen app
  if (pathname === '/playground') return null;

  // Triple the topics for ultra-smooth infinite scrolling
  const duplicatedTopics = [...topics, ...topics, ...topics];

  return (
    <div className="w-full" style={{ background: 'var(--bg)' }}>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-2">
        <div className="relative h-10 flex items-center overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg">
          <div className="flex animate-scroll-left whitespace-nowrap">
            {duplicatedTopics.map((topic, index) => (
              <Link
                key={`${topic.name}-${index}`}
                href={topic.href}
                className="inline-flex items-center gap-2 px-6 py-2 text-white hover:bg-white/20 transition-all duration-200 text-sm font-semibold rounded-md mx-0.5"
                title={`Learn ${topic.name}`}
              >
                <span className="text-base" aria-hidden="true">{topic.icon}</span>
                <span>Learn {topic.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
