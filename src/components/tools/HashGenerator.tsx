'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

async function sha(algorithm: string, message: string) {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest(algorithm, enc.encode(message));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

export function HashGenerator() {
  const [input, setInput] = useState('Hello, World!');
  const [hashes, setHashes] = useState<Record<string,string>>({});
  const [copied, setCopied] = useState('');

  const generate = async () => {
    const [h1, h256, h384, h512] = await Promise.all([
      sha('SHA-1', input), sha('SHA-256', input), sha('SHA-384', input), sha('SHA-512', input)
    ]);
    setHashes({ 'SHA-1': h1, 'SHA-256': h256, 'SHA-384': h384, 'SHA-512': h512 });
  };

  const copy = async (v: string, k: string) => {
    await navigator.clipboard.writeText(v);
    setCopied(k); setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2" style={{ color:'var(--text)' }}>Hash Generator</h1>
      <p className="text-sm mb-6" style={{ color:'var(--text-2)' }}>Generate SHA-1, SHA-256, SHA-384, SHA-512 hashes using the browser Web Crypto API.</p>
      <div className="mb-4">
        <textarea value={input} onChange={e => setInput(e.target.value)}
          className="w-full h-28 p-4 font-mono text-sm rounded-xl resize-none outline-none"
          style={{ background:'#0d1117', color:'#e6edf3', border:'1px solid #30363d' }}
          placeholder="Enter text to hash..." />
      </div>
      <button onClick={generate} className="px-5 py-2.5 rounded-lg font-bold text-white text-sm mb-6" style={{ background:'#2563eb' }}>
        Generate Hashes
      </button>
      <div className="space-y-3">
        {Object.entries(hashes).map(([algo, hash]) => (
          <div key={algo} className="p-4 rounded-xl" style={{ background:'var(--bg-section)', border:'1px solid var(--line)' }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color:'var(--text-3)' }}>{algo}</span>
              <button onClick={() => copy(hash, algo)} className="flex items-center gap-1 text-xs" style={{ color:'var(--text-3)' }}>
                {copied===algo ? <><Check className="w-3 h-3 text-green-500"/>Copied</> : <><Copy className="w-3 h-3"/>Copy</>}
              </button>
            </div>
            <p className="font-mono text-[12px] break-all" style={{ color:'var(--text)' }}>{hash}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
