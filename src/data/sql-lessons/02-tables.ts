import type { SqlLesson } from '../sql-curriculum';

export const lesson02: SqlLesson = {
  id: 'sql-02',
  title: 'Creating and Managing Tables',
  slug: '02-tables',
  chapter: 'basics',
  order: 2,
  difficulty: 'beginner',
  readingTime: 11,
  description: 'Learn how to create tables with proper data types and constraints, and modify them using ALTER TABLE.',
  sections: [
    {
      type: 'text',
      content: 'Tables are the foundation of every relational database. Before you can store data, you need to define the structure: what columns exist, what type of data each column holds, and what rules (constraints) the data must follow. Getting your table design right upfront saves significant pain later.'
    },
    {
      type: 'heading',
      content: 'CREATE TABLE Syntax'
    },
    {
      type: 'text',
      content: 'The CREATE TABLE statement defines a new table. You specify the table name followed by a comma-separated list of column definitions inside parentheses. Each column definition includes a name, a data type, and optional constraints.'
    },
    {
      type: 'text',
      content: 'Table and column names should be lowercase with underscores (snake_case) in most SQL conventions. Names are case-insensitive in most databases, but consistent casing prevents confusion. Avoid reserved SQL keywords as names — if you must use them, wrap the name in double quotes.'
    },
    {
      type: 'heading',
      content: 'SQL Data Types'
    },
    {
      type: 'text',
      content: 'Choosing the right data type for each column matters for storage efficiency, query performance, and data integrity. Each RDBMS has its own extended type system, but the core types are universal.'
    },
    {
      type: 'table',
      title: 'Essential SQL Data Types',
      headers: ['Type', 'Category', 'Description', 'Example Values'],
      rows: [
        ['INTEGER / INT', 'Numeric', 'Whole numbers, typically 4 bytes', '1, 42, -7, 1000000'],
        ['BIGINT', 'Numeric', 'Large whole numbers, 8 bytes', 'Unix timestamps, large IDs'],
        ['DECIMAL(p,s)', 'Numeric', 'Exact decimal with precision and scale', 'DECIMAL(10,2) for money'],
        ['FLOAT / REAL', 'Numeric', 'Approximate floating-point number', '3.14, 2.718'],
        ['VARCHAR(n)', 'Text', 'Variable-length string, max n chars', 'VARCHAR(255) for emails'],
        ['TEXT', 'Text', 'Unlimited-length string', 'Blog posts, descriptions'],
        ['CHAR(n)', 'Text', 'Fixed-length string, padded with spaces', 'CHAR(2) for country codes'],
        ['BOOLEAN', 'Boolean', 'True or false value', 'true, false, 1, 0'],
        ['DATE', 'Date/Time', 'Calendar date, no time', '2024-08-20'],
        ['TIMESTAMP', 'Date/Time', 'Date and time', '2024-08-20 14:30:00'],
        ['UUID', 'Special', 'Universally unique identifier', '550e8400-e29b-41d4-a716-...'],
        ['JSON / JSONB', 'Special', 'JSON document (JSONB is binary in PostgreSQL)', '{"key": "value"}']
      ]
    },
    {
      type: 'note',
      title: 'Use DECIMAL for Money',
      content: 'Never use FLOAT or REAL for monetary values. Floating-point arithmetic has rounding errors that compound over many calculations. Always use DECIMAL(10,2) or NUMERIC(10,2) for currency to ensure exact arithmetic.'
    },
    {
      type: 'heading',
      content: 'Column Constraints'
    },
    {
      type: 'text',
      content: 'Constraints are rules enforced by the database on column values. They protect data integrity at the storage level, so even if your application has bugs, the database will reject invalid data.'
    },
    {
      type: 'list',
      title: 'The main column constraints:',
      items: [
        'NOT NULL: the column must always have a value; NULL is not allowed',
        'PRIMARY KEY: uniquely identifies each row; implies NOT NULL and UNIQUE',
        'UNIQUE: no two rows can have the same value in this column (NULLs may be allowed)',
        'DEFAULT value: if no value is provided on INSERT, use this default',
        'CHECK (condition): reject any value where the condition is false',
        'REFERENCES table(col): foreign key — value must exist in another table',
        'SERIAL / AUTO_INCREMENT: automatically generate an incrementing integer ID'
      ]
    },
    {
      type: 'example',
      title: 'CREATE TABLE with Constraints',
      content: 'This creates a users table with common constraints including primary key, unique email, NOT NULL fields, a default value, and a CHECK constraint.',
      code: `CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  email      VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name  VARCHAR(100) NOT NULL,
  age        INTEGER CHECK (age >= 0 AND age <= 150),
  plan       VARCHAR(20)  NOT NULL DEFAULT 'free',
  is_active  BOOLEAN      NOT NULL DEFAULT true,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);`,
      language: 'sql'
    },
    {
      type: 'heading',
      content: 'NULL vs NOT NULL'
    },
    {
      type: 'text',
      content: 'NULL represents the absence of a value — it is not zero, not an empty string, it is "unknown" or "not applicable". SQL handles NULL specially: NULL compared to anything (even itself) returns NULL, not true or false. This trips up many developers.'
    },
    {
      type: 'text',
      content: 'As a general rule, mark columns NOT NULL unless you genuinely need to represent "unknown" or "not applicable". Having many nullable columns makes queries more complex and error-prone. If a field is always required (like email), make it NOT NULL.'
    },
    {
      type: 'warning',
      title: 'NULL Is Not Zero or Empty',
      content: 'The expression NULL = NULL evaluates to NULL (not true). To check for NULL, always use IS NULL or IS NOT NULL — never use = NULL. This is one of the most common SQL mistakes beginners make.'
    },
    {
      type: 'heading',
      content: 'ALTER TABLE'
    },
    {
      type: 'text',
      content: 'After a table is created, you can modify its structure using ALTER TABLE. You can add new columns, drop existing columns, rename columns, change data types, or add and drop constraints. In production databases, ALTER TABLE on large tables requires care — some operations lock the table and can cause downtime.'
    },
    {
      type: 'example',
      title: 'ALTER TABLE Operations',
      content: 'Common ALTER TABLE operations: adding a column with a default, making a column NOT NULL, adding a unique constraint, and renaming a column.',
      code: `-- Add a new column with a default value
ALTER TABLE users ADD COLUMN bio TEXT;

-- Add a column that is required (add with default first, then alter)
ALTER TABLE users ADD COLUMN last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Add a unique constraint to an existing column
ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email);

-- Rename a column (PostgreSQL syntax)
ALTER TABLE users RENAME COLUMN first_name TO fname;

-- Change a column's data type
ALTER TABLE users ALTER COLUMN plan TYPE VARCHAR(50);

-- Drop a column
ALTER TABLE users DROP COLUMN bio;`,
      language: 'sql'
    },
    {
      type: 'heading',
      content: 'DROP TABLE'
    },
    {
      type: 'text',
      content: 'DROP TABLE permanently deletes a table and all its data. There is no undo. Use DROP TABLE IF EXISTS to avoid an error when the table does not exist. To remove just the data while keeping the structure, use TRUNCATE TABLE.'
    },
    {
      type: 'tip',
      title: 'Schema Migrations',
      content: 'In production applications, never run ALTER TABLE or DROP TABLE manually. Use a migration tool like Flyway, Liquibase, or Prisma Migrate. Migrations are version-controlled SQL scripts that can be applied and rolled back safely.'
    },
    {
      type: 'tryit',
      title: 'SQL Data Types Showcase',
      js: `const types = [
  { name: 'INTEGER', category: 'Numeric', example: '42', note: 'Whole numbers' },
  { name: 'DECIMAL(10,2)', category: 'Numeric', example: '19.99', note: 'Exact decimals (money)' },
  { name: 'FLOAT', category: 'Numeric', example: '3.14159', note: 'Approx. floating point' },
  { name: 'VARCHAR(255)', category: 'Text', example: '"alice@example.com"', note: 'Variable-length string' },
  { name: 'TEXT', category: 'Text', example: '"Long content..."', note: 'Unlimited length' },
  { name: 'BOOLEAN', category: 'Boolean', example: 'true / false', note: 'Two-value flag' },
  { name: 'DATE', category: 'Date/Time', example: '2024-08-20', note: 'Date only, no time' },
  { name: 'TIMESTAMP', category: 'Date/Time', example: '2024-08-20 14:30:00', note: 'Date + time' },
  { name: 'UUID', category: 'Special', example: '550e8400-e29b...', note: 'Globally unique ID' },
  { name: 'JSONB', category: 'Special', example: '{"key":"val"}', note: 'Structured JSON (PG)' },
];

const colors = { Numeric: '#3b82f6', Text: '#10b981', Boolean: '#f59e0b', 'Date/Time': '#8b5cf6', Special: '#ef4444' };
let filter = 'All';

function render() {
  const cats = ['All', ...new Set(types.map(t => t.category))];
  document.getElementById('filters').innerHTML = cats.map(c =>
    \`<button onclick="setFilter('\${c}')" style="padding:5px 14px;border:none;border-radius:20px;cursor:pointer;font-size:12px;font-weight:600;margin-right:5px;margin-bottom:6px;background:\${c===filter?'#336791':'#e2e8f0'};color:\${c===filter?'white':'#4a5568'}">\${c}</button>\`
  ).join('');
  const filtered = filter === 'All' ? types : types.filter(t => t.category === filter);
  document.getElementById('grid').innerHTML = filtered.map(t =>
    \`<div style="background:white;border:1px solid #e2e8f0;border-radius:8px;padding:14px;border-left:4px solid \${colors[t.category]}">
      <div style="font-family:monospace;font-weight:700;font-size:14px;color:#1a202c">\${t.name}</div>
      <div style="font-size:11px;font-weight:600;color:\${colors[t.category]};margin:4px 0">\${t.category}</div>
      <div style="font-family:monospace;font-size:12px;color:#4a5568;background:#f7fafc;padding:4px 8px;border-radius:4px;margin:6px 0">\${t.example}</div>
      <div style="font-size:12px;color:#718096">\${t.note}</div>
    </div>\`
  ).join('');
}

window.setFilter = function(c) { filter = c; render(); };
render();`,
      css: `body { padding: 20px; font-family: system-ui, sans-serif; background: #f7fafc; }
h3 { color: #336791; margin: 0 0 6px 0; font-size: 15px; font-weight: 700; }
p { color: #718096; font-size: 13px; margin: 0 0 14px 0; }
#filters { margin-bottom: 12px; }
#grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; }`
    }
  ],
  exercises: [
    {
      id: 'ex-sql-2-1',
      question: 'Which data type should you use to store monetary values like 19.99?',
      type: 'multiple-choice',
      options: ['FLOAT', 'REAL', 'DECIMAL(10,2)', 'INTEGER'],
      correct: 2,
      explanation: 'DECIMAL (or NUMERIC) provides exact arithmetic with no floating-point rounding errors, making it the correct choice for money. FLOAT and REAL use approximate binary representation and will introduce rounding errors.'
    },
    {
      id: 'ex-sql-2-2',
      question: 'What does the NOT NULL constraint do?',
      type: 'multiple-choice',
      options: [
        'Prevents the column from being queried',
        'Ensures the column always has a value and cannot be NULL',
        'Automatically fills the column with a default value',
        'Makes the column a primary key'
      ],
      correct: 1,
      explanation: 'NOT NULL means the column must always have a value. Attempting to insert a row without providing a value for a NOT NULL column will result in an error.'
    },
    {
      id: 'ex-sql-2-3',
      question: 'Which SQL statement is used to add a new column to an existing table?',
      type: 'multiple-choice',
      options: ['CREATE COLUMN', 'INSERT COLUMN', 'ALTER TABLE ... ADD COLUMN', 'UPDATE TABLE ... ADD COLUMN'],
      correct: 2,
      explanation: 'ALTER TABLE followed by ADD COLUMN is the correct syntax for adding a new column to an existing table. The column definition follows the same rules as in CREATE TABLE.'
    }
  ],
  quiz: [
    {
      id: 'q-sql-2-1',
      question: 'What does SERIAL do in a column definition?',
      options: [
        'Creates a text column with serial numbers',
        'Auto-generates an incrementing integer value for each new row',
        'Creates a foreign key reference',
        'Encrypts the column data'
      ],
      correct: 1,
      explanation: 'SERIAL (in PostgreSQL) is shorthand for creating an auto-incrementing integer sequence. Each new row automatically gets the next integer value. MySQL uses AUTO_INCREMENT for the same purpose.'
    },
    {
      id: 'q-sql-2-2',
      question: 'What is the difference between VARCHAR(255) and TEXT?',
      options: [
        'VARCHAR stores numbers, TEXT stores strings',
        'VARCHAR has a configurable maximum length while TEXT is unlimited',
        'TEXT is faster than VARCHAR for all operations',
        'There is no difference — they are identical'
      ],
      correct: 1,
      explanation: 'VARCHAR(n) stores variable-length strings up to n characters. TEXT (or CLOB in some databases) stores strings of unlimited length. In practice, PostgreSQL treats them similarly in storage, but the explicit limit in VARCHAR can serve as a soft data validation.'
    },
    {
      id: 'q-sql-2-3',
      question: 'How do you permanently delete a table and all its data?',
      options: ['DELETE TABLE users', 'REMOVE TABLE users', 'DROP TABLE users', 'DESTROY TABLE users'],
      correct: 2,
      explanation: 'DROP TABLE permanently removes a table and all its data. This is irreversible. Use DROP TABLE IF EXISTS to avoid an error if the table does not already exist.'
    }
  ]
};
