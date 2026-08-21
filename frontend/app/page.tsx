import Hero from "@/components/site/home/Hero";
import Background from "@/components/site/home/Background";
import PainPoints from "@/components/site/home/PainPoints";
import Architecture from "@/components/site/home/Architecture";
import Technologies from "@/components/site/home/Technologies";
import Scenarios from "@/components/site/home/Scenarios";
import Team from "@/components/site/home/Team";
import PlatformCta from "@/components/site/home/PlatformCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Background />
      <PainPoints />
      <Architecture />
      <Technologies />
      <Scenarios />
      <Team />
      <PlatformCta />
    </>
  );
}

