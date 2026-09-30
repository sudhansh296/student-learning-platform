import { TechSectionRenderer, type TechTheme } from '@/components/shared/TechSectionRenderer';
import type { MongodbSection } from '@/data/mongodb-curriculum';

const theme: TechTheme = { tech: 'mongodb', brandColor: '#00ED64', brandLabel: 'Mongodb Simulation', defaultLanguage: 'javascript' };

export function MongodbSectionRenderer({ sections }: { sections: MongodbSection[] }) {
  return <TechSectionRenderer sections={sections} theme={theme} />;
}
