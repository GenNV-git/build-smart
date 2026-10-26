import Image from "@/components/ui/Image";

/** Cinematic dark banner used at the top of inner pages. */
export function PageHero({
  eyebrow,
  title,
  accent,
  intro,
  image,
  children,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  intro?: string;
  image: { src: string; alt: string; position?: string };
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-espresso pb-20 pt-36 text-cream sm:pb-24 sm:pt-44">
      <Image src={image.src} alt={image.alt} fill priority sizes="100vw" className="-z-20 object-cover opacity-55" style={{ objectPosition: image.position || "50% 50%" }} />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(25_22_19/0.94)_0%,rgb(36_23_15/0.82)_45%,rgb(36_23_15/0.45)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-b from-transparent to-espresso/60" />
      <div className="container-lux">
        <div className="max-w-3xl" data-reveal>
          <p className="eyebrow eyebrow-light">{eyebrow}</p>
          <h1 className="mt-5 text-[2.8rem] leading-[1.02] sm:text-6xl lg:text-7xl">
            {title}
            {accent && <span className="block text-gold">{accent}</span>}
          </h1>
          {intro && <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/75 sm:text-lg">{intro}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
