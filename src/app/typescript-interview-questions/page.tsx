import { QuestionBankPage } from '@/components/seo/QuestionBankPage';
import { typescriptInterview as bank } from '@/data/seo/typescript-interview-questions';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: bank.title, description: bank.description, path: bank.path, type: 'article' });

export default function TypescriptInterviewPage() {
  return <QuestionBankPage bank={bank} />;
}
