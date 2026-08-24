# Tasks — Final Bugs Fix

## Task List

- [x] 1. Fix CTA hrefs in `src/app/roadmaps/[slug]/page.tsx` (`/learn/html` → `/html`, `/learn/javascript` → `/js`)
- [x] 2. Add `items?: string[]` to `Roadmap.steps` type in `src/lib/types.ts`
- [x] 3. Narrow eslint-disable comment in `src/components/ide/PlaygroundClient.tsx`
- [x] 4. Replace deprecated `escape()` with percent-encoding in `src/components/ide/PlaygroundClient.tsx`
- [x] 5. Fix XSS via `dangerouslySetInnerHTML` in `src/components/tools/RegexTester.tsx`
- [x] 6. Verify with `tsc --noEmit`
