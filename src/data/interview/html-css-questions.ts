import { InterviewQuestion } from '@/lib/interview-types';

export const htmlInterviewQuestions: InterviewQuestion[] = [
  {
    id: 'html-semantic',
    category: 'html',
    type: 'theory',
    question: 'What is semantic HTML and why is it important?',
    difficulty: 'beginner',
    tags: ['semantic', 'accessibility', 'seo'],
    
    shortAnswer: 'Semantic HTML uses tags that clearly describe their meaning and content (like <article>, <nav>, <header>) instead of generic <div> tags.',
    
    detailedExplanation: 'Semantic HTML elements have meaningful names that describe their purpose and content. They improve accessibility for screen readers, help search engines understand page structure, and make code more readable. Examples include <header>, <footer>, <article>, <section>, <nav>, <aside>, <main>, and <figure>.',
    
    example: {
      code: `<!-- Non-semantic -->
<div class="header">
  <div class="nav">...</div>
</div>
<div class="content">...</div>

<!-- Semantic -->
<header>
  <nav>...</nav>
</header>
<main>
  <article>
    <h1>Title</h1>
    <p>Content...</p>
  </article>
</main>
<footer>...</footer>`,
      language: 'html'
    },
    
    interviewAnswer: 'Semantic HTML makes websites more accessible and SEO-friendly. Screen readers can better understand page structure when we use <nav> instead of <div class="nav">. Search engines give more weight to content in semantic tags. It also makes my code self-documenting - other developers immediately understand the page structure.',
    
    commonMistakes: [
      'Using <div> for everything instead of semantic alternatives',
      'Multiple <main> tags on one page (should be only one)',
      'Using <article> for any content instead of self-contained content'
    ],
    
    realWorldUse: 'Modern websites use semantic HTML for better accessibility and SEO. Content management systems generate semantic markup. Government and educational sites require semantic HTML for accessibility compliance.',
    
    followUpQuestions: [
      'What\'s the difference between <section> and <article>?',
      'When should you use <div> instead of semantic tags?',
      'How do semantic tags help with accessibility?'
    ],
    
    relatedLessons: [
      { tech: 'html', lesson: 'semantic', title: 'Semantic HTML' }
    ]
  },

  {
    id: 'html-forms',
    category: 'html',
    type: 'theory',
    question: 'Explain different HTML form input types and their uses',
    difficulty: 'beginner',
    tags: ['forms', 'input', 'validation'],
    
    shortAnswer: 'HTML5 provides specific input types like email, tel, date, number, etc. that provide built-in validation and better mobile keyboards.',
    
    detailedExplanation: 'HTML5 input types provide semantic meaning, browser validation, and appropriate mobile keyboards. text, email, password, tel, url, date, time, number, range, color, file, checkbox, radio, and more. Each type triggers specific behavior - email shows @ on mobile keyboards, date shows a calendar picker, number shows +/- buttons.',
    
    example: {
      code: `<form>
  <!-- Email with validation -->
  <input type="email" required />
  
  <!-- Tel shows number keyboard on mobile -->
  <input type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" />
  
  <!-- Date picker -->
  <input type="date" min="2024-01-01" />
  
  <!-- Number with constraints -->
  <input type="number" min="0" max="100" step="5" />
  
  <!-- Range slider -->
  <input type="range" min="0" max="100" value="50" />
  
  <!-- Color picker -->
  <input type="color" value="#3498db" />
</form>`,
      language: 'html'
    },
    
    interviewAnswer: 'Using the right input type improves user experience significantly. Type="email" gives users an @ key on mobile and validates email format. Type="number" prevents non-numeric input. Type="date" shows a calendar picker instead of forcing users to type dates. This makes forms faster and prevents input errors.',
    
    commonMistakes: [
      'Using type="text" for everything',
      'Not using required/pattern attributes for validation',
      'Forgetting to add labels for accessibility'
    ],
    
    realWorldUse: 'E-commerce checkout forms, contact forms, booking systems, and user registration all benefit from proper input types. Mobile users especially appreciate correct keyboards for email, phone, and number inputs.',
    
    followUpQuestions: [
      'What\'s the difference between required and pattern attributes?',
      'How do you validate forms in JavaScript?',
      'What is the difference between type="submit" and type="button"?'
    ]
  },

  {
    id: 'html-doctype',
    category: 'html',
    type: 'theory',
    question: 'What is DOCTYPE and why is it important?',
    difficulty: 'beginner',
    tags: ['doctype', 'html5', 'standards'],
    
    shortAnswer: 'DOCTYPE tells the browser which version of HTML the document uses. <!DOCTYPE html> triggers standards mode for HTML5.',
    
    detailedExplanation: 'DOCTYPE (Document Type Declaration) is the first line in an HTML document. It instructs the browser how to render the page. Without it, browsers use quirks mode (inconsistent rendering). HTML5\'s DOCTYPE is simple: <!DOCTYPE html>. Older versions had complex DTDs. Modern browsers use standards mode with the HTML5 DOCTYPE, ensuring consistent CSS and JavaScript behavior.',
    
    example: {
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>

<!-- Older HTML4 DOCTYPE (don't use) -->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">`,
      language: 'html'
    },
    
    interviewAnswer: 'DOCTYPE is essential for consistent cross-browser rendering. Without it, browsers use quirks mode which can cause layout and JavaScript bugs. HTML5 simplified it to just <!DOCTYPE html>. I always include it as the first line to ensure my page renders in standards mode across all browsers.',
    
    commonMistakes: [
      'Omitting DOCTYPE entirely',
      'Adding content before DOCTYPE',
      'Using old HTML4 DOCTYPEs in new projects'
    ],
    
    realWorldUse: 'Every HTML page should start with DOCTYPE. Build tools and frameworks include it automatically. Without it, CSS box model and JavaScript DOM APIs may behave inconsistently.',
    
    followUpQuestions: [
      'What is quirks mode vs standards mode?',
      'What happens if you omit DOCTYPE?',
      'Why is HTML5 DOCTYPE simpler than HTML4?'
    ]
  },

  {
    id: 'html-meta-tags',
    category: 'html',
    type: 'theory',
    question: 'What are meta tags and what are the most important ones?',
    difficulty: 'beginner',
    tags: ['meta', 'seo', 'viewport'],
    
    shortAnswer: 'Meta tags provide metadata about the HTML document. Key ones include charset, viewport, description, keywords, and Open Graph tags for SEO and social sharing.',
    
    detailedExplanation: 'Meta tags go in <head> and provide information to browsers, search engines, and social media platforms. charset="UTF-8" sets character encoding. viewport controls responsive design on mobile. description and keywords help with SEO. Open Graph (og:) and Twitter Card tags control how links appear when shared on social media.',
    
    example: {
      code: `<head>
  <!-- Character encoding -->
  <meta charset="UTF-8">
  
  <!-- Responsive design -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- SEO -->
  <meta name="description" content="Learn web development with interactive tutorials">
  <meta name="keywords" content="web development, HTML, CSS, JavaScript">
  <meta name="author" content="Your Name">
  
  <!-- Open Graph for social media -->
  <meta property="og:title" content="Web Dev Atlas">
  <meta property="og:description" content="Master web development">
  <meta property="og:image" content="https://example.com/preview.jpg">
  <meta property="og:url" content="https://example.com">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  
  <!-- Robots -->
  <meta name="robots" content="index, follow">
</head>`,
      language: 'html'
    },
    
    interviewAnswer: 'Meta tags are crucial for SEO and mobile responsiveness. The viewport meta tag is essential for responsive design - without it, mobile browsers zoom out to show the desktop version. Description and title meta tags influence search engine rankings and click-through rates. Open Graph tags make your links look professional when shared on social media.',
    
    commonMistakes: [
      'Forgetting viewport meta tag (breaks mobile responsiveness)',
      'Using duplicate meta tags',
      'Not optimizing description length (should be 150-160 characters)',
      'Using keywords meta tag (Google ignores it now)'
    ],
    
    realWorldUse: 'Every production website uses meta tags for SEO, social sharing, and mobile optimization. Frameworks like Next.js provide components to manage meta tags. Google Search Console shows how your meta tags appear in search results.',
    
    followUpQuestions: [
      'Why is the viewport meta tag important?',
      'What is the ideal length for a meta description?',
      'What are Open Graph tags used for?'
    ]
  },

  {
    id: 'html-data-attributes',
    category: 'html',
    type: 'theory',
    question: 'What are data attributes and how do you use them?',
    difficulty: 'intermediate',
    tags: ['data-attributes', 'javascript', 'dom'],
    
    shortAnswer: 'Data attributes (data-*) store custom data on HTML elements. They\'re accessible via JavaScript\'s dataset property or getAttribute().',
    
    detailedExplanation: 'Data attributes let you store extra information on HTML elements without using non-standard attributes or extra DOM properties. Any attribute starting with "data-" is valid. Use them to store IDs, states, or configuration that JavaScript needs. Access them via element.dataset.attributeName (camelCase) or getAttribute("data-attribute-name") (kebab-case).',
    
    example: {
      code: `<!-- HTML -->
<button 
  data-user-id="123" 
  data-action="delete" 
  data-confirm-message="Are you sure?">
  Delete
</button>

<div data-tooltip="This is a tooltip" data-position="top">
  Hover me
</div>

<!-- JavaScript -->
<script>
const button = document.querySelector('button');

// Using dataset (camelCase)
console.log(button.dataset.userId);          // "123"
console.log(button.dataset.action);          // "delete"
console.log(button.dataset.confirmMessage);  // "Are you sure?"

// Using getAttribute (kebab-case)
console.log(button.getAttribute('data-user-id')); // "123"

// Setting data attribute
button.dataset.status = 'pending';
// Creates: data-status="pending"
</script>`,
      language: 'html'
    },
    
    interviewAnswer: 'Data attributes are great for storing metadata that JavaScript needs without cluttering your code with IDs or classes. I use them for storing user IDs on buttons, configuration for components, or state information. They\'re better than hidden inputs or inline JavaScript because they keep data separate from behavior and are easy to access with dataset.',
    
    commonMistakes: [
      'Using data attributes for styling (use classes instead)',
      'Storing large amounts of data (affects performance)',
      'Not validating data retrieved from attributes',
      'Mixing camelCase and kebab-case incorrectly'
    ],
    
    realWorldUse: 'JavaScript libraries like Bootstrap and Alpine.js use data attributes for configuration. SPA frameworks use them to store component state. Analytics tools use them to track user interactions without interfering with regular attributes.',
    
    followUpQuestions: [
      'How do you access data attributes in CSS?',
      'What\'s the difference between dataset and getAttribute?',
      'Can you store objects in data attributes?'
    ]
  },

  {
    id: 'html-canvas-svg',
    category: 'html',
    type: 'theory',
    question: 'What is the difference between Canvas and SVG?',
    difficulty: 'intermediate',
    tags: ['canvas', 'svg', 'graphics'],
    
    shortAnswer: 'Canvas is raster-based (pixels), drawn with JavaScript, and good for complex animations. SVG is vector-based (XML), resolution-independent, and good for icons and interactive graphics.',
    
    detailedExplanation: 'Canvas is a bitmap drawing surface manipulated with JavaScript. It\'s pixel-based, so it loses quality when scaled. Great for games, complex visualizations, and pixel manipulation. SVG is vector graphics defined in XML. It scales perfectly, individual elements are DOM nodes (can attach events), and works well with CSS. SVG is better for charts, icons, and interactive graphics.',
    
    example: {
      code: `<!-- Canvas -->
<canvas id="myCanvas" width="200" height="200"></canvas>
<script>
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#3498db';
ctx.fillRect(10, 10, 100, 100);
ctx.arc(100, 100, 50, 0, Math.PI * 2);
ctx.fill();
</script>

<!-- SVG -->
<svg width="200" height="200">
  <rect x="10" y="10" width="100" height="100" fill="#3498db" />
  <circle cx="100" cy="100" r="50" fill="#e74c3c" />
  <text x="50" y="120" font-family="Arial" font-size="20" fill="white">
    Hello
  </text>
</svg>`,
      language: 'html'
    },
    
    interviewAnswer: 'Canvas and SVG solve different problems. Canvas is for pixel-based graphics like games or photo editors - I draw with JavaScript and it renders fast for many objects. SVG is for scalable graphics like icons and charts - elements are part of the DOM so I can style them with CSS and attach event listeners. For dashboards, I\'d use SVG. For a game, Canvas.',
    
    commonMistakes: [
      'Using Canvas for simple shapes (SVG is easier)',
      'Using SVG for thousands of elements (Canvas is faster)',
      'Forgetting Canvas doesn\'t scale well',
      'Not understanding Canvas 2D context vs WebGL context'
    ],
    
    realWorldUse: 'Chart libraries like Chart.js use Canvas for performance. Icon libraries use SVG for scalability. Games use Canvas or WebGL. Data visualizations often use SVG (D3.js) for interactivity.',
    
    followUpQuestions: [
      'When would you choose Canvas over SVG?',
      'Can you animate SVG with CSS?',
      'What is the Canvas 2D context vs WebGL context?'
    ]
  },

  {
    id: 'html-accessibility',
    category: 'html',
    type: 'theory',
    question: 'What are ARIA attributes and when should you use them?',
    difficulty: 'intermediate',
    tags: ['accessibility', 'aria', 'a11y'],
    
    shortAnswer: 'ARIA (Accessible Rich Internet Applications) attributes provide additional accessibility information to screen readers when semantic HTML isn\'t sufficient.',
    
    detailedExplanation: 'ARIA attributes help make web applications accessible to users with disabilities. Use them when semantic HTML elements aren\'t available or don\'t convey enough meaning. Key ARIA attributes include role (defines element purpose), aria-label (provides text description), aria-describedby (references additional description), aria-hidden (hides from screen readers), and aria-live (announces dynamic content changes).',
    
    example: {
      code: `<!-- Use semantic HTML first (no ARIA needed) -->
<button>Click Me</button>

<!-- ARIA when semantic HTML isn't enough -->
<div role="button" tabindex="0" aria-label="Close dialog">
  Ã—
</div>

<!-- ARIA labels -->
<button aria-label="Search">
  <svg><!-- search icon --></svg>
</button>

<!-- ARIA for form validation -->
<input 
  type="email" 
  aria-invalid="true" 
  aria-describedby="email-error"
>
<span id="email-error">Please enter a valid email</span>

<!-- ARIA for dynamic content -->
<div role="status" aria-live="polite">
  Loading...
</div>

<!-- Hide decorative elements -->
<img src="decorative.png" alt="" aria-hidden="true">`,
      language: 'html'
    },
    
    interviewAnswer: 'First rule of ARIA: don\'t use it if semantic HTML works. I use ARIA when building custom components like modals, dropdowns, or tabs that don\'t have native HTML equivalents. aria-label helps screen readers understand icon buttons. aria-live announces dynamic updates like notifications. However, overusing ARIA can make things less accessible, so I test with actual screen readers.',
    
    commonMistakes: [
      'Using ARIA instead of semantic HTML',
      'Adding redundant ARIA to semantic elements',
      'Forgetting keyboard navigation with ARIA roles',
      'Not testing with actual screen readers'
    ],
    
    realWorldUse: 'Component libraries like Material-UI include proper ARIA attributes. Government and educational sites require WCAG compliance. Single-page apps use ARIA to announce route changes and dynamic content updates.',
    
    followUpQuestions: [
      'What is the first rule of ARIA?',
      'How do you make a custom dropdown accessible?',
      'What is aria-live used for?'
    ]
  },

  {
    id: 'html-local-session-storage',
    category: 'html',
    type: 'theory',
    question: 'What is the difference between localStorage and sessionStorage?',
    difficulty: 'intermediate',
    tags: ['storage', 'api', 'persistence'],
    
    shortAnswer: 'localStorage persists data with no expiration. sessionStorage clears data when the browser tab closes. Both store key-value pairs as strings.',
    
    detailedExplanation: 'localStorage and sessionStorage are Web Storage APIs that store data in the browser. localStorage has no expiration - data persists until explicitly deleted. sessionStorage is tab-specific and clears when the tab closes. Both store only strings (use JSON.stringify/parse for objects), have ~5-10MB limit, and are synchronous APIs. Cookies are different - they\'re sent with every HTTP request and have smaller limits.',
    
    example: {
      code: `// localStorage - persists forever
localStorage.setItem('username', 'Alex');
localStorage.setItem('theme', 'dark');
console.log(localStorage.getItem('username')); // 'Alex'
localStorage.removeItem('theme');
localStorage.clear(); // Remove all

// sessionStorage - clears on tab close
sessionStorage.setItem('tempData', 'value');

// Storing objects (must stringify)
const user = { name: 'Alex', age: 25 };
localStorage.setItem('user', JSON.stringify(user));
const retrieved = JSON.parse(localStorage.getItem('user'));

// Check if key exists
if (localStorage.getItem('token')) {
  // User is logged in
}`,
      language: 'javascript'
    },
    
    interviewAnswer: 'I use localStorage for data that should persist across sessions like user preferences, themes, or authentication tokens. sessionStorage is for temporary data like form inputs during a multi-step process. Unlike cookies, storage APIs don\'t send data with every request, so they\'re more efficient for client-side data. Important to note: they\'re synchronous, so large operations can block the UI.',
    
    commonMistakes: [
      'Storing sensitive data without encryption',
      'Forgetting to JSON.stringify objects',
      'Not handling storage quota exceeded errors',
      'Assuming data is available cross-domain (it\'s origin-specific)'
    ],
    
    realWorldUse: 'E-commerce sites store cart data in localStorage. Authentication tokens are often stored in localStorage (though httpOnly cookies are more secure). Dark mode preferences persist with localStorage.',
    
    followUpQuestions: [
      'What\'s the difference between localStorage and cookies?',
      'How do you handle storage quota exceeded?',
      'Is localStorage secure for sensitive data?'
    ]
  }
];

export const cssInterviewQuestions: InterviewQuestion[] = [
  {
    id: 'css-box-model',
    category: 'css',
    type: 'theory',
    question: 'Explain the CSS Box Model',
    difficulty: 'beginner',
    tags: ['box-model', 'layout', 'fundamentals'],
    
    shortAnswer: 'The box model consists of content, padding, border, and margin. Width/height apply to content by default (content-box), unless box-sizing: border-box is used.',
    
    detailedExplanation: 'Every HTML element is a box. From inside out: Content (text/images), Padding (space inside border), Border (outline), Margin (space outside border). By default, width/height only apply to content (box-sizing: content-box). Modern CSS uses box-sizing: border-box to include padding and border in the width/height.',
    
    example: {
      code: `/* Default box model */
.box {
  width: 200px;
  padding: 20px;
  border: 5px solid black;
  margin: 10px;
}
/* Total width = 200 + 40 + 10 = 250px */

/* Modern approach */
.box {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 5px solid black;
  margin: 10px;
}
/* Total width = 200px (padding/border included) */

/* Common reset */
* {
  box-sizing: border-box;
}`,
      language: 'css'
    },
    
    interviewAnswer: 'The box model is fundamental to CSS layout. I always use box-sizing: border-box in my projects because it makes sizing more intuitive - if I set width: 200px, it\'s actually 200px including padding and border. Understanding the box model helps debug spacing issues and create precise layouts.',
    
    commonMistakes: [
      'Forgetting that margin doesn\'t add background color',
      'Not accounting for padding/border when calculating widths',
      'Margin collapse between adjacent elements'
    ],
    
    realWorldUse: 'Every layout decision involves the box model. Creating cards, forms, navigation menus - all require understanding padding, border, and margin. Modern CSS resets set box-sizing: border-box globally.',
    
    followUpQuestions: [
      'What is margin collapse?',
      'What\'s the difference between padding and margin?',
      'How does box-sizing: border-box work?'
    ]
  },

  {
    id: 'css-flexbox',
    category: 'css',
    type: 'theory',
    question: 'How does Flexbox work? When would you use it?',
    difficulty: 'intermediate',
    tags: ['flexbox', 'layout', 'responsive'],
    
    shortAnswer: 'Flexbox is a one-dimensional layout system for arranging items in rows or columns. Items can grow, shrink, and align along a main axis.',
    
    detailedExplanation: 'Flexbox creates flexible layouts where items automatically adjust to available space. The container has display: flex and controls direction (row/column), wrapping, and alignment. Items can grow (flex-grow), shrink (flex-shrink), and have base size (flex-basis). Main axis vs cross axis determines how justify-content and align-items work.',
    
    example: {
      code: `/* Container */
.container {
  display: flex;
  flex-direction: row;        /* row | column */
  justify-content: space-between; /* main axis */
  align-items: center;        /* cross axis */
  gap: 1rem;
}

/* Items */
.item {
  flex: 1; /* flex-grow: 1, flex-shrink: 1, flex-basis: 0 */
}

.item-fixed {
  flex: 0 0 200px; /* don't grow/shrink, 200px */
}

/* Common pattern: center anything */
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}`,
      language: 'css'
    },
    
    interviewAnswer: 'Flexbox is my go-to for one-dimensional layouts - like navigation bars, card layouts, or vertically centering content. It\'s perfect when you want items to automatically adjust to available space. I use it for responsive designs where items should wrap or grow/shrink. The main advantage over floats or positioning is that it\'s designed specifically for layout.',
    
    commonMistakes: [
      'Confusing justify-content (main axis) and align-items (cross axis)',
      'Forgetting that flex-direction changes which axis is main',
      'Not understanding flex: 1 is shorthand for three properties'
    ],
    
    realWorldUse: 'Navigation bars, card grids, form layouts, centering elements, responsive sidebars. Most modern websites use Flexbox extensively. It\'s supported in all modern browsers.',
    
    followUpQuestions: [
      'What\'s the difference between Flexbox and Grid?',
      'How does flex-wrap work?',
      'What is the difference between align-items and align-content?'
    ]
  },

  {
    id: 'css-grid',
    category: 'css',
    type: 'theory',
    question: 'What is CSS Grid and when should you use it over Flexbox?',
    difficulty: 'intermediate',
    tags: ['grid', 'layout', 'responsive'],
    
    shortAnswer: 'CSS Grid is a two-dimensional layout system for rows AND columns simultaneously. Use Grid for page layouts, Flexbox for components within those layouts.',
    
    detailedExplanation: 'Grid creates layouts with rows and columns. You define grid-template-columns and grid-template-rows, then place items using grid areas or line numbers. Grid is two-dimensional (controls both axes simultaneously) while Flexbox is one-dimensional. Grid is better for overall page layouts, Flexbox better for component-level layouts.',
    
    example: {
      code: `/* Basic grid */
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

/* Responsive grid */
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

/* Layout with named areas */
.page {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
  grid-template-columns: 200px 1fr 1fr;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }`,
      language: 'css'
    },
    
    interviewAnswer: 'Grid is perfect for complex page layouts where I need control over both rows and columns. I use it for dashboard layouts, image galleries, and overall page structure. Flexbox is better for simpler, one-dimensional layouts like navbars. Often I use Grid for the page structure and Flexbox for components within those grid areas.',
    
    commonMistakes: [
      'Using Grid when Flexbox would be simpler',
      'Not using fr units (using px/% everywhere)',
      'Not leveraging auto-fit/auto-fill for responsive grids'
    ],
    
    realWorldUse: 'Dashboard layouts, image galleries, card grids, magazine-style layouts, responsive page structures. Grid makes complex layouts that used to require frameworks much simpler.',
    
    followUpQuestions: [
      'What does fr unit mean?',
      'What\'s the difference between auto-fit and auto-fill?',
      'Can you use Grid and Flexbox together?'
    ]
  },

  {
    id: 'css-specificity',
    category: 'css',
    type: 'theory',
    question: 'How does CSS specificity work?',
    difficulty: 'intermediate',
    tags: ['specificity', 'selectors', 'cascade'],
    
    shortAnswer: 'Specificity determines which CSS rule applies when multiple rules target the same element. Inline styles (1000) > IDs (100) > Classes/attributes (10) > Elements (1).',
    
    detailedExplanation: 'CSS specificity is calculated as (inline, IDs, classes/attributes/pseudo-classes, elements/pseudo-elements). More specific selectors override less specific ones. !important overrides everything (but avoid it). When specificity is equal, the last rule wins (cascade). Understanding specificity helps debug why styles aren\'t applying.',
    
    example: {
      code: `/* Specificity examples */
p { color: black; }                    /* 0,0,0,1 */
.text { color: blue; }                 /* 0,0,1,0 */
#title { color: red; }                 /* 0,1,0,0 */
<p style="color: green;">              /* 1,0,0,0 */

/* Compound selectors */
div p { color: black; }                /* 0,0,0,2 */
.container .text { color: blue; }      /* 0,0,2,0 */
#main .text p { color: red; }          /* 0,1,1,1 */

/* !important (avoid when possible) */
p { color: yellow !important; }`,
      language: 'css'
    },
    
    interviewAnswer: 'Specificity is why my styles sometimes don\'t apply - a more specific rule is winning. I try to keep specificity low using classes instead of IDs, which makes styles easier to override. I avoid !important except for utility classes. When debugging, browser DevTools shows which rules are overridden and why.',
    
    commonMistakes: [
      'Overusing !important',
      'Using overly specific selectors (makes CSS hard to maintain)',
      'Not understanding why inline styles override external CSS'
    ],
    
    realWorldUse: 'Understanding specificity helps debug why styles aren\'t applying and helps structure CSS effectively. Modern methodologies like BEM try to keep specificity flat and predictable.',
    
    followUpQuestions: [
      'Why should you avoid !important?',
      'What is the cascade in CSS?',
      'How do you override a very specific selector?'
    ]
  },

  {
    id: 'css-position',
    category: 'css',
    type: 'theory',
    question: 'Explain different CSS position values (static, relative, absolute, fixed, sticky)',
    difficulty: 'intermediate',
    tags: ['position', 'layout', 'positioning'],
    
    shortAnswer: 'static (default), relative (offset from normal position), absolute (relative to positioned ancestor), fixed (relative to viewport), sticky (relative until scroll threshold).',
    
    detailedExplanation: 'Position controls how elements are positioned in the document flow. static is default (normal flow). relative stays in flow but can be offset with top/right/bottom/left. absolute removes from flow, positions relative to nearest positioned (non-static) ancestor. fixed positions relative to viewport, stays on screen when scrolling. sticky is relative until crossing a threshold, then becomes fixed.',
    
    example: {
      code: `/* Relative - offset from normal position */
.box {
  position: relative;
  top: 20px;
  left: 30px;
}

/* Absolute - relative to parent with position */
.parent {
  position: relative;
}
.child {
  position: absolute;
  top: 0;
  right: 0;
}

/* Fixed - relative to viewport */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

/* Sticky - relative until scroll threshold */
.sidebar {
  position: sticky;
  top: 20px; /* 20px from top when sticky */
}`,
      language: 'css'
    },
    
    interviewAnswer: 'Position is fundamental for layouts. I use relative on parents to create positioning contexts for absolute children - like positioning a badge on a button. Fixed is perfect for headers or modals that stay on screen. Sticky is great for table headers or sidebars that should stick when scrolling. Remember absolute and fixed remove elements from normal flow, which affects other elements\' positions.',
    
    commonMistakes: [
      'Forgetting to set position: relative on parent for absolute child',
      'Using fixed without considering mobile viewport',
      'Not setting z-index with positioned elements',
      'Sticky not working because parent has overflow: hidden'
    ],
    
    realWorldUse: 'Fixed navbars, modals, tooltips use position: fixed. Sticky headers in tables and sidebars. Absolute positioning for dropdowns, badges, and overlays. Relative creates positioning contexts.',
    
    followUpQuestions: [
      'What is a positioning context?',
      'Why doesn\'t sticky work sometimes?',
      'What\'s the default position value?'
    ]
  },

  {
    id: 'css-pseudo-classes-elements',
    category: 'css',
    type: 'theory',
    question: 'What is the difference between pseudo-classes and pseudo-elements?',
    difficulty: 'beginner',
    tags: ['pseudo-classes', 'pseudo-elements', 'selectors'],
    
    shortAnswer: 'Pseudo-classes (:hover, :focus, :nth-child) target element states. Pseudo-elements (::before, ::after, ::first-letter) target specific parts of elements.',
    
    detailedExplanation: 'Pseudo-classes (single colon) select elements in a specific state: :hover (mouse over), :focus (has focus), :active (being clicked), :nth-child (specific child), :first-child, :last-child, :not(). Pseudo-elements (double colon) select and style specific parts: ::before and ::after insert content, ::first-letter styles first letter, ::first-line styles first line, ::selection styles selected text.',
    
    example: {
      code: `/* Pseudo-classes - element states */
button:hover {
  background: blue;
}

input:focus {
  outline: 2px solid blue;
}

li:nth-child(odd) {
  background: #f0f0f0;
}

div:not(.active) {
  opacity: 0.5;
}

/* Pseudo-elements - specific parts */
p::first-letter {
  font-size: 2em;
  font-weight: bold;
}

.quote::before {
  content: '"';
  font-size: 2em;
}

.quote::after {
  content: '"';
}

::selection {
  background: yellow;
  color: black;
}`,
      language: 'css'
    },
    
    interviewAnswer: 'Pseudo-classes help me style different states - like making buttons change color on hover or styling the active navigation link. Pseudo-elements are powerful for adding decorative content without extra HTML. I use ::before and ::after for icons, decorative elements, or clearing floats. Remember pseudo-elements need a content property, even if it\'s empty.',
    
    commonMistakes: [
      'Forgetting content property on ::before/::after',
      'Using single colon for pseudo-elements (old syntax)',
      'Confusing :nth-child() with :nth-of-type()',
      'Trying to use ::before on void elements like <img>'
    ],
    
    realWorldUse: 'Icon fonts use ::before for icons. Tooltips use ::after. Loading spinners use ::before/::after. Form validation styling uses :invalid and :valid. CSS-only accordions use :checked.',
    
    followUpQuestions: [
      'What\'s the difference between :nth-child() and :nth-of-type()?',
      'Can pseudo-elements have pseudo-elements?',
      'Why do ::before and ::after need content property?'
    ]
  },

  {
    id: 'css-animations-transitions',
    category: 'css',
    type: 'theory',
    question: 'What is the difference between CSS transitions and animations?',
    difficulty: 'intermediate',
    tags: ['animations', 'transitions', 'effects'],
    
    shortAnswer: 'Transitions animate from one state to another when triggered (like hover). Animations define multi-step sequences that can loop and run automatically.',
    
    detailedExplanation: 'Transitions are simple A-to-B animations triggered by state changes (hover, focus, class toggle). They need a trigger and transition between two values. Animations use @keyframes to define multiple steps, can loop infinitely, run automatically on load, and offer more control over timing. Use transitions for simple effects, animations for complex sequences.',
    
    example: {
      code: `/* Transition - simple A to B */
.button {
  background: blue;
  transition: background 0.3s ease, transform 0.2s;
}

.button:hover {
  background: darkblue;
  transform: scale(1.05);
}

/* Animation - complex keyframes */
@keyframes slideIn {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.modal {
  animation: slideIn 0.5s ease-out;
}

/* Infinite animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loader {
  animation: spin 1s linear infinite;
}`,
      language: 'css'
    },
    
    interviewAnswer: 'I use transitions for simple interactions - button hovers, dropdown reveals, focus states. They\'re great because they\'re automatic once you define them. Animations are for complex effects like loading spinners, entrance animations, or multi-step sequences. Transitions need a trigger, animations can run automatically. For performance, I animate transform and opacity instead of layout properties.',
    
    commonMistakes: [
      'Animating expensive properties like width/height (use transform instead)',
      'Not using will-change for performance',
      'Forgetting to remove will-change after animation',
      'Using too many simultaneous animations (performance)'
    ],
    
    realWorldUse: 'Button and link transitions improve UX. Loading spinners use infinite animations. Page transitions in SPAs use animations. Skeleton screens use animations for loading states.',
    
    followUpQuestions: [
      'Which CSS properties are performant to animate?',
      'What does will-change do?',
      'How do you pause an animation?'
    ]
  },

  {
    id: 'css-media-queries',
    category: 'css',
    type: 'theory',
    question: 'How do CSS media queries work? What are common breakpoints?',
    difficulty: 'beginner',
    tags: ['responsive', 'media-queries', 'mobile'],
    
    shortAnswer: 'Media queries apply CSS rules based on device characteristics like screen width. Common breakpoints: 640px (mobile), 768px (tablet), 1024px (desktop), 1280px (large).',
    
    detailedExplanation: 'Media queries enable responsive design by applying CSS conditionally. They can target screen width, height, orientation, resolution, and more. Mobile-first approach starts with mobile styles and uses min-width to add styles for larger screens. Desktop-first uses max-width. Modern CSS also has container queries for component-level responsiveness.',
    
    example: {
      code: `/* Mobile-first approach */
.container {
  width: 100%;
  padding: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    max-width: 768px;
    padding: 2rem;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Other media features */
@media (orientation: landscape) {
  /* Landscape styles */
}

@media (prefers-color-scheme: dark) {
  /* Dark mode */
}

@media (max-width: 767px) {
  /* Mobile only */
}`,
      language: 'css'
    },
    
    interviewAnswer: 'Media queries are essential for responsive design. I prefer mobile-first because most traffic is mobile now. I start with mobile styles then use min-width media queries to enhance for larger screens. Common breakpoints match device sizes, but I also add breakpoints where my design breaks. Testing on real devices is important because emulators aren\'t perfect.',
    
    commonMistakes: [
      'Too many breakpoints (makes CSS hard to maintain)',
      'Forgetting viewport meta tag in HTML',
      'Using max-width when min-width would be clearer',
      'Not testing on real mobile devices'
    ],
    
    realWorldUse: 'Every modern website is responsive. Tailwind CSS uses predefined breakpoints (sm, md, lg, xl). CSS frameworks like Bootstrap have mobile-first breakpoints. Dark mode uses prefers-color-scheme media query.',
    
    followUpQuestions: [
      'What is mobile-first design?',
      'What are container queries?',
      'How do you handle retina displays?'
    ]
  },

  {
    id: 'css-units',
    category: 'css',
    type: 'theory',
    question: 'What are the differences between px, em, rem, %, vh, and vw?',
    difficulty: 'beginner',
    tags: ['units', 'layout', 'responsive'],
    
    shortAnswer: 'px (pixels), em (relative to parent font-size), rem (relative to root font-size), % (relative to parent), vh/vw (viewport height/width), fr (grid fraction).',
    
    detailedExplanation: 'px is absolute pixels. em is relative to parent element\'s font-size (compounds when nested). rem is relative to root html font-size (doesn\'t compound, more predictable). % is relative to parent element. vh/vw are viewport units (100vh = full viewport height). Modern CSS also has vmin, vmax, fr (grid fractions), ch (character width), and dvh/svh (dynamic viewport).',
    
    example: {
      code: `html {
  font-size: 16px; /* Base for rem */
}

/* px - absolute */
.fixed {
  width: 300px;
}

/* % - relative to parent */
.half {
  width: 50%; /* Half of parent width */
}

/* em - relative to parent font-size */
.parent {
  font-size: 20px;
}
.child {
  font-size: 1.5em; /* 30px */
  padding: 1em;     /* 30px */
}

/* rem - relative to root */
.text {
  font-size: 1.5rem; /* 24px (16 * 1.5) */
  padding: 1rem;     /* 16px */
}

/* Viewport units */
.hero {
  height: 100vh;     /* Full viewport height */
  width: 100vw;      /* Full viewport width */
}

/* Grid fr units */
.grid {
  grid-template-columns: 1fr 2fr 1fr;
}`,
      language: 'css'
    },
    
    interviewAnswer: 'I use rem for most sizing because it\'s consistent and respects user font-size preferences. px is fine for borders or small fixed values. em is useful for components that should scale together. % for responsive widths. vh/vw for full-screen sections or hero images. The key is understanding what each unit is relative to - that determines when to use it.',
    
    commonMistakes: [
      'Using px for everything (not responsive or accessible)',
      'Using em for everything (compounds and gets confusing)',
      'Using 100vh on mobile (doesn\'t account for browser UI)',
      'Not setting a base font-size when using rem'
    ],
    
    realWorldUse: 'Design systems use rem for consistent spacing. Responsive layouts use % and viewport units. Grid layouts use fr units. Accessibility requires relative units for text that can scale.',
    
    followUpQuestions: [
      'Why is rem better than em for most use cases?',
      'What is the difference between vh and dvh?',
      'When should you use px vs rem?'
    ]
  },

  {
    id: 'css-z-index',
    category: 'css',
    type: 'theory',
    question: 'How does z-index work and what is stacking context?',
    difficulty: 'intermediate',
    tags: ['z-index', 'stacking', 'position'],
    
    shortAnswer: 'z-index controls stacking order of positioned elements. Stacking contexts are groups where z-index only compares elements within the same context.',
    
    detailedExplanation: 'z-index only works on positioned elements (position other than static). Higher z-index appears in front. Stacking contexts are created by: positioned elements with z-index, opacity < 1, transform, filter, and more. Elements are stacked in order within their context. A child can never appear behind its parent\'s context, no matter how negative its z-index.',
    
    example: {
      code: `/* Basic z-index */
.modal {
  position: fixed;
  z-index: 1000;
}

.overlay {
  position: fixed;
  z-index: 999;
}

/* Stacking context created */
.parent {
  position: relative;
  z-index: 1;
  opacity: 0.99; /* Creates stacking context */
}

.child {
  position: absolute;
  z-index: 9999; /* Only compared within parent context */
}

/* Common mistake */
.sibling {
  position: relative;
  z-index: 2; /* Appears above child, even with child's huge z-index */
}`,
      language: 'css'
    },
    
    interviewAnswer: 'z-index confusion usually comes from stacking contexts. I organize z-index values in my projects - like modals at 1000, dropdowns at 100, tooltips at 200. The key is understanding that a child element can never escape its parent\'s stacking context. If a modal isn\'t appearing above other content, I check if its parent has opacity, transform, or z-index creating a new context.',
    
    commonMistakes: [
      'Using huge z-index values unnecessarily (z-index: 999999)',
      'Not understanding stacking contexts',
      'Forgetting z-index needs positioned element',
      'Creating accidental stacking contexts with opacity/transform'
    ],
    
    realWorldUse: 'Modals, dropdowns, tooltips, and fixed headers all use z-index. Design systems define z-index scales. Debugging z-index issues requires understanding stacking contexts.',
    
    followUpQuestions: [
      'What creates a stacking context?',
      'Can z-index be negative?',
      'Why doesn\'t my z-index work sometimes?'
    ]
  },
  {
    id: 'css-variables',
    category: 'css',
    type: 'theory',
    question: 'What are CSS custom properties (CSS variables) and how do you use them?',
    difficulty: 'beginner',
    tags: ['css-variables', 'custom-properties', 'theming'],
    shortAnswer: 'CSS custom properties (--variable-name) store reusable values. They cascade and inherit like normal CSS properties. Updated with JavaScript. Perfect for theming, design tokens, and reducing duplication.',
    detailedExplanation: 'CSS variables are defined with -- prefix and accessed with var(). They cascade and inherit, making them dynamic (unlike SASS variables which are compile-time). They can be scoped to a selector and changed at runtime with JavaScript. This makes them ideal for theme switching. Fall-back values: var(--color, #default). They work with calc(). A CSS variable change immediately updates all elements using it.',
    example: {
      language: 'css',
      code: `/* Define CSS variables on :root (global) */
:root {
  --color-primary: #6366f1;
  --color-background: #ffffff;
  --color-text: #1a1a1a;
  --font-size-base: 16px;
  --spacing-unit: 8px;
  --border-radius: 8px;
  --shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* Use variables */
.button {
  background: var(--color-primary);
  padding: calc(var(--spacing-unit) * 1.5) calc(var(--spacing-unit) * 3);
  border-radius: var(--border-radius);
  font-size: var(--font-size-base);
}

/* With fallback value */
.card {
  background: var(--card-bg, var(--color-background));
  box-shadow: var(--shadow);
}

/* Scoped variables */
.dark-section {
  --color-text: #ffffff;
  --color-background: #1a1a1a;
  /* Children inherit these overrides */
}

/* Dark mode using CSS variables */
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #0f0f0f;
    --color-text: #f0f0f0;
    --color-primary: #818cf8;
  }
}

/* Theme switching with JavaScript */
// Light theme
document.documentElement.style.setProperty('--color-background', '#ffffff');
document.documentElement.style.setProperty('--color-text', '#1a1a1a');

// Dark theme
document.documentElement.style.setProperty('--color-background', '#0f0f0f');
document.documentElement.style.setProperty('--color-text', '#f0f0f0');

// Read CSS variable in JavaScript
const primaryColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--color-primary').trim();`
    },
    interviewAnswer: 'CSS variables changed how I approach theming. Instead of maintaining separate stylesheets for light and dark mode, I define semantic variable names and change their values in one place. The cascade means scoped overrides work naturally â€” a dark card component only needs to override a few variables. Unlike SASS variables, CSS variables are live â€” changing them with JavaScript instantly updates the entire UI.',
    commonMistakes: [
      'Forgetting the -- prefix',
      'Using CSS variables where SASS variables would be simpler',
      'Not providing fallback values for unsupported browsers',
      'Setting variables inline instead of on :root for global ones'
    ],
    realWorldUse: 'Design systems use CSS variables for design tokens. Dark mode theming. Component libraries expose variables for customization. Tailwind CSS uses CSS variables internally for colors.',
    followUpQuestions: [
      'What is the difference between CSS variables and SASS variables?',
      'Can CSS variables be animated?',
      'What is a CSS design token?'
    ]
  },
  {
    id: 'css-bem',
    category: 'css',
    type: 'theory',
    question: 'What is BEM CSS methodology?',
    difficulty: 'beginner',
    tags: ['bem', 'naming', 'methodology'],
    shortAnswer: 'BEM (Block Element Modifier) is a CSS naming convention: .block__element--modifier. Blocks are standalone components, elements are children, modifiers are variants. Eliminates specificity battles and makes relationships clear.',
    detailedExplanation: 'BEM solves CSS naming and specificity problems. Block: independent component (.card, .button). Element: child of a block, uses double underscore (.card__title, .card__image). Modifier: variant or state, uses double dash (.button--primary, .button--disabled, .card--featured). All classes are single level â€” no nesting needed, easy to override, globally unique names prevent conflicts. Used alongside design systems and component architecture.',
    example: {
      language: 'html',
      code: `<!-- BEM Structure -->

<!-- Block: standalone component -->
<div class="card card--featured">
  <!-- Element: child of block (double underscore) -->
  <img class="card__image" src="photo.jpg" alt="">
  <div class="card__body">
    <h2 class="card__title">Card Title</h2>
    <p class="card__description">Description text</p>
    <!-- Element can have a modifier too -->
    <button class="card__button card__button--primary">Read More</button>
  </div>
</div>

<!-- Another block: navigation -->
<nav class="nav nav--horizontal">
  <a class="nav__item nav__item--active" href="/">Home</a>
  <a class="nav__item" href="/about">About</a>
</nav>

/* BEM CSS */
/* Block */
.card {
  border: 1px solid var(--line);
  border-radius: 8px;
}

/* Block modifier */
.card--featured {
  border-color: var(--color-primary);
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

/* Element */
.card__image {
  width: 100%;
  border-radius: 8px 8px 0 0;
}

/* Element modifier */
.card__button--primary {
  background: var(--color-primary);
  color: white;
}

/* âœ… BEM benefits: no nesting, low specificity */
/* âŒ Without BEM: specificity wars */
.sidebar .card .button.active { } /* High specificity â€” hard to override */
/* âœ… With BEM: */
.card__button--primary { }  /* Single class â€” easy to override */`
    },
    interviewAnswer: 'BEM gives every class a globally unique name by encoding the component relationship into the name itself. .card__title is always the title inside a .card â€” no matter where it appears in HTML. The double underscore and dash separators make the relationship obvious at a glance. The big win is low specificity â€” all classes are single-level, so overriding is straightforward. This scales much better than deeply nested CSS.',
    commonMistakes: [
      'Triple nesting like block__element__element (only one level of elements)',
      'Using BEM for global styles like typography or layout utilities',
      'Creating elements that don\'t need their own class',
      'Confusing modifiers with states (use data attributes for JS states)'
    ],
    realWorldUse: 'Large CSS codebases, component libraries, anywhere teams need consistent naming. Tailwind CSS reduces the need for BEM but BEM is still valuable for understanding component structure.',
    followUpQuestions: [
      'What are the alternatives to BEM?',
      'How do you handle deeply nested components in BEM?',
      'How does BEM relate to CSS Modules?'
    ]
  },
  {
    id: 'css-container-queries',
    category: 'css',
    type: 'theory',
    question: 'What are CSS Container Queries and how are they different from media queries?',
    difficulty: 'intermediate',
    tags: ['container-queries', 'responsive', 'modern-css'],
    shortAnswer: 'Container queries let components respond to their container\'s size, not the viewport size. Media queries respond to viewport width â€” container queries respond to parent element width. Better for reusable components.',
    detailedExplanation: 'Media queries have a fundamental problem for components: a sidebar card and a main content card have the same styles even though they\'re in very different size containers. Container queries solve this by letting components style themselves based on their container. Define a containment context with container-type, then use @container to query the container size. Supported in all modern browsers since 2023.',
    example: {
      language: 'css',
      code: `/* Define a containment context */
.card-wrapper {
  container-type: inline-size;  /* Enable container queries */
  container-name: card-container;  /* Optional name */
}

/* Container query - responds to container width, not viewport */
@container (min-width: 400px) {
  .card {
    display: flex;  /* Switch to horizontal layout when container is wide enough */
    gap: 1rem;
  }
  
  .card__image {
    width: 200px;
    flex-shrink: 0;
  }
}

@container (min-width: 600px) {
  .card__title {
    font-size: 1.5rem;
  }
}

/* Same card in different contexts - auto-adapts! */
/* In a narrow sidebar - card shows vertical layout */
/* In a wide main content area - card shows horizontal layout */
/* Both use the SAME card CSS */

/* Example: card used in multiple contexts */
/* 
<aside class="sidebar">
  <div class="card-wrapper">
    <div class="card">...</div>
  </div>
</aside>

<main class="content">
  <div class="card-wrapper">
    <div class="card">...</div>
  </div>
</main>
*/

/* Media query limitation (old way) */
/* You'd need to know where the card would be used */
@media (min-width: 768px) {
  .sidebar .card { } /* Tightly coupled to location */
}

/* Container units: cqw, cqh, cqi, cqb */
.card__title {
  font-size: clamp(1rem, 3cqi, 2rem);  /* 3% of container inline size */
}`
    },
    interviewAnswer: 'Container queries solve the problem that media queries can\'t: how does a component know how much space it has without knowing where it\'s placed? With media queries, I had to write location-specific overrides like .sidebar .card. Container queries make components truly self-contained â€” the card adapts based on its container, not the viewport. This is the future of responsive component design.',
    commonMistakes: [
      'Forgetting to set container-type on the parent',
      'Using container queries where media queries are simpler',
      'Not checking browser support (good since 2023)',
      'Nesting containers unnecessarily'
    ],
    realWorldUse: 'Reusable card components used in grids and sidebars, dashboard widgets that adapt to different panel sizes, design system components that need to work anywhere.',
    followUpQuestions: [
      'What browsers support container queries?',
      'What are container query units (cqw, cqh)?',
      'Can you nest container queries?'
    ]
  },
  {
    id: 'css-has-selector',
    category: 'css',
    type: 'theory',
    question: 'What is the CSS :has() selector and what problems does it solve?',
    difficulty: 'intermediate',
    tags: ['css', 'selectors', 'modern-css'],
    shortAnswer: ':has() is the "parent selector" CSS lacked for decades. It matches an element if any of its descendants match the argument: li:has(img) selects list items that contain an image.',
    detailedExplanation: ':has() evaluates relative selectors from the element being tested. It enables styling a parent based on its children, adjacent elements based on a sibling, or form fields based on their state — patterns that previously required JavaScript. Supported in all modern browsers since late 2023.',
    example: {
      code: `/* Style a card that contains a .badge */
.card:has(.badge) { border: 2px solid gold; }

/* Style a label when its sibling input is checked */
.label:has(+ input:checked) { font-weight: bold; }

/* Style a form when it has an invalid field */
form:has(:invalid) { background: #fee; }

/* Style a figure only when it contains a figcaption */
figure:has(figcaption) { padding-bottom: 1rem; }`,
      language: 'css'
    },
    interviewAnswer: 'Call it the "parent selector" and give a concrete example like styling a card based on a child badge. Mention it replaced a class of JS hacks.',
    commonMistakes: ['Confusing it with :is() (which doesn\'t select ancestors)', 'Forgetting it has broad support now — no longer a "future CSS" item'],
    realWorldUse: 'Dark-mode toggles based on a checkbox, form validation styling, conditional card layouts.',
    followUpQuestions: ['What is the difference between :has(), :is(), and :where()?', 'Can :has() be nested?']
  },

  {
    id: 'css-logical-properties',
    category: 'css',
    type: 'theory',
    question: 'What are CSS logical properties and why are they important for internationalization?',
    difficulty: 'intermediate',
    tags: ['css', 'i18n', 'logical-properties', 'rtl'],
    shortAnswer: 'Logical properties use writing-mode-relative terms (inline-start, block-end) instead of physical directions (left, right, top, bottom). This makes layouts automatically correct for RTL languages and vertical writing modes.',
    detailedExplanation: 'Physical: margin-left, padding-top, border-right. Logical equivalents: margin-inline-start, padding-block-start, border-inline-end. In LTR: inline-start = left. In RTL: inline-start = right — with no extra CSS needed.',
    example: {
      code: `/* Physical — breaks in RTL */
.card { margin-left: 1rem; padding-right: 1.5rem; }

/* Logical — works in LTR and RTL automatically */
.card {
  margin-inline-start: 1rem;
  padding-inline-end: 1.5rem;
  border-block-start: 1px solid #ccc; /* top in horizontal writing */
}

/* Shorthand */
.box { margin-inline: auto; padding-block: 1rem; }`,
      language: 'css'
    },
    interviewAnswer: 'Demonstrate with a margin-left → margin-inline-start example and explain the RTL behavior change.',
    commonMistakes: ['Mixing physical and logical properties inconsistently', 'Not knowing the shorthand forms (margin-inline, padding-block)'],
    realWorldUse: 'Any app supporting Arabic, Hebrew, Persian (RTL languages), or East-Asian vertical text.',
    followUpQuestions: ['What is the writing-mode property?', 'How do logical properties work with CSS Grid?']
  },

  {
    id: 'html-shadow-dom',
    category: 'html',
    type: 'theory',
    question: 'What is Shadow DOM and how does it enable style encapsulation?',
    difficulty: 'advanced',
    tags: ['web-components', 'shadow-dom', 'encapsulation'],
    shortAnswer: 'Shadow DOM attaches a hidden, encapsulated DOM tree to an element. Styles inside the shadow root don\'t leak out, and page styles don\'t leak in — enabling true component encapsulation without CSS-in-JS.',
    detailedExplanation: 'Shadow DOM is a core Web Components spec. The shadow root is a separate document fragment. :host selects the host element from inside, ::part() and CSS custom properties are the approved "escape hatches" to style shadow content from outside.',
    example: {
      code: `// Creating a shadow root
class MyCard extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = \`
      <style>
        p { color: blue; } /* only affects this shadow */
      </style>
      <p>Shadow content</p>
    \`;
  }
}
customElements.define('my-card', MyCard);

// Page CSS cannot touch <p> inside shadow — encapsulated
// But custom properties CAN cross the boundary:
// :root { --card-color: red; }
// Inside shadow: p { color: var(--card-color); }`,
      language: 'javascript'
    },
    interviewAnswer: 'Explain open vs closed mode, style encapsulation, and the CSS custom properties escape hatch.',
    commonMistakes: ['Thinking "open" mode means styles can leak in — mode refers to JS access, not CSS', 'Not knowing ::part() for external styling'],
    realWorldUse: 'Native browser UI (input, video controls), design system components, micro-frontends.',
    followUpQuestions: ['What is the difference between open and closed shadow DOM?', 'How do you style shadow DOM from the outside?']
  },

  {
    id: 'css-clamp',
    category: 'css',
    type: 'theory',
    question: 'How does CSS clamp() work and how do you use it for fluid typography?',
    difficulty: 'intermediate',
    tags: ['css', 'responsive', 'typography', 'modern-css'],
    shortAnswer: 'clamp(min, preferred, max) constrains a value between a minimum and maximum. For fluid typography: clamp(1rem, 2.5vw, 2rem) scales font-size with the viewport while respecting both bounds.',
    detailedExplanation: 'Previously fluid typography needed media query breakpoints. clamp() makes it a single declaration. The preferred value is usually a viewport-relative unit (vw, cqi). min() and max() are the simpler single-bound variants. All three work anywhere a length, size, or number is accepted.',
    example: {
      code: `/* Fluid font: 1rem minimum, scales with viewport, 2.5rem maximum */
h1 { font-size: clamp(1.5rem, 4vw + 1rem, 3rem); }

/* Fluid spacing */
section { padding: clamp(1rem, 5vw, 4rem); }

/* Fluid card width */
.card { width: clamp(280px, 50%, 600px); }

/* Prevent touch targets from being too small */
button { height: clamp(44px, 10vw, 56px); }`,
      language: 'css'
    },
    interviewAnswer: 'Explain the three parameters clearly, then show the fluid typography use-case. Mention it replaces multiple breakpoints with one declaration.',
    commonMistakes: ['Getting min/max order wrong (min first, max last)', 'Using clamp for values where the preferred never exceeds the bounds (pointless)'],
    realWorldUse: 'Responsive typography systems, fluid spacing scales, adaptive card sizing.',
    followUpQuestions: ['What is the difference between clamp(), min(), and max()?', 'How do you calculate the preferred value for perfect linear scaling?']
  },

  {
    id: 'html-picture-element',
    category: 'html',
    type: 'theory',
    question: 'What is the <picture> element and how does it differ from srcset on <img>?',
    difficulty: 'intermediate',
    tags: ['html', 'images', 'responsive', 'performance'],
    shortAnswer: '<picture> allows art direction — serving completely different images at different breakpoints. srcset on <img> only provides resolution/density variants of the same image and lets the browser choose.',
    detailedExplanation: '<picture> contains <source> elements with media queries and a fallback <img>. The browser picks the first matching source. This is art direction: a wide landscape shot on desktop, a cropped portrait on mobile. srcset is the right choice when you just want the same image at different sizes for pixel density.',
    example: {
      code: `<!-- Art direction: different crop per breakpoint -->
<picture>
  <source media="(min-width: 800px)" srcset="hero-wide.webp" type="image/webp">
  <source media="(min-width: 800px)" srcset="hero-wide.jpg">
  <source srcset="hero-portrait.webp" type="image/webp">
  <img src="hero-portrait.jpg" alt="Hero image" loading="lazy">
</picture>

<!-- Density variants only — use srcset on img -->
<img
  src="logo.png"
  srcset="logo@2x.png 2x, logo@3x.png 3x"
  alt="Logo"
>`,
      language: 'html'
    },
    interviewAnswer: 'The key distinction: art direction (different content) = <picture>; resolution switching (same content, different size) = srcset on <img>.',
    commonMistakes: ['Using <picture> when srcset is enough (unnecessary complexity)', 'Forgetting the fallback <img> inside <picture>'],
    realWorldUse: 'Hero images, marketing banners where tight crop matters on mobile, next-gen format (WebP/AVIF) with fallback.',
    followUpQuestions: ['What is the sizes attribute on <img>?', 'When would you use AVIF vs WebP?']
  },

  {
    id: 'css-stacking-context',
    category: 'css',
    type: 'theory',
    question: 'What creates a new stacking context in CSS and how does it affect z-index?',
    difficulty: 'advanced',
    tags: ['css', 'z-index', 'stacking-context', 'positioning'],
    shortAnswer: 'A stacking context is an independent layer. Elements inside it are stacked relative to each other; the context as a whole is stacked as one unit in the parent context. z-index only works within the same stacking context.',
    detailedExplanation: 'New stacking contexts are created by: position + z-index (not auto), opacity < 1, transform, filter, will-change, isolation: isolate, and more. A z-index: 9999 inside a stacking context with z-index: 1 will never appear above a sibling stacking context with z-index: 2 — no matter how high its number is.',
    example: {
      code: `/* z-index:9999 still lost — it's inside a stacking context with z-index:1 */
.parent-a { position: relative; z-index: 1; }
.child-a  { position: relative; z-index: 9999; } /* loses */

.parent-b { position: relative; z-index: 2; }
.child-b  { position: relative; z-index: 1;  } /* wins */

/* isolation: isolate — cleanest way to create a context without z-index */
.modal-wrapper { isolation: isolate; }

/* Will-change creates a context (side effect to know) */
.animated { will-change: transform; }`,
      language: 'css'
    },
    interviewAnswer: 'This is the most common CSS z-index debugging problem. Explain that z-index is always relative to its stacking context, not the entire page.',
    commonMistakes: ['Increasing z-index infinitely without realising the parent context is the problem', 'Not knowing that opacity < 1 creates a new context'],
    realWorldUse: 'Modal/overlay layering, sticky headers, dropdown menus over transformed elements.',
    followUpQuestions: ['What does isolation: isolate do?', 'How do you debug stacking context issues?']
  },

  {
    id: 'html-intersection-observer-lazy',
    category: 'html',
    type: 'theory',
    question: 'How does the native HTML loading="lazy" attribute work, and when should you NOT use it?',
    difficulty: 'intermediate',
    tags: ['html', 'performance', 'lazy-loading', 'images'],
    shortAnswer: 'loading="lazy" on <img> and <iframe> defers loading until the element is near the viewport. The browser decides the threshold. Do NOT use it on above-the-fold images — it delays the Largest Contentful Paint (LCP) metric.',
    detailedExplanation: 'The browser uses an intersection-like heuristic (typically ~1200px below viewport on Chrome) to start loading. It is a hint, not a guarantee. For LCP images (hero, above fold), use loading="eager" or omit the attribute. Use fetchpriority="high" on your LCP image to boost it.',
    example: {
      code: `<!-- LCP hero image — NO lazy loading -->
<img src="hero.jpg" alt="Hero" fetchpriority="high" width="1200" height="600">

<!-- Below-fold images — lazy is perfect -->
<img src="product.jpg" alt="Product" loading="lazy" width="400" height="300">

<!-- Lazy iframe (YouTube embeds etc.) -->
<iframe src="https://youtube.com/embed/..." loading="lazy"></iframe>

<!-- Always set width/height to prevent layout shift (CLS) -->`,
      language: 'html'
    },
    interviewAnswer: 'The anti-pattern (lazy on hero image) is the most important point. Connect it to LCP impact — this is what interviewers test.',
    commonMistakes: ['Applying loading="lazy" to the hero/banner image', 'Not setting explicit width/height, causing CLS'],
    realWorldUse: 'Product image galleries, blog article images, third-party embeds.',
    followUpQuestions: ['What is fetchpriority?', 'How does Intersection Observer differ from loading="lazy"?']
  },

  {
    id: 'css-cascade-layers',
    category: 'css',
    type: 'theory',
    question: 'What are CSS Cascade Layers (@layer) and how do they solve specificity wars?',
    difficulty: 'advanced',
    tags: ['css', 'cascade', 'specificity', 'modern-css'],
    shortAnswer: '@layer lets you define named layers with explicit cascade priority. Unlayered styles always win over layered ones. Styles in a higher-priority layer override lower ones regardless of specificity, ending specificity hacks.',
    detailedExplanation: 'Historically, overriding third-party CSS required higher specificity or !important. With @layer you declare layer order at the top: @layer reset, base, components, utilities — reset is lowest priority, utilities highest. Anything in utilities beats components, regardless of selector specificity.',
    example: {
      code: `/* Declare layer order — first = lowest priority */
@layer reset, base, components, utilities;

@layer reset {
  * { margin: 0; padding: 0; box-sizing: border-box; }
}

@layer base {
  a { color: blue; }
}

@layer utilities {
  .text-red { color: red; } /* wins over base a { color } */
}

/* Third-party library in a low-priority layer */
@import url('bootstrap.css') layer(vendor);`,
      language: 'css'
    },
    interviewAnswer: 'Position it as "the solution to !important and specificity wars". The key rule: layer order beats specificity, unlayered beats all layers.',
    commonMistakes: ['Forgetting that unlayered styles beat all layers', 'Declaring layers in the wrong order'],
    realWorldUse: 'Design systems, integrating third-party CSS (Bootstrap, Tailwind) without specificity conflicts.',
    followUpQuestions: ['How do you import a third-party stylesheet into a layer?', 'What is the difference between @layer and @scope?']
  },

  {
    id: 'html-form-validation',
    category: 'html',
    type: 'theory',
    question: 'What built-in HTML5 form validation attributes are available and when would you still use JavaScript validation?',
    difficulty: 'beginner',
    tags: ['html', 'forms', 'validation', 'accessibility'],
    shortAnswer: 'HTML5 provides: required, min/max, minlength/maxlength, pattern (regex), type (email, url, number). Use JS validation for: cross-field rules, async validation (unique username), custom error messages, or when you need to intercept the submit event.',
    detailedExplanation: 'Native validation runs on form submit and shows browser-native tooltips. The Constraint Validation API (validity, setCustomValidity, reportValidity) lets you drive validation programmatically. novalidate on the form disables native validation so you can handle everything in JS while still using the API.',
    example: {
      code: `<!-- Native HTML5 validation -->
<form>
  <input type="email" required placeholder="Email">
  <input type="password" minlength="8" required>
  <input type="text" pattern="[A-Z]{3}[0-9]{4}" title="Format: ABC1234">
  <input type="number" min="18" max="120">
  <button type="submit">Submit</button>
</form>

<!-- Custom validation message via JS -->
const input = document.querySelector('#username');
input.addEventListener('input', () => {
  if (input.value.includes(' ')) {
    input.setCustomValidity('No spaces allowed');
  } else {
    input.setCustomValidity(''); // clear error
  }
});`,
      language: 'html'
    },
    interviewAnswer: 'List the native attributes, then explain the 3 cases where JS is still needed: cross-field validation, async checks, and custom styled error UIs.',
    commonMistakes: ['Relying only on client-side validation — always validate server-side too', 'Not using setCustomValidity("") to clear custom errors'],
    realWorldUse: 'Registration forms, checkout flows, any form where real-time feedback improves UX.',
    followUpQuestions: ['What is the novalidate attribute for?', 'How do you style invalid fields with CSS?']
  },

  {
    id: 'css-subgrid',
    category: 'css',
    type: 'theory',
    question: 'What is CSS Subgrid and what problem does it solve?',
    difficulty: 'advanced',
    tags: ['css', 'grid', 'subgrid', 'layout'],
    shortAnswer: 'Subgrid lets a grid item participate in its parent grid\'s track sizing (rows or columns). Without it, nested grids create independent track sizes — making it impossible to align content across cards at different nesting levels.',
    detailedExplanation: 'The classic problem: a row of cards each containing header, body, footer. You want all headers on the same row, all footers aligned, but each card is its own grid. With grid-template-rows: subgrid the card\'s rows are defined by the parent — alignment becomes automatic. Supported in all modern browsers since 2023.',
    example: {
      code: `/* Parent grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr auto; /* header, body, footer */
  gap: 1rem;
}

/* Card spans 3 parent rows and subgrids them */
.card {
  display: grid;
  grid-row: span 3;
  grid-template-rows: subgrid; /* inherits parent row track sizes */
}

/* Now .card-header, .card-body, .card-footer
   all align perfectly across all cards */`,
      language: 'css'
    },
    interviewAnswer: 'The card-alignment problem is the canonical example. Mention it replaces display:contents hacks and was the most-requested CSS feature for years.',
    commonMistakes: ['Using subgrid without the parent having defined tracks in that axis', 'Confusing subgrid (inherits parent tracks) with nested grid (independent tracks)'],
    realWorldUse: 'Card components with varying content height that must align across a row.',
    followUpQuestions: ['Can you subgrid only one axis?', 'How does subgrid compare to the align-items: stretch approach?']
  },

  {
    id: 'css-nesting',
    category: 'css',
    type: 'theory',
    question: 'What is native CSS nesting and how does it differ from Sass nesting?',
    difficulty: 'intermediate',
    tags: ['css-nesting', 'modern-css', 'sass'],
    shortAnswer: 'Native CSS nesting (CSS Nesting Module Level 1) lets you nest rules inside other rules using & to reference the parent. Supported in all modern browsers since 2023. Similar to Sass but built into the browser — no preprocessor needed.',
    detailedExplanation: 'CSS nesting reduces repetition by grouping related rules. The & selector refers to the parent selector — required before combinators in native CSS (unlike Sass where it\'s optional). You can nest pseudo-classes, pseudo-elements, media queries, and child selectors. @layer and @scope also support nested rules. The spec closely mirrors Sass nesting syntax to ease migration.',
    example: {
      code: `/* Without nesting — repetitive */
.card { padding: 1rem; border-radius: 8px; }
.card:hover { transform: translateY(-2px); }
.card .card__title { font-size: 1.25rem; font-weight: bold; }
.card .card__body { color: #666; }
.card.card--featured { border: 2px solid gold; }

/* With native CSS nesting */
.card {
  padding: 1rem;
  border-radius: 8px;

  /* & = .card */
  &:hover {
    transform: translateY(-2px);
  }

  /* Descendant */
  .card__title {
    font-size: 1.25rem;
    font-weight: bold;
  }

  /* Direct child using & */
  & > .card__body {
    color: #666;
  }

  /* Modifier class */
  &.card--featured {
    border: 2px solid gold;
  }

  /* Media query inside rule */
  @media (max-width: 768px) {
    padding: 0.5rem;
    .card__title { font-size: 1rem; }
  }
}

/* & can appear anywhere */
.button {
  background: blue;

  /* Parent is a dark container */
  .dark-theme & {
    background: navy;
  }

  /* Multiple parents */
  .danger &, .warning & {
    background: red;
  }
}

/* Sass difference — & not required before element selectors */
/* Sass: .card { .title {} }  compiles to .card .title */
/* Native CSS: .card { .title {} } — same result, both work */
/* But native CSS needs & before combinators: .card { & > .title {} } */`,
      language: 'css',
    },
    interviewAnswer: 'Native CSS nesting eliminates most of the reason to use Sass for large projects. I can co-locate hover states, responsive overrides, and child element styles with their parent rule. The main difference from Sass: in native CSS you need & before combinators like > and ~, while Sass is more lenient. Browser support is now excellent — all modern browsers since late 2023.',
    commonMistakes: [
      'Forgetting & before > child combinator (native CSS requires it)',
      'Deeply nesting 5+ levels (creates specificity issues, hard to read)',
      'Not knowing it\'s now supported natively without Sass',
    ],
    realWorldUse: 'Component-based CSS, BEM with nesting, any modern stylesheet without a preprocessor.',
    followUpQuestions: ['Does CSS nesting affect specificity?', 'How does @scope work with nesting?'],
  },

  {
    id: 'css-scroll-snap',
    category: 'css',
    type: 'theory',
    question: 'What is CSS Scroll Snap and how do you implement smooth snapping carousels?',
    difficulty: 'intermediate',
    tags: ['scroll-snap', 'carousel', 'ux', 'modern-css'],
    shortAnswer: 'CSS Scroll Snap creates scroll containers where scrolling snaps to defined points. scroll-snap-type on the container, scroll-snap-align on items. Creates carousels, full-page scroll, and image galleries without JavaScript.',
    detailedExplanation: 'scroll-snap-type: x mandatory makes horizontal scroll snap to items. scroll-snap-align: start|center|end defines where each item snaps. scroll-snap-stop: always forces stopping at every item (not skipping on fast scroll). overflow-x: scroll makes it scrollable. Works with CSS only — no JavaScript carousel library needed for basic carousels.',
    example: {
      code: `/* Horizontal carousel */
.carousel {
  display: flex;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;  /* Snap on x-axis, must snap */
  scroll-behavior: smooth;
  gap: 1rem;
  padding: 1rem;

  /* Hide scrollbar visually (keep functional) */
  scrollbar-width: none;          /* Firefox */
  &::-webkit-scrollbar { display: none; } /* Chrome */
}

.carousel__item {
  flex: 0 0 300px;               /* Fixed width, don't shrink */
  scroll-snap-align: start;       /* Snap to start of item */
  scroll-snap-stop: always;       /* Don't skip items on fast swipe */
  border-radius: 12px;
  overflow: hidden;
}

/* Full-page vertical scroll snap */
.page-container {
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
}

.page-section {
  height: 100vh;
  scroll-snap-align: start;
}

/* Centered snap (like Instagram stories) */
.stories {
  display: flex;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
}

.story {
  flex: 0 0 100%;                 /* Full width each */
  scroll-snap-align: center;      /* Snap to center */
}

/* Proximity — only snaps when close (more natural feel) */
.loose-snap {
  scroll-snap-type: x proximity;  /* vs mandatory (always snaps) */
}

/* With scroll-padding for fixed headers */
.carousel {
  scroll-padding-left: 1rem;     /* Offset first snap position */
}`,
      language: 'css',
    },
    interviewAnswer: 'Scroll Snap replaces simple JavaScript carousel libraries for most use cases. The mandatory vs proximity distinction matters — mandatory always snaps which can feel jarring for partial scrolling, proximity only snaps when you\'re close. I use scroll-snap-stop: always for image galleries where users might swipe fast and accidentally skip items. For complex carousels with navigation arrows and indicators, JavaScript is still needed.',
    commonMistakes: [
      'Forgetting overflow: scroll on the container',
      'Not setting flex: 0 0 on items (they shrink and misalign)',
      'Using mandatory when proximity would feel more natural',
    ],
    realWorldUse: 'Image carousels, full-page scrolling landing pages, mobile-first product galleries.',
    followUpQuestions: ['What is the difference between mandatory and proximity snap types?', 'How do you add navigation buttons to a CSS-only carousel?'],
  },

  {
    id: 'css-web-fonts',
    category: 'css',
    type: 'theory',
    question: 'How do you optimise web font loading for performance?',
    difficulty: 'intermediate',
    tags: ['fonts', 'performance', 'font-display', 'FOUT'],
    shortAnswer: 'Use font-display: swap to avoid invisible text during load. Preload critical fonts with <link rel="preload">. Use variable fonts to reduce file count. Subset fonts to only include used characters. Host fonts locally to avoid third-party DNS.',
    detailedExplanation: 'Web font loading issues: FOIT (Flash of Invisible Text) — text hidden until font loads, FOUT (Flash of Unstyled Text) — text shows in fallback then swaps. font-display controls this: swap shows fallback immediately then swaps, optional loads font only if already cached (best CLS). font-face size-adjust and metrics override minimise layout shift during swap. Variable fonts consolidate multiple weights into one file.',
    example: {
      code: `/* Self-hosted fonts — best performance (no third-party DNS) */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-var.woff2') format('woff2');
  font-weight: 100 900;       /* Variable font range */
  font-style: normal;
  font-display: swap;         /* Show fallback text immediately */
}

/* font-display values:
   auto    — browser default (usually block)
   block   — invisible text for up to 3s, then swap
   swap    — show fallback immediately, swap when loaded
   fallback — 100ms block, swap if loads within 3s, else keep fallback
   optional — 100ms block, browser decides (best for CLS) */

/* Minimise layout shift on font swap */
@font-face {
  font-family: 'Custom';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap;
  /* Adjust metrics to match the fallback font */
  size-adjust: 105%;
  ascent-override: 90%;
  descent-override: 25%;
  line-gap-override: 0%;
}

/* Fallback stack that matches the custom font dimensions */
body {
  font-family: 'Custom', system-ui, -apple-system, sans-serif;
}

/* In HTML — preload critical fonts (above-fold text) */
/* <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin> */

/* Subsetting — only load needed characters */
/* Tools: glyphhanger, pyftsubset, Fonttools */
/* For Latin only: unicode-range: U+0000-00FF; */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153;
}

/* Variable font — one file for all weights */
/* vs 6 separate files for 100-900 weights */
.heading { font-weight: 700; }   /* All served from one file */
.body { font-weight: 400; }
.light { font-weight: 300; }`,
      language: 'css',
    },
    interviewAnswer: 'Font loading is one of the biggest LCP and CLS factors. I always preload the hero/heading font and use font-display: swap so users see text immediately. For LCP, the hero image and heading font compete — preloading the font ensures it loads fast. font-display: optional is the most CLS-friendly but fonts may not load on slow connections. Variable fonts are great for design systems — one file for all weights cuts HTTP requests significantly.',
    commonMistakes: [
      'Using Google Fonts without self-hosting (extra DNS lookup, CORS)',
      'Not preloading critical fonts (delays LCP)',
      'Loading all font weights when only 2-3 are used',
    ],
    realWorldUse: 'Every website with custom fonts. Next.js font optimisation automatically handles preloading and self-hosting.',
    followUpQuestions: ['What is FOUT and FOIT?', 'How does Next.js font optimisation work?'],
  },

  {
    id: 'html-template-element',
    category: 'html',
    type: 'theory',
    question: 'What is the HTML <template> element and when do you use it?',
    difficulty: 'intermediate',
    tags: ['template', 'web-components', 'dom', 'html5'],
    shortAnswer: '<template> holds inert HTML that is not rendered but can be cloned and inserted into the DOM via JavaScript. Used in Web Components and for client-side templating without libraries.',
    detailedExplanation: 'The <template> element is a mechanism for holding HTML that is not rendered when the page loads. Its content is in a separate DocumentFragment. Scripts don\'t run, images don\'t load. Use .content.cloneNode(true) to get a deep copy, then append to the DOM. Essential for Web Components (custom elements use templates for shadow DOM). Also useful for creating repeated DOM structures efficiently.',
    example: {
      code: `<!-- Template definition — not rendered -->
<template id="card-template">
  <div class="card">
    <img class="card__image" alt="">
    <div class="card__body">
      <h3 class="card__title"></h3>
      <p class="card__description"></p>
      <button class="card__button">Read More</button>
    </div>
  </div>
</template>

<div id="cards-container"></div>

<script>
  const template = document.getElementById('card-template');
  const container = document.getElementById('cards-container');

  const products = [
    { title: 'Product A', description: 'Great product', image: '/a.jpg' },
    { title: 'Product B', description: 'Better product', image: '/b.jpg' },
  ];

  products.forEach(product => {
    // Clone the template (deep clone of DocumentFragment)
    const clone = template.content.cloneNode(true);

    // Populate
    clone.querySelector('.card__image').src = product.image;
    clone.querySelector('.card__image').alt = product.title;
    clone.querySelector('.card__title').textContent = product.title;
    clone.querySelector('.card__description').textContent = product.description;
    clone.querySelector('.card__button').addEventListener('click', () => {
      console.log('Clicked:', product.title);
    });

    container.appendChild(clone);
  });
</script>

<!-- Web Components use case -->
<script>
  class UserCard extends HTMLElement {
    connectedCallback() {
      const template = document.getElementById('user-card-template');
      const shadow = this.attachShadow({ mode: 'open' });
      shadow.appendChild(template.content.cloneNode(true));

      // Fill in data from attributes
      shadow.querySelector('.name').textContent = this.getAttribute('name');
    }
  }
  customElements.define('user-card', UserCard);
</script>

<!-- Usage -->
<user-card name="Alex" role="Developer"></user-card>`,
      language: 'html',
    },
    interviewAnswer: 'The template element is the browser\'s built-in HTML cloning mechanism. Before it existed, developers created DOM structures by writing JavaScript or using innerHTML with strings. Template gives you real HTML with proper parsing but no rendering until you clone and insert. It\'s essential for Web Components — you define the shadow DOM structure in a template and clone it when the component connects.',
    commonMistakes: [
      'Trying to query elements inside template directly (they\'re in a DocumentFragment, not the main DOM)',
      'Forgetting cloneNode(true) — without true, you get a shallow clone',
      'Using template when innerHTML would be simpler for one-time use',
    ],
    realWorldUse: 'Web Components, client-side templating, repeated UI structures like table rows, notification popups.',
    followUpQuestions: ['What is the difference between template and innerHTML?', 'How does template work with Shadow DOM?'],
  },

  {
    id: 'css-print-styles',
    category: 'css',
    type: 'theory',
    question: 'How do you write CSS for print media?',
    difficulty: 'beginner',
    tags: ['print', 'media-queries', 'css'],
    shortAnswer: 'Use @media print { } to apply print-specific styles. Hide navigation, sidebars, and interactive elements. Ensure good contrast, appropriate font sizes, page breaks. Use cm/mm/pt units for print.',
    detailedExplanation: 'Print CSS differs from screen CSS: hide navigation, ads, forms, videos. Ensure text is black on white for ink efficiency. Control page breaks with break-before/break-after/break-inside. Add URL text for links. Use page-specific units (cm, mm, pt). @page rule sets margins, size, orientation. Specify print stylesheet as <link media="print"> to avoid blocking render.',
    example: {
      code: `/* Method 1: separate print stylesheet */
/* <link rel="stylesheet" href="print.css" media="print"> */

/* Method 2: media query in main stylesheet */
@media print {
  /* Hide non-essential elements */
  nav,
  header nav,
  .sidebar,
  .advertisement,
  .social-share,
  .comments,
  button,
  video,
  audio,
  .no-print {
    display: none !important;
  }

  /* Reset colours for ink efficiency */
  body {
    font: 12pt Georgia, serif;
    color: black;
    background: white;
  }

  /* Show URLs for links */
  a[href]:after {
    content: ' (' attr(href) ')';
    font-size: 10pt;
    color: #555;
  }

  /* But not for internal links or JS links */
  a[href^='#']:after,
  a[href^='javascript']:after {
    content: '';
  }

  /* Page breaks */
  h1, h2, h3 {
    break-after: avoid;    /* Don't break after headings */
  }

  img, figure, table {
    break-inside: avoid;   /* Don't break across pages */
  }

  .page-break {
    break-before: page;    /* Force new page */
  }

  /* Remove box shadows and border-radius for print */
  * {
    box-shadow: none !important;
    text-shadow: none !important;
  }
}

/* @page rule — page setup */
@page {
  margin: 2cm;
  size: A4 portrait;

  /* Page numbers in margin */
  @bottom-right {
    content: 'Page ' counter(page) ' of ' counter(pages);
  }
}

@page :first {
  margin-top: 3cm; /* Extra margin on first page */
}`,
      language: 'css',
    },
    interviewAnswer: 'Print styles are often forgotten until a customer complains their invoice prints with the nav and sidebar. I add a no-print utility class and apply it to interactive elements. The link URL trick is valuable for documents that users might print — they lose the hyperlink but get the URL. Page break control is important for reports — prevent headings from appearing at the bottom of a page with no content below.',
    commonMistakes: [
      'Not hiding navigation and sidebars in print',
      'Print stylesheet blocking render (use media="print" on the link tag)',
      'Black text on coloured backgrounds wasting ink',
    ],
    realWorldUse: 'Invoices, receipts, articles, reports, any content users might print.',
    followUpQuestions: ['How do you add page numbers to printed pages?', 'What are the @page pseudo-class selectors?'],
  },

  {
    id: 'css-counters',
    category: 'css',
    type: 'theory',
    question: 'What are CSS counters and how do you use them?',
    difficulty: 'intermediate',
    tags: ['css-counters', 'pseudo-elements', 'content'],
    shortAnswer: 'CSS counters are variables maintained by CSS that increment at specified elements. Use counter-reset to create, counter-increment to increment, and counter() or counters() in content to display. Used for numbered headings, custom list numbering, and multi-level outlines.',
    detailedExplanation: 'CSS counters enable automatic numbering without JavaScript or manual HTML markup. counter-reset creates a named counter (on a parent). counter-increment increases it (on each item). counter() in a ::before pseudo-element displays the value. counters() (plural) handles nested counters for multi-level numbering like "1.2.3". Useful for document outlines, legal numbering, numbered figure captions.',
    example: {
      code: `/* Numbered headings: 1. Title, 2. Title */
body {
  counter-reset: heading-counter;
}

h2 {
  counter-increment: heading-counter;
  
  &::before {
    content: counter(heading-counter) '. ';
    font-weight: bold;
    color: var(--color-primary);
  }
}

/* Multi-level: 1. Title, 1.1 Sub, 1.1.1 Sub-sub */
article {
  counter-reset: section;
}

h2 {
  counter-reset: subsection;
  counter-increment: section;
  
  &::before {
    content: counter(section) '. ';
  }
}

h3 {
  counter-reset: subsubsection;
  counter-increment: subsection;
  
  &::before {
    content: counter(section) '.' counter(subsection) ' ';
  }
}

h4 {
  counter-increment: subsubsection;
  
  &::before {
    /* counters() for automatic nesting */
    content: counters(subsubsection, '.') ' ';
  }
}

/* Custom ordered list */
.custom-list {
  counter-reset: list-counter;
  list-style: none;
  padding: 0;
}

.custom-list li {
  counter-increment: list-counter;
  padding-left: 2.5rem;
  position: relative;
  
  &::before {
    content: counter(list-counter, decimal-leading-zero);
    /* Other styles: upper-roman, lower-alpha, etc. */
    position: absolute;
    left: 0;
    color: var(--color-primary);
    font-weight: bold;
  }
}

/* Footnotes / Figure captions */
figure {
  counter-increment: figure-counter;
  
  figcaption::before {
    content: 'Figure ' counter(figure-counter) ': ';
    font-weight: bold;
  }
}`,
      language: 'css',
    },
    interviewAnswer: 'CSS counters are great for document-style content where headings need automatic numbering. I use them for table of contents, legal documents, and academic articles where heading numbers update automatically when you add or remove sections. The multi-level counters with nested counter-reset are powerful for outlines. counters() (plural) is the key function for nested numbering — it handles arbitrary depth automatically.',
    commonMistakes: [
      'counter-reset must be on a parent/ancestor, not the element itself',
      'Forgetting that counters reset to 0 by default (use counter-reset: name 0)',
      'Using JavaScript for numbering when CSS counters would work',
    ],
    realWorldUse: 'Legal documents, academic papers, table of contents, cookbook step numbering, image gallery captions.',
    followUpQuestions: ['Can you start a counter at a value other than 0?', 'How do counters work with nested elements?'],
  },

  {
    id: 'html-web-components',
    category: 'html',
    type: 'theory',
    question: 'What are Web Components and what are their four key technologies?',
    difficulty: 'intermediate',
    tags: ['web-components', 'custom-elements', 'shadow-dom', 'html-templates'],
    shortAnswer: 'Web Components are four browser standards: Custom Elements (define new HTML tags), Shadow DOM (encapsulated DOM tree), HTML Templates (<template>/<slot>), and ES Modules (for distributing components). Together they enable framework-agnostic reusable components.',
    detailedExplanation: 'Custom Elements API lets you define and register new HTML elements (class extends HTMLElement). Shadow DOM provides style and DOM encapsulation. HTML Templates give inert HTML that can be stamped. Slots allow consumers to project content into the shadow DOM. Web Components work in any framework or plain HTML — no build step required. Used in design systems for framework-agnostic distribution.',
    example: {
      code: `// 1. Custom Elements + Shadow DOM + Templates
class AppCard extends HTMLElement {
  // Observed attributes trigger attributeChangedCallback
  static get observedAttributes() {
    return ['title', 'theme'];
  }

  constructor() {
    super();
    // Attach shadow root for encapsulation
    this._shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    // Called when element added to DOM
    this._render();
  }

  disconnectedCallback() {
    // Called when element removed — cleanup
    this._cleanup();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) this._render();
  }

  _render() {
    const title = this.getAttribute('title') || 'Card';
    const theme = this.getAttribute('theme') || 'light';

    this._shadow.innerHTML = \`
      <style>
        /* Styles are encapsulated — won't leak out */
        :host {
          display: block;
          border-radius: 8px;
          overflow: hidden;
        }
        :host([theme="dark"]) {
          background: #1a1a1a;
          color: white;
        }
        .card { padding: 1rem; }
        .title { font-size: 1.25rem; font-weight: bold; }
      </style>
      <div class="card" part="card">
        <h3 class="title">\${title}</h3>
        <slot></slot>  <!-- Projected content from user -->
        <slot name="actions"></slot>  <!-- Named slot -->
      </div>
    \`;
  }
}

// Register the custom element
customElements.define('app-card', AppCard);

// Usage — works in any framework or plain HTML
/*
<app-card title="My Card" theme="dark">
  <p>Card content projected via default slot</p>
  <button slot="actions">Learn More</button>
</app-card>
*/

// Check if custom element is defined
await customElements.whenDefined('app-card');

// Extend built-in elements (limited browser support)
class FancyButton extends HTMLButtonElement {
  connectedCallback() {
    this.classList.add('fancy');
  }
}
customElements.define('fancy-button', FancyButton, { extends: 'button' });
// <button is="fancy-button">Click</button>`,
      language: 'javascript',
    },
    interviewAnswer: 'Web Components solve the design system distribution problem — how do you share UI components across React, Vue, Angular, and plain HTML projects? You build them once as Web Components and they work everywhere. The Shadow DOM is the key feature — styles and DOM are completely encapsulated, so a company\'s design system components won\'t conflict with the host app\'s CSS. The downside is they\'re more verbose than React and SSR support has historically been poor.',
    commonMistakes: [
      'Not cleaning up event listeners in disconnectedCallback (memory leaks)',
      'Putting too much logic in the constructor (use connectedCallback)',
      'Forgetting that Shadow DOM encapsulation cuts both ways — global CSS won\'t affect it',
    ],
    realWorldUse: 'Design systems shared across frameworks, browser extensions, embeddable widgets. GitHub uses Web Components for their UI elements.',
    followUpQuestions: ['What is the difference between open and closed shadow DOM?', 'How do you pass complex data (arrays/objects) to Web Components?'],
  },

  {
    id: 'css-aspect-ratio',
    category: 'css',
    type: 'theory',
    question: 'How does the CSS aspect-ratio property work and what problems does it solve?',
    difficulty: 'beginner',
    tags: ['aspect-ratio', 'layout', 'responsive', 'cls'],
    shortAnswer: 'aspect-ratio sets a preferred width-to-height ratio for an element. It eliminates the padding-top hack for responsive iframes/videos, prevents CLS by reserving space before media loads, and simplifies square/circle layout patterns.',
    detailedExplanation: 'Before aspect-ratio, responsive embeds required the padding-top percentage hack (56.25% for 16:9). aspect-ratio: 16/9 replaces this entirely. It also solves CLS — when you set width and aspect-ratio on an image, the browser knows the height before the image loads and reserves the space. If both width and height are explicit, aspect-ratio acts as a fallback only when one dimension is flexible.',
    example: {
      code: `/* Responsive video embed — old way */
.video-container {
  position: relative;
  padding-top: 56.25%; /* 9/16 = 0.5625 */
  height: 0;
}
.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Modern way — much simpler */
.video-container {
  aspect-ratio: 16 / 9;
  width: 100%;
}
.video-container iframe {
  width: 100%;
  height: 100%;
}

/* Prevent CLS for images */
img {
  width: 100%;
  aspect-ratio: 4 / 3;  /* Reserve space before image loads */
  object-fit: cover;     /* Don't distort */
}

/* Square cards */
.thumbnail {
  aspect-ratio: 1;       /* 1/1 = square */
  object-fit: cover;
}

/* Card grid with consistent height */
.card {
  aspect-ratio: 3 / 2;
}

/* Override when content determines height */
.card--tall {
  aspect-ratio: auto;    /* Remove constraint */
}

/* With min-height for content overflow */
.section {
  aspect-ratio: 16 / 9;
  min-height: 400px;     /* Won't shrink below this */
}

/* Circle avatar */
.avatar {
  aspect-ratio: 1;
  border-radius: 50%;
  width: 3rem;
}`,
      language: 'css',
    },
    interviewAnswer: 'aspect-ratio is one of those CSS features that made me realise how much workaround code I was writing. The padding-top hack for responsive embeds was something every frontend developer had memorised but never understood intuitively. aspect-ratio replaces it cleanly and is much more readable. For performance, setting aspect-ratio on images alongside width means the browser can reserve the exact space before the image downloads, eliminating CLS layout shifts.',
    commonMistakes: [
      'Still using the padding-top hack instead of aspect-ratio',
      'Not using aspect-ratio on images (causes CLS)',
      'Forgetting object-fit: cover when constraining image dimensions',
    ],
    realWorldUse: 'All images, video embeds, thumbnail grids, avatar circles, card layouts.',
    followUpQuestions: ['How does aspect-ratio interact with explicit width and height attributes?', 'What is object-fit and when do you need it?'],
  },

  {
    id: 'html-performance-attributes',
    category: 'html',
    type: 'theory',
    question: 'What HTML attributes improve loading performance? (loading, fetchpriority, decoding, rel)',
    difficulty: 'intermediate',
    tags: ['performance', 'loading', 'fetchpriority', 'preload', 'html'],
    shortAnswer: 'Key performance attributes: loading="lazy" (defer images), fetchpriority="high" (prioritise LCP image), decoding="async" (non-blocking image decode), rel="preload/prefetch/preconnect" (resource hints), crossorigin (enables CORS caching).',
    detailedExplanation: 'HTML has built-in performance controls that don\'t require JavaScript. loading="lazy" uses Intersection Observer under the hood to defer images. fetchpriority hints to the browser\'s preload scanner which resources to prioritise. decoding="async" tells the browser to decode the image off the main thread. Resource hints (preload, prefetch, preconnect, dns-prefetch) optimise network usage for upcoming resources.',
    example: {
      code: `<!-- LCP hero image — highest priority, NOT lazy -->
<img
  src="hero.webp"
  alt="Hero"
  fetchpriority="high"
  loading="eager"
  decoding="sync"
  width="1200"
  height="600"
>

<!-- Below-fold images — lazy load -->
<img
  src="product.webp"
  alt="Product"
  loading="lazy"
  decoding="async"
  width="400"
  height="300"
>

<!-- Resource hints in <head> -->
<!-- Preload: fetch immediately, needed for current page -->
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/hero.webp" as="image">
<link rel="preload" href="/app.js" as="script">

<!-- Prefetch: fetch low priority, needed for NEXT page -->
<link rel="prefetch" href="/about.js" as="script">

<!-- Preconnect: establish connection early -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://api.example.com" crossorigin>

<!-- DNS-prefetch: lighter than preconnect -->
<link rel="dns-prefetch" href="https://analytics.example.com">

<!-- Script loading -->
<!-- defer: load in parallel, execute after HTML parsed -->
<script defer src="/app.js"></script>

<!-- async: load in parallel, execute immediately when ready -->
<script async src="/analytics.js"></script>

<!-- module: ES module, deferred by default -->
<script type="module" src="/app.mjs"></script>

<!-- iframe: lazy load embedded content -->
<iframe
  src="https://youtube.com/embed/..."
  loading="lazy"
  title="Video title"
></iframe>`,
      language: 'html',
    },
    interviewAnswer: 'These attributes work with the browser\'s preload scanner — the browser reads the HTML as it downloads it to discover resources before it\'s fully parsed. fetchpriority="high" tells the scanner to start downloading the LCP image immediately. Never use loading="lazy" on the hero image — it defeats the preload scanner. preconnect is valuable for third-party origins like fonts or analytics APIs where the DNS/TCP handshake is the bottleneck.',
    commonMistakes: [
      'Using loading="lazy" on the LCP hero image (delays LCP)',
      'Not using fetchpriority="high" on the LCP image',
      'Using preload without the as attribute (browser ignores it)',
      'preconnect without crossorigin for font origins',
    ],
    realWorldUse: 'Every performance-optimised website. Next.js <Image> and <Script> components handle these automatically.',
    followUpQuestions: ['What is the difference between preload and prefetch?', 'Why does loading="lazy" on the hero image hurt LCP?'],
  },

  {
    id: 'css-responsive-typography',
    category: 'css',
    type: 'theory',
    question: 'How do you implement a responsive type scale in CSS?',
    difficulty: 'intermediate',
    tags: ['typography', 'responsive', 'clamp', 'type-scale'],
    shortAnswer: 'A type scale defines harmonious font sizes using a ratio. Make it responsive with clamp() for fluid sizes, rem for accessibility, and CSS custom properties for a single source of truth. Use modular scale ratios like 1.25 (Major Third) or 1.333 (Perfect Fourth).',
    detailedExplanation: 'A type scale uses a consistent ratio between heading levels. Popular ratios: 1.125 (Major Second), 1.25 (Major Third), 1.333 (Perfect Fourth), 1.5 (Perfect Fifth). clamp(min, preferred, max) creates fluid typography that scales with viewport without media query breakpoints. CSS custom properties centralise the scale. Fluid type uses viewport units in the preferred value: clamp(1rem, 2.5vw + 0.5rem, 2rem).',
    example: {
      code: `/* Modular type scale with CSS custom properties */
:root {
  /* Scale ratio: Perfect Fourth (1.333) */
  --scale: 1.333;

  /* Base sizes */
  --text-xs:   clamp(0.64rem,  0.5vw + 0.5rem, 0.75rem);
  --text-sm:   clamp(0.8rem,   0.7vw + 0.5rem, 0.875rem);
  --text-base: clamp(1rem,     1vw + 0.5rem,   1.125rem);
  --text-lg:   clamp(1.25rem,  1.5vw + 0.5rem, 1.5rem);
  --text-xl:   clamp(1.5rem,   2vw + 0.5rem,   2rem);
  --text-2xl:  clamp(1.875rem, 2.5vw + 0.5rem, 2.5rem);
  --text-3xl:  clamp(2.25rem,  3vw + 0.5rem,   3rem);
  --text-4xl:  clamp(2.75rem,  4vw + 0.5rem,   4rem);

  /* Line heights */
  --leading-tight:  1.2;
  --leading-snug:   1.35;
  --leading-normal: 1.6;
  --leading-loose:  1.8;

  /* Spacing scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-8: 2rem;
}

/* Apply scale */
body {
  font-size: var(--text-base);
  line-height: var(--leading-normal);
}

h1 { font-size: var(--text-4xl); line-height: var(--leading-tight); }
h2 { font-size: var(--text-3xl); line-height: var(--leading-tight); }
h3 { font-size: var(--text-2xl); line-height: var(--leading-snug); }
h4 { font-size: var(--text-xl);  line-height: var(--leading-snug); }
h5 { font-size: var(--text-lg);  line-height: var(--leading-normal); }
h6 { font-size: var(--text-base); line-height: var(--leading-normal); }

/* Fluid formula: clamp(min, viewport-based + rems, max) */
/* The viewport-based part: vw * rate + rem_offset */
/* min: smallest on mobile, max: biggest on desktop */

/* Opt-out of fluid sizing for fixed contexts */
.badge { font-size: 0.75rem; } /* Fixed, not fluid */

/* Paragraph measure (optimal 45-75 chars) */
p {
  max-width: 65ch;
  line-height: var(--leading-loose);
}`,
      language: 'css',
    },
    interviewAnswer: 'A well-defined type scale makes typography consistent across a whole project. I define all sizes as CSS custom properties at the top of the file — changing the scale ratio or base size updates everything. clamp() makes each size fluid within bounds, eliminating separate font-size declarations in media queries. The ch unit is my favourite for paragraph width — 65ch is roughly optimal reading length regardless of font size.',
    commonMistakes: [
      'Hardcoding font sizes in many places instead of using a scale',
      'Using px instead of rem (breaks user font size preferences)',
      'No line-height adjustments for different sizes (headings need tighter, body needs looser)',
    ],
    realWorldUse: 'Design systems, content-heavy sites, blogs, marketing pages.',
    followUpQuestions: ['What is a modular scale?', 'How does the ch unit work?'],
  },
];
