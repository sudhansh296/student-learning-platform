import { code, type Cheatsheet } from './cheatsheet-types';

export const dockerCheatsheet: Cheatsheet = {
  path: '/docker-cheatsheet',
  tech: 'docker',
  badge: 'Docker',
  title: 'Docker Cheat Sheet: Images, Containers and Compose',
  description: 'Docker cheat sheet covering images, containers, Dockerfiles, volumes, networking, Compose and cleanup commands. Run the commands in the editor.',
  h1: 'Docker Cheat Sheet – Images, Containers, Dockerfiles and Compose',
  intro: 'A practical Docker reference: images and containers, the container lifecycle, writing a Dockerfile, building images, volumes and networking, Docker Compose, and registry and cleanup commands. Commands are short, copyable and run against a real Docker CLI simulator in the live editor. For deeper explanations, see the Docker interview questions page.',
  sections: [
    {
      id: 'images-containers',
      title: 'Images and containers',
      table: {
        headers: ['Command', 'What it does'],
        rows: [
          ['docker pull <image>', 'Download an image from a registry'],
          ['docker images', 'List local images'],
          ['docker run <image>', 'Create and start a container from an image'],
          ['docker ps', 'List running containers'],
          ['docker ps -a', 'List all containers, including stopped ones'],
        ],
        codeCols: [0],
      },
      examples: [{
        title: 'Pulling an image and running a container',
        language: 'bash',
        code: code(
          'docker pull nginx:alpine',
          'docker images',
          'docker run -d --name web -p 8080:80 nginx:alpine',
          'docker ps',
        ),
      }],
      lessons: ['docker/03-images', 'docker/04-containers'],
    },
    {
      id: 'lifecycle',
      title: 'The container lifecycle',
      table: {
        headers: ['Command', 'What it does'],
        rows: [
          ['docker stop <name>', 'Gracefully stop a running container (SIGTERM, then SIGKILL after a timeout)'],
          ['docker start <name>', 'Start a stopped container'],
          ['docker rm <name>', 'Remove a stopped container'],
          ['docker rm -f <name>', 'Stop and remove a container in one step'],
          ['docker exec -it <name> sh', 'Open an interactive shell inside a running container'],
          ['docker logs -f <name>', 'Follow a container\'s logs live'],
        ],
        codeCols: [0],
      },
      examples: [{
        title: 'Managing a running container',
        language: 'bash',
        code: code(
          'docker run -d --name web nginx',
          'docker exec web ls /usr/share/nginx/html',
          'docker logs web',
          'docker stop web',
          'docker rm web',
        ),
      }],
      lessons: ['docker/04-containers'],
    },
    {
      id: 'dockerfile',
      title: 'Dockerfile instructions',
      table: {
        headers: ['Instruction', 'What it does'],
        rows: [
          ['FROM image:tag', 'Sets the base image'],
          ['WORKDIR /path', 'Sets the working directory for following instructions'],
          ['COPY src dest', 'Copies files from the build context into the image'],
          ['RUN command', 'Runs a command at build time, creating a new layer'],
          ['ENV KEY=value', 'Sets an environment variable, baked into the image'],
          ['EXPOSE port', 'Documents which port the container listens on'],
          ['CMD ["executable", "arg"]', 'The default command when a container starts (overridable)'],
          ['ENTRYPOINT ["executable"]', 'The command that always runs; arguments are appended to it'],
        ],
        codeCols: [0],
      },
      examples: [{
        title: 'A simple Node.js Dockerfile',
        language: 'dockerfile',
        code: code(
          'FROM node:20-alpine',
          'WORKDIR /app',
          'COPY package*.json ./',
          'RUN npm ci --omit=dev',
          'COPY . .',
          'EXPOSE 3000',
          'CMD ["node", "server.js"]',
        ),
      }],
      lessons: ['docker/05-dockerfile'],
    },
    {
      id: 'build',
      title: 'Building images',
      examples: [{
        title: 'Building and tagging an image',
        language: 'bash',
        code: code(
          'docker build -t my-app:1.0 .',
          'docker images',
          'docker run -d -p 3000:3000 my-app:1.0',
        ),
      }],
      tips: [
        'Order Dockerfile instructions from least to most frequently changing (dependencies before app code) so Docker\'s build cache can skip the slow steps when only source code changes.',
        'A multi-stage build (more than one FROM) keeps build-only tools out of the final image — copy just the compiled output from an earlier stage with COPY --from=builder.',
      ],
      lessons: ['docker/05-dockerfile'],
    },
    {
      id: 'volumes',
      title: 'Volumes',
      table: {
        headers: ['Command', 'What it does'],
        rows: [
          ['docker volume create <name>', 'Create a named volume'],
          ['docker volume ls', 'List volumes'],
          ['docker run -v <volume>:<path> ...', 'Mount a named volume into a container'],
          ['docker run -v <host-path>:<path> ...', 'Bind-mount a host directory into a container'],
          ['docker volume prune', 'Remove every volume not attached to a container'],
        ],
        codeCols: [0],
      },
      examples: [{
        title: 'Persisting data with a named volume',
        language: 'bash',
        code: code(
          'docker volume create app_data',
          'docker run -d --name db -v app_data:/var/lib/postgresql/data postgres:16',
          'docker volume ls',
        ),
      }],
      lessons: ['docker/06-volumes'],
    },
    {
      id: 'networking',
      title: 'Networking',
      table: {
        headers: ['Command', 'What it does'],
        rows: [
          ['docker network create <name>', 'Create a user-defined network (containers on it resolve each other by name)'],
          ['docker network ls', 'List networks'],
          ['docker run --network <name> ...', 'Attach a container to a network'],
          ['docker run -p <host>:<container> ...', 'Map a host port to a container port'],
        ],
        codeCols: [0],
      },
      examples: [{
        title: 'Two containers talking to each other by name',
        language: 'bash',
        code: code(
          'docker network create my-net',
          'docker run -d --name db --network my-net postgres:16',
          'docker run --rm --network my-net alpine ping -c 2 db',
        ),
      }],
      tips: [
        'Containers on the default bridge network cannot resolve each other by name — create a user-defined network for that.',
      ],
      lessons: ['docker/07-networking'],
    },
    {
      id: 'compose',
      title: 'Docker Compose',
      table: {
        headers: ['Command', 'What it does'],
        rows: [
          ['docker compose up -d', 'Start every service in the compose file, detached'],
          ['docker compose ps', 'List the project\'s running services'],
          ['docker compose logs -f', 'Follow logs from every service'],
          ['docker compose down', 'Stop and remove every service, network and (by default) keep volumes'],
        ],
        codeCols: [0],
      },
      examples: [{
        title: 'Bringing up a Compose project',
        language: 'bash',
        code: code(
          'docker compose up -d',
          'docker compose ps',
          'docker compose down',
        ),
      }],
      tips: [
        'depends_on controls startup order but not readiness — pair it with a healthcheck and condition: service_healthy to actually wait until a dependency can accept connections.',
      ],
      lessons: ['docker/08-compose'],
    },
    {
      id: 'registry-cleanup',
      title: 'Registries and cleanup',
      table: {
        headers: ['Command', 'What it does'],
        rows: [
          ['docker tag <image> <user>/<repo>:<tag>', 'Tag a local image for a registry'],
          ['docker push <user>/<repo>:<tag>', 'Push a tagged image to a registry'],
          ['docker image prune', 'Remove dangling (untagged) images'],
          ['docker image prune -a', 'Remove every image not used by a container'],
          ['docker system prune', 'Remove stopped containers, unused networks and dangling images'],
        ],
        codeCols: [0],
      },
      examples: [{
        title: 'Tagging and pushing an image',
        language: 'bash',
        code: code(
          'docker build -t my-app:1.0 .',
          'docker tag my-app:1.0 myusername/my-app:1.0',
          'docker login',
          'docker push myusername/my-app:1.0',
        ),
      }],
      lessons: ['docker/10-registry', 'docker/11-references'],
    },
  ],
  faq: [
    { q: 'What is the difference between an image and a container?', a: 'An image is a read-only template. A container is a running (or stopped) instance created from that image, with its own writable layer on top — you can create many containers from the same image.' },
    { q: 'Why does my container lose its data when I remove it?', a: 'Anything written to a container\'s own writable layer is deleted along with the container. Data that must survive removal needs to be in a named volume, mounted with -v.' },
    { q: 'What is the difference between CMD and ENTRYPOINT?', a: 'CMD provides default arguments that docker run can fully override. ENTRYPOINT sets the command that always runs, with arguments to docker run appended to it instead of replacing it.' },
    { q: 'Why is my image so large?', a: 'Often because build-only tools (compilers, dev dependencies) end up in the final image. A multi-stage build, copying only the compiled output into a small final stage, is the usual fix.' },
    { q: 'Why can\'t two containers reach each other by name?', a: 'They are probably both on the default bridge network, which does not provide name-based DNS. Create a user-defined network with docker network create and attach both containers to it instead.' },
  ],
  more: [
    { label: 'Docker interview questions', href: '/docker-interview-questions' },
    { label: 'Docker lessons', href: '/learn/docker' },
    { label: 'Git cheat sheet', href: '/git-cheatsheet' },
    { label: 'Backend developer roadmap', href: '/roadmaps/backend' },
  ],
};
