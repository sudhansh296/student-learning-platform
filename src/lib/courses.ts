// Every lesson course of the site (id, label, URL prefix and lesson list) — shared by search, sitemap and SEO metadata.
import { htmlLessons } from '@/data/html-lessons/index';
import { cssLessons } from '@/data/css-lessons/index';
import { jsLessonsNew } from '@/data/js-lessons/index';
import { jsLessons as jsLessonsOld } from '@/data/js-curriculum';
import { tsLessons } from '@/data/ts-lessons/index';
import { reactLessons } from '@/data/react-lessons/index';
import { nextjsLessons } from '@/data/nextjs-lessons/index';
import { nodejsLessons } from '@/data/nodejs-lessons/index';
import { allExpressLessons } from '@/data/express-lessons/index';
import { allMongodbLessons } from '@/data/mongodb-lessons/index';
import { allPostgresqlLessons } from '@/data/postgresql-lessons/index';
import { allSqlLessons } from '@/data/sql-lessons/index';
import { allSqliteLessons } from '@/data/sqlite-lessons/index';
import { allRedisLessons } from '@/data/redis-lessons/index';
import { allDockerLessons } from '@/data/docker-lessons/index';
import { allGitLessons } from '@/data/git-lessons/index';
import { allRestapiLessons } from '@/data/restapi-lessons/index';

export interface SectionLike { type?: string; title?: string; content?: string; code?: string; items?: string[]; headers?: string[]; rows?: string[][] }
export interface LessonLike { slug: string; title: string; description?: string; sections?: SectionLike[] }

export interface Course { id: string; label: string; base: string; lessons: LessonLike[] }

export const COURSES: Course[] = [
  { id: 'html', label: 'HTML', base: '/html/', lessons: htmlLessons as unknown as LessonLike[] },
  { id: 'css', label: 'CSS', base: '/css/', lessons: cssLessons as unknown as LessonLike[] },
  { id: 'js', label: 'JavaScript', base: '/js/', lessons: [...(jsLessonsNew as unknown as LessonLike[]), ...(jsLessonsOld as unknown as LessonLike[])] },
  { id: 'typescript', label: 'TypeScript', base: '/learn/typescript/', lessons: tsLessons as unknown as LessonLike[] },
  { id: 'react', label: 'React', base: '/learn/react/', lessons: reactLessons as unknown as LessonLike[] },
  { id: 'nextjs', label: 'Next.js', base: '/learn/nextjs/', lessons: nextjsLessons as unknown as LessonLike[] },
  { id: 'nodejs', label: 'Node.js', base: '/learn/nodejs/', lessons: nodejsLessons as unknown as LessonLike[] },
  { id: 'express', label: 'Express', base: '/learn/express/', lessons: allExpressLessons as unknown as LessonLike[] },
  { id: 'mongodb', label: 'MongoDB', base: '/learn/mongodb/', lessons: allMongodbLessons as unknown as LessonLike[] },
  { id: 'postgresql', label: 'PostgreSQL', base: '/learn/postgresql/', lessons: allPostgresqlLessons as unknown as LessonLike[] },
  { id: 'sql', label: 'SQL', base: '/learn/sql/', lessons: allSqlLessons as unknown as LessonLike[] },
  { id: 'sqlite', label: 'SQLite', base: '/learn/sqlite/', lessons: allSqliteLessons as unknown as LessonLike[] },
  { id: 'redis', label: 'Redis', base: '/learn/redis/', lessons: allRedisLessons as unknown as LessonLike[] },
  { id: 'docker', label: 'Docker', base: '/learn/docker/', lessons: allDockerLessons as unknown as LessonLike[] },
  { id: 'git', label: 'Git', base: '/learn/git/', lessons: allGitLessons as unknown as LessonLike[] },
  { id: 'restapi', label: 'REST API', base: '/learn/rest-api/', lessons: allRestapiLessons as unknown as LessonLike[] },
];
