import { QuestionBankPage } from '@/components/seo/QuestionBankPage';
import { nextjsInterview as bank } from '@/data/seo/nextjs-interview-questions';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: bank.title, description: bank.description, path: bank.path, type: 'article' });

export default function NextjsInterviewPage() {
  return <QuestionBankPage bank={bank} />;
}
