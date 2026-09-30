import type { Metadata } from 'next';
import { COURSES } from '@/lib/courses';
import { LESSON_SEO } from '@/data/seo/lessons';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://webdevatlas.com').replace(/\/$/, '');
export const SITE_NAME = 'WebDev Atlas';

/** Google Search Console's HTML-tag verification code (Settings → Ownership verification → HTML tag → the "content" value only, not the full <meta> tag). Empty until set. */
export const GOOGLE_SITE_VERIFICATION = (process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? '').trim();

/** SEO landing pages (cheat sheets, roadmaps, question banks) that belong in the sitemap. Add a path here when a hub page is created. */
export const HUB_PAGES: string[] = [
  '/javascript-cheatsheet',
  '/html-cheatsheet',
  '/css-cheatsheet',
  '/react-hooks-cheatsheet',
  '/frontend-roadmap',
  '/mern-roadmap',
  '/javascript-practice',
  '/javascript-interview-questions',
  '/react-interview-questions',
  '/nodejs-interview-questions',
  '/typescript-cheatsheet',
  '/typescript-interview-questions',
  '/nextjs-cheatsheet',
  '/nextjs-interview-questions',
  '/sql-interview-questions',
  '/mongodb-interview-questions',
  '/postgresql-interview-questions',
  '/docker-interview-questions',
  '/git-interview-questions',
  '/redis-interview-questions',
  '/express-interview-questions',
  '/nodejs-cheatsheet',
  '/express-cheatsheet',
  '/mongodb-cheatsheet',
  '/postgresql-cheatsheet',
  '/git-cheatsheet',
  '/docker-cheatsheet',
  '/sql-cheatsheet',
  '/sqlite-cheatsheet',
  '/redis-cheatsheet',
  '/restapi-cheatsheet',
  '/html-interview-questions',
  '/css-interview-questions',
  '/sqlite-interview-questions',
  '/restapi-interview-questions',
];

/** Site pages (About, Contact and the policies) that belong in the sitemap. */
export const INFO_PAGES: string[] = ['/about', '/contact', '/privacy-policy', '/terms', '/disclaimer'];

/** Public contact address shown on the site. Placeholder until a real mailbox exists: set NEXT_PUBLIC_CONTACT_EMAIL to change it. */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'contact@webdevatlas.com';

/** How each course is written in a page title ("… — JavaScript Tutorial"). */
export const COURSE_KEYWORD: Record<string, string> = {
  html: 'HTML', css: 'CSS', js: 'JavaScript', typescript: 'TypeScript', react: 'React', nextjs: 'Next.js', nodejs: 'Node.js',
  express: 'Express.js', mongodb: 'MongoDB', postgresql: 'PostgreSQL', sql: 'SQL', sqlite: 'SQLite', redis: 'Redis',
  docker: 'Docker', git: 'Git', restapi: 'REST API',
};

interface LessonBasics { slug: string; title: string; description?: string }

const MAX_TITLE = 50; // the site adds " | WebDev Atlas" → stays under Google's ~65 characters

/** Meta descriptions read best at 110–158 characters: pad very short ones, cut long ones at a sentence or word. */
export function clampDescription(text: string, keyword: string): string {
  let d = text.replace(/\s+/g, ' ').trim();
  if (d.length < 110) d = `${d}${/[.!?]$/.test(d) ? '' : '.'} Learn ${keyword} with clear examples and a live code editor.`;
  if (d.length <= 158) return d;
  const cut = d.slice(0, 158);
  const sentence = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '));
  if (sentence >= 90) return cut.slice(0, sentence + 1);
  const space = cut.lastIndexOf(' ');
  return `${cut.slice(0, space > 100 ? space : 155).replace(/[,;:\-–—]$/, '')}…`;
}

function generatedTitle(keyword: string, lessonTitle: string): string {
  const t = lessonTitle.trim();
  const already = t.toLowerCase().includes(keyword.toLowerCase());
  const options = already ? [`${t} Tutorial`, t] : [`${t} — ${keyword} Tutorial`, `${t} (${keyword})`, `${t} in ${keyword}`];
  for (const o of options) if (o.length <= MAX_TITLE) return o;
  const base = options[options.length - 1];
  return `${base.slice(0, MAX_TITLE - 1).replace(/\s+\S*$/, '')}…`;
}

export function courseLabelOf(courseId: string): string {
  return COURSE_KEYWORD[courseId] ?? COURSES.find((c) => c.id === courseId)?.label ?? courseId;
}

export function lessonPath(courseId: string, slug: string): string {
  const course = COURSES.find((c) => c.id === courseId);
  return `${course ? course.base : `/learn/${courseId}/`}${slug}`;
}

/** Title, description and H1 for a lesson page: hand-written copy when we have it, otherwise generated from the lesson. */
export function lessonSeo(courseId: string, lesson: LessonBasics): { title: string; description: string; h1: string } {
  const keyword = courseLabelOf(courseId);
  const curated = LESSON_SEO[`${courseId}/${lesson.slug}`];
  return {
    title: curated?.title ?? generatedTitle(keyword, lesson.title),
    description: clampDescription(curated?.description ?? lesson.description ?? lesson.title, keyword),
    h1: curated?.h1 ?? lesson.title,
  };
}

export function pageMetadata(o: { title: string; description: string; path: string; type?: 'website' | 'article' }): Metadata {
  return {
    title: o.title,
    description: o.description,
    alternates: { canonical: o.path },
    // a page-level openGraph object replaces the parent's, so the default share image is repeated here
    openGraph: { title: o.title, description: o.description, url: o.path, siteName: SITE_NAME, type: o.type ?? 'website', locale: 'en_US', images: ['/opengraph-image'] },
    twitter: { card: 'summary_large_image', title: o.title, description: o.description, images: ['/opengraph-image'] },
  };
}

export function lessonMetadata(courseId: string, lesson: LessonBasics): Metadata {
  const seo = lessonSeo(courseId, lesson);
  return pageMetadata({ title: seo.title, description: seo.description, path: lessonPath(courseId, lesson.slug), type: 'article' });
}

/** The lesson with its on-page heading replaced by the search-friendly H1 (sidebar / navigation keep the original title). */
export function withH1<T extends { slug: string; title: string }>(courseId: string, lesson: T): T {
  const h1 = LESSON_SEO[`${courseId}/${lesson.slug}`]?.h1;
  return h1 ? { ...lesson, title: h1 } : lesson;
}

export interface RelatedLink { href: string; title: string; course: string; description: string }

/** Curated related lessons when we have them, otherwise the next lessons of the same course. */
export function relatedLessons(courseId: string, slug: string, limit = 4): RelatedLink[] {
  const find = (cid: string, s: string): RelatedLink | null => {
    const course = COURSES.find((c) => c.id === cid);
    const lesson = course?.lessons.find((l) => l.slug === s);
    return course && lesson ? { href: course.base + lesson.slug, title: lesson.title, course: courseLabelOf(cid), description: lesson.description ?? '' } : null;
  };
  const curated = (LESSON_SEO[`${courseId}/${slug}`]?.related ?? []).map((k) => { const [c, ...rest] = k.split('/'); return find(c, rest.join('/')); }).filter((x): x is RelatedLink => !!x);
  if (curated.length >= 2) return curated.slice(0, limit);
  const course = COURSES.find((c) => c.id === courseId);
  if (!course) return curated;
  const i = course.lessons.findIndex((l) => l.slug === slug);
  const out: RelatedLink[] = [...curated];
  for (let k = 1; k <= course.lessons.length && out.length < Math.min(limit, 3); k++) {
    const l = course.lessons[(i + k) % course.lessons.length];
    if (l && l.slug !== slug && !out.some((o) => o.href === course.base + l.slug)) out.push({ href: course.base + l.slug, title: l.title, course: courseLabelOf(courseId), description: l.description ?? '' });
  }
  return out;
}

/** schema.org data for a lesson: the article itself plus its breadcrumb trail. */
export function lessonJsonLd(courseId: string, lesson: LessonBasics) {
  const seo = lessonSeo(courseId, lesson);
  const url = `${SITE_URL}${lessonPath(courseId, lesson.slug)}`;
  const keyword = courseLabelOf(courseId);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        headline: seo.h1,
        description: seo.description,
        url,
        mainEntityOfPage: url,
        inLanguage: 'en',
        about: keyword,
        isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
        publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: `${keyword} Tutorial`, item: `${SITE_URL}${lessonPath(courseId, '').replace(/\/$/, '')}` },
          { '@type': 'ListItem', position: 3, name: lesson.title, item: url },
        ],
      },
    ],
  };
}

/** Resolve a "course/slug" key to a lesson link (null when that lesson does not exist, so a stale key never renders a dead link). */
export function lessonLink(key: string): { href: string; title: string } | null {
  const [cid, ...rest] = key.split('/');
  const course = COURSES.find((c) => c.id === cid);
  const lesson = course?.lessons.find((l) => l.slug === rest.join('/'));
  return course && lesson ? { href: course.base + lesson.slug, title: lesson.title } : null;
}

export interface HubLink { label: string; href: string }

export const HUB = {
  jsCheat: { label: 'JavaScript cheat sheet', href: '/javascript-cheatsheet' },
  htmlCheat: { label: 'HTML cheat sheet', href: '/html-cheatsheet' },
  cssCheat: { label: 'CSS cheat sheet', href: '/css-cheatsheet' },
  hooksCheat: { label: 'React hooks cheat sheet', href: '/react-hooks-cheatsheet' },
  frontendRoadmap: { label: 'Frontend developer roadmap', href: '/frontend-roadmap' },
  mernRoadmap: { label: 'MERN stack roadmap', href: '/mern-roadmap' },
  jsPractice: { label: 'JavaScript practice questions', href: '/javascript-practice' },
  jsInterview: { label: 'JavaScript interview questions', href: '/javascript-interview-questions' },
  reactInterview: { label: 'React interview questions', href: '/react-interview-questions' },
  nodeInterview: { label: 'Node.js interview questions', href: '/nodejs-interview-questions' },
  tsCheat: { label: 'TypeScript cheat sheet', href: '/typescript-cheatsheet' },
  tsInterview: { label: 'TypeScript interview questions', href: '/typescript-interview-questions' },
  nextCheat: { label: 'Next.js cheat sheet', href: '/nextjs-cheatsheet' },
  nextInterview: { label: 'Next.js interview questions', href: '/nextjs-interview-questions' },
  sqlInterview: { label: 'SQL interview questions', href: '/sql-interview-questions' },
  mongoInterview: { label: 'MongoDB interview questions', href: '/mongodb-interview-questions' },
  postgresInterview: { label: 'PostgreSQL interview questions', href: '/postgresql-interview-questions' },
  dockerInterview: { label: 'Docker interview questions', href: '/docker-interview-questions' },
  gitInterview: { label: 'Git interview questions', href: '/git-interview-questions' },
  redisInterview: { label: 'Redis interview questions', href: '/redis-interview-questions' },
  expressInterview: { label: 'Express.js interview questions', href: '/express-interview-questions' },
  nodeCheat: { label: 'Node.js cheat sheet', href: '/nodejs-cheatsheet' },
  expressCheat: { label: 'Express.js cheat sheet', href: '/express-cheatsheet' },
  mongoCheat: { label: 'MongoDB cheat sheet', href: '/mongodb-cheatsheet' },
  postgresCheat: { label: 'PostgreSQL cheat sheet', href: '/postgresql-cheatsheet' },
  gitCheat: { label: 'Git cheat sheet', href: '/git-cheatsheet' },
  dockerCheat: { label: 'Docker cheat sheet', href: '/docker-cheatsheet' },
  sqlCheat: { label: 'SQL cheat sheet', href: '/sql-cheatsheet' },
  sqliteCheat: { label: 'SQLite cheat sheet', href: '/sqlite-cheatsheet' },
  redisCheat: { label: 'Redis cheat sheet', href: '/redis-cheatsheet' },
  restapiCheat: { label: 'REST API cheat sheet', href: '/restapi-cheatsheet' },
  htmlInterview: { label: 'HTML interview questions', href: '/html-interview-questions' },
  cssInterview: { label: 'CSS interview questions', href: '/css-interview-questions' },
  sqliteInterview: { label: 'SQLite interview questions', href: '/sqlite-interview-questions' },
  restapiInterview: { label: 'REST API interview questions', href: '/restapi-interview-questions' },
} satisfies Record<string, HubLink>;

/** Hub pages that fit each course (keyed by lesson course id) — shown under lessons and on course overview pages. */
export const HUB_LINKS_BY_COURSE: Record<string, HubLink[]> = {
  html: [HUB.htmlCheat, HUB.htmlInterview, HUB.frontendRoadmap],
  css: [HUB.cssCheat, HUB.cssInterview, HUB.frontendRoadmap],
  js: [HUB.jsCheat, HUB.jsPractice, HUB.jsInterview, HUB.frontendRoadmap],
  typescript: [HUB.tsCheat, HUB.tsInterview, HUB.frontendRoadmap, HUB.jsInterview],
  react: [HUB.hooksCheat, HUB.reactInterview, HUB.frontendRoadmap],
  nextjs: [HUB.nextCheat, HUB.nextInterview, HUB.reactInterview, HUB.frontendRoadmap],
  nodejs: [HUB.nodeCheat, HUB.nodeInterview, HUB.mernRoadmap],
  express: [HUB.expressCheat, HUB.expressInterview, HUB.nodeInterview, HUB.mernRoadmap],
  mongodb: [HUB.mongoCheat, HUB.mongoInterview, HUB.mernRoadmap, HUB.nodeInterview],
  restapi: [HUB.restapiCheat, HUB.restapiInterview, HUB.nodeInterview, HUB.mernRoadmap],
  sql: [HUB.sqlCheat, HUB.sqlInterview],
  postgresql: [HUB.postgresCheat, HUB.postgresInterview, HUB.sqlInterview],
  sqlite: [HUB.sqliteCheat, HUB.sqliteInterview, HUB.sqlInterview],
  docker: [HUB.dockerCheat, HUB.dockerInterview],
  git: [HUB.gitCheat, HUB.gitInterview],
  redis: [HUB.redisCheat, HUB.redisInterview],
};

/** /learn/<slug> overview slugs that use a different id than the lesson course id */
const OVERVIEW_TO_COURSE: Record<string, string> = { javascript: 'js', 'rest-api': 'restapi' };
const at = (hub: HubLink, hash: string, label: string): HubLink => ({ label, href: `${hub.href}#${hash}` });

/** Lessons that have a matching section on a cheat sheet ("course/slug" → deep links), shown ahead of the course-wide hub links. */
export const LESSON_GUIDES: Record<string, HubLink[]> = {
  'js/variables': [at(HUB.jsCheat, 'variables', 'Variables cheat sheet')],
  'js/data-types': [at(HUB.jsCheat, 'data-types', 'Data types cheat sheet')],
  'js/operators': [at(HUB.jsCheat, 'operators', 'Operators cheat sheet')],
  'js/conditions': [at(HUB.jsCheat, 'conditions', 'Conditions cheat sheet')],
  'js/loops': [at(HUB.jsCheat, 'loops', 'Loops cheat sheet')],
  'js/functions': [at(HUB.jsCheat, 'functions', 'Functions cheat sheet')],
  'js/arrays': [at(HUB.jsCheat, 'arrays', 'Array methods cheat sheet')],
  'js/objects': [at(HUB.jsCheat, 'objects', 'Objects cheat sheet')],
  'js/strings': [at(HUB.jsCheat, 'strings', 'String methods cheat sheet')],
  'js/dom': [at(HUB.jsCheat, 'dom', 'DOM cheat sheet')],
  'js/fetch-api': [at(HUB.jsCheat, 'fetch', 'Fetch API cheat sheet')],
  'js/async-await': [at(HUB.jsCheat, 'async-await', 'Async/await cheat sheet')],
  'js/error-handling': [at(HUB.jsCheat, 'errors', 'Error handling cheat sheet')],
  'js/es6-features': [at(HUB.jsCheat, 'es6', 'ES6+ cheat sheet')],
  'css/selectors': [at(HUB.cssCheat, 'selectors', 'Selectors cheat sheet')],
  'css/box-model': [at(HUB.cssCheat, 'box-model', 'Box model cheat sheet')],
  'css/colors-backgrounds': [at(HUB.cssCheat, 'colors-units', 'Colors and units cheat sheet')],
  'css/positioning': [at(HUB.cssCheat, 'display-position', 'Display and position cheat sheet')],
  'css/flexbox': [at(HUB.cssCheat, 'flexbox', 'Flexbox cheat sheet')],
  'css/grid': [at(HUB.cssCheat, 'grid', 'Grid cheat sheet')],
  'css/responsive': [at(HUB.cssCheat, 'responsive', 'Media queries cheat sheet')],
  'css/animations': [at(HUB.cssCheat, 'animations', 'Animations cheat sheet')],
  'html/introduction': [at(HUB.htmlCheat, 'structure', 'HTML page structure cheat sheet')],
  'html/attributes': [at(HUB.htmlCheat, 'attributes', 'Attributes cheat sheet')],
  'html/links': [at(HUB.htmlCheat, 'links-images', 'Links and images cheat sheet')],
  'html/images': [at(HUB.htmlCheat, 'links-images', 'Links and images cheat sheet')],
  'html/lists': [at(HUB.htmlCheat, 'lists-tables', 'Lists and tables cheat sheet')],
  'html/tables': [at(HUB.htmlCheat, 'lists-tables', 'Lists and tables cheat sheet')],
  'html/forms': [at(HUB.htmlCheat, 'forms', 'Forms cheat sheet')],
  'html/semantic': [at(HUB.htmlCheat, 'semantic', 'Semantic tags cheat sheet')],
  'html/layout': [at(HUB.htmlCheat, 'semantic', 'Semantic tags cheat sheet')],
  'html/head': [at(HUB.htmlCheat, 'head', 'Head and meta tags cheat sheet')],
  'react/state': [at(HUB.hooksCheat, 'usestate', 'useState cheat sheet')],
  'react/useeffect': [at(HUB.hooksCheat, 'useeffect', 'useEffect cheat sheet')],
  'react/fetch-data': [at(HUB.hooksCheat, 'useeffect', 'useEffect cheat sheet')],
  'react/useref': [at(HUB.hooksCheat, 'useref', 'useRef cheat sheet')],
  'react/context': [at(HUB.hooksCheat, 'usecontext', 'useContext cheat sheet')],
  'react/context-advanced': [at(HUB.hooksCheat, 'usereducer', 'useReducer cheat sheet')],
  'react/custom-hooks': [at(HUB.hooksCheat, 'custom-hooks', 'Custom hooks cheat sheet')],
  'react/performance': [at(HUB.hooksCheat, 'usememo-usecallback', 'useMemo and useCallback cheat sheet')],
  'typescript/basic-types': [at(HUB.tsCheat, 'basic-types', 'Basic types cheat sheet')],
  'typescript/arrays-tuples': [at(HUB.tsCheat, 'basic-types', 'Basic types cheat sheet')],
  'typescript/objects-interfaces': [at(HUB.tsCheat, 'interfaces-types', 'Interfaces and types cheat sheet')],
  'typescript/type-aliases': [at(HUB.tsCheat, 'interfaces-types', 'Interfaces and types cheat sheet')],
  'typescript/type-guards': [at(HUB.tsCheat, 'unions-narrowing', 'Unions and narrowing cheat sheet')],
  'typescript/functions': [at(HUB.tsCheat, 'functions', 'Functions cheat sheet')],
  'typescript/generics': [at(HUB.tsCheat, 'generics', 'Generics cheat sheet')],
  'typescript/utility-types': [at(HUB.tsCheat, 'utility-types', 'Utility types cheat sheet')],
  'typescript/classes': [at(HUB.tsCheat, 'classes', 'Classes cheat sheet')],
  'typescript/enums': [at(HUB.tsCheat, 'literals-enums', 'Literals and enums cheat sheet')],
  'typescript/tsconfig': [at(HUB.tsCheat, 'tsconfig', 'tsconfig cheat sheet')],
  'nextjs/file-routing': [at(HUB.nextCheat, 'routing', 'Routing cheat sheet')],
  'nextjs/layouts': [at(HUB.nextCheat, 'file-conventions', 'File conventions cheat sheet')],
  'nextjs/navigation': [at(HUB.nextCheat, 'navigation', 'Navigation cheat sheet')],
  'nextjs/server-components': [at(HUB.nextCheat, 'server-client', 'Server vs client components cheat sheet')],
  'nextjs/client-components': [at(HUB.nextCheat, 'server-client', 'Server vs client components cheat sheet')],
  'nextjs/data-fetching': [at(HUB.nextCheat, 'data-fetching', 'Data fetching cheat sheet')],
  'nextjs/static-generation': [at(HUB.nextCheat, 'rendering', 'Rendering cheat sheet')],
  'nextjs/api-routes': [at(HUB.nextCheat, 'route-handlers', 'Route handlers cheat sheet')],
  'nextjs/metadata': [at(HUB.nextCheat, 'metadata', 'Metadata cheat sheet')],
  'nextjs/image-optimization': [at(HUB.nextCheat, 'images-fonts', 'Images and fonts cheat sheet')],
  'nextjs/styling': [at(HUB.nextCheat, 'images-fonts', 'Images and fonts cheat sheet')],
  'nextjs/middleware': [at(HUB.nextCheat, 'proxy', 'Proxy and middleware cheat sheet')],
  'nextjs/env-config': [at(HUB.nextCheat, 'env', 'Environment variables cheat sheet')],
  'nextjs/error-handling': [at(HUB.nextCheat, 'loading-errors', 'Loading and error UI cheat sheet')],
};

/** Guides to show under a lesson: its own cheat-sheet section first, then the course-wide hub links (no repeats). */
export const guidesForLesson = (courseId: string, slug: string): HubLink[] => {
  const seen = new Set<string>();
  return [...(LESSON_GUIDES[`${courseId}/${slug}`] ?? []), ...(HUB_LINKS_BY_COURSE[courseId] ?? [])].filter((l) => !seen.has(l.href) && seen.add(l.href));
};

export const hubLinksForOverview =(slug: string): HubLink[] => HUB_LINKS_BY_COURSE[OVERVIEW_TO_COURSE[slug] ?? slug] ?? [];
