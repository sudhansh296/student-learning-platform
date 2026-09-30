'use client';
import { useState, useEffect } from 'react';

function snapshotNow() {
  return {
    unix: Math.floor(Date.now() / 1000),
    iso: new Date().toISOString(),
    local: new Date().toLocaleString(),
  };
}

export function TimestampConverter() {
  const [unix, setUnix] = useState('');
  const [human, setHuman] = useState('');
  const [now, setNow] = useState<ReturnType<typeof snapshotNow> | null>(null);

  // Clock values differ between server render and client hydration — fill them
  // in after mount instead of during render, so the first paint matches SSR.
  /* eslint-disable react-hooks/set-state-in-effect -- fills in clock values after mount so SSR and the first client render match */
  useEffect(() => {
    const snap = snapshotNow();
    setUnix(String(snap.unix));
    setNow(snap);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const fromUnix = () => {
    const d = new Date(parseInt(unix) * 1000);
    setHuman(isNaN(d.getTime()) ? '❌ Invalid timestamp' : d.toLocaleString());
  };
  const refreshNow = () => {
    const snap = snapshotNow();
    setUnix(String(snap.unix));
    setNow(snap);
    setHuman('');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2" style={{ color:'var(--text)' }}>Timestamp Converter</h1>
      <p className="text-sm mb-6" style={{ color:'var(--text-2)' }}>Convert Unix timestamps to human-readable dates and vice versa.</p>

      <div className="space-y-4 max-w-lg">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color:'var(--text-3)' }}>Unix Timestamp (seconds)</label>
          <div className="flex gap-2">
            <input type="number" value={unix} onChange={e => setUnix(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-lg font-mono text-sm outline-none"
              style={{ background:'var(--bg-section)', border:'1px solid var(--line)', color:'var(--text)' }} />
            <button onClick={fromUnix} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background:'#2563eb' }}>Convert</button>
            <button onClick={refreshNow} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background:'var(--bg-section)', border:'1px solid var(--line)', color:'var(--text-2)' }}>Now</button>
          </div>
        </div>
        {human && (
          <div className="p-4 rounded-xl" style={{ background:'var(--bg-section)', border:'1px solid var(--line)' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color:'var(--text-3)' }}>Human Readable</p>
            <p className="text-lg font-bold" style={{ color:'var(--text)' }}>{human}</p>
          </div>
        )}
        <div className="p-4 rounded-xl" style={{ background:'var(--bg-section)', border:'1px solid var(--line)' }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color:'var(--text-3)' }}>Current time</p>
          {now ? (
            <>
              <p className="font-mono text-sm" style={{ color:'var(--text-2)' }}>Unix: {now.unix}</p>
              <p className="font-mono text-sm" style={{ color:'var(--text-2)' }}>ISO: {now.iso}</p>
              <p className="font-mono text-sm" style={{ color:'var(--text-2)' }}>Local: {now.local}</p>
            </>
          ) : (
            <p className="font-mono text-sm" style={{ color:'var(--text-3)' }}>Loading…</p>
          )}
        </div>
      </div>
    </div>
  );
}
