import { HeroSection } from "@/components/home/HeroSection";
import { FeatureSection } from "@/components/home/FeatureSection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <HeroSection />
      <FeatureSection />
    </main>
  );
}
