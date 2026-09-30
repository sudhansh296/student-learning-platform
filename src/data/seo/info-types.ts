/** Content model for the plain-text site pages (About, Contact, Privacy Policy, Terms, Disclaimer). */

/** A paragraph may contain links written as [text](url); a list item may too. */
export type InfoBlock = { p: string } | { ul: string[] } | { h3: string };

export interface InfoSection {
  id: string;
  title: string;
  blocks: InfoBlock[];
}

export interface InfoPageData {
  path: string;
  /** <title> without the site name (added by the layout template) */
  title: string;
  description: string;
  badge: string;
  h1: string;
  intro: string;
  /** shown as "Last updated …" (policy pages) */
  updated?: string;
  schemaType: 'AboutPage' | 'ContactPage' | 'WebPage';
  sections: InfoSection[];
}
