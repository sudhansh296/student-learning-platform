import type { HtmlLesson } from '../html-curriculum';
export const htmlHeadLesson: HtmlLesson = {
  id: 'html-head', title: 'HTML Head Element', slug: 'head', chapter: 'advanced', order: 14,
  difficulty: 'beginner', readingTime: 8, description: 'Master everything that goes in <head> — meta tags, title, link, script, and SEO essentials.',
  sections: [
    { type: 'text', content: 'The <head> element contains metadata about the HTML document — information about the page that is NOT displayed to the user. It tells browsers and search engines about the page: its title, character encoding, viewport settings, linked CSS, and SEO information.' },
    { type: 'heading', content: 'What Goes Inside <head>?' },
    { type: 'code', language: 'html',       content: 'This is the complete head section every professional HTML page uses. charset=UTF-8 must always be the first meta tag. The viewport tag is required for mobile responsiveness. The title appears in the browser tab and Google search results. meta description is the text snippet shown in search results. Open Graph tags control how the page appears when shared on social media.',
      code: `<head>
  <!-- 1. Character encoding — always first, supports all characters -->
  <meta charset="UTF-8">

  <!-- 2. Viewport — makes it mobile-responsive -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- 3. Page title — shown in browser tab and Google results -->
  <title>WebDev Atlas — Learn HTML, CSS, JavaScript</title>

  <!-- 4. SEO meta description — shown in Google search results -->
  <meta name="description" content="Learn web development with simple explanations and live code examples.">

  <!-- 5. SEO keywords (less important today but still used) -->
  <meta name="keywords" content="HTML tutorial, CSS, JavaScript, web development">

  <!-- 6. Author -->
  <meta name="author" content="WebDev Atlas Team">

  <!-- 7. Link external CSS stylesheet -->
  <link rel="stylesheet" href="styles.css">

  <!-- 8. Favicon — the small icon in the browser tab -->
  <link rel="icon" type="image/png" href="/favicon.png">

  <!-- 9. Open Graph — how page looks when shared on social media -->
  <meta property="og:title" content="WebDev Atlas">
  <meta property="og:description" content="Learn web development simply.">
  <meta property="og:image" content="https://webdevatlas.dev/og-image.png">
  <meta property="og:url" content="https://webdevatlas.dev">

  <!-- 10. Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="WebDev Atlas">

  <!-- 11. JavaScript file (defer = load after HTML parsed) -->
  <script src="app.js" defer></script>
</head>` },
    { type: 'note', title: 'charset="UTF-8" must be first', content: 'Always put <meta charset="UTF-8"> as the very first tag inside <head>. It ensures all characters render correctly — including emojis, Arabic, Chinese, and special characters.' },
    { type: 'heading', content: 'The <title> Element' },
    { type: 'code', language: 'html',       content: 'link connects external CSS files — rel=stylesheet is required. Place CSS links in head so styles load before content renders, preventing a flash of unstyled content. script with defer loads in parallel and executes after HTML parsing completes.',
      code: `<!-- <title> affects: -->
<!-- 1. Browser tab text -->
<!-- 2. Google search result headline -->
<!-- 3. Browser bookmark name -->
<!-- 4. Screen reader page announcement -->

<title>HTML Tutorial — WebDev Atlas</title>

<!-- Good title formula: Page Name — Site Name -->
<!-- Keep under 60 characters for Google to show it fully -->

<!-- Bad titles: -->
<!-- <title>Page</title>                ← too generic -->
<!-- <title>Untitled Document</title>   ← VS Code default, never use! -->` },
    { type: 'tryit', title: 'Try It: Complete <head> Setup',
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Portfolio — John Smith</title>
  <meta name="description" content="John Smith is a web developer specializing in React and Node.js.">
  <meta name="author" content="John Smith">
</head>
<body>
  <h1>Welcome to my Portfolio</h1>
  <p>Look at the browser tab — you can see the title from &lt;head&gt;.</p>
  <p>Right-click this page and select "View Page Source" to see the full &lt;head&gt; section.</p>

  <h2>What's in the &lt;head&gt;?</h2>
  <ul>
    <li>Page title (visible in browser tab)</li>
    <li>Character encoding (UTF-8)</li>
    <li>Viewport for mobile</li>
    <li>SEO meta description</li>
    <li>CSS links</li>
    <li>Favicon</li>
  </ul>
</body>
</html>`,
      css: `body { font-family: system-ui, sans-serif; padding: 24px; max-width: 600px; }
h1 { color: #2563eb; } h2 { color: #1e1e1e; margin-top: 20px; }
li { color: #374151; margin: 6px 0; }`,
      mode: 'html' },
  ],
  exercises: [
    { id: 'hd1', question: 'What does <meta name="viewport"> do?', type: 'multiple-choice', options: ['Adds a video player', 'Makes the page display correctly on mobile devices', 'Sets background color', 'Adds a scrollbar'], correct: 1, explanation: 'Without the viewport meta tag, mobile browsers show the desktop version zoomed out. This tag ensures correct scaling on phones and tablets.' },
  ],
  quiz: [{ id: 'hq1', question: 'Where must <meta charset="UTF-8"> appear?', options: ['Anywhere in <body>', 'As the first tag in <head>', 'After <title>', 'In <footer>'], correct: 1, explanation: '<meta charset="UTF-8"> must be first in <head> so the browser knows the encoding before reading any other content — including the <title> which may have special characters.' }],
};
