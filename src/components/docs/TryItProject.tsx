'use client';

import { useState } from 'react';
import { InlinePlayground } from './InlinePlayground';
import { Code2 } from 'lucide-react';

interface TryItProjectProps {
  title: string;
  description?: string;
  html?: string;
  css?: string;
  js?: string;
  mode?: 'html' | 'css' | 'js' | 'full';
  height?: number;
  tech?: string;
}

function buildSrcDoc(html: string, css: string, js: string): string {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>*{box-sizing:border-box}body{margin:0;font-family:system-ui,sans-serif;font-size:15px;line-height:1.6}${css}</style>
</head><body>${html}<script>${js}<\/script></body></html>`;
}

export function TryItProject({
  title,
  description,
  html = '',
  css = '',
  js = '',
  mode = 'full',
  height = 500,
}: TryItProjectProps) {
  const [showCode, setShowCode] = useState(true);

  return (
    <div className="my-6 rounded-2xl overflow-hidden border border-[#e5e7eb] dark:border-[#30363d] shadow-sm">
      {/* Project header */}
      <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#0d1117] to-[#161b22] border-b border-[#30363d]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-green-400" />
              <span className="text-[12px] font-bold text-white">{title}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                PROJECT
              </span>
            </div>
            {description && (
              <p className="text-[11px] text-[#8b949e] mt-0.5">{description}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowCode(s => !s)}
          className="text-[10px] font-medium text-[#8b949e] hover:text-white transition-colors px-2 py-1 rounded hover:bg-[#21262d]"
        >
          {showCode ? 'Hide Editor' : 'Show Editor'}
        </button>
      </div>

      {showCode ? (
        <InlinePlayground html={html} css={css} js={js} mode={mode} title={title} height={height} />
      ) : (
        <div style={{ height }}>
          <iframe
            srcDoc={buildSrcDoc(html, css, js)}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-modals"
            title={title}
          />
        </div>
      )}
    </div>
  );
}
