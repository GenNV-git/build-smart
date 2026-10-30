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

/**
 * Instagram's official embed player for a Reel / post link, e.g.
 * https://www.instagram.com/reel/AbC123xyz/?utm_source=… → https://www.instagram.com/reel/AbC123xyz/embed/
 * The video streams from Instagram — nothing is downloaded or stored on this website.
 */
export function instagramEmbed(url?: string | null): { embedUrl: string; postUrl: string } | null {
  if (!url) return null;
  try {
    const u = new URL(url.trim());
    if (!/(^|\.)instagram\.com$/.test(u.hostname)) return null;
    const m = u.pathname.match(/^\/(?:[A-Za-z0-9_.]+\/)?(reel|reels|p|tv)\/([A-Za-z0-9_-]{5,40})\/?/);
    if (!m) return null;
    const kind = m[1] === "reels" ? "reel" : m[1];
    return {
      embedUrl: `https://www.instagram.com/${kind}/${m[2]}/embed/`,
      postUrl: `https://www.instagram.com/${kind}/${m[2]}/`,
    };
  } catch {
    return null;
  }
}

/**
 * Google Drive video ("Anyone with the link can view") → Drive's own player, e.g.
 * https://drive.google.com/file/d/1AbC…/view?usp=sharing → https://drive.google.com/file/d/1AbC…/preview
 * The video streams from Google Drive — nothing is stored on this website.
 */
export function driveEmbed(url?: string | null): { embedUrl: string; viewUrl: string } | null {
  if (!url) return null;
  try {
    const u = new URL(url.trim());
    if (u.hostname !== "drive.google.com") return null;
    const id = u.pathname.match(/\/file\/d\/([A-Za-z0-9_-]{10,})/)?.[1] ?? u.searchParams.get("id");
    if (!id || !/^[A-Za-z0-9_-]{10,}$/.test(id)) return null;
    return { embedUrl: `https://drive.google.com/file/d/${id}/preview`, viewUrl: `https://drive.google.com/file/d/${id}/view` };
  } catch {
    return null;
  }
}
