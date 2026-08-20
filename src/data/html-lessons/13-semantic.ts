import type { HtmlLesson } from '../html-curriculum';

export const htmlSemanticLesson: HtmlLesson = {
  id: 'html-semantic',
  title: 'Semantic HTML',
  slug: 'semantic',
  chapter: 'semantic',
  order: 13,
  difficulty: 'intermediate',
  readingTime: 12,
  description: 'Learn semantic HTML5 elements — header, nav, main, section, article, aside, footer — and why they matter for SEO and accessibility.',
  sections: [
    { type: 'text', content: 'Semantic HTML means using HTML elements that carry meaning about the content they contain. Instead of using <div> for everything, you use elements that describe their purpose: <header>, <nav>, <main>, <article>, <section>, <aside>, <footer>. This makes your code readable to humans, browsers, search engines, and assistive technologies.' },
    { type: 'analogy', title: 'Think of a newspaper', content: 'A newspaper has a masthead (header), navigation (table of contents), main stories (articles), sidebars (aside), and a footer. HTML5 semantic elements mirror this structure. A <div> is like blank paper — it has no meaning. A <article> tells everyone "this is a self-contained story."' },
    { type: 'heading', content: 'Non-Semantic vs Semantic HTML' },
    { type: 'code', language: 'html',       content: 'Semantic elements describe their purpose — header, nav, main, article, aside, footer. They replace generic divs with meaningful labels. Screen readers use them to navigate. Search engines use them to understand content hierarchy and importance.',
      code: `<!-- NON-SEMANTIC — div soup. What does each section mean? Nobody knows. -->
<div id="header">
  <div id="logo">WebDev Atlas</div>
  <div id="nav">...</div>
</div>
<div id="main">
  <div class="post">...</div>
  <div id="sidebar">...</div>
</div>
<div id="footer">...</div>

<!-- SEMANTIC — immediately readable. Purpose is clear. -->
<header>
  <h1>WebDev Atlas</h1>
  <nav>...</nav>
</header>
<main>
  <article>...</article>
  <aside>...</aside>
</main>
<footer>...</footer>` },
    { type: 'heading', content: 'The Semantic HTML5 Elements' },
    { type: 'table', headers: ['Element', 'Purpose', 'Example Use'], rows: [
      ['<header>', 'Introductory content for page or section', 'Site logo, navigation, hero section'],
      ['<nav>', 'Navigation links', 'Main menu, breadcrumbs, pagination'],
      ['<main>', 'Primary content of the page (ONE per page)', 'The main article, dashboard content'],
      ['<article>', 'Self-contained, independently distributable content', 'Blog post, news article, forum post'],
      ['<section>', 'Thematic grouping of related content', 'Chapters, tabs, grouped features'],
      ['<aside>', 'Content tangentially related to main content', 'Sidebar, related links, ads'],
      ['<footer>', 'Footer for page or section', 'Copyright, links, contact info'],
      ['<figure>', 'Self-contained content (image, diagram)', 'Image with caption, code example'],
      ['<figcaption>', 'Caption for a figure', 'Image description'],
      ['<time>', 'Date/time value', '<time datetime="2026-08-17">August 17, 2026</time>'],
      ['<mark>', 'Highlighted/relevant text', 'Search result highlighting'],
      ['<details>', 'Disclosure widget (show/hide content)', 'FAQ accordion, details panel'],
      ['<summary>', 'Summary/heading for <details>', 'The visible clickable title of <details>'],
    ]},
    { type: 'heading', content: 'Building a Complete Page Layout' },
    { type: 'code', language: 'html',       content: 'article is for self-contained content that makes sense on its own — a blog post or product card. section groups related content within a page. main contains the unique page content. aside holds related but non-essential content like sidebars or related links.',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WebDev Atlas — Learn HTML</title>
</head>
<body>

  <!-- Site-wide header -->
  <header>
    <a href="/" class="logo">WebDev Atlas</a>
    <nav aria-label="Main navigation">
      <ul>
        <li><a href="/html">HTML</a></li>
        <li><a href="/css">CSS</a></li>
        <li><a href="/js">JavaScript</a></li>
      </ul>
    </nav>
  </header>

  <!-- Primary page content — ONE per page -->
  <main>

    <!-- A self-contained article -->
    <article>
      <header> <!-- Article header (different from site header) -->
        <h1>Introduction to HTML</h1>
        <p>Published: <time datetime="2026-08-17">August 17, 2026</time></p>
      </header>

      <section id="what-is-html">
        <h2>What is HTML?</h2>
        <p>HTML is the standard markup language...</p>
      </section>

      <section id="first-page">
        <h2>Your First HTML Page</h2>
        <figure>
          <img src="screenshot.png" alt="HTML code screenshot">
          <figcaption>A basic HTML5 document structure</figcaption>
        </figure>
      </section>

      <footer> <!-- Article footer -->
        <p>Tags: <a href="/tag/html">HTML</a>, <a href="/tag/beginner">Beginner</a></p>
      </footer>
    </article>

    <!-- Related links sidebar -->
    <aside>
      <h2>Related Topics</h2>
      <ul>
        <li><a href="/html/elements">HTML Elements</a></li>
        <li><a href="/html/attributes">HTML Attributes</a></li>
      </ul>
    </aside>

  </main>

  <!-- Site-wide footer -->
  <footer>
    <p>&copy; 2026 WebDev Atlas. All rights reserved.</p>
    <nav aria-label="Footer navigation">
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
      <a href="/privacy">Privacy</a>
    </nav>
  </footer>

</body>
</html>` },
    { type: 'heading', content: 'The <details> and <summary> Elements — Native Accordion' },
    { type: 'code', language: 'html',       content: 'These inline elements add specific meaning to phrases. mark highlights text. time wraps dates with a machine-readable datetime attribute. abbr defines abbreviations — hovering shows the full form. cite wraps titles of creative works. code shows inline code snippets.',
      code: `<!-- No JavaScript needed! Native browser accordion -->
<details>
  <summary>What is HTML?</summary>
  <p>HTML stands for HyperText Markup Language. It is the standard language used to create web pages.</p>
</details>

<details>
  <summary>Is HTML a programming language?</summary>
  <p>No! HTML is a markup language, not a programming language. It describes the structure of content. JavaScript is the programming language of the web.</p>
</details>

<details open> <!-- "open" attribute makes it expanded by default -->
  <summary>Can I learn HTML in a day?</summary>
  <p>You can learn the basics in a day, but mastering HTML takes weeks of practice. Focus on semantic elements and accessibility.</p>
</details>` },
    { type: 'tryit', title: 'Try It: Semantic Page Layout',
      html: `<!DOCTYPE html>
<html lang="en">
<head><title>Semantic HTML Demo</title></head>
<body>

<header>
  <div class="logo">WebDev<span>Atlas</span></div>
  <nav>
    <a href="#">HTML</a>
    <a href="#">CSS</a>
    <a href="#">JavaScript</a>
  </nav>
</header>

<main>
  <article>
    <h1>Semantic HTML5</h1>
    <p>Published: <time datetime="2026-08-17">August 17, 2026</time></p>
    <p>Semantic HTML uses elements that <strong>describe their meaning</strong> — not just their appearance. This improves SEO, accessibility, and code readability.</p>

    <section>
      <h2>Why It Matters</h2>
      <ul>
        <li>Screen readers navigate by landmarks (header, main, nav)</li>
        <li>Search engines rank semantic pages higher</li>
        <li>Other developers understand your code faster</li>
      </ul>
    </section>

    <section>
      <h2>FAQ</h2>
      <details>
        <summary>What is semantic HTML?</summary>
        <p>Using HTML elements that describe the meaning of content, not just how it looks.</p>
      </details>
      <details>
        <summary>Why use &lt;article&gt; instead of &lt;div&gt;?</summary>
        <p>An &lt;article&gt; tells browsers, SEO crawlers, and screen readers that this is a self-contained piece of content.</p>
      </details>
    </section>
  </article>

  <aside>
    <h3>Related</h3>
    <ul>
      <li><a href="#">HTML Elements</a></li>
      <li><a href="#">HTML Attributes</a></li>
      <li><a href="#">HTML Forms</a></li>
    </ul>
  </aside>
</main>

<footer>
  <p>© 2026 WebDev Atlas</p>
</footer>

</body>
</html>`,
      css: `* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: system-ui, sans-serif; color: #1e1e1e; background: #f9fafb; }
header { background: #1e1e1e; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; }
.logo { color: white; font-weight: 800; font-size: 18px; }
.logo span { color: #60a5fa; }
nav a { color: #9ca3af; text-decoration: none; margin-left: 20px; font-size: 14px; }
nav a:hover { color: white; }
main { max-width: 860px; margin: 0 auto; padding: 32px 24px; display: grid; grid-template-columns: 1fr 220px; gap: 32px; }
article h1 { font-size: 24px; margin-bottom: 6px; }
time { font-size: 13px; color: #6b7280; display: block; margin-bottom: 14px; }
article > p { color: #374151; line-height: 1.7; margin-bottom: 20px; }
section { margin-bottom: 24px; }
section h2 { font-size: 17px; color: #2563eb; margin-bottom: 10px; }
ul { padding-left: 20px; }
li { color: #374151; margin: 5px 0; font-size: 14px; }
details { border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 8px; overflow: hidden; }
summary { padding: 12px 16px; font-weight: 600; font-size: 14px; cursor: pointer; background: #f9fafb; }
details p { padding: 12px 16px; font-size: 13px; color: #6b7280; border-top: 1px solid #e5e7eb; }
aside { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; height: fit-content; }
aside h3 { font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 12px; }
aside li { list-style: none; padding-left: 0; }
aside a { color: #2563eb; text-decoration: none; font-size: 14px; }
footer { background: #1e1e1e; color: #6b7280; text-align: center; padding: 20px; font-size: 13px; }`,
      mode: 'html' },
  ],
  exercises: [
    { id: 'sem1', question: 'How many <main> elements should a page have?', type: 'multiple-choice', options: ['As many as needed', 'Two — one for mobile, one for desktop', 'Exactly one', 'None — use <div id="main">'], correct: 2, explanation: 'A page should have exactly ONE <main> element. It represents the primary content. Screen readers use it to skip to main content directly.' },
    { id: 'sem2', question: 'What is <article> best used for?', type: 'multiple-choice', options: ['Any block of content', 'Self-contained content that could stand alone (blog post, news article)', 'Navigation links', 'Page footer'], correct: 1, explanation: '<article> represents content that is self-contained and independently distributable — like a blog post, product card, or forum comment.' },
  ],
  quiz: [{ id: 'sq1', question: 'Which element creates a native show/hide accordion WITHOUT JavaScript?', options: ['<accordion>', '<toggle>', '<details>', '<collapse>'], correct: 2, explanation: '<details> with <summary> creates a native browser accordion. Click summary to toggle the content. No JavaScript needed!' }],
};
