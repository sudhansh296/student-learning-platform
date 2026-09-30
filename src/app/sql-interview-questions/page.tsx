import { QuestionBankPage } from '@/components/seo/QuestionBankPage';
import { sqlInterview as bank } from '@/data/seo/sql-interview-questions';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: bank.title, description: bank.description, path: bank.path, type: 'article' });

export default function SqlInterviewQuestionsPage() {
  return <QuestionBankPage bank={bank} />;
}
