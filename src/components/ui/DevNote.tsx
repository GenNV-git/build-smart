import { showContentNotes } from "@/lib/dev";

/**
 * Editor hint, visible only in development (or with NEXT_PUBLIC_SHOW_CONTENT_NOTES=true).
 * Points at the exact file to edit. Never rendered for real visitors.
 */
export function DevNote({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  if (!showContentNotes) return null;
  return (
    <p
      className={`inline-flex items-start gap-2 rounded-md border border-dashed border-amber-500/60 bg-amber-50/90 px-2.5 py-1.5 font-mono text-[11px] leading-snug text-amber-900 ${className}`}
    >
      <span aria-hidden="true">✎</span>
      <span>{children}</span>
    </p>
  );
}

/** Small corner tag on temporary images (development only). */
export function TempImageTag() {
  if (!showContentNotes) return null;
  return (
    <span className="pointer-events-none absolute left-2 top-2 z-10 rounded bg-amber-400/90 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-amber-950">
      temp image
    </span>
  );
}
