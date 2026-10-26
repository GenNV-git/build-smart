import type { Metadata } from "next";
import Image from "@/components/ui/Image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { founder, journeyPhotoDetails, milestones } from "@/content/founder";
import { journeyPhotosFor } from "@/lib/journey-photos";
import { videos } from "@/content/videos";
import { isSet, site } from "@/content/site";
import { ConsultButton } from "@/components/forms/ConsultButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DevNote } from "@/components/ui/DevNote";
import { serviceIcons } from "@/components/ui/Icons";
import { JourneyTimeline } from "@/components/about/JourneyTimeline";
import { StoryButton } from "@/components/about/StoryButton";
import { VideoCard } from "@/components/video/VideoCard";
import { FollowSanjay } from "@/components/layout/FollowSanjay";
import { CtaBanner } from "@/components/layout/CtaBanner";

export const metadata: Metadata = {
  title: "About Sanjay",
  description: `Meet ${founder.name}, the construction professional and creator behind Build Smart — his journey, values and vision for every home.`,
  alternates: { canonical: "/about" },
  openGraph: { title: "About Sanjay | Build Smart", url: "/about" },
};

export default function AboutPage() {
  const gallery = videos.slice(0, 4);
  return (
    <>
      {/* Founder introduction */}
      <section aria-labelledby="about-hero-title" className="relative isolate overflow-hidden bg-espresso pb-24 pt-32 text-cream sm:pt-40">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_80%_20%,rgb(74_43_28/0.9),transparent),radial-gradient(40%_50%_at_0%_100%,rgb(74_43_28/0.6),transparent)]" />
        <div className="container-lux grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="relative mx-auto w-full max-w-[19rem] sm:max-w-md lg:mx-0" data-reveal>
            <div className="absolute -inset-3 rounded-[2rem] border border-gold/25" aria-hidden="true" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] bg-chocolate">
              {founder.portrait ? (
                <Image src={founder.portrait.src} alt={founder.portrait.alt} fill priority sizes="(min-width: 1024px) 34vw, 90vw" className="object-cover" />
              ) : (
                <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_35%,#5a3826,#2c1c12)]">
                  <Image src="/images/brand/logo-mark.png" alt="" width={190} height={131} className="opacity-90" />
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 pt-20">
                <p className="font-display text-3xl text-cream">{founder.name}</p>
                <p className="text-xs uppercase tracking-[0.22em] text-gold-soft">{founder.role}</p>
              </div>
            </div>
            {!founder.portrait && <DevNote className="mt-4">Add Sanjay&apos;s portrait in src/content/founder.ts (portrait)</DevNote>}
          </div>

          <div>
            <p className="eyebrow eyebrow-light" data-reveal>About Sanjay</p>
            <h1 id="about-hero-title" className="mt-5 text-[2.9rem] leading-[1.02] sm:text-6xl xl:text-7xl" data-reveal>
              Built on Experience. <span className="block text-gold">Driven by Vision.</span>
            </h1>
            <div className="mt-7 max-w-xl space-y-4 text-[1.02rem] leading-relaxed text-cream/75" data-reveal>
              {founder.intro.map((p) => (
                <p key={p.slice(0, 20)}>{p}</p>
              ))}
              {isSet(founder.background) && <p>{founder.background}</p>}
            </div>
            {!isSet(founder.background) && (
              <DevNote className="mt-4">Add Sanjay&apos;s professional background in src/content/founder.ts (background)</DevNote>
            )}
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4" data-reveal>
              <ConsultButton source="about-hero" className="btn btn-gold w-full sm:w-auto">Discuss Your Project</ConsultButton>
              <StoryButton url={founder.storyVideoUrl} />
            </div>
            <FollowSanjay className="mt-9" tone="dark" />
          </div>
        </div>
      </section>

      {/* Approach & values */}
      <section aria-labelledby="approach-title" className="py-16 sm:py-24 lg:py-28">
        <div className="container-lux grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <SectionHeading id="approach-title" eyebrow="His Approach" title="Discipline you can't see." accent="Warmth you can feel." />
            <p className="mt-6 max-w-lg text-[0.98rem] leading-relaxed text-muted" data-reveal>
              {founder.approach}
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:gap-5">
            {founder.values.map((v, i) => (
              <li key={v.title} className="card-lux card-lift p-4 min-[400px]:p-5 sm:p-7" data-reveal style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}>
                <span className="font-display text-2xl text-gold-deep">0{i + 1}</span>
                <h3 className="mt-2 font-sans text-[0.95rem] font-bold text-espresso sm:mt-3 sm:text-lg">{v.title}</h3>
                <p className="mt-1.5 text-[0.8rem] leading-relaxed text-muted sm:mt-2 sm:text-sm">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Vision */}
      <section aria-label="Vision for Build Smart" className="bg-sand py-14 sm:py-20 lg:py-24">
        <figure className="container-lux max-w-4xl text-center" data-reveal>
          <p className="eyebrow justify-center">The Vision</p>
          <blockquote className="mt-6 font-display text-[1.9rem] leading-snug text-espresso sm:text-[2.6rem]">
            &ldquo;{founder.vision}&rdquo;
          </blockquote>
          <figcaption className="mt-6 text-sm font-semibold tracking-wide text-chocolate">
            {founder.name} <span className="font-normal text-muted">— {founder.role}</span>
          </figcaption>
        </figure>
      </section>

      {/* Journey */}
      <section id="journey" aria-labelledby="journey-title" className="py-16 sm:py-24 lg:py-32">
        <div className="container-lux">
          <SectionHeading
            id="journey-title"
            eyebrow="Sanjay's Journey"
            title="The Road to Build Smart."
            intro="Every site, every client and every lesson along the way shaped how Build Smart works today."
            align="center"
            className="mb-16 lg:mb-24"
          />
          {milestones.some((m) => m.placeholder) && (
            <div className="-mt-10 mb-12 text-center lg:-mt-16">
              <DevNote>Fill in the career milestones (period, company, role, story) in src/content/founder.ts — photos: add milestone-02-a.jpg etc. to public/images/journey/</DevNote>
            </div>
          )}
          <JourneyTimeline milestones={milestones} photosById={journeyPhotosFor(milestones, journeyPhotoDetails)} />
        </div>
      </section>

      {/* Beyond the site */}
      <section aria-labelledby="beyond-title" className="bg-ivory py-16 sm:py-24 lg:py-28">
        <div className="container-lux">
          <SectionHeading id="beyond-title" eyebrow="Beyond the Site" title="More than a builder." accent="A voice for good building." />
          <ul className="mt-10 grid gap-3 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {founder.beyondTheSite.map((c, i) => {
              const Icon = serviceIcons[c.icon];
              return (
                <li key={c.title} className="card-lux card-lift flex gap-4 p-5 sm:block sm:p-7" data-reveal style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}>
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-gold/15 text-chocolate">
                    <Icon className="size-5" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-sans text-[1.02rem] font-bold text-espresso sm:mt-6">{c.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted sm:mt-2">{c.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-16 flex flex-wrap items-end justify-between gap-6 sm:mt-24">
            <SectionHeading eyebrow="On Camera" title="Watch Sanjay at work." />
            <Link href="/videos" className="btn btn-outline-dark btn-sm" data-reveal>
              All Videos <ArrowRight className="arrow size-4" />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {gallery.map((v, i) => (
              <div key={v.id} data-reveal style={{ ["--reveal-delay" as string]: `${i * 70}ms` }}>
                <VideoCard video={{ ...v, orientation: "portrait" }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        eyebrow={`Work with ${site.founder.name}`}
        title="Let's talk about your home."
        text="Tell us what you're planning — a new build, an interior or a single room — and we'll take it from there."
        source="about-cta"
      />
    </>
  );
}
