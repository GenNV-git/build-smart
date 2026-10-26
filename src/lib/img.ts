import versions from "@/content/image-versions.json";

const map = versions as Record<string, string>;

/** Adds the photo's fingerprint ("?v=…") to a local image address. Remote and unknown images are left as they are. */
export function versionedSrc(src: string): string {
  if (!src.startsWith("/") || src.includes("?")) return src;
  let key = src;
  try {
    key = decodeURIComponent(src);
  } catch {}
  const v = map[key];
  return v ? `${src}?v=${v}` : src;
}
