import { CheatsheetPage } from '@/components/seo/CheatsheetPage';
import { gitCheatsheet as sheet } from '@/data/seo/git-cheatsheet';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: sheet.title, description: sheet.description, path: sheet.path, type: 'article' });

export default function GitCheatsheetPage() {
  return <CheatsheetPage sheet={sheet} />;
}
