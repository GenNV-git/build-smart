import type { ImageAsset } from "./types";

/**
 * PAGE IMAGES (heroes, banners, the home "About" collage)
 * ---------------------------------------------------------------
 * EASIEST WAY TO CHANGE A PICTURE:
 *   Replace the file in /public/images/... with your own photo, using the SAME file name.
 *   Then change `temporary: true` to `temporary: false` below.
 *
 * Images for services, projects, videos, testimonials and Sanjay's timeline
 * are set in their own files in this folder (services.ts, projects.ts, …).
 */
export const images = {
  /** Home page hero — landscape, at least 2400 px wide. */
  homeHero: {
    src: "/images/hero/home-hero.jpg",
    alt: "Warmly lit modern living room designed for comfortable family living",
    temporary: true,
  },
  /** Home "About Build Smart" collage — one tall photo and one small photo. */
  aboutCollageLarge: {
    src: "/images/about/collage-large.jpg",
    alt: "Double-height staircase with a cascading crystal chandelier",
    temporary: false,
  },
  aboutCollageSmall: {
    src: "/images/about/collage-small.jpg",
    alt: "Bedroom with a warm-lit panelled wall and a soft chandelier",
    temporary: false,
  },
  /** "Ready to Transform Your Space?" banner background. */
  ctaBanner: { src: "/images/banners/cta.jpg", alt: "", temporary: true },
  /** Photo beside the timed "Get a Free Quote" pop-up. */
  quotePopup: {
    src: "/images/services/interior-design.jpg",
    alt: "Living room with a curved sectional sofa and layered ceiling lighting",
    temporary: false,
  },
  /** Top banners of the inner pages. */
  servicesHero: { src: "/images/banners/services.jpg", alt: "", temporary: true },
  videosHero: { src: "/images/banners/videos.jpg", alt: "", temporary: true },
  contactHero: { src: "/images/banners/contact.jpg", alt: "", temporary: false },
} satisfies Record<string, ImageAsset>;
