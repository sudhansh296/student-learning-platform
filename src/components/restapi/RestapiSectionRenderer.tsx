import { TechSectionRenderer, type TechTheme } from '@/components/shared/TechSectionRenderer';
import type { RestapiSection } from '@/data/restapi-curriculum';

const theme: TechTheme = { tech: 'restapi', brandColor: '#FF6B35', brandLabel: 'REST API Simulation', defaultLanguage: 'javascript' };

export function RestapiSectionRenderer({ sections }: { sections: RestapiSection[] }) {
  return <TechSectionRenderer sections={sections} theme={theme} />;
}
