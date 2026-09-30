import { CheatsheetPage } from '@/components/seo/CheatsheetPage';
import { restapiCheatsheet as sheet } from '@/data/seo/restapi-cheatsheet';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: sheet.title, description: sheet.description, path: sheet.path, type: 'article' });

export default function RestapiCheatsheetPage() {
  return <CheatsheetPage sheet={sheet} />;
}
