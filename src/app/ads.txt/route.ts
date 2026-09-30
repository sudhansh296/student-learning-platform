import { ADSENSE_ENABLED, ADSENSE_PUB_ID } from '@/lib/adsense';

export const dynamic = 'force-static';

/** ads.txt tells ad buyers that this publisher account may sell the site's ad space. Only served once AdSense is configured. */
export function GET() {
  if (!ADSENSE_ENABLED) return new Response('Not found', { status: 404 });
  return new Response(`google.com, ${ADSENSE_PUB_ID}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
