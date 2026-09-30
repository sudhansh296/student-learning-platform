// Who is behind WebDev Atlas. Shown as the "Who runs WebDev Atlas" section on the About page.
// Replace these with a real name, role and links whenever you want (for example a personal GitHub or LinkedIn profile);
// readers and reviewers trust a site more when a real person or team is named. Only write things that are true.
// Leave `name` empty to hide the section.

export const OWNER: {
  name: string;
  /** e.g. "Web developer and founder" */
  role: string;
  /** short paragraphs: background, why you built the site, how the lessons are reviewed */
  bio: string[];
  /** e.g. { label: 'GitHub', href: 'https://github.com/your-name' } */
  links: { label: string; href: string }[];
} = {
  name: 'WebDev Atlas Team',
  role: 'Creators of WebDev Atlas',
  bio: [
    'WebDev Atlas is built by a small team focused on helping beginners learn web development with clear lessons, runnable examples and practical projects.',
    'We review lessons by running examples in the built-in editor and improving explanations where beginners commonly get stuck.',
    'The goal is to make web development easier to learn without hiding important details.',
  ],
  links: [],
};
