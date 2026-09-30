import { MetadataRoute } from 'next';
import { COURSES } from '@/lib/courses';
import { SITE_URL, HUB_PAGES, INFO_PAGES } from '@/lib/seo';
import { roadmaps } from '@/data/roadmaps';
import { allProjects } from '@/data/projects/index';
import { interviewCategories } from '@/data/interview';
import { PRACTICE_TECHS } from '@/data/practice-index';

const BASE = SITE_URL;

// Course overview pages (/learn/<tech>) — the lessons themselves come from the lesson data below.
const OVERVIEW_SLUGS = ['html', 'css', 'javascript', 'typescript', 'react', 'nextjs', 'nodejs', 'express', 'mongodb', 'postgresql', 'git', 'docker', 'sql', 'sqlite', 'redis', 'rest-api'];
const TOOL_IDS = ['json-formatter', 'base64', 'url-encoder', 'jwt-decoder', 'hash-generator', 'color-converter', 'css-gradient', 'timestamp', 'uuid-generator', 'lorem-ipsum', 'markdown-previewer', 'regex-tester'];

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [];
  const add = (path: string, priority: number, changeFrequency: 'weekly' | 'monthly' = 'monthly') => {
    // no lastModified: we do not track real edit dates, and a build-time "now" on every URL would be an inaccurate signal
    urls.push({ url: `${BASE}${path}`, changeFrequency, priority });
  };

  // Top-level pages
  for (const p of ['', '/learn', '/roadmaps', '/projects', '/tools', '/technologies', '/reference', '/practice', '/interview', '/playground', '/databases', '/mern', '/compare']) {
    add(p, p === '' ? 1 : 0.9, 'weekly');
  }
  for (const p of HUB_PAGES) add(p, 0.9, 'weekly');
  for (const p of INFO_PAGES) add(p, 0.4);

  // Course overviews and every lesson (read from the same data the lesson pages render, so no link can go stale)
  for (const s of OVERVIEW_SLUGS) add(`/learn/${s}`, 0.8);
  for (const course of COURSES) {
    const seen = new Set<string>();
    for (const lesson of course.lessons) {
      if (!lesson?.slug || seen.has(lesson.slug)) continue;
      seen.add(lesson.slug);
      add(`${course.base}${lesson.slug}`, 0.7);
    }
  }

  for (const r of roadmaps) add(`/roadmaps/${r.slug}`, 0.8);
  for (const p of allProjects) add(`/projects/${p.slug}`, 0.8);
  for (const id of TOOL_IDS) add(`/tools/${id}`, 0.7);
  for (const c of interviewCategories) add(`/interview/${c.id}`, 0.7);
  for (const t of PRACTICE_TECHS) add(`/practice/${t.slug}`, 0.7);

  return urls;
}
