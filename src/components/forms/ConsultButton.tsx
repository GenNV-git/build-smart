"use client";

import { ArrowRight } from "lucide-react";
import { useConsultation } from "./ConsultationProvider";

/** Opens the consultation dialog. Falls back to /contact when JS is unavailable. */
export function ConsultButton({
  children = "Get a Free Consultation",
  className = "btn btn-gold",
  source = "cta",
  arrow = true,
}: {
  children?: React.ReactNode;
  className?: string;
  source?: string;
  arrow?: boolean;
}) {
  const { openConsultation } = useConsultation();
  return (
    <a
      href="/contact"
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        openConsultation(source);
      }}
      aria-haspopup="dialog"
    >
      {children}
      {arrow && <ArrowRight className="arrow size-4" aria-hidden="true" />}
    </a>
  );
}
