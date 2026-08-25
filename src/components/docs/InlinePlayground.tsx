'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Play, RotateCcw, Copy, Check, Maximize2, X } from 'lucide-react';

interface InlinePlaygroundProps {
  html?: string;
  css?: string;
  js?: string;
  mode?: 'html' | 'css' | 'js' | 'full';
  title?: string;
  height?: number;
}

export function InlinePlayground({
  html: defaultHtml = '',
  css: defaultCss = '',
  js: defaultJs = '',
  mode = 'html',
  title,
  height = 380,
}: InlinePlaygroundProps) {
  const [html, setHtml] = useState(defaultHtml);
  const [css, setCss] = useState(defaultCss);
  const [js, setJs] = useState(defaultJs);
  const [tab, setTab] = useState<'html' | 'css' | 'js'>(
    mode === 'css' ? 'css' : mode === 'js' ? 'js' : 'html'
  );
  const [logs, setLogs] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const tabs = mode === 'full' ? ['html','css','js'] as const
    : mode === 'css' ? ['html','css'] as const
    : mode === 'js' ? ['html','js'] as const
    : ['html'] as const;

  const instanceId = useRef(`ip_${Math.random().toString(36).slice(2)}`);
  const runIdRef   = useRef(0);

  const buildDoc = useCallback((h: string, c: string, j: string) => {
    const rid = runIdRef.current;
    const iid = instanceId.current;
    const isJsInHtml = h.trim() && !h.trim().startsWith('<') && !h.includes('</');
    const isJsOnly = !h.trim() && (j.trim().length > 0);
    const body = isJsInHtml ? '' : (isJsOnly ? '<div id="__output" style="padding:16px;font-family:monospace;font-size:14px;line-height:1.6;color:#e6edf3;"></div>' : (h || ''));
    const script = isJsInHtml ? h : j;

    // Extra CSS for JS-only output area
    const jsOnlyCss = isJsOnly
      ? 'body{background:#0d1117;margin:0;padding:0;}#__output{min-height:100vh;}'
      : '';

    // __append helper — only injected in JS-only mode
    const appendHelper = isJsOnly ? `
const __out=document.getElementById('__output');
const __append=(cls,text)=>{
  if(!__out)return;
  const el=document.createElement('div');
  el.style.cssText='padding:4px 8px;border-radius:4px;margin:3px 0;font-size:13px;';
  el.style.background=cls==='e'?'#fef2f2':cls==='w'?'#fffbeb':'#f0fdf4';
  el.style.color=cls==='e'?'#dc2626':cls==='w'?'#92400e':'#166534';
  el.style.borderLeft='3px solid '+(cls==='e'?'#dc2626':cls==='w'?'#f59e0b':'#16a34a');
  el.textContent=(cls==='e'?'✗ ':cls==='w'?'⚠ ':'▶ ')+text;
  __out.appendChild(el);
};` : '';

    // Intercept console methods — defined BEFORE user code so onclick handlers can use them
    // Do NOT wrap user code in IIFE — functions must be global for onclick attributes to work
    const consolePatch = isJsOnly ? `
const __iid='${iid}',__rid=${rid};
const __s=(t,a)=>window.parent.postMessage({_ip:__iid,rid:__rid,t,d:a.map(x=>typeof x==='object'?JSON.stringify(x,null,2):String(x)).join(' ')},'*');
${appendHelper}
const __L=console.log,__W=console.warn,__E=console.error;
console.log=(...a)=>{__L(...a);const txt=a.map(x=>typeof x==='object'?JSON.stringify(x,null,2):String(x)).join(' ');__s('l',a);__append('l',txt)};
console.warn=(...a)=>{__W(...a);const txt=a.map(x=>typeof x==='object'?JSON.stringify(x,null,2):String(x)).join(' ');__s('w',a);__append('w',txt)};
console.error=(...a)=>{__E(...a);const txt=a.map(x=>typeof x==='object'?JSON.stringify(x,null,2):String(x)).join(' ');__s('e',a);__append('e',txt)};
window.onerror=(m,_,ln)=>{const msg='❌ '+m+(ln?' (line '+ln+')':'');__s('e',[msg]);__append('e',msg);return false};
` : `
const __iid='${iid}',__rid=${rid};
const __s=(t,a)=>window.parent.postMessage({_ip:__iid,rid:__rid,t,d:a.map(x=>typeof x==='object'?JSON.stringify(x,null,2):String(x)).join(' ')},'*');
const __L=console.log,__W=console.warn,__E=console.error;
console.log=(...a)=>{__L(...a);__s('l',a)};
console.warn=(...a)=>{__W(...a);__s('w',a)};
console.error=(...a)=>{__E(...a);__s('e',a)};
window.onerror=(m,_,ln)=>{__s('e',['❌ '+m+(ln?' (line '+ln+')':'')]);return false};
`;

    // After user code runs, show a hint if #__output exists but is still empty
    const noOutputObserver = isJsOnly ? `
;(function(){
  const __o=document.getElementById('__output');
  if(!__o)return;
  // Use MutationObserver to check after any microtasks settle
  const __mo=new MutationObserver(()=>{});
  __mo.observe(__o,{childList:true});
  setTimeout(()=>{
    __mo.disconnect();
    if(__o.children.length===0){
      const hint=document.createElement('div');
      hint.style.cssText='padding:12px 16px;color:#8b949e;font-size:13px;font-style:italic;';
      hint.textContent='No output — add console.log() to see results';
      __o.appendChild(hint);
    }
  },0);
})();` : '';

    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>*{box-sizing:border-box}body{margin:0;padding:14px;font-family:system-ui,sans-serif;font-size:15px;line-height:1.6}${jsOnlyCss}${c}</style></head>
<body>${body}<script>${consolePatch}
try{
${script}
}catch(e){__s('e',['❌ '+e.message]);${isJsOnly ? "__append('e','❌ '+e.message);" : ''}}
${noOutputObserver}
</script></body></html>`;
  }, []);

  const run = useCallback(() => {
    runIdRef.current += 1;
    if (iframeRef.current) iframeRef.current.srcdoc = buildDoc(html, css, js);
    setLogs([]);
  }, [html, css, js, buildDoc]);

  useEffect(() => { run(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const iid = instanceId.current;
    const h = (e: MessageEvent) => {
      // Only accept messages from same origin or null (srcdoc iframes)
      if (e.origin !== window.location.origin && e.origin !== 'null' && e.origin !== '') return;
      if (e.data?._ip !== iid) return;
      const pre = e.data.t === 'e' ? '❌ ' : e.data.t === 'w' ? '⚠ ' : '▶ ';
      setLogs(p => [...p.slice(-29), pre + e.data.d]);
    };
    window.addEventListener('message', h);
    return () => window.removeEventListener('message', h);
  }, []);

  const reset = () => { setHtml(defaultHtml); setCss(defaultCss); setJs(defaultJs); if (iframeRef.current) { iframeRef.current.srcdoc = buildDoc(defaultHtml, defaultCss, defaultJs); } setLogs([]); };

  const copyCode = async () => {
    const code = tab === 'html' ? html : tab === 'css' ? css : js;
    await navigator.clipboard.writeText(code);
    setCopied(true); setTimeout(() => setCopied(false), 1800);
  };

  const cur = tab === 'html' ? html : tab === 'css' ? css : js;
  const setCur = tab === 'html' ? setHtml : tab === 'css' ? setCss : setJs;

  const tabColor = { html: 'text-orange-400 border-orange-400', css: 'text-blue-400 border-blue-400', js: 'text-yellow-400 border-yellow-400' };

  const editor = (
    <div className={`rounded-xl overflow-hidden border border-[#30363d] bg-[#0d1117] ${fullscreen ? 'fixed inset-4 z-[200] flex flex-col rounded-xl shadow-2xl' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
        <div className="flex items-center gap-1">
          <div className="flex gap-1.5 mr-3">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1 text-[11px] font-mono font-semibold uppercase rounded border-b-2 transition-colors ${tab === t ? tabColor[t] + ' bg-[#21262d]' : 'border-transparent text-[#8b949e] hover:text-white'}`}>
              {t}
            </button>
          ))}
          {title && <span className="ml-3 text-[10px] text-[#484f58] font-mono">{title}</span>}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={copyCode} className="flex items-center gap-1 px-2 py-1 rounded text-[10px] text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors">
            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
          </button>
          <button onClick={reset} className="flex items-center gap-1 px-2 py-1 rounded text-[10px] text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors" title="Reset">
            <RotateCcw className="w-3 h-3" />
          </button>
          <button onClick={() => setFullscreen(f => !f)} className="flex items-center gap-1 px-2 py-1 rounded text-[10px] text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors">
            {fullscreen ? <X className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className={`flex ${fullscreen ? 'flex-1 min-h-0' : ''}`} style={fullscreen ? {} : { height: height - 40 }}>
        {/* Editor */}
        <div className="flex flex-col w-1/2 border-r border-[#30363d]">
          <textarea
            value={cur}
            onChange={e => setCur(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Tab') {
                e.preventDefault();
                const s = e.currentTarget.selectionStart;
                const v = cur.slice(0, s) + '  ' + cur.slice(e.currentTarget.selectionEnd);
                setCur(v);
                requestAnimationFrame(() => { if (e.currentTarget) { e.currentTarget.selectionStart = e.currentTarget.selectionEnd = s + 2; } });
              }
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') run();
            }}
            className="flex-1 w-full p-4 font-mono text-[13px] leading-relaxed resize-none outline-none bg-[#0d1117] text-[#e6edf3] caret-white"
            spellCheck={false}
            style={{ tabSize: 2 }}
          />
        </div>

        {/* Preview */}
        <div className="flex flex-col w-1/2" style={{ background: !html.trim() && js.trim() ? '#0d1117' : 'white' }}>
          <div className="flex items-center justify-between px-3 py-1.5 border-b" style={{ background: !html.trim() && js.trim() ? '#161b22' : '#f0f2f4', borderColor: !html.trim() && js.trim() ? '#30363d' : '#d0d7de' }}>
            <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: !html.trim() && js.trim() ? '#8b949e' : '#6b7280' }}>
              {!html.trim() && js.trim() ? 'Output' : 'Preview'}
            </span>
            <button onClick={run}
              className="flex items-center gap-1.5 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-[11px] font-semibold rounded transition-colors">
              <Play className="w-3 h-3" /> Run ▶
            </button>
          </div>
          <iframe ref={iframeRef} className="flex-1 border-0 w-full" sandbox="allow-scripts allow-forms allow-popups allow-modals" title="preview" />
          {logs.length > 0 && !(!html.trim() && js.trim()) && (
            <div className="border-t border-[#d0d7de] bg-[#f6f8fa] max-h-24 overflow-y-auto p-2">
              {logs.map((l, i) => (
                <p key={i} className={`text-[11px] font-mono leading-snug ${l.startsWith('❌') ? 'text-red-600' : l.startsWith('⚠') ? 'text-yellow-700' : 'text-gray-700'}`}>{l}</p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#161b22] border-t border-[#30363d]">
        <span className="text-[10px] text-[#484f58] font-mono">Tab = indent • Ctrl+Enter = run</span>
        <button onClick={run} className="flex items-center gap-1.5 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-[11px] font-semibold rounded transition-colors">
          <Play className="w-3 h-3" /> Run ▶
        </button>
      </div>
    </div>
  );

  return (
    <>
      {fullscreen && <div className="fixed inset-0 z-[199] bg-black/60 backdrop-blur-sm" />}
      <div className={`my-5 ${fullscreen ? '' : ''}`}>{editor}</div>
    </>
  );
}
