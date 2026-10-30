"use client";

import { useMemo, useState } from "react";
import type { Video, VideoCategory } from "@/content/types";
import { videoCategories } from "@/content/videos";
import { VideoCard } from "./VideoCard";

export function VideoGallery({ videos }: { videos: Video[] }) {
  const cats = useMemo(() => Array.from(new Set(videos.map((v) => v.category))), [videos]);
  const [active, setActive] = useState<VideoCategory | "all">("all");
  const shown = active === "all" ? videos : videos.filter((v) => v.category === active);

  if (videos.length === 0) {
    return <p className="rounded-2xl bg-ivory p-10 text-center text-muted">New videos are on their way — check back soon.</p>;
  }

  return (
    <div>
      <div role="group" aria-label="Filter videos" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:px-0">
        {(["all", ...cats] as const).map((c) => {
          const on = active === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              aria-pressed={on}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                on ? "border-espresso bg-espresso text-cream" : "border-chocolate/15 text-chocolate hover:border-gold"
              }`}
            >
              {c === "all" ? "All" : videoCategories[c]}
            </button>
          );
        })}
      </div>
      <ul className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4" aria-live="polite">
        {shown.map((v) => (
          <li key={v.id}>
            <VideoCard video={v} sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 45vw" />
          </li>
        ))}
      </ul>
    </div>
  );
}
