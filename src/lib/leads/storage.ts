import { mkdir, appendFile } from "node:fs/promises";
import path from "node:path";
import type { LeadRecord } from "./types";

/**
 * Lead storage drivers — choose with LEAD_STORAGE:
 *   file    (default) Appends JSON lines to LEAD_FILE_PATH (default ./data/leads.jsonl).
 *           Good for local development and a VPS / single server. NOT for serverless hosts
 *           (Vercel, Netlify) whose file systems are temporary.
 *   webhook Sends each lead to LEAD_WEBHOOK_URL (Google Apps Script → Google Sheets, Make,
 *           Zapier, n8n, a CRM…). Signed with the LEAD_WEBHOOK_SECRET header. Use this in production on serverless.
 *   mock    Validates and accepts the enquiry but stores NOTHING. For demos and UI testing only.
 */
export type StorageResult = { stored: boolean; driver: string };

export async function storeLead(lead: LeadRecord): Promise<StorageResult> {
  const driver = (process.env.LEAD_STORAGE || "file").toLowerCase();

  if (driver === "mock") {
    console.info(`[leads] mock storage — enquiry ${lead.id} accepted but not stored`);
    return { stored: false, driver };
  }

  if (driver === "webhook") {
    const url = process.env.LEAD_WEBHOOK_URL;
    if (!url) throw new Error("LEAD_STORAGE=webhook but LEAD_WEBHOOK_URL is not set");
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.LEAD_WEBHOOK_SECRET ? { "X-Build-Smart-Secret": process.env.LEAD_WEBHOOK_SECRET } : {}),
      },
      // The secret is sent both as a header and in the body (Google Apps Script cannot read request headers).
      body: JSON.stringify({ type: "website_enquiry", secret: process.env.LEAD_WEBHOOK_SECRET || undefined, lead }),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Lead webhook responded with HTTP ${res.status}`);
    return { stored: true, driver };
  }

  // default: file
  const file = path.resolve(/*turbopackIgnore: true*/ process.cwd(), process.env.LEAD_FILE_PATH || "data/leads.jsonl");
  const publicDir = path.resolve(/*turbopackIgnore: true*/ process.cwd(), "public");
  if (file.startsWith(publicDir)) throw new Error("LEAD_FILE_PATH must not be inside /public");
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  await appendFile(file, JSON.stringify(lead) + "\n", { encoding: "utf8", mode: 0o600 });
  return { stored: true, driver: "file" };
}
