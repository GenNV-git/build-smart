"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { youtubeEmbedUrl } from "@/lib/youtube";

/** Loads the official YouTube player (privacy-enhanced domain) only when a visitor asks to play. */
export function VideoLightbox({
  youtubeId,
  title,
  orientation,
  onClose,
}: {
  youtubeId: string;
  title: string;
  orientation: "portrait" | "landscape";
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    d?.showModal();
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  const portrait = orientation === "portrait";
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
          <button
            type="button"
            onClick={() => ref.current?.close()}
            className="grid size-10 shrink-0 place-items-center rounded-full bg-cream/10 text-cream transition hover:bg-cream/20"
            aria-label="Close video"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className={`overflow-hidden rounded-2xl bg-black shadow-2xl ${portrait ? "aspect-[9/16]" : "aspect-video"}`}>
          <iframe
            src={youtubeEmbedUrl(youtubeId)}
            title={title}
            className="size-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <p className="mt-3 text-center text-xs text-cream/60">
          Video not loading?{" "}
          <a href={`https://www.youtube.com/watch?v=${youtubeId}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-gold">
            Watch on YouTube
          </a>
        </p>
      </div>
    </dialog>
  );
}
