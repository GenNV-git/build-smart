"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

/**
 * Reports taps on Call, WhatsApp and Email links to Google Tag Manager as a "contact_click" event
 * (method: call | whatsapp | email). One listener for the whole site; no personal details are sent.
 */
export function TrackClicks() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const method = href.startsWith("tel:") ? "call" : /wa\.me|api\.whatsapp\.com/.test(href) ? "whatsapp" : href.startsWith("mailto:") ? "email" : "";
      if (method) track("contact_click", { method, link_location: window.location.pathname });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
