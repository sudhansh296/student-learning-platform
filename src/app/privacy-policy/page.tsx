import { InfoPage } from '@/components/seo/InfoPage';
import { privacyPage as page } from '@/data/seo/info-privacy';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: page.title, description: page.description, path: page.path });

export default function PrivacyPolicyPage() {
  return <InfoPage page={page} />;
}
