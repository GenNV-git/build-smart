import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { projects } from "@/content/projects";
import { PageHero } from "@/components/ui/PageHero";
import { ProjectCard } from "@/components/home/ProjectCard";
import { ConsultButton } from "@/components/forms/ConsultButton";
import { BlueprintArt } from "@/components/motion/BlueprintArt";
import { CtaBanner } from "@/components/layout/CtaBanner";
import { breadcrumbLd, pageMeta, withArea } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";

export const metadata: Metadata = pageMeta({
  title: "Completed Home & Interior Projects",
  description: withArea("See homes and interiors designed, built and handed over by Build Smart — real families, real transformations."),
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Projects", path: "/projects" }])} />
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
            className="relative isolate flex flex-col items-start justify-center overflow-clip rounded-[1.4rem] border border-dashed border-chocolate/20 bg-ivory p-8 sm:p-12 md:col-span-2"
            data-reveal
          >
            <BlueprintArt variant="plan" className="absolute -right-6 -top-4 -z-10 w-[10.5rem] text-gold-deep/25 sm:right-8 sm:top-1/2 sm:w-[21rem] sm:-translate-y-1/2 lg:right-16 lg:w-[24rem]" />
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
