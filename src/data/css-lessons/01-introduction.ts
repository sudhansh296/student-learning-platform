import type { CssLesson } from '../css-curriculum';

export const cssIntroLesson: CssLesson = {
  id: 'css-intro', title: 'Introduction to CSS', slug: 'introduction',
  chapter: 'basics', order: 1, difficulty: 'beginner', readingTime: 7,
  description: 'What CSS is, why it exists, how it connects to HTML, and the three ways to add CSS to a page.',
  sections: [
    { type: 'text', content: 'CSS stands for Cascading Style Sheets. It is the language that controls how HTML elements look on the screen — their colors, fonts, sizes, spacing, and positions. Without CSS, every website would look like a plain text document.' },
    { type: 'analogy', title: 'HTML vs CSS', content: 'HTML is the skeleton of a web page — it defines structure. CSS is the skin, clothing, and makeup — it defines appearance. The same HTML can look completely different with different CSS applied.' },
    { type: 'heading', content: 'A Simple CSS Example' },
    { type: 'code', language: 'css', code: `/* This is a CSS comment */

/* Select the h1 element and change its color */
h1 {
  color: #2563eb;
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
}

/* Style all paragraphs */
p {
  color: #374151;
  font-size: 16px;
  line-height: 1.75;
  max-width: 65ch;
}

/* Style elements with class="card" */
.card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}` },
    { type: 'heading', content: 'Three Ways to Add CSS' },
    { type: 'list', title: '1. External Stylesheet (Recommended)', items: [
      'Create a separate .css file (e.g., styles.css)',
      'Link it in the HTML <head> with <link rel="stylesheet" href="styles.css">',
      'One file can style all your HTML pages — change once, update everywhere',
      'This is how all professional websites work',
    ]},
    { type: 'code', language: 'html', code: `<!-- In your HTML file -->
<head>
  <link rel="stylesheet" href="styles.css">
</head>` },
    { type: 'list', title: '2. Internal Styles (<style> tag)', items: [
      'Write CSS inside a <style> tag in the <head>',
      'Good for single-page demos or prototypes',
      'Cannot be reused across multiple pages',
    ]},
    { type: 'code', language: 'html', code: `<head>
  <style>
    body { background: #f9fafb; }
    h1   { color: #2563eb; }
  </style>
</head>` },
    { type: 'list', title: '3. Inline Styles (Avoid in production)', items: [
      'Written directly on the HTML element as a style attribute',
      'Highest specificity — overrides everything else',
      'Hard to maintain — avoid except for dynamic JavaScript styling',
    ]},
    { type: 'code', language: 'html', code: `<p style="color: red; font-size: 18px;">This is inline CSS.</p>` },
    { type: 'note', title: 'What does "Cascading" mean?', content: 'The C in CSS means styles cascade — they flow down from parent to child elements, and multiple rules can apply to the same element. When there is a conflict, CSS uses specificity and order to decide which rule wins.' },
    { type: 'tryit', title: 'Try It: Your First CSS',
      html: `<h1>Welcome to CSS!</h1>
<p>CSS makes websites beautiful. Try changing the styles on the left and click Run ▶</p>
<div class="card">
  <h2>This is a Card</h2>
  <p>Cards are a common UI pattern. CSS creates them with background, padding, border-radius, and shadow.</p>
  <button>Click Me</button>
</div>`,
      css: `body {
  font-family: system-ui, sans-serif;
  background: #f0f9ff;
  padding: 24px;
}
h1 { color: #0284c7; font-size: 2rem; margin-bottom: 8px; }
p  { color: #374151; line-height: 1.7; }
.card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e0f2fe;
  max-width: 400px;
  margin-top: 20px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}
.card h2 { color: #0369a1; margin: 0 0 8px; }
button {
  background: #0284c7;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 12px;
}
button:hover { background: #0369a1; }`, mode: 'html' },
  ],
  exercises: [
    { id: 'ci1', question: 'Which method of adding CSS is recommended for professional websites?', type: 'multiple-choice', options: ['Inline styles on each element', 'External .css file linked with <link>', '<style> tag in every HTML file', 'JavaScript styling only'], correct: 1, explanation: 'External CSS files are the professional standard. One file can style all HTML pages. Changing one file updates the entire site instantly.' },
    { id: 'ci2', question: 'What does the "C" in CSS stand for?', type: 'multiple-choice', options: ['Colorful', 'Cascading', 'Computer', 'Creative'], correct: 1, explanation: 'CSS = Cascading Style Sheets. Cascading means styles flow down from parent elements to children, and rules are applied based on specificity and source order.' },
  ],
  quiz: [{ id: 'cq1', question: 'How do you link an external CSS file in HTML?', options: ['<style src="style.css">', '<link rel="stylesheet" href="style.css">', '<css href="style.css">', '<script src="style.css">'], correct: 1, explanation: 'Use <link rel="stylesheet" href="filename.css"> inside <head>. The rel="stylesheet" tells the browser this is a CSS file.' }],
};
