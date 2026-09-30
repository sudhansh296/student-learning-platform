import { TechSectionRenderer, type TechTheme } from '@/components/shared/TechSectionRenderer';
import type { ExpressSection } from '@/data/express-curriculum';

const theme: TechTheme = { tech: 'express', brandColor: '#000', brandLabel: 'Express Simulation', defaultLanguage: 'javascript', showRuntimeErrors: true };

export function ExpressSectionRenderer({ sections }: { sections: ExpressSection[] }) {
  return <TechSectionRenderer sections={sections} theme={theme} />;
}
