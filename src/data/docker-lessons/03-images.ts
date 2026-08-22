import type { DockerLesson } from '../docker-curriculum';

export const lesson03: DockerLesson = {
  id: 'docker-03',
  title: 'Docker Images',
  slug: '03-images',
  chapter: 'images',
  order: 3,
  difficulty: 'beginner',
  readingTime: 12,
  description: 'Understand what Docker images are, how layers work, and how to find, pull, inspect, and manage images.',
  sections: [
    {
      type: 'text',
      content: 'A Docker image is a read-only template that contains everything needed to run an application: OS filesystem, runtime, libraries, application code, and configuration. Images are the blueprint; containers are the running instances created from that blueprint.'
    },
    {
      type: 'heading',
      content: 'Images Are Read-Only Templates'
    },
    {
      type: 'text',
      content: 'When you run a container from an image, Docker adds a thin writable layer on top of the image\'s read-only layers. All changes made inside a running container go into this writable layer. When the container is removed, that writable layer is discarded — the original image remains unchanged.'
    },
    {
      type: 'analogy',
      title: 'The Template and Document Analogy',
      content: 'A Docker image is like a Word template file. The template is read-only — you never modify it directly. Each time you create a new document from the template, you get your own writable copy. Many documents can be open at once from the same template, each with their own changes.'
    },
    {
      type: 'heading',
      content: 'The Layer System'
    },
    {
      type: 'text',
      content: 'Docker images are built in layers. Each instruction in a Dockerfile creates a new read-only layer stacked on top of the previous one. The Union filesystem makes all these layers appear as a single unified filesystem to the container. This layer system is what makes Docker both efficient and fast.'
    },
    {
      type: 'list',
      title: 'Benefits of the layer system:',
      items: [
        'Layers are cached: if a layer has not changed, Docker reuses it from cache on rebuild',
        'Layers are shared: multiple images that share a base layer store only one copy on disk',
        'Layers are incremental: only changed layers need to be downloaded when updating an image',
        'Layers are immutable: once created, a layer never changes, guaranteeing consistency'
      ]
    },
    {
      type: 'heading',
      content: 'Image Naming: name:tag'
    },
    {
      type: 'text',
      content: 'Docker images follow a naming convention: registry/username/repository:tag. For official images on Docker Hub the registry and username are omitted, leaving just repository:tag. The tag defaults to :latest when not specified.'
    },
    {
      type: 'table',
      title: 'Image naming examples',
      headers: ['Image Reference', 'Registry', 'Repository', 'Tag'],
      rows: [
        ['node:20-alpine', 'Docker Hub', 'library/node', '20-alpine'],
        ['postgres:16', 'Docker Hub', 'library/postgres', '16'],
        ['nginx:latest', 'Docker Hub', 'library/nginx', 'latest'],
        ['myuser/myapp:1.2.3', 'Docker Hub', 'myuser/myapp', '1.2.3'],
        ['ghcr.io/org/app:main', 'GitHub Container Registry', 'org/app', 'main'],
        ['123456.dkr.ecr.us-east-1.amazonaws.com/app:v2', 'AWS ECR', 'app', 'v2']
      ]
    },
    {
      type: 'heading',
      content: 'Pulling Images With Specific Tags'
    },
    {
      type: 'example',
      title: 'docker pull with explicit version tag',
      content: 'Pulling a specific version tag ensures you always get the same image, which is critical for reproducible environments. node:20-alpine gives you Node.js 20 on Alpine Linux, a minimal and secure base.',
      code: `docker pull node:20-alpine
docker pull postgres:16-alpine
docker pull nginx:1.25-alpine`,
      language: 'bash',
      output: `20-alpine: Pulling from library/node
96526aa774ef: Pull complete
Digest: sha256:f5e5e...
Status: Downloaded newer image for node:20-alpine`
    },
    {
      type: 'heading',
      content: 'Inspecting Images'
    },
    {
      type: 'example',
      title: 'docker images — list local images',
      content: 'This command lists all images stored locally on your machine with their repository name, tag, image ID, creation date, and total uncompressed size. Use this to inventory what you have downloaded.',
      code: `docker images`,
      language: 'bash',
      output: `REPOSITORY    TAG         IMAGE ID       CREATED        SIZE
node          20-alpine   b2c3d4e5f6a7   2 weeks ago    176MB
postgres      16-alpine   c3d4e5f6a7b8   3 weeks ago    268MB
nginx         1.25-alpine d4e5f6a7b8c9   4 weeks ago    43.3MB
hello-world   latest      c1ec31eb5944   8 months ago   13.3kB`
    },
    {
      type: 'example',
      title: 'docker image inspect — deep metadata',
      content: 'The docker image inspect command returns a JSON object with complete metadata about an image: its layers, environment variables, entry point, exposed ports, OS/architecture, and the full history of how it was built.',
      code: `docker image inspect node:20-alpine`,
      language: 'bash',
      output: `[{
  "Id": "sha256:b2c3d4e5f6a7...",
  "RepoTags": ["node:20-alpine"],
  "Created": "2024-08-01T12:00:00Z",
  "Architecture": "amd64",
  "Os": "linux",
  "Size": 176123456,
  "RootFS": {
    "Type": "layers",
    "Layers": [
      "sha256:96526aa774ef...",
      "sha256:b588e5b54d5a...",
      "sha256:c7d8e9f0a1b2..."
    ]
  }
}]`
    },
    {
      type: 'example',
      title: 'docker image ls --filter — filtered listing',
      content: 'Use filters to find specific images by dangling status, label, or reference. Dangling images are layers that have been superseded by newer builds and are no longer tagged — they waste disk space and should be pruned periodically.',
      code: `# List images with a specific label
docker image ls --filter "reference=node:*"

# List dangling (untagged) images
docker image ls --filter "dangling=true"

# Show image IDs only (useful for scripting)
docker image ls -q`,
      language: 'bash',
      output: `REPOSITORY   TAG         IMAGE ID       CREATED        SIZE
node         20-alpine   b2c3d4e5f6a7   2 weeks ago    176MB
node         18-alpine   a1b2c3d4e5f6   2 months ago   163MB`
    },
    {
      type: 'example',
      title: 'docker rmi — remove images',
      content: 'Use docker rmi to delete images from your local machine and free disk space. You cannot remove an image that has running containers — stop and remove those containers first.',
      code: `# Remove by name and tag
docker rmi node:18-alpine

# Remove by image ID
docker rmi b2c3d4e5f6a7

# Remove all dangling (untagged) images
docker image prune

# Remove all unused images (not referenced by any container)
docker image prune -a`,
      language: 'bash',
      output: `Untagged: node:18-alpine
Deleted: sha256:a1b2c3d4e5f6...
Deleted: sha256:96526aa774ef...`
    },
    {
      type: 'heading',
      content: 'Official vs Community Images'
    },
    {
      type: 'table',
      title: 'Official vs Community vs Verified images',
      headers: ['Type', 'Example', 'Maintained By', 'Trust Level'],
      rows: [
        ['Official', 'node, postgres, nginx', 'Docker + Technology team', 'Highest'],
        ['Verified Publisher', 'elastic/elasticsearch', 'Verified commercial company', 'High'],
        ['Sponsored OSS', 'grafana/grafana', 'CNCF or Docker-sponsored', 'High'],
        ['Community', 'myuser/my-app', 'Individual developer', 'Verify before use']
      ]
    },
    {
      type: 'note',
      title: 'Image Size and Build Time',
      content: 'Prefer Alpine or Slim variants for smaller image sizes. node:20-alpine is 176 MB vs node:20 at 1.1 GB. Smaller images pull faster, use less disk, and have fewer security vulnerabilities because they include fewer packages.'
    },
    {
      type: 'tip',
      title: 'Use docker history to Understand Layers',
      content: 'Run docker history IMAGE_NAME to see every layer in an image, the command that created it, and its size. This is invaluable for debugging large images — you can identify which Dockerfile instruction created the largest layers.'
    },
    {
      type: 'tryit',
      title: 'Image Layer Visualizer',
      js: `document.body.innerHTML = '<div><h3>Docker Image Layers</h3><button id="inspect-btn">Inspect Image</button><div id="layer-stack"></div><div id="total-size"></div></div>';

var layers = [
  { name: 'App Config', size: '2 MB', color: '#2496ED', detail: 'COPY .env.example /app/' },
  { name: 'App Code', size: '8 MB', color: '#17a2b8', detail: 'COPY . /app' },
  { name: 'npm Packages', size: '45 MB', color: '#28a745', detail: 'RUN npm ci --only=production' },
  { name: 'Node.js 20', size: '60 MB', color: '#fd7e14', detail: 'FROM node:20-alpine' },
  { name: 'Alpine Linux 3.19', size: '7 MB', color: '#6f42c1', detail: 'Base OS layer' }
];

var inspecting = false;

function render() {
  var stack = document.getElementById('layer-stack');
  stack.innerHTML = layers.map(function(l, i) {
    return '<div class="layer-card" style="border-left:4px solid ' + l.color + ';background:' + (inspecting ? 'white' : '#f8f9fa') + '" data-idx="' + i + '">' +
      '<div class="layer-name">' + l.name + '</div>' +
      (inspecting ? '<div class="layer-detail" style="color:#6c757d;font-size:11px;font-family:monospace;margin-top:2px">' + l.detail + '</div>' : '') +
      '<div class="layer-size" style="color:' + l.color + '">' + l.size + '</div>' +
      '</div>';
  }).join('');
  document.getElementById('total-size').textContent = 'Total: 122 MB';
}

document.getElementById('inspect-btn').addEventListener('click', function() {
  inspecting = !inspecting;
  this.textContent = inspecting ? 'Hide Details' : 'Inspect Image';
  render();
});

render();`,
      css: `body { padding: 16px; font-family: system-ui, sans-serif; background: #f0f4f8; }
h3 { color: #2496ED; margin: 0 0 8px 0; font-size: 15px; font-weight: 700; }
#inspect-btn { background: #2496ED; color: white; border: none; padding: 9px 18px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 13px; margin-bottom: 14px; }
#inspect-btn:hover { background: #1a7abf; }
#layer-stack { display: flex; flex-direction: column-reverse; gap: 6px; max-width: 400px; }
.layer-card { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; border-radius: 6px; background: #f8f9fa; border: 1px solid #dee2e6; cursor: default; transition: all 0.2s; }
.layer-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.layer-name { font-size: 13px; font-weight: 600; color: #212529; }
.layer-size { font-size: 12px; font-weight: 700; }
#total-size { margin-top: 10px; font-size: 13px; font-weight: 700; color: #495057; }`
    },
    {
      type: 'warning',
      title: 'Never Use :latest in Production Dockerfiles',
      content: 'The :latest tag is a moving target — it points to the most recently pushed tag. If you build FROM node:latest today, and rebuild in 6 months, you might get Node.js 22 instead of 20. Always pin to a specific version in Dockerfiles used for production.'
    }
  ],
  exercises: [
    {
      id: 'ex-docker-3-1',
      question: 'What happens to the image layers when you run a container from an image?',
      type: 'multiple-choice',
      options: [
        'The image layers are copied and modified for the container',
        'A new thin writable layer is added on top while the image layers remain read-only',
        'The container runs directly on the image without any new layers',
        'The image layers are merged into a single layer when the container starts'
      ],
      correct: 1,
      explanation: 'When a container starts, Docker adds a thin writable layer on top of the read-only image layers. All writes inside the container go to this layer. The original image remains unchanged and can be used to start many containers simultaneously.'
    },
    {
      id: 'ex-docker-3-2',
      question: 'What command removes all dangling (untagged) images to free disk space?',
      type: 'multiple-choice',
      options: [
        'docker rmi --all',
        'docker clean images',
        'docker image prune',
        'docker images remove dangling'
      ],
      correct: 2,
      explanation: 'docker image prune removes all dangling images — images that are no longer tagged and not referenced by any container. Add -a to also remove all images not currently used by any container.'
    },
    {
      id: 'ex-docker-3-3',
      question: 'What is a key benefit of Docker\'s layer caching system?',
      type: 'multiple-choice',
      options: [
        'It encrypts each layer for security',
        'It allows multiple containers to share read-only layers, saving disk space and speeding up builds',
        'It automatically compresses all layers to reduce image size',
        'It ensures only one container can use an image at a time'
      ],
      correct: 1,
      explanation: 'Docker\'s layer caching means shared layers (like the same base OS) are stored only once on disk and reused by multiple images. During builds, unchanged layers are served from cache instead of being rebuilt, dramatically speeding up iterative development.'
    }
  ],
  quiz: [
    {
      id: 'q-docker-3-1',
      question: 'What command shows complete metadata about an image including its layers and entry point?',
      options: [
        'docker image info',
        'docker image inspect',
        'docker image details',
        'docker image show'
      ],
      correct: 1,
      explanation: 'docker image inspect returns a detailed JSON object with all metadata: layers, environment variables, exposed ports, entry point, architecture, and more. It is the primary debugging tool for understanding image contents.'
    },
    {
      id: 'q-docker-3-2',
      question: 'What format does Docker use for image names when referring to non-official images?',
      options: [
        'imagename:version',
        'username/repository:tag',
        'registry.username.repository:tag',
        'repository@sha256:hash'
      ],
      correct: 1,
      explanation: 'Non-official images on Docker Hub use username/repository:tag format (e.g., myuser/myapp:1.0). Official images omit the username prefix (e.g., node:20-alpine). Private registries prepend the registry hostname.'
    },
    {
      id: 'q-docker-3-3',
      question: 'What is a dangling image?',
      options: [
        'An image that is currently running in a container',
        'An image that failed to build completely',
        'An untagged image layer that has been superseded by a newer build',
        'An image downloaded from an unverified source'
      ],
      correct: 2,
      explanation: 'Dangling images are untagged image layers created when a new image is built with the same name and tag, causing the old version to lose its tag. They waste disk space and can be cleaned up with docker image prune.'
    }
  ]
};
