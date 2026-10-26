import type { Service } from "./types";

/**
 * SERVICES
 * Images marked `temporary: true` are stand-ins. Replace them with real project
 * photographs in /public/images/services/ and update `src`.
 */
export const services: Service[] = [
  {
    slug: "home-construction",
    title: "Home Construction",
    shortTitle: "Construction",
    tagline: "Strong foundations for brighter futures.",
    summary: "Independent homes built with sound structure, honest materials and careful supervision.",
    description:
      "We build homes the way they should be built — on a sound structural plan, with materials chosen for how they will perform for decades, and with supervision at every stage. You always know what is being built, why, and what comes next.",
    includes: [
      "Planning support and construction drawings coordination",
      "Structure, masonry and finishing works",
      "Material selection guidance",
      "Regular site supervision and progress updates",
      "Quality checks at each stage",
    ],
    image: { src: "/images/services/home-construction.jpg", alt: "Contemporary two-storey home with warm exterior lighting at dusk", temporary: false },
    icon: "home",
  },
  {
    slug: "interior-design",
    title: "Interior Design",
    shortTitle: "Interiors",
    tagline: "Beautiful spaces that reflect you.",
    summary: "Considered interiors that balance warmth, function and the way you actually live.",
    description:
      "Good interiors begin with listening. We study how your family uses each room, then shape layouts, lighting, materials and furniture into a home that feels calm, practical and unmistakably yours.",
    includes: [
      "Space planning and furniture layouts",
      "Material, colour and finish palettes",
      "Lighting and false-ceiling design",
      "Custom furniture and joinery",
      "Décor and styling for the finished space",
    ],
    image: { src: "/images/services/interior-design.jpg", alt: "Living room with a curved sectional sofa and layered ceiling lighting", temporary: false },
    icon: "sofa",
  },
  {
    slug: "turnkey-projects",
    title: "Turnkey Project Management",
    shortTitle: "Turnkey Projects",
    tagline: "One team, from concept to keys.",
    summary: "A single point of responsibility for design, execution, coordination and handover.",
    description:
      "With a turnkey engagement, Build Smart takes responsibility for the whole journey — design, procurement, site execution and the trades in between — so you deal with one accountable team instead of many contractors.",
    includes: [
      "End-to-end planning and scheduling",
      "Coordination of all trades and vendors",
      "Procurement and material tracking",
      "Transparent progress reporting",
      "Snag list, final finishing and handover",
    ],
    image: { src: "/images/services/turnkey-projects.jpg", alt: "Handing over the keys of a finished home to its owners", position: "40% 50%", temporary: false },
    icon: "key",
  },
  {
    slug: "digital-solutions",
    title: "Digital Solutions",
    shortTitle: "Digital Solutions",
    tagline: "Modern tools for a seamless experience.",
    // TODO: confirm the exact scope of Build Smart's digital solutions offering.
    summary: "Digital design presentations and clear online communication throughout your project.",
    description:
      "We use digital tools to help you see your space before it is built and to keep every decision documented — so the project stays clear, organised and easy to follow wherever you are.",
    includes: [
      "Digital layouts and design presentations",
      "Visualisations to review design options",
      "Organised online sharing of drawings and updates",
      "Remote project check-ins",
    ],
    image: { src: "/images/services/digital-solutions.jpg", alt: "Digital marketing dashboard for construction and interior businesses", temporary: false },
    icon: "monitor",
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
