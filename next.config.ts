import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

// Google AdSense (off until NEXT_PUBLIC_ADSENSE_CLIENT holds a publisher id). When on, the CSP also allows Google's ad and consent domains.
const adsOn = /^ca-pub-\d{10,20}$/.test((process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? '').trim());
const AD_SCRIPTS = adsOn ? ' https://pagead2.googlesyndication.com https://partner.googleadservices.com https://tpc.googlesyndication.com https://www.googletagservices.com https://fundingchoicesmessages.google.com https://*.adtrafficquality.google https://www.google.com' : '';
const AD_CONNECT = adsOn ? ' https://pagead2.googlesyndication.com https://*.g.doubleclick.net https://*.google.com https://fundingchoicesmessages.google.com https://*.adtrafficquality.google' : '';
const AD_IMAGES = adsOn ? ' https:' : ''; // ad creatives come from many advertiser domains

const nextConfig: NextConfig = {
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent MIME-type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Control referrer information
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Disable features not needed
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // Prevent clickjacking
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // HSTS — only in production (dev runs on HTTP)
          ...(isDev ? [] : [
            { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          ]),
          // CSP — permissive enough for a learning platform with code playgrounds
          {
            key: 'Content-Security-Policy',
            value: [
              // Allow everything from self by default
              "default-src 'self'",
              // Scripts: allow inline + eval (needed by React dev, ts.transpileModule, new Function)
              // + CDN sources for TypeScript compiler, React, Babel in playground iframes
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com https://cdnjs.cloudflare.com" + AD_SCRIPTS,
              // Styles: allow inline (Tailwind, component styles)
              "style-src 'self' 'unsafe-inline'",
              // Images: self + data URIs + country flags CDN
              "img-src 'self' data: blob: https://flagcdn.com https://*.flagcdn.com" + AD_IMAGES,
              // Fonts: self only (Next.js self-hosts Google Fonts at build time)
              "font-src 'self' data:",
              // Frames: self + blob URLs (used by SQL/Redis/etc renderers) + external live demos
              "frame-src 'self' blob: https:",
              // Connections: self + CDNs (for playground iframes fetching scripts) + our own API
              "connect-src 'self' https://cdn.jsdelivr.net https://unpkg.com https://cdnjs.cloudflare.com" + AD_CONNECT,
              // Workers: none needed
              "worker-src 'none'",
              // No plugins/flash
              "object-src 'none'",
              // Prevent this site from being framed by external sites (clickjacking protection)
              "frame-ancestors 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
