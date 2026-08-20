import { jsTopics } from './javascript-topics';
import { jsVariableTopics } from './js-variables';
import { jsFunctionTopics } from './js-functions';
import { jsArrayObjectTopics } from './js-arrays-objects';
import { jsAsyncTopics } from './js-async';
import type { MernTopic } from './javascript-topics';

export type { MernTopic };

// All JavaScript topics in order
export const allJsTopics: MernTopic[] = [
  ...jsTopics,
  ...jsVariableTopics,
  ...jsFunctionTopics,
  ...jsArrayObjectTopics,
  ...jsAsyncTopics,
];

// Subject registry
export const subjectTopics: Record<string, MernTopic[]> = {
  javascript: allJsTopics,
};

export function getTopicBySlug(subject: string, slug: string): MernTopic | undefined {
  const topics = subjectTopics[subject] || [];
  return topics.find(t => t.slug === slug);
}

export function getAdjacentTopics(subject: string, slug: string) {
  const topics = subjectTopics[subject] || [];
  const idx = topics.findIndex(t => t.slug === slug);
  return {
    prev: idx > 0 ? topics[idx - 1] : null,
    next: idx < topics.length - 1 ? topics[idx + 1] : null,
  };
}

// Sidebar navigation structure
export const jsSidebarSections = [
  {
    title: 'Getting Started',
    topics: ['introduction', 'where-to'],
  },
  {
    title: 'Core Language',
    topics: ['variables', 'data-types'],
  },
  {
    title: 'Functions',
    topics: ['functions'],
  },
  {
    title: 'Data Structures',
    topics: ['arrays', 'objects'],
  },
  {
    title: 'Asynchronous JS',
    topics: ['promises', 'async-await'],
  },
];
