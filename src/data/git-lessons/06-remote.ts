import type { GitLesson } from '../git-curriculum';

export const lesson06: GitLesson = {
  id: 'git-06',
  title: 'Remote Repositories',
  slug: '06-remote',
  chapter: 'remote',
  order: 6,
  difficulty: 'beginner',
  readingTime: 12,
  description: 'Connect your local repo to GitHub, push and pull changes, understand fetch vs pull, and set up upstream tracking.',
  sections: [
    {
      type: 'text',
      content: 'Remote repositories are versions of your project hosted on the internet or network. They enable collaboration with other developers, serve as a backup, and power workflows like pull requests and code review.'
    },
    {
      type: 'heading',
      content: 'What is a Remote?'
    },
    {
      type: 'text',
      content: 'A remote is a named reference to a URL where another copy of the repository lives. Most projects have one remote called origin, which is the canonical version of the project on a hosting service like GitHub.'
    },
    {
      type: 'analogy',
      title: 'The Shared Whiteboard',
      content: 'Your local repository is your personal notebook. The remote is a shared whiteboard that the whole team can read and write. You copy the whiteboard to your notebook, make changes locally, then sync your changes back to the whiteboard.'
    },
    {
      type: 'heading',
      content: 'Managing Remotes'
    },
    {
      type: 'example',
      title: 'git remote Commands',
      content: 'The git remote command lets you view, add, rename, and remove remote connections.',
      code: `# List all remotes with their URLs
git remote -v

# Add a new remote named origin
git remote add origin https://github.com/user/repo.git

# Rename a remote
git remote rename origin upstream

# Remove a remote
git remote remove upstream`,
      language: 'bash',
      output: `origin  https://github.com/user/my-project.git (fetch)
origin  https://github.com/user/my-project.git (push)`
    },
    {
      type: 'heading',
      content: 'Cloning a Repository'
    },
    {
      type: 'example',
      title: 'git clone',
      content: 'Cloning downloads a complete copy of a remote repository, sets up origin automatically, and checks out the default branch.',
      code: `# Clone via HTTPS
git clone https://github.com/user/repo.git

# Clone into a specific directory name
git clone https://github.com/user/repo.git my-local-name

# Clone via SSH (requires SSH key setup)
git clone git@github.com:user/repo.git`,
      language: 'bash',
      output: `Cloning into 'repo'...
remote: Enumerating objects: 142, done.
remote: Counting objects: 100% (142/142), done.
Receiving objects: 100% (142/142), 48.32 KiB | 2.12 MiB/s, done.`
    },
    {
      type: 'heading',
      content: 'Pushing Changes'
    },
    {
      type: 'example',
      title: 'git push',
      content: 'The git push command uploads your local commits to the remote repository so others can access your work.',
      code: `# First push: set upstream tracking with -u
git push -u origin main

# Subsequent pushes on the same branch
git push

# Push a specific branch
git push origin feature/login

# Push all local branches
git push --all origin`,
      language: 'bash',
      output: `Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
Writing objects: 100% (3/3), 342 bytes | 342.00 KiB/s, done.
To https://github.com/user/repo.git
   9c7e204..a3f9c12  main -> main`
    },
    {
      type: 'heading',
      content: 'Fetching vs Pulling'
    },
    {
      type: 'text',
      content: 'There are two ways to get changes from a remote: git fetch downloads them without touching your working files, while git pull downloads and immediately merges them into your current branch.'
    },
    {
      type: 'example',
      title: 'git fetch then Merge',
      content: 'Fetching first lets you inspect remote changes before integrating them, which is the safer workflow.',
      code: `# Download remote changes without merging
git fetch origin

# See what changed on main
git log main..origin/main --oneline

# Merge the fetched changes
git merge origin/main`,
      language: 'bash',
      output: `From https://github.com/user/repo
   a3f9c12..d7f2c91  main -> origin/main`
    },
    {
      type: 'example',
      title: 'git pull',
      content: 'git pull is a shortcut that runs git fetch followed immediately by git merge, integrating remote changes in one step.',
      code: `# Pull and merge in one step
git pull

# Pull and rebase instead of merge (cleaner history)
git pull --rebase`,
      language: 'bash'
    },
    {
      type: 'heading',
      content: 'Tracking Branches'
    },
    {
      type: 'text',
      content: 'When you push with git push -u origin main, you set up a tracking relationship. After that, Git knows which remote branch your local branch corresponds to, so you can just type git push or git pull without specifying the remote and branch.'
    },
    {
      type: 'note',
      title: 'origin/main is a Remote-Tracking Branch',
      content: 'origin/main is a local read-only copy of the remote main branch, updated whenever you fetch. It represents the last known state of the remote and is not the same as your local main branch.'
    },
    {
      type: 'heading',
      content: 'SSH vs HTTPS'
    },
    {
      type: 'table',
      title: 'SSH vs HTTPS for Remote Access',
      headers: ['Aspect', 'HTTPS', 'SSH'],
      rows: [
        ['Authentication', 'Username + password or token', 'SSH key pair'],
        ['Setup', 'Works immediately', 'Requires generating and adding SSH key'],
        ['Security', 'Token-based, rotatable', 'Key-based, very secure'],
        ['Convenience', 'May prompt for credentials', 'Passwordless after setup'],
        ['Corporate firewalls', 'Usually allowed (port 443)', 'May be blocked (port 22)'],
        ['Recommendation', 'Good for beginners', 'Preferred for daily development']
      ]
    },
    {
      type: 'warning',
      title: 'Never Force Push to main',
      content: 'git push --force rewrites remote history. On a shared branch like main this destroys colleagues work. Use --force-with-lease instead, which only forces if no one else has pushed since you last fetched.'
    },
    {
      type: 'tryit',
      title: 'Remote Sync Visualizer',
      js: `document.body.innerHTML = \`
  <h3>Git Remote Sync Simulator</h3>
  <div id="status"></div>
  <div class="cols">
    <div class="col">
      <div class="col-title">📁 Local Repository</div>
      <div id="local-list"></div>
    </div>
    <div class="col">
      <div class="col-title">☁️ Remote Repository (origin)</div>
      <div id="remote-list"></div>
    </div>
  </div>
  <div class="buttons">
    <button id="commit-btn">💾 Commit Locally</button>
    <button id="push-btn">⬆️ Push</button>
    <button id="fetch-btn">⬇️ Fetch</button>
    <button id="pull-btn">🔄 Pull</button>
  </div>
\`;

const state = {
  local: ['a: Initial commit', 'b: Add navbar', 'c: Fix button style'],
  remote: ['a: Initial commit', 'b: Add navbar'],
  status: 'Local is 1 commit ahead of remote'
};

function render() {
  document.getElementById('local-list').innerHTML = state.local.slice().reverse().map((c, i) =>
    \`<div style=\\"padding:8px 12px;background:\${i===0?'#fff5f2':'#f8f9fa'};border:1px solid \${i===0?'#F05032':'#dee2e6'};border-radius:6px;font-family:monospace;font-size:12px;margin-bottom:4px\\">\${c}</div>\`
  ).join('');
  document.getElementById('remote-list').innerHTML = state.remote.slice().reverse().map((c, i) =>
    \`<div style=\\"padding:8px 12px;background:\${i===0?'#fff5f2':'#f8f9fa'};border:1px solid \${i===0?'#F05032':'#dee2e6'};border-radius:6px;font-family:monospace;font-size:12px;margin-bottom:4px\\">\${c}</div>\`
  ).join('');
  document.getElementById('status').textContent = state.status;
}

document.getElementById('push-btn').addEventListener('click', function() {
  if (state.local.length === 0) return;
  state.remote = [...state.local];
  state.status = 'Remote is up to date with local';
  render();
});

document.getElementById('fetch-btn').addEventListener('click', function() {
  const newCommits = ['d: Remote team feature', 'e: Another team commit'];
  const next = newCommits[state.remote.length - state.local.length] || 'd: Remote team update ' + state.remote.length;
  if (!state.remote.includes(next)) state.remote.push(next);
  state.status = 'Fetched! Remote has new commits. Run pull to merge.';
  render();
});

document.getElementById('pull-btn').addEventListener('click', function() {
  state.local = [...state.remote];
  state.status = 'Local is now up to date with remote';
  render();
});

document.getElementById('commit-btn').addEventListener('click', function() {
  const msgs = ['Update styles', 'Add tests', 'Refactor API', 'Fix edge case'];
  const hash = String.fromCharCode(97 + state.local.length % 26);
  state.local.push(hash + ': ' + msgs[state.local.length % msgs.length]);
  state.status = 'New local commit. Push to sync with remote.';
  render();
});

render();`,
      css: `body { padding: 16px; font-family: system-ui, sans-serif; background: #f0f2f5; }
h3 { color: #F05032; margin: 0 0 12px 0; font-size: 15px; }
.cols { display: flex; gap: 12px; margin-bottom: 12px; }
.col { flex: 1; background: white; border-radius: 8px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,.1); min-height: 120px; }
.col-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #F05032; margin-bottom: 8px; }
#status { font-size: 12px; color: #555; font-weight: 600; margin-bottom: 10px; background: #fff; padding: 8px 12px; border-radius: 6px; border-left: 3px solid #F05032; }
.buttons { display: flex; gap: 8px; flex-wrap: wrap; }
button { padding: 8px 14px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 12px; }
#push-btn { background: #F05032; color: white; }
#fetch-btn { background: #2196F3; color: white; }
#pull-btn { background: #4CAF50; color: white; }
#commit-btn { background: #FF9800; color: white; }`
    }
  ],
  exercises: [
    {
      id: 'ex-git-6-1',
      question: 'What does git push -u origin main do that plain git push does not?',
      type: 'multiple-choice',
      options: [
        'It uploads all branches instead of just main',
        'It sets up tracking so future git push and git pull work without arguments',
        'It forces the push even if there are conflicts',
        'It creates the remote repository if it does not exist'
      ],
      correct: 1,
      explanation: 'The -u (--set-upstream) flag sets up a tracking relationship between your local branch and the remote branch. After this, you can run git push and git pull without specifying the remote and branch name.'
    },
    {
      id: 'ex-git-6-2',
      question: 'What is the key difference between git fetch and git pull?',
      type: 'multiple-choice',
      options: [
        'git fetch downloads only recent commits, git pull downloads all commits',
        'git fetch downloads changes without merging them, git pull downloads and merges immediately',
        'git fetch works only with HTTPS, git pull works only with SSH',
        'git fetch updates remote-tracking branches only, git pull updates all branches'
      ],
      correct: 1,
      explanation: 'git fetch downloads remote changes and updates remote-tracking branches (like origin/main) but does not touch your local branches. git pull runs fetch then immediately merges the changes.'
    },
    {
      id: 'ex-git-6-3',
      question: 'What is origin in the context of a Git remote?',
      type: 'multiple-choice',
      options: [
        'The first commit in the repository',
        'The main branch of your project',
        'The default name given to the primary remote repository',
        'The URL of your local machine'
      ],
      correct: 2,
      explanation: 'origin is the conventional name given to the primary remote repository. It is set automatically when you clone a repository or manually when you add a remote with git remote add origin <url>.'
    }
  ],
  quiz: [
    {
      id: 'q-git-6-1',
      question: 'What is origin/main in Git?',
      options: [
        'Your local main branch',
        'A remote-tracking branch that mirrors the last known state of main on the remote',
        'The default branch on GitHub',
        'An alias for git remote origin'
      ],
      correct: 1,
      explanation: 'origin/main is a remote-tracking branch — a local read-only reference that records the last known state of the main branch on the origin remote. It is updated when you fetch.'
    },
    {
      id: 'q-git-6-2',
      question: 'Which command lists all remotes with their fetch and push URLs?',
      options: ['git remote', 'git remote -v', 'git remote show', 'git remote list'],
      correct: 1,
      explanation: 'git remote -v (verbose) shows each remote name with both its fetch URL and push URL on separate lines.'
    },
    {
      id: 'q-git-6-3',
      question: 'What is the risk of using git push --force on a shared branch?',
      options: [
        'It uploads too many files at once and causes a timeout',
        'It forces authentication re-entry for all team members',
        'It overwrites the remote history, destroying commits your teammates pushed',
        'It locks the remote branch preventing others from pushing'
      ],
      correct: 2,
      explanation: 'git push --force rewrites the remote branch history. Any commits your teammates pushed that are not in your local history will be deleted from the remote, causing data loss and diverged histories.'
    }
  ]
};
