import type { InfoPageData, InfoSection } from './info-types';
import { OWNER } from './owner';

// shown only once src/data/seo/owner.ts has a name
const ownerSection: InfoSection[] = OWNER.name.trim()
  ? [{
      id: 'who',
      title: 'Who runs WebDev Atlas',
      blocks: [
        { h3: OWNER.role.trim() ? `${OWNER.name.trim()} – ${OWNER.role.trim()}` : OWNER.name.trim() },
        ...OWNER.bio.filter((p) => p.trim()).map((p) => ({ p })),
        ...(OWNER.links.length ? [{ ul: OWNER.links.map((l) => `[${l.label}](${l.href})`) }] : []),
      ],
    }]
  : [];

export const aboutPage: InfoPageData = {
  path: '/about',
  title: 'About Us',
  description: 'WebDev Atlas is a free learning site for web development: step-by-step lessons, a code editor, roadmaps, cheat sheets and interview prep.',
  badge: 'About',
  h1: 'About WebDev Atlas',
  intro: 'WebDev Atlas is a free place to learn web development from the first line of HTML to a deployed full-stack app. Everything is written to be read in a browser, tried in an editor and understood without any paid course.',
  schemaType: 'AboutPage',
  sections: [
    {
      id: 'why',
      title: 'Why this site exists',
      blocks: [
        { p: 'Most beginners do not struggle because the topics are hard. They struggle because the pieces are scattered: one tutorial for HTML, another for React, a video for Node.js and nothing that shows how they fit together. WebDev Atlas puts the whole stack in one place, in the order you would actually learn it, so you always know what to study next and why.' },
        { p: 'The goal is simple: explain each idea in plain language, show a small example, and let you change the code and see what happens.' },
      ],
    },
    ...ownerSection,
    {
      id: 'what-you-find',
      title: 'What you will find here',
      blocks: [
        { ul: [
          '[Step-by-step lessons](/learn) for HTML, CSS, JavaScript, TypeScript, React, Next.js, Node.js, Express, MongoDB, SQL databases, Git, Docker and REST APIs.',
          'A built-in [code editor](/playground) so you can run examples and your own code without installing anything.',
          '[Roadmaps](/roadmaps), including a detailed [frontend developer roadmap](/frontend-roadmap) and [MERN stack roadmap](/mern-roadmap).',
          '[Cheat sheets](/javascript-cheatsheet) and [interview question banks](/javascript-interview-questions) with short answers you can say out loud and longer explanations when you need them.',
          '[Practice exercises](/javascript-practice), [project walkthroughs](/projects) and a set of [developer tools](/tools) such as a JSON formatter and a regex tester.',
        ] },
      ],
    },
    {
      id: 'how-we-write',
      title: 'How the content is written',
      blocks: [
        { p: 'Lessons are written for beginners first. Each one starts with the idea, shows a small working example, points out the mistakes people commonly make, and links to the next topic. We avoid padding, and we try not to use a term before it has been explained.' },
        { p: 'Code examples are meant to be run. We check them in the built-in editor so that what you read matches what actually happens. Technology moves quickly, so some details will age; when we find something out of date, we fix it.' },
        { p: 'The site is an independent educational project. It is not affiliated with the companies or open-source projects behind the technologies it teaches, and their names belong to their owners.' },
      ],
    },
    {
      id: 'who-for',
      title: 'Who it is for',
      blocks: [
        { ul: [
          'Complete beginners who want a clear starting point and an honest order to learn things in.',
          'Students and career changers preparing for a first developer job, including interview practice.',
          'Working developers who want a quick refresher, a cheat sheet or a second explanation of a tricky concept.',
        ] },
      ],
    },
    {
      id: 'corrections',
      title: 'Corrections and feedback',
      blocks: [
        { p: 'If you spot a mistake, an example that does not run, or a topic you would like covered, please tell us on the [contact page](/contact). Specific reports (the page, what you expected and what happened) are the easiest to act on.' },
        { p: 'Read how we handle your information in the [Privacy Policy](/privacy-policy) and the conditions for using the site in the [Terms of Use](/terms).' },
      ],
    },
  ],
};
