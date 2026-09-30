import type { InfoPageData } from './info-types';

export const disclaimerPage: InfoPageData = {
  path: '/disclaimer',
  title: 'Disclaimer',
  description: 'Read the WebDev Atlas disclaimer: content is for learning, may contain errors, and does not guarantee jobs, interview results or production-ready code.',
  badge: 'Legal',
  h1: 'Disclaimer',
  intro: 'WebDev Atlas is a free educational resource. This page explains what you can and cannot expect from it.',
  updated: 'September 25, 2026',
  schemaType: 'WebPage',
  sections: [
    {
      id: 'educational',
      title: 'For learning only',
      blocks: [
        { p: 'Everything on this site is published to help people learn web development. It is not professional advice, and it should not be treated as a replacement for official documentation, formal training or a qualified expert.' },
      ],
    },
    {
      id: 'accuracy',
      title: 'Accuracy of information',
      blocks: [
        { p: 'We do our best to keep lessons, cheat sheets and interview answers correct and up to date, but we cannot guarantee that they are complete or free of errors. Frameworks and browsers change, so always confirm important details in the official documentation. If you find a mistake, please [let us know](/contact).' },
      ],
    },
    {
      id: 'code',
      title: 'Code and the code editor',
      blocks: [
        { p: 'Code examples are simplified on purpose. Test and review any code, especially for security, before using it in a real project. The online code editor is for practice; results may differ from your own machine or a production server.' },
      ],
    },
    {
      id: 'careers',
      title: 'Careers and interviews',
      blocks: [
        { p: 'The interview questions, roadmaps and practice exercises are study aids. Companies ask different questions and hire for many reasons, so we make no promise that using this site will result in a job offer or a particular salary.' },
      ],
    },
    {
      id: 'trademarks',
      title: 'Trademarks and affiliation',
      blocks: [
        { p: 'WebDev Atlas is an independent project. React, Next.js, Node.js, MongoDB, TypeScript and other technologies mentioned here are trademarks or names of their respective owners, and this site is not affiliated with or endorsed by them.' },
      ],
    },
    {
      id: 'external',
      title: 'External links and advertising',
      blocks: [
        { p: 'We link to other websites and may show third-party advertising. We do not control or endorse them and are not responsible for what they contain or how they handle your data. See the [Privacy Policy](/privacy-policy) for more.' },
        { p: 'By using the site you also agree to the [Terms of Use](/terms).' },
      ],
    },
  ],
};
