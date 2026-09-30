import type { InfoPageData } from './info-types';
import { CONTACT_EMAIL } from '@/lib/seo';

export const termsPage: InfoPageData = {
  path: '/terms',
  title: 'Terms of Use',
  description: 'The terms for using WebDev Atlas: educational use, content accuracy, code examples, the code editor, external links and limits of liability.',
  badge: 'Legal',
  h1: 'Terms of Use',
  intro: 'These terms describe the rules for using WebDev Atlas. By using the site you agree to them, so please read them. If you do not agree, please do not use the site.',
  updated: 'September 25, 2026',
  schemaType: 'WebPage',
  sections: [
    {
      id: 'educational-use',
      title: 'Educational use',
      blocks: [
        { p: 'WebDev Atlas provides free learning material about web development: lessons, cheat sheets, interview questions, practice exercises, projects and tools. It is provided for general educational purposes. It is not professional, legal, financial or career advice, and using it does not create any kind of client relationship.' },
        { p: 'Learning results depend on you. We do not promise that using the site will get you a job, pass an interview or reach any particular level of skill.' },
      ],
    },
    {
      id: 'accuracy',
      title: 'Content accuracy',
      blocks: [
        { p: 'We work to keep the content correct and current, but technology changes quickly and mistakes happen. Content may be incomplete or out of date, and versions of tools, libraries and browsers may behave differently from what a lesson describes. Please check the official documentation before relying on anything in a production system, and [tell us](/contact) if you find an error.' },
      ],
    },
    {
      id: 'code-examples',
      title: 'Code examples',
      blocks: [
        { p: 'Code examples are provided as-is, for learning. You are free to copy them and use them in your own projects, personal or commercial, without attribution. Examples are kept short to explain an idea, so they may leave out error handling, security hardening or performance work that real applications need. You are responsible for reviewing, testing and securing any code before you use it.' },
      ],
    },
    {
      id: 'editor',
      title: 'Code editor and acceptable use',
      blocks: [
        { p: 'The built-in code editor is a learning tool with limits on execution time and request rate. When you use it, you agree not to:' },
        { ul: [
          'run code intended to harm, attack, scan or overload the site, our providers or any other system;',
          'try to bypass rate limits, sandboxing or other technical safeguards;',
          'submit unlawful content, malware, or personal data belonging to other people;',
          'scrape or copy the site automatically at a rate that affects other users.',
        ] },
        { p: 'Code in some languages is executed by a third-party service, as described in the [Privacy Policy](/privacy-policy). We may limit or block access to the editor or the site at any time if it is being misused.' },
      ],
    },
    {
      id: 'ownership',
      title: 'Ownership and copying content',
      blocks: [
        { p: 'Except for code examples, which you may reuse as described above, the text, structure and design of WebDev Atlas belong to the site and are protected by copyright. You may link to any page and quote short excerpts with a link back to the source. Please do not republish lessons, question banks or cheat sheets in full without written permission.' },
        { p: 'Names of technologies, products and companies mentioned on the site belong to their respective owners. WebDev Atlas is not affiliated with or endorsed by them.' },
      ],
    },
    {
      id: 'external-links',
      title: 'External links and advertising',
      blocks: [
        { p: 'The site links to third-party websites such as official documentation, and it may show advertising from third parties. We do not control those sites or advertisers and are not responsible for their content, accuracy, products or privacy practices. A link or an advert is not an endorsement, and you use third-party sites at your own risk.' },
      ],
    },
    {
      id: 'availability',
      title: 'Availability and changes',
      blocks: [
        { p: 'We may change, suspend or remove any part of the site at any time, and the site may occasionally be unavailable because of maintenance or problems outside our control. The site is provided free of charge, so we do not guarantee any level of availability.' },
      ],
    },
    {
      id: 'warranty',
      title: 'No warranties',
      blocks: [
        { p: 'The site and its content are provided “as is” and “as available”, without warranties of any kind, whether express or implied, including any warranty of accuracy, completeness, fitness for a particular purpose or non-infringement.' },
      ],
    },
    {
      id: 'liability',
      title: 'Limitation of liability',
      blocks: [
        { p: 'To the fullest extent permitted by law, WebDev Atlas and the people who run it are not liable for any direct, indirect, incidental or consequential loss or damage arising from your use of the site or from relying on its content or code examples, including lost data, lost profits or problems in software you build. Nothing in these terms excludes liability that cannot be excluded by law.' },
      ],
    },
    {
      id: 'changes',
      title: 'Changes to these terms',
      blocks: [
        { p: 'We may update these terms from time to time. The date at the top shows the latest version, and continuing to use the site after a change means you accept it.' },
        { p: `Questions about these terms can be sent to ${CONTACT_EMAIL} or through the [contact page](/contact). See also the [Privacy Policy](/privacy-policy) and the [Disclaimer](/disclaimer).` },
      ],
    },
  ],
};
