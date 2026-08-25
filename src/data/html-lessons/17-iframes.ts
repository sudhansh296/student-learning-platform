import type { HtmlLesson } from '../html-curriculum';
export const htmlIframesLesson: HtmlLesson = {
  id: 'html-iframes', title: 'HTML Iframes', slug: 'iframes', chapter: 'advanced', order: 17,
  difficulty: 'intermediate', readingTime: 8, description: 'Embed other web pages, YouTube videos, maps, and documents using the iframe element.',
  sections: [
    { type: 'text', content: 'An iframe (inline frame) embeds another HTML document inside the current page. It creates a completely separate browsing context - like a mini browser window inside your page. Common uses: embedding YouTube videos, Google Maps, Codepen demos, social media posts, and external content.' },
    { type: 'heading', content: 'Basic iframe Syntax' },
    { type: 'code', language: 'html',       content: 'The iframe element embeds another webpage inside your page. src is the URL of the page to embed. The content inside the iframe tag is shown only if the browser does not support iframes (a fallback). iframes are used to embed YouTube videos, Google Maps, payment forms, and third-party widgets.',
code: `<!-- Basic iframe -->
<iframe src="https://example.com" width="600" height="400"></iframe>

<!-- Important attributes: -->
<iframe
  src="https://example.com"
  width="100%"
  height="500"
  title="Embedded page"     <!-- Required for accessibility! -->
  frameborder="0"           <!-- Remove border (use CSS instead) -->
  loading="lazy"            <!-- Load only when visible -->
  allowfullscreen           <!-- Allow fullscreen mode -->
></iframe>` },
    { type: 'warning', title: 'Security: Many sites block iframe embedding', content: 'Websites can prevent being embedded in iframes using the X-Frame-Options HTTP header. That\'s why you cannot embed Google.com in an iframe. Always use official embed codes (like YouTube embed) rather than trying to iframe full websites.' },
    { type: 'heading', content: 'Embedding YouTube Videos' },
    { type: 'code', language: 'html',       content: 'YouTube provides a special embed URL (youtube.com/embed/VIDEO_ID). allowfullscreen enables the full-screen button. loading=lazy defers loading until the iframe is near the viewport - important because YouTube iframes are large and slow initial page load significantly.',
      code: `<!-- YouTube official embed code -->
<!-- Get this from YouTube: Share → Embed -->
<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
  title="YouTube video player"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
></iframe>

<!-- Responsive YouTube embed (16:9 ratio) -->
<div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden;">
  <iframe
    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
    title="Video title"
    frameborder="0"
    allowfullscreen
    style="position:absolute; top:0; left:0; width:100%; height:100%;"
  ></iframe>
</div>` },
    { type: 'heading', content: 'Embedding Google Maps' },
    { type: 'code', language: 'html',       content: 'Google Maps provides ready-made iframe code from the Share button. It creates a fully interactive map in your page. Set explicit height since maps need defined dimensions to display. frameborder=0 removes the default iframe border for a cleaner look.',
      code: `<!-- Get embed code from Google Maps: Share → Embed a map -->
<iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12..."
  width="600"
  height="450"
  style="border:0; border-radius: 12px;"
  allowfullscreen
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade"
  title="Our office location"
></iframe>` },
    { type: 'heading', content: 'The sandbox Attribute - Security' },
    { type: 'code', language: 'html',       content: 'The sandbox attribute restricts embedded content for security. Without it, embedded pages can run scripts and navigate the parent window. sandbox= blocks everything. Selectively re-enable with allow-scripts, allow-forms, allow-same-origin. Always sandbox third-party content.',
      code: `<!-- sandbox restricts what the iframe can do -->
<iframe
  src="untrusted-content.html"
  sandbox                         <!-- block everything -->
></iframe>

<!-- Allow specific things: -->
<iframe
  src="user-content.html"
  sandbox="allow-scripts allow-forms"
  <!-- allow-scripts    = can run JavaScript -->
  <!-- allow-forms      = can submit forms -->
  <!-- allow-same-origin = treat as same origin -->
  <!-- allow-popups     = can open new windows -->
></iframe>

<!-- Our Code Editor uses sandbox="allow-scripts" for security -->` },
    { type: 'tryit', title: 'Try It: Iframe Embedding',
      html: `<h1>Iframe Examples</h1>

<h2>Embedded Webpage</h2>
<iframe
  src="https://example.com"
  width="100%"
  height="200"
  title="Example.com embedded"
  style="border: 1px solid #e5e7eb; border-radius: 8px;"
  loading="lazy"
></iframe>

<h2>Embedded YouTube Video (16:9 Responsive)</h2>
<div class="video-wrapper">
  <iframe
    src="https://www.youtube.com/embed/BzYMFd-lQL4"
    title="HTML Tutorial for Beginners"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>
</div>`,
      css: `body { font-family: system-ui, sans-serif; padding: 20px; }
h1 { color: #1e1e1e; }
h2 { color: #2563eb; font-size: 16px; margin: 20px 0 10px; }
.video-wrapper { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px; border: 1px solid #e5e7eb; }
.video-wrapper iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; }`,
      mode: 'html' },
  ],
  exercises: [{ id: 'ifr1', question: 'What attribute is required on iframe for accessibility?', type: 'multiple-choice', options: ['src', 'title', 'width', 'id'], correct: 1, explanation: 'The title attribute on iframe is required for accessibility. Screen readers announce the title when they encounter an iframe, helping users understand what it contains.' }],
  quiz: [{ id: 'iq1', question: 'What does the sandbox attribute on iframe do?', options: ['Makes it look like a sandbox color', 'Restricts what the embedded page can do (no scripts, no forms by default)', 'Makes it responsive', 'Adds a border'], correct: 1, explanation: 'sandbox restricts the iframe\'s capabilities. By default it blocks all: scripts, forms, popups, and top navigation. You can selectively allow things: sandbox="allow-scripts allow-forms".' }],
};
