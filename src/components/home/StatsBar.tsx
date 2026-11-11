import { BadgeCheck, Home, MessagesSquare, Workflow } from "lucide-react";

/** Trust highlights — qualities, not numbers. No invented statistics. */
export function StatsBar() {
  const items = [
    { icon: Home, value: "Turnkey", label: "Homes, start to finish" },
    { icon: MessagesSquare, value: "Client-First", label: "Clear updates, every stage" },
    { icon: BadgeCheck, value: "Premium", label: "Quality Materials" },
    { icon: Workflow, value: "End to End", label: "Design to Handover" },
  ];
  return (
    <section aria-label="Why Build Smart" className="relative z-10 -mt-20 lg:-mt-24">
      <div className="container-lux">
        <ul className="glass-light grid grid-cols-2 rounded-[1.4rem] lg:grid-cols-4" data-reveal>
          {items.map(({ icon: Icon, value, label }, i) => (
            <li
              key={label}
              className={`flex flex-col items-start gap-3 px-4 py-5 sm:flex-row sm:items-center sm:gap-4 sm:px-7 sm:py-7 ${i % 2 === 1 ? "border-l border-chocolate/10" : ""} ${
                i >= 2 ? "border-t border-chocolate/10 lg:border-t-0" : ""
              } ${i === 2 ? "lg:border-l" : ""}`}
            >
              <span className="icon-draw shrink-0" style={{ ["--icon-delay" as string]: `${i * 140}ms` }}>
                <Icon className="size-6 text-chocolate sm:size-8" strokeWidth={1.25} aria-hidden="true" />
              </span>
              <p>
                <span className="block font-display text-[1.4rem] font-semibold leading-none text-espresso sm:text-[1.85rem]">{value}</span>
                <span className="mt-1 block text-xs text-muted">{label}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
