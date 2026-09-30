import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Rapid Revision Flashcards',
  description: 'Revise interview questions with flashcards: see the question, recall the answer, then mark it Know it, Revise later or Skip for a quick daily review.',
  path: '/interview/rapid-revision',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
