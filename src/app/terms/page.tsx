import { InfoPage } from '@/components/seo/InfoPage';
import { termsPage as page } from '@/data/seo/info-terms';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: page.title, description: page.description, path: page.path });

export default function TermsPage() {
  return <InfoPage page={page} />;
}
