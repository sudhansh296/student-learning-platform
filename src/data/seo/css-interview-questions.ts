import { code } from './cheatsheet-types';
import type { QuestionBank } from './question-types';

export const cssInterview: QuestionBank = {
  path: '/css-interview-questions',
  mode: 'interview',
  tech: 'css',
  codeLang: 'css',
  badge: 'CSS interview',
  title: 'CSS Interview Questions and Answers',
  description: '50+ CSS interview questions with clear answers: the box model, selectors and specificity, Flexbox, Grid, positioning, and responsive design.',
  h1: 'CSS Interview Questions and Answers (Freshers to Frontend Developers)',
  intro: 'Fifty-plus CSS interview questions grouped by topic: the fundamentals, selectors and specificity, the box model, colors and text, Flexbox, Grid, positioning, animations, and responsive design. Each has a short answer, a fuller explanation and, where it helps, a runnable CSS example you can open in the code editor against automatically generated sample markup.',
  notes: [
    {
      id: 'how-to-use',
      title: 'How to use this page',
      text: 'Read the short answer first, then open the longer explanation for the reasoning. Run the examples in the editor and change them — the editor generates sample HTML that matches the selectors in the CSS, so you see the rules applied immediately. The questions move from fundamentals through selectors, the box model, layout (Flexbox and Grid) to positioning, animation and responsive design, so jump to the group you need.',
      placement: 'top',
    },
    {
      id: 'common-mistakes',
      title: 'Common mistakes beginners make',
      items: [
        'Fighting the box model by forgetting padding and border add to an element\'s total size. Fix: set box-sizing: border-box (often globally) so width includes padding and border, matching how most people intuitively expect sizing to work.',
        'Using !important to "win" a specificity fight instead of understanding why a rule is losing. Fix: check the actual specificity and source order first — !important is a last resort that makes future overrides much harder.',
        'Reaching for Flexbox for a genuinely two-dimensional layout, or Grid for a simple one-dimensional row. Fix: Flexbox excels at one dimension (a row or a column) that needs to distribute or align space; Grid excels at two dimensions (rows and columns together).',
        'Using position: absolute without setting position: relative on a meaningful ancestor. Fix: an absolutely positioned element positions itself relative to its nearest positioned ancestor — without one, that is often the whole page, producing unexpected placement.',
      ],
    },
    {
      id: 'real-projects',
      title: 'Where this helps in real projects',
      items: [
        'Debugging why a rule is not applying, using specificity and the cascade instead of guessing and adding !important.',
        'Building a responsive layout with Flexbox or Grid that adapts across screen sizes without duplicating markup.',
        'Centering content — still one of the most common real CSS tasks, and one with several correct approaches depending on the situation.',
        'Writing animations and transitions that feel smooth and intentional, not just "something moves."',
      ],
    },
    {
      id: 'study-tip',
      title: 'Study tip',
      text: 'Build the same simple layout — a header, a three-column content area, a footer — three times: once with floats (the old way), once with Flexbox, and once with Grid. Interviewers frequently ask "when would you use Flexbox versus Grid," and having actually built both makes the answer obvious instead of memorized.',
    },
  ],
  groups: [
    {
      id: 'fundamentals',
      title: 'CSS fundamentals',
      items: [
        { q: 'What is CSS, and what problem does it solve?', level: 'beginner', short: 'Cascading Style Sheets: a language for describing how HTML content should look — colors, spacing, layout, fonts — separating presentation from the structure and content that HTML provides.', code: code('h1 {', '  color: navy;', '  font-size: 2rem;', '}'), lessons: ['css/introduction'] },
        { q: 'What are the three ways to add CSS to a page?', level: 'beginner', short: 'Inline (a style attribute directly on an element), internal (a <style> block in the document\'s head), and external (a linked separate .css file). External is generally preferred for real projects — it is cacheable and keeps styling separate from markup.', lessons: ['css/introduction'] },
        { q: 'What is the CSS "cascade," and what determines which rule wins when two rules conflict?', level: 'intermediate', short: 'The cascade is the algorithm the browser uses to resolve conflicting rules, considering (in order of priority) importance (!important), specificity, and source order (later rules win ties) — not just "the last rule always wins," which is only true when specificity is equal.', long: 'Understanding the cascade is the key to debugging "why isn\'t my CSS working" — the answer is almost always that a more specific (or later, or !important) rule elsewhere is overriding it.', lessons: ['css/introduction'] },
        { q: 'What is the difference between CSS inheritance and the cascade?', level: 'intermediate', short: 'Inheritance is about certain properties (like color and font-family) automatically passing down from a parent element to its children if not explicitly set. The cascade is the separate mechanism that resolves which competing rule applies to a given element in the first place.', code: code('body {', '  color: #333;', '  font-family: sans-serif;', '}', '/* p and span inherit color and font-family automatically */'), lessons: ['css/introduction'] },
        { q: 'What is the difference between a class selector and an id selector?', level: 'beginner', short: 'A class selector (.name) can be applied to many elements and is meant for reusable styling. An id selector (#name) should be unique within the page, has higher specificity than a class, and is often reserved for JavaScript hooks or anchor links rather than styling.', code: code('.card { border: 1px solid #ddd; }', '#page-header { background: navy; }'), lessons: ['css/selectors'] },
      ],
    },
    {
      id: 'selectors-specificity',
      title: 'Selectors and specificity',
      items: [
        { q: 'What are the main types of CSS selectors?', level: 'beginner', short: 'Element (p), class (.card), id (#header), attribute ([type="text"]), pseudo-class (:hover), and pseudo-element (::before) — each targets elements a different way.', code: code('p { color: #333; }', '.card { padding: 1rem; }', 'input[type="text"] { border: 1px solid #ccc; }', 'a:hover { color: blue; }', 'p::first-line { font-weight: bold; }'), lessons: ['css/selectors'] },
        { q: 'What is the difference between a pseudo-class and a pseudo-element?', level: 'intermediate', short: 'A pseudo-class (:hover, :first-child, :focus) targets an element in a particular state or position. A pseudo-element (::before, ::after, ::first-line) targets a specific part of an element, or lets you insert generated content that is not in the actual HTML.', code: code('button:hover {', '  background: #2563eb;', '}', '', '.badge::before {', "  content: '★ ';", '}'), lessons: ['css/selectors'] },
        { q: 'What is the difference between a descendant selector and a child selector?', level: 'intermediate', short: 'A descendant selector (.card p, with a space) matches a <p> anywhere inside .card, no matter how deeply nested. A child selector (.card > p, with a >) only matches a <p> that is a direct child of .card.', code: code('.card p {', '  color: #555;', '}', '', '.card > p {', '  font-weight: bold;', '}'), lessons: ['css/selectors'] },
        { q: 'How is CSS specificity calculated, roughly?', level: 'advanced', short: 'Specificity is compared as a tuple of counts: (inline styles, id selectors, class/attribute/pseudo-class selectors, element/pseudo-element selectors) — compared left to right, so a single id selector always beats any number of class selectors, and a single class always beats any number of element selectors.', code: code('#nav a { color: red; }        /* 1 id, 1 element -> wins over the rule below */', '.nav-link { color: blue; }    /* 1 class */'), long: 'This is why one id selector can be surprisingly hard to override with several classes — a common source of "why won\'t my CSS apply" confusion when mixing id-based and class-based styling.', lessons: ['css/selectors'] },
        { q: 'What does the universal selector (*) do, and when is it used?', level: 'beginner', short: 'It matches every element. Commonly used in a "CSS reset" to zero out default browser margin/padding, or with box-sizing: border-box applied globally.', code: code('* {', '  margin: 0;', '  padding: 0;', '  box-sizing: border-box;', '}'), lessons: ['css/selectors'] },
      ],
    },
    {
      id: 'box-model',
      title: 'The box model',
      items: [
        { q: 'What is the CSS box model?', level: 'beginner', short: 'Every element is a rectangular box made of four layers, from the inside out: content, padding, border, and margin. Total space an element takes up on the page is the sum of all four.', code: code('.box {', '  width: 200px;', '  padding: 20px;', '  border: 5px solid #333;', '  margin: 10px;', '}'), lessons: ['css/box-model'] },
        { q: 'What is the difference between box-sizing: content-box and border-box?', level: 'intermediate', short: 'With content-box (the default), width/height apply only to the content, and padding/border are added on top, making the element visually larger than the width you set. With border-box, width/height include padding and border, so the element\'s total visual size actually matches the width you set.', code: code('.content-box {', '  box-sizing: content-box;', '  width: 200px;', '  padding: 20px;', '  /* total width: 240px */', '}', '', '.border-box {', '  box-sizing: border-box;', '  width: 200px;', '  padding: 20px;', '  /* total width stays 200px */', '}'), lessons: ['css/box-model'] },
        { q: 'What is margin collapsing?', level: 'advanced', short: 'When two vertical margins meet (like the bottom margin of one block and the top margin of the next), they do not add together — the larger of the two "wins" and becomes the actual gap, instead of the sum of both.', code: code('p {', '  margin-top: 20px;', '  margin-bottom: 30px;', '}', '/* the gap between two paragraphs is 30px, not 50px */'), long: 'Margin collapsing only happens for vertical margins of block elements in normal flow — it does not happen with padding, with horizontal margins, or with elements using Flexbox or Grid, which is one reason those layout modes feel more predictable.', lessons: ['css/box-model'] },
        { q: 'What is the difference between margin and padding?', level: 'beginner', short: 'Padding is space inside an element\'s border, between the border and the content — it is part of the element\'s own background. Margin is space outside the border, separating the element from its neighbors, and is always transparent.', code: code('.box {', '  background: lightblue;', '  padding: 20px;   /* light blue extends into this space */', '  margin: 20px;    /* transparent, outside the box */', '}'), lessons: ['css/box-model'] },
      ],
    },
    {
      id: 'colors-text',
      title: 'Colors, backgrounds and text',
      items: [
        { q: 'What are the different ways to specify a color in CSS?', level: 'beginner', short: 'Named colors (red), hex (#ff0000), rgb()/rgba() (rgb(255,0,0)), and hsl()/hsla() (hsl(0,100%,50%)) — rgba and hsla add an alpha channel for transparency.', code: code('.a { color: red; }', '.b { color: #ff0000; }', '.c { color: rgb(255, 0, 0); }', '.d { color: rgba(255, 0, 0, 0.5); }', '.e { color: hsl(0, 100%, 50%); }'), lessons: ['css/colors-backgrounds'] },
        { q: 'What is the difference between the opacity property and an rgba/hsla alpha value?', level: 'intermediate', short: 'opacity makes the entire element, including its children and text, partially transparent as one unit. An alpha value in rgba()/hsla() only affects that one color value (like just the background), leaving everything else fully opaque.', code: code('.faded-everything {', '  opacity: 0.5;', '}', '', '.faded-background-only {', '  background: rgba(0, 0, 0, 0.5);', '  color: black; /* text stays fully opaque */', '}'), lessons: ['css/colors-backgrounds'] },
        { q: 'How do you set a background image, and what does background-size: cover do?', level: 'intermediate', short: 'background-image sets the image. background-size: cover scales it to completely fill the element while preserving its aspect ratio, cropping any overflow — the common choice for a full-width hero background.', code: code('.hero {', "  background-image: url('hero.jpg');", '  background-size: cover;', '  background-position: center;', '}'), lessons: ['css/colors-backgrounds'] },
        { q: 'What is line-height, and why does it matter for readability?', level: 'intermediate', short: 'The vertical space allotted for each line of text — too tight and lines feel cramped and hard to read; too loose and paragraphs feel disconnected. A unitless value (like line-height: 1.5) scales with the element\'s own font size, which is usually the safest choice.', code: code('p {', '  font-size: 16px;', '  line-height: 1.5;', '}'), lessons: ['css/text-fonts'] },
        { q: 'How do you truncate overflowing text with an ellipsis?', level: 'advanced', short: 'Combine white-space: nowrap (prevent wrapping), overflow: hidden (hide the overflow), and text-overflow: ellipsis (show "…" where it was cut) — all three are needed together for the effect to work.', code: code('.truncate {', '  white-space: nowrap;', '  overflow: hidden;', '  text-overflow: ellipsis;', '  max-width: 200px;', '}'), lessons: ['css/text-fonts'] },
      ],
    },
    {
      id: 'flexbox',
      title: 'Flexbox',
      items: [
        { q: 'What is Flexbox, and what problem is it designed to solve?', level: 'beginner', short: 'A one-dimensional layout system for arranging items in a row or a column, distributing space between them and aligning them, without the hacks (floats, inline-block spacing quirks) layout required before it.', code: code('.container {', '  display: flex;', '  gap: 1rem;', '}'), lessons: ['css/flexbox'] },
        { q: 'What is the difference between the main axis and the cross axis in Flexbox?', level: 'intermediate', short: 'The main axis runs in the direction of flex-direction (row by default, left to right). The cross axis runs perpendicular to it. justify-content aligns items along the main axis; align-items aligns them along the cross axis.', code: code('.container {', '  display: flex;', '  justify-content: center; /* main axis */', '  align-items: center;     /* cross axis */', '  height: 200px;', '}'), lessons: ['css/flexbox'] },
        { q: 'How would you center a single element both horizontally and vertically with Flexbox?', level: 'beginner', short: 'Make the parent a flex container and set both justify-content and align-items to center — one of the most common real Flexbox use cases.', code: code('.parent {', '  display: flex;', '  justify-content: center;', '  align-items: center;', '  height: 300px;', '}'), lessons: ['css/flexbox'] },
        { q: 'What do flex-grow, flex-shrink and flex-basis control?', level: 'advanced', short: 'flex-basis sets an item\'s starting size before extra space is distributed. flex-grow controls how much of any leftover space an item absorbs, relative to its siblings. flex-shrink controls how much an item shrinks when there is not enough space, relative to its siblings.', code: code('.item-a { flex: 1; }     /* grow to fill available space equally */', '.item-b { flex: 2; }     /* grow twice as much as item-a */', '.item-fixed { flex: 0 0 100px; } /* fixed 100px, never grows or shrinks */'), lessons: ['css/flexbox'] },
        { q: 'What does flex-wrap do?', level: 'intermediate', short: 'By default, flex items all try to fit on one line, shrinking if needed. flex-wrap: wrap lets items overflow onto additional lines instead of continuing to shrink past their content.', code: code('.container {', '  display: flex;', '  flex-wrap: wrap;', '  gap: 1rem;', '}'), lessons: ['css/flexbox'] },
      ],
    },
    {
      id: 'grid',
      title: 'CSS Grid',
      items: [
        { q: 'What is CSS Grid, and how is it different from Flexbox?', level: 'intermediate', short: 'Grid is a two-dimensional layout system — you define both rows and columns together and place items into that grid explicitly. Flexbox is one-dimensional — a single row or column that distributes and aligns items along it.', code: code('.grid {', '  display: grid;', '  grid-template-columns: 1fr 1fr 1fr;', '  gap: 1rem;', '}'), lessons: ['css/grid'] },
        { q: 'What does the fr unit mean in grid-template-columns?', level: 'intermediate', short: 'A fractional unit representing a share of the available space — grid-template-columns: 1fr 2fr creates two columns where the second is twice as wide as the first, after accounting for any fixed-size columns and gaps.', code: code('.layout {', '  display: grid;', '  grid-template-columns: 200px 1fr;', '  /* a fixed 200px sidebar, and the rest of the space for content */', '}'), lessons: ['css/grid'] },
        { q: 'How do you make a grid item span multiple columns or rows?', level: 'advanced', short: 'grid-column: span 2 (or explicit start/end lines like grid-column: 1 / 3) makes an item span multiple columns; grid-row works the same way for rows.', code: code('.grid {', '  display: grid;', '  grid-template-columns: repeat(3, 1fr);', '}', '', '.featured {', '  grid-column: span 2;', '}'), lessons: ['css/grid'] },
        { q: 'When would you choose Grid over Flexbox for a layout?', level: 'advanced', short: 'When the layout genuinely needs both rows and columns to line up together — a page layout with a header, sidebar, main content and footer, or a photo gallery where items need to align in both directions. For a simple toolbar, nav bar, or anything that only needs to distribute space in one direction, Flexbox is usually simpler.', long: 'They are not mutually exclusive — a real page often uses Grid for the overall page structure and Flexbox for smaller components within it, like a row of buttons inside a Grid cell.' },
      ],
    },
    {
      id: 'positioning',
      title: 'Positioning',
      items: [
        { q: 'What are the different values of the position property?', level: 'beginner', short: 'static (the default, normal document flow), relative (offset from its own normal position, without affecting other elements), absolute (removed from flow, positioned relative to its nearest positioned ancestor), fixed (positioned relative to the viewport, stays put when scrolling), and sticky (behaves like relative until a scroll threshold, then sticks like fixed).', code: code('.relative { position: relative; top: 10px; }', '.absolute { position: absolute; top: 0; right: 0; }', '.fixed { position: fixed; bottom: 20px; right: 20px; }', '.sticky { position: sticky; top: 0; }'), lessons: ['css/positioning'] },
        { q: 'What does it mean for an absolutely positioned element to be positioned relative to its "nearest positioned ancestor"?', level: 'advanced', short: 'An element with position: absolute looks up through its ancestors for the closest one that has a position other than static (relative, absolute, fixed or sticky), and positions itself relative to that one. If none exist, it positions relative to the whole document.', code: code('.card {', '  position: relative; /* establishes the reference point */', '}', '', '.badge {', '  position: absolute;', '  top: 8px;', '  right: 8px;', '}'), long: 'This is why "position: relative on the parent" is such a common pairing with "position: absolute on the child" — without it, the absolutely positioned element often ends up positioned relative to the entire page instead of the intended container.', lessons: ['css/positioning'] },
        { q: 'What is z-index, and when does it not work as expected?', level: 'advanced', short: 'It controls the stacking order of overlapping elements along the z-axis — a higher z-index renders on top. It only has an effect on elements with a position other than static, and it is compared within the same "stacking context," which is why a high z-index can sometimes still lose to an element in a different stacking context.', code: code('.modal {', '  position: fixed;', '  z-index: 1000;', '}'), lessons: ['css/positioning'] },
        { q: 'What is the difference between position: fixed and position: sticky?', level: 'intermediate', short: 'fixed is always positioned relative to the viewport, regardless of scrolling — it never moves with the page. sticky behaves like a normal element until the page scrolls past a threshold you set (like top: 0), at which point it "sticks" in place, but only within its containing element\'s bounds.', code: code('.sticky-header {', '  position: sticky;', '  top: 0;', '}'), lessons: ['css/positioning'] },
      ],
    },
    {
      id: 'animations',
      title: 'Transitions and animations',
      items: [
        { q: 'What is the difference between a CSS transition and a CSS animation?', level: 'intermediate', short: 'A transition smoothly animates a property change between two states (usually triggered by something like :hover) — it needs a trigger and only goes from A to B. An animation (with @keyframes) can define multiple steps, run automatically on load, and loop indefinitely, without needing an external trigger.', code: code('.button {', '  background: #2563eb;', '  transition: background 0.2s ease;', '}', '.button:hover {', '  background: #1d4ed8;', '}'), lessons: ['css/animations'] },
        { q: 'How do you define a CSS animation with @keyframes?', level: 'intermediate', short: '@keyframes names a sequence of styles at different points (0% to 100%, or "from"/"to"), and the animation property on an element applies that sequence with a duration, timing function, and other options.', code: code('@keyframes fadeIn {', '  from { opacity: 0; }', '  to { opacity: 1; }', '}', '', '.fade-in {', '  animation: fadeIn 0.5s ease-in;', '}'), lessons: ['css/animations'] },
        { q: 'What does the transform property do, and why is animating it often preferred over animating width/height/top/left?', level: 'advanced', short: 'transform lets you scale, rotate, skew or translate (move) an element visually. Animating transform (and opacity) can run on the GPU and does not trigger layout recalculation, making it much smoother than animating properties like width or top, which force the browser to recompute layout on every frame.', code: code('.card:hover {', '  transform: scale(1.05) translateY(-4px);', '  transition: transform 0.2s ease;', '}'), lessons: ['css/animations'] },
        { q: 'What does the transition-timing-function control?', level: 'intermediate', short: 'The pacing of the transition over its duration — ease (slow start and end, the default), linear (constant speed), ease-in (slow start), ease-out (slow end), or a custom cubic-bezier curve.', code: code('.smooth {', '  transition: transform 0.3s ease-out;', '}'), lessons: ['css/animations'] },
      ],
    },
    {
      id: 'responsive',
      title: 'Responsive design',
      items: [
        { q: 'What is a media query, and how do you write one for a mobile breakpoint?', level: 'beginner', short: 'A conditional block of CSS that only applies when the specified condition (usually a viewport width) is true — used to change styling at different screen sizes.', code: code('.sidebar {', '  display: none;', '}', '', '@media (min-width: 768px) {', '  .sidebar {', '    display: block;', '  }', '}'), lessons: ['css/responsive'] },
        { q: 'What does "mobile-first" responsive design mean?', level: 'intermediate', short: 'Writing your base (unwrapped-in-a-media-query) CSS for the smallest screen first, then using min-width media queries to progressively add complexity for larger screens — rather than starting from a desktop layout and using max-width queries to strip things down.', code: code('.container {', '  display: block; /* mobile default */', '}', '', '@media (min-width: 1024px) {', '  .container {', '    display: flex; /* enhance for larger screens */', '  }', '}'), long: 'Mobile-first tends to produce simpler CSS (adding complexity as screens grow, rather than fighting to remove it) and matches the reality that mobile is the primary or first experience for most sites today.', lessons: ['css/responsive'] },
        { q: 'What is the difference between px, em, rem, % and viewport units (vw/vh)?', level: 'advanced', short: 'px is a fixed pixel size. em is relative to the font-size of the current element (compounding through nested elements). rem is relative to the root (<html>) font-size only, avoiding that compounding. % is relative to the parent\'s corresponding size. vw/vh are relative to 1% of the viewport\'s width/height.', code: code('html { font-size: 16px; }', '', '.a { font-size: 1.5rem; }  /* always 24px, based on root */', '.b { font-size: 1.5em; }   /* 1.5x the CURRENT element\'s inherited font-size */', '.hero { height: 100vh; }   /* full viewport height */'), lessons: ['css/responsive'] },
        { q: 'What is the difference between max-width and min-width media queries?', level: 'intermediate', short: '@media (max-width: 768px) applies its styles when the viewport is 768px or narrower — used in a desktop-first approach, to override styles for smaller screens. @media (min-width: 768px) applies when the viewport is 768px or wider — used in a mobile-first approach, to add styles as screens grow.', code: code('/* mobile-first: applies from 768px and up */', '@media (min-width: 768px) { .grid { grid-template-columns: repeat(2, 1fr); } }'), lessons: ['css/responsive'] },
      ],
    },
  ],
  tips: [
    'Be able to calculate CSS specificity by hand for a couple of competing selectors — this comes up constantly, directly or as the root cause of a "why isn\'t my CSS working" debugging question.',
    'Know precisely when Flexbox fits better than Grid and vice versa, with a concrete example of each.',
    'Understand box-sizing: border-box well enough to explain why it is commonly applied globally at the start of a project.',
    'Practice explaining position: absolute\'s "nearest positioned ancestor" rule — a very common source of real layout bugs and a favorite interview question.',
    'Be ready to explain why animating transform/opacity performs better than animating layout properties like width or top.',
  ],
  more: [
    { label: 'CSS cheat sheet', href: '/css-cheatsheet' },
    { label: 'HTML interview questions', href: '/html-interview-questions' },
    { label: 'JavaScript interview questions', href: '/javascript-interview-questions' },
    { label: 'CSS lessons', href: '/css' },
    { label: 'Frontend developer roadmap', href: '/frontend-roadmap' },
  ],
};
