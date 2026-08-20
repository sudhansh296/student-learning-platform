export interface RestapiLesson {
  id: string;
  title: string;
  slug: string;
  chapter: string;
  order: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readingTime: number;
  description: string;
  sections: RestapiSection[];
  exercises: RestapiExercise[];
  quiz: RestapiQuiz[];
}

export interface RestapiSection {
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

export interface RestapiExercise {
  id: string;
  question: string;
  type: 'multiple-choice' | 'code-output';
  options?: string[];
  correct: string | number;
  explanation: string;
}

export interface RestapiQuiz {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const RestapiChapters = [
  { id: 'basics',        title: 'REST Fundamentals',      icon: 'R' },
  { id: 'http',          title: 'HTTP and Methods',        icon: 'H' },
  { id: 'building',      title: 'Building APIs',           icon: 'B' },
  { id: 'advanced',      title: 'Advanced and Production', icon: '+' },
];
