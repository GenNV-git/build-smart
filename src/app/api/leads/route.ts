import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { leadSchema, fieldErrorsFrom } from "@/lib/lead-schema";
import { storeLead } from "@/lib/leads/storage";
import { notifyOwnerOnWhatsApp } from "@/lib/leads/whatsapp";
import { rateLimited } from "@/lib/leads/rate-limit";
import type { LeadRecord } from "@/lib/leads/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

/**
 * POST /api/leads — consultation enquiries.
 * Flow: validate → (honeypot / rate limit) → store → WhatsApp notify (Phase 2, optional) → respond.
 */
export async function POST(req: NextRequest) {
  // Same-origin check: browsers always send Origin on POST from fetch().
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return NextResponse.json({ ok: false, error: "Invalid request origin." }, { status: 403, headers: noStore });
  }

  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ ok: false, error: "Unsupported content type." }, { status: 415, headers: noStore });
  }

  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || req.headers.get("x-real-ip") || "local";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many enquiries from this connection. Please try again in a few minutes." },
      { status: 429, headers: noStore },
    );
  }

  let body: unknown;
  try {
    const raw = await req.text();
    if (raw.length > 10_000) throw new Error("too large");
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400, headers: noStore });
  }

  // Honeypot: pretend success so bots learn nothing.
  if (body && typeof body === "object" && "website" in body && (body as { website?: unknown }).website) {
    return NextResponse.json({ ok: true }, { status: 200, headers: noStore });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error) },
      { status: 422, headers: noStore },
    );
  }

  const { website: _hp, consent: _c, ...data } = parsed.data;
  const lead: LeadRecord = { id: randomUUID(), createdAt: new Date().toISOString(), consentGiven: true, ...data };

  try {
    await storeLead(lead);
  } catch (err) {
    console.error(`[leads] storage failed for ${lead.id}:`, err instanceof Error ? err.message : err);
    return NextResponse.json(
      { ok: false, error: "We couldn't send your enquiry right now. Please try again in a moment." },
      { status: 500, headers: noStore },
    );
  }

  const notify = await notifyOwnerOnWhatsApp(lead);
  if (notify.attempted && !notify.delivered) {
    console.error(`[leads] WhatsApp notification failed for ${lead.id} (${notify.provider}): ${notify.error}`);
  }

  return NextResponse.json({ ok: true, id: lead.id }, { status: 201, headers: noStore });
}

export function GET() {
  return NextResponse.json({ ok: false, error: "Method not allowed." }, { status: 405, headers: { Allow: "POST" } });
}
