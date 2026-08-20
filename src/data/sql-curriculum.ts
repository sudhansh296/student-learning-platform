export interface SqlLesson {
  id: string;
  title: string;
  slug: string;
  chapter: string;
  order: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readingTime: number;
  description: string;
  sections: SqlSection[];
  exercises: SqlExercise[];
  quiz: SqlQuiz[];
}

export interface SqlSection {
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

export interface SqlExercise {
  id: string;
  question: string;
  type: 'multiple-choice' | 'code-output';
  options?: string[];
  correct: string | number;
  explanation: string;
}

export interface SqlQuiz {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const SqlChapters = [
  { id: 'basics',    title: 'SQL Basics',         icon: 'S' },
  { id: 'querying',  title: 'Querying Data',       icon: 'Q' },
  { id: 'advanced',  title: 'Advanced SQL',        icon: '+' },
];
