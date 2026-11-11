import type { Metadata } from "next";
import { isSet, site } from "@/content/site";

/** Title shown in Google for the home page (other pages use "<page title> | Build Smart"). */
export const homeTitle = `${site.name} | Home Construction, Interior Design & Turnkey Homes${
  isSet(site.contact.serviceArea) ? ` in ${site.contact.serviceArea}` : ""
}`;

/** Adds the service area to a description once it is filled in (site.contact.serviceArea) — good for local searches. */
export const withArea = (text: string) => (isSet(site.contact.serviceArea) ? `${text} Serving ${site.contact.serviceArea}.` : text);

const defaultImage = { url: "/images/og-image.jpg", width: 1200, height: 630, alt: `${site.name} — ${site.descriptor}` };

/**
 * Complete search + sharing details for one page: title, description, canonical address,
 * and the preview card used by WhatsApp, Facebook, LinkedIn and X.
 * (In Next.js a page's `openGraph` replaces the site-wide one, so every page must carry the full set.)
 */
export function pageMeta({
  title,
  description,
  path,
  image,
  imageAlt,
}: {
  title: string;
  description: string;
  path: string;
  /** Path inside /public for the preview picture. Defaults to the site-wide one. */
  image?: string;
  imageAlt?: string;
}): Metadata {
  const fullTitle = path === "/" ? homeTitle : `${title} | ${site.name}`;
  const images = image ? [{ url: image, alt: imageAlt || title }] : [defaultImage];
  return {
    ...(path === "/" ? {} : { title }),
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: site.name, locale: "en_IN", url: path, title: fullTitle, description, images },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: images.map((i) => i.url) },
  };
}

/** "Home › Projects › Residential Home" trail for Google's results (schema.org BreadcrumbList). */
export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${site.url}${t.path === "/" ? "" : t.path}`,
    })),
  };
}
