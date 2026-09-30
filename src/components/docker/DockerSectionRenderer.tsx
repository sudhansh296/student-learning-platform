import { TechSectionRenderer, type TechTheme } from '@/components/shared/TechSectionRenderer';
import type { DockerSection } from '@/data/docker-curriculum';

const theme: TechTheme = { tech: 'docker', brandColor: '#2496ED', brandLabel: 'Docker Simulation', defaultLanguage: 'bash' };

export function DockerSectionRenderer({ sections }: { sections: DockerSection[] }) {
  return <TechSectionRenderer sections={sections} theme={theme} />;
}
