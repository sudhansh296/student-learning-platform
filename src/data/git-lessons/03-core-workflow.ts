import type { GitLesson } from '../git-curriculum';

export const lesson03: GitLesson = {
  id: 'git-03',
  title: 'Core Git Workflow',
  slug: '03-core-workflow',
  chapter: 'basics',
  order: 3,
  difficulty: 'beginner',
  readingTime: 14,
  description: 'Master the essential Git workflow: initializing repos, staging changes, committing, viewing history, and ignoring files.',
  sections: [
    {
      type: 'text',
      content: 'The core Git workflow is a loop you will repeat thousands of times in your career: make changes, stage them, commit them, and review history. Mastering these steps makes everything else in Git much easier.'
    },
    {
      type: 'heading',
      content: 'Initializing a Repository'
    },
    {
      type: 'example',
      title: 'git init',
      content: 'The git init command creates a new hidden .git folder in the current directory that stores the entire repository history.',
      code: `mkdir my-project
cd my-project
git init`,
      language: 'bash',
      output: 'Initialized empty Git repository in /home/user/my-project/.git/'
    },
    {
      type: 'note',
      title: 'The .git Folder',
      content: 'Never manually edit or delete anything inside the .git folder. It contains your entire commit history, configuration, and Git internals. Deleting it removes all version control from your project.'
    },
    {
      type: 'heading',
      content: 'The Three Areas'
    },
    {
      type: 'text',
      content: 'Understanding the three areas is the key to understanding every Git command. Files flow through these three areas as you work.'
    },
    {
      type: 'list',
      title: 'The three areas of a Git project:',
      items: [
        'Working Directory: The actual files on your disk that you edit in your editor',
        'Staging Area (Index): A preparation zone where you select what goes into the next commit',
        'Repository (.git): The compressed database of all committed snapshots'
      ]
    },
    {
      type: 'heading',
      content: 'Checking Status'
    },
    {
      type: 'example',
      title: 'git status',
      content: 'The git status command shows which files are modified, staged, or untracked so you always know the current state of your working directory.',
      code: `git status`,
      language: 'bash',
      output: `On branch main
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   src/index.js

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
        modified:   src/utils.js

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        README.md`
    },
    {
      type: 'heading',
      content: 'Staging Changes with git add'
    },
    {
      type: 'example',
      title: 'git add Variants',
      content: 'The git add command moves files from the working directory to the staging area. You can stage individual files, all changes, or even parts of a file.',
      code: `# Stage a specific file
git add src/index.js

# Stage all changed and new files
git add .

# Stage all tracked modified files (not new untracked files)
git add -u

# Interactively stage specific hunks within a file
git add -p src/utils.js`,
      language: 'bash'
    },
    {
      type: 'tip',
      title: 'Use git add -p for Clean Commits',
      content: 'The -p (patch) flag lets you stage individual lines or hunks within a file. This allows you to make one logical commit from a file with multiple unrelated changes.'
    },
    {
      type: 'heading',
      content: 'Committing Changes'
    },
    {
      type: 'example',
      title: 'git commit Variants',
      content: 'The git commit command saves the staged snapshot permanently into the repository with an author, timestamp, and message.',
      code: `# Commit with an inline message
git commit -m "Add user login form"

# Stage all tracked files and commit in one step
git commit -am "Fix typo in error message"

# Amend the most recent commit (message or content)
git commit --amend -m "Add user login form with validation"`,
      language: 'bash',
      output: `[main a3f9c12] Add user login form
 2 files changed, 47 insertions(+), 3 deletions(-)`
    },
    {
      type: 'warning',
      title: 'Only Amend Unpushed Commits',
      content: 'git commit --amend rewrites the last commit by creating a new one. Never amend a commit that has already been pushed to a shared branch, as this rewrites history others depend on.'
    },
    {
      type: 'heading',
      content: 'Viewing History with git log'
    },
    {
      type: 'example',
      title: 'git log Options',
      content: 'The git log command displays the commit history. Several flags make it much more readable.',
      code: `# One line per commit
git log --oneline

# Graph view with branches
git log --oneline --graph --all

# Show files changed in each commit
git log --stat

# Limit to last 5 commits
git log -5`,
      language: 'bash',
      output: `a3f9c12 (HEAD -> main) Fix login redirect on mobile
b8e2a01 Add dark mode toggle
f4d1b33 Refactor authentication module
9c7e204 Initial project setup`
    },
    {
      type: 'heading',
      content: 'Ignoring Files with .gitignore'
    },
    {
      type: 'text',
      content: 'Most projects have files you never want to commit: dependency folders, build output, environment variables, and OS files. The .gitignore file tells Git to ignore them completely.'
    },
    {
      type: 'example',
      title: '.gitignore Example',
      content: 'A typical .gitignore for a JavaScript project covers node_modules, build output, and environment files.',
      code: `# Dependencies
node_modules/
.pnp
.pnp.js

# Build output
dist/
build/
.next/
out/

# Environment variables - never commit secrets
.env
.env.local
.env.production

# OS generated files
.DS_Store
Thumbs.db

# Editor files
.vscode/
.idea/
*.swp`,
      language: 'gitignore'
    },
    {
      type: 'heading',
      content: 'Seeing Differences with git diff'
    },
    {
      type: 'example',
      title: 'git diff Commands',
      content: 'The git diff command shows the exact lines added and removed. Without flags it shows unstaged changes; use --staged for staged changes.',
      code: `# Show unstaged changes (working dir vs staging area)
git diff

# Show staged changes (staging area vs last commit)
git diff --staged

# Show difference between two commits
git diff f4d1b33 a3f9c12`,
      language: 'bash',
      output: `diff --git a/src/utils.js b/src/utils.js
index 3d5f2a1..9b8c4e2 100644
--- a/src/utils.js
+++ b/src/utils.js
@@ -12,7 +12,7 @@ function formatDate(date) {
-  return date.toString();
+  return date.toISOString().split('T')[0];
 }`
    },
    {
      type: 'tryit',
      title: 'Staging Area Simulator',
      js: `document.body.innerHTML = \`
  <h3>Git Workflow Simulator</h3>
  <div class="buttons">
    <button id="edit-btn">Edit File</button>
    <button id="add-btn">git add</button>
    <button id="commit-btn">git commit</button>
  </div>
  <div class="areas">
    <div class="area">
      <div class="area-title" style="color:#F05032">Working Directory</div>
      <div class="area-list" id="working-list"></div>
    </div>
    <div class="area">
      <div class="area-title" style="color:#2196F3">Staging Area</div>
      <div class="area-list" id="staging-list"></div>
    </div>
    <div class="area">
      <div class="area-title" style="color:#4CAF50">Repository</div>
      <div class="area-list" id="repo-list"></div>
    </div>
  </div>
  <div id="log"></div>
\`;

const state = {
  working: ['index.js (modified)', 'utils.js (modified)', 'README.md (new)'],
  staging: [],
  repo: ['app.js', 'styles.css']
};

function render() {
  const colors = { working: '#F05032', staging: '#2196F3', repo: '#4CAF50' };
  ['working', 'staging', 'repo'].forEach(area => {
    const el = document.getElementById(area + '-list');
    el.innerHTML = state[area].length === 0
      ? '<div style=\\"color:#aaa;font-size:12px;text-align:center;padding:8px\\">empty</div>'
      : state[area].map(f => \`<div style=\\"background:\${colors[area]}22;border:1px solid \${colors[area]}66;color:\${colors[area]};padding:6px 10px;border-radius:4px;font-size:12px;font-family:monospace\\">\${f}</div>\`).join('');
  });
  document.getElementById('add-btn').disabled = state.working.length === 0;
  document.getElementById('commit-btn').disabled = state.staging.length === 0;
  document.getElementById('log').innerHTML = document.getElementById('log').innerHTML;
}

document.getElementById('edit-btn').addEventListener('click', function() {
  const names = ['Header.tsx', 'Footer.tsx', 'api/routes.ts', 'config.json'];
  const name = names[Math.floor(Math.random() * names.length)] + ' (modified)';
  if (!state.working.includes(name)) state.working.push(name);
  log('Edited ' + name.split(' ')[0]);
  render();
});

document.getElementById('add-btn').addEventListener('click', function() {
  if (state.working.length === 0) return;
  const moved = state.working.splice(0, 1)[0];
  state.staging.push(moved);
  log('git add ' + moved.split(' ')[0]);
  render();
});

document.getElementById('commit-btn').addEventListener('click', function() {
  if (state.staging.length === 0) return;
  const committed = state.staging.splice(0);
  committed.forEach(f => state.repo.push(f.split(' ')[0]));
  log('git commit: saved ' + committed.length + ' file(s)');
  render();
});

function log(msg) {
  const logEl = document.getElementById('log');
  const time = new Date().toLocaleTimeString();
  logEl.innerHTML = \`<div style=\\"color:#F05032;font-size:11px\\">\${time}: \${msg}</div>\` + logEl.innerHTML;
}

render();`,
      css: `body { padding: 16px; font-family: system-ui, sans-serif; background: #f0f2f5; }
h3 { color: #F05032; margin: 0 0 12px 0; font-size: 15px; }
.areas { display: flex; gap: 10px; margin-bottom: 12px; }
.area { flex: 1; background: white; border-radius: 8px; padding: 10px; box-shadow: 0 1px 3px rgba(0,0,0,.1); min-height: 100px; }
.area-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 8px; }
.area-list { display: flex; flex-direction: column; gap: 4px; }
.buttons { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }
button { padding: 8px 14px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 12px; }
button:disabled { opacity: 0.4; cursor: default; }
#edit-btn { background: #F05032; color: white; }
#add-btn { background: #2196F3; color: white; }
#commit-btn { background: #4CAF50; color: white; }
#log { background: #1e1e1e; color: #aaa; padding: 8px; border-radius: 6px; font-size: 11px; min-height: 40px; max-height: 80px; overflow-y: auto; }`
    }
  ],
  exercises: [
    {
      id: 'ex-git-3-1',
      question: 'What does git add -p do?',
      type: 'multiple-choice',
      options: [
        'Stages all files in the current directory',
        'Lets you interactively choose specific hunks within files to stage',
        'Stages only previously tracked files',
        'Creates a patch file from unstaged changes'
      ],
      correct: 1,
      explanation: 'git add -p (patch mode) walks through each changed hunk and lets you decide interactively whether to stage it, skip it, or split it further. This enables precise, logical commits.'
    },
    {
      id: 'ex-git-3-2',
      question: 'Which command shows the diff between the staging area and the last commit?',
      type: 'multiple-choice',
      options: [
        'git diff',
        'git diff --staged',
        'git diff HEAD',
        'git status --diff'
      ],
      correct: 1,
      explanation: 'git diff --staged (also --cached) compares the staging area to the last commit, showing exactly what will be included in your next commit.'
    },
    {
      id: 'ex-git-3-3',
      question: 'Which of these patterns in .gitignore ignores an entire directory and everything inside it?',
      type: 'multiple-choice',
      options: [
        'node_modules',
        'node_modules/',
        '**/node_modules',
        'Both node_modules and node_modules/ work'
      ],
      correct: 3,
      explanation: 'Both patterns work. node_modules matches any file or directory with that name. node_modules/ explicitly targets only directories. Both effectively ignore the entire node_modules directory.'
    }
  ],
  quiz: [
    {
      id: 'q-git-3-1',
      question: 'What does git commit -am "message" do?',
      options: [
        'Creates an annotated commit with metadata',
        'Automatically stages all tracked modified files and commits them',
        'Amends the last commit with a new message',
        'Adds all files including untracked ones and commits'
      ],
      correct: 1,
      explanation: 'The -a flag automatically stages all modified tracked files before committing. It does not add untracked new files. Combined with -m it stages and commits in one command.'
    },
    {
      id: 'q-git-3-2',
      question: 'What is the purpose of the .gitignore file?',
      options: [
        'It lists files that Git deletes on commit',
        'It tells Git to skip tracking specific files or patterns',
        'It stores your Git credentials',
        'It prevents others from cloning your repository'
      ],
      correct: 1,
      explanation: '.gitignore tells Git to completely ignore certain files and directories. Ignored files will not appear in git status output and cannot be accidentally staged or committed.'
    },
    {
      id: 'q-git-3-3',
      question: 'Which command would you use to see all commits as a graph with one line per commit?',
      options: [
        'git status --graph',
        'git log --oneline --graph --all',
        'git history --tree',
        'git show --graph'
      ],
      correct: 1,
      explanation: 'git log --oneline --graph --all shows each commit on one line, draws an ASCII branch graph on the left, and includes all branches not just the current one.'
    }
  ]
};
