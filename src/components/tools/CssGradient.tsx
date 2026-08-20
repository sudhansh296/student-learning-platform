'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function CssGradient() {
  const [type, setType] = useState<'linear'|'radial'>('linear');
  const [angle, setAngle] = useState(135);
  const [c1, setC1] = useState('#2563eb');
  const [c2, setC2] = useState('#7c3aed');
  const [copied, setCopied] = useState(false);

  const css = type === 'linear'
    ? `background: linear-gradient(${angle}deg, ${c1}, ${c2});`
    : `background: radial-gradient(circle, ${c1}, ${c2});`;

  const copy = async () => { await navigator.clipboard.writeText(css); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2" style={{ color:'var(--text)' }}>CSS Gradient Generator</h1>
      <p className="text-sm mb-6" style={{ color:'var(--text-2)' }}>Generate beautiful CSS gradients and copy the code.</p>
      <div className="flex gap-2 mb-5">
        {(['linear','radial'] as const).map(t => (
          <button key={t} onClick={() => setType(t)}
            className="px-4 py-2 rounded-lg text-sm font-semibold capitalize"
            style={{ background: type===t ? '#2563eb' : 'var(--bg-section)', color: type===t ? '#fff' : 'var(--text-2)', border:'1px solid var(--line)' }}>
            {t}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-4 mb-5">
        <div><label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color:'var(--text-3)' }}>Color 1</label>
          <input type="color" value={c1} onChange={e=>setC1(e.target.value)} className="w-12 h-10 rounded cursor-pointer" /></div>
        <div><label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color:'var(--text-3)' }}>Color 2</label>
          <input type="color" value={c2} onChange={e=>setC2(e.target.value)} className="w-12 h-10 rounded cursor-pointer" /></div>
        {type === 'linear' && <div className="flex-1 min-w-40">
          <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color:'var(--text-3)' }}>Angle: {angle}°</label>
          <input type="range" min={0} max={360} value={angle} onChange={e=>setAngle(+e.target.value)} className="w-full" /></div>}
      </div>
      <div className="h-40 rounded-2xl mb-5" style={{ background: type==='linear' ? `linear-gradient(${angle}deg, ${c1}, ${c2})` : `radial-gradient(circle, ${c1}, ${c2})`, border:'1px solid var(--line)' }} />
      <div className="flex items-center gap-3 p-4 rounded-xl font-mono text-sm" style={{ background:'#0d1117', border:'1px solid #30363d', color:'#e6edf3' }}>
        <span className="flex-1">{css}</span>
        <button onClick={copy} className="flex items-center gap-1.5 text-xs" style={{ color:'#8b949e' }}>
          {copied ? <><Check className="w-3 h-3 text-green-400"/>Copied!</> : <><Copy className="w-3 h-3"/>Copy</>}
        </button>
      </div>
    </div>
  );
}
