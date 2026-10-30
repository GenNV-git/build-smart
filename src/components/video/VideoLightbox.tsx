"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, X } from "lucide-react";
import { youtubeEmbedUrl } from "@/lib/youtube";
import { InstagramIcon } from "@/components/ui/Icons";

/**
 * Plays a video on the page, loading the official player only when a visitor asks to play:
 *  - YouTube: privacy-enhanced youtube-nocookie.com player
 *  - Google Drive: Drive's own player (video streams from Drive; nothing stored here)
 *  - Instagram: Instagram's own embed player — note Instagram refuses to play reels with licensed music
 *    outside its app and shows only "Watch on Instagram"; use YouTube or Drive for those.
 */
export function VideoLightbox({
  youtubeId,
  drive,
  instagram,
  title,
  orientation,
  onClose,
}: {
  youtubeId?: string;
  drive?: { embedUrl: string; viewUrl: string };
  instagram?: { embedUrl: string; postUrl: string };
  title: string;
  orientation: "portrait" | "landscape";
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [igHeight, setIgHeight] = useState(680);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const d = ref.current;
    d?.showModal();
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  // Instagram's player reports its real height; size the frame to fit it exactly.
  useEffect(() => {
    if (!instagram) return;
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== "https://www.instagram.com") return;
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        const h = Number(data?.details?.height);
        if (data?.type === "MEASURE" && h > 100 && h < 3000) setIgHeight(Math.ceil(h));
      } catch {
        /* not a measure message */
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [instagram]);

  const portrait = orientation === "portrait";
  const closeButton = (
    <button
      type="button"
      onClick={() => ref.current?.close()}
      className="grid size-11 shrink-0 place-items-center rounded-full bg-cream/10 text-cream transition hover:bg-cream/20"
      aria-label="Close video"
    >
      <X className="size-5" />
    </button>
  );

  if (instagram) {
    return (
      <dialog
        ref={ref}
        className="consult-dialog m-auto max-h-[calc(100dvh-1rem)] w-[min(25rem,calc(100vw-1.5rem))] max-w-none overflow-y-auto overscroll-contain bg-transparent p-0"
        aria-label={title}
        onClose={onClose}
        onClick={(e) => e.target === ref.current && ref.current?.close()}
      >
        <div className="sticky top-0 z-10 mb-2 flex items-center justify-between gap-4 text-cream">
          <p className="truncate text-sm font-medium">{title}</p>
          {closeButton}
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl">
          {!loaded && (
            <div className="absolute inset-0 grid place-items-center text-chocolate/60" aria-hidden="true">
              <Loader2 className="size-7 animate-spin" />
            </div>
          )}
          <iframe
            src={instagram.embedUrl}
            title={title}
            className="relative block w-full border-0"
            style={{ height: igHeight }}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
            scrolling="no"
            onLoad={() => setLoaded(true)}
          />
        </div>
        <p className="mt-3 pb-1 text-center text-xs text-cream/70">
          Video not playing?{" "}
          <a href={instagram.postUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline hover:text-gold">
            <InstagramIcon className="size-3.5" /> Watch on Instagram
          </a>
        </p>
      </dialog>
    );
  }

  if (!youtubeId && !drive) return null;
  const src = youtubeId ? youtubeEmbedUrl(youtubeId) : drive!.embedUrl;
  const fallback = youtubeId
    ? { href: `https://www.youtube.com/watch?v=${youtubeId}`, label: "Watch on YouTube" }
    : { href: drive!.viewUrl, label: "Open the video" };
  return (
    <dialog
      ref={ref}
      className="consult-dialog m-auto overflow-visible bg-transparent p-0"
      aria-label={title}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current?.close()}
    >
      <div className={portrait ? "w-[min(24rem,calc(100vw-2rem),calc((100dvh-6rem)*9/16))]" : "w-[min(64rem,calc(100vw-2rem),calc((100dvh-6rem)*16/9))]"}>
        <div className="mb-3 flex items-center justify-between gap-4 text-cream">
          <p className="truncate text-sm font-medium">{title}</p>
          {closeButton}
        </div>
        <div className={`overflow-hidden rounded-2xl bg-black shadow-2xl ${portrait ? "aspect-[9/16]" : "aspect-video"}`}>
          <iframe
            src={src}
            title={title}
            className="size-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <p className="mt-3 text-center text-xs text-cream/60">
          Video not loading?{" "}
          <a href={fallback.href} target="_blank" rel="noopener noreferrer" className="underline hover:text-gold">
            {fallback.label}
          </a>
        </p>
      </div>
    </dialog>
  );
}
