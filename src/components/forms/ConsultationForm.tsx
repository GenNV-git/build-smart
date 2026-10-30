"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Clock,
  LayoutGrid,
  Loader2,
  MapPin,
  MessageSquareText,
  Phone,
  ShieldCheck,
  User,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { leadSchema, type LeadFieldErrors } from "@/lib/lead-schema";
import { site, whatsappLink } from "@/content/site";
import { WhatsAppIcon } from "@/components/ui/Icons";

type Status = "idle" | "submitting" | "success" | "error";

type Values = {
  name: string;
  phone: string;
  projectType: string;
  location: string;
  budget: string;
  contactTime: string;
  message: string;
  consent: boolean;
  website: string;
};

const empty: Values = {
  name: "",
  phone: "",
  projectType: "",
  location: "",
  budget: "",
  contactTime: "",
  message: "",
  consent: false,
  website: "",
};

const fieldOrder: (keyof Values)[] = ["name", "phone", "projectType", "location", "budget", "contactTime", "message", "consent"];

export function ConsultationForm({
  variant = "full",
  source,
  title = "Let's Plan Your Dream Space",
  intro = "Share a few details and our team will get in touch for an initial consultation.",
  headingLevel = "h2",
  dense = false,
  headingClassName = "",
}: {
  /**
   * compact: hero card (core fields + message). full: every field, two-column on larger screens.
   * quick: the 4 required fields only (not used at the moment — the timed pop-up shows the full form).
   */
  variant?: "compact" | "full" | "quick";
  source: string;
  title?: string;
  intro?: string;
  headingLevel?: "h2" | "h3";
  /** Compact layout for the pop-up: tighter fields; on phones Budget + Best time sit side by side with short labels. */
  dense?: boolean;
  /** Extra classes for the heading + intro (e.g. "hidden lg:block" when the pop-up shows its own header). */
  headingClassName?: string;
}) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<LeadFieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const [submittedName, setSubmittedName] = useState("");
  const H = headingLevel;
  const full = variant === "full";
  const quick = variant === "quick";

  const id = (f: string) => `${uid}-${f}`;

  // Phones in dense mode: short option labels so Budget and Best time fit side by side (the saved values stay in full).
  const [narrow, setNarrow] = useState(false);
  const [tiny, setTiny] = useState(false); // phones narrower than 380px
  useEffect(() => {
    if (!dense) return;
    const mq = window.matchMedia("(max-width: 639px)");
    const mqTiny = window.matchMedia("(max-width: 379px)");
    const update = () => {
      setNarrow(mq.matches);
      setTiny(mqTiny.matches);
    };
    update();
    mq.addEventListener("change", update);
    mqTiny.addEventListener("change", update);
    return () => {
      mq.removeEventListener("change", update);
      mqTiny.removeEventListener("change", update);
    };
  }, [dense]);
  const pair = dense && narrow; // Budget + Best time on one row

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key as keyof LeadFieldErrors]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validateField(key: keyof Values) {
    const result = leadSchema.safeParse({ ...values, source });
    if (result.success) return;
    const issue = result.error.issues.find((i) => i.path[0] === key);
    // Only show an error on blur when the visitor has typed something.
    if (issue && values[key] !== "" && values[key] !== false) setErrors((e) => ({ ...e, [key]: issue.message }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    setServerError("");

    const payload = { ...values, source };
    const result = leadSchema.safeParse(payload);
    if (!result.success) {
      const next: LeadFieldErrors = {};
      for (const issue of result.error.issues) {
        const k = issue.path[0] as keyof LeadFieldErrors;
        if (k && !next[k]) next[k] = issue.message;
      }
      setErrors(next);
      const first = fieldOrder.find((k) => next[k as keyof LeadFieldErrors]);
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fieldErrors?: LeadFieldErrors };
      if (!res.ok || !data.ok) {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        setServerError(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      try {
        localStorage.setItem("bs-enquiry-sent", String(Date.now()));
      } catch {}
      setSubmittedName(values.name.trim().split(/\s+/)[0] || "");
      setValues(empty);
      setErrors({});
      setStatus("success");
    } catch {
      setServerError("We couldn't reach the server. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    const wa = whatsappLink();
    return (
      <div className="flex flex-col items-start py-4" role="status" aria-live="polite">
        <span className="grid size-14 place-items-center rounded-full bg-gold/15 text-gold-deep">
          <CheckCircle2 className="size-7" strokeWidth={1.6} />
        </span>
        <H className="mt-6 text-3xl text-espresso">Thank you{submittedName ? `, ${submittedName}` : ""}.</H>
        <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-muted">
          Your enquiry has reached the Build Smart team. We&apos;ll be in touch on the number you shared to arrange your
          consultation.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-sm">
              <WhatsAppIcon className="size-4" /> Chat on WhatsApp
            </a>
          )}
          <button type="button" className="btn btn-outline-dark btn-sm" onClick={() => setStatus("idle")}>
            Send another enquiry
          </button>
        </div>
      </div>
    );
  }

  const describedBy = (k: keyof LeadFieldErrors) => (errors[k] ? id(`${k}-error`) : undefined);

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-describedby={id("intro")} className={`relative ${dense ? "form-dense" : ""}`}>
      <div className={headingClassName}>
        <H className={`${quick ? "text-[1.6rem] sm:text-[1.85rem]" : "text-[1.75rem] sm:text-[2rem]"} pr-10 leading-tight text-espresso`}>{title}</H>
        <p id={id("intro")} className="mt-2 text-sm leading-relaxed text-muted">
          {intro}
        </p>
      </div>

      {status === "error" && serverError && (
        <div role="alert" className="mt-5 rounded-xl border border-[#b4532a]/30 bg-[#b4532a]/[0.06] px-4 py-3 text-sm text-[#8a3b1b]">
          {serverError}
        </div>
      )}

      <div
        className={`grid ${dense ? "mt-1 gap-2.5 sm:gap-3 lg:mt-6" : quick ? "mt-5 gap-3" : "mt-6 gap-3.5"} ${pair ? "grid-cols-2" : ""} ${full ? "sm:grid-cols-2" : ""}`}
      >
        <Field className={pair ? "col-span-2" : ""} id={id("name")} label="Full name" required icon={User} error={errors.name}>
          <input
            id={id("name")}
            name="name"
            type="text"
            autoComplete="name"
            className="field"
            placeholder="Full Name"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            onBlur={() => validateField("name")}
            aria-invalid={!!errors.name}
            aria-describedby={describedBy("name")}
            aria-required="true"
            maxLength={80}
          />
        </Field>

        <Field className={pair ? "col-span-2" : ""} id={id("phone")} label="Phone / WhatsApp number" required icon={Phone} error={errors.phone}>
          <input
            id={id("phone")}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className="field"
            placeholder="Phone / WhatsApp Number"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            onBlur={() => validateField("phone")}
            aria-invalid={!!errors.phone}
            aria-describedby={describedBy("phone")}
            aria-required="true"
            maxLength={20}
          />
        </Field>

        <Field className={pair ? "col-span-2" : ""} id={id("projectType")} label="Project type" required icon={LayoutGrid} error={errors.projectType} select>
          <select
            id={id("projectType")}
            name="projectType"
            className={`field pr-10 ${values.projectType ? "" : "text-[#8d8075]"}`}
            value={values.projectType}
            onChange={(e) => set("projectType", e.target.value)}
            aria-invalid={!!errors.projectType}
            aria-describedby={describedBy("projectType")}
            aria-required="true"
          >
            <option value="" disabled>
              Select Project Type
            </option>
            {site.form.projectTypes.map((o) => (
              <option key={o} value={o} className="text-ink">
                {o}
              </option>
            ))}
          </select>
        </Field>

        <Field className={pair ? "col-span-2" : ""} id={id("location")} label="City / project location" required icon={MapPin} error={errors.location}>
          <input
            id={id("location")}
            name="location"
            type="text"
            autoComplete="address-level2"
            className="field"
            placeholder="City / Location"
            value={values.location}
            onChange={(e) => set("location", e.target.value)}
            onBlur={() => validateField("location")}
            aria-invalid={!!errors.location}
            aria-describedby={describedBy("location")}
            aria-required="true"
            maxLength={80}
          />
        </Field>

        {full && (
          <>
            <Field id={id("budget")} label="Estimated budget (optional)" icon={Wallet} error={errors.budget} select>
              <select
                id={id("budget")}
                name="budget"
                className={`field pr-10 ${values.budget ? "" : "text-[#8d8075]"}`}
                value={values.budget}
                onChange={(e) => set("budget", e.target.value)}
                aria-invalid={!!errors.budget}
                aria-describedby={describedBy("budget")}
              >
                <option value="">{pair ? "Budget" : "Budget (optional)"}</option>
                {site.form.budgets.map((o) => (
                  <option key={o} value={o} className="text-ink">
                    {pair ? shortBudget(o) : o}
                  </option>
                ))}
              </select>
            </Field>
            <Field id={id("contactTime")} label="Preferred contact time (optional)" icon={Clock} error={errors.contactTime} select>
              <select
                id={id("contactTime")}
                name="contactTime"
                className={`field pr-10 ${values.contactTime ? "" : "text-[#8d8075]"}`}
                value={values.contactTime}
                onChange={(e) => set("contactTime", e.target.value)}
                aria-invalid={!!errors.contactTime}
                aria-describedby={describedBy("contactTime")}
              >
                <option value="">{pair ? (tiny ? "Time" : "Best time") : dense ? "Best time to call" : "Best Time to Call (optional)"}</option>
                {site.form.contactTimes.map((o) => (
                  <option key={o} value={o} className="text-ink">
                    {pair ? o.replace(/\s*\(.*\)$/, "") : o}
                  </option>
                ))}
              </select>
            </Field>
          </>
        )}

        {!quick && (
        <Field
          id={id("message")}
          label="Your message (optional)"
          icon={MessageSquareText}
          error={errors.message}
          className={`${pair ? "col-span-2" : ""} ${full ? "sm:col-span-2" : ""}`}
          textarea
        >
          <textarea
            id={id("message")}
            name="message"
            rows={dense ? 2 : full ? 4 : 3}
            className="field"
            placeholder="Your Message (Optional)"
            value={values.message}
            onChange={(e) => set("message", e.target.value)}
            aria-invalid={!!errors.message}
            aria-describedby={describedBy("message")}
            maxLength={1200}
          />
        </Field>
        )}
      </div>

      {/* Honeypot — hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this empty
          <input tabIndex={-1} autoComplete="off" name="website" value={values.website} onChange={(e) => set("website", e.target.value)} />
        </label>
      </div>

      <div className={dense ? "mt-3.5" : "mt-4"}>
        <label className={`flex cursor-pointer items-start gap-3 leading-relaxed text-muted ${dense ? "text-[0.74rem] sm:text-[0.8rem]" : "text-[0.8rem]"}`}>
          <input
            type="checkbox"
            name="consent"
            checked={values.consent}
            onChange={(e) => set("consent", e.target.checked)}
            aria-invalid={!!errors.consent}
            aria-describedby={describedBy("consent")}
            className="mt-0.5 size-4 shrink-0 accent-[#94702f]"
          />
          <span>
            {dense
              ? "I agree that Build Smart may call or WhatsApp me about this enquiry (see our "
              : "I agree that Build Smart may contact me by phone or WhatsApp about this enquiry. My details are used only for this purpose — see the "}
            <Link href="/privacy-policy" className="font-medium text-chocolate underline underline-offset-2 hover:text-gold-deep">
              Privacy Policy
            </Link>
            {dense ? ")." : "."}
          </span>
        </label>
        {errors.consent && (
          <p id={id("consent-error")} className="mt-1.5 pl-7 text-xs font-medium text-[#a2441f]">
            {errors.consent}
          </p>
        )}
      </div>

      <button type="submit" className={`btn btn-gold w-full ${dense ? "mt-4" : "mt-5"}`} disabled={status === "submitting"} aria-busy={status === "submitting"}>
        {status === "submitting" ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            Request a Consultation <ArrowRight className="arrow size-4" />
          </>
        )}
      </button>

      <p className={`flex items-center justify-center gap-1.5 text-center text-muted ${dense ? "mt-3 text-[0.68rem] sm:text-[0.72rem]" : "mt-3.5 text-[0.72rem]"}`}>
        <ShieldCheck className="size-3.5 shrink-0 text-[#4f8a55]" />
        {dense ? "Your details stay private — never shared." : "We respect your privacy. Your details are used only for your consultation."}
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  required,
  icon: Icon,
  error,
  children,
  className = "",
  select,
  textarea,
}: {
  id: string;
  label: string;
  required?: boolean;
  icon: LucideIcon;
  error?: string;
  children: React.ReactNode;
  className?: string;
  select?: boolean;
  textarea?: boolean;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="sr-only">
        {label}
        {required ? " (required)" : ""}
      </label>
      <div className="relative">
        <Icon
          className={`field-icon pointer-events-none absolute left-3.5 size-[1.05rem] text-chocolate/55 ${textarea ? "top-3.5" : "top-1/2 -translate-y-1/2"}`}
          strokeWidth={1.6}
          aria-hidden="true"
        />
        {children}
        {select && (
          <ChevronDown className="field-chevron pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-chocolate/60" aria-hidden="true" />
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 pl-1 text-xs font-medium text-[#a2441f]">
          {error}
        </p>
      )}
    </div>
  );
}

/** "₹50 Lakh – ₹1 Crore" → "₹50L–1Cr" for the narrow pop-up layout (only the label changes, not the saved value). */
function shortBudget(o: string): string {
  return o
    .replace(/\s*–\s*₹?/g, "–")
    .replace(/\s*Lakh/gi, "L")
    .replace(/\s*Crore/gi, "Cr")
    .replace(/Not sure yet/i, "Not sure");
}
