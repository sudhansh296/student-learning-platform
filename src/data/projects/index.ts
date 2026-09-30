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
import { typingTestProject } from './typing-test';
import { bmiCalculatorProject } from './bmi-calculator';
import { memoryGameProject } from './memory-game';
import { pomodoroTimerProject } from './pomodoro-timer';
import { markdownEditorProject } from './markdown-editor';
import { urlShortenerProject } from './url-shortener';
import { musicPlayerProject } from './music-player';
import { fileSharingProject } from './file-sharing';
import { kanbanBoardProject } from './kanban-board';
import { postgresqlQueryLabProject } from './postgresql-query-lab';
import { dockerCommandSimulatorProject } from './docker-command-simulator';
import { sqlFundamentalsExplorerProject } from './sql-fundamentals-explorer';
import { sqliteNotesVaultProject } from './sqlite-notes-vault';
import { redisCacheLabProject } from './redis-cache-lab';
import { typescriptFormValidatorProject } from './typescript-form-validator';
import { nextjsBlogServerActionsProject } from './nextjs-blog-server-actions';
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
  typingTestProject,
  bmiCalculatorProject,
  memoryGameProject,
  pomodoroTimerProject,
  markdownEditorProject,
  urlShortenerProject,
  musicPlayerProject,
  fileSharingProject,
  kanbanBoardProject,
  postgresqlQueryLabProject,
  dockerCommandSimulatorProject,
  sqlFundamentalsExplorerProject,
  sqliteNotesVaultProject,
  redisCacheLabProject,
  typescriptFormValidatorProject,
  nextjsBlogServerActionsProject,
];

export function getProjectBySlug(slug: string): Project | undefined {
  return allProjects.find(p => p.slug === slug);
}

export type { Project };
export type { ProjectFile, ProjectLesson, ProjectChallenge } from './types';
