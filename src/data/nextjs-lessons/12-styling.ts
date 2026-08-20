import type { NextjsLesson } from '../nextjs-curriculum';

export const nextjsStylingLesson: NextjsLesson = {
  id: 'nextjs-styling',
  title: 'Styling in Next.js',
  slug: 'styling',
  chapter: 'ui',
  order: 12,
  difficulty: 'beginner',
  readingTime: 9,
  description: 'Style your Next.js app with CSS Modules, global CSS, Tailwind CSS, and other approaches.',
  sections: [
    {
      type: 'text',
      content: 'Next.js supports multiple styling approaches out of the box. CSS Modules scope styles to components by default, preventing class name conflicts. Global CSS applies app-wide styles. Tailwind CSS is the most popular choice and is pre-configured when you use create-next-app. All approaches work with both Server and Client Components.',
    },
    {
      type: 'heading',
      content: 'CSS Modules',
    },
    {
      type: 'example',
      title: 'CSS Modules - scoped component styles',
      content: 'CSS Modules are CSS files with .module.css extension. Next.js automatically scopes all class names to the importing component - so a .button class in Button.module.css becomes something like .button_abc123 in production, preventing conflicts with other components that also have .button styles.',
      language: 'typescript',
      code: `// components/Button.module.css
.button {
  background: #000;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.button:hover {
  background: #333;
}

.primary { background: #2563eb; }
.danger  { background: #dc2626; }

/* Composed styles */
.primaryButton {
  composes: button;  /* inherits .button styles */
  background: #2563eb;
}

// components/Button.tsx
import styles from './Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'danger' | 'default';
}

export function Button({ children, variant = 'default' }: ButtonProps) {
  return (
    <button className={
      variant === 'primary' ? styles.primary
      : variant === 'danger' ? styles.danger
      : styles.button
    }>
      {children}
    </button>
  );
}`,
    },
    {
      type: 'heading',
      content: 'Global Styles',
    },
    {
      type: 'example',
      title: 'Global CSS in the root layout',
      content: 'Import global CSS files only in app/layout.tsx. These styles apply to every page in the application. Use global CSS for CSS resets, custom properties (CSS variables), and styles that must apply everywhere.',
      language: 'typescript',
      code: `// app/globals.css
/* CSS Reset */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Design tokens as CSS variables */
:root {
  --color-primary: #000000;
  --color-bg: #ffffff;
  --color-text: #111827;
  --font-sans: system-ui, -apple-system, sans-serif;
  --radius-md: 8px;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #0a0a0a;
    --color-text: #ededed;
  }
}

body {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
  line-height: 1.6;
}

// app/layout.tsx - import global CSS here only
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`,
    },
    {
      type: 'example',
      title: 'Tailwind CSS - utility-first styling',
      content: 'Tailwind CSS is pre-configured when you create a Next.js app. Apply styles directly with utility classes in JSX. The Tailwind compiler only includes classes you actually use, so production CSS is tiny. Dark mode works with the dark: prefix.',
      language: 'typescript',
      code: `// Tailwind is configured in tailwind.config.ts
// Apply utility classes directly in JSX

export function Card({ title, description }: { title: string; description: string }) {
  return (
    <div className="
      bg-white dark:bg-gray-900
      border border-gray-200 dark:border-gray-800
      rounded-xl
      p-6
      shadow-sm hover:shadow-md
      transition-shadow duration-200
    ">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
        {description}
      </p>
      <button className="
        mt-4 px-4 py-2 rounded-lg
        bg-black text-white text-sm font-medium
        hover:bg-gray-800
        transition-colors
      ">
        Learn More
      </button>
    </div>
  );
}

// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class', // or 'media'
  theme: {
    extend: {
      colors: {
        brand: '#000000',
      },
    },
  },
};

export default config;`,
    },
    {
      type: 'example',
      title: 'CSS-in-JS with styled-jsx',
      content: 'styled-jsx is built into Next.js. Add a style jsx tag inside your component to write scoped CSS directly in your JSX file. The styles are automatically scoped to the component. This is convenient for styles that depend on JavaScript variables.',
      language: 'typescript',
      code: `// styled-jsx - built into Next.js, no extra packages
// NOTE: styled-jsx requires "use client" in the App Router

'use client';

export function StyledButton({ color = '#000', children }: { color?: string; children: React.ReactNode }) {
  return (
    <>
      <button className="btn">{children}</button>

      {/* jsx attribute enables styled-jsx scoping */}
      <style jsx>{
        '.btn { ' +
        '  background: ' + color + '; ' +
        '  color: white; ' +
        '  padding: 8px 16px; ' +
        '  border: none; ' +
        '  border-radius: 6px; ' +
        '  cursor: pointer; ' +
        '  font-weight: bold; ' +
        '} ' +
        '.btn:hover { opacity: 0.85; }'
      }</style>
    </>
  );
}

// For most projects, prefer CSS Modules or Tailwind.
// styled-jsx works best for simple per-component dynamic styles.`,
    },
    {
      type: 'tryit',
      title: 'CSS Approaches Live Demo',
      css: `body{font-family:system-ui,sans-serif;padding:14px;margin:0;background:#f5f5f5;}
.demo-area{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:16px;margin-bottom:12px;}
h3{margin:0 0 12px;font-size:14px;}
/* CSS Modules simulation */
.module-btn{background:#000;color:#fff;padding:8px 16px;border-radius:6px;border:none;cursor:pointer;margin-right:8px;margin-bottom:8px;}
.module-btn-primary{background:#2563eb;color:#fff;padding:8px 16px;border-radius:6px;border:none;cursor:pointer;margin-right:8px;margin-bottom:8px;}
.module-btn-danger{background:#dc2626;color:#fff;padding:8px 16px;border-radius:6px;border:none;cursor:pointer;margin-right:8px;margin-bottom:8px;}
/* Tailwind simulation */
.tw-card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;max-width:280px;margin-bottom:8px;}
.tw-title{font-size:16px;font-weight:700;color:#0f172a;margin-bottom:4px;}
.tw-desc{font-size:13px;color:#64748b;line-height:1.5;}
.tw-btn{margin-top:10px;background:#0f172a;color:#fff;border:none;border-radius:8px;padding:8px 16px;font-size:13px;cursor:pointer;}
.tw-btn:hover{background:#1e293b;}
.tab-row{display:flex;gap:8px;margin-bottom:12px;}
.tab{background:#f3f4f6;border:none;border-radius:6px;padding:6px 14px;font-size:12px;cursor:pointer;}
.tab.active{background:#000;color:#fff;}`,
      js: `const approaches = {
  modules: {
    label: 'CSS Modules',
    html: '<div class="demo-area"><h3>CSS Modules - Scoped Styles</h3>' +
      '<button class="module-btn">Default</button>' +
      '<button class="module-btn-primary">Primary</button>' +
      '<button class="module-btn-danger">Danger</button>' +
      '<p style="font-size:12px;color:#666;margin-top:8px;">Each class is scoped to the component - no global conflicts</p></div>'
  },
  tailwind: {
    label: 'Tailwind CSS',
    html: '<div class="demo-area"><h3>Tailwind CSS - Utility Classes</h3>' +
      '<div class="tw-card">' +
      '<div class="tw-title">Next.js + Tailwind</div>' +
      '<div class="tw-desc">Style with utility classes directly in JSX. No separate CSS files needed.</div>' +
      '<button class="tw-btn">Learn More</button></div></div>'
  },
  global: {
    label: 'Global CSS',
    html: '<div class="demo-area"><h3>Global CSS - App-Wide Styles</h3>' +
      '<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px;font-family:monospace;font-size:12px;line-height:1.7">' +
      ':root {<br>' +
      '&nbsp;&nbsp;--primary: #000000;<br>' +
      '&nbsp;&nbsp;--bg: #ffffff;<br>' +
      '}<br><br>' +
      'body { color: var(--primary); }<br>' +
      '<span style="color:#666">/* Applied globally via app/layout.tsx */</span>' +
      '</div></div>'
  }
};

let active = 'modules';

window.switchTab = function(key) {
  active = key;
  document.querySelectorAll('.tab').forEach(t => {
    t.className = 'tab' + (t.dataset.tab === key ? ' active' : '');
  });
  document.getElementById('approach-content').innerHTML = approaches[key].html;
  console.log('Switched to:', approaches[key].label);
};

document.getElementById('output').innerHTML =
  '<div class="tab-row">' +
  Object.keys(approaches).map(k =>
    '<button class="tab' + (k === 'modules' ? ' active' : '') + '" data-tab="' + k + '" onclick="switchTab(\'' + k + '\')">' + approaches[k].label + '</button>'
  ).join('') +
  '</div>' +
  '<div id="approach-content"></div>';

switchTab('modules');`,
    },
  ],
  exercises: [
    {
      id: 'nextjs-style-1',
      question: 'What is the main benefit of CSS Modules over plain CSS files?',
      type: 'multiple-choice',
      options: [
        'CSS Modules are processed faster during the build',
        'CSS Modules automatically scope class names to avoid conflicts between components',
        'CSS Modules support more CSS features than regular CSS',
        'CSS Modules are required by Next.js for all styling',
      ],
      correct: 1,
      explanation: 'CSS Modules transform class names like .button into unique identifiers like .button_xyz123 that are scoped to the component that imports the file. This means two components can both have a .button class without one overriding the other.',
    },
    {
      id: 'nextjs-style-2',
      question: 'Where should you import global CSS files in a Next.js App Router project?',
      type: 'multiple-choice',
      options: [
        'In every page.tsx file that needs the styles',
        'In any component file',
        'Only in app/layout.tsx (the root layout)',
        'In next.config.ts',
      ],
      correct: 2,
      explanation: 'Global CSS files can only be imported in app/layout.tsx in the App Router. Importing them in other components would cause errors because Next.js only allows global CSS imports in layout files to prevent style ordering issues.',
    },
  ],
  quiz: [
    {
      id: 'nextjs-style-q1',
      question: 'How does Tailwind CSS keep production CSS bundle sizes small?',
      options: [
        'It minifies all CSS automatically',
        'It only generates CSS for the classes you actually use in your code',
        'It uses CSS variables instead of generating class styles',
        'It lazy loads CSS files per route',
      ],
      correct: 1,
      explanation: 'Tailwind scans your source files at build time and only includes CSS for the utility classes that appear in your code. If you never use "bg-purple-700", that class is not included in the final CSS. This tree-shaking typically produces CSS bundles of just a few kilobytes.',
    },
  ],
};
