import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/docs/Breadcrumb';
import { Check, X, Minus } from 'lucide-react';
import type { Metadata } from 'next';

interface ComparisonData {
  slug: string;
  title: string;
  a: { name: string; icon: string; description: string; created: string; usedBy: string[] };
  b: { name: string; icon: string; description: string; created: string; usedBy: string[] };
  summary: string;
  rows: { criterion: string; a: string; b: string; winner?: 'a' | 'b' | 'tie' }[];
  whenA: string[];
  whenB: string[];
}

const comparisons: Record<string, ComparisonData> = {
  'react-vs-vue': {
    slug: 'react-vs-vue',
    title: 'React vs Vue',
    a: {
      name: 'React',
      icon: '⚛️',
      description: 'A JavaScript library for building user interfaces, maintained by Meta. Uses JSX and a component-based architecture.',
      created: '2013',
      usedBy: ['Facebook', 'Instagram', 'Airbnb', 'Netflix'],
    },
    b: {
      name: 'Vue',
      icon: '💚',
      description: 'A progressive JavaScript framework for building UIs. Known for its gentle learning curve and clear separation of template, script, and style.',
      created: '2014',
      usedBy: ['Alibaba', 'GitLab', 'Grammarly', 'Nintendo'],
    },
    summary: 'React and Vue are both excellent choices for building modern web apps. React has a larger ecosystem and more job opportunities. Vue is easier to learn and has a more opinionated structure that many developers find cleaner.',
    rows: [
      { criterion: 'Learning Curve', a: 'Moderate — JSX and hooks take time', b: 'Gentle — HTML-like templates feel natural', winner: 'b' },
      { criterion: 'Performance', a: 'Excellent with virtual DOM', b: 'Excellent with virtual DOM', winner: 'tie' },
      { criterion: 'Ecosystem Size', a: 'Massive — largest frontend ecosystem', b: 'Large — growing rapidly', winner: 'a' },
      { criterion: 'Job Market', a: 'Very high demand globally', b: 'Good demand, especially in Asia', winner: 'a' },
      { criterion: 'State Management', a: 'Redux, Zustand, Context API', b: 'Pinia (official), Vuex', winner: 'tie' },
      { criterion: 'TypeScript Support', a: 'Excellent', b: 'Excellent (Vue 3)', winner: 'tie' },
      { criterion: 'Syntax Style', a: 'JSX — JavaScript + HTML mixed', b: 'SFC — template/script/style separated', winner: 'tie' },
      { criterion: 'Company Support', a: 'Meta (Facebook)', b: 'Community + sponsors', winner: 'a' },
    ],
    whenA: [
      'You want the largest job market and ecosystem',
      'Building a large-scale enterprise application',
      'Your team already knows JavaScript well',
      'You prefer flexibility over convention',
    ],
    whenB: [
      'You are new to frontend frameworks',
      'You prefer clean HTML-like templates',
      'Building smaller to medium apps quickly',
      'You value official tooling and clear conventions',
    ],
  },
  'mongodb-vs-postgresql': {
    slug: 'mongodb-vs-postgresql',
    title: 'MongoDB vs PostgreSQL',
    a: {
      name: 'MongoDB',
      icon: '🍃',
      description: 'A document-oriented NoSQL database. Stores data as BSON (binary JSON) documents in flexible collections.',
      created: '2009',
      usedBy: ['Forbes', 'eBay', 'Cisco', 'Verizon'],
    },
    b: {
      name: 'PostgreSQL',
      icon: '🐘',
      description: 'The world\'s most advanced open-source relational SQL database. Known for data integrity, complex queries, and ACID compliance.',
      created: '1996',
      usedBy: ['Apple', 'Instagram', 'Spotify', 'Reddit'],
    },
    summary: 'MongoDB excels at flexible, rapidly changing data structures and horizontal scaling. PostgreSQL wins for complex queries, relationships, and strict data consistency. Most modern apps can use either — choose based on your data model.',
    rows: [
      { criterion: 'Data Model', a: 'Flexible JSON documents', b: 'Fixed schema with tables/rows', winner: 'tie' },
      { criterion: 'Schema', a: 'Schema-less — any field anytime', b: 'Strict schema — must define upfront', winner: 'a' },
      { criterion: 'Relationships', a: 'Manual — embed or reference', b: 'Native — JOINs and foreign keys', winner: 'b' },
      { criterion: 'Complex Queries', a: 'Good aggregation pipeline', b: 'Excellent — full SQL power', winner: 'b' },
      { criterion: 'Horizontal Scaling', a: 'Built-in sharding', b: 'Possible but more complex', winner: 'a' },
      { criterion: 'ACID Compliance', a: 'Multi-document transactions (v4+)', b: 'Full ACID compliance', winner: 'b' },
      { criterion: 'Learning Curve', a: 'Easier for JS developers', b: 'Requires SQL knowledge', winner: 'a' },
      { criterion: 'JSON Storage', a: 'Native — primary format', b: 'Supported via JSONB column', winner: 'tie' },
    ],
    whenA: [
      'Your data structure changes frequently',
      'Building with a JavaScript / Node.js stack (MERN)',
      'Storing flexible, nested data (user profiles, content)',
      'You need horizontal scaling from the start',
    ],
    whenB: [
      'Your data has clear relationships between entities',
      'You need complex queries, JOINs, or aggregations',
      'Data integrity and consistency is critical (finance, healthcare)',
      'You want full SQL power and mature tooling',
    ],
  },
  'javascript-vs-typescript': {
    slug: 'javascript-vs-typescript',
    title: 'JavaScript vs TypeScript',
    a: {
      name: 'JavaScript',
      icon: '⚡',
      description: 'The original dynamic scripting language of the web. No compilation step — runs directly in browsers.',
      created: '1995',
      usedBy: ['Every website on the internet'],
    },
    b: {
      name: 'TypeScript',
      icon: '🔷',
      description: 'A typed superset of JavaScript developed by Microsoft. Compiles to plain JavaScript. Adds static typing, interfaces, and better tooling.',
      created: '2012',
      usedBy: ['Microsoft', 'Google', 'Airbnb', 'Slack'],
    },
    summary: 'TypeScript is JavaScript with types. It catches bugs at compile time instead of at runtime, making large codebases much safer. For small scripts, plain JS is fine. For anything production-scale, TypeScript is the professional choice.',
    rows: [
      { criterion: 'Type Safety', a: 'None — dynamic typing', b: 'Full static typing', winner: 'b' },
      { criterion: 'Learning Curve', a: 'Low — start coding immediately', b: 'Moderate — learn type system', winner: 'a' },
      { criterion: 'IDE Support', a: 'Good', b: 'Excellent — autocomplete, refactoring', winner: 'b' },
      { criterion: 'Bug Detection', a: 'Runtime only', b: 'Compile-time + runtime', winner: 'b' },
      { criterion: 'Setup Required', a: 'None', b: 'tsconfig.json + compilation step', winner: 'a' },
      { criterion: 'Team Collaboration', a: 'Harder at scale', b: 'Types as documentation', winner: 'b' },
      { criterion: 'Codebase Size', a: 'Fine for small projects', b: 'Essential for large projects', winner: 'tie' },
      { criterion: 'Browser Support', a: 'Native', b: 'Compiled to JS — same result', winner: 'tie' },
    ],
    whenA: [
      'Quick scripts or small personal projects',
      'Prototyping rapidly without setup overhead',
      'Working with beginners who are new to programming',
      'Simple automation scripts or one-off tasks',
    ],
    whenB: [
      'Building any production application',
      'Working in a team of multiple developers',
      'Large codebase that needs to be maintained over time',
      'When IDE autocompletion and refactoring matter',
    ],
  },
  'rest-vs-graphql': {
    slug: 'rest-vs-graphql',
    title: 'REST vs GraphQL',
    a: {
      name: 'REST',
      icon: '🔗',
      description: 'Representational State Transfer — the standard architecture for web APIs using HTTP methods and resource URLs.',
      created: '2000',
      usedBy: ['Twitter', 'GitHub', 'Stripe', 'Twilio'],
    },
    b: {
      name: 'GraphQL',
      icon: '◆',
      description: 'A query language for APIs developed by Facebook. Clients specify exactly what data they need in a single request.',
      created: '2015',
      usedBy: ['Facebook', 'GitHub', 'Shopify', 'Twitter'],
    },
    summary: 'REST is simple, well-understood, and works great for most APIs. GraphQL solves specific problems: over-fetching, under-fetching, and complex related data. Choose REST by default and reach for GraphQL when your frontend has complex, variable data needs.',
    rows: [
      { criterion: 'Simplicity', a: 'Very simple — just HTTP verbs and URLs', b: 'More complex — schema, resolvers, types', winner: 'a' },
      { criterion: 'Over-fetching', a: 'Common — endpoint returns fixed data', b: 'Never — client requests exactly what it needs', winner: 'b' },
      { criterion: 'Multiple Resources', a: 'Multiple requests needed', b: 'Single request for related data', winner: 'b' },
      { criterion: 'Caching', a: 'Easy — HTTP caching built-in', b: 'Harder — requires custom logic', winner: 'a' },
      { criterion: 'Learning Curve', a: 'Low', b: 'Higher — new query language', winner: 'a' },
      { criterion: 'Versioning', a: 'Requires v1, v2, v3...', b: 'Schema evolution without versions', winner: 'b' },
      { criterion: 'Tooling', a: 'Mature — decades of tools', b: 'Good — Apollo, Relay, etc.', winner: 'a' },
      { criterion: 'File Uploads', a: 'Simple multipart/form-data', b: 'More complex to implement', winner: 'a' },
    ],
    whenA: [
      'Building a simple or standard CRUD API',
      'Your team is new to API development',
      'You need maximum HTTP caching',
      'Public API that third-party developers will consume',
    ],
    whenB: [
      'Mobile apps with variable data requirements',
      'Frontend needs data from many related resources at once',
      'Multiple client types (web, iOS, Android) with different data needs',
      'Rapidly evolving schema without API versioning',
    ],
  },
  'nextjs-vs-react': {
    slug: 'nextjs-vs-react',
    title: 'Next.js vs React',
    a: { name: 'Next.js', icon: '▲', description: 'A production React framework with SSR, file-based routing, API routes, and built-in optimization.', created: '2016', usedBy: ['Vercel', 'TikTok', 'Hulu', 'Twitch'] },
    b: { name: 'React', icon: '⚛️', description: 'A JavaScript library for building UIs with components. Needs additional setup for routing, SSR, and deployment.', created: '2013', usedBy: ['Facebook', 'Instagram', 'Airbnb', 'Netflix'] },
    summary: 'React is a UI library — it only handles the view layer. Next.js is a full framework built on React that adds routing, SSR, API routes, and production optimizations. Use plain React for SPAs or when you control everything. Use Next.js for production apps.',
    rows: [
      { criterion: 'Routing',           a: 'Built-in file-based routing',         b: 'Requires React Router',             winner: 'a' },
      { criterion: 'Server-Side Rendering', a: 'Built-in SSR and SSG',           b: 'Requires custom setup',             winner: 'a' },
      { criterion: 'API Routes',        a: 'Built-in API endpoints',              b: 'Separate backend needed',           winner: 'a' },
      { criterion: 'Learning Curve',    a: 'Higher — more concepts',             b: 'Lower — focus only on components',  winner: 'b' },
      { criterion: 'Flexibility',       a: 'More opinionated',                   b: 'Full control over setup',           winner: 'b' },
      { criterion: 'Performance',       a: 'Excellent — automatic optimization', b: 'Good — depends on your setup',      winner: 'a' },
      { criterion: 'SEO',               a: 'Excellent — SSR/SSG by default',     b: 'Poor by default (CSR only)',        winner: 'a' },
      { criterion: 'Deployment',        a: 'One-click on Vercel',                b: 'Manual setup required',             winner: 'a' },
    ],
    whenA: ['Building a production web application', 'SEO matters for your project', 'You need a backend API too', 'You want full-stack in one framework'],
    whenB: ['Building a pure SPA (single-page app)', 'Learning React fundamentals first', 'You have a separate backend API', 'Maximum flexibility in your stack'],
  },
  'sql-vs-nosql': {
    slug: 'sql-vs-nosql',
    title: 'SQL vs NoSQL',
    a: { name: 'SQL', icon: '📊', description: 'Relational databases store data in structured tables with rows and columns. Use a standard query language (SQL).', created: '1974', usedBy: ['PostgreSQL users', 'MySQL users', 'Oracle', 'Microsoft'] },
    b: { name: 'NoSQL', icon: '📄', description: 'Non-relational databases store data in flexible formats — documents, key-value pairs, graphs, or columns.', created: '2009', usedBy: ['MongoDB users', 'Redis users', 'Cassandra', 'DynamoDB'] },
    summary: 'SQL databases are ideal for structured data with clear relationships — finance, HR, e-commerce. NoSQL databases excel when data is flexible, schema-less, or needs horizontal scaling — social media, IoT, real-time apps. Many modern applications use both.',
    rows: [
      { criterion: 'Data Structure',   a: 'Tables with rows/columns (rigid)',    b: 'Flexible: documents, key-value, graphs', winner: 'tie' },
      { criterion: 'Schema',           a: 'Fixed — must define before inserting', b: 'Flexible — add fields anytime',      winner: 'b' },
      { criterion: 'Relationships',    a: 'Native JOINs and foreign keys',       b: 'Manual — embed or reference',        winner: 'a' },
      { criterion: 'Scalability',      a: 'Vertical (bigger server)',            b: 'Horizontal (more servers)',          winner: 'b' },
      { criterion: 'ACID Compliance',  a: 'Full ACID — very reliable',           b: 'Varies — some are eventually consistent', winner: 'a' },
      { criterion: 'Query Language',   a: 'Standard SQL (learn once)',           b: 'Varies by database',                 winner: 'a' },
      { criterion: 'Use Case',         a: 'Financial, medical, structured data', b: 'Social, IoT, real-time, flexible',   winner: 'tie' },
      { criterion: 'Examples',         a: 'PostgreSQL, MySQL, SQLite',           b: 'MongoDB, Redis, Cassandra',          winner: 'tie' },
    ],
    whenA: ['Data has clear relationships', 'You need complex queries and JOINs', 'Data integrity is critical', 'Reporting and analytics'],
    whenB: ['Schema changes frequently', 'Massive scale with horizontal sharding', 'Real-time data or caching', 'Document or hierarchical data'],
  },
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = comparisons[slug];
  if (!c) return { title: 'Not Found' };
  return {
    title: c.title,
    description: c.summary,
  };
}

function WinnerIcon({ winner, side }: { winner?: 'a' | 'b' | 'tie'; side: 'a' | 'b' }) {
  if (winner === 'tie') return <Minus className="w-3.5 h-3.5 text-muted-foreground/50" />;
  if (winner === side) return <Check className="w-3.5 h-3.5 text-green-500" />;
  return <X className="w-3.5 h-3.5 text-muted-foreground/30" />;
}

export default async function CompareDetailPage({ params }: Props) {
  const { slug } = await params;
  const c = comparisons[slug];
  if (!c) notFound();

  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-10">
      <Breadcrumb items={[{ label: 'Compare', href: '/compare' }, { label: c.title }]} />

      <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-3">{c.title}</h1>
      <p className="text-muted-foreground leading-relaxed max-w-2xl mb-10">{c.summary}</p>

      {/* Tech overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {[c.a, c.b].map((tech, i) => (
          <div key={i} className="p-5 rounded-xl border border-border bg-background">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{tech.icon}</span>
              <div>
                <h2 className="font-bold text-foreground">{tech.name}</h2>
                <p className="text-xs text-muted-foreground">Created {tech.created}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{tech.description}</p>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Used by</p>
              <div className="flex flex-wrap gap-1.5">
                {tech.usedBy.map(u => (
                  <span key={u} className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
                    {u}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Feature Comparison</h2>
        <div className="rounded-xl border border-border overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-3 bg-muted/50 border-b border-border">
            <div className="p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Criterion</div>
            <div className="p-3 text-xs font-semibold uppercase tracking-wider text-foreground border-l border-border flex items-center gap-2">
              <span>{c.a.icon}</span> {c.a.name}
            </div>
            <div className="p-3 text-xs font-semibold uppercase tracking-wider text-foreground border-l border-border flex items-center gap-2">
              <span>{c.b.icon}</span> {c.b.name}
            </div>
          </div>

          {c.rows.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-3 border-b border-border last:border-0 ${i % 2 === 0 ? '' : 'bg-muted/20'}`}
            >
              <div className="p-3 text-sm font-medium text-foreground">{row.criterion}</div>
              <div className="p-3 border-l border-border">
                <div className="flex items-start gap-2">
                  <WinnerIcon winner={row.winner} side="a" />
                  <span className="text-sm text-muted-foreground leading-snug">{row.a}</span>
                </div>
              </div>
              <div className="p-3 border-l border-border">
                <div className="flex items-start gap-2">
                  <WinnerIcon winner={row.winner} side="b" />
                  <span className="text-sm text-muted-foreground leading-snug">{row.b}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* When to use */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { tech: c.a, items: c.whenA },
          { tech: c.b, items: c.whenB },
        ].map(({ tech, items }, i) => (
          <div key={i} className="p-5 rounded-xl border border-border bg-background">
            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <span>{tech.icon}</span>
              Choose {tech.name} when...
            </h3>
            <ul className="space-y-2">
              {items.map((item, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
