import { ImageResponse } from 'next/og';

export const alt = 'WebDev Atlas — Learn the Web. Understand the Stack. Build Anything.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Default share preview (WhatsApp, LinkedIn, X, Slack…) for every page that does not define its own image.
export default function OpengraphImage() {
  const chips = ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'SQL', 'Docker'];
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 80px', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)', color: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: 18, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>W</div>
          <div style={{ display: 'flex', fontSize: 48, fontWeight: 800 }}>
            WebDev<span style={{ color: '#60a5fa' }}>Atlas</span>
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 68, fontWeight: 800, lineHeight: 1.1, marginTop: 44, maxWidth: 980 }}>
          Learn the Web. Understand the Stack. Build Anything.
        </div>
        <div style={{ display: 'flex', fontSize: 28, color: '#cbd5e1', marginTop: 28 }}>
          Free tutorials with live code you can run in your browser
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 44 }}>
          {chips.map((c) => (
            <div key={c} style={{ display: 'flex', fontSize: 24, padding: '8px 20px', borderRadius: 999, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)' }}>{c}</div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
