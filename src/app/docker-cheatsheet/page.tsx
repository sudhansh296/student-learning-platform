import { CheatsheetPage } from '@/components/seo/CheatsheetPage';
import { dockerCheatsheet as sheet } from '@/data/seo/docker-cheatsheet';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: sheet.title, description: sheet.description, path: sheet.path, type: 'article' });

export default function DockerCheatsheetPage() {
  return <CheatsheetPage sheet={sheet} />;
}
