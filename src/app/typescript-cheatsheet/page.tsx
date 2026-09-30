import { CheatsheetPage } from '@/components/seo/CheatsheetPage';
import { typescriptCheatsheet as sheet } from '@/data/seo/typescript-cheatsheet';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: sheet.title, description: sheet.description, path: sheet.path, type: 'article' });

export default function TypescriptCheatsheetPage() {
  return <CheatsheetPage sheet={sheet} />;
}
