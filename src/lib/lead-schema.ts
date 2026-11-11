import { z } from "zod";
import { site } from "@/content/site";

/** Shared by the browser (instant feedback) and the server (source of truth). */

const phonePattern = /^\+?[0-9\s\-()]{8,20}$/;
const digitCount = (v: string) => v.replace(/\D/g, "").length;

const optionalChoice = (options: readonly string[]) =>
  z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : undefined))
    .refine((v) => v === undefined || options.includes(v), { message: "Please choose one of the options." });

export const leadSchema = z.object({
  name: z
    .string({ message: "Please enter your name." })
    .trim()
    .min(2, "Please enter your full name.")
    .max(80, "Name is too long."),
  phone: z
    .string({ message: "Please enter a phone or WhatsApp number." })
    .trim()
    .regex(phonePattern, "Please enter a valid phone number.")
    .refine((v) => digitCount(v) >= 10 && digitCount(v) <= 15, "Please enter a valid phone number."),
  projectType: z
    .string({ message: "Please choose a project type." })
    .trim()
    .refine((v) => (site.form.projectTypes as readonly string[]).includes(v), "Please choose a project type."),
  location: z
    .string({ message: "Please enter your city or project location." })
    .trim()
    .min(2, "Please enter your city or project location.")
    .max(80, "Location is too long."),
  budget: optionalChoice(site.form.budgets),
  contactTime: optionalChoice(site.form.contactTimes),
  message: z
    .string()
    .trim()
    .max(1200, "Please keep your message under 1200 characters.")
    .optional()
    .transform((v) => (v ? v : undefined)),
  consent: z.literal(true, { message: "Please agree so we can contact you about your enquiry." }),
  /** Where the form was submitted from (e.g. "home-hero", "contact-page"). */
  source: z.string().trim().max(40).optional(),
  /** Links this enquiry to a "not submitted" row saved earlier from the same form (see incompleteLeadSchema). */
  draftId: z.string().uuid().optional(),
  /** Honeypot — real visitors never see or fill this field. */
  website: z.string().max(0).optional(),
});

/** true when a name and a usable phone number have been typed — the minimum worth saving. */
export function hasNameAndPhone(v: { name?: string; phone?: string }): boolean {
  const name = (v.name || "").trim();
  const phone = (v.phone || "").trim();
  return name.length >= 2 && name.length <= 80 && phonePattern.test(phone) && digitCount(phone) >= 10 && digitCount(phone) <= 15;
}

/** Keeps a value only when it is one of the allowed options (anything else becomes empty). */
const looseChoice = (options: readonly string[]) =>
  z
    .string()
    .optional()
    .transform((v) => (v && options.includes(v.trim()) ? v.trim() : undefined));

/**
 * A form that was started but not sent: name + phone are required, everything else is kept if it is valid.
 * Saved to the sheet marked "Not submitted" (switch: site.form.saveIncomplete).
 */
export const incompleteLeadSchema = z.object({
  draftId: z.string().uuid(),
  name: z.string().trim().min(2).max(80),
  phone: z
    .string()
    .trim()
    .regex(phonePattern)
    .refine((v) => digitCount(v) >= 10 && digitCount(v) <= 15),
  projectType: looseChoice(site.form.projectTypes),
  location: z
    .string()
    .optional()
    .transform((v) => (v && v.trim().length >= 2 ? v.trim().slice(0, 80) : undefined)),
  budget: looseChoice(site.form.budgets),
  contactTime: looseChoice(site.form.contactTimes),
  message: z
    .string()
    .optional()
    .transform((v) => (v && v.trim() ? v.trim().slice(0, 1200) : undefined)),
  source: z.string().trim().max(40).optional(),
  website: z.string().max(0).optional(),
});

export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;
export type LeadFieldErrors = Partial<Record<keyof Lead, string>>;

export function fieldErrorsFrom(error: z.ZodError): LeadFieldErrors {
  const out: LeadFieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof Lead | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
