export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type Category =
  | 'frontend'
  | 'backend'
  | 'database'
  | 'api'
  | 'devops'
  | 'testing'
  | 'tools'
  | 'language'
  | 'framework'
  | 'library'
  | 'security'
  | 'performance';

export interface Technology {
  id: string;
  name: string;
  slug: string;
  category: Category;
  subcategory?: string;
  description: string;
  longDescription?: string;
  difficulty: Difficulty;
  logo: string;
  color: string;
  bgColor: string;
  prerequisites?: string[];
  topics: Topic[];
  relatedTechnologies?: string[];
  isPopular?: boolean;
  isNew?: boolean;
  yearCreated?: number;
  usedBy?: string[];
  officialUrl?: string;
}

export interface Topic {
  id: string;
  title: string;
  slug: string;
  technologyId: string;
  description: string;
  content: ContentSection[];
  difficulty: Difficulty;
  readingTime: number;
  nextTopics?: string[];
  previousTopics?: string[];
  relatedTopics?: string[];
  lastUpdated: string;
  tags?: string[];
}

export interface ContentSection {
  type: 'text' | 'code' | 'callout' | 'heading' | 'list' | 'table' | 'analogy' | 'example';
  content?: string;
  language?: string;
  filename?: string;
  output?: string;
  variant?: 'info' | 'warning' | 'tip' | 'danger';
  title?: string;
  items?: string[];
  headers?: string[];
  rows?: string[][];
}

export interface RoadmapNode {
  id: string;
  title: string;
  slug?: string;
  technologyId?: string;
  status?: 'required' | 'recommended' | 'optional';
  children?: RoadmapNode[];
}

export interface Roadmap {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  estimatedTime: string;
  nodes: RoadmapNode[];
}

export interface InterviewQuestion {
  id: string;
  question: string;
  shortAnswer: string;
  detailedAnswer: string;
  example?: string;
  followUp?: string;
  difficulty: Difficulty;
  technologyId: string;
  tags?: string[];
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  technologies: string[];
  features: string[];
  learnings: string[];
  estimatedTime: string;
  category: string;
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'technology' | 'topic' | 'comparison' | 'project';
  slug: string;
  technologySlug?: string;
  difficulty?: Difficulty;
  tags?: string[];
}

export interface DevTool {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  category: string;
}
