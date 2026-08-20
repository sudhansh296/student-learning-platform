import type { DockerLesson } from '../docker-curriculum';

export const lesson10: DockerLesson = {
  id: 'docker-10',
  title: 'Docker Hub and Container Registries',
  slug: '10-registry',
  chapter: 'production',
  order: 10,
  difficulty: 'intermediate',
  readingTime: 11,
  description: 'Push images to Docker Hub, understand image tagging strategies, and learn about the registries used in production workflows.',
  sections: [
    {
      type: 'text',
      content: 'A container registry is a storage and distribution system for Docker images. Docker Hub is the default public registry, but production teams also use GitHub Container Registry, AWS ECR, and Google Artifact Registry to keep images close to their deployment infrastructure.'
    },
    {
      type: 'heading',
      content: 'Docker Hub Overview'
    },
    {
      type: 'table',
      title: 'Docker Hub free vs paid tiers',
      headers: ['Feature', 'Free Tier', 'Pro/Team Tier'],
      rows: [
        ['Public repos', 'Unlimited', 'Unlimited'],
        ['Private repos', '1', 'Unlimited'],
        ['Pull rate limit', '100/6h (anonymous), 200/6h (authenticated)', 'No limit'],
        ['Image scanning', 'Not included', 'Included'],
        ['Parallel builds', '1', 'Multiple'],
        ['Official images', 'Full access', 'Full access']
      ]
    },
    {
      type: 'heading',
      content: 'Logging In and Out'
    },
    {
      type: 'example',
      title: 'docker login and docker logout',
      content: 'The docker login command authenticates the Docker CLI with a registry. Once logged in, push and pull operations against that registry are authenticated. Always use docker logout on shared machines to remove stored credentials.',
      code: `# Log in to Docker Hub (prompts for username and password)
docker login

# Log in with credentials directly (useful in scripts)
docker login -u myusername -p mypassword

# Log in to a private or alternative registry
docker login registry.example.com

# Log out to clear stored credentials
docker logout`,
      language: 'bash',
      output: `Login Succeeded
Logging in with your password grants your terminal complete access to your account.
For better security, log in with a limited-privilege personal access token.`
    },
    {
      type: 'note',
      title: 'Use Personal Access Tokens',
      content: 'Instead of your Docker Hub password, create a Personal Access Token in your Docker Hub account settings. Tokens can have limited permissions (read-only) and can be revoked individually, making them much safer for CI/CD pipelines and shared environments.'
    },
    {
      type: 'heading',
      content: 'Tagging Images'
    },
    {
      type: 'text',
      content: 'Before you can push an image to Docker Hub, it must be tagged with your username and repository name. The docker tag command creates a new tag pointing to the same image layers — no data is duplicated. Image tags follow the convention username/repository:tag.'
    },
    {
      type: 'example',
      title: 'docker tag -- naming an image for a registry',
      content: 'This command creates a new tag alias for an existing image. The source can be an existing image name or ID. The destination format for Docker Hub is username/reponame:version. Multiple tags can point to the same image without duplicating data.',
      code: `# Tag a locally built image for Docker Hub
docker tag myapp:latest myusername/myapp:1.0.0

# Apply multiple tags to the same image
docker tag myapp:latest myusername/myapp:latest
docker tag myapp:latest myusername/myapp:1.0.0

# Tag for a private registry
docker tag myapp:latest registry.example.com/team/myapp:1.0.0`,
      language: 'bash'
    },
    {
      type: 'heading',
      content: 'Pushing and Pulling Images'
    },
    {
      type: 'example',
      title: 'docker push -- uploading an image to a registry',
      content: 'Docker push uploads your local image layers to the registry. Layers that already exist in the registry are skipped, making subsequent pushes fast. Only changed layers are uploaded, which is the same mechanism that makes image pulls efficient.',
      code: `# Push image to Docker Hub
docker push myusername/myapp:1.0.0

# Push all tags for a repository
docker push --all-tags myusername/myapp

# Pull a specific version
docker pull myusername/myapp:1.0.0`,
      language: 'bash',
      output: `The push refers to repository [docker.io/myusername/myapp]
5f70bf18a086: Pushed
a3b14e5e3b09: Pushed
e3d7e1c56a99: Layer already exists
1.0.0: digest: sha256:a4f2... size: 1578`
    },
    {
      type: 'heading',
      content: 'Image Versioning Strategy'
    },
    {
      type: 'text',
      content: 'Never rely on the :latest tag in production. The :latest tag changes when you push a new version, making deployments unpredictable. Use semantic versioning (MAJOR.MINOR.PATCH) so every deployment references a specific, immutable image version.'
    },
    {
      type: 'table',
      title: 'Image tagging strategies',
      headers: ['Strategy', 'Example Tag', 'Use Case'],
      rows: [
        ['Semantic version', 'myapp:2.1.0', 'Production releases — predictable and immutable'],
        ['Git SHA', 'myapp:a3f2e81', 'CI/CD pipelines — exact code traceability'],
        ['Branch + SHA', 'myapp:main-a3f2e81', 'Staging environments per branch'],
        ['Date-based', 'myapp:2026-08-19', 'Nightly builds and scheduled releases'],
        ['Environment', 'myapp:prod', 'Only when referencing the latest of a channel'],
        ['Avoid in prod', 'myapp:latest', 'Unpredictable — tag changes with each push']
      ]
    },
    {
      type: 'example',
      title: 'Complete build-tag-push workflow',
      content: 'This script represents the standard workflow for building, tagging, and pushing an image from a CI/CD pipeline. The image is tagged with both the specific version and latest, then both are pushed so the latest convenience tag is also updated.',
      code: `# Complete tagging and push workflow
VERSION="1.2.3"
REPO="myusername/myapp"

# Build the image
docker build -t \${REPO}:\${VERSION} .

# Also tag as latest for convenience
docker tag \${REPO}:\${VERSION} \${REPO}:latest

# Push both tags
docker push \${REPO}:\${VERSION}
docker push \${REPO}:latest

# Verify it is available
docker pull \${REPO}:\${VERSION}`,
      language: 'bash',
      output: `Successfully built a3b14e5e3b09
Successfully tagged myusername/myapp:1.2.3
Successfully tagged myusername/myapp:latest`
    },
    {
      type: 'heading',
      content: 'Other Popular Registries'
    },
    {
      type: 'table',
      title: 'Container registry comparison',
      headers: ['Registry', 'Provider', 'Authentication', 'Best For'],
      rows: [
        ['Docker Hub', 'Docker Inc.', 'docker login', 'Public images, open source projects'],
        ['GitHub Container Registry (ghcr.io)', 'GitHub', 'docker login ghcr.io', 'Projects hosted on GitHub'],
        ['AWS ECR', 'Amazon Web Services', 'aws ecr get-login-password', 'AWS ECS/EKS deployments'],
        ['Google Artifact Registry', 'Google Cloud', 'gcloud auth configure-docker', 'GKE and Google Cloud Run'],
        ['Azure Container Registry', 'Microsoft Azure', 'az acr login', 'Azure Kubernetes Service'],
        ['Self-hosted Registry', 'Open Source', 'docker login registry.internal', 'Air-gapped or private infrastructure']
      ]
    },
    {
      type: 'example',
      title: 'Pushing to GitHub Container Registry',
      content: 'GitHub Container Registry uses your GitHub Personal Access Token for authentication and stores images alongside your repositories. Image names follow the pattern ghcr.io/username/imagename, and images can be linked to a GitHub repository for integrated visibility.',
      code: `# Log in using a GitHub Personal Access Token
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Tag image for ghcr.io
docker tag myapp:1.0.0 ghcr.io/myusername/myapp:1.0.0

# Push to GitHub Container Registry
docker push ghcr.io/myusername/myapp:1.0.0`,
      language: 'bash',
      output: `Login Succeeded
The push refers to repository [ghcr.io/myusername/myapp]
1.0.0: digest: sha256:a4f2... size: 1578`
    },
    {
      type: 'heading',
      content: 'Image Scanning'
    },
    {
      type: 'text',
      content: 'Container image scanning analyzes image layers for known security vulnerabilities in OS packages and application dependencies. Docker Scout (integrated into Docker Desktop and Docker Hub), Trivy, and Snyk are popular tools. Running scans in CI prevents vulnerable images from reaching production.'
    },
    {
      type: 'example',
      title: 'Scanning an image with Docker Scout',
      content: 'Docker Scout analyzes an image and reports CVEs found in its packages and dependencies. The quickview command provides a fast summary while cves gives full details. This integrates with Docker Hub for automatic scanning on push.',
      code: `# Quick vulnerability summary
docker scout quickview myapp:1.0.0

# Full CVE report for an image
docker scout cves myapp:1.0.0

# Compare two images for security regressions
docker scout compare myapp:1.0.0 myapp:1.1.0`,
      language: 'bash',
      output: `  Overview
  Image: myapp:1.0.0
  Digest: sha256:a4f2...

  Vulnerabilities
  Critical:  0
  High:      1
  Medium:    3
  Low:       8

  Packages:  42 total, 1 with vulnerabilities`
    },
    {
      type: 'tryit',
      title: 'Image Tagging and Push Simulator',
      js: `var imageName = 'myapp';
var imageVersion = '1.0.0';
var username = 'devuser';
var tags = [];
var pushed = false;

function renderTags() {
  var container = document.getElementById('tags-container');
  if (tags.length === 0) {
    container.innerHTML = '<div style="color:#8b949e;font-size:12px;font-style:italic">No tags yet</div>';
    return;
  }
  container.innerHTML = tags.map(function(t) {
    return '<span class="tag-badge">' + t + '</span>';
  }).join('');
}

function log(msg, color) {
  var output = document.getElementById('push-log');
  var line = document.createElement('div');
  line.style.cssText = 'font-size:12px;font-family:monospace;padding:2px 0;color:' + (color || '#c9d1d9');
  line.textContent = msg;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

function clearLog() {
  document.getElementById('push-log').innerHTML = '';
  pushed = false;
  document.getElementById('success-panel').style.display = 'none';
}

document.getElementById('tag-btn').addEventListener('click', function() {
  var nameVal = document.getElementById('img-name').value.trim() || imageName;
  var verVal = document.getElementById('img-version').value.trim() || imageVersion;
  var userVal = document.getElementById('img-user').value.trim() || username;
  var fullTag = userVal + '/' + nameVal + ':' + verVal;
  if (!tags.includes(fullTag)) {
    tags.push(fullTag);
    renderTags();
  }
});

document.getElementById('push-btn').addEventListener('click', async function() {
  if (tags.length === 0) {
    log('Error: no tags to push. Tag the image first.', '#dc3545');
    return;
  }
  if (pushed) {
    clearLog();
  }
  var btn = this;
  btn.disabled = true;
  var tag = tags[tags.length - 1];
  log('The push refers to repository [docker.io/' + tag.split(':')[0] + ']', '#c9d1d9');

  function delay(ms) { return new Promise(function(r) { setTimeout(r, ms); }); }

  await delay(400);
  log('Preparing layer 1/3 ...', '#8b949e');
  await delay(500);
  log('Preparing layer 2/3 ...', '#8b949e');
  await delay(400);
  log('Preparing layer 3/3 ...', '#8b949e');
  await delay(300);
  log('Pushing layer 1/3 ...', '#fd7e14');
  await delay(600);
  log('Pushing layer 2/3 ...', '#fd7e14');
  await delay(500);
  log('Layer 3/3: already exists in registry', '#6c757d');
  await delay(400);
  log('Pushed ' + tag, '#28a745');
  await delay(200);
  log(tag.split(':')[1] + ': digest: sha256:a4f2e8b3c1d9... size: 1578', '#57d4a0');

  var panel = document.getElementById('success-panel');
  document.getElementById('pull-cmd').textContent = 'docker pull ' + tag;
  panel.style.display = 'block';
  pushed = true;
  btn.disabled = false;
});

document.getElementById('clear-btn').addEventListener('click', function() {
  tags = [];
  renderTags();
  clearLog();
});

renderTags();`,
      css: `body { padding: 16px; font-family: system-ui, sans-serif; background: #0d1117; color: #c9d1d9; }
h3 { color: #2496ED; margin: 0 0 12px 0; font-size: 15px; font-weight: 700; }
.form-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; align-items: flex-end; }
.form-field { display: flex; flex-direction: column; gap: 3px; }
.form-field label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #8b949e; }
.form-field input { background: #21262d; color: #c9d1d9; border: 1px solid #30363d; padding: 6px 10px; border-radius: 6px; font-size: 12px; font-family: monospace; width: 110px; }
.btn { border: none; padding: 7px 14px; border-radius: 6px; font-weight: 700; font-size: 12px; cursor: pointer; font-family: monospace; }
#tag-btn { background: #2496ED; color: white; }
#push-btn { background: #28a745; color: white; }
#clear-btn { background: #30363d; color: #8b949e; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.tags-section { margin-bottom: 10px; }
.tags-label { font-size: 11px; color: #8b949e; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
#tags-container { min-height: 28px; display: flex; flex-wrap: wrap; gap: 6px; }
.tag-badge { background: #1a3a5c; color: #58a6ff; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-family: monospace; border: 1px solid #2496ED; }
#push-log { background: #0d1117; border: 1px solid #30363d; border-radius: 8px; padding: 12px; min-height: 80px; max-height: 160px; overflow-y: auto; margin-bottom: 10px; }
#success-panel { display: none; background: #0f2e1a; border: 1px solid #28a745; border-radius: 8px; padding: 12px; }
.success-title { color: #28a745; font-weight: 700; font-size: 13px; margin-bottom: 6px; }
#pull-cmd { font-family: monospace; font-size: 12px; color: #57d4a0; background: #0d1117; padding: 6px 10px; border-radius: 4px; display: block; }`
    },
    {
      type: 'tip',
      title: 'Use Docker Hub Automated Builds',
      content: 'Link your Docker Hub repository to your GitHub or GitLab repository and enable automated builds. Every push to main (or a tag) automatically builds and pushes the image. This eliminates manual push steps and ensures your registry always reflects the latest code.'
    }
  ],
  exercises: [
    {
      id: 'ex-docker-10-1',
      question: 'What must you do before pushing an image to Docker Hub for the first time?',
      type: 'multiple-choice',
      options: [
        'Run docker build with the --push flag',
        'Tag the image with your Docker Hub username using docker tag, then run docker push',
        'Create a Dockerfile with the PUSH instruction',
        'Run docker export before docker push'
      ],
      correct: 1,
      explanation: 'You must tag your image with the format username/reponame:tag using docker tag. Docker Hub uses the username prefix to determine which account to push to. Without the username prefix, Docker does not know where to push the image.'
    },
    {
      id: 'ex-docker-10-2',
      question: 'Why is using :latest as the image tag not recommended in production deployments?',
      type: 'multiple-choice',
      options: [
        'The :latest tag is reserved for Docker Hub official images only',
        'The :latest tag is not supported by AWS ECS and Kubernetes',
        'The :latest tag changes whenever a new version is pushed, making deployments unpredictable and hard to roll back',
        'Docker does not allow :latest in ENTRYPOINT instructions'
      ],
      correct: 2,
      explanation: 'The :latest tag is just a conventional name that gets reassigned to the newest image with each push. If two deployments use :latest but were deployed at different times, they may run different code. Use semantic version tags like :1.2.3 for predictable, reproducible deployments.'
    },
    {
      id: 'ex-docker-10-3',
      question: 'What is the difference between Docker Hub and GitHub Container Registry?',
      type: 'multiple-choice',
      options: [
        'Docker Hub supports only public images; GitHub Container Registry supports only private images',
        'Docker Hub is a standalone service; GitHub Container Registry integrates with GitHub repositories and uses ghcr.io as the registry hostname',
        'GitHub Container Registry only supports images built with GitHub Actions',
        'They are identical services run by the same company'
      ],
      correct: 1,
      explanation: 'Docker Hub is Docker\'s own standalone registry service. GitHub Container Registry (ghcr.io) is integrated with GitHub, so images are linked to GitHub repositories, access is managed via GitHub permissions, and it works seamlessly with GitHub Actions CI/CD workflows.'
    }
  ],
  quiz: [
    {
      id: 'q-docker-10-1',
      question: 'What does docker tag do to the original image?',
      options: [
        'It creates a copy of the image with a new name',
        'It renames the original image, removing the old name',
        'It creates a new tag alias pointing to the same image layers without duplicating any data',
        'It compresses the image before tagging'
      ],
      correct: 2,
      explanation: 'docker tag creates a new tag that points to the same underlying image layers. No data is copied or duplicated. Multiple tag names can reference the same image content. You can verify this by checking that both tags have the same image ID.'
    },
    {
      id: 'q-docker-10-2',
      question: 'What happens when you push an image and some layers already exist in the registry?',
      options: [
        'Docker fails and asks you to remove existing layers first',
        'All layers are uploaded regardless of whether they exist',
        'Docker skips those layers and only uploads new or changed layers',
        'Docker merges the layers with the existing ones'
      ],
      correct: 2,
      explanation: 'Docker registries deduplicate layers. During a push, Docker checks which layers already exist in the registry and skips them, uploading only new or changed layers. This is why subsequent pushes of an image with small changes are very fast.'
    },
    {
      id: 'q-docker-10-3',
      question: 'Which image tag strategy gives the best traceability in a CI/CD pipeline?',
      options: [
        'Using :latest for every build',
        'Using the Git commit SHA as the tag (e.g., myapp:a3f2e81)',
        'Using the developer\'s name as the tag',
        'Using sequential numbers starting from :1'
      ],
      correct: 1,
      explanation: 'Tagging images with the Git commit SHA creates a direct, traceable link between every deployed image and the exact source code that produced it. You can look at any running container\'s tag and immediately check out that exact commit in your repository.'
    }
  ]
};
