import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent clickjacking — only allow same origin to frame this site
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Prevent MIME-type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Control referrer information
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Disable browser features not needed by this app
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // HSTS — force HTTPS for 1 year (enable when deployed on HTTPS)
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Scripts: allow self + inline + CDN scripts for TypeScript/Babel/React in playground
              // unsafe-eval needed in dev (React) and in playground (ts.transpileModule, new Function)
              `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com https://cdnjs.cloudflare.com`,
              // Styles: allow self + inline (needed for Tailwind CSS-in-JS)
              "style-src 'self' 'unsafe-inline'",
              // Images: allow self, data URIs, and flagcdn for country flags
              "img-src 'self' data: https://flagcdn.com",
              // Fonts: allow self
              "font-src 'self'",
              // iframes: allow self only (sandboxed iframes use srcdoc, not src)
              "frame-src 'self'",
              // Connections: allow self + CDN fetches from playground iframes
              "connect-src 'self' https://cdn.jsdelivr.net https://unpkg.com https://cdnjs.cloudflare.com",
              // Prevent this site from being framed by others
              "frame-ancestors 'self'",
              // Block all object/embed/plugin elements
              "object-src 'none'",
              // Upgrade HTTP requests to HTTPS
              "upgrade-insecure-requests",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
