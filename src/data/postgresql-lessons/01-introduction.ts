import type { PostgresqlLesson } from '../postgresql-curriculum';

export const lesson01: PostgresqlLesson = {
  id: 'postgresql-01',
  title: 'Introduction to PostgreSQL',
  slug: '01-introduction',
  chapter: 'intro',
  order: 1,
  difficulty: 'beginner',
  readingTime: 12,
  description: 'Learn about PostgreSQL, relational databases, SQL vs NoSQL, and why PostgreSQL is a powerful choice for modern applications.',
  sections: [
    {
      type: 'text',
      content: 'PostgreSQL is a powerful, open-source object-relational database system with over 35 years of active development. It has earned a strong reputation for reliability, feature robustness, and performance.'
    },
    {
      type: 'heading',
      content: 'What is a Relational Database?'
    },
    {
      type: 'text',
      content: 'A relational database stores data in tables (relations) with rows and columns. Each row represents a record, and each column represents an attribute of that record.'
    },
    {
      type: 'analogy',
      title: 'Understanding Tables',
      content: 'Think of a relational database like an Excel spreadsheet. Each sheet is a table, each row is a record, and each column is a field. The difference is that databases can link multiple sheets together using relationships.'
    },
    {
      type: 'example',
      title: 'Simple Table Structure',
      content: 'Here is how a users table might look:',
      code: `-- Users Table
id  | name        | email              | age
----|-------------|--------------------|----- 
1   | Alice Smith | alice@example.com  | 28
2   | Bob Jones   | bob@example.com    | 34
3   | Carol Wang  | carol@example.com  | 22`,
      language: 'sql'
    },
    {
      type: 'heading',
      content: 'SQL vs NoSQL'
    },
    {
      type: 'table',
      title: 'Comparison of SQL and NoSQL Databases',
      headers: ['Feature', 'SQL (PostgreSQL)', 'NoSQL (MongoDB)'],
      rows: [
        ['Data Model', 'Tables with fixed schema', 'Documents with flexible schema'],
        ['Relationships', 'Strong support with JOINs', 'Manual references or embedding'],
        ['ACID Compliance', 'Full ACID guarantees', 'Eventual consistency (varies)'],
        ['Scalability', 'Vertical (scale up)', 'Horizontal (scale out)'],
        ['Query Language', 'SQL (standardized)', 'Custom query APIs'],
        ['Use Cases', 'Complex queries, transactions', 'Rapid development, large scale']
      ]
    },
    {
      type: 'heading',
      content: 'Why Choose PostgreSQL?'
    },
    {
      type: 'list',
      title: 'Key advantages of PostgreSQL:',
      items: [
        'ACID Compliance: Ensures data integrity with transactions',
        'Advanced Features: Supports JSON, arrays, full-text search, and more',
        'Extensibility: Add custom functions, data types, and operators',
        'Standards Compliant: Follows SQL standards closely',
        'Open Source: Free to use with active community support',
        'Performance: Efficient indexing and query optimization',
        'Reliability: Battle-tested in production for decades'
      ]
    },
    {
      type: 'heading',
      content: 'PostgreSQL Architecture'
    },
    {
      type: 'text',
      content: 'PostgreSQL uses a client-server model. The server process manages the database files, accepts connections from client applications, and performs database operations on behalf of clients.'
    },
    {
      type: 'note',
      title: 'Key Components',
      content: 'PostgreSQL consists of: (1) Server process that manages database files, (2) Client applications that communicate with the server, (3) System catalog that stores metadata, and (4) Storage engine that handles data persistence.'
    },
    {
      type: 'heading',
      content: 'Basic Database Concepts'
    },
    {
      type: 'list',
      title: 'Essential terminology:',
      items: [
        'Database: A collection of related tables and objects',
        'Table: A collection of rows with the same structure',
        'Row (Record): A single entry in a table',
        'Column (Field): An attribute of a table',
        'Schema: A namespace that contains database objects',
        'Primary Key: A unique identifier for each row',
        'Foreign Key: A reference to a primary key in another table'
      ]
    },
    {
      type: 'example',
      title: 'Database Hierarchy',
      content: 'Understanding the structure from top to bottom:',
      code: `PostgreSQL Server
  |-- Database: myapp
      |-- Schema: public (default)
          |-- Table: users
          |-- Table: products
          |-- Table: orders
      |-- Schema: analytics
          |-- Table: events
          |-- Table: metrics`,
      language: 'plaintext'
    },
    {
      type: 'heading',
      content: 'ACID Properties'
    },
    {
      type: 'text',
      content: 'PostgreSQL guarantees ACID properties for all transactions, ensuring data reliability and consistency.'
    },
    {
      type: 'table',
      title: 'ACID Explained',
      headers: ['Property', 'Description', 'Example'],
      rows: [
        ['Atomicity', 'All or nothing - transactions complete fully or not at all', 'Bank transfer: both debit and credit must succeed'],
        ['Consistency', 'Data moves from one valid state to another', 'Constraints are always enforced'],
        ['Isolation', 'Concurrent transactions do not interfere', 'Two users updating different rows independently'],
        ['Durability', 'Committed data is permanently saved', 'Data survives system crashes']
      ]
    },
    {
      type: 'tip',
      title: 'When to Use PostgreSQL',
      content: 'Choose PostgreSQL when you need complex queries, strong data integrity, relationships between data, transactions, or when building financial, analytics, or enterprise applications.'
    },
    {
      type: 'tryit',
      title: 'Database Concept Visualization',
      js: `// Simulate a simple database table
const users = [
  { id: 1, name: 'Alice Smith', email: 'alice@example.com', age: 28 },
  { id: 2, name: 'Bob Jones', email: 'bob@example.com', age: 34 },
  { id: 3, name: 'Carol Wang', email: 'carol@example.com', age: 22 }
];

const output = document.getElementById('output');

// Display as a table
let html = '<div style="padding:20px"><h3 style="color:#336791;margin-bottom:16px">Users Table</h3>';
html += '<table style="width:100%;border-collapse:collapse;font-family:monospace;font-size:13px">';
html += '<thead><tr style="background:#336791;color:white">';
html += '<th style="padding:10px;text-align:left;border:1px solid #ddd">ID</th>';
html += '<th style="padding:10px;text-align:left;border:1px solid #ddd">Name</th>';
html += '<th style="padding:10px;text-align:left;border:1px solid #ddd">Email</th>';
html += '<th style="padding:10px;text-align:left;border:1px solid #ddd">Age</th>';
html += '</tr></thead><tbody>';

users.forEach((user, i) => {
  const bg = i % 2 === 0 ? '#f8f9fa' : 'white';
  html += \`<tr style="background:\${bg}">
    <td style="padding:10px;border:1px solid #ddd">\${user.id}</td>
    <td style="padding:10px;border:1px solid #ddd">\${user.name}</td>
    <td style="padding:10px;border:1px solid #ddd">\${user.email}</td>
    <td style="padding:10px;border:1px solid #ddd">\${user.age}</td>
  </tr>\`;
});

html += '</tbody></table>';
html += '<div style="margin-top:20px;padding:12px;background:#e8f4f8;border-left:4px solid #336791;color:#336791">';
html += '<strong>Total Records:</strong> ' + users.length + '</div></div>';

output.innerHTML = html;`,
      css: ''
    },
    {
      type: 'warning',
      title: 'Learning Path',
      content: 'PostgreSQL has a learning curve, especially for complex queries and performance optimization. Start with basic SQL operations before moving to advanced features.'
    }
  ],
  exercises: [
    {
      id: 'ex-1-1',
      question: 'What does ACID stand for in database terminology?',
      type: 'multiple-choice',
      options: [
        'Atomicity, Consistency, Isolation, Durability',
        'Addition, Creation, Insertion, Deletion',
        'Application, Computing, Integration, Deployment',
        'Asynchronous, Concurrent, Independent, Distributed'
      ],
      correct: 0,
      explanation: 'ACID stands for Atomicity, Consistency, Isolation, and Durability - the four key properties that guarantee reliable database transactions.'
    },
    {
      id: 'ex-1-2',
      question: 'Which statement best describes a relational database?',
      type: 'multiple-choice',
      options: [
        'Data is stored in unstructured documents',
        'Data is stored in tables with rows and columns',
        'Data is stored in key-value pairs only',
        'Data is stored in graph nodes and edges'
      ],
      correct: 1,
      explanation: 'Relational databases like PostgreSQL store data in tables with rows (records) and columns (fields), with relationships between tables.'
    },
    {
      id: 'ex-1-3',
      question: 'What is a primary advantage of PostgreSQL over NoSQL databases?',
      type: 'multiple-choice',
      options: [
        'Faster horizontal scaling',
        'No need for schema definition',
        'Strong ACID guarantees and complex query support',
        'Better for storing unstructured data'
      ],
      correct: 2,
      explanation: 'PostgreSQL provides strong ACID guarantees and excellent support for complex queries with JOINs, making it ideal for applications requiring data integrity and complex relationships.'
    }
  ],
  quiz: [
    {
      id: 'q-1-1',
      question: 'What is the smallest unit of data in a PostgreSQL table?',
      options: ['Database', 'Table', 'Row', 'Cell (intersection of row and column)'],
      correct: 3,
      explanation: 'A cell, which is the intersection of a row and column, is the smallest unit of data. It holds a single value for a specific field in a specific record.'
    },
    {
      id: 'q-1-2',
      question: 'Which property ensures that committed transactions survive system failures?',
      options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
      correct: 3,
      explanation: 'Durability ensures that once a transaction is committed, the changes are permanently saved and will survive system crashes or power failures.'
    },
    {
      id: 'q-1-3',
      question: 'What does a foreign key establish in PostgreSQL?',
      options: [
        'A unique identifier for rows',
        'A relationship between two tables',
        'An index for faster queries',
        'A default value for a column'
      ],
      correct: 1,
      explanation: 'A foreign key establishes a relationship between two tables by referencing the primary key of another table, ensuring referential integrity.'
    }
  ]
};
