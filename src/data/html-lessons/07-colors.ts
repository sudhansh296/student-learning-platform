import type { HtmlLesson } from '../html-curriculum';

export const htmlColorsLesson: HtmlLesson = {
  id: 'html-colors',
  title: 'HTML Colors',
  slug: 'colors',
  chapter: 'text',
  order: 7,
  difficulty: 'beginner',
  readingTime: 8,
  description: 'Understand HTML color values - color names, hex codes, RGB, RGBA, HSL, and how to use them everywhere.',
  sections: [
    { type: 'text', content: 'Colors in HTML are specified using CSS. You can use color names, HEX codes, RGB values, RGBA (with transparency), or HSL. Colors can be applied to text, backgrounds, borders, shadows, and almost any visual element.' },
    { type: 'heading', content: 'Color Names' },
    { type: 'text', content: 'HTML supports 140+ named colors. They are easy to read but limited. Use them for learning and prototyping.' },
    { type: 'code', language: 'html',       content: 'CSS supports 140+ named colors like red, blue, coral, and tomato. They are easy to read but limited in range. For precise colors, use hex codes or RGB values. Named colors are great for quick prototyping and learning.',
      code: `<p style="color: red;">Red text</p>
<p style="color: blue;">Blue text</p>
<p style="color: tomato;">Tomato (a reddish color)</p>
<p style="color: steelblue;">Steel blue text</p>
<div style="background-color: lightgray; padding: 10px;">Light gray background</div>
<div style="background-color: coral; color: white; padding: 10px;">Coral with white text</div>` },
    { type: 'heading', content: 'HEX Color Codes' },
    { type: 'text', content: 'Hex codes start with # followed by 6 hex digits: #RRGGBB. Each pair controls the amount of Red, Green, Blue (0-255 = 00-FF). Hex is the most commonly used format in web development.' },
    { type: 'code', language: 'html',       content: 'Hex codes start with # followed by 6 characters: #RRGGBB. Each pair is the Red, Green, Blue value in hexadecimal (00=0, FF=255). #ff0000 is pure red, #000000 is black, #ffffff is white. Shorthand #RGB works when each pair repeats: #f00 = #ff0000.',
      code: `<!-- Hex format: #RRGGBB -->
<p style="color: #ff0000;">Red    - #ff0000 (max red, no green/blue)</p>
<p style="color: #00ff00;">Green  - #00ff00</p>
<p style="color: #0000ff;">Blue   - #0000ff</p>
<p style="color: #ffffff; background:#000">White  - #ffffff</p>
<p style="color: #000000;">Black  - #000000</p>
<p style="color: #2563eb;">Brand Blue - #2563eb</p>
<p style="color: #e5e7eb; background:#111">Light Gray - #e5e7eb</p>

<!-- Shorthand: if pairs repeat, use 3 digits -->
<p style="color: #f00;">Red shorthand - #f00 = #ff0000</p>
<p style="color: #0af;">Cyan shorthand - #0af = #00aaff</p>` },
    { type: 'heading', content: 'RGB and RGBA Colors' },
    { type: 'code', language: 'html',       content: 'RGB uses decimal numbers 0-255 for each channel. RGBA adds a fourth value (0-1) for transparency - rgba(0,0,0,0.5) is 50% transparent black. Use RGBA for overlays, hover effects, and subtle background tints.',
      code: `<!-- RGB: rgb(red, green, blue) - values 0-255 -->
<p style="color: rgb(255, 0, 0);">Red with RGB</p>
<p style="color: rgb(37, 99, 235);">Brand blue with RGB</p>
<p style="background: rgb(244, 244, 244); padding: 8px;">Light gray background</p>

<!-- RGBA: rgba(red, green, blue, alpha) - alpha = 0 (transparent) to 1 (opaque) -->
<p style="background: rgba(37,99,235, 0.1); color:#1d4ed8; padding:8px; border-radius:6px;">
  10% blue background - semi-transparent
</p>
<p style="background: rgba(0,0,0, 0.5); color: white; padding: 8px;">
  50% black overlay - useful for image overlays
</p>
<p style="color: rgba(0,0,0,0.4);">40% transparent black - good for subtle text</p>` },
    { type: 'heading', content: 'HSL Colors' },
    { type: 'text', content: 'HSL (Hue, Saturation, Lightness) is more intuitive for humans. Hue is the color wheel position (0-360). Saturation is how vivid (0% gray, 100% full color). Lightness is how light or dark (0% black, 100% white, 50% normal).' },
    { type: 'code', language: 'html',       content: 'HSL is the most human-friendly color format. Hue is the angle on the color wheel (0=red, 120=green, 240=blue). Saturation controls vividness (0%=grey). Lightness controls brightness (0%=black, 50%=normal, 100%=white). HSLA adds transparency.',
      code: `<!-- hsl(hue, saturation%, lightness%) -->
<p style="color: hsl(0, 100%, 50%);">Red - hue 0°</p>
<p style="color: hsl(120, 100%, 30%);">Dark Green - hue 120°</p>
<p style="color: hsl(240, 100%, 50%);">Blue - hue 240°</p>
<p style="color: hsl(221, 83%, 53%);">Brand blue - hsl version</p>

<!-- HSLA - with transparency -->
<p style="background: hsla(221, 83%, 53%, 0.1); padding:8px; border-radius:6px; color:#1d4ed8;">
  Blue at 10% opacity - great for hover states
</p>` },
    { type: 'tryit', title: 'Try It: Colors Everywhere',
      html: `<div class="demo">
  <h1>Color Showcase</h1>

  <h2>Text Colors</h2>
  <p class="red">Red text</p>
  <p class="blue">Blue text - hex #2563eb</p>
  <p class="gradient-text">Gradient text!</p>

  <h2>Background Colors</h2>
  <div class="box box1">Named color: tomato</div>
  <div class="box box2">Hex: #f0fdf4</div>
  <div class="box box3">RGBA: semi-transparent blue</div>

  <h2>Borders & Shadows</h2>
  <div class="fancy">Colored border + shadow</div>
</div>`,
      css: `body { font-family: system-ui,sans-serif; padding: 20px; background: #f9fafb; }
h1 { color: #1e1e1e; }
h2 { color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: .05em; margin: 16px 0 8px; }
.red   { color: #ef4444; font-weight: 600; }
.blue  { color: #2563eb; font-weight: 600; }
.gradient-text { background: linear-gradient(135deg,#2563eb,#7c3aed); -webkit-background-clip:text; -webkit-text-fill-color:transparent; font-weight:800; font-size:20px; }
.box { padding: 12px 16px; border-radius: 8px; margin: 6px 0; font-size: 14px; }
.box1 { background: tomato; color: white; }
.box2 { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; }
.box3 { background: rgba(37,99,235,0.1); border: 1px solid rgba(37,99,235,0.3); color: #1d4ed8; }
.fancy { background: white; border: 2px solid #7c3aed; border-radius: 12px; padding: 16px; box-shadow: 0 4px 20px rgba(124,58,237,.2); color: #7c3aed; font-weight: 600; }`,
      mode: 'html' },
  ],
  exercises: [
    { id: 'col1', question: 'What does the A in RGBA stand for?', type: 'multiple-choice', options: ['Adjustment', 'Alpha (opacity/transparency)', 'Accent', 'Appearance'], correct: 1, explanation: 'RGBA = Red, Green, Blue, Alpha. The Alpha channel controls transparency - 0 is fully transparent, 1 is fully opaque.' },
  ],
  quiz: [{ id: 'cq1', question: 'Which hex code represents pure white?', options: ['#000000', '#ffffff', '#ff0000', '#f0f0f0'], correct: 1, explanation: '#ffffff means maximum Red (ff), Green (ff), Blue (ff) - combining max of all three gives pure white.' }],
};
