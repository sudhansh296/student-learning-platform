import { InterviewQuestion } from '@/lib/interview-types';

export const frontendInterviewQuestions: InterviewQuestion[] = [
  {
    id: 'fe-browser-render',
    category: 'frontend',
    type: 'theory',
    question: 'What happens when you type a URL in the browser and press Enter?',
    difficulty: 'intermediate',
    tags: ['browser', 'dns', 'http', 'rendering'],
    shortAnswer: 'DNS lookup â†’ TCP connection â†’ TLS handshake â†’ HTTP request â†’ server response â†’ HTML parsing â†’ CSS/JS download â†’ DOM+CSSOM â†’ Render Tree â†’ Layout â†’ Paint â†’ Composite.',
    detailedExplanation: 'Full request lifecycle: 1) DNS resolution turns domain into IP. 2) TCP 3-way handshake. 3) TLS handshake (HTTPS). 4) HTTP GET request sent. 5) Server responds with HTML. 6) Browser parses HTML, builds DOM. 7) Finds CSS/JS links, fetches them. 8) Builds CSSOM from CSS. 9) Combines DOM + CSSOM into Render Tree. 10) Layout calculates positions/sizes. 11) Paint draws pixels. 12) Composite assembles layers. JavaScript execution can block parsing.',
    example: {
      code: `// Performance optimization based on this flow:

// 1. Reduce DNS lookups (use fewer domains)
// Preconnect to important origins
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://api.myapp.com">

// 2. Reduce TCP/TLS round trips - use HTTP/2 (multiplexing)

// 3. Reduce server response time (caching, CDN)

// 4. HTML parsing - scripts block by default!
// âŒ Blocks HTML parsing
<script src="big-bundle.js"></script>

// âœ… Defer - downloads in parallel, runs after HTML parsed
<script defer src="app.js"></script>

// âœ… Async - downloads in parallel, runs immediately when ready
<script async src="analytics.js"></script>

// 5. CSS blocks rendering (render-blocking)
// Put CSS in <head> so browser knows styles before painting
// Minify CSS, remove unused CSS

// 6. Reduce Layout/Reflow triggers
// Layout is expensive - changing width, height, position triggers it
// âŒ Causes layout thrashing (read-write-read-write)
for (let i = 0; i < 100; i++) {
  el.style.left = el.offsetLeft + 10 + 'px'; // Read, then write = reflow each time
}

// âœ… Batch reads, then writes
const left = el.offsetLeft; // Read once
for (let i = 0; i < 100; i++) {
  el.style.left = (left + i * 10) + 'px'; // Only write
}

// 7. Use CSS transforms (GPU-accelerated, no layout)
// âŒ Triggers layout
el.style.left = '100px';
// âœ… GPU-composited, no layout
el.style.transform = 'translateX(100px)';`,
      language: 'html'
    },
    interviewAnswer: 'This question tests your understanding of the full web stack. Starting from DNS to the browser paint pipeline. Key points I focus on: defer/async for scripts (don\'t block HTML parsing), put CSS in head (avoid FOUC), use transforms over positional properties for animation (GPU compositing bypasses layout). Understanding this flow explains why performance tools like Lighthouse flag render-blocking resources.',
    commonMistakes: [
      'Not knowing DNS resolution steps',
      'Not understanding why scripts block parsing',
      'Confusing async and defer script loading',
      'Not knowing that CSS blocks rendering'
    ],
    realWorldUse: 'Every frontend performance optimization traces back to this pipeline. PageSpeed Insights, Lighthouse, WebPageTest all measure these phases. Understanding it helps debug slow loading pages.',
    followUpQuestions: [
      'What is the critical rendering path?',
      'What is the difference between async and defer?',
      'What causes layout reflow?'
    ]
  },

  {
    id: 'fe-core-web-vitals',
    category: 'frontend',
    type: 'theory',
    question: 'What are Core Web Vitals and why do they matter?',
    difficulty: 'intermediate',
    tags: ['performance', 'core-web-vitals', 'seo'],
    shortAnswer: 'Core Web Vitals are Google\'s user experience metrics: LCP (loading - <2.5s), INP (interactivity - <200ms), CLS (visual stability - <0.1). They affect SEO rankings and user experience.',
    detailedExplanation: 'Core Web Vitals are the subset of Web Vitals Google considers most important. LCP (Largest Contentful Paint) measures loading performance - time for the largest image/text to appear. INP (Interaction to Next Paint, replaced FID in 2024) measures responsiveness to user interactions. CLS (Cumulative Layout Shift) measures visual stability - how much layout shifts unexpectedly. Google uses these in search ranking.',
    example: {
      code: `// Measuring Core Web Vitals
import { onLCP, onINP, onCLS } from 'web-vitals';

onLCP(metric => {
  console.log('LCP:', metric.value, 'ms'); // Target: < 2500ms
  analytics.track('LCP', metric.value);
});

onINP(metric => {
  console.log('INP:', metric.value, 'ms'); // Target: < 200ms
});

onCLS(metric => {
  console.log('CLS:', metric.value); // Target: < 0.1
});

// Improving LCP (Largest Contentful Paint)
// âœ… Preload hero images
<link rel="preload" as="image" href="hero.webp">

// âœ… Use WebP format (30-40% smaller than JPEG)
<picture>
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" alt="Hero">
</picture>

// âœ… Size images correctly (no scaling in CSS)
<img src="hero.jpg" width="800" height="400" alt="Hero">

// Improving INP (Interaction to Next Paint)
// âœ… Break long tasks into smaller chunks
function processBigData(data) {
  // Don't block main thread
  return new Promise(resolve => {
    let index = 0;
    function processChunk() {
      const end = Math.min(index + 100, data.length);
      for (; index < end; index++) {
        processItem(data[index]);
      }
      if (index < data.length) {
        setTimeout(processChunk, 0); // Yield to browser
      } else {
        resolve();
      }
    }
    processChunk();
  });
}

// Improving CLS (Cumulative Layout Shift)
// âœ… Always set image dimensions
<img src="photo.jpg" width="400" height="300" alt="">

// âœ… Reserve space for ads/embeds
.ad-container {
  min-height: 250px; /* Reserve space before ad loads */
}

// âœ… Don't insert content above existing content
// âŒ Bad: New banner inserted at top pushes content down
// âœ… Good: Show banner in fixed position or pre-reserved space`,
      language: 'javascript'
    },
    interviewAnswer: 'Core Web Vitals directly affect Google search rankings since 2021. LCP measures how fast the main content loads - I optimize it with preloading, WebP images, and server-side rendering. CLS measures layout shifts - I fix it by setting explicit image dimensions and pre-reserving space for dynamic content. INP measures how responsive the UI is to clicks - I fix it by breaking long JavaScript tasks with setTimeout or Web Workers.',
    commonMistakes: [
      'Not setting image width/height (causes CLS)',
      'Not preloading LCP image (slow LCP)',
      'Running heavy JS on main thread (poor INP)',
      'Inserting banners/ads without reserving space (CLS)'
    ],
    realWorldUse: 'Google uses CWV in search ranking. E-commerce sites see conversion improvements with better CWV. Lighthouse, PageSpeed Insights, Search Console all report these metrics. Next.js has built-in CWV optimization.',
    followUpQuestions: [
      'What replaced FID in Core Web Vitals?',
      'How do you measure Core Web Vitals in production?',
      'What is the difference between LCP and FCP?'
    ]
  },

  {
    id: 'fe-code-splitting',
    category: 'frontend',
    type: 'theory',
    question: 'What is code splitting and how does it improve performance?',
    difficulty: 'intermediate',
    tags: ['code-splitting', 'lazy-loading', 'webpack'],
    shortAnswer: 'Code splitting breaks the JavaScript bundle into smaller chunks loaded on demand. Instead of one large file, browsers download only the code needed for the current page, reducing initial load time.',
    detailedExplanation: 'Without code splitting, one large bundle means users download code for all pages/features even if they only visit one page. Code splitting creates separate chunks for different routes, features, or vendor libraries. Dynamic import() tells bundlers (webpack, Vite) to create a separate chunk. Route-based splitting is most impactful. React.lazy() enables component-level code splitting.',
    example: {
      code: `// Without code splitting - ONE large bundle
// users/bundle.js (2MB) - all pages loaded upfront

// With code splitting - MANY small chunks
// main.js (200KB) - critical code
// dashboard.js (300KB) - loaded when /dashboard visited
// settings.js (150KB) - loaded when /settings visited

// React.lazy + Suspense
import { lazy, Suspense } from 'react';

// âœ… Loaded only when component renders
const Dashboard = lazy(() => import('./Dashboard'));
const Settings = lazy(() => import('./Settings'));
const AdminPanel = lazy(() => import('./AdminPanel'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}

// Dynamic import for features
async function loadChartLibrary() {
  const { Chart } = await import('chart.js');
  return new Chart(canvas, config);
}
// chart.js only downloads when user views charts

// Next.js automatic code splitting
// Each page is automatically a separate chunk
// pages/index.js     -> / route
// pages/about.js     -> /about route
// pages/dashboard.js -> /dashboard route

// Measuring impact
// Before: Initial bundle 1.8MB â†’ 8s load on 3G
// After:  Initial bundle 200KB â†’ 0.9s load on 3G

// Preloading next chunk (anticipate navigation)
// User is on homepage, likely to go to dashboard
<link rel="prefetch" href="/dashboard.chunk.js">

// Webpack bundle analyzer to see what's in your bundle
// npx webpack-bundle-analyzer stats.json`,
      language: 'javascript'
    },
    interviewAnswer: 'Code splitting is one of the highest-impact performance optimizations for SPAs. The typical React app without splitting has a 1-3MB bundle that blocks rendering. With route-based splitting, the initial bundle drops dramatically. I use React.lazy for component-level splitting and Next.js handles route splitting automatically. I also use dynamic import() for heavy libraries like charting or PDF generation that users may never need.',
    commonMistakes: [
      'Splitting too aggressively (too many small chunks, HTTP request overhead)',
      'Not using Suspense with React.lazy',
      'Not analyzing bundle to find what to split',
      'Splitting vendor libraries that are already cached'
    ],
    realWorldUse: 'Every large SPA benefits from code splitting. Next.js, Create React App, and Vite all support it. Bundle analyzer tools reveal optimization opportunities.',
    followUpQuestions: [
      'What is the difference between code splitting and tree shaking?',
      'How do you prefetch chunks for likely navigation?',
      'What tools analyze bundle size?'
    ]
  },

  {
    id: 'fe-accessibility',
    category: 'frontend',
    type: 'theory',
    question: 'What is web accessibility (a11y) and how do you implement it?',
    difficulty: 'intermediate',
    tags: ['accessibility', 'a11y', 'wcag', 'aria'],
    shortAnswer: 'Accessibility ensures websites work for people with disabilities. Key practices: semantic HTML, ARIA labels, keyboard navigation, color contrast, focus management, and screen reader testing.',
    detailedExplanation: 'Web accessibility means building sites usable by everyone including people with visual, motor, hearing, or cognitive disabilities. WCAG (Web Content Accessibility Guidelines) defines standards. Levels: A (basic), AA (standard target), AAA (enhanced). Screen readers (VoiceOver, NVDA) navigate via semantic HTML and ARIA. Keyboard users need visible focus indicators and logical tab order.',
    example: {
      code: `// âŒ Inaccessible
<div onClick={handleLogin} class="button">Login</div>
<img src="chart.png">
<div class="error">Invalid email</div>
<input type="text" placeholder="Email">

// âœ… Accessible
// 1. Semantic HTML - use the right elements
<button onClick={handleLogin}>Login</button>
// Native button: keyboard accessible, correct role, focusable

// 2. Images need alt text
<img src="chart.png" alt="Monthly revenue chart showing 40% growth">
// Decorative images: alt=""
<img src="decoration.png" alt="" role="presentation">

// 3. Form labels
<label htmlFor="email">Email address</label>
<input
  id="email"
  type="email"
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby="email-error"
/>
{hasError && (
  <span id="email-error" role="alert">
    Please enter a valid email
  </span>
)}

// 4. Color contrast
// Text must have 4.5:1 contrast ratio (AA standard)
// Use tools: WebAIM contrast checker, browser devtools

// 5. Focus management
// Skip navigation link
<a href="#main-content" className="skip-link">
  Skip to main content
</a>

// Focus trap in modals
function Modal({ onClose }) {
  const modalRef = useRef(null);
  
  useEffect(() => {
    // Focus first focusable element when modal opens
    modalRef.current?.querySelector('button, input, a')?.focus();
    
    // Trap focus inside modal
    const handleTab = (e) => {
      const focusable = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      // Tab cycles within modal
    };
    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, []);
  
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="modal-title" ref={modalRef}>
      <h2 id="modal-title">Confirm Action</h2>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

// 6. Keyboard navigation
// All interactive elements reachable by Tab
// Enter/Space activate buttons
// Arrow keys navigate lists/menus
// Escape closes modals/dropdowns`,
      language: 'jsx'
    },
    interviewAnswer: 'Accessibility isn\'t optional â€” it\'s a legal requirement in many countries and the right thing to do. I start with semantic HTML which gives free accessibility: a real button is keyboard-accessible and has correct ARIA role automatically. I add ARIA labels for icon-only buttons and form error states. I test with keyboard navigation and the browser\'s accessibility panel. For complex components like modals and dropdowns, I implement focus trapping and management.',
    commonMistakes: [
      'Using divs/spans as buttons (loses keyboard access)',
      'Missing alt text on images',
      'Not testing keyboard-only navigation',
      'Poor color contrast (fails WCAG AA)'
    ],
    realWorldUse: 'Government sites are legally required to meet WCAG AA. Enterprise companies check accessibility in code review. Screen readers serve ~7% of users. Keyboard navigation helps power users too.',
    followUpQuestions: [
      'What is WCAG and what are the compliance levels?',
      'How do you implement a keyboard-accessible custom dropdown?',
      'What is focus trapping and when do you need it?'
    ]
  },

  {
    id: 'fe-responsive-design',
    category: 'frontend',
    type: 'theory',
    question: 'What is responsive design and how do you implement it?',
    difficulty: 'beginner',
    tags: ['responsive', 'mobile', 'flexbox', 'grid'],
    shortAnswer: 'Responsive design adapts layouts to different screen sizes. Key techniques: fluid grids (%, fr), flexible images (max-width: 100%), media queries, mobile-first approach, and viewport meta tag.',
    detailedExplanation: 'Responsive design uses fluid layouts and media queries so one codebase works across devices. Mobile-first means writing base styles for mobile, then using min-width media queries to add styles for larger screens. Fluid typography uses relative units (rem, clamp()). CSS Grid and Flexbox naturally create responsive layouts. Images need max-width: 100% and srcset for responsive images with different resolutions.',
    example: {
      code: `/* Viewport meta tag - ESSENTIAL */
<meta name="viewport" content="width=device-width, initial-scale=1.0">

/* Mobile-first CSS */
/* Base styles - mobile */
.container {
  padding: 1rem;
  width: 100%;
}

.card-grid {
  display: grid;
  grid-template-columns: 1fr;   /* Single column on mobile */
  gap: 1rem;
}

/* Tablet - 768px+ */
@media (min-width: 768px) {
  .container {
    max-width: 768px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .card-grid {
    grid-template-columns: repeat(2, 1fr); /* 2 columns */
  }
}

/* Desktop - 1024px+ */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
  }
  
  .card-grid {
    grid-template-columns: repeat(3, 1fr); /* 3 columns */
  }
}

/* Fluid typography with clamp() */
h1 {
  /* Min 1.5rem, fluid, max 3rem */
  font-size: clamp(1.5rem, 4vw, 3rem);
}

/* Responsive images */
img {
  max-width: 100%;
  height: auto;
}

/* Responsive image with art direction */
<picture>
  <source media="(min-width: 768px)" srcset="hero-wide.webp">
  <source media="(min-width: 375px)" srcset="hero-medium.webp">
  <img src="hero-mobile.webp" alt="Hero image">
</picture>

/* Intrinsic responsive layout with auto-fill */
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}
/* Automatically adjusts column count to fit container */

/* Flexbox wrapping */
.flex-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.flex-wrap > * {
  flex: 1 1 250px; /* Grow/shrink, base 250px */
}`,
      language: 'css'
    },
    interviewAnswer: 'Mobile-first is my default approach because mobile traffic dominates and it forces prioritization of what matters most. The viewport meta tag is always first in my HTML - without it, mobile browsers show the desktop layout zoomed out. I use CSS Grid with auto-fill and minmax() for layouts that naturally adapt without media queries. For complex layouts, I add strategic breakpoints where the design actually breaks rather than at arbitrary device sizes.',
    commonMistakes: [
      'Forgetting viewport meta tag',
      'Desktop-first approach (harder to adapt down)',
      'Fixed pixel widths that overflow on mobile',
      'Not testing on real devices'
    ],
    realWorldUse: 'Over 60% of web traffic is mobile. Google uses mobile-first indexing for SEO. Tailwind CSS uses mobile-first breakpoints (sm:, md:, lg:).',
    followUpQuestions: [
      'What is the difference between adaptive and responsive design?',
      'What does mobile-first mean in CSS?',
      'When would you use container queries over media queries?'
    ]
  },

  {
    id: 'fe-browser-storage',
    category: 'frontend',
    type: 'theory',
    question: 'What are the different browser storage options and when to use each?',
    difficulty: 'beginner',
    tags: ['storage', 'cookies', 'localstorage', 'indexeddb'],
    shortAnswer: 'Cookies (~4KB, sent with requests, server access), localStorage (~5MB, persistent, sync), sessionStorage (~5MB, tab-scoped), IndexedDB (large structured data, async). Use case determines the choice.',
    detailedExplanation: 'Cookies are the oldest â€” stored per origin, sent automatically with every HTTP request (useful for auth), accessible server and client side, expire by date. localStorage persists until explicitly cleared, synchronous API, ~5MB limit. sessionStorage same API but cleared when tab closes. IndexedDB is a full database in the browser â€” supports transactions, indexes, large amounts of structured data. Cache API for service workers/PWAs.',
    example: {
      code: `// Cookies - sent with every request, server-readable
// Best for: session tokens (with httpOnly), user preferences server needs
document.cookie = 'theme=dark; max-age=86400; path=/';
// Access: document.cookie returns ALL cookies as string

// localStorage - persistent key-value
// Best for: user preferences, non-sensitive settings, cached data
localStorage.setItem('theme', 'dark');
localStorage.setItem('user', JSON.stringify({ name: 'Alex' }));

const theme = localStorage.getItem('theme');
const user = JSON.parse(localStorage.getItem('user'));

localStorage.removeItem('theme');
localStorage.clear(); // Remove all

// sessionStorage - tab-scoped key-value
// Best for: multi-step form data, temp checkout state
sessionStorage.setItem('checkoutStep', '2');
sessionStorage.setItem('cartItems', JSON.stringify(items));

// IndexedDB - large structured data, async
// Best for: offline apps, large datasets, complex queries
const dbRequest = indexedDB.open('MyDB', 1);

dbRequest.onupgradeneeded = (e) => {
  const db = e.target.result;
  const store = db.createObjectStore('users', { keyPath: 'id' });
  store.createIndex('email', 'email', { unique: true });
};

dbRequest.onsuccess = (e) => {
  const db = e.target.result;
  const tx = db.transaction('users', 'readwrite');
  const store = tx.objectStore('users');
  store.add({ id: 1, name: 'Alex', email: 'alex@test.com' });
};

// Summary
// Auth token (httpOnly) -> Cookie
// User preferences       -> localStorage
// Multi-step form        -> sessionStorage
// Offline data/PWA       -> IndexedDB
// Cached API responses   -> Cache API

// Security consideration
// localStorage is accessible to ANY JS on your origin
// XSS can steal localStorage data
// httpOnly cookies cannot be read by JS (safer for auth)`,
      language: 'javascript'
    },
    interviewAnswer: 'Storage choice depends on the use case. Auth tokens in httpOnly cookies â€” JavaScript can\'t read them, protecting against XSS. User preferences like theme in localStorage â€” persists across sessions. Multi-step form state in sessionStorage â€” clears when user closes tab preventing stale data. For offline-capable PWAs with large datasets, IndexedDB is the only option. I avoid storing sensitive data in localStorage because any JavaScript on the page can read it.',
    commonMistakes: [
      'Storing sensitive data in localStorage',
      'Not parsing JSON from localStorage',
      'Not handling storage quota exceeded errors',
      'Using cookies when localStorage is more appropriate'
    ],
    realWorldUse: 'Shopping carts, auth tokens, user preferences, offline apps. Progressive Web Apps rely on IndexedDB and Cache API for offline functionality.',
    followUpQuestions: [
      'Why is IndexedDB preferred over localStorage for large data?',
      'What is the security difference between cookies and localStorage?',
      'What is the Cache API?'
    ]
  },

  {
    id: 'fe-dom-manipulation',
    category: 'frontend',
    type: 'theory',
    question: 'How does DOM manipulation work and what are best practices?',
    difficulty: 'beginner',
    tags: ['dom', 'javascript', 'performance'],
    shortAnswer: 'The DOM is a tree representation of HTML that JavaScript can read and modify. Key methods: querySelector, createElement, appendChild, addEventListener. Minimize DOM changes to avoid expensive reflows.',
    detailedExplanation: 'The Document Object Model is a programming interface for HTML. Browsers parse HTML into a tree of nodes. JavaScript can read (querySelector), create (createElement), modify (textContent, setAttribute), and delete (remove) nodes. Each DOM modification can trigger reflow (recalculating layout) and repaint, which are expensive. Batch modifications, use DocumentFragment, or use virtual DOM libraries like React to minimize direct manipulation.',
    example: {
      code: `// Selecting elements
const header = document.querySelector('h1');
const allButtons = document.querySelectorAll('button');
const loginBtn = document.getElementById('login-btn');

// Reading properties
console.log(header.textContent);    // Text only
console.log(header.innerHTML);      // HTML content
console.log(header.getAttribute('class'));

// Modifying
header.textContent = 'New Title';   // Safe, escapes HTML
header.classList.add('highlighted');
header.classList.remove('hidden');
header.classList.toggle('active');
header.setAttribute('data-id', '123');
header.style.color = 'blue'; // Inline style (avoid - use classes)

// Creating elements
const card = document.createElement('div');
card.className = 'card';
card.textContent = 'New Card';

// âŒ Causes multiple reflows
for (let i = 0; i < 100; i++) {
  document.body.appendChild(document.createElement('div'));
}

// âœ… DocumentFragment - batch insert
const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
  const div = document.createElement('div');
  div.textContent = \`Item \${i}\`;
  fragment.appendChild(div);
}
document.body.appendChild(fragment); // One reflow!

// âœ… innerHTML for large updates (one reflow)
const list = document.getElementById('list');
list.innerHTML = items.map(item =>
  \`<li>\${escapeHtml(item.name)}</li>\`
).join('');

// Events
loginBtn.addEventListener('click', handleLogin);
// Remove to prevent memory leaks
loginBtn.removeEventListener('click', handleLogin);

// Event delegation (one listener for many elements)
document.getElementById('todo-list').addEventListener('click', (e) => {
  if (e.target.matches('.delete-btn')) {
    e.target.closest('li').remove();
  }
});`,
      language: 'javascript'
    },
    interviewAnswer: 'DOM manipulation is foundational JavaScript knowledge even if you use React daily. Key insight: touching the DOM triggers reflow (layout recalculation) and repaint â€” these are expensive. I batch DOM changes with DocumentFragment or innerHTML updates. Event delegation is crucial for dynamic lists â€” instead of adding a listener to each item, I add one to the parent and check the target. This also handles dynamically added items automatically.',
    commonMistakes: [
      'Making DOM changes inside loops (many reflows)',
      'Reading layout properties after writing (layout thrashing)',
      'Not removing event listeners (memory leaks)',
      'Using innerHTML with user input (XSS)'
    ],
    realWorldUse: 'Understanding DOM manipulation is essential even in React apps â€” React IS manipulating the DOM, just efficiently via virtual DOM. Useful for vanilla JS scripts, third-party integrations, and understanding what React does under the hood.',
    followUpQuestions: [
      'What is layout thrashing?',
      'What is event delegation and why is it useful?',
      'What is the difference between textContent and innerHTML?'
    ]
  },

  {
    id: 'fe-event-delegation',
    category: 'frontend',
    type: 'theory',
    question: 'What is event bubbling, capturing, and event delegation?',
    difficulty: 'intermediate',
    tags: ['events', 'bubbling', 'delegation'],
    shortAnswer: 'Events bubble up from target to root (bubbling) or go down then up (capturing). Event delegation uses bubbling â€” attach one listener to a parent instead of many listeners on children.',
    detailedExplanation: 'When an event fires, it goes through three phases: capturing (window â†’ target), target, bubbling (target â†’ window). Most events bubble. Event delegation exploits bubbling â€” attach listener to a parent, check event.target to identify which child was clicked. Benefits: fewer listeners = less memory, works for dynamically added elements, easier code. stopPropagation() stops bubbling. preventDefault() prevents default browser behavior.',
    example: {
      code: `// Event Bubbling
<div id="parent">
  <button id="child">Click me</button>
</div>

document.getElementById('child').addEventListener('click', () => {
  console.log('Child clicked');
});

document.getElementById('parent').addEventListener('click', () => {
  console.log('Parent clicked'); // Also fires! (bubbling)
});

// Click button â†’ logs: 'Child clicked', then 'Parent clicked'

// Stop bubbling
document.getElementById('child').addEventListener('click', (e) => {
  e.stopPropagation(); // Parent listener won't fire
  console.log('Child clicked');
});

// preventDefault - stop browser default action
document.querySelector('a').addEventListener('click', (e) => {
  e.preventDefault(); // Don't navigate
  // Do custom routing instead
});

document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault(); // Don't reload page
  handleSubmit(new FormData(e.target));
});

// Event Delegation - ONE listener handles all buttons
const todoList = document.getElementById('todo-list');

todoList.addEventListener('click', (e) => {
  // Check which element was actually clicked
  if (e.target.matches('.complete-btn')) {
    const id = e.target.dataset.id;
    markComplete(id);
  }
  
  if (e.target.matches('.delete-btn')) {
    e.target.closest('.todo-item').remove();
  }
});

// âœ… Works for dynamically added items!
function addTodo(text) {
  todoList.innerHTML += \`
    <li class="todo-item">
      \${text}
      <button class="complete-btn" data-id="\${Date.now()}">Done</button>
      <button class="delete-btn">Delete</button>
    </li>
  \`;
  // No need to add new listeners - delegation handles it
}

// Event capturing (rare)
document.getElementById('parent').addEventListener('click', () => {
  console.log('Captures first!');
}, true); // Third arg true = capturing phase`,
      language: 'javascript'
    },
    interviewAnswer: 'Event bubbling is how clicks on a button also trigger listeners on its parent and all ancestors up to the document. Event delegation uses this to your advantage â€” a single listener on a list handles clicks on all list items, including ones added later. This is why jQuery\'s .on() with a selector argument works on future elements. In React, all events are delegated to the root element via React\'s synthetic event system.',
    commonMistakes: [
      'Adding listeners inside loops (N listeners instead of 1)',
      'Not removing listeners on cleanup (memory leaks)',
      'Confusing stopPropagation and preventDefault',
      'Not understanding that React uses delegation internally'
    ],
    realWorldUse: 'Dynamic lists (todos, messages), infinite scroll content, drag-and-drop interfaces. React\'s synthetic events are all delegated to the root. jQuery\'s $.on() with selector uses delegation.',
    followUpQuestions: [
      'What is the difference between stopPropagation and preventDefault?',
      'Does React use event delegation?',
      'When would you use event capturing instead of bubbling?'
    ]
  },

  {
    id: 'fe-web-performance',
    category: 'frontend',
    type: 'theory',
    question: 'How do you optimize web application performance?',
    difficulty: 'intermediate',
    tags: ['performance', 'optimization', 'lighthouse'],
    shortAnswer: 'Optimize in layers: network (CDN, compression, caching), assets (minify, compress images, code splitting), rendering (lazy loading, virtual lists, debounce), and runtime (memoization, web workers).',
    detailedExplanation: 'Web performance optimization addresses the full stack. Network layer: use CDN, enable gzip/Brotli compression, set cache headers, reduce HTTP requests. Asset optimization: minify JS/CSS, use WebP images, remove unused code (tree shaking), code splitting. Rendering: lazy load images/components, virtual scrolling for large lists, defer non-critical scripts. JavaScript: memoize expensive computations, debounce/throttle events, use web workers for heavy computation.',
    example: {
      code: `// 1. Image Optimization
<img 
  src="photo.jpg" 
  srcset="photo-400.webp 400w, photo-800.webp 800w"
  sizes="(max-width: 600px) 400px, 800px"
  loading="lazy"    // Native lazy loading
  decoding="async"  // Don't block rendering
  width="800" 
  height="600"      // Prevents CLS
  alt="Photo description"
>

// 2. Script optimization
<script defer src="app.js"></script>   // Non-blocking
<script async src="analytics.js"></script> // Non-critical

// 3. Lazy loading in React
const HeavyChart = lazy(() => import('./HeavyChart'));
const AdminDashboard = lazy(() => import('./AdminDashboard'));

// 4. Virtual scrolling for large lists (react-window)
import { FixedSizeList } from 'react-window';

function BigList({ items }) {
  return (
    <FixedSizeList
      height={500}      // Window height
      itemCount={10000} // Total items
      itemSize={50}     // Row height
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>{items[index].name}</div>
      )}
    </FixedSizeList>
  );
  // Only renders ~10 visible items, not 10,000!
}

// 5. Debounce search input
function SearchBox() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  
  useEffect(() => {
    if (debouncedQuery) searchAPI(debouncedQuery);
  }, [debouncedQuery]);
  
  return <input onChange={e => setQuery(e.target.value)} />;
}

// 6. Web Worker for heavy computation
const worker = new Worker('/heavy-task.js');
worker.postMessage({ data: largeArray });
worker.onmessage = (e) => setResult(e.data);
// Main thread stays responsive

// 7. Measuring performance
// Lighthouse audit
// Performance.now() for code timing
const start = performance.now();
doExpensiveOperation();
console.log('Took:', performance.now() - start, 'ms');`,
      language: 'javascript'
    },
    interviewAnswer: 'I approach performance in layers using Lighthouse as my guide. First: network and assets â€” images in WebP format with lazy loading, code splitting routes, enabling compression. Then rendering â€” defer non-critical scripts, virtual scroll for large lists. Finally runtime â€” memoize expensive React renders, debounce inputs, move heavy computation to web workers. I always measure before optimizing â€” Lighthouse identifies the actual bottlenecks.',
    commonMistakes: [
      'Optimizing without measuring first (premature optimization)',
      'Not compressing images (usually the biggest win)',
      'Rendering 10,000 DOM nodes for a list',
      'Not using code splitting for large SPAs'
    ],
    realWorldUse: 'Every production web app needs performance consideration. E-commerce sites see 1% conversion increase per 100ms improvement. Google Search Console tracks Core Web Vitals. Lighthouse is built into Chrome DevTools.',
    followUpQuestions: [
      'What is tree shaking?',
      'How do you profile React component performance?',
      'What is a service worker and how does it improve performance?'
    ]
  },

  {
    id: 'fe-service-workers',
    category: 'frontend',
    type: 'theory',
    question: 'What are Service Workers and how do Progressive Web Apps use them?',
    difficulty: 'advanced',
    tags: ['service-worker', 'pwa', 'offline', 'caching'],
    shortAnswer: 'Service Workers are scripts running in a separate thread from the main page. They intercept network requests enabling offline functionality, background sync, and push notifications for Progressive Web Apps.',
    detailedExplanation: 'Service Workers act as a network proxy in the browser. They sit between the web app and the network, caching resources and serving them offline. PWA requirements: HTTPS, manifest.json (name, icons, start URL), and a service worker. Service workers have a lifecycle: install (cache assets), activate (clean old cache), fetch (serve cached or network). Background sync and push notifications extend functionality beyond a browser tab.',
    example: {
      code: `// Register service worker (in main app)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('SW registered:', reg.scope))
    .catch(err => console.log('SW failed:', err));
}

// sw.js - The Service Worker
const CACHE_NAME = 'my-app-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/app.js',
  '/styles.css',
  '/offline.html'
];

// Install - cache static assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting(); // Activate immediately
});

// Activate - clean old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim(); // Take control of all tabs
});

// Fetch - cache-first strategy
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      // Return cached version if available
      if (cached) return cached;
      
      // Otherwise fetch from network
      return fetch(e.request).then(response => {
        // Cache new API responses
        if (e.request.url.includes('/api/')) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(e.request, clone);
          });
        }
        return response;
      }).catch(() => {
        // Offline fallback
        if (e.request.destination === 'document') {
          return caches.match('/offline.html');
        }
      });
    })
  );
});

// manifest.json - PWA configuration
{
  "name": "My PWA App",
  "short_name": "MyApp",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#3498db",
  "background_color": "#ffffff",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}`,
      language: 'javascript'
    },
    interviewAnswer: 'Service workers are the key technology behind PWAs. They enable offline functionality by intercepting fetch requests and serving cached responses. The cache-first strategy serves cached content immediately (fast), then optionally updates in background. Stale-while-revalidate is great for news apps â€” show cached content instantly, silently update. PWAs can be installed on home screen, receive push notifications, and work offline â€” matching native app capabilities.',
    commonMistakes: [
      'Not handling SW update/activation correctly (users see old version)',
      'Caching everything including POST requests',
      'Not providing offline fallback page',
      'Forgetting HTTPS requirement (SW needs secure context)'
    ],
    realWorldUse: 'Twitter Lite, Pinterest, Starbucks apps are PWAs. They reduced data usage and improved performance on low-end devices. Next.js has next-pwa plugin. Workbox is Google\'s library for service workers.',
    followUpQuestions: [
      'What is the difference between cache-first and network-first strategies?',
      'What is Background Sync?',
      'How do you update a service worker?'
    ]
  },
  {
    id: 'fe-tree-shaking',
    category: 'frontend',
    type: 'theory',
    question: 'What is tree shaking and how does it work?',
    difficulty: 'intermediate',
    tags: ['tree-shaking', 'bundling', 'performance'],
    shortAnswer: 'Tree shaking is dead code elimination. Bundlers like webpack and Vite analyze ES module import/export statements to remove unused exports from the final bundle.',
    detailedExplanation: 'Tree shaking relies on static analysis of ES module import/export syntax (not CommonJS require). The bundler builds a dependency graph, marks all reachable exports, and removes unreachable ones. Key requirements: use ES modules (import/export), not CommonJS (require/module.exports), and avoid side-effectful imports. The "sideEffects" field in package.json tells bundlers which files have side effects and shouldn\'t be tree-shaken.',
    example: {
      language: 'javascript',
      code: `// âœ… Tree shakeable - named exports
export const add = (a, b) => a + b;
export const multiply = (a, b) => a * b;
export const divide = (a, b) => a / b;

// In your app - only import what you need
import { add } from './math';
// multiply and divide are NOT included in bundle!

// âŒ CommonJS - NOT tree shakeable
module.exports = { add, multiply, divide };
const math = require('./math'); // Entire module included

// âŒ Side-effectful import - bundler can't remove
import './polyfills'; // This modifies globals - can't be removed

// package.json - mark files without side effects
{
  "sideEffects": false,  // All files are side-effect free
  // Or specify which have side effects:
  "sideEffects": ["./src/polyfills.js", "*.css"]
}

// Lodash example - tree shaking matters
// âŒ Imports entire lodash (70KB+)
import _ from 'lodash';
const result = _.chunk([1,2,3,4], 2);

// âœ… Import only chunk (2KB)
import chunk from 'lodash/chunk';
// Or with lodash-es (ESM version):
import { chunk } from 'lodash-es';

// Check bundle size
// npx webpack-bundle-analyzer
// Vite: npx vite-bundle-analyzer`
    },
    interviewAnswer: 'Tree shaking removes unused code from the final bundle, which can dramatically reduce bundle size. The key requirement is ES modules â€” tree shaking doesn\'t work with CommonJS require(). Lodash is the classic example: importing the entire library vs just the functions you need. I always check bundle size with analyzer tools after adding heavy dependencies.',
    commonMistakes: [
      'Using CommonJS require() (not tree shakeable)',
      'Importing entire libraries (import _ from "lodash")',
      'Not setting sideEffects: false in package.json',
      'Dynamic imports that prevent static analysis'
    ],
    realWorldUse: 'Every production SPA. lodash-es vs lodash, named imports from libraries, barrel files (index.ts) can break tree shaking if not configured correctly.',
    followUpQuestions: [
      'Why does tree shaking require ES modules?',
      'What is a "barrel file" and how does it affect tree shaking?',
      'What tools measure bundle size?'
    ]
  },
  {
    id: 'fe-critical-rendering-path',
    category: 'frontend',
    type: 'theory',
    question: 'What is the Critical Rendering Path and how do you optimize it?',
    difficulty: 'intermediate',
    tags: ['performance', 'rendering', 'critical-path'],
    shortAnswer: 'The Critical Rendering Path is the sequence of steps browsers take to convert HTML/CSS/JS into pixels: DOM â†’ CSSOM â†’ Render Tree â†’ Layout â†’ Paint. Optimizing it reduces time to first render.',
    detailedExplanation: 'The browser must complete HTML parsing (DOM), CSS parsing (CSSOM), combining them into Render Tree, Layout (geometry), Paint (pixels), and Composite. CSS blocks rendering â€” browser won\'t paint until CSSOM is built. JavaScript blocks HTML parsing by default. The critical path is the minimum work to get the first pixel on screen. Techniques: inline critical CSS, defer non-critical JS, preload key resources, reduce render-blocking resources.',
    example: {
      language: 'html',
      code: `<!-- Render-blocking resources (bad) -->
<head>
  <link rel="stylesheet" href="all-styles.css">  <!-- Blocks render -->
  <script src="analytics.js"></script>            <!-- Blocks parsing -->
</head>

<!-- Optimized critical path -->
<head>
  <!-- Inline only above-the-fold CSS -->
  <style>
    /* Critical styles for first viewport */
    body { margin: 0; font-family: sans-serif; }
    .hero { height: 100vh; background: #6366f1; }
  </style>
  
  <!-- Load full CSS asynchronously -->
  <link rel="preload" href="styles.css" as="style" 
        onload="this.rel='stylesheet'">
  
  <!-- Preload critical fonts -->
  <link rel="preload" href="font.woff2" as="font" 
        type="font/woff2" crossorigin>
  
  <!-- Preconnect to external origins -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
</head>

<body>
  <!-- Content -->
  
  <!-- Non-critical JS: defer = download in parallel, run after parse -->
  <script defer src="app.js"></script>
  <!-- async = download in parallel, run as soon as ready (order not guaranteed) -->
  <script async src="analytics.js"></script>
</body>

<!-- Measuring critical path -->
<!-- Chrome DevTools â†’ Performance â†’ check for render-blocking resources -->
<!-- Lighthouse â†’ "Eliminate render-blocking resources" -->`
    },
    interviewAnswer: 'Optimizing the critical rendering path is about getting the first pixel on screen as fast as possible. My approach: identify render-blocking resources with Lighthouse, inline the critical CSS needed for above-the-fold content, and defer everything else. Deferring scripts is one of the highest-impact changes â€” JS blocks HTML parsing, so even a small script can delay rendering by hundreds of milliseconds.',
    commonMistakes: [
      'Putting large JS in <head> without defer/async',
      'Loading all CSS even though only above-fold is needed',
      'Too many render-blocking third-party scripts',
      'Not using preconnect for external resources'
    ],
    realWorldUse: 'E-commerce landing pages, marketing pages where first contentful paint directly affects conversion. Lighthouse "Eliminate render-blocking resources" is one of the most common recommendations.',
    followUpQuestions: [
      'What is First Contentful Paint vs Largest Contentful Paint?',
      'What is the difference between defer and async?',
      'What does "render-blocking" mean?'
    ]
  },
  {
    id: 'fe-intersection-observer',
    category: 'frontend',
    type: 'theory',
    question: 'What is the Intersection Observer API?',
    difficulty: 'intermediate',
    tags: ['intersection-observer', 'performance', 'lazy-loading'],
    shortAnswer: 'Intersection Observer detects when elements enter/exit the viewport without scroll event listeners. Used for lazy loading images, infinite scroll, and triggering animations when elements become visible.',
    detailedExplanation: 'Before Intersection Observer, you used scroll event listeners with getBoundingClientRect() â€” expensive because scroll fires hundreds of times per second. Intersection Observer is asynchronous and callback-based â€” the browser calls your callback when observed elements intersect with the viewport (or a root element). The threshold option controls how much of the element must be visible. Much more performant than scroll listeners.',
    example: {
      language: 'javascript',
      code: `// Basic Intersection Observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Element entered viewport
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // Stop observing after trigger
    }
  });
}, {
  threshold: 0.1,      // 10% visible triggers callback
  rootMargin: '0px 0px -50px 0px'  // Trigger 50px before bottom
});

// Observe elements
document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});

// Lazy loading images
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;     // Load real image
      img.removeAttribute('data-src');
      imageObserver.unobserve(img);
    }
  });
});

document.querySelectorAll('img[data-src]').forEach(img => {
  imageObserver.observe(img);
});

// HTML with lazy images
// <img data-src="photo.jpg" src="placeholder.jpg" alt="Photo">

// Infinite scroll
const sentinelObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    loadMoreItems();
  }
}, { rootMargin: '200px' }); // Load 200px before reaching bottom

const sentinel = document.querySelector('#load-more-sentinel');
sentinelObserver.observe(sentinel);

// React hook
function useIntersectionObserver(ref, options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      options
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options]);
  
  return isIntersecting;
}`
    },
    interviewAnswer: 'Intersection Observer is the performant way to react to elements entering the viewport. Before it existed, developers used scroll event listeners that fired hundreds of times per second and called getBoundingClientRect() â€” which forces layout recalculation. Intersection Observer is async and battery-friendly. I use it for lazy-loading images, triggering CSS animations when elements scroll into view, and infinite scroll pagination.',
    commonMistakes: [
      'Still using scroll events for viewport detection',
      'Not unobserving after first trigger (wastes memory)',
      'Not disconnecting observer on component unmount',
      'Threshold values that cause flickering'
    ],
    realWorldUse: 'Native browser lazy loading (loading="lazy") uses Intersection Observer internally. Infinite scroll in Twitter, Instagram, Facebook feeds. Animation-on-scroll libraries. React libraries like react-intersection-observer.',
    followUpQuestions: [
      'How does Intersection Observer compare to scroll event listeners?',
      'What is the rootMargin option?',
      'How does the native loading="lazy" attribute work?'
    ]
  },
  {
    id: 'fe-reflow-repaint',
    category: 'frontend',
    type: 'theory',
    question: 'What is the difference between browser reflow and repaint, and how do you avoid triggering them unnecessarily?',
    difficulty: 'intermediate',
    tags: ['frontend', 'performance', 'browser', 'rendering'],
    shortAnswer: 'Reflow (layout) recalculates element positions and sizes — expensive. Repaint updates pixels without layout changes — cheaper. Both are triggered by DOM/CSS changes. Batch DOM writes, use CSS transforms instead of changing top/left, avoid reading layout properties in a loop.',
    detailedExplanation: 'Layout thrashing: interleaving DOM reads (offsetHeight) and writes (style changes) in a loop forces the browser to recalculate layout synchronously on every read. Batch reads first, then writes. CSS transforms (translate, scale) are compositor-only operations — they skip reflow and repaint entirely, making them ideal for animations.',
    example: {
      code: `// ❌ Layout thrashing — forces reflow on every iteration
elements.forEach(el => {
  const h = el.offsetHeight;    // READ — forces reflow
  el.style.height = h + 10 + 'px'; // WRITE
});

// ✅ Batch reads, then writes
const heights = elements.map(el => el.offsetHeight); // all reads
elements.forEach((el, i) => {
  el.style.height = heights[i] + 10 + 'px';          // all writes
});

// ✅ Use requestAnimationFrame for visual updates
requestAnimationFrame(() => {
  el.style.height = '200px';
});

// ✅ CSS transform instead of top/left — compositor only
// ❌ el.style.left = '100px'; // triggers layout
// ✅ el.style.transform = 'translateX(100px)'; // compositor only

// ✅ will-change prepares layer for animation
el.style.willChange = 'transform'; // create compositing layer in advance`,
      language: 'javascript'
    },
    interviewAnswer: 'Explain layout thrashing with the read-write loop example. Name the three tiers: compositor (transforms) > repaint > reflow.',
    commonMistakes: ['Using will-change on every element — wastes GPU memory', 'Animating top/left instead of transform/opacity'],
    realWorldUse: 'Any animation-heavy UI, virtual scrolling, drag-and-drop implementations.',
    followUpQuestions: ['What is the compositor thread?', 'What CSS properties are safe to animate (compositor only)?']
  },

  {
    id: 'fe-content-security-policy',
    category: 'frontend',
    type: 'theory',
    question: 'How do you implement a Content Security Policy (CSP) and debug violations?',
    difficulty: 'advanced',
    tags: ['frontend', 'security', 'csp', 'xss'],
    shortAnswer: 'CSP is a response header that whitelists sources for scripts, styles, images, and more. Start with report-only mode to collect violations without breaking the app, then progressively tighten the policy. Use nonces for inline scripts.',
    detailedExplanation: 'A strict CSP is the strongest XSS mitigation. The nonce-based approach: the server generates a random nonce per request, adds it to the CSP header and to each legitimate inline <script>. Injected scripts won\'t have the nonce and will be blocked. report-uri or report-to sends violation reports to your logging endpoint.',
    example: {
      code: `// 1. Start with report-only to discover what would break
Content-Security-Policy-Report-Only: default-src 'self'; report-uri /csp-report

// 2. Nonce-based CSP for inline scripts (Node.js)
app.use((req, res, next) => {
  const nonce = crypto.randomBytes(16).toString('base64');
  res.locals.nonce = nonce;
  res.setHeader('Content-Security-Policy',
    \`script-src 'nonce-\${nonce}' 'strict-dynamic';\`
  );
  next();
});

// 3. In HTML template — only nonce'd scripts run
<script nonce="<%= nonce %>">
  // inline script — allowed
</script>
<script nonce="BAD_NONCE">
  // attacker's injected script — blocked!
</script>

// 4. CSP violation report endpoint
app.post('/csp-report', express.json({ type: 'application/csp-report' }), (req, res) => {
  console.error('CSP violation:', req.body['csp-report']);
  res.status(204).end();
});`,
      language: 'javascript'
    },
    interviewAnswer: 'The nonce pattern + strict-dynamic is the modern CSP gold standard. Report-only mode is the right starting point.',
    commonMistakes: ['Using unsafe-inline to silence errors instead of fixing the root cause', 'Reusing the same nonce across requests — it must be unique per response'],
    realWorldUse: 'Any security-conscious web app, PCI-compliant payment pages, banking interfaces.',
    followUpQuestions: ['What is strict-dynamic in CSP?', 'How do browser extensions affect CSP?']
  },

  {
    id: 'fe-web-vitals-improve',
    category: 'frontend',
    type: 'theory',
    question: 'How do you improve Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS)?',
    difficulty: 'intermediate',
    tags: ['frontend', 'core-web-vitals', 'performance', 'lcp', 'cls'],
    shortAnswer: 'LCP: preload the hero image, use fetchpriority="high", serve next-gen formats (WebP/AVIF), eliminate render-blocking resources. CLS: set explicit width/height on images/videos, avoid inserting content above existing content, use CSS transforms for animations.',
    detailedExplanation: 'LCP measures when the largest above-fold element renders. The hero image is typically the LCP element — remove anything delaying it. CLS measures unexpected layout shifts. The #1 cause: images without dimensions — browser doesn\'t reserve space so content shifts when the image loads. aspect-ratio CSS property is an alternative to explicit dimensions.',
    example: {
      code: `<!-- LCP optimization -->
<!-- 1. Preload hero image — starts downloading immediately -->
<link rel="preload" as="image" href="hero.webp" fetchpriority="high">

<!-- 2. Hero image with fetchpriority — no lazy loading! -->
<img src="hero.webp" fetchpriority="high" alt="Hero" width="1200" height="600">

<!-- 3. Eliminate render-blocking CSS/JS -->
<link rel="stylesheet" href="critical.css">  <!-- inline critical CSS instead -->
<script src="app.js" defer></script>

<!-- CLS optimization -->
<!-- 1. Always set width + height on images -->
<img src="product.jpg" width="400" height="300" loading="lazy" alt="Product">

<!-- 2. Reserve space for async-loaded content -->
<div style="min-height: 200px"> <!-- reserve space before ad loads -->
  <div id="ad-slot"></div>
</div>

<!-- 3. aspect-ratio as alternative to explicit dimensions -->
img { aspect-ratio: 16/9; width: 100%; }`,
      language: 'html'
    },
    interviewAnswer: 'For LCP: preload + fetchpriority + no lazy on hero. For CLS: dimensions + reserve space. Connect each fix to the specific metric it improves.',
    commonMistakes: ['Using loading="lazy" on the LCP image', 'Dynamically injecting content above the fold without reserved space'],
    realWorldUse: 'Any public-facing web app where SEO and user experience matter.',
    followUpQuestions: ['What is INP (Interaction to Next Paint) in Core Web Vitals?', 'How do you measure CLS in the field vs in the lab?']
  },

  {
    id: 'fe-hydration',
    category: 'frontend',
    type: 'theory',
    question: 'What is hydration in server-side rendered apps and what is hydration mismatch?',
    difficulty: 'intermediate',
    tags: ['frontend', 'ssr', 'hydration', 'react', 'nextjs'],
    shortAnswer: 'Hydration attaches React\'s event listeners to server-rendered HTML. The client React renders a virtual DOM and compares it to the server HTML — if they differ (hydration mismatch), React throws a warning and re-renders client-side, wasting the SSR benefit.',
    detailedExplanation: 'SSR sends HTML to the browser for fast initial display. Hydration then makes that HTML interactive. If the server and client render different output (e.g. using new Date() which produces different values), React discards the server HTML and re-renders from scratch. Common causes: browser-only APIs during SSR, Date/Math.random() in rendering, undefined window.',
    example: {
      code: `// ❌ Hydration mismatch — Date differs server vs client
function Timestamp() {
  return <p>Time: {new Date().toLocaleString()}</p>; // different each render!
}

// ✅ Use useEffect for client-only values
function Timestamp() {
  const [time, setTime] = useState('');
  useEffect(() => {
    setTime(new Date().toLocaleString()); // runs only on client
  }, []);
  return <p>Time: {time || 'Loading...'}</p>;
}

// ✅ suppressHydrationWarning for known differences
<time suppressHydrationWarning>{new Date().toLocaleString()}</time>

// ✅ Next.js dynamic import for client-only components
import dynamic from 'next/dynamic';
const ClientOnlyMap = dynamic(() => import('./Map'), { ssr: false });`,
      language: 'javascript'
    },
    interviewAnswer: 'Explain the two-pass rendering, why mismatches force client re-render, and the three fix patterns: useEffect, suppressHydrationWarning, and dynamic with ssr:false.',
    commonMistakes: ['Using window, localStorage, or document during the render function (SSR has no window)', 'Not understanding that useEffect only runs on the client'],
    realWorldUse: 'Next.js, Remix, Astro — any SSR/SSG framework with client hydration.',
    followUpQuestions: ['What is partial hydration / islands architecture?', 'What is the difference between SSR and SSG?']
  },

  {
    id: 'fe-module-federation',
    category: 'frontend',
    type: 'theory',
    question: 'What is Module Federation in Webpack and how does it enable micro-frontends?',
    difficulty: 'advanced',
    tags: ['frontend', 'micro-frontends', 'webpack', 'module-federation'],
    shortAnswer: 'Module Federation allows one Webpack build to consume modules from another at runtime — without bundling them. Teams ship independently; the host app loads remote components on demand. This is the main Webpack-based micro-frontend architecture.',
    detailedExplanation: 'A "remote" exposes components/utilities. A "host" declares remotes and imports them at runtime. Shared dependencies (React, React-DOM) are configured to be singletons — both bundles use one React instance. The tradeoff: runtime loading adds latency; coordination on shared dependency versions is needed.',
    example: {
      code: `// Remote app (team B) — webpack.config.js
new ModuleFederationPlugin({
  name: 'checkout',
  filename: 'remoteEntry.js',
  exposes: {
    './Button': './src/components/CheckoutButton',
    './Cart': './src/components/Cart',
  },
  shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
});

// Host app (team A) — webpack.config.js
new ModuleFederationPlugin({
  name: 'shell',
  remotes: {
    checkout: 'checkout@https://checkout.example.com/remoteEntry.js',
  },
  shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
});

// Host app usage — lazy loaded from checkout team's deploy
const CheckoutButton = React.lazy(() => import('checkout/Button'));

function App() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <CheckoutButton />
    </Suspense>
  );
}`,
      language: 'javascript'
    },
    interviewAnswer: 'Explain the independent deploy benefit, the singleton shared dependency requirement, and the Suspense wrapper for runtime loading.',
    commonMistakes: ['Not configuring shared React as a singleton — two React instances break hooks', 'Exposing too many modules from a remote — creates tight coupling between teams'],
    realWorldUse: 'Large-scale SPAs split across teams (Netflix, Zalando), design systems with independent versioning.',
    followUpQuestions: ['What are the alternatives to Module Federation for micro-frontends?', 'How do you handle authentication across micro-frontends?']
  },

  {
    id: 'fe-virtual-scroll',
    category: 'frontend',
    type: 'theory',
    question: 'What is virtual scrolling (windowing) and when should you implement it?',
    difficulty: 'intermediate',
    tags: ['frontend', 'performance', 'virtual-scroll', 'lists'],
    shortAnswer: 'Virtual scrolling renders only the visible items plus a small buffer instead of all items. The DOM has a fixed number of nodes; as you scroll, their content is swapped. Use it for lists of 500+ items — below that, DOM overhead is acceptable.',
    detailedExplanation: 'Rendering 10,000 <li> elements creates 10,000 DOM nodes, consuming significant memory and slowing down style recalculation. Virtual scrolling maintains a small "window" of rendered nodes, positioning them absolutely within a tall container. Libraries: react-window (lightweight), react-virtual (Tanstack Virtual), react-virtualised.',
    example: {
      code: `// react-window — fixed-size list
import { FixedSizeList } from 'react-window';

const Row = ({ index, style }) => (
  <div style={style}>Item {index}</div>
);

function VirtualList({ items }) {
  return (
    <FixedSizeList
      height={600}       // visible viewport height
      width="100%"
      itemCount={items.length}  // total items
      itemSize={50}      // height per row in px
    >
      {Row}
    </FixedSizeList>
  );
}

// TanStack Virtual (headless, more flexible)
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }) {
  const parentRef = useRef();
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });
  // render virtualizer.getVirtualItems() inside a tall container
}`,
      language: 'javascript'
    },
    interviewAnswer: 'Explain the problem (too many DOM nodes), the solution (render window), and when to apply it (500+ items). Mention the two popular library options.',
    commonMistakes: ['Implementing virtual scroll for 100 items — not worth the complexity', 'Using variable-height items without measuring them correctly'],
    realWorldUse: 'Chat history, contact lists, log viewers, data tables with thousands of rows.',
    followUpQuestions: ['How do you handle variable row heights?', 'What is bi-directional virtual scrolling (e.g., for chat)?']
  },

  {
    id: 'fe-progressive-enhancement',
    category: 'frontend',
    type: 'theory',
    question: 'What is progressive enhancement and how does it differ from graceful degradation?',
    difficulty: 'beginner',
    tags: ['frontend', 'progressive-enhancement', 'accessibility', 'best-practices'],
    shortAnswer: 'Progressive enhancement: build a baseline experience that works everywhere (semantic HTML + CSS), then layer enhanced features for capable browsers. Graceful degradation: start with a full-featured experience and handle the case where features are missing.',
    detailedExplanation: 'Progressive enhancement is more resilient — even if CSS fails to load or JS is blocked, the core functionality works via semantic HTML. It naturally aligns with accessibility (screen readers get good markup) and SEO (content is in HTML, not JS). Feature detection (not browser detection) decides what enhancements to apply.',
    example: {
      code: `<!-- Progressive enhancement example -->

<!-- Layer 1: Semantic HTML — works everywhere, even without CSS/JS -->
<form action="/search" method="GET">
  <input type="search" name="q" placeholder="Search...">
  <button type="submit">Search</button>
</form>

<!-- Layer 2: CSS enhancement — improves appearance -->
<style>
  form { display: flex; gap: 0.5rem; }
  @supports (backdrop-filter: blur()) {
    .header { backdrop-filter: blur(10px); }
  }
</style>

<!-- Layer 3: JS enhancement — adds autocomplete when supported -->
<script>
  if ('fetch' in window) {
    // Enhance form with AJAX autocomplete
    input.addEventListener('input', debounce(fetchSuggestions, 300));
  }
  // Form still works as a regular form submit if JS fails
</script>`,
      language: 'html'
    },
    interviewAnswer: 'The key framing: progressive enhancement starts simple and adds up; graceful degradation starts complex and falls back. PE is considered the more robust approach.',
    commonMistakes: ['Hiding critical content in JS-only components (SPAs with no SSR)', 'Using browser detection instead of feature detection'],
    realWorldUse: 'Government websites, e-commerce (transactions must work), any globally accessible product.',
    followUpQuestions: ['What is feature detection and how do you implement it?', 'How does SSR relate to progressive enhancement?']
  },

  {
    id: 'fe-react-18-concurrent',
    category: 'frontend',
    type: 'theory',
    question: 'What is the difference between controlled and uncontrolled components, and when should you use each?',
    difficulty: 'beginner',
    tags: ['frontend', 'react', 'forms', 'controlled', 'uncontrolled'],
    shortAnswer: 'Controlled: React state is the single source of truth; every input change updates state. Uncontrolled: the DOM holds the value; you read it via a ref when needed. Use controlled for real-time validation and dependent fields; use uncontrolled for simple forms.',
    detailedExplanation: 'Controlled components: value and onChange are both set — React controls the input. This enables: validation on every keystroke, conditional rendering based on field value, transforming input as-you-type. Uncontrolled: no value prop, use ref to read the value on submit. Simpler but no real-time feedback. React Hook Form uses uncontrolled inputs for performance (fewer re-renders).',
    example: {
      code: `// Controlled component — React owns the value
function ControlledForm() {
  const [email, setEmail] = useState('');
  const isValid = email.includes('@');

  return (
    <input
      type="email"
      value={email}        // React-controlled
      onChange={e => setEmail(e.target.value)}
      style={{ borderColor: isValid ? 'green' : 'red' }}  // real-time validation
    />
  );
}

// Uncontrolled component — DOM owns the value
function UncontrolledForm() {
  const emailRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(emailRef.current.value); // read on submit
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" ref={emailRef} defaultValue="" />
      <button type="submit">Submit</button>
    </form>
  );
}`,
      language: 'javascript'
    },
    interviewAnswer: 'Use controlled for real-time feedback; uncontrolled for simple one-time reads. Mention React Hook Form as a library that uses uncontrolled inputs for performance.',
    commonMistakes: ['Mixing controlled (value) and uncontrolled (no value) — React warns about this', 'Using controlled inputs for large forms without memoisation — every keystroke re-renders'],
    realWorldUse: 'Login forms (uncontrolled fine), checkout with real-time validation (controlled), complex multi-step forms (React Hook Form / Formik).',
    followUpQuestions: ['What is the defaultValue prop?', 'Why does React Hook Form use uncontrolled inputs?']
  },

  {
    id: 'fe-pwa-install',
    category: 'frontend',
    type: 'theory',
    question: 'How do you make a web app installable as a PWA?',
    difficulty: 'intermediate',
    tags: ['pwa', 'installable', 'manifest', 'service-worker'],
    shortAnswer: 'PWA installation requires: a web app manifest (manifest.json) with name, icons, display mode, and start_url; a registered service worker; served over HTTPS; meets browser heuristics. The browser shows an install prompt automatically or you can trigger it manually.',
    detailedExplanation: 'A Progressive Web App is installable when it meets browser criteria. Chrome requires: valid manifest with short_name/name, start_url, display (standalone/fullscreen/minimal-ui), and icons (192px + 512px). A registered service worker with a fetch handler. Served over HTTPS (or localhost). The beforeinstallprompt event fires when the browser thinks the app is installable — you can defer and show a custom install button.',
    example: {
      code: `<!-- In <head> -->
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#6366f1">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<link rel="apple-touch-icon" href="/icons/icon-192.png">

/* manifest.json */
{
  "name": "WebDev Atlas",
  "short_name": "DevAtlas",
  "description": "Learn web development interactively",
  "start_url": "/?source=pwa",
  "display": "standalone",          // Hides browser chrome
  "background_color": "#ffffff",
  "theme_color": "#6366f1",
  "orientation": "portrait-primary",
  "categories": ["education", "productivity"],
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    {
      "src": "/icons/icon-512-maskable.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"  // Adaptive icon for Android
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/desktop.png",
      "sizes": "1280x800",
      "type": "image/png",
      "form_factor": "wide"
    }
  ],
  "shortcuts": [
    {
      "name": "Practice Interview",
      "url": "/interview",
      "icons": [{ "src": "/icons/interview-96.png", "sizes": "96x96" }]
    }
  ]
}

// Capture and defer the install prompt
let deferredPrompt: BeforeInstallPromptEvent | null = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); // Prevent automatic mini-infobar
  deferredPrompt = e as BeforeInstallPromptEvent;
  // Show your custom install button
  installButton.style.display = 'block';
});

installButton.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log(outcome === 'accepted' ? 'PWA installed!' : 'User dismissed');
  deferredPrompt = null;
  installButton.style.display = 'none';
});

// Detect if already installed
window.addEventListener('appinstalled', () => {
  console.log('PWA was installed');
  analytics.track('pwa_installed');
});

// Check display mode
const isInstalled = window.matchMedia('(display-mode: standalone)').matches;`,
      language: 'javascript',
    },
    interviewAnswer: 'PWA installability is about meeting browser criteria and then providing a good install experience. I always defer the beforeinstallprompt and show a custom install button at an appropriate moment — like after the user has used the app for a few minutes — rather than immediately on page load. The maskable icon is easy to forget but important on Android where adaptive icons are clipped to different shapes.',
    commonMistakes: [
      'Showing the install prompt immediately on first visit (annoying UX)',
      'Missing the maskable icon (icon looks wrong on Android)',
      'Not tracking install events (can\'t measure adoption)',
    ],
    realWorldUse: 'Starbucks, Pinterest, Twitter Lite, Financial Times all have installable PWAs. Reduces friction vs native app store.',
    followUpQuestions: ['What is the difference between standalone and fullscreen display mode?', 'How do PWAs handle push notifications?'],
  },

  {
    id: 'fe-web-components-usage',
    category: 'frontend',
    type: 'theory',
    question: 'When should you use Web Components over a framework like React?',
    difficulty: 'intermediate',
    tags: ['web-components', 'framework-choice', 'design-systems'],
    shortAnswer: 'Use Web Components for: design system components shared across different frameworks, embeddable widgets for third-party sites, browser extensions, or long-lived components that will outlive framework churn. React/Vue are better for application logic with complex state.',
    detailedExplanation: 'Web Components work natively in every browser and framework. Key use cases: enterprise design systems where different teams use different frameworks, embeddable analytics widgets, browser extensions (no bundler needed), low-level primitives that need maximum performance. Drawbacks: verbose API, SSR is improving but historically poor, no ecosystem like React\'s. Frameworks like Lit simplify Web Component authoring.',
    example: {
      code: `// When Web Components shine: framework-agnostic design system

// Built once as Web Component
class AppButton extends HTMLElement {
  static get observedAttributes() { return ['variant', 'disabled']; }

  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  render() {
    const variant = this.getAttribute('variant') ?? 'primary';
    const disabled = this.hasAttribute('disabled');

    this.innerHTML = ''; // Clear
    const button = document.createElement('button');
    button.className = \`btn btn--\${variant}\`;
    button.disabled = disabled;
    button.innerHTML = \`<slot></slot>\`;
    this.attachShadow({ mode: 'open' }).appendChild(button);
  }
}
customElements.define('app-button', AppButton);

// Works in React
function ReactApp() {
  return <app-button variant="primary" onClick={handleClick}>Submit</app-button>;
}

// Works in Vue
// <app-button variant="secondary">Cancel</app-button>

// Works in plain HTML
// <app-button variant="danger">Delete</app-button>

// Lit — simplifies Web Component authoring (Google's library)
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('app-button')
class AppButton extends LitElement {
  @property() variant = 'primary';
  @property({ type: Boolean }) disabled = false;

  static styles = css\`
    :host { display: inline-block; }
    button { padding: 0.5rem 1rem; border-radius: 4px; }
  \`;

  render() {
    return html\`
      <button
        class=\${this.variant}
        ?disabled=\${this.disabled}
        @click=\${this.handleClick}
      >
        <slot></slot>
      </button>
    \`;
  }
}

// When to use React instead:
// - SPA with complex state management
// - Rich data-fetching patterns (SWR, React Query)
// - Large team already using React ecosystem
// - Need SSR/SSG (Web Components SSR is improving with Declarative Shadow DOM)`,
      language: 'javascript',
    },
    interviewAnswer: 'The decision comes down to: who will use this component? If a design system needs to work across React, Vue, Angular, and legacy jQuery apps simultaneously, Web Components are the right choice — build once, use everywhere. For application-level code with complex state and data fetching, React gives a much better developer experience. I see them as complementary — Web Components for the leaf nodes (buttons, inputs, icons), React for application structure.',
    commonMistakes: [
      'Building a whole SPA with Web Components when React would be easier',
      'Using Web Components when the entire stack is React anyway',
      'Forgetting Declarative Shadow DOM for SSR compatibility',
    ],
    realWorldUse: 'GitHub uses Web Components (github-relative-time, etc.). Adobe Spectrum, Shoelace, and IBM Carbon all have Web Component versions.',
    followUpQuestions: ['What is Lit and how does it simplify Web Components?', 'What is Declarative Shadow DOM for SSR?'],
  },

  {
    id: 'fe-browser-apis',
    category: 'frontend',
    type: 'theory',
    question: 'What modern browser APIs should every frontend developer know?',
    difficulty: 'intermediate',
    tags: ['browser-apis', 'web-apis', 'modern-web'],
    shortAnswer: 'Essential modern APIs: Intersection Observer (viewport detection), ResizeObserver (element size changes), MutationObserver (DOM changes), Web Workers (background computation), IndexedDB (large client storage), Clipboard API, Web Share API, File System Access API.',
    detailedExplanation: 'Modern browser APIs enable powerful applications without libraries. Intersection Observer replaces scroll listeners for lazy loading. ResizeObserver handles element size changes (replaces window resize hacks). MutationObserver detects DOM changes (used by frameworks internally). Web Animations API provides script control over CSS animations. Permissions API checks/requests user permissions. Broadcast Channel communicates between tabs.',
    example: {
      code: `// ResizeObserver — element size changes (not just window)
const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const { width, height } = entry.contentRect;
    console.log(\`Element is \${width}px × \${height}px\`);
    // Responsive component based on own size (container queries in JS)
    entry.target.classList.toggle('compact', width < 300);
  }
});
resizeObserver.observe(document.querySelector('.sidebar'));

// MutationObserver — watch DOM changes
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    if (mutation.type === 'childList') {
      console.log('Children changed:', mutation.addedNodes, mutation.removedNodes);
    }
    if (mutation.type === 'attributes') {
      console.log('Attribute changed:', mutation.attributeName);
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['class', 'data-theme'], // Only watch these attributes
});

// Clipboard API
async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text);
  showToast('Copied!');
}

async function readFromClipboard() {
  const text = await navigator.clipboard.readText();
  return text;
}

// Web Share API — native share sheet (mobile-first)
async function shareContent() {
  if (!navigator.share) {
    // Fallback to clipboard
    await copyToClipboard(window.location.href);
    return;
  }

  await navigator.share({
    title: 'WebDev Atlas',
    text: 'Learn web development interactively',
    url: window.location.href,
  });
}

// Broadcast Channel — communicate between tabs
const channel = new BroadcastChannel('auth-events');

// Tab 1: User logs out
channel.postMessage({ type: 'logout' });

// Tab 2, 3: Receive and redirect
channel.onmessage = (event) => {
  if (event.data.type === 'logout') {
    window.location.href = '/login';
  }
};

// File System Access API — read/write local files
async function openFile() {
  const [fileHandle] = await window.showOpenFilePicker({
    types: [{ description: 'JSON files', accept: { 'application/json': ['.json'] } }],
  });
  const file = await fileHandle.getFile();
  const content = await file.text();
  return JSON.parse(content);
}

// Web Animations API — script control over animations
const el = document.querySelector('.box');
const animation = el.animate([
  { transform: 'translateX(0)', opacity: 1 },
  { transform: 'translateX(200px)', opacity: 0 },
], {
  duration: 500,
  easing: 'ease-out',
  fill: 'forwards',
});

animation.onfinish = () => el.remove();`,
      language: 'javascript',
    },
    interviewAnswer: 'ResizeObserver is the one I reach for most — it replaces the hacky window resize + getBoundingClientRect pattern for responsive components. Broadcast Channel solved a real problem for me: keeping auth state in sync across tabs without polling. Web Share API is easy to implement and hugely improves mobile UX — users get their native share sheet instead of a custom one.',
    commonMistakes: [
      'Still using window.resize for element-level size changes (use ResizeObserver)',
      'Not checking browser support for newer APIs (File System Access)',
      'Forgetting to disconnect observers (memory leaks)',
    ],
    realWorldUse: 'VS Code for the Web uses File System Access API. Most modern websites use Intersection Observer for lazy loading.',
    followUpQuestions: ['What is the Page Visibility API?', 'How does the Notifications API work?'],
  },

  {
    id: 'fe-rendering-patterns',
    category: 'frontend',
    type: 'theory',
    question: 'What are the different web rendering patterns (CSR, SSR, SSG, ISR, Streaming)?',
    difficulty: 'intermediate',
    tags: ['rendering', 'csr', 'ssr', 'ssg', 'isr', 'next-js'],
    shortAnswer: 'CSR (client-side): JS renders in browser — bad for SEO/LCP. SSR: renders on server per request — good SEO, slower TTFB for uncached. SSG: pre-built at deploy — fastest, but stale. ISR: SSG + revalidate interval. Streaming: SSR in chunks — faster FCP with Suspense.',
    detailedExplanation: 'Each pattern has different trade-offs for performance, SEO, and data freshness. CSR delivers a blank HTML shell then JS renders everything — bad initial load. SSR renders fresh HTML per request — good for personalised, real-time data. SSG generates HTML at build time — blazing fast from CDN. ISR (Next.js) serves stale SSG while revalidating in background. React Streaming SSR sends HTML in chunks, allowing early page interaction while data loads.',
    example: {
      code: `// Next.js App Router — choose per component/page

// SSG (Static Site Generation) — built at deploy time
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map(p => ({ slug: p.slug }));
}

export default async function BlogPost({ params }) {
  const post = await getPost(params.slug); // Runs at BUILD TIME
  return <article>{post.content}</article>;
}

// ISR (Incremental Static Regeneration) — revalidate interval
export const revalidate = 60; // Rebuild every 60 seconds on next request

// Or on-demand revalidation
import { revalidatePath } from 'next/cache';
// await revalidatePath('/blog/my-post'); // Call from API route/action

// SSR (Server-Side Rendering) — rendered per request
export const dynamic = 'force-dynamic'; // Or no cache in fetch

export default async function DashboardPage() {
  const user = await getUser(); // Runs on EVERY request
  return <Dashboard user={user} />;
}

// Streaming SSR — send HTML in chunks
import { Suspense } from 'react';

export default function ProductPage({ params }) {
  return (
    <>
      {/* Sent immediately — fast FCP */}
      <ProductHeader productId={params.id} />

      {/* Sent when reviews load — doesn't block page */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews productId={params.id} />  {/* Async data fetch */}
      </Suspense>
    </>
  );
}

// CSR (Client-Side Rendering) — when to use
'use client';
import { useState, useEffect } from 'react';

function UserDashboard() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('/api/user-data').then(r => r.json()).then(setData);
  }, []);
  // Rendered in browser — fine for highly interactive, user-specific UIs
}

// Decision guide:
// Blog posts → SSG (fast, SEO, content rarely changes)
// Product pages → ISR (fast CDN + fresh prices)
// User dashboard → SSR or CSR (personalised, no public SEO value)
// Social feeds → Streaming SSR (fast initial + async content)
// Admin panels → CSR (no SEO needed, complex interactions)`,
      language: 'typescript',
    },
    interviewAnswer: 'The rendering pattern decision is about trade-offs between performance, freshness, and SEO. I default to SSG for marketing/content pages — they\'re on CDN, fast globally, and great for SEO. For product pages with inventory/pricing that changes, ISR gives CDN speed with revalidation. User dashboards don\'t need SEO, so SSR or CSR works. Streaming SSR with Suspense is the most exciting pattern — it lets you send the page shell instantly while data loads progressively.',
    commonMistakes: [
      'Using CSR for pages that need SEO (blog, landing pages)',
      'Using SSR for everything (even static content)',
      'Not understanding that ISR serves stale data during revalidation window',
    ],
    realWorldUse: 'Next.js, Remix, Astro, SvelteKit all implement these patterns. Choosing the right pattern per page is a key Next.js skill.',
    followUpQuestions: ['What is the difference between SSR and Streaming SSR?', 'What is Edge SSR?'],
  },

  {
    id: 'fe-bundle-optimization',
    category: 'frontend',
    type: 'theory',
    question: 'How do you analyse and optimise a JavaScript bundle?',
    difficulty: 'intermediate',
    tags: ['bundle-size', 'webpack', 'vite', 'tree-shaking', 'analysis'],
    shortAnswer: 'Analyse with Bundle Analyzer (webpack-bundle-analyzer, vite-bundle-visualizer). Optimise: code splitting by route, dynamic imports for heavy libs, tree-shaking with ES modules, replace heavy deps with lighter alternatives, use CDN for large libraries.',
    detailedExplanation: 'Large bundles increase parse/execute time and initial load. Workflow: measure with Lighthouse/WebPageTest, analyse with bundle visualizer to find large packages, optimise the biggest wins first. Common optimisations: lazy load routes and rarely-used features, replace moment.js with date-fns, replace lodash with lodash-es or native methods, dynamic import for chart/editor libraries, externalize large libs to CDN.',
    example: {
      code: `// 1. Analyse bundle
// webpack: npm install --save-dev webpack-bundle-analyzer
// vite: npm install --save-dev rollup-plugin-visualizer

// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  plugins: [
    visualizer({
      filename: 'dist/stats.html',
      open: true,      // Auto-open in browser
      gzipSize: true,  // Show gzip sizes
      brotliSize: true,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        // Manual chunk splitting
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          'vendor-charts': ['recharts', 'd3'],  // Heavy libs in own chunk
        },
      },
    },
  },
};

// 2. Dynamic imports for heavy libraries
// ❌ Loads Monaco Editor for EVERYONE even if they never use the editor
import MonacoEditor from '@monaco-editor/react';

// ✅ Load only when needed
const MonacoEditor = lazy(() => import('@monaco-editor/react'));

// ❌ Import entire date library
import moment from 'moment'; // 300KB+ gzipped

// ✅ Tree-shakeable alternative
import { format, parseISO, addDays } from 'date-fns'; // Only what you use

// 3. Replace heavy dependencies
// moment → date-fns or native Intl
// lodash → lodash-es or native methods
// axios → native fetch

// ❌ Lodash entire library
import _ from 'lodash';
const result = _.chunk([1,2,3,4], 2);

// ✅ Individual import (tree-shakeable)
import chunk from 'lodash-es/chunk';
// Or just use native:
const chunk = (arr, size) => Array.from({ length: Math.ceil(arr.length/size) },
  (_, i) => arr.slice(i * size, (i + 1) * size));

// 4. Bundle analysis in CI
// bundlesize — fail CI if bundle exceeds limit
// package.json
{
  "bundlesize": [
    { "path": "./dist/index-*.js", "maxSize": "150 kB" },
    { "path": "./dist/vendor-*.js", "maxSize": "300 kB" }
  ]
}

// 5. Measure impact
// Before: 1.2MB initial JS
// After: 200KB initial, rest lazy-loaded`,
      language: 'typescript',
    },
    interviewAnswer: 'I start with webpack-bundle-analyzer or the Vite visualizer — it shows a treemap of what\'s in the bundle. Usually one or two packages account for 50%+ of the size. Common culprits: moment.js (replaced by date-fns), entire lodash, large chart libraries loaded for every user. Dynamic import for any feature that\'s not in the critical path immediately halves load time for most users. Setting bundle size budgets in CI prevents regression.',
    commonMistakes: [
      'Not measuring before optimising',
      'Optimising small packages while leaving moment.js (300KB)',
      'Using import * as _ from lodash (not tree-shakeable)',
    ],
    realWorldUse: 'Every production SPA. Vercel shows bundle size in deployment summaries. Import Cost VS Code extension shows sizes inline.',
    followUpQuestions: ['What is tree shaking and when does it fail?', 'What is the difference between gzip and brotli compression?'],
  },

  {
    id: 'fe-css-in-js',
    category: 'frontend',
    type: 'theory',
    question: 'What is CSS-in-JS? What are the tradeoffs of styled-components vs CSS Modules vs Tailwind?',
    difficulty: 'intermediate',
    tags: ['css-in-js', 'styled-components', 'css-modules', 'tailwind'],
    shortAnswer: 'CSS-in-JS (styled-components, Emotion): colocated styles, dynamic theming, but runtime overhead. CSS Modules: scoped class names, no runtime, file per component. Tailwind: utility classes, minimal CSS output with PurgeCSS, but verbose HTML.',
    detailedExplanation: 'Three main approaches to component styling. CSS-in-JS (styled-components/Emotion): styles in JS files, automatic scoping, dynamic styles based on props, great DX but adds runtime JS and is slower in SSR. CSS Modules: regular CSS with scoped class names compiled at build time — no runtime, no extra JS. Tailwind: utility-first CSS, entire stylesheet generated then purged — tiny final CSS, no naming required, verbose markup.',
    example: {
      code: `// 1. styled-components (CSS-in-JS)
import styled from 'styled-components';

// ✅ Dynamic styles from props
const Button = styled.button<{ variant: 'primary' | 'danger' }>\`
  padding: 0.5rem 1rem;
  background: \${({ variant }) => variant === 'danger' ? '#ef4444' : '#6366f1'};
  color: white;
  border-radius: 6px;

  &:hover { filter: brightness(1.1); }
\`;

<Button variant="danger">Delete</Button>

// Tradeoffs:
// ✅ Colocated styles, TypeScript-typed props, dynamic
// ❌ Runtime cost (300KB+ library), hydration issues in SSR, harder to debug
// ❌ Slower than CSS Modules for large apps (Next.js added warnings)

// 2. CSS Modules
// Button.module.css
/*
.button { padding: 0.5rem 1rem; border-radius: 6px; }
.primary { background: #6366f1; color: white; }
.danger { background: #ef4444; color: white; }
*/

import styles from './Button.module.css';
import clsx from 'clsx';

function Button({ variant = 'primary', children }) {
  return (
    <button className={clsx(styles.button, styles[variant])}>
      {children}
    </button>
  );
}

// Tradeoffs:
// ✅ No runtime, standard CSS, fast, good browser devtools
// ✅ Scoped automatically (Button__button__abc123)
// ❌ Separate file, props require clsx/conditional class logic

// 3. Tailwind CSS
<button className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 
  transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
  Submit
</button>

// Dynamic classes (must be complete strings for PurgeCSS):
const variantClasses = {
  primary: 'bg-indigo-500 hover:bg-indigo-600',
  danger: 'bg-red-500 hover:bg-red-600',
};
<button className={\`px-4 py-2 text-white rounded \${variantClasses[variant]}\`}>

// Tradeoffs:
// ✅ Tiny production CSS (purged), no naming, design system enforced
// ✅ No context switching between files
// ❌ Verbose HTML, learning curve, harder to see design intent

// 4. Zero-runtime CSS-in-JS (Vanilla Extract, Linaria)
// Compiled to CSS at build time — best of both worlds
import { style } from '@vanilla-extract/css';

export const button = style({
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  selectors: { '&:hover': { filter: 'brightness(1.1)' } },
});`,
      language: 'typescript',
    },
    interviewAnswer: 'The landscape has shifted away from runtime CSS-in-JS. styled-components was excellent but Next.js shows warnings about it now because of SSR overhead. For new projects I use Tailwind for most styling (great design system, tiny output) and CSS Modules for complex components where utility classes get unwieldy. Zero-runtime CSS-in-JS (Vanilla Extract) is the best of both worlds — CSS in TypeScript, compiled to static CSS at build time.',
    commonMistakes: [
      'Using styled-components in Next.js without the babel plugin (hydration issues)',
      'Not setting up content purging in Tailwind (huge CSS output)',
      'Dynamic Tailwind classes with string interpolation (not purged correctly)',
    ],
    realWorldUse: 'Vercel/Next.js team moved from CSS-in-JS to Tailwind. GitHub uses CSS custom properties. Most new React projects use Tailwind.',
    followUpQuestions: ['What is zero-runtime CSS-in-JS?', 'How does Tailwind\'s PurgeCSS work?'],
  },

  {
    id: 'fe-accessibility-testing',
    category: 'frontend',
    type: 'theory',
    question: 'How do you test web accessibility programmatically and manually?',
    difficulty: 'intermediate',
    tags: ['accessibility', 'testing', 'axe', 'screen-reader', 'wcag'],
    shortAnswer: 'Automated: axe-core (catches ~30% of issues), Lighthouse accessibility audit, eslint-plugin-jsx-a11y. Manual: keyboard navigation (Tab/Enter/Escape/Arrow keys), screen reader testing (NVDA + Firefox, VoiceOver + Safari), color contrast checker, zoom to 200%.',
    detailedExplanation: 'No single tool catches all accessibility issues. Automated tools catch structural problems (missing alt text, invalid ARIA, no form labels). But they can\'t test whether content is understandable to screen reader users. Manual testing with actual assistive technology is essential. Testing checklist: keyboard navigation, screen reader flow, zoom to 200%, colour contrast, motion preferences, high contrast mode.',
    example: {
      code: `// 1. jest-axe — automated a11y testing in unit tests
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('LoginForm accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<LoginForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no violations in error state', async () => {
    const { container } = render(<LoginForm error="Invalid credentials" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// 2. Storybook + a11y addon
// .storybook/main.js
module.exports = {
  addons: ['@storybook/addon-a11y'],
};

// Every story runs axe automatically and shows violations in panel

// 3. ESLint plugin jsx-a11y (catches issues during development)
// .eslintrc.js
{
  "plugins": ["jsx-a11y"],
  "extends": ["plugin:jsx-a11y/recommended"]
}
// Catches: missing alt, onClick without keyboard handler, invalid ARIA, etc.

// 4. Keyboard navigation testing checklist
// - Every interactive element reachable by Tab
// - Tab order is logical (follows visual order)
// - No keyboard traps (can always Tab away)
// - Enter/Space activates buttons and links
// - Escape closes modals and dropdowns
// - Arrow keys navigate within composite widgets (menus, tabs, grids)
// - Visible focus indicator on all focusable elements

// 5. Screen reader testing
// Windows: NVDA (free) + Firefox, JAWS + Chrome
// Mac/iOS: VoiceOver (built-in) + Safari
// Android: TalkBack + Chrome

// Common screen reader commands (NVDA):
// Caps Lock: NVDA modifier key
// Caps Lock + Space: toggle browse/interaction mode
// H: next heading, Shift+H: previous heading
// K: next link, B: next button
// Tab: next focusable element

// 6. Check focus management in modals
function AccessibleModal({ isOpen, onClose, title, children }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<Element | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      // Move focus into modal
      modalRef.current?.focus();
    } else {
      // Restore focus when closed
      (previousFocusRef.current as HTMLElement)?.focus();
    }
  }, [isOpen]);

  return isOpen ? (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabIndex={-1}
    >
      <h2 id="modal-title">{title}</h2>
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  ) : null;
}`,
      language: 'typescript',
    },
    interviewAnswer: 'I add jest-axe to every component test — it catches the obvious issues automatically without extra effort. For interactive components I also test keyboard navigation manually: can I reach everything with Tab? Does Escape close the modal? Does the focus return to the trigger after closing? Screen reader testing reveals things automated tools miss — like a button that makes sense visually but is completely confusing when read aloud.',
    commonMistakes: [
      'Thinking automated testing covers all accessibility (it covers ~30%)',
      'Testing keyboard but not screen reader',
      'Not testing with real assistive technology',
    ],
    realWorldUse: 'Government, finance, and healthcare sites have legal a11y requirements. WCAG 2.1 AA is the standard target in most countries.',
    followUpQuestions: ['What WCAG level should most sites target?', 'What is a screen reader and how does it work?'],
  },

  {
    id: 'fe-state-management-patterns',
    category: 'frontend',
    type: 'theory',
    question: 'How do you choose between local state, Context, Redux, and server state libraries?',
    difficulty: 'intermediate',
    tags: ['state-management', 'redux', 'react-query', 'context', 'zustand'],
    shortAnswer: 'Decision tree: UI state (modal open, form value) → useState. Shared UI state (few components) → Context. Complex shared state → Zustand/Redux. Server/async data → React Query/SWR. Most apps only need useState + React Query.',
    detailedExplanation: 'Over-engineering state management is a common React mistake. Most state is either local (belongs to one component) or server data (fetched from API). React Query/SWR handle server state far better than Redux — built-in caching, deduplication, background refresh, optimistic updates. Redux makes sense for complex client-side state like collaborative editors or offline-first apps. The trend is toward server components + React Query, away from Redux.',
    example: {
      code: `// 1. Local state — most state should be local
function SearchBox() {
  const [query, setQuery] = useState(''); // Belongs here only
  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}

// 2. Lifted state — shared between siblings
function ProductList() {
  const [filter, setFilter] = useState('all'); // Shared with FilterBar

  return (
    <>
      <FilterBar value={filter} onChange={setFilter} />
      <Products filter={filter} />
    </>
  );
}

// 3. Context — theme, auth, few updates
const AuthContext = createContext<User | null>(null);
// Good for: current user, theme, language — changes rarely

// 4. Zustand — complex client state
const useCartStore = create((set) => ({
  items: [],
  addItem: (item) => set(state => ({ items: [...state.items, item] })),
}));
// Good for: cart, wizard state, UI state across unrelated components

// 5. React Query — server/async data (replace Redux for most apps)
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function UserList() {
  // Handles loading, error, caching, deduplication, background refresh
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(r => r.json()),
    staleTime: 60_000,     // Cache for 60 seconds
    gcTime: 300_000,       // Keep in memory for 5 minutes
  });

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

// Mutations with cache invalidation
const queryClient = useQueryClient();
const deleteUser = useMutation({
  mutationFn: (id) => fetch(\`/api/users/\${id}\`, { method: 'DELETE' }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] }); // Auto-refetch
  },
  onMutate: (id) => {
    // Optimistic update — remove immediately
    queryClient.setQueryData(['users'], (old) => old.filter(u => u.id !== id));
  },
});

// Decision guide:
// form input value → useState
// modal open/close → useState
// current user → Context (reads from auth provider)
// API data → React Query
// cart (persisted, complex) → Zustand
// collaborative editor, offline → Redux Toolkit`,
      language: 'typescript',
    },
    interviewAnswer: 'The biggest shift in my thinking was realising that most Redux code I\'ve written was just for server data — fetching, caching, loading states. React Query does all of that better with less code. Now my rule is: start with useState, lift when needed, add Context for rarely-changing global data, React Query for everything from the server, and Zustand only when I have genuinely complex client-side state. Most apps don\'t need Redux at all.',
    commonMistakes: [
      'Using Redux for server data (React Query is better)',
      'Putting everything in Redux "just in case"',
      'Using Context for frequently-changing data (performance)',
    ],
    realWorldUse: 'Most new React projects use React Query + Zustand or just React Query + useState. Redux is still used in enterprise code and complex apps.',
    followUpQuestions: ['What is the staleTime option in React Query?', 'How does React Query\'s cache work?'],
  },

  {
    id: 'fe-error-boundaries-patterns',
    category: 'frontend',
    type: 'theory',
    question: 'What are effective patterns for error handling in React applications?',
    difficulty: 'intermediate',
    tags: ['error-handling', 'error-boundaries', 'monitoring', 'sentry'],
    shortAnswer: 'Layer error handling: React Error Boundaries for render errors, try/catch in async handlers, React Query\'s isError for data fetching errors, toast notifications for user feedback, and Sentry/Datadog for production monitoring.',
    detailedExplanation: 'Error handling in React has multiple layers. Error Boundaries catch render errors and show fallback UI. async/await in event handlers needs try/catch. React Query handles data fetching errors with isError/error states. Global unhandled promise rejection catches async errors that slip through. Production monitoring (Sentry) captures all errors with stack traces and user context.',
    example: {
      code: `// 1. Reusable Error Boundary with reset
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" className="error-container">
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

// Wrap sections independently — not just the whole app
function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}
      onError={(error, info) => logger.error(error, info)}>
      <Header />
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <MainContent />
      </ErrorBoundary>
      <Footer />
    </ErrorBoundary>
  );
}

// 2. React Query error handling
function UserProfile({ id }) {
  const { data, isError, error, refetch } = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUser(id),
    retry: 1,                // Retry once on failure
    retryDelay: 1000,
  });

  if (isError) {
    return (
      <div>
        <p>Failed to load profile: {error.message}</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }
}

// 3. Async event handler errors → toast notification
function SaveButton({ data }) {
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    setIsSaving(true);
    try {
      await saveData(data);
      toast.success('Saved successfully!');
    } catch (err) {
      // Don't show technical error to users
      toast.error('Failed to save. Please try again.');
      // Log technical details for debugging
      logger.error({ err, data }, 'Save failed');
    } finally {
      setIsSaving(false);
    }
  }
}

// 4. Sentry integration
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  // Add user context for better debugging
  beforeSend: (event) => {
    if (event.user) {
      event.user.id = currentUser?.id;
    }
    return event;
  },
});

// Wrap app with Sentry ErrorBoundary
const App = Sentry.withErrorBoundary(MyApp, {
  fallback: <ErrorPage />,
  showDialog: true, // Show report dialog to user
});

// 5. Global unhandled promise rejection
window.addEventListener('unhandledrejection', (event) => {
  Sentry.captureException(event.reason);
  console.error('Unhandled promise rejection:', event.reason);
});`,
      language: 'typescript',
    },
    interviewAnswer: 'I layer error handling: Error Boundaries catch render crashes and show fallback UI, React Query manages data fetching errors with retry logic, and event handler errors go to try/catch with user-friendly toast messages. The important distinction: what to show users (friendly message) vs what to log (full error with stack trace). Sentry is indispensable in production — it captures everything with full context so I know about errors before users report them.',
    commonMistakes: [
      'Single Error Boundary for the whole app (one error = blank page)',
      'Showing technical error messages to users',
      'No production error monitoring',
    ],
    realWorldUse: 'Every production React app needs Error Boundaries. react-error-boundary library makes it simpler. Sentry has a generous free tier.',
    followUpQuestions: ['What errors don\'t Error Boundaries catch?', 'How do you add user context to Sentry errors?'],
  },

  {
    id: 'fe-typescript-advanced',
    category: 'frontend',
    type: 'theory',
    question: 'What are advanced TypeScript patterns useful in frontend development?',
    difficulty: 'advanced',
    tags: ['typescript', 'advanced', 'generics', 'utility-types'],
    shortAnswer: 'Key advanced patterns: discriminated unions for state machines, conditional types for flexible utilities, template literal types for string patterns, const assertions, satisfies operator, and utility types (Partial, Required, Pick, Omit, ReturnType, Parameters).',
    detailedExplanation: 'Advanced TypeScript patterns improve type safety without sacrificing DX. Discriminated unions model state machines (loading/error/success). Template literal types type URL patterns or event names. Conditional types create types that depend on other types. The satisfies operator validates type without widening it. Type predicates narrow types in conditionals. Branded types prevent mixing semantically different values.',
    example: {
      code: `// 1. Discriminated unions — state machine
type FetchState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function UserProfile({ state }: { state: FetchState<User> }) {
  switch (state.status) {
    case 'loading': return <Spinner />;
    case 'error': return <p>{state.error.message}</p>;    // TypeScript knows error exists
    case 'success': return <p>{state.data.name}</p>;      // TypeScript knows data exists
    default: return null;
  }
}

// 2. Template literal types — type-safe string patterns
type EventName = 'user' | 'order' | 'product';
type EventAction = 'created' | 'updated' | 'deleted';
type AnalyticsEvent = \`\${EventName}_\${EventAction}\`;
// "user_created" | "user_updated" | "user_deleted" | "order_created" | ...

function track(event: AnalyticsEvent, data?: object) {
  analytics.track(event, data);
}
track('user_created', { userId: '123' }); // ✅
track('user_purchased', {}); // ❌ TypeScript error!

// 3. Utility types
interface User { id: string; name: string; email: string; role: 'admin' | 'user'; }

type UserPreview = Pick<User, 'id' | 'name'>;
type CreateUserInput = Omit<User, 'id'>;
type PartialUser = Partial<User>; // All optional
type RequiredUser = Required<User>; // All required

// 4. Generic components with constraints
function Table<T extends { id: string }>(props: {
  data: T[];
  columns: Array<{ key: keyof T; label: string }>;
  onRowClick?: (item: T) => void;
}) {
  return (
    <table>
      <tbody>
        {props.data.map(item => (
          <tr key={item.id} onClick={() => props.onRowClick?.(item)}>
            {props.columns.map(col => (
              <td key={String(col.key)}>{String(item[col.key])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// 5. satisfies — validate without widening
const config = {
  theme: 'dark',
  language: 'en',
} satisfies Record<string, string>;
// config.theme is 'dark' (not widened to string)

// 6. Branded types — prevent mixing semantically different IDs
type UserId = string & { readonly __brand: 'UserId' };
type OrderId = string & { readonly __brand: 'OrderId' };

function getUser(id: UserId): User { ... }
function getOrder(id: OrderId): Order { ... }

const userId = '123' as UserId;
const orderId = '456' as OrderId;
getUser(orderId); // ❌ TypeScript error! Wrong ID type`,
      language: 'typescript',
    },
    interviewAnswer: 'Discriminated unions are the pattern I use most — they make impossible states unrepresentable. Instead of separate loading/error/data booleans that can be in contradictory states, one union type with status field ensures the component handles every case. Branded types are underused — they prevent passing an OrderId where a UserId is expected, which is a class of bug that causes real production issues.',
    commonMistakes: [
      'Using boolean flags instead of discriminated unions for state',
      'Overusing any to avoid complex types',
      'Not knowing the satisfies keyword (available since TS 4.9)',
    ],
    realWorldUse: 'Any large TypeScript codebase. These patterns are heavily used in Next.js, tRPC, and React Router v6+.',
    followUpQuestions: ['What is the difference between type and interface?', 'What is the satisfies operator?'],
  },
];
