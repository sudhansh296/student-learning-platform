import { QuestionBankPage } from '@/components/seo/QuestionBankPage';
import { postgresqlInterview as bank } from '@/data/seo/postgresql-interview-questions';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: bank.title, description: bank.description, path: bank.path, type: 'article' });

export default function PostgresqlInterviewQuestionsPage() {
  return <QuestionBankPage bank={bank} />;
}
