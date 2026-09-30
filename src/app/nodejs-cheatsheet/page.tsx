import { CheatsheetPage } from '@/components/seo/CheatsheetPage';
import { nodejsCheatsheet as sheet } from '@/data/seo/nodejs-cheatsheet';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: sheet.title, description: sheet.description, path: sheet.path, type: 'article' });

export default function NodejsCheatsheetPage() {
  return <CheatsheetPage sheet={sheet} />;
}
