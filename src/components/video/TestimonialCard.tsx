"use client";

import Image from "@/components/ui/Image";
import Link from "next/link";
import { useState } from "react";
import { Star } from "lucide-react";
import type { Testimonial } from "@/content/types";
import { getProject } from "@/content/projects";
import { PlayIcon } from "@/components/ui/Icons";
import { TempImageTag } from "@/components/ui/DevNote";
import { youtubeId, youtubeThumb } from "@/lib/youtube";
import { VideoLightbox } from "./VideoLightbox";

export function TestimonialCard({ t }: { t: Testimonial }) {
  const [playing, setPlaying] = useState(false);
  const yt = youtubeId(t.videoUrl);
  const thumb = t.thumbnail?.src || (yt ? youtubeThumb(yt) : "");
  const project = t.projectSlug ? getProject(t.projectSlug) : undefined;
  const title = `${t.clientLabel}${project ? ` — ${project.name}` : ""} testimonial`;

  const media = (
    <>
      {thumb && <Image src={thumb} alt="" fill sizes="(min-width: 1024px) 14rem, 40vw" className={`object-cover ${yt ? "" : "saturate-[0.65]"}`} />}
      {t.thumbnail?.temporary && <TempImageTag />}
      <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/10" />
      {yt ? (
        <span className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-cream/95 text-espresso shadow-lg transition-transform duration-500 group-hover:scale-110">
          <PlayIcon className="ml-0.5 size-5" />
        </span>
      ) : (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-cream/30 bg-black/40 px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-cream backdrop-blur-md">
          Video soon
        </span>
      )}
      {t.duration && yt && (
        <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[0.65rem] font-medium text-cream">{t.duration}</span>
      )}
    </>
  );

  return (
    <article className="card-lux card-lift flex h-full flex-col gap-4 p-4 sm:flex-row sm:gap-5 sm:p-5" data-reveal>
      {yt ? (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl bg-chocolate sm:aspect-[4/5] sm:w-44"
          aria-label={`Play ${title}`}
        >
          {media}
        </button>
      ) : (
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl bg-chocolate sm:aspect-[4/5] sm:w-44">{media}</div>
      )}

      <div className="flex flex-1 flex-col py-1">
        <span className="font-display text-5xl leading-[0.6] text-gold" aria-hidden="true">
          &ldquo;
        </span>
        {t.quote ? (
          <blockquote className="mt-2 text-[0.95rem] leading-relaxed text-ink">{t.quote}</blockquote>
        ) : (
          <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">
            {yt ? "Hear about the experience, in the homeowner's own words." : "This homeowner's story will be shared here soon."}
          </p>
        )}
        {typeof t.rating === "number" && (
          <p className="mt-4 flex gap-0.5 text-gold" aria-label={`Rated ${t.rating} out of 5`}>
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className="size-4" fill={i < Math.round(t.rating!) ? "currentColor" : "none"} strokeWidth={1.5} />
            ))}
          </p>
        )}
        <div className="mt-auto pt-5">
          <p className="text-sm font-semibold text-espresso">{t.clientLabel}</p>
          {project && (
            <Link href={`/projects/${project.slug}`} className="text-xs text-muted underline-offset-2 hover:text-gold-deep hover:underline">
              {project.name}{project.location ? ` · ${project.location}` : ""}
            </Link>
          )}
        </div>
      </div>

      {playing && yt && <VideoLightbox youtubeId={yt} title={title} orientation="landscape" onClose={() => setPlaying(false)} />}
    </article>
  );
}
