"use client";

import { useState } from "react";
import { PlayIcon } from "@/components/ui/Icons";
import { VideoLightbox } from "@/components/video/VideoLightbox";
import { youtubeId } from "@/lib/youtube";

/** "Watch My Story" — renders nothing until a real YouTube URL is configured in founder.ts. */
export function StoryButton({ url }: { url: string }) {
  const [open, setOpen] = useState(false);
  const id = youtubeId(url);
  if (!id) return null;
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="group inline-flex items-center gap-3 text-sm font-semibold text-cream">
        <span className="grid size-12 place-items-center rounded-full border border-cream/30 bg-cream/5 transition group-hover:border-gold group-hover:text-gold">
          <PlayIcon className="ml-0.5 size-4" />
        </span>
        Watch My Story
      </button>
      {open && <VideoLightbox youtubeId={id} title="Sanjay's story" orientation="landscape" onClose={() => setOpen(false)} />}
    </>
  );
}
