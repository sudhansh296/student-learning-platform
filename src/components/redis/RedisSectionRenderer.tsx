import { TechSectionRenderer, type TechTheme } from '@/components/shared/TechSectionRenderer';
import type { RedisSection } from '@/data/redis-curriculum';

const theme: TechTheme = { tech: 'redis', brandColor: '#DC382D', brandLabel: 'Redis Simulation', defaultLanguage: 'bash' };

export function RedisSectionRenderer({ sections }: { sections: RedisSection[] }) {
  return <TechSectionRenderer sections={sections} theme={theme} />;
}
