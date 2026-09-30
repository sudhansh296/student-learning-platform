import type { Faq } from '@/components/seo/SeoPageParts';
import type { PageNote } from './page-notes';

export interface CheatExample { title: string; code: string; language: string }

export interface CheatSection {
  id: string;
  title: string;
  intro?: string;
  table?: { headers: string[]; rows: string[][]; codeCols?: number[] };
  examples?: CheatExample[];
  tips?: string[];
  /** "course/slug" keys of lessons that go deeper */
  lessons?: string[];
}

export interface Cheatsheet {
  path: string;
  /** Lesson technology id used for the "Run in Editor" button on the examples (js, css, html, react …). */
  tech: string;
  badge: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: CheatSection[];
  /** Short human-written notes: how to use the page, real-project use, study tip, reviewed note */
  notes?: PageNote[];
  faq: Faq[];
  /** Other pages worth visiting after this one */
  more: { label: string; href: string }[];
}

/** Join code lines (keeps the data files free of long escaped strings). */
export const code = (...lines: string[]) => lines.join('\n');
