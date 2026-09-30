import { CheatsheetPage } from '@/components/seo/CheatsheetPage';
import { cssCheatsheet as sheet } from '@/data/seo/css-cheatsheet';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: sheet.title, description: sheet.description, path: sheet.path, type: 'article' });

export default function CssCheatsheetPage() {
  return <CheatsheetPage sheet={sheet} />;
}
