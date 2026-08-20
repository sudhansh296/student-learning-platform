import type { GitLesson } from '../git-curriculum';

export const lesson09: GitLesson = {
  id: 'git-09',
  title: 'Tags, Releases, and Git Workflows',
  slug: '09-tags-workflows',
  chapter: 'advanced',
  order: 9,
  difficulty: 'intermediate',
  readingTime: 11,
  description: 'Mark releases with tags, understand semantic versioning, and learn Git Flow, GitHub Flow, and trunk-based development.',
  sections: [
    {
      type: 'text',
      content: 'Tags, versioning, and team workflows are the glue that holds professional Git usage together. They transform a collection of commits into a coordinated release process that the entire team can follow.'
    },
    {
      type: 'heading',
      content: 'Git Tags'
    },
    {
      type: 'text',
      content: 'A tag is a named reference to a specific commit, typically used to mark release points. Unlike branches, tags do not move as new commits are added. There are two types: lightweight tags and annotated tags.'
    },
    {
      type: 'example',
      title: 'Lightweight vs Annotated Tags',
      content: 'Lightweight tags are simple pointers. Annotated tags store extra metadata like the tagger name, date, and a message — use these for releases.',
      code: `# Create a lightweight tag (simple pointer)
git tag v1.0.0

# Create an annotated tag (recommended for releases)
git tag -a v1.0.0 -m "Release version 1.0.0"

# Tag a specific commit
git tag -a v1.0.0 -m "Release 1.0.0" a3f9c12

# List all tags
git tag

# Show tag details
git show v1.0.0`,
      language: 'bash',
      output: `v0.9.0
v1.0.0
v1.1.0-beta`
    },
    {
      type: 'example',
      title: 'Pushing Tags to Remote',
      content: 'Tags are not pushed by default with git push. You must explicitly push them or use --tags to push all at once.',
      code: `# Push a specific tag
git push origin v1.0.0

# Push all local tags at once
git push --tags

# Delete a local tag
git tag -d v1.0.0-beta

# Delete a remote tag
git push origin --delete v1.0.0-beta`,
      language: 'bash'
    },
    {
      type: 'heading',
      content: 'Semantic Versioning'
    },
    {
      type: 'text',
      content: 'Semantic versioning (SemVer) is the standard convention for version numbers. It uses the format MAJOR.MINOR.PATCH and each number has a specific meaning.'
    },
    {
      type: 'table',
      title: 'Semantic Versioning Rules',
      headers: ['Part', 'When to increment', 'Example change'],
      rows: [
        ['MAJOR', 'Breaking changes that are not backwards compatible', '1.0.0 to 2.0.0 (removed API)'],
        ['MINOR', 'New backwards-compatible features added', '1.0.0 to 1.1.0 (new endpoint)'],
        ['PATCH', 'Backwards-compatible bug fixes', '1.0.0 to 1.0.1 (fix crash)']
      ]
    },
    {
      type: 'heading',
      content: 'Git Flow Workflow'
    },
    {
      type: 'text',
      content: 'Git Flow is a structured branching model with two long-lived branches (main and develop) and three types of supporting branches. It works well for projects with scheduled releases.'
    },
    {
      type: 'list',
      title: 'Git Flow branch structure:',
      items: [
        'main: Always reflects production-ready state. Every commit here is a release.',
        'develop: Integration branch where features are merged before a release.',
        'feature/*: Branches off develop, merged back to develop when done.',
        'release/*: Branches off develop when ready to prepare a release, merged to both main and develop.',
        'hotfix/*: Branches off main to fix production bugs, merged to both main and develop.'
      ]
    },
    {
      type: 'heading',
      content: 'GitHub Flow'
    },
    {
      type: 'text',
      content: 'GitHub Flow is a simpler workflow with only one long-lived branch. It works well for teams that deploy continuously and do not need scheduled releases.'
    },
    {
      type: 'list',
      title: 'GitHub Flow steps:',
      items: [
        '1. Create a descriptive branch from main for your feature or fix',
        '2. Make commits on your branch',
        '3. Open a pull request as soon as you have something to discuss or review',
        '4. Team reviews and discusses the pull request',
        '5. Deploy from the branch to test in production (or staging)',
        '6. Merge the pull request to main and delete the branch'
      ]
    },
    {
      type: 'heading',
      content: 'Trunk-Based Development'
    },
    {
      type: 'text',
      content: 'Trunk-based development (TBD) is the most streamlined workflow. All developers commit directly to main (the trunk) or use very short-lived branches that merge within a day. It requires feature flags to hide incomplete work.'
    },
    {
      type: 'table',
      title: 'Workflow Comparison',
      headers: ['Workflow', 'Branch count', 'Release cadence', 'Team size', 'Best for'],
      rows: [
        ['Git Flow', 'Many (5 types)', 'Scheduled releases', 'Any', 'Apps with versioned releases'],
        ['GitHub Flow', 'Few', 'Continuous deployment', 'Small-medium', 'Web apps, SaaS'],
        ['Trunk-based', 'Minimal', 'Continuous delivery', 'Senior teams', 'High-velocity teams']
      ]
    },
    {
      type: 'heading',
      content: 'Conventional Commits'
    },
    {
      type: 'example',
      title: 'Conventional Commit Format',
      content: 'Conventional commits provide a structured format that enables automated changelog generation and semantic versioning.',
      code: `# Feature (triggers MINOR version bump)
feat: add user avatar upload

# Bug fix (triggers PATCH version bump)
fix: prevent login redirect loop on mobile

# Breaking change (triggers MAJOR version bump)
feat!: remove deprecated v1 API endpoints

# Chore - no version bump
chore: update ESLint to v9

# Documentation
docs: add API authentication guide

# With scope
feat(auth): add Google OAuth provider`,
      language: 'bash'
    },
    {
      type: 'tip',
      title: 'Automate with Conventional Commits',
      content: 'Tools like semantic-release and conventional-changelog can automatically determine the next version number and generate a changelog from your commit messages when you use the conventional commit format.'
    },
    {
      type: 'tryit',
      title: 'Semantic Versioning Calculator',
      js: `let version = { major: 1, minor: 0, patch: 0 };
const history = ['1.0.0 (initial release)'];

function versionString() {
  return version.major + '.' + version.minor + '.' + version.patch;
}

function render() {
  document.getElementById('version-display').textContent = versionString();
  document.getElementById('version-history').innerHTML = history.slice().reverse().map((v, i) =>
    \`<div style="padding:6px 10px;background:\${i===0?'#fff5f2':'#f8f9fa'};border:1px solid \${i===0?'#F05032':'#dee2e6'};border-radius:4px;font-family:monospace;font-size:12px">\${v}</div>\`
  ).join('');
}

document.getElementById('major-btn').addEventListener('click', function() {
  version.major++;
  version.minor = 0;
  version.patch = 0;
  history.push(versionString() + ' (MAJOR: breaking change)');
  render();
});

document.getElementById('minor-btn').addEventListener('click', function() {
  version.minor++;
  version.patch = 0;
  history.push(versionString() + ' (MINOR: new feature)');
  render();
});

document.getElementById('patch-btn').addEventListener('click', function() {
  version.patch++;
  history.push(versionString() + ' (PATCH: bug fix)');
  render();
});

render();`,
      css: `body { padding: 16px; font-family: system-ui, sans-serif; background: #f0f2f5; }
h3 { color: #F05032; margin: 0 0 12px 0; font-size: 15px; }
#version-display { font-size: 48px; font-weight: 900; color: #F05032; font-family: monospace; margin-bottom: 16px; text-align: center; }
.buttons { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; justify-content: center; }
button { padding: 10px 16px; border: none; border-radius: 6px; font-weight: 700; cursor: pointer; font-size: 12px; }
#major-btn { background: #f44336; color: white; }
#minor-btn { background: #4CAF50; color: white; }
#patch-btn { background: #2196F3; color: white; }
#history-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #666; margin-bottom: 8px; }
#version-history { display: flex; flex-direction: column; gap: 4px; max-height: 150px; overflow-y: auto; }`
    }
  ],
  exercises: [
    {
      id: 'ex-git-9-1',
      question: 'When should you increment the MAJOR version in semantic versioning?',
      type: 'multiple-choice',
      options: [
        'When you fix a bug',
        'When you add a new backwards-compatible feature',
        'When you make breaking changes that are not backwards compatible',
        'On every new release regardless of changes'
      ],
      correct: 2,
      explanation: 'The MAJOR version is incremented when you introduce breaking changes that are not backwards compatible. Users will need to update their code to work with the new version.'
    },
    {
      id: 'ex-git-9-2',
      question: 'What is the key difference between an annotated tag and a lightweight tag?',
      type: 'multiple-choice',
      options: [
        'Annotated tags can be pushed to remotes, lightweight tags cannot',
        'Annotated tags store extra metadata like tagger, date, and message',
        'Lightweight tags point to branches, annotated tags point to commits',
        'There is no practical difference between them'
      ],
      correct: 1,
      explanation: 'Annotated tags are stored as full Git objects with metadata including the tagger name, email, date, and a tagging message. They are recommended for releases. Lightweight tags are just pointers with no extra data.'
    },
    {
      id: 'ex-git-9-3',
      question: 'Which workflow is best suited for a team doing continuous deployment to a web app?',
      type: 'multiple-choice',
      options: [
        'Git Flow (strict branching model with develop and release branches)',
        'GitHub Flow (simple branch-from-main and pull request model)',
        'Creating one mega-branch for all features',
        'Working directly on main with no branches'
      ],
      correct: 1,
      explanation: 'GitHub Flow is designed for continuous deployment. Its simple model (branch, commit, PR, merge to main, deploy) works perfectly for web apps that ship multiple times a day.'
    }
  ],
  quiz: [
    {
      id: 'q-git-9-1',
      question: 'Why are tags not pushed automatically with git push?',
      options: [
        'Tags are stored in a different server than commits',
        'Git separates tag pushing from branch pushing; you must explicitly push tags',
        'Tags can only be created on the remote, not locally',
        'Tags are automatically synced only during git fetch'
      ],
      correct: 1,
      explanation: 'Git treats tags as separate from branches. A plain git push only uploads branch commits. You must use git push origin v1.0.0 or git push --tags to share tags with the remote.'
    },
    {
      id: 'q-git-9-2',
      question: 'In conventional commits, what does the "!" suffix mean (e.g., feat!: ...)?',
      options: [
        'The commit is a high-priority urgent fix',
        'The commit introduces a breaking change',
        'The commit must be reviewed before merging',
        'The commit is still a work in progress'
      ],
      correct: 1,
      explanation: 'The "!" appended to the type (feat!, fix!, etc.) indicates a breaking change. This maps to a MAJOR version bump in semantic versioning and signals that users must update their code.'
    },
    {
      id: 'q-git-9-3',
      question: 'In Git Flow, what is the purpose of the "develop" branch?',
      options: [
        'It is where all hotfixes are applied before going to main',
        'It is the integration branch where completed features are merged before a release',
        'It mirrors the main branch for testing purposes',
        'It is the branch individual developers work on directly'
      ],
      correct: 1,
      explanation: 'In Git Flow, develop is the integration branch. Feature branches merge into develop when complete. When develop is stable enough for a release, a release branch is created from it.'
    }
  ]
};
