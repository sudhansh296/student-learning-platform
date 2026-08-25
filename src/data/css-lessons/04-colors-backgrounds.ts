import type { CssLesson } from '../css-curriculum';
export const cssColorsLesson: CssLesson = {
  id:'css-colors',title:'Colors & Backgrounds',slug:'colors-backgrounds',
  chapter:'colors',order:4,difficulty:'beginner',readingTime:10,
  description:'Master CSS color formats, backgrounds, gradients, and opacity.',
  sections:[
    {type:'text',content:'CSS offers multiple ways to specify colors - named colors, hex codes, RGB, RGBA, HSL, and HSLA. You can apply colors to text, backgrounds, borders, shadows, and gradients.'},
    {type:'heading',content:'Color Formats'},
    {type:'code',language:'css',content:'CSS supports 140+ named colors like red, tomato, steelblue, and coral. They are readable but limited. For exact brand colors use hex codes. Named colors are great for quick prototyping and learning CSS.',code:`/* Named colors (140+ available) */
h1 { color: tomato; }
.warning { background: coral; }

/* HEX - most common in web design */
h1 { color: #2563eb; }           /* 6-digit hex */
h1 { color: #25f; }              /* 3-digit shorthand = #2255ff */
h1 { color: #2563eb80; }         /* 8-digit hex with alpha (last 2) */

/* RGB */
p { color: rgb(37, 99, 235); }
.overlay { background: rgb(0, 0, 0); }

/* RGBA - with transparency (0=transparent, 1=opaque) */
.overlay { background: rgba(0, 0, 0, 0.5); }     /* 50% black */
.card { box-shadow: 0 4px 24px rgba(0,0,0,0.1); }

/* HSL - Hue (0-360°), Saturation (%), Lightness (%) */
h1 { color: hsl(221, 83%, 53%); }     /* blue */
.muted { color: hsl(0, 0%, 50%); }    /* gray */

/* HSLA */
.glass { background: hsla(221, 83%, 53%, 0.1); }

/* CSS custom properties (variables) for consistent colors */
:root {
  --blue-600: #2563eb;
  --blue-700: #1d4ed8;
  --gray-100: #f3f4f6;
  --gray-900: #111827;
}
h1 { color: var(--blue-600); }
body { background: var(--gray-100); color: var(--gray-900); }`},
    {type:'heading',content:'Background Properties'},
    {type:'code',language:'css',content:'background-color fills the background of any element. Use it on body for the page background, on cards for white/grey panels, and on buttons for their fill color. Combine with color for text to ensure sufficient contrast.',code:`/* Background color */
body { background-color: #f9fafb; }

/* Background image */
.hero {
  background-image: url('hero.jpg');
  background-size: cover;         /* fill the container, crop if needed */
  background-size: contain;       /* fit inside container, show gap */
  background-size: 100% 100%;    /* stretch to exact dimensions */
  background-position: center;   /* center the image */
  background-position: top left;
  background-repeat: no-repeat;  /* don't tile the image */
  background-repeat: repeat;     /* tile (default) */
  background-attachment: fixed;  /* parallax effect */
}

/* Shorthand */
.hero {
  background: url('hero.jpg') no-repeat center/cover;
  /*         image    repeat   position/size */
}

/* Multiple backgrounds */
.layered {
  background:
    url('logo.png') no-repeat top right,
    url('pattern.png') repeat,
    linear-gradient(to bottom, #667eea, #764ba2);
}`},
    {type:'heading',content:'CSS Gradients'},
    {type:'code',language:'css',content:'linear-gradient() creates a smooth color transition. The first argument is the direction (135deg, to right, to bottom). Following arguments are color stops. Gradients are used for hero sections, button fills, and decorative accents.',code:`/* Linear gradient */
.hero { background: linear-gradient(135deg, #667eea, #764ba2); }
.btn  { background: linear-gradient(to right, #2563eb, #7c3aed); }

/* With color stops */
.rainbow {
  background: linear-gradient(to right,
    #ef4444 0%,
    #f97316 20%,
    #eab308 40%,
    #22c55e 60%,
    #3b82f6 80%,
    #8b5cf6 100%
  );
}

/* Radial gradient */
.glow { background: radial-gradient(circle at center, #2563eb, #1e1b4b); }
.ellipse { background: radial-gradient(ellipse 80% 60% at center, #60a5fa, transparent); }

/* Conic gradient (pie chart effect) */
.pie { background: conic-gradient(#2563eb 0% 40%, #22c55e 40% 75%, #f59e0b 75% 100%); }

/* Repeating gradients */
.stripes { background: repeating-linear-gradient(45deg, #e5e7eb, #e5e7eb 10px, white 10px, white 20px); }`},
    {type:'heading',content:'Opacity and Transparency'},
    {type:'code',language:'css',content:'opacity applies to the entire element and all its children. rgba() applies transparency to just the color, not the element contents. Use rgba() for semi-transparent backgrounds. Use opacity for dimming an entire component including its text.',code:`/* opacity: affects entire element + children */
.dimmed { opacity: 0.5; }     /* 50% transparent - text, images, everything */

/* rgba/hsla: only affects that specific property */
.card { background: rgba(255,255,255,0.8); }  /* semi-transparent background */
.card { color: rgba(0,0,0,0.7); }             /* semi-transparent text */

/* backdrop-filter: blur behind element */
.glass-card {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.2);
}`},
    {type:'tryit',title:'Try It: Colors & Gradients',
     html:`<div class="page">
  <h1>CSS Colors Demo</h1>
  <div class="colors-row">
    <div class="swatch hex">#2563eb</div>
    <div class="swatch rgb">rgb(37,99,235)</div>
    <div class="swatch hsl">hsl(221,83%,53%)</div>
    <div class="swatch rgba">rgba 50%</div>
  </div>
  <div class="gradient-demo">Linear Gradient</div>
  <div class="radial-demo">Radial Gradient</div>
  <div class="glass-demo">
    <div class="glass-card">Glass morphism effect</div>
  </div>
</div>`,
     css:`body{font-family:system-ui,sans-serif;padding:20px;background:#f9fafb;}
h1{color:#1e1e1e;margin-bottom:16px;}
.colors-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;}
.swatch{padding:16px;border-radius:8px;color:white;font-size:12px;font-weight:600;text-align:center;min-width:100px;}
.hex{background:#2563eb;}
.rgb{background:rgb(37,99,235);opacity:.8;}
.hsl{background:hsl(221,83%,53%);}
.rgba{background:rgba(37,99,235,.5);color:#1e1e1e;}
.gradient-demo{background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:24px;border-radius:12px;font-weight:700;text-align:center;margin-bottom:12px;}
.radial-demo{background:radial-gradient(circle,#60a5fa,#1e1b4b);color:white;padding:24px;border-radius:12px;font-weight:700;text-align:center;margin-bottom:12px;}
.glass-demo{background:linear-gradient(135deg,#667eea,#764ba2);padding:32px;border-radius:12px;}
.glass-card{background:rgba(255,255,255,.15);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.3);padding:20px;border-radius:10px;color:white;font-weight:600;text-align:center;}`,
     mode:'html'},
  ],
  exercises:[{id:'col1',question:'Which color format supports transparency?',type:'multiple-choice',options:['#rrggbb','rgb()','rgba()','Named colors'],correct:2,explanation:'rgba() adds a 4th parameter (alpha, 0-1) for transparency. You can also use #rrggbbaa (8-digit hex) or hsla().'}],
  quiz:[{id:'cq1',question:'What does background-size: cover do?',options:['Shows the full image with gaps','Tiles the image','Scales image to fill container, cropping if needed','Hides overflow'],correct:2,explanation:'cover scales the background image to fill the entire element, maintaining aspect ratio. Parts of the image may be cropped if the ratios differ.'}],
};
