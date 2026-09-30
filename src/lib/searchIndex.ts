// Full-text search over every lesson (titles, headings, paragraphs, notes, lists, tables, example titles and code).
// Server-only: it is used by /api/search and is built once per server process from the same data the lesson pages render.
import { searchTechnologies } from '@/data/technologies';
import { COURSES } from '@/lib/courses';

interface Entry {
  course: string;
  courseLabel: string;
  lesson: string;
  lessonTitle: string;
  href: string;
  /** 'lesson' | 'heading' | 'example' */
  kind: string;
  /** Section heading / example title shown under the lesson title. */
  section: string;
  /** Text shown in the snippet (paragraphs, notes, lists — no code). */
  text: string;
  code: string;
  lcTitle: string;
  lcSection: string;
  lcText: string;
  lcCode: string;
}

let INDEX: Entry[] | null = null;

const clean = (s: string | undefined) => (s || '').replace(/\s+/g, ' ').trim();

function build(): Entry[] {
  const out: Entry[] = [];
  COURSES.forEach((course) => {
    const seen = new Set<string>();
    course.lessons.forEach((lesson) => {
      if (!lesson || !lesson.slug || seen.has(lesson.slug)) return;
      seen.add(lesson.slug);
      const href = course.base + lesson.slug;
      const push = (kind: string, section: string, text: string, code: string) => {
        out.push({
          course: course.id, courseLabel: course.label, lesson: lesson.slug, lessonTitle: lesson.title, href, kind, section, text, code,
          lcTitle: lesson.title.toLowerCase(), lcSection: section.toLowerCase(), lcText: text.toLowerCase(), lcCode: code.toLowerCase(),
        });
      };
      push('lesson', '', clean(lesson.description), '');
      let heading = '';
      let texts: string[] = [];
      const flush = () => { if (heading || texts.length) push('heading', heading, texts.join(' '), ''); texts = []; };
      (lesson.sections || []).forEach((s) => {
        switch (s.type) {
          case 'heading': flush(); heading = clean(s.content); break;
          case 'example': {
            push('example', clean(s.title) || heading, clean(s.content), (s.code || '').slice(0, 4000));
            break;
          }
          case 'table': texts.push(clean(s.title), ...(s.headers || []).map(clean), ...(s.rows || []).flat().map(clean)); break;
          case 'list': texts.push(clean(s.title), ...(s.items || []).map(clean)); break;
          case 'tryit': break;
          default: texts.push(clean(s.title), clean(s.content));
        }
      });
      flush();
    });
  });
  return out;
}

export interface SearchResult {
  type: 'lesson' | 'technology';
  course: string;
  courseLabel: string;
  lesson: string;
  lessonTitle: string;
  /** Section heading / example title the match is in. */
  section: string;
  kind: string;
  href: string;
  /** Text to find and highlight on the lesson page. */
  hl: string;
  snippet: string;
  score: number;
}

function snippetAround(text: string, terms: string[]): { snippet: string; phrase: string } {
  const lc = text.toLowerCase();
  let at = -1;
  for (const t of terms) { const i = lc.indexOf(t); if (i >= 0 && (at < 0 || i < at)) at = i; }
  if (at < 0) return { snippet: text.slice(0, 140), phrase: text.slice(0, 40) };
  const from = Math.max(0, at - 50);
  const to = Math.min(text.length, at + 110);
  const snip = (from > 0 ? '…' : '') + text.slice(from, to) + (to < text.length ? '…' : '');
  return { snippet: snip, phrase: text.slice(at, Math.min(text.length, at + 48)) };
}

/* ───────────── understanding the query: filler words, synonyms, typos ───────────── */

const STOP = new Set(`a an the is are was were be to of in on at for from by with and or not no do does did done how what why when where which who whom can could should would will shall may might must i me my we you your it its this that these those there here about into over under use using used get make made tell show give need want know please
kya hota hota hai hain ho hoga ka ki ke ko se me mein par pe kaise kese kaisa kaun kyu kyun kaam karta karti karte kare kare karo kar krna karna bhi ye yeh wo woh aur ya toh to hi na mujhe humein batao bata sikho seekho`.split(/\s+/));

const SYNONYMS: Record<string, string[]> = {
  remove: ['delete', 'drop'], delete: ['remove', 'drop'], erase: ['delete', 'remove'],
  db: ['database'], database: ['db'],
  stylesheet: ['css'], styles: ['css', 'style'], style: ['css'],
  hook: ['usestate', 'useeffect', 'hooks'], hooks: ['hook'],
  centre: ['center'], center: ['centre', 'align'], align: ['center'],
  api: ['rest'], endpoint: ['route', 'endpoints'], route: ['routing', 'endpoint'],
  container: ['containers'], image: ['images'], var: ['variable', 'variables'], variable: ['variables', 'var'],
  loop: ['loops', 'for'], array: ['arrays'], object: ['objects'], function: ['functions'], async: ['await', 'promise', 'promises'],
  promise: ['promises', 'async'], error: ['errors', 'exception', 'try'], exception: ['error', 'errors'],
  login: ['authentication', 'auth'], auth: ['authentication', 'login'], password: ['bcrypt', 'hash'],
  install: ['installation', 'setup'], setup: ['installation', 'install'], deploy: ['deployment'],
  test: ['testing', 'jest'], tests: ['testing'], undo: ['revert', 'reset'], revert: ['undo', 'reset'],
  branch: ['branches', 'branching'], merge: ['merging'], join: ['joins'], index: ['indexes', 'indexing'],
  select: ['query', 'queries'], query: ['queries', 'select'], table: ['tables'], primary: ['primary key'],
};

/** All words that appear anywhere in the lessons, with how often — used to correct spelling mistakes. */
let VOCAB: Map<string, number> | null = null;
function vocab(): Map<string, number> {
  if (VOCAB) return VOCAB;
  if (!INDEX) INDEX = build();
  const v = new Map<string, number>();
  for (const e of INDEX) {
    for (const w of `${e.lcTitle} ${e.lcSection} ${e.lcText} ${e.lcCode}`.match(/[a-z][a-z0-9.+#-]{3,20}/g) || []) v.set(w, (v.get(w) || 0) + 1);
  }
  VOCAB = v;
  return v;
}

/** Edit distance up to `max` (insert / delete / replace / swap of neighbours); returns max+1 when farther. */
function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const prev2: number[] = [];
  let prev: number[] = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur: number[] = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      let d = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d = Math.min(d, prev2[j - 2] + 1);
      cur[j] = d;
      if (d < best) best = d;
    }
    if (best > max) return max + 1;
    prev2.splice(0, prev2.length, ...prev);
    prev = cur;
  }
  return prev[b.length];
}

function correct(term: string): string | null {
  if (term.length < 4) return null;
  const v = vocab();
  const max = term.length >= 8 ? 2 : 1;
  let best: string | null = null;
  let bestScore = -1;
  for (const [w, n] of v) {
    const d = editDistance(term, w, max);
    if (d > max) continue;
    const score = (max + 1 - d) * 1000 + Math.min(n, 999) + (w[0] === term[0] ? 300 : 0);
    if (score > bestScore) { bestScore = score; best = w; }
  }
  return best;
}

interface Parsed { groups: string[][]; marks: string[]; corrected: string | null }

function parseQuery(q: string): Parsed {
  let words = q.split(/\s+/).filter(Boolean).map((w) => w.replace(/^[^a-z0-9.#+]+|[^a-z0-9.#+]+$/g, '')).filter(Boolean);
  const meaningful = words.filter((w) => !STOP.has(w));
  if (meaningful.length) words = meaningful;
  if (!INDEX) INDEX = build();
  const v = vocab();
  const fixed: string[] = [];
  let changed = false;
  const groups = words.map((w) => {
    let base = w;
    const known = [...v.keys()].some((k) => k.includes(w)) || w.length < 4;
    if (!known) {
      const c = correct(w);
      if (c) { base = c; changed = true; }
    }
    fixed.push(base);
    return [base, ...(SYNONYMS[base] || [])];
  });
  return { groups, marks: [...new Set(groups.flat())], corrected: changed ? fixed.join(' ') : null };
}

export interface SearchResponse { results: SearchResult[]; corrected: string | null; marks: string[] }

export function searchLessons(query: string, limit = 24): SearchResponse {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return { results: [], corrected: null, marks: [] };
  if (!INDEX) INDEX = build();
  const { groups, marks, corrected } = parseQuery(q);
  const phrase = groups.map((g) => g[0]).join(' ');
  const flat = groups.map((g) => g[0]);
  const scored: SearchResult[] = [];
  const needAll = groups.length;
  const minGroups = Math.max(1, Math.ceil(groups.length / 2));

  for (const e of INDEX) {
    let total = 0;
    let matched = 0;
    for (const alts of groups) {
      let best = 0;
      alts.forEach((t, ai) => {
        let s = 0;
        if (e.lcTitle.includes(t)) s += e.kind === 'lesson' ? 40 : 6;
        if (e.lcSection.includes(t)) s += e.kind === 'example' ? 22 : 26;
        if (e.lcText.includes(t)) s += e.kind === 'lesson' ? 12 : 8;
        if (e.lcCode.includes(t)) s += 5;
        if (e.courseLabel.toLowerCase().includes(t)) s += 2;
        if (ai > 0) s = Math.round(s * 0.7); // a synonym is a weaker match than the word typed
        if (s > best) best = s;
      });
      if (best) { matched++; total += best; }
    }
    if (!matched || matched < minGroups) continue;
    if (matched < needAll) total = Math.round(total * 0.45); // only some of the words matched
    // whole phrase in the title / section is the best match there is
    if (flat.length > 1) {
      if (e.lcSection.includes(phrase)) total += 30;
      if (e.lcTitle.includes(phrase)) total += 25;
      if (e.lcText.includes(phrase)) total += 12;
    }
    if (e.kind === 'lesson' && flat.some((t) => e.courseLabel.toLowerCase() === t)) total += 4;
    const hitTerms = marks.filter((t) => e.lcTitle.includes(t) || e.lcSection.includes(t) || e.lcText.includes(t) || e.lcCode.includes(t));
    const inSection = hitTerms.some((t) => e.lcSection.includes(t));
    const inText = hitTerms.some((t) => e.lcText.includes(t));
    const source = inText || !e.code ? e.text : e.code;
    const snip = e.kind === 'lesson' && !inText ? { snippet: e.text.slice(0, 150), phrase: '' } : snippetAround(source || e.text, hitTerms.length ? hitTerms : marks);
    scored.push({
      type: 'lesson', course: e.course, courseLabel: e.courseLabel, lesson: e.lesson, lessonTitle: e.lessonTitle, section: e.section,
      kind: e.kind, href: e.href,
      // a hit on the lesson's own title just opens the lesson; anything else scrolls to the matching text
      hl: e.kind === 'lesson' && (!inText || hitTerms.some((t) => e.lcTitle.includes(t))) ? '' : inSection && e.section ? e.section : snip.phrase,
      snippet: snip.snippet, score: total,
    });
  }
  scored.sort((a, b) => b.score - a.score);
  // at most 3 hits per lesson so one long lesson does not fill the list
  const perLesson = new Map<string, number>();
  const out: SearchResult[] = [];
  for (const r of scored) {
    const key = `${r.course}/${r.lesson}`;
    const n = perLesson.get(key) || 0;
    if (n >= 3) continue;
    perLesson.set(key, n + 1);
    out.push(r);
    if (out.length >= limit) break;
  }
  // course overview pages (e.g. "docker" -> /learn/docker) come first when the name matches
  const techs = searchTechnologies(corrected || q).filter((t) => t.type === 'technology').slice(0, 2).map<SearchResult>((t) => ({
    type: 'technology', course: t.slug, courseLabel: t.category, lesson: '', lessonTitle: t.title, section: '', kind: 'technology',
    href: `/learn/${t.slug}`, hl: '', snippet: t.description, score: 1000,
  }));
  return { results: [...techs, ...out].slice(0, limit), corrected, marks };
}
