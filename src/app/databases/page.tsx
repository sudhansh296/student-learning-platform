import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Database Guide — SQL & NoSQL',
  description: 'Learn SQL, NoSQL, PostgreSQL, MongoDB, Redis, and how to choose the right database.'
};

const sqlDatabases = [
  { slug: 'mysql',      href: '/learn/sql/01-introduction',          name: 'MySQL / SQL',  icon: '🐬', desc: 'Learn SQL — the query language used by MySQL, MariaDB, and all relational databases. Tables, JOINs, indexes, and more.', difficulty: 'beginner' },
  { slug: 'postgresql', href: '/learn/postgresql/01-introduction',   name: 'PostgreSQL', icon: '🐘', desc: 'Most advanced open-source SQL database. Best for complex queries and data integrity.',  difficulty: 'intermediate' },
  { slug: 'sqlite',     href: '/learn/sqlite/01-introduction',       name: 'SQLite',     icon: '💾', desc: 'Lightweight, serverless database in a single file. Perfect for local apps and Node.js.', difficulty: 'beginner' },
];

const nosqlDatabases = [
  { slug: 'mongodb', href: '/learn/mongodb/introduction', name: 'MongoDB', icon: '🍃', desc: 'Document database that stores JSON-like data. Flexible and easy to start with.', difficulty: 'beginner' },
  { slug: 'redis',   href: '/learn/redis/01-introduction', name: 'Redis',   icon: 'R', desc: 'In-memory key-value store. Blazingly fast for caching, sessions, pub/sub, and queues.', difficulty: 'intermediate' },
];

const concepts = [
  { icon: '📋', title: 'Tables, Rows, Columns', desc: 'How relational data is structured' },
  { icon: '🔑', title: 'Primary & Foreign Keys', desc: 'Linking data across tables' },
  { icon: '🔗', title: 'Relationships', desc: 'One-to-one, one-to-many, many-to-many' },
  { icon: '🔍', title: 'Indexes', desc: 'Speed up queries with indexes' },
  { icon: '⚡', title: 'Transactions & ACID', desc: 'Reliable, consistent data operations' },
  { icon: '🔀', title: 'SQL JOINs', desc: 'Combine data from multiple tables' },
  { icon: '🏗️', title: 'Normalization', desc: 'Design efficient database schemas' },
  { icon: '📊', title: 'SQL vs NoSQL', desc: 'Choose the right database type' },
];

const difficultyBadge: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
};

export default function DatabasesPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-3">Databases</h1>
        <p className="text-muted-foreground max-w-2xl leading-relaxed">
          Everything you need to understand databases — from first principles to production-ready SQL and NoSQL knowledge.
        </p>
      </div>

      {/* Core concepts */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-foreground mb-5">Core Database Concepts</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {concepts.map(c => (
            <div key={c.title} className="p-4 rounded-xl border border-border bg-background hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-sm transition-all cursor-pointer">
              <div className="text-2xl mb-2">{c.icon}</div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{c.title}</h3>
              <p className="text-xs text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SQL */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-lg font-bold text-foreground">SQL Databases</h2>
          <span className="text-xs text-muted-foreground">Relational, structured data, strong consistency</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sqlDatabases.map(db => (
            <Link
              key={db.slug}
              href={db.href}
              className="group flex items-start gap-4 p-5 rounded-xl border border-border bg-background hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md transition-all"
            >
              <div className="text-3xl shrink-0">{db.icon}</div>
              <div>
                <h3 className="font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">{db.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">{db.desc}</p>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${difficultyBadge[db.difficulty]}`}>
                  {db.difficulty}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* NoSQL */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-lg font-bold text-foreground">NoSQL Databases</h2>
          <span className="text-xs text-muted-foreground">Flexible data models, horizontal scaling</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {nosqlDatabases.map(db => (
            <Link
              key={db.slug}
              href={db.href}
              className="group flex items-start gap-4 p-5 rounded-xl border border-border bg-background hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md transition-all"
            >
              <div className="text-3xl shrink-0">{db.icon}</div>
              <div>
                <h3 className="font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">{db.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">{db.desc}</p>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${difficultyBadge[db.difficulty]}`}>
                  {db.difficulty}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
