import { DevNote } from "./DevNote";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <section className="bg-espresso pb-16 pt-36 text-cream sm:pt-44">
        <div className="container-lux max-w-3xl">
          <p className="eyebrow eyebrow-light">Legal</p>
          <h1 className="mt-4 text-5xl sm:text-6xl">{title}</h1>
          <p className="mt-4 text-sm text-cream/60">Last updated: {updated}</p>
        </div>
      </section>
      <article className="container-lux prose-lux max-w-3xl py-16 text-[0.97rem] text-ink sm:py-20">
        <DevNote className="mb-8">Template text — have it reviewed and add the registered business name and contact details before launch.</DevNote>
        {children}
      </article>
    </>
  );
}
