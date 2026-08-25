const fs = require('fs');
const path = require('path');

// "Unexpected string" at position 41 means a string literal appears where it shouldn't
// This happens when you have: 'text' 'text' (two string literals next to each other)
// or when a string contains an unescaped single quote that ends it early
// then the next word is seen as an identifier

// The pattern we need to find in single-quoted JS strings inside template literals:
// - Unescaped single quotes: word's or it's etc
// - Two string literals adjacent: 'foo' 'bar'

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const issues = [];

  lines.forEach((line, i) => {
    // Look for single-quoted strings that may have problems
    // Pattern: unescaped apostrophe inside a JS string that is itself in single quotes
    // e.g.: output: 'it's broken'  <- the 's breaks it
    if (!line.includes('`')) {
      // Check for patterns like: 'word's or "word's inside single quoted strings
      // Simplified: look for \w'\w not preceded by backslash
      const matches = line.match(/[^\\]'\w/g);
      if (matches && line.includes("'")) {
        // More specific: if we see a pattern like text 's text after a string open
        if (/(?<![\\])'\s*'/.test(line) || /\w'\w/.test(line)) {
          issues.push(`Line ${i+1}: ${line.substring(0, 120)}`);
        }
      }
    }

    // Also look for adjacent string literals: 'foo' 'bar' or 'foo'"bar"
    if (/'[^']*'\s+'[^']*'/.test(line) || /'[^']*'[^,\)\];+\n]/.test(line)) {
      if (!line.trim().startsWith('//') && !line.includes('`')) {
        // This could be two strings adjacent
      }
    }
  });
  return issues;
}

// More targeted: look for the specific error pattern
// "Unexpected string" at col 41 in a blob iframe means the JS code has
// something like: output: 'Done\n(file contents printed after)'
// where \n becomes a real newline making the string span two lines

// Let's find ALL remaining \n in single-quoted strings
function scanForNewlines(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const issues = [];
  lines.forEach((line, i) => {
    if (line.includes('\\n') && line.includes("'") && !line.includes('`')) {
      issues.push(`Line ${i+1}: ${line.substring(0, 150)}`);
    }
  });
  return issues;
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  fs.readdirSync(dir).forEach(f => {
    const fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory()) results.push(...walkDir(fp));
    else if (f.endsWith('.ts')) results.push(fp);
  });
  return results;
}

const allDirs = [
  'src/data/nextjs-lessons', 'src/data/react-lessons',
  'src/data/nodejs-lessons', 'src/data/express-lessons',
  'src/data/ts-lessons', 'src/data/mongodb-lessons',
  'src/data/git-lessons', 'src/data/docker-lessons',
  'src/data/sql-lessons', 'src/data/sqlite-lessons',
  'src/data/redis-lessons', 'src/data/restapi-lessons',
  'src/data/postgresql-lessons', 'src/data/html-lessons',
  'src/data/css-lessons', 'src/data/js-lessons',
];

let total = 0;
allDirs.forEach(dir => {
  walkDir(dir).forEach(fp => {
    const issues = scanForNewlines(fp);
    if (issues.length > 0) {
      console.log(`\n${fp.replace('src/data/', '')}:`);
      issues.forEach(i => console.log('  ' + i));
      total += issues.length;
    }
  });
});
console.log(`\nTotal remaining \\n issues: ${total}`);
