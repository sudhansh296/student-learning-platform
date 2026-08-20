export interface CssLesson {
  id: string;
  title: string;
  slug: string;
  chapter: string;
  order: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readingTime: number;
  description: string;
  sections: CssSection[];
  exercises?: CssExercise[];
  quiz?: CssQuiz[];
}

export interface CssSection {
  type: 'text' | 'heading' | 'code' | 'tryit' | 'note' | 'warning' | 'tip' | 'analogy' | 'list' | 'table';
  title?: string;
  content?: string;
  code?: string;
  language?: string;
  html?: string;
  css?: string;
  js?: string;
  mode?: 'html' | 'css' | 'full';
  items?: string[];
  headers?: string[];
  rows?: string[][];
}

export interface CssExercise {
  id: string;
  question: string;
  type: 'multiple-choice' | 'fill-blank' | 'code-output';
  options?: string[];
  correct: string | number;
  explanation: string;
}

export interface CssQuiz {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const cssChapters = [
  { id: 'basics',     title: 'Getting Started',   icon: '🚀' },
  { id: 'selectors',  title: 'Selectors',          icon: '🎯' },
  { id: 'box',        title: 'Box Model',          icon: '📦' },
  { id: 'text',       title: 'Text & Fonts',       icon: '✏️' },
  { id: 'colors',     title: 'Colors & Backgrounds',icon: '🎨' },
  { id: 'layout',     title: 'Layout',             icon: '🏗️' },
  { id: 'flexbox',    title: 'Flexbox',            icon: '⟺' },
  { id: 'grid',       title: 'CSS Grid',           icon: '⊞' },
  { id: 'responsive', title: 'Responsive Design',  icon: '📱' },
  { id: 'advanced',   title: 'Advanced CSS',       icon: '⚡' },
];
