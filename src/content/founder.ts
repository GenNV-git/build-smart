import type { ImageAsset, JourneyPhotoDetails, Milestone } from "./types";

/**
 * FOUNDER — SANJAY
 * ---------------------------------------------------------------
 * The copy below uses only what the brief states: Sanjay is a construction
 * professional, founder of Build Smart, and shares his work on Instagram and
 * YouTube. Replace / extend with his real biography — do not add achievements
 * or employers that are not true.
 */

export const founder = {
  name: "Sanjay",
  role: "Founder, Build Smart",
  /** Professional portrait — /public/images/founder/ (portrait orientation). `position` moves the crop, e.g. "50% 20%". */
  portrait: { src: "/images/founder/sanjay.jpg", alt: "Sanjay" } as ImageAsset,
  /** YouTube URL for "Watch My Story" — the button only appears when this is set. */
  storyVideoUrl: "",

  intro: [
    "Sanjay is a construction professional and the founder of Build Smart. He started the company with a simple belief: a home should be built with the same care its family will bring to living in it.",
    "He is on site, in the details and in front of the camera — sharing real progress, honest lessons and finished spaces with a growing community online, so homeowners can see exactly how good work is done.",
  ],

  // TODO: add a paragraph on Sanjay's professional background (education, years in the field, key experience).
  background: "",

  approach:
    "For Sanjay, good construction is invisible discipline: the right structure, the right materials and the right sequence, so the beautiful parts of a home last. Interiors then add the warmth — and both have to work together from day one.",

  values: [
    { title: "Transparency", text: "Clear scope, clear updates and honest answers — at every stage of the work." },
    { title: "Craftsmanship", text: "Attention to the details most people never see, because that's what makes a home last." },
    { title: "Function first", text: "Spaces planned around daily life, then made beautiful." },
    { title: "Ownership", text: "One accountable team, from the first conversation to the handover." },
  ],

  vision:
    "To grow Build Smart into a name families trust for homes that are thoughtfully designed, properly built and genuinely enjoyed — one carefully delivered project at a time.",

  beyondTheSite: [
    { title: "Construction experience", text: "Hands-on knowledge of how buildings come together — structure, services and finishes.", icon: "hardhat" },
    { title: "Design philosophy", text: "Functional, warm and timeless spaces that reflect the people who live in them.", icon: "compass" },
    { title: "Client relationships", text: "Projects built on regular conversation, site visits and trust.", icon: "handshake" },
    { title: "Sharing the craft", text: "Reels and Shorts that open up the building process to everyone.", icon: "video" },
  ],
} as const;

/**
 * CAREER TIMELINE — the curved journey on /about.
 * ---------------------------------------------------------------
 * PHOTOS ARE ADDED AUTOMATICALLY. Put them in /public/images/journey/ named by chapter number:
 *
 *   Chapter 1 → milestone-01.jpg (main photo), milestone-01-a.jpg, milestone-01-b.jpg …
 *   Chapter 2 → milestone-02.jpg, milestone-02-a.jpg, milestone-02-b.jpg …
 *
 * Any number of photos works: 1 shows a large single frame, 2–3 an overlapping collage,
 * 4 or more a staggered gallery (up to 6 on the page — all of them open in the full-screen viewer).
 * Each frame is shaped to fit its photo, and photos are centred in their frames.
 *
 * Optional — describe a photo, choose its frame, or move the crop: add a line to journeyPhotoDetails below.
 *   frame:    "rounded" (curved corners) · "square" · "circle" · "arch" · "auto"
 *   position: which part stays visible when cropped, e.g. "50% 50%" (centre, default) or "50% 20%" (towards the top)
 *
 * Optional: add years in `period` (e.g. "2018 – 2021"); left empty, the chip shows "Chapter 01", "Chapter 02" …
 */
export const journeyPhotoDetails: Record<string, JourneyPhotoDetails> = {
  "milestone-01.jpg": { alt: "Sanjay on his graduation day, holding his degree certificate", frame: "arch" },
  "milestone-01-a.jpg": { alt: "Sanjay surveying a site with a levelling instrument at sunset", frame: "rounded" },
  "milestone-02-a.jpg": { alt: "Sanjay pouring concrete for a foundation on site", frame: "rounded" },
  "milestone-02-b.jpg": { alt: "Pouring concrete over steel reinforcement on a building site", frame: "circle" },
  "milestone-03.jpg": { alt: "Sanjay speaking at an industry event", frame: "rounded" },
  "milestone-03-a.jpg": { alt: "Sanjay with a fellow professional at an industry event", frame: "circle" },
  "milestone-03-b.jpg": { alt: "Sanjay meeting an industry leader at an event", frame: "square" },
  "milestone-03-c.jpg": { alt: "Sanjay with fellow professionals at an event", frame: "rounded" },
  "milestone-04.jpg": { alt: "Sanjay presenting the Build Smart brand", frame: "rounded" },
  "milestone-05-a.jpg": { alt: "Handing over a completed home to the family", frame: "arch" },
  "milestone-05-b.jpg": { alt: "Celebrating a home handover with the family", frame: "rounded" },
  "milestone-06.jpg": { alt: "Sanjay filming Build Smart interior design content", frame: "arch" },
};

export const milestones: Milestone[] = [
  {
    id: "m1",
    period: "",
    title: "Engineered from the Ground Up",
    organisation: "Bachelor's Degree · Civil Engineering",
    role: "Civil Engineering Graduate",
    story:
      "Sanjay's journey began with a Bachelor's degree in Civil Engineering — a grounding in structural design, materials and construction methods that still guides every decision he makes on site.",
  },
  {
    id: "m2",
    period: "",
    title: "Mastering the Site",
    organisation: "Construction & Site Execution",
    role: "Hands-on Site Experience",
    story:
      "From foundations and reinforcement to concreting and finishing, he learnt construction where it matters most — on site — building a deep, practical understanding of quality, sequence and workmanship.",
  },
  {
    id: "m3",
    period: "",
    title: "Building a Digital Edge",
    organisation: "Digital Marketing & Brand Strategy",
    role: "Digital Strategy",
    story:
      "Recognising how homeowners now discover and choose their builders, Sanjay trained in digital marketing — adding brand building, content strategy and online communication to his engineering expertise.",
  },
  {
    id: "m4",
    period: "",
    title: "Founding Build Smart",
    organisation: "Build Smart",
    role: "Founder",
    story:
      "With wide experience across construction and interiors, Sanjay founded Build Smart — bringing design, construction, interiors and digital solutions together under one accountable team.",
  },
  {
    id: "m5",
    period: "",
    title: "Homes Built on Trust",
    organisation: "Build Smart",
    role: "Founder & Project Lead",
    story:
      "Every home is delivered with a personal handover and the family's confidence. Transparent communication, careful execution and lasting relationships have become the hallmark of Build Smart.",
  },
  {
    id: "m6",
    period: "Today",
    title: "Sharing the Craft",
    organisation: "Instagram & YouTube",
    role: "Creator & Industry Voice",
    story:
      "Today Sanjay shares his experience with a growing community online — real site progress, practical construction insights and finished spaces, helping homeowners build with clarity and confidence.",
  },
];
