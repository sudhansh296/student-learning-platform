# Round 5 Bug Fixes — Design

## Approach

All fixes are surgical, single-line or minimal-scope changes. No new abstractions or refactoring beyond what each bug requires.

---

## Bug 1 — Breadcrumb href correction

Change one string literal in the `Breadcrumb` items array inside `JSLessonClient.tsx`:

```tsx
// Before
{ label: 'JavaScript', href: '/learn/javascript' }

// After
{ label: 'JavaScript', href: '/js' }
```

---

## Bug 2 — Footer href corrections

Change two string literals in the `cols` array in `Footer.tsx`:

```ts
// Before
{ l: 'HTML', h: '/learn/html' },
{ l: 'CSS',  h: '/learn/css'  },

// After
{ l: 'HTML', h: '/html' },
{ l: 'CSS',  h: '/css'  },
```

---

## Bug 3 & 4 — useState initializer pattern

The lazy initializer form `useState(() => expr)` runs `expr` once on mount and uses its return value as the initial state. Calling `setSrcDoc` inside a `useState` initializer is a misuse — it triggers a state update during render, which is incorrect.

Replace the two-line pattern with a single properly initialized state:

```ts
// Remove both of:
const [srcDoc, setSrcDoc] = useState('');
useState(() => { setSrcDoc(buildDoc(/* ... */)); });

// Replace with:
const [srcDoc, setSrcDoc] = useState(() => buildDoc(/* ... */));
```

---

## Bug 5 — Modern btoa encoding

`unescape()` is deprecated in all modern JS environments. The standard replacement encodes each percent-encoded byte back to a character before passing to `btoa`:

```ts
// Deprecated
btoa(unescape(encodeURIComponent(X)))

// Modern
btoa(encodeURIComponent(X).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16))))
```

This replacement is applied in all five files, including both occurrences in `JSSectionRenderer.tsx`.

---

## Bug 6 — Dead variable removal

Remove one line in the `sentences` branch of `LoremIpsum.generate()`:

```ts
// Remove this line
const s = generateSentence();
```

The `Array.from` block below it already generates sentences correctly via its own `sent` variable.

---

## Bug 7 — Search result routing with technology slug overrides

Extend the `Link href` expression in `Navbar.tsx` search results with three special cases before the generic `/learn/${r.technologySlug}/${r.slug}` fallback:

```tsx
href={
  r.type === 'topic' && r.technologySlug
    ? r.technologySlug === 'html'       ? `/html/${r.slug}`
      : r.technologySlug === 'css'      ? `/css/${r.slug}`
      : r.technologySlug === 'javascript' ? `/js/${r.slug}`
      : `/learn/${r.technologySlug}/${r.slug}`
    : `/learn/${r.slug}`
}
```
