import type { DockerLesson } from '../docker-curriculum';

export const lesson06: DockerLesson = {
  id: 'docker-06',
  title: 'Docker Volumes and Data Persistence',
  slug: '06-volumes',
  chapter: 'images',
  order: 6,
  difficulty: 'intermediate',
  readingTime: 12,
  description: 'Persist data beyond container lifecycle using volumes and bind mounts -- the essential skill for stateful containers.',
  sections: [
    {
      type: 'text',
      content: 'By default, all data written inside a container lives in its writable layer and is permanently deleted when the container is removed. For databases, uploaded files, or any stateful application, you need a way to persist data outside the container lifecycle - that is what Docker volumes provide.'
    },
    {
      type: 'heading',
      content: 'Why Data Is Lost When Containers Stop'
    },
    {
      type: 'text',
      content: 'Each container gets a thin writable layer on top of the image layers. This layer exists only as long as the container exists. When you run docker rm, Docker deletes the container and its writable layer entirely. The underlying image layers are untouched, but any data your application wrote is gone.'
    },
    {
      type: 'analogy',
      title: 'The Hotel Room Analogy',
      content: 'A container is like a hotel room. You check in (docker run), use the room, leave your things in the room (write data). When you check out (docker rm), the hotel cleans everything out. Next guest gets a fresh room. If you want to keep your belongings, you need a storage unit (volume) outside the room.'
    },
    {
      type: 'heading',
      content: 'Three Types of Docker Storage'
    },
    {
      type: 'table',
      title: 'Volumes vs Bind Mounts vs tmpfs',
      headers: ['Type', 'Storage Location', 'Managed By', 'Best Use Case'],
      rows: [
        ['Named Volume', 'Docker managed (/var/lib/docker/volumes/)', 'Docker', 'Database data, persistent app data'],
        ['Anonymous Volume', 'Docker managed (random name)', 'Docker', 'Temporary data, one-off containers'],
        ['Bind Mount', 'Any path on the host filesystem', 'User', 'Development, sharing source code'],
        ['tmpfs Mount', 'Host RAM only (not written to disk)', 'Kernel', 'Sensitive temp data, cache']
      ]
    },
    {
      type: 'heading',
      content: 'Docker Volume Commands'
    },
    {
      type: 'example',
      title: 'docker volume - create, list, inspect, remove',
      content: 'These are the core commands for managing named volumes. Named volumes persist even after all containers using them are removed, making them the correct choice for database storage and any data that must survive container restarts and recreations.',
      code: `# Create a named volume
docker volume create mydata

# List all volumes
docker volume ls

# Inspect volume details
docker volume inspect mydata

# Remove a specific volume
docker volume rm mydata

# Remove all unused volumes
docker volume prune`,
      language: 'bash',
      output: `DRIVER    VOLUME NAME
local     mydata
local     postgres_data
local     redis_data

[{
  "Name": "mydata",
  "Driver": "local",
  "Mountpoint": "/var/lib/docker/volumes/mydata/_data"
}]`
    },
    {
      type: 'heading',
      content: '--mount vs -v Syntax'
    },
    {
      type: 'example',
      title: 'Two ways to mount volumes when running containers',
      content: 'The -v flag is the older shorthand syntax while --mount is the newer, more explicit form. --mount is recommended for scripts and production because it makes the source, target, and type unmistakably clear, reducing the chance of a typo silently creating a wrong mount.',
      code: `# Old shorthand -v syntax
docker run -d \
  -v postgres_data:/var/lib/postgresql/data \
  --name my-postgres \
  postgres:16-alpine

# New explicit --mount syntax (recommended)
docker run -d \
  --mount type=volume,source=postgres_data,target=/var/lib/postgresql/data \
  --name my-postgres \
  postgres:16-alpine`,
      language: 'bash'
    },
    {
      type: 'heading',
      content: 'Bind Mounts for Development'
    },
    {
      type: 'example',
      title: 'Bind mount for live reload development',
      content: 'A bind mount maps a directory on your host machine into the container. Changes you make to files on your host are instantly visible inside the container. Combined with a file watcher like nodemon, this gives you live reload during development without rebuilding the image.',
      code: `# Mount current directory into container for live development
docker run -d \
  -p 3000:3000 \
  -v $(pwd):/app \
  -v /app/node_modules \
  --name dev-server \
  node:20-alpine \
  sh -c "npm install && npx nodemon server.js"

# Windows PowerShell equivalent
docker run -d \
  -p 3000:3000 \
  -v \${PWD}:/app \
  -v /app/node_modules \
  --name dev-server \
  node:20-alpine sh -c "npm install && npx nodemon server.js"`,
      language: 'bash'
    },
    {
      type: 'note',
      title: 'The node_modules Trick',
      content: 'When bind-mounting your project directory, the host\'s node_modules (or absence of one) would overwrite the container\'s node_modules. Adding -v /app/node_modules creates an anonymous volume at that path, effectively masking the bind mount for that subdirectory and keeping the container\'s node_modules intact.'
    },
    {
      type: 'heading',
      content: 'Sharing Volumes Between Containers'
    },
    {
      type: 'example',
      title: 'Two containers sharing a named volume',
      content: 'Named volumes can be mounted into multiple containers simultaneously. This is how sidecar patterns work - a main application container and a log-shipping container can share the same log volume, with one writing and one reading.',
      code: `# Create a shared volume
docker volume create shared_logs

# Container A writes logs
docker run -d \
  --name app \
  -v shared_logs:/app/logs \
  myapp:latest

# Container B reads and ships logs
docker run -d \
  --name log-shipper \
  -v shared_logs:/logs:ro \
  fluent/fluent-bit`,
      language: 'bash'
    },
    {
      type: 'example',
      title: 'Read-only volume mounts',
      content: 'Adding :ro to a volume mount makes it read-only inside the container. This is a security best practice for configuration files and secrets - the container can read the values but cannot modify them, preventing accidental or malicious changes.',
      code: `# Read-only config bind mount
docker run -d \
  -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro \
  --name my-nginx \
  nginx:alpine`,
      language: 'bash'
    },
    {
      type: 'table',
      title: 'Volume use case reference',
      headers: ['Scenario', 'Solution', 'Example Command'],
      rows: [
        ['PostgreSQL data persistence', 'Named volume', '-v pgdata:/var/lib/postgresql/data'],
        ['Local dev with live reload', 'Bind mount (project dir)', '-v $(pwd):/app'],
        ['Inject config from host', 'Bind mount (read-only)', '-v ./nginx.conf:/etc/nginx/nginx.conf:ro'],
        ['Prevent host node_modules override', 'Anonymous volume on path', '-v /app/node_modules'],
        ['Sensitive temp data (not on disk)', 'tmpfs', '--mount type=tmpfs,target=/tmp']
      ]
    },
    {
      type: 'tip',
      title: 'Back Up Volumes With a Temporary Container',
      content: 'To back up a named volume, run a temporary container that mounts the volume and tars the contents: docker run --rm -v myvolume:/data -v $(pwd):/backup alpine tar czf /backup/backup.tar.gz /data'
    },
    {
      type: 'tryit',
      title: 'Volume Persistence Demo',
      js: `document.body.innerHTML = '<div><h3>Volume Persistence Demo</h3><div class="btn-row"><button id="write-btn" class="btn">Write to Volume (Container A)</button><button id="stop-a-btn" class="btn">Stop Container A</button><button id="start-b-btn" class="btn">Start Container B</button></div><div class="containers-row"><div id="cont-a" class="container-box"><div class="cont-label">Container A</div><div class="cont-name">container-a</div><div id="cont-a-status">Running</div></div><div id="cont-b" class="container-box"><div class="cont-label">Container B</div><div class="cont-name">container-b</div><div id="cont-b-status">Stopped</div></div></div><div id="volume-box"><div class="vol-label">Named Volume: mydata</div><div id="volume-data"></div></div><div id="event-log"></div></div>';

var volumeData = [];
var containerARunning = true;
var containerBRunning = false;

function log(msg, color) {
  var el = document.getElementById('event-log');
  var div = document.createElement('div');
  div.style.cssText = 'font-size:11px;font-family:monospace;color:' + (color||'#c9d1d9') + ';line-height:1.7';
  div.textContent = msg;
  el.appendChild(div);
  el.scrollTop = el.scrollHeight;
}

function renderVolume() {
  var vol = document.getElementById('volume-data');
  vol.innerHTML = volumeData.length === 0
    ? '<div style="color:#484f58;font-size:12px;font-style:italic">Volume is empty</div>'
    : volumeData.map(function(d, i) {
        return '<div style="font-size:12px;font-family:monospace;padding:4px 8px;background:#1c2128;border-radius:4px;margin-bottom:4px;color:#57d4a0">[' + i + '] ' + d + '</div>';
      }).join('');
}

function renderContainers() {
  document.getElementById('cont-a').style.borderColor = containerARunning ? '#28a745' : '#6c757d';
  document.getElementById('cont-a-status').textContent = containerARunning ? 'Running' : 'Stopped';
  document.getElementById('cont-a-status').style.color = containerARunning ? '#28a745' : '#6c757d';
  document.getElementById('cont-b').style.borderColor = containerBRunning ? '#2496ED' : '#6c757d';
  document.getElementById('cont-b-status').textContent = containerBRunning ? 'Running' : 'Stopped';
  document.getElementById('cont-b-status').style.color = containerBRunning ? '#2496ED' : '#6c757d';
}

document.getElementById('write-btn').addEventListener('click', function() {
  if (!containerARunning) { log('Container A is not running!', '#dc3545'); return; }
  var entry = 'Log entry at ' + new Date().toLocaleTimeString() + ' from Container A';
  volumeData.push(entry);
  log('Container A wrote: ' + entry, '#57d4a0');
  renderVolume();
});

document.getElementById('stop-a-btn').addEventListener('click', function() {
  containerARunning = false;
  log('$ docker stop container-a', '#fd7e14');
  log('container-a stopped. Data persists in named volume.', '#fd7e14');
  renderContainers();
});

document.getElementById('start-b-btn').addEventListener('click', function() {
  containerBRunning = true;
  log('$ docker run --name container-b -v mydata:/data myimage', '#2496ED');
  log('Container B started and mounted the same volume!', '#2496ED');
  log('Container B can see ' + volumeData.length + ' entries in /data', '#2496ED');
  renderContainers();
});

renderContainers();
renderVolume();
log('Named volume "mydata" created. Container A is running.', '#484f58');`,
      css: `body { padding: 16px; font-family: system-ui, sans-serif; background: #0d1117; color: #c9d1d9; }
h3 { color: #2496ED; margin: 0 0 12px 0; font-size: 15px; }
.btn-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
.btn { padding: 8px 14px; border-radius: 6px; border: none; font-weight: 600; font-size: 12px; cursor: pointer; }
#write-btn { background: #28a745; color: white; }
#stop-a-btn { background: #fd7e14; color: white; }
#start-b-btn { background: #2496ED; color: white; }
.containers-row { display: flex; gap: 10px; margin-bottom: 12px; }
.container-box { flex: 1; border: 2px solid; border-radius: 8px; padding: 10px; background: #161b22; transition: border-color 0.3s; }
.cont-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #8b949e; }
.cont-name { font-size: 13px; font-weight: 700; font-family: monospace; color: #e6edf3; margin: 2px 0; }
#volume-box { background: #161b22; border: 2px solid #2496ED; border-radius: 8px; padding: 10px; margin-bottom: 12px; }
.vol-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #2496ED; margin-bottom: 6px; }
#event-log { background: #0d1117; border: 1px solid #30363d; border-radius: 8px; padding: 10px; min-height: 60px; max-height: 100px; overflow-y: auto; }`
    },
    {
      type: 'warning',
      title: 'docker volume prune Deletes All Unused Volumes',
      content: 'Running docker volume prune removes all volumes not currently mounted by any container - including ones with important data. Always verify with docker volume ls before pruning, and make sure your databases are running (even stopped containers keep volumes attached).'
    }
  ],
  exercises: [
    {
      id: 'ex-docker-6-1',
      question: 'What happens to data written inside a container when you run docker rm on that container?',
      type: 'multiple-choice',
      options: [
        'The data is automatically backed up to a volume',
        'The data persists in the image and is available next time',
        'The data is permanently deleted along with the container\'s writable layer',
        'The data is moved to /tmp on the host machine'
      ],
      correct: 2,
      explanation: 'When a container is removed with docker rm, its writable layer is permanently deleted. All data written inside the container that was not saved to a named volume or bind mount is gone forever.'
    },
    {
      id: 'ex-docker-6-2',
      question: 'Which storage type is recommended for persisting a PostgreSQL database in Docker?',
      type: 'multiple-choice',
      options: [
        'tmpfs mount (stored in RAM)',
        'Anonymous volume',
        'Named volume',
        'Read-only bind mount'
      ],
      correct: 2,
      explanation: 'Named volumes are the recommended way to persist database data. They are managed by Docker, survive container removal and recreation, can be backed up, and work consistently across development and production environments.'
    },
    {
      id: 'ex-docker-6-3',
      question: 'When using a bind mount for local development, why do you also add -v /app/node_modules?',
      type: 'multiple-choice',
      options: [
        'To speed up npm install inside the container',
        'To share node_modules between all containers',
        'To prevent the host directory (which may lack node_modules) from overwriting the container\'s node_modules',
        'To create a backup of node_modules on the host'
      ],
      correct: 2,
      explanation: 'When you bind-mount your project directory, the host\'s state of node_modules (possibly absent) overwrites the container path. Adding -v /app/node_modules creates an anonymous volume at that exact path inside the container, masking the bind mount for that subdirectory.'
    }
  ],
  quiz: [
    {
      id: 'q-docker-6-1',
      question: 'What is the key difference between a named volume and a bind mount?',
      options: [
        'Named volumes are faster; bind mounts are slower',
        'Named volumes are managed by Docker and abstracted from the host path; bind mounts map a specific host directory',
        'Named volumes work on Linux only; bind mounts work on all platforms',
        'Named volumes are read-only; bind mounts are read-write'
      ],
      correct: 1,
      explanation: 'Named volumes are fully managed by Docker - Docker decides where they are stored on the host. Bind mounts map an exact path on your host filesystem into the container, giving you full control over the location but coupling the container to the host\'s directory structure.'
    },
    {
      id: 'q-docker-6-2',
      question: 'What does adding :ro to a volume mount do?',
      options: [
        'Registers the volume with the Docker registry',
        'Makes the volume read-only inside the container',
        'Sets the volume to use remote object storage',
        'Enables automatic rotation of volume contents'
      ],
      correct: 1,
      explanation: 'Adding :ro (read-only) to a mount, such as -v config.json:/app/config.json:ro, makes the mount read-only inside the container. The container can read the file but cannot modify it, which is a security best practice for configuration and secret files.'
    },
    {
      id: 'q-docker-6-3',
      question: 'What command removes all Docker volumes not currently used by any container?',
      options: [
        'docker volume rm --all',
        'docker volume clean',
        'docker volume prune',
        'docker rm volumes'
      ],
      correct: 2,
      explanation: 'docker volume prune removes all volumes not currently referenced by any container (running or stopped). Use it carefully - volumes containing database data for stopped containers will be deleted. Add -f to skip the confirmation prompt.'
    }
  ]
};
