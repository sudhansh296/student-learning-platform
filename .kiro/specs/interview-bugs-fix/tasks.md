# Implementation Plan

- [x] 1. Write bug condition exploration tests
  - **Property 1: Bug Condition** - Null Guard & Progress Bar Defects
  - **CRITICAL**: These tests MUST FAIL on unfixed code — failure confirms the bugs exist
  - **DO NOT attempt to fix the tests or the code when they fail**
  - **NOTE**: These tests encode expected behavior — they will validate the fixes when they pass after implementation
  - **GOAL**: Surface counterexamples that demonstrate each bug exists
  - **Scoped PBT Approach**: Scope each property to the concrete failing cases for reproducibility
  - Test Bug 2 (Mock Interview null guard): render MockInterviewPage with a session question where `interviewAnswer` is `undefined`; assert the rendered DOM does NOT contain the text `"undefined"` inside the green "Ideal Interview Answer" panel — this encodes the Bug Condition `isBugCondition(question): question.interviewAnswer === undefined || question.interviewAnswer === ''` and Expected Behavior `NOT contains(result.dom, 'undefined') AND NOT contains(result.dom, greenPanel)`
  - Test Bug 3 (Rapid Revision null guard): render the RapidRevision revealed-answer section with `currentCard.question.interviewAnswer === undefined`; assert the green "How to say it in an interview" panel is absent from the rendered output — same isBugCondition as Bug 2
  - Test Bug 6 (Progress bar off-by-one): render MockInterviewPage in session mode at `currentIdx = 0` (session length 8) and assert progress bar width > 0%; render at `currentIdx = 7` and assert progress bar width equals 100% — encodes Bug Condition `(currentIdx / session.length) * 100 !== ((currentIdx + 1) / session.length) * 100`
  - Run all three tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests FAIL — Bug 2 counterexample: text `"undefined"` appears in DOM; Bug 3 counterexample: panel renders with `undefined` as text content; Bug 6 counterexample: first question shows `0%` and last shows `87.5%` instead of `100%`
  - Document all counterexamples found to confirm root cause
  - Mark task complete when tests are written, run, and failures are documented
  - _Requirements: 2.1, 2.2 (Bug 2), 3.1, 3.2 (Bug 3), 6.1, 6.2 (Bug 6)_

- [x] 2. Write preservation property tests (BEFORE implementing fixes)
  - **Property 2: Preservation** - Defined interviewAnswer Still Renders & Non-Bug-Condition Progress Values
  - **IMPORTANT**: Follow observation-first methodology — run UNFIXED code with non-buggy inputs first, observe actual outputs, then write tests asserting those observed outputs
  - Observe (Bug 2 & 3 preservation): render both pages with a question where `interviewAnswer` is a non-empty string (isBugCondition returns false); confirm the green panel renders with the correct content on unfixed code
  - Write property-based test: for all `InterviewQuestion` objects where `interviewAnswer` is a non-empty string (min length 1), the green "Ideal Interview Answer" panel (Mock Interview) SHALL render with that string
  - Write property-based test: for all `InterviewQuestion` objects where `interviewAnswer` is a non-empty string, the green "How to say it in an interview" panel (Rapid Revision) SHALL render with that string
  - Write property-based test: for all `InterviewQuestion` objects (with or without `interviewAnswer`), the Short Answer panel in the Rapid Revision revealed state SHALL always render (since `shortAnswer` is a required field — isBugCondition returns false for Short Answer)
  - Observe (Bug 6 preservation): render the results screen with `mode === 'results'`; confirm it renders correctly and progress bar is absent
  - Write test: `mode === 'results'` renders results screen and no progress bar
  - Run all preservation tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS — confirms baseline behavior to preserve
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2 (Bug 2), 3.3, 3.4 (Bug 3), 6.3, 6.4 (Bug 6)_

- [x] 3. Fix Bug 1 — Reformat JSON-style object literals in `project-questions.ts`

  - [x] 3.1 Convert 10 JSON-style entries to TypeScript object literal syntax
    - File: `src/data/interview/project-questions.ts`
    - Batch 4 entries: `proj-caching-strategy`, `proj-git-workflow`, `proj-responsive-design`, `proj-logging-monitoring`, `proj-refactor-improvements`
    - Batch 5 entries: `proj-data-validation`, `proj-scalability-architecture`, `proj-ci-cd-pipeline`, `proj-monolith-vs-microservices`, `proj-concurrency-race-conditions`
    - Unquote all top-level property keys: `"id":` → `id:`, `"category":` → `category:`, `"tags":` → `tags:`, etc.
    - Convert double-quoted scalar string values to single-quoted: `"project"` → `'project'`
    - Convert double-quoted array element strings to single-quoted: `["caching", "redis"]` → `['caching', 'redis']`
    - Preserve all nested `example.code` template literal content exactly — only change the outer quote style, never the inner content
    - Align opening `{` indentation with the surrounding array entries
    - **Preserve all runtime data values** — only syntax style changes, no content changes
    - _Bug_Condition: isBugCondition(entry): entry uses double-quoted property keys while sibling entries use unquoted keys_
    - _Expected_Behavior: every object in projectInterviewQuestions uses unquoted property keys with single-quoted string values_
    - _Preservation: all 30 project-category questions return identical runtime values from getQuestionsByCategory('project')_
    - _Requirements: 2.1, 2.2, 3.1, 3.2 (Bug 1)_

  - [x] 3.2 Verify Bug 1 correctness properties
    - **Property 1: Expected Behavior** - Consistent TypeScript Object Literal Syntax
    - **IMPORTANT**: Re-run the SAME tests / checks from task 1 — do NOT write new tests
    - Run TypeScript compiler on `project-questions.ts` — assert no syntax errors
    - Assert all 10 reformatted entries have the correct runtime field values (id, category, tags, etc.) matching their original string constants
    - **EXPECTED OUTCOME**: Compiler passes; runtime values match expected constants (confirms Bug 1 is fixed)
    - _Requirements: 2.1, 2.2, 3.1, 3.2 (Bug 1)_

- [x] 4. Fix Bug 2 — Add null guard for `interviewAnswer` in `mock/page.tsx`

  - [x] 4.1 Wrap the "Ideal Interview Answer" div in a conditional
    - File: `src/app/interview/mock/page.tsx`
    - Change the unconditional render of the green panel to: `{current.question.interviewAnswer && (<div ...>...</div>)}`
    - The Short Answer, Common Mistakes, and self-rating button sections are NOT to be changed
    - _Bug_Condition: isBugCondition(question): question.interviewAnswer === undefined || question.interviewAnswer === ''_
    - _Expected_Behavior: green "Ideal Interview Answer" panel is absent when interviewAnswer is undefined or empty_
    - _Preservation: panel renders with correct content when interviewAnswer is a non-empty string; Short Answer and Common Mistakes always render when current.revealed is true_
    - _Requirements: 2.1, 2.2, 3.1, 3.2 (Bug 2)_

  - [x] 4.2 Verify Bug 2 exploration test now passes
    - **Property 1: Expected Behavior** - interviewAnswer Null Guard (Mock Interview)
    - **IMPORTANT**: Re-run the SAME test from task 1 — do NOT write a new test
    - Run the Mock Interview null guard test from step 1
    - **EXPECTED OUTCOME**: Test PASSES — DOM no longer contains `"undefined"`, green panel is absent when interviewAnswer is undefined or empty (confirms Bug 2 is fixed)
    - _Requirements: 2.1, 2.2 (Bug 2)_

  - [x] 4.3 Verify Bug 2 preservation tests still pass
    - **Property 2: Preservation** - Defined interviewAnswer Still Renders (Mock Interview)
    - **IMPORTANT**: Re-run the SAME tests from task 2 — do NOT write new tests
    - Run the preservation property tests for Mock Interview from step 2
    - **EXPECTED OUTCOME**: Tests PASS — green panel still renders correctly for non-empty interviewAnswer; no regressions in Short Answer or Common Mistakes sections

- [x] 5. Fix Bug 3 — Add null guard for `interviewAnswer` in `rapid-revision/page.tsx`

  - [x] 5.1 Wrap the "How to say it in an interview" div in a conditional
    - File: `src/app/interview/rapid-revision/page.tsx`
    - Change the unconditional render of the green panel to: `{currentCard.question.interviewAnswer && (<div ...>...</div>)}`
    - The Short Answer panel and all other session UI are NOT to be changed
    - _Bug_Condition: isBugCondition(question): question.interviewAnswer === undefined || question.interviewAnswer === ''_
    - _Expected_Behavior: green "How to say it in an interview" panel is absent when interviewAnswer is undefined or empty_
    - _Preservation: panel renders with correct content when interviewAnswer is a non-empty string; Short Answer panel always renders unconditionally since shortAnswer is a required field_
    - _Requirements: 3.1, 3.2, 3.3, 3.4 (Bug 3)_

  - [x] 5.2 Verify Bug 3 exploration test now passes
    - **Property 1: Expected Behavior** - interviewAnswer Null Guard (Rapid Revision)
    - **IMPORTANT**: Re-run the SAME test from task 1 — do NOT write a new test
    - Run the Rapid Revision null guard test from step 1
    - **EXPECTED OUTCOME**: Test PASSES — green panel is absent when interviewAnswer is undefined or empty (confirms Bug 3 is fixed)
    - _Requirements: 3.1, 3.2 (Bug 3)_

  - [x] 5.3 Verify Bug 3 preservation tests still pass
    - **Property 2: Preservation** - Defined interviewAnswer Still Renders (Rapid Revision)
    - **IMPORTANT**: Re-run the SAME tests from task 2 — do NOT write new tests
    - Run the preservation property tests for Rapid Revision from step 2
    - **EXPECTED OUTCOME**: Tests PASS — green panel still renders correctly for non-empty interviewAnswer; Short Answer panel still renders unconditionally; no regressions

- [x] 6. Fix Bugs 4 & 5 — Remove unused icon imports

  - [x] 6.1 Remove unused `ChevronDown` import from `InterviewQuestionList.tsx`
    - File: `src/components/interview/InterviewQuestionList.tsx`
    - Change: `import { Eye, Code2, Lightbulb, AlertTriangle, CheckCircle2, ChevronDown } from 'lucide-react';`
    - To: `import { Eye, Code2, Lightbulb, AlertTriangle, CheckCircle2 } from 'lucide-react';`
    - _Bug_Condition: isBugCondition(importStatement): importStatement.name === 'ChevronDown' AND countUsages('ChevronDown', fileAst) === 0_
    - _Expected_Behavior: ESLint reports no no-unused-vars violations for lucide-react imports in this file_
    - _Preservation: Eye, Code2, Lightbulb, AlertTriangle, CheckCircle2 icons continue to render identically in question cards_
    - _Requirements: 4.1, 4.2, 4.3 (Bug 4)_

  - [x] 6.2 Remove unused `ChevronDown` and `ChevronUp` imports from `practice/page.tsx`
    - File: `src/app/interview/practice/page.tsx`
    - Change: `import { ChevronDown, ChevronUp, Eye, Code2, Lightbulb, AlertTriangle, CheckCircle2, ArrowLeft } from 'lucide-react';`
    - To: `import { Eye, Code2, Lightbulb, AlertTriangle, CheckCircle2, ArrowLeft } from 'lucide-react';`
    - _Bug_Condition: isBugCondition(importStatement): importStatement.name IN ['ChevronDown', 'ChevronUp'] AND countUsages(importStatement.name, fileAst) === 0_
    - _Expected_Behavior: ESLint reports no no-unused-vars violations for lucide-react imports in this file_
    - _Preservation: Eye, Code2, Lightbulb, AlertTriangle, CheckCircle2, ArrowLeft icons continue to render identically in the Practice page_
    - _Requirements: 5.1, 5.2, 5.3 (Bug 5)_

  - [x] 6.3 Verify no unused-import lint violations remain
    - **Property 1: Expected Behavior** - No Unused lucide-react Imports
    - Run ESLint on `src/components/interview/InterviewQuestionList.tsx` and `src/app/interview/practice/page.tsx`
    - **EXPECTED OUTCOME**: Zero `no-unused-vars` / `@typescript-eslint/no-unused-vars` violations for lucide-react named imports in both files (confirms Bugs 4 & 5 are fixed)
    - _Requirements: 4.1, 5.1_

- [x] 7. Fix Bug 6 — Correct progress bar formula in `mock/page.tsx`

  - [x] 7.1 Update the `progress` constant to use `currentIdx + 1`
    - File: `src/app/interview/mock/page.tsx`
    - Change: `const progress = ((currentIdx) / session.length) * 100;`
    - To: `const progress = ((currentIdx + 1) / session.length) * 100;`
    - The question counter `{currentIdx + 1} / {session.length}` in the top bar is already correct — do NOT change it
    - _Bug_Condition: isBugCondition(state): (currentIdx / session.length) * 100 produces 0% on first question and (N-1)/N*100% on last question_
    - _Expected_Behavior: progress = ((currentIdx + 1) / session.length) * 100; question 1 of 8 shows 12.5%, last question shows 100%_
    - _Preservation: results screen renders when mode === 'results'; progress bar is absent in results mode; question counter shows correct human-readable position_
    - _Requirements: 6.1, 6.2, 6.3, 6.4 (Bug 6)_

  - [x] 7.2 Verify Bug 6 exploration test now passes
    - **Property 1: Expected Behavior** - Progress Bar Formula
    - **IMPORTANT**: Re-run the SAME test from task 1 — do NOT write a new test
    - Run the progress bar off-by-one test from step 1
    - **EXPECTED OUTCOME**: Test PASSES — first question shows > 0% and last question shows 100% (confirms Bug 6 is fixed)
    - _Requirements: 6.1, 6.2 (Bug 6)_

  - [x] 7.3 Verify Bug 6 preservation tests still pass
    - **Property 2: Preservation** - Results Screen & Question Counter Unaffected
    - **IMPORTANT**: Re-run the SAME tests from task 2 — do NOT write new tests
    - Run the preservation tests for Bug 6 from step 2
    - **EXPECTED OUTCOME**: Tests PASS — results screen renders correctly; progress bar absent in results mode; question counter unchanged

- [x] 8. Fix Bug 7 — Correct `lucide-react` version in `package.json`

  - [x] 8.1 Update `lucide-react` semver range to `^0.460.0`
    - File: `package.json`
    - Change: `"lucide-react": "^1.31.0"`
    - To: `"lucide-react": "^0.460.0"`
    - _Bug_Condition: isBugCondition(packageSpec): semverMajor(packageSpec) >= 1 AND officialRegistryMaxVersion('lucide-react') < '1.0.0'_
    - _Expected_Behavior: npm install resolves lucide-react to a version in the official 0.x range from the npm registry_
    - _Preservation: all icon components referenced in the codebase (Eye, Code2, Lightbulb, AlertTriangle, CheckCircle2, ArrowLeft, ChevronRight, BarChart2, Clock, Target, Play, Users, XCircle, RotateCcw, Zap, RefreshCw, BookOpen, Trophy) remain available and render identically_
    - _Requirements: 7.1, 7.2, 7.3, 7.4 (Bug 7)_

  - [x] 8.2 Run `npm install` to regenerate `package-lock.json`
    - Run `npm install` in the project root after updating `package.json`
    - Verify `npm ls lucide-react` reports a version in the `0.x` range
    - Verify no install errors for the resolved `lucide-react` version
    - _Requirements: 7.1, 7.2 (Bug 7)_

  - [x] 8.3 Verify all icon exports are available in the installed version
    - Run `npm run build` (or TypeScript type-check) to confirm no import errors for any lucide-react icons used in the codebase
    - **EXPECTED OUTCOME**: Build completes without icon-related import errors (confirms Bug 7 is fixed and no icon regressions)
    - _Requirements: 7.3, 7.4 (Bug 7)_

- [x] 9. Checkpoint — Ensure all tests pass
  - Run the full test suite: `npm test` (or equivalent)
  - Run ESLint across the project: `npm run lint`
  - Run TypeScript type-check: `npx tsc --noEmit`
  - Confirm all exploration tests (Property 1 checks) PASS after fixes
  - Confirm all preservation tests (Property 2 checks) PASS with no regressions
  - Confirm no `no-unused-vars` lint violations in any modified file
  - Confirm `lucide-react` resolves to a `0.x` version
  - Confirm the TypeScript compiler processes `project-questions.ts` without syntax inconsistencies
  - Ask the user if any questions arise before closing the spec
