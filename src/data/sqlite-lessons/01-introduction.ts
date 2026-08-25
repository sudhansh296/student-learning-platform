import type { SqliteLesson } from '../sqlite-curriculum';

export const lesson01: SqliteLesson = {
  id: 'sqlite-01',
  title: 'Introduction to SQLite',
  slug: '01-introduction',
  chapter: 'intro',
  order: 1,
  difficulty: 'beginner',
  readingTime: 9,
  description: 'Learn what SQLite is, how it differs from server-based databases, where it is used, and when to choose it.',
  sections: [
    {
      type: 'text',
      content: 'SQLite is the most widely deployed database engine in the world. Not the most popular in terms of downloads or documentation - but in terms of actual running instances. Every smartphone, every browser, most desktop apps, and countless IoT devices run SQLite right now. It is embedded in the device itself, requiring no setup and no server.'
    },
    {
      type: 'heading',
      content: 'What Makes SQLite Different?'
    },
    {
      type: 'text',
      content: 'Traditional databases like PostgreSQL and MySQL run as separate server processes. Your application connects to them over a network socket, sends queries, and receives results. SQLite works completely differently: it is a library linked directly into your application. The entire database - tables, indexes, data - lives in a single file on disk. No server, no port, no authentication setup, no configuration.'
    },
    {
      type: 'list',
      title: 'SQLite key characteristics:',
      items: [
        'Serverless: no database server process to install, configure, or manage',
        'Zero-configuration: drop in the library and it works; no admin account needed',
        'File-based: the entire database is one .db or .sqlite file on disk',
        'Self-contained: the library has no external dependencies',
        'Cross-platform: a database file created on Windows works on Linux and macOS',
        'ACID compliant: full transaction support with crash recovery',
        'Public domain: SQLite code is in the public domain - no license required'
      ]
    },
    {
      type: 'heading',
      content: 'SQLite vs Server-Based Databases'
    },
    {
      type: 'text',
      content: 'SQLite is not trying to be PostgreSQL or MySQL. It solves a different class of problem. Understanding the trade-offs helps you pick the right tool for each situation.'
    },
    {
      type: 'table',
      title: 'SQLite vs PostgreSQL vs MySQL',
      headers: ['Factor', 'SQLite', 'PostgreSQL / MySQL'],
      rows: [
        ['Architecture', 'Embedded library in your app process', 'Separate server process'],
        ['Setup', 'Zero: add library, open file', 'Install server, configure, create users'],
        ['Connection', 'Direct file access (no network)', 'TCP/IP socket connection'],
        ['Concurrent writes', 'One writer at a time (WAL mode helps)', 'Multiple concurrent writers'],
        ['Data size', 'Up to 281 TB technically, practical limit ~1 GB', 'Petabytes with proper hardware'],
        ['User management', 'None - filesystem permissions control access', 'Full user, role, and privilege system'],
        ['Data types', 'Loosely typed (type affinity)', 'Strictly typed with many types'],
        ['Network access', 'Local file only (not directly)', 'Any client over the network'],
        ['Use cases', 'Mobile, desktop, embedded, testing, prototypes', 'Web apps, APIs, enterprise systems']
      ]
    },
    {
      type: 'heading',
      content: 'Where SQLite Is Used'
    },
    {
      type: 'text',
      content: 'SQLite was created in 2000 by D. Richard Hipp for the US Navy. Since then its adoption has been extraordinary, largely because it is so easy to embed in other software.'
    },
    {
      type: 'list',
      title: 'SQLite runs everywhere:',
      items: [
        'Mobile apps: every iOS and Android app that needs local storage uses SQLite. WhatsApp, Instagram, and Signal all store data in SQLite on your phone.',
        'Web browsers: Chrome, Firefox, and Safari all use SQLite to store history, bookmarks, cookies, and site data',
        'Desktop apps: Xcode, Skype, Dropbox, and Adobe products embed SQLite for local data',
        'Embedded systems: smart TVs, GPS devices, set-top boxes, industrial sensors',
        'Testing: unit and integration tests use in-memory SQLite databases for fast, isolated, zero-setup test environments',
        'Prototyping: start with SQLite, migrate to PostgreSQL when you need concurrent writes or scale'
      ]
    },
    {
      type: 'heading',
      content: 'SQLite Features and Limitations'
    },
    {
      type: 'text',
      content: 'SQLite supports most of SQL including transactions, subqueries, views, triggers, and most data types. However, it has some notable differences from full RDBMS systems that you need to know.'
    },
    {
      type: 'list',
      title: 'Known SQLite limitations:',
      items: [
        'Type affinity instead of strict types: SQLite uses "type affinity" - you can store any type in any column unless STRICT mode is enabled (SQLite 3.37+)',
        'Limited ALTER TABLE: SQLite only supports ADD COLUMN and RENAME - you cannot drop or modify columns without recreating the table',
        'No RIGHT JOIN or FULL OUTER JOIN in older versions (added in 3.39.0)',
        'Foreign key constraints are OFF by default - you must enable with PRAGMA foreign_keys = ON',
        'Single writer at a time by default (WAL mode allows concurrent reads with one writer)'
      ]
    },
    {
      type: 'heading',
      content: 'The .db File'
    },
    {
      type: 'text',
      content: 'The SQLite database is a regular file on your filesystem. You can copy it, back it up with cp, email it, open it in a GUI tool, or delete it. The file format is stable and cross-platform - a .db file created today will be readable by SQLite in decades. This simplicity is one of SQLite\'s greatest strengths for embedded and archival use cases.'
    },
    {
      type: 'example',
      title: 'SQLite CLI Commands',
      content: 'Using the sqlite3 command-line tool to create a database, show tables, run queries, and inspect schema.',
      code: `# Open (or create) a database file
sqlite3 myapp.db

# Inside the sqlite3 shell:
.help              -- show all dot commands
.tables            -- list all tables
.schema users      -- show CREATE TABLE for users
.mode column       -- formatted column output
.headers on        -- show column names

-- Create a table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Insert data
INSERT INTO users (email, name) VALUES ('alice@example.com', 'Alice Chen');

-- Query data
SELECT * FROM users;

.quit              -- exit the shell`,
      language: 'bash'
    },
    {
      type: 'tip',
      title: 'GUI Tools for SQLite',
      content: 'For development and debugging, use DB Browser for SQLite (free) or TablePlus. Both let you view, edit, and query SQLite databases without writing CLI commands. VS Code also has the SQLite Viewer extension for quick inspection.'
    },
    {
      type: 'tryit',
      title: 'SQLite vs PostgreSQL Comparison',
      js: `document.body.innerHTML = '<div><h3>SQLite vs PostgreSQL</h3><p>Compare features and see which database fits different use cases</p><div id="tabs"></div><div id="content"></div></div>';

const features = [
  { feature: 'Setup time', sqlite: 'Instant', pg: '5-15 minutes' },
  { feature: 'Concurrent writes', sqlite: 'One at a time', pg: 'Multiple simultaneous' },
  { feature: 'Network access', sqlite: 'Local only', pg: 'Remote clients supported' },
  { feature: 'Max practical size', sqlite: '~1 GB practical', pg: 'Petabytes' },
  { feature: 'User management', sqlite: 'None (OS permissions)', pg: 'Full RBAC system' },
  { feature: 'Replication', sqlite: 'Not built-in', pg: 'Built-in streaming replication' },
  { feature: 'License', sqlite: 'Public domain', pg: 'MIT / PostgreSQL license' },
  { feature: 'Best for', sqlite: 'Embedded / testing', pg: 'Production web apps' },
];

const useCases = [
  { case: 'Mobile app (iOS/Android)', winner: 'SQLite', reason: 'Serverless, embedded, no setup required on device' },
  { case: 'Unit / integration tests', winner: 'SQLite', reason: 'In-memory DB, zero config, fast spin-up and teardown' },
  { case: 'Multi-user web application', winner: 'PostgreSQL', reason: 'Needs concurrent writes from many users/servers' },
  { case: 'Local desktop app', winner: 'SQLite', reason: 'Single user, no server process, self-contained' },
  { case: 'High-traffic API (>100 req/s writes)', winner: 'PostgreSQL', reason: 'SQLite serializes writes; PG handles concurrent writes' },
  { case: 'Prototype / quick demo', winner: 'SQLite', reason: 'Fastest start - just open a file' },
];

let tab = 'comparison';

function renderComparison() {
  const head = ['Feature','SQLite','PostgreSQL'].map(h =>
    \`<th style="background:#0F3B70;color:white;padding:8px 12px;text-align:left;font-size:11px;font-weight:700">\${h}</th>\`
  ).join('');
  const body = features.map((r, i) =>
    \`<tr style="background:\${i%2===0?'#fff':'#f8fafc'}">
      <td style="padding:7px 12px;font-size:12px;font-weight:600;border-bottom:1px solid #e2e8f0;color:#1a202c">\${r.feature}</td>
      <td style="padding:7px 12px;font-size:12px;font-family:monospace;border-bottom:1px solid #e2e8f0;color:#0F3B70">\${r.sqlite}</td>
      <td style="padding:7px 12px;font-size:12px;font-family:monospace;border-bottom:1px solid #e2e8f0;color:#336791">\${r.pg}</td>
    </tr>\`
  ).join('');
  return \`<table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:6px;overflow:hidden"><thead><tr>\${head}</tr></thead><tbody>\${body}</tbody></table>\`;
}

function renderUseCases() {
  return useCases.map((u, i) =>
    \`<div style="background:white;border:1px solid #e2e8f0;border-radius:8px;padding:12px;margin-bottom:8px;border-left:4px solid \${u.winner==='SQLite'?'#0F3B70':'#336791'}">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <span style="font-weight:700;font-size:13px;color:#1a202c">\${u.case}</span>
        <span style="font-size:11px;font-weight:700;padding:2px 10px;border-radius:10px;background:\${u.winner==='SQLite'?'#e0e8f5':'#e8f0fb'};color:\${u.winner==='SQLite'?'#0F3B70':'#336791'}">\${u.winner}</span>
      </div>
      <div style="font-size:12px;color:#718096">\${u.reason}</div>
    </div>\`
  ).join('');
}

function render() {
  document.getElementById('tabs').innerHTML = [['comparison','Comparison Table'],['usecases','Use Cases']].map(([id, label]) =>
    \`<button onclick="setTab('\${id}')" style="padding:7px 16px;border:none;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;margin-right:6px;background:\${tab===id?'#0F3B70':'#e2e8f0'};color:\${tab===id?'white':'#4a5568'}">\${label}</button>\`
  ).join('');
  document.getElementById('content').innerHTML = tab === 'comparison' ? renderComparison() : renderUseCases();
}

window.setTab = function(t) { tab = t; render(); };
render();`,
      css: `body { padding: 20px; font-family: system-ui, sans-serif; background: #f7fafc; }
h3 { color: #0F3B70; margin: 0 0 6px 0; font-size: 15px; font-weight: 700; }
p { color: #718096; font-size: 13px; margin: 0 0 14px 0; }
#tabs { margin-bottom: 14px; }`
    }
  ],
  exercises: [
    {
      id: 'ex-sqlite-1-1',
      question: 'What makes SQLite "serverless"?',
      type: 'multiple-choice',
      options: [
        'It runs on cloud servers automatically',
        'It is a library linked directly into your application with no separate server process',
        'It connects to servers without requiring authentication',
        'It uses a serverless cloud function to process queries'
      ],
      correct: 1,
      explanation: 'Serverless means there is no separate database server process to run and manage. SQLite is a library embedded directly in your application. The "server" is just the library, running in your process, reading from a local file.'
    },
    {
      id: 'ex-sqlite-1-2',
      question: 'Which SQLite limitation is important to know when migrating from PostgreSQL?',
      type: 'multiple-choice',
      options: [
        'SQLite does not support transactions',
        'SQLite foreign key constraints are disabled by default and must be enabled with PRAGMA',
        'SQLite does not support SQL at all',
        'SQLite cannot store more than 10MB of data'
      ],
      correct: 1,
      explanation: 'SQLite has foreign key support, but it is disabled by default for backwards compatibility. You must run PRAGMA foreign_keys = ON at the start of each connection to enable referential integrity checks.'
    },
    {
      id: 'ex-sqlite-1-3',
      question: 'When is SQLite the BEST database choice?',
      type: 'multiple-choice',
      options: [
        'A web API with 1000 concurrent users writing data',
        'A mobile app storing user preferences and local data on a device',
        'A financial system processing millions of transactions per day',
        'A multi-region distributed database'
      ],
      correct: 1,
      explanation: 'SQLite excels at embedded, single-user scenarios like mobile apps. A mobile app needs a local database that works offline, requires no network connection, and has zero configuration. SQLite is perfect for this.'
    }
  ],
  quiz: [
    {
      id: 'q-sqlite-1-1',
      question: 'Where does SQLite store its database?',
      options: [
        'In memory only (no persistence)',
        'On a remote database server',
        'In a single file on the local filesystem',
        'In a directory of files, one per table'
      ],
      correct: 2,
      explanation: 'SQLite stores the entire database - all tables, indexes, and data - in a single file on the local filesystem. This is one of its defining characteristics. The file can be copied, backed up, or moved like any other file.'
    },
    {
      id: 'q-sqlite-1-2',
      question: 'Who created SQLite and when?',
      options: [
        'Oracle Corporation, 1995',
        'D. Richard Hipp for the US Navy, 2000',
        'Linus Torvalds, 2005',
        'The SQLite Foundation, 2010'
      ],
      correct: 1,
      explanation: 'SQLite was created by D. Richard Hipp in 2000 while working on a project for the US Navy. He needed a database that worked without installing a server on naval ships. SQLite code is in the public domain.'
    },
    {
      id: 'q-sqlite-1-3',
      question: 'What is "WAL mode" in SQLite?',
      options: [
        'A mode that makes SQLite act as a server',
        'Write-Ahead Logging - allows concurrent reads while one writer is active',
        'Web API Layer - enables network access to SQLite',
        'Warm Access Log - a performance profiling mode'
      ],
      correct: 1,
      explanation: 'WAL (Write-Ahead Logging) is an SQLite journal mode that enables concurrent reads while a write is in progress. In default journal mode, writers block all readers. WAL mode significantly improves concurrency for read-heavy workloads.'
    }
  ]
};
