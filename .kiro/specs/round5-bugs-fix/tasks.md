# Round 5 Bug Fixes — Tasks

## Tasks

- [x] 1. Fix `JSLessonClient.tsx` breadcrumb href from `/learn/javascript` to `/js`
- [x] 2. Fix `Footer.tsx` HTML and CSS hrefs from `/learn/html`/`/learn/css` to `/html`/`/css`
- [x] 3. Fix `ReactSectionRenderer.tsx` misused `useState` as effect — initialize `srcDoc` directly
- [x] 4. Fix `TsSectionRenderer.tsx` misused `useState` as effect — initialize `srcDoc` directly
- [x] 5. Fix deprecated `unescape()` in all 5 section renderer files (2 occurrences in JSSectionRenderer)
- [x] 6. Fix `LoremIpsum.tsx` — remove dead `const s = generateSentence()` in sentences branch
- [x] 7. Fix `Navbar.tsx` search results routing for html/css/javascript technology slugs
- [x] 8. Run `tsc --noEmit` and confirm zero TypeScript errors
