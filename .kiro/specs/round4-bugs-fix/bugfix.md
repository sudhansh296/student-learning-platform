# Round 4 Bug Fixes

## Overview
Six bugs identified across navigation, deprecated APIs, React hook misuse, XSS vulnerability, and Base64 encoding failure.

## Bug 1 — Wrong hrefs for HTML and CSS in JSEcosystem.tsx and CategoryExplorer.tsx

**Files:** `src/components/home/JSEcosystem.tsx`, `src/components/home/CategoryExplorer.tsx`

**Root cause:** HTML and CSS entries use `/learn/html` and `/learn/css` as hrefs, but those routes do not exist. The actual routes are `/html` and `/css`.

**Bug condition:** Clicking the HTML or CSS items on the home page navigates to a 404.

**Fix:** Change `href: '/learn/html'` → `href: '/html'` and `href: '/learn/css'` → `href: '/css'` in both files.

---

## Bug 2 — Wrong breadcrumb href for JavaScript in JSLessonClient.tsx

**File:** `src/components/js/JSLessonClient.tsx`

**Root cause:** Breadcrumb uses `href: '/learn/javascript'` for the JavaScript link, but that route doesn't exist. The correct route is `/js`.

**Bug condition:** Clicking the "JavaScript" breadcrumb on any JS lesson page navigates to a 404.

**Fix:** Change `href: '/learn/javascript'` → `href: '/js'`.

---

## Bug 3 — Deprecated `unescape()` in OpenInEditorButton across four section renderers

**Files:**
- `src/components/html/HtmlSectionRenderer.tsx`
- `src/components/css/CssSectionRenderer.tsx`
- `src/components/js/JSSectionRenderer.tsx`
- `src/components/react/ReactSectionRenderer.tsx`

**Root cause:** `unescape()` is deprecated. The pattern `btoa(unescape(encodeURIComponent(code)))` uses it to handle UTF-8 text in base64.

**Fix:** Replace with `btoa(encodeURIComponent(code).replace(/%([0-9A-F]{2})/g, (_, p) => String.fromCharCode(parseInt(p, 16))))`.

---

## Bug 4 — `useState` misused as a side-effect in ReactSectionRenderer.tsx

**File:** `src/components/react/ReactSectionRenderer.tsx`

**Root cause:** `useState(() => { setSrcDoc(buildDoc(jsx, css)); })` is called with a side-effect function. This is a misuse — `useState` initializers are only for providing initial state, not for triggering side effects. The `setSrcDoc` call happens during render, not as a mount effect, and the returned state tuple is discarded.

**Fix:** Initialize `srcDoc` directly: change `const [srcDoc, setSrcDoc] = useState('');` to `const [srcDoc, setSrcDoc] = useState(() => buildDoc(jsx, css));` and remove the misused `useState(() => { setSrcDoc(buildDoc(jsx, css)); });` line.

---

## Bug 5 — XSS via `dangerouslySetInnerHTML` with unescaped user input in MarkdownPreviewer.tsx

**File:** `src/components/tools/MarkdownPreviewer.tsx`

**Root cause:** The `renderMd` function passes user input directly into `dangerouslySetInnerHTML` without escaping HTML entities. Users can inject `<script>`, `<img onerror=...>`, or arbitrary HTML tags.

**Fix:** Introduce a `escHtml(s)` helper that escapes `&`, `<`, `>`. Apply it to all user-provided text segments captured by the markdown regex replacements. For heading, bold, italic, link text, blockquote, and list item captures, escape content via `escHtml`. For code blocks and inline code, escape the code content. For link URLs, validate that they start with `http://`, `https://`, or `/` to prevent `javascript:` URLs.

---

## Bug 6 — `btoa()` throws on non-Latin1 characters in Base64Tool.tsx

**File:** `src/components/tools/Base64Tool.tsx`

**Root cause:** `btoa()` only accepts Latin-1 (0–255) characters. Passing multi-byte characters (emojis, CJK characters, etc.) throws `InvalidCharacterError`. The existing try/catch shows a misleading error message ("Invalid input for decoding") even during encoding.

**Fix:**
- Encoding: Use `TextEncoder` to get UTF-8 bytes, then `String.fromCharCode(...utf8)` before `btoa()`.
- Decoding: Use `atob()` to get raw bytes, then `Uint8Array.from(...)` + `TextDecoder` to reconstruct the UTF-8 string.
