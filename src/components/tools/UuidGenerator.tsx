'use client';

import { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';

function generateUUID() {
  // Use crypto.getRandomValues for cryptographically secure UUID v4
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  // Set version 4 bits
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  // Set variant bits
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}

export function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([generateUUID()]);
  const [count, setCount] = useState(1);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  function generate() {
    setUuids(Array.from({ length: count }, generateUUID));
  }

  async function copy(uuid: string, i: number) {
    await navigator.clipboard.writeText(uuid);
    setCopiedIndex(i);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  async function copyAll() {
    await navigator.clipboard.writeText(uuids.join('\n'));
    setCopiedIndex(-1);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-2">UUID Generator</h1>
      <p className="text-muted-foreground text-sm mb-6">Generate random UUID v4 values.</p>

      <div className="flex items-end gap-3 mb-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Count</label>
          <input
            type="number"
            min={1}
            max={20}
            value={count}
            onChange={e => setCount(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground outline-none focus:border-blue-500"
          />
        </div>
        <button onClick={generate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
          <RefreshCw className="w-3.5 h-3.5" />
          Generate
        </button>
        {uuids.length > 1 && (
          <button onClick={copyAll} className="flex items-center gap-2 px-4 py-2 border border-border bg-background hover:bg-muted/60 text-sm font-medium rounded-lg transition-colors text-foreground">
            {copiedIndex === -1 ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedIndex === -1 ? 'Copied all!' : 'Copy all'}
          </button>
        )}
      </div>

      <div className="space-y-2">
        {uuids.map((uuid, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-[#0d1117] border border-border rounded-lg">
            <code className="text-sm font-mono text-[#e6edf3]">{uuid}</code>
            <button
              onClick={() => copy(uuid, i)}
              className="flex items-center gap-1.5 text-xs text-[#8b949e] hover:text-white transition-colors ml-3 shrink-0"
            >
              {copiedIndex === i ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
