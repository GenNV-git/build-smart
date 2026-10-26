import Link from "next/link";
import Image from "@/components/ui/Image";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { navigation, site, isSet } from "@/content/site";
import { services } from "@/content/services";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  const { contact } = site;
  const hasContact = [contact.phone, contact.email, contact.address, contact.hours].some(isSet);

  return (
    <footer className="relative bg-charcoal text-cream">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent" aria-hidden="true" />
      <div className="container-lux grid grid-cols-2 gap-x-6 gap-y-10 py-14 sm:py-20 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-12">
        <div className="col-span-2 max-w-sm lg:col-span-1">
          <Link href="/" aria-label="Build Smart — home" className="inline-block">
            <Image src="/images/brand/logo-mark.png" alt="Build Smart" width={102} height={70} style={{ height: 70, width: "auto" }} />
          </Link>
          <p className="mt-6 font-display text-2xl text-gold-soft">{site.tagline}</p>
          <p className="mt-2 text-[0.65rem] uppercase tracking-[0.25em] text-cream/45">{site.descriptor}</p>
          <p className="mt-5 text-sm leading-relaxed text-cream/65">{site.shortDescription}</p>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-sans text-sm font-semibold tracking-wide text-gold">Quick Links</h2>
          <ul className="mt-4 space-y-1 text-sm">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-block py-1 text-cream/70 transition-colors hover:text-gold">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-sans text-sm font-semibold tracking-wide text-gold">Our Services</h2>
          <ul className="mt-4 space-y-1 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services#${s.slug}`} className="inline-block py-1 text-cream/70 transition-colors hover:text-gold">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 lg:col-span-1">
          <h2 className="font-sans text-sm font-semibold tracking-wide text-gold">Connect With Us</h2>
          <SocialLinks withLabels tone="dark" className="mt-4" />
          {hasContact && (
            <ul className="mt-7 space-y-3 text-sm text-cream/70">
              {isSet(contact.phone) && (
                <li className="flex gap-3">
                  <Phone className="mt-0.5 size-4 shrink-0 text-gold" />
                  <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} className="hover:text-gold">{contact.phone}</a>
                </li>
              )}
              {isSet(contact.email) && (
                <li className="flex gap-3">
                  <Mail className="mt-0.5 size-4 shrink-0 text-gold" />
                  <a href={`mailto:${contact.email}`} className="hover:text-gold">{contact.email}</a>
                </li>
              )}
              {isSet(contact.address) && (
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
                  <span>{contact.address}</span>
                </li>
              )}
              {isSet(contact.hours) && (
                <li className="flex gap-3">
                  <Clock className="mt-0.5 size-4 shrink-0 text-gold" />
                  <span>{contact.hours}</span>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-lux flex flex-col gap-3 pb-28 pt-6 text-xs sm:pb-6 sm:pr-24 text-cream/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {site.copyrightYear} {site.legalName}. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li><Link href="/privacy-policy" className="hover:text-gold">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-gold">Terms &amp; Conditions</Link></li>
            <li><Link href="/sitemap.xml" className="hover:text-gold">Sitemap</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
