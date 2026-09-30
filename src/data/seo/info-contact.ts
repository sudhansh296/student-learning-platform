import type { InfoPageData } from './info-types';
import { CONTACT_EMAIL } from '@/lib/seo';

export const contactPage: InfoPageData = {
  path: '/contact',
  title: 'Contact Us',
  description: 'Contact WebDev Atlas to report a mistake in a lesson, suggest a topic, ask about the site or send a privacy request. Email is the best way to reach us.',
  badge: 'Contact',
  h1: 'Contact WebDev Atlas',
  intro: 'Found a mistake, want a topic covered, or have a question about the site? Send us an email. We read every message and reply as soon as we can.',
  schemaType: 'ContactPage',
  sections: [
    {
      id: 'what-to-write',
      title: 'What you can write to us about',
      blocks: [
        { ul: [
          'Corrections: a lesson, cheat sheet or interview answer that is wrong, unclear or out of date.',
          'Broken things: an example that does not run, a link that does not work or a page that does not display properly.',
          'Suggestions: topics, exercises or projects you would like to see added.',
          'Privacy requests: questions about the [Privacy Policy](/privacy-policy) or about information you have sent us.',
          'Business and partnership enquiries.',
        ] },
      ],
    },
    {
      id: 'better-report',
      title: 'How to write a report we can act on',
      blocks: [
        { p: 'A short message with the page address, what you expected and what you saw instead is usually all we need. For a code problem, add the browser you use and paste a short example or the error message.' },
      ],
    },
    {
      id: 'safety',
      title: 'Please do not send sensitive information',
      blocks: [
        { p: 'Please do not send passwords, OTPs, API keys, private keys or confidential source code. We will never ask you for them. If you need to show a problem, send a short, cleaned-up example instead, with any secrets removed.' },
      ],
    },
    {
      id: 'limits',
      title: 'What we cannot do',
      blocks: [
        { p: `WebDev Atlas is a free educational site, so we cannot offer one-to-one tutoring, debug your personal projects or review job applications by email. For general questions about a topic, the lesson pages and the [interview question banks](/javascript-interview-questions) are the best places to start.` },
        { p: `Our address is ${CONTACT_EMAIL}. Emails can take a few days to be answered, and we cannot promise a reply to every message.` },
      ],
    },
  ],
};
