import { CheatsheetPage } from '@/components/seo/CheatsheetPage';
import { htmlCheatsheet as sheet } from '@/data/seo/html-cheatsheet';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: sheet.title, description: sheet.description, path: sheet.path, type: 'article' });

export default function HtmlCheatsheetPage() {
  return <CheatsheetPage sheet={sheet} />;
}
