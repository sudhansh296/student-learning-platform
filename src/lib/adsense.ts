// Google AdSense settings. Everything is off until NEXT_PUBLIC_ADSENSE_CLIENT is set (e.g. ca-pub-1234567890123456),
// so nothing loads, no ads appear and the CSP stays strict until the site has an approved AdSense account.

export const ADSENSE_CLIENT = (process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? '').trim();

/** true only for a well-formed publisher id */
export const ADSENSE_ENABLED = /^ca-pub-\d{10,20}$/.test(ADSENSE_CLIENT);

/** "pub-1234…" form used in ads.txt */
export const ADSENSE_PUB_ID = ADSENSE_CLIENT.replace(/^ca-/, '');

export const ADSENSE_SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;

/**
 * Ads are allowed only on pages with real reading content: lessons, projects, interview guides, cheat sheets,
 * question banks and roadmap guides. Google does not allow ads on screens without publisher content, so the
 * playground, tools, quizzes, the interactive interview modes, short index pages and the legal / contact pages are excluded.
 */
const CONTENT_PREFIXES = ['/learn/', '/html/', '/css/', '/js/', '/projects/', '/interview/'];
const CONTENT_HUBS = /^\/[a-z-]+-(cheatsheet|interview-questions|roadmap)$/;
const INTERACTIVE = ['/interview/mock', '/interview/rapid-revision', '/interview/practice'];

export function adsAllowedOn(pathname: string): boolean {
  if (INTERACTIVE.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return false;
  return CONTENT_PREFIXES.some((p) => pathname.startsWith(p)) || CONTENT_HUBS.test(pathname) || pathname === '/javascript-practice';
}
