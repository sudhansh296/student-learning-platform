import type { GitLesson } from '../git-curriculum';

export const lesson05: GitLesson = {
  id: 'git-05',
  title: 'Merging and Rebasing',
  slug: '05-merging',
  chapter: 'branching',
  order: 5,
  difficulty: 'intermediate',
  readingTime: 13,
  description: 'Combine work from different branches using merge and rebase, understand their differences, and know when to use each.',
  sections: [
    {
      type: 'text',
      content: 'After developing a feature on its own branch, you need to bring that work back into the main codebase. Git provides two main ways to do this: merging and rebasing. Each produces a different kind of history.'
    },
    {
      type: 'heading',
      content: 'Fast-Forward Merge'
    },
    {
      type: 'text',
      content: 'A fast-forward merge happens when the branch you are merging into has not diverged from the branch being merged. Git simply moves the branch pointer forward. No merge commit is created.'
    },
    {
      type: 'example',
      title: 'Fast-Forward Merge',
      content: 'When main has no new commits since the feature branch was created, Git fast-forwards the main pointer to the feature tip.',
      code: `# Switch to the branch you want to merge into
git switch main

# Merge feature branch (fast-forward if possible)
git merge feature/login`,
      language: 'bash',
      output: `Updating 9c7e204..a3f9c12
Fast-forward
 src/login.js | 47 +++++++++++++++++++++++
 1 file changed, 47 insertions(+)`
    },
    {
      type: 'heading',
      content: 'Three-Way Merge'
    },
    {
      type: 'text',
      content: 'A three-way merge is used when both branches have diverged. Git finds the common ancestor commit and uses it as a base to combine the two branches. This creates a new merge commit with two parent commits.'
    },
    {
      type: 'example',
      title: 'Three-Way Merge',
      content: 'When both main and the feature branch have new commits since they diverged, Git creates a merge commit to join them.',
      code: `git switch main
git merge feature/dark-mode`,
      language: 'bash',
      output: `Merge made by the 'ort' strategy.
 src/theme.js | 23 ++++++++++++++
 1 file changed, 23 insertions(+)
[main d7f2c91] Merge branch 'feature/dark-mode'`
    },
    {
      type: 'heading',
      content: 'Git Rebase'
    },
    {
      type: 'text',
      content: 'Rebasing rewrites your branch\'s history by re-applying each of your commits on top of another branch. The result looks like you started your work from the tip of that branch, producing a perfectly linear history.'
    },
    {
      type: 'example',
      title: 'Basic Rebase',
      content: 'Rebasing a feature branch onto main moves all feature commits to start from the current tip of main, replaying them one by one.',
      code: `# Move feature branch commits on top of latest main
git switch feature/payment
git rebase main

# After rebasing, fast-forward merge on main
git switch main
git merge feature/payment`,
      language: 'bash',
      output: `Successfully rebased and updated refs/heads/feature/payment.
First, rewinding head to replay your work on top of it...
Applying: Add payment form
Applying: Validate credit card number`
    },
    {
      type: 'heading',
      content: 'Interactive Rebase'
    },
    {
      type: 'text',
      content: 'Interactive rebase (git rebase -i) lets you edit, squash, reorder, or drop commits before they are replayed. This is used to clean up messy commit history before merging a feature branch.'
    },
    {
      type: 'example',
      title: 'Interactive Rebase Session',
      content: 'The -i flag opens an editor listing recent commits. Each line represents a commit and you change the action keyword to control what happens.',
      code: `# Interactively rebase the last 3 commits
git rebase -i HEAD~3`,
      language: 'bash',
      output: `pick a3f9c12 Add payment form
squash b8e2a01 Fix typo in payment form
squash f4d1b33 Another typo fix

# Commands:
# pick   = use commit
# reword = use commit, but edit the message
# squash = use commit, meld into previous commit
# fixup  = like squash, but discard the message
# drop   = remove commit`
    },
    {
      type: 'heading',
      content: 'Merge vs Rebase Tradeoffs'
    },
    {
      type: 'table',
      title: 'Merge vs Rebase Comparison',
      headers: ['Aspect', 'Merge', 'Rebase'],
      rows: [
        ['History shape', 'Preserves full branching history', 'Creates linear history'],
        ['Merge commits', 'Creates a merge commit', 'No merge commits'],
        ['Safety', 'Safe for shared branches', 'Rewrites history, risky if shared'],
        ['Conflict handling', 'One conflict resolution round', 'May conflict on each replayed commit'],
        ['Readability', 'Can get noisy with many branches', 'Clean, easy to follow linear log'],
        ['Use case', 'Merging long-lived branches', 'Cleaning up local feature branches']
      ]
    },
    {
      type: 'warning',
      title: 'The Golden Rule of Rebasing',
      content: 'Never rebase commits that have been pushed to a shared remote branch. Rebasing rewrites commit hashes. If others have based their work on those commits, their history will diverge and cause serious conflicts.'
    },
    {
      type: 'tip',
      title: 'When to Use Each',
      content: 'Use merge when combining long-lived branches like main and develop. Use rebase to clean up a local feature branch before opening a pull request, making the history easier to review.'
    },
    {
      type: 'tryit',
      title: 'Merge vs Rebase Comparison',
      js: `const views = {
  merge: {
    label: 'After git merge (3-way)',
    nodes: [
      { id: 'A', x: 60, y: 160, color: '#888', label: 'A' },
      { id: 'B', x: 140, y: 80, color: '#F05032', label: 'B' },
      { id: 'C', x: 220, y: 80, color: '#F05032', label: 'C' },
      { id: 'D', x: 140, y: 160, color: '#2196F3', label: 'D' },
      { id: 'M', x: 300, y: 120, color: '#4CAF50', label: 'M', head: true }
    ],
    edges: [['A','B'],['B','C'],['A','D'],['C','M'],['D','M']]
  },
  rebase: {
    label: 'After git rebase + merge (linear)',
    nodes: [
      { id: 'A', x: 60, y: 120, color: '#888', label: 'A' },
      { id: 'B', x: 140, y: 120, color: '#F05032', label: 'B' },
      { id: 'C', x: 220, y: 120, color: '#F05032', label: 'C' },
      { id: "D'", x: 300, y: 120, color: '#2196F3', label: "D'", head: true }
    ],
    edges: [['A','B'],['B','C'],['C',"D'"]]
  }
};

let current = 'merge';

function render() {
  const v = views[current];
  const svg = document.getElementById('graph-svg');
  const W = 380, H = 220;
  svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);

  let edgeHTML = '';
  v.edges.forEach(([from, to]) => {
    const a = v.nodes.find(n => n.id === from);
    const b = v.nodes.find(n => n.id === to);
    edgeHTML += \`<line x1="\${a.x}" y1="\${a.y}" x2="\${b.x}" y2="\${b.y}" stroke="#ccc" stroke-width="2"/>\`;
  });

  let nodeHTML = '';
  v.nodes.forEach(n => {
    nodeHTML += \`<circle cx="\${n.x}" cy="\${n.y}" r="18" fill="\${n.color}" />\`;
    nodeHTML += \`<text x="\${n.x}" y="\${n.y+5}" text-anchor="middle" fill="white" font-size="12" font-weight="700">\${n.label}</text>\`;
    if (n.head) nodeHTML += \`<text x="\${n.x}" y="\${n.y-26}" text-anchor="middle" fill="\${n.color}" font-size="10" font-weight="700">HEAD</text>\`;
  });

  svg.innerHTML = edgeHTML + nodeHTML;
  document.getElementById('view-label').textContent = v.label;
  document.getElementById('merge-btn').style.opacity = current === 'merge' ? '1' : '0.5';
  document.getElementById('rebase-btn').style.opacity = current === 'rebase' ? '1' : '0.5';
}

document.getElementById('merge-btn').addEventListener('click', function() { current = 'merge'; render(); });
document.getElementById('rebase-btn').addEventListener('click', function() { current = 'rebase'; render(); });

render();`,
      css: `body { padding: 16px; font-family: system-ui, sans-serif; background: #f0f2f5; }
h3 { color: #F05032; margin: 0 0 12px 0; font-size: 15px; }
.buttons { display: flex; gap: 8px; margin-bottom: 12px; }
button { padding: 8px 18px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 12px; transition: opacity .2s; }
#merge-btn { background: #4CAF50; color: white; }
#rebase-btn { background: #2196F3; color: white; }
#view-label { font-size: 12px; color: #555; font-weight: 600; margin-bottom: 8px; }
#graph-svg { width: 100%; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,.1); }
.legend { display: flex; gap: 12px; margin-top: 8px; }
.legend-item { display: flex; align-items: center; gap: 4px; font-size: 11px; color: #555; }
.dot { width: 10px; height: 10px; border-radius: 50%; }`
    }
  ],
  exercises: [
    {
      id: 'ex-git-5-1',
      question: 'When does Git perform a fast-forward merge?',
      type: 'multiple-choice',
      options: [
        'When there are no conflicts between the two branches',
        'When the target branch has not diverged from the source branch',
        'When both branches have the same author',
        'When you use the --fast-forward flag'
      ],
      correct: 1,
      explanation: 'A fast-forward merge happens when the target branch (e.g., main) has not received any new commits since the source branch was created from it. Git simply advances the pointer.'
    },
    {
      id: 'ex-git-5-2',
      question: 'What does "git rebase -i HEAD~3" allow you to do?',
      type: 'multiple-choice',
      options: [
        'Interactively merge the last 3 branches',
        'Interactively edit, squash, or drop the last 3 commits',
        'Revert the last 3 commits one by one',
        'Cherry-pick 3 commits from another branch'
      ],
      correct: 1,
      explanation: 'git rebase -i HEAD~3 opens an interactive editor listing the last 3 commits. You can change each commit action to pick, squash, reword, fixup, or drop to clean up history.'
    },
    {
      id: 'ex-git-5-3',
      question: 'Why should you never rebase commits already pushed to a shared remote branch?',
      type: 'multiple-choice',
      options: [
        'Because rebase only works on local branches',
        'Because rebase changes commit hashes, breaking the history others depend on',
        'Because remote branches have read-only protection',
        'Because rebasing always introduces merge conflicts'
      ],
      correct: 1,
      explanation: 'Rebase rewrites commit history by creating new commits with different SHA-1 hashes. If others have already based work on the original commits, their local history will diverge and cause serious problems.'
    }
  ],
  quiz: [
    {
      id: 'q-git-5-1',
      question: 'What is the main advantage of rebasing over merging for feature branches?',
      options: [
        'Rebase is faster and uses less memory',
        'Rebase produces a linear history that is easier to read',
        'Rebase avoids all merge conflicts automatically',
        'Rebase preserves the complete branch history'
      ],
      correct: 1,
      explanation: 'Rebasing replays commits on top of another branch, producing a clean linear history with no merge commits. This makes git log much easier to follow during code review.'
    },
    {
      id: 'q-git-5-2',
      question: 'What does the "squash" action do in interactive rebase?',
      options: [
        'Deletes the commit entirely from history',
        'Combines the commit with the previous one into a single commit',
        'Rewrites the commit message without changing content',
        'Moves the commit to a different position in history'
      ],
      correct: 1,
      explanation: 'squash combines the commit with the previous commit into one, merging their changes and giving you a chance to write a combined commit message.'
    },
    {
      id: 'q-git-5-3',
      question: 'What does a three-way merge use as its reference point?',
      options: [
        'The oldest commit in the repository',
        'The HEAD of the remote origin',
        'The most recent common ancestor commit of the two branches',
        'The last commit that was tagged'
      ],
      correct: 2,
      explanation: 'A three-way merge uses the most recent common ancestor of both branches as a base, then combines the changes from both branches relative to that base.'
    }
  ]
};
