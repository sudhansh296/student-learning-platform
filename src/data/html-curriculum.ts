export interface HtmlLesson {
  id: string;
  title: string;
  slug: string;
  chapter: string;
  order: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readingTime: number;
  description: string;
  sections: HtmlSection[];
  exercises?: HtmlExercise[];
  quiz?: HtmlQuiz[];
}

export interface HtmlSection {
  type: 'text' | 'heading' | 'subheading' | 'code' | 'tryit' | 'note' | 'warning' | 'tip' | 'analogy' | 'list' | 'table';
  title?: string;
  content?: string;
  code?: string;
  language?: string;
  html?: string;
  css?: string;
  js?: string;
  mode?: 'html' | 'css' | 'js' | 'full';
  items?: string[];
  headers?: string[];
  rows?: string[][];
}

export interface HtmlExercise {
  id: string;
  question: string;
  type: 'multiple-choice' | 'fill-blank' | 'code-output';
  options?: string[];
  correct: string | number;
  explanation: string;
}

export interface HtmlQuiz {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const htmlChapters = [
  { id: 'basics',    title: 'Getting Started',   icon: '🚀' },
  { id: 'structure', title: 'Structure',          icon: '🏗️' },
  { id: 'text',      title: 'Text & Styling',     icon: '✏️' },
  { id: 'links',     title: 'Links',              icon: '🔗' },
  { id: 'images',    title: 'Images & Media',     icon: '🖼️' },
  { id: 'lists',     title: 'Lists',              icon: '📋' },
  { id: 'tables',    title: 'Tables',             icon: '📊' },
  { id: 'forms',     title: 'Forms',              icon: '📝' },
  { id: 'semantic',  title: 'Semantic HTML',      icon: '🏷️' },
  { id: 'advanced',  title: 'Advanced',           icon: '⚡' },
  { id: 'reference', title: 'References',          icon: '📖' },
];
