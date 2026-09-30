import { RoadmapPage } from '@/components/seo/RoadmapPage';
import { frontendRoadmap as roadmap } from '@/data/seo/frontend-roadmap';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: roadmap.title, description: roadmap.description, path: roadmap.path, type: 'article' });

export default function FrontendRoadmapPage() {
  return <RoadmapPage roadmap={roadmap} />;
}
