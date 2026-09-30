import { CheatsheetPage } from '@/components/seo/CheatsheetPage';
import { sqlCheatsheet as sheet } from '@/data/seo/sql-cheatsheet';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: sheet.title, description: sheet.description, path: sheet.path, type: 'article' });

export default function SqlCheatsheetPage() {
  return <CheatsheetPage sheet={sheet} />;
}
