export interface MongodbLesson {
  id: string;
  title: string;
  slug: string;
  chapter: string;
  order: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readingTime: number;
  description: string;
  sections: MongodbSection[];
  exercises: MongodbExercise[];
  quiz: MongodbQuiz[];
}

export interface MongodbSection {
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

export interface MongodbExercise {
  id: string;
  question: string;
  type: 'multiple-choice' | 'code-output';
  options?: string[];
  correct: string | number;
  explanation: string;
}

export interface MongodbQuiz {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const mongodbChapters = [
  { id: 'intro',    title: 'Getting Started', icon: 'M' },
  { id: 'crud',     title: 'CRUD Operations', icon: 'C' },
  { id: 'queries',  title: 'Queries & Data',  icon: 'Q' },
  { id: 'advanced', title: 'Advanced Topics', icon: '+' },
];
