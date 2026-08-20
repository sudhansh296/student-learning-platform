export interface RedisLesson {
  id: string;
  title: string;
  slug: string;
  chapter: string;
  order: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readingTime: number;
  description: string;
  sections: RedisSection[];
  exercises: RedisExercise[];
  quiz: RedisQuiz[];
}

export interface RedisSection {
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

export interface RedisExercise {
  id: string;
  question: string;
  type: 'multiple-choice' | 'code-output';
  options?: string[];
  correct: string | number;
  explanation: string;
}

export interface RedisQuiz {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const RedisChapters = [
  { id: 'fundamentals', title: 'Redis Fundamentals', icon: 'R' },
  { id: 'structures',   title: 'Data Structures',    icon: 'D' },
  { id: 'advanced',     title: 'Advanced Usage',     icon: '+' },
];
