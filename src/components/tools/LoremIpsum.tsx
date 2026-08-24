'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'reprehenderit', 'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'];

function generateSentence() {
  const len = Math.floor(Math.random() * 10) + 8;
  return Array.from({ length: len }, () => words[Math.floor(Math.random() * words.length)]).join(' ');
}

function generateParagraph() {
  const sentences = Math.floor(Math.random() * 4) + 4;
  return Array.from({ length: sentences }, () => {
    const s = generateSentence();
    return s.charAt(0).toUpperCase() + s.slice(1) + '.';
  }).join(' ');
}

export function LoremIpsum() {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  function generate() {
    let result = '';
    if (type === 'paragraphs') {
      result = Array.from({ length: count }, () => generateParagraph()).join('\n\n');
    } else if (type === 'sentences') {
      result = Array.from({ length: count }, () => {
        const sent = generateSentence();
        return sent.charAt(0).toUpperCase() + sent.slice(1) + '.';
      }).join(' ');
    } else {
      result = Array.from({ length: count }, () => words[Math.floor(Math.random() * words.length)]).join(' ');
    }
    setOutput(result);
  }

  async function copy() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-2">Lorem Ipsum Generator</h1>
      <p className="text-muted-foreground text-sm mb-6">Generate placeholder text for your designs and mockups.</p>

      <div className="flex items-end gap-3 mb-4 flex-wrap">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Count</label>
          <input
            type="number"
            min={1}
            max={20}
            value={count}
            onChange={e => setCount(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Type</label>
          <div className="flex gap-1.5">
            {(['paragraphs', 'sentences', 'words'] as const).map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                  type === t ? 'bg-blue-600 text-white' : 'border border-border bg-background text-muted-foreground hover:bg-muted/60'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <button onClick={generate} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
          Generate
        </button>
      </div>

      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Output</label>
            <button onClick={copy} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="p-4 bg-muted/30 border border-border rounded-xl text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
            {output}
          </div>
        </div>
      )}
    </div>
  );
}
