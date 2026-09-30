import type { InfoPageData } from './info-types';
import { CONTACT_EMAIL } from '@/lib/seo';

export const privacyPage: InfoPageData = {
  path: '/privacy-policy',
  title: 'Privacy Policy',
  description: 'How WebDev Atlas handles information: what we collect, cookies and local storage, the code editor, advertising such as Google AdSense, and your choices.',
  badge: 'Legal',
  h1: 'Privacy Policy',
  intro: 'This policy explains what information WebDev Atlas collects when you use the site, how it is used, and the choices you have. We have tried to keep it short and specific.',
  updated: 'September 25, 2026',
  schemaType: 'WebPage',
  sections: [
    {
      id: 'summary',
      title: 'The short version',
      blocks: [
        { ul: [
          'You do not need an account to use WebDev Atlas, and we do not ask you to fill in forms with personal details.',
          'The site stores a few small preferences in your browser, such as light or dark theme. These stay on your device.',
          'When you run code in a server-side language in the code editor, your code is sent to a third-party service to be executed. Do not paste secrets or personal data into it.',
          'The site may show advertising from Google AdSense or similar partners. Those partners use cookies, described below.',
        ] },
      ],
    },
    {
      id: 'information',
      title: 'Information we collect',
      blocks: [
        { h3: 'Information you send us' },
        { p: `If you email us (${CONTACT_EMAIL}), we receive your email address and whatever you write. We use it only to reply and to improve the site, and we do not add you to a mailing list.` },
        { h3: 'Technical information' },
        { p: 'Like most websites, our hosting infrastructure automatically receives standard request information such as your IP address, browser type, device type, the pages you request and the time of the request. This is used to deliver the site, keep it secure, prevent abuse and diagnose problems.' },
        { h3: 'Information we do not collect' },
        { p: 'We do not ask for your name, address, phone number or payment details, and the site has no user accounts or comment forms at the moment.' },
      ],
    },
    {
      id: 'cookies',
      title: 'Cookies and local storage',
      blocks: [
        { p: 'Cookies are small files that a website stores in your browser. Local storage is a similar browser feature. WebDev Atlas uses local storage for simple conveniences, such as remembering your theme, and the interactive examples and projects may save their own small state, such as a to-do list, in your browser. This information does not leave your device unless you choose to share it.' },
        { p: 'You can clear or block cookies and local storage in your browser settings. Doing so may reset preferences such as the theme.' },
        { p: 'Third parties that provide advertising or analytics, described below, may set their own cookies. We do not control those cookies.' },
      ],
    },
    {
      id: 'analytics',
      title: 'Analytics',
      blocks: [
        { p: 'At the time of writing, we do not run third-party analytics scripts on the site. If we add an analytics service to understand which pages are useful, we will describe it here, and where the law requires it we will ask for consent first.' },
      ],
    },
    {
      id: 'advertising',
      title: 'Advertising and Google AdSense',
      blocks: [
        { p: 'WebDev Atlas is free to use. To help cover its costs, the site may show advertisements provided by Google AdSense or similar advertising partners. If ads are shown, the following applies:' },
        { ul: [
          'Third-party vendors, including Google, use cookies to serve ads based on your previous visits to this site and other sites on the internet.',
          'Google’s use of advertising cookies enables it and its partners to serve ads to you based on your visit to this site and/or other sites.',
          'You can opt out of personalised advertising by visiting [Google Ads Settings](https://adssettings.google.com), or opt out of some third-party vendors’ use of cookies for personalised advertising at [www.aboutads.info](https://www.aboutads.info).',
          'You can read more about how Google uses information from sites that use its services at [How Google uses information from sites or apps that use our services](https://policies.google.com/technologies/partner-sites).',
          'In regions where consent is required by law, such as the European Economic Area and the United Kingdom, we will show a consent message before personalised ads are used.',
        ] },
        { p: 'Advertisers and ad networks are responsible for their own data practices. Ads are kept separate from lesson content, and they are not an endorsement of the products or services advertised.' },
      ],
    },
    {
      id: 'code-editor',
      title: 'The code editor and running code',
      blocks: [
        { p: 'HTML, CSS and JavaScript examples, and our built-in simulators, run inside your browser and are not sent to our servers.' },
        { p: 'For languages that cannot run in a browser, such as Python, Java, C, C++, Go or Rust, the code you type and any input you provide are sent through our server to a third-party code execution service (Wandbox) so it can be compiled and run. The output is returned to you. We do not intentionally store submitted code. To limit abuse, our server temporarily keeps request counts linked to your IP address in memory.' },
        { p: 'Because your code leaves your device in this case, please do not paste passwords, keys, personal data or confidential source code into the editor.' },
      ],
    },
    {
      id: 'third-party',
      title: 'Third-party services and links',
      blocks: [
        { p: 'To work, some features load code libraries from public content delivery networks (such as jsDelivr, unpkg and cdnjs). These providers receive your IP address and browser details when your browser downloads the files. Fonts are served with the site itself.' },
        { p: 'Lessons and guides link to other websites, such as official documentation. We are not responsible for the content or privacy practices of those sites, and we encourage you to read their policies.' },
      ],
    },
    {
      id: 'use',
      title: 'How we use information',
      blocks: [
        { ul: [
          'To provide, secure and maintain the website and its code editor.',
          'To respond to messages and fix problems that are reported.',
          'To understand and improve how the site is used, if analytics are enabled.',
          'To show advertising that helps keep the site free, if ads are enabled.',
          'To meet legal obligations and to protect the site and its users from abuse.',
        ] },
        { p: 'We do not sell your personal information.' },
      ],
    },
    {
      id: 'retention',
      title: 'Retention and security',
      blocks: [
        { p: 'Emails you send us are kept only as long as needed to answer them and keep a record of the conversation. Server logs kept by our hosting provider are retained for a limited period according to that provider’s settings. We use HTTPS and reasonable safeguards, but no method of transmission or storage on the internet is completely secure.' },
      ],
    },
    {
      id: 'rights',
      title: 'Your choices and rights',
      blocks: [
        { p: `Depending on where you live, you may have the right to ask what information we hold about you, to have it corrected or deleted, or to object to certain uses. Since we hold very little personal information, this mostly concerns emails you have sent us. To make a request, write to ${CONTACT_EMAIL}.` },
      ],
    },
    {
      id: 'children',
      title: 'Children',
      blocks: [
        { p: 'WebDev Atlas is an educational site, but it is not directed at children under 13 and we do not knowingly collect personal information from them. If you believe a child has sent us personal information, contact us and we will delete it.' },
      ],
    },
    {
      id: 'changes',
      title: 'Changes to this policy',
      blocks: [
        { p: 'We may update this policy when the site or the law changes, for example when we add analytics or start showing ads. The date at the top shows when it was last updated. Continuing to use the site after a change means you accept the updated policy.' },
        { p: 'Questions? See the [contact page](/contact). The conditions for using the site are in the [Terms of Use](/terms).' },
      ],
    },
  ],
};
