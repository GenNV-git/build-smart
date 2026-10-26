import Image from "@/components/ui/Image";
import { ConsultButton } from "@/components/forms/ConsultButton";
import { images } from "@/content/images";

export function CtaBanner({
  eyebrow = "Let's build your dream space",
  title = "Ready to Transform Your Space?",
  text = "Let's discuss your vision and create a space that feels uniquely yours.",
  source = "cta-banner",
}: {
  eyebrow?: string;
  title?: string;
  text?: string;
  source?: string;
}) {
  return (
    <section aria-labelledby="cta-title" className="relative isolate overflow-hidden bg-espresso text-cream">
      <Image
        src={images.ctaBanner.src}
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover object-right opacity-60 sm:opacity-80"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#24170f_0%,rgb(36_23_15/0.93)_38%,rgb(36_23_15/0.55)_70%,rgb(36_23_15/0.3)_100%)]" />
      <div className="container-lux flex flex-col items-start gap-8 py-14 sm:py-20 lg:py-24 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl" data-reveal>
          <p className="eyebrow eyebrow-light">{eyebrow}</p>
          <h2 id="cta-title" className="mt-4 text-[2.4rem] leading-[1.05] sm:text-5xl">
            {title}
          </h2>
          <p className="mt-4 text-cream/75">{text}</p>
        </div>
        <div className="w-full sm:w-auto" data-reveal style={{ ["--reveal-delay" as string]: "120ms" }}>
          <ConsultButton source={source} className="btn btn-gold w-full sm:w-auto" />
        </div>
      </div>
    </section>
  );
}
