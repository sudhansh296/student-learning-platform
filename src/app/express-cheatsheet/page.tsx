import { CheatsheetPage } from '@/components/seo/CheatsheetPage';
import { expressCheatsheet as sheet } from '@/data/seo/express-cheatsheet';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: sheet.title, description: sheet.description, path: sheet.path, type: 'article' });

export default function ExpressCheatsheetPage() {
  return <CheatsheetPage sheet={sheet} />;
}
