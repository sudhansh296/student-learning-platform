import type { DockerLesson } from '../docker-curriculum';

export const lesson01: DockerLesson = {
  id: 'docker-01',
  title: 'Introduction to Docker and Containers',
  slug: '01-introduction',
  chapter: 'fundamentals',
  order: 1,
  difficulty: 'beginner',
  readingTime: 10,
  description: 'Learn what containers are, how Docker solves the "works on my machine" problem, and how containers differ from virtual machines.',
  sections: [
    {
      type: 'text',
      content: 'Docker is a platform that packages your application and everything it needs to run into a single portable unit called a container. Whether you are on macOS, Windows, or a Linux server in the cloud, the container runs identically everywhere.'
    },
    {
      type: 'heading',
      content: 'The "Works On My Machine" Problem'
    },
    {
      type: 'text',
      content: 'Every developer has experienced the moment when code works perfectly on their laptop but fails on a teammate\'s machine or the production server. Different operating system versions, missing libraries, wrong Node.js versions, conflicting environment variables — all of these cause unpredictable failures that are painful to debug.'
    },
    {
      type: 'analogy',
      title: 'The Shipping Container Analogy',
      content: 'Before standardized shipping containers, cargo was loaded piece by piece onto ships — slow, inconsistent, and prone to damage. The shipping container standardized freight: one format, loaded once, transported anywhere by sea, rail, or truck. Docker does the same for software: build your app once, ship it anywhere.'
    },
    {
      type: 'list',
      title: 'Common causes of environment inconsistencies:',
      items: [
        'Different OS versions (Ubuntu 20 vs Ubuntu 22)',
        'Different runtime versions (Node 16 vs Node 20)',
        'Missing system libraries or wrong library versions',
        'Different environment variable configurations',
        'Database version mismatches between dev and production',
        'Port conflicts from other locally running services'
      ]
    },
    {
      type: 'heading',
      content: 'What is a Container?'
    },
    {
      type: 'text',
      content: 'A container is a lightweight, isolated process on your host machine. It has its own filesystem, network, and process space — but shares the host OS kernel. This makes containers much lighter than full virtual machines while still providing strong isolation.'
    },
    {
      type: 'heading',
      content: 'Containers vs Virtual Machines'
    },
    {
      type: 'table',
      title: 'Containers vs Virtual Machines — side-by-side comparison',
      headers: ['Feature', 'Containers', 'Virtual Machines'],
      rows: [
        ['OS Kernel', 'Shared with host', 'Full OS per VM'],
        ['Startup time', 'Milliseconds', 'Minutes'],
        ['Disk size', '10s of MB', 'Gigabytes'],
        ['Memory usage', 'Low (shared kernel)', 'High (full OS in memory)'],
        ['Isolation', 'Process-level isolation', 'Hardware-level isolation'],
        ['Portability', 'Runs same on any Docker host', 'Hypervisor-dependent'],
        ['Use case', 'Microservices, CI/CD, dev envs', 'Full OS isolation, security boundary']
      ]
    },
    {
      type: 'heading',
      content: 'Docker Architecture'
    },
    {
      type: 'text',
      content: 'Docker uses a client-server architecture. The Docker CLI (client) sends commands to the Docker daemon (server), which does all the heavy lifting of building images and running containers. Images are pulled from and pushed to a registry like Docker Hub.'
    },
    {
      type: 'list',
      title: 'Key architectural components:',
      items: [
        'Docker Client: The CLI tool you type commands into (docker build, docker run)',
        'Docker Daemon (dockerd): Background service that manages images, containers, networks, and volumes',
        'Docker Images: Read-only templates used to create containers',
        'Docker Containers: Running instances of images',
        'Docker Registry: Storage and distribution system for images (Docker Hub is the public default)',
        'Docker Hub: The world\'s largest public registry with millions of official and community images'
      ]
    },
    {
      type: 'heading',
      content: 'Key Benefits of Docker'
    },
    {
      type: 'list',
      title: 'Why teams adopt Docker:',
      items: [
        'Consistent environments from development through staging to production',
        'Rapid onboarding: new team members run one command to get the full stack running',
        'Efficient resource usage: run many more containers than VMs on the same hardware',
        'Microservices: each service in its own container, independently deployable',
        'Fast CI/CD pipelines: spin up fresh clean environments in seconds',
        'Dependency isolation: each project has its own dependencies with no conflicts'
      ]
    },
    {
      type: 'heading',
      content: 'Docker Use Cases'
    },
    {
      type: 'table',
      title: 'Common Docker use cases in real teams',
      headers: ['Use Case', 'Example', 'Benefit'],
      rows: [
        ['Local development', 'Run Postgres + Redis + App together', 'No install required on host'],
        ['CI/CD pipelines', 'GitHub Actions runs tests in containers', 'Reproducible build environments'],
        ['Microservices', 'Each API service in its own container', 'Independent scaling and deployment'],
        ['Legacy apps', 'Run old Node 8 app without installing it', 'No version conflicts'],
        ['Demos & prototypes', 'Share a docker-compose.yml with a customer', 'One command to see working app'],
        ['Production deployment', 'Deploy to AWS ECS or Kubernetes', 'Consistent prod environment']
      ]
    },
    {
      type: 'heading',
      content: 'Introducing Docker Hub'
    },
    {
      type: 'text',
      content: 'Docker Hub is the default public registry where Docker images are stored and shared. Official images like node, postgres, nginx, and redis are maintained by their respective teams and are the safe, recommended starting point for any new container.'
    },
    {
      type: 'example',
      title: 'Running Your First Container',
      content: 'This command pulls the official hello-world image from Docker Hub and runs it, printing a confirmation message. It is the traditional first step to verify that Docker is working correctly on your machine.',
      code: `docker run hello-world`,
      language: 'bash',
      output: `Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
 3. The Docker daemon created a new container from that image.
 4. The Docker daemon streamed that output to the Docker client.`
    },
    {
      type: 'example',
      title: 'Pulling an Official Image',
      content: 'The docker pull command downloads an image from Docker Hub to your local machine without running a container. Here we pull the official Node.js Alpine image, which is a minimal Linux distribution perfect for production containers.',
      code: `docker pull node:20-alpine`,
      language: 'bash',
      output: `20-alpine: Pulling from library/node
96526aa774ef: Pull complete
Digest: sha256:f5e5e...
Status: Downloaded newer image for node:20-alpine
docker.io/library/node:20-alpine`
    },
    {
      type: 'note',
      title: 'Docker Hub Rate Limits',
      content: 'Anonymous Docker Hub pulls are rate-limited to 100 per 6 hours. Create a free account and log in with docker login to get 200 pulls per 6 hours. For CI/CD pipelines, use docker login with a stored token.'
    },
    {
      type: 'tip',
      title: 'Start With Official Images',
      content: 'Always start with official images (no username prefix, like node, postgres, nginx) from Docker Hub. They are maintained by the technology teams, regularly updated for security patches, and follow Docker best practices.'
    },
    {
      type: 'tryit',
      title: 'Container vs VM Comparison Visualizer',
      js: `document.body.innerHTML = '<div><h3 id="viz-title"></h3><button id="toggle-btn"></button><div id="viz"></div></div>';

var mode = 'containers';

function render() {
  var container = document.getElementById('viz');
  var btn = document.getElementById('toggle-btn');
  var title = document.getElementById('viz-title');

  if (mode === 'containers') {
    title.textContent = 'Containers Architecture';
    btn.textContent = 'Show VM Architecture';
    container.innerHTML = \`
      <div class="arch-wrapper">
        <div class="host-box">
          <div class="host-label">Host Machine</div>
          <div class="kernel-bar">Host OS Kernel (shared)</div>
          <div class="docker-engine">Docker Engine</div>
          <div class="containers-row">
            <div class="cnt-box" style="border-color:#2496ED">
              <div class="cnt-title" style="background:#2496ED">Container A</div>
              <div class="cnt-layer">App Code</div>
              <div class="cnt-layer">Node 20</div>
              <div class="cnt-layer">Alpine Linux</div>
              <div class="cnt-size">~120 MB</div>
            </div>
            <div class="cnt-box" style="border-color:#17a2b8">
              <div class="cnt-title" style="background:#17a2b8">Container B</div>
              <div class="cnt-layer">App Code</div>
              <div class="cnt-layer">Python 3.11</div>
              <div class="cnt-layer">Debian Slim</div>
              <div class="cnt-size">~180 MB</div>
            </div>
            <div class="cnt-box" style="border-color:#28a745">
              <div class="cnt-title" style="background:#28a745">Container C</div>
              <div class="cnt-layer">Nginx Config</div>
              <div class="cnt-layer">Nginx 1.25</div>
              <div class="cnt-layer">Alpine Linux</div>
              <div class="cnt-size">~45 MB</div>
            </div>
          </div>
        </div>
        <div class="stats-row">
          <div class="stat-card"><div class="stat-val">~100ms</div><div class="stat-lbl">Startup Time</div></div>
          <div class="stat-card"><div class="stat-val">~120MB</div><div class="stat-lbl">Avg Size</div></div>
          <div class="stat-card"><div class="stat-val">Low</div><div class="stat-lbl">Memory Use</div></div>
        </div>
      </div>
    \`;
  } else {
    title.textContent = 'Virtual Machines Architecture';
    btn.textContent = 'Show Container Architecture';
    container.innerHTML = \`
      <div class="arch-wrapper">
        <div class="host-box">
          <div class="host-label">Host Machine</div>
          <div class="kernel-bar" style="background:#dc3545">Host OS + Hypervisor</div>
          <div class="containers-row">
            <div class="cnt-box" style="border-color:#dc3545">
              <div class="cnt-title" style="background:#dc3545">VM 1</div>
              <div class="cnt-layer">App Code</div>
              <div class="cnt-layer">Node 20</div>
              <div class="cnt-layer">Ubuntu 22 OS</div>
              <div class="cnt-layer">Virtual Hardware</div>
              <div class="cnt-size">~4 GB</div>
            </div>
            <div class="cnt-box" style="border-color:#e67e22">
              <div class="cnt-title" style="background:#e67e22">VM 2</div>
              <div class="cnt-layer">App Code</div>
              <div class="cnt-layer">Python 3.11</div>
              <div class="cnt-layer">CentOS 8 OS</div>
              <div class="cnt-layer">Virtual Hardware</div>
              <div class="cnt-size">~5 GB</div>
            </div>
          </div>
        </div>
        <div class="stats-row">
          <div class="stat-card"><div class="stat-val">~60s</div><div class="stat-lbl">Startup Time</div></div>
          <div class="stat-card"><div class="stat-val">~4.5GB</div><div class="stat-lbl">Avg Size</div></div>
          <div class="stat-card"><div class="stat-val">High</div><div class="stat-lbl">Memory Use</div></div>
        </div>
      </div>
    \`;
  }
}

document.getElementById('toggle-btn').addEventListener('click', function() {
  mode = mode === 'containers' ? 'vms' : 'containers';
  render();
});

render();`,
      css: `body { padding: 16px; font-family: system-ui, sans-serif; background: #f0f4f8; }
h3 { color: #2496ED; margin: 0 0 12px 0; font-size: 15px; font-weight: 700; }
#toggle-btn { background: #2496ED; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 13px; margin-bottom: 16px; }
#toggle-btn:hover { background: #1a7abf; }
#viz-title { font-size: 14px; font-weight: 700; color: #333; margin-bottom: 12px; }
.host-box { background: white; border-radius: 10px; padding: 14px; border: 2px solid #dee2e6; }
.host-label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #6c757d; margin-bottom: 8px; letter-spacing: 1px; }
.kernel-bar { background: #2496ED; color: white; text-align: center; padding: 6px; border-radius: 4px; font-size: 12px; font-weight: 600; margin-bottom: 8px; }
.docker-engine { background: #e8f4fd; color: #1a6b9e; text-align: center; padding: 4px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-bottom: 8px; }
.containers-row { display: flex; gap: 10px; flex-wrap: wrap; }
.cnt-box { flex: 1; min-width: 100px; border: 2px solid; border-radius: 8px; overflow: hidden; }
.cnt-title { color: white; text-align: center; padding: 5px; font-size: 11px; font-weight: 700; }
.cnt-layer { background: #f8f9fa; border-top: 1px solid #dee2e6; padding: 4px 8px; font-size: 11px; color: #495057; text-align: center; }
.cnt-size { background: #e9ecef; border-top: 1px solid #dee2e6; padding: 4px 8px; font-size: 11px; font-weight: 700; color: #6c757d; text-align: center; }
.stats-row { display: flex; gap: 10px; margin-top: 12px; }
.stat-card { flex: 1; background: white; border-radius: 8px; padding: 10px; text-align: center; border: 1px solid #dee2e6; }
.stat-val { font-size: 16px; font-weight: 700; color: #2496ED; }
.stat-lbl { font-size: 10px; color: #6c757d; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.5px; }`
    },
    {
      type: 'warning',
      title: 'Docker vs Docker Desktop',
      content: 'On Linux, Docker Engine runs natively. On macOS and Windows, Docker Desktop runs a lightweight Linux virtual machine behind the scenes because containers require a Linux kernel. Docker Desktop is the recommended way to use Docker on those platforms.'
    }
  ],
  exercises: [
    {
      id: 'ex-docker-1-1',
      question: 'What is the primary advantage of containers over virtual machines for running microservices?',
      type: 'multiple-choice',
      options: [
        'Containers provide stronger security isolation than VMs',
        'Containers are much lighter, start in milliseconds, and share the host OS kernel',
        'Containers do not require any operating system at all',
        'Containers can only run Linux applications'
      ],
      correct: 1,
      explanation: 'Containers share the host OS kernel and only package the application and its dependencies, making them far lighter than VMs (megabytes vs gigabytes) and able to start in milliseconds rather than minutes.'
    },
    {
      id: 'ex-docker-1-2',
      question: 'In the Docker architecture, what component is responsible for actually building images and running containers?',
      type: 'multiple-choice',
      options: [
        'The Docker CLI client',
        'Docker Hub',
        'The Docker daemon (dockerd)',
        'The container registry'
      ],
      correct: 2,
      explanation: 'The Docker daemon (dockerd) is the background service that does all the heavy lifting: building images, running containers, managing networks and volumes. The CLI client simply sends commands to the daemon.'
    },
    {
      id: 'ex-docker-1-3',
      question: 'What command runs a container from an image called hello-world?',
      type: 'multiple-choice',
      options: [
        'docker start hello-world',
        'docker pull hello-world',
        'docker execute hello-world',
        'docker run hello-world'
      ],
      correct: 3,
      explanation: 'docker run hello-world pulls the image if not present locally, creates a container from it, and runs it. docker pull only downloads the image without running it.'
    }
  ],
  quiz: [
    {
      id: 'q-docker-1-1',
      question: 'Which problem does Docker primarily solve for development teams?',
      options: [
        'Slow internet speeds during deployments',
        'Inconsistent environments where code works on one machine but not another',
        'Inability to write code in multiple programming languages',
        'Lack of version control for source code'
      ],
      correct: 1,
      explanation: 'Docker solves the "works on my machine" problem by packaging applications with all their dependencies into containers that run identically in any environment.'
    },
    {
      id: 'q-docker-1-2',
      question: 'What is Docker Hub?',
      options: [
        'A Docker command for connecting containers to networks',
        'A local directory where Docker stores images on your machine',
        'A public registry for storing and sharing Docker images',
        'A GUI dashboard for managing running containers'
      ],
      correct: 2,
      explanation: 'Docker Hub is the world\'s largest public container registry. It hosts official images for popular software like Node.js, PostgreSQL, and Nginx, plus millions of community images.'
    },
    {
      id: 'q-docker-1-3',
      question: 'What do containers share with the host machine that virtual machines do not?',
      options: [
        'The host machine\'s network adapter only',
        'The host OS kernel',
        'The host machine\'s installed applications',
        'The host machine\'s user accounts'
      ],
      correct: 1,
      explanation: 'Containers share the host OS kernel, which is why they are so much lighter than virtual machines. VMs run a full guest OS with its own kernel, requiring far more memory and disk space.'
    }
  ]
};
