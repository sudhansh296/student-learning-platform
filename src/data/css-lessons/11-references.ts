import type { CssLesson } from '../css-curriculum';

export const cssReferencesLesson: CssLesson = {
  id: 'css-references',
  title: 'CSS References',
  slug: 'references',
  chapter: 'advanced',
  order: 11,
  difficulty: 'beginner',
  readingTime: 15,
  description: 'Complete CSS reference — selectors, box model, flexbox, grid, units, pseudo-classes, and common shorthand in one place.',
  sections: [
    // ── SELECTORS ──────────────────────────────────────────────
    { type: 'heading', content: 'Selector Reference' },
    { type: 'text', content: 'CSS selectors decide which elements a rule applies to. Combine them to target exactly what you need.' },
    {
      type: 'table',
      title: 'Basic Selectors',
      headers: ['Selector', 'Example', 'Selects'],
      rows: [
        ['*', '* { }', 'Every element'],
        ['tag', 'p { }', 'Every <p>'],
        ['.class', '.card { }', 'Every element with class="card"'],
        ['#id', '#header { }', 'The element with id="header"'],
        ['A, B', 'h1, h2 { }', 'Every <h1> and <h2>'],
        ['A B', 'nav a { }', 'Every <a> inside a <nav> (any depth)'],
        ['A > B', 'ul > li { }', 'Every <li> that is a direct child of <ul>'],
        ['A + B', 'h2 + p { }', 'The <p> immediately after an <h2>'],
        ['A ~ B', 'h2 ~ p { }', 'Every <p> that follows an <h2> as a sibling'],
        ['[attr]', '[disabled] { }', 'Elements with a "disabled" attribute'],
        ['[attr="val"]', '[type="text"] { }', 'Elements where attr equals val exactly'],
        ['[attr^="val"]', '[href^="https"] { }', 'Attribute value starts with val'],
        ['[attr$="val"]', '[src$=".png"] { }', 'Attribute value ends with val'],
        ['[attr*="val"]', '[class*="btn"] { }', 'Attribute value contains val'],
      ],
    },
    {
      type: 'table',
      title: 'Pseudo-classes',
      headers: ['Pseudo-class', 'Matches'],
      rows: [
        [':hover', 'While the pointer is over the element'],
        [':focus', 'While the element has keyboard focus'],
        [':focus-visible', 'Focused via keyboard (not mouse click)'],
        [':active', 'While the element is being clicked/pressed'],
        [':first-child', 'Element that is the first child of its parent'],
        [':last-child', 'Element that is the last child of its parent'],
        [':nth-child(n)', 'Element at position n (supports 2n, odd, even)'],
        [':not(selector)', 'Element that does NOT match selector'],
        [':checked', 'Checked checkbox/radio inputs'],
        [':disabled', 'Disabled form elements'],
        [':empty', 'Elements with no children (including text)'],
        [':root', 'The <html> element — common place for CSS variables'],
        [':is(A, B)', 'Matches any selector in the list (forgiving)'],
        [':where(A, B)', 'Like :is() but contributes zero specificity'],
      ],
    },
    {
      type: 'table',
      title: 'Pseudo-elements',
      headers: ['Pseudo-element', 'Targets'],
      rows: [
        ['::before', 'Generated content inserted before the element (needs content:)'],
        ['::after', 'Generated content inserted after the element (needs content:)'],
        ['::placeholder', 'Placeholder text of an input'],
        ['::selection', 'The portion of text the user has highlighted'],
        ['::first-line', 'The first rendered line of a block'],
        ['::first-letter', 'The first letter of a block'],
        ['::marker', 'The bullet/number of a list item'],
      ],
    },

    // ── BOX MODEL ──────────────────────────────────────────────
    { type: 'heading', content: 'Box Model & Sizing' },
    {
      type: 'table',
      title: 'Box Model Properties',
      headers: ['Property', 'Purpose', 'Example'],
      rows: [
        ['width / height', 'Content box size', 'width: 300px;'],
        ['min-width / max-width', 'Clamp width between bounds', 'max-width: 100%;'],
        ['min-height / max-height', 'Clamp height between bounds', 'min-height: 100vh;'],
        ['margin', 'Space outside the border', 'margin: 8px 16px;'],
        ['padding', 'Space inside the border, around content', 'padding: 12px;'],
        ['border', 'Line around the padding box', 'border: 1px solid #ccc;'],
        ['border-radius', 'Rounds corners', 'border-radius: 8px;'],
        ['box-sizing', 'What width/height measure', 'box-sizing: border-box;'],
        ['box-shadow', 'Drop shadow around the box', 'box-shadow: 0 2px 8px rgba(0,0,0,.15);'],
        ['outline', 'Line drawn outside border, no layout impact', 'outline: 2px solid blue;'],
      ],
    },
    { type: 'tip', title: 'Always set border-box', content: 'box-sizing: border-box makes width/height include padding and border, which matches how most designers think about sizing. Most CSS resets apply it to every element with *, *::before, *::after { box-sizing: border-box; }.' },

    // ── DISPLAY & POSITION ────────────────────────────────────
    { type: 'heading', content: 'Display & Position' },
    {
      type: 'table',
      title: 'display values',
      headers: ['Value', 'Behavior'],
      rows: [
        ['block', 'Takes full width available, starts on a new line'],
        ['inline', 'Flows with text, width/height are ignored'],
        ['inline-block', 'Flows with text but respects width/height'],
        ['flex', 'Turns the element into a flex container'],
        ['grid', 'Turns the element into a grid container'],
        ['none', 'Removes the element from layout entirely'],
        ['contents', 'Element itself disappears, children stay in the flow'],
      ],
    },
    {
      type: 'table',
      title: 'position values',
      headers: ['Value', 'Behavior'],
      rows: [
        ['static', 'Default — normal document flow, top/left/right/bottom ignored'],
        ['relative', 'Normal flow, but top/left/right/bottom offset it from its own position'],
        ['absolute', 'Removed from flow, positioned relative to nearest positioned ancestor'],
        ['fixed', 'Removed from flow, positioned relative to the viewport (stays put when scrolling)'],
        ['sticky', 'Acts relative until a scroll threshold, then sticks like fixed'],
      ],
    },

    // ── FLEXBOX ────────────────────────────────────────────────
    { type: 'heading', content: 'Flexbox Cheat Sheet' },
    {
      type: 'table',
      title: 'On the flex container',
      headers: ['Property', 'Values', 'Effect'],
      rows: [
        ['display', 'flex / inline-flex', 'Enables flexbox'],
        ['flex-direction', 'row / row-reverse / column / column-reverse', 'Main axis direction'],
        ['flex-wrap', 'nowrap / wrap / wrap-reverse', 'Whether items wrap to new lines'],
        ['justify-content', 'flex-start / center / flex-end / space-between / space-around / space-evenly', 'Alignment along the main axis'],
        ['align-items', 'stretch / flex-start / center / flex-end / baseline', 'Alignment along the cross axis'],
        ['align-content', 'Same values as align-items', 'Aligns wrapped lines (needs flex-wrap)'],
        ['gap', 'length', 'Space between items, both axes'],
      ],
    },
    {
      type: 'table',
      title: 'On the flex items',
      headers: ['Property', 'Values', 'Effect'],
      rows: [
        ['flex-grow', 'number (default 0)', 'How much an item grows relative to siblings'],
        ['flex-shrink', 'number (default 1)', 'How much an item shrinks when space is tight'],
        ['flex-basis', 'length / auto', 'Starting size before grow/shrink is applied'],
        ['flex', 'grow shrink basis (shorthand)', 'e.g. flex: 1 1 0; or flex: 1;'],
        ['align-self', 'auto / stretch / flex-start / center / flex-end', 'Overrides align-items for one item'],
        ['order', 'number (default 0)', 'Changes visual order without changing HTML'],
      ],
    },

    // ── GRID ───────────────────────────────────────────────────
    { type: 'heading', content: 'Grid Cheat Sheet' },
    {
      type: 'table',
      title: 'On the grid container',
      headers: ['Property', 'Example', 'Effect'],
      rows: [
        ['display', 'display: grid;', 'Enables grid layout'],
        ['grid-template-columns', 'repeat(3, 1fr)', 'Defines column tracks'],
        ['grid-template-rows', '100px auto', 'Defines row tracks'],
        ['grid-template-areas', '"header header" "sidebar main"', 'Named layout regions'],
        ['gap', 'gap: 16px;', 'Space between rows and columns'],
        ['justify-items / align-items', 'center', 'Aligns items within their cells'],
        ['place-items', 'center', 'Shorthand for align-items + justify-items'],
      ],
    },
    {
      type: 'table',
      title: 'On the grid items',
      headers: ['Property', 'Example', 'Effect'],
      rows: [
        ['grid-column', '1 / 3 or span 2', 'Which column track(s) the item spans'],
        ['grid-row', '2 / 4', 'Which row track(s) the item spans'],
        ['grid-area', 'header', 'Places item into a named template area'],
        ['justify-self / align-self', 'end', 'Aligns one item within its cell'],
      ],
    },
    { type: 'code', title: 'fr unit and auto-fit', content: 'fr distributes remaining space by fraction. Combined with auto-fit/auto-fill and minmax(), you get a responsive grid with zero media queries.', language: 'css', code: `.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}` },

    // ── UNITS ──────────────────────────────────────────────────
    { type: 'heading', content: 'Units Reference' },
    {
      type: 'table',
      title: 'Length units',
      headers: ['Unit', 'Relative to', 'Common use'],
      rows: [
        ['px', 'Fixed pixel', 'Borders, precise sizes'],
        ['%', 'Parent element size', 'Fluid widths'],
        ['em', 'Font-size of the current element', 'Spacing that scales with text'],
        ['rem', 'Font-size of the root <html> element', 'Consistent, predictable scaling'],
        ['vw / vh', '1% of viewport width / height', 'Full-screen sections, hero heights'],
        ['vmin / vmax', 'Smaller / larger of vw and vh', 'Sizing that adapts to orientation'],
        ['ch', 'Width of the "0" character', 'Readable text column widths'],
        ['fr', 'Fraction of free space (grid only)', 'Flexible grid tracks'],
      ],
    },
    {
      type: 'table',
      title: 'Color formats',
      headers: ['Format', 'Example', 'Notes'],
      rows: [
        ['keyword', 'red, rebeccapurple', '147 named colors'],
        ['hex', '#3b82f6, #3b82f6cc', 'Optional 2-digit alpha suffix'],
        ['rgb() / rgba()', 'rgb(59 130 246 / 0.8)', 'Alpha via / or 4th argument'],
        ['hsl() / hsla()', 'hsl(217 91% 60%)', 'Hue, saturation, lightness — easy to tweak'],
        ['currentColor', 'border-color: currentColor;', 'Reuses the element’s computed text color'],
      ],
    },

    // ── ANIMATION / TRANSFORM ──────────────────────────────────
    { type: 'heading', content: 'Transitions, Animations & Transforms' },
    {
      type: 'table',
      title: 'Transition & animation properties',
      headers: ['Property', 'Purpose'],
      rows: [
        ['transition', 'Shorthand: property duration timing-function delay'],
        ['transition-property', 'Which property(ies) to animate, or all'],
        ['transition-timing-function', 'ease / linear / ease-in-out / cubic-bezier()'],
        ['animation', 'Shorthand: name duration timing-function delay iteration-count direction'],
        ['@keyframes name', 'Defines the animation steps (0%, 50%, 100%)'],
        ['animation-iteration-count', 'Number of loops, or infinite'],
        ['transform', 'translate(), rotate(), scale(), skew() — combine with spaces'],
        ['transform-origin', 'Pivot point for rotate/scale, default is center'],
      ],
    },

    // ── SHORTHAND CHEATSHEET ────────────────────────────────────
    { type: 'heading', content: 'Shorthand Property Cheat Sheet' },
    { type: 'code', title: 'The most-used shorthands', content: 'Shorthand properties set several longhand properties in one declaration. Order matters for most of these — when in doubt, it follows top/right/bottom/left (clockwise from top).', language: 'css', code: `/* margin & padding: top right bottom left (clockwise) */
margin: 10px 20px 10px 20px;
margin: 10px 20px;      /* vertical horizontal */
margin: 10px;            /* all sides */

/* font: style variant weight size/line-height family */
font: italic bold 16px/1.5 "Inter", sans-serif;

/* background: color image position/size repeat attachment */
background: #f3f4f6 url("bg.png") center/cover no-repeat;

/* border: width style color */
border: 1px solid #e5e7eb;

/* flex: grow shrink basis */
flex: 1 1 200px;

/* transition: property duration easing delay */
transition: transform 0.3s ease-in-out 0s;

/* grid-template-columns / rows */
grid-template-columns: repeat(3, 1fr);` },

    {
      type: 'list',
      title: 'Common CSS gotchas to remember',
      items: [
        'Margins between adjacent block elements can "collapse" into the larger of the two — use padding or a flex/grid container to avoid it.',
        '% height only works if the parent has an explicit height set.',
        'z-index only has an effect on elements with a position other than static.',
        'Specificity order (low to high): type selectors → classes/attributes/pseudo-classes → IDs → inline styles → !important.',
        'flex-basis takes priority over width when both are set on a flex item.',
      ],
    },
  ],
  exercises: [
    { id: 'css-ref-ex-1', question: 'Which selector targets every <a> that is a direct child of a <nav>?', type: 'multiple-choice', options: ['nav a', 'nav > a', 'nav + a', 'nav ~ a'], correct: 1, explanation: '> selects only direct children, unlike a plain space which matches any descendant depth.' },
    { id: 'css-ref-ex-2', question: 'Which value makes width/height include padding and border?', type: 'fill-blank', correct: 'border-box', explanation: 'box-sizing: border-box is the most common CSS reset rule for predictable sizing.' },
    { id: 'css-ref-ex-3', question: 'In "margin: 10px 20px;", what does 20px apply to?', type: 'multiple-choice', options: ['Top and bottom', 'Left and right', 'Right only', 'All sides'], correct: 1, explanation: 'Two-value shorthand is vertical horizontal — 10px top/bottom, 20px left/right.' },
    { id: 'css-ref-ex-4', question: 'Which grid function lets a track grow up to 1fr but never shrink below 200px?', type: 'fill-blank', correct: 'minmax(200px, 1fr)', explanation: 'minmax(min, max) is the standard way to build responsive grid tracks, often paired with auto-fit.' },
  ],
  quiz: [
    { id: 'css-ref-q1', question: 'Which pseudo-class matches an element with no children?', options: [':empty', ':blank', ':void', ':none'], correct: 0, explanation: ':empty matches elements with no child nodes (including text nodes).' },
    { id: 'css-ref-q2', question: 'What does the "ch" unit measure?', options: ['Character height', 'Width of the "0" character in the current font', 'Chapter width', 'Viewport height in characters'], correct: 1, explanation: 'ch is based on the width of the "0" glyph, useful for readable text column widths.' },
    { id: 'css-ref-q3', question: 'Which position value keeps an element fixed relative to the viewport even while scrolling?', options: ['relative', 'absolute', 'fixed', 'static'], correct: 2, explanation: 'fixed positioning is relative to the viewport and ignores scrolling.' },
    { id: 'css-ref-q4', question: 'On a flex item, which property sets its starting size before grow/shrink is applied?', options: ['flex-grow', 'flex-shrink', 'flex-basis', 'flex-order'], correct: 2, explanation: 'flex-basis is the initial main-size before flex-grow/flex-shrink adjust it.' },
    { id: 'css-ref-q5', question: 'Which selector has the highest specificity?', options: ['.card', 'div.card', '#card', 'card'], correct: 2, explanation: 'ID selectors (#card) have higher specificity than classes or type selectors.' },
  ],
};
