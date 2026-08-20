'use client';

import { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';

export function JsonFormatter() {
  const [input, setInput] = useState('{"name":"Alex","age":25,"skills":["JavaScript","React","Node.js"]}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  function format() {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  }

  function minify() {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  }

  async function copy() {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-2">JSON Formatter</h1>
      <p className="text-muted-foreground text-sm mb-6">Format, validate, and minify JSON data instantly.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Input JSON</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            className="w-full h-72 p-4 font-mono text-sm bg-[#0d1117] text-[#e6edf3] border border-border rounded-xl resize-none outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
            placeholder='Paste your JSON here...'
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Output</label>
            {output && (
              <button
                onClick={copy}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          {error ? (
            <div className="w-full h-72 p-4 font-mono text-sm bg-red-950/30 text-red-400 border border-red-800/50 rounded-xl">
              ❌ {error}
            </div>
          ) : (
            <pre className="w-full h-72 p-4 font-mono text-[13px] bg-[#0d1117] text-[#e6edf3] border border-border rounded-xl overflow-auto">
              {output || <span className="text-[#484f58]">Output will appear here...</span>}
            </pre>
          )}
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button onClick={format} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
          Format / Prettify
        </button>
        <button onClick={minify} className="px-4 py-2 border border-border bg-background hover:bg-muted/60 text-sm font-medium rounded-lg transition-colors text-foreground">
          Minify
        </button>
        <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="flex items-center gap-1.5 px-4 py-2 border border-border bg-background hover:bg-muted/60 text-sm rounded-lg transition-colors text-muted-foreground">
          <RefreshCw className="w-3.5 h-3.5" />
          Clear
        </button>
      </div>
    </div>
  );
}
