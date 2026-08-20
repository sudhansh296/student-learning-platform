import type { HtmlLesson } from '../html-curriculum';
export const htmlResponsiveLesson: HtmlLesson = {
  id: 'html-responsive', title: 'HTML Responsive Design', slug: 'responsive', chapter: 'advanced', order: 16,
  difficulty: 'intermediate', readingTime: 10, description: 'Make websites work on all screen sizes — viewport meta, flexible images, media queries, and mobile-first design.',
  sections: [
    { type: 'text', content: 'Responsive web design means your website looks and works great on ALL screen sizes — from a large 4K monitor to a small phone screen. In 2026, over 60% of web traffic is from mobile devices. If your site is not responsive, you are losing more than half your visitors.' },
    { type: 'heading', content: 'Step 1: The Viewport Meta Tag' },
    { type: 'code', language: 'html',       content: 'The viewport meta tag is required for responsive design. Without it, mobile browsers render at desktop width and zoom out making text tiny. width=device-width uses the actual screen width. initial-scale=1 sets 1:1 pixel mapping.',
      code: `<!-- Always include this in <head> — the foundation of responsive design -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- width=device-width: use the device's actual screen width -->
<!-- initial-scale=1.0: no zoom by default -->

<!-- Without this tag: Mobile browser shows desktop version zoomed out -->
<!-- With this tag:    Page scales correctly to the device screen -->` },
    { type: 'heading', content: 'Step 2: Flexible Images' },
    { type: 'code', language: 'html',       content: 'srcset provides multiple image sizes and lets the browser pick the best one for the screen density. sizes tells the browser how wide the image displays at different viewports. Mobile downloads small images and desktop gets high-res ones — critical for performance.',
      code: `<!-- Make images scale with their container -->
<style>
  img {
    max-width: 100%;   /* Never overflow their container */
    height: auto;      /* Keep aspect ratio */
    display: block;    /* Remove bottom space */
  }
</style>

<!-- Responsive image using srcset — serve different sizes -->
<img
  src="hero-800.jpg"
  srcset="hero-400.jpg 400w,
          hero-800.jpg 800w,
          hero-1200.jpg 1200w"
  sizes="(max-width: 600px) 400px,
         (max-width: 1000px) 800px,
         1200px"
  alt="Hero image"
>` },
    { type: 'heading', content: 'Step 3: CSS Media Queries' },
    { type: 'code', language: 'html',       content: 'The mobile-first approach writes base CSS for small screens then overrides for larger screens with min-width media queries. This is easier to maintain than desktop-first. Most web traffic comes from mobile devices so starting small and enhancing upward is the right default strategy.',
      code: `<style>
  /* Mobile first — default styles for small screens */
  .container { padding: 16px; }
  .grid { display: flex; flex-direction: column; gap: 16px; }
  .nav { display: none; }  /* Hide nav on mobile */
  .hamburger { display: block; }  /* Show hamburger on mobile */

  /* Tablet — 600px and up */
  @media (min-width: 600px) {
    .container { padding: 24px; }
    .grid { flex-direction: row; flex-wrap: wrap; }
    .grid > * { width: calc(50% - 8px); }
  }

  /* Desktop — 900px and up */
  @media (min-width: 900px) {
    .container { max-width: 1200px; margin: 0 auto; padding: 32px; }
    .grid > * { width: calc(33.33% - 11px); }
    .nav { display: flex; }
    .hamburger { display: none; }
  }

  /* Large desktop — 1200px and up */
  @media (min-width: 1200px) {
    .container { padding: 40px; }
  }
</style>` },
    { type: 'heading', content: 'Common Breakpoints' },
    { type: 'table', headers: ['Breakpoint', 'Width', 'Target Devices'], rows: [
      ['Extra small', '< 480px', 'Small phones'],
      ['Small', '480px – 767px', 'Most phones'],
      ['Medium', '768px – 1023px', 'Tablets'],
      ['Large', '1024px – 1279px', 'Laptops, small desktops'],
      ['Extra large', '≥ 1280px', 'Large desktops, 4K'],
    ]},
    { type: 'heading', content: 'Responsive CSS Grid — Modern Approach' },
    { type: 'code', language: 'html',       content: 'Relative units scale with context. % is relative to the parent. vw and vh are percentages of the viewport. rem is relative to the root font size — ideal for consistent spacing. clamp(min,preferred,max) limits a value within a range for fluid typography.',
      code: `<!-- CSS Grid with auto-fit — automatically responsive! -->
<style>
  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }
  /* Cards automatically wrap to new row when screen is too small */
  /* No media queries needed for this layout! */
</style>

<div class="card-grid">
  <div class="card">HTML</div>
  <div class="card">CSS</div>
  <div class="card">JavaScript</div>
</div>` },
    { type: 'tryit', title: 'Try It: Responsive Grid',
      html: `<div class="page">
  <header>
    <h1>WebDev Atlas</h1>
    <p>Resize this preview to see responsive behavior</p>
  </header>

  <div class="card-grid">
    <div class="card">
      <div class="card-icon">🌐</div>
      <h3>HTML</h3>
      <p>Structure & semantics</p>
    </div>
    <div class="card">
      <div class="card-icon">🎨</div>
      <h3>CSS</h3>
      <p>Styling & layouts</p>
    </div>
    <div class="card">
      <div class="card-icon">⚡</div>
      <h3>JavaScript</h3>
      <p>Behavior & interaction</p>
    </div>
    <div class="card">
      <div class="card-icon">⚛️</div>
      <h3>React</h3>
      <p>UI library</p>
    </div>
    <div class="card">
      <div class="card-icon">🟢</div>
      <h3>Node.js</h3>
      <p>Server runtime</p>
    </div>
    <div class="card">
      <div class="card-icon">🍃</div>
      <h3>MongoDB</h3>
      <p>NoSQL database</p>
    </div>
  </div>
</div>`,
      css: `* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: system-ui, sans-serif; background: #f4f4f4; }
.page { padding: 24px; max-width: 1000px; margin: 0 auto; }
header { margin-bottom: 24px; }
header h1 { font-size: 22px; color: #1e1e1e; }
header p  { color: #6b7280; font-size: 13px; margin-top: 4px; }
.card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; }
.card { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; text-align: center; }
.card-icon { font-size: 32px; margin-bottom: 10px; }
.card h3 { font-size: 15px; font-weight: 700; color: #1e1e1e; margin-bottom: 4px; }
.card p  { font-size: 12px; color: #6b7280; }
.card:hover { border-color: #2563eb; transform: translateY(-2px); transition: all .15s; box-shadow: 0 4px 12px rgba(0,0,0,.06); }`,
      mode: 'html' },
  ],
  exercises: [
    { id: 'rsp1', question: 'What is "mobile-first" design?', type: 'multiple-choice', options: ['Making apps only for mobile', 'Designing for small screens first, then adding larger screen styles with min-width media queries', 'Removing features from the desktop version', 'Using only touch events'], correct: 1, explanation: 'Mobile-first means writing default CSS for small screens, then adding @media (min-width: ...) rules to enhance the layout for larger screens. This is easier and more performant than the reverse.' },
  ],
  quiz: [{ id: 'rq1', question: 'Which CSS property makes images responsive (never overflow their container)?', options: ['width: 100%', 'max-width: 100%', 'min-width: 100%', 'overflow: hidden'], correct: 1, explanation: 'max-width: 100% means the image will never be wider than its container, but can be smaller. Combined with height: auto it keeps the aspect ratio.' }],
};
