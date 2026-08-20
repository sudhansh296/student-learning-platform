import type { DockerLesson } from '../docker-curriculum';

export const lesson11: DockerLesson = {
  id: 'docker-11',
  title: 'Docker Quick Reference and Best Practices',
  slug: '11-references',
  chapter: 'production',
  order: 11,
  difficulty: 'beginner',
  readingTime: 8,
  description: 'A searchable cheat sheet of all Docker commands, Dockerfile best practices, security tips, and a production readiness checklist.',
  sections: [
    {
      type: 'text',
      content: 'This lesson is your quick-reference guide covering every Docker command from all previous lessons, Dockerfile best practices, security hardening tips, and a production checklist. Bookmark it and come back whenever you need a fast refresher.'
    },
    {
      type: 'heading',
      content: 'Command Cheat Sheet'
    },
    {
      type: 'table',
      title: 'Image commands',
      headers: ['Command', 'Description'],
      rows: [
        ['docker pull image:tag', 'Download an image from a registry'],
        ['docker images', 'List all locally stored images'],
        ['docker image inspect name', 'Show detailed metadata for an image'],
        ['docker rmi image:tag', 'Remove a local image'],
        ['docker build -t name:tag .', 'Build an image from a Dockerfile'],
        ['docker tag src:tag dest:tag', 'Create a new tag alias for an image'],
        ['docker push name:tag', 'Upload an image to a registry'],
        ['docker history image:tag', 'Show layers and sizes of an image'],
        ['docker save -o file.tar image', 'Export image to a tar archive'],
        ['docker load -i file.tar', 'Import image from a tar archive']
      ]
    },
    {
      type: 'table',
      title: 'Container commands',
      headers: ['Command', 'Description'],
      rows: [
        ['docker run image:tag', 'Create and start a container'],
        ['docker run -d image', 'Run container in detached (background) mode'],
        ['docker run -p 8080:80 image', 'Map host port 8080 to container port 80'],
        ['docker run --name myapp image', 'Give the container a custom name'],
        ['docker run --rm image', 'Remove container automatically when it exits'],
        ['docker run -it image sh', 'Start container with interactive terminal'],
        ['docker ps', 'List running containers'],
        ['docker ps -a', 'List all containers including stopped ones'],
        ['docker stop container', 'Send SIGTERM then SIGKILL to stop a container'],
        ['docker start container', 'Start a stopped container'],
        ['docker restart container', 'Stop and start a container'],
        ['docker rm container', 'Remove a stopped container'],
        ['docker rm -f container', 'Force-remove a running container'],
        ['docker exec -it container sh', 'Execute an interactive shell in a running container'],
        ['docker logs container', 'Show container log output'],
        ['docker logs -f container', 'Follow (stream) container log output'],
        ['docker inspect container', 'Show detailed container configuration and state'],
        ['docker stats', 'Live CPU, memory, and network usage for all containers'],
        ['docker cp src container:/dest', 'Copy files between host and container']
      ]
    },
    {
      type: 'table',
      title: 'Volume commands',
      headers: ['Command', 'Description'],
      rows: [
        ['docker volume create name', 'Create a named volume'],
        ['docker volume ls', 'List all named volumes'],
        ['docker volume inspect name', 'Show volume details and mount path'],
        ['docker volume rm name', 'Remove a named volume'],
        ['docker volume prune', 'Remove all unused volumes'],
        ['docker run -v name:/path image', 'Mount a named volume into a container'],
        ['docker run -v /host:/container image', 'Bind mount a host directory']
      ]
    },
    {
      type: 'table',
      title: 'Network commands',
      headers: ['Command', 'Description'],
      rows: [
        ['docker network create name', 'Create a custom bridge network'],
        ['docker network ls', 'List all networks'],
        ['docker network inspect name', 'Show network details and connected containers'],
        ['docker network rm name', 'Remove a network'],
        ['docker network connect net container', 'Connect a running container to a network'],
        ['docker network disconnect net container', 'Disconnect a container from a network'],
        ['docker run --network name image', 'Start a container on a specific network']
      ]
    },
    {
      type: 'table',
      title: 'Docker Compose commands',
      headers: ['Command', 'Description'],
      rows: [
        ['docker compose up -d', 'Start all services in the background'],
        ['docker compose down', 'Stop and remove containers and networks'],
        ['docker compose down -v', 'Stop and remove containers, networks, and volumes'],
        ['docker compose ps', 'Show status of all services'],
        ['docker compose logs -f service', 'Follow logs for a specific service'],
        ['docker compose exec service sh', 'Open a shell in a running service'],
        ['docker compose build', 'Build or rebuild service images'],
        ['docker compose pull', 'Pull latest images for all services'],
        ['docker compose restart service', 'Restart a single service'],
        ['docker compose config', 'Validate and print the resolved compose file']
      ]
    },
    {
      type: 'heading',
      content: 'Dockerfile Best Practices'
    },
    {
      type: 'list',
      title: 'Key practices for efficient and secure Dockerfiles:',
      items: [
        'Use official minimal base images (node:20-alpine, python:3.12-slim) to reduce attack surface and image size',
        'Copy package.json before source code so the dependency install layer is cached separately',
        'Use npm ci instead of npm install for reproducible installs in Node.js projects',
        'Combine related RUN commands with && to minimize layers and reduce final image size',
        'Always add a .dockerignore file to exclude node_modules, .git, .env, and dist from the build context',
        'Use multi-stage builds to keep build tools and dev dependencies out of the final image',
        'Create and switch to a non-root user (USER appuser) before the CMD instruction',
        'Use COPY instead of ADD unless you specifically need URL fetching or tar auto-extraction',
        'Use ENV for runtime configuration and ARG for build-time variables only',
        'Pin base image versions explicitly -- avoid FROM node:latest in Dockerfiles',
        'Use ENTRYPOINT for the fixed executable and CMD for default arguments',
        'Clean up package manager caches in the same RUN layer: rm -rf /var/lib/apt/lists/*'
      ]
    },
    {
      type: 'heading',
      content: 'Security Best Practices'
    },
    {
      type: 'list',
      title: 'Security tips for production containers:',
      items: [
        'Never run containers as root -- create a dedicated non-root user with minimal permissions',
        'Never store secrets in ENV instructions or image layers -- they are visible via docker inspect',
        'Use Docker secrets or external secret managers (AWS Secrets Manager, Vault) for credentials',
        'Scan images regularly with docker scout cves or Trivy to detect known vulnerabilities',
        'Use read-only filesystems where possible: docker run --read-only image',
        'Drop unnecessary Linux capabilities: docker run --cap-drop ALL --cap-add NET_BIND_SERVICE',
        'Avoid privileged mode (--privileged) unless absolutely required -- it gives full host access',
        'Keep base images updated by regularly pulling the latest patch versions',
        'Use content trust (DOCKER_CONTENT_TRUST=1) to verify image signatures',
        'Limit container resources with --memory and --cpus to prevent resource exhaustion attacks'
      ]
    },
    {
      type: 'heading',
      content: 'Resource Limits'
    },
    {
      type: 'example',
      title: 'Setting memory and CPU limits on containers',
      content: 'Resource limits prevent a single container from consuming all available host resources. Memory limits cause the container to be OOM-killed when exceeded. CPU limits are enforced through CPU shares and quotas, throttling the container without killing it.',
      code: `# Limit container to 512 MB memory and 0.5 CPU cores
docker run -d \
  --memory="512m" \
  --cpus="0.5" \
  --name my-app \
  myapp:1.0.0

# Check container resource usage live
docker stats my-app

# Resource limits in docker-compose.yml:
# services:
#   api:
#     deploy:
#       resources:
#         limits:
#           memory: 512m
#           cpus: '0.5'`,
      language: 'bash',
      output: `CONTAINER ID   NAME     CPU %   MEM USAGE / LIMIT   MEM %
a1b2c3d4e5f6   my-app   1.2%    128MiB / 512MiB     25%`
    },
    {
      type: 'heading',
      content: 'Cleaning Up Docker Resources'
    },
    {
      type: 'example',
      title: 'docker system prune -- reclaiming disk space',
      content: 'Docker accumulates unused images, stopped containers, unused networks, and dangling build cache over time. The system prune command removes all of them at once. Adding -af removes all unused images even if they are tagged.',
      code: `# Remove stopped containers, unused networks, dangling images, and build cache
docker system prune

# Remove ALL unused images (including tagged but not running)
docker system prune -af

# Also remove unused volumes (DATA LOSS -- confirm before running)
docker system prune -af --volumes

# Check disk usage before pruning
docker system df`,
      language: 'bash',
      output: `TYPE            TOTAL   ACTIVE  SIZE      RECLAIMABLE
Images          12      3       4.2GB     3.1GB (73%)
Containers      8       2       0B        0B
Volumes         4       1       890MB     640MB (71%)
Build Cache     47      0       1.2GB     1.2GB`
    },
    {
      type: 'heading',
      content: 'Useful Shell Aliases'
    },
    {
      type: 'example',
      title: 'Time-saving Docker aliases for your shell profile',
      content: 'These aliases reduce repetitive typing for the Docker commands used most often during daily development. Add them to your ~/.bashrc, ~/.zshrc, or PowerShell profile and reload your shell.',
      code: `# Add to ~/.bashrc or ~/.zshrc
alias d='docker'
alias dps='docker ps'
alias dpsa='docker ps -a'
alias di='docker images'
alias dex='docker exec -it'
alias dl='docker logs -f'
alias drm='docker rm -f'
alias dcp='docker compose'
alias dcup='docker compose up -d'
alias dcdown='docker compose down'
alias dclogs='docker compose logs -f'
alias dsprune='docker system prune -af'`,
      language: 'bash'
    },
    {
      type: 'heading',
      content: 'Production Readiness Checklist'
    },
    {
      type: 'list',
      title: 'Before deploying Docker containers to production:',
      items: [
        'Image uses a specific version tag -- no :latest in production deployments',
        'Multi-stage build used to minimize final image size',
        'Non-root user set with USER instruction in Dockerfile',
        '.dockerignore file present and includes node_modules, .env, .git',
        'No secrets stored in image layers, ENV, or ARG instructions',
        'Image scanned for vulnerabilities and results reviewed',
        'Resource limits (--memory, --cpus) configured for all containers',
        'Health checks defined for all services in docker-compose.yml',
        'Volumes used for all persistent data -- no data stored in container writable layer',
        'Graceful shutdown handling implemented in the application (SIGTERM handler)',
        'Container logs sent to a log aggregator or accessible via docker logs',
        'Restart policy configured (restart: unless-stopped or on-failure)'
      ]
    },
    {
      type: 'tryit',
      title: 'Searchable Docker Command Reference',
      js: `var commands = [
  { category: 'Images', cmd: 'docker pull image:tag', desc: 'Download an image from a registry' },
  { category: 'Images', cmd: 'docker images', desc: 'List all locally stored images' },
  { category: 'Images', cmd: 'docker build -t name:tag .', desc: 'Build image from Dockerfile in current directory' },
  { category: 'Images', cmd: 'docker rmi image:tag', desc: 'Remove a local image' },
  { category: 'Images', cmd: 'docker tag src:tag dest:tag', desc: 'Create a new tag alias for an image' },
  { category: 'Images', cmd: 'docker push name:tag', desc: 'Upload an image to a registry' },
  { category: 'Images', cmd: 'docker history image', desc: 'Show layers and sizes of an image' },
  { category: 'Containers', cmd: 'docker run image', desc: 'Create and start a container from an image' },
  { category: 'Containers', cmd: 'docker run -d image', desc: 'Run container in detached background mode' },
  { category: 'Containers', cmd: 'docker run -p 8080:80 image', desc: 'Map host port 8080 to container port 80' },
  { category: 'Containers', cmd: 'docker run --name app image', desc: 'Give the container a custom name' },
  { category: 'Containers', cmd: 'docker run --rm image', desc: 'Auto-remove container when it exits' },
  { category: 'Containers', cmd: 'docker run -it image sh', desc: 'Start container with interactive shell' },
  { category: 'Containers', cmd: 'docker ps', desc: 'List running containers' },
  { category: 'Containers', cmd: 'docker ps -a', desc: 'List all containers including stopped ones' },
  { category: 'Containers', cmd: 'docker stop container', desc: 'Gracefully stop a running container' },
  { category: 'Containers', cmd: 'docker rm container', desc: 'Remove a stopped container' },
  { category: 'Containers', cmd: 'docker rm -f container', desc: 'Force remove a running container' },
  { category: 'Containers', cmd: 'docker exec -it container sh', desc: 'Open interactive shell in running container' },
  { category: 'Containers', cmd: 'docker logs -f container', desc: 'Stream live container log output' },
  { category: 'Containers', cmd: 'docker stats', desc: 'Live CPU and memory usage for all containers' },
  { category: 'Containers', cmd: 'docker inspect container', desc: 'Show detailed container configuration' },
  { category: 'Volumes', cmd: 'docker volume create name', desc: 'Create a named volume' },
  { category: 'Volumes', cmd: 'docker volume ls', desc: 'List all named volumes' },
  { category: 'Volumes', cmd: 'docker volume rm name', desc: 'Remove a named volume' },
  { category: 'Volumes', cmd: 'docker volume prune', desc: 'Remove all unused volumes' },
  { category: 'Networks', cmd: 'docker network create name', desc: 'Create a custom bridge network' },
  { category: 'Networks', cmd: 'docker network ls', desc: 'List all Docker networks' },
  { category: 'Networks', cmd: 'docker network inspect name', desc: 'Show network details and containers' },
  { category: 'Networks', cmd: 'docker network connect net container', desc: 'Connect a container to a network' },
  { category: 'Compose', cmd: 'docker compose up -d', desc: 'Start all services in background' },
  { category: 'Compose', cmd: 'docker compose down', desc: 'Stop and remove containers and networks' },
  { category: 'Compose', cmd: 'docker compose down -v', desc: 'Also remove named volumes (deletes data)' },
  { category: 'Compose', cmd: 'docker compose ps', desc: 'Show status of all compose services' },
  { category: 'Compose', cmd: 'docker compose logs -f service', desc: 'Follow logs for a service' },
  { category: 'Compose', cmd: 'docker compose exec service sh', desc: 'Open shell in a compose service' },
  { category: 'Compose', cmd: 'docker compose build', desc: 'Build or rebuild service images' },
  { category: 'System', cmd: 'docker system prune', desc: 'Remove stopped containers, unused networks, dangling images' },
  { category: 'System', cmd: 'docker system prune -af', desc: 'Remove all unused images, containers, networks' },
  { category: 'System', cmd: 'docker system df', desc: 'Show Docker disk usage summary' },
  { category: 'System', cmd: 'docker login', desc: 'Log in to a container registry' },
  { category: 'System', cmd: 'docker logout', desc: 'Log out and clear stored credentials' }
];

var categoryColors = {
  Images: '#2496ED',
  Containers: '#28a745',
  Volumes: '#fd7e14',
  Networks: '#6f42c1',
  Compose: '#17a2b8',
  System: '#dc3545'
};

function renderCommands(filter) {
  var q = (filter || '').toLowerCase();
  var list = document.getElementById('cmd-list');
  var filtered = q
    ? commands.filter(function(c) {
        return c.cmd.toLowerCase().indexOf(q) !== -1 ||
               c.desc.toLowerCase().indexOf(q) !== -1 ||
               c.category.toLowerCase().indexOf(q) !== -1;
      })
    : commands;

  if (filtered.length === 0) {
    list.innerHTML = '<div style="color:#8b949e;padding:16px;text-align:center;font-size:13px">No commands match "' + filter + '"</div>';
    return;
  }

  list.innerHTML = filtered.map(function(c) {
    var color = categoryColors[c.category] || '#6c757d';
    return '<div class="cmd-row">' +
      '<span class="cmd-cat" style="background:' + color + '">' + c.category + '</span>' +
      '<code class="cmd-code">' + c.cmd + '</code>' +
      '<span class="cmd-desc">' + c.desc + '</span>' +
    '</div>';
  }).join('');

  document.getElementById('result-count').textContent = filtered.length + ' of ' + commands.length + ' commands';
}

document.getElementById('search-input').addEventListener('input', function() {
  renderCommands(this.value);
});

renderCommands('');`,
      css: `body { padding: 16px; font-family: system-ui, sans-serif; background: #f0f4f8; }
h3 { color: #2496ED; margin: 0 0 12px 0; font-size: 15px; font-weight: 700; }
.search-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
#search-input { flex: 1; padding: 9px 14px; border: 1px solid #dee2e6; border-radius: 8px; font-size: 13px; outline: none; font-family: monospace; background: white; }
#search-input:focus { border-color: #2496ED; box-shadow: 0 0 0 2px rgba(36,150,237,0.15); }
#result-count { font-size: 11px; color: #6c757d; white-space: nowrap; }
#cmd-list { background: white; border-radius: 8px; border: 1px solid #dee2e6; max-height: 340px; overflow-y: auto; }
.cmd-row { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-bottom: 1px solid #f0f0f0; flex-wrap: wrap; }
.cmd-row:last-child { border-bottom: none; }
.cmd-cat { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: white; padding: 2px 7px; border-radius: 10px; min-width: 68px; text-align: center; flex-shrink: 0; }
.cmd-code { font-family: monospace; font-size: 12px; color: #1a6b9e; background: #f0f7ff; padding: 2px 7px; border-radius: 4px; flex-shrink: 0; }
.cmd-desc { font-size: 12px; color: #495057; flex: 1; min-width: 140px; }`
    },
    {
      type: 'tip',
      title: 'Explore With docker --help',
      content: 'Every Docker command supports the --help flag. Run docker --help for a list of all top-level commands, docker run --help for all run flags, or docker compose up --help for compose options. The built-in help is accurate and always matches your installed version.'
    }
  ],
  exercises: [
    {
      id: 'ex-docker-11-1',
      question: 'Which command removes all unused Docker resources including images, stopped containers, unused networks, and build cache at once?',
      type: 'multiple-choice',
      options: [
        'docker rm -a && docker rmi -a',
        'docker clean --all',
        'docker system prune',
        'docker purge --force'
      ],
      correct: 2,
      explanation: 'docker system prune removes stopped containers, unused networks, dangling images, and build cache in one command. Adding -af also removes unused (but tagged) images. Adding --volumes also removes unused named volumes.'
    },
    {
      id: 'ex-docker-11-2',
      question: 'Which security practice is most critical for production Node.js containers?',
      type: 'multiple-choice',
      options: [
        'Always using the :latest image tag',
        'Running the application process as a non-root user',
        'Disabling all container networking',
        'Running containers in --privileged mode for full system access'
      ],
      correct: 1,
      explanation: 'Running as a non-root user is the single most impactful security practice. If an attacker exploits a vulnerability in your application, a non-root process has limited ability to affect the host system or other containers. Create a user with adduser and switch to it with the USER instruction.'
    }
  ],
  quiz: [
    {
      id: 'q-docker-11-1',
      question: 'What does the --rm flag do when added to docker run?',
      options: [
        'It removes the image after the container exits',
        'It removes the container automatically when it stops or exits',
        'It removes all other containers before starting this one',
        'It removes the volume attached to the container'
      ],
      correct: 1,
      explanation: 'docker run --rm creates a container that is automatically removed as soon as it stops. This is ideal for one-off commands and scripts where you want the container to clean itself up. Without --rm, stopped containers accumulate and must be removed manually with docker rm.'
    },
    {
      id: 'q-docker-11-2',
      question: 'What command shows live CPU, memory, and network usage for all running containers?',
      options: [
        'docker ps -l',
        'docker top',
        'docker inspect --stats',
        'docker stats'
      ],
      correct: 3,
      explanation: 'docker stats shows a live updating table of resource usage for all running containers including CPU percentage, memory usage and limit, memory percentage, and network I/O. Press Ctrl+C to exit. You can also specify a container name to monitor only one container.'
    }
  ]
};
