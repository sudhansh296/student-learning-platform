import { CheatsheetPage } from '@/components/seo/CheatsheetPage';
import { redisCheatsheet as sheet } from '@/data/seo/redis-cheatsheet';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: sheet.title, description: sheet.description, path: sheet.path, type: 'article' });

export default function RedisCheatsheetPage() {
  return <CheatsheetPage sheet={sheet} />;
}
