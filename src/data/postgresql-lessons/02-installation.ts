import type { PostgresqlLesson } from '../postgresql-curriculum';

export const lesson02: PostgresqlLesson = {
  id: 'postgresql-02',
  title: 'Installing PostgreSQL',
  slug: '02-installation',
  chapter: 'intro',
  order: 2,
  difficulty: 'beginner',
  readingTime: 15,
  description: 'Learn how to install PostgreSQL on different platforms, use pgAdmin for GUI management, and master the psql command-line interface.',
  sections: [
    {
      type: 'text',
      content: 'PostgreSQL can be installed on Windows, macOS, and Linux. This lesson covers installation methods and introduces the tools you will use to interact with PostgreSQL databases.'
    },
    {
      type: 'heading',
      content: 'Installation on Windows'
    },
    {
      type: 'list',
      title: 'Steps to install on Windows:',
      items: [
        'Download the installer from postgresql.org/download/windows/',
        'Run the installer and follow the setup wizard',
        'Choose installation directory (default: C:\\Program Files\\PostgreSQL\\16)',
        'Select components: PostgreSQL Server, pgAdmin 4, Command Line Tools',
        'Set a password for the postgres superuser (remember this!)',
        'Choose port (default: 5432)',
        'Select locale (default: English)',
        'Complete the installation'
      ]
    },
    {
      type: 'note',
      title: 'Superuser Password',
      content: 'The postgres user is the default superuser with all privileges. Keep this password secure as it grants full access to all databases.'
    },
    {
      type: 'heading',
      content: 'Installation on macOS'
    },
    {
      type: 'example',
      title: 'Using Homebrew (Recommended)',
      content: 'Install PostgreSQL using the Homebrew package manager:',
      code: `# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install PostgreSQL
brew install postgresql@16

# Start PostgreSQL service
brew services start postgresql@16

# Verify installation
psql --version`,
      language: 'bash',
      output: 'psql (PostgreSQL) 16.1'
    },
    {
      type: 'heading',
      content: 'Installation on Linux (Ubuntu/Debian)'
    },
    {
      type: 'example',
      title: 'Using apt Package Manager',
      content: 'Install on Ubuntu or Debian-based systems:',
      code: `# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Check status
sudo systemctl status postgresql

# Start PostgreSQL (if not running)
sudo systemctl start postgresql

# Enable auto-start on boot
sudo systemctl enable postgresql`,
      language: 'bash',
      output: 'postgresql.service - PostgreSQL RDBMS\\n   Active: active (running)'
    },
    {
      type: 'heading',
      content: 'Connecting with psql'
    },
    {
      type: 'text',
      content: 'psql is the command-line interface for PostgreSQL. It allows you to execute SQL queries, manage databases, and perform administrative tasks.'
    },
    {
      type: 'example',
      title: 'Basic psql Connection',
      content: 'Connect to PostgreSQL using psql:',
      code: `# Connect as postgres user (default superuser)
psql -U postgres

# Connect to a specific database
psql -U postgres -d myapp

# Connect to remote host
psql -h localhost -p 5432 -U postgres -d myapp

# On Linux, switch to postgres user first
sudo -u postgres psql`,
      language: 'bash'
    },
    {
      type: 'heading',
      content: 'Essential psql Commands'
    },
    {
      type: 'table',
      title: 'Common psql Meta-Commands',
      headers: ['Command', 'Description', 'Example'],
      rows: [
        ['\\l', 'List all databases', '\\l'],
        ['\\c dbname', 'Connect to database', '\\c myapp'],
        ['\\dt', 'List tables in current database', '\\dt'],
        ['\\d tablename', 'Describe table structure', '\\d users'],
        ['\\du', 'List all users/roles', '\\du'],
        ['\\q', 'Quit psql', '\\q'],
        ['\\?', 'Show help for psql commands', '\\?'],
        ['\\h', 'Show SQL command help', '\\h SELECT']
      ]
    },
    {
      type: 'example',
      title: 'Creating Your First Database',
      content: 'Use psql to create and connect to a new database:',
      code: `-- Connect to PostgreSQL
psql -U postgres

-- Create a new database
CREATE DATABASE myapp;

-- List databases to verify
\\l

-- Connect to the new database
\\c myapp

-- Create a simple table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100)
);

-- Verify table creation
\\dt`,
      language: 'sql',
      output: 'CREATE DATABASE\\nYou are now connected to database "myapp"\\nCREATE TABLE'
    },
    {
      type: 'heading',
      content: 'pgAdmin - GUI Tool'
    },
    {
      type: 'text',
      content: 'pgAdmin is a feature-rich graphical administration tool for PostgreSQL. It provides a visual interface for database management, query execution, and server monitoring.'
    },
    {
      type: 'list',
      title: 'Key features of pgAdmin:',
      items: [
        'Visual query builder and SQL editor with syntax highlighting',
        'Database object browser (tables, views, functions)',
        'Data import/export tools',
        'Server monitoring and performance statistics',
        'User and privilege management',
        'Backup and restore utilities',
        'Query execution plans and performance analysis'
      ]
    },
    {
      type: 'note',
      title: 'First Time Setup',
      content: 'When you first open pgAdmin, you will need to set a master password. Then, add a server connection using localhost, port 5432, and your postgres user credentials.'
    },
    {
      type: 'heading',
      content: 'Environment Variables'
    },
    {
      type: 'text',
      content: 'PostgreSQL uses environment variables to configure connection defaults, making it easier to connect without specifying all parameters every time.'
    },
    {
      type: 'table',
      title: 'Important PostgreSQL Environment Variables',
      headers: ['Variable', 'Description', 'Example'],
      rows: [
        ['PGHOST', 'Database server host', 'localhost'],
        ['PGPORT', 'Database server port', '5432'],
        ['PGDATABASE', 'Default database name', 'myapp'],
        ['PGUSER', 'Default username', 'postgres'],
        ['PGPASSWORD', 'Password (not recommended for security)', 'yourpassword']
      ]
    },
    {
      type: 'warning',
      title: 'Security Warning',
      content: 'Never store passwords in environment variables in production. Use .pgpass file or connection strings with proper permissions instead.'
    },
    {
      type: 'heading',
      content: 'Verifying Your Installation'
    },
    {
      type: 'example',
      title: 'Quick Installation Test',
      content: 'Run these commands to verify PostgreSQL is working:',
      code: `-- Check PostgreSQL version
SELECT version();

-- Check current database
SELECT current_database();

-- Check current user
SELECT current_user;

-- Simple query test
SELECT 'Hello, PostgreSQL!' AS message;

-- Check server uptime
SELECT NOW() - pg_postmaster_start_time() AS uptime;`,
      language: 'sql',
      output: 'PostgreSQL 16.1 on x86_64-pc-linux-gnu\\nmyapp\\npostgres\\nHello, PostgreSQL!'
    },
    {
      type: 'tryit',
      title: 'Connection Simulator',
      js: `const output = document.getElementById('output');

let html = '<div style="padding:20px;font-family:monospace">';
html += '<h3 style="color:#336791;margin-bottom:16px">PostgreSQL Connection Test</h3>';

// Simulate connection steps
const steps = [
  { step: 'Connecting to PostgreSQL server...', status: 'success', time: 100 },
  { step: 'Authenticating user: postgres', status: 'success', time: 200 },
  { step: 'Connected to database: postgres', status: 'success', time: 300 },
  { step: 'Server version: PostgreSQL 16.1', status: 'info', time: 400 },
  { step: 'Ready for queries', status: 'success', time: 500 }
];

function displaySteps(index = 0) {
  if (index >= steps.length) {
    html += '<div style="margin-top:20px;padding:12px;background:#d4edda;border-left:4px solid #28a745;color:#155724">';
    html += '<strong>Connection Successful!</strong> You can now run SQL queries.</div>';
    
    // Add sample query
    html += '<div style="margin-top:20px;background:#f8f9fa;padding:15px;border:1px solid #dee2e6;border-radius:4px">';
    html += '<div style="color:#336791;font-weight:bold;margin-bottom:8px">myapp=# SELECT \\'Hello, PostgreSQL!\\' AS message;</div>';
    html += '<table style="width:100%;border-collapse:collapse;margin-top:10px">';
    html += '<thead><tr style="background:#336791;color:white"><th style="padding:8px;text-align:left">message</th></tr></thead>';
    html += '<tbody><tr><td style="padding:8px;border:1px solid #ddd">Hello, PostgreSQL!</td></tr></tbody>';
    html += '</table>';
    html += '<div style="margin-top:8px;color:#6c757d;font-size:12px">(1 row)</div>';
    html += '</div>';
    
    output.innerHTML = html + '</div>';
    return;
  }
  
  const item = steps[index];
  const colors = {
    success: '#28a745',
    info: '#336791',
    warning: '#ffc107'
  };
  
  setTimeout(() => {
    html += \`<div style="padding:8px;margin-bottom:4px;color:\${colors[item.status]}">\`;
    html += \`[\\u2713] \${item.step}</div>\`;
    output.innerHTML = html + '<div style="color:#6c757d">...</div></div>';
    displaySteps(index + 1);
  }, item.time);
}

displaySteps();`,
      css: ''
    },
    {
      type: 'tip',
      title: 'Practice Tip',
      content: 'Get comfortable with both psql and pgAdmin. Use psql for quick queries and scripts, and pgAdmin for visual exploration and complex administrative tasks.'
    }
  ],
  exercises: [
    {
      id: 'ex-2-1',
      question: 'What is the default port for PostgreSQL?',
      type: 'multiple-choice',
      options: ['3306', '5432', '27017', '8080'],
      correct: 1,
      explanation: 'PostgreSQL uses port 5432 by default. MySQL uses 3306, MongoDB uses 27017, and 8080 is commonly used for web servers.'
    },
    {
      id: 'ex-2-2',
      question: 'Which psql command lists all databases?',
      type: 'multiple-choice',
      options: ['\\dt', '\\l', '\\du', '\\db'],
      correct: 1,
      explanation: '\\l lists all databases. \\dt lists tables, \\du lists users, and \\db lists tablespaces.'
    },
    {
      id: 'ex-2-3',
      question: 'What is the name of the default PostgreSQL superuser?',
      type: 'multiple-choice',
      options: ['root', 'admin', 'postgres', 'superuser'],
      correct: 2,
      explanation: 'The default superuser is named "postgres". This user has all privileges and is created during installation.'
    }
  ],
  quiz: [
    {
      id: 'q-2-1',
      question: 'Which tool provides a graphical interface for PostgreSQL management?',
      options: ['psql', 'pgAdmin', 'mysql', 'mongo'],
      correct: 1,
      explanation: 'pgAdmin is the graphical administration tool for PostgreSQL, while psql is the command-line interface.'
    },
    {
      id: 'q-2-2',
      question: 'What command connects to a database named "myapp" in psql?',
      options: ['\\c myapp', 'USE myapp', 'CONNECT myapp', 'SELECT myapp'],
      correct: 0,
      explanation: '\\c myapp connects to the "myapp" database in psql. This is a psql meta-command, not SQL.'
    },
    {
      id: 'q-2-3',
      question: 'Why should you avoid using PGPASSWORD environment variable in production?',
      options: [
        'It makes connections slower',
        'It only works on Linux',
        'It is a security risk to store passwords in environment variables',
        'PostgreSQL does not support it'
      ],
      correct: 2,
      explanation: 'Storing passwords in environment variables is a security risk because they can be easily accessed by other processes. Use .pgpass file or secure connection strings instead.'
    }
  ]
};
