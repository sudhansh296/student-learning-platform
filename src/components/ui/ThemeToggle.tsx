'use client';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  if (!m) return <div className="w-9 h-9 rounded-lg border" style={{ borderColor: 'var(--line)' }} />;
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-9 h-9 rounded-lg flex items-center justify-center border transition-colors"
      style={{ borderColor: 'var(--line)', background: 'var(--bg-section)' }}
      aria-label="Toggle theme"
    >
      {theme === 'dark'
        ? <Sun  className="w-4 h-4 text-yellow-400" />
        : <Moon className="w-4 h-4" style={{ color: 'var(--text-2)' }} />}
    </button>
  );
}
