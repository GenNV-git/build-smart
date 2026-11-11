import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/** Lets phones "Add to Home Screen" with the right name, icon and colours. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.descriptor}`,
    short_name: site.name,
    description: site.shortDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#24170f",
    theme_color: "#24170f",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
