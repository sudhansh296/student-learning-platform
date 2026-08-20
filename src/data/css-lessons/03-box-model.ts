import type { CssLesson } from '../css-curriculum';

export const cssBoxModelLesson: CssLesson = {
  id: 'css-box-model', title: 'The CSS Box Model', slug: 'box-model',
  chapter: 'box', order: 3, difficulty: 'beginner', readingTime: 12,
  description: 'Understand how every HTML element is a box — content, padding, border, margin — and how box-sizing changes everything.',
  sections: [
    { type: 'text', content: 'Every HTML element is a rectangular box. The CSS Box Model describes the four layers of this box: content (text/images), padding (space inside), border (the line around it), and margin (space outside). Understanding this model is the foundation of all CSS layout work.' },
    { type: 'analogy', title: 'Think of a picture frame', content: 'Imagine a framed photo on a wall. The photo itself is the content. The white matting between photo and frame is the padding. The frame itself is the border. The gap between the frame and the wall or other frames is the margin.' },
    { type: 'heading', content: 'The Four Layers' },
    { type: 'code', language: 'css', code: `div {
  /* CONTENT — controlled by width and height */
  width: 300px;
  height: 150px;

  /* PADDING — space between content and border */
  padding: 20px;              /* all sides */
  padding: 10px 20px;         /* top/bottom, left/right */
  padding: 10px 20px 15px 25px; /* top, right, bottom, left (clockwise) */
  padding-top: 10px;
  padding-right: 20px;
  padding-bottom: 10px;
  padding-left: 20px;

  /* BORDER — the line around the element */
  border: 2px solid #2563eb;
  border: 3px dashed #e5e7eb;
  border: 1px solid transparent;
  border-top: 4px solid red;
  border-radius: 8px;         /* rounds the corners */

  /* MARGIN — space outside the element */
  margin: 20px;               /* all sides */
  margin: 20px auto;          /* top/bottom 20px, left/right auto (centers block) */
  margin-top: 10px;
  margin-bottom: 10px;
}` },
    { type: 'heading', content: 'Default vs box-sizing: border-box' },
    { type: 'text', content: 'By default, width and height only measure the content area. So a 300px-wide div with 20px padding and 2px border actually takes up 344px total. This is confusing. The fix: box-sizing: border-box — the most important single CSS rule you will ever write.' },
    { type: 'code', language: 'css', code: `/* Default box-sizing (content-box): */
.box {
  width: 300px;
  padding: 20px;
  border: 2px solid black;
  /* Total width = 300 + 20+20 + 2+2 = 344px — confusing! */
}

/* border-box: width INCLUDES padding and border */
.box {
  box-sizing: border-box;
  width: 300px;
  padding: 20px;
  border: 2px solid black;
  /* Total width = 300px — exactly what you set! */
}

/* THE UNIVERSAL RESET — always put this at the top of your CSS */
*, *::before, *::after {
  box-sizing: border-box;
  /* Now ALL elements use border-box — width is always what you say */
}` },
    { type: 'note', title: 'Always use box-sizing: border-box', content: 'Every professional CSS project starts with * { box-sizing: border-box; }. This single rule prevents hundreds of confusing layout bugs where elements overflow their containers unexpectedly.' },
    { type: 'heading', content: 'Margin Collapse' },
    { type: 'text', content: 'One confusing CSS behavior: vertical margins between elements collapse. If one element has margin-bottom: 40px and the next has margin-top: 20px, the total space between them is 40px (the larger value), NOT 60px. This only happens vertically, never horizontally.' },
    { type: 'code', language: 'css', code: `/* Margin collapse example */
.box1 { margin-bottom: 40px; }
.box2 { margin-top: 20px; }
/* Space between them = 40px (NOT 60px) — the larger margin wins */

/* How to prevent margin collapse: */
/* 1. Use padding instead of margin */
/* 2. Add border or padding to parent element */
/* 3. Use flexbox or grid (margins don't collapse inside flex/grid) */` },
    { type: 'heading', content: 'Border Styles and Radius' },
    { type: 'code', language: 'css', code: `/* Border styles */
.solid  { border: 2px solid #2563eb; }
.dashed { border: 2px dashed #f59e0b; }
.dotted { border: 2px dotted #ef4444; }
.double { border: 4px double #8b5cf6; }
.groove { border: 4px groove #6b7280; }

/* Border radius */
.slight   { border-radius: 4px; }      /* slight rounding */
.rounded  { border-radius: 8px; }      /* common in modern design */
.pill     { border-radius: 999px; }    /* fully rounded pill shape */
.circle   { border-radius: 50%; }      /* perfect circle (needs equal width/height) */

/* Individual corners */
.asymmetric {
  border-top-left-radius: 20px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 4px;
}

/* Outline vs Border */
/* outline doesn't affect layout (no space taken) */
input:focus {
  outline: 2px solid #2563eb;  /* doesn't push content */
  outline-offset: 2px;         /* gap between element and outline */
}` },
    { type: 'heading', content: 'Display Property' },
    { type: 'code', language: 'css', code: `/* display controls how an element participates in layout */

display: block;          /* takes full width, stacks vertically (div, p, h1) */
display: inline;         /* only as wide as content, stays in line (span, a, strong) */
display: inline-block;   /* inline but respects width/height/padding */
display: none;           /* completely removes from layout (hidden, no space) */
display: flex;           /* flexbox container */
display: grid;           /* grid container */
display: contents;       /* element itself ignored, children exposed */

/* visibility vs display:none */
visibility: hidden;      /* hidden but still takes up space in layout */
display: none;           /* hidden AND no space taken */
opacity: 0;              /* invisible but still interactive (clicks work)! */

/* Common pattern: show/hide with JavaScript */
.modal { display: none; }
.modal.is-open { display: flex; }` },
    { type: 'tryit', title: 'Try It: Box Model Explorer',
      html: `<div class="container">
  <h1>Box Model Demo</h1>

  <div class="box box1">
    <p>Content box: 200px × 100px<br>
    Padding: 20px<br>
    Border: 3px solid<br>
    <strong>Total: 246px wide</strong> (default)</p>
  </div>

  <div class="box box2">
    <p>border-box: 200px × 100px<br>
    Padding: 20px<br>
    Border: 3px solid<br>
    <strong>Total: 200px wide</strong> (border-box)</p>
  </div>

  <div class="box box3">
    <p>margin: 20px auto<br>
    This centers a block element!</p>
  </div>
</div>`,
      css: `body { font-family: system-ui, sans-serif; background: #f9fafb; padding: 20px; }
h1 { color: #1e1e1e; margin-bottom: 20px; }
.container { max-width: 600px; }
p { font-size: 13px; line-height: 1.5; margin: 0; color: #374151; }
strong { color: #1d4ed8; }

/* DEFAULT box-sizing (content-box) */
.box1 {
  box-sizing: content-box;
  width: 200px;
  padding: 20px;
  border: 3px solid #ef4444;
  background: #fef2f2;
  margin-bottom: 16px;
}

/* border-box */
.box2 {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 3px solid #22c55e;
  background: #f0fdf4;
  margin-bottom: 16px;
}

/* Centered with auto margins */
.box3 {
  box-sizing: border-box;
  width: 300px;
  padding: 16px;
  border: 2px dashed #2563eb;
  background: #eff6ff;
  margin: 0 auto;        /* centers the block! */
  text-align: center;
  border-radius: 12px;
}`,
      mode: 'html' },
  ],
  exercises: [
    { id: 'bm1', question: 'With box-sizing: content-box, a div has width:200px, padding:20px, border:5px. What is the total rendered width?', type: 'code-output', correct: '250px', explanation: '200 (content) + 20 + 20 (padding) + 5 + 5 (border) = 250px. With border-box it would stay at 200px.' },
    { id: 'bm2', question: 'Which CSS value centers a block element horizontally?', type: 'multiple-choice', options: ['text-align: center', 'margin: 0 auto', 'padding: auto', 'display: center'], correct: 1, explanation: 'margin: 0 auto sets top/bottom margin to 0 and left/right to auto — the browser splits the available space equally between left and right, centering the element.' },
  ],
  quiz: [
    { id: 'bq1', question: 'What is the difference between margin and padding?', options: ['No difference', 'Margin is space inside, padding is space outside', 'Padding is space inside the border, margin is space outside the border', 'Margin only works vertically'], correct: 2, explanation: 'Padding is the space between the content and the border (inside). Margin is the space outside the border, between this element and others.' },
    { id: 'bq2', question: 'What is margin collapse?', options: ['When margins become 0', 'When vertical margins between elements merge to the larger value', 'When padding equals margin', 'When border removes margins'], correct: 1, explanation: 'When two vertical margins meet, they collapse to the LARGER of the two values, not the sum. This only happens vertically, and does not occur in flex or grid containers.' },
  ],
};
