import type { PostgresqlLesson } from '../postgresql-curriculum';

export const lesson03: PostgresqlLesson = {
  id: 'postgresql-03',
  title: 'Tables and Schema Design',
  slug: '03-tables-schema',
  chapter: 'crud',
  order: 3,
  difficulty: 'beginner',
  readingTime: 14,
  description: 'Learn how to design and create PostgreSQL tables with proper data types, constraints, and schema structure.',
  sections: [
    {
      type: 'text',
      content: 'A well-designed database schema is the foundation of any application. In PostgreSQL, you define tables with specific data types and constraints that ensure your data stays valid and consistent.'
    },
    {
      type: 'heading',
      content: 'CREATE TABLE Syntax'
    },
    {
      type: 'text',
      content: 'The CREATE TABLE statement defines a new table, its columns, data types, and constraints. Every column must have a name and a data type.'
    },
    {
      type: 'example',
      title: 'Basic CREATE TABLE',
      content: 'Creating a users table with common columns:',
      code: `CREATE TABLE users (
  id        SERIAL PRIMARY KEY,
  username  VARCHAR(50) NOT NULL UNIQUE,
  email     VARCHAR(255) NOT NULL UNIQUE,
  age       INTEGER CHECK (age >= 0 AND age <= 120),
  bio       TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  score     NUMERIC(10, 2) DEFAULT 0.00,
  joined_at TIMESTAMP DEFAULT NOW()
);`,
      language: 'sql',
      output: 'CREATE TABLE'
    },
    {
      type: 'heading',
      content: 'PostgreSQL Data Types'
    },
    {
      type: 'text',
      content: 'Choosing the right data type for each column is critical for performance, storage, and data integrity. PostgreSQL offers a rich set of built-in types.'
    },
    {
      type: 'table',
      title: 'Numeric Data Types',
      headers: ['Type', 'Storage', 'Range', 'Use Case'],
      rows: [
        ['SMALLINT', '2 bytes', '-32,768 to 32,767', 'Small counters, flags'],
        ['INTEGER / INT', '4 bytes', '-2.1B to 2.1B', 'General whole numbers'],
        ['BIGINT', '8 bytes', '-9.2 quintillion to 9.2 quintillion', 'Large IDs, counts'],
        ['SERIAL', '4 bytes', '1 to 2.1B', 'Auto-incrementing IDs'],
        ['BIGSERIAL', '8 bytes', '1 to 9.2 quintillion', 'Large auto-increment IDs'],
        ['NUMERIC(p,s)', 'Variable', 'Up to 131072 digits', 'Money, exact decimals'],
        ['REAL', '4 bytes', '6 decimal digits precision', 'Scientific data'],
        ['DOUBLE PRECISION', '8 bytes', '15 decimal digits precision', 'High-precision floats']
      ]
    },
    {
      type: 'table',
      title: 'Text and Character Types',
      headers: ['Type', 'Description', 'Use Case'],
      rows: [
        ['CHAR(n)', 'Fixed-length, blank-padded', 'Country codes, status flags'],
        ['VARCHAR(n)', 'Variable-length, max n chars', 'Names, usernames, emails'],
        ['TEXT', 'Unlimited length', 'Descriptions, blog posts, JSON strings']
      ]
    },
    {
      type: 'table',
      title: 'Date, Time, and Boolean Types',
      headers: ['Type', 'Storage', 'Format / Range', 'Use Case'],
      rows: [
        ['DATE', '4 bytes', 'YYYY-MM-DD', 'Birthdates, event dates'],
        ['TIME', '8 bytes', 'HH:MM:SS', 'Time of day only'],
        ['TIMESTAMP', '8 bytes', 'YYYY-MM-DD HH:MM:SS', 'Log entries, created_at'],
        ['TIMESTAMPTZ', '8 bytes', 'TIMESTAMP with timezone', 'Global apps, user events'],
        ['INTERVAL', '16 bytes', 'Duration of time', 'Scheduling, durations'],
        ['BOOLEAN', '1 byte', 'true / false', 'Flags, active/inactive']
      ]
    },
    {
      type: 'note',
      title: 'Use TIMESTAMPTZ for Production',
      content: 'Always use TIMESTAMPTZ (timestamp with time zone) in production apps. It stores timestamps in UTC and converts to the session timezone automatically, preventing timezone bugs.'
    },
    {
      type: 'heading',
      content: 'Constraints'
    },
    {
      type: 'text',
      content: 'Constraints are rules that the database enforces on column data. They prevent invalid data from ever entering your database.'
    },
    {
      type: 'list',
      title: 'Available constraints:',
      items: [
        'PRIMARY KEY -- uniquely identifies each row; implies NOT NULL and UNIQUE',
        'NOT NULL -- the column must always have a value',
        'UNIQUE -- no two rows can have the same value in this column',
        'DEFAULT value -- use this value when none is provided',
        'CHECK (condition) -- the value must pass a boolean expression',
        'FOREIGN KEY -- references a primary key in another table',
        'SERIAL / BIGSERIAL -- auto-incrementing integer (uses a sequence internally)'
      ]
    },
    {
      type: 'example',
      title: 'Table with Multiple Constraints',
      content: 'A products table with a full range of constraints:',
      code: `CREATE TABLE products (
  id          BIGSERIAL PRIMARY KEY,
  sku         VARCHAR(20) NOT NULL UNIQUE,
  name        VARCHAR(200) NOT NULL,
  description TEXT,
  price       NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  stock       INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category    VARCHAR(50) NOT NULL DEFAULT 'general',
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`,
      language: 'sql',
      output: 'CREATE TABLE'
    },
    {
      type: 'heading',
      content: 'Table-Level vs Column-Level Constraints'
    },
    {
      type: 'example',
      title: 'Composite Primary Key and Named Constraints',
      content: 'Defining constraints at the table level allows composite keys and named constraints:',
      code: `-- Composite primary key (table-level constraint)
CREATE TABLE order_items (
  order_id   INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity   INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL,
  PRIMARY KEY (order_id, product_id)
);

-- Named constraint for better error messages
CREATE TABLE accounts (
  id      SERIAL PRIMARY KEY,
  balance NUMERIC(12,2) NOT NULL DEFAULT 0,
  CONSTRAINT balance_non_negative CHECK (balance >= 0)
);`,
      language: 'sql',
      output: 'CREATE TABLE CREATE TABLE'
    },
    {
      type: 'heading',
      content: 'ALTER TABLE'
    },
    {
      type: 'text',
      content: 'ALTER TABLE lets you modify an existing table without recreating it. You can add/drop columns, rename things, and change constraints.'
    },
    {
      type: 'example',
      title: 'Common ALTER TABLE Operations',
      content: 'Modifying table structure after creation:',
      code: `-- Add a new column
ALTER TABLE users ADD COLUMN avatar_url TEXT;

-- Add column with constraint
ALTER TABLE users ADD COLUMN phone VARCHAR(20) UNIQUE;

-- Rename a column
ALTER TABLE users RENAME COLUMN bio TO about;

-- Change column type
ALTER TABLE users ALTER COLUMN age TYPE SMALLINT;

-- Set a default value
ALTER TABLE users ALTER COLUMN is_active SET DEFAULT true;

-- Drop a column
ALTER TABLE users DROP COLUMN avatar_url;

-- Add a constraint
ALTER TABLE products ADD CONSTRAINT price_positive CHECK (price > 0);

-- Drop a constraint
ALTER TABLE products DROP CONSTRAINT price_positive;

-- Rename the table
ALTER TABLE users RENAME TO app_users;`,
      language: 'sql',
      output: 'ALTER TABLE'
    },
    {
      type: 'warning',
      title: 'ALTER TABLE in Production',
      content: 'Adding columns is safe. Dropping columns or changing types on large tables can lock the table and cause downtime. Always test schema changes on a copy of production data first.'
    },
    {
      type: 'heading',
      content: 'DROP TABLE'
    },
    {
      type: 'example',
      title: 'DROP TABLE Safely',
      content: 'Removing tables with safety checks:',
      code: `-- Drop a table (error if it does not exist)
DROP TABLE users;

-- Drop only if it exists (safe)
DROP TABLE IF EXISTS temp_data;

-- Drop table and all dependent objects (views, foreign keys)
DROP TABLE users CASCADE;

-- Drop multiple tables at once
DROP TABLE IF EXISTS orders, order_items, products;`,
      language: 'sql',
      output: 'DROP TABLE'
    },
    {
      type: 'warning',
      title: 'DROP TABLE is Permanent',
      content: 'DROP TABLE permanently deletes the table and all its data. There is no undo. Always back up or use transactions in test environments.'
    },
    {
      type: 'tip',
      title: 'Schema Design Tips',
      content: 'Use lowercase_with_underscores for table and column names. Always add created_at and updated_at timestamps. Use BIGSERIAL for primary keys in tables expected to grow large. Keep table names singular (user, not users) or plural consistently across your project.'
    },
    {
      type: 'tryit',
      title: 'Data Types Showcase',
      js: `const output = document.getElementById('output');

const types = [
  { name: 'INTEGER', example: '42', desc: 'Whole numbers up to 2.1 billion', color: '#dbeafe', badge: '#1d4ed8' },
  { name: 'BIGINT', example: '9007199254740993', desc: 'Very large whole numbers', color: '#dbeafe', badge: '#1e40af' },
  { name: 'NUMERIC(10,2)', example: '19999.99', desc: 'Exact decimal numbers (money)', color: '#dcfce7', badge: '#15803d' },
  { name: 'REAL', example: '3.14159', desc: 'Floating-point (approx)', color: '#dcfce7', badge: '#166534' },
  { name: 'VARCHAR(50)', example: 'Hello World', desc: 'Variable-length text, max 50 chars', color: '#fef9c3', badge: '#a16207' },
  { name: 'TEXT', example: 'Long description...', desc: 'Unlimited-length text', color: '#fef9c3', badge: '#854d0e' },
  { name: 'BOOLEAN', example: 'true', desc: 'true or false', color: '#fce7f3', badge: '#9d174d' },
  { name: 'DATE', example: '2024-08-19', desc: 'Calendar date only', color: '#ede9fe', badge: '#7c3aed' },
  { name: 'TIMESTAMP', example: '2024-08-19 14:30:00', desc: 'Date and time without timezone', color: '#ede9fe', badge: '#6d28d9' },
  { name: 'TIMESTAMPTZ', example: '2024-08-19 14:30:00+00', desc: 'Date, time, and timezone (recommended)', color: '#ede9fe', badge: '#5b21b6' },
  { name: 'SERIAL', example: '1, 2, 3 ...', desc: 'Auto-incrementing integer', color: '#ffedd5', badge: '#c2410c' },
  { name: 'BIGSERIAL', example: '1, 2, 3 ...', desc: 'Auto-incrementing large integer', color: '#ffedd5', badge: '#9a3412' }
];

let html = '<div style="padding:20px;font-family:system-ui,sans-serif">';
html += '<h3 style="color:#336791;margin:0 0 4px">PostgreSQL Data Types</h3>';
html += '<p style="color:#64748b;font-size:13px;margin:0 0 16px">Common data types with example values</p>';
html += '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:13px">';
html += '<thead><tr style="background:#336791;color:white">';
['Data Type','Example Value','Description'].forEach(h => {
  html += \`<th style="padding:10px 14px;text-align:left;font-weight:700;letter-spacing:.03em">\${h}</th>\`;
});
html += '</tr></thead><tbody>';

types.forEach((t, i) => {
  html += \`<tr style="background:\${i%2===0?'#fff':'#f8fafc'}">\`;
  html += \`<td style="padding:10px 14px;border-bottom:1px solid #e2e8f0">
    <span style="background:\${t.badge};color:white;padding:2px 8px;border-radius:4px;font-family:monospace;font-size:12px;font-weight:600">\${t.name}</span>
  </td>\`;
  html += \`<td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;font-family:monospace;font-size:12px;color:#336791;font-weight:600">\${t.example}</td>\`;
  html += \`<td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;color:#475569">\${t.desc}</td>\`;
  html += '</tr>';
});

html += '</tbody></table></div>';
html += '<div style="margin-top:16px;padding:12px;background:#eff6ff;border-left:4px solid #336791;border-radius:0 6px 6px 0;color:#1e40af;font-size:13px">';
html += '<strong>Tip:</strong> Use NUMERIC for money, TIMESTAMPTZ for timestamps, TEXT for long strings, and SERIAL/BIGSERIAL for primary keys.';
html += '</div></div>';

output.innerHTML = html;`,
      css: ''
    }
  ],
  exercises: [
    {
      id: 'ex-03-1',
      question: 'Which data type should you use to store a product price accurately (e.g., $19.99)?',
      type: 'multiple-choice',
      options: ['REAL', 'DOUBLE PRECISION', 'NUMERIC(10,2)', 'FLOAT'],
      correct: 2,
      explanation: 'NUMERIC(10,2) stores exact decimal values and is ideal for money. REAL and DOUBLE PRECISION use floating-point arithmetic which can produce rounding errors with currency.'
    },
    {
      id: 'ex-03-2',
      question: 'What does the SERIAL data type do in PostgreSQL?',
      type: 'multiple-choice',
      options: [
        'Stores binary data as a series of bytes',
        'Creates an auto-incrementing integer column backed by a sequence',
        'Stores an ordered list of values',
        'Creates a column that serializes to JSON'
      ],
      correct: 1,
      explanation: 'SERIAL is shorthand for creating an INTEGER column with a DEFAULT that draws from an auto-incrementing sequence. It is the standard way to create auto-generated primary keys.'
    },
    {
      id: 'ex-03-3',
      question: 'Which ALTER TABLE statement correctly adds a NOT NULL column with a default to an existing table?',
      type: 'multiple-choice',
      options: [
        'ALTER TABLE users MODIFY COLUMN status VARCHAR(20) NOT NULL DEFAULT \'active\';',
        'ALTER TABLE users ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT \'active\';',
        'ALTER TABLE users INSERT COLUMN status VARCHAR(20) DEFAULT \'active\';',
        'MODIFY TABLE users ADD status VARCHAR(20) NOT NULL;'
      ],
      correct: 1,
      explanation: 'ALTER TABLE ... ADD COLUMN is the correct syntax. Including DEFAULT is important when adding a NOT NULL column to a table with existing rows, otherwise PostgreSQL would reject the operation.'
    }
  ],
  quiz: [
    {
      id: 'q-03-1',
      question: 'What is the difference between VARCHAR(100) and TEXT in PostgreSQL?',
      options: [
        'VARCHAR(100) is faster; TEXT is unlimited and slower',
        'In PostgreSQL, they have identical performance; VARCHAR(100) just enforces a max length',
        'TEXT supports unicode; VARCHAR does not',
        'VARCHAR is stored on disk; TEXT is stored in memory'
      ],
      correct: 1,
      explanation: 'Unlike some other databases, PostgreSQL stores VARCHAR and TEXT identically under the hood. The only practical difference is that VARCHAR(n) enforces a maximum length constraint.'
    },
    {
      id: 'q-03-2',
      question: 'Which constraint ensures a column always has a value?',
      options: ['UNIQUE', 'DEFAULT', 'NOT NULL', 'CHECK'],
      correct: 2,
      explanation: 'NOT NULL prevents a column from storing NULL (absence of value). It guarantees that every row has an actual value in that column.'
    },
    {
      id: 'q-03-3',
      question: 'What happens when you DROP TABLE users CASCADE?',
      options: [
        'It drops only the table structure, keeping the data',
        'It drops the table and all objects that depend on it, such as views and foreign keys',
        'It asks for confirmation before dropping',
        'It drops all tables in the database'
      ],
      correct: 1,
      explanation: 'CASCADE automatically drops all objects that depend on the table, such as foreign key constraints in other tables and views built on this table. Without CASCADE, DROP TABLE will fail if dependencies exist.'
    }
  ]
};
