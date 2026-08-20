import { Suspense } from 'react';
import { PlaygroundClient } from '@/components/ide/PlaygroundClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Code Editor — WebDev Atlas',
  description: 'Write and run HTML, CSS, and JavaScript code directly in your browser.',
};

export default function PlaygroundPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <p className="text-[#8b949e] font-mono text-sm">Loading Code Editor...</p>
      </div>
    }>
      <PlaygroundClient />
    </Suspense>
  );
}
