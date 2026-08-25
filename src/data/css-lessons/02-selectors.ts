import type { CssLesson } from '../css-curriculum';

export const cssSelectorsLesson: CssLesson = {
  id: 'css-selectors', title: 'CSS Selectors', slug: 'selectors',
  chapter: 'selectors', order: 2, difficulty: 'beginner', readingTime: 14,
  description: 'Master all CSS selectors - element, class, ID, attribute, pseudo-classes, pseudo-elements, combinators, and specificity.',
  sections: [
    { type: 'text', content: 'A CSS selector targets HTML elements so you can apply styles to them. Knowing all the ways to select elements is one of the most powerful skills in CSS. The selector is everything that comes before the opening curly brace { }.' },
    { type: 'heading', content: 'Basic Selectors' },
    { type: 'code', language: 'css', code: `/* 1. Element/Type selector - targets all <p> tags */
p { color: #374151; }
h1 { font-size: 2rem; }
button { cursor: pointer; }

/* 2. Class selector - targets any element with class="card" */
.card { background: white; border-radius: 12px; }
.btn-primary { background: #2563eb; color: white; }
.hidden { display: none; }

/* 3. ID selector - targets ONE unique element */
#hero { background: linear-gradient(135deg, #1e40af, #7c3aed); }
#main-nav { position: sticky; top: 0; }

/* 4. Universal selector - targets EVERYTHING */
* { box-sizing: border-box; margin: 0; padding: 0; }

/* 5. Multiple selectors - apply same styles to many */
h1, h2, h3, h4 { font-weight: 700; color: #111; }
.card, .panel, .modal { background: white; border-radius: 8px; }` },
    { type: 'heading', content: 'Attribute Selectors' },
    { type: 'code', language: 'css', code: `/* Target elements with a specific attribute */
[type]             { border: 1px solid #ccc; }    /* has type attr */
[type="email"]     { background: #f0f9ff; }         /* type="email" exactly */
[href^="https"]    { color: green; }               /* href STARTS with https */
[href$=".pdf"]     { color: red; }                 /* href ENDS with .pdf */
[class*="btn"]     { cursor: pointer; }            /* class CONTAINS "btn" */
[data-active="true"] { outline: 2px solid blue; } /* custom data attribute */

/* Practical: style all external links */
a[target="_blank"]::after {
  content: " ↗";
  font-size: 0.75em;
}

/* Style disabled form elements */
input[disabled] { opacity: 0.5; cursor: not-allowed; }` },
    { type: 'heading', content: 'Pseudo-Classes - Element States' },
    { type: 'code', language: 'css', code: `/* :hover - mouse is over the element */
button:hover { background: #1d4ed8; transform: translateY(-1px); }
a:hover { text-decoration: underline; }

/* :focus - element has keyboard/click focus */
input:focus { border-color: #2563eb; outline: none; box-shadow: 0 0 0 3px rgba(37,99,235,0.15); }

/* :active - element is being clicked */
button:active { transform: scale(0.98); }

/* :visited - link that has been clicked */
a:visited { color: #7c3aed; }

/* :first-child, :last-child, :nth-child */
li:first-child { border-top: none; }
li:last-child { border-bottom: none; }
tr:nth-child(even) { background: #f9fafb; }     /* zebra stripes */
tr:nth-child(odd)  { background: white; }
li:nth-child(3)    { color: red; }              /* exactly 3rd */
li:nth-child(2n)   { color: blue; }             /* every even item */
li:nth-child(3n+1) { font-weight: bold; }       /* every 3rd starting at 1 */

/* :not() - exclude elements */
p:not(.intro)   { color: #6b7280; }
li:not(:last-child) { border-bottom: 1px solid #e5e7eb; }

/* :checked, :disabled, :required, :valid, :invalid - form states */
input:checked + label { font-weight: bold; color: #2563eb; }
input:invalid { border-color: #ef4444; }
input:valid   { border-color: #22c55e; }

/* :empty - element with no children */
.placeholder:empty { background: #f3f4f6; min-height: 40px; }

/* :root - the <html> element, used for CSS variables */
:root {
  --blue: #2563eb;
  --font-size-base: 16px;
}` },
    { type: 'heading', content: 'Pseudo-Elements - Decorate Elements' },
    { type: 'code', language: 'css', code: `/* ::before and ::after - insert content before/after element */
.btn::before { content: "→ "; }
.required::after { content: " *"; color: red; }

/* Decorative quote marks */
blockquote::before { content: '"'; font-size: 3rem; color: #ccc; line-height: 0; }
blockquote::after  { content: '"'; font-size: 3rem; color: #ccc; line-height: 0; }

/* ::first-line - style only the first line */
p::first-line { font-weight: bold; font-size: 1.1em; }

/* ::first-letter - drop cap effect */
p::first-letter { font-size: 3em; float: left; line-height: 0.8; margin-right: 8px; color: #2563eb; }

/* ::placeholder - style input placeholder text */
input::placeholder { color: #9ca3af; font-style: italic; }

/* ::selection - text selected by user */
::selection { background: #dbeafe; color: #1e40af; }

/* ::marker - list item markers */
li::marker { color: #2563eb; font-size: 1.2em; }` },
    { type: 'heading', content: 'Combinator Selectors' },
    { type: 'code', language: 'css', code: `/* Descendant (space) - any nested element */
.card p { color: #6b7280; }            /* all <p> inside .card */
nav a { text-decoration: none; }       /* all <a> inside nav */

/* Child (>) - DIRECT children only */
.nav > li { display: inline-block; }   /* direct <li> children of .nav */
.form > label { font-weight: 600; }    /* direct <label> children */

/* Adjacent sibling (+) - immediately following sibling */
h2 + p { font-size: 1.1rem; color: #374151; }  /* <p> right after <h2> */
input + label { margin-left: 8px; }

/* General sibling (~) - all following siblings */
h2 ~ p { margin-left: 20px; }         /* all <p> after a <h2> same parent */` },
    { type: 'heading', content: 'CSS Specificity - Which Rule Wins?' },
    { type: 'text', content: 'When two CSS rules target the same element, specificity determines which one applies. Think of it as a points system: inline styles get 1000 points, IDs get 100, classes/attributes/pseudo-classes get 10, elements/pseudo-elements get 1.' },
    { type: 'table', title: 'Specificity Scoring', headers: ['Selector', 'Points', 'Example'], rows: [
      ['Inline style', '1000', 'style="color:red"'],
      ['ID selector', '100', '#header'],
      ['Class selector', '10', '.card'],
      ['Attribute selector', '10', '[type="text"]'],
      ['Pseudo-class', '10', ':hover'],
      ['Element selector', '1', 'p, h1, div'],
      ['Pseudo-element', '1', '::before'],
      ['Universal selector', '0', '*'],
      ['!important', 'Overrides all', 'color: red !important'],
    ]},
    { type: 'code', language: 'css', code: `/* Specificity examples */
p           { color: gray; }       /* 1 point */
.intro      { color: blue; }       /* 10 points - wins over p */
#main p     { color: green; }      /* 101 points */
#main .intro{ color: purple; }     /* 110 points - wins */

/* !important - nuclear option, avoid if possible */
p { color: gray !important; }      /* beats everything */

/* Tip: keep specificity low - use classes, avoid IDs for CSS */` },
    { type: 'warning', title: 'Avoid overusing !important', content: '!important overrides all other CSS. Overusing it leads to a "specificity war" where you need more !important everywhere. Instead, write more specific selectors or restructure your CSS.' },
    { type: 'tryit', title: 'Try It: Selectors',
      html: `<div id="app">
  <h1>CSS Selectors Demo</h1>

  <nav>
    <a href="#">Home</a>
    <a href="#">About</a>
    <a href="#" class="active">Blog</a>
    <a href="#" target="_blank">External ↗</a>
  </nav>

  <ul class="list">
    <li>First item</li>
    <li>Second item</li>
    <li>Third item</li>
    <li>Fourth item</li>
    <li class="special">Special item</li>
  </ul>

  <form>
    <input type="text" placeholder="Type here..." required>
    <input type="email" placeholder="Email address">
    <button type="submit">Submit</button>
  </form>
</div>`,
      css: `* { box-sizing: border-box; }
body { font-family: system-ui, sans-serif; padding: 20px; background: #f9fafb; }
h1 { color: #1e1e1e; margin-bottom: 16px; }

/* Descendant combinator */
nav a { color: #6b7280; text-decoration: none; margin-right: 16px; font-weight: 500; }
nav a:hover { color: #2563eb; }

/* Class selector */
.active { color: #2563eb !important; font-weight: 700; border-bottom: 2px solid #2563eb; padding-bottom: 2px; }

/* Attribute selector */
a[target="_blank"] { color: #059669; }

/* nth-child */
.list { background: white; padding: 0; list-style: none; border: 1px solid #e5e7eb; border-radius: 8px; margin: 16px 0; }
.list li { padding: 12px 16px; border-bottom: 1px solid #f3f4f6; color: #374151; }
.list li:last-child { border-bottom: none; }
.list li:nth-child(even) { background: #f9fafb; }
.list li:nth-child(1)::before { content: "🥇 "; }

/* Class selector */
.special { color: #7c3aed !important; font-weight: 700; }

/* Form states */
form { margin-top: 16px; display: flex; flex-direction: column; gap: 8px; max-width: 300px; }
input { padding: 10px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none; }
input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
input[type="email"] { background: #f0fdf4; border-color: #86efac; }
input::placeholder { color: #9ca3af; }
button { padding: 10px; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; }`,
      mode: 'html' },
  ],
  exercises: [
    { id: 'sel1', question: 'Which selector targets all <p> elements inside a .container?', type: 'multiple-choice', options: ['.container > p', '.container + p', '.container p', '.container ~ p'], correct: 2, explanation: '.container p (descendant selector, space between) targets ALL <p> elements nested anywhere inside .container. The > child combinator would only target direct children.' },
    { id: 'sel2', question: 'A class selector has how many specificity points?', type: 'multiple-choice', options: ['1', '10', '100', '1000'], correct: 1, explanation: 'Class selectors (.class) have 10 specificity points. Element selectors (p, h1) have 1. ID selectors (#id) have 100. Inline styles have 1000.' },
  ],
  quiz: [
    { id: 'sq1', question: 'Which pseudo-class applies when hovering over an element?', options: [':focus', ':active', ':hover', ':visited'], correct: 2, explanation: ':hover applies when the mouse cursor is positioned over the element. :focus is for keyboard focus, :active is while clicking.' },
    { id: 'sq2', question: 'What does the > combinator do?', options: ['Selects all descendants', 'Selects only direct children', 'Selects adjacent siblings', 'Selects all following siblings'], correct: 1, explanation: 'The child combinator (>) only selects direct children. nav > a selects <a> elements that are direct children of nav, but NOT <a> elements nested deeper.' },
  ],
};
