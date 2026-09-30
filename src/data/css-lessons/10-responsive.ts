import type { CssLesson } from '../css-curriculum';
export const cssResponsiveLesson: CssLesson = {
  id:'css-responsive',title:'Responsive Design',slug:'responsive',
  chapter:'responsive',order:10,difficulty:'intermediate',readingTime:12,
  description:'Build websites that work on all screen sizes using media queries, fluid layouts, and responsive units.',
  sections:[
    {type:'text',content:'Responsive design means your website adapts to any screen size - from a 4K monitor to a small phone. In 2026, over 60% of web traffic comes from mobile. A non-responsive website loses more than half its visitors.'},
    {type:'heading',content:'Viewport Meta Tag - Required'},
    {type:'code',language:'html',content:'The viewport meta tag is required for all responsive designs. Without it, mobile browsers zoom out and show the desktop layout. width=device-width tells the browser to use the actual screen width. initial-scale=1 ensures 1:1 pixel mapping.',code:`<!-- MUST have this in <head> - without it, mobile shows desktop zoom-out -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">`},
    {type:'heading',content:'Media Queries'},
    {type:'code',language:'css',content:'Media queries apply CSS only when conditions match. The mobile-first approach: write base styles for mobile, then add min-width queries to enhance for larger screens. Common breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl).',code:`/* Media query syntax */
@media (condition) { /* CSS rules */ }

/* Breakpoints - mobile first approach */
/* Mobile: default styles (no media query needed) */
.container { padding: 16px; }
.grid { grid-template-columns: 1fr; }

/* Tablet: 640px and up */
@media (min-width: 640px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* Laptop: 1024px and up */
@media (min-width: 1024px) {
  .container { max-width: 1200px; margin: 0 auto; padding: 32px; }
  .grid { grid-template-columns: repeat(3, 1fr); }
}

/* Large: 1280px and up */
@media (min-width: 1280px) {
  .grid { grid-template-columns: repeat(4, 1fr); }
}

/* Max-width queries (desktop first - less common) */
@media (max-width: 768px) {
  .sidebar { display: none; }
  nav { flex-direction: column; }
}

/* Range queries (modern CSS) */
@media (640px <= width <= 1024px) { /* tablet only */ }

/* Other media types */
@media print { .nav, .ads { display: none; } }
@media (prefers-color-scheme: dark) { body { background: #0d1117; } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; } }`},
    {type:'heading',content:'Responsive Units'},
    {type:'code',language:'css',content:'Relative units automatically adapt to context. % is relative to the parent. vw/vh are percentages of the viewport. rem is relative to the root font-size - use it for spacing and typography. em is relative to the current element font size. Prefer these over fixed px for responsive layouts.',code:`/* px - absolute, same on all screens */
.fixed { width: 400px; }

/* % - relative to parent */
.half { width: 50%; }

/* vw / vh - viewport width/height */
.fullscreen { width: 100vw; height: 100vh; }
.hero { height: 60vh; }

/* rem - relative to root font-size (16px default) */
h1 { font-size: 2.5rem; }  /* 40px */
p  { font-size: 1rem; }    /* 16px */

/* em - relative to PARENT font-size */
.button { padding: 0.75em 1.5em; } /* scales with button's font-size */

/* clamp(min, preferred, max) - fluid values */
h1 { font-size: clamp(1.5rem, 5vw, 3rem); }
.container { width: clamp(320px, 90%, 1200px); }
p { line-height: clamp(1.4, 2vw, 1.8); }`},
    {type:'heading',content:'Responsive Images'},
    {type:'code',language:'css',content:'Images and videos overflow their containers by default if no width is set. max-width:100% makes them shrink to fit their container while never exceeding their natural size. height:auto preserves the aspect ratio. object-fit:cover fills a fixed-size container without distorting the image.',code:`/* Make images never overflow their container */
img, video {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Responsive background image */
.hero {
  background: url('hero.jpg') center/cover no-repeat;
  height: clamp(200px, 50vh, 600px);
}

/* object-fit for <img> elements */
.thumbnail {
  width: 100%;
  height: 200px;
  object-fit: cover;   /* crop to fill - like background-size: cover */
  object-position: center top; /* focus area */
}
.contain-img {
  object-fit: contain; /* show whole image, letterbox */
}`},
    {type:'heading',content:'Common Responsive Patterns'},
    {type:'code',language:'css',content:'These real-world patterns combine what you have learned. The responsive nav uses flexbox and a media query to switch from horizontal to vertical. The card grid uses auto-fill to automatically create as many columns as fit. The fluid typography uses clamp() to scale smoothly between a min and max font size.',code:`/* 1. Responsive nav that collapses */
.nav { display: flex; gap: 24px; }
.hamburger { display: none; }

@media (max-width: 768px) {
  .nav { display: none; }
  .nav.open { display: flex; flex-direction: column; }
  .hamburger { display: block; }
}

/* 2. Card grid that always looks good */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}
/* No media queries needed! auto-fit handles everything */

/* 3. Responsive typography */
html { font-size: 14px; }
@media (min-width: 768px)  { html { font-size: 15px; } }
@media (min-width: 1024px) { html { font-size: 16px; } }
/* Now all rem values scale proportionally */

/* 4. Hide/show at breakpoints */
.mobile-only { display: block; }
.desktop-only { display: none; }
@media (min-width: 1024px) {
  .mobile-only  { display: none; }
  .desktop-only { display: block; }
}`},
    {type:'tryit',title:'Try It: Responsive Layout',
     html:`<div class="page">
  <header>
    <div class="logo">WebDevAtlas</div>
    <nav class="nav">
      <a href="#">HTML</a><a href="#">CSS</a><a href="#">JS</a>
    </nav>
  </header>
  <main>
    <h1>Responsive Web Design</h1>
    <p>Resize this preview to see the layout change.</p>
    <div class="cards">
      <div class="card"><h3>🌐 HTML</h3><p>Structure of web pages</p></div>
      <div class="card"><h3>🎨 CSS</h3><p>Styling and layout</p></div>
      <div class="card"><h3>⚡ JS</h3><p>Interactive behavior</p></div>
      <div class="card"><h3>⚛️ React</h3><p>UI components</p></div>
    </div>
  </main>
</div>`,
     css:`*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:system-ui,sans-serif;background:#f9fafb;}
header{background:#1e1e1e;padding:14px 20px;display:flex;align-items:center;justify-content:space-between;}
.logo{color:white;font-weight:800;font-size:16px;}
.nav a{color:#9ca3af;text-decoration:none;margin-left:16px;font-size:13px;}
.nav a:hover{color:white;}
main{padding:20px;}
h1{font-size:clamp(1.4rem,4vw,2rem);color:#111827;margin-bottom:8px;}
p{color:#6b7280;font-size:14px;margin-bottom:20px;}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;}
.card{background:white;border:1px solid #e5e7eb;border-radius:10px;padding:16px;}
.card h3{font-size:14px;color:#111827;margin-bottom:4px;}
.card p{font-size:12px;color:#6b7280;margin:0;}`,
     mode:'html'},
    {
      type: 'heading',
      content: 'Common mistakes beginners make',
    },
    {
      type: 'list',
      items: [
        'Leaving out the viewport meta tag, so phones show a zoomed-out desktop page. Fix: add <meta name="viewport" content="width=device-width, initial-scale=1"> to the head.',
        'Designing for desktop first and patching down with many max-width overrides. Fix: work mobile-first: write the base styles for phones and add min-width media queries for larger screens.',
        'Giving containers fixed pixel widths. Fix: use max-width with width: 100%, or relative units such as %, rem and fr.',
        'Letting images overflow their container. Fix: img { max-width: 100%; height: auto; }.',
        'Picking breakpoints by device names. Fix: add a breakpoint where your layout starts to look bad, not where a particular phone ends.',
        'Text and buttons that are too small on a phone. Fix: keep body text around 16px and make tap targets at least about 44px tall.',
      ],
    },
    {
      type: 'heading',
      content: 'Where you use this in real projects',
    },
    {
      type: 'list',
      items: [
        'Blogs and shops that must read well on phones, tablets and desktops.',
        'Navigation that collapses into a menu button on small screens.',
        'Card grids that change from one to two to three columns.',
        'Images and videos that scale inside their container.',
        'Fluid headings with clamp() that grow smoothly with the screen.',
        'Showing or hiding secondary content such as a sidebar depending on the width.',
      ],
    },
    {
      type: 'heading',
      content: 'Practice task: A mobile-first card layout',
    },
    {
      type: 'text',
      content: 'The cards are stacked in one column, which is right for phones. Add two media queries: two columns from 600px wide and three columns from 900px wide. Open the preview in full screen to test the breakpoints.',
    },
    {
      type: 'tryit',
      title: 'A mobile-first card layout',
      content: 'Edit the CSS tab, press Run and compare the result with the description below.',
      html: `<div class="cards">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
  <div class="card">Card 4</div>
  <div class="card">Card 5</div>
  <div class="card">Card 6</div>
</div>`,
      css: `.cards {
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr;
  font-family: system-ui, sans-serif;
}
.card {
  background: #ede9fe;
  padding: 24px;
  border-radius: 8px;
  text-align: center;
  font-weight: 700;
}
/* TODO: add the two min-width media queries */`,
      mode: 'css',
    },
    {
      type: 'note',
      title: 'Expected result',
      content: 'One column below 600px, two columns from 600px, and three columns from 900px, always with a 12px gap.',
    },
    {
      type: 'tip',
      title: 'Hint',
      content: 'Use @media (min-width: 600px) { .cards { grid-template-columns: repeat(2, 1fr); } } and a second query for 900px. Mobile-first means the base rule stays as the single-column version.',
    },
    {
      type: 'code',
      title: 'Solution (try it yourself first)',
      content: 'One possible solution, as a complete page you can run in the editor. Compare it with your own version.',
      code: `<style>
.cards {
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr;
  font-family: system-ui, sans-serif;
}
.card {
  background: #ede9fe;
  padding: 24px;
  border-radius: 8px;
  text-align: center;
  font-weight: 700;
}
@media (min-width: 600px) {
  .cards { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 900px) {
  .cards { grid-template-columns: repeat(3, 1fr); }
}
</style>

<div class="cards">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
  <div class="card">Card 4</div>
  <div class="card">Card 5</div>
  <div class="card">Card 6</div>
</div>`,
      language: 'html',
    },
    {
      type: 'heading',
      content: 'Frequently asked questions',
    },
    {
      type: 'note',
      title: 'What does mobile-first mean?',
      content: 'You write the styles for small screens first and use min-width media queries to add changes for bigger screens. It keeps the CSS simpler and the phone version fast.',
    },
    {
      type: 'note',
      title: 'Which breakpoints should I use?',
      content: 'There is no fixed list. Common starting points are around 600px, 900px and 1200px, but add one wherever your own layout starts to break.',
    },
    {
      type: 'note',
      title: 'Should I use px, rem or %?',
      content: 'Use rem for text and spacing that should scale with the user\'s font setting, and % or fr for flexible widths. px is fine for borders and small fixed details.',
    },
    {
      type: 'note',
      title: 'Do I really need the viewport meta tag?',
      content: 'Yes. Without it mobile browsers pretend the screen is about 980px wide and your media queries will not behave as expected.',
    },
  ],
  exercises:[{id:'rsp1',question:'Which approach is recommended - mobile-first or desktop-first?',type:'multiple-choice',options:['Desktop-first, use max-width queries','Mobile-first, use min-width queries','They are equivalent','Neither, use JavaScript for responsive design'],correct:1,explanation:'Mobile-first means writing default CSS for small screens, then using @media (min-width: ...) to enhance for larger screens. It is easier, produces cleaner code, and performs better since mobile devices download less CSS.'}],
  quiz:[{id:'rq1',question:'What does clamp(1rem, 3vw, 2rem) do for font-size?',options:['Sets font to 3px','Creates a fluid font that scales with viewport but never smaller than 1rem or larger than 2rem','Only works on mobile','Sets minimum font size'],correct:1,explanation:'clamp(min, preferred, max) creates a value that scales with the preferred value but is clamped between minimum and maximum. For fonts: never smaller than 1rem (16px), scales with viewport width, never larger than 2rem (32px).'}],
};
