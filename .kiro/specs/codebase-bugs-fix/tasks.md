# Tasks — Codebase Bugs Fix

## Implementation Tasks

- [x] 1. Remove debug `console.log` from `ThemeToggle.tsx`
  - File: `src/components/ui/ThemeToggle.tsx`
  - Delete the `console.log('Theme toggle clicked. Current:', theme);` line inside the `onClick` handler.

- [x] 2. Add special-case routing for HTML, CSS, JavaScript in `LearnPage`
  - File: `src/app/learn/page.tsx`
  - Replace `href={'/learn/${tech.slug}'}` with a ternary that maps `html` → `/html`, `css` → `/css`, `javascript` → `/js`, others → `/learn/${tech.slug}`.

- [x] 3. Add special-case routing for CSS and JavaScript in `TechnologiesPage`
  - File: `src/app/technologies/page.tsx`
  - Extend the existing `html`-only ternary to also handle `css` → `/css` and `javascript` → `/js`.

- [x] 4. Fix fill-blank Check button in `ExerciseBlock.tsx`
  - File: `src/components/docs/ExerciseBlock.tsx`
  - Replace the broken `document.querySelector` + stale-state pattern with `e.currentTarget.previousElementSibling as HTMLInputElement` to read the live input value.

- [x] 5. Fix blank line rendering in `CodeBlock.tsx`
  - File: `src/components/docs/CodeBlock.tsx`
  - In `renderSyntax`, return `'\u00A0'` instead of `'\n'` for empty lines; rename `lang` → `_lang`.

- [x] 6. Narrow ESLint disable comment in `InlinePlayground.tsx`
  - File: `src/components/docs/InlinePlayground.tsx`
  - Change `// eslint-disable-line` to `// eslint-disable-line react-hooks/exhaustive-deps`.

- [x] 7. Extend `Roadmap` interface in `types.ts`
  - File: `src/lib/types.ts`
  - Add `icon?: string`, `color?: string`, and `steps?: Array<{ phase: string; color: string }>` to the `Roadmap` interface.

- [x] 8. Verify — TypeScript compilation passes with no errors
  - Run `tsc --noEmit` and confirm zero type errors.
