import Image from "@/components/ui/Image";
import Link from "next/link";
import { ConsultButton } from "@/components/forms/ConsultButton";
import { ConsultationForm } from "@/components/forms/ConsultationForm";
import { PlayIcon } from "@/components/ui/Icons";
import { site } from "@/content/site";
import { projects } from "@/content/projects";
import { images } from "@/content/images";

export function Hero() {
  const thumbs = [projects[0]?.cover, projects[1]?.cover, images.aboutCollageLarge, images.aboutCollageSmall].filter(Boolean) as {
    src: string;
    alt: string;
  }[];

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-espresso pb-28 pt-28 text-cream sm:pb-32 sm:pt-36 lg:pb-40 lg:pt-40">
      <Image src={images.homeHero.src} alt={images.homeHero.alt} fill priority sizes="100vw" className="-z-20 object-cover object-[62%_center]" />
      {/* Phones: darker from the bottom for readability. Desktop: darker from the left. */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(25_22_19/0.55)_0%,rgb(36_23_15/0.7)_45%,rgb(36_23_15/0.96)_100%)] lg:bg-[linear-gradient(95deg,rgb(25_22_19/0.92)_0%,rgb(36_23_15/0.78)_38%,rgb(36_23_15/0.35)_70%,rgb(36_23_15/0.25)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 hidden h-40 bg-gradient-to-b from-transparent to-espresso/70 lg:block" />

      <div className="container-lux grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div className="flex min-h-[calc(100svh-11rem)] flex-col justify-end sm:min-h-0 sm:block">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-gold-soft sm:text-[0.7rem] sm:tracking-[0.26em]" data-reveal>
            {site.descriptor}
          </p>
          <h1
            id="hero-title"
            className="mt-4 text-[2.75rem] leading-[0.98] min-[400px]:text-[3.1rem] sm:mt-6 sm:text-7xl xl:text-[5.4rem]"
            data-reveal
            style={{ ["--reveal-delay" as string]: "80ms" }}
          >
            Designing Spaces for a <span className="text-gold">Better Tomorrow.</span>
          </h1>
          <p
            className="mt-5 max-w-lg text-[0.98rem] leading-relaxed text-cream/80 sm:mt-7 sm:text-[1.05rem]"
            data-reveal
            style={{ ["--reveal-delay" as string]: "160ms" }}
          >
            We design and build beautiful, functional spaces that reflect your lifestyle. From concept to completion, we bring your
            vision to life.
          </p>

          <div
            className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-4"
            data-reveal
            style={{ ["--reveal-delay" as string]: "240ms" }}
          >
            <ConsultButton source="hero" className="btn btn-gold w-full sm:w-auto" />
            <Link
              href="/#videos"
              className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-cream/20 text-sm font-semibold text-cream sm:justify-start sm:border-0"
            >
              <span className="grid size-9 place-items-center rounded-full border border-cream/30 bg-cream/5 backdrop-blur transition group-hover:border-gold group-hover:text-gold sm:size-12">
                <PlayIcon className="ml-0.5 size-3.5 sm:size-4" />
              </span>
              Watch Our Work
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-4 sm:mt-12" data-reveal style={{ ["--reveal-delay" as string]: "320ms" }}>
            <div className="flex -space-x-3">
              {thumbs.map((t, i) => (
                <span key={i} className="relative size-10 overflow-hidden rounded-full border-2 border-gold/60 bg-chocolate sm:size-12">
                  <Image src={t.src} alt="" fill sizes="48px" className="object-cover" />
                </span>
              ))}
            </div>
            <p className="text-sm leading-snug">
              <span className="block font-semibold text-cream">{site.stats.completedProjects} Completed Projects</span>
              <span className="text-cream/60">and many more on the way</span>
            </p>
          </div>
        </div>

        <div className="glass-light rounded-[1.4rem] p-5 text-ink sm:rounded-[1.6rem] sm:p-8" data-reveal style={{ ["--reveal-delay" as string]: "200ms" }} id="consultation">
          <ConsultationForm variant="compact" source="home-hero" />
        </div>
      </div>
    </section>
  );
}
