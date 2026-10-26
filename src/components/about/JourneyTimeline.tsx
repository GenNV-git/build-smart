"use client";

import Image from "@/components/ui/Image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import type { ImageAsset, JourneyPhoto, Milestone } from "@/content/types";
import { PhotoCollage } from "./PhotoCollage";
import { showContentNotes } from "@/lib/dev";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Sanjay's journey.
 *  Desktop: a curved zig-zag gold path (measured from the real milestone positions),
 *           each chapter paired with an arched photo collage.
 *  Mobile:  a vertical line with photo-led cards and swipeable photo strips.
 * The gold line draws itself as the visitor scrolls. Photos open full-screen on tap.
 */
export function JourneyTimeline({ milestones, photosById }: { milestones: Milestone[]; photosById: Record<string, JourneyPhoto[]> }) {
  const listRef = useRef<HTMLOListElement>(null);
  const drawRef = useRef<SVGPathElement>(null);
  const mobileFillRef = useRef<HTMLSpanElement>(null);
  const [geo, setGeo] = useState<{ d: string; w: number; h: number } | null>(null);
  const [viewer, setViewer] = useState<{ photos: ImageAsset[]; index: number; title: string } | null>(null);

  const measure = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    if (window.innerWidth < 1024) {
      setGeo(null);
      return;
    }
    const box = list.getBoundingClientRect();
    const pts = Array.from(list.querySelectorAll<HTMLElement>("[data-node]")).map((n) => {
      const r = n.getBoundingClientRect();
      return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
    });
    if (pts.length < 2) return;
    let d = `M ${pts[0].x} 0 L ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1];
      const b = pts[i];
      const dy = b.y - a.y;
      d += ` C ${a.x} ${a.y + dy * 0.55}, ${b.x} ${b.y - dy * 0.55}, ${b.x} ${b.y}`;
    }
    const last = pts[pts.length - 1];
    d += ` L ${last.x} ${box.height}`;
    setGeo({ d, w: box.width, h: box.height });
  }, []);

  useIsoLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(() => measure());
    if (listRef.current) ro.observe(listRef.current);
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  // Scroll-linked drawing — desktop curve and mobile line.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const path = drawRef.current;
    const len = path ? path.getTotalLength() : 0;
    if (path) path.style.strokeDasharray = `${len}`;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = list.getBoundingClientRect();
      const progress = reduce ? 1 : Math.min(1, Math.max(0, (window.innerHeight * 0.7 - r.top) / r.height));
      if (path) path.style.strokeDashoffset = `${len * (1 - progress)}`;
      if (mobileFillRef.current) mobileFillRef.current.style.transform = `scaleY(${progress})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [geo]);

  return (
    <>
      <ol ref={listRef} className="relative">
        {/* Desktop curve */}
        {geo && (
          <svg
            className="pointer-events-none absolute inset-0 hidden lg:block"
            width={geo.w}
            height={geo.h}
            viewBox={`0 0 ${geo.w} ${geo.h}`}
            fill="none"
            aria-hidden="true"
          >
            <path d={geo.d} stroke="rgb(148 112 47 / 0.22)" strokeWidth="1.5" strokeDasharray="2 7" strokeLinecap="round" />
            <path ref={drawRef} d={geo.d} stroke="url(#journey-gold)" strokeWidth="2" strokeLinecap="round" />
            <defs>
              <linearGradient id="journey-gold" x1="0" y1="0" x2="0" y2={geo.h} gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#ecd5a4" />
                <stop offset="0.5" stopColor="#d6b16d" />
                <stop offset="1" stopColor="#94702f" />
              </linearGradient>
            </defs>
          </svg>
        )}

        {/* Mobile line: faint track + gold fill that grows while scrolling */}
        <span className="absolute bottom-0 left-[1.15rem] top-0 w-px bg-gold/25 lg:hidden" aria-hidden="true" />
        <span
          ref={mobileFillRef}
          className="absolute bottom-0 left-[1.15rem] top-0 w-[2px] -translate-x-[0.5px] origin-top scale-y-0 bg-gradient-to-b from-gold-soft via-gold to-gold-deep lg:hidden"
          aria-hidden="true"
        />

        {milestones.map((m, i) => {
          const left = i % 2 === 0; // card on the left (desktop)
          const num = String(i + 1).padStart(2, "0");
          const photos = photosById[m.id] ?? [];
          const open = (index: number) => setViewer({ photos, index, title: m.title });
          return (
            <li
              key={m.id}
              className="relative grid pb-12 pl-11 last:pb-0 sm:pl-14 lg:grid-cols-[5fr_4fr_5fr] lg:items-center lg:pb-28 lg:pl-0"
            >
              {/* node */}
              <div
                className={`absolute left-0 top-5 lg:static lg:row-start-1 lg:col-start-2 lg:flex ${
                  left ? "lg:justify-start lg:pl-[8%]" : "lg:justify-end lg:pr-[8%]"
                }`}
              >
                <span
                  data-node
                  className="relative grid size-[2.35rem] place-items-center rounded-full border border-gold/60 bg-cream shadow-[0_0_0_6px_rgb(248_243_234)]"
                >
                  <span className="text-[0.62rem] font-bold text-gold-deep">{num}</span>
                </span>
              </div>

              {/* card */}
              <div className={`lg:row-start-1 ${left ? "lg:col-start-1 lg:text-right" : "lg:col-start-3"}`} data-reveal>
                <article className={`card-lux overflow-hidden ${m.placeholder && showContentNotes ? "border-dashed !border-amber-500/60" : ""}`}>
                  {/* Photos inside the card — phones & tablets */}
                  {photos.length > 0 && (
                    <div className="relative bg-sand/60 px-4 pb-5 pt-4 sm:px-6 sm:pt-6 lg:hidden">
                      <PhotoCollage photos={photos} onOpen={open} max={4} compact />
                      {photos.length > 1 && (
                        <span className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-espresso/75 px-2.5 py-1 text-[0.62rem] font-semibold text-cream backdrop-blur">
                          <Images className="size-3" aria-hidden="true" /> {photos.length} photos
                        </span>
                      )}
                    </div>
                  )}
                  <div className="p-5 sm:p-7 lg:p-8">
                    <div className={`flex items-center gap-3 ${left ? "lg:justify-end" : ""}`}>
                      <span className="rounded-full bg-gold/15 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-gold-deep">
                        {m.period || `Chapter ${num}`}
                      </span>
                    </div>
                    <h3 className="mt-3 text-[1.65rem] leading-tight text-espresso sm:text-[1.9rem]">{m.title}</h3>
                    <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-chocolate/70">{m.organisation}</p>
                    <p className="mt-3 text-sm font-medium text-chocolate">{m.role}</p>
                    <p className="mt-2.5 text-[0.94rem] leading-relaxed text-muted">{m.story}</p>
                  </div>
                </article>
              </div>

              {/* Photo collage — desktop */}
              <div
                className={`hidden lg:row-start-1 lg:block ${left ? "lg:col-start-3" : "lg:col-start-1"}`}
                data-reveal
                style={{ ["--reveal-delay" as string]: "140ms" }}
              >
                {photos.length > 0 && (
                  <figure className="mx-auto w-full max-w-[30rem]">
                    <PhotoCollage photos={photos} onOpen={open} />
                    <figcaption className={`mt-5 flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-chocolate/60 ${left ? "justify-start" : "justify-end"}`}>
                      <span className="h-px w-6 bg-gold" aria-hidden="true" />
                      {m.period || `Chapter ${num}`}
                      {photos.length > 1 && <span className="font-normal normal-case tracking-normal text-muted">· {photos.length} photos</span>}
                    </figcaption>
                  </figure>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {viewer && <PhotoViewer {...viewer} onClose={() => setViewer(null)} />}
    </>
  );
}

/* ---------- Full-screen photo viewer ---------- */
function PhotoViewer({ photos, index, title, onClose }: { photos: ImageAsset[]; index: number; title: string; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [i, setI] = useState(index);
  const touchX = useRef<number | null>(null);
  const go = useCallback((d: number) => setI((v) => (v + d + photos.length) % photos.length), [photos.length]);

  useEffect(() => {
    ref.current?.showModal();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [go]);

  const p = photos[i];
  return (
    <dialog
      ref={ref}
      className="consult-dialog photo-dialog m-0 size-full max-h-none max-w-none bg-transparent p-0"
      aria-label={`${title} — photos`}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
    >
      <div
        className="flex size-full flex-col items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        <div className="mb-3 flex w-full max-w-5xl items-center justify-between gap-4 text-cream">
          <p className="truncate text-sm font-medium">
            {title}
            {photos.length > 1 && <span className="ml-2 text-cream/60">{i + 1} / {photos.length}</span>}
          </p>
          <button type="button" onClick={() => ref.current?.close()} className="grid size-11 shrink-0 place-items-center rounded-full bg-cream/10 hover:bg-cream/20" aria-label="Close photos">
            <X className="size-5" />
          </button>
        </div>
        <div className="relative h-[min(75dvh,48rem)] w-full max-w-5xl">
          <Image src={p.src} alt={p.alt} fill sizes="100vw" className="rounded-2xl object-contain" />
        </div>
        {p.alt && <p className="mt-3 max-w-xl text-center text-sm text-cream/70">{p.alt}</p>}
        {photos.length > 1 && (
          <div className="mt-4 flex gap-3">
            <button type="button" onClick={() => go(-1)} className="grid size-12 place-items-center rounded-full bg-cream/10 text-cream hover:bg-cream/20" aria-label="Previous photo">
              <ChevronLeft className="size-5" />
            </button>
            <button type="button" onClick={() => go(1)} className="grid size-12 place-items-center rounded-full bg-gold text-espresso" aria-label="Next photo">
              <ChevronRight className="size-5" />
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
}
