import { QuestionBankPage } from '@/components/seo/QuestionBankPage';
import { htmlInterview as bank } from '@/data/seo/html-interview-questions';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: bank.title, description: bank.description, path: bank.path, type: 'article' });

export default function HtmlInterviewQuestionsPage() {
  return <QuestionBankPage bank={bank} />;
}
