import type { HtmlLesson } from '../html-curriculum';

export const htmlClassesIdLesson: HtmlLesson = {
  id: 'html-classes-id',
  title: 'HTML Classes & ID',
  slug: 'classes-id',
  chapter: 'structure',
  order: 11,
  difficulty: 'beginner',
  readingTime: 10,
  description: 'Master the class and id attributes — how they connect HTML to CSS and JavaScript, naming conventions, and best practices.',
  sections: [
    { type: 'text', content: 'The class and id attributes are two of the most important tools in web development. They create a bridge between your HTML elements and CSS styles / JavaScript behavior. Understanding them deeply is essential for every web developer.' },
    { type: 'heading', content: 'The class Attribute' },
    { type: 'text', content: 'A class is a reusable label you attach to HTML elements. Multiple elements can share the same class. One element can have multiple classes. In CSS you target classes with a dot (.) and in JavaScript with querySelector.' },
    { type: 'code', language: 'html',       content: 'The class attribute gives elements a reusable label. In CSS target it with a dot (.highlight). Multiple elements share the same class. One element can have multiple space-separated classes. Classes are the main way to apply consistent styles across many elements.',
      code: `<!-- Applying a class -->
<p class="highlight">This paragraph is highlighted.</p>
<p>This one is not.</p>
<p class="highlight">This one is also highlighted.</p>

<!-- Multiple classes on one element (space-separated) -->
<button class="btn btn-primary large">Submit</button>
<button class="btn btn-secondary">Cancel</button>
<div class="card featured shadow">Featured Card</div>

<!-- In CSS: target class with a DOT -->
/* .highlight { background: yellow; } */
/* .btn       { padding: 10px 20px; border: none; border-radius: 6px; } */
/* .btn-primary { background: #2563eb; color: white; } */

<!-- In JavaScript: get all elements with a class -->
/* const highlights = document.querySelectorAll('.highlight'); */
/* highlights.forEach(el => el.style.color = 'red'); */` },
    { type: 'heading', content: 'The id Attribute' },
    { type: 'text', content: 'An id is a UNIQUE identifier — only ONE element on the entire page should have a given id. Use ids for landmark elements, form labels, and JavaScript targeting of specific unique elements.' },
    { type: 'code', language: 'html',       content: 'The id attribute gives one element a unique name on the page. In CSS target it with #header. In JavaScript use getElementById. Only one element per page should have a given id. Use ids for anchor links, JavaScript targeting, and form label associations.',
      code: `<!-- Each id must be unique on the page -->
<header id="site-header">...</header>
<main   id="main-content">...</main>
<footer id="site-footer">...</footer>

<!-- Used for JavaScript targeting -->
<h1 id="page-title">Welcome to WebDev Atlas</h1>
<input id="search-input" type="text" placeholder="Search...">

/* In CSS: target id with # */
/* #page-title { color: #2563eb; font-size: 3rem; } */
/* #site-header { position: sticky; top: 0; } */

/* In JavaScript: get element by id */
/* const title = document.getElementById('page-title'); */
/* title.textContent = 'New Title'; */

/* Anchor links use id */
<a href="#section2">Jump to Section 2</a>
<h2 id="section2">Section 2</h2>` },
    { type: 'heading', content: 'class vs id — When to Use Which' },
    { type: 'table', headers: ['Feature', 'class', 'id'], rows: [
      ['Uniqueness', 'Can be used on MANY elements', 'Must be UNIQUE (one per page)'],
      ['CSS selector', '.className', '#idName'],
      ['JS selector', 'querySelectorAll(".class")', 'getElementById("id")'],
      ['Multiple per element', 'Yes — class="a b c"', 'No — only one id per element'],
      ['Anchor links', 'Not used', 'Used with href="#id"'],
      ['Best for', 'Styling components, groups', 'Unique landmarks, form labels, JS targets'],
    ]},
    { type: 'heading', content: 'CSS Classes — The Component Pattern' },
    { type: 'code', language: 'html',       content: 'In professional code, classes handle styling and ids handle JavaScript. BEM naming: .card for the block, .card__title for an element inside it, .card--featured for a variant. This keeps CSS organized and avoids naming conflicts.',
      code: `<!-- Real-world component pattern with classes -->
<!-- Building a card component -->
<div class="card">
  <div class="card-header">
    <h3 class="card-title">JavaScript Tutorial</h3>
    <span class="badge badge-beginner">Beginner</span>
  </div>
  <p class="card-description">Learn JS from zero to hero.</p>
  <div class="card-footer">
    <a href="/js" class="btn btn-primary">Start Learning</a>
    <span class="card-meta">40 topics · 6 weeks</span>
  </div>
</div>

<!-- The CSS for these classes:
.card { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; }
.card-title { font-size: 18px; font-weight: 700; color: #1e1e1e; }
.badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 12px; }
.badge-beginner { background: #f0fdf4; color: #15803d; }
.btn { display: inline-block; padding: 8px 16px; border-radius: 8px; text-decoration: none; }
.btn-primary { background: #2563eb; color: white; }
-->` },
    { type: 'heading', content: 'Naming Conventions' },
    { type: 'list', title: 'Industry standard naming rules:', items: [
      'Use lowercase letters and hyphens: class="main-header" not class="MainHeader"',
      'Be descriptive: class="nav-menu" not class="thing1"',
      'Avoid single-character names: class="c" is meaningless',
      'BEM methodology (common in large projects): block__element--modifier e.g. card__title--featured',
      'Don\'t start with numbers: class="1container" is invalid',
      'JavaScript developers often use camelCase for JS variables, hyphen-case for CSS classes',
    ]},
    { type: 'tryit', title: 'Try It: Classes & IDs in Action',
      html: `<div id="app">
  <header id="site-header">
    <h1 id="logo">WebDev Atlas</h1>
    <nav>
      <a href="#" class="nav-link active">Home</a>
      <a href="#" class="nav-link">HTML</a>
      <a href="#" class="nav-link">CSS</a>
      <a href="#" class="nav-link">JS</a>
    </nav>
  </header>

  <main id="main-content">
    <div class="card">
      <span class="badge badge-new">New</span>
      <h2 class="card-title">HTML Tutorial</h2>
      <p class="card-desc">Complete guide to HTML5 with live examples.</p>
      <a href="#" class="btn btn-primary">Start Learning</a>
    </div>

    <div class="card">
      <span class="badge badge-popular">Popular</span>
      <h2 class="card-title">JavaScript</h2>
      <p class="card-desc">From basics to async/await and beyond.</p>
      <a href="#" class="btn btn-outline">View Course</a>
    </div>
  </main>
</div>`,
      css: `* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: system-ui, sans-serif; background: #f9fafb; }
#site-header { background: #1e1e1e; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; }
#logo { color: white; font-size: 18px; font-weight: 800; }
.nav-link { color: #9ca3af; text-decoration: none; margin-left: 20px; font-size: 14px; }
.nav-link.active { color: white; font-weight: 600; }
#main-content { padding: 24px; display: flex; gap: 16px; flex-wrap: wrap; }
.card { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; width: 260px; }
.badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; margin-bottom: 10px; }
.badge-new     { background: #eff6ff; color: #1d4ed8; }
.badge-popular { background: #fff7ed; color: #c2410c; }
.card-title { font-size: 16px; font-weight: 700; color: #1e1e1e; margin-bottom: 6px; }
.card-desc  { font-size: 13px; color: #6b7280; margin-bottom: 16px; line-height: 1.5; }
.btn { display: inline-block; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; text-decoration: none; }
.btn-primary { background: #2563eb; color: white; }
.btn-outline  { background: white; color: #2563eb; border: 1.5px solid #2563eb; }`,
      mode: 'html' },
  ],
  exercises: [
    { id: 'ci1', question: 'Can two different HTML elements have the same class name?', type: 'multiple-choice', options: ['No, each class must be unique', 'Yes, class can be shared by many elements', 'Only if they are the same tag type', 'Only with !important in CSS'], correct: 1, explanation: 'Class names are REUSABLE. Many elements can share the same class. This is the whole point — one CSS rule styles all elements with that class.' },
    { id: 'ci2', question: 'In CSS, how do you select all elements with class="card"?', type: 'multiple-choice', options: ['#card { }', '.card { }', 'card { }', '@card { }'], correct: 1, explanation: 'In CSS, a dot (.) before the name targets a class: .card { }. A hash (#) targets an id: #card { }.' },
  ],
  quiz: [
    { id: 'ciq1', question: 'You want to make only ONE specific heading blue. Which attribute should you use?', options: ['class', 'id', 'style', 'name'], correct: 1, explanation: 'Use id when targeting ONE specific unique element. Use class when you want to style a group of elements the same way.' },
  ],
};
