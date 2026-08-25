import type { NextjsLesson } from '../nextjs-curriculum';

export const nextjsMetadataLesson: NextjsLesson = {
  id: 'nextjs-metadata',
  title: 'Metadata and SEO',
  slug: 'metadata',
  chapter: 'ui',
  order: 10,
  difficulty: 'beginner',
  readingTime: 9,
  description: 'Add metadata to pages for SEO - static metadata object, dynamic generateMetadata function, Open Graph, Twitter cards, and favicon.',
  sections: [
    {
      type: 'text',
      content: 'Next.js provides a Metadata API for adding SEO metadata to pages. Export a metadata object from any page.tsx or layout.tsx for static metadata, or use the generateMetadata async function for dynamic metadata based on route params or fetched data. Metadata is server-rendered and never requires client JavaScript.',
    },
    {
      type: 'heading',
      content: 'Static Metadata',
    },
    {
      type: 'example',
      title: 'Static metadata export',
      content: 'Export a metadata constant from page.tsx or layout.tsx to set the page title, description, and other SEO fields. The root layout metadata serves as defaults and the template field allows child pages to include a suffix automatically.',
      language: 'typescript',
      code: `// app/layout.tsx - root metadata (affects all pages)
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'My App',          // Used when page has no title
    template: '%s | My App',    // %s replaced with page title
    // e.g. "About Us | My App"
  },
  description: 'The best web application for developers',
  metadataBase: new URL('https://myapp.com'), // Required for absolute OG URLs
  keywords: ['nextjs', 'react', 'web development'],
  authors: [{ name: 'Your Name', url: 'https://yoursite.com' }],
  creator: 'Your Name',
  robots: {
    index: true,
    follow: true,
  },
};

// app/about/page.tsx - page-level metadata
export const metadata: Metadata = {
  title: 'About Us',  // Becomes "About Us | My App" from template
  description: 'Learn about our team and mission',
};

export default function AboutPage() {
  return <h1>About</h1>;
}`,
    },
    {
      type: 'heading',
      content: 'Dynamic Metadata',
    },
    {
      type: 'example',
      title: 'generateMetadata - dynamic metadata from params',
      content: 'For pages where the title and description depend on the content (like a blog post page), use the async generateMetadata function. It receives the same params and searchParams as the page component and can fetch data to build the metadata.',
      language: 'typescript',
      code: `// app/blog/[slug]/page.tsx
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

// Runs on the server - can fetch data
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const post = await fetch('https://api.example.com/posts/' + slug)
    .then(r => r.json());

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.coverImage, width: 1200, height: 630 }],
      publishedTime: post.publishedAt,
      type: 'article',
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await fetch('https://api.example.com/posts/' + slug).then(r => r.json());
  return <article><h1>{post.title}</h1></article>;
}`,
    },
    {
      type: 'example',
      title: 'Open Graph and Twitter Card metadata',
      content: 'Open Graph metadata controls how your pages appear when shared on social media. Twitter Cards customize the appearance on Twitter/X. Both use specific image dimensions - 1200x630 is the standard Open Graph image size.',
      language: 'typescript',
      code: `// app/page.tsx - full social sharing metadata

export const metadata: Metadata = {
  title: 'My App - Build Better Web Apps',
  description: 'The complete platform for modern web development',
  metadataBase: new URL('https://myapp.com'),

  // Open Graph - Facebook, LinkedIn, WhatsApp, Slack
  openGraph: {
    title: 'My App - Build Better Web Apps',
    description: 'The complete platform for modern web development',
    url: 'https://myapp.com',
    siteName: 'My App',
    images: [
      {
        url: '/og-image.png',   // resolves to https://myapp.com/og-image.png
        width: 1200,
        height: 630,
        alt: 'My App preview image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  // Twitter / X Cards
  twitter: {
    card: 'summary_large_image',
    title: 'My App - Build Better Web Apps',
    description: 'The complete platform for modern web development',
    images: ['/og-image.png'],
    creator: '@yourtwitterhandle',
  },
};`,
    },
    {
      type: 'example',
      title: 'Robots.txt and sitemap',
      content: 'Next.js can auto-generate robots.txt and sitemap.xml files from special files in the app directory. These are important for SEO and search engine crawling.',
      language: 'typescript',
      code: `// app/robots.ts - generates /robots.txt
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: 'https://myapp.com/sitemap.xml',
  };
}

// app/sitemap.ts - generates /sitemap.xml
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await fetch('https://api.example.com/posts')
    .then(r => r.json());

  const postUrls = posts.map((post: { slug: string; updatedAt: string }) => ({
    url: 'https://myapp.com/blog/' + post.slug,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    { url: 'https://myapp.com', lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: 'https://myapp.com/about', lastModified: new Date(), priority: 0.5 },
    ...postUrls,
  ];
}`,
    },
    {
      type: 'tryit',
      title: 'Metadata Output Preview',
      css: `body{font-family:system-ui,sans-serif;padding:14px;margin:0;background:#f5f5f5;}
.preview{background:#fff;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;margin-bottom:12px;}
.browser-bar{background:#f3f4f6;padding:8px 12px;display:flex;align-items:center;gap:8px;border-bottom:1px solid #e5e7eb;}
.browser-dot{width:8px;height:8px;border-radius:50%;}
.tab-bar{background:#e5e7eb;padding:4px 8px;font-size:11px;font-family:monospace;display:flex;align-items:center;gap:6px;}
.og-card{border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;max-width:400px;margin:12px auto;}
.og-image{background:linear-gradient(135deg,#000 0%,#333 100%);height:80px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:22px;}
.og-body{padding:10px;}
.og-title{font-weight:bold;font-size:13px;margin-bottom:4px;}
.og-desc{font-size:11px;color:#666;}
.og-url{font-size:10px;color:#999;margin-top:4px;}
.code-box{background:#0d1117;color:#e6edf3;border-radius:8px;padding:12px;font-family:monospace;font-size:11px;line-height:1.7;}
.highlight{color:#79c0ff;}`,
      js: `const pages = {
  home: {
    title: 'My App - Build Better Web Apps',
    desc: 'The complete platform for modern web development',
    url: 'myapp.com',
    og: 'My App - Build Better Web Apps'
  },
  blog: {
    title: 'How to use Next.js | My App',
    desc: 'A complete guide to building apps with Next.js App Router',
    url: 'myapp.com/blog/nextjs-guide',
    og: 'How to use Next.js'
  },
  about: {
    title: 'About Us | My App',
    desc: 'Learn about our team and mission',
    url: 'myapp.com/about',
    og: 'About Us'
  }
};

function render(key) {
  const p = pages[key];
  document.querySelectorAll('.page-btn').forEach(b => {
    b.style.background = b.dataset.page === key ? '#000' : '#f3f4f6';
    b.style.color = b.dataset.page === key ? '#fff' : '#333';
  });
  document.getElementById('browser-title').textContent = p.title;
  document.getElementById('og-title').textContent = p.og;
  document.getElementById('og-desc').textContent = p.desc;
  document.getElementById('og-url').textContent = p.url;
  document.getElementById('meta-html').textContent =
    '<title>' + p.title + '</title> ' +
    '<meta name="description"   content="' + p.desc + '" /> ' +
    '<meta property="og:title"   content="' + p.og + '" /> ' +
    '<meta property="og:description"   content="' + p.desc + '" /> ' +
    '<meta property="og:url"   content="https://' + p.url + '" /> ' +
    '<meta name="twitter:card"   content="summary_large_image" />';
  console.log('Page:', key, '| Title:', p.title);
}

document.getElementById('output').innerHTML =
  '<div style="display:flex;gap:8px;margin-bottom:10px;">' +
  Object.keys(pages).map(k =>
    '<button class="page-btn" data-page="' + k + '" style="border:none;border-radius:6px;padding:6px 14px;font-size:12px;cursor:pointer;background:#f3f4f6;">' + k + '</button>'
  ).join('') +
  '</div>' +
  '<div class="preview">' +
  '<div class="browser-bar"><div class="browser-dot" style="background:#ff5f57"></div><div class="browser-dot" style="background:#ffbd2e"></div><div class="browser-dot" style="background:#28c840"></div></div>' +
  '<div class="tab-bar"><span id="browser-title" style="font-size:12px"></span></div>' +
  '</div>' +
  '<p style="font-size:12px;font-weight:bold;margin:8px 0 4px;">Social Share Preview:</p>' +
  '<div class="og-card"><div class="og-image">App</div><div class="og-body"><div class="og-title" id="og-title"></div><div class="og-desc" id="og-desc"></div><div class="og-url" id="og-url"></div></div></div>' +
  '<p style="font-size:12px;font-weight:bold;margin:8px 0 4px;">Generated HTML (in &lt;head&gt;):</p>' +
  '<div class="code-box"><pre id="meta-html"></pre></div>';

document.querySelectorAll('.page-btn').forEach(function(btn) {
  btn.addEventListener('click', function() { render(btn.getAttribute('data-page')); });
});

render('home');`,
    },
  ],
  exercises: [
    {
      id: 'nextjs-meta-1',
      question: 'How do you set a title template like "About Us | My App" for all pages?',
      type: 'multiple-choice',
      options: [
        'Set title: "About Us | My App" on every page manually',
        'Use the title.template field in the root layout: { default: "My App", template: "%s | My App" }',
        'Use a useTitle() hook in the root layout',
        'Configure title templates in next.config.ts',
      ],
      correct: 1,
      explanation: 'The title object in the root layout metadata supports a template field using "%s" as a placeholder. When a child page sets its title to "About Us", Next.js replaces "%s" with that value and produces "About Us | My App" automatically.',
    },
    {
      id: 'nextjs-meta-2',
      question: 'Which function allows you to generate metadata dynamically based on route params?',
      type: 'multiple-choice',
      options: [
        'getServerSideProps',
        'generateMetadata (async function)',
        'useMeta() hook',
        'createMetadata()',
      ],
      correct: 1,
      explanation: 'The generateMetadata async function runs on the server and receives the same params as the page component. This allows you to fetch post data and use the post title and image in the metadata - perfect for blog posts, product pages, etc.',
    },
  ],
  quiz: [
    {
      id: 'nextjs-meta-q1',
      question: 'What is metadataBase used for in Next.js metadata?',
      options: [
        'To set the base path for all routes in the app',
        'To resolve relative URLs to absolute URLs in Open Graph and other metadata fields',
        'To configure the CDN base URL for static assets',
        'To set the canonical URL for the homepage',
      ],
      correct: 1,
      explanation: 'metadataBase tells Next.js the base URL to use when resolving relative URLs in metadata fields like og:image. Without it, a relative URL like "/og-image.png" would stay relative. With metadataBase set to "https://myapp.com", it becomes "https://myapp.com/og-image.png" in the output.',
    },
  ],
};
