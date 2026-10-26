/**
 * Shrinks heavy photos in /public/images so pages stay fast on phones.
 *  - Any JPG/WebP larger than 600 KB, or wider/taller than 2200 px, is resized to fit 2000 px
 *    and saved at high quality (you won't see a difference on screen).
 *  - The untouched original is kept in /photo-originals/ (same folder structure), once.
 *  - PNG photos are only resized (to keep them lossless) — save photos as .jpg when you can.
 *
 * Runs automatically before `npm run dev` and `npm run build`. Run it by hand with `npm run photos`.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public", "images");
const BACKUP = path.join(ROOT, "photo-originals");
const SKIP = [/^brand[\\/]/, /^og-image\./];
const MAX_BYTES = 600 * 1024;
const MAX_EDGE = 2200;
const TARGET_EDGE = 2000;

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.log("optimize-photos: image tool not available — skipped (the site still works).");
  process.exit(0);
}

function walk(dir, out = []) {
  for (const e of fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }) : []) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(jpe?g|png|webp)$/i.test(e.name)) out.push(p);
  }
  return out;
}

let changed = 0;
let saved = 0;
for (const file of walk(PUBLIC)) {
  const rel = path.relative(PUBLIC, file);
  if (SKIP.some((r) => r.test(rel))) continue;
  try {
    const bytes = fs.statSync(file).size;
    const meta = await sharp(file).metadata();
    const edge = Math.max(meta.width ?? 0, meta.height ?? 0);
    const ext = path.extname(file).toLowerCase();
    const isPng = ext === ".png";
    if (bytes <= MAX_BYTES && edge <= MAX_EDGE) continue;
    if (isPng && edge <= MAX_EDGE) {
      console.log(`optimize-photos: ${rel} is a large PNG — saving it as .jpg would make it much lighter.`);
      continue;
    }

    const backup = path.join(BACKUP, rel);
    if (!fs.existsSync(backup)) {
      fs.mkdirSync(path.dirname(backup), { recursive: true });
      fs.copyFileSync(file, backup);
    }

    let img = sharp(fs.readFileSync(file)).rotate().resize(TARGET_EDGE, TARGET_EDGE, { fit: "inside", withoutEnlargement: true });
    if (isPng) img = img.png({ compressionLevel: 9 });
    else if (ext === ".webp") img = img.webp({ quality: 82 });
    else img = img.jpeg({ quality: 84, progressive: true, mozjpeg: true });
    const out = await img.toBuffer();
    if (out.length >= bytes) continue;

    const tmp = file + ".tmp";
    fs.writeFileSync(tmp, out);
    fs.renameSync(tmp, file);
    changed++;
    saved += bytes - out.length;
    console.log(`optimize-photos: ${rel}  ${Math.round(bytes / 1024)} KB → ${Math.round(out.length / 1024)} KB`);
  } catch (err) {
    console.log(`optimize-photos: could not process ${rel} (${err instanceof Error ? err.message : err}) — left as it is.`);
  }
}
if (changed) console.log(`optimize-photos: ${changed} photo(s) made lighter, ${Math.round(saved / 1024)} KB saved. Originals are in /photo-originals.`);
