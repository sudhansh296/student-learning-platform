import type { HtmlLesson } from '../html-curriculum';

export const htmlImagesLesson: HtmlLesson = {
  id: 'html-images',
  title: 'HTML Images',
  slug: 'images',
  chapter: 'images',
  order: 8,
  difficulty: 'beginner',
  readingTime: 10,
  description: 'Add and control images in HTML — src, alt, width, height, image maps, picture element, and best practices.',
  sections: [
    { type: 'text', content: 'Images make websites visually rich and engaging. HTML uses the <img> element to embed images. It is a self-closing empty element — it has no content and no closing tag. The two required attributes are src (source — where the image is) and alt (alternative text).' },
    { type: 'heading', content: 'The <img> Tag' },
    { type: 'code', language: 'html',       content: 'The img element embeds an image. src is the path to the image file — either a relative path to a file in your project or a full URL. alt is required — it describes the image for screen readers and displays as text if the image fails to load. Always write meaningful alt text.',
code: `<!-- Basic image syntax -->
<img src="image.jpg" alt="Description of image">

<!-- Image from your own website -->
<img src="images/logo.png" alt="WebDev Atlas Logo">

<!-- Image from the internet -->
<img src="https://placehold.co/400x200/2563eb/white?text=Sample+Image"
     alt="A sample placeholder image">

<!-- With width and height -->
<img src="photo.jpg" alt="A sunset photo" width="400" height="300">

<!-- Always use alt! These are wrong: -->
<!-- <img src="photo.jpg">                 ← no alt — accessibility fail -->
<!-- <img src="photo.jpg" alt="">          ← empty alt OK for decorative images ONLY -->` },
    { type: 'note', title: 'Always write descriptive alt text', content: 'The alt attribute is critical for accessibility — screen readers read it aloud for blind users. It also shows when the image fails to load. Search engines use it to understand your images. Never skip it.' },
    { type: 'heading', content: 'Image Dimensions' },
    { type: 'code', language: 'html',       content: 'Setting width and height prevents layout shift — the browser reserves space before the image loads. For responsive design, set max-width: 100% and height: auto in CSS so images scale down on small screens without overflowing.',
      code: `<!-- Set size in HTML attributes -->
<img src="photo.jpg" alt="Photo" width="800" height="400">

<!-- Or set size in CSS (preferred in modern development) -->
<img src="photo.jpg" alt="Photo" style="width: 100%; max-width: 600px; height: auto;">

<!-- Tip: Always specify width and height to prevent layout shift -->
<!-- The browser reserves space before image loads, preventing page jumping -->

<!-- Responsive image — fills container, maintains aspect ratio -->
<style>
  img { max-width: 100%; height: auto; display: block; }
</style>` },
    { type: 'heading', content: 'Image Formats — When to Use Which' },
    { type: 'table', headers: ['Format', 'Best For', 'Supports Transparency', 'Notes'], rows: [
      ['JPEG / JPG', 'Photos, complex images', 'No', 'Small file size, some quality loss (lossy)'],
      ['PNG', 'Logos, icons, screenshots', 'Yes', 'Larger files, lossless quality'],
      ['WebP', 'Everything — modern format', 'Yes', '25-34% smaller than PNG/JPEG, use this!'],
      ['SVG', 'Icons, logos, illustrations', 'Yes', 'Vector — scales infinitely without blur'],
      ['GIF', 'Simple animations', 'Partial', 'Limited colors, use video for complex animation'],
      ['AVIF', 'Photos (newest format)', 'Yes', 'Even smaller than WebP, great browser support now'],
    ]},
    { type: 'heading', content: 'Image as a Link' },
    { type: 'code', language: 'html',       content: 'Wrap an img inside an anchor element to make the image clickable. The alt text also serves as the accessible link label. This is the standard pattern for logo images that navigate to the homepage.',
      code: `<!-- Wrap <img> in <a> to make it clickable -->
<a href="https://webdevatlas.dev">
  <img src="logo.png" alt="WebDev Atlas — Click to visit homepage">
</a>

<!-- Image link opening in new tab -->
<a href="/portfolio/project1" target="_blank" rel="noopener noreferrer">
  <img src="project1-thumb.jpg" alt="Project 1 — E-commerce App" width="300">
</a>` },
    { type: 'heading', content: 'The <figure> and <figcaption> Elements' },
    { type: 'text', content: 'The <figure> element represents self-contained content like images, diagrams, or code. <figcaption> provides a caption for the figure. This is the semantic, accessible way to add image captions.' },
    { type: 'code', language: 'html',       content: 'The figure element is the semantic container for self-contained content like images and diagrams. figcaption provides an accessible caption that is associated with the image in the document structure. Always prefer figure+figcaption over a plain paragraph for image captions.',
      code: `<!-- Semantic image with caption -->
<figure>
  <img
    src="https://placehold.co/500x300/1e1e1e/white?text=JavaScript+Tutorial"
    alt="Screenshot of a JavaScript tutorial page"
    width="500"
    height="300"
  >
  <figcaption>
    Figure 1: The JavaScript tutorial page on WebDev Atlas
  </figcaption>
</figure>

<!-- Multiple images in one figure -->
<figure>
  <img src="before.jpg" alt="Website before redesign">
  <img src="after.jpg"  alt="Website after redesign">
  <figcaption>Before and after the 2026 redesign</figcaption>
</figure>` },
    { type: 'heading', content: 'The <picture> Element — Responsive Images' },
    { type: 'code', language: 'html',       content: 'The picture element lets the browser choose the best image source. source elements specify alternatives — WebP for modern browsers, JPEG as fallback. The media attribute lets you serve different images at different screen sizes. Always include a plain img as the final fallback.',
      code: `<!-- Serve different images based on screen size or format support -->
<picture>
  <!-- Modern browsers use WebP -->
  <source srcset="photo.webp" type="image/webp">
  <!-- Older browsers fall back to JPEG -->
  <source srcset="photo.jpg" type="image/jpeg">
  <!-- Always include <img> as final fallback -->
  <img src="photo.jpg" alt="A mountain landscape" width="800" height="500">
</picture>

<!-- Different image for mobile vs desktop -->
<picture>
  <source media="(max-width: 600px)" srcset="small.jpg">
  <source media="(min-width: 601px)" srcset="large.jpg">
  <img src="large.jpg" alt="Team photo">
</picture>` },
    { type: 'tryit', title: 'Try It: Images',
      html: `<h1>HTML Images Demo</h1>

<h2>Basic Image</h2>
<img
  src="https://placehold.co/400x200/2563eb/white?text=My+Image"
  alt="A blue placeholder image"
  width="400"
  height="200"
/>

<h2>Image as a Link</h2>
<a href="https://developer.mozilla.org" target="_blank" rel="noopener noreferrer">
  <img
    src="https://placehold.co/300x100/059669/white?text=Click+Me+→+MDN"
    alt="Click to visit MDN Web Docs"
    style="display:block"
  />
</a>

<h2>Figure with Caption</h2>
<figure>
  <img
    src="https://placehold.co/500x250/7c3aed/white?text=Code+Screenshot"
    alt="Code screenshot"
    width="500"
  />
  <figcaption>Figure 1: A code screenshot with a proper caption</figcaption>
</figure>`,
      css: `body { font-family: system-ui, sans-serif; padding: 20px; max-width: 600px; }
h1 { color: #1e1e1e; }
h2 { color: #2563eb; font-size: 16px; margin: 20px 0 8px; }
img { border-radius: 8px; display: block; max-width: 100%; }
figure { margin: 0; }
figcaption { font-size: 13px; color: #6b7280; margin-top: 6px; text-align: center; font-style: italic; }
a img:hover { opacity: 0.85; transition: opacity 0.2s; }`,
      mode: 'html' },
  ],
  exercises: [
    { id: 'img1', question: 'Which attribute on <img> is required for accessibility?', type: 'multiple-choice', options: ['src', 'alt', 'width', 'title'], correct: 1, explanation: 'alt (alternative text) is required for accessibility. Screen readers use it for blind users. It also shows when the image fails to load.' },
    { id: 'img2', question: 'What image format is best for modern web development (good quality, small file)?', type: 'multiple-choice', options: ['GIF', 'BMP', 'WebP', 'TIFF'], correct: 2, explanation: 'WebP is the modern standard — 25-34% smaller than JPEG/PNG with equivalent quality. It supports transparency (like PNG) and animations (like GIF).' },
  ],
  quiz: [{ id: 'iq1', question: 'Which HTML element wraps an image with a caption semantically?', options: ['<div>', '<image>', '<figure>', '<img-wrapper>'], correct: 2, explanation: '<figure> is the semantic container for self-contained content like images. Use <figcaption> inside it for captions.' }],
};
