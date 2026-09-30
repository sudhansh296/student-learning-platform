/* WebDev Atlas — Git simulator. A working in-memory implementation of the everyday git workflow on top of the
 * virtual filesystem (sim.files): init, add, commit, status, log, diff, branch, checkout/switch, restore, reset, revert,
 * merge (3-way + conflicts), rebase, cherry-pick, stash, tag, remote, push/pull/clone (simulated remote). */
(function (G) {
  'use strict';
  var sim = G.__sim, path = sim.path;

  /* ───────────── text diff (LCS) ───────────── */
  function splitLines(s) { if (s === '' || s === undefined) return []; var l = String(s).split('\n'); if (l[l.length - 1] === '') l.pop(); return l; }
  function lcsOps(a, b) {
    var n = a.length, m = b.length, i, j, dp = new Array(n + 1);
    for (i = 0; i <= n; i++) dp[i] = new Uint16Array(m + 1);
    for (i = n - 1; i >= 0; i--) for (j = m - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    var ops = []; i = 0; j = 0;
    while (i < n && j < m) { if (a[i] === b[j]) { ops.push({ t: ' ', s: a[i], a: i, b: j }); i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) { ops.push({ t: '-', s: a[i], a: i }); i++; } else { ops.push({ t: '+', s: b[j], b: j }); j++; } }
    while (i < n) { ops.push({ t: '-', s: a[i], a: i }); i++; } while (j < m) { ops.push({ t: '+', s: b[j], b: j }); j++; }
    return ops;
  }
  function countChanges(a, b) { var ops = lcsOps(splitLines(a), splitLines(b)), add = 0, del = 0; ops.forEach(function (o) { if (o.t === '+') add++; else if (o.t === '-') del++; }); return { add: add, del: del }; }
  function hunks(a, b, ctx) {
    ctx = ctx === undefined ? 3 : ctx;
    var ops = lcsOps(splitLines(a), splitLines(b)), out = [], i = 0, n = ops.length;
    while (i < n) {
      while (i < n && ops[i].t === ' ') i++; if (i >= n) break;
      var start = Math.max(0, i - ctx), end = i, lastChange = i;
      while (end < n) { if (ops[end].t !== ' ') lastChange = end; else if (end - lastChange > ctx * 2) break; end++; }
      var stop = Math.min(n, lastChange + ctx + 1), seg = ops.slice(start, stop), aStart = null, bStart = null, aLen = 0, bLen = 0;
      seg.forEach(function (o) { if (o.t !== '+') { if (aStart === null) aStart = o.a; aLen++; } if (o.t !== '-') { if (bStart === null) bStart = o.b; bLen++; } });
      if (aStart === null) { var f = ops.slice(0, start).filter(function (o) { return o.t !== '+'; }).length; aStart = f; } if (bStart === null) { bStart = ops.slice(0, start).filter(function (o) { return o.t !== '-'; }).length; }
      var oldLines = splitLines(a), fctx = '';
      for (var fi = (aLen ? aStart : aStart) - 1; fi >= 0; fi--) { if (/^[A-Za-z_$]/.test(oldLines[fi])) { fctx = ' ' + oldLines[fi].slice(0, 80); break; } }
      out.push({ header: '@@ -' + (aLen ? aStart + 1 : aStart) + (aLen === 1 ? '' : ',' + aLen) + ' +' + (bLen ? bStart + 1 : bStart) + (bLen === 1 ? '' : ',' + bLen) + ' @@' + fctx, lines: seg.map(function (o) { return o.t + o.s; }) });
      i = stop;
    }
    return out;
  }
  /* diff3-style merge: returns { text, conflict } */
  function merge3(base, ours, theirs, labels) {
    var B = splitLines(base), O = splitLines(ours), T = splitLines(theirs);
    function changes(X) {
      var ops = lcsOps(B, X), res = [], k = 0, bi = 0;
      while (k < ops.length) {
        if (ops[k].t === ' ') { bi++; k++; continue; }
        var bs = bi, rep = []; while (k < ops.length && ops[k].t !== ' ') { if (ops[k].t === '-') bi++; else rep.push(ops[k].s); k++; }
        res.push({ bs: bs, be: bi, rep: rep });
      }
      return res;
    }
    var co = changes(O), ct = changes(T), out = [], bi = 0, i = 0, j = 0, conflict = false;
    function same(x, y) { return x.length === y.length && x.every(function (v, n) { return v === y[n]; }); }
    while (i < co.length || j < ct.length) {
      var a = co[i], b = ct[j];
      if (a && (!b || a.be < b.bs || (a.be === b.bs && a.be > a.bs && b.be === b.bs && false))) { out = out.concat(B.slice(bi, a.bs), a.rep); bi = a.be; i++; continue; }
      if (b && (!a || b.be < a.bs)) { out = out.concat(B.slice(bi, b.bs), b.rep); bi = b.be; j++; continue; }
      var bs = Math.min(a.bs, b.bs), be = Math.max(a.be, b.be), ia = i, jb = j;
      // grow the overlapping region
      var changed = true; while (changed) { changed = false; while (co[ia + 1] && co[ia + 1].bs <= be) { be = Math.max(be, co[ia + 1].be); ia++; changed = true; } while (ct[jb + 1] && ct[jb + 1].bs <= be) { be = Math.max(be, ct[jb + 1].be); jb++; changed = true; } }
      var regionO = applyRegion(B, co.slice(i, ia + 1), bs, be), regionT = applyRegion(B, ct.slice(j, jb + 1), bs, be);
      out = out.concat(B.slice(bi, bs));
      if (same(regionO, regionT)) out = out.concat(regionO);
      else if (same(regionO, B.slice(bs, be))) out = out.concat(regionT);
      else if (same(regionT, B.slice(bs, be))) out = out.concat(regionO);
      else { conflict = true; out.push('<<<<<<< ' + labels[0]); out = out.concat(regionO); out.push('======='); out = out.concat(regionT); out.push('>>>>>>> ' + labels[1]); }
      bi = be; i = ia + 1; j = jb + 1;
    }
    out = out.concat(B.slice(bi));
    return { text: out.length ? out.join('\n') + '\n' : '', conflict: conflict };
  }
  function applyRegion(B, chs, bs, be) { var res = [], p = bs; chs.forEach(function (c) { res = res.concat(B.slice(p, c.bs), c.rep); p = c.be; }); return res.concat(B.slice(p, be)); }

  /* ───────────── engine ───────────── */
  var HOME = '/home/user';
  function createGit(shell) {
    var repos = {}, clock = Math.floor(Date.now() / 1000), seq = 0;
    var globalCfg = { 'user.name': 'Atlas Student', 'user.email': 'student@example.com', 'init.defaultbranch': 'main' };
    function nowTs() { clock = Math.max(clock + 1, Math.floor(Date.now() / 1000)); return clock; }
    function sha(seed) { return sim.crypto.createHash('sha1').update(seed + '|' + (++seq) + '|' + Math.random()).digest('hex'); }
    function short(s) { return s.slice(0, 7); }
    function fmtDate(ts) { var d = new Date(ts * 1000), D = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; function p(n) { return String(n).padStart(2, '0'); } return D[d.getUTCDay()] + ' ' + M[d.getUTCMonth()] + ' ' + d.getUTCDate() + ' ' + p(d.getUTCHours()) + ':' + p(d.getUTCMinutes()) + ':' + p(d.getUTCSeconds()) + ' ' + d.getUTCFullYear() + ' +0000'; }
    function fatal(c, m, code) { c.err('fatal: ' + m + '\n'); return code || 128; }

    function findRepo(cwd) { var d = cwd; while (true) { if (repos[d]) return repos[d]; if (d === '/') return null; d = path.dirname(d); } }
    function newRepo(root, branch) {
      var r = { root: root, head: { ref: branch || 'main' }, branches: {}, tags: {}, commits: {}, index: {}, stash: [], reflog: [], remotes: {}, remoteRefs: {}, upstream: {}, cfg: {}, merge: null, ignoreCache: null };
      repos[root] = r; sim.dirs[root] = 1; sim.dirs[root + '/.git'] = 1; return r;
    }
    function headSha(r) { return r.head.ref ? r.branches[r.head.ref] : r.head.sha; }
    function headTree(r) { var s = headSha(r); return s ? r.commits[s].tree : {}; }
    function curBranch(r) { return r.head.ref || null; }
    function cfgGet(r, k) { k = k.toLowerCase(); return r && r.cfg[k] !== undefined ? r.cfg[k] : globalCfg[k]; }
    function logRef(r, from, msg) { r.reflog.unshift({ sha: headSha(r) || '0000000000000000000000000000000000000000', msg: msg }); }

    /* working tree */
    function workFiles(r) { var out = {}, pre = r.root + '/'; Object.keys(sim.files).forEach(function (p) { if (p.indexOf(pre) === 0 && p.indexOf(pre + '.git/') !== 0) out[p.slice(pre.length)] = sim.files[p]; }); return out; }
    function writeWork(r, rel, content) { var full = r.root + '/' + rel, d = path.dirname(full); d.split('/').reduce(function (a, p) { if (!p) return a; a += '/' + p; sim.dirs[a] = 1; return a; }, ''); sim.files[full] = content; }
    function rmWork(r, rel) { delete sim.files[r.root + '/' + rel]; var d = path.dirname(r.root + '/' + rel); while (d.length > r.root.length) { var pre = d + '/'; if (Object.keys(sim.files).some(function (k) { return k.indexOf(pre) === 0; })) break; delete sim.dirs[d]; d = path.dirname(d); } }
    function ignored(r, rel) {
      var txt = sim.files[r.root + '/.gitignore']; if (!txt) return false;
      return splitLines(txt).some(function (l) { l = l.trim(); if (!l || l[0] === '#' || l[0] === '!') return false; var dir = /\/$/.test(l); l = l.replace(/^\//, '').replace(/\/$/, ''); var re = new RegExp('(^|/)' + l.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*/g, '@@').replace(/\*/g, '[^/]*').replace(/@@/g, '.*').replace(/\?/g, '[^/]') + (dir ? '/' : '(/|$)')); return re.test(rel + (dir ? '' : '')) || (dir && re.test(rel)); });
    }
    function relPath(r, c, p) { var abs = shell.abs(p), rel = path.relative(r.root, abs); return rel === '' ? '.' : rel; }

    /* status model */
    function status(r) {
      var head = headTree(r), idx = r.index, work = workFiles(r), staged = [], unstaged = [], untracked = [], unmerged = [], all = {};
      Object.keys(head).concat(Object.keys(idx)).forEach(function (p) { all[p] = 1; });
      Object.keys(all).sort().forEach(function (p) {
        if (r.merge && r.merge.conflicts[p]) { unmerged.push(p); return; }
        if (idx[p] !== undefined && head[p] === undefined) staged.push({ p: p, s: 'A' }); else if (idx[p] === undefined && head[p] !== undefined) staged.push({ p: p, s: 'D' }); else if (idx[p] !== head[p]) staged.push({ p: p, s: 'M' });
        if (idx[p] !== undefined) { if (work[p] === undefined) unstaged.push({ p: p, s: 'D' }); else if (work[p] !== idx[p]) unstaged.push({ p: p, s: 'M' }); }
      });
      Object.keys(work).sort().forEach(function (p) { if (idx[p] === undefined && !ignored(r, p)) untracked.push(p); });
      return { staged: staged, unstaged: unstaged, untracked: untracked, unmerged: unmerged };
    }
    function collapseUntracked(r, list) { var idxDirs = {}; Object.keys(r.index).forEach(function (p) { var parts = p.split('/'); for (var i = 1; i < parts.length; i++) idxDirs[parts.slice(0, i).join('/')] = 1; }); var out = [], seen = {}; list.forEach(function (p) { var parts = p.split('/'), shown = p; for (var i = 1; i < parts.length; i++) { var d = parts.slice(0, i).join('/'); if (!idxDirs[d]) { shown = d + '/'; break; } } if (!seen[shown]) { seen[shown] = 1; out.push(shown); } }); return out; }

    function upstreamInfo(r) {
      var b = curBranch(r), up = b && r.upstream[b]; if (!up) return null; var remoteSha = r.remoteRefs[up], local = r.branches[b];
      if (!remoteSha) return { name: up, gone: true };
      var ahead = 0, behind = 0; var ls = ancestors(r, local), rs = ancestors(r, remoteSha); ls.forEach(function (s) { if (!rs.has(s)) ahead++; }); rs.forEach(function (s) { if (!ls.has(s)) behind++; });
      return { name: up, ahead: ahead, behind: behind };
    }
    function ancestors(r, sha) { var seen = new Set(), stack = sha ? [sha] : []; while (stack.length) { var s = stack.pop(); if (seen.has(s) || !r.commits[s]) continue; seen.add(s); r.commits[s].parents.forEach(function (p) { stack.push(p); }); } return seen; }
    function isAncestor(r, a, b) { return ancestors(r, b).has(a); }
    function mergeBase(r, a, b) { var A = ancestors(r, a), best = null, bestT = -1, stack = [b], seen = new Set(); while (stack.length) { var s = stack.pop(); if (seen.has(s) || !r.commits[s]) continue; seen.add(s); if (A.has(s) && r.commits[s].time > bestT) { best = s; bestT = r.commits[s].time; } else if (!A.has(s)) r.commits[s].parents.forEach(function (p) { stack.push(p); }); } if (!best) { A.forEach(function (s) { if (seen.has(s) && r.commits[s].time > bestT) { best = s; bestT = r.commits[s].time; } }); } return best; }

    /* refs / rev parsing */
    function resolve(r, spec) {
      if (!spec) return null; var m;
      if ((m = spec.match(/^(.*?)([~^]+)(\d*)$/)) && m[1]) { var base = resolve(r, m[1]); if (!base) return null; var steps = m[2] === '^' || m[2] === '~' ? (m[3] ? +m[3] : 1) : m[2].length; if (m[2].indexOf('~') >= 0 && m[3]) steps = +m[3]; if (m[2] === '^' && m[3]) { return r.commits[base].parents[+m[3] - 1] || null; } var s = base; for (var i = 0; i < steps; i++) { s = r.commits[s] && r.commits[s].parents[0]; if (!s) return null; } return s; }
      if (spec === 'HEAD' || spec === '@') return headSha(r) || null;
      if (r.branches[spec]) return r.branches[spec]; if (r.tags[spec]) return r.tags[spec].sha; if (r.remoteRefs[spec]) return r.remoteRefs[spec];
      if (spec.indexOf('refs/heads/') === 0 && r.branches[spec.slice(11)]) return r.branches[spec.slice(11)];
      if (/^[0-9a-f]{4,40}$/.test(spec)) {
        var hits = Object.keys(r.commits).filter(function (s2) { return s2.indexOf(spec) === 0; }); if (hits.length === 1) return hits[0];
        // Lessons show made-up hashes (a3f9c12, abc1234); in a script run, map them onto a real commit so the example still runs.
        if (!hits.length && shell.__script && spec.length >= 6) { var chrono = Object.keys(r.commits).sort(function (x, y) { return r.commits[x].time - r.commits[y].time; }); if (chrono.length) return chrono[parseInt(spec.slice(0, 6), 16) % chrono.length]; }
      }
      var reflogM = spec.match(/^HEAD@\{(\d+)\}$/); if (reflogM && r.reflog[+reflogM[1]]) return r.reflog[+reflogM[1]].sha;
      return null;
    }
    function decorations(r, sha) {
      var d = [], hs = headSha(r); if (hs === sha) d.push(r.head.ref ? 'HEAD -> ' + r.head.ref : 'HEAD');
      Object.keys(r.branches).sort().forEach(function (b) { if (r.branches[b] === sha && !(r.head.ref === b && hs === sha)) d.push(b); });
      Object.keys(r.remoteRefs).sort().forEach(function (b) { if (r.remoteRefs[b] === sha) d.push(b); });
      Object.keys(r.tags).sort().forEach(function (t) { if (r.tags[t].sha === sha) d.push('tag: ' + t); });
      return d;
    }

    /* commit creation */
    function makeCommit(r, msg, parents, tree, opts) {
      opts = opts || {}; var id = sha(msg + JSON.stringify(parents)), ts = nowTs();
      r.commits[id] = { sha: id, tree: Object.assign({}, tree), parents: parents, msg: msg, author: cfgGet(r, 'user.name'), email: cfgGet(r, 'user.email'), time: ts, authorTime: opts.authorTime || ts };
      return id;
    }
    function treeStats(oldT, newT) {
      var files = [], all = {}; Object.keys(oldT).concat(Object.keys(newT)).forEach(function (p) { all[p] = 1; });
      Object.keys(all).sort().forEach(function (p) { if (oldT[p] === newT[p]) return; var st = oldT[p] === undefined ? 'A' : newT[p] === undefined ? 'D' : 'M', ch = countChanges(oldT[p] || '', newT[p] || ''); files.push({ p: p, s: st, add: ch.add, del: ch.del }); });
      return files;
    }
    function summary(files, showModes) {
      var add = 0, del = 0; files.forEach(function (f) { add += f.add; del += f.del; });
      var s = ' ' + files.length + ' file' + (files.length === 1 ? '' : 's') + ' changed'; if (add) s += ', ' + add + ' insertion' + (add === 1 ? '' : 's') + '(+)'; if (del) s += ', ' + del + ' deletion' + (del === 1 ? '' : 's') + '(-)';
      var out = s + '\n'; if (showModes) files.forEach(function (f) { if (f.s === 'A') out += ' create mode 100644 ' + f.p + '\n'; else if (f.s === 'D') out += ' delete mode 100644 ' + f.p + '\n'; }); return out;
    }
    function statBars(files) { var w = Math.max.apply(null, files.map(function (f) { return f.p.length; }).concat([0])); return files.map(function (f) { var n = f.add + f.del; return ' ' + f.p.padEnd(w) + ' | ' + String(n).padStart(String(Math.max.apply(null, files.map(function (x) { return x.add + x.del; }))).length) + ' ' + '+'.repeat(Math.min(f.add, 40)) + '-'.repeat(Math.min(f.del, 40)); }).join('\n') + '\n'; }
    function checkoutTree(r, tree, oldTree) {
      var work = workFiles(r);
      Object.keys(oldTree).forEach(function (p) { if (tree[p] === undefined && work[p] !== undefined) rmWork(r, p); });
      Object.keys(tree).forEach(function (p) { writeWork(r, p, tree[p]); });
      r.index = Object.assign({}, tree);
    }
    function dirtyPaths(r) { var st = status(r), s = {}; st.staged.forEach(function (x) { s[x.p] = 1; }); st.unstaged.forEach(function (x) { s[x.p] = 1; }); return s; }
    function switchTo(c, r, target, newTree, label) {
      var cur = headTree(r), dirty = dirtyPaths(r), blocked = Object.keys(dirty).filter(function (p) { return cur[p] !== newTree[p]; });
      var work = workFiles(r), untrackedBlock = Object.keys(newTree).filter(function (p) { return r.index[p] === undefined && work[p] !== undefined && work[p] !== newTree[p]; });
      if (blocked.length) { c.err('error: Your local changes to the following files would be overwritten by ' + (label || 'checkout') + ':\n' + blocked.map(function (p) { return '\t' + p + '\n'; }).join('') + 'Please commit your changes or stash them before you switch branches.\nAborting\n'); return 1; }
      if (untrackedBlock.length) { c.err('error: The following untracked working tree files would be overwritten by checkout:\n' + untrackedBlock.map(function (p) { return '\t' + p + '\n'; }).join('') + 'Please move or remove them before you switch branches.\nAborting\n'); return 1; }
      checkoutTree(r, newTree, cur); return 0;
    }

    /* diff output */
    function fileDiff(p, a, b, opts) {
      opts = opts || {}; var out = 'diff --git a/' + p + ' b/' + p + '\n';
      if (a === undefined) out += 'new file mode 100644\nindex 0000000..' + short(sha(p)) + '\n'; else if (b === undefined) out += 'deleted file mode 100644\nindex ' + short(sha(p)) + '..0000000\n'; else out += 'index ' + short(sha(a)) + '..' + short(sha(b)) + ' 100644\n';
      out += '--- ' + (a === undefined ? '/dev/null' : 'a/' + p) + '\n+++ ' + (b === undefined ? '/dev/null' : 'b/' + p) + '\n';
      hunks(a || '', b || '', 3).forEach(function (h) { out += h.header + '\n' + h.lines.join('\n') + '\n'; }); return out;
    }
    function diffTrees(oldT, newT, filter, stat) {
      var files = treeStats(oldT, newT).filter(function (f) { return !filter.length || filter.some(function (x) { return f.p === x || f.p.indexOf(x + '/') === 0 || x === '.'; }); });
      if (!files.length) return '';
      if (stat) return statBars(files) + summary(files, false);
      return files.map(function (f) { return fileDiff(f.p, oldT[f.p], newT[f.p]); }).join('');
    }

    /* graph */
    function orderedCommits(r, tips) {
      var seen = {}, list = []; function visit(s) { if (!s || seen[s] || !r.commits[s]) return; seen[s] = 1; list.push(r.commits[s]); r.commits[s].parents.forEach(visit); } tips.forEach(visit);
      list.sort(function (a, b) { return b.time - a.time || (b.sha < a.sha ? -1 : 1); }); // topological enough since time strictly increases
      return list;
    }
    function graphLines(r, list, fmtLine) {
      var lanes = [], out = [];
      list.forEach(function (cm) {
        var idx = lanes.indexOf(cm.sha);
        if (idx < 0) { idx = lanes.indexOf(null); if (idx < 0) { idx = lanes.length; lanes.push(cm.sha); } else lanes[idx] = cm.sha; }
        var merge = cm.parents.length > 1, cells = lanes.map(function (s, i) { return i === idx ? '*' : s ? '|' : ' '; });
        out.push(cells.join(' ') + (merge ? '  ' : '') + ' ' + fmtLine(cm));
        var nl = lanes.slice(); nl[idx] = cm.parents[0] || null;
        if (merge) {
          var p2 = cm.parents[1], ex = nl.indexOf(p2);
          var row = '', q;
          if (ex < 0) {
            nl.splice(idx + 1, 0, p2);
            for (q = 0; q < idx; q++) row += '| ';
            row += '|\\';
            for (q = idx + 2; q < nl.length; q++) row += ' ' + (nl[q] ? '|' : ' ');
          } else {
            for (q = 0; q < nl.length; q++) row += (q === idx ? '|' : q === ex ? '\\' : nl[q] ? '|' : ' ') + (q < nl.length - 1 ? ' ' : '');
          }
          out.push(row.replace(/\s+$/, ''));
        }
        var dup = -1; for (var j = 1; j < nl.length; j++) { if (nl[j] && nl.indexOf(nl[j]) < j) { dup = j; break; } }
        if (dup > 0) {
          var pre = []; for (var k = 0; k < dup; k++) pre.push(nl[k] ? '|' : ' ');
          var tail = ''; for (var t = dup + 1; t < nl.length; t++) tail += ' ' + (nl[t] ? '|' : ' ');
          out.push((pre.join(' ') + '/' + tail).replace(/\s+$/, '')); nl[dup] = null;
        }
        while (nl.length && nl[nl.length - 1] === null) nl.pop();
        lanes = nl;
      });
      return out;
    }

    /* ───────────── command implementations ───────────── */
    var G_ = {};
    G_['--version'] = G_.version = function (a, c) { c.out('git version 2.43.0\n'); };
    G_.help = function (a, c) { c.out('usage: git [--version] [--help] <command> [<args>]\n\nstart a working area:  init, clone\nwork on the current change:  add, mv, restore, rm\nexamine the history and state:  diff, log, show, status\ngrow, mark and tweak your common history:  branch, commit, merge, rebase, reset, switch, tag\ncollaborate:  fetch, pull, push, remote\nstash:  stash\n'); };
    G_.init = function (a, c) {
      var dir = a.filter(function (x) { return x[0] !== '-'; })[0], bi = a.indexOf('-b'), br = bi >= 0 ? a[bi + 1] : (a.filter(function (x) { return /^--initial-branch=/.test(x); })[0] || '').replace('--initial-branch=', '') || cfgGet(null, 'init.defaultBranch') || 'main';
      var root = dir ? shell.abs(dir) : shell.cwd; if (dir) { root.split('/').reduce(function (acc, p) { if (!p) return acc; acc += '/' + p; sim.dirs[acc] = 1; return acc; }, ''); }
      var existed = !!repos[root]; if (!existed) newRepo(root, br);
      c.out((existed ? 'Reinitialized existing' : 'Initialized empty') + ' Git repository in ' + root + '/.git/\n');
    };
    G_.config = function (a, c, r) {
      var scope = null, args = []; a.forEach(function (x) { if (x === '--global' || x === '--system') scope = 'g'; else if (x === '--local') scope = 'l'; else args.push(x); });
      var store = scope === 'g' || !r ? globalCfg : r.cfg;
      if (args[0] === '--list' || args[0] === '-l') { var all = Object.assign({}, globalCfg, r ? r.cfg : {}); Object.keys(all).sort().forEach(function (k) { c.out(k + '=' + all[k] + '\n'); }); return; }
      if (args[0] === '--get') { var v = cfgGet(r, args[1]); if (v === undefined) return 1; c.out(v + '\n'); return; }
      if (args[0] === '--unset') { delete store[args[1].toLowerCase()]; return; }
      if (args[0] === '--global' || args[0] === '-e') return;
      if (args.length === 1) { var val = scope === 'g' ? globalCfg[args[0].toLowerCase()] : cfgGet(r, args[0]); if (val === undefined) return 1; c.out(val + '\n'); return; }
      if (args.length >= 2) { store[args[0].toLowerCase()] = args.slice(1).join(' '); return; }
      c.err('error: wrong number of arguments\n'); return 129;
    };
    G_.status = function (a, c, r) {
      var st = status(r), short_ = a.some(function (x) { return /^-(s|sb)$|^--short$|^--porcelain$/.test(x); }), branchLine = a.some(function (x) { return /^-sb$|^-b$|^--branch$/.test(x); });
      if (short_) {
        var up = upstreamInfo(r);
        if (branchLine) c.out('## ' + (curBranch(r) || 'HEAD (no branch)') + (r.branches[curBranch(r)] ? '' : '.No commits yet on ' + curBranch(r)).replace('.No', '...No').replace('...No commits yet on ' + curBranch(r), '') + (up && !up.gone ? '...' + up.name + (up.ahead || up.behind ? ' [' + (up.ahead ? 'ahead ' + up.ahead : '') + (up.ahead && up.behind ? ', ' : '') + (up.behind ? 'behind ' + up.behind : '') + ']' : '') : '') + '\n');
        var rows = {}; st.staged.forEach(function (x) { rows[x.p] = (rows[x.p] || '  '); rows[x.p] = x.s + rows[x.p][1]; }); st.unstaged.forEach(function (x) { rows[x.p] = (rows[x.p] || '  '); rows[x.p] = rows[x.p][0] + x.s; }); st.unmerged.forEach(function (p) { rows[p] = 'UU'; });
        Object.keys(rows).sort().forEach(function (p) { c.out(rows[p] + ' ' + p + '\n'); }); collapseUntracked(r, st.untracked).forEach(function (p) { c.out('?? ' + p + '\n'); }); return;
      }
      var out = r.head.ref ? 'On branch ' + r.head.ref + '\n' : 'HEAD detached at ' + short(r.head.sha) + '\n', up2 = upstreamInfo(r);
      if (up2) { if (up2.gone) out += "Your branch is based on '" + up2.name + "', but the upstream is gone.\n"; else if (!up2.ahead && !up2.behind) out += "Your branch is up to date with '" + up2.name + "'.\n"; else if (up2.ahead && !up2.behind) out += "Your branch is ahead of '" + up2.name + "' by " + up2.ahead + ' commit' + (up2.ahead > 1 ? 's' : '') + '.\n  (use "git push" to publish your local commits)\n'; else if (!up2.ahead) out += "Your branch is behind '" + up2.name + "' by " + up2.behind + ' commit' + (up2.behind > 1 ? 's' : '') + ', and can be fast-forwarded.\n  (use "git pull" to update your local branch)\n'; else out += "Your branch and '" + up2.name + "' have diverged,\nand have " + up2.ahead + ' and ' + up2.behind + ' different commits each, respectively.\n  (use "git pull" to merge the remote branch into yours)\n'; }
      if (!headSha(r)) out += '\nNo commits yet\n';
      if (r.merge) out += '\nYou have unmerged paths.\n  (fix conflicts and run "git commit")\n  (use "git merge --abort" to abort the merge)\n';
      var label = { A: 'new file:   ', M: 'modified:   ', D: 'deleted:    ' };
      if (st.staged.length) out += '\nChanges to be committed:\n  (use "git ' + (headSha(r) ? 'restore --staged <file>..." to unstage)\n' : 'rm --cached <file>..." to unstage)\n') + st.staged.map(function (x) { return '\t' + label[x.s] + x.p + '\n'; }).join('');
      if (st.unmerged.length) out += '\nUnmerged paths:\n  (use "git add <file>..." to mark resolution)\n' + st.unmerged.map(function (p) { return '\tboth modified:   ' + p + '\n'; }).join('');
      if (st.unstaged.length) out += '\nChanges not staged for commit:\n  (use "git add' + (st.unstaged.some(function (x) { return x.s === 'D'; }) ? '/rm' : '') + ' <file>..." to update what will be committed)\n  (use "git restore <file>..." to discard changes in working directory)\n' + st.unstaged.map(function (x) { return '\t' + label[x.s] + x.p + '\n'; }).join('');
      var ut = collapseUntracked(r, st.untracked); if (ut.length) out += '\nUntracked files:\n  (use "git add <file>..." to include in what will be committed)\n' + ut.map(function (p) { return '\t' + p + '\n'; }).join('');
      if (!st.staged.length && !st.unstaged.length && !st.unmerged.length) out += '\n' + (ut.length ? 'nothing added to commit but untracked files present (use "git add" to track)\n' : headSha(r) ? 'nothing to commit, working tree clean\n' : 'nothing to commit (create/copy files and use "git add" to track)\n');
      else if (!st.staged.length && !st.unmerged.length) out += '\nno changes added to commit (use "git add" and/or "git commit -a")\n';
      c.out(out);
    };
    G_.add = function (a, c, r) {
      var paths = a.filter(function (x) { return x[0] !== '-'; }), all = a.some(function (x) { return x === '-A' || x === '--all' || x === '-u' || x === '--update'; }), work = workFiles(r);
      if (!paths.length && !all) { c.out('Nothing specified, nothing added.\nhint: Maybe you wanted to say \'git add .\'?\n'); return; }
      if (all && !paths.length) paths = ['.'];
      var code = 0;
      paths.forEach(function (p) {
        var rel = relPath(r, c, p), matched = false;
        Object.keys(work).forEach(function (f) { if (rel === '.' || f === rel || f.indexOf(rel + '/') === 0) { if (ignored(r, f) && r.index[f] === undefined && f !== rel) return; if (ignored(r, f) && f === rel && r.index[f] === undefined) { c.err('The following paths are ignored by one of your .gitignore files:\n' + f + '\nhint: Use -f if you really want to add them.\n'); code = 1; matched = true; return; } r.index[f] = work[f]; matched = true; if (r.merge) delete r.merge.conflicts[f]; } });
        Object.keys(r.index).forEach(function (f) { if (work[f] === undefined && (rel === '.' || f === rel || f.indexOf(rel + '/') === 0)) { delete r.index[f]; matched = true; if (r.merge) delete r.merge.conflicts[f]; } });
        if (!matched) { c.err("fatal: pathspec '" + p + "' did not match any files\n"); code = 128; }
      });
      return code;
    };
    G_.rm = function (a, c, r) { var cached = a.indexOf('--cached') >= 0, code = 0; a.filter(function (x) { return x[0] !== '-'; }).forEach(function (p) { var rel = relPath(r, c, p); if (r.index[rel] === undefined) { c.err("fatal: pathspec '" + p + "' did not match any files\n"); code = 128; return; } delete r.index[rel]; if (!cached) rmWork(r, rel); c.out("rm '" + rel + "'\n"); }); return code; };
    G_.mv = function (a, c, r) { var args = a.filter(function (x) { return x[0] !== '-'; }), from = relPath(r, c, args[0]), to = relPath(r, c, args[1]); if (r.index[from] === undefined) { c.err('fatal: not under version control, source=' + args[0] + ', destination=' + args[1] + '\n'); return 128; } writeWork(r, to, sim.files[r.root + '/' + from]); rmWork(r, from); r.index[to] = r.index[from]; delete r.index[from]; };
    G_.commit = function (a, c, r) {
      var msgs = [], amend = false, all = false, allowEmpty = false, noEdit = false;
      for (var i = 0; i < a.length; i++) { var x = a[i]; if (x === '-m' || x === '--message') msgs.push(a[++i]); else if (/^-m./.test(x)) msgs.push(x.slice(2)); else if (/^--message=/.test(x)) msgs.push(x.slice(10)); else if (x === '--amend') amend = true; else if (x === '--allow-empty') allowEmpty = true; else if (x === '--no-edit') noEdit = true; else if (/^-[a-z]*a[a-z]*$/.test(x) && x[1] !== '-') { all = true; if (/m/.test(x)) msgs.push(a[++i]); } }
      if (all) { var work = workFiles(r); Object.keys(r.index).forEach(function (p) { if (work[p] === undefined) delete r.index[p]; else r.index[p] = work[p]; }); }
      var st = status(r);
      if (r.merge && st.unmerged.length) { c.err('error: Committing is not possible because you have unmerged files.\nhint: Fix them up in the work tree, and then use \'git add/rm <file>\'\nhint: as appropriate to mark resolution and make a commit.\nfatal: Exiting because of an unresolved conflict.\n'); return 128; }
      var head = headSha(r), ht = headTree(r), changed = treeStats(amend && head ? (r.commits[head].parents[0] ? r.commits[r.commits[head].parents[0]].tree : {}) : ht, r.index);
      if (!changed.length && !allowEmpty && !r.merge && !(amend && (msgs.length || noEdit || true))) {
        var out = (r.head.ref ? 'On branch ' + r.head.ref + '\n' : 'HEAD detached\n') + (st.unstaged.length || st.untracked.length ? '' : (headSha(r) ? 'nothing to commit, working tree clean\n' : 'nothing to commit (create/copy files and use "git add" to track)\n'));
        if (st.unstaged.length) out += 'Changes not staged for commit:\n' + st.unstaged.map(function (x2) { return '\t' + (x2.s === 'D' ? 'deleted:    ' : 'modified:   ') + x2.p + '\n'; }).join('') + '\nno changes added to commit (use "git add" and/or "git commit -a")\n';
        else if (st.untracked.length) out += 'Untracked files:\n' + collapseUntracked(r, st.untracked).map(function (p) { return '\t' + p + '\n'; }).join('') + '\nnothing added to commit but untracked files present (use "git add" to track)\n';
        c.out(out); return 1;
      }
      if (!msgs.length && !(amend && head)) { c.err('Aborting commit due to empty commit message.\n(the simulator has no editor — use: git commit -m "message")\n'); return 1; }
      var msg = msgs.length ? msgs.join('\n\n') : r.commits[head].msg, parents = amend && head ? r.commits[head].parents.slice() : head ? [head] : [];
      if (r.merge) { parents = [head, r.merge.theirs]; if (!msgs.length) msg = r.merge.msg; }
      var prevTree = amend && head ? (parents[0] ? r.commits[parents[0]].tree : {}) : ht, id = makeCommit(r, msg, parents, r.index, amend && head ? { authorTime: r.commits[head].authorTime } : {});
      var tag = !head && !amend ? ' (root-commit)' : '', files = treeStats(prevTree, r.index);
      if (r.head.ref) r.branches[r.head.ref] = id; else r.head.sha = id; logRef(r, null, (amend ? 'commit (amend): ' : r.merge ? 'commit (merge): ' : (tag ? 'commit (initial): ' : 'commit: ')) + msg.split('\n')[0]); r.merge = null;
      c.out('[' + (r.head.ref || 'detached HEAD') + tag + ' ' + short(id) + '] ' + msg.split('\n')[0] + '\n' + (files.length ? summary(files, true) : ''));
    };
    G_.log = function (a, c, r) {
      var oneline = false, graph = false, allRefs = false, n = Infinity, stat = false, pretty = null, revs = [], grepPat = null, authorPat = null, decorate = true, since = null, i;
      for (i = 0; i < a.length; i++) { var x = a[i]; if (x === '--oneline') oneline = true; else if (x === '--graph') graph = true; else if (x === '--all') allRefs = true; else if (x === '--stat') stat = true; else if (x === '-n' || x === '--max-count') n = +a[++i]; else if (/^-\d+$/.test(x)) n = +x.slice(1); else if (/^--max-count=/.test(x)) n = +x.slice(12); else if (/^--pretty=|^--format=/.test(x)) pretty = x.replace(/^--(pretty|format)=/, '').replace(/^format:/, ''); else if (x === '--pretty' || x === '--format') pretty = a[++i]; else if (/^--grep=/.test(x)) grepPat = x.slice(7); else if (/^--author=/.test(x)) authorPat = x.slice(9); else if (x === '--decorate') decorate = true; else if (x[0] !== '-') revs.push(x); }
      if (pretty === 'oneline') { oneline = true; pretty = null; }
      var tips = allRefs ? Object.keys(r.branches).map(function (b) { return r.branches[b]; }).concat(Object.keys(r.remoteRefs).map(function (b) { return r.remoteRefs[b]; }), headSha(r) ? [headSha(r)] : []) : revs.length ? revs.map(function (v) { var rr = v.split('..'); return resolve(r, rr[rr.length - 1]); }) : [headSha(r)];
      if (tips.some(function (t) { return !t; })) { if (!headSha(r) && !revs.length && !allRefs) { c.err("fatal: your current branch '" + r.head.ref + "' does not have any commits yet\n"); return 128; } c.err("fatal: ambiguous argument '" + revs[0] + "': unknown revision or path not in the working tree.\n"); return 128; }
      var list = orderedCommits(r, tips);
      if (revs[0] && /\.\./.test(revs[0])) { var ex = revs[0].split('..')[0], exSet = ancestors(r, resolve(r, ex)); list = list.filter(function (cm) { return !exSet.has(cm.sha); }); }
      if (grepPat) list = list.filter(function (cm) { return new RegExp(grepPat, 'i').test(cm.msg); }); if (authorPat) list = list.filter(function (cm) { return cm.author.indexOf(authorPat) >= 0 || cm.email.indexOf(authorPat) >= 0; });
      list = list.slice(0, n);
      function deco(cm) { var d = decorations(r, cm.sha); return d.length ? ' (' + d.join(', ') + ')' : ''; }
      function fmtPretty(cm) { return pretty.replace(/%H/g, cm.sha).replace(/%h/g, short(cm.sha)).replace(/%an/g, cm.author).replace(/%ae/g, cm.email).replace(/%s/g, cm.msg.split('\n')[0]).replace(/%b/g, cm.msg.split('\n').slice(2).join('\n')).replace(/%ad|%aD/g, fmtDate(cm.authorTime)).replace(/%ar/g, 'just now').replace(/%cr/g, 'just now').replace(/%d/g, deco(cm)).replace(/%n/g, '\n').replace(/%Cred|%Cgreen|%Cblue|%Creset|%C\w+/g, ''); }
      if (graph) { var lines = graphLines(r, list, function (cm) { return oneline || pretty ? (pretty ? fmtPretty(cm) : short(cm.sha) + deco(cm) + ' ' + cm.msg.split('\n')[0]) : short(cm.sha) + deco(cm) + ' ' + cm.msg.split('\n')[0]; }); c.out(lines.join('\n') + '\n'); return; }
      if (oneline) { list.forEach(function (cm) { c.out(short(cm.sha) + deco(cm) + ' ' + cm.msg.split('\n')[0] + '\n'); }); return; }
      if (pretty) { list.forEach(function (cm) { c.out(fmtPretty(cm) + '\n'); }); return; }
      list.forEach(function (cm, idx) {
        c.out((idx ? '\n' : '') + 'commit ' + cm.sha + deco(cm) + '\n' + (cm.parents.length > 1 ? 'Merge: ' + cm.parents.map(short).join(' ') + '\n' : '') + 'Author: ' + cm.author + ' <' + cm.email + '>\nDate:   ' + fmtDate(cm.authorTime) + '\n\n' + cm.msg.split('\n').map(function (l) { return '    ' + l; }).join('\n') + '\n');
        if (stat) { var pt = cm.parents[0] ? r.commits[cm.parents[0]].tree : {}, fs_ = treeStats(pt, cm.tree); if (fs_.length) c.out('\n' + statBars(fs_) + summary(fs_, false)); }
      });
    };
    G_.show = function (a, c, r) {
      var spec = a.filter(function (x) { return x[0] !== '-'; })[0] || 'HEAD', id = resolve(r, spec); if (!id) { c.err("fatal: ambiguous argument '" + spec + "': unknown revision or path not in the working tree.\n"); return 128; }
      var cm = r.commits[id]; c.out('commit ' + cm.sha + (function () { var d = decorations(r, cm.sha); return d.length ? ' (' + d.join(', ') + ')' : ''; })() + '\nAuthor: ' + cm.author + ' <' + cm.email + '>\nDate:   ' + fmtDate(cm.authorTime) + '\n\n' + cm.msg.split('\n').map(function (l) { return '    ' + l; }).join('\n') + '\n');
      var d = diffTrees(cm.parents[0] ? r.commits[cm.parents[0]].tree : {}, cm.tree, [], a.indexOf('--stat') >= 0); if (d) c.out('\n' + d);
    };
    G_.diff = function (a, c, r) {
      var staged = a.some(function (x) { return x === '--staged' || x === '--cached'; }), stat = a.indexOf('--stat') >= 0, args = a.filter(function (x) { return x[0] !== '-'; }), dd = args.indexOf('--'), revs = [], files = [];
      args.forEach(function (x) { if (resolve(r, x.split('..')[0]) && !(sim.files[shell.abs(x)] !== undefined)) revs.push(x); else files.push(relPath(r, c, x)); });
      var oldT, newT, work = workFiles(r); void dd;
      if (revs.length >= 1) { var pair = revs.length === 1 && /\.\./.test(revs[0]) ? revs[0].split(/\.{2,3}/) : revs; var a1 = resolve(r, pair[0]), b1 = pair[1] ? resolve(r, pair[1]) : null; oldT = r.commits[a1].tree; newT = b1 ? r.commits[b1].tree : work; if (!b1) { newT = {}; Object.keys(r.index).forEach(function (p) { if (work[p] !== undefined) newT[p] = work[p]; }); } }
      else if (staged) { oldT = headTree(r); newT = r.index; }
      else { oldT = r.index; newT = {}; Object.keys(r.index).forEach(function (p) { if (work[p] !== undefined) newT[p] = work[p]; }); }
      var out = diffTrees(oldT, newT, files, stat); if (out) c.out(out);
    };
    G_.branch = function (a, c, r) {
      var flags = a.filter(function (x) { return x[0] === '-'; }), names = a.filter(function (x) { return x[0] !== '-'; }), del = flags.some(function (f) { return f === '-d' || f === '-D' || f === '--delete'; }), force = flags.indexOf('-D') >= 0 || flags.indexOf('-f') >= 0, mv = flags.some(function (f) { return f === '-m' || f === '-M'; }), verbose = flags.some(function (f) { return f === '-v' || f === '-vv'; }), showAll = flags.indexOf('-a') >= 0, remote = flags.indexOf('-r') >= 0;
      if (flags.some(function (f) { return f === '--show-current'; })) { c.out((curBranch(r) || '') + '\n'); return; }
      if (flags.some(function (f) { return f === '-u' || f === '--set-upstream-to'; }) || a.some(function (x) { return /^--set-upstream-to=/.test(x); })) { var up = (a.filter(function (x) { return /^--set-upstream-to=/.test(x); })[0] || '').replace('--set-upstream-to=', '') || names[0]; r.upstream[curBranch(r)] = up; c.out("branch '" + curBranch(r) + "' set up to track '" + up + "'.\n"); return; }
      if (del) { var code = 0; names.forEach(function (n) { if (!r.branches[n]) { c.err("error: branch '" + n + "' not found.\n"); code = 1; return; } if (r.head.ref === n) { c.err("error: Cannot delete branch '" + n + "' checked out at '" + r.root + "'\n"); code = 1; return; } if (!force && !isAncestor(r, r.branches[n], headSha(r))) { c.err("error: The branch '" + n + "' is not fully merged.\nIf you are sure you want to delete it, run 'git branch -D " + n + "'.\n"); code = 1; return; } c.out("Deleted branch " + n + ' (was ' + short(r.branches[n]) + ').\n'); delete r.branches[n]; }); return code; }
      if (mv) { var from = names.length > 1 ? names[0] : curBranch(r), to = names[names.length - 1]; if (!r.branches[from] && r.head.ref !== from) { c.err("error: refname refs/heads/" + from + " not found\nfatal: Branch rename failed\n"); return 128; } if (r.branches[to] && !flags.indexOf('-M') < 0) { c.err("fatal: a branch named '" + to + "' already exists\n"); return 128; } if (r.branches[from] !== undefined) { r.branches[to] = r.branches[from]; delete r.branches[from]; } if (r.head.ref === from) r.head.ref = to; return; }
      if (names.length) { var nm = names[0], start = names[1] ? resolve(r, names[1]) : headSha(r); if (!headSha(r) && !names[1]) { c.err('fatal: not a valid object name: \'' + (curBranch(r) || 'master') + '\'\n'); return 128; } if (r.branches[nm]) { c.err("fatal: a branch named '" + nm + "' already exists\n"); return 128; } if (!start) { c.err("fatal: not a valid object name: '" + names[1] + "'\n"); return 128; } r.branches[nm] = start; return; }
      var list = remote ? [] : Object.keys(r.branches).sort(); var lines = list.map(function (b) { var cm = r.commits[r.branches[b]]; return (r.head.ref === b ? '* ' : '  ') + b + (verbose ? ' ' + short(cm.sha) + ' ' + cm.msg.split('\n')[0] : ''); });
      if (!r.head.ref && headSha(r)) lines.unshift('* (HEAD detached at ' + short(r.head.sha) + ')'); if (showAll || remote) Object.keys(r.remoteRefs).sort().forEach(function (b) { lines.push('  ' + (showAll ? 'remotes/' : '') + b); });
      if (r.head.ref && !r.branches[r.head.ref] && !remote) lines.unshift('* ' + r.head.ref); c.out(lines.length ? lines.join('\n') + '\n' : '');
    };
    function doSwitch(a, c, r, isSwitch) {
      var create = null, force = false, args = [], i;
      for (i = 0; i < a.length; i++) { var x = a[i]; if (x === '-b' || x === '-c' || x === '-B' || x === '-C' || x === '--create') create = a[++i]; else if (x === '-f' || x === '--force') force = true; else if (x === '--detach' || x === '-d') args.push('--detach'); else if (x === '--') { args.push('--'); } else args.push(x); }
      var sep = args.indexOf('--'), fileArgs = !isSwitch && sep >= 0 ? args.slice(sep + 1) : null;
      if (!isSwitch && (fileArgs || (args.length && args[0] === '.'))) { var src = fileArgs ? args.slice(0, sep) : []; var treeSrc = src.length ? r.commits[resolve(r, src[0])].tree : r.index; (fileArgs || ['.']).forEach(function (p) { var rel = relPath(r, c, p); Object.keys(treeSrc).forEach(function (f) { if (rel === '.' || f === rel || f.indexOf(rel + '/') === 0) writeWork(r, f, treeSrc[f]); }); }); return; }
      if (create) { var start = args[0] ? resolve(r, args[0]) : headSha(r); if (r.branches[create] && !force) { c.err("fatal: a branch named '" + create + "' already exists\n"); return 128; } if (!start && headSha(r)) { c.err("fatal: '" + args[0] + "' is not a commit and a branch '" + create + "' cannot be created from it\n"); return 128; } if (start) r.branches[create] = start; var oldName = r.head.ref; r.head = { ref: create }; if (!start) { /* unborn branch */ } logRef(r, null, 'checkout: moving from ' + (oldName || 'HEAD') + ' to ' + create); c.out('Switched to a new branch \'' + create + '\'\n'); if (start && args[0] && start !== r.branches[oldName]) { var e = switchTo(c, r, create, r.commits[start].tree); if (e) { r.head = { ref: oldName }; delete r.branches[create]; return e; } } return; }
      var target = args.filter(function (x) { return x !== '--detach'; })[0]; if (!target) { c.err('fatal: missing branch or commit argument\n'); return 128; }
      if (target === '-') { var prev = null; for (var ri = 0; ri < r.reflog.length && !prev; ri++) { var rm = r.reflog[ri].msg.match(/^checkout: moving from (\S+) to /); if (rm) prev = rm[1]; } if (!prev) { c.err('fatal: invalid reference: @{-1}\n'); return 128; } target = prev; }
      var detach = args.indexOf('--detach') >= 0;
      if (r.branches[target] && !detach) {
        if (r.head.ref === target) { c.out("Already on '" + target + "'\n"); return; }
        var er = switchTo(c, r, target, r.commits[r.branches[target]].tree); if (er) return er; var old = r.head.ref || short(r.head.sha); r.head = { ref: target }; logRef(r, null, 'checkout: moving from ' + old + ' to ' + target);
        c.out("Switched to branch '" + target + "'\n"); var up = upstreamInfo(r); if (up && !up.gone) { if (!up.ahead && !up.behind) c.out("Your branch is up to date with '" + up.name + "'.\n"); else if (up.ahead) c.out("Your branch is ahead of '" + up.name + "' by " + up.ahead + ' commit' + (up.ahead > 1 ? 's' : '') + '.\n  (use "git push" to publish your local commits)\n'); } return;
      }
      if (isSwitch && !detach && r.remoteRefs['origin/' + target]) { r.branches[target] = r.remoteRefs['origin/' + target]; r.upstream[target] = 'origin/' + target; return doSwitch([target], c, r, isSwitch); }
      if (!isSwitch && r.remoteRefs['origin/' + target] && !r.branches[target] && !resolve(r, target)) { r.branches[target] = r.remoteRefs['origin/' + target]; r.upstream[target] = 'origin/' + target; var e2 = switchTo(c, r, target, r.commits[r.branches[target]].tree); if (e2) return e2; r.head = { ref: target }; c.out("branch '" + target + "' set up to track 'origin/" + target + "'.\nSwitched to a new branch '" + target + "'\n"); return; }
      var id = resolve(r, target);
      if (!id) { if (!isSwitch && r.index[relPath(r, c, target)] !== undefined) { writeWork(r, relPath(r, c, target), r.index[relPath(r, c, target)]); return; } c.err(isSwitch ? "fatal: invalid reference: " + target + '\n' : "error: pathspec '" + target + "' did not match any file(s) known to git\n"); return isSwitch ? 128 : 1; }
      if (isSwitch && !detach) { c.err("fatal: a branch is expected, got commit '" + target + "'\nhint: If you want to detach HEAD at the commit, try again with the --detach option.\n"); return 128; }
      var er2 = switchTo(c, r, target, r.commits[id].tree); if (er2) return er2; r.head = { sha: id }; logRef(r, null, 'checkout: moving to ' + target);
      c.err("Note: switching to '" + target + "'.\n\nYou are in 'detached HEAD' state. You can look around, make experimental\nchanges and commit them, and you can discard any commits you make in this\nstate without impacting any branches by switching back to a branch.\n\nIf you want to create a new branch to retain commits you create, you may\ndo so (now or later) by using -c with the switch command. Example:\n\n  git switch -c <new-branch-name>\n\nOr undo this operation with:\n\n  git switch -\n\nTurn off this advice by setting config variable advice.detachedHead to false\n\nHEAD is now at " + short(id) + ' ' + r.commits[id].msg.split('\n')[0] + '\n');
    }
    G_.checkout = function (a, c, r) { return doSwitch(a, c, r, false); };
    G_.switch = function (a, c, r) { return doSwitch(a, c, r, true); };
    G_.restore = function (a, c, r) {
      var staged = a.some(function (x) { return x === '--staged' || x === '-S'; }), worktree = a.some(function (x) { return x === '--worktree' || x === '-W'; }) || !staged, srcIdx = a.findIndex(function (x) { return x === '--source' || x === '-s'; }), srcArg = srcIdx >= 0 ? a[srcIdx + 1] : (a.filter(function (x) { return /^--source=/.test(x); })[0] || '').replace('--source=', '') || null;
      var paths = a.filter(function (x, i) { return x[0] !== '-' && (srcIdx < 0 || i !== srcIdx + 1) || (x === '.' ); }).filter(function (x) { return x !== srcArg; }); if (!paths.length) { c.err('fatal: you must specify path(s) to restore\n'); return 128; }
      var src = srcArg ? r.commits[resolve(r, srcArg)].tree : (staged ? headTree(r) : r.index), code = 0;
      paths.forEach(function (p) { var rel = relPath(r, c, p), hit = false; var keys = Object.keys(src).concat(Object.keys(r.index), Object.keys(workFiles(r))); keys.forEach(function (f, i) { if (keys.indexOf(f) !== i) return; if (!(rel === '.' || f === rel || f.indexOf(rel + '/') === 0)) return; hit = true; if (staged) { if (src[f] === undefined) delete r.index[f]; else r.index[f] = src[f]; } if (worktree && !(staged && !a.some(function (x) { return x === '--worktree' || x === '-W'; }))) { if (src[f] === undefined) rmWork(r, f); else writeWork(r, f, src[f]); } }); if (!hit) { c.err("error: pathspec '" + p + "' did not match any file(s) known to git\n"); code = 1; } });
      return code;
    };
    G_.reset = function (a, c, r) {
      var mode = a.some(function (x) { return x === '--hard'; }) ? 'hard' : a.some(function (x) { return x === '--soft'; }) ? 'soft' : 'mixed', args = a.filter(function (x) { return x[0] !== '-'; }), target = args[0] && (resolve(r, args[0]) ? args.shift() : null);
      if (args.length && !target) { var head = headTree(r); args.forEach(function (p) { var rel = relPath(r, c, p); Object.keys(Object.assign({}, head, r.index)).forEach(function (f) { if (rel === '.' || f === rel || f.indexOf(rel + '/') === 0) { if (head[f] === undefined) delete r.index[f]; else r.index[f] = head[f]; } }); }); var st0 = status(r); if (st0.unstaged.length) c.out('Unstaged changes after reset:\n' + st0.unstaged.map(function (x) { return x.s + '\t' + x.p + '\n'; }).join('')); return; }
      var id = target ? resolve(r, target) : headSha(r); if (!id) { c.err("fatal: ambiguous argument '" + target + "': unknown revision or path not in the working tree.\n"); return 128; }
      var oldTree = headTree(r); if (r.head.ref) r.branches[r.head.ref] = id; else r.head.sha = id; logRef(r, null, 'reset: moving to ' + (target || 'HEAD'));
      var tree = r.commits[id].tree; if (mode !== 'soft') r.index = Object.assign({}, tree);
      if (mode === 'hard') { checkoutTree(r, tree, Object.assign({}, oldTree, workFiles(r))); r.merge = null; c.out('HEAD is now at ' + short(id) + ' ' + r.commits[id].msg.split('\n')[0] + '\n'); }
      else if (mode === 'mixed') { var s = status(r); if (s.unstaged.length) c.out('Unstaged changes after reset:\n' + s.unstaged.map(function (x) { return x.s + '\t' + x.p + '\n'; }).join('')); }
    };
    function applyCommit(r, c, cm, invert) {
      var parentTree = cm.parents[0] ? r.commits[cm.parents[0]].tree : {}, from = invert ? cm.tree : parentTree, to = invert ? parentTree : cm.tree, cur = r.index, next = Object.assign({}, cur), conflicts = [];
      treeStats(from, to).forEach(function (f) {
        var b = from[f.p], t = to[f.p], o = cur[f.p];
        if (o === b) { if (t === undefined) delete next[f.p]; else next[f.p] = t; }
        else if (o === t) { /* already applied */ }
        else { var m = merge3(b || '', o || '', t || '', ['HEAD', short(cm.sha) + ' ' + cm.msg.split('\n')[0]]); next[f.p] = m.text; if (m.conflict) conflicts.push(f.p); }
      });
      return { tree: next, conflicts: conflicts };
    }
    G_.revert = function (a, c, r) {
      var spec = a.filter(function (x) { return x[0] !== '-'; })[0] || 'HEAD', noCommit = a.indexOf('-n') >= 0 || a.indexOf('--no-commit') >= 0, id = resolve(r, spec); if (!id) { c.err("fatal: bad revision '" + spec + "'\n"); return 128; }
      var cm = r.commits[id], res = applyCommit(r, c, cm, true);
      if (res.conflicts.length) { res.conflicts.forEach(function (p) { c.out('CONFLICT (content): Merge conflict in ' + p + '\n'); }); c.err('error: could not revert ' + short(id) + '... ' + cm.msg.split('\n')[0] + '\nhint: After resolving the conflicts, mark them with "git add/rm <pathspec>", then run "git revert --continue".\n'); Object.keys(res.tree).forEach(function (p) { writeWork(r, p, res.tree[p]); }); return 1; }
      var oldTree = headTree(r); checkoutTree(r, res.tree, Object.assign({}, oldTree)); if (noCommit) return;
      var msg = 'Revert "' + cm.msg.split('\n')[0] + '"\n\nThis reverts commit ' + cm.sha + '.', nid = makeCommit(r, msg, [headSha(r)], res.tree); r.branches[r.head.ref] = nid; logRef(r, null, 'revert: Revert "' + cm.msg.split('\n')[0] + '"');
      c.out('[' + r.head.ref + ' ' + short(nid) + '] Revert "' + cm.msg.split('\n')[0] + '"\n' + summary(treeStats(oldTree, res.tree), true));
    };
    G_['cherry-pick'] = function (a, c, r) {
      var spec = a.filter(function (x) { return x[0] !== '-'; })[0], id = resolve(r, spec); if (!id) { c.err("fatal: bad revision '" + spec + "'\n"); return 128; }
      var cm = r.commits[id], res = applyCommit(r, c, cm, false);
      if (res.conflicts.length) { res.conflicts.forEach(function (p) { c.out('CONFLICT (content): Merge conflict in ' + p + '\n'); }); c.err('error: could not apply ' + short(id) + '... ' + cm.msg.split('\n')[0] + '\n'); Object.keys(res.tree).forEach(function (p) { writeWork(r, p, res.tree[p]); }); return 1; }
      var old = headTree(r); checkoutTree(r, res.tree, old); var nid = makeCommit(r, cm.msg, [headSha(r)], res.tree, { authorTime: cm.authorTime }); if (r.head.ref) r.branches[r.head.ref] = nid; else r.head.sha = nid; logRef(r, null, 'cherry-pick: ' + cm.msg.split('\n')[0]);
      c.out('[' + (r.head.ref || 'detached HEAD') + ' ' + short(nid) + '] ' + cm.msg.split('\n')[0] + '\n Date: ' + fmtDate(cm.authorTime) + '\n' + summary(treeStats(old, res.tree), true));
    };
    G_.merge = function (a, c, r) {
      if (a.indexOf('--abort') >= 0) { if (!r.merge) { c.err('fatal: There is no merge to abort (MERGE_HEAD missing).\n'); return 128; } checkoutTree(r, headTree(r), Object.assign({}, workFiles(r))); r.merge = null; return; }
      var noff = a.indexOf('--no-ff') >= 0, squash = a.indexOf('--squash') >= 0, ffOnly = a.indexOf('--ff-only') >= 0, mi = a.indexOf('-m'), customMsg = mi >= 0 ? a[mi + 1] : null, name = a.filter(function (x, i) { return x[0] !== '-' && (mi < 0 || i !== mi + 1); })[0];
      if (!name) { c.err('fatal: No remote for the current branch.\n'); return 128; } var theirs = resolve(r, name); if (!theirs) { c.err(name + ' - not something we can merge\n'); return 1; }
      var ours = headSha(r); if (!ours) { c.err('fatal: cannot merge into an unborn branch here\n'); return 128; }
      var dirty = status(r); if (dirty.staged.length || dirty.unstaged.length) { var touched = treeStats(r.commits[ours].tree, r.commits[theirs].tree).map(function (f) { return f.p; }).filter(function (p) { return dirtyPaths(r)[p]; }); if (touched.length) { c.err('error: Your local changes to the following files would be overwritten by merge:\n' + touched.map(function (p) { return '\t' + p + '\n'; }).join('') + 'Please commit your changes or stash them before you merge.\nAborting\n'); return 1; } }
      if (ours === theirs || isAncestor(r, theirs, ours)) { c.out('Already up to date.\n'); return; }
      var label = r.branches[name] ? "branch '" + name + "'" : r.remoteRefs[name] ? "remote-tracking branch '" + name + "'" : "commit '" + name + "'";
      if (isAncestor(r, ours, theirs) && !noff && !squash) {
        var oldT = headTree(r), newT = r.commits[theirs].tree; c.out('Updating ' + short(ours) + '..' + short(theirs) + '\nFast-forward\n'); var files = treeStats(oldT, newT); c.out(statBars(files) + summary(files, true));
        checkoutTree(r, newT, oldT); r.branches[r.head.ref] = theirs; logRef(r, null, 'merge ' + name + ': Fast-forward'); return;
      }
      if (ffOnly) { c.err('fatal: Not possible to fast-forward, aborting.\n'); return 128; }
      var base = mergeBase(r, ours, theirs), baseT = base ? r.commits[base].tree : {}, oT = r.commits[ours].tree, tT = r.commits[theirs].tree, merged = {}, conflicts = {}, all = {};
      Object.keys(baseT).concat(Object.keys(oT), Object.keys(tT)).forEach(function (p) { all[p] = 1; });
      Object.keys(all).forEach(function (p) {
        var b = baseT[p], o = oT[p], t = tT[p];
        if (o === t) { if (o !== undefined) merged[p] = o; } else if (o === b) { if (t !== undefined) merged[p] = t; } else if (t === b) { if (o !== undefined) merged[p] = o; }
        else { var m = merge3(b || '', o || '', t || '', ['HEAD', name]); merged[p] = m.text; if (m.conflict) conflicts[p] = 1; else if (o === undefined || t === undefined) { conflicts[p] = 1; } }
      });
      var cur = headTree(r); Object.keys(merged).forEach(function (p) { writeWork(r, p, merged[p]); }); Object.keys(cur).forEach(function (p) { if (merged[p] === undefined) rmWork(r, p); });
      var msg = customMsg || (r.head.ref && (r.head.ref === 'main' || r.head.ref === 'master') ? 'Merge ' + label : 'Merge ' + label + ' into ' + (r.head.ref || 'HEAD'));
      if (squash) { r.index = Object.assign({}, merged); c.out('Squash commit -- not updating HEAD\n'); return; }
      if (Object.keys(conflicts).length) {
        r.index = Object.assign({}, cur); Object.keys(merged).forEach(function (p) { if (!conflicts[p]) r.index[p] = merged[p]; }); Object.keys(cur).forEach(function (p) { if (merged[p] === undefined) delete r.index[p]; });
        r.merge = { theirs: theirs, conflicts: conflicts, msg: msg }; Object.keys(conflicts).sort().forEach(function (p) { c.out('Auto-merging ' + p + '\nCONFLICT (content): Merge conflict in ' + p + '\n'); }); c.out('Automatic merge failed; fix conflicts and then commit the result.\n'); return 1;
      }
      var nid = makeCommit(r, msg, [ours, theirs], merged); r.index = Object.assign({}, merged); r.branches[r.head.ref] = nid; logRef(r, null, 'merge ' + name + ': Merge made by the \'ort\' strategy.');
      var fs_ = treeStats(cur, merged); c.out("Merge made by the 'ort' strategy.\n" + (fs_.length ? statBars(fs_) + summary(fs_, true) : ''));
    };
    G_.rebase = function (a, c, r) {
      if (a.some(function (x) { return x === '-i' || x === '--interactive'; })) { c.err('hint: Interactive rebase needs an editor, which this simulator does not have.\nhint: Use "git rebase <branch>" or "git commit --amend"/"git reset" to rewrite history here.\n'); return 1; }
      var name = a.filter(function (x) { return x[0] !== '-'; })[0], onto = resolve(r, name); if (!onto) { c.err("fatal: invalid upstream '" + name + "'\n"); return 128; }
      var ours = headSha(r); if (ours === onto || isAncestor(r, onto, ours)) { c.out('Current branch ' + r.head.ref + ' is up to date.\n'); return; }
      var base = mergeBase(r, ours, onto), mine = [], s = ours; while (s && s !== base) { mine.unshift(s); s = r.commits[s].parents[0]; }
      if (isAncestor(r, ours, onto)) { checkoutTree(r, r.commits[onto].tree, headTree(r)); r.branches[r.head.ref] = onto; c.out('Successfully rebased and updated refs/heads/' + r.head.ref + '.\n'); return; }
      var tip = onto, tree = Object.assign({}, r.commits[onto].tree);
      for (var i = 0; i < mine.length; i++) {
        var cm = r.commits[mine[i]], pt = cm.parents[0] ? r.commits[cm.parents[0]].tree : {}, next = Object.assign({}, tree), conflict = false;
        treeStats(pt, cm.tree).forEach(function (f) { var b = pt[f.p], t = cm.tree[f.p], o = tree[f.p]; if (o === b) { if (t === undefined) delete next[f.p]; else next[f.p] = t; } else if (o !== t) { var m = merge3(b || '', o || '', t || '', ['HEAD', short(cm.sha) + ' ' + cm.msg.split('\n')[0]]); if (m.conflict) { conflict = true; c.out('Auto-merging ' + f.p + '\nCONFLICT (content): Merge conflict in ' + f.p + '\n'); } next[f.p] = m.text; } });
        if (conflict) { Object.keys(next).forEach(function (p) { writeWork(r, p, next[p]); }); c.err('error: could not apply ' + short(cm.sha) + '... ' + cm.msg.split('\n')[0] + '\nhint: The simulator cannot continue a conflicted rebase — resolve by hand, or run "git rebase --abort".\n'); r.rebase = { orig: ours }; return 1; }
        var nid = makeCommit(r, cm.msg, [tip], next, { authorTime: cm.authorTime }); tip = nid; tree = next;
      }
      var old = headTree(r); checkoutTree(r, tree, Object.assign({}, old, workFiles(r))); r.branches[r.head.ref] = tip; logRef(r, null, 'rebase (finish): refs/heads/' + r.head.ref + ' onto ' + short(onto)); c.out('Successfully rebased and updated refs/heads/' + r.head.ref + '.\n');
    };
    G_.stash = function (a, c, r) {
      var sub = a[0] && a[0][0] !== '-' ? a[0] : 'push', rest = a.slice(a[0] && a[0][0] !== '-' ? 1 : 0);
      function label(i) { return 'stash@{' + i + '}'; }
      if (sub === 'list') { r.stash.forEach(function (s, i) { c.out(label(i) + ': ' + s.msg + '\n'); }); return; }
      if (sub === 'push' || sub === 'save') {
        var st = status(r), inc = rest.indexOf('-u') >= 0 || rest.indexOf('--include-untracked') >= 0; if (!st.staged.length && !st.unstaged.length && !(inc && st.untracked.length)) { c.out('No local changes to save\n'); return; }
        var mi = rest.indexOf('-m'), work = workFiles(r), snap = {}; Object.keys(r.index).forEach(function (p) { if (work[p] !== undefined) snap[p] = work[p]; }); var untr = {}; if (inc) st.untracked.forEach(function (p) { untr[p] = work[p]; });
        var m = mi >= 0 ? rest[mi + 1] : (sub === 'save' ? rest.join(' ') : ''), hs = headSha(r), hc = r.commits[hs], base = (r.head.ref || 'HEAD') + ': ' + short(hs) + ' ' + hc.msg.split('\n')[0];
        r.stash.unshift({ tree: snap, index: Object.assign({}, r.index), untracked: untr, msg: m ? 'On ' + (r.head.ref || 'HEAD') + ': ' + m : 'WIP on ' + base, base: hs });
        checkoutTree(r, headTree(r), Object.assign({}, headTree(r), snap)); Object.keys(untr).forEach(function (p) { rmWork(r, p); }); c.out('Saved working directory and index state ' + r.stash[0].msg + '\n'); return;
      }
      var idx = 0; rest.forEach(function (x) { var mm = x.match(/^stash@\{(\d+)\}$/); if (mm) idx = +mm[1]; });
      if (!r.stash[idx] && sub !== 'clear') { c.err('error: ' + label(idx) + ' is not a valid reference\n'); return 1; }
      if (sub === 'show') { var e = r.stash[idx], out = diffTrees(r.commits[e.base].tree, Object.assign({}, r.commits[e.base].tree, e.tree), [], true); c.out(out); return; }
      if (sub === 'drop') { var d = r.stash.splice(idx, 1)[0]; c.out('Dropped ' + label(idx) + ' (' + short(sha(d.msg)) + ')\n'); return; }
      if (sub === 'clear') { r.stash = []; return; }
      if (sub === 'apply' || sub === 'pop') {
        var e2 = r.stash[idx], conflicts = [], cur = workFiles(r);
        Object.keys(e2.tree).forEach(function (p) { var baseV = r.commits[e2.base].tree[p], curV = cur[p]; if (curV !== undefined && curV !== baseV && curV !== e2.tree[p]) { var m2 = merge3(baseV || '', curV, e2.tree[p], ['Updated upstream', 'Stashed changes']); writeWork(r, p, m2.text); if (m2.conflict) conflicts.push(p); } else writeWork(r, p, e2.tree[p]); });
        Object.keys(e2.untracked || {}).forEach(function (p) { writeWork(r, p, e2.untracked[p]); });
        var st2 = status(r); c.out((r.head.ref ? 'On branch ' + r.head.ref + '\n' : '') + (st2.unstaged.length ? 'Changes not staged for commit:\n  (use "git add <file>..." to update what will be committed)\n  (use "git restore <file>..." to discard changes in working directory)\n' + st2.unstaged.map(function (x) { return '\t' + (x.s === 'D' ? 'deleted:    ' : 'modified:   ') + x.p + '\n'; }).join('') : '') + (st2.untracked.length ? '\nUntracked files:\n  (use "git add <file>..." to include in what will be committed)\n' + st2.untracked.map(function (p) { return '\t' + p + '\n'; }).join('') : '') + (st2.unstaged.length || st2.untracked.length ? '\n' : '') + (st2.unstaged.length ? 'no changes added to commit (use "git add" and/or "git commit -a")\n' : ''));
        if (conflicts.length) { c.err('CONFLICT (content): Merge conflict in ' + conflicts.join(', ') + '\nThe stash entry is kept in case you need it again.\n'); return 1; }
        if (sub === 'pop') { r.stash.splice(idx, 1); c.out('Dropped ' + label(idx) + ' (' + short(sha(e2.msg)) + ')\n'); } return;
      }
      c.err('error: unknown subcommand: ' + sub + '\n'); return 129;
    };
    G_.tag = function (a, c, r) {
      var del = a.indexOf('-d') >= 0 || a.indexOf('--delete') >= 0, annotated = a.indexOf('-a') >= 0, mi = a.indexOf('-m'), msg = mi >= 0 ? a[mi + 1] : null, names = a.filter(function (x, i) { return x[0] !== '-' && (mi < 0 || i !== mi + 1); });
      if (a.indexOf('-l') >= 0 || (!names.length && !del)) { Object.keys(r.tags).sort(function (x, y) { return x.localeCompare(y, undefined, { numeric: true }); }).forEach(function (t) { c.out(t + (a.indexOf('-n') >= 0 && r.tags[t].msg ? '    ' + r.tags[t].msg : '') + '\n'); }); return; }
      if (del) { var code = 0; names.forEach(function (n) { if (!r.tags[n]) { c.err("error: tag '" + n + "' not found.\n"); code = 1; return; } c.out("Deleted tag '" + n + "' (was " + short(r.tags[n].sha) + ')\n'); delete r.tags[n]; }); return code; }
      var name = names[0], target = names[1] ? resolve(r, names[1]) : headSha(r); if (!target) { c.err('fatal: Failed to resolve \'' + (names[1] || 'HEAD') + "' as a valid ref.\n"); return 128; } if (r.tags[name]) { c.err("fatal: tag '" + name + "' already exists\n"); return 128; }
      r.tags[name] = { sha: target, msg: annotated || msg ? msg || '' : null };
    };
    G_.remote = function (a, c, r) {
      var sub = a[0] && a[0][0] !== '-' ? a[0] : null;
      if (!sub) { var v = a.indexOf('-v') >= 0 || a.indexOf('--verbose') >= 0; Object.keys(r.remotes).forEach(function (n) { if (v) c.out(n + '\t' + r.remotes[n] + ' (fetch)\n' + n + '\t' + r.remotes[n] + ' (push)\n'); else c.out(n + '\n'); }); return; }
      if (sub === 'add') { if (r.remotes[a[1]]) { c.err('error: remote ' + a[1] + ' already exists.\n'); return 3; } r.remotes[a[1]] = a[2]; return; }
      if (sub === 'remove' || sub === 'rm') { if (!r.remotes[a[1]]) { c.err("error: No such remote: '" + a[1] + "'\n"); return 2; } delete r.remotes[a[1]]; Object.keys(r.remoteRefs).forEach(function (k) { if (k.indexOf(a[1] + '/') === 0) delete r.remoteRefs[k]; }); return; }
      if (sub === 'rename') { r.remotes[a[2]] = r.remotes[a[1]]; delete r.remotes[a[1]]; return; }
      if (sub === 'set-url') { r.remotes[a[1]] = a[2]; return; }
      if (sub === 'get-url') { c.out((r.remotes[a[1]] || '') + '\n'); return; }
      if (sub === 'show') { if (!r.remotes[a[1]]) { c.err("fatal: '" + a[1] + "' does not appear to be a git repository\n"); return 128; } c.out('* remote ' + a[1] + '\n  Fetch URL: ' + r.remotes[a[1]] + '\n  Push  URL: ' + r.remotes[a[1]] + '\n'); return; }
      c.err('error: Unknown subcommand: ' + sub + '\n'); return 129;
    };
    function needRemote(c, r, name, verb) { if (name && !r.remotes[name]) { c.err("fatal: '" + name + "' does not appear to be a git repository\nfatal: Could not read from remote repository.\n\nPlease make sure you have the correct access rights\nand the repository exists.\n"); return null; } var n = name || (r.remotes.origin ? 'origin' : Object.keys(r.remotes)[0]); if (!n) { c.err(verb === 'push' ? 'fatal: No configured push destination.\nEither specify the URL from the command-line or configure a remote repository using\n\n    git remote add <name> <url>\n\nand then push using the remote name\n\n    git push <name>\n' : 'fatal: No remote repository specified.  Please, specify either a URL or a\nremote name from which new revisions should be fetched.\n'); return null; } return n; }
    G_.push = function (a, c, r) {
      var setUp = a.indexOf('-u') >= 0 || a.indexOf('--set-upstream') >= 0, force = a.some(function (x) { return x === '-f' || x === '--force' || x === '--force-with-lease'; }), tags = a.indexOf('--tags') >= 0, del = a.some(function (x) { return x === '--delete' || x === '-d'; }), args = a.filter(function (x) { return x[0] !== '-'; });
      var remote = needRemote(c, r, args[0] && r.remotes[args[0]] ? args[0] : (args[0] ? args[0] : null), 'push'); if (!remote) return 128; var url = r.remotes[remote];
      if (tags) { var pushed = false; Object.keys(r.tags).forEach(function (t) { c.out('To ' + url + '\n * [new tag]         ' + t + ' -> ' + t + '\n'); pushed = true; }); if (!pushed) c.err('Everything up-to-date\n'); return; }
      var br = args[1] || curBranch(r); if (!br) { c.err('fatal: You are not currently on a branch.\n'); return 128; }
      var refspec = br.split(':'), src = refspec[0], dst = refspec[1] || refspec[0];
      if (del) { delete r.remoteRefs[remote + '/' + br]; c.out('To ' + url + '\n - [deleted]         ' + br + '\n'); return; }
      if (!r.branches[src]) { c.err("error: src refspec " + src + " does not match any\nerror: failed to push some refs to '" + url + "'\n"); return 1; }
      var key = remote + '/' + dst, prev = r.remoteRefs[key], cur = r.branches[src];
      if (prev === cur) { c.err('Everything up-to-date\n'); if (setUp) { r.upstream[src] = key; c.out("branch '" + src + "' set up to track '" + key + "'.\n"); } return; }
      if (prev && !isAncestor(r, prev, cur) && !force) { c.err('To ' + url + '\n ! [rejected]        ' + src + ' -> ' + dst + ' (non-fast-forward)\nerror: failed to push some refs to \'' + url + "'\nhint: Updates were rejected because the tip of your current branch is behind\nhint: its remote counterpart. If you want to integrate the remote changes,\nhint: use 'git pull' before pushing again.\n"); return 1; }
      var count = ancestors(r, cur).size - (prev ? ancestors(r, prev).size : 0);
      c.err('Enumerating objects: ' + (count * 3) + ', done.\nCounting objects: 100% (' + count * 3 + '/' + count * 3 + '), done.\nWriting objects: 100% (' + count * 3 + '/' + count * 3 + '), ' + (count * 240) + ' bytes | ' + (count * 240) + '.00 KiB/s, done.\nTotal ' + count * 3 + ' (delta 0), reused 0 (delta 0), pack-reused 0\n');
      c.err('To ' + url + '\n' + (prev ? '   ' + short(prev) + '..' + short(cur) + '  ' + src + ' -> ' + dst : ' * [new branch]      ' + src + ' -> ' + dst) + '\n');
      r.remoteRefs[key] = cur; if (setUp || (!r.upstream[src] && !prev && false)) { r.upstream[src] = key; c.out("branch '" + src + "' set up to track '" + key + "'.\n"); }
    };
    G_.fetch = function (a, c, r) { var remote = needRemote(c, r, a.filter(function (x) { return x[0] !== '-'; })[0], 'fetch'); if (!remote) return 128; };
    G_.pull = function (a, c, r) {
      var remote = needRemote(c, r, a.filter(function (x) { return x[0] !== '-'; })[0], 'pull'); if (!remote) return 128;
      var b = curBranch(r), key = remote + '/' + (a.filter(function (x) { return x[0] !== '-'; })[1] || b), rem = r.remoteRefs[key];
      if (!rem) { c.err("fatal: couldn't find remote ref " + (b) + '\n'); return 1; } if (rem === headSha(r) || isAncestor(r, rem, headSha(r))) { c.out('Already up to date.\n'); return; }
      return G_.merge([key], c, r);
    };
    G_.clone = function (a, c) {
      var args = a.filter(function (x) { return x[0] !== '-'; }), url = args[0]; if (!url) { c.err('fatal: You must specify a repository to clone.\n'); return 129; }
      var name = args[1] || url.replace(/\/+$/, '').split('/').pop().replace(/\.git$/, ''), root = shell.abs(name);
      if (repos[root]) { c.err("fatal: destination path '" + name + "' already exists and is not an empty directory.\n"); return 128; }
      c.err("Cloning into '" + name + "'...\n"); var r = newRepo(root, 'main'); r.remotes.origin = url;
      var tree = { 'README.md': '# ' + name + '\n\nCloned from ' + url + ' (simulated — the sandbox has no network, so this is a sample repository).\n' }, id = makeCommit(r, 'Initial commit', [], tree); r.branches.main = id; r.remoteRefs['origin/main'] = id; r.upstream.main = 'origin/main'; r.index = Object.assign({}, tree); r.reflog.unshift({ sha: id, msg: 'clone: from ' + url }); writeWork(r, 'README.md', tree['README.md']);
      c.err('remote: Enumerating objects: 3, done.\nremote: Total 3 (delta 0), reused 0 (delta 0), pack-reused 0\nReceiving objects: 100% (3/3), done.\n');
    };
    G_.reflog = function (a, c, r) { r.reflog.forEach(function (e, i) { c.out(short(e.sha) + ' HEAD@{' + i + '}: ' + e.msg + '\n'); }); };
    G_['ls-files'] = function (a, c, r) { Object.keys(r.index).sort().forEach(function (p) { c.out(p + '\n'); }); };
    G_['rev-parse'] = function (a, c, r) { a.forEach(function (x) { if (x === '--show-toplevel') c.out(r.root + '\n'); else if (x === '--is-inside-work-tree') c.out('true\n'); else if (x === '--abbrev-ref') { /* next arg */ } else if (x === '--short') { } else { var id = resolve(r, x); if (a.indexOf('--abbrev-ref') >= 0) c.out((curBranch(r) || 'HEAD') + '\n'); else if (id) c.out((a.indexOf('--short') >= 0 ? short(id) : id) + '\n'); else { c.err("fatal: ambiguous argument '" + x + "': unknown revision or path not in the working tree.\n"); return 128; } } }); };
    G_.clean = function (a, c, r) {
      var dry = a.indexOf('-n') >= 0 || a.indexOf('--dry-run') >= 0, force = a.some(function (x) { return /^-[a-z]*f/.test(x); }), dirs = a.some(function (x) { return /^-[a-z]*d/.test(x); });
      if (!dry && !force) { c.err('fatal: clean.requireForce defaults to true and neither -i, -n, nor -f given; refusing to clean\n'); return 128; }
      var list = dirs ? collapseUntracked(r, status(r).untracked) : status(r).untracked.filter(function (p) { return p.indexOf('/') < 0 || true; }); if (!dirs) list = status(r).untracked.filter(function (p) { return p.indexOf('/') < 0; });
      list.forEach(function (p) { c.out((dry ? 'Would remove ' : 'Removing ') + p + '\n'); if (!dry) { if (/\/$/.test(p)) Object.keys(sim.files).forEach(function (k) { if (k.indexOf(r.root + '/' + p) === 0) rmWork(r, k.slice(r.root.length + 1)); }); else rmWork(r, p); } });
    };
    G_.gc = G_.prune = G_.fsck = function () { };
    G_.blame = function (a, c, r) { var f = relPath(r, c, a.filter(function (x) { return x[0] !== '-'; })[0]), txt = r.index[f]; if (txt === undefined) { c.err('fatal: no such path ' + f + ' in HEAD\n'); return 128; } var hs = headSha(r), cm = r.commits[hs]; splitLines(txt).forEach(function (l, i) { c.out(short(hs) + ' (' + cm.author + ' ' + fmtDate(cm.time).slice(4, 14).replace(/(\w+) (\d+) (\d+):.*/, '$1 $2') + ' ' + (i + 1) + ') ' + l + '\n'); }); };

    var NO_REPO = ['init', 'clone', 'help', '--version', 'version', 'config'];
    function expandAlias(r, name) { var v = cfgGet(r, 'alias.' + name); return v; }
    async function git(args, c) {
      var flags = []; while (args.length && args[0][0] === '-' && args[0] !== '--version' && args[0] !== '--help') { flags.push(args.shift()); if (flags[flags.length - 1] === '-C') { var d = args.shift(); shell.cwd = shell.abs(d); } }
      var name = args.shift(); if (!name) { G_.help([], c); return 1; }
      var r = findRepo(shell.cwd), alias = expandAlias(r, name);
      if (alias && !G_[name]) { var toks = sim.tokenize(alias, shell.env).map(function (t) { return t.v; }); if (toks[0] === 'git') toks.shift(); return git(toks.concat(args), c); }
      if (name === '--help' || (args.indexOf('--help') >= 0)) { G_.help([], c); return 0; }
      var fn = G_[name]; if (!fn) { c.err("git: '" + name + "' is not a git command. See 'git --help'.\n"); return 1; }
      if (!r && NO_REPO.indexOf(name) < 0) { c.err('fatal: not a git repository (or any of the parent directories): .git\n'); return 128; }
      return fn(args, c, r);
    }
    return { git: git, repos: repos, findRepo: findRepo };
  }
  sim.createGit = createGit;

  sim.engines.git = function () {
    var shell = new sim.Shell({ cwd: HOME + '/project', home: HOME });
    sim.dirs[HOME] = 1; sim.dirs[HOME + '/project'] = 1;
    var engine = createGit(shell);
    shell.commands.git = function (a, c) { return engine.git(a.slice(), c); };
    shell.git = engine;
    async function seedSample(script) {
      var lines = ['git init', 'echo "# My Project" > README.md', 'echo "console.log(\'Hello, Git!\');" > app.js', 'mkdir src', 'echo "export const hello = () => \'hi\';" > src/utils.js', 'echo "import { hello } from \'./utils.js\';" > src/index.js', 'git add .', 'git commit -m "Initial commit"', 'echo "node_modules/" > .gitignore', 'git add .gitignore', 'git commit -m "Add .gitignore"', 'echo "function add(a, b) { return a + b; }" >> app.js', 'git commit -am "Add add() function"'];
      for (var i = 0; i < lines.length; i++) await shell.run(lines[i]);
      var r = engine.findRepo(shell.cwd), mine = {};
      script.replace(/(?:switch -c|checkout -b|branch(?: -[a-zA-Z]+)?)\s+([\w./-]+)/g, function (m, n) { mine[n] = 1; return m; });
      var refs = {}; script.replace(/\b((?:feature|hotfix|bugfix|release|fix|chore)\/[\w.-]+)/g, function (m, n) { if (!mine[n]) refs[n] = 1; return m; });
      var names = Object.keys(refs);
      for (var k = 0; k < names.length; k++) { var f = names[k].replace(/[^\w.-]/g, '-') + '.js'; await shell.run('git switch -c ' + names[k]); await shell.run('echo "// ' + names[k] + '" > ' + f); await shell.run('git add ' + f); await shell.run('git commit -m "Work on ' + names[k].split('/')[1] + '"'); await shell.run('git switch main'); }
      if (!/git remote add origin|git clone/.test(script)) { r.remotes.origin = 'https://github.com/student/project.git'; r.remoteRefs['origin/main'] = r.branches.main; r.upstream.main = 'origin/main'; }
      var tagMade = {}; script.replace(/git tag\s+(?:-[aA]\s+|-m\s+"[^"]*"\s+)*([\w.-]+)/g, function (m, n) { tagMade[n] = 1; return m; });
      var tagRefs = {}; script.replace(/git (?:tag -d|push origin(?: --delete| :refs\/tags\/)?|show|checkout|describe)\s+(v?\d+\.\d+\.\d+[\w.-]*)/g, function (m, n) { if (!tagMade[n]) tagRefs[n] = 1; return m; });
      var tagNames = Object.keys(tagRefs); for (var t = 0; t < tagNames.length; t++) await shell.run('git tag ' + tagNames[t]);
      var madeFiles = {}; script.replace(/(?:>>?\s*|touch\s+|mkdir -p\s+|git mv \S+\s+)([\w./-]+)/g, function (m, n) { madeFiles[n] = 1; return m; });
      var addRefs = {}; script.replace(/git add\s+(?:-\w+\s+)*([\w][\w./-]*\.\w+)/g, function (m, n) { if (!madeFiles[n] && sim.files[shell.cwd + '/' + n] === undefined) addRefs[n] = 1; return m; });
      var addNames = Object.keys(addRefs); for (var f2 = 0; f2 < addNames.length; f2++) { var dir = addNames[f2].split('/').slice(0, -1).join('/'); if (dir) await shell.run('mkdir -p ' + dir); await shell.run('echo "// ' + addNames[f2] + '" > ' + addNames[f2]); }
      var usesStashLater = /git stash (pop|apply|drop|show)/.test(script), makesStash = /git stash\s*($|\n|&&|;|push|save|-u|-m|--)/m.test(script);
      var maxStash = -1; script.replace(/stash@\{(\d+)\}/g, function (m, n) { maxStash = Math.max(maxStash, +n); return m; });
      if (usesStashLater && !makesStash) { for (var sN = 0; sN < Math.max(1, maxStash + 1); sN++) { await shell.run('echo "// work in progress ' + sN + '" >> app.js'); await shell.run('git stash'); } }
      r.reflog = r.reflog.slice(0, 3);
    }
    return { hasFile: function (n) { return sim.files[shell.cwd + '/' + n] !== undefined; }, scriptMode: function (on) { shell.__script = !!on; }, prepare: async function (script) {
      var hasGit = /(^|[\s;&|])git\s/.test(script), starts = /(^|[\s;&|])git\s+(init|clone)\b/.test(script);
      if (hasGit && !starts) { await seedSample(script); return 'ℹ️ No `git init` in this snippet — starting from a sample repository (3 commits' + (/git remote add origin|git clone/.test(script) ? '' : ', remote "origin"') + ') so the commands have something to work on.'; }
    }, title: 'Git Simulator', sub: 'git 2.43 · in-memory repository', shell: shell, banner: 'A working Git sandbox — your files and commits live in memory for this run.\nUser is preset to "Atlas Student". Try: git init · git add . · git commit -m "msg" · git log --oneline · git branch · git switch -c feature · git merge', placeholder: 'git status  ·  git log --oneline --graph' };
  };
})(window);
