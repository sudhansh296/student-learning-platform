import type { Faq } from '@/components/seo/SeoPageParts';
import type { PageNote } from './page-notes';

export interface RoadmapStep {
  id: string;
  title: string;
  /** e.g. "2–3 weeks" */
  duration: string;
  summary: string;
  topics: string[];
  /** "course/slug" keys of lessons for this step */
  lessons?: string[];
  /** Projects, practice pages and tools for this step */
  practice?: { label: string; href: string }[];
  /** What you should be able to do before moving on */
  milestone?: string;
}

export interface Roadmap {
  path: string;
  badge: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  /** Short facts shown as chips under the intro (total time, level …) */
  facts: { label: string; value: string }[];
  steps: RoadmapStep[];
  /** Short human-written notes: how to use the page, common mistakes, real-project use, study tip, reviewed note */
  notes?: PageNote[];
  tips: string[];
  faq: Faq[];
  more: { label: string; href: string }[];
}
