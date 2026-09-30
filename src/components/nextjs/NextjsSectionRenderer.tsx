import { TechSectionRenderer, type TechTheme } from '@/components/shared/TechSectionRenderer';
import type { NextjsSection } from '@/data/nextjs-curriculum';

const theme: TechTheme = {
  tech: 'nextjs', brandColor: '#000000',
  brandLabel: 'Next.js Simulation',
  defaultLanguage: 'typescript',
  labelPrefix: '▲ ',
  tryItAccent: { bar: '#22c55e', text: '#16a34a' },
  runButtonClassName: 'bg-black hover:bg-gray-800',
  runButtonLabel: 'Run ▶',
  copyCheckColor: 'text-green-400',
};

export function NextjsSectionRenderer({ sections }: { sections: NextjsSection[] }) {
  return <TechSectionRenderer sections={sections} theme={theme} />;
}
