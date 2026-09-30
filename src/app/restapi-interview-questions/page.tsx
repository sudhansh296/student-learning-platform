import { QuestionBankPage } from '@/components/seo/QuestionBankPage';
import { restapiInterview as bank } from '@/data/seo/restapi-interview-questions';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: bank.title, description: bank.description, path: bank.path, type: 'article' });

export default function RestapiInterviewQuestionsPage() {
  return <QuestionBankPage bank={bank} />;
}
