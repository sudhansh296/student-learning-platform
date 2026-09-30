import { QuestionBankPage } from '@/components/seo/QuestionBankPage';
import { reactInterview as bank } from '@/data/seo/react-interview-questions';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: bank.title, description: bank.description, path: bank.path, type: 'article' });

export default function ReactInterviewQuestionsPage() {
  return <QuestionBankPage bank={bank} />;
}
