export interface PostgresqlLesson {
  id: string;
  title: string;
  slug: string;
  chapter: string;
  order: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readingTime: number;
  description: string;
  sections: PostgresqlSection[];
  exercises: PostgresqlExercise[];
  quiz: PostgresqlQuiz[];
}

export interface PostgresqlSection {
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

export interface PostgresqlExercise {
  id: string;
  question: string;
  type: 'multiple-choice' | 'code-output';
  options?: string[];
  correct: string | number;
  explanation: string;
}

export interface PostgresqlQuiz {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const PostgresqlChapters = [
  { id: 'intro',    title: 'Getting Started', icon: 'M' },
  { id: 'crud',     title: 'CRUD Operations', icon: 'C' },
  { id: 'queries',  title: 'Queries & Data',  icon: 'Q' },
  { id: 'advanced', title: 'Advanced Topics', icon: '+' },
];
