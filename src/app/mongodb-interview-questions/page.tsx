import { QuestionBankPage } from '@/components/seo/QuestionBankPage';
import { mongodbInterview as bank } from '@/data/seo/mongodb-interview-questions';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: bank.title, description: bank.description, path: bank.path, type: 'article' });

export default function MongodbInterviewQuestionsPage() {
  return <QuestionBankPage bank={bank} />;
}
