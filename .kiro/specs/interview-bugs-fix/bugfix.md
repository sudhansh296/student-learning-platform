# Bugfix Requirements Document

## Introduction

This document covers seven bugs found in the `webdev-atlas` Next.js learning platform. The bugs span four concern areas: malformed data syntax in an interview question data file, missing null guards causing `undefined` to render as visible text in the UI, unused icon imports that violate lint rules, and a phantom npm package version that does not exist in the public registry. Fixing all seven issues will eliminate runtime rendering defects, resolve lint violations, restore syntactic consistency across the question data, and pin the project to a real, installable package version.

---

## Bug Analysis

---

### Bug 1 — Malformed JSON-style syntax in `project-questions.ts`

#### Current Behavior (Defect)

1.1 WHEN the TypeScript compiler or bundler processes `src/data/interview/project-questions.ts` THEN the system encounters approximately 10 object literals (starting at `proj-caching-strategy`, around line 1135) that use JSON syntax — quoted property keys such as `"id": "proj-caching-strategy"` — instead of valid TypeScript object literal syntax, causing a type inconsistency across the `InterviewQuestion[]` array.

1.2 WHEN a developer reads the file THEN the system presents two inconsistent styles in the same array: unquoted-key TS object literals for the first ~20 entries and double-quoted JSON-style objects for the remaining ~10 entries, making the file harder to maintain and prone to future copy-paste errors.

#### Expected Behavior (Correct)

2.1 WHEN the TypeScript compiler processes `src/data/interview/project-questions.ts` THEN the system SHALL compile the file without syntax inconsistencies, with every object in the `projectInterviewQuestions` array using TypeScript object literal syntax (unquoted property keys, single-quoted string values).

2.2 WHEN a developer reads the file THEN the system SHALL present a single, consistent object literal style throughout the entire array, matching the style used in all sibling question files.

#### Unchanged Behavior (Regression Prevention)

3.1 WHEN `getQuestionsByCategory('project')` is called THEN the system SHALL CONTINUE TO return all project-category questions, including the 10 previously malformed entries, with the same runtime values.

3.2 WHEN the interview pages render project category questions THEN the system SHALL CONTINUE TO display question content (text, code examples, tags, follow-up questions) identically to the pre-fix state.

---

### Bug 2 — `interviewAnswer` rendered without null guard in Mock Interview page

#### Current Behavior (Defect)

2.1 WHEN a session question has `interviewAnswer` set to `undefined` and the user reveals the answer on the Mock Interview page (`src/app/interview/mock/page.tsx`) THEN the system renders the literal text `undefined` inside the green "Ideal Interview Answer" box.

2.2 WHEN any `InterviewQuestion` object has no `interviewAnswer` field (the field is typed as optional `interviewAnswer?: string`) THEN the system unconditionally renders `{current.question.interviewAnswer}` without checking for truthiness, producing visible broken UI.

#### Expected Behavior (Correct)

2.1 WHEN `current.question.interviewAnswer` is `undefined` or an empty string on the Mock Interview page THEN the system SHALL NOT render the "Ideal Interview Answer" section at all.

2.2 WHEN `current.question.interviewAnswer` contains a non-empty string THEN the system SHALL render the green answer box with that string, unchanged from today's happy-path behaviour.

#### Unchanged Behavior (Regression Prevention)

3.1 WHEN a question has a defined, non-empty `interviewAnswer` THEN the system SHALL CONTINUE TO display the "Ideal Interview Answer" block in the green panel during a mock interview session.

3.2 WHEN all other revealed-answer sections (Short Answer, Common Mistakes, self-rating buttons) are rendered THEN the system SHALL CONTINUE TO display them regardless of the presence or absence of `interviewAnswer`.

---

### Bug 3 — `interviewAnswer` rendered without null guard in Rapid Revision page

#### Current Behavior (Defect)

3.1 WHEN a session card question has `interviewAnswer` set to `undefined` and the user reveals the answer on the Rapid Revision page (`src/app/interview/rapid-revision/page.tsx`) THEN the system renders the literal text `undefined` inside the green "How to say it in an interview" panel.

3.2 WHEN the green panel is unconditionally rendered regardless of `currentCard.question.interviewAnswer` truthiness THEN the system displays a broken panel with no meaningful content for questions that omit this optional field.

#### Expected Behavior (Correct)

3.1 WHEN `currentCard.question.interviewAnswer` is `undefined` or an empty string on the Rapid Revision page THEN the system SHALL NOT render the green "How to say it in an interview" panel.

3.2 WHEN `currentCard.question.interviewAnswer` is a non-empty string THEN the system SHALL render the green panel with that content, unchanged from today's happy-path behaviour.

#### Unchanged Behavior (Regression Prevention)

3.3 WHEN a card question has a defined, non-empty `interviewAnswer` THEN the system SHALL CONTINUE TO display the "How to say it in an interview" panel in the green box on the Rapid Revision page.

3.4 WHEN the Short Answer panel is rendered in the Rapid Revision revealed state THEN the system SHALL CONTINUE TO display it unconditionally, since `shortAnswer` is a required field on `InterviewQuestion`.

---

### Bug 4 — `ChevronDown` unused import in `InterviewQuestionList.tsx`

#### Current Behavior (Defect)

4.1 WHEN ESLint processes `src/components/interview/InterviewQuestionList.tsx` THEN the system reports a `no-unused-vars` / `@typescript-eslint/no-unused-vars` violation for `ChevronDown`, which is imported from `lucide-react` on line 4 but never referenced anywhere in the component file.

#### Expected Behavior (Correct)

4.1 WHEN ESLint processes `src/components/interview/InterviewQuestionList.tsx` THEN the system SHALL report no unused-variable violations related to `lucide-react` imports.

4.2 WHEN the file is compiled THEN the system SHALL import only the icons that are actually used: `Eye`, `Code2`, `Lightbulb`, `AlertTriangle`, and `CheckCircle2`.

#### Unchanged Behavior (Regression Prevention)

4.3 WHEN `InterviewQuestionList` renders a question card THEN the system SHALL CONTINUE TO display the Eye, Code2, Lightbulb, AlertTriangle, and CheckCircle2 icons exactly as before.

---

### Bug 5 — `ChevronDown` and `ChevronUp` unused imports in `practice/page.tsx`

#### Current Behavior (Defect)

5.1 WHEN ESLint processes `src/app/interview/practice/page.tsx` THEN the system reports `no-unused-vars` violations for both `ChevronDown` and `ChevronUp`, which are imported from `lucide-react` on line 5 but never referenced in the component tree.

#### Expected Behavior (Correct)

5.1 WHEN ESLint processes `src/app/interview/practice/page.tsx` THEN the system SHALL report no unused-variable violations related to `lucide-react` imports.

5.2 WHEN the file is compiled THEN the system SHALL import only the icons that are actually used: `Eye`, `Code2`, `Lightbulb`, `AlertTriangle`, `CheckCircle2`, and `ArrowLeft`.

#### Unchanged Behavior (Regression Prevention)

5.3 WHEN the Practice page renders question cards THEN the system SHALL CONTINUE TO display all currently used icons (Eye, Code2, Lightbulb, AlertTriangle, CheckCircle2, ArrowLeft) exactly as before.

---

### Bug 6 — Progress bar never reaches 100% during a Mock Interview session

#### Current Behavior (Defect)

6.1 WHEN a user starts a Mock Interview session and is on the first question (`currentIdx = 0`) THEN the system renders the progress bar at 0% width, giving no visual indication that the session has begun.

6.2 WHEN a user is on the last question of an 8-question session (`currentIdx = 7`) THEN the system renders the progress bar at 87.5% — it never reaches 100% while the session mode is `'session'`; 100% is only reached after the mode switches to `'results'`.

#### Expected Behavior (Correct)

6.1 WHEN a user is on question N of a session THEN the system SHALL render the progress bar at `((currentIdx + 1) / session.length) * 100` percent, so question 1 shows ~12.5% (for an 8-question session) and the final question shows 100%.

6.2 WHEN the formula is `((currentIdx + 1) / session.length) * 100` THEN the system SHALL reflect "you are currently answering question N out of total", providing a complete 0–100% fill that matches user expectation.

#### Unchanged Behavior (Regression Prevention)

6.3 WHEN the mode transitions from `'session'` to `'results'` THEN the system SHALL CONTINUE TO hide the progress bar and render the results screen, unaffected by the formula change.

6.4 WHEN the question index counter `{currentIdx + 1} / {session.length}` is displayed in the top bar THEN the system SHALL CONTINUE TO show the correct human-readable position unchanged.

---

### Bug 7 — `lucide-react` version `^1.31.0` does not exist in the npm registry

#### Current Behavior (Defect)

7.1 WHEN `npm install` is run on the project THEN the system resolves `lucide-react` to version `1.31.0`, a version that does not exist in the official npm registry for the `lucide-react` package (all official releases are in the `0.x` range), meaning the installed package comes from an unexpected source or resolution path.

7.2 WHEN a new developer clones the project and runs `npm install` THEN the system may fail to install `lucide-react` at the specified semver range `^1.31.0` from the official registry, or silently install an unintended package.

#### Expected Behavior (Correct)

7.1 WHEN `npm install` is run on the project THEN the system SHALL resolve `lucide-react` to the latest stable release in the official `0.x` range (e.g. `^0.460.0` or the version already locked in `package-lock.json`).

7.2 WHEN `package.json` specifies the corrected version THEN the system SHALL install a package from the official `lucide-react` npm registry entry, ensuring all icons used in the project are available and the installed API matches the code.

#### Unchanged Behavior (Regression Prevention)

7.3 WHEN the corrected version is installed THEN the system SHALL CONTINUE TO export all icon components referenced in the codebase (`Eye`, `Code2`, `Lightbulb`, `AlertTriangle`, `CheckCircle2`, `ArrowLeft`, `ChevronRight`, `BarChart2`, `Clock`, `Target`, `Play`, `Users`, `XCircle`, `RotateCcw`, and all others currently imported) without breaking any existing import statements.

7.4 WHEN the project is built with the corrected `lucide-react` version THEN the system SHALL CONTINUE TO render all icon components visually identically to the current behaviour.
