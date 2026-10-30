"use client";

import Image from "@/components/ui/Image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import type { ImageAsset, JourneyPhoto, Milestone } from "@/content/types";
import { PhotoCollage } from "./PhotoCollage";
import { showContentNotes } from "@/lib/dev";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Sanjay's journey — an animated "road".
 *  Desktop: a curved zig-zag gold path between the chapter cards and their photo collages.
 *  Phones/tablets: the road weaves left and right between the chapter cards.
 * As the visitor scrolls, the path draws itself, a glowing marker travels along it, chapter markers
 * light up when reached, cards glide in from alternating sides and photos pop in one by one.
 * Everything is measured from the real layout, so it adapts to any text length or photo count.
 * Respects "reduce motion": the road is shown complete and nothing moves.
 */
export function JourneyTimeline({ milestones, photosById }: { milestones: Milestone[]; photosById: Record<string, JourneyPhoto[]> }) {
  const listRef = useRef<HTMLOListElement>(null);
  const drawRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGGElement>(null);
  const [geo, setGeo] = useState<{ d: string; w: number; h: number; mobile: boolean } | null>(null);
  const [viewer, setViewer] = useState<{ photos: ImageAsset[]; index: number; title: string } | null>(null);

  const measure = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const mobile = window.innerWidth < 1024;
    const box = list.getBoundingClientRect();
    const items = Array.from(list.querySelectorAll<HTMLElement>(":scope > li"));
    const pts = items.map((li) => {
      const n = li.querySelector<HTMLElement>("[data-node]")!.getBoundingClientRect();
      const c = li.querySelector<HTMLElement>("[data-card]")!.getBoundingClientRect();
      return { x: n.left + n.width / 2 - box.left, y: n.top + n.height / 2 - box.top, top: c.top - box.top, bottom: c.bottom - box.top };
    });
    if (pts.length < 2) return;
    let d = `M ${pts[0].x} 0 L ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1];
      const b = pts[i];
      if (mobile) {
        // run down beside the card, cross the gap in a smooth S-bend, then down to the next marker
        const g1 = a.bottom + 6;
        const g2 = Math.max(g1 + 24, b.top - 6);
        const mid = (g1 + g2) / 2;
        d += ` L ${a.x} ${g1} C ${a.x} ${mid}, ${b.x} ${mid}, ${b.x} ${g2} L ${b.x} ${b.y}`;
      } else {
        const dy = b.y - a.y;
        d += ` C ${a.x} ${a.y + dy * 0.55}, ${b.x} ${b.y - dy * 0.55}, ${b.x} ${b.y}`;
      }
    }
    const last = pts[pts.length - 1];
    d += ` L ${last.x} ${box.height}`;
    setGeo({ d, w: box.width, h: box.height, mobile });
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

  // Scroll-linked animation: draw the road, move the marker, light up reached chapters.
  useEffect(() => {
    const list = listRef.current;
    const path = drawRef.current;
    if (!list || !path || !geo) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    if (glowRef.current) glowRef.current.style.strokeDasharray = `${len}`;
    const items = Array.from(list.querySelectorAll<HTMLElement>(":scope > li"));
    const nodeY = items.map((li) => {
      const n = li.querySelector<HTMLElement>("[data-node]")!;
      const r = n.getBoundingClientRect();
      return r.top + r.height / 2 - list.getBoundingClientRect().top;
    });
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // The path only ever moves downwards, so find the length whose point sits at a given height.
    const lengthAtY = (y: number) => {
      let lo = 0;
      let hi = len;
      for (let k = 0; k < 22; k++) {
        const midL = (lo + hi) / 2;
        if (path.getPointAtLength(midL).y < y) lo = midL;
        else hi = midL;
      }
      return lo;
    };

    let raf = 0;
    const update = () => {
      raf = 0;
      const top = list.getBoundingClientRect().top;
      const targetY = reduce ? geo.h : Math.min(geo.h, Math.max(0, window.innerHeight * (geo.mobile ? 0.62 : 0.6) - top));
      const L = reduce ? len : lengthAtY(targetY);
      path.style.strokeDashoffset = `${len - L}`;
      if (glowRef.current) glowRef.current.style.strokeDashoffset = `${len - L}`;
      const pt = path.getPointAtLength(L);
      if (dotRef.current) {
        dotRef.current.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
        dotRef.current.style.opacity = L > 4 && L < len - 4 ? "1" : "0";
      }
      let current = -1;
      items.forEach((li, i) => {
        const reached = nodeY[i] <= pt.y + 2;
        li.classList.toggle("is-reached", reached);
        if (reached) current = i;
      });
      items.forEach((li, i) => li.classList.toggle("is-current", i === current && !reduce));
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
      <ol ref={listRef} className="journey relative">
        {geo && (
          <svg
            className="pointer-events-none absolute inset-0 overflow-visible"
            width={geo.w}
            height={geo.h}
            viewBox={`0 0 ${geo.w} ${geo.h}`}
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="journey-gold" x1="0" y1="0" x2="0" y2={geo.h} gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#ecd5a4" />
                <stop offset="0.5" stopColor="#d6b16d" />
                <stop offset="1" stopColor="#94702f" />
              </linearGradient>
              <filter id="journey-glow" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur stdDeviation="4" />
              </filter>
            </defs>
            {/* the road ahead (faint, dotted) */}
            <path d={geo.d} stroke="rgb(148 112 47 / 0.25)" strokeWidth="1.5" strokeDasharray="2 7" strokeLinecap="round" />
            {/* soft glow under the travelled road */}
            <path ref={glowRef} d={geo.d} stroke="rgb(214 177 109 / 0.2)" strokeWidth={geo.mobile ? 7 : 9} strokeLinecap="round" />
            {/* the travelled road */}
            <path ref={drawRef} d={geo.d} stroke="url(#journey-gold)" strokeWidth={geo.mobile ? 2.5 : 2} strokeLinecap="round" />
            {/* travelling marker */}
            <g ref={dotRef} className="journey-dot" style={{ opacity: 0 }}>
              <circle r="11" fill="#d6b16d" opacity="0.45" filter="url(#journey-glow)" />
              <circle r="9" fill="none" stroke="#d6b16d" strokeOpacity="0.5" className="journey-dot-halo" />
              <circle r="5" fill="#fff" stroke="#d6b16d" strokeWidth="2.5" />
            </g>
          </svg>
        )}

        {milestones.map((m, i) => {
          const left = i % 2 === 0; // desktop: card on the left; phones: marker on the left
          const num = String(i + 1).padStart(2, "0");
          const photos = photosById[m.id] ?? [];
          const open = (index: number) => setViewer({ photos, index, title: m.title });
          return (
            <li
              key={m.id}
              className={`group/ch relative grid pb-16 last:pb-0 sm:pb-20 lg:grid-cols-[5fr_4fr_5fr] lg:items-center lg:px-0 lg:pb-28 ${
                left ? "pl-12 pr-1 sm:pl-16 sm:pr-6" : "pl-1 pr-12 sm:pl-6 sm:pr-16"
              }`}
            >
              {/* chapter marker */}
              <div
                className={`absolute top-6 z-10 lg:static lg:row-start-1 lg:col-start-2 lg:flex ${
                  left ? "left-0 lg:justify-start lg:pl-[8%]" : "right-0 lg:justify-end lg:pr-[8%]"
                }`}
              >
                <span
                  data-node
                  className="journey-node relative grid size-[2.35rem] place-items-center rounded-full border border-gold/60 bg-cream text-gold-deep shadow-[0_0_0_6px_rgb(248_243_234)]"
                >
                  <span className="text-[0.62rem] font-bold">{num}</span>
                </span>
              </div>

              {/* card */}
              <div
                data-card
                className={`lg:row-start-1 ${left ? "lg:col-start-1 lg:text-right" : "lg:col-start-3"} ${
                  left ? "[--jx:42px] [--jr:1.2deg] lg:[--jx:-42px] lg:[--jr:-1deg]" : "[--jx:-42px] [--jr:-1.2deg] lg:[--jx:42px] lg:[--jr:1deg]"
                }`}
                data-reveal="journey"
              >
                <article className={`journey-card card-lux overflow-hidden ${m.placeholder && showContentNotes ? "border-dashed !border-amber-500/60" : ""}`}>
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
                      <span className="journey-chip relative overflow-hidden rounded-full bg-gold/15 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-gold-deep">
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
