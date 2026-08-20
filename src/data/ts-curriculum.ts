export interface TsLesson {
  id: string;
  title: string;
  slug: string;
  chapter: string;
  order: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readingTime: number;
  description: string;
  sections: TsSection[];
  exercises: TsExercise[];
  quiz: TsQuiz[];
}

export interface TsSection {
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

export interface TsExercise {
  id: string;
  question: string;
  type: 'multiple-choice' | 'code-output';
  options?: string[];
  correct: string | number;
  explanation: string;
}

export interface TsQuiz {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const tsChapters = [
  { id: 'intro',     title: 'Getting Started',      icon: '🚀' },
  { id: 'types',     title: 'Type System',           icon: '🔷' },
  { id: 'advanced',  title: 'Advanced Types',        icon: '⚡' },
  { id: 'practical', title: 'Practical TypeScript',  icon: '🛠️' },
];
