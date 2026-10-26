import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { StatsBar } from "@/components/home/StatsBar";
import { AboutIntro } from "@/components/home/AboutIntro";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { VideosSection } from "@/components/home/VideosSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { CtaBanner } from "@/components/layout/CtaBanner";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <AboutIntro />
      <ServicesSection />
      <ProjectsSection />
      <VideosSection />
      <TestimonialsSection />
      <ProcessSection />
      <CtaBanner source="home-cta" />
    </>
  );
}
