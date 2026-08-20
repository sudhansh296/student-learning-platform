export interface DockerLesson {
  id: string;
  title: string;
  slug: string;
  chapter: string;
  order: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readingTime: number;
  description: string;
  sections: DockerSection[];
  exercises: DockerExercise[];
  quiz: DockerQuiz[];
}

export interface DockerSection {
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

export interface DockerExercise {
  id: string;
  question: string;
  type: 'multiple-choice' | 'code-output';
  options?: string[];
  correct: string | number;
  explanation: string;
}

export interface DockerQuiz {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const DockerChapters = [
  { id: 'fundamentals', title: 'Docker Fundamentals', icon: 'D' },
  { id: 'images',       title: 'Images and Containers', icon: 'I' },
  { id: 'advanced',     title: 'Networking and Compose', icon: 'N' },
  { id: 'production',   title: 'Production and Registry', icon: 'P' },
];
