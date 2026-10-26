import { InstagramIcon, YouTubeIcon } from "@/components/ui/Icons";
import { isSet, site } from "@/content/site";

/** Links to Sanjay's own creator profiles (Instagram + YouTube). */
export function FollowSanjay({ tone = "dark", className = "", label = true }: { tone?: "dark" | "light"; className?: string; label?: boolean }) {
  const { instagram, instagramHandle, youtube } = site.founderSocial;
  if (!isSet(instagram) && !isSet(youtube)) return null;
  const pill =
    tone === "dark"
      ? "border-cream/20 bg-cream/5 text-cream hover:border-gold hover:text-gold"
      : "border-chocolate/15 bg-white text-espresso hover:border-gold-deep hover:text-gold-deep";
  return (
    <div className={className}>
      {label && (
        <p className={`text-[0.65rem] font-semibold uppercase tracking-[0.22em] ${tone === "dark" ? "text-cream/50" : "text-chocolate/60"}`}>
          Follow Sanjay
        </p>
      )}
      <ul className={`flex flex-wrap gap-2.5 ${label ? "mt-3" : ""}`}>
        {isSet(instagram) && (
          <li>
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors ${pill}`}
              aria-label={`Sanjay on Instagram, ${instagramHandle} (opens in a new tab)`}
            >
              <InstagramIcon className="size-4" /> {instagramHandle}
            </a>
          </li>
        )}
        {isSet(youtube) && (
          <li>
            <a
              href={youtube}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors ${pill}`}
              aria-label="Sanjay on YouTube (opens in a new tab)"
            >
              <YouTubeIcon className="size-4" /> YouTube
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}
