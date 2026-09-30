/**
 * Short, human-written notes for the SEO hub pages (cheat sheets, question banks, roadmaps).
 *  - placement 'top'    : a compact "how to use this page" box under the page header
 *  - style 'section'    : a normal section near the end of the page (mistakes, real projects, study tip)
 *  - style 'callout'    : a small closing box (the reviewed note)
 * Text may contain links written as [label](/path).
 */
export interface PageNote {
  id: string;
  title: string;
  text?: string;
  items?: string[];
  placement?: 'top' | 'bottom';
  style?: 'section' | 'callout';
}
