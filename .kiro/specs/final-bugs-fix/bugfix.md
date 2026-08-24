# Final Bugs Fix

## Summary

Five confirmed bugs across the webdev-atlas codebase requiring fixes.

## Bugs

### Bug 1 — Hardcoded wrong hrefs in `roadmaps/[slug]/page.tsx`
**File:** `src/app/roadmaps/[slug]/page.tsx`  
**Condition:** The CTA section links use `/learn/html` and `/learn/javascript`, routes that do not exist.  
**Fix:** Change to `/html` and `/js` which are the actual routes.

### Bug 2 — `Roadmap` type missing `items` on steps
**File:** `src/lib/types.ts`  
**Condition:** `roadmap.steps` is typed as `Array<{ phase: string; color: string }>` but the page template accesses `step.items` and the actual data includes `items`. TypeScript cannot verify this usage.  
**Fix:** Add `items?: string[]` to the steps array element type.

### Bug 4 — Broad `// eslint-disable-line` in `PlaygroundClient.tsx`
**File:** `src/components/ide/PlaygroundClient.tsx`  
**Condition:** `// eslint-disable-line` suppresses all ESLint rules on that line rather than only the intended one.  
**Fix:** Narrow to `// eslint-disable-line react-hooks/exhaustive-deps`.

### Bug 6 — Deprecated `escape()` in `PlaygroundClient.tsx`
**File:** `src/components/ide/PlaygroundClient.tsx`  
**Condition:** `decodeURIComponent(escape(atob(...)))` uses the deprecated `escape()` global to handle UTF-8 encoded base64.  
**Fix:** Replace with a percent-encoding approach using `charCodeAt` and `padStart`.

### Bug 7 — XSS via `dangerouslySetInnerHTML` in `RegexTester.tsx`
**File:** `src/components/tools/RegexTester.tsx`  
**Condition:** User-controlled `testString` is injected into the DOM via `dangerouslySetInnerHTML` without HTML escaping. A `testString` of `<script>alert(1)</script>` would execute.  
**Fix:** HTML-escape all user content before inserting it into the HTML string. Build the highlighted output by iterating matches and escaping each segment.
