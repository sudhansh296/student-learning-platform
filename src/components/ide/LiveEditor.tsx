'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Play, RefreshCw, Maximize2, Copy, Check, RotateCcw, X } from 'lucide-react';

interface LiveEditorProps {
  defaultHTML?: string;
  defaultCSS?: string;
  defaultJS?: string;
  mode?: 'html' | 'css' | 'js' | 'full';
  height?: number;
  title?: string;
  readOnly?: boolean;
}

const PANEL_LABELS: Record<string, string> = {
  html: 'HTML',
  css: 'CSS',
  js: 'JavaScript',
};

const PANEL_COLORS: Record<string, string> = {
  html: 'text-orange-400',
  css: 'text-blue-400',
  js: 'text-yellow-400',
};

export function LiveEditor({
  defaultHTML = '<h1>Hello, World!</h1>\n<p>Edit this code and click Run ▶</p>',
  defaultCSS = 'h1 {\n  color: #2563eb;\n  font-family: sans-serif;\n}\np {\n  color: #374151;\n  font-size: 16px;\n}',
  defaultJS = '',
  mode = 'html',
  height = 340,
  title,
  readOnly = false,
}: LiveEditorProps) {
  const [html, setHtml] = useState(defaultHTML);
  const [css, setCss] = useState(defaultCSS);
  const [js, setJs] = useState(defaultJS);
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>(
    mode === 'css' ? 'css' : mode === 'js' ? 'js' : 'html'
  );
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const runCountRef = useRef(0);

  const buildSrcDoc = useCallback((h: string, c: string, j: string) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<style>
  * { box-sizing: border-box; }
  body { margin: 12px; font-family: sans-serif; font-size: 15px; line-height: 1.6; color: #111; }
  ${c}
</style>
</head>
<body>
${h}
<script>
// Capture console.log
(function(){
  const orig = console.log;
  console.log = function(...args){
    orig.apply(console, args);
    window.parent.postMessage({ type: 'console', data: args.map(String).join(' ') }, '*');
  };
})();
try {
  ${j}
} catch(e) {
  window.parent.postMessage({ type: 'error', data: e.message }, '*');
}
</script>
</body>
</html>`;
  }, []);

  const run = useCallback(() => {
    runCountRef.current++;
    const src = buildSrcDoc(html, css, js);
    if (iframeRef.current) {
      iframeRef.current.srcdoc = src;
    }
    setOutput('');
  }, [html, css, js, buildSrcDoc]);

  // Auto-run on mount
  useEffect(() => { run(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for console messages from iframe
  useEffect(() => {
    function handler(e: MessageEvent) {
      if (e.data?.type === 'console') {
        setOutput(prev => prev ? prev + '\n' + e.data.data : e.data.data);
      } else if (e.data?.type === 'error') {
        setOutput(prev => (prev ? prev + '\n' : '') + '❌ ' + e.data.data);
      }
    }
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const reset = () => {
    setHtml(defaultHTML);
    setCss(defaultCSS);
    setJs(defaultJS);
    setTimeout(run, 50);
  };

  const copyCode = async () => {
    const code = activeTab === 'html' ? html : activeTab === 'css' ? css : js;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = mode === 'full'
    ? ['html', 'css', 'js'] as const
    : mode === 'css'
    ? ['html', 'css'] as const
    : mode === 'js'
    ? ['html', 'js'] as const
    : ['html'] as const;

  const currentCode = activeTab === 'html' ? html : activeTab === 'css' ? css : js;
  const setCurrentCode = activeTab === 'html' ? setHtml : activeTab === 'css' ? setCss : setJs;

  const editorPanel = (
    <div className={`flex flex-col ${isFullscreen ? 'h-full' : ''}`} style={isFullscreen ? {} : { height }}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#161b22] border-b border-[#30363d]">
        <div className="flex items-center gap-1">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
                activeTab === tab
                  ? `bg-[#21262d] ${PANEL_COLORS[tab]}`
                  : 'text-[#8b949e] hover:text-white'
              }`}
            >
              {PANEL_LABELS[tab]}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          {title && <span className="text-[11px] text-[#484f58] mr-2">{title}</span>}
          <button
            onClick={copyCode}
            className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors"
            title="Reset to original"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors"
          >
            {isFullscreen ? <X className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>
        </div>
      </div>

      <div className={`flex ${isFullscreen ? 'flex-1 min-h-0' : ''}`} style={isFullscreen ? {} : { height: height - 36 }}>
        {/* Code editor */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-[#30363d]">
          <textarea
            value={currentCode}
            onChange={e => !readOnly && setCurrentCode(e.target.value)}
            onKeyDown={e => {
              // Tab key support
              if (e.key === 'Tab') {
                e.preventDefault();
                const start = e.currentTarget.selectionStart;
                const end = e.currentTarget.selectionEnd;
                const newVal = currentCode.substring(0, start) + '  ' + currentCode.substring(end);
                setCurrentCode(newVal);
                setTimeout(() => {
                  if (e.currentTarget) {
                    e.currentTarget.selectionStart = start + 2;
                    e.currentTarget.selectionEnd = start + 2;
                  }
                }, 0);
              }
              // Ctrl+Enter to run
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                run();
              }
            }}
            className="flex-1 w-full p-4 font-mono text-[13px] leading-[1.65] resize-none outline-none bg-[#0d1117] text-[#e6edf3] caret-white"
            spellCheck={false}
            readOnly={readOnly}
            style={{ tabSize: 2 }}
            placeholder={`Write your ${PANEL_LABELS[activeTab]} here...`}
          />
        </div>

        {/* Preview */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          <div className="flex items-center justify-between px-3 py-1.5 bg-[#f0f2f5] border-b border-[#d0d7de]">
            <span className="text-[11px] font-medium text-gray-500">Preview</span>
            <button
              onClick={run}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-[11px] font-medium transition-colors"
            >
              <Play className="w-3 h-3" />
              Run ▶
            </button>
          </div>
          <iframe
            ref={iframeRef}
            className="flex-1 w-full border-0"
            sandbox="allow-scripts"
            title="Live preview"
          />
          {output && (
            <div className="border-t border-[#d0d7de] bg-[#f6f8fa] px-3 py-2 max-h-24 overflow-y-auto">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Console</p>
              <pre className="text-[12px] font-mono text-gray-700 whitespace-pre-wrap">{output}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#0d1117] flex flex-col">
        {editorPanel}
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-border my-5 bg-[#0d1117]">
      {editorPanel}
      <div className="px-4 py-1.5 bg-[#161b22] border-t border-[#30363d] flex items-center justify-between">
        <span className="text-[10px] text-[#484f58] font-mono">
          Press Ctrl+Enter to run • Tab for indent
        </span>
        <button
          onClick={run}
          className="flex items-center gap-1.5 px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-[11px] font-medium transition-colors"
        >
          <Play className="w-3 h-3" />
          Run ▶
        </button>
      </div>
    </div>
  );
}
