import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projects } from "@/content/projects";
import { ProjectCard } from "./ProjectCard";

export function ProjectsSection() {
  const featured = projects.filter((p) => p.featured).slice(0, 2);
  return (
    <section id="projects" aria-labelledby="projects-title" className="py-16 sm:py-24 lg:py-28">
      <div className="container-lux">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading id="projects-title" eyebrow="Our Projects" title="Real Homes. Real Transformations." className="max-w-3xl" />
          <Link href="/projects" className="group inline-flex items-center gap-2 text-sm font-semibold text-espresso" data-reveal>
            View All Projects <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {featured.map((p, i) => (
            <div key={p.slug} data-reveal style={{ ["--reveal-delay" as string]: `${i * 100}ms` }}>
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
