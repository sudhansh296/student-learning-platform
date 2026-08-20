import type { DockerLesson } from '../docker-curriculum';

export const lesson04: DockerLesson = {
  id: 'docker-04',
  title: 'Docker Containers',
  slug: '04-containers',
  chapter: 'images',
  order: 4,
  difficulty: 'beginner',
  readingTime: 13,
  description: 'Run, manage, stop, and remove containers — and understand container lifecycle from creation to deletion.',
  sections: [
    {
      type: 'text',
      content: 'A container is a running instance of a Docker image. You can run many containers from the same image simultaneously — each gets its own isolated filesystem, network, and process space. Understanding how to manage the container lifecycle is the core skill for day-to-day Docker work.'
    },
    {
      type: 'heading',
      content: 'Container vs Image Relationship'
    },
    {
      type: 'analogy',
      title: 'Class and Object Analogy',
      content: 'An image is like a class in object-oriented programming — it is the blueprint, immutable and reusable. A container is like an object instantiated from that class — it is a live, running instance with its own state. You can create many containers from one image, just as you can create many objects from one class.'
    },
    {
      type: 'heading',
      content: 'docker run — The Most Important Command'
    },
    {
      type: 'text',
      content: 'The docker run command creates and starts a container from an image. It accepts many flags to configure how the container runs. Understanding these flags is essential because they control networking, environment, storage, and naming.'
    },
    {
      type: 'example',
      title: 'docker run with common flags',
      content: 'This example shows the most frequently used docker run flags together: -d runs the container in the background (detached mode), -p maps a host port to a container port, -e sets an environment variable, and --name gives the container a memorable name.',
      code: `# Run nginx in background on port 8080
docker run -d -p 8080:80 --name my-nginx nginx:alpine

# Run postgres with environment variables
docker run -d \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=secret \
  -e POSTGRES_DB=myapp \
  --name my-postgres \
  postgres:16-alpine

# Run a container and remove it when it exits
docker run --rm node:20-alpine node --version`,
      language: 'bash',
      output: `a1b2c3d4e5f6789012345678901234567890123456789012345678901234567890ab
# Container ID is returned when running in detached mode`
    },
    {
      type: 'table',
      title: 'Common docker run flags',
      headers: ['Flag', 'Long form', 'Purpose', 'Example'],
      rows: [
        ['-d', '--detach', 'Run in background', 'docker run -d nginx'],
        ['-p', '--publish', 'Map host:container port', '-p 8080:80'],
        ['-e', '--env', 'Set environment variable', '-e NODE_ENV=production'],
        ['--name', '--name', 'Assign container name', '--name my-app'],
        ['--rm', '--rm', 'Auto-remove when stopped', 'docker run --rm node'],
        ['-it', '--interactive --tty', 'Interactive terminal session', 'docker run -it ubuntu bash'],
        ['-v', '--volume', 'Mount a volume', '-v /host:/container'],
        ['--network', '--network', 'Connect to network', '--network my-net']
      ]
    },
    {
      type: 'heading',
      content: 'Container Lifecycle'
    },
    {
      type: 'list',
      title: 'The four states in a container\'s life:',
      items: [
        'Created: Container has been created from an image but not started yet (docker create)',
        'Running: Container is actively running its main process',
        'Stopped/Exited: The main process has terminated (either normally or due to an error)',
        'Removed: Container has been deleted with docker rm — all its data is gone'
      ]
    },
    {
      type: 'example',
      title: 'Managing container lifecycle',
      content: 'These commands control the running state of containers. docker stop sends SIGTERM to the main process, waits 10 seconds, then sends SIGKILL. docker kill sends SIGKILL immediately without waiting.',
      code: `# Stop a running container (graceful shutdown)
docker stop my-nginx

# Start a stopped container
docker start my-nginx

# Restart a container (stop then start)
docker restart my-nginx

# Force-kill a container immediately
docker kill my-nginx

# Remove a stopped container
docker rm my-nginx

# Force-remove a running container
docker rm -f my-nginx`,
      language: 'bash',
      output: `my-nginx
# Container name is echoed back on success`
    },
    {
      type: 'heading',
      content: 'Interacting With Running Containers'
    },
    {
      type: 'example',
      title: 'docker exec — run commands in a running container',
      content: 'The docker exec command runs a new process inside an already running container. The -it flags give you an interactive terminal. This is how you "shell into" a container to inspect files, run database commands, or debug issues.',
      code: `# Open an interactive shell inside a running container
docker exec -it my-nginx sh

# Run a single command and print the output
docker exec my-nginx nginx -T

# Check the Node.js version inside a container
docker exec my-app node --version`,
      language: 'bash',
      output: `# You get a shell prompt inside the container:
/ #`
    },
    {
      type: 'example',
      title: 'docker logs — view container output',
      content: 'Docker captures all stdout and stderr output from your container\'s main process. Use docker logs to inspect this output for debugging. The --follow flag streams logs in real time like tail -f.',
      code: `# View all logs from a container
docker logs my-nginx

# Follow (stream) logs in real time
docker logs --follow my-nginx

# Show last 50 lines only
docker logs --tail 50 my-nginx

# Show logs with timestamps
docker logs --timestamps my-nginx`,
      language: 'bash',
      output: `2024/08/19 10:23:45 [notice] 1#1: start worker processes
2024/08/19 10:24:01 [info] GET /index.html 200 0.001s
2024/08/19 10:24:05 [info] GET /api/users 200 0.032s`
    },
    {
      type: 'example',
      title: 'docker cp — copy files between host and container',
      content: 'The docker cp command copies files or directories between the host filesystem and a container. This is useful for extracting logs or config files from a container, or for quickly injecting a file without rebuilding the image.',
      code: `# Copy a file from host into a running container
docker cp ./config.json my-app:/app/config.json

# Copy a file from a container to your host
docker cp my-app:/app/logs/error.log ./error.log

# Copy an entire directory out of a container
docker cp my-nginx:/etc/nginx ./nginx-config`,
      language: 'bash',
      output: `Successfully copied 2.34kB to my-app:/app/config.json`
    },
    {
      type: 'example',
      title: 'docker stats — live resource usage',
      content: 'The docker stats command shows a live stream of resource utilization for running containers: CPU percentage, memory usage and limit, network I/O, and block I/O. Essential for identifying memory leaks or CPU hotspots.',
      code: `docker stats`,
      language: 'bash',
      output: `CONTAINER ID   NAME         CPU %   MEM USAGE / LIMIT     MEM %   NET I/O         BLOCK I/O
a1b2c3d4e5f6   my-nginx     0.1%    8.32MiB / 15.55GiB   0.1%    12kB / 3.2kB    0B / 0B
b2c3d4e5f6a7   my-postgres  0.5%    42.1MiB / 15.55GiB   0.3%    1.2MB / 890kB   0B / 45MB`
    },
    {
      type: 'note',
      title: 'Container Names vs IDs',
      content: 'Every container has a unique ID (like a1b2c3d4e5f6) and a name (either assigned with --name or randomly generated). You can use either in any docker command. Names are easier to remember and use in scripts — always use --name in development.'
    },
    {
      type: 'tip',
      title: 'Use --rm for One-Off Tasks',
      content: 'When running a container for a single task (running a migration, checking a file, testing a command), use docker run --rm. The container is automatically removed when it exits, keeping your docker ps -a list clean.'
    },
    {
      type: 'tryit',
      title: 'Container Lifecycle Simulator',
      js: `var containerState = 'stopped';

var stateConfig = {
  created:  { color: '#6c757d', bg: '#f8f9fa', label: 'Created',  desc: 'Container created but not started' },
  running:  { color: '#28a745', bg: '#f0fff4', label: 'Running',  desc: 'Container is actively running' },
  stopped:  { color: '#fd7e14', bg: '#fff8f0', label: 'Stopped',  desc: 'Container exited or was stopped' },
  removed:  { color: '#dc3545', bg: '#fff5f5', label: 'Removed',  desc: 'Container has been deleted' }
};

var logs = [];

function addLog(msg) {
  var ts = new Date().toLocaleTimeString();
  logs.push('[' + ts + '] ' + msg);
  if (logs.length > 6) logs.shift();
  document.getElementById('log-output').innerHTML = logs.map(function(l) {
    return '<div style="color:#c9d1d9;font-size:11px;font-family:monospace;line-height:1.6">' + l + '</div>';
  }).join('');
}

function setState(s) {
  containerState = s;
  var cfg = stateConfig[s];
  var card = document.getElementById('container-card');
  card.style.borderColor = cfg.color;
  card.style.background = cfg.bg;
  document.getElementById('state-badge').style.background = cfg.color;
  document.getElementById('state-label').textContent = cfg.label;
  document.getElementById('state-desc').textContent = cfg.desc;

  document.getElementById('btn-run').disabled = (s === 'running' || s === 'removed');
  document.getElementById('btn-stop').disabled = (s !== 'running');
  document.getElementById('btn-restart').disabled = (s !== 'running' && s !== 'stopped');
  document.getElementById('btn-remove').disabled = (s === 'running' || s === 'removed');
}

document.getElementById('btn-run').addEventListener('click', function() {
  addLog('$ docker start my-app');
  addLog('Container my-app started successfully');
  setState('running');
});

document.getElementById('btn-stop').addEventListener('click', function() {
  addLog('$ docker stop my-app');
  addLog('Sending SIGTERM to process...');
  addLog('Container my-app stopped');
  setState('stopped');
});

document.getElementById('btn-restart').addEventListener('click', function() {
  addLog('$ docker restart my-app');
  addLog('Stopping container...');
  addLog('Starting container my-app');
  setState('running');
});

document.getElementById('btn-remove').addEventListener('click', function() {
  addLog('$ docker rm my-app');
  addLog('Container my-app removed');
  setState('removed');
});

setState('stopped');
addLog('Container my-app is stopped. Click Run to start it.');`,
      css: `body { padding: 16px; font-family: system-ui, sans-serif; background: #f0f4f8; }
h3 { color: #2496ED; margin: 0 0 14px 0; font-size: 15px; font-weight: 700; }
#container-card { border: 2px solid; border-radius: 10px; padding: 16px; margin-bottom: 14px; transition: all 0.3s; }
.card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
.card-name { font-weight: 700; font-size: 15px; color: #212529; font-family: monospace; }
#state-badge { color: white; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; transition: background 0.3s; }
#state-desc { font-size: 12px; color: #6c757d; }
.btn-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
.action-btn { padding: 8px 16px; border-radius: 6px; border: none; font-weight: 600; font-size: 12px; cursor: pointer; transition: all 0.2s; }
#btn-run { background: #28a745; color: white; }
#btn-stop { background: #fd7e14; color: white; }
#btn-restart { background: #17a2b8; color: white; }
#btn-remove { background: #dc3545; color: white; }
.action-btn:disabled { opacity: 0.35; cursor: not-allowed; }
#log-output { background: #0d1117; border-radius: 8px; padding: 10px; min-height: 80px; border: 1px solid #30363d; }`
    },
    {
      type: 'warning',
      title: 'Data Is Lost When You Remove a Container',
      content: 'Any data written inside a container (to its writable layer) is permanently lost when you run docker rm. This includes databases, uploaded files, and logs. Use Docker volumes to persist data beyond the container lifecycle — covered in the volumes lesson.'
    }
  ],
  exercises: [
    {
      id: 'ex-docker-4-1',
      question: 'Which flag do you add to docker run to run a container in the background?',
      type: 'multiple-choice',
      options: [
        '--background',
        '-d (--detach)',
        '--daemon',
        '-b'
      ],
      correct: 1,
      explanation: 'The -d or --detach flag runs the container in the background (detached mode) and prints the container ID. Without it, the container runs in the foreground and you see its output directly in your terminal.'
    },
    {
      id: 'ex-docker-4-2',
      question: 'What does docker exec -it my-container sh do?',
      type: 'multiple-choice',
      options: [
        'Creates a new container from the my-container image and runs sh',
        'Exports the container to a shell script',
        'Opens an interactive shell session inside the already-running my-container',
        'Executes sh on the Docker host machine'
      ],
      correct: 2,
      explanation: 'docker exec runs a command inside an already-running container. -it provides an interactive terminal. sh starts a shell, giving you a command prompt inside the container to inspect and debug it.'
    },
    {
      id: 'ex-docker-4-3',
      question: 'What is the correct docker run flag to map port 3000 on the host to port 3000 in the container?',
      type: 'multiple-choice',
      options: [
        '-p 3000',
        '-p 3000/3000',
        '-p 3000:3000',
        '--port 3000=3000'
      ],
      correct: 2,
      explanation: 'Port mapping syntax is -p hostPort:containerPort. So -p 3000:3000 maps port 3000 on your machine to port 3000 inside the container. You can use different port numbers: -p 8080:3000 maps host:8080 to container:3000.'
    }
  ],
  quiz: [
    {
      id: 'q-docker-4-1',
      question: 'What is the difference between docker stop and docker kill?',
      options: [
        'They are identical — both send SIGKILL',
        'docker stop sends SIGTERM and waits for graceful shutdown; docker kill sends SIGKILL immediately',
        'docker stop removes the container; docker kill only pauses it',
        'docker kill is deprecated and should not be used'
      ],
      correct: 1,
      explanation: 'docker stop sends SIGTERM to allow the container to shut down gracefully (save state, close connections) then waits 10 seconds before sending SIGKILL. docker kill sends SIGKILL immediately, which cannot be caught or ignored by the process.'
    },
    {
      id: 'q-docker-4-2',
      question: 'What command streams live resource usage (CPU, memory) for running containers?',
      options: [
        'docker top',
        'docker status',
        'docker stats',
        'docker monitor'
      ],
      correct: 2,
      explanation: 'docker stats displays a live-updating table of resource consumption for all running containers: CPU%, memory usage/limit, network I/O, and block I/O. Press Ctrl+C to exit. Add container names to monitor specific ones.'
    },
    {
      id: 'q-docker-4-3',
      question: 'What flag automatically removes a container after it exits?',
      options: [
        '--delete',
        '--remove',
        '--cleanup',
        '--rm'
      ],
      correct: 3,
      explanation: 'Adding --rm to docker run causes Docker to automatically delete the container and its writable layer as soon as it exits. Perfect for one-off tasks and running scripts where you do not want the stopped container cluttering docker ps -a.'
    }
  ]
};
