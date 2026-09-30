import { TechSectionRenderer, type TechTheme } from '@/components/shared/TechSectionRenderer';
import type { SqliteSection } from '@/data/sqlite-curriculum';

const theme: TechTheme = { tech: 'sqlite', brandColor: '#0F80CC', brandLabel: 'SQLite Simulation', defaultLanguage: 'sql' };

export function SqliteSectionRenderer({ sections }: { sections: SqliteSection[] }) {
  return <TechSectionRenderer sections={sections} theme={theme} />;
}
