# Bugfix Requirements Document

## Introduction

This document covers seven bugs found across the webdev-atlas Next.js project. The bugs span UI components, page routing, exercise interaction, code rendering, and TypeScript type coverage. Each bug has been confirmed against the current source code. Bug 7 (hardcoded project count in `ProjectsPreview.tsx`) was assessed as accurate and out of scope for this fix cycle.

---

## Bug 1 — Debug `console.log` in `ThemeToggle.tsx`

### Bug Analysis

#### Current Behavior (Defect)

1.1 WHEN a user clicks the theme toggle button THEN the system prints `'Theme toggle clicked. Current: <theme>'` to the browser console on every click.

1.2 WHEN the application is running in a production build THEN the system leaks internal implementation details (current theme value) to the browser developer console.

#### Expected Behavior (Correct)

2.1 WHEN a user clicks the theme toggle button THEN the system SHALL switch the theme between `'light'` and `'dark'` without producing any console output.

2.2 WHEN the application is running in production THEN the system SHALL NOT emit any debug log statements related to theme switching.

#### Unchanged Behavior (Regression Prevention)

3.1 WHEN a user clicks the theme toggle button THEN the system SHALL CONTINUE TO toggle the active theme between light and dark mode.

3.2 WHEN the component mounts THEN the system SHALL CONTINUE TO prevent a hydration mismatch by rendering a placeholder until mounted.

---

## Bug 2 — `LearnPage` missing special-case routing for HTML, CSS, and JavaScript

### Bug Analysis

**File:** `src/app/learn/page.tsx`

#### Current Behavior (Defect)

2.1 WHEN a user clicks the HTML technology card on the Learn page THEN the system navigates to `/learn/html`, which does not exist as a root page (the route is `/html/[lesson]`), resulting in a 404 or missing page.

2.2 WHEN a user clicks the CSS technology card on the Learn page THEN the system navigates to `/learn/css`, which does not exist as a root page (the route is `/css/[lesson]`), resulting in a 404 or missing page.

2.3 WHEN a user clicks the JavaScript technology card on the Learn page THEN the system navigates to `/learn/javascript`, which does not exist as a root page (the route is `/js/[lesson]`), resulting in a 404 or missing page.

#### Expected Behavior (Correct)

2.4 WHEN a user clicks the HTML technology card on the Learn page THEN the system SHALL navigate to `/html`.

2.5 WHEN a user clicks the CSS technology card on the Learn page THEN the system SHALL navigate to `/css`.

2.6 WHEN a user clicks the JavaScript technology card on the Learn page THEN the system SHALL navigate to `/js`.

2.7 WHEN a user clicks any other technology card (e.g., TypeScript, React, Node.js) on the Learn page THEN the system SHALL navigate to `/learn/${tech.slug}` as before.

#### Unchanged Behavior (Regression Prevention)

3.1 WHEN a user clicks the TypeScript technology card on the Learn page THEN the system SHALL CONTINUE TO navigate to `/learn/typescript`.

3.2 WHEN a user clicks any non-special-cased technology card on the Learn page THEN the system SHALL CONTINUE TO navigate to `/learn/${tech.slug}`.

3.3 WHEN the Learn page renders THEN the system SHALL CONTINUE TO display technologies grouped by category with their name, logo, and topic count.

---

## Bug 3 — `TechnologiesPage` missing special-case routing for CSS and JavaScript

### Bug Analysis

**File:** `src/app/technologies/page.tsx`

#### Current Behavior (Defect)

3.1 WHEN a user clicks the CSS technology card on the Technologies page THEN the system navigates to `/learn/css`, which does not exist as a root page, resulting in a 404 or missing page.

3.2 WHEN a user clicks the JavaScript technology card on the Technologies page THEN the system navigates to `/learn/javascript`, which does not exist as a root page, resulting in a 404 or missing page.

#### Expected Behavior (Correct)

3.3 WHEN a user clicks the CSS technology card on the Technologies page THEN the system SHALL navigate to `/css`.

3.4 WHEN a user clicks the JavaScript technology card on the Technologies page THEN the system SHALL navigate to `/js`.

3.5 WHEN a user clicks the HTML technology card on the Technologies page THEN the system SHALL navigate to `/html` (already correct, must be preserved).

3.6 WHEN a user clicks any other technology card on the Technologies page THEN the system SHALL navigate to `/learn/${tech.slug}`.

#### Unchanged Behavior (Regression Prevention)

3.7 WHEN a user clicks the HTML technology card on the Technologies page THEN the system SHALL CONTINUE TO navigate to `/html`.

3.8 WHEN a user clicks any non-special-cased technology card on the Technologies page THEN the system SHALL CONTINUE TO navigate to `/learn/${tech.slug}`.

3.9 WHEN the Technologies page renders THEN the system SHALL CONTINUE TO display technologies grouped by category with their difficulty badge and topic count.

---

## Bug 4 — `ExerciseBlock.tsx` fill-blank "Check" button captures no input

### Bug Analysis

**File:** `src/components/docs/ExerciseBlock.tsx`

#### Current Behavior (Defect)

4.1 WHEN a user types an answer into a `fill-blank` exercise input and clicks the "Check" button THEN the system performs a DOM query for `[data-ex="${ex.id}"]` that always returns `null` because the `data-ex` attribute is never applied to the input element.

4.2 WHEN a user clicks the "Check" button on a `fill-blank` exercise THEN the system records `(answers[ex.id] as string) || ''`, which is the previously stored answer (or an empty string), rather than the text the user has currently typed into the input field.

4.3 WHEN a user clicks "Check" on a `fill-blank` exercise after typing a correct answer THEN the system always marks the answer as incorrect because the submitted value is always empty (the first time).

#### Expected Behavior (Correct)

4.4 WHEN a user clicks the "Check" button on a `fill-blank` exercise THEN the system SHALL read the current value from the `<input>` element that immediately precedes the button (via `e.currentTarget.previousElementSibling`) and record that trimmed value as the submitted answer.

4.5 WHEN a user types a correct answer and clicks "Check" THEN the system SHALL correctly evaluate the submitted value against `ex.correct` and mark the exercise as correct.

4.6 WHEN a user clicks "Check" on a `fill-blank` exercise THEN the system SHALL NOT reference the dead `inp` variable or perform any `document.querySelector` call with `[data-ex]`.

#### Unchanged Behavior (Regression Prevention)

3.1 WHEN a user presses Enter while focused in a `fill-blank` exercise input THEN the system SHALL CONTINUE TO submit the current input value as the answer (the `onKeyDown` handler is already correct and must not change).

3.2 WHEN a user types in a `fill-blank` exercise input THEN the system SHALL CONTINUE TO update the controlled input state via `onChange` in real time.

3.3 WHEN a user selects an option in a `multiple-choice` exercise THEN the system SHALL CONTINUE TO record and evaluate answers correctly.

3.4 WHEN a user clicks "Check" in a `code-output` exercise THEN the system SHALL CONTINUE TO read the value from `e.currentTarget.previousSibling` (the working pattern must remain unchanged).

---

## Bug 5 — `renderSyntax` in `CodeBlock.tsx` collapses blank lines

### Bug Analysis

**File:** `src/components/docs/CodeBlock.tsx`

#### Current Behavior (Defect)

5.1 WHEN a code snippet contains a blank line (empty string after splitting on `\n`) THEN the system returns the newline character `'\n'` from `renderSyntax`, which is collapsed by the browser's HTML rendering, causing the blank line row to have no visible height.

5.2 WHEN a code snippet is rendered with blank lines THEN the system displays the code without the blank line spacing present in the original source, making the code harder to read.

5.3 WHEN the `renderSyntax` function is called with a non-empty line and any language value THEN the system uses the `lang` parameter, which triggers an unused-variable lint warning because the function body does not use `lang`.

#### Expected Behavior (Correct)

5.4 WHEN a code snippet contains a blank line THEN the system SHALL return a non-breaking space character (`\u00A0`) from `renderSyntax` so the wrapping `<div>` row retains its line height and the blank line is visually preserved.

5.5 WHEN `renderSyntax` is defined THEN the system SHALL name the language parameter `_lang` to signal intentional non-use and suppress the lint warning.

#### Unchanged Behavior (Regression Prevention)

3.1 WHEN a code snippet contains a non-empty line THEN the system SHALL CONTINUE TO return that line's text content unchanged from `renderSyntax`.

3.2 WHEN a code block is rendered THEN the system SHALL CONTINUE TO display each line in its own `<div>` row with optional line numbers.

3.3 WHEN a code block has more than 20 lines THEN the system SHALL CONTINUE TO truncate the display with an expand button.

---

## Bug 6 — `InlinePlayground.tsx` overly broad ESLint disable comment

### Bug Analysis

**File:** `src/components/docs/InlinePlayground.tsx`

#### Current Behavior (Defect)

6.1 WHEN the `InlinePlayground` component source is linted THEN the system suppresses ALL ESLint rules on the `useEffect(() => { run(); }, []);` line due to the broad `// eslint-disable-line` comment with no rule name specified.

6.2 WHEN the broad disable comment is present THEN the system may silently hide other unrelated lint violations on that line in addition to the intentional `react-hooks/exhaustive-deps` suppression.

#### Expected Behavior (Correct)

6.3 WHEN the initial-run `useEffect` intentionally omits `run` from its dependency array THEN the system SHALL suppress only the specific rule `react-hooks/exhaustive-deps` using the comment `// eslint-disable-line react-hooks/exhaustive-deps`.

6.4 WHEN any other ESLint rule applies to that line THEN the system SHALL still report those violations (they are no longer blanket-suppressed).

#### Unchanged Behavior (Regression Prevention)

3.1 WHEN the `InlinePlayground` component mounts THEN the system SHALL CONTINUE TO call `run()` exactly once to render the initial preview.

3.2 WHEN a user edits code and clicks "Run" THEN the system SHALL CONTINUE TO re-render the preview iframe with the updated code.

3.3 WHEN the `run` callback changes due to updated `html`, `css`, or `js` state THEN the system SHALL CONTINUE TO use the latest values when the user manually triggers a run.

---

## Bug 7 — `Roadmap` type missing `icon`, `color`, and `steps` fields

### Bug Analysis

**File:** `src/lib/types.ts`

#### Current Behavior (Defect)

7.1 WHEN TypeScript compiles the `RoadmapsSection` component (`src/components/home/RoadmapsSection.tsx`) THEN the system accesses `rm.icon`, `rm.color`, and `rm.steps` on objects of type `Roadmap`, which does not declare these fields, causing implicit `any` or TypeScript errors depending on strict mode.

7.2 WHEN TypeScript compiles `src/app/roadmaps/page.tsx` THEN the system accesses `roadmap.icon`, `roadmap.color`, and `roadmap.steps` on the `Roadmap` type, which are absent from the interface definition.

7.3 WHEN TypeScript compiles `src/app/roadmaps/[slug]/page.tsx` THEN the system accesses `roadmap.icon`, `roadmap.color`, and `roadmap.steps` on the `Roadmap` type, which are absent from the interface definition.

7.4 WHEN `roadmap.steps` is accessed at runtime and the field is not present on a data object THEN the system throws a runtime error on `roadmap.steps.map(...)` because `undefined` has no `.map` method.

#### Expected Behavior (Correct)

7.5 WHEN the `Roadmap` interface is defined in `src/lib/types.ts` THEN the system SHALL include optional fields `icon?: string`, `color?: string`, and `steps?: Array<{ phase: string; color: string }>` to match the fields accessed by all consuming components.

7.6 WHEN TypeScript compiles any file that accesses `roadmap.icon`, `roadmap.color`, or `roadmap.steps` THEN the system SHALL resolve those property accesses without type errors.

#### Unchanged Behavior (Regression Prevention)

3.1 WHEN code accesses `roadmap.id`, `roadmap.title`, `roadmap.slug`, `roadmap.description`, `roadmap.difficulty`, `roadmap.estimatedTime`, or `roadmap.nodes` THEN the system SHALL CONTINUE TO resolve those fields as required (non-optional) properties of the `Roadmap` type.

3.2 WHEN the `RoadmapNode` interface is used THEN the system SHALL CONTINUE TO provide `id`, `title`, `slug`, `technologyId`, `status`, and `children` fields unchanged.

---

## Bug Condition Summary

### Bug Condition Functions

```pascal
FUNCTION isBugCondition_1(X)
  INPUT: X is a ThemeToggle click event
  OUTPUT: boolean
  RETURN true  // Every click triggers the debug log — condition is always true
END FUNCTION

FUNCTION isBugCondition_2(X)
  INPUT: X is a technology card link href on the Learn page
  OUTPUT: boolean
  RETURN X.tech.id IN {'html', 'css', 'javascript'}
END FUNCTION

FUNCTION isBugCondition_3(X)
  INPUT: X is a technology card link href on the Technologies page
  OUTPUT: boolean
  RETURN X.tech.id IN {'css', 'javascript'}
END FUNCTION

FUNCTION isBugCondition_4(X)
  INPUT: X is a fill-blank Check button click event
  OUTPUT: boolean
  RETURN true  // Every click on a fill-blank Check button triggers the broken capture
END FUNCTION

FUNCTION isBugCondition_5(X)
  INPUT: X is a line string passed to renderSyntax
  OUTPUT: boolean
  RETURN X = ''  // Empty string (blank line in code)
END FUNCTION

FUNCTION isBugCondition_6(X)
  INPUT: X is the eslint-disable comment on the useEffect line
  OUTPUT: boolean
  RETURN X = '// eslint-disable-line'  // Broad disable with no rule name
END FUNCTION

FUNCTION isBugCondition_7(X)
  INPUT: X is a property access on a Roadmap object
  OUTPUT: boolean
  RETURN X.propertyName IN {'icon', 'color', 'steps'}
END FUNCTION
```

### Fix-Checking Properties

```pascal
// Property: Bug 1 — No console output on theme toggle
FOR ALL X WHERE isBugCondition_1(X) DO
  result ← handleThemeToggle'(X)
  ASSERT no_console_log_emitted(result)
END FOR

// Property: Bug 2 — Correct href for special-cased Learn page techs
FOR ALL X WHERE isBugCondition_2(X) DO
  href ← getLearnPageHref'(X.tech)
  ASSERT (X.tech.id = 'html'       => href = '/html') AND
         (X.tech.id = 'css'        => href = '/css')  AND
         (X.tech.id = 'javascript' => href = '/js')
END FOR

// Property: Bug 3 — Correct href for special-cased Technologies page techs
FOR ALL X WHERE isBugCondition_3(X) DO
  href ← getTechnologiesPageHref'(X.tech)
  ASSERT (X.tech.id = 'css'        => href = '/css') AND
         (X.tech.id = 'javascript' => href = '/js')
END FOR

// Property: Bug 4 — fill-blank Check captures current input value
FOR ALL X WHERE isBugCondition_4(X) DO
  inputValue ← X.currentTarget.previousElementSibling.value.trim()
  recordedAnswer ← handleFillBlankCheck'(X)
  ASSERT recordedAnswer = inputValue
END FOR

// Property: Bug 5 — Empty lines render with visible height
FOR ALL X WHERE isBugCondition_5(X) DO
  result ← renderSyntax'(X, lang)
  ASSERT result = '\u00A0'  // Non-breaking space preserves line height
END FOR

// Property: Bug 6 — ESLint disable comment is rule-specific
FOR ALL X WHERE isBugCondition_6(X) DO
  comment ← getDisableComment'(X)
  ASSERT comment = '// eslint-disable-line react-hooks/exhaustive-deps'
END FOR

// Property: Bug 7 — Roadmap type includes icon, color, steps
FOR ALL X WHERE isBugCondition_7(X) DO
  typeCheck ← compileRoadmapAccess'(X.propertyName)
  ASSERT typeCheck = no_type_error
END FOR
```

### Preservation Properties

```pascal
// Preservation: For all non-buggy inputs, fixed code behaves identically to original

// Bug 1
FOR ALL X WHERE NOT isBugCondition_1(X) DO
  ASSERT F(X) = F'(X)  // No other theme toggle behaviour changes
END FOR

// Bug 2
FOR ALL X WHERE NOT isBugCondition_2(X) DO
  ASSERT getLearnPageHref(X.tech) = getLearnPageHref'(X.tech)
END FOR

// Bug 3
FOR ALL X WHERE NOT isBugCondition_3(X) DO
  ASSERT getTechnologiesPageHref(X.tech) = getTechnologiesPageHref'(X.tech)
END FOR

// Bug 4
FOR ALL X WHERE NOT isBugCondition_4(X) DO
  // multiple-choice and code-output handlers are unchanged
  ASSERT F(X) = F'(X)
END FOR

// Bug 5
FOR ALL X WHERE NOT isBugCondition_5(X) DO
  ASSERT renderSyntax(X, lang) = renderSyntax'(X, _lang)
END FOR

// Bug 6
FOR ALL X WHERE NOT isBugCondition_6(X) DO
  ASSERT F(X) = F'(X)  // Runtime behaviour of the effect is unchanged
END FOR

// Bug 7
FOR ALL X WHERE NOT isBugCondition_7(X) DO
  ASSERT F(X) = F'(X)  // Required Roadmap fields remain required and unchanged
END FOR
```
