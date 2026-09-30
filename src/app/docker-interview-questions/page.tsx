import { QuestionBankPage } from '@/components/seo/QuestionBankPage';
import { dockerInterview as bank } from '@/data/seo/docker-interview-questions';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: bank.title, description: bank.description, path: bank.path, type: 'article' });

export default function DockerInterviewQuestionsPage() {
  return <QuestionBankPage bank={bank} />;
}
