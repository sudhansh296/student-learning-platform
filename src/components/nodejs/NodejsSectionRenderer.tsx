import { TechSectionRenderer, type TechTheme } from '@/components/shared/TechSectionRenderer';
import type { NodejsSection } from '@/data/nodejs-curriculum';

const theme: TechTheme = { tech: 'nodejs', brandColor: '#339933', brandLabel: 'Node.js Simulation', defaultLanguage: 'javascript', copyCheckColor: 'text-green-200' };

export function NodejsSectionRenderer({ sections }: { sections: NodejsSection[] }) {
  return <TechSectionRenderer sections={sections} theme={theme} />;
}
