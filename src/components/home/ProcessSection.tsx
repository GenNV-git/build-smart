import { SearchCheck, PencilRuler, Hammer, KeyRound } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BlueprintArt } from "@/components/motion/BlueprintArt";

export const processSteps = [
  { n: "01", title: "Understand", text: "We understand your needs, lifestyle, budget and goals.", icon: SearchCheck },
  { n: "02", title: "Design", text: "We develop concepts, layouts and the details that matter.", icon: PencilRuler },
  { n: "03", title: "Build", text: "We execute with attention to quality and craftsmanship.", icon: Hammer },
  { n: "04", title: "Handover", text: "We complete the project and present your finished space.", icon: KeyRound },
];

export function ProcessSection() {
  return (
    <section id="process" aria-labelledby="process-title" className="relative isolate overflow-clip bg-ivory py-16 sm:py-24 lg:py-28">
      {/* Line drawing of a home that sketches itself as the section scrolls into view */}
      <BlueprintArt variant="house" className="absolute -right-3 top-9 -z-10 w-[8rem] text-gold-deep/30 sm:right-6 sm:top-12 sm:w-[15rem] lg:right-[6%] lg:top-14 lg:w-[25rem] lg:text-gold-deep/40" />
      <div className="container-lux">
        <div className="max-w-2xl">
          <SectionHeading id="process-title" eyebrow="Our Process" title="From First Sketch to Final Handover." />
          <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-muted" data-reveal>
            A simple, transparent process designed for a stress-free experience.
          </p>
        </div>

        <ol className="relative mt-10 grid gap-0 sm:mt-14 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4 lg:gap-0">
          {/* connecting line: vertical on phones, horizontal on desktop */}
          <span className="grow-y absolute bottom-8 left-7 top-7 w-px bg-gradient-to-b from-gold to-gold/15 sm:hidden" aria-hidden="true" data-reveal />
          <span className="grow-x absolute left-[2.75rem] right-[12%] top-7 hidden h-px bg-[linear-gradient(90deg,var(--color-gold),rgb(214_177_109/0.15))] lg:block" aria-hidden="true" data-reveal />
          {processSteps.map(({ n, title, text, icon: Icon }, i) => (
            <li
              key={n}
              className="relative flex gap-5 pb-8 last:pb-0 sm:block sm:pb-0 lg:pr-8"
              data-reveal
              style={{ ["--reveal-delay" as string]: `${i * 110}ms` }}
            >
              <div className="flex shrink-0 items-center">
                <span className="node-pop icon-draw relative grid size-14 shrink-0 place-items-center rounded-full border border-gold/50 bg-ivory text-chocolate">
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
