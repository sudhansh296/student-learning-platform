import { CheatsheetPage } from '@/components/seo/CheatsheetPage';
import { nextjsCheatsheet as sheet } from '@/data/seo/nextjs-cheatsheet';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: sheet.title, description: sheet.description, path: sheet.path, type: 'article' });

export default function NextjsCheatsheetPage() {
  return <CheatsheetPage sheet={sheet} />;
}
