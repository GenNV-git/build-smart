"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { ConsultButton } from "@/components/forms/ConsultButton";
import { isSet, site, whatsappLink } from "@/content/site";

/**
 * Phones only: a thumb-friendly action bar that slides up once the visitor starts scrolling.
 * Call (if a phone number is set) · WhatsApp (if a number is set) · Get a Free Quote.
 */
export function MobileActionBar() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();
  const wa = whatsappLink();
  const phone = site.contact.phone;

  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const on = () => setShow(window.scrollY > 280);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // Step out of the way while an enquiry form is on screen, so it never covers the fields or the submit button.
  useEffect(() => {
    const forms = Array.from(document.querySelectorAll("#consultation"));
    if (!forms.length || !("IntersectionObserver" in window)) {
      setFormVisible(false);
      return;
    }
    const seen = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)));
        setFormVisible(seen.size > 0);
      },
      { threshold: 0.15 },
    );
    forms.forEach((f) => io.observe(f));
    return () => io.disconnect();
  }, [pathname]);

  const visible = show && !formVisible;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-500 ease-[var(--ease-lux)] sm:hidden ${
        show ? "translate-y-0" : "translate-y-[130%]"
      }`}
      aria-hidden={!visible}
    >
      <nav
        aria-label="Quick contact"
        className="mx-3 mb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center gap-2 rounded-[1.25rem] border border-gold/25 bg-espresso p-2 shadow-[0_18px_40px_-12px_rgb(0_0_0/0.6)]"
      >
        {isSet(phone) && (
          <a
            href={`tel:${phone.replace(/[^\d+]/g, "")}`}
            className="grid size-12 shrink-0 place-items-center rounded-xl bg-cream/10 text-cream"
            aria-label={`Call Build Smart on ${phone}`}
            tabIndex={visible ? 0 : -1}
          >
            <Phone className="size-5" />
          </a>
        )}
        {wa && (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="grid size-12 shrink-0 place-items-center rounded-xl bg-whatsapp text-white"
            aria-label="Chat on WhatsApp (opens WhatsApp)"
            tabIndex={visible ? 0 : -1}
          >
            <WhatsAppIcon className="size-6" />
          </a>
        )}
        {pathname === "/contact" ? (
          <a href="#consultation" className="btn btn-gold min-w-0 flex-1 rounded-xl px-3" tabIndex={visible ? 0 : -1}>
            <span className="min-[380px]:hidden">Enquiry Form</span>
            <span className="hidden min-[380px]:inline">Fill the Enquiry Form</span>
            <ArrowRight className="arrow size-4 shrink-0" />
          </a>
        ) : (
          <ConsultButton className="btn btn-gold min-w-0 flex-1 rounded-xl px-3" source="mobile-bar">
            <span className="min-[360px]:hidden">Free Quote</span>
            <span className="hidden min-[360px]:inline">Get a Free Quote</span>
          </ConsultButton>
        )}
      </nav>
    </div>
  );
}
