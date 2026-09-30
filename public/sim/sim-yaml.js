/* WebDev Atlas — small YAML parser/dumper (the subset used by docker-compose, GitHub Actions, k8s manifests, configs):
 * block maps/sequences, flow [..] / {..}, quoted scalars, | and > block scalars, anchors/aliases/merge keys, comments,
 * multi-document files. Errors carry line numbers. */
(function (G) {
  'use strict';
  var sim = G.__sim;

  function YamlError(msg, line, col) { var e = new Error(msg + (line ? ' (line ' + line + (col ? ', column ' + col : '') + ')' : '')); e.name = 'YAMLException'; e.line = line; e.col = col; e.msg = msg; return e; }

  function stripComment(s) {
    var q = null;
    for (var i = 0; i < s.length; i++) { var c = s[i]; if (q) { if (c === q) { if (q === "'" && s[i + 1] === "'") i++; else q = null; } else if (q === '"' && c === '\\') i++; } else if (c === '"' || c === "'") { if (i === 0 || /[\s,:[\]{}-]/.test(s[i - 1])) q = c; } else if (c === '#' && (i === 0 || /\s/.test(s[i - 1]))) return s.slice(0, i).replace(/\s+$/, ''); }
    return s.replace(/\s+$/, '');
  }
  function splitKey(s) {
    var q = null, depth = 0;
    for (var i = 0; i < s.length; i++) {
      var c = s[i];
      if (q) { if (c === q) { if (q === "'" && s[i + 1] === "'") i++; else q = null; } else if (q === '"' && c === '\\') i++; continue; }
      if ((c === '"' || c === "'") && i === 0) { q = c; continue; }
      if (c === '[' || c === '{') depth++; else if (c === ']' || c === '}') depth--;
      if (c === ':' && depth === 0 && (i === s.length - 1 || s[i + 1] === ' ')) return { key: s.slice(0, i), rest: s.slice(i + 1).replace(/^\s+/, '') };
    }
    return null;
  }
  function scalar(s, line) {
    s = s.trim();
    if (s === '' || s === '~' || s === 'null' || s === 'Null' || s === 'NULL') return null;
    if (/^(true|True|TRUE)$/.test(s)) return true; if (/^(false|False|FALSE)$/.test(s)) return false;
    if (/^[-+]?\d+$/.test(s)) return parseInt(s, 10); if (/^0x[0-9a-fA-F]+$/.test(s)) return parseInt(s, 16); if (/^[-+]?(\d+\.\d*|\.\d+|\d+)([eE][-+]?\d+)?$/.test(s)) return parseFloat(s);
    if (/^\.inf$/i.test(s)) return Infinity; if (/^-\.inf$/i.test(s)) return -Infinity; if (/^\.nan$/i.test(s)) return NaN;
    if (s[0] === '"') { if (s.length < 2 || s[s.length - 1] !== '"') throw YamlError('missed comma between flow collection entries or unterminated double-quoted string', line); try { return JSON.parse(s.replace(/\\([^"\\/bfnrtu])/g, '$1')); } catch (e) { return s.slice(1, -1); } }
    if (s[0] === "'") { if (s.length < 2 || s[s.length - 1] !== "'") throw YamlError('unterminated single-quoted string', line); return s.slice(1, -1).replace(/''/g, "'"); }
    return s;
  }
  /* flow collections and scalars on a single line */
  function parseFlow(str, line, anchors) {
    var i = 0;
    function ws() { while (i < str.length && /\s/.test(str[i])) i++; }
    function value() {
      ws(); var c = str[i];
      if (c === '[') { i++; var arr = []; ws(); while (str[i] !== ']') { if (i >= str.length) throw YamlError('unexpected end of flow sequence, expected ]', line); arr.push(value()); ws(); if (str[i] === ',') { i++; ws(); } else if (str[i] !== ']') throw YamlError("expected ',' or ']' in flow sequence", line, i + 1); } i++; return arr; }
      if (c === '{') { i++; var obj = {}; ws(); while (str[i] !== '}') { if (i >= str.length) throw YamlError('unexpected end of flow mapping, expected }', line); var k = token(':'); ws(); if (str[i] === ':') { i++; obj[String(scalar(k, line))] = value(); } else obj[String(scalar(k, line))] = null; ws(); if (str[i] === ',') { i++; ws(); } else if (str[i] !== '}') throw YamlError("expected ',' or '}' in flow mapping", line, i + 1); } i++; return obj; }
      if (c === '*') { var nm = token(',]}').slice(1).trim(); if (!(nm in anchors)) throw YamlError('unknown anchor "' + nm + '" referenced', line); return anchors[nm]; }
      if (c === '"' || c === "'") { var st = i, q = c; i++; while (i < str.length && (str[i] !== q || (q === "'" && str[i + 1] === "'" && (i++, true)))) { if (q === '"' && str[i] === '\\') i++; i++; } i++; return scalar(str.slice(st, i), line); }
      return scalar(token(',]}'), line);
    }
    function token(stops) { var st = i; while (i < str.length && stops.indexOf(str[i]) < 0 && !(str[i] === ':' && /[\s,\]}]|$/.test(str[i + 1] || ' ') && stops.indexOf(':') >= 0)) i++; var t = str.slice(st, i); return t; }
    var v = value(); ws(); if (i < str.length) throw YamlError('unexpected content after flow value', line, i + 1); return v;
  }

  function parseDoc(rawLines, startLine) {
    var anchors = {}, lines = [];
    rawLines.forEach(function (raw, idx) {
      if (/^\s*\t/.test(raw) || /^ *\t/.test(raw)) { if (raw.trim() && raw.trim()[0] !== '#') throw YamlError("found character '\\t' that cannot start any token — YAML forbids tabs for indentation, use spaces", startLine + idx, 1); }
      var text = stripComment(raw), ind = text.match(/^ */)[0].length;
      lines.push({ raw: raw, text: text.slice(ind), indent: ind, n: startLine + idx, blank: !text.trim() });
    });
    var pos = 0;
    function skipBlank() { while (pos < lines.length && lines[pos].blank) pos++; }
    function peek() { skipBlank(); return lines[pos]; }
    function withAnchor(str, cb, line) { var m = str.match(/^&(\S+)\s*(.*)$/); if (m) { var v = cb(m[2]); anchors[m[1]] = v; return v; } return cb(str); }
    function inlineValue(rest, line, parentIndent) {
      return withAnchor(rest, function (r) {
        if (r === '' ) return undefined;
        if (r[0] === '*') { var nm = r.slice(1).trim(); if (!(nm in anchors)) throw YamlError('unknown anchor "' + nm + '" referenced', line); return anchors[nm]; }
        if (r[0] === '|' || r[0] === '>') return blockScalar(r, parentIndent);
        if (r[0] === '[' || r[0] === '{') { var full = r, guard = 0; while (!balanced(full) && pos < lines.length && guard++ < 200) { full += ' ' + lines[pos].text.trim(); pos++; } return parseFlow(full, line, anchors); }
        if ((r[0] === '"' || r[0] === "'") && !closedQuote(r)) { var q = r[0], joined = r; while (!closedQuote(joined) && pos < lines.length) { joined += ' ' + lines[pos].text.trim(); pos++; } return scalar(joined, line); }
        // plain multi-line scalar continuation
        var text = r, nx = lines[pos]; while (nx && !nx.blank && nx.indent > parentIndent && !splitKey(nx.text) && nx.text[0] !== '-' && /^[^\[{"'&*|>#]/.test(nx.text) && false) { text += ' ' + nx.text; pos++; nx = lines[pos]; }
        return scalar(text, line);
      }, line);
    }
    function closedQuote(s) { var q = s[0]; if (s.length < 2) return false; var i = 1; while (i < s.length) { if (s[i] === q) { if (q === "'" && s[i + 1] === "'") { i += 2; continue; } return true; } if (q === '"' && s[i] === '\\') i++; i++; } return false; }
    function balanced(s) { var d = 0, q = null; for (var i = 0; i < s.length; i++) { var c = s[i]; if (q) { if (c === q) q = null; continue; } if (c === '"' || c === "'") q = c; else if (c === '[' || c === '{') d++; else if (c === ']' || c === '}') d--; } return d <= 0; }
    function blockScalar(head, parentIndent) {
      var fold = head[0] === '>', chomp = /-/.test(head) ? 'strip' : /\+/.test(head) ? 'keep' : 'clip', body = [], blockIndent = null;
      while (pos < lines.length) {
        var L = lines[pos];
        if (L.blank) { body.push(''); pos++; continue; }
        if (L.indent <= parentIndent) break;
        if (blockIndent === null) blockIndent = L.indent; if (L.indent < blockIndent) break;
        body.push(L.raw.slice(blockIndent)); pos++;
      }
      while (body.length && body[body.length - 1] === '') body.pop();
      var text = fold ? body.reduce(function (acc, l, i) { return i === 0 ? l : acc + (l === '' || body[i - 1] === '' ? '\n' : ' ') + l; }, '') : body.join('\n');
      return chomp === 'strip' ? text : text + '\n';
    }
    function block(indent) {
      var L = peek(); if (!L) return null;
      if (L.text[0] === '-' && (L.text.length === 1 || L.text[1] === ' ')) return seq(L.indent);
      if (splitKey(L.text)) return map(L.indent);
      pos++; return inlineValue(L.text, L.n, indent - 1);
    }
    function seq(indent) {
      var out = [], L;
      while ((L = peek()) && L.indent === indent && L.text[0] === '-' && (L.text.length === 1 || L.text[1] === ' ')) {
        var rest = L.text.slice(1).replace(/^\s+/, ''), off = L.text.length - rest.length;
        if (rest === '') { pos++; var nx = peek(); out.push(nx && nx.indent > indent ? block(nx.indent) : null); continue; }
        if (/^-( |$)/.test(rest)) { L.indent = indent + off; L.text = rest; out.push(block(L.indent)); continue; }
        if (splitKey(rest) && rest[0] !== '"' && rest[0] !== "'" && rest[0] !== '[' && rest[0] !== '{' || (splitKey(rest) && /^["'][^"']*["']\s*:/.test(rest))) { L.indent = indent + off; L.text = rest; out.push(map(L.indent)); continue; }
        pos++; var iv = inlineValue(rest, L.n, indent); out.push(iv === undefined ? null : iv);
      }
      var bad = peek(); if (bad && bad.indent > indent && bad.indent !== indent) { if (bad.indent > indent) throw YamlError('bad indentation of a sequence entry', bad.n, bad.indent + 1); }
      return out;
    }
    function map(indent) {
      var out = {}, L, seen = {};
      while ((L = peek()) && L.indent === indent && !(L.text[0] === '-' && (L.text.length === 1 || L.text[1] === ' '))) {
        var kv = splitKey(L.text); if (!kv) throw YamlError('could not find expected \':\' — a mapping entry needs "key: value"', L.n, L.indent + 1);
        var anchorName = null, keyText = kv.key.trim(); var km = keyText.match(/^&(\S+)\s+(.*)$/); if (km) { anchorName = km[1]; keyText = km[2]; }
        var key = keyText === '<<' ? '<<' : String(scalar(keyText, L.n)); if (keyText !== '<<' && Object.prototype.hasOwnProperty.call(seen, key)) throw YamlError('duplicated mapping key "' + key + '"', L.n, L.indent + 1); seen[key] = 1; pos++;
        var val, rest = kv.rest;
        if (rest === '' || /^&\S+$/.test(rest)) {
          var anc = rest ? rest.slice(1) : null, nx = peek();
          if (nx && nx.indent > indent) val = block(nx.indent);
          else if (nx && nx.indent === indent && nx.text[0] === '-' && (nx.text.length === 1 || nx.text[1] === ' ')) val = seq(indent);
          else val = null;
          if (anc) anchors[anc] = val;
        } else { val = inlineValue(rest, L.n, indent); if (val === undefined) val = null; }
        if (anchorName) anchors[anchorName] = val;
        if (key === '<<') { [].concat(val).forEach(function (m) { if (m && typeof m === 'object') Object.keys(m).forEach(function (k) { if (!(k in out)) out[k] = m[k]; }); }); } else out[key] = val;
      }
      var stray = peek(); if (stray && stray.indent > indent && lines[pos - 1] && stray.indent !== indent) throw YamlError('bad indentation of a mapping entry', stray.n, stray.indent + 1);
      return out;
    }
    var first = peek(); if (!first) return null;
    var result = block(first.indent), rest2 = peek();
    if (rest2) throw YamlError('unexpected content — check the indentation of this line', rest2.n, rest2.indent + 1);
    return result;
  }

  function parse(text, opts) {
    var raw = String(text).replace(/\r\n?/g, '\n').split('\n'), docs = [], cur = [], curStart = 1;
    raw.forEach(function (l, i) { if (/^---(\s|$)/.test(l)) { if (cur.some(function (x) { return x.trim() && x.trim()[0] !== '#'; })) docs.push({ lines: cur, start: curStart }); cur = []; curStart = i + 2; var after = l.slice(3).trim(); if (after) cur.push(after); } else if (/^\.\.\.\s*$/.test(l)) { /* end marker */ } else cur.push(l); });
    if (cur.some(function (x) { return x.trim() && x.trim()[0] !== '#'; }) || !docs.length) docs.push({ lines: cur, start: curStart });
    var vals = docs.map(function (d) { return parseDoc(d.lines, d.start); });
    return opts && opts.all ? vals : vals[0];
  }

  /* ── dump ── */
  function needsQuote(s) { return s === '' || /^\s|\s$|^[-?:,[\]{}#&*!|>'"%@`]|: |\s#|^(true|false|null|yes|no|on|off|~)$/i.test(s) || /^[-+]?[\d.]+([eE][-+]?\d+)?$/.test(s) || /\n/.test(s); }
  function dumpScalar(v) { if (v === null || v === undefined) return 'null'; if (typeof v === 'string') return needsQuote(v) ? (/\n/.test(v) ? JSON.stringify(v) : "'" + v.replace(/'/g, "''") + "'") : v; return String(v); }
  function stringify(v, indent) {
    indent = indent || 0; var pad = ' '.repeat(indent), out = '';
    if (Array.isArray(v)) { if (!v.length) return pad + '[]\n'; v.forEach(function (x) { if (x && typeof x === 'object') { var inner = stringify(x, indent + 2); out += pad + '- ' + inner.slice(indent + 2); } else out += pad + '- ' + dumpScalar(x) + '\n'; }); return out; }
    if (v && typeof v === 'object') { var ks = Object.keys(v); if (!ks.length) return pad + '{}\n'; ks.forEach(function (k) { var x = v[k]; if (x && typeof x === 'object' && (Array.isArray(x) ? x.length : Object.keys(x).length)) out += pad + k + ':\n' + stringify(x, Array.isArray(x) ? indent + 2 : indent + 2); else out += pad + k + ': ' + (x && typeof x === 'object' ? (Array.isArray(x) ? '[]' : '{}') : dumpScalar(x)) + '\n'; }); return out; }
    return pad + dumpScalar(v) + '\n';
  }
  sim.yaml = { parse: parse, stringify: function (v) { return stringify(v, 0); }, YamlError: YamlError };
})(window);
