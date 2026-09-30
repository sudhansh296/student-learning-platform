/* WebDev Atlas — simulator bootstrap: multi-file parsing (// FILE: name), ESM→CommonJS, running the entry file. */
(function (G) {
  'use strict';
  var sim = G.__sim, post = sim.post, path = sim.path;
  sim.bootErrors = [];

  /* ── "// FILE: app/page.js" separates files inside one editor buffer ── */
  function parseFiles(src) {
    var lines = String(src).split(/\r?\n/), files = [], cur = null, pre = [];
    lines.forEach(function (l) {
      var m = l.match(/^\s*(?:\/\/|#|--|\/\*)\s*FILE:\s*([^\s*]+)\s*(?:\*\/)?\s*$/);
      if (m) { cur = { name: m[1].replace(/^\.?\//, ''), lines: [] }; files.push(cur); } else if (cur) cur.lines.push(l); else pre.push(l);
    });
    var out = files.map(function (f) { return { name: f.name, content: f.lines.join('\n').replace(/^\n+|\s+$/g, '') + '\n' }; });
    if (pre.join('').trim()) out.unshift({ name: null, content: pre.join('\n') });
    return out;
  }
  sim.parseFiles = parseFiles;

  /* ── ES modules → CommonJS (best effort, regex based) ── */
  function esmToCjs(src) {
    if (!/^\s*(import|export)\b|import\.meta/m.test(src)) return src;
    var tail = [], hasExport = /^\s*export\b/m.test(src);
    var s = src
      .replace(/import\.meta\.url/g, "'file:///app/index.js'").replace(/import\.meta\.dirname/g, "'/app'").replace(/import\.meta\.filename/g, "'/app/index.js'")
      .replace(/^\s*import\s+type\s+[^;\n]+;?[ \t]*$/gm, '')
      .replace(/^\s*import\s+(\w+)\s*,\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"];?/gm, function (m, d, n, from) { return 'const ' + d + ' = __interop(require(' + JSON.stringify(from) + ')); const {' + n.replace(/\s+as\s+/g, ': ') + '} = require(' + JSON.stringify(from) + ');'; })
      .replace(/^\s*import\s+(\w+)\s*,\s*\*\s+as\s+(\w+)\s+from\s*['"]([^'"]+)['"];?/gm, function (m, d, ns, from) { return 'const ' + ns + ' = require(' + JSON.stringify(from) + '); const ' + d + ' = __interop(' + ns + ');'; })
      .replace(/^\s*import\s+\*\s+as\s+(\w+)\s+from\s*['"]([^'"]+)['"];?/gm, function (m, ns, from) { return 'const ' + ns + ' = require(' + JSON.stringify(from) + ');'; })
      .replace(/^\s*import\s+\{([^}]+)\}\s*from\s*['"]([^'"]+)['"];?/gm, function (m, n, from) { return 'const {' + n.replace(/\s+as\s+/g, ': ') + '} = require(' + JSON.stringify(from) + ');'; })
      .replace(/^\s*import\s+(\w+)\s+from\s*['"]([^'"]+)['"];?/gm, function (m, d, from) { return 'const ' + d + ' = __interop(require(' + JSON.stringify(from) + '));'; })
      .replace(/^\s*import\s*['"]([^'"]+)['"];?/gm, function (m, from) { return 'require(' + JSON.stringify(from) + ');'; })
      .replace(/^\s*export\s+default\s+(async\s+function|function|class)\s+(\w+)/gm, function (m, k, n) { tail.push('exports.default = ' + n + ';'); return k + ' ' + n; })
      .replace(/^\s*export\s+default\s+/gm, 'exports.default = ')
      .replace(/^\s*export\s+(async\s+function|function|class)\s+(\w+)/gm, function (m, k, n) { tail.push('exports.' + n + ' = ' + n + ';'); return k + ' ' + n; })
      .replace(/^\s*export\s+(const|let|var)\s+(\w+)/gm, function (m, k, n) { tail.push('exports.' + n + ' = ' + n + ';'); return k + ' ' + n; })
      .replace(/^\s*export\s*\{([^}]*)\};?/gm, function (m, names) { names.split(',').forEach(function (p) { var a = p.trim().split(/\s+as\s+/); if (a[0]) tail.push('exports.' + (a[1] || a[0]) + ' = ' + a[0] + ';'); }); return ''; });
    var head = 'var __interop=function(m){return m&&m.__esModule?m.default:m};' + (hasExport ? 'Object.defineProperty(exports,"__esModule",{value:true});' : '');
    return head + s + '\n' + tail.join('\n');
  }
  sim.transformSource = esmToCjs;

  function mkdirs(dir) { var parts = dir.split('/').filter(Boolean), cur = ''; parts.forEach(function (p) { cur += '/' + p; sim.dirs[cur] = 1; }); }
  function seed(files) { files.forEach(function (f) { var full = '/app/' + f.name; mkdirs(path.dirname(full)); sim.files[full] = f.content; }); }
  function pickMain(files) {
    var js = files.filter(function (f) { return /\.(m|c)?js$/.test(f.name); });
    var pref = ['index.js', 'app.js', 'server.js', 'main.js', 'index.mjs', 'app.mjs', 'server.mjs', 'main.mjs'];
    for (var i = 0; i < pref.length; i++) for (var j = 0; j < js.length; j++) if (js[j].name === pref[i]) return js[j];
    return js[0] || null;
  }
  function report(e) {
    if (!e || e.__procExit) return;
    var msg = e instanceof Error ? (e.stack ? String(e.stack).split('\n').filter(function (l) { return !/sim-(core|net|express|boot|next|testing)\.js|<anonymous>:\d+:\d+\)?$/.test(l) || /^\w*Error/.test(l); }).slice(0, 6).join('\n') : e.name + ': ' + e.message) : String(e);
    if (!e.__reported) post('e', msg);
    sim.bootErrors.push(msg);
  }

  /* Tutorial snippets often show only routes (app.get(...)) without creating the app. Add the missing boilerplate. */
  function scaffold(src) {
    var pre = '', post = '', notes = [];
    var usesApp = /(^|[^.\w$])app\.(get|post|put|patch|delete|use|all|listen|route|set|param|engine|locals)\b/.test(src);
    var declaresApp = /\b(?:const|let|var)\s+app\b|\bfunction\s+app\b|(^|[^.\w$])app\s*=[^=]|\(\s*app\s*[,)]|,\s*app\s*\)/m.test(src);
    var hasExpress = /\b(?:const|let|var)\s+express\b|\bimport\s+express\b|\{\s*[^}]*\}\s*=\s*require\(\s*['"]express['"]\s*\)/.test(src);
    if (usesApp && !declaresApp) {
      pre += (hasExpress ? '' : "const express = require('express');") + 'const app = express();';
      if (!/express\.json\(/.test(src)) pre += 'app.use(express.json());';
      notes.push('const app = express()');
    }
    var usesRouter = /(^|[^.\w$])router\.(get|post|put|patch|delete|use|all|route|param)\b/.test(src);
    var declaresRouter = /\b(?:const|let|var)\s+router\b|(^|[^.\w$])router\s*=[^=]/.test(src);
    if (usesRouter && !declaresRouter) {
      pre += "const router = require('express').Router();";
      if (!usesApp || declaresApp) post += "\n;(function(){var e=require('express'),a=e();a.use(e.json());a.use(router);})();";
      else post += '\napp.use(router);';
      notes.push('const router = express.Router()');
    }
    // Like the Node REPL, make core modules available when a fragment uses them without requiring them first.
    ['fs', 'path', 'os', 'crypto', 'http', 'https', 'util', 'url', 'zlib', 'readline', 'assert'].forEach(function (m) {
      var used = new RegExp('(^|[^.\\w$\'"/])' + m + '\\.[A-Za-z]').test(src);
      var declared = new RegExp('\\b(?:const|let|var)\\s+' + m + '\\b|\\bimport\\s+(?:\\*\\s+as\\s+)?' + m + '\\b|\\b(?:function|class)\\s+' + m + '\\b|\\{[^}]*\\b' + m + '\\b[^}]*\\}\\s*=\\s*require|,\\s*' + m + '\\s*\\)|\\(\\s*' + m + '\\s*[,)]').test(src);
      if (used && !declared) { pre += 'const ' + m + " = require('" + m + "');"; notes.push("require('" + m + "')"); }
    });
    return { code: pre + (pre ? '\n' : '') + src + post, notes: notes };
  }

  /* Files most tutorials assume already exist — only created when the user didn't provide their own. */
  var SAMPLE_FILES = {
    'data.txt': 'Hello from data.txt\nSecond line\nThird line\n', 'file.txt': 'Hello, this is file.txt!\n', 'input.txt': 'line one\nline two\nline three\n', 'example.txt': 'This is an example file.\n', 'notes.txt': 'My notes\n',
    'largefile.txt': Array.from({ length: 200 }, function (_, i) { return 'Line ' + (i + 1) + ': The quick brown fox jumps over the lazy dog.'; }).join('\n') + '\n',
    'users.json': JSON.stringify([{ id: 1, name: 'Alice', email: 'alice@example.com' }, { id: 2, name: 'Bob', email: 'bob@example.com' }], null, 2) + '\n',
    'config.json': JSON.stringify({ port: 3000, debug: true, name: 'my-app', userFile: 'users.json', dataFile: 'data.txt', inputFile: 'input.txt', outputFile: 'output.json' }, null, 2) + '\n',
    'temp.txt': 'temporary file\n', 'code.js': "console.log('hello from code.js');\n", 'users.csv': 'id,name,email\n1,Alice,alice@example.com\n2,Bob,bob@example.com\n', 'data.csv': 'a,b,c\n1,2,3\n', 'src.txt': 'source text\n', 'dest.txt': 'destination text\n', 'old.txt': 'old file\n', 'source.txt': 'source file\n', 'folder/file.txt': 'file inside folder\n', 'logs/app.log': 'app started\n', 'data/data.json': '[]\n', 'uploads/.gitkeep': '',
    'package.json': JSON.stringify({ name: 'my-app', version: '1.0.0', main: 'index.js', scripts: { start: 'node index.js' }, dependencies: { express: '^5.1.0' } }, null, 2) + '\n',
    'README.md': '# My App\n\nA sample project.\n'
  };
  sim.scaffold = scaffold;
  SAMPLE_FILES['public/index.html'] = '<!DOCTYPE html>\n<html><head><meta charset="utf-8"><title>Sample page</title><link rel="stylesheet" href="/style.css"></head>\n<body><h1>Hello from public/index.html</h1><p>Served by express.static.</p></body></html>\n';
  SAMPLE_FILES['public/style.css'] = 'body { font-family: system-ui, sans-serif; margin: 2rem; }\nh1 { color: #2563eb; }\n';
  SAMPLE_FILES['public/script.js'] = 'console.log("static script loaded");\n';
  SAMPLE_FILES['views/index.ejs'] = '<h1><%= typeof title !== "undefined" ? title : "Hello from views/index.ejs" %></h1>\n<p><%= typeof message !== "undefined" ? message : "Rendered by the EJS view engine." %></p>\n';
  SAMPLE_FILES['views/layout.ejs'] = '<html><body><%- typeof body !== "undefined" ? body : "" %></body></html>\n';
  function seedSamples() { Object.keys(SAMPLE_FILES).forEach(function (n) { var p = '/app/' + n; if (!(p in sim.files)) { sim.files[p] = SAMPLE_FILES[n]; var d = p.replace(/\/[^/]+$/, ''); d.split('/').reduce(function (acc, seg) { if (!seg) return acc; acc += '/' + seg; sim.dirs[acc] = 1; return acc; }, ''); } }); }

  /* Lessons often show several alternatives in one block (const user = ... twice). Node would reject the redeclaration, so
   * when a top-level const/let name repeats we turn them into var so the block still runs. */
  function declNames(rest) {
    // "{ a, b: c = 1 }" / "[x, y]" / "name" -> identifiers
    var m = rest.match(/^\s*([{\[])([^}\]]*)[}\]]/);
    if (m) return m[2].split(',').map(function (p) { p = p.split('=')[0].trim(); var alias = p.split(':'); return (alias[alias.length - 1] || '').replace(/^\.\.\./, '').trim(); }).filter(Boolean);
    m = rest.match(/^\s*([A-Za-z_$][\w$]*)/); return m ? [m[1]] : [];
  }
  function dedupeDecls(src) {
    var re = /^(const|let|var|function\*?|async\s+function|class)\s+([^\n]*)/gm, seen = {}, dups = {}, m;
    while ((m = re.exec(src))) {
      var kw = m[1], names = /^(function|async|class)/.test(kw) ? declNames(m[2].replace(/^\*\s*/, '')) : declNames(m[2]);
      names.forEach(function (n) { if (seen[n]) dups[n] = 1; seen[n] = 1; });
    }
    var dupNames = Object.keys(dups); if (!dupNames.length) return { code: src, names: [] };
    return { code: src.replace(/^(const|let)(\s+)([^\n]*)/gm, function (all, kw, sp, rest) { return declNames(rest).some(function (n) { return dups[n]; }) ? 'var' + sp + rest : all; }), names: dupNames };
  }
  sim.dedupeDecls = dedupeDecls;

  sim.seedSamples = seedSamples;

  var AsyncFn = Object.getPrototypeOf(async function () { }).constructor;
  function compiles(c) { try { new AsyncFn(esmToCjs(c)); return true; } catch (e) { return false; } }

  /* Lessons annotate JavaScript with TypeScript types now and then — strip the common forms (only used when the code doesn't compile as is). */
  function stripTs(c) {
    return c
      .replace(/^[ \t]*(?:export\s+)?interface\s+\w+[^{]*\{[\s\S]*?\n\}/gm, '')
      .replace(/^[ \t]*(?:export\s+)?type\s+\w+(?:<[^>]*>)?\s*=[^;]+;/gm, '')
      .replace(/\)\s*:\s*[\w<>\[\]|,.\s?'"]+?(?=\s*(?:\{|=>))/g, ')')
      .replace(/([\w$\]\)])\??\s*:\s*(?:string|number|boolean|any|unknown|void|never|object|null|undefined|Date|Promise<[^>]*>|Array<[^>]*>|Record<[^>]*>|[A-Z][\w.]*(?:<[^>]*>)?(?:\[\])*|\w+\[\])(?:\s*\|\s*[\w'"]+)*(?=\s*[,)=;\n{])/g, '$1')
      .replace(/\s+as\s+(?:const|[A-Z]\w*(?:<[^>]*>)?|string|number|any|unknown)\b/g, '')
      .replace(/(\w)<[A-Z]\w*(?:,\s*\w+)*>\(/g, '$1(');
  }

  /* Comment out the parts (blank-line separated blocks) that do not compile; `ok(text)` says whether a block compiles. */
  // JSX "usage" lines written one after another at the top level need a ; between them to parse.
  function fixSemis(code) { return code.replace(/^(<[A-Za-z][^\n]*(?:\/>|<\/[\w.]+>)|<\/[\w.]+>|\/>)([ \t]*(?:\/\/[^\n]*)?)$/gm, '$1;$2'); }
  function skipBroken(code, ok) {
    if (ok(code)) return { code: code, skipped: 0 };
    var semi = fixSemis(code); if (semi !== code && ok(semi)) return { code: semi, skipped: 0 };
    code = semi;
    var lines = code.split('\n'), chunks = [], cur = [], depth = 0, q = null, bc = false;
    lines.forEach(function (ln) {
      cur.push(ln);
      for (var i = 0; i < ln.length; i++) {
        var c = ln[i], n = ln[i + 1];
        if (bc) { if (c === '*' && n === '/') { bc = false; i++; } continue; }
        if (q) { if (c === '\\') i++; else if (c === q) q = null; continue; }
        if (c === '/' && n === '/') break; if (c === '/' && n === '*') { bc = true; i++; continue; }
        if (c === '"' || c === "'" || c === '`') { q = c; continue; }
        if ('{[('.indexOf(c) >= 0) depth++; else if ('}])'.indexOf(c) >= 0) depth--;
      }
      if (q && q !== '`') q = null;
      if (!ln.trim() && depth <= 0 && !q && !bc) { chunks.push(cur.join('\n')); cur = []; depth = 0; }
    });
    if (cur.length) chunks.push(cur.join('\n'));
    var skipped = 0, out = chunks.map(function (ch) {
      if (!ch.trim() || ok(ch)) return ch;
      skipped++; return ch.split('\n').map(function (l) { return l.trim() ? '// ' + l : l; }).join('\n');
    }).join('\n');
    return skipped && ok(out) ? { code: out, skipped: skipped } : { code: code, skipped: 0 };
  }
  sim.skipBroken = skipBroken;

  /* Blocks that mix runnable code with illustrations (a JSON document, a URL, a shell line) — skip the pieces that aren't JavaScript. */
  function sanitize(code) {
    if (compiles(code)) return { code: code, skipped: 0, ts: false };
    var ts = stripTs(code); if (ts !== code && compiles(ts)) return { code: ts, skipped: 0, ts: true };
    var r = skipBroken(ts !== code ? ts : code, compiles);
    return r.code !== (ts !== code ? ts : code) ? { code: r.code, skipped: r.skipped, ts: ts !== code } : { code: code, skipped: 0, ts: false };
  }

  var KEYWORDS = {}; 'break case catch class const continue debugger default delete do else enum export extends false finally for function if import in instanceof let new null return super switch this throw true try typeof var void while with yield await async of static get set undefined NaN Infinity arguments'.split(' ').forEach(function (k) { KEYWORDS[k] = 1; });
  /* Names the snippet uses but never defines (validateUser, authController…): give them placeholders instead of a ReferenceError. */
  function stubUndefined(code) {
    if (/ReferenceError|is not defined|typeof\s|not defined/.test(code)) return [];
    var stripped = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '').replace(/(['"`])(?:\\.|(?!\1)[^\\\n])*\1/g, '""');
    var re = /(^|[^.\w$])([A-Za-z_$][\w$]*)/g, m, names = [];
    while ((m = re.exec(stripped))) { var n = m[2]; if (KEYWORDS[n] || n in G || names.indexOf(n) >= 0) continue; names.push(n); }
    var made = [];
    names.forEach(function (n) { try { G[n] = sim.makeStub(n); made.push(n); } catch (e) { /* not assignable */ } });
    return made;
  }

  /* One entry point for "source text -> files ready to run" (used by the simulator and by the lesson verifier). */
  sim.stubUndefined = stubUndefined;
  sim.prepareNode = function (src) {
    var notes = [], parsed = parseFiles(src);
    var files = parsed.map(function (f, i) { return { name: f.name || (i === 0 ? 'index.js' : 'file' + i + '.js'), content: f.content }; });
    files.forEach(function (f) { f.content = f.content.replace(/^[ \t]*(?:\$[ \t]*)?(?:npm|npx|yarn|pnpm)[ \t]+\S.*$/gm, function (l) { return '// ' + l.trim(); }); });
    if (files.length === 1) {
      var sc = scaffold(files[0].content);
      if (sc.notes.length) { files[0].content = sc.code; notes.push('Snippet detected \u2014 added ' + sc.notes.join(' and ') + ' so it can run.'); }
      var dd = dedupeDecls(files[0].content);
      if (dd.names.length) { files[0].content = dd.code; notes.push('This block declares ' + dd.names.join(', ') + ' more than once (alternative versions) \u2014 using var so it can run.'); }
    }
    files.forEach(function (f) {
      if (!/\.(js|mjs|cjs|jsx|ts)$/.test(f.name)) return;
      var r = sanitize(f.content); f.content = r.code;
      if (r.ts) notes.push('TypeScript type annotations were removed so the code can run as JavaScript.');
      if (r.skipped) notes.push('Skipped ' + r.skipped + ' part' + (r.skipped > 1 ? 's' : '') + ' of the block that ' + (r.skipped > 1 ? 'are' : 'is') + ' not JavaScript (a JSON/config example or an illustration).');
    });
    return { files: files, notes: notes };
  };

  function bootNodeNow(src) {
    sim.lenient = true;
    var prep = sim.prepareNode(src), files = prep.files;
    prep.notes.forEach(function (n) { post('l', '\u2139\ufe0f ' + n); });
    seed(files); seedSamples();
    var main = pickMain(files);
    var done = Promise.resolve();
    if (!main) { sim.bootErrors.push('No JavaScript entry file found. Add code, or name a file index.js / app.js / server.js.'); }
    else {
      G.__filename = '/app/' + main.name; G.__dirname = path.dirname(G.__filename);
      var code = esmToCjs(main.content), usesAwait = /\bawait\b/.test(code);
      files.forEach(function (f) { if (/\.(js|mjs|cjs|jsx|ts)$/.test(f.name)) stubUndefined(f.content); });
      try {
        var fn = sim.defModule(code, '/app/' + main.name, { main: true, async: usesAwait });
        var r = fn.call(G.module.exports, G.exports, G.require, G.module);
        if (r && typeof r.then === 'function') done = r.then(undefined, report);
      } catch (e) { report(e); }
    }
    return done.then(function () { return sim.finishExpress(); });
  }
  sim.bootNode = function (src) { return (sim.preload ? sim.preload(src) : Promise.resolve()).then(function () { return bootNodeNow(src); }); };

  sim.bootNext = function (src) {
    var parsed = parseFiles(src), map = {};
    parsed.forEach(function (f, i) {
      var name = f.name;
      if (!name) name = /export\s+(async\s+)?function\s+(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\b|export\s+const\s+(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s*=/.test(f.content) ? 'app/api/hello/route.js' : (i === 0 ? 'app/page.js' : 'app/extra' + i + '.js');
      map[name] = f.content;
    });
    seed(Object.keys(map).map(function (k) { return { name: k, content: map[k] }; }));
    try { sim.next.run(map); } catch (e) { post('e', '❌ ' + e.message); sim.ui.init({ title: 'Next.js Simulator' }); sim.ui.error(String(e && e.message ? e.message : e)); }
  };

  sim.boot = function (kind, src) {
    if (kind === 'next') return sim.bootNext(src);
    if (kind === 'git' || kind === 'redis' || kind === 'docker' || kind === 'postgres' || kind === 'mongo') return sim.bootTerm(kind, src);
    if (kind === 'json' || kind === 'yaml' || kind === 'http') return sim.bootData(kind, src);
    return sim.bootNode(src);
  };
})(window);
