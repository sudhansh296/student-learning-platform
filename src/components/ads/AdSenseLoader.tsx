'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ADSENSE_ENABLED, ADSENSE_SCRIPT_SRC, adsAllowedOn } from '@/lib/adsense';

/**
 * Loads the AdSense script once, and only on pages where ads are allowed (not the playground, tools or legal pages).
 * Renders nothing. Does nothing at all while NEXT_PUBLIC_ADSENSE_CLIENT is not set.
 */
export function AdSenseLoader() {
  const pathname = usePathname();
  const allowed = ADSENSE_ENABLED && adsAllowedOn(pathname);

  useEffect(() => {
    if (!allowed || document.querySelector('script[data-adsense-loader]')) return;
    const s = document.createElement('script');
    s.async = true;
    s.src = ADSENSE_SCRIPT_SRC;
    s.crossOrigin = 'anonymous';
    s.setAttribute('data-adsense-loader', '');
    document.head.appendChild(s);
  }, [allowed]);

  return null;
}
