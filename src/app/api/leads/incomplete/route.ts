import { NextResponse, type NextRequest } from "next/server";
import { incompleteLeadSchema } from "@/lib/lead-schema";
import { storeLead } from "@/lib/leads/storage";
import { rateLimited } from "@/lib/leads/rate-limit";
import type { IncompleteLead } from "@/lib/leads/types";
import { site } from "@/content/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };
const done = () => new NextResponse(null, { status: 204, headers: noStore });

/**
 * POST /api/leads/incomplete — a form that was started but not sent.
 * The browser calls this when a visitor has typed a name and a valid phone number and then leaves the form
 * (closes the pop-up, switches tab, leaves the page, or stops for a while). The details are saved to the
 * sheet marked "Not submitted". If the visitor sends the form afterwards, the same row is completed.
 *
 * Switch: site.form.saveIncomplete. Always answers 204 — the visitor never sees an error from this.
 */
export async function POST(req: NextRequest) {
  if (!site.form.saveIncomplete) return done();

  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return done();

  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || req.headers.get("x-real-ip") || "local";
  // Separate, slightly roomier allowance than real enquiries: one form can report a few updates.
  if (rateLimited(`incomplete:${ip}`, 12)) return done();

  let body: unknown;
  try {
    const raw = await req.text();
    if (raw.length > 10_000) return done();
    body = JSON.parse(raw);
  } catch {
    return done();
  }
  if (body && typeof body === "object" && "website" in body && (body as { website?: unknown }).website) return done(); // honeypot

  const parsed = incompleteLeadSchema.safeParse(body);
  if (!parsed.success) return done();

  const { website: _hp, draftId, ...data } = parsed.data;
  const lead: IncompleteLead = { id: draftId, createdAt: new Date().toISOString(), consentGiven: false, incomplete: true, ...data };

  try {
    await storeLead(lead);
  } catch (err) {
    console.error(`[leads] could not save not-submitted details ${lead.id}:`, err instanceof Error ? err.message : err);
  }
  return done();
}
