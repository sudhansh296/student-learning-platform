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
      css: `*{box-sizing:border-box}body{font-family:system-ui,sans-serif;padding:14px;background:#0d1117;color:#e6edf3;margin:0;}
.title{font-size:14px;font-weight:800;color:#F05032;margin-bottom:12px;}
.controls{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;}
.ctrl-btn{padding:7px 14px;border:none;border-radius:6px;cursor:pointer;font-size:12px;font-weight:700;}
.btn-commit-main{background:#F05032;color:white;}
.btn-commit-feat{background:#2196F3;color:white;}
.btn-switch{background:#30363d;color:#e6edf3;border:1px solid #484f58;}
.btn-branch{background:#22863a;color:white;}
.btn-merge{background:#6f42c1;color:white;}
.btn-reset{background:#30363d;color:#8b949e;border:1px solid #484f58;font-size:11px;}
.info-bar{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:12px;padding:8px 12px;background:#161b22;border-radius:8px;border:1px solid #30363d;}
.info-item{font-size:11px;color:#8b949e;}<br>.info-val{color:#e6edf3;font-weight:700;font-family:monospace;}
.graph-wrap{background:#161b22;border-radius:10px;border:1px solid #30363d;padding:14px;margin-bottom:10px;overflow-x:auto;}
.branch-row{display:flex;align-items:center;gap:0;margin-bottom:4px;}
.branch-label{width:120px;font-size:11px;font-weight:700;font-family:monospace;flex-shrink:0;}
.graph-track{display:flex;align-items:center;gap:0;flex:1;}
.commit-node{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:8px;font-family:monospace;font-weight:700;color:white;flex-shrink:0;position:relative;cursor:default;}
.commit-node.head{box-shadow:0 0 0 3px #161b22,0 0 0 5px currentColor;}
.commit-line{height:2px;width:20px;flex-shrink:0;}
.commit-label{position:absolute;top:30px;left:50%;transform:translateX(-50%);font-size:8px;font-family:monospace;color:#484f58;white-space:nowrap;}
.branch-tip{font-size:9px;font-weight:800;padding:1px 5px;border-radius:3px;margin-left:6px;font-family:monospace;}
.log-wrap{background:#161b22;border-radius:8px;border:1px solid #30363d;padding:8px 12px;max-height:110px;overflow-y:auto;}
.log-title{font-size:10px;font-weight:700;color:#8b949e;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;}
.log-entry{font-size:11px;font-family:monospace;color:#8b949e;padding:1px 0;line-height:1.6;}
.log-entry .lhash{color:#f0883e;}.log-entry .lbranch{color:#58a6ff;}.log-entry .lmsg{color:#c9d1d9;}
.tip-box{background:#1f2937;border:1px solid #374151;border-radius:6px;padding:8px 12px;font-size:11px;color:#9ca3af;margin-top:8px;}
.tip-box b{color:#d1d5db;}`,
      js: `document.body.innerHTML = '<div id="output"></div>';

var MAIN_CLR='#F05032',FEAT_CLR='#2196F3',MERGE_CLR='#6f42c1';
var mainCommits=[
  {hash:'9c7e204',msg:'Initial project setup',branch:'main'},
  {hash:'f4d1b33',msg:'Fix footer layout',branch:'main'},
];
var featCommits=[
  {hash:'9c7e204',msg:'Initial project setup',branch:'main'},
  {hash:'b8e2a01',msg:'Add login form HTML',branch:'feature/login'},
  {hash:'a3f9c12',msg:'Add password validation',branch:'feature/login'},
];
var HEAD='feature';
var log=[];
var merged=false;

function shortHash(h){return h.slice(0,7);}
function randHash(){return Math.random().toString(16).slice(2,10);}

function addLog(msg){log.unshift(msg);if(log.length>12)log.pop();}

function commitToMain(){
  if(HEAD!=='main'){addLog('<span class=\\"lmsg\\">⚠ Switch to main first</span>');render();return;}
  var msgs=['Update README','Fix bug in parser','Improve performance','Refactor routes','Add unit tests'];
  var h=randHash(),m=msgs[Math.floor(Math.random()*msgs.length)];
  mainCommits.push({hash:h,msg:m,branch:'main'});
  addLog('<span class=\\"lhash\\">'+shortHash(h)+'</span> <span class=\\"lbranch\\">(main)</span> <span class=\\"lmsg\\">'+m+'</span>');
  render();
}

function commitToFeat(){
  if(HEAD!=='feature'){addLog('<span class=\\"lmsg\\">⚠ Switch to feature/login first</span>');render();return;}
  var msgs=['Add login API call','Handle auth errors','Add remember-me','Write login tests','Style login form'];
  var h=randHash(),m=msgs[Math.floor(Math.random()*msgs.length)];
  featCommits.push({hash:h,msg:m,branch:'feature/login'});
  addLog('<span class=\\"lhash\\">'+shortHash(h)+'</span> <span class=\\"lbranch\\">(feature/login)</span> <span class=\\"lmsg\\">'+m+'</span>');
  render();
}

function switchBranch(){
  HEAD=HEAD==='main'?'feature':'main';
  addLog('<span class=\\"lmsg\\">🔀 Switched to <b>'+( HEAD==='main'?'main':'feature/login')+'</b></span>');
  render();
}

function mergeBranch(){
  if(HEAD!=='main'){addLog('<span class=\\"lmsg\\">⚠ Switch to main before merging</span>');render();return;}
  if(merged){addLog('<span class=\\"lmsg\\">Already merged!</span>');render();return;}
  var h=randHash();
  mainCommits.push({hash:h,msg:'Merge branch feature/login',branch:'merge'});
  merged=true;
  addLog('<span class=\\"lhash\\">'+shortHash(h)+'</span> <span class=\\"lbranch\\">(main)</span> <span class=\\"lmsg\\">Merge branch \\'feature/login\\'</span>');
  render();
}

function resetAll(){
  mainCommits=[
    {hash:'9c7e204',msg:'Initial project setup',branch:'main'},
    {hash:'f4d1b33',msg:'Fix footer layout',branch:'main'},
  ];
  featCommits=[
    {hash:'9c7e204',msg:'Initial project setup',branch:'main'},
    {hash:'b8e2a01',msg:'Add login form HTML',branch:'feature/login'},
    {hash:'a3f9c12',msg:'Add password validation',branch:'feature/login'},
  ];
  HEAD='feature';log=[];merged=false;
  render();
}

function renderCommitRow(commits,color,label,isHead){
  var nodes=commits.map(function(c,i){
    var isMerge=c.branch==='merge';
    var clr=isMerge?MERGE_CLR:color;
    var isH=isHead&&i===commits.length-1;
    var line=i<commits.length-1?'<div class=\\"commit-line\\" style=\\"background:'+clr+'\\"></div>':'';
    return '<div class=\\"commit-node'+(isH?' head':'')+'\\" style=\\"background:'+clr+';color:'+clr+'\\" title=\\"'+c.hash+': '+c.msg+'\\">'
      +'<span style=\\"color:white\\">'+c.hash.slice(0,4)+'</span>'
      +(isH?'<div class=\\"commit-label\\" style=\\"color:'+clr+'\\">HEAD</div>':'')
      +'</div>'+line;
  }).join('');
  var tipStyle='background:'+color+'22;color:'+color+';border:1px solid '+color+'44';
  var tip='<span class=\\"branch-tip\\" style=\\"'+tipStyle+'\\">'+label+'</span>';
  return '<div class=\\"branch-row\\">'
    +'<div class=\\"branch-label\\" style=\\"color:'+color+'\\">'+label+'</div>'
    +'<div class=\\"graph-track\\">'+nodes+tip+(isHead?'<span class=\\"branch-tip\\" style=\\"background:#58a6ff22;color:#58a6ff;border:1px solid #58a6ff44;margin-left:4px\\">HEAD</span>':'')+'</div>'
  +'</div>';
}

function render(){
  var mainIsHead=HEAD==='main',featIsHead=HEAD==='feature';
  var graph=renderCommitRow(mainCommits,MAIN_CLR,'main',mainIsHead)
    +renderCommitRow(featCommits,FEAT_CLR,'feature/login',featIsHead);

  var logHtml=log.length?log.map(function(l){return '<div class=\\"log-entry\\">'+l+'</div>';}).join('')
    :'<div class=\\"log-entry\\" style=\\"color:#484f58\\">No operations yet — use the buttons above</div>';

  document.getElementById('output').innerHTML=
    '<div class=\\"title\\">🌿 Git Branch Graph</div>'+
    '<div class=\\"controls\\">'+
      '<button class=\\"ctrl-btn btn-commit-main\\" id=\\"btn-commit-main\\">💾 Commit to main</button>'+
      '<button class=\\"ctrl-btn btn-commit-feat\\" id=\\"btn-commit-feat\\">💾 Commit to feature</button>'+
      '<button class=\\"ctrl-btn btn-switch\\" id=\\"btn-switch\\">⇄ Switch Branch</button>'+
      '<button class=\\"ctrl-btn btn-merge\\" id=\\"btn-merge\\">⑂ Merge → main</button>'+
      '<button class=\\"ctrl-btn btn-reset\\" id=\\"btn-reset\\">↺ Reset</button>'+
    '</div>'+
    '<div class=\\"info-bar\\">'+
      '<span class=\\"info-item\\">HEAD → <span class=\\"info-val\\">'+(HEAD==='main'?'main':'feature/login')+'</span></span>'+
      '<span class=\\"info-item\\">main commits: <span class=\\"info-val\\">'+mainCommits.length+'</span></span>'+
      '<span class=\\"info-item\\">feature commits: <span class=\\"info-val\\">'+featCommits.length+'</span></span>'+
      '<span class=\\"info-item\\">merged: <span class=\\"info-val\\" style=\\"color:'+(merged?'#22863a':'#8b949e')+'\\">'+(merged?'yes':'no')+'</span></span>'+
    '</div>'+
    '<div class=\\"graph-wrap\\">'+graph+'</div>'+
    '<div class=\\"log-wrap\\">'+
      '<div class=\\"log-title\\">Operation Log</div>'+logHtml+
    '</div>'+
    '<div class=\\"tip-box\\"><b>git switch -c feature/login</b> — creates &amp; switches<br>'+
    '<b>git commit -m \\"msg\\"</b> — saves a snapshot<br>'+
    '<b>git merge feature/login</b> — merges into current branch</div>';
  
  document.getElementById('btn-commit-main').onclick=commitToMain;
  document.getElementById('btn-commit-feat').onclick=commitToFeat;
  document.getElementById('btn-switch').onclick=switchBranch;
  document.getElementById('btn-merge').onclick=mergeBranch;
  document.getElementById('btn-reset').onclick=resetAll;
}

render();`,
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
