import type { GitLesson } from '../git-curriculum';

export const lesson04: GitLesson = {
  id: 'git-04',
  title: 'Branching',
  slug: '04-branching',
  chapter: 'branching',
  order: 4,
  difficulty: 'beginner',
  readingTime: 13,
  description: 'Understand how Git branches work as lightweight pointers, and learn to create, switch, and delete branches confidently.',
  sections: [
    {
      type: 'text',
      content: 'Branching is one of Git\'s most powerful features and one of the main reasons developers prefer it over older version control systems. A Git branch is simply a lightweight movable pointer to a commit.'
    },
    {
      type: 'heading',
      content: 'What is a Branch?'
    },
    {
      type: 'text',
      content: 'A branch in Git is not a copy of your code. It is a tiny file containing the SHA-1 hash of the commit it points to. Creating a branch is nearly instantaneous and costs almost no disk space.'
    },
    {
      type: 'analogy',
      title: 'The Sticky Note Analogy',
      content: 'A branch is like a sticky note on a page in a book. The book (commit history) does not change. You just moved the note to a different page. You can have many notes pointing to different pages, and you can move them at any time.'
    },
    {
      type: 'heading',
      content: 'The HEAD Pointer'
    },
    {
      type: 'text',
      content: 'HEAD is a special pointer that tells Git which branch you are currently on. When you make a new commit, the current branch pointer advances to the new commit, and HEAD moves with it.'
    },
    {
      type: 'note',
      title: 'Detached HEAD',
      content: 'If you checkout a specific commit hash instead of a branch name, you enter "detached HEAD" state. Any commits you make will not belong to any branch and can be lost. Always create a branch before making commits in this state.'
    },
    {
      type: 'heading',
      content: 'Creating and Listing Branches'
    },
    {
      type: 'example',
      title: 'git branch Commands',
      content: 'The git branch command lists, creates, renames, or deletes branches without switching to them.',
      code: `# List all local branches (current branch has *)
git branch

# List all branches including remote-tracking
git branch -a

# Create a new branch (does not switch to it)
git branch feature/user-login

# Delete a merged branch safely
git branch -d feature/user-login

# Force delete even if unmerged
git branch -D feature/user-login`,
      language: 'bash',
      output: `* main
  feature/user-login
  bugfix/typo-fix`
    },
    {
      type: 'heading',
      content: 'Switching Branches'
    },
    {
      type: 'example',
      title: 'git switch (Recommended)',
      content: 'The git switch command was introduced in Git 2.23 as the dedicated command for changing branches.',
      code: `# Switch to an existing branch
git switch feature/user-login

# Create and switch to a new branch in one step
git switch -c feature/dark-mode

# Switch back to the previous branch
git switch -`,
      language: 'bash'
    },
    {
      type: 'example',
      title: 'git checkout (Legacy)',
      content: 'Before git switch existed, git checkout was used for switching branches. You will see it frequently in older tutorials and documentation.',
      code: `# Create and switch to a new branch (legacy)
git checkout -b feature/dark-mode

# Switch to an existing branch (legacy)
git checkout main`,
      language: 'bash'
    },
    {
      type: 'tip',
      title: 'Use git switch for Branches',
      content: 'Prefer git switch for branch operations and git restore for file operations. The old git checkout does both, which made it confusing. The newer dedicated commands are clearer about intent.'
    },
    {
      type: 'heading',
      content: 'Branch Naming Conventions'
    },
    {
      type: 'text',
      content: 'Consistent branch names make it easy to understand what work is happening at a glance. Most teams follow a prefix convention based on the type of work.'
    },
    {
      type: 'list',
      title: 'Standard branch name prefixes:',
      items: [
        'feature/ — new functionality: feature/user-authentication',
        'bugfix/ — fixing a non-critical bug: bugfix/login-redirect',
        'hotfix/ — urgent production fix: hotfix/payment-crash',
        'release/ — preparing a release: release/v2.1.0',
        'chore/ — maintenance tasks: chore/update-dependencies',
        'docs/ — documentation changes: docs/api-reference'
      ]
    },
    {
      type: 'heading',
      content: 'Viewing the Branch Graph'
    },
    {
      type: 'example',
      title: 'git log Branch Graph',
      content: 'The --graph flag draws an ASCII representation of the branch and merge history.',
      code: `git log --oneline --graph --all`,
      language: 'bash',
      output: `* a3f9c12 (HEAD -> feature/login) Add password validation
* b8e2a01 Add login form HTML
| * f4d1b33 (main) Fix footer layout
|/
* 9c7e204 Initial project setup`
    },
    {
      type: 'tryit',
      title: 'Branch Graph Visualizer',
      js: `const state = {
  mainCommits: ['9c7e204', 'f4d1b33'],
  featureCommits: ['9c7e204', 'b8e2a01', 'a3f9c12'],
  current: 'feature',
  mainCounter: 3,
  featureCounter: 4
};

function hexColor(hash) {
  return '#' + hash.slice(0, 6);
}

function render() {
  const main = document.getElementById('main-branch');
  const feature = document.getElementById('feature-branch');

  const makeCommit = (hash, isHead, color) =>
    \`<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
      <div style="width:32px;height:32px;border-radius:50%;background:\${color};display:flex;align-items:center;justify-content:center;font-size:9px;font-family:monospace;color:white;font-weight:700;\${isHead?'box-shadow:0 0 0 3px #fff,0 0 0 5px '+color:''}">\${hash.slice(0,4)}</div>
      \${isHead?'<span style="background:'+color+';color:white;font-size:10px;padding:2px 6px;border-radius:4px;font-weight:700">HEAD</span>':''}
    </div>\`;

  const headOnMain = state.current === 'main';
  const headOnFeature = state.current === 'feature';

  main.innerHTML = state.mainCommits.slice().reverse().map((h, i, arr) =>
    makeCommit(h, headOnMain && i === arr.length - 1, '#F05032')
  ).join('<div style="width:2px;height:8px;background:#F05032;margin-left:15px;margin-bottom:6px"></div>');

  feature.innerHTML = state.featureCommits.slice().reverse().map((h, i, arr) =>
    makeCommit(h, headOnFeature && i === arr.length - 1, '#2196F3')
  ).join('<div style="width:2px;height:8px;background:#2196F3;margin-left:15px;margin-bottom:6px"></div>');

  document.getElementById('current-label').textContent = 'Current branch: ' + state.current;
}

document.getElementById('new-feature-btn').addEventListener('click', function() {
  if (state.current !== 'feature') return;
  const hash = Math.random().toString(16).slice(2, 10);
  state.featureCommits.push(hash);
  state.featureCounter++;
  render();
});

document.getElementById('switch-btn').addEventListener('click', function() {
  state.current = state.current === 'main' ? 'feature' : 'main';
  render();
});

render();`,
      css: `body { padding: 16px; font-family: system-ui, sans-serif; background: #f0f2f5; }
h3 { color: #F05032; margin: 0 0 12px 0; font-size: 15px; }
.branches { display: flex; gap: 20px; margin-bottom: 16px; }
.branch-col { flex: 1; background: white; border-radius: 8px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,.1); }
.branch-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 10px; }
#current-label { font-size: 12px; color: #555; margin-bottom: 12px; font-weight: 600; }
.buttons { display: flex; gap: 8px; flex-wrap: wrap; }
button { padding: 8px 14px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 12px; }
#new-feature-btn { background: #2196F3; color: white; }
#switch-btn { background: #F05032; color: white; }`
    },
    {
      type: 'warning',
      title: 'Unsaved Changes When Switching',
      content: 'Before switching branches, either commit your changes or stash them (git stash). Switching branches with uncommitted changes can sometimes fail or cause you to lose work.'
    }
  ],
  exercises: [
    {
      id: 'ex-git-4-1',
      question: 'What is a Git branch technically?',
      type: 'multiple-choice',
      options: [
        'A full copy of the repository with all files',
        'A lightweight pointer to a specific commit',
        'A compressed archive of staged changes',
        'A separate working directory on disk'
      ],
      correct: 1,
      explanation: 'A Git branch is simply a lightweight file containing the SHA-1 hash of the commit it points to. This is why creating a branch is instantaneous and costs almost no disk space.'
    },
    {
      id: 'ex-git-4-2',
      question: 'Which command creates a new branch AND switches to it in one step (modern recommended way)?',
      type: 'multiple-choice',
      options: [
        'git branch -c feature/login',
        'git switch -c feature/login',
        'git checkout feature/login',
        'git branch --new feature/login'
      ],
      correct: 1,
      explanation: 'git switch -c <branch-name> creates a new branch and immediately switches to it. This is the modern recommended alternative to git checkout -b.'
    },
    {
      id: 'ex-git-4-3',
      question: 'What does the HEAD pointer represent in Git?',
      type: 'multiple-choice',
      options: [
        'The first commit in the repository',
        'The most recent commit on any branch',
        'The branch you are currently working on',
        'The remote origin branch'
      ],
      correct: 2,
      explanation: 'HEAD is a special reference that points to the branch you are currently on. When you commit, the current branch advances and HEAD moves with it.'
    }
  ],
  quiz: [
    {
      id: 'q-git-4-1',
      question: 'What is "detached HEAD" state?',
      options: [
        'When HEAD points to a branch instead of a commit',
        'When HEAD points directly to a commit rather than a branch',
        'When your local branch is behind the remote',
        'When there are merge conflicts in the repository'
      ],
      correct: 1,
      explanation: 'Detached HEAD means HEAD points directly to a commit hash instead of a branch name. New commits in this state are not tracked by any branch and can be lost.'
    },
    {
      id: 'q-git-4-2',
      question: 'What is the difference between git branch -d and git branch -D?',
      options: [
        '-d deletes the branch remotely, -D deletes it locally',
        '-d only deletes if merged, -D force deletes even if unmerged',
        '-d is the old syntax, -D is the new syntax',
        'They are identical, just different style preferences'
      ],
      correct: 1,
      explanation: 'git branch -d is a safe delete that only works if the branch has been fully merged. git branch -D force-deletes even if there are unmerged commits, which can cause data loss.'
    },
    {
      id: 'q-git-4-3',
      question: 'Which prefix convention is typically used for urgent production bug fixes?',
      options: ['feature/', 'bugfix/', 'hotfix/', 'patch/'],
      correct: 2,
      explanation: 'hotfix/ is the conventional prefix for urgent production fixes that need to be deployed immediately. These typically branch off main rather than develop.'
    }
  ]
};
