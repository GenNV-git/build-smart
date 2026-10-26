import fs from "node:fs";
import path from "node:path";

/**
 * Reads the pixel size of a JPEG, PNG or WebP file without decoding it (server-side only).
 * Respects the EXIF orientation of phone photos (portrait shots stored sideways).
 */
export function readImageSize(file: string): { width: number; height: number } | null {
  let fd: number | undefined;
  try {
    fd = fs.openSync(file, "r");
    const buf = Buffer.alloc(512 * 1024);
    const n = fs.readSync(fd, buf, 0, buf.length, 0);
    return parse(buf.subarray(0, n));
  } catch {
    return null;
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
}

/** Size of an image referenced by its public URL, e.g. "/images/services/home-construction.jpg". */
export function publicImageSize(src: string) {
  if (!src.startsWith("/")) return null;
  const rel = decodeURIComponent(src).replace(/^\/+/, "");
  if (rel.includes("..")) return null;
  return readImageSize(path.join(/*turbopackIgnore: true*/ process.cwd(), "public", rel));
}

function parse(b: Buffer): { width: number; height: number } | null {
  if (b.length < 30) return null;
  // PNG
  if (b.readUInt32BE(0) === 0x89504e47) return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  // WebP
  if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
    const kind = b.toString("ascii", 12, 16);
    if (kind === "VP8 ") return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
    if (kind === "VP8L") {
      const bits = b.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    if (kind === "VP8X") return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
    return null;
  }
  // JPEG
  if (b[0] === 0xff && b[1] === 0xd8) {
    let o = 2;
    let orientation = 1;
    while (o < b.length - 9) {
      if (b[o] !== 0xff) {
        o++;
        continue;
      }
      const m = b[o + 1];
      if (m === 0xd8 || m === 0x01 || (m >= 0xd0 && m <= 0xd7) || m === 0xff) {
        o += m === 0xff ? 1 : 2;
        continue;
      }
      const len = b.readUInt16BE(o + 2);
      if (m === 0xe1 && b.toString("ascii", o + 4, o + 8) === "Exif") orientation = exifOrientation(b, o + 10) ?? 1;
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
        const height = b.readUInt16BE(o + 5);
        const width = b.readUInt16BE(o + 7);
        return orientation >= 5 && orientation <= 8 ? { width: height, height: width } : { width, height };
      }
      o += 2 + len;
    }
  }
  return null;
}

function exifOrientation(b: Buffer, tiff: number): number | null {
  try {
    const le = b.toString("ascii", tiff, tiff + 2) === "II";
    const u16 = (p: number) => (le ? b.readUInt16LE(p) : b.readUInt16BE(p));
    const u32 = (p: number) => (le ? b.readUInt32LE(p) : b.readUInt32BE(p));
    const ifd = tiff + u32(tiff + 4);
    const entries = u16(ifd);
    for (let i = 0; i < entries; i++) {
      const e = ifd + 2 + i * 12;
      if (u16(e) === 0x0112) return u16(e + 8);
    }
  } catch {
    /* ignore malformed EXIF */
  }
  return null;
}
