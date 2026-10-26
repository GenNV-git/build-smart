import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { projects } from "@/content/projects";
import { PageHero } from "@/components/ui/PageHero";
import { ProjectCard } from "@/components/home/ProjectCard";
import { ConsultButton } from "@/components/forms/ConsultButton";
import { CtaBanner } from "@/components/layout/CtaBanner";

export const metadata: Metadata = {
  title: "Projects",
  description: "Completed residential projects by Build Smart — real homes, real transformations.",
  alternates: { canonical: "/projects" },
  openGraph: { title: "Projects | Build Smart", url: "/projects" },
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Projects"
        title="Real Homes."
        accent="Real Transformations."
        intro="Every project here is a home we have designed, built and handed over. Explore each one in detail."
        image={projects[1]?.cover ?? projects[0].cover}
      />
      <section aria-label="Project portfolio" className="py-14 sm:py-20 lg:py-28">
        <div className="container-lux grid gap-6 md:grid-cols-2">
          {projects.map((p, i) => (
            <div key={p.slug} data-reveal style={{ ["--reveal-delay" as string]: `${(i % 2) * 100}ms` }}>
              <ProjectCard project={p} tall priority={i < 2} />
            </div>
          ))}
          <div
            className="flex flex-col items-start justify-center rounded-[1.4rem] border border-dashed border-chocolate/20 bg-ivory p-8 sm:p-12 md:col-span-2"
            data-reveal
          >
            <span className="grid size-12 place-items-center rounded-full bg-gold/20 text-chocolate">
              <Plus className="size-5" />
            </span>
            <h2 className="mt-6 text-3xl text-espresso sm:text-4xl">More homes are on the way.</h2>
            <p className="mt-3 max-w-xl text-[0.96rem] leading-relaxed text-muted">
              New projects are added as they are completed. Yours could be next — tell us what you have in mind.
            </p>
            <ConsultButton className="btn btn-gold mt-7" source="projects-next">
              Start Your Project
            </ConsultButton>
          </div>
        </div>
      </section>
      <CtaBanner source="projects-cta" />
    </>
  );
}
