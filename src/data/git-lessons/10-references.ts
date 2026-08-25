import type { GitLesson } from '../git-curriculum';

export const lesson10: GitLesson = {
  id: 'git-10',
  title: 'Git Quick Reference and Best Practices',
  slug: '10-references',
  chapter: 'advanced',
  order: 10,
  difficulty: 'beginner',
  readingTime: 8,
  description: 'A searchable cheat sheet of all Git commands, best practices for commits and branching, and tips for professional Git usage.',
  sections: [
    {
      type: 'text',
      content: 'This lesson is your permanent reference for Git commands and best practices. Bookmark it and come back whenever you need a quick reminder of the right command or the correct commit message format.'
    },
    {
      type: 'heading',
      content: 'Command Cheat Sheet'
    },
    {
      type: 'table',
      title: 'Setup and Configuration',
      headers: ['Command', 'Description'],
      rows: [
        ['git init', 'Initialize a new repository'],
        ['git clone <url>', 'Clone a remote repository'],
        ['git config --global user.name "Name"', 'Set your name for all repos'],
        ['git config --global user.email "email"', 'Set your email for all repos'],
        ['git config --list', 'Show all configuration values']
      ]
    },
    {
      type: 'table',
      title: 'Core Workflow',
      headers: ['Command', 'Description'],
      rows: [
        ['git status', 'Show working directory state'],
        ['git add <file>', 'Stage a specific file'],
        ['git add .', 'Stage all changes'],
        ['git add -p', 'Interactively stage hunks'],
        ['git commit -m "msg"', 'Commit staged changes'],
        ['git commit --amend', 'Rewrite the last commit'],
        ['git log --oneline --graph', 'View branch history graph'],
        ['git diff', 'Show unstaged changes'],
        ['git diff --staged', 'Show staged changes']
      ]
    },
    {
      type: 'table',
      title: 'Branching',
      headers: ['Command', 'Description'],
      rows: [
        ['git branch', 'List local branches'],
        ['git branch -a', 'List all branches including remote'],
        ['git switch -c <name>', 'Create and switch to new branch'],
        ['git switch <name>', 'Switch to existing branch'],
        ['git branch -d <name>', 'Delete merged branch'],
        ['git merge <branch>', 'Merge branch into current'],
        ['git rebase <branch>', 'Rebase onto another branch']
      ]
    },
    {
      type: 'table',
      title: 'Remote Operations',
      headers: ['Command', 'Description'],
      rows: [
        ['git remote -v', 'List remotes with URLs'],
        ['git remote add origin <url>', 'Add a remote named origin'],
        ['git push -u origin main', 'Push and set upstream tracking'],
        ['git push', 'Push to tracked remote branch'],
        ['git fetch', 'Download remote changes without merging'],
        ['git pull', 'Fetch and merge remote changes'],
        ['git pull --rebase', 'Fetch and rebase instead of merge']
      ]
    },
    {
      type: 'table',
      title: 'Undoing Changes',
      headers: ['Command', 'Description'],
      rows: [
        ['git restore <file>', 'Discard working directory changes'],
        ['git restore --staged <file>', 'Unstage a file'],
        ['git reset --soft HEAD~1', 'Undo commit, keep staged'],
        ['git reset --hard HEAD~1', 'Undo commit and discard changes'],
        ['git revert HEAD', 'Create undo commit (safe for public)'],
        ['git stash', 'Shelve current changes'],
        ['git stash pop', 'Restore most recent stash'],
        ['git reflog', 'View HEAD movement history']
      ]
    },
    {
      type: 'table',
      title: 'Tags',
      headers: ['Command', 'Description'],
      rows: [
        ['git tag', 'List all tags'],
        ['git tag -a v1.0.0 -m "msg"', 'Create annotated tag'],
        ['git push origin v1.0.0', 'Push a specific tag'],
        ['git push --tags', 'Push all local tags'],
        ['git tag -d v1.0.0', 'Delete local tag']
      ]
    },
    {
      type: 'heading',
      content: 'Common .gitignore Patterns'
    },
    {
      type: 'example',
      title: '.gitignore Patterns Reference',
      content: 'These patterns cover the most common files you should never commit to version control.',
      code: `# Node.js / JavaScript
node_modules/
dist/
build/
.next/
.env
.env.local
.env.*.local
npm-debug.log*

# Python
__pycache__/
*.pyc
.venv/
*.egg-info/

# OS files
.DS_Store
Thumbs.db
desktop.ini

# Editor files
.vscode/settings.json
.idea/
*.swp
*.swo

# Build artifacts
*.log
coverage/
.cache/`,
      language: 'gitignore'
    },
    {
      type: 'heading',
      content: 'Git Aliases'
    },
    {
      type: 'example',
      title: 'Setting Up Useful Aliases',
      content: 'Aliases let you create shorthand commands for frequently used Git commands.',
      code: `# Short status
git config --global alias.st status

# Short checkout
git config --global alias.co checkout

# Short branch
git config --global alias.br branch

# Beautiful log graph
git config --global alias.lg "log --oneline --graph --all --decorate"

# Undo last commit, keep changes staged
git config --global alias.undo "reset --soft HEAD~1"

# Now you can run:
git lg
git st
git undo`,
      language: 'bash'
    },
    {
      type: 'heading',
      content: 'Commit Message Best Practices'
    },
    {
      type: 'example',
      title: 'Good vs Bad Commit Messages',
      content: 'A good commit message explains what changed and why, making the history useful for everyone on the team.',
      code: `# BAD commit messages
git commit -m "fix"
git commit -m "wip"
git commit -m "asdfgh"
git commit -m "changes"
git commit -m "Update files"

# GOOD commit messages
git commit -m "Fix login redirect loop on mobile Safari"
git commit -m "Add input validation to registration form"
git commit -m "Upgrade React to v18 for concurrent features"`,
      language: 'bash'
    },
    {
      type: 'list',
      title: 'Commit message rules:',
      items: [
        'Use the imperative mood: "Add feature" not "Added feature"',
        'Keep the subject line under 50 characters',
        'Capitalize the first letter of the subject',
        'Do not end the subject line with a period',
        'Leave a blank line between subject and body',
        'Use the body to explain what and why, not how',
        'Reference issue numbers when relevant: "Fixes #123"'
      ]
    },
    {
      type: 'heading',
      content: 'The Never Do List'
    },
    {
      type: 'warning',
      title: 'Critical Mistakes to Avoid',
      content: 'These mistakes can destroy team trust, lose data, or expose security vulnerabilities. Learn them now so you never make them.'
    },
    {
      type: 'list',
      title: 'Never do these things:',
      items: [
        'Never force push (--force) to main or any shared branch',
        'Never commit secrets, API keys, passwords, or tokens to any repo',
        'Never make enormous commits with dozens of unrelated changes',
        'Never rebase commits already pushed to a shared branch',
        'Never commit directly to main on a team project without a pull request',
        'Never delete .gitignore entries that protect credentials',
        'Never ignore merge conflicts by force-pushing over them'
      ]
    },
    {
      type: 'tip',
      title: 'Secrets in Git History',
      content: 'If you accidentally commit a secret, simply deleting the file in a new commit is not enough - the secret is still visible in git history. You must use git filter-repo to rewrite history and immediately rotate the compromised credential.'
    },
    {
      type: 'tryit',
      title: 'Searchable Git Cheat Sheet',
      js: `document.body.innerHTML = \`
  <h3>Git Command Search</h3>
  <input type="text" id="search" placeholder="Search commands by name, category, or description..." />
  <span id="count"></span>
  <div id="cmd-list"></div>
\`;

const commands = [
  { category: 'Setup', cmd: 'git init', desc: 'Initialize a new repository' },
  { category: 'Setup', cmd: 'git clone <url>', desc: 'Clone a remote repository' },
  { category: 'Setup', cmd: 'git config --global user.name', desc: 'Set your name globally' },
  { category: 'Setup', cmd: 'git config --list', desc: 'Show all config values' },
  { category: 'Basics', cmd: 'git status', desc: 'Show working directory and staging state' },
  { category: 'Basics', cmd: 'git add .', desc: 'Stage all changes' },
  { category: 'Basics', cmd: 'git add -p', desc: 'Interactively stage hunks' },
  { category: 'Basics', cmd: 'git commit -m \\"msg\\"', desc: 'Commit with a message' },
  { category: 'Basics', cmd: 'git commit --amend', desc: 'Rewrite the last commit' },
  { category: 'Basics', cmd: 'git diff', desc: 'Show unstaged changes' },
  { category: 'Basics', cmd: 'git diff --staged', desc: 'Show staged changes' },
  { category: 'History', cmd: 'git log', desc: 'Show full commit history' },
  { category: 'History', cmd: 'git log --oneline --graph', desc: 'Compact branch graph view' },
  { category: 'History', cmd: 'git reflog', desc: 'View all HEAD movements' },
  { category: 'History', cmd: 'git show <hash>', desc: 'Show commit details' },
  { category: 'Branch', cmd: 'git branch', desc: 'List local branches' },
  { category: 'Branch', cmd: 'git switch -c <name>', desc: 'Create and switch to new branch' },
  { category: 'Branch', cmd: 'git switch <name>', desc: 'Switch to existing branch' },
  { category: 'Branch', cmd: 'git branch -d <name>', desc: 'Delete a merged branch' },
  { category: 'Branch', cmd: 'git merge <branch>', desc: 'Merge branch into current' },
  { category: 'Branch', cmd: 'git rebase <branch>', desc: 'Rebase onto another branch' },
  { category: 'Remote', cmd: 'git remote -v', desc: 'List remotes with URLs' },
  { category: 'Remote', cmd: 'git push -u origin main', desc: 'Push and set upstream tracking' },
  { category: 'Remote', cmd: 'git fetch', desc: 'Download remote changes without merging' },
  { category: 'Remote', cmd: 'git pull', desc: 'Fetch and merge remote changes' },
  { category: 'Undo', cmd: 'git restore <file>', desc: 'Discard working directory changes' },
  { category: 'Undo', cmd: 'git restore --staged <file>', desc: 'Unstage a file' },
  { category: 'Undo', cmd: 'git reset --soft HEAD~1', desc: 'Undo commit, keep staged' },
  { category: 'Undo', cmd: 'git reset --hard HEAD~1', desc: 'Undo commit and discard changes' },
  { category: 'Undo', cmd: 'git revert HEAD', desc: 'Create undo commit (safe for public)' },
  { category: 'Undo', cmd: 'git stash', desc: 'Shelve current changes' },
  { category: 'Undo', cmd: 'git stash pop', desc: 'Restore most recent stash' },
  { category: 'Tags', cmd: 'git tag', desc: 'List all tags' },
  { category: 'Tags', cmd: 'git tag -a v1.0.0 -m \\"msg\\"', desc: 'Create annotated tag' },
  { category: 'Tags', cmd: 'git push --tags', desc: 'Push all local tags to remote' }
];

const catColors = { Setup: '#9C27B0', Basics: '#F05032', History: '#FF9800', Branch: '#2196F3', Remote: '#4CAF50', Undo: '#f44336', Tags: '#795548' };

function render(filter) {
  const list = document.getElementById('cmd-list');
  const filtered = filter ? commands.filter(c =>
    c.cmd.toLowerCase().includes(filter) ||
    c.desc.toLowerCase().includes(filter) ||
    c.category.toLowerCase().includes(filter)
  ) : commands;

  if (filtered.length === 0) {
    list.innerHTML = '<div style=\\"color:#aaa;text-align:center;padding:20px;font-size:13px\\">No commands match your search.</div>';
    return;
  }

  list.innerHTML = filtered.map(c => \`
    <div style=\\"display:flex;align-items:flex-start;gap:10px;padding:8px 10px;background:white;border-radius:6px;margin-bottom:4px\\">
      <span style=\\"background:\${catColors[c.category]||'#888'};color:white;font-size:9px;padding:2px 6px;border-radius:3px;flex-shrink:0;margin-top:2px;font-weight:700\\">\${c.category}</span>
      <span style=\\"font-family:monospace;font-size:12px;color:#1a1a1a;flex:1\\">\${c.cmd}</span>
      <span style=\\"font-size:11px;color:#6c757d;text-align:right\\">\${c.desc}</span>
    </div>
  \`).join('');
  document.getElementById('count').textContent = filtered.length + ' commands';
}

document.getElementById('search').addEventListener('input', function() {
  render(this.value.toLowerCase().trim());
});

render('');`,
      css: `body { padding: 16px; font-family: system-ui, sans-serif; background: #f0f2f5; }
h3 { color: #F05032; margin: 0 0 12px 0; font-size: 15px; }
#search { width: 100%; padding: 10px 14px; border: 2px solid #dee2e6; border-radius: 8px; font-size: 14px; outline: none; box-sizing: border-box; margin-bottom: 6px; }
#search:focus { border-color: #F05032; }
#count { font-size: 11px; color: #888; margin-bottom: 8px; display: block; }
#cmd-list { max-height: 280px; overflow-y: auto; }`
    }
  ],
  exercises: [
    {
      id: 'ex-git-10-1',
      question: 'Which of these is a well-formed commit message following best practices?',
      type: 'multiple-choice',
      options: [
        'fixed stuff',
        'Add email validation to the registration form',
        'Added some new features and also fixed a few bugs',
        'WIP'
      ],
      correct: 1,
      explanation: 'Good commit messages use the imperative mood, start with a capital letter, stay under 50 characters, and describe the specific change. "Add email validation to the registration form" follows all these rules.'
    },
    {
      id: 'ex-git-10-2',
      question: 'What should you do if you accidentally commit a secret API key to a Git repository?',
      type: 'multiple-choice',
      options: [
        'Delete the file in a new commit to remove the secret',
        'Make the repository private and the key is safe',
        'Immediately rotate the compromised credential and use git filter-repo to rewrite history',
        'No action needed if the repository is private'
      ],
      correct: 2,
      explanation: 'Deleting the file only hides it; the secret is still visible in the git history. You must rotate the key immediately (treat it as compromised) and use git filter-repo to rewrite history to purge the secret.'
    }
  ],
  quiz: [
    {
      id: 'q-git-10-1',
      question: 'What is the recommended maximum length for a commit message subject line?',
      options: ['25 characters', '50 characters', '72 characters', '100 characters'],
      correct: 1,
      explanation: 'The widely accepted convention is to keep the subject line under 50 characters so it displays fully in git log --oneline output and in GitHub\'s pull request interface.'
    },
    {
      id: 'q-git-10-2',
      question: 'What does git config --global alias.lg "log --oneline --graph --all" do?',
      options: [
        'Installs a Git extension called lg',
        'Creates a shorthand "git lg" command for a formatted log view',
        'Sets the default log format for all repositories',
        'Creates a script file called lg.sh'
      ],
      correct: 1,
      explanation: 'This creates a Git alias called "lg" so you can type git lg instead of the full git log --oneline --graph --all command. Aliases save typing for frequently used commands.'
    }
  ]
};
