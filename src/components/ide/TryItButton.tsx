'use client';

import { useState } from 'react';
import { Play, ChevronDown, ChevronUp } from 'lucide-react';
import { LiveEditor } from './LiveEditor';

interface TryItButtonProps {
  html?: string;
  css?: string;
  js?: string;
  mode?: 'html' | 'css' | 'js' | 'full';
  label?: string;
}

export function TryItButton({ html, css, js, mode = 'html', label }: TryItButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="my-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors"
      >
        <Play className="w-3.5 h-3.5" />
        {label || 'Try it Yourself »'}
        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {open && (
        <LiveEditor
          defaultHTML={html}
          defaultCSS={css}
          defaultJS={js}
          mode={mode}
          height={360}
        />
      )}
    </div>
  );
}
