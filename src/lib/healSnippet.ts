// Lesson snippets are fragments: they use variables defined "somewhere above", hooks without an import, two alternative
// versions of the same component in one block, and so on. These helpers add the little bit of glue (sample values, a render
// call) that lets such a fragment run in the code editor. Pure and deterministic — the result must be identical on the server
// and in the browser because it ends up in an href.

const KEYWORDS = new Set('break case catch class const continue debugger default delete do else enum export extends false finally for function if import in instanceof let new null return super switch this throw true try typeof var void while with yield await async of static get set undefined NaN Infinity arguments as from'.split(' '));

const GLOBALS = new Set(`globalThis window document console Math JSON Object Array String Number Boolean Symbol BigInt Date RegExp Error TypeError RangeError SyntaxError ReferenceError EvalError URIError AggregateError Promise Map Set WeakMap WeakSet WeakRef FinalizationRegistry Proxy Reflect Intl ArrayBuffer SharedArrayBuffer DataView Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array BigInt64Array BigUint64Array Atomics parseInt parseFloat isNaN isFinite encodeURI encodeURIComponent decodeURI decodeURIComponent escape unescape eval setTimeout setInterval clearTimeout clearInterval setImmediate queueMicrotask structuredClone requestAnimationFrame cancelAnimationFrame requestIdleCallback fetch Request Response Headers URL URLSearchParams FormData Blob File FileReader AbortController AbortSignal Event CustomEvent EventTarget XMLHttpRequest WebSocket localStorage sessionStorage navigator location history screen alert confirm prompt performance crypto TextEncoder TextDecoder Worker MutationObserver IntersectionObserver ResizeObserver PerformanceObserver Notification indexedDB atob btoa getComputedStyle matchMedia open close print Image Audio HTMLElement Element Node NodeList DocumentFragment Document Text Comment SVGElement customElements DOMParser XMLSerializer ReadableStream WritableStream TransformStream CompressionStream BroadcastChannel MessageChannel postMessage addEventListener removeEventListener dispatchEvent innerWidth innerHeight scrollTo scrollX scrollY scroll require module exports process Buffer __dirname __filename React ReactDOM Babel StorageEvent DOMException Selection Range HTMLCollection NodeIterator DOMRect CSS CSSStyleSheet Option MouseEvent KeyboardEvent`.split(/\s+/));

const REACT_NAMES = ['useState', 'useEffect', 'useRef', 'useContext', 'createContext', 'useReducer', 'useMemo', 'useCallback', 'memo', 'forwardRef', 'useLayoutEffect', 'Fragment', 'lazy', 'Suspense', 'useId', 'useTransition', 'useDeferredValue', 'useImperativeHandle', 'startTransition', 'createRef', 'Children', 'cloneElement', 'StrictMode', 'useSyncExternalStore', 'useInsertionEffect', 'useDebugValue', 'createElement', 'isValidElement', 'Component', 'PureComponent'];

const isBrowserGlobal = (n: string) => GLOBALS.has(n) || /^(HTML|SVG)\w*Element$/.test(n) || /Event$/.test(n) || /^(Intl|Web|Audio|Media|Speech|Notification|Payment)\w*$/.test(n);

/** Source with comments, strings, template literals and regex literals blanked out (same length is not preserved). */
export function stripNonCode(src: string): string {
  let out = '';
  let i = 0;
  let prev = '';
  const n = src.length;
  while (i < n) {
    const c = src[i];
    const d = src[i + 1];
    if (c === '/' && d === '/') { while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '/' && d === '*') { i += 2; while (i < n && !(src[i] === '*' && src[i + 1] === '/')) i++; i += 2; continue; }
    if (c === '"' || c === "'") {
      const q = c; i++;
      while (i < n && src[i] !== q && src[i] !== '\n') { if (src[i] === '\\') i++; i++; }
      i++; out += '""'; prev = '"'; continue;
    }
    if (c === '`') {
      i++;
      while (i < n && src[i] !== '`') { if (src[i] === '\\') i++; i++; }
      i++; out += '""'; prev = '"'; continue;
    }
    if (c === '/' && /[(,=:[!&|?{};]|^$/.test(prev) ) {
      // regex literal
      let j = i + 1; let inClass = false;
      while (j < n && src[j] !== '\n') { if (src[j] === '\\') { j += 2; continue; } if (src[j] === '[') inClass = true; else if (src[j] === ']') inClass = false; else if (src[j] === '/' && !inClass) break; j++; }
      if (j < n && src[j] === '/') { i = j + 1; while (i < n && /[a-z]/i.test(src[i])) i++; out += '0'; prev = '0'; continue; }
    }
    out += c;
    if (!/\s/.test(c)) prev = c;
    i++;
  }
  return out;
}

/** Names bound by `const/let/var a = 1, { b, c = 2 } = x, [d, ...e] = y` (patterns are read whole, so defaults count as declared too). */
function declaratorNames(code: string, add: (s: string) => void): void {
  const re = /\b(?:const|let|var)\s+/g;
  let m: RegExpExecArray | null;
  const n = code.length;
  while ((m = re.exec(code))) {
    let i = m.index + m[0].length;
    for (;;) {
      while (i < n && /\s/.test(code[i])) i++;
      const start = i;
      if (code[i] === '{' || code[i] === '[') {
        let d = 0;
        for (; i < n; i++) {
          if ('{['.includes(code[i])) d++;
          else if ('}]'.includes(code[i])) { d--; if (d === 0) { i++; break; } }
        }
      } else {
        while (i < n && /[\w$]/.test(code[i])) i++;
      }
      add(code.slice(start, i));
      let d = 0;
      for (; i < n; i++) {
        const ch = code[i];
        if ('([{'.includes(ch)) d++;
        else if (')]}'.includes(ch)) { if (d === 0) break; d--; }
        else if (d === 0 && (ch === ',' || ch === ';' || ch === '\n')) break;
      }
      if (i < n && code[i] === ',') { i++; continue; }
      break;
    }
  }
}

/** Every name the snippet declares somewhere (deliberately over-inclusive: declaring a stub for a real name would be an error). */
function declaredNames(code: string): Set<string> {
  const names = new Set<string>();
  const add = (chunk: string) => { (chunk.match(/[A-Za-z_$][\w$]*/g) || []).forEach((x) => names.add(x)); };
  let m: RegExpExecArray | null;
  declaratorNames(code, add);
  const fn = /\bfunction\s*\*?\s*([A-Za-z_$][\w$]*)?\s*\(([^)]*)\)/g;
  while ((m = fn.exec(code))) { if (m[1]) names.add(m[1]); add(m[2].replace(/=[^,)]*/g, '')); }
  const cls = /\bclass\s+([A-Za-z_$][\w$]*)/g;
  while ((m = cls.exec(code))) names.add(m[1]);
  const arrow = /\(([^()]*)\)\s*=>/g;
  while ((m = arrow.exec(code))) add(m[1].replace(/=[^,)]*/g, ''));
  const arrow1 = /([A-Za-z_$][\w$]*)\s*=>/g;
  while ((m = arrow1.exec(code))) names.add(m[1]);
  const catcher = /\bcatch\s*\(\s*([A-Za-z_$][\w$]*)/g;
  while ((m = catcher.exec(code))) names.add(m[1]);
  const forIn = /\bfor\s*\(\s*(?:const|let|var)?\s*([A-Za-z_$][\w$]*)\s+(?:of|in)\b/g;
  while ((m = forIn.exec(code))) names.add(m[1]);
  // destructured parameters: ({ a, b }) / ([a, b])
  const dparams = /[({,]\s*([{[][^{}[\]]*[}\]])\s*[,)=]/g;
  while ((m = dparams.exec(code))) add(m[1]);
  return names;
}

interface FreeName { name: string; call: boolean; member: boolean; index: boolean; construct: boolean }

/** Identifiers the snippet reads but never declares and the runtime does not provide. */
export function freeNames(src: string): FreeName[] {
  const code = stripNonCode(src);
  const declared = declaredNames(code);
  const found = new Map<string, FreeName>();
  const re = /([A-Za-z_$][\w$]*)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(code))) {
    const name = m[1];
    const start = m.index;
    let p = start - 1;
    while (p >= 0 && /[ \t]/.test(code[p])) p--;
    const before = p >= 0 ? code[p] : '';
    if (before === '.') continue;
    if (KEYWORDS.has(name) || declared.has(name) || isBrowserGlobal(name)) continue;
    let q = start + name.length;
    while (q < code.length && /[ \t]/.test(code[q])) q++;
    const after = code[q] || '';
    // object key (`{ name: value }`) / label
    if (after === ':' && (before === '{' || before === ',' || before === '\n' || before === '')) continue;
    if (/\bnew\s+$/.test(code.slice(Math.max(0, start - 6), start)) && false) continue;
    // method definition: `name(...) {` at member position
    if (after === '(') {
      let depth = 0; let k = q;
      for (; k < code.length; k++) { if (code[k] === '(') depth++; else if (code[k] === ')') { depth--; if (depth === 0) break; } }
      let r = k + 1; while (r < code.length && /\s/.test(code[r])) r++;
      if (code[r] === '{' && (before === '{' || before === '}' || before === ',' || before === ';' || before === '' || /\b(?:static|async|get|set)\s*$/.test(code.slice(Math.max(0, start - 8), start)))) continue;
    }
    const cur = found.get(name) || { name, call: false, member: false, index: false, construct: false };
    if (after === '(') cur.call = true;
    if (after === '.' || (after === '?' && code[q + 1] === '.')) cur.member = true;
    if (after === '[') cur.index = true;
    if (/\bnew\s*$/.test(code.slice(Math.max(0, start - 5), start))) cur.construct = true;
    found.set(name, cur);
  }
  return [...found.values()];
}

const SAMPLE_VALUE: [RegExp, string][] = [
  [/^(arr|array|list|items|numbers|nums|values|numbersArray|data|elements|words|names|tags|scores|prices|ids|matrix|stack|queue)$/i, '[3, 1, 2]'],
  [/^(users|people|products|posts|todos|orders|employees|students)$/i, "[{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]"],
  [/^(str|string|text|s|message|msg|title|sentence|word|content|html|url|path|email|password|token|key|label|greeting)$/i, "'Hello, World'"],
  [/^(input|textarea|field)$/i, "document.createElement('input')"],
  [/^(form)$/i, "document.createElement('form')"],
  [/^(obj|object|user|person|config|options|opts|settings|target|source|proto|descriptor|descriptors|props|state|payload|body|response|result|res|req|request|event|e|evt|ctx|context|params|query|headers|order|product|post|item|student|employee|car|animal|dog|cat|account|profile|store|cache|map|set|weakMap|weakSet)$/i, "{ id: 1, name: 'Alice', age: 30 }"],
  [/^(el|elem|element|node|btn|button|form|container|box|parent|child|wrapper|modal|menu|list|ul|div|section|header|footer|nav|link|img|image|canvas|app|root|target)$/i, 'document.body'],
  [/^(n|i|j|k|x|y|z|num|count|index|start|end|value|val|total|amount|price|age|size|length|limit|offset|delay|ms|id|userId|min|max|a|b|c)$/i, '42'],
  [/^(is\w+|has\w+|enabled|disabled|visible|active|flag|ok|success|done|loading)$/i, 'true'],
  [/^[A-Z][A-Z0-9_]+$/, "'value'"],
];

function stubFor(f: FreeName): string {
  if (f.construct) return `class ${f.name} {}`;
  if (f.call && !f.member && !f.index) return `function ${f.name}() {}`;
  for (const [re, v] of SAMPLE_VALUE) if (re.test(f.name)) return `var ${f.name} = ${v};`;
  if (f.member || f.index) return `var ${f.name} = new Proxy({}, { get: (_, k) => (k === 'then' || typeof k === 'symbol' ? undefined : () => {}) });`;
  return `var ${f.name};`;
}

/** The same const / function / class written twice (two alternative versions) — rename the later declarations so both compile. */
export function renameDuplicates(code: string): string {
  const seen = new Map<string, number>();
  // TypeScript overloads: `function f(a: string): number;` lines declare the same name on purpose
  const overloads = new Set<string>();
  for (const m of code.matchAll(/^(?:export\s+)?function\s+([A-Za-z_$][\w$]*)\s*(?:<[^>\n]*>)?\([^)\n]*\)\s*:[^{;\n]*;[ \t]*$/gm)) overloads.add(m[1]);
  return code.replace(/^(export\s+(?:default\s+)?)?(async\s+function|function|const|let|var|class)(\s+)([A-Za-z_$][\w$]*)/gm, (all, exp: string | undefined, kw: string, sp: string, name: string) => {
    if (overloads.has(name) && /function/.test(kw)) return all;
    const n = (seen.get(name) || 0) + 1;
    seen.set(name, n);
    if (n === 1) return all;
    if (kw === 'var' && !/^(export)/.test(exp || '')) return all; // var may repeat
    return `${exp && /default/.test(exp) ? '' : exp || ''}${kw}${sp}${name}_v${n}`;
  });
}

/** Lessons call fetch('/api/...') on servers that do not exist — answer those requests with a small in-page mock. */
const MOCK_FETCH = `// (mock API added so fetch('/api/...') has something to answer it)
const __db = { users: [{ id: 1, name: 'Alice', email: 'alice@example.com' }, { id: 2, name: 'Bob', email: 'bob@example.com' }], posts: [{ id: 1, userId: 1, title: 'Hello world', body: 'First post' }, { id: 2, userId: 2, title: 'Second post', body: 'More text' }], todos: [{ id: 1, title: 'Learn fetch', completed: true }, { id: 2, title: 'Build an app', completed: false }] };
const __realFetch = window.fetch.bind(window);
window.fetch = (url, opts = {}) => {
  const u = String(url);
  if (!/^\\/|^https?:\\/\\/(?:[\\w-]+\\.)*(?:example|myapp|yourapp|jsonplaceholder)\\./.test(u)) return __realFetch(url, opts);
  const parts = u.replace(/^https?:\\/\\/[^/]+/, '').split('?')[0].split('/').filter((p) => p && p !== 'api' && !/^v\\d+$/.test(p));
  const rows = __db[parts[0]] || [{ id: 1, name: 'Sample' }];
  const body = opts.body ? JSON.parse(opts.body) : null;
  const one = parts[1] ? rows.find((r) => String(r.id) === parts[1]) : null;
  const data = opts.method && opts.method !== 'GET' ? { id: 3, ...body } : parts[1] ? one : rows;
  return new Promise((ok) => setTimeout(() => ok(new Response(data ? JSON.stringify(data) : '{"error":"Not found"}', { status: data ? (opts.method === 'POST' ? 201 : 200) : 404, headers: { 'Content-Type': 'application/json' } })), 300));
};
`;
const needsMockFetch = (code: string) => /\bfetch\s*\(/.test(code) && /\bfetch\s*\(\s*[`'"]\/|jsonplaceholder\.typicode\.com|(?:example|myapp|yourapp)\.(?:com|org|net)/.test(code);

/* ───────────── plain browser JavaScript ───────────── */

const AsyncFunction = (() => { try { return Object.getPrototypeOf(async function () { /* probe */ }).constructor as FunctionConstructor; } catch { return Function; } })();
const compiles = (code: string) => { try { new AsyncFunction(code); return true; } catch { return false; } };

/** A block of statements separated from the rest by blank lines (only at bracket depth 0). */
function chunksOf(code: string): string[] {
  const lines = code.split('\n');
  const chunks: string[] = [];
  let cur: string[] = [];
  let depth = 0;
  lines.forEach((line) => {
    cur.push(line);
    const stripped = stripNonCode(line);
    for (const ch of stripped) { if ('{[('.includes(ch)) depth++; else if ('}])'.includes(ch)) depth--; }
    if (!line.trim() && depth <= 0) { chunks.push(cur.join('\n')); cur = []; depth = 0; }
  });
  if (cur.length) chunks.push(cur.join('\n'));
  return chunks;
}

/** Comment out chunks that are not valid JavaScript (an illustration, a shell line, a placeholder like `...`). */
function skipBrokenChunks(code: string): string {
  if (compiles(code)) return code;
  const out = chunksOf(code).map((ch) => (!ch.trim() || compiles(ch) ? ch : ch.split('\n').map((l) => (l.trim() ? `// ${l}` : l)).join('\n')));
  const joined = out.join('\n');
  return compiles(joined) ? joined : code;
}

/** import/export only exist in modules — the editor runs classic scripts. */
function dropModuleSyntax(code: string): string {
  return code
    .replace(/^[ \t]*import\s+[\s\S]*?\sfrom\s+['"][^'"]+['"];?[ \t]*$/gm, (m) => m.split('\n').map((l) => `// ${l}`).join('\n'))
    .replace(/^[ \t]*import\s+['"][^'"]+['"];?[ \t]*$/gm, (m) => `// ${m}`)
    .replace(/^([ \t]*)export\s+default\s+(?=function|class|async)/gm, '$1')
    .replace(/^([ \t]*)export\s+default\s+/gm, '$1const __default = ')
    .replace(/^([ \t]*)export\s+(?=(?:async\s+)?(?:function|class|const|let|var)\b)/gm, '$1')
    .replace(/^[ \t]*export\s*\{[^}]*\}(?:\s*from\s*['"][^'"]+['"])?;?[ \t]*$/gm, (m) => `// ${m}`);
}

/** `{ ... }` / `[ ... ]` bodies are placeholders in lessons. */
const dropPlaceholders = (c: string) => c.replace(/\{\s*\.\.\.\s*\}/g, '{}').replace(/\[\s*\.\.\.\s*\]/g, '[]');

/** Returns null when the block is a cheat sheet of placeholders rather than something that can run. */
/** Lessons list statements without semicolons; a line starting with ( [ or ` would then continue the previous line. */
function guardAsi(code: string): string {
  if (!compiles(code)) return code;
  const lines = code.split('\n');
  let prev = '';
  const out = lines.map((line, i) => {
    const t = line.trim();
    let res = line;
    if (/^[([`]/.test(t) && /[\w)\]'"`]$/.test(prev) && !/^(?:return|else|do|case|default|import|export|function|async|class|new|typeof|void|throw)\b/.test(prev.split(/\s+/).pop() || '') && bracketDepthBefore(lines, i) === 0) res = line.replace(/^(\s*)/, '$1;');
    const code2 = stripNonCode(line).trim();
    if (code2) prev = code2.replace(/\/\/.*$/, '').trim();
    return res;
  });
  const joined = out.join('\n');
  return compiles(joined) ? joined : code;
}

export function healJs(src: string): string | null {
  let code = dropPlaceholders(src).replace(/^([ \t]*)<!--(.*?)-->[ \t]*$/gm, '$1//$2'); // an HTML comment used as a label
  if (/^\s*(?:import|export)\b/m.test(code)) code = dropModuleSyntax(code);
  if (!compiles(code)) code = renameDuplicates(code);
  if (!compiles(code)) { const asVar = code.replace(/^(const|let)\s/gm, 'var '); if (compiles(asVar)) code = asVar; } // destructuring alternatives that repeat a name
  code = skipBrokenChunks(code);
  if (!compiles(code)) return code;
  code = guardAsi(code);
  const mock = needsMockFetch(code) ? MOCK_FETCH + '\n' : '';
  const free = freeNames(code);
  if (free.length > 12) return null; // a cheat sheet of placeholders, not a runnable example
  if (!free.length) return mock + code;
  const lines = free.map(stubFor);
  return `${mock}// (sample values added so this snippet can run: ${free.map((f) => f.name).join(', ')})\n${lines.join('\n')}\n\n${code}`;
}

/* ───────────── React ───────────── */

interface Comp { name: string; props: string[]; arrow: boolean }

function components(code: string): Comp[] {
  const out: Comp[] = [];
  let m: RegExpExecArray | null;
  const fn = /(?:^|\n)[ \t]*(?:export\s+(?:default\s+)?)?function\s+([A-Z]\w*)\s*\(\s*(\{[^}]*\}|\w+)?/g;
  while ((m = fn.exec(code))) out.push({ name: m[1], props: propNames(m[2]), arrow: false });
  const ar = /(?:^|\n)[ \t]*(?:export\s+(?:default\s+)?)?const\s+([A-Z]\w*)\s*=\s*(?:React\.memo\()?\s*(?:\(\s*(\{[^}]*\}|\w+)?[^)]*\)|(\w+))\s*=>/g;
  while ((m = ar.exec(code))) out.push({ name: m[1], props: propNames(m[2] || m[3]), arrow: true });
  return out;
}
function propNames(decl?: string): string[] {
  if (!decl || !decl.startsWith('{')) return [];
  return decl.slice(1, -1).split(',').filter((p) => !p.trim().startsWith('...') && !p.includes('=') && !/[[\]"']/.test(p)).map((p) => p.split(':')[0].trim()).filter((p) => /^[A-Za-z_$][\w$]*$/.test(p)); // props with a default keep their default
}

const PROP_SAMPLE: [RegExp, string][] = [
  [/^(items|list|users|products|todos|posts|messages|orders|comments|tasks|data|results|options|rows|entries|notifications)$/i, "{[{ id: 1, name: 'Apple', title: 'First', text: 'Hello', done: false, price: 3 }, { id: 2, name: 'Banana', title: 'Second', text: 'Hi', done: true, price: 5 }]}"],
  [/^(user|person|item|product|post|todo|order|profile|data|config|account|comment|task|student)$/i, "{{ id: 1, name: 'Alice', email: 'alice@example.com', title: 'Sample', price: 9.99, avatar: '' }}"],
  [/^(count|total|index|id|age|price|amount|quantity|size|value|number|step|max|min|initial|initialCount|width|height|delay|likes)$/i, '{3}'],
  [/^(on[A-Z]\w*|handle\w+|set[A-Z]\w*|callback|fn|render\w*)$/, '{() => {}}'],
  [/^(is\w+|has\w+|show\w+|disabled|active|loading|visible|open|checked|selected|done|completed|isLoggedIn|error)$/, '{true}'],
  [/^(children)$/, ''],
];
function propAttr(name: string): string {
  if (name === 'children') return '';
  for (const [re, v] of PROP_SAMPLE) if (re.test(name)) return `${name}=${v}`;
  return `${name}="Sample ${name}"`;
}

/** Hooks are used without an import in most lesson snippets, and the editor strips imports — pull them from React. */
function reactPrelude(code: string): string {
  const stripped = stripNonCode(code);
  const declared = declaredNames(stripped);
  const importedFromReact = new Set<string>();
  const imp = /import\s+[^;]*?\bfrom\s+['"]react['"]/g;
  let m: RegExpExecArray | null;
  while ((m = imp.exec(code))) (m[0].match(/[A-Za-z_$][\w$]*/g) || []).forEach((x) => importedFromReact.add(x));
  const used = REACT_NAMES.filter((n) => new RegExp(`(?<![.\\w$])${n}\\b`).test(stripped) && !new RegExp(`(?:const|let|var|function|class)\\s+${n}\\b`).test(stripped) && (!declared.has(n) || importedFromReact.has(n)));
  return used.length ? `const { ${used.join(', ')} } = React;\n` : '';
}

/** import { Routes, Route, useNavigate } from 'react-router-dom' — the editor has no such package; give the names simple stand-ins. */
function stubPackageImports(code: string): string {
  const stubs: string[] = [];
  const out = code.replace(/^[ \t]*import\s+([^;]*?)\s+from\s+['"]([^'"]+)['"];?[ \t]*$/gm, (all, what: string, pkg: string) => {
    if (/^(react|react-dom|react-dom\/client)$/.test(pkg) || pkg.startsWith('.') || pkg.startsWith('@/')) return all;
    const names = (what.match(/[A-Za-z_$][\w$]*/g) || []).filter((n) => n !== 'as' && n !== 'type');
    names.forEach((n) => {
      if (/^(Link|NavLink)$/.test(n)) stubs.push(`const ${n} = ({ to, children, ...p }) => <a href={to} {...p}>{children}</a>;`);
      else if (/^[A-Z]/.test(n)) stubs.push(`const ${n} = ({ children }) => <>{children}</>;`);
      else if (/^use[A-Z]/.test(n)) stubs.push(n === 'useNavigate' ? 'const useNavigate = () => () => {};' : `const ${n} = () => ({});`);
      else stubs.push(`const ${n} = () => {};`);
    });
    return `// ${all.trim()}`;
  });
  return stubs.length ? `// (stand-ins for packages the editor does not load)\n${stubs.join('\n')}\n\n${out}` : out;
}

export function healReact(src: string): string {
  let code = dropPlaceholders(src);
  const prelude = reactPrelude(code);
  code = renameDuplicates(code);
  // plain-DOM lines that only make sense on an HTML page (getElementById… next to the React version) are left out
  code = chunksOf(code).map((ch) => (/\bdocument\.(?:getElementById|querySelector)/.test(ch) && !/<[A-Za-z]|React\./.test(ch) && /ReactDOM|<[A-Z]|React\./.test(code) ? ch.split('\n').map((l) => (l.trim() ? `// ${l}` : l)).join('\n') : ch)).join('\n');
  // JSX written as bare statements ("usage" lines): render them
  const hasRender = /ReactDOM\.(createRoot|render)|root\.render\(/.test(code);
  if (!hasRender) {
    const lines = code.split('\n');
    const out: string[] = [];
    let i = 0;
    let rendered = false;
    while (i < lines.length) {
      const t = lines[i].trim();
      if (!rendered && /^<[A-Za-z]/.test(t) && bracketDepthBefore(lines, i) === 0) {
        const block: string[] = [];
        while (i < lines.length && lines[i].trim() && !/^\s*\/\//.test(lines[i]) && bracketDepthBefore(lines, i) === 0 && /^\s*<[A-Za-z/>]|^\s+\S/.test(lines[i])) { block.push(lines[i]); i++; }
        out.push('ReactDOM.createRoot(document.getElementById("root")).render(', '  <>', ...block.map((b) => `    ${b.trim()}`), '  </>', ');');
        rendered = true;
        continue;
      }
      out.push(lines[i]);
      i++;
    }
    code = out.join('\n');
  }
  if (!/ReactDOM\.(createRoot|render)|root\.render\(/.test(code)) {
    const comps = components(code);
    const app = comps.find((c) => c.name === 'App') || comps[comps.length - 1];
    if (app) {
      const attrs = app.props.map(propAttr).filter(Boolean).join(' ');
      code += `\n\n// (sample render added so this component shows up)\nReactDOM.createRoot(document.getElementById("root")).render(<${app.name}${attrs ? ' ' + attrs : ''} />);\n`;
    }
  }
  return (needsMockFetch(code) ? MOCK_FETCH + '\n' : '') + prelude + stubPackageImports(code);
}

function bracketDepthBefore(lines: string[], idx: number): number {
  let depth = 0;
  for (let i = 0; i < idx; i++) for (const ch of stripNonCode(lines[i])) { if ('{[('.includes(ch)) depth++; else if ('}])'.includes(ch)) depth--; }
  return depth;
}

/* ───────────── TypeScript ───────────── */

/** Value imports (fs, ./utils…) do not exist in the editor: comment them out and stand in for the names that are used as values. */
export function healTs(src: string): string {
  const stubs: string[] = [];
  if (/(?<![.\w$])process\s*\./.test(src) && !/(?:const|let|var|function)\s+process\b/.test(src)) stubs.push("const process: any = { env: {}, argv: ['node', 'app.ts'], exit: (c?: number) => { console.log('process.exit(' + (c ?? 0) + ')'); }, on: () => {}, cwd: () => '/app', platform: 'browser', version: 'v20.0.0' };");
  const code = renameDuplicates(src).replace(/^[ \t]*import\s+(type\s+)?([^;]*?)\s+from\s+['"]([^'"]+)['"];?[ \t]*$/gm, (all, isType: string | undefined, what: string) => {
    if (isType) return `// ${all.trim()}`;
    const names = (what.match(/[A-Za-z_$][\w$]*/g) || []).filter((n) => n !== 'as' && n !== 'type' && n !== 'default');
    names.forEach((n) => {
      const rest = src.replace(all, '');
      if (new RegExp(`(?<![.\\w$])${n}\\s*\\(`).test(rest)) stubs.push(`function ${n}(...args: any[]): any { return args[0]; }`);
      else if (new RegExp(`\\bnew\\s+${n}\\b`).test(rest)) stubs.push(`class ${n} { constructor(...args: any[]) { Object.assign(this, args[0]); } }`);
      else if (new RegExp(`(?<![.\\w$])${n}\\s*[.[]`).test(rest)) stubs.push(`const ${n}: any = new Proxy({}, { get: (_: any, k: any) => (k === 'then' || typeof k === 'symbol' ? undefined : (...args: any[]) => args[0]) });`);
    });
    return `// ${all.trim()}`;
  });
  return stubs.length ? `// (stand-ins for the imports above so the example can run)\n${stubs.join('\n')}\n\n${code}` : code;
}
