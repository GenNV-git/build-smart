import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <section className="grid min-h-[80svh] place-items-center bg-espresso px-5 pt-24 text-center text-cream">
      <div>
        <p className="font-display text-[7rem] leading-none text-gold/40">404</p>
        <h1 className="mt-2 text-4xl sm:text-5xl">This room hasn&apos;t been built yet.</h1>
        <p className="mx-auto mt-4 max-w-md text-cream/70">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-gold">
            Back to Home <ArrowRight className="arrow size-4" />
          </Link>
          <Link href="/projects" className="btn btn-outline-light">
            View Projects
          </Link>
        </div>
      </div>
    </section>
  );
}
