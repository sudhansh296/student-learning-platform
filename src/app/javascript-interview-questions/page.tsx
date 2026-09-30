import { QuestionBankPage } from '@/components/seo/QuestionBankPage';
import { javascriptInterview as bank } from '@/data/seo/javascript-interview-questions';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: bank.title, description: bank.description, path: bank.path, type: 'article' });

export default function JavascriptInterviewQuestionsPage() {
  return <QuestionBankPage bank={bank} />;
}
