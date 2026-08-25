import type { HtmlLesson } from '../html-curriculum';

export const htmlElementsLesson: HtmlLesson = {
  id: 'html-elements',
  title: 'HTML Elements',
  slug: 'elements',
  chapter: 'structure',
  order: 2,
  difficulty: 'beginner',
  readingTime: 10,
  description: 'Understand what HTML elements are, how start and end tags work, nested elements, and empty elements.',
  sections: [
    {
      type: 'text',
      content: 'An HTML element is the basic building block of every webpage. An element tells the browser what type of content it is - a heading, a paragraph, a link, an image, a button. Understanding elements is the single most important concept in HTML.',
    },
    {
      type: 'heading',
      content: 'What is an HTML Element?',
    },
    {
      type: 'text',
      content: 'An HTML element consists of three parts: an opening tag, content, and a closing tag. The opening tag starts the element. The closing tag (with a / before the tag name) ends it. Everything in between is the content.',
    },
    {
      type: 'code',
      language: 'html',
      content: 'Every HTML element has three parts: an opening tag (like <p>), the content in the middle, and a closing tag (like </p>) with a forward slash. The tag name tells the browser what kind of content it is - h1 for main heading, p for paragraph, strong for bold, em for italic.',
      code: `<!-- The anatomy of an HTML element: -->

<tagname>Content goes here</tagname>

<!-- Real examples: -->
<h1>This is a main heading</h1>
<p>This is a paragraph of text.</p>
<strong>This text is bold and important</strong>
<em>This text is emphasized (italic)</em>`,
    },
    {
      type: 'table',
      title: 'Element anatomy breakdown',
      headers: ['Part', 'Example', 'Purpose'],
      rows: [
        ['Opening tag', '<h1>', 'Starts the element, tells browser what type it is'],
        ['Content', 'My Heading', 'The actual text or nested elements'],
        ['Closing tag', '</h1>', 'Ends the element (note the / slash)'],
        ['Full element', '<h1>My Heading</h1>', 'Everything from open to close tag'],
      ],
    },
    {
      type: 'heading',
      content: 'Nested HTML Elements',
    },
    {
      type: 'text',
      content: 'HTML elements can contain other elements inside them. This is called "nesting." The outer element is the "parent" and the inner element is the "child." Proper nesting is critical - always close inner tags before outer tags.',
    },
    {
      type: 'code',
      language: 'html',
      content: 'Nesting means placing elements inside other elements. The outer element is the parent, the inner is the child. Always close inner tags before outer ones - if you open <strong> inside <p>, you must close </strong> before </p>. Wrong nesting causes broken layouts that are hard to debug.',
      code: `<!-- Correct nesting - inner tag closes before outer tag -->
<p>This is <strong>bold text</strong> inside a paragraph.</p>
<p>This is <em>italic text</em> in another paragraph.</p>

<!-- The full HTML document is also nested elements -->
<html>
  <head>
    <title>Page Title</title>
  </head>
  <body>
    <h1>Main Heading</h1>
    <p>A paragraph with <a href="#">a link</a> inside.</p>
  </body>
</html>

<!-- WRONG - never do this: overlapping tags -->
<!-- <p>This is <strong>wrong</p></strong> -->`,
    },
    {
      type: 'warning',
      title: 'Always close your tags in the correct order',
      content: 'If you open <strong> inside <p>, you must close </strong> before closing </p>. Overlapping tags like <p><strong>text</p></strong> cause unpredictable browser behavior and broken layouts.',
    },
    {
      type: 'heading',
      content: 'Empty Elements (Self-Closing Tags)',
    },
    {
      type: 'text',
      content: 'Some HTML elements have NO content and NO closing tag. They are called "empty elements" or "void elements." They stand alone. The most common ones are <br>, <img>, <input>, <hr>, and <meta>.',
    },
    {
      type: 'code',
      language: 'html',
      content: 'Empty elements (also called void elements) have NO content and NO closing tag - they stand alone. The most common ones are <br> (line break), <img> (image), <input> (form field), <hr> (horizontal divider), and <meta> (page metadata). You may optionally write a self-closing slash like <br /> - both forms are valid in HTML5.',
      code: `<!-- Empty elements have no content and no closing tag -->

<!-- Line break -->
<p>First line.<br>Second line.</p>

<!-- Horizontal rule (a dividing line) -->
<hr>

<!-- Image -->
<img src="photo.jpg" alt="A photo">

<!-- Input field -->
<input type="text" placeholder="Enter your name">

<!-- Meta tag in head -->
<meta charset="UTF-8">

<!-- In HTML5, you can optionally write the self-closing slash: -->
<br />   <!-- same as <br> -->
<img />  <!-- same as <img> -->`,
    },
    {
      type: 'tryit',
      title: 'Try It: HTML Elements',
      html: `<!DOCTYPE html>
<html>
<head><title>Elements Demo</title></head>
<body>

  <h1>This is an h1 heading</h1>
  <h2>This is an h2 heading</h2>
  <h3>This is an h3 heading</h3>

  <p>This is a paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>

  <p>Here is a line break:<br>The text after the line break.</p>

  <hr>

  <p>Below the horizontal rule above.</p>

  <p>This paragraph has a <a href="#">clickable link</a> inside it.</p>

</body>
</html>`,
      css: `body { font-family: system-ui, sans-serif; padding: 20px; line-height: 1.6; }
h1 { color: #2563eb; }
h2 { color: #7c3aed; }
h3 { color: #059669; }
a  { color: #2563eb; }
hr { border: none; border-top: 2px solid #e5e7eb; margin: 20px 0; }`,
      mode: 'html',
    },
    {
      type: 'heading',
      content: 'HTML is Not Case Sensitive',
    },
    {
      type: 'text',
      content: 'HTML tag names are not case sensitive. <P>, <p>, and <P> all mean the same thing. However, the official W3C recommendation is to always write tags in lowercase. This is the industry standard and what you will see in all professional codebases.',
    },
    {
      type: 'code',
      language: 'html',
            content: 'HTML tag names are not case-sensitive - P and p both work. But the industry standard and W3C recommendation is always lowercase. All professional code you will ever read uses lowercase tags. Inconsistent casing makes code hard to read and maintain.',
      code: `<!-- These all work, but lowercase is the standard -->
<P>This is a paragraph</P>         <!-- works but not recommended -->
<p>This is a paragraph</p>         <!-- correct - always use lowercase -->
<P>This is a paragraph</p>         <!-- works but inconsistent - avoid -->`,
    },
    {
      type: 'tip',
      title: 'Industry Best Practice',
      content: 'Always write HTML tags in lowercase. Use proper indentation (2 or 4 spaces) for nested elements. Always include closing tags. These habits make your code readable and professional.',
    },
  ],
  exercises: [
    {
      id: 'elem-1',
      question: 'Which of these is a correct HTML element?',
      type: 'multiple-choice',
      options: [
        '<p>Hello<p>',
        '<p>Hello</p>',
        'p>Hello</p>',
        '<p Hello /p>',
      ],
      correct: 1,
      explanation: '<p>Hello</p> is correct. It has a proper opening tag <p>, content, and a closing tag </p> with the forward slash.',
    },
    {
      id: 'elem-2',
      question: 'Which HTML element is an EMPTY element (has no closing tag)?',
      type: 'multiple-choice',
      options: ['<p>', '<div>', '<br>', '<h1>'],
      correct: 2,
      explanation: '<br> is an empty element. It creates a line break and has no content and no closing tag. Other empty elements include <img>, <input>, <hr>, and <meta>.',
    },
    {
      id: 'elem-3',
      question: 'What is wrong with this HTML: <p><strong>text</p></strong>',
      type: 'multiple-choice',
      options: [
        'Nothing wrong',
        'The tags are overlapping - strong must close before p closes',
        'p and strong cannot be nested',
        'Closing tags need a space before the slash',
      ],
      correct: 1,
      explanation: 'Tags must be closed in reverse order of opening. Since <strong> was opened inside <p>, you must close </strong> first, then </p>. Correct: <p><strong>text</strong></p>',
    },
  ],
  quiz: [
    {
      id: 'qe-1',
      question: 'What is the term for elements inside other elements?',
      options: ['Inline elements', 'Nested elements', 'Child-only elements', 'Sub-elements'],
      correct: 1,
      explanation: 'Nesting means placing elements inside other elements. The outer element is the parent, and the inner element is the child.',
    },
    {
      id: 'qe-2',
      question: 'In HTML, how do you write a closing tag for <div>?',
      options: ['<div/>', '</div>', '<\\div>', '<-div>'],
      correct: 1,
      explanation: 'Closing tags are written with a forward slash before the tag name: </div>. This applies to all closing tags: </p>, </h1>, </body>, etc.',
    },
  ],
};
