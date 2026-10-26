import type { Testimonial } from "./types";

/**
 * CLIENT TESTIMONIALS
 * ---------------------------------------------------------------
 * Use only real testimonials, with the client's permission.
 *  - videoUrl:  the YouTube URL of the testimonial video (unlisted works).
 *  - quote:     the client's exact words (optional). Never write one on their behalf.
 *  - rating:    only if verified (e.g. from a Google review). Leave undefined otherwise.
 *  - clientLabel: their name, or an approved label such as "Homeowner".
 *
 * Until a video URL is added, the card shows a tasteful "coming soon" state.
 */
export const testimonials: Testimonial[] = [
  {
    id: "testimonial-01",
    clientLabel: "Homeowner",
    projectSlug: "project-01",
    quote: "",
    videoUrl: "",
    thumbnail: { src: "/images/testimonials/testimonial-01.jpg", alt: "", temporary: true },
  },
  {
    id: "testimonial-02",
    clientLabel: "Homeowner",
    projectSlug: "project-02",
    quote: "",
    videoUrl: "",
    thumbnail: { src: "/images/testimonials/testimonial-02.jpg", alt: "", temporary: true },
  },
];

export const getTestimonial = (id?: string) => testimonials.find((t) => t.id === id);
