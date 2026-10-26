/**
 * npm run leads
 * Turns the enquiries saved on this computer (data/leads.jsonl) into data/enquiries.csv,
 * which opens in Excel or Google Sheets. Times are shown in India time (IST).
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, process.env.LEAD_FILE_PATH || "data/leads.jsonl");
const OUT = path.join(ROOT, "data", "enquiries.csv");

if (!fs.existsSync(SRC)) {
  console.log("No enquiries yet — data/leads.jsonl doesn't exist. Submit the form once and run this again.");
  process.exit(0);
}

const leads = fs
  .readFileSync(SRC, "utf8")
  .split(/\r?\n/)
  .filter(Boolean)
  .map((line) => {
    try {
      return JSON.parse(line);
    } catch {
      return null;
    }
  })
  .filter(Boolean)
  .reverse(); // newest first

const sourceNames = {
  "home-hero": "Home page form",
  "contact-page": "Contact page",
  "auto-popup": "Quote pop-up",
  header: "Get a Quote button",
  "mobile-bar": "Phone bottom bar",
  "mobile-menu": "Phone menu",
};
const ist = (iso) =>
  new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" });
// Quote every cell; neutralise values Excel could treat as formulas.
const cell = (v) => {
  if (v && typeof v === "object" && raw in v) return `"${v[raw]}"`;
  let s = v == null ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return `"${s.replace(/"/g, '""')}"`;
};

/** "+916383940823" → " +91 63839 40823" (the leading space keeps Excel from treating it as a number or formula). */
const phone = (v) => {
  const d = String(v || "").replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) return ` +91 ${d.slice(2, 7)} ${d.slice(7)}`;
  if (d.length === 10) return ` +91 ${d.slice(0, 5)} ${d.slice(5)}`;
  return ` ${String(v || "").trim()}`;
};
const raw = Symbol("raw");

const header = ["Received (IST)", "Name", "Phone / WhatsApp", "Project type", "City / location", "Budget", "Best time to call", "Message", "Came from"];
const rows = leads.map((l) => [
  ist(l.createdAt),
  l.name,
  { [raw]: phone(l.phone) },
  l.projectType,
  l.location,
  l.budget,
  l.contactTime,
  l.message,
  sourceNames[l.source] || l.source || "",
]);
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, "﻿" + [header, ...rows].map((r) => r.map(cell).join(",")).join("\r\n") + "\r\n");

console.log(`\n${leads.length} enquir${leads.length === 1 ? "y" : "ies"} — newest first:\n`);
for (const l of leads.slice(0, 20)) {
  console.log(`  ${ist(l.createdAt)}  ${l.name}  ${phone(l.phone).trim()}  ${l.projectType}  ${l.location}`);
}
if (leads.length > 20) console.log(`  … and ${leads.length - 20} more`);
console.log(`\nSaved for Excel: ${path.relative(ROOT, OUT)}\n`);
