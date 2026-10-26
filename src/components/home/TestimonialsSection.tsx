import { SectionHeading } from "@/components/ui/SectionHeading";
import { TestimonialCard } from "@/components/video/TestimonialCard";
import { DevNote } from "@/components/ui/DevNote";
import { testimonials } from "@/content/testimonials";

export function TestimonialsSection() {
  if (testimonials.length === 0) return null;
  const pending = testimonials.some((t) => !t.videoUrl);
  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="py-16 sm:py-24 lg:py-28">
      <div className="container-lux">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <SectionHeading id="testimonials-title" eyebrow="Client Testimonials" title="What Our Clients Say" />
          <p className="max-w-sm text-[0.95rem] leading-relaxed text-muted lg:justify-self-end lg:pb-2" data-reveal>
            Real homeowners, in their own words — about the experience of building with us.
          </p>
        </div>
        {pending && (
          <DevNote className="mt-6">Add YouTube testimonial links (and exact quotes, if supplied) in src/content/testimonials.ts</DevNote>
        )}
        {/* Phones: swipeable cards. Larger screens: grid. */}
        <ul
          className={`no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-4 sm:mt-12 md:mx-0 md:grid md:overflow-visible md:px-0 md:pb-0 ${
            testimonials.length >= 3 ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2"
          } md:gap-5`}
        >
          {testimonials.map((t) => (
            <li key={t.id} className={`shrink-0 snap-start md:w-auto ${testimonials.length > 1 ? "w-[86%]" : "w-full"}`}>
              <TestimonialCard t={t} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
