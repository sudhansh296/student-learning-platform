import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Technology Comparisons',
  description: 'Compare web technologies side-by-side — React vs Vue, SQL vs NoSQL, REST vs GraphQL, and more.',
};

const comparisons = [
  {
    slug: 'react-vs-vue',
    title: 'React vs Vue',
    a: { name: 'React', icon: '⚛️' },
    b: { name: 'Vue', icon: '💚' },
    desc: 'Two of the most popular frontend frameworks compared.',
    tags: ['Frontend', 'Framework'],
  },
  {
    slug: 'nextjs-vs-react',
    title: 'Next.js vs React',
    a: { name: 'Next.js', icon: '▲' },
    b: { name: 'React', icon: '⚛️' },
    desc: 'When to use plain React vs the full Next.js framework.',
    tags: ['Frontend', 'Framework'],
  },
  {
    slug: 'mongodb-vs-postgresql',
    title: 'MongoDB vs PostgreSQL',
    a: { name: 'MongoDB', icon: '🍃' },
    b: { name: 'PostgreSQL', icon: '🐘' },
    desc: 'NoSQL document store vs SQL relational database.',
    tags: ['Database'],
  },
  {
    slug: 'rest-vs-graphql',
    title: 'REST vs GraphQL',
    a: { name: 'REST', icon: '🔗' },
    b: { name: 'GraphQL', icon: '◆' },
    desc: 'Two different approaches to building APIs.',
    tags: ['API'],
  },
  {
    slug: 'javascript-vs-typescript',
    title: 'JavaScript vs TypeScript',
    a: { name: 'JavaScript', icon: '⚡' },
    b: { name: 'TypeScript', icon: '🔷' },
    desc: 'Dynamic scripting vs statically typed JavaScript.',
    tags: ['Language'],
  },
  {
    slug: 'sql-vs-nosql',
    title: 'SQL vs NoSQL',
    a: { name: 'SQL', icon: '📊' },
    b: { name: 'NoSQL', icon: '📄' },
    desc: 'Understand which database model fits your use case.',
    tags: ['Database'],
  },
];

export default function ComparePage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-3">
          Technology Comparisons
        </h1>
        <p className="text-muted-foreground max-w-xl leading-relaxed">
          Not sure which technology to choose? These side-by-side comparisons help you understand the differences, trade-offs, and when to use each one.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {comparisons.map(c => (
          <Link
            key={c.slug}
            href={`/compare/${c.slug}`}
            className="group flex flex-col p-5 rounded-xl border border-border bg-background hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md transition-all duration-200"
          >
            {/* VS display */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-2xl">{c.a.icon}</span>
                <span className="font-bold text-foreground text-sm">{c.a.name}</span>
              </div>
              <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                VS
              </span>
              <div className="flex items-center gap-2 flex-1 justify-end">
                <span className="font-bold text-foreground text-sm">{c.b.name}</span>
                <span className="text-2xl">{c.b.icon}</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{c.desc}</p>

            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                {c.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
