"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, Phone, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { ConsultButton } from "@/components/forms/ConsultButton";
import { useConsultation } from "@/components/forms/ConsultationProvider";
import { isSet, navigation, site, whatsappLink } from "@/content/site";
import { SocialLinks } from "./SocialLinks";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const { openConsultation } = useConsultation();
  const wa = whatsappLink();
  const phone = site.contact.phone;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu after navigating, and whenever the screen grows to desktop size.
  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Lock page scroll while open, Esc to close, move focus into the menu.
  useEffect(() => {
    const root = document.documentElement;
    if (!menuOpen) {
      root.style.overflow = "";
      return;
    }
    root.style.overflow = "hidden";
    const t = window.setTimeout(() => firstLinkRef.current?.focus({ preventScroll: true }), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      root.style.overflow = "";
    };
  }, [menuOpen]);

  /** Unlock scrolling *before* navigating, so links to sections (e.g. /#testimonials) can scroll. */
  const closeForNavigation = () => {
    document.documentElement.style.overflow = "";
    setMenuOpen(false);
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : !href.includes("#") && (pathname === href || pathname.startsWith(href + "/"));

  const solid = scrolled || menuOpen;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,padding,border-color] duration-500 ${
          solid ? "border-gold/15 bg-espresso/95 py-2.5 lg:bg-espresso/85 lg:backdrop-blur-xl" : "border-transparent bg-transparent py-3.5 sm:py-5"
        }`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-cream focus:px-4 focus:py-2 focus:text-sm focus:text-espresso"
        >
          Skip to content
        </a>
        <div className="container-lux flex items-center gap-6">
          <Logo height={solid ? 38 : 44} priority className="transition-all duration-500" />

          <span className="hidden h-8 w-px bg-cream/15 lg:block" aria-hidden="true" />

          <nav aria-label="Main" className="hidden flex-1 lg:block">
            <ul className="flex items-center gap-1 xl:gap-2">
              {navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative px-2.5 py-2 text-[0.82rem] font-medium tracking-wide transition-colors xl:px-3 ${
                        active ? "text-gold" : "text-cream/80 hover:text-cream"
                      }`}
                    >
                      {item.label}
                      <span
                        className={`absolute inset-x-3 -bottom-0.5 h-px origin-left bg-gold transition-transform duration-500 ${
                          active ? "scale-x-100" : "scale-x-0"
                        }`}
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <ConsultButton className="btn btn-gold btn-sm hidden sm:inline-flex" source="header">
              Get a Quote
            </ConsultButton>
            <button
              ref={toggleRef}
              type="button"
              className={`relative grid size-11 place-items-center rounded-full border text-cream transition-colors lg:hidden ${
                menuOpen ? "border-gold/60 bg-gold/10" : "border-cream/25 bg-black/10"
              }`}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {/*
        Mobile menu — rendered OUTSIDE <header>. (A blurred header becomes the containing block
        for fixed children, which squashed the old menu to the header's height.)
      */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!menuOpen}
        className={`fixed inset-0 z-[45] flex flex-col bg-espresso pt-[4.1rem] transition-[opacity,visibility] duration-300 lg:hidden ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(80%_50%_at_100%_0%,rgb(74_43_28/0.9),transparent)]" aria-hidden="true" />
        <nav
          aria-label="Mobile"
          className={`container-lux flex flex-1 flex-col overflow-y-auto overscroll-contain pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 transition-transform duration-500 ease-[var(--ease-lux)] ${
            menuOpen ? "translate-y-0" : "-translate-y-3"
          }`}
        >
          <ul className="border-b border-cream/10">
            {navigation.map((item, i) => {
              const active = isActive(item.href);
              return (
                <li key={item.href} className="border-t border-cream/10">
                  <Link
                    ref={i === 0 ? firstLinkRef : undefined}
                    href={item.href}
                    onClick={closeForNavigation}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-14 items-center justify-between gap-4 py-2 font-display text-[1.65rem] leading-none min-[400px]:text-[1.8rem] ${
                      active ? "text-gold" : "text-cream"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      {active && <span className="h-5 w-[3px] rounded-full bg-gold" aria-hidden="true" />}
                      {item.label}
                    </span>
                    <ArrowRight className={`size-4 shrink-0 ${active ? "text-gold" : "text-cream/35"}`} aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-auto pt-8">
            <button
              type="button"
              className="btn btn-gold w-full"
              onClick={() => {
                setMenuOpen(false);
                openConsultation("mobile-menu");
              }}
            >
              Get a Free Consultation <ArrowRight className="arrow size-4" />
            </button>
            {(wa || isSet(phone)) && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                {isSet(phone) && (
                  <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="btn border border-cream/20 bg-cream/5 text-cream">
                    <Phone className="size-4" /> Call
                  </a>
                )}
                {wa && (
                  <a href={wa} target="_blank" rel="noopener noreferrer" className={`btn bg-whatsapp text-white ${isSet(phone) ? "" : "col-span-2"}`}>
                    <WhatsAppIcon className="size-5" /> WhatsApp
                  </a>
                )}
              </div>
            )}
            <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
              <p className="text-[0.62rem] uppercase tracking-[0.22em] text-cream/45">{site.descriptor}</p>
              <SocialLinks tone="dark" exclude={["WhatsApp"]} />
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
