import { QuestionBankPage } from '@/components/seo/QuestionBankPage';
import { expressInterview as bank } from '@/data/seo/express-interview-questions';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: bank.title, description: bank.description, path: bank.path, type: 'article' });

export default function ExpressInterviewQuestionsPage() {
  return <QuestionBankPage bank={bank} />;
}
