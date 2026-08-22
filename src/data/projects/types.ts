export type ProjectType = 'frontend' | 'react' | 'backend' | 'fullstack';
export type ProjectDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface ProjectFile {
  path: string;
  language: 'html' | 'css' | 'javascript' | 'typescript' | 'json' | 'markdown' | 'bash' | 'text';
  content: string;
}

export interface ProjectLesson {
  id: string;
  title: string;
  explanation: string;
  html?: string;
  css?: string;
  js?: string;
}

export interface ProjectChallenge {
  id: string;
  title: string;
  description: string;
  hint: string;
  difficulty: 'easy' | 'medium' | 'hard';
  solutionHtml?: string;
  solutionCss?: string;
  solutionJs?: string;
}

export interface ProjectGithub {
  owner: string;
  repo: string;
  branch: string;
  url: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  difficulty: ProjectDifficulty;
  type: ProjectType;
  estimatedTime: string;
  description: string;
  overview: string;
  objective: string;
  technologies: string[];
  prerequisites: string[];
  learnings: string[];
  features: string[];
  fileStructure: string;
  files: ProjectFile[];
  lessons: ProjectLesson[];
  challenges: ProjectChallenge[];
  github?: ProjectGithub;
  liveUrl?: string;
  nextProject?: string;
  playgroundKey?: string; // Key for loading template in playground/editor
}
