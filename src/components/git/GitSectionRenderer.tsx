import { TechSectionRenderer, type TechTheme } from '@/components/shared/TechSectionRenderer';
import type { GitSection } from '@/data/git-curriculum';

const theme: TechTheme = { tech: 'git', brandColor: '#F05032', brandLabel: 'Git Simulation', defaultLanguage: 'bash' };

export function GitSectionRenderer({ sections }: { sections: GitSection[] }) {
  return <TechSectionRenderer sections={sections} theme={theme} />;
}
