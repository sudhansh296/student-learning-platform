'use client';
import { useState } from 'react';

export function UrlEncoder() {
  const [input, setInput] = useState('hello world & goodbye!');
  const [mode, setMode] = useState<'encode'|'decode'>('encode');
  const output = mode === 'encode' ? encodeURIComponent(input) : (() => { try { return decodeURIComponent(input); } catch { return '❌ Invalid encoded string'; } })();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2" style={{ color:'var(--text)' }}>URL Encoder / Decoder</h1>
      <p className="text-sm mb-6" style={{ color:'var(--text-2)' }}>Encode special characters for use in URLs or decode them back to readable text.</p>
      <div className="flex gap-2 mb-4">
        {(['encode','decode'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${mode===m ? 'text-white' : ''}`}
            style={{ background: mode===m ? '#2563eb' : 'var(--bg-section)', color: mode===m ? '#fff' : 'var(--text-2)', border: '1px solid var(--line)' }}>
            {m}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color:'var(--text-3)' }}>Input</label>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            className="w-full h-40 p-4 font-mono text-sm resize-none outline-none rounded-xl"
            style={{ background:'#0d1117', color:'#e6edf3', border:'1px solid #30363d' }} />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color:'var(--text-3)' }}>Output</label>
          <pre className="w-full h-40 p-4 font-mono text-sm rounded-xl overflow-auto whitespace-pre-wrap break-all"
            style={{ background:'#0d1117', color:'#3fb950', border:'1px solid #30363d' }}>{output}</pre>
        </div>
      </div>
    </div>
  );
}
