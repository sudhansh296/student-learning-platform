import type { DockerLesson } from '../docker-curriculum';

export const lesson09: DockerLesson = {
  id: 'docker-09',
  title: 'Docker with Node.js',
  slug: '09-nodejs-docker',
  chapter: 'advanced',
  order: 9,
  difficulty: 'intermediate',
  readingTime: 14,
  description: 'Containerize a real Node.js Express application end-to-end -- from Dockerfile to development workflow to production setup.',
  sections: [
    {
      type: 'text',
      content: 'Node.js and Docker are a natural pairing. Node\'s ecosystem - with npm, environment-specific configs, and fast startup times - fits perfectly into the container model. This lesson walks through containerizing a real Node.js Express application, from a development workflow to a production-ready multi-stage build.'
    },
    {
      type: 'heading',
      content: 'The Ideal Node.js Dockerfile'
    },
    {
      type: 'example',
      title: 'Production-ready Node.js Dockerfile with best practices',
      content: 'This Dockerfile implements the key best practices for Node.js: starts with Alpine for a small base, copies and installs dependencies before copying source code (for cache efficiency), creates a non-root user for security, and uses node directly for production (not nodemon).',
      code: `FROM node:20-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app directory
WORKDIR /app

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy and install production dependencies only
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy app source
COPY --chown=appuser:appgroup . .

# Switch to non-root user
USER appuser

# Expose app port
EXPOSE 3000

# Use dumb-init to forward signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]`,
      language: 'dockerfile'
    },
    {
      type: 'heading',
      content: 'The .dockerignore File'
    },
    {
      type: 'example',
      title: '.dockerignore for a Node.js project',
      content: 'A proper .dockerignore prevents node_modules, git history, environment files, and test coverage reports from being sent to Docker. Without this, COPY . . would send hundreds of megabytes of node_modules into the build context, making builds extremely slow.',
      code: `node_modules
.git
.gitignore
npm-debug.log
yarn-error.log
.env
.env.*
.nyc_output
coverage
dist
*.md
.vscode
.idea
Dockerfile*
docker-compose*`,
      language: 'bash'
    },
    {
      type: 'heading',
      content: 'Development Workflow With Live Reload'
    },
    {
      type: 'example',
      title: 'Development docker-compose.yml with nodemon live reload',
      content: 'This development compose file mounts the local project directory into the container and uses nodemon to watch for file changes and restart the Node.js server automatically. The separate node_modules volume ensures the container\'s dependencies are used, not the host\'s.',
      code: `version: '3.9'

services:
  api:
    build:
      context: .
      target: development    # Use a dev stage in multi-stage Dockerfile
    volumes:
      - .:/app               # Bind mount source code for live reload
      - /app/node_modules    # Use container's node_modules
    ports:
      - "3000:3000"
      - "9229:9229"          # Node.js debugger port
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgres://user:pass@db:5432/myapp
    depends_on:
      - db
    command: npx nodemon --inspect=0.0.0.0:9229 server.js

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: myapp
    volumes:
      - dev_db:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  dev_db:`,
      language: 'yaml'
    },
    {
      type: 'heading',
      content: 'Multi-Stage Production Build'
    },
    {
      type: 'example',
      title: 'Multi-stage Dockerfile for TypeScript Node.js app',
      content: 'This multi-stage Dockerfile uses a builder stage to compile TypeScript and then copies only the compiled output to the final Alpine runtime image. The result is a small, secure production image that excludes TypeScript, tsc, ts-node, and all devDependencies.',
      code: `# Stage 1: Development (includes devDependencies)
FROM node:20-alpine AS development
RUN apk add --no-cache dumb-init
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npx", "nodemon", "src/server.ts"]

# Stage 2: Build TypeScript
FROM development AS builder
RUN npm run build

# Stage 3: Production runtime (minimal)
FROM node:20-alpine AS production
RUN apk add --no-cache dumb-init
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=builder /app/dist ./dist
USER appuser
EXPOSE 3000
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]`,
      language: 'dockerfile',
      output: `# Build production image (targets the production stage)
docker build --target production -t myapp:prod .
# Final image: ~198 MB
# vs full Node.js image: ~1.4 GB`
    },
    {
      type: 'heading',
      content: 'Full Node.js + MongoDB docker-compose.yml'
    },
    {
      type: 'example',
      title: 'Complete production-style docker-compose.yml',
      content: 'This compose file represents a real-world Node.js + MongoDB stack with environment variables loaded from .env, health checks so the API waits for MongoDB to be ready, resource limits, and named volumes for data persistence.',
      code: `version: '3.9'

services:
  api:
    build: .
    restart: unless-stopped
    ports:
      - "\${PORT:-3000}:3000"
    environment:
      - NODE_ENV=production
      - MONGO_URI=mongodb://\${MONGO_USER}:\${MONGO_PASS}@mongodb:27017/\${MONGO_DB}?authSource=admin
      - JWT_SECRET=\${JWT_SECRET}
    depends_on:
      mongodb:
        condition: service_healthy
    networks:
      - app-net
    deploy:
      resources:
        limits:
          memory: 512m
          cpus: '0.5'

  mongodb:
    image: mongo:7
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: \${MONGO_USER}
      MONGO_INITDB_ROOT_PASSWORD: \${MONGO_PASS}
      MONGO_INITDB_DATABASE: \${MONGO_DB}
    volumes:
      - mongo_data:/data/db
    networks:
      - app-net
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  mongo_data:

networks:
  app-net:`,
      language: 'yaml'
    },
    {
      type: 'heading',
      content: 'Common Node.js Docker Pitfalls'
    },
    {
      type: 'list',
      title: 'Mistakes every Node.js developer makes with Docker (and how to fix them):',
      items: [
        'Including node_modules in COPY: Always add node_modules to .dockerignore - copy package.json and run npm ci inside the container instead',
        'Running as root: Create a non-root user and use USER in the Dockerfile - root container processes can escalate to host root',
        'Ignoring SIGTERM: Node.js does not handle SIGTERM by default - use dumb-init or handle process.on(SIGTERM) to shut down gracefully',
        'Using npm start instead of node directly: npm adds a wrapper process that swallows signals - use CMD ["node", "server.js"] directly',
        'Hardcoding ports: Use the PORT environment variable (process.env.PORT) so the app can be configured at runtime',
        'Bundling .env files: Never COPY .env into your image - pass secrets as runtime environment variables with -e or compose environment'
      ]
    },
    {
      type: 'example',
      title: 'Graceful shutdown handling in Node.js',
      content: 'This code registers SIGTERM and SIGINT handlers so the Node.js process closes the HTTP server and database connections cleanly before exiting. Docker sends SIGTERM when stopping a container - without this handler, active requests would be cut off mid-flight.',
      code: `const http = require('http');
const app = require('./app');

const server = http.createServer(app);

function shutdown(signal) {
  console.log('Received', signal, '- shutting down gracefully');
  server.close(() => {
    console.log('HTTP server closed');
    // Close database connections here
    process.exit(0);
  });
  // Force shutdown after 10 seconds
  setTimeout(() => process.exit(1), 10000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

server.listen(process.env.PORT || 3000);`,
      language: 'bash'
    },
    {
      type: 'note',
      title: 'Use dumb-init or tini',
      content: 'PID 1 inside a container must handle zombie processes and forward signals correctly. Node.js is not designed to be PID 1. Use dumb-init (RUN apk add --no-cache dumb-init) and set ENTRYPOINT ["dumb-init", "--"] to wrap Node.js. Docker\'s official Node.js images include tini for this purpose when launched with --init.'
    },
    {
      type: 'tryit',
      title: 'Node.js Container Builder',
      js: `document.body.innerHTML = '<div><h3>Node.js Container Builder</h3><div class="form-row"><label>Base Image: <select id="base-select"><option value="node:20-alpine">node:20-alpine</option><option value="node:20">node:20</option><option value="node:18-alpine">node:18-alpine</option></select></label><label>Port: <input type="text" id="port-input" value="3000" /></label><label>Entrypoint: <input type="text" id="entry-input" value="server.js" /></label><label><input type="checkbox" id="root-check" checked /> Use non-root user</label></div><div class="form-row"><input type="text" id="env-input" placeholder="Add ENV (e.g. NODE_ENV=production)" /><button id="add-env" class="btn">Add</button></div><div class="output-section"><div class="output-label">Generated Dockerfile</div><pre id="dockerfile-out"></pre></div><div class="output-section"><div class="output-label">Generated docker-compose.yml</div><pre id="compose-out"></pre></div></div>';

var config = {
  baseImage: 'node:20-alpine',
  port: '3000',
  envVars: ['NODE_ENV=production'],
  entrypoint: 'server.js',
  nonRoot: true
};

function generateDockerfile() {
  var lines = [
    'FROM ' + config.baseImage,
    'RUN apk add --no-cache dumb-init',
    'WORKDIR /app',
    config.nonRoot ? 'RUN addgroup -S app && adduser -S app -G app' : '',
    'COPY package*.json ./',
    'RUN npm ci --only=production',
    'COPY ' + (config.nonRoot ? '--chown=app:app ' : '') + '. .',
    config.nonRoot ? 'USER app' : '',
    'EXPOSE ' + config.port,
  ].concat(
    config.envVars.map(function(e) { return 'ENV ' + e; })
  ).concat([
    'ENTRYPOINT [\\"dumb-init\\", \\"--\\"]',
    'CMD [\\"node\\", \\"' + config.entrypoint + '\\"]'
  ]).filter(function(l) { return l.length > 0; });
  return lines.join('\ ');
}

function generateCompose() {
  return 'services:\\n  api:\\n    build: .\\n    ports:\\n      - \\"' + config.port + ':' + config.port + '\\"\\n    environment:\ ' +
    config.envVars.map(function(e) { return '      - ' + e; }).join('\ ') + '\\n    restart: unless-stopped';
}

function render() {
  document.getElementById('dockerfile-out').textContent = generateDockerfile();
  document.getElementById('compose-out').textContent = generateCompose();
}

document.getElementById('base-select').addEventListener('change', function() {
  config.baseImage = this.value;
  render();
});

document.getElementById('port-input').addEventListener('input', function() {
  config.port = this.value || '3000';
  render();
});

document.getElementById('entry-input').addEventListener('input', function() {
  config.entrypoint = this.value || 'server.js';
  render();
});

document.getElementById('root-check').addEventListener('change', function() {
  config.nonRoot = this.checked;
  render();
});

document.getElementById('add-env').addEventListener('click', function() {
  var val = document.getElementById('env-input').value.trim();
  if (val && !config.envVars.includes(val)) {
    config.envVars.push(val);
    document.getElementById('env-input').value = '';
    render();
  }
});

render();`,
      css: `body { padding: 16px; font-family: system-ui, sans-serif; background: #0d1117; color: #c9d1d9; }
h3 { color: #2496ED; margin: 0 0 12px 0; font-size: 15px; }
.form-row { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 12px; align-items: center; }
label { font-size: 12px; color: #8b949e; display: flex; flex-direction: column; gap: 3px; }
select, input[type="text"] { background: #21262d; color: #c9d1d9; border: 1px solid #30363d; padding: 6px 10px; border-radius: 6px; font-size: 12px; font-family: monospace; }
input[type="checkbox"] { margin-right: 4px; }
.btn { background: #2496ED; color: white; border: none; padding: 7px 14px; border-radius: 6px; font-weight: 600; font-size: 12px; cursor: pointer; }
.btn:hover { background: #1a7abf; }
.output-section { margin-bottom: 12px; }
.output-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #2496ED; margin-bottom: 4px; }
pre { background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 12px; font-size: 12px; white-space: pre; overflow-x: auto; margin: 0; color: #e6edf3; }`
    },
    {
      type: 'tip',
      title: 'Use npm ci Instead of npm install',
      content: 'In Dockerfiles, always use npm ci instead of npm install. npm ci requires a package-lock.json, installs exact versions, is significantly faster, and never modifies package.json or lock files. This guarantees reproducible container builds every time.'
    }
  ],
  exercises: [
    {
      id: 'ex-docker-9-1',
      question: 'Why should you use CMD ["node", "server.js"] instead of CMD ["npm", "start"] in a production Dockerfile?',
      type: 'multiple-choice',
      options: [
        'Because npm is not available inside containers',
        'Because npm start is slower to execute',
        'Because npm spawns a shell that intercepts signals like SIGTERM before they reach Node.js',
        'Because CMD only supports binary executables, not npm scripts'
      ],
      correct: 2,
      explanation: 'When npm starts your app, npm becomes the parent process (PID 1). Docker\'s SIGTERM signal is sent to PID 1 (npm), but npm does not forward it to Node.js. The Node.js process never receives SIGTERM and gets forcibly killed. Running node directly means Node.js receives signals and can shut down gracefully.'
    },
    {
      id: 'ex-docker-9-2',
      question: 'What is the purpose of adding dumb-init to a Node.js container?',
      type: 'multiple-choice',
      options: [
        'It makes Node.js run faster by initializing the V8 engine ahead of time',
        'It acts as a minimal init process (PID 1) that correctly handles zombie processes and forwards signals to Node.js',
        'It is required for npm ci to work inside containers',
        'It compresses the Docker image during build'
      ],
      correct: 1,
      explanation: 'dumb-init is a minimal init process designed to run as PID 1 in containers. It correctly handles zombie process reaping and forwards signals (SIGTERM, SIGINT) to the child process (Node.js). Without it, Node.js running as PID 1 may not handle signals properly.'
    },
    {
      id: 'ex-docker-9-3',
      question: 'Why should node_modules be listed in .dockerignore for a Node.js project?',
      type: 'multiple-choice',
      options: [
        'To prevent Docker from caching the npm install step',
        'Because Docker automatically installs node_modules from the registry',
        'To prevent the host\'s node_modules from overwriting those installed inside the container, and to avoid sending hundreds of MB in build context',
        'Because containers cannot use node_modules larger than 100 MB'
      ],
      correct: 2,
      explanation: 'Including node_modules in .dockerignore prevents two problems: it stops hundreds of MB of packages from being sent as build context (making builds very slow), and it stops the COPY . . instruction from overwriting the node_modules installed inside the container by npm ci.'
    }
  ],
  quiz: [
    {
      id: 'q-docker-9-1',
      question: 'What is the advantage of npm ci over npm install in a Dockerfile?',
      options: [
        'npm ci works without a network connection',
        'npm ci installs packages in parallel making it faster',
        'npm ci requires package-lock.json and installs exact pinned versions, giving reproducible builds',
        'npm ci only installs global packages'
      ],
      correct: 2,
      explanation: 'npm ci (clean install) requires a package-lock.json, installs exact versions pinned in the lock file, deletes node_modules first, and never modifies package.json or the lock file. This guarantees that every container build produces the exact same node_modules.'
    },
    {
      id: 'q-docker-9-2',
      question: 'In a multi-stage Node.js Dockerfile, what is copied from the builder stage to the production stage?',
      options: [
        'The entire /app directory including source code and devDependencies',
        'Only the Dockerfile instructions themselves',
        'The compiled output directory (e.g., /app/dist) containing production artifacts',
        'Only the package.json and package-lock.json files'
      ],
      correct: 2,
      explanation: 'The COPY --from=builder instruction copies only the compiled output (the dist folder for TypeScript projects) from the builder stage. The production stage installs its own production-only node_modules, so the final image has no TypeScript compiler, no devDependencies, and no raw source code.'
    },
    {
      id: 'q-docker-9-3',
      question: 'What does process.on(\'SIGTERM\', callback) do in a Node.js application?',
      options: [
        'It registers a callback to handle uncaught exceptions',
        'It sets a timer that terminates the process after a timeout',
        'It registers a graceful shutdown handler that runs when Docker sends the stop signal',
        'It monitors memory usage and terminates when memory exceeds the limit'
      ],
      correct: 2,
      explanation: 'When docker stop is run, Docker sends SIGTERM to PID 1 in the container. Registering a SIGTERM handler lets your Node.js app close the HTTP server, finish in-flight requests, close database connections, and exit cleanly rather than being force-killed after 10 seconds.'
    }
  ]
};
