import type { LeadRecord } from "./types";

/**
 * PHASE 2 — WhatsApp lead notification (integration point)
 * ---------------------------------------------------------------
 * Disabled by default (WHATSAPP_NOTIFY_PROVIDER=none). Nothing is sent and the
 * site never claims a WhatsApp message was delivered.
 *
 * Providers:
 *   none        Default. No notification.
 *   meta-cloud  WhatsApp Business Platform (Cloud API) via Meta's Graph API.
 *               Requires an approved message template — see docs/WHATSAPP-INTEGRATION.md.
 *   webhook     Hands the formatted message to an automation service
 *               (Make, Zapier, n8n, Twilio Function, Interakt/AiSensy webhook…).
 *
 * All credentials are read from server-side environment variables only.
 * This code has NOT been tested against a live WhatsApp account yet —
 * configure, send a test enquiry, and confirm delivery before relying on it.
 */

export function formatLeadMessage(lead: LeadRecord): string {
  const lines = [
    "New Build Smart Website Enquiry",
    "",
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    `Project Type: ${lead.projectType}`,
    `Location: ${lead.location}`,
  ];
  if (lead.budget) lines.push(`Budget: ${lead.budget}`);
  if (lead.contactTime) lines.push(`Preferred time: ${lead.contactTime}`);
  if (lead.message) lines.push(`Message: ${lead.message}`);
  lines.push("", "Please contact the customer.");
  return lines.join("\n");
}

export type NotifyResult = { attempted: boolean; delivered: boolean; provider: string; error?: string };

export async function notifyOwnerOnWhatsApp(lead: LeadRecord): Promise<NotifyResult> {
  const provider = (process.env.WHATSAPP_NOTIFY_PROVIDER || "none").toLowerCase();
  if (provider === "none") return { attempted: false, delivered: false, provider };

  try {
    if (provider === "meta-cloud") return await sendViaMetaCloud(lead);
    if (provider === "webhook") return await sendViaWebhook(lead);
    return { attempted: false, delivered: false, provider, error: "Unknown WHATSAPP_NOTIFY_PROVIDER" };
  } catch (err) {
    // Never log the lead itself — only the failure.
    return { attempted: true, delivered: false, provider, error: err instanceof Error ? err.message : "unknown error" };
  }
}

/** Meta WhatsApp Cloud API. Template mode works any time; text mode only inside a 24-hour service window. */
async function sendViaMetaCloud(lead: LeadRecord): Promise<NotifyResult> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const to = (process.env.WHATSAPP_OWNER_NUMBER || "").replace(/\D/g, "");
  const version = process.env.WHATSAPP_GRAPH_API_VERSION || "v23.0";
  if (!token || !phoneNumberId || !to) throw new Error("WhatsApp Cloud API env vars are incomplete");

  const mode = (process.env.WHATSAPP_MESSAGE_MODE || "template").toLowerCase();
  const dash = (v?: string) => (v && v.trim() ? v.trim().slice(0, 900) : "—");

  const payload =
    mode === "text"
      ? { messaging_product: "whatsapp", to, type: "text", text: { body: formatLeadMessage(lead), preview_url: false } }
      : {
          messaging_product: "whatsapp",
          to,
          type: "template",
          template: {
            name: process.env.WHATSAPP_TEMPLATE_NAME || "new_website_enquiry",
            language: { code: process.env.WHATSAPP_TEMPLATE_LANG || "en" },
            components: [
              {
                type: "body",
                // Order must match {{1}}…{{6}} in the approved template.
                parameters: [lead.name, lead.phone, lead.projectType, lead.location, dash(lead.budget), dash(lead.message)].map(
                  (text) => ({ type: "text", text }),
                ),
              },
            ],
          },
        };

  const res = await fetch(`https://graph.facebook.com/${version}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`WhatsApp Cloud API responded with HTTP ${res.status}`);
  return { attempted: true, delivered: true, provider: "meta-cloud" };
}

async function sendViaWebhook(lead: LeadRecord): Promise<NotifyResult> {
  const url = process.env.WHATSAPP_WEBHOOK_URL;
  if (!url) throw new Error("WHATSAPP_WEBHOOK_URL is not set");
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.WHATSAPP_WEBHOOK_SECRET ? { "X-Build-Smart-Secret": process.env.WHATSAPP_WEBHOOK_SECRET } : {}),
    },
    body: JSON.stringify({ to: process.env.WHATSAPP_OWNER_NUMBER || undefined, text: formatLeadMessage(lead), lead }),
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`WhatsApp webhook responded with HTTP ${res.status}`);
  return { attempted: true, delivered: true, provider: "webhook" };
}
