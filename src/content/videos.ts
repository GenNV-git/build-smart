import type { Video, VideoCategory } from "./types";

/**
 * SANJAY'S VIDEOS — Reels, Shorts and creator content
 * ---------------------------------------------------------------
 * For each video paste the public URL:
 *   YouTube:   https://www.youtube.com/shorts/<id>  or  https://youtu.be/<id>
 *   Instagram: https://www.instagram.com/reel/<code>/
 *
 * Both YouTube and Instagram videos play inside the site, in the official players
 * (loaded only when the visitor presses play — nothing is downloaded or stored here).
 * Instagram doesn't share cover pictures, so give each Reel a `thumbnail` (any photo on the site works).
 * `featured: true` makes a video the large one on the home and Videos pages.
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
  },
  {
    id: "handover",
    title: "Project Handover",
    subtitle: "Keys to a finished home",
    category: "handover",
    platform: "instagram",
    url: "https://www.instagram.com/reel/DcqmCEIT5jm/",
    // Cover picture for the card (re-uses the handover photo already on the site — no extra files).
    thumbnail: { src: "/images/projects/project-02/cover.jpg", alt: "Handing over the completed home to the family", position: "50% 30%", temporary: false },
    orientation: "portrait",
    featured: true,
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
