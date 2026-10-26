"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { BadgeCheck, Clock3, X } from "lucide-react";
import Image from "@/components/ui/Image";
import { ConsultationForm } from "./ConsultationForm";
import { site } from "@/content/site";
import { images } from "@/content/images";

type Mode = "manual" | "auto";
type Ctx = { openConsultation: (source?: string) => void };
const ConsultationContext = createContext<Ctx>({ openConsultation: () => {} });
export const useConsultation = () => useContext(ConsultationContext);

const SHOWN_KEY = "bs-quote-popup-shown"; // sessionStorage: once per visit
const SENT_KEY = "bs-enquiry-sent"; // localStorage: set when any enquiry form is sent
const NO_POPUP_PATHS = ["/contact", "/privacy-policy", "/terms"];

/** Is the visitor busy (typing, menu or another overlay open)? Then the timed pop-up waits. */
function visitorIsBusy() {
  const a = document.activeElement;
  if (a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA" || a.tagName === "SELECT")) return true;
  if (document.querySelector("dialog[open]")) return true;
  const menu = document.getElementById("mobile-menu");
  if (menu && getComputedStyle(menu).visibility === "visible") return true;
  return false;
}

function alreadyHandled(): boolean {
  try {
    if (sessionStorage.getItem(SHOWN_KEY) === "1") return true;
    const sent = Number(localStorage.getItem(SENT_KEY) || 0);
    if (sent && Date.now() - sent < site.leadPopup.quietDaysAfterEnquiry * 86_400_000) return true;
    return false;
  } catch {
    return true; // storage blocked → never risk repeated interruptions
  }
}

export function ConsultationProvider({ children }: { children: React.ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("manual");
  const [source, setSource] = useState("modal");
  const [formKey, setFormKey] = useState(0);
  const pathname = usePathname();
  const pathRef = useRef(pathname);
  pathRef.current = pathname;

  const openConsultation = useCallback((src = "modal") => {
    setMode("manual");
    setSource(src);
    setFormKey((k) => k + 1);
    setOpen(true);
    // Someone who opens the form themselves doesn't need the timed pop-up later.
    try {
      sessionStorage.setItem(SHOWN_KEY, "1");
    } catch {}
  }, []);

  // Sync React state with the native <dialog> (focus trap + Esc handled by the browser).
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      // Focus the panel itself (not the close button, and not a field — that would pop up the phone keyboard).
      d.focus({ preventScroll: true });
      d.scrollTop = 0;
      document.documentElement.style.overflow = "hidden";
    } else if (!open && d.open) {
      d.close();
    }
    if (!open) document.documentElement.style.overflow = "";
  }, [open]);

  // Timed "Get a Free Quote" pop-up — counted from arrival, survives page changes, once per visit.
  useEffect(() => {
    if (!site.leadPopup.enabled || alreadyHandled()) return;
    let timer = 0;
    const attempt = () => {
      if (alreadyHandled()) return;
      if (NO_POPUP_PATHS.includes(pathRef.current) || visitorIsBusy() || document.hidden) {
        timer = window.setTimeout(attempt, 4000); // try again a little later
        return;
      }
      try {
        sessionStorage.setItem(SHOWN_KEY, "1");
      } catch {}
      setMode("auto");
      setSource("auto-popup");
      setFormKey((k) => k + 1);
      setOpen(true);
    };
    timer = window.setTimeout(attempt, site.leadPopup.delayMs);
    return () => window.clearTimeout(timer);
  }, []);

  const close = () => setOpen(false);
  const auto = mode === "auto";

  return (
    <ConsultationContext.Provider value={{ openConsultation }}>
      {children}
      <dialog
        ref={dialogRef}
        className={`consult-dialog overflow-y-auto outline-none overscroll-contain border border-white/70 bg-ivory p-0 text-ink shadow-[0_40px_90px_-30px_rgb(0_0_0/0.6)] ${
          auto
            ? // centred card on every screen size
              "m-auto max-h-[calc(100dvh-2rem)] w-[min(54rem,calc(100vw-2rem))] max-w-none rounded-[1.5rem]"
            : // bottom sheet on phones, centred card from tablet up
              "mx-0 mb-0 mt-auto max-h-[92dvh] w-full max-w-none rounded-t-[1.6rem] sm:m-auto sm:max-h-[calc(100dvh-1.5rem)] sm:w-[min(40rem,calc(100vw-1.5rem))] sm:rounded-[1.6rem]"
        }`}
        aria-labelledby="consult-dialog-title"
        tabIndex={-1}
        onClose={close}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
      >
        <button
          type="button"
          onClick={close}
          className={`absolute right-3 top-3 z-10 grid size-11 place-items-center rounded-full transition ${
            auto ? "bg-espresso/55 text-cream backdrop-blur hover:bg-espresso/75 md:bg-transparent md:text-chocolate/70 md:backdrop-blur-none md:hover:bg-chocolate/5" : "text-chocolate/70 hover:bg-chocolate/5 hover:text-espresso"
          }`}
          aria-label="Close"
        >
          <X className="size-5" />
        </button>
        <span id="consult-dialog-title" className="sr-only">
          {auto ? site.leadPopup.title : "Request a free consultation"}
        </span>

        {auto ? (
          <div className="grid md:grid-cols-[0.9fr_1.1fr]">
            {/* Photo panel — slim strip on phones, full column on larger screens */}
            <div className="relative h-36 overflow-hidden bg-espresso min-[400px]:h-44 md:h-auto md:min-h-[32rem] [@media(max-height:680px)_and_(max-width:767px)]:hidden">
              <Image src={images.quotePopup.src} alt="" fill sizes="(min-width: 768px) 26rem, 100vw" className="object-cover" priority={false} />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/30 to-espresso/10" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-cream md:p-8">
                <Image src="/images/brand/logo-mark.png" alt="Build Smart" width={70} height={48} className="h-9 w-auto md:h-12" />
                <p className="mt-3 hidden font-display text-[1.7rem] leading-tight md:block">Designing spaces for a better tomorrow.</p>
                <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[0.72rem] text-cream/85 md:mt-5 md:flex-col md:gap-2 md:text-sm">
                  <li className="inline-flex items-center gap-1.5">
                    <BadgeCheck className="size-4 text-gold" /> Free consultation, no obligation
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <Clock3 className="size-4 text-gold" /> Takes under a minute
                  </li>
                </ul>
              </div>
            </div>

            <div className="px-5 pb-6 pt-5 sm:px-8 sm:pb-8 sm:pt-8">
              {open && (
                <ConsultationForm key={formKey} variant="quick" source={source} title={site.leadPopup.title} intro={site.leadPopup.intro} />
              )}
              <button type="button" onClick={close} className="mx-auto mt-3 block min-h-11 px-4 text-sm font-medium text-muted underline-offset-4 hover:text-espresso hover:underline">
                Maybe later
              </button>
            </div>
          </div>
        ) : (
          <div className="relative px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-7 sm:p-9">
            <span className="absolute left-1/2 top-2.5 h-1 w-10 -translate-x-1/2 rounded-full bg-chocolate/15 sm:hidden" aria-hidden="true" />
            {open && <ConsultationForm key={formKey} variant="full" source={source} />}
          </div>
        )}
      </dialog>
    </ConsultationContext.Provider>
  );
}
