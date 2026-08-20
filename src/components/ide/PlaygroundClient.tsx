'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Play, RotateCcw, Maximize2, Minimize2, Copy, Check, Download, ChevronDown, Terminal, BookOpen } from 'lucide-react';
import Link from 'next/link';

const TS_JS = '// TypeScript — type annotations compile automatically\ninterface User {\n  name: string;\n  age: number;\n}\n\nfunction greet(user: User): string {\n  return "Hello, " + user.name + "! Age: " + user.age;\n}\n\nconst alex: User = { name: "Alex", age: 25 };\nconsole.log(greet(alex));\n\n// Generic function\nfunction first<T>(arr: T[]): T | undefined { return arr[0]; }\nconsole.log("first:", first([10, 20, 30]));\n\n// Union type\ntype Status = "active" | "inactive" | "pending";\nfunction getLabel(s: Status) {\n  const map: Record<Status, string> = { active: "Active", inactive: "Inactive", pending: "Pending" };\n  return map[s];\n}\nconsole.log(getLabel("active"));';

const REACT_JS = '// React — CDN React 18 + Babel loaded automatically\nfunction Counter() {\n  const [count, setCount] = React.useState(0);\n  return (\n    <div className="card">\n      <h2>\u26db\ufe0f React Counter</h2>\n      <p>Click to update state</p>\n      <div className="count">{count}</div>\n      <button onClick={() => setCount(c => c + 1)}>Increment +</button>\n      {" "}\n      <button onClick={() => setCount(0)} style={{background:"#6b7280"}}>Reset</button>\n    </div>\n  );\n}\nReactDOM.createRoot(document.getElementById("root")).render(<Counter />);';

const TEMPLATES: Record<string, { html: string; css: string; js: string; label: string; desc: string; icon: string }> = {
  blank: {
    icon: '📄', label: 'Blank', desc: 'Start from scratch',
    html: '<!-- Write your HTML here -->\n<h1>Hello, World!</h1>\n<p>Edit me and click \u25b6 Run</p>',
    css: 'body {\n  font-family: system-ui, sans-serif;\n  padding: 24px;\n  background: #f9fafb;\n  color: #111827;\n}\nh1 { color: #2563eb; font-size: 2rem; margin-bottom: 8px; }\np { color: #6b7280; }',
    js: '// Write JavaScript here\nconsole.log("Hello from JavaScript!");\nconsole.log("Add more console.log() calls to see output here.");',
  },
  typescript: {
    icon: '🔷', label: 'TypeScript', desc: 'TypeScript with type checking',
    html: '', css: '', js: TS_JS,
  },
  react: {
    icon: '⚛️', label: 'React', desc: 'React component with JSX',
    html: '<div id="root"></div>',
    css: 'body{margin:0;font-family:system-ui,sans-serif;background:#f0f4ff;}\n.card{background:white;border-radius:12px;padding:20px;max-width:320px;margin:20px auto;box-shadow:0 4px 20px rgba(0,0,0,.1);}\nh2{color:#2563eb;margin:0 0 8px;}\np{color:#6b7280;font-size:14px;margin:0 0 12px;}\nbutton{background:#2563eb;color:white;border:none;padding:8px 16px;border-radius:8px;cursor:pointer;font-size:14px;}\n.count{font-size:32px;font-weight:800;color:#2563eb;text-align:center;margin:12px 0;}',
    js: REACT_JS,
  },
  counter: {
    icon: '🔢', label: 'Counter App', desc: 'Click buttons, update UI',
    html: '<div class="app">\n  <h2>Counter</h2>\n  <div class="display" id="count">0</div>\n  <div class="btns">\n    <button id="dec">\u2212</button>\n    <button id="inc">+</button>\n  </div>\n  <button id="reset">Reset</button>\n</div>',
    css: '.app{font-family:system-ui;text-align:center;padding:40px;}\nh2{color:#374151;margin-bottom:20px;font-size:1.2rem;text-transform:uppercase;}\n.display{font-size:80px;font-weight:800;color:#2563eb;line-height:1;margin-bottom:24px;}\n.btns{display:flex;justify-content:center;gap:16px;margin-bottom:16px;}\nbutton{padding:12px 28px;font-size:24px;border:none;border-radius:12px;background:#2563eb;color:white;cursor:pointer;font-weight:700;}\n#reset{background:#e5e7eb;color:#374151;font-size:14px;padding:8px 20px;}',
    js: 'let count = 0;\nconst el = document.getElementById("count");\nfunction update() {\n  el.textContent = count;\n  el.style.color = count > 0 ? "#16a34a" : count < 0 ? "#dc2626" : "#2563eb";\n}\ndocument.getElementById("inc").onclick = () => { count++; update(); };\ndocument.getElementById("dec").onclick = () => { count--; update(); };\ndocument.getElementById("reset").onclick = () => { count = 0; update(); };\nconsole.log("Counter ready!");',
  },
  todo: {
    icon: '✅', label: 'Todo List', desc: 'Add, complete, remove tasks',
    html: '<div class="app">\n  <h2>\ud83d\udcdd My Tasks</h2>\n  <div class="row">\n    <input id="inp" placeholder="Add a task..." />\n    <button id="add">Add</button>\n  </div>\n  <ul id="list"></ul>\n  <p id="empty">No tasks yet \u2728</p>\n</div>',
    css: '.app{font-family:system-ui;max-width:420px;margin:20px auto;padding:24px;background:white;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,.08);}\nh2{margin:0 0 20px;font-size:1.1rem;color:#1e293b;}\n.row{display:flex;gap:8px;margin-bottom:16px;}\ninput{flex:1;padding:10px 14px;border:2px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;}\ninput:focus{border-color:#2563eb;}\nbutton{padding:10px 16px;background:#2563eb;color:white;border:none;border-radius:10px;cursor:pointer;font-weight:600;font-size:14px;}\nul{list-style:none;padding:0;margin:0;}\nli{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;margin-bottom:6px;background:#f8fafc;border:1px solid #e2e8f0;}\nli.done span{text-decoration:line-through;color:#94a3b8;}\nli span{flex:1;font-size:14px;}\nli button{padding:4px 10px;background:#ef4444;font-size:12px;border-radius:6px;}\n#empty{text-align:center;color:#94a3b8;font-size:14px;padding:20px;}',
    js: 'let todos=[];\nconst inp=document.getElementById("inp"),list=document.getElementById("list"),empty=document.getElementById("empty");\nfunction render(){list.innerHTML="";empty.style.display=todos.length?"none":"block";todos.forEach((t,i)=>{const li=document.createElement("li");if(t.done)li.className="done";li.innerHTML=`<input type="checkbox" ${t.done?"checked":""}><span>${t.text}</span><button onclick="del(${i})">\u2715</button>`;li.querySelector("input").onchange=()=>toggle(i);list.appendChild(li);});}\nfunction add(){const v=inp.value.trim();if(!v)return;todos.push({text:v,done:false});inp.value="";render();console.log("Tasks:",todos.length);}\nfunction toggle(i){todos[i].done=!todos[i].done;render();}\nfunction del(i){todos.splice(i,1);render();}\ndocument.getElementById("add").onclick=add;\ninp.onkeydown=e=>e.key==="Enter"&&add();\nrender();',
  },
  fetch: {
    icon: '🌐', label: 'Fetch API', desc: 'Real API call with async/await',
    html: '<div class="app">\n  <h2>\ud83c\udf10 Fetch API Demo</h2>\n  <button id="btn">Load Random User</button>\n  <div id="card"></div>\n  <p id="status"></p>\n</div>',
    css: '.app{font-family:system-ui;padding:24px;max-width:400px;}\nh2{color:#1e293b;margin-bottom:16px;}\nbutton{padding:10px 20px;background:#2563eb;color:white;border:none;border-radius:10px;cursor:pointer;font-weight:600;}\nbutton:disabled{background:#94a3b8;cursor:not-allowed;}\n#card{margin-top:16px;padding:16px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;display:none;}\n#card img{width:64px;height:64px;border-radius:50%;float:left;margin-right:14px;}\n#status{margin-top:10px;font-size:13px;}',
    js: 'const btn=document.getElementById("btn"),card=document.getElementById("card"),status=document.getElementById("status");\nbtn.addEventListener("click",async()=>{\n  btn.textContent="Loading...";btn.disabled=true;card.style.display="none";status.textContent="";\n  try{\n    const res=await fetch("https://randomuser.me/api/");\n    if(!res.ok)throw new Error("HTTP "+res.status);\n    const data=await res.json();const u=data.results[0];\n    card.innerHTML=`<img src="${u.picture.medium}" alt="avatar"><div><strong>${u.name.first} ${u.name.last}</strong><br>${u.email}<br>${u.location.city}, ${u.location.country}</div>`;\n    card.style.display="block";status.textContent="\u2705 Loaded!";status.style.color="#16a34a";\n    console.log("Loaded:",u.name.first,u.name.last);\n  }catch(err){status.textContent="\u274c "+err.message;status.style.color="#dc2626";console.error(err.message);}\n  finally{btn.textContent="Load Another User";btn.disabled=false;}\n});',
  },
  calculator: {
    icon: '🧮', label: 'Calculator', desc: 'Full working calculator',
    html: '<div class="calc">\n  <div class="screen"><div id="expr"></div><div id="result">0</div></div>\n  <div class="keys">\n    <button class="span2 fn" onclick="clearCalc()">AC</button>\n    <button class="fn" onclick="sign()">\u00b1</button>\n    <button class="op" onclick="op(\'/\')">\u00f7</button>\n    <button onclick="num(7)">7</button><button onclick="num(8)">8</button><button onclick="num(9)">9</button>\n    <button class="op" onclick="op(\'*\')">\u00d7</button>\n    <button onclick="num(4)">4</button><button onclick="num(5)">5</button><button onclick="num(6)">6</button>\n    <button class="op" onclick="op(\'-\')">\u2212</button>\n    <button onclick="num(1)">1</button><button onclick="num(2)">2</button><button onclick="num(3)">3</button>\n    <button class="op" onclick="op(\'+\')">+</button>\n    <button class="span2" onclick="num(0)">0</button>\n    <button onclick="num(\'.\')">.</button>\n    <button class="eq" onclick="calc()">=</button>\n  </div>\n</div>',
    css: '.calc{font-family:-apple-system,sans-serif;background:#1c1c1e;border-radius:20px;padding:20px;max-width:280px;margin:16px auto;}\n.screen{text-align:right;padding:8px 8px 20px;}\n#expr{color:#8e8e93;font-size:15px;min-height:22px;}\n#result{color:white;font-size:52px;font-weight:200;margin-top:4px;}\n.keys{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}\nbutton{background:#333336;color:white;border:none;border-radius:50%;width:56px;height:56px;font-size:20px;cursor:pointer;}\n.fn{background:#a1a1a6;color:#1c1c1e;}\n.op,.eq{background:#ff9f0a;}\n.span2{border-radius:28px;width:auto;grid-column:span 2;padding:0 20px;}',
    js: 'let expr="";\nconst exprEl=document.getElementById("expr"),resultEl=document.getElementById("result");\nfunction num(v){expr+=v;exprEl.textContent=expr;}\nfunction op(v){expr+=v;exprEl.textContent=expr;}\nfunction clearCalc(){expr="";exprEl.textContent="";resultEl.textContent="0";}\nfunction sign(){if(expr){expr=expr.startsWith("-")?expr.slice(1):"-"+expr;exprEl.textContent=expr;}}\nfunction calc(){try{const r=Function("return "+expr)();resultEl.textContent=parseFloat(r.toFixed(10));exprEl.textContent=expr+" =";expr=String(r);console.log(expr.split("=")[0].trim(),"=",r);}catch{resultEl.textContent="Error";}}',
  },
};

// Build the iframe HTML for a given mode
function buildIframe(h: string, c: string, j: string, runId: number): string {
  const isJsInHtml = h.trim() && !h.trim().startsWith('<') && !h.includes('</');
  const bodyContent = isJsInHtml ? '' : (h || '');
  const jsContent   = isJsInHtml ? h : j;

  const hasReact = /ReactDOM\.(createRoot|render)|React\.(useState|useEffect|useRef)\b|return\s*\(\s*<|<[A-Z]\w*\s*\/>|return\s*<[A-Z]|className=|htmlFor=|onClick=|onChange=/.test(jsContent);
  const hasTS    = !hasReact && (
    /:\s*(string|number|boolean|any|void|never|unknown)\b/.test(jsContent) ||
    /^(interface|type|enum)\s+\w/m.test(jsContent) ||
    /:\s*\w+\[\]/.test(jsContent)
  );

  // The bridge - uses var so it's accessible from new Function() and Babel script contexts
  const bridge = [
    'var __rid=' + runId + ';',
    'var __logs=[];',
    'function __post(t,msg){',
    '  try{window.parent.postMessage({_wda:1,rid:__rid,t:t,d:msg},"*");}catch(e){}',
    '}',
    'var __ol=console.log,__ow=console.warn,__oe=console.error;',
    'console.log=function(){',
    '  var args=Array.prototype.slice.call(arguments);',
    '  __ol.apply(console,arguments);',
    '  var msg=args.map(function(x){return typeof x==="object"?JSON.stringify(x,null,2):String(x);}).join(" ");',
    '  __post("l",msg);',
    '  __logs.push(msg);',
    '};',
    'console.warn=function(){',
    '  var args=Array.prototype.slice.call(arguments);',
    '  __ow.apply(console,arguments);',
    '  if(String(args[0]||"").indexOf("Babel")===-1){',
    '    __post("w",args.map(function(x){return String(x);}).join(" "));',
    '  }',
    '};',
    'console.error=function(){',
    '  var args=Array.prototype.slice.call(arguments);',
    '  __oe.apply(console,arguments);',
    '  __post("e",args.map(function(x){return String(x);}).join(" "));',
    '};',
    'window.onerror=function(m,s,l){__post("e","❌ "+m+(l?" (line "+l+")":""));return false;};',
  ].join('');

  const style = `*{box-sizing:border-box}body{margin:0;padding:16px;font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;background:#fff;color:#111}${c}`;

  if (hasTS) {
    // Strip import/export statements before compiling — CDN mode doesn't support ES modules
    const cleanedTS = jsContent
      .replace(/^import\s+.*?from\s+['"][^'"]+['"]\s*;?\s*$/gm, '')
      .replace(/^export\s+(default\s+)?/gm, '');
    const escaped = JSON.stringify(cleanedTS);
    return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<script src="https://cdn.jsdelivr.net/npm/typescript@5/lib/typescript.js"></script>
<style>${style}</style></head>
<body>${bodyContent}
<script>
${bridge}
(function(){
  var __root=document.getElementById('root');
  if(!__root){__root=document.createElement('div');__root.id='root';document.body.appendChild(__root);}
})();
try{
  var __compiled=ts.transpileModule(${escaped},{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.None,strict:false}});
  // Wrap in async IIFE so top-level await works
  var __asyncFn='(async function(){'+__compiled.outputText+'})()';
  var __result=new Function('return '+__asyncFn)();
  if(__result&&typeof __result.catch==='function'){
    __result.catch(function(e){
      __post('e','❌ '+e.message);
      var d=document.createElement('div');
      d.style.cssText='color:#dc2626;background:#fef2f2;padding:12px;border-radius:8px;font-family:monospace;font-size:13px;margin-top:8px;white-space:pre-wrap';
      d.textContent='❌ TypeScript Error: '+e.message;
      document.body.appendChild(d);
    });
  }
}catch(e){
  __post('e','❌ TypeScript: '+e.message);
  var __errDiv=document.createElement('div');
  __errDiv.style.cssText='color:#dc2626;background:#fef2f2;padding:12px;border-radius:8px;font-family:monospace;font-size:13px;margin-top:8px;white-space:pre-wrap';
  __errDiv.textContent='❌ TypeScript Error: '+e.message;
  document.body.appendChild(__errDiv);
}
</script></body></html>`;
  }

  if (hasReact) {
    // Strip ES module import statements — CDN React is already loaded globally
    let rc = jsContent
      .replace(/^import\s+.*?from\s+['"][^'"]+['"]\s*;?\s*$/gm, '')
      .replace(/^import\s+['"][^'"]+['"]\s*;?\s*$/gm, '');
    if (!rc.includes('ReactDOM.createRoot') && !rc.includes('ReactDOM.render')) {
      const m = rc.match(/function\s+([A-Z]\w*)/g);
      const last = m ? m[m.length-1].replace('function ','') : '';
      if (last) {
        rc += '\nif(typeof '+last+'!=="undefined"&&document.getElementById("root")){ReactDOM.createRoot(document.getElementById("root")).render(React.createElement('+last+'));}';
      }
    }
    return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<style>${style}</style></head>
<body>${bodyContent || '<div id="root"></div>'}
<script>${bridge}</script>
<script type="text/babel">
(async function(){
try{
  ${rc}
}catch(e){
  console.error('❌ '+e.message);
  var rootEl=document.getElementById('root');
  if(rootEl){rootEl.innerHTML='<div style="color:#dc2626;background:#fef2f2;padding:12px;border-radius:8px;font-family:monospace;font-size:13px;white-space:pre-wrap">❌ React Error: '+e.message+'</div>';}
}
})();
</script></body></html>`;
  }

  // Plain JS/HTML
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>${style}</style></head>
<body>${bodyContent}
<script>
${bridge}
// Provide common stubs so teaching examples don't crash on missing DOM elements
(function(){
  var __root=document.getElementById('root');
  if(!__root){__root=document.createElement('div');__root.id='root';document.body.appendChild(__root);}
  var __demo=document.getElementById('demo');
  if(!__demo){__demo=document.createElement('div');__demo.id='demo';__demo.style.display='none';document.body.appendChild(__demo);}
})();
// Wrap in async IIFE so top-level await works
(async function(){
try{
${jsContent}
}catch(e){
  __post("e","❌ "+e.message);
  var __errDiv=document.createElement('div');
  __errDiv.style.cssText='color:#dc2626;background:#fef2f2;padding:12px;border-radius:8px;font-family:monospace;font-size:13px;margin-top:8px;white-space:pre-wrap';
  __errDiv.textContent='❌ Error: '+e.message;
  document.body.appendChild(__errDiv);
}
})();
</script></body></html>`;
}

export function PlaygroundClient() {
  const searchParams = useSearchParams();

  function decodeParam(key: string): string {
    const val = searchParams.get(key);
    if (!val) return '';
    try { return decodeURIComponent(escape(atob(decodeURIComponent(val)))); } catch { return ''; }
  }

  const urlHtml = decodeParam('html');
  const urlCss  = decodeParam('css');
  const urlJs   = decodeParam('js');

  // When JS is pre-loaded from URL (from lesson Code Editor button),
  // detect if it needs React/TS mode and set appropriate HTML
  const initHtml = urlHtml || (() => {
    if (urlJs) {
      const hasR = /ReactDOM\.(createRoot|render)|return\s*\(\s*<|<[A-Z]\w*\s*\/>/.test(urlJs);
      if (hasR) return '<div id="root"></div>';
    }
    return TEMPLATES.blank.html;
  })();

  const [html, setHtml] = useState(initHtml);
  const [css,  setCss]  = useState(urlCss  || TEMPLATES.blank.css);
  const [js,   setJs]   = useState(urlJs   || TEMPLATES.blank.js);
  const [tab, setTab]   = useState<'html' | 'css' | 'js'>(urlCss ? 'css' : urlJs ? 'js' : 'html');
  const [logs, setLogs] = useState<{ type: string; msg: string }[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied]   = useState(false);
  const [activeTemplate, setActiveTemplate] = useState('blank');
  const [showTemplates, setShowTemplates]   = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const runIdRef  = useRef(0);

  const run = useCallback((h: string, c: string, j: string) => {
    runIdRef.current += 1;
    const doc = buildIframe(h, c, j, runIdRef.current);
    if (iframeRef.current) iframeRef.current.srcdoc = doc;
    setLogs([]);
  }, []);

  const runCurrent = useCallback(() => run(html, css, js), [html, css, js, run]);

  useEffect(() => { run(initHtml, urlCss || TEMPLATES.blank.css, urlJs || TEMPLATES.blank.js); }, []); // eslint-disable-line

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!e.data?._wda) return;
      setLogs(p => [...p.slice(-49), { type: e.data.t, msg: e.data.d }]);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const loadTemplate = (key: string) => {
    const t = TEMPLATES[key];
    setHtml(t.html); setCss(t.css); setJs(t.js);
    setActiveTemplate(key); setShowTemplates(false);
    setTimeout(() => run(t.html, t.css, t.js), 40);
  };

  const copy = async () => {
    const code = tab === 'html' ? html : tab === 'css' ? css : js;
    await navigator.clipboard.writeText(code);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const exportFile = () => {
    const blob = new Blob([buildIframe(html, css, js, 0)], { type: 'text/html' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = 'project.html'; a.click();
  };

  const cur    = tab === 'html' ? html : tab === 'css' ? css : js;
  const setCur = (v: string) => { if (tab === 'html') setHtml(v); else if (tab === 'css') setCss(v); else setJs(v); };

  // Language mode badge
  const hasReact = /ReactDOM\.(createRoot|render)|return\s*\(<|<[A-Z]\w*\s*\/>/.test(js);
  const hasTS    = !hasReact && (/:\s*(string|number|boolean)\b/.test(js) || /^(interface|type|enum)\s+\w/m.test(js));
  const langMode = tab === 'js' ? (hasReact ? '⚛️ React' : hasTS ? '🔷 TypeScript' : '⚡ JavaScript') : tab === 'html' ? '🌐 HTML' : '🎨 CSS';

  const tabCls = (t: string) => `px-4 py-2.5 text-[12px] font-mono font-bold tracking-wide border-b-2 transition-colors ${
    tab === t
      ? t === 'html' ? 'text-orange-400 border-orange-400 bg-orange-400/5'
        : t === 'css' ? 'text-blue-400 border-blue-400 bg-blue-400/5'
        : 'text-yellow-400 border-yellow-400 bg-yellow-400/5'
      : 'text-[#6b7280] border-transparent hover:text-white hover:bg-white/5'
  }`;
  const logCls = (t: string) => `text-[11px] font-mono py-0.5 px-1 ${t === 'e' ? 'text-red-400' : t === 'w' ? 'text-yellow-400' : 'text-[#3fb950]'}`;

  return (
    <div className={`flex flex-col bg-[#0d1117] ${isFullscreen ? 'fixed inset-0 z-[100]' : 'min-h-[calc(100vh-58px)]'}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#30363d] shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 text-white font-bold text-[13px] font-mono mr-1">
            <Terminal className="w-4 h-4 text-green-400" />
            <span className="hidden sm:inline">Code Editor</span>
          </Link>
          <div className="relative">
            <button onClick={() => setShowTemplates(!showTemplates)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white text-[11px] font-medium transition-colors">
              <span>{TEMPLATES[activeTemplate].icon}</span>
              <span className="hidden sm:inline">{TEMPLATES[activeTemplate].label}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {showTemplates && (
              <div className="absolute top-full left-0 mt-1 w-52 bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#484f58]">Templates</p>
                {Object.entries(TEMPLATES).map(([k, t]) => (
                  <button key={k} onClick={() => loadTemplate(k)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-[#21262d] transition-colors ${activeTemplate === k ? 'text-white' : 'text-[#8b949e]'}`}>
                    <span className="text-base">{t.icon}</span>
                    <div><p className="text-[12px] font-semibold">{t.label}</p><p className="text-[10px] text-[#484f58]">{t.desc}</p></div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={copy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-[#8b949e] hover:text-white hover:bg-[#21262d]">
            {copied ? <><Check className="w-3.5 h-3.5 text-green-400" /><span className="hidden sm:inline text-green-400">Copied!</span></> : <><Copy className="w-3.5 h-3.5" /><span className="hidden sm:inline">Copy</span></>}
          </button>
          <button onClick={exportFile} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-[#8b949e] hover:text-white hover:bg-[#21262d]">
            <Download className="w-3.5 h-3.5" /><span className="hidden sm:inline">Export</span>
          </button>
          <Link href="/js/introduction" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-[#8b949e] hover:text-white hover:bg-[#21262d]">
            <BookOpen className="w-3.5 h-3.5" />Tutorial
          </Link>
          <button onClick={runCurrent}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 text-white text-[12px] font-bold transition-colors shadow-lg shadow-green-900/30">
            <Play className="w-3.5 h-3.5" />Run ▶
          </button>
          <button onClick={() => setIsFullscreen(f => !f)} className="p-1.5 rounded-lg text-[#6b7280] hover:text-white hover:bg-[#21262d]">
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-1 min-h-0">
        {/* Editor */}
        <div className="flex flex-col w-1/2 border-r border-[#30363d]">
          <div className="flex items-center bg-[#0d1117] border-b border-[#30363d]">
            {(['html','css','js'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className={tabCls(t)}>{t.toUpperCase()}</button>
            ))}
            <span className="ml-2 text-[10px] text-[#8b949e] font-mono hidden sm:block">{langMode}</span>
            <span className="ml-auto pr-3 text-[10px] text-[#484f58] font-mono hidden lg:block">Ctrl+Enter = run</span>
          </div>
          <textarea value={cur} onChange={e => setCur(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Tab') {
                e.preventDefault();
                const s = e.currentTarget.selectionStart;
                const v = cur.slice(0, s) + '  ' + cur.slice(e.currentTarget.selectionEnd);
                setCur(v);
                requestAnimationFrame(() => { if(e.currentTarget){e.currentTarget.selectionStart=e.currentTarget.selectionEnd=s+2;}});
              }
              if ((e.ctrlKey||e.metaKey) && e.key === 'Enter') runCurrent();
            }}
            spellCheck={false}
            className="flex-1 w-full p-4 font-mono text-[13px] leading-relaxed resize-none outline-none bg-[#0d1117] text-[#e6edf3] caret-white"
            style={{ tabSize: 2 }} />
        </div>

        {/* Preview + Console */}
        <div className="flex flex-col w-1/2">
          <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 shrink-0">
            <div className="flex items-center gap-1.5">
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              </div>
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest ml-2">Live Preview</span>
            </div>
            <button onClick={runCurrent} className="text-gray-400 hover:text-gray-700 transition-colors"><RotateCcw className="w-3.5 h-3.5" /></button>
          </div>
          <iframe ref={iframeRef} className="flex-1 bg-white border-0 w-full"
            sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-modals" title="Live Preview" />
          <div className="border-t border-[#30363d] bg-[#0d1117] shrink-0" style={{ minHeight: 36, maxHeight: 160 }}>
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#21262d]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#6b7280]">
                Console {logs.length > 0 && <span className="ml-1 text-[#484f58]">({logs.length})</span>}
              </span>
              <button onClick={() => setLogs([])} className="text-[10px] text-[#484f58] hover:text-[#8b949e]">Clear</button>
            </div>
            <div className="overflow-y-auto p-2 space-y-0.5" style={{ maxHeight: 120 }}>
              {logs.length === 0
                ? <p className="text-[11px] text-[#484f58] font-mono px-1">console.log() output appears here...</p>
                : logs.map((l, i) => <p key={i} className={logCls(l.type)}>{l.msg}</p>)}
            </div>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-1 bg-[#161b22] border-t border-[#30363d] shrink-0">
        <span className="text-[10px] text-[#484f58] font-mono">{tab.toUpperCase()} · {cur.split('\n').length} lines</span>
        <span className="text-[10px] text-[#484f58] font-mono">HTML · CSS · JS · TypeScript · React — all supported</span>
      </div>
    </div>
  );
}
