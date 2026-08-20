import type { NodejsLesson } from '../nodejs-curriculum';

export const nodejsNpmLesson: NodejsLesson = {
  id: 'nodejs-npm',
  title: 'npm & Packages',
  slug: 'npm-packages',
  chapter: 'core',
  order: 3,
  difficulty: 'beginner',
  readingTime: 10,
  description: 'npm package manager, package.json, installing dependencies, scripts, and managing your project.',
  sections: [
    {
      type: 'text',
      content: 'npm (Node Package Manager) is the world\'s largest software registry with over 2 million packages. It comes bundled with Node.js and lets you install, share, and manage third-party code. Your project\'s configuration lives in package.json.',
    },
    {
      type: 'heading',
      content: 'package.json',
    },
    {
      type: 'text',
      content: 'package.json is the heart of every Node.js project. It tracks your project name, version, dependencies, scripts, and metadata. Create it with npm init or npm init -y (accepts all defaults).',
    },
    {
      type: 'example',
      title: 'A typical package.json',
      content: 'Shows the structure of a package.json file, including metadata, dependency lists, and the scripts section used to run common project commands.',
      language: 'javascript',
      code: `{
  "name": "my-api",
  "version": "1.0.0",
  "description": "A simple REST API",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest",
    "build": "tsc"
  },
  "dependencies": {
    "express": "^4.18.2",
    "dotenv": "^16.3.1",
    "mongoose": "^8.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}`,
    },
    {
      type: 'heading',
      content: 'Installing Packages',
    },
    {
      type: 'example',
      title: 'npm commands',
      content: 'Covers the most common npm CLI commands for creating a project, installing and removing packages, and checking for outdated or vulnerable dependencies.',
      language: 'bash',
      code: `# Initialize a new project
npm init -y

# Install a package (adds to dependencies)
npm install express
npm install express dotenv mongoose   # multiple at once

# Install a dev dependency (not needed in production)
npm install --save-dev nodemon jest

# Install globally (available system-wide as CLI tool)
npm install -g nodemon

# Install all dependencies from package.json
npm install

# Remove a package
npm uninstall express

# Update packages
npm update

# Check for outdated packages
npm outdated

# List installed packages
npm list

# View package info
npm info express`,
    },
    {
      type: 'note',
      title: 'dependencies vs devDependencies',
      content: 'Regular dependencies (express, mongoose) are needed to run the app. devDependencies (nodemon, jest, typescript) are only needed during development. Use --save-dev for dev tools. In production, you can run npm install --omit=dev to skip dev deps.',
    },
    {
      type: 'heading',
      content: 'npm Scripts',
    },
    {
      type: 'text',
      content: 'The scripts field in package.json lets you define shortcuts for common commands. Run them with npm run <script-name>. The special scripts "start" and "test" can be run without the "run" keyword.',
    },
    {
      type: 'example',
      title: 'Useful npm scripts patterns',
      content: 'Shows how to define scripts in package.json for common tasks like starting the server, running tests, linting, and seeding the database. Run custom scripts with npm run <name>.',
      language: 'javascript',
      code: `// package.json scripts
{
  "scripts": {
    "start": "node dist/index.js",
    "dev": "nodemon src/index.js --watch src",
    "build": "tsc --outDir dist",
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "lint": "eslint src/**/*.js",
    "format": "prettier --write src/**/*.js",
    "db:seed": "node scripts/seed.js",
    "docker:up": "docker-compose up -d"
  }
}

// Run them:
// npm start          (special - no "run" needed)
// npm test           (special - no "run" needed)
// npm run dev
// npm run build
// npm run db:seed`,
    },
    {
      type: 'tip',
      title: 'Use nodemon for development',
      content: 'nodemon automatically restarts your Node.js app when files change. Install it with: npm install --save-dev nodemon. Then use "dev": "nodemon index.js" in your scripts. Much better than manually stopping and restarting during development.',
    },
    {
      type: 'example',
      title: 'Using an installed package',
      content: 'Demonstrates requiring packages installed via npm, using chalk for colorful terminal output and lodash for utility functions like sorting and grouping arrays.',
      language: 'javascript',
      code: `// After: npm install chalk
const chalk = require('chalk');

// Colorful terminal output
console.log(chalk.green('Success! Server started'));
console.log(chalk.red('Error: Connection failed'));
console.log(chalk.blue.bold('Info: Processing 42 items'));

// After: npm install lodash
const _ = require('lodash');

const users = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
  { name: 'Charlie', age: 35 },
];

const sorted = _.sortBy(users, 'age');
// [{ name: 'Bob', age: 25 }, { name: 'Alice', age: 30 }, ...]

const byName = _.keyBy(users, 'name');
// { Alice: {...}, Bob: {...}, Charlie: {...} }`,
    },
    {
      type: 'tryit',
      title: 'npm Package Manager Simulator',
      css: `body{font-family:system-ui,sans-serif;padding:14px;margin:0;background:#f0fdf4;}
.terminal{background:#1a1a1a;border-radius:10px;overflow:hidden;margin-top:10px;}
.term-header{background:#2d2d2d;padding:8px 14px;display:flex;align-items:center;gap:6px;}
.dot{width:11px;height:11px;border-radius:50%;}
.term-body{padding:14px;font-family:monospace;font-size:13px;min-height:140px;}
.prompt{color:#339933;}
.success{color:#4ade80;display:block;margin:2px 0;}
.pkg{display:inline-block;background:#166534;color:#bbf7d0;padding:2px 8px;border-radius:4px;font-size:11px;margin:2px;font-family:monospace;}
.btn{border:none;border-radius:6px;padding:6px 12px;font-size:12px;cursor:pointer;margin:3px;font-weight:600;}
.btn-install{background:#339933;color:#fff;}
.btn-dev{background:#1d4ed8;color:#fff;}
.btn-info{background:#6b7280;color:#fff;}
.installed-box{background:#0f172a;border-radius:8px;padding:10px;margin-top:8px;}
.installed-title{color:#94a3b8;font-size:11px;margin-bottom:6px;}`,
      js: `var installed = { dependencies: [], devDependencies: [] };

var packages = {
  express: { version: '4.18.2', desc: 'Fast web framework', type: 'dep' },
  dotenv: { version: '16.3.1', desc: 'Load .env files', type: 'dep' },
  mongoose: { version: '8.0.0', desc: 'MongoDB object modeling', type: 'dep' },
  axios: { version: '1.6.2', desc: 'HTTP client', type: 'dep' },
  nodemon: { version: '3.0.2', desc: 'Auto-restart on changes', type: 'dev' },
  jest: { version: '29.7.0', desc: 'Testing framework', type: 'dev' },
  eslint: { version: '8.56.0', desc: 'Code linter', type: 'dev' }
};

var log = [];

function installPkg(name, isDev) {
  var p = packages[name];
  if (!p) { log.push({ txt: 'Package not found: ' + name, ok: false }); render(); return; }
  var list = isDev ? installed.devDependencies : installed.dependencies;
  if (list.includes(name)) { log.push({ txt: name + ' already installed', ok: false }); render(); return; }
  list.push(name);
  log.push({ txt: 'added ' + name + '@' + p.version + (isDev ? ' (dev)' : ''), ok: true });
  if (log.length > 6) log.shift();
  render();
}

function render() {
  var btnRow = Object.keys(packages).map(function(name) {
    var p = packages[name];
    var cls = p.type === 'dev' ? 'btn btn-dev' : 'btn btn-install';
    var prefix = p.type === 'dev' ? '--save-dev ' : '';
    return '<button class="btn ' + (p.type === 'dev' ? 'btn-dev' : 'btn-install') + '" data-pkg="' + name + '" data-dev="' + (p.type === 'dev' ? '1' : '0') + '" title="' + p.desc + '">npm install ' + prefix + name + '</button>';
  }).join('');

  var logLines = log.map(function(l) {
    return '<span class="success" style="color:' + (l.ok ? '#4ade80' : '#f87171') + '">' + (l.ok ? '+' : '!') + ' ' + l.txt + '</span>';
  }).join('');

  var deps = installed.dependencies.map(function(n) { return '<span class="pkg">' + n + '@' + packages[n].version + '</span>'; }).join('') || '<span style="color:#666;font-size:12px">none</span>';
  var devDeps = installed.devDependencies.map(function(n) { return '<span class="pkg" style="background:#1e3a8a;color:#bfdbfe">' + n + '@' + packages[n].version + '</span>'; }).join('') || '<span style="color:#666;font-size:12px">none</span>';

  document.getElementById('output').innerHTML =
    '<div style="margin-bottom:8px">' + btnRow + '</div>' +
    '<div class="terminal">' +
    '<div class="term-header"><div class="dot" style="background:#ff5f57"></div><div class="dot" style="background:#ffbd2e"></div><div class="dot" style="background:#28c840"></div></div>' +
    '<div class="term-body">' +
    (logLines || '<span style="color:#666">Click a button to install packages...</span>') +
    '</div></div>' +
    '<div class="installed-box">' +
    '<div class="installed-title">package.json dependencies:</div>' +
    '<div style="margin-bottom:6px">' + deps + '</div>' +
    '<div class="installed-title">devDependencies:</div>' +
    '<div>' + devDeps + '</div>' +
    '</div>';

  document.querySelectorAll('[data-pkg]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      installPkg(btn.getAttribute('data-pkg'), btn.getAttribute('data-dev') === '1');
    });
  });
}

render();`,
    },
  ],
  exercises: [
    {
      id: 'nodejs-npm-1',
      question: 'What is the difference between "dependencies" and "devDependencies" in package.json?',
      type: 'multiple-choice',
      options: [
        'There is no difference - they are both installed with npm install',
        'dependencies are needed to run the app; devDependencies are only needed during development',
        'devDependencies are faster to install than regular dependencies',
        'dependencies are installed globally; devDependencies are installed locally',
      ],
      correct: 1,
      explanation: 'dependencies are packages required to run the application (like express, mongoose). devDependencies are only needed during development (like nodemon, jest, eslint). In production, you can skip dev deps with npm install --omit=dev.',
    },
    {
      id: 'nodejs-npm-2',
      question: 'How do you run a custom script named "migrate" defined in package.json?',
      type: 'multiple-choice',
      options: [
        'node migrate',
        'npm migrate',
        'npm run migrate',
        'npx migrate',
      ],
      correct: 2,
      explanation: 'Custom scripts in package.json are run with "npm run <script-name>". Only the built-in scripts "start" and "test" can be run without the "run" keyword (npm start, npm test).',
    },
  ],
  quiz: [
    {
      id: 'nodejs-npm-q1',
      question: 'What does the "^" symbol mean in a version like "^4.18.2" in package.json?',
      options: [
        'Install exactly version 4.18.2 - no other versions',
        'Install the latest version available, ignoring the number',
        'Install any compatible version with the same major version (4.x.x)',
        'Install any version higher than 4.18.2',
      ],
      correct: 2,
      explanation: '"^4.18.2" means compatible with 4.18.2 - npm can install any version from 4.18.2 up to (but not including) 5.0.0. The major version (4) must match. Use an exact version (no ^) in package-lock.json for reproducible installs.',
    },
  ],
};
