import { TechSectionRenderer, type TechTheme } from '@/components/shared/TechSectionRenderer';
import type { PostgresqlSection } from '@/data/postgresql-curriculum';

const theme: TechTheme = { tech: 'postgresql', brandColor: '#336791', brandLabel: 'PostgreSQL Simulation', defaultLanguage: 'sql' };

export function PostgresqlSectionRenderer({ sections }: { sections: PostgresqlSection[] }) {
  return <TechSectionRenderer sections={sections} theme={theme} />;
}
