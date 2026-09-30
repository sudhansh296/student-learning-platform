import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { Navbar } from '@/components/layout/Navbar';
import { ScrollingTicker } from '@/components/layout/ScrollingTicker';
import { Footer } from '@/components/layout/Footer';
import { SearchHighlight } from '@/components/search/SearchHighlight';
import { Suspense } from 'react';
import { SITE_URL, SITE_NAME, GOOGLE_SITE_VERIFICATION } from '@/lib/seo';
import { ADSENSE_CLIENT, ADSENSE_ENABLED } from '@/lib/adsense';
import { AdSenseLoader } from '@/components/ads/AdSenseLoader';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const mono  = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'WebDev Atlas — Learn the Web. Understand the Stack. Build Anything.', template: '%s | WebDev Atlas' },
  description: 'Your complete map of modern web development. HTML, CSS, JavaScript, React, Node.js, MongoDB — explained simply.',
  openGraph: { siteName: SITE_NAME, type: 'website', locale: 'en_US' },
  twitter: { card: 'summary_large_image' },
  // lets Google verify site ownership for AdSense; only present once a publisher id is configured
  ...(ADSENSE_ENABLED ? { other: { 'google-adsense-account': ADSENSE_CLIENT } } : {}),
  // lets Google verify site ownership for Search Console; only present once a verification code is configured
  ...(GOOGLE_SITE_VERIFICATION ? { verification: { google: GOOGLE_SITE_VERIFICATION } } : {}),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${mono.variable}`}>
      <body style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
        <ThemeProvider>
          <AdSenseLoader />
          <Navbar />
          <ScrollingTicker />
          <main>{children}</main>
          <Suspense fallback={null}><SearchHighlight /></Suspense>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
