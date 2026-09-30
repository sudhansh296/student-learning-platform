import { CheatsheetPage } from '@/components/seo/CheatsheetPage';
import { javascriptCheatsheet as sheet } from '@/data/seo/javascript-cheatsheet';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: sheet.title, description: sheet.description, path: sheet.path, type: 'article' });

export default function JavascriptCheatsheetPage() {
  return <CheatsheetPage sheet={sheet} />;
}
