'use client';
import { useState } from 'react';

const DEFAULT = `# Hello, Markdown!

## What is Markdown?

Markdown is a **lightweight markup language** for creating formatted text.

### Features

- **Bold text** with \`**text**\`
- *Italic text* with \`*text*\`
- \`Inline code\` with backticks
- [Links](https://webdevatlas.dev) with \`[text](url)\`

### Code Block

\`\`\`javascript
const greet = (name) => \`Hello, \${name}!\`;
console.log(greet("Developer"));
\`\`\`

### Blockquote

> Learning web development is a journey, not a destination.

---

**Happy coding! 🚀**
`;

function renderMd(md: string): string {
  return md
    .replace(/^### (.+)/gm, '<h3 style="font-size:16px;font-weight:700;margin:16px 0 8px;color:#1e1e1e">$1</h3>')
    .replace(/^## (.+)/gm, '<h2 style="font-size:20px;font-weight:700;margin:20px 0 8px;color:#1e1e1e;border-bottom:2px solid #e5e7eb;padding-bottom:6px">$1</h2>')
    .replace(/^# (.+)/gm, '<h1 style="font-size:28px;font-weight:800;margin:0 0 16px;color:#1e1e1e">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code style="background:#f4f4f4;padding:2px 6px;border-radius:4px;font-family:monospace;font-size:13px;color:#dc2626">$1</code>')
    .replace(/```[\w]*\n?([\s\S]*?)```/g, '<pre style="background:#0d1117;color:#e6edf3;padding:16px;border-radius:8px;overflow:auto;font-family:monospace;font-size:13px;margin:12px 0"><code>$1</code></pre>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:#2563eb;text-decoration:underline">$1</a>')
    .replace(/^> (.+)/gm, '<blockquote style="border-left:3px solid #e5e7eb;padding:8px 16px;color:#6b7280;margin:12px 0;font-style:italic">$1</blockquote>')
    .replace(/^- (.+)/gm, '<li style="margin:4px 0;color:#374151">$1</li>')
    .replace(/---/g, '<hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0">')
    .replace(/\n\n/g, '</p><p style="margin:0 0 12px;color:#374151;line-height:1.6">')
    .replace(/\n/g, '<br>');
}

export function MarkdownPreviewer() {
  const [md, setMd] = useState(DEFAULT);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2" style={{ color:'var(--text)' }}>Markdown Previewer</h1>
      <p className="text-sm mb-6" style={{ color:'var(--text-2)' }}>Write Markdown on the left and see the live HTML preview on the right.</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color:'var(--text-3)' }}>Markdown Input</label>
          <textarea value={md} onChange={e => setMd(e.target.value)}
            className="w-full h-96 p-4 font-mono text-[13px] rounded-xl resize-none outline-none"
            style={{ background:'#0d1117', color:'#e6edf3', border:'1px solid #30363d' }} />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color:'var(--text-3)' }}>HTML Preview</label>
          <div className="h-96 overflow-y-auto p-4 rounded-xl bg-white border"
            style={{ border:'1px solid var(--line)', fontFamily:'system-ui,sans-serif', fontSize:'14px' }}
            dangerouslySetInnerHTML={{ __html: `<p style="margin:0 0 12px;color:#374151;line-height:1.6">${renderMd(md)}</p>` }} />
        </div>
      </div>
    </div>
  );
}
