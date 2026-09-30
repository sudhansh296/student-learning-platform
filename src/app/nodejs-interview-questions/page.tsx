import { QuestionBankPage } from '@/components/seo/QuestionBankPage';
import { nodejsInterview as bank } from '@/data/seo/nodejs-interview-questions';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: bank.title, description: bank.description, path: bank.path, type: 'article' });

export default function NodejsInterviewQuestionsPage() {
  return <QuestionBankPage bank={bank} />;
}
