import { TechSectionRenderer, type TechTheme } from '@/components/shared/TechSectionRenderer';
import type { SqlSection } from '@/data/sql-curriculum';

const theme: TechTheme = { tech: 'sql', brandColor: '#F29111', brandLabel: 'SQL Simulation', defaultLanguage: 'sql' };

export function SqlSectionRenderer({ sections }: { sections: SqlSection[] }) {
  return <TechSectionRenderer sections={sections} theme={theme} />;
}
