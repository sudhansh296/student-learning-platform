import type { DockerLesson } from '../docker-curriculum';

export const lesson05: DockerLesson = {
  id: 'docker-05',
  title: 'Dockerfile -- Building Custom Images',
  slug: '05-dockerfile',
  chapter: 'images',
  order: 5,
  difficulty: 'intermediate',
  readingTime: 14,
  description: 'Write Dockerfiles to build your own images, understand every instruction, and apply multi-stage build techniques.',
  sections: [
    {
      type: 'text',
      content: 'A Dockerfile is a text file containing a series of instructions that Docker executes in order to build a custom image. Every line that changes the filesystem creates a new layer. Understanding how to write efficient Dockerfiles is the central skill for packaging applications with Docker.'
    },
    {
      type: 'heading',
      content: 'Dockerfile Instruction Reference'
    },
    {
      type: 'example',
      title: 'A complete Node.js Dockerfile with all key instructions',
      content: 'This Dockerfile demonstrates the most important instructions in a real-world Node.js setup: FROM sets the base image, WORKDIR sets the working directory inside the container, COPY transfers files, RUN executes commands, ENV sets environment variables, EXPOSE documents a port, and CMD sets the default startup command.',
      code: `# ---- Base stage ----
FROM node:20-alpine

# Set working directory for all subsequent commands
WORKDIR /app

# Copy dependency manifests first (cache optimization)
COPY package*.json ./

# Install dependencies (cached unless package.json changes)
RUN npm ci --only=production

# Copy application source code
COPY . .

# Set runtime environment variable
ENV NODE_ENV=production
ENV PORT=3000

# Build argument (available only at build time)
ARG APP_VERSION=1.0.0

# Document which port the app listens on
EXPOSE 3000

# Default command to run when container starts
CMD ["node", "server.js"]`,
      language: 'dockerfile'
    },
    {
      type: 'table',
      title: 'Dockerfile instruction quick reference',
      headers: ['Instruction', 'Purpose', 'Example'],
      rows: [
        ['FROM', 'Set base image (required, first instruction)', 'FROM node:20-alpine'],
        ['WORKDIR', 'Set working directory (creates if absent)', 'WORKDIR /app'],
        ['COPY', 'Copy files from host into image', 'COPY package*.json ./'],
        ['RUN', 'Execute command and commit result as new layer', 'RUN npm ci'],
        ['ENV', 'Set environment variable (available at runtime)', 'ENV NODE_ENV=production'],
        ['ARG', 'Build-time variable (not available at runtime)', 'ARG VERSION=1.0'],
        ['EXPOSE', 'Document container port (informational)', 'EXPOSE 3000'],
        ['CMD', 'Default command when container starts', 'CMD ["node", "app.js"]'],
        ['ENTRYPOINT', 'Fixed executable (CMD provides arguments)', 'ENTRYPOINT ["node"]'],
        ['VOLUME', 'Declare mount point for external volume', 'VOLUME ["/data"]'],
        ['USER', 'Switch to this user for subsequent commands', 'USER node'],
        ['LABEL', 'Add metadata as key-value pairs', 'LABEL version="1.0"']
      ]
    },
    {
      type: 'heading',
      content: 'CMD vs ENTRYPOINT'
    },
    {
      type: 'table',
      title: 'CMD vs ENTRYPOINT differences',
      headers: ['Aspect', 'CMD', 'ENTRYPOINT'],
      rows: [
        ['Purpose', 'Default command, easily overridden', 'Fixed executable, hard to override'],
        ['Override', 'docker run image newcommand', 'docker run image --arg (appended)'],
        ['Best use', 'Applications where command can vary', 'Container that acts as an executable'],
        ['Example', 'CMD ["npm", "start"]', 'ENTRYPOINT ["node", "server.js"]'],
        ['Together', 'ENTRYPOINT provides binary, CMD provides defaults', 'ENTRYPOINT ["node"] CMD ["app.js"]']
      ]
    },
    {
      type: 'heading',
      content: '.dockerignore'
    },
    {
      type: 'example',
      title: '.dockerignore - exclude files from the build context',
      content: 'The .dockerignore file tells Docker which files and directories to exclude when sending the build context to the daemon. Without it, Docker sends your entire project directory including node_modules, .git, and test files - making builds much slower.',
      code: `# .dockerignore
node_modules
.git
.gitignore
*.md
.env
.env.*
dist
coverage
.nyc_output
*.log
.DS_Store
Thumbs.db`,
      language: 'bash'
    },
    {
      type: 'heading',
      content: 'Building Images'
    },
    {
      type: 'example',
      title: 'docker build - creating an image from a Dockerfile',
      content: 'The docker build command reads the Dockerfile and executes each instruction to produce an image. The -t flag names and tags the image, and the final argument is the build context directory (usually . for current directory).',
      code: `# Build with a name and tag
docker build -t myapp:1.0.0 .

# Build with multiple tags
docker build -t myapp:1.0.0 -t myapp:latest .

# Build from a specific Dockerfile
docker build -f Dockerfile.prod -t myapp:prod .

# Build with a build argument
docker build --build-arg APP_VERSION=2.0.0 -t myapp:2.0.0 .`,
      language: 'bash',
      output: `[+] Building 12.4s (10/10) FINISHED
 => [internal] load build definition from Dockerfile
 => [1/5] FROM node:20-alpine
 => [2/5] WORKDIR /app
 => [3/5] COPY package*.json ./
 => [4/5] RUN npm ci --only=production
 => [5/5] COPY . .
 => exporting to image
 => naming to docker.io/library/myapp:1.0.0`
    },
    {
      type: 'heading',
      content: 'Build Cache and Layer Ordering'
    },
    {
      type: 'text',
      content: 'Docker caches each layer. When you rebuild, Docker reuses cached layers until it finds one that has changed. Ordering your Dockerfile instructions from least-frequently-changed to most-frequently-changed maximizes cache hits and speeds up iterative development builds dramatically.'
    },
    {
      type: 'example',
      title: 'Optimized layer order for cache efficiency',
      content: 'Copy package.json before your application code so that the npm install layer is only re-run when dependencies change, not every time you change a source file. This single optimization can save minutes per build in large projects.',
      code: `# GOOD: Dependencies cached separately from code
COPY package*.json ./
RUN npm ci --only=production
COPY . .          # Code changes only invalidate this layer

# BAD: Any code change triggers full npm install
COPY . .
RUN npm ci --only=production`,
      language: 'dockerfile'
    },
    {
      type: 'heading',
      content: 'Multi-Stage Builds'
    },
    {
      type: 'text',
      content: 'Multi-stage builds use multiple FROM instructions in one Dockerfile. Each stage can use a different base image. The final stage copies only the built artifacts from earlier stages - discarding compilers, test tools, and source code. This dramatically reduces final image size.'
    },
    {
      type: 'example',
      title: 'Multi-stage build for a TypeScript Node.js app',
      content: 'This Dockerfile uses a builder stage with full Node.js to compile TypeScript, then copies only the compiled JavaScript output into a minimal Alpine runtime image. The final image excludes TypeScript, tsc, and all dev dependencies.',
      code: `# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /build
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Stage 2: Production runtime
FROM node:20-alpine AS runtime
WORKDIR /app
# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY package*.json ./
RUN npm ci --only=production
# Copy only compiled output from builder
COPY --from=builder /build/dist ./dist
USER appuser
EXPOSE 3000
CMD ["node", "dist/server.js"]`,
      language: 'dockerfile',
      output: `Final image size: 198 MB (vs 1.4 GB without multi-stage)`
    },
    {
      type: 'note',
      title: 'Non-Root User Security',
      content: 'By default, containers run as root. This is a security risk - a compromised application running as root can affect the host system. Always create a dedicated non-root user in production Dockerfiles using adduser (Alpine) or useradd (Debian/Ubuntu) and switch to it with USER.'
    },
    {
      type: 'tip',
      title: 'Combine RUN Commands to Reduce Layers',
      content: 'Each RUN instruction creates a layer. Combining related commands with && reduces the total number of layers. For package managers, install and clean up in the same RUN command: RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*'
    },
    {
      type: 'tryit',
      title: 'Dockerfile Builder',
      js: `document.body.innerHTML = '<div><h3>Dockerfile Builder</h3><div class="controls"><select id="instr-select"><option value="FROM">FROM</option><option value="WORKDIR">WORKDIR</option><option value="COPY">COPY</option><option value="RUN">RUN</option><option value="ENV">ENV</option><option value="EXPOSE">EXPOSE</option><option value="CMD">CMD</option></select><input type="text" id="instr-value" placeholder="node:20-alpine" /><button id="add-btn" class="btn">Add</button><button id="load-btn" class="btn">Load Example</button><button id="reset-btn" class="btn">Reset</button></div><pre id="dockerfile-preview"></pre></div>';

var dockerfile = [];
var instructions = {
  FROM:    function(v) { return 'FROM ' + v; },
  WORKDIR: function(v) { return 'WORKDIR ' + v; },
  COPY:    function(v) { return 'COPY ' + v; },
  RUN:     function(v) { return 'RUN ' + v; },
  ENV:     function(v) { return 'ENV ' + v; },
  EXPOSE:  function(v) { return 'EXPOSE ' + v; },
  CMD:     function(v) { return 'CMD [' + v.split(' ').map(function(p) { return '\\"' + p + '\\"'; }).join(', ') + ']'; }
};

var defaults = {
  FROM: 'node:20-alpine',
  WORKDIR: '/app',
  COPY: 'package*.json ./',
  RUN: 'npm ci --only=production',
  ENV: 'NODE_ENV=production',
  EXPOSE: '3000',
  CMD: 'node server.js'
};

function renderDockerfile() {
  var pre = document.getElementById('dockerfile-preview');
  if (dockerfile.length === 0) {
    pre.textContent = '# Your Dockerfile will appear here...';
    return;
  }
  pre.textContent = dockerfile.join('\ ');
}

document.getElementById('add-btn').addEventListener('click', function() {
  var sel = document.getElementById('instr-select').value;
  var val = document.getElementById('instr-value').value.trim() || defaults[sel];
  dockerfile.push(instructions[sel](val));
  renderDockerfile();
  document.getElementById('instr-value').value = '';
  document.getElementById('instr-value').placeholder = defaults[sel];
});

document.getElementById('reset-btn').addEventListener('click', function() {
  dockerfile = [];
  renderDockerfile();
});

document.getElementById('load-btn').addEventListener('click', function() {
  dockerfile = [
    'FROM node:20-alpine',
    'WORKDIR /app',
    'COPY package*.json ./',
    'RUN npm ci --only=production',
    'COPY . .',
    'ENV NODE_ENV=production',
    'EXPOSE 3000',
    'CMD [\\"node\\", \\"server.js\\"]'
  ];
  renderDockerfile();
});

document.getElementById('instr-select').addEventListener('change', function() {
  document.getElementById('instr-value').placeholder = defaults[this.value];
});

renderDockerfile();`,
      css: `body { padding: 16px; font-family: system-ui, sans-serif; background: #0d1117; color: #c9d1d9; }
h3 { color: #2496ED; margin: 0 0 12px 0; font-size: 15px; }
.controls { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; align-items: center; }
select, input { background: #21262d; color: #c9d1d9; border: 1px solid #30363d; padding: 7px 10px; border-radius: 6px; font-size: 12px; font-family: monospace; }
input { flex: 1; min-width: 140px; }
.btn { background: #2496ED; color: white; border: none; padding: 7px 14px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 12px; }
.btn:hover { background: #1a7abf; }
#reset-btn { background: #dc3545; }
#load-btn { background: #28a745; }
#dockerfile-preview { background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 14px; font-family: monospace; font-size: 12px; white-space: pre; min-height: 140px; color: #e6edf3; overflow-x: auto; }`
    },
    {
      type: 'warning',
      title: 'Never Store Secrets in Dockerfile Instructions',
      content: 'Never put passwords, API keys, or tokens in ENV instructions in a Dockerfile. Every ENV value is stored in the image layers and visible with docker inspect. Use environment variables passed at runtime with docker run -e, or use Docker secrets in production.'
    }
  ],
  exercises: [
    {
      id: 'ex-docker-5-1',
      question: 'Why should you COPY package*.json and RUN npm install BEFORE COPY . . in a Dockerfile?',
      type: 'multiple-choice',
      options: [
        'It is required by Docker syntax and will fail otherwise',
        'It ensures npm install runs with root permissions',
        'So the npm install layer is cached separately and only re-runs when dependencies change, not every code change',
        'Because Docker always requires dependency files to be at the top of the Dockerfile'
      ],
      correct: 2,
      explanation: 'Docker caches each layer. If you copy all files first, any code change invalidates the npm install cache. By copying package.json first and installing separately, npm install is only re-run when package.json changes, saving minutes per build.'
    },
    {
      id: 'ex-docker-5-2',
      question: 'What is the main benefit of a multi-stage Docker build?',
      type: 'multiple-choice',
      options: [
        'It allows you to run containers in parallel',
        'The final image contains only runtime artifacts without build tools, making it much smaller and more secure',
        'It creates multiple identical images for redundancy',
        'It enables building for multiple architectures simultaneously'
      ],
      correct: 1,
      explanation: 'Multi-stage builds use separate stages for building and running. The final stage copies only the built artifacts (compiled code, production deps) from the build stage, excluding compilers, type checkers, test frameworks, and source code from the final image.'
    },
    {
      id: 'ex-docker-5-3',
      question: 'What is the difference between ENV and ARG in a Dockerfile?',
      type: 'multiple-choice',
      options: [
        'ENV is for Linux; ARG is for Windows',
        'ENV sets a runtime environment variable; ARG sets a build-time variable not available after the build',
        'ARG encrypts values; ENV stores them in plain text',
        'They are identical but ARG accepts only numbers'
      ],
      correct: 1,
      explanation: 'ENV variables persist into the running container and are visible with docker inspect. ARG variables are only available during the docker build process and are not embedded in the final image, making them safe for build-time configuration like version numbers.'
    }
  ],
  quiz: [
    {
      id: 'q-docker-5-1',
      question: 'What does the WORKDIR instruction do in a Dockerfile?',
      options: [
        'Sets the working directory on the host machine',
        'Creates and sets the working directory inside the container for all subsequent RUN, COPY, and CMD instructions',
        'Defines the directory where the Dockerfile itself is located',
        'Sets the user\'s home directory inside the container'
      ],
      correct: 1,
      explanation: 'WORKDIR sets the working directory inside the container. If the directory does not exist, Docker creates it. All subsequent RUN, COPY, ADD, CMD, and ENTRYPOINT instructions operate relative to this directory.'
    },
    {
      id: 'q-docker-5-2',
      question: 'What is the purpose of .dockerignore?',
      options: [
        'It lists Docker commands that should be skipped during builds',
        'It specifies which Dockerfile instructions require root permissions',
        'It tells Docker which files to exclude from the build context, preventing large or sensitive files from being sent to the daemon',
        'It lists base images that are not allowed in your organization'
      ],
      correct: 2,
      explanation: '.dockerignore excludes files from the build context sent to the Docker daemon. Without it, Docker would send node_modules, .git history, and all local files, dramatically slowing builds and potentially exposing secrets stored in .env files.'
    },
    {
      id: 'q-docker-5-3',
      question: 'Which instruction sets the default command that runs when a container starts?',
      options: [
        'RUN',
        'EXECUTE',
        'START',
        'CMD'
      ],
      correct: 3,
      explanation: 'CMD specifies the default command to run when a container starts. It can be overridden by passing a command to docker run. ENTRYPOINT sets a fixed executable that cannot be easily overridden. RUN executes commands during the build phase only.'
    }
  ]
};
