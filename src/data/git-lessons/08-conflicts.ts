import type { GitLesson } from '../git-curriculum';

export const lesson08: GitLesson = {
  id: 'git-08',
  title: 'Resolving Merge Conflicts',
  slug: '08-conflicts',
  chapter: 'remote',
  order: 8,
  difficulty: 'intermediate',
  readingTime: 11,
  description: 'Understand what causes merge conflicts, how to read conflict markers, and how to resolve them confidently.',
  sections: [
    {
      type: 'text',
      content: 'Merge conflicts happen when two branches modify the same part of a file in different ways and Git cannot automatically decide which change to keep. They look scary at first but are completely normal and easy to resolve once you understand the markers.'
    },
    {
      type: 'heading',
      content: 'What Causes Conflicts?'
    },
    {
      type: 'list',
      title: 'A conflict occurs when:',
      items: [
        'Two branches edit the same line of a file differently',
        'One branch edits a file that the other branch deleted',
        'Two branches add different content at the same location in a file',
        'Rebasing replays commits that conflict with changes on the target branch'
      ]
    },
    {
      type: 'analogy',
      title: 'Two Editors, One Document',
      content: 'Imagine two people editing the same paragraph of a document offline. When they try to combine their versions, they disagree on what the paragraph should say. Git marks the disagreement and asks you to decide the final version.'
    },
    {
      type: 'heading',
      content: 'Conflict Markers'
    },
    {
      type: 'text',
      content: 'When Git encounters a conflict, it inserts special markers directly into the file to show you both versions. You need to edit the file, remove the markers, and leave only the content you want to keep.'
    },
    {
      type: 'example',
      title: 'Conflict Markers in a File',
      content: 'The markers divide the file into two sections: HEAD (your current branch) above the separator, and the other branch below it.',
      code: `function getGreeting(name) {
<<<<<<< HEAD
  return \`Hello, \${name}! Welcome back.\`;
=======
  return \`Hi \${name}, good to see you!\`;
>>>>>>> feature/friendly-greeting
}`,
      language: 'javascript'
    },
    {
      type: 'table',
      title: 'Conflict Marker Reference',
      headers: ['Marker', 'Meaning'],
      rows: [
        ['<<<<<<< HEAD', 'Start of your version (current branch)'],
        ['=======', 'Separator between the two versions'],
        ['>>>>>>> branch-name', 'End of the incoming version (the branch being merged)']
      ]
    },
    {
      type: 'heading',
      content: 'Resolving Conflicts Step by Step'
    },
    {
      type: 'list',
      title: 'The standard resolution process:',
      items: [
        '1. Run git status to see which files are conflicted',
        '2. Open each conflicted file in your editor',
        '3. Find all conflict markers (search for <<<<<<<)',
        '4. Decide which version to keep, or write a new combined version',
        '5. Delete all three marker lines (<<<<<<<, =======, >>>>>>>)',
        '6. Save the file with only the final intended content',
        '7. Run git add <resolved-file> to mark it as resolved',
        '8. Run git commit to complete the merge'
      ]
    },
    {
      type: 'example',
      title: 'Git Status During Conflict',
      content: 'git status shows conflicted files under "Unmerged paths" so you know exactly what needs attention.',
      code: `git status`,
      language: 'bash',
      output: `On branch main
You have unmerged paths.
  (fix conflicts and run "git commit")
  (use "git merge --abort" to abort the merge)

Unmerged paths:
  (use "git add <file>..." to mark resolution)
        both modified:   src/greeting.js`
    },
    {
      type: 'example',
      title: 'Completing the Merge',
      content: 'After editing the conflicted file and removing all markers, stage the file and commit to finalize the merge.',
      code: `# Mark the conflict as resolved
git add src/greeting.js

# Complete the merge with a commit
git commit -m "Merge feature/friendly-greeting: keep combined greeting"`,
      language: 'bash'
    },
    {
      type: 'heading',
      content: 'Aborting a Merge'
    },
    {
      type: 'example',
      title: 'git merge --abort',
      content: 'If you want to cancel the merge entirely and go back to the state before you ran git merge, use the --abort flag.',
      code: `# Cancel the merge and restore pre-merge state
git merge --abort`,
      language: 'bash'
    },
    {
      type: 'note',
      title: 'Using a Merge Tool',
      content: 'VS Code has a built-in merge editor that shows both versions side by side with "Accept Current", "Accept Incoming", and "Accept Both" buttons. Open a conflicted file in VS Code and look for the merge editor prompt.'
    },
    {
      type: 'heading',
      content: 'Tips to Prevent Conflicts'
    },
    {
      type: 'list',
      title: 'Best practices that reduce conflict frequency:',
      items: [
        'Keep branches short-lived and merge them back quickly',
        'Pull from main frequently to stay in sync with teammates',
        'Communicate with teammates about which files you are editing',
        'Break large changes into smaller focused commits and PRs',
        'Use code ownership files (CODEOWNERS) to coordinate changes',
        'Avoid reformatting entire files or changing indentation across the codebase'
      ]
    },
    {
      type: 'warning',
      title: 'Do Not Commit Conflict Markers',
      content: 'Always search for <<<<<<< in your codebase before committing after a merge. Accidentally committing conflict markers will break your application and is a very common mistake.'
    },
    {
      type: 'tryit',
      title: 'Conflict Resolver',
      js: `const ours = '  return \`Hello, \${name}! Welcome back.\`;';
const theirs = '  return \`Hi \${name}, good to see you!\`;';
const both = '  return name === "admin"\n    ? \`Hello, \${name}! Welcome back.\`\n    : \`Hi \${name}, good to see you!\`;';

const conflicted = \`function getGreeting(name) {
<<<<<<< HEAD
\${ours}
=======
\${theirs}
>>>>>>> feature/friendly-greeting
}\`;

const resolvedOurs = \`function getGreeting(name) {
\${ours}
}\`;

const resolvedTheirs = \`function getGreeting(name) {
\${theirs}
}\`;

const resolvedBoth = \`function getGreeting(name) {
\${both}
}\`;

function setCode(code, label, color) {
  document.getElementById('code-display').textContent = code;
  document.getElementById('code-display').style.color = color || '#e6edf3';
  document.getElementById('resolution-label').textContent = label;
  document.getElementById('resolution-label').style.color = color || '#888';
}

document.getElementById('ours-btn').addEventListener('click', function() {
  setCode(resolvedOurs, 'Keeping our version (HEAD)', '#4CAF50');
});
document.getElementById('theirs-btn').addEventListener('click', function() {
  setCode(resolvedTheirs, 'Keeping their version (feature branch)', '#2196F3');
});
document.getElementById('both-btn').addEventListener('click', function() {
  setCode(resolvedBoth, 'Keeping both with conditional logic', '#FF9800');
});
document.getElementById('reset-btn').addEventListener('click', function() {
  setCode(conflicted, 'Conflicted file (unresolved)', '#F05032');
});

setCode(conflicted, 'Conflicted file (unresolved)', '#F05032');`,
      css: `body { padding: 16px; font-family: system-ui, sans-serif; background: #f0f2f5; }
h3 { color: #F05032; margin: 0 0 12px 0; font-size: 15px; }
.buttons { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
button { padding: 8px 12px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 11px; }
#ours-btn { background: #4CAF50; color: white; }
#theirs-btn { background: #2196F3; color: white; }
#both-btn { background: #FF9800; color: white; }
#reset-btn { background: #F05032; color: white; }
#resolution-label { font-size: 11px; font-weight: 700; margin-bottom: 6px; text-transform: uppercase; letter-spacing: .05em; }
#code-display { background: #1e1e1e; padding: 16px; border-radius: 8px; font-family: monospace; font-size: 12px; white-space: pre; line-height: 1.6; display: block; min-height: 80px; }`
    }
  ],
  exercises: [
    {
      id: 'ex-git-8-1',
      question: 'What do the <<<<<<< HEAD markers in a conflicted file represent?',
      type: 'multiple-choice',
      options: [
        'A syntax error introduced during the merge',
        'The version of the code on your current branch (HEAD)',
        'The version of the code on the remote origin',
        'The common ancestor version before both branches diverged'
      ],
      correct: 1,
      explanation: '<<<<<<< HEAD marks the beginning of your version of the conflicting section — the code as it exists on the branch you are currently on (HEAD).'
    },
    {
      id: 'ex-git-8-2',
      question: 'After resolving a conflict by editing the file, what is the correct next step?',
      type: 'multiple-choice',
      options: [
        'Run git merge again to retry',
        'Run git revert to cancel the conflict',
        'Run git add <file> to mark the conflict as resolved',
        'Run git stash to save the resolved version'
      ],
      correct: 2,
      explanation: 'After editing the file and removing all conflict markers, you must run git add <file> to tell Git the conflict is resolved. Then run git commit to complete the merge.'
    },
    {
      id: 'ex-git-8-3',
      question: 'What does git merge --abort do?',
      type: 'multiple-choice',
      options: [
        'Deletes the branch that caused the conflict',
        'Automatically resolves all conflicts by keeping the current branch version',
        'Cancels the merge in progress and restores the pre-merge state',
        'Marks all conflicts as resolved without editing files'
      ],
      correct: 2,
      explanation: 'git merge --abort cancels the merge that is in progress and restores the repository to the state it was in before you ran git merge. All conflict markers are removed.'
    }
  ],
  quiz: [
    {
      id: 'q-git-8-1',
      question: 'What separates the two conflicting versions in a conflict marker block?',
      options: ['<<<<<<< separator', '======= (seven equals signs)', '>>>>>>> divider', '------- dashes'],
      correct: 1,
      explanation: 'The ======= line separates the two conflicting versions: your version (HEAD) is above it, and the incoming branch version is below it, ending at >>>>>>>.'
    },
    {
      id: 'q-git-8-2',
      question: 'Which practice most effectively reduces the frequency of merge conflicts?',
      options: [
        'Always working on the main branch directly',
        'Keeping branches short-lived and pulling from main frequently',
        'Using git stash before every merge',
        'Avoiding commits until a feature is completely finished'
      ],
      correct: 1,
      explanation: 'Short-lived branches that stay in sync with main by pulling frequently have fewer diverging changes. The longer a branch lives without syncing, the more likely it is to conflict.'
    },
    {
      id: 'q-git-8-3',
      question: 'What happens if you accidentally commit conflict markers (<<<<<<< etc.) into your code?',
      options: [
        'Git automatically removes them on the next commit',
        'The conflict markers become part of the file and will likely break the application',
        'Git rejects the commit and shows an error',
        'The markers are stored as comments and ignored at runtime'
      ],
      correct: 1,
      explanation: 'Git does not prevent you from committing conflict markers. They become literal text in your file, which will cause syntax errors in code files and break your application.'
    }
  ]
};
