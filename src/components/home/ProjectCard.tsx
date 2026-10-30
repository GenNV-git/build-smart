import Image from "@/components/ui/Image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import type { Project } from "@/content/types";
import { isSet } from "@/content/site";
import { TempImageTag } from "@/components/ui/DevNote";

export function ProjectCard({ project, priority = false, tall = false }: { project: Project; priority?: boolean; tall?: boolean }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`group relative block overflow-hidden rounded-[1.4rem] bg-chocolate shadow-[var(--shadow-soft)] ${tall ? "aspect-[4/5] sm:aspect-[4/3] lg:aspect-[5/4]" : "aspect-[4/5] min-[480px]:aspect-[4/3] lg:aspect-[5/4]"}`}
      aria-label={`Explore project: ${project.name}${project.location ? `, ${project.location}` : ""}`}
    >
      <Image
        src={project.cover.src}
        alt={project.cover.alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 45vw, 100vw"
        className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-lux)] group-hover:scale-[1.04]"
        style={{ objectPosition: project.cover.position || "50% 50%" }}
      />
      {project.cover.temporary && <TempImageTag />}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(25_22_19/0)_35%,rgb(25_22_19/0.85)_100%)] transition-opacity duration-500" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-8">
        <div className="text-cream">
          <h3 className="font-sans text-lg font-bold sm:text-2xl">{project.name}</h3>
          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.8rem] text-cream/75">
            {isSet(project.location) && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5 text-gold" /> {project.location}
              </span>
            )}
            {project.type !== project.name && <span>{project.type}</span>}
            <span className="inline-flex items-center gap-1.5 font-semibold text-gold-soft">
              Explore Project
            </span>
          </p>
        </div>
        <span className="grid size-11 shrink-0 place-items-center rounded-full border border-cream/25 sm:size-12 bg-cream/15 text-cream backdrop-blur-md transition-all duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-espresso">
          <ArrowRight className="size-5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
