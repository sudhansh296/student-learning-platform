import type { DockerLesson } from '../docker-curriculum';

export const lesson08: DockerLesson = {
  id: 'docker-08',
  title: 'Docker Compose',
  slug: '08-compose',
  chapter: 'advanced',
  order: 8,
  difficulty: 'intermediate',
  readingTime: 14,
  description: 'Define and run multi-container applications with a single docker-compose.yml file -- the standard way to run full stacks locally.',
  sections: [
    {
      type: 'text',
      content: 'Docker Compose is a tool for defining and running multi-container applications. Instead of running multiple docker run commands with dozens of flags, you describe your entire stack in a single docker-compose.yml file and start everything with one command: docker compose up.'
    },
    {
      type: 'heading',
      content: 'What Docker Compose Solves'
    },
    {
      type: 'analogy',
      title: 'The Orchestra Conductor Analogy',
      content: 'Running a multi-container app manually is like trying to conduct an orchestra by running up to each musician individually and telling them when to play. Docker Compose is the conductor - one gesture (docker compose up) and every instrument (service) starts in the right order.'
    },
    {
      type: 'heading',
      content: 'docker-compose.yml Structure'
    },
    {
      type: 'example',
      title: 'A complete three-service docker-compose.yml',
      content: 'This file defines a full web application stack: a Node.js API service built from the local Dockerfile, a PostgreSQL database with persistent storage, and a Redis cache. Each service can be configured with ports, environment variables, volumes, networks, and startup dependencies.',
      code: `version: '3.9'

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgres://user:password@db:5432/myapp
      - REDIS_URL=redis://cache:6379
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_started
    volumes:
      - .:/app
      - /app/node_modules
    networks:
      - app-net

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-net
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d myapp"]
      interval: 5s
      timeout: 5s
      retries: 5

  cache:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    networks:
      - app-net

volumes:
  postgres_data:
  redis_data:

networks:
  app-net:
    driver: bridge`,
      language: 'yaml'
    },
    {
      type: 'heading',
      content: 'Essential Docker Compose Commands'
    },
    {
      type: 'example',
      title: 'docker compose up and down',
      content: 'docker compose up starts all services defined in the docker-compose.yml. Adding -d runs them in detached (background) mode. docker compose down stops and removes all containers, networks created by Compose (volumes are kept by default).',
      code: `# Start all services in the background
docker compose up -d

# Start only specific services
docker compose up -d api cache

# Build images before starting
docker compose up --build -d

# Stop and remove containers and networks
docker compose down

# Stop, remove containers, networks, AND volumes
docker compose down -v`,
      language: 'bash',
      output: `[+] Running 3/3
 - Container myapp-db-1      Started   0.8s
 - Container myapp-cache-1   Started   0.6s
 - Container myapp-api-1     Started   2.1s`
    },
    {
      type: 'example',
      title: 'docker compose status, logs, and exec',
      content: 'These everyday Compose commands let you monitor your running stack, view combined or per-service logs, and execute commands inside individual containers - all without needing to know individual container names or IDs.',
      code: `# Show status of all services
docker compose ps

# View logs from all services (combined)
docker compose logs

# Follow logs for a specific service
docker compose logs --follow api

# Execute a command in a running service
docker compose exec api sh
docker compose exec db psql -U user -d myapp

# Rebuild images without starting
docker compose build`,
      language: 'bash',
      output: `NAME              IMAGE    COMMAND              STATUS       PORTS
myapp-api-1       myapp    "node server.js"     Up 5 min     0.0.0.0:3000->3000/tcp
myapp-db-1        postgres "docker-entrypoint"  Up 5 min     5432/tcp
myapp-cache-1     redis    "docker-entrypoint"  Up 5 min     6379/tcp`
    },
    {
      type: 'heading',
      content: '.env Files With Compose'
    },
    {
      type: 'example',
      title: 'Using .env files for configuration',
      content: 'Docker Compose automatically loads a .env file in the same directory. Variable references in docker-compose.yml using ${VARIABLE_NAME} are substituted with values from .env. This lets you keep sensitive values out of version control while keeping docker-compose.yml committed.',
      code: `# .env file (do NOT commit to git)
POSTGRES_PASSWORD=super_secret_password
POSTGRES_DB=myapp_prod
API_PORT=3000
NODE_ENV=production

# docker-compose.yml uses them:
# services:
#   db:
#     environment:
#       POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
#       POSTGRES_DB: \${POSTGRES_DB}
#   api:
#     ports:
#       - "\${API_PORT}:3000"`,
      language: 'bash'
    },
    {
      type: 'heading',
      content: 'Health Checks and depends_on'
    },
    {
      type: 'text',
      content: 'The depends_on field controls startup order. With condition: service_healthy, a service waits until the dependency\'s healthcheck reports healthy before starting. This prevents your API from crashing on startup because the database is not yet ready to accept connections.'
    },
    {
      type: 'example',
      title: 'Health check configuration',
      content: 'This healthcheck runs pg_isready inside the postgres container every 5 seconds to determine if PostgreSQL is ready to accept connections. The api service uses condition: service_healthy to wait until this check passes before starting.',
      code: `services:
  db:
    image: postgres:16-alpine
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \${POSTGRES_USER}"]
      interval: 5s
      timeout: 5s
      retries: 5
      start_period: 10s

  api:
    depends_on:
      db:
        condition: service_healthy`,
      language: 'yaml'
    },
    {
      type: 'heading',
      content: 'Compose Profiles'
    },
    {
      type: 'example',
      title: 'Using profiles for optional services',
      content: 'Profiles let you define optional services that only start when explicitly requested. For example, a monitoring stack (Prometheus, Grafana) might only be needed by some developers - wrap it in a profile and others do not get it.',
      code: `services:
  api:
    image: myapp
    # No profile = always started

  grafana:
    image: grafana/grafana
    profiles:
      - monitoring

  prometheus:
    image: prom/prometheus
    profiles:
      - monitoring

# Start only core services
docker compose up -d

# Start core + monitoring services
docker compose --profile monitoring up -d`,
      language: 'yaml'
    },
    {
      type: 'table',
      title: 'Docker Compose vs docker stack',
      headers: ['Feature', 'docker compose', 'docker stack'],
      rows: [
        ['Target environment', 'Local development', 'Docker Swarm production cluster'],
        ['File format', 'docker-compose.yml', 'docker-compose.yml (subset)'],
        ['Scaling', 'Single host only', 'Multi-host scaling'],
        ['Rolling updates', 'Not built-in', 'Built-in with update_config'],
        ['Secrets', 'Environment variables', 'Docker secrets (encrypted)'],
        ['Typical use', 'Dev/test environments', 'Production Swarm clusters']
      ]
    },
    {
      type: 'note',
      title: 'Docker Compose V2 vs V1',
      content: 'The newer Docker Compose V2 (docker compose, built into Docker CLI) replaced the older V1 (docker-compose, Python-based standalone tool). Use docker compose (no hyphen) for all new work. The behavior is mostly the same but V2 is faster, actively maintained, and integrated into Docker Desktop.'
    },
    {
      type: 'tryit',
      title: 'Compose Service Visualizer',
      js: `document.body.innerHTML = '<div><h3>Compose Service Visualizer</h3><div class="btn-row"><button id="compose-up" class="compose-btn">docker compose up -d</button><button id="compose-down" class="compose-btn">docker compose down</button></div><div id="services-grid"></div></div>';

var services = [
  { name: 'api',      image: 'myapp:latest',       status: 'stopped', color: '#2496ED', port: '3000', deps: ['db', 'cache'] },
  { name: 'db',       image: 'postgres:16-alpine',  status: 'stopped', color: '#336791', port: '5432', deps: [] },
  { name: 'cache',    image: 'redis:7-alpine',       status: 'stopped', color: '#dc3545', port: '6379', deps: [] }
];

var starting = false;

function getStatusConfig(s) {
  return s === 'running'
    ? { badge: 'Running', bg: '#f0fff4', borderColor: '#28a745', badgeBg: '#28a745' }
    : s === 'starting'
    ? { badge: 'Starting...', bg: '#fff8f0', borderColor: '#fd7e14', badgeBg: '#fd7e14' }
    : { badge: 'Stopped', bg: '#f8f9fa', borderColor: '#dee2e6', badgeBg: '#6c757d' };
}

function renderServices() {
  var container = document.getElementById('services-grid');
  container.innerHTML = services.map(function(svc) {
    var cfg = getStatusConfig(svc.status);
    return '<div class="svc-card" style="border-color:' + cfg.borderColor + ';background:' + cfg.bg + '">' +
      '<div class="svc-header" style="background:' + svc.color + '">' +
        '<span class="svc-name">' + svc.name + '</span>' +
        '<span class="svc-port">:' + svc.port + '</span>' +
      '</div>' +
      '<div class="svc-body">' +
        '<div class="svc-image">' + svc.image + '</div>' +
        (svc.deps.length ? '<div class="svc-deps">depends_on: ' + svc.deps.join(', ') + '</div>' : '') +
        '<div class="svc-badge" style="background:' + cfg.badgeBg + '">' + cfg.badge + '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

function setStatus(name, status) {
  services.forEach(function(s) { if (s.name === name) s.status = status; });
  renderServices();
}

function delay(ms) { return new Promise(function(r) { setTimeout(r, ms); }); }

document.getElementById('compose-up').addEventListener('click', async function() {
  if (starting) return;
  starting = true;
  this.disabled = true;
  document.getElementById('compose-down').disabled = true;
  setStatus('db', 'starting'); setStatus('cache', 'starting');
  await delay(800);
  setStatus('db', 'running'); setStatus('cache', 'running');
  await delay(600);
  setStatus('api', 'starting');
  await delay(1000);
  setStatus('api', 'running');
  starting = false;
  this.disabled = false;
  document.getElementById('compose-down').disabled = false;
});

document.getElementById('compose-down').addEventListener('click', function() {
  services.forEach(function(s) { s.status = 'stopped'; });
  renderServices();
});

renderServices();`,
      css: `body { padding: 16px; font-family: system-ui, sans-serif; background: #f0f4f8; }
h3 { color: #2496ED; margin: 0 0 12px 0; font-size: 15px; font-weight: 700; }
.btn-row { display: flex; gap: 8px; margin-bottom: 14px; }
.compose-btn { padding: 9px 18px; border-radius: 6px; border: none; font-weight: 700; font-size: 13px; cursor: pointer; font-family: monospace; }
#compose-up { background: #28a745; color: white; }
#compose-down { background: #dc3545; color: white; }
.compose-btn:disabled { opacity: 0.5; cursor: not-allowed; }
#services-grid { display: flex; gap: 10px; flex-wrap: wrap; }
.svc-card { flex: 1; min-width: 140px; border: 2px solid; border-radius: 10px; overflow: hidden; transition: all 0.3s; }
.svc-header { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; }
.svc-name { font-weight: 700; font-size: 14px; color: white; font-family: monospace; }
.svc-port { font-size: 11px; color: rgba(255,255,255,0.8); font-family: monospace; }
.svc-body { padding: 10px 12px; }
.svc-image { font-family: monospace; font-size: 11px; color: #6c757d; margin-bottom: 6px; }
.svc-deps { font-size: 10px; color: #6c757d; margin-bottom: 6px; }
.svc-badge { display: inline-block; color: white; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 700; }`
    },
    {
      type: 'tip',
      title: 'Use docker compose watch for Development',
      content: 'Docker Compose v2.22+ includes a watch mode (docker compose watch) that automatically syncs file changes into containers and triggers rebuilds when needed. It replaces the manual -v $(pwd):/app bind mount pattern for development.'
    }
  ],
  exercises: [
    {
      id: 'ex-docker-8-1',
      question: 'What command starts all services defined in docker-compose.yml in the background?',
      type: 'multiple-choice',
      options: [
        'docker compose start',
        'docker compose run -d',
        'docker compose up -d',
        'docker compose begin --background'
      ],
      correct: 2,
      explanation: 'docker compose up -d starts all services defined in docker-compose.yml in detached (background) mode. Without -d, logs stream to your terminal and Ctrl+C stops all services. docker compose start only starts already-created containers.'
    },
    {
      id: 'ex-docker-8-2',
      question: 'What does depends_on with condition: service_healthy do?',
      type: 'multiple-choice',
      options: [
        'It installs health monitoring tools inside the service',
        'It waits until the dependency container\'s healthcheck passes before starting the dependent service',
        'It restarts a service if it becomes unhealthy during operation',
        'It limits the service to only start when CPU usage is below a threshold'
      ],
      correct: 1,
      explanation: 'depends_on: condition: service_healthy causes Docker Compose to wait until the dependency service reports healthy status (via its healthcheck) before starting the dependent service. This prevents connection errors when services start before their dependencies are ready.'
    },
    {
      id: 'ex-docker-8-3',
      question: 'What does docker compose down -v do that docker compose down does not?',
      type: 'multiple-choice',
      options: [
        '-v shows verbose output during shutdown',
        '-v also deletes named volumes defined in the compose file, removing persisted data',
        '-v removes the docker-compose.yml file',
        '-v stops services using SIGKILL instead of SIGTERM'
      ],
      correct: 1,
      explanation: 'docker compose down removes containers and networks but preserves volumes. Adding -v also removes named volumes declared in the volumes section of docker-compose.yml. This deletes all persisted database data, so use it only when you want a completely clean slate.'
    }
  ],
  quiz: [
    {
      id: 'q-docker-8-1',
      question: 'How does Docker Compose handle networking by default?',
      options: [
        'All services join the host network',
        'Each service gets its own isolated network with no inter-service communication',
        'Compose creates a default bridge network and all services can reach each other by service name',
        'Services must manually configure IP addresses for communication'
      ],
      correct: 2,
      explanation: 'Docker Compose automatically creates a default bridge network for the project. All services are attached to it and can reach each other using their service names as hostnames (DNS). This is why your Node.js app can connect to a service named db with the hostname db.'
    },
    {
      id: 'q-docker-8-2',
      question: 'What is the purpose of the .env file in a Docker Compose project?',
      options: [
        'It configures the Docker daemon settings',
        'It provides default variable values that docker-compose.yml can reference with ${VARIABLE}',
        'It sets environment variables only for the docker-compose process itself',
        'It is required for docker compose up to work'
      ],
      correct: 1,
      explanation: 'Docker Compose automatically reads a .env file and uses its values to substitute ${VARIABLE} references in docker-compose.yml. This separates configuration (and secrets) from the compose file structure, keeping sensitive values out of version control.'
    },
    {
      id: 'q-docker-8-3',
      question: 'What is the correct command to view live logs from only the api service?',
      options: [
        'docker logs api',
        'docker compose logs --follow api',
        'docker compose watch api',
        'docker compose tail api'
      ],
      correct: 1,
      explanation: 'docker compose logs --follow api streams live logs from the api service (the service name from docker-compose.yml, not the container name). Without a service name, all services\' logs are combined. docker logs works on container names/IDs, not service names.'
    }
  ]
};
