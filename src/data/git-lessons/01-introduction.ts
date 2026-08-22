import type { GitLesson } from '../git-curriculum';

export const lesson01: GitLesson = {
  id: 'git-01',
  title: 'Introduction to Git and Version Control',
  slug: '01-introduction',
  chapter: 'basics',
  order: 1,
  difficulty: 'beginner',
  readingTime: 10,
  description: 'Learn what version control is, why every developer needs Git, and how Git tracks changes using snapshots.',
  sections: [
    {
      type: 'text',
      content: 'Git is a distributed version control system that tracks changes in your source code over time. Created by Linus Torvalds in 2005, it has become the universal standard for source code management in professional software development.'
    },
    {
      type: 'heading',
      content: 'What is Version Control?'
    },
    {
      type: 'text',
      content: 'Version control is a system that records changes to files over time so you can recall specific versions later. Without it, collaborating on code or recovering from mistakes becomes a painful manual process.'
    },
    {
      type: 'analogy',
      title: 'The Save Game Analogy',
      content: 'Think of Git like save points in a video game. You can save your progress at any point, try something risky on a new branch, and if it goes wrong reload your last save. You can even run multiple playthroughs at once without affecting each other.'
    },
    {
      type: 'heading',
      content: 'Problems Without Version Control'
    },
    {
      type: 'list',
      title: 'Without a VCS you face constant pain:',
      items: [
        'No way to undo changes made hours or days ago',
        'Working on a new feature risks breaking the working app',
        'Sharing code with teammates means emailing zip files',
        'Two developers editing the same file causes overwriting',
        'Impossible to know who changed what and why',
        'Deployments become scary because you cannot roll back'
      ]
    },
    {
      type: 'heading',
      content: 'Centralized vs Distributed VCS'
    },
    {
      type: 'table',
      title: 'SVN (Centralized) vs Git (Distributed)',
      headers: ['Feature', 'SVN (Centralized)', 'Git (Distributed)'],
      rows: [
        ['Repository', 'Single central server', 'Every clone is a full repository'],
        ['Offline work', 'Not possible', 'Full history available offline'],
        ['Speed', 'Network dependent', 'Most ops are local and instant'],
        ['Branching', 'Slow and costly', 'Lightweight, near instant'],
        ['Failure risk', 'Server failure = data loss risk', 'No single point of failure'],
        ['Adoption', 'Legacy enterprise tools', 'Industry standard everywhere']
      ]
    },
    {
      type: 'heading',
      content: 'How Git Stores Data: Snapshots, Not Diffs'
    },
    {
      type: 'text',
      content: 'Most version control systems track files as a set of changes (deltas) over time. Git thinks about data differently: every time you commit, Git stores a snapshot of every file at that moment. If a file has not changed, Git stores a reference to the previous identical version, not a copy.'
    },
    {
      type: 'note',
      title: 'Snapshots vs Deltas',
      content: 'This snapshot model is what makes Git operations like branching, merging, and switching commits so fast. Git does not need to reconstruct file state by replaying a chain of diffs.'
    },
    {
      type: 'heading',
      content: 'SHA-1 Hashes'
    },
    {
      type: 'text',
      content: 'Git identifies every object (commit, file, directory tree) by a 40-character SHA-1 hash computed from its contents. This means two identical files always produce the same hash, and any change to a file produces a completely different hash.'
    },
    {
      type: 'example',
      title: 'Checking Git Version',
      content: 'This command confirms Git is installed and shows the installed version.',
      code: `git --version`,
      language: 'bash',
      output: 'git version 2.44.0'
    },
    {
      type: 'heading',
      content: 'The Three States of Git'
    },
    {
      type: 'text',
      content: 'Every file in a Git project lives in one of three states. Understanding these states is the foundation of every Git workflow.'
    },
    {
      type: 'list',
      title: 'The three states:',
      items: [
        'Modified: You have changed the file but have not told Git about it yet (working directory)',
        'Staged: You have marked a modified file to go into your next commit snapshot (staging area / index)',
        'Committed: The data is safely stored in your local Git database (repository / .git folder)'
      ]
    },
    {
      type: 'heading',
      content: 'Real-World Use Cases'
    },
    {
      type: 'list',
      title: 'Git powers everyday development tasks:',
      items: [
        'Feature development on isolated branches without touching stable code',
        'Code review through pull requests before merging to main',
        'Rolling back a bad release with git revert or git reset',
        'Bisecting to find exactly which commit introduced a bug',
        'Open source collaboration where thousands fork and contribute',
        'Continuous integration pipelines triggered on every push'
      ]
    },
    {
      type: 'example',
      title: 'Viewing Commit History',
      content: 'The git log command shows the project timeline with each commit hash, author, date, and message.',
      code: `git log --oneline`,
      language: 'bash',
      output: `a3f9c12 Fix login redirect on mobile
b8e2a01 Add dark mode toggle
f4d1b33 Refactor authentication module
9c7e204 Initial project setup`
    },
    {
      type: 'tip',
      title: 'Every Developer Needs Git',
      content: 'Git is not optional in professional software development. Every job posting for developers expects Git proficiency. Start using it on every project, even personal ones, from day one.'
    },
    {
      type: 'tryit',
      title: 'Commit History Visualizer',
      js: `document.body.innerHTML = '<div><h3>Commit History Timeline</h3><button id=\\"add-btn\\">+ Add Commit</button><div id=\\"commit-list\\"></div></div>';

const commits = [
  { hash: 'a3f9c12', message: 'Fix login redirect on mobile', author: 'Alice', date: '2024-08-19' },
  { hash: 'b8e2a01', message: 'Add dark mode toggle', author: 'Bob', date: '2024-08-18' },
  { hash: 'f4d1b33', message: 'Refactor authentication module', author: 'Alice', date: '2024-08-17' },
  { hash: '9c7e204', message: 'Initial project setup', author: 'Charlie', date: '2024-08-16' }
];

let counter = 5;

function render() {
  const list = document.getElementById('commit-list');
  list.innerHTML = commits.map((c, i) => \`
    <div style=\\"display:flex;align-items:flex-start;gap:12px;padding:14px;background:\${i===0?'#fff5f2':'#f8f9fa'};border:1px solid \${i===0?'#F05032':'#dee2e6'};border-radius:8px;margin-bottom:8px\\">
      <div style=\\"background:#F05032;color:white;padding:4px 8px;border-radius:4px;font-family:monospace;font-size:11px;flex-shrink:0\\">\${c.hash}</div>
      <div style=\\"flex:1\\">
        <div style=\\"font-weight:600;font-size:14px;color:#1a1a1a\\">\${c.message}</div>
        <div style=\\"font-size:12px;color:#6c757d;margin-top:2px\\">\${c.author} &bull; \${c.date}</div>
      </div>
    </div>
  \`).join('');
}

document.getElementById('add-btn').addEventListener('click', function() {
  const messages = ['Update README', 'Add unit tests', 'Fix CSS overflow bug', 'Improve error messages', 'Bump version to 2.0'];
  const authors = ['Alice', 'Bob', 'Charlie', 'Dana'];
  const hash = Math.random().toString(16).slice(2, 9);
  const msg = messages[counter % messages.length];
  const author = authors[counter % authors.length];
  const today = new Date();
  const date = today.getFullYear() + '-' + String(today.getMonth()+1).padStart(2,'0') + '-' + String(today.getDate()).padStart(2,'0');
  commits.unshift({ hash, message: msg, author, date });
  counter++;
  render();
});

render();`,
      css: `body { padding: 20px; font-family: system-ui, sans-serif; background: #f0f2f5; }
h3 { color: #F05032; margin: 0 0 16px 0; font-size: 16px; }
#add-btn { background: #F05032; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; cursor: pointer; margin-bottom: 16px; font-size: 13px; }
#add-btn:hover { background: #d94526; }`
    },
    {
      type: 'warning',
      title: 'Git vs GitHub',
      content: 'Git is the version control tool installed on your machine. GitHub is a website that hosts Git repositories in the cloud. They are different things. You can use Git without GitHub.'
    }
  ],
  exercises: [
    {
      id: 'ex-git-1-1',
      question: 'How does Git store file data internally?',
      type: 'multiple-choice',
      options: [
        'As a list of file differences (deltas) between versions',
        'As a snapshot of every file at each commit',
        'As a compressed archive of the whole project',
        'As a log of terminal commands you ran'
      ],
      correct: 1,
      explanation: 'Git stores snapshots of the entire project at each commit. If a file has not changed, Git stores a reference to the previous snapshot rather than duplicating it.'
    },
    {
      id: 'ex-git-1-2',
      question: 'Which of the three Git states means a file has been marked to go into the next commit?',
      type: 'multiple-choice',
      options: [
        'Modified',
        'Staged',
        'Committed',
        'Tracked'
      ],
      correct: 1,
      explanation: 'The staged state (also called the index or staging area) means you have marked the file to be included in your next commit snapshot.'
    },
    {
      id: 'ex-git-1-3',
      question: 'What is a key advantage of a distributed VCS like Git over a centralized VCS like SVN?',
      type: 'multiple-choice',
      options: [
        'Distributed systems always use less disk space',
        'Every developer has the full history locally and can work offline',
        'Centralized systems do not support branching at all',
        'Git only works with GitHub'
      ],
      correct: 1,
      explanation: 'In a distributed VCS every clone is a complete repository with full history. Developers can commit, branch, and review history entirely offline.'
    }
  ],
  quiz: [
    {
      id: 'q-git-1-1',
      question: 'What does Git use to uniquely identify every commit and file?',
      options: ['Auto-incrementing integer IDs', 'File timestamps', 'SHA-1 hashes', 'UUID v4 strings'],
      correct: 2,
      explanation: 'Git computes a 40-character SHA-1 hash from the contents of each object. This ensures every object has a unique, content-derived identifier.'
    },
    {
      id: 'q-git-1-2',
      question: 'Who created Git and in what year?',
      options: ['Guido van Rossum, 2000', 'Linus Torvalds, 2005', 'Brendan Eich, 1998', 'James Gosling, 2003'],
      correct: 1,
      explanation: 'Linus Torvalds created Git in 2005 to manage the Linux kernel source code after the team lost access to BitKeeper.'
    },
    {
      id: 'q-git-1-3',
      question: 'What is the staging area (index) in Git?',
      options: [
        'The remote repository on GitHub',
        'A backup copy of your files on disk',
        'An intermediate area where you prepare changes before committing',
        'The most recent commit in the repository'
      ],
      correct: 2,
      explanation: 'The staging area (index) is where you prepare changes before committing. You can selectively stage specific files or even specific lines before making a commit.'
    }
  ]
};
