"use client";

import Image from "@/components/ui/Image";
import type { JourneyPhoto, PhotoFrame } from "@/content/types";

type Frame = Exclude<PhotoFrame, "auto">;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const ratioOf = (p: JourneyPhoto) => (p.width && p.height ? p.width / p.height : 1);

/** "auto" frames: arch for a portrait lead photo, a circle for a near-square last photo, otherwise curved corners. */
function frameFor(p: JourneyPhoto, i: number, count: number): Frame {
  if (p.frame && p.frame !== "auto") return p.frame;
  const r = ratioOf(p);
  if (i === 0) return r < 0.92 ? "arch" : "rounded";
  if (count >= 2 && i === count - 1 && r >= 0.85 && r <= 1.18) return "circle";
  return i % 2 ? "rounded" : "square";
}

/** Each frame follows its photo's own shape (within limits), so very little is cropped. */
function aspectFor(frame: Frame, r: number) {
  if (frame === "circle") return 1;
  if (frame === "arch") return clamp(r, 0.62, 0.92);
  return clamp(r, 0.62, 1.6);
}

const shapeClass: Record<Frame, string> = {
  rounded: "rounded-[1.1rem] sm:rounded-[1.4rem]",
  square: "rounded-[0.35rem]",
  circle: "rounded-full",
  arch: "rounded-t-[999px] rounded-b-[1.1rem] sm:rounded-b-[1.4rem]",
};

function Tile({
  photo,
  frame,
  onOpen,
  sizes,
  className = "",
  extra = 0,
  lifted = false,
}: {
  photo: JourneyPhoto;
  frame: Frame;
  onOpen: () => void;
  sizes: string;
  className?: string;
  extra?: number;
  lifted?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      style={{ aspectRatio: aspectFor(frame, ratioOf(photo)) }}
      className={`group relative block overflow-hidden bg-chocolate/80 shadow-[var(--shadow-soft)] transition-shadow duration-500 hover:shadow-[var(--shadow-lift)] focus-visible:outline-offset-4 ${shapeClass[frame]} ${
        lifted ? "ring-[4px] ring-cream sm:ring-[6px]" : ""
      } ${className}`}
      aria-label={extra ? `View all photos (${extra} more): ${photo.alt}` : `View photo: ${photo.alt}`}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-lux)] group-hover:scale-[1.05]"
        style={{ objectPosition: photo.position || "50% 50%" }}
      />
      {extra > 0 && (
        <span className="absolute inset-0 grid place-items-center bg-espresso/65 text-cream backdrop-blur-[2px]">
          <span className="text-center">
            <span className="block font-display text-3xl leading-none">+{extra}</span>
            <span className="mt-1 block text-[0.6rem] font-semibold uppercase tracking-[0.18em]">more</span>
          </span>
        </span>
      )}
    </button>
  );
}

/**
 * Editorial photo collage for one journey chapter.
 *  1 photo  → one large frame with a gold outline
 *  2 photos → overlapping pair
 *  3 photos → one tall frame + two stacked
 *  4+       → staggered two-column gallery (max `max` shown, the rest behind a "+N")
 */
export function PhotoCollage({
  photos,
  onOpen,
  max = 6,
  compact = false,
}: {
  photos: JourneyPhoto[];
  onOpen: (index: number) => void;
  max?: number;
  /** Smaller sizes hints for phones. */
  compact?: boolean;
}) {
  const count = photos.length;
  if (count === 0) return null;
  const shown = photos.slice(0, Math.min(count, max));
  const hidden = count - shown.length;
  const frames = shown.map((p, i) => frameFor(p, i, shown.length));
  const big = compact ? "80vw" : "(min-width: 1024px) 30vw, 80vw";
  const small = compact ? "45vw" : "(min-width: 1024px) 16vw, 45vw";

  const tile = (i: number, opts: { sizes: string; className?: string; lifted?: boolean }) => (
    <Tile
      key={shown[i].src}
      photo={shown[i]}
      frame={frames[i]}
      onOpen={() => onOpen(i)}
      sizes={opts.sizes}
      className={`${frames[i] === "circle" ? "mx-auto w-[88%]" : "w-full"} ${opts.className ?? ""}`}
      lifted={opts.lifted}
      extra={i === shown.length - 1 ? hidden : 0}
    />
  );

  // 1 photo
  if (shown.length === 1) {
    const f = frames[0];
    const portrait = ratioOf(shown[0]) < 0.95 || f === "arch" || f === "circle";
    return (
      <div className={`relative mx-auto ${portrait ? "w-[78%]" : "w-[94%]"}`}>
        <span
          className={`absolute inset-0 translate-x-2.5 translate-y-2.5 border border-gold/55 sm:translate-x-3.5 sm:translate-y-3.5 ${shapeClass[f]}`}
          aria-hidden="true"
        />
        <Tile photo={shown[0]} frame={f} onOpen={() => onOpen(0)} sizes={big} className="relative w-full" extra={hidden} />
      </div>
    );
  }

  // 2 photos — overlapping pair
  if (shown.length === 2) {
    return (
      <div className="relative flex items-start pb-1">
        <div className="relative z-0 w-[60%]">{tile(0, { sizes: big })}</div>
        <div className="relative z-10 -ml-[9%] mt-[26%] w-[49%]">{tile(1, { sizes: small, lifted: true })}</div>
        <span className="absolute -left-2 bottom-[8%] hidden size-3 rounded-full bg-gold/70 sm:block" aria-hidden="true" />
      </div>
    );
  }

  // 3 photos — tall + two stacked
  if (shown.length === 3) {
    return (
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="w-[56%]">{tile(0, { sizes: big })}</div>
        <div className="mt-[12%] flex w-[44%] flex-col gap-3 sm:gap-4">
          {tile(1, { sizes: small })}
          {tile(2, { sizes: small })}
        </div>
      </div>
    );
  }

  // 4+ — staggered two columns
  const colA = shown.map((_, i) => i).filter((i) => i % 2 === 0);
  const colB = shown.map((_, i) => i).filter((i) => i % 2 === 1);
  return (
    <div className="flex items-start gap-3 sm:gap-4">
      <div className="flex w-1/2 flex-col gap-3 sm:gap-4">{colA.map((i) => tile(i, { sizes: small }))}</div>
      <div className="mt-[14%] flex w-1/2 flex-col gap-3 sm:gap-4">{colB.map((i) => tile(i, { sizes: small }))}</div>
    </div>
  );
}
