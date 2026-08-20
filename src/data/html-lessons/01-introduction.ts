import type { HtmlLesson } from '../html-curriculum';

export const htmlIntroLesson: HtmlLesson = {
  id: 'html-intro',
  title: 'Introduction to HTML',
  slug: 'introduction',
  chapter: 'basics',
  order: 1,
  difficulty: 'beginner',
  readingTime: 8,
  description: 'What HTML is, why it exists, how browsers use it, and your first HTML page.',
  sections: [
    {
      type: 'text',
      content: 'HTML stands for HyperText Markup Language. It is the standard language used to create and structure content on the web. Every single webpage you have ever visited — Google, YouTube, Instagram — is built with HTML at its foundation.',
    },
    {
      type: 'analogy',
      title: 'HTML is the skeleton of a webpage',
      content: 'Think of a website like a human body. HTML is the skeleton — it gives the page its structure and shape. CSS is the skin and clothing — it controls how it looks. JavaScript is the muscles — it makes things move and interact. You cannot have a working website without the HTML skeleton.',
    },
    {
      type: 'heading',
      content: 'What Does "HyperText Markup Language" Mean?',
    },
    {
      type: 'list',
      items: [
        'HyperText — Text that contains links to other texts. When you click a link and go to another page, that is "hyper" text navigation.',
        'Markup — HTML uses special tags like <h1>, <p>, <a> to "mark up" ordinary text with meaning. The tag <h1> means "this is a main heading." The tag <p> means "this is a paragraph."',
        'Language — It is a formal language with specific rules and syntax the browser understands.',
      ],
    },
    {
      type: 'heading',
      content: 'What Can You Do With HTML?',
    },
    {
      type: 'list',
      items: [
        'Create headings, paragraphs, and text content',
        'Add images and videos to a page',
        'Create clickable links to other pages',
        'Build forms to collect user input (login forms, contact forms)',
        'Make tables to display data in rows and columns',
        'Structure a webpage into header, main content, and footer',
        'Embed maps, audio players, and YouTube videos',
        'Define SEO metadata that helps Google understand your page',
      ],
    },
    {
      type: 'heading',
      content: 'Your First HTML Document',
    },
    {
      type: 'text',
      content: 'Here is a complete, valid HTML page. Every HTML document starts with this same structure. Let\'s look at each part carefully:',
    },
    {
      type: 'code',
      language: 'html',
            content: 'This is the complete, minimal HTML document structure. Every HTML page needs exactly this skeleton. The DOCTYPE tells the browser to use HTML5. The html element is the root. head contains invisible metadata. body contains all visible content. Indentation shows the parent-child nesting.',
      code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My First HTML Page</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
    <p>This is my first paragraph. HTML is amazing!</p>
    <p>I am learning to build websites.</p>
  </body>
</html>`,
    },
    {
      type: 'list',
      title: 'Line by line explanation:',
      items: [
        '<!DOCTYPE html> — Tells the browser "this is an HTML5 document." Always the very first line.',
        '<html lang="en"> — The root element. Everything goes inside this. lang="en" tells browsers and screen readers the language is English.',
        '<head> — Contains information ABOUT the page (not visible content). Like metadata, title, CSS links.',
        '<meta charset="UTF-8"> — Tells the browser to use UTF-8 encoding, which supports all characters including é, ñ, ü, Arabic, Chinese, etc.',
        '<meta name="viewport"> — Makes the page look correct on mobile phones. Without this, your site looks zoomed out on phones.',
        '<title> — The text shown in the browser tab. Also shown in Google search results.',
        '<body> — Everything visible on the page goes here: text, images, buttons, forms.',
        '<h1> — The main heading. Large and bold by default.',
        '<p> — A paragraph of text.',
      ],
    },
    {
      type: 'tryit',
      title: 'Try It: Your First HTML Page',
      html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>My First Page</title>
  </head>
  <body>
    <h1>Hello, World! 🌍</h1>
    <p>This is a paragraph. HTML structures everything you see.</p>
    <p>Try changing the text above and clicking Run ▶</p>
    <h2>Why Learn HTML?</h2>
    <p>HTML is the foundation of every website. Without HTML, there is no web.</p>
  </body>
</html>`,
      css: `body {
  font-family: system-ui, sans-serif;
  padding: 24px;
  max-width: 600px;
  line-height: 1.6;
  color: #1e1e1e;
}
h1 { color: #2563eb; }
h2 { color: #059669; }
p  { color: #444; }`,
      mode: 'html',
    },
    {
      type: 'heading',
      content: 'How a Browser Reads HTML',
    },
    {
      type: 'text',
      content: 'When you open a webpage, your browser (Chrome, Firefox, Safari) downloads the HTML file from a server. It then reads the tags from top to bottom and renders the page visually. The browser does NOT show you the tags — it uses them as instructions. So <h1>Hello</h1> shows as a large bold "Hello" — the <h1> and </h1> are invisible to the user.',
    },
    {
      type: 'note',
      title: 'HTML is not a programming language',
      content: 'HTML is a markup language, not a programming language. It does not have variables, loops, or logic. It simply describes the structure and content of a page. JavaScript is the programming language of the web.',
    },
    {
      type: 'heading',
      content: 'HTML History — Why It Matters',
    },
    {
      type: 'table',
      title: 'HTML versions over the years',
      headers: ['Year', 'Version', 'What Changed'],
      rows: [
        ['1991', 'HTML 1.0', 'Tim Berners-Lee invented HTML for sharing scientific documents'],
        ['1999', 'HTML 4.01', 'Added CSS support, forms, tables, frames'],
        ['2000', 'XHTML 1.0', 'Stricter version of HTML with XML rules'],
        ['2014', 'HTML5', 'Added video, audio, canvas, semantic tags — what we use today'],
        ['Now',  'Living Standard', 'HTML is continuously updated by WHATWG'],
      ],
    },
  ],
  exercises: [
    {
      id: 'intro-1',
      question: 'What does HTML stand for?',
      type: 'multiple-choice',
      options: [
        'Hyper Transfer Markup Language',
        'HyperText Markup Language',
        'High Text Making Language',
        'Home Tool Markup Language',
      ],
      correct: 1,
      explanation: 'HTML stands for HyperText Markup Language. "Hyper" refers to hyperlinks, "Markup" refers to the tags that annotate content, and "Language" means it has specific syntax rules.',
    },
    {
      id: 'intro-2',
      question: 'Which HTML element is the ROOT element that wraps everything else?',
      type: 'multiple-choice',
      options: ['<body>', '<head>', '<html>', '<main>'],
      correct: 2,
      explanation: 'The <html> element is the root element. Everything in an HTML document — both <head> and <body> — goes inside <html>.',
    },
    {
      id: 'intro-3',
      question: 'Where do you put content that is VISIBLE to users on the page?',
      type: 'multiple-choice',
      options: ['Inside <head>', 'Inside <title>', 'Inside <body>', 'Inside <meta>'],
      correct: 2,
      explanation: 'The <body> element contains all visible content: text, images, headings, links, forms, videos, etc. The <head> contains metadata that is not shown on the page.',
    },
  ],
  quiz: [
    {
      id: 'qi-1',
      question: 'What is the purpose of <!DOCTYPE html>?',
      options: [
        'It creates the page title',
        'It tells the browser this is an HTML5 document',
        'It links a CSS file',
        'It is a comment',
      ],
      correct: 1,
      explanation: '<!DOCTYPE html> is a declaration that tells the browser to render the page using HTML5 standards. It is always the very first line of an HTML document.',
    },
    {
      id: 'qi-2',
      question: 'Why is <meta name="viewport"> important?',
      options: [
        'It makes the page load faster',
        'It sets the background color',
        'It makes the page display correctly on mobile devices',
        'It adds a favicon',
      ],
      correct: 2,
      explanation: 'Without the viewport meta tag, mobile browsers zoom out and display the desktop version of a site. This meta tag ensures the page scales correctly on phones and tablets.',
    },
  ],
};
