import { FacebookIcon, InstagramIcon, LinkedInIcon, WhatsAppIcon, YouTubeIcon } from "@/components/ui/Icons";
import { isSet, site, whatsappLink } from "@/content/site";

type Network = "YouTube" | "Instagram" | "Facebook" | "LinkedIn" | "WhatsApp";

/** Social icons. Profiles without a URL in src/content/site.ts are not shown. */
export function SocialLinks({
  tone = "dark",
  withLabels = false,
  exclude = [],
  className = "",
}: {
  tone?: "dark" | "light";
  withLabels?: boolean;
  exclude?: Network[];
  className?: string;
}) {
  const items = (
    [
      { name: "YouTube", href: site.social.youtube, Icon: YouTubeIcon },
      { name: "Instagram", href: site.social.instagram, Icon: InstagramIcon },
      { name: "Facebook", href: site.social.facebook, Icon: FacebookIcon },
      { name: "LinkedIn", href: site.social.linkedin, Icon: LinkedInIcon },
      { name: "WhatsApp", href: whatsappLink() ?? "", Icon: WhatsAppIcon },
    ] as { name: Network; href: string; Icon: typeof YouTubeIcon }[]
  ).filter((i) => isSet(i.href) && !exclude.includes(i.name));

  if (items.length === 0) return null;

  const text = tone === "dark" ? "text-cream/80 hover:text-gold" : "text-chocolate hover:text-gold-deep";
  const ring = tone === "dark" ? "border-cream/15 group-hover:border-gold" : "border-chocolate/15 group-hover:border-gold-deep";

  return (
    <ul className={`${withLabels ? "grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 lg:grid-cols-1" : "flex flex-wrap gap-2.5"} ${className}`}>
      {items.map(({ name, href, Icon }) => (
        <li key={name}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Build Smart on ${name} (opens in a new tab)`}
            className={`group inline-flex min-h-10 items-center gap-3 transition-colors ${text}`}
          >
            <span className={`grid size-10 shrink-0 place-items-center rounded-full border transition-colors ${ring}`}>
              <Icon className="size-[1.05rem]" />
            </span>
            {withLabels && <span className="text-sm">{name}</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}
