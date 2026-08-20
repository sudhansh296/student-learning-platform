import type { HtmlLesson } from '../html-curriculum';

export const htmlStylesLesson: HtmlLesson = {
  id: 'html-styles',
  title: 'HTML Styles',
  slug: 'styles',
  chapter: 'text',
  order: 6,
  difficulty: 'beginner',
  readingTime: 8,
  description: 'Add styles to HTML elements using the style attribute, inline CSS, and understand how CSS connects to HTML.',
  sections: [
    { type: 'text', content: 'The HTML style attribute is used to add styles to an element, such as color, font, size, and more. CSS (Cascading Style Sheets) is what makes HTML look good. There are three ways to add CSS to HTML: inline styles (style attribute), internal styles (<style> tag in <head>), and external stylesheets (separate .css file).' },
    { type: 'heading', content: 'The style Attribute' },
    { type: 'code', language: 'html', content: 'Inline styles apply CSS directly on one element using the style attribute. They have the highest specificity so they override all other CSS. Use them sparingly — only for truly one-off styles. For anything reusable, put it in a class in an external CSS file.', code: `<!-- Inline style: directly on the element -->
<p style="color: red;">This text is red.</p>
<p style="color: blue; font-size: 20px;">Blue and bigger.</p>
<h1 style="background-color: yellow; color: black;">Yellow background</h1>
<div style="border: 2px solid #2563eb; padding: 16px; border-radius: 8px;">
  Boxed content
</div>` },
    { type: 'heading', content: 'Internal Styles — <style> in <head>' },
    { type: 'code', language: 'html', content: 'A style element inside head defines CSS that applies to the whole page. Better than inline styles — write the CSS once and it applies to all matching elements. Still limited to one page. For multi-page sites, use external stylesheets so one CSS file can control all pages.', code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { background-color: #f9fafb; font-family: sans-serif; }
    h1   { color: #2563eb; text-align: center; }
    p    { color: #374151; font-size: 16px; line-height: 1.6; }
    .highlight { background: yellow; padding: 2px 6px; }
  </style>
</head>
<body>
  <h1>Styled with Internal CSS</h1>
  <p>This paragraph has <span class="highlight">highlighted text</span>.</p>
</body>
</html>` },
    { type: 'heading', content: 'External Stylesheet — Best Practice' },
    { type: 'code', language: 'html', content: 'A link element in head connects your HTML to a separate .css file. This is the professional standard — one CSS file styles all pages. Changing it updates the whole site instantly. Keep the CSS file path relative so it works on any hosting environment.', code: `<!-- In your HTML file, link to a .css file -->
<head>
  <link rel="stylesheet" href="styles.css">
</head>` },
    { type: 'code', language: 'html',       content: 'This is what the linked CSS file contains. Selectors target elements by tag name (body, h1, p). Each rule applies styles that cascade down to all matching elements across every page that links this file. This separation of HTML structure and CSS presentation is a fundamental principle of web development.',
      code: `/* styles.css — a separate file */
body { margin: 0; font-family: system-ui, sans-serif; }
h1   { color: #2563eb; }
p    { color: #374151; line-height: 1.7; }` },
    { type: 'tip', title: 'External CSS is the professional way', content: 'Always use external CSS files in real projects. One CSS file can style hundreds of HTML pages. Change one file — update the whole site instantly.' },
    { type: 'heading', content: 'Common CSS Properties for Beginners' },
    { type: 'table', headers: ['Property', 'Example Value', 'What It Does'], rows: [
      ['color', 'color: red', 'Sets text color'],
      ['background-color', 'background-color: #f0f0f0', 'Sets background color'],
      ['font-size', 'font-size: 18px', 'Sets text size'],
      ['font-family', 'font-family: Arial', 'Sets font'],
      ['font-weight', 'font-weight: bold', 'Bold text'],
      ['text-align', 'text-align: center', 'Aligns text left/center/right'],
      ['padding', 'padding: 16px', 'Space inside the element'],
      ['margin', 'margin: 20px', 'Space outside the element'],
      ['border', 'border: 1px solid black', 'Adds a border'],
      ['border-radius', 'border-radius: 8px', 'Rounds corners'],
    ]},
    { type: 'tryit', title: 'Try It: HTML Styles',
      html: `<h1>Styled HTML Page</h1>
<p class="intro">This paragraph uses a CSS class for styling.</p>
<p style="color: #7c3aed; font-style: italic;">This uses inline style.</p>
<div class="card">
  <h2>Card Component</h2>
  <p>Cards are everywhere in modern web design.</p>
  <button>Click Me</button>
</div>`,
      css: `body { font-family: system-ui, sans-serif; padding: 24px; background: #f9fafb; }
h1 { color: #1e1e1e; font-size: 2rem; margin-bottom: 8px; }
.intro { color: #374151; font-size: 16px; }
.card { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; max-width: 300px; box-shadow: 0 2px 8px rgba(0,0,0,.08); margin-top: 16px; }
.card h2 { color: #2563eb; margin: 0 0 8px; }
.card p  { color: #6b7280; font-size: 14px; margin: 0 0 16px; }
button   { background: #2563eb; color: white; border: none; padding: 8px 18px; border-radius: 8px; cursor: pointer; font-size: 14px; }`,
      mode: 'html' },
  ],
  exercises: [
    { id: 's1', question: 'Which is the recommended way to add CSS to a large website?', type: 'multiple-choice', options: ['Inline style attribute on every element', 'External .css file linked with <link>', '<style> tag in every page', 'JavaScript only'], correct: 1, explanation: 'External CSS files are the professional standard. One file controls all pages, making updates easy and keeping HTML clean.' },
  ],
  quiz: [{ id: 'sq1', question: 'What CSS property changes the text color?', options: ['font-color', 'text-color', 'color', 'foreground'], correct: 2, explanation: 'The "color" property sets the text color. Example: color: red; or color: #2563eb;' }],
};
