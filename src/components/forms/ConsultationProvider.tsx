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

/** ?show-quote in the address forces the pop-up (for testing) — ignores the once-per-visit and after-enquiry rules. */
function forcedForTesting(): boolean {
  try {
    return new URLSearchParams(window.location.search).has("show-quote");
  } catch {
    return false;
  }
}

function alreadyHandled(): boolean {
  if (forcedForTesting()) return false;
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
        className={`consult-dialog overflow-y-auto outline-none overscroll-contain border bg-ivory p-0 text-ink shadow-[0_40px_90px_-30px_rgb(0_0_0/0.6)] ${
          auto
            ? // centred card: compact on phones, wider with a photo column on large screens
              "is-auto no-scrollbar m-auto max-h-[calc(100dvh-2.5rem)] w-[min(23.5rem,calc(100vw-2.5rem))] max-w-none rounded-[1.6rem] border-gold/30 sm:w-[min(38rem,calc(100vw-3rem))] lg:max-h-[calc(100dvh-2rem)] lg:w-[min(66rem,calc(100vw-2rem))] lg:rounded-[1.5rem] lg:border-white/70"
            : // bottom sheet on phones, centred card from tablet up
              "border-white/70 mx-0 mb-0 mt-auto max-h-[92dvh] w-full max-w-none rounded-t-[1.6rem] sm:m-auto sm:max-h-[calc(100dvh-1.5rem)] sm:w-[min(40rem,calc(100vw-1.5rem))] sm:rounded-[1.6rem]"
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
          className={`absolute z-10 grid place-items-center rounded-full transition ${
            auto
              ? "right-3 top-3 size-10 bg-white/10 text-cream ring-1 ring-white/15 backdrop-blur-sm hover:bg-white/20 lg:right-3 lg:top-3 lg:size-11 lg:bg-transparent lg:text-chocolate/70 lg:ring-0 lg:backdrop-blur-none lg:hover:bg-chocolate/5"
              : "right-3 top-3 size-11 text-chocolate/70 hover:bg-chocolate/5 hover:text-espresso"
          }`}
          aria-label="Close"
        >
          <X className="size-5" />
        </button>
        <span id="consult-dialog-title" className="sr-only">
          {auto ? site.leadPopup.title : "Request a free consultation"}
        </span>

        {auto ? (
          <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
            {/* Large screens: photo column */}
            <div className="relative hidden overflow-hidden bg-espresso lg:block lg:min-h-[36rem]">
              <Image src={images.quotePopup.src} alt="" fill sizes="28rem" className="object-cover" priority={false} />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/30 to-espresso/10" />
              <div className="absolute inset-x-0 bottom-0 p-8 text-cream">
                <Image src="/images/brand/logo-mark.png" alt="Build Smart" width={70} height={48} className="h-12 w-auto" />
                <p className="mt-3 font-display text-[1.7rem] leading-tight">Designing spaces for a better tomorrow.</p>
                <ul className="mt-5 flex flex-col gap-2 text-sm text-cream/85">
                  <li className="inline-flex items-center gap-1.5">
                    <BadgeCheck className="size-4 text-gold" /> Free consultation, no obligation
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <Clock3 className="size-4 text-gold" /> Quick call-back from our team
                  </li>
                </ul>
              </div>
            </div>

            {/* Phones & tablets: slim branded header */}
            <div className="relative overflow-hidden bg-espresso px-5 pb-4 pt-4 text-cream sm:px-8 sm:pb-6 sm:pt-7 lg:hidden">
              <Image src={images.quotePopup.src} alt="" fill sizes="38rem" className="object-cover opacity-35" priority={false} />
              <div className="absolute inset-0 bg-[linear-gradient(115deg,rgb(31_24_19/0.97)_35%,rgb(31_24_19/0.72)_100%)]" />
              <div className="absolute -right-10 -top-16 size-44 rounded-full bg-gold/15 blur-3xl" aria-hidden="true" />
              <div className="relative pr-10">
                <div className="flex items-center gap-2.5">
                  <Image src="/images/brand/logo-mark.png" alt="Build Smart" width={70} height={48} className="h-6 w-auto sm:h-7" />
                  <span className="h-3.5 w-px bg-cream/25" aria-hidden="true" />
                  <span className="text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-gold sm:text-[0.65rem]">Free consultation</span>
                </div>
                <p className="mt-2.5 font-display text-[1.8rem] leading-[1.05] sm:mt-3 sm:text-[2.2rem]">{site.leadPopup.title}</p>
                <p className="mt-1.5 text-[0.8rem] leading-relaxed text-cream/70 sm:mt-2 sm:text-sm">
                  <span className="sm:hidden">Share a few details — we&apos;ll call you back.</span>
                  <span className="hidden sm:inline">{site.leadPopup.intro}</span>
                </p>
              </div>
              <span className="quote-header-shine absolute inset-x-0 bottom-0 h-px" aria-hidden="true" />
            </div>

            <div className="relative px-5 pb-3 pt-4 sm:px-8 sm:pb-6 sm:pt-6 lg:pb-8 lg:pt-8">
              {open && (
                <ConsultationForm
                  key={formKey}
                  variant="full"
                  dense
                  headingClassName="hidden lg:block"
                  source={source}
                  title={site.leadPopup.title}
                  intro={site.leadPopup.intro}
                />
              )}
              <button
                type="button"
                onClick={close}
                className="mx-auto mt-0.5 block min-h-9 px-4 text-[0.78rem] font-medium text-muted underline-offset-4 hover:text-espresso hover:underline lg:mt-3 lg:min-h-11 lg:text-sm"
              >
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
