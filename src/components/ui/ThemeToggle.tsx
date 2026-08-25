'use client';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);
  
  // Show placeholder while mounting to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg flex items-center justify-center" 
        style={{ border: '2px solid var(--line)', background: 'var(--card)' }} 
      />
    );
  }
  
  const isDark = theme === 'dark';
  
  return (
    <button
      onClick={() => {
        setTheme(isDark ? 'light' : 'dark');
      }}
      className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      style={{ 
        border: '2px solid var(--line)',
        background: isDark ? '#1f2937' : '#ffffff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun className="w-5 h-5" style={{ color: '#fbbf24' }} />
      ) : (
        <Moon className="w-5 h-5" style={{ color: '#1f2937' }} />
      )}
    </button>
  );
}
