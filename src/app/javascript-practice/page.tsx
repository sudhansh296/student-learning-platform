import { QuestionBankPage } from '@/components/seo/QuestionBankPage';
import { javascriptPractice as bank } from '@/data/seo/javascript-practice';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: bank.title, description: bank.description, path: bank.path, type: 'article' });

export default function JavascriptPracticePage() {
  return <QuestionBankPage bank={bank} />;
}
