import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Mock Interview Simulator',
  description: 'Run a timed mock interview by role and difficulty: answer each question out loud, compare with an ideal answer and rate yourself at the end.',
  path: '/interview/mock',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
