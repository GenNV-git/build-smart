import type { Video, VideoCategory } from "./types";

/**
 * SANJAY'S VIDEOS — Reels, Shorts and creator content
 * ---------------------------------------------------------------
 * For each video paste the public URL:
 *   YouTube:   https://www.youtube.com/shorts/<id>  or  https://youtu.be/<id>
 *   Instagram: https://www.instagram.com/reel/<code>/
 *
 * YouTube videos play inside the site (the player loads only on click).
 * Instagram Reels open on Instagram — save a thumbnail into /public/images/videos/.
 *
 * A video with an empty `url` is shown as "Coming soon" and is never presented as playable.
 * The slots below mirror the content mix in the brief — retitle or remove as needed.
 */
export const videos: Video[] = [
  {
    id: "team",
    title: "Our Team, Our Strength",
    subtitle: "The people who make it happen",
    category: "behind-the-scenes",
    platform: "instagram",
    url: "",
    thumbnail: { src: "/images/videos/team.jpg", alt: "", temporary: true },
    orientation: "landscape",
    featured: true,
  },
  {
    id: "handover",
    title: "Project Handover",
    subtitle: "Keys to a finished home",
    category: "handover",
    platform: "instagram",
    url: "",
    thumbnail: { src: "/images/videos/handover.jpg", alt: "", temporary: true },
    orientation: "portrait",
  },
  {
    id: "site-visit",
    title: "Site Visit",
    subtitle: "On site with Sanjay",
    category: "site-visit",
    platform: "youtube",
    url: "",
    thumbnail: { src: "/images/videos/site-visit.jpg", alt: "", temporary: true },
    orientation: "portrait",
  },
  {
    id: "client-interaction",
    title: "Client Interaction",
    subtitle: "Real conversations",
    category: "client",
    platform: "instagram",
    url: "",
    thumbnail: { src: "/images/videos/client-interaction.jpg", alt: "", temporary: true },
    orientation: "portrait",
  },
  {
    id: "progress",
    title: "Project Progress",
    subtitle: "Week by week on site",
    category: "progress",
    platform: "youtube",
    url: "",
    thumbnail: { src: "/images/videos/progress.jpg", alt: "", temporary: true },
    orientation: "portrait",
  },
  {
    id: "behind-the-scenes",
    title: "Behind the Scenes",
    subtitle: "Details most people never see",
    category: "behind-the-scenes",
    platform: "instagram",
    url: "",
    thumbnail: { src: "/images/videos/behind-the-scenes.jpg", alt: "", temporary: true },
    orientation: "portrait",
  },
  {
    id: "milestone",
    title: "Milestones",
    subtitle: "Moments worth celebrating",
    category: "milestone",
    platform: "instagram",
    url: "",
    thumbnail: { src: "/images/videos/milestone.jpg", alt: "", temporary: true },
    orientation: "portrait",
  },
  {
    id: "insights",
    title: "Building Insights",
    subtitle: "Tips from the site",
    category: "insights",
    platform: "youtube",
    url: "",
    thumbnail: { src: "/images/videos/insights.jpg", alt: "", temporary: true },
    orientation: "portrait",
  },
];

export const videoCategories: Record<VideoCategory, string> = {
  "site-visit": "Site Visits",
  progress: "Project Progress",
  client: "Client Interactions",
  handover: "Handovers",
  "behind-the-scenes": "Behind the Scenes",
  milestone: "Milestones",
  insights: "Insights",
};

export const featuredVideo = videos.find((v) => v.featured) ?? videos[0];
