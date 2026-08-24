'use client';

import { useState, useMemo } from 'react';

export function RegexTester() {
  const [pattern, setPattern] = useState('[a-z]+@[a-z]+\\.[a-z]+');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('Contact us at hello@example.com or support@webdevatlas.dev for help.');

  const result = useMemo(() => {
    if (!pattern) return { matches: [], isValid: true };
    try {
      const regex = new RegExp(pattern, flags);
      const matches = [...testString.matchAll(new RegExp(pattern, flags.includes('g') ? flags : flags + 'g'))];
      return { matches: matches.map(m => m[0]), isValid: true, count: matches.length };
    } catch (e) {
      return { matches: [], isValid: false, error: (e as Error).message, count: 0 };
    }
  }, [pattern, flags, testString]);

  const highlighted = useMemo(() => {
    const escapeHtml = (s: string) =>
      s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    if (!pattern || !result.isValid || result.matches.length === 0) return escapeHtml(testString);
    try {
      const parts: string[] = [];
      let lastIndex = 0;
      const re = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
      let m: RegExpExecArray | null;
      while ((m = re.exec(testString)) !== null) {
        parts.push(escapeHtml(testString.slice(lastIndex, m.index)));
        parts.push(`<mark class="bg-yellow-200 dark:bg-yellow-800 text-foreground rounded px-0.5">${escapeHtml(m[0])}</mark>`);
        lastIndex = m.index + m[0].length;
        if (m[0].length === 0) re.lastIndex++; // avoid infinite loop on zero-width matches
      }
      parts.push(escapeHtml(testString.slice(lastIndex)));
      return parts.join('');
    } catch {
      return escapeHtml(testString);
    }
  }, [pattern, flags, testString, result]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-2">Regex Tester</h1>
      <p className="text-muted-foreground text-sm mb-6">Test regular expressions with live match highlighting.</p>

      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Pattern</label>
            <div className="flex items-center bg-[#0d1117] border border-border rounded-xl overflow-hidden">
              <span className="pl-4 text-[#484f58] font-mono">/</span>
              <input
                value={pattern}
                onChange={e => setPattern(e.target.value)}
                className="flex-1 px-2 py-3 font-mono text-sm bg-transparent text-[#e6edf3] outline-none"
                placeholder="Your regex pattern..."
              />
              <span className="text-[#484f58] font-mono">/</span>
              <input
                value={flags}
                onChange={e => setFlags(e.target.value)}
                className="w-12 px-2 py-3 font-mono text-sm bg-transparent text-[#58a6ff] outline-none"
                placeholder="gi"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Test String</label>
          <textarea
            value={testString}
            onChange={e => setTestString(e.target.value)}
            className="w-full h-32 p-4 font-mono text-sm bg-[#0d1117] text-[#e6edf3] border border-border rounded-xl resize-none outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Result</label>
            {result.isValid && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${result.count === 0 ? 'bg-muted text-muted-foreground' : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'}`}>
                {result.count} match{result.count !== 1 ? 'es' : ''}
              </span>
            )}
          </div>

          {result.isValid ? (
            <div
              className="p-4 bg-[#0d1117] border border-border rounded-xl font-mono text-sm text-[#e6edf3] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          ) : (
            <div className="p-4 bg-red-950/30 border border-red-800/50 rounded-xl text-red-400 text-sm font-mono">
              ❌ {result.error}
            </div>
          )}
        </div>

        {result.isValid && result.matches.length > 0 && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Matches</label>
            <div className="flex flex-wrap gap-2">
              {result.matches.map((m, i) => (
                <span key={i} className="text-xs font-mono px-2 py-1 rounded bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800">
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
