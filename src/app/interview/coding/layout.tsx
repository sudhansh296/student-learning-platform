import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Coding Interview Practice Problems',
  description: 'Practise real coding interview problems: read the task, use hints when you are stuck, then check a worked solution and the reasoning behind it.',
  path: '/interview/coding',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
