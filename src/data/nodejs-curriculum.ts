export interface NodejsLesson {
  id: string;
  title: string;
  slug: string;
  chapter: string;
  order: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readingTime: number;
  description: string;
  sections: NodejsSection[];
  exercises: NodejsExercise[];
  quiz: NodejsQuiz[];
}

export interface NodejsSection {
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

export interface NodejsExercise {
  id: string;
  question: string;
  type: 'multiple-choice' | 'code-output';
  options?: string[];
  correct: string | number;
  explanation: string;
}

export interface NodejsQuiz {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const nodejsChapters = [
  { id: 'intro',    title: 'Getting Started', icon: 'N' },
  { id: 'core',     title: 'Core Modules',    icon: 'M' },
  { id: 'server',   title: 'HTTP & Servers',  icon: 'S' },
  { id: 'async',    title: 'Async Patterns',  icon: 'A' },
  { id: 'advanced', title: 'Advanced',        icon: '+' },
];
