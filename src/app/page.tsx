import { Hero }             from '@/components/home/Hero';
import { PlaygroundBanner } from '@/components/home/PlaygroundBanner';
import { TechRoadmap }      from '@/components/home/TechRoadmap';
import { PopularResources } from '@/components/home/PopularResources';
import { MernSection }      from '@/components/home/MernSection';
import { RoadmapsSection }  from '@/components/home/RoadmapsSection';
import { ComparePreview }   from '@/components/home/ComparePreview';
import { ProjectsPreview }  from '@/components/home/ProjectsPreview';
import { InterviewSection } from '@/components/home/InterviewSection';
import { SITE_URL, SITE_NAME } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = { alternates: { canonical: '/' } };

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  description: 'Free web development tutorials with live code you can run in your browser: HTML, CSS, JavaScript, React, Node.js, MongoDB and more.',
  inLanguage: 'en',
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <Hero />
      <PlaygroundBanner />
      <TechRoadmap />
      <PopularResources />
      <MernSection />
      <RoadmapsSection />
      <ComparePreview />
      <ProjectsPreview />
      <InterviewSection />
    </>
  );
}
