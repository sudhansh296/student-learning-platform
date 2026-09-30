/* WebDev Atlas — Docker / Docker Compose simulator. Realistic CLI output for images, containers, networks, volumes,
 * builds (Dockerfile parsing) and compose projects, all in memory. Requires sim-term.js and sim-yaml.js. */
(function (G) {
  'use strict';
  var sim = G.__sim, path = sim.path;

  var ADJ = ['admiring', 'adoring', 'brave', 'clever', 'cool', 'dazzling', 'eager', 'elegant', 'focused', 'friendly', 'gallant', 'happy', 'jolly', 'keen', 'kind', 'laughing', 'lucid', 'modest', 'nifty', 'peaceful', 'quirky', 'relaxed', 'serene', 'sharp', 'stoic', 'vibrant', 'vigilant', 'wizardly', 'zealous', 'zen'];
  var SCI = ['albattani', 'archimedes', 'babbage', 'bell', 'curie', 'darwin', 'dijkstra', 'einstein', 'euler', 'faraday', 'feynman', 'galileo', 'gauss', 'hopper', 'kepler', 'knuth', 'lamport', 'lovelace', 'newton', 'pascal', 'ritchie', 'shannon', 'tesla', 'thompson', 'torvalds', 'turing', 'wozniak', 'wright'];
  function hex(n) { var s = ''; for (var i = 0; i < n; i++) s += Math.floor(Math.random() * 16).toString(16); return s; }
  function rndName(used) { var n; do { n = ADJ[Math.floor(Math.random() * ADJ.length)] + '_' + SCI[Math.floor(Math.random() * SCI.length)]; } while (used[n]); return n; }
  function ago(ms) { var s = Math.floor((Date.now() - ms) / 1000); if (s < 1) return 'Less than a second ago'; if (s < 60) return s + ' seconds ago'; var m = Math.floor(s / 60); if (m < 2) return 'About a minute ago'; if (m < 60) return m + ' minutes ago'; var h = Math.floor(m / 60); if (h < 2) return 'About an hour ago'; if (h < 24) return h + ' hours ago'; var d = Math.floor(h / 24); return d + ' day' + (d > 1 ? 's' : '') + ' ago'; }
  function upFor(ms) { var s = Math.floor((Date.now() - ms) / 1000); if (s < 1) return 'Less than a second'; if (s < 60) return s + ' seconds'; var m = Math.floor(s / 60); if (m < 2) return 'About a minute'; if (m < 60) return m + ' minutes'; var h = Math.floor(m / 60); return h < 2 ? 'About an hour' : h + ' hours'; }
  function fmtSize(b) { if (b < 1000) return b + 'B'; if (b < 1e6) return (b / 1e3).toFixed(b < 1e4 ? 2 : 1).replace(/\.?0+$/, '') + 'kB'; if (b < 1e9) return (b / 1e6).toFixed(b < 1e7 ? 2 : 1).replace(/\.0+$/, '') + 'MB'; return (b / 1e9).toFixed(2) + 'GB'; }
  function table(head, rows) { var all = [head].concat(rows), w = head.map(function (_, i) { return Math.max.apply(null, all.map(function (r) { return String(r[i] === undefined ? '' : r[i]).length; })) + 3; }); return all.map(function (r) { return r.map(function (c, i) { return i === r.length - 1 ? String(c) : String(c).padEnd(w[i]); }).join('').replace(/\s+$/, ''); }).join('\n') + '\n'; }
  function tpl(t, obj) { return t.replace(/\{\{\s*\.(\w+)\s*\}\}/g, function (m, k) { return obj[k] === undefined ? '' : obj[k]; }).replace(/\\t/g, '\t'); }
  function goPath(o, p) { return p.split('.').filter(Boolean).reduce(function (a, k) { return a == null ? a : a[k]; }, o); }

  /* ───────────── image catalog ───────────── */
  var CATALOG = {
    nginx: { size: 192e6, alpine: 47.9e6, layers: 7, ports: [80], cmd: '/docker-entrypoint.sh', args: ['nginx', '-g', 'daemon off;'], kind: 'service', ver: '1.25.3' },
    httpd: { size: 148e6, alpine: 60e6, layers: 5, ports: [80], cmd: 'httpd-foreground', args: [], kind: 'service', ver: '2.4.58' },
    redis: { size: 138e6, alpine: 41.4e6, layers: 6, ports: [6379], cmd: 'docker-entrypoint.sh', args: ['redis-server'], kind: 'service', ver: '7.2.4' },
    postgres: { size: 431e6, alpine: 244e6, layers: 13, ports: [5432], cmd: 'docker-entrypoint.sh', args: ['postgres'], kind: 'service', ver: '16.2', env: ['POSTGRES_PASSWORD'] },
    mysql: { size: 631e6, layers: 10, ports: [3306, 33060], cmd: 'docker-entrypoint.sh', args: ['mysqld'], kind: 'service', ver: '8.3.0' },
    mongo: { size: 756e6, layers: 10, ports: [27017], cmd: 'docker-entrypoint.sh', args: ['mongod'], kind: 'service', ver: '7.0.5' },
    memcached: { size: 90e6, alpine: 11e6, layers: 6, ports: [11211], cmd: 'docker-entrypoint.sh', args: ['memcached'], kind: 'service', ver: '1.6.23' },
    rabbitmq: { size: 250e6, layers: 12, ports: [5672], cmd: 'docker-entrypoint.sh', args: ['rabbitmq-server'], kind: 'service', ver: '3.12.12' },
    node: { size: 1.1e9, alpine: 135e6, slim: 240e6, layers: 8, ports: [], cmd: 'docker-entrypoint.sh', args: ['node'], kind: 'lang', ver: '20.11.1' },
    python: { size: 1.02e9, alpine: 55e6, slim: 130e6, layers: 6, ports: [], cmd: 'python3', args: [], kind: 'lang', ver: '3.12.2' },
    golang: { size: 814e6, alpine: 250e6, layers: 7, ports: [], cmd: 'go', args: [], kind: 'lang', ver: '1.22.0' },
    openjdk: { size: 470e6, layers: 4, ports: [], cmd: 'jshell', args: [], kind: 'lang', ver: '21' },
    ubuntu: { size: 78.1e6, layers: 1, ports: [], cmd: 'bash', args: [], kind: 'os', ver: '22.04' },
    debian: { size: 117e6, layers: 1, ports: [], cmd: 'bash', args: [], kind: 'os', ver: '12' },
    alpine: { size: 7.8e6, layers: 1, ports: [], cmd: '/bin/sh', args: [], kind: 'os', ver: '3.19' },
    busybox: { size: 4.26e6, layers: 1, ports: [], cmd: 'sh', args: [], kind: 'os', ver: '1.36' },
    'hello-world': { size: 13.3e3, layers: 1, ports: [], cmd: '/hello', args: [], kind: 'hello', ver: '1.0' },
    scratch: { size: 0, layers: 0, ports: [], cmd: '', args: [], kind: 'os', ver: '' }
  };
  function nodeVer(tag) { var m = String(tag).match(/^(\d+)/); var v = m ? +m[1] : 20; return { 22: 'v22.0.0', 21: 'v21.7.1', 20: 'v20.11.1', 18: 'v18.19.1', 16: 'v16.20.2' }[v] || 'v' + v + '.0.0'; }

  function create(shell) {
    var st = { images: {}, containers: {}, networks: {}, volumes: {}, order: 0, loggedIn: 'student', ports: {}, nextPort: 32768, ips: 1, subnet: 17, projects: {} };
    function nid() { return hex(64); }
    st.networks.bridge = { id: nid(), name: 'bridge', driver: 'bridge', scope: 'local', containers: {}, subnet: '172.17.0.0/16', gateway: '172.17.0.1', created: Date.now() - 864e5 };
    st.networks.host = { id: nid(), name: 'host', driver: 'host', scope: 'local', containers: {}, created: Date.now() - 864e5 };
    st.networks.none = { id: nid(), name: 'none', driver: 'null', scope: 'local', containers: {}, created: Date.now() - 864e5 };

    /* ── refs & images ── */
    function parseRef(ref) { var r = String(ref), tag = 'latest', digest = null, m = r.match(/^(.*?)(?::([\w][\w.-]{0,127}))?$/); if (r.indexOf('@') >= 0) { digest = r.split('@')[1]; r = r.split('@')[0]; m = r.match(/^(.*?)(?::([\w][\w.-]{0,127}))?$/); } var name = m[1]; if (m[2] && m[2].indexOf('/') < 0) tag = m[2]; else if (m[2]) name = r; return { name: name, tag: tag, digest: digest }; }
    function fullRepo(name) { var parts = name.split('/'); if (parts.length === 1) return 'docker.io/library/' + name; if (parts.length === 2 && parts[0].indexOf('.') < 0 && parts[0].indexOf(':') < 0 && parts[0] !== 'localhost') return 'docker.io/' + name; return name; }
    function findImage(ref) { var p = parseRef(ref), key = p.name + ':' + p.tag; if (st.images[key]) return st.images[key]; var byId = Object.keys(st.images).map(function (k) { return st.images[k]; }).filter(function (im) { return im.id.replace('sha256:', '').indexOf(String(ref).replace('sha256:', '')) === 0 && String(ref).length >= 4; }); return byId[0] || null; }
    function baseInfo(name) { var lib = name.replace(/^library\//, ''); return CATALOG[lib] || null; }
    function imgSize(name, tag) { var b = baseInfo(name); if (!b) return 120e6; if (/alpine/.test(tag) && b.alpine) return b.alpine; if (/slim/.test(tag) && b.slim) return b.slim; return b.size; }
    function addImage(name, tag, extra) {
      var key = name + ':' + tag, im = st.images[key];
      var b = baseInfo(name); if (!im) { im = st.images[key] = { name: name, tag: tag, id: 'sha256:' + hex(64), digest: 'sha256:' + hex(64), created: Date.now(), size: imgSize(name, tag), layers: [], cmd: null, entrypoint: null, ports: b ? b.ports.slice() : [], env: [], workdir: '/', user: '', volumes: [], base: null }; }
      if (extra) Object.assign(im, extra); return im;
    }
    function pullLayers(name, tag, c) {
      var b = baseInfo(name), n = b ? Math.max(1, Math.min(b.layers, /alpine|slim/.test(tag) ? Math.ceil(b.layers * 0.6) : b.layers)) : 5, lib = fullRepo(name).replace('docker.io/', '');
      c.out(tag + ': Pulling from ' + lib + '\n'); for (var i = 0; i < n; i++) c.out(hex(12) + ': Pull complete\n');
      var im = addImage(name, tag, { created: Date.now() - 12 * 864e5 }); c.out('Digest: ' + im.digest + '\nStatus: Downloaded newer image for ' + name + ':' + tag + '\n' + fullRepo(name) + ':' + tag + '\n'); return im;
    }
    function canPull(name) { return !!baseInfo(name) || name.split('/').length > 1; }
    function ensureImage(ref, c, verb) {
      var p = parseRef(ref), im = findImage(ref); if (im) return im;
      if (!canPull(p.name) && st.script && /^(my|app|api|web|server|service|backend|frontend|worker|demo|sample|test)|(app|api|service|server)$/i.test(p.name)) {
        im = addImage(p.name, p.tag, { local: true, size: 178e6, ports: [3000], cmd: ['node', 'src/index.js'], base: 'node' });
        if (c) c.out('ℹ️ Image "' + p.name + ':' + p.tag + '" was not built in this session — using a sample image so the example can run.\n');
        return im;
      }
      if (!canPull(p.name)) { if (c) c.err((verb === 'run' ? "Unable to find image '" + p.name + ':' + p.tag + "' locally\n" : '') + (verb === 'run' ? 'docker: ' : '') + "Error response from daemon: pull access denied for " + p.name + ", repository does not exist or may require 'docker login': denied: requested access to the resource is denied\n" + (verb === 'run' ? "See 'docker run --help'.\n" : '')); return null; }
      if (c) { if (verb === 'run') c.out("Unable to find image '" + p.name + ':' + p.tag + "' locally\n"); return pullLayers(p.name, p.tag, c); }
      return addImage(p.name, p.tag);
    }

    /* ── containers ── */
    function findContainer(ref) { if (!ref) return null; ref = String(ref).replace(/^\//, ''); var all = Object.keys(st.containers).map(function (k) { return st.containers[k]; }); return all.filter(function (c) { return c.name === ref; })[0] || all.filter(function (c) { return c.id.indexOf(ref) === 0; })[0] || null; }
    function usedNames() { var u = {}; Object.keys(st.containers).forEach(function (k) { u[st.containers[k].name] = 1; }); return u; }
    function statusStr(c) { if (c.status === 'running') return 'Up ' + upFor(c.started) + (c.health ? ' (' + c.health + ')' : ''); if (c.status === 'paused') return 'Up ' + upFor(c.started) + ' (Paused)'; if (c.status === 'created') return 'Created'; return 'Exited (' + c.exitCode + ') ' + ago(c.finished || c.started).replace(/ ago$/, '') + ' ago'; }
    function portsStr(c) { var parts = []; c.ports.forEach(function (p) { if (p.host) { parts.push((p.ip || '0.0.0.0') + ':' + p.host + '->' + p.container + '/' + (p.proto || 'tcp')); if (!p.ip || p.ip === '0.0.0.0') parts.push('[::]:' + p.host + '->' + p.container + '/' + (p.proto || 'tcp')); } else parts.push(p.container + '/' + (p.proto || 'tcp')); }); return c.status === 'running' ? parts.join(', ') : ''; }
    function cmdShort(c) { var s = '"' + c.cmdText + '"'; return s.length > 22 ? s.slice(0, 20) + '…"' : s; }
    function connect(c, net) { var n = st.networks[net]; if (!n) return; if (!n.subnet) { n.subnet = '172.' + (18 + (st.subnet++ - 17)) + '.0.0/16'; n.gateway = n.subnet.replace('0.0/16', '0.1'); n.ips = 1; } var base = n.subnet.replace('.0.0/16', ''); n.ips = (n.ips || 1) + 1; var ip = c.networks[net] ? c.networks[net].ip : base + '.0.' + (n.ips); c.networks[net] = { ip: ip, mac: '02:42:' + hex(8).replace(/(..)/g, '$1:').slice(0, -1), aliases: [c.name, c.id.slice(0, 12)].concat(c.aliases || []) }; n.containers[c.id] = { name: c.name, ip: ip }; }
    function disconnect(c, net) { var n = st.networks[net]; if (n) delete n.containers[c.id]; delete c.networks[net]; }
    function serviceLogs(c) {
      var img = c.image.split(':')[0].replace(/^.*\//, ''), t = new Date().toISOString().replace('T', ' ').slice(0, 19).replace(/-/g, '/'), lines = [];
      if (img === 'nginx') lines = ['/docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration', '/docker-entrypoint.sh: Looking for shell scripts in /docker-entrypoint.d/', '/docker-entrypoint.sh: Launching /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh', '10-listen-on-ipv6-by-default.sh: info: Getting the checksum of /etc/nginx/conf.d/default.conf', '10-listen-on-ipv6-by-default.sh: info: Enabled listen on IPv6 in /etc/nginx/conf.d/default.conf', '/docker-entrypoint.sh: Sourcing /docker-entrypoint.d/15-local-resolvers.envsh', '/docker-entrypoint.sh: Launching /docker-entrypoint.d/20-envsubst-on-templates.sh', '/docker-entrypoint.sh: Launching /docker-entrypoint.d/30-tune-worker-processes.sh', '/docker-entrypoint.sh: Configuration complete; ready for start up', t + ' [notice] 1#1: using the "epoll" event method', t + ' [notice] 1#1: nginx/1.25.3', t + ' [notice] 1#1: start worker processes'];
      else if (img === 'redis') lines = ['1:C 24 Sep 2026 12:00:00.000 * oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo', '1:C 24 Sep 2026 12:00:00.000 * Redis version=7.2.4, bits=64, commit=00000000, modified=0, pid=1, just started', '1:M 24 Sep 2026 12:00:00.001 * Running mode=standalone, port=6379.', '1:M 24 Sep 2026 12:00:00.002 * Ready to accept connections tcp'];
      else if (img === 'postgres') lines = ['The files belonging to this database system will be owned by user "postgres".', 'PostgreSQL init process complete; ready for start up.', t + ' UTC [1] LOG:  starting PostgreSQL 16.2 on x86_64-pc-linux-musl, compiled by gcc (Alpine 13.2.1) 13.2.1 20231014, 64-bit', t + ' UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432', t + ' UTC [1] LOG:  database system is ready to accept connections'];
      else if (img === 'mysql' || img === 'mongo') lines = [t + ' [Note] ' + img + ' ready for connections.'];
      else if (baseInfo(img) && baseInfo(img).kind === 'lang' || !baseInfo(img)) lines = ['Server listening on port ' + ((c.ports[0] && c.ports[0].container) || 3000), '> ' + (c.name || 'app') + '@1.0.0 start', '> ' + c.cmdText];
      return lines;
    }
    var SERVICE_IMG = /^(nginx|httpd|redis|postgres|mysql|mongo|memcached|rabbitmq)$/;
    function isLongRunning(c) { var img = c.image.split(':')[0].replace(/^.*\//, ''); if (SERVICE_IMG.test(img)) return !c.userCmd || /^(nginx|redis-server|postgres|mysqld|mongod)/.test(c.userCmd); var im = findImage(c.image); if (im && im.local) return true; return /\b(server|start|serve|listen|sleep infinity|tail -f|tail -f \/dev\/null|http\.server)\b|^node (server|app|index)|^npm (start|run dev)|^python (app|main|server)/.test(c.userCmd || ''); }
    function makeContainer(o) {
      var im = o.image, name = o.name || rndName(usedNames()), b = baseInfo(im.name), id = nid();
      var cmdArr = o.cmd && o.cmd.length ? o.cmd : (im.cmd || (b ? [b.cmd].concat(b.args) : ['sh'])), entry = o.entrypoint || im.entrypoint;
      var text = (entry ? [].concat(entry, o.cmd && o.cmd.length ? o.cmd : im.cmd || []) : [].concat(cmdArr)).join(' ');
      if (!o.cmd && !im.cmd && !im.entrypoint && b) text = b.cmd + (b.args.length ? ' ' + b.args.join(' ') : '');
      var c = { id: id, name: name, image: im.name + ':' + im.tag, imageId: im.id, cmdText: text, userCmd: (o.cmd || []).join(' '), created: Date.now(), started: Date.now(), finished: null, status: 'created', exitCode: 0, ports: [], env: (im.env || []).concat(o.env || []), networks: {}, volumes: o.volumes || [], logs: [], files: {}, restart: o.restart || 'no', labels: o.labels || {}, hostname: o.hostname || id.slice(0, 12), workdir: o.workdir || im.workdir || '/', user: o.user || im.user || '', rm: !!o.rm, aliases: o.aliases || [], health: null, tty: !!o.tty, memory: o.memory || 0 };
      var exposed = (im.ports || []).slice(); (o.ports || []).forEach(function (p) { if (exposed.indexOf(p.container) < 0) exposed.push(p.container); });
      (o.ports || []).forEach(function (p) { var hp = p.host; if (hp === undefined || hp === null || hp === '') hp = st.nextPort++; c.ports.push({ ip: p.ip, host: hp, container: p.container, proto: p.proto || 'tcp' }); });
      if (o.publishAll) exposed.forEach(function (ep) { if (!c.ports.some(function (p) { return p.container === ep; })) c.ports.push({ host: st.nextPort++, container: ep, proto: 'tcp' }); });
      exposed.forEach(function (ep) { if (!c.ports.some(function (p) { return p.container === ep; })) c.ports.push({ container: ep, proto: 'tcp' }); });
      c.ports.sort(function (a, b2) { return a.container - b2.container; });
      st.containers[id] = c; (o.networks && o.networks.length ? o.networks : ['bridge']).forEach(function (n) { if (st.networks[n] && n !== 'host' && n !== 'none') connect(c, n); }); return c;
    }
    function portConflict(c, ports) { for (var i = 0; i < ports.length; i++) { var p = ports[i]; if (!p.host) continue; var owner = Object.keys(st.containers).map(function (k) { return st.containers[k]; }).filter(function (o) { return o !== c && o.status === 'running' && o.ports.some(function (q) { return q.host === p.host && (q.ip || '0.0.0.0') === (p.ip || '0.0.0.0'); }); })[0]; if (owner) return p; } return null; }
    function startContainer(c, cmdCtx) {
      var bad = portConflict(c, c.ports); if (bad) { return 'Bind for ' + (bad.ip || '0.0.0.0') + ':' + bad.host + ' failed: port is already allocated'; }
      c.status = 'running'; c.started = Date.now(); c.finished = null; if (!c.logs.length || c.restartLogs) c.logs = serviceLogs(c).map(function (l) { return { t: Date.now(), s: l }; });
      c.logs.push({ t: Date.now(), s: '' }); c.logs.pop(); void cmdCtx; return null;
    }
    function stopContainer(c, code) { c.status = 'exited'; c.exitCode = code === undefined ? 0 : code; c.finished = Date.now(); }
    function removeContainer(c) { (st.gone = st.gone || {})[c.name] = 1; Object.keys(c.networks).forEach(function (n) { disconnect(c, n); }); delete st.containers[c.id]; }

    /* run a command inside a container (simplified) */
    function containerExec(c, argv, c2, opts) {
      opts = opts || {}; var cmd = argv[0], out = c2.out, base = c.image.split(':')[0].replace(/^.*\//, ''), tag = c.image.split(':')[1] || 'latest';
      if (!cmd) { return 0; }
      if (cmd === 'sh' || cmd === 'bash' || cmd === '/bin/sh' || cmd === '/bin/bash' || cmd === 'ash') {
        var ci = argv.indexOf('-c'); if (ci >= 0) return containerExec(c, sim.tokenize(argv.slice(ci + 1).join(' '), {}).map(function (t) { return t.v; }), c2, opts);
        out('(simulator) interactive shells aren\'t available here — pass a command instead, e.g. `docker exec ' + c.name + ' ls /` or `docker exec ' + c.name + ' env`.\n'); return 0;
      }
      if (cmd === 'echo') { out(argv.slice(1).join(' ') + '\n'); return 0; }
      if (cmd === 'pwd') { out(c.workdir + '\n'); return 0; }
      if (cmd === 'whoami') { out((c.user || 'root') + '\n'); return 0; }
      if (cmd === 'hostname') { out(c.hostname + '\n'); return 0; }
      if (cmd === 'id') { out('uid=0(root) gid=0(root) groups=0(root)\n'); return 0; }
      if (cmd === 'date') { out(new Date().toUTCString().replace('GMT', 'UTC') + '\n'); return 0; }
      if (cmd === 'uname') { out(argv.indexOf('-a') >= 0 ? 'Linux ' + c.hostname + ' 6.6.12-linuxkit #1 SMP x86_64 GNU/Linux\n' : 'Linux\n'); return 0; }
      if (cmd === 'env' || cmd === 'printenv') { ['PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin', 'HOSTNAME=' + c.hostname].concat(c.env, ['HOME=/root']).forEach(function (e) { out(e + '\n'); }); return 0; }
      if (cmd === 'ls') { var target = argv.filter(function (x) { return x[0] !== '-'; })[1] || c.workdir; var fsList = Object.keys(c.files).filter(function (f) { return path.dirname(f) === path.resolve(c.workdir, target); }).map(function (f) { return path.basename(f); }); var defaults = { '/': 'bin dev etc home lib media mnt opt proc root run sbin srv sys tmp usr var', '/app': 'Dockerfile node_modules package.json src', '/usr/share/nginx/html': '50x.html index.html', '/etc/nginx': 'conf.d fastcgi_params mime.types modules nginx.conf' }; out((fsList.length ? fsList.join('  ') : (defaults[path.resolve(c.workdir, target)] || '').split(' ').join('  ')) + '\n'); return 0; }
      if (cmd === 'cat') { var f = path.resolve(c.workdir, argv[1] || ''); if (c.files[f] !== undefined) { out(c.files[f]); return 0; } if (f === '/etc/os-release') { out(/alpine/.test(tag) || base === 'alpine' ? 'NAME="Alpine Linux"\nID=alpine\nVERSION_ID=3.19.1\nPRETTY_NAME="Alpine Linux v3.19"\n' : 'PRETTY_NAME="Debian GNU/Linux 12 (bookworm)"\nNAME="Debian GNU/Linux"\nVERSION_ID="12"\n'); return 0; } if (f === '/etc/hostname') { out(c.hostname + '\n'); return 0; } c2.err('cat: ' + argv[1] + ': No such file or directory\n'); return 1; }
      if (cmd === 'ps') { out('PID   USER     TIME  COMMAND\n    1 root      0:00 ' + c.cmdText + '\n'); return 0; }
      if (cmd === 'sleep') return 0;
      if (cmd === 'node' && (base === 'node' || findImage(c.image) && findImage(c.image).base === 'node')) { if (/^(--version|-v)$/.test(argv[1])) { out(nodeVer(tag) + '\n'); return 0; } if (argv[1] === '-e' || argv[1] === '-p') { try { var logs = []; var fake = { log: function () { logs.push(sim.format.apply(null, arguments)); } }; var r = new Function('console', 'process', (argv[1] === '-p' ? 'return (' + argv[2] + ')' : argv[2]))(fake, { version: nodeVer(tag), platform: 'linux', env: {} }); if (argv[1] === '-p') logs.push(sim.inspect(r)); out(logs.join('\n') + (logs.length ? '\n' : '')); return 0; } catch (e) { c2.err(e.name + ': ' + e.message + '\n'); return 1; } } out('(simulator) node runs one-liners here: `node --version`, `node -e "console.log(1+1)"`.\n'); return 0; }
      if ((cmd === 'python' || cmd === 'python3') && /^--version|-V$/.test(argv[1] || '')) { out('Python ' + (baseInfo('python').ver) + '\n'); return 0; }
      if (cmd === 'npm' && argv[1] === '--version') { out('10.2.4\n'); return 0; }
      if (cmd === 'nginx') { if (argv[1] === '-v') { c2.err('nginx version: nginx/1.25.3\n'); return 0; } if (argv[1] === '-t') { c2.err('nginx: the configuration file /etc/nginx/nginx.conf syntax is ok\nnginx: configuration file /etc/nginx/nginx.conf test is successful\n'); return 0; } if (argv[1] === '-T') { out('nginx: the configuration file /etc/nginx/nginx.conf syntax is ok\nnginx: configuration file /etc/nginx/nginx.conf test is successful\n# configuration file /etc/nginx/nginx.conf:\n\nuser  nginx;\nworker_processes  auto;\n\nerror_log  /var/log/nginx/error.log notice;\npid        /var/run/nginx.pid;\n\nevents {\n    worker_connections  1024;\n}\n\nhttp {\n    include       /etc/nginx/mime.types;\n    default_type  application/octet-stream;\n    sendfile        on;\n    keepalive_timeout  65;\n    include /etc/nginx/conf.d/*.conf;\n}\n\n# configuration file /etc/nginx/conf.d/default.conf:\nserver {\n    listen       80;\n    listen  [::]:80;\n    server_name  localhost;\n\n    location / {\n        root   /usr/share/nginx/html;\n        index  index.html index.htm;\n    }\n}\n'); return 0; } }
      if (cmd === 'redis-cli' && base === 'redis') { var srv = c.redis || (c.redis = sim.createRedis()); var line = argv.slice(1).map(function (a) { return /\s/.test(a) ? '"' + a + '"' : a; }).join(' '); if (!line) { out('(simulator) interactive redis-cli isn\'t available via exec — pass the command: `docker exec ' + c.name + ' redis-cli PING`.\n'); return 0; } var rr = srv.exec(line); rr.chunks.forEach(function (ch) { out(ch.s); }); return rr.code; }
      if (cmd === 'psql' && base === 'postgres') { out('(simulator) psql isn\'t available inside the Docker simulator — use the PostgreSQL language in the editor to run real SQL.\n'); return 0; }
      if (cmd === 'ping') { var host = argv.filter(function (x) { return x[0] !== '-'; })[1]; var target2 = findContainer(host); var net = Object.keys(c.networks).filter(function (n) { return target2 && target2.networks[n]; })[0]; if (!target2 || !net) { c2.err('ping: bad address \'' + host + '\'\n'); return 1; } var ip = target2.networks[net].ip; out('PING ' + host + ' (' + ip + '): 56 data bytes\n'); for (var i = 0; i < 3; i++) out('64 bytes from ' + ip + ': seq=' + i + ' ttl=64 time=0.' + (100 + i * 37) + ' ms\n'); out('\n--- ' + host + ' ping statistics ---\n3 packets transmitted, 3 packets received, 0% packet loss\nround-trip min/avg/max = 0.100/0.137/0.174 ms\n'); return 0; }
      if (cmd === 'curl' || cmd === 'wget') { return doCurl(argv.slice(1), c2, c); }
      if (opts.notFound !== false) { c2.err('OCI runtime exec failed: exec failed: unable to start container process: exec: "' + cmd + '": executable file not found in $PATH: unknown\n'); return 126; }
    }
    function doCurl(args, c, from) {
      var url = args.filter(function (x) { return x[0] !== '-'; })[0] || '', m = url.match(/^(?:https?:\/\/)?([^/:]+)(?::(\d+))?(\/.*)?$/), host = m && m[1], port = m && m[2] ? +m[2] : 80, p = (m && m[3]) || '/';
      var target = null;
      if (/^(localhost|127\.0\.0\.1)$/.test(host)) target = Object.keys(st.containers).map(function (k) { return st.containers[k]; }).filter(function (o) { return o.status === 'running' && o.ports.some(function (q) { return q.host === port; }); })[0];
      else { target = findContainer(host); if (target && target.status !== 'running') target = null; }
      if (!target || (from && from !== true && from.id === target.id && false)) { c.err('curl: (7) Failed to connect to ' + host + ' port ' + port + ' after 0 ms: Couldn\'t connect to server\n'); return 7; }
      var img = target.image.split(':')[0].replace(/^.*\//, '');
      target.logs.push({ t: Date.now(), s: '172.17.0.1 - - [' + new Date().toUTCString().slice(5, 25).replace(/ /g, '/').replace(/\/(\d\d:)/, ':$1') + ' +0000] "GET ' + p + ' HTTP/1.1" 200 615 "-" "curl/8.4.0" "-"' });
      if (img === 'nginx') c.out('<!DOCTYPE html>\n<html>\n<head>\n<title>Welcome to nginx!</title>\n<style>\nhtml { color-scheme: light dark; }\nbody { width: 35em; margin: 0 auto;\nfont-family: Tahoma, Verdana, Arial, sans-serif; }\n</style>\n</head>\n<body>\n<h1>Welcome to nginx!</h1>\n<p>If you see this page, the nginx web server is successfully installed and\nworking. Further configuration is required.</p>\n<p><em>Thank you for using nginx.</em></p>\n</body>\n</html>\n');
      else if (img === 'httpd') c.out('<html><body><h1>It works!</h1></body></html>\n'); else c.out('Hello from ' + target.name + '! (simulated response on port ' + port + ')\n');
      return 0;
    }

    /* ── Dockerfile ── */
    function parseDockerfile(text) {
      var raw = String(text).split(/\r?\n/), ins = [], i = 0;
      while (i < raw.length) {
        var ln = i + 1, line = raw[i++]; if (!line.trim() || /^\s*#/.test(line)) continue;
        while (/\\\s*$/.test(line) && i < raw.length) { var nx = raw[i++]; if (/^\s*#/.test(nx)) continue; line = line.replace(/\\\s*$/, ' ') + nx.trim(); }
        var m = line.trim().match(/^(\w+)\s*(.*)$/); if (!m) continue;
        var op = m[1].toUpperCase(), known = ['FROM', 'RUN', 'CMD', 'LABEL', 'MAINTAINER', 'EXPOSE', 'ENV', 'ADD', 'COPY', 'ENTRYPOINT', 'VOLUME', 'USER', 'WORKDIR', 'ARG', 'ONBUILD', 'STOPSIGNAL', 'HEALTHCHECK', 'SHELL'];
        if (known.indexOf(op) < 0) throw new Error('dockerfile parse error on line ' + ln + ': unknown instruction: ' + m[1]);
        ins.push({ op: op, args: m[2], line: ln });
      }
      return ins;
    }
    function jsonOrShell(s) { s = s.trim(); if (s[0] === '[') { try { return JSON.parse(s); } catch (e) { /* shell form */ } } return { shell: s }; }
    function build(args, c) {
      var tags = [], file = 'Dockerfile', ctxDir = '.', target = null, buildArgs = {}, noCache = false, i, quiet = false;
      for (i = 0; i < args.length; i++) { var a = args[i]; if (a === '-t' || a === '--tag') tags.push(args[++i]); else if (/^--tag=/.test(a)) tags.push(a.slice(6)); else if (a === '-f' || a === '--file') file = args[++i]; else if (a === '--target') target = args[++i]; else if (a === '--build-arg') { var kv = args[++i].split('='); buildArgs[kv[0]] = kv.slice(1).join('='); } else if (a === '--no-cache') noCache = true; else if (a === '-q' || a === '--quiet') quiet = true; else if (a[0] !== '-') ctxDir = a; }
      var ctxAbs = shell.abs(ctxDir), fpath = path.resolve(file[0] === '/' ? '/' : ctxAbs, file), text = sim.files[fpath];
      if (text === undefined) { c.err('ERROR: failed to solve: failed to read dockerfile: open ' + file + ': no such file or directory\n'); return 1; }
      var ins; try { ins = parseDockerfile(text); } catch (e) { c.err('ERROR: failed to solve: ' + e.message + '\n'); return 1; }
      if (!ins.length || ins.filter(function (x) { return x.op !== 'ARG'; })[0] === undefined || ins.filter(function (x) { return x.op !== 'ARG'; })[0].op !== 'FROM') { c.err('ERROR: failed to solve: dockerfile parse error: no build stage in current context\n'); return 1; }
      var stages = [], curStage = null; ins.forEach(function (x) { if (x.op === 'FROM') { var m = x.args.replace(/--platform=\S+\s*/, '').match(/^(\S+)(?:\s+[Aa][Ss]\s+(\S+))?/); curStage = { from: m[1], as: m[2] || null, steps: [] }; stages.push(curStage); } else if (curStage) curStage.steps.push(x); });
      var targetStage = target ? stages.filter(function (s) { return s.as === target; })[0] : stages[stages.length - 1]; if (target && !targetStage) { c.err('ERROR: failed to solve: target stage "' + target + '" could not be found\n'); return 1; }
      var globalArgs = {}; ins.forEach(function (x) { if (x.op === 'ARG' && x === ins[ins.indexOf(x)] && !stages.some(function (s) { return s.steps.indexOf(x) >= 0; })) { var p = x.args.split('='); globalArgs[p[0]] = p.slice(1).join('=').replace(/^["']|["']$/g, ''); } });
      function subst(s, env) { return s.replace(/\$\{(\w+)(?::-([^}]*))?\}|\$(\w+)/g, function (m2, a1, def, a2) { var k = a1 || a2; var v = env[k] !== undefined ? env[k] : buildArgs[k] !== undefined ? buildArgs[k] : globalArgs[k] !== undefined ? globalArgs[k] : def; return v === undefined ? '' : v; }); }
      var chain = [], seen = {};
      (function collect(s) {
        if (!s || seen[s.from + s.as]) return; seen[s.from + s.as] = 1;
        var dep = stages.filter(function (o) { return o.as === s.from; })[0]; if (dep) collect(dep);
        s.steps.forEach(function (x) { var fm = x.args.match(/--from=(\S+)/); if (fm) { var ds = stages.filter(function (o) { return o.as === fm[1]; })[0]; if (ds) collect(ds); } });
        chain.push(s);
      })(targetStage);
      var totalSteps = 0; chain.forEach(function (s) { totalSteps += 1 + s.steps.filter(function (x) { return /^(RUN|COPY|ADD|WORKDIR)$/.test(x.op); }).length; });
      var lines = [], t0 = 0, idx = 0, layers = 0, secs = function (n) { return n.toFixed(1) + 's'; }, sum = 0;
      function row(text2, time) { lines.push(' => ' + text2.padEnd(66).slice(0, Math.max(66, text2.length)) + ' ' + secs(time)); sum += time; }
      var cfg = { env: [], workdir: '/', user: '', ports: [], cmd: null, entrypoint: null, volumes: [], base: null, labels: {} }, baseImg = null, size = 0;
      var stageOfBase = null; void stageOfBase;
      var fromRef = targetStage.from; var lastStage = chain[chain.length - 1];
      lines.push(' => [internal] load build definition from ' + path.basename(fpath) + '                                    0.0s'); lines.push(' => => transferring dockerfile: ' + Buffer.byteLength(text) + 'B                                           0.0s');
      var ok = true, metaShown = {};
      chain.forEach(function (s) {
        var isLast = s === lastStage, fr = subst(s.from, {}), ref = parseRef(fr), local = stages.filter(function (o) { return o.as === s.from; })[0];
        var metaKey = ref.name + ':' + ref.tag; if (!local && !metaShown[metaKey]) { metaShown[metaKey] = 1; lines.push(' => [internal] load metadata for docker.io/' + (ref.name.indexOf('/') < 0 ? 'library/' : '') + ref.name + ':' + ref.tag + '                    1.1s'); if (!findImage(fr) && !canPull(ref.name)) { ok = false; c.err(lines.join('\n') + '\nERROR: failed to solve: ' + ref.name + ':' + ref.tag + ': failed to resolve source metadata for docker.io/' + fullRepo(ref.name).replace('docker.io/', '') + ':' + ref.tag + ': pull access denied, repository does not exist or may require authorization\n'); return; } }
      });
      if (!ok) return 1;
      lines.push(' => [internal] load .dockerignore                                                 0.0s'); lines.push(' => => transferring context: 2B                                                  0.0s');
      var stepNo = 0; chain.forEach(function (s, si) {
        var fr = subst(s.from, {}), ref = parseRef(fr), local = stages.filter(function (o) { return o.as === s.from; })[0], sn = (chain.length > 1 ? si + 1 + ':' : '');
        idx++; stepNo = 0; var stageTotal = 1 + s.steps.filter(function (x) { return /^(RUN|COPY|ADD|WORKDIR)$/.test(x.op); }).length;
        var label = '[' + (chain.length > 1 ? (s.as || 'stage-' + si) + ' ' : '') + '1/' + stageTotal + '] FROM ' + (local ? s.from : 'docker.io/' + (ref.name.indexOf('/') < 0 ? 'library/' : '') + ref.name + ':' + ref.tag + '@sha256:' + hex(64).slice(0, 64));
        lines.push(' => ' + label + '  ' + (local ? '0.0s' : '2.3s')); void sn;
        if (!local) { var bi = findImage(fr) || addImage(ref.name, ref.tag); size = bi.size; cfg.base = ref.name.replace(/^.*\//, ''); cfg.env = (bi.env || []).slice(); cfg.ports = (bi.ports || []).slice(); cfg.baseCmd = bi.cmd; baseImg = bi; }
        var env = {}; cfg.workdir = '/'; var n = 1;
        s.steps.forEach(function (x) {
          var a = subst(x.args, env);
          if (x.op === 'ENV') { a.replace(/(\w+)=("[^"]*"|\S+)/g, function (m3, k, v) { env[k] = v.replace(/^"|"$/g, ''); cfg.env.push(k + '=' + env[k]); return m3; }); if (!/=/.test(a)) { var sp = a.split(/\s+/); env[sp[0]] = sp.slice(1).join(' '); cfg.env.push(sp[0] + '=' + env[sp[0]]); } }
          else if (x.op === 'ARG') { var kv2 = x.args.split('='); if (buildArgs[kv2[0]] !== undefined) env[kv2[0]] = buildArgs[kv2[0]]; else if (kv2[1] !== undefined) env[kv2[0]] = kv2.slice(1).join('=').replace(/^["']|["']$/g, ''); }
          else if (x.op === 'WORKDIR') { n++; cfg.workdir = path.resolve(cfg.workdir, a.trim()); lines.push(' => [' + (chain.length > 1 ? (s.as || 'stage-' + si) + ' ' : '') + n + '/' + stageTotal + '] WORKDIR ' + cfg.workdir + '                                                    0.0s'); layers++; }
          else if (x.op === 'RUN' || x.op === 'COPY' || x.op === 'ADD') { n++; var shown = x.op + ' ' + a.replace(/--from=\S+\s*/, function (m4) { return m4; }); var dur = x.op === 'RUN' ? (/npm (ci|install)|pip install|apt|apk|go build|mvn/.test(a) ? 4.5 + Math.random() * 6 : 0.3 + Math.random()) : 0.1; lines.push(' => [' + (chain.length > 1 ? (s.as || 'stage-' + si) + ' ' : '') + n + '/' + stageTotal + '] ' + (shown.length > 70 ? shown.slice(0, 67) + '...' : shown) + ' ' + secs(dur)); layers++; size += x.op === 'RUN' ? (/npm|pip|apt|apk|go build/.test(a) ? 45e6 : 2e5) : 6e5; if (x.op === 'COPY' && /--from=/.test(a)) size += 2e6; }
          else if (x.op === 'EXPOSE') { a.split(/\s+/).forEach(function (p) { var pn = parseInt(p, 10); if (pn && cfg.ports.indexOf(pn) < 0) cfg.ports.push(pn); }); }
          else if (x.op === 'CMD') { cfg.cmd = jsonOrShell(a); } else if (x.op === 'ENTRYPOINT') { cfg.entrypoint = jsonOrShell(a); } else if (x.op === 'USER') cfg.user = a.trim(); else if (x.op === 'VOLUME') { try { cfg.volumes = cfg.volumes.concat(JSON.parse(a)); } catch (e) { cfg.volumes = cfg.volumes.concat(a.split(/\s+/)); } }
          else if (x.op === 'LABEL') { a.replace(/([\w.-]+)=("[^"]*"|\S+)/g, function (m5, k, v) { cfg.labels[k] = v.replace(/^"|"$/g, ''); return m5; }); }
        });
      });
      if (quiet) { /* -q prints only the id */ }
      var id = 'sha256:' + hex(64), names = tags.length ? tags : [null];
      lines.push(' => exporting to image                                                            0.3s'); lines.push(' => => exporting layers                                                           0.3s'); lines.push(' => => writing image ' + id + '  0.0s');
      var built = [], images = [];
      names.forEach(function (t) { var nm = null, tg = 'latest'; if (t) { var p = parseRef(t); nm = p.name; tg = p.tag; lines.push(' => => naming to docker.io/' + (nm.indexOf('/') < 0 ? 'library/' : '') + nm + ':' + tg + '                                  0.0s'); } if (nm) { delete st.images[nm + ':' + tg]; var im = addImage(nm, tg, { id: id, created: Date.now(), size: size || 120e6, cmd: cfg.cmd && !cfg.cmd.shell ? cfg.cmd : cfg.cmd ? ['/bin/sh', '-c', cfg.cmd.shell] : null, entrypoint: cfg.entrypoint && !cfg.entrypoint.shell ? cfg.entrypoint : null, ports: cfg.ports, env: cfg.env, workdir: cfg.workdir, user: cfg.user, volumes: cfg.volumes, base: cfg.base, local: true, labels: cfg.labels, layers: layers }); images.push(im); } });
      if (!tags.length) addImage('<none>', '<none>', { id: id, size: size || 120e6, created: Date.now(), cmd: null, ports: cfg.ports, local: true });
      var total = Math.max(3, lines.length + 1), header = '[+] Building ' + (3 + layers * 1.4).toFixed(1) + 's (' + (chain.length * 2 + layers + 5) + '/' + (chain.length * 2 + layers + 5) + ') FINISHED';
      var aligned = lines.map(function (l) { var m2 = l.match(/^(.*?)\s+(\d+\.\d+s)$/); return m2 ? (m2[1].length < 84 ? m2[1].padEnd(84) : m2[1] + ' ') + m2[2] : l; });
      if (quiet) c.out(id + '\n'); else c.err(header.padEnd(84) + 'docker:default\n' + aligned.join('\n') + '\n'); void total; void baseImg; void t0; void totalSteps; void fromRef;
      return 0;
    }

    /* ── main docker dispatcher ── */
    var D = {};
    function flagsOf(a, spec) { // spec: { bool: [...], val: [...] } → { f: {}, rest: [] }
      var f = {}, rest = [], i = 0; while (i < a.length) { var x = a[i]; if (x === '--') { rest = rest.concat(a.slice(i + 1)); break; } if (x[0] === '-' && x.length > 1) { var name = x.replace(/^-+/, ''), eq = name.indexOf('='), val = null; if (eq >= 0) { val = name.slice(eq + 1); name = name.slice(0, eq); } if (spec.val.indexOf(x.split('=')[0]) >= 0 || spec.val.indexOf('-' + name) >= 0 && x.length === 2 || spec.val.indexOf('--' + name) >= 0) { if (val === null) val = a[++i]; (f[name] = f[name] || []).push(val); } else if (!/^--/.test(x) && x.length > 2 && !spec.bool.some(function (b) { return b === x; })) { x.slice(1).split('').forEach(function (ch) { f[ch] = [true]; }); } else f[name] = [val === null ? true : val]; } else rest.push(x); i++; }
      return { f: f, rest: rest };
    }
    function has(f) { for (var i = 1; i < arguments.length; i++) if (f[arguments[i]]) return true; return false; }
    function val(f) { for (var i = 1; i < arguments.length; i++) if (f[arguments[i]]) return f[arguments[i]][f[arguments[i]].length - 1]; return undefined; }
    function all(f) { var out = []; for (var i = 1; i < arguments.length; i++) if (f[arguments[i]]) out = out.concat(f[arguments[i]]); return out; }
    function parsePort(s) { var m = String(s).match(/^(?:(\d+\.\d+\.\d+\.\d+):)?(?:(\d+)(?:-\d+)?:)?(\d+)(?:-\d+)?(?:\/(tcp|udp))?$/); if (!m) return null; return { ip: m[1], host: m[2] ? +m[2] : (m[1] || String(s).indexOf(':') < 0 ? (m[1] ? undefined : undefined) : undefined), container: +m[3], proto: m[4] || 'tcp' }; }
    function noSuchContainer(c, ref) { if (st.script && st.gone && st.gone[ref]) { c.out('ℹ️ (simulator) ' + ref + ' was already removed by an earlier command — the lines above are alternatives.\n'); return 0; } c.err('Error response from daemon: No such container: ' + ref + '\n'); return 1; }

    D.run = function (a, c, ctx) {
      var sp = { bool: ['-d', '--detach', '-i', '-t', '-it', '--rm', '-P', '--init', '--privileged'], val: ['--name', '-p', '--publish', '-e', '--env', '-v', '--volume', '--network', '--net', '-w', '--workdir', '--restart', '-u', '--user', '--env-file', '-h', '--hostname', '-m', '--memory', '--cpus', '--entrypoint', '--platform', '--label', '-l', '--mount', '--network-alias', '--health-cmd', '--add-host', '--cap-add', '--pull', '--log-driver', '--expose'] };
      // options end at the first non-option (the image)
      var opts = [], i = 0; while (i < a.length && a[i][0] === '-') { opts.push(a[i]); if (sp.val.indexOf(a[i]) >= 0) opts.push(a[++i]); i++; }
      var imageRef = a[i], cmdArgs = a.slice(i + 1), parsed = flagsOf(opts, sp), f = parsed.f;
      if (!imageRef) { c.err('docker: "docker run" requires at least 1 argument.\nSee \'docker run --help\'.\n'); return 125; }
      var im = ensureImage(imageRef, c, 'run'); if (!im) return 125;
      var name = val(f, 'name');
      if (name && findContainer(name)) {
        var ex = findContainer(name);
        if (st.script) { removeContainer(ex); c.out('ℹ️ A container named "' + name + '" already existed — removed it first so this example can run.\n'); }
        else { c.err('docker: Error response from daemon: Conflict. The container name "/' + name + '" is already in use by container "' + ex.id + '". You have to remove (or rename) that container to be able to reuse that name.\nSee \'docker run --help\'.\n'); return 125; }
      }
      var ports = all(f, 'p', 'publish').map(parsePort).filter(Boolean); ports.forEach(function (p) { if (p.host === undefined) p.host = st.nextPort++; });
      var pubAll = has(f, 'P'), detach = has(f, 'd', 'detach'), it = has(f, 'i') || has(f, 't') || has(f, 'it'), rm = has(f, 'rm');
      var volumes = all(f, 'v', 'volume').map(function (v) { var pr = v.split(':'); return { src: pr[0], dst: pr[1] || pr[0], mode: pr[2] || 'rw' }; });
      volumes.forEach(function (v) { if (!/^[./~]/.test(v.src) && v.src !== v.dst && !st.volumes[v.src]) st.volumes[v.src] = { name: v.src, created: Date.now(), driver: 'local' }; });
      var envs = all(f, 'e', 'env'); var nets = all(f, 'network', 'net'); nets.forEach(function (n) { if (!st.networks[n]) { c.err('docker: Error response from daemon: network ' + n + ' not found.\n'); } });
      if (nets.some(function (n) { return !st.networks[n]; })) return 125;
      var entryFlag = val(f, 'entrypoint'), cmdParsed = cmdArgs;
      var cont = makeContainer({ image: im, name: name, cmd: cmdParsed, entrypoint: entryFlag ? [entryFlag] : null, ports: ports, publishAll: pubAll, env: envs, volumes: volumes, networks: nets, restart: val(f, 'restart'), workdir: val(f, 'w', 'workdir'), user: val(f, 'u', 'user'), rm: rm, hostname: val(f, 'h', 'hostname'), tty: it, aliases: all(f, 'network-alias') });
      var berr = startContainer(cont); if (berr) { removeContainer(cont); c.err('docker: Error response from daemon: driver failed programming external connectivity on endpoint ' + (name || cont.name) + ' (' + hex(64) + '): ' + berr + '.\n'); return 125; }
      var base = im.name.replace(/^.*\//, ''), info = baseInfo(im.name), userCmd = cmdArgs.length ? cmdArgs : null;
      if (info && info.kind === 'hello' && !userCmd) { c.out('\nHello from Docker!\nThis message shows that your installation appears to be working correctly.\n\nTo generate this message, Docker took the following steps:\n 1. The Docker client contacted the Docker daemon.\n 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.\n    (amd64)\n 3. The Docker daemon created a new container from that image which runs the\n    executable that produces the output you are currently reading.\n 4. The Docker daemon streamed that output to the Docker client, which sent it\n    to your terminal.\n\nTo try something more ambitious, you can run an Ubuntu container with:\n $ docker run -it ubuntu bash\n\nShare images, automate workflows, and more with a free Docker ID:\n https://hub.docker.com/\n\nFor more examples and ideas, visit:\n https://docs.docker.com/get-started/\n\n'); stopContainer(cont, 0); if (rm) removeContainer(cont); return 0; }
      var runs = userCmd || (im.cmd && !isLongRunning(cont) ? null : null);
      if (userCmd && !isLongRunning(cont)) { var code = containerExec(cont, userCmd, c, { notFound: true }); stopContainer(cont, code || 0); if (rm) removeContainer(cont); if (it && !userCmd) c.out(''); return code || 0; }
      if (!userCmd && info && info.kind === 'os' && !isLongRunning(cont)) { if (it) c.out('(simulator) interactive shells aren\'t available here — try `docker run --rm ' + imageRef + ' echo hello` or `... cat /etc/os-release`.\n'); stopContainer(cont, 0); if (rm) removeContainer(cont); return 0; }
      if (!userCmd && info && info.kind === 'lang' && !isLongRunning(cont)) { if (it) c.out('(simulator) interactive REPLs aren\'t available here — try `docker run --rm ' + imageRef + ' ' + base + ' --version`.\n'); stopContainer(cont, 0); if (rm) removeContainer(cont); return 0; }
      if (detach) { c.out(cont.id + '\n'); }
      else { cont.logs.forEach(function (l) { c.out(l.s + '\n'); }); c.out('(simulator) foreground container "' + cont.name + '" is running — in a real terminal this blocks until Ctrl+C; the simulator moves on. Use `docker stop ' + cont.name + '`.\n'); }
      return 0;
    };
    D.ps = D.container_ls = function (a, c) {
      var sp = { bool: ['-a', '--all', '-q', '--quiet', '-l', '--latest', '-s', '--size', '--no-trunc'], val: ['--filter', '-f', '--format', '-n', '--last'] }, p = flagsOf(a, sp), f = p.f, allF = has(f, 'a', 'all'), list = Object.keys(st.containers).map(function (k) { return st.containers[k]; });
      if (!allF) list = list.filter(function (x) { return x.status === 'running' || x.status === 'paused'; });
      all(f, 'filter').forEach(function (flt) { var kv = String(flt).split('='); if (kv[0] === 'name') list = list.filter(function (x) { return x.name.indexOf(kv[1]) >= 0; }); else if (kv[0] === 'status') list = list.filter(function (x) { return x.status === kv[1]; }); else if (kv[0] === 'ancestor') list = list.filter(function (x) { return x.image.indexOf(kv[1]) === 0; }); else if (kv[0] === 'label') list = list.filter(function (x) { return x.labels[kv[1].split('=')[0]] !== undefined; }); });
      list.sort(function (x, y) { return y.created - x.created; }); if (has(f, 'l', 'latest')) list = list.slice(0, 1); if (val(f, 'n', 'last') && val(f, 'n', 'last') !== '-1') list = list.slice(0, +val(f, 'n', 'last'));
      if (has(f, 'q', 'quiet')) { list.forEach(function (x) { c.out(x.id.slice(0, 12) + '\n'); }); return; }
      var fmt = val(f, 'format'); var rowOf = function (x) { return { ID: x.id.slice(0, 12), Image: x.image, Command: cmdShort(x), CreatedAt: new Date(x.created).toISOString().replace('T', ' ').slice(0, 19) + ' +0000 UTC', RunningFor: ago(x.created), Ports: portsStr(x), Status: statusStr(x), Names: x.name, Networks: Object.keys(x.networks).join(','), Labels: '', Size: '0B (virtual 100MB)' }; };
      if (fmt) { var isTable = /^table /.test(fmt), t = fmt.replace(/^table /, ''); if (isTable) c.out(t.replace(/\{\{\s*\.(\w+)\s*\}\}/g, function (m, k) { return k.toUpperCase().replace('NAMES', 'NAMES'); }).replace(/\\t/g, '\t') + '\n'); list.forEach(function (x) { c.out(tpl(t, rowOf(x)) + '\n'); }); return; }
      c.out(table(['CONTAINER ID', 'IMAGE', 'COMMAND', 'CREATED', 'STATUS', 'PORTS', 'NAMES'], list.map(function (x) { return [x.id.slice(0, 12), x.image.length > 30 ? x.image.slice(0, 27) + '…' : x.image, cmdShort(x), ago(x.created), statusStr(x), portsStr(x), x.name]; })));
    };
    D.images = D.image_ls = function (a, c) {
      var p = flagsOf(a, { bool: ['-q', '--quiet', '-a', '--all', '--no-trunc', '--digests'], val: ['--filter', '-f', '--format'] }), f = p.f, list = Object.keys(st.images).map(function (k) { return st.images[k]; });
      var refFilter = p.rest[0]; if (refFilter) list = list.filter(function (im) { return im.name === parseRef(refFilter).name && (!/:/.test(refFilter) || im.tag === parseRef(refFilter).tag); });
      all(f, 'filter', 'f').forEach(function (flt) { var kv = String(flt).split('='); if (kv[0] === 'dangling') list = list.filter(function (im) { return (im.name === '<none>') === (kv[1] === 'true'); }); if (kv[0] === 'reference') { var re = new RegExp('^' + kv[1].replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$'); list = list.filter(function (im) { return re.test(im.name + ':' + im.tag) || re.test(im.name); }); } });
      if (!has(f, 'a', 'all') && !all(f, 'filter', 'f').some(function (x) { return /dangling/.test(x); })) list = list.filter(function (im) { return im.name !== '<none>'; });
      list.sort(function (x, y) { return y.created - x.created; });
      if (has(f, 'q', 'quiet')) { list.forEach(function (im) { c.out(im.id.replace('sha256:', '').slice(0, 12) + '\n'); }); return; }
      var fmt = val(f, 'format'); if (fmt) { list.forEach(function (im) { c.out(tpl(fmt.replace(/^table /, ''), { Repository: im.name, Tag: im.tag, ID: im.id.replace('sha256:', '').slice(0, 12), CreatedSince: ago(im.created), Size: fmtSize(im.size) }) + '\n'); }); return; }
      c.out(table(['REPOSITORY', 'TAG', 'IMAGE ID', 'CREATED', 'SIZE'], list.map(function (im) { return [im.name, im.tag, im.id.replace('sha256:', '').slice(0, 12), ago(im.created), fmtSize(im.size)]; })));
    };
    D.pull = function (a, c) { var ref = a.filter(function (x) { return x[0] !== '-'; })[0]; if (!ref) { c.err('"docker pull" requires exactly 1 argument.\n'); return 1; } var p = parseRef(ref); if (!canPull(p.name)) { c.err("Error response from daemon: pull access denied for " + p.name + ", repository does not exist or may require 'docker login': denied: requested access to the resource is denied\n"); return 1; } var ex = findImage(ref); if (ex) { c.out(p.tag + ': Pulling from ' + fullRepo(p.name).replace('docker.io/', '') + '\nDigest: ' + ex.digest + '\nStatus: Image is up to date for ' + p.name + ':' + p.tag + '\n' + fullRepo(p.name) + ':' + p.tag + '\n'); return; } pullLayers(p.name, p.tag, c); };
    D.tag = function (a, c) { var src = findImage(a[0]); if (!src) { c.err('Error response from daemon: No such image: ' + a[0] + '\n'); return 1; } var p = parseRef(a[1]); st.images[p.name + ':' + p.tag] = Object.assign({}, src, { name: p.name, tag: p.tag }); };
    D.rmi = D.image_rm = function (a, c) { var code = 0; a.filter(function (x) { return x[0] !== '-'; }).forEach(function (ref) { var im = findImage(ref); if (!im) { c.err('Error response from daemon: No such image: ' + ref + '\n'); code = 1; return; } var users = Object.keys(st.containers).filter(function (k) { return st.containers[k].imageId === im.id && st.containers[k].image === im.name + ':' + im.tag; }); if (users.length && a.indexOf('-f') < 0) { c.err('Error response from daemon: conflict: unable to remove repository reference "' + ref + '" (must force) - container ' + users[0].slice(0, 12) + ' is using its referenced image ' + im.id.replace('sha256:', '').slice(0, 12) + '\n'); code = 1; return; } var sameId = Object.keys(st.images).filter(function (k) { return st.images[k].id === im.id; }); if (sameId.length > 1 || parseRef(ref).name !== '<none>' && findImage(ref).name + ':' + findImage(ref).tag === parseRef(ref).name + ':' + parseRef(ref).tag) { c.out('Untagged: ' + im.name + ':' + im.tag + '\n'); delete st.images[im.name + ':' + im.tag]; if (sameId.length > 1) return; } else delete st.images[im.name + ':' + im.tag]; c.out('Deleted: ' + im.id + '\n'); }); return code; };
    D.push = function (a, c) {
      var all_ = a.indexOf('--all-tags') >= 0 || a.indexOf('-a') >= 0, ref = a.filter(function (x) { return x[0] !== '-'; })[0], p = parseRef(ref), list = all_ ? Object.keys(st.images).map(function (k) { return st.images[k]; }).filter(function (im) { return im.name === p.name; }) : [findImage(ref)].filter(Boolean);
      if (!list.length) { c.err('The push refers to repository [' + fullRepo(p.name) + ']\nAn image does not exist locally with the tag: ' + p.name + '\n'); return 1; }
      if (!st.loggedIn) { c.err('The push refers to repository [' + fullRepo(p.name) + ']\n' + hex(12) + ': Preparing\ndenied: requested access to the resource is denied\n'); return 1; }
      list.forEach(function (im) { c.out('The push refers to repository [' + fullRepo(im.name) + ']\n'); for (var i = 0; i < Math.max(3, im.layers || 4); i++) c.out(hex(12) + ': ' + (i === 0 ? 'Pushed' : 'Layer already exists') + '\n'); c.out(im.tag + ': digest: ' + im.digest + ' size: ' + (1000 + Math.floor(Math.random() * 900)) + '\n'); });
    };
    D.login = function (a, c) { var u = a.indexOf('-u') >= 0 ? a[a.indexOf('-u') + 1] : (a.filter(function (x) { return /^--username=/.test(x); })[0] || '').slice(11) || 'student'; if (a.indexOf('-p') >= 0 || a.some(function (x) { return /^--password=/.test(x); })) c.err('WARNING! Using --password via the CLI is insecure. Use --password-stdin.\n'); st.loggedIn = u; var reg = a.filter(function (x, i) { return x[0] !== '-' && a[i - 1] !== '-u' && a[i - 1] !== '-p'; })[0]; c.out((a.indexOf('-u') < 0 ? 'Authenticating with existing credentials...\n' : '') + 'Login Succeeded\n'); void reg; };
    D.logout = function (a, c) { st.loggedIn = null; c.out('Removing login credentials for ' + (a[0] || 'https://index.docker.io/v1/') + '\n'); };
    D.build = function (a, c) { return build(a, c); };
    D.builder = function (a, c) { if (a[0] === 'prune') { c.out('Total:\t0B\n'); return; } return build(a.slice(1), c); };
    D.stop = function (a, c) { var code = 0; a.filter(function (x) { return x[0] !== '-' && !/^\d+$/.test(x); }).forEach(function (ref) { var x = findContainer(ref); if (!x) { code = noSuchContainer(c, ref); return; } if (x.status === 'running' || x.status === 'paused') stopContainer(x, 137 === 0 ? 0 : 0); c.out(ref + '\n'); }); return code; };
    D.kill = function (a, c) { var code = 0; a.filter(function (x) { return x[0] !== '-'; }).forEach(function (ref) { var x = findContainer(ref); if (!x) { code = noSuchContainer(c, ref); return; } if (x.status !== 'running') { c.err('Error response from daemon: cannot kill container: ' + ref + ': container ' + x.id + ' is not running\n'); code = 1; return; } stopContainer(x, 137); c.out(ref + '\n'); }); return code; };
    D.start = function (a, c) { var code = 0; a.filter(function (x) { return x[0] !== '-'; }).forEach(function (ref) { var x = findContainer(ref); if (!x) { code = noSuchContainer(c, ref); return; } if (x.status === 'running') { c.out(ref + '\n'); return; } var e = startContainer(x); if (e) { c.err('Error response from daemon: driver failed programming external connectivity on endpoint ' + x.name + ' (' + hex(64) + '): ' + e + '\nError: failed to start containers: ' + ref + '\n'); code = 1; return; } c.out(ref + '\n'); }); return code; };
    D.restart = function (a, c) { var code = 0; a.filter(function (x) { return x[0] !== '-' && !/^\d+$/.test(x); }).forEach(function (ref) { var x = findContainer(ref); if (!x) { code = noSuchContainer(c, ref); return; } stopContainer(x, 0); x.restartLogs = true; startContainer(x); c.out(ref + '\n'); }); return code; };
    D.pause = function (a, c) { a.forEach(function (ref) { var x = findContainer(ref); if (!x) return noSuchContainer(c, ref); if (x.status === 'running') x.status = 'paused'; c.out(ref + '\n'); }); };
    D.unpause = function (a, c) { a.forEach(function (ref) { var x = findContainer(ref); if (!x) return noSuchContainer(c, ref); if (x.status === 'paused') x.status = 'running'; c.out(ref + '\n'); }); };
    D.rename = function (a, c) { var x = findContainer(a[0]); if (!x) return noSuchContainer(c, a[0]); x.name = a[1]; };
    D.wait = function (a, c) { a.forEach(function (ref) { var x = findContainer(ref); c.out((x ? x.exitCode : 0) + '\n'); }); };
    D.rm = function (a, c) { var force = a.some(function (x) { return /^-.*f/.test(x); }), vols = a.some(function (x) { return /^-.*v/.test(x); }), code = 0; a.filter(function (x) { return x[0] !== '-'; }).forEach(function (ref) { var x = findContainer(ref); if (!x) { code = noSuchContainer(c, ref); return; } if ((x.status === 'running' || x.status === 'paused') && !force) { c.err('Error response from daemon: cannot remove container "/' + x.name + '": container is running: stop the container before removing or force remove\n'); code = 1; return; } removeContainer(x); c.out(ref + '\n'); }); void vols; return code; };
    D.container = function (a, c, ctx) { var sub = a[0], rest = a.slice(1); var map = { ls: D.ps, list: D.ps, rm: D.rm, stop: D.stop, start: D.start, restart: D.restart, kill: D.kill, run: D.run, logs: D.logs, exec: D.exec, inspect: D.inspect, prune: function (aa, cc) { return pruneContainers(aa, cc); }, port: D.port, stats: D.stats, top: D.top, cp: D.cp, pause: D.pause, unpause: D.unpause, rename: D.rename, wait: D.wait }; if (map[sub]) return map[sub](rest, c, ctx); c.err("docker: 'container " + sub + "' is not a docker command.\n"); return 1; };
    D.image = function (a, c, ctx) { var sub = a[0], rest = a.slice(1); if (sub === 'ls' || sub === 'list') return D.images(rest, c); if (sub === 'rm') return D.rmi(rest, c); if (sub === 'prune') return pruneImages(rest, c); if (sub === 'pull') return D.pull(rest, c); if (sub === 'push') return D.push(rest, c); if (sub === 'tag') return D.tag(rest, c); if (sub === 'build') return build(rest, c); if (sub === 'inspect') return D.inspect(rest, c); if (sub === 'history') return D.history(rest, c); c.err("docker: 'image " + sub + "' is not a docker command.\n"); return 1; };
    function confirm(a, c, warning) { if (a.some(function (x) { return /^-.*f|^--force$/.test(x); })) return true; c.out(warning + '\nAre you sure you want to continue? [y/N] '); c.out('\n(simulator: no keyboard input in a script — answered "N". Add -f to skip the prompt.)\n'); return false; }
    function pruneContainers(a, c) { if (!confirm(a, c, 'WARNING! This will remove all stopped containers.')) return; var ids = Object.keys(st.containers).filter(function (k) { return st.containers[k].status === 'exited' || st.containers[k].status === 'created'; }); if (ids.length) { c.out('Deleted Containers:\n'); ids.forEach(function (k) { c.out(k + '\n'); removeContainer(st.containers[k]); }); } c.out('\nTotal reclaimed space: ' + fmtSize(ids.length * 12288) + '\n'); }
    function pruneImages(a, c) { var allF = a.some(function (x) { return /^-.*a|^--all$/.test(x); }); if (!confirm(a, c, allF ? 'WARNING! This will remove all images without at least one container associated to them.' : 'WARNING! This will remove all dangling images.')) return; var used = {}; Object.keys(st.containers).forEach(function (k) { used[st.containers[k].imageId] = 1; }); var rm = Object.keys(st.images).filter(function (k) { var im = st.images[k]; return !used[im.id] && (allF || im.name === '<none>'); }), sz = 0; if (rm.length) { c.out(allF ? 'Deleted Images:\n' : 'Deleted Images:\n'); rm.forEach(function (k) { var im = st.images[k]; c.out((allF && im.name !== '<none>' ? 'untagged: ' + im.name + ':' + im.tag + '\n' : '') + 'deleted: ' + im.id + '\n'); sz += im.size; delete st.images[k]; }); } c.out('\nTotal reclaimed space: ' + fmtSize(sz) + '\n'); }
    D.logs = function (a, c) {
      var p = flagsOf(a, { bool: ['-f', '--follow', '-t', '--timestamps'], val: ['--tail', '-n', '--since', '--until'] }), f = p.f, x = findContainer(p.rest[0]); if (!x) return noSuchContainer(c, p.rest[0]);
      var lines = x.logs.slice(); var tail = val(f, 'tail', 'n'); if (tail && tail !== 'all') lines = lines.slice(-Number(tail));
      lines.forEach(function (l) { c.out((has(f, 't', 'timestamps') ? new Date(l.t).toISOString().replace('Z', '000Z') + ' ' : '') + l.s + '\n'); });
      if (has(f, 'f', 'follow')) c.out('(simulator) --follow would stream new lines until Ctrl+C; showing what is logged so far.\n');
    };
    D.exec = function (a, c) {
      var p = flagsOf(a.slice(0, a.findIndex(function (x, i) { return x[0] !== '-' && a[i - 1] !== '-e' && a[i - 1] !== '-w' && a[i - 1] !== '-u' && a[i - 1] !== '--env' && a[i - 1] !== '--workdir' && a[i - 1] !== '--user'; }) + 1), { bool: ['-i', '-t', '-d', '--detach', '--privileged'], val: ['-e', '--env', '-w', '--workdir', '-u', '--user'] }), name = null, rest = a, k = 0;
      while (k < a.length && a[k][0] === '-') { if (['-e', '--env', '-w', '--workdir', '-u', '--user'].indexOf(a[k]) >= 0) k++; k++; } name = a[k]; rest = a.slice(k + 1);
      var x = findContainer(name); if (!x) return noSuchContainer(c, name); if (x.status !== 'running') { c.err('Error response from daemon: container ' + x.id + ' is not running\n'); return 1; }
      if (!rest.length) { c.err('"docker exec" requires at least 2 arguments.\n'); return 1; } void p;
      return containerExec(x, rest, c, {});
    };
    D.cp = function (a, c) {
      var args = a.filter(function (x) { return x[0] !== '-'; }), src = args[0], dst = args[1], sm = String(src).match(/^([^:./][^:]*):(.*)$/), dm = String(dst).match(/^([^:./][^:]*):(.*)$/);
      if (dm) { var x = findContainer(dm[1]); if (!x) return noSuchContainer(c, dm[1]); var content = sim.files[shell.abs(src)]; if (content === undefined && !(shell.abs(src) in sim.dirs)) { c.err('Error response from daemon: lstat ' + shell.abs(src) + ': no such file or directory\n'); return 1; } x.files[path.resolve('/', dm[2])] = content || ''; c.out('Successfully copied ' + fmtSize(Buffer.byteLength(content || '')) + ' to ' + dm[1] + ':' + dm[2] + '\n'); return 0; }
      if (sm) { var y = findContainer(sm[1]); if (!y) return noSuchContainer(c, sm[1]); var fp = path.resolve('/', sm[2]), data = y.files[fp]; if (data === undefined) { var known = { '/etc/nginx': true, '/app/logs/error.log': '[error] sample error log line\n', '/app/config.json': '{ "port": 3000 }\n' }; data = known[fp] === undefined ? undefined : (known[fp] === true ? '' : known[fp]); } if (data === undefined) { c.err('Error response from daemon: Could not find the file ' + sm[2] + ' in container ' + sm[1] + '\n'); return 1; } var out = shell.abs(dst); if (out in sim.dirs) out = path.join(out, path.basename(fp)); sim.files[out] = data; c.out('Successfully copied ' + fmtSize(Buffer.byteLength(data) + 2048) + ' to ' + dst + '\n'); return 0; }
      c.err('Error: must specify at least one container source\n'); return 1;
    };
    D.inspect = function (a, c) {
      var p = flagsOf(a, { bool: ['-s'], val: ['--format', '-f', '--type'] }), fmt = val(p.f, 'format', 'f'), code = 0, outs = [];
      p.rest.forEach(function (ref) {
        var x = findContainer(ref), obj;
        if (x) { var net = Object.keys(x.networks); obj = { Id: x.id, Created: new Date(x.created).toISOString(), Path: x.cmdText.split(' ')[0], Args: x.cmdText.split(' ').slice(1), State: { Status: x.status, Running: x.status === 'running', Paused: x.status === 'paused', Restarting: false, OOMKilled: false, Dead: false, Pid: x.status === 'running' ? 1000 + Math.floor(Math.random() * 9000) : 0, ExitCode: x.exitCode, Error: '', StartedAt: new Date(x.started).toISOString(), FinishedAt: x.finished ? new Date(x.finished).toISOString() : '0001-01-01T00:00:00Z' }, Image: x.imageId, Name: '/' + x.name, RestartCount: 0, HostConfig: { NetworkMode: net[0] || 'default', PortBindings: x.ports.filter(function (q) { return q.host; }).reduce(function (o, q) { o[q.container + '/' + q.proto] = [{ HostIp: q.ip || '', HostPort: String(q.host) }]; return o; }, {}), RestartPolicy: { Name: x.restart, MaximumRetryCount: 0 }, Binds: x.volumes.map(function (v) { return v.src + ':' + v.dst; }) }, Mounts: x.volumes.map(function (v) { return { Type: /^[./~]/.test(v.src) ? 'bind' : 'volume', Source: v.src, Destination: v.dst, RW: v.mode !== 'ro' }; }), Config: { Hostname: x.hostname, User: x.user, Env: x.env, Cmd: x.cmdText.split(' '), Image: x.image, WorkingDir: x.workdir, Labels: x.labels, ExposedPorts: x.ports.reduce(function (o, q) { o[q.container + '/' + q.proto] = {}; return o; }, {}) }, NetworkSettings: { IPAddress: net[0] ? x.networks[net[0]].ip : '', Ports: x.ports.reduce(function (o, q) { o[q.container + '/' + q.proto] = q.host ? [{ HostIp: '0.0.0.0', HostPort: String(q.host) }] : null; return o; }, {}), Networks: net.reduce(function (o, n) { o[n] = { IPAddress: x.networks[n].ip, Gateway: (st.networks[n].gateway || ''), MacAddress: x.networks[n].mac, Aliases: x.networks[n].aliases, NetworkID: st.networks[n].id }; return o; }, {}) } }; }
        else { var im = findImage(ref); if (im) obj = { Id: im.id, RepoTags: [im.name + ':' + im.tag], RepoDigests: [fullRepo(im.name) + '@' + im.digest], Created: new Date(im.created).toISOString(), Architecture: 'amd64', Os: 'linux', Size: Math.round(im.size), Config: { Env: im.env, Cmd: im.cmd, Entrypoint: im.entrypoint, WorkingDir: im.workdir, User: im.user, ExposedPorts: (im.ports || []).reduce(function (o, q) { o[q + '/tcp'] = {}; return o; }, {}), Labels: im.labels || null, Volumes: (im.volumes || []).length ? im.volumes.reduce(function (o, v) { o[v] = {}; return o; }, {}) : null }, RootFS: { Type: 'layers', Layers: Array.from({ length: im.layers || 3 }, function () { return 'sha256:' + hex(64); }) } };
          else if (st.volumes[ref]) { var v = st.volumes[ref]; obj = { CreatedAt: new Date(v.created).toISOString(), Driver: 'local', Labels: null, Mountpoint: '/var/lib/docker/volumes/' + v.name + '/_data', Name: v.name, Options: null, Scope: 'local' }; }
          else if (st.networks[ref]) { var n = st.networks[ref]; obj = { Name: n.name, Id: n.id, Created: new Date(n.created).toISOString(), Scope: 'local', Driver: n.driver, EnableIPv6: false, IPAM: { Driver: 'default', Config: n.subnet ? [{ Subnet: n.subnet, Gateway: n.gateway }] : [] }, Internal: false, Attachable: false, Containers: Object.keys(n.containers).reduce(function (o, id) { o[id] = { Name: n.containers[id].name, EndpointID: hex(64), MacAddress: '02:42:ac:11:00:02', IPv4Address: n.containers[id].ip + '/16', IPv6Address: '' }; return o; }, {}), Options: {}, Labels: {} }; }
          else { c.err('Error: No such object: ' + ref + '\n'); code = 1; return; } }
        outs.push(obj);
      });
      if (fmt) outs.forEach(function (o) { c.out(fmt.replace(/\{\{\s*json\s+\.([\w.]+)\s*\}\}/g, function (m, pth) { return JSON.stringify(goPath(o, pth)); }).replace(/\{\{\s*\.([\w.]+)\s*\}\}/g, function (m, pth) { var v = goPath(o, pth); return typeof v === 'object' ? JSON.stringify(v) : v === undefined ? '<no value>' : v; }) + '\n'); });
      else c.out(JSON.stringify(outs, null, 4) + '\n'); return code;
    };
    D.port = function (a, c) { var x = findContainer(a[0]); if (!x) return noSuchContainer(c, a[0]); x.ports.filter(function (p) { return p.host; }).forEach(function (p) { c.out(p.container + '/' + p.proto + ' -> ' + (p.ip || '0.0.0.0') + ':' + p.host + '\n'); if (!p.ip) c.out(p.container + '/' + p.proto + ' -> [::]:' + p.host + '\n'); }); };
    D.top = function (a, c) { var x = findContainer(a[0]); if (!x) return noSuchContainer(c, a[0]); c.out(table(['UID', 'PID', 'PPID', 'C', 'STIME', 'TTY', 'TIME', 'CMD'], [['root', '4321', '4300', '0', '12:00', '?', '00:00:00', x.cmdText]])); };
    D.stats = function (a, c) { var list = a.filter(function (x) { return x[0] !== '-'; }).map(findContainer).filter(Boolean); if (!a.filter(function (x) { return x[0] !== '-'; }).length) list = Object.keys(st.containers).map(function (k) { return st.containers[k]; }).filter(function (x) { return x.status === 'running'; }); a.filter(function (x) { return x[0] !== '-'; }).forEach(function (r) { if (!findContainer(r)) noSuchContainer(c, r); }); c.out(table(['CONTAINER ID', 'NAME', 'CPU %', 'MEM USAGE / LIMIT', 'MEM %', 'NET I/O', 'BLOCK I/O', 'PIDS'], list.map(function (x) { var mem = 3 + Math.random() * 60; return [x.id.slice(0, 12), x.name, (Math.random() * 1.5).toFixed(2) + '%', mem.toFixed(1) + 'MiB / 7.667GiB', (mem / 78.5).toFixed(2) + '%', '1.2kB / 0B', '0B / 0B', String(1 + Math.floor(Math.random() * 12))]; }))); if (a.indexOf('--no-stream') < 0) c.out('(simulator) showing one snapshot — real `docker stats` refreshes until Ctrl+C.\n'); };
    D.history = function (a, c) { var im = findImage(a[0]); if (!im) { c.err('Error response from daemon: No such image: ' + a[0] + '\n'); return 1; } var rows = []; for (var i = 0; i < Math.max(3, im.layers || 3); i++) rows.push([i === 0 ? im.id.replace('sha256:', '').slice(0, 12) : '<missing>', ago(im.created), i === 0 ? 'CMD ["node" "index.js"]' : '/bin/sh -c #(nop)  ...', fmtSize(i === 0 ? 0 : 1e6 * (i + 1)), '']); c.out(table(['IMAGE', 'CREATED', 'CREATED BY', 'SIZE', 'COMMENT'], rows)); };
    D.commit = function (a, c) { var args = a.filter(function (x) { return x[0] !== '-'; }), x = findContainer(args[0]); if (!x) return noSuchContainer(c, args[0]); var p = parseRef(args[1] || '<none>:<none>'); var im = addImage(p.name, p.tag, { id: 'sha256:' + hex(64), size: 130e6, created: Date.now(), local: true, cmd: null }); c.out(im.id + '\n'); };
    D.network = function (a, c) {
      var sub = a[0], rest = a.slice(1), names = rest.filter(function (x) { return x[0] !== '-'; });
      if (sub === 'ls' || sub === 'list') { var fmt = null; c.out(table(['NETWORK ID', 'NAME', 'DRIVER', 'SCOPE'], Object.keys(st.networks).map(function (k) { return [st.networks[k].id.slice(0, 12), st.networks[k].name, st.networks[k].driver, st.networks[k].scope]; }))); void fmt; return; }
      if (sub === 'create') { var name = names[names.length - 1], di = rest.indexOf('-d'), driver = di >= 0 ? rest[di + 1] : rest.some(function (x) { return /^--driver=/.test(x); }) ? rest.filter(function (x) { return /^--driver=/.test(x); })[0].slice(9) : 'bridge'; names = rest.filter(function (x, i) { return x[0] !== '-' && rest[i - 1] !== '-d' && rest[i - 1] !== '--driver' && rest[i - 1] !== '--subnet' && rest[i - 1] !== '--gateway'; }); name = names[0]; if (st.networks[name]) { c.err('Error response from daemon: network with name ' + name + ' already exists\n'); return 1; } var nn = st.networks[name] = { id: nid(), name: name, driver: driver, scope: 'local', containers: {}, created: Date.now() }; nn.subnet = '172.' + (18 + (st.subnet++ - 17)) + '.0.0/16'; nn.gateway = nn.subnet.replace('0.0/16', '0.1'); nn.ips = 1; c.out(nn.id + '\n'); return; }
      if (sub === 'rm' || sub === 'remove') { var code = 0; names.forEach(function (n) { var x = st.networks[n]; if (!x) { c.err('Error response from daemon: network ' + n + ' not found\n'); code = 1; return; } if (/^(bridge|host|none)$/.test(n)) { c.err('Error response from daemon: ' + n + ' is a pre-defined network and cannot be removed\n'); code = 1; return; } if (Object.keys(x.containers).length) { c.err('Error response from daemon: error while removing network: network ' + n + ' id ' + x.id + ' has active endpoints\n'); code = 1; return; } delete st.networks[n]; c.out(n + '\n'); }); return code; }
      if (sub === 'inspect') return D.inspect(rest, c);
      if (sub === 'connect') { var ci = findContainer(names[1]), nn2 = st.networks[names[0]]; if (!nn2) { c.err('Error response from daemon: network ' + names[0] + ' not found\n'); return 1; } if (!ci) return noSuchContainer(c, names[1]); if (ci.networks[names[0]]) { c.err('Error response from daemon: endpoint with name ' + ci.name + ' already exists in network ' + names[0] + '\n'); return 1; } connect(ci, names[0]); return; }
      if (sub === 'disconnect') { var cd = findContainer(names[1]); if (!cd) return noSuchContainer(c, names[1]); if (!cd.networks[names[0]]) { c.err('Error response from daemon: container ' + cd.id + ' is not connected to network ' + names[0] + '\n'); return 1; } disconnect(cd, names[0]); return; }
      if (sub === 'prune') { if (!confirm(rest, c, 'WARNING! This will remove all custom networks not used by at least one container.')) return; var rm = Object.keys(st.networks).filter(function (k) { return !/^(bridge|host|none)$/.test(k) && !Object.keys(st.networks[k].containers).length; }); if (rm.length) { c.out('Deleted Networks:\n'); rm.forEach(function (k) { c.out(k + '\n'); delete st.networks[k]; }); } return; }
      c.err("docker: 'network " + sub + "' is not a docker command.\n"); return 1;
    };
    D.volume = function (a, c) {
      var sub = a[0], rest = a.slice(1), names = rest.filter(function (x) { return x[0] !== '-'; });
      if (sub === 'ls' || sub === 'list') { var q = rest.indexOf('-q') >= 0; var vs = Object.keys(st.volumes); if (q) { vs.forEach(function (k) { c.out(k + '\n'); }); return; } c.out(table(['DRIVER', 'VOLUME NAME'], vs.map(function (k) { return ['local', k]; }))); return; }
      if (sub === 'create') { var n = names[0] || hex(64); if (st.volumes[n]) { c.out(n + '\n'); return; } st.volumes[n] = { name: n, created: Date.now(), driver: 'local' }; c.out(n + '\n'); return; }
      if (sub === 'rm' || sub === 'remove') { var code = 0; names.forEach(function (nm) { if (!st.volumes[nm]) { c.err('Error response from daemon: get ' + nm + ': no such volume\n'); code = 1; return; } var inUse = Object.keys(st.containers).filter(function (k) { return st.containers[k].volumes.some(function (v) { return v.src === nm; }); })[0]; if (inUse) { c.err('Error response from daemon: remove ' + nm + ': volume is in use - [' + inUse + ']\n'); code = 1; return; } delete st.volumes[nm]; c.out(nm + '\n'); }); return code; }
      if (sub === 'inspect') return D.inspect(rest, c);
      if (sub === 'prune') { if (!confirm(rest, c, 'WARNING! This will remove anonymous local volumes not used by at least one container.')) return; var used = {}; Object.keys(st.containers).forEach(function (k) { st.containers[k].volumes.forEach(function (v) { used[v.src] = 1; }); }); var rm = Object.keys(st.volumes).filter(function (k) { return !used[k]; }); if (rm.length) { c.out('Deleted Volumes:\n'); rm.forEach(function (k) { c.out(k + '\n'); delete st.volumes[k]; }); } c.out('\nTotal reclaimed space: ' + fmtSize(rm.length * 4096) + '\n'); return; }
      c.err("docker: 'volume " + sub + "' is not a docker command.\n"); return 1;
    };
    D.system = function (a, c) {
      var sub = a[0], rest = a.slice(1);
      if (sub === 'df') { var imgs = Object.keys(st.images).map(function (k) { return st.images[k]; }), conts = Object.keys(st.containers).map(function (k) { return st.containers[k]; }), active = conts.filter(function (x) { return x.status === 'running'; }).length, isz = imgs.reduce(function (s, x) { return s + x.size; }, 0); c.out(table(['TYPE', 'TOTAL', 'ACTIVE', 'SIZE', 'RECLAIMABLE'], [['Images', imgs.length, new Set(conts.map(function (x) { return x.imageId; })).size, fmtSize(isz), fmtSize(isz * 0.4) + ' (40%)'], ['Containers', conts.length, active, fmtSize(conts.length * 2e4), fmtSize(0) + ' (0%)'], ['Local Volumes', Object.keys(st.volumes).length, Object.keys(st.volumes).length, fmtSize(Object.keys(st.volumes).length * 5e7), '0B (0%)'], ['Build Cache', 0, 0, '0B', '0B']])); return; }
      if (sub === 'prune') { var allF = rest.some(function (x) { return /^-.*a|^--all$/.test(x); }), vols = rest.indexOf('--volumes') >= 0; if (!confirm(rest, c, 'WARNING! This will remove:\n  - all stopped containers\n  - all networks not used by at least one container' + (vols ? '\n  - all anonymous volumes not used by at least one container' : '') + '\n  - all ' + (allF ? 'images without at least one container associated to them' : 'dangling images') + '\n  - unused build cache\n')) return; pruneContainers(['-f'], { out: function () { }, err: function () { } }); var before = Object.keys(st.images).length; pruneImages(allF ? ['-af'] : ['-f'], { out: function () { }, err: function () { } }); c.out('Deleted Containers:\nDeleted Images:\nDeleted build cache objects:\n\nTotal reclaimed space: ' + fmtSize(Math.max(0, before - Object.keys(st.images).length) * 8e7) + '\n'); if (vols) Object.keys(st.volumes).forEach(function (k) { if (!Object.keys(st.containers).some(function (id) { return st.containers[id].volumes.some(function (v) { return v.src === k; }); })) delete st.volumes[k]; }); return; }
      if (sub === 'info') return D.info(rest, c);
      c.err("docker: 'system " + sub + "' is not a docker command.\n"); return 1;
    };
    D.info = function (a, c) { c.out('Client:\n Version:    26.1.4\n Context:    default\n\nServer:\n Containers: ' + Object.keys(st.containers).length + '\n  Running: ' + Object.keys(st.containers).filter(function (k) { return st.containers[k].status === 'running'; }).length + '\n Images: ' + Object.keys(st.images).length + '\n Server Version: 26.1.4\n Storage Driver: overlay2\n Operating System: Docker Desktop (simulated)\n OSType: linux\n Architecture: x86_64\n CPUs: 4\n Total Memory: 7.667GiB\n'); };
    D.version = function (a, c) { c.out('Client:\n Version:           26.1.4\n API version:       1.45\n Go version:        go1.21.11\n OS/Arch:           linux/amd64\n\nServer: Docker Engine - Community (simulated)\n Engine:\n  Version:          26.1.4\n  API version:      1.45 (minimum version 1.24)\n'); };
    D['--version'] = D['-v'] = function (a, c) { c.out('Docker version 26.1.4, build 5650f9b\n'); };
    D.scout = function (a, c) {
      var sub = a[0], ref = a.filter(function (x) { return x[0] !== '-'; })[1] || 'myapp:latest', im = findImage(ref); if (!im) { c.err('ERROR: image ' + ref + ' not found locally\n'); return 1; }
      if (sub === 'quickview') { c.out('    i Base image was auto-detected. To get more accurate results, build images with max-mode provenance attestations.\n\n  Target             │  ' + ref + '   │    0C     2H     5M     8L   \n    digest           │  ' + im.id.replace('sha256:', '').slice(0, 12) + '                       │                              \n  Base image         │  ' + (im.base || 'node') + ':20-alpine                     │    0C     0H     1M     3L   \n\nWhat\'s next:\n    View vulnerabilities → docker scout cves ' + ref + '\n'); return; }
      if (sub === 'cves') { c.out('    ✓ Provenance obtained from attestation\n    ✓ SBOM obtained from attestation, 251 packages indexed\n    ✗ Detected 15 vulnerable packages with a total of 20 vulnerabilities\n\n## Overview\n\n                    │       Analyzed Image\n────────────────────┼──────────────────────────────\n  Target            │  ' + ref + '\n    vulnerabilities │    0C     2H     5M     8L\n    size            │  ' + fmtSize(im.size) + '\n    packages        │  251\n\n## Packages and Vulnerabilities\n\n   0C     1H     0M     0L  semver 7.3.5\npkg:npm/semver@7.3.5\n    ✗ HIGH CVE-2022-25883 [Inefficient Regular Expression Complexity]\n      Affected range : <7.5.2\n      Fixed version  : 7.5.2\n\n(simulated report — sample data)\n'); return; }
      if (sub === 'compare') { c.out('    i New image: ' + ref + '\n\n  ## Overview\n                    │        Analyzed Image         │       Comparison Image\n  ──────────────────┼───────────────────────────────┼─────────────────────────────\n    Target          │  ' + ref + '  │  ' + a[a.length - 1] + '\n      vulnerabilities │    0C     2H     5M     8L │    0C     4H     7M     9L\n\n(simulated comparison — sample data)\n'); return; }
      c.out('(simulator) docker scout ' + (sub || '') + ' — supported: quickview, cves, compare.\n');
    };
    D.top_ = null;

    /* ── compose ── */
    function findComposeFile(a) { var fi = a.indexOf('-f'); if (fi >= 0) return path.resolve(shell.cwd, a[fi + 1]); var names = ['compose.yaml', 'compose.yml', 'docker-compose.yaml', 'docker-compose.yml']; for (var i = 0; i < names.length; i++) { var p = path.resolve(shell.cwd, names[i]); if (sim.files[p] !== undefined) return p; } return null; }
    function projectName(a, file) { var pi = a.indexOf('-p'); if (pi >= 0) return a[pi + 1]; return path.basename(path.dirname(file)).toLowerCase().replace(/[^a-z0-9_-]/g, ''); }
    function loadCompose(a, c) {
      var file = findComposeFile(a); if (!file) { c.err('no configuration file provided: not found\n'); return null; }
      var doc; try { doc = sim.yaml.parse(sim.files[file]); } catch (e) { c.err('yaml: ' + e.message + '\n'); return null; }
      if (!doc || typeof doc !== 'object' || !doc.services || typeof doc.services !== 'object') { c.err('services must be a mapping\n'); return null; }
      return { doc: doc, file: file, project: projectName(a, file) };
    }
    function envList(e) { if (!e) return []; if (Array.isArray(e)) return e.map(String); return Object.keys(e).map(function (k) { return k + '=' + (e[k] === null ? '' : e[k]); }); }
    function order(services) { var out = [], seen = {}; (function visit(n, stack) { if (seen[n]) return; if (stack.indexOf(n) >= 0) throw new Error('dependency cycle detected: ' + stack.concat(n).join(' -> ')); var s = services[n]; var deps = s && s.depends_on ? (Array.isArray(s.depends_on) ? s.depends_on : Object.keys(s.depends_on)) : []; deps.forEach(function (d) { if (!services[d]) throw new Error('service "' + n + '" depends on undefined service "' + d + '"'); visit(d, stack.concat(n)); }); seen[n] = 1; out.push(n); })(null, []); return out; }
    function compose(a, c) {
      var flags = []; var argv = a.slice(); var profiles = []; while (argv.length && argv[0][0] === '-') { var fl = argv.shift(); if (fl === '-f' || fl === '-p' || fl === '--profile' || fl === '--project-name' || fl === '--env-file') { var v = argv.shift(); flags.push(fl, v); if (fl === '--profile') profiles.push(v); } else flags.push(fl); }
      var sub = argv.shift(); if (sub === 'version') { c.out('Docker Compose version v2.27.1\n'); return; }
      if (!sub) { c.out('Usage:  docker compose [OPTIONS] COMMAND\n\nCommands: build, config, down, exec, logs, ps, pull, restart, start, stop, up\n'); return; }
      var cp = loadCompose(flags, c); if (!cp) return 1; var doc = cp.doc, proj = cp.project, services = doc.services, sn = Object.keys(services);
      var svcArgs = argv.filter(function (x) { return x[0] !== '-'; }), detach = argv.some(function (x) { return x === '-d' || x === '--detach'; });
      function active(name) { var s = services[name], pf = s.profiles ? [].concat(s.profiles) : []; return !pf.length || pf.some(function (p) { return profiles.indexOf(p) >= 0; }) || svcArgs.indexOf(name) >= 0; }
      function cname(s, n) { return (services[s].container_name) || proj + '-' + s + '-' + (n || 1); }
      function projContainers() { return Object.keys(st.containers).map(function (k) { return st.containers[k]; }).filter(function (x) { return x.labels['com.docker.compose.project'] === proj; }); }
      var netName = proj + '_default';
      if (sub === 'config') { var norm = JSON.parse(JSON.stringify(doc)); if (norm.version) delete norm.version; norm.name = proj; c.out(sim.yaml.stringify(norm)); return; }
      if (sub === 'up') {
        var ord; try { ord = orderServices(services, svcArgs); } catch (e) { c.err(e.message + '\n'); return 1; } ord = ord.filter(active);
        var build_ = argv.indexOf('--build') >= 0, lines = [], t = 0;
        var created = [];
        if (!st.networks[netName]) { st.networks[netName] = { id: nid(), name: netName, driver: 'bridge', scope: 'local', containers: {}, created: Date.now(), subnet: '172.' + (18 + (st.subnet++ - 17)) + '.0.0/16', ips: 1 }; st.networks[netName].gateway = st.networks[netName].subnet.replace('0.0/16', '0.1'); lines.push([' ✔ Network ' + netName, 'Created', 0.1]); }
        Object.keys(doc.volumes || {}).forEach(function (v) { var vn = proj + '_' + v; if (!st.volumes[vn]) { st.volumes[vn] = { name: vn, created: Date.now(), driver: 'local' }; lines.push([' ✔ Volume "' + vn + '"', 'Created', 0]); } });
        var buildOut = [];
        for (var i = 0; i < ord.length; i++) {
          var name = ord[i], s = services[name], cn = cname(name), existing = findContainer(cn), im = null;
          if (s.build || build_) { if (s.build) { var bctx = typeof s.build === 'string' ? s.build : s.build.context || '.', df = typeof s.build === 'object' && s.build.dockerfile ? s.build.dockerfile : 'Dockerfile', imgName = s.image || proj + '-' + name; var hold = shell.cwd; shell.cwd = path.resolve(path.dirname(cp.file), bctx); var buf = { out: function (x) { buildOut.push(x); }, err: function (x) { buildOut.push(x); } }; var rc = build(['-t', imgName, '-f', df, '.'], buf); shell.cwd = hold; if (rc) { c.err(buildOut.join('') + 'failed to solve: build failed for service "' + name + '"\n'); return 1; } im = findImage(imgName); } }
          if (!im) { var ref = s.image; if (!ref) { c.err('service "' + name + '" has neither an image nor a build context specified: invalid compose project\n'); return 1; } im = findImage(ref) || (st.script && !canPull(parseRef(ref).name) && ensureImage(ref, null, 'compose')); if (!im) { if (!canPull(parseRef(ref).name)) { c.err(' ✘ ' + name + ' Error pull access denied for ' + parseRef(ref).name + ', repository does not exist or may require \'docker login\'\nError response from daemon: pull access denied for ' + parseRef(ref).name + '\n'); return 1; } var p = parseRef(ref); im = addImage(p.name, p.tag); lines.push([' ✔ ' + name + ' Pulled', '', 1.4]); } }
          if (existing && existing.imageId === im.id && !build_) { if (existing.status !== 'running') { startContainer(existing); lines.push([' ✔ Container ' + cn, 'Started', 0.3]); } else lines.push([' ✔ Container ' + cn, 'Running', 0]); continue; }
          if (existing) { removeContainer(existing); }
          var ports = [].concat(s.ports || []).map(function (p2) { return parsePort(typeof p2 === 'object' ? (p2.published || '') + ':' + p2.target : String(p2)); }).filter(Boolean); ports.forEach(function (p2) { if (p2.host === undefined) p2.host = st.nextPort++; });
          var vols = [].concat(s.volumes || []).map(function (v) { var pr = String(typeof v === 'object' ? v.source + ':' + v.target : v).split(':'); var src = pr[0]; if (!/^[./~]/.test(src) && doc.volumes && src in doc.volumes) src = proj + '_' + src; return { src: src, dst: pr[1] || pr[0], mode: pr[2] || 'rw' }; });
          var cmd = s.command ? (Array.isArray(s.command) ? s.command : String(s.command).split(/\s+/)) : null;
          var nets = [netName]; var cont = makeContainer({ image: im, name: cn, cmd: cmd, ports: ports, env: envList(s.environment), volumes: vols, networks: nets, restart: s.restart, workdir: s.working_dir, user: s.user, aliases: [name], hostname: s.hostname, labels: { 'com.docker.compose.project': proj, 'com.docker.compose.service': name } });
          var e = startContainer(cont); if (e) { removeContainer(cont); c.err(' ✘ Container ' + cn + ' Error response from daemon: driver failed programming external connectivity on endpoint ' + cn + ': ' + e + '\n'); return 1; }
          if (s.healthcheck) cont.health = 'healthy'; lines.push([' ✔ Container ' + cn, 'Started', 0.4 + i * 0.1]); created.push(cont);
        }
        if (buildOut.length) c.err(buildOut.join(''));
        var w = Math.max.apply(null, lines.map(function (l) { return l[0].length; })) + 2; c.err('[+] Running ' + lines.length + '/' + lines.length + '\n' + lines.map(function (l) { return l[0].padEnd(w) + String(l[1]).padEnd(9) + (l[2] ? l[2].toFixed(1) + 's' : '0.0s'); }).join('\n') + '\n');
        if (!detach) { c.out('Attaching to ' + created.map(function (x) { return x.name; }).join(', ') + '\n'); created.forEach(function (x) { x.logs.forEach(function (l) { c.out(x.name.padEnd(Math.max.apply(null, created.map(function (y) { return y.name.length; }))) + '  | ' + l.s + '\n'); }); }); c.out('(simulator) attached mode would stream logs until Ctrl+C — use `up -d` to run in the background.\n'); }
        void t; return;
      }
      if (sub === 'down') {
        var lines2 = [], vflag = argv.some(function (x) { return x === '-v' || x === '--volumes'; }), cs = projContainers();
        cs.sort(function (x, y) { return y.created - x.created; }).forEach(function (x) { removeContainer(x); lines2.push([' ✔ Container ' + x.name, 'Removed', 0.3]); });
        if (st.networks[netName]) { delete st.networks[netName]; lines2.push([' ✔ Network ' + netName, 'Removed', 0.2]); }
        if (vflag) Object.keys(doc.volumes || {}).forEach(function (v) { var vn = proj + '_' + v; if (st.volumes[vn]) { delete st.volumes[vn]; lines2.push([' ✔ Volume ' + vn, 'Removed', 0]); } });
        if (!lines2.length) { return; } var w2 = Math.max.apply(null, lines2.map(function (l) { return l[0].length; })) + 2; c.err('[+] Running ' + lines2.length + '/' + lines2.length + '\n' + lines2.map(function (l) { return l[0].padEnd(w2) + l[1].padEnd(9) + l[2].toFixed(1) + 's'; }).join('\n') + '\n'); return;
      }
      if (sub === 'ps') { var list = projContainers().filter(function (x) { return argv.indexOf('-a') >= 0 || x.status === 'running'; }); c.out(table(['NAME', 'IMAGE', 'COMMAND', 'SERVICE', 'CREATED', 'STATUS', 'PORTS'], list.map(function (x) { return [x.name, x.image, cmdShort(x), x.labels['com.docker.compose.service'], ago(x.created), statusStr(x), portsStr(x)]; }))); return; }
      if (sub === 'logs') { var target = svcArgs.length ? projContainers().filter(function (x) { return svcArgs.indexOf(x.labels['com.docker.compose.service']) >= 0; }) : projContainers(); var wd = Math.max.apply(null, target.map(function (x) { return x.name.length; }).concat([0])); target.forEach(function (x) { x.logs.forEach(function (l) { c.out(x.name.padEnd(wd) + '  | ' + l.s + '\n'); }); }); if (argv.some(function (x) { return x === '-f' || x === '--follow'; })) c.out('(simulator) --follow would stream new output until Ctrl+C.\n'); return; }
      if (sub === 'exec' || sub === 'run') { var svc = argv.filter(function (x) { return x[0] !== '-'; })[0], x2 = findContainer(cname(svc)); if (!x2 || x2.status !== 'running') { c.err('service "' + svc + '" is not running\n'); return 1; } var rest2 = argv.slice(argv.indexOf(svc) + 1); return D.exec([x2.name].concat(rest2), c); }
      if (sub === 'build') { var code2 = 0; sn.filter(function (n) { return services[n].build && (!svcArgs.length || svcArgs.indexOf(n) >= 0); }).forEach(function (n) { var s2 = services[n], bctx2 = typeof s2.build === 'string' ? s2.build : s2.build.context || '.', hold2 = shell.cwd; shell.cwd = path.resolve(path.dirname(cp.file), bctx2); code2 = build(['-t', s2.image || proj + '-' + n, '.'], c) || code2; shell.cwd = hold2; }); return code2; }
      if (sub === 'stop' || sub === 'start' || sub === 'restart' || sub === 'kill') { var tg = svcArgs.length ? projContainers().filter(function (x) { return svcArgs.indexOf(x.labels['com.docker.compose.service']) >= 0; }) : projContainers(), ls = []; tg.forEach(function (x) { if (sub === 'stop' || sub === 'kill') { stopContainer(x, sub === 'kill' ? 137 : 0); ls.push(' ✔ Container ' + x.name + '  ' + (sub === 'stop' ? 'Stopped' : 'Killed')); } else { if (sub === 'restart') stopContainer(x, 0); startContainer(x); ls.push(' ✔ Container ' + x.name + '  ' + (sub === 'restart' ? 'Started' : 'Started')); } }); if (ls.length) c.err('[+] Running ' + ls.length + '/' + ls.length + '\n' + ls.join('\n') + '\n'); return; }
      if (sub === 'pull') { var pl = sn.filter(function (n) { return services[n].image; }); pl.forEach(function (n) { var p3 = parseRef(services[n].image); if (canPull(p3.name)) addImage(p3.name, p3.tag); }); c.err('[+] Pulling ' + pl.length + '/' + pl.length + '\n' + pl.map(function (n) { return ' ✔ ' + n + ' Pulled'; }).join('\n') + '\n'); return; }
      if (sub === 'images') { c.out(table(['CONTAINER', 'REPOSITORY', 'TAG', 'IMAGE ID', 'SIZE'], projContainers().map(function (x) { var im2 = findImage(x.image) || {}; return [x.name, x.image.split(':')[0], x.image.split(':')[1], (x.imageId || '').replace('sha256:', '').slice(0, 12), fmtSize(im2.size || 0)]; }))); return; }
      if (sub === 'top') { projContainers().forEach(function (x) { c.out(x.name + '\nUID    PID   PPID  C  STIME  TTY  TIME      CMD\nroot   4321  4300  0  12:00  ?    00:00:00  ' + x.cmdText + '\n'); }); return; }
      if (sub === 'rm') { projContainers().filter(function (x) { return x.status !== 'running'; }).forEach(function (x) { removeContainer(x); c.out('Going to remove ' + x.name + '\n'); }); return; }
      c.err("docker: 'compose " + sub + "' is not a docker compose command.\n"); return 1;
    }
    function orderServices(services, only) { var out = [], seen = {}; function visit(n, stack) { if (seen[n]) return; if (stack.indexOf(n) >= 0) throw new Error('dependency cycle detected: ' + stack.concat(n).join(' -> ')); var s = services[n]; if (!s) throw new Error('no such service: ' + n); var deps = s.depends_on ? (Array.isArray(s.depends_on) ? s.depends_on : Object.keys(s.depends_on)) : []; deps.forEach(function (d) { if (!services[d]) throw new Error('service "' + n + '" depends on undefined service "' + d + '": invalid compose project'); visit(d, stack.concat(n)); }); seen[n] = 1; out.push(n); } (only.length ? only : Object.keys(services)).forEach(function (n) { visit(n, []); }); return out; }
    D.compose = compose;

    async function docker(args, c) {
      var argv = args.slice(); while (argv.length && /^(-D|--debug|--config|-H|--host|-c|--context)$/.test(argv[0])) { var fl = argv.shift(); if (fl !== '-D' && fl !== '--debug') argv.shift(); }
      var sub = argv.shift(); if (!sub) { c.out('Usage:  docker [OPTIONS] COMMAND\n\nCommon Commands:\n  run         Create and run a new container from an image\n  exec        Execute a command in a running container\n  ps          List containers\n  build       Build an image from a Dockerfile\n  pull        Download an image from a registry\n  push        Upload an image to a registry\n  images      List images\n  login       Log in to a registry\n  logs        Fetch the logs of a container\n\nRun \'docker COMMAND --help\' for more information on a command.\n'); return 0; }
      var key = sub.replace(/-/g, '_'); if (argv.indexOf('--help') >= 0 && sub !== 'run') { c.out('Usage:  docker ' + sub + ' [OPTIONS]\n\n(simulator) see the Docker docs for the full option list.\n'); return 0; }
      if (D[sub] || D[key]) return (D[sub] || D[key])(argv, c);
      c.err("docker: '" + sub + "' is not a docker command.\nSee 'docker --help'\n"); return 1;
    }
    return { docker: docker, compose: function (a, c) { return compose(a, c); }, state: st, addImage: addImage, makeContainer: makeContainer, startContainer: startContainer, findImage: findImage, findContainer: findContainer, parseDockerfile: parseDockerfile, table: table, doCurl: doCurl, connect: connect };
  }
  sim.createDocker = create;

  function looksLikeDockerfile(script) {
    var firstLine = String(script).split('\n').map(function (l) { return l.trim(); }).filter(function (l) { return l && l[0] !== '#'; })[0] || '';
    return /^(FROM|ARG|COPY|ADD|RUN|WORKDIR|ENV|CMD|EXPOSE|ENTRYPOINT|USER|LABEL|VOLUME|HEALTHCHECK)\s+\S/.test(firstLine) && !/^\s*(\$\s*)?docker\b/m.test(script);
  }
  // Files a lesson Dockerfile typically COPYs, so the simulated build has something to copy.
  function seedBuildContext(wd, dockerfile) {
    var put = function (p, c) { var full = wd + '/' + p; if (sim.files[full] === undefined) sim.files[full] = c; };
    put('package.json', '{ "name": "myapp", "version": "1.0.0", "main": "server.js", "scripts": { "start": "node server.js", "build": "echo build" }, "dependencies": {} }\n');
    put('package-lock.json', '{}\n'); put('server.js', "require('http').createServer((q, r) => r.end('ok')).listen(3000);\n"); put('index.js', "console.log('hello');\n");
    put('requirements.txt', 'flask==3.0.0\n'); put('app.py', "print('hello')\n"); put('nginx.conf', 'server { listen 80; }\n');
    String(dockerfile).replace(/^\s*(?:COPY|ADD)\s+(?:--\S+\s+)*([^\n]+)$/gim, function (m, args) {
      var parts = args.trim().split(/\s+/);
      parts.slice(0, -1).forEach(function (p) { if (/^[\w.\/-]+$/.test(p) && p !== '.' && p !== './') { if (/\/$/.test(p)) { sim.dirs[wd + '/' + p.replace(/\/$/, '')] = 1; put(p + 'index.js', ''); } else put(p, ''); } });
      return m;
    });
  }
  var SAMPLE_DOCKERFILE = '# Build stage\nFROM node:20-alpine AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\n\n# Runtime stage\nFROM node:20-alpine\nWORKDIR /app\nCOPY --from=build /app .\nEXPOSE 3000\nUSER node\nCMD ["node", "src/index.js"]\n';
  var SAMPLE_COMPOSE = 'services:\n  api:\n    build: .\n    ports:\n      - "3000:3000"\n    environment:\n      - DATABASE_URL=postgres://user:pass@db:5432/app\n    depends_on:\n      - db\n      - cache\n  db:\n    image: postgres:16-alpine\n    environment:\n      POSTGRES_USER: user\n      POSTGRES_PASSWORD: pass\n      POSTGRES_DB: app\n    volumes:\n      - pgdata:/var/lib/postgresql/data\n  cache:\n    image: redis:7-alpine\nvolumes:\n  pgdata:\n';

  sim.engines.docker = function () {
    var home = '/home/user', shell = new sim.Shell({ cwd: home + '/myapp', home: home });
    sim.dirs[home] = 1; sim.dirs[home + '/myapp'] = 1;
    var eng = create(shell);
    shell.commands.docker = function (a, c) { if (a[0] === 'compose') return eng.compose(a.slice(1), c); return eng.docker(a.slice(), c); };
    shell.commands['docker-compose'] = function (a, c) { return eng.compose(a.slice(), c); };
    shell.commands.curl = function (a, c) { return eng.doCurl(a, c, true); };
    shell.docker = eng;
    return {
      scriptMode: function (on) { eng.state.script = !!on; },
      title: 'Docker Simulator', sub: 'docker 26 · compose v2 · in-memory daemon', shell: shell,
      banner: 'A simulated Docker daemon — images, containers, networks and volumes live in memory for this run (no real containers start).\nTry: docker run -d -p 8080:80 --name web nginx:alpine · docker ps · docker logs web · curl localhost:8080 · docker compose up -d',
      placeholder: 'docker ps  ·  docker run -d -p 8080:80 nginx:alpine',
      parseScript: function (script) {
        if (!looksLikeDockerfile(script)) return sim.scriptToCommands(script);
        return [{ comment: '# Dockerfile detected \u2014 building it as myapp:latest' }, { line: 'docker build -t myapp:latest .' }, { line: 'docker images' }];
      },
      prepare: async function (script) {
        var notes = [], st = eng.state, wd = shell.cwd;
        var firstLine = script.split('\n').map(function (l) { return l.trim(); }).filter(function (l) { return l && l[0] !== '#'; })[0] || '';
        var isDockerfile = looksLikeDockerfile(script); void firstLine;
        var declares = function (re) { return re.test(script); };
        if (isDockerfile) { var dfText = script.replace(/^\s*docker.*$/gm, ''); if (!/^\s*FROM\s/m.test(dfText)) dfText = 'FROM node:20-alpine\nWORKDIR /app\n' + dfText; sim.files[wd + '/Dockerfile'] = dfText; seedBuildContext(wd, script); notes.push('Detected a Dockerfile \u2014 building it as myapp:latest.'); return 'ℹ️ ' + notes.join(' '); }
        if (/\bdocker(-| )compose\b|\bdocker compose\b/.test(script) && !declares(/docker-compose\.ya?ml|compose\.ya?ml/) && !sim.files[wd + '/docker-compose.yml'] && !sim.files[wd + '/compose.yaml']) { sim.files[wd + '/docker-compose.yml'] = SAMPLE_COMPOSE; notes.push('Added a sample docker-compose.yml (api + postgres + redis).'); }
        if (/\bdocker build\b|\bcompose\b.*\b(up|build)\b/.test(script) && sim.files[wd + '/Dockerfile'] === undefined) { sim.files[wd + '/Dockerfile'] = SAMPLE_DOCKERFILE; sim.files[wd + '/package.json'] = '{ "name": "myapp", "version": "1.0.0", "scripts": { "start": "node src/index.js" } }\n'; sim.dirs[wd + '/src'] = 1; sim.files[wd + '/src/index.js'] = 'console.log("hello from myapp");\n'; notes.push('Added a sample Dockerfile and app files so the build has something to work on.'); }
        // pre-existing containers/images referenced but never created in the script
        var created = {}; script.replace(/--name[= ]+(\S+)/g, function (m, n) { created[n] = 1; return m; }); script.replace(/docker (?:container )?(?:rename)\s+\S+\s+(\S+)/g, function (m, n) { created[n] = 1; return m; });
        var refd = {}; script.replace(/docker (?:container )?(?:start|stop|restart|kill|rm(?: -f)?|logs(?: (?:--tail \d+|--follow|--timestamps|-f))?|exec(?: -it| -i| -t)?|stats|port|inspect|cp [^\s]+|pause|unpause|top)\s+(?:-\w+\s+)*([a-zA-Z][\w.-]*)/g, function (m, n) { if (!/^(-|sh|bash|node|ls|cat)$/.test(n) && !/^(node|redis|postgres|nginx)$/.test(n) || /^(my-|app|api|web|db|cache)/.test(n)) refd[n] = 1; return m; });
        script.replace(/docker cp [^\s]+ ([a-zA-Z][\w.-]*):/g, function (m, n) { refd[n] = 1; return m; }); script.replace(/docker cp ([a-zA-Z][\w.-]*):/g, function (m, n) { refd[n] = 1; return m; });
        script.replace(/docker network (?:connect|disconnect) \S+ ([a-zA-Z][\w.-]*)/g, function (m, n) { refd[n] = 1; return m; });
        var seeded = [];
        for (var n in refd) { if (created[n] || eng.findContainer(n)) continue; if (/^(ps|images|run|build|pull|push|login|logout|network|volume|system|image|container|compose|tag|scout|info|version)$/.test(n)) continue; var isNginx = /nginx|web|proxy/.test(n), im = isNginx ? eng.addImage('nginx', 'alpine') : eng.findImage('myapp:latest') || eng.addImage('myapp', 'latest', { local: true, cmd: ['node', 'src/index.js'], ports: [3000], size: 178e6, base: 'node' }); var cont = eng.makeContainer({ image: im, name: n, ports: isNginx ? [{ host: 8080, container: 80, proto: 'tcp' }] : [{ host: 3000, container: 3000, proto: 'tcp' }] }); eng.startContainer(cont); if (!isNginx) { cont.logs = [{ t: Date.now(), s: '> myapp@1.0.0 start' }, { t: Date.now(), s: '> node src/index.js' }, { t: Date.now(), s: 'Server listening on port 3000' }]; cont.files['/app/logs/error.log'] = '[error] sample error log line\n'; } seeded.push(n); }
        var imgRefs = {}; script.replace(/\b(myapp|myusername\/myapp|ghcr\.io\/myusername\/myapp|registry\.example\.com\/team\/myapp)(?::([\w.-]+))?/g, function (m, nm, tg) { imgRefs[nm + ':' + (tg || 'latest')] = [nm, tg || 'latest']; return m; });
        var built = {}; script.replace(/-t\s+(\S+)/g, function (m, t) { built[t] = 1; return m; });
        Object.keys(imgRefs).forEach(function (k) { if (built[k] || eng.findImage(k)) return; if (/docker (tag|push|scout|rmi|inspect|history|run)\b[^\n]*/.test(script)) eng.addImage(imgRefs[k][0], imgRefs[k][1], { local: true, size: 178e6, ports: [3000], cmd: ['node', 'src/index.js'], base: 'node' }); });
        if (/docker (?:run|pull)[^\n]*node:18-alpine|docker rmi node:18-alpine|rmi node/.test(script)) eng.addImage('node', '18-alpine');
        script.replace(/docker (?:image )?(?:inspect|history|rmi|save|scout \w+)\s+(?:-\S+\s+)*([\w./:-]+)/g, function (m, ref) { if (!eng.findImage(ref) && !built[ref] && /^(node|nginx|redis|postgres|alpine|ubuntu|python|mysql|mongo|busybox|httpd)(:|$)/.test(ref)) eng.addImage(ref.split(':')[0], ref.split(':')[1] || 'latest'); return m; });
        var netsMade = {}; script.replace(/docker network create (?:-\S+\s+\S+\s+)*([\w.-]+)/g, function (m, n) { netsMade[n] = 1; return m; });
        script.replace(/(?:--network[= ]|--net[= ]|docker network (?:connect|disconnect|inspect|rm) )([\w.-]+)/g, function (m, n) { var S = eng.state; if (!netsMade[n] && !S.networks[n] && !/^(bridge|host|none)$/.test(n)) { S.networks[n] = { id: Array.from({ length: 64 }, function () { return Math.floor(Math.random() * 16).toString(16); }).join(''), name: n, driver: 'bridge', scope: 'local', containers: {}, created: Date.now(), subnet: '172.' + (18 + (S.subnet++ - 17)) + '.0.0/16', ips: 1 }; S.networks[n].gateway = S.networks[n].subnet.replace('0.0/16', '0.1'); } return m; });
        script.replace(/docker cp (\.\/[\w.-]+) /g, function (m, f) { var p = path.resolve(wd, f); if (sim.files[p] === undefined) sim.files[p] = '{ "port": 3000 }\n'; return m; });
        if (/docker compose (?:exec|logs|ps|stop|restart|down|top)|docker-compose (?:exec|logs|ps|stop|restart|down)/.test(script) && !/compose (?:-\S+ \S+ )*up/.test(script)) { await shell.run('docker compose up -d'); notes.push('Ran `docker compose up -d` first so the compose commands have running services.'); }
        script.replace(/(?:-f|--file)[ =](\S*Dockerfile\S*)/g, function (m, f) { var p = path.resolve(wd, f); if (sim.files[p] === undefined) { sim.files[p] = SAMPLE_DOCKERFILE; seedBuildContext(wd, SAMPLE_DOCKERFILE); } return m; });
        if (/docker rmi b2c3d4e5f6a7/.test(script)) { var d = eng.addImage('<none>', '<none>', { id: 'sha256:b2c3d4e5f6a7' + '0'.repeat(52), local: true }); void d; }
        if (/docker (?:network|volume)/.test(script) === false) { /* nothing */ }
        if (seeded.length) notes.push('Started sample container' + (seeded.length > 1 ? 's' : '') + ' ' + seeded.join(', ') + ' so the commands have something to act on.');
        return notes.length ? 'ℹ️ ' + notes.join(' ') : null;
      }
    };
  };
})(window);
