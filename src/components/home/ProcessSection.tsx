import { SearchCheck, PencilRuler, Hammer, KeyRound } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const processSteps = [
  { n: "01", title: "Understand", text: "We understand your needs, lifestyle, budget and goals.", icon: SearchCheck },
  { n: "02", title: "Design", text: "We develop concepts, layouts and the details that matter.", icon: PencilRuler },
  { n: "03", title: "Build", text: "We execute with attention to quality and craftsmanship.", icon: Hammer },
  { n: "04", title: "Handover", text: "We complete the project and present your finished space.", icon: KeyRound },
];

export function ProcessSection() {
  return (
    <section id="process" aria-labelledby="process-title" className="bg-ivory py-16 sm:py-24 lg:py-28">
      <div className="container-lux">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <SectionHeading id="process-title" eyebrow="Our Process" title="From First Sketch to Final Handover." />
          <p className="max-w-sm text-[0.95rem] leading-relaxed text-muted lg:justify-self-end lg:pb-2" data-reveal>
            A simple, transparent process designed for a stress-free experience.
          </p>
        </div>

        <ol className="relative mt-10 grid gap-0 sm:mt-14 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4 lg:gap-0">
          {/* connecting line: vertical on phones, horizontal on desktop */}
          <span className="absolute bottom-8 left-7 top-7 w-px bg-gradient-to-b from-gold to-gold/15 sm:hidden" aria-hidden="true" />
          <span className="absolute left-[2.75rem] right-[12%] top-7 hidden h-px bg-[linear-gradient(90deg,var(--color-gold),rgb(214_177_109/0.15))] lg:block" aria-hidden="true" />
          {processSteps.map(({ n, title, text, icon: Icon }, i) => (
            <li
              key={n}
              className="relative flex gap-5 pb-8 last:pb-0 sm:block sm:pb-0 lg:pr-8"
              data-reveal
              style={{ ["--reveal-delay" as string]: `${i * 110}ms` }}
            >
              <div className="flex shrink-0 items-center">
                <span className="relative grid size-14 shrink-0 place-items-center rounded-full border border-gold/50 bg-ivory text-chocolate">
                  <Icon className="size-6" strokeWidth={1.3} aria-hidden="true" />
                </span>
                <span className="relative hidden bg-ivory pl-4 pr-3 font-display text-3xl text-gold-deep sm:inline">{n}</span>
              </div>
              <div className="pt-1 sm:pt-0">
                <p className="font-display text-xl leading-none text-gold-deep sm:hidden">{n}</p>
                <h3 className="mt-1 font-sans text-lg font-bold text-espresso sm:mt-6">{title}</h3>
                <p className="mt-1.5 max-w-[16rem] text-sm leading-relaxed text-muted sm:mt-2">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
