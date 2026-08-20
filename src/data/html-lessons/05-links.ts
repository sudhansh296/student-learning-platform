import type { HtmlLesson } from '../html-curriculum';

export const htmlLinksLesson: HtmlLesson = {
  id: 'html-links',
  title: 'Links',
  slug: 'links',
  chapter: 'links',
  order: 5,
  difficulty: 'beginner',
  readingTime: 10,
  description: 'Master HTML hyperlinks — absolute vs relative URLs, target attributes, bookmark links, email/phone links, and best practices.',
  sections: [
    {
      type: 'text',
      content: 'Links are the foundation of the web. Without links, every page would be isolated — you could not navigate from one page to another. The <a> tag (anchor tag) creates clickable links. It is one of the most important HTML elements you will ever use.',
    },
    {
      type: 'heading',
      content: 'The <a> Tag — Anchor Element',
    },
    {
      type: 'code',
      language: 'html',
            content: 'The a (anchor) element creates a hyperlink. The href attribute specifies the destination. The clickable text goes between the opening and closing tags. Links are the foundation of the web — they connect pages together.',
code: `<!-- Basic link syntax -->
<a href="URL">Link Text</a>

<!-- The href attribute = Hypertext REFerence (where to go) -->
<a href="https://www.google.com">Visit Google</a>

<!-- Without href, it is just styled like a link but goes nowhere -->
<a>Dead link (no href)</a>`,
    },
    {
      type: 'heading',
      content: 'Absolute vs Relative URLs',
    },
    {
      type: 'text',
      content: 'An absolute URL includes the full web address including the protocol (https://). A relative URL only specifies the path relative to your current page. Use absolute URLs for external sites, and relative URLs for pages within your own website.',
    },
    {
      type: 'code',
      language: 'html',
      content: 'Absolute URLs include the full web address starting with https:// — use them for external sites. Relative URLs only specify the path from your current page — use them for links within your own website. Relative URLs are shorter and keep working if you move the site to a different domain.',
      code: `<!-- ABSOLUTE URLs — full address, for external websites -->
<a href="https://www.google.com">Google</a>
<a href="https://github.com/yourusername">My GitHub</a>

<!-- RELATIVE URLs — for pages within your own site -->
<!-- Current file: /pages/blog/post.html -->

<a href="/index.html">Home (from root)</a>
<a href="../about.html">About (one folder up)</a>
<a href="other-post.html">Another post (same folder)</a>
<a href="/contact">Contact page</a>

<!-- Why use relative URLs? -->
<!-- They work whether your site is at localhost, staging, or production -->
<!-- No need to update them when you move to a different domain -->`,
    },
    {
      type: 'heading',
      content: 'The target Attribute — Where to Open Links',
    },
    {
      type: 'code',
      language: 'html',
      content: 'target="_blank" opens the link in a new browser tab. Always add rel="noopener noreferrer" with it — without this, the new tab can access your page via JavaScript (a security vulnerability called tab-nabbing). This is the secure standard for all external links.',
      code: `<!-- Opens in the SAME tab (default behavior) -->
<a href="https://example.com">Same tab</a>
<a href="https://example.com" target="_self">Same tab (explicit)</a>

<!-- Opens in a NEW tab/window -->
<a href="https://example.com" target="_blank">New tab</a>

<!-- Security: always add rel="noopener noreferrer" with target="_blank" -->
<!-- Without this, the new tab can access your page via window.opener -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  Safe external link
</a>`,
    },
    {
      type: 'warning',
      title: 'Security: Always use rel="noopener noreferrer" with target="_blank"',
      content: 'When you open a link in a new tab with target="_blank", the new page can access your page through window.opener — a security vulnerability called "tab nabbing." Adding rel="noopener noreferrer" prevents this. This is critical for external links.',
    },
    {
      type: 'heading',
      content: 'Bookmark Links — Navigate Within a Page',
    },
    {
      type: 'text',
      content: 'You can link to a specific section of a page using an id as the target. This is called a bookmark or anchor link. Click the link and the page scrolls to that section.',
    },
    {
      type: 'code',
      language: 'html',
      content: 'Anchor links jump to a specific section on the same page. Give the target element an id, then link to #id. This is how table-of-contents navigation and "back to top" buttons are built. You can also link to a section on a different page by adding the #id after the page URL.',
      code: `<!-- STEP 1: Add id to the target element -->
<h2 id="installation">Installation Guide</h2>
<h2 id="usage">Usage Examples</h2>
<h2 id="faq">FAQ</h2>

<!-- STEP 2: Create links pointing to those ids with # -->
<nav>
  <a href="#installation">Installation</a>
  <a href="#usage">Usage</a>
  <a href="#faq">FAQ</a>
</nav>

<!-- Link to a section on ANOTHER page -->
<a href="/docs.html#installation">View Installation Docs</a>

<!-- Back to top link -->
<a href="#top">Back to Top ↑</a>`,
    },
    {
      type: 'heading',
      content: 'Email, Phone, and Download Links',
    },
    {
      type: 'code',
      language: 'html',
      content: 'mailto: opens the user\'s email client with the address pre-filled. tel: creates a clickable phone number on mobile devices. The download attribute tells the browser to download the file instead of navigating to it — you can set a custom filename as the attribute value.',
      code: `<!-- Email link — opens default email client -->
<a href="mailto:hello@example.com">Send us an email</a>

<!-- Email with pre-filled subject and body -->
<a href="mailto:support@example.com?subject=Help%20Request&body=Hello%2C%20I%20need%20help%20with...">
  Contact Support
</a>

<!-- Phone link — opens phone app on mobile -->
<a href="tel:+1-800-555-1234">Call us: 1-800-555-1234</a>

<!-- Download link — prompts file download -->
<a href="/files/resume.pdf" download>Download Resume (PDF)</a>

<!-- Download with custom filename -->
<a href="/files/report-2026-q1.pdf" download="Q1-Report.pdf">
  Download Q1 Report
</a>`,
    },
    {
      type: 'heading',
      content: 'Making Images Clickable Links',
    },
    {
      type: 'code',
      language: 'html',
      content: 'Wrap an img inside an anchor element to make the image itself a clickable link. The alt text also serves as the accessible label for the link. This is the standard way to make logo images navigate to the homepage.',
      code: `<!-- Wrap an image inside an <a> tag to make it clickable -->
<a href="https://example.com">
  <img src="logo.png" alt="Company Logo — click to visit homepage">
</a>

<!-- Clickable image that opens in new tab -->
<a href="/portfolio/project1.html" target="_blank" rel="noopener noreferrer">
  <img src="project1-thumbnail.jpg" alt="Project 1: E-commerce Website">
</a>`,
    },
    {
      type: 'tryit',
      title: 'Try It: All Types of Links',
      html: `<!DOCTYPE html>
<html lang="en">
<head><title>Links Demo</title></head>
<body>

  <!-- Jump nav using bookmark links -->
  <nav>
    <a href="#section-external">External Links</a> |
    <a href="#section-email">Email & Phone</a> |
    <a href="#section-bookmark">Bookmark Links</a>
  </nav>

  <hr>

  <h2 id="section-external">External Links</h2>
  <p>
    <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
      Google (opens in new tab) ↗
    </a>
  </p>
  <p>
    <a href="https://developer.mozilla.org" target="_blank" rel="noopener noreferrer">
      MDN Web Docs ↗
    </a>
  </p>

  <h2 id="section-email">Email & Phone Links</h2>
  <p><a href="mailto:hello@webdevatlas.com">📧 hello@webdevatlas.com</a></p>
  <p><a href="tel:+1234567890">📞 +1 (234) 567-890</a></p>

  <h2 id="section-bookmark">Bookmark Links</h2>
  <p>The links in the nav above take you to different sections of this same page.</p>
  <p><a href="#top">⬆ Back to Top</a></p>

  <!-- Image as a link -->
  <h2>Clickable Image</h2>
  <a href="https://developer.mozilla.org" target="_blank" rel="noopener noreferrer">
    <img
      src="https://placehold.co/300x100/2563eb/white?text=Click+Me"
      alt="Click to visit MDN"
    >
  </a>

</body>
</html>`,
      css: `body { font-family: system-ui, sans-serif; padding: 24px; max-width: 600px; line-height: 1.6; }
nav { background: #f4f4f4; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; }
nav a { color: #2563eb; text-decoration: none; margin-right: 8px; }
nav a:hover { text-decoration: underline; }
h2 { color: #1e1e1e; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
a { color: #2563eb; }
img { display: block; margin-top: 8px; border-radius: 8px; cursor: pointer; }
hr { border: none; border-top: 1px solid #e5e7eb; }`,
      mode: 'html',
    },
  ],
  exercises: [
    {
      id: 'link-1',
      question: 'Which tag creates a hyperlink in HTML?',
      type: 'multiple-choice',
      options: ['<link>', '<a>', '<href>', '<url>'],
      correct: 1,
      explanation: 'The <a> tag (anchor tag) creates hyperlinks. The href attribute specifies the destination URL. <link> is used in <head> to link CSS files.',
    },
    {
      id: 'link-2',
      question: 'What rel attribute should you add when using target="_blank"?',
      type: 'multiple-choice',
      options: [
        'rel="external"',
        'rel="noopener noreferrer"',
        'rel="new-tab"',
        'No rel attribute needed',
      ],
      correct: 1,
      explanation: 'rel="noopener noreferrer" prevents the new tab from accessing your page through window.opener (a security vulnerability). Always include this with target="_blank".',
    },
    {
      id: 'link-3',
      question: 'How do you create a link to a specific section on the same page?',
      type: 'multiple-choice',
      options: [
        '<a href="section2.html">',
        '<a href="#section2"> and <div id="section2">',
        '<a scroll="section2">',
        '<a jump="section2">',
      ],
      correct: 1,
      explanation: 'Add an id to the target element (id="section2") and link to it with href="#section2". The # symbol means "on this same page."',
    },
  ],
  quiz: [
    {
      id: 'ql-1',
      question: 'What is the difference between absolute and relative URLs?',
      options: [
        'Absolute URLs are faster, relative URLs are slower',
        'Absolute URLs include the full address (https://...), relative URLs only specify the path from current location',
        'They are the same thing',
        'Absolute URLs are for images, relative URLs are for links',
      ],
      correct: 1,
      explanation: 'Absolute: href="https://example.com/page.html" — full address. Relative: href="/page.html" or href="../page.html" — path relative to current file. Use relative URLs within your own site.',
    },
    {
      id: 'ql-2',
      question: 'How do you make a link that opens the user\'s email client?',
      options: [
        '<a href="email:user@example.com">',
        '<a href="mail://user@example.com">',
        '<a href="mailto:user@example.com">',
        '<a href="send:user@example.com">',
      ],
      correct: 2,
      explanation: 'Use href="mailto:email@example.com". When clicked, this opens the user\'s default email application with the To field pre-filled.',
    },
  ],
};
