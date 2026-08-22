import type { SqliteLesson } from '../sqlite-curriculum';

export const lesson05: SqliteLesson = {
  id: 'sqlite-05',
  title: 'SQLite vs PostgreSQL vs MySQL',
  slug: '05-comparison',
  chapter: 'advanced',
  order: 5,
  difficulty: 'beginner',
  readingTime: 9,
  description: 'Compare SQLite, PostgreSQL, and MySQL across concurrency, data types, JSON support, performance, and deployment. Learn when to migrate.',
  sections: [
    {
      type: 'text',
      content: 'Choosing the right database is one of the most important architectural decisions in a project. SQLite, PostgreSQL, and MySQL represent three different philosophies. Understanding their trade-offs lets you pick the right tool and know when to change tools as your project grows.'
    },
    {
      type: 'heading',
      content: 'Architecture Comparison'
    },
    {
      type: 'text',
      content: 'The fundamental architectural difference between SQLite and the other two is the server model. PostgreSQL and MySQL are client-server databases: they run as separate processes that your application connects to over a socket. SQLite is an embedded database: the library runs inside your application process.'
    },
    {
      type: 'text',
      content: 'This architectural difference drives most of the other differences. A client-server database can serve many simultaneous clients over a network, manage permissions, handle concurrent writes with sophisticated locking, and scale with dedicated hardware. An embedded database can do none of these things by design — but it needs zero configuration and zero infrastructure.'
    },
    {
      type: 'table',
      title: 'Comprehensive Database Comparison',
      headers: ['Factor', 'SQLite', 'PostgreSQL', 'MySQL / MariaDB'],
      rows: [
        ['Architecture', 'Embedded library', 'Client-server', 'Client-server'],
        ['Setup complexity', 'None', 'Moderate', 'Moderate'],
        ['Concurrent writes', 'One writer (WAL: better)', 'Excellent (MVCC)', 'Good (InnoDB MVCC)'],
        ['Data types', 'Loose affinity system', 'Rich strict types + custom types', 'Standard types, less extensible'],
        ['JSON support', 'Basic JSON functions', 'JSONB (indexed binary JSON)', 'JSON column type'],
        ['Full-text search', 'FTS5 extension', 'Built-in tsvector/tsquery', 'FULLTEXT index'],
        ['Geospatial', 'Not built-in', 'PostGIS extension (industry standard)', 'Basic spatial types'],
        ['Replication', 'Litestream, LiteFS', 'Built-in streaming + logical replication', 'Built-in replication'],
        ['Max DB size', '281 TB (technically)', 'Unlimited (petabytes practical)', 'Unlimited'],
        ['License', 'Public domain', 'PostgreSQL (MIT-like)', 'GPL (community) / Commercial'],
        ['Best for', 'Embedded, mobile, testing', 'Production web apps, complex queries', 'General web apps, WordPress']
      ]
    },
    {
      type: 'heading',
      content: 'Concurrency Model'
    },
    {
      type: 'text',
      content: 'Concurrency is where SQLite most significantly differs from PostgreSQL and MySQL. SQLite allows many simultaneous readers, but only one writer at a time. The default journal mode serializes all writes. WAL (Write-Ahead Logging) mode is significantly better — it allows readers and one writer to proceed concurrently — but still has limits compared to server databases.'
    },
    {
      type: 'text',
      content: 'PostgreSQL uses MVCC (Multi-Version Concurrency Control), which allows many simultaneous readers and writers without blocking each other. Each transaction sees a consistent snapshot of the database. This is why PostgreSQL scales to thousands of concurrent connections while SQLite struggles beyond a few concurrent writers.'
    },
    {
      type: 'heading',
      content: 'SQLite in Production'
    },
    {
      type: 'text',
      content: 'The conventional wisdom was that SQLite is only for development and testing. This has changed. Modern deployments like Litestream (continuous replication to S3), LiteFS (distributed SQLite), and Turso (SQLite on the edge) show that SQLite can serve real production workloads when the write rate is manageable and the data size fits comfortably on one machine.'
    },
    {
      type: 'text',
      content: 'The key insight is that most applications are heavily read-dominated. A blog, a documentation site, or a user profile service might have 95% reads and 5% writes. For these workloads, SQLite in WAL mode performs extremely well and eliminates the operational overhead of managing a PostgreSQL server.'
    },
    {
      type: 'heading',
      content: 'When to Migrate from SQLite'
    },
    {
      type: 'list',
      title: 'Consider migrating to PostgreSQL when:',
      items: [
        'You have multiple application servers all writing to the database (SQLite is local to one machine)',
        'Your write volume exceeds what WAL mode can handle (hundreds of writes per second)',
        'You need advanced features: PostGIS, full-text search, JSONB operators, advanced partitioning',
        'You need row-level security or advanced permission management',
        'Your database size exceeds 1-10 GB and performance is suffering',
        'You need streaming replication to read replicas for high availability'
      ]
    },
    {
      type: 'example',
      title: 'WAL Mode Configuration',
      content: 'Enabling WAL mode in SQLite for better concurrent read-write performance.',
      code: `const Database = require('better-sqlite3');
const db = new Database('./myapp.db');

// Enable WAL mode — persists in the database file
// Only needs to be run once, then it stays in WAL mode
db.pragma('journal_mode = WAL');

// Verify WAL mode is active
const mode = db.pragma('journal_mode', { simple: true });
console.log(mode); // 'wal'

// Additional WAL tuning
db.pragma('synchronous = NORMAL');   // Faster writes, still crash-safe
db.pragma('cache_size = -64000');    // 64MB page cache
db.pragma('temp_store = MEMORY');    // Temp tables in memory
db.pragma('mmap_size = 268435456');  // 256MB memory-mapped I/O

// In WAL mode:
// - Readers do not block writers
// - Writers do not block readers  
// - Multiple readers run concurrently
// - Only one writer at a time (same as before)`,
      language: 'javascript'
    },
    {
      type: 'tip',
      title: 'SQLite for Unit Tests',
      content: 'Even if your production database is PostgreSQL, use SQLite in-memory databases for unit tests. Test setup takes microseconds instead of milliseconds, tests run in parallel without port conflicts, and cleanup is automatic. Just make sure your queries use standard SQL that works in both databases.'
    },
    {
      type: 'tryit',
      title: 'Database Selector Decision Tool',
      js: `document.body.innerHTML = \`
  <div>
    <h3>Which Database Should You Use?</h3>
    <p>Answer a few questions to get a recommendation</p>
    <div id="quiz"></div>
  </div>
\`;

const questions = [
  {
    q: 'How many concurrent users will write data simultaneously?',
    opts: [
      { text: 'Just me or one server at a time', score: { sqlite: 3, pg: 1, mysql: 1 } },
      { text: 'A few concurrent users (< 10 writes/sec)', score: { sqlite: 2, pg: 2, mysql: 2 } },
      { text: 'Many concurrent writers (>100 writes/sec)', score: { sqlite: 0, pg: 3, mysql: 2 } },
    ]
  },
  {
    q: 'What is your deployment environment?',
    opts: [
      { text: 'Embedded in a mobile or desktop app', score: { sqlite: 3, pg: 0, mysql: 0 } },
      { text: 'Single server web app', score: { sqlite: 2, pg: 2, mysql: 2 } },
      { text: 'Multiple servers / containers / microservices', score: { sqlite: 0, pg: 3, mysql: 2 } },
    ]
  },
  {
    q: 'Do you need advanced features (PostGIS, JSONB, complex types)?',
    opts: [
      { text: 'No — standard SQL is enough', score: { sqlite: 2, pg: 2, mysql: 2 } },
      { text: 'JSON storage would be useful', score: { sqlite: 1, pg: 3, mysql: 2 } },
      { text: 'Yes — geospatial, full-text search, custom types', score: { sqlite: 0, pg: 3, mysql: 1 } },
    ]
  },
];

let answers = new Array(questions.length).fill(null);
let step = 0;

const names = { sqlite: 'SQLite', pg: 'PostgreSQL', mysql: 'MySQL' };
const colors = { sqlite: '#0F3B70', pg: '#336791', mysql: '#F29111' };

function calcScores() {
  const scores = { sqlite: 0, pg: 0, mysql: 0 };
  answers.forEach((a, i) => {
    if (a !== null) {
      const s = questions[i].opts[a].score;
      Object.keys(s).forEach(k => { scores[k] += s[k]; });
    }
  });
  return scores;
}

function renderResult() {
  const scores = calcScores();
  const max = Math.max(...Object.values(scores));
  const winner = Object.entries(scores).find(([, v]) => v === max)?.[0] || 'sqlite';
  return \`<div style="text-align:center;padding:20px">
    <div style="font-size:12px;color:#718096;margin-bottom:8px">Recommended database:</div>
    <div style="font-size:24px;font-weight:800;color:\${colors[winner]}">\${names[winner]}</div>
    <div style="margin-top:16px">\${Object.entries(scores).map(([k, v]) =>
      \`<div style="margin:6px 0;text-align:left">
        <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:600;color:\${colors[k]};margin-bottom:3px"><span>\${names[k]}</span><span>\${v}</span></div>
        <div style="background:#e2e8f0;border-radius:4px;height:8px"><div style="width:\${Math.round(v/9*100)}%;background:\${colors[k]};border-radius:4px;height:8px;transition:.4s"></div></div>
      </div>\`
    ).join('')}</div>
    <button onclick="restart()" style="margin-top:16px;padding:8px 20px;background:#0F3B70;color:white;border:none;border-radius:6px;cursor:pointer;font-weight:700;font-size:13px">Start Over</button>
  </div>\`;
}

function render() {
  if (step >= questions.length) {
    document.getElementById('quiz').innerHTML = renderResult();
    return;
  }
  const q = questions[step];
  document.getElementById('quiz').innerHTML = \`
    <div style="margin-bottom:8px;font-size:11px;color:#718096">Question \${step+1} of \${questions.length}</div>
    <div style="font-weight:700;font-size:14px;color:#1a202c;margin-bottom:14px">\${q.q}</div>
    \${q.opts.map((o, i) =>
      \`<button onclick="answer(\${i})" style="display:block;width:100%;text-align:left;padding:10px 14px;border:1px solid \${answers[step]===i?'#0F3B70':'#e2e8f0'};border-radius:8px;cursor:pointer;font-size:13px;font-weight:\${answers[step]===i?700:400};margin-bottom:6px;background:\${answers[step]===i?'#e0e8f5':'white'};color:#1a202c">\${o.text}</button>\`
    ).join('')}
    <div style="display:flex;gap:8px;margin-top:12px">
      \${step > 0 ? '<button onclick="prev()" style="padding:7px 16px;background:#e2e8f0;border:none;border-radius:6px;cursor:pointer;font-weight:600;font-size:12px;color:#4a5568">Back</button>' : ''}
      <button onclick="next()" \${answers[step]===null?'disabled':''} style="padding:7px 16px;background:#0F3B70;color:white;border:none;border-radius:6px;cursor:pointer;font-weight:700;font-size:12px;opacity:\${answers[step]===null?0.4:1}">\${step < questions.length-1 ? 'Next' : 'See Result'}</button>
    </div>
  \`;
}

window.answer = function(i) { answers[step] = i; render(); };
window.next = function() { if (answers[step] !== null) { step++; render(); } };
window.prev = function() { step--; render(); };
window.restart = function() { answers = new Array(questions.length).fill(null); step = 0; render(); };
render();`,
      css: `body { padding: 20px; font-family: system-ui, sans-serif; background: #f7fafc; }
h3 { color: #0F3B70; margin: 0 0 6px 0; font-size: 15px; font-weight: 700; }
p { color: #718096; font-size: 13px; margin: 0 0 14px 0; }
#quiz { background: white; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; }`
    }
  ],
  exercises: [
    {
      id: 'ex-sqlite-5-1',
      question: 'Which scenario is SQLite NOT appropriate for?',
      type: 'multiple-choice',
      options: [
        'An iOS app storing user preferences locally',
        'A multi-server web application with high concurrent write traffic',
        'Unit and integration tests with in-memory databases',
        'A desktop note-taking app'
      ],
      correct: 1,
      explanation: 'SQLite allows only one writer at a time and is tied to the local filesystem. A multi-server application where many servers write to the same database cannot use SQLite (each server would need its own copy, which defeats the purpose). Use PostgreSQL or MySQL for this.'
    },
    {
      id: 'ex-sqlite-5-2',
      question: 'What does WAL mode improve in SQLite?',
      type: 'multiple-choice',
      options: [
        'It allows multiple simultaneous writers',
        'It allows readers and one writer to proceed concurrently without blocking each other',
        'It replicates data to a backup server',
        'It enables network access to the SQLite database'
      ],
      correct: 1,
      explanation: 'WAL (Write-Ahead Logging) mode allows reads to proceed concurrently with writes without blocking. In default rollback journal mode, a write locks out all readers. WAL separates readers and writers, significantly improving throughput for read-heavy workloads.'
    },
    {
      id: 'ex-sqlite-5-3',
      question: 'What is MVCC (used by PostgreSQL)?',
      type: 'multiple-choice',
      options: [
        'A backup strategy that creates multiple versions of the database file',
        'Multi-Version Concurrency Control — each transaction sees a consistent snapshot, allowing concurrent readers and writers without blocking',
        'A clustering technology for running multiple PostgreSQL servers',
        'The MySQL version control system'
      ],
      correct: 1,
      explanation: 'MVCC (Multi-Version Concurrency Control) means the database maintains multiple versions of rows. Each transaction sees a consistent snapshot of the data at its start time. Writers create new row versions instead of modifying in place, so readers and writers never block each other.'
    }
  ],
  quiz: [
    {
      id: 'q-sqlite-5-1',
      question: 'What is the primary reason SQLite cannot be used on multiple application servers simultaneously?',
      options: [
        'SQLite uses a different SQL dialect than PostgreSQL',
        'SQLite is a local file — multiple servers would each have their own copy with no synchronization',
        'SQLite does not support transactions',
        'SQLite has no authentication system'
      ],
      correct: 1,
      explanation: 'SQLite is a file on the local filesystem. If you have three application servers, each would need its own SQLite file, and they would diverge immediately. There is no network protocol for multiple machines to share one SQLite file (though tools like LiteFS add this capability).'
    },
    {
      id: 'q-sqlite-5-2',
      question: 'Which PostgreSQL feature makes it superior to MySQL for complex analytical queries?',
      options: [
        'PostgreSQL is always faster than MySQL',
        'JSONB (binary JSON with full indexing), rich custom type support, and standards compliance for complex SQL features',
        'PostgreSQL has more tables per database',
        'PostgreSQL runs on more operating systems'
      ],
      correct: 1,
      explanation: 'PostgreSQL has JSONB (binary JSON with GIN indexing), custom data types, advanced window functions, CTEs, materialized views, and better standards compliance. These features make PostgreSQL superior for complex queries, analytics, and flexible data models.'
    },
    {
      id: 'q-sqlite-5-3',
      question: 'When should you consider SQLite for production use?',
      options: [
        'Never — SQLite is only for development',
        'When you have read-heavy workloads, a single server, and can use WAL mode with tools like Litestream',
        'When you need the most concurrent writes possible',
        'Only when PostgreSQL is too expensive'
      ],
      correct: 1,
      explanation: 'Modern SQLite deployments show it works well for read-heavy production workloads on a single server. With WAL mode, tools like Litestream (continuous replication to S3), and LiteFS, SQLite can serve real production traffic while being dramatically simpler to operate than a PostgreSQL server.'
    }
  ]
};
