export interface NextjsLesson {
  id: string;
  title: string;
  slug: string;
  chapter: string;
  order: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readingTime: number;
  description: string;
  sections: NextjsSection[];
  exercises: NextjsExercise[];
  quiz: NextjsQuiz[];
}

export interface NextjsSection {
  type: 'text' | 'heading' | 'example' | 'tryit' | 'note' | 'warning' | 'tip' | 'analogy' | 'list' | 'table';
  title?: string;
  content?: string;
  code?: string;
  language?: string;
  output?: string;
  items?: string[];
  headers?: string[];
  rows?: string[][];
  js?: string;
  css?: string;
}

export interface NextjsExercise {
  id: string;
  question: string;
  type: 'multiple-choice' | 'code-output';
  options?: string[];
  correct: string | number;
  explanation: string;
}

export interface NextjsQuiz {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const nextjsChapters = [
  { id: 'intro',    title: 'Getting Started',  icon: '🚀' },
  { id: 'routing',  title: 'Routing',           icon: '🗺️' },
  { id: 'data',     title: 'Data Fetching',     icon: '📡' },
  { id: 'ui',       title: 'UI & Styling',      icon: '🎨' },
  { id: 'advanced', title: 'Advanced',          icon: '⚡' },
];
