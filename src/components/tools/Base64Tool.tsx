'use client';

import { useState } from 'react';

export function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  function convert() {
    try {
      if (mode === 'encode') {
        setOutput(btoa(input));
      } else {
        setOutput(atob(input));
      }
    } catch {
      setOutput('Error: Invalid input for decoding');
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-2">Base64 Encoder / Decoder</h1>
      <p className="text-muted-foreground text-sm mb-6">Encode text to Base64 or decode Base64 back to text.</p>

      <div className="flex gap-2 mb-4">
        {(['encode', 'decode'] as const).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              mode === m
                ? 'bg-blue-600 text-white'
                : 'border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted/60'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Input</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            className="w-full h-48 p-4 font-mono text-sm bg-[#0d1117] text-[#e6edf3] border border-border rounded-xl resize-none outline-none focus:border-blue-500"
            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Output</label>
          <pre className="w-full h-48 p-4 font-mono text-sm bg-[#0d1117] text-[#e6edf3] border border-border rounded-xl overflow-auto whitespace-pre-wrap break-all">
            {output || <span className="text-[#484f58]">Result will appear here...</span>}
          </pre>
        </div>
      </div>

      <button onClick={convert} className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors capitalize">
        {mode}
      </button>
    </div>
  );
}
