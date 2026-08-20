import type { HtmlLesson } from '../html-curriculum';

export const htmlListsLesson: HtmlLesson = {
  id: 'html-lists',
  title: 'HTML Lists',
  slug: 'lists',
  chapter: 'lists',
  order: 9,
  difficulty: 'beginner',
  readingTime: 8,
  description: 'Create unordered, ordered, and description lists. Nest lists, customize markers, and use lists for navigation.',
  sections: [
    { type: 'text', content: 'Lists are everywhere in web design — navigation menus, ingredient lists, step-by-step instructions, feature lists, and more. HTML has three types of lists: Unordered (bullet points), Ordered (numbered), and Description (term + definition pairs).' },
    { type: 'heading', content: 'Unordered Lists — <ul>' },
    { type: 'text', content: 'An unordered list groups items where order does not matter — like a shopping list or feature list. Items are shown with bullet points by default.' },
    { type: 'code', language: 'html',       content: 'The ul element creates a bulleted list where item order does not matter. Each li is one item. Use ul for navigation menus, feature lists, and any group of items without a specific sequence. CSS can change the bullet style or remove it entirely.',
      code: `<h3>Frontend Technologies</h3>
<ul>
  <li>HTML — structure</li>
  <li>CSS  — styling</li>
  <li>JavaScript — behavior</li>
  <li>React — UI library</li>
</ul>

<!-- CSS can change the bullet style -->
<ul style="list-style-type: square;">
  <li>Square bullets</li>
  <li>Another item</li>
</ul>

<ul style="list-style-type: none;">
  <li>No bullets at all (common for nav menus)</li>
  <li>Another item</li>
</ul>` },
    { type: 'heading', content: 'Ordered Lists — <ol>' },
    { type: 'text', content: 'An ordered list is used when sequence matters — like steps in a tutorial, a recipe, or ranking. Items are automatically numbered.' },
    { type: 'code', language: 'html',       content: 'The ol element creates a numbered list where order matters. Use it for step-by-step instructions, recipes, and ranked items. The start attribute changes the starting number. The type attribute switches to letters (A, a) or Roman numerals (I, i).',
      code: `<h3>How to Learn HTML</h3>
<ol>
  <li>Start with the basic document structure</li>
  <li>Learn about elements and tags</li>
  <li>Understand attributes</li>
  <li>Practice with headings and paragraphs</li>
  <li>Build your first complete webpage</li>
</ol>

<!-- Start from a different number -->
<ol start="5">
  <li>This item starts at 5</li>
  <li>This is 6</li>
</ol>

<!-- Different numbering types -->
<ol type="A">  <!-- A, B, C -->
  <li>First</li><li>Second</li>
</ol>
<ol type="I">  <!-- I, II, III (Roman numerals) -->
  <li>First</li><li>Second</li>
</ol>
<ol type="i">  <!-- i, ii, iii (lowercase Roman) -->
  <li>First</li><li>Second</li>
</ol>` },
    { type: 'heading', content: 'Nested Lists' },
    { type: 'code', language: 'html',       content: 'Lists nest by placing a ul or ol inside a li element to create sub-items. Used for multi-level navigation menus, outlines, and hierarchical data. Keep nesting to 2-3 levels maximum to avoid hard-to-read structure.',
      code: `<!-- Lists can be nested inside each other -->
<ul>
  <li>Frontend
    <ul>
      <li>HTML</li>
      <li>CSS
        <ul>
          <li>Flexbox</li>
          <li>Grid</li>
        </ul>
      </li>
      <li>JavaScript</li>
    </ul>
  </li>
  <li>Backend
    <ul>
      <li>Node.js</li>
      <li>Express</li>
      <li>MongoDB</li>
    </ul>
  </li>
</ul>` },
    { type: 'heading', content: 'Description Lists — <dl>' },
    { type: 'text', content: 'A description list pairs terms with their definitions. It is perfect for glossaries, FAQs, and key-value data.' },
    { type: 'code', language: 'html',       content: 'The dl element is for term-definition pairs — glossaries, FAQs, and key-value data. dt is the term, dd is its description. You can have multiple dd elements for one dt. Screen readers announce these as definition lists.',
      code: `<dl>
  <dt>HTML</dt>
  <dd>HyperText Markup Language — the structure of web pages</dd>

  <dt>CSS</dt>
  <dd>Cascading Style Sheets — controls the visual appearance</dd>

  <dt>JavaScript</dt>
  <dd>Programming language that adds interactivity to web pages</dd>
</dl>

<!-- dl, dt, dd stand for: -->
<!-- dl = Description List -->
<!-- dt = Description Term (the word/phrase) -->
<!-- dd = Description Details (the definition) -->` },
    { type: 'heading', content: 'Lists as Navigation Menus' },
    { type: 'code', language: 'html',       content: 'Navigation menus are built from ul and li elements — just styled with CSS to look like a row of links instead of a bullet list. This is the standard pattern for all website navigation. Use a nav element to wrap it for semantic meaning and accessibility.',
code: `<!-- Navigation menus are semantically lists of links -->
<nav>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/html">HTML</a></li>
    <li><a href="/css">CSS</a></li>
    <li><a href="/javascript">JavaScript</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</nav>

<!-- Style with CSS to make it horizontal -->
<style>
nav ul { display: flex; list-style: none; padding: 0; gap: 20px; }
nav a  { text-decoration: none; color: #2563eb; font-weight: 600; }
nav a:hover { text-decoration: underline; }
</style>` },
    { type: 'tryit', title: 'Try It: All List Types',
      html: `<h1>HTML Lists</h1>

<h2>Unordered List</h2>
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
  <li>React</li>
</ul>

<h2>Ordered List</h2>
<ol>
  <li>Install VS Code</li>
  <li>Create index.html</li>
  <li>Write your first HTML</li>
  <li>Open in browser</li>
</ol>

<h2>Nested List</h2>
<ul>
  <li>Frontend
    <ul>
      <li>HTML</li>
      <li>CSS</li>
      <li>JavaScript</li>
    </ul>
  </li>
  <li>Backend
    <ul>
      <li>Node.js</li>
      <li>MongoDB</li>
    </ul>
  </li>
</ul>

<h2>Description List (Glossary)</h2>
<dl>
  <dt>API</dt>
  <dd>Application Programming Interface</dd>
  <dt>DOM</dt>
  <dd>Document Object Model — the tree of HTML elements</dd>
</dl>

<h2>Nav Menu (horizontal)</h2>
<nav>
  <ul class="nav">
    <li><a href="#">Home</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#">Blog</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
</nav>`,
      css: `body { font-family: system-ui, sans-serif; padding: 20px; }
h1 { color: #1e1e1e; }
h2 { color: #2563eb; margin-top: 24px; }
li { color: #374151; margin: 4px 0; }
dl { background: #f9fafb; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb; }
dt { font-weight: 700; color: #1e1e1e; margin-top: 8px; }
dd { color: #6b7280; margin-left: 20px; font-size: 14px; }
.nav { display: flex; list-style: none; padding: 12px 16px; background: #f4f4f4; border-radius: 8px; gap: 20px; margin: 0; }
.nav a { color: #2563eb; text-decoration: none; font-weight: 600; font-size: 14px; }
.nav a:hover { text-decoration: underline; }`,
      mode: 'html' },
  ],
  exercises: [
    { id: 'lst1', question: 'Which HTML tag creates an ordered (numbered) list?', type: 'multiple-choice', options: ['<ul>', '<ol>', '<li>', '<list>'], correct: 1, explanation: '<ol> (ordered list) creates a numbered list. <ul> creates unordered (bullets). Both use <li> for each item.' },
  ],
  quiz: [{ id: 'lq1', question: 'What does <dl> stand for?', options: ['Digital List', 'Display List', 'Description List', 'Default List'], correct: 2, explanation: '<dl> = Description List. Used with <dt> (Description Term) and <dd> (Description Details) for glossaries and term-definition pairs.' }],
};
