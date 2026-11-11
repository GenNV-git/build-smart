import { services } from "@/content/services";
import { site } from "@/content/site";

/** A slow, endless band of what Build Smart does. Words come from services.ts and the tagline in site.ts. */
export function ServiceMarquee() {
  const words = [...services.map((s) => s.title), site.tagline];
  const Row = ({ hidden = false }: { hidden?: boolean }) => (
    <ul className="marquee-row" aria-hidden={hidden || undefined}>
      {words.map((w, i) => (
        <li key={i} className={i % 2 ? "marquee-outline" : ""}>
          {w}
          <svg viewBox="0 0 24 24" className="marquee-star" aria-hidden="true">
            <path d="M12 1 L14.2 9.8 L23 12 L14.2 14.2 L12 23 L9.8 14.2 L1 12 L9.8 9.8 Z" fill="currentColor" />
          </svg>
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label="What we do" className="marquee bg-espresso py-5 text-cream sm:py-7">
      <div className="marquee-track">
        <Row />
        <Row hidden />
      </div>
    </section>
  );
}
