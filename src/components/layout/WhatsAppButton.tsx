"use client";

import { WhatsAppIcon } from "@/components/ui/Icons";
import { whatsappLink } from "@/content/site";
import { useConsultation } from "@/components/forms/ConsultationProvider";

/**
 * Floating WhatsApp button. Uses the business number from NEXT_PUBLIC_WHATSAPP_NUMBER / site.ts.
 * Until a number is configured it opens the consultation form instead, so it always works.
 */
export function WhatsAppButton() {
  const href = whatsappLink();
  const { openConsultation } = useConsultation();
  const cls =
    "fixed bottom-5 right-5 z-40 hidden size-14 place-items-center sm:grid rounded-full bg-whatsapp text-white shadow-[0_10px_25px_-8px_rgb(37_211_102/0.7)] ring-4 ring-white/70 transition-transform duration-300 hover:scale-105 motion-safe:animate-wa-pulse sm:bottom-7 sm:right-7 mb-[env(safe-area-inset-bottom)]";

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label="Chat with Build Smart on WhatsApp (opens in a new tab)" className={cls}>
        <WhatsAppIcon className="size-6 sm:size-7" />
      </a>
    );
  }
  return (
    <button type="button" onClick={() => openConsultation("whatsapp-fallback")} aria-label="Contact Build Smart" title="Contact Build Smart" className={cls}>
      <WhatsAppIcon className="size-6 sm:size-7" />
    </button>
  );
}
