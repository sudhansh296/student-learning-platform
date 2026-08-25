import type { GitLesson } from '../git-curriculum';

export const lesson02: GitLesson = {
  id: 'git-02',
  title: 'Installing Git and First-Time Setup',
  slug: '02-setup',
  chapter: 'basics',
  order: 2,
  difficulty: 'beginner',
  readingTime: 10,
  description: 'Install Git on any platform, configure your identity, set a default editor, and understand the .gitconfig file.',
  sections: [
    {
      type: 'text',
      content: 'Before you can use Git you need to install it and configure your identity. Git needs to know your name and email address because every commit you create embeds this information permanently into the history.'
    },
    {
      type: 'heading',
      content: 'Installing Git'
    },
    {
      type: 'example',
      title: 'Install on Windows',
      content: 'Download the official installer from git-scm.com or use winget from a PowerShell prompt.',
      code: `# Option 1: winget (Windows Package Manager)
winget install --id Git.Git -e --source winget

# Option 2: Download installer
# Visit https://git-scm.com/download/win
# Run the .exe and follow the wizard`,
      language: 'bash'
    },
    {
      type: 'example',
      title: 'Install on macOS',
      content: 'macOS ships with an outdated Git. Install a current version via Homebrew.',
      code: `# Install Homebrew first if needed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Then install Git
brew install git

# Verify the installation
git --version`,
      language: 'bash',
      output: 'git version 2.44.0'
    },
    {
      type: 'example',
      title: 'Install on Linux',
      content: 'Use your distribution package manager to install Git from official repositories.',
      code: `# Debian / Ubuntu
sudo apt update && sudo apt install git

# Fedora / RHEL
sudo dnf install git

# Arch Linux
sudo pacman -S git`,
      language: 'bash'
    },
    {
      type: 'heading',
      content: 'First-Time Identity Configuration'
    },
    {
      type: 'text',
      content: 'The very first thing you must do after installing Git is set your name and email address. This information is baked into every commit and cannot be changed after the fact without rewriting history.'
    },
    {
      type: 'example',
      title: 'Setting Name and Email',
      content: 'Use the --global flag so these settings apply to every repository on your machine.',
      code: `git config --global user.name "Your Name"
git config --global user.email "you@example.com"`,
      language: 'bash'
    },
    {
      type: 'heading',
      content: 'Setting a Default Editor'
    },
    {
      type: 'text',
      content: 'Git opens a text editor when you write a multi-line commit message or need to resolve interactive operations. The default is usually vi, which confuses many beginners. Change it to a friendlier editor.'
    },
    {
      type: 'example',
      title: 'Configuring Your Editor',
      content: 'Set VS Code, nano, or vim as the editor Git uses for commit messages and interactive operations.',
      code: `# VS Code (most popular choice)
git config --global core.editor "code --wait"

# Nano (beginner friendly terminal editor)
git config --global core.editor "nano"

# Vim (for power users)
git config --global core.editor "vim"`,
      language: 'bash'
    },
    {
      type: 'heading',
      content: 'Viewing Your Configuration'
    },
    {
      type: 'example',
      title: 'Listing All Config Values',
      content: 'The --list flag shows every configuration key and value, including where each one is defined.',
      code: `git config --list`,
      language: 'bash',
      output: `user.name=Your Name
user.email=you@example.com
core.editor=code --wait
core.autocrlf=input
init.defaultbranch=main`
    },
    {
      type: 'tip',
      title: 'Checking a Single Value',
      content: 'To check just one config value, use: git config user.name - this prints only your configured name without listing everything else.'
    },
    {
      type: 'heading',
      content: 'The .gitconfig File'
    },
    {
      type: 'text',
      content: 'Git stores global configuration in a plain text file called .gitconfig in your home directory. You can edit it directly in a text editor instead of using the git config command.'
    },
    {
      type: 'example',
      title: '.gitconfig File Format',
      content: 'The .gitconfig file uses INI format with sections and key-value pairs.',
      code: `[user]
    name = Your Name
    email = you@example.com

[core]
    editor = code --wait
    autocrlf = input

[init]
    defaultBranch = main

[alias]
    st = status
    co = checkout
    br = branch`,
      language: 'ini'
    },
    {
      type: 'note',
      title: 'Config Levels',
      content: 'Git has three config levels: system (all users on the machine), global (your user account, stored in ~/.gitconfig), and local (single repository, stored in .git/config). Local overrides global, which overrides system.'
    },
    {
      type: 'heading',
      content: 'Getting Help'
    },
    {
      type: 'example',
      title: 'Git Help Command',
      content: 'Git has built-in help for every command. Use --help for the full manual page or -h for a compact summary.',
      code: `# Full manual page for any command
git help config

# Compact one-page summary
git config -h

# Open the Git reference manual in a browser
git help -w commit`,
      language: 'bash'
    },
    {
      type: 'warning',
      title: 'Line Ending Settings',
      content: 'On Windows, set core.autocrlf to true. On macOS and Linux, set it to input. Mismatched line endings cause noisy diffs and can break shell scripts.'
    },
    {
      type: 'tryit',
      title: '.gitconfig Builder',
      js: `document.body.innerHTML = \`
  <h3>.gitconfig Generator</h3>
  <div class="field">
    <label>Your Name</label>
    <input type="text" id="name" placeholder="John Doe" />
  </div>
  <div class="field">
    <label>Email Address</label>
    <input type="email" id="email" placeholder="john@example.com" />
  </div>
  <div class="field">
    <label>Default Editor</label>
    <select id="editor">
      <option value="code --wait">VS Code</option>
      <option value="nano">Nano</option>
      <option value="vim">Vim</option>
      <option value="emacs">Emacs</option>
    </select>
  </div>
  <div class="field">
    <label>Default Branch Name</label>
    <select id="branch">
      <option value="main">main</option>
      <option value="master">master</option>
    </select>
  </div>
  <button id="gen-btn">Generate .gitconfig</button>
  <div id="preview-block">
    <h4>Generated Configuration:</h4>
    <pre id="preview"></pre>
  </div>
\`;

function generate() {
  const name = document.getElementById('name').value.trim() || 'Your Name';
  const email = document.getElementById('email').value.trim() || 'you@example.com';
  const editor = document.getElementById('editor').value;
  const branch = document.getElementById('branch').value;

  const config = \`[user]
    name = \${name}
    email = \${email}

[core]
    editor = \${editor}
    autocrlf = input

[init]
    defaultBranch = \${branch}

[alias]
    st = status
    co = checkout
    br = branch
    lg = log --oneline --graph --all\`;

  document.getElementById('preview').textContent = config;
  document.getElementById('preview-block').style.display = 'block';
}

document.getElementById('gen-btn').addEventListener('click', generate);`,
      css: `body { padding: 20px; font-family: system-ui, sans-serif; background: #f0f2f5; }
h3 { color: #F05032; margin: 0 0 16px 0; }
.field { margin-bottom: 12px; }
label { display: block; font-size: 12px; font-weight: 600; color: #555; margin-bottom: 4px; }
input, select { width: 100%; padding: 8px 10px; border: 1px solid #ccc; border-radius: 6px; font-size: 13px; box-sizing: border-box; }
#gen-btn { background: #F05032; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 13px; margin-top: 4px; }
#gen-btn:hover { background: #d94526; }
#preview-block { margin-top: 16px; display: none; }
#preview-block h4 { font-size: 12px; color: #888; margin: 0 0 6px 0; }
#preview { background: #1e1e1e; color: #9cdcfe; padding: 16px; border-radius: 8px; font-family: monospace; font-size: 12px; white-space: pre; line-height: 1.6; }`
    }
  ],
  exercises: [
    {
      id: 'ex-git-2-1',
      question: 'Which git config flag makes a setting apply to all repositories for the current user?',
      type: 'multiple-choice',
      options: [
        '--local',
        '--system',
        '--global',
        '--all'
      ],
      correct: 2,
      explanation: 'The --global flag stores the setting in the ~/.gitconfig file which applies to all repositories owned by the current user on this machine.'
    },
    {
      id: 'ex-git-2-2',
      question: 'Where does Git store the global configuration file?',
      type: 'multiple-choice',
      options: [
        'Inside the .git folder of your current project',
        'In the /etc/gitconfig system file',
        'In your home directory as ~/.gitconfig',
        'In the current working directory as .gitconfig'
      ],
      correct: 2,
      explanation: 'Global Git configuration is stored in ~/.gitconfig (your home directory). This file applies to all repositories for your user account.'
    },
    {
      id: 'ex-git-2-3',
      question: 'What command shows your currently configured Git name and email along with all other settings?',
      type: 'multiple-choice',
      options: [
        'git status',
        'git config --list',
        'git log --config',
        'git show config'
      ],
      correct: 1,
      explanation: 'git config --list displays all configuration values from all levels (system, global, and local), showing every key-value pair.'
    }
  ],
  quiz: [
    {
      id: 'q-git-2-1',
      question: 'Why does Git require you to set user.name and user.email before making commits?',
      options: [
        'For billing and licensing purposes',
        'Because every commit permanently records the author name and email',
        'So Git can send you email notifications',
        'It is optional and only needed for GitHub'
      ],
      correct: 1,
      explanation: 'Every Git commit permanently embeds the author name and email in the commit object. Without this configuration, Git cannot create valid commits.'
    },
    {
      id: 'q-git-2-2',
      question: 'Which config level takes highest precedence when values conflict?',
      options: ['system', 'global', 'local', 'They all have equal priority'],
      correct: 2,
      explanation: 'Local config (stored in the repository .git/config) overrides global (user ~/.gitconfig), which overrides system (/etc/gitconfig). Local has highest precedence.'
    },
    {
      id: 'q-git-2-3',
      question: 'What does the command "git config --global core.editor \"code --wait\"" do?',
      options: [
        'Installs VS Code on your machine',
        'Sets VS Code as the default Git editor for all repositories',
        'Opens VS Code with the current git config file',
        'Enables VS Code Git extension'
      ],
      correct: 1,
      explanation: 'This command sets VS Code as the default editor Git uses for commit messages and interactive operations across all repositories on your machine.'
    }
  ]
};
