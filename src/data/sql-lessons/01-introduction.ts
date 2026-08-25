import type { SqlLesson } from '../sql-curriculum';

export const lesson01: SqlLesson = {
  id: 'sql-01',
  title: 'Introduction to SQL and Relational Databases',
  slug: '01-introduction',
  chapter: 'basics',
  order: 1,
  difficulty: 'beginner',
  readingTime: 10,
  description: 'Understand what SQL is, how relational databases organize data, and when to choose SQL over other database types.',
  sections: [
    {
      type: 'text',
      content: 'SQL (Structured Query Language) is the standard language for communicating with relational databases. It is not a programming language in the traditional sense - it is a declarative query language, meaning you describe what data you want, not how to retrieve it. SQL has been around since the 1970s and remains the most important data skill a developer can have.'
    },
    {
      type: 'heading',
      content: 'What Is a Relational Database?'
    },
    {
      type: 'text',
      content: 'A relational database stores data in tables - structured grids with rows and columns, similar to a spreadsheet. Each table represents one type of entity (users, orders, products). The "relational" part refers to the relationships between tables: a user row can link to many order rows, and each order row can link to many product rows.'
    },
    {
      type: 'text',
      content: 'Every table has a defined schema: a set of column names and their data types. This structure enforces consistency - you cannot accidentally store a phone number in an email column. This discipline is one of the biggest advantages of relational databases over more flexible alternatives.'
    },
    {
      type: 'list',
      title: 'Core concepts in every relational database:',
      items: [
        'Table: a collection of related data organized in rows and columns',
        'Row (record): a single data entry - one user, one order, one product',
        'Column (field): a named attribute with a fixed data type - name, email, price',
        'Primary key: a column (or combination) that uniquely identifies each row',
        'Foreign key: a column that references the primary key of another table',
        'Schema: the complete definition of tables, columns, types, and constraints'
      ]
    },
    {
      type: 'heading',
      content: 'What Is an RDBMS?'
    },
    {
      type: 'text',
      content: 'An RDBMS (Relational Database Management System) is the software that implements relational database concepts and executes SQL queries. There are several popular RDBMS products, each with slightly different SQL dialects, but all support the core SQL standard.'
    },
    {
      type: 'table',
      title: 'Popular RDBMS Compared',
      headers: ['RDBMS', 'Open Source', 'Best For', 'Notes'],
      rows: [
        ['PostgreSQL', 'Yes', 'Production web apps, complex queries', 'Most standards-compliant, best feature set'],
        ['MySQL / MariaDB', 'Yes', 'Web apps, WordPress, general purpose', 'Extremely popular, wide hosting support'],
        ['SQLite', 'Yes', 'Embedded, mobile, testing, desktop apps', 'Serverless, single file, zero configuration'],
        ['SQL Server', 'No', 'Enterprise Microsoft ecosystems', 'Deep Windows and .NET integration'],
        ['Oracle Database', 'No', 'Large enterprise, financial systems', 'Feature-rich, expensive, complex licensing'],
        ['CockroachDB', 'Yes', 'Distributed, geo-replicated systems', 'Postgres-compatible, scales horizontally']
      ]
    },
    {
      type: 'heading',
      content: 'A Brief History of SQL'
    },
    {
      type: 'text',
      content: 'SQL originated from IBM research in the early 1970s. Edgar F. Codd published his landmark paper on the relational model in 1970, and IBM researchers Donald Chamberlin and Raymond Boyce developed SEQUEL (Structured English Query Language) in 1974. The name was shortened to SQL and the language was standardized by ANSI in 1986 and ISO in 1987. Despite being 50 years old, SQL remains the dominant query language for structured data.'
    },
    {
      type: 'heading',
      content: 'SQL vs NoSQL'
    },
    {
      type: 'text',
      content: 'NoSQL databases emerged in the 2000s to address specific scaling and flexibility challenges that relational databases struggled with. However, NoSQL is not a replacement for SQL - they solve different problems. Most production systems use both.'
    },
    {
      type: 'table',
      title: 'SQL vs NoSQL Comparison',
      headers: ['Factor', 'SQL (Relational)', 'NoSQL (Non-relational)'],
      rows: [
        ['Data structure', 'Tables with fixed schema', 'Documents, key-value, graphs, columns'],
        ['Schema', 'Enforced, defined upfront', 'Flexible, schema-on-read'],
        ['Relationships', 'JOINs across tables', 'Embedded documents or application-level'],
        ['Consistency', 'ACID transactions', 'Usually eventual consistency'],
        ['Scaling', 'Vertical + read replicas', 'Horizontal sharding'],
        ['Query language', 'Standardized SQL', 'Database-specific APIs'],
        ['Best for', 'Structured data, complex queries', 'Unstructured data, high write volume, caching']
      ]
    },
    {
      type: 'heading',
      content: 'ACID Properties'
    },
    {
      type: 'text',
      content: 'ACID is an acronym describing the four properties that guarantee database transactions are processed reliably. These properties are what make relational databases trustworthy for financial, medical, and business-critical data.'
    },
    {
      type: 'list',
      title: 'The four ACID properties:',
      items: [
        'Atomicity: a transaction is all-or-nothing. If any part fails, the entire transaction is rolled back. No half-written data.',
        'Consistency: a transaction brings the database from one valid state to another valid state. All constraints and rules are enforced.',
        'Isolation: concurrent transactions execute as if they were sequential. One transaction cannot see the uncommitted changes of another.',
        'Durability: once a transaction is committed, it persists even if the server crashes immediately after. Data is written to disk.'
      ]
    },
    {
      type: 'analogy',
      title: 'ACID as a Bank Transfer',
      content: 'When you transfer money between bank accounts, ACID ensures: the debit and credit both happen or neither does (atomicity), the total money in the system stays constant (consistency), your transfer does not interfere with simultaneous transfers (isolation), and after confirmation the transfer survives a server crash (durability).'
    },
    {
      type: 'heading',
      content: 'When to Choose SQL'
    },
    {
      type: 'list',
      title: 'SQL databases are the right choice when:',
      items: [
        'Your data has clear relationships between entities (users, orders, products)',
        'You need complex queries with filtering, aggregation, and joins',
        'Data integrity and consistency are critical (finance, healthcare, inventory)',
        'You need full ACID transaction support',
        'Your schema is relatively stable and well-defined',
        'You want a mature ecosystem with decades of tooling, documentation, and expertise'
      ]
    },
    {
      type: 'example',
      title: 'Your First SQL Query',
      content: 'A SELECT statement retrieves data from a table. This query reads all rows and columns from a users table.',
      code: `-- Retrieve all users
SELECT * FROM users;

-- Retrieve specific columns
SELECT first_name, email, created_at
FROM users
WHERE active = true
ORDER BY created_at DESC;`,
      language: 'sql'
    },
    {
      type: 'tip',
      title: 'SQL Is Declarative',
      content: 'You write what you want (SELECT name FROM users WHERE active = true) and the database engine figures out how to retrieve it efficiently. You do not write loops or iteration logic - that is the database\'s job.'
    },
    {
      type: 'tryit',
      title: 'Relational Database Visualizer',
      js: `// Initialize HTML structure
document.body.innerHTML = \`
  <div style="padding:20px;font-family:system-ui,sans-serif;background:#f7fafc">
    <h3 style="color:#336791;margin:0 0 6px 0;font-size:15px;font-weight:700">Database Tables</h3>
    <p style="color:#718096;font-size:13px;margin:0 0 16px 0">Click tabs to switch between tables and explore the relational structure</p>
    <div id="tabs"></div>
    <div id="table-area"></div>
    <div id="info" style="margin-top:10px"></div>
  </div>
\`;

const tables = {
  users: {
    columns: ['id', 'name', 'email', 'plan'],
    rows: [
      [1, 'Alice Chen', 'alice@example.com', 'pro'],
      [2, 'Bob Smith', 'bob@example.com', 'free'],
      [3, 'Carol Davis', 'carol@example.com', 'pro'],
    ]
  },
  orders: {
    columns: ['id', 'user_id', 'product', 'amount'],
    rows: [
      [101, 1, 'Pro Subscription', 29.99],
      [102, 1, 'Extra Storage', 9.99],
      [103, 3, 'Pro Subscription', 29.99],
    ]
  }
};

let activeTable = 'users';

function renderTable(name) {
  const t = tables[name];
  const headerHtml = t.columns.map(c =>
    \`<th style="background:#1a3347;color:white;padding:8px 12px;text-align:left;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em">\${c}</th>\`
  ).join('');
  const rowsHtml = t.rows.map((row, i) =>
    \`<tr style="background:\${i%2===0?'#fff':'#f8fafc'}">\${row.map(cell =>
      \`<td style="padding:8px 12px;font-size:13px;border-bottom:1px solid #e2e8f0;font-family:monospace">\${cell}</td>\`
    ).join('')}</tr>\`
  ).join('');
  return \`<table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden"><thead><tr>\${headerHtml}</tr></thead><tbody>\${rowsHtml}</tbody></table>\`;
}

function render() {
  document.getElementById('tabs').innerHTML = Object.keys(tables).map(name =>
    \`<button onclick="switchTab('\${name}')" style="padding:8px 18px;border:none;border-radius:6px;cursor:pointer;font-weight:600;font-size:13px;background:\${name===activeTable?'#336791':'#e2e8f0'};color:\${name===activeTable?'white':'#4a5568'};margin-right:6px">\${name}</button>\`
  ).join('');
  document.getElementById('table-area').innerHTML = renderTable(activeTable);
  const t = tables[activeTable];
  document.getElementById('info').innerHTML = \`<span style="font-size:12px;color:#718096">\${t.rows.length} rows &bull; \${t.columns.length} columns &bull; primary key: id</span>\`;
}

window.switchTab = function(name) { activeTable = name; render(); };
render();`,
      css: ``
    },
    {
      type: 'warning',
      title: 'SQL Dialect Differences',
      content: 'While the core SQL standard is consistent, each RDBMS has its own extensions and slight syntax differences. This tutorial focuses on standard SQL that works across PostgreSQL, MySQL, and SQLite, noting any major differences along the way.'
    }
  ],
  exercises: [
    {
      id: 'ex-sql-1-1',
      question: 'What does the "A" in ACID stand for?',
      type: 'multiple-choice',
      options: ['Authorization', 'Atomicity', 'Availability', 'Aggregation'],
      correct: 1,
      explanation: 'Atomicity means a transaction is all-or-nothing. Either all operations in the transaction succeed, or none of them are applied.'
    },
    {
      id: 'ex-sql-1-2',
      question: 'Which of these is NOT a relational database management system?',
      type: 'multiple-choice',
      options: ['PostgreSQL', 'MongoDB', 'SQLite', 'MySQL'],
      correct: 1,
      explanation: 'MongoDB is a NoSQL document database. PostgreSQL, SQLite, and MySQL are all relational databases that use SQL.'
    },
    {
      id: 'ex-sql-1-3',
      question: 'What distinguishes a relational database from other database types?',
      type: 'multiple-choice',
      options: [
        'It only stores numbers and text',
        'It stores data in tables with defined schemas and supports relationships between tables',
        'It runs faster than any other database',
        'It requires no query language'
      ],
      correct: 1,
      explanation: 'Relational databases organize data in tables with fixed schemas, enforce relationships between tables via foreign keys, and support SQL queries across those relationships.'
    }
  ],
  quiz: [
    {
      id: 'q-sql-1-1',
      question: 'What does SQL stand for?',
      options: ['Simple Query Language', 'Structured Query Language', 'Standard Question Logic', 'Sequential Query Loop'],
      correct: 1,
      explanation: 'SQL stands for Structured Query Language. It was originally called SEQUEL (Structured English Query Language) when developed at IBM in the 1970s.'
    },
    {
      id: 'q-sql-1-2',
      question: 'Which ACID property ensures committed data survives a server crash?',
      options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
      correct: 3,
      explanation: 'Durability guarantees that once a transaction is committed, it is permanently stored and will survive system failures like power loss or crashes.'
    },
    {
      id: 'q-sql-1-3',
      question: 'What is a primary key?',
      options: [
        'The first column in every table',
        'A column that uniquely identifies each row in a table',
        'The most important piece of data in a row',
        'A password for accessing the database'
      ],
      correct: 1,
      explanation: 'A primary key is a column (or set of columns) whose values uniquely identify each row in a table. No two rows can have the same primary key value, and it cannot be NULL.'
    }
  ]
};
