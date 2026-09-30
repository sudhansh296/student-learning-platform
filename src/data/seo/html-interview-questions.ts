import { code } from './cheatsheet-types';
import type { QuestionBank } from './question-types';

export const htmlInterview: QuestionBank = {
  path: '/html-interview-questions',
  mode: 'interview',
  tech: 'html',
  codeLang: 'html',
  badge: 'HTML interview',
  title: 'HTML Interview Questions and Answers',
  description: '50+ HTML interview questions with clear answers: semantic elements, forms, accessibility, tables, media and the head section.',
  h1: 'HTML Interview Questions and Answers (Freshers to Frontend Developers)',
  intro: 'Fifty-plus HTML interview questions grouped by topic: the fundamentals, elements and semantic HTML, links, images and media, forms, tables, attributes, accessibility, and the head section. Each has a short answer, a fuller explanation and, where it helps, a runnable HTML example you can open in the code editor.',
  notes: [
    {
      id: 'how-to-use',
      title: 'How to use this page',
      text: 'Read the short answer first, then open the longer explanation for the reasoning. Run the examples in the editor and change them to see how the rendered page changes. The questions move from fundamentals through semantic elements, forms and accessibility to the head section, so jump to the group you need.',
      placement: 'top',
    },
    {
      id: 'common-mistakes',
      title: 'Common mistakes beginners make',
      items: [
        'Using a <div> or <span> for everything instead of a semantic element. Fix: a <nav>, <button> or <article> tells the browser, screen readers and search engines what the content actually is — a <div> tells them nothing.',
        'Leaving out the alt attribute on an <img>, or filling it with a filename. Fix: alt should describe what the image conveys, and should be an empty string alt="" specifically for a purely decorative image.',
        'Nesting a <label> around an input without a matching for/id pair, or skipping a label entirely. Fix: every form control needs an associated label, or it is unusable for a screen reader user and harder to click for everyone else.',
        'Skipping heading levels (h1 straight to h3). Fix: heading levels should be sequential — they form the page\'s outline for assistive technology, not just a font-size shortcut.',
      ],
    },
    {
      id: 'real-projects',
      title: 'Where this helps in real projects',
      items: [
        'Structuring a page with semantic elements so it is both easier to style predictably and more accessible by default.',
        'Building a form that validates common cases (required fields, email format) without JavaScript, using built-in input types and attributes.',
        'Writing meta tags that control how a page looks when shared on social media and how it is indexed by search engines.',
        'Making images and media responsive and accessible across devices and for screen reader users.',
      ],
    },
    {
      id: 'study-tip',
      title: 'Study tip',
      text: 'Take one page from a site you like and imagine rebuilding its markup using only semantic elements (header, nav, main, article, section, aside, footer) — no divs unless nothing semantic fits. Interviewers ask about semantic HTML constantly, and this exercise is the fastest way to actually understand why it matters, not just recite the element names.',
    },
  ],
  groups: [
    {
      id: 'fundamentals',
      title: 'HTML fundamentals',
      items: [
        { q: 'What is HTML, and what is its main job?', level: 'beginner', short: 'HyperText Markup Language: it structures content on the web using elements (tags) that describe what a piece of content is — a heading, a paragraph, a list, an image — not how it looks.', code: code('<h1>Page title</h1>', '<p>A paragraph of text.</p>'), long: 'HTML is one of the three core web technologies: HTML structures content, CSS styles it, and JavaScript adds behavior. A browser reads HTML and builds the DOM (Document Object Model), the in-memory tree structure it renders and that JavaScript can manipulate.', lessons: ['html/introduction'] },
        { q: 'What does <!DOCTYPE html> do, and what happens without it?', level: 'beginner', short: 'It tells the browser to render the page in standards mode, following the modern HTML5 rules. Without it, older browsers can fall back to "quirks mode," which emulates old, inconsistent rendering behavior from the 1990s.', code: code('<!DOCTYPE html>', '<html lang="en">', '<head><title>My Page</title></head>', '<body><h1>Hello</h1></body>', '</html>'), lessons: ['html/introduction'] },
        { q: 'What is the difference between an HTML element, a tag and an attribute?', level: 'beginner', short: 'A tag is the markup itself, like <p> or </p>. An element is the tag(s) plus its content — <p>Hello</p> is a paragraph element. An attribute provides extra information on the opening tag, like <a href="...">.', code: code('<a href="https://example.com" target="_blank">Visit</a>'), lessons: ['html/introduction'] },
        { q: 'What is the difference between a block-level element and an inline element?', level: 'beginner', short: 'A block-level element (like <div>, <p>, <h1>) starts on a new line and takes the full available width by default. An inline element (like <span>, <a>, <strong>) flows within the surrounding text and only takes as much width as its content.', code: code('<p>This is a block. <span>This span is inline.</span></p>'), lessons: ['html/elements'] },
        { q: 'What is a void (self-closing) element?', level: 'beginner', short: 'An element that cannot have any content or a closing tag, because it represents a single thing on its own — <img>, <br>, <hr>, <input>, <meta> are common examples.', code: code('<img src="photo.jpg" alt="A sample photo">', '<br>', '<hr>'), lessons: ['html/elements'] },
        { q: 'What major features did HTML5 introduce?', level: 'intermediate', short: 'Semantic elements (header, nav, main, article, section, footer), native audio/video without plugins, the canvas element for graphics, new form input types, and APIs like localStorage and geolocation.', long: 'Before HTML5, developers relied on generic divs with class names like class="header" or class="nav" to fake structure, and on Flash for video — HTML5 made much of that built into the language itself.', lessons: ['html/introduction'] },
      ],
    },
    {
      id: 'semantic',
      title: 'Semantic HTML',
      items: [
        { q: 'What does "semantic HTML" mean, and why does it matter?', level: 'beginner', short: 'Using elements that describe the meaning of their content, not just its visual appearance — <nav> for navigation, <article> for self-contained content, instead of a <div> for everything. It matters for accessibility (screen readers understand the structure), SEO (search engines weigh semantic content), and maintainability.', code: code('<header>', '  <h1>My Site</h1>', '  <nav><a href="/">Home</a> <a href="/about">About</a></nav>', '</header>', '<main>', '  <article><h2>Post title</h2><p>Content...</p></article>', '</main>', '<footer>&copy; 2026</footer>'), lessons: ['html/semantic'] },
        { q: 'What is the difference between <section> and <article>?', level: 'intermediate', short: '<article> is content that could stand alone and make sense independently, like a blog post or a news story. <section> groups related content together thematically but is not necessarily meant to stand alone.', code: code('<article>', '  <h2>How to Learn HTML</h2>', '  <section><h3>Getting Started</h3><p>...</p></section>', '  <section><h3>Next Steps</h3><p>...</p></section>', '</article>'), lessons: ['html/semantic'] },
        { q: 'When should you still use a <div> or <span>?', level: 'intermediate', short: 'When there is genuinely no semantic meaning to express — a wrapper purely for styling or layout purposes (a grid container, a flex wrapper) is exactly what <div> and <span> are for.', long: 'Semantic HTML is about using the right element when one exists with real meaning; it is not about eliminating div/span entirely. A layout wrapper with no independent meaning of its own is a legitimate use of <div>.' },
        { q: 'What is the difference between <main>, <header> and <footer>?', level: 'beginner', short: '<main> wraps the one, primary content of the page (used once per page). <header> is introductory content for the page or a section (often a logo and navigation). <footer> is closing content for the page or a section (often copyright, links).', code: code('<body>', '  <header><h1>Site Name</h1></header>', '  <main><h2>Page Content</h2></main>', '  <footer>&copy; 2026</footer>', '</body>'), lessons: ['html/semantic'] },
        { q: 'What is the correct way to structure heading levels (h1-h6)?', level: 'intermediate', short: 'Sequentially, like an outline: one h1 per page for the main title, then h2 for major sections, h3 for subsections within an h2, and so on — never skip a level just to get a smaller default font size.', long: 'Screen reader users often navigate a page by jumping between headings, using the levels to understand the page\'s structure. Skipping from h1 to h3 breaks that outline, even if visually nothing looks wrong.', lessons: ['html/headings-paragraphs'] },
      ],
    },
    {
      id: 'links-media',
      title: 'Links, images and media',
      items: [
        { q: 'What does the target="_blank" attribute do, and what security consideration comes with it?', level: 'intermediate', short: 'It opens the link in a new browser tab. When used, it should be paired with rel="noopener" (or rel="noopener noreferrer") because otherwise the newly opened page can access window.opener and redirect the original tab — a real phishing vector.', code: code('<a href="https://example.com" target="_blank" rel="noopener noreferrer">External link</a>'), lessons: ['html/links'] },
        { q: 'What is the difference between an absolute and a relative URL in an href?', level: 'beginner', short: 'An absolute URL includes the full address (https://example.com/page). A relative URL is resolved against the current page\'s location (/page, or ../page) — shorter to write, and it keeps working automatically if the whole site moves domains.', code: code('<a href="/about">Relative (from site root)</a>', '<a href="https://example.com/about">Absolute</a>'), lessons: ['html/links'] },
        { q: 'Why does the alt attribute on an <img> matter, and what should good alt text look like?', level: 'beginner', short: 'It is read aloud by screen readers, shown if the image fails to load, and used by search engines — good alt text describes what the image conveys in context, concisely, without starting with "image of" (screen readers already announce it as an image).', code: code('<img src="chart.png" alt="Sales grew 40% from January to March">', '<img src="decorative-line.png" alt="">'), long: 'A purely decorative image (one that adds nothing informational) should have an empty alt="" so screen readers skip it entirely, rather than reading a meaningless description aloud.', lessons: ['html/images'] },
        { q: 'How do you make an image responsive to different screen sizes and pixel densities?', level: 'advanced', short: 'The srcset attribute lets the browser pick the best image file from a set of options based on the viewport size and device pixel density, instead of the developer forcing one fixed file on every device.', code: code('<img', '  src="photo-800w.jpg"', '  srcset="photo-400w.jpg 400w, photo-800w.jpg 800w, photo-1200w.jpg 1200w"', '  sizes="(max-width: 600px) 400px, 800px"', '  alt="A landscape photo">'), lessons: ['html/images'] },
        { q: 'What does the <picture> element let you do that a plain <img> cannot?', level: 'advanced', short: 'It lets you serve entirely different image sources based on conditions (screen size, or format support like WebP with a JPEG fallback), not just different resolutions of the same image — the browser picks the first matching <source>, falling back to the <img> inside.', code: code('<picture>', '  <source srcset="photo.webp" type="image/webp">', '  <source srcset="photo.jpg" type="image/jpeg">', '  <img src="photo.jpg" alt="A landscape photo">', '</picture>'), lessons: ['html/images'] },
      ],
    },
    {
      id: 'forms',
      title: 'Forms',
      items: [
        { q: 'What is the difference between GET and POST as a form method?', level: 'beginner', short: 'GET appends form data to the URL as a query string (visible, bookmarkable, has a length limit) — appropriate for search or filtering. POST sends data in the request body (not visible in the URL, no practical length limit) — appropriate for anything that changes data or includes sensitive information.', code: code('<form action="/search" method="GET">', '  <input type="text" name="q">', '  <button type="submit">Search</button>', '</form>'), lessons: ['html/forms'] },
        { q: 'Why must every form input have an associated <label>, and how do you associate them?', level: 'beginner', short: 'A label makes the input\'s purpose available to screen readers, and clicking the label text focuses (or toggles) the input — a real usability and accessibility requirement, not just a nicety. Associate them with a matching for and id, or by wrapping the input inside the label.', code: code('<label for="email">Email</label>', '<input type="email" id="email" name="email">', '', '<label>Email <input type="email" name="email2"></label>'), lessons: ['html/forms'] },
        { q: 'What are some built-in HTML5 input types that help with validation?', level: 'intermediate', short: 'type="email" (requires a valid email shape), type="number" (numeric input, with min/max/step), type="url", type="tel", type="date" — the browser validates and often provides a better on-screen keyboard on mobile, without any JavaScript.', code: code('<input type="email" required>', '<input type="number" min="1" max="10" step="1">', '<input type="date">'), lessons: ['html/forms'] },
        { q: 'What does the required attribute do, and is it enough validation on its own?', level: 'intermediate', short: 'It prevents form submission (and shows a browser-native error message) if the field is empty. It is a useful first line of defense but never sufficient alone — always validate again on the server, since client-side validation (including required) can be bypassed entirely.', code: code('<input type="text" name="username" required minlength="3">'), lessons: ['html/forms'] },
        { q: 'What is the difference between a disabled and a readonly input?', level: 'intermediate', short: 'A disabled input cannot be focused, edited, or submitted with the form at all — its value is left out of the form data entirely. A readonly input can be focused and its value is still submitted, but the user cannot edit it.', code: code('<input type="text" value="Cannot edit or submit" disabled>', '<input type="text" value="Cannot edit, but submits" readonly>'), lessons: ['html/forms'] },
        { q: 'What are radio buttons and checkboxes used for, and what makes radio buttons mutually exclusive?', level: 'beginner', short: 'Checkboxes let a user select any number of independent options. Radio buttons let a user pick exactly one option from a group — they become mutually exclusive by sharing the same name attribute.', code: code('<input type="radio" name="plan" value="free" id="free"> <label for="free">Free</label>', '<input type="radio" name="plan" value="pro" id="pro"> <label for="pro">Pro</label>'), lessons: ['html/forms'] },
      ],
    },
    {
      id: 'tables',
      title: 'Tables',
      items: [
        { q: 'What is the basic structure of an HTML table?', level: 'beginner', short: '<table> wraps the whole thing, <tr> is a row, <th> is a header cell, <td> is a data cell — optionally grouped into <thead>, <tbody> and <tfoot> for header, body and footer sections.', code: code('<table>', '  <thead><tr><th>Name</th><th>Age</th></tr></thead>', '  <tbody><tr><td>Ada</td><td>36</td></tr></tbody>', '</table>'), lessons: ['html/tables'] },
        { q: 'What do colspan and rowspan do?', level: 'intermediate', short: 'colspan makes a cell span multiple columns; rowspan makes a cell span multiple rows — used for headers or cells that logically cover more than one row or column.', code: code('<table>', '  <tr><th colspan="2">Full Name</th></tr>', '  <tr><td>Ada</td><td>Lovelace</td></tr>', '</table>'), lessons: ['html/tables'] },
        { q: 'Why is it considered bad practice to use tables for page layout?', level: 'intermediate', short: 'A table is semantically meant for tabular data, not layout — using it for layout confuses screen readers (which try to announce it as a data table), makes responsive design much harder, and mixes structure with presentation. CSS (flexbox, grid) is the correct tool for layout.', long: 'This was common in the early 2000s before CSS layout was reliable across browsers. Today it is considered an anti-pattern, and semantic HTML plus CSS Grid/Flexbox is the standard approach.' },
      ],
    },
    {
      id: 'attributes-accessibility',
      title: 'Attributes and accessibility',
      items: [
        { q: 'What is the difference between class and id?', level: 'beginner', short: 'An id must be unique within the page and identifies one specific element (used for #id CSS selectors, anchor links, and JavaScript lookups). A class can be applied to many elements and is meant for reusable styling or grouping.', code: code('<div id="main-header" class="card highlighted">Content</div>'), lessons: ['html/classes-id'] },
        { q: 'What are data-* attributes used for?', level: 'intermediate', short: 'Custom attributes for storing extra data directly on an element, readable from JavaScript via element.dataset, without inventing a non-standard attribute or abusing class names to carry information.', code: code('<button data-product-id="42" data-action="add-to-cart">Add to cart</button>'), lessons: ['html/attributes'] },
        { q: 'What is ARIA, and when should you reach for it?', level: 'advanced', short: 'Accessible Rich Internet Applications: a set of attributes (role, aria-label, aria-expanded, and more) that describe custom UI behavior to assistive technology, used when a native semantic element cannot express what you need — a "div behaving as a button" needs role="button" and keyboard handling that a real <button> would give you for free.', long: 'The first rule of ARIA is: prefer a native HTML element with built-in semantics over recreating its behavior with a div and ARIA attributes. A real <button> already has the right role, is keyboard-accessible and focusable — ARIA is for filling genuine gaps, not a substitute for using the right element.' },
        { q: 'What is the difference between the title and alt attributes?', level: 'intermediate', short: 'alt is a required, meaningful text alternative for an image, read by screen readers and shown if the image fails to load. title is an optional tooltip shown on hover on almost any element — not reliably read by screen readers and not accessible on touch devices at all.', code: code('<img src="logo.png" alt="Company logo" title="Click to go home">'), lessons: ['html/attributes'] },
        { q: 'What is tabindex used for?', level: 'advanced', short: 'It controls whether an element can receive keyboard focus and in what order. tabindex="0" adds a non-naturally-focusable element (like a div acting as a button) to the natural tab order. tabindex="-1" makes an element focusable only programmatically, not via Tab. A positive value overrides the natural order and should almost always be avoided.', code: code('<div role="button" tabindex="0">Custom button</div>'), lessons: ['html/attributes'] },
      ],
    },
    {
      id: 'head-meta',
      title: 'The head section and meta tags',
      items: [
        { q: 'What is the purpose of the <head> section?', level: 'beginner', short: 'It holds metadata about the page — not visible content itself — like the page title, character encoding, linked stylesheets, meta tags for SEO and social sharing, and favicon.', code: code('<head>', '  <meta charset="UTF-8">', '  <title>My Page</title>', '  <link rel="stylesheet" href="styles.css">', '</head>'), lessons: ['html/head'] },
        { q: 'What does <meta name="viewport" content="width=device-width, initial-scale=1"> do?', level: 'intermediate', short: 'It tells mobile browsers to render the page at the device\'s actual width instead of a default desktop-width viewport zoomed out to fit — without it, a responsive design typically looks tiny and non-responsive on a phone.', code: code('<meta name="viewport" content="width=device-width, initial-scale=1">'), lessons: ['html/head'] },
        { q: 'What is the difference between <meta name="description"> and Open Graph tags?', level: 'intermediate', short: 'meta name="description" is the snippet search engines often show under a page\'s title in results. Open Graph tags (og:title, og:description, og:image) control how the page looks when shared as a link on social media and messaging apps.', code: code('<meta name="description" content="Learn HTML from scratch, for free.">', '<meta property="og:title" content="Learn HTML">', '<meta property="og:image" content="https://example.com/preview.png">'), lessons: ['html/head'] },
        { q: 'What does the charset meta tag do, and why put it first in <head>?', level: 'intermediate', short: '<meta charset="UTF-8"> tells the browser how to decode the byte stream into text. It should be one of the very first things in <head> because the browser needs to know the encoding before it can correctly parse any text that follows, including other meta tags.', code: code('<head>', '  <meta charset="UTF-8">', '  <title>My Page</title>', '</head>'), lessons: ['html/head'] },
      ],
    },
    {
      id: 'js-css-integration',
      title: 'Combining HTML with CSS and JavaScript',
      items: [
        { q: 'What are the three ways to add CSS to an HTML page, and which is generally preferred?', level: 'beginner', short: 'Inline (a style attribute on one element), internal (a <style> block in <head>), and external (a linked .css file). External is generally preferred — it is cacheable by the browser, keeps structure and styling separate, and can be shared across many pages.', code: code('<link rel="stylesheet" href="styles.css">', '<style>h1 { color: navy; }</style>', '<p style="color: red;">Inline styled text</p>'), lessons: ['html/styles'] },
        { q: 'What is the difference between the defer and async attributes on a <script> tag?', level: 'advanced', short: 'Both let the script download in parallel with HTML parsing instead of blocking it. defer waits until the HTML is fully parsed before running the script, and preserves the order of multiple deferred scripts. async runs the script the moment it finishes downloading, whenever that happens, with no guaranteed order relative to other scripts.', code: code('<script src="analytics.js" async></script>', '<script src="app.js" defer></script>'), long: 'For most application scripts that need the DOM to exist and need to run in a predictable order, defer is the safer default. async suits independent scripts, like analytics, where order and DOM-readiness do not matter.', lessons: ['html/javascript-in-html'] },
        { q: 'Where should a plain (non-deferred, non-async) <script> tag be placed, and why?', level: 'intermediate', short: 'Traditionally just before the closing </body> tag — a plain script blocks HTML parsing while it downloads and runs, so placing it at the end lets the rest of the page render first, avoiding a blank-page delay.', code: code('<body>', '  <h1>Page content</h1>', '  <script src="app.js"></script>', '</body>'), lessons: ['html/javascript-in-html'] },
        { q: 'What is an iframe, and what is a real use case for one?', level: 'intermediate', short: 'An inline frame that embeds another HTML document inside the current page, with its own independent browsing context — commonly used for embedding a YouTube video, a map, or third-party widget content that needs to stay isolated from the host page.', code: code('<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Embedded video" width="560" height="315"></iframe>'), long: 'Because an iframe\'s content is isolated, it is also a common security boundary for embedding untrusted third-party content — scripts inside the iframe cannot freely access the parent page\'s DOM, and vice versa, unless both sides explicitly allow it.', lessons: ['html/iframes'] },
      ],
    },
  ],
  tips: [
    'Be ready to explain why semantic HTML matters with a concrete example, not just list the element names — interviewers check for understanding, not memorization.',
    'Know the difference between block and inline elements cold, and be able to name several of each from memory.',
    'Practice explaining form accessibility (labels, required, input types) — it is a very common practical question for frontend roles.',
    'Understand the defer vs async distinction for scripts precisely, including which one preserves execution order.',
    'Be able to sketch a semantic page skeleton (header, nav, main, article/section, aside, footer) without hesitating.',
  ],
  more: [
    { label: 'HTML cheat sheet', href: '/html-cheatsheet' },
    { label: 'CSS interview questions', href: '/css-interview-questions' },
    { label: 'JavaScript interview questions', href: '/javascript-interview-questions' },
    { label: 'HTML lessons', href: '/html' },
    { label: 'Frontend developer roadmap', href: '/frontend-roadmap' },
  ],
};
