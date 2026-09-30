import { code } from './cheatsheet-types';
import type { QuestionBank } from './question-types';

export const sqliteInterview: QuestionBank = {
  path: '/sqlite-interview-questions',
  mode: 'interview',
  tech: 'sqlite',
  codeLang: 'sql',
  badge: 'SQLite interview',
  title: 'SQLite Interview Questions and Answers',
  description: '40+ SQLite interview questions with clear answers: what makes it different, using it from Node.js, transactions, relationships, concurrency and when to migrate.',
  h1: 'SQLite Interview Questions and Answers (Freshers to Backend Developers)',
  intro: 'Forty-plus interview questions specifically about SQLite: what genuinely makes it different from a server-based database, using it from Node.js with better-sqlite3, CRUD and transactions, foreign keys and relationships, its concurrency model, and when a project should migrate to PostgreSQL or MySQL instead. Each has a short answer and a fuller explanation. For general, portable SQL questions that apply to any relational database, see the SQL interview questions page.',
  notes: [
    {
      id: 'how-to-use',
      title: 'How to use this page',
      text: 'Read the short answer first, then open the longer explanation for the reasoning. This page focuses on what makes SQLite specifically different — its architecture, concurrency model and Node.js usage — rather than general SQL syntax, which the SQL interview questions page already covers in depth.',
      placement: 'top',
    },
    {
      id: 'common-mistakes',
      title: 'Common mistakes beginners make',
      items: [
        'Assuming SQLite enforces foreign keys by default. Fix: foreign key enforcement is off by default per connection — it must be turned on explicitly with PRAGMA foreign_keys = ON.',
        'Writing many small, separate INSERT statements in a loop without wrapping them in a transaction. Fix: each individual write outside a transaction commits to disk separately, which is slow — wrapping a batch of writes in one transaction can be dramatically faster.',
        'Treating SQLite as unable to handle any real production traffic. Fix: SQLite in WAL mode handles surprisingly high read-heavy traffic well; the real limitation is concurrent writes, not reads.',
        'Choosing async node-sqlite3 by default without considering better-sqlite3. Fix: for most typical SQLite workloads, the synchronous better-sqlite3 API is both simpler to use correctly and usually faster, since SQLite\'s own operations are already fast and local.',
      ],
    },
    {
      id: 'real-projects',
      title: 'Where this helps in real projects',
      items: [
        'Choosing SQLite for local development, tests, or a small self-contained application, and knowing exactly why it fits.',
        'Correctly enabling foreign key enforcement and understanding SQLite\'s flexible typing before it causes a subtle bug.',
        'Batching writes in a transaction for real performance, instead of accepting a slow one-write-at-a-time loop.',
        'Recognizing the concrete signals that mean it is time to migrate from SQLite to a server-based database.',
      ],
    },
    {
      id: 'study-tip',
      title: 'Study tip',
      text: 'Be ready to explain, specifically, why SQLite is embedded and what that architectural difference actually causes downstream — no server process, one file, a "one writer at a time" concurrency model. Most SQLite interview questions are really testing whether you understand that one architectural choice and its consequences, not whether you remember individual SQL commands.',
    },
    {
      id: 'reviewed-note',
      title: 'Reviewed note',
      text: 'The runnable SQL examples on this page execute against a real PostgreSQL database in the built-in editor (the same engine backing this site\'s SQL and PostgreSQL pages), so they intentionally use portable syntax rather than genuine SQLite-only syntax — real SQLite auto-increments a bare INTEGER PRIMARY KEY without needing AUTOINCREMENT, and uses PRAGMA statements and dot commands that have no equivalent to actually run here. Where the real SQLite syntax differs, it is called out in the explanation text. If something is wrong or unclear, please [tell us](/contact).',
      style: 'callout',
    },
  ],
  groups: [
    {
      id: 'fundamentals',
      title: 'What makes SQLite different',
      items: [
        { q: 'What is SQLite, and how is it fundamentally different from PostgreSQL or MySQL?', level: 'beginner', short: 'SQLite is an embedded, serverless relational database — the entire engine runs as a library inside your application process, and the whole database is a single file on disk. PostgreSQL and MySQL run as a separate server process that applications connect to over a network (even if that network is localhost).', long: 'This one architectural difference explains almost everything else distinctive about SQLite: no connection string with a host and port, no separate process to install or manage, and a very different concurrency story, since there is no central server coordinating many simultaneous clients.', lessons: ['sqlite/01-introduction'] },
        { q: 'What does it mean that SQLite has "dynamic typing" for columns?', level: 'intermediate', short: 'A column\'s declared type (like INTEGER or TEXT) is mostly a hint rather than a strictly enforced rule — SQLite will generally still store a value of a different type in that column, with a few exceptions. This is looser than PostgreSQL or MySQL, which reject a value that does not match the column\'s type.', long: 'SQLite calls this "type affinity" — each column has a preferred type it tries to convert values toward, but it is not a hard constraint the way it is in most other relational databases. This flexibility can hide bugs that a stricter database would catch immediately at insert time.', lessons: ['sqlite/01-introduction'] },
        { q: 'Is SQLite ACID-compliant, despite being embedded and lightweight?', level: 'intermediate', short: 'Yes — SQLite fully supports atomic, consistent, isolated and durable transactions, and is well known for being extremely reliable about this despite its small footprint. Being embedded does not mean being less correct.', lessons: ['sqlite/01-introduction'] },
        { q: 'What are good real-world use cases for SQLite?', level: 'beginner', short: 'Local development and automated tests, mobile and desktop applications, embedded devices, small-to-medium websites, and as an application file format — anywhere a full database server would be unnecessary overhead.', long: 'SQLite is, by download and deployment count, likely the most widely deployed database engine in the world — it ships inside nearly every phone, browser and countless embedded devices, almost always invisibly to the end user.', lessons: ['sqlite/01-introduction'] },
        { q: 'What is the ".db" file, and what happens if you delete it?', level: 'beginner', short: 'It is the entire database — every table, every row, every index — stored as one ordinary file on disk. Deleting it deletes the whole database instantly and irreversibly (short of a backup), since there is no separate server retaining anything.', long: 'This is also exactly why SQLite is so easy to back up, copy, or move: copying that one file is functionally equivalent to backing up an entire server-based database\'s data directory.', lessons: ['sqlite/01-introduction'] },
      ],
    },
    {
      id: 'nodejs',
      title: 'Using SQLite from Node.js',
      items: [
        { q: 'What is the difference between better-sqlite3 and node-sqlite3?', level: 'intermediate', short: 'better-sqlite3 provides a synchronous API — every call blocks until it completes. node-sqlite3 is asynchronous and callback-based, matching Node\'s usual non-blocking style more closely.', long: 'For most typical SQLite operations, which are fast and entirely local (no network round trip), the synchronous API is both simpler to write correctly (no callback or promise wrapping needed) and often faster overall, since it avoids the overhead async machinery adds for operations that finish almost instantly anyway.', lessons: ['sqlite/02-setup-nodejs'] },
        { q: 'Why would a synchronous database API ever be the right choice in Node.js, which is built around non-blocking I/O?', level: 'advanced', short: 'Because SQLite operations are local and typically very fast (microseconds to low milliseconds), the "blocking" is so brief it rarely matters in practice — and the simpler synchronous code is easier to reason about and less prone to subtle async bugs than wrapping every fast operation in a Promise for no real benefit.', long: 'This tradeoff would look very different for a slow, network-bound database, where blocking the event loop while waiting on the network really would hurt throughput — SQLite\'s local, fast nature is exactly why the usual "never block Node\'s event loop" advice bends here.' },
        { q: 'What is a prepared statement, and why use one instead of building a raw SQL string?', level: 'intermediate', short: 'A prepared statement is parsed and compiled once, then can be executed many times with different parameter values — faster for repeated queries, and the correct, safe way to include variable values (with ? placeholders) instead of concatenating them into the SQL string.', code: code('CREATE TABLE tasks (id SERIAL PRIMARY KEY, title TEXT);'), long: 'In better-sqlite3, this looks like db.prepare(\'INSERT INTO tasks (title) VALUES (?)\'), which returns a reusable statement object with a .run() method — reused across many inserts instead of re-preparing the same SQL every time.', lessons: ['sqlite/03-crud'] },
        { q: 'What is an in-memory SQLite database, and when would you use one?', level: 'intermediate', short: 'A database that exists only in RAM, never written to a file, created with a special filename like ":memory:" — extremely fast, and automatically wiped when the process ends. A very common choice for automated tests, where you want a clean, fast, fully isolated database for each test run.', long: 'Using an in-memory database in tests avoids both the slowdown of disk I/O and any risk of test runs interfering with each other\'s leftover data, since each test process gets its own throwaway database.', lessons: ['sqlite/02-setup-nodejs'] },
      ],
    },
    {
      id: 'crud-transactions',
      title: 'CRUD and transactions',
      items: [
        { q: 'How would you insert many rows efficiently in SQLite, compared to inserting them one at a time?', level: 'advanced', short: 'Wrap the whole batch in a single transaction (BEGIN ... COMMIT) instead of letting each INSERT commit separately — SQLite has to sync to disk on every commit, so batching hundreds or thousands of inserts into one transaction can be dramatically faster than one transaction per row.', code: code('CREATE TABLE logs (id SERIAL PRIMARY KEY, message TEXT);', '', 'BEGIN;', "INSERT INTO logs (message) VALUES ('entry 1');", "INSERT INTO logs (message) VALUES ('entry 2');", "INSERT INTO logs (message) VALUES ('entry 3');", 'COMMIT;', '', 'SELECT COUNT(*) FROM logs;'), long: 'In better-sqlite3, db.transaction(fn) wraps a whole batch operation for exactly this reason, and is one of the first things people reach for once they notice bulk inserts are slower than expected.', lessons: ['sqlite/03-crud'] },
        { q: 'What does a transaction guarantee in SQLite, and why does that matter for a multi-step write?', level: 'intermediate', short: 'Everything inside BEGIN ... COMMIT either all takes effect or none of it does — if anything fails partway through and you ROLLBACK, the database is left exactly as it was before the transaction started, rather than half-updated.', code: code('CREATE TABLE accounts (id TEXT PRIMARY KEY, balance NUMERIC);', "INSERT INTO accounts VALUES ('a', 100), ('b', 50);", '', 'BEGIN;', "UPDATE accounts SET balance = balance - 20 WHERE id = 'a';", "UPDATE accounts SET balance = balance + 20 WHERE id = 'b';", 'COMMIT;', '', 'SELECT * FROM accounts;'), lessons: ['sqlite/03-crud'] },
      ],
    },
    {
      id: 'relationships',
      title: 'Relationships and foreign keys',
      items: [
        { q: 'Does SQLite enforce foreign key constraints by default?', level: 'intermediate', short: 'No — foreign key enforcement is off by default for every new connection, for historical compatibility reasons, and must be explicitly enabled per connection with PRAGMA foreign_keys = ON. Without it, SQLite will silently allow a row that references a non-existent parent row.', long: 'This surprises a lot of people coming from PostgreSQL or MySQL, where foreign keys are enforced by default. It is one of the most commonly forgotten SQLite-specific setup steps, and worth checking for explicitly if a "foreign key" constraint does not seem to be doing anything.', lessons: ['sqlite/04-relationships'] },
        { q: 'How would you model a one-to-many relationship in SQLite?', level: 'beginner', short: 'The same way as in any relational database — the "many" side table has a foreign key column referencing the "one" side\'s primary key, exactly like a real PostgreSQL or MySQL one-to-many relationship.', code: code('CREATE TABLE authors (id SERIAL PRIMARY KEY, name TEXT);', 'CREATE TABLE books (id SERIAL PRIMARY KEY, author_id INTEGER REFERENCES authors(id), title TEXT);', '', "INSERT INTO authors (name) VALUES ('Ada Lovelace');", "INSERT INTO books (author_id, title) VALUES (1, 'Notes on the Analytical Engine');", '', 'SELECT b.title, a.name FROM books b JOIN authors a ON a.id = b.author_id;'), lessons: ['sqlite/04-relationships'] },
        { q: 'How would you model a many-to-many relationship in SQLite?', level: 'intermediate', short: 'With a join table (sometimes called a junction or pivot table) that has a foreign key to each side — the same pattern used in any relational database, since SQLite has no different or special construct for many-to-many relationships.', code: code('CREATE TABLE students (id SERIAL PRIMARY KEY, name TEXT);', 'CREATE TABLE courses (id SERIAL PRIMARY KEY, title TEXT);', 'CREATE TABLE enrollments (student_id INTEGER REFERENCES students(id), course_id INTEGER REFERENCES courses(id), PRIMARY KEY (student_id, course_id));'), lessons: ['sqlite/04-relationships'] },
      ],
    },
    {
      id: 'concurrency',
      title: 'Concurrency and production use',
      items: [
        { q: "What is SQLite's concurrency model?", level: 'advanced', short: 'Many connections can read at the same time, but only one connection can write at a time — a writer takes a lock on the whole database file for the duration of its write, and other writers must wait.', long: 'This is the single biggest architectural tradeoff of an embedded, file-based database compared to a client-server one: PostgreSQL and MySQL are built from the ground up to handle many concurrent writers efficiently; SQLite genuinely is not, by design.', lessons: ['sqlite/05-comparison'] },
        { q: 'What is WAL (write-ahead logging) mode, and how does it help?', level: 'advanced', short: 'An alternative journaling mode where writes are appended to a separate log file first, and readers can keep reading the main database file without being blocked by an in-progress write — significantly improving read/write concurrency compared to SQLite\'s older default rollback-journal mode.', long: 'WAL mode does not remove the "one writer at a time" limitation, but it does let readers proceed without waiting on a writer, which is often the concurrency improvement that actually matters for a typical read-heavy application.' },
        { q: 'Can SQLite handle real production web traffic?', level: 'advanced', short: 'For many small-to-medium sites and internal tools, yes, especially in WAL mode with mostly-read traffic. It becomes a genuinely poor fit once an application needs many concurrent writers, multiple application servers sharing one database over a network, or built-in replication.', long: 'A useful mental model: SQLite\'s ceiling is much higher than its reputation suggests for read-heavy workloads, but its write concurrency ceiling is fundamentally lower than a real client-server database\'s, by design — the question is always which one your actual traffic pattern needs.', lessons: ['sqlite/05-comparison'] },
        { q: 'What are the concrete signals that a project should migrate from SQLite to PostgreSQL or MySQL?', level: 'advanced', short: 'Needing multiple application servers to share one database over a network, high concurrent write volume that starts causing "database is locked" errors, needing built-in replication or high availability, or needing advanced features SQLite lacks (like rich native JSON querying, stored procedures across connections, or fine-grained user permissions).', lessons: ['sqlite/05-comparison'] },
      ],
    },
    {
      id: 'cli-pragma',
      title: 'The CLI and PRAGMA settings',
      items: [
        { q: 'What is a PRAGMA statement in SQLite?', level: 'intermediate', short: 'A SQLite-specific command for querying or modifying internal configuration and behavior of the database connection — there is no direct equivalent in standard SQL. PRAGMA foreign_keys = ON and PRAGMA journal_mode = WAL are two of the most commonly used.', long: 'PRAGMA settings are typically per-connection, not permanently stored with the database file (with a few exceptions like journal_mode) — which is exactly why foreign key enforcement needs to be turned on every time a new connection is opened, not just once ever.' },
        { q: 'What do the sqlite3 CLI\'s "dot commands" do, and how are they different from SQL?', level: 'intermediate', short: 'Dot commands (like .tables, .schema, .quit) are commands specific to the sqlite3 command-line tool itself, not SQL — they configure the CLI session or inspect the database structure, and would not work if sent through a database driver\'s query method the way real SQL statements would.', long: '.tables lists every table, .schema tablename shows the exact CREATE TABLE statement used to build a table (useful for checking exactly what constraints and types actually exist), and .headers on/.mode column make query output much more readable in the terminal.' },
      ],
    },
  ],
  tips: [
    'Be ready to explain SQLite\'s embedded, single-file architecture clearly, and connect it directly to why its concurrency model is different from a client-server database — this is the core idea nearly every SQLite question circles back to.',
    'Know that foreign keys are not enforced by default, and be able to say exactly how to turn that on.',
    'Understand why better-sqlite3\'s synchronous API is often the more practical choice, despite Node.js\'s usual async-first philosophy.',
    'Be able to list concrete, specific signals for when to migrate off SQLite, not just a vague "when it gets big."',
    'Know what WAL mode changes about concurrency, and what it does not change (still one writer at a time).',
  ],
  more: [
    { label: 'SQLite cheat sheet', href: '/sqlite-cheatsheet' },
    { label: 'SQL interview questions', href: '/sql-interview-questions' },
    { label: 'PostgreSQL interview questions', href: '/postgresql-interview-questions' },
    { label: 'SQLite lessons', href: '/learn/sqlite' },
    { label: 'Backend developer roadmap', href: '/roadmaps/backend' },
  ],
};
