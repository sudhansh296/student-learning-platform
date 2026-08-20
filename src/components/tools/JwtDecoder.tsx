'use client';

import { useState } from 'react';

function base64UrlDecode(str: string) {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
  return JSON.parse(atob(padded));
}

const SAMPLE_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXgiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

export function JwtDecoder() {
  const [jwt, setJwt] = useState(SAMPLE_JWT);
  const [result, setResult] = useState<{ header: object; payload: object } | null>(null);
  const [error, setError] = useState('');

  function decode() {
    try {
      const parts = jwt.split('.');
      if (parts.length !== 3) throw new Error('Invalid JWT: must have 3 parts separated by dots');
      const header = base64UrlDecode(parts[0]);
      const payload = base64UrlDecode(parts[1]);
      setResult({ header, payload });
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setResult(null);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-2">JWT Decoder</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Decode JSON Web Tokens to inspect their header and payload. Note: this tool does not verify the signature.
      </p>

      <div className="mb-4">
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">JWT Token</label>
        <textarea
          value={jwt}
          onChange={e => setJwt(e.target.value)}
          className="w-full h-28 p-4 font-mono text-[12px] bg-[#0d1117] text-[#e6edf3] border border-border rounded-xl resize-none outline-none focus:border-blue-500 break-all"
          placeholder="Paste your JWT here..."
          spellCheck={false}
        />
      </div>

      <button onClick={decode} className="mb-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
        Decode
      </button>

      {error && (
        <div className="p-4 bg-red-950/30 border border-red-800/50 rounded-xl text-red-400 text-sm mb-4">
          ❌ {error}
        </div>
      )}

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Header</label>
            </div>
            <pre className="p-4 bg-[#0d1117] text-[#e6edf3] border border-border rounded-xl text-sm font-mono overflow-auto">
              {JSON.stringify(result.header, null, 2)}
            </pre>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payload</label>
            </div>
            <pre className="p-4 bg-[#0d1117] text-[#e6edf3] border border-border rounded-xl text-sm font-mono overflow-auto">
              {JSON.stringify(result.payload, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
