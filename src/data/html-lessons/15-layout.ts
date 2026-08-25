import type { HtmlLesson } from '../html-curriculum';
export const htmlLayoutLesson: HtmlLesson = {
  id: 'html-layout', title: 'HTML Layout', slug: 'layout', chapter: 'advanced', order: 15,
  difficulty: 'beginner', readingTime: 10, description: 'Understand HTML layout with block vs inline elements, div, span, and modern CSS layout techniques.',
  sections: [
    { type: 'text', content: 'HTML elements have a default display behavior: block or inline. Understanding this is the foundation of all web layout. Modern layouts use CSS Flexbox and Grid (applied to semantic HTML5 elements), not layout tables.' },
    { type: 'heading', content: 'Block vs Inline Elements' },
    { type: 'code', language: 'html',       content: 'Block elements take full width and start on a new line - div, p, h1, section. Inline elements stay within text flow - span, a, strong. Use div as a generic block container when no semantic element fits. Use span to target specific inline text with CSS or JavaScript.',
      code: `<!-- BLOCK elements: take full width, start on new line -->
<div>I am a block element</div>
<p>So am I - I take full width</p>
<h1>Me too</h1>
<ul><li>And me</li></ul>
<header>And header</header>
<section>And section</section>

<!-- INLINE elements: only as wide as content, stay in same line -->
<span>I am inline</span>
<a href="#">Me too</a>
<strong>And me</strong>
<em>And me</em>
<img src="icon.png" alt="icon"> <!-- inline by default! -->

<!-- You can change display with CSS: -->
<span style="display: block;">Inline span acting as block</span>
<div  style="display: inline;">Block div acting as inline</div>` },
    { type: 'heading', content: '<div> and <span> - Generic Containers' },
    { type: 'text', content: '<div> is a block-level container with no semantic meaning. <span> is an inline container with no semantic meaning. Use them when no other semantic element fits, primarily as hooks for CSS and JavaScript.' },
    { type: 'code', language: 'html',       content: 'display:flex creates a flexbox container. Children lay out in a row by default. justify-content distributes items horizontally. align-items aligns them vertically. gap adds spacing between items without needing margins. Flexbox is perfect for nav bars, card rows, and form layouts.',
      code: `<!-- div: block container, groups related elements for layout -->
<div class="card">
  <h2>Card Title</h2>
  <p>Card content here</p>
  <button>Read more</button>
</div>

<div class="grid">
  <div class="col">Column 1</div>
  <div class="col">Column 2</div>
  <div class="col">Column 3</div>
</div>

<!-- span: inline container, styles part of text -->
<p>
  The price is <span class="price">$29.99</span> per month.
  <span class="badge">Best Value</span>
</p>
<p>
  Error: <span style="color:red; font-weight:700">Invalid email address</span>
</p>` },
    { type: 'heading', content: 'A Complete Page Layout with CSS Flexbox' },
    { type: 'code', language: 'html',       content: 'CSS Grid creates two-dimensional layouts - rows and columns at the same time. grid-template-columns defines column widths. repeat(3,1fr) creates three equal columns. grid-template-areas lets you name layout zones. Grid is ideal for full page layouts and card grids.',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Layout Demo</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; min-height: 100vh; display: flex; flex-direction: column; }

    header { background: #1e1e1e; color: white; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; }
    nav a  { color: #9ca3af; text-decoration: none; margin-left: 20px; }
    nav a:hover { color: white; }

    .page-layout { display: flex; flex: 1; }

    main   { flex: 1; padding: 32px 24px; }
    aside  { width: 240px; background: #f9fafb; border-left: 1px solid #e5e7eb; padding: 24px; }

    footer { background: #f4f4f4; border-top: 1px solid #e5e7eb; padding: 16px 24px; text-align: center; font-size: 13px; color: #6b7280; }
  </style>
</head>
<body>
  <header>
    <span>WebDev Atlas</span>
    <nav>
      <a href="#">HTML</a>
      <a href="#">CSS</a>
      <a href="#">JS</a>
    </nav>
  </header>

  <div class="page-layout">
    <main>
      <h1>Main Content Area</h1>
      <p>This is where your primary page content goes.</p>
    </main>
    <aside>
      <h3>Sidebar</h3>
      <p>Related links, ads, or extra info.</p>
    </aside>
  </div>

  <footer>© 2026 WebDev Atlas</footer>
</body>
</html>` },
    { type: 'tryit', title: 'Try It: Block, Inline & Layout',
      html: `<div class="demo">
  <h2>Block Elements (full width)</h2>
  <div class="block-demo">I am a div (block)</div>
  <p class="block-demo">I am a p (block)</p>

  <h2>Inline Elements (fit content)</h2>
  <p>
    Normal text with
    <span class="inline-demo">a span</span>
    and <strong class="inline-demo">strong</strong>
    and <em class="inline-demo">emphasis</em>
    - all inline.
  </p>

  <h2>3-Column Grid Layout</h2>
  <div class="grid">
    <div class="col">Column 1</div>
    <div class="col">Column 2</div>
    <div class="col">Column 3</div>
  </div>

  <h2>Card Layout</h2>
  <div class="cards">
    <div class="card">
      <h3>HTML</h3>
      <p>Structure of web pages</p>
    </div>
    <div class="card">
      <h3>CSS</h3>
      <p>Styling and layout</p>
    </div>
    <div class="card">
      <h3>JavaScript</h3>
      <p>Behavior and interactivity</p>
    </div>
  </div>
</div>`,
      css: `* { box-sizing: border-box; }
body { font-family: system-ui, sans-serif; padding: 20px; background: #f9fafb; }
.demo h2 { font-size: 14px; text-transform: uppercase; color: #6b7280; letter-spacing: .05em; margin: 20px 0 8px; }
.block-demo  { background: #eff6ff; border: 2px solid #bfdbfe; padding: 10px; color: #1d4ed8; margin: 4px 0; border-radius: 6px; }
.inline-demo { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 2px 8px; color: #15803d; border-radius: 4px; }
.grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; }
.col  { background: #f4f4f4; border: 1px solid #e5e7eb; padding: 16px; border-radius: 8px; text-align: center; font-size: 14px; color: #374151; }
.cards { display: flex; gap: 12px; flex-wrap: wrap; }
.card { background: white; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; flex: 1; min-width: 130px; }
.card h3 { color: #2563eb; font-size: 15px; margin-bottom: 4px; }
.card p  { color: #6b7280; font-size: 13px; margin: 0; }`,
      mode: 'html' },
  ],
  exercises: [{ id: 'lay1', question: 'Which element is a block-level generic container with no semantic meaning?', type: 'multiple-choice', options: ['<span>', '<section>', '<div>', '<p>'], correct: 2, explanation: '<div> is a block-level container with no semantic meaning. Use it only when no semantic element fits. <span> is the inline equivalent.' }],
  quiz: [{ id: 'lq1', question: 'By default, how wide is a block element?', options: ['Only as wide as its content', 'Exactly 100px', 'The full width of its parent container', 'Depends on the browser'], correct: 2, explanation: 'Block elements expand to fill the full width of their parent container by default. You can change this with CSS properties like width, max-width, or display:inline-block.' }],
};
