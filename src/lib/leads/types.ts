import type { Lead } from "@/lib/lead-schema";

type LeadFields = Omit<Lead, "website" | "consent">;

/** A sent enquiry. */
export type SubmittedLead = LeadFields & {
  id: string;
  createdAt: string;
  consentGiven: true;
  incomplete?: false;
};

/**
 * A form that was started (name + phone typed) but never sent. `id` is the form's draft id, so a later
 * submission from the same form completes the same row in the sheet instead of adding a second one.
 */
export type IncompleteLead = Pick<LeadFields, "name" | "phone"> &
  Partial<Omit<LeadFields, "name" | "phone" | "draftId">> & {
    id: string;
    createdAt: string;
    consentGiven: false;
    incomplete: true;
  };

export type LeadRecord = SubmittedLead | IncompleteLead;
