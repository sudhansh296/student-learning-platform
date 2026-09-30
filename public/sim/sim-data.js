/* WebDev Atlas — data-language tools: JSON validator/formatter, YAML validator (+ Docker Compose / GitHub Actions /
 * Kubernetes checks), and an HTTP request client (.http / REST-Client style). Requires sim-net.js (ui) and sim-yaml.js. */
(function (G) {
  'use strict';
  var sim = G.__sim, ui = sim.ui, h = ui.h;

  var CSS = '.dt{padding:14px}.dt-banner{display:flex;gap:10px;align-items:flex-start;border-radius:8px;padding:10px 12px;margin-bottom:12px;font-size:13px}.dt-ok{background:#0f2a1a;border:1px solid #1f6f3a;color:#7ee2a0}.dt-bad{background:#2d1216;border:1px solid #6e2b31;color:#ffa198}.dt-warn{background:#2b2110;border:1px solid #6e5220;color:#e3b341}' +
    '.dt-banner b{display:block;margin-bottom:2px}.dt-code{margin:0;background:#010409;border:1px solid #30363d;border-radius:6px;padding:10px;overflow:auto;font:12px/1.55 ui-monospace,Menlo,Consolas,monospace;white-space:pre;color:#c9d1d9;max-height:none}' +
    '.dt-err{color:#ffa198}.dt-caret{color:#f85149}.dt-h{color:#8b949e;font:600 10px system-ui;text-transform:uppercase;letter-spacing:.06em;margin:12px 0 4px}.dt-chips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}.dt-chip{background:#21262d;border:1px solid #30363d;border-radius:12px;padding:2px 10px;font:11px ui-monospace,Consolas,monospace;color:#c9d1d9}' +
    '.dt-list{margin:0;padding-left:18px;font-size:12.5px;line-height:1.7}.dt-list li{margin-bottom:2px}.dt-list code{background:#21262d;border-radius:4px;padding:0 5px;color:#e6edf3}';
  function banner(kind, title, sub) { return h('div', { class: 'dt-banner dt-' + kind }, h('span', { text: kind === 'ok' ? '✓' : kind === 'bad' ? '✗' : '⚠', style: 'font-size:16px;line-height:1.2' }), h('div', {}, h('b', { text: title }), sub ? h('span', { text: sub }) : null)); }
  function pane(title) { if (!document.getElementById('sim-data-css')) document.head.appendChild(h('style', { id: 'sim-data-css', text: CSS })); var s = ui.init({ title: title, sub: 'runs in your browser' }), el = h('div', { class: 'dt' }); s.addTab('r', 'Result', el); s.live(true); return { shell: s, el: el }; }
  function ctxLines(src, line, col, radius) {
    var lines = src.split('\n'), from = Math.max(0, line - 1 - radius), to = Math.min(lines.length, line + radius), out = '';
    for (var i = from; i < to; i++) { out += String(i + 1).padStart(4) + ' | ' + lines[i] + '\n'; if (i === line - 1 && col) out += '     | ' + ' '.repeat(Math.max(0, col - 1)) + '^\n'; }
    return out;
  }
  function typeOf(v) { return v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v; }
  function stats(v) { var s = { keys: 0, arrays: 0, objects: 0, strings: 0, numbers: 0, bools: 0, nulls: 0, depth: 0 }; (function walk(x, d) { s.depth = Math.max(s.depth, d); if (x === null) s.nulls++; else if (Array.isArray(x)) { s.arrays++; x.forEach(function (y) { walk(y, d + 1); }); } else if (typeof x === 'object') { s.objects++; Object.keys(x).forEach(function (k) { s.keys++; walk(x[k], d + 1); }); } else if (typeof x === 'string') s.strings++; else if (typeof x === 'number') s.numbers++; else if (typeof x === 'boolean') s.bools++; })(v, 0); return s; }
  function chips(s) { var wrap = h('div', { class: 'dt-chips' }); Object.keys(s).forEach(function (k) { if (s[k]) wrap.appendChild(h('span', { class: 'dt-chip', text: k + ': ' + s[k] })); }); return wrap; }

  /* ───────────── JSON ───────────── */
  function jsonHint(src, msg) {
    if (/,\s*[}\]]/.test(src)) return 'JSON does not allow a trailing comma before a closing } or ].';
    if (/'[^']*'\s*:|:\s*'[^']*'/.test(src)) return 'JSON needs double quotes " — single quotes are not valid.';
    if (/(^|[{,]\s*)[A-Za-z_$][\w$]*\s*:/.test(src)) return 'Object keys must be quoted: {"name": "value"}.';
    if (/\/\/|\/\*/.test(src)) return 'JSON does not allow comments.';
    if (/\bundefined\b|\bNaN\b/.test(src)) return 'undefined / NaN are not valid JSON values — use null.';
    void msg; return '';
  }
  function jsonPos(src, e) {
    var m = String(e.message).match(/position (\d+)/), line = 0, col = 0;
    if (m) { var p = +m[1], before = src.slice(0, p); line = before.split('\n').length; col = p - before.lastIndexOf('\n'); }
    else { var lm = String(e.message).match(/line (\d+) column (\d+)/); if (lm) { line = +lm[1]; col = +lm[2]; } }
    return { line: line, col: col };
  }
  /* JSON with comments / trailing commas (tsconfig.json, VS Code settings, annotated API examples). */
  function stripJsonc(s) {
    var out = '', i = 0, n = s.length, inStr = false;
    while (i < n) {
      var c = s[i], d = s[i + 1];
      if (inStr) { out += c; if (c === '\\') { out += d || ''; i += 2; continue; } if (c === '"') inStr = false; i++; continue; }
      if (c === '"') { inStr = true; out += c; i++; continue; }
      if (c === '/' && d === '/') { while (i < n && s[i] !== '\n') i++; continue; }
      if (c === '/' && d === '*') { i += 2; while (i < n && !(s[i] === '*' && s[i + 1] === '/')) i++; i += 2; continue; }
      out += c; i++;
    }
    return out.replace(/,(\s*[}\]])/g, '$1');
  }
  sim.stripJsonc = stripJsonc;
  // Lessons often show several JSON documents in one block (one after another) — split them at the top level.
  function splitDocs(text) {
    var docs = [], depth = 0, q = null, esc = false, start = -1;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (q) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === q) q = null; continue; }
      if (c === '"') { q = c; continue; }
      if (c === '{' || c === '[') { if (depth === 0) start = i; depth++; }
      else if (c === '}' || c === ']') { depth--; if (depth === 0 && start >= 0) { docs.push(text.slice(start, i + 1)); start = -1; } if (depth < 0) return null; }
      else if (depth === 0 && /\S/.test(c)) return null;
    }
    return depth === 0 && docs.length > 1 ? docs : null;
  }

  sim.bootData = function (kind, src) {
    var P = pane(kind === 'json' ? 'JSON' : kind === 'yaml' ? 'YAML' : 'HTTP client'), el = P.el;
    if (kind === 'json') {
      var text = src.trim(); if (!text) { el.appendChild(banner('warn', 'Nothing to validate', 'Type or paste some JSON in the editor.')); return; }
      var jsonc = false, parsedText = text;
      try { JSON.parse(text); } catch (e0) { var cleaned = stripJsonc(text).trim(); if (cleaned !== text) { try { JSON.parse(cleaned); jsonc = true; parsedText = cleaned; } catch (e1) { /* report the original error below */ } } }
      if (!jsonc || true) {
        var multi = null; try { JSON.parse(parsedText); } catch (e2) { var cl2 = stripJsonc(text).trim(); var parts = splitDocs(cl2); if (parts) { try { multi = parts.map(function (p) { return JSON.parse(p); }); } catch (e3) { multi = null; } } }
        if (multi) {
          el.appendChild(banner('ok', 'Valid JSON \u2014 ' + multi.length + ' documents', 'This block shows several separate JSON documents one after another (comments removed); each one is valid on its own.'));
          multi.forEach(function (v, i) { el.appendChild(h('div', { class: 'dt-h', text: 'Document ' + (i + 1) + ' \u00b7 ' + typeOf(v) })); el.appendChild(h('pre', { class: 'dt-code', text: JSON.stringify(v, null, 2) })); });
          return;
        }
      }
      try {
        var val = JSON.parse(parsedText), pretty = JSON.stringify(val, null, 2), min = JSON.stringify(val);
        el.appendChild(banner('ok', jsonc ? 'Valid JSON with comments (JSONC)' : 'Valid JSON', jsonc ? 'Strict JSON has no comments, but tsconfig.json / VS Code settings allow them — comments removed below · root is ' + typeOf(val) : 'Root is ' + typeOf(val) + ' · ' + text.length + ' chars → ' + min.length + ' minified'));
        el.appendChild(chips(stats(val))); el.appendChild(h('div', { class: 'dt-h', text: 'Formatted (2 spaces)' })); el.appendChild(h('pre', { class: 'dt-code', text: pretty }));
        el.appendChild(h('div', { class: 'dt-h', text: 'Minified' })); el.appendChild(h('pre', { class: 'dt-code', style: 'white-space:pre-wrap;word-break:break-all', text: min }));
      } catch (e) {
        var pos = jsonPos(text, e), hint = jsonHint(text, e.message);
        el.appendChild(banner('bad', 'Invalid JSON', e.message + (pos.line ? ' (line ' + pos.line + ', column ' + pos.col + ')' : '')));
        if (pos.line) { var pre = h('pre', { class: 'dt-code' }); pre.textContent = ctxLines(text, pos.line, pos.col, 3); el.appendChild(pre); }
        if (hint) el.appendChild(banner('warn', 'Hint', hint));
        sim.post('e', 'JSON error: ' + e.message);
      }
      return;
    }
    if (kind === 'yaml') { yamlView(el, src); return; }
    if (kind === 'http') { httpView(el, src); return; }
  };

  /* ───────────── YAML ───────────── */
  function detect(doc) { if (doc && typeof doc === 'object') { if (doc.services && typeof doc.services === 'object') return 'compose'; if (doc.jobs && (doc.on !== undefined || doc.true !== undefined)) return 'actions'; if (doc.apiVersion && doc.kind) return 'k8s'; } return null; }
  function lintCompose(doc) {
    var issues = [], svcs = doc.services, names = Object.keys(svcs), topVols = doc.volumes ? Object.keys(doc.volumes) : [], topNets = doc.networks ? Object.keys(doc.networks) : [];
    if (doc.version) issues.push(['info', '`version:` is obsolete in Compose v2 — you can remove it.']);
    names.forEach(function (n) {
      var s = svcs[n]; if (!s || typeof s !== 'object') { issues.push(['bad', 'Service "' + n + '" must be a mapping.']); return; }
      if (!s.image && !s.build) issues.push(['bad', 'Service "' + n + '" needs an `image` or a `build`.']);
      [].concat(s.ports || []).forEach(function (p) { var sp = String(p); if (!/^(\d+\.\d+\.\d+\.\d+:)?(\d+(-\d+)?:)?\d+(-\d+)?(\/(tcp|udp))?$/.test(sp)) issues.push(['bad', 'Service "' + n + '": port mapping `' + sp + '` is invalid (use "HOST:CONTAINER").']); else if (typeof p === 'number' && sp.indexOf(':') < 0) issues.push(['info', 'Service "' + n + '": quote port mappings ("8080:80") so YAML does not parse them as numbers.']); });
      var deps = s.depends_on ? (Array.isArray(s.depends_on) ? s.depends_on : Object.keys(s.depends_on)) : []; deps.forEach(function (d) { if (!svcs[d]) issues.push(['bad', 'Service "' + n + '" depends_on `' + d + '`, which is not defined.']); });
      [].concat(s.volumes || []).forEach(function (v) { var src = String(typeof v === 'object' ? v.source : v).split(':')[0]; if (src && !/^[./~$]/.test(src) && topVols.indexOf(src) < 0 && String(v).indexOf(':') > 0) issues.push(['bad', 'Service "' + n + '" uses named volume `' + src + '` that is not declared under top-level `volumes:`.']); });
      [].concat(Array.isArray(s.networks) ? s.networks : Object.keys(s.networks || {})).forEach(function (nt) { if (topNets.indexOf(nt) < 0) issues.push(['bad', 'Service "' + n + '" uses network `' + nt + '` that is not declared under top-level `networks:`.']); });
      if (s.restart && !/^(no|always|on-failure(:\d+)?|unless-stopped)$/.test(String(s.restart))) issues.push(['bad', 'Service "' + n + '": restart policy `' + s.restart + '` is not valid.']);
      if (s.image && /:latest$|^[^:]+$/.test(String(s.image)) && !/@/.test(s.image)) issues.push(['info', 'Service "' + n + '": pin an image tag instead of `' + s.image + '` for reproducible builds.']);
      if (s.environment && !Array.isArray(s.environment) && typeof s.environment !== 'object') issues.push(['bad', 'Service "' + n + '": `environment` must be a list or a mapping.']);
    });
    return issues;
  }
  function lintActions(doc) { var issues = [], jobs = doc.jobs || {}; if (!doc.name) issues.push(['info', 'Add a workflow `name:` so it shows up nicely in the Actions tab.']); Object.keys(jobs).forEach(function (j) { var job = jobs[j]; if (!job['runs-on'] && !job.uses) issues.push(['bad', 'Job "' + j + '" needs `runs-on:`.']); if (!job.uses && (!Array.isArray(job.steps) || !job.steps.length)) issues.push(['bad', 'Job "' + j + '" has no `steps:`.']); (job.steps || []).forEach(function (s, i) { if (!s.uses && !s.run) issues.push(['bad', 'Job "' + j + '", step ' + (i + 1) + ': needs `uses:` or `run:`.']); if (s.uses && /@(main|master)$/.test(s.uses)) issues.push(['info', 'Job "' + j + '": pin `' + s.uses + '` to a version tag or SHA.']); if (s.uses && !/@/.test(s.uses) && !/^\./.test(s.uses)) issues.push(['bad', 'Job "' + j + '": action `' + s.uses + '` needs a version (`@v4`).']); }); if (job.needs) [].concat(job.needs).forEach(function (n) { if (!jobs[n]) issues.push(['bad', 'Job "' + j + '" needs `' + n + '`, which does not exist.']); }); }); return issues; }
  function lintK8s(doc) { var issues = []; if (!doc.metadata || !doc.metadata.name) issues.push(['bad', '`metadata.name` is required.']); if (/^(Deployment|StatefulSet|DaemonSet|ReplicaSet|Job)$/.test(doc.kind)) { var spec = doc.spec || {}; if (!spec.selector && doc.kind !== 'Job') issues.push(['bad', '`spec.selector` is required for ' + doc.kind + '.']); var tpl = spec.template || {}, cs = (tpl.spec || {}).containers; if (!Array.isArray(cs) || !cs.length) issues.push(['bad', '`spec.template.spec.containers` must list at least one container.']); else cs.forEach(function (c) { if (!c.image) issues.push(['bad', 'Container "' + (c.name || '?') + '" needs an `image`.']); if (c.image && /:latest$|^[^:]+$/.test(c.image)) issues.push(['info', 'Container "' + c.name + '": avoid the `latest` tag (' + c.image + ').']); if (!c.resources) issues.push(['info', 'Container "' + c.name + '": set resource requests/limits.']); }); if (spec.selector && spec.selector.matchLabels && tpl.metadata && tpl.metadata.labels) { Object.keys(spec.selector.matchLabels).forEach(function (k) { if (tpl.metadata.labels[k] !== spec.selector.matchLabels[k]) issues.push(['bad', 'selector.matchLabels `' + k + '` does not match the pod template labels.']); }); } } if (doc.kind === 'Service' && !(doc.spec || {}).ports) issues.push(['bad', 'Service needs `spec.ports`.']); return issues; }
  function yamlView(el, src) {
    var text = src; if (!text.trim()) { el.appendChild(banner('warn', 'Nothing to validate', 'Type or paste some YAML in the editor.')); return; }
    var docs; try { docs = sim.yaml.parse(text, { all: true }); } catch (e) {
      el.appendChild(banner('bad', 'Invalid YAML', e.msg || e.message)); if (e.line) { var pre = h('pre', { class: 'dt-code' }); pre.textContent = ctxLines(text, e.line, e.col || 0, 3); el.appendChild(pre); }
      if (/tab/i.test(e.message)) el.appendChild(banner('warn', 'Hint', 'YAML indentation must use spaces, never tabs.'));
      if (/bad indentation|unexpected content/.test(e.message)) el.appendChild(banner('warn', 'Hint', 'Keys at the same level must be indented by exactly the same number of spaces; children by more.'));
      sim.post('e', 'YAML error: ' + e.message); return;
    }
    var n = docs.length; el.appendChild(banner('ok', 'Valid YAML', n + ' document' + (n > 1 ? 's' : '') + ' parsed'));
    docs.forEach(function (doc, i) {
      var kind = detect(doc), issues = kind === 'compose' ? lintCompose(doc) : kind === 'actions' ? lintActions(doc) : kind === 'k8s' ? lintK8s(doc) : [];
      if (n > 1) el.appendChild(h('div', { class: 'dt-h', text: 'Document ' + (i + 1) }));
      if (kind) { el.appendChild(h('div', { class: 'dt-h', text: { compose: 'Docker Compose file', actions: 'GitHub Actions workflow', k8s: 'Kubernetes ' + doc.kind }[kind] + ' — checks' })); if (!issues.length) el.appendChild(banner('ok', 'No problems found', 'Structure looks good.')); else { var ul = h('ul', { class: 'dt-list' }); issues.forEach(function (it) { ul.appendChild(h('li', { style: 'color:' + (it[0] === 'bad' ? '#ffa198' : '#8b949e') }, (it[0] === 'bad' ? '✗ ' : 'ℹ ') + it[1].replace(/`/g, '"'))); }); el.appendChild(ul); } }
      if (doc && typeof doc === 'object') el.appendChild(chips(stats(doc)));
      el.appendChild(h('div', { class: 'dt-h', text: 'Parsed as JSON' })); el.appendChild(h('pre', { class: 'dt-code', text: JSON.stringify(doc, null, 2) }));
    });
  }

  /* ───────────── HTTP client ───────────── */
  var REQ_LINE = /^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s+(\S+)(?:\s+HTTP\/[\d.]+)?\s*(?:\/\/.*|#.*)?$/i;
  function absoluteUrl(u, headers) {
    if (/^https?:\/\//i.test(u)) return u;
    var host = headers && (headers.Host || headers.host);
    return (host ? 'https://' + host : 'https://api.example.com') + (u[0] === '/' ? u : '/' + u);
  }
  /* A block is one of: a raw HTTP response, several one-line requests, or a single request (+ headers + body). */
  function parseHttp(text) {
    var blocks = text.split(/^#{3,}.*$/m).map(function (b) { return b.replace(/^\s+|\s+$/g, ''); }).filter(Boolean), items = [];
    blocks.forEach(function (b) {
      var lines = b.split('\n'), meaningful = lines.filter(function (l) { return l.trim() && !/^\s*(#|\/\/)/.test(l); });
      if (!meaningful.length) return;
      var first = meaningful[0].trim();
      if (/^HTTP\/[\d.]+\s+\d{3}/.test(first)) {
        var sm = first.match(/^HTTP\/[\d.]+\s+(\d{3})\s*(.*)$/), idx = lines.findIndex(function (l) { return l.trim() === first; }), headers = [], j = idx + 1;
        while (j < lines.length && lines[j].trim()) { headers.push(lines[j].trim()); j++; }
        items.push({ response: true, status: +sm[1], statusText: sm[2], headers: headers, body: lines.slice(j + 1).join('\n').trim() }); return;
      }
      var reqLines = meaningful.filter(function (l) { return REQ_LINE.test(l.trim()); });
      var others = meaningful.filter(function (l) { return !REQ_LINE.test(l.trim()); });
      if (reqLines.length > 1 && !others.length) { reqLines.forEach(function (l) { var m = l.trim().match(REQ_LINE); items.push({ method: m[1].toUpperCase(), url: absoluteUrl(m[2], {}), headers: {}, body: '' }); }); return; }
      var i = lines.findIndex(function (l) { return REQ_LINE.test(l.trim()); });
      if (i < 0) { items.push({ error: 'Could not read a request line in this block: "' + first + '" — expected e.g. GET https://api.example.com/users HTTP/1.1' }); return; }
      var m2 = lines[i].trim().match(REQ_LINE), hs = {}, k = i + 1;
      while (k < lines.length && lines[k].trim()) { var hm = lines[k].match(/^([\w-]+):\s*(.*)$/); if (hm) hs[hm[1]] = hm[2]; k++; }
      items.push({ method: m2[1].toUpperCase(), url: absoluteUrl(m2[2], hs), headers: hs, body: lines.slice(k + 1).join('\n').replace(/^\s*(\/\/|#).*$/gm, '').trim() });
    });
    return items;
  }
  function httpView(el, src) {
    var reqs = parseHttp(src); if (!reqs.length) { el.appendChild(banner('warn', 'No request found', 'Write a request like:  GET https://api.example.com/users   (separate several requests with ###)')); return; }
    el.appendChild(banner('warn', 'Sandboxed client', 'Requests to jsonplaceholder.typicode.com, api.example.com and other example hosts are answered by built-in mock APIs; real internet hosts are blocked in the browser sandbox.'));
    var chain = Promise.resolve();
    reqs.forEach(function (r, idx) {
      chain = chain.then(function () {
        var card = h('div', {}); el.appendChild(card);
        if (r.error) { card.appendChild(banner('bad', 'Request ' + (idx + 1), r.error)); return; }
        if (r.response) {
          card.appendChild(h('div', { class: 'dt-h', text: 'Example response ' + (idx + 1) }));
          card.appendChild(banner(r.status < 400 ? 'ok' : 'bad', 'HTTP ' + r.status + ' ' + r.statusText, 'This block is a response, so there is nothing to send — here it is parsed.'));
          card.appendChild(h('pre', { class: 'dt-code', text: r.headers.join('\n') || '(no headers)' }));
          if (r.body) { var pb = r.body; try { pb = JSON.stringify(JSON.parse(r.body), null, 2); } catch (e) { /* not json */ } card.appendChild(h('pre', { class: 'dt-code', text: pb })); }
          return;
        }
        card.appendChild(h('div', { class: 'dt-h', text: 'Request ' + (idx + 1) })); card.appendChild(h('pre', { class: 'dt-code', text: r.method + ' ' + r.url + '\n' + Object.keys(r.headers).map(function (k) { return k + ': ' + r.headers[k]; }).join('\n') + (r.body ? '\n\n' + r.body : '') }));
        var t0 = performance.now(), body = /^(POST|PUT|PATCH)$/.test(r.method) ? r.body : undefined;
        return G.fetch(r.url, { method: r.method, headers: r.headers, body: body }).then(function (res) { return res.text().then(function (t) { var ms = Math.round(performance.now() - t0), pretty = t; try { pretty = JSON.stringify(JSON.parse(t), null, 2); } catch (e) { /* not json */ } var hs = []; res.headers.forEach(function (v, k) { hs.push(k + ': ' + v); }); card.appendChild(banner(res.ok ? 'ok' : 'bad', 'HTTP ' + res.status + ' ' + (res.statusText || ''), ms + ' ms · ' + t.length + ' bytes')); card.appendChild(h('div', { class: 'dt-h', text: 'Response headers' })); card.appendChild(h('pre', { class: 'dt-code', text: hs.join('\n') || '(none)' })); card.appendChild(h('div', { class: 'dt-h', text: 'Response body' })); card.appendChild(h('pre', { class: 'dt-code', text: pretty || '(empty)' })); }); }).catch(function (e) { card.appendChild(banner('bad', 'Request failed', String(e && e.message || e) + ' — only the built-in mock hosts are reachable from the sandbox.')); });
      });
    });
  }
})(window);
