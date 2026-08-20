import type { CssLesson } from '../css-curriculum';
export const cssTextLesson: CssLesson = {
  id:'css-text',title:'Text & Fonts',slug:'text-fonts',
  chapter:'text',order:5,difficulty:'beginner',readingTime:12,
  description:'Control typography — font families, sizes, weights, line height, letter spacing, and text decoration.',
  sections:[
    {type:'text',content:'Typography is one of the most impactful aspects of web design. Good typography improves readability, establishes hierarchy, and creates visual rhythm. CSS gives you complete control over every aspect of text display.'},
    {type:'heading',content:'Font Family'},
    {type:'code',language:'css',content:'font-family specifies the font to use. Always provide a font stack — a comma-separated list of fallbacks. If the first font is unavailable, the browser tries the next. Always end with a generic family: serif, sans-serif, or monospace.',code:`/* Font stack: browser tries each font in order */
body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Font categories */
.serif     { font-family: Georgia, 'Times New Roman', serif; }
.sans-serif { font-family: Arial, Helvetica, sans-serif; }
.mono      { font-family: 'JetBrains Mono', 'Fira Code', monospace; }

/* Google Fonts — add to HTML <head> first */
/* <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet"> */
body { font-family: 'Inter', sans-serif; }

/* @font-face — self-hosted fonts */
@font-face {
  font-family: 'MyFont';
  src: url('/fonts/myfont.woff2') format('woff2');
  font-weight: 400;
  font-display: swap; /* show fallback while loading */
}`},
    {type:'heading',content:'Font Size'},
    {type:'code',language:'css',content:'font-size sets how large text appears. px is absolute and consistent. em is relative to the parent font size. rem is relative to the root (html) font size — more predictable. 1rem equals 16px by default. Use rem for consistent sizing across components.',code:`/* Absolute units */
h1 { font-size: 48px; }
p  { font-size: 16px; }

/* Relative units */
p  { font-size: 1rem; }    /* relative to root (html) = 16px by default */
p  { font-size: 1em; }     /* relative to PARENT element font-size */
small { font-size: 0.875rem; } /* 14px */

/* Fluid typography with clamp() — scales with viewport */
h1 { font-size: clamp(1.5rem, 5vw, 3rem); }
/* min:24px, preferred:5% of viewport, max:48px */

/* Common type scale */
:root { font-size: 16px; } /* base */
.text-xs   { font-size: 0.75rem; }  /* 12px */
.text-sm   { font-size: 0.875rem; } /* 14px */
.text-base { font-size: 1rem; }     /* 16px */
.text-lg   { font-size: 1.125rem; } /* 18px */
.text-xl   { font-size: 1.25rem; }  /* 20px */
.text-2xl  { font-size: 1.5rem; }   /* 24px */
.text-3xl  { font-size: 1.875rem; } /* 30px */
.text-4xl  { font-size: 2.25rem; }  /* 36px */`},
    {type:'heading',content:'Font Weight, Style & Variant'},
    {type:'code',language:'css',content:'font-weight controls how bold text appears. Values range from 100 (thin) to 900 (black). 400 is normal, 700 is bold. Not all weights are available for every font — if a weight is missing the browser uses the nearest available weight.',code:`/* Font weight */
.thin       { font-weight: 100; }
.light      { font-weight: 300; }
.regular    { font-weight: 400; }  /* normal */
.medium     { font-weight: 500; }
.semibold   { font-weight: 600; }
.bold       { font-weight: 700; }
.extrabold  { font-weight: 800; }
.black      { font-weight: 900; }

/* Font style */
.italic { font-style: italic; }
.normal { font-style: normal; }

/* Font variant */
.caps { font-variant: small-caps; } /* LIKE THIS but smaller */

/* Shorthand */
p { font: italic 600 1rem/1.6 'Inter', sans-serif; }
/* style weight size/line-height family */`},
    {type:'heading',content:'Text Spacing'},
    {type:'code',language:'css',content:'line-height controls vertical spacing between lines of text. A value of 1.5 to 1.7 is ideal for body text readability. Headings can use 1.1 to 1.2 for a tighter look. Using a unitless number (1.5) is recommended over px — it scales with font size.',code:`/* Line height — most important for readability */
body  { line-height: 1.6; }    /* unitless — relative to font-size, recommended */
h1    { line-height: 1.1; }    /* tighter for headings */
.text { line-height: 1.75; }   /* looser for long articles */

/* Letter spacing */
h1       { letter-spacing: -0.02em; }  /* tighter for big headings */
.caption { letter-spacing: 0.05em; }   /* slightly looser */
.allcaps { letter-spacing: 0.1em; }    /* common with uppercase text */

/* Word spacing */
p { word-spacing: 0.1em; }

/* Text indent */
p { text-indent: 2em; }  /* indent first line like a book */`},
    {type:'heading',content:'Text Alignment & Decoration'},
    {type:'code',language:'css',content:'text-align positions inline content within its container. left is the default for LTR languages. center works well for headings and hero text. justify stretches text to fill full width — avoid it for body text as it creates uneven word spacing.',code:`/* Text alignment */
.left    { text-align: left; }
.center  { text-align: center; }
.right   { text-align: right; }
.justify { text-align: justify; } /* even edges — use carefully, creates gaps */

/* Vertical alignment (for inline elements) */
sup { vertical-align: super; }
sub { vertical-align: sub; }
.middle { vertical-align: middle; }

/* Text decoration */
a    { text-decoration: none; }           /* remove underline from links */
a:hover { text-decoration: underline; }
del  { text-decoration: line-through; }
ins  { text-decoration: underline; }
.fancy { text-decoration: underline wavy #ef4444; }  /* wavy underline */

/* Text transform */
.uppercase { text-transform: uppercase; }
.lowercase { text-transform: lowercase; }
.capitalize { text-transform: capitalize; } /* First Letter Of Each Word */
.none { text-transform: none; }

/* Text overflow */
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;  /* shows "..." when text overflows */
  max-width: 200px;
}
.clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;    /* show max 3 lines, then "..." */
  -webkit-box-orient: vertical;
  overflow: hidden;
}`},
    {type:'heading',content:'Text Shadow'},
    {type:'code',language:'css',content:'text-shadow adds a shadow behind text. The four values are: horizontal offset, vertical offset, blur radius, and color. Multiple shadows can be added separated by commas. Use subtle shadows for depth and text legibility on images.',code:`/* text-shadow: offset-x offset-y blur color */
h1 { text-shadow: 2px 2px 4px rgba(0,0,0,0.2); }
.glow { text-shadow: 0 0 20px #2563eb; }
.multi {
  text-shadow:
    1px 1px 2px rgba(0,0,0,0.5),
    0 0 20px #2563eb;
}
/* Cutout effect */
.cutout {
  background: black;
  color: transparent;
  text-shadow: 2px 2px 3px white;
  -webkit-background-clip: text;
}`},
    {type:'tryit',title:'Try It: Typography',
     html:`<article class="article">
  <span class="tag">TUTORIAL</span>
  <h1>The Art of Typography</h1>
  <p class="subtitle">Beautiful text starts with good CSS</p>
  <p class="body-text">Typography is not just about choosing a font. It's about the relationship between <strong>font size</strong>, <em>line height</em>, letter spacing, and color contrast. A well-typeset page draws readers in and makes content effortless to read.</p>
  <blockquote>Typography is the craft of endowing human language with a durable visual form.</blockquote>
  <p class="body-text">Try adjusting the CSS properties on the left — change <code>line-height</code>, <code>letter-spacing</code>, or <code>font-size</code> to see how they affect readability.</p>
  <a href="#">Read more →</a>
</article>`,
     css:`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
body{font-family:'Inter',system-ui,sans-serif;background:#f9fafb;padding:24px;}
.article{max-width:680px;margin:0 auto;background:white;padding:40px;border-radius:16px;border:1px solid #e5e7eb;}
.tag{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#7c3aed;background:#f5f3ff;padding:4px 10px;border-radius:999px;}
h1{font-size:clamp(1.75rem,4vw,2.5rem);font-weight:800;line-height:1.1;color:#111827;margin:12px 0 8px;letter-spacing:-0.02em;}
.subtitle{font-size:1.1rem;color:#6b7280;margin:0 0 24px;}
.body-text{font-size:1rem;line-height:1.75;color:#374151;margin-bottom:20px;}
blockquote{border-left:4px solid #2563eb;padding:16px 24px;margin:24px 0;background:#eff6ff;border-radius:0 8px 8px 0;font-style:italic;color:#1e40af;font-size:1.05rem;line-height:1.6;}
code{background:#f3f4f6;padding:2px 6px;border-radius:4px;font-family:monospace;font-size:13px;color:#dc2626;}
a{color:#2563eb;font-weight:600;text-decoration:none;}
a:hover{text-decoration:underline;}`,
     mode:'html'},
  ],
  exercises:[{id:'txt1',question:'Which CSS property controls the spacing between lines of text?',type:'multiple-choice',options:['letter-spacing','word-spacing','line-height','text-spacing'],correct:2,explanation:'line-height controls the vertical space between lines. A value of 1.5 means 1.5× the font-size. Unitless values like 1.6 are recommended over px values.'}],
  quiz:[{id:'tq1',question:'What does text-overflow: ellipsis do?',options:['Wraps text to next line','Shows "..." when text overflows its container','Removes extra text','Centers text'],correct:1,explanation:'text-overflow: ellipsis shows "..." when text is too long for its container. It requires white-space: nowrap and overflow: hidden to work.'}],
};
