export interface ExpressLesson {
  id: string;
  title: string;
  slug: string;
  chapter: string;
  order: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readingTime: number;
  description: string;
  sections: ExpressSection[];
  exercises: ExpressExercise[];
  quiz: ExpressQuiz[];
}

export interface ExpressSection {
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

export interface ExpressExercise {
  id: string;
  question: string;
  type: 'multiple-choice' | 'code-output';
  options?: string[];
  correct: string | number;
  explanation: string;
}

export interface ExpressQuiz {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const expressChapters = [
  { id: 'intro',      title: 'Getting Started',  icon: 'E' },
  { id: 'routing',    title: 'Routing',          icon: 'R' },
  { id: 'middleware', title: 'Middleware',       icon: 'M' },
  { id: 'advanced',   title: 'Advanced Topics',  icon: '+' },
];
