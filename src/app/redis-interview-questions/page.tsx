import { QuestionBankPage } from '@/components/seo/QuestionBankPage';
import { redisInterview as bank } from '@/data/seo/redis-interview-questions';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: bank.title, description: bank.description, path: bank.path, type: 'article' });

export default function RedisInterviewQuestionsPage() {
  return <QuestionBankPage bank={bank} />;
}
