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
  /** Honeypot — real visitors never see or fill this field. */
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
