import { CheatsheetPage } from '@/components/seo/CheatsheetPage';
import { reactHooksCheatsheet as sheet } from '@/data/seo/react-hooks-cheatsheet';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: sheet.title, description: sheet.description, path: sheet.path, type: 'article' });

export default function ReactHooksCheatsheetPage() {
  return <CheatsheetPage sheet={sheet} />;
}
