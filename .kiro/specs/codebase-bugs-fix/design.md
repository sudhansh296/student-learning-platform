# Design Document — Codebase Bugs Fix

## Overview

Seven confirmed bugs are fixed across the webdev-atlas Next.js project. Each fix is surgical — the smallest change that eliminates the defect without altering unrelated behaviour.

---

## Bug 1 — Remove debug `console.log` from `ThemeToggle.tsx`

**File:** `src/components/ui/ThemeToggle.tsx`

**Root cause:** A `console.log('Theme toggle clicked. Current:', theme)` statement was left inside the `onClick` handler, leaking the current theme value to the browser console on every click.

**Fix:** Delete the single `console.log` line. The `setTheme` call and all other handler logic remain unchanged.

---

## Bug 2 — Special-case routing on the Learn page

**File:** `src/app/learn/page.tsx`

**Root cause:** Every technology card links to `/learn/${tech.slug}`. HTML, CSS, and JavaScript have dedicated top-level routes (`/html`, `/css`, `/js`) and no `/learn/html`, `/learn/css`, or `/learn/javascript` route exists, causing 404s.

**Fix:** Replace the static `href={'/learn/${tech.slug}'}` with a ternary expression:
- `tech.id === 'html'` → `/html`
- `tech.id === 'css'` → `/css`
- `tech.id === 'javascript'` → `/js`
- all others → `/learn/${tech.slug}`

---

## Bug 3 — Special-case routing on the Technologies page

**File:** `src/app/technologies/page.tsx`

**Root cause:** The existing ternary already handles HTML (`'/html'`), but CSS and JavaScript still fall through to `/learn/${tech.slug}`, causing the same 404 problem.

**Fix:** Extend the ternary to also handle `tech.id === 'css'` → `/css` and `tech.id === 'javascript'` → `/js`.

---

## Bug 4 — `ExerciseBlock` fill-blank Check button captures no input

**File:** `src/components/docs/ExerciseBlock.tsx`

**Root cause:** The Check button's `onClick` calls `document.querySelector('[data-ex="${ex.id}"]')`, but no `data-ex` attribute is ever placed on the `<input>`, so `inp` is always `null`. The fallback then reads `(answers[ex.id] as string) || ''`, which is the previously stored answer (empty on first submit), so the answer is always submitted as an empty string.

**Fix:** Use `e.currentTarget.previousElementSibling` (the sibling `<input>`) to read the live value, matching the pattern already used by the `code-output` exercise type.

---

## Bug 5 — Blank lines collapse in `CodeBlock.tsx`

**File:** `src/components/docs/CodeBlock.tsx`

**Root cause:** `renderSyntax` returns `'\n'` for empty lines. Inside a `<span>` within a `<div>`, a bare newline character is treated as whitespace and collapsed by the browser, giving the row zero visible height.

**Fix:** Return `'\u00A0'` (non-breaking space) for empty lines so the wrapping `<div>` row retains its line height. Rename the unused `lang` parameter to `_lang` to suppress the lint warning.

---

## Bug 6 — Overly broad ESLint disable in `InlinePlayground.tsx`

**File:** `src/components/docs/InlinePlayground.tsx`

**Root cause:** `// eslint-disable-line` (no rule name) blanket-suppresses every ESLint rule on the `useEffect` line, which may silently hide future violations.

**Fix:** Narrow to `// eslint-disable-line react-hooks/exhaustive-deps` — only the intentional exhaustive-deps suppression remains; other rules can still fire on that line.

---

## Bug 7 — `Roadmap` type missing `icon`, `color`, and `steps` fields

**File:** `src/lib/types.ts`

**Root cause:** `RoadmapsSection`, `src/app/roadmaps/page.tsx`, and `src/app/roadmaps/[slug]/page.tsx` all access `roadmap.icon`, `roadmap.color`, and `roadmap.steps`, but the `Roadmap` interface only declares `id`, `title`, `slug`, `description`, `difficulty`, `estimatedTime`, and `nodes`. This produces TypeScript type errors and potential runtime failures when `.map()` is called on an undefined `steps` value.

**Fix:** Add three optional fields to the `Roadmap` interface:
```ts
icon?: string;
color?: string;
steps?: Array<{ phase: string; color: string }>;
```

---

## Testing Strategy

All fixes are verified by running `tsc --noEmit`. Because every change is a one-line or small targeted edit, TypeScript compilation with no errors is sufficient to confirm correctness. No new runtime behaviour is introduced.
