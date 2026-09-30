import { QuestionBankPage } from '@/components/seo/QuestionBankPage';
import { cssInterview as bank } from '@/data/seo/css-interview-questions';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: bank.title, description: bank.description, path: bank.path, type: 'article' });

export default function CssInterviewQuestionsPage() {
  return <QuestionBankPage bank={bank} />;
}
