import type { DockerLesson } from '../docker-curriculum';

export const lesson02: DockerLesson = {
  id: 'docker-02',
  title: 'Installing Docker and First Steps',
  slug: '02-installation',
  chapter: 'fundamentals',
  order: 2,
  difficulty: 'beginner',
  readingTime: 10,
  description: 'Install Docker Desktop, run your first container, and understand the basic docker commands you will use every day.',
  sections: [
    {
      type: 'text',
      content: 'Getting Docker installed and running your first commands is the critical first milestone. Docker Desktop provides everything you need on macOS and Windows - including the daemon, CLI, and a GUI dashboard - in a single installer.'
    },
    {
      type: 'heading',
      content: 'Installing Docker Desktop'
    },
    {
      type: 'table',
      title: 'Installation by operating system',
      headers: ['OS', 'Method', 'Requirements'],
      rows: [
        ['Windows 10/11', 'Docker Desktop for Windows (WSL 2 backend)', 'WSL 2 enabled, virtualization in BIOS'],
        ['macOS (Intel)', 'Docker Desktop for Mac (Intel)', 'macOS 11 or later'],
        ['macOS (Apple Silicon)', 'Docker Desktop for Mac (Apple Silicon)', 'macOS 11 or later, Rosetta 2'],
        ['Ubuntu/Debian', 'Docker Engine via apt-get', 'sudo privileges'],
        ['Fedora/RHEL', 'Docker Engine via dnf', 'sudo privileges'],
        ['Any Linux', 'Docker Desktop for Linux (DEB/RPM)', 'GNOME/KDE desktop']
      ]
    },
    {
      type: 'example',
      title: 'Installing Docker Engine on Ubuntu',
      content: 'These commands add the official Docker apt repository and install Docker Engine on Ubuntu or Debian. The convenience script approach works too but the manual method is preferred for production servers.',
      code: `# Add Docker's official GPG key and repository
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc

# Install Docker Engine
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io

# Add your user to the docker group (no more sudo)
sudo usermod -aG docker $USER
newgrp docker`,
      language: 'bash',
      output: `Reading package lists... Done
Setting up docker-ce (5:26.0.0-1~ubuntu.22.04~jammy) ...`
    },
    {
      type: 'heading',
      content: 'Verifying Your Installation'
    },
    {
      type: 'example',
      title: 'docker version',
      content: 'This command shows the version of both the Docker client and the Docker daemon. If both appear, Docker is installed and the daemon is running. If you see only a client version, the daemon may not be started.',
      code: `docker version`,
      language: 'bash',
      output: `Client: Docker Engine - Community
 Version:           26.0.0
 API version:       1.45
 Go version:        go1.21.8
 OS/Arch:           linux/amd64

Server: Docker Engine - Community
 Engine:
  Version:          26.0.0
  API version:      1.45`
    },
    {
      type: 'example',
      title: 'docker info',
      content: 'The docker info command provides a detailed summary of your Docker installation - total containers, images, storage driver, kernel version, and CPU/memory available to Docker.',
      code: `docker info`,
      language: 'bash',
      output: `Client:
 Context:    default
 Debug Mode: false

Server:
 Containers: 3
  Running: 1
  Paused: 0
  Stopped: 2
 Images: 12
 Server Version: 26.0.0
 Storage Driver: overlay2
 Total Memory: 15.55GiB`
    },
    {
      type: 'heading',
      content: 'Running Your First Real Container'
    },
    {
      type: 'text',
      content: 'The docker run hello-world command verifies the full Docker pipeline: the client contacts the daemon, the daemon checks for a local image, pulls it from Docker Hub if missing, creates a container, runs it, and streams the output back to your terminal.'
    },
    {
      type: 'example',
      title: 'docker run hello-world (annotated)',
      content: 'Running hello-world exercises the entire Docker stack from CLI to daemon to registry and back. The output explains each step Docker took, making it an ideal first test.',
      code: `docker run hello-world`,
      language: 'bash',
      output: `Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
c1ec31eb5944: Pull complete
Digest: sha256:1408...
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.`
    },
    {
      type: 'heading',
      content: 'Essential Everyday Commands'
    },
    {
      type: 'example',
      title: 'docker ps - list running containers',
      content: 'The docker ps command lists all currently running containers with their ID, image, command, creation time, status, port mappings, and name. Think of it as the Docker equivalent of the ps command in Unix.',
      code: `docker ps`,
      language: 'bash',
      output: `CONTAINER ID   IMAGE         COMMAND                  CREATED         STATUS         PORTS                    NAMES
a1b2c3d4e5f6   nginx:alpine  "/docker-entrypoint.…"   2 minutes ago   Up 2 minutes   0.0.0.0:8080->80/tcp     my-nginx`
    },
    {
      type: 'example',
      title: 'docker ps -a - list all containers',
      content: 'Adding the -a (--all) flag shows every container - running, stopped, and exited. This is essential for finding containers that have crashed or been stopped but not removed.',
      code: `docker ps -a`,
      language: 'bash',
      output: `CONTAINER ID   IMAGE         COMMAND       CREATED        STATUS                    NAMES
a1b2c3d4e5f6   nginx         "nginx -g …"  5 min ago      Up 5 minutes              my-nginx
b2c3d4e5f6a7   hello-world   "/hello"      10 min ago     Exited (0) 10 min ago     hopeful_darwin
c3d4e5f6a7b8   node:20       "node app.js" 1 hour ago     Exited (1) 59 min ago     my-node-app`
    },
    {
      type: 'example',
      title: 'docker images - list local images',
      content: 'This command shows all Docker images stored on your machine with their repository, tag, ID, creation date, and size. Images accumulate over time and can take up disk space - use docker rmi to remove ones you no longer need.',
      code: `docker images`,
      language: 'bash',
      output: `REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
nginx         alpine    3f8a00f137a0   2 weeks ago    43.3MB
node          20-alpine b2c3d4e5f6a7   3 weeks ago    176MB
hello-world   latest    c1ec31eb5944   8 months ago   13.3kB`
    },
    {
      type: 'example',
      title: 'docker pull - download an image',
      content: 'Use docker pull to download an image without running it immediately. This is useful for pre-downloading images during setup or for verifying a specific tag exists before building a Dockerfile.',
      code: `docker pull postgres:16-alpine`,
      language: 'bash',
      output: `16-alpine: Pulling from library/postgres
96526aa774ef: Pull complete
b588e5b54d5a: Pull complete
Digest: sha256:a3f9...
Status: Downloaded newer image for postgres:16-alpine
docker.io/library/postgres:16-alpine`
    },
    {
      type: 'note',
      title: 'Image Tags',
      content: 'When you pull an image without specifying a tag (docker pull node), Docker pulls the :latest tag. Always specify an explicit tag like node:20-alpine in production Dockerfiles to ensure reproducible builds - the latest tag changes over time.'
    },
    {
      type: 'tip',
      title: 'Use Alpine Images',
      content: 'Alpine Linux-based images (like node:20-alpine, nginx:alpine) are dramatically smaller than full Linux images. node:20-alpine is about 176 MB while node:20 is over 1 GB. Smaller images mean faster pulls, less disk usage, and a smaller attack surface.'
    },
    {
      type: 'tryit',
      title: 'Docker Command Simulator',
      js: `document.body.innerHTML = '<div><h3>Docker Command Simulator</h3><div id="btn-row"></div><button id="clear-btn">Clear Terminal</button><div id="terminal"><div style="color:#484f58;font-size:12px;font-family:monospace">Click a command button above to simulate running it...</div></div></div>';

var outputs = {
  'docker version': \`Client: Docker Engine - Community
 Version:           26.0.0
 API version:       1.45
 OS/Arch:           linux/amd64

Server: Docker Engine - Community
 Engine Version:    26.0.0
 Status:            Running\`,
  'docker ps': \`CONTAINER ID   IMAGE         PORTS                  NAMES
a1b2c3d4e5f6   nginx:alpine  0.0.0.0:8080->80/tcp   my-nginx
b2c3d4e5f6a7   postgres:16   0.0.0.0:5432->5432/tcp db\`,
  'docker images': \`REPOSITORY    TAG       IMAGE ID       SIZE
nginx         alpine    3f8a00f137a0   43.3MB
node          20-alpine b2c3d4e5f6a7   176MB
postgres      16-alpine c3d4e5f6a7b8   268MB
hello-world   latest    c1ec31eb5944   13.3kB\`,
  'docker run': \`
Pulling from library/hello-world...
Hello from Docker!
This message shows that your installation appears to be working correctly.
Container exited with code 0.\`
};

var cmds = ['docker version', 'docker ps', 'docker images', 'docker run'];

var history = [];

function appendOutput(cmd, out) {
  var term = document.getElementById('terminal');
  var entry = document.createElement('div');
  entry.style.cssText = 'margin-bottom:12px';
  entry.innerHTML = '<div style="color:#57d4a0;font-size:13px;font-family:monospace;margin-bottom:4px">$ ' + cmd + '</div>' +
    '<pre style="margin:0;font-size:12px;color:#c9d1d9;background:#161b22;padding:8px;border-radius:4px;white-space:pre-wrap">' + out + '</pre>';
  term.appendChild(entry);
  term.scrollTop = term.scrollHeight;
}

cmds.forEach(function(cmd) {
  var btn = document.createElement('button');
  btn.className = 'cmd-btn';
  btn.textContent = cmd;
  btn.addEventListener('click', function() {
    appendOutput(cmd, outputs[cmd]);
  });
  document.getElementById('btn-row').appendChild(btn);
});

document.getElementById('clear-btn').addEventListener('click', function() {
  document.getElementById('terminal').innerHTML = '<div style="color:#484f58;font-size:12px;font-family:monospace">Click a command button above to simulate running it...</div>';
});`,
      css: `body { padding: 16px; font-family: system-ui, sans-serif; background: #0d1117; color: #c9d1d9; }
h3 { color: #2496ED; margin: 0 0 12px 0; font-size: 15px; }
#btn-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.cmd-btn { background: #21262d; color: #58a6ff; border: 1px solid #30363d; padding: 8px 14px; border-radius: 6px; font-family: monospace; font-size: 12px; cursor: pointer; font-weight: 600; }
.cmd-btn:hover { background: #2496ED; color: white; border-color: #2496ED; }
#terminal { background: #0d1117; border: 1px solid #30363d; border-radius: 8px; padding: 14px; min-height: 160px; max-height: 280px; overflow-y: auto; font-family: monospace; }
#clear-btn { background: #21262d; color: #8b949e; border: 1px solid #30363d; padding: 6px 12px; border-radius: 4px; font-size: 11px; cursor: pointer; margin-bottom: 8px; }
#clear-btn:hover { color: white; }`
    },
    {
      type: 'warning',
      title: 'Running Docker Without sudo on Linux',
      content: 'On Linux, Docker commands require sudo by default. To run without sudo, add your user to the docker group: sudo usermod -aG docker $USER. Then log out and back in. Note that any user in the docker group has root-equivalent privileges, so only add trusted users.'
    }
  ],
  exercises: [
    {
      id: 'ex-docker-2-1',
      question: 'Which command shows all containers including stopped ones?',
      type: 'multiple-choice',
      options: [
        'docker ps',
        'docker ps -a',
        'docker containers list',
        'docker show all'
      ],
      correct: 1,
      explanation: 'docker ps only shows running containers. The -a (or --all) flag makes it show every container regardless of status - running, stopped, exited, or created.'
    },
    {
      id: 'ex-docker-2-2',
      question: 'Why is it recommended to use explicit image tags like node:20-alpine instead of node:latest?',
      type: 'multiple-choice',
      options: [
        'Because latest images are slower to download',
        'Because the latest tag is reserved for private images only',
        'Because latest changes over time and can break reproducible builds',
        'Because Alpine images require explicit tags to function'
      ],
      correct: 2,
      explanation: 'The :latest tag points to whatever the image maintainer designates as latest, which changes as new versions are released. Using an explicit version like :20-alpine ensures your Dockerfile always builds from the same base image.'
    },
    {
      id: 'ex-docker-2-3',
      question: 'What does docker pull do differently from docker run?',
      type: 'multiple-choice',
      options: [
        'docker pull runs a container; docker run only downloads the image',
        'docker pull downloads an image without starting a container; docker run both downloads (if needed) and starts a container',
        'They are identical commands with different names',
        'docker pull is used only for private registries'
      ],
      correct: 1,
      explanation: 'docker pull only downloads the image to your local machine. docker run downloads the image if it is not already local, creates a container from it, and starts the container.'
    }
  ],
  quiz: [
    {
      id: 'q-docker-2-1',
      question: 'What does the docker info command display?',
      options: [
        'Help documentation for all Docker commands',
        'The list of all images on Docker Hub',
        'Detailed information about your Docker installation including containers, images, and system resources',
        'The Docker daemon log file'
      ],
      correct: 2,
      explanation: 'docker info displays a comprehensive overview of your Docker installation: number of running/stopped containers, total images, storage driver, kernel version, and available memory and CPU.'
    },
    {
      id: 'q-docker-2-2',
      question: 'On macOS, why does Docker Desktop run a lightweight Linux VM?',
      options: [
        'To provide a GUI dashboard for managing containers',
        'Because Docker containers require a Linux kernel and macOS uses Darwin/XNU',
        'To comply with Apple\'s App Store guidelines',
        'To isolate Docker from macOS system files'
      ],
      correct: 1,
      explanation: 'Docker containers require a Linux kernel to run. macOS uses Darwin/XNU which is not Linux. Docker Desktop runs a hidden lightweight Linux VM using Apple\'s Virtualization Framework to provide the required Linux kernel.'
    },
    {
      id: 'q-docker-2-3',
      question: 'What command verifies both the Docker client and server are working?',
      options: [
        'docker status',
        'docker health',
        'docker version',
        'docker ping'
      ],
      correct: 2,
      explanation: 'docker version prints version information for both the client and the server daemon. If both sections appear, Docker is fully operational. If only the client section appears, the daemon is not running.'
    }
  ]
};
