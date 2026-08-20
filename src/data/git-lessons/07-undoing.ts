import type { GitLesson } from '../git-curriculum';

export const lesson07: GitLesson = {
  id: 'git-07',
  title: 'Undoing Changes',
  slug: '07-undoing',
  chapter: 'remote',
  order: 7,
  difficulty: 'intermediate',
  readingTime: 12,
  description: 'Learn all the ways to undo work in Git: restore, reset, revert, stash, and amend — and when each is the right tool.',
  sections: [
    {
      type: 'text',
      content: 'Knowing how to undo mistakes is as important as knowing how to make commits. Git gives you multiple ways to undo work, each with different effects on history. Choosing the right one depends on what you changed and whether others have seen it.'
    },
    {
      type: 'heading',
      content: 'git restore'
    },
    {
      type: 'text',
      content: 'git restore is the safest undo command. It discards changes in the working directory or unstages files, but never rewrites committed history.'
    },
    {
      type: 'example',
      title: 'git restore Commands',
      content: 'Use git restore to discard working directory edits or to remove files from the staging area.',
      code: `# Discard changes in working directory (revert file to last commit)
git restore src/utils.js

# Unstage a file (move it back to working directory)
git restore --staged src/utils.js

# Unstage and discard all changes at once
git restore --staged --worktree src/utils.js`,
      language: 'bash'
    },
    {
      type: 'warning',
      title: 'git restore is Irreversible',
      content: 'git restore --worktree permanently discards uncommitted changes. There is no undo for this. Always check git status before running it to confirm you know what will be lost.'
    },
    {
      type: 'heading',
      content: 'git reset'
    },
    {
      type: 'text',
      content: 'git reset moves the HEAD pointer (and the current branch pointer) to a different commit. Its effect on the working directory and staging area depends on which mode you use.'
    },
    {
      type: 'example',
      title: 'git reset Modes',
      content: 'The three modes control how much git reset undoes beyond moving the branch pointer.',
      code: `# --soft: undo commit, keep changes staged
git reset --soft HEAD~1

# --mixed (default): undo commit, keep changes in working dir
git reset HEAD~1

# --hard: undo commit AND discard all changes
git reset --hard HEAD~1`,
      language: 'bash'
    },
    {
      type: 'table',
      title: 'git reset Mode Comparison',
      headers: ['Mode', 'Branch pointer', 'Staging area', 'Working directory'],
      rows: [
        ['--soft', 'Moves back', 'Changes kept staged', 'Unchanged'],
        ['--mixed (default)', 'Moves back', 'Changes unstaged', 'Unchanged'],
        ['--hard', 'Moves back', 'Cleared', 'Changes discarded']
      ]
    },
    {
      type: 'heading',
      content: 'git revert'
    },
    {
      type: 'text',
      content: 'git revert is the safe way to undo a commit that has already been pushed. Instead of removing the commit, it creates a new commit that applies the inverse of the target commit. History is preserved.'
    },
    {
      type: 'example',
      title: 'git revert',
      content: 'git revert creates a new commit that undoes the specified commit without rewriting history, making it safe for public branches.',
      code: `# Revert the most recent commit
git revert HEAD

# Revert a specific commit by hash
git revert a3f9c12

# Revert without opening the editor (use default message)
git revert HEAD --no-edit`,
      language: 'bash',
      output: `[main d8f1a3b] Revert "Add broken payment integration"
 1 file changed, 12 deletions(-)`
    },
    {
      type: 'heading',
      content: 'git stash'
    },
    {
      type: 'text',
      content: 'git stash temporarily shelves changes you are not ready to commit. This is useful when you need to switch branches quickly without losing work in progress.'
    },
    {
      type: 'example',
      title: 'git stash Workflow',
      content: 'Stash your changes, switch branches to fix something, then come back and restore your stashed work.',
      code: `# Save current working changes to the stash
git stash push -m "work in progress: user profile"

# List all stashed changesets
git stash list

# Apply the most recent stash (keeps it in stash list)
git stash apply

# Pop the most recent stash (applies and removes from list)
git stash pop

# Apply a specific stash by index
git stash apply stash@{2}

# Drop (delete) a specific stash
git stash drop stash@{0}

# Create a branch from a stash
git stash branch feature/profile stash@{0}`,
      language: 'bash',
      output: `stash@{0}: On main: work in progress: user profile
stash@{1}: On feature/login: half-done login form`
    },
    {
      type: 'heading',
      content: 'git commit --amend'
    },
    {
      type: 'example',
      title: 'Amending the Last Commit',
      content: 'The --amend flag rewrites the most recent commit. Use it to fix a typo in the commit message or add a file you forgot to stage.',
      code: `# Fix commit message only
git commit --amend -m "Correct spelling in error message"

# Add a forgotten file to the last commit
git add forgotten-file.js
git commit --amend --no-edit`,
      language: 'bash'
    },
    {
      type: 'heading',
      content: 'git reflog'
    },
    {
      type: 'example',
      title: 'Recovering Lost Commits with reflog',
      content: 'git reflog records every movement of HEAD. Even after a hard reset, you can find the lost commit hash and restore it.',
      code: `# Show the full HEAD movement history
git reflog

# Restore a commit you accidentally reset away
git checkout -b recovery-branch abc1234`,
      language: 'bash',
      output: `a3f9c12 (HEAD -> main) HEAD@{0}: reset: moving to HEAD~1
b8e2a01 HEAD@{1}: commit: Add dark mode toggle
f4d1b33 HEAD@{2}: commit: Refactor authentication`
    },
    {
      type: 'tip',
      title: 'Nothing is Truly Lost in Git',
      content: 'As long as commits have been made, git reflog can help you recover them for at least 30 days (the default expiry). Always commit work before running destructive commands like git reset --hard.'
    },
    {
      type: 'tryit',
      title: 'Undo Operations Simulator',
      js: `const initial = [
  { hash: 'a3f9c12', msg: 'Add dark mode', modified: false },
  { hash: 'b8e2a01', msg: 'Fix login', modified: false },
  { hash: 'f4d1b33', msg: 'Initial setup', modified: false }
];

let commits = initial.map(c => ({...c}));
let staged = false;
let status = 'Clean working directory.';

function render() {
  const list = document.getElementById('commit-list');
  list.innerHTML = commits.map((c, i) =>
    \`<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:\${i===0?'#fff5f2':'#f8f9fa'};border:1px solid \${i===0?'#F05032':'#dee2e6'};border-radius:6px;margin-bottom:5px">
      <span style="background:#F05032;color:white;padding:2px 7px;border-radius:4px;font-family:monospace;font-size:10px">\${c.hash.slice(0,7)}</span>
      <span style="font-size:13px;\${c.modified?'color:#F05032;font-style:italic':''}">\${c.msg}\${c.modified?' (modified)':''}</span>
      \${i===0?'<span style="margin-left:auto;background:#4CAF50;color:white;font-size:10px;padding:2px 6px;border-radius:4px">HEAD</span>':''}
    </div>\`
  ).join('');
  document.getElementById('status-msg').textContent = status;
  document.getElementById('staged-badge').textContent = staged ? 'Changes staged' : 'Nothing staged';
  document.getElementById('staged-badge').style.background = staged ? '#2196F3' : '#aaa';
}

document.getElementById('restore-btn').addEventListener('click', function() {
  commits[0] = { ...initial[Math.min(commits.length - 1, 0)], hash: commits[0].hash, modified: false };
  staged = false;
  status = 'git restore: working directory changes discarded.';
  render();
});

document.getElementById('soft-btn').addEventListener('click', function() {
  if (commits.length <= 1) { status = 'Nothing to reset.'; render(); return; }
  staged = true;
  const removed = commits.shift();
  status = 'git reset --soft: commit "' + removed.msg + '" undone, changes kept staged.';
  render();
});

document.getElementById('hard-btn').addEventListener('click', function() {
  if (commits.length <= 1) { status = 'Nothing to reset.'; render(); return; }
  const removed = commits.shift();
  staged = false;
  status = 'git reset --hard: commit "' + removed.msg + '" and all changes permanently removed.';
  render();
});

document.getElementById('revert-btn').addEventListener('click', function() {
  const hash = Math.random().toString(16).slice(2, 9);
  commits.unshift({ hash, msg: 'Revert "' + commits[0].msg + '"', modified: false });
  status = 'git revert: new undo commit created safely. History preserved.';
  render();
});

render();`,
      css: `body { padding: 16px; font-family: system-ui, sans-serif; background: #f0f2f5; }
h3 { color: #F05032; margin: 0 0 12px 0; font-size: 15px; }
#status-msg { font-size: 12px; font-weight: 600; color: #333; padding: 8px 12px; background: white; border-left: 3px solid #F05032; border-radius: 4px; margin-bottom: 10px; }
#staged-badge { display: inline-block; color: white; font-size: 10px; padding: 2px 8px; border-radius: 4px; margin-bottom: 10px; }
.buttons { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
button { padding: 8px 12px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 11px; }
#restore-btn { background: #FF9800; color: white; }
#soft-btn { background: #9C27B0; color: white; }
#hard-btn { background: #f44336; color: white; }
#revert-btn { background: #4CAF50; color: white; }`
    }
  ],
  exercises: [
    {
      id: 'ex-git-7-1',
      question: 'Which undo command is safe to use on a commit already pushed to a shared branch?',
      type: 'multiple-choice',
      options: [
        'git reset --hard HEAD~1',
        'git reset --soft HEAD~1',
        'git revert HEAD',
        'git restore HEAD'
      ],
      correct: 2,
      explanation: 'git revert is safe for public history because it creates a new commit that undoes the changes without modifying existing commits. git reset rewrites history which breaks shared branches.'
    },
    {
      id: 'ex-git-7-2',
      question: 'What does git stash pop do differently from git stash apply?',
      type: 'multiple-choice',
      options: [
        'pop stages the stashed changes, apply leaves them unstaged',
        'pop applies and removes the stash entry, apply keeps it in the stash list',
        'pop creates a new branch, apply just restores the files',
        'They are identical in behavior'
      ],
      correct: 1,
      explanation: 'git stash apply restores the stashed changes but leaves the stash entry in the list. git stash pop does the same but also removes the entry from the stash list.'
    },
    {
      id: 'ex-git-7-3',
      question: 'What is git reflog used for?',
      type: 'multiple-choice',
      options: [
        'Viewing the commit history of a remote branch',
        'Recovering commits lost after a hard reset by viewing HEAD movement history',
        'Listing all stashed changesets',
        'Showing changes between two branches'
      ],
      correct: 1,
      explanation: 'git reflog records every time HEAD moved, including resets. You can find the SHA-1 hash of a lost commit and restore it even after a hard reset or accidental branch deletion.'
    }
  ],
  quiz: [
    {
      id: 'q-git-7-1',
      question: 'What does git reset --soft HEAD~1 do to your changes?',
      options: [
        'Permanently deletes the last commit and all its changes',
        'Undoes the last commit and moves its changes to the staging area',
        'Undoes the last commit and moves its changes to the working directory',
        'Creates a new revert commit to undo the changes'
      ],
      correct: 1,
      explanation: '--soft undoes the commit and keeps all the changes staged and ready to re-commit. The files are unchanged; only the commit pointer moves back.'
    },
    {
      id: 'q-git-7-2',
      question: 'Which command discards all uncommitted changes in a specific file?',
      options: [
        'git reset src/utils.js',
        'git restore src/utils.js',
        'git revert src/utils.js',
        'git clean src/utils.js'
      ],
      correct: 1,
      explanation: 'git restore <file> discards changes in the working directory for that file, reverting it to the version at the last commit. This action is irreversible.'
    },
    {
      id: 'q-git-7-3',
      question: 'When should you use git stash?',
      options: [
        'When you want to permanently delete uncommitted work',
        'When you need to temporarily shelve in-progress work to switch branches',
        'When you want to merge changes from another branch',
        'When you need to undo the last commit'
      ],
      correct: 1,
      explanation: 'git stash is used to temporarily save uncommitted work when you need to switch context (like fixing a bug on another branch) without committing unfinished changes.'
    }
  ]
};
