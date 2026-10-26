import Image from "@/components/ui/Image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TempImageTag } from "@/components/ui/DevNote";
import { images } from "@/content/images";

const pillars = ["Thoughtful, functional design", "Sound construction quality", "Transparent costs and updates", "One team, start to finish"];

export function AboutIntro() {
  return (
    <section id="about" aria-labelledby="about-title" className="py-16 sm:py-24 lg:py-32">
      <div className="container-lux grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        <div>
          <SectionHeading id="about-title" eyebrow="About Build Smart" title="More Than Interiors," accent="We Build Lifestyles." />
          <div className="mt-6 max-w-xl space-y-4 text-[0.98rem] leading-relaxed text-muted" data-reveal>
            <p>
              At Build Smart, we believe every space has a story. We design and build homes around the people who live in them — how
              they cook, rest, gather and grow — and then we build them properly, with materials and workmanship that last.
            </p>
            <p>
              You get one accountable team, honest advice and clear updates at every stage, from the first sketch to the day we hand
              over the keys.
            </p>
          </div>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2" data-reveal>
            {pillars.map((p) => (
              <li key={p} className="flex items-center gap-3 text-sm font-medium text-espresso">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gold/20 text-gold-deep">
                  <Check className="size-3.5" strokeWidth={2.5} />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <Link href="/about" className="btn btn-gold mt-9 w-full sm:mt-10 sm:w-auto" data-reveal>
            Know More About Sanjay <ArrowRight className="arrow size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-[1.35fr_1fr] gap-3 sm:gap-5" data-reveal>
          <div className="img-zoom relative row-span-2 min-h-[20rem] overflow-hidden rounded-[1.4rem] sm:min-h-[30rem]">
            <Image src={images.aboutCollageLarge.src} alt={images.aboutCollageLarge.alt} fill sizes="(min-width: 1024px) 30vw, 60vw" className="object-cover" />
            <TempImageTag />
          </div>
          <figure className="flex flex-col justify-between rounded-[1.4rem] bg-sand p-4 min-[400px]:p-5 sm:p-8">
            <span className="font-display text-6xl leading-[0.5] text-gold" aria-hidden="true">&ldquo;</span>
            <blockquote className="mt-3 font-display text-[1.2rem] leading-snug text-espresso min-[400px]:text-[1.35rem] sm:mt-4 sm:text-[1.75rem]">Good design turns houses into homes.</blockquote>
            <span className="mt-5 block h-px w-10 bg-espresso/60" aria-hidden="true" />
          </figure>
          <div className="img-zoom relative min-h-[9rem] overflow-hidden rounded-[1.4rem] sm:min-h-[14rem]">
            <Image src={images.aboutCollageSmall.src} alt={images.aboutCollageSmall.alt} fill sizes="(min-width: 1024px) 22vw, 40vw" className="object-cover" />
            <TempImageTag />
          </div>
        </div>
      </div>
    </section>
  );
}
