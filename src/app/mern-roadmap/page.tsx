import { RoadmapPage } from '@/components/seo/RoadmapPage';
import { mernRoadmap as roadmap } from '@/data/seo/mern-roadmap';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: roadmap.title, description: roadmap.description, path: roadmap.path, type: 'article' });

export default function MernRoadmapPage() {
  return <RoadmapPage roadmap={roadmap} />;
}
