'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { ADSENSE_CLIENT, ADSENSE_ENABLED, adsAllowedOn } from '@/lib/adsense';

declare global { interface Window { adsbygoogle?: unknown[] } }

/**
 * A manual AdSense display unit (create the unit in your AdSense account and pass its slot id).
 * Not needed if you use Auto ads. Renders nothing while AdSense is not configured or on pages without ads.
 */
export function AdSlot({ slot, className = '' }: { slot: string; className?: string }) {
  const pathname = usePathname();
  const pushed = useRef(false);
  const show = ADSENSE_ENABLED && /^\d{6,}$/.test(slot) && adsAllowedOn(pathname);

  useEffect(() => {
    if (!show || pushed.current) return;
    pushed.current = true;
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch { /* the ad script has not loaded (blocked or offline) */ }
  }, [show]);

  if (!show) return null;
  return (
    <aside aria-label="Advertisement" className={`my-8 ${className}`}>
      <p className="text-[10px] uppercase tracking-widest mb-1 text-center" style={{ color: 'var(--text-3)' }}>Advertisement</p>
      <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client={ADSENSE_CLIENT} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true" />
    </aside>
  );
}
