import fs from "node:fs";
import path from "node:path";
import type { JourneyPhoto, JourneyPhotoDetails, Milestone } from "@/content/types";
import { readImageSize } from "./image-size";

const DIR = ["public", "images", "journey"];
// milestone-02.jpg · milestone-02-a.jpg · Milestone 02 b.JPG · milestone2_c.webp
const NAME = /^milestone[-_ ]?(\d{1,2})(?:[-_ ]+([a-z0-9]+))?\.(jpe?g|png|webp|avif)$/i;

/**
 * Finds every photo for each journey chapter in /public/images/journey/ (server-side, at build time).
 * Main photo (no letter) first, then -a, -b, -c …
 */
export function journeyPhotosFor(milestones: Milestone[], details: Record<string, JourneyPhotoDetails>): Record<string, JourneyPhoto[]> {
  const dir = path.join(/*turbopackIgnore: true*/ process.cwd(), ...DIR);
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir);
  } catch {
    files = [];
  }

  const byNumber = new Map<number, { file: string; suffix: string }[]>();
  for (const file of files) {
    const m = file.match(NAME);
    if (!m) continue;
    const num = Number(m[1]);
    const list = byNumber.get(num) ?? [];
    list.push({ file, suffix: (m[2] ?? "").toLowerCase() });
    byNumber.set(num, list);
  }

  const out: Record<string, JourneyPhoto[]> = {};
  milestones.forEach((ms, i) => {
    const num = ms.photoNumber ?? i + 1;
    const found = (byNumber.get(num) ?? []).sort((a, b) => (a.suffix === "" ? -1 : b.suffix === "" ? 1 : a.suffix.localeCompare(b.suffix, "en", { numeric: true })));
    const photos: JourneyPhoto[] = [];
    found.forEach(({ file }, k) => {
      const d = details[file] ?? details[file.toLowerCase()] ?? {};
      if (d.hide) return;
      const size = readImageSize(path.join(dir, file));
      photos.push({
        file,
        src: `/images/journey/${encodeURIComponent(file)}`,
        alt: d.alt ?? `${ms.title}${found.length > 1 ? ` — photo ${k + 1}` : ""}`,
        frame: d.frame ?? "auto",
        position: d.position,
        width: size?.width,
        height: size?.height,
      });
    });
    out[ms.id] = photos;
  });
  return out;
}
