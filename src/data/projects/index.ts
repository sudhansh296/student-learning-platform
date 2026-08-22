import { todoApp } from './todo-app';
import { quizApp } from './quiz-app';
import { weatherApp } from './weather-app';
import { calculatorProject } from './calculator';
import { countryExplorerProject } from './country-explorer';
import { portfolioProject } from './portfolio';
import { expenseTrackerProject } from './expense-tracker';
import { restApiProject } from './rest-api';
import { blogPlatformProject } from './blog-platform';
import { ecommerceProject } from './ecommerce';
import { chatAppProject } from './chat-app';
import type { Project } from './types';

export const allProjects: Project[] = [
  todoApp,
  weatherApp,
  calculatorProject,
  quizApp,
  countryExplorerProject,
  portfolioProject,
  expenseTrackerProject,
  restApiProject,
  blogPlatformProject,
  ecommerceProject,
  chatAppProject,
];

export function getProjectBySlug(slug: string): Project | undefined {
  return allProjects.find(p => p.slug === slug);
}

export type { Project };
export type { ProjectFile, ProjectLesson, ProjectChallenge } from './types';
