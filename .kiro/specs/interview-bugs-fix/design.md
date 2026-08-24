# Interview Bugs Fix — Bugfix Design

## Overview

This document covers the fix design for seven bugs in the `webdev-atlas` Next.js interview preparation module. The bugs fall into four concern areas:

1. **Malformed data syntax** — ~10 object literals in `project-questions.ts` use JSON-style quoted property keys instead of TypeScript object literal syntax.
2. **Missing null guards** — `interviewAnswer` (an optional field) is rendered unconditionally in two pages, producing visible `undefined` text in the UI.
3. **Unused imports** — `ChevronDown` and `ChevronUp` are imported but never referenced in two files, causing lint violations.
4. **Progress bar off-by-one** — the mock interview progress bar uses `currentIdx / session.length` instead of `(currentIdx + 1) / session.length`, so it never reaches 100% during the session.
5. **Phantom package version** — `package.json` specifies `lucide-react: "^1.31.0"`, which is outside the official `0.x` release range for that package.

The fixes are targeted and minimal: no behaviour changes beyond correcting the defects, no new abstractions, no schema changes.

---

## Glossary

- **Bug_Condition (C)**: The specific input state or code path that triggers a defect.
- **Property (P)**: The correct observable behaviour that the fix must produce for all inputs satisfying C.
- **Preservation**: All behaviours that must remain identical after the fix is applied.
- **isBugCondition(input)**: Pseudocode function that returns `true` when the bug is reachable.
- **expectedBehavior(result)**: Pseudocode function that returns `true` when the output is correct.
- **`interviewAnswer`**: Optional field (`interviewAnswer?: string`) on the `InterviewQuestion` type — may be `undefined`.
- **`currentIdx`**: Zero-based index of the active question in a mock interview session array.
- **JSON-style object literal**: TypeScript object literal where property keys are wrapped in double quotes — syntactically valid TS but stylistically inconsistent with the rest of the codebase.

---

## Bug Details

---

### Bug 1 — Malformed JSON-style syntax in `project-questions.ts`

#### Bug Condition

The last 10 entries in `projectInterviewQuestions` (Batch 4 starting at `proj-caching-strategy` and all of Batch 5) use JSON-style double-quoted property keys. The first ~20 entries in the same array use standard unquoted TypeScript object literal keys.

**Formal Specification:**
```
FUNCTION isBugCondition(entry)
  INPUT: entry — an object literal in the projectInterviewQuestions array
  OUTPUT: boolean

  RETURN entry uses double-quoted property keys (e.g. "id": "...", "category": "...")
         AND sibling entries in the same array use unquoted property keys (e.g. id: '...')
END FUNCTION
```

#### Examples

- `"id": "proj-caching-strategy"` → should be `id: 'proj-caching-strategy'`
- `"tags": ["caching", "redis"]` → should be `tags: ['caching', 'redis']`
- `"commonMistakes": ["No TTL"]` → should be `commonMistakes: ['No TTL']`
- Affected entries: `proj-caching-strategy`, `proj-git-workflow`, `proj-responsive-design`, `proj-logging-monitoring`, `proj-refactor-improvements` (Batch 4) and `proj-data-validation`, `proj-scalability-architecture`, `proj-ci-cd-pipeline`, `proj-monolith-vs-microservices`, `proj-concurrency-race-conditions` (Batch 5).

---

### Bug 2 — `interviewAnswer` rendered without null guard in Mock Interview page

#### Bug Condition

In the post-reveal section of `src/app/interview/mock/page.tsx`, the "Ideal Interview Answer" block is rendered unconditionally inside `{current.revealed && (…)}`. The inner JSX reads `{current.question.interviewAnswer}` without a truthiness guard. When `interviewAnswer` is `undefined`, React renders the string `"undefined"`.

**Formal Specification:**
```
FUNCTION isBugCondition(question)
  INPUT: question — an InterviewQuestion object
  OUTPUT: boolean

  RETURN question.interviewAnswer === undefined
         OR question.interviewAnswer === ''
END FUNCTION
```

#### Examples

- A question with no `interviewAnswer` field → renders `undefined` inside the green panel.
- A question with `interviewAnswer: ''` → renders an empty green panel.
- A question with `interviewAnswer: 'Walk through: bcrypt hash…'` → renders correctly (no bug).

---

### Bug 3 — `interviewAnswer` rendered without null guard in Rapid Revision page

#### Bug Condition

In the revealed answer section of `src/app/interview/rapid-revision/page.tsx`, the green "How to say it in an interview" panel is rendered unconditionally inside the `showAnswer` branch. `{currentCard.question.interviewAnswer}` is written without a truthiness guard.

**Formal Specification:**
```
FUNCTION isBugCondition(question)
  INPUT: question — an InterviewQuestion object
  OUTPUT: boolean

  RETURN question.interviewAnswer === undefined
         OR question.interviewAnswer === ''
END FUNCTION
```

#### Examples

- Any question where `interviewAnswer` is absent → green panel renders with the text `undefined`.
- A question with a defined `interviewAnswer` → renders correctly (no bug).

---

### Bug 4 — Unused `ChevronDown` import in `InterviewQuestionList.tsx`

#### Bug Condition

`ChevronDown` is imported from `lucide-react` on line 4 of `src/components/interview/InterviewQuestionList.tsx` but is never referenced anywhere in the file.

**Formal Specification:**
```
FUNCTION isBugCondition(importStatement)
  INPUT: importStatement — an import specifier in the file
  OUTPUT: boolean

  RETURN importStatement.name === 'ChevronDown'
         AND countUsages('ChevronDown', fileAst) === 0
END FUNCTION
```

---

### Bug 5 — Unused `ChevronDown` and `ChevronUp` imports in `practice/page.tsx`

#### Bug Condition

`ChevronDown` and `ChevronUp` are imported from `lucide-react` on line 5 of `src/app/interview/practice/page.tsx` but are never referenced in the component tree.

**Formal Specification:**
```
FUNCTION isBugCondition(importStatement)
  INPUT: importStatement — an import specifier in the file
  OUTPUT: boolean

  RETURN importStatement.name IN ['ChevronDown', 'ChevronUp']
         AND countUsages(importStatement.name, fileAst) === 0
END FUNCTION
```

---

### Bug 6 — Progress bar never reaches 100% in Mock Interview session

#### Bug Condition

In `src/app/interview/mock/page.tsx`, the progress bar width is computed as:

```ts
const progress = ((currentIdx) / session.length) * 100;
```

`currentIdx` is zero-based, so on the first question it is `0` (progress = 0%) and on the last question of an N-question session it is `N-1` (progress = `(N-1)/N * 100`). It can only reach 100% after the mode switches to `'results'`, by which point the progress bar is no longer rendered.

**Formal Specification:**
```
FUNCTION isBugCondition(state)
  INPUT: state — { currentIdx: number, sessionLength: number }
  OUTPUT: boolean

  RETURN (currentIdx / sessionLength) * 100 !== ((currentIdx + 1) / sessionLength) * 100
         AND the off-by-one causes visible user-facing misrepresentation
         — specifically: first question shows 0% instead of (1/N*100)%
         — and last question shows (N-1)/N*100% instead of 100%
END FUNCTION
```

#### Examples

- Session length 8, first question (`currentIdx = 0`): formula yields `0%`, should yield `12.5%`.
- Session length 8, last question (`currentIdx = 7`): formula yields `87.5%`, should yield `100%`.
- Session length 5, question 3 (`currentIdx = 2`): formula yields `40%`, should yield `60%`.

---

### Bug 7 — `lucide-react` version `^1.31.0` outside official 0.x release range

#### Bug Condition

`package.json` declares `"lucide-react": "^1.31.0"`. All official `lucide-react` releases published to the npm registry are in the `0.x` semver range. The `1.x` range does not correspond to an official release series; `package-lock.json` resolves this to `1.31.0` via `https://registry.npmjs.org/lucide-react/-/lucide-react-1.31.0.tgz`, which is not a version in the officially documented release history of the package.

**Formal Specification:**
```
FUNCTION isBugCondition(packageSpec)
  INPUT: packageSpec — the semver range string for lucide-react in package.json
  OUTPUT: boolean

  RETURN semverMajor(packageSpec) >= 1
         AND officialRegistryMaxVersion('lucide-react') < '1.0.0'
END FUNCTION
```

#### Examples

- `"^1.31.0"` → triggers the bug; new `npm install` on a clean machine may fail or install an unintended artifact.
- `"^0.460.0"` → does not trigger; resolves to a well-known official release.

---

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors (all bugs):**

- All 30 project-category questions SHALL continue to return from `getQuestionsByCategory('project')` with identical runtime values after Bug 1 is fixed — only syntax changes, not data.
- Question content (text, code blocks, tags, follow-up questions) SHALL render identically in all interview pages after Bug 1 is fixed.
- The "Short Answer", "Common Mistakes", and self-rating button sections in the Mock Interview revealed state SHALL render unconditionally, unaffected by the `interviewAnswer` null guard added for Bug 2.
- The "Short Answer" panel in the Rapid Revision revealed state SHALL render unconditionally after Bug 3 is fixed, since `shortAnswer` is a required field.
- All currently used icons (`Eye`, `Code2`, `Lightbulb`, `AlertTriangle`, `CheckCircle2`, `ArrowLeft`, `ChevronRight`, `BarChart2`, `Clock`, `Target`, `Play`, `Users`, `XCircle`, `RotateCcw`, `Zap`, `RefreshCw`, `BookOpen`, `Trophy`) SHALL continue to render identically after Bugs 4, 5, and 7 are fixed.
- The question index counter `{currentIdx + 1} / {session.length}` in the mock interview top bar SHALL continue to show the correct human-readable position after Bug 6 is fixed.
- The results screen SHALL continue to appear when `mode === 'results'` after Bug 6 is fixed.

**Scope of non-buggy inputs:**

- Any `InterviewQuestion` where `interviewAnswer` is a non-empty string is outside the bug condition for Bugs 2 and 3.
- Any import that is actually used in its file is outside the bug condition for Bugs 4 and 5.
- Any `currentIdx` value where the progress percentage correctly reflects position is outside the bug condition for Bug 6.

---

## Hypothesized Root Cause

### Bug 1
The last 10 entries were authored or pasted from JSON (e.g., copied from an AI or API response) rather than hand-written as TypeScript. The TypeScript compiler accepts quoted object keys, so no compile error surfaced.

### Bug 2
The "Ideal Interview Answer" section was modelled on the "Short Answer" section, where `shortAnswer` is a required field. The developer did not add a conditional wrapper when `interviewAnswer` was made optional, leaving the JSX expression unguarded.

### Bug 3
Same root cause as Bug 2: the Rapid Revision page was written assuming `interviewAnswer` would always be present, mirroring the `shortAnswer` rendering pattern.

### Bugs 4 & 5
`ChevronDown` and `ChevronUp` were likely included in the original import statement for a planned accordion/expand interaction that was subsequently implemented differently (or not at all). The icons were never removed from the import when the UI was finalised.

### Bug 6
The progress formula `currentIdx / session.length` treats the progress bar as "questions completed" (0 after the first question is shown) rather than "questions currently being answered" (`currentIdx + 1`). The intended semantics are the latter.

### Bug 7
The version string `^1.31.0` was likely hand-edited or auto-suggested during initial project setup. The actual `lucide-react` package only publishes under the `0.x` range; there is no official `1.x` release series.

---

## Correctness Properties

Property 1: Bug Condition — Consistent TypeScript Object Literal Syntax

_For any_ entry in the `projectInterviewQuestions` array, the fixed file SHALL use unquoted property keys with single-quoted string values, matching the syntax style of the first 20 entries and all sibling question files.

**Validates: Requirements 2.1, 2.2**

Property 2: Preservation — Project Question Runtime Values Unchanged

_For any_ call to `getQuestionsByCategory('project')`, the fixed function SHALL return the same set of questions with identical runtime field values as the pre-fix version, including all 10 previously JSON-style entries.

**Validates: Requirements 3.1, 3.2**

Property 3: Bug Condition — `interviewAnswer` Null Guard (Mock Interview)

_For any_ `InterviewQuestion` where `interviewAnswer` is `undefined` or an empty string, the fixed Mock Interview page SHALL NOT render the "Ideal Interview Answer" green panel.

**Validates: Requirements 2.1, 2.2 (Bug 2)**

Property 4: Preservation — Defined `interviewAnswer` Still Renders (Mock Interview)

_For any_ `InterviewQuestion` where `interviewAnswer` is a non-empty string, the fixed Mock Interview page SHALL render the green "Ideal Interview Answer" panel with that string, identical to pre-fix happy-path behaviour.

**Validates: Requirements 3.1, 3.2 (Bug 2)**

Property 5: Bug Condition — `interviewAnswer` Null Guard (Rapid Revision)

_For any_ `InterviewQuestion` where `interviewAnswer` is `undefined` or an empty string, the fixed Rapid Revision page SHALL NOT render the green "How to say it in an interview" panel.

**Validates: Requirements 3.1, 3.2 (Bug 3)**

Property 6: Preservation — Defined `interviewAnswer` Still Renders (Rapid Revision)

_For any_ `InterviewQuestion` where `interviewAnswer` is a non-empty string, the fixed Rapid Revision page SHALL render the green panel with that string, identical to pre-fix happy-path behaviour.

**Validates: Requirements 3.3, 3.4 (Bug 3)**

Property 7: Bug Condition — No Unused `lucide-react` Imports

_For any_ ESLint pass over `InterviewQuestionList.tsx` and `practice/page.tsx`, the fixed files SHALL report zero `no-unused-vars` violations for `lucide-react` named imports.

**Validates: Requirements 4.1, 4.2, 5.1, 5.2**

Property 8: Bug Condition — Progress Bar Formula

_For any_ question index `currentIdx` in a session of length `N` where `N > 0`, the fixed progress bar width SHALL equal `((currentIdx + 1) / N) * 100` percent, so the first question shows `(1/N)*100%` and the last question shows `100%`.

**Validates: Requirements 6.1, 6.2**

Property 9: Bug Condition — Valid `lucide-react` Package Version

_For any_ `npm install` run against the fixed `package.json`, the system SHALL resolve `lucide-react` to a version in the official `0.x` range from the npm registry.

**Validates: Requirements 7.1, 7.2**

---

## Fix Implementation

### Bug 1 — Reformat JSON-style entries in `project-questions.ts`

**File:** `src/data/interview/project-questions.ts`

**Specific Changes:**
For each of the 10 affected entries (Batch 4: `proj-caching-strategy`, `proj-git-workflow`, `proj-responsive-design`, `proj-logging-monitoring`, `proj-refactor-improvements`; Batch 5: `proj-data-validation`, `proj-scalability-architecture`, `proj-ci-cd-pipeline`, `proj-monolith-vs-microservices`, `proj-concurrency-race-conditions`):

1. **Unquote all top-level property keys** — change `"id":` → `id:`, `"category":` → `category:`, etc.
2. **Convert double-quoted string values to single-quoted** — change `"project"` → `'project'`, `"theory"` → `'theory'`, etc. (applies to scalar string values).
3. **Convert array elements from double-quoted to single-quoted** — change `["caching", "redis"]` → `['caching', 'redis']`.
4. **Preserve nested `example.code` string values** — `code` values are template literals or long strings; convert outer double quotes to single quotes or backticks as appropriate while preserving inner content exactly.
5. **Remove stray leading whitespace inconsistencies** — the affected entries have irregular leading whitespace (some have extra space before the opening `{`); align opening `{` with the rest of the array entries.
6. **Preserve all runtime data values** — no changes to the actual content of any field; only syntax style changes.

---

### Bug 2 — Add null guard for `interviewAnswer` in `mock/page.tsx`

**File:** `src/app/interview/mock/page.tsx`

**Specific Changes:**

1. **Wrap the "Ideal Interview Answer" div in a conditional** — change the unconditional render of the green panel to only render when `current.question.interviewAnswer` is truthy:

   Before:
   ```tsx
   {/* Interview answer */}
   <div className="p-4 rounded-xl" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
     <p className="text-xs font-bold uppercase tracking-wider mb-2 text-green-700">Ideal Interview Answer</p>
     <p className="text-sm leading-relaxed text-green-800">
       {current.question.interviewAnswer}
     </p>
   </div>
   ```

   After:
   ```tsx
   {/* Interview answer */}
   {current.question.interviewAnswer && (
     <div className="p-4 rounded-xl" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
       <p className="text-xs font-bold uppercase tracking-wider mb-2 text-green-700">Ideal Interview Answer</p>
       <p className="text-sm leading-relaxed text-green-800">
         {current.question.interviewAnswer}
       </p>
     </div>
   )}
   ```

2. **No other changes** to the surrounding revealed-answer block; Short Answer, Common Mistakes, and self-rating sections are unaffected.

---

### Bug 3 — Add null guard for `interviewAnswer` in `rapid-revision/page.tsx`

**File:** `src/app/interview/rapid-revision/page.tsx`

**Specific Changes:**

1. **Wrap the "How to say it in an interview" div in a conditional** — change the unconditional render of the green panel to only render when `currentCard.question.interviewAnswer` is truthy:

   Before:
   ```tsx
   <div className="p-4 rounded-xl" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
     <p className="text-xs font-bold uppercase tracking-wider mb-2 text-green-700">How to say it in an interview</p>
     <p className="text-sm leading-relaxed text-green-800">
       {currentCard.question.interviewAnswer}
     </p>
   </div>
   ```

   After:
   ```tsx
   {currentCard.question.interviewAnswer && (
     <div className="p-4 rounded-xl" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
       <p className="text-xs font-bold uppercase tracking-wider mb-2 text-green-700">How to say it in an interview</p>
       <p className="text-sm leading-relaxed text-green-800">
         {currentCard.question.interviewAnswer}
       </p>
     </div>
   )}
   ```

2. **No other changes** — the Short Answer panel, rating buttons, and all other session UI are unaffected.

---

### Bug 4 — Remove unused `ChevronDown` import from `InterviewQuestionList.tsx`

**File:** `src/components/interview/InterviewQuestionList.tsx`

**Specific Changes:**

1. **Remove `ChevronDown` from the named import** on line 4:

   Before:
   ```ts
   import { Eye, Code2, Lightbulb, AlertTriangle, CheckCircle2, ChevronDown } from 'lucide-react';
   ```

   After:
   ```ts
   import { Eye, Code2, Lightbulb, AlertTriangle, CheckCircle2 } from 'lucide-react';
   ```

---

### Bug 5 — Remove unused `ChevronDown` and `ChevronUp` imports from `practice/page.tsx`

**File:** `src/app/interview/practice/page.tsx`

**Specific Changes:**

1. **Remove `ChevronDown` and `ChevronUp` from the named import** on line 5:

   Before:
   ```ts
   import { ChevronDown, ChevronUp, Eye, Code2, Lightbulb, AlertTriangle, CheckCircle2, ArrowLeft } from 'lucide-react';
   ```

   After:
   ```ts
   import { Eye, Code2, Lightbulb, AlertTriangle, CheckCircle2, ArrowLeft } from 'lucide-react';
   ```

---

### Bug 6 — Fix progress bar off-by-one in `mock/page.tsx`

**File:** `src/app/interview/mock/page.tsx`

**Specific Changes:**

1. **Update the `progress` constant** in the `mode === 'session'` render block:

   Before:
   ```ts
   const progress = ((currentIdx) / session.length) * 100;
   ```

   After:
   ```ts
   const progress = ((currentIdx + 1) / session.length) * 100;
   ```

2. **No other changes** — the question counter display `{currentIdx + 1} / {session.length}` already uses the correct `+1` offset and is unaffected.

---

### Bug 7 — Correct `lucide-react` version in `package.json`

**File:** `package.json`

**Specific Changes:**

1. **Replace the `^1.31.0` version range with `^0.460.0`**, which is within the official `0.x` release series published to npm:

   Before:
   ```json
   "lucide-react": "^1.31.0"
   ```

   After:
   ```json
   "lucide-react": "^0.460.0"
   ```

2. **Update `package-lock.json`** by running `npm install` after the `package.json` change, so the lock file reflects the corrected resolved version.

3. **Verify all currently used icon exports** are available in the target version (`^0.460.0` range) — `Eye`, `Code2`, `Lightbulb`, `AlertTriangle`, `CheckCircle2`, `ArrowLeft`, `ChevronRight`, `BarChart2`, `Clock`, `Target`, `Play`, `Users`, `XCircle`, `RotateCcw`, `Zap`, `RefreshCw`, `BookOpen`, `Trophy`, `ChevronDown` (still imported elsewhere, if applicable) are all present in `lucide-react` `0.x`.

---

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach for the two most behaviour-sensitive bugs (null guards and progress bar): first surface counterexamples on unfixed code, then verify the fix and confirm preservation. The syntax, import, and package bugs are verified through compile-time and lint checks.

---

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate each bug BEFORE applying the fix. Confirm root cause analysis. Refute if needed and re-hypothesize.

**Bug 1 — Syntax:**
- Load `projectInterviewQuestions` in a test and check that `proj-caching-strategy.id` equals `'proj-caching-strategy'` (value test) — this will pass on unfixed code because TypeScript accepts quoted keys at runtime.
- Run ESLint or a custom script to detect double-quoted object keys — this will surface the style violation.
- Manual inspection of file confirms JSON-style syntax visually.

**Bug 2 — Mock Interview null guard:**
- Render `MockInterviewPage` in a test environment with a session question where `interviewAnswer` is `undefined`.
- Assert that the rendered output does NOT contain the string `"undefined"` inside the green panel.
- **Expected counterexample on unfixed code**: the text `undefined` is present in the DOM inside the Ideal Interview Answer panel.

**Bug 3 — Rapid Revision null guard:**
- Render the revealed-answer section of `RapidRevisionPage` with `currentCard.question.interviewAnswer === undefined`.
- Assert the green panel is not present in the rendered output.
- **Expected counterexample on unfixed code**: the panel renders with `undefined` as its text content.

**Bug 4 & 5 — Unused imports:**
- Run ESLint on the two files and check for `no-unused-vars` violations.
- **Expected counterexamples on unfixed code**: `ChevronDown` flagged in `InterviewQuestionList.tsx`; `ChevronDown` and `ChevronUp` flagged in `practice/page.tsx`.

**Bug 6 — Progress bar:**
- Render `MockInterviewPage` in session mode at `currentIdx = 0` and assert the progress bar width is > 0%.
- Render at `currentIdx = N-1` (last question) and assert width equals 100%.
- **Expected counterexamples on unfixed code**: first question shows `0%`; last question shows `(N-1)/N * 100%`.

**Bug 7 — Package version:**
- Run `npm ls lucide-react` and verify the installed version is in the `0.x` range.
- **Expected counterexample on unfixed code**: installed version is `1.31.0`, outside official range.

---

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed code produces the expected behaviour.

**Pseudocode (Bugs 2 & 3):**
```
FOR ALL question WHERE isBugCondition(question) DO
  result := render(page, { question })
  ASSERT NOT contains(result.dom, 'undefined')
  ASSERT NOT contains(result.dom, greenPanel)
END FOR
```

**Pseudocode (Bug 6):**
```
FOR ALL currentIdx IN [0 .. session.length - 1] DO
  expected := ((currentIdx + 1) / session.length) * 100
  actual   := progressBarWidth(render(page, { currentIdx, session }))
  ASSERT actual === expected
END FOR
```

**Specific fix check cases:**

| Bug | Input | Expected after fix |
|-----|-------|--------------------|
| 2 | `interviewAnswer: undefined` | Green panel absent |
| 2 | `interviewAnswer: ''` | Green panel absent |
| 2 | `interviewAnswer: 'Walk through...'` | Green panel present with content |
| 3 | `interviewAnswer: undefined` | Green panel absent |
| 3 | `interviewAnswer: 'Describe...'` | Green panel present with content |
| 6 | `currentIdx=0, session.length=8` | Progress = 12.5% |
| 6 | `currentIdx=7, session.length=8` | Progress = 100% |
| 6 | `currentIdx=4, session.length=5` | Progress = 100% |

---

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed code produces the same result as the original code.

**Pseudocode (Bugs 2 & 3):**
```
FOR ALL question WHERE NOT isBugCondition(question) DO  -- i.e. interviewAnswer is defined & non-empty
  ASSERT render_original(page, question) === render_fixed(page, question)
END FOR
```

**Pseudocode (Bug 6):**
```
-- Progress formula for non-buggy comparison is not meaningful (there is no "correct" unfixed value)
-- Preservation focus: results screen still appears when mode === 'results'
ASSERT render_fixed({ mode: 'results' }) renders results screen correctly
ASSERT render_fixed({ mode: 'session', currentIdx }) does NOT render results screen
```

**Testing approach**: Property-based testing is recommended for Bugs 2 and 3 preservation because:
- It generates many `InterviewQuestion` objects automatically, including edge cases.
- It catches cases where the null guard accidentally affects questions with valid `interviewAnswer` values.
- It provides confidence that wrapping the panel in a conditional does not break the happy path.

**Preservation test cases:**

1. **Happy-path interviewAnswer (Bugs 2 & 3)**: For 50+ generated questions with non-empty `interviewAnswer`, verify the green panel renders and contains the expected string.
2. **shortAnswer always renders (Bug 3)**: For any question (with or without `interviewAnswer`), verify the Short Answer panel is always present in the revealed state.
3. **Other sections unaffected (Bug 2)**: Verify Common Mistakes and self-rating buttons render when `current.revealed === true`, regardless of `interviewAnswer`.
4. **Results screen (Bug 6)**: Verify the results screen renders correctly and the progress bar is absent once `mode === 'results'`.
5. **Icon rendering (Bugs 4, 5)**: Verify all five/six remaining icons render in their respective components after removing unused imports.
6. **Runtime data values (Bug 1)**: For all 10 reformatted entries, assert each field value matches the expected string/array exactly.

---

### Unit Tests

- Test `InterviewQuestionList` renders all five icons (Eye, Code2, Lightbulb, AlertTriangle, CheckCircle2) on a sample question.
- Test Mock Interview session with a question that has `interviewAnswer: undefined` — assert no text "undefined" in output.
- Test Mock Interview session with a question that has a defined `interviewAnswer` — assert green panel is present.
- Test Rapid Revision revealed state with `interviewAnswer: undefined` — assert green panel absent.
- Test Rapid Revision revealed state with `interviewAnswer: 'some text'` — assert green panel present.
- Test progress bar at `currentIdx = 0` yields `(1/N)*100%`.
- Test progress bar at `currentIdx = N-1` yields `100%`.
- Test all 10 reformatted `projectInterviewQuestions` entries have the correct runtime field values.

### Property-Based Tests

- **Property 3/5 (null guard)**: Generate random `InterviewQuestion` objects where `interviewAnswer` is `undefined` or `''`; assert green panel is never rendered on either page.
- **Property 4/6 (preservation)**: Generate random `InterviewQuestion` objects where `interviewAnswer` is a non-empty string (min length 1); assert green panel always renders with the correct content on both pages.
- **Property 8 (progress bar)**: For any `currentIdx` in `[0, N-1]` and any session length `N` in `[1, 20]`, assert `progressWidth === ((currentIdx + 1) / N) * 100`.
- **Property 2 (data values)**: For each of the 10 reformatted entries, assert runtime property values equal their string constants (covers regression from syntax change).

### Integration Tests

- Full mock interview flow with a session that includes questions with and without `interviewAnswer` — verify no `undefined` text appears at any point.
- Full rapid revision flow with a deck that includes questions with and without `interviewAnswer` — verify no `undefined` text appears.
- Practice page renders with all questions — verify no ESLint or TypeScript errors, all icons display.
- `npm install` with fixed `package.json` resolves to a `0.x` version of `lucide-react` with all required exports intact.
