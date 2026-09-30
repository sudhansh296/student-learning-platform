import type { Project } from './types';

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Redis Cache Lab</title>
<link rel="stylesheet" href="style.css">
</head>
<body>

<div id="app">

  <header class="topbar">
    <div class="topbar-left">
      <div class="brand-icon">R</div>
      <span class="brand-name">Redis Cache Lab</span>
      <span class="brand-sub">in-memory store</span>
    </div>
    <div class="topbar-right">
      <button id="btnReset" class="btn-sm">Flush all</button>
    </div>
  </header>

  <div class="layout">

    <aside class="sidebar">
      <div class="group-title">STRINGS</div>
      <button class="cb" data-key="setKey">SET key value</button>
      <button class="cb" data-key="getKey">GET key</button>
      <button class="cb" data-key="incrCounter">INCR counter</button>

      <div class="group-title">EXPIRY (TTL)</div>
      <button class="cb" data-key="setWithExpiry">SET ... EX seconds</button>
      <button class="cb" data-key="checkTtl">TTL key</button>

      <div class="group-title">CACHING PATTERN</div>
      <button class="cb" data-key="cacheAside">Cache-aside GET</button>

      <div class="group-title">RATE LIMITING</div>
      <button class="cb" data-key="rateLimitCheck">Rate limit check</button>

      <div class="group-title">QUEUES (LIST)</div>
      <button class="cb" data-key="queuePush">RPUSH job</button>
      <button class="cb" data-key="queuePop">LPOP job</button>

      <div class="group-title">LEADERBOARD (ZSET)</div>
      <button class="cb" data-key="leaderboardAdd">ZADD score</button>
      <button class="cb" data-key="leaderboardTop">ZREVRANGE top</button>
    </aside>

    <div class="main">

      <div class="cmd-box">
        <div class="cmd-label">COMMAND</div>
        <pre id="cmdText" class="cmd-pre"></pre>
        <div id="paramRow" class="param-row"></div>
        <button id="btnRun" class="btn-run">Run</button>
      </div>

      <div class="result-box">
        <div class="result-top">
          <span class="result-label">RESULT</span>
          <span id="timeLabel" class="time-label"></span>
        </div>
        <pre id="resultOut" class="result-out">Select a command and click Run.</pre>
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
.brand-icon{width:30px;height:30px;background:linear-gradient(135deg,#a41e11,#dc382d);border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:14px;color:#fff;font-family:monospace}
.brand-name{font-weight:800;font-size:14px}
.brand-sub{font-size:10px;color:#484f58;background:#21262d;padding:2px 7px;border-radius:99px;border:1px solid #30363d;font-family:monospace}
.btn-sm{padding:4px 12px;background:none;border:1px solid #30363d;border-radius:4px;color:#8b949e;font-size:11px;transition:all .12s}
.btn-sm:hover{color:#e6edf3;border-color:#8b949e}

.layout{display:grid;grid-template-columns:210px 1fr 260px;flex:1;overflow:hidden}

.sidebar{background:#161b22;border-right:1px solid #30363d;overflow-y:auto;padding:8px 0}
.group-title{font-size:10px;font-weight:700;letter-spacing:1.2px;color:#484f58;padding:10px 12px 4px;text-transform:uppercase}
.cb{display:block;width:100%;padding:7px 12px;background:none;border:none;border-left:2px solid transparent;color:#8b949e;text-align:left;font-size:11.5px;font-family:monospace;transition:all .12s}
.cb:hover{background:#21262d;color:#e6edf3}
.cb.active{background:#161b22;border-left-color:#dc382d;color:#e6edf3}

.main{display:flex;flex-direction:column;overflow:hidden;border-right:1px solid #30363d}

.cmd-box{padding:14px;border-bottom:1px solid #30363d;flex-shrink:0}
.cmd-label{font-size:10px;font-weight:700;letter-spacing:1px;color:#484f58;margin-bottom:6px}
.cmd-pre{background:#161b22;border:1px solid #30363d;border-radius:6px;padding:12px 14px;font-family:monospace;font-size:12.5px;color:#ff9d8a;white-space:pre-wrap;line-height:1.6;margin-bottom:10px}
.param-row{display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap}
.param-row label{font-size:11px;color:#8b949e;font-family:monospace}
.param-row input{padding:5px 9px;background:#21262d;border:1px solid #30363d;border-radius:4px;color:#e6edf3;font-size:12px;font-family:monospace;outline:none;width:130px}
.param-row input:focus{border-color:#dc382d}
.btn-run{padding:8px 20px;background:#238636;color:#fff;border:none;border-radius:5px;font-size:13px;font-weight:700;transition:background .15s}
.btn-run:hover{background:#2ea043}

.result-box{flex:1;display:flex;flex-direction:column;padding:14px;overflow:hidden;min-height:0}
.result-top{display:flex;align-items:center;gap:10px;margin-bottom:8px;flex-shrink:0}
.result-label{font-size:10px;font-weight:700;letter-spacing:1px;color:#484f58}
.time-label{font-size:11px;color:#484f58;font-family:monospace}
.result-out{flex:1;overflow:auto;background:#161b22;border:1px solid #30363d;border-radius:6px;padding:12px 14px;font-family:monospace;font-size:12px;color:#c9d1d9;white-space:pre-wrap;line-height:1.7;margin:0}
.result-out .err{color:#f85149}
.result-out .ok{color:#3fb950}

.docs{background:#161b22;overflow-y:auto;padding:8px 0}
.docs-body{padding:4px 14px 14px;font-size:12px;color:#8b949e;line-height:1.7}
.docs-body h4{color:#e6edf3;font-size:12px;font-weight:700;margin:10px 0 4px}
.docs-body p{margin-bottom:6px}
.docs-body code{background:#0d1117;border:1px solid #30363d;border-radius:3px;padding:1px 5px;font-family:monospace;font-size:11px;color:#ff9d8a}

@media(max-width:900px){.layout{grid-template-columns:180px 1fr}.docs{display:none}}`;

const scriptJs = `'use strict';

// ================================================================
// IN-MEMORY REDIS-LIKE STORE
// Each entry: { type: 'string'|'list'|'zset', value, expiresAt: ms|null }
// ================================================================
var STORE = {};

function resetStore() {
  STORE = {};
}

// "Passive expiration": a key is only actually removed the moment
// something tries to read it and finds its time is up -- exactly
// how real Redis handles most expired-key reads.
function liveEntry(key) {
  var e = STORE[key];
  if (!e) return null;
  if (e.expiresAt !== null && Date.now() >= e.expiresAt) {
    delete STORE[key];
    return null;
  }
  return e;
}

function setString(key, value, ttlSeconds) {
  STORE[key] = {
    type: 'string',
    value: String(value),
    expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null
  };
}

function incr(key) {
  var e = liveEntry(key);
  if (e && e.type !== 'string') throw new Error('WRONGTYPE Operation against a key holding the wrong kind of value');
  var current = e ? parseInt(e.value, 10) : 0;
  if (e && isNaN(current)) throw new Error('ERR value is not an integer or out of range');
  var next = current + 1;
  var expiresAt = e ? e.expiresAt : null; // INCR never changes an existing TTL
  STORE[key] = { type: 'string', value: String(next), expiresAt: expiresAt };
  return next;
}

function ttlSecondsOf(key) {
  var e = liveEntry(key);
  if (!e) return -2;             // key does not exist (or already expired)
  if (e.expiresAt === null) return -1; // exists, but never expires
  return Math.max(0, Math.ceil((e.expiresAt - Date.now()) / 1000));
}

// ================================================================
// COMMAND DEFINITIONS
// ================================================================
var CMDS = {
  setKey: {
    cmd: 'SET {{key}} "{{value}}"',
    params: [
      { key:'key', label:'key', type:'text', default:'session:abc' },
      { key:'value', label:'value', type:'text', default:'user-42' }
    ],
    run: function(p) {
      setString(p.key, p.value, null);
      return { ok: true, text: 'OK' };
    }
  },
  getKey: {
    cmd: 'GET {{key}}',
    params: [{ key:'key', label:'key', type:'text', default:'session:abc' }],
    run: function(p) {
      var e = liveEntry(p.key);
      return { ok: true, text: e ? '"' + e.value + '"' : '(nil)' };
    }
  },
  incrCounter: {
    cmd: 'INCR {{key}}',
    params: [{ key:'key', label:'key', type:'text', default:'pageviews' }],
    run: function(p) {
      try {
        var n = incr(p.key);
        return { ok: true, text: '(integer) ' + n };
      } catch (err) {
        return { ok: false, text: err.message };
      }
    }
  },
  setWithExpiry: {
    cmd: 'SET {{key}} "{{value}}" EX {{seconds}}',
    params: [
      { key:'key', label:'key', type:'text', default:'session:xyz' },
      { key:'value', label:'value', type:'text', default:'user-7' },
      { key:'seconds', label:'TTL (seconds)', type:'number', default:8 }
    ],
    run: function(p) {
      var secs = Math.max(1, parseInt(p.seconds, 10) || 8);
      setString(p.key, p.value, secs);
      return { ok: true, text: 'OK\\n(expires in ' + secs + 's — try "TTL key" now, then again after a few seconds)' };
    }
  },
  checkTtl: {
    cmd: 'TTL {{key}}',
    params: [{ key:'key', label:'key', type:'text', default:'session:xyz' }],
    run: function(p) {
      var ttl = ttlSecondsOf(p.key);
      var note = ttl === -2 ? ' (no such key, or it already expired)' : ttl === -1 ? ' (exists, but has no expiry)' : ' (seconds remaining)';
      return { ok: true, text: '(integer) ' + ttl + note };
    }
  },
  cacheAside: {
    cmd: 'GET {{key}}\\n-- on a cache miss, the app would query the database,\\n-- then: SET {{key}} "..." EX 300',
    params: [{ key:'key', label:'key', type:'text', default:'product:42' }],
    run: function(p) {
      var e = liveEntry(p.key);
      if (e) return { ok: true, text: 'CACHE HIT\\n"' + e.value + '"' };
      var fetched = '{"id":42,"name":"Wireless Mouse","price":19.99}';
      setString(p.key, fetched, 300);
      return { ok: true, text: 'CACHE MISS — fetched from database (simulated ~120ms)\\nStored in cache with a 300s TTL:\\n"' + fetched + '"' };
    }
  },
  rateLimitCheck: {
    cmd: 'INCR {{key}}\\n-- (EX {{windowSeconds}} set only on the first request in the window)',
    params: [
      { key:'key', label:'client key', type:'text', default:'ratelimit:1.2.3.4' },
      { key:'windowSeconds', label:'window (s)', type:'number', default:60 },
      { key:'limit', label:'limit', type:'number', default:3 }
    ],
    run: function(p) {
      var isNew = !liveEntry(p.key);
      var count;
      try { count = incr(p.key); } catch (err) { return { ok: false, text: err.message }; }
      if (isNew) {
        var e = STORE[p.key];
        e.expiresAt = Date.now() + Math.max(1, parseInt(p.windowSeconds, 10) || 60) * 1000;
      }
      var limit = parseInt(p.limit, 10) || 3;
      var allowed = count <= limit;
      var ttl = ttlSecondsOf(p.key);
      return {
        ok: allowed,
        text: (allowed ? 'ALLOWED' : 'BLOCKED (429 Too Many Requests)') +
              '\\nrequest ' + count + ' of ' + limit + ' allowed in this window' +
              '\\nwindow resets in ' + ttl + 's'
      };
    }
  },
  queuePush: {
    cmd: 'RPUSH {{key}} "{{value}}"',
    params: [
      { key:'key', label:'queue key', type:'text', default:'jobs' },
      { key:'value', label:'job', type:'text', default:'send-email' }
    ],
    run: function(p) {
      var e = liveEntry(p.key);
      if (!e) { e = { type:'list', value: [], expiresAt: null }; STORE[p.key] = e; }
      if (e.type !== 'list') return { ok: false, text: 'WRONGTYPE Operation against a key holding the wrong kind of value' };
      e.value.push(p.value);
      return { ok: true, text: '(integer) ' + e.value.length + '  (queue length)' };
    }
  },
  queuePop: {
    cmd: 'LPOP {{key}}',
    params: [{ key:'key', label:'queue key', type:'text', default:'jobs' }],
    run: function(p) {
      var e = liveEntry(p.key);
      if (!e || !e.value.length) return { ok: true, text: '(nil)  (queue is empty)' };
      var job = e.value.shift();
      return { ok: true, text: '"' + job + '"' };
    }
  },
  leaderboardAdd: {
    cmd: 'ZADD {{key}} {{score}} "{{member}}"',
    params: [
      { key:'key', label:'leaderboard key', type:'text', default:'leaderboard' },
      { key:'score', label:'score', type:'number', default:1500 },
      { key:'member', label:'member', type:'text', default:'ada' }
    ],
    run: function(p) {
      var e = liveEntry(p.key);
      if (!e) { e = { type:'zset', value: [], expiresAt: null }; STORE[p.key] = e; }
      if (e.type !== 'zset') return { ok: false, text: 'WRONGTYPE Operation against a key holding the wrong kind of value' };
      var score = parseFloat(p.score) || 0;
      var existing = e.value.find(function(m){ return m.member === p.member; });
      var added = 0;
      if (existing) { existing.score = score; } else { e.value.push({ member: p.member, score: score }); added = 1; }
      e.value.sort(function(a,b){ return b.score - a.score; });
      return { ok: true, text: '(integer) ' + added };
    }
  },
  leaderboardTop: {
    cmd: 'ZREVRANGE {{key}} 0 2 WITHSCORES',
    params: [{ key:'key', label:'leaderboard key', type:'text', default:'leaderboard' }],
    run: function(p) {
      var e = liveEntry(p.key);
      if (!e || !e.value.length) return { ok: true, text: '(empty array)' };
      var top = e.value.slice(0, 3);
      var lines = top.map(function(m, i){ return (i+1) + ') "' + m.member + '" (score: ' + m.score + ')'; });
      return { ok: true, text: lines.join('\\n') };
    }
  }
};

var DOCS = {
  setKey: { title:'SET', desc:'Sets a string value for a key, with no expiry. If the key already exists, its old value (and any expiry it had) is replaced.' },
  getKey: { title:'GET', desc:'Reads a string value. Returns <code>(nil)</code> if the key does not exist — or if it existed but its TTL has already run out.' },
  incrCounter: { title:'INCR', desc:'Atomically increments a numeric value by 1, creating the key at 0 first if it does not exist yet. Because the whole read-modify-write happens as one atomic server-side operation, it is safe under concurrent requests in a way that GET-then-SET yourself is not.' },
  setWithExpiry: { title:'SET ... EX', desc:'Sets a value and a time-to-live in one atomic command. Run "TTL key" right after, then wait a few seconds and run it again — the countdown is real, based on the actual elapsed time.' },
  checkTtl: { title:'TTL', desc:'-2 means the key does not exist (or already expired). -1 means the key exists but has no expiry at all. Any other number is the real number of seconds left.' },
  cacheAside: { title:'The cache-aside pattern', desc:'Check the cache first. On a hit, return the cached value immediately. On a miss, "query the database" (simulated here), then store the result in the cache with a TTL before returning it — the most common real-world Redis caching pattern.' },
  rateLimitCheck: { title:'Fixed-window rate limiting', desc:'INCR a per-client counter, and set its expiry only the first time it is created in a window. If the count exceeds the limit before the key expires, the request is blocked — a simple, genuinely atomic rate limiter built from two basic commands.' },
  queuePush: { title:'RPUSH (queue producer)', desc:'Adds a job to the tail of a list — the "producer" side of a simple job queue. Real Redis lists persist their contents like any other key, unlike an in-memory-only array in application code.' },
  queuePop: { title:'LPOP (queue consumer)', desc:'Removes and returns the job at the head of the list — the "consumer" side. Combined with RPUSH, this gives a basic first-in-first-out queue: push work in on one end, pop it off the other.' },
  leaderboardAdd: { title:'ZADD (sorted set)', desc:'Adds (or updates) a member with a score in a sorted set. Redis automatically keeps the whole set ordered by score — exactly the data structure a leaderboard needs.' },
  leaderboardTop: { title:'ZREVRANGE ... WITHSCORES', desc:'Reads the top entries from a sorted set, highest score first. Getting the current leaderboard is always this one fast command — no sorting in application code required.' }
};

// ================================================================
// STATE / INIT
// ================================================================
var currentKey = 'setKey';

(function init() {
  document.querySelectorAll('.cb').forEach(function(btn) {
    btn.addEventListener('click', function() { selectCommand(this.dataset.key); });
  });
  document.getElementById('btnRun').addEventListener('click', runCurrent);
  document.getElementById('btnReset').addEventListener('click', function() {
    resetStore();
    printOutput({ ok: true, text: 'OK\\nAll keys removed.' });
  });
  selectCommand('setKey');
}());

function selectCommand(key) {
  currentKey = key;
  document.querySelectorAll('.cb').forEach(function(b) {
    b.classList.toggle('active', b.dataset.key === key);
  });
  var c = CMDS[key];
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
  var c = CMDS[currentKey];
  var params = {};
  c.params.forEach(function(p) { params[p.key] = currentParamValue(p); });
  var result = c.run(params);
  printOutput(result);
}

function printOutput(result) {
  var out = document.getElementById('resultOut');
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

export const redisCacheLabProject: Project = {
  id: 'redis-cache-lab',
  slug: 'redis-cache-lab',
  title: 'Redis Cache Lab',
  difficulty: 'intermediate',
  type: 'frontend',
  estimatedTime: '6-9 hours',
  playgroundKey: 'redis-cache-lab',
  description: 'Build an interactive Redis command console demonstrating real caching, expiry, atomic counters, rate limiting, queues and leaderboards — with genuine wall-clock-based TTL that actually counts down.',
  overview: 'This project focuses on what Redis is actually used for in real applications: caching (the cache-aside pattern), expiring data automatically with real TTLs, atomic counters that are safe under concurrency, a working rate limiter built from two basic commands, a simple job queue, and a leaderboard backed by a sorted set. TTLs are based on real timestamps, so setting a key to expire in 8 seconds and checking it again a few seconds later shows a genuinely different, correct countdown — not a canned animation.',
  objective: 'Build an interactive Redis console covering strings and TTL, the cache-aside pattern, a real fixed-window rate limiter, list-based queues, and sorted-set leaderboards — each backed by correct, stateful logic with genuine time-based expiry.',
  technologies: ['HTML', 'CSS', 'JavaScript', 'Redis'],
  prerequisites: ['JavaScript fundamentals (objects, Date.now(), array methods)', 'Basic Redis concepts (key-value, TTL)', 'DOM manipulation'],
  learnings: [
    'Implementing real, wall-clock-based key expiry with Date.now() instead of a fake countdown',
    '"Passive expiration": checking whether a key has expired only at read time, exactly like real Redis',
    'Why INCR is atomic-safe under concurrency in a way that GET-then-increment-then-SET in application code is not',
    'Implementing the cache-aside pattern: check cache, fall back to the "database" on a miss, populate the cache with a TTL',
    'Building a genuinely working fixed-window rate limiter from just INCR and an expiry set once per window',
    'Modeling Redis\'s different data types (string, list, sorted set) as a single store with a type tag per key',
    'Implementing WRONGTYPE-style errors when a command is used against the wrong kind of key, matching real Redis behavior',
  ],
  features: [
    '11 real Redis-style commands across six categories: strings, TTL, caching, rate limiting, queues, and leaderboards',
    'Genuine time-based TTL — set a short expiry and watch it actually count down in real time across separate commands',
    'A real cache-aside implementation: cache hit returns instantly, a cache miss simulates a database fetch and populates the cache',
    'A working rate limiter that blocks requests once a per-window limit is exceeded, with the exact seconds remaining until reset',
    'A simple RPUSH/LPOP job queue with real first-in-first-out behavior',
    'A ZADD/ZREVRANGE sorted-set leaderboard that stays correctly ordered as scores are added or updated',
    'Realistic Redis-style error messages, including WRONGTYPE for using the wrong command on a key',
    'A Flush all button to clear the entire in-memory store',
    'Per-command explanation panel',
    'Dark, Redis-branded console UI consistent with the site\'s other database projects',
  ],
  fileStructure: 'redis-cache-lab/ |   index.html |   style.css |   script.js',
  files: [
    { path: 'redis-cache-lab/index.html', language: 'html',       content: indexHtml },
    { path: 'redis-cache-lab/style.css',  language: 'css',        content: styleCss  },
    { path: 'redis-cache-lab/script.js',  language: 'javascript', content: scriptJs  },
  ],
  lessons: [
    {
      id: 'real-ttl',
      title: 'Implementing Genuine, Time-Based Expiry',
      explanation: 'Instead of a fake countdown timer, each key stores the actual timestamp it expires at. Checking whether a key is still valid is just comparing that timestamp to the current time — which is exactly how real Redis tracks expiry internally.',
      js: `function setString(key, value, ttlSeconds) {
  STORE[key] = {
    value: value,
    // store WHEN it expires, not a countdown that needs a running timer
    expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null
  };
}

function liveEntry(key) {
  var e = STORE[key];
  if (!e) return null;

  // "Passive expiration": only checked (and cleaned up) when read
  if (e.expiresAt !== null && Date.now() >= e.expiresAt) {
    delete STORE[key];
    return null;
  }
  return e;
}`,
    },
    {
      id: 'atomic-incr',
      title: 'Why INCR Is Safe Under Concurrency',
      explanation: 'A naive "read the value, add 1, write it back" done as three separate steps in application code has a race condition: two requests can both read the same starting value before either writes back, and one increment gets lost. INCR avoids this by doing the read-modify-write as a single, uninterruptible server-side operation.',
      js: `// UNSAFE if two requests run this "at the same time":
function unsafeIncrement(key) {
  var current = parseInt(STORE[key].value, 10); // step 1: read
  var next = current + 1;                        // step 2: modify
  STORE[key].value = String(next);                // step 3: write
  // another request could read the SAME "current" between steps 1 and 3
}

// SAFE: the whole thing happens as one atomic operation
function incr(key) {
  var e = liveEntry(key);
  var current = e ? parseInt(e.value, 10) : 0;
  var next = current + 1;
  STORE[key] = { value: String(next), expiresAt: e ? e.expiresAt : null };
  return next;
  // real Redis guarantees no other command can run in the middle of this
}`,
    },
    {
      id: 'rate-limiter',
      title: 'Building a Fixed-Window Rate Limiter from Two Commands',
      explanation: 'A rate limiter does not need special Redis features — just INCR to count requests, and an expiry set only the first time a client is seen in a given window. When the counter exceeds the limit before the window resets, the request is blocked.',
      js: `function rateLimitCheck(clientKey, windowSeconds, limit) {
  var isNewWindow = !liveEntry(clientKey);
  var count = incr(clientKey);

  if (isNewWindow) {
    // only set the expiry on the FIRST request of a new window
    STORE[clientKey].expiresAt = Date.now() + windowSeconds * 1000;
  }

  return {
    allowed: count <= limit,
    count: count,
    resetsInSeconds: ttlSecondsOf(clientKey)
  };
}`,
    },
  ],
  challenges: [
    {
      id: 'add-expire-command',
      title: 'Add a standalone EXPIRE command',
      difficulty: 'easy',
      description: 'Add a new command, expireKey, that sets a TTL on an already-existing key without changing its value — matching Redis\'s real EXPIRE command, which is separate from SET ... EX.',
      hint: 'Look up the key with liveEntry(). If it exists, set its expiresAt to Date.now() + seconds * 1000 and return 1 (Redis-style "success"). If it does not exist, return 0.',
      solutionJs: `expireKey: {
  cmd: 'EXPIRE {{key}} {{seconds}}',
  params: [
    { key: 'key', label: 'key', type: 'text', default: 'session:abc' },
    { key: 'seconds', label: 'seconds', type: 'number', default: 30 }
  ],
  run: function(p) {
    var e = liveEntry(p.key);
    if (!e) return { ok: true, text: '(integer) 0  (no such key)' };
    e.expiresAt = Date.now() + Math.max(1, parseInt(p.seconds, 10) || 30) * 1000;
    return { ok: true, text: '(integer) 1' };
  }
}`,
    },
    {
      id: 'add-persist',
      title: 'Add a PERSIST command',
      difficulty: 'medium',
      description: 'Add a persist command that removes a key\'s TTL entirely, making it permanent again — the opposite of EXPIRE. Should report whether it actually had a TTL to remove.',
      hint: 'Look up the key. If it exists and expiresAt is not null, set expiresAt to null and return 1. If it exists but already had no TTL, or does not exist at all, return 0.',
      solutionJs: `persist: {
  cmd: 'PERSIST {{key}}',
  params: [{ key: 'key', label: 'key', type: 'text', default: 'session:xyz' }],
  run: function(p) {
    var e = liveEntry(p.key);
    if (!e || e.expiresAt === null) return { ok: true, text: '(integer) 0' };
    e.expiresAt = null;
    return { ok: true, text: '(integer) 1' };
  }
}`,
    },
    {
      id: 'add-sliding-window',
      title: 'Upgrade the rate limiter to a sliding window using a sorted set',
      difficulty: 'hard',
      description: 'The current rate limiter uses a fixed window, which allows a burst right at the window boundary. Implement a sliding-window version: store each request\'s timestamp as a member in a sorted set (scored by the timestamp itself), remove entries older than the window on each check, and count what is left.',
      hint: 'Use a zset-typed key. On each check: (1) remove all members with score < Date.now() - windowSeconds*1000, (2) add the current timestamp as a new member, (3) the zset\'s size after cleanup is the request count in the trailing window.',
      solutionJs: `slidingRateLimit: {
  cmd: 'ZREMRANGEBYSCORE {{key}} 0 (now - window)\\nZADD {{key}} now now\\nZCARD {{key}}',
  params: [
    { key: 'key', label: 'client key', type: 'text', default: 'sliding:1.2.3.4' },
    { key: 'windowSeconds', label: 'window (s)', type: 'number', default: 60 },
    { key: 'limit', label: 'limit', type: 'number', default: 5 }
  ],
  run: function(p) {
    var e = liveEntry(p.key);
    if (!e) { e = { type: 'zset', value: [], expiresAt: null }; STORE[p.key] = e; }
    var now = Date.now();
    var windowMs = Math.max(1, parseInt(p.windowSeconds, 10) || 60) * 1000;

    // Drop timestamps older than the trailing window
    e.value = e.value.filter(function(m) { return m.score >= now - windowMs; });
    // Record this request
    e.value.push({ member: String(now), score: now });

    var count = e.value.length;
    var limit = parseInt(p.limit, 10) || 5;
    return {
      ok: count <= limit,
      text: (count <= limit ? 'ALLOWED' : 'BLOCKED') + '\\n' + count + ' requests in the trailing ' + p.windowSeconds + 's'
    };
  }
}`,
    },
  ],
};
