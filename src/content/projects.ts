import type { Project } from "./types";

/**
 * PROJECTS
 * ---------------------------------------------------------------
 * Two completed residential projects, ready for real content.
 *
 * How to update a project:
 *  1. Put photographs in /public/images/projects/<slug>/ (landscape, ≥ 2000px wide, JPG/WebP).
 *  2. Replace `cover` and `gallery` paths and set `temporary: false`.
 *  3. Fill in name, location, year, overview, scope and concept with real, approved details.
 *  4. Paste the YouTube walkthrough URL into `walkthroughVideoUrl`.
 *  5. Add before/after pairs only when real photos exist.
 *
 * Empty fields are hidden automatically. Nothing here should be invented.
 */
export const projects: Project[] = [
  {
    slug: "project-01",
    label: "Project 01",
    name: "Residential Home", // TODO: approved project name
    type: "Residential Home",
    location: "", // TODO: e.g. "Anna Nagar, Chennai" — only once confirmed
    year: "",
    summary: "A completed residential project, designed and delivered by Build Smart.", // TODO: one-line description
    overview: [
      "One of the first homes completed by Build Smart. The full case study — the brief, the decisions and the finished rooms — will be published here shortly.",
    ],
    scope: [], // TODO: e.g. ["Interior design", "False ceiling & lighting", "Painting & finishes"]
    concept: { intro: "", objectives: [] },
    cover: { src: "/images/projects/project-01/cover.jpg", alt: "The Build Smart team celebrating a home handover with the family", position: "50% 35%", temporary: false },
    gallery: [
      { src: "/images/projects/project-01/gallery-1.jpg", alt: "Living room overview", room: "Living", temporary: true },
      { src: "/images/projects/project-01/gallery-2.jpg", alt: "Dining area beneath a glass pendant light", room: "Dining", temporary: true },
      { src: "/images/projects/project-01/gallery-3.jpg", alt: "Kitchen with warm under-cabinet lighting", room: "Kitchen", temporary: true },
    ],
    beforeAfter: [],
    walkthroughVideoUrl: "",
    testimonialId: "testimonial-01",
    featured: true,
  },
  {
    slug: "project-02",
    label: "Project 02",
    name: "Residential Home", // TODO: approved project name
    type: "Residential Home",
    location: "",
    year: "",
    summary: "A completed residential project, designed and delivered by Build Smart.", // TODO: one-line description
    overview: [
      "A completed Build Smart residence. Photographs, the scope of work and the client's story will be added here shortly.",
    ],
    scope: [],
    concept: { intro: "", objectives: [] },
    cover: { src: "/images/projects/project-02/cover.jpg", alt: "Handing over the completed home to the family", position: "50% 30%", temporary: false },
    gallery: [
      { src: "/images/projects/project-02/gallery-1.jpg", alt: "Main bedroom", room: "Bedroom", temporary: true },
      { src: "/images/projects/project-02/gallery-2.jpg", alt: "Bedroom with layered bedding and warm lamps", room: "Bedroom", temporary: true },
      { src: "/images/projects/project-02/gallery-3.jpg", alt: "Lounge with a curved coffee table", room: "Lounge", temporary: true },
    ],
    beforeAfter: [],
    walkthroughVideoUrl: "",
    testimonialId: "testimonial-02",
    featured: true,
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
