import Image from "@/components/ui/Image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { serviceIcons } from "@/components/ui/Icons";
import { TempImageTag } from "@/components/ui/DevNote";
import { services } from "@/content/services";

/**
 * Phones: compact horizontal cards (photo left, text right) — easy to scan and tap.
 * Tablet: 2 columns. Desktop: one row of image cards.
 */
export function ServicesSection() {
  return (
    <section id="services" aria-labelledby="services-title" className="bg-ivory py-16 sm:py-24 lg:py-28">
      <div className="container-lux">
        <div className="grid gap-5 lg:grid-cols-[1fr_1fr] lg:items-end">
          <SectionHeading id="services-title" eyebrow="Our Services" title="Complete Solutions for Every Space" />
          <p className="max-w-md text-[0.95rem] leading-relaxed text-muted lg:justify-self-end lg:pb-2" data-reveal>
            From new homes to considered interiors, we offer end-to-end construction and interior solutions — delivered with precision
            and style.
          </p>
        </div>

        <ul className={`mt-10 grid gap-3.5 sm:mt-12 sm:grid-cols-2 sm:gap-5 ${services.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {services.map((s, i) => {
            const Icon = serviceIcons[s.icon];
            return (
              <li key={s.slug} data-reveal style={{ ["--reveal-delay" as string]: `${i * 70}ms` }}>
                <Link
                  href={`/services#${s.slug}`}
                  className="card-lux card-lift group flex h-full items-stretch overflow-hidden sm:flex-col"
                >
                  <div className="img-zoom relative w-[7.5rem] shrink-0 overflow-hidden min-[400px]:w-[8.5rem] sm:aspect-[4/3] sm:w-full">
                    <Image src={s.image.src} alt={s.image.alt} fill sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 140px" className="object-cover" style={{ objectPosition: s.image.position || "50% 50%" }} />
                    {s.image.temporary && <TempImageTag />}
                  </div>
                  <div className="relative flex flex-1 flex-col justify-center gap-1 px-4 py-4 sm:justify-start sm:px-6 sm:pb-6 sm:pt-9">
                    <span className="mb-1 grid size-9 place-items-center rounded-full bg-gold/15 text-espresso sm:absolute sm:-top-7 sm:left-6 sm:mb-0 sm:size-14 sm:border sm:border-chocolate/10 sm:bg-white sm:shadow-sm">
                      <Icon className="size-4 sm:size-6" strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <h3 className="font-sans text-[0.98rem] font-bold leading-snug text-espresso sm:text-[1.02rem]">{s.title}</h3>
                    <div className="flex items-end justify-between gap-3 sm:mt-1">
                      <p className="text-[0.82rem] leading-relaxed text-muted sm:text-sm">{s.tagline}</p>
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gold/25 text-espresso transition-colors group-hover:bg-gold sm:size-9">
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
