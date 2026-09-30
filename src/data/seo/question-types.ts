import type { PageNote } from './page-notes';

export type Level = 'beginner' | 'intermediate' | 'advanced';

export interface BankItem {
  /** The interview question, or the exercise prompt on a practice page */
  q: string;
  level?: Level;
  /** Interview: the short answer to say first. Practice: the explanation shown with the solution. */
  short?: string;
  /** Interview: the fuller answer */
  long?: string;
  /** Practice only: a nudge before the solution */
  hint?: string;
  /** Example / solution code */
  code?: string;
  /** Practice only: what the solution prints (checked automatically against the real output) */
  output?: string;
  /** "course/slug" keys of lessons that cover this */
  lessons?: string[];
}

export interface BankGroup {
  id: string;
  title: string;
  intro?: string;
  items: BankItem[];
}

export interface QuestionBank {
  path: string;
  mode: 'interview' | 'practice';
  /** Lesson technology id used for the "Run in Editor" button on code (js, react, nodejs …) */
  tech: string;
  /** Language label of the code samples (javascript, jsx …) */
  codeLang?: string;
  badge: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  groups: BankGroup[];
  /** Short human-written notes: how to use the page, common mistakes, real-project use, study tip, reviewed note */
  notes?: PageNote[];
  tips: string[];
  more: { label: string; href: string }[];
}
