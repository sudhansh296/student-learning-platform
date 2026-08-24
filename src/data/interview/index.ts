import { javascriptInterviewQuestions } from './javascript-questions';
import { htmlInterviewQuestions, cssInterviewQuestions } from './html-css-questions';
import { reactInterviewQuestions } from './react-questions';
import { nodejsInterviewQuestions } from './nodejs-questions';
import { restapiInterviewQuestions } from './restapi-questions';
import { databaseInterviewQuestions } from './database-questions';
import { securityInterviewQuestions } from './security-questions';
import { frontendInterviewQuestions } from './frontend-questions';
import { backendInterviewQuestions } from './backend-questions';
import { hrInterviewQuestions } from './hr-questions';
import { projectInterviewQuestions } from './project-questions';
import { codingInterviewQuestions } from './coding-questions';
import { codingProblems } from './coding-problems';
import { InterviewQuestion, InterviewCategoryMeta, InterviewDifficulty } from '@/lib/interview-types';

// Map CodingProblem difficulty to InterviewDifficulty
function mapDifficulty(d: 'Easy' | 'Medium' | 'Hard'): InterviewDifficulty {
  if (d === 'Easy') return 'beginner';
  if (d === 'Medium') return 'intermediate';
  return 'advanced';
}

// Convert the 120 coding problems into InterviewQuestion shape
const codingProblemsAsQuestions: InterviewQuestion[] = codingProblems.map(p => ({
  id: `coding-problem-${p.id}`,
  category: 'coding' as const,
  type: 'coding' as const,
  question: p.title,
  difficulty: mapDifficulty(p.difficulty),
  tags: p.tags,
  shortAnswer: p.explanation,
  detailedExplanation: p.description,
  example: {
    code: p.solution,
    language: 'javascript',
  },
  interviewAnswer: p.explanation,
  followUpQuestions: p.hints,
  codingChallenge: {
    starterCode: `// ${p.title}\n// ${p.description}\n\n// Your solution here`,
    solution: p.solution,
    hints: p.hints,
    testCases: p.examples.map(ex => ({ input: ex.input, expected: ex.output })),
  },
}));

// Combine all questions
export const allInterviewQuestions: InterviewQuestion[] = [
  ...javascriptInterviewQuestions,
  ...htmlInterviewQuestions,
  ...cssInterviewQuestions,
  ...reactInterviewQuestions,
  ...nodejsInterviewQuestions,
  ...restapiInterviewQuestions,
  ...databaseInterviewQuestions,
  ...securityInterviewQuestions,
  ...frontendInterviewQuestions,
  ...backendInterviewQuestions,
  ...hrInterviewQuestions,
  ...projectInterviewQuestions,
  ...codingInterviewQuestions,
  ...codingProblemsAsQuestions,
];

// Category metadata
export const interviewCategories: InterviewCategoryMeta[] = [
  {
    id: 'html',
    name: 'HTML',
    description: 'Semantic HTML, forms, accessibility, and HTML5 features',
    icon: '🌐',
    color: '#E34F26',
    bgColor: '#FFF4F0',
  },
  {
    id: 'css',
    name: 'CSS',
    description: 'Selectors, Box Model, Flexbox, Grid, responsive design',
    icon: '🎨',
    color: '#264DE4',
    bgColor: '#F0F4FF',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    description: 'Core concepts, ES6+, async programming, DOM manipulation',
    icon: '⚡',
    color: '#F7DF1E',
    bgColor: '#FFFEF0',
  },
  {
    id: 'frontend',
    name: 'Frontend',
    description: 'Component architecture, state management, performance',
    icon: '🎭',
    color: '#61DAFB',
    bgColor: '#F0FCFF',
  },
  {
    id: 'react',
    name: 'React',
    description: 'Hooks, lifecycle, state, props, performance optimization',
    icon: '⚛️',
    color: '#61DAFB',
    bgColor: '#F0FCFF',
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    description: 'Event loop, modules, streams, async I/O',
    icon: '💚',
    color: '#339933',
    bgColor: '#F0FFF0',
  },
  {
    id: 'backend',
    name: 'Backend',
    description: 'APIs, Express, middleware, authentication',
    icon: '⚙️',
    color: '#6366F1',
    bgColor: '#EEF2FF',
  },
  {
    id: 'database',
    name: 'Database',
    description: 'SQL, NoSQL, MongoDB, PostgreSQL, queries, indexing',
    icon: '🗄️',
    color: '#10B981',
    bgColor: '#ECFDF5',
  },
  {
    id: 'rest-api',
    name: 'REST API',
    description: 'HTTP methods, status codes, REST principles, API design',
    icon: '🌐',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
  },
  {
    id: 'security',
    name: 'Security',
    description: 'Authentication, authorization, JWT, XSS, CSRF, HTTPS',
    icon: '🔒',
    color: '#EF4444',
    bgColor: '#FEE2E2',
  },
  {
    id: 'project',
    name: 'Projects',
    description: 'Explain your projects, architecture, challenges, decisions',
    icon: '🚀',
    color: '#8B5CF6',
    bgColor: '#F3E8FF',
  },
  {
    id: 'coding',
    name: 'Coding',
    description: 'Practical coding challenges and problem-solving',
    icon: '💻',
    color: '#06B6D4',
    bgColor: '#CFFAFE',
  },
  {
    id: 'hr',
    name: 'HR Interview',
    description: 'Behavioral questions, communication, career goals',
    icon: '👥',
    color: '#EC4899',
    bgColor: '#FCE7F3',
  },
];

// Helper functions
export function getQuestionsByCategory(category: string): InterviewQuestion[] {
  return allInterviewQuestions.filter(q => q.category === category);
}

export function getQuestionsByDifficulty(difficulty: string): InterviewQuestion[] {
  return allInterviewQuestions.filter(q => q.difficulty === difficulty);
}

export function getQuestionsByType(type: string): InterviewQuestion[] {
  return allInterviewQuestions.filter(q => q.type === type);
}

export function searchQuestions(query: string): InterviewQuestion[] {
  const lowerQuery = query.toLowerCase();
  return allInterviewQuestions.filter(q =>
    q.question.toLowerCase().includes(lowerQuery) ||
    q.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    q.shortAnswer.toLowerCase().includes(lowerQuery)
  );
}

export function getQuestionById(id: string): InterviewQuestion | undefined {
  return allInterviewQuestions.find(q => q.id === id);
}

// Get question counts by category
export function getQuestionCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  interviewCategories.forEach(cat => {
    counts[cat.id] = getQuestionsByCategory(cat.id).length;
  });
  return counts;
}
