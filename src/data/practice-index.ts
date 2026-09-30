// Aggregates the quiz questions already embedded in every lesson across all
// technologies into one browsable "Practice" hub, without duplicating content.
import { htmlLessons } from './html-lessons';
import { cssLessons } from './css-lessons';
import { jsLessonsNew } from './js-lessons';
import { tsLessons } from './ts-lessons';
import { reactLessons } from './react-lessons';
import { nextjsLessons } from './nextjs-lessons';
import { nodejsLessons } from './nodejs-lessons';
import { allExpressLessons } from './express-lessons';
import { allMongodbLessons } from './mongodb-lessons';
import { allPostgresqlLessons } from './postgresql-lessons';
import { allGitLessons } from './git-lessons';
import { allDockerLessons } from './docker-lessons';
import { allSqlLessons } from './sql-lessons';
import { allSqliteLessons } from './sqlite-lessons';
import { allRedisLessons } from './redis-lessons';
import { allRestapiLessons } from './restapi-lessons';

export interface PracticeQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface LessonLike {
  title: string;
  quiz?: PracticeQuizQuestion[];
}

export interface PracticeTech {
  id: string;
  name: string;
  slug: string;
  logo: string;
  bgColor: string;
  href: string;
  lessons: LessonLike[];
}

const routeFor = (id: string, slug: string) => {
  if (id === 'html') return '/html';
  if (id === 'css') return '/css';
  if (id === 'javascript') return '/js';
  return `/learn/${slug}`;
};

export const PRACTICE_TECHS: PracticeTech[] = [
  { id: 'html', name: 'HTML', slug: 'html', logo: '🌐', bgColor: '#FFF4F0', href: routeFor('html', 'html'), lessons: htmlLessons },
  { id: 'css', name: 'CSS', slug: 'css', logo: '🎨', bgColor: '#F0F4FF', href: routeFor('css', 'css'), lessons: cssLessons },
  { id: 'javascript', name: 'JavaScript', slug: 'javascript', logo: '⚡', bgColor: '#FFFEF0', href: routeFor('javascript', 'javascript'), lessons: jsLessonsNew },
  { id: 'typescript', name: 'TypeScript', slug: 'typescript', logo: '🔷', bgColor: '#F0F7FF', href: routeFor('typescript', 'typescript'), lessons: tsLessons },
  { id: 'react', name: 'React', slug: 'react', logo: '⚛️', bgColor: '#F0FEFF', href: routeFor('react', 'react'), lessons: reactLessons },
  { id: 'nextjs', name: 'Next.js', slug: 'nextjs', logo: '▲', bgColor: '#F5F5F5', href: routeFor('nextjs', 'nextjs'), lessons: nextjsLessons },
  { id: 'nodejs', name: 'Node.js', slug: 'nodejs', logo: '🟢', bgColor: '#F0FFF0', href: routeFor('nodejs', 'nodejs'), lessons: nodejsLessons },
  { id: 'express', name: 'Express.js', slug: 'express', logo: '🚂', bgColor: '#F8F8F8', href: routeFor('express', 'express'), lessons: allExpressLessons },
  { id: 'mongodb', name: 'MongoDB', slug: 'mongodb', logo: '🍃', bgColor: '#F0FFF4', href: routeFor('mongodb', 'mongodb'), lessons: allMongodbLessons },
  { id: 'postgresql', name: 'PostgreSQL', slug: 'postgresql', logo: '🐘', bgColor: '#F0F4FF', href: routeFor('postgresql', 'postgresql'), lessons: allPostgresqlLessons },
  { id: 'git', name: 'Git', slug: 'git', logo: '🌿', bgColor: '#FFF4F0', href: routeFor('git', 'git'), lessons: allGitLessons },
  { id: 'docker', name: 'Docker', slug: 'docker', logo: '🐳', bgColor: '#F0F8FF', href: routeFor('docker', 'docker'), lessons: allDockerLessons },
  { id: 'sql', name: 'SQL', slug: 'sql', logo: '🗃️', bgColor: '#FFF7F0', href: routeFor('sql', 'sql'), lessons: allSqlLessons },
  { id: 'sqlite', name: 'SQLite', slug: 'sqlite', logo: '💾', bgColor: '#F0F4FF', href: routeFor('sqlite', 'sqlite'), lessons: allSqliteLessons },
  { id: 'redis', name: 'Redis', slug: 'redis', logo: '🔴', bgColor: '#FFF0F0', href: routeFor('redis', 'redis'), lessons: allRedisLessons },
  { id: 'restapi', name: 'REST APIs', slug: 'rest-api', logo: '🔗', bgColor: '#F0FFFA', href: routeFor('restapi', 'rest-api'), lessons: allRestapiLessons },
];

export function quizCount(tech: PracticeTech): number {
  return tech.lessons.reduce((sum, l) => sum + (l.quiz?.length ?? 0), 0);
}

export function combinedQuiz(tech: PracticeTech, limit = 15): PracticeQuizQuestion[] {
  const all = tech.lessons.flatMap(l => l.quiz ?? []);
  // Fisher-Yates shuffle so the quiz mixes questions from across all lessons
  // instead of always running in lesson order.
  const shuffled = [...all];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, limit);
}

export function getPracticeTech(slug: string): PracticeTech | undefined {
  return PRACTICE_TECHS.find(t => t.slug === slug);
}
