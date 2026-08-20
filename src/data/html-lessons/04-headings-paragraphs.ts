import type { HtmlLesson } from '../html-curriculum';

export const htmlHeadingsLesson: HtmlLesson = {
  id: 'html-headings',
  title: 'Headings & Paragraphs',
  slug: 'headings-paragraphs',
  chapter: 'text',
  order: 4,
  difficulty: 'beginner',
  readingTime: 8,
  description: 'Master HTML headings (h1-h6), paragraphs, line breaks, horizontal rules, and text formatting.',
  sections: [
    {
      type: 'heading',
      content: 'HTML Headings',
    },
    {
      type: 'text',
      content: 'HTML has six levels of headings, from h1 (most important) to h6 (least important). Headings define the hierarchy of your content. Search engines use headings to understand the structure and topic of your page. Screen readers use them for navigation. Use them in order — don\'t skip from h1 to h4.',
    },
    {
      type: 'code',
      language: 'html',
      content: 'HTML has six heading levels — h1 through h6. Use only ONE h1 per page for the main title. Use headings in order without skipping levels. Search engines and screen readers use headings to understand content structure.',
      code: `<h1>Heading 1 — Main Page Title (use ONCE per page)</h1>
<h2>Heading 2 — Major Section</h2>
<h3>Heading 3 — Subsection</h3>
<h4>Heading 4 — Sub-subsection</h4>
<h5>Heading 5 — Rarely used</h5>
<h6>Heading 6 — Smallest heading</h6>`,
    },
    {
      type: 'note',
      title: 'SEO Rule: Only ONE h1 per page',
      content: 'Use only one <h1> tag per page — it should be the main topic of the page. Use h2 for major sections, h3 for subsections within those. This hierarchy helps Google understand your content and improves search rankings.',
    },
    {
      type: 'heading',
      content: 'HTML Paragraphs',
    },
    {
      type: 'text',
      content: 'The <p> tag defines a paragraph. Browsers automatically add some space (margin) above and below each paragraph. This is why text naturally separates into readable blocks. Notice: extra whitespace and line breaks in your HTML code are ignored by browsers.',
    },
    {
      type: 'code',
      language: 'html',
      content: 'The p element creates a paragraph block with automatic spacing above and below. Browsers ignore extra whitespace in HTML — multiple spaces and line breaks in your source code are collapsed to one space. Use br only to force a line break inside a paragraph without starting a new one.',
      code: `<p>This is the first paragraph. It can be as long as you want.</p>

<p>This is the second paragraph. Notice the space between them.</p>

<!-- Extra spaces and line breaks in HTML are IGNORED by browsers -->
<p>This      has      lots
   of
   spaces and line breaks inside HTML.
   But the browser shows it as one line.</p>

<!-- To force a line break inside a paragraph, use <br> -->
<p>First line of address.<br>
City, State 12345<br>
United States</p>`,
    },
    {
      type: 'heading',
      content: 'Line Breaks and Horizontal Rules',
    },
    {
      type: 'code',
      language: 'html',
      content: 'br creates a line break inside a paragraph — useful for addresses and poetry where you want a new line without a new paragraph. hr draws a horizontal dividing line across the page — used to separate sections of content visually.',
      code: `<!-- <br> — line break (empty element, no closing tag) -->
<p>Roses are red,<br>
Violets are blue,<br>
HTML is awesome,<br>
And so are you!</p>

<!-- <hr> — horizontal rule, creates a visible dividing line -->
<h2>Chapter 1</h2>
<p>Content of chapter one...</p>

<hr>

<h2>Chapter 2</h2>
<p>Content of chapter two...</p>`,
    },
    {
      type: 'heading',
      content: 'Text Formatting Elements',
    },
    {
      type: 'text',
      content: 'HTML has several elements for formatting text. Some are purely visual (like <b> and <i>) and some carry semantic meaning (like <strong> and <em>). Always prefer semantic elements because they communicate meaning to browsers, screen readers, and search engines.',
    },
    {
      type: 'code',
      language: 'html',
      content: 'Text formatting elements add meaning or visual style to inline text. Prefer strong over b and em over i — the semantic versions convey meaning to screen readers and search engines. mark highlights text. del shows removed content. code displays monospace text for code snippets.',
      code: `<!-- Bold text -->
<b>Bold — visual only, no special meaning</b>
<strong>Strong — bold AND semantically important</strong>

<!-- Italic text -->
<i>Italic — visual only</i>
<em>Emphasis — italic AND semantically emphasized</em>

<!-- Underline (avoid — looks like a link) -->
<u>Underlined text</u>

<!-- Strikethrough -->
<s>Deleted/outdated price: $100</s>

<!-- Highlight -->
<mark>This text is highlighted</mark>

<!-- Small text -->
<small>Fine print and disclaimers go here</small>

<!-- Subscript and Superscript -->
<p>H<sub>2</sub>O (water) — subscript</p>
<p>E = mc<sup>2</sup> — superscript</p>

<!-- Inline code -->
<p>Use the <code>console.log()</code> function to debug.</p>

<!-- Keyboard input -->
<p>Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy.</p>

<!-- Preformatted text (preserves spaces and line breaks) -->
<pre>
  This text
    preserves
      all spacing
</pre>`,
    },
    {
      type: 'table',
      title: 'Text formatting elements reference',
      headers: ['Element', 'Looks Like', 'Semantic Meaning', 'When to Use'],
      rows: [
        ['<strong>', 'Bold', 'High importance', 'Critical information, warnings'],
        ['<b>', 'Bold', 'None (visual only)', 'Keywords, product names'],
        ['<em>', 'Italic', 'Stress emphasis', 'Words you would stress when speaking'],
        ['<i>', 'Italic', 'None (visual only)', 'Technical terms, foreign words, titles'],
        ['<mark>', 'Highlighted', 'Relevant/highlighted', 'Search results, important passages'],
        ['<del>', 'Strikethrough', 'Deleted content', 'Old prices, removed text'],
        ['<ins>', 'Underlined', 'Inserted content', 'New additions, corrections'],
        ['<code>', 'Monospace', 'Computer code', 'Variable names, file names, code snippets'],
        ['<sub>', 'Subscript', 'Subscript', 'Chemical formulas: H₂O'],
        ['<sup>', 'Superscript', 'Superscript', 'Math exponents: x²'],
      ],
    },
    {
      type: 'heading',
      content: 'The <pre> Element — Preformatted Text',
    },
    {
      type: 'text',
      content: 'The <pre> element displays text exactly as written — preserving all spaces, tabs, and line breaks. The text is also displayed in a monospace font. It is mainly used for displaying code samples and ASCII art.',
    },
    {
      type: 'tryit',
      title: 'Try It: Headings, Paragraphs & Text Formatting',
      html: `<!DOCTYPE html>
<html lang="en">
<head><title>Text Elements</title></head>
<body>

  <h1>The Web Developer's Guide</h1>
  <p>A complete reference for modern web development.</p>

  <hr>

  <h2>Chapter 1: HTML Basics</h2>
  <h3>1.1 What is HTML?</h3>
  <p>
    HTML is the <strong>standard markup language</strong> for web pages.
    It was invented by <em>Tim Berners-Lee</em> in 1991.
  </p>

  <h3>1.2 Important Notes</h3>
  <p>
    The formula for water is H<sub>2</sub>O.<br>
    Energy equals mc<sup>2</sup> according to Einstein.
  </p>

  <p>
    <mark>This is highlighted text</mark> — great for search results.
  </p>

  <p>
    Old price: <del>$99.99</del> — New price: <ins>$49.99</ins>
  </p>

  <h3>1.3 Code Examples</h3>
  <p>Use <code>document.getElementById()</code> to select an element.</p>

  <pre>
function greet(name) {
  return "Hello, " + name;
}
  </pre>

  <hr>

  <h2>Chapter 2: CSS</h2>
  <p><small>Chapter 2 coming soon...</small></p>

</body>
</html>`,
      css: `body { font-family: system-ui, sans-serif; padding: 24px; max-width: 700px; line-height: 1.7; color: #1e1e1e; }
h1 { color: #1e1e1e; font-size: 2rem; }
h2 { color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 6px; }
h3 { color: #059669; }
hr { border: none; border-top: 2px solid #e5e7eb; margin: 24px 0; }
code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; font-family: monospace; color: #dc2626; }
pre { background: #f4f4f4; padding: 16px; border-radius: 8px; font-family: monospace; overflow: auto; }
mark { background: #fef9c3; padding: 0 3px; border-radius: 2px; }
del { color: #dc2626; }
ins { color: #059669; text-decoration: none; font-weight: bold; }`,
      mode: 'html',
    },
  ],
  exercises: [
    {
      id: 'head-1',
      question: 'How many <h1> tags should a page typically have?',
      type: 'multiple-choice',
      options: ['As many as needed', 'Exactly 6', 'Only one', 'None — use <title> instead'],
      correct: 2,
      explanation: 'A page should have only ONE <h1> — it represents the main topic/title of the page. Multiple h1s confuse search engines and screen readers. Use h2, h3, etc. for sections.',
    },
    {
      id: 'head-2',
      question: 'What is the difference between <b> and <strong>?',
      type: 'multiple-choice',
      options: [
        'They are identical',
        '<b> is bold with semantic importance, <strong> is just visual bold',
        '<strong> has semantic importance (the content matters), <b> is just visual bold',
        '<b> only works in forms',
      ],
      correct: 2,
      explanation: '<strong> marks text as important — search engines and screen readers understand this carries meaning. <b> just makes text bold visually with no semantic value. Prefer <strong> for important content.',
    },
  ],
  quiz: [
    {
      id: 'qh-1',
      question: 'Which element preserves whitespace and line breaks exactly as written?',
      options: ['<p>', '<br>', '<pre>', '<code>'],
      correct: 2,
      explanation: '<pre> (preformatted) displays text exactly as typed — preserving all spaces, tabs, and newlines. It uses a monospace font. Perfect for code samples.',
    },
    {
      id: 'qh-2',
      question: 'What does <em> do and when should you use it?',
      options: [
        'Makes text larger — use for titles',
        'Makes text italic with semantic emphasis — use when you would stress a word when speaking',
        'Makes text bold — use for warnings',
        'Embeds an image — use for photos',
      ],
      correct: 1,
      explanation: '<em> (emphasis) makes text italic AND tells browsers/screen readers the word is stressed. Think of how you would say "I did NOT say that" — the "NOT" carries emphasis.',
    },
  ],
};
