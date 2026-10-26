import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { isSet, site, whatsappLink } from "@/content/site";
import { PageHero } from "@/components/ui/PageHero";
import { ConsultationForm } from "@/components/forms/ConsultationForm";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { images } from "@/content/images";

export const metadata: Metadata = {
  title: "Contact & Free Consultation",
  description: "Tell us about your home, interior or turnkey project and book a free consultation with Build Smart.",
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact | Build Smart", url: "/contact" },
};

const nextSteps = [
  { title: "We review your enquiry", text: "Your details go straight to the Build Smart team." },
  { title: "We call you", text: "A short conversation to understand your space, needs and timeline." },
  { title: "Your consultation", text: "We discuss ideas, scope and the right way forward — no obligation." },
];

export default function ContactPage() {
  const wa = whatsappLink();
  const { contact } = site;
  const details = [
    { icon: Phone, label: "Phone & WhatsApp", value: contact.phone, href: isSet(contact.phone) ? `tel:${contact.phone.replace(/[^\d+]/g, "")}` : undefined },
    { icon: Mail, label: "Email", value: contact.email, href: isSet(contact.email) ? `mailto:${contact.email}` : undefined },
    { icon: MapPin, label: "Studio", value: contact.address },
    { icon: Clock, label: "Hours", value: contact.hours },
  ].filter((d) => isSet(d.value));

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's Plan Your"
        accent="Dream Space."
        intro="Share a few details about your project and we'll get in touch to arrange a free initial consultation."
        image={images.contactHero}
      />

      <section aria-label="Consultation form and contact details" className="relative z-10 -mt-12 pb-24 sm:pb-32">
        <div className="container-lux grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="glass-light rounded-[1.4rem] p-5 sm:rounded-[1.6rem] sm:p-10" id="consultation">
            <ConsultationForm variant="full" source="contact-page" headingLevel="h2" title="Request a Free Consultation" />
          </div>

          <aside className="space-y-6" aria-label="Other ways to reach us">
            <div className="rounded-[1.4rem] bg-espresso p-6 text-cream sm:rounded-[1.6rem] sm:p-9">
              <h2 className="text-3xl">Prefer to talk?</h2>
              {wa ? (
                <>
                  <p className="mt-3 text-sm leading-relaxed text-cream/70">Call us or send a WhatsApp message and we&apos;ll reply as soon as we can.</p>
                  <div className="mt-6 grid gap-3 min-[400px]:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    <a href={wa} target="_blank" rel="noopener noreferrer" className="btn w-full bg-whatsapp text-white hover:brightness-105">
                      <WhatsAppIcon className="size-5" /> WhatsApp
                    </a>
                    {isSet(contact.phone) && (
                      <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} className="btn btn-gold w-full">
                        <Phone className="size-4" /> Call Now
                      </a>
                    )}
                  </div>
                </>
              ) : (
                <p className="mt-3 text-sm leading-relaxed text-cream/70">
                  The form is the quickest way to reach us — your enquiry goes straight to the team.
                </p>
              )}
              {details.length > 0 && (
                <ul className="mt-7 space-y-4 border-t border-cream/10 pt-7 text-sm">
                  {details.map(({ icon: Icon, label, value, href }) => (
                    <li key={label} className="flex gap-3.5">
                      <Icon className="mt-0.5 size-4 shrink-0 text-gold" />
                      <span>
                        <span className="block text-[0.65rem] uppercase tracking-[0.2em] text-cream/50">{label}</span>
                        {href ? (
                          <a href={href} className="hover:text-gold">
                            {value}
                          </a>
                        ) : (
                          value
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <SocialLinks className="mt-7" tone="dark" exclude={["WhatsApp"]} />
            </div>

            <div className="rounded-[1.4rem] bg-sand p-6 sm:rounded-[1.6rem] sm:p-9">
              <h2 className="text-3xl text-espresso">What happens next</h2>
              <ol className="mt-6 space-y-5">
                {nextSteps.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span className="font-display text-2xl leading-none text-gold-deep">0{i + 1}</span>
                    <span>
                      <span className="block text-sm font-bold text-espresso">{s.title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted">{s.text}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
