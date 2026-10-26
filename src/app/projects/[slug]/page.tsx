import type { Metadata } from "next";
import Image from "@/components/ui/Image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Film } from "lucide-react";
import { getProject, projects } from "@/content/projects";
import { getTestimonial } from "@/content/testimonials";
import { isSet } from "@/content/site";
import { ProjectCard } from "@/components/home/ProjectCard";
import { VideoCard } from "@/components/video/VideoCard";
import { TestimonialCard } from "@/components/video/TestimonialCard";
import { BeforeAfter } from "@/components/video/BeforeAfter";
import { DevNote, TempImageTag } from "@/components/ui/DevNote";
import { CtaBanner } from "@/components/layout/CtaBanner";
import { youtubeId } from "@/lib/youtube";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  const title = `${p.label}: ${p.name}`;
  return {
    title,
    description: p.summary,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { title: `${title} | Build Smart`, description: p.summary, url: `/projects/${p.slug}`, images: [{ url: p.cover.src }] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const testimonial = getTestimonial(project.testimonialId);
  const related = projects.filter((p) => p.slug !== project.slug).slice(0, 2);
  const facts = [
    { k: "Project type", v: project.type },
    { k: "Location", v: project.location },
    { k: "Completed", v: project.year },
  ].filter((f) => isSet(f.v));
  const hasWalkthrough = !!youtubeId(project.walkthroughVideoUrl);

  return (
    <>
      {/* 1. Hero */}
      <section aria-labelledby="project-title" className="relative isolate flex min-h-[78svh] items-end overflow-hidden bg-espresso pb-16 pt-36 text-cream">
        <Image src={project.cover.src} alt={project.cover.alt} fill priority sizes="100vw" className="-z-20 object-cover" style={{ objectPosition: project.cover.position || "50% 50%" }} />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(25_22_19/0.55)_0%,rgb(25_22_19/0.15)_40%,rgb(25_22_19/0.9)_100%)]" />
        <div className="container-lux">
          <Link href="/projects" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cream/75 hover:text-gold">
            <ArrowLeft className="size-4" /> All projects
          </Link>
          <p className="eyebrow eyebrow-light mt-8 flex w-fit">{project.label}</p>
          <h1 id="project-title" className="mt-4 text-5xl leading-none sm:text-7xl">
            {project.name}
          </h1>
          {facts.length > 0 && (
            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
              {facts.map((f) => (
                <div key={f.k}>
                  <dt className="text-[0.65rem] uppercase tracking-[0.22em] text-cream/55">{f.k}</dt>
                  <dd className="mt-1 text-sm font-medium">{f.v}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      {/* 2–4. Overview, scope, concept */}
      <section aria-labelledby="overview-title" className="py-14 sm:py-20 lg:py-28">
        <div className="container-lux grid gap-14 lg:grid-cols-[1.3fr_0.7fr] lg:gap-20">
          <div data-reveal>
            <p className="eyebrow">Project Overview</p>
            <h2 id="overview-title" className="mt-4 text-4xl text-espresso sm:text-5xl">
              {project.summary}
            </h2>
            <div className="prose-lux mt-6 max-w-2xl text-[0.98rem] text-muted">
              {project.overview.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            {isSet(project.concept.intro) && (
              <div className="mt-12">
                <h3 className="text-3xl text-espresso">Design Concept</h3>
                <p className="mt-4 max-w-2xl leading-relaxed text-muted">{project.concept.intro}</p>
                {project.concept.objectives.length > 0 && (
                  <ul className="mt-6 space-y-3">
                    {project.concept.objectives.map((o) => (
                      <li key={o} className="flex gap-3 text-sm text-ink">
                        <Check className="mt-0.5 size-4 shrink-0 text-gold-deep" /> {o}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            <DevNote className="mt-8">
              Fill in name, location, year, overview, scope and design concept for this project in src/content/projects.ts
            </DevNote>
          </div>

          <aside className="h-fit rounded-[1.4rem] bg-sand p-7 sm:p-8" data-reveal aria-labelledby="scope-title">
            <h2 id="scope-title" className="font-sans text-sm font-bold uppercase tracking-[0.18em] text-chocolate">
              Scope of Work
            </h2>
            {project.scope.length > 0 ? (
              <ul className="mt-5 space-y-3">
                {project.scope.map((s) => (
                  <li key={s} className="flex gap-3 text-sm text-ink">
                    <Check className="mt-0.5 size-4 shrink-0 text-gold-deep" /> {s}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm leading-relaxed text-muted">The detailed scope for this project will be published shortly.</p>
            )}
            <Link href="/contact" className="btn btn-gold btn-sm mt-8 w-full">
              Plan a similar project
            </Link>
          </aside>
        </div>
      </section>

      {/* 5–6. Gallery */}
      {project.gallery.length > 0 && (
        <section aria-labelledby="gallery-title" className="bg-ivory py-14 sm:py-20 lg:py-28">
          <div className="container-lux">
            <p className="eyebrow">Selected Photographs</p>
            <h2 id="gallery-title" className="mt-4 text-4xl text-espresso sm:text-5xl">
              Room by room.
            </h2>
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {project.gallery.map((g, i) => (
                <figure key={`${g.src}-${i}`} className={`group ${i === 0 ? "md:col-span-2" : ""}`} data-reveal>
                  <div className={`img-zoom relative overflow-hidden rounded-[1.3rem] bg-chocolate ${i === 0 ? "aspect-[16/8]" : "aspect-[4/3]"}`}>
                    <Image src={g.src} alt={g.alt} fill sizes={i === 0 ? "100vw" : "(min-width: 768px) 50vw, 100vw"} className="object-cover" />
                    {g.temporary && <TempImageTag />}
                  </div>
                  {g.room && <figcaption className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-chocolate/70">{g.room}</figcaption>}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Before & after */}
      {project.beforeAfter.length > 0 && (
        <section aria-labelledby="ba-title" className="py-14 sm:py-20 lg:py-28">
          <div className="container-lux max-w-5xl">
            <p className="eyebrow">Transformation</p>
            <h2 id="ba-title" className="mt-4 text-4xl text-espresso sm:text-5xl">
              Before &amp; after.
            </h2>
            <div className="mt-12 space-y-12">
              {project.beforeAfter.map((ba, i) => (
                <BeforeAfter key={i} {...ba} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8–9. Walkthrough video + testimonial */}
      <section aria-labelledby="film-title" className="py-14 sm:py-20 lg:py-28">
        <div className="container-lux grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
          <div data-reveal>
            <p className="eyebrow">Walkthrough</p>
            <h2 id="film-title" className="mt-4 text-4xl text-espresso sm:text-5xl">
              See it in motion.
            </h2>
            <div className="mt-10">
              {hasWalkthrough ? (
                <VideoCard
                  size="featured"
                  video={{
                    id: `${project.slug}-walkthrough`,
                    title: `${project.label} walkthrough`,
                    subtitle: project.name,
                    category: "progress",
                    platform: "youtube",
                    url: project.walkthroughVideoUrl,
                    orientation: "landscape",
                  }}
                />
              ) : (
                <div className="relative grid min-h-[19rem] place-items-center overflow-hidden rounded-[1.3rem] bg-espresso py-10 text-center text-cream sm:aspect-[16/10] sm:min-h-0">
                  <Image src={project.cover.src} alt="" fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover opacity-30 blur-[2px]" />
                  <div className="relative px-6">
                    <Film className="mx-auto size-8 text-gold" strokeWidth={1.3} />
                    <p className="mt-4 font-display text-3xl">Walkthrough film coming soon</p>
                    <p className="mt-2 text-sm text-cream/65">Follow Sanjay&apos;s channels for site videos in the meantime.</p>
                    <Link href="/videos" className="btn btn-outline-light btn-sm mt-6">
                      Browse videos
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
          {testimonial && (
            <div data-reveal>
              <p className="eyebrow">Client Story</p>
              <h2 className="mt-4 text-4xl text-espresso sm:text-5xl">In their words.</h2>
              <div className="mt-10">
                <TestimonialCard t={testimonial} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 10. Related */}
      {related.length > 0 && (
        <section aria-labelledby="related-title" className="bg-ivory py-14 sm:py-20 lg:py-28">
          <div className="container-lux">
            <p className="eyebrow">More Projects</p>
            <h2 id="related-title" className="mt-4 text-4xl text-espresso sm:text-5xl">
              Explore another home.
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {related.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 11. CTA */}
      <CtaBanner title="Imagine your home here." text="Let's discuss your vision and create a space that feels uniquely yours." source={`project-${project.slug}`} />
    </>
  );
}
