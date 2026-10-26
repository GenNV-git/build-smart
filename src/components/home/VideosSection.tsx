import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VideoCard } from "@/components/video/VideoCard";
import { featuredVideo, videos } from "@/content/videos";
import { isSet, site } from "@/content/site";
import { InstagramIcon } from "@/components/ui/Icons";

export function VideosSection() {
  const rest = videos.filter((v) => v.id !== featuredVideo.id).slice(0, 3);
  const more = videos.length - 1 - rest.length;
  return (
    <section id="videos" aria-labelledby="videos-title" className="bg-ivory py-16 sm:py-24 lg:py-28">
      <div className="container-lux">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <SectionHeading
            id="videos-title"
            eyebrow="Videos & Reels"
            title="Beyond the Blueprint."
            intro={<p className="font-display text-[1.45rem] leading-snug text-chocolate sm:text-2xl">On site, in the details, and behind the scenes.</p>}
          />
          <div className="lg:justify-self-end lg:pb-2" data-reveal>
            <p className="max-w-sm text-[0.95rem] leading-relaxed text-muted">
              Follow Sanjay&apos;s journey as he shares real site updates, design ideas, construction insights and the people behind
              every project.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link href="/videos" className="btn btn-outline-dark btn-sm w-full sm:w-auto">
                Watch More Videos{more > 0 ? ` (${more}+)` : ""} <ArrowRight className="arrow size-4" />
              </Link>
              {isSet(site.founderSocial.instagram) && (
                <a
                  href={site.founderSocial.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-chocolate transition-colors hover:text-gold-deep"
                >
                  <InstagramIcon className="size-4" /> {site.founderSocial.instagramHandle}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-5 lg:grid-cols-[1.9fr_3fr]">
          <div data-reveal>
            <VideoCard video={featuredVideo} size="featured" className="lg:aspect-auto lg:h-full" />
          </div>
          {/* Phones: swipe sideways through the reels. Desktop: three in a row. */}
          <ul className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 md:-mx-8 md:scroll-px-8 md:px-8 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-0">
            {rest.map((v, i) => (
              <li key={v.id} className="w-[44%] shrink-0 snap-start min-[480px]:w-[34%] lg:w-auto" data-reveal style={{ ["--reveal-delay" as string]: `${(i + 1) * 80}ms` }}>
                <VideoCard video={v} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
