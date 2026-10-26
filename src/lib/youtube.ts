/** Extracts a YouTube video id from watch, youtu.be, shorts, embed and live URLs. */
export function youtubeId(url?: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\.|^m\./, "");
    if (host === "youtu.be") return clean(u.pathname.slice(1));
    if (host === "youtube.com" || host === "youtube-nocookie.com" || host === "music.youtube.com") {
      if (u.searchParams.get("v")) return clean(u.searchParams.get("v"));
      const m = u.pathname.match(/^\/(?:shorts|embed|live|v)\/([^/?#]+)/);
      if (m) return clean(m[1]);
    }
  } catch {
    /* not a URL */
  }
  return null;
}

function clean(id: string | null): string | null {
  return id && /^[A-Za-z0-9_-]{6,20}$/.test(id) ? id : null;
}

export const youtubeEmbedUrl = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

export const youtubeThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

export function isInstagramUrl(url?: string | null): boolean {
  if (!url) return false;
  try {
    return /(^|\.)instagram\.com$/.test(new URL(url).hostname);
  } catch {
    return false;
  }
}
