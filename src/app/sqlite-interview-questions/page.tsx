import { QuestionBankPage } from '@/components/seo/QuestionBankPage';
import { sqliteInterview as bank } from '@/data/seo/sqlite-interview-questions';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: bank.title, description: bank.description, path: bank.path, type: 'article' });

export default function SqliteInterviewQuestionsPage() {
  return <QuestionBankPage bank={bank} />;
}
