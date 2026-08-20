export interface SqliteLesson {
  id: string;
  title: string;
  slug: string;
  chapter: string;
  order: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readingTime: number;
  description: string;
  sections: SqliteSection[];
  exercises: SqliteExercise[];
  quiz: SqliteQuiz[];
}

export interface SqliteSection {
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

export interface SqliteExercise {
  id: string;
  question: string;
  type: 'multiple-choice' | 'code-output';
  options?: string[];
  correct: string | number;
  explanation: string;
}

export interface SqliteQuiz {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const SqliteChapters = [
  { id: 'intro',    title: 'Getting Started',      icon: 'S' },
  { id: 'usage',    title: 'Working with SQLite',   icon: 'W' },
  { id: 'advanced', title: 'Advanced Topics',       icon: '+' },
];
