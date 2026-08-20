'use client';
import { useState } from 'react';

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return { r, g, b };
}
function rgbToHsl(r: number, g: number, b: number) {
  r/=255; g/=255; b/=255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h=0, s=0, l=(max+min)/2;
  if (max!==min) {
    const d=max-min; s=l>0.5?d/(2-max-min):d/(max+min);
    switch(max){ case r: h=(g-b)/d+(g<b?6:0);break; case g: h=(b-r)/d+2;break; case b: h=(r-g)/d+4;break; }
    h/=6;
  }
  return { h:Math.round(h*360), s:Math.round(s*100), l:Math.round(l*100) };
}

export function ColorConverter() {
  const [hex, setHex] = useState('#2563eb');
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2" style={{ color:'var(--text)' }}>Color Converter</h1>
      <p className="text-sm mb-6" style={{ color:'var(--text-2)' }}>Convert between HEX, RGB, HSL, and RGBA color formats.</p>
      <div className="flex items-center gap-4 mb-6">
        <input type="color" value={hex} onChange={e => setHex(e.target.value)} className="w-16 h-16 rounded-xl cursor-pointer border-0 bg-transparent" />
        <div>
          <p className="text-2xl font-extrabold" style={{ color:'var(--text)' }}>{hex.toUpperCase()}</p>
          <p className="text-sm" style={{ color:'var(--text-2)' }}>Pick a color using the swatch</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label:'HEX', value: hex.toUpperCase() },
          { label:'RGB', value:`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
          { label:'RGBA', value:`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)` },
          { label:'HSL', value:`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
          { label:'HSLA', value:`hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)` },
          { label:'CSS Variable', value:`--color: ${hex.toUpperCase()};` },
        ].map(({ label, value }) => (
          <div key={label} className="p-4 rounded-xl" style={{ background:'var(--bg-section)', border:'1px solid var(--line)' }}>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color:'var(--text-3)' }}>{label}</p>
            <p className="font-mono text-sm font-semibold" style={{ color:'var(--text)' }}>{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 h-16 rounded-xl" style={{ background: hex, border:'1px solid var(--line)' }} />
    </div>
  );
}
