/* WebDev Atlas — terminal simulator core: shell parser, builtin commands, virtual filesystem access and the
 * terminal UI shared by the Git / Redis / Docker simulators. Requires sim-core.js and sim-net.js (ui). */
(function (G) {
  'use strict';
  var sim = G.__sim, ui = sim.ui, h = ui.h, path = sim.path, fs = sim.fs;
  sim.engines = sim.engines || {};

  /* ───────────── tokenizer ───────────── */
  function expandVar(s, i, env) {
    var m = s.slice(i).match(/^\$(?:\{(\w+)\}|(\w+)|\?)/);
    if (!m) return { v: '$', i: i + 1 };
    var name = m[1] || m[2]; var val = name ? (env[name] !== undefined ? env[name] : '') : String(env['?'] || 0);
    return { v: val, i: i + m[0].length };
  }
  function tokenize(s, env) {
    var out = [], cur = '', has = false, quoted = false, i = 0, q = null;
    function push() { if (has) { out.push({ t: 'w', v: cur, quoted: quoted }); } cur = ''; has = false; quoted = false; }
    while (i < s.length) {
      var c = s[i];
      if (q === "'") { if (c === "'") q = null; else cur += c; i++; continue; }
      if (q === '"') {
        if (c === '"') { q = null; i++; continue; }
        if (c === '\\' && /["\\$`]/.test(s[i + 1] || '')) { cur += s[i + 1]; i += 2; continue; }
        if (c === '$') { var r = expandVar(s, i, env); cur += r.v; i = r.i; continue; }
        cur += c; i++; continue;
      }
      if (c === "'" || c === '"') { q = c; has = true; quoted = true; i++; continue; }
      if (c === '\\') { cur += s[i + 1] || ''; has = true; i += 2; continue; }
      if (c === '#' && !has && (i === 0 || /\s/.test(s[i - 1]))) break;
      if (/\s/.test(c)) { push(); i++; continue; }
      if (c === '$') { var r2 = expandVar(s, i, env); cur += r2.v; has = true; i = r2.i; continue; }
      if (c === '&' && s[i + 1] === '&') { push(); out.push({ t: 'op', v: '&&' }); i += 2; continue; }
      if (c === '|' && s[i + 1] === '|') { push(); out.push({ t: 'op', v: '||' }); i += 2; continue; }
      if (c === '|') { push(); out.push({ t: 'op', v: '|' }); i++; continue; }
      if (c === ';') { push(); out.push({ t: 'op', v: ';' }); i++; continue; }
      if (c === '>') {
        var two = cur === '2' && !quoted; if (two) { cur = ''; has = false; } else push();
        var app = s[i + 1] === '>'; out.push({ t: 'op', v: (two ? '2' : '') + (app ? '>>' : '>') }); i += app ? 2 : 1; continue;
      }
      if (c === '<') { push(); out.push({ t: 'op', v: '<' }); i++; continue; }
      cur += c; has = true; i++;
    }
    push(); return out;
  }
  sim.tokenize = tokenize;

  /* ───────────── shell ───────────── */
  function globToRe(g) { return new RegExp('^' + g.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]*').replace(/\?/g, '[^/]') + '$'); }
  function Shell(o) {
    this.cwd = o.cwd || '/app'; this.home = o.home || '/home/user'; this.user = o.user || 'user'; this.host = o.host || 'atlas';
    this.env = Object.assign({ HOME: this.home, USER: this.user, PWD: this.cwd, SHELL: '/bin/bash', PATH: '/usr/local/bin:/usr/bin:/bin', '?': 0 }, o.env);
    this.commands = Object.assign({}, builtins, o.commands || {}); this.history = []; this.fs = fs;
  }
  Shell.prototype.abs = function (p) { p = String(p || '.'); if (p === '~' || p.indexOf('~/') === 0) p = this.home + p.slice(1); return path.resolve(this.cwd, p); };
  Shell.prototype.glob = function (tok) {
    if (tok.quoted || !/[*?]/.test(tok.v)) return [tok.v];
    var dir = path.dirname(tok.v), base = path.basename(tok.v), re = globToRe(base), self = this, list;
    try { list = fs.readdirSync(this.abs(dir === '.' && tok.v.indexOf('/') < 0 ? '.' : dir)); } catch (e) { return [tok.v]; }
    var hits = list.filter(function (n) { return re.test(n) && (base[0] === '.' || n[0] !== '.'); }).sort().map(function (n) { return dir === '.' && tok.v.indexOf('/') < 0 ? n : path.join(dir, n); });
    void self; return hits.length ? hits : [tok.v];
  };
  Shell.prototype.run = async function (line, stdin) {
    var toks = tokenize(line, this.env), chunks = [], code = 0, segs = [], cur = [], op = ';', i;
    for (i = 0; i < toks.length; i++) { var t = toks[i]; if (t.t === 'op' && (t.v === '&&' || t.v === '||' || t.v === ';')) { segs.push({ op: op, toks: cur }); cur = []; op = t.v; } else cur.push(t); }
    segs.push({ op: op, toks: cur });
    for (i = 0; i < segs.length; i++) {
      var sg = segs[i]; if (!sg.toks.length) continue;
      if (sg.op === '&&' && code !== 0) continue; if (sg.op === '||' && code === 0) continue;
      var r = await this.pipeline(sg.toks, i === 0 ? stdin : undefined);
      chunks = chunks.concat(r.chunks); code = r.code; this.env['?'] = code;
    }
    return { chunks: chunks, code: code };
  };
  Shell.prototype.pipeline = async function (toks, stdin) {
    var cmds = [[]], i; toks.forEach(function (t) { if (t.t === 'op' && t.v === '|') cmds.push([]); else cmds[cmds.length - 1].push(t); });
    var input = stdin, allChunks = [], code = 0;
    for (i = 0; i < cmds.length; i++) {
      var r = await this.simple(cmds[i], input), last = i === cmds.length - 1;
      code = r.code; input = r.chunks.filter(function (c) { return c.t === 'out'; }).map(function (c) { return c.s; }).join('');
      if (last) allChunks = allChunks.concat(r.chunks);
      else allChunks = allChunks.concat(r.chunks.filter(function (c) { return c.t === 'err'; }));
    }
    return { chunks: allChunks, code: code };
  };
  Shell.prototype.simple = async function (toks, stdin) {
    var argv = [], redir = null, errRedir = null, self = this, i;
    for (i = 0; i < toks.length; i++) {
      var t = toks[i];
      if (t.t === 'op') {
        var target = toks[i + 1] && toks[i + 1].v; i++;
        if (t.v === '>' || t.v === '>>') redir = { file: target, append: t.v === '>>' };
        else if (t.v === '2>' || t.v === '2>>') errRedir = { file: target };
        else if (t.v === '<') { try { stdin = fs.readFileSync(this.abs(target), 'utf8'); } catch (e) { return { chunks: [{ t: 'err', s: 'bash: ' + target + ': No such file or directory\n' }], code: 1 }; } }
        continue;
      }
      if (!argv.length && /^\w+=/.test(t.v)) { var eq = t.v.indexOf('='); this.env[t.v.slice(0, eq)] = t.v.slice(eq + 1); continue; }
      argv = argv.concat(this.glob(t));
    }
    if (!argv.length) { var only = toks[0]; if (only && /^\w+=/.test(only.v)) { var e2 = only.v.indexOf('='); this.env[only.v.slice(0, e2)] = only.v.slice(e2 + 1); } return { chunks: [], code: 0 }; }
    var name = argv[0], fn = this.commands[name], chunks = [];
    var ctx = { sh: this, stdin: stdin === undefined ? '' : stdin, hasStdin: stdin !== undefined, out: function (s) { chunks.push({ t: 'out', s: String(s) }); }, err: function (s) { chunks.push({ t: 'err', s: String(s) }); } };
    var code;
    if (!fn) { ctx.err(name + ': command not found\n'); code = 127; }
    else { try { code = await fn(argv.slice(1), ctx); } catch (e) { if (e && e.__exit) throw e; ctx.err(name + ': ' + (e && e.message ? e.message : e) + '\n'); code = 1; } }
    if (typeof code !== 'number') code = 0;
    if (errRedir && errRedir.file !== '/dev/null' && !/^&/.test(errRedir.file || '')) {
      var errs = chunks.filter(function (c) { return c.t === 'err'; }).map(function (c) { return c.s; }).join(''); try { fs.writeFileSync(this.abs(errRedir.file), errs); } catch (e) { /* ignore */ }
      chunks = chunks.filter(function (c) { return c.t !== 'err'; });
    } else if (errRedir) chunks = chunks.filter(function (c) { return c.t !== 'err'; }).concat(/^&1/.test(errRedir.file || '') ? [] : []);
    if (redir) {
      var text = chunks.filter(function (c) { return c.t === 'out'; }).map(function (c) { return c.s; }).join('');
      try {
        if (redir.file === '/dev/null') { /* discard */ }
        else if (redir.append) fs.appendFileSync(self.abs(redir.file), text); else fs.writeFileSync(self.abs(redir.file), text);
      } catch (e) { chunks = chunks.filter(function (c) { return c.t !== 'out'; }); chunks.push({ t: 'err', s: 'bash: ' + redir.file + ': ' + (e.code === 'ENOENT' ? 'No such file or directory' : e.message) + '\n' }); code = 1; }
      chunks = chunks.filter(function (c) { return c.t !== 'out'; });
    }
    return { chunks: chunks, code: code };
  };
  Shell.prototype.prompt = function () { var p = this.cwd === this.home ? '~' : this.cwd.indexOf(this.home + '/') === 0 ? '~' + this.cwd.slice(this.home.length) : this.cwd; return this.user + '@' + this.host + ':' + p + '$ '; };

  /* ───────────── builtin commands ───────────── */
  function lines(s) { return String(s).split('\n'); }
  var builtins = {
    echo: function (a, c) { var nl = true, esc = false; while (a[0] && /^-[neE]+$/.test(a[0])) { if (a[0].indexOf('n') >= 0) nl = false; if (a[0].indexOf('e') >= 0) esc = true; a = a.slice(1); } var s = a.join(' '); if (esc) s = s.replace(/\\n/g, '\n').replace(/\\t/g, '\t'); c.out(s + (nl ? '\n' : '')); },
    printf: function (a, c) { var f = a[0] || '', args = a.slice(1), k = 0; c.out(f.replace(/%[sd]/g, function () { return args[k++] || ''; }).replace(/\\n/g, '\n').replace(/\\t/g, '\t')); },
    pwd: function (a, c) { c.out(c.sh.cwd + '\n'); },
    cd: function (a, c) { var t = c.sh.abs(a[0] === undefined || a[0] === '~' ? c.sh.home : a[0] === '-' ? c.sh.env.OLDPWD || c.sh.cwd : a[0]); if (!(t in sim.dirs)) { c.err('bash: cd: ' + a[0] + ': No such file or directory\n'); return 1; } c.sh.env.OLDPWD = c.sh.cwd; c.sh.cwd = t; c.sh.env.PWD = t; },
    ls: function (a, c) {
      var flags = a.filter(function (x) { return x[0] === '-'; }).join(''), targets = a.filter(function (x) { return x[0] !== '-'; }), long = /l/.test(flags), all = /a/.test(flags), code = 0;
      if (!targets.length) targets = ['.'];
      targets.forEach(function (t, ti) {
        var p = c.sh.abs(t), names;
        if (p in sim.files) { c.out((long ? '-rw-r--r-- 1 user user ' + String(Buffer.byteLength(sim.files[p])).padStart(5) + ' Sep 24 12:00 ' : '') + t + '\n'); return; }
        try { names = fs.readdirSync(p); } catch (e) { c.err("ls: cannot access '" + t + "': No such file or directory\n"); code = 2; return; }
        if (targets.length > 1) c.out((ti ? '\n' : '') + t + ':\n');
        if (!all) names = names.filter(function (n) { return n[0] !== '.'; }); else names = ['.', '..'].concat(names);
        if (long) { c.out('total ' + names.length * 4 + '\n'); names.forEach(function (n) { var fp = path.join(p, n), isD = fp in sim.dirs || n === '.' || n === '..'; c.out((isD ? 'drwxr-xr-x 2' : '-rw-r--r-- 1') + ' user user ' + String(isD ? 4096 : Buffer.byteLength(sim.files[fp] || '')).padStart(5) + ' Sep 24 12:00 ' + n + '\n'); }); }
        else c.out(names.map(function (n) { return (path.join(p, n) in sim.dirs) && !/[.]{1,2}/.test(n) ? n : n; }).join('  ') + (names.length ? '\n' : ''));
      });
      return code;
    },
    cat: function (a, c) { if (!a.length) { c.out(c.stdin); return; } var code = 0; a.forEach(function (f) { try { c.out(fs.readFileSync(c.sh.abs(f), 'utf8')); } catch (e) { c.err('cat: ' + f + ': ' + (e.code === 'EISDIR' ? 'Is a directory' : 'No such file or directory') + '\n'); code = 1; } }); return code; },
    mkdir: function (a, c) { var rec = a.indexOf('-p') >= 0, code = 0; a.filter(function (x) { return x[0] !== '-'; }).forEach(function (d) { try { fs.mkdirSync(c.sh.abs(d), { recursive: rec }); } catch (e) { c.err("mkdir: cannot create directory '" + d + "': " + (e.code === 'EEXIST' ? 'File exists' : 'No such file or directory') + '\n'); code = 1; } }); return code; },
    touch: function (a, c) { a.forEach(function (f) { var p = c.sh.abs(f); if (!(p in sim.files)) { try { fs.writeFileSync(p, ''); } catch (e) { c.err("touch: cannot touch '" + f + "': No such file or directory\n"); } } }); },
    rm: function (a, c) { var rec = a.some(function (x) { return /^-.*[rR]/.test(x); }), force = a.some(function (x) { return /^-.*f/.test(x); }), code = 0; a.filter(function (x) { return x[0] !== '-'; }).forEach(function (f) { var p = c.sh.abs(f); try { if (p in sim.dirs && !rec) { c.err("rm: cannot remove '" + f + "': Is a directory\n"); code = 1; return; } fs.rmSync(p, { recursive: rec, force: force }); } catch (e) { c.err("rm: cannot remove '" + f + "': No such file or directory\n"); code = 1; } }); return code; },
    rmdir: function (a, c) { a.forEach(function (d) { try { fs.rmdirSync(c.sh.abs(d)); } catch (e) { c.err("rmdir: failed to remove '" + d + "': " + e.message + '\n'); } }); },
    cp: function (a, c) { var args = a.filter(function (x) { return x[0] !== '-'; }), rec = a.some(function (x) { return /^-.*[rR]/.test(x); }); if (args.length < 2) { c.err('cp: missing file operand\n'); return 1; } var dst = c.sh.abs(args[args.length - 1]); args.slice(0, -1).forEach(function (s) { var sp = c.sh.abs(s), target = dst in sim.dirs ? path.join(dst, path.basename(sp)) : dst; if (sp in sim.files) sim.files[target] = sim.files[sp]; else if (sp in sim.dirs && rec) { Object.keys(sim.files).forEach(function (k) { if (k.indexOf(sp + '/') === 0) sim.files[target + k.slice(sp.length)] = sim.files[k]; }); sim.dirs[target] = 1; } else c.err("cp: cannot stat '" + s + "': No such file or directory\n"); }); },
    mv: function (a, c) { var args = a.filter(function (x) { return x[0] !== '-'; }); if (args.length < 2) { c.err('mv: missing file operand\n'); return 1; } var dst = c.sh.abs(args[args.length - 1]); args.slice(0, -1).forEach(function (s) { var sp = c.sh.abs(s), target = dst in sim.dirs ? path.join(dst, path.basename(sp)) : dst; if (sp in sim.files) { sim.files[target] = sim.files[sp]; delete sim.files[sp]; } else if (sp in sim.dirs) { Object.keys(sim.files).forEach(function (k) { if (k.indexOf(sp + '/') === 0) { sim.files[target + k.slice(sp.length)] = sim.files[k]; delete sim.files[k]; } }); sim.dirs[target] = 1; delete sim.dirs[sp]; } else c.err("mv: cannot stat '" + s + "': No such file or directory\n"); }); },
    head: function (a, c) { var n = 10, files = []; for (var i = 0; i < a.length; i++) { if (a[i] === '-n') n = +a[++i]; else if (/^-\d+$/.test(a[i])) n = +a[i].slice(1); else files.push(a[i]); } var text = files.length ? fs.readFileSync(c.sh.abs(files[0]), 'utf8') : c.stdin; c.out(lines(text).slice(0, n).join('\n') + '\n'); },
    tail: function (a, c) { var n = 10, files = []; for (var i = 0; i < a.length; i++) { if (a[i] === '-n') n = +a[++i]; else if (/^-\d+$/.test(a[i])) n = +a[i].slice(1); else files.push(a[i]); } var text = (files.length ? fs.readFileSync(c.sh.abs(files[0]), 'utf8') : c.stdin).replace(/\n$/, ''); c.out(lines(text).slice(-n).join('\n') + '\n'); },
    wc: function (a, c) { var text = a.filter(function (x) { return x[0] !== '-'; }).length ? fs.readFileSync(c.sh.abs(a.filter(function (x) { return x[0] !== '-'; })[0]), 'utf8') : c.stdin, l = (text.match(/\n/g) || []).length, w = (text.trim() ? text.trim().split(/\s+/).length : 0), b = Buffer.byteLength(text); c.out((a.indexOf('-l') >= 0 ? l : a.indexOf('-w') >= 0 ? w : a.indexOf('-c') >= 0 ? b : l + ' ' + w + ' ' + b) + '\n'); },
    grep: function (a, c) {
      var flags = '', pat = null, files = [];
      a.forEach(function (x) { if (x[0] === '-' && x.length > 1 && pat === null) flags += x.slice(1); else if (pat === null) pat = x; else files.push(x); });
      var re; try { re = new RegExp(pat, /i/.test(flags) ? 'i' : ''); } catch (e) { re = new RegExp(String(pat).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), /i/.test(flags) ? 'i' : ''); }
      var inputs = files.length ? files.map(function (f) { return { n: f, t: (function () { try { return fs.readFileSync(c.sh.abs(f), 'utf8'); } catch (e) { return ''; } })() }; }) : [{ n: '', t: c.stdin }], found = 0;
      inputs.forEach(function (inp) { lines(inp.t.replace(/\n$/, '')).forEach(function (ln, i) { var hit = re.test(ln); if (/v/.test(flags)) hit = !hit; if (hit) { found++; if (!/c/.test(flags)) c.out((inputs.length > 1 ? inp.n + ':' : '') + (/n/.test(flags) ? (i + 1) + ':' : '') + ln + '\n'); } }); });
      if (/c/.test(flags)) c.out(found + '\n'); return found ? 0 : 1;
    },
    sort: function (a, c) { var l = lines(c.stdin.replace(/\n$/, '')).sort(); if (a.indexOf('-r') >= 0) l.reverse(); c.out(l.join('\n') + '\n'); },
    uniq: function (a, c) { var l = lines(c.stdin.replace(/\n$/, '')), o = []; l.forEach(function (x) { if (o[o.length - 1] !== x) o.push(x); }); c.out(o.join('\n') + '\n'); },
    tee: function (a, c) { c.out(c.stdin); if (a[0]) fs.writeFileSync(c.sh.abs(a[0]), c.stdin); },
    export: function (a, c) { a.forEach(function (x) { var i = x.indexOf('='); if (i > 0) c.sh.env[x.slice(0, i)] = x.slice(i + 1); }); },
    env: function (a, c) { Object.keys(c.sh.env).filter(function (k) { return k !== '?'; }).forEach(function (k) { c.out(k + '=' + c.sh.env[k] + '\n'); }); },
    printenv: function (a, c) { if (a[0]) c.out((c.sh.env[a[0]] || '') + '\n'); else builtins.env(a, c); },
    whoami: function (a, c) { c.out(c.sh.user + '\n'); }, hostname: function (a, c) { c.out(c.sh.host + '\n'); },
    date: function (a, c) { c.out(new Date().toString().replace(/ GMT.*/, ' UTC') + '\n'); },
    sleep: function () { }, true: function () { return 0; }, false: function () { return 1; }, clear: function (a, c) { c.sh.onClear && c.sh.onClear(); },
    history: function (a, c) { c.sh.history.forEach(function (l, i) { c.out(String(i + 1).padStart(4) + '  ' + l + '\n'); }); },
    which: function (a, c) { a.forEach(function (n) { if (c.sh.commands[n]) c.out('/usr/bin/' + n + '\n'); }); },
    exit: function () { var e = new Error('exit'); e.__exit = true; throw e; },
    nano: function (a, c) { c.err('nano: no interactive editors here — create files with echo "text" > file, cat <<EOF > file, or add a "// FILE: name" line to the editor.\n'); return 1; },
    man: function (a, c) { c.err('No manual entry for ' + (a[0] || '') + ' (this is a simulator — try `--help`).\n'); return 1; }
  };
  builtins.vim = builtins.vi = builtins.nano;
  ['apt', 'apt-get', 'brew', 'winget', 'choco', 'yum', 'dnf', 'npm', 'npx', 'yarn', 'pnpm', 'pip', 'pip3'].forEach(function (n) {
    builtins[n] = function (a, c) { c.out('(simulator) "' + n + ' ' + a.join(' ') + '" — nothing to install in this sandbox; everything you need is already here.\n'); };
  });
  builtins.alias = builtins.unalias = builtins.install = builtins.set = builtins.source = builtins.ulimit = function () { };
  builtins.sudo = function (a, c) { if (!a.length) return 1; return c.sh.commands[a[0]] ? c.sh.commands[a[0]](a.slice(1), c) : (c.err(a[0] + ': command not found\n'), 127); };
  builtins.bash = builtins.sh = builtins['/bin/bash'] = function (a, c) { c.out('(simulator) nested shells are not needed here.\n'); };
  builtins.type = builtins.which;
  sim.builtins = builtins; sim.Shell = Shell;

  /* ───────────── script → command list (continuations, heredocs) ───────────── */
  function scriptToCommands(script) {
    var raw = String(script).split(/\r?\n/), cmds = [], i = 0;
    while (i < raw.length) {
      var line = raw[i++];
      if (!line.trim()) continue;
      if (/^\s*#/.test(line)) { cmds.push({ comment: line.trim() }); continue; }
      while (/\\\s*$/.test(line) && i < raw.length) line = line.replace(/\\\s*$/, ' ') + raw[i++].trim();
      var hd = line.match(/<<-?\s*(['"]?)(\w+)\1/), stdin;
      if (hd) { var body = []; while (i < raw.length && raw[i].trim() !== hd[2]) body.push(raw[i++]); i++; stdin = body.join('\n') + '\n'; line = line.replace(hd[0], ''); }
      cmds.push({ line: line.replace(/^\s*\$\s+/, '').trim(), stdin: stdin });
    }
    return cmds;
  }
  sim.scriptToCommands = scriptToCommands;

  /* ───────────── terminal UI ───────────── */
  var TCSS = '#sim-root:has(.tm){height:100vh;overflow:hidden}.tm{display:flex;flex-direction:column;height:100%;padding:0!important;overflow:hidden!important}.tm-scroll{flex:1;overflow:auto;padding:12px 14px;font:12.5px/1.6 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;white-space:pre-wrap;word-break:break-word}' +
    '.tm-p{color:#3fb950;font-weight:600}.tm-c{color:#e6edf3;font-weight:600}.tm-o{color:#c9d1d9}.tm-e{color:#ff7b72}.tm-d{color:#8b949e;font-style:italic}.tm-i{color:#79c0ff}' +
    '.tm-row{display:flex;align-items:center;gap:8px;padding:8px 14px;border-top:1px solid #30363d;background:#0d1117;font:12.5px ui-monospace,Menlo,Consolas,monospace}.tm-row input{flex:1;background:none;border:0;outline:none;color:#e6edf3;font:inherit;caret-color:#3fb950}' +
    '.tm-hint{color:#484f58;font:11px system-ui;padding:0 14px 8px}';
  // Programs write progress/info to stderr too (docker build steps, git push summary…); only real failures are shown in red.
  var INFO_ERR = /^(\[\+\]|Cloning into|remote:|Everything up-to-date|Enumerating|Counting|Writing objects|Total \d|To \S|hint:|Note:|WARNING|Unable to find image|Receiving|Unpacking|Successfully|Already up to date|Switched to|Reading messages|\(simulator\)| => |ℹ)/;
  // In a lesson example (script mode) some commands are listed as alternatives, so repeating one is expected rather than a failure.
  var SOFT_ERR = /already exists|no merge to abort|is not a valid reference|did not match any files|not found\.?$|No such container|does not match any|index not found/;
  sim.inScript = false;
  sim.isRealError = function (text) { var first = String(text).replace(/^\s+/, '').split('\n')[0]; return !INFO_ERR.test(first) && !(sim.inScript && SOFT_ERR.test(first)); };
  sim.term = {
    /* engine: { title, sub, shell (Shell instance), banner?: string, prompt?: fn(shell), exec?: fn(line) -> chunks (overrides shell.run), examples?: [] } */
    mount: function (engine, script) {
      if (!document.getElementById('sim-term-css')) document.head.appendChild(h('style', { id: 'sim-term-css', text: TCSS }));
      var shell = engine.shell, shui = ui.init({ title: engine.title, sub: engine.sub || '' });
      var scroll = h('div', { class: 'tm-scroll' }), promptEl = h('span', { class: 'tm-p' }), input = h('input', { spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off', placeholder: engine.placeholder || 'type a command and press Enter', 'aria-label': 'Terminal input' });
      var row = h('div', { class: 'tm-row' }, promptEl, input), pane = h('div', { class: 'tm' }, scroll, row);
      shui.addTab('term', 'Terminal', pane); shui.live(true);
      function prompt() { return engine.prompt ? engine.prompt(shell) : shell.prompt(); }
      function refresh() { promptEl.textContent = prompt(); }
      function print(text, cls) { var d = h('div', { class: cls || 'tm-o' }); d.textContent = text.replace(/\n$/, ''); scroll.appendChild(d); scroll.scrollTop = scroll.scrollHeight; }
      shell.onClear = function () { scroll.innerHTML = ''; };
      var histIdx = 0;
      async function exec(line, stdin, display) {
        var echo = display; var pr = document.createElement('div'); pr.className = 'tm-o';
        pr.appendChild(h('span', { class: 'tm-p', text: prompt() })); pr.appendChild(h('span', { class: 'tm-c', text: display || line })); scroll.appendChild(pr);
        shell.history.push(line);
        var r;
        try { r = engine.exec ? await engine.exec(line, stdin) : await shell.run(line, stdin); }
        catch (e) { if (e && e.__exit) { print('logout', 'tm-d'); return; } r = { chunks: [{ t: 'err', s: String(e && e.message ? e.message : e) + '\n' }], code: 1 }; }
        r.chunks.forEach(function (ch) { if (ch.s) print(ch.s, ch.t === 'err' && sim.isRealError(ch.s) ? 'tm-e' : 'tm-o'); });
        refresh(); void echo;
      }
      if (engine.banner) print(engine.banner, 'tm-d');
      refresh();
      var chain = Promise.resolve(engine.prepare ? engine.prepare(script || '') : null).then(function (note) { if (note) print(note, /^❌/.test(note) ? 'tm-e' : 'tm-i'); refresh(); });
      chain = chain.then(function () {
        var cmds = engine.parseScript ? engine.parseScript(script || '') : scriptToCommands(script || ''), inner = Promise.resolve();
        if (engine.scriptMode) engine.scriptMode(true); sim.inScript = true;
        cmds.forEach(function (c) { inner = inner.then(function () { if (c.comment) { print(c.comment, 'tm-d'); return; } return exec(c.line, c.stdin, c.display); }); });
        return inner.then(function () { if (engine.scriptMode) engine.scriptMode(false); sim.inScript = false; });
      });
      chain.then(function () { input.focus(); print('', 'tm-o'); });
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { var v = input.value; input.value = ''; histIdx = shell.history.length; if (v.trim()) exec(v.trim()); else print(prompt(), 'tm-p'); }
        else if (e.key === 'ArrowUp') { if (histIdx > 0) { histIdx--; input.value = shell.history[histIdx] || ''; } e.preventDefault(); }
        else if (e.key === 'ArrowDown') { if (histIdx < shell.history.length) { histIdx++; input.value = shell.history[histIdx] || ''; } e.preventDefault(); }
        else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); scroll.innerHTML = ''; }
      });
      scroll.addEventListener('click', function () { input.focus(); });
      return { print: print, exec: exec, chain: chain };
    }
  };

  /* ───────────── boot for terminal-based languages ───────────── */
  sim.bootTerm = function (kind, src) {
    var parsed = sim.parseFiles(src), script = '', files = [];
    parsed.forEach(function (f) { if (f.name) files.push(f); else script += f.content; });
    var factory = sim.engines[kind];
    if (!factory) { sim.ui.init({ title: 'Simulator' }); ui.error('The "' + kind + '" simulator failed to load.'); return; }
    var engine = factory({ files: files });
    files.forEach(function (f) { var full = path.resolve(engine.shell.cwd, f.name), d = path.dirname(full); d.split('/').reduce(function (a, p) { if (!p) return a; a += '/' + p; sim.dirs[a] = 1; return a; }, ''); sim.files[full] = f.content; });
    sim.term.mount(engine, script);
  };
})(window);
