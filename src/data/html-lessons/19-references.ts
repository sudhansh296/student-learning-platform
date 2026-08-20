import type { HtmlLesson } from '../html-curriculum';

export const htmlReferencesLesson: HtmlLesson = {
  id: 'html-references',
  title: 'HTML References',
  slug: 'references',
  chapter: 'reference',
  order: 19,
  difficulty: 'beginner',
  readingTime: 15,
  description: 'Complete HTML reference — all tags, global attributes, events, character sets, HTTP methods, URL encoding, and more.',
  sections: [
    // ── HTML TAG LIST ──────────────────────────────────────────
    { type: 'heading', content: 'HTML Tag Reference' },
    { type: 'text', content: 'Every HTML tag has a specific purpose. Here is a complete reference of all commonly used HTML tags organized by category.' },
    {
      type: 'table',
      title: 'Document Structure Tags',
      headers: ['Tag', 'Description', 'Example'],
      rows: [
        ['<!DOCTYPE>', 'Declares the document type', '<!DOCTYPE html>'],
        ['<html>', 'Root element of the HTML page', '<html lang="en">'],
        ['<head>', 'Container for metadata', '<head>...</head>'],
        ['<body>', 'Contains all visible content', '<body>...</body>'],
        ['<title>', 'Page title (browser tab)', '<title>My Site</title>'],
        ['<meta>', 'Metadata about the page', '<meta charset="UTF-8">'],
        ['<link>', 'Links external resources (CSS)', '<link rel="stylesheet" href="style.css">'],
        ['<script>', 'Embeds or links JavaScript', '<script src="app.js" defer></script>'],
        ['<style>', 'Internal CSS styles', '<style>body{margin:0}</style>'],
        ['<base>', 'Base URL for all relative URLs', '<base href="https://example.com/">'],
      ],
    },
    {
      type: 'table',
      title: 'Text Content Tags',
      headers: ['Tag', 'Description', 'Type'],
      rows: [
        ['<h1>–<h6>', 'Headings — h1 is largest/most important', 'Block'],
        ['<p>', 'Paragraph', 'Block'],
        ['<br>', 'Line break (empty element)', 'Inline'],
        ['<hr>', 'Horizontal rule / thematic break', 'Block'],
        ['<pre>', 'Preformatted text (preserves whitespace)', 'Block'],
        ['<blockquote>', 'Block-level quotation', 'Block'],
        ['<q>', 'Inline short quotation', 'Inline'],
        ['<cite>', 'Title of a work (book, film, etc.)', 'Inline'],
        ['<abbr>', 'Abbreviation with tooltip', 'Inline'],
        ['<address>', 'Contact information', 'Block'],
        ['<time>', 'Date/time value', 'Inline'],
        ['<code>', 'Inline code', 'Inline'],
        ['<kbd>', 'Keyboard input', 'Inline'],
        ['<samp>', 'Sample output from computer', 'Inline'],
        ['<var>', 'Variable in math/programming', 'Inline'],
      ],
    },
    {
      type: 'table',
      title: 'Formatting Tags',
      headers: ['Tag', 'Visual Result', 'Semantic Meaning'],
      rows: [
        ['<strong>', 'Bold', 'Important content'],
        ['<b>', 'Bold', 'None (visual only)'],
        ['<em>', 'Italic', 'Stressed emphasis'],
        ['<i>', 'Italic', 'None (visual only — foreign words, titles)'],
        ['<mark>', 'Highlighted (yellow)', 'Highlighted/relevant text'],
        ['<del>', 'Strikethrough', 'Deleted/removed text'],
        ['<ins>', 'Underlined', 'Inserted/added text'],
        ['<s>', 'Strikethrough', 'No longer accurate'],
        ['<u>', 'Underlined', 'Annotation (avoid — looks like a link)'],
        ['<sub>', 'Subscript (H₂O)', 'Subscript'],
        ['<sup>', 'Superscript (x²)', 'Superscript'],
        ['<small>', 'Smaller text', 'Fine print, disclaimers'],
        ['<wbr>', 'Optional line break', 'Hint where to break long words'],
      ],
    },
    {
      type: 'table',
      title: 'List Tags',
      headers: ['Tag', 'Description'],
      rows: [
        ['<ul>', 'Unordered list (bullet points)'],
        ['<ol>', 'Ordered list (numbers)'],
        ['<li>', 'List item (used in both ul and ol)'],
        ['<dl>', 'Description list'],
        ['<dt>', 'Description term (the word)'],
        ['<dd>', 'Description details (the definition)'],
      ],
    },
    {
      type: 'table',
      title: 'Link & Media Tags',
      headers: ['Tag', 'Description', 'Key Attribute'],
      rows: [
        ['<a>', 'Hyperlink', 'href, target, rel'],
        ['<img>', 'Image (empty element)', 'src, alt, width, height'],
        ['<picture>', 'Responsive image container', '—'],
        ['<source>', 'Media source inside picture/audio/video', 'src, srcset, type, media'],
        ['<audio>', 'Audio player', 'src, controls, autoplay, loop'],
        ['<video>', 'Video player', 'src, controls, width, height, poster'],
        ['<iframe>', 'Embedded frame', 'src, width, height, title, sandbox'],
        ['<figure>', 'Self-contained media content', '—'],
        ['<figcaption>', 'Caption for figure', '—'],
        ['<map>', 'Image map definition', 'name'],
        ['<area>', 'Clickable area in image map', 'shape, coords, href'],
      ],
    },
    {
      type: 'table',
      title: 'Form Tags',
      headers: ['Tag', 'Description', 'Key Attributes'],
      rows: [
        ['<form>', 'Form container', 'action, method, enctype'],
        ['<input>', 'Input field (many types)', 'type, name, id, value, placeholder, required'],
        ['<label>', 'Label for an input', 'for (matches input id)'],
        ['<textarea>', 'Multi-line text input', 'name, rows, cols, placeholder'],
        ['<select>', 'Dropdown menu', 'name, multiple, size'],
        ['<option>', 'Option in a select', 'value, selected'],
        ['<optgroup>', 'Group of options', 'label'],
        ['<button>', 'Clickable button', 'type (submit/reset/button)'],
        ['<fieldset>', 'Group of related form elements', '—'],
        ['<legend>', 'Caption for fieldset', '—'],
        ['<datalist>', 'Autocomplete suggestions for input', 'id'],
        ['<output>', 'Result of a calculation', 'name, for'],
        ['<progress>', 'Progress bar', 'value, max'],
        ['<meter>', 'Scalar measurement (disk usage, etc.)', 'value, min, max'],
      ],
    },
    {
      type: 'table',
      title: 'Semantic / Structural Tags (HTML5)',
      headers: ['Tag', 'Description'],
      rows: [
        ['<header>', 'Site or section header'],
        ['<nav>', 'Navigation links'],
        ['<main>', 'Primary content (ONE per page)'],
        ['<article>', 'Self-contained content (blog post, news)'],
        ['<section>', 'Thematic section of content'],
        ['<aside>', 'Content tangentially related (sidebar)'],
        ['<footer>', 'Site or section footer'],
        ['<details>', 'Disclosure widget (accordion)'],
        ['<summary>', 'Summary/heading for <details>'],
        ['<dialog>', 'Native modal dialog box'],
        ['<template>', 'HTML template (not rendered until JS uses it)'],
        ['<slot>', 'Placeholder in Web Components'],
      ],
    },
    {
      type: 'table',
      title: 'Table Tags',
      headers: ['Tag', 'Description'],
      rows: [
        ['<table>', 'Table container'],
        ['<thead>', 'Table header group'],
        ['<tbody>', 'Table body group'],
        ['<tfoot>', 'Table footer group'],
        ['<tr>', 'Table row'],
        ['<th>', 'Table header cell (bold, centered)'],
        ['<td>', 'Table data cell'],
        ['<caption>', 'Table title/caption'],
        ['<col>', 'Column in a colgroup'],
        ['<colgroup>', 'Group of columns (for styling)'],
      ],
    },
    // ── GLOBAL ATTRIBUTES ──────────────────────────────────────
    { type: 'heading', content: 'HTML Global Attributes' },
    { type: 'text', content: 'Global attributes can be applied to ANY HTML element. They provide universal functionality across all tags.' },
    {
      type: 'table',
      title: 'Global Attributes Reference',
      headers: ['Attribute', 'Description', 'Example'],
      rows: [
        ['id', 'Unique identifier for an element', 'id="header"'],
        ['class', 'Reusable CSS/JS label(s)', 'class="btn primary"'],
        ['style', 'Inline CSS styles', 'style="color:red"'],
        ['title', 'Tooltip text on hover', 'title="More info"'],
        ['lang', 'Language of element content', 'lang="fr"'],
        ['dir', 'Text direction: ltr or rtl', 'dir="rtl"'],
        ['hidden', 'Hides the element (display:none)', 'hidden'],
        ['tabindex', 'Keyboard tab order', 'tabindex="0"'],
        ['accesskey', 'Keyboard shortcut to focus element', 'accesskey="s"'],
        ['contenteditable', 'Makes element editable by user', 'contenteditable="true"'],
        ['draggable', 'Whether element can be dragged', 'draggable="true"'],
        ['spellcheck', 'Enable/disable spell checking', 'spellcheck="false"'],
        ['translate', 'Whether content should be translated', 'translate="no"'],
        ['data-*', 'Custom data attribute (any name)', 'data-user-id="42"'],
        ['aria-*', 'Accessibility attributes', 'aria-label="Close"'],
        ['role', 'ARIA role for accessibility', 'role="button"'],
        ['autocapitalize', 'Controls capitalization on mobile', 'autocapitalize="off"'],
      ],
    },
    {
      type: 'code',
      language: 'html',
            content: 'data-* attributes store custom data directly on HTML elements. Any attribute starting with data- is valid. JavaScript accesses them through the dataset property — data-user-id becomes element.dataset.userId (camelCase). They are widely used in React, Vue, and vanilla JS for passing data to event handlers.',
      code: `<!-- data-* attributes — store custom data for JavaScript -->
<button
  id="delete-btn"
  class="btn btn-danger"
  data-user-id="42"
  data-action="delete"
  data-confirm="true"
  title="Delete this user"
  tabindex="0"
>
  Delete User
</button>

<script>
  const btn = document.getElementById('delete-btn');
  btn.addEventListener('click', () => {
    const userId = btn.dataset.userId;    // "42"
    const action = btn.dataset.action;   // "delete"
    const confirm = btn.dataset.confirm; // "true"
    console.log('Deleting user:', userId);
  });
</script>`,
    },
    // ── HTML EVENTS ────────────────────────────────────────────
    { type: 'heading', content: 'HTML Event Attributes' },
    { type: 'text', content: 'HTML event attributes allow you to run JavaScript when specific things happen. In modern development, we prefer addEventListener() in JavaScript, but knowing event attributes helps you read older code.' },
    {
      type: 'table',
      title: 'Common HTML Event Attributes',
      headers: ['Event', 'Fires When...', 'Applies To'],
      rows: [
        ['onclick', 'User clicks the element', 'Any element'],
        ['ondblclick', 'User double-clicks', 'Any element'],
        ['onmouseover', 'Mouse moves onto element', 'Any element'],
        ['onmouseout', 'Mouse leaves element', 'Any element'],
        ['onmousedown', 'Mouse button pressed down', 'Any element'],
        ['onmouseup', 'Mouse button released', 'Any element'],
        ['onkeydown', 'Key pressed down', 'Input, textarea, body'],
        ['onkeyup', 'Key released', 'Input, textarea'],
        ['oninput', 'Input value changes (every keystroke)', 'Input, textarea, select'],
        ['onchange', 'Value changed AND focus lost', 'Input, select, textarea'],
        ['onsubmit', 'Form is submitted', 'form'],
        ['onreset', 'Form is reset', 'form'],
        ['onfocus', 'Element gains focus', 'Input, button, a'],
        ['onblur', 'Element loses focus', 'Input, button, a'],
        ['onload', 'Page or image finishes loading', 'body, img'],
        ['onresize', 'Browser window resized', 'body, window'],
        ['onscroll', 'User scrolls', 'Any scrollable element'],
        ['oncontextmenu', 'Right-click context menu', 'Any element'],
        ['ondrag', 'Element is being dragged', 'Draggable element'],
        ['ondrop', 'Dragged element is dropped', 'Drop target'],
        ['onplay', 'Media starts playing', 'audio, video'],
        ['onpause', 'Media is paused', 'audio, video'],
        ['onended', 'Media playback ends', 'audio, video'],
      ],
    },
    {
      type: 'code',
      language: 'html',
            content: 'Inline event attributes like onclick are the old way to add JavaScript behavior. They mix HTML and JavaScript and are hard to maintain. The modern way is addEventListener() in a separate script file. Avoid inline event attributes in production code.',
      code: `<!-- Inline event attributes (old way — avoid in production) -->
<button onclick="alert('Clicked!')">Click Me</button>
<input onkeyup="console.log(this.value)" placeholder="Type here">

<!-- Modern way: addEventListener in JavaScript (preferred) -->
<button id="myBtn">Click Me</button>
<script>
  document.getElementById('myBtn').addEventListener('click', () => {
    alert('Button clicked!');
  });

  // Multiple events on one element
  const input = document.querySelector('input');
  input.addEventListener('focus',  () => input.style.borderColor = '#2563eb');
  input.addEventListener('blur',   () => input.style.borderColor = '#e5e7eb');
  input.addEventListener('input',  (e) => console.log(e.target.value));
</script>`,
    },
    // ── AUDIO & VIDEO ──────────────────────────────────────────
    { type: 'heading', content: 'HTML Audio & Video' },
    {
      type: 'code',
      language: 'html',
            content: 'The audio element embeds a sound player. controls shows the browser built-in play/pause/volume UI. Multiple source elements provide different audio formats — the browser picks the first it can play. MP3 has the widest support. Add type to help the browser decide without downloading.',
      code: `<!-- Audio player -->
<audio controls>
  <source src="music.mp3" type="audio/mpeg">
  <source src="music.ogg" type="audio/ogg">
  Your browser does not support the audio element.
</audio>

<!-- Audio attributes: -->
<!-- controls    — shows play/pause/volume UI -->
<!-- autoplay    — plays automatically (often blocked by browsers) -->
<!-- loop        — repeats when done -->
<!-- muted       — starts muted -->
<!-- preload     — "auto" | "metadata" | "none" -->

<!-- Video player -->
<video width="640" height="360" controls poster="thumbnail.jpg">
  <source src="video.mp4"  type="video/mp4">
  <source src="video.webm" type="video/webm">
  Your browser does not support the video element.
</video>

<!-- Responsive video (16:9) -->
<div style="position:relative; padding-bottom:56.25%; height:0;">
  <video controls
    style="position:absolute; top:0; left:0; width:100%; height:100%;">
    <source src="video.mp4" type="video/mp4">
  </video>
</div>

<!-- Video with tracks (subtitles) -->
<video controls>
  <source src="video.mp4" type="video/mp4">
  <track src="subtitles_en.vtt" kind="subtitles" srclang="en" label="English">
  <track src="subtitles_es.vtt" kind="subtitles" srclang="es" label="Spanish">
</video>`,
    },
    // ── HTTP METHODS ───────────────────────────────────────────
    { type: 'heading', content: 'HTTP Methods' },
    { type: 'text', content: 'HTTP methods define what action a request performs. HTML forms use GET and POST. REST APIs use all five methods. Understanding them is essential for web development.' },
    {
      type: 'table',
      title: 'HTTP Methods Reference',
      headers: ['Method', 'Purpose', 'Has Body?', 'Idempotent?', 'HTML Form Support'],
      rows: [
        ['GET',    'Retrieve/read data',               'No',  'Yes', '✅ Yes'],
        ['POST',   'Create new data',                  'Yes', 'No',  '✅ Yes'],
        ['PUT',    'Update/replace existing data',     'Yes', 'Yes', '❌ No (use JS)'],
        ['PATCH',  'Partially update existing data',   'Yes', 'No',  '❌ No (use JS)'],
        ['DELETE', 'Delete existing data',             'No',  'Yes', '❌ No (use JS)'],
        ['HEAD',   'GET but response body only headers','No', 'Yes', '❌ No'],
        ['OPTIONS','Returns allowed methods',          'No',  'Yes', '❌ No'],
      ],
    },
    {
      type: 'code',
      language: 'html',
            content: 'HTML forms send data to servers. method=GET appends data to the URL — good for searches and bookmarkable results. method=POST sends data in the request body — use for login, signup, and anything sensitive. The action attribute is the URL that receives the data.',
      code: `<!-- GET: data in URL — good for search, bookmarkable -->
<form action="/search" method="GET">
  <input type="text" name="q" placeholder="Search...">
  <button type="submit">Search</button>
</form>
<!-- URL becomes: /search?q=html+tutorial -->

<!-- POST: data in body — good for forms with sensitive data -->
<form action="/login" method="POST">
  <input type="email"    name="email"    placeholder="Email">
  <input type="password" name="password" placeholder="Password">
  <button type="submit">Login</button>
</form>
<!-- Password NOT visible in URL -->

<!-- PUT/PATCH/DELETE require JavaScript fetch() -->
<script>
// PUT - replace a resource
fetch('/api/users/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Alex', email: 'alex@new.com' })
});

// PATCH - update part of a resource
fetch('/api/users/1', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Alexander' })
});

// DELETE - remove a resource
fetch('/api/users/1', { method: 'DELETE' });
</script>`,
    },
    // ── HTTP STATUS CODES ──────────────────────────────────────
    { type: 'heading', content: 'HTTP Status Codes' },
    {
      type: 'table',
      title: 'HTTP Status Codes Reference',
      headers: ['Code', 'Name', 'Meaning'],
      rows: [
        ['200', 'OK', 'Request succeeded — standard success response'],
        ['201', 'Created', 'Resource created successfully (after POST)'],
        ['204', 'No Content', 'Success but no body to return (after DELETE)'],
        ['301', 'Moved Permanently', 'Resource moved to a new URL permanently'],
        ['302', 'Found', 'Temporary redirect'],
        ['304', 'Not Modified', 'Cached version is still valid'],
        ['400', 'Bad Request', 'Client sent invalid data'],
        ['401', 'Unauthorized', 'Authentication required'],
        ['403', 'Forbidden', 'Authenticated but not allowed'],
        ['404', 'Not Found', 'Resource does not exist'],
        ['405', 'Method Not Allowed', 'HTTP method not supported for this route'],
        ['409', 'Conflict', 'Conflict with current state (duplicate entry)'],
        ['422', 'Unprocessable Entity', 'Validation errors'],
        ['429', 'Too Many Requests', 'Rate limit exceeded'],
        ['500', 'Internal Server Error', 'Server-side error'],
        ['502', 'Bad Gateway', 'Upstream server error'],
        ['503', 'Service Unavailable', 'Server temporarily down'],
      ],
    },
    // ── URL ENCODING ───────────────────────────────────────────
    { type: 'heading', content: 'URL Encoding' },
    { type: 'text', content: 'URLs can only contain certain characters. Special characters (spaces, &, =, etc.) must be percent-encoded. JavaScript provides encodeURIComponent() and decodeURIComponent() for this.' },
    {
      type: 'table',
      title: 'Common URL Encoded Characters',
      headers: ['Character', 'Encoded As', 'When It Appears'],
      rows: [
        [' (space)', '%20 or +', 'Search queries, form data'],
        ['!', '%21', 'Exclamation marks'],
        ['"', '%22', 'Double quotes'],
        ['#', '%23', 'Fragment identifier (anchor)'],
        ['$', '%24', 'Dollar sign'],
        ['%', '%25', 'Percent sign itself'],
        ['&', '%26', 'Separates query parameters'],
        ["'", '%27', 'Single quote'],
        ['(', '%28', 'Opening parenthesis'],
        [')', '%29', 'Closing parenthesis'],
        ['+', '%2B', 'Plus sign'],
        [',', '%2C', 'Comma'],
        ['/', '%2F', 'Path separator'],
        [':', '%3A', 'Colon'],
        [';', '%3B', 'Semicolon'],
        ['=', '%3D', 'Key=value separator in query'],
        ['?', '%3F', 'Query string start'],
        ['@', '%40', 'At sign'],
      ],
    },
    {
      type: 'code',
            content: 'URLs can only contain certain characters. Spaces and special characters must be encoded. encodeURIComponent() encodes a single value like a search query. encodeURI() encodes a full URL but preserves special URL characters like / and ?. Always encode user input before putting it in a URL.',
      code: `<!-- JavaScript URL encoding -->
const query = "hello world & goodbye";
const encoded = encodeURIComponent(query);
console.log(encoded);
// "hello%20world%20%26%20goodbye"

// Full URL
const url = \`https://example.com/search?q=\${encodeURIComponent(query)}\`;
// "https://example.com/search?q=hello%20world%20%26%20goodbye"

// Decode
const decoded = decodeURIComponent(encoded);
console.log(decoded);
// "hello world & goodbye"

// In HTML forms, GET method auto-encodes values
// <form action="/search" method="GET">
//   <input name="q" value="hello world">
// </form>
// → Submits to: /search?q=hello+world`,
      language: 'javascript',
    },
    // ── CHARACTER SETS ─────────────────────────────────────────
    { type: 'heading', content: 'HTML Character Sets & Entities' },
    { type: 'text', content: 'HTML entities let you display special characters that have meaning in HTML (like < and >) or characters not on your keyboard. Always use UTF-8 charset.' },
    {
      type: 'table',
      title: 'Common HTML Entities',
      headers: ['Character', 'Entity Name', 'Entity Number', 'Description'],
      rows: [
        ['<', '&lt;', '&#60;', 'Less than — needed inside HTML content'],
        ['>', '&gt;', '&#62;', 'Greater than'],
        ['&', '&amp;', '&#38;', 'Ampersand — needed in HTML'],
        ['"', '&quot;', '&#34;', 'Double quote'],
        ["'", '&apos;', '&#39;', 'Single quote / apostrophe'],
        ['©', '&copy;', '&#169;', 'Copyright symbol'],
        ['®', '&reg;', '&#174;', 'Registered trademark'],
        ['™', '&trade;', '&#8482;', 'Trademark symbol'],
        ['€', '&euro;', '&#8364;', 'Euro sign'],
        ['£', '&pound;', '&#163;', 'Pound sign'],
        ['¥', '&yen;', '&#165;', 'Yen sign'],
        ['°', '&deg;', '&#176;', 'Degree symbol'],
        ['±', '&plusmn;', '&#177;', 'Plus-minus sign'],
        ['×', '&times;', '&#215;', 'Multiplication sign'],
        ['÷', '&divide;', '&#247;', 'Division sign'],
        [' ', '&nbsp;', '&#160;', 'Non-breaking space'],
        ['→', '&rarr;', '&#8594;', 'Right arrow'],
        ['←', '&larr;', '&#8592;', 'Left arrow'],
        ['↑', '&uarr;', '&#8593;', 'Up arrow'],
        ['↓', '&darr;', '&#8595;', 'Down arrow'],
      ],
    },
    {
      type: 'code',
      language: 'html',
            content: 'HTML entities let you display characters that have special meaning in HTML. Use &lt; for < and &gt; for > — otherwise the browser interprets them as tag brackets. Use &amp; for & in URLs and text. Use &nbsp; for a non-breaking space that prevents line wrapping.',
      code: `<!-- Use entities for special characters in HTML -->
<p>5 &lt; 10 is a true statement.</p>
<p>Use &amp; to connect words &amp; ideas.</p>
<p>Copyright &copy; 2026 WebDev Atlas. All rights reserved.</p>
<p>Price: &euro;29.99 &mdash; limited time offer</p>
<p>Temperature: 37&deg;C</p>

<!-- Non-breaking space: keeps words together on same line -->
<p>Dr.&nbsp;Smith will see you now.</p>
<p>100&nbsp;km/h speed limit</p>

<!-- Displaying actual HTML code on a page -->
<p>Use the <code>&lt;p&gt;</code> tag for paragraphs.</p>
<p>The &lt;img&gt; tag requires an alt attribute: &lt;img src="x.jpg" alt="..."&gt;</p>`,
    },
    // ── PX TO EM ───────────────────────────────────────────────
    { type: 'heading', content: 'PX to EM / REM Conversion' },
    { type: 'text', content: 'CSS has multiple units for sizing. px is absolute (pixels). em is relative to the parent element font-size. rem is relative to the root (html) font-size — the most predictable for responsive design.' },
    {
      type: 'table',
      title: 'CSS Units Comparison',
      headers: ['Unit', 'Type', 'Relative To', 'Best For'],
      rows: [
        ['px', 'Absolute', 'Screen pixel', 'Borders, shadows, fixed layouts'],
        ['em', 'Relative', 'Parent element font-size', 'Padding/margin that scales with text'],
        ['rem', 'Relative', 'Root (html) font-size (usually 16px)', 'Font sizes, spacing (most predictable)'],
        ['%', 'Relative', 'Parent element size', 'Widths, flexible layouts'],
        ['vw', 'Relative', '1% of viewport width', 'Full-width sections, hero text'],
        ['vh', 'Relative', '1% of viewport height', 'Full-height sections, hero layouts'],
        ['vmin', 'Relative', '1% of smaller viewport dimension', 'Responsive elements'],
        ['vmax', 'Relative', '1% of larger viewport dimension', 'Responsive elements'],
        ['ch', 'Relative', 'Width of the "0" character', 'Line length for readability'],
        ['clamp()', 'Function', 'min, preferred, max', 'Fluid typography — recommended!'],
      ],
    },
    {
      type: 'code',
            content: 'These CSS reference snippets show the most important CSS properties in one place. font-size: 16px is the browser default. 1rem always equals the root font size. border-box sizing includes padding in the width calculation — add * { box-sizing: border-box } to every project.',
      code: `/* Base font-size is 16px by default */
/* 1rem = 16px, 1.5rem = 24px, 2rem = 32px */

/* PX to REM conversion: px / 16 = rem */
/* 16px = 1rem   */
/* 24px = 1.5rem */
/* 32px = 2rem   */
/* 48px = 3rem   */
/* 64px = 4rem   */

html { font-size: 16px; } /* default — change to adjust all rem sizes */

h1 { font-size: 2.5rem; }   /* 40px */
h2 { font-size: 2rem; }     /* 32px */
h3 { font-size: 1.5rem; }   /* 24px */
p  { font-size: 1rem; }     /* 16px */
small { font-size: 0.875rem; } /* 14px */

/* Fluid typography with clamp(min, preferred, max) */
h1 { font-size: clamp(1.75rem, 4vw, 3rem); }
/* Scales from 28px on mobile to 48px on desktop */

/* Common spacing scale in rem */
.gap-xs  { gap: 0.25rem; }  /* 4px  */
.gap-sm  { gap: 0.5rem; }   /* 8px  */
.gap-md  { gap: 1rem; }     /* 16px */
.gap-lg  { gap: 1.5rem; }   /* 24px */
.gap-xl  { gap: 2rem; }     /* 32px */`,
      language: 'css',
    },
    // ── KEYBOARD SHORTCUTS ──────────────────────────────────────
    { type: 'heading', content: 'Developer Keyboard Shortcuts' },
    {
      type: 'table',
      title: 'Browser DevTools Shortcuts',
      headers: ['Shortcut', 'Action', 'Where'],
      rows: [
        ['F12', 'Open/close DevTools', 'All browsers'],
        ['Ctrl+Shift+I', 'Open DevTools', 'Chrome, Firefox, Edge'],
        ['Ctrl+Shift+J', 'Open Console', 'Chrome'],
        ['Ctrl+Shift+C', 'Inspect element mode', 'Chrome, Firefox'],
        ['Ctrl+L', 'Focus address bar', 'All browsers'],
        ['Ctrl+R / F5', 'Reload page', 'All browsers'],
        ['Ctrl+Shift+R', 'Hard reload (clear cache)', 'Chrome, Firefox'],
        ['Ctrl+U', 'View page source', 'All browsers'],
        ['Ctrl+F', 'Find in page / DevTools', 'All browsers'],
        ['Ctrl+Shift+M', 'Toggle mobile view', 'Chrome DevTools'],
        ['Esc', 'Open/close console drawer', 'Chrome DevTools'],
      ],
    },
    {
      type: 'table',
      title: 'VS Code Shortcuts (HTML development)',
      headers: ['Shortcut', 'Action'],
      rows: [
        ['! + Tab', 'HTML5 boilerplate (Emmet)'],
        ['Ctrl+/', 'Toggle comment'],
        ['Alt+Shift+F', 'Format document'],
        ['Ctrl+D', 'Select next occurrence'],
        ['Ctrl+Shift+L', 'Select all occurrences'],
        ['Alt+↑/↓', 'Move line up/down'],
        ['Ctrl+Shift+K', 'Delete line'],
        ['Ctrl+`', 'Open terminal'],
        ['Ctrl+P', 'Quick open file'],
        ['Ctrl+Shift+P', 'Command palette'],
        ['Ctrl+B', 'Toggle sidebar'],
        ['F2', 'Rename symbol'],
      ],
    },
    {
      type: 'tryit',
      title: 'Try It: HTML Entities & Special Characters',
      html: `<h1>HTML Special Characters</h1>

<h2>Math Symbols</h2>
<p>5 &lt; 10 (less than)</p>
<p>10 &gt; 5 (greater than)</p>
<p>2 &times; 3 = 6 (multiplication)</p>
<p>10 &divide; 2 = 5 (division)</p>
<p>±5 degrees (&plusmn;5&deg;)</p>

<h2>Currencies</h2>
<p>US Dollar: $19.99</p>
<p>Euro: &euro;17.99</p>
<p>British Pound: &pound;14.99</p>
<p>Japanese Yen: &yen;2,199</p>

<h2>Arrows</h2>
<p>Previous &larr; | &rarr; Next</p>
<p>&uarr; Scroll up | &darr; Scroll down</p>

<h2>Legal</h2>
<p>&copy; 2026 WebDev Atlas. All rights reserved.</p>
<p>React&trade; is a trademark of Meta Platforms, Inc.</p>

<h2>Displaying HTML Code</h2>
<p>Use <code>&lt;p&gt;</code> for paragraphs.</p>
<p>Use <code>&lt;img src="x.jpg" alt="desc"&gt;</code> for images.</p>
<p>Use <code>&amp;copy;</code> for the &copy; symbol.</p>`,
      css: `body { font-family: system-ui, sans-serif; padding: 20px; max-width: 600px; }
h1 { color: #1e1e1e; margin-bottom: 20px; }
h2 { color: #2563eb; font-size: 15px; margin: 20px 0 8px; text-transform: uppercase; letter-spacing: .05em; }
p  { color: #374151; margin: 6px 0; font-size: 15px; }
code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; font-size: 13px; color: #dc2626; }`,
      mode: 'html',
    },
  ],
  exercises: [
    { id: 'ref1', question: 'Which HTML entity displays a copyright symbol ©?', type: 'multiple-choice', options: ['&copyright;', '&copy;', '(c)', '&#169;'], correct: 1, explanation: '&copy; displays ©. You can also use the numeric entity &#169;. Both work in all browsers.' },
    { id: 'ref2', question: 'What HTTP status code means "Resource not found"?', type: 'multiple-choice', options: ['200', '401', '404', '500'], correct: 2, explanation: '404 Not Found — the server cannot find the requested resource. The URL might be wrong or the resource deleted.' },
    { id: 'ref3', question: 'Which HTTP method should you use to PARTIALLY update a resource?', type: 'multiple-choice', options: ['GET', 'POST', 'PUT', 'PATCH'], correct: 3, explanation: 'PATCH partially updates a resource (only the fields you send). PUT replaces the entire resource. POST creates. GET reads.' },
  ],
  quiz: [
    { id: 'rq1', question: 'What does rem stand for in CSS?', options: ['Relative em', 'Root em — relative to the html element font-size', 'Responsive em', 'Rendered em'], correct: 1, explanation: 'rem = Root EM. It is always relative to the root <html> element\'s font-size (default 16px). This makes it more predictable than em, which inherits from parent elements.' },
    { id: 'rq2', question: 'Which character MUST be encoded as &amp; inside HTML?', options: ['The letter a', 'The & (ampersand)', 'The . (period)', 'The _ (underscore)'], correct: 1, explanation: '& has special meaning in HTML (it starts entity references). To display a literal & in HTML, you must write &amp;. Otherwise the browser may try to parse it as an entity.' },
  ],
};
