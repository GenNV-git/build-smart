import type { Metadata } from "next";
import Image from "@/components/ui/Image";
import { Check } from "lucide-react";
import { services } from "@/content/services";
import { PageHero } from "@/components/ui/PageHero";
import { serviceIcons } from "@/components/ui/Icons";
import { TempImageTag } from "@/components/ui/DevNote";
import { ConsultButton } from "@/components/forms/ConsultButton";
import { ProcessSection } from "@/components/home/ProcessSection";
import { CtaBanner } from "@/components/layout/CtaBanner";
import { images } from "@/content/images";
import { publicImageSize } from "@/lib/image-size";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Home construction, interior design, turnkey project management and digital solutions — one accountable team from concept to handover.",
  alternates: { canonical: "/services" },
  openGraph: { title: "Services | Build Smart", url: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Services"
        title="Complete Solutions"
        accent="for Every Space."
        intro="Construction and interiors under one roof — planned around the way you live and built to last."
        image={images.servicesHero}
      >
        <nav aria-label="Services on this page" className="no-scrollbar -mx-5 mt-8 flex gap-2.5 overflow-x-auto px-5 sm:mx-0 sm:mt-10 sm:flex-wrap sm:px-0">
          {services.map((s) => (
            <a key={s.slug} href={`#${s.slug}`} className="shrink-0 rounded-full border border-cream/20 bg-cream/5 px-4 py-2.5 text-xs font-medium text-cream/85 backdrop-blur transition hover:border-gold hover:text-gold">
              {s.shortTitle}
            </a>
          ))}
        </nav>
      </PageHero>

      <div className="py-14 sm:py-20 lg:py-28">
        <div className="container-lux space-y-16 sm:space-y-24 lg:space-y-32">
          {services.map((s, i) => {
            const Icon = serviceIcons[s.icon];
            const flip = i % 2 === 1;
            const size = publicImageSize(s.image.src);
            // Show each photo in its own shape (between square and wide), so nothing important is cropped.
            const ratio = size ? Math.min(1.6, Math.max(1, size.width / size.height)) : 4 / 3;
            return (
              <section key={s.slug} id={s.slug} aria-labelledby={`${s.slug}-title`} className="grid scroll-mt-28 items-center gap-10 lg:grid-cols-2 lg:gap-20">
                <div style={{ aspectRatio: ratio }} className={`img-zoom relative overflow-hidden rounded-[1.3rem] sm:rounded-[1.6rem] shadow-[var(--shadow-soft)] ${flip ? "lg:order-2" : ""}`} data-reveal>
                  <Image src={s.image.src} alt={s.image.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" style={{ objectPosition: s.image.position || "50% 50%" }} />
                  {s.image.temporary && <TempImageTag />}
                  <span className="absolute bottom-5 left-5 rounded-full bg-espresso/70 px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold-soft backdrop-blur">
                    0{i + 1} / 0{services.length}
                  </span>
                </div>
                <div data-reveal style={{ ["--reveal-delay" as string]: "100ms" }}>
                  <span className="grid size-14 place-items-center rounded-full border border-gold/40 text-chocolate">
                    <Icon className="size-6" strokeWidth={1.4} aria-hidden="true" />
                  </span>
                  <h2 id={`${s.slug}-title`} className="mt-5 text-[2.2rem] leading-tight text-espresso sm:mt-6 sm:text-5xl">
                    {s.title}
                  </h2>
                  <p className="mt-2 font-display text-xl text-gold-deep">{s.tagline}</p>
                  <p className="mt-5 max-w-xl text-[0.98rem] leading-relaxed text-muted">{s.description}</p>
                  <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                    {s.includes.map((item) => (
                      <li key={item} className="flex gap-3 text-sm text-ink">
                        <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-gold/20 text-gold-deep">
                          <Check className="size-3" strokeWidth={2.5} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <ConsultButton className="btn btn-gold mt-8 w-full sm:mt-9 sm:w-auto" source={`service-${s.slug}`}>
                    Enquire about {s.shortTitle}
                  </ConsultButton>
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <ProcessSection />
      <CtaBanner source="services-cta" />
    </>
  );
}
