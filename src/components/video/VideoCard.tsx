"use client";

import Image from "@/components/ui/Image";
import { useState } from "react";
import type { Video } from "@/content/types";
import { InstagramIcon, PlayIcon, YouTubeIcon } from "@/components/ui/Icons";
import { TempImageTag } from "@/components/ui/DevNote";
import { driveEmbed, instagramEmbed, isInstagramUrl, youtubeId, youtubeThumb } from "@/lib/youtube";
import { VideoLightbox } from "./VideoLightbox";

const platformLabel = { youtube: "YouTube Shorts", instagram: "Instagram Reels" } as const;

/**
 * Creator video card.
 *  - YouTube URL  → plays in a lightbox (player loads on click only)
 *  - Instagram Reel/post URL → plays in Instagram's own embed player (streams from Instagram)
 *  - empty URL    → "Coming soon" (never shown as playable)
 */
export function VideoCard({
  video,
  size = "tile",
  sizes = "(min-width: 1024px) 18vw, 45vw",
  className = "",
}: {
  video: Video;
  size?: "featured" | "tile";
  sizes?: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  // The link decides how it plays, so a mismatched `platform` value can't break a card.
  const yt = youtubeId(video.url);
  const drive = !yt ? driveEmbed(video.url) : null;
  const ig = !yt && !drive ? instagramEmbed(video.url) : null;
  const igProfile = !yt && !drive && !ig && isInstagramUrl(video.url) ? video.url : null; // e.g. a profile link — opens Instagram
  const platform = yt ? "youtube" : ig || igProfile ? "instagram" : video.platform;
  const live = !!(yt || drive || ig || igProfile);
  const thumb = video.thumbnail?.src || (yt ? youtubeThumb(yt) : "");
  const featured = size === "featured";
  // A video kept on Google Drive still shows its Instagram/YouTube label (set `platform` in videos.ts).
  const label = platform === "youtube" && video.orientation === "landscape" ? "YouTube" : platform === "instagram" && video.orientation === "landscape" ? "Instagram" : platformLabel[platform];
  const PlatformIcon = platform === "youtube" ? YouTubeIcon : InstagramIcon;

  const body = (
    <>
      {thumb ? (
        <Image
          src={thumb}
          alt={video.thumbnail?.alt || ""}
          fill
          sizes={featured ? "(min-width: 1024px) 45vw, 100vw" : sizes}
          className={`object-cover transition-transform duration-[1.1s] ease-[var(--ease-lux)] group-hover:scale-[1.05] ${live ? "" : "saturate-[0.7]"}`}
          style={{ objectPosition: video.thumbnail?.position || "50% 50%" }}
        />
      ) : (
        <div className="absolute inset-0 bg-chocolate" />
      )}
      {video.thumbnail?.temporary && <TempImageTag />}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(25_22_19/0.15)_0%,rgb(25_22_19/0.1)_40%,rgb(25_22_19/0.88)_100%)]" />

      <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1 text-[0.65rem] font-medium tracking-wide text-cream backdrop-blur-md">
        <PlatformIcon className="size-3.5" /> {label}
      </span>

      {live ? (
        <span
          className={`absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-cream/95 text-espresso shadow-xl transition-transform duration-500 group-hover:scale-110 ${
            featured ? "size-16" : "size-12"
          }`}
          aria-hidden="true"
        >
          <PlayIcon className={featured ? "ml-1 size-6" : "ml-0.5 size-5"} />
        </span>
      ) : (
        <span
          className={`absolute whitespace-nowrap rounded-full border border-cream/30 bg-black/35 font-semibold uppercase text-cream/90 backdrop-blur-md ${
            featured
              ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 text-[0.65rem] tracking-[0.18em]"
              : "left-3 top-11 px-2.5 py-1 text-[0.58rem] tracking-[0.14em] sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:px-3 sm:py-1.5 sm:text-[0.65rem] sm:tracking-[0.18em]"
          }`}
        >
          Coming soon
        </span>
      )}

      <span className={`absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 ${featured ? "p-6" : "p-4"}`}>
        <span className="text-left">
          <span className={`block font-semibold leading-tight text-cream ${featured ? "text-lg" : "text-[0.9rem]"}`}>{video.title}</span>
          <span className="mt-1 block text-xs text-cream/70">{video.subtitle}</span>
        </span>
      </span>
    </>
  );

  const shape = `group relative block w-full overflow-hidden rounded-[1.1rem] bg-chocolate text-left ${
    featured ? "aspect-[4/3] sm:aspect-[16/10]" : "aspect-[3/4]"
  } ${className}`;

  if (yt || drive || ig)
    return (
      <>
        <button type="button" className={shape} onClick={() => setPlaying(true)} aria-label={`Play video: ${video.title}`} aria-haspopup="dialog">
          {body}
        </button>
        {playing && (
          <VideoLightbox
            youtubeId={yt ?? undefined}
            drive={drive ?? undefined}
            instagram={ig ?? undefined}
            title={video.title}
            orientation={video.orientation}
            onClose={() => setPlaying(false)}
          />
        )}
      </>
    );

  if (igProfile)
    return (
      <a href={igProfile} target="_blank" rel="noopener noreferrer" className={shape} aria-label={`Watch on Instagram: ${video.title} (opens in a new tab)`}>
        {body}
      </a>
    );

  return (
    <div className={shape} aria-label={`${video.title} — video coming soon`} role="img">
      {body}
    </div>
  );
}
