// Draft storage and share-link building for the /playground code editor.
// Pure helpers (plus guarded localStorage access) so the editor component stays readable.

const DRAFT_KEY = 'wda_playground_draft_v1';

export interface PlaygroundDraft {
  v: 1;
  html: string;
  css: string;
  js: string;
  /** code of the language tabs (Python, Java, React, Express …) keyed by language id */
  langCode: Record<string, string>;
  tab: string;
  activeLang: string | null;
  stdin: string;
  template: string;
  savedAt: number;
}

const isStr = (x: unknown): x is string => typeof x === 'string';

/** The saved draft, or null when there is none (or the storage is unavailable / holds something unexpected). */
export function loadDraft(): PlaygroundDraft | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw) as Partial<PlaygroundDraft> | null;
    if (!d || d.v !== 1 || !isStr(d.html) || !isStr(d.css) || !isStr(d.js) || !isStr(d.tab) || !d.langCode || typeof d.langCode !== 'object') return null;
    const langCode: Record<string, string> = {};
    for (const [k, val] of Object.entries(d.langCode)) if (isStr(val)) langCode[k] = val;
    return {
      v: 1, html: d.html, css: d.css, js: d.js, langCode, tab: d.tab,
      activeLang: isStr(d.activeLang) ? d.activeLang : null,
      stdin: isStr(d.stdin) ? d.stdin : '',
      template: isStr(d.template) ? d.template : 'blank',
      savedAt: typeof d.savedAt === 'number' ? d.savedAt : Date.now(),
    };
  } catch { return null; }
}

/** Returns false when the browser refuses to store it (private mode, quota). */
export function saveDraft(draft: Omit<PlaygroundDraft, 'v' | 'savedAt'>): boolean {
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...draft, v: 1, savedAt: Date.now() }));
    return true;
  } catch { return false; }
}

export function clearDraft(): void {
  try { window.localStorage.removeItem(DRAFT_KEY); } catch { /* storage unavailable */ }
}

/** "just now", "5 min ago", "2 h ago", "3 d ago" */
export function timeAgo(ts: number, now = Date.now()): string {
  const s = Math.max(0, Math.round((now - ts) / 1000));
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return `${Math.floor(s / 86400)} d ago`;
}

/** Same encoding the "Run in Editor" links use: UTF-8 → base64 → URL-encoded. */
export function toParam(s: string): string {
  const bytes = encodeURIComponent(s).replace(/%([0-9A-F]{2})/g, (_, p1: string) => String.fromCharCode(parseInt(p1, 16)));
  return encodeURIComponent(btoa(bytes));
}

/** Links longer than this are refused: many servers, proxies and chat apps cut long URLs. */
export const MAX_SHARE_URL = 6000;

export interface ShareState {
  /** 'html' | 'css' | 'js' for the web tabs, or a language id */
  tab: string;
  html: string;
  css: string;
  js: string;
  /** set when a language tab (Python, React, Express …) is active */
  activeLang: string | null;
  langCode: string;
  stdin: string;
}

/** A /playground URL that reopens the current code, using the same query parameters the editor already reads. */
export function buildShareUrl(origin: string, s: ShareState): { url: string; tooLong: boolean } {
  const parts: string[] = [];
  if (s.activeLang && s.tab === s.activeLang) {
    parts.push(`lang=${encodeURIComponent(s.activeLang)}`, `js=${toParam(s.langCode)}`);
    if (s.stdin.trim()) parts.push(`input=${toParam(s.stdin)}`);
  } else {
    if (s.html.trim()) parts.push(`html=${toParam(s.html)}`);
    if (s.css.trim()) parts.push(`css=${toParam(s.css)}`);
    if (s.js.trim()) parts.push(`js=${toParam(s.js)}`);
    if (s.tab === 'html' || s.tab === 'css' || s.tab === 'js') parts.push(`tab=${s.tab}`);
  }
  const url = `${origin}/playground?${parts.join('&')}`;
  return { url, tooLong: url.length > MAX_SHARE_URL };
}

/** Copies text with the async clipboard API, falling back to a hidden textarea on older or insecure contexts. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(text); return true; }
  } catch { /* fall through to the legacy path */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch { return false; }
}
