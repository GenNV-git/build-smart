/**
 * Content model for the Build Smart website.
 * Every business fact the site shows lives in /src/content — edit those files, not the components.
 */

export type ImageAsset = {
  /** Path inside /public (e.g. "/images/projects/project-01/cover.jpg") or an allowed remote URL. */
  src: string;
  alt: string;
  /** true while a temporary stand-in image is used. Replace with a real photograph and set to false. */
  temporary?: boolean;
  /**
   * Which part of the photo stays visible when it is cropped to fit a frame (CSS object-position).
   * Default "50% 50%" (centre). Use e.g. "50% 25%" to keep faces near the top in view.
   */
  position?: string;
  /** Pixel size — filled in automatically for journey and service photos. */
  width?: number;
  height?: number;
};

/** Frame shapes for the journey collage. "auto" picks one from the photo's shape and position. */
export type PhotoFrame = "auto" | "rounded" | "square" | "circle" | "arch";

export type JourneyPhoto = ImageAsset & { file: string; frame: PhotoFrame };

export type JourneyPhotoDetails = {
  /** Short description of the photo (read aloud to blind visitors, used by Google). */
  alt?: string;
  frame?: PhotoFrame;
  position?: string;
  /** true = keep the file in the folder but don't show it. */
  hide?: boolean;
};

export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  summary: string;
  description: string;
  includes: string[];
  image: ImageAsset;
  icon: "home" | "sofa" | "kitchen" | "key" | "monitor";
};

export type ProjectGalleryItem = ImageAsset & { room?: string };

export type Project = {
  slug: string;
  /** Internal reference only (not shown on the site). */
  label: string;
  /** Real project name. Leave as a neutral name until the client approves one. */
  name: string;
  type: string;
  /** Leave empty until confirmed — it is hidden when empty. */
  location: string;
  /** Leave empty until confirmed — hidden when empty. */
  year: string;
  summary: string;
  overview: string[];
  scope: string[];
  concept: { intro: string; objectives: string[] };
  cover: ImageAsset;
  gallery: ProjectGalleryItem[];
  beforeAfter: { before: ImageAsset; after: ImageAsset; caption?: string }[];
  /** Walkthrough / progress video — YouTube, Instagram Reel or Google Drive link. Empty = not shown. */
  walkthroughVideoUrl: string;
  /** Handover video for this project — Instagram Reel, YouTube or Google Drive link. Shown when there's no walkthrough. */
  handoverVideoUrl?: string;
  /** id from testimonials.ts */
  testimonialId?: string;
  featured: boolean;
};

export type VideoPlatform = "youtube" | "instagram";
export type VideoCategory =
  | "site-visit"
  | "progress"
  | "client"
  | "handover"
  | "behind-the-scenes"
  | "milestone"
  | "insights";

export type Video = {
  id: string;
  title: string;
  subtitle: string;
  category: VideoCategory;
  platform: VideoPlatform;
  /** Full public URL of the Reel / Short / video. Empty = shown as "coming soon", never as playable. */
  url: string;
  /** Local thumbnail. For YouTube it falls back to the official thumbnail when empty. */
  thumbnail?: ImageAsset;
  /** 'portrait' for Reels/Shorts, 'landscape' for regular videos. */
  orientation: "portrait" | "landscape";
  featured?: boolean;
};

export type Testimonial = {
  id: string;
  /** Client name or an approved anonymous label, e.g. "Homeowner". */
  clientLabel: string;
  /** Slug of the related project. */
  projectSlug?: string;
  /** Exact words from the client — leave empty if not supplied. Never paraphrase or invent. */
  quote: string;
  /** Only set when verified (e.g. a real Google review). */
  rating?: number;
  /** YouTube URL of the testimonial video. */
  videoUrl: string;
  thumbnail?: ImageAsset;
  /** Video duration label, e.g. "1:42" (optional). */
  duration?: string;
};

export type Milestone = {
  id: string;
  /** Year or period, e.g. "2016 – 2019". Empty shows the milestone number instead. */
  period: string;
  title: string;
  /** Company or career stage. */
  organisation: string;
  role: string;
  story: string;
  /**
   * Photos are found automatically: every file in /public/images/journey/ named
   * milestone-<chapter number>….jpg (e.g. milestone-02.jpg, milestone-02-a.jpg, milestone-02-b.jpg).
   * Set this only if the chapter should use a different number than its position in the list.
   */
  photoNumber?: number;
  /** true until the real details are filled in. */
  placeholder?: boolean;
};
