import type { HtmlLesson } from '../html-curriculum';

export const htmlAttributesLesson: HtmlLesson = {
  id: 'html-attributes',
  title: 'HTML Attributes',
  slug: 'attributes',
  chapter: 'structure',
  order: 3,
  difficulty: 'beginner',
  readingTime: 10,
  description: 'Learn how HTML attributes add extra information to elements — href, src, alt, class, id, style, and more.',
  sections: [
    {
      type: 'text',
      content: 'HTML attributes provide additional information about HTML elements. They are always placed inside the opening tag. Attributes come in name-value pairs like: name="value". They customize how elements behave, where they point to, or how they look.',
    },
    {
      type: 'heading',
      content: 'The Basic Syntax of Attributes',
    },
    {
      type: 'code',
      language: 'html',
            content: 'Attributes go inside the opening tag as name="value" pairs. They give elements extra behavior or information — href tells a link where to go, src tells an image where to find the file, class gives an element a reusable CSS label.',
code: `<!-- Attribute syntax: name="value" inside the opening tag -->
<tagname attribute="value">Content</tagname>

<!-- Real examples: -->
<a href="https://google.com">Visit Google</a>
<img src="photo.jpg" alt="A beautiful photo">
<p class="intro">Welcome text</p>
<input type="email" placeholder="Enter email">`,
    },
    {
      type: 'heading',
      content: 'The href Attribute — Links',
    },
    {
      type: 'text',
      content: 'The href attribute (Hypertext REFerence) is used on <a> elements to define where a link goes. This is how you create clickable hyperlinks that navigate to other pages, websites, or sections of the same page.',
    },
    {
      type: 'code',
      language: 'html',
            content: 'The href attribute (Hypertext REFerence) defines where a link navigates. Use a full URL for external sites, a path for internal pages, #id to jump to a section on the same page, mailto: for email links, and target="_blank" to open in a new tab.',
code: `<!-- Link to an external website -->
<a href="https://www.google.com">Go to Google</a>

<!-- Link to another page in your site -->
<a href="/about.html">About Us</a>

<!-- Link to a specific section on the same page -->
<a href="#section2">Jump to Section 2</a>

<!-- Link that opens in a NEW browser tab -->
<a href="https://github.com" target="_blank">GitHub (new tab)</a>

<!-- Link for email -->
<a href="mailto:hello@example.com">Send Email</a>

<!-- Link for phone call (mobile) -->
<a href="tel:+1234567890">Call Us</a>`,
    },
    {
      type: 'heading',
      content: 'The src and alt Attributes — Images',
    },
    {
      type: 'text',
      content: 'The src attribute tells the browser where the image file is located. The alt attribute provides alternative text that shows if the image fails to load, and is read by screen readers for visually impaired users. ALWAYS write a meaningful alt attribute — it is also important for SEO.',
    },
    {
      type: 'code',
      language: 'html',
            content: 'src tells the browser where the image file is. alt provides text shown when the image fails to load — also read by screen readers. Always write descriptive alt text for accessibility and SEO. Use empty alt="" for purely decorative images.',
code: `<!-- Image from your own website -->
<img src="images/logo.png" alt="Company Logo">

<!-- Image from the internet (URL) -->
<img src="https://via.placeholder.com/300x200" alt="Placeholder image">

<!-- Specify width and height -->
<img src="photo.jpg" alt="A sunset photo" width="400" height="300">

<!-- Bad practice: missing alt -->
<!-- <img src="photo.jpg"> -->

<!-- Good practice: descriptive alt text -->
<img src="team-photo.jpg" alt="The WebDev Atlas team at the 2026 conference">

<!-- Decorative image: use empty alt="" so screen readers skip it -->
<img src="decorative-line.png" alt="">`,
    },
    {
      type: 'heading',
      content: 'The id and class Attributes',
    },
    {
      type: 'text',
      content: 'The id attribute gives a unique identifier to ONE element on the page. The class attribute gives a reusable label to one or more elements. Both are heavily used with CSS (for styling) and JavaScript (for selecting elements).',
    },
    {
      type: 'code',
      language: 'html',
            content: 'id gives one element a unique name on the page — used to target it from CSS (#id) or JavaScript (getElementById). class is reusable — many elements can share the same class name and be styled together. An element can have multiple classes separated by spaces.',
code: `<!-- id — must be unique on the page, used for one specific element -->
<h1 id="main-title">Welcome to WebDev Atlas</h1>
<section id="hero-section">...</section>

<!-- class — reusable, used for multiple elements -->
<p class="intro">First intro paragraph</p>
<p class="intro">Second intro paragraph</p>
<div class="card">Card 1</div>
<div class="card">Card 2</div>

<!-- An element can have multiple classes (space-separated) -->
<button class="btn btn-primary large">Submit</button>

<!-- In CSS, you select by id with # and by class with . -->
<!-- #main-title { color: blue; }     → targets the id -->
<!-- .card { border: 1px solid gray; } → targets all cards -->

<!-- In JavaScript: -->
<!-- document.getElementById("main-title")   → get by id -->
<!-- document.querySelectorAll(".card")       → get all with class -->`,
    },
    {
      type: 'heading',
      content: 'The style Attribute — Inline CSS',
    },
    {
      type: 'text',
      content: 'The style attribute lets you add CSS directly to an HTML element. This is called inline styling. While it works, it is generally not recommended for large projects because it mixes content and presentation and is hard to maintain.',
    },
    {
      type: 'code',
      language: 'html',
            content: 'The style attribute applies CSS directly to one element. This works but mixes HTML with presentation — hard to maintain in large projects. The better approach is to add a class and write the CSS in a separate stylesheet.',
code: `<!-- Inline styles (avoid in production, use class + CSS file instead) -->
<h1 style="color: blue; font-size: 2rem;">Blue Heading</h1>
<p style="color: red; background: yellow; padding: 10px;">Warning message</p>
<div style="display: flex; gap: 1rem; padding: 20px;">...</div>

<!-- Better approach: use a class and external CSS -->
<h1 class="page-title">Heading</h1>
<!-- In your CSS file: .page-title { color: blue; font-size: 2rem; } -->`,
    },
    {
      type: 'heading',
      content: 'The title Attribute — Tooltips',
    },
    {
      type: 'code',
      language: 'html',
            content: 'The title attribute adds a tooltip that appears when the user hovers over the element. Useful for abbreviations (abbr), links, and any element where extra context helps the user understand what it is or where it goes.',
code: `<!-- title adds a tooltip on hover -->
<p title="This explains more about the topic">Hover over me</p>
<abbr title="HyperText Markup Language">HTML</abbr>
<a href="/" title="Go back to the home page">Home</a>`,
    },
    {
      type: 'heading',
      content: 'Global Attributes (Work on ALL Elements)',
    },
    {
      type: 'table',
      title: 'Most important global attributes',
      headers: ['Attribute', 'Example', 'What It Does'],
      rows: [
        ['id', 'id="hero"', 'Unique identifier for an element'],
        ['class', 'class="card"', 'Reusable label for styling/scripting'],
        ['style', 'style="color:red"', 'Inline CSS styles'],
        ['title', 'title="Tooltip"', 'Shows a tooltip on hover'],
        ['lang', 'lang="en"', 'Sets the language of the element content'],
        ['hidden', 'hidden', 'Hides the element (display:none)'],
        ['tabindex', 'tabindex="0"', 'Controls keyboard tab order'],
        ['data-*', 'data-id="42"', 'Custom data attributes for JavaScript'],
      ],
    },
    {
      type: 'tryit',
      title: 'Try It: HTML Attributes in Action',
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <title>Attributes Demo</title>
</head>
<body>

  <h1 id="page-title" style="color: #2563eb;">Attributes Demo</h1>

  <p class="intro">
    Attributes give elements extra <strong>information and behavior</strong>.
  </p>

  <!-- Links with different targets -->
  <h2>Links</h2>
  <p><a href="https://google.com" target="_blank">Open Google in new tab</a></p>
  <p><a href="mailto:hello@example.com">Send an email</a></p>
  <p><a href="#section2">Jump to Section 2 below</a></p>

  <!-- Image with alt text -->
  <h2>Image</h2>
  <img
    src="https://placehold.co/300x150/2563eb/white?text=HTML+Image"
    alt="A placeholder image showing HTML text"
    width="300"
    height="150"
  />

  <!-- Multiple classes -->
  <h2>Styled Boxes</h2>
  <div class="box primary">Primary Box</div>
  <div class="box secondary">Secondary Box</div>

  <!-- id for anchor link -->
  <h2 id="section2">Section 2 (Linked from above)</h2>
  <p>You jumped here from the link at the top!</p>

</body>
</html>`,
      css: `body { font-family: system-ui, sans-serif; padding: 20px; line-height: 1.6; }
h1 { margin-bottom: 8px; }
.intro { font-size: 16px; color: #444; }
a { color: #2563eb; }
.box { padding: 12px 16px; border-radius: 8px; margin: 8px 0; font-weight: 600; }
.primary { background: #eff6ff; border: 2px solid #2563eb; color: #1d4ed8; }
.secondary { background: #f5f3ff; border: 2px solid #7c3aed; color: #6d28d9; }`,
      mode: 'html',
    },
    {
      type: 'tip',
      title: 'Always use double quotes around attribute values',
      content: 'The HTML standard allows single quotes, double quotes, or even no quotes in some cases. But always use double quotes: class="container". This is the universal convention and prevents bugs.',
    },
  ],
  exercises: [
    {
      id: 'attr-1',
      question: 'What attribute makes a link open in a new browser tab?',
      type: 'multiple-choice',
      options: ['new="tab"', 'open="new"', 'target="_blank"', 'tab="true"'],
      correct: 2,
      explanation: 'target="_blank" tells the browser to open the link in a new tab. Be careful: when using target="_blank", also add rel="noopener noreferrer" for security.',
    },
    {
      id: 'attr-2',
      question: 'Why is the alt attribute on <img> important?',
      type: 'multiple-choice',
      options: [
        'It sets the image size',
        'It is shown if the image fails to load and is read by screen readers',
        'It is the image file name',
        'It adds a border to the image',
      ],
      correct: 1,
      explanation: 'alt (alternative text) shows when the image cannot load and is read aloud by screen readers for visually impaired users. It also helps search engines understand your images.',
    },
    {
      id: 'attr-3',
      question: 'Can a single element have multiple classes?',
      type: 'multiple-choice',
      options: [
        'No, only one class is allowed',
        'Yes, separate them with spaces: class="btn primary large"',
        'Yes, separate them with commas: class="btn,primary,large"',
        'Yes, use multiple class attributes',
      ],
      correct: 1,
      explanation: 'An element can have multiple classes, separated by spaces inside one class attribute. Example: class="btn primary large" applies three CSS classes to that element.',
    },
  ],
  quiz: [
    {
      id: 'qa-1',
      question: 'What is the difference between id and class?',
      options: [
        'id is for styling, class is for JavaScript',
        'id must be unique (one per page), class can be reused on many elements',
        'They are identical in behavior',
        'id uses # in CSS, class uses . in HTML',
      ],
      correct: 1,
      explanation: 'id must be unique — only one element on the page should have a given id. class is reusable — many elements can share the same class name.',
    },
    {
      id: 'qa-2',
      question: 'Which attribute adds custom data that JavaScript can access?',
      options: ['custom="value"', 'js-data="value"', 'data-*="value"', 'info="value"'],
      correct: 2,
      explanation: 'data-* attributes let you embed custom data in HTML. Example: data-id="42" can be accessed in JS with element.dataset.id. They are widely used in React, Vue, and vanilla JS.',
    },
  ],
};
