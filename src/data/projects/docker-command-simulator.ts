import type { Project } from './types';

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Docker Command Simulator</title>
<link rel="stylesheet" href="style.css">
</head>
<body>

<div id="app">

  <header class="topbar">
    <div class="topbar-left">
      <div class="brand-icon">D</div>
      <span class="brand-name">Docker Command Simulator</span>
      <span class="brand-sub">local engine</span>
    </div>
    <div class="topbar-right">
      <button id="btnReset" class="btn-sm">Reset engine</button>
    </div>
  </header>

  <div class="layout">

    <aside class="sidebar">
      <div class="group-title">IMAGES</div>
      <button class="cb" data-key="pullImage">docker pull</button>
      <button class="cb" data-key="listImages">docker images</button>

      <div class="group-title">CONTAINERS</div>
      <button class="cb" data-key="runContainer">docker run</button>
      <button class="cb" data-key="listContainers">docker ps</button>
      <button class="cb" data-key="listAllContainers">docker ps -a</button>

      <div class="group-title">LIFECYCLE</div>
      <button class="cb" data-key="stopContainer">docker stop</button>
      <button class="cb" data-key="startContainer">docker start</button>
      <button class="cb" data-key="removeContainer">docker rm</button>

      <div class="group-title">INSPECT</div>
      <button class="cb" data-key="containerLogs">docker logs</button>

      <div class="group-title">CLEANUP</div>
      <button class="cb" data-key="removeImage">docker rmi</button>
      <button class="cb" data-key="pruneContainers">docker container prune</button>
    </aside>

    <div class="main">

      <div class="cmd-box">
        <div class="cmd-label">COMMAND</div>
        <pre id="cmdText" class="cmd-pre"></pre>
        <div id="paramRow" class="param-row"></div>
        <button id="btnRun" class="btn-run">Run Command</button>
      </div>

      <div class="term-box">
        <div class="term-top">
          <span class="term-label">TERMINAL OUTPUT</span>
        </div>
        <pre id="termOut" class="term-out">Select a command and click Run.</pre>
      </div>

    </div>

    <aside class="docs">
      <div class="group-title">EXPLANATION</div>
      <div id="docsBox" class="docs-body">Select a command on the left.</div>
    </aside>

  </div>
</div>

<script src="script.js"></script>
</body>
</html>`;

const styleCss = `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%}
body{font-family:'Segoe UI',system-ui,sans-serif;background:#0d1117;color:#e6edf3;font-size:13px;line-height:1.5;overflow:hidden}
button{cursor:pointer;font-family:inherit}
input{font-family:inherit}

#app{display:flex;flex-direction:column;height:100vh}

.topbar{display:flex;align-items:center;justify-content:space-between;padding:0 16px;height:48px;background:#161b22;border-bottom:1px solid #30363d;flex-shrink:0}
.topbar-left{display:flex;align-items:center;gap:10px}
.brand-icon{width:30px;height:30px;background:linear-gradient(135deg,#0db7ed,#066da5);border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:14px;color:#fff;font-family:monospace}
.brand-name{font-weight:800;font-size:14px}
.brand-sub{font-size:10px;color:#484f58;background:#21262d;padding:2px 7px;border-radius:99px;border:1px solid #30363d;font-family:monospace}
.topbar-right{display:flex;align-items:center;gap:10px}
.btn-sm{padding:4px 12px;background:none;border:1px solid #30363d;border-radius:4px;color:#8b949e;font-size:11px;transition:all .12s}
.btn-sm:hover{color:#e6edf3;border-color:#8b949e}

.layout{display:grid;grid-template-columns:200px 1fr 260px;flex:1;overflow:hidden}

.sidebar{background:#161b22;border-right:1px solid #30363d;overflow-y:auto;padding:8px 0}
.group-title{font-size:10px;font-weight:700;letter-spacing:1.2px;color:#484f58;padding:10px 12px 4px;text-transform:uppercase}
.cb{display:block;width:100%;padding:7px 12px;background:none;border:none;border-left:2px solid transparent;color:#8b949e;text-align:left;font-size:11.5px;font-family:monospace;transition:all .12s}
.cb:hover{background:#21262d;color:#e6edf3}
.cb.active{background:#161b22;border-left-color:#0db7ed;color:#e6edf3}

.main{display:flex;flex-direction:column;overflow:hidden;border-right:1px solid #30363d}

.cmd-box{padding:14px;border-bottom:1px solid #30363d;flex-shrink:0}
.cmd-label{font-size:10px;font-weight:700;letter-spacing:1px;color:#484f58;margin-bottom:6px}
.cmd-pre{background:#161b22;border:1px solid #30363d;border-radius:6px;padding:12px 14px;font-family:monospace;font-size:12.5px;color:#79c0ff;white-space:pre-wrap;line-height:1.6;margin-bottom:10px}
.param-row{display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap}
.param-row label{font-size:11px;color:#8b949e;font-family:monospace}
.param-row input{padding:5px 9px;background:#21262d;border:1px solid #30363d;border-radius:4px;color:#e6edf3;font-size:12px;font-family:monospace;outline:none;width:140px}
.param-row input:focus{border-color:#0db7ed}
.btn-run{padding:8px 20px;background:#238636;color:#fff;border:none;border-radius:5px;font-size:13px;font-weight:700;transition:background .15s}
.btn-run:hover{background:#2ea043}

.term-box{flex:1;display:flex;flex-direction:column;padding:14px;overflow:hidden;min-height:0}
.term-top{display:flex;align-items:center;gap:10px;margin-bottom:8px;flex-shrink:0}
.term-label{font-size:10px;font-weight:700;letter-spacing:1px;color:#484f58}
.term-out{flex:1;overflow:auto;background:#161b22;border:1px solid #30363d;border-radius:6px;padding:12px 14px;font-family:monospace;font-size:12px;color:#c9d1d9;white-space:pre-wrap;line-height:1.7}
.term-out .err{color:#f85149}
.term-out .ok{color:#3fb950}

.docs{background:#161b22;overflow-y:auto;padding:8px 0}
.docs-body{padding:4px 14px 14px;font-size:12px;color:#8b949e;line-height:1.7}
.docs-body h4{color:#e6edf3;font-size:12px;font-weight:700;margin:10px 0 4px}
.docs-body p{margin-bottom:6px}
.docs-body code{background:#0d1117;border:1px solid #30363d;border-radius:3px;padding:1px 5px;font-family:monospace;font-size:11px;color:#79c0ff}

@media(max-width:900px){.layout{grid-template-columns:180px 1fr}.docs{display:none}}`;

const scriptJs = `'use strict';

// ================================================================
// IMAGE CATALOG (known images with realistic sizes/ports)
// ================================================================
var CATALOG = {
  'nginx:alpine':    { size: '42MB',  ports: [80] },
  'redis:alpine':     { size: '32MB',  ports: [6379] },
  'postgres:16':      { size: '238MB', ports: [5432] },
  'node:20-alpine':   { size: '118MB', ports: [] }
};
function catalogInfo(ref) {
  return CATALOG[ref] || { size: '71MB', ports: [] };
}

// ================================================================
// ENGINE STATE
// ================================================================
var ENGINE = { images: [], containers: [], nextId: 1 };

function resetEngine() {
  ENGINE.images = [];
  ENGINE.containers = [];
  ENGINE.nextId = 1;
}
resetEngine();

function shortId() {
  var id = ENGINE.nextId++;
  return ('0000000000' + id.toString(16)).slice(-12);
}

function findImage(ref) {
  return ENGINE.images.find(function(i) { return i.ref === ref; });
}
function findContainer(name) {
  return ENGINE.containers.find(function(c) { return c.name === name; });
}

// ================================================================
// COMMAND DEFINITIONS
// ================================================================
var COMMANDS = {
  pullImage: {
    cmd: 'docker pull {{image}}',
    params: [{ key: 'image', label: 'image:tag', type: 'text', default: 'nginx:alpine' }],
    run: function(p) {
      var ref = p.image;
      if (findImage(ref)) {
        return { ok: true, text: ref + ': Pulling from library\\nDigest: sha256:already-exists\\nStatus: Image is up to date for ' + ref };
      }
      var info = catalogInfo(ref);
      ENGINE.images.push({ ref: ref, size: info.size, ports: info.ports });
      return { ok: true, text: ref + ': Pulling from library\\nabc123def456: Pull complete\\nDigest: sha256:' + shortId() + '\\nStatus: Downloaded newer image for ' + ref };
    }
  },
  listImages: {
    cmd: 'docker images',
    params: [],
    run: function() {
      if (!ENGINE.images.length) return { ok: true, text: 'REPOSITORY   TAG   IMAGE ID   SIZE\\n(no images pulled yet)' };
      var lines = ['REPOSITORY:TAG          IMAGE ID       SIZE'];
      ENGINE.images.forEach(function(i) {
        lines.push(pad(i.ref, 24) + pad(shortId(), 15) + i.size);
      });
      return { ok: true, text: lines.join('\\n') };
    }
  },
  runContainer: {
    cmd: 'docker run -d --name {{name}} -p {{port}}:80 {{image}}',
    params: [
      { key: 'name', label: 'container name', type: 'text', default: 'web' },
      { key: 'port', label: 'host port', type: 'number', default: 8080 },
      { key: 'image', label: 'image:tag', type: 'text', default: 'nginx:alpine' }
    ],
    run: function(p) {
      if (findContainer(p.name)) {
        return { ok: false, text: 'docker: Error response from daemon: Conflict. The container name "' + p.name + '" is already in use.' };
      }
      var pullMsg = '';
      if (!findImage(p.image)) {
        var info = catalogInfo(p.image);
        ENGINE.images.push({ ref: p.image, size: info.size, ports: info.ports });
        pullMsg = 'Unable to find image "' + p.image + '" locally\\n' + p.image + ': Pulling from library\\nStatus: Downloaded newer image for ' + p.image + '\\n';
      }
      var id = shortId();
      var containerPort = catalogInfo(p.image).ports[0] || 80;
      ENGINE.containers.push({ id: id, name: p.name, image: p.image, port: p.port, containerPort: containerPort, status: 'running' });
      return { ok: true, text: pullMsg + id };
    }
  },
  listContainers: {
    cmd: 'docker ps',
    params: [],
    run: function() {
      var running = ENGINE.containers.filter(function(c) { return c.status === 'running'; });
      return { ok: true, text: formatContainerTable(running) };
    }
  },
  listAllContainers: {
    cmd: 'docker ps -a',
    params: [],
    run: function() {
      return { ok: true, text: formatContainerTable(ENGINE.containers) };
    }
  },
  stopContainer: {
    cmd: 'docker stop {{name}}',
    params: [{ key: 'name', label: 'container name', type: 'text', default: 'web' }],
    run: function(p) {
      var c = findContainer(p.name);
      if (!c) return { ok: false, text: 'Error: No such container: ' + p.name };
      if (c.status !== 'running') return { ok: true, text: p.name + '\\n(already stopped)' };
      c.status = 'exited';
      return { ok: true, text: p.name };
    }
  },
  startContainer: {
    cmd: 'docker start {{name}}',
    params: [{ key: 'name', label: 'container name', type: 'text', default: 'web' }],
    run: function(p) {
      var c = findContainer(p.name);
      if (!c) return { ok: false, text: 'Error: No such container: ' + p.name };
      c.status = 'running';
      return { ok: true, text: p.name };
    }
  },
  removeContainer: {
    cmd: 'docker rm {{name}}',
    params: [{ key: 'name', label: 'container name', type: 'text', default: 'web' }],
    run: function(p) {
      var c = findContainer(p.name);
      if (!c) return { ok: false, text: 'Error: No such container: ' + p.name };
      if (c.status === 'running') {
        return { ok: false, text: 'Error response from daemon: cannot remove container "' + p.name + '": container is running: stop the container before removing or force remove' };
      }
      ENGINE.containers = ENGINE.containers.filter(function(x) { return x.name !== p.name; });
      return { ok: true, text: p.name };
    }
  },
  containerLogs: {
    cmd: 'docker logs {{name}}',
    params: [{ key: 'name', label: 'container name', type: 'text', default: 'web' }],
    run: function(p) {
      var c = findContainer(p.name);
      if (!c) return { ok: false, text: 'Error: No such container: ' + p.name };
      var base = c.image.split(':')[0];
      var lines = {
        nginx: ['/docker-entrypoint.sh: Configuration complete; ready for start up', 'nginx/1.25.3', 'start worker processes'],
        redis: ['Redis version=7.2.4, bits=64', 'Running mode=standalone, port=6379', 'Ready to accept connections'],
        postgres: ['database system is ready to accept connections', 'listening on IPv4 address "0.0.0.0", port 5432'],
        node: ['Server listening on port 3000']
      };
      return { ok: true, text: (lines[base] || ['(no output)']).join('\\n') };
    }
  },
  removeImage: {
    cmd: 'docker rmi {{image}}',
    params: [{ key: 'image', label: 'image:tag', type: 'text', default: 'nginx:alpine' }],
    run: function(p) {
      if (!findImage(p.image)) return { ok: false, text: 'Error: No such image: ' + p.image };
      var inUse = ENGINE.containers.some(function(c) { return c.image === p.image; });
      if (inUse) {
        return { ok: false, text: 'Error response from daemon: conflict: unable to remove repository reference "' + p.image + '" (must force) - container is using its referenced image' };
      }
      ENGINE.images = ENGINE.images.filter(function(i) { return i.ref !== p.image; });
      return { ok: true, text: 'Untagged: ' + p.image + '\\nDeleted: sha256:' + shortId() };
    }
  },
  pruneContainers: {
    cmd: 'docker container prune',
    params: [],
    run: function() {
      var removed = ENGINE.containers.filter(function(c) { return c.status !== 'running'; });
      ENGINE.containers = ENGINE.containers.filter(function(c) { return c.status === 'running'; });
      if (!removed.length) return { ok: true, text: 'Total reclaimed space: 0B' };
      return { ok: true, text: 'Deleted Containers:\\n' + removed.map(function(c){ return c.id; }).join('\\n') + '\\n\\nTotal reclaimed space: ' + (removed.length * 3) + 'MB' };
    }
  }
};

function formatContainerTable(list) {
  if (!list.length) return 'CONTAINER ID   IMAGE   COMMAND   STATUS   PORTS   NAMES\\n(none)';
  var lines = ['CONTAINER ID   IMAGE              STATUS      PORTS              NAMES'];
  list.forEach(function(c) {
    var status = c.status === 'running' ? 'Up' : 'Exited';
    var ports = c.status === 'running' && c.port ? ('0.0.0.0:' + c.port + '->' + (c.containerPort || 80) + '/tcp') : '';
    lines.push(pad(c.id, 15) + pad(c.image, 19) + pad(status, 12) + pad(ports, 19) + c.name);
  });
  return lines.join('\\n');
}

function pad(s, n) {
  s = String(s);
  return s.length >= n ? s + ' ' : s + new Array(n - s.length + 1).join(' ');
}

var DOCS = {
  pullImage: { title: 'docker pull', desc: 'Downloads an image from a registry to the local machine, without creating or starting a container. If the image is already present locally, Docker reports it is already up to date instead of re-downloading.' },
  listImages: { title: 'docker images', desc: 'Lists every image currently stored locally, with its repository:tag, a generated image ID, and its size on disk.' },
  runContainer: { title: 'docker run', desc: '<code>-d</code> runs detached (in the background). <code>--name</code> gives it a name instead of a random one. <code>-p host:container</code> maps a host port to a port inside the container. If the image is not local yet, Docker pulls it automatically first — just like the real CLI.' },
  listContainers: { title: 'docker ps', desc: 'Lists only <em>running</em> containers, with their id, image, status and port mappings.' },
  listAllContainers: { title: 'docker ps -a', desc: 'Lists every container, running or not — useful for finding a stopped container you forgot about.' },
  stopContainer: { title: 'docker stop', desc: 'Gracefully stops a running container. A container that is already stopped is left alone — stopping it again is not an error.' },
  startContainer: { title: 'docker start', desc: 'Starts an existing, stopped container back up — unlike <code>docker run</code>, it does not create a new container.' },
  removeContainer: { title: 'docker rm', desc: 'Permanently removes a stopped container. Try running this on a still-running container — real Docker refuses, and so does this simulator, with the exact same error. Stop it first, or use <code>docker rm -f</code> in real Docker to force it.' },
  containerLogs: { title: 'docker logs', desc: "Shows everything a container has written to stdout/stderr since it started — the first thing to check when a container isn't behaving as expected." },
  removeImage: { title: 'docker rmi', desc: 'Removes a local image. Real Docker refuses to remove an image that a container (even a stopped one) still references — this simulator enforces the same rule. Remove the container first, or force it with <code>docker rmi -f</code> in real Docker.' },
  pruneContainers: { title: 'docker container prune', desc: 'Removes every stopped container in one command — a quick way to clean up after experimenting, without affecting anything still running.' }
};

// ================================================================
// STATE / INIT
// ================================================================
var currentKey = 'pullImage';

(function init() {
  document.querySelectorAll('.cb').forEach(function(btn) {
    btn.addEventListener('click', function() { selectCommand(this.dataset.key); });
  });
  document.getElementById('btnRun').addEventListener('click', runCurrent);
  document.getElementById('btnReset').addEventListener('click', function() {
    resetEngine();
    printOutput({ ok: true, text: 'Engine reset. All images and containers removed.' });
  });
  selectCommand('pullImage');
}());

function selectCommand(key) {
  currentKey = key;
  document.querySelectorAll('.cb').forEach(function(b) {
    b.classList.toggle('active', b.dataset.key === key);
  });
  var c = COMMANDS[key];
  renderParams(c);
  renderCmd(c);
  renderDocs(key);
}

function renderCmd(c) {
  var text = c.cmd;
  c.params.forEach(function(p) {
    var val = currentParamValue(p);
    text = text.split('{{' + p.key + '}}').join(String(val));
  });
  document.getElementById('cmdText').textContent = text;
}

function currentParamValue(p) {
  var input = document.getElementById('param-' + p.key);
  return input ? input.value : p.default;
}

function renderParams(c) {
  var row = document.getElementById('paramRow');
  row.innerHTML = '';
  c.params.forEach(function(p) {
    var label = document.createElement('label');
    label.textContent = p.label + ':';
    var input = document.createElement('input');
    input.type = p.type === 'number' ? 'number' : 'text';
    input.id = 'param-' + p.key;
    input.value = p.default;
    input.addEventListener('input', function() { renderCmd(c); });
    row.appendChild(label);
    row.appendChild(input);
  });
}

function runCurrent() {
  var c = COMMANDS[currentKey];
  var params = {};
  c.params.forEach(function(p) { params[p.key] = currentParamValue(p); });
  var result = c.run(params);
  printOutput(result);
}

function printOutput(result) {
  var out = document.getElementById('termOut');
  var cls = result.ok ? 'ok' : 'err';
  out.innerHTML = '<span class="' + cls + '">' + escapeHtml(result.text) + '</span>';
}

function escapeHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function renderDocs(key) {
  var d = DOCS[key];
  var el = document.getElementById('docsBox');
  if (!d) { el.innerHTML = ''; return; }
  el.innerHTML = '<h4>' + d.title + '</h4><p>' + d.desc + '</p>';
}`;

export const dockerCommandSimulatorProject: Project = {
  id: 'docker-command-simulator',
  slug: 'docker-command-simulator',
  title: 'Docker Command Simulator',
  difficulty: 'intermediate',
  type: 'frontend',
  estimatedTime: '6-9 hours',
  playgroundKey: 'docker-command-simulator',
  description: 'Build an interactive Docker CLI simulator in the browser — pulling images, running and managing containers, and real error handling for cases like removing a running container, all backed by genuine in-memory engine state.',
  overview: 'This project gives you a hands-on sandbox for practicing real Docker commands and understanding container lifecycle without installing Docker. Each command shows its real CLI syntax and runs genuine logic against a small in-memory "engine" that tracks images and containers — including the same real-world edge cases Docker itself enforces, like refusing to remove a running container or an image still in use.',
  objective: 'Build an interactive Docker command console covering images, containers, their lifecycle, logs, and cleanup — each command backed by correct, stateful logic over a shared in-memory engine that behaves like the real Docker daemon.',
  technologies: ['HTML', 'CSS', 'JavaScript', 'Docker'],
  prerequisites: ['JavaScript fundamentals (array methods, objects)', 'Basic Docker concepts (images vs containers)', 'DOM manipulation'],
  learnings: [
    'Modeling a container\'s lifecycle (created, running, exited, removed) as simple state transitions',
    'Why Docker refuses to remove a running container, and why that safety check matters',
    'Why Docker refuses to remove an image still referenced by a container',
    'How docker run auto-pulls an image it does not have locally, exactly like the real CLI',
    'The difference between docker ps and docker ps -a',
    'Formatting tabular terminal output with fixed-width column padding',
    'Building a small, realistic in-memory simulation of stateful infrastructure',
  ],
  features: [
    '11 real Docker commands across five categories: images, containers, lifecycle, inspection, and cleanup',
    'Live-editable command parameters (image name, container name, port) that build the real command text',
    'A genuine in-memory Docker engine: pulled images and running containers persist across commands',
    'Real Docker safety checks: cannot remove a running container, cannot remove an image still in use',
    'docker run automatically pulls an image that is not local yet, matching real Docker behavior',
    'Realistic docker ps table formatting with status and port columns',
    'Container-specific simulated logs based on the image (nginx, redis, postgres, node)',
    'A Reset engine button to clear all images and containers and start fresh',
    'Per-command explanation panel',
    'Dark terminal-inspired UI with color-coded success/error output',
  ],
  fileStructure: 'docker-command-simulator/ |   index.html |   style.css |   script.js',
  files: [
    { path: 'docker-command-simulator/index.html', language: 'html',       content: indexHtml },
    { path: 'docker-command-simulator/style.css',  language: 'css',        content: styleCss  },
    { path: 'docker-command-simulator/script.js',  language: 'javascript', content: scriptJs  },
  ],
  lessons: [
    {
      id: 'engine-state',
      title: 'Modeling the Docker Engine as In-Memory State',
      explanation: 'The whole simulator is built around two arrays — images and containers — plus functions that look things up and mutate them. This mirrors how the real Docker daemon tracks state internally, just without the actual containerization underneath.',
      js: `var ENGINE = { images: [], containers: [], nextId: 1 };

function findImage(ref) {
  return ENGINE.images.find(function(i) { return i.ref === ref; });
}

function findContainer(name) {
  return ENGINE.containers.find(function(c) { return c.name === name; });
}

// A container is just an object with a status that changes over time:
// { id, name, image, port, status: 'running' | 'exited' }`,
    },
    {
      id: 'auto-pull',
      title: 'Simulating docker run\'s Automatic Image Pull',
      explanation: 'Real Docker automatically pulls an image the first time you run a container from it, if it is not already local. Simulating this just means checking whether the image exists first, and "pulling" it (adding it to the images array) as a side effect if it does not.',
      js: `function runContainer(name, image, port) {
  var pullMessage = '';

  if (!findImage(image)) {
    // Image not local yet -- pull it first, just like real Docker
    ENGINE.images.push({ ref: image, size: '71MB', ports: [] });
    pullMessage = 'Unable to find image "' + image + '" locally\\n' +
                  image + ': Pulling from library\\n' +
                  'Status: Downloaded newer image for ' + image + '\\n';
  }

  var container = { id: generateId(), name: name, image: image, port: port, status: 'running' };
  ENGINE.containers.push(container);
  return pullMessage + container.id;
}`,
    },
    {
      id: 'safety-checks',
      title: 'Enforcing Real Docker Safety Checks',
      explanation: 'Two of the most educational parts of this project are the errors: real Docker refuses to remove a running container, and refuses to remove an image a container still references. Reproducing these checks teaches the actual reasoning Docker uses, not just its happy-path commands.',
      js: `function removeContainer(name) {
  var c = findContainer(name);
  if (!c) return { ok: false, text: 'Error: No such container: ' + name };

  if (c.status === 'running') {
    // Real Docker's exact reasoning: stop it first
    return {
      ok: false,
      text: 'cannot remove container "' + name + '": container is running: ' +
            'stop the container before removing or force remove'
    };
  }

  ENGINE.containers = ENGINE.containers.filter(function(x) { return x.name !== name; });
  return { ok: true, text: name };
}

function removeImage(ref) {
  var inUse = ENGINE.containers.some(function(c) { return c.image === ref; });
  if (inUse) {
    return { ok: false, text: 'conflict: unable to remove repository reference "' + ref + '" (must force) - container is using its referenced image' };
  }
  // ...safe to remove
}`,
    },
    {
      id: 'table-formatting',
      title: 'Formatting Fixed-Width Terminal Tables',
      explanation: 'Real CLI tools like docker ps align columns by padding each cell with spaces to a fixed width, rather than using HTML tables — since the output is meant to be read in a monospace terminal. A small pad() helper handles this consistently for every command\'s table output.',
      js: `function pad(s, width) {
  s = String(s);
  return s.length >= width ? s + ' ' : s + new Array(width - s.length + 1).join(' ');
}

function formatContainerTable(list) {
  var lines = ['CONTAINER ID   IMAGE              STATUS      NAMES'];
  list.forEach(function(c) {
    lines.push(
      pad(c.id, 15) + pad(c.image, 19) + pad(c.status, 12) + c.name
    );
  });
  return lines.join('\\n');
}`,
    },
  ],
  challenges: [
    {
      id: 'add-inspect',
      title: 'Add a docker inspect command',
      difficulty: 'easy',
      description: 'Add a new command, inspectContainer, that shows a container\'s full details (id, image, status, port) as formatted JSON, matching the real docker inspect --format style of output.',
      hint: 'Add a params entry for the container name, look it up with findContainer(), and return JSON.stringify(container, null, 2) as the output text (with an error if the container does not exist).',
      solutionJs: `inspectContainer: {
  cmd: 'docker inspect {{name}}',
  params: [{ key: 'name', label: 'container name', type: 'text', default: 'web' }],
  run: function(p) {
    var c = findContainer(p.name);
    if (!c) return { ok: false, text: 'Error: No such container: ' + p.name };
    return { ok: true, text: JSON.stringify(c, null, 2) };
  }
}

// Also add DOCS.inspectContainer and a sidebar button.`,
    },
    {
      id: 'add-force-remove',
      title: 'Add docker rm -f (force remove)',
      difficulty: 'medium',
      description: 'Extend removeContainer with a "force" checkbox/parameter. When force is true, it should stop AND remove a running container in one step instead of returning the "container is running" error.',
      hint: 'Add a params entry of a boolean-like type (or reuse text with values "true"/"false"). In run(), check the force flag before the running-container error check — if true and the container is running, set its status to exited first, then proceed with removal as normal.',
      solutionJs: `removeContainer: {
  cmd: 'docker rm {{force}}{{name}}',
  params: [
    { key: 'name', label: 'container name', type: 'text', default: 'web' },
    { key: 'force', label: 'force (-f or empty)', type: 'text', default: '' }
  ],
  run: function(p) {
    var c = findContainer(p.name);
    if (!c) return { ok: false, text: 'Error: No such container: ' + p.name };

    if (c.status === 'running') {
      if (p.force === '-f ' || p.force === '-f') {
        c.status = 'exited'; // force stops it first
      } else {
        return { ok: false, text: 'cannot remove container "' + p.name + '": container is running' };
      }
    }

    ENGINE.containers = ENGINE.containers.filter(function(x) { return x.name !== p.name; });
    return { ok: true, text: p.name };
  }
}`,
    },
    {
      id: 'add-network',
      title: 'Simulate a Docker network and container-to-container ping',
      difficulty: 'hard',
      description: 'Add docker network create <name>, a way to attach a running container to a network, and a docker exec <container> ping <other-container> command that only succeeds if both containers are on the same network.',
      hint: 'Add ENGINE.networks = [] and give each container a networks: [] array. "Attaching" pushes the network name into that array. For ping, look up both containers and check whether their networks arrays share at least one common value.',
      solutionJs: `// Add to ENGINE: networks: []
// Add to each container object: networks: ['bridge']

createNetwork: {
  cmd: 'docker network create {{name}}',
  params: [{ key: 'name', label: 'network name', type: 'text', default: 'my-net' }],
  run: function(p) {
    if (ENGINE.networks.indexOf(p.name) !== -1) {
      return { ok: false, text: 'Error: network with name ' + p.name + ' already exists' };
    }
    ENGINE.networks.push(p.name);
    return { ok: true, text: p.name };
  }
},

pingContainer: {
  cmd: 'docker exec {{from}} ping -c 1 {{to}}',
  params: [
    { key: 'from', label: 'from container', type: 'text', default: 'app' },
    { key: 'to', label: 'to container', type: 'text', default: 'db' }
  ],
  run: function(p) {
    var a = findContainer(p.from), b = findContainer(p.to);
    if (!a || !b) return { ok: false, text: 'Error: container not found' };
    var shared = a.networks.some(function(n) { return b.networks.indexOf(n) !== -1; });
    if (!shared) return { ok: false, text: 'ping: bad address \\'' + p.to + '\\'' };
    return { ok: true, text: '1 packet transmitted, 1 received, 0% packet loss' };
  }
}`,
    },
  ],
};
