import { CheatsheetPage } from '@/components/seo/CheatsheetPage';
import { sqliteCheatsheet as sheet } from '@/data/seo/sqlite-cheatsheet';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: sheet.title, description: sheet.description, path: sheet.path, type: 'article' });

export default function SqliteCheatsheetPage() {
  return <CheatsheetPage sheet={sheet} />;
}
