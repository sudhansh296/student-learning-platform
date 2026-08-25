const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const before = content;

  // The core problem: \n inside single-quoted JS strings inside template literals
  // becomes a REAL newline which breaks the string across two lines
  // The fix: replace ALL \n that appear inside single-quoted strings
  // with \\n so they stay as literal \n in the output

  // Strategy: process line by line
  // If a line has single quotes (not template literals) and contains \n
  // we need to escape it properly OR just remove the \n
  
  const lines = content.split('\n');
  const fixed = lines.map((line, i) => {
    // Skip template literal lines (contain backticks)
    if (line.includes('`')) return line;
    // Skip comment lines
    if (line.trim().startsWith('//')) return line;
    
    // If line has \n and single quotes, we need to escape the \n
    // Replace \n with a space (safe replacement that keeps content readable)
    if (line.includes('\\n') && line.includes("'")) {
      return line.replace(/\\n/g, ' ');
    }
    return line;
  });

  const result = fixed.join('\n');
  if (result !== before) {
    fs.writeFileSync(filePath, result, 'utf8');
    return true;
  }
  return false;
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

const dirs = [
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
dirs.forEach(dir => {
  walkDir(dir).forEach(fp => {
    if (fixFile(fp)) {
      total++;
      console.log('Fixed:', fp.replace('src/data/', ''));
    }
  });
});
console.log('\nTotal fixed:', total);
