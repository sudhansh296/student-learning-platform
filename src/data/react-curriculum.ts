// React curriculum — 20 lessons

export interface ReactLesson {
  id: string;
  title: string;
  slug: string;
  chapter: string;
  order: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readingTime: number;
  description: string;
  sections: ReactSection[];
  exercises: ReactExercise[];
  quiz: ReactQuiz[];
}

export interface ReactSection {
  type: 'text' | 'heading' | 'example' | 'tryit' | 'note' | 'warning' | 'tip' | 'analogy' | 'list' | 'table';
  title?: string;
  content?: string;
  code?: string;
  language?: string;
  output?: string;
  items?: string[];
  headers?: string[];
  rows?: string[][];
  // For tryit — React uses CDN Babel so jsx runs directly
  jsx?: string;
  css?: string;
}

export interface ReactExercise {
  id: string;
  question: string;
  type: 'multiple-choice' | 'code-output';
  options?: string[];
  correct: string | number;
  explanation: string;
}

export interface ReactQuiz {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const reactChapters = [
  { id: 'intro',      title: 'Getting Started',    icon: '🚀' },
  { id: 'core',       title: 'Core Concepts',       icon: '⚛️' },
  { id: 'hooks',      title: 'React Hooks',         icon: '🪝' },
  { id: 'patterns',   title: 'Patterns & Data',     icon: '🔄' },
  { id: 'advanced',   title: 'Advanced React',      icon: '🔬' },
];
