import { CheatsheetPage } from '@/components/seo/CheatsheetPage';
import { postgresqlCheatsheet as sheet } from '@/data/seo/postgresql-cheatsheet';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: sheet.title, description: sheet.description, path: sheet.path, type: 'article' });

export default function PostgresqlCheatsheetPage() {
  return <CheatsheetPage sheet={sheet} />;
}
