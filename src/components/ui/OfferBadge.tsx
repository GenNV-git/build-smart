import { Gift } from "lucide-react";
import { site } from "@/content/site";

/**
 * The consultation offer ("Free consultation worth ₹5,000") as a small gold badge.
 * Text and amount come from site.offer in src/content/site.ts — nothing shows when the offer is switched off.
 */
export function OfferBadge({ tone = "dark", className = "" }: { tone?: "dark" | "light"; className?: string }) {
  if (!site.offer.enabled) return null;
  const [before, after] = site.offer.label.split(site.offer.value);
  return (
    <p
      className={`offer-badge relative inline-flex w-fit items-center gap-2 overflow-hidden rounded-full border py-1.5 pl-2 pr-3.5 text-[0.72rem] font-semibold leading-tight sm:text-[0.78rem] ${
        tone === "dark" ? "border-gold/40 bg-gold/10 text-cream" : "border-gold-deep/30 bg-gold/15 text-espresso"
      } ${className}`}
    >
      <span className={`grid size-6 shrink-0 place-items-center rounded-full ${tone === "dark" ? "bg-gold text-espresso" : "bg-gold-deep text-ivory"}`}>
        <Gift className="size-3.5" strokeWidth={2} aria-hidden="true" />
      </span>
      <span>
        {after === undefined ? (
          site.offer.label
        ) : (
          <>
            {before}
            <span className={tone === "dark" ? "text-gold" : "text-gold-deep"}>{site.offer.value}</span>
            {after}
          </>
        )}
      </span>
    </p>
  );
}
