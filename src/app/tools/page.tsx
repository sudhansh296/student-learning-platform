import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Developer Tools',
  description: 'Free browser-based developer tools for formatting, encoding, and more.'
};

const tools = [
  { id: 'json-formatter', name: 'JSON Formatter', desc: 'Format and validate JSON data', icon: '{ }', category: 'Data' },
  { id: 'base64', name: 'Base64 Encoder/Decoder', desc: 'Encode or decode Base64 strings', icon: '🔐', category: 'Encoding' },
  { id: 'url-encoder', name: 'URL Encoder/Decoder', desc: 'Encode or decode URL strings', icon: '🔗', category: 'Encoding' },
  { id: 'regex-tester', name: 'Regex Tester', desc: 'Test regular expressions with live matching', icon: '.*', category: 'Testing' },
  { id: 'jwt-decoder', name: 'JWT Decoder', desc: 'Decode and inspect JWT tokens', icon: '🔑', category: 'Auth' },
  { id: 'color-converter', name: 'Color Converter', desc: 'Convert between HEX, RGB, HSL, and more', icon: '🎨', category: 'CSS' },
  { id: 'css-gradient', name: 'CSS Gradient Generator', desc: 'Generate beautiful CSS gradients', icon: '🌈', category: 'CSS' },
  { id: 'timestamp', name: 'Timestamp Converter', desc: 'Convert Unix timestamps to readable dates', icon: '🕐', category: 'Utilities' },
  { id: 'uuid-generator', name: 'UUID Generator', desc: 'Generate random UUID v4 values', icon: '🆔', category: 'Utilities' },
  { id: 'hash-generator', name: 'Hash Generator', desc: 'Generate SHA-1, SHA-256, SHA-384, SHA-512 hashes', icon: '#️⃣', category: 'Security' },
  { id: 'markdown-preview', name: 'Markdown Previewer', desc: 'Preview Markdown as formatted HTML', icon: '📝', category: 'Content' },
  { id: 'lorem-ipsum', name: 'Lorem Ipsum Generator', desc: 'Generate placeholder text', icon: '📄', category: 'Content' },
];

const categories = [...new Set(tools.map(t => t.category))];

export default function ToolsPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-3">Developer Tools</h1>
        <p className="text-muted-foreground max-w-xl leading-relaxed">
          Free browser-based tools for everyday developer tasks — no account needed.
        </p>
      </div>

      <div className="space-y-8">
        {categories.map(cat => (
          <section key={cat}>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">{cat}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tools.filter(t => t.category === cat).map(tool => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.id}`}
                  className="group flex items-start gap-4 p-4 rounded-xl border border-border bg-background hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-sm transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-base font-mono font-bold text-muted-foreground shrink-0">
                    {tool.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{tool.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
