import { mkdir, appendFile } from "node:fs/promises";
import path from "node:path";
import type { LeadRecord } from "./types";

/**
 * Lead storage drivers — choose with LEAD_STORAGE (or leave it empty for automatic):
 *   (empty) Automatic: "webhook" when LEAD_WEBHOOK_URL is set, otherwise "file".
 *   webhook Sends each lead to LEAD_WEBHOOK_URL — the Google Sheet (see docs/GOOGLE-SHEETS-SETUP.md),
 *           or Make / Zapier / n8n / a CRM. Signed with LEAD_WEBHOOK_SECRET. Use this on the live site.
 *   file    Appends JSON lines to LEAD_FILE_PATH (default ./data/leads.jsonl).
 *           Good for local development and a VPS / single server. NOT for serverless hosts
 *           (Vercel, Netlify) whose file systems are temporary.
 *   mock    Validates and accepts the enquiry but stores NOTHING. For demos and UI testing only.
 */
export type StorageResult = { stored: boolean; driver: string };

/** Values pasted into hosting dashboards often carry quotes or spaces — strip them. */
const env = (name: string) => (process.env[name] || "").trim().replace(/^["']|["']$/g, "").trim();

/** Which storage is active and whether the Google Sheet settings are present (never reveals the values). */
export function storageStatus() {
  const webhookUrl = env("LEAD_WEBHOOK_URL");
  const driver = env("LEAD_STORAGE").toLowerCase() || (webhookUrl ? "webhook" : "file");
  return {
    driver,
    webhookUrl,
    secret: env("LEAD_WEBHOOK_SECRET"),
    serverless: !!(process.env.VERCEL || process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME),
  };
}

export async function storeLead(lead: LeadRecord): Promise<StorageResult> {
  const { driver, webhookUrl, secret, serverless } = storageStatus();

  if (driver === "mock") {
    console.info(`[leads] mock storage — enquiry ${lead.id} accepted but not stored`);
    return { stored: false, driver };
  }

  if (driver === "webhook") {
    if (!webhookUrl) throw new Error("LEAD_STORAGE=webhook but LEAD_WEBHOOK_URL is not set");
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(secret ? { "X-Build-Smart-Secret": secret } : {}),
      },
      // The secret is sent both as a header and in the body (Google Apps Script cannot read request headers).
      body: JSON.stringify({ type: "website_enquiry", secret: secret || undefined, lead }),
      redirect: "follow", // Google Apps Script answers through a redirect
      signal: AbortSignal.timeout(15_000),
      cache: "no-store",
    });
    if (res.status === 401 || res.status === 403) {
      throw new Error(`Google refused the enquiry (HTTP ${res.status}) — set the Apps Script web app to "Who has access: Anyone" and deploy a new version`);
    }
    if (!res.ok) throw new Error(`Lead webhook responded with HTTP ${res.status}`);

    // Google Apps Script always answers HTTP 200, so read its reply to know whether the row was really saved.
    const text = await res.text().catch(() => "");
    if (text.trim().startsWith("{")) {
      let reply: { ok?: boolean; error?: string } = {};
      try {
        reply = JSON.parse(text);
      } catch {
        /* not JSON after all — treat as accepted (Make / Zapier reply with plain text) */
      }
      if (reply.ok === false) {
        throw new Error(
          reply.error === "unauthorised"
            ? "Google Sheet rejected the enquiry: LEAD_WEBHOOK_SECRET does not match SECRET in the Apps Script"
            : `Lead webhook refused the enquiry (${reply.error || "unknown reason"})`,
        );
      }
    } else if (/<html/i.test(text) && /accounts\.google\.com|ServiceLogin|Sign in/i.test(text)) {
      throw new Error('Google asked for a sign-in — redeploy the Apps Script web app with "Who has access: Anyone"');
    }
    return { stored: true, driver };
  }

  // default: file
  if (serverless) {
    throw new Error(
      "LEAD_WEBHOOK_URL is not set on this server, so there is nowhere to save enquiries (hosts like Vercel can't keep files). " +
        "Add LEAD_WEBHOOK_URL and LEAD_WEBHOOK_SECRET in the hosting settings (Vercel → Settings → Environment Variables → Production) and redeploy.",
    );
  }
  const file = path.resolve(/*turbopackIgnore: true*/ process.cwd(), process.env.LEAD_FILE_PATH || "data/leads.jsonl");
  const publicDir = path.resolve(/*turbopackIgnore: true*/ process.cwd(), "public");
  if (file.startsWith(publicDir)) throw new Error("LEAD_FILE_PATH must not be inside /public");
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  await appendFile(file, JSON.stringify(lead) + "\n", { encoding: "utf8", mode: 0o600 });
  return { stored: true, driver: "file" };
}
