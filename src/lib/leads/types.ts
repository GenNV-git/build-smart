import type { Lead } from "@/lib/lead-schema";

export type LeadRecord = Omit<Lead, "website" | "consent"> & {
  id: string;
  createdAt: string;
  consentGiven: true;
};
