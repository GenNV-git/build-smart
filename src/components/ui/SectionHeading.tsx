export function SectionHeading({
  eyebrow,
  title,
  accent,
  intro,
  tone = "light",
  align = "left",
  as: Tag = "h2",
  className = "",
  id,
}: {
  eyebrow?: string;
  title: string;
  /** Optional second line rendered in gold. */
  accent?: string;
  intro?: React.ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
  id?: string;
}) {
  const dark = tone === "dark";
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-2xl ${className}`} data-reveal>
      {eyebrow && <p className={`eyebrow ${dark ? "eyebrow-light" : ""}`}>{eyebrow}</p>}
      <Tag
        id={id}
        className={`mt-4 text-[2.35rem] leading-[1.05] sm:text-5xl lg:text-[3.4rem] ${dark ? "text-cream" : "text-espresso"}`}
      >
        {title}
        {accent && (
          <>
            {" "}
            <span className={`block ${dark ? "text-gold" : "text-gold-deep"}`}>{accent}</span>
          </>
        )}
      </Tag>
      {intro && (
        <div className={`mt-5 text-[0.98rem] leading-relaxed ${dark ? "text-cream/75" : "text-muted"}`}>{intro}</div>
      )}
    </div>
  );
}
