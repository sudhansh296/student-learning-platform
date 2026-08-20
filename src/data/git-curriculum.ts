export interface GitLesson {
  id: string;
  title: string;
  slug: string;
  chapter: string;
  order: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readingTime: number;
  description: string;
  sections: GitSection[];
  exercises: GitExercise[];
  quiz: GitQuiz[];
}

export interface GitSection {
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

export interface GitExercise {
  id: string;
  question: string;
  type: 'multiple-choice' | 'code-output';
  options?: string[];
  correct: string | number;
  explanation: string;
}

export interface GitQuiz {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const GitChapters = [
  { id: 'basics',    title: 'Git Basics',              icon: 'G' },
  { id: 'branching', title: 'Branching and Merging',    icon: 'B' },
  { id: 'remote',    title: 'Remote and Collaboration', icon: 'R' },
  { id: 'advanced',  title: 'Advanced and Reference',   icon: '+' },
];
