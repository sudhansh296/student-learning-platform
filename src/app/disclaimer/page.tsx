import { InfoPage } from '@/components/seo/InfoPage';
import { disclaimerPage as page } from '@/data/seo/info-disclaimer';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: page.title, description: page.description, path: page.path });

export default function DisclaimerPage() {
  return <InfoPage page={page} />;
}
