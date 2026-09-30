import type { CssLesson } from '../css-curriculum';

export const cssSelectorsLesson: CssLesson = {
  id: 'css-selectors', title: 'CSS Selectors', slug: 'selectors',
  chapter: 'selectors', order: 2, difficulty: 'beginner', readingTime: 17,
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
    {
      type: 'heading',
      content: 'Common mistakes beginners make',
    },
    {
      type: 'list',
      items: [
        'Using ID selectors for styling everywhere. Fix: IDs are very specific and hard to override later; style with classes and keep IDs for page anchors and JavaScript.',
        'Mixing up .card.title with .card .title. Fix: no space means one element that has both classes; a space means a .title somewhere inside a .card.',
        'Reaching for !important to win a fight. Fix: find out why the other rule is stronger (specificity or order) and adjust the selector instead.',
        'Forgetting the dot or hash, for example writing card { } for a class. Fix: classes start with . and IDs with #; plain names select HTML tags.',
        'Assuming the last rule always wins. Fix: specificity decides first; source order only breaks ties between equally specific selectors.',
        'Long selector chains like div ul li a span. Fix: put a class on the element you want to style; short selectors survive HTML changes.',
      ],
    },
    {
      type: 'heading',
      content: 'Where you use this in real projects',
    },
    {
      type: 'list',
      items: [
        'Styling navigation links and their hover and focus states with a:hover and a:focus-visible.',
        'Zebra-striped tables with tr:nth-child(even).',
        'Form feedback such as input:focus, input:invalid and button:disabled.',
        'Decorative icons, quotes and labels with ::before and ::after, without extra HTML.',
        'Targeting only direct children of a menu with .menu > li.',
        'Reusable component classes such as .btn, .btn-primary and .card in a design system.',
      ],
    },
    {
      type: 'heading',
      content: 'Practice task: Style a menu with selectors',
    },
    {
      type: 'text',
      content: 'Turn the plain list into a tidy menu using only selectors. Remove the bullets, colour the links dark grey without underline, give every second item a light background, make the first item bold, and on hover turn the link blue with an underline.',
    },
    {
      type: 'tryit',
      title: 'Style a menu with selectors',
      content: 'Edit the CSS tab, press Run and compare the result with the description below.',
      html: `<ul class="menu">
  <li><a href="#">Home</a></li>
  <li><a href="#">Courses</a></li>
  <li><a href="#">Projects</a></li>
  <li><a href="#">Contact</a></li>
</ul>`,
      css: `.menu {
  width: 240px;
  font-family: system-ui, sans-serif;
}

/* TODO: remove the bullets and default padding from .menu */
/* TODO: stripe every second item with :nth-child(even) */
/* TODO: make the first item bold with :first-child */
/* TODO: style the links, and add a :hover state */`,
      mode: 'css',
    },
    {
      type: 'note',
      title: 'Expected result',
      content: 'A narrow menu with no bullets. Items 2 and 4 have a light grey background, "Home" is bold, and hovering a link turns it blue and underlined.',
    },
    {
      type: 'tip',
      title: 'Hint',
      content: 'Use .menu li:nth-child(even) for the striped rows and .menu li:first-child for the bold item. Put the hover colour on .menu a:hover.',
    },
    {
      type: 'code',
      title: 'Solution (try it yourself first)',
      content: 'One possible solution, as a complete page you can run in the editor. Compare it with your own version.',
      code: `<style>
.menu {
  width: 240px;
  font-family: system-ui, sans-serif;
  list-style: none;
  padding: 0;
}
.menu li { padding: 10px 14px; }
.menu li:nth-child(even) { background: #f1f5f9; }
.menu li:first-child { font-weight: 700; }
.menu a { color: #334155; text-decoration: none; }
.menu a:hover { color: #2563eb; text-decoration: underline; }
</style>

<ul class="menu">
  <li><a href="#">Home</a></li>
  <li><a href="#">Courses</a></li>
  <li><a href="#">Projects</a></li>
  <li><a href="#">Contact</a></li>
</ul>`,
      language: 'html',
    },
    {
      type: 'heading',
      content: 'Frequently asked questions',
    },
    {
      type: 'note',
      title: 'What is CSS specificity?',
      content: 'A score that decides which rule wins when several match the same element. Inline styles beat IDs, IDs beat classes, and classes beat plain element selectors.',
    },
    {
      type: 'note',
      title: 'What is the difference between a class and an ID?',
      content: 'A class can be used on many elements and is the normal way to style. An ID must be unique on the page and is better kept for anchors and scripts.',
    },
    {
      type: 'note',
      title: 'What do the space, > and + combinators mean?',
      content: 'A space selects any descendant, > selects only direct children, and + selects the element that comes right after another.',
    },
    {
      type: 'note',
      title: 'How do I apply one style to several selectors?',
      content: 'Separate them with commas, for example h1, h2, h3 { margin-top: 0; }.',
    },
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
