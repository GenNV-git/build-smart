"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { versionedSrc } from "@/lib/img";
import { track } from "@/lib/track";
import { GoldDust } from "@/components/motion/GoldDust";

/**
 * "Open the door to better living" — the scroll-controlled entrance on the home page.
 *
 * How it works
 * - The script at the top of src/app/layout.tsx decides, before the page is drawn, whether the intro plays
 *   (it adds the classes "intro-on intro-play" to <html>). It plays when the home page is opened in a new visit;
 *   it is skipped for visitors who asked for reduced motion, for links to a section (/#services), after it has been
 *   seen once in this browser tab, and with ?nointro. Add ?intro to the address to see it again.
 * - Without those classes (or without JavaScript) none of this is shown and the page is the normal home page.
 * - While it plays, a tall empty "track" sits below the hero and the hero + this stage stay pinned to the screen.
 *   Scrolling through the track drives the scenes; at the end the stage has faded away, the real hero is on screen,
 *   and the track is removed (the scroll position is adjusted so nothing jumps).
 * - The journey: the B|S front doors open into the hall; the camera keeps walking forward through the house — hall,
 *   living (dining on phones), bedroom, kitchen — each view dissolving into the next; an arch of light leads into the
 *   homepage.
 * - Phones (tall screens) are designed first: each room arrives as a close-up, the camera pulls back to show the whole
 *   room (the complete picture, edge to edge, on a warm blurred backdrop, its words beneath), then glides in to its best
 *   detail before the next room. Phone pictures: public/images/intro/*-m.webp (from the owner's set in
 *   src/components/intro_images); the focus point of each is `focus` in ROOMS.
 * - Pictures: public/images/intro/. Words and timings: SCENES / ROOMS below. Track length: ".ie-track" in globals.css.
 */

const src = (name: string) => versionedSrc(`/images/intro/${name}`);

/* Geometry of the entrance picture, in its own units (815 × 386). Doors fill x 210–640, y 0–345; the seam is x 425. */
const FW = 815;
const FH = 386;
const SEAM = 425;
const DOOR_W = 215;
const FOCUS_Y = 185; // eye level: where the camera walks towards
const CAMERA = 460; // camera distance from the doors (gives the door swing its perspective)
const OPEN_DEG = 84; // how far each door swings open
const HALL_HALF_W = 245; // the hall picture (490 × 426 units) sits behind the doorway, a little larger than it
const HALL_ABOVE = 210; // from the hall's top edge to eye level (a little above the picture's horizon: we look up at the chandelier)
const HALL_BELOW = 216; // from eye level to the hall's bottom edge

/** Scroll positions (0 = top of the intro, 1 = homepage) for each part of the journey. */
const SCENES = {
  helloOut: [0.01, 0.045],
  doors: [0.025, 0.2],
  approach: [0.03, 0.2],
  doorCaption: [0.065, 0.1, 0.165, 0.2],
  dolly: [0.18, 0.3],
  hallPush: [0.27, 0.42],
  archIn: [0.895, 0.925],
  heroUnder: [0.925, 0.94],
  archPass: [0.93, 1],
  glowOut: [0.955, 0.99],
  wallOut: [0.978, 0.998],
  chrome: 0.962,
} as const;

type Room = {
  key: string;
  label: string;
  /** label on phones, where this place shows a different room of the set */
  labelM?: string;
  title: string;
  /** when it starts to appear (the scene before dissolves into it) */
  in: number;
  /** width / height of the computer picture (16:9 crops) and of the whole phone picture */
  aspect: number;
  aspectM: number;
  /** sideways drift of the camera on wide screens, in % of the picture */
  pan: [number, number];
  /** phones: the detail the camera glides in to, as fractions of the picture (x, y) */
  focus: [number, number];
  /** the hall on computers is the picture behind the front doors; this layer is used on phones only */
  phoneOnly?: boolean;
};

const PHONE_ASPECT = 1672 / 941; // = PHONE_SRC
const ROOMS: Room[] = [
  { key: "hall", label: "The Grand Hall", title: "Welcome home.", in: 0.265, aspect: 1.15, aspectM: PHONE_ASPECT, pan: [0, 0], focus: [0.38, 0.72], phoneOnly: true },
  { key: "living", label: "The Living Room", labelM: "The Dining Room", title: "Designed for the way you live.", in: 0.41, aspect: 16 / 9, aspectM: PHONE_ASPECT, pan: [1.6, -1.6], focus: [0.54, 0.6] },
  { key: "bedroom", label: "The Master Bedroom", title: "Crafted for your comfort.", in: 0.575, aspect: 1.6, aspectM: PHONE_ASPECT, pan: [-1.4, 1.4], focus: [0.4, 0.62] },
  { key: "kitchen", label: "The Modular Kitchen", title: "Built around your lifestyle.", in: 0.74, aspect: 16 / 9, aspectM: PHONE_ASPECT, pan: [-1.2, 1.2], focus: [0.53, 0.6] },
];
/** Phones: how close the camera comes to each room's detail (2 = half the picture's width fills the screen). */
const CLOSE = 2.15;
/** The phone pictures' size, and where the doorway crop of the hall (hall-tall.webp, 1082 x 941) starts in it. */
const PHONE_SRC = [1672, 941] as const;
const HALL_CROP_X = 211;
/** How long one room takes to dissolve into the next as we walk on. */
const MOVE = 0.05;
/** When each room is left: the next room's arrival, or the arch at the end. */
const exitOf = (i: number) => (ROOMS[i + 1] ? ROOMS[i + 1].in : SCENES.archIn[0]);

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const smooth = (t: number) => t * t * (3 - 2 * t);
const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeIn = (t: number) => t * t * t;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const r4 = (n: number) => Math.round(n * 10000) / 10000;

type Geo = {
  vw: number;
  vh: number; // height the scene is composed for
  sh: number; // height the scene is painted to (at least the whole screen)
  u: number; // px per unit at the start
  cx: number; // screen position of the eye-level point between the doors
  cy: number;
  zPass: number; // camera zoom at which the doorway has passed the edges of the screen
  hallCover: (z: number) => number;
  hallBase: number; // starting size of the hall (smaller on phones, which see only the middle of the doorway)
  arch: { wall: string; trim: string; floor: number; cy: number; ox: number; oy: number; ow: number; oh: number };
  tall: boolean; // phones and other tall screens: whole pictures in a frame
  frames: { top: number; height: number }[]; // per room, on tall screens
};

/** Height of 100lvh in pixels (the screen with the browser's bars tucked away). */
function largeViewportHeight(): number {
  const probe = document.createElement("div");
  probe.style.cssText = "position:absolute;top:0;left:0;width:1px;height:100vh;height:100lvh;visibility:hidden;pointer-events:none";
  document.body.appendChild(probe);
  const h = probe.offsetHeight;
  probe.remove();
  return h;
}

function measure(stage: HTMLElement): Geo {
  const vw = stage.clientWidth || window.innerWidth;
  const lvh = largeViewportHeight() || window.innerHeight;
  // Phones and tablets: compose the scene for the part of the screen that is visible right now (with the browser's
  // bars showing), but paint it tall enough to cover the whole screen when the bars slide away — in Safari, Chrome and
  // the in-app browsers of Instagram, WhatsApp etc. — so nothing ever looks cut off at the bottom.
  const touch = window.matchMedia("(pointer: coarse)").matches;
  const portraitNow = window.innerHeight >= window.innerWidth;
  const screenTall = portraitNow ? Math.max(screen.width, screen.height) : Math.min(screen.width, screen.height);
  const vh = touch ? Math.min(window.innerHeight, lvh) || lvh : lvh;
  const sh = touch ? Math.max(vh, lvh, window.innerHeight, screenTall || 0) : lvh;
  const u = Math.max(vh / FH, vw / 780);
  const top = Math.min(0, Math.max(vh - FH * u, vh / 2 - FOCUS_Y * u));
  const cx = vw / 2;
  const cy = top + FOCUS_Y * u;

  // Where the inner edge of an open door appears (in units from the seam), seen through the camera.
  const a = (OPEN_DEG * Math.PI) / 180;
  const innerEdge = (DOOR_W * (1 - Math.cos(a)) * CAMERA) / (CAMERA + DOOR_W * Math.sin(a));
  const zPass =
    Math.max(
      1.25,
      vw / 2 / (innerEdge * u), // the open doors have slid off both sides
      cy / (FOCUS_Y * u), // the top of the doorway is above the screen
      (sh - cy) / ((345 - FOCUS_Y) * u), // the threshold is below the screen
    ) * 1.06;

  // The hall must always fill whatever part of the screen the doorway shows.
  const hallCover = (z: number) => {
    const s = u * z;
    return Math.max(Math.min(DOOR_W * s, vw / 2) / HALL_HALF_W, Math.min(FOCUS_Y * s, cy) / HALL_ABOVE, Math.min((345 - FOCUS_Y) * s, sh - cy) / HALL_BELOW) / u;
  };

  // The architectural frame at the end: a dark panelled wall with an arched opening of light.
  const portrait = vw / vh < 0.8;
  const ow = portrait ? vw * 0.66 : Math.min(vw * 0.32, vh * 0.48);
  const r = ow / 2;
  const floor = vh * (portrait ? 0.83 : 0.86);
  const oh = Math.min(vh * (portrait ? 0.58 : 0.66), ow * 2.15);
  const x0 = (vw - ow) / 2;
  const x1 = x0 + ow;
  const ty = floor - oh;
  const t = Math.max(8, ow * 0.045);
  const f = (n: number) => n.toFixed(1);
  const wall = `M0 0H${f(vw)}V${f(sh)}H0Z M${f(x0)} ${f(floor)}V${f(ty + r)}A${f(r)} ${f(r)} 0 0 1 ${f(x1)} ${f(ty + r)}V${f(floor)}Z`;
  const trim = `M${f(x0 - t)} ${f(floor)}V${f(ty + r)}A${f(r + t)} ${f(r + t)} 0 0 1 ${f(x1 + t)} ${f(ty + r)}V${f(floor)}`;

  const hallBase = Math.min(1, hallCover(1) * 1.15);

  // Phones: each room's whole picture, full width, placed so its words fit beneath it on the visible screen.
  const tall = vw / sh < 1;
  const frames = ROOMS.map((r) => {
    const height = vw / r.aspectM;
    // picture + its words, centred on the visible screen (a little above centre), below the logo and Skip button
    return { top: Math.max(72, (vh - (height + 22 + 112)) / 2 - 10), height };
  });

  return { vw, vh, sh, u, cx, cy, zPass, hallCover, hallBase, tall, frames, arch: { wall, trim, floor, cy: ty + oh * 0.55, ox: x0, oy: ty, ow, oh } };
}

/** Module-level so React's development double-mount doesn't end the intro. */
let mounted = 0;
const SEEN_KEY = "bs-intro";
const CLASSES = ["intro-on", "intro-play", "intro-ready", "intro-leaving", "intro-shown"];

export function EntranceIntro({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const finishRef = useRef<(mode: "skip" | "complete") => void>(() => {});

  useEffect(() => {
    mounted++;
    const root = document.documentElement;
    const stage = stageRef.current;
    const trackEl = trackRef.current;
    const wrap = wrapRef.current;
    const hero = heroRef.current;
    if (!root.classList.contains("intro-on") || !stage || !trackEl || !wrap || !hero) {
      return () => {
        mounted--;
      };
    }

    const q = <T extends HTMLElement | SVGElement = HTMLElement>(sel: string) => stage.querySelector(sel) as T;
    const qa = (sel: string) => Array.from(stage.querySelectorAll<HTMLElement>(sel));
    const el = {
      box: q(".ie-box"),
      leafL: q(".ie-leaf-l"),
      leafR: q(".ie-leaf-r"),
      shadeL: q(".ie-leaf-l .ie-shade"),
      shadeR: q(".ie-leaf-r .ie-shade"),
      flare: q(".ie-flare"),
      spill: q(".ie-spill"),
      bloom: q(".ie-bloom"),
      hall: q(".ie-hall"),
      dust: q(".ie-dust"),
      base: q(".ie-base"),
      caps: qa(".ie-cap"),
      doorCap: q(".ie-doorcap"),
      hello: q(".ie-hello"),
      cue: q(".ie-cue"),
      arch: q(".ie-arch"),
      archWall: q<SVGElement>(".ie-arch-wall"),
      archTrim: q<SVGElement>(".ie-arch-trim"),
      archGlow: q(".ie-arch-glow"),
      archBloom: q(".ie-arch-bloom"),
      archRefl: q(".ie-arch-refl"),
      vignette: q(".ie-vignette"),
      archSvg: q<SVGElement>(".ie-arch svg"),
      bar: q(".ie-progress > span"),
    };
    const rooms = ROOMS.map((r) => {
      const room = q(`.ie-room[data-room="${r.key}"]`);
      return { room, frame: room.querySelector(".ie-room-frame") as HTMLElement };
    });

    let geo = measure(stage);
    let L = 1;
    let start = 0;
    let target = 0;
    let cur = 0;
    let raf = 0;
    let last = 0;
    let idle = 0;
    let done = false;
    let playing = true;
    let roomsLoaded = false;

    const applyGeo = () => {
      geo = measure(stage);
      stage.style.setProperty("--vw", `${geo.vw}px`);
      stage.style.setProperty("--vh", `${geo.vh}px`);
      stage.style.setProperty("--sh", `${geo.sh}px`);
      stage.style.setProperty("--u", `${geo.u}px`);
      const a = geo.arch;
      el.archSvg.setAttribute("viewBox", `0 0 ${geo.vw} ${geo.sh}`);
      el.archWall.setAttribute("d", a.wall);
      el.archSvg.querySelector(".ie-arch-wall-flutes")?.setAttribute("d", a.wall);
      el.archTrim.setAttribute("d", a.trim);
      el.archSvg.querySelector(".ie-arch-floor")?.setAttribute("y", `${a.floor}`);
      el.archSvg.querySelector(".ie-arch-floor")?.setAttribute("height", `${geo.sh - a.floor}`);
      Object.assign(el.archRefl.style, { left: `${a.ox}px`, top: `${a.floor}px`, width: `${a.ow}px`, height: `${Math.min(geo.sh - a.floor, a.oh * 0.7)}px` });
      Object.assign(el.archGlow.style, { left: `${a.ox}px`, top: `${a.oy}px`, width: `${a.ow}px`, height: `${a.floor - a.oy}px` });
      Object.assign(el.archBloom.style, { left: `${a.ox - a.ow}px`, top: `${a.oy - a.ow * 0.5}px`, width: `${a.ow * 3}px`, height: `${geo.sh - a.oy + a.ow * 0.5}px` });
      el.arch.style.transformOrigin = `50% ${a.cy}px`;
      stage.classList.toggle("is-tall", geo.tall);
      rooms.forEach((r, i) => {
        const fr = geo.frames[i];
        r.frame.style.top = geo.tall ? `${fr.top}px` : "";
        r.frame.style.height = geo.tall ? `${fr.height}px` : "";
        el.caps[i].style.top = geo.tall ? `${fr.top + fr.height + 22}px` : "";
        const lab = el.caps[i].querySelector(".ie-cap-label");
        if (lab) lab.textContent = (geo.tall && ROOMS[i].labelM) || ROOMS[i].label;
      });
      const r = wrap.getBoundingClientRect();
      start = r.top + window.scrollY;
      L = Math.max(1, trackEl.offsetHeight);
    };

    const read = () => clamp01((window.scrollY - start) / L);

    /** Load the room pictures once the entrance is on screen (they are not needed for the first view). */
    const loadRooms = () => {
      if (roomsLoaded) return;
      roomsLoaded = true;
      stage.querySelectorAll<HTMLSourceElement | HTMLImageElement>("[data-srcset]").forEach((n) => {
        n.setAttribute("srcset", n.dataset.srcset!);
        n.removeAttribute("data-srcset");
      });
      stage.querySelectorAll<HTMLImageElement>("img[data-src]").forEach((n) => {
        n.src = n.dataset.src!;
        n.removeAttribute("data-src");
      });
    };

    const setVis = (n: HTMLElement | SVGElement, o: number) => {
      const s = (n as HTMLElement).style;
      s.opacity = `${r4(o)}`;
      s.visibility = o > 0.001 ? "visible" : "hidden";
    };

    const render = (p: number) => {
      // Scene 01–02: the doors open, light pours in, the camera moves forward.
      const doorT = seg(p, SCENES.doors[0], SCENES.doors[1]);
      const ang = OPEN_DEG * smooth(doorT);
      const zAt = (pp: number) =>
        1 + 0.06 * smooth(seg(pp, SCENES.approach[0], SCENES.approach[1])) + (geo.zPass - 1.06) * inOut(seg(pp, SCENES.dolly[0], SCENES.dolly[1]));
      const z = zAt(p);
      const passed = seg(p, SCENES.dolly[0] + 0.07, SCENES.dolly[1]);

      el.box.style.transform = `scale(${r4(z)})`;
      el.leafL.style.transform = `rotateY(${r4(ang)}deg)`;
      el.leafR.style.transform = `rotateY(${r4(-ang)}deg)`;
      const shade = r4((ang / OPEN_DEG) * 0.78);
      el.shadeL.style.opacity = `${shade}`;
      el.shadeR.style.opacity = `${shade}`;
      setVis(el.box, 1 - smooth(passed));

      // Light: bright the moment the doors part, settling as the eyes adjust.
      const crack = smooth(seg(ang, 0, 9));
      const flare = crack * lerp(1, 0.2, smooth(seg(ang, 10, OPEN_DEG))) * (1 - seg(p, SCENES.dolly[0], SCENES.dolly[0] + 0.07));
      setVis(el.flare, flare);
      setVis(el.spill, crack * (1 - smooth(seg(p, SCENES.dolly[0], SCENES.dolly[0] + 0.08))));
      setVis(el.bloom, crack * 0.85 * (1 - smooth(seg(p, 0.16, 0.27))));

      // Scene 03: the hall, further away than the doors (it grows more slowly — depth), then the camera walks in.
      // Computers: the hall dissolves into the living room as we walk on. Phones: it hands over to the whole-picture view.
      // Phones: the hall stops where the whole-picture view takes over from it (the same picture, so the hand-over is seamless).
      const d1 = geo.tall ? ROOMS[0].in : ROOMS[1].in;
      const pH = geo.tall ? Math.min(p, d1) : p;
      const zH = geo.tall ? zAt(pH) : z;
      const hallExit = seg(pH, d1, d1 + MOVE);
      const hallS =
        Math.max(geo.hallCover(zH), geo.hallBase * Math.pow(zH, 0.45)) *
        (1 + 0.2 * inOut(seg(pH, SCENES.hallPush[0], SCENES.hallPush[1]))) *
        (1 + 0.25 * easeIn(hallExit));
      // ...and, walking in, the eyes drop from the chandelier towards the seating (never uncovering the bottom edge)
      const room = geo.cy + HALL_BELOW * geo.u * hallS - geo.sh;
      const tilt = Math.min(geo.vh * 0.09 * smooth(seg(pH, SCENES.hallPush[0], SCENES.hallPush[1])), Math.max(0, room));
      el.hall.style.transform = `translate3d(0,${r4(-tilt)}px,0) scale(${r4(hallS)})`;
      setVis(el.hall, ang > 0.05 && p < d1 + (geo.tall ? 0.01 : MOVE) ? 1 : 0); // only needed once the doors part; covered by the next view
      // where that hall picture is on the screen (its CSS box is 490 x 426 units, scaled about the eye level)
      const hallBox = { x: geo.vw / 2 - 245 * geo.u * hallS, y: geo.cy - HALL_ABOVE * geo.u * hallS - tilt, h: 426 * geo.u * hallS };
      setVis(el.dust, 1 - smooth(seg(p, 0.13, 0.24)));

      // Scenes 03–06: hall, living room, bedroom, kitchen — we keep walking forward and each view dissolves into the next.
      ROOMS.forEach((room, i) => {
        const r = rooms[i];
        const exit = exitOf(i);
        const lastRoom = i === ROOMS.length - 1;
        const used = geo.tall || !room.phoneOnly;
        const arrive = geo.tall && room.phoneOnly ? (p >= room.in ? 1 : 0) : smooth(seg(p, room.in, room.in + MOVE * 0.8));
        const gone = lastRoom ? p >= SCENES.heroUnder[1] : p >= exit + MOVE;
        const leave = lastRoom ? seg(p, SCENES.heroUnder[0], SCENES.heroUnder[1]) : seg(p, exit, exit + MOVE);
        const op = used && !gone ? arrive * (lastRoom ? 1 - leave : 1) : 0;
        setVis(r.room, op);
        if (op > 0) {
          const life = seg(p, room.in, exit + MOVE);
          const through = lastRoom ? 0 : easeIn(leave); // walking on: the room grows past us
          if (geo.tall) {
            // Zoom out, then zoom in. Each room arrives close up, the camera pulls back to the whole room (its words appear
            // beneath it), then glides in to its best detail as the next room dissolves in, close up on its own detail.
            // The hall arrives exactly where the doors left it — the same picture — and pulls back from there.
            const fr = geo.frames[i];
            const back = 1 - smooth(seg(p, room.in + (room.phoneOnly ? 0 : 0.015), room.in + 0.06));
            const into = inOut(seg(p, room.in + 0.1, exit + 0.035));
            const close = (fx: number) => {
              const s = CLOSE;
              return { x: Math.min(0, Math.max(geo.vw - geo.vw * s, geo.vw / 2 - fx * geo.vw * s)), y: geo.vh * 0.48 - (fr.height * s) / 2, s };
            };
            let from = close(room.focus[0]);
            if (room.phoneOnly) {
              const k = hallBox.h / PHONE_SRC[1]; // screen pixels per picture pixel, as seen through the doors
              from = { x: hallBox.x - HALL_CROP_X * k, y: hallBox.y, s: (PHONE_SRC[0] * k) / geo.vw };
            }
            const to = close(room.focus[0]);
            const x = from.x * back + to.x * into; // (the whole room sits at x = 0; pulling back and gliding in never overlap)
            const y = fr.top + ((from.y - fr.top) * back + (to.y - fr.top) * into);
            const sc = 1 + (from.s - 1) * back + (to.s - 1) * into;
            r.frame.style.transform = `translate3d(${r4(x)}px,${r4(y - fr.top)}px,0) scale(${r4(sc)})`;
            r.frame.style.opacity = "";
          } else {
            const x = lerp(room.pan[0], room.pan[1], life);
            r.frame.style.transform = `translate3d(${r4(x)}%,0,0) scale(${r4(1.04 + 0.1 * life + 0.25 * through)})`;
            r.frame.style.opacity = "";
          }
        }
        // the room's words: computers — while we are in it; phones — while it is seen whole
        const capIn = geo.tall ? room.in + 0.05 : room.phoneOnly ? 0.3 : room.in + 0.035;
        const capOut = geo.tall ? room.in + 0.112 : exit - 0.03;
        const cap = smooth(seg(p, capIn, capIn + 0.025)) * (1 - smooth(seg(p, capOut, capOut + 0.025)));
        setVis(el.caps[i], cap);
        el.caps[i].style.transform = `translate3d(0,${r4((1 - cap) * 18)}px,0)`;
      });

      // Words for the entrance and the door.
      const hello = 1 - smooth(seg(p, SCENES.helloOut[0], SCENES.helloOut[1]));
      setVis(el.hello, hello);
      el.hello.style.transform = `translate3d(0,${r4((1 - hello) * -24)}px,0)`;
      setVis(el.cue, hello);
      const dc = SCENES.doorCaption;
      const dcap = smooth(seg(p, dc[0], dc[1])) * (1 - smooth(seg(p, dc[2], dc[3])));
      setVis(el.doorCap, dcap);
      el.doorCap.style.transform = `translate3d(0,${r4((1 - dcap) * 16)}px,0)`;

      // Scene 07: an arched opening of light; the camera passes through it into the homepage.
      const archIn = smooth(seg(p, SCENES.archIn[0], SCENES.archIn[1]));
      const pass = easeIn(seg(p, SCENES.archPass[0], SCENES.archPass[1]));
      setVis(el.arch, archIn * (1 - smooth(seg(p, SCENES.wallOut[0], SCENES.wallOut[1]))));
      el.arch.style.transform = `scale(${r4(1 + 7 * pass)})`;
      const glow = 1 - smooth(seg(p, SCENES.glowOut[0], SCENES.glowOut[1]));
      el.archGlow.style.opacity = `${r4(0.94 * glow)}`;
      el.archBloom.style.opacity = `${r4(glow)}`;
      el.archRefl.style.opacity = `${r4(glow)}`;
      setVis(el.vignette, 1 - smooth(seg(p, SCENES.wallOut[0], SCENES.wallOut[1])));
      setVis(el.base, 1 - seg(p, SCENES.heroUnder[0], SCENES.heroUnder[1]));

      el.bar.style.transform = `scaleX(${r4(p)})`;

      // The site's own header, buttons and hero animations return as the journey ends.
      const nowPlaying = p < SCENES.chrome;
      if (nowPlaying !== playing) {
        playing = nowPlaying;
        root.classList.toggle("intro-play", playing);
        root.classList.toggle("intro-shown", !playing);
        if (!playing) {
          track("intro_complete");
          window.setTimeout(() => !playing && root.classList.remove("intro-shown"), 1200);
        }
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.064, (now - last) / 1000);
      last = now;
      const gap = target - cur;
      // Smooth, but never far behind the scrollbar.
      const k = 1 - Math.exp(-dt * (Math.abs(gap) > 0.2 ? 16 : 8));
      cur = Math.abs(gap) < 0.0003 ? target : cur + gap * k;
      render(cur);
      raf = cur !== target ? requestAnimationFrame(tick) : 0;
    };

    const kick = () => {
      if (done) return;
      target = read();
      if (target > 0.01) loadRooms();
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
      // Once the visitor rests at (or beyond) the end, quietly remove the track.
      window.clearTimeout(idle);
      if (target >= 0.999) idle = window.setTimeout(() => read() >= 0.999 && finish("complete"), 180);
    };

    const removeListeners = () => {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("load", loadRooms);
      hero.removeEventListener("focusin", onHeroFocus);
    };

    const instantScroll = (top: number) => {
      root.style.scrollBehavior = "auto";
      window.scrollTo({ top, left: window.scrollX, behavior: "instant" as ScrollBehavior });
      requestAnimationFrame(() => (root.style.scrollBehavior = ""));
    };

    const finish = (mode: "skip" | "complete") => {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(idle);
      removeListeners();
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {}
      root.dataset.introEnded = String(Date.now()); // the quote pop-up waits a few seconds after this
      if (mode === "skip") {
        track("intro_skip", { intro_progress: Math.round(cur * 100) });
        const y = Math.max(0, window.scrollY - start - L);
        root.classList.add("intro-leaving");
        root.classList.remove("intro-play");
        root.classList.add("intro-shown");
        instantScroll(start + y);
        window.setTimeout(() => root.classList.remove("intro-on", "intro-leaving", "intro-ready"), 750);
      } else {
        const y = window.scrollY;
        root.classList.remove("intro-on", "intro-play", "intro-ready");
        instantScroll(Math.max(0, y - L));
      }
      window.setTimeout(() => root.classList.remove("intro-shown"), 1200);
    };
    finishRef.current = finish;

    let lastW = 0;
    let lastH = 0;
    const onResize = () => {
      const w = stage.clientWidth;
      const h = window.innerHeight;
      // Phones resize the screen as the address bar slides away; only re-measure for real changes.
      if (w === lastW && Math.abs(h - lastH) < 120) return;
      lastW = w;
      lastH = h;
      applyGeo();
      kick();
      render(cur);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish("skip");
    };
    // Keyboard users who tab into the homepage skip straight to it.
    const onHeroFocus = () => {
      if (root.classList.contains("intro-play")) finish("skip");
    };

    applyGeo();
    lastW = stage.clientWidth;
    lastH = window.innerHeight;
    cur = target = read();
    render(cur);
    root.classList.add("intro-ready");
    if (target > 0.01) loadRooms();
    if (document.readyState === "complete") window.setTimeout(loadRooms, 1200);
    else window.addEventListener("load", () => window.setTimeout(loadRooms, 1200), { once: true });

    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKey);
    hero.addEventListener("focusin", onHeroFocus);

    return () => {
      mounted--;
      cancelAnimationFrame(raf);
      window.clearTimeout(idle);
      removeListeners();
      // Leaving the home page (or the development double-mount): only tidy up if we are really gone.
      window.setTimeout(() => {
        if (mounted > 0) return;
        if (!done) {
          try {
            sessionStorage.setItem(SEEN_KEY, "1");
          } catch {}
        }
        root.classList.remove(...CLASSES);
      }, 0);
    };
  }, []);

  const scrollIn = () => {
    const wrap = wrapRef.current;
    const t = trackRef.current;
    if (!wrap || !t) return;
    const top = wrap.getBoundingClientRect().top + window.scrollY + t.offsetHeight * 0.22;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div ref={wrapRef} className="ie-wrap">
      <div className="ie-pin">
        <div ref={stageRef} className="ie-stage">
          {/* Everything visual is decorative; the real content is the homepage underneath. */}
          <div className="ie-scene" aria-hidden="true">
            <div className="ie-base" />

            {/* Scene 03 — the hall behind the doors */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <picture>
              <source media="(max-aspect-ratio: 1/1)" srcSet={src("hall-tall.webp")} />
              <img className="ie-hall" src={src("hall.webp")} alt="" decoding="async" loading="lazy" />
            </picture>

            {/* Scenes 01–02 — the entrance: two doors with the B and S handles */}
            <div className="ie-box">
              <div className="ie-flare" />
              <div className="ie-leaf ie-leaf-l">
                <div className="ie-face">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="ie-wood" src={src("door-left.webp")} alt="" decoding="async" loading="lazy" />
                  <div className="ie-shade" />
                </div>
                <div className="ie-handle ie-handle-b" style={{ ["--mask" as string]: `url(${src("handle-left.webp")})` }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src("handle-left.webp")} alt="" decoding="async" loading="lazy" />
                  <span className="ie-glint" />
                </div>
              </div>
              <div className="ie-leaf ie-leaf-r">
                <div className="ie-face">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="ie-wood" src={src("door-right.webp")} alt="" decoding="async" loading="lazy" />
                  <div className="ie-shade" />
                </div>
                <div className="ie-handle ie-handle-s" style={{ ["--mask" as string]: `url(${src("handle-right.webp")})` }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src("handle-right.webp")} alt="" decoding="async" loading="lazy" />
                  <span className="ie-glint" />
                </div>
                {/* The logo's divider line, as a brass strip over the meeting point of the doors */}
                <div className="ie-astragal">
                  <i />
                  <i />
                </div>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="ie-entrance" src={src("entrance.webp")} alt="" decoding="async" loading="lazy" />
              <div className="ie-spill" />
            </div>
            <div className="ie-bloom" />
            <GoldDust className="ie-dust" />

            {/* Scenes 03–06 — the rooms of the same home (each new view dissolves in over the last) */}
            {ROOMS.map((room) => (
              <div key={room.key} className="ie-room" data-room={room.key}>
                {/* phones: a warm, blurred backdrop made from the same picture */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="ie-room-bg" alt="" decoding="async" data-src={src(`${room.key}-blur.webp`)} loading="lazy" />
                <div className="ie-room-frame">
                  <picture>
                    <source media="(max-aspect-ratio: 1/1)" data-srcset={src(`${room.key}-m.webp`)} />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt=""
                      decoding="async"
                      data-srcset={
                        room.phoneOnly ? src(`${room.key}-m.webp`) : `${src(`${room.key}-1280.webp`)} 1280w, ${src(`${room.key}.webp`)} 2600w`
                      }
                      sizes="100vw"
                      loading="lazy"
                    />
                  </picture>
                </div>
                <div className="ie-scrim" />
              </div>
            ))}

            {/* Scene 07 — the frame of light into the homepage */}
            <div className="ie-arch">
              <div className="ie-arch-glow" />
              <svg preserveAspectRatio="none" focusable="false" aria-hidden="true">
                <defs>
                  <linearGradient id="ie-wall" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#3b2518" />
                    <stop offset="0.7" stopColor="#2a1a11" />
                    <stop offset="1" stopColor="#1f140d" />
                  </linearGradient>
                  <pattern id="ie-flutes" width="22" height="10" patternUnits="userSpaceOnUse">
                    <rect width="1" height="10" fill="rgb(236 213 164 / 0.07)" />
                  </pattern>
                  <linearGradient id="ie-floor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#4a3020" />
                    <stop offset="1" stopColor="#1b120c" />
                  </linearGradient>
                </defs>
                <path className="ie-arch-wall" fillRule="evenodd" fill="url(#ie-wall)" d="" />
                <path className="ie-arch-wall-flutes" fillRule="evenodd" fill="url(#ie-flutes)" d="" />
                <rect className="ie-arch-floor" x="0" width="100%" fill="url(#ie-floor)" />
                <path className="ie-arch-trim" fill="none" stroke="#d6b16d" strokeWidth="1.6" d="" />
              </svg>
              <div className="ie-arch-refl" />
              <div className="ie-arch-bloom" />
            </div>

            <div className="ie-vignette" />
          </div>

          {/* Words and controls */}
          <div className="ie-ui">
            <div className="ie-top">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="ie-brand" src={versionedSrc("/images/brand/logo-mark.png")} alt="" width={400} height={275} aria-hidden="true" />
              <button type="button" className="ie-skip" onClick={() => finishRef.current("skip")}>
                Skip Intro
                <span aria-hidden="true">→</span>
              </button>
            </div>

            <div className="ie-hello" aria-hidden="true">
              <div className="ie-hello-in">
                <span className="ie-rule" />
                <p className="ie-hello-title">
                  Every beautiful space{" "}
                  <br />
                  begins with a <em>vision.</em>
                </p>
              </div>
            </div>

            <button type="button" className="ie-cue" onClick={scrollIn} aria-label="Scroll to enter">
              <span className="ie-cue-in">
                <span>Scroll to Enter</span>
                <ChevronDown className="ie-cue-arrow" aria-hidden="true" />
              </span>
            </button>

            <p className="ie-doorcap" aria-hidden="true">
              Open the door to <em>better living.</em>
            </p>

            {ROOMS.map((room) => (
              <div key={room.key} className="ie-cap" aria-hidden="true">
                <span className="ie-cap-label">{room.label}</span>
                <p className="ie-cap-title">{room.title}</p>
              </div>
            ))}

            <div className="ie-progress" aria-hidden="true">
              <span />
            </div>
          </div>
        </div>

        <div ref={heroRef} className="ie-hero">
          {children}
        </div>
      </div>
      <div ref={trackRef} className="ie-track" aria-hidden="true" />
    </div>
  );
}
