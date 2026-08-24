// Interview Preparation Type Definitions

export type InterviewDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type InterviewCategory =
  | 'html'
  | 'css'
  | 'javascript'
  | 'frontend'
  | 'react'
  | 'nodejs'
  | 'backend'
  | 'database'
  | 'rest-api'
  | 'security'
  | 'project'
  | 'coding'
  | 'hr';

export type QuestionType = 
  | 'theory'
  | 'output'
  | 'coding'
  | 'scenario'
  | 'project'
  | 'hr';

export interface InterviewQuestion {
  id: string;
  category: InterviewCategory;
  type: QuestionType;
  question: string;
  difficulty: InterviewDifficulty;
  tags: string[];
  
  // Answers
  shortAnswer: string;
  detailedExplanation: string;
  
  // Code example (optional)
  example?: {
    code: string;
    language: string;
    explanation?: string;
  };
  
  // Interview-specific
  interviewAnswer?: string;  // How to answer in an interview
  commonMistakes?: string[];
  realWorldUse?: string;
  
  // Follow-ups
  followUpQuestions?: string[];
  
  // Related content
  relatedTopics?: string[];
  relatedLessons?: Array<{
    tech: string;
    lesson: string;
    title: string;
  }>;
  
  // Coding challenge (for coding type questions)
  codingChallenge?: {
    starterCode: string;
    solution: string;
    hints: string[];
    testCases?: Array<{
      input: string;
      expected: string;
    }>;
  };
}

export interface InterviewCategoryMeta {
  id: InterviewCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  questionCount?: number;
}

export interface MockInterviewConfig {
  role: 'frontend' | 'javascript' | 'backend' | 'fullstack' | 'web';
  difficulty: InterviewDifficulty;
  duration: number; // minutes
  questionCount: number;
}

export interface MockInterviewResult {
  questionAsked: number;
  questionsAnswered: number;
  questionsSkipped: number;
  topicsCovered: string[];
  weakAreas: string[];
  timeSpent: number;
  completedAt: Date;
}

// Progress tracking (localStorage)
export interface InterviewProgress {
  questionsViewed: string[];
  questionsBookmarked: string[];
  questionsCompleted: string[];
  questionsNeedRevision: string[];
  weakTopics: string[];
  mockInterviews: MockInterviewResult[];
  lastUpdated: Date;
}
