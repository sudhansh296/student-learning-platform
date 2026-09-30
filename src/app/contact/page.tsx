import { Mail } from 'lucide-react';
import { InfoPage } from '@/components/seo/InfoPage';
import { contactPage as page } from '@/data/seo/info-contact';
import { CONTACT_EMAIL, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: page.title, description: page.description, path: page.path });

export default function ContactPage() {
  return (
    <InfoPage
      page={page}
      lead={
        <div className="flex items-center gap-4 rounded-2xl p-5 mb-10" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
          <span className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--bg-section)', border: '1px solid var(--line)' }}>
            <Mail className="w-5 h-5" style={{ color: '#2563eb' }} />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-extrabold uppercase tracking-widest" style={{ color: 'var(--text-3)' }}>Email</p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-[16px] font-bold break-all hover:text-blue-600" style={{ color: 'var(--text)' }}>{CONTACT_EMAIL}</a>
            <p className="text-[12.5px] leading-snug mt-1.5" style={{ color: 'var(--text-3)' }}>Please do not send passwords, OTPs, API keys, private keys or confidential source code.</p>
          </div>
        </div>
      }
    />
  );
}
