import Hero from "@/components/site/home/Hero";
import AlsOverview from "@/components/site/home/AlsOverview";
import ProjectSolution from "@/components/site/home/ProjectSolution";
import Architecture from "@/components/site/home/Architecture";
import ResearchEvidence from "@/components/site/home/ResearchEvidence";
import Capabilities from "@/components/site/home/Capabilities";
import Outlook from "@/components/site/home/Outlook";
import Team from "@/components/site/home/Team";
import PlatformCta from "@/components/site/home/PlatformCta";
import DigitalTwinCta from "@/components/site/home/DigitalTwinCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AlsOverview />
      <ProjectSolution />
      <Architecture />
      <ResearchEvidence />
      <Capabilities />
      <Outlook />
      <Team />
      <PlatformCta />
      <DigitalTwinCta />
    </>
  );
}
