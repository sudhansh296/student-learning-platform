# Design — Final Bugs Fix

## Fix 1: Correct CTA hrefs in `roadmaps/[slug]/page.tsx`

The CTA buttons at the bottom of every roadmap detail page link to `/learn/html` and `/learn/javascript`. These paths return 404 because the actual routes are `/html` and `/js`. Simple href string replacement.

## Fix 2: Extend `Roadmap.steps` type in `types.ts`

The `Roadmap` interface declares `steps` as `Array<{ phase: string; color: string }>`. The page iterates `step.items` and the actual roadmap data objects include `items: string[]` on each step. Adding `items?: string[]` makes the type accurate and allows TypeScript to verify the usage.

## Fix 3: Narrow eslint disable comment in `PlaygroundClient.tsx`

The `useEffect` for the initial run intentionally omits dependencies. The existing `// eslint-disable-line` suppresses all rules. Replace with `// eslint-disable-line react-hooks/exhaustive-deps` to be precise.

## Fix 4: Replace deprecated `escape()` in `PlaygroundClient.tsx`

`escape()` is deprecated since ES5. The intent is to decode a UTF-8 encoded base64 string. The modern approach encodes each byte of the raw `atob` output as a percent-encoded sequence, then passes the result to `decodeURIComponent`.

```ts
try {
  return decodeURIComponent(
    atob(decodeURIComponent(val))
      .split('')
      .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('')
  );
} catch { return ''; }
```

## Fix 5: Escape HTML in `RegexTester.tsx` highlighted output

The `highlighted` useMemo currently passes unsanitised `testString` content directly into the HTML string used by `dangerouslySetInnerHTML`. The fix introduces an `escapeHtml` helper and rebuilds the output by iterating `RegExp.exec` matches, escaping each text segment and each matched value before wrapping in `<mark>`.

```ts
const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
```

Zero-width match guard (`if (m[0].length === 0) re.lastIndex++`) prevents an infinite loop when the pattern matches an empty string.
