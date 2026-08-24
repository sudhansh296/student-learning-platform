import { Hero }             from '@/components/home/Hero';
import { PlaygroundBanner } from '@/components/home/PlaygroundBanner';
import { TechGrid }         from '@/components/home/TechGrid';
import { MernSection }      from '@/components/home/MernSection';
import { RoadmapsSection }  from '@/components/home/RoadmapsSection';
import { ComparePreview }   from '@/components/home/ComparePreview';
import { ProjectsPreview }  from '@/components/home/ProjectsPreview';
import { InterviewSection } from '@/components/home/InterviewSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <PlaygroundBanner />
      <TechGrid />
      <MernSection />
      <RoadmapsSection />
      <ComparePreview />
      <ProjectsPreview />
      <InterviewSection />
    </>
  );
}
