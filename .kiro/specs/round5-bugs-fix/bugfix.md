# Round 5 Bug Fixes

## Summary

Seven confirmed bugs across routing, React hook misuse, deprecated API usage, dead code, and broken navigation links.

---

## Bug 1 — JSLessonClient.tsx breadcrumb links to non-existent `/learn/javascript`

**File:** `src/components/js/JSLessonClient.tsx` ~line 85

The Breadcrumb component hard-codes `href: '/learn/javascript'` for the JavaScript breadcrumb item. The route `/learn/javascript` does not exist; JavaScript lessons live under `/js`.

**Fix:** Change `href: '/learn/javascript'` to `href: '/js'`.

---

## Bug 2 — Footer.tsx links HTML and CSS to wrong routes

**File:** `src/components/layout/Footer.tsx`

The footer's Core column links HTML to `/learn/html` and CSS to `/learn/css`. Neither route exists. The correct routes are `/html` and `/css`.

**Fix:** Change `h: '/learn/html'` to `h: '/html'` and `h: '/learn/css'` to `h: '/css'`.

---

## Bug 3 — ReactSectionRenderer.tsx misuses `useState` as an effect

**File:** `src/components/react/ReactSectionRenderer.tsx` — `ReactPlayground` component

`useState(() => { setSrcDoc(buildDoc(jsx, css)); })` calls `setSrcDoc` inside a `useState` initializer as a side effect. This is incorrect; the initializer should return the initial state value, not trigger side effects.

**Fix:** Remove the misused call and initialize `srcDoc` directly:
```ts
const [srcDoc, setSrcDoc] = useState(() => buildDoc(jsx, css));
```

---

## Bug 4 — TsSectionRenderer.tsx same misused `useState` as effect

**File:** `src/components/ts/TsSectionRenderer.tsx` — `TsPlayground` component

Same pattern as Bug 3: `useState(() => { setSrcDoc(buildDoc(js, css)); })` misuses the hook as an effect.

**Fix:** Same approach — initialize `srcDoc` directly:
```ts
const [srcDoc, setSrcDoc] = useState(() => buildDoc(js, css));
```

---

## Bug 5 — Deprecated `unescape()` in OpenInEditorBtn across 5 files

**Files:**
- `src/components/js/JSSectionRenderer.tsx` (two calls)
- `src/components/html/HtmlSectionRenderer.tsx`
- `src/components/css/CssSectionRenderer.tsx`
- `src/components/react/ReactSectionRenderer.tsx`
- `src/components/ts/TsSectionRenderer.tsx`

All use `btoa(unescape(encodeURIComponent(X)))`. The `unescape()` function is deprecated. The modern equivalent is:
```ts
btoa(encodeURIComponent(X).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16))))
```

---

## Bug 6 — LoremIpsum.tsx unused `s` variable in sentences branch

**File:** `src/components/tools/LoremIpsum.tsx`

In the `sentences` branch of `generate()`, `const s = generateSentence()` is declared immediately before an `Array.from` block that generates sentences independently using `sent`. The variable `s` is never referenced and the `generateSentence()` call is wasted.

**Fix:** Remove the dead `const s = generateSentence();` line.

---

## Bug 7 — Navbar.tsx search results link HTML/CSS/JS topics to wrong routes

**File:** `src/components/layout/Navbar.tsx`

The search result link template `` `/learn/${r.technologySlug}/${r.slug}` `` generates `/learn/html/…`, `/learn/css/…`, and `/learn/javascript/…` for those three technologies. None of those base paths exist. The correct bases are `/html`, `/css`, and `/js`.

**Fix:** Add special-case routing for `html`, `css`, and `javascript` slugs.
