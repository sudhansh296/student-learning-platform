import type { NextjsLesson } from '../nextjs-curriculum';

export const nextjsImageLesson: NextjsLesson = {
  id: 'nextjs-image',
  title: 'Image Optimization',
  slug: 'image-optimization',
  chapter: 'ui',
  order: 11,
  difficulty: 'beginner',
  readingTime: 8,
  description: 'The next/image component automatically optimizes images - WebP conversion, lazy loading, responsive sizing, and preventing layout shift.',
  sections: [
    {
      type: 'text',
      content: 'The next/image component is a drop-in replacement for the HTML img tag that adds automatic image optimization. It converts images to WebP or AVIF format, serves the right size for each device, lazy loads images by default, and reserves space to prevent Cumulative Layout Shift (CLS). All of this happens with zero configuration.',
    },
    {
      type: 'heading',
      content: 'Image Component vs HTML img',
    },
    {
      type: 'example',
      title: 'next/image vs plain HTML img tag',
      content: 'The HTML img tag sends the full original image to every device. next/image generates multiple optimized sizes, picks the right one for each browser, converts to WebP, and lazy loads by default. The required width and height props prevent layout shift.',
      language: 'typescript',
      code: `// [X] Plain HTML img - no optimization
<img
  src="/hero.jpg"
  alt="Hero image"
  // Sends full 5MB JPEG to every device
  // No lazy loading
  // Layout shift while loading
/>

// [OK] next/image - fully optimized
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}    // Required - prevents layout shift
  height={600}    // Required - preserves aspect ratio
  // Automatically:
  // - Converts to WebP (smaller file size)
  // - Serves 300px version to mobile, 1200px to desktop
  // - Lazy loads (only loads when entering viewport)
  // - Prevents layout shift with reserved space
/>

// Images from the public/ folder
<Image src="/logo.png" alt="Logo" width={100} height={40} />

// Remote images (must configure in next.config.ts)
<Image
  src="https://images.unsplash.com/photo-xyz"
  alt="Photo"
  width={800}
  height={500}
/>`,
    },
    {
      type: 'heading',
      content: 'Fill Layout for Full-Container Images',
    },
    {
      type: 'example',
      title: 'fill prop - image fills its parent container',
      content: 'Use the fill prop when you want the image to fill its parent container. The parent must have position: relative and a defined size. This is useful for hero sections, cards with image backgrounds, and gallery layouts.',
      language: 'typescript',
      code: `import Image from 'next/image';

// Hero section with fill image
export function HeroSection() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '400px' }}>
      <Image
        src="/hero.jpg"
        alt="Hero background"
        fill
        style={{ objectFit: 'cover' }}  // Cover the container
        // style={{ objectFit: 'contain' }} // Fit inside container
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1>Hero Content</h1>
      </div>
    </div>
  );
}

// Product card with fixed-ratio image
export function ProductCard({ product }: { product: { name: string; image: string } }) {
  return (
    <div style={{ width: '300px' }}>
      <div style={{ position: 'relative', aspectRatio: '16/9' }}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          style={{ objectFit: 'cover', borderRadius: '8px' }}
        />
      </div>
      <h2>{product.name}</h2>
    </div>
  );
}`,
    },
    {
      type: 'example',
      title: 'Configuring remote image domains',
      content: 'For security, Next.js requires you to explicitly allow remote image domains in next.config.ts. Without this configuration, remote images will fail to load. Use the remotePatterns option for fine-grained control.',
      language: 'typescript',
      code: `// next.config.ts - allow specific remote image sources
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        // Optional: restrict to specific paths
        pathname: '/photo-**',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
        // ** wildcard matches any subdomain
      },
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        port: '',
        pathname: '/my-bucket/**',
      },
    ],
  },
};

export default nextConfig;

// Usage after configuring:
<Image
  src="https://images.unsplash.com/photo-xyz?w=800"
  alt="Unsplash photo"
  width={800}
  height={600}
/>`,
    },
    {
      type: 'example',
      title: 'priority prop for above-the-fold images',
      content: 'By default, next/image lazy loads all images. For images visible immediately when the page loads (like hero images), use the priority prop to preload them. This improves Largest Contentful Paint (LCP) - a Core Web Vital metric.',
      language: 'typescript',
      code: `import Image from 'next/image';

// Hero image - visible immediately, must load fast
// Add priority to preload and avoid LCP issues
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority  // Preloads in <head>, not lazy loaded
  // Without priority: image is lazy loaded -> poor LCP score
  // With priority: image preloaded -> good LCP score
/>

// Below-the-fold images - lazy load (default)
<Image
  src="/feature.jpg"
  alt="Feature"
  width={600}
  height={400}
  // No priority - lazy loaded when entering viewport
/>

// Responsive sizes for art-directed layouts
<Image
  src="/banner.jpg"
  alt="Banner"
  width={1200}
  height={300}
  priority
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
  // sizes tells the browser what actual display size to expect
  // so it downloads the appropriate image size
/>`,
    },
    {
      type: 'tryit',
      title: 'Image Optimization Concept',
      css: `body{font-family:system-ui,sans-serif;padding:14px;margin:0;background:#f5f5f5;}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;}
.card{background:#fff;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;}
.card-header{background:#f3f4f6;padding:8px 12px;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #e5e7eb;}
.card-header.bad{color:#dc2626;background:#fef2f2;}
.card-header.good{color:#16a34a;background:#f0fdf4;}
.img-placeholder{height:120px;display:flex;align-items:center;justify-content:center;font-size:40px;background:#e5e7eb;}
.card-body{padding:10px;font-size:12px;color:#555;}
.stat{display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid #f3f4f6;font-size:11px;}
.stat-val{font-weight:bold;}
.bad-val{color:#dc2626;} .good-val{color:#16a34a;}
.btn{background:#000;color:#fff;border:none;border-radius:6px;padding:7px 14px;font-size:12px;cursor:pointer;display:block;width:100%;margin-top:10px;}
.progress-bar{height:8px;border-radius:4px;background:#e5e7eb;margin-top:4px;overflow:hidden;}
.progress-fill{height:100%;border-radius:4px;transition:width 0.5s;}`,
      js: `const scenarios = {
  bad: { size: '4.2 MB', format: 'JPEG (original)', width: '4000px (original)', lazy: 'No (loads immediately)', lcp: '3.8s', score: 45 },
  good: { size: '82 KB', format: 'WebP (auto-converted)', width: '800px (for 800px display)', lazy: 'Yes (enters viewport)', lcp: '0.9s', score: 98 }
};

function showComparison() {
  const rows = [
    ['File Size', 'bad', 'size'],
    ['Format', 'bad', 'format'],
    ['Width Served', 'bad', 'width'],
    ['Lazy Loading', 'bad', 'lazy'],
    ['LCP Score', 'bad', 'lcp']
  ];

  document.getElementById('output').innerHTML =
    '<div class="grid">' +
    ['bad', 'good'].map(type => {
      const s = scenarios[type];
      return '<div class="card">' +
        '<div class="card-header ' + type + '">' + (type === 'bad' ? '[X] Plain img tag' : '[OK] next/image') + '</div>' +
        '<div class="img-placeholder">' + (type === 'bad' ? '️' : '*') + '</div>' +
        '<div class="card-body">' +
        '<div class="stat"><span>File size</span><span class="stat-val ' + type + '-val">' + s.size + '</span></div>' +
        '<div class="stat"><span>Format</span><span class="stat-val">' + s.format + '</span></div>' +
        '<div class="stat"><span>Width served</span><span class="stat-val">' + s.width + '</span></div>' +
        '<div class="stat"><span>Lazy loaded</span><span class="stat-val">' + s.lazy + '</span></div>' +
        '<div class="stat"><span>LCP time</span><span class="stat-val ' + type + '-val">' + s.lcp + '</span></div>' +
        '<div style="margin-top:8px;font-size:11px;">Performance Score: <strong>' + s.score + '/100</strong></div>' +
        '<div class="progress-bar"><div class="progress-fill" style="width:' + s.score + '%;background:' + (type === 'bad' ? '#dc2626' : '#16a34a') + '"></div></div>' +
        '</div></div>';
    }).join('') +
    '</div>';

  console.log('next/image saves ~98% of bandwidth compared to plain img');
  console.log('LCP improvement: 3.8s -> 0.9s (4x faster)');
}

showComparison();`,
    },
  ],
  exercises: [
    {
      id: 'nextjs-img-1',
      question: 'Why does next/image require width and height props?',
      type: 'multiple-choice',
      options: [
        'To limit the maximum size of downloaded images',
        'To prevent Cumulative Layout Shift by reserving space before the image loads',
        'To specify which size to download from the CDN',
        'TypeScript requires them for type safety',
      ],
      correct: 1,
      explanation: 'The width and height props tell the browser the aspect ratio of the image before it loads. This allows the browser to reserve the correct amount of space, preventing content from jumping around (Cumulative Layout Shift) when the image finally loads.',
    },
    {
      id: 'nextjs-img-2',
      question: 'When should you use the priority prop on next/image?',
      type: 'multiple-choice',
      options: [
        'For all images to ensure the fastest loading',
        'Only for images in the public/ folder',
        'For images that are visible immediately when the page loads (above the fold)',
        'Only for images larger than 1MB',
      ],
      correct: 2,
      explanation: 'The priority prop should be used for images that are visible without scrolling - hero images, header images, and above-the-fold content. These images affect the Largest Contentful Paint (LCP) metric, so preloading them improves Core Web Vitals scores.',
    },
  ],
  quiz: [
    {
      id: 'nextjs-img-q1',
      question: 'What format does next/image automatically convert images to by default?',
      options: [
        'PNG - for lossless compression',
        'SVG - for scalable vector images',
        'WebP or AVIF - for smaller file sizes with the same visual quality',
        'JPEG - for broad browser compatibility',
      ],
      correct: 2,
      explanation: 'next/image automatically converts images to WebP (and AVIF in newer browsers) when the browser supports it. WebP images are typically 25-35% smaller than equivalent JPEGs, and AVIF is even smaller. This happens automatically with no configuration.',
    },
  ],
};
