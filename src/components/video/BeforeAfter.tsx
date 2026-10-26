"use client";

import Image from "@/components/ui/Image";
import { useId, useState } from "react";
import type { ImageAsset } from "@/content/types";

/** Accessible before/after comparison slider (keyboard: arrow keys on the range input). */
export function BeforeAfter({ before, after, caption }: { before: ImageAsset; after: ImageAsset; caption?: string }) {
  const [pos, setPos] = useState(50);
  const id = useId();
  return (
    <figure>
      <div className="relative aspect-[16/10] select-none overflow-hidden rounded-[1.4rem] bg-chocolate">
        <Image src={after.src} alt={after.alt} fill sizes="(min-width: 1024px) 70vw, 100vw" className="object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image src={before.src} alt={before.alt} fill sizes="(min-width: 1024px) 70vw, 100vw" className="object-cover" />
        </div>
        <span className="absolute inset-y-0 w-0.5 bg-cream shadow" style={{ left: `${pos}%` }} aria-hidden="true">
          <span className="absolute left-1/2 top-1/2 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-cream text-xs font-bold text-espresso shadow-lg">
            ⇆
          </span>
        </span>
        <span className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-cream">Before</span>
        <span className="absolute right-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-cream">After</span>
        <label htmlFor={id} className="sr-only">
          Drag to compare before and after
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          className="absolute inset-0 size-full cursor-ew-resize opacity-0"
        />
      </div>
      {caption && <figcaption className="mt-3 text-sm text-muted">{caption}</figcaption>}
    </figure>
  );
}
