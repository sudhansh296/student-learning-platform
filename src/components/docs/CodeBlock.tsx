'use client';

import { useState } from 'react';
import { Check, Copy, ChevronDown, ChevronUp } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  output?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ code, language = 'javascript', filename, output, showLineNumbers = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const lines = code.split('\n');
  const isLong = lines.length > 20;
  const displayLines = isLong && !expanded ? lines.slice(0, 20) : lines;

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const langColors: Record<string, string> = {
    javascript: 'text-yellow-400',
    typescript: 'text-blue-400',
    jsx: 'text-cyan-400',
    tsx: 'text-cyan-400',
    css: 'text-blue-400',
    html: 'text-orange-400',
    sql: 'text-green-400',
    bash: 'text-gray-400',
    json: 'text-yellow-300',
    python: 'text-blue-400',
    dockerfile: 'text-blue-400',
  };

  return (
    <div className="rounded-xl overflow-hidden border border-border my-5 bg-[#0d1117]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-[#30363d]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          {filename && (
            <span className="text-[11px] font-mono text-[#8b949e] bg-[#21262d] px-2 py-0.5 rounded">
              {filename}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-mono uppercase tracking-wider ${langColors[language] || 'text-gray-400'}`}>
            {language}
          </span>
          <button
            onClick={copy}
            className="flex items-center gap-1.5 text-[11px] text-[#8b949e] hover:text-white transition-colors px-2 py-1 rounded hover:bg-[#21262d]"
            aria-label="Copy code"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-green-400" />
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-[13px] leading-6 font-mono">
          <code className={`language-${language}`}>
            {displayLines.map((line, i) => (
              <div key={i} className="flex">
                {showLineNumbers && (
                  <span className="select-none text-[#484f58] w-8 shrink-0 text-right pr-4">
                    {i + 1}
                  </span>
                )}
                <span className="text-[#e6edf3]">{renderSyntax(line, language)}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>

      {/* Expand button */}
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-2 py-2 text-[11px] text-[#8b949e] hover:text-white bg-[#161b22] border-t border-[#30363d] transition-colors hover:bg-[#21262d]"
        >
          {expanded ? (
            <><ChevronUp className="w-3 h-3" /> Show less</>
          ) : (
            <><ChevronDown className="w-3 h-3" /> Show {lines.length - 20} more lines</>
          )}
        </button>
      )}

      {/* Output */}
      {output && (
        <div className="border-t border-[#30363d]">
          <button
            onClick={() => setShowOutput(!showOutput)}
            className="w-full flex items-center justify-between px-4 py-2 text-[11px] text-[#8b949e] hover:text-white bg-[#161b22] transition-colors hover:bg-[#21262d]"
          >
            <span className="font-medium uppercase tracking-wider">Output</span>
            {showOutput ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          {showOutput && (
            <div className="px-4 py-3 bg-[#0d1117]">
              <pre className="text-[12px] font-mono text-[#3fb950] leading-5">{output}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Simple syntax highlighting via regex
function renderSyntax(line: string, lang: string): React.ReactNode {
  // For now, return plain text — syntax highlighting can be enhanced with a library
  return line || '\n';
}
