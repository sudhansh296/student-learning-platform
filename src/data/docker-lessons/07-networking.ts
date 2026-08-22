import type { DockerLesson } from '../docker-curriculum';

export const lesson07: DockerLesson = {
  id: 'docker-07',
  title: 'Docker Networking',
  slug: '07-networking',
  chapter: 'advanced',
  order: 7,
  difficulty: 'intermediate',
  readingTime: 12,
  description: 'Connect containers using Docker networks, understand network drivers, and expose ports to the host machine.',
  sections: [
    {
      type: 'text',
      content: 'Docker networking allows containers to communicate with each other and with the outside world. Every container gets its own network namespace with a private IP address. Understanding Docker networks is essential for building multi-container applications where services need to talk to each other.'
    },
    {
      type: 'heading',
      content: 'Docker Network Types'
    },
    {
      type: 'table',
      title: 'Docker network driver comparison',
      headers: ['Driver', 'Description', 'Use Case'],
      rows: [
        ['bridge', 'Default. Creates a private internal network on the host', 'Single-host container communication'],
        ['host', 'Container shares host network stack directly', 'Performance-critical, single container'],
        ['none', 'No networking — completely isolated', 'Maximum security, no network needed'],
        ['overlay', 'Spans multiple Docker hosts (Swarm)', 'Multi-host microservices, Swarm mode'],
        ['macvlan', 'Container gets its own MAC and IP on LAN', 'Legacy apps needing direct LAN access']
      ]
    },
    {
      type: 'heading',
      content: 'The Default Bridge Network'
    },
    {
      type: 'text',
      content: 'When you run a container without specifying a network, it joins the default bridge network (docker0). Containers on the default bridge can communicate via IP addresses, but not by container name — hostname-based DNS resolution only works on custom bridge networks.'
    },
    {
      type: 'note',
      title: 'Always Use Custom Bridge Networks',
      content: 'Always create a custom bridge network for multi-container applications. Custom bridge networks provide automatic DNS resolution (containers can reach each other by name), better isolation from other containers, and per-network connectivity rules.'
    },
    {
      type: 'heading',
      content: 'Custom Bridge Networks'
    },
    {
      type: 'example',
      title: 'Creating and using a custom bridge network',
      content: 'This example creates a custom bridge network, then runs two containers attached to it. Containers on the same custom bridge network can communicate using their container names as hostnames — no need to know IP addresses.',
      code: `# Create a custom bridge network
docker network create myapp-network

# Run a database container on the network
docker run -d \
  --name postgres \
  --network myapp-network \
  -e POSTGRES_PASSWORD=secret \
  postgres:16-alpine

# Run an app container on the same network
# App can reach postgres using the hostname "postgres"
docker run -d \
  --name api \
  --network myapp-network \
  -p 3000:3000 \
  -e DATABASE_URL=postgres://postgres:secret@postgres:5432/mydb \
  myapp:latest`,
      language: 'bash',
      output: `# Inside the api container, ping postgres by name:
ping postgres
# PING postgres (172.18.0.2): 56 data bytes`
    },
    {
      type: 'heading',
      content: 'Docker Network Commands'
    },
    {
      type: 'example',
      title: 'Managing networks with docker network commands',
      content: 'The docker network commands let you create, list, inspect, connect, disconnect, and remove networks. docker network inspect is especially useful for seeing which containers are connected and what their IP addresses are.',
      code: `# List all networks
docker network ls

# Inspect a network (see connected containers and IPs)
docker network inspect myapp-network

# Connect a running container to a network
docker network connect myapp-network my-container

# Disconnect a container from a network
docker network disconnect myapp-network my-container

# Remove a network (all containers must be disconnected first)
docker network rm myapp-network

# Remove all unused networks
docker network prune`,
      language: 'bash',
      output: `NETWORK ID     NAME              DRIVER    SCOPE
a1b2c3d4e5f6   bridge            bridge    local
b2c3d4e5f6a7   host              host      local
c3d4e5f6a7b8   none              null      local
d4e5f6a7b8c9   myapp-network     bridge    local`
    },
    {
      type: 'heading',
      content: 'Port Mapping'
    },
    {
      type: 'text',
      content: 'By default, container ports are not accessible from the host machine. Port mapping (-p) creates a rule that forwards traffic from a host port to a container port. The format is hostPort:containerPort.'
    },
    {
      type: 'example',
      title: 'Port mapping patterns',
      content: 'Port mapping controls how the outside world reaches your containers. You can map any host port to any container port, bind to a specific host IP for security, or map multiple ports for services that need them.',
      code: `# Map host port 8080 to container port 80
docker run -p 8080:80 nginx:alpine

# Bind to localhost only (not accessible from other machines on your LAN)
docker run -p 127.0.0.1:8080:80 nginx:alpine

# Map multiple ports (HTTP and HTTPS)
docker run -p 80:80 -p 443:443 nginx:alpine

# Random host port (Docker picks an available port)
docker run -p 80 nginx:alpine

# Check what port was assigned
docker port my-container`,
      language: 'bash',
      output: `# docker port my-container
80/tcp -> 0.0.0.0:32768`
    },
    {
      type: 'heading',
      content: 'Container-to-Container Communication'
    },
    {
      type: 'example',
      title: 'Containers on the same network communicating by name',
      content: 'When containers share a custom bridge network, Docker\'s embedded DNS server resolves container names to their internal IP addresses automatically. This is how docker-compose works under the hood — it creates a network and all services use names to find each other.',
      code: `# Create application network
docker network create app-net

# Start Redis
docker run -d --name redis --network app-net redis:7-alpine

# Start a Node.js app that connects to Redis by hostname "redis"
docker run -d \
  --name app \
  --network app-net \
  -e REDIS_URL=redis://redis:6379 \
  myapp:latest

# From inside the app container, "redis" resolves to Redis's IP
docker exec app ping redis`,
      language: 'bash',
      output: `PING redis (172.18.0.3): 56 data bytes
64 bytes from 172.18.0.3: seq=0 ttl=64 time=0.124 ms`
    },
    {
      type: 'heading',
      content: 'Network Isolation'
    },
    {
      type: 'text',
      content: 'Containers on different networks cannot communicate with each other — providing isolation between application stacks. A container can be attached to multiple networks simultaneously, acting as a bridge between isolated groups of containers.'
    },
    {
      type: 'example',
      title: 'Connecting a container to multiple networks',
      content: 'A container like an API gateway might need to be on both a public-facing network and a private backend network. Connecting it to two networks gives it access to both sides while keeping the backend containers isolated from the public network.',
      code: `# Create two isolated networks
docker network create frontend-net
docker network create backend-net

# API container bridges both networks
docker run -d \
  --name api \
  --network frontend-net \
  myapi:latest

docker network connect backend-net api

# Database only on backend (not reachable from frontend)
docker run -d \
  --name db \
  --network backend-net \
  postgres:16-alpine`,
      language: 'bash'
    },
    {
      type: 'tip',
      title: 'Use docker-compose for Network Configuration',
      content: 'Manually managing networks with docker network commands gets complex for multi-container apps. Docker Compose handles all of this automatically — it creates a default network for your project and all services can reach each other by service name. See the Docker Compose lesson.'
    },
    {
      type: 'tryit',
      title: 'Network Topology Visualizer',
      js: `document.body.innerHTML = '<div><h3>Network Topology Visualizer</h3><div class="controls"><label>Add container to network:</label><select id="net-select"><option value="app-network">app-network</option><option value="cache-network">cache-network</option></select><select id="cont-select"><option value="api">api</option><option value="postgres">postgres</option><option value="redis">redis</option><option value="nginx">nginx</option></select><button id="add-btn">Connect</button></div><svg id="topology" width="420" height="280"></svg><div id="net-legend"></div></div>';

var networks = {
  'app-network': { color: '#2496ED', containers: ['api', 'postgres'] },
  'cache-network': { color: '#28a745', containers: ['api', 'redis'] }
};

var allContainers = ['api', 'postgres', 'redis', 'nginx'];

function renderTopology() {
  var svg = document.getElementById('topology');
  var containerPositions = {
    api:      { x: 210, y: 140 },
    postgres: { x: 80,  y: 60  },
    redis:    { x: 80,  y: 220 },
    nginx:    { x: 340, y: 140 }
  };

  var lines = '';
  var containerColors = { api: '#2496ED', postgres: '#336791', redis: '#dc3545', nginx: '#28a745' };
  var networkNames = Object.keys(networks);

  networkNames.forEach(function(net, ni) {
    var netConts = networks[net].containers;
    var col = networks[net].color;
    for (var i = 0; i < netConts.length - 1; i++) {
      for (var j = i+1; j < netConts.length; j++) {
        var a = containerPositions[netConts[i]];
        var b = containerPositions[netConts[j]];
        if (a && b) {
          lines += '<line x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '" stroke="' + col + '" stroke-width="2" stroke-dasharray="5,3" opacity="0.7"/>';
        }
      }
    }
  });

  var nodes = allContainers.map(function(c) {
    var p = containerPositions[c];
    var col = containerColors[c];
    return '<circle cx="' + p.x + '" cy="' + p.y + '" r="28" fill="' + col + '" opacity="0.9"/>' +
      '<text x="' + p.x + '" y="' + (p.y+5) + '" text-anchor="middle" fill="white" font-size="11" font-weight="bold">' + c + '</text>';
  }).join('');

  svg.innerHTML = lines + nodes;

  var legend = document.getElementById('net-legend');
  legend.innerHTML = networkNames.map(function(n) {
    return '<div style="display:flex;align-items:center;gap:6px;font-size:12px;margin-bottom:4px">' +
      '<div style="width:20px;height:3px;background:' + networks[n].color + '"></div>' +
      '<span style="font-weight:600">' + n + '</span>' +
      '<span style="color:#6c757d">(' + networks[n].containers.join(', ') + ')</span></div>';
  }).join('');
}

document.getElementById('add-btn').addEventListener('click', function() {
  var netSel = document.getElementById('net-select').value;
  var contSel = document.getElementById('cont-select').value;
  if (!networks[netSel].containers.includes(contSel)) {
    networks[netSel].containers.push(contSel);
    renderTopology();
  }
});

renderTopology();`,
      css: `body { padding: 16px; font-family: system-ui, sans-serif; background: #f0f4f8; }
h3 { color: #2496ED; margin: 0 0 12px 0; font-size: 15px; font-weight: 700; }
svg { border: 1px solid #dee2e6; border-radius: 8px; background: white; display: block; margin-bottom: 12px; }
.controls { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; align-items: center; font-size: 13px; }
select { background: white; border: 1px solid #dee2e6; padding: 6px 10px; border-radius: 6px; font-size: 12px; }
#add-btn { background: #2496ED; color: white; border: none; padding: 7px 14px; border-radius: 6px; font-weight: 600; font-size: 12px; cursor: pointer; }
#add-btn:hover { background: #1a7abf; }
#net-legend { background: white; border-radius: 8px; padding: 10px; border: 1px solid #dee2e6; }`
    },
    {
      type: 'warning',
      title: 'Avoid the Default Bridge Network for Production',
      content: 'The default bridge network does not support DNS-based container name resolution. Always create a custom named network for your applications. This is not just a best practice — docker-compose does it automatically for every project.'
    }
  ],
  exercises: [
    {
      id: 'ex-docker-7-1',
      question: 'Why do containers on a custom bridge network communicate by name, but containers on the default bridge cannot?',
      type: 'multiple-choice',
      options: [
        'Custom bridge networks have higher bandwidth than the default',
        'Custom bridge networks include Docker\'s embedded DNS server for automatic hostname resolution',
        'The default bridge network does not support TCP/IP',
        'Container names are only registered when you use docker network create'
      ],
      correct: 1,
      explanation: 'Docker\'s embedded DNS server only operates on user-defined (custom) bridge networks. It automatically maps container names to their IP addresses. The legacy default bridge network uses only IP-based communication with no automatic hostname resolution.'
    },
    {
      id: 'ex-docker-7-2',
      question: 'What does -p 127.0.0.1:8080:80 do differently from -p 8080:80?',
      type: 'multiple-choice',
      options: [
        'It maps port 8080 on the container to port 80 on the host (reversed)',
        'It binds port 8080 only to the loopback interface, not accessible from other machines on the network',
        'It enables IPv6 on port 8080',
        'It sets up TLS/SSL on port 8080'
      ],
      correct: 1,
      explanation: 'By default, -p 8080:80 binds to 0.0.0.0 (all host interfaces), making the container accessible from any machine that can reach your host. Adding 127.0.0.1: before the host port restricts access to the local machine only.'
    },
    {
      id: 'ex-docker-7-3',
      question: 'Which docker network driver is used for communication across multiple Docker hosts in a Swarm cluster?',
      type: 'multiple-choice',
      options: [
        'bridge',
        'host',
        'macvlan',
        'overlay'
      ],
      correct: 3,
      explanation: 'The overlay driver creates a distributed network that spans multiple Docker hosts. It is used in Docker Swarm mode (and Kubernetes) to allow containers on different physical machines to communicate as if they were on the same local network.'
    }
  ],
  quiz: [
    {
      id: 'q-docker-7-1',
      question: 'What is the default network driver used when you create a new container without specifying a network?',
      options: [
        'host',
        'overlay',
        'none',
        'bridge'
      ],
      correct: 3,
      explanation: 'Bridge is the default network driver. When you run a container without --network, it joins the default bridge network (docker0). For custom applications, create your own named bridge network to enable DNS resolution between containers.'
    },
    {
      id: 'q-docker-7-2',
      question: 'What does docker network inspect NETWORK_NAME show you?',
      options: [
        'The bandwidth speed of the network interface',
        'All DNS entries registered for the network',
        'Detailed information including subnet, gateway, and the list of connected containers with their IP addresses',
        'The firewall rules configured for the network'
      ],
      correct: 2,
      explanation: 'docker network inspect shows the full network configuration: driver, subnet, gateway IP, and a Containers section listing every container connected to the network with its name, endpoint ID, and IP address.'
    },
    {
      id: 'q-docker-7-3',
      question: 'Can a single container be connected to multiple Docker networks simultaneously?',
      options: [
        'No, each container can only be on one network at a time',
        'Yes, using docker network connect to add additional networks after the container starts',
        'Only if the container is running in privileged mode',
        'Only with the overlay driver'
      ],
      correct: 1,
      explanation: 'A container can be connected to multiple networks. The initial network is set with --network at docker run time. Additional networks can be added with docker network connect while the container is running. This is how API gateways are isolated from databases while still being reachable from the frontend.'
    }
  ]
};
