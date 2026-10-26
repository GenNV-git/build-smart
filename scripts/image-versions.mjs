/**
 * Writes src/content/image-versions.json: a short fingerprint of every file in /public/images.
 * Image addresses get "?v=<fingerprint>", so when a photo is replaced (even with the same name)
 * browsers and the image optimiser fetch the new one instead of an old cached copy.
 *
 * Runs automatically when `npm run dev` / `npm run build` start (see next.config.ts),
 * and again whenever a file in /public/images changes while `npm run dev` is running.
 */
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = process.cwd();
const IMAGES = path.join(ROOT, "public", "images");
const OUT = path.join(ROOT, "src", "content", "image-versions.json");
const EXT = /\.(jpe?g|png|webp|avif|gif|svg)$/i;

function walk(dir, out = []) {
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (EXT.test(e.name)) out.push(p);
  }
  return out;
}

export function writeImageVersions() {
  const versions = {};
  for (const file of walk(IMAGES).sort()) {
    const url = "/" + path.relative(path.join(ROOT, "public"), file).split(path.sep).join("/");
    versions[url] = createHash("sha1").update(fs.readFileSync(file)).digest("hex").slice(0, 10);
  }
  const json = JSON.stringify(versions, null, 2) + "\n";
  let current = "";
  try {
    current = fs.readFileSync(OUT, "utf8");
  } catch {}
  if (current !== json) fs.writeFileSync(OUT, json);
  return Object.keys(versions).length;
}

let watching = false;
/** While `next dev` runs: refresh the fingerprints when photos are added, replaced or removed. */
export function watchImageVersions() {
  if (watching) return;
  watching = true;
  let timer;
  try {
    fs.watch(IMAGES, { recursive: true }, () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        try {
          writeImageVersions();
        } catch {}
      }, 400);
    });
  } catch {
    /* recursive watch unsupported — restart `npm run dev` after changing photos */
  }
}

// Allow `node scripts/image-versions.mjs`
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(`image-versions: ${writeImageVersions()} images fingerprinted`);
}
