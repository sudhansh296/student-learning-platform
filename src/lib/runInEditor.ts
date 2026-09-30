// Decides how a lesson code example opens in the /playground code editor ("Run in Editor").
// Pure functions only (no React) so the same logic can be unit-tested outside the browser.
import { healJs, healReact, healTs } from './healSnippet';

export interface RunTarget {
  href: string;
  /** Playground language id (or html/css/js for the web tabs). */
  kind: string;
  label: string;
}

const MAX_CODE = 12000;

function b64(s: string): string {
  const bytes = encodeURIComponent(s).replace(/%([0-9A-F]{2})/g, (_, p1: string) => String.fromCharCode(parseInt(p1, 16)));
  return encodeURIComponent(btoa(bytes));
}

const lang = (id: string, code: string) => `/playground?lang=${id}&js=${b64(code)}`;

/* ───────────── sample HTML for CSS / DOM-manipulating snippets ───────────── */

const HTML_TAGS = new Set(['a', 'abbr', 'article', 'aside', 'b', 'blockquote', 'body', 'button', 'caption', 'code', 'dd', 'details', 'div', 'dl', 'dt', 'em', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'i', 'img', 'input', 'label', 'legend', 'li', 'main', 'mark', 'nav', 'ol', 'option', 'p', 'pre', 'section', 'select', 'small', 'span', 'strong', 'sub', 'sup', 'summary', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'tr', 'ul', 'video', 'audio', 'canvas', 'svg', 'time', 'q', 'cite', 'kbd', 'progress', 'meter']);
const VOID = new Set(['img', 'input', 'hr', 'br']);
const SKIP_TAGS = new Set(['html', 'body']);

interface Node { tag: string; classes: string[]; id?: string; kids: Node[]; pseudo?: string }

function parseCompound(c: string): Node | null {
  const cleaned = c.replace(/::?[\w-]+(\([^)]*\))?/g, '').replace(/\[[^\]]*\]/g, '');
  if (!cleaned || cleaned === '*') return null;
  const m = cleaned.match(/^([a-zA-Z][\w-]*)?((?:[.#][\w-]+)*)$/);
  if (!m) return null;
  const tag = (m[1] || '').toLowerCase();
  if (tag && !HTML_TAGS.has(tag)) return null;
  if (SKIP_TAGS.has(tag)) return null;
  const node: Node = { tag, classes: [], kids: [] };
  (m[2].match(/[.#][\w-]+/g) || []).forEach((t) => { if (t[0] === '#') node.id = t.slice(1); else node.classes.push(t.slice(1)); });
  if (!tag && !node.classes.length && !node.id) return null;
  return node;
}

function nodeKey(n: Node): string { return `${n.tag}|${n.id || ''}|${n.classes.join('.')}`; }

function guessTag(n: Node, parentTag: string): string {
  if (n.tag) return n.tag;
  if (parentTag === 'ul' || parentTag === 'ol') return 'li';
  const name = `${n.id || ''} ${n.classes.join(' ')}`.toLowerCase();
  if (/\b(btn|button|submit|cta)\b|btn|button/.test(name)) return 'button';
  if (/input|field|email|password|search|textbox/.test(name)) return 'input';
  if (/\b(title|heading|headline)\b/.test(name)) return 'h2';
  if (/\b(text|desc|description|message|msg|para|lead|subtitle|caption)\b/.test(name)) return 'p';
  if (/\b(list)\b/.test(name)) return 'ul';
  if (/\b(link|nav-link)\b/.test(name)) return 'a';
  if (/\b(img|image|avatar|photo|thumb)\b/.test(name)) return 'img';
  return 'div';
}

function renderNode(n: Node, parentTag: string, cssHint: string, depth: number): string {
  const tag = guessTag(n, parentTag);
  const attrs = `${n.id ? ` id="${n.id}"` : ''}${n.classes.length ? ` class="${n.classes.join(' ')}"` : ''}`;
  const label = n.id ? `#${n.id}` : n.classes.length ? `.${n.classes[0]}` : tag;
  if (tag === 'img') return `<img${attrs} src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='80'%3E%3Crect width='120' height='80' fill='%2394a3b8'/%3E%3Ctext x='60' y='46' font-size='14' text-anchor='middle' fill='white'%3E120x80%3C/text%3E%3C/svg%3E" alt="sample">`;
  if (tag === 'input') return `<input${attrs} type="text" placeholder="Type here…">`;
  if (VOID.has(tag)) return `<${tag}${attrs}>`;
  let inner = '';
  let kids = n.kids;
  const flexy = new RegExp(`[.#]${n.id || n.classes[0] || '@@'}[^{}]*\\{[^}]*display:\\s*(inline-)?(flex|grid)`, 'i').test(cssHint);
  if (!kids.length && (flexy || tag === 'ul' || tag === 'ol' || tag === 'nav')) {
    kids = [1, 2, 3].map((i) => ({ tag: tag === 'ul' || tag === 'ol' ? 'li' : tag === 'nav' ? 'a' : '', classes: tag === 'ul' || tag === 'ol' || tag === 'nav' ? [] : ['item'], kids: [], pseudo: String(i) }));
  }
  if (kids.length) inner = kids.map((k, i) => renderNode({ ...k, pseudo: k.pseudo || String(i + 1) }, tag, cssHint, depth + 1)).join('\n' + '  '.repeat(depth + 1));
  else if (tag === 'a') inner = `Sample link ${n.pseudo || ''}`.trim();
  else if (/^h[1-6]$/.test(tag)) inner = 'Sample heading';
  else if (tag === 'button') inner = 'Click me';
  else if (tag === 'p' || tag === 'span' || tag === 'li' || tag === 'label') inner = tag === 'li' ? `Item ${n.pseudo || 1}` : 'Sample text — the quick brown fox jumps over the lazy dog.';
  else inner = n.pseudo && !n.id && !n.classes.length ? n.pseudo : `Sample ${label}`;
  const href = tag === 'a' ? ' href="#"' : '';
  return kids.length ? `<${tag}${attrs}${href}>\n${'  '.repeat(depth + 1)}${inner}\n${'  '.repeat(depth)}</${tag}>` : `<${tag}${attrs}${href}>${inner}</${tag}>`;
}

function buildTree(selectors: string[]): Node[] {
  const roots: Node[] = [];
  const lookup = (list: Node[], node: Node): Node => {
    const existing = list.find((x) => nodeKey(x) === nodeKey(node));
    if (existing) return existing;
    list.push(node); return node;
  };
  selectors.forEach((sel) => {
    const parts = sel.trim().split(/\s*([>+~])\s*|\s+/).filter((p) => p && !/^[>+~]$/.test(p));
    let level = roots;
    parts.forEach((part) => {
      const node = parseCompound(part);
      if (!node) return;
      const real = lookup(level, node);
      level = real.kids;
    });
  });
  return roots;
}

function cssSelectors(css: string): string[] {
  const out: string[] = [];
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/@keyframes[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, '');
  const re = /([^{}@]+)\{[^{}]*\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(stripped))) m[1].split(',').forEach((s) => { const t = s.trim(); if (t && !/^\d|^from$|^to$/.test(t)) out.push(t); });
  return out;
}

const DEFAULT_PAGE = (extra: string) => `<h1>Heading 1</h1>
<h2>Heading 2</h2>
<p>This is a paragraph with a <a href="#">link</a>, <strong>bold text</strong> and <em>italic text</em>.</p>
<ul>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
</ul>
<button>Button</button>
${extra}`;

/** Sample markup that gives a CSS snippet something to style. */
export function sampleHtmlForCss(css: string): string {
  const tree = buildTree(cssSelectors(css));
  const generated = tree.map((n) => renderNode(n, '', css, 0)).join('\n');
  const usesBase = /(^|[\s,}])(h1|h2|p|ul|li|a|button)\b/.test(css);
  const hasOwnTags = tree.length > 0;
  return hasOwnTags ? (usesBase ? DEFAULT_PAGE(generated) : generated) : DEFAULT_PAGE('');
}

/** Sample markup for JavaScript that touches the DOM (ids/classes it looks up). */
export function sampleHtmlForJs(js: string): string {
  const ids = new Set<string>();
  const classes = new Set<string>();
  const tags = new Set<string>();
  let m: RegExpExecArray | null;
  const idRe = /getElementById\(\s*['"`]([\w-]+)['"`]\s*\)/g;
  while ((m = idRe.exec(js))) ids.add(m[1]);
  const qsRe = /querySelector(?:All)?\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
  while ((m = qsRe.exec(js))) m[1].split(',').forEach((sel) => { (sel.match(/#[\w-]+/g) || []).forEach((t) => ids.add(t.slice(1))); (sel.match(/\.[\w-]+/g) || []).forEach((t) => classes.add(t.slice(1))); const tg = sel.trim().match(/^[a-z][a-z0-9]*/i); if (tg && HTML_TAGS.has(tg[0].toLowerCase())) tags.add(tg[0].toLowerCase()); });
  const clsRe = /getElementsByClassName\(\s*['"`]([\w-]+)['"`]\s*\)/g;
  while ((m = clsRe.exec(js))) classes.add(m[1]);
  const tagRe = /getElementsByTagName\(\s*['"`]([\w-]+)['"`]\s*\)/g;
  while ((m = tagRe.exec(js))) if (HTML_TAGS.has(m[1].toLowerCase())) tags.add(m[1].toLowerCase());
  const nodes: Node[] = [];
  // ids whose .value / .checked is read are form controls
  const isField = (id: string) => new RegExp(`(?:getElementById\\(\\s*['"]${id}['"]\\s*\\)|querySelector\\(\\s*['"]#${id}['"]\\s*\\))\\s*\\??\\.(?:value|checked)\\b`).test(js);
  ids.forEach((id) => nodes.push({ tag: isField(id) ? 'input' : '', classes: [], id, kids: [] }));
  classes.forEach((c) => nodes.push({ tag: '', classes: [c], kids: [] }));
  tags.forEach((t) => { if (!nodes.some((n) => n.tag === t)) nodes.push({ tag: t, classes: [], kids: [] }); });
  const attrEls: string[] = [];
  const attrRe = /querySelector(?:All)?\(\s*['"`]([^'"`]*\[[^'"`]+)['"`]\s*\)/g;
  while ((m = attrRe.exec(js))) {
    m[1].split(',').forEach((sel) => {
      const am = sel.match(/^\s*([a-z][a-z0-9]*)?\[([\w-]+)(?:=["']?([^"'\]]*)["']?)?\]/i);
      if (!am) return;
      const tag = am[1] && HTML_TAGS.has(am[1].toLowerCase()) ? am[1].toLowerCase() : 'div';
      const attr = `${am[2]}="${am[3] ?? '1'}"`;
      attrEls.push(tag === 'input' ? `<input ${attr} placeholder="Type here…">` : VOID.has(tag) ? `<${tag} ${attr}>` : `<${tag} ${attr}>Sample [${am[2]}]</${tag}>`);
    });
  }
  if (!nodes.length && !attrEls.length) return '';
  return [...nodes.map((n) => renderNode(n, '', '', 0)), ...attrEls].join('\n');
}

/* ───────────── mapping ───────────── */

const SERVER_SNIPPET = /require\(\s*['"](?:express|https?|cors|helmet|jsonwebtoken|bcrypt|bcryptjs|supertest)['"]|from\s+['"](?:express|https?|cors|helmet|jsonwebtoken|bcrypt|bcryptjs|supertest)['"]|\b(?:app|router)\.(?:get|post|put|patch|delete|use|listen)\s*\(|\bcreateServer\s*\(/;
const NEXT_FILE_COMMENT = /^[ \t]*\/\/[ \t]*((?:src\/)?(?:app\/|pages\/|middleware\.)[\w[\]().\-/]*\.(?:js|jsx|ts|tsx))[ \t]*$/gm;

/**
 * Lessons label the files of a multi-file example with a "// routes/users.js" (or "// app.js - what it does") comment —
 * turn those into the editor's "// FILE:" markers. A label is only a comment line directly followed by code.
 */
const FILE_LABEL = /^[ \t]*\/\/[ \t]*((?:[\w.@()[\]-]+\/)*(?:[\w.-]+\.(?:js|mjs|cjs|jsx|ts|tsx|json|env|html|ejs|css|txt|md|yml|yaml|sh)|\.env(?:\.[\w-]+)*|Dockerfile[\w.-]*))[ \t]*(?:\([^)]*\)|[-–—:][ \t].*)?$/;
function nodeFiles(src: string): string {
  const lines = src.split('\n');
  let changed = false;
  const out = lines.map((line, i) => {
    const m = FILE_LABEL.exec(line);
    if (!m) return line;
    let j = i + 1;
    while (j < lines.length && !lines[j].trim()) j++;
    if (j >= lines.length || /^\s*\/\//.test(lines[j])) return line;
    changed = true;
    return `// FILE: ${m[1]}`;
  });
  return changed ? out.join('\n') : src;
}

function web(html: string, css: string, js: string, kind: string, label: string): RunTarget {
  const p: string[] = [];
  // An empty tab would fall back to the editor's demo code, so say explicitly that this example has none.
  p.push(`html=${b64(html || '<!-- This example has no HTML — its output appears in the Console panel -->')}`);
  p.push(`css=${b64(css || '/* This example has no CSS */')}`);
  p.push(`js=${b64(js || '// This example has no JavaScript')}`);
  p.push(`tab=${kind}`); // open the tab that holds this example's own code (html / css / js)
  return { href: `/playground?${p.join('&')}`, kind, label };
}

/** Browser JavaScript. Snippets that only talk to a made-up API (no DOM) run in the Node simulator, which answers those requests. */
function browserJs(src: string): RunTarget | null {
  const usesFetch = /\bfetch\s*\(\s*[`'"]\/|\bfetch\s*\(\s*[`'"]https?:\/\/(?:api\.)?(?:example|myapp|yourapp)\./.test(src);
  const usesDom = /\bdocument\b|\bwindow\b|localStorage|sessionStorage|addEventListener|\bnavigator\b|\balert\(/.test(src);
  if (usesFetch && !usesDom) return { href: lang('express', src), kind: 'express', label: 'Node / Express' };
  // JSX inside a plain-JS lesson: the React tab knows how to run it
  if ((/<[A-Z][A-Za-z0-9.]*[\s/>]|return\s*\(\s*<[A-Za-z]|\bReact\.(?:lazy|memo|createElement|useState|useEffect)\b/.test(src)) && !/^\s*<!--/.test(src)) return { href: lang('react', healReact(src)), kind: 'react', label: 'React' };
  const healed = healJs(src);
  return healed === null ? null : web(sampleHtmlForJs(src), '', healed, 'js', 'JS');
}

const JS_LANGS = new Set(['javascript', 'js', 'mjs', 'cjs', 'typescript', 'ts', 'jsx', 'tsx']);

/** Comment-only blocks and pure data literals (JSON illustrations) have nothing to run. */
function looksLikeCode(src: string, l: string): boolean {
  let body = src;
  if (JS_LANGS.has(l) || l === 'css') body = body.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  else if (l === 'sql') body = body.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*--.*$/gm, '');
  else if (['bash', 'sh', 'shell', 'yaml', 'yml', 'dockerfile', 'python'].includes(l)) body = body.replace(/^\s*#.*$/gm, '');
  body = body.trim();
  if (!body) return false;
  if (/^[ \t]*(?:[├└│]|[|`]--)/m.test(body) && /[├└]──/.test(body)) return false; // a folder-tree diagram
  if (JS_LANGS.has(l) && /^[{[]/.test(body)) {
    const noStrings = body.replace(/'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`/g, '""');
    if (!/[(]|=>|\bfunction\b|;\s*\S/.test(noStrings)) {
      try { new Function(`return (${body})`); return false; } catch { /* a block statement, not a literal */ }
    }
  }
  return true;
}

const CMD_LINE = (name: string) => new RegExp(`^\\s*(?:\\$\\s*)?(?:sudo\\s+)?${name}\\b`, 'm');

/**
 * @param tech     lesson technology id (html, css, js, ts, react, sql, postgresql, sqlite, git, docker, redis, mongodb, nodejs, express, nextjs, restapi)
 * @param code     the example's source
 * @param language the example's declared language (bash, sql, javascript, ...)
 */
export function runInEditor(tech: string, code: string, language: string): RunTarget | null {
  const src = code.replace(/\r\n/g, '\n');
  if (!src.trim() || src.length > MAX_CODE) return null;
  const l = (language || '').toLowerCase();
  const t = tech.toLowerCase();
  if (!looksLikeCode(src, l)) return null;

  if (t === 'html') {
    if (l === 'html') return web(src, '', '', 'html', 'HTML');
    if (l === 'css') return web(sampleHtmlForCss(src), src, '', 'css', 'CSS');
    if (l === 'javascript' || l === 'js') return browserJs(src);
    return null;
  }
  if (t === 'css') {
    if (l === 'css') return web(sampleHtmlForCss(src), src, '', 'css', 'CSS');
    if (l === 'html') return web(src, '', '', 'html', 'HTML');
    return null;
  }
  if (t === 'js') {
    if (l === 'javascript' || l === 'js') return browserJs(src);
    return null;
  }
  if (t === 'ts') {
    if (l === 'typescript' || l === 'ts') {
      const jsx = /<[A-Z]\w*[\s/>]|return\s*\(\s*<|<\/\w+>/.test(src);
      // real JSX (closing or self-closing tags): the React runner strips the types and provides the real hooks
      if (/<\/[A-Za-z][\w.]*>|<[A-Za-z][\w.]*(?:\s[^<>]*)?\/>/.test(src)) return { href: lang('react', healReact(src)), kind: 'react', label: 'React' };
      return { href: lang('typescript', jsx ? healReact(healTs(src)) : healTs(src)), kind: 'typescript', label: 'TypeScript' };
    }
    if (l === 'json') return { href: lang('json', src), kind: 'json', label: 'JSON' };
    return null;
  }
  if (t === 'react') {
    if (/\b(?:describe|test|it)\s*\(/.test(src) && /\bexpect\s*\(/.test(src)) return null; // a unit test, not something to render
    if (['jsx', 'tsx', 'javascript', 'js', 'typescript'].includes(l)) return { href: lang('react', healReact(src)), kind: 'react', label: 'React' };
    return null;
  }
  if (t === 'nextjs') {
    if (['typescript', 'javascript', 'tsx', 'jsx', 'ts', 'js'].includes(l)) return { href: lang('nextjs', nodeFiles(src.replace(NEXT_FILE_COMMENT, '// FILE: $1'))), kind: 'nextjs', label: 'Next.js' };
    return null;
  }
  if (t === 'nodejs' || t === 'express' || t === 'restapi') {
    if (['javascript', 'js', 'mjs', 'cjs', 'typescript', 'ts'].includes(l)) return { href: lang('express', nodeFiles(src)), kind: 'express', label: 'Node / Express' };
    if (l === 'http' && t === 'restapi') return { href: lang('http', src), kind: 'http', label: 'HTTP' };
    if (l === 'json') return { href: lang('json', src), kind: 'json', label: 'JSON' };
    if (l === 'html' && t === 'express') return web(src, '', '', 'html', 'HTML');
    return null;
  }
  if (t === 'sql') {
    if (l === 'sql') return { href: lang('postgres', src), kind: 'postgres', label: 'PostgreSQL' };
    return null;
  }
  if (t === 'postgresql') {
    if (l === 'sql') return { href: lang('postgres', src), kind: 'postgres', label: 'PostgreSQL' };
    if (l === 'javascript') return { href: lang('express', nodeFiles(src)), kind: 'express', label: 'Node / Express' };
    if (l === 'bash' && /^\s*(\\|select|create|insert|update|delete|drop|alter)\b/im.test(src)) return { href: lang('postgres', src), kind: 'postgres', label: 'PostgreSQL' };
    return null;
  }
  if (t === 'sqlite') {
    if (l === 'javascript') return { href: lang('express', nodeFiles(src)), kind: 'express', label: 'Node / Express' };
    if (l === 'sql') return { href: lang('postgres', src), kind: 'postgres', label: 'PostgreSQL' };
    return null;
  }
  if (t === 'git') {
    if ((l === 'bash' || l === 'sh' || l === 'shell') && CMD_LINE('git').test(src)) return { href: lang('git', src), kind: 'git', label: 'Git' };
    return null;
  }
  if (t === 'docker') {
    if (l === 'dockerfile' || (['bash', 'sh', 'shell'].includes(l) && /^(FROM|COPY|RUN|WORKDIR|CMD)\s/m.test(src) && !/^\s*(\$\s*)?docker\b/m.test(src))) return { href: lang('docker', src), kind: 'docker', label: 'Docker' };
    const DOCKER_CMD = /^[ \t]*(?:\$[ \t]*)?(?:sudo[ \t]+)?docker(?:-compose)?[ \t]+[a-z-]/m;
    if (l === 'yaml' || l === 'yml') {
      // Compose files in lessons are often followed by the commands that use them — split into a file + a script.
      const m = DOCKER_CMD.exec(src);
      if (!m) return { href: lang('yaml', src), kind: 'yaml', label: 'YAML' };
      const yamlLines = src.slice(0, m.index).split('\n');
      while (yamlLines.length && (!yamlLines[yamlLines.length - 1].trim() || /^\s*#/.test(yamlLines[yamlLines.length - 1]))) yamlLines.pop();
      const yamlPart = yamlLines.join('\n');
      const script = src.slice(yamlPart.length).replace(/^\n+/, '');
      return { href: lang('docker', `${script}\n// FILE: docker-compose.yml\n${yamlPart}\n`), kind: 'docker', label: 'Docker' };
    }
    if ((l === 'bash' || l === 'sh' || l === 'shell') && DOCKER_CMD.test(src)) return { href: lang('docker', src), kind: 'docker', label: 'Docker' };
    return null;
  }
  if (t === 'redis') {
    if ((l === 'bash' || l === 'sh') && /^\s*(redis-cli\s+)?[A-Z]{2,}\b/m.test(src)) return { href: lang('redis', src), kind: 'redis', label: 'Redis' };
    if (l === 'javascript' || l === 'typescript') return { href: lang('express', nodeFiles(src)), kind: 'express', label: 'Node / Express' };
    return null;
  }
  if (t === 'mongodb') {
    const nodeCode = /\brequire\(|^\s*import\s.+from\s|\bmongoose\.|\bMongoClient\b/m.test(src);
    if (l === 'javascript' && !nodeCode && /\bdb\.|^\s*(use|show|mongosh)\b/m.test(src)) return { href: lang('mongo', src), kind: 'mongo', label: 'MongoDB' };
    if (l === 'javascript') return { href: lang('express', nodeFiles(src)), kind: 'express', label: 'Node / Express' };
    return null;
  }
  return null;
}

/** Whether a Node-style snippet is really a server (kept for callers that want to label it). */
export const isServerSnippet = (code: string) => SERVER_SNIPPET.test(code);

/**
 * Lesson data sometimes tags a block with the wrong language (TypeScript labelled "javascript", SQL labelled "bash").
 * This returns the label to show; it never changes the lesson data itself.
 */
export function detectLanguage(code: string, language: string): string {
  const l = (language || '').toLowerCase();
  if (l === 'javascript' || l === 'js') {
    const tsSignature = /\bfunction\s*\*?\s*\w*\s*\([^)]*\b\w+\??\s*:\s*(?:string|number|boolean|any|unknown|void|[A-Z]\w*)\b/.test(code)
      || /\)\s*:\s*(?:Promise<[^>]*>|string|number|boolean|void|[A-Z]\w*(?:<[^>]*>)?)\s*(?:\{|=>)/.test(code)
      || /^\s*(?:export\s+)?interface\s+\w+/m.test(code)
      || /^\s*(?:export\s+)?type\s+\w+(?:<[^>]*>)?\s*=/m.test(code)
      || /\bas\s+const\b/.test(code);
    return tsSignature ? 'typescript' : language;
  }
  if (l === 'html') {
    // a stylesheet tagged as html: no tags, just rules
    const noComments = code.replace(/\/\*[\s\S]*?\*\//g, '').trim();
    if (!/<[A-Za-z!]/.test(noComments) && /^[^{}]+\{[^{}]*:[^{}]*\}/.test(noComments)) return 'css';
  }
  if (l === 'bash' || l === 'sh' || l === 'shell') {
    const sqlLines = (code.match(/^\s*(?:CREATE\s+TABLE|INSERT\s+INTO|SELECT\s|UPDATE\s+\w+\s+SET|DELETE\s+FROM|ALTER\s+TABLE|DROP\s+TABLE)\b/gim) || []).length;
    const shellLines = (code.match(/^\s*(?:\$\s*)?(?:npm|npx|git|docker|curl|cd|mkdir|sudo|brew|apt|pip|node)\s/gm) || []).length;
    return sqlLines >= 2 && shellLines === 0 ? 'sql' : language;
  }
  return language;
}
