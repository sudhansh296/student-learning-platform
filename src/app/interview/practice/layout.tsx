import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Interview Practice Questions',
  description: 'Practise real interview questions: think first, then reveal the answer. Filter by topic and difficulty to focus on what you need to revise.',
  path: '/interview/practice',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
