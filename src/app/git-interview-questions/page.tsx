import { QuestionBankPage } from '@/components/seo/QuestionBankPage';
import { gitInterview as bank } from '@/data/seo/git-interview-questions';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: bank.title, description: bank.description, path: bank.path, type: 'article' });

export default function GitInterviewQuestionsPage() {
  return <QuestionBankPage bank={bank} />;
}
