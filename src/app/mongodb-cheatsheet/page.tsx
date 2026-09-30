import { CheatsheetPage } from '@/components/seo/CheatsheetPage';
import { mongodbCheatsheet as sheet } from '@/data/seo/mongodb-cheatsheet';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: sheet.title, description: sheet.description, path: sheet.path, type: 'article' });

export default function MongodbCheatsheetPage() {
  return <CheatsheetPage sheet={sheet} />;
}
